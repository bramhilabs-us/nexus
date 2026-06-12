---
id: nexus.delivery-readme
title: 3-DELIVERY — folder index (T3)
tier: T3
status: active
owner: agent
updated: 2026-06-12
summary: >
  Folder index for the delivery tier: the execution playbook (105-step phase
  budgets, session types) and the three process docs (sprint cycle, release
  train, CI/CD). Thin index only.
parents:
  - NEXUS_STRATEGY/00_NORTH_STAR.md
children: []
revisit: []
---

# 3-DELIVERY — the delivery tier (T3)

How ≤105 sessions become a deployed product.

| Doc | Owns |
|---|---|
| [EXECUTION_PLAYBOOK.md](EXECUTION_PLAYBOOK.md) | The execution card of the pack: 5 session types, the 105-step phase budgets, the pack-of-cards rule |
| [SPRINT_PROCESS.md](SPRINT_PROCESS.md) | The per-night cycle, the card chain, definition of done |
| [RELEASE_PROCESS.md](RELEASE_PROCESS.md) | Two environments, the release train, the <5-min rollback shape |
| [CI_CD.md](CI_CD.md) | The IM-5 gates as pipeline jobs, deploy legs |

The live loop state lives in `_agent/` (JOURNAL, BACKLOG, DECISIONS, NEXT_SESSION) — operational files, deliberately outside the doc graph.
