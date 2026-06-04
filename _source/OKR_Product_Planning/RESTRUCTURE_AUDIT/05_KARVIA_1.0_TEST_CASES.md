# KARVIA 1.0 Engine Test Cases

**Created**: April 3, 2026
**Purpose**: Define comprehensive test cases for KARVIA 1.0 Engine validation
**Location**: Tests will be created in `/tests/` directory
**Standard**: Jest + Supertest for API tests, Playwright for E2E

---

## Test Case Naming Convention

```
[Module]-[Feature]-[Scenario].test.js

Examples:
- objectives-crud-create.test.js
- goals-cascade-update.test.js
- auth-jwt-expiration.test.js
```

---

## API Route Test Cases

### 1. Objectives API (`/api/objectives`)

**File**: `tests/integration/objectives.test.js`

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| OBJ-001 | Create objective with valid data | Happy Path | P0 |
| OBJ-002 | Create objective without title (400) | Error | P0 |
| OBJ-003 | Get all objectives for company | Happy Path | P0 |
| OBJ-004 | Get objectives - filter by status | Query | P1 |
| OBJ-005 | Get single objective by ID | Happy Path | P0 |
| OBJ-006 | Get objective from wrong company (403) | Security | P0 |
| OBJ-007 | Update objective title | Happy Path | P0 |
| OBJ-008 | Update objective - invalid period (400) | Validation | P1 |
| OBJ-009 | Delete objective (soft delete) | Happy Path | P0 |
| OBJ-010 | Delete objective with children (cascade) | Edge Case | P1 |
| OBJ-011 | Create objective - CONSULTANT role | RBAC | P0 |
| OBJ-012 | Create objective - EMPLOYEE role (403) | RBAC | P0 |
| OBJ-013 | Objective period types (calendar/fiscal/custom) | Feature | P1 |
| OBJ-014 | Objective cascade to Key Results | Cascade | P1 |
| OBJ-015 | Objective progress calculation | Calculation | P1 |

**Estimated**: 15 tests

---

### 2. Goals API (`/api/goals`)

**File**: `tests/integration/goals.test.js`

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| GOAL-001 | Create quarterly goal | Happy Path | P0 |
| GOAL-002 | Create weekly goal under quarterly | Happy Path | P0 |
| GOAL-003 | Create goal without key_result_id (400) | Validation | P0 |
| GOAL-004 | Get quarterly goals for KR | Happy Path | P0 |
| GOAL-005 | Get weekly goals for quarterly goal | Happy Path | P0 |
| GOAL-006 | Get goal from wrong company (403) | Security | P0 |
| GOAL-007 | Update goal progress | Happy Path | P0 |
| GOAL-008 | Update goal - progress cascade to parent | Cascade | P1 |
| GOAL-009 | Delete goal (soft delete) | Happy Path | P0 |
| GOAL-010 | Delete quarterly goal with weekly children | Cascade | P1 |
| GOAL-011 | Goal date validation (within KR period) | Validation | P1 |
| GOAL-012 | Goal assignment to user | Feature | P1 |
| GOAL-013 | Goal status transitions | State | P1 |
| GOAL-014 | Goal duplicate check | Edge Case | P2 |
| GOAL-015 | Bulk goal creation | Feature | P2 |

**Estimated**: 15 tests

---

### 3. Tasks API (`/api/tasks`)

**File**: `tests/integration/tasks.test.js`

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| TASK-001 | Create task under goal | Happy Path | P0 |
| TASK-002 | Create task without goal_id (400) | Validation | P0 |
| TASK-003 | Get tasks for goal | Happy Path | P0 |
| TASK-004 | Get tasks - filter by status | Query | P1 |
| TASK-005 | Get task from wrong company (403) | Security | P0 |
| TASK-006 | Update task status | Happy Path | P0 |
| TASK-007 | Update task - progress cascade to goal | Cascade | P1 |
| TASK-008 | Delete task (soft delete) | Happy Path | P0 |
| TASK-009 | Mark task complete | Happy Path | P0 |
| TASK-010 | Task assignment to user | Feature | P1 |
| TASK-011 | Task due date validation | Validation | P1 |
| TASK-012 | Task priority levels | Feature | P2 |
| TASK-013 | Task blocked status | Feature | P1 |
| TASK-014 | Task notes/comments | Feature | P2 |
| TASK-015 | Bulk task operations | Feature | P2 |

**Estimated**: 15 tests

---

### 4. Teams API (`/api/teams`)

**File**: `tests/integration/teams.test.js`

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| TEAM-001 | Create team | Happy Path | P0 |
| TEAM-002 | Create team without name (400) | Validation | P0 |
| TEAM-003 | Get all teams for company | Happy Path | P0 |
| TEAM-004 | Get team from wrong company (403) | Security | P0 |
| TEAM-005 | Add member to team | Happy Path | P0 |
| TEAM-006 | Remove member from team | Happy Path | P0 |
| TEAM-007 | Update team name | Happy Path | P1 |
| TEAM-008 | Delete team | Happy Path | P1 |
| TEAM-009 | Team member roles | Feature | P1 |
| TEAM-010 | Team hierarchy (parent team) | Feature | P2 |

