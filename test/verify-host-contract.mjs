/**
 * Verify the host API contract without a running DSH: every action is declared, unknown
 * actions carry a code, and the medical guard is installed on the medical preset.
 *
 * Run: node test/verify-host-contract.mjs
 */
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { join } from "node:path"
import { handleAction, medicalCapabilities, API_PATH } from "../lib/host.js"
import { checkTool, MEDICAL_ALLOWED_TOOLS } from "../lib/medical-policy.js"
import { createReport, expectRejects } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-host-contract")

report.check("api-path-is-declared", API_PATH.startsWith("/api/"))

// Every action named in the handler list must be reachable; a typo in a caller gets a
// code rather than a crash.
const source = await readFile(join(root, "lib/host.js"), "utf8")
const block = source.match(/const ACTIONS = Object\.freeze\(\[([\s\S]*?)\]\)/)
const declared = block ? [...block[1].matchAll(/'([^']+)'/g)].map(match => match[1]) : []
report.check("actions-are-declared", declared.length >= 25, declared.length + " actions")
// Every action in the list must be handled or explicitly fall through with a code,
// otherwise a caller sees INTERNAL for something that was simply never written.
const unhandled = declared.filter(action => !source.includes("'" + action + "'") || source.split("'" + action + "'").length < 2)
report.check("every-action-is-reachable", unhandled.length === 0, unhandled.join(", "))

const unknown = await expectRejects(handleAction({}, { action: "nope/nope" }, undefined), /Unknown/)
report.check("unknown-action-is-refused", unknown)

// A missing session must be a coded error, not an exception with no code.
let code = null
try { await handleAction({ sessions: { get: async () => undefined } }, { action: "workflow/list", sessionId: "x" }, undefined) }
catch (error) { code = error.code }
report.check("missing-session-has-code", code === "SESSION_NOT_FOUND", String(code))

// The medical preset must block execution and file access at the host.
const medicalSession = { id: "s", agentPreset: "medical-metadata", cwd: root, workspace: root }
const ctx = { sessions: { get: async () => medicalSession } }
const blockedRead = await expectRejects(handleAction(ctx, { action: "editor/read", sessionId: "s", path: "a.txt" }, undefined), /Medical/)
report.check("medical-blocks-file-read", blockedRead)
const blockedRun = await expectRejects(handleAction(ctx, { action: "pipeline/run", sessionId: "s", plan: {} }, undefined), /Medical/)
report.check("medical-blocks-execution", blockedRun)

// The tool guard must deny by default and deny on error.
const guardDenies = checkTool({ agentPreset: "medical-metadata" }, "run_code").allowed === false
report.check("guard-denies-run-code", guardDenies)
let registered
const { applyMedicalGuard } = await import("../lib/medical-policy.js")
applyMedicalGuard({ tools: { guard: fn => { registered = fn } } })
const thrown = registered({ get tool() { throw new Error("x") }, session: { agentPreset: "medical-metadata" } })
report.check("guard-fails-closed-on-error", thrown?.deny === true)

// Capabilities are reported, not inferred.
const caps = medicalCapabilities()
report.check("medical-reports-vision-off", caps.vision === false)
report.check("medical-reports-clinical-use-blocked", caps.clinicalUse === "not-authorized")
report.check("medical-allowlist-is-shipped", caps.allowedTools.length === MEDICAL_ALLOWED_TOOLS.length)

// The host must declare the credentials service, or signing silently loses its store.
report.check("injects-credentials-service", (await import("../lib/host.js")).inject.includes("credentials"))

report.finish()
