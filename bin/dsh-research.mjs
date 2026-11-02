#!/usr/bin/env node
/**
 * Command line for the workbench engine.
 *
 * This exists for two reasons: to give someone a way to try the engine without installing
 * a host, and to prove that the core has no dependency on one. Every command maps onto a
 * library call, so anything reachable here is also reachable from code.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { definePlan, runPlan, planDigest } from '../lib/workflow-engine.js'
import { createProvenance, recordArtifact, recordExecution, verifyProvenance } from '../lib/provenance.js'
import { createBundle, signBundle, verifyBundle } from '../lib/bundle.js'
import { generateSigningKey } from '../lib/signing.js'
import { createFsAdapter } from '../lib/fs-adapter.js'
import { WORKFLOW_TEMPLATES } from '../client/workflow-templates.js'

const HERE = dirname(fileURLToPath(import.meta.url))
const SCRIPTS = join(HERE, '..', 'scripts')
const STORE = '.dsh/research-workbench'

/**
 * Find a Python that can run the bundled scripts.
 *
 * Order: explicit override, a project venv, a Biomni venv, then PATH. The choice is
 * reported rather than silent, because "the workflow failed" and "the interpreter cannot
 * import biopython" look identical in a step log.
 */
function discoverPython() {
  const candidates = []
  const override = process.env.DSH_RESEARCH_PYTHON
  if (override) candidates.push({ path: override, source: 'DSH_RESEARCH_PYTHON' })
  for (const base of [process.cwd(), join(HERE, '..')]) {
    for (const [rel, source] of [
      ['.venv/Scripts/python.exe', 'project venv'],
      ['.venv/bin/python', 'project venv'],
      ['Biomni/.venv/Scripts/python.exe', 'biomni venv'],
      ['Biomni/.venv/bin/python', 'biomni venv'],
      ['../Biomni/.venv/Scripts/python.exe', 'biomni venv (sibling)'],
    ]) {
      const candidate = resolve(base, rel)
      if (!candidates.some(item => item.path === candidate)) candidates.push({ path: candidate, source })
    }
  }
  const found = candidates.find(item => existsSync(item.path))
  return found ?? { path: 'python', source: 'PATH' }
}

const PYTHON = discoverPython()

const USAGE = [
  'dsh-research <command> [options]',
  '',
  '  init <dir>                    create a workspace',
  '  templates                     list the built-in workflow templates',
  '  plan <template> --workspace D write a plan without running it',
  '  run <template> --workspace D  run a template and record provenance',
  '  runs --workspace D            list recorded runs',
  '  verify <runId> --workspace D  re-verify a run audit chain',
  '  export <runId> --workspace D  write a signed bundle  [--out FILE] [--key FILE]',
  '  check <bundle.json>           verify a bundle that came from somewhere else',
  '  report <runId> --workspace D  render a single-file HTML report',
  '  graph <template>              print the plan as Graphviz DOT',
  '  from-dsl <file.workflow>      run a workflow written in the YAML dialect',
  '  completion [shell]            print a shell completion script',
  '  doctor                        report what this machine can and cannot do',
  '',
  'Workspace defaults to the current directory.',
].join('\n')

function parseArgs(argv) {
  const positional = []
  const flags = {}
  for (let index = 0; index < argv.length; index++) {
    const item = argv[index]
    if (item.startsWith('--')) {
      const name = item.slice(2)
      const next = argv[index + 1]
      if (next !== undefined && !next.startsWith('--')) { flags[name] = next; index++ }
      else flags[name] = true
    } else positional.push(item)
  }
  return { positional, flags }
}

const workspaceOf = flags => resolve(typeof flags.workspace === 'string' ? flags.workspace : process.cwd())

function findTemplate(id) {
  const template = WORKFLOW_TEMPLATES.find(item => item.id === id)
  if (!template) {
    console.error('no template "' + id + '". Run: dsh-research templates')
    process.exitCode = 2
    return undefined
  }
  return template
}

/** Turn a template into a plan. Steps without a command cannot be run by a machine. */
function planFromTemplate(template) {
  const executable = template.steps.filter(step => typeof step.command === 'string' && step.command)
  if (!executable.length) {
    const error = new Error('template "' + template.id + '" has no executable steps')
    error.code = 'NOT_EXECUTABLE'
    throw error
  }
  return definePlan({
    ...(template.backend ? { backend: template.backend } : {}),
    ...(template.image ? { image: template.image } : {}),
    steps: executable.map(step => ({
      id: step.id,
      title: step.title,
      command: step.command.replaceAll('{{scripts}}', SCRIPTS).replaceAll('{{python}}', PYTHON.path),
      ...(step.argv ? { argv: step.argv } : {}),
      needs: (step.needs ?? []).filter(id => executable.some(other => other.id === id)),
      inputs: step.inputs ?? [],
      outputs: step.outputs ?? [],
      ...(step.timeoutMs === undefined ? {} : { timeoutMs: step.timeoutMs }),
    })),
  })
}

