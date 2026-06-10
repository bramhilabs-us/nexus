---
id: nexus.tests
title: tests — cross-module and journey tests
tier: T3
status: draft
owner: agent
updated: 2026-06-09
summary: >
  Workspace-level tests: the generated first-value-journey E2E walk, cross-
  module integration suites, and CI gate fixtures. Per-module contract tests
  live inside each module (src/modules/<name>/tests/contract/), not here.
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
children: []
revisit:
  - on: "the first-value journey changes in PRODUCT_STRATEGY"
    stage: N3
---

# tests — cross-module and journey tests

Tests are ground truth (hard rule 3). Coverage gates per [IMPROVEMENT_PLAN.md](../NEXUS_STRATEGY/2-TECHNICAL/IMPROVEMENT_PLAN.md) IM-5: ≥80% per changed file, contract tests block merge.
