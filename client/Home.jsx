import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { WORKFLOW_TEMPLATES } from './workflow-templates.js'
import { GlowingEffect } from './GlowingEffect.jsx'
import { DnaHelix } from './DnaHelix.jsx'
import ASSETS from 'workbench-assets'

/**
 * The workspace overview.
 *
 * Direction: "the product performs" — software is most convincing while it is doing its
 * job. The first screen is the audit chain itself, drawn as a double helix where each
 * rung is a real event from this workspace, plus the three counts that decide whether a
 * run can be trusted.
 *
 * Brand constraint: colours come from tokens sampled off the DSH host, with a dark
 * variant keyed off the host's own marker. No invented metrics: every number here is
 * either counted from the server's answer or not shown.
 */

const STATUS_LABEL = { completed: '已完成', failed: '失败', running: '运行中', pending: '待开始' }
const STATUS_TONE = { completed: 'ok', failed: 'bad', running: 'busy', pending: 'idle' }

const FRAGMENTS = [
  {
    src: ASSETS['fragment-steps.png'],
    alt: '一次真实运行的三个步骤，每步显示退出码、产物名、字节数与哈希前缀',
    title: '每一步都是真实进程',
    body: '不是模型描述它做了什么。宿主执行每个步骤，记录退出码、产物路径与字节数。',
    width: 560, height: 232,
  },
  {
    src: ASSETS['fragment-verify.png'],
    alt: '契约检查结果：输入存在、产物落地、媒体类型匹配',
    title: '契约不满足就判失败',
    body: '退出码 0 但没写出声明的产物，步骤仍然算失败。输入缺失时命令根本不执行。',
    width: 520, height: 230,
  },
  {
    src: ASSETS['fragment-audit-chain.png'],
    alt: '审计链事件列表，每条带前一条的哈希前缀',
    title: '审计链可离线自校验',
    body: '带 previousHash 与 eventHash 的链。改动任何一条，整链校验失败。',
    width: 560, height: 300,
  },
  {
    src: ASSETS['fragment-parallel.png'],
    alt: '三个并行步骤的调度示意与实测耗时对比',
    title: '并行需要你明确授权',
    body: '默认串行。声明写入范围冲突时拒绝并行，而不是赌一把。',
    width: 540, height: 250,
  },
]

function relativeTime(iso) {
  if (typeof iso !== 'string') return ''
  const then = Date.parse(iso)
  if (!Number.isFinite(then)) return ''
  const seconds = Math.round((Date.now() - then) / 1000)
  if (seconds < 60) return '刚刚'
  if (seconds < 3600) return Math.floor(seconds / 60) + ' 分钟前'
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' 小时前'
  return Math.floor(seconds / 86400) + ' 天前'
}

/** Turn the run list into the events the helix draws. Real runs only. */
function chainEvents(runs) {
  const events = []
  for (const run of runs) {
    const steps = Array.isArray(run.steps) ? run.steps : []
    for (const step of steps) {
      events.push({
        type: step.status === 'completed' ? 'step-completed' : step.status === 'failed' ? 'step-failed' : 'step',
        label: (run.title || run.id) + ' · ' + (step.title || step.id),
        verified: step.status !== 'failed',
      })
    }
    if (!steps.length) events.push({ type: 'run-created', label: run.title || run.id, verified: true })
  }
  return events.slice(0, 24)
}

function Capability({ item, index }) {
  return <div className={'rw-cap' + (index % 2 === 1 ? ' rw-cap--flip' : '')}>
    <div className="rw-cap-copy">
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </div>
    <figure className="rw-cap-shot">
      <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy"/>
    </figure>
  </div>
}

function RunRow({ run, onOpen }) {
  const tone = STATUS_TONE[run.status] ?? 'idle'
  const steps = Array.isArray(run.steps) ? run.steps : []
  const done = steps.filter(step => step.status === 'completed').length
  return <button type="button" className="rw-home-run" onClick={() => onOpen(run.id)}>
    <span className={'rw-home-dot rw-home-dot--' + tone} aria-hidden="true"/>
    <span className="rw-home-run-main">
      <span className="rw-home-run-title">{run.title || '未命名运行'}</span>
      <span className="rw-home-run-meta">
        {STATUS_LABEL[run.status] ?? run.status}
        {steps.length > 0 && ' · ' + done + '/' + steps.length + ' 步'}
        {run.templateId && ' · ' + run.templateId}
      </span>
    </span>
    <span className="rw-home-run-time">{relativeTime(run.updatedAt || run.createdAt)}</span>
  </button>
}

function TemplateCard({ template, onPick }) {
  const scripted = template.steps.filter(step => step.command).length
  const total = template.steps.length
  return <button type="button" className="rw-home-card" onClick={() => onPick(template)}>
    {/* proximity kept below the card gap so a neighbour's pointer does not light this
        card; spread widened so the visible arc is unmistakable when it does. */}
    <GlowingEffect spread={70} glow disabled={false} proximity={18} inactiveZone={0.12} borderWidth={1.5}/>
    <span className="rw-home-card-top">
      <span className="rw-home-badge">{template.badge}</span>
      <span className="rw-home-card-arrow" aria-hidden="true">→</span>
    </span>
    <span className="rw-home-card-title">{template.title}</span>
    <span className="rw-home-card-desc">{template.description}</span>
    <span className="rw-home-card-foot">
      {scripted > 0
        ? <><span className="rw-home-pill rw-home-pill--ok">{scripted} 步自动执行</span>{total > scripted && <span className="rw-home-pill">{total - scripted} 步需人工</span>}</>
        : <span className="rw-home-pill">全部人工推进</span>}
    </span>
  </button>
}

