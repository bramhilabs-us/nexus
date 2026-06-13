---
id: nexus.product-strategy
title: Nexus Product Strategy — six pages, two modes
tier: T1
status: active
owner: founder
updated: 2026-06-12
summary: >
  The UI-layer card: the page contract (purpose, primary role, entry/exit,
  primary/secondary CTA, analytics strip, stage weather, rules surface,
  empty-as-early state) applied to all six pages; the stage dimension
  (6 pages × 5 stages matrix, one home page per stage — from the Game §4);
  two operating modes (Engagement/Builder); objective lifecycle; score
  display doctrine (Article 6 + bedside-manner); three-things-today;
  first-value journey; analytics doctrine; design-language pointer.
parents:
  - NEXUS_STRATEGY/00_NORTH_STAR.md
  - NEXUS_STRATEGY/0-BUSINESS/AI_CONSULTING_PLAYBOOK.md
children:
  - NEXUS_STRATEGY/03_NEXUS_GAME.md
  - NEXUS_STRATEGY/1-PRODUCT/CAPABILITIES.md
  - NEXUS_STRATEGY/1-PRODUCT/ROADMAP.md
  - NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md
  - NEXUS_STRATEGY/1-PRODUCT/NOF.md
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
  - NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md
  - NEXUS_STRATEGY/4-CUSTOMER/README.md
revisit:
  - on: "a page contract changes in code (PageContract registration differs from this doc)"
    stage: N3
  - on: "an assessment block adds/changes what pages must surface"
    stage: N3
---

# Nexus Product Strategy — six pages, two modes

## Purpose

This document is the UI-layer card of the pack. It defines the **page contract** — the common structure every page obeys — and applies it to the six pages Nexus inherits from Karvia, now serving **two operating modes**: the consulting engagement and the post-handover product team. Any session that touches what a user sees or does draws this card first. The goal: a user always knows why they are on a page, what to do first, and where they go next.

## TL;DR

