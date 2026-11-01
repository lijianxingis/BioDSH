"""Write a JSON summary of the sequence files in the workspace."""
from __future__ import annotations

import json
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

    counts = {}
    for path in files:
        try:
            counts[path.name] = sum(1 for _ in SeqIO.parse(str(path), "fasta" if path.suffix in {".fasta", ".fa", ".fna"} else "fastq"))
        except Exception as error:
            print(f"{path.name}: could not parse ({error})", file=sys.stderr)

    total = sum(counts.values())
    if total == 0:
        print("no records were read, refusing to write an empty summary", file=sys.stderr)
        return 1

    report = {"schemaVersion": 1, "fileCount": len(counts), "totalRecords": total, "files": counts}
    Path("sequence-summary.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"fileCount": len(counts), "totalRecords": total}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
