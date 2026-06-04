# Karvia Business - Master Test Plan

**Version**: 2.0
**Last Updated**: December 1, 2025
**Status**: Active
**Companion Document**: [MASTER_TEST_STRATEGY.md](./MASTER_TEST_STRATEGY.md)

---

## 1. Overview

This Master Test Plan provides the **executable test catalog** for Karvia Business. It defines all test cases organized by feature area, priority, and test type. This is the single source of truth for "what to test."

---

## 2. Test Execution Tiers

| Tier | Name | When to Run | Duration | Coverage |
|------|------|-------------|----------|----------|
| **T1** | Smoke | Every deployment | 5 min | Core functionality |
| **T2** | Sanity | Daily during sprint | 15 min | Critical paths |
| **T3** | Regression | Pre-release | 1 hour | Full feature set |
| **T4** | Full | Major releases | 2+ hours | Including edge cases |

---

## 3. Feature Test Catalog

### 3.1 Authentication & Authorization

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| AUTH-001 | User can login with valid credentials | E2E | P0 | T1 | Yes |
| AUTH-002 | Invalid credentials show error | E2E | P0 | T1 | Yes |
| AUTH-003 | Session persists across page refresh | E2E | P0 | T2 | Yes |
| AUTH-004 | Session expires after inactivity | E2E | P1 | T3 | No |
| AUTH-005 | Password reset flow works | E2E | P1 | T3 | No |
| AUTH-006 | Role-based access restricts pages | E2E | P0 | T2 | Yes |
| AUTH-007 | Consultant can switch companies | E2E | P1 | T3 | No |
| AUTH-008 | Token refresh works silently | Integration | P1 | T2 | Yes |

### 3.2 Company Management

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| COMP-001 | Company profile displays correctly | E2E | P1 | T2 | No |
| COMP-002 | Company settings can be updated | E2E | P1 | T3 | No |
| COMP-003 | Team members list loads | E2E | P1 | T2 | No |
| COMP-004 | Industry selection persists | Integration | P2 | T3 | Yes |

### 3.3 Objectives Management (Sprint 6 - Epic 2)

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| OBJ-001 | Objectives list loads | E2E | P0 | T1 | No |
| OBJ-002 | Create new objective with all fields | E2E | P0 | T2 | No |
| OBJ-003 | **Owner dropdown populates team members** | E2E | P1 | T2 | No |
| OBJ-004 | **Target year dropdown shows dynamic years** | E2E | P1 | T2 | No |
| OBJ-005 | **New objectives show "On track" status** | E2E | P1 | T2 | No |
| OBJ-006 | Edit objective updates correctly | E2E | P1 | T3 | No |
| OBJ-007 | **Delete objective shows styled modal** | E2E | P1 | T2 | No |
| OBJ-008 | **Delete confirms and removes objective** | E2E | P1 | T2 | No |
| OBJ-009 | **Delete cascades to KRs and Goals** | Integration | P0 | T2 | Yes |
| OBJ-010 | **KR toggle shows "X more (Y completed)"** | E2E | P2 | T3 | No |
| OBJ-011 | **KR toggle expands/collapses hidden KRs** | E2E | P2 | T3 | No |
| OBJ-012 | Category icons display correctly | E2E | P2 | T3 | No |
| OBJ-013 | Progress percentage calculates correctly | Unit | P1 | T2 | Yes |
| OBJ-014 | Filter by status works | E2E | P2 | T3 | No |

### 3.4 OKR Generation (Sprint 6 - Epic 1)

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| OKR-001 | Generate OKRs from Team SSI View | E2E | P0 | T2 | No |
| OKR-002 | **Generate OKRs from Objectives page (auto-fetch)** | E2E | P0 | T2 | No |
| OKR-003 | Configuration modal shows period options | E2E | P1 | T2 | No |
| OKR-004 | OKRs display in approval modal | E2E | P1 | T2 | No |
| OKR-005 | Approve OKRs creates objectives | E2E | P0 | T2 | No |
| OKR-006 | Already generated shows disabled state | E2E | P1 | T2 | No |
| OKR-007 | Generation count increments | Integration | P2 | T3 | Yes |
| OKR-008 | **Fallback to company profile if no SSI** | Integration | P1 | T2 | Yes |
| OKR-009 | OpenAI timeout handled gracefully | Integration | P1 | T3 | Yes |
| OKR-010 | Invalid period rejected | Integration | P2 | T3 | Yes |

