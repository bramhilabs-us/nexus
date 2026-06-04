# Sprint 19: Comprehensive Testing Infrastructure

**Sprint**: 19
**Duration**: 1.5 weeks
**Status**: PLANNED
**Total Points**: 75 pts
**Type**: Infrastructure (Testing & CI/CD)
**Prerequisite**: Sprint 18 complete, Sprint 16-D documentation foundations

---

## Executive Summary

Sprint 19 establishes a **production-grade testing infrastructure** that runs automatically during deployment and pre-deployment. This sprint transforms the current ad-hoc testing into a systematic, gate-based quality assurance system.

### Goals

1. **Pre-Deployment Gates** - Tests must pass before code reaches pre-prod/production
2. **Deployment Verification** - Smoke tests run after deployment to verify health
3. **Test Coverage Enforcement** - Minimum coverage thresholds enforced
4. **Service-Aware Testing** - Tests that require services (IAM, MongoDB) run in proper environments
5. **Reporting & Visibility** - Clear test reports and badges

---

## Problem Statement

### Current State

| Metric | Current | Target |
|--------|---------|--------|
| Unit Tests | 1152 passing | 1200+ |
| Integration Tests | 181 passing | 250+ |
| E2E Tests | Skipped on dev | Running on pre-prod |
| Security Tests | Skipped on dev | Running on pre-prod |
| Test Coverage | Unknown | >70% |
| Pre-deploy Gate | None | Required pass |
| Post-deploy Smoke | None | Automated |

### Pain Points

1. **No Pre-deployment Gate** - Code can merge without all tests passing
2. **Service Dependencies** - Some tests need IAM Engine, not available in all environments
3. **No Coverage Tracking** - Don't know what code is untested
4. **Manual E2E Verification** - No automated smoke tests after deployment
5. **Test Organization** - Tests scattered, unclear which run where

---

## Architecture

### Test Pyramid

```
                    ┌─────────────┐
                    │    E2E      │  (10%) - Full system, UI flows
                    │   Tests     │  Runs: pre-prod, production
                    ├─────────────┤
                    │  Security   │  (5%) - Multi-tenant, auth
                    │   Tests     │  Runs: pre-prod, production
                ┌───┴─────────────┴───┐
                │    Integration      │  (25%) - API routes, DB
                │      Tests          │  Runs: all branches
            ┌───┴─────────────────────┴───┐
            │         Unit Tests          │  (60%) - Functions, utils
            │      (No dependencies)      │  Runs: all branches
            └─────────────────────────────┘
```

### CI/CD Pipeline

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   DEVELOP    │───►│   PRE-PROD   │───►│  PRODUCTION  │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Unit Tests   │    │ All Tests    │    │ Full Suite   │
│ Integration  │    │ + Security   │    │ + Coverage   │
│ Lint Check   │    │ + E2E        │    │ + Smoke      │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   MUST PASS           MUST PASS           MUST PASS
   to merge            to deploy           + POST-DEPLOY
                                           SMOKE TEST
