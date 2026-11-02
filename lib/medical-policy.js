/**
 * Medical metadata mode.
 *
 * The isolation is enforced here, by the host, not by a prompt asking a model to
 * behave. The allowlist still contains `research_workflow_step` so a session can record
 * its own progress; execution and file access are blocked by explicit per-tool and
 * per-action checks, and any error closes the gate rather than opening it.
 */

export const MEDICAL_PRESET = 'medical-metadata'
export const POLICY_REVISION = 2
export const MEDICAL_ALLOWED_TOOLS = Object.freeze([
  'medical_specialist',
  'research_workflow_step',
  'web_search',
  'ask_user_question',
  'todo_write',
])

/** Tools that can read files, run code, reach the network, or delegate. */
const DENIED = Object.freeze([
  'run_code', 'bash', 'terminal', 'shell', 'read_file', 'write_file', 'edit_file',
  'glob', 'grep', 'spawn_agent', 'spawn_teammate', 'subagent', 'subagent_fork',
  'python', 'biomni_call_tool', 'web_fetch',
])

export function isMedicalSession(session) {
  return (session?.agentPreset ?? session?.preset ?? '') === MEDICAL_PRESET
}

/**
 * Decide whether a tool call may proceed.
 *
 * Returns a verdict rather than throwing so the caller can log a refusal. An unknown
 * tool is denied: the list is an allowlist, not a blocklist.
 */
export function checkTool(session, toolName) {
  if (!isMedicalSession(session)) return { allowed: true }
  if (typeof toolName !== 'string' || !toolName) return { allowed: false, code: 'DENIED', reason: 'no tool name' }
  if (DENIED.includes(toolName)) return { allowed: false, code: 'DENIED', reason: toolName + ' is not available in medical metadata mode' }
  if (!MEDICAL_ALLOWED_TOOLS.includes(toolName)) {
    return { allowed: false, code: 'DENIED', reason: toolName + ' is not on the medical allowlist' }
  }
  return { allowed: true }
}

/**
 * Install the guard on a host context.
 *
 * Every failure path denies. A guard that opens when it cannot decide is worse than no
 * guard, because it looks like protection.
 */
export function applyMedicalGuard(ctx) {
  if (!ctx?.tools?.guard) return { installed: false, reason: 'the host exposes no tool guard' }
  ctx.tools.guard(call => {
    try {
      // Every property read happens inside the try: an object whose getter throws must
      // produce a denial, not an exception that unwinds past the guard. A guard that can
      // be crashed is not a guard.
      const toolName = call?.tool?.name
      const session = call?.session
      const verdict = checkTool(session, toolName)
      if (verdict.allowed) return undefined
      return { deny: true, reason: verdict.reason }
    } catch {
      return { deny: true, reason: 'the medical policy could not decide, so it denied' }
    }
  })
  return { installed: true, policyRevision: POLICY_REVISION }
}

export function limitations() {
  return Object.freeze([
    'This is tool capability isolation, not anonymisation and not a quantitative privacy guarantee.',
    'Text the user pastes can still be sensitive, and is still sent to the selected model.',
    'Public search keywords are sent to an external service; there is no automatic semantic redaction.',
    'Vision is disabled: this mode cannot inspect medical images or charts.',
    'It does not provide clinical diagnosis, clinical validation, or any certification.',
  ])
}

export default { MEDICAL_PRESET, MEDICAL_ALLOWED_TOOLS, checkTool, applyMedicalGuard, isMedicalSession, limitations }
