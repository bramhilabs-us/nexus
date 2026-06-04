# Karvia Business - Comprehensive Test Plan

## Document Information

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Created** | November 23, 2025 |
| **Last Updated** | November 23, 2025 |
| **Author** | QA Team |
| **Status** | Active |
| **Review Cycle** | Quarterly |

---

## 1. Executive Summary

This test plan defines the comprehensive testing strategy for the Karvia Business OKR platform. The plan covers End-to-End (E2E) testing using Playwright, organized into three priority tiers to ensure platform reliability, user experience, and data integrity.

### Key Objectives

1. **Ensure Critical Paths Work**: Verify all P0 critical user flows function correctly
2. **Validate User Journeys**: Test complete workflows from start to finish
3. **Maintain Data Integrity**: Verify cascade updates and calculations are accurate
4. **Enforce Security**: Test role-based access control across all features
5. **Prevent Regressions**: Catch breaking changes before deployment

### Success Criteria

- ✅ 100% pass rate on BST (Basic Smoke Tests)
- ✅ 95%+ pass rate on User Journey tests
- ✅ 90%+ pass rate on Edge Case tests
- ✅ Zero P0 bugs in production
- ✅ < 5% test flakiness rate

---

## 2. Scope

### In Scope

**Features Covered**:
- Authentication & Authorization (6 roles)
- Company Management (multi-tenant)
- Assessment System (SSI Framework, 146 questions)
- AI OKR Generation (GPT-4 integration)
- Objective Management (flexible dates, fiscal year support)
- Goal Management (quarterly, weekly hierarchy)
- Task Management (subtasks, progress tracking)
- Dashboards (employee, manager, executive)
- Invitations & Team Management
- Analytics & Reporting
- Data Cascade System

**Browsers**:
- ✅ Chrome/Chromium (primary)
- ✅ Firefox
- ✅ Safari/WebKit
- ⚠️ Mobile browsers (limited)

**Environments**:
- Development (localhost:8080)
- Staging (staging.karvia.io)
- Production (app.karvia.io) - smoke tests only

### Out of Scope

**Not Covered**:
- ❌ Email delivery testing (use Mailjet sandbox)
- ❌ Payment processing (not implemented)
- ❌ Third-party integrations (Slack, MS Teams - future)
- ❌ Performance load testing (separate tool: k6)
- ❌ Security penetration testing (separate engagement)
- ❌ Accessibility audits (WCAG 2.1 AA - future)

---

## 3. Test Strategy

### 3.1 Test Pyramid

```
           /\
          /  \  Unit Tests (80% coverage via Jest)
         /----\
        /      \  Integration Tests (API tests via Supertest)
       /--------\
      /          \  E2E Tests (Playwright - this plan)
     /----- ------\
```

**E2E Test Distribution**:
- BST (Basic Smoke Tests): 35% of E2E tests
- User Journeys: 40% of E2E tests
- Edge Cases: 25% of E2E tests

### 3.2 Test Execution Strategy

#### Continuous Integration (CI)

**Trigger**: Every pull request to `main`

**Execution**:
1. Run BST suite (30-45 min)
2. If BST passes, run User Journey tests (2-3 hours)
3. If User Journeys pass, run Edge Cases (2-3 hours)
4. Generate HTML report
5. Notify team of results

**Failure Handling**:
- BST failure → Block PR merge
- User Journey failure → Warning, review required
- Edge Case failure → Note in report, don't block

#### Nightly Regression

**Trigger**: Daily at 2 AM UTC

**Execution**:
1. Reset staging database
2. Run full test suite (all 120+ tests)
3. Generate comprehensive report
4. Email report to QA team
5. Create Jira tickets for failures

#### Pre-Release

**Trigger**: Before production deployment

**Execution**:
1. Run full test suite on staging
2. Run BST on production (read-only tests)
3. Manual exploratory testing (2 hours)
4. Sign-off from QA Lead
5. Deploy to production

### 3.3 Test Data Management

#### Test Users (Pre-Seeded)

| Role | Email | Password | Company | Purpose |
|------|-------|----------|---------|---------|
| Consultant | consultant@test.com | Test123! | Test Consulting | Multi-tenant testing |
| Business Owner | owner@test.com | Test123! | Test Company | Company admin testing |
| Executive | executive@test.com | Test123! | Test Company | OKR creation, approval |
| Manager | manager@test.com | Test123! | Test Company | Team management, planning |
| Employee | employee@test.com | Test123! | Test Company | Task execution, dashboard |

