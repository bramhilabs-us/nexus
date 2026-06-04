# Boundary & Corner Case Test Suite

**Version**: 1.0.0
**Last Updated**: February 16, 2026
**Purpose**: Comprehensive edge case validation for Karvia Business
**Coverage**: All features, all user roles, all data boundaries

---

## Overview

This document catalogs all boundary and corner cases across the Karvia Business platform. Tests are organized by:
1. **Data Boundaries** - Min/max values, empty states, overflow
2. **Role Boundaries** - Permission edges, role transitions
3. **Time Boundaries** - Date ranges, fiscal years, quarters
4. **State Boundaries** - Status transitions, concurrent operations
5. **Integration Boundaries** - API limits, third-party services
6. **AI-Specific Boundaries** - Context limits, rejection handling

---

## Section 1: Data Boundaries

### 1.1 Text Field Limits

| ID | Field | Min | Max | Test Cases |
|----|-------|-----|-----|------------|
| DB-001 | Objective title | 1 | 200 | Empty, 1 char, 200 chars, 201 chars |
| DB-002 | Objective description | 0 | 2000 | Empty, 1 char, 2000 chars, 2001 chars |
| DB-003 | KR title | 1 | 150 | Empty, 1 char, 150 chars, 151 chars |
| DB-004 | Weekly goal title | 1 | 100 | Empty, 1 char, 100 chars, 101 chars |
| DB-005 | Task title | 1 | 100 | Empty, 1 char, 100 chars, 101 chars |
| DB-006 | Task notes | 0 | 500 | Empty, 500 chars, 501 chars |
| DB-007 | Company name | 1 | 100 | Empty, special chars, unicode |
| DB-008 | User name | 2 | 50 | 1 char, 2 chars, 50 chars, 51 chars |
| DB-009 | Email | Valid | Valid | Invalid formats, special domains |
| DB-010 | Assessment question | 1 | 500 | Empty, 500 chars |

**Test Steps for DB-001 (Objective Title)**:
```
1. Create objective with empty title → Expected: Validation error
2. Create objective with 1 character → Expected: Success (edge case)
3. Create objective with 200 characters → Expected: Success
4. Create objective with 201 characters → Expected: Truncation or validation error
5. Create objective with special chars (!@#$%^&*) → Expected: Success (escaped)
6. Create objective with unicode (中文, émojis 🎯) → Expected: Success
7. Create objective with HTML tags → Expected: Escaped, not rendered
```

### 1.2 Numeric Boundaries

| ID | Field | Min | Max | Test Cases |
|----|-------|-----|-----|------------|
| NB-001 | Progress percentage | 0 | 100 | -1, 0, 50, 100, 101, 150 |
| NB-002 | KR target value | 0 | 999999999 | 0, negative, max, overflow |
| NB-003 | KR current value | 0 | 999999999 | 0, negative, > target |
| NB-004 | Assessment score | 0 | 100 | 0, 1, 50, 99, 100 |
| NB-005 | SSI block score | 0 | 100 | All 12 blocks at 0, all at 100 |
| NB-006 | Task count per goal | 0 | 50 | 0 tasks, 50 tasks, 51 tasks |
| NB-007 | Objectives per company | 0 | 100 | 0, 1, 50, 100, 101 |
| NB-008 | Questions per assessment | 10 | 100 | 10, 45 (standard), 100 |
| NB-009 | Team members | 1 | 500 | 1, 100, 500, 501 |
| NB-010 | Companies per consultant | 1 | 50 | 1, 25, 50, 51 |

**Test Steps for NB-001 (Progress Percentage)**:
```
1. Set KR progress to -1 → Expected: Rejected, stays at previous value
2. Set KR progress to 0 → Expected: Success, shows "Not Started"
3. Set KR progress to 50 → Expected: Success, shows progress ring
4. Set KR progress to 100 → Expected: Success, shows "Complete"
5. Set KR progress to 101 → Expected: Clamped to 100 or validation error
6. Set KR progress to 150 → Expected: Rejected or clamped
7. Set progress via API bypass → Expected: Backend validation enforces 0-100
```