**Estimated**: 10 tests

---

### 5. Companies API (`/api/companies`)

**File**: `tests/integration/companies.test.js`

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| COMP-001 | Get company by ID | Happy Path | P0 |
| COMP-002 | Get company from wrong tenant (403) | Security | P0 |
| COMP-003 | Update company settings | Happy Path | P0 |
| COMP-004 | Company industry preset selection | Feature | P1 |
| COMP-005 | Company business context fields | Feature | P1 |
| COMP-006 | OKR generation flag check | Feature | P0 |
| COMP-007 | Company user list | Query | P1 |
| COMP-008 | Company statistics | Query | P1 |
| COMP-009 | Company fiscal year settings | Feature | P1 |
| COMP-010 | Company logo upload | Feature | P2 |

**Estimated**: 10 tests

---

### 6. Assessments API (`/api/assessments`)

**File**: `tests/integration/assessments.test.js`

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| ASS-001 | Start assessment session | Happy Path | P0 |
| ASS-002 | Submit assessment response | Happy Path | P0 |
| ASS-003 | Complete assessment | Happy Path | P0 |
| ASS-004 | Get assessment results | Happy Path | P0 |
| ASS-005 | Assessment from wrong company (403) | Security | P0 |
| ASS-006 | SSI score calculation | Calculation | P0 |
| ASS-007 | 12-block diagnostic | Feature | P1 |
| ASS-008 | Industry preset scoring | Feature | P1 |
| ASS-009 | Assessment report generation | Feature | P1 |
| ASS-010 | Assessment PDF export | Feature | P2 |
| ASS-011 | Assessment template selection | Feature | P1 |
| ASS-012 | Assessment retake | Feature | P2 |

**Estimated**: 12 tests

---

## E2E Journey Test Cases

### 7. Consultant Journey Tests

**File**: `tests/e2e/consultant-journey-full.test.js`

| ID | Test Case | Steps | Priority |
|----|-----------|-------|----------|
| CJ-001 | Consultant login and dashboard | 3 | P0 |
| CJ-002 | Create new client company | 5 | P0 |
| CJ-003 | Invite business owner | 4 | P0 |
| CJ-004 | Run SSI assessment for client | 8 | P0 |
| CJ-005 | Generate OKRs from assessment | 6 | P0 |
| CJ-006 | Review and approve OKRs | 4 | P1 |
| CJ-007 | View client progress dashboard | 3 | P1 |
| CJ-008 | Multi-client switching | 4 | P1 |
| CJ-009 | Export client report | 3 | P2 |
| CJ-010 | Consultant settings management | 3 | P2 |

**Estimated**: 10 tests (~40 steps)

---

### 8. Executive Journey Tests

**File**: `tests/e2e/executive-journey.test.js`

| ID | Test Case | Steps | Priority |
|----|-----------|-------|----------|
| EJ-001 | Executive login and dashboard | 3 | P0 |
| EJ-002 | View company objectives | 3 | P0 |
| EJ-003 | Create department objective | 5 | P0 |
| EJ-004 | Assign manager to objective | 4 | P1 |
| EJ-005 | Review team progress | 3 | P1 |
| EJ-006 | Quarterly review initiation | 4 | P1 |
| EJ-007 | View assessment results | 3 | P1 |
| EJ-008 | Company-wide metrics view | 3 | P2 |
| EJ-009 | Executive report generation | 4 | P2 |
| EJ-010 | Delegation of review | 3 | P2 |

**Estimated**: 10 tests (~35 steps)

---

### 9. Manager Journey Tests

**File**: `tests/e2e/manager-journey.test.js`

| ID | Test Case | Steps | Priority |
|----|-----------|-------|----------|
| MJ-001 | Manager login and dashboard | 3 | P0 |
| MJ-002 | View team objectives | 3 | P0 |
| MJ-003 | Create goal for objective | 5 | P0 |
| MJ-004 | Assign task to employee | 4 | P0 |
| MJ-005 | Review employee progress | 3 | P1 |
| MJ-006 | Weekly planning session | 5 | P1 |
| MJ-007 | Team member management | 4 | P1 |
| MJ-008 | Progress update cascade | 4 | P2 |
| MJ-009 | Team metrics view | 3 | P2 |
| MJ-010 | Manager-to-manager handoff | 4 | P2 |

**Estimated**: 10 tests (~38 steps)

---

### 10. Employee Journey Tests

**File**: `tests/e2e/employee-journey.test.js`

| ID | Test Case | Steps | Priority |
|----|-----------|-------|----------|
| EMJ-001 | Employee login and dashboard | 3 | P0 |
| EMJ-002 | View assigned tasks | 3 | P0 |
| EMJ-003 | Mark task complete | 3 | P0 |
| EMJ-004 | Update task progress | 3 | P0 |
| EMJ-005 | Request task clarification | 4 | P1 |
| EMJ-006 | View personal goals | 3 | P1 |
| EMJ-007 | Daily planning view | 3 | P1 |
| EMJ-008 | Mark task blocked | 3 | P1 |
| EMJ-009 | View team context | 3 | P2 |
| EMJ-010 | Personal metrics view | 3 | P2 |

