"""Turn literature-search.json into a Markdown evidence table.

Deliberately leaves the assessment columns empty: research design, sample size, main
finding and risk of bias need the full text and a human judgement. Filling them from a
title would be inventing evidence.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

SOURCE = "literature-search.json"
TARGET = "evidence-table.md"
ASSESSED = ("研究设计", "样本量", "主要发现", "偏倚风险")


def main() -> int:
    if not Path(SOURCE).is_file():
        print("missing input: " + SOURCE, file=sys.stderr)
        return 1
    try:
        data = json.loads(Path(SOURCE).read_text(encoding="utf-8"))
    except Exception as error:
        print("could not read " + SOURCE + ": " + str(error), file=sys.stderr)
        return 1

    records = data.get("records") or []
    if not records:
        print("the search returned no records; refusing to write an empty table", file=sys.stderr)
        return 1

    assessed = " | ".join(ASSESSED)
    separator = " | ".join("---" for _ in ASSESSED)
    lines = [
        "# 文献证据表",
        "",
        "- 检索式：`" + str(data.get("query", "")) + "`",
        "- NCBI 翻译式：`" + (str(data.get("queryTranslation")) if data.get("queryTranslation") else "(未返回)") + "`",
        "- 命中总数：" + str(data.get("totalHits", 0)),
        "- 本表收录：" + str(len(records)) + " 条",
        "- 检索时间：" + str(data.get("searchedAt", "")),
        "- 是否来自缓存：" + ("是" if data.get("fromCache") else "否"),
        "",
        "> **以下四列均未经评估** —— 研究设计、样本量、主要发现、偏倚风险需要阅读全文，由人或代理判断。",
        "> 本表只做检索结果的整理，不构成证据分级。",
        "",
        "| PMID | 年份 | 期刊 | 标题 | " + assessed + " |",
        "| --- | --- | --- | --- | " + separator + " |",
    ]
    for record in records:
        title = str(record.get("title", "")).replace("|", "\\|")
        journal = str(record.get("journal", "")).replace("|", "\\|")
        blank = " | ".join("—" for _ in ASSESSED)
        lines.append(
            "| " + str(record.get("pmid", "")) + " | " + str(record.get("year", "")) + " | "
            + journal + " | " + title + " | " + blank + " |"
        )
    lines += ["", "## 未执行", ""]
    for item in data.get("notPerformed", []):
        lines.append("- " + str(item))
    lines.append("")
    Path(TARGET).write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps({"rows": len(records), "target": TARGET}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
