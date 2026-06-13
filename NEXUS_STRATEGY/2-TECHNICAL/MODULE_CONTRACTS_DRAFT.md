---
id: nexus.module-contracts-draft
title: Module Contracts Draft — the eight blocks' contract.ts signatures
tier: T2
status: active
owner: agent
updated: 2026-06-13
summary: >
  The TypeScript contract.ts signature for each of the eight blocks placed in
  MODULARIZATION_PLAN, plus the AIR AssessmentProvider registration, the two
  composition shells' interfaces, the platform NotificationPort, the Layer-4
  orchestrator seam, and the PageContract (carrying stage-weather + rules
  surface). Interface + the contract-test SHAPE only (shapes / errors /
  idempotency / tenant-isolation per TECH_STRATEGY anatomy) — never
  implementations (CLAUDE.md rule 7). Every call/event in the USER_JOURNEYS
  journey↔contract index appears here as a signature (acceptance criteria);
  routes cite API_SURFACE clusters; cross-boundary edges cite
  MODULE_DEPENDENCY_GRAPH. Reflects the four ratified decisions: consolidate
  (C-003), TS strict (C-004), Program entity (C-005), stage machine + Layer 4
  (C-020). Night 2 reads this to scaffold each module's contract.ts before its
  service.
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/MODULARIZATION_PLAN.md
children: []
revisit:
  - on: "N1-P4-02 (Karvia diff + AssessmentProvider spec) refines or contradicts a signature here"
    stage: N1
  - on: "a Night 2 module build finds a contract method missing or mis-shaped (the contract is wrong if a shell needs a model these don't expose)"
    stage: N2
  - on: "the founder ratifies or overrides the §NotificationPort owner assignment (mirrors MODULARIZATION_PLAN §7)"
    stage: N2
---

# Module Contracts Draft — the eight blocks' `contract.ts` signatures

## Purpose

MODULARIZATION_PLAN fixed *where each thing lives* (the block, the shell, or the
dead list). This doc draws *what its published interface looks like*: the
TypeScript `contract.ts` signature for each of the eight blocks, the two shells,
the platform ports, and the orchestrator seam. It is the artifact Night 2 reads
to scaffold `src/modules/<name>/contract.ts` **before** writing the service
behind it (CLAUDE.md rule 7 — contracts first, code second).

It draws **interfaces and the contract-test shape only** — never implementations.
A signature here says *what other modules may ask and what they get back*; the
test shape says *what the contract test must assert* (shapes, errors,
idempotency, tenant isolation — TECH_STRATEGY § the eight blocks). The bodies are
Night 2's job.

### How to read a block entry

Each block lists, in this order:

- **Republishes** — the endpoint set it exposes (cites the API_SURFACE cluster).
- **Consumes** — the sibling contracts it calls (cites the bold cross-boundary
  edges in MODULE_DEPENDENCY_GRAPH § route-clusters; nothing else crosses a
  boundary in v1).
- **`contract.ts`** — the TypeScript interface.
- **Events** — what it emits / subscribes on the in-process bus (one process,
  C-003 — `events.ts` per the anatomy).
- **Contract-test shape** — the four assertions the test file must make.

### What is fixed before any signature (the four decisions)

| Decision | What it forces on every signature below |
|---|---|
| **C-003 consolidate** | One process. The bus is in-process and typed (`platform/event-bus/`, TQ-1). No method is a network RPC; "contract call" = a synchronous in-process interface call. |
| **C-004 TS strict** | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. Public methods export TS types only, never raw objects. Edge input is `zod`-validated (IM-3); these interfaces describe the *post-validation* shape. |
| **C-005 Program entity** | Tenancy is `Company → Program → Objective`. **Every** cross-module call carries a `ProgramScope` (`{ companyId, programId, actorUserId }`); every owned record carries `program_id`. Tenant isolation is a contract-test invariant, not a convention. |
| **C-020 stage machine + Layer 4** | The stage machine is a Layer-2 engine inside `@nexus/governance`; the orchestrator is a `platform/orchestrator/` seam owned by no block. Blocks never call an LLM directly — only the orchestrator does, behind its interface. |

## Shared types — the preamble every `contract.ts` imports

These live in a tiny shared `platform/contracts/types.ts` (types only, zero
runtime, importable by any block — the one exception to AP-1, because they *are*
the contract vocabulary, not a model).

