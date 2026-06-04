# Sprint 27-A — Corner-Case Inventory

<!-- @GENOME T3-SPR-027a-CC | DRAFT | 2026-06-02 | parent:T3-SPR-027a-MP | auto:- | linked:/audit,/coding,/strategy -->

**Purpose**: exhaustive corner-case catalog for the canonical cascade clean-sweep so no edge slips through implementation. Read alongside [SPRINT27a_AUDIT_DEEP_DIVE.md](SPRINT27a_AUDIT_DEEP_DIVE.md) (route + hook inventory) and [SPRINT27a_IMPACT_ANALYSIS.md](SPRINT27a_IMPACT_ANALYSIS.md) (blast-radius scoring).

**Status legend**: 🔴 must-handle / 🟠 design-decision-needed / 🟡 known + acceptable / 🟢 already-handled

---

## A. Migration / dual-cascade state

| # | Case | Status | Notes |
|---|---|---|---|
| A.1 | Existing objectives w/ legacy Goal cascade — must continue to work after sweep | 🔴 | Back-compat constraint. Sprint 27-A workstreams must preserve Goal→Objective.metrics path. Existing tests are the safety net. |
| A.2 | Existing objectives w/ canonical 4-level (KR→WG→Task) currently broken — must work after sweep | 🔴 | Primary goal. WG→Objective derivation must land. |
| A.3 | Mixed cascade: objective with BOTH Goal children AND WeeklyGoal children (transitional drift) | 🟠 | Possible? Need data probe. If yes, `Objective.progress_percentage` averaging needs source-of-truth rule (Goal-only? WG-only? Both, weighted?). Recommend Phase-1 grep on prod for existence; if found, document deterministic rule. |
| A.4 | Cascade migration plan — retire legacy Goal collection or coexist forever? | 🟠 | Defer to post-Beta per CASCADE_MIGRATION_STATE.md. Sprint 27-A doesn't migrate; it canonicalizes the WG path. |
| A.5 | Embedded `Objective.key_results[]` dual-write (S25 PX-3.6) sync risk | 🟠 | Any sweep change that touches Objective.calculateProgress() must preserve dual-write integrity. Decide: does WG-derived progress feed embedded KRs too, or only standalone? |

---

## B. Task lifecycle edge cases

| # | Case | Status | Notes |
|---|---|---|---|
| B.1 | Task whose parent WG is deleted (orphan) | 🟠 | No defensive code per Agent 1 audit. Decide: cascade-delete Tasks on WG delete, OR set Task.weekly_goal_id=null + cancel Task, OR leave orphan. |
| B.2 | Task whose parent Goal is deleted (orphan, legacy) | 🟡 | Same pattern as B.1; pre-existing behavior. Sprint 27-A inherits the pre-existing posture; revisit post-Beta. |
| B.3 | Task soft-deleted (status='cancelled') included in total counts | 🔴 | **Sprint 27-A bug-fix target**: Goal.updateTaskMetrics currently includes cancelled → artificially lowers completion_rate. New WG.updateTaskMetrics must exclude cancelled. Bonus: fix Goal too. |
| B.4 | Task reassigned mid-flight (assigned_to change) | 🟡 | No cascade impact on progress. Email fires per existing dispatcher. Keep current behavior. |
| B.5 | Task with progress<100 but status='completed' (legacy edge case) | 🟡 | Existing acceptance; both fields exist; canonical "task complete" = `status==='completed'`. |
| B.6 | Task with progress=100 but status='in_progress' (auto-flip) | 🟢 | Handled by `Task.updateProgress` instance method. |
| B.7 | Recurring tasks (`recurring.enabled=true`) — separate lifecycle? | 🟠 | Schema exists at Task.js:271-287, no cron generates occurrences (Agent 1 finding). Decide: deprecate field, OR implement, OR scope out. Recommend **defer to post-Beta** + mark schema with `// CLEANUP-TARGET: RT-RECURRING-TASKS-UNIMPLEMENTED`. |
| B.8 | Bulk Task creation under same WG — N consecutive post-save hooks (perf) | 🟠 | N save() calls fire N WG.updateTaskMetrics recomputes. Mitigation: use `Task.insertMany` (bypasses hooks; manual one-shot WG.updateTaskMetrics afterward). Already the pattern at planning.js:1124. Sprint 27-A: document + replicate for any new bulk path. |
| B.9 | Task.insertMany bypasses cascade — silent miss in future hook extensions | 🔴 | Agent 1 critical finding. Sprint 27-A must add a code-comment + a "post-insertMany manual cascade fire" helper. |
| B.10 | Cron Task.updateOne also bypasses cascade | 🟢 | Intentional for reminder bumps (no progress change). Document as intentional. |