### 3.5 SSI Assessment

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| SSI-001 | Assessment questions load | E2E | P0 | T1 | No |
| SSI-002 | Answers persist between sessions | E2E | P1 | T2 | No |
| SSI-003 | Assessment completion calculates scores | Integration | P0 | T2 | Yes |
| SSI-004 | Team breakdown shows per-team scores | E2E | P1 | T2 | No |
| SSI-005 | Company overview aggregates correctly | E2E | P1 | T2 | No |
| SSI-006 | Weak areas identified correctly | Integration | P1 | T3 | Yes |
| SSI-007 | Function breakdown displays | E2E | P2 | T3 | No |

### 3.6 Assessment Distribution & Surveys (Sprint 9 - Epic H)

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| SURV-001 | Assessment Hub loads with 3 tabs | E2E | P0 | T1 | No |
| SURV-002 | **Teams variant: Team selection loads teams** | E2E | P0 | T2 | No |
| SURV-003 | **Teams variant: Team members display correctly** | E2E | P1 | T2 | No |
| SURV-004 | **Teams variant: Send to multiple teams works** | E2E | P1 | T2 | No |
| SURV-005 | **Email variant: Add/remove recipient emails** | E2E | P1 | T2 | No |
| SURV-006 | **Email variant: Validation rejects invalid emails** | E2E | P1 | T2 | No |
| SURV-007 | **Link variant: Generate shareable link** | E2E | P0 | T2 | No |
| SURV-008 | **Link variant: Copy link to clipboard works** | E2E | P1 | T2 | No |
| SURV-009 | **Link variant: Link uses correct domain (APP_URL)** | Integration | P0 | T1 | Yes |
| SURV-010 | **Survey start page: Loads via token URL** | E2E | P0 | T1 | No |
| SURV-011 | **Survey start page: Shows template info** | E2E | P1 | T2 | No |
| SURV-012 | **Survey start page: Form validates required fields** | E2E | P1 | T2 | No |
| SURV-013 | **Survey start page: Role dropdown works** | E2E | P1 | T2 | No |
| SURV-014 | **Anonymous assessment: Questions load correctly** | E2E | P0 | T1 | No |
| SURV-015 | **Anonymous assessment: 12 blocks display in sidebar** | E2E | P1 | T2 | No |
| SURV-016 | **Anonymous assessment: Navigation between blocks** | E2E | P1 | T2 | No |
| SURV-017 | **Anonymous assessment: All questions answerable** | E2E | P0 | T2 | No |
| SURV-018 | **Survey submit: Calculates SSI scores** | Integration | P0 | T1 | Yes |
| SURV-019 | **Survey submit: Saves question_text and dimension** | Integration | P0 | T2 | Yes |
| SURV-020 | **Survey submit: Redirects to thank you page** | E2E | P1 | T2 | No |
| SURV-021 | **Results aggregation: Anonymous included in company scores** | Integration | P0 | T1 | Yes |
| SURV-022 | **Results aggregation: Header shows "+ X survey responses"** | E2E | P1 | T2 | No |
| SURV-023 | **Results aggregation: Scores calculated correctly** | Unit | P0 | T2 | Yes |
| SURV-024 | **Sent assessments: "Sent by Me" tab shows history** | E2E | P1 | T3 | No |
| SURV-025 | **Link management: Edit button opens modal** | E2E | P2 | T3 | No |
| SURV-026 | **Link management: Deactivate disables link** | E2E | P1 | T3 | No |
| SURV-027 | **Expired link: Shows appropriate error page** | E2E | P1 | T3 | No |
| SURV-028 | **Response limit: Rejects after limit reached** | Integration | P1 | T3 | Yes |

