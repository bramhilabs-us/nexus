# Sprint 21 Master Plan: Beta Launch Ready

<!-- @GENOME T3-SPR-021 | ACTIVE | 2026-03-30 | parent:T1-PRD-002 | auto:/coding,/strategy | linked:/testing -->

**Sprint**: 21
**Dates**: March 30 - April 10, 2026 (12 days)
**Goal**: Pass all 4 gates and complete internal dry run so first pilot can start April 11
**Total Points**: 42
**Status**: IN PROGRESS

---

## Sprint Context

### What This Sprint Is

Sprint 21 is the final sprint before beta pilot launch. The goal is NOT to build a new product. The goal is to:

1. **Reframe** what we already have (prompts, frontend copy, docs)
2. **Align** the narrative across all beta-facing materials
3. **Enable** consultant operations with evidence capture
4. **Validate** with an internal dry run

### What This Sprint Is NOT

- Not building a new `Works` model
- Not creating new database schemas (P2 only if blocked)
- Not writing a new behavior engine
- Not rewriting the consultant portal

### Decision Rule

Before adding any backend change, ask:
1. Can this be solved in **prompts**? → If yes, do that.
2. Can this be solved in **frontend labels/copy**? → If yes, do that.
3. Can this be solved through **consultant workflow**? → If yes, do that.
4. Only if all three are `no` should backend work proceed.

---

## Sprint 21 One-Sentence Goal

> *"YSELA uses the current execution stack to guide handoffs, ownership, and next moves."*

All sprint work validates this sentence is true and visible.

---

## Gate Structure

This sprint must pass all 4 gates before pilot launch.

### Gate 1: Narrative Alignment

**Owner**: CPO
**Deadline**: Day 3 (April 1)

| Deliverable | Status |
|-------------|--------|
| Beta roadmap approved | [ ] |
| Product positioning aligned (no doc says "OKR/task platform") | [ ] |
| Consultant beta model agreed | [ ] |
| One-sentence description used everywhere | [ ] |

**Exit Criteria**: Team can explain beta in one consistent sentence.

---

### Gate 2: Prompt Coverage

**Owner**: CTO
**Deadline**: Day 7 (April 5)

| Deliverable | Status |
|-------------|--------|
| All beta-critical AI paths use `server/prompts/*` templates | [ ] |
| All beta-critical AI responses include `guidance` blocks | [ ] |
| Task-generation prompts produce "next moves" semantically | [ ] |
| Legacy Succession vertical context added | [ ] |
| Consultant-led context guidance added | [ ] |

**Exit Criteria**: Every AI response includes actionable guidance, not just data.

---

### Gate 3: Frontend Reframing

**Owner**: CTO
**Deadline**: Day 9 (April 7)

| Deliverable | Status |
|-------------|--------|
| Planning page: "Tasks" → "Next Moves" | [ ] |
| "Generate Tasks" → "Suggest Next Moves" | [ ] |
| Objective display shows human meaning | [ ] |
| Planning UI doesn't read like generic task software | [ ] |

**Exit Criteria**: A new user would not think this is a task manager.

---

### Gate 4: Beta Operations

**Owner**: CPO + CTO
**Deadline**: Day 10 (April 8)

| Deliverable | Owner | Status |
|-------------|-------|--------|
| Weekly review process defined | CPO | [ ] |
| Evidence capture path defined | CPO | [ ] |
| Weekly operating cadence documented | CPO | [ ] |
| Intervention logging method ready | CPO | [ ] |
| Pilot checklist complete | CPO | [ ] |
| Consultant reporting: blocked/deferred visibility | CTO | [ ] |
| Weekly evidence capture mechanism | CTO | [ ] |
| Benchmark duplication reduced | CTO | [ ] |

**Exit Criteria**: Consultant can run repeatable weekly cadence.

---

## Epic Breakdown

### Epic A: Docs & Narrative (5 pts) - P0

