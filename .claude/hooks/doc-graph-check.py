#!/usr/bin/env python3
"""Doc-graph validator — enforces NEXUS_STRATEGY/DOCUMENTATION_GRAPH.md.

Checks every governed markdown doc for: genome frontmatter, required fields,
existing + bidirectional parent/child edges, reachability from the root, and
unique ids. Warns when a child is stale relative to a recently changed parent.

Usage: python3 .claude/hooks/doc-graph-check.py   (from repo root)
Exit 0 = graph green (warnings allowed). Exit 1 = errors found.
"""

import os
import re
import subprocess
import sys

ROOT_DOC = "NEXUS_STRATEGY/00_NORTH_STAR.md"
GOVERNED_DIRS = ["NEXUS_STRATEGY", "src", "client", "tests"]
REQUIRED_FIELDS = ["id", "tier", "summary", "parents", "children"]
STALENESS_DAYS = 14
EXEMPT_PATTERNS = [
    r"NEXUS_STRATEGY/.*/diagrams/",
    r"NEXUS_STRATEGY/1-PRODUCT/design/brand/",
]


def repo_root():
    out = subprocess.run(["git", "rev-parse", "--show-toplevel"],
                         capture_output=True, text=True)
    return out.stdout.strip() or os.getcwd()


def governed_docs(root):
    docs = []
    for d in GOVERNED_DIRS:
        base = os.path.join(root, d)
        if not os.path.isdir(base):
            continue
        for dirpath, _, files in os.walk(base):
            for f in files:
                if not f.endswith(".md"):
                    continue
                rel = os.path.relpath(os.path.join(dirpath, f), root)
                if any(re.search(p, rel) for p in EXEMPT_PATTERNS):
                    continue
                docs.append(rel)
    return sorted(docs)


def parse_genome(root, rel):
    """Minimal YAML frontmatter parser for the genome's flat shape."""
    with open(os.path.join(root, rel), encoding="utf-8") as fh:
        text = fh.read()
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    block = text[3:end]
    meta = {"parents": [], "children": []}
    current_list = None
    for line in block.splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue
        m = re.match(r"^(\w[\w-]*):\s*(.*)$", line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            if val == "[]":
                meta[key] = []
                current_list = None
            elif val in ("", ">", "|"):
                current_list = key if val == "" else None
                meta.setdefault(key, [] if val == "" else "(block)")
            else:
                meta[key] = val
                current_list = None
        elif re.match(r"^\s+-\s+", line) and current_list:
            item = re.sub(r"^\s+-\s+", "", line).strip()
            if isinstance(meta.get(current_list), list):
                meta[current_list].append(item)
        elif re.match(r"^\s+\w", line) and current_list is None:
            continue  # continuation of a block scalar (summary) or nested map (revisit)
    return meta


def git_commit_time(root, rel):
    out = subprocess.run(["git", "log", "-1", "--format=%ct", "--", rel],
                         capture_output=True, text=True, cwd=root)
    val = out.stdout.strip()
    return int(val) if val.isdigit() else None


def main():
    root = repo_root()
    errors, warnings = [], []
    docs = governed_docs(root)
    genomes = {}

    for rel in docs:
        meta = parse_genome(root, rel)
        if meta is None:
            errors.append(f"{rel}: missing genome frontmatter")
            continue
        for field in REQUIRED_FIELDS:
            if field not in meta:
                errors.append(f"{rel}: missing required field '{field}'")
        genomes[rel] = meta

    # unique ids
    seen = {}
    for rel, meta in genomes.items():
        did = meta.get("id")
        if did:
            if did in seen:
                errors.append(f"duplicate id '{did}': {rel} and {seen[did]}")
            seen[did] = rel

    # edges exist + bidirectional
    for rel, meta in genomes.items():
        for p in meta.get("parents", []):
            if p not in genomes:
                errors.append(f"{rel}: parent '{p}' not found or not governed")
            elif rel not in genomes[p].get("children", []):
                errors.append(f"{rel}: parent '{p}' does not list it as a child")
        for c in meta.get("children", []):
            if c not in genomes:
                errors.append(f"{rel}: child '{c}' not found or not governed")
            elif rel not in genomes[c].get("parents", []):
                errors.append(f"{rel}: child '{c}' does not list it as a parent")

    # reachability from root
    if ROOT_DOC not in genomes:
        errors.append(f"root doc {ROOT_DOC} missing")
    else:
        reached, stack = set(), [ROOT_DOC]
        while stack:
            node = stack.pop()
            if node in reached:
                continue
            reached.add(node)
            stack.extend(c for c in genomes.get(node, {}).get("children", [])
                         if c in genomes)
        for rel in genomes:
            if rel not in reached:
                errors.append(f"{rel}: ORPHAN — not reachable from {ROOT_DOC}")

    # staleness: child older than parent by > STALENESS_DAYS
    times = {rel: git_commit_time(root, rel) for rel in genomes}
    horizon = STALENESS_DAYS * 86400
    for rel, meta in genomes.items():
        for p in meta.get("parents", []):
            tp, tc = times.get(p), times.get(rel)
            if tp and tc and tp - tc > horizon:
                warnings.append(
                    f"{rel}: stale — parent '{p}' changed >{STALENESS_DAYS}d after it")

    print(f"doc-graph: {len(genomes)} governed docs, "
          f"{len(errors)} errors, {len(warnings)} warnings")
    for e in errors:
        print(f"  ERROR  {e}")
    for w in warnings:
        print(f"  WARN   {w}")
    if not errors and not warnings:
        print("  graph green: no orphans, all edges bidirectional")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
