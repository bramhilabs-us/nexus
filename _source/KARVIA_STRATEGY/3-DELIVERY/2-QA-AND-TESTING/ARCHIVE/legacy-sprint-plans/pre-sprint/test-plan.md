# Pre-Sprint Automated Test Plan (Atlas)

**Week**: Pre-Sprint Enablement  
**Date Range**: 3 Nov 2025 – 9 Nov 2025  
**Status**: 📋 Planned  
**Coverage Target**: ≥80% overall, 100% for critical paths  
**Atlas Suite**: `atlas-pre-sprint-core`  
**Planned Test Files**: 9 (6 unit, 2 integration, 1 e2e)  
**Planned Test Cases**: 21 (0 executed)

---

## 📊 Planned Test Summary

| Category | Planned Tests | Status | Target Coverage Notes |
|----------|---------------|--------|-----------------------|
| Unit Tests | 12 | ⬜ Planned | New coverage for `SSIScoringService`, helpers, UI presenters |
| Integration Tests | 6 | ⬜ Planned | API behaviour for assessments + AI OKR endpoints |
| E2E Tests | 3 | ⬜ Planned | Atlas Playwright flow across Team Results → OKRs → Objectives |
| **Total** | **21** | ⬜ Planned | Run nightly in Atlas pipeline |

---

## 🎯 Scope Alignment

- Weighted team aggregation & function grouping per `PRE_SPRINT_IMPLEMENTATION.md` (Day 1 tasks).  
- AI OKR generation/approval workflow per `PRE_SPRINT_IMPLEMENTATION.md` (Day 2).  
- Team Results UI delivery + bug fixes from `PRE_SPRINT_IMPLEMENTATION.md` Day 3–4.  
- Navigation, role access, and regression coverage per `PRE_SPRINT_AUDIT_COMPLETE.md` findings.

---

## 🧩 Task-Level Test Cases

### **Task 1: Weighted Team Aggregation Enhancements**
**Priority**: P0  
**Test Coverage Target**: 95% (`SSIScoringService`)  
**Primary Test Files**:
- `tests/unit/services/SSIScoringService.aggregateTeamScoresWeighted.test.js`
- `tests/unit/services/SSIScoringService.groupAssessmentsByFunction.test.js`

#### TC-PS-001: Weighted averages respect role multipliers
- **Type**: Unit
- **Priority**: P0
- **Test File**: `tests/unit/services/SSIScoringService.aggregateTeamScoresWeighted.test.js`
- **Description**: Validate role weights (EXECUTIVE=3, MANAGER=2, EMPLOYEE=1) produce correct composite and totals.
- **Preconditions**:
  - Import `assessment-config.js` defaults.
  - Mock assessments fixture with mixed roles and SSI scores.
- **Test Steps**:
  1. Invoke `aggregateTeamScoresWeighted` with fixture data.
  2. Assert participant count equals array length.
  3. Assert composite matches weighted arithmetic mean within ±0.01.
  4. Assert `total_weight` equals `3+2+1`.
- **Expected Result**: Returns object with accurate weighted averages, participant count, and total weight.
- **Automation Notes**: Use deterministic fixtures under `tests/fixtures/assessments.weighted.json`.
- **Status**: ⬜ Planned

#### TC-PS-002: Default weight fallback for unknown role
- **Type**: Unit
- **Priority**: P1
- **Test File**: `tests/unit/services/SSIScoringService.aggregateTeamScoresWeighted.test.js`
- **Description**: Unknown roles should default weight=1 without throwing.
- **Preconditions**: Fixture includes assessment lacking `user_id.role`.
- **Steps**:
  1. Call method with fixture.
  2. Verify total_weight increments by 1 for undefined role.
- **Expected**: Method returns valid scores; no exception thrown.
- **Status**: ⬜ Planned

#### TC-PS-003: Zero assessments returns safe defaults
- **Type**: Unit
- **Priority**: P1
- **Test File**: `tests/unit/services/SSIScoringService.aggregateTeamScoresWeighted.test.js`
- **Steps**:
  1. Call method with empty array.
  2. Assert numeric fields equal 0 and participant_count = 0.
- **Expected**: Safe-zero object to prevent frontend crashes.
- **Status**: ⬜ Planned

#### TC-PS-004: Function grouping clusters assessments correctly
- **Type**: Unit
- **Priority**: P1
- **Test File**: `tests/unit/services/SSIScoringService.groupAssessmentsByFunction.test.js`
- **Description**: Ensure grouping by `user_id.function` with default bucket `General`.
- **Steps**:
  1. Supply assessments from two functions and one missing function.
  2. Expect object with keys `Sales/Marketing`, `Operations`, `General`.
- **Expected**: Arrays contain original document references preserving order.
- **Status**: ⬜ Planned