#### Test Data Reset

**Before Each Test Run**:
1. Drop `karvia_business_test` database
2. Create fresh database
3. Seed with test users (5 users, 2 companies)
4. Seed with assessment questions (146 questions)
5. Seed with sample template (SSI template)
6. Run migrations to latest version

**Isolation Strategy**:
- Each test file runs in isolated context
- Database transactions for API tests
- Browser context isolation for UI tests
- No shared state between tests

### 3.4 Test Environment

**Development Environment**:
- Base URL: `http://localhost:8080`
- Database: `mongodb://localhost:27017/karvia_business_test`
- Redis: `redis://localhost:6379/1` (test DB)
- OpenAI: Mocked responses (save costs)

**Staging Environment**:
- Base URL: `https://staging.karvia.io`
- Database: Staging MongoDB Atlas
- Redis: Staging Redis Cloud
- OpenAI: Live API (limited quota)

**Production Environment** (Smoke Tests Only):
- Base URL: `https://app.karvia.io`
- Database: Production MongoDB Atlas
- Tests: Read-only operations only
- Frequency: After deployment, before traffic

---

## 4. Test Categories

### 4.1 BST (Basic Smoke Tests) - P0

**Priority**: Must pass (blocking)
**Execution Time**: 30-45 minutes
**Test Count**: 50 tests
**Pass Rate Required**: 100%

#### Test Suites

**1. Authentication (10 tests)**
- Valid login (all roles)
- Invalid login (wrong password, non-existent user)
- Session persistence (JWT token)
- Token refresh
- Logout
- Signup flow (business owner)
- Consultant signup
- Password validation
- Email validation
- Session timeout

**2. Company Creation (5 tests)**
- Business owner creates company
- Consultant creates company for client
- Company validation (name, industry, employee count)
- Multi-tenant isolation
- Company switching (consultant)

**3. Assessment Template Creation (7 tests)**
- Consultant creates template
- Template validation (name, description, dimensions)
- Question selection (from 146-question bank)
- Dimension weight configuration (Speed: 35%, Strength: 35%, Intelligence: 30%)
- Threshold setting (weak area: 40)
- Template save
- Template send to executive

**4. Assessment Run & Scoring (10 tests)**
- Executive receives template
- Executive creates team
- Executive sends invitations
- Employee accepts invitation
- Employee takes assessment (146 questions)
- Progress saving
- Assessment submission
- SSI score calculation (speed, strength, intelligence, composite)
- Weak area detection (scores < 40)
- Results visibility (role-based)

**5. AI OKR Generation (8 tests)**
- Generate OKRs from assessment
- AI analyzes weak areas
- GPT-4 generates 3-5 objectives
- Each objective has 2-4 Key Results
- Objectives target weak dimensions
- Review page loads suggestions
- Edit suggestion
- Approve and create objectives

**6. Goal & Task Cascade (10 tests)**
- Create objective with 4 Key Results
- Create quarterly goal for Q1
- Create weekly goal for Week 1
- Create task for weekly goal
- Assign task to employee
- Complete task
- Verify task completion cascades to weekly goal
- Verify weekly goal updates quarterly goal
- Verify quarterly goal updates Key Result
- Verify Key Result updates objective progress

**7. Invitations & Acceptance (5 tests)**
- Send user invitation
- Validate invitation token
- Accept invitation
- Create account from invitation
- Invitation expiry

**8. Dashboard Rollups (8 tests)**
- Employee dashboard loads
- Employee sees assigned tasks
- Quick stats accurate (tasks today, overdue, completed)
- Manager dashboard shows team data
- Executive dashboard shows company OKRs
- Progress calculations accurate
- Cascade updates reflected in dashboards
- Real-time updates

**9. Data Integrity Audit (5 tests)**
- Verify all relationships intact (user → company, objective → goal → task)
- Verify progress calculations (task → goal → objective)
- Verify date cascades (objective dates → goal dates → task dates)
- Verify SSI score calculations
- Verify weak area detection logic

### 4.2 User Journey Tests - P1

**Priority**: Critical (warning if fail)
**Execution Time**: 2-3 hours
**Test Count**: 30 tests
**Pass Rate Required**: 95%

#### Journey 1: New Business Onboarding (5 tests)

**Scenario**: New business owner signs up and sets up company

