# Cleanup Registry — Deferred Destructive Work

<!-- @GENOME T2-OPS-001 | ACTIVE | 2026-05-11 | parent:T0-GOV-001 | auto:- | linked:/audit,/strategy -->

**Owner**: Sprint Cleanup (scheduled **post-S28/S29**, after Beta launch + 50-100 real-user validation)
**Created**: Sprint 25 Day 12 #224 (PX-3.21)
**Purpose**: single source of truth for every code/data deletion target deferred out of Sprint 25, so the future cleanup sprint is mechanical.
**Rollback recipes**: [MIGRATION_ROLLBACK_PLAYBOOK.md](MIGRATION_ROLLBACK_PLAYBOOK.md) (PX-3.11) — pre-flight backup procedure, per-target rollback recipes (transactional script + restore-from-backup variants), operational guardrails.

## How this registry works

Every entry has a **stable ID** (`PX-3.X` from Sprint 25 master plan, or new IDs for sweep-found items). Every code site has a matching grep-able marker `// CLEANUP-TARGET: <ID>` inline at the file. The audit script `scripts/audit-cleanup-targets.js` cross-checks that:
- every inline marker has a registry entry
- every registry entry whose `kind` is `code` has at least one inline marker
- (data-only entries are exempt from the inline-marker check)

To find every cleanup site in the codebase:
```bash
grep -rn "CLEANUP-TARGET:" server/ scripts/ client/ KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/ 2>/dev/null
# or
npm run audit:cleanup-targets
```

## Execution guardrails (when the cleanup sprint runs)

1. **Verify all listed prereqs are still satisfied** (PX-3.6 macro sealed, PX-3.7 migration script wired, no new embedded writes since 2026-05-11).
2. **Re-run the dry-run audit** (`migrate:legacy-weekly:dry-run`) — confirm `_migrated_to` stamps exist where expected before any `deleteMany`.
3. **Execute in registry order**: route blocks (`410 Gone`) → endpoint deletes → data deletes → fallback-reader removals → schema field drop. Schema drop is ALWAYS last and ALWAYS its own commit.
4. **Per-target safety check**: each entry below lists "kill switch" — re-confirm nothing reads/writes the target before deleting.

---

## Entries

> **Rollback note**: Every recipe below has a corresponding entry in [MIGRATION_ROLLBACK_PLAYBOOK.md](MIGRATION_ROLLBACK_PLAYBOOK.md). Recipe numbering there matches the IDs here (PX-3.7 → Recipe 1, PX-3.8 → Recipe 2, etc.). For destructive steps lacking transactional rollback (PX-3.15, PX-3.18 data-side), the playbook's pre-flight backup section is REQUIRED.


### PX-3.8 — Block legacy weekly write endpoints (410 Gone)

