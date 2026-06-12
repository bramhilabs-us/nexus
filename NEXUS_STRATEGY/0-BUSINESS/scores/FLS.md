---
id: nexus.fls
title: FLS — Founder Leverage Score
tier: T0
status: active
owner: founder
updated: 2026-06-11
summary: >
  The leverage driver: does the company run through one person, or does it
  run? Inverted — higher means healthier (less founder-bottleneck). Signals:
  decision-routing concentration, approval latency through the founder,
  single-owner spread, bus-factor sections. Heavily size-conditioned —
  founder-routing is appropriate structure below ~30 people. The family's
  most emotionally loaded gauge: bedside-manner rules apply hardest here
  (the implicated see it first). Learning loop: delegation interventions
  tested against latency and retention outcomes.
parents:
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
children: []
revisit:
  - on: "first founder-facing FLS delivery — test the bedside-manner rules against a real reaction"
    stage: always
---

# FLS — Founder Leverage Score

## 1 · Identity

**The question**: *Does the company run through one person, or does it run?*
**Inverted**: higher FLS = healthier — decisions, knowledge, and authority distributed
enough that the founder is leverage, not bottleneck.

## 2 · How it fits

- **Bridge position**: enabled by BRQ (cadence is what makes delegation safe — a rhythm
  the founder can trust replaces the founder's constant touch).
- **Staircase brick**: **Transform** (engine four); begins measuring at Align, where
  planning telemetry first shows who actually decides.
- **In BOQ**: the resilience leg. For owner-led companies it is also the most
  *personally* valuable number — an owner eyeing succession or sale is buying exactly
  this driver (key-man risk is a valuation discount; the value bridge,
  03_NEXUS_GAME §7).
- **The emotional load**: FLS tells the most powerful person in the room that they are
  the constraint. Every bedside-manner rule (03_NEXUS_GAME §6.5) applies hardest here —
  the implicated see it first, trend before position, never a verdict without a path.

## 3 · Signals

| Signal | Channel | Raw form |
|---|---|---|
| Decision-routing concentration | Nexus telemetry (who decides on objectives/milestones) | % of decisions through one person; Gini-style concentration |
| Approval latency through the founder | Nexus telemetry (founder-gated approvals: proposal → decision) | days, vs non-founder-gated baseline |
| Single-owner spread | Nexus telemetry (entities personally owned by the founder) | objectives/areas owned by one person |
| Escalation rate | Nexus telemetry (items re-routed upward) | escalations per objective |
| Bus-factor perception | survey (founder-bottleneck sections, all three decks — the gap between the founder's self-read and the team's read is itself a signal) | scored responses + the delta between decks |

## 4 · Instruments

The founder-bottleneck survey sections (audience-split deliberately: founders
self-assess high; the manager/member decks correct); decision-routing observation during
the sprint; from Align, passive planning telemetry. No comms surveillance — routing is
read from Nexus's own decision objects only (the appraisal posture, C-016.4, governs
hard here).

## 5 · Floors

| Floor | Threshold (v1) | Below it |
|---|---|---|
| **Size conditioning** (the binding one) | <30 people: founder-routing is *appropriate structure* — anchors size-banded; below ~10, FLS renders as informational only, never entering BOQ unclamped | stage-appropriate banding, stated on the gauge |
| Activity | ≥4 weeks of decision telemetry; ≥10 routed decisions | survey-only, Proxy |
| Recency | gap >3 weeks | "running on old data" |

## 6 · Anchors

Pack: `saas-product v2026.1`, size-banded (the most size-sensitive anchors in the
family). Sources: organizational research on delegation and span-of-control (informed
prior), succession/key-man valuation literature, consultant heuristics. No Karvia anchor
— a 2-person company has no meaningful FLS (its own size-band exemption, applied to
ourselves; the dogfood note in the constitution's honest limits).

## 7 · Provenance path

Proxy (Measure: the three-deck survey triangulation) → **Partially Measured** (Align:
planning telemetry shows real routing) → **Measured** (Transform: daily-granularity
decision flow). The deck-delta signal (founder's self-read vs team's read) stays alive
at every stage — it is the cheapest early-warning gauge in the family.

## 8 · Base model v1

```
FLS = 100 − tier_placement( w1·routing_concentration + w2·founder_latency_premium
                            + w3·owner_spread + w4·escalation_rate + w5·bus_factor )
```

v1 weights: routing concentration 0.30 · founder latency premium 0.25 · owner spread
0.20 · escalation rate 0.10 · bus-factor perception 0.15 — all against **size-banded**
anchors (the same concentration that scores 35 at 200 people scores 70 at 25 people,
because it should).

## 9 · The learning loop

| Feedback | What it recalibrates |
|---|---|
| Delegation interventions vs latency movement (decision-rights changes → did the founder premium actually fall?) | the playbook's FLS interventions, ranked by measured effect |
| FLS vs downstream outcomes in the cohort (retention, velocity, valuation events) | the construct's weight in NBM's company-altitude advice |
| Deck-delta convergence (founder self-read approaching team read) | whether transparency itself improves the driver — the gauge as intervention |
| Size-band boundaries against cohort reality | the ~30-person threshold is a prior, not a fact — the cohort sets the real curve |

## 10 · Worked scenario (teleported)

Meridian, Align week 6. Tom's deck self-scored his bottleneck risk "moderate"; the
manager and member decks both said "high" — the delta logged. Telemetry confirms the
team: 64% of milestone decisions route through Tom; founder-gated approvals run 6 days
vs 1.5 for the rest. **FLS 38, Operational, Partially Measured, size-band 100–250.**
Per the bedside rules: **Tom sees it first**, privately, trend-framed, with the path
attached — *"decision-rights configuration: delegate milestone-level decisions to
objective owners; projected routing concentration −20pts"* — before any shared surface
shows the gauge. Month 6: concentration 41%, latency premium 2.1 days, FLS 55. The
outcome record becomes cohort evidence that decision-rights work moves FLS — and Tom's
board deck eventually carries the driver *he* chose to share, on his terms (the PvE
principle holding at the top of the ladder too).

## 11 · Gaming exposure

- **Rubber-stamp delegation** (formally delegated, actually routed through the founder
  in hallways): the latency premium catches it — hallway-decided items still show
  founder-shaped timing; and the deck-delta keeps the team's perception in evidence.
- **The deeper risk is non-adoption, not gaming**: a founder who feels surveilled stops
  using decision objects at all. Defense: the no-comms-surveillance instrument boundary
  (§4) and the implicated-first display rule — the gauge must feel like a mirror the
  founder owns, never a camera pointed at them.

## 12 · Known misfits

- **Solo-founder / very small companies** (#7): FLS is definitionally terrible and
  *correctly so* per the raw math — but it's not pathology at that size. The size bands
  carry the fix; below ~10 people FLS is informational only.
- **PE-owned / no-founder companies** (#6): "founder" generalizes to *decision
  concentration on any single individual* (an installed CEO, a dominant CTO); the
  construct holds, the name wobbles — display as "Leadership Leverage" in those
  contexts, same math (a naming-only adaptation, logged when first needed).

## 13 · Calibration log (append-only)

| Date | Change | Evidence | Ratified |
|---|---|---|---|
| 2026-06-11 | v1: five signals with size-banded anchors; ~30-person appropriateness threshold; no-comms-surveillance instrument boundary | org-design research prior; the 15-archetype audit (#6, #7) | C-016.1 |
