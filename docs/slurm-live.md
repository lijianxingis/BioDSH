# 真实 Slurm 验证

`verify-slurm-live.mjs` 在真的 Slurm 集群上跑过。

## 环境

| 项 | 值 |
| --- | --- |
| Slurm | slurm-wlm 26.05.5（Debian 包） |
| 形态 | 单容器内 slurmctld + slurmd + munge |
| 节点 | `localhost`，4 CPU，2048 MB |
| 镜像 | 自建 `dsh-slurm:26.05`（从 r-base 起手） |

## 结果

```
controller-reachable                    PASS
workspace-is-mounted-in-the-scheduler   PASS
path-mapping-configured                 PASS
a-real-job-completes                    PASS
the-result-names-the-job-id             3
the-result-reports-the-scheduler-state  COMPLETED
the-result-says-where-the-state-came-from  scontrol
the-result-reports-its-isolation        PASS
the-result-is-not-claimed-reproducible  PASS
the-job-finishes-promptly               3.4s
a-batch-script-was-written              PASS
the-script-uses-the-mapped-path         uses /work
a-failing-command-fails                 FAILED
the-failure-carries-an-exit-code        1
the-failure-explains-itself             PASS
```

## 测出的三个缺陷

### 1. 只依赖 sacct

原实现从 `sacct` 读状态。但 **`sacct` 需要 slurmdbd**，最小集群不跑它：

```
Slurm accounting storage is disabled
```

`scontrol` 一直存在且报告同样的状态。现在先试 `sacct`，不可用时回退到 `scontrol`，
并在结果里写 `stateSource: "sacct" | "scontrol"`——**不能让调用者猜状态从哪来**。

### 2. Windows 上 `.cmd` 无法 spawn

```
Error: spawn EFTYPE
```

Windows 不能直接 spawn `.cmd` / `.bat`。调度器命令常常是批处理包装（模块系统、站点安装、
docker shim），所以这不是边缘情况。现在经过 `cmd.exe /d /s /c` 路由。

### 3. 容器化调度器看不到宿主路径

```
sbatch: error: Unable to open file E:\新建文件夹\...\dsh-slurm-step.slurm.sh
```

调度器在容器里，有**自己的文件系统**。给 Windows 路径它读不到。

现在有显式映射 `SLURM_PATH_MAP="宿主路径:容器路径"`。

**显式而不是猜**：猜错的后果是作业静默读错文件，比报错更糟。

## 过程中踩的坑

1. **`openssl-provider-legacy` 让 apt 失败**：r-base 镜像自带半配置的这个包，
   任何 `apt install` 都会在 configure 阶段失败。装上 `curl`/`ca-certificates` 触发它。
   去掉这两个包就好了——本地控制器不需要它们。
2. **`slurmd` 因 dbus 退出**：容器里没有 systemd，`slurmd` 尝试为 `slurmstepd` 创建 scope
   时失败。需要 `CgroupPlugin=disabled`。
3. **Slurm 26.05 拒绝旧配置键**：`CgroupPlugin` 和 `CgroupMountpoint` 不能写在 `slurm.conf`，
   只能写在 `cgroup.conf`；`FastSchedule` 已废弃；`ProctrackType` 重复声明会致命。

## 已知限制

- 单节点，没有多节点调度验证
- 没有验证资源限制（`CPUs` / `RealMemory` 设了但没测超限）
- 没有验证长时间运行（最长 3 分钟）
- 没有验证 MPI / 多任务作业
- 没有验证真实 HPC 的共享文件系统（Lustre / GPFS）
- **`scontrol` 回退路径在真实 HPC 上应该优先用 `sacct`**：`scontrol` 在作业完成后
  `MinJobAge`（默认 300 秒）就查不到了
