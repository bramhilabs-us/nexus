# Sprint 1 Automated Test Plan (Atlas)

**Sprint**: Sprint 1 – Core Workflow Foundation  
**Date Range**: 10 Nov 2025 – 23 Nov 2025  
**Status**: 📋 Planned  
**Coverage Target**: ≥82% sprint scope, ≥95% for Goal Management workflows  
**Atlas Suite**: `atlas-sprint1-core`  
**Planned Test Files**: 14 (8 unit, 4 integration, 2 e2e)  
**Planned Test Cases**: 34 (0 executed)

---

## 📊 Planned Test Summary

| Category | Planned Tests | Status | Target Coverage Notes |
|----------|---------------|--------|-----------------------|
| Unit Tests | 18 | ⬜ Planned | `GoalAPIClient`, reducers, utilities, UI presenters |
| Integration Tests | 10 | ⬜ Planned | Goals/Tasks/Business APIs with Supertest |
| E2E Tests | 6 | ⬜ Planned | Manager & Employee journeys via Atlas Playwright |
| **Total** | **34** | ⬜ Planned | Executed nightly + pre-merge in Atlas |

---

## 🎯 Scope Alignment

- Goal creation/assignment/update flows (`MGR-015` → `MGR-018`, `EMP-013` → `EMP-016`).  
- Business management API enhancements (`OWNER-001` → `CONS-001`).  
- Task management completion (`EMP-007` → `MGR-010`).  
- Executive approval workflows (`EXEC-010`, `EXEC-011`).  
- Sprint definitions per `SPRINT_1_IMPLEMENTATION_GUIDE.md`.

---

## 🧩 Task-Level Test Cases

### **Task 1: Goal API Client Implementation**
**Priority**: P0  
**Coverage Target**: 95% per method  
**Primary Test File**: `tests/unit/clients/goalApiClient.test.js`

#### TC-S1-001: Lists goals with filters
- **Type**: Unit (with fetch mock)
- **Priority**: P0
- **Description**: `GoalAPIClient.listGoals` issues GET including filter query string.
- **Preconditions**: Mock `fetch` via `jest-fetch-mock`.
- **Steps**:
  1. Invoke `listGoals({ status: 'active', quarter: '2025-Q1' })`.
  2. Assert fetch called with `/api/goals?status=active&quarter=2025-Q1`.
  3. Resolve mock response and ensure JSON returned.
- **Expected**: Method returns parsed goals array; request uses auth header helper.
- **Status**: ⬜ Planned

#### TC-S1-002: Creates goal payload with defaults
- **Type**: Unit
- **Priority**: P0
- **Test File**: `tests/unit/clients/goalApiClient.test.js`
- **Steps**:
  1. Call `createGoal` with minimal payload.
  2. Assert POST to `/api/goals` with JSON string body.
  3. Validate `Content-Type` header present.
- **Expected**: Promise resolves to server response; throws on 4xx.
- **Status**: ⬜ Planned

#### TC-S1-003: Assign goal to user
- **Type**: Unit
- **Priority**: P0
- **Description**: `assignGoal` issues PUT `/api/goals/:id/assign`.
- **Expected**: Request includes body `{ userId }`; handles 204.
- **Status**: ⬜ Planned

#### TC-S1-004: Update progress surfaces validation errors
- **Type**: Unit
- **Priority**: P1
- **Description**: 422 response should reject with descriptive error to UI.
- **Status**: ⬜ Planned

### **Task 2: Quarterly Goals Page**
**Priority**: P0  
**Coverage Target**: Playwright + component tests  
**Primary Test Files**:
- `tests/unit/pages/quarterlyGoals.presenter.test.js`
- `tests/e2e/critical-paths/manager-quarterly-goals.e2e.spec.ts`

#### TC-S1-005: Renders goals list with progress
- **Type**: Unit (presenter/view-model)
- **Priority**: P1
- **Description**: Presenter maps API response to UI cards with correct progress percent and owner avatars.
- **Status**: ⬜ Planned

#### TC-S1-006: Manager creates quarterly goal via UI
- **Type**: E2E
- **Priority**: P0
- **Preconditions**: Atlas dataset seeded with objectives.
- **Steps**:
  1. Login as MANAGER.
  2. Navigate to `/quarterly-goals.html`.
  3. Click `Create Goal`, complete form (title, KR mapping, due dates).
  4. Submit and intercept POST `/api/goals`.
  5. Assert toast success, new goal appears in list.
- **Expected**: Goal persists; network call returns 201.
- **Status**: ⬜ Planned

#### TC-S1-007: Filters by quarter updates view
- **Type**: E2E
- **Priority**: P1
- **Description**: Changing quarter filter triggers new API call and UI refresh.
- **Status**: ⬜ Planned

### **Task 3: Goal Details & "Why Chain" Context**
**Priority**: P0  
**Primary Test Files**:
- `tests/unit/pages/goalDetails.whyChain.test.js`
- `tests/e2e/critical-paths/manager-goal-details.e2e.spec.ts`