**Estimated**: 10 tests (~31 steps)

---

### 11. Admin Journey Tests

**File**: `tests/e2e/admin-journey.test.js`

| ID | Test Case | Steps | Priority |
|----|-----------|-------|----------|
| ADJ-001 | Admin login and dashboard | 3 | P0 |
| ADJ-002 | Invite new user | 4 | P0 |
| ADJ-003 | Manage user roles | 3 | P0 |
| ADJ-004 | Company settings update | 3 | P0 |
| ADJ-005 | View all users | 3 | P1 |
| ADJ-006 | Deactivate user | 3 | P1 |
| ADJ-007 | Team creation | 4 | P1 |
| ADJ-008 | Bulk user import | 5 | P2 |

**Estimated**: 8 tests (~28 steps)

---

## Security Test Cases (Existing + New)

### 12. Multi-Tenant Isolation (EXISTS)

**File**: `tests/security/multi-tenant-isolation.test.js` (26 tests)

- Already covers cross-tenant data access
- Already covers role-based isolation
- No new tests needed

### 13. Additional Security Tests

**File**: `tests/security/karvia-security.test.js`

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| SEC-001 | JWT token expiration | Auth | P0 |
| SEC-002 | Invalid JWT token (401) | Auth | P0 |
| SEC-003 | Missing auth header (401) | Auth | P0 |
| SEC-004 | XSS prevention in inputs | XSS | P1 |
| SEC-005 | SQL injection prevention | Injection | P1 |
| SEC-006 | Rate limiting enforcement | DoS | P1 |
| SEC-007 | Password strength validation | Auth | P2 |
| SEC-008 | Session management | Auth | P2 |

**Estimated**: 8 tests

---

## Test Summary

### Test Counts by Category

| Category | Files | Tests | Priority |
|----------|-------|-------|----------|
| **API Route Tests** | 6 | ~77 | P0-P2 |
| **E2E Journey Tests** | 5 | ~48 | P0-P2 |
| **Security Tests** | 1 | ~8 | P0-P2 |
| **Existing Tests** | - | 622 | - |
| **Total New** | 12 | ~133 | - |
| **Grand Total** | - | ~755 | - |

### Test Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| P0 (Critical) | ~60 | 45% |
| P1 (Important) | ~50 | 38% |
| P2 (Nice to have) | ~23 | 17% |

---

## Test Data Requirements

### Test Fixtures Needed

```javascript
// tests/fixtures/karvia-1.0-fixtures.js

const fixtures = {
  // Company fixtures
  companies: {
    testCompany: { name: 'Test Corp', industry: 'technology' },
    altCompany: { name: 'Alt Corp', industry: 'financial_services' }
  },

  // User fixtures (by role)
  users: {
    consultant: { role: 'CONSULTANT', email: 'consultant@test.com' },
    businessOwner: { role: 'BUSINESS_OWNER', email: 'owner@test.com' },
    executive: { role: 'EXECUTIVE', email: 'exec@test.com' },
    manager: { role: 'MANAGER', email: 'manager@test.com' },
    employee: { role: 'EMPLOYEE', email: 'employee@test.com' },
    admin: { role: 'ADMIN', email: 'admin@test.com' }
  },

  // OKR fixtures
  objectives: {
    validObjective: {
      title: 'Test Objective',
      category: 'growth',
      period_type: 'calendar_year'
    }
  },

  // Assessment fixtures
  assessments: {
    ssiResponses: { /* 12-block responses */ }
  }
};
```

---

## Test Execution Plan

### Phase 1: Setup (Day 4)
- Create test fixtures file
- Set up test database helpers
- Configure Jest projects for new tests

### Phase 2: API Tests (Days 4-5)
- Objectives tests (15)
- Goals tests (15)
- Tasks tests (15)

### Phase 3: More API Tests (Days 5-6)
- Teams tests (10)
- Companies tests (10)
- Assessments tests (12)

### Phase 4: E2E Tests (Days 6-7)
- Consultant journey (10)
- Executive journey (10)
- Manager journey (10)
- Employee journey (10)
- Admin journey (8)

### Phase 5: Security + Validation (Day 7)
- Additional security tests (8)
- Run full suite
- Fix any failures

---

## Acceptance Criteria

### Test Suite Acceptance

- [ ] All 133+ new tests pass
- [ ] No flaky tests (3 consecutive runs pass)
- [ ] Test execution < 15 minutes total
- [ ] Coverage report shows improvement

### Code Quality

- [ ] Tests follow naming convention
- [ ] Tests are independent (no shared state)
- [ ] Tests clean up after themselves
- [ ] No hardcoded credentials or secrets

---

**Next Step**: Begin test implementation in Phase 4 of KARVIA 1.0 Lock-In Plan
