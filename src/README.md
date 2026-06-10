---
id: nexus.src
title: src — the Nexus server workspace
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  The single Express app (C-003), TypeScript strict (C-004). Eight lego-block
  modules under src/modules/, each following the contract-first anatomy from
  TECH_STRATEGY: contract.ts is the only cross-module import surface.
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
children:
  - src/modules/crm/README.md
  - src/modules/assessment/README.md
  - src/modules/objectives/README.md
  - src/modules/key-results/README.md
  - src/modules/weekly-goals/README.md
  - src/modules/tasks/README.md
  - src/modules/governance/README.md
  - src/modules/knowledge/README.md
revisit:
  - on: "Night 2 toolchain session lands (pnpm workspace, tsconfig, CI gates)"
    stage: N2
---

# src — the Nexus server workspace

One process, eight modules. Code arrives in Night 2; this skeleton exists so every module has a governed home in the document graph from day one.

Every module follows the anatomy in [TECH_STRATEGY.md](../NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md):

```
src/modules/<name>/
├── contract.ts        ← the ONLY import other modules may touch
├── models/            ← private Mongoose schemas (never imported cross-module, AP-1)
├── service.ts         ← business logic
├── routes.ts          ← HTTP edge, zod-validated (IM-3)
├── events.ts          ← domain events emitted/consumed
└── tests/contract/    ← contract tests (IM-2)
```

Hard rules: no cross-module model imports (lint-enforced), contract + failing contract test before implementation (hard rule 7), every PR passes the gates in [IMPROVEMENT_PLAN.md](../NEXUS_STRATEGY/2-TECHNICAL/IMPROVEMENT_PLAN.md).
