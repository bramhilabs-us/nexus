---
id: nexus.module.milestones
title: "@nexus/milestones"
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  Milestones per NOF: ordered (M1, M2...), ~1 week each, dated relative to
  their objective's window — no ISO weeks, no quarters. Group tasks under a
  key result; carry per-milestone check-ins (descended from Karvia
  WeeklyGoal.completions[]). Replaces Karvia's WeeklyGoal (C-008).
parents:
  - src/README.md
children: []
revisit:
  - on: "contract.ts for this module changes shape"
    stage: N2
---

# @nexus/milestones

Milestones per [NOF](../../../NEXUS_STRATEGY/1-PRODUCT/NOF.md): ordered, ~1 week each, objective-relative dates. The middle of the roll-up chain: task hours → **milestone %** → KR % → objective progress. Replaces Karvia's WeeklyGoal; Goal (quarterly) and Move (habits) were dropped (C-008).

Anatomy and rules: [src/README.md](../../README.md) -> [TECH_STRATEGY.md](../../../NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md). Contract-first: `contract.ts` + failing contract test land before any implementation (hard rule 7).
