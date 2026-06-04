# OKR Workflow - Scenarios & Edge Cases

**Version**: 1.0.0
**Created**: December 2, 2025
**Purpose**: Document all possible scenarios users may encounter

---

## 1. Objective Generation Scenarios

### 1.1 Happy Paths

| ID | Scenario | User | Flow | Expected Outcome |
|----|----------|------|------|------------------|
| OBJ-HP-01 | Generate objective with SSI data | Executive | AI generation with SSI | Objective + 3-5 KRs based on weak dimensions |
| OBJ-HP-02 | Generate objective with Company Profile | Executive | AI with profile context | Uses industry, size, goals in generation |
| OBJ-HP-03 | Create objective manually | Manager | Form completion | Objective saved with all fields |
| OBJ-HP-04 | Generate for specific category | Executive | Select "Operations" | Objective focused on operations |
| OBJ-HP-05 | Generate with custom date range | Executive | Select 6 months Jul-Dec | Dates align correctly |

### 1.2 Edge Cases

| ID | Scenario | Condition | Expected Behavior |
|----|----------|-----------|-------------------|
| OBJ-EC-01 | No SSI assessment exists | Assessment = 0% | Template-based generation, warning shown |
| OBJ-EC-02 | SSI below 80% threshold | 50% complete | Warning: "Complete assessment for better results" |
| OBJ-EC-03 | Company profile empty | No profile data | Uses defaults, less personalized |
| OBJ-EC-04 | AI service unavailable | OpenAI down | Fallback to template, error toast |
| OBJ-EC-05 | Very long title entered | 500+ characters | Truncated or validation error |
| OBJ-EC-06 | Special characters in title | `<script>alert('x')</script>` | XSS prevented, escaped |
| OBJ-EC-07 | Same title as existing | "Revenue Growth" exists | Allowed (no uniqueness) |
| OBJ-EC-08 | No owner selected | Owner dropdown empty | Creator becomes owner |
| OBJ-EC-09 | Past start date | Start = yesterday | Validation error |
| OBJ-EC-10 | End before start | End < Start | Validation error |
| OBJ-EC-11 | 36-month objective | 3 years | Allowed, quarters calculated |
| OBJ-EC-12 | 1-month objective | Very short | Allowed, limited quarters |
| OBJ-EC-13 | All 6 categories covered | No gaps | Coverage widget shows 100% |
| OBJ-EC-14 | Fiscal year boundary | Apr 2025 - Mar 2026 | Quarters span years correctly |
| OBJ-EC-15 | Generate during network issue | Offline | Error with retry option |

---

## 2. Planning Scenarios

### 2.1 Happy Paths

| ID | Scenario | User | Flow | Expected Outcome |
|----|----------|------|------|------------------|
| PLAN-HP-01 | Generate plan for new KR | Manager | Create Plan button | Quarterly + Weekly goals + Tasks |
| PLAN-HP-02 | View existing plan | Manager | View button | Tree view shows hierarchy |
| PLAN-HP-03 | Navigate to Dashboard | Any | Click Dashboard link | Lands on Dashboard for task CRUD |
| PLAN-HP-04 | Expand/collapse quarters | Any | Click chevron | Shows/hides weeks |
| PLAN-HP-05 | Generate 12-week plan | Manager | Full quarter | 12 weekly goals, 36+ tasks |

### 2.2 Edge Cases

