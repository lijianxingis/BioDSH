/**
 * Verify distributed execution and the identity model against real workers.
 *
 * Run: node test/verify-distributed-identity.mjs
 */
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { startWorker } from "../lib/worker-agent.mjs"
import { defineWorker, runDistributed, planDistributability, isRetryable } from "../lib/distributed.js"
import { createArtifactStore } from "../lib/artifact-store.js"
import { definePlan } from "../lib/workflow-engine.js"
import { ROLES, definePrincipal, createRegistry, authorize, hasDecider } from "../lib/identity.js"
import { generateSigningKey } from "../lib/signing.js"
import { createReport } from "./harness.mjs"

const node = process.execPath
const report = createReport("verify-distributed-identity")
const workspace = await mkdtemp(join(tmpdir(), "dsh-dist-"))
const workers = []

try {
  // Identity: roles must separate executing from approving.
  const operator = definePrincipal({ name: "op", role: "operator", publicKey: generateSigningKey().publicKey })
  const reviewer = definePrincipal({ name: "rev", role: "reviewer", publicKey: generateSigningKey().publicKey })
  report.check("operator-may-execute", authorize(operator, "execute").allowed === true)
  report.check("operator-may-not-approve", authorize(operator, "decide").allowed === false)
  report.check("reviewer-may-approve", authorize(reviewer, "decide").allowed === true)
  report.check("reviewer-may-not-execute", authorize(reviewer, "execute").allowed === false)
  report.check("registry-has-a-decider", hasDecider(createRegistry([operator, reviewer])) === true)
  report.check("roles-are-declared", Object.keys(ROLES).length === 4)

  // A worker without a token must refuse to start.
  let refused = false
  try { await startWorker({ token: "" }) } catch { refused = true }
  report.check("worker-requires-a-token", refused)

  // Plain HTTP to a remote host must be refused.
  let insecure = false
  try { defineWorker({ id: "w", url: "http://example.com:8080", token: "t" }) } catch { insecure = true }
  report.check("plain-http-refused-off-loopback", insecure)

  // A real two-worker chain: the artifact must actually travel.
  const alpha = await startWorker({ token: "ta" })
  const beta = await startWorker({ token: "tb" })
  workers.push(alpha, beta)
  const plan = definePlan({ steps: [
    { id: "produce", command: "x", outputs: [{ path: "v.txt", minBytes: 1 }],
      argv: [node, "-e", "require('fs').writeFileSync('v.txt','PAYLOAD')"] },
    { id: "consume", command: "x", needs: ["produce"], inputs: [{ path: "v.txt" }], outputs: [{ path: "r.txt", minBytes: 2 }],
      argv: [node, "-e", "require('fs').writeFileSync('r.txt',require('fs').readFileSync('v.txt','utf8').toLowerCase())"] },
  ] })
  const store = createArtifactStore(join(workspace, "store"))
  const result = await runDistributed(plan, {
    workers: [
      defineWorker({ id: "alpha", url: alpha.url, token: "ta", concurrency: 1 }),
      defineWorker({ id: "beta", url: beta.url, token: "tb", concurrency: 1 }),
    ],
    approveParallel: true, store,
  })
  report.check("distributed-chain-completes", result.status === "completed", "status=" + result.status)
  const shipped = result.steps.find(step => step.id === "consume")?.artifacts?.[0]
  const bytes = shipped ? await store.get(shipped.sha256).catch(() => undefined) : undefined
  report.check("artifact-crossed-the-wire", bytes?.toString() === "payload", bytes?.toString())
  report.check("verdicts-are-the-coordinators", result.steps.every(step => step.verifiedBy === "coordinator"))
  report.check("result-not-claimed-reproducible", result.reproducible === false)

  // A non-zero exit is a failure and must not be retried.
  report.check("real-failure-is-not-retryable", isRetryable({ status: "failed", exitCode: 2 }) === false)
  report.check("transport-failure-is-retryable", isRetryable({ status: "failed", transportFailure: true }) === true)

  // A plan whose dependency has no outputs cannot be distributed.
  const unshippable = definePlan({ steps: [
    { id: "a", command: "x", argv: [node, "-e", "0"] },
    { id: "b", command: "x", needs: ["a"], argv: [node, "-e", "0"] },
  ] })
  report.check("unshippable-plan-is-refused", planDistributability(unshippable).fullyDistributable === false)

  // Parallel distribution without approval must be refused.
  let needsApproval = false
  try {
    await runDistributed(plan, { workers: [defineWorker({ id: "w", url: alpha.url, token: "ta" })], store, concurrency: 2 })
  } catch (error) { needsApproval = error.code === "PARALLEL_NOT_APPROVED" }
  report.check("parallel-needs-approval", needsApproval)
} finally {
  for (const worker of workers) await worker.close().catch(() => {})
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
