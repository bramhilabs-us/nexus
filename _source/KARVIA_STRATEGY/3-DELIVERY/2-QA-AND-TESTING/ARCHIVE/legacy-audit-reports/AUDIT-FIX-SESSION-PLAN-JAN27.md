# Audit Fix Session Plan

**Purpose**: Fix all 47 findings from the Comprehensive Audit by updating sprint plans, test plans, and documentation to reference existing backend code — not create things from scratch.
**Date**: January 27, 2026

---

## EXISTING BACKEND REALITY (What We Actually Have)

Before fixing anything, here's the ground truth of what already exists:

### Task System (ALREADY EXISTS)
```
Model:    server/models/Task.js (separate model, NOT part of Goal)
Routes:   server/routes/tasks.js
Base URL: /api/tasks

Existing endpoints:
  GET    /api/tasks                      — List with filters (goal_id, assigned_to, status, priority, due_date_from/to)
  POST   /api/tasks                      — Create task (MANAGER+)
  GET    /api/tasks/:id                  — Get task detail
  PUT    /api/tasks/:id                  — Update task fields
  PUT    /api/tasks/:id/status           — Update status only
  PUT    /api/tasks/:id/complete         — Mark complete + CASCADE to parent Goal
  PUT    /api/tasks/:id/progress         — Update progress (0-100)
  DELETE /api/tasks/:id                  — Soft delete (MANAGER+)
  GET    /api/tasks/my/tasks             — Current user's tasks
  GET    /api/tasks/status/overdue       — Overdue tasks
  GET    /api/tasks/status/due-soon      — Due within N days
  GET    /api/tasks/stats/summary        — Aggregated stats

Task Model fields: company_id, objective_id, goal_id, name, assigned_to, created_by,
  due_date, status (todo/in_progress/completed/blocked/cancelled/deferred),
  progress, priority (low/medium/high/urgent), subtasks[], checklist[], comments[],
  team_id, ai_generated, recurring, visibility

Cascade: Post-save middleware calls goal.updateTaskMetrics() automatically
```

### Planning System (ALREADY EXISTS)
```
Routes:   server/routes/planning.js
Base URL: /api/planning

Existing endpoints:
  GET    /api/planning/weeks                          — 13 weeks for a quarter
  GET    /api/planning/hierarchy                      — Full goal hierarchy for quarter
  POST   /api/planning/goals/quarterly                — Create quarterly goal
  POST   /api/planning/goals/weekly                   — Create weekly goal under quarterly parent
  GET    /api/planning/goals/weekly                    — List weekly goals for KR (with_tasks=true to include tasks)
  PUT    /api/planning/goals/:id/progress             — Update progress + cascade to parent
  GET    /api/planning/goals/:id/children             — Child goals of quarterly goal
  DELETE /api/planning/goals/:id                      — Delete goal (hard delete!)
  POST   /api/planning/tasks/bulk                     — Bulk create tasks for a goal

AI Generation (ALREADY EXISTS):
  POST   /api/planning/generate-weekly-plan           — AI generates weekly goals + tasks for a KR
  GET    /api/planning/kr/:key_result_id/planned-weeks — Which weeks are planned vs remaining
  POST   /api/planning/extend                         — Extend existing plan with more weeks
  DELETE /api/planning/weekly-plan/:key_result_id     — Delete all weekly goals + tasks for a KR
```

### Dashboard System (ALREADY EXISTS)
```
Routes:   server/routes/dashboard.js
Base URL: /api/dashboard

Existing endpoints:
  GET    /api/dashboard/overview             — Aggregated metrics for quarter
  GET    /api/dashboard/hierarchy-tree       — Goal hierarchy as tree
  GET    /api/dashboard/progress-timeline    — Progress over time
  GET    /api/dashboard/cascade-effectiveness — Cascade analysis
  GET    /api/dashboard/weekly-performance   — Current week goals performance
  GET    /api/dashboard/today               — Role-based today focus (tasks, overdue, blocked, celebrations)
  POST   /api/dashboard/complete-task/:taskId — Complete task from dashboard
  POST   /api/dashboard/celebrate/:taskId    — Add celebration note
```