| Field | Value |
|---|---|
| Kind | code (route-level 410-Gone block) |
| Target | `server/routes/goals.js` POST/PUT/DELETE handlers in the `/weekly/*` block |
| Line range (at 2026-05-11) | L1453-1652 (POST `/weekly` L1456; PUT `/weekly/:id` L1515; DELETE `/weekly/:id` L1614) |
| Reason | Sprint 22 introduced canonical `WeeklyGoal` collection at `/api/weekly-goals/*`. The `/api/goals/weekly/*` writes are pre-Sprint-22 legacy duplicates that produce `Goal{time_period:'WEEKLY'}` rows the rest of the codebase already treats as legacy via the union read. |
| Prereqs | PX-3.6 macro ✅ (sealed Day 11 #221); PX-3.7 migration script ✅ (sealed Day 12 #223) |
| Kill switch (run before delete) | `grep -rn "/api/goals/weekly" client/ server/` — confirm no FE caller hits the legacy endpoints. Sprint 23 #191 cutover moved reads to `/api/weekly-goals/:keyResultId`; writes need a parallel sweep. |
| Risk if executed today | LOW. No new writes have hit `Goal{WEEKLY}` since Sprint 22 cutover (FE moved to new endpoints). 410-Gone is the minimum-blast-radius step before PX-3.14 deletes the handler bodies. |

### PX-3.14 — Delete `/api/goals/weekly/*` route block entirely

| Field | Value |
|---|---|
| Kind | code (delete the deprecated route block) |
| Target | `server/routes/goals.js` L1241-1652 (banner at L1241 + GET/POST/PUT/DELETE handlers) |
| Reason | Once PX-3.8 has blocked writes for the entire post-Beta validation window with zero hits, the handler bodies are dead code. Delete reduces route-tree noise + removes the legacy `Goal{WEEKLY}` reader paths. |
| Prereqs | PX-3.8 ✓ + observation window with zero 410-Gone hits during 50-100 user pilot |
| Kill switch | confirm no caller (FE / cron / engines) has tripped the 410 in the pilot window |

### PX-3.15 — Delete legacy weekly Goal rows

| Field | Value |
|---|---|
| Kind | data (mongo deleteMany) |
| Target | `db.goals.deleteMany({ time_period: 'WEEKLY', _migrated_to: { $exists: true } })` |
| Reason | Once PX-3.7 migration has been executed against production and every legacy weekly row carries `_migrated_to`, the original row is redundant — `WeeklyGoal` is the canonical home. |
| Prereqs | PX-3.7 migration executed in production ✓ + PX-3.13 verification ✓ + PX-3.14 ✓ |
| Kill switch | re-run dry-run; if it returns >0 candidates, ABORT (means a new write slipped through PX-3.8). |
| Boundary | data-only; no inline code marker. |

### PX-3.16 — Delete `/api/planning/goals/weekly` endpoint

| Field | Value |
|---|---|
| Kind | code (delete planning-page legacy weekly endpoint) |
| Target | `server/routes/planning.js` POST `/goals/weekly` (L308-403) + GET `/goals/weekly` (L409-~478) |
| Reason | Sprint 23 #191 union-read consolidated reads at `/api/weekly-goals/:keyResultId`. The planning-page POST + GET legacy endpoints have been superseded by the WeeklyGoal canonical endpoints. |
| Prereqs | PX-3.14 ✓ (no overlap with goals.js endpoint deletes; can ship in same commit or separately) |
| Kill switch | `grep -rn "/api/planning/goals/weekly" client/` — confirm no FE caller |

### PX-3.17 — Drop `legacyWeekToISO()` + `projectLegacyGoal()` + union-read fallback

| Field | Value |
|---|---|
| Kind | code (delete helpers + collapse union read to single source) |
| Target | `server/routes/weekly-goals.js`: `legacyWeekToISO()` (L67-99), `projectLegacyGoal()` (L112-148), `legacyGoals` branch in GET (L222-255). Also callers in `routes/consultant.js`, `client/pages/scripts/planning-v2.js`, `scripts/test-sprint23-191-planning-page.js`. |
| Reason | Once PX-3.15 deletes the legacy `Goal{WEEKLY}` rows, the union-read no longer has a legacy half to project. Drop the helpers + the union → single-source read directly from `WeeklyGoal`. |
| Prereqs | PX-3.15 ✓ |
| Kill switch | confirm `db.goals.countDocuments({ time_period: 'WEEKLY' })` returns 0 |

### PX-3.18 — Drop embedded `Objective.key_results[]` schema field + fallback readers

| Field | Value |
|---|---|
| Kind | code (schema field drop + every fallback reader) |
| Schema target | `server/models/Objective.js` L163-218 (the embedded `key_results: [{...}]` subdoc schema) |
| Fallback-reader targets (collection-first → drop embedded fallback after standalone collection becomes sole source) |
| ↳ `server/routes/planning.js` | L777, L1345 — `keyResult = objective.key_results.id(key_result_id);` embedded fallback (PX-3.6f-retained) |
| ↳ `server/routes/moves.js` | embedded fallback retained per PX-3.6g comment at L21 |
| ↳ `server/services/ObjectiveKeyResultsView.js` | L113 — embedded array fallback (designed to be retired with PX-3.18; entire helper may become a thin re-export of `KeyResult.find()`) |
| ↳ `server/services/AIContextService.js` | L1059 (`objective.key_results.find(...)` embedded fallback per PX-3.6j-2), L1092 (`krCount` source) |
| ↳ `server/services/MoveDashboardService.js` | L88 — embedded array source for KR list |
| ↳ `server/services/iBrainService.js` | L262 — `const keyResults = objective.key_results \|\| []` |
| ↳ `server/services/cascade-engine.js` | L172, L359 — `objective.key_results` consumed by orchestration |
| Reason | Sprint 25 PX-3.6 macro sealed every embedded **write** surface (objectives.js + ai-okr.js × 5 + objective-wizard.js + objectiveService.js). The remaining embedded **read** sites are collection-first + embedded-fallback by design — they keep pre-Sprint-22 data readable while the standalone `KeyResult` collection is the sole new home. PX-3.7 backfill (when executed in production) ensures every legacy KR has a standalone row. After that, the embedded fallback is dead weight + the schema field can be dropped. |
| Prereqs | PX-3.6 macro ✅ + PX-3.7 migration executed in prod + PX-3.13 verification ✓ + every fallback-reader migrated to collection-only (drift-lock per reader, mirror of PX-3.6 slice pattern) |
| Kill switch | `db.objectives.aggregate([{ $match: { 'key_results.0': { $exists: true } } }, { $count: 'remaining' }])` — must return 0 before schema field drop |
| Risk | HIGHEST in registry. One-way schema drop. Schema-validation breakage propagates everywhere. **Single commit, schema-drop ONLY, no other changes in same commit.** |
| Test artifacts that read embedded (out of scope for code-cleanup but flagged for the cleanup sprint to update) | `server/migrations/sprint2-goal-migration.js:76`, `server/tests/test-goal-hierarchy.js:51,83`, `server/tests/setup-test-data.js:134,147`, `server/tests/test-sprint2-features.js:121,123`, `server/scripts/testWeek4API.js:341` |

---

## Boundaries summary

```
Sprint Cleanup (post-S28/S29) execution order:

  1. PX-3.8       → 410 Gone on legacy weekly writes
                       │
                       ▼ observation window (zero 410 hits)
  2. PX-3.14      → delete /api/goals/weekly/* handler bodies
  3. PX-3.16      → delete /api/planning/goals/weekly endpoints
                       │
                       ▼
  4. PX-3.7 prod  → execute migration script against production
  5. PX-3.13      → verify migration completeness
                       │
                       ▼
  6. PX-3.15      → deleteMany legacy Goal{WEEKLY} rows
  7. PX-3.17      → drop legacyWeekToISO + projectLegacyGoal + union-read collapse
                       │
                       ▼
  8. PX-3.18-prep → per-reader migration (planning.js × 2, moves.js, ObjectiveKeyResultsView,
                    AIContextService × 2, MoveDashboardService, iBrainService, cascade-engine × 2)
                    — each one drift-locked, mirror of PX-3.6 slice pattern
                       │
                       ▼
  9. PX-3.18      → drop embedded Objective.key_results[] schema field (single commit, schema-only)
```

---

## When to revisit this registry

- **Every sprint planning session** between now and the cleanup sprint: verify no new embedded `Objective.key_results[]` writes have crept in (mirrors PX-1.11 audit pattern).
- **Just before Beta launch**: re-run the dry-run audit on production to size the migration.
- **Cleanup sprint kickoff**: re-read this file; bring all entries' "prereqs" and "kill switch" lines to the planning table.
