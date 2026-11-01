/**
 * Workflow templates.
 *
 * Steps that can be executed carry a command with placeholders, not a real interpreter
 * path: {{python}} is resolved by the host, so the same template works on any machine.
 * A step without a command is prompt-driven and says so.
 */

export const INTERPRETER_PLACEHOLDER = '{{python}}'

function step(id, title, instructions, extra = {}) {
  return {
    id,
    title,
    instructions,
    ...extra,
  }
}

const sequenceAnalysis = {
  id: 'sequence-analysis',
  badge: '组学',
  title: '序列分析',
  description: '扫描工作区里的 FASTA/FASTQ，汇总记录数并写出报告。',
  preset: 'biomni',
  steps: [
    step('inspect-inputs', '扫描序列文件', '列出工作区里的序列文件与记录数。', {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/inspect_sequences.py`,
      inputs: [],
      outputs: [],
    }),
    step('analyze-sequences', '汇总序列', '把记录数写成 sequence-summary.json。', {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/summarize_sequences.py`,
      needs: ['inspect-inputs'],
      inputs: [],
      outputs: [{ path: 'sequence-summary.json', mediaType: 'application/json', minBytes: 20 }],
    }),
    step('interpret-results', '解读结果', '阅读 sequence-summary.json，说明样本构成与需要人工判断的部分。'),
  ],
}

const localDataAnalysis = {
  id: 'local-data-analysis',
  badge: '数据',
  title: '本地数据分析',
  description: '剖析工作区里的 CSV/TSV，统计数值列并生成报告。',
  preset: 'standard',
  steps: [
    step('inspect-data', '剖析表格', '读取前 5000 行，报告行数、列数与缺失值。', {
      command: `${INTERPRETER_PLACEHOLDER} {{scripts}}/profile_tables.py`,
      inputs: [],
      outputs: [{ path: 'data-profile.json', mediaType: 'application/json', minBytes: 20 }],
    }),
    step('analyze-data', '解读数据', '根据 data-profile.json 说明数据结构与需要澄清的问题。', {
      needs: ['inspect-data'],
      inputs: [{ path: 'data-profile.json' }],
    }),
  ],
}

const literatureEvidence = {
  id: 'literature-evidence',
  badge: '文献',
  title: '文献证据',
  description: '检索 PubMed 并整理证据表，明确标注哪些列未经评估。',
  preset: 'standard',
  steps: [
    step('define-search', '定义检索式', '把研究问题转成可复现的 PubMed 检索式。'),
    step('collect-evidence', '检索并整理', '用检索式查询 PubMed，把结果排成证据表。', {
      needs: ['define-search'],
    }),
  ],
}

const medicalMetadata = {
  id: 'medical-metadata',
  badge: '医学',
  title: '医学与组学 · 结构协作',
  description: '只接收人工审核的结构描述，不访问文件、不执行代码。',
  preset: 'medical-metadata',
  steps: [
    step('coordinate-scope', '总协调与范围界定', '理解目标并拆分子任务。'),
    step('evidence-review', '文献证据', '只基于公开研究关键词检索。', { needs: ['coordinate-scope'] }),
    step('biology-method-review', '方法与生物学', '静态分析，不执行代码。', { needs: ['coordinate-scope'] }),
    step('code-technical-debug', '代码审查', '以文字给出代码，只做静态分析。', { needs: ['coordinate-scope'] }),
    step('independent-review', '独立审核', '在独立上下文中复核。', { needs: ['biology-method-review'] }),
    step('human-decision-report', '整合报告', '状态为待人决策。', { needs: ['independent-review'] }),
  ],
}

const custom = {
  id: 'custom',
  badge: '自定义',
  title: '自定义流程',
  description: '从空白开始搭建你自己的研究流程。',
  preset: 'standard',
  steps: [step('step-1', '第一步', '描述这一步要做什么。')],
}

export const WORKFLOW_TEMPLATES = Object.freeze([
  sequenceAnalysis,
  localDataAnalysis,
  literatureEvidence,
  medicalMetadata,
  custom,
])
