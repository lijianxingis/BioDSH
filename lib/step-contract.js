/**
 * Structural input/output contracts for a step.
 *
 * A declaration is only worth having if it is enforced, so everything here is used by
 * the engine at dispatch time rather than being documentation:
 *
 * - inputs are checked before the command runs, so a missing input fails the step
 *   without executing anything;
 * - outputs are checked after, so exit code 0 without the declared artifact is a
 *   failure;
 * - a declared media type is checked against the file's magic bytes, because a
 *   declared image/png that is really text is a broken promise, not a detail.
 */

export const MAX_ENTRIES = 64
const NAME = /^[A-Za-z0-9._-]{1,64}$/
const MEDIA_TYPE = /^[a-z]+\/[a-z0-9][a-z0-9.+-]*$/

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

function assertInsideWorkspace(path, label) {
  if (path.startsWith('/') || path.includes('..') || path.startsWith('~') || /^[A-Za-z]:/.test(path)) {
    fail('INVALID_CONTRACT', `${label} must stay inside the workspace`)
  }
}

function literalOf(glob) {
  return glob.replace(/\*/g, '')
}

function defineInput(spec) {
  if (typeof spec === 'string') {
    if (!spec) fail('INVALID_CONTRACT', 'input path must not be empty')
    assertInsideWorkspace(spec, `input.${spec}`)
    return Object.freeze({ path: spec, required: true })
  }
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
    fail('INVALID_CONTRACT', 'input must be a path string or an object')
  }
  const path = spec.path
  if (typeof path !== 'string' || !path) fail('INVALID_CONTRACT', 'input.path must be a non-empty string')
  assertInsideWorkspace(path, `input.${path}`)
  const mediaType = spec.mediaType
  if (mediaType !== undefined && (typeof mediaType !== 'string' || !MEDIA_TYPE.test(mediaType))) {
    fail('INVALID_CONTRACT', `input.${path}.mediaType must look like "text/csv".`)
  }
  return Object.freeze({
    path,
    required: spec.required !== false,
    ...(mediaType === undefined ? {} : { mediaType }),
  })
}

function defineOutput(spec) {
  if (typeof spec === 'string') {
    if (!spec) fail('INVALID_CONTRACT', 'output path must not be empty')
    assertInsideWorkspace(literalOf(spec), `output.${spec}`)
    return Object.freeze({ path: literalOf(spec), glob: spec, required: true })
  }
  if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
    fail('INVALID_CONTRACT', 'output must be a path string or an object')
  }
  const glob = spec.path
  if (typeof glob !== 'string' || !glob) fail('INVALID_CONTRACT', 'output.path must be a non-empty string')
  assertInsideWorkspace(literalOf(glob), `output.${glob}`)
  const mediaType = spec.mediaType
  if (mediaType !== undefined && (typeof mediaType !== 'string' || !MEDIA_TYPE.test(mediaType))) {
    fail('INVALID_CONTRACT', `output.${glob}.mediaType must look like "text/csv".`)
  }
  if (spec.minBytes !== undefined && (!Number.isSafeInteger(spec.minBytes) || spec.minBytes < 0)) {
    fail('INVALID_CONTRACT', `output.${glob}.minBytes must be a non-negative integer.`)
  }
  if (spec.name !== undefined && (typeof spec.name !== 'string' || !NAME.test(spec.name))) {
    fail('INVALID_CONTRACT', `output.${glob}.name must be a short identifier.`)
  }
  return Object.freeze({
    path: literalOf(glob),
    glob,
    required: spec.required !== false,
    ...(mediaType === undefined ? {} : { mediaType }),
    ...(spec.minBytes === undefined ? {} : { minBytes: spec.minBytes }),
    ...(spec.name === undefined ? {} : { name: spec.name }),
  })
}

export function defineContract({ inputs, outputs } = {}) {
  const rawInputs = inputs === undefined ? [] : inputs
  const rawOutputs = outputs === undefined ? [] : outputs
  if (!Array.isArray(rawInputs) || rawInputs.length > MAX_ENTRIES) {
    fail('INVALID_CONTRACT', `inputs must be an array of at most ${MAX_ENTRIES} entries.`)
  }
  if (!Array.isArray(rawOutputs) || rawOutputs.length > MAX_ENTRIES) {
    fail('INVALID_CONTRACT', `outputs must be an array of at most ${MAX_ENTRIES} entries.`)
  }
  const inputsOut = rawInputs.map(defineInput)
  const outputsOut = rawOutputs.map(defineOutput)
  const seen = new Set()
  for (const output of outputsOut) {
    if (seen.has(output.glob)) fail('INVALID_CONTRACT', `Duplicate output declaration: ${output.glob}`)
    seen.add(output.glob)
  }
  return Object.freeze({ inputs: Object.freeze(inputsOut), outputs: Object.freeze(outputsOut) })
}

