/**
 * Verify the package ships what its manifest promises.
 *
 * Run: node test/verify-coverage.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { join } from "node:path"
import { createReport } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-coverage")
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"))

// Every export must resolve to a file that exists.
const broken = []
for (const [key, value] of Object.entries(pkg.exports ?? {})) {
  if (key === "./package.json") continue
  const info = await stat(join(root, value.replace("./", ""))).catch(() => undefined)
  if (!info?.isFile()) broken.push(key)
}
report.check("every-export-resolves", broken.length === 0, broken.join(", "))

// The entry point named in main must exist.
const mainInfo = await stat(join(root, (pkg.main ?? "").replace("./", ""))).catch(() => undefined)
report.check("main-entry-exists", mainInfo?.isFile() === true, pkg.main)

// The web client must be declared, or the panel never loads.
report.check("declares-web-client", pkg.dsh?.client?.platform === "web")
report.check("injects-the-client-bundle", Array.isArray(pkg.dsh?.client?.inject) && pkg.dsh.client.inject.length > 0, (pkg.dsh?.client?.inject ?? []).join(","))

// The built bundle must be present: a source-only package installs and does nothing.
const clientInfo = await stat(join(root, "lib/client.js")).catch(() => undefined)
report.check("built-client-present", (clientInfo?.size ?? 0) > 100000, ((clientInfo?.size ?? 0) / 1024).toFixed(0) + " KiB")

// Files promised in "files" must exist.
const promised = (pkg.files ?? []).map(entry => entry.replace(/\/$/, ""))
const absent = []
for (const entry of promised) {
  const info = await stat(join(root, entry)).catch(() => undefined)
  if (!info) absent.push(entry)
}
report.check("declared-files-exist", absent.length === 0, absent.join(", "))

// Attribution is a licence obligation, not a nicety.
const notices = await stat(join(root, "THIRD-PARTY-NOTICES.md")).catch(() => undefined)
report.check("third-party-notices-shipped", notices?.isFile() === true)
const licence = await readFile(join(root, "LICENSE"), "utf8").catch(() => "")
report.check("licence-is-mit", licence.includes("MIT License"))

// A dependency that is never imported is a sign of a stale manifest.
const sourceFiles = (await readdir(join(root, "lib"))).filter(name => name.endsWith(".js") && !name.includes(".test."))
let source = ""
for (const name of sourceFiles) source += await readFile(join(root, "lib", name), "utf8")
const unused = Object.keys(pkg.dependencies ?? {}).filter(name => !source.includes(name))
report.check("every-dependency-is-imported", unused.length === 0, unused.join(", "))

// The scripts the templates call must exist.
const scripts = (await readdir(join(root, "scripts"))).filter(name => name.endsWith(".py"))
report.check("scripts-shipped", scripts.length >= 9, scripts.length + " python files")

report.finish()
