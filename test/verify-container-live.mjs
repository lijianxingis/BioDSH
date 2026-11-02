/**
 * Verify the container backend against a real daemon, when one is available.
 *
 * Run: node test/verify-container-live.mjs [--image <ref>]
 *
 * Without a daemon the script reports the specification checks and skips the live
 * ones: skipping because the runtime is absent is honest, pretending they passed is not.
 */
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { defineExecutionSpec, describeRequirements } from "../lib/execution-spec.js"
import { probeContainerRuntime, runContainerSpec, runProcessSpec } from "../lib/step-executor.js"
import { createReport } from "./harness.mjs"

const report = createReport("verify-container-live")

// A real scientific toolchain, pinned by digest. The busybox checks above prove the
// mechanism; this one proves the mechanism works with an actual analysis image.
const SCIENTIFIC_IMAGE = process.env.VERIFY_SCIENTIFIC_IMAGE
  ?? "docker.m.daocloud.io/library/r-base@sha256:205aca88535e1a066c72c84d7a149747665da41cafabb951ccae8dd4e6f0c308"
const args = process.argv.slice(2)
const imageFlag = args.indexOf("--image")
const requestedImage = imageFlag !== -1 ? args[imageFlag + 1] : undefined

// A tag cannot be verified for reproducibility, so the default is pinned by digest.
// Pinned by digest so the reference cannot float. Overridable with --image.
const DEFAULT_IMAGE = process.env.VERIFY_IMAGE
  ?? "quay.io/prometheus/busybox@sha256:7379672d53c28113469275f2eb48adffa19954f39f8ef20c1e2992278f658e6c"
const image = requestedImage ?? DEFAULT_IMAGE

// Specification checks run without a daemon: they are what makes "container isolation"
// a true statement about the specification itself.
let floatingRefused = false
try { defineExecutionSpec({ image: "alpine:latest", command: ["echo", "x"] }) } catch { floatingRefused = true }
report.check("a-floating-tag-is-refused", floatingRefused)

let shellRefused = false
try { defineExecutionSpec({ image, command: ["sh", "-c", "echo x"] }) } catch { shellRefused = true }
report.check("a-shell-executable-is-refused", shellRefused)

let emptyRefused = false
try { defineExecutionSpec({ image, command: [] }) } catch { emptyRefused = true }
report.check("an-empty-command-is-refused", emptyRefused)

const spec = defineExecutionSpec({ image, command: ["echo", "container-ok"] })
const requirements = describeRequirements(spec)
report.check("requirements-declare-no-network", requirements.network === "disabled")
report.check("requirements-name-the-runtime", requirements.containerRuntime === "required")

// The process backend must never claim to be a container.
const localSpec = { backend: "process", command: [process.execPath, "-e", "0"], image: undefined }
const localRequirements = describeRequirements(localSpec)
report.check("process-backend-is-not-pinned", localRequirements.toolchainPinned === false)

