# OKR Workflow - Comprehensive Test Plan

**Version**: 1.0.0
**Created**: December 2, 2025
**Purpose**: End-to-end testing of the complete OKR lifecycle
**Companion**: [MASTER_TEST_PLAN.md](./MASTER_TEST_PLAN.md)

---

## 1. OKR Lifecycle Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE OKR LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. ASSESSMENT          2. OBJECTIVE          3. PLANNING                   │
│  ┌───────────┐         ┌───────────┐         ┌───────────┐                 │
│  │ SSI Report│────────▶│ Generate  │────────▶│ Create    │                 │
│  │ Company   │         │ Objective │         │ Action    │                 │
│  │ Profile   │         │ + KRs     │         │ Plan      │                 │
│  └───────────┘         └───────────┘         └───────────┘                 │
│       │                      │                     │                        │
│       ▼                      ▼                     ▼                        │
│  4. ASSIGNMENT         5. EXECUTION          6. COMPLETION                  │
│  ┌───────────┐         ┌───────────┐         ┌───────────┐                 │
│  │ Assign    │────────▶│ Dashboard │────────▶│ Task Done │                 │
│  │ Goals &   │         │ Complete  │         │ → Goal    │                 │
│  │ Tasks     │         │ Tasks     │         │ → KR Done │                 │
│  └───────────┘         └───────────┘         └───────────┘                 │
│                                                    │                        │
│                              ┌─────────────────────┘                        │
│                              ▼                                              │
│                    ┌───────────────────┐                                    │
│                    │ OBJECTIVE ACHIEVED│                                    │
│                    │   COMPANY WINS!   │                                    │
│                    └───────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Test Personas & Roles

| Persona | Role | Primary Actions | Access Level |
|---------|------|-----------------|--------------|
| **Executive** | EXECUTIVE | Create objectives, approve plans, view analytics | Full visibility |
| **Manager** | MANAGER | Create plans, assign tasks, monitor team | Team + 1 level up |
| **Employee** | EMPLOYEE | Complete tasks, view progress | Own tasks only |
| **Consultant** | CONSULTANT | Advise, generate OKRs, multi-company | Multi-company |
| **Business Owner** | BUSINESS_OWNER | All executive powers + company settings | Full access |

---

## 3. Phase 1: Objective Generation Tests

### 3.1 Happy Path - AI Generation

| ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|----|-----------|---------------|-------|-----------------|----------|
| OBJ-GEN-001 | Generate objective from SSI | SSI assessment complete (80%+) | 1. Open Objectives page<br>2. Click "+ Add Objective"<br>3. Select "Generate with AI"<br>4. Select category (Growth)<br>5. Set date range (6 months)<br>6. Click Generate | Objective + 3-5 KRs created | P0 |
| OBJ-GEN-002 | Generate with Company Profile | Company profile complete | Same as above, verify profile data used | AI uses company context | P1 |
| OBJ-GEN-003 | Generate without SSI | No SSI assessment | Same as above | Fallback to template, warning shown | P1 |
| OBJ-GEN-004 | Manual objective creation | None | Create objective manually with form | Objective saved with owner | P0 |
| OBJ-GEN-005 | Category selection | None | Select each of 6 MECE categories | Correct category assigned | P1 |

### 3.2 Date Range Tests

| ID | Test Case | Date Config | Expected Result | Priority |
|----|-----------|-------------|-----------------|----------|
| OBJ-DATE-001 | Calendar year objective | Jan 1 - Dec 31, 2025 | Q1-Q4 aligned to Jan-Dec | P0 |
| OBJ-DATE-002 | Fiscal year (Apr start) | Apr 1, 2025 - Mar 31, 2026 | Q1 = Apr-Jun | P0 |
| OBJ-DATE-003 | Custom 6-month period | Jul 1 - Dec 31, 2025 | 4 quarters within 6 months | P0 |
| OBJ-DATE-004 | Custom 3-month period | Oct 1 - Dec 31, 2025 | Goals fit in 3 months | P1 |
| OBJ-DATE-005 | Past start date rejected | Start date = yesterday | Error: "Start date must be in future" | P1 |
| OBJ-DATE-006 | End before start rejected | End date < Start date | Error: "End date must be after start" | P1 |

