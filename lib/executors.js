/**
 * Executor plugins.
 *
 * The engine used to know about two backends by name. Adding a third meant editing the
 * engine, which meant every backend was a fork of the same switch statement. An executor
 * is now a named object with two methods, and the engine asks the registry.
 *
 * An executor is given everything it needs and returns a plain result; it does not touch
 * the plan, the provenance or the artifact store. That boundary is what makes a third
 * one safe to add.
 */

const registry = new Map()

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

/**
 * Register an executor.
 *
 * @param {object} executor
 * @param {string} executor.id
 * @param {(spec: object) => object} executor.describe  what this backend needs
 * @param {(step: object, context: object) => Promise<object>} executor.run
 */
export function registerExecutor(executor) {
  if (executor === null || typeof executor !== 'object') fail('INVALID_EXECUTOR', 'an executor must be an object')
  const id = executor.id
  if (typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id)) fail('INVALID_EXECUTOR', 'executor.id must be lowercase words separated by dashes')
  if (typeof executor.run !== 'function') fail('INVALID_EXECUTOR', 'executor ' + id + ' needs a run function')
  if (typeof executor.describe !== 'function') fail('INVALID_EXECUTOR', 'executor ' + id + ' needs a describe function')
  registry.set(id, Object.freeze({ ...executor, id }))
  return id
}

export function getExecutor(id) {
  const executor = registry.get(id)
  if (!executor) fail('UNKNOWN_EXECUTOR', 'no executor is registered as "' + id + '". Registered: ' + [...registry.keys()].join(', '))
  return executor
}

export function listExecutors() {
  return [...registry.values()].map(executor => ({ id: executor.id, ...executor.describe() }))
}

export function hasExecutor(id) {
  return registry.has(id)
}

/** Test seam: a registry with one executor is easier to reason about than shared state. */
export function __resetExecutors() {
  registry.clear()
}
