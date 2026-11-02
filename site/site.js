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

import { createDotField, countOnView } from './effects.js'
import { createParallax } from './parallax.js'

const api = createDemoApi()

// The hero background. Decorative only: it carries no information, and the same page is
// readable with it switched off.
const canvas = document.getElementById('dot-field')
if (canvas) createDotField(canvas, { spacing: 28, radius: 1.5, influenceRadius: 170 })

// Layered parallax: each section moves at its own rate so the page has depth rather
// than reading as a flat stack of blocks.
createParallax([
  { element: document.querySelector('.hero .lede'), speed: 0.35 },
  { element: document.querySelector('.stage'), speed: -0.18 },
  ...[...document.querySelectorAll('section.block')].map((element, index) => ({
    element,
    speed: index % 2 === 0 ? 0.12 : -0.1,
  })),
])

// Numbers count up when they enter the viewport. The value is in the markup already, so
// a reader without script still sees the number.
for (const element of document.querySelectorAll('[data-count]')) countOnView(element)

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
