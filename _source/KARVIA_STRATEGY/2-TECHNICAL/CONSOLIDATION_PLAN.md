# Objectives → KRs → Weekly Plans Consolidation Plan

<!-- @GENOME T2-ARC-002 | ACTIVE | 2026-04-30 | parent:T0-GOV-001 | auto:- | linked:/audit-architecture -->

**Created**: 2026-04-30 (Sprint 23 #191)
**Status**: 🟢 Phase A complete · Phase B + C scheduled
**Owner**: Karvia engineering
**Related**: [SPRINT-23/SPRINT23_HANDOFF_DOCUMENT.md](../3-DELIVERY/1-SPRINTS/SPRINT-23/SPRINT23_HANDOFF_DOCUMENT.md)

---

## Why this doc exists

During Sprint 23 #191 we audited the OKR cascade surface (Objectives → KRs → Weekly Plans → Moves) and found legitimate sprawl from layered sprint deliveries:

- **2 Key-Result stores** coexist: embedded `Objective.key_results[]` (legacy, dual-written for backwards compat per D-A-1) and standalone `KeyResult` collection (new, canonical from Sprint 22 #176)
- **2 Weekly-goal stores** coexist: legacy `Goal{time_period:'WEEKLY'}` and new `WeeklyGoal` collection (new, canonical from Sprint 22 #176)
- **6 route files** touch the cascade with overlapping endpoints (ai-okr, goals, objective-wizard, objectives, planning, weekly-goals)
- **2 AI services** generate OKRs (`aiOKRService` canonical post-LLMGateway; `AIObjectivePlanner` older single-objective path)

The big-bang cleanup is too risky to do in any single feature sprint. This doc breaks the work into 3 phases — each ships clean and is independently revertable.

---

## Current state map (as of 2026-04-30)

### Models

| Model | Stores | Status |
|---|---|---|
| `Objective` | OKR root + embedded `key_results[]` | ✅ Canonical (root); `key_results[]` deprecated |
| `KeyResult` | KRs in standalone collection (S22 #176, dual-written by E #190) | ✅ Canonical (cutover target) |
| `WeeklyGoal` | Weekly goals tied to a `KeyResult` (S22 #176) | ✅ Canonical (cutover target) |
| `Move` | Daily behaviors under WeeklyGoal | ✅ Canonical |
| `Goal` | Legacy quarterly + weekly goals (`time_period: QUARTERLY \| WEEKLY \| MONTHLY`) | ⚠️ Legacy — retire in Phase B/C |

### Routes

```
┌─ OBJECTIVES ─────────────────────────────────────────────┐
│ /api/objectives          ← canonical CRUD + dashboard    │
│ /api/objective-wizard    ← 3-screen wizard (Epic E)      │
│ /api/ai-okr              ← legacy AI generation flow     │ ← OVERLAP
└──────────────────────────────────────────────────────────┘
┌─ GOALS / WEEKLY ─────────────────────────────────────────┐
│ /api/goals               ← LEGACY Goal model CRUD        │
│   ├─ /quarterly/...                                      │
│   └─ /weekly/...         ← deprecated by Phase A         │
│ /api/weekly-goals        ← NEW canonical (Phase A reads) │
│ /api/planning            ← orchestration (weeks+tasks)   │ ← OVERLAP
└──────────────────────────────────────────────────────────┘
```

### Services

| Service | Purpose | Status |
|---|---|---|
| `aiOKRService` | Cascade generator: `generateKRs / generateWeeklyGoals / generateMoves` + cascade cap | ✅ Canonical |
| `AIObjectivePlanner` | Older single-objective planner | ⚠️ Overlaps `aiOKRService` |
| `objectiveService` | Dashboard + CRUD orchestration | ✅ Canonical |

---

## Phased retirement plan

### ✅ Phase A — Read-side consolidation (Sprint 23 #191, DONE)

**What shipped**:
- `GET /api/weekly-goals/:keyResultId` is now a **UNION READ** across new `WeeklyGoal` AND legacy `Goal{WEEKLY}`. Both sources project to a single normalized shape with a `_source: 'new' | 'legacy'` tag.
- Legacy weekly entries are mapped from `(year, quarter='Q1..Q4', week=1..13)` → ISO 8601 `(target_year, target_week)` so legacy + new align on the same scaffold (see `legacyWeekToISO()` in [server/routes/weekly-goals.js](../../server/routes/weekly-goals.js)).
- Frontend [planning-v2.js](../../client/pages/scripts/planning-v2.js) `loadWeeklyGoals()` now reads **only** `/api/weekly-goals/:krId`. Legacy `/api/goals/weekly/by-kr/:keyResultId` remains alive (read-only) but is unused by the new planning page.
- Deprecation notice added to [server/routes/goals.js](../../server/routes/goals.js) `/api/goals/weekly/*` section pointing to this plan.

**Why it shipped this way**:
- Continuity for users with legacy data (assignments, tasks, progress all live in legacy `Goal{WEEKLY}` for existing tenants)
- Clean cutover signal for future sprints (frontend already has one endpoint)
- Zero migration risk for Beta

**Test**: `scripts/test-sprint23-191-planning-page.js` — 71/71 green (incl. legacy → ISO mapping, sort order, source tags, cross-tenant guard).

---

### ⏳ Phase B — Write-side cutover (Sprint 24, post-Beta)

**Scope (~6 pts)**:
1. Remove `POST/PUT/DELETE` callers from frontend that hit `/api/goals/weekly/*`. Find via grep:
   ```
   grep -rnE "/api/goals/weekly/(?!by-kr/)|method:\s*['\"](POST|PUT|DELETE)['\"]" client/
   ```
2. Stop writes on legacy `/api/goals/weekly/*` (return 410 Gone for POST/PUT/DELETE; preserve GETs for read-only access until Phase C)
3. Idempotent migration script `scripts/migrate-legacy-weekly-to-new.js`:
   - For each `Goal{time_period:'WEEKLY', status: { $ne: 'cancelled' }}`, create matching `WeeklyGoal` doc using `legacyWeekToISO()` (port helper from union read into shared `services/WeeklyGoalConsolidation.js`)
   - Run with `--dry-run` first; expect 1:1 mapping
   - Mark legacy docs with `_migrated_to: <new_id>` so Phase C delete is safe
4. Update assignment dropdown handler ([planning-v2.js:1883 assignWeeklyGoal](../../client/pages/scripts/planning-v2.js#L1883)) to PUT against `/api/weekly-goals/:id` for `_source === 'new'` entries
5. Drop the embedded `Objective.key_results[]` dual-write from `POST /api/objectives` and `POST /api/objective-wizard/finalize` (keep schema field — read-only for migration), make standalone `KeyResult` the sole write target

**Pre-requisites**:
- Beta launch shipped (no churn risk on first 10 customers)
- Telemetry showing `/api/weekly-goals/:krId` `sources.legacy` count trending toward zero on active tenants

**Risk**: Medium. Legacy data integrity must be verified via the migration script's dry-run output. Needs a rollback plan (preserve legacy collection until Phase C).

**Sprint 24 backlog ticket**: `S24-CONSOLIDATION-PHASE-B`

---

### ⏳ Phase C — Retirement (Sprint 25)

**Scope (~3 pts)**:
1. Delete `/api/goals/weekly/*` route block ([server/routes/goals.js:1216-1567](../../server/routes/goals.js#L1216-L1567))
2. Delete legacy weekly entries from production DB:
   ```
   db.goals.deleteMany({ time_period: 'WEEKLY', _migrated_to: { $exists: true } })
   ```
3. Delete `/api/planning/goals/weekly` (overlaps `/api/weekly-goals/`)
4. Delete embedded `Objective.key_results[]` field entirely (drop the schema field; collection-side cleanup migration drops the array)
5. Audit `/api/ai-okr/*` callers — if all paths route through `objective-wizard` or canonical `objectives.generate-krs`, retire `/api/ai-okr/*` and `AIObjectivePlanner.js`
6. Drop `legacyWeekToISO()` projection from union read; `GET /api/weekly-goals/:keyResultId` now reads from `WeeklyGoal` collection only

**Pre-requisites**:
- Phase B telemetry shows zero callers on legacy endpoints for 2 sprints
- All tenants migrated (verify via `db.goals.countDocuments({ time_period:'WEEKLY' })` on prod)

**Risk**: Low. Pure cleanup if Phase B was clean.

**Sprint 25 backlog ticket**: `S25-CONSOLIDATION-PHASE-C`

---

## Detection queries

When evaluating whether to advance phases:

```bash
# Tenants still using legacy weekly writes
grep -rnE "/api/goals/weekly/(?!by-kr/)" client/ | grep -vE "^\s*//"

# Frontend pages still reading legacy
grep -rn "/api/goals/weekly/by-kr" client/

# Production: tenants with mixed sources
# (run against MongoDB — sources.legacy > 0 on /api/weekly-goals telemetry)

# Production: how much data remains in legacy
db.goals.aggregate([
  { $match: { time_period: 'WEEKLY' } },
  { $group: { _id: '$company_id', n: { $sum: 1 } } }
])
```

---

## Open questions for Phase B

1. **Frequency mapping**: legacy `Goal{WEEKLY}` doesn't have a `frequency` field. The new `WeeklyGoal` defaults to `'once'`. Migration sets `frequency='once'` for all legacy → new copies. Is that the right default?
2. **Tasks**: legacy `Goal{WEEKLY}` has `Task` children. New `WeeklyGoal` cascades to `Move`. Phase B migration script must decide: leave Tasks attached to legacy Goals (read-only) or migrate to Moves? Recommend the former until Move semantics stabilize.
3. **Progress percentage**: legacy stores `progress_percentage`; new uses a virtual `completion_rate` computed from `completions[]`. Migration must seed a synthetic `completions[]` entry for in-progress legacy goals.

These answers should be written into the Phase B sprint plan when the work is scheduled.

---

**Last Updated**: 2026-04-30 (Phase A shipped in #191)
