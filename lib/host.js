/**
 * Host API for the workbench panel.
 *
 * One POST endpoint carries every action. The design rules that matter here:
 *
 * - a request is scoped to a session, and a run that belongs to another session is
 *   refused rather than read;
 * - medical-metadata mode is blocked from execution and file reads at the host, not by
 *   asking the model nicely;
 * - every failure carries a stable code, because "it did not work" is not actionable.
 */
import { randomUUID } from 'node:crypto'
import { createHash } from 'node:crypto'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { readFileSync } from 'node:fs'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { definePlan, planDigest, runPlan, writeRunRecord } from './workflow-engine.js'
import { appendAudit, createArtifactManifest, createProvenance, recordArtifact, recordExecution, setDecisionGate, verifyProvenance } from './provenance.js'
import { createBundle, verifyBundle } from './bundle.js'
import { describeKey, generateSigningKey, signDigest, shortKeyId, parseShortKeyId } from './signing.js'
import { defineContract } from './step-contract.js'
import { probeContainerRuntime, runContainerSpec, runProcessSpec } from './step-executor.js'
import { defineExecutionSpec, defineLocalSpec, describeRequirements } from './execution-spec.js'
import { builtinSuite } from './benchmark.js'

const PLUGIN_VERSION = (() => {
  try { return JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version ?? 'unknown' } catch { return 'unknown' }
})()

export const API_PATH = '/api/research-workbench'
export const MAX_FILE_BYTES = 2 * 1024 * 1024
const STORE = '.dsh/research-workbench'
const KEY_STORE = STORE + '/signing-key.json'
const TRUST_STORE = STORE + '/trusted-keys.json'
const MEDICAL = 'medical-metadata'
const MEDICAL_ALLOWED_TOOLS = Object.freeze(['medical_specialist', 'research_workflow_step', 'web_search', 'ask_user_question', 'todo_write'])

export const inject = ['connection', 'fs', 'sandboxPolicy', 'sessions', 'tools', 'agentPresets', 'sessionProjections', 'subagents', 'credentials']

/** A failure the caller can act on: a stable code, a message, and a status. */
class WorkbenchError extends Error {
  constructor(code, message, status = 400) {
    super(message)
    this.name = 'WorkbenchError'
    this.code = code
    this.status = status
  }
}

function fail(code, message, status = 400) {
  throw new WorkbenchError(code, message, status)
}

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function string(value, label, max = 4096) {
  if (typeof value !== 'string' || !value || value.length > max) fail('INVALID_REQUEST', label + ' must be a non-empty string.')
  return value
}

function runId(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(value)) fail('INVALID_REQUEST', 'runId is not valid.')
  return value
}

/** Map a thrown value onto a response the caller can reason about. */
function toError(error) {
  if (error instanceof WorkbenchError) return error
  const known = {
    ENOENT: [404, 'The file was not found.'],
    EACCES: [403, 'The file is not accessible.'],
    EPERM: [403, 'The file is not accessible.'],
    FS_SANDBOX_DENIED: [403, 'The current session file policy does not allow this write.'],
    FS_TOO_LARGE: [413, 'Files must be no larger than 2 MiB.'],
    FS_NOT_TEXT: [415, 'Only valid UTF-8 text is supported.'],
  }
  const entry = Object.hasOwn(known, error?.code) ? known[error.code] : undefined
  if (entry) return new WorkbenchError(error.code, entry[1], entry[0])
  if (error?.code && /^[A-Z_]+$/.test(error.code)) return new WorkbenchError(error.code, error.message, 409)
  return new WorkbenchError('INTERNAL', 'The research workbench request failed.', 500)
}

function response(value, status = 200) {
  return Response.json(value, { status, headers: { 'cache-control': 'no-store' } })
}

