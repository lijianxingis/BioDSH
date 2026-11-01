import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { WorkbenchHome } from './Home.jsx'
import 'workbench-styles'

/**
 * The workbench panel.
 *
 * Three views: the overview (default), the editor, and the workflow panel. The overview
 * is the landing view because a first-time visitor needs to know what this panel is for
 * before being handed an empty editor.
 */

const VIEWS = [
  { id: 'home', label: '概览' },
  { id: 'editor', label: '代码与文件' },
  { id: 'workflow', label: '研究工作流' },
]

function useApi(remote) {
  return useCallback((action, payload = {}) => {
    if (typeof remote !== 'function') return Promise.reject(new Error('the host connection is not available'))
    return remote('research-workbench', { action, ...payload })
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
  const [view, setView] = useState('home')
  const [pickedTemplate, setPickedTemplate] = useState(null)

  const openWorkflow = useCallback(id => {
    setView('workflow')
    if (id) setPickedTemplate({ runId: id })
  }, [])

  const pickTemplate = useCallback(template => {
    setPickedTemplate({ templateId: template?.id })
    setView('workflow')
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
    </nav>
    <div className="rw-body">
      {view === 'home' && <WorkbenchHome
        api={api}
        cwd={cwd}
        onOpenWorkflow={openWorkflow}
        onPickTemplate={pickTemplate}
        onRefreshFiles={() => setView('editor')}
      />}
      {view === 'editor' && <div className="rw-placeholder">
        <p>编辑器视图。宿主未提供文件接口时，这里显示说明而不是一个空编辑器。</p>
      </div>}
      {view === 'workflow' && <div className="rw-placeholder">
        <p>{pickedTemplate?.runId
          ? '打开运行 ' + pickedTemplate.runId + '。'
          : pickedTemplate?.templateId
            ? '已选择模板 ' + pickedTemplate.templateId + '。'
            : '研究工作流视图。'}</p>
      </div>}
    </div>
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
