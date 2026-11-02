import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { WORKFLOW_TEMPLATES } from './workflow-templates.js'
import { SkeletonRows } from './Feedback.jsx'

/**
 * The workflow panel.
 *
 * It shows what the host observed, not what a model said it did: every step status on
 * this screen comes from the run record, and the evidence block reads the audit chain
 * back from disk. Where the panel cannot know something it says so rather than showing
 * a plausible value.
 */

const STATUS_LABEL = { pending: '待开始', running: '运行中', completed: '已完成', failed: '失败', skipped: '已跳过', cancelled: '已取消' }
const STATUS_TONE = { completed: 'ok', failed: 'bad', running: 'busy', skipped: 'idle', cancelled: 'idle', pending: 'idle' }
const DECISIONS = [
  { value: 'accepted', label: '接受结果' },
  { value: 'rejected', label: '拒绝' },
  { value: 'needs-revision', label: '需要修改' },
]

function StepRow({ step }) {
  const tone = STATUS_TONE[step.status] ?? 'idle'
  return <div className="rw-step">
    <span className={'rw-home-dot rw-home-dot--' + tone} aria-hidden="true"/>
    <div className="rw-step-main">
      <div className="rw-step-title">{step.title || step.id}</div>
      <div className="rw-step-meta">
        {STATUS_LABEL[step.status] ?? step.status}
        {Array.isArray(step.artifacts) && step.artifacts.length > 0 && ' · ' + step.artifacts.length + ' 个产物'}
        {step.error && ' · ' + step.error}
      </div>
      {Array.isArray(step.artifacts) && step.artifacts.length > 0 && (
        <ul className="rw-step-artifacts">
          {step.artifacts.map(item => <li key={item.path}>
            <code>{item.path}</code> <span>{item.bytes} B</span>
            {item.sha256 && <span className="rw-hash">{item.sha256.slice(0, 12)}</span>}
          </li>)}
        </ul>
      )}
    </div>
  </div>
}

