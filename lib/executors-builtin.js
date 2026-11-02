/**
 * The bundled executors.
 *
 * Each one translates a step into whatever its scheduler understands, and nothing more.
 * The shared rule: an executor never reports a result it did not observe, and never
 * falls back to running locally. A scheduler that is down must fail the step, not
 * silently run it on the login node.
 */
import { spawn } from 'node:child_process'
import { open, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { registerExecutor, getExecutor } from './executors.js'

/**
 * Resolve a program into something spawn can execute.
 *
 * Windows cannot spawn a .cmd or .bat directly - it fails with EFTYPE - so a batch wrapper
 * has to go through cmd.exe. Schedulers are commonly installed that way, so this is not an
 * edge case.
 */
/**
 * Translate a host path into the path the scheduler sees.
 *
 * A scheduler inside a container has its own filesystem; handing it a Windows path fails
 * with "Unable to open file". The mapping is explicit rather than guessed, because a wrong
 * guess would submit a job that silently reads the wrong file.
 *
 * Format: SLURM_PATH_MAP="E:\\work:/work,E:\\scratch:/scratch"
 */
function mapPathForScheduler(hostPath) {
  const mapping = process.env.SLURM_PATH_MAP
  if (!mapping) return hostPath
  for (const pair of mapping.split(',')) {
    const at = pair.lastIndexOf(':')
    if (at === -1) continue
    const from = pair.slice(0, at).replace(/\\/g, '/').replace(/\/$/, '')
    const to = pair.slice(at + 1).replace(/\/$/, '')
    const normalised = hostPath.replace(/\\/g, '/')
    if (normalised === from) return to
    if (normalised.startsWith(from + '/')) return to + normalised.slice(from.length)
  }
  return hostPath
}

function resolveProgram(program, args) {
  if (process.platform !== 'win32') return { program, args }
  if (/\.(cmd|bat)$/i.test(program)) {
    return { program: process.env.COMSPEC ?? 'cmd.exe', args: ['/d', '/s', '/c', program, ...args] }
  }
  return { program, args }
}

/** Run a command and capture bounded output through files, as the process backend does. */
async function spawnCaptured(program, args, { cwd, timeoutMs, env } = {}) {
  const outPath = join(cwd, '.x-out-' + Math.random().toString(36).slice(2))
  const errPath = join(cwd, '.x-err-' + Math.random().toString(36).slice(2))
  const fo = await open(outPath, 'w')
  const fe = await open(errPath, 'w')
  try {
    const result = await new Promise(resolve => {
      let settled = false
      const finish = value => { if (!settled) { settled = true; resolve(value) } }
      const resolved = resolveProgram(program, args)
      const child = spawn(resolved.program, resolved.args, {
        cwd, windowsHide: true, stdio: ['ignore', fo.fd, fe.fd],
        ...(env ? { env: { ...process.env, ...env } } : {}),
      })
      const timer = setTimeout(() => {
        try { child.kill() } catch { /* gone */ }
        finish({ status: 'failed', exitCode: null, error: 'timed out after ' + timeoutMs + ' ms' })
      }, timeoutMs ?? 600000)
      child.on('error', error => { clearTimeout(timer); finish({ status: 'failed', exitCode: null, error: error.message }) })
      child.on('close', code => { clearTimeout(timer); finish({ status: code === 0 ? 'completed' : 'failed', exitCode: code }) })
    })
    const stdout = await readFile(outPath).catch(() => Buffer.alloc(0))
    const stderr = await readFile(errPath).catch(() => Buffer.alloc(0))
    return { ...result, stdoutTail: stdout.toString('utf8').slice(-4000), stderrTail: stderr.toString('utf8').slice(-4000) }
  } finally {
    await fo.close().catch(() => {})
    await fe.close().catch(() => {})
    await rm(outPath, { force: true }).catch(() => {})
    await rm(errPath, { force: true }).catch(() => {})
  }
}

function result(executor, fields) {
  return Object.freeze({ executor, executorVersion: 1, reproducible: false, ...fields })
}

// ---------------------------------------------------------------- local process

registerExecutor({
  id: 'local',
  describe: () => ({ isolation: 'none', needs: 'nothing', note: 'Runs as the current user. Not a sandbox.' }),
  async run(step, { workspace }) {
    const argv = step.argv ?? String(step.command ?? '').split(/\s+/).filter(Boolean)
    if (!argv.length) return result('local', { status: 'failed', exitCode: null, error: 'the step has no command' })
    const outcome = await spawnCaptured(argv[0], argv.slice(1), { cwd: workspace, timeoutMs: step.timeoutMs })
    return result('local', {
      ...outcome,
      isolation: { level: 'process', note: 'Runs as the current OS user; this is not a container.' },
    })
  },
})

// ---------------------------------------------------------------- Slurm

/**
 * Submit to Slurm with sbatch and wait for the job to leave the queue.
 *
 * Two details that matter in practice: sbatch exits 0 when the *submission* succeeds, not
 * when the job does, so the exit code of sbatch says nothing about the step. And a job
 * that is cancelled is not the same as one that failed, so the state is read from sacct
 * rather than inferred from the absence of a result.
 */
registerExecutor({
  id: 'slurm',
  describe: () => ({
    isolation: 'cluster',
    needs: 'sbatch, sacct on PATH, or SBATCH_COMMAND pointing at them',
    options: ['partition', 'account', 'time', 'cpus', 'memory', 'extraArgs'],
  }),
  async run(step, { workspace, options = {} }) {
    const sbatch = process.env.SBATCH_COMMAND ?? 'sbatch'
    const sacct = process.env.SACCT_COMMAND ?? 'sacct'
    const scontrol = process.env.SCONTROL_COMMAND ?? 'scontrol'
    const jobName = 'dsh-' + String(step.id).replace(/[^A-Za-z0-9-]/g, '-').slice(0, 40)
    const scriptPath = join(workspace, jobName + '.slurm.sh')
    const argv = step.argv ?? String(step.command ?? '').split(/\s+/).filter(Boolean)
    if (!argv.length) return result('slurm', { status: 'failed', exitCode: null, error: 'the step has no command' })

    const schedulerWorkspace = mapPathForScheduler(workspace)
    const lines = [
      '#!/usr/bin/env bash',
      '#SBATCH --job-name=' + jobName,
      '#SBATCH --output=' + join(schedulerWorkspace, jobName + '.out'),
      '#SBATCH --error=' + join(schedulerWorkspace, jobName + '.err'),
      ...(options.partition ? ['#SBATCH --partition=' + options.partition] : []),
      ...(options.account ? ['#SBATCH --account=' + options.account] : []),
      ...(options.time ? ['#SBATCH --time=' + options.time] : []),
      ...(options.cpus ? ['#SBATCH --cpus-per-task=' + options.cpus] : []),
      ...(options.memory ? ['#SBATCH --mem=' + options.memory] : []),
      ...(options.extraArgs ?? []).map(arg => '#SBATCH ' + arg),
      'set -euo pipefail',
      'cd ' + JSON.stringify(schedulerWorkspace),
      argv.map(part => JSON.stringify(part)).join(' '),
      '',
    ]
    const { writeFile } = await import('node:fs/promises')
    await writeFile(scriptPath, lines.join('\n'), 'utf8')

    // The scheduler is given its own view of the script path.
    const schedulerScriptPath = mapPathForScheduler(scriptPath)
    const submitted = await spawnCaptured(sbatch, ['--parsable', schedulerScriptPath], { cwd: workspace, timeoutMs: 120000 })
    if (submitted.status !== 'completed') {
      return result('slurm', {
        status: 'failed', exitCode: submitted.exitCode,
        error: 'sbatch did not accept the job: ' + (submitted.stderrTail ?? '').slice(0, 300),
        schedulerUnavailable: /not found|No such file/i.test(submitted.stderrTail ?? '') || submitted.exitCode === null,
      })
    }
    const jobId = (submitted.stdoutTail ?? '').trim().split(/[;\s]/)[0]
    if (!/^\d+/.test(jobId)) {
      return result('slurm', { status: 'failed', exitCode: null, error: 'sbatch returned no job id: ' + submitted.stdoutTail.slice(0, 120) })
    }

    // Poll for a terminal state. sacct needs slurmdbd, which a small cluster may not run,
    // so scontrol is the fallback: it is always present and reports the same states.
    const deadline = Date.now() + (step.timeoutMs ?? 600000)
    let state = 'PENDING'
    let exitCode = null
    let usedAccounting = false
    while (Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const poll = await spawnCaptured(sacct, ['-j', jobId, '--noheader', '--parsable2', '--format=State,ExitCode'], { cwd: workspace, timeoutMs: 30000 })
      const row = (poll.stdoutTail ?? '').trim().split('\n')[0] ?? ''
      if (row.includes('|') && !/disabled|invalid/i.test(row)) {
        usedAccounting = true
        const [reportedState, reportedExit] = row.split('|')
        if (reportedState) state = reportedState.trim()
        if (/^(COMPLETED|FAILED|CANCELLED|TIMEOUT|NODE_FAIL|OUT_OF_MEMORY)/.test(state)) {
          exitCode = reportedExit ? Number(String(reportedExit).split(':')[0]) : null
          break
        }
        continue
      }

      // No accounting database: read the job from the controller directly.
      const live = await spawnCaptured(scontrol, ['show', 'job', jobId], { cwd: workspace, timeoutMs: 30000 })
      const text = live.stdoutTail ?? ''
      const reported = /JobState=(\S+)/.exec(text)?.[1]
      const code = /ExitCode=(\d+):(\d+)/.exec(text)
      if (reported) state = reported
      if (code) exitCode = Number(code[1])
      if (/^(COMPLETED|FAILED|CANCELLED|TIMEOUT|NODE_FAIL|OUT_OF_MEMORY)$/.test(state)) break
    }

    const completed = /^COMPLETED/.test(state)
    if (state === 'PENDING' || state === 'RUNNING') {
      return result('slurm', { status: 'failed', exitCode: null, error: 'the job was still queued when the timeout expired (state ' + state + ')', schedulerState: state, jobId })
    }
    return result('slurm', {
      status: completed ? 'completed' : 'failed',
      exitCode,
      jobId,
      schedulerState: state,
      stateSource: usedAccounting ? 'sacct' : 'scontrol',
      ...(completed ? {} : { error: 'Slurm reported ' + state + ' for job ' + jobId }),
      isolation: { level: 'cluster', scheduler: 'slurm', jobId, partition: options.partition ?? null },
    })
  },
})

// ---------------------------------------------------------------- Kubernetes

/**
 * Run a step as a Kubernetes Job and wait for it.
 *
 * The pod is given no service account token and no network egress is configured here:
 * the cluster's policy decides that, and claiming isolation the executor did not
 * configure would be a false statement.
 */
registerExecutor({
  id: 'kubernetes',
  describe: () => ({
    isolation: 'pod',
    needs: 'kubectl on PATH or KUBECTL_COMMAND; a valid kubeconfig',
    options: ['image', 'namespace', 'serviceAccount', 'nodeSelector', 'ttlSeconds'],
  }),
  async run(step, { workspace, options = {} }) {
    const kubectl = process.env.KUBECTL_COMMAND ?? 'kubectl'
    const image = options.image ?? step.image
    if (!image || !/@sha256:[a-f0-9]{64}$/.test(image)) {
      return result('kubernetes', { status: 'failed', exitCode: null, error: 'a digest-pinned image is required for a Kubernetes job' })
    }
    const argv = step.argv ?? String(step.command ?? '').split(/\s+/).filter(Boolean)
    const name = 'dsh-' + String(step.id).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40) + '-' + Date.now().toString(36)
    const namespace = options.namespace ?? 'default'
    const manifest = {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: { name, labels: { 'app.kubernetes.io/managed-by': 'dsh-research-workbench' } },
      spec: {
        backoffLimit: 0,
        ttlSecondsAfterFinished: options.ttlSeconds ?? 600,
        template: {
          metadata: { labels: { job: name } },
          spec: {
            restartPolicy: 'Never',
            automountServiceAccountToken: false,
            ...(options.serviceAccount ? { serviceAccountName: options.serviceAccount } : {}),
            ...(options.nodeSelector ? { nodeSelector: options.nodeSelector } : {}),
            containers: [{
              name: 'step',
              image,
              command: argv,
              workingDir: '/work',
              volumeMounts: [{ name: 'work', mountPath: '/work' }],
              resources: { requests: { cpu: '500m', memory: '512Mi' } },
            }],
            volumes: [{ name: 'work', emptyDir: {} }],
          },
        },
      },
    }
    const { writeFile } = await import('node:fs/promises')
    const manifestPath = join(workspace, 'k8s-job-' + name + '.json')
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')

    const applied = await spawnCaptured(kubectl, ['apply', '-f', manifestPath, '-n', namespace], { cwd: workspace, timeoutMs: 120000 })
    if (applied.status !== 'completed') {
      return result('kubernetes', {
        status: 'failed', exitCode: applied.exitCode,
        error: 'kubectl apply failed: ' + (applied.stderrTail ?? '').slice(0, 300),
        schedulerUnavailable: applied.exitCode === null,
      })
    }
    // Poll for either terminal condition. A failed job never becomes complete, so waiting
    // on 'complete' alone means a failure is indistinguishable from a job still running,
    // and the step sits until the timeout.
    const timeoutMs = step.timeoutMs ?? 600000
    const deadline = Date.now() + timeoutMs
    let condition = 'unknown'
    let failures = 0
    while (Date.now() < deadline) {
      const poll = await spawnCaptured(kubectl, [
        'get', 'job', name, '-n', namespace,
        '-o', 'jsonpath={.status.conditions[*].type}={.status.failed}',
      ], { cwd: workspace, timeoutMs: 30000 })
      const raw = (poll.stdoutTail ?? '').trim()
      const types = raw.split('=')[0] ?? ''
      failures = Number(raw.split('=')[1] || '0') || 0
      if (/\bComplete\b/.test(types)) { condition = 'Complete'; break }
      if (/\bFailed\b/.test(types)) { condition = 'Failed'; break }
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    const completed = condition === 'Complete'
    return result('kubernetes', {
      status: completed ? 'completed' : 'failed',
      exitCode: completed ? 0 : null,
      jobName: name,
      schedulerState: condition,
      ...(completed ? {} : {
        error: condition === 'Failed'
          ? 'the Kubernetes job failed (pod failures: ' + failures + ')'
          : 'the job had not reached a terminal condition when the timeout expired (state ' + condition + ')',
      }),
      isolation: { level: 'pod', namespace, image, jobName: name, serviceAccountToken: 'not-mounted' },
    })
  },
})

// ---------------------------------------------------------------- cloud batch

/**
 * Submit to a cloud batch service through an adapter the operator supplies.
 *
 * There is no single API to call: AWS Batch, Google Batch and Azure Batch differ in every
 * shape. Rather than pretend one client covers them, this executor requires a command
 * that accepts a JSON request on stdin and prints a JSON {state, exitCode}. That keeps
 * credentials in the operator's hands and out of this codebase.
 */
registerExecutor({
  id: 'cloud-batch',
  describe: () => ({
    isolation: 'managed',
    needs: 'CLOUD_BATCH_COMMAND: a program that reads {command, argv, timeoutMs} JSON on stdin and prints {state, exitCode} JSON',
    options: ['queue', 'jobDefinition', 'extra'],
  }),
  async run(step, { workspace, options = {} }) {
    const command = process.env.CLOUD_BATCH_COMMAND
    if (!command) {
      return result('cloud-batch', {
        status: 'failed', exitCode: null,
        error: 'CLOUD_BATCH_COMMAND is not set. This executor does not bundle cloud SDKs: it calls the adapter you configure.',
        schedulerUnavailable: true,
      })
    }
    const argv = step.argv ?? String(step.command ?? '').split(/\s+/).filter(Boolean)
    const request = JSON.stringify({ command: argv[0], argv: argv.slice(1), timeoutMs: step.timeoutMs ?? 600000, options })
    const submitted = await spawnCaptured('bash', ['-lc', 'printf %s "$DSH_BATCH_REQUEST" | ' + command], {
      cwd: workspace, timeoutMs: 600000, env: { DSH_BATCH_REQUEST: request },
    })
    if (submitted.status !== 'completed') {
      return result('cloud-batch', { status: 'failed', exitCode: submitted.exitCode, error: 'the cloud adapter failed: ' + (submitted.stderrTail ?? '').slice(0, 300) })
    }
    let parsed
    try { parsed = JSON.parse((submitted.stdoutTail ?? '').trim().split('\n').pop()) } catch {
      return result('cloud-batch', { status: 'failed', exitCode: null, error: 'the cloud adapter did not print JSON' })
    }
    const done = parsed?.state === 'SUCCEEDED' || parsed?.state === 'completed'
    return result('cloud-batch', {
      status: done ? 'completed' : 'failed',
      exitCode: typeof parsed?.exitCode === 'number' ? parsed.exitCode : null,
      ...(done ? {} : { error: 'the cloud job reported ' + (parsed?.state ?? 'no state') }),
      isolation: { level: 'managed', queue: options.queue ?? null },
    })
  },
})

// ---------------------------------------------------------------- Singularity / Podman

/**
 * Run in a container through Singularity/Apptainer or Podman.
 *
 * These exist because Slurm clusters rarely allow Docker: the daemon needs root. Both
 * run rootless, which is why a scientific image usually travels as a .sif file.
 */
registerExecutor({
  id: 'singularity',
  describe: () => ({
    isolation: 'container',
    needs: 'singularity, apptainer or podman on PATH',
    options: ['image', 'sifPath', 'bindPaths'],
  }),
  async run(step, { workspace, options = {} }) {
    const image = options.sifPath ?? options.image ?? step.image
    if (!image) return result('singularity', { status: 'failed', exitCode: null, error: 'no image was supplied' })
    if (!options.sifPath && !/@sha256:[a-f0-9]{64}$/.test(image)) {
      return result('singularity', { status: 'failed', exitCode: null, error: 'a container image must be pinned by digest, or given as a local .sif file' })
    }
    const argv = step.argv ?? String(step.command ?? '').split(/\s+/).filter(Boolean)
    const candidates = [
      { program: process.env.SINGULARITY_COMMAND ?? 'singularity', args: ['exec', '--cleanenv', '--pwd', workspace, '--bind', workspace + ':' + workspace, image, ...argv] },
      { program: 'apptainer', args: ['exec', '--cleanenv', '--pwd', workspace, '--bind', workspace + ':' + workspace, image, ...argv] },
      { program: process.env.PODMAN_COMMAND ?? 'podman', args: ['run', '--rm', '--network', 'none', '-v', workspace + ':' + workspace + ':rw', '-w', workspace, image, ...argv] },
    ]
    let lastError = ''
    for (const candidate of candidates) {
      const outcome = await spawnCaptured(candidate.program, candidate.args, { cwd: workspace, timeoutMs: step.timeoutMs })
      if (outcome.exitCode === null && /not found|ENOENT/i.test(outcome.error ?? '')) {
        lastError = candidate.program + ' is not installed'
        continue
      }
      if (outcome.exitCode === null && !outcome.error) {
        return result('singularity', { ...outcome, isolation: { level: 'container', runtime: candidate.program, image } })
      }
      if (outcome.exitCode === null) { lastError = outcome.error ?? ''; continue }
      return result('singularity', { ...outcome, isolation: { level: 'container', runtime: candidate.program, image } })
    }
    return result('singularity', {
      status: 'failed', exitCode: null,
      error: 'no rootless container runtime was found: ' + lastError,
      schedulerUnavailable: true,
    })
  },
})

/** Ids that ship with this package. */
export const BUILTIN = Object.freeze(['local', 'slurm', 'kubernetes', 'cloud-batch', 'singularity'])

/** Resolve an executor by id, defaulting to the local one. */
export function executorFor(id) {
  return getExecutor(id ?? 'local')
}