| ID | Scenario | Condition | Expected Behavior |
|----|----------|-----------|-------------------|
| PLAN-EC-01 | Plan already exists | 24 weeks generated | Dialog: "Plan exists", View/Regenerate options |
| PLAN-EC-02 | Regenerate plan | Confirm regenerate | Old plan deleted, new created |
| PLAN-EC-03 | No KR owner assigned | Owner = null | Plan created, tasks unassigned |
| PLAN-EC-04 | Calendar year objective | Jan-Dec | Q1=Jan-Mar, Q2=Apr-Jun, etc. |
| PLAN-EC-05 | Fiscal year objective | Apr-Mar | Q1=Apr-Jun, Q2=Jul-Sep, etc. |
| PLAN-EC-06 | Custom 6-month period | Jul-Dec | Quarters divided within period |
| PLAN-EC-07 | Task date outside goal | Jan 15 for Dec goal | Validation error (Sprint 7 BUG5 fix) |
| PLAN-EC-08 | Very short objective | 2 weeks | Minimal plan structure |
| PLAN-EC-09 | AI timeout during plan | 30+ seconds | Error with retry |
| PLAN-EC-10 | Generate with 0 KRs | Objective has no KRs | "No KRs to plan" message |
| PLAN-EC-11 | Concurrent generation | Two users click | Second blocked or queued |
| PLAN-EC-12 | Large plan (100+ weeks) | 2-year objective | Performance acceptable |

---

## 3. Assignment Scenarios

### 3.1 Happy Paths

| ID | Scenario | User | Flow | Expected Outcome |
|----|----------|------|------|------------------|
| ASSIGN-HP-01 | Assign goal to employee | Manager | Select from dropdown | Employee sees goal |
| ASSIGN-HP-02 | Assign task to employee | Manager | Select from dropdown | Task in employee dashboard |
| ASSIGN-HP-03 | Reassign task | Manager | Change assignee | New assignee sees task |
| ASSIGN-HP-04 | Bulk assign tasks | Manager | Select all, assign | All tasks assigned |
| ASSIGN-HP-05 | Auto-assign to KR owner | System | Plan generation | Owner gets tasks |

### 3.2 Edge Cases

| ID | Scenario | Condition | Expected Behavior |
|----|----------|-----------|-------------------|
| ASSIGN-EC-01 | No team members | Empty team | "No users available" message |
| ASSIGN-EC-02 | Employee tries to assign | Role = EMPLOYEE | Button hidden/disabled |
| ASSIGN-EC-03 | Assign outside team | Manager → other team | Blocked with error |
| ASSIGN-EC-04 | Assign to inactive user | User status = inactive | "User unavailable" error |
| ASSIGN-EC-05 | Assign to different company | Cross-tenant | "User not in company" error |
| ASSIGN-EC-06 | User leaves after assignment | User deleted | Tasks flagged as orphaned |
| ASSIGN-EC-07 | Reassign completed task | Status = done | Allowed, no effect on completion |
| ASSIGN-EC-08 | Self-assign | Manager to self | Allowed |
| ASSIGN-EC-09 | Assign same task twice | Click fast twice | Single assignment, idempotent |

---

## 4. Dashboard Execution Scenarios

### 4.1 Happy Paths

| ID | Scenario | User | Flow | Expected Outcome |
|----|----------|------|------|------------------|
| DASH-HP-01 | View my tasks | Employee | Open Dashboard | Only assigned tasks visible |
| DASH-HP-02 | Complete task | Employee | Click Complete | Status = done, progress updates |
| DASH-HP-03 | Postpone task | Employee | Select new date | Due date updated |
| DASH-HP-04 | Update progress | Employee | Slide to 50% | Progress saved |
| DASH-HP-05 | View Why Chain | Employee | Expand Why Chain | Full hierarchy visible |
| DASH-HP-06 | Filter by overdue | Employee | Click Overdue filter | Only overdue tasks shown |
| DASH-HP-07 | Manager views team | Manager | Open Dashboard | Team tasks visible |
| DASH-HP-08 | Manager reassigns | Manager | Click Reassign | Task moves to new user |

### 4.2 Edge Cases