export function WorkbenchHome({ api, onOpenWorkflow, onPickTemplate, onRefreshFiles, cwd }) {
  const [runs, setRuns] = useState({ state: 'loading' })
  const [selected, setSelected] = useState(null)

  const loadRuns = useCallback(() => {
    setRuns({ state: 'loading' })
    api('workflow/list', {}).then(value => {
      const list = Array.isArray(value?.runs) ? value.runs : []
      const sorted = [...list].sort((a, b) => String(b.updatedAt ?? b.createdAt ?? '').localeCompare(String(a.updatedAt ?? a.createdAt ?? '')))
      setRuns({ state: 'ready', list: sorted })
    }).catch(error => setRuns({ state: 'error', message: error?.message || '无法读取运行记录' }))
  }, [api])

  useEffect(loadRuns, [loadRuns])

  const recent = runs.state === 'ready' ? runs.list.slice(0, 4) : []
  const isEmpty = runs.state === 'ready' && runs.list.length === 0
  const events = useMemo(() => (runs.state === 'ready' ? chainEvents(runs.list) : []), [runs])

  // Counted here, from the list the server returned. Not invented.
  const totals = useMemo(() => {
    if (runs.state !== 'ready') return null
    let steps = 0
    let failed = 0
    for (const run of runs.list) {
      const list = Array.isArray(run.steps) ? run.steps : []
      steps += list.length
      failed += list.filter(step => step.status === 'failed').length
    }
    return { runs: runs.list.length, steps, failed }
  }, [runs])

  return <div className="rw-home">
    <section className="rw-hero">
      <div className="rw-hero-copy">
        <h1>{isEmpty ? '开始第一个研究流程' : '继续你的研究'}</h1>
        <p className="rw-hero-lede">
          {isEmpty
            ? '这是研究工作台：每一步由宿主真实执行，产物按字节哈希登记，审计链可离线自校验。'
            : '研究工作台：选一个模板开始新的运行，或从最近的记录继续。'}
        </p>
        <div className="rw-hero-actions">
          <button type="button" className="rw-home-primary" onClick={() => onOpenWorkflow()}>打开工作流</button>
          {cwd && <button type="button" className="rw-home-secondary" onClick={onRefreshFiles}>浏览文件</button>}
        </div>
        {cwd && <p className="rw-home-cwd" title={cwd}><code>{cwd}</code></p>}
      </div>

      <div className="rw-hero-stage">
        <div className="rw-hero-stage-head">
          <span>审计链</span>
          <span className="rw-hero-stage-count">{runs.state === 'ready' ? events.length + ' 个事件' : '读取中'}</span>
        </div>
        {runs.state === 'loading' && <p className="rw-home-note">正在读取运行记录…</p>}
        {runs.state === 'error' && <p className="rw-home-error" role="alert">{runs.message}</p>}
        {runs.state === 'ready' && (
          events.length > 0
            ? <DnaHelix events={events} height={232} turns={2.6} selected={selected} onSelect={setSelected}/>
            : <div className="rw-hero-stage-empty">
              <p>还没有事件。完成第一个模板后，每一步都会成为这条链上的一条横档。</p>
            </div>
        )}
        {totals && <dl className="rw-hero-metrics">
          <div><dt>运行</dt><dd>{totals.runs}</dd></div>
          <div><dt>步骤</dt><dd>{totals.steps}</dd></div>
          <div><dt>失败步骤</dt><dd className={totals.failed > 0 ? 'is-bad' : ''}>{totals.failed}</dd></div>
        </dl>}
      </div>
    </section>

    <section className="rw-home-section rw-capabilities">
      <div className="rw-home-section-head">
        <h2>它实际做什么</h2>
        <span className="rw-home-count">{FRAGMENTS.length} 项</span>
      </div>
      <p className="rw-home-note">下面是这个工作台自己产出的界面片段，不是示意图。</p>
      {FRAGMENTS.map((item, index) => <Capability key={item.title} item={item} index={index}/>)}
    </section>

    <section className="rw-home-section">
      <div className="rw-home-section-head">
        <h2>研究模板</h2>
        <span className="rw-home-count">{WORKFLOW_TEMPLATES.length} 个</span>
      </div>
      <p className="rw-home-note">标注了哪些步骤会真实执行、哪些需要你判断。</p>
      <div className="rw-home-cards">
        {WORKFLOW_TEMPLATES.map(template => (
          <TemplateCard key={template.id} template={template} onPick={onPickTemplate}/>
        ))}
      </div>
    </section>

    <section className="rw-home-section">
      <div className="rw-home-section-head">
        <h2>最近的运行</h2>
        {runs.state === 'ready' && runs.list.length > 0 && (
          <button type="button" className="rw-home-link" onClick={() => onOpenWorkflow()}>
            查看全部 {runs.list.length} 条
          </button>
        )}
      </div>
      {runs.state === 'error' && <p className="rw-home-error" role="alert">{runs.message}</p>}
      {runs.state === 'ready' && recent.length > 0 && (
        <div className="rw-home-runs">
          {recent.map(run => <RunRow key={run.id} run={run} onOpen={id => onOpenWorkflow(id)}/>)}
        </div>
      )}
      {isEmpty && (
        <div className="rw-home-empty">
          <p>还没有运行记录。完成第一个模板后，每一步的状态与证据会出现在这里。</p>
          <button type="button" className="rw-home-secondary" onClick={() => onPickTemplate(WORKFLOW_TEMPLATES[0])}>
            用「{WORKFLOW_TEMPLATES[0]?.title ?? '第一个模板'}」开始
          </button>
        </div>
      )}
    </section>
  </div>
}
