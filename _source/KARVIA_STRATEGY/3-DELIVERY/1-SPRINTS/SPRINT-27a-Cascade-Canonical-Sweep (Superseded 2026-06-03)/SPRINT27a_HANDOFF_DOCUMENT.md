# Sprint 27-A — Handoff Document

<!-- @GENOME T3-SPR-027a-HANDOFF | DRAFT | 2026-06-02 | parent:T3-SPR-027a-MP | auto:/init,/close | linked:/sprint-review -->

**Status**: 🟢 **READY-TO-EXECUTE** — minted 2026-06-02 at `/audit` session #281 (continuation). 14 workstreams scoped + ordered + impact-analyzed. Awaiting `/coding` Session 27a-1 kickoff.
**Sprint Goal**: lock the canonical cascade `Objective → KR → WeeklyGoal → Task` (Tasks rendered as "Chores") end-to-end. Stop auto-classifying Tasks as Moves. Restore the user-visible "I did the work" signal across Dashboard → Planning → Objectives → Consultant My Clients.
**Sprint Window**: ~10-12.5h focused work · 3 `/coding` sessions · calendar ~3-4 days.
**Trigger**: user direction 2026-06-02 — *"create mini sprint plan as 27-a, first do a in-depth audit ... use that learning to create tasks in sprint 27-a, then do an impact analysis and execute everything in orderly fashion."*

---

## Launch Gate — ✅ CLEARED 2026-06-02

- [x] Audit deep-dive complete ([SPRINT27a_AUDIT_DEEP_DIVE.md](SPRINT27a_AUDIT_DEEP_DIVE.md)) — 4 parallel agents · 10 critical findings · 10 important findings
- [x] Corner cases catalogued ([SPRINT27a_CORNER_CASES.md](SPRINT27a_CORNER_CASES.md)) — 10 categories · 9 open questions with recommendations
- [x] Master plan locked ([SPRINT27a_MASTER_PLAN.md](SPRINT27a_MASTER_PLAN.md)) — 14 workstreams · acceptance test · scope boundaries
- [x] Impact analysis complete ([SPRINT27a_IMPACT_ANALYSIS.md](SPRINT27a_IMPACT_ANALYSIS.md)) — blast radius matrix · dependency graph · 3-session execution sequence · rollback per slice
- [x] User green-lit destructive items: Move auto-classification reversal (W8) + soft-cancel script for `ai_generated=true` Moves
- [x] Parent Sprint 27 handoff updated — Workstream E parked post-S28; S27a referenced
- [x] Audit ID A20260602-07 minted in [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) (📝 PLAN)

---

## Workstreams — Current Status

| ID | Workstream | Status | Audit ID (mint at /coding) | Notes |
|---|---|---|---|---|
| **W1** | Task `weekly_goal_id` field + XOR validation | 📝 PLAN | — | Session 27a-1 |
| **W2** | Task creation routes accept WG parent | 📝 PLAN | — | Session 27a-1 |
| **W3** | Task.post('save') WG branch | 📝 PLAN | — | Session 27a-1 |
| **W4** | WeeklyGoal `task_metrics` + post('save') cascade | 📝 PLAN | — | Session 27a-1 |
| **W5** | Objective `task_progress_pct` field | 📝 PLAN | — | Session 27a-1 |
| **W6** | Consultant aggregation extension | 📝 PLAN | — | Session 27a-1 |
| **W7** | Soft-delete bug-fix (exclude cancelled) | 📝 PLAN | — | Session 27a-1 |
| **W8** | Move auto-classification kill-switch + soft-cancel | 📝 PLAN | — | Session 27a-2 ⚠ user re-go-ahead at kickoff |
| **W9** | Move dedup filter cancelled | 📝 PLAN | — | Session 27a-2 |
| **W10** | Task.insertMany cascade hardening | 📝 PLAN | — | Session 27a-1 |
| **W11** | FE label sweep (11 strings) | 📝 PLAN | — | Session 27a-2 |
| **W12** | FE consumer adjustment | 📝 PLAN | — | Session 27a-2 |
| **W13** | Documentation sweep | 📝 PLAN | — | Session 27a-3 (or rolling) |
| **W14** | Test refactor + canonical regression suite | 📝 PLAN | — | Session 27a-3 |

