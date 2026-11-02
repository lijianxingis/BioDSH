"""Search PubMed through the public E-utilities API.

Records three things so the search is reproducible: the query as typed, the query as
NCBI translated it, and the moment of the search. Caches by query and page size so a
repeated search does not hit the service again, and says in the artifact whether the
result came from the cache.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
CACHE_TTL = 86400
CACHE_FILE = ".pubmed-cache.json"


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "dsh-research-workbench"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def cache_key(query: str, limit: int) -> str:
    return hashlib.sha256((query + "|" + str(limit)).encode()).hexdigest()


def read_cache() -> dict:
    try:
        return json.loads(Path(CACHE_FILE).read_text(encoding="utf-8"))
    except Exception:
        return {}


def write_cache(cache: dict) -> None:
    try:
        Path(CACHE_FILE).write_text(json.dumps(cache), encoding="utf-8")
    except Exception as error:  # a cache that cannot be written is not a failure
        print("warning: could not write the cache (" + str(error) + ")", file=sys.stderr)


def main() -> int:
    parser = argparse.ArgumentParser(description="Search PubMed and write the results.")
    parser.add_argument("query", help="the search terms")
    parser.add_argument("--max", type=int, default=10, help="how many records to return")
    parser.add_argument("--no-cache", action="store_true", help="ignore a cached result")
    args = parser.parse_args()

    query = args.query.strip()
    if not query:
        print("the query must not be empty", file=sys.stderr)
        return 1
    limit = max(1, min(args.max, 100))

    cache = {} if args.no_cache else read_cache()
    key = cache_key(query, limit)
    cached = cache.get(key)
    from_cache = False
    if cached and time.time() - cached.get("at", 0) < CACHE_TTL:
        payload = cached["payload"]
        from_cache = True
    else:
        # esearch first: it reports the total and the translation, which is what makes
        # the search reproducible.
        search_url = BASE + "/esearch.fcgi?" + urllib.parse.urlencode({
            "db": "pubmed", "term": query, "retmax": limit, "retmode": "json",
        })
        try:
            search = json.loads(fetch(search_url))
        except Exception as error:
            print("could not reach PubMed: " + str(error), file=sys.stderr)
            return 3
        result = search.get("esearchresult", {})
        ids = result.get("idlist", [])
        total = int(result.get("count", "0"))
        translated = result.get("querytranslation", "")
        records = []
        if ids:
            fetch_url = BASE + "/efetch.fcgi?" + urllib.parse.urlencode({
                "db": "pubmed", "id": ",".join(ids), "retmode": "xml",
            })
            try:
                root = ET.fromstring(fetch(fetch_url))
            except Exception as error:
                print("could not fetch records: " + str(error), file=sys.stderr)
                return 3
            for article in root.findall(".//PubmedArticle"):
                pmid = article.findtext(".//PMID") or ""
                node = article.find(".//ArticleTitle")
                title = "".join(node.itertext()) if node is not None else ""
                journal = article.findtext(".//Journal/Title") or ""
                year = article.findtext(".//PubDate/Year") or article.findtext(".//PubDate/MedlineDate") or ""
                records.append({"pmid": pmid, "title": title.strip(), "journal": journal.strip(), "year": year.strip()})
        payload = {
            "query": query,
            "queryTranslation": translated,
            "totalHits": total,
            "returned": len(records),
            "records": records,
            "searchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }
        if not args.no_cache:
            cache[key] = {"at": time.time(), "payload": payload}
            write_cache(cache)

    if payload["returned"] == 0:
        print("no records matched: " + query, file=sys.stderr)
        return 1

    artifact = dict(payload)
    artifact["fromCache"] = from_cache
    artifact["notPerformed"] = [
        "evidence grading",
        "inclusion/exclusion decisions",
        "risk-of-bias assessment",
        "citation verification against full text",
    ]
    Path("literature-search.json").write_text(json.dumps(artifact, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "totalHits": payload["totalHits"],
        "returned": payload["returned"],
        "fromCache": from_cache,
        "translated": bool(payload["queryTranslation"]),
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
