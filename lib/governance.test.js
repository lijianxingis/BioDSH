import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createProvenance, recordArtifact } from './provenance.js'
import { createBundle, signBundle, verifyBundle } from './bundle.js'
import { generateSigningKey, signDigest } from './signing.js'
import { defineExecutionSpec, describeRequirements } from './execution-spec.js'
import { runContainerSpec } from './step-executor.js'
import { createArtifactStore } from './artifact-store.js'
import { createJournal, readJournal, replayJournal } from './run-journal.js'
import { createScheduler, defineScheduling } from './scheduler.js'
import { createQuotaGate, applyBackpressure } from './quota.js'
import { parseRateLimit, createRateLimiter } from './rate-limit.js'
import { ROLES, definePrincipal, createRegistry, authorize, hasDecider } from './identity.js'
import { createHash } from 'node:crypto'

const sha = s => createHash('sha256').update(s).digest('hex')
const SCRATCH = fileURLToPath(new URL('../.build/governance-tests/', import.meta.url))

test('a bundle verifies, and a tampered one does not', () => {
  const prov = recordArtifact(
    createProvenance({ runId: 'r1', sessionId: 's1', templateId: 't', preset: 'research', inputs: {}, now: '2026-01-01T00:00:00Z' }),
    { path: 'a.txt', label: 'a', bytes: 3, version: 'v1', checksum: { algorithm: 'sha256', value: sha('abc') } },
  )
  const run = { id: 'r1', templateId: 't', title: 't', preset: 'research', status: 'completed', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:01Z', inputs: {}, steps: [], provenance: prov }
  const { bundle } = createBundle({ run, exportedAt: '2026-01-01T00:00:00Z', environment: { pluginVersion: '0.1.0' } })
  assert.equal(verifyBundle(bundle, {}).checks.find(c => c.id === 'digest').ok, true)
  const tampered = JSON.parse(JSON.stringify(bundle))
  tampered.run.title = 'changed'
  assert.equal(verifyBundle(tampered, {}).checks.find(c => c.id === 'digest').ok, false)
})

test('a valid signature is not the same as an authenticated one', () => {
  const key = generateSigningKey()
  const prov = createProvenance({ runId: 'r1', sessionId: 's1', templateId: 't', preset: 'research', inputs: {}, now: '2026-01-01T00:00:00Z' })
  const run = { id: 'r1', templateId: 't', title: 't', preset: 'research', status: 'completed', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:01Z', inputs: {}, steps: [], provenance: prov }
  // The public key travels inside the bundle, so it must be present before sealing.
  const { bundle } = createBundle({ run, exportedAt: '2026-01-01T00:00:00Z', environment: { pluginVersion: '0.1.0', publicKey: key.publicKey } })
  const signed = signBundle(bundle, key.privateKey, key.keyId)
  assert.equal(verifyBundle(signed, { trustedKeys: [] }).authenticated, false)
  assert.equal(verifyBundle(signed, { trustedKeys: [key.keyId] }).authenticated, true)

  // A signature over content that has since changed is not authentication.
  const edited = { ...signed, run: { ...signed.run, title: 'changed' } }
  assert.equal(verifyBundle(edited, { trustedKeys: [key.keyId] }).authenticated, false)
})

test('a floating image or a shell executable is refused before anything runs', () => {
  assert.throws(() => defineExecutionSpec({ image: 'alpine:latest', command: ['echo', 'hi'] }), /digest/)
  assert.throws(() => defineExecutionSpec({ image: 'img@sha256:' + 'a'.repeat(64), command: ['sh', '-c', 'echo hi'] }), /shell/)
  const ok = defineExecutionSpec({ image: 'img@sha256:' + 'a'.repeat(64), command: ['echo', 'hi'] })
  assert.equal(describeRequirements(ok).network, 'disabled')
})

test('a container run fails closed instead of degrading', async () => {
  const spec = defineExecutionSpec({ image: 'img@sha256:' + 'a'.repeat(64), command: ['echo', 'hi'] })
  const result = await runContainerSpec(spec, { cwd: SCRATCH, timeoutMs: 1000, probe: { available: false, reason: 'down' } })
  assert.equal(result.errorCode, 'CONTAINER_UNAVAILABLE')
  assert.notEqual(result.isolation.level, 'process')
})

test('the artifact store deduplicates and refuses a missing digest', async t => {
  const dir = join(SCRATCH, 'store')
  await rm(dir, { recursive: true, force: true })
  await mkdir(dir, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const store = createArtifactStore(dir)
  const a = await store.put(Buffer.from('same bytes'), { name: 'a' })
  const b = await store.put(Buffer.from('same bytes'), { name: 'b' })
  assert.equal(a.digest, b.digest)
  assert.equal((await store.get(a.digest)).toString(), 'same bytes')
  await assert.rejects(store.get('0'.repeat(64)), /no artifact/)
})

test('a truncated journal tail is tolerated but a gap is not', async t => {
  const dir = join(SCRATCH, 'journal')
  await rm(dir, { recursive: true, force: true })
  await mkdir(dir, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const { writeFile } = await import('node:fs/promises')
  const path = join(dir, 'j.jsonl')
  await writeFile(path, [
    JSON.stringify({ seq: 1, type: 'run-started' }),
    JSON.stringify({ seq: 2, type: 'step-completed', stepId: 'a' }),
    '{"seq":3,"type":"step-comp',
  ].join('\n'))
  const journal = await readJournal(path)
  assert.equal(journal.entries.length, 2)
  assert.equal(journal.truncatedTail, true)

  await writeFile(path, [
    JSON.stringify({ seq: 1, type: 'run-started' }),
    JSON.stringify({ seq: 5, type: 'step-completed', stepId: 'a' }),
  ].join('\n'))
  assert.equal((await readJournal(path)).valid, false)
})

test('replay lets a later event override an earlier one', () => {
  const state = replayJournal([
    { seq: 1, type: 'step-dispatched', stepId: 'a' },
    { seq: 2, type: 'step-failed', stepId: 'a' },
    { seq: 3, type: 'step-completed', stepId: 'a' },
  ])
  assert.ok(state.completed.a)
  assert.equal(state.failed.a, undefined)
})

test('a scheduler never places a step beyond capacity', () => {
  const scheduler = createScheduler([{ id: 'small', capacity: { cpu: 1, memoryMb: 512, maxSlots: 1 } }])
  const heavy = defineScheduling({ cost: { cpu: 4, memoryMb: 4096 } }).cost
  assert.equal(scheduler.pick(heavy), undefined)
  assert.equal(scheduler.pick({ cpu: 1, memoryMb: 1 }), 'small')
})

test('a quota window slides rather than resetting in bursts', () => {
  let clock = 0
  const gate = createQuotaGate({ meters: [{ name: 'steps', limit: 2, windowMs: 60000 }], now: () => clock })
  assert.equal(gate.check({ amount: 1 }).allowed, true)
  gate.record({ amount: 1 }); clock = 1000
  assert.equal(gate.check({ amount: 1 }).allowed, true)
  gate.record({ amount: 1 }); clock = 2000
  assert.equal(gate.check({ amount: 1 }).allowed, false)
  clock = 61000
  assert.equal(gate.check({ amount: 1 }).allowed, true)
})

test('a rate limit accepts the Nextflow string form', () => {
  const parsed = parseRateLimit('190/60min')
  assert.equal(parsed.limit, 190)
  assert.equal(parsed.windowMs, 3600000)
  let clock = 0
  const limiter = createRateLimiter('2/1s', { now: () => clock })
  assert.equal(limiter.reserve().allowed, true)
  assert.equal(limiter.reserve().allowed, true)
  assert.equal(limiter.reserve().allowed, false)
  clock = 1000
  assert.equal(limiter.reserve().allowed, true)
})

test('roles separate executing from approving', () => {
  const key = generateSigningKey()
  const operator = definePrincipal({ name: 'op', role: 'operator', publicKey: key.publicKey })
  const reviewer = definePrincipal({ name: 'rev', role: 'reviewer', publicKey: generateSigningKey().publicKey })
  assert.equal(authorize(operator, 'execute').allowed, true)
  assert.equal(authorize(operator, 'decide').allowed, false)
  assert.equal(authorize(reviewer, 'decide').allowed, true)
  assert.equal(authorize(reviewer, 'execute').allowed, false)
  const registry = createRegistry([operator, reviewer])
  assert.equal(hasDecider(registry), true)
})

test('a principal id cannot be chosen', () => {
  const key = generateSigningKey()
  assert.throws(() => definePrincipal({ name: 'x', publicKey: key.publicKey, keyId: 'deadbeef' }), /derived from its key/)
})
