# Epic T: Testing Infrastructure Overhaul

**Sprint**: 15-A (Addition)
**Points**: 30 pts
**Priority**: HIGH
**Status**: PLANNING COMPLETE

---

## Background

### Audit Findings (OPEN)

| ID | Issue | Priority |
|----|-------|----------|
| AH-9 | No Full Product Lifecycle Journey Test | HIGH |
| AH-10 | CONSULTANT Role Undertested | HIGH |
| AH-11 | No Multi-Tenant Isolation Tests | HIGH |

### Current State

- **28 test files** for 58+ backend components (48% coverage)
- **0 security tests** (multi-tenant isolation)
- **0 CONSULTANT role tests**
- **0 golden path lifecycle tests**
- **70+ QA docs** scattered, overlapping, outdated

---

## Epic T Stories

| Story | Points | Priority | Description |
|-------|--------|----------|-------------|
| T1 | 5 | HIGH | Golden Path Lifecycle Test (AH-9) |
| T2 | 5 | HIGH | CONSULTANT Role Test Suite (AH-10) |
| T3 | 5 | HIGH | Multi-Tenant Isolation Tests (AH-11) |
| T4 | 3 | MEDIUM | QA Folder Reorganization |
| T5 | 5 | MEDIUM | CI/CD Test Integration |
| T6 | 3 | LOW | Test Coverage Dashboard |
| T7 | 4 | MEDIUM | Test Tooling & Config Updates |
| **Total** | **30** | | |

---

## T1: Golden Path Lifecycle Test (5 pts)

**Addresses**: AH-9
**File**: `tests/e2e/golden-path.test.js`

### Test Flow

```
Register → Assessment → SSI → OKR Generation → Planning → Tasks → Dashboard
```

### Implementation

```javascript
describe('Golden Path - Full Product Lifecycle', () => {
  describe('Phase 1: Company Onboarding', () => {
    test('1.1 Consultant creates company invitation');
    test('1.2 Business owner accepts invitation');
    test('1.3 Business owner completes profile');
  });

  describe('Phase 2: Assessment', () => {
    test('2.1 Business owner receives assessment link');
    test('2.2 Business owner completes SSI assessment');
    test('2.3 SSI scores are calculated');
  });

  describe('Phase 3: OKR Generation', () => {
    test('3.1 AI generates objectives based on SSI');
    test('3.2 Business owner accepts objectives');
    test('3.3 Key results are created');
  });

  describe('Phase 4: Goal Planning', () => {
    test('4.1 Quarterly goals are created');
    test('4.2 Weekly goals are broken down');
  });

  describe('Phase 5: Task Execution', () => {
    test('5.1 Tasks are created from goals');
    test('5.2 Tasks are assigned to team members');
    test('5.3 Task completion updates goal progress');
  });

  describe('Phase 6: Verification', () => {
    test('6.1 Dashboard shows correct metrics');
    test('6.2 Progress cascades correctly');
  });
});
```

### Acceptance Criteria

- [ ] Test covers full user journey from registration to task completion
- [ ] All 6 phases pass
- [ ] Test runs in CI/CD
- [ ] Test uses real database (not mocks)

---

## T2: CONSULTANT Role Test Suite (5 pts)

**Addresses**: AH-10
**File**: `tests/e2e/consultant-role.test.js`

### Test Coverage

```javascript
describe('CONSULTANT Role', () => {
  describe('Multi-Company Access', () => {
    test('Can view all companies');
    test('Can switch between companies');
    test('Can access company 1 data');
    test('Can access company 2 data');
  });

  describe('Admin Functions', () => {
    test('Can create company invitations');
    test('Can view all assessments across companies');
    test('Can invite team members for any company');
    test('Can generate OKRs for any company');
  });

  describe('Team Management', () => {
    test('Can view teams for any company');
    test('Can create teams for any company');
    test('Can manage invitations for any company');
  });

  describe('Diagnostic Access', () => {
    test('Can view SSI reports for all companies');
    test('Can access diagnostic engine');
  });
});
```

### Acceptance Criteria

- [ ] 12 CONSULTANT-specific tests pass
- [ ] Multi-company access verified
- [ ] Admin functions verified
- [ ] Test runs in CI/CD

---

## T3: Multi-Tenant Isolation Tests (5 pts)

**Addresses**: AH-11
**File**: `tests/security/multi-tenant-isolation.test.js`

### Test Coverage

```javascript
describe('Multi-Tenant Data Isolation', () => {
  describe('Data Isolation - Company A cannot access Company B', () => {
    test('Cannot view Company B objectives');
    test('Cannot view Company B goals');
    test('Cannot view Company B tasks');
    test('Cannot view Company B team members');
    test('Cannot view Company B assessments');
    test('Cannot view Company B SSI scores');
  });

  describe('List Endpoints Isolation', () => {
    test('GET /api/objectives returns only Company A data');
    test('GET /api/goals returns only Company A data');
    test('GET /api/tasks returns only Company A data');
  });

  describe('Mutation Isolation', () => {
    test('Cannot update Company B objective');
    test('Cannot delete Company B task');
    test('Cannot assign Company B task to self');
  });
});
```