export async function findMissingInputs(contract, { workspace, stat }) {
  const missing = []
  for (const input of contract.inputs) {
    if (!input.required) continue
    let found = false
    try {
      const info = await stat(`${workspace}/${input.path}`)
      found = info !== undefined && info !== null
    } catch { found = false }
    if (!found) missing.push(input.path)
  }
  return missing
}

export function matchOutput(declaration, producedFiles) {
  if (declaration.glob.includes('*')) {
    const star = declaration.glob.indexOf('*')
    const prefix = declaration.glob.slice(0, star)
    const suffix = declaration.glob.slice(star + 1)
    return producedFiles.filter(file => file.path.startsWith(prefix) && file.path.endsWith(suffix))
  }
  return producedFiles.filter(file => file.path === declaration.path)
}

/**
 * Magic numbers for the formats where a wrong declaration is detectable. Anything not
 * listed here is accepted: guessing is worse than admitting ignorance.
 */
const MAGIC = [
  { mediaType: /^image\/png$/, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], name: 'PNG' },
  { mediaType: /^image\/jpeg$/, bytes: [0xff, 0xd8, 0xff], name: 'JPEG' },
  { mediaType: /^image\/gif$/, bytes: [0x47, 0x49, 0x46, 0x38], name: 'GIF' },
  { mediaType: /^application\/pdf$/, bytes: [0x25, 0x50, 0x44, 0x46], name: 'PDF' },
  { mediaType: /^application\/gzip$/, bytes: [0x1f, 0x8b], name: 'gzip' },
]

export function checkMediaType(mediaType, head) {
  const rule = MAGIC.find(item => item.mediaType.test(mediaType))
  if (rule === undefined) return { checked: false }
  const matches = rule.bytes.every((byte, index) => head?.[index] === byte)
  return matches ? { checked: true, ok: true } : { checked: true, ok: false, expected: rule.name }
}

export function evaluateOutputs(contract, producedFiles, { heads } = {}) {
  const verdicts = contract.outputs.map(declaration => {
    const matches = matchOutput(declaration, producedFiles)
    if (!matches.length) {
      return Object.freeze({
        path: declaration.glob,
        required: declaration.required,
        satisfied: !declaration.required,
        reason: declaration.required ? 'declared output was not produced' : 'optional output was not produced',
      })
    }
    if (declaration.mediaType !== undefined && heads !== undefined) {
      for (const match of matches) {
        const verdict = checkMediaType(declaration.mediaType, heads[match.path])
        if (verdict.checked && verdict.ok === false) {
          return Object.freeze({
            path: declaration.glob,
            required: declaration.required,
            satisfied: !declaration.required,
            bytes: 0,
            reason: `declared ${declaration.mediaType} but the bytes are not a ${verdict.expected} file`,
          })
        }
      }
    }
    const totalBytes = matches.reduce((sum, file) => sum + (file.bytes ?? 0), 0)
    if (declaration.minBytes !== undefined && totalBytes < declaration.minBytes) {
      return Object.freeze({
        path: declaration.glob,
        required: declaration.required,
        satisfied: !declaration.required,
        bytes: totalBytes,
        reason: `produced ${totalBytes} bytes, below the declared minimum of ${declaration.minBytes}`,
      })
    }
    return Object.freeze({
      path: declaration.glob,
      required: declaration.required,
      satisfied: true,
      bytes: totalBytes,
      matched: Object.freeze(matches.map(file => file.path)),
    })
  })
  const unsatisfiedRequired = verdicts.filter(verdict => verdict.required && !verdict.satisfied)
  return Object.freeze({
    verdicts: Object.freeze(verdicts),
    satisfied: unsatisfiedRequired.length === 0,
    unsatisfied: Object.freeze(unsatisfiedRequired.map(verdict => verdict.path)),
  })
}
