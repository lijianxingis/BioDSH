import React from 'react'
import { createRoot } from 'react-dom/client'
import { WorkbenchHome } from '../client/Home.jsx'
import { WorkflowPanel } from '../client/WorkflowPanel.jsx'
import { createDemoApi } from './demo-api.js'
import styles from 'workbench-styles'

// The panel's own stylesheet is injected here rather than linked from a file, because the
// build inlines it for the plugin and the site should show exactly the same bytes.
const style = document.createElement('style')
style.textContent = styles
document.head.appendChild(style)

const api = createDemoApi()

createRoot(document.getElementById('app')).render(
  React.createElement(WorkbenchHome, {
    api,
    cwd: 'E:/projects/yeast-cell-cycle',
    onOpenWorkflow: () => { document.getElementById('workflow').scrollIntoView({ behavior: 'smooth' }) },
    onPickTemplate: () => { document.getElementById('workflow').scrollIntoView({ behavior: 'smooth' }) },
    onRefreshFiles: () => { document.getElementById('workflow').scrollIntoView({ behavior: 'smooth' }) },
  }),
)

createRoot(document.getElementById('workflow-app')).render(
  React.createElement(WorkflowPanel, { api, initialRunId: '2026-11-02T08-57-14-252Z-biomni-toolkit' }),
)
