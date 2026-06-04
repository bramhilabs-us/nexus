# Sprint 27-A — Impact Analysis

<!-- @GENOME T3-SPR-027a-IA | DRAFT | 2026-06-02 | parent:T3-SPR-027a-MP | auto:- | linked:/coding -->

**Purpose**: blast-radius per workstream + dependency graph + execution sequence so `/coding` sessions land in the right order with the right safety nets.

---

## 1. Blast Radius Matrix

Per-workstream impact across surfaces. Legend: 🔴 production-write · 🟠 production-read-shape · 🟡 internal-only · 🟢 docs-only / additive · ⚠ destructive (gated)

| W | Workstream | DB shape | Hook | Route | FE consumer | Test fixture | Risk band | Rollback |
|---|---|---|---|---|---|---|---|---|
| **W1** | Task `weekly_goal_id` field | 🟢 additive | 🟡 schema only | — | — | 🟠 fixture factory awareness | LOW | drop field migration; reversible |
| **W2** | Task creation routes accept WG | — | — | 🟠 validation logic | — | 🟠 fixtures pass new param | LOW | revert route check; reversible |
| **W3** | Task.post('save') WG branch | — | 🟠 dual-branch routing | — | — | 🟠 fixtures cover both paths | MED | revert hook; reversible (silent no-op returns) |
| **W4** | WeeklyGoal model `task_metrics` + post('save') | 🟢 additive | 🔴 NEW post-save → Objective | — | 🟠 reads new field | 🟠 fixtures populate WG task_metrics | MED | drop sub-doc + drop hook |
| **W5** | Objective `task_progress_pct` | 🟢 additive | — | — | 🟠 FE reads new field (additive) | 🟠 fixtures populate or default 0 | LOW | drop field |
| **W6** | Consultant aggregation extends `kr_rollup` | — | — | 🟠 response shape additive | 🟠 FE picks up new field (no-op if not consumed) | — | LOW | revert pipeline extension |
| **W7** | Soft-delete bug-fix (filter cancelled) | — | 🔴 hook recompute logic | — | — | 🔴 **existing tests break** (assert old bug) | MED | revert filter; tests stay updated |
| **W8** | Auto-Move kill-switch + soft-cancel script | ⚠ DB mutation (Move status flip) | — | 🟠 route conditional | 🟠 dashboard Move section behavior | 🟠 fixtures may seed Moves | HIGH ⚠ | flag-flip restores creation; soft-cancel reversible by status-flip script |
| **W9** | Move dedup filter cancelled | — | — | 🟠 dedup conditional | 🟠 chores re-appear in dashboard | 🟠 verify dashboard dedup tests | LOW | revert filter |
| **W10** | `Task.insertMany` cascade hardening | — | — | 🟠 add manual recompute call | — | 🟠 fixture bulk-create path | LOW | remove manual call |
| **W11** | FE label sweep (11 string literals) | — | — | — | 🟢 user-visible string changes | — | LOW | string revert |
| **W12** | FE consumer adjustment (planning-v2 + client-workspace) | — | — | — | 🟠 read shape + dispatch logic | — | MED | revert FE; backend payload still additive |
| **W13** | Documentation sweep | — | — | — | — | — | LOW | markdown revert |
| **W14** | Test refactor + canonical regression suite | — | — | — | — | 🔴 **all fixtures + 200+ test invocations migrated** | HIGH | revert factory; lose test coverage but no prod impact |

**Risk band totals**: 7 LOW + 5 MED + 2 HIGH. HIGH items (W8 destructive, W14 fixture migration) gate at session boundaries with explicit user go-ahead checkpoints.

---

## 2. Dependency Graph