### 1.3 Collection Size Boundaries

| ID | Scenario | Boundary | Test Cases |
|----|----------|----------|------------|
| CS-001 | Objectives with 0 KRs | Empty | Display "No Key Results" |
| CS-002 | Objectives with 10 KRs | Max | Display all, scroll if needed |
| CS-003 | KR with 0 weekly goals | Empty | Display "No goals" |
| CS-004 | KR with 52 weekly goals | 1 year | Display all, pagination |
| CS-005 | Weekly goal with 0 tasks | Empty | Display "No tasks" |
| CS-006 | Weekly goal with 50 tasks | Max | Display all, scroll |
| CS-007 | Company with 0 objectives | Empty | Show onboarding CTA |
| CS-008 | Company with 0 assessments | Empty | Show assessment wizard CTA |
| CS-009 | Dashboard with 0 tasks | Empty | Show "All caught up!" |
| CS-010 | Dashboard with 100+ tasks | Overload | Pagination or virtualization |

---

## Section 2: Role Boundaries

### 2.1 Permission Edge Cases

| ID | Scenario | Roles Involved | Expected |
|----|----------|----------------|----------|
| RB-001 | Employee tries to delete objective | Employee → Block | 403 Forbidden |
| RB-002 | Employee tries to reassign task | Employee → Block | Button hidden |
| RB-003 | Manager reassigns to other team | Manager → Block | Only own team visible |
| RB-004 | Executive creates company-wide objective | Executive → Allow | Success |
| RB-005 | Consultant switches to non-managed company | Consultant → Block | Company not in switcher |
| RB-006 | Deactivated user tries login | Any → Block | 401 Unauthorized |
| RB-007 | User with expired token accesses API | Any → Refresh | Token refresh or 401 |
| RB-008 | Admin demotes self to Employee | Admin → Warn | Confirmation required |
| RB-009 | Last Admin tries to delete self | Admin → Block | Cannot remove last admin |
| RB-010 | User accesses another company's data | Any → Block | Multi-tenant isolation |

**Test Steps for RB-010 (Multi-Tenant Isolation)**:
```
1. Login as User A (Company X)
2. Note objective ID from Company X: obj_123
3. Logout, login as User B (Company Y)
4. Try GET /api/objectives/obj_123 → Expected: 404 or 403
5. Try PUT /api/objectives/obj_123 → Expected: 404 or 403
6. Try DELETE /api/objectives/obj_123 → Expected: 404 or 403
7. Verify Company X data unchanged
```

### 2.2 Role Transition Cases

| ID | Transition | Test Case | Expected |
|----|------------|-----------|----------|
| RT-001 | Employee → Manager | View team becomes visible | Team management unlocks |
| RT-002 | Manager → Executive | Department view expands | Full department access |
| RT-003 | Executive → Employee | Loses management access | Restricted to own tasks |
| RT-004 | Any → Consultant | Multi-company enabled | Company switcher appears |
| RT-005 | Consultant → Employee | Loses multi-company | Restricted to one company |

---

## Section 3: Time Boundaries

### 3.1 Date Range Edge Cases

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| TD-001 | Objective starts today | start_date = today | Valid, appears in current quarter |
| TD-002 | Objective starts in past | start_date = 1 year ago | Valid, historical |
| TD-003 | Objective ends before start | end_date < start_date | Validation error |
| TD-004 | Objective spans 5 years | Custom period | Allowed, shows full range |
| TD-005 | KR date outside objective | KR end > Objective end | Validation error |
| TD-006 | Task date outside weekly goal | Task due outside goal week | Validation error |
| TD-007 | Weekly goal spans 2 weeks | Mon-Sun + 1 day | Should be capped to 7 days |
| TD-008 | Leap year February | Feb 29, 2028 | Correctly handled |
| TD-009 | Timezone crossing | User in UTC+12 creates for UTC-12 user | Dates display in user's TZ |
| TD-010 | DST transition | Task created during DST change | Time preserved correctly |

