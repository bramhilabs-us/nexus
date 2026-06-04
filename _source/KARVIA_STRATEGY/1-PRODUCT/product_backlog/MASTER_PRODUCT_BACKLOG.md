# Master Product Backlog

<!-- @GENOME T2-PRD-044 | ACTIVE | 2026-04-01 | parent:T1-PRD-001 | auto:/strategy | linked:/coding -->

**Purpose**: Single source of truth for all product features, enhancements, and technical debt.

**Last Updated**: April 1, 2026

---

## How This Backlog Works

```
┌─────────────────────────────────────────────────────────────────┐
│  IDEAS.md          │  This File           │  Sprint Plans       │
│  (Raw ideas)  ───► │  (Validated items)  ───►  (Assigned work)  │
│                    │                      │                     │
│  Status: NEW       │  Status: BACKLOG     │  Status: IN_SPRINT  │
│          RESEARCH  │          PLANNED     │          DONE       │
└─────────────────────────────────────────────────────────────────┘
```

**Adding Items**:
1. Raw ideas go to [IDEAS.md](./IDEAS.md) first
2. Validated ideas get promoted here with `BACKLOG` status
3. Sprint planning assigns items to sprints → `PLANNED`
4. Active sprint work → `IN_SPRINT`
5. Shipped → `DONE` (summarized in Delivered section)

---

## Priority Definitions

| Priority | Meaning | Timeline |
|----------|---------|----------|
| **P0** | Critical for current milestone | This sprint |
| **P1** | Important for product value | Next 1-2 sprints |
| **P2** | Valuable enhancement | Next quarter |
| **P3** | Future consideration | Roadmap |

---

## Current Milestone: Beta Launch (April 10, 2026)

**Focus**: YSELA Beta - Consultant-guided behavior operating system

**Active Sprint**: 21 (42 points) - Beta Launch Ready

**Key Constraint**: No new features. Reframe existing surfaces (Assess, Team, Objectives, Tasks).

---

## Backlog Items

### P0 - Beta Critical

| ID | Feature | Status | Sprint | Points | Notes |
|----|---------|--------|--------|--------|-------|
| FEAT-021 | Prompt System Overhaul | PLANNED | 21 | 13 | Epic B - YSELA voice in all prompts |
| FEAT-022 | Frontend Reframing | PLANNED | 21 | 8 | Epic C - Task→Work, terminology |
| FEAT-023 | Consultant Operations | PLANNED | 21 | 8 | Epic D - First client onboarding |
| FEAT-024 | Evidence Capture | PLANNED | 21 | 5 | Epic E - Beta feedback loops |
| FEAT-025 | Internal Dry Run | PLANNED | 21 | 3 | Epic F - Pre-launch validation |

---

### P1 - Post-Beta (Sprint 22-23)