| ID | Scenario | Condition | Expected Behavior |
|----|----------|-----------|-------------------|
| DASH-EC-01 | No tasks assigned | New employee | "No tasks" empty state |
| DASH-EC-02 | 100+ tasks | Heavy workload | Pagination/scroll works |
| DASH-EC-03 | Complete already done | Status = completed | No change, maybe toast |
| DASH-EC-04 | Postpone to past | Date = yesterday | Validation: "Must be future" |
| DASH-EC-05 | Postpone beyond goal | Date > goal end | Error: "Date exceeds goal" (Sprint 8) |
| DASH-EC-06 | Reassign without permission | Employee tries | Button hidden |
| DASH-EC-07 | Offline mode | No network | Clear offline indicator |
| DASH-EC-08 | Session timeout | 30 min idle | Prompt to re-login |
| DASH-EC-09 | Why Chain missing | Task unlinked | "Not linked to goal" message |
| DASH-EC-10 | Very long task name | 200+ chars | Truncated with ellipsis |
| DASH-EC-11 | Zero progress update | Slide to 0% | Allowed, resets progress |
| DASH-EC-12 | 100% progress | Slide to 100% | Auto-completes task |

---

## 5. Progress Cascade Scenarios

### 5.1 Happy Paths

| ID | Scenario | Action | Expected Cascade |
|----|----------|--------|------------------|
| PROG-HP-01 | Complete 1 of 5 tasks | Task done | Weekly goal = 20% |
| PROG-HP-02 | Complete all tasks | All done | Weekly goal = 100% |
| PROG-HP-03 | Weekly goal complete | All weeks done | Quarterly goal increases |
| PROG-HP-04 | Quarterly complete | All quarters | KR increases |
| PROG-HP-05 | All KRs complete | All at 100% | Objective = 100%, status = completed |

### 5.2 Edge Cases

| ID | Scenario | Condition | Expected Behavior |
|----|----------|-----------|-------------------|
| PROG-EC-01 | Zero tasks in goal | No tasks | Goal = 0% or N/A |
| PROG-EC-02 | Delete task | Remove 1 of 5 | Progress recalculated (4 tasks) |
| PROG-EC-03 | Delete goal | Remove weekly goal | Tasks orphaned or deleted |
| PROG-EC-04 | Progress > 100% | Bug | Clamped to 100% |
| PROG-EC-05 | Negative progress | Bug | Clamped to 0% |
| PROG-EC-06 | Mixed task status | 2 done, 1 in progress, 2 todo | Weighted calculation |
| PROG-EC-07 | Complete overdue task | Late completion | Progress still updates |
| PROG-EC-08 | Undo completion | Reopen task | Progress decreases |

---

## 6. Deletion Cascade Scenarios

| ID | Entity Deleted | Cascade Effect | Data Preservation |
|----|----------------|----------------|-------------------|
| DEL-01 | Objective | All KRs, Goals, Tasks deleted | Soft delete (status=cancelled) |
| DEL-02 | Key Result | Quarterly/Weekly goals, Tasks deleted | Soft delete |
| DEL-03 | Quarterly Goal | Weekly goals, Tasks deleted | Soft delete |
| DEL-04 | Weekly Goal | Tasks deleted | Soft delete |
| DEL-05 | Task only | No cascade | Soft delete |
| DEL-06 | Company | All data for company | Hard delete (GDPR) |

---

## 7. Multi-Tenant Scenarios

| ID | Scenario | Expected Behavior |
|----|----------|-------------------|
| MT-01 | User sees only own company data | Other company data never visible |
| MT-02 | API with wrong company_id | 403 Forbidden |
| MT-03 | Consultant switches company | Complete context change |
| MT-04 | Direct URL to other company | 404 or 403 |
| MT-05 | Search returns cross-company | Never - filtered by company_id |
| MT-06 | Two companies same objective title | Allowed - separate namespaces |

---

## 8. Concurrent Operation Scenarios

| ID | Scenario | Users | Expected Behavior |
|----|----------|-------|-------------------|
| CONC-01 | Two users complete same task | User A, User B | First wins, second sees "Already completed" |
| CONC-02 | Edit while deleting | User A edits, User B deletes | Delete wins, A sees error |
| CONC-03 | Reassign while completing | Manager, Employee | Completion applies first |
| CONC-04 | Two users generate plan | Manager A, Manager B | First wins, second sees exists |
| CONC-05 | Update progress simultaneously | Employee A, Manager | Last write wins |

