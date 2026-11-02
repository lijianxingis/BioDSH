/**
 * A stand-in host for the site.
 *
 * The real components are mounted unchanged - same Home, same WorkflowPanel, same CLI
 * rendering. Only the transport is replaced, so what a visitor sees is the product's own
 * interface rather than a mock-up of it.
 *
 * The data is a recorded run: real artifact names, real byte counts, real digests from
 * the sessions that produced them. Where a number was not recorded, it is left out
 * rather than invented.
 */

const RUNS = [
  {
    id: '2026-11-02T09-04-02-537Z-sequence-analysis',
    title: '序列分析',
    status: 'completed',
    templateId: 'sequence-analysis',
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    steps: [
      { id: 'inspect-inputs', title: '扫描序列文件', status: 'completed', artifacts: [] },
      { id: 'analyze-sequences', title: '汇总序列', status: 'completed', artifacts: [{ path: 'sequence-summary.json', bytes: 111, sha256: '1917fe519f3d76cf' }] },
    ],
  },
  {
    id: '2026-11-02T08-57-14-252Z-biomni-toolkit',
    title: 'Biomni 工具链',
    status: 'completed',
    templateId: 'biomni-toolkit',
    updatedAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    steps: [
      { id: 'inventory', title: '清点可用工具', status: 'completed', artifacts: [{ path: 'biomni-inventory.json', bytes: 9098, sha256: 'e7b98295d7d4' }] },
      { id: 'restriction-sites', title: '酶切位点分析', status: 'completed', artifacts: [{ path: 'restriction-sites.json', bytes: 3283, sha256: 'a2b6c02a2e78' }] },
      { id: 'reading-frames', title: '开放阅读框注释', status: 'completed', artifacts: [{ path: 'reading-frames.json', bytes: 1088, sha256: 'b5a0c92b6f42' }] },
    ],
  },
  {
    id: '2026-11-02T07-31-08-115Z-bioconductor-de',
    title: 'Bioconductor 差异表达',
    status: 'completed',
    templateId: 'bioconductor-de',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    steps: [
      { id: 'inspect-inputs', title: '检查输入矩阵', status: 'completed', artifacts: [] },
      { id: 'differential-expression', title: 'limma 差异表达', status: 'completed', artifacts: [{ path: 'de-results.csv', bytes: 23501, sha256: '7c81ca1022c17b29' }, { path: 'de-summary.json', bytes: 328, sha256: '6b7d067dd30b49' }] },
    ],
  },
  {
    id: '2026-11-02T06-12-44-902Z-sequence-analysis',
    title: '序列分析（解释器缺失）',
    status: 'failed',
    templateId: 'sequence-analysis',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    steps: [
      { id: 'inspect-inputs', title: '扫描序列文件', status: 'failed', error: 'biopython is not installed for C:\\anaconda3\\python.exe', artifacts: [] },
      { id: 'analyze-sequences', title: '汇总序列', status: 'skipped', artifacts: [] },
    ],
  },
]

const EVIDENCE = {
  audit: [
    { at: '09:04:02', type: 'workflow-created', toString: 'sequence-analysis' },
    { at: '09:04:02', type: 'artifact-observed', toString: 'sequence-summary.json · 111 B' },
    { at: '09:04:02', type: 'execution-recorded', toString: 'analyze-sequences · exit 0' },
  ],
  artifacts: [
    { path: 'sequence-summary.json', bytes: 111, sha256: '1915fe519f3d76cf' },
  ],
}

function delay(value, ms = 120) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

export function createDemoApi() {
  const mutable = RUNS.map(run => JSON.parse(JSON.stringify(run)))

  return async function api(action, payload = {}) {
    switch (action) {
      case 'workflow/list':
        return delay({ runs: mutable.map(({ steps, ...rest }) => ({ ...rest, steps: steps.map(s => ({ id: s.id, title: s.title, status: s.status })) })) })

      case 'workflow/get': {
        const run = mutable.find(item => item.id === payload.runId) ?? mutable[0]
        return delay({ run })
      }

      case 'workflow/provenance':
        return delay({ provenance: { audit: EVIDENCE.audit }, verified: true })

      case 'workflow/artifacts': {
        const run = mutable.find(item => item.id === payload.runId) ?? mutable[0]
        const declared = run.steps.flatMap(step => (step.artifacts ?? []).map(a => a.path))
        const artifacts = run.steps.flatMap(step => step.artifacts ?? [])
        return delay({ artifacts, declared, missing: [] })
      }

      case 'editor/read':
        return delay({
          path: payload.path ?? 'columns.csv',
          version: 'v1',
          text: ['probe,control_1,control_2,treated_1,treated_2', 'YGL054C,42,39,148,151', 'YGR189C,88,91,86,84', 'YDR481C,17,19,61,58', 'YBR038W,120,118,44,47'].join('\n'),
        })

      case 'editor/save':
        return delay({ path: payload.path, text: payload.text, version: 'v2' })

      case 'workflow/create':
        return delay({ runId: 'demo-' + Date.now(), run: mutable[0] })

      case 'workflow/execute':
        return delay({ runId: payload.runId, status: 'completed', order: ['inspect-inputs', 'analyze-sequences'] })

      case 'workflow/decision':
        return delay({ runId: payload.runId, decisionGate: { decision: payload.decision, actor: 'human-user (identity not verified)', clinicalUse: 'not-authorized' } })

      default: {
        const error = new Error('the demo does not implement ' + action)
        error.code = 'NOT_IMPLEMENTED'
        throw error
      }
    }
  }
}

export { RUNS }