### 3.2 Fiscal Year Boundaries

| ID | Fiscal Start | Test Case | Expected |
|----|--------------|-----------|----------|
| FY-001 | April | Q1 = Apr-Jun | Correct quarter assignment |
| FY-002 | July | Q1 = Jul-Sep | Correct quarter assignment |
| FY-003 | October | Q1 = Oct-Dec | Correct quarter assignment |
| FY-004 | January | Standard calendar | Default behavior |
| FY-005 | Switch fiscal year type | Mid-year switch | Objectives realigned |
| FY-006 | Fiscal year rollover | Last day of Q4 | Next year Q1 starts |

**Test Steps for FY-001 (April Fiscal Year)**:
```
1. Set company fiscal_year_start = "April"
2. Create objective for "2026 Fiscal Year"
3. Verify Q1 = Apr 1 - Jun 30
4. Verify Q2 = Jul 1 - Sep 30
5. Verify Q3 = Oct 1 - Dec 31
6. Verify Q4 = Jan 1 - Mar 31 (next calendar year)
7. Create KR with target = "Q2 2026 FY"
8. Verify dates = Jul 1 - Sep 30, 2026
```

### 3.3 Quarter Boundaries

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| QB-001 | First day of Q1 | Create on Jan 1 (calendar) | Assigned to Q1 |
| QB-002 | Last day of Q4 | Create on Dec 31 | Assigned to Q4 |
| QB-003 | Quarter selector edge | Q4 selected, objective in Q1 | Not visible |
| QB-004 | Objective spans quarters | Q1-Q3 objective | Shows in Q1, Q2, Q3 filters |
| QB-005 | KR in different quarter than Objective | Objective Q1, KR Q2 | Validation: must be within |

---

## Section 4: State Boundaries

### 4.1 Status Transitions

| ID | Entity | From | To | Valid? |
|----|--------|------|-----|--------|
| ST-001 | Objective | not_started | in_progress | Yes |
| ST-002 | Objective | in_progress | completed | Yes |
| ST-003 | Objective | completed | in_progress | Yes (reopen) |
| ST-004 | Objective | cancelled | in_progress | No (soft deleted) |
| ST-005 | Task | pending | completed | Yes |
| ST-006 | Task | completed | pending | Yes (undo) |
| ST-007 | Task | pending | postponed | Yes |
| ST-008 | Assessment | draft | sent | Yes |
| ST-009 | Assessment | sent | completed | Yes (auto on submission) |
| ST-010 | Assessment | completed | sent | No (cannot unsend) |

### 4.2 Cascade State Changes

| ID | Trigger | Cascade | Expected |
|----|---------|---------|----------|
| CS-001 | All KRs reach 100% | Objective auto-complete? | Depends on setting |
| CS-002 | All tasks completed | Weekly goal progress = 100% | Yes |
| CS-003 | Weekly goal deleted | Tasks orphaned? | Tasks also deleted |
| CS-004 | KR deleted | Weekly goals orphaned? | Goals also deleted |
| CS-005 | Objective archived | KRs status | KRs archived too |
| CS-006 | Company deleted | All data | Cascade delete all |

**Test Steps for CS-002 (Task → Goal Progress)**:
```
1. Create weekly goal with 5 tasks
2. Verify goal progress = 0%
3. Complete 1 task → Verify progress = 20%
4. Complete 2 more tasks → Verify progress = 60%
5. Complete remaining 2 tasks → Verify progress = 100%
6. Uncomplete 1 task → Verify progress = 80%
7. Delete 1 task → Verify progress recalculates (80% of 4 = still 80%? or 75%?)
```

### 4.3 Concurrent Operations

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| CO-001 | Two users edit same objective | User A saves, User B saves | Last write wins or conflict warning |
| CO-002 | Same task completed twice | Click, click quickly | Idempotent, only one completion |
| CO-003 | Delete while editing | User A deletes, User B edits | User B sees "not found" on save |
| CO-004 | Two AI generations simultaneously | Click generate twice | Queue or block second |
| CO-005 | Assessment submitted twice | Double-click submit | Idempotent, single submission |
| CO-006 | Company switch mid-operation | Switch during save | Cancel operation or save to original |

