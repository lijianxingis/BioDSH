/**
 * Crash recovery.
 *
 * The engine already resumes across runs by fingerprinting completed steps. That covers
 * a clean restart. It does not cover a process killed while a step was running: the
 * journal has a dispatch with no outcome, and the next start has to decide what that means.
 *
 * The decision this module makes: an interrupted step is re-run, because a half-written
 * artifact must not be reused. A step whose outcome was journalled is trusted only if its
 * recorded artifacts still hash to what was recorded.
 */
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { readJournal, replayJournal } from './run-journal.js'

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

/**
 * Work out where a previous attempt stopped.
 *
 * @returns {{resumable: boolean, completed: string[], interrupted: string[], reason?: string}}
 */
export async function inspectCheckpoint({ journalPath, workspace }) {
  const journal = await readJournal(journalPath).catch(() => ({ entries: [], truncatedTail: false, valid: false }))

  if (!journal.entries.length) {
    return { resumable: false, completed: [], interrupted: [], reason: 'no journal entries' }
  }
  if (journal.valid === false) {
    // A gap in the sequence numbers is real data loss. Replaying across it would invent
    // state that never existed.
    return { resumable: false, completed: [], interrupted: [], reason: 'the journal has a gap in its sequence numbers' }
  }

  const state = replayJournal(journal.entries)
  const completed = Object.keys(state.completed)
  const interrupted = state.outstanding.filter(id => !state.completed[id])

  // A completed step is only trustworthy if its artifacts still match what was recorded.
  const mismatched = []
  for (const entry of Object.values(state.completed)) {
    for (const artifact of entry.artifacts ?? []) {
      try {
        const buffer = await readFile(join(workspace, artifact.path))
        if (sha256(buffer) !== artifact.digest) mismatched.push(artifact.path)
      } catch {
        mismatched.push(artifact.path)
      }
    }
  }

  const trusted = completed.filter(id => {
    const entry = state.completed[id]
    return (entry.artifacts ?? []).every(artifact => !mismatched.includes(artifact.path))
  })

  return {
    resumable: true,
    completed: trusted,
    interrupted,
    ...(mismatched.length ? { artifactsMismatched: mismatched } : {}),
    ...(journal.truncatedTail ? { truncatedTail: true } : {}),
    reason: interrupted.length
      ? 'a step was running when the process stopped; it will run again'
      : 'every dispatched step has an outcome',
  }
}

/**
 * Build the resume instruction the engine consumes.
 *
 * Only steps that are both completed and still have their artifacts are marked completed,
 * so nothing half-written is reused.
 */
export function resumePlan({ previous, inspection }) {
  if (!inspection?.resumable) return previous
  const keep = new Set(inspection.completed)
  const steps = (previous?.steps ?? []).map(step => (
    keep.has(step.id) ? step : { ...step, status: 'pending' }
  ))
  return { ...previous, steps }
}
