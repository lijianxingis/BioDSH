"""Run one Biomni tool as a workbench step.

This is the join between the two halves of the project: Biomni supplies the tools, the
workbench supplies the evidence. The tool runs here, in a subprocess, and reports its
result as JSON. The workbench records that JSON, its byte count and its digest, so the
claim "this Biomni tool produced this" is backed by bytes rather than by a narrative.

Deliberately does NOT go through Biomni A1. An LLM choosing a tool is a different
provenance claim from a named tool being called with named arguments, and only the
second one can be reproduced.

Usage:
    python biomni_bridge.py list [--json PATH]
    python biomni_bridge.py describe <module> <function>
    python biomni_bridge.py call <module> <function> --args JSON [--out PATH]
"""
from __future__ import annotations

import importlib
import inspect
import json
import os
import sys
import time
import traceback

# Modules that fail to import in a minimal environment. Reported rather than hidden,
# because "the tool exists" and "the tool can run here" are different claims.
REQUIRED = {
    "bioimaging": "nibabel",
    "genetics": "torch",
    "genomics": "esm",
    "literature": "PyPDF2",
}


def package_root() -> str:
    import biomni
    return os.path.dirname(biomni.__file__)


def module_names() -> list[str]:
    tool_dir = os.path.join(package_root(), "tool")
    return sorted(
        f[:-3] for f in os.listdir(tool_dir)
        if f.endswith(".py") and not f.startswith("_")
    )


def load(module: str):
    """Import a tool module, raising a message that names the missing dependency."""
    try:
        return importlib.import_module("biomni.tool." + module)
    except ModuleNotFoundError as error:
        missing = getattr(error, "name", "?")
        hint = REQUIRED.get(module)
        detail = f" (this module needs {hint})" if hint else ""
        raise RuntimeError(f"cannot import biomni.tool.{module}: missing {missing}{detail}") from error


def functions_of(module) -> list[str]:
    out = []
    for name in dir(module):
        if name.startswith("_"):
            continue
        value = getattr(module, name)
        if inspect.isfunction(value) and getattr(value, "__module__", "").startswith("biomni.tool"):
            out.append(name)
    return sorted(out)


def describe(module_name: str, function_name: str) -> dict:
    module = load(module_name)
    fn = getattr(module, function_name, None)
    if fn is None or not callable(fn):
        raise RuntimeError(f"biomni.tool.{module_name} has no callable {function_name}")
    signature = str(inspect.signature(fn))
    doc = inspect.getdoc(fn) or ""
    params = []
    for index, (name, param) in enumerate(inspect.signature(fn).parameters.items()):
        params.append({
            "name": name,
            "required": param.default is inspect.Parameter.empty,
            "default": None if param.default is inspect.Parameter.empty else repr(param.default),
        })
    return {
        "module": module_name,
        "function": function_name,
        "signature": signature,
        "parameters": params,
        "summary": doc.strip().split("\n")[0] if doc else "",
    }


def inventory() -> dict:
    available, unavailable = [], []
    for name in module_names():
        try:
            module = load(name)
            available.append({"module": name, "functions": functions_of(module)})
        except Exception as error:
            unavailable.append({"module": name, "reason": str(error)[:160]})
    return {
        "biomniVersion": _version(),
        "available": available,
        "unavailable": unavailable,
        "availableFunctions": sum(len(m["functions"]) for m in available),
    }


def _version() -> str:
    try:
        import biomni
        return str(getattr(biomni, "__version__", "unknown"))
    except Exception:
        return "unknown"


def call(module_name: str, function_name: str, arguments: dict) -> dict:
    module = load(module_name)
    fn = getattr(module, function_name, None)
    if fn is None or not callable(fn):
        raise RuntimeError(f"biomni.tool.{module_name} has no callable {function_name}")
    started = time.time()
    value = fn(**arguments)
    elapsed = int((time.time() - started) * 1000)
    # Normalise: a tool may return a DataFrame, a tuple, a dict or a string. The record
    # has to be JSON, and it has to say what type came back rather than silently coercing.
    kind = type(value).__name__
    if hasattr(value, "to_dict"):
        payload = value.to_dict(orient="records")
    elif isinstance(value, (dict, list, str, int, float, bool)) or value is None:
        payload = value
    elif isinstance(value, tuple):
        payload = [v.to_dict(orient="records") if hasattr(v, "to_dict") else str(v) for v in value]
    else:
        payload = str(value)
    return {
        "module": module_name,
        "function": function_name,
        "arguments": arguments,
        "returnType": kind,
        "elapsedMs": elapsed,
        "result": payload,
    }


def main(argv: list[str]) -> int:
    if not argv:
        print(__doc__, file=sys.stderr)
        return 2
    command = argv[0]

    try:
        if command == "list":
            data = inventory()
            out = None
            if "--json" in argv:
                out = argv[argv.index("--json") + 1]
            text = json.dumps(data, indent=2, ensure_ascii=False)
            if out:
                open(out, "w", encoding="utf-8").write(text + "\n")
            print(json.dumps({
                "biomniVersion": data["biomniVersion"],
                "modulesAvailable": len(data["available"]),
                "modulesUnavailable": len(data["unavailable"]),
                "functions": data["availableFunctions"],
            }))
            return 0

        if command == "describe":
            print(json.dumps(describe(argv[1], argv[2]), indent=2))
            return 0

        if command == "call":
            module_name, function_name = argv[1], argv[2]
            arguments = {}
            if "--args" in argv:
                arguments = json.loads(argv[argv.index("--args") + 1])
            out = argv[argv.index("--out") + 1] if "--out" in argv else "biomni-result.json"
            record = call(module_name, function_name, arguments)
            open(out, "w", encoding="utf-8").write(json.dumps(record, indent=2, ensure_ascii=False, default=str) + "\n")
            print(json.dumps({
                "module": record["module"],
                "function": record["function"],
                "returnType": record["returnType"],
                "elapsedMs": record["elapsedMs"],
            }))
            return 0

        print(f"unknown command: {command}", file=sys.stderr)
        return 2
    except Exception as error:
        # A failing tool must fail the step, with the real reason on stderr.
        print(f"{type(error).__name__}: {error}", file=sys.stderr)
        if os.environ.get("BIOMNI_BRIDGE_TRACE"):
            traceback.print_exc()
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