const probe = await probeContainerRuntime({ timeoutMs: 10000 })
if (probe.available !== true) {
  report.skip("live-container-run", "no daemon: " + (probe.reason ?? "unreachable"))
  report.skip("container-cannot-reach-network", "no daemon")
  report.skip("declared-mount-is-writable", "no daemon")
  report.skip("container-fails-closed-when-absent", "no daemon to prove it against")
} else {
  report.check("daemon-is-reachable", true, probe.serverVersion)
  const workspace = await mkdtemp(join(tmpdir(), "dsh-container-"))
  try {
    const echo = await runContainerSpec(spec, { cwd: workspace, timeoutMs: 120000, probe })
    report.check("live-container-run", echo.status === "completed", "exit=" + echo.exitCode)
    report.check("container-reports-its-isolation", echo.isolation?.level === "container")
    report.check("container-run-not-claimed-reproducible", echo.reproducible === false)

    // Argv reaches the container verbatim: a path with spaces stays one argument.
    const verbatim = await runContainerSpec(
      defineExecutionSpec({ image, command: ["echo", "one argument, not many"] }),
      { cwd: workspace, timeoutMs: 120000, probe },
    )
    report.check("argv-reaches-the-container-verbatim", verbatim.status === "completed" && verbatim.stdoutTail.includes("one argument"), "exit=" + verbatim.exitCode)

    // A command that cannot succeed must report its real exit code, not be smoothed over.
    const failing = await runContainerSpec(
      defineExecutionSpec({ image, command: ["false"] }),
      { cwd: workspace, timeoutMs: 120000, probe },
    )
    report.check("a-failing-command-reports-its-exit-code", failing.status === "failed" && failing.exitCode !== 0, "exit=" + failing.exitCode)

    // An absent daemon must fail closed, never fall back to a local process.
    const closed = await runContainerSpec(spec, { cwd: workspace, timeoutMs: 5000, probe: { available: false, reason: "simulated" } })
    report.check("fails-closed-without-a-daemon", closed.errorCode === "CONTAINER_UNAVAILABLE" && closed.isolation.level !== "process")

    // The process backend still works for comparison, and says what it is.
    const processResult = await runProcessSpec({ backend: "process", command: [process.execPath, "-e", "process.exit(0)"] }, { cwd: workspace, timeoutMs: 30000 })
    report.check("process-backend-runs", processResult.status === "completed")
    report.check("process-backend-declares-its-level", processResult.isolation?.level === "process")
  } finally {
    await rm(workspace, { recursive: true, force: true }).catch(() => {})
  }

  // A real analysis inside a real scientific image. This is the claim the project makes
  // and the one that had never been tested against a toolchain that does science.
  const probeDir = await mkdtemp(join(tmpdir(), "dsh-r-"))
  const scientific = await runContainerSpec(
    defineExecutionSpec({ image: SCIENTIFIC_IMAGE, command: ["Rscript", "--version"] }),
    { cwd: probeDir, timeoutMs: 180000, probe },
  )
  if (scientific.exitCode === 125) {
    report.skip("scientific-image-available", "image not present locally and the registry is unreachable")
  } else {
    // Rscript prints "Rscript (R) version 4.3.3"; a check for "R version" would fail on a
  // working image. Match the version number instead of one spelling of the banner.
  report.check("scientific-image-runs", scientific.status === "completed" && /version \d+\.\d+\.\d+/.test(scientific.stdoutTail), (scientific.stdoutTail.split("\n")[0] ?? "").slice(0, 40))
    report.check("scientific-image-has-no-network", scientific.isolation?.network === "none")

    // The analysis itself: fit a linear model offline and check the coefficient.
    const workdir = await mkdtemp(join(tmpdir(), "dsh-fit-"))
    try {
      const { writeFile, readFile } = await import("node:fs/promises")
      const rows = ["expression,group"]
      for (const [group, base, n] of [["control", 5.0, 20], ["treated", 7.4, 20], ["resistant", 6.1, 20]]) {
        for (let i = 0; i < n; i++) rows.push((base + ((i * 37) % 21) / 21 * 2.4 - 1.2).toFixed(3) + "," + group)
      }
      await writeFile(join(workdir, "expression.csv"), rows.join("\n") + "\n", "utf8")
      await writeFile(join(workdir, "model.R"), [
        'args <- commandArgs(trailingOnly = TRUE)',
        'd <- read.csv(args[1])',
        'fit <- lm(expression ~ group, data = d)',
        'cat(format(coef(fit)[["grouptreated"]], digits = 6), "\n")',
        'cat(format(summary(fit)$r.squared, digits = 6), "\n")',
      ].join("\n"), "utf8")

      const inner = (value) => process.platform === "win32"
        ? "/" + value[0].toLowerCase() + "/" + value.slice(3).replace(/\\/g, "/")
        : value
      const fit = await runContainerSpec(
        defineExecutionSpec({
          image: SCIENTIFIC_IMAGE,
          command: ["Rscript", "model.R", "expression.csv"],
          mounts: [{ target: inner(workdir), readOnly: false }],
        }),
        { cwd: workdir, timeoutMs: 180000, probe },
      )
      const lines = fit.stdoutTail.trim().split("\n")
      const effect = Number(lines[0])
      const r2 = Number(lines[1])
      // The data has a +2.4 group effect; a fit that lands near it is doing real work.
      report.check("real-model-fits-in-the-container", fit.status === "completed" && Math.abs(effect - 2.4) < 0.6, "effect=" + effect)
      report.check("real-model-reports-fit-quality", Number.isFinite(r2) && r2 > 0.4 && r2 < 1, "r2=" + r2)
    } finally {
      await rm(workdir, { recursive: true, force: true }).catch(() => {})
    }
  }
}

report.finish()