**Owner**: CPO
**Duration**: Days 1-3

| Story | Points | Description |
|-------|--------|-------------|
| A1: Roadmap Approval | 1 | Finalize and approve BETA_ROADMAP_2026.md |
| A2: Product Positioning Audit | 2 | Review all beta-facing docs, update positioning |
| A3: Consultant Narrative | 2 | Align consultant onboarding to 4-step model |

**Acceptance Criteria**:
- [ ] No beta-facing doc describes YSELA as primarily OKR/task tool
- [ ] All docs use Assess → Team → Objectives → Works model
- [ ] Consultant playbook references same model

---

### Epic B: Prompt System (13 pts) - P0

**Owner**: CTO
**Duration**: Days 2-7

| Story | Points | Description |
|-------|--------|-------------|
| B1: Prompt Template Consolidation | 3 | Move beta-critical prompts to `server/prompts/*` |
| B2: Guidance Block Standard | 3 | Define and implement mandatory `guidance` output |
| B3: Next Moves Semantics | 3 | Task-generation prompts output "next moves" language |
| B4: Legacy Succession Context | 2 | Add vertical-specific prompt context |
| B5: Consultant-Led Context | 2 | Add consultant workflow guidance to prompts |

**Acceptance Criteria**:
- [ ] All beta AI paths use canonical templates
- [ ] Every AI response includes `guidance` block
- [ ] Tasks presented as "Next Moves" with "why this matters"

**Key Files**:
- `server/prompts/*.js` - Canonical prompt templates
- `server/routes/planning.js` - Planning AI integration
- `server/routes/ai-okr.js` - OKR generation

---

### Epic C: Frontend Reframing (8 pts) - P0

**Owner**: CTO
**Duration**: Days 4-9

| Story | Points | Description |
|-------|--------|-------------|
| C1: Planning Page Copy | 3 | "Tasks" → "Next Moves" throughout |
| C2: Generate Action Rename | 2 | "Generate Tasks" → "Suggest Next Moves" |
| C3: Objective Display | 3 | Show human meaning in objective cards |

**Acceptance Criteria**:
- [ ] User never sees "tasks" label on planning page
- [ ] Objective cards show both business target and human meaning
- [ ] Planning page feels like behavior guidance, not task management

**Key Files**:
- `client/pages/planning.html`
- `client/pages/scripts/planning-v2.js`
- `client/pages/objectives.html`
- `client/pages/scripts/objectives.js`

---

### Epic D: Consultant Operations (8 pts) - P1

**Owner**: CPO
**Duration**: Days 5-10

| Story | Points | Description |
|-------|--------|-------------|
| D1: Weekly Cadence Document | 2 | Define Monday → Friday rhythm |
| D2: Evidence Capture Template | 2 | Weekly reflection and intervention log |
| D3: Intervention Logging Method | 2 | How consultants record observations |
| D4: Pilot Checklist | 2 | Pre-launch checklist for each company |

**Acceptance Criteria**:
- [ ] Consultant has clear weekly workflow
- [ ] Evidence capture is standardized (in-product or spreadsheet)
- [ ] First pilot company onboarding checklist ready

---

### Epic E: Evidence Capture - Backend (5 pts) - P1

**Owner**: CTO
**Duration**: Days 7-10

| Story | Points | Description |
|-------|--------|-------------|
| E1: Blocked/Deferred Visibility | 3 | Consultant reporting shows stuck work |
| E2: Evidence Capture Mechanism | 2 | Weekly evidence can be recorded |

**Acceptance Criteria**:
- [ ] Consultant can see which tasks are blocked/deferred
- [ ] Weekly evidence can be captured (in-product or via defined path)

**Key Files**:
- `server/routes/consultant.js`
- `client/pages/consultant-*.html`

---

### Epic F: Internal Dry Run (3 pts) - P1

**Owner**: Both
**Duration**: Days 11-12