---

## C. WeeklyGoal edge cases

| # | Case | Status | Notes |
|---|---|---|---|
| C.1 | WG with no Tasks (empty) — task_metrics computes 0/0 | 🟠 | Decide: `completion_pct = 0` (interpretable as "not started") OR `null` (interpretable as "no work defined"). Recommend `0` + boolean `has_tasks` flag for FE rendering. |
| C.2 | WG soft-deleted (status='cancelled') in KR rollup | 🔴 | Decision needed: include or exclude from `Objective.progress_percentage` aggregation? Convention from Goal cascade: included in total, not in completed (the bug). Sprint 27-A fix: exclude cancelled from both numerator AND denominator. |
| C.3 | WG.status auto-flip when all Tasks complete | 🟠 | Mirror Goal.updateTaskMetrics behavior? Yes — set WG.status='completed' when all child Tasks status='completed'. |
| C.4 | **WG.completion_rate VIRTUAL conflicts with new WG.task_metrics.completion_pct PERSISTED** | 🔴 | Two semantically different fields: virtual (recurring completions[]) vs persisted (Task-count). Decide one of: (i) rename virtual to `WG.recurring_completion_rate` + new persisted `WG.task_completion_pct`, (ii) replace virtual entirely with derivation, (iii) bifurcate behavior on `WG.frequency` (`once` → use task_metrics; recurring → use completions[]). **Recommend (iii)** — clean dispatch on existing field. |
| C.5 | WG.completions[] (recurring) coexists with child Tasks — semantic ambiguity | 🟠 | Per C.4 (iii), dispatch on `WG.frequency`. Document the bifurcation in WeeklyGoal model. |
| C.6 | WG without Tasks AND without completions[] | 🟢 | Falls back to status='not_started'; treat completion_pct=0. |

---

## D. KR + Objective edge cases

| # | Case | Status | Notes |
|---|---|---|---|
| D.1 | KR.current_value is external-only (S27 D.3 lock — canonical OKR semantics) | 🟢 | Affirmed. Sprint 27-A does NOT auto-bump current_value from Task completions. |
| D.2 | Objective.progress_percentage canonical derivation when KR.current_value never moves | 🔴 | **Critical design decision**. Today only Goal.post('save') writes this field. Three options: |
| | (a) Compute as `avg(WG.task_metrics.completion_pct)` across all WGs (ignore KR.current_value for progress display) | | Simplest. Aligns with user expectation. KR.current_value remains consultant-locked external signal. |
| | (b) Two-track: `progress_percentage` (KR-derived, consultant signal) + `task_progress_pct` (WG-derived, work-units signal) | | Most accurate; matches state-parsimony directive. Two fields, two semantics, no drift. FE picks which to render where. |
| | (c) `max(KR-derived, WG-derived)` | | Avoids stale 0%; ambiguous source. Rejected. |
| | **Recommend (b)** | 🔴 | Adds 1 persisted field (`Objective.task_progress_pct`) — but per state-parsimony test, used in 3+ FE surfaces (planning + objectives + my-clients) → justified. Drop the current Goal.post('save') overwrite of `progress_percentage` (today's behavior is the bug — it's writing KR-domain field from Goal-domain compute). |
| D.3 | LTS Step C predicate (in_execution → completion_review when all KRs.status='completed') depends on KR.current_value reaching target | 🟠 | If KR.current_value never moves, Step C never fires → objectives stuck in_execution. **Decide**: add a parallel Step C' predicate that fires when all WGs in objective have `task_metrics.completion_pct >= 100`? Sprint 27-A may want this OR may want explicit consultant action ("Mark KR Achieved"). Recommend **explicit consultant action** (preserves canonical OKR semantics + user-flagged in S27 D.3). |
| D.4 | Embedded `Objective.key_results[]` dual-write sync during sweep | 🟢 | Sprint 27-A doesn't touch KR or `calculateProgress()` semantics; just adds Objective.task_progress_pct as separate field. Dual-write integrity unchanged. |
| D.5 | Objective with 0 KRs / 0 WGs / 0 Tasks (fresh) | 🟢 | Both new and old aggregations return 0 cleanly. |

