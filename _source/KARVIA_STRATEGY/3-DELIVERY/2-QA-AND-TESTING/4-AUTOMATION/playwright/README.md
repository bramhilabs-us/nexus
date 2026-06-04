# Karvia Business - Playwright E2E Testing Suite

## Overview

This directory contains comprehensive End-to-End (E2E) tests for the Karvia Business OKR platform using Playwright. Tests are organized into three priority tiers:

1. **BST (Basic Smoke Tests)** - P0 Critical path tests
2. **User Journey Tests** - P1 Complete workflow tests
3. **Edge Cases & Error Handling** - P2 Boundary condition tests

## Quick Start

### Prerequisites

```bash
# Install dependencies
npm install
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run BST only (fast smoke tests)
npm run test:bst

# Run user journeys
npm run test:journeys

# Run specific test file
npx playwright test tests/bst/01-login.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run with UI mode (interactive debugging)
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium
```

### Test Reports

```bash
# View HTML report
npx playwright show-report

# View trace for failed test
npx playwright show-trace test-results/trace.zip
```

## Test Organization

```
PLAYWRIGHT/
├── README.md                          # This file
├── TEST_PLAN.md                       # Complete test strategy
├── TEST_CASES_BST.md                  # BST test case specifications
├── TEST_CASES_USER_JOURNEYS.md        # User journey specifications
├── TEST_CASES_EDGE_CASES.md           # Edge case specifications
├── playwright.config.ts               # Playwright configuration
├── package.json                       # Dependencies
├── setup/
│   ├── globalSetup.ts                 # Database seeding, test data
│   ├── auth.setup.ts                  # Authenticate test users
│   ├── fixtures.ts                    # Reusable test fixtures
│   └── testData.ts                    # Test user/company data
├── tests/
│   ├── bst/                           # Basic Smoke Tests (P0)
│   │   ├── 01-authentication.spec.ts
│   │   ├── 02-company-creation.spec.ts
│   │   ├── 03-assessment-template.spec.ts
│   │   ├── 04-assessment-run.spec.ts
│   │   ├── 05-ai-okr-generation.spec.ts
│   │   ├── 06-goal-cascade.spec.ts
│   │   ├── 07-invitations.spec.ts
│   │   ├── 08-dashboards.spec.ts
│   │   └── 09-data-integrity.spec.ts
│   │
│   ├── journeys/                      # User Journey Tests (P1)
│   │   ├── new-business-onboarding.spec.ts
│   │   ├── assessment-to-okr.spec.ts
│   │   ├── objective-cascade.spec.ts
│   │   ├── daily-employee-workflow.spec.ts
│   │   ├── manager-planning.spec.ts
│   │   └── executive-reporting.spec.ts
│   │
│   ├── features/                      # Feature-Specific Tests
│   │   ├── auth/
│   │   │   ├── signup.spec.ts
│   │   │   ├── login.spec.ts
│   │   │   ├── password-reset.spec.ts
│   │   │   └── role-permissions.spec.ts
│   │   │
│   │   ├── assessments/
│   │   │   ├── template-creation.spec.ts
│   │   │   ├── distribution.spec.ts
│   │   │   ├── taking-assessment.spec.ts
│   │   │   ├── scoring.spec.ts
│   │   │   └── results-visibility.spec.ts
│   │   │
│   │   ├── objectives/
│   │   │   ├── crud-operations.spec.ts
│   │   │   ├── key-results.spec.ts
│   │   │   ├── date-configuration.spec.ts
│   │   │   └── progress-tracking.spec.ts
│   │   │
│   │   ├── goals/
│   │   │   ├── quarterly-goals.spec.ts
│   │   │   ├── weekly-goals.spec.ts
│   │   │   ├── goal-breakdown.spec.ts
│   │   │   └── assignment.spec.ts
│   │   │
│   │   ├── tasks/
│   │   │   ├── crud-operations.spec.ts
│   │   │   ├── subtasks.spec.ts
│   │   │   ├── status-updates.spec.ts
│   │   │   ├── progress-updates.spec.ts
│   │   │   └── cascade-verification.spec.ts
│   │   │
│   │   └── dashboards/
│   │       ├── employee-dashboard.spec.ts
│   │       ├── executive-dashboard.spec.ts
│   │       ├── manager-dashboard.spec.ts
│   │       └── planning-dashboard.spec.ts
│   │
│   └── edge-cases/                    # Edge Cases (P2)
│       ├── validation-errors.spec.ts
│       ├── permission-violations.spec.ts
│       ├── data-limits.spec.ts
│       ├── concurrent-updates.spec.ts
│       └── error-handling.spec.ts
│
├── utils/                             # Test utilities
│   ├── api-helpers.ts                 # API call helpers
│   ├── db-helpers.ts                  # Database utilities
│   ├── assertions.ts                  # Custom assertions
│   └── data-generators.ts             # Test data generators
│
└── test-results/                      # Generated test results
    ├── traces/
    ├── screenshots/
    └── videos/
```

