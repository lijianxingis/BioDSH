/**
 * Exercise the API end to end against a running server.
 *
 * Not a unit test: it talks to the real process over HTTP, because the failure modes that
 * matter here (a route that 404s, a tenant filter that leaks, a queue that never drains)
 * only exist across the wire.
 */
const base = 'http://127.0.0.1:4174'

async function call(method, path, body) {
  const response = await fetch(base + path, {
    method,
    ...(body ? { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {}),
  })
  const text = await response.text()
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = text }
  return { status: response.status, body: parsed, headers: response.headers }
}

const results = []
const check = (name, ok, detail) => { results.push({ name, ok }); console.log((ok ? 'PASS' : 'FAIL') + '  ' + name.padEnd(40) + (detail ?? '')) }

const health = await call('GET', '/health')
check('health-responds', health.status === 200 && health.body.ok === true)

const executors = await call('GET', '/api/executors')
const ids = (executors.body.executors ?? []).map(e => e.id)
check('executors-listed', ids.length === 5, ids.join(','))

const metricsBefore = await call('GET', '/metrics')
check('metrics-is-text', typeof metricsBefore.body === 'string' && metricsBefore.body.includes('dsh_workbench_uptime_seconds'))

// A plan object rather than a YAML string: this test exercises the API, and quoting
// JavaScript inside YAML inside a template literal is how the previous version broke.
const plan = {
  steps: [{
    id: 'produce',
    title: 'write a file',
    command: 'node -e',
    argv: [process.execPath, '-e', "require('fs').writeFileSync('out.txt','hi')"],
    outputs: [{ path: 'out.txt', minBytes: 2 }],
  }],
}

const submitted = await call('POST', '/api/runs', { plan, title: 'api smoke', templateId: 'smoke' })
check('run-accepted', submitted.status === 202, JSON.stringify(submitted.body).slice(0, 80))
const runId = submitted.body.id

// Wait for the queue to drain.
let final
for (let attempt = 0; attempt < 30; attempt++) {
  await new Promise(r => setTimeout(r, 400))
  const fetched = await call('GET', '/api/runs/' + encodeURIComponent(runId))
  if (fetched.status === 200) { final = fetched; break }
}
check('run-completed', final?.status === 200 && final.body.run?.status === 'completed', final?.body?.run?.status ?? 'not found')
check('provenance-verifies', final?.body?.verified === true)

const provenance = final?.body?.run?.provenance
check('audit-chain-has-events', (provenance?.audit ?? []).length > 0, (provenance?.audit ?? []).length + ' events')
check('artifacts-recorded', (final?.body?.run?.steps ?? []).some(s => (s.artifacts ?? []).length > 0))

const report = await call('GET', '/api/runs/' + encodeURIComponent(runId) + '/report')
check('report-is-html', report.status === 200 && String(report.body).includes('<!doctype html>'))
check('report-states-the-limits', String(report.body).includes('不是临床工具'))

const queue = await call('GET', '/api/queue')
check('queue-shows-the-job', (queue.body.jobs ?? []).some(j => j.id === runId), JSON.stringify(queue.body).slice(0, 90))

const metricsAfter = await call('GET', '/metrics')
const runMetric = /dsh_workbench_runs_total\{status="completed"\} (\d+)/.exec(metricsAfter.body)
check('metrics-counted-the-run', Number(runMetric?.[1] ?? 0) >= 1, 'completed=' + (runMetric?.[1] ?? '0'))

const bundle = await call('POST', '/api/runs/' + encodeURIComponent(runId) + '/bundle')
check('bundle-returned', bundle.status === 201 && bundle.body.bundle?.signature?.value, bundle.body.keyId?.slice(0, 8))
check('bundle-says-self-signed', String(bundle.body.note ?? '').includes('not who owns it'))

const missing = await call('GET', '/api/runs/does-not-exist')
check('unknown-run-is-404', missing.status === 404)

const badRoute = await call('GET', '/nope')
check('unknown-route-is-404', badRoute.status === 404)

const failed = results.filter(r => !r.ok)
console.log('\n' + (results.length - failed.length) + ' passed, ' + failed.length + ' failed')
process.exitCode = failed.length ? 1 : 0
