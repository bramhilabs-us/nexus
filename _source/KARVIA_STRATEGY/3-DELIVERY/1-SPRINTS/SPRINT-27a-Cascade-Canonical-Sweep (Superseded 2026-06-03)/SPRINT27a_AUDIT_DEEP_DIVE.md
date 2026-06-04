# Sprint 27-A — Deep Audit (Synthesis of 4 Parallel Inventories)

<!-- @GENOME T3-SPR-027a-AUDIT | DRAFT | 2026-06-02 | parent:T3-SPR-027a-MP | auto:- | linked:/audit,/coding -->

**Audit ID**: `A20260602-07`
**Audit session**: #281 (continuation — RT-TASK-MGMT-CASCADE-AUDIT Phase 1 reframed under user-locked canonical)
**Methodology**: 4 parallel Explore agents covered (1) Task lifecycle, (2) Move creation pipeline, (3) cascade hooks + LTS + crons, (4) FE consumers + label sweep. This doc condenses their findings into the canonical action surface for Sprint 27-A `/coding` execution.
**User lock (2026-06-02)**: canonical cascade is `Objective → KR → WeeklyGoal → Task` (Tasks shown as **"Chores"** in FE); Move = post-Beta future development.

---

## A. CRITICAL FINDINGS (action-required)

