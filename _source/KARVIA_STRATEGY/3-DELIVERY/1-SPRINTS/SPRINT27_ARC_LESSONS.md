# Sprint 27 Arc — Lessons + Plan (2026-06-04 onward)

<!-- @GENOME T3-SPR-027-ARC | ACTIVE | 2026-06-03 | parent:T0-GOV-001 | auto:/init,/audit | linked:/coding,/close -->

**Status**: BRIDGE DOC — the single source of truth for the Sprint 27 multi-sprint arc. Read this at every `/init` or `/audit` kickoff in the arc.

**Purpose**: capture the lessons from the failed 2026-06-03 execution + lock the replanned 4-sprint arc + queue the Session 27-A.0 kickoff. Single-doc bridge from yesterday's mess to tomorrow's clean start.

---

## 1. The Miss (2026-06-03, session #282)

Twelve commits implementing the old Sprint 27-A plan shipped to `karvia-business-1` and broke three user-visible flows:

- Postpone Chore → "Failed to reschedule task" toast
- Reassign Chore → same failure
- Add Task → "Weekly goal not found" toast

All 12 commits were rolled back the same day via `git reset --hard 804d81f` + `git push --force-with-lease origin development`. The bugs disappeared with the rollback.

### Five Root Causes

1. **Did not read `CASCADE_MIGRATION_STATE.md` at `/coding` kickoff.** That doc explicitly stated `Task.goal_id` was polymorphic across `WeeklyGoal._id` and legacy `Goal._id`, and that full collection consolidation was *parked as a post-Beta spike*. The plan ignored that lock.

2. **Verification was backend-only.** The pre-execution code-walk checked the wizard's `insertMany` writes (caught one issue, migrated wizard correctly) but did NOT check:
   - FE write payloads (7 sites in `planning-v2.js` send `goal_id` in every Task create/update)
   - Existing DB data (Tasks with `goal_id` only, no `weekly_goal_id` field)
   - Cron jobs that mutate Tasks (`dailyDigestJob.js` digest paths)

3. **No smoke test before push.** After 10 commits, a 30-second click test on dev (postpone a chore) would have caught the validation failure. Skipped.

4. **Conflated "lock canonical for new data" with "retire legacy now."** The 2026-05-27 strategy decision was the former. The 2026-06-02 audit treated it as the latter. The polymorphic shape and the parked migration were not honored.

5. **Tightening `required:false → required:true` IS a destructive change on existing data.** Mongoose schema housekeeping *feels* like a small change; in fact every existing row that lacks the field becomes unsaveable. The `feedback_no_destructive_without_greenlight` rule was triggered without being recognized.

---

## 2. Seven Guard Rails (locked, not negotiable for Sprint 27 arc)

1. **Read `CASCADE_MIGRATION_STATE.md` at every session kickoff.** The doc updates with each phase. Drift between code and canon is the failure mode.

2. **Surface-pass before scope-pass.** For every retirement step: grep ALL of: backend writers + FE callers + cron jobs + test fixtures + data probes (row counts). No exceptions.

3. **Frontend migration BEFORE backend tightening.** Never tighten a schema or route until the FE speaks the new shape. Sequencing is load-bearing.

4. **Data probe + count before destructive change.** "X rows would fail validation if we tighten Y" — surface the count to the user, get explicit go-ahead.

5. **Smoke test before push.** 3-action click test on `karvia-business-1` (whatever flows the change touches). Not optional.

6. **Per-phase regression.** Not one giant regression at end of sprint. Each phase ships its own smoke/test before the next phase starts.

7. **`CASCADE_MIGRATION_STATE.md` updates WITH each phase.** Doc and code move together — never code-first, doc-later.

---

## 3. The Four-Sprint Arc

| Sprint | Goal | Sessions | Hours | Calendar | Ships |
|---|---|---|---|---|---|
| **27-A** | Audit (LEGO product definition) | 4 | 14-18h | 4-6 days | Docs only |
| **27-B** | Cascade correctness (the bug fix done right) | 3 | 12-15h | ~1 week | "bugs gone + adoption metric works" |
| **27-C** | Legacy model retirement (Goal + embedded KR) | 2-3 | 10-12h | ~1 week | "one canonical model + zero dual-paths" |
| **27-D** | Move full deletion + final regression | 1-2 | 5-8h | 3-4 days | "Beta-ready cascade" |
| **TOTAL** | | **10-12** | **~41-53h** | **~4 weeks** | |

