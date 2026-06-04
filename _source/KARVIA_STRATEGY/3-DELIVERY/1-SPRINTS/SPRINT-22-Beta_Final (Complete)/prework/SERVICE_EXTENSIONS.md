# Service Extensions — Sprint 22

<!-- @GENOME T3-SPR-022-PW-SE | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

Method-level audit of every service extended in Sprint 22.

---

## AIContextService (Epic B)

**File**: `server/services/AIContextService.js`

### EXISTING methods (verified in code, do NOT touch)

| Method | Line | Used by |
|--------|------|---------|
| `buildObjectiveContext(companyId, objectiveData)` | 129 | existing AI flows |
| `getCompanyProfile(companyId)` | 257 | existing |
| `extractBusinessContext(company)` | 281 | internal helper |
| `identifyRiskIndicators(company)` | 310 | internal helper |
| `getIndustryLabel(industryKey)` | 399 | internal helper |
| `getLatestSSIScores(companyId)` | 412 | existing |
| `getFullSSIScores(companyId, options)` | 455 | existing |
| `getCompanyProfileSSIFallback(companyId)` | 575 | internal fallback |
| `_getDimensionScore(assessment, dimension)` | 623 | internal helper |

> **Epic B's spec falsely claims `buildContext()` and `getActiveObjectives()` exist. They do NOT.** Spec must be corrected during Phase 8 patch (D-B-1).

### NEW methods (add)

| Method | Signature | Purpose |
|--------|-----------|---------|
| `registerProvider(name, provider)` | (string, {getData, getFallback?}) | provider registry |
| `assembleContext(operation, params)` | async (string, object) → Promise<context> | operation-driven assembly |
| `getDisciplines()` | () → Array | reads `disciplines.js` |
| `initializeProviders()` | async () | wires all 6 providers at boot |
| `_getProviderCache(key)` | private (string) → any | cache get |
| `_setProviderCache(key, data, ttl)` | private (string, any, number) | cache set |
| `invalidateProviderCache(pattern)` | (string) → void | invalidate matching keys |

### NEW operation configs

| Operation | Providers | Cache TTL |
|-----------|-----------|-----------|
| `objective-creation` | company, assessment, discipline | 300s |
| `kr-generation` | company, assessment, discipline, objective | 300s |
| `weekly-goal-creation` | company, keyResult, discipline | 180s |
| `move-generation` | company, weeklyGoal, discipline | 120s |

### NEW providers (separate files)

| Provider | File | Reads from |
|----------|------|------------|
| CompanyProvider | `server/services/providers/CompanyProvider.js` | Company.findById |
| AssessmentProvider | `server/services/providers/AssessmentProvider.js` | Assessment.findOne (latest) |
| DisciplineProvider | `server/services/providers/DisciplineProvider.js` | `config/disciplines.js` |
| ObjectiveProvider | `server/services/providers/ObjectiveProvider.js` | Objective.find (active) |
| KeyResultProvider | `server/services/providers/KeyResultProvider.js` | KeyResult.find |
| WeeklyGoalProvider | `server/services/providers/WeeklyGoalProvider.js` | WeeklyGoal.find |

---

## aiOKRService (Epic F)

**File**: `server/services/aiOKRService.js`

### EXISTING methods (verified, do NOT remove)

| Method | Line | Used by |
|--------|------|---------|
| `constructor()` | 14 | service init |
| `generateOKRsFromAssessment(assessmentId, options)` | 45 | existing OKR-from-assessment flow |
| `buildContext(weakAreas, assessment, options)` | 125 | existing |
| `getIndustryFocus(industry)` | 192 | helper |
| `getRoleContext(role)` | 207 | helper |
| `getSizeCategory(employeeCount)` | 221 | helper |
| `generateWithAI(context, options)` | 233 | existing AI generation |
| `generateWithTemplate(context, options)` | 326 | existing template |
| `buildSystemPrompt()` | 334 | helper |
| `buildUserPrompt(context)` | 370 | helper |
| `generateFromTemplates(context)` | 423 | helper |
| `createTemplateObjective(...)` | 462 | helper |
| `validateOKRs(okrs)` | 529 | validation |

