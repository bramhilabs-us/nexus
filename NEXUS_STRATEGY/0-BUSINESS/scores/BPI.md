---
id: nexus.bpi
title: BPI — BRAMHI Productivity Index
tier: T0
status: active
owner: founder
updated: 2026-06-11
summary: >
  The productivity driver: does intent become shipped product efficiently?
  The one driver with a v1 mathematical model — four pillars (Velocity,
  Quality, Knowledge, Capital Efficiency) fed by the Eight Metrics from the
  client's engineering stack, indexed against a SaaS baseline of 100, then
  tier-placed for the composite. Arms at Transform when telemetry connects
  and floors clear; the quality pack matures into Evolve. Learning loop:
  anchor recalibration per cohort and pillar-weight testing against outcome
  records.
parents:
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
children: []
revisit:
  - on: "Eight Metrics anchors re-benchmarked (anchor pack edition)"
    stage: always
  - on: "first measured engagement arms BPI — compare its pillar weights against reality"
    stage: always
---

# BPI — BRAMHI Productivity Index

## 1 · Identity

**The question**: *Does intent become shipped product efficiently?*
The engineering engine's gauge — and the most saleable number in the family, because it
denominates in dollars (TLO: $1.4–2.5M/year per ten engineers between average and top
tier).

## 2 · How it fits

- **Bridge position**: the engine's center — enabled by BRQ (a team in rhythm can be
  productive; a chaotic one can only be busy), coupled with CRS (consolidation feeds
  productivity).
- **Staircase brick**: **Transform** — one of the engine four raised when day-to-day
  work and telemetry go live. Feeds the Measured Engine deliverable.
- **In BOQ**: enters as BPI′ (tier placement of the raw index); the raw index always
  displays alongside (it can exceed 100 — Karvia: 279).
- **Scope honesty**: BPI sees the *engineering org only*. For software product companies
  (the ICP) that is most of the company's value creation; for services-enabled
  archetypes it is not — see §12.

## 3 · Signals — the Eight Metrics

All sourced from the **client's engineering stack** (git, CI, incident tracker, AI
usage/billing), ingested via iBrain's event pipeline — never Nexus-internal data.

**Velocity pack (leading)** — arms at Transform:

| Metric | Meaning | Newbie → Top 0.1% | Karvia |
|---|---|---|---|
| **BBR** Build-to-Burn | % of AI spend that became shipped product | ~30% → 96% | 96% measured |
| **SVR** Ship Velocity | production changes per AI session | 0.1× → 1.4× | 1.4× measured |
| **TOR** Cost per Ship | dollars per production change | $40+ → $2.37 | $2.37 measured |
| **CCS** Context Compounding | work building on prior work | ~10% → 97% | 97.7% measured |

**Quality pack (lagging, DORA-standard)** — matures into Evolve:

| Metric | Meaning | Newbie → Top 0.1% |
|---|---|---|
| **CFR** Change Failure Rate | % of shipped code that breaks | 30%+ → <5% |
| **MTTR** Recovery Time | hours to fix a production break | 24h+ → <2h |
| **CSS** Code Stability | % of code alive after 90 days | ~40% → 90%+ |
| **DER** Defect Escape Rate | % of bugs reaching production | 60%+ → <10% |

## 4 · Instruments

Telemetry connectors (the instrumentation quest line, 03_NEXUS_GAME §6.2): git → CI →
AI billing → incident tracker, each an arming-checklist item. Surveyed/observed
estimates may *pre-fill* pillars at Measure — labeled Proxy, replaced (never blended)
when telemetry arms (Article 2).

## 5 · Floors

| Floor | Threshold (v1) | Below it |
|---|---|---|
| AI utilization | ≥20 AI sessions/engineer/month | velocity pack: "insufficient signal" — the floor the whole framework is named for |
| Team size | ≥10 active engineers (ICP floor) | numbers render with wide-band warning; below ~5, not at all |
| Volume | ≥4–6 weeks of continuous telemetry | "arming — n weeks collected" |
| Recency (F11) | data gap >2 weeks → stale | "running on old data" |
| Quality-pack windows | CSS needs its 90-day window; CFR/MTTR/DER need incident data | quality pillar absent until Evolve-era windows close |

## 6 · Anchors

