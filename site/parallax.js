/**
 * Layered parallax.
 *
 * Two implementations, chosen by what the browser supports:
 *
 *  - native: animation-timeline: view() with a per-layer translate. The compositor does
 *    the work, and there is no scroll listener at all.
 *  - fallback: one passive scroll listener with a single rAF, because a scroll listener
 *    that writes layout on every event is the classic way to make a page janky.
 *
 * The effect is decorative: every layer is fully legible when it does not move, so a
 * browser without either path loses nothing but the motion.
 */

const SUPPORTS_NATIVE = typeof CSS !== 'undefined'
  && CSS.supports?.('animation-timeline: view()') === true

export function createParallax(layers, { enabled = true } = {}) {
  if (!enabled || !layers.length) return { destroy() {} }
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  if (reduced) return { destroy() {} }

  if (SUPPORTS_NATIVE) {
    // The CSS does the work; this only tags each layer with its speed so the stylesheet
    // can pick it up. Nothing runs per frame.
    for (const { element, speed } of layers) {
      element.style.setProperty('--parallax-speed', String(speed))
      element.classList.add('is-parallax-native')
    }
    return { destroy() { for (const { element } of layers) element.classList.remove('is-parallax-native') } }
  }

  let frame = 0
  let queued = false

  const apply = () => {
    queued = false
    const viewportHeight = window.innerHeight
    for (const { element, speed } of layers) {
      const rect = element.getBoundingClientRect()
      // Distance from the viewport centre, normalised: 0 when centred, ±1 at an edge.
      const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight
      const offset = -progress * speed * 60
      element.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)'
    }
  }

  const onScroll = () => {
    if (queued) return
    queued = true
    frame = requestAnimationFrame(apply)
  }

  apply()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  return {
    destroy() {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    },
  }
}
