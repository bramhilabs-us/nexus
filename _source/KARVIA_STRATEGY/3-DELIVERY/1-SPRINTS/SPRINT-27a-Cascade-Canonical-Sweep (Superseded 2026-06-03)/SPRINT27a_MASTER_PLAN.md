# Sprint 27-A — Cascade Canonical Sweep · Master Plan

<!-- @GENOME T3-SPR-027a-MP | ACTIVE | 2026-06-02 | parent:T3-SPR-027-MP | auto:/init,/strategy,/coding | linked:/audit -->

**Status**: 🟢 READY-TO-EXECUTE — audit complete (A20260602-07) · workstreams locked · open questions captured · sequencing pinned.
**Sprint Goal**: lock the canonical cascade `Objective → KR → WeeklyGoal → Task` (Tasks rendered as "Chores") end-to-end. Stop auto-classifying Tasks as Moves (Move = post-Beta future). Restore the user-visible signal that "I did the work" propagates from Dashboard → Planning → Objectives → Consultant My Clients.
**Sprint Window**: ~9-13h focused work (3 `/coding` sessions per session-bifurcation discipline). Calendar window ~3-4 days.
**Trigger**: user direction 2026-06-02 at `/audit` #281 (RT-TASK-MGMT-CASCADE-AUDIT Phase 1 + canonical-lock conversation).
**Parent sprint**: Sprint 27 (continues active at 17/23 firing 74%; E.1a-d + E.9 parked post-S28). Sprint 27-A is a carve-out from RT-TASK-MGMT-CASCADE-AUDIT for the Beta-criticality hot-fix slice.

---

## Why This Sprint Exists

User on karvia-business-1 (2026-06-02): *"currently as user all the tasks i am completing is not being reflected in the planning page, nor objective page nor the consultant's my client tab."*

