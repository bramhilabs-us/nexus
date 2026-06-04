# Testing Infrastructure Redesign Plan

**Created**: March 6, 2026
**Status**: PLANNING
**Sprint**: 15-A (Enhancement)
**Story Points**: 30 pts (New Epic T)

---

## Executive Summary

This plan addresses critical testing weaknesses identified in audit reports (AH-9, AH-10, AH-11) and reorganizes the chaotic QA folder structure into a maintainable, actionable testing infrastructure.

### Current Problems

1. **Low Test Coverage**: Only 28 test files for 58+ backend components (48% coverage)
2. **Missing Critical Tests**: No multi-tenant isolation, no CONSULTANT role, no lifecycle tests
3. **Disorganized QA Folder**: 70+ scattered files, 3 overlapping "Master Test Plans"
4. **No CI/CD Enforcement**: Tests exist but aren't blocking deployments
5. **Outdated Documentation**: Sprint-specific clutter from Nov 2025

### Goals

1. **Close Audit Gaps**: Implement AH-9, AH-10, AH-11
2. **Reorganize QA Folder**: Single source of truth, clear entry points
3. **Increase Test Coverage**: 80% unit, 60% integration, 5 critical E2E paths
4. **Enforce Quality Gates**: Pre-commit hooks, CI/CD blocking

---

## Part 1: New Folder Structure

### Proposed Structure

```
KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/
│
├── README.md                        # QA entry point (NEW - single TOC)
├── TESTING_STANDARDS.md             # Quality gates, metrics, targets
├── TEST_COVERAGE_DASHBOARD.md       # Live metrics (updated each sprint)
│
├── 1-STRATEGY/                      # Testing strategy docs
│   ├── MASTER_TEST_STRATEGY.md      # Single consolidated strategy
│   └── QUALITY_GATES.md             # Pre-commit, pre-merge, pre-deploy rules
│
├── 2-TEST-PLANS/                    # Active test plans
│   ├── CURRENT_SPRINT.md            # Symlink/pointer to active sprint
│   ├── sprint-15a/
│   │   └── TEST_PLAN.md
│   └── templates/
│       └── SPRINT_TEST_TEMPLATE.md
│
├── 3-TEST-SUITES/                   # Executable test documentation
│   ├── unit/                        # Unit test specs
│   │   └── README.md
│   ├── integration/                 # Integration test specs
│   │   └── README.md
│   ├── e2e/                         # E2E journey definitions
│   │   ├── USER_JOURNEYS.md
│   │   ├── CONSULTANT_JOURNEYS.md   # (NEW - AH-10)
│   │   └── GOLDEN_PATH.md           # (NEW - AH-9)
│   └── security/                    # Security tests
│       └── MULTI_TENANT_TESTS.md    # (NEW - AH-11)
│
├── 4-AUTOMATION/                    # Automation tooling
│   ├── playwright/                  # Consolidated Playwright
│   │   ├── playwright.config.ts
│   │   ├── tests/
│   │   │   ├── auth/
│   │   │   ├── journeys/
│   │   │   └── regression/
│   │   └── README.md
│   └── ci/                          # CI/CD configs
│       └── github-actions.yml
│
├── 5-REPORTS/                       # Test results
│   ├── CURRENT_SPRINT_RESULTS.md
│   └── archive/                     # Historical reports
│
├── 6-ISSUES/                        # Bug tracking
│   ├── OPEN_ISSUES.md
│   └── templates/
│       └── BUG_REPORT_TEMPLATE.md
│
└── ARCHIVE/                         # Old docs (read-only)
    ├── legacy-sprint-plans/
    ├── legacy-audit-reports/
    └── legacy-docs/
```

### Files to Archive

Move these to `ARCHIVE/legacy-docs/`:
- `DEPLOYMENT_CHECKLIST.md`
- `DEPLOYMENT_MUST_DOS.md`
- `INTEGRATION_TESTING_GUIDE.md`
- `MASTER_TEST_PLAN.md` (replaced by consolidated version)
- `OKR_SCENARIOS_AND_EDGE_CASES.md`
- `OKR_WORKFLOW_COMPREHENSIVE_TEST_PLAN.md`
- `PRE_DEPLOY_CHECKLIST.md`
- `SECRETS_MANAGEMENT.md`
- `SPRINT_7_8_TECHNICAL_AUDIT.md`

