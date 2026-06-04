# Test Plan Stubs — Sprint 22

<!-- @GENOME T3-SPR-022-PW-TS | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

Per-epic test outlines. Every epic must merge with these tests passing or be explicitly waived.

**Categories** (existing harness):
- Unit (Jest)
- Integration (Jest + supertest, MongoMemoryServer)
- BST (Business Scenario Tests, Playwright)
- Multi-tenancy (cross-tenant negative tests)

---

## Epic A — Data Models & Disciplines

### Unit
- `KeyResult` validation: required fields enforced; enum bounds (metric_type, status); virtual `progress_percentage` computes correctly at 0%, 50%, 100%, >100% (clamps).
- `WeeklyGoal` validation: frequency enum; completions sub-doc shape; `addCompletion(week, year, data)` updates existing or appends; virtual `completion_rate` for `once` vs recurring.
- `Move` validation: move_type enum; discipline enum from config; `streak` computes from sorted completions; `complete()` sets timestamp.
- `disciplines.js`: `getDisciplineIds()` returns 9; `getDisciplineById('truth')` returns full record; invalid id returns null.

### Integration
- `GET /api/disciplines` requires auth, returns 9 disciplines.
- `GET /api/disciplines/dropdown` returns dropdown shape.
- Objective virtual: existing Objective with embedded `key_results[]` still loads; new code can populate `key_results_v2`.

### Multi-tenancy
- KeyResult write requires `company_id`; query without it returns empty.

---

## Epic B — AIContextService Extension

### Unit
- Each provider's `getData()` returns expected shape.
- Each provider's `getFallback()` returns safe default (no DB call).
- `assembleContext('kr-generation', {company_id})` invokes 4 providers in order, returns `{company, assessment, discipline, objective, _meta}`.
- Provider error → `_meta.errors` populated; other providers still resolve.
- Cache hit (within TTL) → no DB call (mock spy).
- Cache miss / TTL expired → DB call.

### Integration
- Server boot calls `initializeProviders()`; all 6 providers registered.
- Existing `getCompanyProfile`, `getLatestSSIScores`, `getFullSSIScores` callers unaffected.

---

## Epic C — My Clients

### Unit
- `riskStatus` formula (per D-C-5): zero clients, single healthy, single urgent edge cases.
- KPI math: avgSSI rounds correctly; needAttention = atRisk + urgent.
- Stage filter + search combine: results match intersection.

### Integration
- `GET /portfolio-kpis` returns 4 metrics.
- `GET /portfolio-summary` returns extended shape (stage, primaryContact, objectives breakdown, riskStatus, lastActivity).
- `POST /clients` creates Company + pushes to `managed_businesses` + creates default Team (D-C-6) + sends welcome email if checkbox set (D-C-8).
- `POST /clients/enrich` honors 3s timeout; returns 504 with `{error:"enrich_unavailable"}` on failure.

### Playwright
- My Clients page renders for CONSULTANT; KPI header + tile grid + donut + objectives bar visible.
- Add Client wizard happy path: name + website → AI loading state → review screen with AI badge pills → confirm → toast → tile appears.
- Manual fallback: click "Skip AI" → blank Step 2 → fill required → confirm.
- Search by name; filter by stage; combined.
- Nudge dropdown opens; "Send Reminder" closes dropdown (stub action).

### Multi-tenancy
- Consultant A cannot read consultant B's clients (portfolio-summary, portfolio-kpis return only own).
- Non-CONSULTANT role cannot call `/api/consultant/*` (403).

---

## Epic D — Assessment Hub

### Unit
- `identifyConstraint()` returns lowest sub-dimension; tie-breaking deterministic (D-D-3).
- Detailed results returns sub_dimensions when present, omits when absent.
- groupByMonth handles empty array, single month, partial current month (D-D-5).

### Integration
- `GET /trends?period=12months` groups by month.
- `GET /compare?id1=&id2=` rejects cross-tenant ids (403).
- Existing assessments without sub_dimensions still load (read-side compat).