### NEW methods (add)

| Method | Signature | Owner Use |
|--------|-----------|-----------|
| `generateKRs(params, context)` | async ({title, category, discipline_ids, ssi_impact}, context) → {key_results, guidance} | Epic E |
| `generateWeeklyGoals(params, context)` | async ({key_result_id, target_week}, context) → {weekly_goals} | Epic H |
| `generateMoves(params, context)` | async ({weekly_goal_id, discipline}, context) → {moves} | Epic G/E |
| **`enrichCompany({ name, website })`** | async (object) → {industry, ..., confidence} | **Epic C** (was missing from Epic F) |
| `buildCascadePrompt(type, params, context)` | private (kr\|weekly\|move\|enrich, object, object) → string | internal |
| `parseCascadeResponse(type, response)` | private (string, string) → object | internal |
| `parseJSONResponse(response)` | private (string) → object | extracts JSON from markdown |
| `callOpenAIWithRetry(prompt, attempt?)` | private async (string, number) → string | retry on 429/5xx |
| `generateKRsFromTemplate(params, context)` | (object, object) → {key_results, guidance} | fallback |
| `generateWeeklyGoalsFromTemplate(params, context)` | (object, object) → {weekly_goals} | fallback |
| `generateMovesFromTemplate(params, context)` | (object, object) → {moves} | fallback |
| `parseNumber(value)` | (any) → number | helper |

### `enrichCompany` Detail (D-F-1 closure)

```javascript
async enrichCompany({ name, website }) {
  // 1. Cache check (24h TTL by `${name}|${website||'null'}`)
  const cacheKey = `enrich:${name}|${website || 'null'}`;
  const cached = this._enrichCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < 86400_000) return cached.data;

  // 2. If !isOpenAIEnabled OR no web-search-tool model → return template stub with confidence: 0
  // 3. Build prompt with web-search tool config
  // 4. callOpenAIWithRetry with 3s timeout (AbortController)
  // 5. parseCascadeResponse('enrich', response)
  // 6. Cache result; return
  // 7. On error/timeout → throw EnrichUnavailableError (route returns 504)
}
```

**Cache choice**: in-memory Map (D-F-2). Lost on restart — acceptable. Optional Redis upgrade later.

---

## ValidationService (no Sprint 22 change)

`server/services/ValidationService.js` is referenced by existing goal validation. Sprint 22 NEW models (KeyResult, WeeklyGoal, Move) use Mongoose schema validation only — no extension needed. If KeyResult cross-record rules emerge (e.g. quarter overlap), add post-Sprint 22.

---

## DateService (Epic H verification)

`server/services/DateService.js` already provides:
- `getQuarterForDate(date, objectiveId?)`
- `getQuarterDates(year, quarter, objectiveId?)`

**Verify before Epic H**:
- `getQuarterWeeks(year, quarter)` — exists OR add
- `getWeekStart(date)` — exists OR add
- `addDays(date, n)` — exists OR add

If absent, ADD as part of Epic H Phase 1.

---

## Server Initialization (server/index.js)

Add after DB connection:
```javascript
const AIContextService = require('./services/AIContextService');
const aiOKRService = require('./services/aiOKRService');

mongoose.connection.once('open', async () => {
  await AIContextService.initializeProviders();
  // aiOKRService is already initialized in its constructor; no boot step needed
  console.log('✓ AIContextService providers initialized');
});
```

Route mounts to add:
```javascript
app.use('/api/disciplines', require('./routes/disciplines'));      // Epic A
app.use('/api/key-results', require('./routes/key-results'));      // NEW (E)
app.use('/api/weekly-goals', require('./routes/weekly-goals'));    // NEW (H/E)
app.use('/api/moves', require('./routes/moves'));                  // NEW (G/E)
```
