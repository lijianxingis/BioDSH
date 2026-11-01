/**
 * Capacity-aware scheduler.
 *
 * Resources are declared names, not measured usage: this scheduler does not watch CPU
 * or memory, and the docs say so. What it does guarantee is that a step declaring more
 * than a worker has is never placed there — silently running on insufficient capacity
 * would be worse than refusing.
 */

export function defineScheduling({ priority = 0, cost } = {}) {
  if (!Number.isInteger(priority) || priority < 0 || priority > 100) throw new TypeError('priority must be an integer 0-100')
  const cpu = cost?.cpu ?? 1
  const memoryMb = cost?.memoryMb ?? 512
  if (!Number.isFinite(cpu) || cpu <= 0) throw new TypeError('cost.cpu must be positive')
  if (!Number.isFinite(memoryMb) || memoryMb <= 0) throw new TypeError('cost.memoryMb must be positive')
  return Object.freeze({ priority, cost: Object.freeze({ cpu, memoryMb }) })
}

export function defineCapacity({ cpu = 4, memoryMb = 8192, maxSlots = 4 } = {}) {
  return Object.freeze({ cpu, memoryMb, maxSlots })
}

export function createScheduler(workers) {
  if (!Array.isArray(workers) || !workers.length) throw new TypeError('workers must be a non-empty array')
  const pools = workers.map(worker => {
    const capacity = worker.capacity ?? defineCapacity(worker)
    return {
      id: String(worker.id),
      capacity,
      remaining: { cpu: capacity.cpu, memoryMb: capacity.memoryMb },
      active: 0,
      maxSlots: capacity.maxSlots ?? 1,
      quarantined: false,
      reason: undefined,
    }
  })
  const fits = (pool, cost) => pool.remaining.cpu >= cost.cpu && pool.remaining.memoryMb >= cost.memoryMb

  return Object.freeze({
    acquire(workerId, cost) {
      const pool = pools.find(item => item.id === workerId)
      if (!pool || pool.quarantined) return undefined
      if (pool.active >= pool.maxSlots || !fits(pool, cost)) return undefined
      pool.remaining.cpu -= cost.cpu
      pool.remaining.memoryMb -= cost.memoryMb
      pool.active += 1
      return workerId
    },

    release(workerId, cost) {
      const pool = pools.find(item => item.id === workerId)
      if (!pool) return
      pool.remaining.cpu = Math.min(pool.capacity.cpu, pool.remaining.cpu + cost.cpu)
      pool.remaining.memoryMb = Math.min(pool.capacity.memoryMb, pool.remaining.memoryMb + cost.memoryMb)
      pool.active = Math.max(0, pool.active - 1)
    },

    quarantine(workerId, reason) {
      const pool = pools.find(item => item.id === workerId)
      if (!pool || pool.quarantined) return false
      pool.quarantined = true
      pool.reason = reason ?? 'quarantined'
      return true
    },

    /** Choose the best worker for a step, by remaining capacity then id. */
    pick(cost) {
      const candidates = pools
        .filter(pool => !pool.quarantined && pool.active < pool.maxSlots && fits(pool, cost))
        // Prefer the worker with the most headroom so a large step is not crowded out by
        // many small ones on the same host. Ties break on id, so the choice is stable.
        .sort((a, b) => (b.remaining.cpu - a.remaining.cpu) || a.id.localeCompare(b.id))
      return candidates[0]?.id
    },

    snapshot() {
      return pools.map(pool => Object.freeze({
        id: pool.id,
        capacity: pool.capacity,
        remaining: { ...pool.remaining },
        active: pool.active,
        quarantined: pool.quarantined,
        ...(pool.reason === undefined ? {} : { reason: pool.reason }),
      }))
    },
  })
}

export function createQueue(plan) {
  const state = new Map(plan.order.map((id, index) => [id, { id, index, status: 'pending' }]))
  const byId = new Map(plan.steps.map(step => [step.id, step]))
  const priorityOf = id => byId.get(id)?.scheduling?.priority ?? 0

  return Object.freeze({
    mark(id, status) {
      const entry = state.get(id)
      if (entry) entry.status = status
    },
    statusOf(id) { return state.get(id)?.status },
    pending() { return [...state.values()].filter(entry => entry.status === 'pending').map(entry => entry.id) },
    blocked() {
      return [...state.values()]
        .filter(entry => entry.status === 'pending')
        .filter(entry => byId.get(entry.id).needs.some(need => ['failed', 'skipped', 'cancelled'].includes(state.get(need)?.status)))
        .map(entry => entry.id)
    },
    /** Runnable now: every dependency completed, this step still pending. */
    runnable() {
      return [...state.values()]
        .filter(entry => entry.status === 'pending')
        .filter(entry => byId.get(entry.id).needs.every(need => state.get(need)?.status === 'completed'))
        // Highest priority first, then plan order, so the schedule is deterministic.
        .sort((a, b) => (priorityOf(b.id) - priorityOf(a.id)) || (a.index - b.index))
        .map(entry => entry.id)
    },
  })
}

export function simulateSchedule(plan, workers) {
  const scheduler = createScheduler(workers)
  const queue = createQueue(plan)
  const placed = []
  const byId = new Map(plan.steps.map(step => [step.id, step]))
  for (;;) {
    let progressed = false
    for (const id of queue.runnable()) {
      const cost = byId.get(id).scheduling?.cost ?? { cpu: 1, memoryMb: 512 }
      const workerId = scheduler.pick(cost)
      if (workerId === undefined) continue
      scheduler.acquire(workerId, cost)
      scheduler.release(workerId, cost)
      queue.mark(id, 'completed')
      placed.push({ id, workerId })
      progressed = true
    }
    if (!progressed) break
  }
  return placed
}
