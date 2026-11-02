/**
 * Run the slurm executor against a real controller.
 *
 * Run: node test/verify-slurm-live.mjs
 *
 * Needs SBATCH_COMMAND, SACCT_COMMAND, SCONTROL_COMMAND and SLURM_PATH_MAP pointing at a
 * live cluster. Skips when the controller does not answer: a green result without a
 * cluster would be a claim about nothing.
 */
import { mkdir, rm, readFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { createReport } from "./harness.mjs"
import { definePlan } from "../lib/workflow-engine.js"
import "../lib/executors-builtin.js"
import { getExecutor } from "../lib/executors.js"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-slurm-live")
// The directory the container mounts, not a subdirectory of it: the mount exists before
// this script runs, so both sides see it without an extra mkdir that the container would
// not observe.
const workspace = process.env.SLURM_LOCAL_ROOT
  ?? join(root, ".build", "slurm-run")

// A scheduler command is often a .cmd wrapper on Windows, which spawn cannot run directly.
// This mirrors what the executor does, so the probe cannot fail for a reason the executor
// would have handled.
function runScheduler(command, args) {
  const isBatch = process.platform === "win32" && /\.(cmd|bat)$/i.test(command)
  return isBatch
    ? spawnSync(process.env.COMSPEC ?? "cmd.exe", ["/d", "/s", "/c", command, ...args], { encoding: "utf8", timeout: 20000 })
    : spawnSync(command, args, { encoding: "utf8", timeout: 20000 })
}

const scontrol = process.env.SCONTROL_COMMAND ?? "scontrol"
const probe = runScheduler(scontrol, ["ping"])
const reachable = probe.status === 0 && /UP/i.test(probe.stdout ?? "")
if (!reachable) {
  report.skip("controller-reachable", "no Slurm controller: " + ((probe.stderr ?? "").slice(0, 70) || "no response"))
  report.finish()
  process.exit(process.exitCode ?? 0)
}
report.check("controller-reachable", true)

// The workspace is per-run, so the mapping has to be derived rather than fixed. The
// scheduler sees a directory it mounts; SLURM_REMOTE_WORKSPACE names it.
const remoteWorkspace = process.env.SLURM_REMOTE_WORKSPACE
if (!remoteWorkspace) {
  report.skip("path-mapping-configured", "SLURM_REMOTE_WORKSPACE is not set; the scheduler cannot see this workspace")
  report.finish()
  process.exit(process.exitCode ?? 0)
}
await mkdir(workspace, { recursive: true })
process.env.SLURM_PATH_MAP = workspace.replace(/\\/g, "/") + ":" + remoteWorkspace
report.check("workspace-is-mounted-in-the-scheduler", (() => {
  const probe = runScheduler(process.env.SBATCH_COMMAND ?? "sbatch", ["--version"])
  return probe.status === 0
})(), workspace)
report.check("path-mapping-configured", true, process.env.SLURM_PATH_MAP)

const executor = getExecutor("slurm")

try {
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })

  // A real job.
  const plan = definePlan({ steps: [{ id: "slurm-probe", command: "echo", argv: ["echo", "hello-from-slurm"], timeoutMs: 180000 }] })
  const started = Date.now()
  const ok = await executor.run(plan.steps[0], { workspace, options: { partition: process.env.SLURM_PARTITION ?? "debug" } })
  const elapsed = Date.now() - started

  report.check("a-real-job-completes", ok.status === "completed", (ok.error ?? "").slice(0, 70))
  report.check("the-result-names-the-job-id", Number.isInteger(Number(ok.jobId)), String(ok.jobId))
  report.check("the-result-reports-the-scheduler-state", ok.schedulerState === "COMPLETED", ok.schedulerState)
  report.check("the-result-says-where-the-state-came-from", ["sacct", "scontrol"].includes(ok.stateSource), ok.stateSource)
  report.check("the-result-reports-its-isolation", ok.isolation?.level === "cluster" && ok.isolation?.scheduler === "slurm")
  report.check("the-result-is-not-claimed-reproducible", ok.reproducible === false)
  report.check("the-job-finishes-promptly", elapsed < 120000, (elapsed / 1000).toFixed(1) + "s")

  // The batch script must have reached the scheduler through the mapping.
  const script = await readFile(join(workspace, "dsh-slurm-probe.slurm.sh"), "utf8").catch(() => "")
  report.check("a-batch-script-was-written", script.includes("#SBATCH --job-name="), script.split("\n")[1] ?? "(empty)")
  report.check("the-script-uses-the-mapped-path", !/[A-Za-z]:[\\/]/.test(script), script.includes("/work") ? "uses /work" : "no mapped path")

  // A failing command must come back as a failure, not as a completion.
  const failing = definePlan({ steps: [{ id: "slurm-fails", command: "false", argv: ["false"], timeoutMs: 120000 }] })
  const failed = await executor.run(failing.steps[0], { workspace, options: { partition: process.env.SLURM_PARTITION ?? "debug" } })
  report.check("a-failing-command-fails", failed.status === "failed", failed.schedulerState ?? "")
  report.check("the-failure-carries-an-exit-code", Number.isInteger(failed.exitCode) && failed.exitCode !== 0, String(failed.exitCode))
  report.check("the-failure-explains-itself", /failed|FAILED/i.test(failed.error ?? ""), (failed.error ?? "").slice(0, 60))
} finally {
  // Remove only what this run wrote: deleting the mount point would break the next run.
  const { readdir } = await import("node:fs/promises")
  for (const entry of await readdir(workspace).catch(() => [])) {
    if (/\.slurm\.sh$|slurm-\d+\.out$|\.err$/.test(entry)) {
      await rm(join(workspace, entry), { force: true }).catch(() => {})
    }
  }
}

report.finish()