async function cmdInit({ positional }) {
  const target = resolve(positional[0] ?? '.')
  await mkdir(join(target, STORE, 'runs'), { recursive: true })
  console.log('workspace ready: ' + target)
  console.log('add input files, then: dsh-research run sequence-analysis --workspace "' + target + '"')
}

function cmdTemplates() {
  for (const template of WORKFLOW_TEMPLATES) {
    const executable = template.steps.filter(step => step.command).length
    console.log(template.id.padEnd(26) + template.badge.padEnd(10) + String(executable + '/' + template.steps.length).padEnd(14) + template.title)
  }
}

async function cmdPlan({ positional, flags }) {
  const template = findTemplate(positional[0])
  if (!template) return
  const plan = planFromTemplate(template)
  const text = JSON.stringify({
    digest: planDigest(plan),
    backend: plan.backend,
    steps: plan.steps.map(step => ({
      id: step.id,
      needs: step.needs,
      inputs: step.contract.inputs.map(i => i.path),
      outputs: step.contract.outputs.map(o => o.path),
    })),
  }, null, 2)
  if (typeof flags.out === 'string') { await writeFile(flags.out, text + '\n', 'utf8'); console.log('plan written to ' + flags.out) }
  else console.log(text)
}

async function cmdRun({ positional, flags }) {
  const template = findTemplate(positional[0])
  if (!template) return
  const workspace = workspaceOf(flags)
  const adapter = createFsAdapter({ workspace, preset: template.preset })
  const session = await adapter.resolveSession('local')
  const plan = planFromTemplate(template)

  const runId = new Date().toISOString().replace(/[:.]/g, '-') + '-' + template.id
  const runDirectory = join(workspace, STORE, 'executions', runId)
  await mkdir(runDirectory, { recursive: true })

  console.log('running ' + template.id + ' in ' + workspace)
  if (template.steps.some(step => (step.command ?? '').includes('{{python}}'))) {
    console.log('interpreter: ' + PYTHON.path + '  (' + PYTHON.source + ')')
  }
  const result = await runPlan(plan, { workspace, runDirectory })
  console.log('status: ' + result.status)
  for (const step of result.steps) {
    console.log('  ' + step.id.padEnd(24) + step.status + (step.exitCode === null ? '' : ' exit=' + step.exitCode))
    if (step.error) console.log('    ' + step.error.slice(0, 160))
    if (step.stderrTail) console.log('    ' + step.stderrTail.trim().split('\n').slice(-1)[0].slice(0, 140))
    for (const artifact of step.outputs ?? []) {
      console.log('    ' + artifact.path + '  ' + artifact.bytes + ' B  ' + artifact.sha256.slice(0, 16))
    }
  }

  let provenance = createProvenance({ runId, sessionId: session.id, templateId: template.id, preset: template.preset, inputs: {}, now: new Date().toISOString() })
  for (const step of result.steps) {
    provenance = recordExecution(provenance, { stepId: step.id, tool: 'workflow-engine', stepFingerprint: step.fingerprint, exitCode: step.exitCode, status: step.status })
    for (const artifact of step.outputs ?? []) {
      provenance = recordArtifact(provenance, { path: artifact.path, label: artifact.path, bytes: artifact.bytes, version: 'v1', checksum: { algorithm: 'sha256', value: artifact.sha256 } })
    }
  }
  const run = {
    schemaVersion: 2, id: runId, sessionId: session.id, templateId: template.id,
    title: template.title, preset: template.preset, status: result.status,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    inputs: {},
    steps: result.steps.map(step => ({
      id: step.id, title: step.label, status: step.status,
      artifacts: (step.outputs ?? []).map(a => ({ path: a.path, bytes: a.bytes, sha256: a.sha256 })),
      ...(step.error ? { error: step.error } : {}),
    })),
    provenance,
  }
  await adapter.saveRun(session, run)
  console.log('run id     : ' + runId)
  console.log('audit chain: ' + (verifyProvenance(provenance) ? 'verified' : 'BROKEN'))
}

