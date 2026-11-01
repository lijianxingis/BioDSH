import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, rm, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { definePlan, runPlan, tokenizeCommand, stepFingerprint, planDigest } from './workflow-engine.js'

const node = process.execPath
const SCRATCH = fileURLToPath(new URL('../.build/engine-tests/', import.meta.url))
const sha = buffer => createHash('sha256').update(buffer).digest('hex')

let counter = 0
async function workspace() {
  const dir = join(SCRATCH, 'run-' + (++counter))
  await rm(dir, { recursive: true, force: true })
  await mkdir(join(dir, '.run'), { recursive: true })
  return dir
}

test('a tokenizer keeps backslashes literal', () => {
  // Treating a backslash as an escape turned E:\x\y.exe into E:xy.exe and failed with
  // ENOENT on a file that was plainly there.
  const tokens = tokenizeCommand('"D:\\tools\\py.exe" -c "print(1)"')
  assert.equal(tokens[0], 'D:\\tools\\py.exe')
  assert.equal(tokens[2], 'print(1)')
})

test('an unterminated quote is refused rather than guessed at', () => {
  assert.throws(() => tokenizeCommand('a "unclosed'), /unterminated/)
})

test('steps run in dependency order', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'b', command: 'x', needs: ['a'], argv: [node, '-e', "require('fs').writeFileSync('b.txt','B')"], outputs: [{ path: 'b.txt', minBytes: 1 }] },
    { id: 'a', command: 'x', argv: [node, '-e', "require('fs').writeFileSync('a.txt','A')"], outputs: [{ path: 'a.txt', minBytes: 1 }] },
  ] })
  assert.deepEqual([...plan.order], ['a', 'b'])
  const result = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  assert.equal(result.status, 'completed')
})

test('a cycle is refused', () => {
  assert.throws(() => definePlan({ steps: [
    { id: 'x', command: 'x', needs: ['y'] },
    { id: 'y', command: 'x', needs: ['x'] },
  ] }), /cycle/)
})

test('duplicate ids are refused', () => {
  assert.throws(() => definePlan({ steps: [
    { id: 'dup', command: 'x' }, { id: 'dup', command: 'x' },
  ] }), /Duplicate/)
})

test('a non-zero exit fails the step and skips its dependents', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'boom', command: 'x', argv: [node, '-e', 'process.exit(7)'] },
    { id: 'after', command: 'x', needs: ['boom'], argv: [node, '-e', '0'] },
  ] })
  const result = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  assert.equal(result.status, 'failed')
  assert.equal(result.steps[0].exitCode, 7)
  assert.equal(result.steps[1].status, 'skipped')
})

test('exit 0 without the declared output is a failure', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'liar', command: 'x', argv: [node, '-e', 'process.exit(0)'], outputs: [{ path: 'promised.txt', minBytes: 1 }] },
  ] })
  const result = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  assert.equal(result.status, 'failed')
  assert.match(result.steps[0].error, /did not produce/)
})

test('a missing declared input stops the step before the command runs', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'needs', command: 'x', inputs: [{ path: 'absent.csv' }],
      argv: [node, '-e', "require('fs').writeFileSync('ran.txt','X')"] },
  ] })
  const result = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  assert.equal(result.status, 'failed')
  assert.match(result.steps[0].error, /Required input/)
  const ran = await readFile(join(ws, 'ran.txt')).catch(() => null)
  assert.equal(ran, null, 'the command must not have run')
})

test('a step is credited only with what it declared', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  // Found by running a real analysis: scanning the shared workspace credited a no-op
  // step with every file already in it.
  for (const name of ['pre-1.txt', 'pre-2.txt']) await writeFile(join(ws, name), 'x')
  const plan = definePlan({ steps: [
    { id: 'noop', command: 'x', argv: [node, '-e', '0'] },
    { id: 'writer', command: 'x', needs: ['noop'], argv: [node, '-e', "require('fs').writeFileSync('out.txt','v')"], outputs: [{ path: 'out.txt', minBytes: 1 }] },
  ] })
  const result = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  assert.deepEqual(result.steps[0].outputs, [])
  assert.deepEqual(result.steps[1].outputs.map(o => o.path), ['out.txt'])
})

