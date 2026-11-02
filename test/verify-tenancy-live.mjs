/**
 * Two real users, two tenants, one server: prove that one cannot see the other.
 *
 * Run: node test/verify-tenancy-live.mjs
 *
 * Skips when Keycloak is not reachable. Uses tokens the provider actually signed, so the
 * isolation is tested against real claims rather than hand-made ones.
 */
import { createReport } from "./harness.mjs"

const report = createReport("verify-tenancy-live")

const issuer = process.env.DSH_JWT_ISSUER ?? "http://127.0.0.1:8080/realms/dsh"
const api = process.env.DSH_API ?? "http://127.0.0.1:4175"
const clientId = "dsh-workbench"
const secret = "local-test-secret-not-for-production"

async function token(username, password) {
  const discovery = await (await fetch(issuer + "/.well-known/openid-configuration")).json()
  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "password", client_id: clientId, client_secret: secret, username, password, scope: "openid" }),
  })
  if (!response.ok) return undefined
  const body = await response.json()
  return body.access_token
}

const reachable = await fetch(issuer + "/.well-known/openid-configuration").then(r => r.ok, () => false)
if (!reachable) {
  report.skip("idp-reachable", "no identity provider at " + issuer)
  report.finish()
  process.exit(process.exitCode ?? 0)
}
const server = await fetch(api + "/health").then(r => r.status, () => 0)
if (server === 0) {
  report.skip("api-reachable", "no server at " + api)
  report.finish()
  process.exit(process.exitCode ?? 0)
}
report.check("api-requires-authentication", server === 401, "health returned " + server)

const alice = await token("researcher", "research-pass-123")
const bob = await token("outsider", "outsider-pass-123")
report.check("two-users-get-tokens", Boolean(alice) && Boolean(bob))

const call = async (bearer, method, path, body) => {
  const response = await fetch(api + path, {
    method,
    headers: { authorization: "Bearer " + bearer, ...(body ? { "content-type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await response.text()
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = text }
  return { status: response.status, body: parsed }
}

const plan = { steps: [{ id: "s", command: "node -e", argv: [process.execPath, "-e", "require(String.fromCharCode(102,115)).writeFileSync(String.fromCharCode(111,117,116),String.fromCharCode(104,105))"], outputs: [{ path: "out", minBytes: 1 }] }] }
const submitted = await call(alice, "POST", "/api/runs", { plan, title: "alice run" })
report.check("alice-may-submit", submitted.status === 202, submitted.status + " " + JSON.stringify(submitted.body).slice(0, 60))
const runId = submitted.body.id

for (let attempt = 0; attempt < 40; attempt++) {
  await new Promise(r => setTimeout(r, 300))
  const check = await call(alice, "GET", "/api/runs/" + encodeURIComponent(runId))
  if (check.status === 200) break
}

const own = await call(alice, "GET", "/api/runs/" + encodeURIComponent(runId))
report.check("alice-reads-her-own-run", own.status === 200, own.status)

// The point: bob asks for a run that exists, and must not learn that it exists.
const foreign = await call(bob, "GET", "/api/runs/" + encodeURIComponent(runId))
report.check("bob-cannot-read-alices-run", foreign.status === 404, foreign.status)
report.check("the-refusal-does-not-reveal-existence", JSON.stringify(foreign.body).includes("no such record"), JSON.stringify(foreign.body).slice(0, 60))

const bobList = await call(bob, "GET", "/api/runs")
report.check("bob-list-is-empty", Array.isArray(bobList.body?.runs) && bobList.body.runs.length === 0, (bobList.body?.runs ?? []).length + " runs")

const bobReport = await call(bob, "GET", "/api/runs/" + encodeURIComponent(runId) + "/report")
report.check("bob-cannot-read-the-report", bobReport.status === 404)

const bobBundle = await call(bob, "POST", "/api/runs/" + encodeURIComponent(runId) + "/bundle")
report.check("bob-cannot-export-the-bundle", bobBundle.status === 404)

const noToken = await fetch(api + "/api/runs")
report.check("no-token-is-refused", noToken.status === 401)

const badToken = await fetch(api + "/api/runs", { headers: { authorization: "Bearer not.a.token" } })
report.check("a-malformed-token-is-refused", badToken.status === 401)

report.finish()
