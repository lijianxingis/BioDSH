/**
 * Verify that Biomni tools run inside a provenance-recording workflow.
 *
 * Run: node test/verify-biomni.mjs
 *
 * This is the join the project exists for. Two claims are checked separately:
 *
 *  1. Biomni tools actually execute and return real results;
 *  2. their output is registered with a byte count and digest that verify.
 *
 * A tool that cannot load is reported as unavailable rather than skipped silently,
 * because "the tool exists upstream" and "the tool runs here" are different claims.
 */
import { mkdir, rm, readFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { existsSync } from "node:fs"
import { definePlan, runPlan } from "../lib/workflow-engine.js"
import { createProvenance, recordArtifact, verifyProvenance } from "../lib/provenance.js"
import { createReport } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-biomni")

// The interpreter must be one that has biomni installed. Discovered rather than assumed.
const candidates = [
  process.env.DSH_RESEARCH_PYTHON,
  "E:/新建文件夹/Biomni/.venv/Scripts/python.exe",
  "E:/新建文件夹/Biomni/.venv/bin/python",
].filter(Boolean)
const python = candidates.find(path => existsSync(path))

if (!python) {
  report.skip("biomni-available", "no Python with biomni installed was found")
  report.finish()
  process.exit(process.exitCode ?? 0)
}

const bridge = join(root, "scripts", "biomni_bridge.py")
const dna = "ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG"
// A scratch directory inside the project, not the OS temp dir: this host's sandbox
// denies non-workspace writes to child processes, which is a property of the environment
// rather than of Biomni.
const workspace = join(root, ".build", "verify-biomni-" + process.pid)
await rm(workspace, { recursive: true, force: true })
await mkdir(workspace, { recursive: true })

try {
  const plan = definePlan({
    steps: [
      {
        id: "inventory",
        title: "inventory",
        command: python + " " + bridge + " list --json biomni-inventory.json",
        argv: [python, bridge, "list", "--json", "biomni-inventory.json"],
        outputs: [{ path: "biomni-inventory.json", mediaType: "application/json", minBytes: 200 }],
        timeoutMs: 300000,
      },
      {
        id: "restriction-sites",
        title: "restriction sites",
        command: python + " " + bridge + " call molecular_biology find_restriction_enzymes --out restriction-sites.json",
        argv: [python, bridge, "call", "molecular_biology", "find_restriction_enzymes",
               "--args", JSON.stringify({ sequence: dna, is_circular: false }),
               "--out", "restriction-sites.json"],
        needs: ["inventory"],
        outputs: [{ path: "restriction-sites.json", mediaType: "application/json", minBytes: 100 }],
        timeoutMs: 300000,
      },
      {
        id: "reading-frames",
        title: "reading frames",
        command: python + " " + bridge + " call molecular_biology annotate_open_reading_frames --out reading-frames.json",
        argv: [python, bridge, "call", "molecular_biology", "annotate_open_reading_frames",
               "--args", JSON.stringify({ sequence: dna, min_length: 30 }),
               "--out", "reading-frames.json"],
        needs: ["inventory"],
        outputs: [{ path: "reading-frames.json", mediaType: "application/json", minBytes: 100 }],
        timeoutMs: 300000,
      },
    ],
  })

  const result = await runPlan(plan, { workspace, runDirectory: join(workspace, ".run") })
  report.check("biomni-tools-run-in-a-workflow", result.status === "completed",
    result.steps.filter(s => s.status !== "completed").map(s => s.id + ": " + (s.stderrTail ?? "").slice(0, 60)).join(" | ") || "all steps completed")

  // The inventory has to distinguish what loads from what does not.
  const inventory = JSON.parse(await readFile(join(workspace, "biomni-inventory.json"), "utf8"))
  report.check("inventory-lists-available-modules", inventory.available?.length >= 15, inventory.available?.length + " modules")
  report.check("inventory-counts-functions", inventory.availableFunctions >= 100, inventory.availableFunctions + " functions")
  report.check("inventory-names-what-cannot-load", Array.isArray(inventory.unavailable) && inventory.unavailable.length > 0,
    (inventory.unavailable ?? []).map(m => m.module).join(", "))
  report.check("unavailable-modules-state-a-reason", (inventory.unavailable ?? []).every(m => typeof m.reason === "string" && m.reason.length > 10))

  // A tool result must be a real result, not an empty shell.
  const sites = JSON.parse(await readFile(join(workspace, "restriction-sites.json"), "utf8"))
  report.check("tool-record-names-its-tool", sites.module === "molecular_biology" && sites.function === "find_restriction_enzymes")
  report.check("tool-record-keeps-the-arguments", sites.arguments?.sequence === dna)
  report.check("tool-record-times-the-call", typeof sites.elapsedMs === "number" && sites.elapsedMs >= 0, sites.elapsedMs + " ms")
  report.check("tool-returned-a-result", sites.result !== undefined && sites.result !== null)

  const frames = JSON.parse(await readFile(join(workspace, "reading-frames.json"), "utf8"))
  report.check("second-tool-also-returned", frames.function === "annotate_open_reading_frames" && frames.result !== undefined)

  // The whole point: the results are evidence, not narrative.
  let provenance = createProvenance({ runId: "r", sessionId: "s", templateId: "biomni-toolkit", preset: "biomni", inputs: { sequence: dna }, now: new Date().toISOString() })
  let registered = 0
  for (const step of result.steps) {
    for (const artifact of step.outputs ?? []) {
      provenance = recordArtifact(provenance, {
        path: artifact.path, label: artifact.path, bytes: artifact.bytes, version: "v1",
        checksum: { algorithm: "sha256", value: artifact.sha256 },
      })
      registered += 1
    }
  }
  report.check("every-artifact-is-registered", registered === 3, registered + " artifacts")
  report.check("provenance-verifies", verifyProvenance(provenance) === true)

  // Tampering with a recorded size must break the chain.
  const tampered = JSON.parse(JSON.stringify(provenance))
  tampered.artifacts[0].bytes = 1
  report.check("editing-a-recorded-size-is-detected", verifyProvenance(tampered) === false)

  // A tool that cannot load must fail the step and name the dependency.
  const missing = definePlan({
    steps: [{
      id: "genomics",
      title: "a module that needs a dependency this environment lacks",
      command: python + " " + bridge + " describe genomics some_function",
      argv: [python, bridge, "describe", "genomics", "some_function"],
      outputs: [],
      timeoutMs: 120000,
    }],
  })
  const failed = await runPlan(missing, { workspace, runDirectory: join(workspace, ".run2") })
  const stderr = failed.steps[0]?.stderrTail ?? ""
  const triedToLoad = /genomics|missing|esm/i.test(stderr)
  report.check("an-unloadable-module-fails-with-a-reason", failed.status === "failed" ? triedToLoad : true,
    failed.status === "failed" ? stderr.trim().slice(0, 70) : "genomics loaded in this environment")
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
