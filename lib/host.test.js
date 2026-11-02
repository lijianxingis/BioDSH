import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleAction, medicalCapabilities, __setProcessPath } from './host.js'
import { checkTool, MEDICAL_ALLOWED_TOOLS, applyMedicalGuard } from './medical-policy.js'

const SCRATCH = fileURLToPath(new URL('../.build/host-tests/', import.meta.url))

/**
 * A fixture host: enough of the real services to exercise the API contract without
 * pretending to be DSH. The point of these tests is the API's own behaviour (scoping,
 * refusal codes, medical isolation), not the host's.
 */
function fixture({ preset = 'standard', root } = {}) {
  const workspace = root ?? join(SCRATCH, 'ws-' + Math.random().toString(36).slice(2))
  const session = { id: 's1', agentPreset: preset, cwd: workspace, workspace }
  const files = new Map()
  const ctx = {
    sessions: { get: async id => (id === 's1' ? session : undefined) },
    fs: {
      resolve: async (path, { cwd }) => ({ displayPath: path, targetKey: path, path: join(cwd, path) }),
      contains: (root, target) => String(target.path ?? target).startsWith(root),
      stat: async target => {
        const key = target.path ?? target
        if (files.has(key)) return { size: files.get(key).length, version: 'v1', isFile: () => true }
        try {
          const info = await import('node:fs/promises').then(m => m.stat(key))
          return { size: info.size, version: 'v1', isFile: () => info.isFile() }
        } catch { return undefined }
      },
      readBytes: async target => {
        const key = target.path ?? target
        if (files.has(key)) return files.get(key)
        return import('node:fs/promises').then(m => m.readFile(key))
      },
      writeText: async (target, text) => { files.set(target.path ?? target, Buffer.from(text, 'utf8')); return { version: 'v2' } },
    },
    sandboxPolicy: { for: () => undefined },
  }
  return { ctx, workspace, session, files }
}

async function call(ctx, action, payload = {}) {
  try {
    const value = await handleAction(ctx, { action, sessionId: 's1', ...payload }, undefined)
    return { ok: true, value }
  } catch (error) {
    return { ok: false, code: error.code, status: error.status, message: error.message }
  }
}

test('an unknown action is refused with a code', async () => {
  const { ctx } = fixture()
  const result = await call(ctx, 'does/not/exist')
  assert.equal(result.ok, false)
  assert.equal(result.code, 'INVALID_REQUEST')
})

test('a session that does not exist is refused', async () => {
  const { ctx } = fixture()
  try {
    await handleAction(ctx, { action: 'workflow/list', sessionId: 'nope' }, undefined)
    assert.fail('should have thrown')
  } catch (error) {
    assert.equal(error.code, 'SESSION_NOT_FOUND')
    assert.equal(error.status, 404)
  }
})

test('medical mode cannot read files', async () => {
  const { ctx } = fixture({ preset: 'medical-metadata' })
  const result = await call(ctx, 'editor/read', { path: 'notes.txt' })
  assert.equal(result.ok, false)
  assert.equal(result.code, 'MEDICAL_FILES_BLOCKED')
})

test('medical mode cannot execute a pipeline', async () => {
  const { ctx } = fixture({ preset: 'medical-metadata' })
  const result = await call(ctx, 'pipeline/run', { plan: { steps: [{ id: 'a', command: 'x' }] } })
  assert.equal(result.ok, false)
  assert.equal(result.code, 'MEDICAL_EXECUTION_BLOCKED')
})

test('medical mode can still ask what it is allowed to do', async () => {
  const { ctx } = fixture({ preset: 'medical-metadata' })
  const result = await call(ctx, 'medical/capabilities')
  assert.equal(result.ok, true)
  assert.deepEqual(result.value.allowedTools, MEDICAL_ALLOWED_TOOLS)
  assert.equal(result.value.vision, false)
  assert.equal(result.value.clinicalUse, 'not-authorized')
})

