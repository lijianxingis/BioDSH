# 容器镜像

## Bioconductor 分析镜像

`Dockerfile.bioconductor` 构建一个带 `limma` 和 `edgeR` 的 R 4.3.3 镜像。

```bash
cd docker
docker build -f Dockerfile.bioconductor -t dsh-bioc:3.18 .
```

**构建后必须钉死 digest**，因为执行规范拒绝浮动的引用：

```bash
docker image inspect dsh-bioc:3.18 --format "{{index .RepoDigests 0}}"
# dsh-bioc@sha256:cb4d683b...
```

然后把 digest 写进模板或 `VERIFY_BIOC_IMAGE` 环境变量。

## 为什么构建里跑一次 library()

构建的最后一步真的 `library(limma)` 和 `library(edgeR)`，加载失败就让构建失败。

一个声称带着某套工具链、实际加载不起来的镜像，比构建失败更糟——因为它在运行时才暴露，
而且会以"步骤失败"的形式出现，看起来像分析出了问题。

## 已知限制

- 只装了 `limma` 和 `edgeR`。其他 Bioconductor 包需要改 Dockerfile 重新构建。
- 基础镜像来自 daocloud 镜像站（Docker Hub 在本机网络下 502）。换网络时改 `FROM`。
- 镜像约 1.36 GB。
- **镜像钉死工具链，不钉死算法。** `reproducible` 仍然是 `false`。
