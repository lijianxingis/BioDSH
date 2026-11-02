/**
 * The adapter contract.
 *
 * The core engine does not know what a "host" is. An adapter is the only thing that does:
 * it resolves a session, decides what a path means, and writes a file. Everything else -
 * planning, execution, provenance, signing - is the engine's job and does not change
 * between hosts.
 *
 * This file exists so that "can I use this somewhere else" has a checkable answer:
 * implement these six functions and the engine works.
 */

export const ADAPTER_VERSION = 1

/**
 * The shape every adapter must provide. Values are descriptions, not defaults: an
 * adapter that silently gets a default for a security-relevant field is worse than one
 * that fails to load.
 */
export const REQUIRED = Object.freeze({
  resolveSession: 'async (sessionId) => { id, workspace, preset }',
  resolvePath: 'async (session, path) => { hostPath, insideWorkspace, exists }',
  readFile: 'async (session, hostPath, maxBytes) => Buffer',
  writeFile: 'async (session, hostPath, text, options) => { version }',
  listRuns: 'async (session) => Array<{ id, title, status, updatedAt }>',
  saveRun: 'async (session, run) => void',
})

/**
 * Check that an object satisfies the contract, and say precisely what is missing.
 *
 * Deliberately strict: an adapter missing one function would otherwise fail at the first
 * call, deep inside a request, with an error that points at the call site rather than at
 * the adapter.
 */
export function assertAdapter(adapter) {
  if (adapter === null || typeof adapter !== 'object') {
    throw new TypeError('an adapter must be an object')
  }
  const missing = Object.keys(REQUIRED).filter(name => typeof adapter[name] !== 'function')
  if (missing.length) {
    throw new TypeError(
      'adapter is missing required functions: ' + missing.join(', ') +
      '. See lib/adapter.js for the contract.',
    )
  }
  return adapter
}

/** A minimal description of what an adapter provides, for diagnostics. */
export function describeAdapter(adapter) {
  assertAdapter(adapter)
  return Object.freeze({
    adapterVersion: ADAPTER_VERSION,
    implements: Object.keys(REQUIRED),
    ...(typeof adapter.describe === 'function' ? { detail: adapter.describe() } : {}),
  })
}
