# Epic 25.1 — OKR Cascade Phase B (Write-Side Cutover)

<!-- @GENOME T3-SPR-025-EPIC-1 | DRAFT | 2026-05-05 | parent:T3-SPR-025-MP | auto:- | linked:- -->

**Points**: 6-8 (estimate)
**Priority**: P0 — blocks Epic 25.2 (Phase C) and Epic 25.3 (owner redesign)
**Source plan**: [CONSOLIDATION_PLAN.md Phase B](../../../../2-TECHNICAL/CONSOLIDATION_PLAN.md)

---

## Goal

Retire the dual-write pattern that's been live since Sprint 22 #176. After this epic:
- ONE canonical write path: `Objective → KeyResult (standalone) → WeeklyGoal → Move`
- Embedded `Objective.key_results[]` is no longer dual-written (schema field stays for migration; never updated)
- Legacy `Goal{time_period:'WEEKLY'}` writes return `410 Gone`
- All legacy weekly Goal docs migrated to `WeeklyGoal` collection with `_migrated_to` markers

## Locked Decisions (from CONSOLIDATION_PLAN.md)

These pre-existed S24 audit; carrying forward:

1. Idempotent migration via `scripts/db/migrate-legacy-weekly-to-new.js` (post-S24 we have a `scripts/db/` folder per S24 F-5)
2. Dry-run mode mandatory before any production write
3. Legacy collection preserved post-migration for Phase C delete (don't drop yet)
4. `_migrated_to: <new_id>` written on each legacy doc for safe Phase C cleanup
5. Standalone `KeyResult` becomes sole write target on objective creation (in `routes/objectives.js POST` and `routes/objective-wizard.js finalize`)

## Open Questions to Answer at S25 Kickoff

Per CONSOLIDATION_PLAN.md "Open questions for Phase B":

### Q1 — Frequency mapping default
Legacy `Goal{WEEKLY}` has no `frequency` field. New `WeeklyGoal` requires one (`once | weekly | biweekly | twice_monthly | monthly`).
- **Default proposal**: `frequency='once'` for all migrated entries
- **Decision required at S25 kickoff**: confirm OR override

### Q2 — Tasks under legacy Goals
Legacy `Goal{WEEKLY}` has child `Task` documents. New `WeeklyGoal` cascades to `Move` (different model). Migration must decide:
- (a) Leave Tasks attached to legacy Goal docs (read-only; tasks remain visible via the existing UNION read path)
- (b) Migrate Tasks to Moves (semantic mismatch; Move has `move_type` enum that Task doesn't)
- (c) Convert each Task into a Move with `move_type='action'` as a default
- **Recommended**: (a) — leave Tasks attached. Migration is non-destructive; UI continues to show them via union read.

### Q3 — Progress percentage seeding
Legacy `Goal.progress_percentage` is stored. New `WeeklyGoal.completion_rate` is a virtual computed from `completions[]`. Migration must seed `completions[]` for in-progress legacy goals.
- **Proposal**: For each legacy goal with `progress_percentage > 0`, write a single synthetic `completions[]` entry with `completion_score = progress_percentage`, `notes='migrated from legacy progress'`, `completed_at = legacy.updated_at`
- **Decision required at S25 kickoff**: confirm OR override

## Acceptance Criteria

### Backend write changes
- [ ] `POST /api/objectives` no longer writes embedded `key_results[]` — only writes standalone `KeyResult` docs
- [ ] `POST /api/objective-wizard/finalize` same change
- [ ] `Objective.key_results[]` schema field retained (read-compat); becomes a "frozen" array reflecting last legacy write
- [ ] `POST /api/goals/weekly` returns `410 Gone` with deprecation message pointing to `/api/weekly-goals`
- [ ] `PUT /api/goals/weekly/:id` returns `410 Gone`
- [ ] `DELETE /api/goals/weekly/:id` returns `410 Gone`
- [ ] `GET /api/goals/weekly/by-kr/:keyResultId` STILL works (read-only path; needed for Phase C transition)

### Frontend write changes
- [ ] `client/pages/scripts/planning-v2.js` `assignWeeklyGoal()` writes only to `/api/weekly-goals/:id` (already mostly true post-S23 #191; verify + lock with grep test)
- [ ] No `client/` page POSTs to `/api/goals/weekly/*` (grep-asserted in test)
- [ ] No frontend code reads `Objective.key_results[].title` etc. (grep-asserted; `key_results_v2` virtual is the only canonical source)

### Migration script
- [ ] NEW `scripts/db/migrate-legacy-weekly-to-new.js`:
  - Idempotent (re-running is no-op — checks for `_migrated_to` marker)
  - `--dry-run` flag prints proposed mappings without writing
  - Production guard (`NODE_ENV` check)
  - Per-document migration: legacy `Goal{WEEKLY}` → new `WeeklyGoal` with full field mapping
  - Sets `_migrated_to` on legacy doc
  - Q3 progress seeding
  - Emits `lifecycle.transition` telemetry events for any `kr_breakdown → in_execution` transitions triggered by the migration (since seeded `WeeklyGoal` docs may newly satisfy the predicate)

### Tests
- [ ] NEW `scripts/test-cascade-phase-b.js` covering:
  - 410 responses on legacy write endpoints
  - Frontend grep assertions (no legacy callers)
  - Migration script idempotency
  - Migration script dry-run output integrity
  - Embedded `key_results[]` is no longer mutated by canonical POST routes
  - Standalone `KeyResult` write succeeds even when legacy embedded write would have failed
- [ ] Full S22a + S23 + S24 regression sweep stays green

## Implementation Notes

### Files to modify
- `server/routes/objectives.js` — strip `key_results[]` push from POST handler; keep schema field for read-compat
- `server/routes/objective-wizard.js` — same treatment in finalize handler
- `server/routes/goals.js` — convert `POST/PUT/DELETE /api/goals/weekly/*` handlers to return 410
- `server/services/aiOKRService.js` — verify cascade generator writes to `KeyResult` standalone (should already; lock with test)
- `client/pages/scripts/planning-v2.js` — verify no legacy weekly writes (grep-locked)

### Files to create
- `scripts/db/migrate-legacy-weekly-to-new.js`
- `scripts/test-cascade-phase-b.js`

### Surgical reuse from S24
- ✅ `scripts/db/` folder pattern (S24 F-5)
- ✅ `LifecycleTransitionService` (S24 F-2) — migration may trigger lifecycle transitions
- ✅ Production env-var guard pattern from S24 migration script

### Risk mitigations
- **R1**: Migration data corruption — dry-run mandatory; idempotent; preserves legacy collection
- **R2**: Frontend regression — grep-locked tests catch any drift
- **R3**: Telemetry surge during migration — batch-emit with rate limit; flag in CONSOLIDATION_PLAN

## Detection queries (when to advance to Phase C)

```bash
# Frontend has zero legacy writers
grep -rnE "/api/goals/weekly/(?!by-kr/)" client/ | grep -vE "^\s*//"
# Expected: empty

# Production data fully migrated
db.goals.countDocuments({ time_period: 'WEEKLY', _migrated_to: { $exists: false } })
# Expected: 0
```

If both pass for 2 sprints → trigger Phase C (Epic 25.2).

---

**Spec status**: Draft. Firms up at S25 kickoff. Inherits any S24 lessons learned.
