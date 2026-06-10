---
id: nexus.product-strategy
title: Nexus Product Strategy — six pages, two modes
tier: T1
status: active
owner: founder
updated: 2026-06-09
summary: >
  The UI-layer card: the page contract (purpose, primary role, entry/exit,
  primary/secondary CTA, analytics strip, empty state) applied to all six
  pages; two operating modes (Engagement/Builder); objective lifecycle;
  first-value journey; analytics doctrine; design-language pointer.
parents:
  - NEXUS_STRATEGY/00_NORTH_STAR.md
  - NEXUS_STRATEGY/0-BUSINESS/AI_CONSULTING_PLAYBOOK.md
children:
  - NEXUS_STRATEGY/1-PRODUCT/design/DESIGN_LANGUAGE.md
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
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
- Every page obeys one **page contract**: purpose, primary role, entry points, exit points, primary CTA, secondary CTA, analytics strip, empty state.
- Two modes, one product: **Engagement mode** (consultant runs an AIR engagement end to end) and **Builder mode** (the handed-over client's product team runs product development on the same pages).
- The Assessments page is **assessment-agnostic**: it renders whatever assessment blocks are installed. AIR is simply the first. Nothing on any page hardcodes AIR.
- Analytics answer two different users: the **first-time** visitor (am I set up right?) and the **hundredth-time** visitor (what changed, what needs me?). Minimum space, no vanity numbers.

---

## The product in one paragraph

Nexus is more than an OKR tool: it makes strategy a rhythm instead of a one-off. An objective is achieved through a definitive number of steps — each step a task measured in hours; several tasks complete a milestone (weekly goal); several milestones complete a key result; a key result is roughly 25% of the way to an objective (4–5 KRs per objective, ideally). Small teams coordinate through this cadence, and management overhead collapses because strategy, planning, and execution live in one recursive loop — not in a project tool someone "regularly looks at."

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

| Role | Home page | What they came to do |
|---|---|---|
| **Consultant** | My Clients | Scan all client engagements in < 20 seconds; advance the pipeline |
| **Business Owner** | Dashboard | See whether the program is on track; unblock what isn't |
| **Manager** | Objectives | Drive their objectives; turn assessment results into OKRs |
| **Employee** | Planning | Know this week's goals and tasks; execute and log progress |

In org-direct/Builder mode there is no Consultant; My Clients hides, and the journey starts at Assessments or Objectives.

## The page contract

Every page declares all eight fields. A page that can't fill in a field is a page without a reason to exist.

| Field | Meaning |
|---|---|
| **Purpose** | The one job this page does; whose home page it is |
| **Primary role** | The role this page is optimized for (others can visit) |
| **Entry points** | Where users arrive *from* (nav, CTA on another page, email link, first login) |
| **Exit points** | Where the page naturally sends you next when its job is done |
| **Primary CTA** | The single most important action — visually dominant, one per page |
| **Secondary CTA** | The supporting action — present but subordinate |
| **Analytics strip** | The few numbers worth the space: first-time view + hundredth-time view |
| **Empty state** | What a brand-new user sees; must teach the page's purpose and point at the primary CTA |

## The six pages

### 1. My Clients — the consulting pipeline

| Field | Contract |
|---|---|
| Purpose | One-glance overview of every client engagement: assessment score, objectives, pipeline stage — scannable in **< 20 seconds**. A CRM shaped for transformation work. |
| Primary role | Consultant (their home page / landing page after login) |
| Entry points | Consultant login (default landing); global nav |
| Exit points | **Company page** of a client (the natural drill-down); Assessments (start an assessment for a prospect) |
| Primary CTA | **Add Client** |
| Secondary CTA | **Open company page** (per client card) |
| Analytics strip | First-time: Clients count. Hundredth-time: **Need Attention**, **Avg assessment score**, **At Risk** — the triage numbers. |
| Empty state | "Add your first client" — one card-sized explainer of the engagement journey |

Per-client tile shows: company + contact, score ring per installed assessment (AIR today; columns appear per assessment block, never hardcoded), objectives total, on-track count, % complete, pipeline stage badge (Prospect → Assessing → Engaged → Handed over), assessed-members count. A Prospect tile's inline CTA is **Start assessment** — the tile itself advances the journey.

### 2. Dashboard — the pulse

| Field | Contract |
|---|---|
| Purpose | Answer "is the program on track, and what needs me today?" for the accountable owner |
| Primary role | Business Owner (home page); Manager (frequent) |
| Entry points | BO login (default landing); nav; "view program" from My Clients (consultant viewing a client) |
| Exit points | Objectives (drill into a slipping objective); Planning (drill into this week) |
| Primary CTA | **Push task completion** — nudge the owners of overdue/at-risk tasks (the dashboard's job is to convert visibility into action) |
| Secondary CTA | Natural insights — open the analytics detail for any tile |
| Analytics strip | First-time: setup completeness (team onboarded? assessment done? objectives created?). Hundredth-time: program % complete, on-track/at-risk objectives, this week's task completion rate, overdue count. |
| Empty state | Setup checklist mirroring the first-value journey (below) |

In Builder mode the Dashboard is the product team's delivery pulse — same tiles, program = the application being built.

### 3. Objectives — the lifecycle board

| Field | Contract |
|---|---|
| Purpose | Create and track objectives through their three lifecycle stages; the gamified heart of the product |
| Primary role | Manager (home page); Business Owner |
| Entry points | Nav; Dashboard drill-down; Assessments ("create objectives from these results") |
| Exit points | Planning (break a KR into weekly goals); Dashboard (zoom back out) |
| Primary CTA | **Create objective** — pre-seeded from assessment deliverables (e.g., AIR's Opportunity Register) when arriving from Assessments |
| Secondary CTA | Update progress / check-in on a KR |
| Analytics strip | Objectives by stage (Identified / Handed off / Sustained), on-track vs at-risk, avg % complete |
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
| Purpose | Turn KRs into this week's goals and tasks; the execution surface where hours get logged |
| Primary role | Employee (home page); Manager (planning) |
| Entry points | Employee login (default landing); nav; Objectives ("plan this KR") |
| Exit points | Back to Objectives (progress rolls up automatically); Dashboard |
| Primary CTA | **Add weekly goal / task** (context-dependent: planning vs executing) |
| Secondary CTA | Mark task complete / log hours |
| Analytics strip | This week: tasks done vs planned, hours logged, weekly goal completion streak |
| Empty state | "Pick a key result and plan your week" |

## The first-value journey

The journey every new engagement walks; the Dashboard empty state, the demo script, and the E2E test suite are all this list:

1. Consultant logs in → lands on **My Clients** → **Add Client** (or BO signs up directly → starts at step 3).
2. Client appears as Prospect → consultant clicks **Start assessment** (AIR Strategic Assessment).
3. Client onboards their team (**Teams**); the engagement runs in **Assessments** — evidence captured per the assessment's instruments, scored, deliverables generated.
4. Deliverables land → BO/Manager clicks **Create objectives from these results** (**Objectives**) → objectives *Identified*, 4–5 KRs each, seeded from the Opportunity Register / 90-day plan.
5. Manager plans the first week (**Planning**) → weekly goals → tasks with hour estimates.
6. Team executes; task completion rolls up task → milestone → KR → objective; **Dashboard** shows the pulse.
7. Objectives complete → *Handed off* → program handover → **Builder mode**: the product team keeps Nexus (+ srishti) as their development OS; objectives become *Sustained* KPIs tracked year over year.

**North-star metric**: time from consultant's first login (or org signup) to the client's first objective reaching *Identified* with a planned week. Everything in the UI exists to shorten this. **Second metric** (the moat): % of handed-over clients still active in Builder mode 90 days after handover.

## Design language

New, minimalistic — Nexus does not inherit Karvia's visual design. The source of truth is the BRAMHI brand guide, now in-repo and translated to UI rules in [design/DESIGN_LANGUAGE.md](design/DESIGN_LANGUAGE.md). Governing intent:

- Few words, strong visual hierarchy; executive-dashboard feel, not consulting-flyer (the same standard set for the one-pager collateral).
- Minimum chrome: one primary CTA visually dominant per page, analytics tiles ≤ 4, whitespace over borders.
- One small component set shared by all six pages (tile, card, stage ribbon, CTA pair, empty state) — the design system is itself a lego constraint.

Page-level mockups are produced during Night 3 *from* these rules, token-first (see DESIGN_LANGUAGE § token-first workflow).

## Analytics doctrine

- **Minimum space.** A tile must change a decision; otherwise it's deleted. Four top-level tiles per page, maximum.
- **Two audiences per strip.** First-time visitor: "am I set up correctly, what's next?" Hundredth-time visitor: "what changed since yesterday, what needs me?" The strip serves the hundredth-time user; empty states serve the first-time user.
- **Numbers are entrances, not decorations.** Every tile drills into the page that fixes the number (At Risk → the at-risk list, not a chart).

## Open questions

- **PQ-1** — Dashboard primary CTA final wording ("Push task completion" vs "Nudge owners"): settle during Night 3 UI build; not blocking.
- **PQ-2** — Exact tile sets per page beyond the four named on My Clients: derive from real usage in beta; start with the contracts above.
- ~~**PQ-3** — Design docs~~ — **RESOLVED 2026-06-09**: BRAMHI brand guide landed in `design/brand/`; [design/DESIGN_LANGUAGE.md](design/DESIGN_LANGUAGE.md) governs. UI build unblocked.
