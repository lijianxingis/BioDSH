/**
 * Compare a benchmark case's measured metrics against its expectations.
 *
 * A pure comparator: it is given the case and the measured values, and returns a
 * verdict. Keeping it separate from execution is what lets the report distinguish
 * "the plan did not finish" from "the plan finished and the numbers were wrong".
 */

function fail(code, message) {
  const error = new Error(message)
  error.code = code
  throw error
}

/**
 * @param {object} testCase - { id, title, expectedMetrics, tolerance? }
 * @param {object} measured - { [metricName]: number }
 * @param {object} [options]
 * @param {string} [options.runStatus] - the engine's status for the plan
 */
export function evaluateBenchmark(testCase, measured, { runStatus } = {}) {
  if (testCase === null || typeof testCase !== 'object') fail('INVALID_CASE', 'the case must be an object')
  if (typeof testCase.id !== 'string' || !testCase.id) fail('INVALID_CASE', 'the case needs an id')
  if (measured === null || typeof measured !== 'object') fail('INVALID_MEASUREMENT', 'measured metrics must be an object')

  // A plan that did not finish is blocked, not failed: letting a broken pipeline fail the
  // metric comparison would blame the expectation for the breakage.
  if (runStatus !== undefined && runStatus !== 'completed') {
    return Object.freeze({
      caseId: testCase.id,
      title: testCase.title ?? testCase.id,
      status: 'blocked',
      runStatus,
      reason: 'The plan did not complete (' + runStatus + '); no metrics are compared.',
    })
  }

  const expected = testCase.expectedMetrics ?? {}
  const tolerance = Number.isFinite(testCase.tolerance) ? Math.abs(testCase.tolerance) : 0
  const results = []
  for (const [metric, spec] of Object.entries(expected)) {
    const wants = typeof spec === 'number' ? spec : spec?.value
    const actual = measured[metric]
    if (typeof wants !== 'number') {
      results.push({ metric, status: 'invalid', reason: 'the expectation is not a number' })
      continue
    }
    if (typeof actual !== 'number' || !Number.isFinite(actual)) {
      results.push({ metric, status: 'fail', expected: wants, actual: actual ?? null, reason: 'the metric was not measured' })
      continue
    }
    const within = Math.abs(actual - wants) <= tolerance
    results.push({ metric, status: within ? 'pass' : 'fail', expected: wants, actual, tolerance })
  }

  const failed = results.filter(item => item.status === 'fail' || item.status === 'invalid')
  return Object.freeze({
    caseId: testCase.id,
    title: testCase.title ?? testCase.id,
    status: failed.length ? 'fail' : 'pass',
    metrics: Object.freeze(results),
    ...(failed.length ? { failures: Object.freeze(failed.map(item => item.metric)) } : {}),
    clinicalValidationPerformed: false,
    intendedUse: 'research-only',
  })
}

/** Compare a whole suite, and say plainly that a pass is not a scientific claim. */
export function summarizeReports(reports) {
  if (!Array.isArray(reports)) fail('INVALID_REPORT', 'reports must be an array')
  const counts = { pass: 0, fail: 0, blocked: 0 }
  for (const report of reports) {
    if (Object.hasOwn(counts, report.status)) counts[report.status] += 1
  }
  return Object.freeze({
    schemaVersion: 1,
    status: counts.fail ? 'fail' : counts.blocked ? 'blocked' : 'pass',
    counts,
    cases: Object.freeze(reports),
    intendedUse: 'research-only',
    clinicalValidationPerformed: false,
    note: 'A pass means the research metrics were within the stated tolerance. It is not a scientific or clinical validation.',
  })
}