```

---

## Epic Overview

| Epic | Points | Focus |
|------|--------|-------|
| T1: Test Organization | 10 | Reorganize tests by execution environment |
| T2: CI/CD Enhancement | 15 | Pre-deployment gates, branch protection |
| T3: Coverage Infrastructure | 12 | Coverage reports, thresholds, badges |
| T4: Post-Deploy Smoke Tests | 15 | Automated health checks after deployment |
| T5: Service Mocking | 10 | Mock IAM Engine for integration tests |
| T6: Test Documentation | 8 | Test README, contributing guide |
| T7: Monitoring & Alerts | 5 | Slack/email notifications on failure |
| **Total** | **75** | |

---

## Epic T1: Test Organization (10 pts)

**Purpose**: Reorganize tests so each type runs in the correct environment.

| Story | Points | Description |
|-------|--------|-------------|
| T1-1 | 3 | Audit all tests, categorize by dependency |
| T1-2 | 3 | Create test categorization in jest.config.js |
| T1-3 | 2 | Move misplaced tests to correct folders |
| T1-4 | 2 | Create `tests/README.md` with test map |

### Test Categories

```
tests/
├── unit/                    # No external dependencies
│   ├── models/             # Mongoose schema validation (mocked)
│   ├── services/           # Service logic (mocked)
│   ├── utils/              # Utility functions
│   └── middleware/         # Middleware logic (mocked)
│
├── integration/             # Requires MongoDB only
│   ├── routes/             # API endpoint tests
│   ├── ssi-scoring/        # SSI calculation tests
│   └── api/                # API contract tests
│
├── e2e/                     # Requires full services (MongoDB + IAM)
│   ├── user-workflows/     # Complete user journeys
│   ├── signup/             # Signup flow (needs IAM)
│   └── golden-path/        # Critical path tests
│
├── security/                # Security-specific tests
│   ├── multi-tenant/       # Tenant isolation
│   ├── auth/               # Authentication tests
│   └── rbac/               # Role-based access control
│
├── smoke/                   # POST-DEPLOYMENT quick checks
│   ├── health-check.test.js
│   ├── critical-endpoints.test.js
│   └── database-connection.test.js
│
├── helpers/                 # Test utilities
├── fixtures/                # Test data
└── setup.js                 # Global setup
```

---

## Epic T2: CI/CD Enhancement (15 pts)

**Purpose**: Enforce test gates before deployment.

| Story | Points | Description |
|-------|--------|-------------|
| T2-1 | 5 | Update test.yml for mandatory gates |
| T2-2 | 3 | Add branch protection rules via gh CLI |
| T2-3 | 3 | Create deployment gate workflow |
| T2-4 | 2 | Add status checks to PR template |
| T2-5 | 2 | Configure concurrency to cancel stale runs |

### T2-1: Updated test.yml

```yaml
# .github/workflows/test.yml

name: Tests

on:
  push:
    branches: [development, pre-prod, production, main]
  pull_request:
    branches: [development, pre-prod, production, main]

env:
  NODE_VERSION: '18.x'
  JWT_SECRET: test-jwt-secret-for-ci-pipeline-minimum-32-characters-required

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ============================================================
  # TIER 1: Fast checks (all branches)
  # ============================================================
  lint:
    name: Lint Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm run lint

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: actions/upload-artifact@v4
        with: { name: unit-coverage, path: coverage/ }

  # ============================================================
  # TIER 2: Integration (requires MongoDB)
  # ============================================================
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: [lint, unit-tests]
    services:
      mongodb:
        image: mongo:6.0
        ports: ['27017:27017']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm run test:integration
        env:
          MONGODB_URI: mongodb://localhost:27017/karvia_test

  # ============================================================
  # TIER 3: Security & E2E (pre-prod/production only)
  # ============================================================
  security-tests:
    name: Security Tests
    runs-on: ubuntu-latest
    needs: integration-tests
    if: github.ref == 'refs/heads/pre-prod' || github.ref == 'refs/heads/production'
    services:
      mongodb:
        image: mongo:6.0
        ports: ['27017:27017']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm run test:security
        env:
          MONGODB_URI: mongodb://localhost:27017/karvia_test

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: security-tests
    if: github.ref == 'refs/heads/pre-prod' || github.ref == 'refs/heads/production'
    services:
      mongodb:
        image: mongo:6.0
        ports: ['27017:27017']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '${{ env.NODE_VERSION }}', cache: 'npm' }
      - run: npm ci
      - run: npm run test:e2e
        env:
          MONGODB_URI: mongodb://localhost:27017/karvia_test

  # ============================================================
  # DEPLOYMENT GATE
  # ============================================================
  deployment-gate:
    name: Deployment Gate
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    if: always()
    steps:
      - name: Check all tests passed
        run: |
          if [[ "${{ needs.unit-tests.result }}" != "success" ]] || \
             [[ "${{ needs.integration-tests.result }}" != "success" ]]; then
            echo "::error::Tests failed - deployment blocked"
            exit 1
          fi
          echo "All tests passed - deployment approved"
