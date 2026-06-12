---
id: nexus.roadmap
title: Roadmap — what ships when, on the re-baselined nights
tier: T1
status: active
owner: agent
updated: 2026-06-12
summary: >
  The product roadmap: capability arrival phased against the re-baselined
  night plan (105 steps, C-022 — 1b docs, 2 foundation, 3 vertical proof,
  4 Transformation OS, 5 launch), the expansion grammar (new vertical = new
  assessment impl; new segment = new anchor pack), the post-beta horizon in
  dependency order, and the honest pre-data flags every roadmap conversation
  carries (constitution §9).
parents:
  - NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md
  - NEXUS_STRATEGY/3-DELIVERY/EXECUTION_PLAYBOOK.md
children: []
revisit:
  - on: "EXECUTION_PLAYBOOK re-baselines a night budget (the >25% trigger) — re-phase this roadmap"
    stage: always
  - on: "a new anchor pack or assessment vertical is ratified in DECISIONS — update the expansion sections"
    stage: always
---

# Roadmap — what ships when, on the re-baselined nights

## Purpose

What a product reader needs to know about sequence: which capability arrives at which night, what each night makes *demonstrable*, and what is deliberately not scheduled. The EXECUTION_PLAYBOOK owns the step budgets and session mechanics (105 steps, re-baselined from 90 at the Night-1 close, C-022); this doc owns the product meaning of those phases. Night numbering is stable canon: Night 2 means Foundation everywhere, and the docs stage between 1 and 2 is **Night 1b** (C-022.3).

## TL;DR

- **Five phases to a deployed beta**: docs (1b) → foundation (2) → vertical proof (3) → Transformation OS (4) → launch (5). First demoable product lands at Night 3; first *sellable* shape at Night 5.
- **Expansion has a grammar, not a wishlist**: a new transformation vertical = a new assessment impl folder + a new playbook; a new customer segment = a new anchor pack (ICP §4). Both are demand-triggered, neither is dated.
- **AIR is the launch vertical, never the ceiling** (C-001/C-006) — the Night 3 second-provider drill proves the socket, not just the plug.
- **Pre-data honesty governs every claim** (§4): cohort of one, BOQ ⇄ NBM as hypothesis, the proxy valley — the roadmap promises the destination, never pretends it's behind us.

## 1 · The road to beta

Phased on the re-baselined plan (EXECUTION_PLAYBOOK § the phase plan; budgets re-summed there: 29 spent + 10 + 22 + 14 + 15 + 10 + 5 buffer = 105). The product lens per night:

| Night | Product outcome | What exists for a user afterwards |
|---|---|---|
| **1 — Strategy** (CLOSED 2026-06-12) | The canon: constitution + NBM + Game + Runtime Model, scores library, ICP, scoring model; design tokens + 10 static mockups | Nothing runnable — by design. The game is designed before it is built |
| **1b — Product & technical docs** (current) | Every doc the build consumes: this tier completed (CAPABILITIES, ROADMAP, trigger map, playthroughs, J5 org-direct), mockups reworked into the ratified brand (C-013), module contracts + assessment interface drafted on paper, QA target mapped | Static mockups in the real brand — reviewable, clickable-through, still not software |
| **2 — Foundation** | The chassis: TS workspace + CI gates; 6 lifted modules (CRM + OKR chain) standing contract-first; `Program` entity live (C-005) | Still no UI — contract tests green are the deliverable. The OKR chain works under test: objectives, KRs, milestones, tasks, roll-up |
| **3 — Vertical proof** | **First demoable product.** `AssessmentProvider` interface + the full AIR impl (instruments → evidence → scoring → deliverables); the six pages on their contracts; first-value journey passing E2E | A consultant can add a client, run an AIR assessment as flashcards, seed objectives from the Opportunity Register, and watch progress roll up — the demo IS the first-value journey. Acceptance test: a second provider lands in hours, touching only its impl folder |
| **4 — Transformation OS** | The positioning made real: governance + knowledge modules, multi-program per tenant, **handover → Builder mode**, srishti seam reserved, SaaS plumbing | An org runs concurrent programs; an engagement hands over cleanly (consultant out, client owns everything); the org-direct journey works without any consultant surface (Article 9) |
| **5 — Launch** | Deployed beta: observability, rollback runbook, deploy honesty pass, perf | Design-partner orgs onboarded (manual, paid — GTM motion 2 activation starts here); the IMPROVEMENT_PLAN success table measured and published |

