# 装进 DSH

插件有两种用法，**这是最容易搞混的地方**：

| 用法 | 你需要什么 | 能做什么 |
| --- | --- | --- |
| **CLI** | 只要 Node | 跑流程、看证据、导包 |
| **DSH 插件** | DSH | 侧边栏面板 + agent 能调工具 |

本文是第二种。

## 装

```bash
# 1. 复制到 DSH 的插件目录
cp -r dsh-research-workbench ~/.dsh/plugins/
cd ~/.dsh/plugins/dsh-research-workbench
npm install --ignore-scripts --omit=dev

# 2. 重启 DSH
```

Windows:

```powershell
Copy-Item -Recurse dsh-research-workbench "$env:USERPROFILE\.dsh\plugins\"
cd "$env:USERPROFILE\.dsh\plugins\dsh-research-workbench"
npm install --ignore-scripts --omit=dev
```

**必须重启。** `dsh.client` 声明在进程启动时读取，热重载不会重新读。

## 装对了没有

重启后：

1. 侧边栏出现「研究工作台」
2. 点进去能看到概览页（审计链双螺旋、模板、运行记录）
3. 在对话里让 agent 列模板，它会调 `research_workflow`

没出现？看 DSH 启动日志里有没有 `research-workbench`。没有的话是插件没被发现，不是功能问题。

## 插件给 agent 什么

两个工具：

### `research_workflow`

| action | 做什么 |
| --- | --- |
| `templates` | 列出模板，含「几步能自动执行」 |
| `create` | 从模板建一条运行 |
| `execute` | 由宿主执行带命令的步骤 |
| `get` | 读运行记录 |
| `provenance` | 读审计链 |
| `artifacts` | 读产物及其哈希 |
| `export` | 导出签名证据包 |

### `research_evidence`

检查一条运行的证据：审计链是否验证、产物是否还在磁盘上且哈希匹配。

返回里固定带一句：

> A verified chain proves the record was not altered. It does not prove the analysis was correct.

## agent 会怎么用

你说「跑一下序列分析，然后告诉我证据对不对」，它大概会：

```
1. research_workflow { action: "templates" }
2. research_workflow { action: "create", templateId: "sequence-analysis" }
3. research_workflow { action: "execute", runId: "..." }
4. research_evidence { runId: "..." }
```

每一步都是真实调用，不是它「说」跑了。

## 面板调什么

面板通过 `POST /api/research-workbench` 调同样的 29 个动作。工具和面板**共用同一个
`handleAction`**，所以能力不会漂移——加在一边就在两边都可用。

## 医疗模式

`cordis.patch.yml` 注册了一个 `medical-metadata` 预设。那个模式下：

- 工具白名单只有 5 个（不含文件、终端、Python）
- `editor/read`、`pipeline/run` 等动作在宿主层被拒绝
- 守卫**失败即拒绝**：抛异常也拒绝，不会因为「判断不了」而放行

## 适配层的意义

`lib/adapter.js` 定义了 6 个函数。DSH 的实现是 `lib/host.js` 里的 `dshAdapter(ctx)`：

```js
export function apply(ctx) {
  const adapter = dshAdapter(ctx)   // 只有这 6 个函数碰宿主
  ctx.webServer.register({ ... })   // 面板用的路由
  ctx.tools.register(defineTool({ ... }))  // agent 用的工具
  return { adapter, apiPath: API_PATH }
}
```

**引擎其余部分不知道 DSH 存在。** 换一个宿主，实现同样 6 个函数即可，
`bin/dsh-research.mjs` 用的 `createFsAdapter` 就是第二个实现。

## 之前缺了什么

这个插件曾经**能被加载但不能用**：

| 缺 | 后果 |
| --- | --- |
| 没有 `apply(ctx)` | DSH 根本不会调用它 |
| 没有注册工具 | agent 没有任何东西可调 |
| 适配层只有文档 | `lib/adapter.js` 写了 6 个函数，`host.js` 一个都没实现 |

现在三样都补上了，并有 `test/verify-dsh-plugin.mjs` 的 21 项检查守着。
