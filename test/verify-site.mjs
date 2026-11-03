/**
 * Verify the showcase site can be served by anyone, and that serving it is safe.
 *
 * Run: node test/verify-site.mjs
 *
 * The path guard is tested with raw sockets because a URL constructor, a browser and
 * PowerShell all normalise ".." before the request leaves the client - so a normal fetch
 * cannot tell a working guard from a missing one.
 */
import { createServer } from "node:http"
import { createConnection } from "node:net"
import { spawn } from "node:child_process"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { createReport } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const report = createReport("verify-site")

function rawGet(port, path) {
  return new Promise(resolve => {
    const socket = createConnection({ host: "127.0.0.1", port }, () => {
      socket.write("GET " + path + " HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n")
    })
    let data = ""
    socket.on("data", chunk => { data += chunk.toString("utf8") })
    socket.on("end", () => {
      const status = Number((/^HTTP\/1\.1 (\d+)/.exec(data) ?? [])[1] ?? 0)
      const body = data.slice(data.indexOf("\r\n\r\n") + 4)
      resolve({ status, body })
    })
    socket.on("error", () => resolve({ status: 0, body: "" }))
    setTimeout(() => { socket.destroy(); resolve({ status: 0, body: "" }) }, 5000)
  })
}

// The bundle must be committed, or a clone has no site until someone runs a build.
const bundle = await readFile(join(root, "site", "site.bundle.js"), "utf8").catch(() => "")
report.check("the-bundle-is-committed", bundle.length > 100000, Math.round(bundle.length / 1024) + " KiB")

const html = await readFile(join(root, "site", "index.html"), "utf8").catch(() => "")
report.check("the-page-exists", html.length > 2000, Math.round(html.length / 1024) + " KiB")
report.check("the-page-has-no-external-dependency", !/<link[^>]+href="http/.test(html) && !/<script[^>]+src="http/.test(html))

// Start the bundled server on a free port.
const port = 4300 + (process.pid % 200)
const server = spawn(process.execPath, [join(root, "site", "serve.mjs")], {
  env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
  stdio: "ignore",
})
await new Promise(resolve => setTimeout(resolve, 1200))

try {
  const index = await rawGet(port, "/")
  report.check("the-server-serves-the-page", index.status === 200 && index.body.includes("<!doctype html>"), "status " + index.status)

  const script = await rawGet(port, "/site/site.bundle.js")
  report.check("the-server-serves-the-bundle", script.status === 200 && script.body.length > 100000, Math.round(script.body.length / 1024) + " KiB")

  // Traversal, with the raw target the client would otherwise normalise away.
  for (const path of ["/../package.json", "/site/../package.json", "/%2e%2e/package.json", "/..%2fpackage.json", "/../../etc/passwd"]) {
    const attempt = await rawGet(port, path)
    const leaked = attempt.body.includes("\"name\": \"dsh-research-workbench\"") || attempt.body.includes("root:")
    report.check("refuses-" + path.replace(/[^a-z0-9]+/gi, "-"), attempt.status === 403 && !leaked, "status " + attempt.status)
  }

  // A missing file is a 404, not a 500 and not a directory listing.
  const missing = await rawGet(port, "/site/does-not-exist.js")
  report.check("a-missing-file-is-404", missing.status === 404, "status " + missing.status)
} finally {
  server.kill()
}

report.finish()