### SSI/Diagnostic System (ALREADY EXISTS — MUCH MORE THAN ASSUMED)
```
Routes:   server/routes/diagnostic-reports.js + server/routes/analytics.js
Base URL: /api/diagnostic + /api/analytics

Diagnostic endpoints (ALREADY EXIST):
  GET    /api/diagnostic/ssi/:companyId              — Full SSI report (dimensions, blocks, narratives, benchmarks)
  GET    /api/diagnostic/ssi/:companyId/summary      — Quick summary for dashboard
  GET    /api/diagnostic/ssi/:companyId/history       — SSI report history (ALREADY EXISTS!)
  GET    /api/diagnostic/ssi/:companyId/benchmark     — Industry benchmarks (ALREADY EXISTS!)
  POST   /api/diagnostic/ssi/:reportId/share          — Generate share link (ALREADY EXISTS!)
  GET    /api/diagnostic/ssi/public/:token            — Public share view (ALREADY EXISTS!)
  POST   /api/diagnostic/ssi/:reportId/refresh-narratives — Regenerate narratives

Analytics SSI endpoints (ALREADY EXIST):
  GET    /api/analytics/ssi/trends/user/:userId       — User SSI trends (= history)
  GET    /api/analytics/ssi/trends/team/:companyId    — Team SSI trends
  GET    /api/analytics/ssi/summary/user/:userId      — User SSI summary
  GET    /api/analytics/ssi/comparison/:assessmentId  — Individual vs Team vs Org vs Industry
  GET    /api/analytics/ssi/comparison/user/:userId   — User comparison data
  GET    /api/analytics/ssi/benchmarks/team/:companyId — Team average benchmarks
  GET    /api/analytics/ssi/benchmarks/org/:companyId  — Org-wide averages
  GET    /api/analytics/ssi/benchmarks/industry/:industry — Industry benchmarks
  GET    /api/analytics/ssi/drilldown/:id/dimension/:dim — Dimension breakdown
  GET    /api/analytics/ssi/export/pdf/:assessmentId   — PDF export (ALREADY EXISTS!)
  GET    /api/analytics/ssi/export/csv/:assessmentId   — CSV export
  GET    /api/analytics/ssi/weak-areas/:assessmentId   — Weak areas
  GET    /api/analytics/ssi/strong-areas/:assessmentId — Strong areas
```

### Assessment & Invitation System (ALREADY EXISTS)
```
Routes:   server/routes/assessments.js + assessmentQuestions.js + invitations.js

Assessment endpoints:
  GET    /api/assessments/my-assessments              — User's assessments (= "Assigned to Me")
  GET    /api/assessments/:id/results                 — Assessment results
  GET    /api/assessments/team/:company_id            — Team aggregation
  GET    /api/assessments/company/:id/team-breakdown  — Per-team member breakdown
  GET    /api/assessments/latest-scores               — Company SSI scores (for AI OKR)
  POST   /api/assessments/start                       — Start assessment from template
  POST   /api/assessments/:id/submit-responses        — Submit responses

Question endpoints:
  GET    /api/assessment-questions                     — All active questions (grouped by dimension)
  NOTE: Route is /api/assessment-questions NOT /api/assessmentQuestions

Invitation endpoints:
  POST   /api/invitations/create                      — Bulk create invitations
  GET    /api/invitations                             — List invitations (filter by company, status, template, team)
  GET    /api/invitations/assigned-to-me              — Invitations assigned to current user
  GET    /api/invitations/sent-by-me                  — ALREADY EXISTS! Grouped by batch with stats
  POST   /api/invitations/create-public-link          — Create anonymous survey link (ALREADY EXISTS!)
  GET    /api/invitations/survey/:token               — Get survey metadata (public)
  POST   /api/invitations/survey/:token/start         — Start anonymous assessment (public)
  POST   /api/invitations/:id/deactivate              — Deactivate public link
```

