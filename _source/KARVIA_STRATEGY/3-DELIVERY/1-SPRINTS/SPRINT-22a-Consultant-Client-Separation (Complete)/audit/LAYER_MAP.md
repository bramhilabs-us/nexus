# Sprint 22a — Layer Map (As-Is)

<!-- @GENOME T3-SPR-022a-LAYERMAP | DRAFT | 2026-04-30 | parent:T3-SPR-022a-AUDIT | auto:- | linked:/audit-architecture -->

**Date frozen**: 2026-04-30 (pre-#184a)
**Scope**: Consultant↔Client surface area only. Tenant-native client app paths are listed only when a Sprint 22a fix touches them.

---

## The Two Apps

| App | JWT identity | Theme / Nav | Data scope | Today's reality |
|---|---|---|---|---|
| **Consultant App** (RSM Consulting) | `req.user.role === 'CONSULTANT'`, own `company_id` | "RSM Consulting" nav, consultant theme | Reads its own data + reads `managed_businesses[]` clients via consultant-scoped APIs | ⚠️ Today swaps JWT to "become" the client (3 entry points) |
| **Client App** (BUSINESS_OWNER / EXECUTIVE / MANAGER / EMPLOYEE) | Their tenant `company_id` | Tenant nav, client theme | Their own tenant only | ✅ Clean — multi-tenancy enforced via `req.user.company_id` |

---

## Layer 1 — Frontend (Experience)

| Concern | Lives in | Should it live here? |
|---|---|---|
| Consultant portfolio cockpit | [client/pages/my-clients.html](../../../../client/pages/my-clients.html) + [scripts/my-clients.js](../../../../client/pages/scripts/my-clients.js) | ✅ Consultant App |
| Add Client wizard | [client/pages/scripts/add-client-wizard.js](../../../../client/pages/scripts/add-client-wizard.js) | ✅ Consultant App |
| Client-workspace cockpit | **Does not exist yet** — to be created in #184b at `client/pages/client-workspace.html` | ✅ Consultant App |
| Tenant-native pages (45 files) | `client/pages/*.html` (objectives, dashboard, planning-v2, teams, assessment-hub, etc.) | ✅ Client App — already JWT-driven |
| **JWT-swap helper** | [client/js/common.js:637-676](../../../../client/js/common.js#L637-L676) `ensureActiveCompany()` calls `PUT /api/auth/switch-company` | ❌ **Layer leak**. Frontend mutating server-side tenant scope. Belongs nowhere — must be retired (#184c) |
| **Company switcher dropdown** | [client/js/navigation.js:344-378](../../../../client/js/navigation.js#L344-L378) calls `switch-company` on click | ❌ **Layer leak** — calls JWT-mutation route from a UI control. Fine for legacy admin, must be CONSULTANT-suppressed (already done at line 162 + 234 per #183b, but caller path remains) |
| **"Viewing as: Client Company" purple banner** | [client/js/navigation.js:406-484](../../../../client/js/navigation.js#L406-L484) `renderContextBanner()` — indigo→purple gradient banner with "Back to My Company" button | ❌ **Symptom of layer leak** — banner only renders because consultant *became* the client. Must die in #184c (or guard to non-CONSULTANT only for future BUSINESS_OWNER multi-org) |
| **`switchToOwnCompany()`** | [client/js/navigation.js:489+](../../../../client/js/navigation.js#L489) — second `switch-company` caller (the "Back to My Company" button) | ❌ Same root cause — retired in #184c |
| Frontend role checks (16 sites) | `client/js/auth-check.js:220`, `navigation.js:162,234`, `assessment-hub.html:1016,1093,1466,1556,1752,2097`, `team-ssi-view.html:451`, `login.html:557`, `signup.html:630`, `invitation-accept.html:472`, `tool-eval-results.js:64`, `send-wizard.js:219`, `assessment-wizard.js:247`, `team-selection.js:76` | ⚠️ Acceptable when used for **rendering only** (showing/hiding a column, redirecting after login). Becomes a leak when used for **business rules** (deciding write permissions). Today's uses are rendering — kept |

**Frontend verdict**: 3 hard layer leaks (all `switch-company`-driven), all in [common.js](../../../../client/js/common.js) and [navigation.js](../../../../client/js/navigation.js). 45 pages are clean.

---

## Layer 2 — Middleware / Application (Brain)

| Concern | Lives in | Should it live here? |
|---|---|---|
| **JWT issuance + validation** | [server/middleware/auth.js](../../../../server/middleware/auth.js), [server/routes/auth.js](../../../../server/routes/auth.js) | ✅ |
| **RBAC** | [server/middleware/roleGuards.js:26-50](../../../../server/middleware/roleGuards.js#L26-L50) `requireRole()` | ✅ |
| **Tenant scope enforcement** | Per-route `req.user.company_id` filter; consultant cross-tenant via `req.user.managed_businesses` membership check | ✅ |
| **Consultant portfolio reads** | [server/routes/consultant.js:88](../../../../server/routes/consultant.js#L88) `/portfolio-summary`, [:233](../../../../server/routes/consultant.js#L233) `/portfolio-kpis` | ✅ Already implements two-app pattern |
| **Consultant client creation** | [server/routes/consultant.js:321](../../../../server/routes/consultant.js#L321) `POST /clients`, [:449](../../../../server/routes/consultant.js#L449) `POST /clients/enrich` | ✅ |
| **Consultant per-client reads** | **Do not exist yet** — to be added in #184a as `GET /api/consultant/clients/:id/{profile,objectives,goals/quarterly,goals/weekly,teams,assessments,dashboard-summary}` | ✅ Consultant-scoped surface (right layer) |
| **`PUT /api/auth/switch-company`** | [server/routes/auth.js:437-504](../../../../server/routes/auth.js#L437-L504) | ⚠️ Validates `managed_businesses` membership server-side **correctly**, but the *existence* of this route invites the JWT-swap pattern. Per D5: route stays alive for legacy admin / future BUSINESS_OWNER multi-org; consultant frontend callers retire in #184c |
| **Tenant-native CRUD** | [server/routes/objectives.js](../../../../server/routes/objectives.js), [goals.js](../../../../server/routes/goals.js), [companies.js](../../../../server/routes/companies.js), [teams.js](../../../../server/routes/teams.js), [assessments.js](../../../../server/routes/assessments.js) | ✅ JWT-derived `company_id`, no role branching |
| **Consultant write paths to client tenants** | Only via [companies.js](../../../../server/routes/companies.js) (#182 added per-consultant unlink via `User.managed_businesses` $pull); no direct write to client objectives/goals/tasks | ✅ Read-only philosophy enforced today |
| **Invitation lifecycle** | [server/routes/invitations.js:37](../../../../server/routes/invitations.js#L37) `GET /validate/:token` (public), [:105](../../../../server/routes/invitations.js#L105) `POST /accept/:token` (public), [:1368](../../../../server/routes/invitations.js#L1368) `POST /create-company-invitation` (CONSULTANT) | ✅ Public accept routes exist; consultant-scoped create exists. #184d wires Mailjet + transitions stage |
| **Mailjet config** | [server/services/mailjetService.js](../../../../server/services/mailjetService.js) — has `sendCompanyInvitationEmail()` at :196, `sendAssessmentInvitation()` at :32 | ⚠️ NEEDS-VERIFY — template IDs not greppable from code (likely env vars). #184d audit task #1: dry-run template before scoping |
| **Stage transitions** | Stage default `prospect` set in [companies.js POST flow](../../../../server/routes/companies.js); no automatic transitions | ⚠️ #184e adds post-save hooks |

**Middleware verdict**: ✅ Clean. RBAC, tenant scope, validation all live in middleware. The `switch-company` route is an architectural artifact, not a leak — it stays alive but is no longer the consultant's path.

---

## Layer 3 — Backend / Data Model (Truth)

| Model | Tenant fields | Indexes | Sprint 22a touches? |
|---|---|---|---|
| [User.js](../../../../server/models/User.js) | `company_id`, `current_company_id`, `managed_businesses[]` | `{company_id:1, email:1}` unique sparse [:289](../../../../server/models/User.js#L289), `{company_id:1, role:1}` [:295](../../../../server/models/User.js#L295) | No model change — #184d creates User on POC accept |
| [Company.js](../../../../server/models/Company.js) | self (tenant root) | `stage` enum at [:81](../../../../server/models/Company.js#L81) | #184e adds `stage_history[]` sub-doc + post-save hooks; no schema rewrite |
| [Invitation.js](../../../../server/models/Invitation.js) | `company_id`, `recipient_email`, `invitation_type` | (read-time fields verified) | No model change — #184d uses existing fields |
| [Objective.js](../../../../server/models/Objective.js) | `company_id` | Five tenant-leading indexes [:313-317](../../../../server/models/Objective.js#L313-L317) | Read-only via #184a |
| [KeyResult.js](../../../../server/models/KeyResult.js) | `company_id`, `objective_id` | `{company_id:1, objective_id:1}` [:100](../../../../server/models/KeyResult.js#L100) | Read-only via #184a |
| [Goal.js](../../../../server/models/Goal.js) | `company_id`, `objective_id`, `key_result_id`, `parent_goal_id` | Six tenant-leading indexes [:309-319](../../../../server/models/Goal.js#L309-L319) | Read-only via #184a |
| [WeeklyGoal.js](../../../../server/models/WeeklyGoal.js) | `company_id`, `key_result_id` | Three tenant-leading indexes [:103-105](../../../../server/models/WeeklyGoal.js#L103-L105) | Read-only via #184a |
| [Team.js](../../../../server/models/Team.js) | `company_id` | `{company_id:1, name:1}` unique [:142](../../../../server/models/Team.js#L142) | Read-only via #184a |
| [AIInteractionLog.js](../../../../server/models/AIInteractionLog.js) | `company_id` | `{company_id:1, created_at:-1}` [:164](../../../../server/models/AIInteractionLog.js#L164) | No change |

**Backend verdict**: ✅ Clean. Tenant-leading compound indexes are universal across the operational dataset. No JWT-swap state lives in the data model. `User.current_company_id` is the only schema field that exists *because* of the JWT-swap pattern — once #184c retires the consultant frontend usage, the field becomes legacy-admin-only.

---

## Layer 4 — AI Orchestrator (Intelligence)

| Sub-service | Lives in | State |
|---|---|---|
| **Context Builder** | [server/services/AIContextService.js:2151](../../../../server/services/AIContextService.js#L2151) `assembleContext()` + [:2118-2126](../../../../server/services/AIContextService.js#L2118-L2126) operation→provider map (4 ops: objective-creation, kr-generation, weekly-goal-creation, move-generation) | ✅ Centralized, w/ stable cache key (`_stableKey`), per-op TTL (300/300/180/120s), provider cache (Sprint 22 #177) |
| **Provider layer** | [server/services/providers/](../../../../server/services/providers/) — CompanyProvider, AssessmentProvider, DisciplineProvider, ObjectiveProvider, KeyResultProvider, WeeklyGoalProvider, index.js | ✅ Six providers wired at [AIContextService.js:2220-2225](../../../../server/services/AIContextService.js#L2220-L2225) |
| **Prompt Builder** | Inside [aiOKRService.js](../../../../server/services/aiOKRService.js) — 4 prompt builders for objectives/KRs/weekly-goals/moves (Sprint 22 #178) | ⚠️ Centralized for the cascade flow, but **other AI features build prompts inline in route handlers** (see leaks below) |
| **Policy Layer** | Implicit — RBAC at route level decides who can call AI; no explicit "what AI is allowed to do per role" gate | ⚠️ Acceptable for now (route guards do the job), but flag for future — particularly when consultant-vs-client AI surfaces diverge |
| **LLM Gateway** | Should be the single chokepoint; today it's [aiOKRService.js:6](../../../../server/services/aiOKRService.js#L6) `OpenAI` import + `callOpenAIWithRetry()` | ❌ **Leaky** — 7 other files import `openai` directly (see findings) |
| **Response Parser** | 4 parsers in [aiOKRService.js](../../../../server/services/aiOKRService.js) w/ min1/max5 bounds (D-F-4) | ✅ For cascade ops; other AI features parse inline |
| **Memory Writer** | [AIInteractionLog](../../../../server/models/AIInteractionLog.js), [Company.llm_context](../../../../server/models/Company.js) (D-X-3 from Sprint 13 #79), `getContextDelta` / `updateLLMInteraction` in AIContextService | ✅ Provenance + deltas captured |

**AI Orchestrator verdict**: ⚠️ Mostly clean. The **cascade ops** (4 ops covered by AIContextService + aiOKRService + providers) are textbook. **Legacy AI features** (planning, ai-okr endpoints, objective wizard, AIObjectivePlanner, AIEstimator, SSINarrativeService) still bypass the gateway — 7 direct `require('openai')` outside the orchestrator.

---

## Frozen as-is map: layer leak summary

| Leak # | Layer | Location | Severity | Sprint 22a target |
|---|---|---|---|---|
| L-1 | FE → MW | [common.js:637](../../../../client/js/common.js#L637) `ensureActiveCompany()` | C | #184c |
| L-2 | FE → MW | [navigation.js:344-378](../../../../client/js/navigation.js#L344-L378) company switcher | H | #184c (+ already CONSULTANT-suppressed at :162,:234) |
| L-3 | FE → MW | [navigation.js:406-484](../../../../client/js/navigation.js#L406-L484) "Viewing as" purple banner | C | #184c |
| L-4 | FE → MW | [navigation.js:489+](../../../../client/js/navigation.js#L489) `switchToOwnCompany()` | H | #184c |
| L-5 | FE → MW | [my-clients.js:30](../../../../client/pages/scripts/my-clients.js#L30) `navigateToClient()` calls switch-company before navigate | C | #184c (frontend repoints to `client-workspace.html?client=X`, no swap) |
| L-6 | MW → AI-O | [routes/ai-okr.js:1677,2561](../../../../server/routes/ai-okr.js#L1677), [routes/planning.js:17](../../../../server/routes/planning.js#L17), [routes/objective-wizard.js:15](../../../../server/routes/objective-wizard.js#L15) — direct `require('openai')` in route handlers | H | Defer to Sprint 23 (not on consultant↔client critical path) |
| L-7 | MW → AI-O | [services/AIObjectivePlanner.js:26](../../../../server/services/AIObjectivePlanner.js#L26), [AIEstimator.js:7](../../../../server/services/AIEstimator.js#L7), [SSINarrativeService.js:17](../../../../server/services/SSINarrativeService.js#L17) — direct OpenAI in legacy services | H | Defer to Sprint 23 |
| L-8 | MW → ? | `User.current_company_id` exists *because* of JWT-swap | L | After #184c, document as legacy-admin-only or schedule deprecation |

---

**Sign-off requirement**: This map is the agreed as-is reference. Any deviation found during #184a-e becomes a documented amendment, not a silent fix.
