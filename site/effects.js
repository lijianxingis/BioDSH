/**
 * Background effects for the site.
 *
 * Technique taken from the Codrops shader-background article: an SDF dot grid, a mouse
 * trail texture sampled to highlight the dots under the pointer, and smoothstep masks so
 * the grid fades out rather than ending at an edge.
 *
 * Implemented on a 2D canvas rather than with three.js. The article's version is a WebGL
 * fragment shader; for a dot grid at this scale the drawing primitives are the same
 * (distance to a grid cell, smoothstep on that distance) and the result is a few
 * kilobytes instead of a renderer. The trade is that this cannot do per-pixel effects
 * that a shader can; a dot grid is not one of them.
 *
 * Everything here respects prefers-reduced-motion: the grid still draws, it just stops
 * following the pointer.
 */

const DEFAULTS = {
  spacing: 26,
  radius: 1.6,
  baseColour: [0, 0, 0],
  baseAlpha: 0.10,
  highlightColour: [47, 95, 208],
  highlightAlpha: 0.95,
  influenceRadius: 150,
  fadeFrom: 0.45,
  fadeTo: 1.0,
}

/** Smooth 0..1 ramp, matching GLSL smoothstep. */
function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

export function createDotField(canvas, options = {}) {
  const config = { ...DEFAULTS, ...options }
  const context = canvas.getContext('2d', { alpha: true })
  if (!context) return { destroy() {} }

  const pointer = { x: -9999, y: -9999, active: false }
  // The trail is a small decaying field rather than a single point: a highlight that
  // snaps to the cursor looks like a cursor, not like a surface responding to touch.
  const trail = new Map()
  let frame = 0
  let width = 0
  let height = 0
  let dpr = 1
  let reduced = false

  const media = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : undefined
  const applyReduced = () => { reduced = media?.matches === true }
  applyReduced()
  media?.addEventListener?.('change', applyReduced)

  function resize() {
    const rect = canvas.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = rect.width
    height = rect.height
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function key(x, y) {
    return Math.round(x / config.spacing) + ':' + Math.round(y / config.spacing)
  }

  function draw() {
    context.clearRect(0, 0, width, height)

    // Decay the trail so a stationary pointer settles instead of staying lit forever.
    for (const [id, value] of trail) {
      const next = value * 0.92
      if (next < 0.01) trail.delete(id)
      else trail.set(id, next)
    }

    const cols = Math.ceil(width / config.spacing) + 1
    const rows = Math.ceil(height / config.spacing) + 1

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * config.spacing + config.spacing / 2
        const y = row * config.spacing + config.spacing / 2

        // Distance to the pointer, then smoothstep: this is the shader's influence mask.
        const distance = pointer.active
          ? Math.hypot(x - pointer.x, y - pointer.y)
          : Number.POSITIVE_INFINITY
        const proximity = 1 - smoothstep(0, config.influenceRadius, distance)
        const accumulated = trail.get(key(x, y)) ?? 0
        const influence = Math.max(proximity, accumulated)

        // Vertical fade so the grid does not end at a hard edge.
        const verticalFade = 1 - smoothstep(config.fadeFrom, config.fadeTo, y / Math.max(1, height))

        const alpha = config.baseAlpha * verticalFade + config.highlightAlpha * influence * verticalFade
        if (alpha <= 0.005) continue

        const r = config.radius * (1 + influence * 1.8)
        const [br, bg, bb] = config.baseColour
        const [hr, hg, hb] = config.highlightColour
        const mix = Math.min(1, influence)
        context.beginPath()
        context.arc(x, y, r, 0, Math.PI * 2)
        context.fillStyle = 'rgba(' + [
          Math.round(br + (hr - br) * mix),
          Math.round(bg + (hg - bg) * mix),
          Math.round(bb + (hb - bb) * mix),
        ].join(',') + ',' + alpha.toFixed(3) + ')'
        context.fill()
      }
    }
  }

  function loop() {
    draw()
    frame = requestAnimationFrame(loop)
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect()
    pointer.x = event.clientX - rect.left
    pointer.y = event.clientY - rect.top
    pointer.active = true
    trail.set(key(pointer.x, pointer.y), 1)
  }

  function onPointerLeave() {
    pointer.active = false
  }

  function onResize() {
    resize()
    draw()
  }

  resize()
  if (reduced) {
    // Static grid: the effect is decorative, and chasing a pointer is exactly what the
    // preference asks to be spared.
    draw()
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', onPointerLeave, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    frame = requestAnimationFrame(loop)
  }

  return {
    destroy() {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
      media?.removeEventListener?.('change', applyReduced)
    },
  }
}

/**
 * Count a number up when it scrolls into view.
 *
 * Uses IntersectionObserver rather than a scroll listener: the browser already knows when
 * an element becomes visible, and recomputing that on every scroll event is work the
 * compositor can do for free.
 */
export function countOnView(element, { duration = 900, format = value => String(value) } = {}) {
  const target = Number(element.dataset.count ?? element.textContent ?? 0)
  if (!Number.isFinite(target)) return () => {}
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  if (reduced) { element.textContent = format(target); return () => {} }

  let frame = 0
  let startedAt = 0
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      observer.disconnect()
      startedAt = performance.now()
      const step = now => {
        const progress = Math.min(1, (now - startedAt) / duration)
        // easeOutCubic: fast start, gentle settle.
        const eased = 1 - Math.pow(1 - progress, 3)
        element.textContent = format(Math.round(target * eased))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }
  }, { threshold: 0.4 })
  observer.observe(element)
  return () => { observer.disconnect(); cancelAnimationFrame(frame) }
}