- Nexus keeps Karvia's **six pages**: My Clients, Dashboard, Objectives, Assessments, Teams, Planning. Same flow, same clicks — better purpose-clarity per page, **new minimalistic design language** (founder's design docs, incoming).
- Every page obeys one **page contract**: purpose, primary role, entry points, exit points, primary CTA, secondary CTA, analytics strip, stage weather, rules surface, empty (early) state.
- Pages are **stage-responsive** (03 §4, C-017 propagation): a page knows which stage the program is in and serves that player at that stage — same place, different weather. Each stage has exactly one home page; an "empty" state is really an *early* state.
- Two modes, one product: **Engagement mode** (consultant runs an AIR engagement end to end) and **Builder mode** (the handed-over client's product team runs product development on the same pages).
- The Assessments page is **assessment-agnostic**: it renders whatever assessment blocks are installed. AIR is simply the first. Nothing on any page hardcodes AIR.
- Analytics answer two different users: the **first-time** visitor (am I set up right?) and the **hundredth-time** visitor (what changed, what needs me?). Minimum space, no vanity numbers.

---

## The product in one paragraph

Nexus is more than an OKR tool: it makes strategy a rhythm instead of a one-off. An objective is achieved through a definitive number of steps — each step a task measured in hours; several tasks complete a milestone (~1 week each); several milestones complete a key result; a key result is roughly 25% of the way to an objective (4–5 KRs per objective, ideally). Per [NOF](NOF.md), objectives are **self-rolling**: they start and end on any day, everything beneath aligns to *their* timeline (no quarters, no ISO weeks), an org runs 6–7 concurrently — and KRs measure *progress* while the close of each objective writes an *outcome* record. Small teams coordinate through this cadence, and management overhead collapses because strategy, planning, and execution live in one recursive loop — not in a project tool someone "regularly looks at."

## Two operating modes

The same six pages serve two lives of a client account:

| | **Engagement mode** | **Builder mode** |
|---|---|---|
| When | From onboarding through handover | After handover, indefinitely |
| Driver | Consultant running the AIR engagement | The client's product/delivery teams |
| Programs | The transformation program (assessment → roadmap → execution) | Product-development programs (any application being built) |
| Assessments page | Evidence capture + scoring + deliverables for the active assessment | Re-assessment / new verticals as needed |
| Objectives source | Seeded from the Opportunity Register | Created by the team's own planning |
| Add-on | — | **srishti** (documents + model care, LLM-connected) |

Handover is a program-lifecycle event, not a migration: the consultant's access ends, the client keeps everything (tech card owns the mechanics). The product bet: a team that ran its transformation in Nexus keeps running its product development in Nexus — **the single tool an AI product builder needs for project and coordination management**, with srishti for documents and LLMs for intelligence.

## Roles and their home pages

Per C-001/C-006, consultant-led is the beachhead and org-direct remains first-class. Per C-005, every role operates inside a **Program** (an org can run several concurrently).

**Four archetypes, unlimited roles.** At the highest level there are always exactly four player archetypes — permissions, home pages, and page contracts bind to these and only these:

| Archetype | Home page | What they came to do |
|---|---|---|
| **Consultant** | My Clients | Scan all client engagements in < 20 seconds; advance the pipeline. Exists only to help the other players play better — never owns the company's game. |
| **Business Owner** | Dashboard | See whether the program is on track; unblock what isn't. Owns the Company Profile (with Managers). |
| **Manager** | Objectives | Drive their objectives; turn assessment results into OKRs. Co-owns the Company Profile. |
| **Worker** | Planning | Any individual contributor — employee, architect, delivery manager, designer. Knows the current milestone's tasks; executes and logs progress. |

Below the archetypes, **roles are extensible labels**: adding "Architect" or "Delivery Manager" is creating a label that maps to the Worker archetype — one admin action in Configuration, zero permission redesign. The label slots into the Company Profile (org structure); the *skill set* behind it lives in the person's Profile (match-grade, per the fit thesis). New role ≠ new code, ever.

**The archetype seam** (C-023). The roster — Consultant · Business Owner · Manager · Worker — is finalized, and "Worker" is the confirmed name (an individual contributor; "employee" would ambiguously include Managers and BOs). The Taker is a *persona*, not an archetype — the tutorial player any archetype passes through (03 §2). The set is deliberately **not** config-extensible the way roles are: a new archetype is a designed structural move, and its cost is named so it can be priced rather than improvised — a new archetype enum value (DATA_MODELS § User) + a home page + a full page contract (all ten fields × stage weather) + a permission set + a STAKEHOLDERS row. Anything cheaper than that bill is a role label, not an archetype. The named watch-case is the **Steward** (03 §6.4) — a BRAMHI-side role today, the first candidate that may someday earn archetype status through this seam.

In org-direct/Builder mode there is no Consultant; My Clients hides, and the journey starts at Assessments or Objectives.

## The page contract

Every page declares all ten fields. A page that can't fill in a field is a page without a reason to exist.

| Field | Meaning |
|---|---|
| **Purpose** | The one job this page does; whose home page it is |
| **Primary role** | The role this page is optimized for (others can visit) |
| **Entry points** | Where users arrive *from* (nav, CTA on another page, email link, first login) |
| **Exit points** | Where the page naturally sends you next when its job is done |
| **Primary CTA** | The single most important action — visually dominant, one per page |
| **Secondary CTA** | The supporting action — present but subordinate |
| **Analytics strip** | The few numbers worth the space: first-time view + hundredth-time view |
| **Stage weather** | How the page renders per program stage (the matrix below); implemented by the stage machine (TECH_STRATEGY) |
| **Rules surface** | Where the page states the game rule it embodies — pages teach the game in place, never in a manual (04_RUNTIME_MODEL §5) |
| **Empty (early) state** | What a brand-new user sees. An empty state is the page's *pre-stage weather* — a page is never empty, it is early; it must teach the page's purpose and point at the primary CTA |

## The stage dimension — same place, different weather

The founder's page philosophy, binding (03 §4 → here, per the consequence queue): **every
page serves any player at any stage**. A page that renders identically at Measure and at
Evolve is breaking its promise to one of them. The reference matrix:

| Page | Prospect (lobby) | Measure | Align | Transform | Evolve |
|---|---|---|---|---|---|
| **My Clients** | prospect tile, *Start assessment* CTA | sprint progress ring, days elapsed | engagement badge, roadmap status | portfolio gauges lighting up | alumni view: subscription health, re-assessment cadence |
| **Dashboard** | — (no program yet) | **sprint pulse**: instruments done, participants assessed, days to workshop | commitment view: roadmap → objectives conversion, owners assigned | **execution pulse** + the instrumentation quest line ("gauges lit: n of 9") | rhythm view: cadence adherence, BOQ trend, band position |
| **Objectives** | — | early state: "your assessment will seed these" | **seeding**: Opportunity Register → objectives, KRs drafted | the living board: lifecycle ribbons, roll-ups | Sustained KPIs tracked year-over-year |
| **Assessments** | invitation pending | **the stage itself**: the two-week workspace, evidence, scoring workshop | results → *Create objectives* handoff | pulses; instrumentation quests as telemetry connects | recurring decks with deltas; re-benchmarking |
| **Teams** | sponsor's guided matrix import | the interview matrix: who's being assessed, participation | role labels → objective owners mapping | daily fabric: who's in which program | the org map matured: profiles rich, match-grade tags |
| **Planning** | — | — (Workers aren't in the game yet) | first milestones drafted by Managers | **the stage itself**: the Worker's daily home | cadence on rails; milestone streaks without nudges |

Two structural rules fall out of the matrix:

1. **Each stage has exactly one home page where that stage is played** — Measure lives
   on Assessments, Align on Objectives, Transform on Planning, Evolve on Dashboard. The
   staircase maps onto the nav; the game always has a "you are here."
2. **Stage state is engine state, not UI state**: the stage machine is a Layer-2 concern
   (TECH_STRATEGY, designed in N1-P3-06); pages *render* the stage, they never compute it.

## The six pages

### 1. My Clients — the consulting pipeline

| Field | Contract |
|---|---|
| Purpose | One-glance overview of every client engagement: assessment score, objectives, pipeline stage — scannable in **< 20 seconds**. A CRM shaped for transformation work. |
| Primary role | Consultant (their home page / landing page after login) |
| Entry points | Consultant login (default landing); global nav |
| Exit points | **Company page** of a client (the natural drill-down); Assessments (start an assessment for a prospect) |
| Primary CTA | **Add Client** — captures a **named Sponsor** (name + email, the Sponsor bridge, 03 §6.1) and **auto-initiates the entry assessment (AIR)**: no manual send; the mail goes to the Sponsor, who **takes the assessment or delegates it** (04_RUNTIME_MODEL §4); the assessment module owns delivery from this moment, and cadenced re-assessments keep the ladder moving (the constitution §4; scores: 0-BUSINESS/scores/BOQ.md) |
| Secondary CTA | **Open company page** (per client card) |
| Analytics strip | First-time: Clients count. Hundredth-time: **Need Attention**, **Avg assessment score**, **At Risk** — the triage numbers. |
| Empty state | "Add your first client" — one card-sized explainer of the engagement journey |

Per-client tile shows: company + contact, score ring per installed assessment (AIR today; columns appear per assessment block, never hardcoded), objectives total, on-track count, % complete, pipeline stage badge (**Prospect · Measuring · Aligning · Transforming · Evolving** — the constitution §4 ladder; earlier badge names are superseded), assessed-members count. A Prospect tile's inline CTA is **Start assessment** — the tile itself advances the journey. Prospect's exit criterion is crisp (03 §6.1): **sponsor activated + matrix loaded + sprint scheduled.**

### 2. Dashboard — the pulse

| Field | Contract |
|---|---|
| Purpose | Answer "is the program on track, and what needs me today?" — for *any* player. **The three-things-today rule** (04_RUNTIME_MODEL §5): every archetype arriving here sees the ~3 actions that keep the ball rolling today — stage-aware, person-altitude, drawn from the game structure (an assessment to take, a review due, a milestone at risk). This is the NBM made daily. |
| Primary role | Business Owner (home page); Manager (frequent); every archetype daily |
| Entry points | BO login (default landing); nav; "view program" from My Clients (consultant viewing a client) |
| Exit points | Objectives (drill into a slipping objective); Planning (drill into this week) |
| Primary CTA | **Push task completion** — nudge the owners of overdue/at-risk tasks (the dashboard's job is to convert visibility into action). Every push is a **logged nudge event** — BRQ measures nudge-independence, so the system records its own prompts (04_RUNTIME_MODEL §4) |
| Secondary CTA | Natural insights — open the analytics detail for any tile |
| Analytics strip | First-time: setup completeness (team onboarded? assessment done? objectives created?). Hundredth-time: program % complete, on-track/at-risk objectives, this week's task completion rate, overdue count. |
| Stage weather | At **Transform**, the instrumentation quest line is a first-class object: *"Gauges lit: 5 of 9 — next: connect the incident tracker; MTTR arms after two weeks of data"* (the valley UX, 03 §6.2). Each gauge declares its arming checklist; watching the fog lift is the product working. |
| Empty state | Setup checklist mirroring the first-value journey (below) |

In Builder mode the Dashboard is the product team's delivery pulse — same tiles, program = the application being built.

### 3. Objectives — the lifecycle board

| Field | Contract |
|---|---|
| Purpose | Create and track objectives through their three lifecycle stages; the gamified heart of the product |
| Primary role | Manager (home page); Business Owner |
| Entry points | Nav; Dashboard drill-down; Assessments ("create objectives from these results") |
| Exit points | Planning (break a KR into milestones); Dashboard (zoom back out) |
| Primary CTA | **Create objective** — pre-seeded from assessment deliverables (e.g., AIR's Opportunity Register) when arriving from Assessments |
| Secondary CTA | Update progress / check-in on a KR; the quiet **AI-draft CTA** — KRs/milestones drafted by the planner seam, always labeled AI-drafted, accepted by a human (04_RUNTIME_MODEL §3; lifts the Manager's clerical weight, 03 F9) |
| Analytics strip | Objectives by stage (Identified / Handed off / Sustained), on-track vs at-risk, avg % complete — plus the **team-altitude NBM**: "which objective deserves focus now," the Manager's hint arrow, first-class on this page (03 F9; Article 13 display: a recommendation with a confidence and a why) |
| Empty state | "Your assessment found these opportunities — create your first objective" (assessment-driven, never a blank form) |

**The objective lifecycle** (gamified, shown as a stage ribbon on every objective):

1. **Identified** — created from assessment insight; KRs defined; team executing tasks.
2. **Handed off** — objective completed and transferred to the client/team as theirs to run.
3. **Sustained** — the objective has become a regular KPI, tracked year over year with light edits. This is the value proof: transformation became routine.

### 4. Assessments — the pluggable front door

| Field | Contract |
|---|---|
| Purpose | Run any installed assessment against a company/team, capture its evidence, and produce a credible, score-backed result with deliverables that seed objectives |
| Primary role | Consultant (runs), Business Owner (participates/reviews) |
| Entry points | My Clients ("Start assessment" on a prospect tile); nav; invitation email (a participant's entry) |
| Exit points | **Objectives** ("create objectives from these results") — the single most important handoff in the product |
| Primary CTA | **Create assessment** — typed by installed block: *Create AIR Strategic Assessment*, *Create {next vertical} assessment*, … (one option per installed assessment block) |
| Secondary CTA | Review/share completed results and deliverables |
| Analytics strip | Defined by the assessment block (AIR: evidence coverage across the sprint days, dimension scores, participants assessed vs planned) |
| Empty state | Gallery of installed assessment types with one-line descriptions |

**Assessment delivery experience — flashcards, never surveys** (founder directive 2026-06-09). Nexus explicitly rejects Karvia's survey-form assessment UX. The principles:

1. **Every question is a flashcard** — one card at a time, a flip/advance rhythm, progress *felt* rather than dreaded. Unique presentation per card, not a numbered form. (Flashcard is a first-class component: DESIGN_LANGUAGE.)
2. **Delivery format follows the assessment moment** — these are different experiences, not one form reused:
   - **First-time** — onboarding-grade: sets the tone of the whole engagement; this is most client employees' *first ever* Nexus experience, so it IS the funnel.
   - **Recurring/regular** — lighter, familiar, shows deltas against the taker's own history ("here's what changed since last time").
   - **In-between pulses** — short, targeted, purposeful; minutes not sessions.
3. **The why is always on screen** — every assessment opens by telling the taker why *this* assessment, *now*, and what happens with the result. Nobody takes a mystery quiz.
4. **People should love taking it.** If completion feels like a chore, the design failed — assessment completion rate and taker sentiment are product metrics, not afterthoughts.

Interaction design for the flashcard deck is deliberately open (PQ-4) — explored in the N1-P2-08 mockups with the founder, settled in Night 3.

This page is a **shell**: every assessment-specific surface — instruments, evidence capture, scoring views, deliverables — is rendered *by the installed assessment block* into the shell's slots. For AIR that means the two-week sprint becomes a workspace: per-day instruments (workshops, interviews, floor observations, surveys), artifact capture (Business Context Canvas, Value Stream Map, …), the scoring workshop, and the generated deliverables (AIR Score, Opportunity Register, Risk Register, 90-day plan, 12-month roadmap). For a survey-style assessment it's just questions and a score. **Nothing outside the block knows the difference** — installing a new assessment adds a "Create X" option and a score column on My Clients; nothing else changes. SSI is not shipped; it remains a Karvia-reference example only (C-006).

### 5. Teams — the people fabric

| Field | Contract |
|---|---|
| Purpose | Onboard and organize the people who will execute the program; map roles and program memberships |
| Primary role | Business Owner (setup phase); Manager (ongoing) |
| Entry points | Nav; Dashboard setup checklist ("onboard your team") |
| Exit points | Assessments (assess the team you just added); Objectives (assign ownership) |
| Primary CTA | **Invite member** |
| Secondary CTA | Create team / assign roles |
| Analytics strip | Members onboarded vs invited, members per team, assessment participation |
| Empty state | "Invite your team — objectives need owners" |

### 6. Planning — the weekly rhythm

| Field | Contract |
|---|---|
| Purpose | Turn KRs into milestones (~1 week each) and tasks; the execution surface where hours get logged |
| Primary role | Employee (home page); Manager (planning) |
| Entry points | Employee login (default landing); nav; Objectives ("plan this KR") |
| Exit points | Back to Objectives (progress rolls up automatically); Dashboard |
| Primary CTA | **Add milestone / task** (context-dependent: planning vs executing) |
| Secondary CTA | Mark task complete / log hours |
| Analytics strip | Current milestone: tasks done vs planned, hours logged, milestone completion streak |
| Empty state | "Pick a key result and plan its first milestone" |

**The first-session contract** (03 §6.3, binding for the Worker's first Planning visit):
(1) it greets them with their own thread — *"in week one you told us X; here's what
changed because of it"* (the Taker→Worker continuity, paid off explicitly); (2) zero
setup — milestone and tasks arrive pre-seeded by the Manager's planning; (3) it ends
inside ten minutes with one real action logged; (4) **the subtraction rule** — within
the first week, the team names one standing meeting or status artifact the roll-up has
made redundant, and kills it, visibly. Adoption is purchased with removal, never with
features.

## The secondary surfaces — player cards and the meta-loop

The six pages are the game board. The account-menu surfaces (Karvia's avatar dropdown: Profile, Company Profile, Configuration, Settings, Feedback) are not afterthoughts — each has its own purpose, and two of them are **player cards** whose data makes the endgame possible:

| Surface | Purpose | Scope | What it captures (and why) |
|---|---|---|---|
| **Profile** | Who the player is | Per user | Skills, **intrinsic motivations, interests**, working style, role per program. Partially populated by assessment instruments (AIR Day 7 workforce assessment feeds it). |
| **Company Profile** | What the team is playing for | Per company | Industry, size, **goals and strategic priorities**, context. AIR's Day 1 Business Context Canvas lands here — the engagement fills the card, not a separate form. |
| **Configuration** | What the admin shapes — the game's tuning knobs | Per company/program (admin only) | Installed assessment blocks, program defaults, feature flags, integrations (srishti), **custom role labels** (mapped to the 4 archetypes), **game weights** (team weightings, score thresholds — every number in the game is admin-tunable config data, never code, AP-3) |
| **Settings** | What each user adjusts | Per user | Notifications, appearance, locale. Strictly personal — anything affecting others belongs in Configuration, never here. |
| **Feedback** | The meta-loop | Per user → BRAMHI | Feature ideas, bugs, pulse. Flows into **Nexus's own backlog**: triaged, prioritized, status visible to the submitter ("you said → we did"). This is IM-9 dogfooding with a pipe: every tenant is a product-development sensor. |

### The fit thesis — best task, best person

Profile tells us **who** (intrinsic motivation, skills, interests). Company Profile tells us **what the company wants**. The Objective states the goal explicitly. Tasks are the atoms. Put 20 tasks under an objective and the backend can match the best task to the best person by joining these three structures.

**v1 does not build the matcher — v1 makes the matcher possible.** The rule for every schema touching these surfaces: capture signals as *structured, queryable fields* (tags, enums, scored dimensions), never as prose blobs. A profile "interests" field that's free text is decoration; one that's tagged is a future join key. (Data rules: TECH_STRATEGY Layer 3; the fit engine itself is parked in IMPROVEMENT_PLAN until post-beta.)

## The first-value journey

The journey every new engagement walks; the Dashboard empty state, the demo script, and the E2E test suite are all this list:

1. Consultant logs in → lands on **My Clients** → **Add Client** (or BO signs up directly → starts at step 3).
2. Client appears as Prospect → consultant clicks **Start assessment** (AIR Strategic Assessment).
3. Client onboards their team (**Teams**); the engagement runs in **Assessments** — evidence captured per the assessment's instruments, scored, deliverables generated.
4. Deliverables land → BO/Manager clicks **Create objectives from these results** (**Objectives**) → objectives *Identified*, 4–5 KRs each, seeded from the Opportunity Register / 90-day plan.
5. Manager plans the first milestone (**Planning**) → tasks with hour estimates.
6. Team executes; task completion rolls up task → milestone → KR → objective; **Dashboard** shows the pulse.
7. Objectives complete → *Handed off* → program handover → **Builder mode**: the product team keeps Nexus (+ srishti) as their development OS; objectives become *Sustained* KPIs tracked year over year.

**North-star metric**: time from consultant's first login (or org signup) to the client's first objective reaching *Identified* with a planned week. Everything in the UI exists to shorten this. **Second metric** (the moat): % of handed-over clients still active in Builder mode 90 days after handover.

## The score display doctrine

Every score surface on every page obeys the constitution's display rules — UI never gets
a vote on these:

- **Article 6, all five, always**: number + band + provenance label + anchor-pack id +
  evidence drill-down. Plus its two extensions (C-017): **the cohort floor** (below a
  real segment cohort: anchor placement labeled research-grade and self-trend only —
  never a fake percentile) and **no verdict without a path** (a score below its band's
  midpoint never renders without its paired NBM).
- **Articles 3 + 2**: below an activity or freshness floor the gauge says *"insufficient
  signal"* or *"running on old data"* — never a confident number; provenance (Proxy /
  Partially Measured / Measured) is never blended silently.
- **The bedside-manner rules** (03 §6.5) govern negative gauges: the implicated see it
  first; trend before position; evidence is dignity; the hardest truth of a cycle routes
  through the human Calibration Review, never a push notification.
- **Article 14 (PvE)**: no surface, tile, or nudge ever renders a colleague-vs-colleague
  comparison.
- **Three kinds of number, three labels** (04_RUNTIME_MODEL §3, proposed): *computed*
  scores carry evidence; *learned* recommendations carry a confidence and a why;
  *generated* content carries an AI-drafted label until a human accepts it.

## Design language

New, minimalistic — Nexus does not inherit Karvia's visual design. The source of truth is the two-tier brand (C-013): the NEXUS product guide (Sora/Manrope, sidebar shell) governs all product surfaces, the BRAMHI parent guide governs collateral only — translated to UI rules in [design/DESIGN_LANGUAGE.md](design/DESIGN_LANGUAGE.md). Governing intent:

- Few words, strong visual hierarchy; executive-dashboard feel, not consulting-flyer (the same standard set for the one-pager collateral).
- Minimum chrome: one primary CTA visually dominant per page, analytics tiles ≤ 4, whitespace over borders.
- One small component set shared by all six pages (tile, card, stage ribbon, CTA pair, empty state) — the design system is itself a lego constraint.
- **The card zoom grammar** (04_RUNTIME_MODEL §5): every entity card declares its zoom levels (full / compact / line) with fixed fields per level; a page chooses a zoom level, never a field mix. Detail: DESIGN_LANGUAGE § card grammar.

Page-level mockups are produced during Night 3 *from* these rules, token-first (see DESIGN_LANGUAGE § token-first workflow).

## Analytics doctrine

- **Minimum space.** A tile must change a decision; otherwise it's deleted. Four top-level tiles per page, maximum.
- **Two audiences per strip.** First-time visitor: "am I set up correctly, what's next?" Hundredth-time visitor: "what changed since yesterday, what needs me?" The strip serves the hundredth-time user; empty states serve the first-time user.
- **Numbers are entrances, not decorations.** Every tile drills into the page that fixes the number (At Risk → the at-risk list, not a chart).

## Open questions

- **PQ-1** — Dashboard primary CTA final wording ("Push task completion" vs "Nudge owners"): settle during Night 3 UI build; not blocking.
- **PQ-2** — Exact tile sets per page beyond the four named on My Clients: derive from real usage in beta; start with the contracts above.
- ~~**PQ-3** — Design docs~~ — **RESOLVED 2026-06-09**: BRAMHI brand guide landed in `design/brand/`; [design/DESIGN_LANGUAGE.md](design/DESIGN_LANGUAGE.md) governs. UI build unblocked.
- **PQ-4** — Flashcard assessment interaction design (card transitions, answer inputs per question type, deck progress, delta-display for recurring): founder has the principle, not yet the mechanics. Explore via N1-P2-08 mockups (assessment flashcard mockup included); settle in Night 3.