Move `QA/sprints/sprint-01/` through `sprint-14/` to `ARCHIVE/legacy-sprint-plans/`

Move `QA/sprints/archive/audit-reports/` to `ARCHIVE/legacy-audit-reports/`

---

## Part 2: Critical Test Implementations

### Epic T: Testing Infrastructure (30 pts)

| Story | Points | Priority | Description |
|-------|--------|----------|-------------|
| T1: Golden Path Test | 5 | HIGH | Full lifecycle: Register → Assessment → SSI → OKR → Tasks |
| T2: CONSULTANT Suite | 5 | HIGH | Multi-company access, client switching, admin functions |
| T3: Multi-Tenant Isolation | 5 | HIGH | 2-company cross-access prevention tests |
| T4: Folder Reorganization | 3 | MEDIUM | Execute new folder structure |
| T5: CI/CD Integration | 5 | MEDIUM | GitHub Actions workflow, pre-commit hooks |
| T6: Coverage Dashboard | 3 | LOW | Live metrics tracking |
| T7: Test Tooling Setup | 4 | MEDIUM | Jest config updates, Playwright consolidation |

---

### T1: Golden Path Test (AH-9)

**File**: `tests/e2e/golden-path.test.js`

```javascript
/**
 * Golden Path Test - Full Product Lifecycle
 * Addresses: AH-9 (No Full Product Lifecycle Journey Test)
 *
 * Flow: Register → Assessment → SSI → OKR Generation → Planning → Tasks
 */

describe('Golden Path - Full Product Lifecycle', () => {
  let authToken;
  let companyId;
  let userId;
  let assessmentId;
  let objectiveId;
  let goalId;
  let taskId;

  describe('Phase 1: Company Onboarding', () => {
    test('1.1 Consultant creates company invitation', async () => {
      // POST /api/invitations/invite-company
    });

    test('1.2 Business owner accepts invitation', async () => {
      // POST /api/invitations/:id/accept
    });

    test('1.3 Business owner completes profile', async () => {
      // PATCH /api/companies/:id/profile
    });
  });

  describe('Phase 2: Assessment', () => {
    test('2.1 Business owner receives assessment link', async () => {
      // GET /api/assessments/pending
    });

    test('2.2 Business owner completes SSI assessment', async () => {
      // POST /api/assessments/:id/submit
    });

    test('2.3 SSI scores are calculated', async () => {
      // GET /api/analytics/ssi/:companyId
    });
  });

  describe('Phase 3: OKR Generation', () => {
    test('3.1 AI generates objectives based on SSI', async () => {
      // POST /api/ai/objectives/generate
    });

    test('3.2 Business owner accepts objectives', async () => {
      // POST /api/objectives
    });

    test('3.3 Key results are created', async () => {
      // POST /api/key-results
    });
  });

  describe('Phase 4: Goal Planning', () => {
    test('4.1 Quarterly goals are created', async () => {
      // POST /api/goals/quarterly
    });

    test('4.2 Weekly goals are broken down', async () => {
      // POST /api/goals/weekly
    });
  });

  describe('Phase 5: Task Execution', () => {
    test('5.1 Tasks are created from goals', async () => {
      // POST /api/tasks
    });

    test('5.2 Tasks are assigned to team members', async () => {
      // PATCH /api/tasks/:id/assign
    });

    test('5.3 Task completion updates goal progress', async () => {
      // PATCH /api/tasks/:id/complete
    });
  });

  describe('Phase 6: Verification', () => {
    test('6.1 Dashboard shows correct metrics', async () => {
      // GET /api/dashboard/metrics
    });

    test('6.2 Progress cascades correctly', async () => {
      // GET /api/objectives/:id/progress
    });
  });
});
```

---

### T2: CONSULTANT Role Suite (AH-10)

**File**: `tests/e2e/consultant-role.test.js`