| ID | Feature | Status | Points | Notes |
|----|---------|--------|--------|-------|
| FEAT-026 | Behavior Engine V1 | BACKLOG | 25 | GRIT loop implementation |
| FEAT-027 | Evidence Dashboard | BACKLOG | 15 | Aggregate beta learnings |
| FEAT-028 | Pilot Expansion | BACKLOG | 10 | 3-company scale |
| FEAT-029 | Assessment Enhancements | BACKLOG | 12 | Based on beta feedback |
| FEAT-030 | OKR Wizard Phase 2 | BACKLOG | 20 | Cascade mode, gap-filling |
| FEAT-043 | Date-Sync Across OKR Cascade | BACKLOG | 13-19 | See [Technical Debt → DEBT-006](#technical-debt). Surfaced 2026-05-01 during Sprint 23 #191h fixes. Objective → KR → Goal → Task/Move date-range enforcement is currently absent across the cascade. Includes Apr/May visual edge case in planning-v2 (#191h tail). |
| FEAT-044 | Objective Lifecycle Redesign | BACKLOG | 15-25 | See [Technical Debt → DEBT-007](#technical-debt). Surfaced 2026-05-01 during Sprint 23 #192-prep Q3b walkthrough. Today's `Objective.status` enum confusingly conflates lifecycle / health / operational state. The 6-stage lifecycle (`identified / kr_breakdown / in_execution / completion_review / completed / sustained_mode`) is rendered view-time in S23 #192 dashboard but needs formal schema field, wizard wiring, and stage-transition hooks. |
| FEAT-045 | Behavioral Telemetry — Postpone Tracking | BACKLOG | 5-8 | See [Technical Debt → DEBT-008](#technical-debt). Surfaced 2026-05-01 during Sprint 23 #192-prep Q4 walkthrough. Postpone modal already captures `postpone_reason` from user; Task schema silently drops it. Persistent counting + reason capture needed for iBrain Phase 1 behavioral telemetry. Independent of Sprint 23 #192 dashboard work (which does NOT depend on this data). |
| FEAT-046 | Behavioral Classification Research | BACKLOG | TBD | See [Technical Debt → DEBT-009](#technical-debt). Surfaced 2026-05-01 during Sprint 23 #192-prep Q6 walkthrough. v1 classifier (LLM picks behavior-vs-chore per Task) is a deliberately-naive starting point. The right classification rule is itself an unanswered question — research project to determine it from observed user data post-Beta. |

---

### P2 - H2 2026

| ID | Feature | Status | Points | Notes |
|----|---------|--------|--------|-------|
| FEAT-031 | Analytics Dashboard | BACKLOG | 30 | Company metrics, trends |
| FEAT-032 | Configuration Page | BACKLOG | 16 | Industry presets, SSI weights |
| FEAT-033 | Goal Templates Library | BACKLOG | 15 | Pre-built templates by industry |
| FEAT-034 | Collaboration Features | BACKLOG | 25 | Comments, @mentions, feeds |
| FEAT-035 | Import/Export | BACKLOG | 15 | CSV/Excel bulk data |
| FEAT-036 | Slack/Teams Integration | BACKLOG | 20 | Notification integrations |

---

### P3 - Future Roadmap

| ID | Feature | Status | Points | Notes |
|----|---------|--------|--------|-------|
| FEAT-037 | Mobile PWA | BACKLOG | 35 | Offline support |
| FEAT-038 | Custom Report Builder | BACKLOG | 25 | Build PDF reports |
| FEAT-039 | Public API & Webhooks | BACKLOG | 25 | External integrations |
| FEAT-040 | iBrain Integration | BACKLOG | TBD | ML/AI layer (future) |
| FEAT-041 | Multi-language Support | BACKLOG | 30 | i18n |
| FEAT-042 | White-label Branding | BACKLOG | 20 | Consultant customization |

---

## Technical Debt

| ID | Item | Priority | Status | Notes |
|----|------|----------|--------|-------|
| DEBT-001 | Test Coverage | P1 | BACKLOG | Currently ~30%, target 70% |
| DEBT-002 | API Documentation | P2 | BACKLOG | OpenAPI/Swagger specs |
| DEBT-003 | Performance Optimization | P2 | BACKLOG | Dashboard load times |
| DEBT-004 | Error Handling Standardization | P2 | BACKLOG | Consistent error responses |
| DEBT-005 | Logging Enhancement | P3 | BACKLOG | Structured logging, metrics |
| DEBT-006 | Date-Sync Across OKR Cascade | P1 | BACKLOG | See full audit + epic scope below. Filed 2026-05-01 during S23 #191h fixes. |
| DEBT-007 | Objective Lifecycle Redesign | P1 | BACKLOG | See full scope below. Filed 2026-05-01 during S23 #192-prep Q3b walkthrough. Six-stage lifecycle separate from health/operational-state axes. |
| DEBT-008 | Behavioral Telemetry — Postpone Tracking | P2 | BACKLOG | See full scope below. Filed 2026-05-01 during S23 #192-prep Q4 walkthrough. Pre-existing data-loss bug (postpone_reason silently dropped) + foundation for iBrain Phase 1 telemetry. |
| DEBT-009 | Behavioral Classification Research | P2 | BACKLOG | See full scope below. Filed 2026-05-01 during S23 #192-prep Q6 walkthrough. v1 classifier ships in #192b as a deliberately-naive single-function seam; this debt item is the research project to determine the right classification rule from real usage data. |

### DEBT-006 — Date-Sync Across OKR Cascade

**Filed**: 2026-05-01 during Sprint 23 #191h verification.
**Source incident**: planning-v2 displayed `start_date=2026-05-01` (Fri) plan as a split April/May group instead of pure May. After #191h made `goal.start_date` authoritative, the cross-month split is technically correct ISO 8601 but surprising to users. Investigating that revealed broader cascade-wide gaps.

**Current-state inventory** (cross-cutting):

| Layer | Date fields | Effective window today |
|---|---|---|
| Objective | `start_date`, `end_date`, `target_year`, `time_period_type ∈ {calendar_year, fiscal_year, custom}` | ✅ explicit |
| KR (embedded) | `quarter ∈ {1..4}` only | ⚠️ implicit — never validated |
| KR (standalone, post-#190 wizard) | `year`, `quarters[]` only | ⚠️ same — implicit |
| Quarterly Goal (legacy) | `start_date`, `due_date`, `quarter`, `year` | ❌ no parent-range check |
| Weekly Goal (legacy) | `start_date`, `due_date`, `quarter`, `year`, `week ∈ [1,13]` | ❌ no parent-range check; `/extend` partially checks vs Objective; the `week ≤ 13` cap **silently rejects multi-quarter plans** |
| Weekly Goal (new `WeeklyGoal`) | `target_year`, `target_week`, `frequency` | ❌ no parent-range check |
| Task | `start_date`, `due_date` | ❌ no parent-Goal-range check |
| Move (S22a Phase 2.4) | TBD — needs schema audit | TBD |

**Two-clocks problem**: after #191h we trust `goal.start_date` and treat the legacy `(quarter, week-of-quarter)` tuple as decorative. They're still both written today. Until we formally deprecate the legacy tuple, ambiguity remains.

**Suggested workstream shape** (~13-19 points; size for half-sprint focus epic in S24/S25):

| Epic | What | Estimate |
|---|---|---|
| **D. Auto-snap UX** | Planning modal `start_date` input auto-snaps to next Monday on/after the user's pick. Solves the visible Apr/May edge case. **Run first — fastest user-visible payoff.** | 1 pt |
| **A. Schema canonicalization** | Add `effective_start_date` / `effective_end_date` virtuals on KeyResult derived from parent Objective + `quarter`. Mark legacy `(quarter, week-of-quarter)` writes as deprecated; reads keep working via #191h. | 3-5 pts |
| **B. Range validators** | Shared `ValidationService.validateChildInParentRange(child, parent)` wired into pre-save hooks for Goal, Task, Move. Emits a structured `OutOfRangeError` so routes return clean 400s. | 4-6 pts |
| **C. Frontend cascade** | Every date picker (`objective-wizard.html`, `planning-v2.html`, task date picker, move scheduler) reads parent's effective window, clamps the input, shows "must be between X and Y" inline. | 5-7 pts |

**Recommended order**: D → A → B → C.

**Open questions to resolve before scoping**:
1. Move schema — is there a `Move` model file? S22a Phase 2.4 LLMPolicy reference suggests one exists; need to fill in the Move row.
2. Add real `start_date`/`end_date` to KeyResult (schema migration) vs. virtuals (non-breaking)? Lean virtuals for S24/S25.
3. Sprint placement — S24 dedicated epic or S25?

**Related fixes already shipped in S23** (don't re-do these):
- `#191c` — embedded-KR fallback for `/api/weekly-goals/:krId`.
- `#191d` — `legacyWeekToISO` returns ISO year (year of Thursday).
- `#191e` — `/api/planning/extend` wired with smart prefill + range validation.
- `#191f` — robust response handling (no more "JSON.parse: unexpected character").
- `#191g` — bulk-insert weekly plan generation (30-45s → <3s).
- `#191h` — `goal.start_date` is authoritative; Thursday-anchored month grouping.

### DEBT-007 — Objective Lifecycle Redesign

**Filed**: 2026-05-01 during S23 #192-prep Q3b walkthrough (refined Epic G doc).
**Source incident**: Q3 walkthrough surfaced that today's `Objective.status` enum (`['draft', 'active', 'completed', 'paused', 'cancelled', 'at_risk']`) confusingly conflates three independent axes:

| Axis | Question it answers | Today |
|---|---|---|
| Lifecycle | "Where in the journey is this Objective?" | ❌ NOT cleanly modeled |
| Health | "Is this Objective on track?" | ✅ `on_track / at_risk / behind` (separate field) |
| Operational state | "Active or paused?" | ⚠️ overloaded into `status` |

User declared the lifecycle axis must exist as its own concept.

**Six-stage lifecycle (locked 2026-05-01 in [EPIC_G_DASHBOARD_UI_REFINED.md §11 Q3b](../../3-DELIVERY/1-SPRINTS/SPRINT-23/epics/EPIC_G_DASHBOARD_UI_REFINED.md))**:

| Stage | Meaning |
|---|---|
| `identified` | Stakeholder declared the Objective. No KRs yet. |
| `kr_breakdown` | KRs being defined; plan being built. |
| `in_execution` | Plan executing; Moves happening daily. |
| `completion_review` | KRs hit; verifying actual outcome. |
| `completed` | Fully signed off as achieved. |
| `sustained_mode` | Behaviors that produced the outcome are now habits being maintained — Objective has crossed from "delivered by the consultant" to "part of the company culture." |

**Sprint 23 #192 ships only the view-time derivation** of these stages via `MoveDashboardService.deriveObjectiveLifecycle()` — no schema change. DEBT-007 is the formal redesign that follows.

**Suggested workstream shape** (~15-25 points, post-Beta):

| Epic | What | Estimate |
|---|---|---|
| **A. Schema split** | Separate `Objective.lifecycle_stage` (enum, the 6 stages) from `Objective.status` (operational only) from `Objective.health_status` (health axis, already separate). Migration script for existing Objectives. | 4-6 pts |
| **B. Wizard + planning integration** | objective-wizard transitions Objective from `identified` → `kr_breakdown` on KR definition. Planning page transitions to `in_execution` on first plan creation. Completion-review and sustained-mode require explicit user actions or KR-completion triggers. | 5-8 pts |
| **C. Stage-transition hooks** | New S22a-style hooks: `onObjectiveHandedOff`, `onObjectiveEnteredExecution`, `onObjectiveCompleted`, `onObjectiveEnteredSustainedMode`. Each fires guidance/coaching prompts. | 3-5 pts |
| **D. Real `sustained_mode` triggers** | Replace v1's crude proxy (`status='completed' AND end_date < today by ≥ 90 days`) with real signals: KR maintenance targets, outcome metrics confirming no regression, behavior-habituation signals from telemetry. Depends on DEBT-008 partial. **Open question (deferred from S23 #192-prep Q5.3, 2026-05-01):** does this work require time-based KR/Objective progress snapshots (e.g. capturing `current_value` on quarter boundaries) for regression detection? If yes, prerequisite snapshot-system work needs scoping at the start of this epic. | 3-6 pts |

**Recommended order**: A → B → C → D.

**`sustained_mode` semantics (locked 2026-05-01)**: reading (b) — "Behaviors that produced the outcome are now habits being maintained." This is the BBB hypothesis taken to its conclusion: behaviors compound into habits, habits sustain outcomes, outcome ownership transfers from delivery agent (consultant) to the receiving organism (company culture).

### DEBT-008 — Behavioral Telemetry: Postpone Tracking

**Filed**: 2026-05-01 during S23 #192-prep Q4 walkthrough (refined Epic G doc).
**Severity**: Bug + future feature. Independent of #192.

**Pre-existing data-loss bug (Bug)**: The Task model's postpone modal (rendered from `client/pages/scripts/dashboard-v2.js:813` and via `goalsAPI.postponeTask` at `client/js/goals-api-client.js:584`) sends a `postpone_reason` string to `PUT /api/tasks/:id`. The Task schema does NOT define a `postpone_reason` field, so Mongoose silently drops the value. Users have been typing reasons for postponements that vanish into the void. Move model has no postpone path at all today.

**Future telemetry foundation (Feature)**: To support iBrain Phase 1 behavioral telemetry (per `iBRAIN_Integration/INTEGRATION_OVERVIEW.md` Q2 2026), the system needs to capture:
- Number of times a Move/Task was postponed (`postpone_count`).
- Postpone history with timestamps + reasons (`postpone_history[]`).
- Per-postpone deltas (previous_due_date → new_due_date).

This data feeds iBrain's pattern detection ("user X consistently postpones Action moves") and informs nudge generation.

**S23 #192 dashboard does NOT depend on this data.** The `pushed` catch-up tile uses a simpler derivation (`isToday(due_date) AND isToday(updated_at) AND NOT isToday(created_at)`) per Q4 resolution. DEBT-008 is independent work.

**Suggested workstream shape** (~5-8 points, post-Beta):

| Step | Pts |
|---|---|
| Add `Task.postpone_count: Number (default 0)` and `Task.postpone_history: [{ timestamp, reason, previous_due_date }]` (both optional, no migration needed for existing rows) | 1 |
| `PUT /api/tasks/:id` route: when `due_date` changes AND `postpone_reason` is in body, increment `postpone_count` and push history entry | 1 |
| Mirror to Move model with same field shape | 1 |
| Update `MoveDashboardService.bucketizeMove` to prefer real `postpone_count > 0` signal once data exists; fall back to v1 derivation otherwise | 1 |
| iBrain telemetry emission (`move.postponed`, `task.postponed`) — only after iBrain Phase 1 ingestion endpoint is live | 2 |
| Test coverage | 1-2 |

**Sprint placement**: P2 (post-Beta, post-iBrain Phase 1). The bug-fix portion (persisting `postpone_reason`) is small and can land independently if needed; the telemetry portion depends on iBrain.

### DEBT-009 — Behavioral Classification Research

**Filed**: 2026-05-01 during S23 #192-prep Q6 walkthrough.
**Severity**: Research project — not a bug; determines whether the v1 classifier should be replaced and with what.

**Background**: Sprint 23 #192b ships a deliberately-naive Task → Move classifier:

> `MoveClassifierService.classifyTaskFromAIResponse(taskResponse)` — single function, called inside `/api/planning/generate-weekly-plan`'s per-KR LLM step. The LLM is asked to tag each generated Task with `move_type`, `frequency`, `discipline` OR null (= chore). Function returns `(Move doc | null)`.

This is one possible approach. We don't yet know if it's the right one. User direction in Q6 walkthrough: *"We don't know the answer — that's why we need to make this modular and then figure out actually how do we do this classification. Is there a right way to classify?"*

**The unknowns:**

| Question | Why it matters |
|---|---|
| Should EVERY Task become a Move (no chores)? | Simpler mental model; potentially flatter cognitive load on user. |
| Should the LLM be the classifier, or rule-based? | LLM has rich context but introduces variability. Rules are deterministic but coarse. |
| Should classification confidence be exposed to consultants? | If LLM is uncertain, a "review and confirm" UX may be needed. |
| Is `move_type` the right axis? | The action / reaction / habit split came from S22 Move model design; might need refinement. |
| Should the chores list ever be empty? | If yes, classification rule changes; if no, every plan should produce some chores. |
| Should classification be re-runnable on existing Tasks? | Affects whether DEBT-009 needs to add a re-classification endpoint. |

**Research approach** (post-Beta, after observing #192b in production for 2-4 weeks):
- Collect data on: how often LLM returns null/chore; how often consultants override classifications (if/when override UI exists); user click-through on "Behavior" group switch vs "All" / "Objective"; time spent per causal-chain card.
- Compare classification distributions across tenants to see whether the LLM is consistently identifying behaviors or producing noise.
- Decide whether v2 needs: a different classification mechanism, a confirmation UX, schema changes to Move, or all three.

**Sprint placement**: P2, post-Beta. Sequencing depends on what real usage data reveals.

---

## Delivered (Summary by Quarter)

### Q1 2026 (Sprints 13-20.5) - 350+ points

**Key Deliverables**:
- Unified LLM Context Service (AIContextService)
- SSI Report Redesign with PDF export
- Objectives Page S13 pattern
- Design System Finalization (Navy/Gold)
- Assessment Hub and Question Library
- Dashboard V2 and Planning V2
- Documentation Governance System
- Beta Roadmap and Strategy

### Q4 2025 (Sprints 1-12) - 600+ points

**Key Deliverables**:
- Core authentication and multi-tenancy
- Assessment engine and SSI scoring
- OKR generation with AI
- Team management
- Goal hierarchy (Objective → KR → Goal → Task)
- Planning workflows
- Employee/Manager/Executive dashboards

**Total Delivered**: ~950+ story points

---

## Metrics

| Metric | Value |
|--------|-------|
| Total Backlog Items | 22 features + 5 debt items |
| P0 (Beta Critical) | 5 items, 37 points |
| P1 (Post-Beta) | 5 items, 82 points |
| P2 (H2 2026) | 6 items, 121 points |
| P3 (Future) | 6 items, 135+ points |
| **Total Backlog Points** | **~375+ points** |

---

## Quick Add Feature

```markdown
| FEAT-XXX | [Feature Name] | BACKLOG | [Points] | [Notes] |
```

**Then update**:
1. Add to appropriate priority section
2. Increment metrics count
3. Update "Last Updated" date

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [IDEAS.md](./IDEAS.md) | Raw ideas and research |
| [BETA_ROADMAP_2026.md](../roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md) | Current milestone strategy |
| [Sprint 21 Plan](../../3-DELIVERY/1-SPRINTS/SPRINT-21%20(In%20Progress)/SPRINT-21-MASTER-PLAN.md) | Active sprint details |
| [6-ISSUES/ACTIVE.md](../../3-DELIVERY/6-ISSUES/ACTIVE.md) | Bug tracking |

---

## Maintenance

**After each sprint**:
1. Move completed items to "Delivered" section (quarterly summary)
2. Re-prioritize backlog based on learnings
3. Update metrics

**Quarterly**:
1. Archive detailed delivery notes
2. Review P3 items for relevance
3. Sync with product roadmap
