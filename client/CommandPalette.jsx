import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Command palette.
 *
 * The shortcut alone is not a feature: there is a visible trigger, and every command
 * listed here is also reachable without it. Focus returns to where it was on close, so
 * opening the palette never loses the user's place.
 */

function fuzzyScore(text, query) {
  if (!query) return 1
  const haystack = text.toLowerCase()
  const needle = query.toLowerCase()
  if (haystack.includes(needle)) return 100 - haystack.indexOf(needle)
  // Subsequence match: "wf" finds "workflow".
  let index = 0
  let score = 0
  for (const char of needle) {
    const found = haystack.indexOf(char, index)
    if (found === -1) return 0
    score += found === index ? 2 : 1
    index = found + 1
  }
  return score
}

export function CommandPalette({ commands, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const matches = useMemo(() => {
    const scored = commands
      .map(command => ({
        command,
        score: Math.max(fuzzyScore(command.label, query), ...(command.keywords ?? []).map(word => fuzzyScore(word, query))),
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
    return scored.map(item => item.command)
  }, [commands, query])

  useEffect(() => { setActive(0) }, [query])

  const run = useCallback(command => {
    onClose()
    command.run()
  }, [onClose])

  const onKeyDown = event => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
    if (event.key === 'Enter') { event.preventDefault(); if (matches[active]) run(matches[active]); return }
    // Arrow keys wrap, so holding down never dead-ends at an edge.
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(index => matches.length ? (index + 1) % matches.length : 0); return }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive(index => matches.length ? (index - 1 + matches.length) % matches.length : 0) }
  }

  return <div className="rw-palette-backdrop" onMouseDown={onClose}>
    <div className="rw-palette" role="dialog" aria-modal="true" aria-label="命令面板" onMouseDown={event => event.stopPropagation()}>
      <input
        ref={inputRef}
        className="rw-palette-input"
        value={query}
        onChange={event => setQuery(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="搜索命令…"
        aria-label="搜索命令"
      />
      <div className="rw-palette-list" ref={listRef} role="listbox">
        {matches.length === 0 && <p className="rw-palette-empty">没有匹配的命令</p>}
        {matches.map((command, index) => <button
          key={command.id}
          type="button"
          role="option"
          aria-selected={index === active}
          className={'rw-palette-item' + (index === active ? ' is-active' : '')}
          onMouseEnter={() => setActive(index)}
          onClick={() => run(command)}
        >
          <span>{command.label}</span>
          {command.hint && <span className="rw-palette-hint">{command.hint}</span>}
        </button>)}
      </div>
    </div>
  </div>
}

export default CommandPalette