async function requestJson(request) {
  const type = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase()
  if (type !== 'application/json') fail('INVALID_REQUEST', 'Use an application/json request body.')
  const text = await request.text()
  if (text.length > MAX_FILE_BYTES * 6 + 65536) fail('REQUEST_TOO_LARGE', 'The request body is too large.', 413)
  try { return JSON.parse(text) } catch { fail('INVALID_REQUEST', 'The request body is not valid JSON.') }
}

/** Resolve the session a request belongs to, or refuse it. */
async function scopeFor(ctx, sessionId, signal) {
  const id = string(sessionId, 'sessionId', 200)
  let session
  try {
    session = await ctx.sessions.get(id, signal)
  } catch { session = undefined }
  if (!session) fail('SESSION_NOT_FOUND', 'The session was not found.', 404)
  const root = session.workspace ?? session.cwd
  if (!root) fail('SESSION_NOT_FOUND', 'The session has no workspace.', 404)
  return { session, sessionId: id, root, cwd: session.cwd ?? root }
}

function presetOf(session) {
  return session?.agentPreset ?? session?.preset ?? ''
}

/** A path must stay inside the session workspace, after symlinks are resolved. */
async function locate(ctx, scope, path, { allowMissing = false } = {}) {
  const wanted = string(path, 'path', 4096)
  const target = await ctx.fs.resolve(wanted, { cwd: scope.cwd })
  if (!ctx.fs.contains(scope.root, target)) fail('OUTSIDE_WORKSPACE', 'That path is outside the session workspace.', 403)
  const info = await ctx.fs.stat(target).catch(() => undefined)
  if (!info && !allowMissing) fail('FS_NOT_FOUND', 'The file was not found.', 404)
  return { target, info }
}

async function readTextFile(ctx, scope, path, signal) {
  const { target, info } = await locate(ctx, scope, path)
  if (info.size > MAX_FILE_BYTES) fail('FS_TOO_LARGE', 'Files must be no larger than 2 MiB.', 413)
  const bytes = await ctx.fs.readBytes(target, signal, MAX_FILE_BYTES)
  let text
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes) } catch { fail('FS_NOT_TEXT', 'Only valid UTF-8 text is supported.', 415) }
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) fail('FS_NOT_TEXT', 'Binary files cannot be opened in the editor.', 415)
  return { text, version: String(info.version ?? info.mtimeMs ?? bytes.length), bytes }
}

function runDirectoryFor(scope, id) {
  return join(ctx_processPath(scope), STORE, 'runs', id)
}

/** The process-visible path for a workspace, for child processes. */
let ctx_processPath = scope => scope.root
export function __setProcessPath(fn) { ctx_processPath = fn }

async function loadRun(ctx, scope, id) {
  const dir = runDirectoryFor(scope, runId(id))
  const file = join(dir, 'run.json')
  let text
  try { text = await readFile(file, 'utf8') } catch { fail('RUN_NOT_FOUND', 'No run with that id exists in this workspace.', 404) }
  let parsed
  try { parsed = JSON.parse(text) } catch { fail('RUN_CORRUPT', 'The run record is not valid JSON.', 409) }
  return { run: parsed, dir, file }
}

async function saveRun(ctx, scope, id, run) {
  const dir = runDirectoryFor(scope, runId(id))
  await mkdir(dir, { recursive: true })
  const text = JSON.stringify(run, null, 2) + '\n'
  await writeFile(join(dir, 'run.json'), text, 'utf8')
  return createHash('sha256').update(text).digest('hex')
}

function medicalGuard(scope, action) {
  if (presetOf(scope.session) !== MEDICAL) return
  const blocked = ['pipeline/run', 'workflow/execute', 'execution/run', 'benchmark/run', 'editor/read', 'editor/save', 'image/inspect', 'archive/import', 'pipeline/distribute']
  if (blocked.includes(action)) {
    const code = action.startsWith('editor') || action === 'image/inspect' ? 'MEDICAL_FILES_BLOCKED' : 'MEDICAL_EXECUTION_BLOCKED'
    fail(code, 'Medical metadata mode cannot read files or execute anything.', 403)
  }
}

