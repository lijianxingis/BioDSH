"""Locate the Biomni data lake without hard-coding one machine's path."""
from __future__ import annotations

import os
from pathlib import Path


def find_lake() -> Path | None:
    override = os.environ.get("BIOMNI_DATA_LAKE")
    if override:
        candidate = Path(override)
        return candidate if candidate.is_dir() else None
    here = Path.cwd()
    for root in (here, *here.parents):
        for relative in ("Biomni/data/biomni_data/data_lake", "data/biomni_data/data_lake"):
            candidate = root / relative
            if candidate.is_dir():
                return candidate
    return None