### 3.3 Edge Cases - Objective Generation

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| OBJ-EDGE-001 | Generate when AI disabled (feature flag) | Template-based fallback |
| OBJ-EDGE-002 | OpenAI timeout (30s) | Graceful error, retry option |
| OBJ-EDGE-003 | OpenAI rate limit | "Service busy, try again" |
| OBJ-EDGE-004 | Duplicate objective title | Allow (no uniqueness constraint) |
| OBJ-EDGE-005 | Very long title (500 chars) | Truncated with ellipsis |
| OBJ-EDGE-006 | Special characters in title | Escaped, XSS prevented |
| OBJ-EDGE-007 | No owner selected | Created with creator as owner |
| OBJ-EDGE-008 | Generate while offline | Error with offline message |

---

## 4. Phase 2: Planning Tests

### 4.1 Plan Generation

| ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|----|-----------|---------------|-------|-----------------|----------|
| PLAN-GEN-001 | Generate plan for KR | KR exists with owner | 1. Open Planning page<br>2. Select KR<br>3. Click "Create Plan"<br>4. Configure weeks<br>5. Generate | Quarterly + Weekly goals + Tasks created | P0 |
| PLAN-GEN-002 | Plan already exists | Plan generated | Click "Create Plan" again | "Plan exists" dialog, option to View | P0 |
| PLAN-GEN-003 | View existing plan | Plan exists | Click "View" on KR card | Tree view shows hierarchy | P0 |
| PLAN-GEN-004 | Regenerate plan | Old plan exists | Confirm regeneration | Old plan deleted, new created | P1 |

### 4.2 Date Cascade Tests (Sprint 7 BUG5)

| ID | Scenario | Objective Dates | Generated Goal Dates | Priority |
|----|----------|-----------------|---------------------|----------|
| PLAN-DATE-001 | Calendar year | Jan 1 - Dec 31 | Q1: Jan-Mar, Q2: Apr-Jun, etc. | P0 |
| PLAN-DATE-002 | Fiscal year Apr | Apr 1 - Mar 31 | Q1: Apr-Jun, Q2: Jul-Sep, etc. | P0 |
| PLAN-DATE-003 | Custom 6 months | Jul 1 - Dec 31 | Quarters within Jul-Dec only | P0 |
| PLAN-DATE-004 | Task dates in goal | Weekly goal: Dec 1-7 | Tasks: Dec 1-7 only | P0 |
| PLAN-DATE-005 | Validation blocks invalid | Task date Jan 15 | Error if goal is Dec 1-7 | P0 |

### 4.3 Edge Cases - Planning

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| PLAN-EDGE-001 | KR with no owner | Plan created, unassigned |
| PLAN-EDGE-002 | Very short objective (1 month) | 4 weeks of goals |
| PLAN-EDGE-003 | Very long objective (36 months) | Goals span 3 years |
| PLAN-EDGE-004 | Generate plan for 0 KRs | Nothing to generate message |
| PLAN-EDGE-005 | Concurrent plan generation | Second request queued or blocked |
| PLAN-EDGE-006 | Plan during date cascade update | Transaction handles gracefully |

---

## 5. Phase 3: Assignment Tests

### 5.1 Goal Assignment

| ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|----|-----------|---------------|-------|-----------------|----------|
| ASSIGN-001 | Assign goal to employee | Goal exists, team members exist | Select owner dropdown, choose employee | Goal assigned, employee notified | P0 |
| ASSIGN-002 | Reassign goal | Goal has owner | Change owner | New owner sees goal, old doesn't | P0 |
| ASSIGN-003 | Assign task to employee | Task exists | Same as goal | Task appears in employee dashboard | P0 |
| ASSIGN-004 | Bulk assignment | Multiple tasks | Select all, assign | All tasks assigned | P1 |

### 5.2 Permission Tests