test('a declared output is found even in a large workspace', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  // A file-count limit on the walk stopped the scan before reaching the output, so a
  // successful step was reported as failing in proportion to how much unrelated data
  // the workspace held.
  for (let i = 0; i < 400; i++) await writeFile(join(ws, 'noise-' + i + '.txt'), 'x')
  const plan = definePlan({ steps: [
    { id: 'late', command: 'x', argv: [node, '-e', "require('fs').writeFileSync('zzz.txt','found')"], outputs: [{ path: 'zzz.txt', minBytes: 3 }] },
  ] })
  const result = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  assert.equal(result.status, 'completed')
})

test('a timeout is enforced', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'slow', command: 'x', argv: [node, '-e', 'setTimeout(()=>{}, 30000)'], timeoutMs: 1200 },
  ] })
  const started = Date.now()
  const result = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  assert.equal(result.status, 'failed')
  assert.ok(Date.now() - started < 12000)
})

test('parallel needs approval and refuses overlapping writes', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'a', command: 'x', argv: [node, '-e', '0'], outputs: [{ path: 'shared.csv', minBytes: 1 }] },
    { id: 'b', command: 'x', argv: [node, '-e', '0'], outputs: [{ path: 'shared.csv', minBytes: 1 }] },
  ] })
  await assert.rejects(runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run'), concurrency: 4 }), /approval/)
  await assert.rejects(
    runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run'), concurrency: 4, approveParallel: true }),
    /overlapping outputs/,
  )
})

test('an unchanged rerun reuses every completed step', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'a', command: 'x', argv: [node, '-e', "require('fs').writeFileSync('a.txt','A')"], outputs: [{ path: 'a.txt', minBytes: 1 }] },
  ] })
  const first = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  await mkdir(join(ws, '.run2'), { recursive: true })
  const second = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run2'), previous: first })
  assert.deepEqual([...second.reusedSteps], ['a'])
})

test('a resume never reports a record that disagrees with the disk', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'a', command: 'x', argv: [node, '-e', "require('fs').writeFileSync('a.txt','A1')"], outputs: [{ path: 'a.txt', minBytes: 2 }] },
  ] })
  const first = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  await mkdir(join(ws, '.run2'), { recursive: true })
  const second = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run2'), previous: first })

  // Tamper behind the engine's back.
  await writeFile(join(ws, 'a.txt'), 'TAMPERED')
  await mkdir(join(ws, '.run3'), { recursive: true })
  const third = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run3'), previous: second })

  for (const step of third.steps) {
    if (step.status !== 'completed') continue
    for (const output of step.outputs ?? []) {
      const actual = await readFile(join(ws, output.path))
      assert.equal(sha(actual), output.sha256, 'a recorded digest must match the bytes on disk')
    }
  }
})

test('a deleted output is not reported as still present', async t => {
  const ws = await workspace()
  t.after(() => rm(ws, { recursive: true, force: true }))
  const plan = definePlan({ steps: [
    { id: 'a', command: 'x', argv: [node, '-e', "require('fs').writeFileSync('a.txt','A')"], outputs: [{ path: 'a.txt', minBytes: 1 }] },
  ] })
  const first = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run') })
  await rm(join(ws, 'a.txt'), { force: true })
  await mkdir(join(ws, '.run2'), { recursive: true })
  const second = await runPlan(plan, { workspace: ws, runDirectory: join(ws, '.run2'), previous: first })
  assert.equal(second.steps[0].reused, false)
})

test('a container plan refuses a floating image at definition time', () => {
  const digest = 'sha256:' + 'a'.repeat(64)
  for (const tag of ['busybox:latest', 'ubuntu', 'python:3.12']) {
    assert.throws(() => definePlan({ backend: 'container', image: tag, steps: [{ id: 'a', command: 'echo', argv: ['echo', 'hi'] }] }), /digest/)
  }
  const ok = definePlan({ backend: 'container', image: 'img@' + digest, steps: [{ id: 'a', command: 'echo', argv: ['echo', 'hi'] }] })
  assert.equal(ok.image, 'img@' + digest)
})

test('the timeout budget follows the critical path, not the sum', () => {
  // 20 independent steps each declaring 10 minutes is fine; 8 in a chain is not.
  const wide = definePlan({ steps: Array.from({ length: 20 }, (_, i) => ({ id: 'w' + i, command: 'x', timeoutMs: 600000 })) })
  assert.equal(wide.steps.length, 20)
  const chain = Array.from({ length: 8 }, (_, i) => ({ id: 'c' + i, command: 'x', timeoutMs: 900000, ...(i > 0 ? { needs: ['c' + (i - 1)] } : {}) }))
  assert.throws(() => definePlan({ steps: chain }), /budget/)
})
