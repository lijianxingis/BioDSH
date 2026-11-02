#!/usr/bin/env node
/**
 * An HTTP API for the engine.
 *
 * This is what turns a library into a service: a client can submit work, watch a queue,
 * read the metrics, and fetch a report. The panel and the CLI both talk to the same
 * library calls the API does.
 *
 * Security posture, stated rather than implied:
 *  - every request is scoped to a tenant derived from the verified token, or from the
 *    workspace when authentication is off;
 *  - /metrics needs the same token as everything else, because the run counts of another
 *    tenant are not public;
 *  - a request cannot name its own tenant.
 */
import { createServer } from 'node:http'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { definePlan, runPlan, planDigest } from '../lib/workflow-engine.js'
import { workflowFromDsl } from '../lib/dsl.js'
import { createProvenance, recordArtifact, recordExecution, verifyProvenance } from '../lib/provenance.js'
import { createBundle, signBundle, verifyBundle } from '../lib/bundle.js'
import { createMetrics, recordRun } from '../lib/metrics.js'
import { renderHtmlReport } from '../lib/report-html.js'
import { toDot } from '../lib/graph.js'
import { localPrincipal, verifyJwt, principalFromClaims, requiresRole, isUnauthenticated } from '../lib/auth.js'
import { tenantRunsDirectory, stampTenant, assertOwned } from '../lib/tenancy.js'
import '../lib/executors-builtin.js'
import { listExecutors } from '../lib/executors.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const workspace = resolve(process.env.DSH_RESEARCH_WORKSPACE ?? process.cwd())
const port = Number(process.env.PORT ?? 4174)
const host = process.env.HOST ?? '127.0.0.1'
const authMode = process.env.DSH_AUTH_MODE ?? 'none'

const metrics = createMetrics()

// A small in-process queue. Work is queued and run one at a time by default, because two
// concurrent runs in one workspace would write the same files.
const queue = []
let running = false
const jobs = new Map()

function json(response, status, body, headers = {}) {
  const text = JSON.stringify(body)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(text),
    'cache-control': 'no-store',
    ...headers,
  })
  response.end(text)
}

function text(response, status, body, type = 'text/plain; charset=utf-8') {
  response.writeHead(status, { 'content-type': type, 'content-length': Buffer.byteLength(body) })
  response.end(body)
}

async function readBody(request, limit = 8 * 1024 * 1024) {
  let size = 0
  const chunks = []
  for await (const chunk of request) {
    size += chunk.length
    if (size > limit) {
      const error = new Error('the request body is too large')
      error.code = 'BODY_TOO_LARGE'
      throw error
    }
    chunks.push(chunk)
  }
  if (!chunks.length) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch {
    const error = new Error('the request body is not valid JSON')
    error.code = 'INVALID_BODY'
    throw error
  }
}

async function authenticate(request) {
  const header = request.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined
  if (authMode === 'none') {
    // Reported as unauthenticated so nothing downstream can mistake it for a verified
    // identity.
    return localPrincipal(workspace)
  }
  if (authMode === 'oidc') {
    if (!token) {
      const error = new Error('a bearer token is required')
      error.code = 'UNAUTHENTICATED'
      throw error
    }
    const keysPath = process.env.DSH_JWKS_FILE
    if (!keysPath) {
      const error = new Error('DSH_JWKS_FILE is not set, so tokens cannot be verified')
      error.code = 'AUTH_MISCONFIGURED'
      throw error
    }
    const keyset = JSON.parse(await readFile(keysPath, 'utf8'))
    const claims = verifyJwt(token, {
      keys: keyset.keys ?? keyset,
      issuer: process.env.DSH_JWT_ISSUER,
      audience: process.env.DSH_JWT_AUDIENCE,
    })
    return principalFromClaims(claims, { tenantClaim: process.env.DSH_TENANT_CLAIM ?? 'tenant' })
  }
  const error = new Error('unknown DSH_AUTH_MODE: ' + authMode)
  error.code = 'AUTH_MISCONFIGURED'
  throw error
}

async function saveRun(principal, run) {
  const dir = join(workspace, tenantRunsDirectory(workspace, principal.tenant), run.id)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'run.json'), JSON.stringify(run, null, 2) + '\n', 'utf8')
}

async function listRuns(principal) {
  const dir = join(workspace, tenantRunsDirectory(workspace, principal.tenant))
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
  const runs = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    try {
      const parsed = JSON.parse(await readFile(join(dir, entry.name, 'run.json'), 'utf8'))
      if (parsed.tenant !== principal.tenant) continue
      runs.push(parsed)
    } catch { /* a half-written record is skipped */ }
  }
  return runs.sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))
}

