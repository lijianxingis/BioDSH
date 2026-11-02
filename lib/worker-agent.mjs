import { createServer } from 'node:http'
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'

const PROTOCOL = 2
const MAX_ARTIFACT_BYTES = 32 * 1024 * 1024
const DEFAULT_TIMEOUT_MS = 600000

/** Run a command with output captured through files (piped stdio is denied here). */
async function execute(argv, { cwd, timeoutMs }) {
  const out = join(cwd, '.out-' + Math.random().toString(36).slice(2))
  const err = join(cwd, '.err-' + Math.random().toString(36).slice(2))
  const { open } = await import('node:fs/promises')
  const fo = await open(out, 'w')
  const fe = await open(err, 'w')
  try {
    const result = await new Promise(resolve => {
      let settled = false
      const finish = value => { if (!settled) { settled = true; resolve(value) } }
      const child = spawn(argv[0], argv.slice(1), { cwd, windowsHide: true, stdio: ['ignore', fo.fd, fe.fd] })
      const timer = setTimeout(() => { try { child.kill() } catch { /* */ } finish({ exitCode: null, timedOut: true }) }, timeoutMs)
      child.on('error', error => { clearTimeout(timer); finish({ exitCode: null, error: error.message }) })
      child.on('close', code => { clearTimeout(timer); finish({ exitCode: code }) })
    })
    const stdout = await readFile(out, 'utf8').catch(() => '')
    const stderr = await readFile(err, 'utf8').catch(() => '')
    return { ...result, stdoutTail: stdout.slice(-4000), stderrTail: stderr.slice(-4000) }
  } finally {
    await fo.close().catch(() => {})
    await fe.close().catch(() => {})
    await rm(out, { force: true }).catch(() => {})
    await rm(err, { force: true }).catch(() => {})
  }
}

/**
 * Start a worker on the given port.
 *
 * A token is mandatory: an unauthenticated remote shell is not offered. The health
 * endpoint deliberately answers without one, because it returns nothing but a version
 * and monitoring needs to be able to probe it.
 */
export async function startWorker({ port = 0, token, host = '127.0.0.1' } = {}) {
  if (typeof token !== 'string' || !token) {
    throw new Error('a worker token is required; an unauthenticated remote shell is not offered')
  }
  const server = createServer(async (request, response) => {
    const send = (status, body) => {
      const text = JSON.stringify(body)
      response.writeHead(status, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(text) })
      response.end(text)
    }
    if (request.method === 'GET' && request.url === '/health') {
      return send(200, { protocolVersion: PROTOCOL, ok: true })
    }
    if (request.method !== 'POST' || request.url !== '/execute') return send(404, { error: 'use POST /execute' })
    if ((request.headers.authorization ?? '') !== 'Bearer ' + token) return send(401, { error: 'unauthorized' })
    let raw = ''
    for await (const chunk of request) {
      raw += chunk
      if (raw.length > 64 * 1024 * 1024) { response.destroy(); return }
    }
    let body
    try { body = JSON.parse(raw) } catch { return send(400, { error: 'body must be JSON' }) }
    if (body?.protocolVersion !== PROTOCOL) return send(400, { error: 'this worker speaks protocol ' + PROTOCOL })
    if (!Array.isArray(body.argv) || !body.argv.length || body.argv.some(item => typeof item !== 'string')) {
      return send(400, { error: 'argv must be a non-empty array of strings' })
    }
    const timeoutMs = Number.isSafeInteger(body.timeoutMs) && body.timeoutMs > 0 ? body.timeoutMs : DEFAULT_TIMEOUT_MS
    const workdir = await mkdtemp(join(tmpdir(), 'dsh-worker-job-'))
    try {
      for (const input of body.inputs ?? []) {
        const target = join(workdir, input.path)
        await mkdir(dirname(target), { recursive: true })
        await writeFile(target, Buffer.from(String(input.content ?? ''), 'base64'))
      }
      const result = await execute(body.argv, { cwd: workdir, timeoutMs })
      const produced = []
      for (const pattern of body.expectOutputs ?? []) {
        const literal = String(pattern).replace(/\*/g, '')
        if (!literal) continue
        const target = join(workdir, literal)
        try {
          const info = await stat(target)
          if (!info.isFile()) continue
          if (info.size > MAX_ARTIFACT_BYTES) {
            return send(413, { error: literal + ' is over the transport limit' })
          }
          produced.push({ path: literal, content: (await readFile(target)).toString('base64') })
        } catch { /* a declared output that was not created is reported below */ }
      }
      return send(200, {
        protocolVersion: PROTOCOL,
        exitCode: result.exitCode,
        stdoutTail: result.stdoutTail ?? '',
        stderrTail: result.stderrTail ?? '',
        artifacts: produced,
      })
    } finally {
      await rm(workdir, { recursive: true, force: true }).catch(() => {})
    }
  })
  await new Promise(resolve => server.listen(port, host, resolve))
  const address = server.address()
  return {
    url: 'http://' + host + ':' + address.port,
    close: () => new Promise(resolve => server.close(resolve)),
  }
}
