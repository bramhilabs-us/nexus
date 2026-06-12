# Nexus — the Transformation OS

**BRAMHI Labs** · the delivery system for AI transformation consulting, handed over as the client's project-management OS. A fork of `karvia_business` in lineage, a different product in design.

## The repo, in one table

| Folder | What it is | Start at |
|---|---|---|
| [NEXUS_STRATEGY/](NEXUS_STRATEGY/README.md) | **The brain** — every strategy, product, technical, delivery, and customer document (T0–T4), graph-governed | [00_NORTH_STAR.md](NEXUS_STRATEGY/00_NORTH_STAR.md) |
| [src/](src/README.md) | **The implementation** — the eight lego-block modules (contract-first, TypeScript strict) | [src/README.md](src/README.md) |
| [client/](client/README.md) | The UI shell (vanilla JS v1, token-first CSS) | [client/README.md](client/README.md) |
| [tests/](tests/README.md) | Contract, unit, and E2E suites — tests are ground truth | [tests/README.md](tests/README.md) |
| `_agent/` | The autonomous loop's state: JOURNAL, BACKLOG, DECISIONS, NEXT_SESSION, clarifications, audits | `_agent/JOURNAL.md` |
| `_source/` | Frozen Karvia reference snapshot (read-only, secrets redacted) | — |

## The rules that bind everything

1. The constitution — [NEXUS_STRATEGY/01_NEXUS_MODEL.md](NEXUS_STRATEGY/01_NEXUS_MODEL.md) — wins every documentation conflict (C-014).
2. Docs are graph-governed: `python3 .claude/hooks/doc-graph-check.py` must be green on every PR.
3. `karvia_business/` (outside this repo) is read-only reference, forever.
4. Agent operating rules: [.claude/CLAUDE.md](.claude/CLAUDE.md) · session shape: `.claude/SESSION_PRACTICES.md`.