async function loadRun(principal, id) {
  const dir = join(workspace, tenantRunsDirectory(workspace, principal.tenant), id)
  let parsed
  try { parsed = JSON.parse(await readFile(join(dir, 'run.json'), 'utf8')) } catch { parsed = undefined }
  return assertOwned(parsed, principal.tenant)
}

async function drainQueue() {
  if (running) return
  running = true
  while (queue.length) {
    const job = queue.shift()
    jobs.set(job.id, { ...job, state: 'running' })
    try {
      const plan = job.plan
      const startedAt = new Date().toISOString()
      const result = await runPlan(plan, { workspace, runDirectory: join(workspace, '.dsh/research-workbench/executions', job.id) })
      let provenance = createProvenance({ runId: job.id, sessionId: job.principal.id, templateId: job.templateId ?? 'api', preset: 'standard', inputs: {}, now: startedAt })
      for (const step of result.steps) {
        provenance = recordExecution(provenance, { stepId: step.id, tool: 'workflow-engine', stepFingerprint: step.fingerprint, exitCode: step.exitCode, status: step.status })
        for (const artifact of step.outputs ?? []) {
          provenance = recordArtifact(provenance, { path: artifact.path, label: artifact.path, bytes: artifact.bytes, version: 'v1', checksum: { algorithm: 'sha256', value: artifact.sha256 } })
        }
      }
      const run = stampTenant({
        schemaVersion: 2, id: job.id, status: result.status,
        title: job.title ?? job.id, templateId: job.templateId ?? 'api',
        // These two are copied straight into an evidence bundle, so they must exist:
        // a missing key becomes undefined, and an undefined key has no JSON form.
        preset: job.preset ?? 'standard',
        inputs: {},
        createdAt: startedAt, updatedAt: new Date().toISOString(),
        steps: result.steps.map(step => ({
          id: step.id, title: step.label, status: step.status,
          artifacts: (step.outputs ?? []).map(a => ({ path: a.path, bytes: a.bytes, sha256: a.sha256 })),
          ...(step.error ? { error: step.error } : {}),
        })),
        provenance,
      }, job.principal.tenant)
      await saveRun(job.principal, run)
      jobs.set(job.id, { ...job, state: 'finished', status: result.status })
      recordRun(metrics, result)
    } catch (error) {
      jobs.set(job.id, { ...job, state: 'failed', error: error.message })
      metrics.increment('runs_total', { status: 'error' })
    }
  }
  running = false
}

