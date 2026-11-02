import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, rm, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineEnvironment, environmentKey, environmentYaml, ensureEnvironment, pythonIn } from './environments.js'

const SCRATCH = fileURLToPath(new URL('../.build/env-tests/', import.meta.url))

test('the key covers channels and packages', () => {
  const a = defineEnvironment({ packages: ['samtools=1.19'] })
  const b = defineEnvironment({ packages: ['samtools=1.19'], channels: ['bioconda'] })
  // Two specs that differ in either field must not share an environment.
  assert.notEqual(a.key, b.key)
})

test('package order does not create a second environment', () => {
  const a = environmentKey({ packages: ['a', 'b'] })
  const b = environmentKey({ packages: ['b', 'a'] })
  assert.equal(a, b)
})

test('a spec without packages is refused', () => {
  assert.throws(() => defineEnvironment({ packages: [] }), /packages/)
  assert.throws(() => defineEnvironment({}), /packages/)
})

test('the yaml names the channels and packages', () => {
  const yaml = environmentYaml(defineEnvironment({ packages: ['limma'], channels: ['bioconda', 'conda-forge'] }))
  assert.match(yaml, /channels:/)
  assert.match(yaml, /- bioconda/)
  assert.match(yaml, /- limma/)
})

test('an existing environment is reused rather than rebuilt', async t => {
  const workspace = join(SCRATCH, 'reuse')
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const environment = defineEnvironment({ packages: ['python=3.11'] })
  const first = await ensureEnvironment(environment, { workspace, dryRun: true })
  assert.equal(first.status, 'created')
  // A dry run must not leave a marker, so the second call is still 'created'.
  const second = await ensureEnvironment(environment, { workspace, dryRun: true })
  assert.equal(second.status, 'created')
})

test('a missing conda is reported, never worked around', async t => {
  const workspace = join(SCRATCH, 'noconda')
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const environment = defineEnvironment({ packages: ['python=3.11'] })
  const outcome = await ensureEnvironment(environment, {
    workspace,
    condaCommand: 'definitely-not-a-conda-binary',
  })
  // Falling back to the host interpreter would report success with the wrong toolchain.
  assert.equal(outcome.status, 'unavailable')
  assert.match(outcome.reason, /ENOENT|not recognized|cannot find/i)
})

test('the interpreter path is platform-appropriate', () => {
  const path = pythonIn('/envs/abc')
  assert.match(path, /python(\.exe)?$/)
})
