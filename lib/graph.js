/**
 * Draw the plan.
 *
 * A workflow a reader cannot see is a workflow they will not trust. Two outputs: a
 * Graphviz DOT file for tooling, and an inline SVG that needs no renderer - because the
 * point of a report is that it survives being emailed.
 *
 * Layout is a layered assignment: a step sits one row below its deepest dependency. That
 * is the same order the engine executes in, so the picture matches the run.
 */

function layersOf(plan) {
  const depth = new Map()
  const visiting = new Set()
  const resolve = id => {
    if (depth.has(id)) return depth.get(id)
    if (visiting.has(id)) return 0
    visiting.add(id)
    const step = plan.steps.find(item => item.id === id)
    const needs = step?.needs ?? []
    const value = needs.length ? 1 + Math.max(...needs.map(resolve)) : 0
    visiting.delete(id)
    depth.set(id, value)
    return value
  }
  for (const step of plan.steps) resolve(step.id)
  return depth
}

const escapeDot = text => String(text).replace(/"/g, '\\"')
const escapeXml = text => String(text).replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]))

export function toDot(plan, { title = 'workflow' } = {}) {
  const lines = ['digraph "' + escapeDot(title) + '" {', '  rankdir=TB;', '  node [shape=box, style=rounded, fontname="Helvetica"];']
  for (const step of plan.steps) {
    const labels = [step.label ?? step.id]
    if (step.contract?.outputs?.length) labels.push(step.contract.outputs.length + ' out')
    lines.push('  "' + escapeDot(step.id) + '" [label="' + escapeDot(labels.join('\\n')) + '"];')
  }
  for (const step of plan.steps) {
    for (const need of step.needs) lines.push('  "' + escapeDot(need) + '" -> "' + escapeDot(step.id) + '";')
  }
  lines.push('}')
  return lines.join('\n') + '\n'
}

/**
 * An inline SVG. No fonts beyond the system stack and no scripts: a report that needs a
 * runtime to render is not a report.
 */
export function toSvg(plan, { width = 520, boxHeight = 34, gapY = 22, statuses = {} } = {}) {
  const depth = layersOf(plan)
  const rows = Math.max(...[...depth.values()]) + 1
  const byRow = Array.from({ length: rows }, () => [])
  for (const step of plan.steps) byRow[depth.get(step.id)].push(step.id)

  const colWidth = width / Math.max(1, ...byRow.map(row => row.length))
  const height = rows * (boxHeight + gapY) + gapY
  const positions = new Map()
  for (let row = 0; row < rows; row++) {
    byRow[row].forEach((id, index) => {
      positions.set(id, {
        x: colWidth * index + colWidth / 2,
        y: gapY + row * (boxHeight + gapY) + boxHeight / 2,
      })
    })
  }

  const pad = 8
  const parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height + '" width="' + width + '" height="' + height + '" role="img" aria-label="workflow graph">']
  parts.push('<defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#9aa2b1"/></marker></defs>')

  // Edges first so boxes cover their own arrowheads.
  for (const step of plan.steps) {
    const to = positions.get(step.id)
    for (const need of step.needs) {
      const from = positions.get(need)
      if (!from || !to) continue
      const fromY = from.y + boxHeight / 2 - 2
      const toY = to.y - boxHeight / 2 + 2
      const mid = (fromY + toY) / 2
      parts.push('<path d="M' + from.x + ',' + fromY + ' C' + from.x + ',' + mid + ' ' + to.x + ',' + mid + ' ' + to.x + ',' + toY + '" fill="none" stroke="#c4c9d2" stroke-width="1.4" marker-end="url(#arrow)"/>')
    }
  }

  const tones = { completed: '#0f7b5f', failed: '#c0392b', skipped: '#8a9099' }
  for (const step of plan.steps) {
    const at = positions.get(step.id)
    const x = at.x - colWidth / 2 + pad
    const boxWidth = colWidth - pad * 2
    const label = step.label ?? step.id
    const status = statuses[step.id]
    const stroke = tones[status] ?? '#d5d9e0'
    parts.push('<rect x="' + x + '" y="' + (at.y - boxHeight / 2) + '" width="' + boxWidth + '" height="' + boxHeight + '" rx="7" fill="#ffffff" stroke="' + stroke + '" stroke-width="' + (status ? 2 : 1) + '"/>')
    const text = label.length > 22 ? label.slice(0, 21) + '…' : label
    parts.push('<text x="' + at.x + '" y="' + (at.y + 4) + '" text-anchor="middle" font-family="-apple-system, Segoe UI, sans-serif" font-size="11" fill="#0f1115">' + escapeXml(text) + '</text>')
    const outputs = step.contract?.outputs?.length ?? 0
    if (outputs) {
      parts.push('<text x="' + at.x + '" y="' + (at.y + 15) + '" text-anchor="middle" font-family="-apple-system, Segoe UI, sans-serif" font-size="8.5" fill="#8a9099">' + outputs + ' output' + (outputs === 1 ? '' : 's') + '</text>')
    }
  }
  parts.push('</svg>')
  return parts.join('\n')
}

export { layersOf }