| ID | Scenario | Actor | Expected Result |
|----|----------|-------|-----------------|
| ASSIGN-PERM-001 | Employee tries to assign | EMPLOYEE | Hidden/disabled button |
| ASSIGN-PERM-002 | Manager assigns within team | MANAGER | Allowed |
| ASSIGN-PERM-003 | Manager assigns outside team | MANAGER | Blocked with error |
| ASSIGN-PERM-004 | Executive assigns anywhere | EXECUTIVE | Allowed |
| ASSIGN-PERM-005 | Assign to user in different company | Any | "User not in company" error |

### 5.3 Edge Cases - Assignment

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| ASSIGN-EDGE-001 | No team members exist | Empty dropdown, warning |
| ASSIGN-EDGE-002 | Assign to inactive user | Blocked with message |
| ASSIGN-EDGE-003 | User leaves company after assignment | Tasks remain, flagged as orphaned |
| ASSIGN-EDGE-004 | Assign same task to multiple users | Not allowed (single owner) |
| ASSIGN-EDGE-005 | Circular assignment (A→B→A) | Not applicable (no delegation chain) |

---

## 6. Phase 4: Dashboard Execution Tests

### 6.1 Task Visibility

| ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|----|-----------|---------------|-------|-----------------|----------|
| DASH-VIS-001 | Employee sees assigned tasks | Tasks assigned to user | Login, open Dashboard | Only my tasks visible | P0 |
| DASH-VIS-002 | Manager sees team tasks | Team has tasks | Login, open Dashboard | Team tasks visible | P0 |
| DASH-VIS-003 | Task grouping by date | Multiple tasks | View Dashboard | Grouped: Overdue, Today, Tomorrow, etc. | P1 |
| DASH-VIS-004 | Why Chain visible | Task has lineage | Click task | Full chain: Task → Goal → KR → Objective | P0 |
| DASH-VIS-005 | Overdue indicator | Task past due | View Dashboard | Red highlight, overdue badge | P1 |

### 6.2 Task Actions

| ID | Test Case | Preconditions | Steps | Expected Result | Priority |
|----|-----------|---------------|-------|-----------------|----------|
| DASH-ACT-001 | Complete task | Task in progress | Click Complete | Status = completed, progress updated | P0 |
| DASH-ACT-002 | Update progress | Task exists | Slide progress to 50% | Progress saved, parent updated | P0 |
| DASH-ACT-003 | Postpone task | Task exists | Click Postpone, select date | Due date updated in backend | P0 |
| DASH-ACT-004 | Postpone beyond goal | Task exists | Select date after goal end | Error: "Date must be within goal" | P0 |
| DASH-ACT-005 | Reassign task (manager) | Manager logged in | Click Reassign, select user | Task moves to new user | P0 |
| DASH-ACT-006 | Reassign task (employee) | Employee logged in | - | Button hidden/disabled | P1 |

### 6.3 Edge Cases - Dashboard

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| DASH-EDGE-001 | No tasks assigned | Empty state with message |
| DASH-EDGE-002 | 100+ tasks | Pagination or virtualization |
| DASH-EDGE-003 | Complete already completed | No change, maybe toast |
| DASH-EDGE-004 | Delete task (if allowed) | Task removed, progress recalculated |
| DASH-EDGE-005 | Offline mode attempt | Clear offline indicator |
| DASH-EDGE-006 | Session timeout during work | Prompt to re-login, preserve draft |

---

## 7. Phase 5: Progress Cascade Tests

### 7.1 Progress Roll-up

| ID | Test Case | Action | Expected Cascade | Priority |
|----|-----------|--------|------------------|----------|
| PROG-001 | Task completion | Complete 1 of 5 tasks | Weekly goal = 20% | P0 |
| PROG-002 | Weekly goal completion | All tasks done | Quarterly goal increases | P0 |
| PROG-003 | Quarterly goal completion | All weekly goals done | KR progress increases | P0 |
| PROG-004 | KR completion | All quarterly goals done | Objective progress increases | P0 |
| PROG-005 | Objective completion | All KRs at 100% | Objective status = completed | P0 |