const routes = [
  ['GET', /^\/health$/, async (request, response) => json(response, 200, { ok: true, auth: authMode, executors: listExecutors().map(e => e.id) })],
  ['GET', /^\/metrics$/, async (request, response, principal) => {
    if (isUnauthenticated(principal) && authMode !== 'none') return json(response, 401, { error: 'authentication required' })
    return text(response, 200, metrics.render(), 'text/plain; version=0.0.4; charset=utf-8')
  }],
  ['GET', /^\/api\/executors$/, async (request, response) => json(response, 200, { executors: listExecutors() })],
  ['GET', /^\/api\/runs$/, async (request, response, principal) => {
    const runs = await listRuns(principal)
    return json(response, 200, { runs: runs.map(run => ({ id: run.id, title: run.title, status: run.status, createdAt: run.createdAt, updatedAt: run.updatedAt })) })
  }],
  ['POST', /^\/api\/runs$/, async (request, response, principal) => {
    if (!requiresRole(principal, 'operator') && principal.roles?.[0] !== 'owner') {
      return json(response, 403, { error: 'this principal may not submit runs' })
    }
    const body = await readBody(request)
    let plan
    try {
      plan = body.dsl ? definePlan(workflowFromDsl(body.dsl)) : definePlan(body.plan)
    } catch (error) {
      return json(response, 400, { error: error.message })
    }
    const id = new Date().toISOString().replace(/[:.]/g, '-') + '-' + (body.templateId ?? 'api')
    queue.push({ id, plan, principal, title: body.title, templateId: body.templateId })
    jobs.set(id, { id, state: 'queued', title: body.title, principal })
    metrics.increment('queued_total')
    void drainQueue()
    return json(response, 202, { id, queuePosition: queue.length, planDigest: planDigest(plan) }, { location: '/api/runs/' + id })
  }],
  ['GET', /^\/api\/runs\/([^/]+)$/, async (request, response, principal, [id]) => {
    const run = await loadRun(principal, id)
    return json(response, 200, { run, verified: verifyProvenance(run.provenance) })
  }],
  ['GET', /^\/api\/runs\/([^/]+)\/report$/, async (request, response, principal, [id]) => {
    const run = await loadRun(principal, id)
    const html = renderHtmlReport({ run, plan: null, provenance: run.provenance, verified: verifyProvenance(run.provenance) })
    return text(response, 200, html, 'text/html; charset=utf-8')
  }],
  ['GET', /^\/api\/runs\/([^/]+)\/graph\.dot$/, async (request, response, principal, [id]) => {
    const run = await loadRun(principal, id)
    const plan = definePlan({ steps: (run.steps ?? []).map(step => ({ id: step.id, command: 'x', ...(step.needs ? { needs: step.needs } : {}) })) })
    return text(response, 200, toDot(plan, { title: run.id }), 'text/vnd.graphviz; charset=utf-8')
  }],
  ['POST', /^\/api\/runs\/([^/]+)\/bundle$/, async (request, response, principal, [id]) => {
    const run = await loadRun(principal, id)
    const { generateSigningKey } = await import('../lib/signing.js')
    const keyPath = join(workspace, '.dsh/research-workbench/signing-key.json')
    let key
    try { key = JSON.parse(await readFile(keyPath, 'utf8')) } catch {
      key = generateSigningKey()
      await mkdir(dirname(keyPath), { recursive: true })
      await writeFile(keyPath, JSON.stringify(key, null, 2) + '\n', 'utf8')
    }
    const { bundle } = createBundle({ run, exportedAt: new Date().toISOString(), environment: { pluginVersion: '0.1.0', publicKey: key.publicKey } })
    const signed = signBundle(bundle, key.privateKey, key.keyId)
    return json(response, 201, { bundle: signed, keyId: key.keyId, note: 'self-signed: it proves possession of a key, not who owns it' })
  }],
  ['GET', /^\/api\/queue$/, async (request, response, principal) => {
    const mine = [...jobs.values()].filter(job => job.principal?.tenant === principal.tenant)
    return json(response, 200, {
      active: mine.filter(job => job.state === 'running').length,
      queued: mine.filter(job => job.state === 'queued').length,
      jobs: mine.map(job => ({ id: job.id, state: job.state, title: job.title ?? null, status: job.status ?? null, error: job.error ?? null })),
    })
  }],
  ['DELETE', /^\/api\/queue\/([^/]+)$/, async (request, response, principal, [id]) => {
    const index = queue.findIndex(job => job.id === id && job.principal?.tenant === principal.tenant)
    if (index === -1) return json(response, 404, { error: 'no such queued job' })
    queue.splice(index, 1)
    jobs.set(id, { ...jobs.get(id), state: 'cancelled' })
    return json(response, 200, { cancelled: id })
  }],
  ['GET', /^\/api\/queue\/ui\.js$/, async (request, response) => {
    const script = await readFile(join(HERE, '..', 'site', 'queue.js'), 'utf8').catch(() => '')
    return text(response, 200, script, 'text/javascript; charset=utf-8')
  }],
  ['GET', /^\/api\/queue\/ui$/, async (request, response) => {
    const page = await readFile(join(HERE, '..', 'site', 'queue.html'), 'utf8').catch(() => '<p>queue.html missing</p>')
    return text(response, 200, page, 'text/html; charset=utf-8')
  }],
]

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://' + host)
  let principal
  try {
    principal = await authenticate(request)
  } catch (error) {
    return json(response, 401, { error: error.message, code: error.code ?? 'UNAUTHENTICATED' })
  }
  for (const [method, pattern, handler] of routes) {
    if (request.method !== method) continue
    const match = pattern.exec(url.pathname)
    if (!match) continue
    try {
      return await handler(request, response, principal, match.slice(1))
    } catch (error) {
      const code = error.code ?? 'INTERNAL'
      const status = code === 'NOT_FOUND' ? 404 : code === 'UNAUTHENTICATED' ? 401 : 500
      return json(response, status, { error: error.message, code })
    }
  }
  json(response, 404, { error: 'no such route: ' + request.method + ' ' + url.pathname })
})

server.listen(port, host, () => {
  console.log('api      : http://' + host + ':' + port)
  console.log('auth mode: ' + authMode + (authMode === 'none' ? '  (no identity verification)' : ''))
  console.log('workspace: ' + workspace)
})
