# RT-TASK-MGMT-CASCADE-AUDIT — Phase 1 · Canonical Cascade Matrix

<!-- @GENOME T3-GOV-RT-TASK-MGMT-P1 | ACTIVE | 2026-06-02 | parent:T3-SPR-REFINEMENT | auto:- | linked:/audit,/strategy,/coding -->

**Audit ID**: `A20260602-06`
**Audit session**: #281 (2026-06-02 `/audit`)
**Scope**: Phase 1 of RT-TASK-MGMT-CASCADE-AUDIT (inventory + state-parsimony verdicts + weakest-link hot-fix candidate). Phases 2-4 deferred per refinement-track sequencing.
**RT entry**: [REFINEMENT-BACKLOG/README.md §RT-TASK-MGMT-CASCADE-AUDIT](README.md#rt-task-mgmt-cascade-audit--task--kr--objective-cascade-redesign--regression-suite)
**Methodology directive** (user, 2026-06-02, memory-aligned with `feedback_state_parsimony`): *"every time we think of adding a flag or field in the backend, we should estimate if that info would be required in any other place, or adding this will reduce the computing across any other places."*

> ## 🔄 2026-06-02 LATE-SESSION CORRECTION (user-locked canonical)
>
> Mid-session grounding pass surfaced conflicting code signals: [weekly-goals.js:173,244](../../../../server/routes/weekly-goals.js#L173) carry comments saying *"new WeeklyGoal uses Move, not Task"* and stub `tasks: []`. Those comments **contradict the user-locked canonical cascade** confirmed late-session:
>
> **Canonical**: `Objective → KR → WeeklyGoal → Task` (Tasks displayed as **"Chores"** in FE). **Move is future development** (post-Beta). This matches [CLAUDE.md §Data Model Hierarchy](../../../../CLAUDE.md) which already shows Move as `(FUTURE — behavior-based, AI-generated from Tasks; post-Beta)`.
>
> **The original Phase 1 smoking gun is correct** — `Task.post('save')` silently no-ops for Tasks whose `goal_id` is a WeeklyGoal `_id` because the hook only knows about legacy Goal. The "Move replaces Task in canonical" reading was code-drift, not canonical intent.
>
> **Code-drift items to clean-sweep** (carried to Sprint 27-A):
> 1. [weekly-goals.js:173,244](../../../../server/routes/weekly-goals.js#L173) — `tasks: []` stub + "uses Move not Task" comment contradict canon
> 2. [tasks.js:112](../../../../server/routes/tasks.js#L112) — Task creation validates `Goal.findOne` only; rejects WeeklyGoal parents (blocks the canonical leaf)
> 3. Auto-Move-creation pipeline (Bundle-Fix 3 grep target) — Moves became de facto leaf, eroding canonical
> 4. Task model `goal_id` ref says `'Goal'` (legacy) — needs canonical pattern (either polymorphic, or rename + dual ref, or fallback resolution at lookup)
> 5. FE label sweep needed: "Task" → "Chore" in user-facing surfaces
>
> **Sprint 27-A** ([SPRINT27a_MASTER_PLAN.md](../SPRINT-27a-Cascade-Canonical-Sweep/SPRINT27a_MASTER_PLAN.md) — minted same session) carries the full clean-sweep with deep-audit-driven workstreams. RT Phase 2-4 deferred to refinement-track post-S27a per user direction.
>
> **Re-read the rest of this matrix with the correction applied**: where Phase 1 says "Move is the canonical leaf in 4-level cascade" that's WRONG — Task is the leaf. Where Phase 1 says "Task.post('save') WeeklyGoal branch missing" that's STILL the right smoking gun. The state-parsimony verdicts on Goal.progress / Objective.progress_percentage remain valid.

---

## TL;DR — Beta Hot-Fix Smoking Gun

A canonical 4-level cascade Task (`Objective → KR → WeeklyGoal → Task`) completes → **NOTHING propagates upstream**. The cascade hook silently no-ops:

```js
// server/models/Task.js:656-677
taskSchema.post('save', async function(doc) {
  try {
    const Goal = mongoose.model('Goal');               // ← LEGACY model
    const goal = await Goal.findById(doc.goal_id);     // ← returns NULL when goal_id is a WeeklyGoal._id
    if (goal) { ...goal.updateTaskMetrics(...) }       // ← branch skipped, no fallback, no log
  } catch (error) { console.error(...) }               // ← never fires because no exception thrown
});
```

Per [CLAUDE.md §Data Model Hierarchy](../../../../CLAUDE.md): *"Task references `goal_id`; works against both legacy Goal and new WeeklyGoal `_id`."* The cascade hook was written pre-WeeklyGoal and never extended. WeeklyGoal model has **NO** `post('save')` hook to compensate ([WeeklyGoal.js:162-165](../../../../server/models/WeeklyGoal.js#L162) — only `updated_at` stamp).

**Net effect of bug**:
- Legacy objectives (Goal cascade): Task.completed → Goal.metrics → Objective.progress_percentage ✅ works
- Canonical objectives (WeeklyGoal cascade — every objective created since S27): Task.completed → **silently dies** ❌

**Symptom user observed** (verbatim 2026-06-02): *"currently as user all the tasks i am completing is not being reflected in the planning page, nor objective page nor the consultant's my client tab."* Matches exactly — fresh objectives go through canonical 4-level cascade.

**Beta hot-fix candidate** (~2-4h, Phase 1 carve-out): teach `Task.post('save')` to recognize WeeklyGoal `goal_id` and route the rollup through it. See §Beta Hot-Fix Slice below.

---

## Cascade Inventory — Entity Matrix

Legend:
- ✅ working today
- ❌ broken or missing
- ⚠️ works but redundant / drift-prone
- 📝 design question (state-parsimony candidate)

### Task — daily executable unit

| Column | Finding |
|---|---|
| **Source-of-truth fields** | `status` ([Task.js:93-98](../../../../server/models/Task.js#L93)), `progress` ([Task.js:100-105](../../../../server/models/Task.js#L100)), `completion_date` ([Task.js:76-78](../../../../server/models/Task.js#L76)) |
| **Persisted-derived** | none ✅ (clean — `reminders_sent`/`last_reminder_at` are cron state, not cascade-derived) |
| **Virtuals** | `is_overdue`, `days_remaining`, `subtasks_completion`, `checklist_completion`, `overall_completion` — all read-time |
| **Cascade hooks** | `post('save')` ([Task.js:656-677](../../../../server/models/Task.js#L656)) — **LEGACY-ONLY**: looks up `Goal.findById(goal_id)`, no WeeklyGoal fallback ❌ |
| **Route recompute sites** | `PUT /api/tasks/:id/status`, `/complete`, `/progress` ([tasks.js:355-531](../../../../server/routes/tasks.js#L355)) — all flow through `task.updateStatus()` → `task.save()` → triggers post-hook |
| **FE consumers** | `dashboard-v2.js`, `planning-v2.js` |

### Goal (legacy, time_period = QUARTERLY \| WEEKLY \| MONTHLY)

| Column | Finding |
|---|---|
| **Source-of-truth fields** | `status` ([Goal.js:146-151](../../../../server/models/Goal.js#L146)), `current_value` ([Goal.js:172-175](../../../../server/models/Goal.js#L172) — externally-measured, NOT auto-aggregated from Tasks) |
| **Persisted-derived** | `progress` (0-100, stored) ⚠️ — duplicates `metrics.completion_rate` (Goal.js:153-158 vs 204-225) · `metrics.{total_tasks, completed_tasks, blocked_tasks, completion_rate}` — written by `updateTaskMetrics()` ([Goal.js:434-457](../../../../server/models/Goal.js#L434)) |
| **Virtuals** | `health_status`, `completion_display`, `days_remaining`, `is_overdue` |
| **Cascade hooks** | `post('save')` ([Goal.js:575-601](../../../../server/models/Goal.js#L575)) — recomputes `Objective.metrics.total_goals/completed_goals`, **overwrites** `Objective.progress_percentage = avg(sibling Goal.progress)` ✅ working (but with weak atomicity — concurrent saves race) |
| **Route recompute sites** | `PUT /api/goals/:id/progress` ([goals.js:489-545](../../../../server/routes/goals.js#L489)), `PATCH /api/goals/quarterly/:id/progress` ([goals.js:1363-1401](../../../../server/routes/goals.js#L1363)) |
| **FE consumers** | `planning-v2.js`, `objectives.js` |

### WeeklyGoal (canonical, S27 — 4-level cascade)

| Column | Finding |
|---|---|
| **Source-of-truth fields** | `status`, `frequency`, `completions[]` ([WeeklyGoal.js:54-76](../../../../server/models/WeeklyGoal.js#L54)) |
| **Persisted-derived** | none |
| **Virtuals** | `completion_rate` ([WeeklyGoal.js:139-146](../../../../server/models/WeeklyGoal.js#L139)), `is_recurring` — read-time only |
| **Cascade hooks** | `pre('save')` only stamps `updated_at` ([WeeklyGoal.js:162-165](../../../../server/models/WeeklyGoal.js#L162)) ❌ **NO post-save**, no upstream propagation to KR/Objective |
| **Route recompute sites** | `POST /api/weekly-goals` fires `LifecycleTransitionService.fireAfterWriteEvaluator` for kr_breakdown→in_execution predicate ✅ (creation-time only, not status-update-time) |
| **FE consumers** | `planning-v2.js` (reads `completion_rate` virtual), `client-workspace.js` |

### KeyResult (canonical standalone + dual-write to embedded `Objective.key_results[]`)

| Column | Finding |
|---|---|
| **Source-of-truth fields** | `current_value` ([KeyResult.js:47-50](../../../../server/models/KeyResult.js#L47)) — **externally-measured by design (canonical OKR semantics, confirmed S27 D.3)**, never auto-aggregated from Task/Goal/WeeklyGoal · `target_value` · `baseline_value` · `status` ([KeyResult.js:70-74](../../../../server/models/KeyResult.js#L70)) |
| **Persisted-derived** | none — status auto-flips in `pre('save')` based on `progress_percentage >= 100` ([KeyResult.js:117-128](../../../../server/models/KeyResult.js#L117)) ✅ |
| **Virtuals** | `progress_percentage = (current_value - baseline) / (target - baseline) * 100` ([KeyResult.js:104-109](../../../../server/models/KeyResult.js#L104)) — canonical formula |
| **Cascade hooks** | `pre('save')` auto-flips status ✅. **NO `post('save')`** ❌ — standalone KR writes don't touch parent Objective.progress_percentage. Embedded `Objective.key_results[]` dual-write is route-level not hook-level — split-brain risk on consumer reads. |
| **Route recompute sites** | `PUT /api/key-results/:id` (writes `current_value` directly) · `GET /api/consultant/clients` runs `KeyResult.aggregate` ([consultant.js:890-913](../../../../server/routes/consultant.js#L890)) for My Clients tile rollup — reads standalone collection |
| **FE consumers** | `planning-v2.js`, `objective-calculator.js` `effectiveKRProgress(kr)`, `client-workspace.js`, `my-clients.js` |

### Objective

| Column | Finding |
|---|---|
| **Source-of-truth fields** | `status` ([Objective.js:117-121](../../../../server/models/Objective.js#L117)), `lifecycle_stage` ([Objective.js:135-140](../../../../server/models/Objective.js#L135)) — canonical 6-stage state machine (identified→kr_breakdown→in_execution→completion_review→completed→sustained_mode) |
| **Persisted-derived** | `progress_percentage` (stored) ⚠️ — only recomputed in `pre('save')` IF `isModified('key_results')` ([Objective.js:572-582](../../../../server/models/Objective.js#L572)); ALSO overwritten by Goal.post('save') hook · `metrics.{total_goals, completed_goals}` ⚠️ — written by Goal.post('save') |
| **Virtuals** | `key_results_completion`, `health_status`, `progress_indicator`, `sustained_eligible` ([Objective.js:450-498](../../../../server/models/Objective.js#L450)) — all read-time |
| **Cascade hooks** | `pre('save')` recomputes from embedded KRs (only on embedded modification) · NO `post('save')` for lifecycle transitions — fires via `LifecycleTransitionService.fireAfterWriteEvaluator()` from route handlers + nightly `dailyDigestJob.runOkrAggregationPass()` ✅ |
| **Route recompute sites** | `PUT /api/objectives/:id` ✅ · nightly cron `runOkrAggregationPass` (S27 Workstream C, A20260602-01) ✅ — Step C predicate flips in_execution→completion_review when all standalone KRs status='completed' |
| **FE consumers** | `objectives.js`, `client-workspace.js`, `my-clients.js`, `dashboard-v2.js` |

### Move (parallel surface to Task — behavior-classified)

| Column | Finding |
|---|---|
| **Source-of-truth fields** | `status`, `weekly_goal_id`, `completions[]` ([Move.js:24-91](../../../../server/models/Move.js#L24)) |
| **Persisted-derived** | none (`reminders_sent` is cron state) |
| **Virtuals** | `completion_rate`, `is_habit`, `streak` ([Move.js:129-151](../../../../server/models/Move.js#L129)) — read-time |
| **Cascade hooks** | `pre('save')` only sets defaults ❌ **NO post-save** — Move completion does NOT propagate to WeeklyGoal/KR/Objective |
| **Route recompute sites** | Move dashboard `GET /api/moves/dashboard-summary` — read-only aggregation |
| **FE consumers** | `dashboard-v2.js` (Moves section), planning surfaces |
| **Parsimony note** | Move is a **parallel persistence layer** alongside Task (same `(weekly_goal_id, title)` key dedup at [moves.js:218-222](../../../../server/routes/moves.js#L218)). HOTFIX notes already flagged this — sits naturally inside this RT's Phase 2 redesign. |

---

## Cascade Chain Diagram — Task `complete` → Consultant My Clients

**LEGACY 3-level cascade** (Objective → KR → Goal → Task; old objectives still in prod per CASCADE_MIGRATION_STATE.md):

```
[1] dashboard-v2 → PUT /api/tasks/:id/complete             ✅
[2] task.updateStatus('completed') → task.save()           ✅
[3] Task.post('save') → Goal.findById(goal_id)             ✅ (returns Goal — legacy path)
[4] goal.updateTaskMetrics() — Goal.progress + metrics ✅
[5] Goal.post('save') → Objective.metrics + Objective.progress_percentage ✅
[6] Objective.pre('save') — calculateProgress() ONLY if isModified('key_results') ⚠️
[7] Standalone KeyResult.current_value — NEVER updated   ❌ (external-only by design)
[8] consultant.js:890-913 KR.aggregate reads KR.current_value  → stale ❌
[9] client-workspace Objectives tab reads Objective.progress_percentage ✅ (Path A worked)
[10] My Clients tile (consultant aggregation) — stale because driven by KR.current_value ❌
```

**Result for legacy cascade**: client-workspace Objectives tab DOES refresh; My Clients consultant tile does NOT (driven by standalone KR aggregate which depends on `current_value`, never written by Task chain).

---

**CANONICAL 4-level cascade** (Objective → KR → WeeklyGoal → Task; every objective created since S27):

```
[1] dashboard-v2 → PUT /api/tasks/:id/complete             ✅
[2] task.updateStatus('completed') → task.save()           ✅
[3] Task.post('save') → Goal.findById(goal_id) → NULL      ❌ (WeeklyGoal._id, not Goal._id)
[4] if (goal) branch skipped — NO LOG, NO ERROR            ❌ SILENT FAILURE
[5] WeeklyGoal.post('save') — does not exist               ❌ NO HOOK
[6] No KR.current_value update                             ❌ (by design)
[7] No Objective.progress_percentage update                ❌
[8] Nightly cron runOkrAggregationPass STILL runs ✅       — but Step C predicate needs all KRs.status='completed' which never happens since KR.current_value never moves
[9] Planning page: shows pre-completion %                  ❌
[10] Objectives page: shows pre-completion %               ❌
[11] My Clients tile: shows pre-completion %               ❌
```

**Result for canonical cascade**: **complete silent break** — exactly what user observed.

---

## Weakest-Link Ranking (Beta-criticality)

### 🔴 #1 — Task.post('save') missing WeeklyGoal branch
**Surface**: [Task.js:656-677](../../../../server/models/Task.js#L656)
**Why this is rank 1**: it's the SINGLE branch whose absence breaks the entire canonical cascade. Every new objective hits this path. No other fix matters if this is broken.
**Fix shape** (Phase-2 to-be-locked; here for triage only):
```js
// pseudo
const isWeeklyGoal = await WeeklyGoal.exists({ _id: doc.goal_id });
if (isWeeklyGoal) {
  // recompute WeeklyGoal completion-from-Task-count
  // emit signal so KR.current_value can move (consultant decision)
  // OR fire LifecycleTransitionService evaluator on parent Objective
}
```
**Open design question**: should completing 100% of WeeklyGoal's Tasks bump KR.current_value automatically, OR should KR remain external-only and only emit a UI signal ("3/3 tasks done — set current_value when ready")? See OQ-1.

### 🟠 #2 — KeyResult.post('save') missing → Objective.progress_percentage stale on standalone KR write
**Surface**: [KeyResult.js:130](../../../../server/models/KeyResult.js#L130) (no post hooks defined)
**Why rank 2**: even if #1 is fixed and KR.current_value moves, parent `Objective.progress_percentage` isn't re-derived because `Objective.pre('save')` only re-runs `calculateProgress()` when the EMBEDDED `key_results[]` is modified — not when the standalone collection moves.
**Fix shape**: KR.post('save') → touch parent Objective (re-fetch standalone KRs, recompute `progress_percentage`, save).

### 🟡 #3 — Move.post('save') missing
**Surface**: [Move.js:172-180](../../../../server/models/Move.js#L172)
**Why rank 3**: Moves are post-Beta per CLAUDE.md cascade lock. But because Move is a parallel surface to Task (same `(weekly_goal_id, title)` dedup), completion of a Move that mirrors a Task creates a divergent state. Lower priority; rolls into Phase 2 redesign.

---

## State-Parsimony Verdicts (Phase 2 inputs)

Lead with the user's directive: *"every persisted value must justify (a) where else it gets consumed, AND (b) what compute it saves elsewhere."* Each row below is a Phase 2 candidate; **none should be deleted in Phase 1** per `feedback_no_destructive_without_greenlight`.

| Field | File:Line | Verdict | Justification | Phase 2 action |
|---|---|---|---|---|
| `Goal.progress` | [Goal.js:153-158](../../../../server/models/Goal.js#L153) | 📝 **DERIVE** | Duplicates `metrics.completion_rate`; both written by same `updateTaskMetrics()` | Make virtual; drop persisted field after FE audit confirms no `Goal.progress` direct reads bypass virtual |
| `Objective.progress_percentage` | [Objective.js:123-128](../../../../server/models/Objective.js#L123) | 📝 **DERIVE** | Written by both `pre('save')` (from embedded KRs) AND Goal.post('save') (avg of Goal.progress) — two writers, drift-prone. Read sites already have FE helper (`objective-calculator.effectiveKRProgress`). | Make virtual prefering standalone KR aggregation; drop after audit confirms no consumer needs persisted snapshot |
| `Objective.metrics.{total_goals, completed_goals}` | [Objective.js:341-348](../../../../server/models/Objective.js#L341) | 📝 **KEEP-FOR-NOW** | Hook-driven; reliable; saves N queries on read | Convert to virtual ONLY if Phase 2 finds high read frequency justifies caching elsewhere |
| `Task.reminders_sent`, `last_reminder_at`, `reminder_exhausted_at` | [Task.js:354-366](../../../../server/models/Task.js#L354) | ✅ **KEEP** | Cron idempotency — cannot derive (no reminder_log collection) | None |
| `WeeklyGoal.reminders_sent` family | [WeeklyGoal.js:112-124](../../../../server/models/WeeklyGoal.js#L112) | ✅ **KEEP** | Same — cron idempotency | None |
| `Objective.reminders_sent` family | [Objective.js:282-294](../../../../server/models/Objective.js#L282) | ✅ **KEEP** | Same | None |
| `Goal.metrics.{total_tasks, completed_tasks, blocked_tasks, completion_rate}` | [Goal.js:204-225](../../../../server/models/Goal.js#L204) | 📝 **DERIVE candidate** | Recomputed by `updateTaskMetrics()` from `Task.find({goal_id})` — could be virtual ($lookup or read-time aggregate) | Phase 2 decision; perf-vs-parsimony tradeoff |

---

## Beta Hot-Fix Slice (carve-out recommendation)

**Scope**: fix Weakest-Link #1 (`Task.post('save')` WeeklyGoal branch) ONLY. Ship as its own RT row: **`RT-TASK-COMPLETE-PROPAGATION-HOTFIX`**.

**Estimate**: ~2-4h (single hook extension + targeted regression test on 4-level cascade).

**Implementation shape** (locks at Phase 2 kickoff, sketched here for triage):
1. Extend `Task.post('save')` to detect `goal_id` model — try Goal.findById first, fallback to WeeklyGoal.findById.
2. For WeeklyGoal branch: count completed/total Tasks per `goal_id`, compute `completion_rate` (matches WeeklyGoal.virtual `completion_rate` but DIFFERENT — virtual reads `completions[]` array which is recurring-frequency-based; Task-derived completion_rate is one-shot). **Decision needed**: do we (a) extend WeeklyGoal with `task_metrics` sub-doc mirroring Goal's, or (b) fire `LifecycleTransitionService.fireAfterWriteEvaluator(objectiveId)` and let the existing Step C predicate handle Objective rollup? Option (b) is `feedback_extend_before_wrap` aligned — extend existing LTS rather than add new persistence.
3. Manual gate: complete a Task on karvia-business-1 dev → planning-v2 + objectives + client-workspace ALL refresh.
4. Regression: extend `scripts/test-sprint27-D-polish-and-telemetry-verification.js` (or new sibling) with a "canonical 4-level cascade" PART that asserts Task→WeeklyGoal→Objective lifecycle flip.

**Option (b) preferred per `feedback_state_parsimony`**: no new persistence; reuses LTS evaluator; Objective.lifecycle_stage flip drives the consultant signal (per the existing S27 Workstream C chain).

**Catch**: option (b) still leaves planning-v2 progress bars stale because they read `Goal.progress` / `WeeklyGoal.completion_rate` virtuals directly. For Beta we may also need the FE consumer audit (rank #2 design question — see OQ-3).

**User decision needed before hot-fix slice ships**: choose option (a) — add `WeeklyGoal.task_metrics` + post-save → KR.current_value bump — OR option (b) — pure LTS evaluator fire + FE consumers read fresh aggregates per page-load. **Recommend (b)** per state-parsimony, unless planning-v2 staleness during page-load is unacceptable.

---

## Open Questions (resolve at Phase 2 kickoff)

1. **OQ-1 — KR.current_value: external-only OR auto-bump from Task completion?**
   S27 D.3 verification locked "external-only — canonical OKR semantics." But the user-observed bug is that the consultant My Clients tile doesn't move when Tasks complete. **Resolution path**: keep `current_value` external by default, BUT emit a UI signal ("3/3 supporting tasks done — bump current_value when measured") + allow per-KR config flag `auto_increment_from_tasks: true` for KRs the consultant explicitly opts-in to (Phase 2 lock).

2. **OQ-2 — `Objective.progress_percentage` writer authority during dual-cascade transition**
   Currently TWO writers: Goal.post('save') (legacy) AND Objective.pre('save') from embedded KRs. Race condition if both fire from different code paths in the same request. **Resolution path**: pick one writer (recommend Objective.pre + extend to also read standalone KRs in same calc); make Goal.post merely fire LTS evaluator instead of writing the field.

3. **OQ-3 — FE consumer audit scope**
   Phase 2 needs grep over every `progress_pct|progress_percentage|completion_rate` read site in `client/` to verify consumers don't bypass the canonical virtuals/derivations. Phase 1 scope was BE-only.

4. **OQ-4 — Move persistence layer disposition** (carry-forward from HOTFIX_DASHBOARD_NOTES.md Bundle-Fix 3)
   Move is parallel-to-Task; user's mental model is "Chore = default, Move = opt-in classification." Bundle-Fix 3 deferred to Session B for user policy call. Phase 2 redesign should integrate: either drop Move table and add `Task.classification = 'move' | 'chore'` field, or keep Move as a curated opt-in surface with explicit classification UI. **Cross-link**: HOTFIX_DASHBOARD_NOTES.md Session B.

5. **OQ-5 — Reassignment matrix (Phase 3 input)**
   Phase 1 did not inventory `owner_id` cascade rules. Phase 3 will build 4×4 matrix (cascade level × actor role).

---

## Phase 2 Roadmap (locks at Phase 2 kickoff)

Order by blast radius (smallest → largest), per `feedback_minimal_change_grounding`:

1. **Phase 2a — Beta hot-fix slice** (~2-4h): Task.post('save') WeeklyGoal branch (option b above). Ship RT-TASK-COMPLETE-PROPAGATION-HOTFIX.
2. **Phase 2b — Objective.progress_percentage writer lock** (~3-4h): single writer; standalone KR aware.
3. **Phase 2c — Goal.progress → virtual migration** (~2-3h): FE audit + drop persisted field.
4. **Phase 2d — Move surface decision** (Bundle-Fix 3 in HOTFIX notes): user policy call + execute (~3-4h).
5. **Phase 2e — KR.current_value auto-bump opt-in flag** (per OQ-1 resolution): ~3-4h if approved.

Phase 3 (reassignment matrix) and Phase 4 (regression suite) run sequentially after Phase 2 lands.

---

## Cross-References

- **Memory rules invoked**: `feedback_state_parsimony` (central), `feedback_canonical_engine_grounding` (this whole phase IS the grounding pass), `feedback_reuse_max`, `feedback_extend_before_wrap` (Phase 2b/2c shape), `feedback_no_destructive_without_greenlight` (no field drops in Phase 1), `feedback_minimal_change_grounding` (hot-fix slice before full redesign).
- **CLAUDE.md sections**: §Data Model Hierarchy (4-level cascade lock 2026-05-27), §Circular Economy (`Σ tasks_completed ÷ Σ nudges_sent` is the canonical adoption metric — Weakest-Link #1 directly breaks the numerator's visibility).
- **Related audit IDs**:
  - `A20260520-05` ("prefer children-rolled-up progress") — earlier finding; this audit subsumes it via Phase 2b verdict.
  - `A20260602-01` — S27 Workstream C `runOkrAggregationPass` Step C predicate (consumes KR.status='completed' — currently never fires in canonical cascade per Weakest-Link #1 + OQ-1).
- **Sibling docs**:
  - [HOTFIX_DASHBOARD_NOTES.md](../../../../.claude/HOTFIX_DASHBOARD_NOTES.md) — Bundle-Fix 3 (Move auto-creation) cross-links to OQ-4.
  - [CASCADE_MIGRATION_STATE.md](../../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md) — dual-cascade context (legacy Goal vs canonical WeeklyGoal coexistence).
  - [SPRINT27_HANDOFF_DOCUMENT.md §Workstream D D.3](../SPRINT-27-First-Task/SPRINT27_HANDOFF_DOCUMENT.md) — earlier verification that "task→KR rollup is canonical-OKR-external-only" (locked in handoff but the bug is that the Task→WeeklyGoal→Objective.lifecycle path also silently fails, not just KR.current_value).

---

## Phase 1 Deliverable Sign-off

- [x] Cascade matrix complete (6 entities, 6 columns each)
- [x] Cascade chain diagram both legacy + canonical
- [x] Weakest-link ranking (3 candidates, Beta-criticality ordered)
- [x] State-parsimony verdicts (7 fields evaluated, 0 dropped, 4 DERIVE candidates, 3 KEEP)
- [x] Beta hot-fix slice scoped + RT name recommended (`RT-TASK-COMPLETE-PROPAGATION-HOTFIX`)
- [x] 5 open questions captured for Phase 2 kickoff
- [x] Phase 2 roadmap drafted (5 slices ordered by blast radius)

**Audit verdict**: 🔴 RED on the canonical 4-level cascade (Task completion silently no-ops upstream — every post-S27 objective affected). 🟡 AMBER on legacy 3-level cascade (works for client-workspace Objectives tab, fails for My Clients consultant tile because KR.current_value is external-only). 🟢 GREEN on the per-entity model fundamentals (clear source-of-truth fields, well-designed virtuals, hooks where they exist).

**Quality scorecard** — Security N/A (Phase 1 is design-only) · Architecture 6/10 (hook coverage gap, dual-writer pattern) · Code Quality 7/10 (clean models, but silent-failure pattern in Task.post('save')) · Documentation 8/10 (this doc + RT entry + CLAUDE.md cross-references) · Testing 5/10 (no end-to-end cascade test exists; Phase 4 deliverable) · **Overall 6.5/10** — single load-bearing fix (Weakest-Link #1) carved out as Beta hot-fix; full redesign deferred to refinement track per RT classification.
