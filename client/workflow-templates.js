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

const containerAnalysis = {
  id: 'container-r-analysis',
  badge: '容器',
  title: '容器内统计建模',
  description: '在固定 digest 的 R 镜像中拟合线性模型，网络关闭，产物按字节哈希登记。',
  preset: 'biomni',
  backend: 'container',
  image: 'docker.m.daocloud.io/library/r-base@sha256:205aca88535e1a066c72c84d7a149747665da41cafabb951ccae8dd4e6f0c308',
  steps: [
    step('inspect-data', '检查表达量矩阵', '在容器内确认 expression 与 group 两列存在。', {
      // Runs inside the image: file(1) and head are part of it, and a host Python script
      // is not, because the mount only carries the workspace.
      command: 'head -n 3 expression.csv',
      inputs: [{ path: 'expression.csv', required: true }],
      outputs: [],
      timeoutMs: 60000,
    }),
    step('fit-model', '拟合线性模型', '在容器内用 R 拟合 expression ~ group，写出模型摘要。', {
      command: 'Rscript model.R expression.csv model-result.json',
      needs: ['inspect-data'],
      inputs: [{ path: 'expression.csv', required: true }],
      outputs: [{ path: 'model-result.json', mediaType: 'application/json', minBytes: 80 }],
      timeoutMs: 180000,
    }),
  ],
}

const bioconductorDE = {
  id: 'bioconductor-de',
  badge: '容器',
  title: 'Bioconductor 差异表达',
  description: '在钉死 digest 的 limma/edgeR 镜像中做差异表达，网络关闭，结果可与真值对照。',
  preset: 'biomni',
  backend: 'container',
  image: 'dsh-bioc@sha256:cb4d683b14e68c6986a14f7809094a3224f764796fa22d9854e440c226cf30b5',
  steps: [
    step('inspect-inputs', '检查输入矩阵', '在容器内确认计数矩阵的表头与样本数。', {
      command: 'head -n 1 counts.csv',
      inputs: [{ path: 'counts.csv', required: true }, { path: 'samples.csv', required: true }],
      timeoutMs: 60000,
    }),
    step('differential-expression', 'limma 差异表达', 'TMM 归一化、voom、eBayes，写出排序结果与摘要。', {
      command: 'Rscript differential_expression.R counts.csv samples.csv de-results.csv de-summary.json',
      argv: ['Rscript', 'differential_expression.R', 'counts.csv', 'samples.csv', 'de-results.csv', 'de-summary.json'],
      needs: ['inspect-inputs'],
      inputs: [{ path: 'counts.csv', required: true }, { path: 'samples.csv', required: true }],
      outputs: [
        { path: 'de-results.csv', minBytes: 1000 },
        { path: 'de-summary.json', mediaType: 'application/json', minBytes: 100 },
      ],
      timeoutMs: 300000,
    }),
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
  bioconductorDE,
  containerAnalysis,
  medicalMetadata,
  custom,
])