### Playwright
- Tabs 4, 5, 6 render and switch.
- Trends chart draws with stub data (Chart.js loaded).
- Compare deltas color-coded (positive green, negative red).
- Tab filters (team, period) update view.

---

## Epic E — Objective Wizard

### Unit
- `validateCurrentStep()` per step: title length, behavior cap, KR count.
- Behavior selection cap (5 max) disables remaining checkboxes.
- Wizard state machine transitions: forward only past validation; back preserves data.

### Integration
- `POST /objectives` extended payload creates Objective AND N KeyResult docs in separate collection.
- `POST /generate-krs` calls Epic F service; returns KRs + guidance.
- AI failure → template fallback returned with `ai_generated: false`.
- KeyResult collection writes are tenant-scoped.

### Playwright
- Full happy path: 3 screens, AI generate, save → toast.
- Manual KR entry path.
- SSI auto-suggest pre-fills if user has assessment with constraint (D-E-8).
- Behavior selector grouped by foundation (D-A-5 / D-E-3).

### Multi-tenancy
- Cross-tenant Objective POST rejected.

---

## Epic F — aiOKRService Extension

### Unit
- Each `generate*` method handles: AI success, AI fail (fallback), OpenAI disabled (immediate fallback).
- `parseCascadeResponse('kr', validJson)` normalizes shape.
- `parseCascadeResponse('kr', invalidJson)` throws and is caught by caller.
- `parseJSONResponse` extracts JSON from markdown code block, raw JSON object, or pure JSON.
- `enrichCompany({name, website})`: returns expected shape; in-memory cache hits within 24h.
- `enrichCompany` 3s timeout via AbortController → throws EnrichUnavailableError.

### Integration
- `aiGenerationLimiter` blocks 11th request in window.
- `callOpenAIWithRetry` retries on 429/5xx (one retry); fails on 4xx other.

### Backwards compat
- `generateOKRsFromAssessment` still works.

---

## Epic G — Dashboard V3 + Theme

### Visual regression
- dashboard-v2.html post-change matches V3 mockup (Playwright screenshot diff).
- 4 other live pages (objectives, planning-v2, assessment-hub, teams) unaffected by `--karvia-primary` alias.

### Smoke
- Dashboard loads for each role (CONSULTANT, BO, EXEC, MANAGER, EMPLOYEE) where allowed.

### Playwright
- Card postpone popover opens; date-picker constrained to KR period.
- Assign popover groups by client for CONSULTANT, by team for others.
- Catch-up tile expands inline; group collapse/expand persists per group.

### Grep
- `git grep -E '#8B5CF6|bg-purple|text-purple'` returns zero hits in `client/`.

---

## Epic H — Planning Page

### Unit
- `getQuarterWeeks(2026, 2)` returns 13 weeks; Q1 returns 13 (or 14) per ISO calendar.
- `groupWeeksByMonth` correctly assigns boundary weeks (D-H-1).
- `expandCurrentMonth` toggles correct group based on user timezone (D-H-4).

### Playwright
- Month groups collapse/expand independently.
- Quarter tabs change view; current month auto-expands.
- AI preset (4/8/12 weeks) buttons render; clicking calls Epic F endpoint or stubs.

### Smoke
- Page loads for CONSULTANT, BO, EXEC roles.

---

## Cross-Cutting Test Hygiene

- Every new endpoint MUST have a tenant-isolation negative test.
- Every new Mongoose model MUST have a required-field unit test.
- Every new AI integration MUST have a fallback-path test.
- Every UI page MUST have a smoke render test for each allowed role.
- BST suite must include at least one end-to-end "consultant onboards a new client → creates objective → adds weekly goals → completes a move" journey by end of Sprint 22.

---

## Test Execution Gates

| Gate | When | Pass criteria |
|------|------|---------------|
| Per-PR | each merge | unit + integration + lint + grep checks pass |
| Per-Epic | epic complete | full epic test plan green; tenant isolation tests added |
| Sprint exit | week 6 day 5 | full BST + Playwright suite green; visual regression diff under threshold; zero P0/P1 bugs open |
