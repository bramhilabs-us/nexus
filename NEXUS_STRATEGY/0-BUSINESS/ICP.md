---
id: nexus.icp
title: ICP — who Nexus measures first, and the segment registry
tier: T0
status: active
owner: agent
updated: 2026-06-12
summary: >
  The v1 ideal customer profile (C-016.5: software product companies, ~20–500
  people, ≥10 engineers, modern delivery pipeline, measurement-permissive
  jurisdiction) with the why behind each criterion, the qualification gate the
  playbook enforces, the segment registry (every known non-v1 archetype with
  its driver misfits and its path in via a future anchor pack), and the
  anchor-pack roadmap with pack-earning triggers. Canonizes the 15-archetype
  audit's recoverable slots; the registry grows by append, never by silently
  widening the v1 gate.
parents:
  - NEXUS_STRATEGY/01_NEXUS_MODEL.md
  - NEXUS_STRATEGY/0-BUSINESS/scores/BOQ.md
children: []
revisit:
  - on: "a deal outside the v1 profile is seriously pursued — the gate either holds (say no) or the segment earns its anchor pack first (C-016.5)"
    stage: always
  - on: "a new anchor pack edition is ratified in DECISIONS — move the segment's registry row from 'future pack' to 'packed'"
    stage: always
  - on: "founder confirms or corrects the reconstructed registry slots (clarification C-018)"
    stage: N1
---

# ICP — who Nexus measures first

> One sentence: **version 1 measures software product companies of roughly 20–500
> people with at least ten engineers — and deliberately says no to everyone else
> until their segment has its own anchor pack.** (C-016.5; constitution §2.)

## 1 · The v1 profile

| Criterion | Threshold | Why it exists |
|---|---|---|
| **What they build** | Software *products* (incl. B2B SaaS) — not client services, not hardware-led | Every v1 anchor assumes product cadence: continuous delivery, a roadmap the company owns, AI leverage landing inside the dev org. Services and embedded shops break those assumptions per-driver (§3) |
| **Company size** | ~20–500 people | Below ~20 the org-shaped drivers (FLS, CFS) measure a household, not a company; above ~500 the engagement motion and the single-company BOQ referent (C-016.2) need machinery v1 doesn't have |
| **Engineering size** | **≥10 engineers** | The statistical floor: below roughly ten engineers, per-company gauges carry wide error bars (constitution §9 honest limits); floors and confidence displays are size-conditioned, but the v1 gate simply avoids the noise |
| **Delivery pipeline** | Modern — git, CI, issue/incident tracking in place or installable | Transform's instrumentation quest line (03 §6.2) connects telemetry; a company with nothing to connect cannot climb out of proxy provenance, and the proxy valley never ends |
| **Jurisdiction** | Measurement-permissive | The instruments observe how people work. Works-council and similar regimes are a future, deliberate expansion — the appraisal posture is deliberately open (C-016.4) and its first real test triggers a constitution revisit |

**The referent check** (C-016.2): the profile applies to *the company*, BOQ's referent.
Two genuinely unlike businesses inside one legal entity are two companies in Nexus —
qualify each separately.

**The entry rung is earned, not fixed** (C-016.8): an ICP-true company arriving already
instrumented enters at the rung its provenance supports — top-band companies go Measure →
Evolve directly, and their product is the subscription. The gate qualifies *who*, not
*where they start*.

## 2 · The qualification gate

Five questions, asked at Prospect, before the Sponsor bridge. Any **no** = not a v1
customer; route per §3. (The AI_CONSULTING_PLAYBOOK owns the gate's script; this doc
owns its definition.)

1. Does the company's revenue follow a software product it owns?
2. Headcount in ~20–500?
3. Ten or more engineers?
4. Git + CI + tracking in place, or installable in week one of Transform?
5. Can work-telemetry be collected lawfully and acceptably in their jurisdiction?

