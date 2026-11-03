# 用法教程

从零到一个带签名的证据包，十步。**每一步都在这台机器上真跑过**，输出是复制的，不是写的。

全程不需要 DSH，只需要 Node 20+。

---

## 0. 装

```bash
git clone https://github.com/lijianxingis/BioDSH.git
cd BioDSH
npm install --ignore-scripts
```

装完先自检：

```bash
node bin/dsh-research.mjs doctor
```

```
workspace     : E:\新建文件夹
node          : v24.19.0
python        : E:\新建文件夹\Biomni\.venv\Scripts\python.exe  (DSH_RESEARCH_PYTHON)
container     : daemon 29.5.3
scripts       : 15 in E:\新建文件夹\dsh-research-workbench\scripts

this tool provides no user authentication, no clinical validation,
no reproducible builds, and no compliance certification.
```

**看 `python` 那行。** 它说用的是哪个解释器。如果显示 `python (PATH)` 而你的 PATH 上的 Python
没有 biopython，后面的步骤会失败——但错误会说明是缺库，不是模板坏了。

没有 Python？先装：

```bash
pip install -r requirements.txt
```

或者指向一个已有的：

```bash
# PowerShell
$env:DSH_RESEARCH_PYTHON = "C:\path\to\python.exe"
# bash
export DSH_RESEARCH_PYTHON=/path/to/python
```

---

## 1. 看有哪些流程

```bash
node bin/dsh-research.mjs templates
```

```
sequence-analysis         组学        2/3           序列分析
local-data-analysis       数据        1/2           本地数据分析
literature-evidence       文献        0/2           文献证据
container-r-analysis      容器        2/2           容器内统计建模
bioconductor-de           容器        2/2           Bioconductor 差异表达
time-course-periodicity   时间序列     2/2           时间序列周期分析
biomni-toolkit            Biomni     3/3           Biomni 工具链
medical-metadata          医学        0/6           医学与组学 · 结构协作
custom                    自定义       0/1           自定义流程
```

**中间的 `2/3` 是关键**：3 个步骤里 2 个能自动执行，剩下 1 个需要人判断。
`0/2` 表示这个模板全要人工推进（文献、医学就是这样）。

---

## 2. 建工作区

```bash
node bin/dsh-research.mjs init ./my-work
```

```
workspace ready: E:\新建文件夹\.build\tutorial
```

工作区就是个目录。把你的数据放进去：

```bash
cp samples.fasta ./my-work/
```

或者手写一个测试文件：

```bash
# bash
printf ">seq1\nATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAAT\n>seq2\nATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG\n" > ./my-work/samples.fasta
```

```powershell
# PowerShell
"`>seq1`nATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAAT`n`>seq2`nATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG`n" | Set-Content ./my-work/samples.fasta -NoNewline
```

---

## 3. 跑

```bash
node bin/dsh-research.mjs run sequence-analysis --workspace ./my-work
```

```
running sequence-analysis in E:\新建文件夹\.build\tutorial
interpreter: E:\新建文件夹\Biomni\.venv\Scripts\python.exe  (DSH_RESEARCH_PYTHON)
status: completed
  inspect-inputs          completed exit=0
  analyze-sequences       completed exit=0
    sequence-summary.json  113 B  fb611808349162e1
run id     : 2026-11-03T01-51-12-812Z-sequence-analysis
audit chain: verified
```

四件事值得看：

1. **`interpreter`** —— 用的是哪个解释器，写清楚
2. **`exit=0`** —— 退出码，不是「成功」这个词
3. **`113 B  fb611808...`** —— 产物真实字节数和哈希前缀
4. **`audit chain: verified`** —— 审计链自校验通过

### 如果失败

```
status: failed
  inspect-inputs          failed exit=2
    biopython is not installed for C:\anaconda3\python.exe
  analyze-sequences       skipped
```

`skipped` 是因为上游失败了。修掉解释器再跑一次即可——**没有产生垃圾产物**。

---

