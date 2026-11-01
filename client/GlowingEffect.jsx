import React, { memo, useCallback, useEffect, useRef } from 'react'

/**
 * Glowing border that follows the pointer.
 *
 * Ported from the registry component (aceternity style). The interaction model is kept
 * exactly: the glow is active only outside an inner inactive zone and inside the
 * element's bounds plus a proximity margin; the gradient angle follows the pointer's
 * angle from the centre; the work is throttled to one rAF per pointer move.
 *
 * What changed, and why:
 * - no Tailwind: this project ships hand-written CSS with a token system, and adding a
 *   utility framework for one component means two styling systems to maintain;
 * - no motion/react: a CSS transition on a custom property replaces it;
 * - no cn(): a three-line join;
 * - reduced motion: a glow that chases the pointer is exactly what that preference asks
 *   to be spared, so it renders at rest.
 *
 * The component is decorative: aria-hidden, and carries no information.
 */

const joinClass = (...values) => values.filter(Boolean).join(' ')

const GlowingEffect = memo(function GlowingEffect({
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  variant = 'default',
  glow = false,
  className = '',
  movementDuration = 2,
  borderWidth = 1,
  disabled = false,
}) {
  const containerRef = useRef(null)
  const lastPosition = useRef({ x: 0, y: 0 })
  const frameRef = useRef(0)
  const reducedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => { reducedRef.current = query.matches }
    apply()
    query.addEventListener?.('change', apply)
    return () => query.removeEventListener?.('change', apply)
  }, [])

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }, [])

  const handleMove = useCallback(event => {
    const element = containerRef.current
    if (!element) return
    // One rAF per move: pointer events fire far faster than the compositor can use them.
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return
      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const pointer = event?.clientX !== undefined
        ? { x: event.clientX, y: event.clientY }
        : lastPosition.current
      if (event?.clientX !== undefined) lastPosition.current = pointer

      const centerX = left + width * 0.5
      const centerY = top + height * 0.5
      const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY)
      if (distance < 0.5 * Math.min(width, height) * inactiveZone) {
        containerRef.current.style.setProperty('--active', '0')
        return
      }
      const isActive =
        pointer.x > left - proximity && pointer.x < left + width + proximity &&
        pointer.y > top - proximity && pointer.y < top + height + proximity
      containerRef.current.style.setProperty('--active', isActive ? '1' : '0')
      if (!isActive) return
      let angle = (180 * Math.atan2(pointer.y - centerY, pointer.x - centerX)) / Math.PI + 90
      angle = angle < 0 ? angle + 360 : angle
      containerRef.current.style.setProperty('--start', String(angle))
      if (reducedRef.current) containerRef.current.style.setProperty('--active', '0')
    })
  }, [inactiveZone, proximity])

  useEffect(() => {
    if (disabled) return
    const onScroll = () => handleMove()
    document.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', handleMove)
    }
  }, [disabled, handleMove])

  if (disabled) return null

  const gradient = variant === 'white'
    ? 'repeating-conic-gradient(from 236.84deg at 50% 50%, #ffffff, #ffffff calc(25% / var(--repeating-conic-gradient-times)))'
    : 'radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),' +
      'radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),' +
      'radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),' +
      'radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),' +
      'repeating-conic-gradient(from 236.84deg at 50% 50%, #dd7bbb 0%,' +
      ' #d79f1e calc(25% / var(--repeating-conic-gradient-times)),' +
      ' #5a922c calc(50% / var(--repeating-conic-gradient-times)),' +
      ' #4c7894 calc(75% / var(--repeating-conic-gradient-times)),' +
      ' #dd7bbb calc(100% / var(--repeating-conic-gradient-times)))'

  return <div
    ref={containerRef}
    className={joinClass('rw-glow', className)}
    style={{
      '--blur': blur + 'px',
      '--spread': spread,
      '--start': '0',
      '--active': '0',
      '--glowingeffect-border-width': borderWidth + 'px',
      '--repeating-conic-gradient-times': '5',
      '--movement-duration': movementDuration + 's',
      '--gradient': gradient,
    }}
    aria-hidden="true"
  >
    <div className={joinClass('rw-glow-inner', glow && 'rw-glow-inner--on')}/>
  </div>
})

export { GlowingEffect }
export default GlowingEffect