1. Signup with company creation
2. Email verification
3. Create first team
4. Invite team members (3 invitations)
5. Team members accept and create accounts

**Expected Result**: 1 business owner + 3 team members in company

#### Journey 2: Assessment to OKR (10 tests)

**Scenario**: Complete assessment and generate actionable OKRs

1. Consultant creates SSI assessment template
2. Consultant sends template to Executive
3. Executive receives template in library
4. Executive creates team (Sales, 5 members)
5. Executive sends assessment invitations (5)
6. Employee accepts invitation
7. Employee takes 146-question assessment (45 minutes)
8. System calculates SSI scores (weak area: Speed = 35)
9. Executive clicks "Generate OKRs"
10. AI generates 3 objectives targeting Speed dimension
11. Executive reviews and approves objectives
12. Objectives created with status='active'

**Expected Result**: 3 objectives created, each with 2-4 Key Results

#### Journey 3: Objective Cascade (8 tests)

**Scenario**: Break down annual objective into executable tasks

1. Create objective for 2025 (calendar year)
2. Add 4 Key Results (one per quarter)
3. Create Q1 quarterly goal from KR #1
4. Create Week 1 weekly goal from Q1 goal
5. Create 5 tasks for Week 1 goal
6. Assign tasks to employees
7. Employee completes 3 tasks
8. Verify progress cascades: Task → Weekly → Quarterly → KR → Objective

**Expected Result**: Objective progress = 60% * (1 week / 13 weeks) * (1 quarter / 4 quarters) = 1.15%

#### Journey 4: Daily Employee Workflow (7 tests)

**Scenario**: Employee logs in and completes daily tasks

1. Employee logs in
2. Dashboard loads with today's tasks (8 tasks)
3. Quick stats show: 8 today, 2 overdue, 0 completed
4. Employee completes Task #1
5. Quick stats update: 8 today, 2 overdue, 1 completed
6. Employee updates Task #2 progress to 50%
7. Employee marks Task #3 as blocked
8. Employee adds comment to Task #4
9. Employee views Why Chain for Task #1
10. End of day: 5 of 8 tasks completed

**Expected Result**: Dashboard reflects accurate completion status

#### Journey 5: Manager Planning (5 tests)

**Scenario**: Manager creates goals and assigns tasks to team

1. Manager views team dashboard
2. Manager selects objective and KR
3. Manager creates Q1 quarterly goal
4. Manager breaks down Q1 into 10 weekly goals
5. Manager creates 20 tasks for Week 1-2
6. Manager assigns tasks to 5 team members (4 tasks each)
7. Manager monitors team progress
8. Manager views team capacity

**Expected Result**: 10 weekly goals, 20 tasks, 5 team members assigned

#### Journey 6: Executive Reporting (3 tests)

**Scenario**: Executive views analytics and exports report

1. Executive logs into executive dashboard
2. Dashboard shows 10 active objectives, 40 goals, 200 tasks
3. Executive views progress trends (last 30 days)
4. Executive identifies at-risk objective (progress 20%, time 50%)
5. Executive exports PDF report
6. Report includes all OKR data, SSI scores, team breakdown

**Expected Result**: Accurate report with all data

### 4.3 Edge Cases & Error Handling - P2

**Priority**: Important (non-blocking)
**Execution Time**: 2-3 hours
**Test Count**: 40 tests
**Pass Rate Required**: 90%

#### Validation Errors (10 tests)

- SQL injection attempts (email, password, search)
- XSS attempts (objective title, task description)
- Missing required fields (objective without title)
- Invalid email formats
- Password too weak (<8 chars, no special char)
- Invalid dates (end_date < start_date)
- Invalid numeric values (progress > 100%)
- Duplicate email registration
- Duplicate company name
- Invalid role assignment

#### Permission Violations (10 tests)

- Employee accesses executive dashboard (403)
- Employee creates objective (403)
- Manager views other team's data (403)
- Consultant modifies client data without permission (403)
- User accesses other company's data (403)
- Expired JWT token (401)
- Missing JWT token (401)
- Tampered JWT token (401)
- User updates other user's password (403)
- User deletes company without permission (403)

#### Data Limits (5 tests)

- Max title length (255 chars)
- Max description length (2000 chars)
- Max objectives per company (100)
- Max goals per objective (52 weeks * 4 quarters = 208)
- Max tasks per goal (500)
- Max file upload size (10 MB)
- Large dataset pagination (1000+ tasks)