### 7.2 Progress Calculation Edge Cases

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| PROG-EDGE-001 | 0 tasks in goal | Goal progress = 0% or N/A |
| PROG-EDGE-002 | Mixed task status | Weighted average calculation |
| PROG-EDGE-003 | Task deleted mid-progress | Progress recalculated without task |
| PROG-EDGE-004 | Goal deleted with tasks | Tasks orphaned or cascade deleted |
| PROG-EDGE-005 | Negative progress (bug) | Clamped to 0% |
| PROG-EDGE-006 | Progress > 100% (bug) | Clamped to 100% |

---

## 8. Phase 6: Completion & Achievement Tests

### 8.1 Objective Achievement

| ID | Test Case | Preconditions | Expected Result | Priority |
|----|-----------|---------------|-----------------|----------|
| ACHIEVE-001 | Objective 100% complete | All KRs done | Objective status = completed, celebration UI | P0 |
| ACHIEVE-002 | Partial KR completion | 2 of 4 KRs at 100% | Objective = 50%, status = in_progress | P0 |
| ACHIEVE-003 | Objective past due date | End date passed | Status = overdue or at_risk | P1 |
| ACHIEVE-004 | Complete overdue objective | Tasks done late | Still marks complete, late badge | P1 |

### 8.2 Notifications

| ID | Scenario | Recipients | Notification Type |
|----|----------|------------|-------------------|
| NOTIFY-001 | Task assigned | Assignee | In-app + email (if enabled) |
| NOTIFY-002 | Task overdue | Assignee + Manager | In-app + email |
| NOTIFY-003 | Goal achieved | Owner + Team | In-app |
| NOTIFY-004 | Objective achieved | Executive + Team | In-app + email |
| NOTIFY-005 | Plan ready for review | Manager | In-app |

---

## 9. Cross-Cutting Scenario Tests

### 9.1 Multi-User Concurrent Operations

| ID | Scenario | Users | Expected Result |
|----|----------|-------|-----------------|
| CONC-001 | Two users complete same task | User A, User B | First wins, second sees "Already completed" |
| CONC-002 | Manager reassigns while employee completes | Manager, Employee | Completion applies, then reassignment |
| CONC-003 | Edit objective while plan generates | Executive, Manager | Plan uses original data, or blocks edit |
| CONC-004 | Delete objective with active plan | Executive | Cascade delete, confirmation required |

### 9.2 Data Integrity Tests

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| DATA-001 | Delete objective | All KRs, goals, tasks deleted |
| DATA-002 | Delete KR | Quarterly goals and below deleted |
| DATA-003 | Delete quarterly goal | Weekly goals and tasks deleted |
| DATA-004 | Delete weekly goal | Tasks deleted |
| DATA-005 | Soft delete vs hard delete | Uses status='cancelled', data preserved |

### 9.3 Multi-Tenant Isolation

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| TENANT-001 | User sees only own company data | Other company data never visible |
| TENANT-002 | API with wrong company_id | 403 Forbidden |
| TENANT-003 | Consultant switches company | Data context changes completely |
| TENANT-004 | Direct URL to other company's objective | 404 or 403 |

---

## 10. End-to-End Journey Tests

### Journey 1: Complete OKR Cycle (Golden Path)

```
Actors: Executive, Manager, Employee
Duration: Full lifecycle
```

| Step | Actor | Action | Expected |
|------|-------|--------|----------|
| 1 | Executive | Generate objective with AI | Objective + 4 KRs created |
| 2 | Executive | Assign KR owners | KRs have owners |
| 3 | Manager | Open Planning page | See KRs as "Not Planned" |
| 4 | Manager | Generate plan for KR1 | 12 weeks of goals + tasks |
| 5 | Manager | Assign tasks to team | Tasks assigned |
| 6 | Employee | Login, view Dashboard | See assigned tasks |
| 7 | Employee | Complete task | Task = done, progress updates |
| 8 | Employee | Complete all tasks | Weekly goal = 100% |
| 9 | System | Progress rolls up | Quarterly → KR → Objective |
| 10 | Executive | View Objectives | See progress increase |
| 11 | All | Complete all tasks | Objective = 100%, ACHIEVEMENT! |

