---
id: nexus.module.knowledge
title: "@nexus/knowledge"
tier: T2
status: draft
owner: agent
updated: 2026-06-09
summary: >
  Institutional knowledge capture and outcome evidence (BRAMHI baseline snapshots, handover records). Owns the srishti integration seam (TQ-3): attachment refs + event feed, OPTIONAL dependency with tested fallback.
parents:
  - src/README.md
children: []
revisit:
  - on: "contract.ts for this module changes shape"
    stage: N2
---

# @nexus/knowledge

Institutional knowledge capture and outcome evidence (BRAMHI baseline snapshots, handover records). Owns the srishti integration seam (TQ-3): attachment refs + event feed, OPTIONAL dependency with tested fallback.

Anatomy and rules: [src/README.md](../../README.md) -> [TECH_STRATEGY.md](../../../NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md). Contract-first: `contract.ts` + failing contract test land before any implementation (hard rule 7).
