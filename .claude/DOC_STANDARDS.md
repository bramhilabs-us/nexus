# Doc Standards

## Markdown

- ATX headings (`#`, `##`), no setext.
- Sentence case for headings except product names.
- Tables for structured info, bullets for sequences, prose for reasoning.
- Code fences with language tags always (` ```ts `, ` ```mermaid `, ` ```bash `).
- Line length: no hard limit, but break at logical clauses.

## Doc anatomy

Every governed doc (in `NEXUS_STRATEGY/`, `src/`, `client/`, `tests/`) opens with the **genome frontmatter** — the full spec lives in `NEXUS_STRATEGY/DOCUMENTATION_GRAPH.md`:

```yaml
---
id: nexus.<slug>
title: <human title>
tier: T0 | T1 | T2 | T3 | T4
status: draft | active | archived
owner: founder | agent | <module>
updated: YYYY-MM-DD
summary: >
  1–3 lines: what is IN this document
parents: [paths]      # bidirectional with children; validated
children: [paths]
revisit:
  - on: "<trigger>"
    stage: N2..N5 | always
---
```

`python3 .claude/hooks/doc-graph-check.py` must be green before any close. New docs must be wired into the graph (parent updated in the same PR).

Then:

1. **Purpose** — one paragraph: what this doc decides or describes
2. **TL;DR** — 3–5 bullets, the answer if someone reads only this
3. **Body** — the actual content
4. **Open questions** — explicit list, links to `clarifications.md` if applicable

## Diagrams (Mermaid)

- Keep each diagram under ~25 nodes. If larger, split.
- Source `.mmd` in `2-TECHNICAL/diagrams/`. Embedded in `.md` via fenced block.
- Title every diagram. Caption it below.

## Doc-to-code coupling

When a code change invalidates a doc, the doc update is part of the same PR. Stale docs are bugs.
