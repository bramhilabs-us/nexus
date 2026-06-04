# YSELA Beta Roadmap 2026

<!-- @GENOME T1-PRD-002 | ACTIVE | 2026-03-30 | parent:T1-PRD-001 | auto:/strategy,/init | linked:/coding -->

**Document**: Beta operating roadmap
**Date**: March 30, 2026 (Updated: April 5, 2026)
**Status**: APPROVED - Sprint 21 Ready
**Owner**: Product / Delivery
**Target**: Beta Launch April 17, 2026

---

## Official Description

> **"YSELA uses the current execution stack to guide handoffs, ownership, and next moves."**

This is the single source of truth for all communications.

## 1. Executive Decision

YSELA beta should **not** be launched as a generic OKR or task platform.

YSELA beta should be launched as a **consultant-guided operating system for handoffs, ownership, and behavior change**, using the existing product surfaces:

- `Assess`
- `Team`
- `Objectives`
- `Tasks`

The strategic synthesis is:

- `Behavior Based Business (BBB)` = the philosophy
- `GRIT` = the behavior loop and evidence model
- `YSELA` = the operating system that applies both inside a company

This roadmap is built around one honest constraint:

**We do not yet have a true behavior engine.**

What we do have is enough product infrastructure to run a high-value beta, mimic the workflow, capture evidence, and use that evidence to build the first real GRIT behavior engine after beta.

## 2. What This Roadmap Is Based On

This roadmap is grounded in three sources:

### Sprint and strategy history reviewed

- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-10 (Complete)`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-11 (Complete)`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-12 (Complete)`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-13 (Complete)`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-15A (Complete)`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-16 (Complete)`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-17 (Complete)`
- `KARVIA_STRATEGY/1-PRODUCT/roadmap/ROADMAP_OVERVIEW.md`
- `KARVIA_STRATEGY/1-PRODUCT/roadmap/ROADMAP_DECISIONS.md`
- `KARVIA_STRATEGY/1-PRODUCT/PRODUCT_VISION.md`
- `KARVIA_STRATEGY/1-PRODUCT/GO_TO_MARKET.md`
- `KARVIA_STRATEGY/1-PRODUCT/USER_JOURNEYS_CONSOLIDATED.md`

### Current product and code surfaces reviewed

- `server/models/Company.js`
- `server/models/Assessment.js`
- `server/models/Team.js`
- `server/models/Objective.js`
- `server/models/Task.js`
- `server/models/OKROutcome.js`
- `server/routes/teams.js`
- `server/routes/objectives.js`
- `server/routes/planning.js`
- `server/routes/consultant.js`
- `server/services/ContextMaturityService.js`
- `engines/observer/services/BehaviorAnalysisService.js`
- `client/pages/team-ssi-view.html`
- `client/pages/teams.html`
- `client/pages/objectives.html`
- `client/pages/quarterly-review.html`
- `client/pages/scripts/teams.js`
- `client/pages/scripts/objectives.js`
- `client/pages/scripts/planning-v2.js`
- `client/pages/scripts/quarterly-review.js`

### Shareholder and narrative framing already developed

- "The mirror comes first"
- "Not more tracking. Better team formation."
- "Behavior -> Ritual -> Culture."
- Legacy Succession as the reference vertical for scale-through-handoffs

## 3. Current State: What Exists vs What Is Missing

## What already exists and should be reused

### A. Strong assessment foundation

Already built:

- SSI assessment model and scoring
- 12-block diagnostic reporting
- company profile and business context fields
- industry presets, including `financial_services_legacy_succession`
- context maturity scoring

Implication:

We do **not** need a new assessment product. We need to expand the existing one so it diagnoses handoff, trust, ownership, readiness, and maturity more directly.

### B. Strong objective and planning infrastructure

Already built:

- objective model and objective routes
- AI-assisted objective generation
- planning flow
- quarterly review and outcome capture

Implication:

We do **not** need a new execution system. We need to repurpose the current OKR and planning system so it supports human objectives and handoff progression rather than only KR and task breakdown.

### C. Basic team management exists

Already built:

- team CRUD
- membership and team pages
- consultant-led team setup patterns

Implication:

We do **not** need a new team module from scratch. We need to extend the current one into pod formation, mentor pairing, accountability design, and handoff mapping.

### D. Consultant-led GTM already exists in strategy

Already documented:

- consultant-led adoption model
- consultant onboarding journey
- multi-client consultant persona

Implication:

The beta should lean into consultant-led delivery, not product-led self-serve.

## What is still missing and must be built

### 1. No true behavior engine

Current state:

- there is behavior analysis infrastructure
- there is context maturity infrastructure
- there is outcome capture

Missing:

- behavior definitions tied to specific business objectives
- handoff state tracking
- reinforcement logic
- role-based prompts tied to behavior change
- learning loop that updates based on real company evidence

Conclusion:

For beta, we must **simulate the behavior engine with product workflow + consultant facilitation + explicit evidence capture**.

### 2. Product positioning is still wrong

Current top-level docs still describe Karvia as:

- B2B OKR platform
- AI OKR generation system
- task and planning workflow

Conclusion:

Before beta, product language must shift from:

`SSI -> OKRs -> planning -> tasks`

to:

`assessment -> team formation -> human objective -> daily handoff -> evidence`

### 3. Teams are still structural, not behavioral

Current team system mainly captures:

- name
- members
- roles
- department structure

Missing:

- pod purpose
- mentor
- organizer
- accountability pair
- handoff map
- trust and readiness notes
- shared rituals

### 4. Tasks surface is still task-centric

Current execution layer is optimized for:

- weekly goals
- daily tasks
- KR alignment

Missing:

- next meaningful move
- handoff accepted / blocked / bounced
- support needed
- coach intervention
- evidence of ownership transfer

## 4. Beta Thesis

YSELA beta will prove one thing:

**A company can improve scale, ownership, and execution quality by improving the quality of its handoffs and the behaviors around those handoffs.**

In practice, this means:

- identify where the ball keeps coming back
- redesign the team and ownership structure around it
- define the human objective underneath the business objective
- guide daily actions that strengthen the handoff
- capture evidence weekly
- use those learnings to build the GRIT engine

## 5. Beta Goals

## Product goals

- Reposition YSELA around `Assess -> Team -> Objectives -> Tasks`
- Make each surface behavior-aware, not just management-aware
- Create a beta workflow that consultants can run repeatedly

## Technical goals

- Add the missing data structures and workflow states required for handoff-based execution
- Reuse existing assessment, objective, planning, and outcome infrastructure wherever possible
- Instrument the product so beta evidence is captured cleanly

## Business goals

- Run a consultant-led beta with a small number of companies
- Focus on one strong reference vertical first: `Legacy Succession`
- Prove customer value through ownership transfer, advisor readiness, and operating capacity, not vanity activity metrics

## Learning goals

- Learn which handoff patterns repeat across companies
- Learn which team structures and rituals actually improve follow-through
- Learn which GRIT signals are observable and worth productizing

## 6. What Beta Must Not Try To Do

Do not build these before beta evidence exists:

- a fully autonomous behavior engine
- generic AI coaching claims
- broad integrations program
- platform marketplace
- self-serve PLG onboarding
- enterprise packaging
- full multi-vertical rollout

Beta should be narrow, evidence-driven, and consultant-guided.

## 7. The Beta Product Model

## Step 1: Assess

### Beta product job

Identify where the ball is actually getting stuck.

### Front-end meaning

The existing assessment layer becomes the place where the consultant and leadership team answer:

- Where is trust leaking?
- Where does work bounce back to one person?
- Which roles are not ready to own decisions?
- Which teams are structurally misaligned?
- Which objectives fail because behavior is weak, not because work is unclear?

### Back-end meaning

Assessment must extend beyond SSI scores to store:

- ownership risk
- handoff risk
- role readiness
- trust/confidence observations
- mentor/organizer notes
- company-specific behavioral themes

### Concrete build requirements

- extend assessment templates with beta-only handoff and ownership modules
- add consultant observation inputs
- add role-readiness scoring fields
- add company-level handoff risk summary
- keep SSI as the baseline diagnostic, not the full diagnostic

## Step 2: Team

### Beta product job

Design who should carry the ball together.

### Front-end meaning

The current teams surface must evolve from org chart management to:

- pod formation
- mentor assignment
- accountability pair setup
- organizer assignment
- handoff owner definition
- ritual definition

### Back-end meaning

Teams need metadata for:

- pod purpose
- target handoff
- mentor
- organizer
- operating cadence
- trust level
- readiness level
- review date

### Concrete build requirements

- extend team schema or add related beta metadata model
- add pod types for pilot companies
- add mentor and organizer roles
- add handoff owner map
- allow consultant notes directly on team/pod structures

## Step 3: Objectives

### Beta product job

Define the human objective underneath the business target.

### Front-end meaning

Current objectives must support two layers:

- business target
- human objective

Example:

- Business target: grow to 30 advisors and $400M AUM
- Human objective: build advisor pods that can independently own client reviews and transition conversations

### Back-end meaning

Objective creation must support:

- business target
- handoff objective
- behavior markers
- ownership markers
- expected evidence
- review cadence

### Concrete build requirements

- extend objective model with `human_objective`
- add `handoff_target`
- add `behavior_markers`
- add `evidence_markers`
- update objective generation prompts so AI assists with human objectives instead of generic OKRs
- preserve current KR support only where it helps measurement

## Step 4: Tasks

### Beta product job

Show the next meaningful move that improves the handoff.

### Front-end meaning

The daily layer must stop being a generic task board and become:

- next move
- handoff to make
- support needed
- blocker reason
- coach note
- evidence captured

### Back-end meaning

The execution system needs handoff-aware states, for example:

- identified
- assigned
- accepted
- blocked
- bounced
- reinforced
- sustained

### Concrete build requirements

- extend planning/task workflow with handoff states
- add "why this matters" context to each daily item
- add acceptance / bounce-back tracking
- add support-request capture
- add weekly evidence reflection into the existing review flow

## 8. Beta Workstreams

## Workstream A: Product Reframe

### Outcome

Reposition YSELA from OKR platform to handoff and ownership operating system.

### Must-do changes

- rewrite beta product story and landing language
- rewrite roadmap language away from generic OKR positioning
- align consultant journey docs to the new 4-step model
- align shareholder and client-facing narrative to BBB / GRIT / YSELA synthesis

### Done when

- all beta-facing docs use the same 4-step model
- no beta-facing doc describes YSELA as primarily a task or OKR tool

## Workstream B: Beta Assessment Expansion

### Outcome

Assess reveals not only SSI gaps but handoff and ownership gaps.

### Must-do changes

- expand assessment templates with handoff, trust, ownership, and readiness modules
- create consultant observation form
- produce company-level beta diagnostic summary
- map assessment output to specific team and objective recommendations

### Done when

- consultant can finish one beta diagnostic and identify specific stuck handoffs

## Workstream C: Team and Pod Design

### Outcome

Teams surface supports pod formation and handoff design.

### Must-do changes

- add pod-level metadata
- add mentor / organizer / accountability roles
- add handoff map
- add ritual definitions
- add review cadence

### Done when

- consultant can set up one pilot company into pods and assign support structure inside product

## Workstream D: Human Objectives and Handoff Objectives

### Outcome

Objectives page supports business target + human objective + evidence.

### Must-do changes

- add human objective fields
- add behavior and evidence markers
- update AI flows to generate human objectives
- keep objective approval workflow but change prompt logic and output structure

### Done when

- every beta objective includes both business and human layers

## Workstream E: Daily Handoff Layer

### Outcome

Tasks surface becomes a daily handoff execution layer, not just a task list.

### Must-do changes

- add handoff statuses
- add support and bounce-back capture
- connect each daily item to human objective
- simplify daily view to the next meaningful move

### Done when

- a team member can open the day view and understand exactly what handoff or ownership move matters next

## Workstream F: Beta Consultant Console

### Outcome

Consultant becomes a first-class operating role inside the product.

### Must-do changes

- create consultant beta overview page or extend current consultant view
- show client-by-client handoff risks
- show team/pod status
- show weekly evidence and intervention log
- add consultant notes and playbook prompts

### Done when

- consultant can run a weekly beta cadence from one place

## Workstream G: Evidence and Learning Loop

### Outcome

Beta creates the evidence needed to build the real GRIT engine.

### Must-do changes

- define behavior markers per beta objective
- define weekly evidence capture structure
- track bounce-back, support needed, and ownership transfer signals
- instrument outcome review and intervention logging

### Done when

- product and consultant can review the same weekly evidence and compare progress across companies

## 9. Beta Phasing

## Phase 0: Reframe and Scope Lock

**Duration**: 1-2 weeks

### Objective

Lock the beta thesis, target vertical, and product scope before building more features.

### Deliverables

- approved beta thesis
- approved beta narrative and positioning
- approved target customer profile for first pilots
- approved beta scope and non-goals
- approved 4-step model mapped to current product surfaces

### Exit criteria

- team agrees YSELA beta is not being sold as a generic OKR platform
- Legacy Succession is confirmed as the lead beta example

## Phase 1: Product Conversion to Beta Workflow

**Duration**: 3-4 weeks

### Objective

Convert current surfaces into usable beta surfaces without rewriting the platform.

### Deliverables

- expanded assessment modules
- pod and mentor metadata in teams
- human objective fields in objectives
- handoff statuses in tasks/planning
- consultant beta console v1
- beta evidence schema and weekly review flow

### Exit criteria

- one internal dry run can be completed end-to-end inside product

## Phase 2: Beta Pilot Execution

**Duration**: 6-8 weeks

### Objective

Run the workflow with real companies and learn the actual handoff patterns.

### Pilot structure

- 2-3 beta companies
- consultant-led weekly cadence
- one target outcome per company
- one primary pod design per company
- weekly review and evidence capture

### Exit criteria

- at least 6 weeks of weekly evidence captured for each pilot
- at least 3 repeated handoff patterns identified across pilots

## Phase 3: Engine V1 Definition

**Duration**: 2-3 weeks after pilot evidence

### Objective

Translate pilot learnings into the first true GRIT engine specification.

### Deliverables

- behavior marker taxonomy
- handoff state model
- intervention and reinforcement rules
- prompt logic for next best move
- beta findings report by vertical

### Exit criteria

- GRIT engine v1 spec written from evidence, not hypothesis

## 10. Technical Build Plan

## Immediate product changes

### Assess

- extend current assessment template system
- add beta modules for trust, ownership, readiness, and handoff risk
- add consultant observation path
- add output mapping from diagnostic to team and objective setup

### Team

- extend current team model or create supporting metadata collection
- add pod metadata, mentor, organizer, accountability pair, and ritual fields
- add handoff design layer

### Objectives

- extend objective schema for human objective, handoff target, behavior markers, evidence markers
- update AI generation prompts and review screens
- keep KRs optional and subordinate to the human objective

### Tasks

- modify planning/task model to support handoff states and evidence capture
- show next move, support needed, and bounce-back risk
- simplify daily workflow

### Consultant console

- extend consultant route and UI to show beta client progression
- add intervention log
- add weekly evidence summary

### Analytics and data

- create beta evidence storage for handoffs, interventions, and observed behavior markers
- extend quarterly review pattern into weekly evidence review
- use current outcome capture as the base, not a parallel system

## Explicitly deferred

- broad third-party integrations
- marketplace
- mobile expansion
- autonomous AI coaching
- enterprise security packages
- generalized benchmark network

## 11. Beta Operating Model

## Consultant role

The consultant is essential during beta. The consultant is not a support layer around the product; the consultant is part of the operating model.

The consultant must own:

- diagnostic interpretation
- pod formation
- human objective shaping
- ritual design
- weekly review
- intervention logging

## Company role

The company must provide:

- executive sponsor
- named pod leaders
- weekly cadence commitment
- willingness to redesign handoffs
- willingness to capture evidence honestly

## Product role

The product must provide:

- shared visibility
- structured workflow
- daily next moves
- weekly evidence capture
- reusable patterns across clients

## 12. Legacy Succession: Primary Beta Example

Legacy Succession is the best reference vertical for beta because the business outcome is clear and the handoff problem is structural.

### Example beta target

- grow from 6 advisors to 30 advisors
- reach $400M AUM

### Normal tools can track

- meetings
- pipeline
- tasks
- client reviews

### YSELA beta should reveal

- where client ownership returns to the founder
- which advisors are not ready to lead reviews
- which transitions fail because trust is weak
- which pods need mentor reinforcement
- which rituals build independent ownership

### Why this matters

If the owner remains the default receiver of every high-value handoff, the firm cannot scale.

That is the core problem YSELA beta should help solve.

## 13. Beta Success Metrics

## Product success

- consultant can run full beta workflow without leaving the platform
- at least 80% of beta workflows use all four steps
- weekly evidence review completed consistently

## Customer success

- fewer critical handoffs returning to the same executive
- more decisions owned at pod level
- faster follow-through on target operating rhythms
- stronger confidence/readiness scores over time

## Learning success

- clear list of recurring handoff failure patterns
- clear list of effective interventions
- enough evidence to define GRIT engine v1

## Business success

- 2-3 credible beta case studies
- one strong Legacy Succession case narrative
- clear statement of commercial value beyond task tracking

## 14. Decisions Required Now

These decisions should be made before beta build starts:

1. Confirm `Legacy Succession` as the lead beta vertical.
2. Confirm beta is consultant-led, not self-serve.
3. Confirm the product story shifts from OKR platform to handoff and ownership operating system.
4. Confirm the four product surfaces remain the core architecture.
5. Confirm the GRIT behavior engine is a post-beta build informed by evidence, not a beta claim.

## 15. Recommended Immediate Next Steps

### This week

- approve this beta roadmap
- freeze outdated OKR-platform positioning for beta-facing materials
- define the first 2-3 beta companies

### Next two weeks

- write beta requirements for Assess, Team, Objectives, and Tasks
- define the consultant beta playbook
- implement the minimum product changes required for internal dry run

### Before first pilot

- run one internal end-to-end rehearsal
- confirm weekly review and evidence capture process
- confirm pilot success metrics and intervention logging

## 16. CPO Perspective: Beta Value Proposition

### Core Value Statement

> YSELA Beta proves that improving handoff quality and ownership behavior drives better business outcomes than tracking more tasks.

### What Problem Does Beta Solve?

**The Stuck Owner Problem**: In service businesses, especially during growth or succession, the founder/owner becomes the default receiver of every critical handoff. Work bounces back. Decisions stall. Scale becomes impossible.

**Why existing tools fail**: They track tasks, not behavior. They set goals, not ownership. They measure activity, not readiness.

### Value by Stakeholder

| Stakeholder | Current Pain | YSELA Beta Value |
|-------------|--------------|------------------|
| **Consultant** | Managing clients through fragmented tools | Repeatable 4-step system with evidence capture |
| **Business Owner** | "Everything comes back to me" | Visibility into where ownership breaks down |
| **Team Lead** | "I can't tell if my team is growing" | Human objectives + behavior evidence |
| **Employee** | "I complete tasks but nothing changes" | Next meaningful move tied to real ownership |

### Beta Success = Proving These Hypotheses

1. **Handoff diagnosis works** - SSI + ownership risk reveals where the ball bounces back
2. **Pod design works** - Teams structured around handoff goals perform better
3. **Human objectives work** - Behavior-focused objectives create real change
4. **Evidence loop works** - Weekly capture enables learning and adjustment

### What Beta Is NOT

- ❌ Generic OKR platform (not competing with Lattice/15Five)
- ❌ Self-serve PLG product (consultant-led is the model)
- ❌ AI magic (AI assists, humans own)
- ❌ Enterprise-ready (beta is narrow and learning-focused)

---

## 17. CTO Perspective: Technical Requirements

### The Core Architecture Decision

> **The beta will keep the current execution backbone: `Objective → Key Results → Goal → Task`.**
>
> **The beta will NOT introduce a new backend `Works` model.**

Instead:
- Backend `Task` remains the persistence object
- **UI labels remain as "Tasks"** (zero UI changes)
- Consultants explain tasks as "next meaningful moves" in training/onboarding
- Documentation uses behavior/handoff language, code uses existing terminology

### The Three Pillars

For YSELA to be a scalable, unbreakable, self-governing system:

### Pillar 1: SCALABLE (Prompts & Frontend First)

| Lever | Current State | Beta Action |
|-------|---------------|-------------|
| **Prompt System** | Partial templates | Canonical templates in `server/prompts/*`, guidance mandatory |
| **Frontend Copy** | Tasks/Goals language | **No UI label changes** - reframe happens in training/docs only |
| **Consultant Workflow** | Basic reporting | Weekly cadence + intervention logging |
| **Backend Schema** | Full OKR stack | **No changes unless blocked** |

**Decision Rule**: Before adding backend changes, exhaust prompts → frontend → consultant workflow options.

### Pillar 2: UNBREAKABLE (No Breaking Changes)

| Principle | How We Implement |
|-----------|------------------|
| Reuse first | Use existing `Task` model, reframe in prompts/UI |
| Reframe second | Change labels, copy, guidance - not structure |
| Extend third | Only add fields if reporting/workflow is blocked |
| Feature flags | Wrap any schema changes in flags |
| Backward compatibility | Existing OKR flow continues unchanged |

### Pillar 3: SELF-GOVERNING (System Maintains Itself)

| Mechanism | Implementation Status |
|-----------|----------------------|
| Document governance | ✅ Genome tags (65% coverage, Sprint 20.5) |
| Session management | ✅ SESSION_LOG + handoff framework |
| Sprint discipline | ✅ Master Plan → Daily → Handoff cycle |
| Testing methodology | ✅ BST (Business Scenario Testing) |
| Evidence in product | 🔨 Weekly evidence capture for learning |

### Technical Non-Negotiables for Beta

1. **No new `Works` model** - Task stays, frontend reframes
2. **No new microservices** - Existing engines handle beta
3. **Prompts are primary lever** - Differentiation through AI guidance, not schema
4. **Frontend reframing is secondary lever** - Copy changes, not component rewrites
5. **Backend changes are P2** - Only if P0/P1 approaches are blocked

### What Will NOT Be Built Before Beta

- New `Works` model or handoff engine service
- Broad schema redesign (human_objective, pod metadata are P2)
- Autonomous behavior engine
- Full consultant portal rewrite
- New microservice

---

## 18. Sprint Breakdown: Three Sprints to Beta

### Implementation Philosophy

> **"Reuse first, reframe second, extend third."**

The beta will keep the current execution backbone (`Objective → Key Results → Goal → Task`).

**What changes**: Prompts, frontend copy, consultant workflow.
**What stays**: Backend models, database schema, API structure.

See [00_MASTER_IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md) for full details.

### Decision Rule for Any Feature Request

Before adding backend or business logic, ask:
1. Can this be solved in **prompts**?
2. Can this be solved in **frontend labels/copy**?
3. Can this be solved through **consultant workflow**?
4. Is this blocked without persistence or query support?

Only if the first three answers are `no` should a backend change be approved.

---

### Sprint Timeline

| Sprint | Dates | Duration | Phase | Gates |
|--------|-------|----------|-------|-------|
| **Sprint 21** | Mar 30 - Apr 10 | 12 days | Reframe + Minimal Changes | 1, 2, 3, 4 |
| **Sprint 22** | Apr 11 - May 8 | 4 weeks | Pilot Execution | - |
| **Sprint 23** | May 9 - Jun 5 | 4 weeks | Evidence Analysis + Engine V1 | - |

---

### Sprint 21: BETA LAUNCH READY

**Sprint Goal**: Pass all 4 gates and complete internal dry run so first pilot can start April 11.

#### Gate 1: Narrative Alignment

**CPO Owns**:
- [ ] Beta roadmap approved (this document)
- [ ] Product positioning aligned - no doc describes YSELA as primarily OKR/task tool
- [ ] Consultant beta model agreed
- [ ] One-sentence beta description used everywhere: *"YSELA uses the current execution stack to guide handoffs, ownership, and next moves."*

**Deliverables**: Updated product narrative, roadmap summary, consultant onboarding narrative

#### Gate 2: Prompt Coverage

**CTO Owns**:
- [ ] All beta-critical AI paths use canonical prompt templates in `server/prompts/*`
- [ ] All beta-critical AI responses include `guidance` blocks (mandatory)
- [ ] Task-generation prompts use behavior/handoff language internally (response still returns `tasks[]`)
- [ ] Legacy Succession and consultant-led context guidance added

**Deliverables**: Prompt template updates, guidance coverage, vertical-aware language

#### Gate 3: Documentation & Training Alignment (Replaces Frontend Reframing)

**Decision (Apr 5, 2026)**: Zero UI changes. "Tasks" label stays. Reframe happens in documentation and consultant training only.

**CTO Owns**:
- [ ] All T1/T2 documentation uses official one-sentence description
- [ ] No documentation describes YSELA as "OKR software" or "task manager"
- [ ] Consultant training materials explain Tasks as "next meaningful moves"

**CPO Owns**:
- [ ] Consultant talking points finalized
- [ ] Pilot company onboarding script reflects behavior language

**Deliverables**: Updated documentation, consultant training guide, onboarding script

#### Gate 4: Beta Operations

**CPO Owns**:
- [ ] Consultant weekly review process defined
- [ ] Evidence capture path defined (in-product or standardized operational layer)
- [ ] Weekly operating cadence documented
- [ ] Intervention logging method ready
- [ ] Pilot checklist complete

**CTO Owns**:
- [ ] Consultant reporting extended for blocked/deferred task visibility
- [ ] Weekly evidence capture mechanism available
- [ ] Benchmark duplication reduced to one usable contract

#### Internal Dry Run

**Exit Criteria**:
- [ ] One internal end-to-end beta workflow completed
- [ ] All 4 gates passed
- [ ] Team can explain beta in one consistent sentence
- [ ] First pilot company identified and briefed

#### Epic Structure (Aligned with Delivery Backlog)

| Priority | Epic | Points | Focus | Owner |
|----------|------|--------|-------|-------|
| **P0** | A: Docs & Narrative | 5 | Product positioning, one-sentence alignment | CPO |
| **P0** | B: Prompt System | 13 | Canonical templates, guidance blocks, next moves | CTO |
| **P0** | C: Frontend Reframing | 8 | Planning/objective copy changes | CTO |
| **P1** | D: Consultant Operations | 8 | Weekly cadence, intervention logging | CPO |
| **P1** | E: Evidence Capture | 5 | Reporting + evidence path | CTO |
| **P1** | F: Dry Run | 3 | End-to-end validation | Both |
| | **Total** | **42** | | |

**What Will NOT Be Built in Sprint 21** (P2 - Only If Blocked):
- New `Works` model
- Objective beta metadata fields (human_objective)
- Team mentor/organizer metadata
- New handoff engine service
- Schema redesign

---

### Sprint 22: PILOT EXECUTION

**Sprint Goal**: Run consistent weekly beta cadence with 2-3 pilot companies, capture 4+ weeks of evidence.

#### CPO Deliverables
- [ ] 2-3 pilot companies onboarded
- [ ] Weekly cadence running (Monday priorities, Friday review)
- [ ] 4 weeks of evidence captured per company
- [ ] Initial patterns documented

#### CTO Deliverables
- [ ] Evidence capture working consistently
- [ ] Consultant can review blocked/deferred work
- [ ] Bug fixes from pilot feedback
- [ ] UX improvements as needed (P2 items if justified)

#### Epic Structure

| Epic | Points | Focus |
|------|--------|-------|
| G: Pilot Onboarding | 5 | Setup, training, kickoff |
| H: Weekly Evidence Loop | 8 | Review flow, intervention logging |
| I: Pilot Support | 13 | Bug fixes, UX improvements |
| J: Pattern Documentation | 5 | Emerging handoff patterns |
| **Total** | **31** | |

#### Exit Criteria
- ✅ 4+ weeks of weekly evidence from each pilot
- ✅ At least 3 repeated handoff patterns identified
- ✅ Consultant weekly review process validated

---

### Sprint 23: ENGINE V1 DEFINITION

**Sprint Goal**: Translate pilot evidence into GRIT engine v1 specification based on real data, not hypothesis.

#### CPO Deliverables
- [ ] 6+ weeks of evidence analyzed
- [ ] Recurring handoff failure patterns cataloged
- [ ] Effective interventions documented
- [ ] Beta case study drafted (Legacy Succession)
- [ ] Commercial value statement refined

#### CTO Deliverables
- [ ] Behavior marker taxonomy defined from evidence
- [ ] Handoff state model formalized
- [ ] Intervention and reinforcement rules documented
- [ ] Prompt logic for "next best move" specified
- [ ] GRIT engine v1 technical architecture drafted

#### Epic Structure

| Epic | Points | Focus |
|------|--------|-------|
| K: Evidence Analysis | 8 | Pattern extraction across pilots |
| L: Behavior Taxonomy | 8 | Marker definitions from evidence |
| M: Engine Specification | 13 | GRIT v1 technical design |
| N: Beta Findings Report | 5 | Case study + learnings |
| **Total** | **34** | |

#### Exit Criteria
- ✅ GRIT engine v1 spec written from evidence
- ✅ Clear list of recurring patterns and effective interventions
- ✅ One strong Legacy Succession case narrative
- ✅ Product decision: what to build next for engine v1

---

## 19. Final Position

The beta path is **not** to build more task software.

The beta path is to use the product we already have, reframe it around handoffs and human objectives, run it with real companies, and learn the behavior patterns required to build the true GRIT engine.

That is the shortest path to a product that is technically honest, strategically differentiated, and commercially meaningful.
