/**
 * Verify a real Bioconductor analysis inside a pinned container, against ground truth.
 *
 * Run: node test/verify-bioconductor.mjs
 *
 * The point is not that limma runs. The point is that the answer can be checked: the
 * count matrix is generated with a known set of truly differential genes, so recall and
 * precision are measurable rather than asserted.
 */
import { mkdir, mkdtemp, rm, copyFile, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { definePlan, runPlan } from "../lib/workflow-engine.js"
import { probeContainerRuntime } from "../lib/step-executor.js"
import { createReport } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-bioconductor")

// A local image built from a documented Dockerfile, pinned by digest. Overridable so CI
// can point at a registry copy without editing the test.
const IMAGE = process.env.VERIFY_BIOC_IMAGE
  ?? "dsh-bioc@sha256:cb4d683b14e68c6986a14f7809094a3224f764796fa22d9854e440c226cf30b5"

const probe = await probeContainerRuntime({ timeoutMs: 10000 })
if (probe.available !== true) {
  report.skip("bioconductor-analysis", "no container daemon: " + (probe.reason ?? "unreachable"))
  report.finish()
  process.exit(process.exitCode ?? 0)
}

const workspace = await mkdtemp(join(tmpdir(), "dsh-bioc-"))
try {
  // Deterministic counts: 200 genes, the first 20 truly differential at ~3.5x.
  let seed = 20260101
  const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 }
  const rpois = lambda => {
    const limit = Math.exp(-lambda)
    let k = 0
    let p = 1
    do { k++; p *= rand() } while (p > limit)
    return k - 1
  }
  const perGroup = 4
  const genes = 200
  const truthGenes = []
  const rows = []
  for (let g = 0; g < genes; g++) {
    const base = 20 + Math.floor(rand() * 200)
    const isDe = g < 20
    if (isDe) truthGenes.push("gene" + (g + 1))
    const row = ["gene" + (g + 1)]
    for (let i = 0; i < perGroup; i++) row.push(rpois(base * (0.8 + rand() * 0.5)))
    for (let i = 0; i < perGroup; i++) row.push(rpois(base * (isDe ? 3.5 : 1) * (0.8 + rand() * 0.5)))
    rows.push(row.join(","))
  }
  const samples = []
  for (let i = 0; i < perGroup; i++) samples.push(["ctrl" + (i + 1), "control"])
  for (let i = 0; i < perGroup; i++) samples.push(["trt" + (i + 1), "treated"])
  await writeFile(join(workspace, "counts.csv"), [["gene", ...samples.map(s => s[0])].join(","), ...rows].join("\n") + "\n", "utf8")
  await writeFile(join(workspace, "samples.csv"), ["sample,group", ...samples.map(s => s[0] + "," + s[1])].join("\n") + "\n", "utf8")
  await copyFile(join(root, "scripts", "differential_expression.R"), join(workspace, "de.R"))

  const plan = definePlan({
    backend: "container",
    image: IMAGE,
    steps: [{
      id: "differential-expression",
      title: "limma differential expression",
      command: "Rscript de.R counts.csv samples.csv de-results.csv de-summary.json",
      argv: ["Rscript", "de.R", "counts.csv", "samples.csv", "de-results.csv", "de-summary.json"],
      inputs: [{ path: "counts.csv", required: true }, { path: "samples.csv", required: true }],
      outputs: [
        { path: "de-results.csv", minBytes: 1000 },
        { path: "de-summary.json", mediaType: "application/json", minBytes: 100 },
      ],
      timeoutMs: 300000,
    }],
  })

  const result = await runPlan(plan, { workspace, runDirectory: join(workspace, ".run") })
  const step = result.steps[0]
  if (result.status !== "completed") {
    report.check("bioconductor-analysis-runs", false, (step?.error ?? step?.stderrTail ?? result.status).slice(0, 120))
  } else {
    report.check("bioconductor-analysis-runs", true, step.status)
    const artifacts = step.outputs ?? []
    report.check("both-artifacts-registered", artifacts.length === 2, artifacts.map(a => a.path).join(", "))
    report.check("artifacts-have-digests", artifacts.every(a => /^[a-f0-9]{64}$/.test(a.sha256)))

    // write.csv quotes field names, so a naive split on commas finds no columns.
    const splitCsv = line => {
      const out = []
      let cur = ""
      let quoted = false
      for (const ch of line) {
        if (quoted) { if (ch === '"') quoted = false; else cur += ch; continue }
        if (ch === '"') { quoted = true; continue }
        if (ch === ",") { out.push(cur); cur = ""; continue }
        cur += ch
      }
      out.push(cur)
      return out
    }
    const lines = (await readFile(join(workspace, "de-results.csv"), "utf8")).trim().split("\n")
    const header = splitCsv(lines[0])
    const at = name => header.indexOf(name)
    report.check("result-has-limma-columns", at("logFC") !== -1 && at("adj.P.Val") !== -1, header.join("|"))

    const called = lines.slice(1).map(splitCsv)
      .filter(c => Number(c[at("adj.P.Val")]) < 0.05 && Math.abs(Number(c[at("logFC")])) >= 1)
      .map(c => c[at("gene")])
    const truth = new Set(truthGenes)
    const calledSet = new Set(called)
    const tp = [...calledSet].filter(g => truth.has(g)).length
    const fp = [...calledSet].filter(g => !truth.has(g)).length
    const fn = [...truth].filter(g => !calledSet.has(g)).length
    // The data has 20 truly differential genes; recovering them is what makes this a
    // real analysis rather than a plausible-looking table.
    report.check("recovers-every-true-positive", fn === 0, tp + "/" + truth.size + " found")
    report.check("does-not-invent-signal", fp === 0, fp + " false positives")

    const summary = JSON.parse(await readFile(join(workspace, "de-summary.json"), "utf8"))
    report.check("summary-agrees-with-the-table", summary.significant === calledSet.size, summary.significant + " vs " + calledSet.size)
    report.check("summary-records-the-toolchain", /^\d+\./.test(summary.limmaVersion) && /^\d+\./.test(summary.edgeRVersion), "limma " + summary.limmaVersion)
    report.check("summary-refuses-interpretation", summary.biologicalInterpretation === "not-performed")
  }
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