```javascript
/**
 * CONSULTANT Role Tests
 * Addresses: AH-10 (CONSULTANT Role Undertested)
 */

describe('CONSULTANT Role - Super Admin Access', () => {
  let consultantToken;
  let company1Id, company2Id;

  beforeAll(async () => {
    // Login as CONSULTANT
  });

  describe('Multi-Company Access', () => {
    test('Can view all companies', async () => {
      // GET /api/companies
    });

    test('Can switch between companies', async () => {
      // POST /api/auth/switch-company
    });

    test('Can access company 1 data', async () => {
      // GET /api/companies/:company1Id/data
    });

    test('Can access company 2 data', async () => {
      // GET /api/companies/:company2Id/data
    });
  });

  describe('Admin Functions', () => {
    test('Can create company invitations', async () => {
      // POST /api/invitations/invite-company
    });

    test('Can view all assessments across companies', async () => {
      // GET /api/assessments?scope=all
    });

    test('Can invite team members for any company', async () => {
      // POST /api/invitations/invite-team-member
    });

    test('Can generate OKRs for any company', async () => {
      // POST /api/ai/objectives/generate
    });
  });

  describe('Team Management', () => {
    test('Can view teams for any company', async () => {
      // GET /api/teams?company_id=:id
    });

    test('Can create teams for any company', async () => {
      // POST /api/teams
    });

    test('Can manage invitations for any company', async () => {
      // GET /api/invitations?company_id=:id
    });
  });

  describe('Diagnostic Access', () => {
    test('Can view SSI reports for all companies', async () => {
      // GET /api/analytics/ssi/:companyId
    });

    test('Can access diagnostic engine', async () => {
      // GET /api/diagnostic-reports/:companyId
    });
  });
});
```

---

### T3: Multi-Tenant Isolation Tests (AH-11)

**File**: `tests/security/multi-tenant-isolation.test.js`