```

---

## Epic T3: Coverage Infrastructure (12 pts)

**Purpose**: Track and enforce test coverage.

| Story | Points | Description |
|-------|--------|-------------|
| T3-1 | 4 | Configure Jest coverage thresholds |
| T3-2 | 3 | Add coverage badges to README |
| T3-3 | 3 | Create coverage report artifact |
| T3-4 | 2 | Add coverage to PR comments |

### T3-1: Coverage Thresholds

```javascript
// tests/jest.config.js additions

coverageThreshold: {
  global: {
    branches: 60,
    functions: 60,
    lines: 70,
    statements: 70
  },
  './server/services/': {
    branches: 70,
    functions: 80,
    lines: 80,
    statements: 80
  },
  './server/routes/': {
    branches: 50,
    functions: 60,
    lines: 60,
    statements: 60
  }
}
```

---

## Epic T4: Post-Deploy Smoke Tests (15 pts)

**Purpose**: Verify deployment health automatically.

| Story | Points | Description |
|-------|--------|-------------|
| T4-1 | 5 | Create smoke test suite |
| T4-2 | 4 | Create post-deploy workflow |
| T4-3 | 3 | Add rollback trigger on smoke failure |
| T4-4 | 3 | Create health check endpoint |

### T4-1: Smoke Test Suite

```javascript
// tests/smoke/health-check.test.js

const axios = require('axios');

const BASE_URL = process.env.SMOKE_TEST_URL || 'https://karvia-business.onrender.com';

describe('Production Smoke Tests', () => {
  describe('Health Checks', () => {
    test('API health endpoint responds', async () => {
      const response = await axios.get(`${BASE_URL}/health`);
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('healthy');
    });

    test('Database connection is healthy', async () => {
      const response = await axios.get(`${BASE_URL}/health/db`);
      expect(response.status).toBe(200);
      expect(response.data.connected).toBe(true);
    });
  });

  describe('Critical Endpoints', () => {
    test('Auth endpoint responds', async () => {
      const response = await axios.get(`${BASE_URL}/api/auth/status`);
      expect(response.status).toBe(200);
    });

    test('Static assets load', async () => {
      const response = await axios.get(`${BASE_URL}/js/common.js`);
      expect(response.status).toBe(200);
    });
  });
});
```

### T4-2: Post-Deploy Workflow

```yaml
# .github/workflows/post-deploy-smoke.yml

name: Post-Deploy Smoke Tests

on:
  deployment_status:
    types: [success]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to test'
        required: true
        type: choice
        options: [development, pre-prod, production]

jobs:
  smoke-tests:
    name: Smoke Tests
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success' || github.event_name == 'workflow_dispatch'

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with: { node-version: '18.x', cache: 'npm' }

      - run: npm ci

      - name: Run smoke tests
        run: npm run test:smoke
        env:
          SMOKE_TEST_URL: ${{ env.TARGET_URL }}

      - name: Notify on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Smoke tests FAILED for ${{ github.event.deployment_status.environment }}",
              "attachments": [{"color": "danger", "text": "Check workflow run"}]
            }

env:
  TARGET_URL: >-
    ${{ github.event.deployment_status.environment == 'production'
        && 'https://karvia-business.onrender.com'
        || github.event.deployment_status.environment == 'pre-prod'
        && 'https://karvia-business-2.onrender.com'
        || 'https://karvia-business-1.onrender.com' }}
```

---

## Epic T5: Service Mocking (10 pts)

**Purpose**: Enable integration tests to run without IAM Engine.

| Story | Points | Description |
|-------|--------|-------------|
| T5-1 | 4 | Create IAM Engine mock server |
| T5-2 | 3 | Update tests to use mock when service unavailable |
| T5-3 | 3 | Document mocking strategy |

### T5-1: IAM Mock Server

```javascript
// tests/helpers/iam-mock-server.js

const express = require('express');