### Frontend Modules (ALREADY EXIST)
```
client/js/common.js          — KarviaCommon: escapeHtml, formatDate, getInitials, getRelativeTime,
                                truncate, isValidEmail, showToast, showLoading, apiRequest,
                                isAuthenticated, getAuthToken, getCurrentUser, requireAuth, logout

client/js/auth-check.js      — AuthCheck: auto-validates on DOMContentLoaded, dispatches auth:ready,
                                checks karvia_auth_token + karvia_user,
                                role-based page restrictions, public page whitelist

client/js/navigation.js      — NavigationManager: init(user), renderNavigation(), highlightActivePage(),
                                role-based navItems, getInitials(), formatRole(), logout()

client/js/goals-api-client.js — goalsAPI: full CRUD for quarterly + weekly goals,
                                 getObjectives(), getKeyResults(), getTeamMembers()

client/js/assessment-api-client.js — AssessmentAPI: getTemplates(), getTemplate(), createTemplate(),
                                      getAssessmentQuestions(), createInvitations(), getInvitations(),
                                      getAssignedInvitations(), getSentInvitations(), getTeamResults(),
                                      startAssessment(), submitAssessmentResponses(), getMyAssessments()

Existing CSS: client/css/quarterly-goals.css, ssi-report.css, ssi-report-full.css
```

---

## FIX PLAN: Organized by Sprint Plan Update

### SPRINT 11 FIXES (14 fixes)

| # | Finding | Fix | Action |
|---|---------|-----|--------|
| 1 | **1.1** Task route confusion | Sprint 12 uses `/api/tasks/` not `/api/goals/tasks` | Update Sprint 12 plan (documented here for S11 awareness) |
| 2 | **1.4** `company-summary` endpoint doesn't exist | Keep as NEW endpoint — compute avg scores from assessments | Mark as BUILD NEW in plan |
| 3 | **1.4** `team-results` endpoint doesn't exist | **WRONG** — `GET /api/assessments/team/:company_id` exists. Use it. Also `AssessmentAPI.getTeamResults()` exists! | Replace with existing endpoint reference |
| 4 | **1.4** `assessmentQuestions/dimensions` doesn't exist | Keep as NEW endpoint — groups existing questions by dimension/block hierarchy | Mark as BUILD NEW |
| 5 | **1.4** `assessmentQuestions/modules` doesn't exist | Keep as NEW (requires model change) | Mark as BUILD NEW |
| 6 | **1.4** `assessmentQuestions/by-module` doesn't exist | Keep as NEW (requires model change) | Mark as BUILD NEW |
| 7 | **1.4** `invitations/sent-by-me` assumed missing | **WRONG** — `GET /api/invitations/sent-by-me` ALREADY EXISTS with batch stats! | Remove from BUILD NEW list |
| 8 | **1.4** `invitations/create-public-link` assumed missing | **WRONG** — `POST /api/invitations/create-public-link` ALREADY EXISTS! | Remove from BUILD NEW list |
| 9 | **1.5** AssessmentQuestion model needs migration | Add migration task: backfill `module_type: 'core'` on all existing questions | Add to Sprint 11 Day 1 |
| 10 | **2.7** "Send Assessment" button → wizard wiring | Add note that U5's header button triggers J's wizard | Add dependency note |
| 11 | **5.4** Question Library Steps 2-3 not mocked | Add wireframe specs for Step 2 (Configure) and Step 3 (Review) | Add to plan |
| 12 | **5.5** "Team Results" tab: individual vs aggregated | Use existing `/api/assessments/team/:company_id` which returns per-member scores | Clarify in plan |
| 13 | **6.2** Anonymous assessment abuse protection | `create-public-link` already has `response_limit`. Add rate limiting notes. | Add security spec |
| 14 | **2.5** Question Library search not planned | Add client-side filter (no API needed, filter in-memory) | Add to U3 scope |