### 3.7 SSI Diagnostic Report (Sprint 6 - Epic 7)

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| DIAG-001 | **Check eligibility endpoint returns status** | Integration | P0 | T1 | Yes |
| DIAG-002 | **Below 80% shows locked state with progress** | E2E | P1 | T2 | No |
| DIAG-003 | **80%+ shows "Generate Report" button** | E2E | P1 | T2 | No |
| DIAG-004 | **Generate creates diagnostic report** | Integration | P0 | T2 | Yes |
| DIAG-005 | **Modal displays health score** | E2E | P1 | T2 | No |
| DIAG-006 | **Modal displays SSI dimension scores** | E2E | P1 | T2 | No |
| DIAG-007 | **Modal displays issues (critical/warning)** | E2E | P1 | T2 | No |
| DIAG-008 | **Modal displays top performing teams** | E2E | P2 | T3 | No |
| DIAG-009 | **Modal displays OKR recommendations** | E2E | P1 | T2 | No |
| DIAG-010 | **Export downloads JSON file** | E2E | P2 | T3 | No |
| DIAG-011 | **"Use for OKR" triggers generation** | E2E | P1 | T2 | No |
| DIAG-012 | **Report saved to database** | Integration | P1 | T2 | Yes |
| DIAG-013 | **Previous reports archived on new generation** | Integration | P2 | T3 | Yes |
| DIAG-014 | **Industry adjacency uses correct config** | Unit | P2 | T3 | Yes |
| DIAG-015 | **Insight detection finds dimension imbalance** | Unit | P1 | T2 | Yes |
| DIAG-016 | **Cross-function gaps detected** | Unit | P2 | T3 | Yes |
| DIAG-017 | **Role perception gaps detected** | Unit | P2 | T3 | Yes |

### 3.7 Goals & Tasks

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| GOAL-001 | Quarterly goals display under KR | E2E | P1 | T2 | No |
| GOAL-002 | Weekly goals cascade from quarterly | E2E | P1 | T2 | No |
| GOAL-003 | Task creation and assignment | E2E | P1 | T3 | No |
| GOAL-004 | Status updates persist | Integration | P1 | T2 | Yes |
| GOAL-005 | Progress rolls up to parent | Unit | P1 | T2 | Yes |

### 3.8 Dashboard & Navigation

| ID | Test Case | Type | Priority | Tier | Automated |
|----|-----------|------|----------|------|-----------|
| DASH-001 | Dashboard loads for each role | E2E | P1 | T2 | No |
| DASH-002 | Navigation highlights current page | E2E | P2 | T3 | No |
| DASH-003 | User menu shows correct options | E2E | P2 | T3 | No |
| DASH-004 | Logout clears session | E2E | P1 | T2 | No |

---

## 4. User Journey Tests

### Journey 1: New User Onboarding
```
Login → Complete Profile → View Dashboard → Take Assessment
```
| Step | Expected Result | Priority |
|------|-----------------|----------|
| Login with valid creds | Dashboard loads | P0 |
| Profile shows user info | Name, email, role visible | P1 |
| Navigate to Assessment Hub | Assessment list displays | P1 |
| Start SSI assessment | Questions load | P0 |
| Complete assessment | Score calculated, results shown | P0 |

### Journey 2: Executive OKR Generation
```
View SSI Results → Generate Diagnostic → Generate OKRs → Approve
```
| Step | Expected Result | Priority |
|------|-----------------|----------|
| Open Team SSI View | Company overview loads | P0 |
| Switch to Company View | Aggregate scores display | P1 |
| Click Generate Diagnostic | Modal shows report | P1 |
| Click Use for OKR | OKR config modal appears | P1 |
| Configure and generate | OKRs display for approval | P0 |
| Approve OKRs | Objectives created | P0 |

### Journey 3: Objective Management
```
View Objectives → Create New → Add KRs → Track Progress → Delete
```
| Step | Expected Result | Priority |
|------|-----------------|----------|
| Open Objectives page | List loads | P0 |
| Click New Objective | Form appears with dropdowns | P1 |
| Fill and save | Objective appears in list | P0 |
| Expand KRs | Toggle shows hidden KRs | P1 |
| Delete objective | Modal confirms, objective removed | P1 |

### Journey 4: Consultant Multi-Company
```
Login → View Companies → Switch Company → View Different Data
```
| Step | Expected Result | Priority |
|------|-----------------|----------|
| Login as Consultant | Company list or selector visible | P1 |
| Select different company | Data context switches | P1 |
| View SSI results | Shows selected company's data | P1 |

