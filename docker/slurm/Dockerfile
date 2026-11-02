FROM docker.m.daocloud.io/library/r-base:4.3.3

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      slurm-wlm slurm-client munge \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/munge /var/lib/munge /var/log/munge /var/run/munge \
    && dd if=/dev/urandom bs=1 count=1024 of=/etc/munge/munge.key 2>/dev/null \
    && chmod 400 /etc/munge/munge.key && chown munge:munge /etc/munge/munge.key \
    && chown -R munge:munge /var/lib/munge /var/log/munge /var/run/munge

RUN mkdir -p /var/spool/slurmctld /var/spool/slurmd /var/log/slurm /var/run/slurm \
    && chown -R slurm:slurm /var/spool/slurmctld /var/spool/slurmd /var/log/slurm /var/run/slurm

COPY slurm.conf /etc/slurm/slurm.conf
COPY cgroup.conf /etc/slurm/cgroup.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
