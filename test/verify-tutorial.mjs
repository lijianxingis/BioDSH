/**
 * Verify that every command in docs/tutorial.md still works.
 *
 * Run: node test/verify-tutorial.mjs
 *
 * Reads the commands out of the document rather than duplicating them, so a document that
 * drifts from the CLI fails here instead of misleading a reader.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import { createReport } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-tutorial")
const workspace = join(root, ".build", "tutorial-check-" + process.pid)
const cli = join(root, "bin", "dsh-research.mjs")

function run(args, options = {}) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    cwd: options.cwd ?? workspace,
    timeout: 300000,
    env: { ...process.env, DSH_RESEARCH_PYTHON: process.env.DSH_RESEARCH_PYTHON ?? "" },
  })
  return { code: result.status, out: (result.stdout ?? "") + (result.stderr ?? "") }
}

try {
  // The document must exist and must name the commands it claims to document.
  const doc = await readFile(join(root, "docs", "tutorial.md"), "utf8")
  report.check("tutorial-exists", doc.length > 4000, Math.round(doc.length / 1024) + " KiB")

  const commands = [...doc.matchAll(/node bin\/dsh-research\.mjs ([a-z-]+)/g)].map(m => m[1])
  const documented = [...new Set(commands)]
  const expected = ["doctor", "templates", "init", "run", "runs", "verify", "report", "export", "check", "graph", "completion"]
  const missing = expected.filter(name => !documented.includes(name))
  report.check("tutorial-documents-every-command", missing.length === 0, missing.length ? "missing: " + missing.join(",") : documented.length + " commands")

  // A command the document mentions must actually be dispatchable. --help prints prose, so
  // the check runs each command with no arguments and looks for "unknown command" rather
  // than for a substring in the help text.
  const unknown = documented.filter(name => {
    const probe = run([name])
    return /unknown command/.test(probe.out)
  })
  report.check("every-documented-command-exists", unknown.length === 0, unknown.join(",") || documented.length + " commands dispatch")

  // Now follow the steps.
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })
  await writeFile(join(workspace, "samples.fasta"),
    ">seq1\nATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAAT\n>seq2\nATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG\n", "utf8")

  const doctor = run(["doctor"])
  report.check("step-0-doctor", doctor.code === 0 && /python\s+:/.test(doctor.out), (doctor.out.match(/python\s+:.*/) ?? [""])[0].slice(0, 60))

  const templates = run(["templates"])
  report.check("step-1-templates", templates.code === 0 && /sequence-analysis/.test(templates.out))

  const init = run(["init", workspace])
  report.check("step-2-init", init.code === 0 && /workspace ready/.test(init.out))

  const runResult = run(["run", "sequence-analysis", "--workspace", workspace])
  const completed = /status: completed/.test(runResult.out)
  if (!completed && /not installed|ModuleNotFound/.test(runResult.out)) {
    report.skip("step-3-run", "no Python with biopython on this machine")
  } else {
    report.check("step-3-run", completed, (runResult.out.match(/status: .*/) ?? [""])[0])
    report.check("step-3-reports-a-digest", /\d+ B\s+[a-f0-9]{8,}/.test(runResult.out))
    report.check("step-3-verifies-the-chain", /audit chain: verified/.test(runResult.out))
  }

  const runs = run(["runs", "--workspace", workspace])
  report.check("step-4-runs", runs.code === 0 && /sequence-analysis/.test(runs.out))

  const runId = (runs.out.match(/^(\S+-sequence-analysis)/m) ?? [])[1]
  if (!runId) {
    report.skip("step-5-verify", "no run id")
  } else {
    const verify = run(["verify", runId, "--workspace", workspace])
    report.check("step-5-verify", /audit chain: verified/.test(verify.out), (verify.out.match(/artifacts\s+:.*/) ?? [""])[0])

    const reportRun = run(["report", runId, "--workspace", workspace])
    report.check("step-6-report", reportRun.code === 0 && /report:/.test(reportRun.out), (reportRun.out.match(/size\s+:.*/) ?? [""])[0])
    const html = await readFile(join(workspace, ".dsh/research-workbench/runs", runId, "report.html"), "utf8").catch(() => "")
    report.check("step-6-report-contains-the-graph", html.includes("<svg"), html.includes("<svg") ? "graph present" : "no graph")
    report.check("step-6-report-has-no-script", !/<script/.test(html))

    const exported = run(["export", runId, "--workspace", workspace])
    report.check("step-7-export", /signed\s+: valid/.test(exported.out))
    report.check("step-7-states-the-signature-limit", /not who owns it/.test(exported.out))

    const bundlePath = join(workspace, ".dsh/research-workbench/runs", runId, "bundle.json")
    const checked = run(["check", bundlePath])
    report.check("step-8-check", /status\s+: pass/.test(checked.out))
    report.check("step-8-does-not-claim-authenticity", /authentic: false/.test(checked.out))
  }

  const graph = run(["graph", "sequence-analysis"])
  report.check("step-10-graph", graph.code === 0 && graph.out.includes("digraph"))

  for (const shell of ["bash", "zsh", "fish", "powershell"]) {
    const completion = run(["completion", shell])
    report.check("step-10-completion-" + shell, completion.code === 0 && completion.out.length > 60)
  }

  // The tutorial promises that editing a recorded byte count breaks the chain. Check it.
  if (runId) {
    const runPath = join(workspace, ".dsh/research-workbench/runs", runId, "run.json")
    const original = await readFile(runPath, "utf8")
    const parsed = JSON.parse(original)
    if (parsed.provenance?.artifacts?.[0]) {
      parsed.provenance.artifacts[0].bytes = 999
      await writeFile(runPath, JSON.stringify(parsed, null, 2) + "\n", "utf8")
      const broken = run(["verify", runId, "--workspace", workspace])
      report.check("the-documented-tamper-check-is-true", /BROKEN/.test(broken.out), broken.out.trim().split("\n")[0])
      await writeFile(runPath, original, "utf8")
    } else {
      report.skip("the-documented-tamper-check-is-true", "the run recorded no artifacts")
    }
  }
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
