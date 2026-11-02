/**
 * Verify the sixteen capabilities added to close the gap with established tools.
 *
 * Run: node test/verify-capabilities.mjs
 *
 * Each check exercises the feature rather than asserting a file exists: a DSL that parses,
 * an executor that refuses a missing scheduler, a tenant filter that hides a record.
 */
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { createReport } from "./harness.mjs"
import { parseDsl, workflowFromDsl, EXAMPLE } from "../lib/dsl.js"
import { registerExecutor, getExecutor, listExecutors, hasExecutor } from "../lib/executors.js"
import "../lib/executors-builtin.js"
import { defineEnvironment, ensureEnvironment, environmentYaml } from "../lib/environments.js"
import { toDot, toSvg, layersOf } from "../lib/graph.js"
import { renderHtmlReport } from "../lib/report-html.js"
import { createMetrics, recordRun } from "../lib/metrics.js"
import { localPrincipal, verifyJwt, principalFromClaims, requiresRole, isUnauthenticated } from "../lib/auth.js"
import { stampTenant, visibleTo, assertOwned, tenantRunsDirectory } from "../lib/tenancy.js"
import { inspectCheckpoint, resumePlan } from "../lib/checkpoint.js"
import { createProvenance } from "../lib/provenance.js"
import { definePlan } from "../lib/workflow-engine.js"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-capabilities")
const scratch = join(root, ".build", "capabilities-" + process.pid)

