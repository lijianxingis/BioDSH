"""Scan the workspace for sequence files and report what is really there.

Exits non-zero when nothing is found. A run that "succeeds" while analysing zero
records is worse than one that fails: the first looks like a result.
"""
from __future__ import annotations

import sys
from pathlib import Path

PATTERNS = ("*.fasta", "*.fa", "*.fna", "*.fastq", "*.fq")


def main() -> int:
    try:
        from Bio import SeqIO
    except Exception:
        print(f"biopython is not installed for {sys.executable}", file=sys.stderr)
        return 2

    files = sorted({path for pattern in PATTERNS for path in Path.cwd().glob(pattern)})
    if not files:
        print("no sequence files found in the workspace", file=sys.stderr)
        return 1

    total = 0
    empty = []
    for path in files:
        try:
            count = sum(1 for _ in SeqIO.parse(str(path), "fasta" if path.suffix in {".fasta", ".fa", ".fna"} else "fastq"))
        except Exception as error:
            print(f"{path.name}: could not parse ({error})", file=sys.stderr)
            continue
        if count == 0:
            empty.append(path.name)
            print(f"{path.name}: EMPTY", file=sys.stderr)
            continue
        total += count
        print(f"{path.name}: {count} records")

    if total == 0:
        print("no records were read from any file", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
