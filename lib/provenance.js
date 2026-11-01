/**
 * Provenance: a hash-chained record of what a run did.
 *
 * Every function here is immutable — it returns a new object rather than mutating the
 * one passed in. That is deliberate: a mutable audit record can be edited in place by
 * any caller, which defeats the point of chaining it.
 */
import { createHash } from 'node:crypto'

export const PROVENANCE_SCHEMA_VERSION = 2
export const MAX_ARTIFACTS = 200
export const MAX_EXECUTIONS = 500

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

function record(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label} must be a plain object`)
}

function requiredText(value, label, max = 4096) {
  if (typeof value !== 'string' || !value || value.length > max) throw new TypeError(`${label} must be a non-empty string of at most ${max} characters`)
  return value
}

function clone(value, label = 'value') {
  try { return JSON.parse(JSON.stringify(value)) } catch { throw new TypeError(`${label} must be JSON-serialisable`) }
}

export function stableStringify(value) { return JSON.stringify(clone(value)) }

export function sha256(value) {
  const bytes = typeof value === 'string' || value instanceof Uint8Array ? value : stableStringify(value)
  return createHash('sha256').update(bytes).digest('hex')
}

function normalizeChecksum(value, label = 'checksum') {
  record(value, label)
  if (!['sha256', 'sha512'].includes(value.algorithm) || typeof value.value !== 'string') {
    throw new TypeError(`${label} must contain a supported algorithm and digest`)
  }
  const length = value.algorithm === 'sha256' ? 64 : 128
  if (value.value.length !== length || !/^[a-f0-9]+$/.test(value.value)) throw new TypeError(`${label} is invalid`)
  return Object.freeze({ algorithm: value.algorithm, value: value.value })
}

function safeDetails(value, label = 'details') {
  const copied = clone(value, label)
  if (Buffer.byteLength(JSON.stringify(copied), 'utf8') > 16384) throw new TypeError(`${label} is too large`)
  return copied
}

function summarizeInputs(inputs, { sensitive = false } = {}) {
  record(inputs, 'inputs')
  const fields = {}
  for (const [name, value] of Object.entries(inputs)) {
    const text = typeof value === 'string' ? value : JSON.stringify(value ?? '')
    fields[name] = { bytes: Buffer.byteLength(text, 'utf8'), sha256: sha256(text), ...(sensitive ? { redacted: true } : {}) }
  }
  return Object.freeze({ schemaVersion: 1, sensitive: sensitive === true, fields: Object.freeze(fields) })
}

export function createArtifactManifest(spec) {
  record(spec, 'artifact')
  const path = requiredText(spec.path, 'artifact.path', 4096)
  const label = requiredText(spec.label ?? path.split(/[\\/]/).pop() ?? 'artifact', 'artifact.label', 200)
  const bytes = Number.isFinite(spec.bytes) ? spec.bytes : 0
  const checksum = normalizeChecksum(spec.checksum, 'artifact.checksum')
  const version = requiredText(spec.version ?? 'v1', 'artifact.version', 4096)
  return Object.freeze({ path, label, bytes, checksum, version, verified: spec.verified !== false })
}

function eventHash(event) { return sha256(event) }

export function createProvenance({ runId, sessionId, templateId, preset, inputs, sensitive = false, now = new Date().toISOString() }) {
  for (const [value, label] of [[runId, 'runId'], [sessionId, 'sessionId'], [templateId, 'templateId']]) requiredText(value, label, 200)
  requiredText(preset ?? '', 'preset', 120)
  requiredText(now, 'now', 80)
  if (!Number.isFinite(Date.parse(now))) throw new TypeError('now must be an ISO date')
  const base = {
    schemaVersion: PROVENANCE_SCHEMA_VERSION,
    runId, sessionId, templateId, preset: preset ?? '',
    createdAt: now,
    inputManifest: summarizeInputs(inputs ?? {}, { sensitive }),
    executions: [], artifacts: [], audit: [],
  }
  return appendAudit(base, { type: 'workflow-created', at: now, actor: 'system', details: { templateId, preset: preset ?? '' } })
}

export function appendAudit(provenance, event) {
  record(provenance, 'provenance')
  record(event, 'event')
  const audit = Array.isArray(provenance.audit) ? provenance.audit : []
  const body = {
    eventId: String(audit.length + 1),
    type: requiredText(event.type, 'audit.type', 80),
    at: requiredText(event.at ?? new Date().toISOString(), 'audit.at', 80),
    actor: requiredText(event.actor ?? 'system', 'audit.actor', 120),
    ...(event.details === undefined ? {} : { details: safeDetails(event.details, 'audit.details') }),
    previousHash: audit.at(-1)?.eventHash ?? null,
  }
  const next = Object.freeze({ ...body, eventHash: eventHash(body) })
  return Object.freeze({ ...provenance, audit: Object.freeze([...audit, next]) })
}

export function recordArtifact(provenance, artifact, event = {}) {
  const item = createArtifactManifest(artifact)
  const artifacts = Array.isArray(provenance.artifacts) ? provenance.artifacts : []
  if (artifacts.length >= MAX_ARTIFACTS) throw new TypeError('provenance artifact list is full')
  const duplicate = artifacts.find(existing => existing.path === item.path && existing.version === item.version)
  const next = duplicate ? provenance : { ...provenance, artifacts: Object.freeze([...artifacts, item]) }
  return appendAudit(next, {
    ...event,
    type: event.type ?? 'artifact-observed',
    at: event.at ?? new Date().toISOString(),
    actor: event.actor ?? 'system',
    details: {
      ...(event.details ?? {}),
      path: item.path,
      version: item.version,
      sha256: item.checksum.value,
      bytes: item.bytes,
      verified: item.verified,
    },
  })
}

export function recordExecution(provenance, execution, event = {}) {
  record(execution, 'execution')
  const executions = Array.isArray(provenance.executions) ? provenance.executions : []
  if (executions.length >= MAX_EXECUTIONS) throw new TypeError('provenance execution list is full')
  const item = Object.freeze({
    executionId: String(executions.length + 1),
    tool: requiredText(execution.tool, 'execution.tool', 200),
    status: ['running', 'completed', 'failed', 'cancelled'].includes(execution.status) ? execution.status : 'completed',
    startedAt: requiredText(execution.startedAt ?? new Date().toISOString(), 'execution.startedAt', 80),
    ...(execution.completedAt === undefined ? {} : { completedAt: requiredText(execution.completedAt, 'execution.completedAt', 80) }),
    verified: execution.verified === true,
    outputs: Object.freeze((execution.outputs ?? []).map((item, index) => createArtifactManifest({ ...item, label: item.label ?? 'output-' + (index + 1) }))),
  })
  const next = { ...provenance, executions: Object.freeze([...executions, item]) }
  return appendAudit(next, {
    ...event,
    type: event.type ?? 'execution-recorded',
    at: event.at ?? item.completedAt ?? item.startedAt,
    actor: event.actor ?? 'agent',
    details: { ...(event.details ?? {}), executionId: item.executionId, tool: item.tool, status: item.status, verified: item.verified },
  })
}

export function setDecisionGate(provenance, { decision, reason, actor, at = new Date().toISOString() }) {
  if (!['pending', 'accepted', 'rejected', 'needs-revision'].includes(decision)) throw new TypeError('decision is invalid')
  const gate = Object.freeze({
    decision,
    reason: typeof reason === 'string' ? reason.slice(0, 2000) : '',
    actor: typeof actor === 'string' ? actor.slice(0, 200) : 'human-user (identity not verified)',
    at,
    clinicalUse: 'not-authorized',
  })
  return appendAudit({ ...provenance, decisionGate: gate }, { type: 'decision-' + decision, at, actor: gate.actor, details: { reason: gate.reason } })
}

/**
 * Verify the chain and cross-check both directions.
 *
 * Editing a hash, editing a recorded digest, or deleting a registered artifact each
 * break this. The cross-check matters: without it, deleting an artifact together with
 * the event that recorded it would look like a shorter but valid chain.
 */
export function verifyProvenance(provenance) {
  try {
    record(provenance, 'provenance')
    const audit = Array.isArray(provenance.audit) ? provenance.audit : null
    if (!audit || !audit.length) return false
    let previous = null
    for (const entry of audit) {
      if (entry.previousHash !== previous) return false
      const body = { eventId: entry.eventId, type: entry.type, at: entry.at, actor: entry.actor }
      if (entry.details !== undefined) body.details = entry.details
      body.previousHash = entry.previousHash
      if (eventHash(body) !== entry.eventHash) return false
      previous = entry.eventHash
    }
    // Every registered artifact must be backed by an event, and every artifact event by
    // a registered artifact.
    const artifactEvents = audit.filter(entry => entry.type === 'artifact-observed')
    const registered = Array.isArray(provenance.artifacts) ? provenance.artifacts : []
    if (artifactEvents.length !== registered.length) return false
    for (const artifact of registered) {
      const matched = artifactEvents.some(entry =>
        entry.details?.path === artifact.path &&
        entry.details?.sha256 === artifact.checksum.value &&
        entry.details?.bytes === artifact.bytes &&
        entry.details?.version === artifact.version)
      if (!matched) return false
    }
    const executionEvents = audit.filter(entry => entry.type === 'execution-recorded')
    const executions = Array.isArray(provenance.executions) ? provenance.executions : []
    if (executionEvents.length !== executions.length) return false
    return true
  } catch { return false }
}