```ts
// ── Tenancy (C-005) ──────────────────────────────────────────────
// Carried on every cross-module call. Tenant isolation is enforced here:
// a contract impl MUST reject a ref whose program_id ≠ scope.programId.
export interface ProgramScope {
  companyId: Id;
  programId: Id;
  actorUserId: Id;                 // for decision-rights / audit (governance)
}
export type Id = string;          // Mongo ObjectId hex; opaque across boundaries

// ── NOF chain addressing ─────────────────────────────────────────
export type NodeKind = 'objective' | 'key_result' | 'milestone' | 'task';
export interface NodeRef { kind: NodeKind; id: Id; }

// ── Progress (the roll-up's only output type) ────────────────────
export interface Progress {
  pct: number;                     // 0..100, computed — never written (NOF)
  computedAt: string;              // ISO; freshness floors read this (T6)
  stale: boolean;                  // true ⇒ tiles say "running on old data" (T6)
  source: 'rollup';                // provenance: always computed, Article 13
}

// ── Roles & modes (mirror PageContract) ──────────────────────────
export type Role = 'owner' | 'business_owner' | 'manager' | 'employee' | 'consultant';
export type OperatingMode = 'engagement' | 'builder';

// ── Error taxonomy (every contract throws only these) ────────────
export type ContractError =
  | { code: 'NOT_FOUND'; ref: NodeRef | Id }
  | { code: 'CROSS_TENANT'; scope: ProgramScope; ref: Id }   // tenant-isolation breach
  | { code: 'INVARIANT'; rule: string }                       // e.g. NOF 6–7 cap, owner-required
  | { code: 'NOT_AUTHORIZED'; role: Role; action: string }
  | { code: 'CONFLICT'; reason: string };                     // idempotency / state-machine guard
```

**Idempotency convention** (asserted in every test): mutating methods that a
retry could double-fire (`createClient`, `bulkCreate`, `complete`, `initiate`,
`handover`) take an optional `idempotencyKey: string` and return the existing
record on replay rather than creating a second.

---

## Block 1 — `@nexus/crm`

