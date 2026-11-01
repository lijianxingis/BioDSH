import test from 'node:test'
import assert from 'node:assert/strict'
import { WORKFLOW_TEMPLATES, INTERPRETER_PLACEHOLDER } from './workflow-templates.js'

test('every executable step uses the interpreter placeholder, never a drive path', () => {
  let withCommand = 0
  for (const template of WORKFLOW_TEMPLATES) {
    for (const step of template.steps) {
      if (!step.command) continue
      withCommand++
      assert.ok(step.command.includes(INTERPRETER_PLACEHOLDER), template.id + '/' + step.id + ' must use the placeholder')
      assert.equal(/[A-Za-z]:[\\/]/.test(step.command), false, template.id + '/' + step.id + ' must not hard-code a drive path')
    }
  }
  assert.ok(withCommand >= 3, 'at least three steps should be executable')
})

test('a dependency names a step that exists', () => {
  for (const template of WORKFLOW_TEMPLATES) {
    const ids = new Set(template.steps.map(step => step.id))
    for (const step of template.steps) {
      for (const need of step.needs ?? []) {
        assert.ok(ids.has(need), template.id + '/' + step.id + ' depends on a missing step ' + need)
      }
    }
  }
})

test('the medical template never gains a command', () => {
  // Its whole premise is that it does not read files or execute anything.
  const medical = WORKFLOW_TEMPLATES.find(template => template.preset === 'medical-metadata')
  assert.ok(medical)
  for (const step of medical.steps) {
    assert.equal(step.command, undefined, 'medical step ' + step.id + ' must stay prompt-driven')
  }
})

test('every template declares an id, a badge and a description', () => {
  for (const template of WORKFLOW_TEMPLATES) {
    assert.ok(template.id && template.badge && template.title && template.description)
  }
})