## 4. 看跑过什么

```bash
node bin/dsh-research.mjs runs --workspace ./my-work
```

```
2026-11-03T01-51-12-812Z-sequence-analysis      completed   序列分析
```

---

## 5. 验审计链

```bash
node bin/dsh-research.mjs verify <runId> --workspace ./my-work
```

```
audit chain: verified
artifacts  : 1
```

**这一步可以离线做。** 把整个 `.dsh/` 目录拷到另一台机器，`verify` 一样能跑——
它不联网，只重算哈希。

试试改坏它：

```bash
# 打开 run.json，把某个 artifacts 的 bytes 改成 999
node bin/dsh-research.mjs verify <runId> --workspace ./my-work
# audit chain: BROKEN
```

改回去，又变回 `verified`。

---

## 6. 生成报告

```bash
node bin/dsh-research.mjs report <runId> --workspace ./my-work
```

```
report: .../runs/<runId>/report.html
size  : 5 KiB
```

打开它。里面有：

- 流程图的 SVG（依赖关系 + 每步状态）
- 步骤表（状态、产物数、错误）
- 产物表（路径、字节数、sha256）
- 审计链（最近 24 条，含前驱哈希）
- **限制说明**（含「不是临床工具」）

**单文件，没有 `<script>`，没有外链。** 可以直接当附件发出去，对方双击就能看。

---

## 6b. 看流程图（不执行）

不想跑，只想看会跑什么：

```bash
node bin/dsh-research.mjs graph sequence-analysis
```

```
digraph "sequence-analysis" {
  rankdir=TB;
  node [shape=box, style=rounded, fontname="Helvetica"];
  "inspect-inputs" [label="扫描序列文件"];
  "analyze-sequences" [label="汇总序列\n1 out"];
  "inspect-inputs" -> "analyze-sequences";
}
```

这是 Graphviz DOT 格式。想看计划本身（含输入输出契约）：

```bash
node bin/dsh-research.mjs plan sequence-analysis --workspace ./my-work
```

```json
{
  "digest": "...",
  "backend": "process",
  "steps": [
    { "id": "inspect-inputs", "needs": [], "inputs": [], "outputs": [] },
    { "id": "analyze-sequences", "needs": ["inspect-inputs"], "inputs": [], "outputs": ["sequence-summary.json"] }
  ]
}
```

**`plan` 不执行任何东西。** 它把将要跑的东西摊开给你看，包括每个步骤声明的输入和输出。

---

## 7. 导出签名包

```bash
node bin/dsh-research.mjs export <runId> --workspace ./my-work
```

```
generated a signing key at .../signing-key.json
bundle     : .../runs/<runId>/bundle.json
status     : pass
signed     : valid (self-signed, key 22e49cbc)
note       : a self-signed bundle proves possession of a key, not who owns it
key id     : 22e49cbc6b404684...
```

第一次会自动生成密钥，存在工作区里。**它是自签的**：能证明你持有这把密钥，不能证明你是谁。

---

## 8. 像别人一样验证它

把 `bundle.json` 发给别人，他运行：

```bash
node bin/dsh-research.mjs check bundle.json
```

```
status   : pass
  PASS  shape         The bundle is a JSON object.
  PASS  format        Recognised dsh-research-workbench.bundle v1.
  PASS  digest        Content matches the recorded digest.
  PASS  provenance    The audit chain verifies.
signature: valid
authentic: false  (authentication needs a trusted key id)
```

**最后一行是最重要的。**

`signature: valid` 说明签名本身没问题。`authentic: false` 说明**没有人决定信任这把密钥**。

这是对的。一个来路不明的包不该因为「签名有效」就被当成可信。要认证，需要明确告诉它信任谁：

```js
import { verifyBundle } from "dsh-research-workbench/bundle"
const result = verifyBundle(bundle, { trustedKeys: ["22e49cbc6b404684..."] })
console.log(result.authenticated)  // true
```

---

## 9. 写自己的流程