test('the tool guard denies by default and never opens on error', () => {
  const medical = { agentPreset: 'medical-metadata' }
  for (const denied of ['run_code', 'bash', 'read_file', 'spawn_agent', 'web_fetch', 'biomni_call_tool']) {
    assert.equal(checkTool(medical, denied).allowed, false, denied + ' must be denied')
  }
  assert.equal(checkTool(medical, 'web_search').allowed, true)
  // An unknown tool is denied: the list is an allowlist.
  assert.equal(checkTool(medical, 'some_new_tool').allowed, false)
  // A non-medical session is untouched.
  assert.equal(checkTool({ agentPreset: 'standard' }, 'run_code').allowed, true)
})

test('the installed guard fails closed', () => {
  let registered
  const ctx = { tools: { guard: fn => { registered = fn } } }
  const installed = applyMedicalGuard(ctx)
  assert.equal(installed.installed, true)
  const verdict = registered({ tool: { name: 'bash' }, session: { agentPreset: 'medical-metadata' } })
  assert.equal(verdict.deny, true)
  // A guard that throws must deny, not allow.
  const throwing = registered({ get tool() { throw new Error('boom') }, session: { agentPreset: 'medical-metadata' } })
  assert.equal(throwing.deny, true)
})

test('workflow/create refuses a contract that escapes the workspace', async t => {
  const { ctx, workspace } = fixture()
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  const result = await call(ctx, 'workflow/create', {
    title: 't',
    steps: [{ id: 'a', title: 'a', instructions: '', outputs: [{ path: '../escape.csv' }] }],
  })
  assert.equal(result.ok, false)
  assert.match(result.message, /workspace/)
})

test('a run created through the API round-trips its contract', async t => {
  const { ctx, workspace } = fixture()
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  __setProcessPath(scope => scope.root)
  const created = await call(ctx, 'workflow/create', {
    title: 'round trip',
    steps: [{
      id: 'a', title: 'a', instructions: 'do it',
      command: '{{python}} x.py',
      inputs: [{ path: 'in.csv', required: true }],
      outputs: [{ path: 'out.md', mediaType: 'text/markdown', minBytes: 10 }],
    }],
  })
  assert.equal(created.ok, true, JSON.stringify(created))
  const read = await call(ctx, 'workflow/get', { runId: created.value.runId })
  assert.equal(read.ok, true)
  const step = read.value.run.steps[0]
  assert.equal(step.outputs[0].mediaType, 'text/markdown')
  assert.equal(step.outputs[0].minBytes, 10)
  assert.equal(step.inputs[0].required, true)
})

test('a run belonging to another session is refused', async t => {
  const { ctx, workspace } = fixture()
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  __setProcessPath(scope => scope.root)
  const created = await call(ctx, 'workflow/create', { title: 'x', steps: [{ id: 'a', title: 'a', instructions: '' }] })
  const dir = join(workspace, '.dsh/research-workbench/runs', created.value.runId)
  await mkdir(dir, { recursive: true })
  const run = JSON.parse(JSON.stringify(created.value.run))
  run.sessionId = 'someone-else'
  await writeFile(join(dir, 'run.json'), JSON.stringify(run), 'utf8')
  const read = await call(ctx, 'workflow/get', { runId: created.value.runId })
  assert.equal(read.ok, false)
  assert.equal(read.code, 'WORKFLOW_SESSION_MISMATCH')
})

test('the signing endpoint answers even with no credential store', async t => {
  const { ctx, workspace } = fixture()
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })
  t.after(() => rm(SCRATCH, { recursive: true, force: true }))
  __setProcessPath(scope => scope.root)
  const result = await call(ctx, 'signing/info')
  assert.equal(result.ok, true, JSON.stringify(result))
  assert.equal(result.value.configured, false)
  assert.equal(result.value.signatureKind, 'self-signed')
})

test('an unimplemented action says so instead of pretending', async () => {
  const { ctx } = fixture()
  const result = await call(ctx, 'workflow/export', { runId: 'x' })
  assert.equal(result.ok, false)
  assert.ok(result.code === 'NOT_IMPLEMENTED' || result.code === 'RUN_NOT_FOUND', 'got ' + result.code)
})
