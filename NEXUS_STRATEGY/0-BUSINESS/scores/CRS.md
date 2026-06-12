---
id: nexus.crs
title: CRS — Consolidation Readiness Score
tier: T0
status: active
owner: founder
updated: 2026-06-11
summary: >
  The stack driver: how ready is the tool stack to consolidate onto an
  AI-native system? Renamed from KRP (C-011). Signals: tool inventory
  overlap, integration debt, capability replication time (CRT — the demoted
  signal), data portability, license spend per capability. Proxy at Measure
  (inventory), directly measured during Transform — every actual workflow
  migration is a live CRT experiment, making CRS the family's only
  self-calibrating-by-engagement driver. Learning loop: estimated vs actual
  migration outcomes.
parents:
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
children: []
revisit:
  - on: "first real workflow consolidation completes — compare estimated CRT vs actual (the self-calibration event)"
    stage: always
---

# CRS — Consolidation Readiness Score

## 1 · Identity

**The question**: *How ready is the tool stack to consolidate onto an AI-native system?*
Renamed from KRP — "Karvia Replacement Probability" was self-referential (C-011). CRS
measures the *stack's* readiness to simplify, not Nexus's chances of being bought.

## 2 · How it fits

- **Bridge position**: coupled with BPI — a consolidated stack feeds productivity
  (context lives in fewer places; CCS rises), and productivity gains fund further
  consolidation. The engine's flywheel edge.
- **Staircase brick**: **Transform** (engine four) — consolidation *happens* there,
  where CRS is high and migrations run. Sharpened from the Measure-stage inventory.
- **In BOQ**: the adaptability leg — descended from the old CRT ("how fast can an
  AI-native system replicate the 20% of capabilities producing 80% of customer value"),
  now a signal inside this driver.
- **Value bridge**: tool-spend consolidation (the $40–80k/yr stack) + capability
  replication speed — the most directly invoiceable driver after BPI.

## 3 · Signals

| Signal | Channel | Raw form |
|---|---|---|
| Tool inventory size & overlap | observation (sprint tool inventory) | tools per capability; overlap pairs |
| Integration debt | observation + interviews | point-to-point connectors; manual re-entry points |
| **CRT** — capability replication time | estimated at Measure; **measured at each Transform migration** | days to replicate a capability |
| Data portability | observation (export paths, lock-in terms) | portable / partial / locked per system |
| License spend per capability | tool inventory + finance interview | $/capability/year |

## 4 · Instruments

The sprint tool inventory (Day 3–4, per the playbook) and stack interviews at Measure;
during Transform, **the migrations themselves are the instrument** — every workflow
consolidated into Nexus (or any AI-native system) is a live CRT measurement with a
hard start and end date. CRS is the only driver whose engagement *is* its laboratory.

## 5 · Floors

| Floor | Threshold (v1) | Below it |
|---|---|---|
| Inventory completeness | ≥80% of named capabilities inventoried | "partial inventory" label |
| Measurement | CRT stays *estimated* until ≥1 real migration completes | CRT renders as estimate, labeled |
| Recency | inventory older than 2 cycles | re-inventory prompt |
| Size | none meaningful — stacks exist at all sizes | — |

## 6 · Anchors

Pack: `saas-product v2026.1`. Sources: SaaS-stack benchmarks (tools-per-employee,
spend-per-capability research), the BOQ whitepaper's CRT refinement, Karvia's own
consolidation history (what the OKR stack replaced, n=1 labeled). Mid-confidence
anchors; migration outcomes harden them fast (§9).

## 7 · Provenance path

**Proxy** (Measure: inventory + estimates) → **Measured, incrementally** (Transform:
each migration converts one CRT estimate into one CRT fact — CRS's provenance upgrades
migration by migration, the most granular provenance path in the family).

## 8 · Base model v1

```
CRS = tier_placement( w1·overlap_score + w2·integration_debt + w3·CRT
                      + w4·portability + w5·spend_efficiency )
```

v1 weights: CRT 0.30 · overlap 0.20 · integration debt 0.20 · portability 0.15 · spend
efficiency 0.15 (informed prior: replication speed is the construct's heart — the rest
is its context). Regulated-stack carve-out applies before scoring (§12).

## 9 · The learning loop

The family's cleanest loop, because the engagement generates ground truth by itself:

| Feedback | What it recalibrates |
|---|---|
| **Estimated CRT vs actual** per migration | the CRT estimator — every engagement makes the next estimate sharper (and every NBM "consolidate X, projected +n BOQ" inherits that confidence) |
| Migration outcome records (did consolidation actually move BPI/CCS?) | the Bridge's CRS↔BPI edge weight — the causal claim, tested |
| Spend deltas post-consolidation | the value-bridge collateral (real invoiced savings replace projections) |

## 10 · Worked scenario (teleported)

Meridian, Measure Day 4: inventory finds 14 tools across 9 capabilities — Jira + Linear
+ a spreadsheet all doing planning (overlap), 6 point-to-point connectors, CRT estimated
at 12 days for the planning capability. **CRS 47, Operational, Proxy.** Transform month
10: the NBM card reads *"consolidate sprint planning into Nexus — projected +4 BOQ,
confidence: medium (prior + 2 cohort migrations)."* The migration runs: actual CRT
**8 days** (estimate was 12 — logged, estimator sharpened), license spend −$31k/yr,
CCS +6 points the following quarter (the Bridge edge, evidenced). CRS re-renders at 61,
its CRT component now **Measured**. One engagement, three calibrations: the estimator,
the causal edge, and the collateral number — all from work the client paid for anyway.

## 11 · Gaming exposure

Lowest in the family — signals are observed and contractual (inventories, licenses,
dates), not self-reported behavior. Residual risk: **inventory hiding** (shadow IT
unreported); defense: telemetry from Transform surfaces tools the inventory missed
(connector traffic doesn't lie), and the gap is itself a finding.

## 12 · Known misfits

- **Regulated stacks** (#5): compliance-mandated tools *cannot* consolidate regardless
  of readiness — the score must carve out mandated systems before computing (a
  mandated tool is a constraint, not a defect). The carve-out list is part of the
  inventory instrument.
- **Hardware/embedded** (#8): toolchains (silicon EDA, vendor IDEs) have no AI-native
  replacement; same carve-out logic, wider.

## 13 · Calibration log (append-only)

| Date | Change | Evidence | Ratified |
|---|---|---|---|
| 2026-06-11 | v1: five signals, CRT weighted 0.30, regulated carve-out rule, migration-as-instrument | BOQ whitepaper CRT thesis; Karvia consolidation history | C-011, C-016.1 |