#### TC-S1-008: Why Chain renders correct hierarchy
- **Type**: Unit
- **Priority**: P0
- **Description**: Given goal object, `renderWhyChain` returns nodes linking Task → Goal → Key Result → Objective → Mission.
- **Expected**: Node order maintained; fallback text when data missing.
- **Status**: ⬜ Planned

#### TC-S1-009: Manager assigns goal from details modal
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. Open goal card.
  2. Select team member.
  3. Confirm assignment.
  4. Verify assignment call `/api/goals/:id/assign` and UI label updates.
- **Expected**: Modal closes with success toast, card shows assignee.
- **Status**: ⬜ Planned

#### TC-S1-010: Employee updates progress
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. Login as EMPLOYEE.
  2. Open assigned goal.
  3. Update progress slider to 60%.
  4. Verify request to `/api/goals/:id/progress`.
- **Expected**: Progress ring updates; history entry recorded.
- **Status**: ⬜ Planned

### **Task 4: Weekly Goals Workspace**
**Priority**: P1  
**Primary Test Files**:
- `tests/unit/pages/weeklyGoals.scheduler.test.js`
- `tests/e2e/critical-paths/weekly-goals-drag-drop.e2e.spec.ts`

#### TC-S1-011: Scheduler groups goals by day
- **Type**: Unit
- **Priority**: P1
- **Description**: Weekly presenter creates day buckets, respecting due dates and statuses.
- **Status**: ⬜ Planned

#### TC-S1-012: Drag/drop rescheduling persists week day
- **Type**: E2E
- **Priority**: P2
- **Steps**:
  1. Drag goal card from Monday to Wednesday.
  2. Confirm PUT `/api/goals/:id/schedule` invoked with new day.
- **Expected**: UI reorder persists after reload.
- **Status**: ⬜ Planned

### **Task 5: Business Management API**
**Priority**: P0  
**Primary Test File**: `tests/integration/api/businesses.integration.test.js`

#### TC-S1-013: Owner creates business
- **Type**: Integration
- **Priority**: P0
- **Steps**:
  1. POST `/api/businesses` with payload per spec.
  2. Assert HTTP 201 and DB record created with `company_id`.
- **Expected**: Response includes sanitized fields; audit log entry recorded.
- **Status**: ⬜ Planned

#### TC-S1-014: Update business settings
- **Type**: Integration
- **Priority**: P1
- **Description**: PUT updates timezone, industry; returns latest copy.
- **Status**: ⬜ Planned

#### TC-S1-015: Consultant lists businesses they manage
- **Type**: Integration
- **Priority**: P1
- **Description**: GET `/api/businesses/:id` respects consultant scoping and expands teams/users.
- **Status**: ⬜ Planned

#### TC-S1-016: Unauthorized delete blocked
- **Type**: Integration
- **Priority**: P0
- **Expected**: 403 for non-OWNER roles; DB unaffected.
- **Status**: ⬜ Planned

### **Task 6: Task Management Completion**
**Priority**: P1  
**Primary Test Files**:
- `tests/unit/clients/taskApiClient.test.js` (extend existing)
- `tests/e2e/critical-paths/goal-to-task-flow.e2e.spec.ts`

#### TC-S1-017: Manager creates task from goal
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. In goal details, click `Create Task`.
  2. Fill modal, submit.
  3. Verify POST `/api/tasks`.
- **Expected**: Task appears in manager view and employee queue.
- **Status**: ⬜ Planned

#### TC-S1-018: Employee marks task complete
- **Type**: E2E
- **Priority**: P0
- **Expected**: Completion updates goal progress automatically.
- **Status**: ⬜ Planned

#### TC-S1-019: Task API handles pagination
- **Type**: Unit/Integration hybrid
- **Priority**: P2
- **Description**: Ensure list method forwards pagination params.
- **Status**: ⬜ Planned

### **Task 7: Executive Approval Workflow**
**Priority**: P0  
**Primary Test Files**:
- `tests/integration/api/goals.approval.integration.test.js`
- `tests/e2e/critical-paths/executive-approval.e2e.spec.ts`

#### TC-S1-020: Executive approves quarterly plan
- **Type**: Integration
- **Priority**: P0
- **Description**: POST `/api/goals/:id/approve` transitions status and stamps approver metadata.
- **Status**: ⬜ Planned

#### TC-S1-021: Approval history recorded
- **Type**: Unit
- **Priority**: P1
- **Description**: Model hook appends history entry with timestamp and role.
- **Status**: ⬜ Planned

#### TC-S1-022: E2E approval + notification
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. Executive logs in, navigates to approvals queue.
  2. Approves plan.
  3. Validate toast + email stub triggered (mock Mailjet).
- **Expected**: Goal status updated to `Approved`; manager sees update on refresh.
- **Status**: ⬜ Planned

### **Task 8: Role-Based Access & Navigation**
**Priority**: P0  
**Primary Test Files**:
- `tests/unit/components/navigation.goalLinks.test.js`
- `tests/e2e/critical-paths/navigation-role-coverage.e2e.spec.ts`

