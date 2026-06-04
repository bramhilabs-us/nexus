# YSELA Beta Master Implementation Plan

<!-- @GENOME T2-PRD-011 | ACTIVE | 2026-03-30 | parent:T1-PRD-006 | auto:/strategy,/coding | linked:- -->

## 1. Objective

Ship a beta that proves YSELA can improve handoffs, ownership, and team execution quality **without rewriting the platform**.

The implementation rule is:

**reuse first, reframe second, extend third.**

## 2. Architecture Decision

The beta will keep the current execution backbone:

- `Objective`
- embedded `Key Results`
- `Goal`
- `Task`

The beta will **not** introduce a new backend `Works` model.

Instead:

- backend `Task` remains the persistence object
- frontend and AI responses present tasks as `Next Moves`, `Handoff Steps`, or `Priority Moves`
- consultant workflow provides the behavior and team-formation layer around that substrate

## 3. Implementation Order

Implementation must happen in this order:

1. Product and roadmap alignment
2. Prompt and frontend reframing
3. Consultant beta operating model
4. Minimal backend deltas
5. Evidence capture and beta reporting
6. Internal dry run
7. Pilot launch

If the order is changed, the team will overbuild backend before testing whether prompt/UI/operations are enough.

## 4. What Must Be True At Beta Launch

- The product is no longer described internally as a generic OKR/task platform.
- The planning experience does not feel like a commodity task generator.
- Every beta-facing AI flow returns guidance, not just data.
- Consultants can run a consistent weekly cadence.
- A weekly evidence loop exists and is captured in-product or in a standardized operational layer.

## 5. Workstreams

### Workstream A: Product and Positioning Alignment

Goal:

Make all beta-facing strategy, product, and roadmap artifacts describe the same operating model.

Required outputs:

- updated product narrative
- updated roadmap summary
- aligned consultant onboarding narrative

### Workstream B: Prompt and Response System

Goal:

Use the existing prompt architecture as the primary mechanism for product differentiation.

Required outputs:

- canonical prompt usage across beta endpoints
- mandatory guidance blocks
- vertical-aware language for Legacy Succession and consultant-led operations

### Workstream C: Frontend Reframing

Goal:

Change what users perceive without changing the underlying storage model.

Required outputs:

- planning page wording shift
- objective page meaning shift
- team page beta conventions

### Workstream D: Minimal Backend Support

Goal:

Only add backend changes where the beta is blocked without them.

Required outputs:

- minimal consultant reporting improvements
- weekly evidence capture
- benchmark consistency cleanup

### Workstream E: Consultant Beta Operations

Goal:

Make beta execution repeatable across companies.

Required outputs:

- weekly operating cadence
- intervention logging method
- pilot checklist

## 6. What Will Not Be Built Before Beta

- new `Works` model
- new handoff engine service
- new microservice
- broad schema redesign
- autonomous behavior engine
- full consultant portal rewrite

## 7. Delivery Phases

### Phase 1: Reframe

Scope:

- docs alignment
- prompt consolidation decisions
- frontend wording map
- consultant beta workflow definition

Success condition:

- team can explain the beta in one consistent sentence

### Phase 2: Implement Minimal Product Changes

Scope:

- prompt template updates
- guidance coverage
- planning/objective UI reframing
- consultant reporting additions
- evidence capture additions

Success condition:

- internal dry run works end-to-end

### Phase 3: Run Beta

Scope:

- 2-3 companies
- one weekly operating rhythm
- evidence captured consistently

Success condition:

- enough comparable pilot evidence to decide what the first true behavior-engine features should be

## 8. Decision Rule For Any New Feature Request

Before adding backend or business logic, ask:

1. Can this be solved in prompts?
2. Can this be solved in frontend labels/copy?
3. Can this be solved through consultant workflow?
4. Is this blocked without persistence or query support?

Only if the first three answers are `no` should a backend change be approved.