#### TC-PS-005: Weak area identification honors config threshold
- **Type**: Unit
- **Priority**: P0
- **Test File**: `tests/unit/services/SSIScoringService.aggregateTeamScoresWeighted.test.js`
- **Description**: Combined flow ensures returned structure includes weak areas < 70.
- **Steps**:
  1. Aggregate scores below threshold.
  2. Pass results through `identifyWeakAreas`.
- **Expected**: Weak areas array matches dimensions under threshold.
- **Status**: ⬜ Planned

### **Task 2: Assessments Team Endpoint Expansion**
**Priority**: P0  
**Test Coverage Target**: 85% (`GET /api/assessments/team/:company_id`)  
**Primary Test File**: `tests/integration/api/assessments.team.integration.test.js`

#### TC-PS-006: Happy path returns weighted team & function breakdown
- **Type**: Integration
- **Priority**: P0
- **Test File**: `tests/integration/api/assessments.team.integration.test.js`
- **Description**: Valid manager token yields weighted team summary, function segments, weak areas, and metadata.
- **Preconditions**:
  - Seed Mongo test DB with completed assessments across functions.
  - Authenticate as MANAGER role.
- **Steps**:
  1. Hit `GET /api/assessments/team/:companyId`.
  2. Assert response `success=true`.
  3. Validate payload keys: `team_scores`, `function_scores`, `weak_areas`, `participant_count`, `total_weight`.
  4. Verify function entries mirror `groupAssessmentsByFunction` output.
- **Expected**: HTTP 200 with complete enriched payload.
- **Status**: ⬜ Planned

#### TC-PS-007: Unauthorized roles blocked
- **Type**: Integration
- **Priority**: P0
- **Test File**: `tests/integration/api/assessments.team.integration.test.js`
- **Description**: EMPLOYEE token receives 403 with error message.
- **Steps**:
  1. Authenticate as EMPLOYEE.
  2. Call endpoint.
- **Expected**: HTTP 403, `success=false`, `error='Insufficient permissions'`.
- **Status**: ⬜ Planned

#### TC-PS-008: No completed assessments returns safe object
- **Type**: Integration
- **Priority**: P1
- **Test File**: `tests/integration/api/assessments.team.integration.test.js`
- **Steps**:
  1. Seed company without completed assessments.
  2. Call endpoint.
- **Expected**: HTTP 200, zeroed scores, empty function map, `participant_count=0`.
- **Status**: ⬜ Planned

#### TC-PS-009: Cross-company access forbidden
- **Type**: Integration
- **Priority**: P1
- **Test File**: `tests/integration/api/assessments.team.integration.test.js`
- **Steps**:
  1. Auth as MANAGER from company A.
  2. Request company B results.
- **Expected**: HTTP 404/403 (based on existing middleware) with no data leak.
- **Status**: ⬜ Planned

### **Task 3: AI OKR Team Generation & Approval**
**Priority**: P0  
**Test Coverage Target**: 90% across endpoints  
**Primary Test Files**:
- `tests/integration/api/aiOkr.generateFromTeam.integration.test.js`
- `tests/integration/api/aiOkr.approveDraft.integration.test.js`

#### TC-PS-010: Generates four objectives from team aggregate
- **Type**: Integration
- **Priority**: P0
- **Description**: Validate response structure with 4 objectives × 4 key results using seeded assessments.
- **Preconditions**:
  - Stub OpenAI client via existing mock.
  - Provide aggregated scores fixture.
- **Steps**:
  1. POST `/api/ai-okr/generate-from-team` with team payload (companyId, filters).
  2. Assert HTTP 200 and `data.objectives.length === 4`.
- **Expected**: Each objective returns with 4 key results, metadata, and `status='draft'`.
- **Status**: ⬜ Planned

#### TC-PS-011: Regeneration rate limit enforced (max 3)
- **Type**: Integration
- **Priority**: P0
- **Steps**:
  1. Trigger generation thrice for same team session.
  2. Fourth call should return HTTP 429 (or configured error) with descriptive message.
- **Expected**: Atlas assertion on error body `error.code === 'REGEN_LIMIT'`.
- **Status**: ⬜ Planned

#### TC-PS-012: Draft approval persists objectives
- **Type**: Integration
- **Priority**: P0
- **Steps**:
  1. Insert draft suggestion in DB.
  2. POST `/api/ai-okr/approve-draft/:id`.
  3. Assert response success.
  4. Fetch `/api/objectives?companyId=...` to confirm persisted records.
- **Expected**: Draft transitions to `approved`, objectives accessible to Objective UI.
- **Status**: ⬜ Planned

#### TC-PS-013: Approval enforces role authorization
- **Type**: Integration
- **Priority**: P1
- **Steps**:
  1. Attempt approval with MANAGER role lacking permission.
  2. Expect HTTP 403.
- **Status**: ⬜ Planned