| Story | Points | Description |
|-------|--------|-------------|
| F1: End-to-End Walkthrough | 2 | Complete 4-step flow with test company |
| F2: Gate Verification | 1 | Verify all 4 gates are passed |

**Acceptance Criteria**:
- [ ] Complete Assess → Team → Objectives → Works flow
- [ ] All gates verified and documented
- [ ] Ready for first pilot company

---

## Daily Execution Plan

| Day | Date | Focus | Gate Progress |
|-----|------|-------|---------------|
| 1 | Mar 30 | Sprint kickoff, Epic A start | - |
| 2 | Mar 31 | Epic A, Epic B start | - |
| 3 | Apr 1 | Epic A complete, Epic B continues | Gate 1 ✓ |
| 4 | Apr 2 | Epic B, Epic C start | - |
| 5 | Apr 3 | Epic B, Epic C, Epic D start | - |
| 6 | Apr 4 | Epic B, Epic C continues | - |
| 7 | Apr 5 | Epic B complete, Epic E start | Gate 2 ✓ |
| 8 | Apr 6 | Epic C, Epic D, Epic E | - |
| 9 | Apr 7 | Epic C complete, Epic D, Epic E | Gate 3 ✓ |
| 10 | Apr 8 | Epic D complete, Epic E complete | Gate 4 ✓ |
| 11 | Apr 9 | Epic F: Dry Run | - |
| 12 | Apr 10 | Epic F: Gate verification, Sprint close | All Gates ✓ |

---

## P2: Only If Blocked

These items are NOT planned for Sprint 21 but can be pulled in if absolutely necessary:

| Item | Trigger |
|------|---------|
| Objective beta metadata fields | Reporting is completely blocked |
| Team mentor/organizer metadata | Pod setup is completely blocked |
| Additional schema changes | Cannot solve via prompt/frontend |

**Rule**: If a P2 item is needed, document why P0/P1 approaches failed.

---

## Success Criteria

### Sprint 21 is successful if:

1. **Gate 1 Passed**: All beta-facing docs use one consistent model
2. **Gate 2 Passed**: All AI responses include guidance blocks
3. **Gate 3 Passed**: Frontend presents "Next Moves" not "Tasks"
4. **Gate 4 Passed**: Consultant can run weekly cadence
5. **Dry Run Complete**: One end-to-end flow validated
6. **First Pilot Ready**: Company identified and briefed

### Sprint 21 is NOT successful if:

- Product still feels like a task manager
- AI responses lack actionable guidance
- Consultant has no defined workflow
- No evidence capture path exists

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Prompt changes cause regressions | Medium | High | BST for critical paths |
| Frontend changes break existing flows | Medium | Medium | Feature flags, gradual rollout |
| Consultant workflow too manual | Low | Medium | Keep scope minimal, iterate in S22 |
| Dry run reveals missing pieces | Medium | Medium | Buffer day for fixes |

---

## Dependencies

| Dependency | Why It Matters | Owner |
|------------|----------------|-------|
| Prompt system is stable | Gate 2 foundation | CTO |
| Planning page preserved | Core execution substrate | CTO |
| Consultant reporting available | Gate 4 requirement | CTO |
| First pilot company identified | Dry run needs real context | CPO |

---

## Reference Documents

- [BETA_ROADMAP_2026.md](../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md) - Full roadmap
- [00_MASTER_IMPLEMENTATION_PLAN.md](../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md) - Implementation philosophy
- [05_DELIVERY_BACKLOG.md](../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/05_DELIVERY_BACKLOG.md) - Backlog details
- [04_GATES_DEPENDENCIES_AND_RISKS.md](../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/04_GATES_DEPENDENCIES_AND_RISKS.md) - Gate criteria
- [YSELA_PHILOSOPHY.md](../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/YSELA_PHILOSOPHY.md) - Product philosophy

---

**Sprint Owner**: Product + Engineering
**Created**: March 30, 2026
**Status**: IN PROGRESS
