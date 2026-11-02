# 真实运行记录（第四次，Bioconductor）

前三次的验证方式是"流程跑通了吗"。这一次不同：**答案是错的还是对的，可以被打分。**

## 为什么必须这么做

第三次运行（r-base 线性模型）证明容器真的启动了。但它没有证明**分析是对的**——
系数落回真值附近，只能说明 R 在算，不能说明 limma 的调用是对的。

一个把 `~ group` 写成 `~ 1` 的脚本，照样会输出一张漂亮的表。

## 方法：带真值的数据

生成的计数矩阵：

| 项 | 值 |
| --- | --- |
| 基因数 | 200 |
| 每组样本 | 4 |
| 真实差异基因 | 20（前 20 个，约 3.5 倍） |
| 其余基因 | 无差异（倍率 1.0） |
| 噪声 | 负二项式（Poisson 采样 + 每样本 size factor） |

真值集合在生成时记录下来，分析跑完后用它打分。

## 环境

| 项 | 值 |
| --- | --- |
| 镜像 | `dsh-bioc@sha256:cb4d683b...`（自建，1.36 GB） |
| 基础 | r-base 4.3.3 |
| 包 | limma 3.58.1、edgeR 4.0.16 |
| 网络 | `--network none` |
| 方法 | TMM 归一化 → voom → lmFit → eBayes |
| 阈值 | adj.P < 0.05 且 |logFC| ≥ 1 |

## 结果

```
tested=200 filtered=0 significant=20
```

打分：

| 指标 | 值 |
| --- | --- |
| 真实差异基因 | 20 |
| 检出 | 20 |
| 真阳性 | **20** |
| 假阳性 | **0** |
| 假阴性 | **0** |
| Recall | **1.000** |
| Precision | **1.000** |

产物：

- `de-results.csv` 23,501 B（200 行完整 limma 表）
- `de-summary.json` 328 B

## 这个 1.000 说明了什么

说明**调用链是对的**：计数矩阵读对了、样本表对齐了、分组因子水平对了、
对比方向对了、归一化没把信号洗掉。

这些环节任何一个错了，recall 都会掉下来。

## 这个 1.000 **不**说明什么

- **不说明真实数据上也能到 1.000。** 生成数据比真实 RNA-seq 干净得多
- **不说明阈值选得对。** 0.05 / 1 是报告惯例，不是发现
- **不说明生物学解释。** `biologicalInterpretation: "not-performed"` 是常量
- 不说明 limma 比 edgeR 好，两个都装了但只用了一个

**在真实数据上，recall 不会是这个数。** 这一条要写清楚，否则 1.000 会被当成能力证明。

## 过程中抓到的两个错

### 1. 我的 CSV 解析器读不到列

第一次检查输出：

```
called         : 0
false negatives: 20
recall         : 0.000
```

看起来像 limma 全错。实际是 `write.csv` 会给列名加引号：

```
"logFC","AveExpr","t","P.Value","adj.P.Val","B","gene"
```

我按逗号 split，`indexOf("gene")` 返回 -1。**分析是对的，读取器是错的。**

修好解析器之后 recall 立刻变成 1.000。

### 2. 镜像构建失败在 shell 引号

```
/bin/sh: 1: Syntax error: ")" unexpected
```

`RUN R --slave -e "..."` 里的 R 代码含括号和引号，被 shell 吃掉了。
改成把检查写进 `check-bioc.R` 再用 `RUN Rscript /opt/check-bioc.R`。

顺带的好处：失败信息从一行 shell 报错变成了 R 的错误，好读得多。

## 镜像为什么要一起提交

`docker/Dockerfile.bioconductor` 在仓库里。

**一个别人无法重建的镜像不叫可复现，叫钉死的谜。**

## 已知限制

- 只装了 limma 和 edgeR。其他 Bioconductor 包要改 Dockerfile
- 基础镜像走 daocloud 镜像站（本机网络下 Docker Hub 返回 502）
- 没验证 GPU、长任务、大内存
- `reproducible` 仍是 `false`：镜像钉死工具链，不钉死算法
