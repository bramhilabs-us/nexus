---
id: nexus.modularization-plan
title: Modularization Plan — Karvia's surface re-cut into eight blocks
tier: T2
status: active
owner: agent
updated: 2026-06-13
summary: >
  The placement plan: every Karvia model, route-cluster, and engine mapped to
  exactly one of the eight Nexus blocks (or to a composition shell, or to
  death), with the private collections each block owns, the cross-boundary
  edges it consumes via contract (citing MODULE_DEPENDENCY_GRAPH), and the
  endpoint set it republishes (citing API_SURFACE). Fixes the AIR impl-folder
  layout inside @nexus/assessment, assigns the one contract-fronted outbound
  notification owner (audit 4.5), places the Layer-4 orchestrator and the
  stage machine (C-020), and ranks the Night 2 build order off the dependency
  cycles. The contract TypeScript signatures themselves live in
  MODULE_CONTRACTS_DRAFT.md (N1-P4-01 step 2); this doc says where each thing
  lives and why, not what its method signatures are.
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md
  - NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md
  - NEXUS_STRATEGY/2-TECHNICAL/API_SURFACE.md
children: []
revisit:
  - on: "MODULE_CONTRACTS_DRAFT.md lands (N1-P4-01 step 2) — it becomes a child here; every signature must trace to a block placed in this doc"
    stage: N1
  - on: "a Night 2 lift re-homes a model/route this plan placed elsewhere"
    stage: N2
  - on: "the outbound-notification owner assignment (§7) is ratified or overridden by the founder"
    stage: N2
---

# Modularization Plan — Karvia's surface re-cut into eight blocks

## Purpose

TECH_STRATEGY says *what the architecture is* (four layers, eight blocks, the
anatomy). MODULE_DEPENDENCY_GRAPH says *who touches what data*. API_SURFACE says
*what the world can call*. This doc is the join: it takes every model, route
cluster, and engine those three catalogued and **assigns each to exactly one
home** — a block, a composition shell, or the dead list — with the reason and the
contract edges that placement implies. It is the bridge the Night 2 build reads to
know, for any line of Karvia, which `src/modules/<name>/` folder it lifts into (or
that it does not lift at all).

It deliberately stops short of TypeScript signatures: those are
MODULE_CONTRACTS_DRAFT.md (step 2 of this same task). Here the unit is *placement*,
not *method shape*.

## TL;DR

- **Eight blocks own all surviving data; two shells own none; everything else dies.**
  The 410 Karvia routes (API_SURFACE) collapse to **8 module surfaces + 2
  composition shells** (Engagement, Planning) + the dead/deferred lists. No
  surviving capability is homeless and nothing has two homes.
- **One collection, one owner** (the cure for the shadow-schema disease,
  MODULE_DEPENDENCY_GRAPH §cycles): `Task` lives only in `@nexus/tasks`, `User`/
  `Company` only in `@nexus/crm`, `Objective` only in `@nexus/objectives`. The
  three `Task` schemas, two `User`, two `Objective` collapse to one each.
- **Cross-boundary reads are the bold edges and nothing else** (MODULE_DEPENDENCY_GRAPH
  §route-clusters): each block's contract surface = exactly the cross-module edges
  it consumes, no speculative API.
- **AIR is config inside one folder.** `@nexus/assessment` is generic
  (`AssessmentProvider`); AIR lives entirely under `assessment/impls/air/` as seed
  data — dimensions, instruments, rubrics, deliverable templates — nothing
  hardcoded in handlers (AP-3), nothing referenced from outside the block.
- **Outbound mail/notification has one owner** (§7, audit 4.5): a platform
  `NotificationPort` adapter delivers; `@nexus/governance` owns dispatch policy for
  program-scoped sends; `@nexus/crm` calls the port directly only for pre-program
  invitation mail. No module ever talks to an SMTP/Slack SDK itself.
- **The Layer-4 orchestrator and the stage machine are placed** (C-020): the
  orchestrator is a platform seam (not a block); the stage machine is a Layer-2
  engine inside `@nexus/governance`.

## The two cuts

