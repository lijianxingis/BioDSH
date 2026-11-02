const token = new URLSearchParams(location.search).get('token') ?? ''
const headers = token ? { authorization: 'Bearer ' + token } : {}

let failures = 0

function setLiveness(ok, message) {
  document.getElementById('liveness').className = 'dot' + (ok ? '' : ' dot--stale')
  document.getElementById('status-line').textContent = message
}

function showError(message) {
  const box = document.getElementById('error')
  box.textContent = message
  box.hidden = false
}

function pillClass(state) {
  if (state === 'failed' || state === 'cancelled') return 'pill pill--failed'
  if (state === 'finished') return 'pill pill--finished'
  if (state === 'running') return 'pill pill--running'
  return 'pill pill--queued'
}

async function cancel(id) {
  try {
    const response = await fetch('/api/queue/' + encodeURIComponent(id), { method: 'DELETE', headers })
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body.error ?? response.statusText)
    }
    await refresh()
  } catch (error) {
    showError('取消失败：' + error.message)
  }
}

async function refresh() {
  try {
    const response = await fetch('/api/queue', { headers })
    if (!response.ok) {
      if (response.status === 401) throw new Error('未提供有效令牌（在 URL 加 ?token=…）')
      throw new Error('HTTP ' + response.status)
    }
    const data = await response.json()
    failures = 0
    document.getElementById('error').hidden = true
    setLiveness(true, '每 3 秒刷新 · 最后更新 ' + new Date().toLocaleTimeString())
    document.getElementById('running').textContent = data.active ?? 0
    document.getElementById('queued').textContent = data.queued ?? 0
    document.getElementById('total').textContent = (data.jobs ?? []).length

    const body = document.getElementById('rows')
    body.textContent = ""
    if (!data.jobs || !data.jobs.length) {
      const row = document.createElement('tr')
      const cell = document.createElement('td')
      cell.colSpan = 4
      cell.className = 'empty'
      cell.textContent = '还没有作业。用 POST /api/runs 提交一个。'
      row.appendChild(cell)
      body.appendChild(row)
      return
    }
    for (const job of data.jobs) {
      const row = document.createElement('tr')
      const id = document.createElement('td')
      id.className = 'mono'
      id.textContent = job.id
      const state = document.createElement('td')
      const badge = document.createElement('span')
      badge.className = pillClass(job.state)
      badge.textContent = job.state
      state.appendChild(badge)
      if (job.state === 'finished' && job.status) {
        const detail = document.createElement('span')
        detail.className = 'mono'
        detail.style.marginLeft = '8px'
        detail.textContent = job.status
        state.appendChild(detail)
      }
      const title = document.createElement('td')
      title.textContent = job.title ?? '—'
      const action = document.createElement('td')
      const button = document.createElement('button')
      button.textContent = '取消'
      button.disabled = job.state !== 'queued'
      button.addEventListener('click', () => cancel(job.id))
      action.appendChild(button)
      row.append(id, state, title, action)
      body.appendChild(row)
    }
  } catch (error) {
    failures += 1
    setLiveness(false, "无法连接（连续 " + failures + " 次）")
    showError(error.message)
  }
}

refresh()
setInterval(refresh, 3000)