**Beta target**: 2026-04-17 (per `BETA_ROADMAP_2026.md`). This arc completes ~July 2026 → **~9 months runway** for Beta stabilization + Sprint 28 (Ysela soft-launch).

### Dependency

```
27-A (audit, no code)
   ↓
27-B (cascade correctness — ships the user-value bug fix standalone)
   ↓
27-C (legacy deletion — compounds on 27-B canonical foundation)
   ↓
27-D (Move + final regression — the capstone)
```

27-B can ship without 27-C/D — value-incremental. If 27-C blocks, Beta could still launch on 27-B + 27-D's Move-kill alone.

---

## 4. Sprint 27-A — Audit Structure (4 Sessions)

### 27-A.0 — Locks + Persona Journey Doc Review (~2-3h, no code)

5 phases:

1. **Answer 5 open questions interactively** (see §5 below)
2. **Persona journey doc inventory** — read 9 docs, snapshot state in a table
3. **Staleness diagnosis** — each doc tagged CURRENT / DRIFT / REWRITE / MISSING
4. **Update list** — concrete edits queued (applied in 27-A.1 or deferred to 27-D)
5. **Draft `SPRINT27A_HANDOFF.md` + kickoff prompt for 27-A.1**

**Deliverables**: lock decisions, journey-doc verdict table, update list, replanned 27-A handoff, optional `CASCADE_MIGRATION_STATE.md` update, SESSION_LOG entry.

### 27-A.1 — 11 Customer Journey Walkthroughs (~4-5h, no code)

Walk each journey J1-J11 (J12 reassignment and J13 cancellation folded into LEGO docs):

| # | Journey | Primary actor | Modules touched |
|---|---|---|---|
| J1 | Consultant onboards new BO | Consultant | (pre-OKR) |
| J2 | BO completes SSI assessment | BO | (pre-OKR) |
| J3 | Objective creation (consultant-driven, LLM-assisted) | Consultant + BO | Objective |
| J4 | KR generation (LLM) + manual edit | BO + manager | Objective, KR |
| J5 | Weekly plan generation → WGs + Tasks | Manager | KR, WG, Task |
| J6 | Employee daily task completion | Employee | Task → cascade |
| J7 | Weekly reflection (Feedback page) | BO + manager + employee | KR, WG, Task |
| J8 | KR outcome update (manual current_value, confidence stamp) | BO + consultant | KR |
| J9 | Consultant My Clients tile review | Consultant | Read across all 4 |
| J10 | KR completion (consultant verifies + marks) | Consultant | KR, Objective lifecycle |
| J11 | Objective lifecycle transitions (identified → … → sustained) | Consultant | Objective |

Per journey, capture: plain-language walkthrough → FE actions in order → BE triggers → LLM calls (existing only — depth audit deferred to a future LLM session) → state changes → cascade ripples to other journeys.

**Deliverable**: `SPRINT27A_JOURNEYS.md`.

### 27-A.2 — Four LEGO Audits (~5-7h, no code)

For each of `Objective`, `KeyResult`, `WeeklyGoal`, `Task`:

```
LEGO: <Module>
1. WHAT IT IS — customer-facing role + cascade position
2. SCHEMA — every field: type, purpose, stored-vs-derived, who writes, who reads, KEEP/RETIRE/REDESIGN verdict
3. LIFECYCLE STATES — status enum + transitions (auto vs manual) + soft-delete behavior
4. FRONTEND SURFACES — pages displaying it, actions, form-field → API mapping, empty/error states
5. BACKEND ROUTES — endpoints, role gates, validation, side effects
6. LLM CALLS — where invoked, context sent, return value, WHY this needs an LLM, value verdict
7. CASCADE TRIGGERS — events fired upstream/downstream + events received from other modules
8. EDGE CASES — empty parents, reassignment mid-flight, etc.
9. CUSTOMER VALUE AUDIT — per field/action/route/LLM call: ESSENTIAL / NICE-TO-HAVE / DEAD WEIGHT (per stakeholder lens: Consultant / BO / Manager / Employee)
10. RETIREMENT / REDESIGN CANDIDATES — kill list / merge list / rethink list
```

**Deliverables**: `LEGO_OBJECTIVE.md`, `LEGO_KEYRESULT.md`, `LEGO_WEEKLYGOAL.md`, `LEGO_TASK.md`.

### 27-A.3 — Synthesis + 27-B/C/D Master Plans (~3-4h, no code)

Collate findings → reconcile with the 4 retirement tracks → update `CASCADE_MIGRATION_STATE.md` with new lock decisions → mint per-sprint master plans + handoffs.