---

## 9. Performance Scenarios

| ID | Scenario | Volume | Acceptable Performance |
|----|----------|--------|------------------------|
| PERF-01 | Load objectives list | 100 objectives | < 2 seconds |
| PERF-02 | Load Dashboard tasks | 50 tasks | < 1 second |
| PERF-03 | Generate AI objective | 1 request | < 30 seconds |
| PERF-04 | Generate plan | 12 weeks | < 10 seconds |
| PERF-05 | Progress cascade | 5 levels | < 500ms |
| PERF-06 | Search across tasks | 1000 tasks | < 1 second |
| PERF-07 | Export report | Full data | < 5 seconds |

---

## 10. Error Recovery Scenarios

| ID | Scenario | Error Type | Recovery Action |
|----|----------|------------|-----------------|
| ERR-01 | Network failure mid-save | Connection lost | Auto-retry or prompt |
| ERR-02 | Session expired | 401 response | Redirect to login |
| ERR-03 | Validation failure | 400 response | Show field errors |
| ERR-04 | Server error | 500 response | Generic error with retry |
| ERR-05 | Rate limited | 429 response | Wait message, auto-retry |
| ERR-06 | Database timeout | DB unreachable | "Service unavailable" |
| ERR-07 | Partial save | Some data saved | Show what succeeded/failed |

---

## 11. User Journey Test Scenarios

### Journey 1: Complete Success Path

```
Given: Company with 80%+ SSI assessment, team members assigned
When:
  1. Executive generates objective with AI
  2. Manager creates plan for each KR
  3. Tasks assigned to employees
  4. Employees complete all tasks
Then:
  - All progress cascades correctly
  - Objective reaches 100%
  - Achievement celebration shown
```

### Journey 2: Recovery from Overdue

```
Given: Employee with overdue tasks
When:
  1. Employee opens Dashboard
  2. Sees red overdue indicators
  3. Postpones task with valid date
  4. Completes rescheduled task
Then:
  - Task no longer overdue
  - Progress updates correctly
  - Manager notified of postponement
```

### Journey 3: Mid-Course Correction

```
Given: Objective at 30%, 2 weeks remaining
When:
  1. Executive views analytics
  2. Identifies bottleneck team
  3. Manager reassigns tasks
  4. Adds team members
  5. Push to complete
Then:
  - Objective achieved (possibly late)
  - Late completion recorded
  - Analytics show recovery
```

### Journey 4: Plan Regeneration

```
Given: KR with existing plan, needs changes
When:
  1. Manager clicks "Create Plan"
  2. Sees "Plan exists" dialog
  3. Chooses "Regenerate"
  4. Confirms deletion of old plan
  5. New plan generated
Then:
  - Old goals/tasks soft deleted
  - New plan created
  - Progress reset
```

---

## 12. Test Coverage Matrix

| Phase | Scenarios | Edge Cases | Priority |
|-------|-----------|------------|----------|
| Objective Generation | 5 happy paths | 15 edge cases | P0 |
| Planning | 5 happy paths | 12 edge cases | P0 |
| Assignment | 5 happy paths | 9 edge cases | P0 |
| Dashboard | 8 happy paths | 12 edge cases | P0 |
| Progress Cascade | 5 happy paths | 8 edge cases | P0 |
| Deletion | 6 scenarios | - | P1 |
| Multi-Tenant | 6 scenarios | - | P0 |
| Concurrent | 5 scenarios | - | P1 |
| Performance | 7 scenarios | - | P1 |
| Error Recovery | 7 scenarios | - | P1 |
| **Total** | **59** | **56** | |

---

**Created**: December 2, 2025
**Companion**: [OKR_WORKFLOW_COMPREHENSIVE_TEST_PLAN.md](./OKR_WORKFLOW_COMPREHENSIVE_TEST_PLAN.md)
