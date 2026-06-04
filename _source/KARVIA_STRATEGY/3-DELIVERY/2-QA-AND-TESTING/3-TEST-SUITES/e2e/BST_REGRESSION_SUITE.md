# BST Regression Suite

**Version**: 2.0.0
**Last Updated**: February 16, 2026
**Purpose**: Run after every sprint release to ensure no regression
**Duration**: 30-45 minutes
**Automation**: 60% automated, 40% manual

---

## Overview

The Business Scenario Testing (BST) regression suite validates all critical user journeys after each release. This suite must pass before any production deployment.

### Execution Checklist

```
[ ] All smoke tests pass (5 min)
[ ] All BST scenarios pass (30 min)
[ ] No P0/P1 bugs found
[ ] Performance metrics stable
[ ] Sign-off obtained
```

---

## Section 1: Smoke Tests (T1)

**Duration**: 5 minutes | **Blocking**: Yes - Must pass before BST

### 1.1 Core Page Load Tests

| ID | Test | Expected | Auto |
|----|------|----------|------|
| SMOKE-001 | Login page loads | 200, form visible | Yes |
| SMOKE-002 | Dashboard loads after login | 200, tasks visible | Yes |
| SMOKE-003 | Objectives page loads | 200, list visible | Yes |
| SMOKE-004 | Planning page loads | 200, quarters visible | Yes |
| SMOKE-005 | Assessment Hub loads | 200, tabs visible | Yes |
| SMOKE-006 | Team SSI View loads | 200, scores visible | Yes |
| SMOKE-007 | Company Profile loads | 200, form visible | Yes |

### 1.2 Authentication Tests

| ID | Test | Expected | Auto |
|----|------|----------|------|
| SMOKE-010 | Valid login succeeds | Token returned | Yes |
| SMOKE-011 | Invalid login fails | 401, error shown | Yes |
| SMOKE-012 | Token refresh works | New token silently | Yes |
| SMOKE-013 | Logout clears session | Redirect to login | Yes |

### 1.3 API Health

| ID | Test | Expected | Auto |
|----|------|----------|------|
| SMOKE-020 | GET /api/objectives | 200 or 401 | Yes |
| SMOKE-021 | GET /api/companies/:id | 200 or 401 | Yes |
| SMOKE-022 | GET /api/assessments | 200 or 401 | Yes |
| SMOKE-023 | GET /api/diagnostic/check | 200 or 401 | Yes |

**Command**: `npm run test:smoke`

---

## Section 2: BST Scenarios (T2)

**Duration**: 30 minutes | **Blocking**: Yes

### BST-1: Authentication Flow

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open app in incognito | Login page displays | [ ] |
| 2 | Enter valid credentials | Dashboard loads | [ ] |
| 3 | Refresh page | Session persists | [ ] |
| 4 | Switch to different role | Permissions change | [ ] |
| 5 | Logout | Session cleared | [ ] |

**Roles to test**: Employee, Manager, Executive, Consultant

---

### BST-2: Consultant Company Management

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Login as Consultant | Company switcher visible | [ ] |
| 2 | View current company | Data shows for current | [ ] |
| 3 | Click company switcher | Dropdown with managed companies | [ ] |
| 4 | Select different company | Context switches | [ ] |
| 5 | View objectives | Shows new company's data | [ ] |
| 6 | View assessments | Shows new company's data | [ ] |

---

### BST-3: Assessment Template Creation

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open Assessment Hub | 4 tabs visible | [ ] |
| 2 | Click "Create New Assessment" | Wizard Step 1 | [ ] |
| 3 | Enter template name | Validates required | [ ] |
| 4 | Set dimension weights | Sum to 100% check | [ ] |
| 5 | Select 45 questions | Question library works | [ ] |
| 6 | Review and save | Template created | [ ] |
| 7 | Check My Templates | New template appears | [ ] |

---

### BST-4: Assessment Distribution

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Select template | Template details shown | [ ] |
| 2 | Choose "Email" variant | Recipient list appears | [ ] |
| 3 | Add 3 emails | Emails validated | [ ] |
| 4 | Send invitations | Success message | [ ] |
| 5 | Check "Sent by Me" | Invitations appear | [ ] |
| 6 | Verify email received | Email in inbox | [ ] |

---

### BST-5: Assessment Taking (Anonymous)

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open survey link (incognito) | Survey start page | [ ] |
| 2 | Enter name and role | Form validates | [ ] |
| 3 | Start assessment | Questions load | [ ] |
| 4 | Answer 5 questions | Progress updates | [ ] |
| 5 | Navigate blocks | All 12 blocks accessible | [ ] |
| 6 | Complete all questions | Submit button active | [ ] |
| 7 | Submit assessment | Thank you page | [ ] |
| 8 | Check company scores | Response included | [ ] |

---

### BST-6: SSI Results & OKR Generation

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open Team SSI View | Company overview loads | [ ] |
| 2 | View SSI scores | 3 dimensions + 12 blocks | [ ] |
| 3 | Click "Generate OKRs" | Config modal appears | [ ] |
| 4 | Select period options | Period validated | [ ] |
| 5 | Generate | Loading, then OKRs appear | [ ] |
| 6 | Review suggestions | 4-6 objectives shown | [ ] |
| 7 | Dismiss one with reason | Reason picker shown | [ ] |
| 8 | Edit objective title | Inline edit works | [ ] |
| 9 | Approve remaining | Success message | [ ] |
| 10 | Check Objectives page | New objectives appear | [ ] |

