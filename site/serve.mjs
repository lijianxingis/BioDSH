/**
 * Serve the showcase site.
 *
 * Deliberately a static file server and nothing else: the page needs no build step at
 * request time, no API, and no state. Anyone can also open it with any other static
 * server, or from disk after running the build.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const port = Number(process.env.PORT ?? 4173)
const host = process.env.HOST ?? '127.0.0.1'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://' + host)
  const pathname = url.pathname === '/' ? '/site/index.html' : url.pathname
  // normalize + prefix check: a request for ../../etc/passwd must not escape the project.
  const target = resolve(join(root, normalize(pathname)))
  if (!target.startsWith(root)) {
    response.writeHead(403).end('forbidden')
    return
  }
  try {
    const info = await stat(target)
    if (!info.isFile()) throw new Error('not a file')
    const body = await readFile(target)
    response.writeHead(200, {
      'content-type': TYPES[extname(target)] ?? 'application/octet-stream',
      'content-length': body.length,
      'cache-control': 'no-store',
    })
    response.end(body)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found: ' + pathname)
  }
})

server.listen(port, host, () => {
  console.log('site: http://' + host + ':' + port + '/')
  console.log('press Ctrl+C to stop')
})