export function WorkflowPanel({ api, initialTemplateId, initialRunId }) {
  const [templateId, setTemplateId] = useState(initialTemplateId ?? WORKFLOW_TEMPLATES[0].id)
  const [runs, setRuns] = useState({ state: 'loading' })
  const [activeId, setActiveId] = useState(initialRunId ?? null)
  const [run, setRun] = useState({ state: 'idle' })
  const [evidence, setEvidence] = useState({ state: 'idle' })
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState(null)

  const template = useMemo(() => WORKFLOW_TEMPLATES.find(item => item.id === templateId) ?? WORKFLOW_TEMPLATES[0], [templateId])

  const loadRuns = useCallback(() => {
    setRuns({ state: 'loading' })
    api('workflow/list', {}).then(value => setRuns({ state: 'ready', list: Array.isArray(value?.runs) ? value.runs : [] }))
      .catch(error => setRuns({ state: 'error', message: error?.message || '无法读取运行记录' }))
  }, [api])

  useEffect(loadRuns, [loadRuns])

  const openRun = useCallback(id => {
    setActiveId(id)
    setRun({ state: 'loading' })
    setEvidence({ state: 'idle' })
    api('workflow/get', { runId: id })
      .then(value => setRun({ state: 'ready', run: value.run }))
      .catch(error => setRun({ state: 'error', message: error?.message || '无法读取这次运行' }))
  }, [api])

  useEffect(() => { if (initialRunId) openRun(initialRunId) }, [initialRunId, openRun])

  const createRun = useCallback(() => {
    setBusy('create')
    setNotice(null)
    api('workflow/create', {
      templateId: template.id,
      title: template.title,
      preset: template.preset,
      steps: template.steps.map(step => ({
        id: step.id,
        title: step.title,
        instructions: step.instructions,
        ...(step.command ? { command: step.command } : {}),
        ...(step.needs ? { needs: step.needs } : {}),
        ...(step.inputs ? { inputs: step.inputs } : {}),
        ...(step.outputs ? { outputs: step.outputs } : {}),
      })),
    }).then(value => {
      setBusy('')
      setNotice({ tone: 'ok', text: '已创建运行 ' + value.runId })
      loadRuns()
      openRun(value.runId)
    }).catch(error => {
      setBusy('')
      setNotice({ tone: 'bad', text: error?.message || '创建失败' })
    })
  }, [api, template, loadRuns, openRun])

  const execute = useCallback(() => {
    if (!activeId) return
    setBusy('execute')
    setNotice(null)
    api('workflow/execute', { runId: activeId })
      .then(value => {
        setBusy('')
        setNotice({ tone: value.status === 'completed' ? 'ok' : 'bad', text: '执行结束：' + value.status })
        openRun(activeId)
        loadRuns()
      })
      .catch(error => {
        setBusy('')
        setNotice({ tone: 'bad', text: error?.message || '执行失败' })
      })
  }, [api, activeId, openRun, loadRuns])

  const loadEvidence = useCallback(() => {
    if (!activeId) return
    setEvidence({ state: 'loading' })
    Promise.all([
      api('workflow/provenance', { runId: activeId }).catch(error => ({ error })),
      api('workflow/artifacts', { runId: activeId }).catch(error => ({ error })),
    ]).then(([provenance, artifacts]) => {
      setEvidence({ state: 'ready', provenance, artifacts })
    })
  }, [api, activeId])

  const decide = useCallback(decision => {
    if (!activeId) return
    setBusy('decide')
    api('workflow/decision', { runId: activeId, decision })
      .then(() => {
        setBusy('')
        setNotice({ tone: 'ok', text: '已记录决策：' + decision })
        openRun(activeId)
      })
      .catch(error => {
        setBusy('')
        setNotice({ tone: 'bad', text: error?.message || '无法记录决策' })
      })
  }, [api, activeId, openRun])

  const activeRun = run.state === 'ready' ? run.run : null
  const terminal = activeRun && ['completed', 'failed'].includes(activeRun.status)

  return <div className="rw-workflow">
    <section className="rw-wf-block">
      <div className="rw-home-section-head">
        <h2>新建运行</h2>
      </div>
      <div className="rw-wf-create">
        <select value={templateId} onChange={event => setTemplateId(event.target.value)} aria-label="选择模板">
          {WORKFLOW_TEMPLATES.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <button type="button" className="rw-home-primary" onClick={createRun} disabled={busy === 'create'}>
          {busy === 'create' ? '创建中…' : '创建运行'}
        </button>
      </div>
      <p className="rw-home-note">{template.description} · {template.steps.filter(step => step.command).length}/{template.steps.length} 步可自动执行</p>
    </section>

    {notice && <p className={'rw-wf-notice rw-wf-notice--' + notice.tone} role="status">{notice.text}</p>}

    <section className="rw-wf-block">
      <div className="rw-home-section-head">
        <h2>运行记录</h2>
        {runs.state === 'ready' && <span className="rw-home-count">{runs.list.length} 条</span>}
      </div>
      {runs.state === 'loading' && <SkeletonRows rows={3}/>}
      {runs.state === 'error' && <p className="rw-home-error" role="alert">{runs.message}</p>}
      {runs.state === 'ready' && runs.list.length === 0 && <p className="rw-home-note">还没有运行。选一个模板创建第一条。</p>}
      {runs.state === 'ready' && runs.list.length > 0 && <div className="rw-home-runs">
        {runs.list.map(item => <button
          key={item.id}
          type="button"
          className={'rw-home-run' + (item.id === activeId ? ' is-active' : '')}
          onClick={() => openRun(item.id)}
        >
          <span className={'rw-home-dot rw-home-dot--' + (STATUS_TONE[item.status] ?? 'idle')} aria-hidden="true"/>
          <span className="rw-home-run-main">
            <span className="rw-home-run-title">{item.title || item.id}</span>
            <span className="rw-home-run-meta">{STATUS_LABEL[item.status] ?? item.status}</span>
          </span>
          <span className="rw-home-run-time">{(item.steps ?? []).length} 步</span>
        </button>)}
      </div>}
    </section>

    {activeId && <section className="rw-wf-block">
      <div className="rw-home-section-head">
        <h2>运行详情</h2>
        <button type="button" className="rw-home-link" onClick={() => openRun(activeId)}>刷新</button>
      </div>
      {run.state === 'loading' && <SkeletonRows rows={4}/>}
      {run.state === 'error' && <p className="rw-home-error" role="alert">{run.message}</p>}
      {activeRun && <>
        <div className="rw-wf-actions">
          <button type="button" className="rw-home-primary" onClick={execute} disabled={busy === 'execute' || !(activeRun.steps ?? []).some(step => step.command)}>
            {busy === 'execute' ? '执行中…' : '由宿主执行命令步骤'}
          </button>
          <button type="button" className="rw-home-secondary" onClick={loadEvidence}>读取证据</button>
        </div>
        <p className="rw-home-note">
          {(activeRun.steps ?? []).filter(step => step.command).length} 个步骤带命令，由宿主真实执行；
          其余步骤是提示驱动，需要你判断。
        </p>
        <div className="rw-steps">
          {(activeRun.steps ?? []).map(step => <StepRow key={step.id} step={step}/>)}
        </div>

        {evidence.state === 'loading' && <SkeletonRows rows={2}/>}
        {evidence.state === 'ready' && <div className="rw-evidence">
          <div className="rw-evidence-row">
            <span>审计链</span>
            <span>{evidence.provenance?.provenance
              ? (evidence.provenance.verified ? '✓ 校验通过' : '✗ 校验失败')
              : (evidence.provenance?.reason ?? '无 provenance')}</span>
          </div>
          <div className="rw-evidence-row">
            <span>产物</span>
            <span>{(evidence.artifacts?.artifacts ?? []).length} 个已核对
              {(evidence.artifacts?.missing ?? []).length > 0 && ' · 缺失 ' + evidence.artifacts.missing.length + ' 个'}</span>
          </div>
          {(evidence.artifacts?.artifacts ?? []).map(item => <div key={item.path} className="rw-evidence-artifact">
            <code>{item.path}</code><span>{item.bytes} B</span><span className="rw-hash">{item.sha256.slice(0, 12)}</span>
          </div>)}
        </div>}

        <div className="rw-decision">
          <span className="rw-decision-label">人工决策</span>
          {DECISIONS.map(item => <button
            key={item.value}
            type="button"
            className="rw-home-secondary"
            disabled={!terminal || busy === 'decide'}
            onClick={() => decide(item.value)}
          >{item.label}</button>)}
          {!terminal && <span className="rw-home-note">运行结束后才能记录决策。</span>}
        </div>
        {activeRun.decisionGate && <p className="rw-home-note">
          已记录：{activeRun.decisionGate.decision} · {activeRun.decisionGate.actor} · 临床用途 {activeRun.decisionGate.clinicalUse}
        </p>}
      </>}
    </section>}
  </div>
}

export default WorkflowPanel
