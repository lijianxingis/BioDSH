"""Describe the numeric columns of the tabular files in the workspace."""
from __future__ import annotations

import json
import sys
from pathlib import Path

PATTERNS = ("*.csv", "*.tsv")


def main() -> int:
    try:
        import pandas as pd
    except Exception:
        print("pandas is not installed for " + sys.executable, file=sys.stderr)
        return 2

    files = sorted({path for pattern in PATTERNS for path in Path.cwd().glob(pattern)})
    if not files:
        print("no tabular files found in the workspace", file=sys.stderr)
        return 1

    summary = {}
    for path in files:
        separator = "\t" if path.suffix == ".tsv" else ","
        try:
            frame = pd.read_csv(path, sep=separator, nrows=5000)
        except Exception as error:
            print(path.name + ": could not read (" + str(error) + ")", file=sys.stderr)
            continue
        numeric = frame.select_dtypes(include="number")
        if numeric.empty:
            continue
        columns = {}
        for name in numeric.columns:
            series = numeric[name].dropna()
            if series.empty:
                continue
            columns[str(name)] = {
                "count": int(series.count()),
                "mean": round(float(series.mean()), 6),
                "std": round(float(series.std()), 6) if len(series) > 1 else 0.0,
                "min": round(float(series.min()), 6),
                "max": round(float(series.max()), 6),
            }
        if columns:
            summary[path.name] = columns

    if not summary:
        print("no numeric columns were found", file=sys.stderr)
        return 1

    Path("numeric-summary.json").write_text(
        json.dumps({"schemaVersion": 1, "files": summary}, indent=2) + "\n", encoding="utf-8")
    first = next(iter(summary.values()))
    print(json.dumps({"files": len(summary), "numericColumns": len(first)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
