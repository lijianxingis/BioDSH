/**
 * Verify OIDC against a real identity provider.
 *
 * Run: node test/verify-oidc-live.mjs [--issuer URL] [--client-id ID] [--secret S]
 *
 * Skips cleanly when no IdP is reachable: this checks an integration, and pretending it
 * passed without a provider would defeat the point.
 */
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { createReport } from "./harness.mjs"
import { verifyJwt, principalFromClaims, requiresRole, isUnauthenticated, localPrincipal } from "../lib/auth.js"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-oidc-live")

const args = process.argv.slice(2)
const flag = (name, fallback) => { const at = args.indexOf("--" + name); return at === -1 ? fallback : args[at + 1] }
const issuer = flag("issuer", process.env.DSH_JWT_ISSUER ?? "http://127.0.0.1:8080/realms/dsh")
const clientId = flag("client-id", "dsh-workbench")
const secret = flag("secret", "local-test-secret-not-for-production")
const username = flag("username", "researcher")
const password = flag("password", "research-pass-123")

async function discover() {
  const response = await fetch(issuer + "/.well-known/openid-configuration").catch(() => undefined)
  if (!response?.ok) return undefined
  return response.json()
}

const configuration = await discover()
if (!configuration) {
  report.skip("idp-reachable", "no identity provider at " + issuer)
  report.finish()
  process.exit(process.exitCode ?? 0)
}
report.check("idp-reachable", true, configuration.issuer)
report.check("discovery-names-the-jwks", typeof configuration.jwks_uri === "string", configuration.jwks_uri)

const jwks = await (await fetch(configuration.jwks_uri)).json()
report.check("jwks-lists-signing-keys", Array.isArray(jwks.keys) && jwks.keys.length > 0, jwks.keys.length + " keys")
// A provider may publish encryption keys alongside signing keys; the algorithm allowlist
// is what keeps the extra ones harmless.
report.check("jwks-includes-an-rs256-key", jwks.keys.some(key => key.alg === "RS256"))

const tokenResponse = await fetch(configuration.token_endpoint, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "password", client_id: clientId, client_secret: secret, username, password, scope: "openid" }),
})
if (!tokenResponse.ok) {
  report.check("token-issued", false, "the provider refused the grant: " + tokenResponse.status)
  report.finish()
  process.exit(process.exitCode ?? 0)
}
const issued = await tokenResponse.json()
report.check("token-issued", typeof issued.access_token === "string" && issued.access_token.length > 100, issued.access_token.length + " chars")

let claims
try {
  claims = verifyJwt(issued.access_token, { keys: jwks.keys, issuer: configuration.issuer })
  report.check("real-token-verifies", true)
} catch (error) {
  report.check("real-token-verifies", false, error.code + ": " + error.message)
  report.finish()
  process.exit(process.exitCode ?? 0)
}

report.check("verifier-reads-the-subject", typeof claims.sub === "string" && claims.sub.length > 8, claims.sub)
report.check("verifier-reads-the-expiry", typeof claims.exp === "number")

const principal = principalFromClaims(claims)
report.check("principal-carries-a-tenant", typeof principal.tenant === "string" && principal.tenant.length > 0, principal.tenant)
report.check("principal-is-marked-authenticated", principal.authenticated === true)
report.check("unverified-principal-is-different", isUnauthenticated(localPrincipal("/w")) === true && isUnauthenticated(principal) === false)

// The refusals are the security property, so they are checked with a real token.
const refusals = [
  ["wrong-issuer", () => verifyJwt(issued.access_token, { keys: jwks.keys, issuer: "http://not-the-issuer.invalid/realms/dsh" })],
  ["wrong-audience", () => verifyJwt(issued.access_token, { keys: jwks.keys, issuer: configuration.issuer, audience: "another-service" })],
  ["unknown-key", () => verifyJwt(issued.access_token, { keys: [{ ...jwks.keys.find(k => k.alg === "RS256"), kid: "forged-kid" }], issuer: configuration.issuer })],
  ["tampered-claims", () => {
    const parts = issued.access_token.split(".")
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"))
    payload.tenant = "someone-else"
    const forged = Buffer.from(JSON.stringify(payload)).toString("base64url")
    return verifyJwt(parts[0] + "." + forged + "." + parts[2], { keys: jwks.keys, issuer: configuration.issuer })
  }],
  ["algorithm-none", () => {
    const parts = issued.access_token.split(".")
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url")
    return verifyJwt(header + "." + parts[1] + ".", { keys: jwks.keys, issuer: configuration.issuer })
  }],
]
for (const [name, attempt] of refusals) {
  let refused = false
  let code
  try { attempt() } catch (error) { refused = true; code = error.code }
  report.check("refuses-" + name, refused && code === "INVALID_TOKEN", code)
}

// An expired token: this is what a clock-skew bug looks like from the outside.
const staleIssuedAt = Math.floor(Date.now() / 1000) - 3600
report.check("clock-skew-is-bounded", (() => {
  const expired = { ...claims, exp: staleIssuedAt }
  try {
    verifyJwt(issued.access_token, { keys: jwks.keys, issuer: configuration.issuer, now: () => (staleIssuedAt + 7200) * 1000 })
    return false
  } catch (error) { return error.code === "TOKEN_EXPIRED" }
})())

report.finish()