## Test Categories

### BST (Basic Smoke Tests) - P0

**Purpose**: Verify critical paths work end-to-end
**Priority**: Must pass before any deployment
**Execution Time**: 30-45 minutes
**Test Count**: 50 tests

**Coverage**:
- ✅ Authentication (login, signup, logout, session)
- ✅ Company creation (business owner, consultant)
- ✅ Assessment template creation
- ✅ Assessment distribution and completion
- ✅ AI OKR generation and approval
- ✅ Objective → Goals → Tasks cascade
- ✅ Invitations and acceptance
- ✅ Dashboard data accuracy
- ✅ Data integrity verification

**Success Criteria**: 100% pass rate required

### User Journey Tests - P1

**Purpose**: Test complete workflows from start to finish
**Priority**: Critical for user experience
**Execution Time**: 2-3 hours
**Test Count**: 30 tests

**Coverage**:
- New business onboarding (signup → team → invites)
- Assessment to OKR (template → distribute → take → generate → approve → plan)
- Objective cascade (create → quarterly → weekly → tasks → execution)
- Daily employee workflow (login → dashboard → tasks → completion)
- Manager planning (team → goals → task assignment → monitoring)
- Executive reporting (dashboard → analytics → export)

**Success Criteria**: 95% pass rate minimum

### Edge Cases & Error Handling - P2

**Purpose**: Test boundary conditions and error scenarios
**Priority**: Important for robustness
**Execution Time**: 2-3 hours
**Test Count**: 40 tests

**Coverage**:
- Input validation (SQL injection, XSS, invalid data)
- Permission violations (unauthorized access)
- Data limits (max length, max count, large datasets)
- Concurrent updates (race conditions)
- Network failures (timeouts, retries)
- Database errors (connection loss, transaction failures)
- File uploads (size limits, invalid formats)

**Success Criteria**: 90% pass rate minimum

## Test Data Management

### Test Users

Pre-seeded users for testing (created in globalSetup):

| Role | Email | Password | Company |
|------|-------|----------|---------|
| Consultant | consultant@test.com | Test123! | Test Consulting |
| Business Owner | owner@test.com | Test123! | Test Company |
| Executive | executive@test.com | Test123! | Test Company |
| Manager | manager@test.com | Test123! | Test Company |
| Employee | employee@test.com | Test123! | Test Company |

### Test Companies

- **Test Consulting** - Consultant's firm
- **Test Company** - Primary test company (50 employees, SaaS industry)
- **Client Company 1** - Additional company for multi-tenant testing

### Test Data Reset

Before each test run, the database is reset with:
- 5 test users (one per role)
- 2 test companies
- 1 assessment template (SSI)
- Sample objectives, goals, tasks

## Best Practices

### Writing Tests