Pack: `saas-product v2026.1`. Sources: *BRAMHI — The Eight Metrics* (2026) — anchors
above; DORA/DX Core 4 for the quality pack; Karvia for the measured top-tier case
(n=1, labeled). **Anchor volatility warning**: tooling deflation moves these fast
($2.37/change is a 2026 number); expect annual restatement to bite here first.

## 7 · Provenance path

Proxy (Measure: surveyed estimates, clearly labeled) → **Measured-velocity** (Transform:
the four leading metrics live) → **Measured-full** (Evolve: quality windows closed).
BOQ inherits accordingly — BPI is usually the driver that holds BOQ at Partially
Measured through the valley, which is why its quest line is the valley's progress UI.

## 8 · Base model v1 — the one real formula

```
BPI_raw = 100 × Velocity^0.30 × Quality^0.15 × Knowledge^0.25 × CapitalEfficiency^0.30
```

- Pillar feeds: Velocity ← SVR · Quality ← CFR, MTTR, CSS, DER · Knowledge ← CCS ·
  Capital Efficiency ← BBR, TOR.
- Indexed against SaaS-baseline 100; exponents are the informed prior (capital
  efficiency and velocity weighted heaviest — the AI-era thesis); exact calibration
  constants are trade-secret config (Article 5).
- Until the quality pack arms: BPI renders as the velocity-pack partial, labeled
  *"velocity-measured; quality pending its windows"* — never silently re-weighted.
- BPI′ (for BOQ) = tier placement of BPI_raw against the pack.

## 9 · The learning loop

| Feedback | What it recalibrates |
|---|---|
| Cohort distributions per segment | the anchors themselves — borrowed → proprietary |
| Outcome records vs pillar profiles (do high-Knowledge teams actually compound across objectives?) | pillar exponents — the 0.30/0.15/0.25/0.30 prior earns or loses its shape |
| Quality-pack arrivals vs velocity-era predictions | the velocity→quality inference iBrain uses during the valley (prediction side, starts at the prior) |
| Survey-estimate vs telemetry-actual gaps at arming | the Proxy pre-fill instrument's honesty calibration |

## 10 · Worked scenario (teleported)

Meridian, Transform month 3. Quest line: git ✓ (week 9), CI ✓ (week 10), AI billing ✓
(week 12), incident tracker pending. 38 of 45 engineers above the utilization floor by
month 4 (the floor itself became a transformation objective — using the gauge's own
requirement as the work). Week 14, BPI arms: BBR 61% · SVR 0.6× · TOR $11.40 · CCS 71%
→ velocity pillars tier-placed → **BPI_raw 142 (1.42× baseline), BPI′ 58, Structured,
Measured-velocity, pack v2026.1** — quality pillar absent, windows open. The number is
unflattering next to Karvia's 279, and that is the point: it is *real*, the first
Measured driver in Meridian's composite, and the NBM it generates ("capital efficiency
is your weakest pillar — AI spend governance before more AI spend") carries
telemetry-grade confidence.

## 11 · Gaming exposure

- **Session farming** (running AI sessions to clear the floor): caught by BBR/TOR —
  farmed sessions produce no shipped product and *worsen* the capital pillars. The
  metric family is self-policing here by construction.
- **Commit splitting / change inflation**: TOR and SVR denominate in *production
  changes* (deploy-gated), not commits.
- **The deeper defense**: the PvE principle — BPI is never an individual's number
  (appraisal firewall posture, C-016.4); de-individualized gauges remove most of the
  motive.

## 12 · Known misfits

- **Agencies** (archetype #4): CCS is structurally low (context resets per client — the
  business model, not a defect); BBR's "product" denominator is client deliverables.
  Needs its own pack and possibly its own pillar shape.
- **Embedded/hardware** (#8): deploy cadence physics differ; quality pack semantics
  (MTTR for firmware) need re-anchoring.
- **Services-enabled** (Works24): the company's AI opportunity may live outside the dev
  org entirely — BPI is honest but *narrow* there; the assessment sees what BPI cannot
  (the ARS↔BPI scope mismatch, 03_NEXUS_GAME Finding 1).

## 13 · Calibration log (append-only)

| Date | Change | Evidence | Ratified |
|---|---|---|---|
| 2026-06-11 | v1: Eight Metrics + pillar formula with 0.30/0.15/0.25/0.30 exponents (whitepaper prior); floors as §5 | Karvia measured case; published research | C-011, C-016.1 |
