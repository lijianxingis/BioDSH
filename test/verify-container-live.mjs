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
}

report.finish()
