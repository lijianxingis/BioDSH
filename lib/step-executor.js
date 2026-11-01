/**
 * Run one step, in a container or as a local process.
 *
 * The container path never degrades to a local process. A silent downgrade would turn
 * "ran in a container" into a false statement while the run still reported success,
 * which is the worst possible failure mode for this module.
 */
import { spawn } from 'node:child_process'
import { mkdir, open, readFile, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'

const MAX_OUTPUT_BYTES = 1024 * 1024

async function spawnCaptured(program, args, { cwd, timeoutMs, signal }) {
  const outPath = join(cwd, '.cap-out-' + Math.random().toString(36).slice(2))
  const errPath = join(cwd, '.cap-err-' + Math.random().toString(36).slice(2))
  const fo = await open(outPath, 'w')
  const fe = await open(errPath, 'w')
  try {
    const result = await new Promise(resolve => {
      let settled = false
      const finish = value => { if (!settled) { settled = true; resolve(value) } }
      const child = spawn(program, args, { cwd, windowsHide: true, stdio: ['ignore', fo.fd, fe.fd] })
      const timer = setTimeout(() => {
        try { child.kill() } catch { /* gone */ }
        finish({ status: 'failed', exitCode: null, error: 'timed out after ' + timeoutMs + ' ms' })
      }, timeoutMs)
      child.on('error', error => { clearTimeout(timer); finish({ status: 'failed', exitCode: null, error: error.message }) })
      child.on('close', code => { clearTimeout(timer); finish({ status: code === 0 ? 'completed' : 'failed', exitCode: code }) })
      signal?.addEventListener('abort', () => { try { child.kill() } catch { /* */ } }, { once: true })
    })
    const stdout = await readFile(outPath).catch(() => Buffer.alloc(0))
    const stderr = await readFile(errPath).catch(() => Buffer.alloc(0))
    return {
      ...result,
      stdoutTail: stdout.subarray(-MAX_OUTPUT_BYTES).toString('utf8'),
      stderrTail: stderr.subarray(-MAX_OUTPUT_BYTES).toString('utf8'),
    }
  } finally {
    await fo.close().catch(() => {})
    await fe.close().catch(() => {})
    await rm(outPath, { force: true }).catch(() => {})
    await rm(errPath, { force: true }).catch(() => {})
  }
}

export async function probeContainerRuntime({ timeoutMs = 15000 } = {}) {
  // Ask the daemon for its version rather than merely checking that the CLI exists: a
  // CLI with no reachable daemon cannot run anything.
  try {
    const probeDir = process.cwd()
    const result = await spawnCaptured('docker', ['version', '--format', '{{.Server.Version}}'], { cwd: probeDir, timeoutMs })
    if (result.status !== 'completed') {
      return Object.freeze({ available: false, reason: 'The container daemon is not reachable; start it and retry.', detail: (result.stderrTail ?? '').trim().slice(0, 400), cli: 'docker' })
    }
    const version = (result.stdoutTail ?? '').trim()
    if (!version) return Object.freeze({ available: false, reason: 'The container daemon returned no version.', cli: 'docker' })
    return Object.freeze({ available: true, serverVersion: version, cli: 'docker' })
  } catch (error) {
    return Object.freeze({ available: false, reason: 'The container daemon is not reachable; start it and retry.', detail: String(error?.message ?? error).slice(0, 400), cli: 'docker' })
  }
}

export async function runProcessSpec(spec, { cwd, timeoutMs = 600000, signal } = {}) {
  const result = await spawnCaptured(spec.command[0], spec.command.slice(1), { cwd, timeoutMs, signal })
  return Object.freeze({
    executor: 'process',
    executorVersion: 1,
    status: result.status,
    exitCode: result.exitCode ?? null,
    ...(result.error ? { error: result.error } : {}),
    stdoutTail: result.stdoutTail ?? '',
    stderrTail: result.stderrTail ?? '',
    isolation: { level: 'process', note: 'Runs as the current OS user; this is not a container.' },
    reproducible: false,
  })
}

export async function runContainerSpec(spec, { cwd, timeoutMs = 600000, signal, probe } = {}) {
  const availability = probe ?? (await probeContainerRuntime())
  if (availability?.available !== true) {
    return Object.freeze({
      executor: 'container',
      executorVersion: 1,
      status: 'failed',
      errorCode: 'CONTAINER_UNAVAILABLE',
      error: availability?.reason ?? 'The container daemon is not reachable.',
      isolation: { level: 'none', note: 'Nothing ran. The process backend was not substituted.' },
      reproducible: false,
    })
  }
  await mkdir(cwd, { recursive: true })
  const args = ['run', '--rm', '--network', 'none']
  for (const mount of spec.mounts ?? []) {
    args.push('--volume', mount.target + ':' + mount.target + (mount.readOnly ? ':ro' : ''))
    args.push('--workdir', mount.target)
  }
  args.push(spec.image.reference, ...spec.command)
  const result = await spawnCaptured('docker', args, { cwd, timeoutMs, signal })
  return Object.freeze({
    executor: 'container',
    executorVersion: 1,
    status: result.status,
    exitCode: result.exitCode ?? null,
    ...(result.error ? { error: result.error } : {}),
    stdoutTail: result.stdoutTail ?? '',
    stderrTail: result.stderrTail ?? '',
    isolation: { level: 'container', image: spec.image.reference, digest: spec.image.digest, network: 'none' },
    reproducible: false,
  })
}
