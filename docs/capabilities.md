# 补齐的 16 项

这 16 项是之前和 Snakemake / Nextflow / Airflow 对比时确认的缺口。每一项都**有代码、有测试**，
不是「计划中」。

## 声明式语法（DSL）

`lib/dsl.js` 解析一个 YAML 子集。不做通用 YAML：锚点、自定义标签是攻击面，而工作流只需要
映射、列表、字符串、数字。超出范围的行会带行号报错，不猜。

```yaml
steps:
  - id: inspect
    command: "python scripts/inspect_sequences.py"
    outputs:
      - path: sequence-summary.json
        mediaType: application/json
        minBytes: 20
```

```bash
dsh-research from-dsl workflow.workflow --workspace ./work
```

## 执行器插件

`lib/executors.js` 是注册表，`lib/executors-builtin.js` 注册五个后端。加后端的代价从
「改引擎」变成「实现两个方法」。

| 执行器 | 需要什么 | 缺失时 |
| --- | --- | --- |
| `local` | 无 | — |
| `slurm` | `sbatch` / `sacct` | fail-closed，不降级到本地 |
| `kubernetes` | `kubectl` + 钉死 digest 的镜像 | 拒绝没有 digest 的镜像 |
| `cloud-batch` | `CLOUD_BATCH_COMMAND` 适配器 | 说明它不打包云 SDK |
| `singularity` | singularity / apptainer / podman | 拒绝浮动 tag |

**Slurm 的两个细节**：`sbatch` 退出 0 表示「提交成功」不是「作业成功」，所以退出码要看 `sacct`；
被取消和失败不是一回事，所以状态从会计表读取而不是从「没结果」推断。

## conda 环境

`lib/environments.js` 按 spec 哈希建环境：改了 spec 就是新环境，不会静默改动一个已经
跑过结果所依赖的环境。conda 缺失时**报错，不回退到宿主解释器**——否则步骤会用错误的
工具链报告成功。

## DAG 可视化

`lib/graph.js` 输出 Graphviz DOT 和**内联 SVG**。SVG 不含 `<script>`：报告要能当附件发出去，
在什么都禁用的浏览器里也要能看到。分层用依赖深度，和执行顺序一致。

```bash
dsh-research graph sequence-analysis --out graph.dot
```

## HTML 报告

`lib/report-html.js` 生成单文件报告。三条规则：数字全部来自运行记录、不重算；限制印在报告里，
不省略；**没有 script 标签**。

```bash
dsh-research report <runId> --workspace ./work
```

## Prometheus 指标

`lib/metrics.js` 输出文本曝光格式。不用动态标签：标签值来自用户输入时，指标端点会变成
无界内存泄漏。

## HTTP API

`bin/dsh-research-server.mjs`，10 条路由。

```bash
npm run serve:api                    # 默认 127.0.0.1:4174
curl localhost:4174/health
curl localhost:4174/metrics
curl -X POST localhost:4174/api/runs -d '{"dsl": "..."}'
```

## 作业队列 UI

`/api/queue/ui`。每 3 秒拉一次队列，只显示你所在租户的作业——**服务端过滤，不是页面筛选**。
连不上时如实显示「无法连接」，不假装还在刷新。

## 认证（OIDC / OAuth）

`lib/auth.js`。两种模式，区别是重点：

- `none`：单一本地主体，**这不是认证**，代码里写明
- `oidc`：对 JWKS 验证签名，检查 alg 白名单、kid、签名、过期、issuer、audience

**验证 token 而不是解码 token。** 解码 JWT 再读 claims 是经典的认证绕过：签名没验证前
claims 全是攻击者可控的。

## 多租户隔离

`lib/tenancy.js`。每条记录带 tenant，每次读按调用者 tenant 过滤。

跨租户访问返回 **`NOT_FOUND` 而不是 `FORBIDDEN`**：告诉你「存在但属于别人」是一个枚举预言机。

## 进程级 checkpoint

`lib/checkpoint.js`。和引擎已有的续跑不同：那个处理干净重启，这个处理**进程在步骤运行中
被杀**。

判定：中断的步骤重跑，因为写了一半的产物不能复用。已记账的步骤仅在产物哈希仍匹配时可信。

## Shell 补全

命令表只有一处，补全脚本从它生成——补全会漂移的补全比没有更糟，因为它教错词。

```bash
dsh-research completion bash
dsh-research completion zsh
dsh-research completion fish
dsh-research completion powershell
```

## 验证

```bash
node test/verify-capabilities.mjs   # 44 项
node test/verify-api.mjs            # 16 项（需要服务在跑）
```