function createIAMMockServer() {
  const app = express();
  app.use(express.json());

  // Mock signup endpoint
  app.post('/api/auth/signup', (req, res) => {
    const { email, role, business_name } = req.body;
    res.status(201).json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        _id: 'mock-user-id',
        email,
        role,
        business_id: role !== 'CONSULTANT' ? 'mock-business-id' : null
      }
    });
  });

  // Mock login endpoint
  app.post('/api/auth/login', (req, res) => {
    res.status(200).json({
      success: true,
      token: 'mock-jwt-token',
      user: { _id: 'mock-user-id', email: req.body.email }
    });
  });

  return app;
}

module.exports = { createIAMMockServer };
```

---

## Epic T6: Test Documentation (8 pts)

**Purpose**: Document testing practices for contributors.

| Story | Points | Description |
|-------|--------|-------------|
| T6-1 | 3 | Create `tests/README.md` |
| T6-2 | 3 | Create `TESTING_GUIDE.md` |
| T6-3 | 2 | Add test examples to each folder |

---

## Epic T7: Monitoring & Alerts (5 pts)

**Purpose**: Get notified when tests fail.

| Story | Points | Description |
|-------|--------|-------------|
| T7-1 | 3 | Configure Slack notifications |
| T7-2 | 2 | Add email alerts for production failures |

---

## npm Scripts

```json
{
  "scripts": {
    "test": "jest --config tests/jest.config.js",
    "test:unit": "jest --config tests/jest.config.js --selectProjects unit",
    "test:integration": "jest --config tests/jest.config.js --selectProjects integration",
    "test:e2e": "jest --config tests/jest.config.js --selectProjects e2e",
    "test:security": "jest --config tests/jest.config.js --selectProjects security",
    "test:smoke": "jest --config tests/jest.config.js --testPathPattern=smoke",
    "test:coverage": "jest --config tests/jest.config.js --coverage",
    "test:watch": "jest --config tests/jest.config.js --watch",
    "test:ci": "jest --config tests/jest.config.js --ci --coverage --reporters=default --reporters=jest-junit"
  }
}
```

---

## Implementation Schedule

| Day | Focus | Points | Deliverables |
|-----|-------|--------|--------------|
| 1 | T1: Test Organization | 10 | Test audit, folder restructure |
| 2-3 | T2: CI/CD Enhancement | 15 | Updated workflows, gates |
| 4 | T3: Coverage | 12 | Coverage config, badges |
| 5-6 | T4: Smoke Tests | 15 | Smoke suite, post-deploy workflow |
| 7 | T5: Service Mocking | 10 | IAM mock, test updates |
| 8 | T6: Documentation | 8 | README, guide |
| 9 | T7: Monitoring | 5 | Alerts setup |

---

## Success Criteria

### Quantitative

- [ ] Unit tests: 1200+ passing
- [ ] Integration tests: 250+ passing
- [ ] Code coverage: >70% overall
- [ ] Smoke tests: <30 seconds execution
- [ ] CI pipeline: <5 minutes for unit+integration

### Qualitative

- [ ] All PRs blocked until tests pass
- [ ] Deployment auto-blocked on test failure
- [ ] Post-deploy smoke tests catch regressions
- [ ] Clear test documentation for contributors
- [ ] Alerts reach team within 5 minutes of failure

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Sprint 18 complete | DONE | Current baseline |
| MongoDB in CI | DONE | Already configured |
| GitHub Actions | DONE | Workflow exists |
| Render deployments | DONE | Auto-deploy on push |

---

## Known Dependency Issues (Pre-Sprint 19)

These issues were discovered during CI testing on March 10, 2026. They are **workarounds** that need proper fixes in Sprint 19.

### Issue 1: JWT Secret Mismatch

**Problem**: Tests generate tokens with one secret, but authGuards.js verifies with a different secret.

| Component | Secret Used |
|-----------|-------------|
| authHelper.js | `process.env.JWT_SECRET \|\| 'test-jwt-secret-...'` |
| authGuards.js | `process.env.JWT_SECRET \|\| 'dev-only-insecure-...'` |
| CI Workflow | `JWT_SECRET: test-jwt-secret-for-ci-pipeline-...` |

**Current Workaround**:
- Tests mock `authGuards` and import `TEST_JWT_SECRET` from `authHelper.js`
- Files affected: `multi-tenant-isolation.test.js`, `golden-path.test.js`, `consultant-role.test.js`

**Proper Fix Needed**:
- Standardize test JWT secret across all files
- Create shared `tests/config/secrets.js` that both authHelper and mocks use
- Update authGuards.js to use same fallback as authHelper in test mode

### Issue 2: Puppeteer Not Installed in CI

**Problem**: `user-workflow.test.js` requires `puppeteer` which is not installed in CI.

**Current Workaround**:
```javascript
let puppeteerAvailable = false;
try { puppeteer = require('puppeteer'); puppeteerAvailable = true; } catch (e) {}
const describeOrSkip = puppeteerAvailable ? describe : describe.skip;
```

**Proper Fix Needed**:
- Option A: Add puppeteer to devDependencies (increases CI time)
- Option B: Move browser tests to separate workflow with puppeteer
- Option C: Use Playwright instead (better CI support)

### Issue 3: IAM Engine Dependency

**Problem**: `signup.test.js` requires IAM Engine running on port 8081.

**Current Workaround**:
```javascript
const isCI = process.env.CI === 'true';
const iamAvailable = !isCI || !!process.env.IAM_ENGINE_URL;
const describeIfIam = iamAvailable ? describe : describe.skip;
```

**Proper Fix Needed** (Epic T5):
- Create IAM mock server in `tests/helpers/iam-mock-server.js`
- Mock signup, login, token validation endpoints
- Tests use mock when IAM Engine not available

### Issue 4: Key Results Validation Errors

**Problem**: Goal model post-save hook tries to update Objective, but key_results missing required fields.

**Error**: `Objective validation failed: key_results.0.quarter: Path 'quarter' is required`

**Seen in**: `golden-path.test.js` (console.error, tests still pass)

**Proper Fix Needed**:
- Review Goal.js post-save hook at line 571
- Ensure key_results have all required fields before Objective.save()
- Add defensive checks or skip cascade if fields missing

### Issue 5: Tests with External Service Dependencies

| Test File | Dependency | CI Status |
|-----------|------------|-----------|
| `user-workflow.test.js` | Puppeteer | Skipped |
| `signup.test.js` | IAM Engine | Skipped |
| `golden-path.test.js` | MongoDB + Mock Auth | Passing |
| `consultant-role.test.js` | MongoDB + Mock Auth | Passing |
| `multi-tenant-isolation.test.js` | MongoDB + Mock Auth | Passing |

### Sprint 19 Tasks to Address These

| Task | Epic | Points | Description |
|------|------|--------|-------------|
| D1 | T5 | 5 | Create shared test secrets config |
| D2 | T5 | 5 | Create IAM mock server |
| D3 | T1 | 3 | Fix Goal→Objective cascade validation |
| D4 | T1 | 2 | Decide on Puppeteer/Playwright strategy |
| D5 | T5 | 3 | Document test dependency matrix |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Smoke tests flaky | Use retries, timeout handling |
| Coverage drops existing tests | Start with current baseline, increase gradually |
| Mock drift from real service | Document mock expectations, periodic validation |
| CI time too long | Parallel execution, caching |
| JWT secret mismatch | Shared secrets config (D1) |

---

## Related Documents

- [Sprint 18 Handoff](../SPRINT-18%20(Planned)/SPRINT18_HANDOFF_DOCUMENT.md)
- [Sprint 16-D Documentation](../SPRINT-16D%20(Skipped)/SPRINT-16D-MASTER-PLAN.md)
- [CI/CD Workflow](.github/workflows/test.yml)
- [Jest Config](tests/jest.config.js)

---

**Document Version**: 1.0.0
**Created**: March 10, 2026
**Author**: Claude Code
