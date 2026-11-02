"""Write a reader-facing report from the artifacts already produced.

This restates numbers that were already computed and recorded. It does not re-analyse
anything, and it refuses to run when an expected input is missing rather than emitting
an empty report that looks successful.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

# Every artifact this report may draw on. Absent ones are named, not silently skipped.
SOURCES = ("sequence-summary.json", "data-profile.json", "numeric-summary.json", "literature-search.json")
TARGET = "report.md"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    present = [name for name in SOURCES if Path(name).is_file()]
    if not present:
        print("none of the expected inputs exist: " + ", ".join(SOURCES), file=sys.stderr)
        return 1

    lines = ["# 分析报告", "", "## 来源", ""]
    for name in present:
        size = Path(name).stat().st_size
        lines.append("- `" + name + "` · " + str(size) + " B · sha256 `" + digest(Path(name))[:16] + "`")
    missing = [name for name in SOURCES if name not in present]
    if missing:
        lines += ["", "## 未产出", ""]
        for name in missing:
            lines.append("- `" + name + "`")

    if "sequence-summary.json" in present:
        data = json.loads(Path("sequence-summary.json").read_text(encoding="utf-8"))
        lines += ["", "## 序列", ""]
        lines.append("- 文件数：" + str(data.get("fileCount", 0)))
        lines.append("- 记录总数：" + str(data.get("totalRecords", 0)))
        for name, count in (data.get("files") or {}).items():
            lines.append("- `" + str(name) + "`：" + str(count) + " 条")

    if "data-profile.json" in present:
        data = json.loads(Path("data-profile.json").read_text(encoding="utf-8"))
        lines += ["", "## 表格", ""]
        for name, profile in (data.get("files") or {}).items():
            rows = str(profile.get("rowsScanned", 0))
            columns = str(profile.get("columns", 0))
            blanks = str(profile.get("missingValues", 0))
            lines.append("- `" + name + "`：" + rows + " 行 × " + columns + " 列，缺失值 " + blanks)

    if "numeric-summary.json" in present:
        data = json.loads(Path("numeric-summary.json").read_text(encoding="utf-8"))
        lines += ["", "## 数值列", ""]
        for name, columns in (data.get("files") or {}).items():
            lines.append("### " + name)
            for column, stats in columns.items():
                detail = ("- `" + column + "`：n=" + str(stats.get("count", 0))
                          + "，mean=" + str(stats.get("mean"))
                          + "，min=" + str(stats.get("min"))
                          + "，max=" + str(stats.get("max")))
                lines.append(detail)
            lines.append("")

    if "literature-search.json" in present:
        data = json.loads(Path("literature-search.json").read_text(encoding="utf-8"))
        lines += ["", "## 文献检索", ""]
        lines.append("- 检索式：`" + str(data.get("query", "")) + "`")
        lines.append("- 命中总数：" + str(data.get("totalHits", 0)))
        lines.append("- 本表收录：" + str(data.get("returned", 0)))
        lines.append("- **证据分级、纳入排除、偏倚评估均未执行**")

    lines += [
        "",
        "## 边界",
        "",
        "本报告只重述已计算出的数字，不做结论：方法选择、统计假设与生物学解释需由人复核。",
        "",
    ]
    Path(TARGET).write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"target": TARGET, "sources": len(present), "missing": len(missing)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
