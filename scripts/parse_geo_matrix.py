"""Parse a GEO series matrix into a clean expression CSV.

Handles the real awkwardness of these files: comment lines, quoted tab-separated
fields, a "<blank>" probe id, and missing values. Refuses to emit a matrix that is
mostly empty rather than producing something that looks like data.
"""
from __future__ import annotations

import csv
import gzip
import json
import sys
from pathlib import Path


def main() -> int:
    source = Path(sys.argv[1] if len(sys.argv) > 1 else "matrix.txt.gz")
    target = Path(sys.argv[2] if len(sys.argv) > 2 else "expression.csv")
    meta_out = Path(sys.argv[3] if len(sys.argv) > 3 else "samples.csv")

    if not source.is_file():
        print("missing input: " + str(source), file=sys.stderr)
        return 1

    opener = gzip.open if source.suffix == ".gz" else open
    with opener(source, "rt", encoding="utf-8", errors="replace") as handle:
        lines = handle.readlines()

    # Metadata lines start with "!". Collect the ones that describe the samples.
    titles, accessions, characteristics = None, None, []
    table_start = None
    for index, line in enumerate(lines):
        stripped = line.rstrip("\n")
        if stripped.startswith("!Sample_title"):
            titles = next(csv.reader([stripped], delimiter="\t"))[1:]
        elif stripped.startswith("!Sample_geo_accession"):
            accessions = next(csv.reader([stripped], delimiter="\t"))[1:]
        elif stripped.startswith("!Sample_characteristics_ch1"):
            characteristics.append(next(csv.reader([stripped], delimiter="\t"))[1:])
        elif stripped.startswith("!series_matrix_table_begin"):
            table_start = index + 1
            break

    if table_start is None:
        print("no series matrix table found", file=sys.stderr)
        return 1

    header = next(csv.reader([lines[table_start].rstrip("\n")], delimiter="\t"))
    sample_ids = header[1:]
    if len(sample_ids) < 2:
        print("the matrix has fewer than 2 samples", file=sys.stderr)
        return 1

    rows = []
    blank_ids = 0
    for line in lines[table_start + 1:]:
        stripped = line.rstrip("\n")
        if not stripped or stripped.startswith("!series_matrix_table_end"):
            break
        fields = next(csv.reader([stripped], delimiter="\t"))
        if len(fields) != len(header):
            continue
        probe = fields[0].strip()
        if not probe or probe == "<blank>":
            blank_ids += 1
            continue
        values = []
        for value in fields[1:]:
            text = value.strip()
            if text in ("", "null", "NA", "NaN"):
                values.append("")
            else:
                try:
                    values.append(repr(float(text)))
                except ValueError:
                    values.append("")
        rows.append([probe] + values)

    if not rows:
        print("no usable data rows", file=sys.stderr)
        return 1

    # A matrix that is mostly empty is not a matrix. Say so instead of writing it.
    total = len(rows) * len(sample_ids)
    missing = sum(1 for row in rows for value in row[1:] if value == "")
    if missing / total > 0.5:
        print("more than half the matrix is missing (" + str(round(100 * missing / total)) + "%)", file=sys.stderr)
        return 1

    with target.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["probe"] + sample_ids)
        writer.writerows(rows)

    # The sample sheet records what the series metadata actually said.
    with meta_out.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["sample", "title"])
        for index, sample in enumerate(sample_ids):
            title = titles[index] if titles and index < len(titles) else ""
            writer.writerow([sample, title])

    summary = {
        "probes": len(rows),
        "samples": len(sample_ids),
        "blankProbeIds": blank_ids,
        "missingValues": missing,
        "missingFraction": round(missing / total, 4),
        "titles": titles,
    }
    Path("matrix-summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"probes": len(rows), "samples": len(sample_ids), "missingFraction": summary["missingFraction"]}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