---

## Section 5: Integration Boundaries

### 5.1 API Rate Limits

| ID | Endpoint Type | Limit | Test Case |
|----|---------------|-------|-----------|
| API-001 | General API | 100/min | 101 requests in 60s → 429 |
| API-002 | AI Generation | 10/min | 11 requests in 60s → 429 |
| API-003 | File upload | 10 MB | 10.1 MB file → 413 |
| API-004 | Batch operations | 100 items | 101 items → 400 |
| API-005 | Export PDF | 1/min | 2 in 60s → 429 |

### 5.2 External Service Failures

| ID | Service | Failure Mode | Expected Behavior |
|----|---------|--------------|-------------------|
| EXT-001 | OpenAI API | Timeout | Show error, allow retry |
| EXT-002 | OpenAI API | Rate limited | Show error, queue request |
| EXT-003 | OpenAI API | Invalid response | Graceful degradation, fallback |
| EXT-004 | Email service | SMTP down | Queue email, retry later |
| EXT-005 | MongoDB | Connection lost | Show error, retry connection |
| EXT-006 | Redis | Cache unavailable | Bypass cache, direct DB |

**Test Steps for EXT-001 (OpenAI Timeout)**:
```
1. Configure mock OpenAI to timeout after 30s
2. Click "Generate OKRs"
3. Verify loading spinner shown
4. After 30s, verify error message displayed
5. Verify "Retry" button appears
6. Click retry
7. Verify new request sent
8. Verify no duplicate OKRs created
```

### 5.3 Database Edge Cases

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| DB-E001 | ObjectId invalid | GET /api/objectives/invalid | 400 Bad Request |
| DB-E002 | ObjectId not found | GET /api/objectives/507f1f77bcf86cd799439011 | 404 Not Found |
| DB-E003 | Duplicate unique field | Same email for two users | 409 Conflict |
| DB-E004 | Reference deleted | KR references deleted objective | Orphan handling |
| DB-E005 | Transaction rollback | Multi-doc update fails mid-way | All changes rolled back |

---

## Section 6: AI-Specific Boundaries

### 6.1 Context Size Limits

| ID | Scenario | Limit | Test Case |
|----|----------|-------|-----------|
| AI-001 | Small context | < 1000 tokens | Standard generation |
| AI-002 | Medium context | 5000 tokens | Includes history |
| AI-003 | Large context | 15000 tokens | Full year history |
| AI-004 | Context overflow | > 30000 tokens | Truncation strategy |
| AI-005 | Empty context | 0 company data | Graceful fallback |

### 6.2 AI Generation Edge Cases

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| AI-G001 | No SSI scores | Generate OKRs without assessment | Use default context |
| AI-G002 | All SSI scores = 0 | Complete assessment with all 0s | AI handles low scores |
| AI-G003 | All SSI scores = 100 | Perfect scores | AI generates maintenance OKRs |
| AI-G004 | Existing objectives conflict | Generate similar to existing | AI avoids duplicates |
| AI-G005 | User rejects all suggestions | Reject 5 suggestions | AI learns, suggests differently |
| AI-G006 | Same rejection reason 3x | "too_generic" three times | AI prioritizes specific |
| AI-G007 | No task history | First-time task generation | Works without history |
| AI-G008 | 1-year task history | 365 days of tasks | AI identifies patterns |

**Test Steps for AI-G005 (Rejection Learning)**:
```
1. Generate OKRs (first time)
2. Reject all 5 with reason "too_generic"
3. Verify AIInteractionLog contains rejections
4. Generate OKRs again
5. Verify new prompt includes: "Avoid generic suggestions"
6. Verify new suggestions are more specific
7. Approve 2 suggestions
8. Generate again
9. Verify AI avoids similar to rejected, builds on approved
```

