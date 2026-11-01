/**
 * Content-addressed artifact store.
 *
 * The index is rebuilt from the directory rather than kept in memory only: a store that
 * forgets its contents on restart cannot serve a run that resumes on another machine.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const MAX_ARTIFACT_BYTES = 32 * 1024 * 1024
export const MAX_STORE_BYTES = 512 * 1024 * 1024
export const MAX_ARTIFACTS = 4096

export function createArtifactStore(root) {
  if (typeof root !== 'string' || !root) throw new TypeError('root must be a directory path')
  const index = new Map()
  let loaded = false
  let bytes = 0

  const pathFor = digest => join(root, digest.slice(0, 2), digest)

  const load = async () => {
    if (loaded) return
    await mkdir(root, { recursive: true })
    const entries = await readdir(root, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const inner = await readdir(join(root, entry.name)).catch(() => [])
      for (const name of inner) {
        if (!/^[a-f0-9]{64}$/.test(name)) continue
        const full = join(root, entry.name, name)
        const buffer = await readFile(full).catch(() => null)
        if (!buffer) continue
        // Re-hash on load: a store whose bytes were edited underneath is not a store.
        if (createHash('sha256').update(buffer).digest('hex') !== name) continue
        index.set(name, { bytes: buffer.length, name })
        bytes += buffer.length
      }
    }
    loaded = true
  }

  return Object.freeze({
    async put(content, { name } = {}) {
      await load()
      const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
      if (buffer.length > MAX_ARTIFACT_BYTES) {
        const error = new Error('an artifact may not exceed ' + MAX_ARTIFACT_BYTES + ' bytes')
        error.code = 'ARTIFACT_TOO_LARGE'
        throw error
      }
      const digest = createHash('sha256').update(buffer).digest('hex')
      if (index.has(digest)) return { digest, bytes: index.get(digest).bytes, deduplicated: true }
      if (bytes + buffer.length > MAX_STORE_BYTES || index.size >= MAX_ARTIFACTS) {
        const error = new Error('the artifact store is full')
        error.code = 'STORE_FULL'
        throw error
      }
      const target = pathFor(digest)
      await mkdir(join(root, digest.slice(0, 2)), { recursive: true })
      await writeFile(target, buffer)
      index.set(digest, { bytes: buffer.length, name })
      bytes += buffer.length
      return { digest, bytes: buffer.length, deduplicated: false }
    },

    async get(digest) {
      await load()
      if (!index.has(digest)) {
        const error = new Error('no artifact with that digest')
        error.code = 'ARTIFACT_NOT_FOUND'
        throw error
      }
      const buffer = await readFile(pathFor(digest))
      // Verify on the way out as well: a corrupted file must not be served as if intact.
      if (createHash('sha256').update(buffer).digest('hex') !== digest) {
        const error = new Error('the stored bytes do not match their digest')
        error.code = 'ARTIFACT_CORRUPT'
        throw error
      }
      return buffer
    },

    async has(digest) {
      await load()
      return index.has(digest)
    },

    async list() {
      await load()
      return [...index.entries()].map(([digest, meta]) => ({ digest, bytes: meta.bytes, name: meta.name }))
    },

    async usage() {
      await load()
      return { artifacts: index.size, bytes, maxBytes: MAX_STORE_BYTES, maxArtifacts: MAX_ARTIFACTS }
    },
  })
}