### A.1 — Move classifier creates parallel rows, doesn't replace
**File**: [server/services/MoveClassifierService.js](../../../../server/services/MoveClassifierService.js), [server/routes/planning.js:1081,1128,1600,1633](../../../../server/routes/planning.js#L1081)
**Finding**: `POST /api/planning/generate-weekly-plan` (and `/extend-weekly-plan`) does TWO things atomically: (1) `Task.insertMany(taskDocs)` for ALL generated tasks, (2) `Move.insertMany(moveDocs)` for those the classifier deems non-chores. Both rows persist. Dedup logic at [moves.js:218-222](../../../../server/routes/moves.js#L218) (`moveKeys.has(`${t.goal_id}::${t.name}`)`) then hides the matching Task from Chores so the Move card displays instead.
**Impact on user observation**: User sees "Moves" in the dashboard because the classifier marked them; the underlying Task DOES exist but is dedup-hidden. Reversing classifier creation alone is insufficient — existing Move rows must be soft-cancelled so dedup releases the matched Tasks.
**Sprint 27-A action**: feature-flag (`AUTO_MOVE_CLASSIFICATION_ENABLED=false`) + one-shot soft-cancel of existing `ai_generated=true` Moves + leave dedup logic intact (with the cancel-filter added so cancelled Moves don't hide Tasks).

### A.2 — `Task.post('save')` hardcoded to Goal parent
**File**: [server/models/Task.js:656-677](../../../../server/models/Task.js#L656)
**Finding**: Only knows `Goal.findById(doc.goal_id)`. Per Agent 1, **every Task creation site in current code (`tasks.js:121`, `planning.js:687`, `planning.js:1124`) validates against Goal collection only**. So today Tasks are never under canonical WeeklyGoals — they're under legacy Goals (where `time_period='WEEKLY'` is the de-facto weekly goal). The "silent failure" smoking gun from Phase 1 is **latent**, not active in current production: it would fire the moment a Task is created with `goal_id` pointing to a WeeklyGoal.
**Sprint 27-A action**: extend Task model (`weekly_goal_id` optional field, validate exactly one of `{goal_id, weekly_goal_id}` set), extend Task creation routes to accept WG parent, extend `Task.post('save')` to detect parent model and route to WG.updateTaskMetrics. Lands as additive, no destruction of legacy path.

### A.3 — `Task.insertMany` bypasses cascade middleware
**File**: [server/routes/planning.js:1124](../../../../server/routes/planning.js#L1124)
**Finding**: Bulk Task creation skips `pre('save')` + `post('save')` hooks. Today the route works around it by manually pre-computing `task_summary` at lines 1104-1110. If Sprint 27-A adds a WG-cascade hook, the bulk path silently skips it.
**Sprint 27-A action**: after every `Task.insertMany` add a one-shot `goal.updateTaskMetrics(...)` or `wg.updateTaskMetrics(...)` call (single recompute for the parent). Document the pattern in a code comment + add to the regression test.

### A.4 — Soft-delete bug in `Goal.updateTaskMetrics`
**File**: [server/models/Task.js:668](../../../../server/models/Task.js#L668), [server/models/Goal.js:434-456](../../../../server/models/Goal.js#L434)
**Finding**: Cancelled Tasks ARE counted in `total_tasks` but NOT in `completed_tasks` → artificially lowers `completion_rate`. Example: 10 Tasks, 5 completed + 5 cancelled → today reports 50%; should be 100%.
**Sprint 27-A action**: filter `status: { $ne: 'cancelled' }` in count queries on both Goal cascade AND new WG cascade. Update existing Goal tests that asserted the buggy behavior.

### A.5 — Dual-writer risk on `Objective.progress_percentage`
**File**: [server/models/Goal.js:575-601](../../../../server/models/Goal.js#L575) writes it; **Sprint 27-A must NOT add WG.post('save') that also writes it.**
**Finding**: Goal.post('save') is the only current writer. If WG.post adds a second writer, two cascades race on the same field. Agent 3's strong recommendation.
**Sprint 27-A action**: introduce a SEPARATE field `Objective.task_progress_pct` (WG-derived) and keep `progress_percentage` as KR-derived (today's intent). FE consumers pick which to render per surface (planning + dashboard read task_progress_pct; consultant My Clients reads kr_rollup which already does its own thing).

### A.6 — LTS Step C predicate gates on KR.current_value
**File**: [server/services/LifecycleTransitionService.js:1018-1043](../../../../server/services/LifecycleTransitionService.js#L1018)
**Finding**: `in_execution → completion_review` fires when **all KRs status='completed'**. KR.status auto-flips when `progress_percentage >= 100`, which requires `current_value >= target_value`. Since `current_value` is external-only (canonical OKR semantics, S27 D.3 lock), Tasks completing never moves Step C. The 7th cron pass (A20260602-01) fires the evaluator nightly but predicates still don't pass.
**Sprint 27-A action**: DO NOT add a parallel Step C' on WG completion. Preserve canonical OKR semantics. Consultant explicitly "marks KR achieved" when they've verified the external outcome metric. **OQ-4 resolution: keep predicate as-is**.

### A.7 — `client-workspace.js:636` hard-reads `Objective.kr_rollup`
**File**: [client/pages/scripts/client-workspace.js:636](../../../../client/pages/scripts/client-workspace.js#L636)
**Finding**: Destructures `{ total, on_track, at_risk, behind, avg_progress_pct }`. Backend source is [consultant.js:890-913](../../../../server/routes/consultant.js#L890) KR.aggregate. Today's My Clients tile + client-workspace Objectives tab both consume this shape.
**Sprint 27-A action**: extend consultant aggregation to include `task_progress_pct` (WG-task-derived). FE adds a new tertiary bar/badge or replaces `avg_progress_pct` (your call, lockable at FE workstream kickoff).

### A.8 — `planning-v2.js:566` dual-semantics
**File**: [client/pages/scripts/planning-v2.js:566](../../../../client/pages/scripts/planning-v2.js#L566)
**Finding**: Reads `goal.progress_percentage` where `goal` is in fact a **legacy weekly Goal (time_period='WEEKLY')**, not a canonical WeeklyGoal. The new WeeklyGoal `completion_rate` virtual is recurring-completion based (`completions[]`), semantically different from Task-count-based progress.
**Sprint 27-A action**: lock OQ-1 (`WeeklyGoal.frequency` dispatch): `frequency='once'` reads `task_metrics.completion_pct`; recurring frequencies read `completion_rate` virtual. Document in WG model + FE.

### A.9 — 200+ test fixtures hardcode `goal_id`
**File**: [tests/helpers/dbHelper.js:106](../../../../tests/helpers/dbHelper.js#L106), [tests/integration/routes/tasks.test.js](../../../../tests/integration/routes/tasks.test.js), [tests/security/multi-tenant-isolation.test.js:266](../../../../tests/security/multi-tenant-isolation.test.js#L266)
**Finding**: factory `createTestTask({goal_id})` everywhere. Sprint 27-A factory refactor needed: `createTestTask({parent: 'goal'|'weekly_goal', parent_id})`.
**Sprint 27-A action**: own this in test workstream, NOT polluting production code path workstreams.

### A.10 — Concurrent Task.save() race on Goal.updateTaskMetrics
**Finding**: Multiple Tasks under same Goal saving concurrently → `Goal.find()` + recompute fires N times, last-write-wins. Identical race for new WG cascade. Atomic `$inc` counters would fix but rework current pattern.
**Sprint 27-A action**: accept last-write-wins for Beta parity with Goal cascade; mint `RT-CASCADE-ATOMIC-COUNTERS` for post-Beta hardening.

---

## B. IMPORTANT FINDINGS (informational + scope-influencing)

### B.1 — Cron `Task.updateOne` bypasses cascade (intentional)
[server/jobs/dailyDigestJob.js:1034,1082](../../../../server/jobs/dailyDigestJob.js#L1034) — reminder bumps don't change progress; cascade bypass is correct. Document in code comment so future changes don't naively "fix" it.

### B.2 — `runWeeklyGoalStallReminders` already queries Tasks under WG
[server/jobs/dailyDigestJob.js:935-963](../../../../server/jobs/dailyDigestJob.js#L935). Agent 3 noted "no Task under it" check. **Verify**: is this an artifact of speculative future-proofing, or does it indirectly imply Tasks may already exist under WeeklyGoals via a path Agent 1 missed? Open question — read the predicate body in Sprint 27-A kickoff. Either way, the cron predicate must keep working post-sweep.

### B.3 — LTS predicate cron-only for Step C
[LifecycleTransitionService.js](../../../../server/services/LifecycleTransitionService.js). Cascade hooks (Task→Goal→Objective) ONLY recompute metrics — they don't fire `fireAfterWriteEvaluator`. Only route handlers + the daily cron fire it. By design per Agent 3. Sprint 27-A does NOT add LTS evaluator firing from cascade hooks.

### B.4 — `Objective.kr_rollup` is a populated/aggregated field, not persisted
Per Agent 4 + Agent 3: `kr_rollup` is computed in [consultant.js:890-913](../../../../server/routes/consultant.js#L890) on read for consultant scope. Not on the Objective model. Sprint 27-A extends this aggregation (single-site change, additive).

### B.5 — Move soft-cancel preserves completions[] history
[server/models/Move.js](../../../../server/models/Move.js) — `completions[]` array holds habit-tracking history. Sprint 27-A reversal soft-cancels (`status='cancelled'`) rather than deleting, preserving history if Move is re-enabled post-Beta.

### B.6 — Recurring Task scheme exists but no cron generates occurrences
[server/models/Task.js:271-287](../../../../server/models/Task.js#L271). Schema fields `recurring.enabled/frequency/next_occurrence/last_occurrence` defined but never invoked. **Sprint 27-A action**: leave field, add `// CLEANUP-TARGET: RT-RECURRING-TASKS-UNIMPLEMENTED` marker. Defer feature decision to post-Beta.

### B.7 — Reassignment mid-completion has no validation
[server/routes/tasks.js:247](../../../../server/routes/tasks.js#L247) PUT allows `assigned_to` change at any status. Sprint 27-A: leave for now; covered by RT-TASK-MGMT-CASCADE-AUDIT Phase 3 (reassignment matrix) later.

### B.8 — Goal.post('save') side-effect tree depth = 3
Task.save → Goal.save → Objective.save terminates (no Objective.post). Adding WG.post extends to depth 3 (WG.save → Objective.save). No infinite loop risk.

### B.9 — Tasks.js:56 `new Task(task)` is NOT a creation site
It wraps lean queries to expose virtuals on list response. Not dead code. No Sprint 27-A action needed.

### B.10 — All FE label-sweep candidates are JS string literals
11 strings across planning-v2.js + client-workspace.js + mailjetService.js. CSS class names and internal variable names should NOT change (no user impact).

---

## C. CASCADE INVARIANTS (locked, do not break in Sprint 27-A)

1. **Single writer per persisted field**: `Objective.progress_percentage` is Goal-cascade-derived. New `Objective.task_progress_pct` is WG-cascade-derived. No shared writers.
2. **KR.current_value is external-only**: never auto-bumped from work-units. Canonical OKR semantics (S27 D.3 lock).
3. **LTS Step C is cron+route-driven, not cascade-driven**: hooks recompute metrics, don't transition lifecycle.
4. **Cron idempotency**: `findOneAndUpdate({_id, lifecycle_stage: fromStage})` ensures earliest transition wins.
5. **Soft-delete transparency** (today): cancelled Tasks/Goals counted in totals. **Sprint 27-A revises this** for Tasks under both Goal AND WG paths to EXCLUDE cancelled — bug fix per A.4.
6. **Multi-tenant + RBAC isolation**: every new query filters `company_id`. New endpoints inherit existing `requireRole` middleware.
7. **Embedded `Objective.key_results[]` dual-write integrity**: Sprint 27-A does not touch this. New field is additive to Objective doc.
8. **Mongoose hook ordering**: pre → DB write → post. New WG.post inserts AFTER existing WG.pre, no reordering of Goal hooks.

---

## D. CROSS-REFERENCED ACTION MATRIX

| Workstream slice (Sprint 27-A) | Findings driving | Memory rules |
|---|---|---|
| **W1 — Task model extension** (`weekly_goal_id` field + validation) | A.2 | `feedback_extend_before_wrap`, `feedback_state_parsimony` (mutually-exclusive parents, no polymorphic ambiguity) |
| **W2 — Task creation routes** (accept WG parent) | A.2, A.3, A.9 | `feedback_minimal_change_grounding` (additive, no removal of Goal path) |
| **W3 — Task.post('save') WG branch** | A.2 | `feedback_extend_before_wrap`, `feedback_canonical_engine_grounding` |
| **W4 — WeeklyGoal model: `task_metrics` + `updateTaskMetrics()` + post('save')** | A.5, A.6, B.8 | `feedback_state_parsimony` (one new persistence, justified by 3+ consumer surfaces), `feedback_extend_before_wrap` |
| **W5 — Objective extension: `task_progress_pct` field** | A.5, A.7 | `feedback_state_parsimony` (justified by FE consumer reuse; alternative was 2-field drift) |
| **W6 — Consultant aggregation extension** ([consultant.js:890-913](../../../../server/routes/consultant.js#L890) include task_progress_pct in `kr_rollup`) | A.7 | `feedback_reuse_max` (single endpoint, single aggregation pipeline extension) |
| **W7 — Soft-delete bug fix** (filter cancelled in Goal + new WG cascades) | A.4 | bug-fix; back-compat-breaks existing tests, must update fixtures |
| **W8 — Move auto-classification kill-switch** (`AUTO_MOVE_CLASSIFICATION_ENABLED=false` + soft-cancel existing Moves) | A.1 | `feedback_no_destructive_without_greenlight` (user green-lit), `feedback_cleanup_boundary_pattern` (CLEANUP-TARGET markers) |
| **W9 — Move dedup adjustment** (`moves.js:218-222` ignore cancelled Moves) | A.1 | `feedback_minimal_change_grounding` (single conditional) |
| **W10 — FE label sweep** (11 string literals, JS only) | B.10, Agent 4 change-list | `feedback_minimal_change_grounding` |
| **W11 — FE consumer adjustment** (planning-v2 progress reads + client-workspace KR-rollup shape) | A.7, A.8 | `feedback_canonical_engine_grounding` (lock OQ-1 dispatch on WG.frequency) |
| **W12 — Test fixture refactor** (dual-parent factory) | A.9 | `feedback_test_fixture_validation` |
| **W13 — Documentation sweep** (CLAUDE.md + CASCADE_MIGRATION_STATE.md + weekly-goals.js code comments + Recurring marker + insertMany cascade comment) | B.6, A.3, I.* corner cases | `feedback_quote_the_canon` |
| **W14 — Regression test** (canonical 4-level Task→WG→Obj end-to-end + Goal back-compat + soft-delete edge + insertMany manual recompute) | A.2, A.3, A.4, A.10 | `feedback_canonical_engine_grounding` |

(Workstream-to-slice mapping locks in [SPRINT27a_MASTER_PLAN.md](SPRINT27a_MASTER_PLAN.md). Execution sequencing + blast radius in [SPRINT27a_IMPACT_ANALYSIS.md](SPRINT27a_IMPACT_ANALYSIS.md).)

---

## E. OPEN QUESTIONS FOR `/coding` KICKOFF

All 9 open questions carry forward from [SPRINT27a_CORNER_CASES.md §Open Questions](SPRINT27a_CORNER_CASES.md#open-questions-to-lock-at-coding-kickoff) verbatim. Summarized recommendations:

- **OQ-1** (WG completion_rate virtual vs new task_completion_pct): **bifurcate on `WG.frequency`** — `once` ⇒ task_metrics, recurring ⇒ virtual
- **OQ-2** (Objective.progress_percentage canonical source): **two-track field** — `progress_percentage` (KR-derived, unchanged) + new `task_progress_pct` (WG-derived). Don't touch existing field's semantics.
- **OQ-3** (Task model parent field): **separate `weekly_goal_id` field** + XOR validation. Polymorphic `goal_id` ref rejected per ambiguity.
- **OQ-4** (LTS Step C parallel predicate for WG-completion): **SKIP** — preserve canonical OKR semantics; consultant manually marks KR achieved.
- **OQ-5** (mixed Goal+WG cascade objectives in prod): **data probe at kickoff** — `db.objectives.aggregate([{ $lookup: 'goals' }, { $lookup: 'weeklygoals' }, { $match: <both non-empty> }])`. If found, document deterministic rule (recommend Goal-only or WG-only per objective).
- **OQ-6** (recurring Tasks scope): **defer + CLEANUP-TARGET marker**.
- **OQ-7** (atomic `$inc` vs full recompute): **full recompute for Beta** parity; mint `RT-CASCADE-ATOMIC-COUNTERS` post-Beta.
- **OQ-8** (Moves section dashboard treatment): **hide behind `MOVES_FEATURE_ENABLED=false`** env flag.
- **OQ-9** (Move dedup): **soft-cancel existing auto-Moves** + dedup logic adds `m.status !== 'cancelled'` filter.

---

## F. SCOPE BOUNDARY — WHAT SPRINT 27-A DOES NOT DO

Per `feedback_minimal_change_grounding`:

- ❌ NOT touching KR.current_value semantics (canonical OKR external-only, S27 D.3 lock).
- ❌ NOT migrating existing legacy Goal objectives to canonical 4-level (post-Beta).
- ❌ NOT removing Move model / routes / FE code — only disabling auto-classification + hiding section.
- ❌ NOT hardening cascade with atomic `$inc` counters (post-Beta RT minted).
- ❌ NOT touching reassignment matrix (RT Phase 3 owns this post-Beta).
- ❌ NOT touching FE CSS class names (`.task-row` etc. internal).
- ❌ NOT touching SQL/Mongo indexes (Mongoose model field additions only).
- ❌ NOT touching Mailjet sender names ("Karvia"/"Ysela") — out-of-scope for this canonical sweep (S28 owns).
- ❌ NOT implementing recurring Task occurrence cron (`CLEANUP-TARGET: RT-RECURRING-TASKS-UNIMPLEMENTED`).

---

## G. DEFERRED ITEMS → REFINEMENT BACKLOG (mint at Sprint 27-A close)

| Item | Trigger | Defer reason |
|---|---|---|
| `RT-CASCADE-ATOMIC-COUNTERS` | A.10 race | Hardening; Beta accepts last-write-wins parity |
| `RT-RECURRING-TASKS-UNIMPLEMENTED` | B.6 | Feature scoping decision needs PM input |
| `RT-MOVE-FEATURE-RE-ENABLE-RFC` | A.1 / OQ-8 | Future when Move re-enabled |
| `RT-TASK-MGMT-CASCADE-AUDIT Phase 2-4` (state-parsimony refactor, reassignment matrix, full regression suite) | Original Phase 1 RT | Sprint 27-A is the carve-out hot-fix slice; full audit deferred |
| Goal.progress / Objective.progress_percentage derive-vs-persist drops | Phase 1 state-parsimony verdicts | Destructive; defer per `feedback_no_destructive_without_greenlight` |

---

**Quality scorecard (audit-only, this session)**:

| Category | Score | Notes |
|---|---|---|
| Coverage breadth | 9/10 | 4 parallel inventories; ~9000 words of structured findings; 10 critical findings + 10 important findings catalogued |
| Coverage depth | 8/10 | Hook bodies + cascade chain + LTS predicates verified by file:line, not paraphrased |
| Correction discipline | 10/10 | Mid-session smoking-gun-reversal-then-re-reversal handled per `feedback_canonical_engine_grounding`; matrix doc updated inline, not silently rewritten |
| Cross-referencing | 9/10 | Every finding linked to workstream + memory rule + corner-case row |
| Recommendation crispness | 9/10 | 9 open questions each with concrete recommendation; ready for `/coding` kickoff lock |
| Test thinking | 8/10 | Test fixture refactor scoped + Goal back-compat test scoped; full regression deferred to Phase 4 |
| **Overall** | **9/10** | Audit deliverable shipped; Sprint 27-A workstreams crisp + ordered |
