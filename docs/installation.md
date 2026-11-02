# 安装

## 从 GitHub 装（推荐）

在 DSH 的插件界面填：

```
github:lijianxingis/BioDSH
```

或者本地克隆后：

```bash
git clone https://github.com/lijianxingis/BioDSH.git dsh-research-workbench
cd dsh-research-workbench
npm install --ignore-scripts
npm run build
```

## 装完必须重启 DSH

**这一条不是可选的。** `package.json` 里的 `dsh.client` 声明在 DSH 进程启动时读取，
热重载不会重新读。

不重启的现象是：侧边栏没有「研究工作台」入口，但也没有任何报错。

## 验证装对了

三条命令，全绿才算装对：

```bash
node test/verify-coverage.mjs   # 打包完整
node test/verify-goal.mjs       # 引擎行为
node test/verify-host-contract.mjs
```

`verify-coverage` 会检查 `package.json` 里每个 `exports` 是否指向真实文件。**这一项是最容易
装错的**：文件存在但没在 `exports` 里声明，别人 `import 'dsh-research-workbench/host'` 就会失败。

## Python 环境

带命令的模板需要 Python 和这些包：

```bash
pip install -r requirements.txt
```

宿主按这个顺序找解释器：

1. 环境变量 `DSH_RESEARCH_PYTHON` 指定的路径
2. 会话工作区下的 `Biomni/.venv`
3. 会话工作区下的 `.venv`
4. `PATH` 里的 `python`

找不到时步骤会失败并报告原因，不会静默跳过。

## 容器后端（可选）

```bash
node test/verify-container-live.mjs
```

有 daemon 就跑真实验证，没有就跳过并说明。**默认镜像必须按 digest 钉死**——
`:latest` 会被拒绝，因为浮动的引用无法验证可复现性。

镜像拉不动时（Docker Hub 502 是常见的），用本地已有的镜像：

```bash
node test/verify-container-live.mjs --image quay.io/prometheus/busybox@sha256:7379672d...
```

## 常见问题

**侧边栏没有入口** → 没重启。

**面板空白** → 看 DSH 控制台。`lib/client.js` 是构建产物，如果仓库里的副本过期，
`npm run build` 重新生成。

**步骤说"找不到 Python"** → 设 `DSH_RESEARCH_PYTHON` 指向绝对路径。

**医疗模式报 `MEDICAL_FILES_BLOCKED`** → 这是设计。该模式不读文件、不执行代码。
