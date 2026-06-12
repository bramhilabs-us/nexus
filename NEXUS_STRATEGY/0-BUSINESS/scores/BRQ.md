---
id: nexus.brq
title: BRQ — Business Rhythm Quotient
tier: T0
status: active
owner: founder
updated: 2026-06-11
summary: >
  The cadence driver: does the company run on a rhythm, together — or on
  heroics? The Align stage's head-on score, measurable only at Evolve (weeks
  of history required — the canonical gauge-lag). Signals: milestone cadence
  adherence and its variance, review regularity, nudge-independence (the
  dance), re-plan stability. Distinguishes transformation rhythm from
  production rhythm (the Works24 lesson). Learning loop: cadence patterns
  tested against outcome achievement.
parents:
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
children: []
revisit:
  - on: "first client reaches 12 weeks of cadence history — BRQ's first real measurement tests the v1 blend"
    stage: always
---

# BRQ — Business Rhythm Quotient

## 1 · Identity

**The question**: *Does the company run on a cadence, together — or on heroics?*
Rhythm is not speed. A team that ships every two weeks, predictably, with everyone
moving on the same beat, outscores a faster team that ships in bursts between
firefights. BRQ measures the beat, not the tempo.

## 2 · How it fits

- **Bridge position**: the keystone — ARS enables BRQ; BRQ enables the entire engine
  (BPI, CFS, FLS). The consultant's deepest prior lives here: *before chasing
  productivity, set the rhythm between the team.*
- **Staircase brick**: raised head-on at **Align** — the stage's whole job is the
  Cadence deliverable. **Measured only at Evolve** — the canonical gauge-lag (work
  leads, proof lags by design; constitution §4).
- **In BOQ**: usually the last driver to go Measured — the gate on fully-Measured BOQ.
- **The felt experience**: the brand's "dancing" — counting steps out loud at Align,
  just dancing at Evolve. Nudge-independence is that feeling, quantified.

## 3 · Signals

| Signal | Channel | Raw form |
|---|---|---|
| Milestone cadence adherence | Nexus telemetry (planned vs actual milestone closes) | hit rate + **variance** (rhythm = low variance) |
| Review regularity | Nexus telemetry (check-in/review events on objectives) | interval distribution |
| **Nudge-independence** | Nexus telemetry (cadence held *without* prompt/nudge events) | % of cadence events unprompted — the dance, measured |
| Re-plan stability | Nexus telemetry (milestone re-dating frequency) | re-plans per objective (some is healthy; churn is not) |
| Pulse participation regularity | assessment telemetry (recurring deck response rhythm) | response-interval variance |

## 4 · Instruments

Almost purely passive Nexus telemetry — BRQ is the driver the product measures just by
being used (the game telemetry insight: the product *is* a signal collector). The
rhythm survey section seeds a Proxy estimate at Measure; pulses keep the human
experience of cadence ("does it feel like dancing or like drills?") alongside the
telemetry.

## 5 · Floors

| Floor | Threshold (v1) | Below it |
|---|---|---|
| History | ≥8–12 weeks of cadence events across ≥2 objectives | "accruing — n weeks of rhythm history" (the Align/Transform display) |
| Activity | ≥1 active objective with planned milestones | no signal at all |
| Recency (F11) | logging gap >2 weeks | "running on old data" — **and the gap itself scores**: letting the fuel decay *is* a rhythm failure |
| Size | none — rhythm exists at any size | — |

## 6 · Anchors

Pack: `saas-product v2026.1`. Sources: thin — cadence research is sparse; v1 anchors are
consultant heuristics (informed prior, labeled) + Karvia's session rhythm (~290 sessions
of measured cadence, n=1). **The most cohort-hungry driver in the family**: BRQ's
anchors will be the first place the proprietary distribution visibly outruns the
borrowed one.

## 7 · Provenance path

Proxy (Measure: survey estimate) → **accruing** (Align/Transform: history building,
displayed as progress not score) → **Measured** (Evolve: windows closed). BRQ going
Measured is, in practice, the event that lets BOQ go fully Measured — the constitutional
finish line.

## 8 · Base model v1

```
BRQ = tier_placement( w1·adherence + w2·(1−variance) + w3·nudge_independence
                      + w4·replan_stability + w5·pulse_regularity )
```

v1 weights: adherence 0.25 · low-variance 0.25 · nudge-independence 0.30 ·
re-plan stability 0.10 · pulse regularity 0.10. The informed prior puts
nudge-independence heaviest: cadence that needs prompting is choreography, not rhythm —
the dance is the construct, the rest is its evidence.

## 9 · The learning loop

| Feedback | What it recalibrates |
|---|---|
| Outcome achievement vs cadence profiles (do low-variance teams actually hit outcome records more?) | the blend weights; possibly the construct (is variance or independence the truer rhythm?) |
| Nudge-response decay curves (teams that stop needing nudges vs teams that habituate to ignoring them) | the nudge-independence signal's semantics |
| Production-rhythm false positives (§12) | the transformation-vs-production rhythm separation |
| The dance moment (clients who report "it feels natural" in pulses) vs telemetry | construct validity — the felt experience is the ground truth BRQ approximates |

## 10 · Worked scenario (teleported)

Meridian, Evolve month 9. Twelve weeks of history closed the floor in month 7. Cadence
adherence 78% with tightening variance; **nudge-independence 71%** — in month 3 it was
22% (everything needed Maya's prompts; choreography). Re-plans settled at 0.8 per
objective. **BRQ 66, Structured, Measured, pack v2026.1** — and with it, every driver
Measured: **BOQ flips to fully Measured**, the constitutional finish line, eleven months
in. The Steward's first Calibration Review notes the one soft signal: pulse regularity
dips in release weeks — logged to the calibration log as a candidate seasonality
adjustment, evidence attached.

## 11 · Gaming exposure

- **Cadence theater** (ritual check-ins that hit the beat and say nothing): paired with
  outcome quality — rhythm that produces no outcome records is visible as exactly that;
  the geometric mean punishes the imbalance.
- **Nudge suppression** (turning off nudges to look independent): independence is scored
  against *held* cadence, not absent nudges — no cadence, no score.

## 12 · Known misfits

- **Stable services businesses** (Works24): thirty years of monthly production rhythm is
  real rhythm — but *production* rhythm, not *transformation* rhythm. BRQ v1 scores only
  cadence on NOF objects (transformation work by construction); production cadence
  enters, if ever, by calibration-log evidence.
- **Project-cycle businesses** (game studios, #9): crunch cycles read as high-amplitude
  variance — correctly low BRQ by our construct, but the segment may dispute the
  construct itself; needs its own pack conversation.

## 13 · Calibration log (append-only)

| Date | Change | Evidence | Ratified |
|---|---|---|---|
| 2026-06-11 | v1: five signals, nudge-independence weighted 0.30, transformation-rhythm-only scope | consultant prior; Karvia session cadence | C-016.1 |
