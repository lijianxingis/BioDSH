# 真实 Kubernetes 验证

`verify-kubernetes-live.mjs` 在真的 k3s 集群上跑过。这里记录怎么复现，以及**测出了什么**。

## 环境

| 项 | 值 |
| --- | --- |
| 集群 | k3s v1.29.5+k3s1（容器内，单节点） |
| 被测镜像 | `busybox@sha256:a46257e0...`（本地导入，不依赖拉取） |

## 结果

```
cluster-reachable                          PASS
refuses-an-unpinned-image                  PASS
a-real-job-completes                       PASS
the-result-names-the-job                   dsh-probe-mvzc2s81
the-result-reports-its-isolation           PASS
no-service-account-token-is-minted         PASS
the-result-is-not-claimed-reproducible     PASS
a-failing-command-fails                    Failed
a-failure-does-not-wait-for-the-timeout    5.5s
the-failure-explains-itself                PASS
the-cluster-confirms-no-token-mount        false
```

## 测出的缺陷

**失败作业会一直等到超时。**

原来的实现只等 `condition=complete`：

```bash
kubectl wait --for=condition=complete --timeout=600s job/<name>
```

问题是**失败的作业永远不会变成 complete**，它变成 failed。所以一个 5 秒就失败的步骤，
要挂到 600 秒超时才返回——而且返回的错误是「超时」而不是「失败」，把原因指错了地方。

实测：两个 `false` 命令的作业，7 分钟后还是 `0/1` 挂在那里。

修复后轮询两种终态。现在 5.5 秒返回 `Failed`，错误写着「the Kubernetes job failed
(pod failures: 1)」。

## 从集群侧确认隔离

执行器报告 `serviceAccountToken: not-mounted` 是它自己的说法。验证脚本直接问集群：

```bash
kubectl get job <name> -o jsonpath={.spec.template.spec.automountServiceAccountToken}
# false
```

**代码说一套、集群说一套是常见的假声明**，所以这条检查必须来自集群而不是来自被测代码。

## 过程中踩的坑

1. **k3s 内部 containerd 拉不到镜像**：主机 Docker 走镜像站，但 k3s 有独立的 containerd，
   `docker.io` 解析到 127.0.0.1 直接连接被拒。需要 `registries.yaml` 配置镜像源。
2. **pause 镜像**：k3s 创建 pod sandbox 需要 `rancher/mirrored-pause`，同样拉不到。
3. **本地导入镜像**：`docker save` + 导入 k3s，避免测试镜像依赖网络。

## 已知限制

- 单节点，没有调度到多节点的验证
- 没有验证资源限制（`requests` 设了但没测超限行为）
- 没有验证长时间运行（最长测到 3 分钟）
- 没验证 PV/PVC 挂载——**当前执行器用 emptyDir，产物不跨 pod 持久化**，这是设计选择，
  也意味着它不能替代需要共享文件系统的流程
