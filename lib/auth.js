/**
 * Who is making this request.
 *
 * Two modes, and the difference is the point:
 *
 *  - \`none\`: a single local principal. This is not authentication and the code says so;
 *    every surface that reports the actor keeps the "identity not verified" suffix.
 *  - \`oidc\`: the server verifies a signed token against a JWKS. The server trusts an
 *    issuer and an audience, not a header.
 *
 * Tokens are verified, not decoded. Decoding a JWT and reading its claims is the classic
 * way to ship an authentication bypass: the claims are attacker-controlled until the
 * signature is checked.
 */
import { createHash, createPublicKey, verify as verifySignature } from 'node:crypto'

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

const base64url = input => Buffer.from(String(input).replace(/-/g, '+').replace(/_/g, '/'), 'base64')

export function decodeJwt(token) {
  const parts = String(token).split('.')
  if (parts.length !== 3) fail('INVALID_TOKEN', 'a JWT has three parts')
  let header, payload
  try {
    header = JSON.parse(base64url(parts[0]).toString('utf8'))
    payload = JSON.parse(base64url(parts[1]).toString('utf8'))
  } catch {
    fail('INVALID_TOKEN', 'the token is not valid base64url JSON')
  }
  return { header, payload, signature: base64url(parts[2]), signingInput: Buffer.from(parts[0] + '.' + parts[1], 'utf8') }
}

/** Build a public key from a JWKS entry. */
function keyFromJwk(jwk) {
  return createPublicKey({ key: jwk, format: 'jwk' })
}

/**
 * Verify a JWT against a keyset.
 *
 * Checks, in order: algorithm allowlist, key id present in the set, signature, expiry,
 * issuer, audience. A token that passes the signature but names the wrong audience is
 * still refused: a token minted for another service is not a token for this one.
 */
export function verifyJwt(token, { keys, issuer, audience, now = () => Date.now(), clockSkewSeconds = 60, algorithms = ['RS256', 'ES256'] } = {}) {
  const decoded = decodeJwt(token)
  if (!algorithms.includes(decoded.header.alg)) {
    fail('INVALID_TOKEN', 'algorithm "' + decoded.header.alg + '" is not accepted')
  }
  const jwk = keys?.find(key => key.kid === decoded.header.kid) ?? (keys?.length === 1 ? keys[0] : undefined)
  if (!jwk) fail('INVALID_TOKEN', 'no key matches key id ' + String(decoded.header.kid))

  const algorithm = decoded.header.alg === 'ES256' ? 'sha256' : 'RSA-SHA256'
  const publicKey = keyFromJwk(jwk)
  let ok = false
  try {
    ok = verifySignature(algorithm, decoded.signingInput, publicKey, decoded.signature)
  } catch {
    ok = false
  }
  if (!ok) fail('INVALID_TOKEN', 'the signature does not verify')

  const nowSeconds = Math.floor(now() / 1000)
  const skew = Number(clockSkewSeconds) || 0
  if (typeof decoded.payload.exp === 'number' && nowSeconds > decoded.payload.exp + skew) {
    fail('TOKEN_EXPIRED', 'the token expired at ' + new Date(decoded.payload.exp * 1000).toISOString())
  }
  if (typeof decoded.payload.nbf === 'number' && nowSeconds + skew < decoded.payload.nbf) {
    fail('TOKEN_NOT_YET_VALID', 'the token is not valid yet')
  }
  if (issuer && decoded.payload.iss !== issuer) {
    fail('INVALID_TOKEN', 'the issuer is ' + decoded.payload.iss + ', expected ' + issuer)
  }
  if (audience) {
    const audiences = Array.isArray(decoded.payload.aud) ? decoded.payload.aud : [decoded.payload.aud]
    if (!audiences.includes(audience)) {
      fail('INVALID_TOKEN', 'the token is not for this audience')
    }
  }
  return decoded.payload
}

/**
 * The local-only principal.
 *
 * Its id is derived from the workspace so two workspaces do not collide, and its name
 * says plainly that nobody verified it.
 */
export function localPrincipal(workspace) {
  return Object.freeze({
    id: 'local:' + createHash('sha256').update(String(workspace)).digest('hex').slice(0, 12),
    name: 'human-user (identity not verified)',
    roles: Object.freeze(['owner']),
    authenticated: false,
    tenant: deriveTenant(workspace),
  })
}

/** A tenant id derived from the workspace: stable, and not a security boundary by itself. */
export function deriveTenant(workspace) {
  return 'ws-' + createHash('sha256').update(String(workspace)).digest('hex').slice(0, 10)
}

/**
 * Turn verified claims into a principal.
 *
 * The tenant comes from a claim, never from a header or a query parameter: a caller that
 * can choose its own tenant can read everyone else's runs.
 */
export function principalFromClaims(claims, { tenantClaim = 'tenant' } = {}) {
  const tenant = claims[tenantClaim] ?? claims.org_id ?? claims.tenant_id
  if (typeof tenant !== 'string' || !tenant) {
    fail('NO_TENANT', 'the token carries no tenant claim (' + tenantClaim + '), so this request cannot be scoped')
  }
  const roles = claims.roles ?? (claims.scope ? String(claims.scope).split(' ') : ['viewer'])
  return Object.freeze({
    id: String(claims.sub ?? 'unknown'),
    name: String(claims.email ?? claims.preferred_username ?? claims.sub ?? 'unknown'),
    roles: Object.freeze([].concat(roles)),
    authenticated: true,
    tenant: String(tenant),
  })
}

/** Does this principal hold the role a request needs? */
export function requiresRole(principal, role) {
  if (!principal) return false
  if (principal.roles.includes('owner') || principal.roles.includes('admin')) return true
  return principal.roles.includes(role)
}

/** True when nothing is checking identity, which a caller may need to report. */
export function isUnauthenticated(principal) {
  return principal?.authenticated !== true
}
