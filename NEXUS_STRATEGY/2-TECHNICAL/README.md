---
id: nexus.technical-readme
title: 2-TECHNICAL — folder index (T2)
tier: T2
status: active
owner: agent
updated: 2026-06-12
summary: >
  Folder index for the technical tier: the tech strategy (four layers, eight
  blocks), the scoring mechanics, the user journeys, the quality bar, and the
  four Karvia as-is maps. Thin index only.
parents:
  - NEXUS_STRATEGY/00_NORTH_STAR.md
children: []
revisit: []
---

# 2-TECHNICAL — the technical tier (T2)

How Nexus is built so every capability is a swappable lego block.

**The to-be architecture:**

| Doc | Owns |
|---|---|
| [TECH_STRATEGY.md](TECH_STRATEGY.md) | The tech card of the pack: four layers, eight module contracts, the stage machine, the Layer-4/iBrain seam (C-020), AssessmentProvider, handover, srishti boundary |
| [MODULARIZATION_PLAN.md](MODULARIZATION_PLAN.md) | The placement plan: every Karvia model/route/engine assigned to one of the 8 blocks, a shell, or death; AIR impl-folder layout; the outbound-notification owner (§7); Night 2 build order |
| [SCORING_MODEL.md](SCORING_MODEL.md) | The computed category's mechanics: signal store, question schema, calculator registry, anchor packs, triangulation, calibration |
| [USER_JOURNEYS.md](USER_JOURNEYS.md) | The four archetype journeys over the module contracts (playthroughs + trigger map land via N1-P3-08) |
| [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md) | The quality bar: 10 anti-patterns, 10 improvements, per-PR gates |

**The as-is maps (Karvia, read-only reference):**

| Doc | Owns |
|---|---|
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | What Karvia is: the monolith + 10 engines, deploy shape, deltas |
| [DATA_MODELS.md](DATA_MODELS.md) | All 19 schemas + per-model Nexus dispositions |
| [MODULE_DEPENDENCY_GRAPH.md](MODULE_DEPENDENCY_GRAPH.md) | Who imports what; the shadow-schema problem |
| [API_SURFACE.md](API_SURFACE.md) | All 410 routes, shape-tagged, with dispositions |