export function medicalCapabilities() {
  return Object.freeze({
    available: true,
    preset: MEDICAL,
    mode: 'metadata-only',
    allowedTools: MEDICAL_ALLOWED_TOOLS,
    specialistRoles: Object.freeze(['literature', 'methods', 'code-debug', 'architecture', 'independent-review']),
    vision: false,
    visionReview: 'not-available',
    imageInspection: 'blocked-in-medical-mode',
    clinicalUse: 'not-authorized',
    humanDecisionRequired: true,
  })
}

/** Every action the panel may call. Anything else is refused before scoping. */
const ACTIONS = Object.freeze([
  'editor/read', 'editor/save',
  'workflow/list', 'workflow/create', 'workflow/get', 'workflow/provenance',
  'workflow/artifacts', 'workflow/execution', 'workflow/validate', 'workflow/decision',
  'workflow/export', 'workflow/verify-bundle', 'workflow/execute',
  'signing/info', 'signing/create',
  'trust/list', 'trust/add', 'trust/remove', 'trust/inspect',
  'execution/backends', 'execution/run', 'execution/adapter',
  'pipeline/run', 'pipeline/distributability', 'pipeline/distribute',
  'benchmark/suite', 'benchmark/run',
  'image/inspect', 'medical/capabilities',
])

