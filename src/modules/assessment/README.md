---
id: nexus.module.assessment
title: "@nexus/assessment"
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  The pluggable AssessmentProvider interface (instruments, evidence, score, deliverables) and its implementations. AIR ships v1 under impls/air/; every future vertical is a new impl folder. Nothing AIR-specific leaks outside this module.
parents:
  - src/README.md
children: []
revisit:
  - on: "contract.ts for this module changes shape"
    stage: N2
  - on: "a new assessment vertical is commissioned"
    stage: always
---

# @nexus/assessment

The pluggable AssessmentProvider interface (instruments, evidence, score, deliverables) and its implementations. AIR ships v1 under impls/air/; every future vertical is a new impl folder. Nothing AIR-specific leaks outside this module.

Anatomy and rules: [src/README.md](../../README.md) -> [TECH_STRATEGY.md](../../../NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md). Contract-first: `contract.ts` + failing contract test land before any implementation (hard rule 7).