**Total firing**: 14/14 PLANNED · 0/14 CODE · 0/14 TESTS. Updates as `/coding` sessions land.

---

## Acceptance Test (full version in [Master Plan](SPRINT27a_MASTER_PLAN.md#acceptance-test))

Sprint 27-A closes when:
1. Backend regression suite (W14) green — canonical Task→WG→Obj end-to-end + legacy Goal back-compat + soft-delete edge + insertMany manual-recompute
2. Manual smoke on dev: complete a Chore → planning + objectives + My Clients tile reflect within refresh
3. Move auto-classification disabled (zero Moves on new weekly plans); existing auto-Moves soft-cancelled; Chores re-appear via dedup release
4. All Sprint 27 prior sibling-sweep tests (D 47/47, B.4b 39/39, B.4-receive 36/36, E.7 22/22) remain green
5. Docs updated (CLAUDE.md + CASCADE_MIGRATION_STATE + weekly-goals.js + recurring marker + insertMany comment)

---

## Beta Connection

Sprint 27-A is the Beta hot-fix carve-out from RT-TASK-MGMT-CASCADE-AUDIT Phase 1. After S27a closes:
- Circular-economy adoption metric becomes visible at every touchpoint (CLAUDE.md §Circular Economy invariant restored)
- S28 Ysela soft-launch unblocked (user direction: "lets move E to after soft launching ysela" — but cascade-completeness is the upstream gate)
- RT Phases 2-4 (state-parsimony refactor, reassignment matrix, full regression suite) carry forward as post-Beta refinement track

---

## Architectural Invariants

