"""Render a simple chart from the numeric summary.

This draws column means as bars. Choosing a meaningful visualisation requires knowing
the study design, which a script cannot infer. The value here is producing a real image
artifact with a checksum, not making an aesthetic or analytical decision.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

SOURCE = "numeric-summary.json"
TARGET = "analysis-chart.png"


def main() -> int:
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
    except Exception:
        print("matplotlib is not installed for " + sys.executable, file=sys.stderr)
        return 2

    if not Path(SOURCE).is_file():
        print("missing input: " + SOURCE, file=sys.stderr)
        return 1
    try:
        data = json.loads(Path(SOURCE).read_text(encoding="utf-8"))
    except Exception as error:
        print("could not read " + SOURCE + ": " + str(error), file=sys.stderr)
        return 1

    labels, means = [], []
    for file_name, columns in (data.get("files") or {}).items():
        for column, stats in columns.items():
            labels.append(file_name + ":" + column)
            means.append(stats.get("mean", 0.0))
    if not means:
        print("no numeric columns to plot", file=sys.stderr)
        return 1

    height = max(3.0, 0.32 * len(means) + 1.2)
    figure, axes = plt.subplots(figsize=(7, min(height, 10)))
    positions = range(len(means))
    axes.barh(list(positions), means, color="#2f5fd0")
    axes.set_yticks(list(positions))
    axes.set_yticklabels(labels, fontsize=8)
    axes.set_xlabel("mean")
    axes.set_title("column means (descriptive only)", fontsize=10)
    axes.invert_yaxis()
    figure.tight_layout()
    figure.savefig(TARGET, dpi=90)
    plt.close(figure)

    size = Path(TARGET).stat().st_size
    if size < 1000:
        print("the chart is suspiciously small (" + str(size) + " bytes)", file=sys.stderr)
        return 1
    print(json.dumps({"target": TARGET, "bytes": size, "bars": len(means)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
