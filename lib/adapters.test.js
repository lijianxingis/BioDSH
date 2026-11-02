import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluateBenchmark, summarizeReports } from './validation.js'
import { parseNextflowTrace, toExecutionRecords, detectAdapter } from './run-adapter.js'

test('a metric within tolerance passes', () => {
  const report = evaluateBenchmark(
    { id: 'c1', title: 'case', expectedMetrics: { bytes: { value: 8 } } },
    { bytes: 8 },
  )
  assert.equal(report.status, 'pass')
})

test('a metric outside tolerance fails and names the metric', () => {
  const report = evaluateBenchmark(
    { id: 'c1', expectedMetrics: { bytes: { value: 8 } }, tolerance: 1 },
    { bytes: 12 },
  )
  assert.equal(report.status, 'fail')
  assert.deepEqual([...report.failures], ['bytes'])
})

test('a plan that did not finish is blocked, not failed', () => {
  // Letting a broken pipeline fail the comparison would blame the expectation for the
  // breakage.
  const report = evaluateBenchmark(
    { id: 'c1', expectedMetrics: { bytes: { value: 8 } } },
    {},
    { runStatus: 'failed' },
  )
  assert.equal(report.status, 'blocked')
  assert.match(report.reason, /did not complete/)
})

test('a missing metric is a failure, not a skip', () => {
  const report = evaluateBenchmark({ id: 'c1', expectedMetrics: { n: { value: 2 } } }, {})
  assert.equal(report.status, 'fail')
})

test('the suite summary never claims clinical validation', () => {
  const summary = summarizeReports([{ status: 'pass' }, { status: 'fail' }])
  assert.equal(summary.status, 'fail')
  assert.equal(summary.intendedUse, 'research-only')
  assert.equal(summary.clinicalValidationPassed, undefined)
  assert.equal(summary.clinicalValidationPerformed, false)
})

const TRACE = [
  'task_id\tname\tstatus\texit\tstart\tcomplete',
  '1\tALIGN\tCOMPLETED\t0\t2026-01-01 10:00:00.000\t2026-01-01 10:05:00.000',
  '2\tCALL\tFAILED\t1\t2026-01-01 10:05:00.000\t2026-01-01 10:06:00.000',
].join('\n')

test('a trace is parsed by header name, not by position', () => {
  const records = parseNextflowTrace(TRACE)
  assert.equal(records.length, 2)
  assert.equal(records[0].taskId, '1')
  assert.equal(records[0].status, 'completed')
  assert.equal(records[1].status, 'failed')
  assert.equal(records[1].exitCode, 1)
})

test('a reordered header still parses correctly', () => {
  const reordered = [
    'status\ttask_id\texit',
    'COMPLETED\t9\t0',
  ].join('\n')
  const records = parseNextflowTrace(reordered)
  assert.equal(records[0].taskId, '9')
  assert.equal(records[0].status, 'completed')
})

test('a file that is not a trace is refused', () => {
  assert.throws(() => parseNextflowTrace('hello\nworld'), /does not look like a trace/)
  assert.throws(() => parseNextflowTrace(''), /empty/)
})

test('a timestamp with no zone is marked as assumed UTC', () => {
  // Silently shifting by the local offset would move every event by hours.
  const records = toExecutionRecords(parseNextflowTrace(TRACE))
  assert.equal(records[0].submittedTimeZone, 'assumed-utc')
})

test('engine-reported records are never marked host-verified', () => {
  const records = toExecutionRecords(parseNextflowTrace(TRACE))
  for (const record of records) {
    assert.equal(record.verified, false)
    assert.equal(record.provenance, 'engine-reported')
  }
})

test('an adapter can be detected without parsing', () => {
  assert.equal(detectAdapter(TRACE).id, 'nextflow')
  assert.equal(detectAdapter('not a trace'), undefined)
})