Modularization is two-dimensional (TECH_STRATEGY §TL;DR): the **eight blocks** slice
vertically (a capability), the **four layers** slice horizontally (UI / business
logic / data / intelligence). Every piece of Karvia is located by its
`(block, layer)` coordinate. This doc fixes the vertical cut — which block — and
notes the layer where it matters (most route handlers are Layer 1+2 of their block;
the orchestrator and notification port are platform-layer, owned by no block).

### Repo layout (the target of every lift)

Per TECH_STRATEGY §the eight blocks, each block ships the same anatomy:

```
src/
├── modules/
│   ├── crm/            { contract.ts, models/, service.ts, routes.ts, events.ts, tests/contract/ }
│   ├── assessment/
│   │   ├── contract.ts          ← AssessmentProvider registry + the published reads
│   │   ├── impls/
│   │   │   └── air/              ← AIR: dimensions, instruments, rubrics, deliverable templates (all seed/config)
│   │   ├── models/ service.ts routes.ts events.ts tests/contract/
│   ├── objectives/    key-results/    milestones/    tasks/
│   ├── governance/     ← + the stage machine engine, + notification dispatch policy
│   └── knowledge/      ← + the srishti integration seam (reserved, TQ-3)
├── platform/           ← owned by NO block; shared infra behind contracts
│   ├── event-bus/      ← in-process typed bus (one process, C-003; TQ-1)
│   ├── notifications/  ← NotificationPort + provider adapters (email/slack/teams/calendar) — §7
│   └── orchestrator/   ← the Layer-4 context assembler + compliance veto (C-020)
└── shells/             ← composition layers that own no models (§the two shells)
    ├── engagement/     ← the consultant god-route, re-cut as pure contract calls
    └── planning/       ← the Planning page composition
```

`no-restricted-imports` (AP-1) forbids any cross-`modules/*` import except a
sibling's `contract.ts`. `platform/*` and `shells/*` import only contracts. This
is the one Karvia pattern Nexus must never recreate (shared `server/models/`).

## The eight blocks — placement table

Each block lists: the **collections it owns** (private, Layer 3), the **Karvia
route clusters that inherit into it** (API_SURFACE), and the **cross-boundary edges
it consumes via contract** (the bold edges in MODULE_DEPENDENCY_GRAPH
§route-clusters). "Republishes" = the endpoint set the block exposes; "consumes" =
the other blocks' contracts it calls.

### 1. `@nexus/crm` — tenants, programs, people, roles

- **Owns**: `User`, `Company` (absorbs `Business` — DATA_MODELS), `Team`,
  `Invitation`, plus the `Program` entity (C-005, new) and `program_memberships[]`.