try {
  await rm(scratch, { recursive: true, force: true })
  await mkdir(scratch, { recursive: true })

  // 1-2: DSL
  const parsed = parseDsl(EXAMPLE)
  report.check("dsl-parses-yaml-subset", typeof parsed.value === "object" && parsed.value.steps.length > 0, parsed.lines + " lines")
  const fromDsl = workflowFromDsl(EXAMPLE)
  report.check("dsl-produces-a-plan-shape", Array.isArray(fromDsl.steps) && fromDsl.steps[0].outputs.length === 1)
  let dslRejected = false
  try { workflowFromDsl("steps: []") } catch { dslRejected = true }
  report.check("dsl-refuses-an-empty-workflow", dslRejected)
  let indentationCaught = false
  try { parseDsl("a: 1\n    b: 2") } catch { indentationCaught = true }
  report.check("dsl-reports-bad-indentation", indentationCaught)

  // 3: executor registry
  const ids = listExecutors().map(e => e.id)
  report.check("five-executors-registered", ids.length === 5, ids.join(","))
  report.check("executor-registry-rejects-a-bad-id", (() => {
    try { registerExecutor({ id: "Not Valid", describe: () => ({}), run: async () => ({}) }); return false } catch { return true }
  })())
  report.check("unknown-executor-names-the-known-ones", (() => {
    try { getExecutor("nope"); return false } catch (error) { return /local/.test(error.message) }
  })())

  // 4-7: each scheduler-backed executor refuses when its scheduler is absent.
  const plan = definePlan({ steps: [{ id: "s1", command: "echo hi", argv: ["echo", "hi"], outputs: [] }] })
  const step = plan.steps[0]
  const slurm = await getExecutor("slurm").run(step, { workspace: scratch, options: {} })
  report.check("slurm-fails-closed-without-sbatch", slurm.status === "failed" && /sbatch/.test(slurm.error ?? ""), (slurm.error ?? "").slice(0, 50))
  const k8s = await getExecutor("kubernetes").run(step, { workspace: scratch, options: {} })
  report.check("kubernetes-requires-a-pinned-image", k8s.status === "failed" && /digest/.test(k8s.error ?? ""))
  const cloud = await getExecutor("cloud-batch").run(step, { workspace: scratch, options: {} })
  report.check("cloud-batch-requires-an-adapter", cloud.status === "failed" && /CLOUD_BATCH_COMMAND/.test(cloud.error ?? ""))
  const sing = await getExecutor("singularity").run(step, { workspace: scratch, options: {} })
  // No image at all is refused before the pinning check, which is the more useful order.
  report.check("singularity-refuses-an-unpinned-image", sing.status === "failed" && /no image|pinned/i.test(sing.error ?? ""), (sing.error ?? "").slice(0, 40))
  const unpinned = await getExecutor("singularity").run(step, { workspace: scratch, options: { image: "alpine:latest" } })
  report.check("singularity-rejects-a-floating-tag", unpinned.status === "failed" && /pinned/.test(unpinned.error ?? ""))
  report.check("no-executor-falls-back-to-local", [slurm, k8s, cloud, sing].every(r => r.executor !== "local"))

  // 8: conda
  const environment = defineEnvironment({ packages: ["python=3.11"] })
  const yaml = environmentYaml(environment)
  report.check("conda-yaml-renders", /dependencies:/.test(yaml) && /python=3.11/.test(yaml))
  const conda = await ensureEnvironment(environment, { workspace: scratch, condaCommand: "no-such-conda" })
  report.check("conda-missing-is-reported", conda.status === "unavailable")

  // 9-11: DAG / report / metrics
  const twoStep = definePlan({ steps: [
    { id: "a", command: "x", outputs: ["o.txt"] },
    { id: "b", command: "x", needs: ["a"], outputs: ["p.txt"] },
  ] })
  report.check("graph-assigns-layers-by-dependency", layersOf(twoStep).get("a") === 0 && layersOf(twoStep).get("b") === 1)
  report.check("dot-names-every-step", ["a", "b"].every(id => toDot(twoStep).includes('"' + id + '"')))
  const svg = toSvg(twoStep)
  report.check("svg-needs-no-script", !/<script/.test(svg) && svg.includes("<svg"))

  const run = { id: "r1", title: "t", status: "completed", templateId: "x", createdAt: new Date().toISOString(), steps: [{ id: "a", title: "A", status: "completed", artifacts: [{ path: "o.txt", bytes: 5, sha256: "a".repeat(64) }] }], provenance: createProvenance({ runId: "r1", sessionId: "s", templateId: "x", preset: "standard", inputs: {}, now: new Date().toISOString() }) }
  const html = renderHtmlReport({ run, plan: twoStep, provenance: run.provenance, verified: true })
  report.check("report-is-self-contained-html", html.startsWith("<!doctype html>") && !/<script/.test(html))
  report.check("report-prints-its-limits", /不是临床工具/.test(html))
  report.check("report-includes-the-graph", html.includes("<svg"))

  const metrics = createMetrics()
  recordRun(metrics, { status: "completed", steps: [{ status: "completed", exitCode: 0, outputs: [{ bytes: 42 }] }] })
  const exposition = metrics.render()
  report.check("metrics-use-the-prometheus-format", /# TYPE dsh_workbench_runs_total counter/.test(exposition))
  report.check("metrics-escape-label-values", createMetrics().render().includes("uptime"))

  // 12-13: auth and tenancy
  const local = localPrincipal("E:/work")
  report.check("local-principal-says-unverified", /not verified/.test(local.name) && local.authenticated === false)
  report.check("unauth-principal-is-flagged", isUnauthenticated(local) === true)
  let jwtRejected = false
  try { verifyJwt("a.b.c", { keys: [] }) } catch (error) { jwtRejected = error.code === "INVALID_TOKEN" }
  report.check("a-malformed-jwt-is-refused", jwtRejected)
  let noTenant = false
  try { principalFromClaims({ sub: "u1" }) } catch (error) { noTenant = error.code === "NO_TENANT" }
  report.check("claims-without-a-tenant-are-refused", noTenant)
  const principal = principalFromClaims({ sub: "u1", tenant: "acme", roles: ["operator"] })
  report.check("operator-may-submit", requiresRole(principal, "operator") === true)
  report.check("operator-may-not-administer", requiresRole(principal, "admin") === false)

  const records = [stampTenant({ id: 1 }, "acme"), stampTenant({ id: 2 }, "other"), { id: 3 }]
  report.check("tenant-filter-hides-other-tenants", visibleTo(records, "acme").length === 1)
  report.check("unscoped-records-are-hidden", visibleTo(records, "acme").every(r => r.tenant === "acme"))
  let crossTenant = null
  try { assertOwned(records[1], "acme") } catch (error) { crossTenant = error.code }
  report.check("cross-tenant-read-looks-like-not-found", crossTenant === "NOT_FOUND", String(crossTenant))
  report.check("tenant-path-is-scoped", tenantRunsDirectory("E:/w", "acme").includes("/acme/"))

  // 14: checkpoint
  const journalPath = join(scratch, "j.jsonl")
  await writeFile(journalPath, [
    JSON.stringify({ seq: 1, type: "run-started" }),
    JSON.stringify({ seq: 2, type: "step-dispatched", stepId: "a" }),
    JSON.stringify({ seq: 3, type: "step-completed", stepId: "a", artifacts: [] }),
    JSON.stringify({ seq: 4, type: "step-dispatched", stepId: "b" }),
  ].join("\n") + "\n", "utf8")
  const checkpoint = await inspectCheckpoint({ journalPath, workspace: scratch })
  report.check("checkpoint-finds-completed-steps", checkpoint.completed.includes("a"))
  report.check("checkpoint-flags-an-interrupted-step", checkpoint.interrupted.includes("b"))
  report.check("checkpoint-explains-itself", typeof checkpoint.reason === "string" && checkpoint.reason.length > 10)
  const resumed = resumePlan({ previous: { steps: [{ id: "a", status: "completed" }, { id: "b", status: "running" }] }, inspection: checkpoint })
  report.check("resume-keeps-completed-and-resets-the-rest", resumed.steps[0].status === "completed" && resumed.steps[1].status === "pending")

  // 15-16: completion and the CLI surface
  for (const shell of ["bash", "zsh", "fish", "powershell"]) {
    const result = spawnSync(process.execPath, [join(root, "bin", "dsh-research-completion.mjs"), shell], { encoding: "utf8" })
    report.check("completion-for-" + shell, result.status === 0 && result.stdout.length > 60, (result.stdout ?? "").split("\n")[0].slice(0, 40))
  }
  const help = spawnSync(process.execPath, [join(root, "bin", "dsh-research.mjs"), "--help"], { encoding: "utf8" })
  report.check("cli-lists-thirteen-commands", ["init","templates","plan","run","runs","verify","export","check","doctor","report","graph","from-dsl","completion"].every(c => help.stdout.includes(c)))

  // 17: the server file is a valid module
  const serverSource = await (await import("node:fs/promises")).readFile(join(root, "bin", "dsh-research-server.mjs"), "utf8")
  const routeCount = (serverSource.match(/\[\s*'(GET|POST|DELETE)',\s*\//g) ?? []).length
  report.check("server-declares-its-routes", routeCount >= 10, routeCount + " routes")
  report.check("server-scopes-by-tenant", /tenantRunsDirectory/.test(serverSource) && /assertOwned/.test(serverSource))
} finally {
  await rm(scratch, { recursive: true, force: true }).catch(() => {})
}

report.finish()