### 6.3 AI Context Accumulation

| ID | Step | Context Includes | Test |
|----|------|------------------|------|
| AI-C001 | After company profile | Company name, industry | Verify in context |
| AI-C002 | After SSI assessment | 12-block scores | Verify all 12 blocks |
| AI-C003 | After OKR generation | Approved objectives | Verify objectives in context |
| AI-C004 | After OKR rejection | Rejection reasons | Verify reasons in context |
| AI-C005 | After goal generation | Weekly goals | Verify goals in context |
| AI-C006 | After task completion | Task history | Verify 1-year history |
| AI-C007 | Context delta | Changes since last call | Verify delta detection |

---

## Section 7: UI/UX Edge Cases

### 7.1 Input Validation

| ID | Field | Invalid Input | Expected |
|----|-------|---------------|----------|
| UI-001 | Email | no@domain | Validation error |
| UI-002 | Date | Feb 30, 2026 | Validation error |
| UI-003 | Password | 123 (too short) | Min length error |
| UI-004 | Number input | "abc" | Rejected or NaN |
| UI-005 | Required field | Empty submission | Required field error |
| UI-006 | XSS attempt | `<script>alert(1)</script>` | Escaped, not executed |
| UI-007 | SQL injection | `'; DROP TABLE users;` | Escaped, no effect |
| UI-008 | Special characters | `O'Brien's Goal` | Properly escaped |

### 7.2 Display Edge Cases

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| UI-D001 | Long text overflow | 200 char title | Truncated with ellipsis |
| UI-D002 | No avatar | User without profile pic | Initials shown |
| UI-D003 | Empty list | No objectives | Empty state with CTA |
| UI-D004 | Loading state | Slow API | Spinner shown |
| UI-D005 | Error state | API failure | Error message + retry |
| UI-D006 | Partial data | Some fields null | Graceful handling |
| UI-D007 | Large numbers | 1,000,000 target | Formatted with commas |
| UI-D008 | Negative numbers | -5 (invalid) | Handled or rejected |

### 7.3 Navigation Edge Cases

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| NAV-001 | Browser back | Back after submission | Don't re-submit |
| NAV-002 | Deep link | Direct URL to objective | Loads correctly |
| NAV-003 | Bookmark expired link | Link to deleted objective | 404 page |
| NAV-004 | Refresh mid-form | Unsaved changes | Warn before leaving |
| NAV-005 | Tab switch | Switch away during load | Continues loading |

---

## Section 8: Security Edge Cases

### 8.1 Authentication Boundaries

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| SEC-001 | Expired JWT | Token > 24h old | 401, redirect to login |
| SEC-002 | Invalid JWT | Tampered token | 401 Forbidden |
| SEC-003 | Missing JWT | No Authorization header | 401 Unauthorized |
| SEC-004 | JWT for different user | Use other user's token | 403 Forbidden |
| SEC-005 | Brute force login | 10 failed attempts | Account locked |
| SEC-006 | Password reset expired | Link > 1h old | Link invalid |

### 8.2 Authorization Boundaries

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| AUTH-001 | IDOR attempt | Access /api/objectives/other_company_id | 404 or 403 |
| AUTH-002 | Role escalation | Modify JWT role claim | Signature invalid |
| AUTH-003 | Admin API as user | POST /api/admin/users as Employee | 403 Forbidden |
| AUTH-004 | Consultant scope | Access non-managed company | 403 Forbidden |
| AUTH-005 | API key exposure | Key in URL params | Should use headers |

---

## Section 9: Assessment-Specific Edge Cases

### 9.1 Assessment Creation

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| ASS-001 | 0 questions selected | Try to save template | Validation error |
| ASS-002 | Same question twice | Select same Q | Prevented or deduplicated |
| ASS-003 | Weights != 100% | 30% + 30% + 30% | Validation error |
| ASS-004 | All weight on one | 100% + 0% + 0% | Allowed but warned |
| ASS-005 | No recipients | Send to 0 emails | Validation error |
| ASS-006 | Invalid email | Invalid recipient | Validation error |
| ASS-007 | Duplicate emails | Same email twice | Deduplicated |

