---
id: nexus.module.tasks
title: "@nexus/tasks"
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  Atomic work units measured in hours. Task completion feeds the roll-up engine: task -> milestone -> KR -> objective -> program.
parents:
  - src/README.md
children: []
revisit:
  - on: "contract.ts for this module changes shape"
    stage: N2
---

# @nexus/tasks

Atomic work units measured in hours. Task completion feeds the roll-up engine: task -> milestone -> KR -> objective -> program.

Anatomy and rules: [src/README.md](../../README.md) -> [TECH_STRATEGY.md](../../../NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md). Contract-first: `contract.ts` + failing contract test land before any implementation (hard rule 7).
