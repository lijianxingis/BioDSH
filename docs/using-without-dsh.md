# 不装 DSH 直接用

引擎不依赖 DSH。23 个模块里只有 `host.js` 用到了 `@deepseek-ai/dsh-tools`，其余是纯 Node，**零外部依赖**。

## 命令行

```bash
git clone https://github.com/lijianxingis/BioDSH.git
cd BioDSH
npm install --ignore-scripts

node bin/dsh-research.mjs doctor          # 这台机器能干什么
node bin/dsh-research.mjs templates       # 有哪些流程
node bin/dsh-research.mjs init ./my-work
node bin/dsh-research.mjs run sequence-analysis --workspace ./my-work
```

装成全局命令：

```bash
npm link
dsh-research doctor
```

## 完整生命周期

```bash
dsh-research init ./work                                    # 建工作区
dsh-research run sequence-analysis --workspace ./work       # 跑，记录证据
dsh-research runs --workspace ./work                        # 列运行
dsh-research verify <runId> --workspace ./work              # 重验审计链
dsh-research export <runId> --workspace ./work              # 导出并签名
dsh-research check bundle.json                              # 验证别人给的包
```

`check` 默认 **不认证**：一个来路不明的包能证明自己的完整性，但"谁签的"需要你明确信任某个 key id。

## 解释器

CLI 会自己找 Python：

1. `DSH_RESEARCH_PYTHON` 环境变量
2. 工作区里的 `.venv`
3. 同级的 `Biomni/.venv`
4. `PATH` 上的 `python`

用哪个会打印出来。**「流程失败」和「解释器缺 biopython」在日志里长得一样**，所以必须先说清用的是哪一个。

## 在代码里用

```js
import { definePlan, runPlan } from "dsh-research-workbench/workflow-engine"
import { createProvenance, recordArtifact } from "dsh-research-workbench/provenance"

const plan = definePlan({ steps: [{
  id: "step",
  command: "python analyse.py",
  inputs: [{ path: "in.csv", required: true }],
  outputs: [{ path: "out.json", mediaType: "application/json", minBytes: 50 }],
}] })

const result = await runPlan(plan, { workspace: "/path/to/work", runDirectory: "/path/to/run" })
// result.steps[i].outputs[j] 带 bytes 与 sha256
```

## 接别的 agent

适配层只有 **6 个函数**。实现它们，引擎就能在别处跑：

```js
import { assertAdapter, REQUIRED } from "dsh-research-workbench/adapter"

const myAdapter = {
  resolveSession: async id => ({ id, workspace, preset }),
  resolvePath:    async (session, path) => ({ hostPath, insideWorkspace, exists }),
  readFile:       async (session, hostPath, maxBytes) => Buffer,
  writeFile:      async (session, hostPath, text, opts) => ({ version }),
  listRuns:       async session => [{ id, title, status, updatedAt }],
  saveRun:        async (session, run) => {},
}

assertAdapter(myAdapter)   // 缺什么会直接点名
```

`lib/fs-adapter.js` 是参考实现：只用一个目录就能跑，不需要任何宿主。

### 接 Claude Code / Codex / 其他

这些工具需要的是一个能被调用的动作表。用 `host.js` 的 29 个动作当蓝本，但**不要照抄医疗隔离**——
那部分逻辑依赖 DSH 的 preset 概念，换宿主时要重新实现，否则医疗模式会在新宿主上静默失效。

#### 最小接入清单

| 要做 | 因为 |
| --- | --- |
| 实现 6 个 adapter 函数 | 引擎靠它们读写文件、存运行记录 |
| 保留 `runPlan` | 执行、契约校验、指纹都在里面 |
| 保留 provenance | 否则导出的是"说明"不是"证据" |
| 想清医疗模式 | 不实现就等于没有隔离，不要让用户以为有 |

## 不提供的

- 用户认证（能跑命令的人就能改工作区）
- 临床验证
- 字节级可复现（`reproducible` 恒为 `false`）
- 任何合规认证
