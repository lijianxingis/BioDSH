# DSH 研究工作台

面向代码、组学和医学研究的 DSH 本地插件。界面提供概览、编辑器、普通/Biomni 会话入口和可追踪的研究工作流；医学协作使用单独的 `medical-metadata` 预设。

> **这是研究用途的原型，不是临床工具，也没有任何合规认证。**
> `intendedUse` 恒为 `research-only`，`clinicalValidationStatus` 恒为 `required-not-performed`。
> 能打开界面的人就能提交决策，项目没有账号体系。

## 它解决什么问题

跑一次分析，真正难的不是写脚本，而是**事后说清当时到底跑了什么**：

- 这一步的输入是哪个版本的文件？
- 结果是模型描述的，还是进程真的执行过？
- 报告里那个数字，是算出来的还是编的？

这个插件把「执行」和「证据」绑在一起：每一步由宿主真实执行、产物按字节哈希登记、审计链可离线自校验。**它不替你判断生物学结论对不对**。

## 装完就能用，不一定要 DSH

引擎是纯 Node，**零外部依赖**。23 个模块里只有 `host.js` 用到了 DSH。

```bash
git clone https://github.com/lijianxingis/BioDSH.git && cd BioDSH
npm install --ignore-scripts
node bin/dsh-research.mjs doctor
node bin/dsh-research.mjs run sequence-analysis --workspace ./work
```

完整命令：`init` / `templates` / `plan` / `run` / `runs` / `verify` / `export` / `check` / `doctor`。

接别的 agent 只需要实现 **6 个 adapter 函数**，见 [docs/using-without-dsh.md](docs/using-without-dsh.md)。

## 它到底做什么

**把 Biomni 的生信工具接进来，并给每次调用留下可核验的证据。**

`scripts/biomni_bridge.py` 确定性地调用命名的 Biomni 工具——不经 LLM 选工具——
把结果写成 JSON，再由工作台登记字节数与哈希。

实测：Biomni 0.0.8，18/22 模块可用，175 个函数。`genomics` 因缺 `esm` 不可用，
这一点会如实报告而不是假装工具存在。详见 [docs/biomni-integration.md](docs/biomni-integration.md)。

## 容器执行是真的，而且答案可以对

一个声明为容器的计划**真的在容器里跑**。验证过两条：

- **r-base 4.3.3**：R 在无网络容器里拟合线性模型，从生成数据恢复了 +2.4 的组效应
- **Bioconductor（limma 3.58.1 / edgeR 4.0.16）**：差异表达在 200 基因 × 8 样本上
  跑出 **20/20 真阳性、0 假阳性**——因为数据带有已知的真值集合，可以算 recall 和 precision

第二条是关键：**它证明了结果正确，而不只是流程跑通。**

这个功能曾经是假的——见 [docs/real-analysis-run-3.md](docs/real-analysis-run-3.md)。
引擎接受 `backend: "container"`，校验 digest，探测 daemon，然后**在宿主上执行**。
只有把宿主上不存在的程序（`Rscript`）放进镜像才暴露出来。

## 设计上值得看的三点

1. **契约是强制的，不是声明性的。** 退出码 0 但没写出声明的产物 → 步骤判失败；声明了必需输入但文件不存在 → 命令根本不执行；声明 `image/png` 却写入文本 → 按字节判失败。
2. **审计链可离线自校验。** 哈希链 + 产物/执行记录双向交叉核对，篡改任一字段都会失败。
3. **限制写在代码里。** `reproducible: false`、`clinicalUse: 'not-authorized'`、`selfSigned: true` 都是常量。

## 安装

在 DSH 界面里填 `github:你的用户名/dsh-research-workbench`，或：

```bash
npm install --ignore-scripts && npm run build && npm test
```

**装完必须重启 DSH**：`dsh.client` 声明在进程启动时读取，热重载不够。不重启的现象是侧边栏没有入口。

## 这个项目不做什么

| 限制 | 具体情况 |
| --- | --- |
| 无认证、无账号 | 未签名时 `actor` 记为 `human-user (identity not verified)` |
| 无合规认证 | 没有 SOC 2 / ISO / CE / NMPA |
| 无临床验证 | `clinicalValidationStatus` 恒为 `required-not-performed` |
| 非字节级可复现 | `reproducible: false` 是硬编码常量 |
| 无真实使用史 | 测试都是维护者自测 |
| 容器未验证重负载 | 跑过 limma/edgeR 差异表达；未验证 GPU、超长任务、大内存 |
| 无分布式调度器 | 有 HTTP worker 池，没有 K8s/Slurm 集成 |

## 许可

MIT，见 [LICENSE](LICENSE)。
