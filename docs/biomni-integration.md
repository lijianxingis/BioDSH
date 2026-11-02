# Biomni 嫁接

这个项目的目的不是做一个通用工作流引擎。目的是：**把 Biomni 的生信工具库接进来，
并给每一次工具调用留下可核验的证据。**

## 之前的偏离

重建过程中我把它当成了「通用工作流引擎 + 溯源」，一直在补前者。

实际情况：Biomni 集成**基本不存在**，只有三处表面引用——

- `preset: "biomni"` 字符串（没有任何行为）
- 解释器探测时找 `Biomni/.venv`
- `_lake.py` 里找数据湖路径

**没有任何一处真正调用 Biomni 的工具。**

## 现在做了什么

### `scripts/biomni_bridge.py`

一个确定性的桥：调用**命名的** Biomni 工具，传**命名的**参数，写 JSON 结果。

关键选择：**不经过 Biomni A1**。

A1 是让 LLM 选工具。那是另一种溯源声明——"模型认为该用这个工具"和
"这个工具被这样调用"不是同一件事，而只有后者能复现。

三个子命令：

```bash
python biomni_bridge.py list [--json PATH]      # 清点可用工具
python biomni_bridge.py describe <mod> <fn>     # 参数签名
python biomni_bridge.py call <mod> <fn> --args JSON --out PATH
```

### 实测的 Biomni 状态

```
biomniVersion      : 0.0.8
modulesAvailable   : 18 / 22
functions          : 175
modulesUnavailable : 4
```

**4 个模块因缺依赖无法加载**：

| 模块 | 缺什么 |
| --- | --- |
| `bioimaging` | nibabel |
| `genetics` | torch |
| `genomics` | esm |
| `literature` | PyPDF2 |

**`genomics` 不可用这件事要明说** —— 它是生信最核心的模块之一。桥会把原因原样报告，
而不是假装工具存在。

## 端到端验证

三个步骤，全部由宿主执行，产物全部登记：

```
inventory           completed  biomni-inventory.json      9098 B  e7b98295d7d4
restriction-sites   completed  restriction-sites.json      3283 B  a2b6c02a2e78
reading-frames      completed  reading-frames.json         1088 B  b5a0c92b6f42

provenance verified: true
artifacts registered: 3
```

每个结果 JSON 都记录：调用了哪个模块、哪个函数、什么参数、返回类型、耗时、结果本身。

所以「这个工具跑过」这句话背后是字节，不是叙述。

## 一个被环境暴露的问题

第一次跑验证脚本时失败：

```
PermissionError: [Errno 13] Permission denied: biomni-inventory.json
```

不是 Biomni 的问题，也不是我的代码——**这台机器的沙箱不允许子进程写到工作区之外**。
验证脚本原本用 OS 临时目录，改成项目内的目录后就通过了。

值得记一笔：这个失败信息看起来像是文件系统 bug，实际是环境约束。类似的误判会浪费很多时间。

## 现在的限制

| 项 | 状态 |
| --- | --- |
| 工具调用是确定性的 | 是（不经 LLM） |
| 工具结果进证据链 | 是（字节 + 哈希） |
| 覆盖全部 Biomni 工具 | **否，175/218 可用，且只测了 2 个** |
| 需要网络的工具 | 未测 |
| 需要 GPU 的工具 | **不可用**（genomics 缺 esm） |
| 数据湖集成 | 只有路径探测，没有实际使用 |

## 与 Biomni 本身的关系

| | Biomni | 本项目 |
| --- | --- | --- |
| 主张 | 218 个工具，LLM 编排 | 同样的工具，每次调用可核验 |
| 强项 | 广度 + 自然语言交互 | 证据链 + 确定性执行 |
| 弱项 | 工具调用的结果如何证明 | 没有 LLM 编排，要人工指定 |

**这两个是互补的，不是替代关系。** 理想形态是：Biomni 负责"用什么工具"，
这个工作台负责"这次调用真的发生了，结果就是这些字节"。
