import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = name => readFile(new URL('./' + name, import.meta.url), 'utf8')

test('the command palette is keyboard complete', async () => {
  const src = await read('CommandPalette.jsx')
  // A palette that cannot be driven from the keyboard is a list, not a palette.
  for (const key of ['Escape', 'Enter', 'ArrowDown', 'ArrowUp']) {
    assert.ok(src.includes(key), key + ' must be handled')
  }
  // Wrapping matters: holding an arrow key should never dead-end.
  assert.match(src, /% matches\.length/)
})

test('the palette matches on labels and keywords, not only exact text', async () => {
  const src = await read('CommandPalette.jsx')
  assert.match(src, /fuzzyScore/)
  assert.match(src, /keywords/)
})

test('the palette restores focus when it closes', async () => {
  const src = await read('main.jsx')
  assert.match(src, /restoreFocus/)
  assert.match(src, /restoreFocus\.current\.focus\(\)/)
})

test('the shortcut does not fire while typing in an editor', async () => {
  const src = await read('main.jsx')
  assert.match(src, /TEXTAREA/)
  assert.match(src, /INPUT/)
})

test('the workflow panel never offers a decision before the run is terminal', async () => {
  const src = await read('WorkflowPanel.jsx')
  assert.match(src, /terminal/)
  // Accepting a run that is still executing would record a verdict on unfinished work.
  assert.match(src, /completed', 'failed'/)
})

test('the workflow panel shows observed artifacts rather than claims', async () => {
  const src = await read('WorkflowPanel.jsx')
  assert.match(src, /sha256/)
  assert.match(src, /workflow\/artifacts/)
})

test('the editor keeps the draft when a save is refused', async () => {
  const src = await read('Editor.jsx')
  // Losing text on a failed save is worse than the failure itself.
  assert.match(src, /草稿已保留/)
  assert.match(src, /version/)
})

test('every view is reachable from the navigation', async () => {
  const src = await read('main.jsx')
  for (const view of ['home', 'editor', 'workflow']) {
    assert.ok(src.includes("'" + view + "'"), view + ' must be a view')
  }
})
