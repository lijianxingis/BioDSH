import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, rm, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startWorker } from './worker-agent.mjs'
import { defineWorker, planDistributability, runDistributed, isRetryable } from './distributed.js'
import { createArtifactStore } from './artifact-store.js'
import { definePlan } from './workflow-engine.js'

const node = process.execPath
const SCRATCH = fileURLToPath(new URL('../.build/distributed-tests/', import.meta.url))

async function scratch(name) {
  const dir = join(SCRATCH, name)
  await rm(dir, { recursive: true, force: true })
  await mkdir(dir, { recursive: true })
  return dir
}

test('a worker will not start without a token', async () => {
  await assert.rejects(startWorker({ token: '' }), /token is required/)
})

test('a plain-HTTP worker on a remote host is refused', () => {
  // A token over plain HTTP to a remote address travels in the clear.
  assert.throws(() => defineWorker({ id: 'w', url: 'http://example.com:8080', token: 't' }), /loopback/)
  const ok = defineWorker({ id: 'w', url: 'http://127.0.0.1:9000', token: 't' })
  assert.equal(ok.id, 'w')
})

test('a step whose dependency declares no outputs is not distributable', () => {
  const plan = definePlan({ steps: [
    { id: 'a', command: 'x', argv: [node, '-e', '0'] },
    { id: 'b', command: 'x', needs: ['a'], argv: [node, '-e', '0'] },
  ] })
  const verdict = planDistributability(plan)
  assert.equal(verdict.fullyDistributable, false)
  assert.match(verdict.note, /nothing to ship/)
})

test('a dependent chain runs across two real workers with the artifact shipped', async t => {
  const dir = await scratch('chain')
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const a = await startWorker({ token: 'ta' })
  const b = await startWorker({ token: 'tb' })
  try {
    const plan = definePlan({ steps: [
      { id: 'produce', command: 'x', outputs: [{ path: 'data.txt', minBytes: 3 }],
        argv: [node, '-e', "require('fs').writeFileSync('data.txt','FROM-A')"] },
      { id: 'consume', command: 'x', needs: ['produce'], inputs: [{ path: 'data.txt' }], outputs: [{ path: 'result.txt', minBytes: 5 }],
        argv: [node, '-e', "require('fs').writeFileSync('result.txt', require('fs').readFileSync('data.txt','utf8')+'|SEEN')"] },
    ] })
    const store = createArtifactStore(join(dir, 'store'))
    const result = await runDistributed(plan, {
      workers: [
        defineWorker({ id: 'alpha', url: a.url, token: 'ta', concurrency: 1 }),
        defineWorker({ id: 'beta', url: b.url, token: 'tb', concurrency: 1 }),
      ],
      approveParallel: true, store, journalPath: join(dir, 'j.jsonl'),
    })
    assert.equal(result.status, 'completed')
    // The second step must have read bytes that travelled from the first.
    const produced = result.steps.find(step => step.id === 'consume')
    assert.ok(produced.artifacts.length > 0)
    const bytes = await store.get(produced.artifacts[0].sha256)
    assert.equal(bytes.toString(), 'FROM-A|SEEN')
    // Every verdict is the coordinator's, never the worker's claim.
    for (const step of result.steps) assert.equal(step.verifiedBy, 'coordinator')
  } finally { await a.close(); await b.close() }
})

test('a non-zero exit on a worker is a failure and is not retried', async t => {
  const dir = await scratch('exitcode')
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const worker = await startWorker({ token: 't' })
  try {
    const plan = definePlan({ steps: [
      { id: 'bad', command: 'x', argv: [node, '-e', 'process.exit(3)'] },
    ] })
    const result = await runDistributed(plan, {
      workers: [defineWorker({ id: 'w', url: worker.url, token: 't', concurrency: 1 })],
      store: createArtifactStore(join(dir, 'store')),
    })
    assert.equal(result.status, 'failed')
    assert.equal(result.steps[0].exitCode, 3)
    // Retrying a real command failure would hide the defect behind "it worked later".
    assert.equal(isRetryable({ status: 'failed', exitCode: 3 }), false)
    assert.equal(isRetryable({ status: 'failed', transportFailure: true }), true)
  } finally { await worker.close() }
})

test('an unreachable worker fails instead of hanging', async t => {
  const dir = await scratch('unreachable')
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 's', command: 'x', argv: [node, '-e', '0'], outputs: [{ path: 'o.txt', minBytes: 1 }] },
  ] })
  const started = Date.now()
  const result = await runDistributed(plan, {
    workers: [defineWorker({ id: 'ghost', url: 'http://127.0.0.1:1', token: 't', concurrency: 1 })],
    store: createArtifactStore(join(dir, 'store')),
    maxAttempts: 2,
    retryDelayMs: () => 1,
  })
  assert.equal(result.status, 'failed')
  assert.ok(Date.now() - started < 20000, 'must not hang')
})

test('a worker that returns no declared output does not count as success', async t => {
  const dir = await scratch('noartifact')
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const worker = await startWorker({ token: 't' })
  try {
    const plan = definePlan({ steps: [
      // Exits 0 but writes nothing: the contract makes this a failure.
      { id: 'liar', command: 'x', argv: [node, '-e', 'process.exit(0)'], outputs: [{ path: 'promised.txt', minBytes: 1 }] },
    ] })
    const result = await runDistributed(plan, {
      workers: [defineWorker({ id: 'w', url: worker.url, token: 't', concurrency: 1 })],
      store: createArtifactStore(join(dir, 'store')),
    })
    assert.equal(result.status, 'failed')
    assert.match(result.steps[0].error, /declared outputs/)
  } finally { await worker.close() }
})

test('a wrong token is refused by the worker', async t => {
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const worker = await startWorker({ token: 'right' })
  try {
    const wrong = await fetch(worker.url + '/execute', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer wrong' },
      body: JSON.stringify({ protocolVersion: 2, argv: [node, '-e', '0'] }),
    })
    assert.equal(wrong.status, 401)
    const right = await fetch(worker.url + '/execute', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer right' },
      body: JSON.stringify({ protocolVersion: 2, argv: [node, '-e', '0'] }),
    })
    assert.equal(right.status, 200)
  } finally { await worker.close() }
})
