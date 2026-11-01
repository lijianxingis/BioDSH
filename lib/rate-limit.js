/**
 * Submission rate limiting.
 *
 * A cluster with its own submit threshold will reject a burst even when every job fits
 * the scheduler's capacity. Nextflow spells this 'submitRateLimit = "190/60min"', so the
 * parser here accepts that form: operators already have those numbers.
 */

const DURATION = /^(\d+)\s*(ms|s|m|min|h|d)$/i

export function parseDuration(text) {
  const match = DURATION.exec(String(text).trim())
  if (!match) throw new TypeError('duration must look like 60min, 1s, 500ms, 2h or 1d')
  const value = Number(match[1])
  const unit = match[2].toLowerCase()
  const factor = unit === 'ms' ? 1 : unit === 's' ? 1000 : unit === 'm' || unit === 'min' ? 60000 : unit === 'h' ? 3600000 : 86400000
  return value * factor
}

/** Accept either '190/60min' or { limit, windowMs }. */
export function parseRateLimit(spec) {
  if (spec === undefined) return undefined
  if (typeof spec === 'string') {
    const match = /^\s*(\d+)\s*\/\s*(.+)$/.exec(spec)
    if (!match) throw new TypeError('a rate limit string must look like "190/60min"')
    return Object.freeze({ limit: Number(match[1]), windowMs: parseDuration(match[2]), source: 'string' })
  }
  if (spec !== null && typeof spec === 'object') {
    const limit = spec.limit
    const windowMs = spec.windowMs ?? parseDuration(spec.window ?? '60min')
    if (!Number.isInteger(limit) || limit <= 0) throw new TypeError('rate limit must be a positive integer')
    if (!Number.isFinite(windowMs) || windowMs <= 0) throw new TypeError('rate window must be positive')
    return Object.freeze({ limit, windowMs, source: 'object' })
  }
  throw new TypeError('rate limit must be a string or an object')
}

/**
 * Sliding-window limiter. A token bucket refills in a burst at every period boundary,
 * which is the pattern a remote scheduler rejects.
 */
export function createRateLimiter(spec, { now = () => Date.now() } = {}) {
  const config = parseRateLimit(spec)
  const hits = []
  const prune = at => {
    while (hits.length && hits[0] <= at - config.windowMs) hits.shift()
  }
  return Object.freeze({
    config,
    now,
    reserve() {
      const at = now()
      prune(at)
      if (hits.length < config.limit) {
        hits.push(at)
        return Object.freeze({ allowed: true, used: hits.length, available: config.limit - hits.length, waits: 0 })
      }
      const releaseAt = hits[0] + config.windowMs
      return Object.freeze({
        allowed: false,
        used: hits.length,
        available: 0,
        retryAfterMs: Math.max(1, releaseAt - at),
        waits: 0,
      })
    },
    /** Give back a reservation that never turned into a submission. */
    release() {
      hits.pop()
    },
    snapshot() {
      const at = now()
      prune(at)
      return Object.freeze({ limit: config.limit, windowMs: config.windowMs, used: hits.length, available: config.limit - hits.length })
    },
  })
}