**Deliverables**: `SPRINT27B_MASTER_PLAN.md`, `SPRINT27C_MASTER_PLAN.md`, `SPRINT27D_MASTER_PLAN.md`, `SPRINT27A_POSTMORTEM_SLICE_1_MISS.md`, updated `CASCADE_MIGRATION_STATE.md`, AUDIT_TRACKER entries (one ID per sprint, minted at that sprint's audit/coding kickoff per `feedback_audit_governance`).

---

## 5. Five Open Questions (answer in 27-A.0 Phase 1)

1. **When does Sprint 27-A start?** Decided 2026-06-03: **tomorrow** (2026-06-04, fresh calendar day).
2. **Single `SPRINT27_ARC_PLAN.md` doc now?** This doc IS that artifact — answer = yes, already done.
3. **CASCADE_MIGRATION_STATE.md update timing?** Pending 27-A.0 Phase 1 decision (recommend: update NOW to un-park the post-Beta spike lines so the canon reflects the new arc commitment).
4. **AUDIT_TRACKER entry — one per sprint or one for arc?** Pending 27-A.0 Phase 1 decision (recommend: one per sprint, minted at that sprint's kickoff).
5. **Sprint 27-A.0 handoff doc folder placement?** Pending 27-A.0 Phase 1 decision (recommend: new folder `SPRINT-27a-LEGO-Audit/` since original `SPRINT-27a-Cascade-Canonical-Sweep` is now superseded).

---

## 6. Persona Journey Doc List (for 27-A.0 Phase 2)

To inventory + flag staleness:

| Doc | Location |
|---|---|
| `USER_JOURNEYS_CONSOLIDATED.md` | `KARVIA_STRATEGY/1-PRODUCT/` |
| `CONSULTANT_JOURNEY_TESTS.md` | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/3-TEST-SUITES/e2e/` |
| `EMPLOYEE_JOURNEY_TESTS.md` | same |
| `MANAGER_JOURNEY_TESTS.md` | same |
| `EXECUTIVE_JOURNEY_TESTS.md` | same |
| `BOUNDARY_CORNER_CASES.md` | same |
| `CROSS_PAGE_AI_CONTEXT_TESTS.md` | same |
| `JOURNEY_GAP_REPORT_2026-05-08.md` | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/` |
| `BST_REGRESSION_SUITE.md` | `3-TEST-SUITES/e2e/` |

For each: CURRENT / DRIFT / REWRITE / MISSING verdict + concrete update list.

---

## 7. Memory Rule Preserved

[`feedback_cascade_ownership_split.md`](file:///Users/sagarrs/.claude/projects/-Users-sagarrs-Desktop-official-dev-karvia-business/memory/feedback_cascade_ownership_split.md) — locks the design principle that emerged from the 6-turn philosophy reframe: every field is either a parameter (human edits) or an output (system derives); never both; human override lives in a separate field (e.g., `KR.status`), never as a flag on the output. This rule remains canonical for the entire Sprint 27 arc.

---

## 8. Kickoff Prompt for Session 27-A.0 (paste-ready)

> `/audit` — Sprint 27-A Session 27-A.0: Locks + Persona Journey Doc Review. Read in order: `CLAUDE.md` §Data Model + §Building Principles + §Circular Economy → `KARVIA_STRATEGY/2-TECHNICAL/CASCADE_MIGRATION_STATE.md` (the canon missed in the 2026-06-03 miss) → this `SPRINT27_ARC_LESSONS.md` doc → `feedback_cascade_ownership_split` memory. Then execute 5 phases per §4 of the arc-lessons doc: (1) answer 5 open questions interactively, (2) inventory 9 persona journey docs in a single table, (3) flag staleness CURRENT/DRIFT/REWRITE/MISSING per doc, (4) write per-doc update list (queued, not applied), (5) draft `SPRINT27A_HANDOFF.md` + kickoff prompt for 27-A.1 + optional `CASCADE_MIGRATION_STATE` update + SESSION_LOG entry. Zero code. Apply the 7 guard rails from §2. Take it slow.

---

## 9. What This Doc Does NOT Re-Define

- Architectural decisions (those happen in 27-A.1, 27-A.2, 27-A.3)
- LEGO field-by-field schemas (those land in 27-A.2 LEGO docs)
- Final retirement order across 27-B/C/D (lands in 27-A.3 master plans)
- CASCADE_MIGRATION_STATE.md content (only flagged for update timing)

This doc is the **process bridge**, not the **architectural spec**. The audit produces the spec.