Root cause locked via 4-agent parallel audit (A20260602-07):
1. Tasks `goal_id` only validates against legacy Goal collection; canonical WeeklyGoal parent is unreachable today.
2. Move auto-classification pipeline ([planning.js:1081,1128,1600,1633](../../../../server/routes/planning.js#L1081)) duplicates AI-generated Tasks into Move rows; the [moves.js:218-222](../../../../server/routes/moves.js#L218) dedup hides the Task → Move card displays instead. User completes the Move → no cascade fires (Move has no post-save hook).
3. Even if Tasks landed under WeeklyGoals, `Task.post('save')` only knows about Goal parent ([Task.js:656-677](../../../../server/models/Task.js#L656)) → silent no-op.
4. `Goal.updateTaskMetrics` includes cancelled Tasks in totals ([Goal.js:434-456](../../../../server/models/Goal.js#L434)) — soft-delete bug artificially depresses completion rate.

Sprint 27-A closes all four loops in a single canonical-lock sweep.

---

## Architectural Invariants (locked, do not break)

Carried from [SPRINT27a_AUDIT_DEEP_DIVE.md §C](SPRINT27a_AUDIT_DEEP_DIVE.md#c-cascade-invariants-locked-do-not-break-in-sprint-27-a):

1. Single writer per persisted progress field — `Objective.progress_percentage` stays KR-derived; new `Objective.task_progress_pct` is WG-derived. No shared writers.
2. `KR.current_value` is external-only (canonical OKR semantics, S27 D.3 lock).
3. LTS Step C predicate is cron + route-driven, not cascade-driven (preserve canonical OKR-completion semantics; consultant marks KR achieved).
4. Multi-tenant + RBAC isolation preserved on every new endpoint / hook / query.
5. Embedded `Objective.key_results[]` dual-write integrity unchanged.
6. Goal cascade path preserved (back-compat for legacy objectives).
7. Mongoose hook ordering: pre → DB write → post; new hooks added without reordering.
8. Soft-delete handling **revised**: cancelled Tasks now EXCLUDED from completion-rate counts on BOTH Goal AND new WG cascades (bug-fix, scope-creep-acceptable).

---

## Workstreams (14 slices, ordered by blast-radius — see Impact Analysis)

| ID | Workstream | Surface | Memory rules | Estimate |
|---|---|---|---|---|
| **W1** | Task model — add `weekly_goal_id` field + XOR validation | [Task.js](../../../../server/models/Task.js) | extend-before-wrap, state-parsimony | 30 min |
| **W2** | Task creation routes — accept WG parent (validation, payload) | [tasks.js:104-145](../../../../server/routes/tasks.js#L104), [planning.js:687](../../../../server/routes/planning.js#L687) | minimal-change-grounding | 1h |
| **W3** | `Task.post('save')` — detect parent model, route to correct `updateTaskMetrics` | [Task.js:656-677](../../../../server/models/Task.js#L656) | extend-before-wrap, canonical-engine-grounding | 1h |
| **W4** | WeeklyGoal model — add `task_metrics` sub-doc + `updateTaskMetrics()` + post('save') cascade (filter cancelled) | [WeeklyGoal.js](../../../../server/models/WeeklyGoal.js) | state-parsimony (justified: 3+ FE surfaces), extend-before-wrap | 1.5h |
| **W5** | Objective extension — new `task_progress_pct` field (WG-derived) | [Objective.js](../../../../server/models/Objective.js) | state-parsimony (justified single new field; alternative was 2-field drift) | 30 min |
| **W6** | Consultant aggregation extension — include `task_progress_pct` in `kr_rollup` | [consultant.js:890-913](../../../../server/routes/consultant.js#L890) | reuse-max (single aggregation pipeline) | 45 min |
| **W7** | Soft-delete bug-fix — exclude cancelled in Goal + new WG cascades + tests | [Task.js:668](../../../../server/models/Task.js#L668), [Goal.js:434-456](../../../../server/models/Goal.js#L434) | bug-fix (back-compat-breaking on assertions) | 45 min |
| **W8** | Move auto-classification kill-switch — `AUTO_MOVE_CLASSIFICATION_ENABLED=false` + soft-cancel script for `ai_generated=true` Moves | [planning.js:1081,1128,1600,1633](../../../../server/routes/planning.js#L1081), [MoveClassifierService.js](../../../../server/services/MoveClassifierService.js), new [scripts/cancel-auto-moves.js](../../../../scripts/cancel-auto-moves.js) | cleanup-boundary-pattern, no-destructive-without-greenlight (user already green-lit) | 1h |
| **W9** | Move dedup adjustment — filter cancelled Moves in [moves.js:218-222](../../../../server/routes/moves.js#L218) | minimal-change-grounding | 15 min |
| **W10** | `Task.insertMany` cascade hardening — manual `updateTaskMetrics` after bulk + comment marker | [planning.js:1124](../../../../server/routes/planning.js#L1124) | canonical-engine-grounding (don't silently bypass new hook) | 30 min |
| **W11** | FE label sweep — 11 JS string literals "Task" → "Chore" | planning-v2.js + client-workspace.js + mailjetService.js (per Agent 4 change-list) | minimal-change-grounding | 30 min |
| **W12** | FE consumer adjustment — planning-v2.js:566 dispatch on WG.frequency; client-workspace.js:636 expose `task_progress_pct` (additive read) | [planning-v2.js:566](../../../../client/pages/scripts/planning-v2.js#L566), [client-workspace.js:636](../../../../client/pages/scripts/client-workspace.js#L636) | canonical-engine-grounding | 1h |
| **W13** | Documentation sweep — CLAUDE.md §Data Model + CASCADE_MIGRATION_STATE + weekly-goals.js code comments + Recurring CLEANUP-TARGET marker + insertMany manual-recompute comment | [CLAUDE.md](../../../../CLAUDE.md), [CASCADE_MIGRATION_STATE.md](../../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md), [weekly-goals.js:173,244](../../../../server/routes/weekly-goals.js#L173), [Task.js:271-287](../../../../server/models/Task.js#L271) | quote-the-canon, cleanup-boundary-pattern | 45 min |
| **W14** | Test refactor + regression suite — dual-parent fixture factory + canonical end-to-end test + legacy back-compat + soft-delete edge | [tests/helpers/dbHelper.js](../../../../tests/helpers/dbHelper.js), new [scripts/test-sprint27a-cascade-canonical-sweep.js](../../../../scripts/test-sprint27a-cascade-canonical-sweep.js) | test-fixture-validation, canonical-engine-grounding | 2-3h |

**Total**: ~10-12.5h focused work. Splits naturally into 3 `/coding` sessions per [SPRINT27a_IMPACT_ANALYSIS.md §Execution Sequence](SPRINT27a_IMPACT_ANALYSIS.md#execution-sequence).

---

## Acceptance Test

Sprint 27-A closes when ALL of the following pass:

### Backend (covered by regression suite W14)

1. ✅ POST `/api/tasks` with `weekly_goal_id` (no `goal_id`) creates Task; back-compat with `goal_id` (no `weekly_goal_id`) still works; XOR validation rejects both-set / both-null.
2. ✅ Task under WeeklyGoal completes → `Task.post('save')` calls `WG.updateTaskMetrics` → WG.task_metrics fields update → WG.post('save') updates `Objective.task_progress_pct`.
3. ✅ Task under legacy Goal completes → still triggers `Goal.updateTaskMetrics` + `Objective.progress_percentage` chain (back-compat).
4. ✅ Cancelled Task is excluded from BOTH `total_tasks` and `completed_tasks` counts on Goal AND WG cascades.
5. ✅ `Task.insertMany` followed by manual `updateTaskMetrics` produces identical state to N single saves.
6. ✅ `Move.insertMany` calls in [planning.js:1128,1633](../../../../server/routes/planning.js#L1128) are gated by `AUTO_MOVE_CLASSIFICATION_ENABLED` — with flag false, zero Moves created.
7. ✅ Soft-cancel cleanup script flips existing `ai_generated=true` Moves to `status='cancelled'`; dedup at [moves.js:218](../../../../server/routes/moves.js#L218) ignores cancelled Moves → matching Tasks resurface as Chores.
8. ✅ Consultant aggregation response includes `task_progress_pct` in objectives' `kr_rollup`.
9. ✅ LTS Step C predicate still fires only on KR.status='completed' (no behavioral change).
10. ✅ All Sprint 27 prior regression suites (D 47/47, B.4b 39/39, B.4-receive 36/36, E.7 22/22) remain green.

### Manual smoke (post-deploy on karvia-business-1)

1. ✅ Generate a new weekly plan on a canonical objective → Tasks appear as Chores in dashboard-v2 (no Move cards).
2. ✅ Complete a Chore → planning-v2 weekly bar updates within page refresh.
3. ✅ Complete all Tasks under a WeeklyGoal → WG.task_metrics.completion_pct = 100 → Objective.task_progress_pct includes that WG's contribution.
4. ✅ Consultant My Clients tile reflects updated task_progress_pct after page refresh.
5. ✅ Existing legacy Goal objectives still display correct progress (back-compat).
6. ✅ Label sweep — all "Task" → "Chore" replacements visible in planning-v2 toasts, edit/delete tooltips, email subjects.

### Documentation

1. ✅ CLAUDE.md §Data Model Hierarchy reads as canonical (no "works against both legacy Goal and new WeeklyGoal _id" ambiguity).
2. ✅ CASCADE_MIGRATION_STATE.md affirms Sprint 27-A as the canonical-lock checkpoint.
3. ✅ [weekly-goals.js:173,244](../../../../server/routes/weekly-goals.js#L173) comments reverted to canonical.
4. ✅ [Task.js:271-287](../../../../server/models/Task.js#L271) recurring fields carry `// CLEANUP-TARGET: RT-RECURRING-TASKS-UNIMPLEMENTED` marker.
5. ✅ [planning.js:1124](../../../../server/routes/planning.js#L1124) carries `// CASCADE-BYPASS — manual updateTaskMetrics required post-insertMany` comment.

---

## Deferrals (carry to post-S27a refinement track)

| Item | Why deferred | Where logged |
|---|---|---|
| RT-CASCADE-ATOMIC-COUNTERS (race hardening) | Beta-acceptable last-write-wins parity with Goal cascade | mint at S27a close → REFINEMENT-BACKLOG |
| RT-RECURRING-TASKS-UNIMPLEMENTED | feature scoping decision; CLEANUP-TARGET marker landed in W13 | inline + REFINEMENT-BACKLOG |
| RT-MOVE-FEATURE-RE-ENABLE-RFC | Future when Move re-enabled | REFINEMENT-BACKLOG |
| RT-TASK-MGMT-CASCADE-AUDIT Phase 2-4 (state-parsimony refactor, reassignment matrix, full regression suite) | S27a is the carve-out hot-fix slice | existing RT entry in REFINEMENT-BACKLOG |
| Migration of legacy Goal-cascade objectives to canonical 4-level | back-compat sufficient for Beta | post-Beta + CASCADE_MIGRATION_STATE.md |
| Goal.progress / Objective.progress_percentage virtualization (DERIVE candidates from Phase 1) | destructive; requires user go-ahead + FE consumer audit | post-Beta RT |

---

## Open Questions (locked at `/coding` kickoff with audit recommendations)

See [SPRINT27a_AUDIT_DEEP_DIVE.md §E](SPRINT27a_AUDIT_DEEP_DIVE.md#e-open-questions-for-coding-kickoff) for full recommendations. Summary:

- **OQ-1**: WG completion_rate virtual vs new task_completion_pct → **bifurcate on `WG.frequency`** (once=task_metrics, recurring=virtual)
- **OQ-2**: Objective progress canonical source → **two-track** (`progress_percentage` unchanged + new `task_progress_pct`)
- **OQ-3**: Task parent field → **separate `weekly_goal_id` field + XOR validation**
- **OQ-4**: LTS Step C parallel for WG → **skip**, preserve canonical OKR semantics
- **OQ-5**: mixed Goal+WG cascade objectives → **data probe at kickoff** (Mongo query)
- **OQ-6**: recurring Tasks → **defer + CLEANUP-TARGET**
- **OQ-7**: atomic $inc counters → **defer to post-Beta RT**
- **OQ-8**: dashboard Moves section → **hide behind `MOVES_FEATURE_ENABLED=false`**
- **OQ-9**: Move dedup → **soft-cancel existing auto-Moves + dedup filters cancelled**

All recommendations stand pending `/coding` kickoff confirmation. User explicitly green-lit OQ-8/OQ-9 (auto-Move reversal) at audit session.

---

## Out-of-Scope (DO NOT TOUCH this sprint)

Per [SPRINT27a_AUDIT_DEEP_DIVE.md §F](SPRINT27a_AUDIT_DEEP_DIVE.md#f-scope-boundary--what-sprint-27-a-does-not-do):

- KR.current_value semantics
- Migration of legacy Goal objectives
- Move model / routes / FE deletion (only disable + hide)
- Atomic $inc counter rework
- Reassignment matrix (RT Phase 3)
- FE CSS class names (`.task-row` etc.)
- Mongo/SQL indexes
- Mailjet sender names (S28 owns)
- Recurring Task occurrence cron

---

## Beta Connection

Sprint 27-A closes Sprint 27's Workstream-D Open Question 4 (telemetry pipeline) **at the operational level** (verified static in S27 D.3; verified dynamic + end-to-end in S27a W14 regression). It is the **Beta hot-fix carve-out** identified in RT-TASK-MGMT-CASCADE-AUDIT Phase 1 ([REFINEMENT-BACKLOG/RT-TASK-MGMT-CASCADE-AUDIT_PHASE1_MATRIX.md §Beta Hot-Fix Slice](../REFINEMENT-BACKLOG/RT-TASK-MGMT-CASCADE-AUDIT_PHASE1_MATRIX.md#beta-hot-fix-slice-carve-out-recommendation)).

After S27a closes:
- Circular-economy adoption metric (`Σ tasks_completed ÷ Σ nudges_sent` per CLAUDE.md §Circular Economy) becomes visible at every touchpoint (Dashboard → Planning → Objectives → My Clients).
- S28 Ysela soft-launch can proceed knowing the "I did the work" loop is unbroken for new canonical objectives.
- RT-TASK-MGMT-CASCADE-AUDIT Phases 2-4 carry forward as post-Beta refinement (state-parsimony refactor, reassignment matrix, comprehensive regression).

---

## Sign-off

Sprint 27-A planned 2026-06-02 via `/audit` session #281 (continuation), driven by user direction *"create mini sprint plan as 27-a, first do a in-depth audit ... use that learning to create tasks in sprint 27-a, then do an impact analysis and execute everything in orderly fashion."*

**Next action**: user picks `/coding` cadence — three sessions per impact analysis OR one mega-session. Either way, kickoff opens by locking the 9 open questions above and minting per-slice audit IDs (A20260603-01, -02, ... as work lands).

**Audit ID**: A20260602-07 (this plan + audit deep-dive bundle) lives in [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) as 📝 PLAN.
