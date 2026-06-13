---
id: nexus.api-surface
title: API Surface — every Karvia route, shape-tagged
tier: T2
status: active
owner: agent
updated: 2026-06-09
summary: >
  The complete Karvia HTTP surface: 313 main-server routes across 28 route
  files + 97 engine routes, every route tagged with its shape (CRM / OKR /
  ASMT + auxiliary) and its Nexus disposition (inheriting module, contract
  call, or dies with NOF/SSI). Grounds N1-P4-01 contract drafts and the
  Night 2-3 route lifts.
parents:
  - NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md
  - NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md
children:
  - NEXUS_STRATEGY/2-TECHNICAL/MODULARIZATION_PLAN.md
revisit:
  - on: "a Night 2-3 lift finds a route this catalogue missed or mis-tagged"
    stage: N2
---

# API Surface — every Karvia route, shape-tagged

## Purpose

Catalogue the entire Karvia HTTP surface so N1-P4-01 can draw module contracts on real endpoints and the Night 2–3 lifts know exactly which routes move, merge, or die. MODULE_DEPENDENCY_GRAPH says *who touches what data*; this doc says *what the world can call*. Dispositions here are the per-route application of that doc's cluster rulings.

## TL;DR

- **410 routes total**: 313 on the main server (28 route files), 97 across the 10 engines (only iam's 8 are deployed — C-003).
- **The three shapes hold.** Nearly every surviving route is CRM-shape (entity/membership lifecycle), OKR-shape (hierarchy-node CRUD + progress + roll-up reads), or ASMT-shape (instrument lifecycle: start → questions → submit → results → history). What doesn't fit is composition (consultant, dashboard, planning), AI drafting (ai-okr, objective-wizard, planner), or signal reads (analytics) — all of which become contract-call layers, not model owners.
- **~96 routes die outright**: the SSI diagnostic family (18 analytics `/ssi/*` + 14 diagnostic + 5 context-maturity + 3 disciplines, C-006) and the Goal/Move layer (27 goals + 6 moves + quarterly planning routes, NOF). Another ~76 engine routes are dead in prod already and stay dead (consolidate, C-003).
- **Auth is served twice**: `auth.js` on the main server and the iam engine expose near-identical register/login/validate/me surfaces. `@nexus/crm` publishes it once.

## Pre-scan — drifts caught

1. **Route-file names ≠ URL paths in 3 cases**: `diagnostic-reports.js` mounts at `/api/diagnostic`, `outcome-capture.js` at `/api/outcomes`, `assessmentTemplates.js` at `/api/assessment-templates`. Contracts must cite URLs, not filenames.
2. **The WeeklyGoal surface exists three times**: `weekly-goals.js` (5 routes), `goals.js` `/weekly/*` (5 routes), and `planning.js` `/goals/weekly` (2 routes) — three URL families over the same model the module graph already flagged as shadow-prone. `@nexus/milestones` publishes ONE surface.
3. **iam duplicates auth.js** (register/signup/login/validate/me/users/logout) — the same lifecycle on two ports. SYSTEM_ARCHITECTURE's "iam sidecar" framing undersells that it is a *copy*, not a delegate.
4. **`analytics.js` is two clusters wearing one mount**: 10 business-signal routes (BOQ-family precursors, ⏸N4) + 18 `/ssi/*` routes (✄SSI). The file should never be lifted whole.

## Method

Greps over `karvia_business/` (read-only): `app.use(` in `server/index.js` for mounts; `router.<method>(` per `server/routes/*.js`; `(router|app).<method>(` across `engines/*/` excluding node_modules. Counts are exact at grep time; param names kept verbatim.

## Legend

**Shapes** (the three canonical + auxiliary):

| Tag | Shape | Test |
|---|---|---|
| `CRM` | entity/membership lifecycle | creates/reads/updates orgs, people, teams, roles, invitations |
| `OKR` | hierarchy-node lifecycle | CRUD a NOF-chain node, update progress, read roll-up |
| `ASMT` | instrument lifecycle | start → questions → submit → results/history/trends |
| `COMPOSE` | cross-module read composition | joins ≥2 modules' data for one surface; owns nothing |
| `AI` | generative drafting | produces draft objectives/KRs/plans for human approval |
| `SIGNAL` | derived-score reads | computed analytics over the chain (BOQ-family precursors) |
| `CONF` | static/config reads | industry lists, permissions, presets (config data, AP-3) |
| `META` | platform meta | admin, feedback meta-loop |

**Dispositions** (per-route application of MODULE_DEPENDENCY_GRAPH rulings): `→crm` `→asmt` `→obj` `→kr` `→mil` `→task` `→gov` `→knw` = inherits to that module (cross-module data via contract calls) · `✄NOF` dies with Goal/Move drop · `✄SSI` dies with SSI drop (C-006) · `✄` dies (reason in notes) · `⏸N4` deferred to the N4 BOQ/score engines · `⏸` deferred.

## Mounts (server/index.js)

`/api/auth` `/api/companies` `/api/businesses` `/api/objectives` `/api/goals` `/api/tasks` `/api/assessments` `/api/assessment-templates` `/api/assessment-questions` `/api/invitations` `/api/analytics` `/api/cascade` `/api/admin` `/api/ai-okr` `/api/teams` `/api/planning` `/api/dashboard` `/api/diagnostic` `/api/feedback` `/api/config` `/api/consultant` `/api/context-maturity` `/api/outcomes` `/api/objective-wizard` `/api/disciplines` `/api/key-results` `/api/weekly-goals` `/api/moves` — plus `/api-docs` (swagger) and a `*` 404 handler.

## Main server — route tables by cluster

### auth.js → `/api/auth` (13) — inherits to `@nexus/crm`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | /register · /signup · /login · /validate · /logout | CRM | →crm |
| GET | /me · /users | CRM | →crm |
| PATCH | /me/onboarding · /me/preferences | CRM | →crm |
| GET | /me/preferences | CRM | →crm |
| PUT | /switch-company | CRM | →crm (becomes program/tenant switch) |
| POST | /forgot-password · /reset-password | CRM | →crm |

### companies.js → `/api/companies` (12) — `@nexus/crm`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | / · /:id · /:id/stats · /:id/users · /:id/teams | CRM | →crm (`/:id/stats` reads OKR data → contract call) |
| POST | / · /:id/logo | CRM | →crm |
| PUT | /:id · /:id/onboarding | CRM | →crm |
| PUT | /:id/assessment-scores | ASMT | ✄ — score writes belong to `@nexus/assessment` via contract, never a crm route (AP-3 twin) |
| DELETE | /:id · /:id/logo | CRM | →crm |

### businesses.js → `/api/businesses` (6) — `@nexus/crm`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /:id · /:id/stats · /:id/users · /:id/teams | CRM | →crm (Business folds into Company per DATA_MODELS) |
| PUT · DELETE | /:id | CRM | →crm |

### teams.js → `/api/teams` (9) — `@nexus/crm`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | /create · /:teamId/members · /:teamId/members/create-user | CRM | →crm |
| GET | / · /:teamId · /eligible-owners | CRM | →crm |
| PUT | /:teamId | CRM | →crm |
| DELETE | /:teamId · /:teamId/members/:userId | CRM | →crm |

### invitations.js → `/api/invitations` (13) — `@nexus/crm`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /validate/:token · / · /assigned-to-me · /sent-by-me · /:id | CRM | →crm |
| POST | /accept/:token · /create · /:id/deactivate · /create-public-link · /create-company-invitation · /invite-team-member | CRM | →crm |
| GET | /survey/:token | ASMT | →asmt (anonymous-taker entry; crm validates token via contract) |
| POST | /survey/:token/start | ASMT | →asmt |

### admin.js → `/api/admin` (1)

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | / | META | →crm (platform-admin read) |

### config.js → `/api/config` (6)

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /industries · /industries/:industry/subtypes · /industries/:industry/profile · /industry-presets · /industry-presets/suggest · /permissions | CONF | →crm (config data, AP-3; tenant tuning lives in Configuration surface) |

### consultant.js → `/api/consultant` (15) — the god-route → Engagement-mode composition shell

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /portfolio-summary · /portfolio-kpis | COMPOSE | →crm shell; tiles via read contracts |
| POST | /clients · /clients/enrich · /clients/:id/stage | CRM | →crm (Add Client; auto-initiates AIR per BOQ ladder) |
| GET | /clients/:id/profile · /clients/:id/teams | CRM | →crm |
| GET | /clients/:id/objectives | COMPOSE | contract call `objectives.listFor(program)` |
| GET | /clients/:id/goals/quarterly · /clients/:id/goals/weekly | OKR | ✄NOF (weekly read re-emerges as `milestones.listFor` behind the shell) |
| GET | /clients/:id/assessments | COMPOSE | contract call to `@nexus/assessment` |
| GET | /clients/:id/dashboard-summary | COMPOSE | read contracts; ≤4 tiles per page contract |
| PATCH | /clients/:id/objectives/:oid/notes | OKR | →obj via contract |
| POST | /clients/:id/objectives/:oid/mark-sustained · /clients/:id/objectives/:oid/override-state | OKR | →obj via contract (state overrides gain governance audit, →gov event) |

### assessments.js → `/api/assessments` (24) — `@nexus/assessment` (AIR impl behind `AssessmentProvider`)

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | /start · /submit · /:id/submit-responses · /:id/submit-anonymous · /calculate | ASMT | →asmt |
| GET | /questions · /:id/questions-anonymous · /invitation/:token/questions | ASMT | →asmt (delivered as flashcard decks per PRODUCT_STRATEGY) |
| GET | /history · /my-assessments · /:id/results · /:id/detailed-results · /results/:companyId · /latest-scores · /trends · /compare | ASMT | →asmt (recurring decks receive history for deltas) |
| GET | /team/:company_id · /company/:companyId/team-breakdown · /company/:companyId/anonymous · /company-results · /company/:companyId/all-responses · /kpi-summary | ASMT | →asmt (aggregate reads; crm data via contract) |
| PUT | /:id/exclude · /:id/restore | ASMT | →asmt (admin curation) |

### assessmentQuestions.js → `/api/assessment-questions` (5) — `@nexus/assessment`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /dimensions · /modules · /by-module · /industries · / | ASMT | →asmt (question bank is provider-internal; SSI bank dies, AIR bank ships) |

### assessmentTemplates.js → `/api/assessment-templates` (6) — `@nexus/assessment`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | / · /:id · /:id/questions | ASMT | →asmt |
| POST · PUT · DELETE | / · /:id · /:id | ASMT | →asmt (template authoring = Builder mode surface) |

### analytics.js → `/api/analytics` (28) — two clusters in one file

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /executive-dashboard · /business-health · /department-performance · /progress-trends · /risk-analysis · /team-efficiency · /predictive-insights · /cascade-analysis · /performance-comparison | SIGNAL | ⏸N4 — BOQ-family score engines read via signal-store contracts |
| POST | /calculate-business-score | SIGNAL | ⏸N4 |
| GET | /ssi/trends/* (3) · /ssi/summary/user/:userId · /ssi/comparison/* (2) · /ssi/benchmarks/* (3) · /ssi/drilldown/* (3) · /ssi/weak-areas/:assessmentId · /ssi/strong-areas/:assessmentId · /ssi/export/* (4) | ASMT | ✄SSI (18 routes, C-006) |

### diagnostic-reports.js → `/api/diagnostic` (14)

| Method | Path | Shape | Nexus |
|---|---|---|---|
| all | /check-eligibility/:companyId · /generate · /reports/:companyId · /report/:reportId · /latest/:companyId · /mark-used-for-okr/:reportId · /export/:reportId · /ssi/:companyId · /ssi/:companyId/summary · /ssi/:companyId/history · /ssi/:reportId/refresh-narratives · /ssi/:companyId/benchmark · /ssi/:reportId/share · /ssi/public/:token | ASMT | ✄SSI — entire cluster (C-006). The *pattern* (eligibility → generate → report → share) re-emerges as AIR's report surface inside `@nexus/assessment`. |

### context-maturity.js → `/api/context-maturity` (5) · disciplines.js → `/api/disciplines` (3)

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | context-maturity: / · /quick · /stage/:stageNumber · /stages · /recommendations | ASMT | ✄SSI |
| GET | disciplines: / · /dropdown · /foundations | CONF | ✄SSI (SSI taxonomy) |

### ai-okr.js → `/api/ai-okr` (11) — `@nexus/objectives` AI service

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | /generate/:assessmentId · /generate-from-team · /generate-plan · /generate-from-company · /generate-single-objective | AI | →obj (assessment inputs become AIR outputs via contract) |
| POST | /approve · /approve-draft | AI | →obj (draft → real objective; human approval stays mandatory) |
| GET | /suggestions/:userId · /debug-context/:companyId | AI | →obj (debug route dies in prod build) |
| PUT | /edit/:suggestionId/:objectiveIndex | AI | →obj |
| DELETE | /dismiss/:suggestionId/:objectiveIndex | AI | →obj |

### objective-wizard.js → `/api/objective-wizard` (7) — `@nexus/objectives` AI service

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | /initialize-session · /refine-objective · /generate-krs · /regenerate-kr · /finalize | AI | →obj |
| GET | /context-hints · /stats | AI | →obj |

### objectives.js → `/api/objectives` (20) — `@nexus/objectives`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | / · /bulk | OKR | →obj |
| GET | / · /list · /:id · /my-dashboard · /suggestions · /check-limit | OKR | →obj (`check-limit` = the 6–7 self-rolling cap, now a NOF rule) |
| PUT | /:id · /:objectiveId/progress | OKR | →obj (progress becomes roll-up-computed, not written — NOF) |
| DELETE | /:id | OKR | →obj |
| POST | /calculate-dates · /validate-dates · /:objectiveId/check-cascade | OKR | →obj (de-calendared per NOF: any-day start/end) |
| PUT | /:objectiveId/cascade-dates | OKR | →obj |
| POST | /:objectiveId/ai-help · /generate-krs | AI | →obj |
| GET | /ibrain/priorities/:userId · /ibrain/insights/:userId | COMPOSE | seam ancestor (C-010/C-020) — the local-heuristic leg of what becomes the Layer-4 orchestrator's fallback; not lifted as-is, revisit at N4 |
| POST | /ibrain/refresh/:userId | COMPOSE | seam ancestor (C-010/C-020) — same |

### key-results.js → `/api/key-results` (4) — `@nexus/key-results`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /:objectiveId | OKR | →kr (parent validated via `objectives` contract) |
| POST · PUT · DELETE | / · /:id · /:id | OKR | →kr (de-calendared: `quarters[]` dies, NOF) |

### weekly-goals.js → `/api/weekly-goals` (5) — reshapes to `@nexus/milestones`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /:keyResultId | OKR | →mil (milestones hang off the *objective* in NOF — the KR-keyed read becomes `milestones.listFor(objective)`) |
| POST · PUT · DELETE | / · /:id · /:id | OKR | →mil |
| POST | /generate | AI | →mil (AI-drafted milestone plans) |

### goals.js → `/api/goals` (27) — the Goal layer

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET·POST·PUT·DELETE | / · /:id · /:id/progress · /:id/assign · /quarter/:quarter · /my/goals · /status/overdue · /stats/summary · /:id/breakdown · /:goalId/cascade (10) | OKR | ✄NOF — base Goal CRUD dies with the layer |
| GET·POST·PUT·PATCH·DELETE | /quarterly/:keyResultId · /quarterly/objective/:objectiveId · /quarterly/:keyResultId/quarter/:quarter · /quarterly · /quarterly/bulk · /quarterly/:id · /quarterly/:id (del) · /quarterly/:id/progress · /quarterly/:id/assign (9) | OKR | ✄NOF — quarterly grouping dies (no ISO quarters in NOF) |
| GET·POST·PUT·DELETE | /weekly/by-kr/:keyResultId · /weekly/:quarterlyGoalId · /weekly · /weekly/:id · /weekly/:id (del) (5) | OKR | →mil — the weekly branch reshapes; surface merges into `@nexus/milestones` (drift #2) |
| GET | /quarter/:quarter *(counted above)* | | |

### moves.js → `/api/moves` (6) — the Move layer

| Method | Path | Shape | Nexus |
|---|---|---|---|
| all | /dashboard-summary · /:weeklyGoalId · / · /:id · /:id (del) · /generate | OKR | ✄NOF — Move folds into Task (`move_type`/frequency become Task fields per C-008 analysis) |

### tasks.js → `/api/tasks` (19) — `@nexus/tasks`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | / · /:id · /my/tasks · /status/overdue · /status/due-soon · /stats/summary | OKR | →task (re-parented to `milestone_id`, NOF) |
| POST | / · /:id/subtasks · /:id/checklist | OKR | →task |
| PUT | /:id · /:id/status · /:id/complete · /:id/progress · /:id/subtasks/:subtask_id/complete · /:id/checklist/:checklist_id/check · /:id/block · /:id/unblock | OKR | →task (complete/progress emit roll-up events up the NOF chain) |
| POST | /:id/comments | OKR | →knw (comments re-home with the collaboration surface — entity-ref contract) |
| DELETE | /:id | OKR | →task |

### cascade.js → `/api/cascade` (6) — `@nexus/objectives`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | /objective/:id · /simulate/:id | OKR | →obj (cascade = NOF distribution to teams; simulate survives as preview) |
| GET | /status/:id · /objectives · /hierarchy/:id | OKR | →obj |
| DELETE | /objective/:id | OKR | →obj |

### planning.js → `/api/planning` (14) — Planning-page composition

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /hierarchy | COMPOSE | →obj shell — pure read contracts over the NOF chain |
| GET | /weeks · /kr/:key_result_id/planned-weeks | OKR | ✄NOF (ISO-week planning dies; milestones are objective-relative) |
| POST | /goals/quarterly | OKR | ✄NOF |
| POST·GET | /goals/weekly | OKR | →mil (merges into the one milestones surface — drift #2) |
| PUT·GET·DELETE | /goals/:id/progress · /goals/:id/children · /goals/:id | OKR | ✄NOF (Goal-keyed) |
| POST | /tasks/bulk · /generate-tasks | OKR / AI | →task (bulk create; AI drafting via objectives service) |
| POST | /generate-weekly-plan · /extend | AI | →mil (becomes milestone-plan drafting) |
| DELETE | /weekly-plan/:key_result_id | OKR | →mil |

### dashboard.js → `/api/dashboard` (8) — `@nexus/governance` reads

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /overview · /hierarchy-tree · /progress-timeline · /cascade-effectiveness · /weekly-performance · /today | COMPOSE | →gov (read contracts over the chain; `weekly-performance` re-keys to milestones) |
| POST | /complete-task/:taskId · /celebrate/:taskId | OKR | →task via contract (celebrate emits a knowledge/recognition event →knw) |

### outcome-capture.js → `/api/outcomes` (11) — `@nexus/knowledge`

| Method | Path | Shape | Nexus |
|---|---|---|---|
| POST | / · /:id/submit | OKR | →knw (the NOF outcome record at objective close; consumes `objective.closed` event) |
| PUT | /:id | OKR | →knw |
| GET | / · /:id · /objective/:objectiveId · /pending/objectives | OKR | →knw |
| GET | /analytics/summary · /analytics/success-rate · /analytics/failure-reasons · /analytics/lessons | SIGNAL | →knw (outcome evidence reads; feeds BOQ Knowledge score, N4) |

### feedback.js → `/api/feedback` (15) — `@nexus/knowledge` meta-loop

| Method | Path | Shape | Nexus |
|---|---|---|---|
| GET | /pulse/latest · /features · /ideas · /ideas/:id | META | →knw (lift+redesign per DATA_MODELS) |
| POST | /pulse · /features · /ideas · /ideas/:id/vote | META | →knw |
| DELETE | /ideas/:id | META | →knw |
| GET | /admin/stats · /admin/ideas · /admin/export | META | →knw (status visible to submitter — meta-loop contract) |
| POST | /admin/ideas/:id/estimate | META | →knw |
| PUT | /admin/ideas/:id | META | →knw |

## Engines — route tables

Only **iam** is deployed (C-003); all engines consolidate into the single Nexus app. Their routes are catalogued for pattern salvage, not lift.

| Engine (routes) | Surface | Shape | Nexus |
|---|---|---|---|
| **iam** (8) | /health · POST /api/auth/{register,signup,login,validate,logout} · GET /api/users/me · GET /api/users | CRM | ✄ — duplicate of auth.js (drift #3); `@nexus/crm` publishes auth once |
| **assessment** (5) | /health · GET questions · POST conduct · GET business/:businessId · GET benchmarks/:industry | ASMT | ✄ — superseded by the main-server assessment cluster; SSI bank dies (C-006) |
| **planner** (7) | /health · GET suggestions · POST objectives/generate · CRUD objectives | AI / OKR | →obj — drafting folds into the objectives AI service (same fate as ai-okr.js) |
| **tracking** (13) | /health · CRUD tasks + complete · POST progress, progress/:trackerId/update · GET analytics/dashboard · 4 agent webhook routes | OKR | ✄ — shadow-Task surface dies; roll-up becomes the NOF chain in `@nexus/tasks`; agent webhooks ⏸ |
| **collaboration** (8) | /health · CRUD tasks · POST/GET comments · GET workload/{team,optimize} | OKR | ✄ — shadow-Task dies; comments re-home →knw via entity-ref contract; workload ⏸N4 |
| **scoring** (8) | /health · 7 GET analytics/* (mirrors analytics.js business cluster) | SIGNAL | ⏸N4 — BOQ score engines over the signal store; shadow schemas die |
| **insights** (7) | /health · POST generate/recommendations/predictions/risks/coach · GET history | SIGNAL | ⏸ — defer (read-only consumer; returns N4 via contracts) |
| **observer** (12) | /health · POST events, events/batch, webhooks/engines · GET insights/patterns/predictions/analytics | SIGNAL | ✄ — replaced by domain events emitted by owning modules (→gov handlers) |
| **integrations** (18) | /health · slack/teams/email/calendar configure+send · webhooks register/trigger/:clientId · notifications send/broadcast | META | ⏸ — connector shells; nothing imported, nothing lifted |
| **whitelabel** (11) | /health · branding upload-logo/colors/fonts · theme generate/:clientId · client config ×2 · domain/deployment ×3 | META | ✄ — tenant branding is config data on the tenant (AP-3), not a service |

## Totals

| | Routes | →survive (module/contract) | ✄ dies | ⏸ deferred |
|---|---|---|---|---|
| Main server (28 files) | 313 | ~245 | 58 (40 SSI-family, 15 NOF-only*, 3 iBRAIN/score-write) | 10 (SIGNAL ⏸N4) |
| Engines (10) | 97 | 7 (planner pattern) | ~57 | ~33 |

*NOF deaths counted net of reshapes: goals.js weekly branch (5) and planning weekly routes (2) survive into `@nexus/milestones`; the other Goal/Move/quarterly routes (33 incl. consultant + planning quarterly reads) die — 15 unique route *families* shown dead above collapse for brevity; per-route tags in the tables are authoritative.

The surviving surface consolidates to **8 module surfaces + 2 composition shells** (Engagement/consultant, Planning) — exactly the lego-block anatomy TECH_STRATEGY draws. N1-P4-01 draws each module's published endpoint set from these tables.
