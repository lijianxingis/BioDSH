/**
 * Conda environments.
 *
 * Snakemake's most useful feature is per-rule environments: a workflow can pin one
 * toolchain per step without building a container per step. This is that, smaller.
 *
 * Two rules that keep it honest:
 *  - an environment is keyed by a hash of its spec, so editing the spec creates a new
 *    environment instead of silently mutating one that a finished run depended on;
 *  - a missing conda is reported, not worked around. Falling back to the host Python
 *    would make a step report success with the wrong toolchain.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const ENVS = '.dsh/research-workbench/envs'

export function environmentKey(spec) {
  if (spec === null || typeof spec !== 'object') throw new TypeError('an environment spec must be an object')
  // The key covers the channels and the packages: two specs that differ in either must
  // not share an environment.
  const canonical = JSON.stringify({
    channels: [...(spec.channels ?? ['conda-forge'])].sort(),
    packages: [...(spec.packages ?? [])].sort(),
  })
  return createHash('sha256').update(canonical).digest('hex').slice(0, 16)
}

export function defineEnvironment(spec) {
  if (!Array.isArray(spec?.packages) || !spec.packages.length) {
    throw new Error('an environment needs a non-empty packages list')
  }
  const channels = spec.channels ?? ['conda-forge']
  return Object.freeze({
    key: environmentKey({ channels, packages: spec.packages }),
    channels: Object.freeze([...channels]),
    packages: Object.freeze([...spec.packages]),
    python: spec.python ?? undefined,
  })
}

function envPath(workspace, key) {
  return join(workspace, ENVS, key)
}

/** A YAML rendering of the spec, which is what conda actually consumes. */
export function environmentYaml(environment) {
  const lines = ['name: dsh-' + environment.key, 'channels:']
  for (const channel of environment.channels) lines.push('  - ' + channel)
  lines.push('dependencies:')
  for (const pkg of environment.packages) lines.push('  - ' + pkg)
  if (environment.python === false) lines.push('  - pip')
  return lines.join('\n') + '\n'
}

/**
 * Ensure an environment exists, creating it only if its spec has not been seen before.
 *
 * @returns {{status: 'ready'|'created'|'unavailable', prefix?: string, reason?: string}}
 */
export async function ensureEnvironment(environment, { workspace, condaCommand = process.env.CONDA_COMMAND ?? 'conda', dryRun = false } = {}) {
  const prefix = envPath(workspace, environment.key)
  const marker = join(prefix, '.dsh-ready')
  const existing = await stat(marker).then(info => info.isFile(), () => false)
  if (existing) {
    return { status: 'ready', prefix, key: environment.key }
  }
  if (dryRun) {
    return { status: 'created', prefix, key: environment.key, dryRun: true }
  }

  await mkdir(join(workspace, ENVS), { recursive: true })
  const yamlPath = join(workspace, ENVS, environment.key + '.yaml')
  await writeFile(yamlPath, environmentYaml(environment), 'utf8')

  const { spawn } = await import('node:child_process')
  const outcome = await new Promise(resolve => {
    const child = spawn(condaCommand, ['env', 'create', '--prefix', prefix, '--file', yamlPath, '--yes'], {
      windowsHide: true, stdio: 'ignore',
    })
    const timer = setTimeout(() => { try { child.kill() } catch { /* gone */ } resolve({ ok: false, reason: 'conda timed out' }) }, 1800000)
    child.on('error', error => { clearTimeout(timer); resolve({ ok: false, reason: error.message }) })
    child.on('close', code => { clearTimeout(timer); resolve({ ok: code === 0, reason: code === 0 ? undefined : 'conda exited ' + code }) })
  })

  if (!outcome.ok) {
    // No fallback: reporting a step as successful with the host interpreter when the
    // requested environment could not be built would attribute results to a toolchain
    // that never existed.
    return { status: 'unavailable', prefix, key: environment.key, reason: outcome.reason }
  }
  await writeFile(marker, new Date().toISOString() + '\n', 'utf8')
  return { status: 'created', prefix, key: environment.key }
}

/** The interpreter path inside an environment. */
export function pythonIn(prefix) {
  return process.platform === 'win32' ? join(prefix, 'python.exe') : join(prefix, 'bin', 'python')
}

/** Read the packages actually present, for the run record. */
export async function describeEnvironment(prefix) {
  try {
    const text = await readFile(join(prefix, 'conda-meta', 'history'), 'utf8')
    return { prefix, history: text.split('\n').slice(0, 40).join('\n') }
  } catch {
    return { prefix, history: null }
  }
}
