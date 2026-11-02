import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { WorkbenchHome } from './Home.jsx'
import { WorkflowPanel } from './WorkflowPanel.jsx'
import { Editor } from './Editor.jsx'
import { CommandPalette } from './CommandPalette.jsx'
import 'workbench-styles'

/**
 * The workbench panel.
 *
 * The overview is the landing view because a first-time visitor needs to know what this
 * panel is for before being handed an empty editor.
 */

const VIEWS = [
  { id: 'home', label: '概览' },
  { id: 'editor', label: '代码与文件' },
  { id: 'workflow', label: '研究工作流' },
]

/**
 * Switch views inside a view transition when the browser supports it.
 *
 * The transition is progressive: without startViewTransition the state change still
 * happens, it just happens without the cross-fade. Making it load-bearing would mean an
 * older browser sees nothing when a tab is clicked.
 *
 * flushSync is required rather than optional: React batches state updates, so without it
 * the browser would snapshot the old DOM and the new one in the same paint, and the
 * transition would have nothing to animate between.
 */
function useViewTransition() {
  return useCallback(update => {
    if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function') {
      update()
      return
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
    if (reduced) { update(); return }
    document.startViewTransition(() => {
      flushSync(update)
    })
  }, [])
}

function useApi(remote) {
  return useCallback((action, payload = {}) => {
    if (typeof remote !== 'function') return Promise.reject(new Error('the host connection is not available'))
    return Promise.resolve(remote('research-workbench', { action, ...payload }))
      .then(result => {
        if (result && result.ok === false) {
          const error = new Error(result.error?.message ?? 'the request failed')
          error.code = result.error?.code
          throw error
        }
        return result?.value ?? result
      })
  }, [remote])
}

function Workbench({ remote, cwd }) {
  const api = useApi(remote)
  const transition = useViewTransition()
  const [view, setViewState] = useState('home')
  const setView = useCallback(next => transition(() => setViewState(next)), [transition])
  const [palette, setPalette] = useState(false)
  const [templateId, setTemplateId] = useState(null)
  const [runId, setRunId] = useState(null)
  const restoreFocus = useRef(null)

  const openWorkflow = useCallback(id => {
    if (id) setRunId(id)
    setView('workflow')
  }, [setView])

  const pickTemplate = useCallback(template => {
    setTemplateId(template?.id ?? null)
    setRunId(null)
    setView('workflow')
  }, [setView])

  const commands = useMemo(() => [
    { id: 'view-home', label: '打开概览', hint: '视图', keywords: ['home', 'overview', '概览'], run: () => setView('home') },
    { id: 'view-editor', label: '打开代码与文件', hint: '视图', keywords: ['editor', 'file', '代码', '文件'], run: () => setView('editor') },
    { id: 'view-workflow', label: '打开研究工作流', hint: '视图', keywords: ['workflow', 'wf', '工作流'], run: () => setView('workflow') },
    { id: 'new-run', label: '新建一条运行', hint: '工作流', keywords: ['new', 'create', '新建'], run: () => setView('workflow') },
    { id: 'palette', label: '命令面板', hint: '⌘K', keywords: ['command', 'palette'], run: () => setPalette(true) },
  ], [])

  // The shortcut must not fire while someone is typing in the editor.
  useEffect(() => {
    const onKey = event => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return
      const target = event.target
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) return
      event.preventDefault()
      // Remember where focus was, so closing the palette does not lose the user's place.
      restoreFocus.current = document.activeElement
      setPalette(open => !open)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closePalette = useCallback(() => {
    setPalette(false)
    if (restoreFocus.current && typeof restoreFocus.current.focus === 'function') restoreFocus.current.focus()
  }, [])

  return <div className="rw-shell">
    <nav className="rw-nav" aria-label="工作台视图">
      {VIEWS.map(item => <button
        key={item.id}
        type="button"
        className={'rw-nav-item' + (view === item.id ? ' is-active' : '')}
        aria-current={view === item.id ? 'page' : undefined}
        onClick={() => setView(item.id)}
      >{item.label}</button>)}
      <button type="button" className="rw-nav-kbd" onClick={() => { restoreFocus.current = document.activeElement; setPalette(true) }} title="命令面板">
        ⌘K
      </button>
    </nav>
    {/* A view-transition-name on the body makes the browser cross-fade the content
        rather than the whole page, so the nav stays put while the panel changes. */}
    <div className="rw-body" style={{ viewTransitionName: 'workbench-view' }}>
      {view === 'home' && <WorkbenchHome
        api={api}
        cwd={cwd}
        onOpenWorkflow={openWorkflow}
        onPickTemplate={pickTemplate}
        onRefreshFiles={() => setView('editor')}
      />}
      {view === 'editor' && <Editor api={api}/>}
      {view === 'workflow' && <WorkflowPanel api={api} initialTemplateId={templateId} initialRunId={runId}/>}
    </div>
    {palette && <CommandPalette commands={commands} onClose={closePalette}/>}
  </div>
}

export function mount(options = {}) {
  const container = options.container ?? document.getElementById('root')
  if (!container) throw new Error('the workbench needs a mount container')
  const root = createRoot(container)
  root.render(<Workbench remote={options.remote} cwd={options.cwd}/>)
  return () => root.unmount()
}

export default mount
