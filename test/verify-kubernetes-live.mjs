/**
 * Run the kubernetes executor against a real cluster.
 *
 * Run: node test/verify-kubernetes-live.mjs
 *
 * Skips cleanly when no cluster is reachable. This checks an integration, and a green
 * result without a cluster would be a claim about nothing.
 */
import { mkdir, rm } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { createReport } from "./harness.mjs"
import { definePlan } from "../lib/workflow-engine.js"
import "../lib/executors-builtin.js"
import { getExecutor } from "../lib/executors.js"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-kubernetes-live")
const workspace = join(root, ".build", "k8s-verify-" + process.pid)

const kubectl = process.env.KUBECTL_COMMAND ?? "kubectl"
const probe = spawnSync(kubectl, ["version", "--request-timeout=8s"], { encoding: "utf8", timeout: 20000 })
if (probe.status !== 0) {
  report.skip("cluster-reachable", "no cluster: " + ((probe.stderr ?? "").split("\n")[0] ?? "").slice(0, 80))
  report.finish()
  process.exit(process.exitCode ?? 0)
}
report.check("cluster-reachable", true)

const image = process.env.K8S_TEST_IMAGE ?? "docker.io/library/busybox@sha256:a46257e06c82ad85242d0d38077d0a52d9896389ca60a1a59d3463db586e5fa4"
const namespace = process.env.K8S_NAMESPACE ?? "default"
const executor = getExecutor("kubernetes")

try {
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })

  // An unpinned image must be refused before anything reaches the cluster.
  const plan = definePlan({ steps: [{ id: "probe", command: "echo", argv: ["echo", "hello"], timeoutMs: 180000 }] })
  const unpinned = await executor.run(plan.steps[0], { workspace, options: { image: "busybox:latest" } })
  report.check("refuses-an-unpinned-image", unpinned.status === "failed" && /digest/.test(unpinned.error ?? ""), (unpinned.error ?? "").slice(0, 40))

  // A real job.
  const ok = await executor.run(plan.steps[0], { workspace, options: { image, namespace, ttlSeconds: 30 } })
  report.check("a-real-job-completes", ok.status === "completed", (ok.error ?? "").slice(0, 70))
  report.check("the-result-names-the-job", typeof ok.jobName === "string" && ok.jobName.length > 4, ok.jobName)
  report.check("the-result-reports-its-isolation", ok.isolation?.level === "pod" && ok.isolation?.namespace === namespace)
  report.check("no-service-account-token-is-minted", ok.isolation?.serviceAccountToken === "not-mounted")
  report.check("the-result-is-not-claimed-reproducible", ok.reproducible === false)

  // A failing command must come back as a failure, and soon: waiting only for
  // condition=complete meant a failed job sat until the timeout.
  const failingPlan = definePlan({ steps: [{ id: "fails", command: "false", argv: ["false"], timeoutMs: 120000 }] })
  const started = Date.now()
  const failed = await executor.run(failingPlan.steps[0], { workspace, options: { image, namespace, ttlSeconds: 30 } })
  const elapsed = Date.now() - started
  report.check("a-failing-command-fails", failed.status === "failed", failed.schedulerState ?? "")
  report.check("a-failure-does-not-wait-for-the-timeout", elapsed < 90000, (elapsed / 1000).toFixed(1) + "s")
  report.check("the-failure-explains-itself", /failed/i.test(failed.error ?? ""), (failed.error ?? "").slice(0, 50))

  // The manifest must actually carry automountServiceAccountToken: false, not merely
  // report it. Check the cluster rather than the object this code built.
  const inspection = spawnSync(kubectl, ["get", "job", failed.jobName ?? ok.jobName, "-n", namespace, "-o", "jsonpath={.spec.template.spec.automountServiceAccountToken}"], { encoding: "utf8", timeout: 30000 })
  report.check("the-cluster-confirms-no-token-mount", (inspection.stdout ?? "").trim() === "false", (inspection.stdout ?? "").trim() || "(empty)")
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
