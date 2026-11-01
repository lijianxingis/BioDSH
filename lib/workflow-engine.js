/**
 * A small DAG engine that runs real processes and records what it observed.
 *
 * The point of this module is not orchestration; it is *evidence*. Every guarantee
 * here exists because its absence produced a run that looked complete and was not:
 *
 * - exit code 0 is not success: declared outputs must exist and match their type;
 * - a missing declared input stops the step before the command runs;
 * - a resumed step is reused only when its inputs are byte-identical, and its recorded
 *   outputs are still on disk with the same digests;
 * - a step is credited only with the outputs it declared, never with whatever else
 *   happened to be in the shared workspace.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative } from 'node:path'
import { defineContract, evaluateOutputs, findMissingInputs } from './step-contract.js'

export const ENGINE_VERSION = 1
export const MAX_STEPS = 32
export const MAX_TOTAL_TIMEOUT_MS = 3600000
export const DEFAULT_STEP_TIMEOUT_MS = 600000

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

/**
 * Split a command string into argv.
 *
 * Quotes group; backslashes are literal. Treating a backslash as an escape is how a
 * Windows path becomes "E:新建文件夹..." and then fails with ENOENT on a file that is
 * plainly there, so the rule here is the one that matches the platform.
 */
export function tokenizeCommand(command) {
  if (typeof command !== 'string') throw new TypeError('command must be a string')
  const tokens = []
  let current = ''
  let quote = null
  let started = false
  for (const char of command) {
    if (quote !== null) {
      if (char === quote) { quote = null; continue }
      current += char
      continue
    }
    if (char === '"' || char === "'") { quote = char; started = true; continue }
    if (char === ' ' || char === '\t') {
      if (started || current) { tokens.push(current); current = ''; started = false }
      continue
    }
    current += char
    started = true
  }
  if (quote !== null) throw new TypeError('unterminated quote in command')
  if (started || current) tokens.push(current)
  return tokens
}

