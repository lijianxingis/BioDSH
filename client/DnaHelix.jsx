import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * A double helix drawn from real geometry, carrying the audit chain.
 *
 * Each rung is one audit event; the two strands are the two hashes that link an event to
 * its predecessor. It is drawn from mathematics (x = cos, y = t, z = sin) rather than a
 * repeating background, so it can be projected at any phase and sorted by depth.
 *
 * Accessibility: the canvas is decorative and aria-hidden; the same information is in
 * the audit list beside it, so nothing is lost without script.
 */

const COLOURS = ['#2f5fd0', '#0f7b5f', '#a06a00', '#7c4dd6', '#c0392b']

function project(t, phase, radius, width, height, turn) {
  const angle = t * Math.PI * 2 * turn + phase
  return {
    x: width / 2 + Math.cos(angle) * radius,
    y: t * height,
    z: Math.sin(angle),
  }
}

export function DnaHelix({ events = [], height = 260, turns = 3.4, selected = null, onSelect }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const phaseRef = useRef(0)
  const hoverRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener?.('change', apply)
    return () => query.removeEventListener?.('change', apply)
  }, [])

  const rungs = useMemo(() => {
    const count = Math.max(events.length, 1)
    return Array.from({ length: count }, (_, index) => ({
      t: count === 1 ? 0.5 : index / (count - 1),
      index,
      event: events[index] ?? null,
      colour: COLOURS[index % COLOURS.length],
      verified: events[index]?.verified !== false,
    }))
  }, [events])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const styles = getComputedStyle(canvas)
    const ink = styles.getPropertyValue('--dna-ink').trim() || '#0f1115'
    const faint = styles.getPropertyValue('--dna-faint').trim() || 'rgba(0,0,0,.12)'
    const accent = styles.getPropertyValue('--dna-accent').trim() || '#2f5fd0'
    const radius = Math.min(width * 0.34, 128)
    const pad = 18
    const innerHeight = height - pad * 2

    const drawRung = (rung, phase) => {
      const a = project(rung.t, phase, radius, width, innerHeight, turns)
      const b = project(rung.t, phase + Math.PI, radius, width, innerHeight, turns)
      const depth = (a.z + b.z) / 2
      const active = hoverRef.current === rung.index || selected === rung.index
      ctx.globalAlpha = active ? 1 : 0.35 + ((depth + 1) / 2) * 0.65
      ctx.strokeStyle = rung.verified ? rung.colour : faint
      ctx.lineWidth = active ? 3 : 1.6
      ctx.beginPath()
      ctx.moveTo(a.x, a.y + pad)
      ctx.lineTo(b.x, b.y + pad)
      ctx.stroke()
      for (const point of [a, b]) {
        const r = active ? 5.5 : 3.2 + ((point.z + 1) / 2) * 1.8
        ctx.beginPath()
        ctx.arc(point.x, point.y + pad, r, 0, Math.PI * 2)
        ctx.fillStyle = rung.verified ? rung.colour : faint
        ctx.fill()
        if (active) {
          ctx.beginPath()
          ctx.arc(point.x, point.y + pad, r + 4, 0, Math.PI * 2)
          ctx.strokeStyle = accent
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    // The phase is passed in rather than read from the closure: it changes every frame,
    // and reading a stale value made the strands drift out of step with the rungs.
    const strand = (basePhase, offset) => {
      ctx.beginPath()
      for (let i = 0; i <= 120; i++) {
        const p = project(i / 120, basePhase + offset, radius, width, innerHeight, turns)
        if (i === 0) ctx.moveTo(p.x, p.y + pad)
        else ctx.lineTo(p.x, p.y + pad)
      }
      ctx.strokeStyle = ink
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.35
      ctx.stroke()
      ctx.globalAlpha = 1
    }
    strand(phaseRef.current, 0)
    strand(phaseRef.current, Math.PI)

    const ordered = [...rungs].sort((left, right) =>
      Math.sin(left.t * Math.PI * 2 * turns + phaseRef.current) - Math.sin(right.t * Math.PI * 2 * turns + phaseRef.current))
    for (const rung of ordered) drawRung(rung, phaseRef.current)
  }, [height, rungs, selected, turns])

  useEffect(() => {
    const tick = () => {
      if (!reduced) phaseRef.current += 0.006
      draw()
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [draw, reduced])

  const handleMove = event => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const radius = Math.min(canvas.clientWidth * 0.34, 128)
    const pad = 18
    const innerHeight = height - pad * 2
    let best = null
    let bestDistance = Infinity
    for (const rung of rungs) {
      const a = project(rung.t, phaseRef.current, radius, canvas.clientWidth, innerHeight, turns)
      const b = project(rung.t, phaseRef.current + Math.PI, radius, canvas.clientWidth, innerHeight, turns)
      const distance = Math.hypot(x - (a.x + b.x) / 2, y - (a.y + b.y) / 2 + pad)
      if (distance < bestDistance) { bestDistance = distance; best = rung.index }
    }
    const next = bestDistance < 26 ? best : null
    if (next !== hoverRef.current) { hoverRef.current = next; setHovered(next) }
  }

  const activeEvent = hovered !== null ? events[hovered] : selected !== null ? events[selected] : null

  return <div className="rw-dna">
    <canvas
      ref={canvasRef}
      className="rw-dna-canvas"
      style={{ height }}
      onMouseMove={handleMove}
      onMouseLeave={() => { hoverRef.current = null; setHovered(null) }}
      onClick={() => { if (hovered !== null && onSelect) onSelect(hovered) }}
      aria-hidden="true"
    />
    <div className="rw-dna-caption" aria-live="polite">
      {activeEvent
        ? <><code>{activeEvent.type ?? 'event'}</code> <span>{activeEvent.label ?? ''}</span></>
        : <span className="rw-dna-hint">{reduced ? '审计链 · 已停止动画' : '审计链 · 每条横档是一个事件'}</span>}
    </div>
  </div>
}

export default DnaHelix
