# /testing - QA Validation Session

<!-- @GENOME T2-CMD-007 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/testing | linked:- -->

**Aliases**: None
**Version**: 2.0.0
**Last Updated**: March 30, 2026
**Session Type**: TESTING
**Token Budget**: ~1,200 AUTO
**Purpose**: Feature validation, bug detection, user journey testing

---

## Stakeholders

| Role | Expertise | Brings |
|------|-----------|--------|
| QA Engineer | Test methodology | Test plans, edge cases |
| Edge Case Specialist | Boundary testing | Error scenarios |
| User Advocate | Acceptance testing | User perspective |

---

## Document Context

### AUTO (Read at session start) - ~1,200 tokens

| Doc | ID | Tokens | Sections |
|-----|-----|--------|----------|
| Test plan | T3-TST-xxx | ~500 | Current sprint test cases |
| User stories | T3-SPR-xxx | ~400 | Acceptance criteria |
| Current sprint handoff | T3-SPR-xxx | ~300 | What was implemented |

### LINKED (Reference path, read if needed)

| Doc | ID | Path |
|-----|-----|------|
| SESSION_LOG.md | T0-SES-001 | .claude/ |
| Test case library | - | KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/ |
| Edge case catalog | - | Same location |
| Playwright tests | - | tests/e2e/ |

### AVAILABLE (Exists, request on demand)

- Previous test reports
- Bug database
- Performance benchmarks
- Sprint master plan

---

## Testing Scope

**What are you testing?**

- [ ] **BST (Business Scenario Testing)** - Core business workflows
- [ ] **User Journey Testing** - End-to-end user flows
- [ ] **Edge Case Testing** - Boundary conditions and error scenarios
- [ ] **Integration Testing** - API and service integration
- [ ] **Regression Testing** - Verify existing functionality still works
- [ ] **Manual Feature Testing** - Specific feature validation

**Test Type**: [Select from above]

**Features/Areas Under Test**:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

**User Stories to Validate**:
- [User Story 1] - [Acceptance criteria reference]
- [User Story 2] - [Acceptance criteria reference]

---

## Test Execution Framework

### Test Case Format

For each test case, document:

```markdown
### Test Case [N]: [Descriptive Name]

**User Story**: [Reference]
**Acceptance Criteria**: [Specific criteria being tested]
**Test Type**: [BST/Journey/Edge/Integration]
**Priority**: [Critical/High/Medium/Low]

**Prerequisites**:
- [Setup requirement 1]
- [Setup requirement 2]

**Test Steps**:
1. [Action 1]
2. [Action 2]
3. [Action 3]

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Status**: ✅ PASS / ❌ FAIL / ⏭️ SKIPPED

**Notes**:
[Any observations, edge cases discovered, etc.]

**Evidence** (if applicable):
- Screenshot: [path/url]
- Error log: [paste]
- Network request: [details]
```

---

## Test Categories

### 1. Business Scenario Tests (BST)

**Core business workflows to validate**:

```
Multi-Tenant Isolation:
□ User from Company A cannot see Company B data
□ All API calls properly filter by company_id
□ Cross-tenant operations blocked

Role-Based Access Control:
□ CONSULTANT has full access
□ BUSINESS_OWNER can manage company
□ EXECUTIVE can create objectives
□ MANAGER can assign goals
□ EMPLOYEE sees only own tasks
□ Unauthorized access blocked (403 error)

OKR Generation (Epic 2):
□ First generation works
□ Second attempt shows "Already Generated" message
□ Generation date displays correctly
□ Generation count increments
□ Link to manual creation works
□ Admin can regenerate (if implemented)

Date Management:
□ Calendar year objectives work (Jan-Dec)
□ Fiscal year objectives work (April/July/October start)
□ Custom period objectives work (6-36 months)
□ Quarter calculations correct
□ Date cascade works (parent changes update children)

Goal Cascade:
□ Objective → Key Results works
□ Key Results → Quarterly Goals works
□ Quarterly Goals → Weekly Goals works
□ Progress rolls up correctly
```

### 2. User Journey Tests

**End-to-end user flows**:

