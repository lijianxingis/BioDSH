/**
 * Verify the DSH entry point actually registers routes and tools.
 *
 * Run: node test/verify-dsh-plugin.mjs
 *
 * A plugin with no apply(ctx) is never called; a plugin with no tools gives an agent
 * nothing to invoke. Both were true before, and neither shows up in a unit test of the
 * handler functions.
 */
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createReport } from "./harness.mjs"
import * as plugin from "../lib/host.js"
import { assertAdapter, REQUIRED } from "../lib/adapter.js"

const report = createReport("verify-dsh-plugin")

report.check("exports-a-plugin-name", typeof plugin.name === "string" && plugin.name.length > 0, plugin.name)
report.check("exports-apply", typeof plugin.apply === "function")
report.check("declares-its-services", Array.isArray(plugin.inject) && plugin.inject.length > 0, plugin.inject.join(","))

// A fixture host: enough of the real services to exercise registration without pretending
// to be DSH. What is under test is what the plugin registers, not what DSH does with it.
function fixture(workspace) {
  const routes = []
  const tools = []
  const session = { id: "s1", workspace, cwd: workspace, agentPreset: "standard" }
  return {
    routes,
    tools,
    session,
    ctx: {
      sessions: { get: async id => (id === "s1" ? session : undefined) },
      fs: {
        resolve: async (path, { cwd }) => ({ path: join(cwd, path) }),
        contains: (root, target) => String(target.path ?? target).startsWith(root),
        stat: async target => {
          const { stat } = await import("node:fs/promises")
          return stat(target.path ?? target).then(info => ({ size: info.size, isFile: () => info.isFile(), version: "v1" }), () => undefined)
        },
        readBytes: async target => {
          const { readFile } = await import("node:fs/promises")
          return readFile(target.path ?? target)
        },
        writeText: async (target, text) => {
          const { writeFile, mkdir } = await import("node:fs/promises")
          await mkdir(join(String(target.path ?? target), ".."), { recursive: true })
          await writeFile(target.path ?? target, text, "utf8")
          return { version: "v2" }
        },
      },
      sandboxPolicy: { for: () => undefined },
      webServer: { register: config => routes.push(config) },
      tools: { register: tool => tools.push(tool) },
    },
  }
}

const workspace = await mkdtemp(join(tmpdir(), "dsh-plugin-"))
try {
  const { ctx, routes, tools } = fixture(workspace)
  const result = plugin.apply(ctx)

  // Routes.
  report.check("registers-an-http-route", routes.length === 1, routes.length + " route(s)")
  report.check("the-route-is-a-prefix", routes[0]?.kind === "prefix", routes[0]?.kind)
  report.check("the-route-matches-the-api-path", routes[0]?.path === plugin.API_PATH, routes[0]?.path)
  report.check("the-route-has-a-handler", typeof routes[0]?.handler === "function")

  // Tools: without these an agent has nothing to call.
  report.check("registers-agent-tools", tools.length >= 2, tools.length + " tool(s)")
  const names = tools.map(tool => tool.name)
  report.check("tools-have-names", names.every(name => typeof name === "string" && name.length > 0), names.join(","))
  report.check("tools-describe-themselves", tools.every(tool => typeof tool.description === "string" && tool.description.length > 40))
  report.check("tools-declare-parameters", tools.every(tool => tool.parameters && tool.parameters.type === "object"))
  report.check("tools-have-execute", tools.every(tool => typeof tool.execute === "function"))

  // The adapter satisfies the contract, which is what makes the engine portable.
  report.check("the-host-satisfies-the-adapter-contract", (() => {
    try { assertAdapter(result.adapter); return true } catch { return false }
  })(), Object.keys(REQUIRED).length + " functions")
  const described = result.adapter.describe()
  report.check("the-adapter-describes-itself", described.kind === "dsh", described.kind)

  // A real tool call: templates needs no workspace state.
  const templateTool = tools.find(tool => tool.name === "research_workflow")
  const listed = await templateTool.execute({ action: "templates" }, { session: { id: "s1" } })
  report.check("the-tool-lists-templates", Array.isArray(listed.templates) && listed.templates.length > 0, (listed.templates ?? []).length + " templates")
  report.check("templates-report-executable-steps", listed.templates.every(t => typeof t.executableSteps === "number" && typeof t.totalSteps === "number"))

  // And one that needs a session: creating a run writes to the workspace.
  const created = await templateTool.execute({ action: "create", templateId: "sequence-analysis", title: "from a tool" }, { session: { id: "s1" } })
  report.check("the-tool-creates-a-run", typeof created.runId === "string" && created.runId.length > 0, created.runId)

  const fetched = await templateTool.execute({ action: "get", runId: created.runId }, { session: { id: "s1" } })
  report.check("the-tool-reads-the-run-back", fetched.run?.id === created.runId)

  // The evidence tool must report both halves: chain and files.
  const evidenceTool = tools.find(tool => tool.name === "research_evidence")
  const evidence = await evidenceTool.execute({ runId: created.runId }, { session: { id: "s1" } })
  report.check("the-evidence-tool-checks-the-chain", typeof evidence.verified === "boolean", String(evidence.verified))
  report.check("the-evidence-tool-counts-artifacts", typeof evidence.artifactsPresent === "number")
  report.check("the-evidence-tool-states-its-limit", /does not prove/.test(evidence.note ?? ""))
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
