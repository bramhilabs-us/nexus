# Nexus Product Strategy — the six pages

**Status**: Active
**Last Updated**: 2026-06-09
**Owner**: Founder + agent (interactive session 2026-06-09)
**Tier**: T1
**Depends on**: [00_NORTH_STAR.md](../00_NORTH_STAR.md), `_agent/DECISIONS.md` (C-001, C-005), `_source/KARVIA_STRATEGY/00_MASTER_STRATEGY.md`

---

## Purpose

This document is the UI-layer card of the pack. It defines the **page contract** — the common structure every page obeys — and applies it to the six pages Nexus inherits from Karvia. Any session that touches what a user sees or does draws this card first. The goal: a user always knows why they are on a page, what to do first, and where they go next.

## TL;DR

- Nexus keeps Karvia's **six pages**: My Clients, Dashboard, Objectives, Assessments, Teams, Planning. Same flow, same clicks — better purpose-clarity per page.
- Every page obeys one **page contract**: purpose, primary role, entry points, exit points, primary CTA, secondary CTA, analytics strip, empty state.
- Each page is the **home page for one role**: My Clients → Consultant; Dashboard → Business Owner/Manager; Planning → Employee.
- Analytics answer two different users: the **first-time** visitor (am I set up right?) and the **hundredth-time** visitor (what changed, what needs me?). Minimum space, no vanity numbers.
- The product's pulse is the **objective lifecycle**: Identified → Handed off → Sustained — gamified, visible on every relevant page.

---

## The product in one paragraph

Nexus is more than an OKR tool: it makes strategy a rhythm instead of a one-off. An objective is achieved through a definitive number of steps — each step a task measured in hours; several tasks complete a milestone (weekly goal); several milestones complete a key result; a key result is roughly 25% of the way to an objective (4–5 KRs per objective, ideally). Small teams coordinate through this cadence, and management overhead collapses because strategy, planning, and execution live in one recursive loop — not in a project tool someone "regularly looks at."

## Roles and their home pages

Per C-001, both GTM motions are first-class: consultant-led and org-direct. Per C-005, every role operates inside a **Program** (an org can run several concurrently).

| Role | Home page | What they came to do |
|---|---|---|
| **Consultant** | My Clients | Scan all client programs in < 20 seconds; onboard the next client |
| **Business Owner** | Dashboard | See whether the transformation is on track; unblock what isn't |
| **Manager** | Objectives | Drive their objectives; turn assessment results into OKRs |
| **Employee** | Planning | Know this week's goals and tasks; execute and log progress |

In org-direct mode there is simply no Consultant in the loop; My Clients hides, and the Business Owner's journey starts at Assessments.

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

### 1. My Clients — the consultant's CRM

| Field | Contract |
|---|---|
| Purpose | One-glance overview of every client: assessment score, objectives, status — scannable in **< 20 seconds**. This is a CRM shaped for transformation work. |
| Primary role | Consultant (their home page / landing page after login) |
| Entry points | Consultant login (default landing); global nav |
| Exit points | **Company page** of a client (the natural drill-down); Assessments (send assessment to a prospect) |
| Primary CTA | **Add Client** |
| Secondary CTA | **Open company page** (per client card) |
| Analytics strip | First-time: Clients count. Hundredth-time: **Need Attention**, **Avg assessment score**, **At Risk** — the triage numbers. |
| Empty state | "Add your first client" — one card-sized explainer of the consultant journey |

Per-client tile shows: company + contact, assessment score (ring), objectives total, on-track count, % complete, stage badge (Prospect → Onboarding → Active), assessed-members count. A Prospect tile's inline CTA is **Send assessment** — the tile itself advances the journey.

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

### 3. Objectives — the lifecycle board

| Field | Contract |
|---|---|
| Purpose | Create and track objectives through their three lifecycle stages; the gamified heart of the product |
| Primary role | Manager (home page); Business Owner |
| Entry points | Nav; Dashboard drill-down; Assessments ("create objectives from this result") |
| Exit points | Planning (break a KR into weekly goals); Dashboard (zoom back out) |
| Primary CTA | **Create objective** — pre-seeded from assessment results when arriving from Assessments |
| Secondary CTA | Update progress / check-in on a KR |
| Analytics strip | Objectives by stage (Identified / Handed off / Sustained), on-track vs at-risk, avg % complete |
| Empty state | "Your assessment found these focus areas — create your first objective" (assessment-driven, never a blank form) |

**The objective lifecycle** (gamified, shown as a stage ribbon on every objective):

1. **Identified** — created from assessment insight; KRs defined; team executing tasks.
2. **Handed off** — objective completed and transferred to the client/team as theirs to run.
3. **Sustained** — the objective has become a regular KPI, tracked year over year with light edits. This is the value proof: transformation became routine.

### 4. Assessments — the pluggable front door

| Field | Contract |
|---|---|
| Purpose | Run any assessment vertical against a company/team and produce a credible, score-backed result that seeds objectives |
| Primary role | Consultant (sends), Business Owner (takes/reviews) |
| Entry points | My Clients ("Send assessment" on a prospect tile); nav; invitation email (assessee's entry) |
| Exit points | **Objectives** ("create objectives from this result") — the single most important handoff in the product |
| Primary CTA | **Create assessment** — typed by vertical: *Create SSI assessment*, *Create AI Readiness assessment*, … (one button per installed assessment block) |
| Secondary CTA | Review/share a completed result |
| Analytics strip | Completion rate of sent assessments, scores by dimension, assessed vs total members |
| Empty state | Gallery of installed assessment types with one-line descriptions |

This page is where the lego architecture is *visible*: installing a new assessment block adds a new "Create X assessment" option and a new score column on My Clients — nothing else changes. (Contract: `TECH_STRATEGY.md` § pluggable assessment.)

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
2. Client appears as Prospect → consultant clicks **Send assessment**.
3. Client onboards their team (**Teams**) and takes the assessment (**Assessments**) → scored 0–10 per dimension.
4. Result lands → BO/Manager clicks **Create objectives from this result** (**Objectives**) → objective *Identified*, 4–5 KRs defined.
5. Manager plans the first week (**Planning**) → weekly goals → tasks with hour estimates.
6. Team executes; task completion rolls up task → milestone → KR → objective; **Dashboard** shows the pulse.
7. Objective completes → *Handed off* → over time becomes a *Sustained* KPI tracked year over year.

**North-star metric**: time from consultant's first login (or org signup) to the client's first objective reaching *Identified* with a planned week. Everything in the UI exists to shorten this.

## Analytics doctrine

- **Minimum space.** A tile must change a decision; otherwise it's deleted. Four top-level tiles per page, maximum.
- **Two audiences per strip.** First-time visitor: "am I set up correctly, what's next?" Hundredth-time visitor: "what changed since yesterday, what needs me?" The strip serves the hundredth-time user; empty states serve the first-time user.
- **Numbers are entrances, not decorations.** Every tile drills into the page that fixes the number (At Risk → the at-risk list, not a chart).

## Open questions

- **PQ-1** — Dashboard primary CTA final wording ("Push task completion" vs "Nudge owners"): settle during Night 3 UI build; not blocking.
- **PQ-2** — Exact tile sets per page beyond the four named on My Clients: derive from real usage in beta; start with the contracts above.
