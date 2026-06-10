---
id: nexus.module.key-results
title: "@nexus/key-results"
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  The KR of OKR. Standalone collection only (no embedded dual-write, AP-4). Metric types: number, percent, boolean, currency; ~25% objective weighting default.
parents:
  - src/README.md
children: []
revisit:
  - on: "contract.ts for this module changes shape"
    stage: N2
---

# @nexus/key-results

The KR of OKR. Standalone collection only (no embedded dual-write, AP-4). Metric types: number, percent, boolean, currency; ~25% objective weighting default.

Anatomy and rules: [src/README.md](../../README.md) -> [TECH_STRATEGY.md](../../../NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md). Contract-first: `contract.ts` + failing contract test land before any implementation (hard rule 7).
