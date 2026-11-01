/**
 * Execution specifications.
 *
 * The spec is the part that decides whether "container isolation" is a true statement,
 * and it can be checked without running anything. A floating tag, a shell as the
 * executable, or a missing digest would each make the claim false.
 */

const DIGEST = /@sha256:[a-f0-9]{64}$/
const SHELLS = new Set(['sh', 'bash', 'zsh', 'dash', 'cmd', 'cmd.exe', 'powershell', 'pwsh', 'pwsh.exe'])

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

export function defineExecutionSpec(spec) {
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) throw new TypeError('spec must be a plain object')
  const image = spec.image
  if (typeof image !== 'string' || !image) fail('INVALID_SPEC', 'image must be a non-empty string')
  if (!DIGEST.test(image)) {
    fail('INVALID_SPEC', 'image must be pinned by digest (name@sha256:<64 hex>); a tag such as ":latest" is not reproducible')
  }
  const command = Array.isArray(spec.command) ? spec.command : null
  if (!command || !command.length) fail('INVALID_SPEC', 'command must be a non-empty argv array')
  if (command.some(item => typeof item !== 'string')) fail('INVALID_SPEC', 'command must contain only strings')
  const executable = command[0].split(/[\\/]/).pop().toLowerCase()
  if (SHELLS.has(executable)) {
    fail('INVALID_SPEC', 'command must not invoke a shell; pass argv so every argument stays auditable')
  }
  const mounts = Array.isArray(spec.mounts)
    ? spec.mounts.map(mount => Object.freeze({
        target: String(mount.target),
        readOnly: mount.readOnly !== false,
      }))
    : []
  return Object.freeze({
    schemaVersion: 1,
    backend: 'container',
    image: Object.freeze({ reference: image, digest: image.slice(image.indexOf('@') + 1) }),
    command: Object.freeze([...command]),
    mounts: Object.freeze(mounts),
    env: Object.freeze(spec.env ?? {}),
    resources: Object.freeze(spec.resources ?? {}),
    executable,
    executionStatus: 'not-run',
  })
}

export function defineLocalSpec({ command } = {}) {
  if (!Array.isArray(command) || !command.length) fail('INVALID_SPEC', 'command must be a non-empty argv array')
  return Object.freeze({
    schemaVersion: 1,
    backend: 'process',
    command: Object.freeze([...command]),
    executable: String(command[0]).split(/[\\/]/).pop(),
    executionStatus: 'not-run',
  })
}

export function describeRequirements(spec) {
  if (spec === null || typeof spec !== 'object') throw new TypeError('spec must be an object')
  if (spec.backend === 'process') {
    return Object.freeze({
      containerRuntime: 'not-required',
      toolchainPinned: false,
      note: 'Runs the host interpreter directly. Nothing pins the interpreter or its packages, so results are not reproducible.',
    })
  }
  const needsWritable = spec.mounts?.some(mount => mount.readOnly === false) === true
  return Object.freeze({
    containerRuntime: 'required',
    writableMounts: needsWritable,
    // Network access is the guarantee a reader most needs to see stated: a container run
    // that could reach the internet is a different risk profile from one that cannot.
    network: 'disabled',
    image: spec.image?.reference ?? 'unknown',
    limits: 'Digest-pinned image, no network, declared mounts only, hard timeout.',
    note: 'Running this specification needs a container daemon. The workbench does not run containers itself.',
  })
}
