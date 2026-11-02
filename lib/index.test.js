import test from 'node:test'
import assert from 'node:assert/strict'
import { capabilities, modules, READY, NOT_YET } from './index.js'

test('the entry point loads and reports a version', () => {
  const caps = capabilities()
  assert.equal(typeof caps.pluginVersion, 'string')
  assert.equal(caps.engineVersion, 1)
})

test('every module listed as ready actually imports', async () => {
  for (const name of READY) {
    const loader = modules[name]
    assert.equal(typeof loader, 'function', name + ' must have a loader')
    const loaded = await loader()
    assert.ok(Object.keys(loaded).length > 0, name + ' must export something')
  }
})

test('unfinished capabilities are declared rather than silently absent', () => {
  // A caller must be able to tell "not implemented" from "failed". The host API is now
  // present, so canRunWorkflows is true; the panel UI that drives it is still missing
  // and must be listed rather than left for someone to discover.
  const caps = capabilities()
  assert.equal(caps.canRunWorkflows, true)
  assert.ok(caps.reason.length > 0)
  assert.ok(NOT_YET.length > 0, 'the missing pieces must be listed')
  // The panel exists now; what remains missing is the container/scientific-image
  // verification and two modules that were not restored. The list must name them.
  assert.ok(NOT_YET.some(item => /container|scientific/i.test(item)), 'the unverified container path must be named')
})

test('the host module is exported and answers its own path', async () => {
  const host = await modules.host()
  assert.equal(host.API_PATH, '/api/research-workbench')
  assert.ok(host.inject.includes('credentials'), 'signing needs the credential service')
})

test('the plugin never claims clinical use', () => {
  const caps = capabilities()
  assert.equal(caps.intendedUse, 'research-only')
  assert.equal(caps.clinicalValidationStatus, 'required-not-performed')
})