```
Journey 1: New Company Onboarding
1. Register new company
2. Complete assessment
3. Generate AI OKRs
4. Review generated objectives
5. Accept/modify objectives
6. Assign team members
Expected: Smooth flow, no errors

Journey 2: Creating Manual Objective
1. Navigate to objectives page
2. Click "Create Objective"
3. Fill in objective details
4. Select period type (calendar/fiscal/custom)
5. Add key results
6. Save objective
Expected: Objective created, redirects to detail view

Journey 3: Weekly Goal Management
1. Navigate to weekly goals view
2. Select current week
3. Create new weekly goal
4. Link to quarterly goal
5. Assign to team member
6. Update progress
Expected: Goal visible in calendar, progress updates

Journey 4: Employee Dashboard View
1. Login as employee
2. View assigned goals
3. See only own company data
4. Cannot access admin features
Expected: Proper data isolation, correct permissions
```

### 3. Edge Case Tests

**Boundary conditions and error scenarios**:

```
Input Validation:
□ Empty required fields rejected
□ Invalid email format rejected
□ XSS attempts blocked (e.g., <script>alert('xss')</script>)
□ SQL injection attempts blocked
□ Very long strings handled (>1000 chars)
□ Special characters handled correctly

Date Boundaries:
□ Leap year dates work (Feb 29)
□ Year transitions work (Dec 31 → Jan 1)
□ Quarter boundaries correct
□ Invalid dates rejected (Feb 30)

Concurrent Operations:
□ Multiple users editing same goal
□ Rapid progress updates
□ Simultaneous OKR generation attempts (should fail)

Error Scenarios:
□ Network failure handled gracefully
□ Database connection lost
□ Invalid API responses
□ Authentication token expired (redirects to login)
□ Unauthorized access (403 error with message)

Resource Limits:
□ Maximum objectives per company
□ Maximum key results per objective
□ Maximum team members
□ File upload size limits
```

### 4. Integration Tests

**API and system integration**:

```
API Endpoints:
□ GET /api/goals/quarterly/:keyResultId - Returns correct data
□ POST /api/goals/quarterly - Creates goal successfully
□ PUT /api/goals/quarterly/:id - Updates goal
□ DELETE /api/goals/quarterly/:id - Soft deletes (status='cancelled')
□ Proper status codes (200, 201, 400, 404, 500)
□ Error responses formatted correctly

Database Operations:
□ Data persists correctly
□ Relationships maintained (populate works)
□ Indexes used (check query performance)
□ Transactions work (if applicable)

External Services (if applicable):
□ OpenAI integration works
□ Email notifications sent (if enabled)
□ Redis caching works (if enabled)
```

---

## Bug Documentation Format

**For every bug found**:

```markdown
## Bug [N]: [Brief Title]

**Severity**: [Critical/High/Medium/Low]
**Found During**: [Test case reference]
**Affects**: [Feature/Epic name]

**Steps to Reproduce**:
1. [Exact step 1]
2. [Exact step 2]
3. [Exact step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Environment**:
- Browser: [Browser/version]
- OS: [OS/version]
- User Role: [Role]
- Company: [Test company]

**Evidence**:
- Screenshot: [Include if visual bug]
- Console Error: [Paste exact error]
- Network Request: [Paste request/response if API issue]
- File/Line: [Source location if known]

**Impact**:
[How this affects users]

**Suggested Fix** (if known):
[What might fix it]

**Workaround** (if exists):
[Temporary way to avoid the bug]
```

---

## Test Execution Process

### Pre-Testing Setup

```
Environment:
□ Development database seeded with test data
□ Test users created for each role
□ Test companies created
□ Browser developer tools open
□ Network tab recording

Test Data:
□ Company 1: "Test Company A" (for positive tests)
□ Company 2: "Test Company B" (for isolation tests)
□ Users: consultant@test.com, owner@test.com, exec@test.com, manager@test.com, employee@test.com
□ Test objectives and goals pre-created
```

### During Testing

```
For each test case:
1. □ Review test case details
2. □ Ensure prerequisites met
3. □ Execute test steps exactly
4. □ Observe actual results
5. □ Compare to expected results
6. □ Mark PASS/FAIL/SKIPPED
7. □ Document bugs if FAIL
8. □ Take screenshots if needed
9. □ Note any unexpected observations
```

### Post-Testing

