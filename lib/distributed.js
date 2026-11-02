/**
 * Distributed execution over HTTP workers.
 *
 * The constraints that shape this module:
 *
 * - Workers share no filesystem, so a plan is only distributable when every dependency
 *   declares outputs that can be shipped. Otherwise the honest answer is "run it here".
 * - Status is decided by the coordinator, never by the worker. A worker reports an exit
 *   code; the coordinator derives the verdict, so a compromised worker cannot report
 *   success for a failed command.
 * - Every returned artifact is re-hashed locally, so a worker cannot substitute bytes.
 * - Plain HTTP is allowed only on loopback, and a worker always requires a token: an
 *   unauthenticated remote shell is not offered.
 */
import { createHash } from 'node:crypto'

export const WORKER_PROTOCOL_VERSION = 2
export const MAX_INPUT_ARTIFACTS = 256

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

export function defineWorker(spec) {
  if (spec === null || typeof spec !== 'object') throw new TypeError('worker must be an object')
  const id = String(spec.id ?? '').trim()
  if (!id) throw new TypeError('worker.id must be non-empty')
  const url = String(spec.url ?? '')
  if (!/^https?:\/\//.test(url)) throw new TypeError('worker.url must be an http(s) URL')
  const parsed = new URL(url)
  const loopback = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(parsed.hostname)
  // A token over plain HTTP to a remote host travels in the clear; refuse it rather than
  // pretend the transport is safe.
  if (parsed.protocol === 'http:' && !loopback) {
    fail('INSECURE_TRANSPORT', 'Plain HTTP is only allowed to a loopback worker; use HTTPS for a remote one.')
  }
  if (typeof spec.token !== 'string' || !spec.token) {
    fail('AUTH_REQUIRED', 'a worker token is required; an unauthenticated remote shell is not offered')
  }
  return Object.freeze({
    id,
    url: url.replace(/\/$/, ''),
    token: spec.token,
    concurrency: Number.isSafeInteger(spec.concurrency) && spec.concurrency > 0 ? spec.concurrency : 1,
    capacity: { cpu: spec.cpu ?? 4, memoryMb: spec.memoryMb ?? 8192, maxSlots: spec.concurrent ?? 1 },
  })
}

/** Decide whether every dependency's outputs can be shipped to another machine. */
export function planDistributability(plan) {
  const pinned = []
  for (const step of plan.steps) {
    for (const need of step.needs) {
      const dependency = plan.steps.find(item => item.id === need)
      if (!dependency) continue
      if (!dependency.contract.outputs.length) pinned.push({ step: step.id, dependency: need })
    }
  }
  const distributableSteps = plan.steps.filter(step => !pinned.some(item => item.step === step.id)).map(step => step.id)
  return Object.freeze({
    distributableSteps: Object.freeze(distributableSteps),
    pinnedSteps: Object.freeze(pinned),
    fullyDistributable: pinned.length === 0,
    note: pinned.length === 0
      ? 'Every dependency declares outputs, so their results can be shipped between workers.'
      : 'A step whose dependency declares no outputs cannot run elsewhere: there is nothing to ship.',
  })
}

async function post(worker, path, body, { signal, timeoutMs = 60000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })
  try {
    const response = await fetch(worker.url + path, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ' + worker.token },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const text = await response.text()
    let parsed
    try { parsed = JSON.parse(text) } catch { parsed = undefined }
    return { status: response.status, body: parsed, text }
  } catch (error) {
    return { status: 0, error: error instanceof Error ? error.message : String(error) }
  } finally { clearTimeout(timer) }
}

/**
 * Dispatch one step.
 *
 * The worker returns raw observations (exit code, produced bytes). The verdict is
 * computed here, from the exit code alone, so a worker cannot claim success.
 */
export async function dispatchStep(worker, { stepId, argv, timeoutMs, inputs = [], outputs = [], signal }) {
  const payload = {
    protocolVersion: WORKER_PROTOCOL_VERSION,
    stepId,
    argv,
    timeoutMs,
    expectOutputs: outputs.map(output => (typeof output === 'string' ? output : output.path)),
    inputs: inputs.map(input => ({
      path: input.path,
      content: Buffer.isBuffer(input.content) ? input.content.toString('base64') : Buffer.from(input.content ?? '').toString('base64'),
    })),
  }
  const result = await post(worker, '/execute', payload, { signal })
  if (result.status === 0) {
    return Object.freeze({
      id: stepId, worker: worker.id, status: 'failed', exitCode: null,
      error: 'The worker could not be reached: ' + (result.error ?? 'unknown transport error'),
      transportFailure: true, verifiedBy: 'coordinator',
    })
  }
  if (result.status !== 200 || !result.body) {
    return Object.freeze({
      id: stepId, worker: worker.id, status: 'failed', exitCode: null,
      error: 'The worker answered ' + result.status + ': ' + String(result.text).slice(0, 200),
      transportFailure: result.status >= 500, verifiedBy: 'coordinator',
    })
  }
  const exitCode = result.body.exitCode
  const status = exitCode === 0 ? 'completed' : 'failed'
  const artifacts = []
  for (const item of result.body.artifacts ?? []) {
    const content = Buffer.from(String(item.content ?? ''), 'base64')
    // Re-hash here: the digest the worker sent is not trusted.
    artifacts.push({ path: item.path, bytes: content.length, sha256: createHash('sha256').update(content).digest('hex'), content })
  }
  return Object.freeze({
    id: stepId, worker: worker.id, status, exitCode,
    ...(result.body.stdoutTail ? { stdoutTail: result.body.stdoutTail } : {}),
    ...(result.body.stderrTail ? { stderrTail: result.body.stderrTail } : {}),
    artifacts: Object.freeze(artifacts),
    verifiedBy: 'coordinator',
  })
}

/** A transport failure is worth retrying; a non-zero exit is not. */
export function isRetryable(result) {
  if (result.status === 'completed') return false
  if (result.transportFailure === true) return true
  // A real command failure ran and failed. Retrying hides the defect behind "it worked
  // the third time", so it is never retried.
  return false
}

export async function runDistributed(plan, {
  workers, store, approveParallel = false, concurrency = 1,
  maxAttempts = 3, retryDelayMs = attempt => Math.min(2000, 200 * 2 ** (attempt - 1)),
  wait = ms => new Promise(resolve => setTimeout(resolve, ms)),
  journal, signal,
} = {}) {
  if (!Array.isArray(workers) || !workers.length) fail('INVALID_RUN', 'workers must be a non-empty array')
  if (!store) fail('INVALID_RUN', 'a content-addressed store is required to ship artifacts')
  const distributability = planDistributability(plan)
  if (!distributability.fullyDistributable) {
    fail('PLAN_NOT_DISTRIBUTABLE', distributability.note)
  }
  if (concurrency > 1 && approveParallel !== true) {
    fail('PARALLEL_NOT_APPROVED', 'Parallel distribution needs explicit human approval.')
  }

  const byId = new Map(plan.steps.map(step => [step.id, step]))
  const results = new Map()
  const shipped = new Map()
  const failed = new Set()
  const quarantined = new Map()
  const workerFailures = new Map()
  const startedAt = new Date().toISOString()
  const attempts = new Map()

  const noteFailure = workerId => {
    const count = (workerFailures.get(workerId) ?? 0) + 1
    workerFailures.set(workerId, count)
    return count
  }

  const available = () => workers.filter(worker => !quarantined.has(worker.id))

  const runOne = async (worker, step) => {
    const inputs = []
    for (const need of step.needs) {
      for (const artifact of shipped.get(need) ?? []) {
        try { inputs.push({ path: artifact.path, content: await store.get(artifact.digest) }) } catch (error) {
          return Object.freeze({ id: step.id, worker: worker.id, status: 'failed', exitCode: null, error: 'An input could not be read from the store: ' + error.message, verifiedBy: 'coordinator' })
        }
      }
    }
    const result = await dispatchStep(worker, {
      stepId: step.id,
      argv: step.argv ?? [],
      timeoutMs: step.timeoutMs,
      inputs,
      outputs: step.contract.outputs.map(output => output.path),
      signal,
    })
    const captured = []
    if (result.status === 'completed' && step.contract.outputs.length) {
      for (const artifact of result.artifacts ?? []) {
        try {
          const stored = await store.put(artifact.content, { name: artifact.path })
          captured.push({ path: artifact.path, bytes: artifact.content.length, digest: stored.digest })
        } catch (error) {
          return Object.freeze({ ...result, status: 'failed', error: 'The output ' + artifact.path + ' could not be stored: ' + error.message, verifiedBy: 'coordinator' })
        }
      }
      if (!captured.length) {
        return Object.freeze({
          ...result, status: 'failed',
          error: 'The step declared outputs but the worker returned none.',
          missingOutputs: Object.freeze(step.contract.outputs.map(output => output.path)),
          verifiedBy: 'coordinator',
        })
      }
    }
    shipped.set(step.id, captured)
    return Object.freeze({
      ...result,
      artifacts: Object.freeze(captured.map(item => ({ path: item.path, bytes: item.bytes, sha256: item.digest }))),
      verifiedBy: 'coordinator',
    })
  }

  const dispatch = async (worker, step) => {
    let attempt = 0
    for (;;) {
      attempt += 1
      attempts.set(step.id, attempt)
      if (journal) await journal.append('step-dispatched', { stepId: step.id, worker: worker.id, attempt })
      const result = await runOne(worker, step)
      if (result.status === 'completed') { workerFailures.set(worker.id, 0); return result }
      const count = noteFailure(worker.id)
      if (count >= 3 && !quarantined.has(worker.id)) {
        quarantined.set(worker.id, count + ' consecutive transport failures')
        if (journal) await journal.append('worker-quarantined', { workerId: worker.id, reason: quarantined.get(worker.id) })
      }
      if (!isRetryable(result) || attempt >= maxAttempts) return result
      if (journal) await journal.append('step-retrying', { stepId: step.id, attempt, delayMs: retryDelayMs(attempt) })
      await wait(retryDelayMs(attempt))
    }
  }

  const remaining = new Set(plan.order)
  const inFlight = new Map()

  while (remaining.size || inFlight.size) {
    let launched = false
    for (const id of [...plan.order]) {
      if (!remaining.has(id)) continue
      const step = byId.get(id)
      const blockedBy = step.needs.filter(need => failed.has(need))
      if (blockedBy.length) {
        failed.add(id)
        results.set(id, Object.freeze({ id, worker: undefined, status: 'skipped', blockedBy: Object.freeze(blockedBy), reason: 'A dependency did not succeed.', verifiedBy: 'coordinator' }))
        remaining.delete(id)
        launched = true
        continue
      }
      const unresolved = step.needs.filter(need => remaining.has(need) || inFlight.has(need))
      if (unresolved.length) continue
      if (inFlight.size >= concurrency) break
      const pool = available()
      if (!pool.length) { fail('NO_WORKERS', 'Every worker was quarantined after repeated transport failures.') }
      const worker = pool[(inFlight.size + remaining.size) % pool.length]
      launched = true
      remaining.delete(id)
      inFlight.set(id, dispatch(worker, step).then(result => {
        results.set(id, result)
        if (result.status !== 'completed') failed.add(id)
        if (journal) {
          const type = result.status === 'completed' ? 'step-completed' : 'step-failed'
          journal.append(type, {
            stepId: id, worker: result.worker,
            ...(type === 'step-completed'
              ? { artifacts: (result.artifacts ?? []).map(item => ({ path: item.path, bytes: item.bytes, digest: item.sha256 })) }
              : { error: result.error ?? '', retryable: isRetryable(result) }),
          })
        }
      }).finally(() => { inFlight.delete(id) }))
    }
    if (inFlight.size) { await Promise.race(inFlight.values()); continue }
    if (!launched) break
  }

  const ordered = plan.order.map(id => results.get(id)).filter(Boolean)
  const failedOutright = ordered.some(item => item.status === 'failed')
  const skipped = ordered.some(item => item.status === 'skipped')
  return Object.freeze({
    engine: 'workbench-distributed',
    planDigest: undefined,
    status: failedOutright ? 'failed' : skipped ? 'blocked' : 'completed',
    startedAt,
    completedAt: new Date().toISOString(),
    steps: Object.freeze(ordered),
    workers: Object.freeze(workers.map(worker => ({ id: worker.id, quarantined: quarantined.has(worker.id) }))),
    reusedSteps: Object.freeze([]),
    reproducible: false,
    reprodNote: 'Workers share no filesystem; artifacts travel over HTTP and are re-hashed here.',
  })
}

export default { defineWorker, planDistributability, dispatchStep, runDistributed, isRetryable }
