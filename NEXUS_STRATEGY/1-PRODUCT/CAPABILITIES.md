---
id: nexus.capabilities
title: Capabilities — the 8 blocks as what a player can do
tier: T1
status: active
owner: agent
updated: 2026-06-12
summary: >
  The 8 lego blocks translated into user-facing capabilities: what each block
  lets a player do, on which page (every capability cites a PRODUCT_STRATEGY
  page contract and a TECH_STRATEGY module surface — never inventing either),
  how the capability set responds to program stage, and how both GTM motions
  consume one capability set (Article 9). Canon home of the task × person
  match v1 mechanics (from 02_NBM_MODEL §3.3, per C-022.4).
parents:
  - NEXUS_STRATEGY/1-PRODUCT/PRODUCT_STRATEGY.md
children: []
revisit:
  - on: "module contracts are drafted (N1-P4-01) — verify every capability row cites a surface the contracts actually expose"
    stage: always
  - on: "the fit engine leaves the IMPROVEMENT_PLAN parking lot — §5 is its spec seed"
    stage: always
---

# Capabilities — the 8 blocks as what a player can do

## Purpose

The technical card names the 8 lego blocks; the product card names the six pages and their contracts. This document is the bridge: **for each block, what a player can actually do, where, and at which stage**. Its discipline is the contract-first gate (audit 2026-06-12 §10): every capability cites the page contract and module surface it lives on — a capability that can't cite both is an invention and does not ship. Nexus is a **Transformation OS**; AIR is the launch vertical, never the ceiling (C-001/C-006).

## TL;DR

- **A capability = a block's surface reaching a page's contract.** The map below is rows of (block → verb → page CTA → module surface); nothing here is new — it is the existing canon read user-first.
- **Capabilities are stage-responsive** (03 §4 via PRODUCT_STRATEGY): the same capability renders as different weather per stage, and each stage has one home page where its defining capability is played.
- **One capability set serves both motions** (Article 9): consultant-led adds exactly one surface (My Clients); org-direct walks the same pages without it. Handover removes the consultant, never a capability.
- **The task × person match v1** (§5) lives here now: task vector × person vector × weighted similarity — v1 captures the data as structured fields; the matcher itself is parked until post-beta.

## 1 · The capability map

Per block: the verbs a player gets, the page contract that hosts each verb, and the module surface that backs it. Page contracts: PRODUCT_STRATEGY § the six pages. Module surfaces: TECH_STRATEGY § the eight blocks (`contract.ts` is the only surface other modules — and therefore pages — may consume).

### @nexus/crm — tenants, programs, people, roles

| Capability (the verb) | Page / surface | Backing surface |
|---|---|---|
| **Add a client** — captures a named Sponsor (name + email); the entry assessment auto-initiates, no manual send | My Clients, primary CTA | `client.added` domain event; the assessment module subscribes (TECH_STRATEGY § pluggable assessment — auto-initiation) |
| **Onboard the team** — invite members, create teams | Teams, primary CTA (*Invite member*) | crm contract: people, roles, `program_memberships[]` (C-005) |
| **Shape roles without code** — add custom role labels mapped to the 4 archetypes | Configuration (admin) | role labels are config data, never code (PRODUCT_STRATEGY § secondary surfaces; AP-3) |
| **Fill the player cards** — Profile (skills, intrinsic motivations, match-grade tags), Company Profile (goals, strategic priorities) | Profile / Company Profile | partially populated by assessment instruments (AIR Day 7 → Profile; Day 1 Business Context Canvas → Company Profile) |
| **Run many programs at once** — an org holds concurrent transformation/product programs | program switcher (Night 4) | `Program` as first-class entity, `Company → Program → Objective` (C-005) |

### @nexus/assessment — the pluggable front door