---

## E. Move (post-Beta) edge cases

| # | Case | Status | Notes |
|---|---|---|---|
| E.1 | Existing Move rows in DB (from auto-classification, Bundle-Fix 3 source) | 🟠 | Leave as-is in pre-prod; cleanup script optional + deferred. Read-side: don't show in dashboard once auto-classification reversed. |
| E.2 | Auto-Move-creation pipeline reversal — feature-flag vs hard-delete | 🟢 | User green-lit feature-flag reversal: `AUTO_MOVE_CLASSIFICATION_ENABLED=false` default + CLEANUP-TARGET marker per `feedback_cleanup_boundary_pattern`. Reversible if direction changes. |
| E.3 | Move dashboard section — hide vs empty-state | 🟠 | Recommend hide entirely behind `MOVES_FEATURE_ENABLED` env flag (matches "future development" intent). FE-only change. |
| E.4 | Future Move re-enable path | 🟡 | Documented via feature flag + RFC at re-enable time. No work this sprint. |
| E.5 | Move dedup against Chores ([moves.js:218-222](server/routes/moves.js#L218)) | 🔴 | If auto-classification reversed but dedup logic preserved, Chores section may still hide Tasks that have a stale Move row. Sprint 27-A must either (i) drop the dedup logic, OR (ii) ensure existing auto-Move rows are status='cancelled' so dedup ignores them. |

---

## F. Multi-tenant + RBAC + consultant cross-tenant

| # | Case | Status | Notes |
|---|---|---|---|
| F.1 | Tasks scoped by company_id — preserved throughout sweep | 🟢 | Existing required field. New paths inherit. |
| F.2 | Consultant cross-tenant via `?company_id=` — Task/WG creates respect tenant | 🟢 | Existing middleware. Verify new WG endpoints inherit `ConsultantPageMode` propagation. |
| F.3 | Role gates: who can create Tasks under WG vs under Goal? | 🟡 | Mirror existing Goal RBAC: CONSULTANT/BO/EXECUTIVE/MANAGER. EMPLOYEE can complete own. |

---

## G. Concurrency + race conditions

| # | Case | Status | Notes |
|---|---|---|---|
| G.1 | Two Tasks completing concurrently under same WG → WG.task_metrics race | 🔴 | Two patterns: (i) full recompute on each save (current Goal pattern, accepts last-write-wins drift), (ii) atomic `$inc` for `total/completed/blocked` counters. Sprint 27-A decide. **Recommend (i) for parity + simplicity, with a follow-up `RT-CASCADE-ATOMIC-COUNTERS` for post-Beta hardening.** |
| G.2 | Mongoose post-save hooks per-doc sequential, but multiple docs in parallel race on parent | 🔴 | Same as G.1. Accept last-write-wins for Beta. |
| G.3 | Bulk insertMany → manual one-shot WG.updateTaskMetrics — race with single-Task saves elsewhere | 🟠 | Bulk + single concurrent is rare in practice; doc the gap. |

---

## H. Test coverage

| # | Case | Status | Notes |
|---|---|---|---|
| H.1 | 200+ existing fixtures hard-code goal_id (Agent 1 finding) | 🔴 | Sprint 27-A factory refactor: `createTestTask({parent: 'goal'\|'weekly_goal', parent_id})`. Migrate fixtures in same workstream. |
| H.2 | New canonical-sweep regression tests needed | 🔴 | Single end-to-end: complete Task under WG → assert WG.task_metrics + Objective.task_progress_pct update. Plus legacy back-compat tests. |
| H.3 | Existing tests asserting Goal.updateTaskMetrics counts cancelled Tasks (B.3 bug-fix) | 🔴 | Must be updated; any test asserting "completion_rate=50% with 5/5 cancelled" needs to flip to 100%. |

---

## I. Documentation drift

| # | Case | Status | Notes |
|---|---|---|---|
| I.1 | CLAUDE.md §Data Model Hierarchy line "Task references goal_id; works against both legacy Goal and new WeeklyGoal _id" | 🔴 | Currently ambiguous → must affirm canonical. Sprint 27-A updates to: "Task references `goal_id` (legacy Goal) OR `weekly_goal_id` (canonical); exactly one is set." (or whatever the locked design lands on per Open Question OQ-3 below.) |
| I.2 | CASCADE_MIGRATION_STATE.md affirms canonical 4-level | 🔴 | Update. |
| I.3 | EMAIL_DEEP_LINK_CONTRACT.md — deep-link targets | 🟡 | No change needed (already targets Objective). |
| I.4 | ACTIVATION_PLAYBOOK.md — references Tasks / Moves | 🟠 | Verify references are Task-centric; if any "Move complete" or "create Move" in playbook, retire those sections. Agent 4 inventory will surface. |
| I.5 | weekly-goals.js:173,244 obsolete comments | 🔴 | Code-level comment cleanup as part of the fix slice. |

---

## J. Deployment + rollback

| # | Case | Status | Notes |
|---|---|---|---|
| J.1 | Sprint 27-A ships to development first | 🟢 | Standard pipeline. |
| J.2 | Rollback strategy if WG.task_metrics breaks production aggregations | 🟠 | Feature flag wrap on the new WG.post('save') hook? Probably overkill — hooks are cheap. Mitigation: keep Goal cascade unchanged so legacy paths preserve under rollback. |
| J.3 | Auto-Move kill-switch behavior on flip | 🟢 | Feature flag (E.2) + CLEANUP-TARGET marker; restart-only flip. |
| J.4 | Backfill required on existing WGs? | 🟠 | New `WG.task_metrics` field defaults to `{total:0, completed:0, blocked:0, completion_pct:0}` — empty WGs render correctly. WGs with existing Tasks need a one-time backfill cron pass. Sprint 27-A add a "first-load self-heal" in WG.post('save') OR a one-shot script. **Recommend self-heal-on-first-Task-save** (no migration script). |

---

## Open Questions to lock at /coding kickoff

- **OQ-1** (C.4): WG.completion_rate virtual vs new task_completion_pct — recommend bifurcation on `WG.frequency`.
- **OQ-2** (D.2): Objective.progress_percentage canonical source — recommend two-track (D.2-b): keep `progress_percentage` as KR-derived (today's intent), add `Objective.task_progress_pct` as WG-task-derived.
- **OQ-3**: Task model field — single `goal_id` polymorphic ref vs separate `weekly_goal_id` field. **Recommend separate fields** (Agent 1 also recommended) — clearer queries, easier validation, no polymorphic ref ambiguity. Validation: exactly one of `{goal_id, weekly_goal_id}` set per Task.
- **OQ-4** (D.3): LTS Step C parallel predicate for WG-completion — recommend skip; keep canonical OKR semantics (consultant manually marks KR achieved).
- **OQ-5** (A.3): mixed Goal+WG cascade objectives — data probe needed before decision.
- **OQ-6** (B.7): recurring Tasks scope — recommend defer to post-Beta + CLEANUP-TARGET marker.
- **OQ-7** (G.1): atomic `$inc` counters vs full recompute — recommend full recompute for Beta parity; mint `RT-CASCADE-ATOMIC-COUNTERS` for post-Beta.
- **OQ-8** (E.3): Moves section dashboard treatment — recommend hide behind `MOVES_FEATURE_ENABLED=false`.
- **OQ-9** (E.5): Move dedup logic — recommend cancel existing auto-Move rows via one-shot script in same workstream (so dedup naturally ignores them).

All recommendations stand pending Sprint 27-A `/coding` kickoff confirmation.