```
1. □ Summarize test results
2. □ Create bug tickets for failures
3. □ Rate severity of all bugs
4. □ Update test documentation
5. □ Create test execution report
```

---

## Test Execution Report

Create in current sprint folder: `SPRINT[X]_TEST_REPORT_[DATE].md`

**Report Structure**:

```markdown
# Sprint [X] Test Execution Report - [Date]
**Tester**: Claude Code
**Test Type**: [BST/Journey/Edge/Integration]
**Environment**: [Local/Dev/Staging]

## Test Summary

- **Total Test Cases**: [N]
- **Passed**: [N] ([X%])
- **Failed**: [N] ([X%])
- **Skipped**: [N]
- **Blocked**: [N]

## Test Results by Category

| Category | Total | Passed | Failed | Pass Rate |
|----------|-------|--------|--------|-----------|
| BST | [N] | [N] | [N] | [X%] |
| User Journeys | [N] | [N] | [N] | [X%] |
| Edge Cases | [N] | [N] | [N] | [X%] |
| Integration | [N] | [N] | [N] | [X%] |

## Bugs Found

### Critical (BLOCK DEPLOYMENT)
[List critical bugs]

### High Priority
[List high priority bugs]

### Medium Priority
[List medium priority bugs]

### Low Priority
[List low priority bugs]

## Test Cases Executed

[Include all test cases with results]

## Coverage Analysis

**Features Tested**:
- ✅ [Feature 1] - 100% coverage
- ✅ [Feature 2] - 90% coverage
- 🟡 [Feature 3] - 60% coverage

**Features Not Tested** (explain why):
- [Feature X] - Reason

## Recommendations

1. [Fix critical bugs before deployment]
2. [Improve test coverage for Feature X]
3. [Add automated tests for Y]

## Sign-off

- [ ] All critical bugs fixed
- [ ] All high priority bugs triaged
- [ ] Pass rate ≥95%
- [ ] Ready for deployment (Yes/No)
```

---

## Session Metrics

Track during testing:

- [ ] Test Coverage: Target ≥80%
- [ ] Pass Rate: Target ≥95%
- [ ] Bug Detection: [N] bugs found
- [ ] Journey Completion: Target 100% of critical paths
- [ ] Token Usage: 40-60K (20-30%)

---

## Post-Session Requirements

After testing session:

1. **Update Session Log**:
   ```markdown
   | [Date] | Testing | [Xh] | [YK] | 0 | [Q/10] | Test report | Pass: [X%], Bugs: [N] |
   ```

2. **Create Bug Tickets**:
   - File issues in issue tracker
   - Reference test cases
   - Include reproduction steps

3. **Update Handoff Document**:
   - Mark features as tested
   - Note any blockers found
   - Recommend next steps (fixes vs. continue)

4. **Rate Session** (1-10):
   - 10 = Comprehensive testing, high coverage, bugs found early
   - 8-9 = Good coverage, most scenarios tested
   - 6-7 = Adequate but incomplete
   - <6 = Insufficient testing

---

## Exit Criteria

- [ ] All planned test cases executed
- [ ] Pass rate ≥95% OR bugs documented for failures
- [ ] All user stories validated against acceptance criteria
- [ ] Test report created and comprehensive
- [ ] Bugs have severity ratings and reproduction steps
- [ ] Coverage meets target (≥80%)
- [ ] Session rating ≥8/10
- [ ] SESSION_LOG.md updated

---

## Bidirectional Validation

To verify this command's doc list is current:
```bash
grep "auto:.*testing" --include="*.md" .claude/ KARVIA_STRATEGY/
```

Compare output with AUTO list above.

---

## Success Criteria

This testing session is successful when:
- ✅ All planned test cases executed
- ✅ Pass rate ≥95% OR bugs documented for failures
- ✅ All user stories validated against acceptance criteria
- ✅ Test report created and comprehensive
- ✅ Bugs have severity ratings and reproduction steps
- ✅ Coverage meets target (≥80%)
- ✅ Session rating ≥8/10

---

**NOW BEGIN TESTING**

Execute the test cases for:
1. [Test category 1]
2. [Test category 2]
3. [Test category 3]

Document every test case, every result, every bug found.

**Remember**: Finding bugs now saves production incidents later. Be thorough and critical.