| Capability | Page / surface | Backing surface |
|---|---|---|
| **Run any installed assessment** — *Create AIR Strategic Assessment* today; one option per installed block | Assessments, primary CTA (typed by installed block) | `AssessmentProvider` interface; AIR is `impls/air/` (TECH_STRATEGY) |
| **Take an assessment as flashcards, never surveys** — first-time / recurring (with deltas) / pulse moments | Assessments (taker's entry: invitation email) | instruments declare delivery moment + UI slot renderer; question decks render through the shell's flashcard component (PRODUCT_STRATEGY § delivery experience) |
| **Capture evidence per instrument** — workshops, interviews, observations, canvases | Assessments workspace (block-rendered slots) | `instruments(ctx)` with zod-validated evidence shapes |
| **Get a credible, score-backed result** — score + deliverables (AIR: Score, Opportunity Register, Risk Register, 90-day plan, 12-month roadmap) | Assessments → results | `score(evidence)`, `deliverables(...)` — pure functions over evidence |
| **Seed objectives from results** — the single most important handoff in the product | Assessments exit → Objectives | `seedObjectives(deliverables) → ObjectiveDraft[]` |
| **Re-assess on cadence** — recurring decks with deltas; the ladder keeps moving | Assessments (Evolve weather) | cadenced re-assessment scheduled by the assessment module per delivery moments |

### @nexus/objectives — the O

| Capability | Page / surface | Backing surface |
|---|---|---|
| **Create an objective pre-seeded from assessment deliverables** — never a blank form | Objectives, primary CTA | `ObjectiveDraft[]` from the assessment handoff |
| **Run it through the lifecycle** — Identified → Handed off → Sustained, shown as a stage ribbon | Objectives board | lifecycle engine (TECH_STRATEGY Layer 2) |
| **Close with an outcome, not just progress** — outcome record at close: final vs baseline, outcome class, narrative, evidence refs | Objectives (close flow) | NOF § outcome measurement; descendant of Karvia's `OKROutcome` |
| **See which objective deserves focus now** — the team-altitude NBM, a recommendation with a confidence and a why | Objectives analytics strip | 02 §3.2 (team altitude); Article 13 display rules |

### @nexus/key-results — the KR

| Capability | Page / surface | Backing surface |
|---|---|---|
| **Define 4–5 KRs per objective** — number / % / boolean / currency; ~25% weight each | Objectives (create/edit) | NOF § the hierarchy; KR inherits the objective's window, no quarters |
| **Check in on progress** | Objectives, secondary CTA | roll-up engine reads check-ins (Layer 2) |
| **Accept AI-drafted KRs** — drafted by the planner seam, always labeled AI-drafted, human-accepted before becoming canon | Objectives, quiet AI-draft CTA | 04_RUNTIME_MODEL §3 (generated category); 03 F9 |

### @nexus/milestones — the week-sized step

| Capability | Page / surface | Backing surface |
|---|---|---|
| **Plan ~1-week milestones against the objective's own timeline** — M1, M2, M3…, no ISO weeks, no quarters | Planning, primary CTA | NOF § dynamic timelines (C-008): ordered, dated by offset within the objective's window |
| **Watch milestone streaks** — completion rhythm without nudges is the Evolve signature | Planning analytics strip | milestone % from task roll-up |

### @nexus/tasks — the atom

| Capability | Page / surface | Backing surface |
|---|---|---|
| **Break a milestone into tasks measured in hours** — estimate, execute, log | Planning (Add task / log hours) | NOF: hours estimated vs logged; due dates within the milestone |
| **See progress roll up by itself** — task hours → milestone % → KR % → objective % → program % | every page's analytics, automatically | the roll-up engine: one pure function chain (TECH_STRATEGY Layer 2) |
| **Arrive to a pre-seeded first session** — milestone and tasks waiting, one real action logged inside ten minutes | Planning, first visit | the first-session contract (PRODUCT_STRATEGY § Planning; 03 §6.3) |

### @nexus/governance — program oversight

| Capability | Page / surface | Backing surface |
|---|---|---|
| **Answer "is the program on track, and what needs me today?"** — the three-things-today rule, stage-aware, per archetype | Dashboard | 04_RUNTIME_MODEL §5; governance observes domain events (dotted edges, TECH_STRATEGY block diagram) |
| **Push task completion** — nudge owners of overdue/at-risk work; every push is a logged nudge event | Dashboard, primary CTA | nudge doctrine (04 §4): BRQ measures nudge-independence, so the system records its own prompts |
| **Know where the program stands on the ladder** — stage weather on every page, "you are here" | all six pages | the stage machine (TECH_STRATEGY Layer 2): pages render the stage, never compute it |
| **Hold decision rights and accountability visible** — owners assigned, commitments tracked | Dashboard (Align weather: roadmap → objectives conversion, owners assigned) | governance module contract (drafted N1-P4-01) |

### @nexus/knowledge — the institutional memory

| Capability | Page / surface | Backing surface |
|---|---|---|
| **Keep the receipts** — outcome records aggregate into `Program.outcome`; the engagement's evidence trail | Objectives (close) → program level | NOF §outcome; knowledge captures domain events |
| **Hand over with the baseline snapshotted** — handover captured as outcome evidence, BRAMHI baseline stored for future re-assessment | handover flow (Night 4) | TECH_STRATEGY § handover |
| **Attach documents via srishti** — link srishti documents to programs, objectives, evidence | knowledge surfaces (post-beta) | the srishti integration contract, owned by knowledge; Nexus fully functional without it (AP-8) |

## 2 · Stage-responsive capabilities — one home page per stage

The full 6 pages × 5 stages matrix is PRODUCT_STRATEGY § the stage dimension and is not repeated here. What this doc adds: **each stage has one home page, and that page's defining capability is the stage being played** (03 §4, rule 1 of the matrix):

| Stage | Home page | The capability being played | What lights up (01 §4) |
|---|---|---|---|
| **Prospect** | My Clients | Add a client → Sponsor bridge → assessment auto-initiates | — (exit: sponsor activated + matrix loaded + sprint scheduled) |
| **Measure** | Assessments | the two-week workspace: instruments, evidence, scoring workshop | ARS, the Baseline — all proxy |
| **Align** | Objectives | seeding: Opportunity Register → objectives, KRs drafted, owners assigned | FLS, CFS begin; the Register goes live |
| **Transform** | Planning | the Worker's daily home: milestones, tasks, hours; telemetry connects (gauges lit: n of 9) | BPI comes alive |
| **Evolve** | Dashboard | rhythm view: cadence adherence, BOQ trend, re-assessment cadence | BRQ, quality metrics, BOQ fully measured |

A capability that renders identically at Measure and at Evolve is breaking the page contract's stage-weather field — that is a bug, not a style choice.

## 3 · One capability set, two motions (Article 9)

Per C-001/C-006 and GTM: consultant-led is the beachhead, org-direct is first-class. The architecture's rule, binding (Article 9): **no capability may assume a consultant exists.**

| | Consultant-led (Engagement mode) | Org-direct / post-handover (Builder mode) |
|---|---|---|
| Entry capability | Add a client (My Clients) | Sign up → run the assessment yourself (Assessments) or start at Objectives |
| My Clients | the consultant's pipeline — the **only** consultant-shaped surface | hidden entirely |
| Assessment | consultant runs the AIR sprint; client participates | self-serve deck + playbooks; same provider, same flashcards |
| Everything else | identical | identical |
| Handover | program → `handed_over`; consultant's membership revoked; UI flips to Builder mode | n/a — already there |

Handover removes a *person's access*, never a capability: all data already belongs to the client's tenant (TECH_STRATEGY § handover), and the team keeps the same six pages for product development — that continuity is the second north-star metric (PRODUCT_STRATEGY § first-value journey).

## 4 · What v1 deliberately cannot do

Honest by design (constitution §9 posture); none of these is an oversight:

- **No matcher.** v1 captures the task × person signals (§5) as structured fields; the fit engine is parked in IMPROVEMENT_PLAN until post-beta data exists.
- **No free tier.** Paid-only initially (C-016.6) — maturity over cohort speed.
- **No colleague-vs-colleague comparison, ever** — not v1 scoping but constitutional (Article 14, PvE).
- **No second assessment vertical shipped** — but the second-provider drill (hours, not days) is Night 3's acceptance test of the architecture; SSI stays a Karvia reference only (C-006).
- **No srishti dependency** — integration is optional with tested fallback (AP-8); Nexus stands alone.
- **No per-person telemetry where it isn't lawful and acceptable** — the ICP's jurisdiction criterion; the appraisal posture stays deliberately open (C-016.4).

## 5 · The task × person match — v1 mechanics

> **Canon home** (C-022.4): these mechanics were ratified in 02_NBM_MODEL §3.3 (C-015) and
> are housed here so the product tier owns them; once absorption executes (founder
> sign-off, C-021.3), 02's copy becomes a pointer to this section. The fit thesis and the
> capture rule are PRODUCT_STRATEGY § the fit thesis; this section is the matching model
> itself.

**The duality law applied twice** (02 §3.1: project the messy thing onto two measurable axes):

- **The task vector.** A task decomposes into a **thinking slot** and a **doing slot**; it is categorized by **domain** (marketing, design, ML, …) and carries an **uncertainty level**. Identifying and classifying the task is the easy half — tasks are already structured atoms in the NOF chain.
- **The person vector.** A person is read on **action-oriented vs reaction-oriented** and **slow vs fast thinking**, plus personality (nature/nurture ~49/51) — **discovered by assessment instruments**, which is why the Profile is so personal (AIR's workforce assessment feeds it). The Profile's match-grade tags *are* the person vector.
- **The match.** Task demands map to person traits with weights — *"if the action requires the doer to be more rational, weightage is added to people who react rationally"* (founder notes p.3). **v1 model: weighted similarity over the two vectors, plus context** — current load, the active milestone, the person's streak.

**Where it surfaces**: this is person-altitude NBM — *which task, to whom, today* — on the Planning page (02 §3.2). It is also the training altitude: daily task-level usage is what feeds the engine.

**The build rule** (binding on every schema that touches these surfaces): capture signals as structured, queryable fields — tags, enums, scored dimensions — never prose blobs. A free-text "interests" field is decoration; a tagged one is a future join key. v1 does not build the matcher; **v1 makes the matcher possible.**

**Limits, stated up front** (C-016):

- **Org size**: below ~30 people the founder's own knowledge of every person beats any matcher — person-altitude NBM degrades and its confidence display must say so.
- **Jurisdiction**: works-council and consent regimes constrain per-person telemetry (ICP §1); no match without lawful signals.
- **Goodhart exposure**: once gauges are felt as appraisal they get gamed; the appraisal posture is deliberately open (C-016.4) and its first real-world signal triggers the constitution revisit.

**The Article 13 seam**: classifying a task is auditable arithmetic (Nexus). *Matching* a task to a person is a prediction (iBrain) — it always renders as a recommendation with a confidence and a why, never as a fact, and a human assigns the task. The match proposes; the Manager disposes.