#### Concurrent Updates (5 tests)

- Two users update same objective progress simultaneously
- Two users complete same task simultaneously
- Two users assign same task simultaneously
- Race condition: Create goal while deleting objective
- Optimistic locking: Update task with stale version

#### Error Handling (10 tests)

- Database connection lost during transaction
- OpenAI API timeout (30s)
- OpenAI API rate limit (retry with backoff)
- Mailjet email send failure
- Network timeout (slow connection)
- 404 Not Found (deleted resource)
- 500 Internal Server Error
- Database transaction rollback
- File upload failure (corrupted file)
- Session timeout during long operation

---

## 5. Test Execution

### 5.1 Test Execution Schedule

| Phase | Trigger | Tests Run | Duration | Frequency |
|-------|---------|-----------|----------|-----------|
| **Pre-Commit** | Developer runs locally | BST | 30 min | As needed |
| **Pull Request** | GitHub PR opened | BST + Journeys | 3 hours | Per PR |
| **Nightly Regression** | Cron (2 AM UTC) | All tests | 6 hours | Daily |
| **Pre-Release** | Manual trigger | All tests + Manual | 8 hours | Per release |
| **Post-Deploy** | After production deploy | BST (read-only) | 30 min | Per deploy |

### 5.2 Test Execution Process

#### Step 1: Environment Preparation
1. Start MongoDB test instance
2. Start Redis test instance
3. Start Karvia Business server (port 8080)
4. Verify server health (`GET /health`)
5. Reset database with test data

#### Step 2: Test Execution
1. Run Playwright tests with `npm run test:e2e`
2. Capture screenshots on failure
3. Capture video on failure
4. Generate trace on first retry
5. Collect test results

#### Step 3: Result Analysis
1. Parse test results (JSON reporter)
2. Identify failed tests
3. Categorize failures (P0, P1, P2)
4. Generate HTML report
5. Upload artifacts (screenshots, videos, traces)

#### Step 4: Notification
1. Send Slack notification to #qa-testing
2. If P0 failures → Notify #engineering-alerts
3. If >10% failures → Escalate to QA Lead
4. Create Jira tickets for failures
5. Update test status dashboard

### 5.3 Test Result Reporting

#### HTML Report

Generated via Playwright HTML Reporter:

```bash
npx playwright show-report
```

**Includes**:
- Test summary (passed, failed, skipped)
- Execution duration
- Browser breakdown
- Failed test details
- Screenshots and videos
- Trace viewer links

#### Slack Notification

Sent to #qa-testing channel:

```
🤖 Playwright Test Results - PR #123

✅ Passed: 115 / 120 tests (95.8%)
❌ Failed: 5 / 120 tests (4.2%)

Priority Breakdown:
  P0 (BST): ✅ 50 / 50 (100%)
  P1 (Journeys): ✅ 28 / 30 (93.3%)
  P2 (Edge Cases): ✅ 37 / 40 (92.5%)

Failed Tests:
  ⚠️ [P1] Journey: Manager Planning - Step 8 timeout
  ⚠️ [P2] Edge Case: Concurrent task update race condition

View Report: https://playwright-report.karvia.io/pr-123
View Traces: https://traces.karvia.io/pr-123
```

#### Jira Ticket Creation

For each P0 or P1 failure:

```
Title: [TEST FAILURE] Journey: Manager Planning - Step 8 timeout
Priority: High
Labels: test-failure, playwright, p1

Description:
Test: journeys/manager-planning.spec.ts
Step: Manager views team capacity
Error: Timeout waiting for .capacity-widget (30000ms exceeded)

Screenshot: [attached]
Video: [attached]
Trace: https://traces.karvia.io/pr-123/trace-abc123.zip

Reproduction Steps:
1. Login as manager@test.com
2. Navigate to manager dashboard
3. Click "Team" tab
4. Observe: Capacity widget does not load

Expected: Capacity widget displays team member capacity
Actual: Widget never appears, timeout after 30s

Environment: Staging (https://staging.karvia.io)
Browser: Chromium 120.0.6099.109
Test Run: PR #123
```

---

## 6. Defect Management

### 6.1 Defect Priority