See [SPRINT27a_AUDIT_DEEP_DIVE.md §C](SPRINT27a_AUDIT_DEEP_DIVE.md#c-cascade-invariants-locked-do-not-break-in-sprint-27-a) for the 8 locked invariants. Highlights:
- Single writer per persisted progress field (no dual-writer races)
- KR.current_value remains external-only (canonical OKR semantics)
- LTS Step C cron+route-driven (not cascade-driven)
- Goal cascade preserved for back-compat
- Soft-delete handling revised — cancelled excluded from completion counts (bug-fix)

---

## Open Questions (lock at first `/coding` kickoff)

Audit recommendations in [SPRINT27a_AUDIT_DEEP_DIVE.md §E](SPRINT27a_AUDIT_DEEP_DIVE.md#e-open-questions-for-coding-kickoff). User-locked-already:
- **OQ-8**: Moves dashboard treatment — HIDE behind `MOVES_FEATURE_ENABLED=false` ✅ user green-lit
- **OQ-9**: Move dedup — soft-cancel existing auto-Moves + dedup filters cancelled ✅ user green-lit

To lock at kickoff:
- OQ-1, OQ-2, OQ-3, OQ-4, OQ-5, OQ-6, OQ-7 — defaults per audit recommendations

---

## Carry-Forward From Sprint 27

Sprint 27 ACTIVE at 17/23 firing (74%). Sprint 27-A carries forward:
- Workstream D static verification (A20260602-05) — D.3 chain mapped; S27a W14 regression test makes the chain **dynamic + end-to-end** for the first time
- Workstream C cron `runOkrAggregationPass` (A20260602-01) — unchanged; cron still fires Step C predicate on KR.status='completed'
- E.4 8-state matrix card CTAs — unaffected; FE renders Objective.progress_percentage as today (KR-derived stays canonical for that field)
- B.5 Ready-to-Sustain dispatcher (A20260602-02) — unaffected; fires from LTS notifyTransition

S27 Workstream E (E.1a-d wizard restructure + E.9 regression) — formally PARKED post-S28 (per [SPRINT27_HANDOFF_DOCUMENT.md](../SPRINT-27-First-Task/SPRINT27_HANDOFF_DOCUMENT.md) edit 2026-06-02 same session).

---

## Audit History

| ID | Source | One-liner | 📝 | 💻 | ✅ |
|---|---|---|---|---|---|
| `A20260602-06` | /audit 2026-06-02 #281 — RT-TASK-MGMT-CASCADE-AUDIT Phase 1 | Cascade matrix + weakest-link inventory; Phase 1 deliverable that surfaced the smoking gun (later re-grounded under user canonical lock). See [REFINEMENT-BACKLOG/RT-TASK-MGMT-CASCADE-AUDIT_PHASE1_MATRIX.md](../REFINEMENT-BACKLOG/RT-TASK-MGMT-CASCADE-AUDIT_PHASE1_MATRIX.md). | ✓ | — | — |
| `A20260602-07` | /audit 2026-06-02 #281 (continuation) — Sprint 27-A deep audit + mint | Deep audit synthesis (4 parallel agents) + Sprint 27-A plan + impact analysis + corner cases + handoff. 14 workstreams scoped. | ✓ | — | — |

Per-slice audit IDs (`A20260603-NN` and onward) mint at `/coding` kickoff of each session.

---

## Deferrals (logged here at S27a close → REFINEMENT-BACKLOG)

| Item | Defer reason | Source |
|---|---|---|
| RT-CASCADE-ATOMIC-COUNTERS | Beta-acceptable last-write-wins parity | OQ-7 |
| RT-RECURRING-TASKS-UNIMPLEMENTED | feature scoping decision needed | OQ-6 / B.6 corner case / Task.js:271-287 |
| RT-MOVE-FEATURE-RE-ENABLE-RFC | future when Move re-enabled | OQ-8 |
| RT-TASK-MGMT-CASCADE-AUDIT Phases 2-4 | S27a is the carve-out hot-fix slice | original RT entry |
| Legacy Goal-cascade objective migration | back-compat sufficient for Beta | CASCADE_MIGRATION_STATE.md |
| Goal.progress / Objective.progress_percentage DERIVE drops | destructive; user go-ahead required | Phase 1 state-parsimony verdicts |

---

## Sign-off

Sprint 27-A handoff initialized 2026-06-02 via `/audit` session #281. Audit deep-dive + master plan + corner cases + impact analysis + this handoff doc form the complete planning bundle. 14 workstreams ordered into 3 `/coding` sessions per session-bifurcation discipline.

**Next session recommendation**: `/coding` Session 27a-1 — Backend Cascade Lock (W1 → W2 → W3 → W4 → W7 → W5 → W6 → W10, ~4-5h). Lock OQ-1/2/3/4/5/6/7 at kickoff. Mint per-slice audit IDs as work lands.

**Kickoff opening prompt**:
> `/coding` — Sprint 27-A Session 27a-1 Backend Cascade Lock. Read [SPRINT27a_HANDOFF_DOCUMENT.md](SPRINT27a_HANDOFF_DOCUMENT.md), [SPRINT27a_MASTER_PLAN.md](SPRINT27a_MASTER_PLAN.md), [SPRINT27a_AUDIT_DEEP_DIVE.md](SPRINT27a_AUDIT_DEEP_DIVE.md), [SPRINT27a_IMPACT_ANALYSIS.md](SPRINT27a_IMPACT_ANALYSIS.md). Open by locking the 7 unresolved Open Questions per audit recommendations + running OQ-5 mixed-cascade data probe + minting per-slice audit IDs. Then execute W1 → W2 → W3 → W4 → W7 → W5 → W6 → W10 in order with per-slice tests + sibling sweep + commit per slice. Target ~4-5h; hand off to Session 27a-2 with updated handoff doc + tracker.
