import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createProvenance, appendAudit, recordArtifact, verifyProvenance, setDecisionGate } from './provenance.js'

const sha = s => createHash('sha256').update(s).digest('hex')
const thaw = o => JSON.parse(JSON.stringify(o))
const mk = () => createProvenance({ runId: 'r1', sessionId: 's1', templateId: 'tpl', preset: 'research', inputs: {}, now: '2026-01-01T00:00:00Z' })
const art = (path, value) => ({ path, label: path, bytes: 3, version: 'v1', checksum: { algorithm: 'sha256', value } })

test('an untouched chain verifies', () => {
  assert.equal(verifyProvenance(mk()), true)
})

test('appending keeps the chain valid', () => {
  let p = mk()
  p = appendAudit(p, { type: 'step', at: '2026-01-01T00:00:01Z', actor: 'system', details: { a: 1 } })
  p = appendAudit(p, { type: 'step', at: '2026-01-01T00:00:02Z', actor: 'system', details: { a: 2 } })
  assert.equal(verifyProvenance(p), true)
})

test('editing one audit entry breaks the chain', () => {
  let p = mk()
  p = appendAudit(p, { type: 'step', at: '2026-01-01T00:00:01Z', actor: 'system', details: { a: 1 } })
  const t = thaw(p)
  t.audit[1].details.a = 99
  assert.equal(verifyProvenance(t), false)
})

test('a registered artifact verifies', () => {
  const p = recordArtifact(mk(), art('a.txt', sha('abc')))
  assert.equal(verifyProvenance(p), true)
})

test('editing a recorded byte count is detected', () => {
  const p = recordArtifact(mk(), art('a.txt', sha('abc')))
  const t = thaw(p)
  t.artifacts[0].bytes = 999
  assert.equal(verifyProvenance(t), false)
})

test('editing an artifact checksum is detected', () => {
  const p = recordArtifact(mk(), art('a.txt', sha('abc')))
  const t = thaw(p)
  t.artifacts[0].checksum.value = sha('xyz')
  assert.equal(verifyProvenance(t), false)
})

test('deleting a registered artifact is detected in both directions', () => {
  // Without the cross-check, deleting an artifact and its event would look like a
  // shorter but valid chain.
  const p = recordArtifact(mk(), art('a.txt', sha('abc')))
  const t = thaw(p)
  t.artifacts = []
  assert.equal(verifyProvenance(t), false)
  const t2 = thaw(p)
  t2.audit = t2.audit.filter(entry => entry.type !== 'artifact-observed')
  assert.equal(verifyProvenance(t2), false)
})

test('a decision is recorded with an unverified actor and no clinical use', () => {
  const p = setDecisionGate(mk(), { decision: 'accepted', reason: 'ok' })
  assert.equal(p.decisionGate.clinicalUse, 'not-authorized')
  assert.match(p.decisionGate.actor, /identity not verified/)
  assert.equal(verifyProvenance(p), true)
})
