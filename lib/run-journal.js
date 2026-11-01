/**
 * Append-only run journal.
 *
 * The journal is what makes a restart possible: it is written one JSON object per line
 * and never rewritten, so a crash leaves a complete prefix plus at most one partial
 * line. A gap in the sequence numbers is treated as real data loss rather than skipped,
 * because skipping it would produce a replayed state that is quietly wrong.
 */
import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export const MAX_ENTRIES = 20000

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

export async function createJournal(path, { startSeq = 1 } = {}) {
  await mkdir(dirname(path), { recursive: true }).catch(() => {})
  let seq = startSeq
  return Object.freeze({
    get nextSeq() { return seq },
    async append(type, payload = {}) {
      if (seq > MAX_ENTRIES) fail('JOURNAL_FULL', 'the journal has reached its entry limit')
      const entry = { seq, type, at: new Date().toISOString(), ...payload }
      await appendFile(path, JSON.stringify(entry) + '\n', 'utf8')
      seq += 1
      return entry
    },
  })
}

export async function readJournal(path) {
  const text = await readFile(path, 'utf8').catch(error => {
    if (error?.code === 'ENOENT') return ''
    throw error
  })
  const lines = text.split('\n')
  const entries = []
  let truncatedTail = false
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    if (!line) continue
    try {
      const entry = JSON.parse(line)
      if (typeof entry?.seq !== 'number' || typeof entry?.type !== 'string') {
        fail('INVALID_JOURNAL', 'an entry must carry a numeric seq and a string type')
      }
      entries.push(entry)
    } catch (error) {
      // Only the final line may be incomplete: that is a crash mid-write. A malformed
      // line anywhere else means the file was edited, which is not recoverable.
      if (index === lines.length - 1 || (index === lines.length - 2 && lines[lines.length - 1] === '')) {
        truncatedTail = true
        continue
      }
      fail('INVALID_JOURNAL', 'a line in the middle of the journal is not valid JSON')
    }
  }
  // A gap means entries were lost; replaying across it would invent state.
  let valid = true
  for (let index = 1; index < entries.length; index++) {
    if (entries[index].seq !== entries[index - 1].seq + 1) valid = false
  }
  return Object.freeze({ entries: Object.freeze(entries), truncatedTail, valid })
}

/**
 * Rebuild the state of a run from its journal.
 *
 * A step's outcome is whatever its latest terminal event says. Leaving an earlier
 * failure in place would make a step appear both finished and broken, and a resume would
 * then refuse to reuse a result that is actually valid.
 */
export function replayJournal(entries) {
  if (!Array.isArray(entries)) fail('INVALID_JOURNAL', 'entries must be an array.')
  const completed = new Map()
  const failed = new Map()
  const skipped = new Map()
  const quarantined = new Map()
  const attempts = new Map()
  let started = false
  let finished = null
  let outstanding = []

  for (const entry of entries) {
    switch (entry.type) {
      case 'run-started': started = true; break
      case 'step-dispatched': {
        const id = entry.stepId
        if (typeof id !== 'string') break
        attempts.set(id, (attempts.get(id) ?? 0) + 1)
        outstanding.push(id)
        break
      }
      case 'step-completed': {
        if (typeof entry.stepId !== 'string') break
        failed.delete(entry.stepId)
        skipped.delete(entry.stepId)
        completed.set(entry.stepId, entry)
        outstanding = outstanding.filter(id => id !== entry.stepId)
        break
      }
      case 'step-failed': {
        if (typeof entry.stepId !== 'string') break
        completed.delete(entry.stepId)
        failed.set(entry.stepId, entry)
        outstanding = outstanding.filter(id => id !== entry.stepId)
        break
      }
      case 'step-skipped': {
        if (typeof entry.stepId !== 'string') break
        skipped.set(entry.stepId, entry)
        outstanding = outstanding.filter(id => id !== entry.stepId)
        break
      }
      case 'worker-quarantined': {
        if (typeof entry.workerId === 'string') quarantined.set(entry.workerId, entry.reason ?? 'quarantined')
        break
      }
      case 'run-finished': finished = entry; break
      default: break
    }
  }

  return Object.freeze({
    started,
    finished,
    completed: Object.freeze(Object.fromEntries(completed)),
    failed: Object.freeze(Object.fromEntries(failed)),
    skipped: Object.freeze(Object.fromEntries(skipped)),
    quarantined: Object.freeze(Object.fromEntries(quarantined)),
    attempts: Object.freeze(Object.fromEntries(attempts)),
    outstanding: Object.freeze(outstanding),
  })
}
