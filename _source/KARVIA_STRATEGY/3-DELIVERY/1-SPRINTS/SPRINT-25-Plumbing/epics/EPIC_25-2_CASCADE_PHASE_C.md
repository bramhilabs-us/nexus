# Epic 25.2 — OKR Cascade Phase C (Legacy Retirement)

<!-- @GENOME T3-SPR-025-EPIC-2 | DRAFT | 2026-05-05 | parent:T3-SPR-025-MP | auto:- | linked:- -->

**Points**: 3-5 (estimate)
**Priority**: P1 — only ships if Phase B (Epic 25.1) telemetry is clean for 2 sprints
**Source plan**: [CONSOLIDATION_PLAN.md Phase C](../../../../2-TECHNICAL/CONSOLIDATION_PLAN.md)

---

## Goal

Pure cleanup. Delete legacy code paths and legacy data after Phase B has proven stable. Remove the dual-source complexity entirely.

## Pre-requisites (must hold before this epic ships)

1. Epic 25.1 (Phase B) shipped successfully
2. Telemetry shows zero callers on legacy `/api/goals/weekly/*` endpoints for **2 sprints**
3. Production query confirms no un-migrated legacy weekly goals exist:
   ```js
   db.goals.countDocuments({ time_period: 'WEEKLY', _migrated_to: { $exists: false } })
   // Expected: 0
   ```
4. Beta launch behavioral telemetry confirms users are on the modern cascade

If any pre-req fails → defer Epic 25.2 to Sprint 26 or later.

## Acceptance Criteria

### Code deletions
- [ ] DELETE `/api/goals/weekly/*` route block (entire section in `server/routes/goals.js`)
- [ ] DELETE `/api/planning/goals/weekly` overlap endpoint
- [ ] DELETE `legacyWeekToISO()` helper from `server/routes/weekly-goals.js` (no more legacy entries to map)
- [ ] DELETE the legacy branch of the UNION READ in `GET /api/weekly-goals/:keyResultId` — endpoint reads ONLY from `WeeklyGoal` collection
- [ ] DELETE embedded `Objective.key_results[]` schema field (and its dependent virtuals like `key_results_completion`)
- [ ] DELETE Objective virtual `key_results` (the embedded one); `key_results_v2` becomes the canonical accessor (and may be renamed to plain `key_results` after this epic — see naming-cleanup task below)
- [ ] AUDIT `/api/ai-okr/*` — if all callers route through `objective-wizard` or `objectives.generate-krs`, RETIRE the route + delete `AIObjectivePlanner.js`

### Data deletions
- [ ] One-shot script `scripts/db/delete-migrated-legacy-weekly.js`:
  ```js
  db.goals.deleteMany({ time_period: 'WEEKLY', _migrated_to: { $exists: true } });
  ```
  - Production guard: requires `--confirm-prod` flag
  - Idempotent
  - Prints count before deleting
- [ ] One-shot collection migration to drop `key_results[]` array from existing Objective docs:
  ```js
  db.objectives.updateMany({}, { $unset: { key_results: '' } });
  ```

### Naming cleanup (optional, decide at kickoff)
- [ ] Rename `Objective.virtual('key_results_v2')` → `Objective.virtual('key_results')` now that the embedded array is gone (no naming collision)
- [ ] Update all callers of `key_results_v2` → `key_results`
- [ ] If kept as `_v2`: document why in schema comment

### Tests
- [ ] NEW `scripts/test-cascade-phase-c.js`:
  - Legacy route returns 404 (gone, not 410 — fully removed)
  - `Objective.key_results` Mongoose schema does NOT include the embedded array field
  - Production-safe deletion script idempotency
  - Cross-tenant isolation preserved
- [ ] Full regression sweep across S22a + S23 + S24 + S25 (Phase B) stays green

## Risks & Considerations

### R1 — Premature deletion
If Phase B telemetry was misread and a tenant still has legacy data, Phase C deletes data that may have been actively used.
**Mitigation**: Require 2 sprints of clean telemetry. Manual verification query before running deletion script.

### R2 — Hidden consumers
Some test fixture or seed script may reference `Goal{WEEKLY}` or embedded `key_results[]`.
**Mitigation**: Pre-deletion audit:
```bash
grep -rnE "key_results\b|time_period.*WEEKLY" --include="*.js" server/ scripts/ tests/
```

### R3 — Schema migration on production
Dropping the `key_results[]` field removes data permanently from existing Objective docs (the legacy embedded data).
**Mitigation**: Snapshot/backup before running. Phase B already preserved the data in standalone `KeyResult` collection — embedded data is purely redundant by Phase C.

## Implementation Notes

### Files to modify (deletion-heavy)
- `server/routes/goals.js` — remove ~350 LOC (the legacy weekly section)
- `server/routes/weekly-goals.js` — remove `legacyWeekToISO()` and union-read branching; simplify to single-source query
- `server/models/Objective.js` — remove embedded sub-doc schema; remove related virtuals
- `server/routes/planning.js` — remove overlap endpoint if present
- `server/routes/ai-okr.js` — possibly delete entire file if audit clears it
- `server/services/AIObjectivePlanner.js` — possibly delete entire file

### Files to create
- `scripts/db/delete-migrated-legacy-weekly.js`
- `scripts/db/drop-objective-key-results-embedded.js` (for schema-side cleanup)
- `scripts/test-cascade-phase-c.js`

### Surgical reuse
- ✅ S24 production-safety guard pattern in deletion scripts
- ✅ `scripts/db/` folder convention from S24 F-5

## Sign-off Conditions

Phase C closes the cascade transition story. After this epic:
- ZERO legacy paths in code
- ZERO legacy data in production
- ZERO union-read complexity
- ONE canonical write path: `Objective → KeyResult → WeeklyGoal → Move`
- Frontend tree component reads from a single, simple endpoint structure

If we hit Phase C delivery cleanly, the OKR cascade is **done as an architectural concern**.

---

**Spec status**: Draft. Conditional on Phase B telemetry. Defer to S26 if pre-reqs not met.
