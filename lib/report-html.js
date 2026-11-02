/**
 * A single-file HTML report.
 *
 * JSON is the record; this is what a person opens. Rules, because a report is easy to
 * make misleading:
 *  - every number comes from the run record, nothing is recomputed here;
 *  - the limits are printed, not omitted, so a screenshot of the report still carries
 *    them;
 *  - no script tag: the file opens from a USB stick, an email attachment, or a browser
 *    with everything blocked.
 */
import { toSvg } from './graph.js'

const escape = text => String(text ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]))
const bytes = value => (value < 1024 ? value + ' B' : (value / 1024).toFixed(1) + ' KiB')

export function renderHtmlReport({ run, plan, provenance, verified, bundleSha256 } = {}) {
  if (!run) throw new TypeError('a report needs a run')
  const steps = Array.isArray(run.steps) ? run.steps : []
  const artifacts = steps.flatMap(step => step.artifacts ?? [])
  const statuses = Object.fromEntries(steps.map(step => [step.id, step.status]))
  const totals = {
    steps: steps.length,
    completed: steps.filter(step => step.status === 'completed').length,
    failed: steps.filter(step => step.status === 'failed').length,
    artifacts: artifacts.length,
    bytes: artifacts.reduce((sum, item) => sum + (item.bytes ?? 0), 0),
  }

  const rows = steps.map(step => '<tr>' +
    '<td class="mono">' + escape(step.id) + '</td>' +
    '<td>' + escape(step.title ?? '') + '</td>' +
    '<td><span class="pill pill--' + escape(step.status) + '">' + escape(step.status) + '</span></td>' +
    '<td class="num">' + (step.artifacts ?? []).length + '</td>' +
    '<td class="mono small">' + (step.error ? escape(String(step.error).slice(0, 120)) : '') + '</td>' +
    '</tr>').join('')

  const artifactRows = artifacts.map(item => '<tr>' +
    '<td class="mono">' + escape(item.path) + '</td>' +
    '<td class="num">' + escape(bytes(item.bytes ?? 0)) + '</td>' +
    '<td class="mono small">' + escape(String(item.sha256 ?? '').slice(0, 24)) + '</td>' +
    '</tr>').join('')

  const auditRows = (provenance?.audit ?? []).slice(-24).map(entry => '<tr>' +
    '<td class="num">' + escape(entry.seq ?? '') + '</td>' +
    '<td class="mono">' + escape(entry.type ?? '') + '</td>' +
    '<td class="mono small">' + escape(String(entry.previousHash ?? '').slice(0, 10)) + '</td>' +
    '<td class="mono small">' + escape(String(entry.eventHash ?? '').slice(0, 10)) + '</td>' +
    '</tr>').join('')

  const graph = plan ? toSvg(plan, { statuses }) : ''
  const timeline = steps.map(step => '<li><span class="pill pill--' + escape(step.status) + '">' + escape(step.status) + '</span> ' + escape(step.title ?? step.id) + '</li>').join('')

  return [
    '<!doctype html>',
    '<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>' + escape(run.title ?? run.id) + ' — 运行报告</title>',
    '<style>',
    '*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#0f1115;line-height:1.6;background:#fff}',
    '.wrap{max-width:900px;margin:0 auto;padding:32px 24px 64px}',
    'h1{font-size:26px;letter-spacing:-.02em;margin:0 0 6px}h2{font-size:16px;margin:34px 0 10px;letter-spacing:-.01em}',
    '.meta{color:#5b6270;font-size:14px;margin:0 0 4px}',
    '.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:22px 0}',
    '.card{background:#f6f7f9;border-radius:10px;padding:12px 14px}.card b{display:block;font-size:22px;font-variant-numeric:tabular-nums}',
    '.card span{font-size:12px;color:#5b6270}',
    'table{width:100%;border-collapse:collapse;font-size:13.5px}th,td{text-align:left;padding:7px 10px;border-bottom:1px solid #eceef2;vertical-align:top}',
    'th{color:#5b6270;font-weight:500;font-size:12.5px}.mono{font-family:ui-monospace,Menlo,monospace}.small{font-size:12px;color:#5b6270}.num{text-align:right;font-variant-numeric:tabular-nums}',
    '.pill{font-size:11.5px;padding:1px 8px;border-radius:999px;background:#eef0f3;color:#4b5563}',
    '.pill--completed{background:#e8f6f1;color:#0f7b5f}.pill--failed{background:#fdecea;color:#c0392b}.pill--skipped{background:#f0f1f4;color:#6b7280}',
    '.limits{background:#fef6e7;border-radius:10px;padding:14px 16px;font-size:13.5px;color:#7a5200}.limits ul{margin:8px 0 0;padding-left:18px}',
    '.ok{color:#0f7b5f}.bad{color:#c0392b}ul.steps{list-style:none;padding:0;margin:0}ul.steps li{padding:4px 0;font-size:14px}',
    '</style></head><body><div class="wrap">',
    '<h1>' + escape(run.title ?? run.id) + '</h1>',
    '<p class="meta">运行 <code>' + escape(run.id) + '</code> · 状态 <b>' + escape(run.status ?? 'unknown') + '</b></p>',
    '<p class="meta">模板 ' + escape(run.templateId ?? '—') + ' · 开始 ' + escape(run.createdAt ?? '—') + '</p>',
    '<p class="meta">审计链 <b class="' + (verified ? 'ok' : 'bad') + '">' + (verified ? '校验通过' : '校验失败') + '</b>' + (bundleSha256 ? ' · 包摘要 <code>' + escape(bundleSha256.slice(0, 16)) + '</code>' : '') + '</p>',

    '<div class="grid">',
    '<div class="card"><b>' + totals.steps + '</b><span>步骤</span></div>',
    '<div class="card"><b>' + totals.completed + '</b><span>完成</span></div>',
    '<div class="card"><b>' + totals.failed + '</b><span>失败</span></div>',
    '<div class="card"><b>' + totals.artifacts + '</b><span>产物</span></div>',
    '<div class="card"><b>' + escape(bytes(totals.bytes)) + '</b><span>产物字节</span></div>',
    '</div>',

    graph ? '<h2>流程</h2>' + graph : '',
    '<h2>步骤</h2><table><thead><tr><th>ID</th><th>标题</th><th>状态</th><th class="num">产物</th><th>错误</th></tr></thead><tbody>' + (rows || '<tr><td colspan="5" class="small">没有步骤</td></tr>') + '</tbody></table>',
    '<h2>产物</h2><table><thead><tr><th>路径</th><th class="num">大小</th><th>sha256</th></tr></thead><tbody>' + (artifactRows || '<tr><td colspan="3" class="small">没有登记产物</td></tr>') + '</tbody></table>',
    '<h2>审计链（最近 24 条）</h2><table><thead><tr><th class="num">#</th><th>事件</th><th>前驱</th><th>本条</th></tr></thead><tbody>' + (auditRows || '<tr><td colspan="4" class="small">没有审计事件</td></tr>') + '</tbody></table>',
    '<h2>时间线</h2><ul class="steps">' + (timeline || '<li class="small">—</li>') + '</ul>',

    '<h2>限制</h2><div class="limits"><b>这份报告能证明什么，不能证明什么</b><ul>',
    '<li>产物哈希证明记录时字节一致，<b>不证明分析正确</b>。</li>',
    '<li>审计链可离线自校验，<b>不防有写权限的人重写整条链</b>。</li>',
    '<li><code>reproducible</code> 恒为 false：环境可钉死，算法不能。</li>',
    '<li>签名是自签的：证明持有某把密钥，不证明是谁。</li>',
    '<li><b>不是临床工具</b>，未做临床验证，未取得任何认证。</li>',
    '</ul></div>',
    '</div></body></html>',
  ].filter(Boolean).join('\n')
}