```
                    ┌─────────────────────┐
                    │ W13 (docs sweep)    │  ← can run any time
                    └─────────────────────┘
                                                  
   ┌─── W1 ──┬─── W2 ───┬─── W3 ───┐               
   │ (model) │ (routes) │ (hook)   │               
   └─────────┴──────────┴──────────┘               
        │                                          
        ▼                                          
   ┌── W4 ──── W7 ────┐                            
   │ (WG model + post; bug-fix folds in)          
   └──────────────────┘                            
        │                                          
        ▼                                          
   ┌── W5 ──── W6 ────┐                            
   │ (Obj field; consultant aggregation)          
   └──────────────────┘                            
        │                                          
        ▼                                          
   ┌── W10 ──┐                                     
   │ (insertMany hardening — needs hooks live)    
   └─────────┘                                     
                                                  
   ┌── W8 ──── W9 ────┐  ← can run parallel to W1-W10
   │ (Move kill-switch + dedup)                   
   └──────────────────┘                            
                                                  
   ┌── W11 ──┐  ← can run any time                
   │ (label sweep)                                 
   └─────────┘                                     
                                                  
   ┌── W12 ──┐  ← waits for W5+W6 (FE reads)      
   │ (FE consumer)                                 
   └─────────┘                                     
                                                  
   ┌── W14 ──┐  ← FINAL gate; covers W1-W12       
   │ (test refactor + regression)                  
   └─────────┘                                     
```

**Critical chain** (longest path, blocks acceptance): W1 → W2 → W3 → W4+W7 → W5 → W6 → W10 → W12 → W14.

**Independent parallel paths**:
- W8 + W9 (Move kill-switch + dedup) can land in their own session — no dependency on cascade work.
- W11 (label sweep) is trivial; can land alongside any other slice.
- W13 (docs) bookends — initial scoping + closure.

---

## 3. Execution Sequence (3 `/coding` sessions, recommended)

Per `feedback_session_bifurcation` — single objective per session, handoff between.

### Session 27a-1 — Backend Cascade Lock (~4-5h)
**Objective**: end-to-end canonical cascade working in code (Tasks under WGs propagate to Objective.task_progress_pct).
**Slices**: W1 → W2 → W3 → W4 → W7 → W5 → W6 → W10
**Acceptance gate**: backend tests (existing Sprint 27 sibling-sweep + ad-hoc curl probe): create WG-parented Task → complete → confirm Objective.task_progress_pct moves; create legacy Goal-parented Task → confirm Objective.progress_percentage still works.
**Mint**: A20260603-01 (audit ID for W1-W7 backend lock), A20260603-02 (audit ID for W5-W6 Objective+consultant aggregation extension), A20260603-03 (audit ID for W10 insertMany hardening). **Note**: dates approximate; the ID date should match the day each chunk lands.
**Risk**: MED — W7 soft-delete fix breaks existing tests that asserted the bug. Test updates same session per `feedback_test_fixture_validation`.

### Session 27a-2 — Move kill-switch + Label sweep + FE adjustment (~3-4h)
**Objective**: Move auto-classification reversed; FE shows Tasks as Chores cleanly; dashboards refreshed.
**Slices**: W8 (destructive — explicit re-go-ahead at session kickoff per `feedback_no_destructive_without_greenlight`) → W9 → W11 → W12
**Acceptance gate**: manual smoke on dev — generate weekly plan → only Tasks created (no Move rows) → Chores section populated → label sweep visible in UI/email subjects.
**Mint**: A20260603-04 (Move kill-switch + dedup), A20260603-05 (FE label sweep + consumer adjustment).
**Risk**: HIGH ⚠ — W8 DB soft-cancel script touches production data on dev. User re-go-ahead at session kickoff (per cleanup-boundary-pattern).

### Session 27a-3 — Test Refactor + Canonical Regression Suite + Docs (~2-4h)
**Objective**: every Sprint 27-A behavior covered by regression test; back-compat verified; docs sealed.
**Slices**: W14 → W13
**Acceptance gate**: new regression suite green (canonical end-to-end + Goal back-compat + soft-delete + insertMany manual-recompute); all Sprint 27 prior sibling-sweep tests still green; docs updated.
**Mint**: A20260603-06 (W14 regression suite), A20260603-07 (W13 docs sweep close).
**Risk**: HIGH — 200+ fixture migrations; staged work per `feedback_test_fixture_validation`. If sub-set of fixtures resists migration, defer those tests with explicit `// SPRINT-27A-FIXTURE-MIGRATION-PENDING` markers + RT-entry.

---

## 4. Pre-flight Checks (run at each session kickoff)