#### TC-S1-023: Navigation exposes correct menu items
- **Type**: Unit
- **Priority**: P0
- **Description**: Role matrix ensures goals/tasks links appear only for relevant personas.
- **Status**: ⬜ Planned

#### TC-S1-024: Employee cannot access business admin pages
- **Type**: E2E
- **Priority**: P0
- **Expected**: Redirect with permission toast; 403 for API.
- **Status**: ⬜ Planned

### **Task 9: Regression & Migration Checks**
**Priority**: P1  
**Primary Test Files**:
- `tests/integration/api/goals.legacyFilters.integration.test.js`
- `tests/unit/models/userCompaniesArray.test.js`

#### TC-S1-025: Legacy goal filters still supported
- **Type**: Integration
- **Priority**: P1
- **Description**: Ensure existing `status` filter semantics unchanged post UI revamp.
- **Status**: ⬜ Planned

#### TC-S1-026: User model supports `companies[]`
- **Type**: Unit
- **Priority**: P1
- **Description**: Validation ensures at least one company and deduplicates.
- **Status**: ⬜ Planned

### **Task 10: Performance & Accessibility**
**Priority**: P2  
**Primary Test Files**:
- `tests/integration/perf/goals.list.performance.test.js`
- `tests/e2e/accessibility/quarterly-goals.a11y.spec.ts`

#### TC-S1-027: Goals list responds <400ms with 200 records
- **Type**: Integration (performance)
- **Priority**: P2
- **Status**: ⬜ Planned

#### TC-S1-028: Quarterly goals page passes a11y audit
- **Type**: E2E (axe scan)
- **Priority**: P2
- **Expected**: No serious/critical violations.
- **Status**: ⬜ Planned

### **Task 11: Task Metrics & Reporting**
**Priority**: P2  
**Primary Test File**: `tests/unit/services/taskAnalyticsService.test.js`

#### TC-S1-029: Task completion analytics accurate
- **Type**: Unit
- **Priority**: P2
- **Description**: Verify utility summarises completion rate and overdue counts for manager dashboard.
- **Status**: ⬜ Planned

### **Task 12: End-to-End Manager Journey**
**Priority**: P0  
**Primary Test File**: `tests/e2e/critical-paths/manager-core-workflow.e2e.spec.ts`

#### TC-S1-030: Manager completes full planning loop
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. Create goal from objective.
  2. Break into weekly goals.
  3. Assign to employee.
  4. Create tasks.
  5. Review progress dashboard.
- **Expected**: Flow completes without errors; relevant API calls succeed; UI data persisted.
- **Status**: ⬜ Planned

### **Task 13: End-to-End Employee Journey**
**Priority**: P0  
**Primary Test File**: `tests/e2e/critical-paths/employee-productivity-flow.e2e.spec.ts`

#### TC-S1-031: Employee tracks assigned work
- **Type**: E2E
- **Priority**: P0
- **Steps**:
  1. Employee logs in.
  2. Views assigned goals.
  3. Updates goal and task progress.
  4. Confirms Why Chain context appears.
- **Expected**: UI updates, toast confirmations, data persists.
- **Status**: ⬜ Planned

### **Task 14: Error Handling & Edge Cases**
**Priority**: P1  
**Primary Test Files**:
- `tests/unit/clients/goalApiClient.errors.test.js`
- `tests/integration/api/goals.validation.integration.test.js`

#### TC-S1-032: Goal creation validation errors surfaced
- **Type**: Integration
- **Priority**: P1
- **Description**: Missing title returns 400 with validation detail array.
- **Status**: ⬜ Planned

#### TC-S1-033: Duplicate weekly goal prevented
- **Type**: Unit
- **Priority**: P1
- **Description**: Client prevents scheduling same goal twice using local cache.
- **Status**: ⬜ Planned

#### TC-S1-034: Network retry logic for API client
- **Type**: Unit
- **Priority**: P2
- **Description**: Retries once on 502 before failing.
- **Status**: ⬜ Planned

---

## 🔧 Atlas Automation Checklist

- [ ] Register new suites under `atlas-sprint1-core`.  
- [ ] Extend `atlas.config.ts` with manager/employee personas for Playwright.  
- [ ] Seed sprint fixtures in `tests/fixtures/atlas/sprint1/`.  
- [ ] Enable screenshot/video retention on Playwright failures.  
- [ ] Publish coverage report to `QA/reports/Sprint_1/coverage/`.

---

## 📝 Notes & Risks

- Goal/Task flows touch multiple APIs; coordinate fixture resets between tests to avoid cross-contamination.  
- Drag-and-drop automation can be flaky; leverage Playwright `dragTo` helpers with deterministic selectors.  
- Business naming migration may affect legacy reports—monitor coverage gaps flagged at runtime.  
- Ensure email/notification mocks reset between executive approval scenarios.

---

**Plan Created**: 6 Nov 2025  
**Next Review**: Mid-sprint QA sync (target 17 Nov 2025)
