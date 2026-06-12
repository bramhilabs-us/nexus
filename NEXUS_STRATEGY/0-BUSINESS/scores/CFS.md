---
id: nexus.cfs
title: CFS — Coordination Friction Score
tier: T0
status: active
owner: founder
updated: 2026-06-11
summary: >
  The alignment-cost driver: how much does it cost to get people moving in
  the same direction? Inverted — higher score means less friction. Signals:
  decision latency, meeting load per shipped unit, dependency wait,
  re-explanation rate; survey-seeded at Measure, Nexus-telemetry-measured
  from Align onward. Size-conditioned (small co-located teams are naturally
  low-friction) and culture-calibrated (async ≠ friction). Learning loop:
  friction signals tested against milestone slippage in outcome records.
parents:
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
children: []
revisit:
  - on: "first async-culture client calibrates the working-agreement baseline (known misfit)"
    stage: always
---

# CFS — Coordination Friction Score

## 1 · Identity

**The question**: *How much does it cost to get people moving in the same direction?*
**Inverted**: higher CFS = less friction. (The family convention: every driver reads
"higher is healthier.")

## 2 · How it fits

- **Bridge position**: enabled by BRQ — rhythm is the precondition of cheap
  coordination; without cadence, every alignment is an expedition.
- **Staircase brick**: **Transform** (engine four). Begins *measuring* at Align — the
  first driver to go live from pure Nexus telemetry, no external connectors needed.
- **In BOQ**: the overhead leg — the quiet driver that explains why two equally
  productive companies feel completely different to work in.
- **Value bridge** (03_NEXUS_GAME §7): opex and management overhead — the coordination
  tax, made visible then reduced.

## 3 · Signals

| Signal | Channel | Raw form |
|---|---|---|
| Decision latency | Nexus telemetry (proposal → decision timestamps on objectives/milestones) | days, distribution not just mean |
| Meeting load per shipped unit | survey (coordination section) + calendar ingestion (later) | hours/week per completed milestone |
| Dependency wait | Nexus telemetry (blocked-task durations, block→unblock cycles) | days blocked, blocks per milestone |
| Re-explanation rate | survey + knowledge telemetry (same question re-answered) | re-asks per quarter |
| Cross-team handoff count | Nexus telemetry (task reassignments across teams) | handoffs per objective |

## 4 · Instruments

The coordination-load survey section (all three audience decks — friction looks
different from above and below); from Align: passive Nexus telemetry (planning behavior,
blocked flags, decision timestamps). Calendar/comms ingestion is a later connector,
deliberately not v1 (privacy surface, works-council exposure — see FLS §11 logic).

## 5 · Floors

| Floor | Threshold (v1) | Below it |
|---|---|---|
| Activity | ≥4 weeks of planning telemetry; ≥2 active objectives | survey-only, labeled Proxy |
| Size conditioning | <15 people: co-location makes friction structurally low — anchors size-banded; score renders with band note | wide-band warning |
| Recency | telemetry gap >2 weeks | "running on old data" |

## 6 · Anchors

Pack: `saas-product v2026.1`, size-banded. Sources: published coordination research
(meeting-load studies, decision-latency benchmarks), the Karvia case (2-person + agent —
an extreme low-friction anchor, labeled as such), consultant heuristics as informed
prior. The weakest-sourced anchors in the family v1 — flagged honestly; the cohort
matters most here.

## 7 · Provenance path

Proxy (Measure: survey sections) → **Partially Measured** (Align: Nexus planning
telemetry live) → **Measured** (Transform: full execution telemetry — blocks, decisions,
handoffs at daily granularity).

## 8 · Base model v1

```
CFS = 100 − tier_placement( friction_blend )
friction_blend = w1·decision_latency + w2·meeting_load + w3·dependency_wait
                 + w4·re_explanation + w5·handoff_count        (weights config, Σ=1)
```

v1 weights: decision latency 0.30 · meeting load 0.25 · dependency wait 0.20 ·
re-explanation 0.15 · handoffs 0.10 (informed prior: latency is the consultant's
strongest observed predictor). Distributions matter: the score uses p75, not mean — one
six-week decision hurts more than many quick ones average out.

## 9 · The learning loop

| Feedback | What it recalibrates |
|---|---|
| Milestone slippage vs friction signals in outcome records (which friction actually predicts delay?) | signal weights — latency's 0.30 prior earns its place or loses it |
| Working-agreement declarations (async vs sync operating models) | per-culture baselines — the async misfit resolves by calibration, not exception |
| Post-intervention deltas (governance changes → CFS movement) | the playbook's friction interventions ranked by measured effect — feeds NBM |

## 10 · Worked scenario (teleported)

Meridian, Align week 5. The sprint's coordination survey said "decisions take forever";
now telemetry says precisely: p75 decision latency **11 days**, 6.2 meeting-hours per
milestone, 1.8 blocks per milestone averaging 3 days. **CFS 41, Operational, Partially
Measured.** The weakest *engine* driver — and per the Bridge, the first objective
targets it (decision-rights configuration in governance: who decides what, latency SLA
on proposals). Month 5: p75 latency 4 days, CFS 58. The outcome record on that objective
is the cohort's first measured proof that decision-rights work moves CFS — one tuple
into the learning wheel, one notch of confidence for the next client's NBM.

## 11 · Gaming exposure

- **Offline decisions logged late** (decisions made in hallways, entered as instant):
  pairs with the survey pulse — when telemetry says "fast" and people say "slow," the
  triangulation gap itself flags (and is its own finding about shadow process).
- **Meeting laundering** (renaming meetings to focus time): calendar ingestion is not
  v1, so meeting load stays survey-honest; pulses keep it current.

## 12 · Known misfits

- **Remote-async companies** (archetype #12): multi-day PR-based decision latency is the
  *designed* operating model, not friction. Fix: baselines calibrate to the company's
  declared working agreement; CFS measures deviation-from-own-agreement plus outcome
  cost, never raw latency against an office-culture anchor.
- **Very small teams**: friction is structurally near-zero below ~15 people; the score
  says little — size bands keep it honest.

## 13 · Calibration log (append-only)

| Date | Change | Evidence | Ratified |
|---|---|---|---|
| 2026-06-11 | v1: five signals, weights 0.30/0.25/0.20/0.15/0.10, p75 aggregation, size bands | consultant prior; coordination research | C-016.1 |
