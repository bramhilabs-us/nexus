# Inventory — Epic B: AIContextService Extension

<!-- @GENOME T3-SPR-022-PW-IB | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_B_ORCHESTRATOR.md](../epics/EPIC_B_ORCHESTRATOR.md)
**Points**: 10

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| Provider registry | 🆕 new | none | ADD to `AIContextService.js` |
| Operation-based context assembly | 🆕 new | none | ADD `assembleContext(operation, params)` |
| Provider cache (5-min) | 🆕 new | none | ADD `_getProviderCache`/`_setProviderCache` |
| Company context provider | 🔧 extend | `getCompanyProfile(companyId)` at line 257 | WRAP existing logic into `CompanyProvider.getData()` |
| Assessment context provider | 🔧 extend | `getLatestSSIScores(companyId)` at line 412, `getFullSSIScores` at line 455 | WRAP into `AssessmentProvider.getData()` |
| Discipline provider | 🆕 new | n/a (config-only) | NEW `DisciplineProvider` reads from `disciplines.js` (Epic A) |
| Objective provider | 🆕 new | none in AIContextService | NEW `ObjectiveProvider` |
| KeyResult provider | 🆕 new | KeyResult model itself is new (Epic A) | NEW `KeyResultProvider` |
| WeeklyGoal provider | 🆕 new | WeeklyGoal model itself is new (Epic A) | NEW `WeeklyGoalProvider` |

---

## ⚠️ Critical Spec Mismatch

Epic B's "EXISTING METHODS" claim does **NOT** match `server/services/AIContextService.js`:

| Epic B claims exists | Actually in code |
|----------------------|------------------|
| `buildContext(companyId, options)` | ❌ Does NOT exist. Method is `buildObjectiveContext(companyId, objectiveData)` (line 129) |
| `getActiveObjectives(companyId)` | ❌ Does NOT exist |
| `getCompanyProfile(companyId)` | ✅ exists (line 257) |
| `getLatestSSIScores(companyId)` | ✅ exists (line 412) |
| `getFullSSIScores(companyId, options)` | ✅ exists (line 455) |

Other existing methods Epic B doesn't mention:
- `extractBusinessContext(company)` (line 281)
- `identifyRiskIndicators(company)` (line 310)
- `getIndustryLabel(industryKey)` (line 399)
- `getCompanyProfileSSIFallback(companyId)` (line 575)
- `_getDimensionScore(assessment, dimension)` (line 623)

**Action**: Epic B's "Backwards Compatibility" section needs to reference the actual existing methods, not fictional ones.

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `server/services/AIContextService.js` | 1-700+ | 9 existing methods (see above) | EXTEND with `registerProvider`, `assembleContext`, `getDisciplines`, `initializeProviders`, cache helpers |
| `server/index.js` | startup | n/a | ADD `await AIContextService.initializeProviders()` after DB connection |
| `server/config/disciplines.js` | n/a | created in Epic A | CONSUMED by DisciplineProvider |

**Note**: AIContextService is exported as a singleton (need to verify — check `module.exports = new AIContextService()` vs `module.exports = AIContextService`). If class export, `initializeProviders` must be called on the same instance the routes use.

---

## Net-New Files

```
server/services/providers/index.js              NEW
server/services/providers/CompanyProvider.js    NEW
server/services/providers/AssessmentProvider.js NEW
server/services/providers/DisciplineProvider.js NEW
server/services/providers/ObjectiveProvider.js  NEW
server/services/providers/KeyResultProvider.js  NEW (depends on Epic A KeyResult model)
server/services/providers/WeeklyGoalProvider.js NEW (depends on Epic A WeeklyGoal model)
```

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| B-1 | Epic B "EXISTING METHODS" list is fictional — must be rewritten to match reality | DECISIONS_LOG.md → D-B-1 |
| B-2 | Singleton vs class — confirm AIContextService export shape and where `initializeProviders` must be called | DECISIONS_LOG.md → D-B-2 |
| B-3 | DisciplineProvider in Epic B uses `disciplines.getAll()`; Epic A's config exports `DISCIPLINES` array + helpers — align API surface | DECISIONS_LOG.md → D-B-3 |
| B-4 | AssessmentProvider in Epic B selects `ssi_result.overall` and `overall_scores` — actual Assessment model has BOTH `ssi_scores.{speed,strength,intelligence}.score` AND `ssi_result.overall.score`. Pick canonical path | DECISIONS_LOG.md → D-B-4 |
| B-5 | Cache invalidation: Epic B exposes `invalidateProviderCache(pattern)` but no spec defines who calls it (write-time? cron?) | DECISIONS_LOG.md → D-B-5 |

---

## Acceptance-Criteria Coverage Audit

Current AC (9 items) covers: extension methods, 6 providers, config, caching, fallback, init, backwards compat, operation configs. **Gap**: no AC for cache invalidation, no AC for provider failure error contract (does `assembleContext` throw or return partial?). Add 2 AC items.

---

## Test-Plan Stub

- Unit: each provider's `getData()` returns expected shape; `getFallback()` returns safe default
- Unit: `assembleContext` for each operation returns all configured providers populated
- Unit: cache hit → no DB call; cache miss → DB call; TTL expiry → re-fetch
- Unit: provider error → fallback used + `_meta.errors` populated
- Integration: server boot calls `initializeProviders()`, all 6 providers registered
- Backwards compat: existing `getCompanyProfile`, `getLatestSSIScores`, `getFullSSIScores` callers still work
