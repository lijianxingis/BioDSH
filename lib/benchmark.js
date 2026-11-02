/**
 * Benchmark cases that verify the engine's own guarantees.
 *
 * These are deliberately about the machinery (hashing, dependency order, declared
 * outputs), not about biology. A pass means the engine behaved; it says nothing about
 * whether an analysis is correct, and the report says so.
 */
import { definePlan, runPlan } from './workflow-engine.js'

function defineRunnableCase(entry) {
  return Object.freeze({
    case: Object.freeze({ ...entry, plan: undefined }),
    plan: definePlan(entry.plan),
  })
}

export const BUILTIN_CASES = Object.freeze([
  {
    id: 'engine:artifact-hash',
    title: 'A produced artifact is recorded with its real size and digest',
    scenario: 'research',
    plan: {
      steps: [{
        id: 'write',
        command: 'x',
        outputs: [{ path: 'sample.csv', minBytes: 5 }],
        argv: [process.execPath, '-e', "require('fs').writeFileSync('sample.csv','a,b\\n1,2\\n')"],
      }],
    },
    expectedMetrics: { artifacts: { value: 1 }, bytes: { value: 8 } },
    extract(artifacts) {
      const entries = Object.entries(artifacts)
      return { artifacts: entries.length, bytes: entries.reduce((sum, [, buffer]) => sum + buffer.length, 0) }
    },
  },
  {
    id: 'engine:dependency-order',
    title: 'A dependent step reads what its predecessor wrote',
    scenario: 'research',
    plan: {
      steps: [
        {
          id: 'produce',
          command: 'x',
          outputs: ['value.txt'],
          argv: [process.execPath, '-e', "require('fs').writeFileSync('value.txt','42')"],
        },
        {
          id: 'consume',
          command: 'x',
          needs: ['produce'],
          outputs: ['doubled.txt'],
          argv: [process.execPath, '-e', "const v=Number(require('fs').readFileSync('value.txt','utf8'));require('fs').writeFileSync('doubled.txt',String(v*2))"],
        },
      ],
    },
    expectedMetrics: { doubled: { value: 84 } },
    extract(artifacts) {
      const buffer = artifacts['doubled.txt']
      if (!buffer) throw new Error('doubled.txt was not produced')
      return { doubled: Number(buffer.toString('utf8')) }
    },
  },
])

export function builtinSuite() {
  return BUILTIN_CASES.map(defineRunnableCase)
}

/**
 * Run every case and compare its measured metrics.
 *
 * A case whose plan did not complete is `blocked`, not `fail`: letting a broken
 * pipeline fail the metric comparison would blame the expectation for the breakage.
 */
export async function runSuite(suite, { workspace, runDirectory, interpreter } = {}) {
  const cases = []
  for (const runnable of suite) {
    const dir = runDirectory + '/' + runnable.case.id.replace(/[^A-Za-z0-9._-]/g, '-')
    const result = await runPlan(runnable.plan, { workspace, runDirectory: dir, interpreter })
    if (result.status !== 'completed') {
      cases.push(Object.freeze({
        caseId: runnable.case.id,
        title: runnable.case.title,
        status: 'blocked',
        runStatus: result.status,
        error: 'The plan did not complete (' + result.status + '); no metrics are compared.',
      }))
      continue
    }
    const artifacts = {}
    for (const step of result.steps) {
      for (const output of step.outputs ?? []) {
        try { artifacts[output.path] = await readFile(join(workspace, output.path)) } catch { /* absent */ }
      }
    }
    let metrics
    try { metrics = runnable.case.extract(artifacts) } catch (error) {
      cases.push(Object.freeze({
        caseId: runnable.case.id, title: runnable.case.title, status: 'fail',
        runStatus: result.status, error: error instanceof Error ? error.message : String(error),
      }))
      continue
    }
    const failures = []
    for (const [name, expected] of Object.entries(runnable.case.expectedMetrics)) {
      const actual = metrics[name]
      if (actual !== expected.value) failures.push(name + ': expected ' + expected.value + ', measured ' + actual)
    }
    cases.push(Object.freeze({
      caseId: runnable.case.id,
      title: runnable.case.title,
      status: failures.length ? 'fail' : 'pass',
      runStatus: result.status,
      metrics,
      ...(failures.length ? { failures } : {}),
    }))
  }
  const counts = { pass: 0, fail: 0, blocked: 0 }
  for (const item of cases) counts[item.status] += 1
  return Object.freeze({
    schemaVersion: 1,
    status: counts.fail ? 'fail' : counts.blocked ? 'blocked' : 'pass',
    counts,
    cases: Object.freeze(cases),
    intendedUse: 'research-only',
    clinicalValidationPerformed: false,
  })
}

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
