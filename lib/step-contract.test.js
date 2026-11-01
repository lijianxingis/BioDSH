import test from 'node:test'
import assert from 'node:assert/strict'
import { defineContract, findMissingInputs, evaluateOutputs } from './step-contract.js'

test('a contract declares inputs, media types and minimum sizes', () => {
  const contract = defineContract({
    inputs: ['sequence-summary.json', { path: 'maybe.csv', required: false }],
    outputs: [
      { path: 'plots/*.png', mediaType: 'image/png', minBytes: 64 },
      { path: 'report.md', mediaType: 'text/markdown', minBytes: 1 },
      { path: 'optional.txt', required: false },
    ],
  })
  assert.equal(contract.inputs.length, 2)
  assert.equal(contract.inputs[1].required, false)
  assert.equal(contract.outputs[0].glob, 'plots/*.png')
  assert.equal(contract.outputs[0].minBytes, 64)
  assert.equal(contract.outputs[0].mediaType, 'image/png')
})

test('a satisfied contract passes', () => {
  const contract = defineContract({ outputs: [{ path: 'a.txt', minBytes: 2 }] })
  const verdict = evaluateOutputs(contract, [{ path: 'a.txt', bytes: 5 }])
  assert.equal(verdict.satisfied, true)
})

test('a missing required output fails', () => {
  const contract = defineContract({ outputs: ['report.md'] })
  const verdict = evaluateOutputs(contract, [])
  assert.equal(verdict.satisfied, false)
  assert.deepEqual(verdict.unsatisfied, ['report.md'])
})

test('an absent optional output is not a failure', () => {
  const contract = defineContract({ outputs: [{ path: 'maybe.png', required: false }] })
  const verdict = evaluateOutputs(contract, [])
  assert.equal(verdict.satisfied, true)
})

test('wildcards match on both sides of the star', () => {
  const contract = defineContract({ outputs: [{ path: 'plots/*.png', minBytes: 1 }] })
  const verdict = evaluateOutputs(contract, [
    { path: 'plots/a.png', bytes: 10 },
    { path: 'plots/a.txt', bytes: 10 },
  ])
  assert.equal(verdict.satisfied, true)
  assert.deepEqual(verdict.verdicts[0].matched, ['plots/a.png'])
})

test('too few bytes fails the declaration', () => {
  const contract = defineContract({ outputs: [{ path: 'a.txt', minBytes: 100 }] })
  assert.equal(evaluateOutputs(contract, [{ path: 'a.txt', bytes: 3 }]).satisfied, false)
})

test('text declared as a PNG is rejected on its bytes, not its name', () => {
  // Found by probing: mediaType was validated when declared and never again, so a step
  // could promise image/png and write text. A declared type that is not enforced is
  // decoration, not a contract.
  const contract = defineContract({ outputs: [{ path: 'x.png', mediaType: 'image/png', minBytes: 5 }] })
  const verdict = evaluateOutputs(contract, [{ path: 'x.png', bytes: 20 }], {
    heads: { 'x.png': Buffer.from('this is text') },
  })
  assert.equal(verdict.satisfied, false)
  assert.match(verdict.verdicts[0].reason, /image\/png/)
})

test('a real PNG satisfies the declaration', () => {
  const contract = defineContract({ outputs: [{ path: 'x.png', mediaType: 'image/png', minBytes: 8 }] })
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])
  const verdict = evaluateOutputs(contract, [{ path: 'x.png', bytes: png.length }], { heads: { 'x.png': png } })
  assert.equal(verdict.satisfied, true)
})

test('a format with no reliable magic number is accepted, not guessed at', () => {
  const contract = defineContract({ outputs: [{ path: 'a.csv', mediaType: 'text/csv', minBytes: 1 }] })
  const verdict = evaluateOutputs(contract, [{ path: 'a.csv', bytes: 10 }], {
    heads: { 'a.csv': Buffer.from('a,b') },
  })
  assert.equal(verdict.satisfied, true)
})

test('paths that escape the workspace are refused', () => {
  for (const bad of ['/etc/passwd', '../escape.csv', '~/secret']) {
    assert.throws(() => defineContract({ inputs: [bad] }), /inside the workspace/)
  }
})

test('a negative minBytes is refused', () => {
  assert.throws(() => defineContract({ outputs: [{ path: 'a.txt', minBytes: -1 }] }), /non-negative/)
})

test('missing required inputs are reported before dispatch', async () => {
  const contract = defineContract({ inputs: ['present.csv', 'absent.csv', { path: 'opt.csv', required: false }] })
  const missing = await findMissingInputs(contract, {
    workspace: '/ws',
    stat: async path => (path.endsWith('present.csv') ? { size: 1 } : undefined),
  })
  assert.deepEqual(missing, ['absent.csv'])
})