**Corrected Sprint 11 Endpoint Reality:**

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/assessments/my-assessments` | EXISTS | Tab 1: Assigned to Me |
| `GET /api/assessments/team/:company_id` | EXISTS | Tab 4: Team Results (per-member scores) |
| `GET /api/invitations/sent-by-me` | EXISTS | Tab 3: Sent by Me with batch stats |
| `GET /api/invitations/assigned-to-me` | EXISTS | Alternative for Tab 1 |
| `POST /api/invitations/create` | EXISTS | Launch assessment |
| `POST /api/invitations/create-public-link` | EXISTS | Anonymous survey (J6) |
| `GET /api/assessment-questions` | EXISTS | Questions (note: hyphenated route!) |
| `GET /api/assessment-questions/dimensions` | BUILD NEW | Hierarchy view |
| `GET /api/assessment-questions/modules` | BUILD NEW | Module types |
| `GET /api/assessment-questions/by-module` | BUILD NEW | Filtered by module |
| `GET /api/assessments/company-summary` | BUILD NEW | Avg scores for KPI |

**Reduced from 13 "new" to 4 truly new endpoints for Sprint 11.**

---

### SPRINT 12 FIXES (12 fixes)

| # | Finding | Fix | Action |
|---|---------|-----|--------|
| 1 | **1.1** Task routes use wrong base path | Replace ALL `/api/goals/tasks` with `/api/tasks` | Global find-replace in plan |
| 2 | **1.2** PlanningAIService already exists in route | Don't create new service. Extend existing `planning.js` route | Update plan |
| 3 | **1.2** `generate-weekly-plan` already exists | Use existing endpoint. Only add `generate-tasks` (per-week task gen) | Reduce M-Ph1 scope |
| 4 | **1.2** `extend` plan already exists | Rename M3 "regenerate" to use existing `extend` + `DELETE weekly-plan/:krId` for full regen | Update plan |
| 5 | Dashboard `today` endpoint already exists | Use `GET /api/dashboard/today` — already has tasks_today, overdue, blocked, celebrations | Replace U1 API references |
| 6 | Dashboard `overview` already exists | Use `GET /api/dashboard/overview` for KPIs | Replace custom KPI endpoints |
| 7 | `weekly-performance` already exists | Use `GET /api/dashboard/weekly-performance` for weekly goals column | Replace custom endpoint |
| 8 | Task completion cascade already built | `PUT /api/tasks/:id/complete` already calls `goal.updateTaskMetrics()` | Don't rebuild cascade |
| 9 | **2.1** Dashboard 3 vs 5 columns | Use `GET /api/dashboard/today` which returns `tasks_today` + `overdue_tasks`. Add tomorrow/thisWeek/later via `GET /api/tasks?due_date_from=X&due_date_to=Y` | Document column strategy |
| 10 | **2.3** Per-week owner assignment | Weekly goal has `owner_id` field. `PUT /api/planning/goals/:id/progress` can update it. | Add to L3 scope |
| 11 | **7.2** Dashboard 3 API calls | Use existing `GET /api/dashboard/today` as primary (has tasks + overdue + weekly). Supplement with `/api/dashboard/overview` | Document 2-call strategy |
| 12 | Planning hierarchy already exists | Use `GET /api/planning/hierarchy` for full quarter view | Reference in plan |

**Corrected Sprint 12 Endpoint Reality:**

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/dashboard/today` | EXISTS | Tasks today, overdue, blocked, weekly goals |
| `GET /api/dashboard/overview` | EXISTS | Quarter metrics |
| `GET /api/dashboard/weekly-performance` | EXISTS | Current week goals |
| `POST /api/dashboard/complete-task/:taskId` | EXISTS | Complete task from dashboard |
| `GET /api/tasks/my/tasks` | EXISTS | User's tasks |
| `GET /api/tasks/status/overdue` | EXISTS | Overdue tasks |
| `GET /api/tasks/status/due-soon` | EXISTS | Due within N days |
| `PUT /api/tasks/:id/complete` | EXISTS | Complete + cascade |
| `PUT /api/tasks/:id/status` | EXISTS | Status update |
| `PUT /api/tasks/:id` | EXISTS | Update any field (due_date for postpone, assigned_to for reassign) |
| `GET /api/planning/goals/weekly` | EXISTS | Weekly goals for KR |
| `GET /api/planning/hierarchy` | EXISTS | Full goal hierarchy |
| `GET /api/planning/weeks` | EXISTS | 13 weeks for quarter |
| `POST /api/planning/goals/weekly` | EXISTS | Create weekly goal |
| `POST /api/planning/tasks/bulk` | EXISTS | Bulk create tasks |
| `POST /api/planning/generate-weekly-plan` | EXISTS | AI generate weekly goals + tasks |
| `POST /api/planning/extend` | EXISTS | Extend plan with more weeks |
| `DELETE /api/planning/weekly-plan/:krId` | EXISTS | Delete plan (for regen) |
| `GET /api/planning/kr/:krId/planned-weeks` | EXISTS | Check which weeks planned |