### Acceptance Criteria

- [ ] 15 multi-tenant isolation tests pass
- [ ] All read operations isolated
- [ ] All write operations isolated
- [ ] Returns 403 for cross-tenant access
- [ ] Test runs in CI/CD (security checks)

---

## T4: QA Folder Reorganization (3 pts)

### New Structure

```
2-QA-AND-TESTING/
├── QA_README.md                    # Entry point
├── TESTING_STANDARDS.md            # Standards doc
├── TEST_COVERAGE_DASHBOARD.md      # Metrics
├── 1-STRATEGY/
├── 2-TEST-PLANS/
├── 3-TEST-SUITES/
├── 4-AUTOMATION/
├── 5-REPORTS/
├── 6-ISSUES/
└── ARCHIVE/
```

### Migration Tasks

- [ ] Move `MASTER_TEST_PLAN.md` to `1-STRATEGY/`
- [ ] Move `MASTER_TEST_STRATEGY.md` to `1-STRATEGY/`
- [ ] Archive `sprint-01` through `sprint-14` folders
- [ ] Archive old audit reports
- [ ] Create `QA_README.md` entry point
- [ ] Update navigation references

### Acceptance Criteria

- [ ] New folder structure in place
- [ ] All legacy docs archived
- [ ] Single entry point (`QA_README.md`)
- [ ] No duplicate "Master Test Plan" docs

---

## T5: CI/CD Test Integration (5 pts)

### GitHub Actions Workflow

**File**: `.github/workflows/test.yml`

```yaml
jobs:
  unit-tests:
    # All PRs
  integration-tests:
    # All PRs
  security-tests:
    # pre-prod, production branches only
  e2e-tests:
    # pre-prod, production branches only
```

### Pre-commit Hook

**File**: `.husky/pre-commit`

```bash
npm run lint
npm run test:unit -- --changedSince=HEAD~1
```

### Acceptance Criteria

- [ ] GitHub Actions workflow created
- [ ] Unit tests run on every PR
- [ ] Security tests run on pre-prod/production
- [ ] Coverage reports uploaded
- [ ] Pre-commit hooks installed

---

## T6: Test Coverage Dashboard (3 pts)

### Dashboard Updates

- [ ] Create `TEST_COVERAGE_DASHBOARD.md`
- [ ] Document current coverage by module
- [ ] Set up sprint tracking table
- [ ] Define coverage targets

### Acceptance Criteria

- [ ] Dashboard shows real coverage numbers
- [ ] Module-by-module breakdown exists
- [ ] Update process documented

---

## T7: Test Tooling Updates (4 pts)

### Jest Configuration

- [ ] Create `tests/helpers/testUtils.js`
- [ ] Create `tests/helpers/factories.js`
- [ ] Update `jest.config.js` for security tests
- [ ] Add coverage thresholds

### npm Scripts

Add to `package.json`:

```json
{
  "test:security": "jest tests/security",
  "test:golden-path": "jest tests/e2e/golden-path.test.js",
  "test:consultant": "jest tests/e2e/consultant-role.test.js",
  "test:multi-tenant": "jest tests/security/multi-tenant-isolation.test.js"
}
```

### Acceptance Criteria

- [ ] All new npm scripts work
- [ ] Test helpers created
- [ ] Factory functions for test data
- [ ] Coverage thresholds enforced

---

## Implementation Order

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 1 | T4 | 3 | Folder reorganization |
| 2 | T7 | 4 | Test tooling setup |
| 3-4 | T3 | 5 | Multi-tenant tests |
| 5-6 | T2 | 5 | CONSULTANT tests |
| 7-8 | T1 | 5 | Golden path test |
| 9 | T5 | 5 | CI/CD integration |
| 10 | T6 | 3 | Coverage dashboard |

---

## Dependencies

### Required Before Implementation

- Sprint 15-A Epic P0 (strategic vision fix) - for accurate OKR generation tests
- Existing test infrastructure (`tests/` folder)
- MongoDB test instance

### Blocked By This Epic

- Audit closure for AH-9, AH-10, AH-11
- Production deployment quality gates

---

## Success Criteria

### Audit Closure

- [ ] AH-9: Golden Path test passes in CI
- [ ] AH-10: CONSULTANT tests pass in CI
- [ ] AH-11: Multi-tenant isolation tests pass in CI

### Coverage Improvement

- [ ] Security tests: 0 → 15
- [ ] E2E tests: 1 → 3
- [ ] Overall: 38% → 50%

### Documentation

- [ ] Single QA entry point
- [ ] No overlapping docs
- [ ] Clear folder structure

---

**Document Version**: 1.0
**Created**: March 6, 2026
**Author**: Claude Code
