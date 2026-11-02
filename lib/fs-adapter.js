/**
 * A adapter that needs nothing but a directory.
 *
 * This is the reference implementation: it shows that the engine runs with no host at
 * all, and it is what the CLI uses. It is deliberately plain - one workspace, no
 * sessions beyond a single implicit one, no sandbox policy beyond keeping paths inside
 * the workspace.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve, sep } from 'node:path'

export const MAX_FILE_BYTES = 2 * 1024 * 1024
const STORE = '.dsh/research-workbench'

/**
 * Decide whether a path stays inside the workspace, after resolution.
 *
 * The check is on the resolved path, not the string: "${workspace}/../etc" starts with
 * the workspace as a string and is outside it in fact.
 */
function insideWorkspace(workspace, candidate) {
  const rel = relative(resolve(workspace), resolve(candidate))
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))
}

export function createFsAdapter({ workspace, preset = 'standard' } = {}) {
  if (typeof workspace !== 'string' || !workspace) {
    throw new TypeError('createFsAdapter needs a workspace directory')
  }
  const root = resolve(workspace)

  return {
    describe() {
      return { kind: 'filesystem', workspace: root, preset }
    },

    async resolveSession(sessionId) {
      // One implicit session: a filesystem adapter has no notion of several users.
      return { id: String(sessionId ?? 'local'), workspace: root, preset }
    },

    async resolvePath(session, path) {
      if (typeof path !== 'string' || !path) throw new TypeError('path must be a non-empty string')
      const hostPath = isAbsolute(path) ? path : join(session.workspace, path)
      const inside = insideWorkspace(session.workspace, hostPath)
      const info = await stat(hostPath).catch(() => undefined)
      return { hostPath, insideWorkspace: inside, exists: info?.isFile() === true, size: info?.size }
    },

    async readFile(session, hostPath, maxBytes = MAX_FILE_BYTES) {
      if (!insideWorkspace(session.workspace, hostPath)) {
        const error = new Error('that path is outside the workspace')
        error.code = 'OUTSIDE_WORKSPACE'
        throw error
      }
      const info = await stat(hostPath).catch(() => undefined)
      if (!info?.isFile()) {
        const error = new Error('the file was not found')
        error.code = 'ENOENT'
        throw error
      }
      if (info.size > maxBytes) {
        const error = new Error('the file is larger than ' + maxBytes + ' bytes')
        error.code = 'FS_TOO_LARGE'
        throw error
      }
      return readFile(hostPath)
    },

    async writeFile(session, hostPath, text, { expectedVersion } = {}) {
      if (!insideWorkspace(session.workspace, hostPath)) {
        const error = new Error('that path is outside the workspace')
        error.code = 'OUTSIDE_WORKSPACE'
        throw error
      }
      const info = await stat(hostPath).catch(() => undefined)
      if (expectedVersion !== undefined) {
        const current = info ? createHash('sha256').update(await readFile(hostPath)).digest('hex') : 'absent'
        if (current !== expectedVersion) {
          const error = new Error('the file changed on disk; reload before saving')
          error.code = 'FS_STALE_VERSION'
          throw error
        }
      }
      await mkdir(join(hostPath, '..'), { recursive: true })
      await writeFile(hostPath, text, 'utf8')
      return { version: createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex') }
    },

    async listRuns(session) {
      const dir = join(session.workspace, STORE, 'runs')
      const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
      const runs = []
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        try {
          const parsed = JSON.parse(await readFile(join(dir, entry.name, 'run.json'), 'utf8'))
          runs.push({
            id: entry.name,
            title: parsed.title ?? entry.name,
            status: parsed.status ?? 'pending',
            templateId: parsed.templateId,
            createdAt: parsed.createdAt,
            updatedAt: parsed.updatedAt,
            steps: Array.isArray(parsed.steps) ? parsed.steps : [],
          })
        } catch { /* a half-written record is skipped, not reported as a run */ }
      }
      return runs.sort((a, b) => String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')))
    },

    async saveRun(session, run) {
      const dir = join(session.workspace, STORE, 'runs', run.id)
      await mkdir(dir, { recursive: true })
      await writeFile(join(dir, 'run.json'), JSON.stringify(run, null, 2) + '\n', 'utf8')
    },
  }
}

export { insideWorkspace }