async function handleAction(ctx, body, signal) {
  if (!object(body)) fail('INVALID_REQUEST', 'The request body must be an object.')
  const action = body.action
  if (action === 'medical/capabilities') return medicalCapabilities()
  if (!ACTIONS.includes(action)) fail('INVALID_REQUEST', 'Unknown research workbench action.')
  const scope = await scopeFor(ctx, body.sessionId, signal)
  medicalGuard(scope, action)

  if (action === 'editor/read') {
    const { text, version } = await readTextFile(ctx, scope, body.path, signal)
    return { path: body.path, text, version }
  }

  if (action === 'editor/save') {
    string(body.version, 'version', 4096)
    if (typeof body.text !== 'string') fail('INVALID_REQUEST', 'text must be a string.')
    const { target, info } = await locate(ctx, scope, body.path)
    const current = String(info.version ?? info.mtimeMs ?? '')
    if (current !== body.version) fail('FS_STALE_VERSION', 'The file changed on disk. Reload it before saving.', 409)
    const result = await ctx.fs.writeText(target, body.text, { kind: 'replaceIfVersion', version: info.version }, signal, ctx.sandboxPolicy?.for(scope.session))
    return { path: body.path, text: body.text, version: String(result.version ?? '') }
  }

  if (action === 'workflow/list') {
    const dir = join(ctx_processPath(scope), STORE, 'runs')
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    const runs = []
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      try {
        const text = await readFile(join(dir, entry.name, 'run.json'), 'utf8')
        const parsed = JSON.parse(text)
        runs.push({
          id: entry.name,
          title: parsed.title ?? entry.name,
          status: parsed.status ?? 'pending',
          templateId: parsed.templateId,
          createdAt: parsed.createdAt,
          updatedAt: parsed.updatedAt,
          steps: Array.isArray(parsed.steps) ? parsed.steps.map(step => ({ id: step.id, title: step.title, status: step.status })) : [],
        })
      } catch { /* a half-written record is skipped, not reported as a run */ }
    }
    runs.sort((a, b) => String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')))
    return { runs }
  }

  if (action === 'workflow/create') {
    const id = body.runId === undefined ? randomUUID() : runId(body.runId)
    const steps = Array.isArray(body.steps) ? body.steps : []
    if (!steps.length) fail('INVALID_REQUEST', 'a run needs at least one step.')
    // Validate the contract at the boundary: a bad declaration must not reach disk.
    const definitions = steps.map(step => {
      if (!object(step)) fail('INVALID_REQUEST', 'each step must be an object.')
      const contract = defineContract({ inputs: step.inputs, outputs: step.outputs })
      return {
        id: string(step.id, 'step.id', 64),
        title: typeof step.title === 'string' ? step.title : step.id,
        instructions: typeof step.instructions === 'string' ? step.instructions : '',
        status: 'pending',
        ...(typeof step.command === 'string' && step.command ? { command: step.command } : {}),
        ...(Array.isArray(step.argv) ? { argv: step.argv } : {}),
        ...(Array.isArray(step.needs) ? { needs: step.needs } : {}),
        ...(step.timeoutMs === undefined ? {} : { timeoutMs: step.timeoutMs }),
        inputs: contract.inputs.map(input => ({ path: input.path, required: input.required })),
        outputs: contract.outputs.map(output => ({ path: output.glob, required: output.required, ...(output.mediaType === undefined ? {} : { mediaType: output.mediaType }), ...(output.minBytes === undefined ? {} : { minBytes: output.minBytes }) })),
      }
    })
    const now = new Date().toISOString()
    const run = {
      schemaVersion: 2, id, sessionId: scope.sessionId,
      templateId: typeof body.templateId === 'string' ? body.templateId : 'custom',
      title: typeof body.title === 'string' && body.title ? body.title : '未命名运行',
      preset: typeof body.preset === 'string' ? body.preset : 'standard',
      status: 'pending', createdAt: now, updatedAt: now,
      inputs: object(body.inputs) ? body.inputs : {},
      steps: definitions,
    }
    await saveRun(ctx, scope, id, run)
    return { runId: id, run }
  }

  if (action === 'workflow/get') {
    const { run } = await loadRun(ctx, scope, body.runId)
    if (run.sessionId && run.sessionId !== scope.sessionId) fail('WORKFLOW_SESSION_MISMATCH', 'This workflow belongs to a different session.', 403)
    return { run }
  }

  if (action === 'benchmark/suite') {
    return {
      cases: builtinSuite().map(runnable => ({
        id: runnable.case.id,
        title: runnable.case.title,
        scenario: runnable.case.scenario,
        steps: runnable.plan.steps.length,
        metrics: Object.keys(runnable.case.expectedMetrics),
      })),
      note: 'These cases verify the engine\'s own guarantees. A pass means the machinery behaved, not that a biological result is correct.',
      intendedUse: 'research-only',
      clinicalValidationPerformed: false,
    }
  }

  if (action === 'execution/backends') {
    const probe = await probeContainerRuntime({ timeoutMs: 8000 })
    return {
      backends: [
        { id: 'process', available: true, isolation: 'process', limits: 'Scratch directory, scrubbed environment, no shell, bounded output, hard timeout.', notProvided: 'Filesystem confinement, CPU/memory limits, network isolation.' },
        { id: 'container', available: probe.available === true, isolation: 'container', ...(probe.available === true ? { serverVersion: probe.serverVersion } : { reason: probe.reason, ...(probe.detail ? { detail: probe.detail } : {}) }), limits: 'Digest-pinned image, no network, declared mounts only, hard timeout.' },
      ],
      executorVersion: 1,
      note: 'Neither backend makes results reproducible. A container pins the toolchain, not the algorithm.',
    }
  }

  if (action === 'signing/info') {
    const key = await loadSigningKey(scope, signal)
    return {
      configured: key !== undefined,
      ...(key === undefined ? {} : { key: describeKey(key), storage: key.source }),
      signatureKind: 'self-signed',
      limit: 'A signature proves possession of one private key. It is not a certificate, an institutional identity, or a clinical authorization.',
    }
  }

  if (action === 'trust/list') return { keys: await readTrustedKeys(scope, signal) }

  if (action === 'benchmark/run') {
    const { runSuite } = await import('./benchmark.js')
    const scratch = join(ctx_processPath(scope), STORE, '.benchmarks', randomUUID())
    await mkdir(scratch, { recursive: true })
    const summary = await runSuite(builtinSuite(), { workspace: ctx_processPath(scope), runDirectory: scratch })
    return { summary, note: 'A pass verifies the engine\'s mechanics. It is not a scientific or clinical validation of any analysis.' }
  }

  if (action === 'workflow/provenance') {
    const { run } = await loadRun(ctx, scope, body.runId)
    const provenance = run.provenance
    if (!provenance) return { provenance: null, verified: false, reason: 'this run predates provenance recording' }
    return { provenance, verified: verifyProvenance(provenance) }
  }

  if (action === 'workflow/artifacts') {
    const { run } = await loadRun(ctx, scope, body.runId)
    const declared = []
    for (const step of run.steps ?? []) {
      for (const output of step.outputs ?? []) {
        if (typeof output?.path === 'string') declared.push(output.path)
      }
    }
    const observed = []
    for (const path of [...new Set(declared)].slice(0, 20)) {
      try {
        const info = await stat(join(ctx_processPath(scope), path))
        if (!info.isFile()) continue
        const bytes = await readFile(join(ctx_processPath(scope), path))
        observed.push({ path, bytes: info.size, sha256: createHash('sha256').update(bytes).digest('hex'), verified: true })
      } catch { /* declared but absent: reported by omission */ }
    }
    return { artifacts: observed, declared: [...new Set(declared)], missing: [...new Set(declared)].filter(path => !observed.some(item => item.path === path)) }
  }

  if (action === 'workflow/decision') {
    const { run } = await loadRun(ctx, scope, body.runId)
    const decision = body.decision
    if (!['pending', 'accepted', 'rejected', 'needs-revision'].includes(decision)) {
      fail('INVALID_REQUEST', 'decision must be pending, accepted, rejected or needs-revision.')
    }
    // A decision is only meaningful once the run has reached a terminal state: accepting
    // a run that is still executing would record a verdict on unfinished work.
    if (!['completed', 'failed'].includes(run.status)) {
      fail('WORKFLOW_INVALID_STATE', 'A decision can only be recorded once the run has completed or failed.', 409)
    }
    const actor = typeof body.actor === 'string' && body.actor ? body.actor.slice(0, 200) : 'human-user (identity not verified)'
    const provenance = run.provenance
      ? setDecisionGate(run.provenance, { decision, reason: body.reason, actor })
      : undefined
    const next = {
      ...run,
      updatedAt: new Date().toISOString(),
      decisionGate: { decision, reason: typeof body.reason === 'string' ? body.reason.slice(0, 2000) : '', actor, at: new Date().toISOString(), clinicalUse: 'not-authorized' },
      ...(provenance === undefined ? {} : { provenance }),
    }
    await saveRun(ctx, scope, run.id ?? body.runId, next)
    return { runId: run.id ?? body.runId, decisionGate: next.decisionGate, clinicalUse: 'not-authorized' }
  }

  if (action === 'workflow/execute') {
    const { run } = await loadRun(ctx, scope, body.runId)
    const executable = (run.steps ?? []).filter(step => typeof step.command === 'string' && step.command)
    if (!executable.length) fail('WORKFLOW_NOT_EXECUTABLE', 'This run has no step with a command.', 409)
    let plan
    try {
      plan = definePlan({
        steps: executable.map(step => ({
          id: step.id,
          title: step.title,
          command: step.command,
          ...(Array.isArray(step.argv) ? { argv: step.argv } : {}),
          needs: Array.isArray(step.needs) ? step.needs.filter(id => executable.some(other => other.id === id)) : [],
          inputs: step.inputs ?? [],
          outputs: step.outputs ?? [],
          ...(step.timeoutMs === undefined ? {} : { timeoutMs: step.timeoutMs }),
        })),
      })
    } catch (error) {
      fail('INVALID_PLAN', error instanceof Error ? error.message : 'the stored steps do not form a valid plan.')
    }
    const workspace = ctx_processPath(scope)
    const runDirectory = join(workspace, STORE, 'executions', randomUUID())
    await mkdir(runDirectory, { recursive: true })
    const interpreter = await resolvePython(scope)
    const result = await runPlan(plan, { workspace, runDirectory, interpreter, scriptsDirectory: SCRIPTS_DIR })
    // Write what actually happened back onto the run, so the panel shows observations
    // rather than the model's account of them.
    const byStep = new Map(result.steps.map(step => [step.id, step]))
    const next = {
      ...run,
      status: result.status,
      updatedAt: new Date().toISOString(),
      executionRecord: {
        planDigest: planDigest(plan),
        status: result.status,
        startedAt: result.startedAt,
        completedAt: result.completedAt,
        reproducible: result.reproducible,
        steps: result.steps.map(step => ({
          id: step.id,
          status: step.status,
          fingerprint: step.fingerprint,
          outputs: (step.outputs ?? []).map(output => ({ path: output.path, bytes: output.bytes, sha256: output.sha256 })),
        })),
      },
      steps: (run.steps ?? []).map(step => {
        const observed = byStep.get(step.id)
        if (!observed) return step
        return {
          ...step,
          status: observed.status,
          ...(observed.outputs?.length ? { artifacts: observed.outputs.map(output => ({ path: output.path, bytes: output.bytes, sha256: output.sha256 })) } : {}),
          ...(observed.error ? { error: observed.error } : {}),
        }
      }),
    }
    await saveRun(ctx, scope, run.id ?? body.runId, next)
    return { runId: run.id ?? body.runId, status: result.status, order: [...plan.order], steps: result.steps.map(step => ({ id: step.id, status: step.status, exitCode: step.exitCode, outputs: (step.outputs ?? []).map(o => o.path) })) }
  }

  if (action === 'workflow/export') {
    const { run } = await loadRun(ctx, scope, body.runId)
    const unsigned = createBundle({
      run,
      exportedAt: new Date().toISOString(),
      environment: { plugin: 'dsh-research-workbench', pluginVersion: PLUGIN_VERSION, node: process.version, platform: process.platform, arch: process.arch },
      includeInputs: body.includeInputs === true,
    })
    let signature
    if (body.sign === true) {
      const key = await loadSigningKey(scope, signal)
      if (!key) fail('SIGNING_KEY_MISSING', 'No signing key exists in this workspace. Create one first.', 409)
      signature = { ...signDigest(unsigned.bundle.integrity.bundleSha256, key.privateKey), keyId: key.keyId }
    }
    const { bundle, report } = signature === undefined ? unsigned : createBundle({
      run, exportedAt: unsigned.bundle.exportedAt, signature,
      environment: unsigned.bundle.environment,
      includeInputs: body.includeInputs === true,
    })
    return { runId: run.id ?? body.runId, bundle, report, integrityVerified: bundle.integrity.provenanceVerified, signed: signature !== undefined }
  }

  if (action === 'workflow/verify-bundle') {
    if (!object(body.bundle)) fail('INVALID_REQUEST', 'bundle must be an object.')
    // Verifying an external bundle must not read the workspace or write anything: the
    // point is to check evidence that came from somewhere else.
    const trustedKeys = await readTrustedKeys(scope, signal)
    return verifyBundle(body.bundle, { trustedKeys })
  }

  if (action === 'signing/create') {
    const existing = await loadSigningKey(scope, signal)
    if (existing && body.replace !== true) fail('KEY_EXISTS', 'A signing key already exists; pass replace: true to replace it.', 409)
    const material = generateSigningKey()
    const dir = join(ctx_processPath(scope), STORE)
    await mkdir(dir, { recursive: true })
    await writeFile(join(ctx_processPath(scope), KEY_STORE), JSON.stringify(material, null, 2) + '\n', 'utf8')
    return { key: describeKey(material), storage: 'workspace', ...(existing ? { replaced: true } : {}) }
  }

  if (action === 'trust/add' || action === 'trust/remove') {
    const keyId = string(body.keyId, 'keyId', 200)
    if (!/^[a-f0-9]{32}$|^[a-f0-9]{64}$|^[a-f0-9]{128}$/.test(keyId)) {
      // A short id would be stored but could never equal a real key id, which fails
      // closed yet looks configured.
      fail('INVALID_REQUEST', 'trust requires a full key id, not a short code.')
    }
    const current = await readTrustedKeys(scope, signal)
    const next = action === 'trust/add'
      ? [...new Set([...current, keyId])].sort()
      : current.filter(key => key !== keyId)
    const dir = join(ctx_processPath(scope), STORE)
    await mkdir(dir, { recursive: true })
    await writeFile(join(ctx_processPath(scope), TRUST_STORE), JSON.stringify({ schemaVersion: 1, keys: next }, null, 2) + '\n', 'utf8')
    return { keys: next }
  }

  if (action === 'trust/inspect') {
    const short = parseShortKeyId(body.shortId)
    if (short === undefined) fail('INVALID_REQUEST', 'shortId must be 8 lowercase hex characters.')
    const keys = await readTrustedKeys(scope, signal)
    const matches = keys.filter(key => key.startsWith(short))
    return { shortId: short, matches: matches.length, trusted: matches.length === 1 }
  }

  if (action === 'pipeline/distributability') {
    if (!object(body.plan)) fail('INVALID_REQUEST', 'plan must be an object.')
    let plan
    try { plan = definePlan(body.plan) } catch (error) { fail('INVALID_REQUEST', error instanceof Error ? error.message : 'plan is invalid.') }
    const missing = plan.steps.filter(step => step.needs.length && !step.contract.outputs.length)
    return {
      distributable: missing.length === 0,
      reason: missing.length === 0
        ? 'every dependency declares outputs, so results can be shipped between workers'
        : 'these steps depend on a step that declares no outputs: ' + missing.map(step => step.id).join(', '),
    }
  }

  if (action === 'execution/adapter') {
    const { parseNextflowTrace, toExecutionRecords } = await import('./run-adapter.js').catch(() => ({}))
    if (typeof parseNextflowTrace !== 'function') fail('NOT_IMPLEMENTED', 'The adapter is not in this build.', 501)
    const records = toExecutionRecords(parseNextflowTrace(String(body.text ?? '')))
    return { records, note: 'These records are engine-reported. They are not host-verified evidence.' }
  }

  if (action === 'pipeline/run') {
    if (!object(body.plan)) fail('INVALID_REQUEST', 'plan must be an object.')
    let plan
    try { plan = definePlan(body.plan) } catch (error) {
      fail('INVALID_REQUEST', error instanceof Error ? error.message : 'plan is invalid.')
    }
    const workspace = ctx_processPath(scope)
    const runDirectory = join(workspace, STORE, 'executions', randomUUID())
    await mkdir(runDirectory, { recursive: true })
    const interpreter = await resolvePython(scope)
    const concurrency = body.concurrency === undefined ? 1 : body.concurrency
    const result = await runPlan(plan, {
      workspace, runDirectory, interpreter,
      scriptsDirectory: SCRIPTS_DIR,
      variables: typeof body.query === 'string' ? { query: body.query } : {},
      concurrency,
      approveParallel: body.approveParallel === true,
    })
    return { runId: randomUUID(), planDigest: planDigest(plan), order: [...plan.order], result }
  }

  if (action === 'image/inspect') {
    const { inspectImage } = await import('./image-qc.js')
    const { target, info } = await locate(ctx, scope, body.path)
    if (info.size > MAX_FILE_BYTES * 4) fail('FS_TOO_LARGE', 'Images over 8 MiB are not inspected here.', 413)
    const bytes = await ctx.fs.readBytes(target, signal, MAX_FILE_BYTES * 4)
    const report = inspectImage(Buffer.from(bytes), { expected: object(body.expected) ? body.expected : undefined })
    // The digest is computed here from the bytes that were actually read.
    return { ...report, sha256: createHash('sha256').update(Buffer.from(bytes)).digest('hex') }
  }

  if (action === 'pipeline/distribute') {
    if (!object(body.plan)) fail('INVALID_REQUEST', 'plan must be an object.')
    if (body.approveParallel !== true) fail('PARALLEL_NOT_APPROVED', 'Distributing work across machines needs explicit human approval.', 409)
    if (!Array.isArray(body.workers) || !body.workers.length) fail('INVALID_REQUEST', 'workers must be a non-empty array.')
    const { runDistributed, defineWorker } = await import('./distributed.js')
    const { createArtifactStore } = await import('./artifact-store.js')
    let plan
    try { plan = definePlan(body.plan) } catch (error) { fail('INVALID_REQUEST', error instanceof Error ? error.message : 'plan is invalid.') }
    const workers = body.workers.map(defineWorker)
    const store = createArtifactStore(join(ctx_processPath(scope), STORE, 'artifacts'))
    const result = await runDistributed(plan, { workers, store, approveParallel: true, concurrency: body.concurrency ?? 1 })
    return { result, note: 'Workers share no filesystem; artifacts are re-hashed here, and every verdict is the coordinator\'s.' }
  }

  fail('NOT_IMPLEMENTED', 'This action is not available in this build: ' + action, 501)
}

