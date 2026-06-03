# Doc Standards

## Markdown

- ATX headings (`#`, `##`), no setext.
- Sentence case for headings except product names.
- Tables for structured info, bullets for sequences, prose for reasoning.
- Code fences with language tags always (` ```ts `, ` ```mermaid `, ` ```bash `).
- Line length: no hard limit, but break at logical clauses.

## Doc anatomy

Every strategy doc opens with:

```
# Title

**Status**: Draft | Active | Archived
**Last Updated**: YYYY-MM-DD
**Owner**: <module or role>
**Tier**: T0 | T1 | T2 | T3 | T4
**Depends on**: [link to upstream docs]
```

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
