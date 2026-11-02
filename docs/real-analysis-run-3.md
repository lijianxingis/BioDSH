# 真实运行记录（第三次，容器内）

前两次都在宿主的进程里跑。这一次的目的不同：**验证"容器执行"这个声明是不是真的**。

## 结果：发现声明是假的

第一次尝试，引擎返回：

```
status     : failed
  step     : fit-model failed exit=null
  error    : spawn Rscript ENOENT
```

`Rscript` 是**镜像里**的程序。宿主上并没有它，所以报 ENOENT。

这说明 `definePlan({ backend: "container" })` 只做了三件事：

1. 校验 image 带 digest
2. 探测 daemon 在不在
3. **然后用 `spawn(argv[0])` 在宿主上执行**

**一个声明为容器的计划，实际跑在宿主进程里，并且报告自己是容器运行。**

这是这个项目里最严重的一类缺陷：不崩溃、不报错、状态显示 completed，但整个声明是假的。

## 修复

三处必须同时改：

| 改动 | 原因 |
| --- | --- |
| 容器计划改为构造 `docker run` 调用 | 步骤的 argv 是镜像内的命令，不是宿主程序 |
| 挂载 workspace 为可写、网络关闭 | 声明的产物要能落盘；能联网的容器是另一种风险 |
| 路径翻译成容器内的写法 | Windows 上 `E:/a/b` 在 daemon 的 Linux VM 里不是绝对路径 |

第三点是被真实的错误信息逼出来的：

```
the working directory 'E:/新建文件夹/.build/r-container' is invalid,
it needs to be an absolute path
```

## 验证

## 环境

| 项 | 值 |
| --- | --- |
| 镜像 | `r-base@sha256:205aca88...`（R 4.3.3 "Angel Food Cake"） |
| 网络 | `--network none` |
| 挂载 | workspace 可写 |
| daemon | 29.5.3 |

## 分析

60 个样本、3 组（control / treated / resistant），拟合 `expression ~ group`。

```
status     : completed
  step     : fit-model completed exit=0
  artifact : model-result.json 259 B 4ba7988b526bd784
```

产物内容：

```json
{
  "rows": 60,
  "groups": 3,
  "coefficients": {
    "(Intercept)": 5.13025,
    "groupresistant": 0.9911,
    "grouptreated": 2.2012
  },
  "rSquared": 0.6229734728,
  "residualStdError": 0.7184367685,
  "rVersion": "R version 4.3.3 (2024-02-29)",
  "interpretation": "not-performed"
}
```

## 数字对不对

数据是按已知参数生成的：控制组基线 5.0，treated +2.4，resistant +1.1。

| 参数 | 真值 | 拟合 | 判断 |
| --- | --- | --- | --- |
| 截距 | 5.00 | 5.13 | 合理（噪声 ±1.2） |
| treated 效应 | +2.40 | +2.20 | 合理 |
| resistant 效应 | +1.10 | +0.99 | 合理 |
| R² | — | 0.62 | 与噪声水平相符 |

**系数落回真值附近，说明 R 真的在算，不是回显。**

## 这次运行证明了什么

- 容器路径真的启动了容器（不再是宿主进程）
- 镜像固定 digest，网络关闭
- 真实统计计算在容器内完成，结果可对照真值检验
- 产物落盘、按字节哈希登记

## 这次运行**没有**证明什么

- 没跑过 Bioconductor（多包、依赖复杂）
- 没跑过需要 `apt` 或 `BiocManager::install` 的镜像
- 没验证 GPU、大内存、长时间运行
- `reproducible` 仍然是 `false`：镜像钉死了工具链，没钉死算法

## 为什么这个缺陷值得单独记一笔

它满足了所有"看起来正常"的条件：退出状态对、产物有哈希、审计链完整。

只有把引擎指向一个**宿主上不存在的程序**，才暴露出来。

如果只用 busybox 和 `echo` 验证，这个缺陷永远不会被发现——因为 `echo` 在宿主上也有。