The gate is a kindness, not gatekeeping: a misfit segment scored against
`saas-product` anchors gets a *wrong number*, and a wrong number poisons both the
relationship and the cohort (the standard's entire value is that its numbers are honest).

## 3 · The segment registry

Every known non-v1 archetype, its driver misfits (cited from the score docs' Known
Misfits sections), and its path in. **Path in is always the same shape**: the segment
earns a versioned anchor pack (BOQ §5) — same architecture, same staircase, its own
ruler. Until then: not a customer.

**Provenance note**: the 15-archetype audit (C-016, the devil's-advocate simulation) was
run in-session; seven slot numbers survive as citations in the score docs and are fixed
here. The remaining registry rows are the segments canon names without numbers. The
registry canonizes **names**; slot numbers exist only to keep the score docs' citations
valid. Founder confirmation of the full roster: clarification C-018.

| Slot | Segment | Where v1 anchors break (cited misfits) | Path in |
|---|---|---|---|
| **#4** | **Agencies / client-services dev shops** | BPI: CCS structurally low — context resets per client (BPI §12) | `agency` pack: per-client context economics re-anchored |
| **#5** | **Regulated stacks** (fintech, health, gov) | CRS: compliance-mandated tools *cannot* consolidate regardless of readiness (CRS §12) | `regulated` pack: consolidation anchors carve out mandated tooling |
| **#6** | **PE-owned / no-founder companies** | FLS: "founder" must generalize to *decision bottleneck* (FLS §12) | FLS generalization is theory-layer (C-015.2) — likely the cheapest pack |
| **#7** | **Solo-founder / very small** (<~10 engineers) | FLS definitionally terrible and unactionable; everything noisy below the size floor (FLS §12; constitution §9) | Grow into the ICP; no pack planned — the math itself objects |
| **#8** | **Embedded / hardware-software** | BPI: deploy-cadence physics differ; CRS: toolchains (silicon EDA, vendor IDEs) have no AI-native alternative (BPI §12, CRS §12) | `embedded` pack: cadence + consolidation anchors rebuilt on hardware clocks |
| **#9** | **Game studios / project-cycle businesses** | BRQ: crunch cycles read as high-amplitude rhythm failure when they are the industry's shape (BRQ §12) | `project-cycle` pack: rhythm anchors per production phase |
| **#12** | **Remote-async distributed companies** | CFS: multi-day PR-based decision latency is the *design*, not friction (CFS §12) | `remote-async` pack: latency anchors split sync-debt from async-by-design |
| — | **Software-enabled services** (the Works24 archetype) | ARS: Execution anchors assume product cadence; BPI honest but *narrow* — the AI opportunity may live outside the dev org (ARS §12, BPI §12); BRQ: production rhythm ≠ transformation rhythm (BRQ §12) | `services` pack — **first in the roadmap queue** (§4): the audit's richest lesson and the likeliest near-term inbound |
| — | **Internal IT organizations** | ARS: Leadership dimension assumes a P&L owner — semantics shift (ARS §12) | `internal-it` pack: leadership + value anchors rewritten for cost-center economics |

Rows append as engagements meet new archetypes; a row never silently moves into §1 —
admission to the ICP is a DECISIONS-ratified pack, not a sales exception.

## 4 · The anchor-pack roadmap

**Current**: `saas-product v2026.1` — the only pack that exists. Sources: DORA, DX
Core 4, published industry research, the Karvia measured case (n=1, labeled). Every
score doc cites it (BOQ §5).

**A segment earns a pack when all three hold:**

1. **Demand is real** — a qualified inbound or strategic choice, not a hypothetical
   (paid-only, C-016.6: we don't build rulers for empty rooms).
2. **Anchors exist** — published research for the segment plus at least one measured
   engagement to label honestly (the cohort floor applies from day one: anchor
   placement and self-trend only, no fake percentiles — BOQ §5).
3. **The misfit list is closed** — each §3 citation for that segment resolved into a
   re-anchored or re-defined signal, recorded in the affected score docs' calibration
   logs and ratified in DECISIONS (the restatement rule governs all subsequent edits,
   C-016.7).

**Priority order, today**: `services` (Works24 — the lesson is already paid for) →
`agency` → `regulated` → the rest as demand appears. No dates: pack creation is
demand-triggered, and the honest-limits clause (constitution §9) already says the gold
standard is a *family of segment standards that stays sparse for years*.

## 5 · What saying no buys

Every criterion in §1 is a number-integrity decision, not a market-size decision:

- **Calibration** — every v1 metric, playbook, and benchmark tuned to one segment
  instead of approximately fitting five (constitution §2: "saying no to them early is
  what keeps the numbers honest").
- **Cohort coherence** — the flywheel's anchors sharpen fastest when every engagement
  lands in the same distribution.
- **Engagement-script fit** — the proxy valley (03 §6.2), the instrumentation quest
  line, and the two-week sprint are sized for companies that *have* telemetry to
  connect and ten-plus engineers to survey.

The trade is known and chosen (C-016.6): slower cohort growth, gold-standard calendar
moved out — maturity over data speed.