**Truly new endpoints for Sprint 12: ZERO. Everything exists. Only frontend UI work.**

The only backend work needed:
- Add `due_date_from/due_date_to` grouping logic to `GET /api/tasks` (or do client-side grouping)
- Add postpone tracking (add `postpone_history` array to Task model — optional)
- Potentially add `GET /api/tasks/my/tasks?grouped=by_due_date` query option

---

### SPRINT 13 FIXES (11 fixes)

| # | Finding | Fix | Action |
|---|---------|-----|--------|
| 1 | **1.3** SSI analytics endpoints already exist | Map to existing `/api/analytics/ssi/*` and `/api/diagnostic/ssi/*` | Update all endpoint refs |
| 2 | `benchmark` already exists | `GET /api/diagnostic/ssi/:companyId/benchmark` EXISTS | Remove from BUILD NEW |
| 3 | `history` already exists | `GET /api/diagnostic/ssi/:companyId/history` EXISTS | Remove from BUILD NEW |
| 4 | `share` already exists | `POST /api/diagnostic/ssi/:reportId/share` EXISTS + public view | Remove from BUILD NEW |
| 5 | PDF export already exists | `GET /api/analytics/ssi/export/pdf/:assessmentId` EXISTS | Remove from BUILD NEW |
| 6 | Comparison already exists | `GET /api/analytics/ssi/comparison/:assessmentId` EXISTS | Remove from BUILD NEW |
| 7 | Team benchmarks already exist | `GET /api/analytics/ssi/benchmarks/team/:companyId` EXISTS | Remove from BUILD NEW |
| 8 | **5.1** No SSI report mockup | Add wireframe specification to Sprint 13 plan | Add visual spec |
| 9 | **6.1** Share link security not defined | Already implemented: 7-day expiry, limited public view (no narratives) | Document existing behavior |
| 10 | **2.4** "Chat" button not planned | Defer to future sprint — remove from mockup implementation | Document decision |
| 11 | **2.8** User dropdown not planned | Already in NavigationManager (renderNavigation renders user menu + logout) | Remove from findings |

