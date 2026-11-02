#!/usr/bin/env bash
set -euo pipefail

mkdir -p /run/munge
munged --force --verbose >/var/log/munge/munged.log 2>&1 &
for i in $(seq 1 30); do
  munge -n >/dev/null 2>&1 && break
  sleep 0.5
done

slurmctld -D > /var/log/slurm/slurmctld.log 2>&1 &
for i in $(seq 1 40); do
  scontrol ping >/dev/null 2>&1 && break
  sleep 1
done

slurmd -D -N localhost > /var/log/slurm/slurmd.log 2>&1 &
for i in $(seq 1 40); do
  state=$(sinfo -h -o "%T" 2>/dev/null | head -1)
  [ "$state" = "idle" ] && break
  sleep 1
done

echo "node: $(sinfo -h -o %P,%T 2>/dev/null || echo unknown)"
tail -f /var/log/slurm/slurmctld.log