### Journey 2: Postpone and Recover

```
Actors: Employee, Manager
Scenario: Employee needs to postpone, manager helps
```

| Step | Actor | Action | Expected |
|------|-------|--------|----------|
| 1 | Employee | View overdue task | Red indicator shown |
| 2 | Employee | Click Postpone | Date picker opens |
| 3 | Employee | Select +3 days | Task due date updated |
| 4 | System | Validate date | Must be within goal range |
| 5 | Manager | View team dashboard | See postponed task |
| 6 | Manager | Reassign if needed | Task moves to another employee |
| 7 | Employee 2 | Complete task | Progress continues |

### Journey 3: Mid-Course Correction

```
Actors: Executive, Manager
Scenario: Objective at risk, needs adjustment
```

| Step | Actor | Action | Expected |
|------|-------|--------|----------|
| 1 | Executive | View analytics | Objective at 30%, due in 2 weeks |
| 2 | Executive | Identify bottleneck | Team X behind |
| 3 | Manager | View team tasks | See overdue items |
| 4 | Manager | Reassign/postpone | Redistribute work |
| 5 | Manager | Add resources | New team member assigned |
| 6 | All | Push to complete | Objective achieved (late) |

### Journey 4: Consultant Multi-Company

```
Actors: Consultant
Scenario: Advise multiple companies
```

| Step | Actor | Action | Expected |
|------|-------|--------|----------|
| 1 | Consultant | Login | See company selector |
| 2 | Consultant | Select Company A | View Company A data |
| 3 | Consultant | Generate OKRs | OKRs for Company A |
| 4 | Consultant | Switch to Company B | Context changes |
| 5 | Consultant | Compare companies | Analytics comparison view |

---

## 11. Performance Tests

| ID | Scenario | Threshold | Priority |
|----|----------|-----------|----------|
| PERF-001 | Load 100 objectives | < 2 seconds | P1 |
| PERF-002 | Generate plan (12 weeks) | < 10 seconds | P1 |
| PERF-003 | Dashboard with 50 tasks | < 1 second | P0 |
| PERF-004 | Progress cascade update | < 500ms | P0 |
| PERF-005 | AI objective generation | < 30 seconds | P1 |

---

## 12. Security Tests

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| SEC-001 | XSS in objective title | Escaped, not executed |
| SEC-002 | SQL injection in search | Blocked, error logged |
| SEC-003 | CSRF on task update | Token required |
| SEC-004 | Direct API without auth | 401 Unauthorized |
| SEC-005 | Role escalation attempt | 403 Forbidden |
| SEC-006 | Tampered JWT | Session invalidated |

---

## 13. Test Data Requirements

### Minimum Dataset for Full E2E

```javascript
{
  companies: 2, // For multi-tenant testing
  usersPerCompany: {
    EXECUTIVE: 1,
    MANAGER: 2,
    EMPLOYEE: 10,
    CONSULTANT: 1 // Shared across companies
  },
  objectives: 5,
  krsPerObjective: 4,
  goalsPerKR: {
    quarterly: 4,
    weekly: 12
  },
  tasksPerWeeklyGoal: 5
}

// Total: ~1200 tasks for complete testing
```

---

## 14. Regression Test Suite

### Smoke Tests (5 min) - Run Every Deploy

```
1. Login works
2. Dashboard loads
3. Objectives page loads
4. Create objective works
5. Complete task works
```

### Sanity Tests (15 min) - Run Daily

```
1. All smoke tests
2. AI generation works
3. Plan generation works
4. Progress cascade works
5. Role permissions work
```

### Full Regression (1 hour) - Run Pre-Release

```
All tests in this document
```

---

## 15. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2, 2025 | Initial comprehensive plan |

---

*This document covers the complete OKR lifecycle testing. For feature-specific tests, see [MASTER_TEST_PLAN.md](./MASTER_TEST_PLAN.md).*