---

### BST-7: Objectives Management

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open Objectives page | List loads | [ ] |
| 2 | View objective details | KRs inline | [ ] |
| 3 | Create new objective | Form appears | [ ] |
| 4 | Fill required fields | Validates | [ ] |
| 5 | Save objective | Appears in list | [ ] |
| 6 | Edit objective | Modal opens | [ ] |
| 7 | Change title | Updates | [ ] |
| 8 | Delete objective | Confirmation modal | [ ] |
| 9 | Confirm delete | Removed from list | [ ] |

---

### BST-8: Planning Page

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open Planning page | Two-panel layout | [ ] |
| 2 | See objectives row | Cards with progress | [ ] |
| 3 | Select objective | KRs load in sidebar | [ ] |
| 4 | Select KR | Weekly goals appear | [ ] |
| 5 | Click "Generate Weekly Goals" | Modal appears | [ ] |
| 6 | Configure weeks | Date picker works | [ ] |
| 7 | Generate | Goals appear | [ ] |
| 8 | Click "Generate Tasks" | Tasks created | [ ] |
| 9 | Complete a task | Checkbox works | [ ] |
| 10 | Verify progress cascade | Goal % updates | [ ] |

---

### BST-9: Dashboard

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open Dashboard | Layout loads | [ ] |
| 2 | See task columns | Overdue, Today, Tomorrow | [ ] |
| 3 | See weekly goals | Last, This, Next week | [ ] |
| 4 | Complete task | Updates immediately | [ ] |
| 5 | Postpone task | Modal with date picker | [ ] |
| 6 | Reassign task (Manager+) | User dropdown | [ ] |
| 7 | Check progress updates | Cascades correctly | [ ] |

---

### BST-10: OKR Wizard (Sprint 12)

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Open Objectives page | OKR Wizard button visible | [ ] |
| 2 | Click wizard | Step 1: Category selection | [ ] |
| 3 | See portfolio analysis | Gaps highlighted | [ ] |
| 4 | Select 2 categories | Multi-select works | [ ] |
| 5 | Configure per category | Count selector | [ ] |
| 6 | Generate | Step 2: Loading, then preview | [ ] |
| 7 | See AI reasoning | Context displayed | [ ] |
| 8 | Edit generated objective | Inline edit | [ ] |
| 9 | Approve selected | Step 3: Review | [ ] |
| 10 | Save approved | Objectives created | [ ] |

---

### BST-11: AI Context Accumulation (Sprint 13)

| Step | Action | Expected | Status |
|------|--------|----------|--------|
| 1 | Generate OKRs first time | Context snapshot saved | [ ] |
| 2 | Check AIInteractionLog | Record created | [ ] |
| 3 | Generate weekly goals | Context includes OKRs | [ ] |
| 4 | Check context snapshot | OKRs in context | [ ] |
| 5 | Generate tasks | Context includes goals | [ ] |
| 6 | Check task context | Includes SSI + OKRs + goals | [ ] |
| 7 | Reject suggestion | Reason stored | [ ] |
| 8 | Regenerate | Rejection in context | [ ] |

---

## Section 3: Edge Case Validation

### 3.1 Empty States

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| EDGE-001 | No objectives | Empty state with CTA | [ ] |
| EDGE-002 | No assessments | Prompt to start | [ ] |
| EDGE-003 | No teams | Empty team list | [ ] |
| EDGE-004 | No KRs on objective | "No key results" | [ ] |
| EDGE-005 | No tasks | Empty dashboard | [ ] |

### 3.2 Error Handling

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| EDGE-010 | Invalid token | Redirect to login | [ ] |
| EDGE-011 | API timeout | User-friendly error | [ ] |
| EDGE-012 | OpenAI failure | Graceful degradation | [ ] |
| EDGE-013 | Expired survey link | Error page | [ ] |

### 3.3 Role-Based Access

| ID | Scenario | Expected | Status |
|----|----------|----------|--------|
| RBAC-001 | Employee can't delete | Button hidden | [ ] |
| RBAC-002 | Manager can reassign | Button visible | [ ] |
| RBAC-003 | Consultant switches company | Data changes | [ ] |
| RBAC-004 | Admin sees all | Full access | [ ] |

---

## Section 4: Performance Checks

| Metric | Threshold | Method | Status |
|--------|-----------|--------|--------|
| Dashboard load | < 2s | Chrome DevTools | [ ] |
| Objectives load | < 2s | Chrome DevTools | [ ] |
| Planning load | < 3s | Chrome DevTools | [ ] |
| OKR generation | < 30s | Timer | [ ] |
| Task generation | < 10s | Timer | [ ] |

---

## Section 5: Sign-Off

### Test Execution Summary

| Category | Total | Pass | Fail | Skip |
|----------|-------|------|------|------|
| Smoke | 23 | | | |
| BST Scenarios | 11 | | | |
| Edge Cases | 14 | | | |
| Performance | 5 | | | |
| **Total** | **53** | | | |

### Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |

### Notes

```
[Any issues found, workarounds, or observations]
```

---

## Appendix: Commands

```bash
# Run automated smoke tests
npm run test:smoke

# Run BST automation suite
npm run test:bst

# Run specific BST scenario
npm run test:bst -- --grep "BST-6"

# Generate coverage report
npm run test:coverage
```

---

**Template Version**: 2.0.0
**Review Cycle**: Each sprint
**Next Update**: After Sprint 13