**The two metrics the whole sequence optimizes** (PRODUCT_STRATEGY § first-value journey): time from first login to first objective *Identified* with a planned week (Night 3 makes it real, Nights 4–5 shorten it), and % of handed-over clients still active in Builder mode after 90 days (Night 4 makes it possible).

## 2 · Vertical expansion — AIR first, the socket proven

The Transformation OS claim is architectural: **any future vertical (ESG readiness, digital, ops excellence, M&A integration) plugs in as a new assessment impl + a new playbook on the same lego blocks** — same pages, same OKR chain, same governance and knowledge capture.

- **The contract already covers it**: a vertical is an `AssessmentProvider` — its own instruments, scoring, deliverables, and objective seeding (TECH_STRATEGY § pluggable assessment). Registration buys the *Create X assessment* option, score columns, and analytics tiles with zero changes elsewhere; nothing on any page hardcodes AIR.
- **The proof is scheduled, the verticals are not**: Night 3's second-provider drill (hours, not days, journaled) is the roadmap's only vertical commitment. Real second verticals are demand-triggered, post-beta, each entering by its own playbook + DECISIONS entry.
- **Vertical ≠ segment.** A new vertical is a new *assessment* on the same buyer. A new *segment* (agencies, regulated, embedded…) is the same assessment family on a different ruler — that path runs through anchor packs (ICP §3–4: `services` first in queue, then `agency`, `regulated`; paid-only, three conditions before any pack is built). Conflating the two is how numbers go dishonest.

## 3 · Post-beta horizon — dependency order, no dates

Sequenced by what each item *waits on*, not by quarters (NOF's own de-calendaring applied to ourselves):

1. **Org-direct self-serve** — waits on beta stability. Activation sequence per GTM motion 2: manual design-partner onboarding during beta → self-serve signup with a Discovery-grade self-assessment after. The capability set is already consultant-free (Article 9); what's gated is the *funnel*, not the product.
2. **The fit engine (task × person matcher)** — waits on captured data. v1 ships the structured signals (CAPABILITIES §5); the matcher leaves the IMPROVEMENT_PLAN parking lot only when real task/profile data exists to train and validate against, and it ships as iBrain prediction under Article 13 display rules.
3. **srishti integration** — waits on srishti's interfaces stabilizing (TQ-3). One contract owned by `@nexus/knowledge`; Nexus never depends on it (AP-8).
4. **Anchor packs** — wait on the three ICP §4 conditions (real demand + publishable anchors + closed misfit list). Queue today: `services` → `agency` → `regulated`.
5. **NBM maturation** — waits on the cohort. The 02 §2 arc: resolution (company → team → person), trust (proxy → measured), assistance (guided → self-sustaining). The 2028-shaped claim — *known knowledge that Nexus predicts the next best move for an AI SaaS company* — sits at the end of this line, not on a date.
6. **Reserved score seats** — the market/customer-signal driver and the Culture Score enter, if ever, by constitutional amendment on real-engagement evidence (C-016.3); no roadmap slot until then.

## 4 · The honest pre-data flags

Constitution §9, applied to roadmap conversations — these are said plainly in every deck, demo, and sales call until the data retires them:

- **The measured cohort is one company** (Karvia, labeled). Anchors are research-grade until engagements accumulate; collateral names its anchor pack.
- **BOQ ⇄ NBM is a hypothesis** — the destination of the staircase, stated as such, never as established fact (C-015).
- **The quality half of the proof is pending** — velocity metrics measured, DORA-standard quality metrics await time windows; first engagements instrument quality early.
- **The proxy valley is real** — mid-journey scores may honestly read *insufficient signal*; instrumentation progress ("gauges lit: n of 9") is the honest mid-journey proof.
- **NBM is scoped to operating moves** — BOQ measures the engine, not market direction, until the reserved seat is filled.
- **Paid-only is a chosen trade** (C-016.6) — slower cohort, honest numbers; the gold standard stays a sparse family of segment standards for years.

## 5 · Not scheduled, by design

A roadmap is also its refusals: **no free assessment tier** before maturity (C-016.6); **no works-council jurisdictions** before the appraisal posture's first real test (C-016.4); **no matcher before its data** (§3.2); **no anchor pack before its three conditions** (ICP §4); **no second vertical before a paying reason**; **no renumbering of nights** — Night 2 is Foundation forever (C-022.3). Each refusal has a decision behind it; lifting one goes through DECISIONS, not through a sales exception.