```javascript
/**
 * Multi-Tenant Isolation Tests
 * Addresses: AH-11 (No Multi-Tenant Isolation Tests)
 *
 * Ensures data from Company A is never accessible to Company B
 */

describe('Multi-Tenant Data Isolation', () => {
  let companyA = { id: null, token: null, userId: null };
  let companyB = { id: null, token: null, userId: null };

  beforeAll(async () => {
    // Setup: Create two companies with different users
    companyA = await createTestCompany('Company A');
    companyB = await createTestCompany('Company B');
  });

  describe('Data Isolation - Company A cannot access Company B', () => {
    test('Cannot view Company B objectives', async () => {
      const res = await request(app)
        .get(`/api/objectives/${companyB.objectiveId}`)
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(403);
    });

    test('Cannot view Company B goals', async () => {
      const res = await request(app)
        .get(`/api/goals/${companyB.goalId}`)
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(403);
    });

    test('Cannot view Company B tasks', async () => {
      const res = await request(app)
        .get(`/api/tasks/${companyB.taskId}`)
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(403);
    });

    test('Cannot view Company B team members', async () => {
      const res = await request(app)
        .get(`/api/teams/${companyB.teamId}/members`)
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(403);
    });

    test('Cannot view Company B assessments', async () => {
      const res = await request(app)
        .get(`/api/assessments/${companyB.assessmentId}`)
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(403);
    });

    test('Cannot view Company B SSI scores', async () => {
      const res = await request(app)
        .get(`/api/analytics/ssi/${companyB.id}`)
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe('List Endpoints Isolation', () => {
    test('GET /api/objectives returns only Company A data', async () => {
      const res = await request(app)
        .get('/api/objectives')
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.every(obj => obj.company_id === companyA.id)).toBe(true);
    });

    test('GET /api/goals returns only Company A data', async () => {
      const res = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.every(g => g.company_id === companyA.id)).toBe(true);
    });

    test('GET /api/tasks returns only Company A data', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(200);
      expect(res.body.every(t => t.company_id === companyA.id)).toBe(true);
    });
  });

  describe('Mutation Isolation', () => {
    test('Cannot update Company B objective', async () => {
      const res = await request(app)
        .put(`/api/objectives/${companyB.objectiveId}`)
        .set('Authorization', `Bearer ${companyA.token}`)
        .send({ title: 'Hacked!' });

      expect(res.status).toBe(403);
    });

    test('Cannot delete Company B task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${companyB.taskId}`)
        .set('Authorization', `Bearer ${companyA.token}`);

      expect(res.status).toBe(403);
    });

    test('Cannot assign Company B task to self', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${companyB.taskId}/assign`)
        .set('Authorization', `Bearer ${companyA.token}`)
        .send({ user_id: companyA.userId });

      expect(res.status).toBe(403);
    });
  });
});
```

---

## Part 3: CI/CD Integration

### T5: GitHub Actions Workflow

**File**: `.github/workflows/test.yml`

```yaml
name: Test Suite

on:
  push:
    branches: [development, pre-prod, production]
  pull_request:
    branches: [development, pre-prod, production]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          MONGODB_URI: mongodb://localhost:27017/karvia_test

  security-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run multi-tenant isolation tests
        run: npm run test:security
        env:
          MONGODB_URI: mongodb://localhost:27017/karvia_test

  e2e-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/pre-prod' || github.ref == 'refs/heads/production'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-results
          path: playwright-report/
```

### Pre-commit Hook

**File**: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run unit tests for changed files
npm run test:unit -- --changedSince=HEAD~1 --passWithNoTests
```

---

## Part 4: Updated npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit --coverage",
    "test:integration": "jest tests/integration",
    "test:e2e": "jest tests/e2e",
    "test:security": "jest tests/security",
    "test:golden-path": "jest tests/e2e/golden-path.test.js",
    "test:consultant": "jest tests/e2e/consultant-role.test.js",
    "test:multi-tenant": "jest tests/security/multi-tenant-isolation.test.js",
    "test:all": "jest --runInBand",
    "test:ci": "jest --ci --coverage --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --coverageReporters=text-summary"
  }
}
```

---

## Part 5: Test Coverage Targets

### Target Metrics by Sprint 16

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| **Unit Test Coverage** | ~40% | 80% | 40% |
| **Integration Coverage** | ~20% | 60% | 40% |
| **E2E Journeys** | 2 | 5 | 3 |
| **Multi-Tenant Tests** | 0 | 15 | 15 |
| **CONSULTANT Tests** | 0 | 12 | 12 |
| **Golden Path** | 0 | 1 complete | 1 |

### Critical Path Coverage

| Journey | Status | Test File |
|---------|--------|-----------|
| 1. Auth → Dashboard | EXISTS | `tests/e2e/user-workflow.test.js` |
| 2. Assessment → SSI | MISSING | `tests/e2e/golden-path.test.js` |
| 3. OKR Generation | MISSING | `tests/e2e/golden-path.test.js` |
| 4. Goal → Task Cascade | MISSING | `tests/integration/cascade.test.js` |
| 5. CONSULTANT Multi-Company | MISSING | `tests/e2e/consultant-role.test.js` |

---

## Part 6: Implementation Order

| Day | Task | Points | Output |
|-----|------|--------|--------|
| 1 | T4: Folder reorganization | 3 | New structure live |
| 2 | T7: Jest/Playwright config | 4 | Test tooling ready |
| 3-4 | T3: Multi-tenant tests | 5 | 15 isolation tests |
| 5-6 | T2: CONSULTANT suite | 5 | 12 role tests |
| 7-8 | T1: Golden path | 5 | Full lifecycle test |
| 9 | T5: CI/CD setup | 5 | GitHub Actions live |
| 10 | T6: Coverage dashboard | 3 | Metrics tracking |

---

## Success Criteria

### Audit Closure
- [ ] AH-9: Golden Path test passes in CI
- [ ] AH-10: CONSULTANT tests pass in CI
- [ ] AH-11: Multi-tenant isolation tests pass in CI

### Folder Organization
- [ ] Single `README.md` entry point
- [ ] No duplicate "Master Test Plan" docs
- [ ] All legacy docs in `ARCHIVE/`
- [ ] Clear folder naming (`1-`, `2-`, etc.)

### CI/CD
- [ ] GitHub Actions runs on every PR
- [ ] Unit tests block merge if failing
- [ ] Security tests run on pre-prod/production
- [ ] Coverage reports to Codecov

---

**Document Version**: 1.0
**Created**: March 6, 2026
**Author**: Claude Code
