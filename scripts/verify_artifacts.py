"""Verify that the declared artifacts exist and record their checksums.

The last step of a workflow should confirm, not re-assert. A missing artifact is a
failure: a report that claims a file exists without checking is a claim, not evidence.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path


def main(argv: list[str]) -> int:
    if not argv:
        print("name at least one artifact to verify", file=sys.stderr)
        return 1

    verified, missing = [], []
    for name in argv:
        path = Path(name)
        if not path.is_file():
            missing.append(name)
            continue
        verified.append({
            "path": name,
            "bytes": path.stat().st_size,
            "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        })

    report = {"schemaVersion": 1, "verified": verified, "missing": missing}
    Path("artifacts.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    if missing:
        print("missing artifacts: " + ", ".join(missing), file=sys.stderr)
        return 1
    print(json.dumps({"verified": len(verified)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
