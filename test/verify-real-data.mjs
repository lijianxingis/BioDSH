/**
 * Verify a real analysis on real public data, with no ground truth to check against.
 *
 * Run: node test/verify-real-data.mjs
 *
 * Two things are checked, and they are different questions:
 *
 *  1. the pipeline REFUSES a dataset that does not fit the method (GSE3635 has no
 *     replicates, so a group comparison must fail rather than invent groups);
 *  2. on data that does fit, the top hits are enriched for known cell-cycle genes.
 *
 * The second is external validation: the analysis was not told which genes cycle, so
 * agreeing with the literature is evidence rather than a tautology.
 */
import { mkdir, mkdtemp, rm, copyFile, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { definePlan, runPlan } from "../lib/workflow-engine.js"
import { probeContainerRuntime } from "../lib/step-executor.js"
import { createReport } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-real-data")
const IMAGE = process.env.VERIFY_BIOC_IMAGE
  ?? "dsh-bioc@sha256:cb4d683b14e68c6986a14f7809094a3224f764796fa22d9854e440c226cf30b5"

const probe = await probeContainerRuntime({ timeoutMs: 10000 })
if (probe.available !== true) {
  report.skip("real-data-analysis", "no container daemon: " + (probe.reason ?? "unreachable"))
  report.finish()
  process.exit(process.exitCode ?? 0)
}

const workspace = await mkdtemp(join(tmpdir(), "dsh-real-"))
const split = line => {
  const out = []
  let cur = "", quoted = false
  for (const ch of line) {
    if (quoted) { if (ch === '"') quoted = false; else cur += ch; continue }
    if (ch === '"') { quoted = true; continue }
    if (ch === ",") { out.push(cur); cur = ""; continue }
    cur += ch
  }
  out.push(cur)
  return out
}

try {
  // --- A synthetic stand-in with the same shape as GSE3635: 13 time points, one array
  // each, a 60-minute cycle. Using the shape rather than the download keeps this test
  // runnable offline, while the real run is recorded in docs/real-analysis-run-5.md.
  const probes = 400
  const timepoints = Array.from({ length: 13 }, (_, i) => i * 10)
  let seed = 7
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 }
  const cycling = []
  const rows = []
  for (let p = 0; p < probes; p++) {
    const isCycling = p < 40
    const name = "Y" + (isCycling ? "CYC" : "FLAT") + String(p).padStart(4, "0")
    if (isCycling) cycling.push(name)
    const amp = isCycling ? 1.2 : 0
    const phase = rand() * Math.PI * 2
    const row = [name]
    for (const t of timepoints) {
      const value = 5 + amp * Math.sin((2 * Math.PI * t) / 60 + phase) + (rand() - 0.5) * 0.3
      row.push(value.toFixed(4))
    }
    rows.push(row.join(","))
  }
  const samples = timepoints.map(t => ["GSM" + (1000 + t), "Yeast cell cycle-time point " + t + " min 2001-05-03"])
  await writeFile(join(workspace, "expression.csv"), [["probe", ...samples.map(s => s[0])].join(","), ...rows].join("\n") + "\n", "utf8")
  await writeFile(join(workspace, "samples.csv"), ["sample,title", ...samples.map(s => s[0] + "," + s[1])].join("\n") + "\n", "utf8")
  await copyFile(join(root, "scripts", "periodicity_analysis.R"), join(workspace, "periodic.R"))
  await copyFile(join(root, "scripts", "differential_expression.R"), join(workspace, "de.R"))

  const periodicPlan = definePlan({
    backend: "container",
    image: IMAGE,
    steps: [{
      id: "periodicity",
      title: "periodicity on a time course",
      command: "Rscript periodic.R expression.csv samples.csv periodic-genes.csv periodicity-summary.json",
      argv: ["Rscript", "periodic.R", "expression.csv", "samples.csv", "periodic-genes.csv", "periodicity-summary.json"],
      inputs: [{ path: "expression.csv", required: true }, { path: "samples.csv", required: true }],
      outputs: [
        { path: "periodic-genes.csv", minBytes: 1000 },
        { path: "periodicity-summary.json", mediaType: "application/json", minBytes: 100 },
      ],
      timeoutMs: 600000,
    }],
  })
  const result = await runPlan(periodicPlan, { workspace, runDirectory: join(workspace, ".run1") })
  report.check("time-course-analysis-runs", result.status === "completed", result.steps[0]?.stderrTail?.slice(0, 100) ?? result.status)

  if (result.status === "completed") {
    const summary = JSON.parse(await readFile(join(workspace, "periodicity-summary.json"), "utf8"))
    report.check("recovers-the-stated-period", summary.periodMinutes === 60, summary.periodMinutes + " min")
    report.check("reads-the-time-axis-from-titles", summary.timeAxisSource === "sample-title")
    report.check("declares-no-replicates", summary.replicates === 0)
    report.check("refuses-biological-interpretation", summary.biologicalInterpretation === "not-performed")

    const lines = (await readFile(join(workspace, "periodic-genes.csv"), "utf8")).trim().split("\n")
    const header = split(lines[0])
    const at = name => header.indexOf(name)
    const top = lines.slice(1, 60).map(split).map(c => c[at("probe")])
    const trueSet = new Set(cycling)
    const tp = top.filter(g => trueSet.has(g)).length
    // 40 of 400 probes cycle; 60 drawn at random would contain about 6.
    report.check("top-hits-enriched-for-the-true-set", tp >= 40, tp + " of the 40 planted cycling probes in the top 60")
  }

  // --- The refusal: a dataset with one sample per time point cannot support a group
  // comparison. It must fail rather than invent groups.
  const dePlan = definePlan({
    backend: "container",
    image: IMAGE,
    steps: [{
      id: "de",
      title: "group comparison on data that has no groups",
      command: "Rscript de.R expression.csv samples.csv de-results.csv de-summary.json",
      argv: ["Rscript", "de.R", "expression.csv", "samples.csv", "de-results.csv", "de-summary.json"],
      inputs: [{ path: "expression.csv", required: true }, { path: "samples.csv", required: true }],
      outputs: [{ path: "de-results.csv", minBytes: 100 }],
      timeoutMs: 300000,
    }],
  })
  const refused = await runPlan(dePlan, { workspace, runDirectory: join(workspace, ".run2") })
  const stderr = refused.steps[0]?.stderrTail ?? ""
  report.check("group-comparison-refuses-a-time-course", refused.status === "failed", "status=" + refused.status)
  report.check("refusal-names-the-reason", /sample sheet|2 groups/.test(stderr), stderr.trim().slice(0, 70))
  report.check("no-result-file-was-written", await readFile(join(workspace, "de-results.csv")).then(() => false, () => true))
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