| Priority | Definition | SLA | Examples |
|----------|------------|-----|----------|
| **P0 - Blocker** | Blocks critical functionality | Fix immediately | Login broken, cannot create objectives, data corruption |
| **P1 - Critical** | Major functionality broken | Fix within 24h | Dashboard not loading, cascade not working, email not sending |
| **P2 - Major** | Feature impaired but workaround exists | Fix within 1 week | Export slow, UI glitch, minor calculation error |
| **P3 - Minor** | Cosmetic issue, minor inconvenience | Fix when convenient | Typo, styling issue, tooltip missing |

### 6.2 Defect Workflow

```
New → Assigned → In Progress → Code Review → Testing → Closed
                                                    ↓
                                                Reopened (if test fails)
```

**Workflow Steps**:
1. **New**: QA creates Jira ticket with test failure details
2. **Assigned**: Engineering Lead assigns to developer
3. **In Progress**: Developer investigates and fixes
4. **Code Review**: PR created and reviewed
5. **Testing**: QA re-runs test to verify fix
6. **Closed**: Test passes, defect closed
7. **Reopened**: Test still fails, defect reopened

### 6.3 Root Cause Analysis

For P0 and P1 defects, perform root cause analysis:

**5 Whys Technique**:
1. Why did the test fail? → Dashboard widget didn't load
2. Why didn't it load? → API call returned 500 error
3. Why 500 error? → Database query timed out
4. Why timeout? → Missing database index on company_id
5. Why missing index? → Index not in migration script

**Action Items**:
- Add index to migration script
- Update deployment checklist
- Add test to verify index exists

---

## 7. Test Maintenance

### 7.1 Test Review Cycle

**Quarterly Review** (every 3 months):
1. Review test results from past quarter
2. Identify flaky tests (>5% failure rate)
3. Identify slow tests (>2 min execution)
4. Update test data as application evolves
5. Remove obsolete tests
6. Add tests for new features
7. Refactor common patterns into fixtures

### 7.2 Test Flakiness

**Definition**: Test that sometimes passes, sometimes fails without code changes

**Causes**:
- Race conditions
- Hard-coded waits
- Non-deterministic data
- Network issues
- Database state conflicts

**Mitigation**:
1. **Identify**: Track failure rate per test
2. **Analyze**: Review failed test traces
3. **Fix**: Replace `waitForTimeout` with `waitForSelector`
4. **Verify**: Run test 10 times to confirm stability
5. **Document**: Add comment explaining fix

**Flaky Test Threshold**: Max 5% failure rate

### 7.3 Test Performance

**Slow Test Threshold**: Max 2 minutes per test

**Optimization Strategies**:
1. **Parallel Execution**: Run tests in parallel (Playwright supports this)
2. **Database Snapshots**: Create database snapshot, restore instead of re-seeding
3. **Mock External APIs**: Mock OpenAI, Mailjet to avoid network calls
4. **Skip Unnecessary Waits**: Use Playwright's auto-waiting
5. **Optimize Selectors**: Use data-testid attributes instead of complex selectors

---

## 8. Tools & Technologies

### 8.1 Primary Tools

| Tool | Purpose | Version |
|------|---------|---------|
| **Playwright** | E2E testing framework | 1.40.0+ |
| **TypeScript** | Test code language | 5.0+ |
| **Jest** | Unit testing (not E2E) | 29.0+ |
| **MongoDB** | Test database | 7.0+ |
| **Docker** | Test environment isolation | 24.0+ |

### 8.2 Playwright Configuration

**Key Settings** (`playwright.config.ts`):
- Base URL: `http://localhost:8080`
- Timeout: 30 seconds per test
- Retries: 2 (on CI), 0 (locally)
- Workers: Parallel execution (number of CPU cores)
- Reporter: HTML + JSON
- Screenshot: On failure only
- Video: On failure only
- Trace: On first retry

### 8.3 Test Data Tools

**Database Seeding**:
- Tool: Mongoose (Node.js ODM)
- Seed Script: `setup/globalSetup.ts`
- Data: JSON files in `setup/data/`

**Test Data Generators**:
- Faker.js: Generate realistic fake data
- Custom generators: `utils/data-generators.ts`

### 8.4 CI/CD Integration

**GitHub Actions Workflow**:

```yaml
name: Playwright Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Start MongoDB
        run: docker run -d -p 27017:27017 mongo:7.0
      - name: Start server
        run: npm run dev &
      - name: Wait for server
        run: npx wait-on http://localhost:8080
      - name: Run tests
        run: npm run test:e2e
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 9. Success Metrics

### 9.1 Test Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **BST Pass Rate** | 100% | (BST passed / BST total) * 100 |
| **Journey Pass Rate** | 95% | (Journeys passed / Journeys total) * 100 |
| **Edge Case Pass Rate** | 90% | (Edge passed / Edge total) * 100 |
| **Test Flakiness** | < 5% | (Flaky tests / Total tests) * 100 |
| **Test Execution Time** | < 6 hours | Sum of all test durations |
| **Code Coverage** | 85% | Lines covered by E2E tests |

### 9.2 Defect Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Defect Escape Rate** | < 5% | (Prod bugs / Total bugs) * 100 |
| **P0 Resolution Time** | < 4 hours | Time from discovery to fix deployed |
| **P1 Resolution Time** | < 24 hours | Time from discovery to fix deployed |
| **P2 Resolution Time** | < 1 week | Time from discovery to fix deployed |
| **Defect Reopen Rate** | < 10% | (Reopened defects / Total defects) * 100 |

### 9.3 Release Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Pre-Release Test Pass Rate** | 100% BST + 95% Journeys | All critical tests pass before deploy |
| **Post-Deploy Incidents** | < 1 per month | Production incidents within 24h of deploy |
| **Rollback Rate** | < 5% | (Rollbacks / Total deploys) * 100 |
| **Mean Time to Detect (MTTD)** | < 30 min | Time from bug introduction to detection |
| **Mean Time to Repair (MTTR)** | < 2 hours | Time from detection to fix deployed |

---

## 10. Risks & Mitigation

### 10.1 Test Execution Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Flaky Tests** | High | Medium | Strict auto-wait, avoid timeouts, retry mechanism |
| **Slow Test Execution** | Medium | High | Parallel execution, mock external APIs |
| **Test Data Corruption** | High | Low | Database reset before each run, transaction isolation |
| **Environment Instability** | High | Low | Docker containers, infrastructure as code |
| **Test Framework Changes** | Medium | Low | Pin Playwright version, gradual upgrades |

### 10.2 Application Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Breaking API Changes** | High | Medium | Contract testing, API versioning |
| **Database Schema Changes** | High | Low | Migration testing, rollback procedures |
| **Third-Party API Failures** | Medium | Medium | Mock external APIs in tests, circuit breakers |
| **Authentication Issues** | High | Low | Test token generation, expiry handling |
| **Data Cascade Bugs** | High | Medium | Extensive cascade tests, integrity checks |

### 10.3 Resource Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **QA Team Availability** | High | Medium | Cross-training, test automation |
| **CI/CD Infrastructure Costs** | Medium | Low | Optimize test execution, use free tier |
| **Test Maintenance Burden** | Medium | High | Regular refactoring, page object pattern |
| **Knowledge Loss** | High | Low | Comprehensive documentation, pair testing |

---

## 11. Appendix

### 11.1 Glossary

| Term | Definition |
|------|------------|
| **BST** | Basic Smoke Tests - Critical path tests that must pass |
| **OKR** | Objectives and Key Results - Goal-setting framework |
| **SSI** | Strategic Success Index - Composite score from assessment (Speed, Strength, Intelligence) |
| **Cascade** | Automatic update propagation (Task → Goal → Objective) |
| **KR** | Key Result - Measurable metric under an Objective |
| **P0** | Priority 0 - Blocker bug that prevents critical functionality |
| **Flaky Test** | Test that intermittently passes/fails without code changes |
| **E2E** | End-to-End testing - Testing complete user workflows |

### 11.2 References

- **Application Docs**: `/KARVIA_STRATEGY/1-PRODUCT/`
- **API Docs**: `/server/routes/` (inline JSDoc)
- **User Stories**: `/KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/`
- **Playwright Docs**: https://playwright.dev
- **Testing Best Practices**: https://martinfowler.com/testing/

### 11.3 Contact Information

| Role | Name | Email | Slack |
|------|------|-------|-------|
| **QA Lead** | TBD | qa-lead@karvia.io | @qa-lead |
| **Test Automation Engineer** | TBD | qa-automation@karvia.io | @qa-automation |
| **Engineering Lead** | TBD | eng-lead@karvia.io | @eng-lead |
| **Product Manager** | TBD | pm@karvia.io | @product |

### 11.4 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-23 | Initial test plan created | Claude (QA Team) |

---

**Document Status**: ✅ Approved for Implementation
**Next Review**: February 23, 2026 (3 months)
**Maintained By**: QA Team
