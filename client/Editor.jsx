import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SkeletonRows } from './Feedback.jsx'

/**
 * A plain text editor for the workspace.
 *
 * Deliberately a textarea rather than a syntax-highlighted editor: this panel is a
 * fallback for quick edits, and the host already offers a real editor through
 * "open in VS Code". Adding CodeMirror here would mean a second editor to maintain for
 * a view that is not the main workflow.
 *
 * Saving is version-checked: if the file changed on disk, the save is refused and the
 * draft is kept, because silently overwriting someone else's edit is worse than an
 * error.
 */
export function Editor({ api }) {
  const [path, setPath] = useState('')
  const [file, setFile] = useState({ state: 'idle' })
  const [text, setText] = useState('')
  const [dirty, setDirty] = useState(false)
  const [notice, setNotice] = useState(null)
  const areaRef = useRef(null)

  const open = useCallback(() => {
    if (!path) return
    setFile({ state: 'loading' })
    setNotice(null)
    api('editor/read', { path })
      .then(value => {
        setFile({ state: 'ready', version: value.version })
        setText(value.text)
        setDirty(false)
      })
      .catch(error => {
        setFile({ state: 'error', message: error?.message || '无法打开文件' })
        setText('')
        setDirty(false)
      })
  }, [api, path])

  const save = useCallback(() => {
    if (file.state !== 'ready') return
    api('editor/save', { path, text, version: file.version })
      .then(value => {
        setFile({ state: 'ready', version: value.version })
        setDirty(false)
        setNotice({ tone: 'ok', text: '已保存' })
      })
      .catch(error => {
        // The draft is kept on purpose: a refused save must not lose the text.
        setNotice({ tone: 'bad', text: (error?.message || '保存失败') + '（草稿已保留）' })
      })
  }, [api, path, text, file])

  useEffect(() => {
    const onKey = event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault()
        save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save])

  return <div className="rw-editor">
    <div className="rw-editor-bar">
      <input
        type="text"
        value={path}
        placeholder="工作区内的文件路径，例如 data/sample.csv"
        onChange={event => setPath(event.target.value)}
        onKeyDown={event => { if (event.key === 'Enter') open() }}
        aria-label="文件路径"
      />
      <button type="button" className="rw-home-secondary" onClick={open}>打开</button>
      <button type="button" className="rw-home-primary" onClick={save} disabled={file.state !== 'ready' || !dirty}>保存</button>
    </div>
    {notice && <p className={'rw-wf-notice rw-wf-notice--' + notice.tone} role="status">{notice.text}</p>}
    {file.state === 'loading' && <SkeletonRows rows={6}/>}
    {file.state === 'error' && <p className="rw-home-error" role="alert">{file.message}</p>}
    <textarea
      ref={areaRef}
      className="rw-editor-area"
      value={text}
      spellCheck={false}
      onChange={event => { setText(event.target.value); setDirty(true) }}
      placeholder="打开一个文件后可以在这里编辑。Ctrl+S 保存。"
      aria-label="文件内容"
    />
    <p className="rw-home-note">
      只保存 UTF-8 文本，上限 2 MiB。文件在磁盘上被改动过时，保存会被拒绝并保留你的草稿。
    </p>
  </div>
}

export default Editor