async function cmdRuns({ flags }) {
  const workspace = workspaceOf(flags)
  const adapter = createFsAdapter({ workspace })
  const session = await adapter.resolveSession('local')
  const runs = await adapter.listRuns(session)
  if (!runs.length) { console.log('no runs recorded in ' + workspace); return }
  for (const run of runs) console.log(run.id.padEnd(48) + String(run.status).padEnd(12) + run.title)
}

async function loadRun(workspace, runId) {
  const path = join(workspace, STORE, 'runs', runId, 'run.json')
  if (!existsSync(path)) { console.error('no run "' + runId + '" in ' + workspace); process.exitCode = 2; return undefined }
  return JSON.parse(await readFile(path, 'utf8'))
}

async function cmdVerify({ positional, flags }) {
  const run = await loadRun(workspaceOf(flags), positional[0])
  if (!run) return
  const verified = verifyProvenance(run.provenance)
  console.log('audit chain: ' + (verified ? 'verified' : 'BROKEN'))
  console.log('artifacts  : ' + (run.provenance?.artifacts?.length ?? 0))
  if (!verified) process.exitCode = 1
}

async function cmdExport({ positional, flags }) {
  const workspace = workspaceOf(flags)
  const run = await loadRun(workspace, positional[0])
  if (!run) return
  let key
  if (typeof flags.key === 'string') key = JSON.parse(await readFile(flags.key, 'utf8'))
  else {
    const keyPath = join(workspace, STORE, 'signing-key.json')
    if (existsSync(keyPath)) key = JSON.parse(await readFile(keyPath, 'utf8'))
    else {
      key = generateSigningKey()
      await mkdir(dirname(keyPath), { recursive: true })
      await writeFile(keyPath, JSON.stringify(key, null, 2) + '\n', 'utf8')
      console.log('generated a signing key at ' + keyPath)
    }
  }
  const { bundle } = createBundle({ run, exportedAt: new Date().toISOString(), environment: { pluginVersion: '0.1.0', publicKey: key.publicKey } })
  const signed = signBundle(bundle, key.privateKey, key.keyId)
  const out = typeof flags.out === 'string' ? flags.out : join(workspace, STORE, 'runs', run.id, 'bundle.json')
  await writeFile(out, JSON.stringify(signed, null, 2) + '\n', 'utf8')
  const check = verifyBundle(signed, { trustedKeys: [key.keyId] })
  console.log('bundle     : ' + out)
  console.log('status     : ' + check.status)
  console.log('signed     : ' + check.signatureStatus + ' (self-signed, key ' + key.keyId.slice(0, 8) + ')')
  console.log('note       : a self-signed bundle proves possession of a key, not who owns it')
  console.log('key id     : ' + key.keyId)
}

async function cmdCheck({ positional }) {
  const path = positional[0]
  if (!path) { console.error('usage: dsh-research check <bundle.json>'); process.exitCode = 2; return }
  const bundle = JSON.parse(await readFile(path, 'utf8'))
  // No trusted keys supplied: a bundle from elsewhere can prove its own integrity, but
  // authentication needs a key someone decided to trust.
  const result = verifyBundle(bundle, { trustedKeys: [] })
  console.log('status   : ' + result.status)
  for (const check of result.checks) console.log('  ' + (check.ok ? 'PASS' : 'FAIL') + '  ' + check.id.padEnd(14) + (check.detail ?? ''))
  console.log('signature: ' + result.signatureStatus)
  console.log('authentic: ' + result.authenticated + '  (authentication needs a trusted key id)')
}

async function cmdDoctor() {
  const { probeContainerRuntime } = await import('../lib/step-executor.js')
  console.log('workspace     : ' + process.cwd())
  console.log('node          : ' + process.version)
  console.log('python        : ' + PYTHON.path + '  (' + PYTHON.source + ')')
  const probe = await probeContainerRuntime({ timeoutMs: 8000 })
  console.log('container     : ' + (probe.available ? 'daemon ' + probe.serverVersion : 'not available - ' + (probe.reason ?? '')))
  const scripts = existsSync(SCRIPTS) ? (await readdir(SCRIPTS)).filter(n => /\.(py|R)$/.test(n)) : []
  console.log('scripts       : ' + scripts.length + ' in ' + SCRIPTS)
  console.log('')
  console.log('this tool provides no user authentication, no clinical validation,')
  console.log('no reproducible builds, and no compliance certification.')
}