1. **Use Page Objects**: Create reusable page objects for common UI interactions
2. **Use Fixtures**: Leverage Playwright fixtures for authenticated sessions
3. **Avoid Hard Waits**: Use `waitFor` selectors instead of `setTimeout`
4. **Test Isolation**: Each test should be independent and reset state
5. **Descriptive Names**: Test names should describe the scenario clearly
6. **Assertions**: Use specific assertions (`toHaveText` vs `toBeTruthy`)

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Employee Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as employee
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('employee@test.com', 'Test123!');
  });

  test('should display today\'s tasks', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Verify dashboard loaded
    await expect(page).toHaveURL('/client/pages/dashboard.html');

    // Verify quick stats visible
    await expect(dashboardPage.quickStats).toBeVisible();

    // Verify tasks loaded
    const tasks = await dashboardPage.getTodaysTasks();
    expect(tasks.length).toBeGreaterThan(0);

    // Verify first task has required fields
    const firstTask = tasks[0];
    await expect(firstTask.name).toBeVisible();
    await expect(firstTask.dueDate).toBeVisible();
    await expect(firstTask.priority).toBeVisible();
  });

  test('should complete task and update stats', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Get initial completed count
    const initialCompleted = await dashboardPage.getCompletedToday();

    // Complete first task
    await dashboardPage.completeTask(0);

    // Verify task marked complete
    const tasks = await dashboardPage.getTodaysTasks();
    await expect(tasks[0].checkbox).toBeChecked();

    // Verify completed count increased
    const newCompleted = await dashboardPage.getCompletedToday();
    expect(newCompleted).toBe(initialCompleted + 1);
  });
});
```

## Debugging Failed Tests

### View Trace

```bash
# Trace is automatically captured on first retry
npx playwright show-trace test-results/traces/trace.zip
```

### Screenshots

Screenshots are taken on failure and saved to `test-results/screenshots/`

### Videos

Videos are recorded for failed tests and saved to `test-results/videos/`

### Debug Mode

```bash
# Run with inspector (step through test)
npx playwright test --debug

# Run specific test with inspector
npx playwright test tests/bst/01-authentication.spec.ts --debug
```

### Headed Mode

```bash
# See browser during test execution
npx playwright test --headed

# Slow down execution
npx playwright test --headed --slow-mo=1000
```

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Pull requests to `main` branch
- Commits to `main` branch
- Nightly at 2 AM UTC

### Test Reports

HTML reports are generated and uploaded as artifacts for every CI run.

## Performance Testing

### Load Testing

For load testing, use `k6` or Apache JMeter:

```bash
# Example: 100 virtual users, 5 minute duration
k6 run --vus 100 --duration 5m tests/performance/load-test.js
```

### Performance Benchmarks

Target response times:
- Page load: < 2 seconds
- API calls: < 500ms
- Dashboard refresh: < 1 second
- Task completion: < 200ms

## Accessibility Testing

Playwright includes `axe-core` for accessibility testing:

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have any automatically detectable accessibility issues', async ({ page }) => {
  await page.goto('/client/pages/dashboard.html');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Test Coverage

Target coverage metrics:
- **BST Coverage**: 100% of critical paths
- **User Journey Coverage**: 95% of documented workflows
- **API Endpoint Coverage**: 90% of endpoints
- **UI Page Coverage**: 85% of pages
- **Role Permission Coverage**: 100% of role-based access rules

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Target closed" error
**Solution**: Increase timeout in `playwright.config.ts`

**Issue**: Database state inconsistent between tests
**Solution**: Ensure `globalSetup` resets database properly

**Issue**: Flaky tests due to timing
**Solution**: Replace `page.waitForTimeout()` with `page.waitForSelector()`

**Issue**: Authentication fails
**Solution**: Check JWT token expiry, verify auth.setup.ts generates valid tokens

## Contributing

### Adding New Tests

1. Identify test category (BST, Journey, Edge Case)
2. Create test file in appropriate directory
3. Follow naming convention: `feature-name.spec.ts`
4. Add test documentation to relevant TEST_CASES_*.md file
5. Ensure test is isolated and resets state
6. Run test locally before committing
7. Update this README if adding new test category

### Code Review Checklist

- [ ] Test has descriptive name
- [ ] Test is isolated and doesn't depend on other tests
- [ ] Test uses page objects where appropriate
- [ ] Test has proper assertions (not just checking visibility)
- [ ] Test resets database state if needed
- [ ] Test documentation added to TEST_CASES_*.md
- [ ] Test passes locally on all browsers
- [ ] No hard-coded waits (`waitForTimeout`)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Generator](https://playwright.dev/docs/codegen)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)

## Support

For questions or issues:
- Slack: #qa-testing
- Email: qa@karvia.io
- Create issue in GitHub repository

---

**Last Updated**: November 23, 2025
**Version**: 1.0
**Maintained By**: QA Team
