#!/usr/bin/env node
/**
 * Shell completion for the CLI.
 *
 * The command list and template list live here, so a completion script cannot drift from
 * the actual commands: a completion that teaches the wrong words is worse than none.
 */
import { WORKFLOW_TEMPLATES } from '../client/workflow-templates.js'

export const COMMANDS = {
  init: 'create a workspace',
  templates: 'list workflow templates',
  plan: 'write a plan without running',
  run: 'run a template',
  runs: 'list recorded runs',
  verify: 're-verify a run',
  export: 'write a signed bundle',
  check: 'verify a bundle from elsewhere',
  doctor: 'report capabilities',
  report: 'render an HTML report',
  graph: 'print the plan as DOT',
  'from-dsl': 'run a workflow from a .workflow file',
  completion: 'print a completion script',
}

const templates = WORKFLOW_TEMPLATES.map(t => t.id)
const commands = Object.keys(COMMANDS)

function bash() {
  const lines = ['# bash completion for dsh-research']
  lines.push('# install: dsh-research completion bash > /etc/bash_completion.d/dsh-research')
  lines.push('_dsh_research() {')
  lines.push('  local cur prev')
  lines.push('  COMPREPLY=()')
  lines.push('  cur="${COMP_WORDS[COMP_CWORD]}"')
  lines.push('  prev="${COMP_WORDS[COMP_CWORD-1]}"')
  lines.push('  if [ "$COMP_CWORD" -eq 1 ]; then')
  lines.push('    COMPREPLY=( $(compgen -W "' + commands.join(' ') + '" -- "$cur") )')
  lines.push('    return 0')
  lines.push('  fi')
  lines.push('  case "$prev" in')
  lines.push('    --workspace|--out|--key) COMPREPLY=( $(compgen -f -- "$cur") ); return 0 ;;')
  lines.push('  esac')
  lines.push('  case "${COMP_WORDS[1]}" in')
  lines.push('    run|plan) COMPREPLY=( $(compgen -W "' + templates.join(' ') + '" -- "$cur") ) ;;')
  lines.push('  esac')
  lines.push('  return 0')
  lines.push('}')
  lines.push('complete -F _dsh_research dsh-research')
  return lines.join('\n') + '\n'
}

function zsh() {
  const lines = ['#compdef dsh-research']
  lines.push('# zsh: dsh-research completion zsh > "${fpath[1]}/_dsh-research"')
  lines.push('_dsh_research() {')
  lines.push('  local -a commands')
  lines.push('  commands=(')
  for (const [name, summary] of Object.entries(COMMANDS)) lines.push("    '" + name + ":" + summary + "'")
  lines.push('  )')
  lines.push('  if (( CURRENT == 2 )); then _describe "command" commands; return; fi')
  lines.push('  case $words[2] in')
  lines.push('    run|plan) _values "template" ' + templates.join(' ') + ' ;;')
  lines.push('    *) _files ;;')
  lines.push('  esac')
  lines.push('}')
  lines.push('_dsh_research "$@"')
  return lines.join('\n') + '\n'
}

function fish() {
  const lines = ['# fish completion for dsh-research']
  lines.push('# install: dsh-research completion fish > ~/.config/fish/completions/dsh-research.fish')
  for (const [name, summary] of Object.entries(COMMANDS)) {
    lines.push("complete -c dsh-research -n '__fish_use_subcommand' -a '" + name + "' -d '" + summary + "'")
  }
  lines.push("complete -c dsh-research -n '__fish_seen_subcommand_from run plan' -a '" + templates.join(' ') + "'")
  return lines.join('\n') + '\n'
}

function powershell() {
  const lines = ['# PowerShell completion for dsh-research']
  lines.push('# install: dsh-research completion powershell | Out-String | Invoke-Expression')
  lines.push('Register-ArgumentCompleter -Native -CommandName dsh-research -ScriptBlock {')
  lines.push('  param($wordToComplete, $commandAst, $cursorPosition)')
  lines.push('  $commands = @(' + commands.map(c => "'" + c + "'").join(', ') + ')')
  lines.push('  $templates = @(' + templates.map(t => "'" + t + "'").join(', ') + ')')
  lines.push('  $elements = $commandAst.CommandElements')
  lines.push('  $pool = if ($elements.Count -le 2) { $commands } else { $templates }')
  lines.push('  $pool | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {')
  lines.push('    [System.Management.Automation.CompletionResult]::new($_, $_, \'ParameterValue\', $_)')
  lines.push('  }')
  lines.push('}')
  return lines.join('\n') + '\n'
}

const generators = { bash, zsh, fish, powershell }
const shell = process.argv[2] ?? 'bash'

if (!generators[shell]) {
  console.error('unknown shell: ' + shell)
  console.error('usage: dsh-research completion [bash|zsh|fish|powershell]')
  process.exitCode = 2
} else {
  process.stdout.write(generators[shell]())
}
