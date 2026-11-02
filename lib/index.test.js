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
  // A caller must be able to tell "not implemented" from "failed". Reporting
  // canRunWorkflows: false is the honest answer while the host API is missing.
  const caps = capabilities()
  assert.equal(caps.canRunWorkflows, false)
  assert.ok(caps.reason.length > 0)
  assert.ok(NOT_YET.length > 0, 'the missing pieces must be listed')
})

test('the plugin never claims clinical use', () => {
  const caps = capabilities()
  assert.equal(caps.intendedUse, 'research-only')
  assert.equal(caps.clinicalValidationStatus, 'required-not-performed')
})
