/**
 * Verify that someone else can install this and use it without DSH.
 *
 * Run: node test/verify-standalone.mjs
 *
 * Two claims, checked separately:
 *
 *  1. the engine runs with no host at all - a filesystem adapter is enough;
 *  2. the CLI drives a full lifecycle: run, record, verify, export, check.
 *
 * The second is what "download and use it" actually means, so it is tested end to end
 * rather than asserted in a README.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createReport } from './harness.mjs'
import { assertAdapter, describeAdapter, REQUIRED, ADAPTER_VERSION } from '../lib/adapter.js'
import { createFsAdapter, insideWorkspace } from '../lib/fs-adapter.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const report = createReport('verify-standalone')
const workspace = join(root, '.build', 'standalone-' + process.pid)

function cli(args) {
  const result = spawnSync(process.execPath, [join(root, 'bin', 'dsh-research.mjs'), ...args], {
    encoding: 'utf8',
    env: { ...process.env },
    timeout: 300000,
  })
  return { code: result.status, out: (result.stdout ?? '') + (result.stderr ?? '') }
}

try {
  await rm(workspace, { recursive: true, force: true })
  await mkdir(workspace, { recursive: true })

  // --- The adapter contract is the join point, so it is checked first.
  report.check('adapter-contract-is-declared', Object.keys(REQUIRED).length === 6, Object.keys(REQUIRED).join(', '))
  report.check('adapter-contract-has-a-version', ADAPTER_VERSION === 1)

  const adapter = createFsAdapter({ workspace })
  report.check('a-filesystem-adapter-satisfies-the-contract', (() => {
    try { assertAdapter(adapter); return true } catch { return false }
  })())
  report.check('adapter-describes-itself', describeAdapter(adapter).adapterVersion === ADAPTER_VERSION)

  // An incomplete adapter must be refused, with the missing names listed.
  let refused = false
  let named = false
  try { assertAdapter({ resolveSession: async () => ({}) }) } catch (error) {
    refused = true
    named = /resolvePath/.test(String(error.message)) && /readFile/.test(String(error.message))
  }
  report.check('an-incomplete-adapter-is-refused', refused)
  report.check('the-refusal-names-what-is-missing', named)

  // --- Path containment is security-relevant, so it is tested directly.
  report.check('a-path-inside-the-workspace-is-allowed', insideWorkspace(workspace, join(workspace, 'a.txt')))
  report.check('a-relative-escape-is-refused', insideWorkspace(workspace, join(workspace, '..', 'escape.txt')) === false)
  report.check('the-workspace-itself-is-inside', insideWorkspace(workspace, workspace))

  // --- CLI: a real lifecycle in a real directory.
  const init = cli(['init', workspace])
  report.check('cli-init-works', init.code === 0 && /workspace ready/.test(init.out), init.out.trim().slice(0, 60))

  const templates = cli(['templates'])
  report.check('cli-lists-templates', templates.code === 0 && /sequence-analysis/.test(templates.out))
  report.check('cli-shows-which-steps-are-executable', /\d+\/\d+/.test(templates.out))

  const doctor = cli(['doctor'])
  report.check('cli-doctor-reports-the-interpreter', /python\s+:/.test(doctor.out), (doctor.out.match(/python\s+:.*/) ?? [''])[0].slice(0, 70))
  report.check('cli-doctor-states-the-limits', /no user authentication/.test(doctor.out))

  // Real input, so the run does real work.
  await writeFile(join(workspace, 'sample.fasta'), '>a\nATGGCCATTGTAATGGGCCGCTGAA\n>b\nATGCGTACGTAGCTAGCTAGCATC\n', 'utf8')

  const run = cli(['run', 'sequence-analysis', '--workspace', workspace])
  const completed = /status: completed/.test(run.out)
  if (!completed && /biopython is not installed/.test(run.out)) {
    report.skip('cli-run-completes', 'no Python with biopython on this machine')
  } else {
    report.check('cli-run-completes', completed, (run.out.match(/status: .*/) ?? [''])[0])
    report.check('cli-run-registers-artifacts', /\d+ B/.test(run.out), (run.out.match(/\S+\.json\s+\d+ B/) ?? [''])[0])
    report.check('cli-run-verifies-the-chain', /audit chain: verified/.test(run.out))
  }

  const runs = cli(['runs', '--workspace', workspace])
  report.check('cli-lists-recorded-runs', /sequence-analysis/.test(runs.out))

  const runId = (run.out.match(/run id\s+: (\S+)/) ?? [])[1]
  if (runId) {
    const verified = cli(['verify', runId, '--workspace', workspace])
    report.check('cli-verify-reports-the-chain', /audit chain: verified/.test(verified.out))
    report.check('cli-verify-counts-artifacts', /artifacts\s+: \d+/.test(verified.out))

    const exported = cli(['export', runId, '--workspace', workspace])
    report.check('cli-export-signs-the-bundle', /signed\s+: valid/.test(exported.out), (exported.out.match(/signed\s+:.*/) ?? [''])[0].slice(0, 50))
    report.check('cli-export-states-the-signature-limit', /self-signed bundle proves possession/.test(exported.out))

    const bundlePath = join(workspace, '.dsh', 'research-workbench', 'runs', runId, 'bundle.json')
    const checked = cli(['check', bundlePath])
    report.check('cli-check-verifies-a-bundle', /status\s+: pass/.test(checked.out))
    // A stranger has no reason to trust this key, so authentic must be false.
    report.check('cli-check-does-not-claim-authenticity', /authentic: false/.test(checked.out), (checked.out.match(/authentic:.*/) ?? [''])[0].slice(0, 50))
  } else {
    report.skip('cli-verify-reports-the-chain', 'no run id was produced')
    report.skip('cli-export-signs-the-bundle', 'no run id was produced')
    report.skip('cli-check-verifies-a-bundle', 'no run id was produced')
  }

  // --- The core must import with no host present.
  const engine = await import('../lib/workflow-engine.js')
  report.check('engine-imports-without-a-host', typeof engine.runPlan === 'function')
  const provenance = await import('../lib/provenance.js')
  report.check('provenance-imports-without-a-host', typeof provenance.verifyProvenance === 'function')
} finally {
  await rm(workspace, { recursive: true, force: true }).catch(() => {})
}

report.finish()