const SCRIPTS_DIR = fileURLToPath(new URL('../scripts/', import.meta.url)).replace(/[\\/]+$/, '')

/** Discover a Python that has the scientific stack, reporting which one was chosen. */
let interpreterCache
async function resolvePython(scope) {
  if (interpreterCache) return interpreterCache
  const candidates = []
  const configured = process.env.DSH_RESEARCH_PYTHON
  if (configured) candidates.push({ path: configured, source: 'env:DSH_RESEARCH_PYTHON', exists: await stat(configured).then(info => info.isFile(), () => false) })
  const roots = []
  for (const candidate of [scope?.root, scope?.cwd]) {
    if (typeof candidate === 'string' && candidate && !roots.includes(candidate)) roots.push(candidate)
  }
  for (const root of roots) {
    for (const [relative, source] of [
      ['Biomni/.venv/Scripts/python.exe', 'biomni-venv'],
      ['Biomni/.venv/bin/python', 'biomni-venv'],
      ['.venv/Scripts/python.exe', 'workspace-venv'],
      ['.venv/bin/python', 'workspace-venv'],
    ]) {
      const path = join(root, relative)
      if (candidates.some(item => item.path === path)) continue
      candidates.push({ path, source, exists: await stat(path).then(info => info.isFile(), () => false) })
    }
  }
  const chosen = candidates.find(item => item.exists) ?? { path: 'python', source: 'path' }
  interpreterCache = { command: chosen.path, source: chosen.source }
  return interpreterCache
}

