/**
 * Serve the showcase site.
 *
 * Deliberately a static file server and nothing else: the page needs no build step at
 * request time, no API, and no state. Anyone can also open it with any other static
 * server, or from disk after running the build.
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, sep, resolve } from 'node:path'
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
  // Read the raw request target, not url.pathname: the URL constructor collapses '..'
  // while parsing, so a traversal never appears in url.pathname at all. That was why the
  // guard looked correct and did nothing.
  const rawTarget = String(request.url ?? '/').split('?')[0].split('#')[0]
  let decoded
  try {
    decoded = decodeURIComponent(rawTarget)
  } catch {
    response.writeHead(400).end('bad request')
    return
  }
  // Refuse anything that still contains a parent reference after decoding. Belt and braces:
  // the resolve/prefix check below would also catch it, but rejecting early makes the
  // intent explicit and keeps the error the same for every spelling.
  if (decoded.split(/[\\/]/).includes('..')) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' }).end('forbidden')
    return
  }
  const pathname = decoded === '/' ? '/site/index.html' : decoded

  // Resolve against the project root WITHOUT normalising first: join(root, normalize(p))
  // collapses '..' before the check can see it, which made /../package.json readable.
  // The guard must run on the path as resolved, then compare with a separator so that
  // '/repo-evil' does not pass for root '/repo'.
  const target = resolve(root, '.' + pathname)
  const inside = target === root || target.startsWith(root + sep)
  if (!inside) {
    response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' }).end('forbidden')
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
