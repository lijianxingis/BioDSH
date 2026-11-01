/**
 * Local principals and signed decisions.
 *
 * A principal id is derived from its key, not chosen, so two people cannot end up with
 * the same id by accident. Roles separate executing from approving: an operator who can
 * run a pipeline is not thereby allowed to accept its results.
 *
 * What this does NOT provide: any proof that a key belongs to the person it names. There
 * is no certificate authority here, and every surface says so.
 */
import { createHash } from 'node:crypto'
import { signDigest, verifySignature } from './signing.js'

export const ROLES = Object.freeze({
  observer: Object.freeze({ execute: false, decide: false }),
  operator: Object.freeze({ execute: true, decide: false }),
  reviewer: Object.freeze({ execute: false, decide: true }),
  owner: Object.freeze({ execute: true, decide: true }),
})

export const limitations = Object.freeze([
  'A principal id is derived from a public key; it proves possession of that key, not identity.',
  'There is no certificate authority, no password, and no second factor.',
  'A reviewer role permits accepting research results; it is not a clinical authorization.',
])

export function definePrincipal({ name, role = 'operator', publicKey, keyId }) {
  if (typeof name !== 'string' || !name.trim()) throw new TypeError('principal name must be a non-empty string')
  if (!Object.hasOwn(ROLES, role)) throw new TypeError('role must be one of ' + Object.keys(ROLES).join(', '))
  if (typeof publicKey !== 'string' || !publicKey.includes('BEGIN PUBLIC KEY')) throw new TypeError('publicKey must be a PEM public key')
  const derived = createHash('sha256').update(publicKey).digest('hex')
  if (keyId !== undefined && keyId !== derived) throw new TypeError('a principal id is derived from its key, not chosen')
  return Object.freeze({ id: derived, name: name.trim().slice(0, 120), role, publicKey })
}

export function createRegistry(principals = []) {
  const byId = new Map()
  for (const principal of principals) {
    if (byId.has(principal.id)) throw new TypeError('two principals cannot share an id')
    byId.set(principal.id, principal)
  }
  return Object.freeze({
    get: id => byId.get(id),
    list: () => [...byId.values()],
    add(principal) {
      if (byId.has(principal.id)) throw new TypeError('two principals cannot share an id')
      byId.set(principal.id, principal)
    },
  })
}

export function authorize(principal, action) {
  if (!principal) return Object.freeze({ allowed: false, code: 'NO_PRINCIPAL', reason: 'no principal was supplied' })
  const role = ROLES[principal.role]
  if (!role) return Object.freeze({ allowed: false, code: 'UNKNOWN_ROLE', reason: 'the principal has an unknown role' })
  const needed = action === 'execute' ? role.execute : role.decide
  if (!needed) {
    return Object.freeze({
      allowed: false,
      code: action === 'execute' ? 'EXECUTION_NOT_PERMITTED' : 'DECISION_NOT_PERMITTED',
      reason: 'the ' + principal.role + ' role may not ' + action,
    })
  }
  return Object.freeze({ allowed: true })
}

export function hasDecider(registry) {
  return registry.list().some(principal => ROLES[principal.role]?.decide === true)
}

/** Sign an action so it cannot be replayed onto a different run or decision. */
export function signAction({ action, runId, decision, reason, at, privateKey, keyId }) {
  const material = JSON.stringify({ action, runId, decision: decision ?? null, reason: reason ?? '', at })
  const digest = createHash('sha256').update(material).digest('hex')
  const signature = signDigest(digest, privateKey)
  return Object.freeze({ ...signature, keyId, material: digest })
}

export function verifyAction({ action, runId, decision, reason, at, signature, publicKey }) {
  if (!signature) return 'absent'
  const material = JSON.stringify({ action, runId, decision: decision ?? null, reason: reason ?? '', at })
  const digest = createHash('sha256').update(material).digest('hex')
  if (digest !== signature.digest) return 'invalid'
  return verifySignature({ ...signature, digest }, publicKey)
}
