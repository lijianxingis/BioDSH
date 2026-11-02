/**
 * Read an engine's own run log (a Nextflow trace) and turn it into execution records.
 *
 * These records are `verified: false` and marked `provenance: 'engine-reported'`. The
 * engine said it ran something; this workbench did not watch it happen. Reporting them
 * as host-verified would be a claim the host cannot support.
 */

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

/** Split one line on tabs, honouring quoted fields. */
function splitFields(line) {
  const fields = []
  let current = ''
  let quoted = false
  for (const char of line) {
    if (quoted) {
      if (char === '"') quoted = false
      else current += char
      continue
    }
    if (char === '"') { quoted = true; continue }
    if (char === '\t') { fields.push(current); current = ''; continue }
    current += char
  }
  fields.push(current)
  return fields
}

/**
 * Parse a Nextflow trace.
 *
 * The first line is the header, which names the columns; a parser that assumes fixed
 * positions breaks as soon as the engine adds a column.
 */
export function parseNextflowTrace(text, { limit = 5000 } = {}) {
  if (typeof text !== 'string') fail('INVALID_TRACE', 'the trace must be a string')
  const lines = text.split(/\r?\n/).filter(line => line.trim())
  if (!lines.length) fail('INVALID_TRACE', 'the trace is empty')
  const header = splitFields(lines[0]).map(name => name.trim().toLowerCase())
  const indexOf = name => header.indexOf(name)
  const has = name => indexOf(name) !== -1
  if (!has('task_id') && !has('name')) {
    fail('INVALID_TRACE', 'the header names neither task_id nor name; this does not look like a trace')
  }
  const records = []
  for (const line of lines.slice(1)) {
    if (records.length >= limit) break
    const fields = splitFields(line)
    const get = name => (has(name) ? fields[indexOf(name)]?.trim() ?? '' : '')
    const status = get('status') || get('exit')
    records.push(Object.freeze({
      taskId: get('task_id') || get('name'),
      name: get('name'),
      status: /^(COMPLETED|CACHED)$/i.test(status) ? 'completed' : /^ABORTED$/i.test(status) ? 'cancelled' : 'failed',
      exitCode: Number.isFinite(Number(get('exit'))) && get('exit') !== '' ? Number(get('exit')) : null,
      startedAt: get('start') || get('submit') || undefined,
      completedAt: get('complete') || undefined,
      realtime: get('realtime') || undefined,
    }))
  }
  return Object.freeze(records)
}

/**
 * Turn parsed rows into execution records.
 *
 * A timestamp with no zone is assumed UTC and says so, rather than silently shifting by
 * the local offset.
 */
export function toExecutionRecords(records, { limit = 500 } = {}) {
  if (!Array.isArray(records)) fail('INVALID_TRACE', 'records must be an array')
  return Object.freeze(records.slice(0, limit).map(record => {
    const raw = record.startedAt
    const hasZone = typeof raw === 'string' && /(Z|[+-]\d{2}:?\d{2})$/.test(raw)
    return Object.freeze({
      tool: 'nextflow',
      taskId: record.taskId,
      status: record.status,
      ...(raw ? { startedAt: raw } : {}),
      ...(record.completedAt ? { completedAt: record.completedAt } : {}),
      ...(raw && !hasZone ? { submittedTimeZone: 'assumed-utc' } : {}),
      // The engine reported this; the host did not observe it.
      verified: false,
      provenance: 'engine-reported',
    })
  }))
}

/** Answers whether a text looks like a trace at all, without parsing it. */
export function detectAdapter(text) {
  if (typeof text !== 'string') return undefined
  const first = text.split(/\r?\n/, 1)[0].toLowerCase()
  if (first.includes('task_id') && first.includes('status')) return { id: 'nextflow', label: 'Nextflow trace' }
  return undefined
}
