/**
 * A declarative workflow format.
 *
 * The engine takes JavaScript objects, which is fine for a programmer and useless for a
 * bioinformatician who writes YAML all day. This parses a small YAML subset - enough for
 * a workflow and no more - into the same plan object.
 *
 * Deliberately not a general YAML parser: a full one is a large dependency and a large
 * attack surface (anchors, custom tags), and a workflow file needs maps, lists, strings
 * and numbers. Anything outside that is refused with a line number rather than guessed.
 */

const INDENT = /^\s*/

function stripComment(line) {
  // A '#' inside quotes is content, not a comment.
  let quote
  for (let index = 0; index < line.length; index++) {
    const char = line[index]
    if (quote) { if (char === quote) quote = undefined; continue }
    if (char === '"' || char === "'") { quote = char; continue }
    if (char === '#') return line.slice(0, index)
  }
  return line
}

function scalar(text) {
  const value = text.trim()
  if (value === '' ) return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null' || value === '~') return null
  if (/^-?\d+$/.test(value)) return Number(value)
  if (/^-?\d*\.\d+$/.test(value)) return Number(value)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  // Inline list: [a, b, c]
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim()
    if (!inner) return []
    return inner.split(',').map(item => scalar(item))
  }
  // Inline map: {a: 1, b: 2}
  if (value.startsWith('{') && value.endsWith('}')) {
    const inner = value.slice(1, -1).trim()
    if (!inner) return {}
    const out = {}
    for (const pair of inner.split(',')) {
      const at = pair.indexOf(':')
      if (at === -1) throw new Error('inline map entry is missing a colon: ' + pair.trim())
      out[pair.slice(0, at).trim()] = scalar(pair.slice(at + 1))
    }
    return out
  }
  return value
}

/**
 * Parse the subset.
 *
 * @returns {{value: unknown, lines: number}}
 */
export function parseDsl(text) {
  if (typeof text !== 'string') throw new TypeError('the workflow source must be a string')
  const raw = text.split(/\r?\n/)
  const lines = raw.map((line, index) => ({
    number: index + 1,
    indent: INDENT.exec(line)[0].length,
    text: stripComment(line).trimEnd(),
  })).filter(line => line.text.trim() !== '')

  if (!lines.length) throw new Error('the workflow is empty')

  let cursor = 0

  function parseBlock(indent) {
    const first = lines[cursor]
    const isList = first.text.trimStart().startsWith('- ')
    const container = isList ? [] : {}

    while (cursor < lines.length) {
      const line = lines[cursor]
      if (line.indent < indent) break
      if (line.indent > indent) {
        throw new Error('line ' + line.number + ': unexpected indentation')
      }

      if (isList) {
        if (!line.text.trimStart().startsWith('- ')) break
        const rest = line.text.trimStart().slice(2).trim()
        cursor++
        if (rest === '') {
          container.push(parseBlock(lines[cursor]?.indent ?? indent + 2))
          continue
        }
        // '- key: value' starts a map whose remaining keys are indented further.
        if (/^[A-Za-z_][\w-]*\s*:/.test(rest)) {
          const entry = {}
          const at = rest.indexOf(':')
          entry[rest.slice(0, at).trim()] = scalar(rest.slice(at + 1))
          const childIndent = lines[cursor]?.indent ?? indent + 2
          while (cursor < lines.length && lines[cursor].indent === childIndent && !lines[cursor].text.trimStart().startsWith('- ')) {
            const nested = lines[cursor]
            const colon = nested.text.indexOf(':')
            if (colon === -1) throw new Error('line ' + nested.number + ': expected "key: value"')
            const key = nested.text.slice(0, colon).trim()
            const valueText = nested.text.slice(colon + 1).trim()
            cursor++
            if (valueText === '') {
              entry[key] = parseBlock(lines[cursor]?.indent ?? childIndent + 2)
            } else {
              entry[key] = scalar(valueText)
            }
          }
          container.push(entry)
          continue
        }
        container.push(scalar(rest))
        continue
      }

      const colon = line.text.indexOf(':')
      if (colon === -1) throw new Error('line ' + line.number + ': expected "key: value"')
      const key = line.text.slice(0, colon).trim()
      const valueText = line.text.slice(colon + 1).trim()
      cursor++
      if (valueText === '') {
        const next = lines[cursor]
        if (!next || next.indent <= indent) { container[key] = null; continue }
        container[key] = parseBlock(next.indent)
      } else {
        container[key] = scalar(valueText)
      }
    }
    return container
  }

  const value = parseBlock(lines[0].indent)
  return { value, lines: raw.length }
}

/** Turn a parsed document into the shape definePlan expects. */
export function planFromDocument(document) {
  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    throw new Error('a workflow document must be a map at the top level')
  }
  if (!Array.isArray(document.steps) || !document.steps.length) {
    throw new Error('a workflow needs a non-empty steps list')
  }
  return {
    ...(document.backend ? { backend: document.backend } : {}),
    ...(document.image ? { image: document.image } : {}),
    steps: document.steps.map((step, index) => {
      if (step === null || typeof step !== 'object') {
        throw new Error('step ' + (index + 1) + ' must be a map')
      }
      if (typeof step.id !== 'string') {
        throw new Error('step ' + (index + 1) + ' needs an id')
      }
      return {
        id: step.id,
        title: step.title ?? step.id,
        command: step.command,
        ...(step.argv ? { argv: step.argv } : {}),
        ...(step.needs ? { needs: [].concat(step.needs) } : {}),
        ...(step.inputs ? { inputs: normalizeList(step.inputs) } : {}),
        ...(step.outputs ? { outputs: normalizeList(step.outputs) } : {}),
        ...(step.timeoutMs ? { timeoutMs: step.timeoutMs } : {}),
      }
    }),
  }
}

function normalizeList(value) {
  if (!Array.isArray(value)) return value ? [value] : []
  return value.map(item => (typeof item === 'string' ? { path: item } : item))
}

/** Parse and convert in one step. */
export function workflowFromDsl(text) {
  return planFromDocument(parseDsl(text).value)
}

export const EXAMPLE = `backend: process
steps:
  - id: inspect
    title: 扫描输入
    command: "python scripts/inspect_sequences.py"
    outputs:
      - path: sequence-summary.json
        mediaType: application/json
        minBytes: 20
  - id: report
    title: 汇总
    command: "python scripts/write_report.py"
    needs: [inspect]
    inputs:
      - path: sequence-summary.json
        required: true
`