### Journey 5: Anonymous Survey Response (Sprint 9)
```
Receive Link → Open Survey → Fill Info → Answer Questions → Submit → View Thank You
```
| Step | Expected Result | Priority |
|------|-----------------|----------|
| Open shareable link in incognito | Survey start page loads | P0 |
| See company/template info | Template name and question count shown | P1 |
| Fill name and select role | Form validates required fields | P0 |
| Click Start Assessment | Assessment page loads with questions | P0 |
| Navigate through 12 blocks | All blocks accessible, progress tracked | P1 |
| Answer all 50 questions | All question types work correctly | P0 |
| Submit assessment | Scores calculated, thank you page shown | P0 |
| Verify in Company Overview | Anonymous response included in scores | P0 |

### Journey 6: Consultant Creates Survey Link (Sprint 9)
```
Login → Assessment Hub → Create New → Select Link Variant → Generate → Copy → Share
```
| Step | Expected Result | Priority |
|------|-----------------|----------|
| Open Assessment Hub | 3 tabs visible (Assigned, Sent, Templates) | P0 |
| Click "Create New Assessment" | Step 1 shows template selection | P0 |
| Select template and click Next | Step 2 shows variant selection | P0 |
| Select "Shareable Link" variant | Step 3 shows link options | P0 |
| Generate link | Link created with correct domain | P0 |
| Copy link | Clipboard contains survey URL | P1 |
| View in "Sent by Me" tab | New link appears in history | P1 |

---

## 5. Edge Case Tests

### 5.1 Empty States
| ID | Scenario | Expected |
|----|----------|----------|
| EDGE-001 | No objectives exist | Empty state with CTA |
| EDGE-002 | No assessments completed | Prompt to start |
| EDGE-003 | No team members | Empty team list |
| EDGE-004 | No KRs on objective | Show "No key results" |
| EDGE-005 | No teams in company (survey) | Show "No teams available" message |
| EDGE-006 | No sent assessments | Empty "Sent by Me" tab |
| EDGE-007 | No anonymous responses | Company overview shows 0 survey responses |

### 5.2 Error Handling
| ID | Scenario | Expected |
|----|----------|----------|
| EDGE-010 | Network timeout on API call | User-friendly error message |
| EDGE-011 | Invalid token | Redirect to login |
| EDGE-012 | 500 error from backend | Generic error with retry option |
| EDGE-013 | OpenAI API failure | Graceful degradation message |
| EDGE-014 | Invalid survey token | Redirect to survey-closed with "invalid" reason |
| EDGE-015 | Expired survey link | Show "Survey Link Expired" page |
| EDGE-016 | Deactivated survey link | Show "Survey Deactivated" page |
| EDGE-017 | Survey submit fails | Keep user on page with error message |
| EDGE-018 | Assessment already completed | Show "Already completed" error |

### 5.3 Boundary Conditions
| ID | Scenario | Expected |
|----|----------|----------|
| EDGE-020 | 100+ objectives | Pagination or virtualization works |
| EDGE-021 | Very long objective title | Truncates with ellipsis |
| EDGE-022 | 10+ KRs on objective | Toggle shows correct count |
| EDGE-023 | 0% completion rate | Diagnostic button locked |
| EDGE-024 | 100% completion rate | Diagnostic fully available |
| EDGE-025 | Response limit = 1, first response | Accepts first response |
| EDGE-026 | Response limit = 1, second response | Rejects with "limit reached" |
| EDGE-027 | Survey link expires exactly now | Shows expired page |
| EDGE-028 | 50+ anonymous responses | Aggregation still performant |
| EDGE-029 | Respondent name = 255 chars max | Accepts and truncates if needed |
| EDGE-030 | Very long department name | Handles gracefully |

### 5.4 Concurrent Operations
| ID | Scenario | Expected |
|----|----------|----------|
| EDGE-030 | Rapid delete clicks | Only one delete occurs |
| EDGE-031 | Refresh during OKR gen | State recovers gracefully |
| EDGE-032 | Two users edit same obj | Last write wins (or conflict) |