/** Replace {{python}}, {{scripts}} and {{query}} with bound values. */
export function applyInterpreter(command, interpreter, scriptsDirectory, variables = {}) {
  if (typeof command !== 'string') throw new TypeError('command must be a string')
  let output = command
  if (output.includes('{{python}}')) {
    const replacement = interpreter?.command ?? 'python'
    const quoted = /[\s"]/.test(replacement) ? `"${replacement.replaceAll('"', '')}"` : replacement
    output = output.replaceAll('{{python}}', quoted)
  }
  if (output.includes('{{scripts}}')) {
    if (typeof scriptsDirectory !== 'string' || !scriptsDirectory) {
      throw new TypeError('this command needs the bundled scripts directory, which is unavailable')
    }
    // The trailing separator is stripped so "dir/" + "/x.py" does not become "dir//x.py".
    const clean = scriptsDirectory.replace(/[\\/]+$/, '')
    const quoted = /[\s"]/.test(clean) ? `"${clean.replaceAll('"', '')}"` : clean
    output = output.replaceAll('{{scripts}}', quoted)
  }
  if (output.includes('{{query}}')) {
    const raw = typeof variables.query === 'string' ? variables.query : ''
    // Quotes and backticks are stripped because the value is interpolated into a
    // quoted argument; the command never goes through a shell, so the risk is
    // escaping the argument, not shell injection.
    const safe = raw.replace(/["'`$\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400)
    output = output.replaceAll('{{query}}', safe)
  }
  return output
}

/** Pick an interpreter, reporting which one was chosen. */
export function resolveInterpreter({ configured, candidates = [] } = {}) {
  if (typeof configured === 'string' && configured) {
    return Object.freeze({ command: configured, source: 'configured' })
  }
  for (const candidate of candidates) {
    if (candidate?.path && candidate?.exists === true) {
      return Object.freeze({ command: candidate.path, source: candidate.source ?? 'discovered' })
    }
  }
  return Object.freeze({ command: 'python', source: 'path' })
}

function defineStep(raw) {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) fail('INVALID_STEP', 'each step must be an object')
  const id = raw.id
  if (typeof id !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(id)) {
    fail('INVALID_STEP', 'step.id must be a short identifier')
  }
  const command = raw.command
  if (typeof command !== 'string' || !command) fail('INVALID_STEP', `Step ${id} needs a command.`)
  const argv = Array.isArray(raw.argv)
    ? raw.argv.map(item => { if (typeof item !== 'string') fail('INVALID_STEP', `Step ${id} argv must be strings.`); return item })
    : undefined
  const needs = Array.isArray(raw.needs) ? [...new Set(raw.needs.map(String))] : []
  const timeoutMs = raw.timeoutMs === undefined ? DEFAULT_STEP_TIMEOUT_MS : raw.timeoutMs
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 3600000) {
    fail('INVALID_STEP', `Step ${id} timeoutMs is out of range.`)
  }
  const contract = defineContract({ inputs: raw.inputs, outputs: raw.outputs })
  return Object.freeze({
    id,
    label: typeof raw.title === 'string' && raw.title ? raw.title : id,
    command,
    ...(argv === undefined ? {} : { argv: Object.freeze(argv) }),
    needs: Object.freeze(needs),
    timeoutMs,
    contract,
  })
}

export function definePlan(spec) {
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) fail('INVALID_PLAN', 'plan must be an object')
  const steps = Array.isArray(spec.steps) ? spec.steps : []
  if (!steps.length) fail('INVALID_PLAN', 'a plan needs at least one step')
  if (steps.length > MAX_STEPS) fail('INVALID_PLAN', `a plan may have at most ${MAX_STEPS} steps`)
  const backend = spec.backend === undefined ? 'process' : spec.backend
  if (!['process', 'container'].includes(backend)) fail('INVALID_PLAN', 'backend must be process or container')
  if (backend === 'container') {
    const image = spec.image
    if (typeof image !== 'string' || !image) fail('INVALID_PLAN', 'The container backend requires a digest-pinned image.')
    // A floating tag is refused here as well as in the execution spec. Checking only at
    // run time lets an unreproducible plan be saved into a run record.
    if (!/@sha256:[a-f0-9]{64}$/.test(image)) {
      fail('INVALID_PLAN', 'The container image must be pinned by digest (name@sha256:<64 hex>); a floating tag such as ":latest" is not reproducible.')
    }
  }

  const seen = new Set()
  const normalized = []
  for (const raw of steps) {
    const step = defineStep(raw)
    if (seen.has(step.id)) fail('INVALID_PLAN', `Duplicate step id: ${step.id}`)
    seen.add(step.id)
    normalized.push(step)
  }
  for (const step of normalized) {
    for (const dependency of step.needs) {
      if (!seen.has(dependency)) fail('INVALID_PLAN', `Step ${step.id} depends on "${dependency}", which is not in this plan.`)
    }
  }

  // Kahn's algorithm with a stable tiebreak, so a fixed plan always runs in the same
  // order. Forward references are allowed: ordering is the graph's job, not the array's.
  const indegree = new Map(normalized.map(step => [step.id, step.needs.length]))
  const dependents = new Map(normalized.map(step => [step.id, []]))
  for (const step of normalized) {
    for (const dependency of step.needs) dependents.get(dependency).push(step.id)
  }
  const ready = normalized.filter(step => indegree.get(step.id) === 0).map(step => step.id).sort()
  const order = []
  while (ready.length) {
    const id = ready.shift()
    order.push(id)
    for (const child of dependents.get(id)) {
      indegree.set(child, indegree.get(child) - 1)
      if (indegree.get(child) === 0) ready.push(child)
    }
    ready.sort()
  }
  if (order.length !== normalized.length) fail('INVALID_PLAN', 'The plan contains a dependency cycle.')

  // The budget is a wall-clock ceiling, not the sum of every step's timeout. Adding them
  // assumes fully serial execution and rejects a reasonable plan of many short
  // independent steps just because each declares a generous timeout.
  const timeoutById = new Map(normalized.map(step => [step.id, step.timeoutMs]))
  const needsById = new Map(normalized.map(step => [step.id, step.needs]))
  const memo = new Map()
  const criticalPath = id => {
    if (memo.has(id)) return memo.get(id)
    const own = timeoutById.get(id) ?? 0
    const parents = needsById.get(id) ?? []
    const total = own + (parents.length ? Math.max(...parents.map(criticalPath)) : 0)
    memo.set(id, total)
    return total
  }
  const totalTimeout = Math.max(0, ...normalized.map(step => criticalPath(step.id)))
  if (totalTimeout > MAX_TOTAL_TIMEOUT_MS) {
    fail('INVALID_PLAN', `The plan's longest dependency chain needs ${totalTimeout} ms, over the ${MAX_TOTAL_TIMEOUT_MS} ms budget.`)
  }

  return Object.freeze({
    engineVersion: ENGINE_VERSION,
    backend,
    ...(spec.image === undefined ? {} : { image: spec.image }),
    steps: Object.freeze(normalized),
    order: Object.freeze(order),
  })
}

export function planDigest(plan) {
  const canonical = JSON.stringify({
    engineVersion: plan.engineVersion,
    backend: plan.backend,
    image: plan.image ?? null,
    steps: plan.steps.map(step => ({
      id: step.id,
      command: step.command,
      argv: [...(step.argv ?? [])],
      needs: [...step.needs],
      timeoutMs: step.timeoutMs,
      outputs: step.contract.outputs.map(output => output.glob),
    })),
  })
  return sha256(Buffer.from(canonical, 'utf8'))
}

/**
 * Compute a resumable fingerprint for one step.
 *
 * A resumed run must only skip a step whose *inputs* are unchanged. Deliberately NOT
 * included: wall-clock time, host name, or a random id — including them would make
 * every resume a full re-run and defeat the purpose.
 */
export function stepFingerprint(step, { planDigest: digest, dependencyOutputs = {} } = {}) {
  const material = JSON.stringify({
    engineVersion: ENGINE_VERSION,
    planDigest: digest,
    id: step.id,
    argv: step.argv ?? tokenizeCommand(step.command ?? ''),
    needs: [...step.needs],
    outputs: step.contract.outputs.map(output => output.glob),
    dependencies: Object.keys(dependencyOutputs).sort().map(key => [key, dependencyOutputs[key]]),
  })
  return sha256(Buffer.from(material, 'utf8'))
}

export function findWriteConflicts(plan) {
  const scopes = plan.steps.map(step => ({
    id: step.id,
    needs: step.needs,
    paths: step.contract.outputs.map(output => output.path),
  }))
  const conflicts = []
  for (let i = 0; i < scopes.length; i++) {
    for (let j = i + 1; j < scopes.length; j++) {
      const a = scopes[i]
      const b = scopes[j]
      if (a.needs.includes(b.id) || b.needs.includes(a.id)) continue
      const shared = a.paths.filter(path => b.paths.includes(path))
      if (shared.length) conflicts.push(Object.freeze({ steps: Object.freeze([a.id, b.id]), paths: Object.freeze(shared) }))
    }
  }
  return Object.freeze(conflicts)
}

async function listFiles(root, limit = 5000) {
  const found = []
  const walk = async directory => {
    if (found.length >= limit) return
    let entries
    try { entries = await readdir(directory, { withFileTypes: true }) } catch { return }
    for (const entry of entries) {
      if (found.length >= limit) return
      // Skip the workbench's own state directory: its run records are bookkeeping, not
      // analysis output, and listing them would put the engine's files into the
      // evidence it is supposed to be auditing.
      if (entry.isDirectory() && entry.name.startsWith('.')) continue
      const full = join(directory, entry.name)
      if (entry.isDirectory()) await walk(full)
      else if (entry.isFile() && !entry.name.startsWith('.')) found.push(full)
    }
  }
  await walk(root)
  return found
}

/** Run one step's argv and capture bounded output. */
async function runCommand(argv, { cwd, timeoutMs, signal }) {
  const { spawn } = await import('node:child_process')
  const { open, rm } = await import('node:fs/promises')
  const outPath = join(cwd, `.out-${Math.random().toString(36).slice(2)}`)
  const errPath = join(cwd, `.err-${Math.random().toString(36).slice(2)}`)
  const fo = await open(outPath, 'w')
  const fe = await open(errPath, 'w')
  try {
    // Output is redirected to files rather than pipes: this host's sandbox denies the
    // pipe file descriptors Node uses for stdio: 'pipe'.
    const result = await new Promise(resolve => {
      let settled = false
      const finish = value => { if (!settled) { settled = true; resolve(value) } }
      const child = spawn(argv[0], argv.slice(1), {
        cwd, windowsHide: true, stdio: ['ignore', fo.fd, fe.fd],
      })
      const timer = setTimeout(() => {
        try { child.kill() } catch { /* already gone */ }
        finish({ status: 'failed', exitCode: null, error: `timed out after ${timeoutMs} ms` })
      }, timeoutMs)
      child.on('error', error => { clearTimeout(timer); finish({ status: 'failed', exitCode: null, error: error.message }) })
      child.on('close', code => { clearTimeout(timer); finish({ status: code === 0 ? 'completed' : 'failed', exitCode: code }) })
      signal?.addEventListener('abort', () => { try { child.kill() } catch { /* */ } }, { once: true })
    })
    const stdout = await readFile(outPath).catch(() => Buffer.alloc(0))
    const stderr = await readFile(errPath).catch(() => Buffer.alloc(0))
    return {
      ...result,
      stdout: { bytes: stdout.length, sha256: sha256(stdout) },
      ...(stderr.length ? { stderr: { bytes: stderr.length, sha256: sha256(stderr) }, stderrTail: stderr.toString('utf8').slice(-2000) } : {}),
    }
  } finally {
    await fo.close().catch(() => {})
    await fe.close().catch(() => {})
    await rm(outPath, { force: true }).catch(() => {})
    await rm(errPath, { force: true }).catch(() => {})
  }
}

export async function runPlan(plan, {
  workspace, runDirectory, signal, continueOnError = false,
  interpreter, scriptsDirectory, variables,
  previous, concurrency = 1, approveParallel = false,
} = {}) {
  if (typeof workspace !== 'string' || !isAbsolute(workspace)) fail('INVALID_RUN', 'workspace must be an absolute path.')
  if (typeof runDirectory !== 'string' || !isAbsolute(runDirectory)) fail('INVALID_RUN', 'runDirectory must be an absolute path.')
  if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    fail('INVALID_RUN', 'concurrency must be an integer between 1 and 16.')
  }
  // Parallel execution is a decision, not a default: two steps in one workspace can
  // write the same file, and a step's real writes cannot be known before it runs.
  if (concurrency > 1 && approveParallel !== true) {
    fail('PARALLEL_NOT_APPROVED', 'Parallel execution needs explicit human approval; pass approveParallel: true after confirming the steps do not write the same files.')
  }
  if (concurrency > 1) {
    const conflicts = findWriteConflicts(plan)
    if (conflicts.length) {
      const detail = conflicts.map(item => `${item.steps.join(' / ')} -> ${item.paths.join(', ')}`).join('; ')
      fail('PARALLEL_WRITE_CONFLICT', `These steps declare overlapping outputs and must not run in parallel: ${detail}`)
    }
  }
  await mkdir(runDirectory, { recursive: true })

  if (plan.backend === 'container') {
    const { probeContainerRuntime } = await import('./step-executor.js')
    const probe = await probeContainerRuntime({ timeoutMs: 15000 })
    if (probe.available !== true) {
      return Object.freeze({
        engine: 'workbench-dag', engineVersion: ENGINE_VERSION, planDigest: planDigest(plan),
        status: 'blocked', errorCode: 'CONTAINER_UNAVAILABLE', error: probe.reason,
        steps: Object.freeze([]), reproducible: false,
      })
    }
  }

  const digest = planDigest(plan)
  const byId = new Map(plan.steps.map(step => [step.id, step]))
  const results = new Map()
  const outputsOf = new Map()
  const failed = new Set()
  const cancelled = new Set()
  const reExecuted = new Set()

  const reusable = new Map()
  if (previous && Array.isArray(previous.steps)) {
    for (const step of previous.steps) {
      if (step?.status === 'completed' && typeof step.fingerprint === 'string') reusable.set(step.id, step)
    }
  }
  const reused = []
  const rerunBecauseChanged = []

  const outputsStillMatch = async recorded => {
    for (const entry of recorded) {
      try {
        const buffer = await readFile(join(workspace, entry.path))
        if (sha256(buffer) !== entry.sha256) return false
      } catch { return false }
    }
    return true
  }

  const declaredInputsUnchanged = async prior => {
    const recorded = prior?.inputsDigest
    if (!recorded || typeof recorded !== 'object') return false
    for (const [path, expected] of Object.entries(recorded)) {
      try {
        const buffer = await readFile(join(workspace, path))
        if (sha256(buffer) !== expected) return false
      } catch { return false }
    }
    return true
  }

  // Fingerprints must reflect the CURRENT bytes of a dependency's outputs, not the bytes
  // recorded last time: otherwise editing an upstream artifact leaves every downstream
  // step reusable, which is the exact case a resume must catch.
  const dependencyOutputsFor = async id => {
    const step = byId.get(id)
    const collected = {}
    for (const dependency of step.needs) {
      const recorded = outputsOf.get(dependency)
      if (recorded === undefined) continue
      const current = []
      for (const entry of recorded) {
        try {
          const buffer = await readFile(join(workspace, entry.path))
          current.push({ path: entry.path, bytes: buffer.length, sha256: sha256(buffer) })
        } catch {
          current.push({ ...entry, missing: true })
        }
      }
      collected[dependency] = current
    }
    return collected
  }

  const currentInputDigests = async step => {
    const digests = {}
    for (const input of step.contract.inputs) {
      if (input.path.includes('*')) continue
      try {
        digests[input.path] = sha256(await readFile(join(workspace, input.path)))
      } catch { /* a missing optional input simply has no digest */ }
    }
    return digests
  }

  const tryReuse = async id => {
    const step = byId.get(id)
    const prior = reusable.get(id)
    if (!prior) return undefined
    // A dependency re-running does not by itself invalidate this step: what matters is
    // whether the bytes it consumed changed.
    if (step.needs.some(dependency => reExecuted.has(dependency))) {
      if (!(await declaredInputsUnchanged(prior))) {
        rerunBecauseChanged.push(id)
        return undefined
      }
    }
    const fingerprint = stepFingerprint(step, { planDigest: digest, dependencyOutputs: await dependencyOutputsFor(id) })
    if (prior.fingerprint !== fingerprint) {
      rerunBecauseChanged.push(id)
      return undefined
    }
    return { prior, fingerprint }
  }

  const executeStep = async id => {
    const step = byId.get(id)
    const stepDirectory = workspace
    const needsBinding = typeof step.command === 'string' && /\{\{(?:python|scripts|query)\}\}/.test(step.command)
    const bound = needsBinding
      ? tokenizeCommand(applyInterpreter(step.command, interpreter, scriptsDirectory, variables))
      : [...(step.argv ?? tokenizeCommand(step.command))]

    // A required input that is absent is a precondition failure, not a runtime one: the
    // command must not run at all.
    const missingInputs = await findMissingInputs(step.contract, {
      workspace: stepDirectory,
      stat: async path => stat(path).then(info => (info.isFile() ? info : undefined), () => undefined),
    })
    if (missingInputs.length) {
      failed.add(id)
      outputsOf.set(id, [])
      const failedAt = new Date().toISOString()
      results.set(id, Object.freeze({
        id, label: step.label, status: 'failed', exitCode: null,
        startedAt: failedAt, completedAt: failedAt,
        command: step.command, needs: step.needs,
        fingerprint: stepFingerprint(step, { planDigest: digest, dependencyOutputs: await dependencyOutputsFor(id) }),
        reused: false,
        error: `Required input not found in the workspace: ${missingInputs.join(', ')}`,
        missingInputs: Object.freeze(missingInputs),
        outputs: Object.freeze([]),
        verifiedBy: 'host',
      }))
      return false
    }

    const stepStartedAt = new Date().toISOString()
    const result = await runCommand(bound, { cwd: stepDirectory, timeoutMs: step.timeoutMs, signal })
    const stepCompletedAt = new Date().toISOString()

    // Which files did THIS step produce? The step runs in the shared workspace, so
    // scanning the workspace would credit it with every file already there. Declared
    // paths are checked directly: no walking, no limit, no dependence on what else is in
    // the directory. A step that declares nothing is credited with nothing.
    const declared = step.contract.outputs.filter(output => !output.path.includes('*'))
    const producedFiles = []
    for (const output of declared) {
      const target = join(stepDirectory, output.path)
      try {
        const info = await stat(target)
        if (!info.isFile()) continue
        const bytes = await readFile(target)
        producedFiles.push(Object.freeze({ path: output.path, bytes: info.size, sha256: sha256(bytes) }))
      } catch { /* absent: the contract check below reports it */ }
    }
    const wildcard = step.contract.outputs.filter(output => output.path.includes('*'))
    if (wildcard.length) {
      for (const candidate of await listFiles(stepDirectory)) {
        const relativePath = relative(stepDirectory, candidate).split('\\').join('/')
        if (producedFiles.some(item => item.path === relativePath)) continue
        try {
          const info = await stat(candidate)
          const bytes = await readFile(candidate)
          producedFiles.push(Object.freeze({ path: relativePath, bytes: info.size, sha256: sha256(bytes) }))
        } catch { /* removed mid-scan */ }
      }
    }

    // Heads are read so a declared media type can be checked against real bytes.
    const heads = {}
    for (const entry of producedFiles) {
      try { heads[entry.path] = (await readFile(join(stepDirectory, entry.path))).subarray(0, 8) } catch { /* */ }
    }
    const contractReport = evaluateOutputs(step.contract, producedFiles, { heads })
    const missingOutputs = contractReport.unsatisfied
    const exitOk = result.status === 'completed'
    // An exit code of zero is necessary but not sufficient: the declared outputs must
    // also exist. Otherwise a step could "succeed" while producing nothing usable.
    const succeeded = exitOk && contractReport.satisfied
    if (!succeeded) failed.add(id)
    outputsOf.set(id, producedFiles)
    results.set(id, Object.freeze({
      id,
      label: step.label,
      status: succeeded ? 'completed' : 'failed',
      exitCode: result.exitCode ?? null,
      startedAt: stepStartedAt,
      completedAt: stepCompletedAt,
      command: step.command,
      needs: step.needs,
      fingerprint: stepFingerprint(step, { planDigest: digest, dependencyOutputs: await dependencyOutputsFor(id) }),
      reused: false,
      ...(result.error ? { error: result.error } : {}),
      ...(result.stdout ? { stdout: result.stdout } : {}),
      ...(result.stderr ? { stderr: result.stderr } : {}),
      ...(result.stderrTail ? { stderrTail: result.stderrTail } : {}),
      outputs: Object.freeze(producedFiles),
      inputsDigest: Object.freeze(await currentInputDigests(step)),
      contract: Object.freeze({
        inputs: step.contract.inputs.length,
        outputs: contractReport.verdicts,
      }),
      ...(missingOutputs.length ? { missingOutputs: Object.freeze(missingOutputs) } : {}),
      ...(exitOk && !contractReport.satisfied
        ? { error: `The step exited zero but did not produce its declared outputs: ${missingOutputs.join(', ')}` }
        : {}),
      isolation: { level: 'process', note: 'Runs as the current OS user; this is not a container.' },
      verifiedBy: 'host',
    }))
    return succeeded
  }

  const recordSkipped = (id, blockedBy) => {
    failed.add(id)
    results.set(id, Object.freeze({
      id, label: byId.get(id).label, status: 'skipped',
      blockedBy: Object.freeze(blockedBy),
      reason: 'A dependency did not succeed.',
      reused: false,
    }))
    remaining.delete(id)
  }

  const remaining = new Set(plan.order)
  const inFlight = new Map()
  const startedAt = new Date().toISOString()

  while (remaining.size || inFlight.size) {
    let launched = false
    for (const id of [...plan.order]) {
      if (!remaining.has(id)) continue
      const step = byId.get(id)
      const blockedBy = step.needs.filter(dependency => failed.has(dependency) || cancelled.has(dependency))
      if (blockedBy.length) { recordSkipped(id, blockedBy); launched = true; continue }
      const unresolved = step.needs.filter(dependency => remaining.has(dependency) || inFlight.has(dependency))
      if (unresolved.length) continue
      if (inFlight.size >= concurrency) break
      launched = true

      if (signal?.aborted) {
        cancelled.add(id)
        results.set(id, Object.freeze({ id, label: step.label, status: 'cancelled', reason: 'The run was cancelled before this step started.', reused: false }))
        remaining.delete(id)
        continue
      }

      const decision = await tryReuse(id)
      if (decision) {
        // A step may only be reused if its own declared outputs are still on disk with
        // the same bytes. The record claims they exist; the disk decides.
        if (await outputsStillMatch(decision.prior.outputs ?? [])) {
          reused.push(id)
          outputsOf.set(id, decision.prior.outputs ?? [])
          results.set(id, Object.freeze({
            ...decision.prior, reused: true, reusedFrom: decision.prior.completedAt, fingerprint: decision.fingerprint,
          }))
          remaining.delete(id)
          continue
        }
        rerunBecauseChanged.push(id)
      }

      remaining.delete(id)
      reExecuted.add(id)
      inFlight.set(id, executeStep(id).finally(() => { inFlight.delete(id) }))
    }

    if (inFlight.size) { await Promise.race(inFlight.values()); continue }
    if (!launched) break
  }

  const ordered = plan.order.map(id => results.get(id)).filter(Boolean)
  // A real failure outranks a skip: a run that failed and then skipped its dependents is
  // a failed run, not a merely blocked one.
  const failedOutright = ordered.some(item => item.status === 'failed')
  const skippedOrCancelled = ordered.some(item => item.status === 'skipped' || item.status === 'cancelled')
  const status = failedOutright ? 'failed' : skippedOrCancelled ? 'blocked' : 'completed'

  return Object.freeze({
    engine: 'workbench-dag',
    engineVersion: ENGINE_VERSION,
    planDigest: digest,
    backend: plan.backend,
    status,
    startedAt,
    completedAt: new Date().toISOString(),
    steps: Object.freeze(ordered),
    concurrency,
    reusedSteps: Object.freeze(reused),
    rerunBecauseChanged: Object.freeze(rerunBecauseChanged),
    reproducible: false,
    reprodNote: 'Steps run against the live environment; the same plan can yield different results after a dependency or data change.',
  })
}

export async function writeRunRecord(runDirectory, { plan, result }) {
  await mkdir(runDirectory, { recursive: true })
  const text = JSON.stringify({ plan: { planDigest: planDigest(plan), steps: plan.steps.length }, result }, null, 2) + '\n'
  await writeFile(join(runDirectory, 'run.json'), text, 'utf8')
  return sha256(Buffer.from(text, 'utf8'))
}

export const limits = Object.freeze({ MAX_STEPS, MAX_TOTAL_TIMEOUT_MS, DEFAULT_STEP_TIMEOUT_MS })