**Per session**:
- [ ] Read [SPRINT27a_HANDOFF_DOCUMENT.md](SPRINT27a_HANDOFF_DOCUMENT.md) for current state
- [ ] Lock the relevant open questions from [SPRINT27a_MASTER_PLAN.md §Open Questions](SPRINT27a_MASTER_PLAN.md#open-questions-locked-at-coding-kickoff-with-audit-recommendations) (recommend default per audit; user can override)
- [ ] Mint per-slice audit IDs at kickoff (`A{YYYYMMDD}-{NN}` format per audit governance convention)
- [ ] Run `npm test -- --grep "<surface>"` baseline before changes
- [ ] Confirm dev MongoDB pre-state matches expected (especially for W8 — `db.moves.countDocuments({ai_generated: true})`)

**Session 27a-1 specific**:
- [ ] OQ-5 data probe: `db.objectives.aggregate([{$lookup: {from: 'goals', localField: '_id', foreignField: 'objective_id', as: 'goals'}}, {$lookup: {from: 'weeklygoals', localField: '_id', foreignField: 'objective_id', as: 'wgs'}}, {$match: {$and: [{'goals.0': {$exists: true}}, {'wgs.0': {$exists: true}}]}}])` — flag any mixed objectives.
- [ ] Confirm OQ-1 dispatch on `WG.frequency` matches WG model field shape.

**Session 27a-2 specific**:
- [ ] User re-go-ahead for W8 soft-cancel script (DB mutation).
- [ ] Pre-count: `db.moves.countDocuments({ai_generated: true, status: {$ne: 'cancelled'}})` baseline + post-count after script.
- [ ] Verify W11 label sweep doesn't break email template tests.

**Session 27a-3 specific**:
- [ ] Fixture migration strategy lock: bulk codemod via `tests/helpers/dbHelper.js` change + propagate factory signature, OR per-file migration.
- [ ] Defer-list discipline: any test that resists migration gets a marker, NOT a deletion.

---

## 5. Rollback Strategy (per slice)

| Slice | If fails on dev | If fails post-pre-prod-deploy |
|---|---|---|
| W1-W3 | Revert commit | Revert + deploy; legacy Goal cascade unaffected (back-compat) |
| W4 | Revert WG schema + hook | Revert; new field default 0 — no downstream consumer break |
| W5 | Drop new field | Same — additive field, defaults 0 |
| W6 | Revert pipeline extension | Same — additive field on response |
| W7 | Revert filter | Same — falls back to pre-existing buggy behavior (which is what existing tests expect) |
| W8 | Flip env flag back to true + revert soft-cancel via complementary script | Same — `db.moves.updateMany({ai_generated: true, status: 'cancelled', cancelled_by: 'sprint-27a-script'}, {$set: {status: 'todo'}})` |
| W9 | Revert dedup conditional | Same — dashboard returns to pre-S27a dedup behavior |
| W10 | Remove manual call | Same — insertMany still works, just doesn't recompute (matches pre-S27a behavior) |
| W11 | String revert | Same |
| W12 | FE revert | Same — backend still emits the additive field |
| W13 | Markdown revert | Same |
| W14 | Revert factory + tests | Same — pre-existing tests preserved |

**Net**: every slice has a clean revert path; legacy Goal cascade preserved throughout; production state always recoverable.

---

## 6. Coordination With Other Work-In-Flight

| Stream | Status | S27a interaction |
|---|---|---|
| Sprint 27 — open firing tasks | E.1a-d + E.9 PARKED post-S28 (this session) | none |
| Sprint 28 — Ysela soft-launch | READY-TO-EXECUTE, lean | sequential: S27 close → S27a close → S28 launch. S27a delays S28 by ~3-4 calendar days. |
| Sprint 31 — Canonical Mirror | PRE-LAUNCH placeholder | none |
| RT-TASK-MGMT-CASCADE-AUDIT Phases 2-4 | deferred post-Beta | S27a is the carve-out; Phases 2-4 carry forward intact |
| HOTFIX_DASHBOARD_NOTES Bundle-Fix 3 + 6 | Session B pending | **W8 supersedes Bundle-Fix 3**; Bundle-Fix 6 (Teams tab 4 bugs) remains pending |
| BRAMHI carry-forward | 10+ sessions deferred | unrelated; carry-forward continues |

**Critical**: Sprint 28 lean launch (Ysela soft-launch) is GATED on Sprint 27-A close (per acceptance test #4 — "consultant My Clients tile reflects updated task_progress_pct"). S27a must close before S28 launches OR S28 launches with the known cascade staleness on canonical objectives (user call).