### 9.2 Assessment Taking

| ID | Scenario | Test Case | Expected |
|----|----------|-----------|----------|
| ASS-T001 | Partial submission | Answer 30/45, close browser | Progress saved |
| ASS-T002 | Expired link | Link > 7 days old | Link expired page |
| ASS-T003 | Already submitted | Click link again | "Already completed" |
| ASS-T004 | Skip questions | Navigate past unanswered | Warning or block |
| ASS-T005 | All same answer | All "Strongly Agree" | Valid but flagged |
| ASS-T006 | Very fast completion | < 2 min for 45 Q | Flagged for review |

---

## Section 10: Test Execution Templates

### 10.1 Boundary Test Template

```markdown
**Test ID**: [BC-XXX]
**Category**: [Data/Role/Time/State/Integration/AI/UI/Security/Assessment]
**Priority**: [P0/P1/P2]
**Automation**: [Yes/No/Partial]

**Preconditions**:
- [ ] Condition 1
- [ ] Condition 2

**Test Steps**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**:
- [ ] Expected outcome 1
- [ ] Expected outcome 2

**Actual Result**: [Pass/Fail/Blocked]
**Notes**:
```

### 10.2 Test Execution Checklist

```markdown
## Boundary Testing Execution - [Date]

### Data Boundaries
- [ ] DB-001 through DB-010 executed
- [ ] NB-001 through NB-010 executed
- [ ] CS-001 through CS-010 executed

### Role Boundaries
- [ ] RB-001 through RB-010 executed
- [ ] RT-001 through RT-005 executed

### Time Boundaries
- [ ] TD-001 through TD-010 executed
- [ ] FY-001 through FY-006 executed
- [ ] QB-001 through QB-005 executed

### State Boundaries
- [ ] ST-001 through ST-010 executed
- [ ] CS-001 through CS-006 executed
- [ ] CO-001 through CO-006 executed

### Integration Boundaries
- [ ] API-001 through API-005 executed
- [ ] EXT-001 through EXT-006 executed
- [ ] DB-E001 through DB-E005 executed

### AI Boundaries
- [ ] AI-001 through AI-005 executed
- [ ] AI-G001 through AI-G008 executed
- [ ] AI-C001 through AI-C007 executed

### UI Boundaries
- [ ] UI-001 through UI-008 executed
- [ ] UI-D001 through UI-D008 executed
- [ ] NAV-001 through NAV-005 executed

### Security Boundaries
- [ ] SEC-001 through SEC-006 executed
- [ ] AUTH-001 through AUTH-005 executed

### Assessment Boundaries
- [ ] ASS-001 through ASS-007 executed
- [ ] ASS-T001 through ASS-T006 executed

**Total Tests**: 143
**Pass**: ___
**Fail**: ___
**Blocked**: ___
**Coverage**: ___%
```

---

## Appendix: Quick Reference

### Boundary Values Reference

| Type | Min | Max | Edge |
|------|-----|-----|------|
| Objective title | 1 | 200 | 0, 1, 200, 201 |
| Progress % | 0 | 100 | -1, 0, 100, 101 |
| Team size | 1 | 500 | 0, 1, 500, 501 |
| SSI score | 0 | 100 | 0, 1, 99, 100 |
| Assessment questions | 10 | 100 | 9, 10, 100, 101 |
| Context tokens | 0 | 30000 | 0, 15000, 30000, 30001 |

### Common Error Codes

| Code | Meaning | Common Trigger |
|------|---------|----------------|
| 400 | Bad Request | Invalid input, validation failure |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist or wrong company |
| 409 | Conflict | Duplicate unique field |
| 413 | Payload Too Large | File size exceeded |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected backend error |

---

**Document Version**: 1.0.0
**Test Count**: 143 boundary/corner cases
**Review Cycle**: Each sprint
**Next Update**: After Sprint 13 execution