- **Inherits** (API_SURFACE): `auth.js` (13), `companies.js` (12), `businesses.js`
  (6 — folds into Company), `teams.js` (9), `invitations.js` (13), `admin.js` (1),
  `config.js` (6 — config data, AP-3). Auth is published **once** here (kills the
  iam-engine duplicate, drift #3).
- **Consumes**: none inbound for its own writes; it is the most-imported block
  (`User` 23, `Company` 19 in server core) — everyone consumes *it*
  (`crm.getUser`, `crm.getCompany`).
- **New surface**: `crm.createCompany(motion=direct)` (J5 org-direct entry — no
  consultant membership), `crm.createClient(program)` (J1), `switch-company`
  becomes program/tenant switch.
- **Notes**: `companies/:id/assessment-scores` **dies** here — score writes belong
  to `@nexus/assessment` via contract, never a crm route (API_SURFACE).

### 2. `@nexus/assessment` — the pluggable interface (AIR ships v1)

- **Owns**: `Assessment`, `AssessmentQuestion`, `AssessmentTemplate`, evidence and
  score records. The `AssessmentProvider` registry is the block's contract.
- **AIR impl folder** (`assessment/impls/air/`): the five dimensions (Leadership,
  Workforce, Process, Data, Execution), the instruments mirroring the two-week
  sprint, the scoring rubrics, and the deliverable generators (AIR Score,
  Opportunity Register, Risk Register, 90-day plan, 12-month roadmap, BRAMHI
  baseline) — **all seed/config, nothing in handlers** (AP-3). The hardcoded SSI
  bank (`engines/assessment/index.js`) **dies** (C-006); SSI survives only in
  `_source/` as the counter-example.
- **Inherits** (API_SURFACE): `assessments.js` (24), `assessmentQuestions.js` (5),
  `assessmentTemplates.js` (6 — Builder-mode authoring), the survey-taker routes in
  `invitations.js`. Question decks render through the shell FLASHCARD component
  (never a survey form).
- **Consumes**: `crm.getUser` / `crm.getCompany` (reads were shared imports in
  Karvia → contract calls).
- **Dies with it**: the entire SSI diagnostic family — `diagnostic-reports.js` (14),
  `context-maturity.js` (5), `disciplines.js` (3), `analytics.js` `/ssi/*` (18) =
  40 routes (C-006). The *pattern* (eligibility → generate → report → share)
  re-emerges as AIR's report surface inside this block.
- **Reserves** (SCORING_MODEL, N4): auto-initiation on the `client.added` event;
  the six BOQ driver calculators over the signal store.

### 3. `@nexus/objectives` — the O of OKR (+ the OKR AI service)

- **Owns**: `Objective`, `AIOKRSuggestion`. The shadow `scoring/models/Objective`
  **dies** (one Objective collection).
- **Inherits** (API_SURFACE): `objectives.js` (20), `cascade.js` (6), and the two
  AI-drafting clusters `ai-okr.js` (11) + `objective-wizard.js` (7) — drafting is an
  objectives-module **service**, human approval stays mandatory (Article 13). The
  `planner` engine's generation folds in here too.
- **Consumes**: `key-results.listFor(objective)` (validate/compose), the roll-up
  read contract (progress flows **up only**, NOF), `crm.getUser/getCompany`,
  `assessment.deliverables` (the `objectives.createFrom(deliverable)` handoff, J1
  step 8). Assessment inputs that were SSI-report reads become AIR outputs via
  contract.
- **De-NOF'd**: `calculate-dates`/`validate-dates`/`cascade-dates` survive but
  de-calendared (any-day start/end); `:objectiveId/progress` write **dies** —
  progress is roll-up-computed, not written. `check-limit` becomes the NOF
  6–7-concurrent cap rule.
- **Seam ancestors**: the `/ibrain/*` routes (priorities/insights/refresh) are the
  local-heuristic leg of what becomes the Layer-4 orchestrator's fallback — **not
  lifted as-is**, revisit at N4 (C-010/C-020).

### 4. `@nexus/key-results` — the KR of OKR

- **Owns**: `KeyResult` — **standalone collection only**; the embedded
  `Objective.key_results[]` dual-write is not lifted (AP-4, D6).
- **Inherits** (API_SURFACE): `key-results.js` (4).
- **Consumes**: `objectives` contract to validate parent on create. De-calendared:
  `quarters[]` dies (NOF).

### 5. `@nexus/milestones` — ~1-week, objective-relative (NOF)

- **Owns**: the Milestone collection (reshaped from `WeeklyGoal`). The **three
  Karvia WeeklyGoal surfaces collapse to one** (API_SURFACE drift #2): `weekly-goals.js`
  (5), `goals.js` `/weekly/*` (5), `planning.js` `/goals/weekly` (2) → one published
  milestones surface.
- **Inherits**: that merged WeeklyGoal surface, reshaped — milestones hang off the
  **objective** (`milestones.listFor(objective)`), not the KR. `generate` (AI
  milestone-plan drafting) survives.
- **Consumes**: `objectives` (parent), `tasks.listFor(milestone)`, the roll-up read
  contract upward. Goal-keyed edges **die** (NOF).

### 6. `@nexus/tasks` — atomic work units

- **Owns**: `Task` — **the one and only Task schema**. The three Karvia `Task`
  definitions (`server/`, `tracking/`, `collaboration/`) collapse here
  (MODULE_DEPENDENCY_GRAPH cycle #1 — *the first contract Night 2 draws*). `Move`
  folds in as Task fields (`move_type`/frequency, C-008).
- **Inherits** (API_SURFACE): `tasks.js` (19), re-parented to `milestone_id` (NOF).
  `complete`/`progress` **emit roll-up events up the NOF chain** (no stored % at the
  task→milestone boundary that the engine doesn't own).
- **Consumes**: `crm.getUser` (assignee). `:id/comments` re-homes →`@nexus/knowledge`
  (collaboration surface, entity-ref contract). The `tracking` + `collaboration`
  engines' shadow-Task surfaces **die**.

### 7. `@nexus/governance` — oversight, decision rights, the stage machine

- **Owns**: program-stage state (the stage machine, Layer 2 — see §C-020 placement),
  decision-rights/override audit records, the nudge-dispatch policy (§7), and the
  read-only program-dashboard composition.
- **Inherits** (API_SURFACE): `dashboard.js` (8) as **read contracts** over the NOF
  chain (`weekly-performance` re-keys to milestones); the state-override routes from
  `consultant.js` gain a governance audit event. `observer`-engine lifecycle
  observation becomes **explicit domain-event handlers here** (no `res.on('finish')`,
  AP-7).
- **Consumes**: read contracts over every chain block; emits/consumes
  `program.stage_changed`, `objective.closed`, `nudge.sent`.
- **New surface**: `governance.handover(program)` (J4 — the moat), handover-readiness
  surface (trigger map T9).

### 8. `@nexus/knowledge` — institutional capture, outcome evidence

- **Owns**: `OKROutcome` (the NOF outcome record), `Feedback` (the meta-loop,
  lift+redesign per DATA_MODELS), comments (re-homed from `collaboration` by
  `{entity_type, entity_id}` reference), and the **srishti integration seam**
  (reserved, attachment refs + event feed, not implemented until srishti
  stabilizes — TQ-3).
- **Inherits** (API_SURFACE): `outcome-capture.js` (11) — consumes the
  `objective.closed` event (NOF close ritual); `feedback.js` (15); the comment
  routes re-homed from `tasks.js`/`collaboration`.
- **Consumes**: read contracts for outcome composition; subscribes to
  `objective.closed`, recognition events (`celebrate` from dashboard →knw).
- **Reserves**: outcome reads feed the BOQ Knowledge score (N4).

## The two composition shells — own no models

These are the proof the contracts are sufficient: they join ≥2 blocks for one
surface and own **zero** collections (MODULE_DEPENDENCY_GRAPH §god-routes).

| Shell | From (Karvia) | Becomes | Composes (contract calls only) |
|---|---|---|---|
| **Engagement** (`shells/engagement/`) | `consultant.js` (15, the 10-model god-route) | the Consultant's Engagement-mode workspace | `crm` (clients/teams), `objectives.listFor`, `assessment` reads, the dashboard read contracts. Goal/Move/WeeklyGoal reads die or re-key to milestones. |
| **Planning** (`shells/planning/`) | `planning.js` (14) | the Planning-page composition | `objectives` hierarchy reads, `milestones`, `tasks.bulkCreate`, milestone-plan AI drafting. ISO-week/quarterly planning dies (NOF). |

## Layer-4 and the stage machine — where C-020 lands

- **The orchestrator** (the context assembler + compliance veto) is a **platform
  seam** (`platform/orchestrator/`), owned by **no block** (C-020): only it sees
  across all block contracts to assemble game state, and the policy gate
  (data covenant, no-PII, program scoping, cost ceiling, the PvE/Article-6/Article-13
  vetoes) must run there before anything leaves Nexus. Blocks consume it through a
  published interface; they never call iBrain or an LLM directly.
- **The stage machine** is a **Layer-2 engine inside `@nexus/governance`** (TECH_STRATEGY
  §the stage machine; 03 §8): program stage is first-class state, transitions fire
  only on the constitution's crisp entry moments (01 §4), and emit
  `program.stage_changed` that pages, gauges, decks, and the My-Clients registry
  subscribe to. It is governance's because stage *is* program oversight.
- **The roll-up engine** is the one calculation service (TECH_STRATEGY §roll-up).
  Placement: it reads across the NOF chain via contracts and is invoked on the write
  path; it lives as a Layer-2 service that `@nexus/objectives` hosts (the chain's
  apex owner) but exposes as its own read contract so milestones/tasks emit upward
  without importing it. *(Exact host — objectives vs a thin `platform/rollup` —
  is a step-2 contract-shape question; flagged TQ-2-adjacent.)*

## §7 — The outbound notification / mail owner (audit 4.5)

**The rule**: outbound delivery is contract-fronted; **no module ever imports an
SMTP, Slack, Teams, or calendar SDK** (the Karvia `integrations`/`whitelabel`
engines are the counter-example — they are ⏸-deferred connector shells, not lifted).

**The assignment** (a technical placement, in the agent's authority like C-003 —
not a product decision; flagged for founder ratification in the revisit trigger):

1. **Delivery** is a **platform port**: `platform/notifications/` publishes a
   `NotificationPort` contract with swappable provider adapters (email first;
   slack/teams/calendar are post-beta adapters behind the same port). Every send in
   the system goes through this one port. This is shared infra, like the event bus —
   not one of the eight blocks.
2. **Dispatch policy** — *which* domain event becomes *which* notification, to whom,
   when — is owned by **`@nexus/governance`**: it already owns program-wide
   oversight and the nudge engine (trigger map T0–T10 cite "governance contract"),
   so the subscriber that maps `program.stage_changed`/at-risk/nudge events →
   notification intents lives there and calls the port.
3. **The one exception**: **pre-program invitation mail** (account-creation tokens,
   before any program/governance context exists) is intrinsic to `@nexus/crm`; crm
   calls the `NotificationPort` **directly** for those. crm depending on governance
   for its own signup mail would be a backward edge.

So: **one delivery port, governance-owned dispatch for program-scoped sends,
crm-direct for pre-program invitation mail.** Generated notification content
(AI-drafted nudges) passes the Layer-4 compliance veto before the port sends
(Article 13 labeling).

## Build order — Night 2, ranked off the cycles

From MODULE_DEPENDENCY_GRAPH §cycles, the order that breaks the worst coupling first:

1. **`@nexus/crm`** — everyone consumes `getUser`/`getCompany` (23/19 imports);
   nothing ships without it. Includes the `Program` entity (C-005) and the auth
   consolidation.
2. **`@nexus/tasks`** — collapses the `Task` ×3 collision (cycle #1, "the first
   contract"); the one Task schema unblocks the roll-up.
3. **`@nexus/objectives` + `key-results` + `milestones`** — the NOF chain, drawn
   together so the roll-up is one-directional from day one (kills the
   objectives⇄tasks route cycle #3). Standalone-KR-only (AP-4).
4. **`@nexus/assessment`** (generic) **+ the AIR impl folder** — the proof-piece;
   the second-provider drill (N1-P4-02 / Night 3) is the acceptance test.
5. **`@nexus/governance`** (stage machine + dispatch) **and `@nexus/knowledge`** —
   the event subscribers; built once the events they consume exist.
6. **The two shells + the orchestrator seam** — last, because they prove the
   contracts beneath them are sufficient (a shell that needs a model the contracts
   don't expose means a contract is wrong).

Shadow schemas, the SSI diagnostic family, the Goal/Move layer, and the
`whitelabel`/duplicate-`iam` surfaces are **never lifted** — they die per the
dispositions in API_SURFACE and MODULE_DEPENDENCY_GRAPH.

## What N1-P4-01 step 2 takes from here

`MODULE_CONTRACTS_DRAFT.md` draws the TypeScript `contract.ts` signature for each
block placed above, in this order, with:

- the **journey steps as acceptance criteria** (USER_JOURNEYS §journey↔contract
  index — every `crm.*`/`assessment.*`/`objectives.*`/etc. call there must appear);
- **routes citing API_SURFACE** tables, **edges citing MODULE_DEPENDENCY_GRAPH**;
- the **PageContract** draft carrying the stage-weather scan items (session-27 pt 3):
  stage-keyed primary CTA + stage-keyed Dashboard section as declared contract
  config, and Teams' Prospect empty state = the Sponsor's guided matrix import;
- the `NotificationPort` and orchestrator interfaces from §7 and §C-020;
- the four ratified decisions reflected throughout: consolidate (C-003), TS strict
  (C-004), Program entity (C-005), stage machine + Layer 4 (C-020).
