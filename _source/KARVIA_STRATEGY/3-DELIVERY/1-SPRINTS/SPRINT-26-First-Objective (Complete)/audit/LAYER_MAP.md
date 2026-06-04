# Layer Map — OKR Creation Flow (As-Is)

<!-- @GENOME T3-SPR-026-AUDIT-LAYER-MAP | ACTIVE | 2026-05-15 | parent:T3-SPR-026-AUDIT-ARCH | auto:- | linked:/audit-architecture -->

Frozen snapshot of where each concern lives today across the 4 layers, with file:line evidence. Drives the leak findings in [ARCH_AUDIT_REPORT.md](ARCH_AUDIT_REPORT.md).

---

## Frontend Layer

| Concern | File:Line | Should it live here? |
|---|---|---|
| AI modal 3-step wizard (Category → What → Review) | [client/pages/objectives.html:580-783](../../../client/pages/objectives.html#L580) | ✅ pure UI |
| Period selector (4 presets + custom dates) — A20260515-02 part 1 | [client/pages/objectives.html:735-747](../../../client/pages/objectives.html#L735) | ✅ rendering OK · ⚠️ business rule mappings leak (`ARCH-FE-001`) |
| Period helpers (`isWizardPeriodWithinBounds`, `deriveWizardDurationMonths`, `computeWizardPeriodFromPreset`) | [client/pages/objectives.html:2700-2761](../../../client/pages/objectives.html#L2700) | ❌ duplicated business rule (`ARCH-FE-003`) |
| Standalone wizard period UI (B1.1) | [client/pages/objective-wizard.html](../../../client/pages/objective-wizard.html) + [scripts/objective-wizard.js:332-365](../../../client/pages/scripts/objective-wizard.js#L332) | ❌ same duplication (`ARCH-FE-003`) |
| Cohort variant picker `pickCohortVariant(role, mode)` | [client/pages/scripts/ai-okr-review.js:728-734](../../../client/pages/scripts/ai-okr-review.js#L728) | ❌ business mapping in FE (`ARCH-FE-002`) |
| Cohort copy strings (`AIOKR_REVIEW_COPY`, 3 variants) | [client/pages/scripts/ai-okr-review.js:12-39](../../../client/pages/scripts/ai-okr-review.js#L12) | ✅ copy IS UI concern |
| Role permission check (`canManageTasks`, `MANAGER_PLUS_ROLES`) | [client/pages/scripts/planning-v2.js:33,91](../../../client/pages/scripts/planning-v2.js#L33) | ❌ RBAC source-of-truth must be BE (`ARCH-FE-004`) |
| Planning page render (obj cards w/ dates + week pill, KR list, weekly stack) | [client/pages/planning-v2.html](../../../client/pages/planning-v2.html) + [scripts/planning-v2.js](../../../client/pages/scripts/planning-v2.js) | ✅ rendering OK · ⚠️ DB shape + client-side join (`ARCH-FE-005`/`ARCH-FE-006`) |
| Date range + week pill display helpers (`formatObjectiveDateRange`, `ObjectiveCalculator.calculateWeekProgress`) | [client/pages/scripts/planning-v2.js:325-355](../../../client/pages/scripts/planning-v2.js#L325) + [objective-calculator.js:87-113](../../../client/pages/scripts/objective-calculator.js#L87) | ✅ display computation OK |
| Display labels (lifecycle, stage, move-status, role labels) | [client/js/display-labels.js](../../../client/js/display-labels.js) | ✅ test-parity asserted (`ARCH-FE-008` low) |

---

## Middleware Layer (Routes + Services)

### Routes — OKR creation paths

| Route | File:Line | Purpose | Layer health |
|---|---|---|---|
| `POST /api/objective-wizard/initialize-session` | [objective-wizard.js](../../../server/routes/objective-wizard.js) | Open wizard session | ✅ |
| `POST /api/objective-wizard/refine-objective` | [objective-wizard.js:265](../../../server/routes/objective-wizard.js#L265) | LLM call — refine user text | ❌ no `LLMPolicy.check()` (`ARCH-AI-002`) |
| `POST /api/objective-wizard/generate-krs` | [objective-wizard.js:413](../../../server/routes/objective-wizard.js#L413) | LLM call — generate KRs | ❌ same |
| `POST /api/objective-wizard/regenerate-kr` | [objective-wizard.js:543](../../../server/routes/objective-wizard.js#L543) | LLM call — regenerate one KR | ❌ same |
| `POST /api/objective-wizard/finalize` | [objective-wizard.js:653-1069](../../../server/routes/objective-wizard.js#L653) | Persist Objective + KR | ✅ correct (custom branch + KR derivation after A20260515-02) |
| `POST /api/goals/quarterly` / PUT | [goals.js:1010,1093](../../../server/routes/goals.js#L1010) | Goal CRUD | ⚠️ `validateGoalDateHierarchy` wrapper inline in route file (`ARCH-MW-002`) |
| `POST /api/goals/weekly` / PUT | [goals.js:1575,1707](../../../server/routes/goals.js#L1575) | Goal CRUD | ⚠️ same |
| `GET /api/companies/:id` | [companies.js:109-170](../../../server/routes/companies.js#L109) | Returns company + cohort field (C.3) | ✅ tenant-safe (`getAssignedConsultant` runs AFTER access validation) |
| `GET /api/ai-okr/*` | [ai-okr.js:3400+](../../../server/routes/ai-okr.js#L3400) | AI OKR suggestion endpoints | ⚠️ inline RBAC vs middleware (`ARCH-MW-001`) |

### Services

| Service | File | Role | Layer health |
|---|---|---|---|
| `ValidationService` | [server/services/ValidationService.js](../../../server/services/ValidationService.js) | Pure validators (validateGoalDates, validateTaskDates, validateBulkGoals) | ✅ pure |
| `DateService` | [server/services/DateService.js](../../../server/services/DateService.js) | Canonical date math (validateDateHierarchy, fiscal quarter calcs) | ✅ pure · ⚠️ duration math duplicated (`ARCH-MW-004`) |
| `cohortDetection` | [server/utils/cohortDetection.js](../../../server/utils/cohortDetection.js) | `getAssignedConsultant(companyId)` | ✅ correct multi-tenant predicate |
| `WizardSessionService` | [server/services/WizardSessionService.js](../../../server/services/WizardSessionService.js) | Wizard state holder, ownership check | ✅ correct |
| `auth.js` middleware | [server/middleware/auth.js](../../../server/middleware/auth.js) | `authenticateToken` + `requireRole` | ✅ correct — but not consistently applied (`ARCH-MW-001`, `ARCH-AI-002`) |

---

## Backend (Data Model) Layer

| Model | File:Line | Date-related fields | Layer health |
|---|---|---|---|
| `Objective` | [server/models/Objective.js](../../../server/models/Objective.js) | `time_period_type`, `start_date`, `end_date`, `target_year` (with A20260515-02 JSDoc), `duration_months` | ✅ post-fix · ⚠️ cross-year not enforced (`ARCH-DB-004`); display virtuals at lines 415-507 (`ARCH-DB-007`) |
| `Objective.key_results[]` (embedded) | [Objective.js:170-228](../../../server/models/Objective.js#L170) | `quarter` (req), `due_date`, `completion_date` | ❌ cleanup-target marker; dual-write hazard (`ARCH-DB-001`) |
| `KeyResult` (standalone) | [server/models/KeyResult.js](../../../server/models/KeyResult.js) | `quarters[]`, `year` (= Objective.target_year per D-A-4) | ⚠️ no start/end dates — calendar-quarter anchored only (D-3 documented limit) |
| `Goal` | [Goal.js:17-339](../../../server/models/Goal.js#L17) | `time_period` (Q/W), `start_date`, `due_date`, `window_name` (B3a), `quarter` (optional post-B3a), `year` (REQ for WEEKLY), `week` (REQ for WEEKLY) | ⚠️ project-mode index gap (`ARCH-DB-002`); business logic in `pre('save')` (`ARCH-DB-003`); display virtuals (`ARCH-DB-007`) |
| `Task` | [Task.js:65-352](../../../server/models/Task.js#L65) | `due_date` (REQ), `start_date` | ⚠️ missing `{company_id, objective_id, status}` index (`ARCH-DB-006`); business logic in `pre('save')` (`ARCH-DB-003`) |
| `Company` | [Company.js:590-596](../../../server/models/Company.js#L590) | (cohort is route-computed, not stored) | ⚠️ virtual returns undefined for `cohort` while route attaches it (`ARCH-DB-005`) |
| `WeeklyGoal` (separate) | [server/models/WeeklyGoal.js](../../../server/models/WeeklyGoal.js) | `target_week`, `target_year` | ⚠️ overlaps with `Goal(time_period=WEEKLY)` semantically — possible deprecation candidate |
| `Move` | [server/models/Move.js](../../../server/models/Move.js) | `due_date` | ⚠️ index `{assigned_to, due_date}` lacks `company_id` prefix |

---

## AI Orchestrator Layer (6 Sub-Services)

| Sub-service | File:Line | Status |
|---|---|---|
| Context Builder | [server/services/AIContextService.js:141-259](../../../server/services/AIContextService.js#L141) | ⚠️ present; tenant cache-key gap (`ARCH-AI-001`) |
| Prompt Builder | [server/prompts/endpoint-templates/](../../../server/prompts/endpoint-templates/) — `single-objective.js`, `okr-generation.js`, `task-suggestion.js`, etc. | ✅ present; minor version-string gap |
| Policy Layer | [server/services/LLMPolicy.js:1-134](../../../server/services/LLMPolicy.js) | ❌ scaffolded, NOT enforced on wizard routes (`ARCH-AI-002`) |
| LLM Gateway | [server/services/LLMGateway.js](../../../server/services/LLMGateway.js) — retries, timeouts, cascade cap, provider abstracted | ✅ strong |
| Response Parser | [objective-wizard.js:117-135](../../../server/routes/objective-wizard.js#L117) (`parseAIResponse`) | ⚠️ no schema validation (`ARCH-AI-003`); silent KR truncation (`ARCH-AI-004`) |
| Memory Writer | [objective-wizard.js:935,978](../../../server/routes/objective-wizard.js#L935) (`ai_generated: true`) | ✅ present; minor provenance gap (`ARCH-AI-006`) |

---

## Cross-layer leaks (summary)

| Leak | From → To | Findings |
|---|---|---|
| Period math (1-36 month, 30.4375 days/month, presets 90d/6mo/12mo) | FE + MW (duplicated) | `ARCH-FE-001`, `ARCH-FE-003`, `ARCH-MW-004` |
| Cohort variant decision (role + mode → variant key) | FE owns it | `ARCH-FE-002` |
| RBAC for LLM ops (`CONSULTANT`/`BO`/`EXEC` only) | MW route handler + (scaffolded) Policy Layer | `ARCH-AI-002`, `ARCH-MW-001` |
| DB schema shape (`_source` field, `week_number` fallback) | DB → FE leak | `ARCH-FE-005` |
| `validateGoalDateHierarchy` orchestration (parent lookup + bridge) | Route file inline (should be Service) | `ARCH-MW-002` |
| Status-flip business logic (`at_risk` auto-mark, subtask progress) | DB pre-save hook (should be Service) | `ARCH-DB-003` |
| Display labels on data models (`health_status`, `quarter_display`) | DB virtuals (should be Service projection) | `ARCH-DB-007` |