不用写 JS。写一个 YAML 子集：

```yaml
# my.workflow
steps:
  - id: count
    title: 统计行数
    command: "python scripts/profile_tables.py"
    inputs:
      - path: data.csv
        required: true
    outputs:
      - path: data-profile.json
        mediaType: application/json
        minBytes: 20

  - id: report
    title: 生成报告
    command: "python scripts/write_report.py"
    needs: [count]
    inputs:
      - path: data-profile.json
        required: true
    outputs:
      - path: report.md
        mediaType: text/markdown
        minBytes: 50
```

```bash
node bin/dsh-research.mjs from-dsl my.workflow --workspace ./my-work
```

**契约是强制的**：`outputs` 里声明了 `data-profile.json`，脚本没写出来就算失败，
哪怕退出码是 0。`inputs` 里声明了必需文件但不存在，命令根本不会执行。

看计划（不执行）：

```bash
node bin/dsh-research.mjs plan custom --workspace ./my-work
```

---

## 10. 接 shell 补全

```bash
# bash
node bin/dsh-research.mjs completion bash > /etc/bash_completion.d/dsh-research
# zsh
node bin/dsh-research.mjs completion zsh > "${fpath[1]}/_dsh-research"
# fish
node bin/dsh-research.mjs completion fish > ~/.config/fish/completions/dsh-research.fish
```

```powershell
# PowerShell
node bin/dsh-research.mjs completion powershell | Out-String | Invoke-Expression
```

---

# 进阶

## 在容器里跑（需要 Docker）

```bash
node bin/dsh-research.mjs run bioconductor-de --workspace ./my-work
```

它会在钉死 digest 的镜像里跑，网络关闭。镜像拉不到时会**报错，不会退回本地执行**——
因为「跑了容器」和「跑了本地」是两种不同的声明。

## 用 Biomni 的 175 个工具

```bash
node bin/dsh-research.mjs run biomni-toolkit --workspace ./my-work
```

需要装好 Biomni。`doctor` 会告诉你找到没有。

## 起一个 HTTP 服务

```bash
PORT=4174 npm run serve:api
curl localhost:4174/health
curl -X POST localhost:4174/api/runs -d '{"plan": {...}}'
```

队列界面：`http://127.0.0.1:4174/api/queue/ui`

## 开认证

```bash
export DSH_AUTH_MODE=oidc
export DSH_JWKS_FILE=/path/to/jwks.json
export DSH_JWT_ISSUER=https://your-idp/realms/main
npm run serve:api
```

`docker/keycloak/realm.json` 是一个可用的测试 realm。详见 [oidc-live.md](oidc-live.md)。

---

# 常见问题

**「侧边栏没有入口」** —— 那是 DSH 插件模式。CLI 不需要 DSH，见本文。

**「步骤失败说找不到 Python」** —— 设 `DSH_RESEARCH_PYTHON`，或 `pip install -r requirements.txt`。

**「产物哈希对不上」** —— 说明文件被改过。`verify` 会报 `BROKEN`，这是它该做的。

**「authentic 一直是 false」** —— 正常。需要显式传 `trustedKeys` 才认证。

**「容器步骤报 CONTAINER_UNAVAILABLE」** —— Docker daemon 没起来。它不会退回本地执行。

**「Biomni 模块说 cannot import」** —— 缺依赖。`biomni_bridge.py list` 会列出哪些模块不可用及原因。

---

# 这个工具不做什么

| 不提供 | 说明 |
| --- | --- |
| 用户认证（CLI 模式） | 能跑命令的人就能改工作区 |
| 临床验证 | `clinicalValidationStatus` 恒为 `required-not-performed` |
| 字节级可复现 | `reproducible` 恒为 `false` |
| 合规认证 | 没有 SOC 2 / ISO / CE / NMPA |
| 防篡改 | 审计链检测意外损坏，不防有写权限的人重写 |

**这些不是待办事项，是边界。** 用法里不会遇到「开启某某功能就能合规」这种路径。