async function cmdReport({ positional, flags }) {
  const workspace = workspaceOf(flags)
  const run = await loadRun(workspace, positional[0])
  if (!run) return
  const { renderHtmlReport } = await import('../lib/report-html.js')
  const { verifyProvenance } = await import('../lib/provenance.js')
  const html = renderHtmlReport({ run, plan: null, provenance: run.provenance, verified: verifyProvenance(run.provenance) })
  const out = typeof flags.out === 'string' ? flags.out : join(workspace, STORE, 'runs', run.id, 'report.html')
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html, 'utf8')
  console.log('report: ' + out)
  console.log('size  : ' + Math.round(Buffer.byteLength(html) / 1024) + ' KiB')
}

async function cmdGraph({ positional, flags }) {
  const template = findTemplate(positional[0])
  if (!template) return
  const { toDot } = await import('../lib/graph.js')
  const plan = planFromTemplate(template)
  const dot = toDot(plan, { title: template.id })
  if (typeof flags.out === 'string') { await writeFile(flags.out, dot, 'utf8'); console.log('graph written to ' + flags.out) }
  else console.log(dot)
}

async function cmdFromDsl({ positional, flags }) {
  const file = positional[0]
  if (!file) { console.error('usage: dsh-research from-dsl <file.workflow>'); process.exitCode = 2; return }
  const source = await readFile(file, 'utf8')
  const { workflowFromDsl } = await import('../lib/dsl.js')
  const workspace = workspaceOf(flags)
  const plan = definePlan(workflowFromDsl(source))
  const adapter = createFsAdapter({ workspace })
  const session = await adapter.resolveSession('local')
  const runId = new Date().toISOString().replace(/[:.]/g, '-') + '-dsl'
  const runDirectory = join(workspace, STORE, 'executions', runId)
  await mkdir(runDirectory, { recursive: true })
  console.log('running ' + file + ' in ' + workspace)
  const result = await runPlan(plan, { workspace, runDirectory })
  console.log('status: ' + result.status)
  for (const step of result.steps) {
    console.log('  ' + step.id.padEnd(24) + step.status)
    for (const artifact of step.outputs ?? []) console.log('    ' + artifact.path + '  ' + artifact.bytes + ' B  ' + artifact.sha256.slice(0, 16))
  }
  let provenance = createProvenance({ runId, sessionId: session.id, templateId: 'dsl', preset: 'standard', inputs: {}, now: new Date().toISOString() })
  for (const step of result.steps) {
    provenance = recordExecution(provenance, { stepId: step.id, tool: 'workflow-engine', stepFingerprint: step.fingerprint, exitCode: step.exitCode, status: step.status })
    for (const artifact of step.outputs ?? []) {
      provenance = recordArtifact(provenance, { path: artifact.path, label: artifact.path, bytes: artifact.bytes, version: 'v1', checksum: { algorithm: 'sha256', value: artifact.sha256 } })
    }
  }
  await adapter.saveRun(session, {
    schemaVersion: 2, id: runId, sessionId: session.id, templateId: 'dsl', title: file,
    preset: 'standard', status: result.status, inputs: {},
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    steps: result.steps.map(step => ({ id: step.id, title: step.label, status: step.status, artifacts: (step.outputs ?? []).map(a => ({ path: a.path, bytes: a.bytes, sha256: a.sha256 })) })),
    provenance,
  })
  console.log('run id     : ' + runId)
  console.log('audit chain: ' + (verifyProvenance(provenance) ? 'verified' : 'BROKEN'))
}

async function cmdCompletion({ positional }) {
  const { spawnSync } = await import('node:child_process')
  const shell = positional[0] ?? 'bash'
  const result = spawnSync(process.execPath, [join(HERE, 'dsh-research-completion.mjs'), shell], { encoding: 'utf8' })
  process.stdout.write(result.stdout ?? '')
  if (result.stderr) process.stderr.write(result.stderr)
  process.exitCode = result.status ?? 0
}

const commands = { init: cmdInit, templates: cmdTemplates, plan: cmdPlan, run: cmdRun, runs: cmdRuns, verify: cmdVerify, export: cmdExport, check: cmdCheck, doctor: cmdDoctor, report: cmdReport, graph: cmdGraph, 'from-dsl': cmdFromDsl, completion: cmdCompletion }

const argv = process.argv.slice(2)
if (!argv.length || argv[0] === '--help' || argv[0] === '-h') { console.log(USAGE); process.exit(0) }
const command = commands[argv[0]]
if (!command) { console.error('unknown command: ' + argv[0] + '\n'); console.log(USAGE); process.exit(2) }
await command(parseArgs(argv.slice(1)))
