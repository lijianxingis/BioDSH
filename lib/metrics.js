/**
 * Prometheus metrics.
 *
 * An exposition format, not a metrics framework: it renders the counters this process
 * keeps into the text format a scraper reads. Deliberately no histograms with dynamic
 * labels - a label whose values come from user input is how a metrics endpoint turns into
 * an unbounded memory leak.
 */

function label(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\\n/g, '\\n')
}

export function createMetrics({ prefix = 'dsh_workbench' } = {}) {
  const counters = new Map()
  const gauges = new Map()
  const startedAt = Date.now()

  const key = (name, labels) => name + '{' + Object.entries(labels ?? {}).sort().map(([k, v]) => k + '="' + label(v) + '"').join(',') + '}'

  return Object.freeze({
    increment(name, labels, by = 1) {
      const id = key(name, labels)
      counters.set(id, (counters.get(id) ?? 0) + by)
    },
    observe(name, labels, value) {
      const id = key(name, labels)
      const current = gauges.get(id)
      gauges.set(id, { value, last: value, count: (current?.count ?? 0) + 1 })
    },
    reset() { counters.clear(); gauges.clear() },

    /** The text exposition format, version 0.0.4. */
    render() {
      const lines = []
      const seen = new Set()
      const type = (name, kind) => {
        if (seen.has(name)) return
        seen.add(name)
        lines.push('# TYPE ' + prefix + '_' + name + ' ' + kind)
      }
      const counts = new Map()
      for (const id of counters.keys()) {
        const name = id.slice(0, id.indexOf('{'))
        counts.set(name, (counts.get(name) ?? 0) + 1)
      }
      for (const [name, count] of counts) type(name, 'counter')
      for (const [id, value] of counters) lines.push(prefix + '_' + id + ' ' + value)

      const gaugeNames = new Set()
      for (const id of gauges.keys()) gaugeNames.add(id.slice(0, id.indexOf('{')))
      for (const name of gaugeNames) type(name, 'gauge')
      for (const [id, entry] of gauges) lines.push(prefix + '_' + id + ' ' + entry.last)

      // Uptime is computed at scrape time rather than stored, so it is always current.
      lines.push('# TYPE ' + prefix + '_uptime_seconds gauge')
      lines.push(prefix + '_uptime_seconds ' + Math.round((Date.now() - startedAt) / 1000))
      return lines.join('\n') + '\n'
    },
  })
}

/** Record one finished run into a metrics instance. */
export function recordRun(metrics, result) {
  const status = result?.status ?? 'unknown'
  metrics.increment('runs_total', { status })
  for (const step of result?.steps ?? []) {
    metrics.increment('steps_total', { status: step.status })
    if (typeof step.exitCode === 'number') {
      metrics.observe('step_exit_code', { executor: step.executor ?? 'local' }, step.exitCode)
    }
    for (const artifact of step.outputs ?? []) {
      metrics.increment('artifacts_total')
      metrics.increment('artifact_bytes_total', undefined, artifact.bytes ?? 0)
    }
  }
}
