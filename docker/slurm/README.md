# Slurm 测试集群

单容器内跑 slurmctld + slurmd + munge，用来验证 `lib/executors-builtin.js` 的 Slurm 后端。

```bash
docker build -t dsh-slurm:26.05 docker/slurm
docker run -d --name dsh-slurm --hostname localhost \
  -v "$PWD/.build/slurm-run:/work" dsh-slurm:26.05
```

## 为什么不是现成镜像

`giovtorres/slurm-docker-cluster` 之类在 daocloud 镜像站返回 403。从 r-base 起手自己装，
得到的是一模一样的 Debian 包（slurm-wlm 26.05.5）。

## 三个必须改的配置

| 问题 | 改法 |
| --- | --- |
| `openssl-provider-legacy` 让 apt 失败 | 不要装 `curl` / `ca-certificates` |
| `slurmd` 因 dbus 退出 | `cgroup.conf` 里 `CgroupPlugin=disabled` |
| 26.05 拒绝旧键 | `CgroupPlugin` 只能写 `cgroup.conf`，删掉 `FastSchedule` |
