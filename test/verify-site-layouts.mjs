/**
 * Verify the site renders under both deployment layouts.
 *
 * Run: node test/verify-site-layouts.mjs
 *
 * Layout A: the repository root is served, so the page lives at /site/.
 * Layout B: site/ is published as the root, which is what GitHub Pages does.
 *
 * A page that loads its bundle from an absolute path works in A and white-screens in B, so
 * both are rendered in a real browser rather than inspected as text.
 */
import { createServer } from "node:http"
import { readFile, stat } from "node:fs/promises"
import { extname, join, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { createReport } from "./harness.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const siteDir = join(root, "site")
const report = createReport("verify-site-layouts")

let chromium
try { ({ chromium } = await import("playwright")) } catch {
  report.skip("browser-available", "playwright is not installed")
  report.finish()
  process.exit(process.exitCode ?? 0)
}

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".css": "text/css" }

function serve(baseDir, port) {
  const server = createServer(async (request, response) => {
    let path = decodeURIComponent(String(request.url ?? "/").split("?")[0])
    if (path.endsWith("/")) path += "index.html"
    const target = resolve(baseDir, "." + path)
    const base = resolve(baseDir)
    if (target !== base && !target.startsWith(base + sep)) { response.writeHead(403).end(); return }
    try {
      const info = await stat(target)
      if (!info.isFile()) throw new Error("not a file")
      const body = await readFile(target)
      response.writeHead(200, { "content-type": TYPES[extname(target)] ?? "application/octet-stream" }).end(body)
    } catch { response.writeHead(404).end("not found") }
  })
  return new Promise(ready => server.listen(port, "127.0.0.1", () => ready(server)))
}

const browser = await chromium.launch({ channel: "msedge", headless: true })
try {
  const layouts = [
    { name: "repository-root", base: root, url: "/site/", port: 4411 },
    { name: "site-as-root", base: siteDir, url: "/", port: 4412 },
  ]

  for (const layout of layouts) {
    const server = await serve(layout.base, layout.port)
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
    const failures = []
    page.on("pageerror", error => failures.push(String(error)))
    page.on("response", response => { if (response.status() >= 400) failures.push(response.status() + " " + response.url()) })

    await page.goto("http://127.0.0.1:" + layout.port + layout.url, { waitUntil: "networkidle" })
    await page.waitForTimeout(900)

    const rendered = await page.evaluate(() => ({
      canvas: document.querySelectorAll("canvas").length,
      cards: document.querySelectorAll(".rw-home-card").length,
      heading: document.querySelector("h1, h2")?.textContent?.slice(0, 30) ?? "",
    }))

    report.check(layout.name + "-renders-the-panel", rendered.cards > 0, rendered.cards + " cards")
    report.check(layout.name + "-draws-the-helix", rendered.canvas > 0, rendered.canvas + " canvas")
    report.check(layout.name + "-has-no-failed-requests", failures.length === 0, failures.slice(0, 2).join(" | ") || "none")

    await page.close()
    server.close()
  }
} finally {
  await browser.close()
}

report.finish()