### **Task 4: Team Results Dashboard UI**
**Priority**: P0  
**Test Coverage Target**: 3 Atlas Playwright scenarios  
**Primary Test File**: `tests/e2e/critical-paths/team-results-to-okr.e2e.spec.ts`

#### TC-PS-014: Render weighted team dashboard
- **Type**: E2E
- **Priority**: P0
- **Description**: Ensure UI surfaces weighted scores, weak badges, participant counts.
- **Preconditions**:
  - Seed test tenant with assessments + mock API responses.
  - Launch Playwright against Atlas staging URL.
- **Test Steps**:
  1. Login as MANAGER via UI helper.
  2. Navigate to `/team-results-dashboard`.
  3. Wait for API call to `/api/assessments/team/:companyId`.
  4. Assert cards display weighted averages (text match, progress bars >0).
  5. Validate weak areas list matches API payload.
- **Expected Result**: Dashboard renders without console errors; data matches API fixture.
- **Status**: ⬜ Planned

#### TC-PS-015: Function filters reshape charts
- **Type**: E2E
- **Priority**: P1
- **Steps**:
  1. Toggle function filter (e.g., Operations).
  2. Wait for filtered panel update.
  3. Assert displayed numbers correspond to selected function.
- **Expected**: UI updates within 500ms; no stale data.
- **Status**: ⬜ Planned

#### TC-PS-016: Manager generates and approves team OKRs
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. From dashboard, click `Generate Team OKRs`.
  2. Confirm modal shows attempt counter (max 3).
  3. Approve first objective set.
  4. Navigate to `/objectives.html`.
  5. Verify new objectives appear with status `Approved`.
- **Expected**: Full flow completes; toast confirmations captured; data persists in UI.
- **Status**: ⬜ Planned

### **Task 5: Regression Coverage for Existing Flows**
**Priority**: P1  
**Primary Test Files**:
- `tests/unit/routes/assessments.teamLegacyBehavior.test.js`
- `tests/e2e/critical-paths/objectives-regression.e2e.spec.ts`

#### TC-PS-017: Legacy aggregate API response shape maintained
- **Type**: Unit (schema contract via snapshot)
- **Priority**: P1
- **Description**: Ensure additional fields do not break existing consumers.
- **Expected**: Snapshot includes old keys + new ones; tests fail on breaking changes.
- **Status**: ⬜ Planned

#### TC-PS-018: Objectives page regression test
- **Type**: E2E
- **Priority**: P1
- **Steps**:
  1. Seed with existing objectives.
  2. Visit `/objectives.html`.
  3. Verify prior bug (empty list) no longer reproducible.
- **Expected**: Objectives render for MANAGER and EXEC roles.
- **Status**: ⬜ Planned

### **Task 6: Navigation and Role Access**
**Priority**: P1  
**Primary Test Files**:
- `tests/unit/components/NavMenu.teamResultsLink.test.js`
- `tests/e2e/critical-paths/navigation-role-matrix.e2e.spec.ts`

#### TC-PS-019: Team Results nav item appears for authorized roles
- **Type**: Unit (React/Vue component test depending on framework)
- **Priority**: P1
- **Expected**: Nav config includes new route for MANAGER, EXECUTIVE, BUSINESS_OWNER, CONSULTANT.
- **Status**: ⬜ Planned

#### TC-PS-020: Unauthorized users blocked from UI route
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. Login as EMPLOYEE.
  2. Attempt to navigate to `/team-results-dashboard`.
- **Expected**: Redirect to dashboard with error toast; network call aborted (403).
- **Status**: ⬜ Planned

### **Task 7: Performance Guardrails**
**Priority**: P2  
**Primary Test File**: `tests/integration/perf/assessments.team.performance.test.js`

#### TC-PS-021: Team endpoint responds within SLA
- **Type**: Integration (performance threshold)
- **Priority**: P2
- **Description**: Ensure response time <500ms for 200 assessments using mocked timers.
- **Status**: ⬜ Planned

---

## 🔧 Atlas Automation Checklist

- [ ] Add new test suites to `atlas-pre-sprint-core` manifest.  
- [ ] Configure fixtures in `tests/fixtures/atlas/pre-sprint/`.  
- [ ] Update CI pipeline to run Playwright tests with `--project=atlas`.  
- [ ] Publish coverage to `QA/reports/Pre_Sprint/coverage/`.

---

## 📝 Notes & Risks

- Mocking OpenAI interactions is mandatory; rely on existing `tests/helpers/mocks/openai.mock.js`.  
- Ensure company scoping honoured across fixtures to prevent false positives.  
- Monitor regeneration limit test for race conditions; use deterministic session IDs.  
- Coordinate with data team to refresh Atlas staging data nightly.

---

**Plan Created**: 6 Nov 2025  
**Next Review**: Upon completion of Pre-Sprint QA sign-off
