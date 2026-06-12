---
id: nexus.metrics
title: Metrics — the numbers Nexus is judged by
tier: T4
status: active
owner: agent
updated: 2026-06-10
summary: >
  Binding metric definitions: the north-star (first login → first objective
  Identified with a planned milestone), the moat metric (90-day Builder
  retention), assessment completion + taker sentiment, and the BOQ L3 signal
  rule every number must obey. Values fill from the first engagement.
parents:
  - NEXUS_STRATEGY/4-CUSTOMER/README.md
children: []
revisit:
  - on: "first engagement produces real values — set baselines and targets"
    stage: N5
  - on: "BOQ score family formulas are finalized (N4 engines)"
    stage: N4
---

# Metrics — the numbers Nexus is judged by

> Definitions are binding now; values fill from the first engagement. **The signal rule governs admission** (Article 1; scores/BOQ.md): every metric must trace to directly-measured signal data — a number that can't walk back to its signals doesn't get a row.

## The two headline metrics (PRODUCT_STRATEGY)

| Metric | Definition (precise) | Signal lineage | Baseline | Target |
|---|---|---|---|---|
| **North star — time to first value** | Consultant's first login (or org signup) → the client's **first objective at *Identified* with ≥1 planned milestone** (J1 steps 1→10) | timestamps: `crm.authenticate` first event → `milestones.create` first event per program | — | engagement: ≤ sprint + 3 days |
| **Moat — Builder retention** | % of handed-over clients with ≥1 active weekly user in Builder mode **90 days after handover** | `governance.handover` timestamp + session events per tenant | — | ≥ 50% of handovers |

## Assessment experience metrics (product metrics, not afterthoughts)

| Metric | Definition | Signal lineage | Target |
|---|---|---|---|
| **Deck completion rate** | completed decks / started decks, per assessment moment (first-time / recurring / pulse) | `assessment.deck` start + submit events | first-time ≥ 85% |
| **Taker sentiment** | post-deck pulse (the completion card's one-tap follow-up) | completion-card response | "would take again" ≥ 70% |
| **Time-in-deck** | median minutes per deck vs its declared length | deck open → submit | within ±25% of declared |

## Engagement outcome metrics (the consulting receipt)

| Metric | Definition | Signal lineage |
|---|---|---|
| **Outcome achievement** | % of closed objectives with outcome class `achieved` or `exceeded` (never KR progress %) | outcome records (`knowledge.captureOutcome`) |
| **Sustained conversion** | % of handed-off objectives reaching *Sustained* within 6 months | objective lifecycle events |
| **Assessment → engagement conversion** | % of AIR assessments converting to transformation engagements (playbook target 30–50%) | pipeline stage transitions on My Clients |

## Build-quality metrics (we measure ourselves the same way)

Defined elsewhere, reported here at each night-end groom: steps used vs 90 (EXECUTION_PLAYBOOK § measurement), IM-5 gate pass rate (must be 100%), doc-graph staleness warnings.

## Explicitly NOT metrics

Vanity counts (total logins, page views, objectives created) — a tile must change a decision (PRODUCT_STRATEGY § analytics doctrine); same bar here.
