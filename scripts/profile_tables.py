"""Profile tabular files without loading them whole."""
from __future__ import annotations

import json
import sys
from pathlib import Path

PATTERNS = ("*.csv", "*.tsv", "*.txt")
MAX_ROWS = 5000


def main() -> int:
    try:
        import pandas as pd
    except Exception:
        print(f"pandas is not installed for {sys.executable}", file=sys.stderr)
        return 2

    files = sorted({path for pattern in PATTERNS for path in Path.cwd().glob(pattern)})
    files = [path for path in files if not path.name.endswith(".json")]
    if not files:
        print("no tabular files found in the workspace", file=sys.stderr)
        return 1

    profiles = {}
    for path in files:
        separator = "\t" if path.suffix == ".tsv" else ","
        try:
            frame = pd.read_csv(path, sep=separator, nrows=MAX_ROWS)
        except Exception as error:
            print(f"{path.name}: could not read ({error})", file=sys.stderr)
            continue
        if frame.empty:
            print(f"{path.name}: no rows", file=sys.stderr)
            continue
        profiles[path.name] = {
            "rowsScanned": int(frame.shape[0]),
            "columns": int(frame.shape[1]),
            "columnNames": [str(name) for name in frame.columns[:40]],
            "missingValues": int(frame.isna().sum().sum()),
        }

    if not profiles:
        print("no usable rows in any file", file=sys.stderr)
        return 1

    Path("data-profile.json").write_text(json.dumps({"schemaVersion": 1, "files": profiles}, indent=2) + "\n", encoding="utf-8")
    first = next(iter(profiles.values()))
    print(json.dumps({"files": len(profiles), "rowsScanned": first["rowsScanned"], "columns": first["columns"]}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
