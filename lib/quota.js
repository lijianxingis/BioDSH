/**
 * Rolling-window quotas with three backpressure strategies.
 *
 * A fixed bucket lets a caller spend the whole budget at 59:59 and again at 00:00, which
 * is exactly the burst pattern a quota exists to prevent. The window slides.
 */

export function createQuotaGate({ meters = [], now = () => Date.now() } = {}) {
  const configs = meters.map(meter => {
    if (!Number.isFinite(meter.limit) || meter.limit <= 0) throw new TypeError('quota limit must be positive')
    const windowMs = meter.windowMs ?? 3600000
    if (!Number.isFinite(windowMs) || windowMs <= 0) throw new TypeError('quota windowMs must be positive')
    return { name: String(meter.name ?? 'default'), limit: meter.limit, windowMs, usage: [] }
  })

  const prune = (config, at) => {
    // <= rather than <: an entry exactly one window old is out of the window. With <, a
    // waiter slept a whole extra window at the boundary.
    config.usage = config.usage.filter(entry => entry.at > at - config.windowMs)
  }

  const check = (request = {}) => {
    const at = now()
    let retryAfterMs = 0
    for (const config of configs) {
      prune(config, at)
      const used = config.usage.reduce((sum, entry) => sum + entry.amount, 0)
      const available = config.limit - used
      if (available >= request.amount) continue
      const oldest = config.usage[0]
      const releaseAt = oldest ? oldest.at + config.windowMs : at + config.windowMs
      retryAfterMs = Math.max(retryAfterMs, Math.max(1, releaseAt - at))
    }
    if (retryAfterMs === 0) return Object.freeze({ allowed: true })
    return Object.freeze({ allowed: false, retryAfterMs, reason: 'quota exhausted' })
  }

  return Object.freeze({
    now,
    check,
    record(request = {}) {
      const at = now()
      for (const config of configs) config.usage.push({ at, amount: request.amount ?? 1 })
    },
    usage() {
      const at = now()
      return configs.map(config => {
        prune(config, at)
        return Object.freeze({
          name: config.name,
          limit: config.limit,
          windowMs: config.windowMs,
          used: config.usage.reduce((sum, entry) => sum + entry.amount, 0),
        })
      })
    },
  })
}

/**
 * Apply a quota verdict, optionally waiting or degrading.
 *
 * The default is to refuse: a system that queues forever while making no progress looks
 * healthy and is not.
 */
export async function applyBackpressure(gate, request, { strategy = 'reject', deadlineMs = 60000, sleep = ms => new Promise(r => setTimeout(r, ms)) } = {}) {
  if (strategy === 'reject') {
    const verdict = gate.check(request)
    if (verdict.allowed) gate.record(request)
    return verdict.allowed ? Object.freeze({ allowed: true }) : verdict
  }
  if (strategy === 'degrade') {
    const half = { ...request, amount: Math.max(1, Math.floor(request.amount / 2)) }
    const verdict = gate.check(half)
    if (verdict.allowed) { gate.record(half); return Object.freeze({ allowed: true, degraded: true }) }
    return verdict
  }
  // 'wait': re-read the remaining delay on every pass rather than reusing the first one.
  const clock = gate.now ?? (() => Date.now())
  const startedAt = clock()
  for (;;) {
    const verdict = gate.check(request)
    if (verdict.allowed) { gate.record(request); return Object.freeze({ allowed: true, waited: true }) }
    const elapsed = clock() - startedAt
    const remaining = deadlineMs - elapsed
    if (remaining <= 0) return Object.freeze({ allowed: false, reason: 'deadline reached while waiting for quota' })
    await sleep(Math.min(verdict.retryAfterMs, remaining))
  }
}
