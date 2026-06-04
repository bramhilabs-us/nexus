# SUPERSEDED 2026-06-03

<!-- @GENOME T3-SPR-027a-SUPERSEDED | ARCHIVED | 2026-06-03 | parent:T0-GOV-001 | auto:- | linked:- -->

**Status**: SUPERSEDED — do not use any document in this folder as a planning input for new work.

## Why

The Sprint 27-A planning bundle in this folder was minted at `/audit` session #281 (2026-06-02). Execution at `/coding` session #282 (2026-06-03) shipped 12 commits implementing this plan — they broke three user-visible flows (postpone, reassign, add chore) on `karvia-business-1`.

The root cause was architectural, not executional: this plan assumed the canonical cascade lock from 2026-05-27 meant "retire legacy now," when the canonical state doc explicitly said the polymorphic `Task.goal_id` shape was the **parked post-Beta migration**. The plan therefore tightened backend schemas without:

- Reading `CASCADE_MIGRATION_STATE.md` (the authoritative canon)
- Inventorying FE caller payloads (still sending the legacy field shape)
- Counting existing DB rows that would fail validation
- Smoke-testing on dev before push

Session #282 commits were rolled back the same day via `git reset --hard 804d81f` + `git push --force-with-lease`. The 3 production bugs disappeared with the rollback.

## What Replaces This

**Sprint 27 Arc** (replanned 2026-06-03): a 4-sprint sequence (Sprint 27-A audit → 27-B cascade correctness → 27-C legacy retirement → 27-D Move deletion + final regression), starting with an explicit audit-only Sprint 27-A that walks the cascade as a product, not a codebase.

See `../SPRINT27_ARC_LESSONS.md` for the bridge doc capturing the 5 root causes + 7 guard rails + 4-sprint arc + Session 27-A.0 plan.

## What's Preserved in This Folder

These docs remain on disk as historical reference for the failed approach. Specifically useful:

- **SPRINT27a_AUDIT_DEEP_DIVE.md** — 10 critical findings + 10 important findings from 4 parallel Explore agents on 2026-06-02. The findings are valid; the action plan built on them was flawed. New Sprint 27-A audit (in `../`) will re-validate these findings under the corrected scope.
- **SPRINT27a_MASTER_PLAN.md** — 14 workstreams. Useful as a "what we thought we should do" reference, NOT as an execution plan.
- **SPRINT27a_CORNER_CASES.md** — 10 categories of corner cases. Re-validate under new arc.
- **SPRINT27a_IMPACT_ANALYSIS.md** — Blast radius matrix. Re-evaluate per the new arc.
- **SPRINT27a_HANDOFF_DOCUMENT.md** — Execution handoff. No longer load-bearing.
- **RT-TASK-MGMT-CASCADE-AUDIT_PHASE1_MATRIX.md** — Cascade matrix + state-parsimony verdicts. Useful inventory; conclusions need re-grounding.

## No Reads From Here

`auto:` and `linked:` slash commands intentionally do not reference any doc in this folder. The `/init` flow + future audits load `../SPRINT27_ARC_LESSONS.md` instead.

## Memory Rule Preserved

`feedback_cascade_ownership_split` (saved 2026-06-03 in `~/.claude/`) captures the design principle that emerged from the 6-turn philosophy reframe before the failed execution. That rule remains canonical and does not need re-validation.