- **Republishes** (API_SURFACE): `auth.js` (13), `companies.js` (12),
  `businesses.js` (6 → Company), `teams.js` (9), `invitations.js` (13, minus the
  two survey-taker routes →asmt), `admin.js` (1), `config.js` (6). Auth published
  **once** (kills the iam duplicate, drift #3).
- **Consumes**: nothing inbound for its own writes — it is the most-imported
  block (`User` 23, `Company` 19 in server core). It calls the `NotificationPort`
  **directly** for pre-program invitation mail only (§NotificationPort, the one
  exception).
- **New surface** (MODULARIZATION_PLAN §1): `createCompany(motion='direct')` (J5),
  `createClient` (J1), `switch-company` → program/tenant switch.

```ts
export interface CrmContract {
  // ── reads everyone else consumes (the 23/19 import edges) ──────
  getUser(scope: ProgramScope, userId: Id): Promise<UserView>;
  getCompany(scope: ProgramScope, companyId: Id): Promise<CompanyView>;
  validateInvitation(token: string): Promise<InvitationView>;        // J2; anon, no scope

  // ── tenancy lifecycle ─────────────────────────────────────────
  createCompany(input: NewCompany, motion: 'consultant' | 'direct',
                idempotencyKey?: string): Promise<CompanyView>;       // J5 org-direct entry
  createClient(scope: ProgramScope, input: NewClient,
               idempotencyKey?: string): Promise<ClientView>;         // J1; emits client.added
  switchProgram(actorUserId: Id, programId: Id): Promise<ProgramScope>; // was switch-company

  // ── match-grade profile capture (structured, never prose — fit thesis) ──
  upsertProfileSignals(scope: ProgramScope, userId: Id,
                       signals: ProfileSignals): Promise<void>;       // J2

  // ── consultant access scoping (handover moat, J4) ─────────────
  grantConsultantAccess(scope: ProgramScope, consultantId: Id): Promise<void>;
  revokeConsultantAccess(scope: ProgramScope, consultantId: Id): Promise<void>; // J4
}
```

- **Events**: emits `client.added` (→ assessment auto-initiates, J1; the BOQ
  auto-initiation seam). Consumes none.
- **Contract-test shape**:
  - *shapes* — `getUser`/`getCompany` return the `*View` projection, never the
    raw mongoose doc (black-box test: no schema leaks).
  - *errors* — `getUser` on a foreign `program_id` throws `CROSS_TENANT`, not
    `NOT_FOUND` (isolation must be observable).
  - *idempotency* — `createClient` with a repeated key returns the first client,
    emits `client.added` exactly once (assert call count, rule 6).
  - *tenant isolation* — no method returns a record whose `program_id` ≠
    `scope.programId`; `validateInvitation` is the sole scope-free method and
    returns only the token's own program binding.

---

## Block 2 — `@nexus/tasks`  *(the first contract Night 2 draws — collision #1)*

- **Republishes** (API_SURFACE): `tasks.js` (19), re-parented to `milestone_id`
  (NOF). `complete`/`progress` **emit roll-up events**, store no % at the
  task→milestone boundary.
- **Consumes**: `crm.getUser` (assignee). `:id/comments` re-homes → `@nexus/knowledge`.
- **Collapses**: the three Karvia `Task` schemas (server, tracking, collaboration)
  → one. `Move` folds in as fields (`moveType`/`frequency`, C-008).

```ts
export interface TasksContract {
  listFor(scope: ProgramScope, milestone: Id): Promise<TaskView[]>;   // roll-up reads up
  get(scope: ProgramScope, taskId: Id): Promise<TaskView>;

  bulkCreate(scope: ProgramScope, milestone: Id, drafts: TaskDraft[],
             idempotencyKey?: string): Promise<TaskView[]>;           // J1·J3, planning shell
  update(scope: ProgramScope, taskId: Id, patch: TaskPatch): Promise<TaskView>; // J3
  complete(scope: ProgramScope, taskId: Id,
           idempotencyKey?: string): Promise<TaskView>;               // J3; emits task.completed
  block(scope: ProgramScope, taskId: Id, reason: string): Promise<TaskView>;    // J3
  unblock(scope: ProgramScope, taskId: Id): Promise<TaskView>;
}
// TaskView carries milestone_id, assignee, status, moveType?/frequency? — NO stored pct.
```

- **Events**: emits `task.completed` (→ roll-up chain; pure, no stored %, J3),
  `task.blocked` (→ governance at-risk weather, T6). Consumes none.
- **Contract-test shape**:
  - *shapes* — `TaskView` never exposes a `pct`; progress is the objectives
    roll-up's job, asserted absent here.
  - *errors* — `complete` on an already-complete task returns the same view +
    emits `task.completed` zero extra times (idempotent), throws `CONFLICT` only
    on a genuine state clash (e.g. complete-while-blocked).
  - *idempotency* — `bulkCreate` with a repeated key returns the first batch.
  - *tenant isolation* — `listFor` rejects a milestone outside scope.

---

## Block 3 — `@nexus/objectives`  *(+ hosts the roll-up engine — step-2 call resolved)*

- **Republishes** (API_SURFACE): `objectives.js` (20), `cascade.js` (6), the two
  AI-drafting clusters `ai-okr.js` (11) + `objective-wizard.js` (7) as an internal
  **service** (human approval mandatory, Article 13). `:objectiveId/progress`
  write **dies** (roll-up-computed). `check-limit` → the NOF 6–7-concurrent cap.
- **Consumes**: `key-results.listFor(objective)`, the roll-up reads (its own,
  below), `crm.getUser/getCompany`, `assessment.deliverables` (the
  `createFrom(deliverable)` handoff, J1 step 8). AI drafting calls the
  **orchestrator** (never an LLM directly, C-020).
- **Roll-up host** (this session's decision): objectives **hosts** the one roll-up
  service (TECH_STRATEGY § roll-up — "exactly one roll-up module"; the chain's apex
  owner) but **publishes it as a read contract** (`rollup.*`) so milestones/tasks
  emit upward without importing it. It subscribes to `task.completed` /
  `milestone.advanced` and recomputes on the write path; reads are a lookup.

```ts
export interface ObjectivesContract {
  // ── O of OKR lifecycle (de-calendared, any-day start/end — NOF) ──
  create(scope: ProgramScope, input: NewObjective): Promise<ObjectiveView>;
  createFrom(scope: ProgramScope, deliverable: DeliverableRef,
             idempotencyKey?: string): Promise<ObjectiveView[]>;      // J1·4·5 seed handoff
  advanceLifecycle(scope: ProgramScope, objectiveId: Id,
                   to: ObjectiveStage): Promise<ObjectiveView>;       // lifecycle stages
  listFor(scope: ProgramScope): Promise<ObjectiveView[]>;             // program-scoped
  summaryFor(scope: ProgramScope): Promise<ObjectiveSummary>;         // crm dashboards (bold edge)
  checkConcurrentCap(scope: ProgramScope): Promise<{ open: number; cap: 6 | 7 }>; // NOF rule

  // ── the roll-up read contract (objectives-hosted, exposed) ──────
  rollup: {
    progressFor(scope: ProgramScope, ref: NodeRef): Promise<Progress>;       // any chain node
    programProgress(scope: ProgramScope): Promise<Progress>;                 // governance/dashboard
    // recompute is NOT public: it fires on the write path via the event
    // subscriber below. Reads are pure lookups against denormalized storage.
  };
}
export type ObjectiveStage = 'draft' | 'active' | 'sustained' | 'closed';
```

- **Events**: emits `objective.closed` (→ knowledge close ritual, J4), subscribes
  `task.completed` + `milestone.advanced` (→ `rollup.recompute`, internal, J3).
- **Contract-test shape**:
  - *shapes* — `rollup.progressFor` returns `Progress` for all four `NodeKind`s
    via one function (TECH_STRATEGY: every tile traces to one roll-up function).
  - *errors* — `create` past the 6–7 cap throws `INVARIANT{rule:'nof-concurrent-cap'}`;
    a `:objectiveId/progress` *write* path does not exist (assert no such method).
  - *idempotency* — `createFrom` with a repeated key returns the first seeded set
    (no duplicate objectives from a re-clicked "Create objectives" CTA, T3→T4).
  - *tenant isolation* — `rollup` never aggregates across `program_id`.

---

## Block 4 — `@nexus/key-results`

- **Republishes** (API_SURFACE): `key-results.js` (4). De-calendared: `quarters[]`
  dies (NOF).
- **Consumes**: `objectives` contract to validate parent on create.
- **Owns**: `KeyResult` standalone collection only — the embedded
  `Objective.key_results[]` dual-write is **not lifted** (AP-4, D6).

```ts
export interface KeyResultsContract {
  listFor(scope: ProgramScope, objective: Id): Promise<KeyResultView[]>;  // objectives consumes
  create(scope: ProgramScope, objective: Id, input: NewKeyResult): Promise<KeyResultView>;
  update(scope: ProgramScope, krId: Id, patch: KeyResultPatch): Promise<KeyResultView>;
  remove(scope: ProgramScope, krId: Id): Promise<void>;
}
// metricType: 'number' | 'percent' | 'boolean' | 'currency' (roll-up reads this); no quarters[].
```

- **Events**: none emitted; its progress flows up through the objectives roll-up.
- **Contract-test shape**:
  - *shapes* — standalone collection only; assert no embedded-array write path.
  - *errors* — `create` against a missing/foreign objective throws `NOT_FOUND` /
    `CROSS_TENANT` (parent validated via `objectives`, the bold edge).
  - *idempotency* — `update` is naturally idempotent (last-write-wins on patch).
  - *tenant isolation* — `listFor` rejects a foreign-program objective.

---

## Block 5 — `@nexus/milestones`  *(~1 week, objective-relative — NOF)*

- **Republishes** (API_SURFACE): the **three Karvia WeeklyGoal surfaces collapsed
  to one** (drift #2: `weekly-goals.js` 5 + `goals.js` `/weekly/*` 5 +
  `planning.js` `/goals/weekly` 2). Milestones hang off the **objective**, not the
  KR. `generate` (AI milestone-plan drafting) survives → orchestrator.
- **Consumes**: `objectives` (parent), `tasks.listFor(milestone)`, the roll-up read
  upward. Goal-keyed edges **die** (NOF).

```ts
export interface MilestonesContract {
  listFor(scope: ProgramScope, objective: Id): Promise<MilestoneView[]>;  // objective-relative
  create(scope: ProgramScope, objective: Id, input: NewMilestone): Promise<MilestoneView>; // J1
  advance(scope: ProgramScope, milestoneId: Id): Promise<MilestoneView>;  // J1; emits milestone.advanced
  update(scope: ProgramScope, milestoneId: Id, patch: MilestonePatch): Promise<MilestoneView>;
}
```

- **Events**: emits `milestone.advanced` (→ objectives roll-up). Consumes none.
- **Contract-test shape**:
  - *shapes* — `MilestoneView` parents to `objective_id`, never `key_result_id`
    (the NOF reshape; the KR-keyed Karvia read is gone).
  - *errors* — `create` against a foreign objective → `CROSS_TENANT`.
  - *idempotency* — `advance` past the last state throws `CONFLICT`, not a silent
    no-op.
  - *tenant isolation* — `listFor` scoped to program.

---

## Block 6 — `@nexus/assessment`  *(the pluggable interface — AIR ships v1)*

- **Republishes** (API_SURFACE): `assessments.js` (24), `assessmentQuestions.js`
  (5), `assessmentTemplates.js` (6 — Builder authoring), the two survey-taker
  routes in `invitations.js` (`/survey/:token`, `/survey/:token/start`).
- **Consumes**: `crm.getUser/getCompany` (were shared imports → contract calls).
- **Dies with it**: the SSI diagnostic family (40 routes, C-006); the hardcoded SSI
  bank in `engines/assessment/index.js`. SSI survives only in `_source/`.
- **AIR is config inside `impls/air/`** — nothing hardcoded in handlers (AP-3); the
  block contract is the **generic `AssessmentProvider` registry**, below.

```ts
export interface AssessmentContract {
  // ── provider registry (the block's real contract; AIR registers into it) ──
  register(provider: AssessmentProvider): void;                       // boot-time, AIR seed
  listProviders(): ProviderMeta[];                                    // "Create {name} assessment"

  // ── the published reads/writes other blocks consume ────────────
  initiate(scope: ProgramScope, providerId: string,
           moment: DeliveryMoment, mode: OperatingMode,
           idempotencyKey?: string): Promise<AssessmentView>;         // J1·5 (auto via client.added)
  captureEvidence(scope: ProgramScope, assessmentId: Id, ev: Evidence): Promise<void>; // J2
  score(scope: ProgramScope, assessmentId: Id): Promise<Score>;       // J2; pure over evidence
  deliverables(scope: ProgramScope, assessmentId: Id): Promise<Deliverable[]>; // J1 step 8 → objectives
  deck(scope: ProgramScope, assessmentId: Id): Promise<DeckSpec>;     // J2; FLASHCARD, never a form
  history(scope: ProgramScope, companyId: Id): Promise<AssessmentView[]>; // J4·5; recurring deltas
}
export type DeliveryMoment = 'first_time' | 'recurring' | 'pulse';
```

`AssessmentProvider` is the interface AIR implements — **carried verbatim from
TECH_STRATEGY § pluggable assessment** (`id`, `meta`, `instruments(ctx)`,
`score(evidence)`, `deliverables(...)`, `seedObjectives(...)`, `lifecycle`); this
draft does not re-invent it. N1-P4-02 (the second-provider drill spec) extends it.

- **Events**: subscribes `client.added` (→ `initiate`, the auto-initiation seam,
  J1); emits `assessment.scored`, `assessment.delivered` (→ My Clients score
  column, objectives seeding CTA, T3).
- **Contract-test shape**:
  - *shapes* — `score()` is pure over `Evidence[]` (unit-testable without Mongo);
    `deck()` returns a flashcard `DeckSpec`, asserted never a survey-form shape.
  - *errors* — `initiate` for an unregistered `providerId` throws `NOT_FOUND`;
    AIR-internal dimensions never leak through the generic contract (black-box).
  - *idempotency* — `initiate` on `client.added` retry returns the first
    assessment (the auto-initiation must not double-fire, rule 6).
  - *tenant isolation* — `history` returns only the company's own program records.

---

## Block 7 — `@nexus/governance`  *(oversight, decision rights, the stage machine)*

- **Republishes** (API_SURFACE): `dashboard.js` (8) as **read contracts** over the
  NOF chain (`weekly-performance` re-keys to milestones); the state-override routes
  from `consultant.js` gain a governance audit event. `observer`-engine lifecycle
  observation → **explicit domain-event handlers here** (no `res.on('finish')`, AP-7).
- **Consumes**: read contracts over every chain block (`objectives.rollup.programProgress`,
  etc.); the `NotificationPort` for program-scoped dispatch (§NotificationPort).
- **Owns** (C-020): the **stage machine** (Layer-2 engine — program stage is
  first-class state), decision-rights/override audit, the nudge-dispatch policy,
  the read-only program-dashboard composition.

```ts
export interface GovernanceContract {
  // ── the stage machine (C-020; fires only on 01 §4 entry moments) ──
  currentStage(scope: ProgramScope): Promise<ProgramStage>;
  // transitions are NOT a free setter: they fire from subscribed domain events
  // (client.added, assessment sprint begin, engagement signed, work tracked,
  // handover) — never timers, never judgment calls (TECH_STRATEGY § stage machine).

  // ── dashboard reads (read contracts over the chain) ────────────
  dashboard(scope: ProgramScope): Promise<DashboardView>;             // ≤4 tiles, page contract
  handoverReadiness(scope: ProgramScope): Promise<ReadinessView>;     // T9 surface

  // ── decision rights & the handover moat (J4) ──────────────────
  recordOverride(scope: ProgramScope, target: NodeRef, decision: OverrideDecision): Promise<void>;
  handover(scope: ProgramScope, idempotencyKey?: string): Promise<HandoverResult>; // J4
}
export type ProgramStage = 'prospect' | 'measure' | 'align' | 'transform' | 'evolve';
```

- **Events**: emits `program.stage_changed` (J1·5 · T0–T9 — the event pages,
  gauges, decks, My-Clients registry subscribe to), `nudge.sent` (every send
  logged to the signal store; BRQ nudge-independence, T0–T10). Subscribes
  `client.added`, `assessment.scored`, `objective.closed`, `task.blocked`
  (at-risk weather), the milestone/review cadence signals.
- **Contract-test shape**:
  - *shapes* — `handoverReadiness` is computed from outcome-record accumulation
    (J4), returns a typed `ReadinessView`, not a boolean.
  - *errors* — `handover` before readiness throws `INVARIANT{rule:'handover-not-ready'}`;
    `recordOverride` by a role without decision rights → `NOT_AUTHORIZED`.
  - *idempotency* — `handover` with a repeated key returns the first result;
    `program.stage_changed` emits once per genuine transition (assert no
    duplicate on event replay — the stage machine guards re-entry).
  - *tenant isolation* — every dashboard read is single-program; cross-program
    portfolio roll-up is the Engagement shell's job, never a governance leak.

---

## Block 8 — `@nexus/knowledge`  *(institutional capture, outcome evidence)*

- **Republishes** (API_SURFACE): `outcome-capture.js` (11), `feedback.js` (15), the
  comment routes re-homed from `tasks.js`/`collaboration` (by `{entity_type,
  entity_id}` reference). Reserves the **srishti integration seam** (attachment
  refs + event feed, not implemented until srishti stabilizes — TQ-3).
- **Consumes**: read contracts for outcome composition; subscribes `objective.closed`
  + recognition events (`celebrate` → knowledge).

```ts
export interface KnowledgeContract {
  // ── the NOF close ritual (consumes objective.closed) ──────────
  captureOutcome(scope: ProgramScope, objective: Id, outcome: OutcomeRecord,
                 idempotencyKey?: string): Promise<OutcomeView>;      // J4
  programOutcome(scope: ProgramScope): Promise<ProgramOutcomeView>;   // J5; baseline snapshot

  // ── comments re-homed by entity reference (was tasks/collaboration) ──
  addComment(scope: ProgramScope, on: EntityRef, body: string): Promise<CommentView>;
  commentsFor(scope: ProgramScope, on: EntityRef): Promise<CommentView[]>;

  // ── the meta-loop (Feedback; lift+redesign per DATA_MODELS) ────
  submitFeedback(scope: ProgramScope, input: FeedbackInput): Promise<FeedbackView>;

  // ── srishti seam (RESERVED, TQ-3 — declared, not implemented) ──
  // linkDocument(scope, entity: EntityRef, srishtiRef): Promise<void>;  // post-srishti
}
export interface EntityRef { entityType: NodeKind | 'program'; entityId: Id; }
```

- **Events**: subscribes `objective.closed` (→ `captureOutcome`, J4),
  `task.celebrated` (recognition). Emits none required by v1 journeys.
- **Contract-test shape**:
  - *shapes* — comments attach by `{entityType, entityId}` ref, never by importing
    the Task schema (the collaboration shadow-Task is dead, MODULE_DEPENDENCY_GRAPH #1).
  - *errors* — `captureOutcome` for a non-closed objective throws
    `INVARIANT{rule:'outcome-before-close'}`.
  - *idempotency* — `captureOutcome` on `objective.closed` retry returns the first
    record (the close ritual must not double-capture).
  - *tenant isolation* — `programOutcome` reads only the scoped program.

---

## The two composition shells — own no models

These prove the contracts are sufficient (MODULARIZATION_PLAN § the two shells): a
shell that needs a model the contracts don't expose means a contract is wrong
(the revisit trigger above). They own **zero** collections — pure contract
composition.

```ts
// shells/engagement/  — from consultant.js (15, the 10-model god-route)
export interface EngagementShell {
  portfolio(actorUserId: Id): Promise<PortfolioView>;        // tiles via read contracts, cross-program
  clientWorkspace(scope: ProgramScope): Promise<ClientWorkspaceView>;
  // composes: crm (clients/teams), objectives.listFor/summaryFor, assessment
  // reads, governance.dashboard. Goal/Move/WeeklyGoal reads die or re-key to
  // milestones. Owns nothing; every field traces to a block contract.
}

// shells/planning/  — from planning.js (14)
export interface PlanningShell {
  hierarchy(scope: ProgramScope): Promise<PlanningTreeView>;  // objectives→KR→milestone→task reads
  generatePlan(scope: ProgramScope, objective: Id): Promise<MilestoneDraft[]>; // → orchestrator
  // composes: objectives hierarchy, milestones, tasks.bulkCreate, milestone-plan
  // AI drafting (via orchestrator). ISO-week/quarterly planning dies (NOF).
}
```

- **Contract-test shape** (both): assert the shell holds **no own collection** (no
  model import) and that every read resolves through a named block contract — the
  proof the eight contracts above are complete.

---

## Platform — `NotificationPort` (audit 4.5; MODULARIZATION_PLAN §7)

> **Owner status**: the assignment below is a technical placement in the agent's
> authority (like C-003), **flagged for founder ratification** — mirrored by this
> doc's third `revisit` trigger and the plan's §7 trigger. Drafted, not promoted
> to a decision.

The rule: **no module ever imports an SMTP/Slack/Teams/calendar SDK.** One
delivery port; governance-owned dispatch for program-scoped sends; crm-direct for
pre-program invitation mail.

```ts
// platform/notifications/  — shared infra, owned by NO block (like the event bus)
export interface NotificationPort {
  send(intent: NotificationIntent): Promise<DeliveryReceipt>;
  // provider adapters (email first; slack/teams/calendar post-beta) sit BEHIND
  // this one port. Generated content (AI-drafted nudges) MUST have passed the
  // orchestrator compliance veto (Article 13 label) before reaching send().
}
export interface NotificationIntent {
  scope: ProgramScope | { preProgram: true };   // crm invitation mail is pre-program
  to: Id | { email: string };
  channel: 'email' | 'slack' | 'teams' | 'calendar';
  template: string;                              // config, AP-3 — never an inline body
  data: Record<string, unknown>;
  generated?: { vetoPassed: true };              // present iff content was AI-drafted
}
```

- **Dispatch policy** lives in `@nexus/governance`: the subscriber that maps
  `program.stage_changed` / at-risk / `nudge.sent` → `NotificationIntent` and calls
  the port. **The one exception**: `@nexus/crm` calls `send()` **directly** for
  pre-program invitation mail (account-creation tokens, before any program context
  — crm depending on governance for its own signup mail would be a backward edge).
- **Contract-test shape**: a send carrying `generated` without `vetoPassed:true` is
  rejected at the port (Article 13 enforcement is structural, not a convention).

---

## Platform — the Layer-4 orchestrator seam (C-020)

The context assembler + compliance veto. A `platform/orchestrator/` seam owned by
**no block**: only it sees across all block contracts to assemble game state, and
the policy gate runs there before anything leaves Nexus. Blocks consume it through
this interface; they never call iBrain or an LLM directly.

```ts
// platform/orchestrator/  — the only seam that may call an LLM (C-020)
export interface Orchestrator {
  // assembles game state from block contracts, applies the compliance veto
  // (data covenant, no-PII, program scoping, cost ceiling, PvE/Art-6/Art-13),
  // then consumes iBrain (or the local-first fallback, C-010) behind it.
  draft<T extends DraftKind>(scope: ProgramScope, kind: T,
                             input: DraftInput<T>): Promise<Drafted<T>>;
  // kind: 'objectives' | 'krs' | 'milestone_plan' | 'nudge_copy'
}
export interface Drafted<T> {
  content: DraftContent<T>;
  provenance: 'generated';        // Article 13 — always AI-drafted label
  vetoPassed: true;               // refusals throw, never return unvetoed content
  fallbackUsed: boolean;          // C-010 local-first leg fired (cost ceiling / iBrain down)
}
```

- **Consumers**: objectives' AI service (`ai-help`, `generate-krs`), milestones'
  `generate`, governance dispatch (`nudge_copy`). All drafting routes in
  API_SURFACE (`ai-okr.js`, `objective-wizard.js`, `weekly-goals/generate`,
  `planning/generate-*`) call **this**, not an SDK.
- **Contract-test shape**: a veto failure (PII / cost ceiling / out-of-scope)
  **throws**, never returns content; `fallbackUsed:true` still returns
  `provenance:'generated'` (the local-first leg is still generated content,
  C-010/C-019). Human approval gate is downstream (Article 13) — the orchestrator
  labels, the objectives/milestones service requires the human accept.

---

## Layer-1 — the `PageContract` (extends TECH_STRATEGY; carries stage weather + rules surface)

Carried from TECH_STRATEGY § Layer 1, with the **session-27 pt-3 / N1-P3-10 items
the DoD requires made explicit** as declared contract config (so a page's
stage-keyed CTA and Dashboard section are data the stage machine drives, not
bespoke code):

```ts
interface PageContract {
  id: 'my-clients' | 'dashboard' | 'objectives' | 'assessments' | 'teams' | 'planning';
  purpose: string;
  primaryRole: Role;
  primaryCta: Cta;                                  // default; overridden per stage below
  secondaryCta?: Cta;
  analyticsStrip: TileSpec[];                        // max 4; each names its drill-down

  // ── stage weather: declared config, driven by program.stage_changed ──
  stageWeather: Record<ProgramStage, {
    primaryCta: Cta;                                 // stage-keyed CTA (session-27 pt 3)
    dashboardSection: SectionSpec;                   // stage-keyed Dashboard section
    emphasis: string;                                // the weather row's tone
  }>;

  rulesSurface: string;                              // the game rule this page states on-page (04 §5, N1-P3-10)

  emptyState: EmptyStateSpec;                        // pre-stage weather; teaches purpose
  entryPoints: PageRef[];
  exitPoints: PageRef[];
  modes: OperatingMode[];
}
```

- **Teams' Prospect empty state = the Sponsor's guided matrix import** (DoD,
  session-27 pt 3): `teams.emptyState` at `stage:'prospect'` declares
  `primaryCta:{ action:'import-sponsor-matrix' }` — the T1 guided import, not a
  generic "add a team member."
- **Contract-test shape**: each page's `stageWeather` covers all five
  `ProgramStage` keys (exhaustive — the generated journey test walks each); exactly
  one `primaryCta` resolves per `(page, stage)`; `rulesSurface` is non-empty (every
  page states its rule — 04 §5).

---

## Acceptance criteria — the journey↔contract index, every row mapped

USER_JOURNEYS § journey↔contract index is the acceptance list (the card). Every
row now has a signature above:

| Journey index row | Drawn as | Block |
|---|---|---|
| `crm.createClient` · `crm.validateInvitation` · `crm.upsertProfileSignals` · `crm.revokeConsultantAccess` (J1·2·4) | `CrmContract.{createClient, validateInvitation, upsertProfileSignals, revokeConsultantAccess}` | crm |
| `crm.createCompany(motion=direct)` (J5) | `CrmContract.createCompany(input, 'direct')` | crm |
| `event client.added` (J1) | emitted by `createClient`; subscribed by `assessment.initiate` + governance | crm→asmt/gov |
| `assessment.initiate(moment,mode)` · `.captureEvidence` · `.score` · `.deliverables` · `.deck` · `.history` (J1·2·4·5) | `AssessmentContract.{initiate, captureEvidence, score, deliverables, deck, history}` | assessment |
| `objectives.createFrom(deliverable)` · lifecycle stages (J1·4·5) | `ObjectivesContract.{createFrom, advanceLifecycle}` (+ `ObjectiveStage`) | objectives |
| `milestones.create/advance` · `tasks.bulkCreate/update/block` (J1·3) | `MilestonesContract.{create, advance}` · `TasksContract.{bulkCreate, update, block}` | milestones / tasks |
| `event task.completed` → roll-up (pure, no stored %) (J3) | `TasksContract.complete` emits `task.completed`; `ObjectivesContract.rollup` subscribes | tasks→objectives |
| `event objective.closed` → `knowledge.captureOutcome` · `knowledge.programOutcome` (J4·5) | `ObjectivesContract` emits `objective.closed`; `KnowledgeContract.{captureOutcome, programOutcome}` | objectives→knowledge |
| `governance.handover(program)` (J4) | `GovernanceContract.handover` | governance |
| `event program.stage_changed` (J1·5 · T0–T9) | emitted by `GovernanceContract` stage machine | governance |
| `event nudge.sent` (T0–T10) | emitted by governance dispatch; logged to signal store | governance |
| governance handover-readiness surface (T9) | `GovernanceContract.handoverReadiness` | governance |

Every row is covered. The trigger-map rows T0–T10 (USER_JOURNEYS) resolve through
`program.stage_changed` + `nudge.sent` + the `NotificationPort` dispatch policy —
no new contract surface beyond the above.

## What N1-P4-02 takes from here

- The `AssessmentProvider` interface (carried from TECH_STRATEGY) is the spec the
  **Karvia diff + second-provider drill** measures against: implementing provider
  #2 must touch only `assessment/impls/<new>/`, nothing in `AssessmentContract`.
- The Night 2 build order (MODULARIZATION_PLAN § build order) reads each block's
  `contract.ts` here first, writes the contract test to the four-assertion shape,
  then the service.
- Open, deferred to their named owners: TQ-1 (event-bus impl — these signatures
  assume a typed in-process bus), TQ-2 (denormalized roll-up *storage* shape — the
  `rollup` read contract is fixed here; the on-disk shape is Night 2), TQ-3
  (srishti seam — declared reserved in `KnowledgeContract`, not implemented).
