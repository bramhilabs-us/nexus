---
id: nexus.ars
title: ARS — AI Readiness Score
tier: T0
status: active
owner: founder
updated: 2026-06-11
summary: >
  The readiness driver: is this organization ready to use AI seriously?
  Identical to the AIR Score (one number, two contexts). Five dimensions
  (Leadership, Workforce, Process, Data, Execution), scored from audience-
  split survey decks plus observation in the two-week sprint; proxy by
  design, re-benchmarked each cycle against the moving frontier — readiness
  never saturates. Base model v1: weighted dimension blend with config
  weights; learning loop: dimension weights and question discrimination
  recalibrate against transformation outcomes.
parents:
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
children: []
revisit:
  - on: "an anchor pack edition changes the frontier definition ARS benchmarks against"
    stage: always
  - on: "the first cohort outcome data tests dimension weights (calibration log entry)"
    stage: always
---

# ARS — AI Readiness Score

## 1 · Identity

**The question**: *Is this organization ready to use AI seriously?*
**One number, two contexts**: ARS ≡ the AIR Score (C-011.4). AIR is the product name the
client sees; ARS is the same number inside the driver family.

## 2 · How it fits

- **Bridge position**: the foundation — ARS enables BRQ; nothing above it matters if the
  organization can't absorb AI leverage (low ARS → fix readiness first).
- **Staircase brick**: raised head-on at **Measure** — the two-week AIR sprint exists to
  establish it. Deliverable it feeds: the Roadmap.
- **In BOQ**: the readiness leg of the composite; usually the *first* number a company
  ever sees, so it carries the trust burden for the whole family.
- **Unique property**: **readiness never saturates** (constitution §5.4). ARS is scored
  against the *current* AI frontier, which moves; an AI-Ready company in 2026 is
  re-benchmarked against 2027's frontier. This is why measurement is a subscription —
  and why a top-band company still has a product (direct-to-Evolve, C-016.8).

## 3 · Signals

| Signal | Channel | Raw form |
|---|---|---|
| Leadership AI literacy & committed budget | survey (founder/exec deck) + interview | scored responses; budget as % of eng spend |
| Workforce AI usage distribution | survey (member deck) + tool inventory | % using AI weekly; depth-of-use tiers |
| Process documentation / SOP coverage | observation + survey | % of core workflows documented |
| Data accessibility & quality | observation + tool inventory | systems-of-record count; access latency |
| Execution discipline (ship cadence baseline) | observation + survey | release rhythm; definition-of-done existence |

## 4 · Instruments

Audience-split flashcard decks (founder/exec · manager · member — different questions,
same metric model, Article 5); sprint interviews and floor observation; the tool
inventory. Every question declares `{audience, moment, section, maps_to:[metric,weight]}`
— the bank is data, weights are config.

## 5 · Floors

| Floor | Threshold (v1, calibrate) | Below it |
|---|---|---|
| Participation | ≥60% of invited takers complete; all 3 audiences represented | "insufficient signal" on affected dimensions |
| Dimension evidence | ≥3 of 5 dimensions with at least 2 channels each | dimension renders as observed-only, flagged |
| Recency | scores expire at the next frontier edition (anchor pack) | stale badge: "scored against v2026 frontier" |
| Size | none — ARS works at any org size (the one driver that does) | — |

## 6 · Anchors

Pack: `saas-product v2026.1`. Sources: published AI-adoption research + the frontier
definition (what "serious AI use" means in 2026: AI-native workflows, ≥20
sessions/engineer/month at the top tier, AI spend governance) + Karvia as the AI-Native
exemplar (n=1, labeled). The frontier definition is the pack's most volatile element —
expect out-of-cycle editions when the tooling landscape shifts materially.

## 7 · Provenance path

**Proxy by design, permanently** — readiness is assessed (survey + observation), then
re-assessed on cadence. ARS never becomes telemetry-Measured the way BPI does; its
honesty comes from triangulation (survey × observation, §11) and recurrence (deltas
against the taker's own history). BOQ's provenance inheritance treats a current-cycle
ARS as Partially Measured; an expired one degrades to Proxy.

## 8 · Base model v1

```
ARS = Σ ( dimension_score × dimension_weight )        weights: config, Σ = 1.0
dimension_score = tier placement of its signal blend against pack anchors
```

v1 weights start equal (0.20 × 5) — the honest uninformed start at dimension level —
with the informed prior applied at *question* level (question→metric weights from the
metric model). The Day-10 scoring workshop may calibrate, never invent (Article 4):
every human adjustment cites its evidence.

## 9 · The learning loop

| Feedback | What it recalibrates |
|---|---|
| Transformation outcomes per company (did high-Leadership-score companies actually transform faster?) | dimension weights — the equal-weights prior earns its way to learned weights |
| Question discrimination across the cohort (questions that never separate companies) | question retirement / bank evolution |
| Telemetry arriving at Transform (actual AI usage vs surveyed claims) | the survey instrument's honesty calibration — telemetry quietly re-scores the baseline (the triangulation rule) |
| Re-assessment deltas | which dimensions move under which playbook interventions — feeds NBM's informed prior |

## 10 · Worked scenario (teleported)

Meridian Systems, sprint week 2. Forty-three takers across three decks (participation
81% — floor cleared); Maya's floor observation covers Process and Data; tool inventory
lands Day 4. Day-10 workshop: computed dimensions Leadership 61 · Workforce 44 ·
Process 58 · Data 49 · Execution 52; Maya adjusts Data 49→45 citing the unindexed data
warehouse found in observation (adjustment + evidence logged). **ARS = 52, Structured,
Proxy, pack v2026.1.** The Opportunity Register ranks Workforce and Data as the weakest
dimensions — company-altitude NBM, day one, prior-confidence labeled. Eleven months
later the 2027 pack ships; Meridian's 52 restates to 49 against the moved frontier —
shown as *"frontier moved; here's your position on the new ladder"* — and the
re-assessment deck greets every taker with their personal deltas.

## 11 · Gaming exposure

- **Impression management** (scoring high to look good) and **sandbagging** (scoring low
  for a heroic arc): the **triangulation rule** (03_NEXUS_GAME F13) — no stakes-bearing
  dimension scored from a single channel; observation cross-checks surveys at Measure;
  telemetry re-scores the baseline from Transform.
- **Consultant bias** (wanting a low score to sell an engagement): Article 4 — workshop
  adjustments must cite evidence, and adjustments are logged and auditable.

## 12 · Known misfits

- Services-heavy companies (Works24 archetype): dimensions apply, but Execution anchors
  assume product cadence — needs the segment's own pack before scores are comparable.
- Internal IT orgs: Leadership dimension assumes a P&L owner; semantics shift.

## 13 · Calibration log (append-only)

| Date | Change | Evidence | Ratified |
|---|---|---|---|
| 2026-06-11 | v1: equal dimension weights (0.20×5); question-level weights from the metric model | none yet — the honest start | C-016.1 |