---

## 6. API Test Catalog

### 6.1 Smoke Test Endpoints
```javascript
// All should return 2xx or expected 4xx
GET  /api/objectives              → 200 or 401
GET  /api/companies/:id           → 200, 401, 404
GET  /api/assessments/company/:id/team-breakdown → 200, 401
GET  /api/diagnostic/check-eligibility/:id → 200, 401
POST /api/diagnostic/generate     → 200, 400, 401
POST /api/ai-okr/generate-from-company → 200, 400, 401

// Sprint 9: Survey Endpoints (PUBLIC - no auth required)
GET  /api/invitations/survey/:token → 200, 404, 410
POST /api/invitations/survey/:token/start → 201, 400, 410
GET  /api/assessments/:id/questions-anonymous → 200, 403, 404
POST /api/assessments/:id/submit-anonymous → 200, 400, 403
```

### 6.2 Integration Test Contracts
| Endpoint | Method | Success | Error Cases |
|----------|--------|---------|-------------|
| `/api/objectives` | POST | 201 + objective | 400 missing fields, 401 unauth |
| `/api/objectives/:id` | DELETE | 200 + cascade | 404 not found, 403 forbidden |
| `/api/diagnostic/generate` | POST | 200 + report | 400 ineligible, 401 unauth |
| `/api/ai-okr/generate-from-company` | POST | 200 + OKRs | 400 no SSI, 504 timeout |
| `/api/invitations/survey/:token` | GET | 200 + survey info | 404 invalid, 410 expired/deactivated |
| `/api/invitations/survey/:token/start` | POST | 201 + assessment_id | 400 validation, 410 limit reached |
| `/api/assessments/:id/questions-anonymous` | GET | 200 + questions | 403 not anonymous, 404 not found |
| `/api/assessments/:id/submit-anonymous` | POST | 200 + scores | 400 no responses, 403 already completed |
| `/api/assessments/company/:id/team-breakdown` | GET | 200 + includes anonymous | 401 unauth, 403 access denied |

---

## 7. Test Data Requirements

### Minimum Test Dataset
- 1 Company with completed setup
- 5 Users (1 per role: Employee, Manager, Executive, Owner, Consultant)
- 3 Teams with 5+ members each
- 20+ completed SSI assessments (for 80% gate)
- 5 Objectives with 3+ KRs each
- Quarterly and weekly goals

### Test User Credentials
| Role | Email | Password | Company |
|------|-------|----------|---------|
| Employee | employee@test.com | Test123! | TestCorp |
| Manager | manager@test.com | Test123! | TestCorp |
| Executive | exec@test.com | Test123! | TestCorp |
| Owner | owner@test.com | Test123! | TestCorp |
| Consultant | consultant@test.com | Test123! | (Multi) |

---

## 8. Test Execution Commands

```bash
# Tier 1: Smoke (5 min)
node tests/sprint6-smoke-test.js

# Tier 2: Unit + Integration (2 min)
npm run test:unit
npm run test:integration

# Tier 3: E2E Critical Paths (10 min)
npm run test:e2e

# Tier 4: Full Regression (1 hour)
npm test -- --coverage
npm run test:playwright

# Coverage Report
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## 9. Sprint-Specific Test Plans

Each sprint should have its own test plan in `QA/sprints/sprint-XX/test-plan.md` that:
1. References this master plan
2. Lists new test cases added
3. Identifies regression focus areas
4. Documents any test data requirements

### Current Sprint Reference
- **Sprint 6**: [SPRINT6-TEST-CHECKLIST.md](./QA/../KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-6/SPRINT6-TEST-CHECKLIST.md)

---

## 10. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 2025 | QA Team | Initial plan |
| 2.0 | Dec 1, 2025 | Claude | Added Sprint 6 features, consolidated as master plan |
| 2.1 | Dec 16, 2025 | Claude | Added Sprint 9 Survey tests (SURV-001 to SURV-028), Edge cases (EDGE-014 to EDGE-030), Journeys 5-6 |

---

*This is the executable test catalog. For testing philosophy and methodology, see [MASTER_TEST_STRATEGY.md](./MASTER_TEST_STRATEGY.md).*