**Corrected Sprint 13 Endpoint Reality:**

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/diagnostic/ssi/:companyId` | EXISTS | Full SSI report |
| `GET /api/diagnostic/ssi/:companyId/benchmark` | EXISTS | Industry benchmarks |
| `GET /api/diagnostic/ssi/:companyId/history` | EXISTS | Report history |
| `POST /api/diagnostic/ssi/:reportId/share` | EXISTS | Generate share link (7-day expiry) |
| `GET /api/diagnostic/ssi/public/:token` | EXISTS | Public view (limited data) |
| `GET /api/analytics/ssi/comparison/:assessmentId` | EXISTS | Individual vs Team vs Org |
| `GET /api/analytics/ssi/benchmarks/team/:companyId` | EXISTS | Team averages |
| `GET /api/analytics/ssi/benchmarks/industry/:industry` | EXISTS | Industry benchmarks |
| `GET /api/analytics/ssi/export/pdf/:assessmentId` | EXISTS | PDF export |
| `GET /api/analytics/ssi/trends/team/:companyId` | EXISTS | Team trends |
| `POST /api/objectives` | EXISTS | Create objective |
| `PUT /api/objectives/:id` | EXISTS | Update (owner, archive) |

**Truly new for Sprint 13:**
- `GET /api/diagnostic/ssi/team/:teamId` — team-level aggregation (not individual user trends, but team's aggregated SSI score). May be derivable from existing `GET /api/assessments/team/:company_id`.

**Reduced from 6 "new" to 0-1 truly new endpoint.**

---

### SPRINT 14 FIXES (3 fixes)

| # | Finding | Fix | Action |
|---|---------|-----|--------|
| 1 | **3.1** SSE authentication gap | Document strategy: use ticket-based auth (REST call gets short-lived SSE token → pass as query param) | Add to plan |
| 2 | **7.3** Cache key strategy undefined | Define: `hash(company_id + report_type + dimension + score_bucket)` — exclude timestamps | Add to plan |
| 3 | Narrative refresh already exists | `POST /api/diagnostic/ssi/:reportId/refresh-narratives` EXISTS | Reference in plan |

---

### TEST PLAN FIXES (10 fixes)

| # | Finding | Fix | Action |
|---|---------|-----|--------|
| 1 | **3.2** No full lifecycle journey | Add "Golden Path" test to regression suite | Add to regression |
| 2 | **3.3** CONSULTANT undertested | Add CONSULTANT E2E tests to each sprint test plan | Add to all 4 plans |
| 3 | **3.4** No explicit multi-tenant tests | Add dedicated 2-company isolation suite | Add to regression |
| 4 | **3.5** Full cascade chain not tested | Add task→weekly→KR→objective chain test | Add to Sprint 12 |
| 5 | **3.6** Cancelled tasks in cascade | Document rule: excluded from denominator. Add tests. | Add to Sprint 12 |
| 6 | **3.7** No responsive tests S11/S12 | Add 768px viewport tests | Add to S11, S12 plans |
| 7 | **3.8** Date picker not tested | Add date picker interaction tests | Add to Sprint 12 |
| 8 | **6.3** Input validation scope too narrow | Note Q2 middleware must apply to S12/S13 endpoints | Add regression tests |
| 9 | **7.1** No pagination | Add pagination to test plans | Add to all sprint plans |
| 10 | All test plans reference wrong endpoint paths | Update to use actual existing paths | Global update |

---

### CROSS-CUTTING FIXES (7 fixes)

| # | Finding | Fix | Action |
|---|---------|-----|--------|
| 1 | **2.6** Teams Edit/Delete not in plan | Add edit modal and delete confirmation to U4 scope | Update Sprint 11 |
| 2 | **4.2** CSS variable discipline | Add static analysis rule: grep for hardcoded hex in new files | Add to Sprint 11 foundation |
| 3 | **4.3** No rollback strategy | Each sprint plan gets a "Rollback Plan" section | Add to all plans |
| 4 | **5.2** No loading state pattern | Define skeleton/spinner in s13-patterns.css spec | Add to Sprint 11 |
| 5 | **5.3** No error state pattern | Define error component in s13-patterns.css spec | Add to Sprint 11 |
| 6 | **8.1** No API contract docs | Add request/response schemas for truly new endpoints | Add to sprint plans |
| 7 | **8.2** Test file location inconsistent | Use feature-based flat structure matching existing pattern | Update test plans |

---

## REVISED EFFORT ESTIMATION

### Before Audit (Sprint Plans Assumed):
| Sprint | New Backend Endpoints | New Services | Model Changes |
|--------|----------------------|-------------|---------------|
| 11 | 13 | 0 | 4 fields |
| 12 | 8 | 1 (PlanningAIService) | 0 |
| 13 | 7 | 0 | 0 |
| 14 | 0 | 0 | 1 model (LLMCache) |
| **Total** | **28** | **1** | **5** |

### After Audit (Reality):
| Sprint | New Backend Endpoints | New Services | Model Changes |
|--------|----------------------|-------------|---------------|
| 11 | 4 | 0 | 3 fields (weight exists) |
| 12 | 0-1 | 0 | 0-1 (postpone_history optional) |
| 13 | 0-1 | 0 | 0 |
| 14 | 1 (SSE stream) | 0 | 1 model (LLMCache) |
| **Total** | **5-7** | **0** | **4-5** |

**Net reduction: 21-23 endpoints don't need building. Zero new services. The backend is far more complete than the sprint plans assumed.**

---

## EXECUTION ORDER

### Phase 1: Update Sprint Master Plans (Priority: CRITICAL)

1. **Sprint 11** — Fix endpoint references, add migration step, add wireframes for wizard Steps 2-3, add loading/error state patterns, add Edit/Delete team flows, correct question route path (`/api/assessment-questions` not `/api/assessmentQuestions`)
2. **Sprint 12** — Replace ALL task endpoints with `/api/tasks/*`, reference existing dashboard/planning endpoints, remove PlanningAIService creation, reduce M-Ph1 scope to frontend only + 1 optional endpoint
3. **Sprint 13** — Replace ALL SSI endpoints with existing `/api/diagnostic/ssi/*` and `/api/analytics/ssi/*`, note "Chat" button deferred, add SSI report wireframe
4. **Sprint 14** — Add SSE auth strategy, define cache key spec, reference existing narrative refresh

### Phase 2: Update Test Plans (Priority: HIGH)

5. **All 4 test plans** — Fix endpoint paths to match reality, add CONSULTANT tests, add responsive tests to S11/S12, add pagination tests
6. **Regression suite** — Add Golden Path lifecycle journey, multi-tenant isolation suite, full cascade chain test

### Phase 3: Update Roadmap (Priority: MEDIUM)

7. **SPRINT_ROADMAP_V2.md** — Update architecture decisions section with audit findings, note reduced backend scope

---

## KEY DECISIONS TO DOCUMENT

| Decision | Rationale |
|----------|-----------|
| Use `/api/tasks/*` not `/api/goals/tasks` | Task model is separate, routes already exist with full CRUD + cascade |
| Don't create PlanningAIService.js | AI generation already embedded in `planning.js` route with OpenAI integration |
| Use existing SSI analytics endpoints | `/api/analytics/ssi/*` has benchmarks, comparison, PDF, trends already |
| Use `/api/dashboard/today` for dashboard | Already returns role-based tasks, overdue, blocked, weekly goals, celebrations |
| Use `/api/invitations/sent-by-me` as-is | Already returns batch-grouped stats with completion tracking |
| Use `/api/invitations/create-public-link` for J6 | Anonymous survey with response_limit already built |
| Route is `/api/assessment-questions` (hyphenated) | Not `/api/assessmentQuestions` — plan had wrong path |
| "Chat" button deferred | No chat feature/endpoint exists; remove from implementation scope |
| User dropdown already in NavigationManager | `renderNavigation()` includes user menu + logout |
| SSE auth via ticket-based tokens | EventSource can't send headers; use REST-issued short-lived query tokens |

---

*Audit Fix Session Plan — 47 Findings → Actionable Fixes*
*January 27, 2026*