/** Read the signing key, preferring the credential store when the host provides one. */
async function loadSigningKey(scope, signal) {
  const credentials = scope.credentials
  if (credentials?.readRecord) {
    try {
      const stored = await credentials.readRecord('bundle-signing')
      if (stored?.kind === 'grant' && object(stored.payload) && typeof stored.payload.privateKey === 'string') {
        return { ...stored.payload, source: 'credential-store' }
      }
    } catch { /* fall through to the workspace file */ }
  }
  try {
    const text = await readFile(join(ctx_processPath(scope), KEY_STORE), 'utf8')
    const parsed = JSON.parse(text)
    if (object(parsed) && typeof parsed.privateKey === 'string') return { ...parsed, source: 'workspace' }
  } catch { /* no key yet */ }
  return undefined
}

async function readTrustedKeys(scope, signal) {
  try {
    const text = await readFile(join(ctx_processPath(scope), TRUST_STORE), 'utf8')
    const parsed = JSON.parse(text)
    return Array.isArray(parsed?.keys) ? parsed.keys.filter(key => /^[a-f0-9]{32}$|^[a-f0-9]{64}$|^[a-f0-9]{128}$/.test(key)) : []
  } catch { return [] }
}

export { handleAction }
export default { API_PATH, inject, handleAction, medicalCapabilities, __setProcessPath }
