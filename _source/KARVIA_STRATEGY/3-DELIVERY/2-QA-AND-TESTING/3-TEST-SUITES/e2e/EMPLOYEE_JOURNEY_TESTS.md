# Employee Journey Tests

**Version**: 1.0.0
**Last Updated**: February 16, 2026
**Persona**: EMPLOYEE (End User)
**Journey Duration**: Daily task completion workflow

---

## Overview

The Employee journey focuses on task execution and daily productivity. This test suite validates the employee experience from login through task completion.

---

## Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMPLOYEE JOURNEY FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │  LOGIN  │───▶│DASHBOARD│───▶│  TASKS  │───▶│ COMPLETE│     │
│  │         │    │  VIEW   │    │  LIST   │    │  TASKS  │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│       │              │              │              │           │
│       ▼              ▼              ▼              ▼           │
│   [Login]      [My Tasks]     [Overdue,      [Progress        │
│                               Today,          Updates]        │
│                               Tomorrow]                        │
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                    │
│  │ PLANNING│───▶│  GOALS  │───▶│OBJECTIVE│                    │
│  │  VIEW   │    │  VIEW   │    │  VIEW   │                    │
│  └─────────┘    └─────────┘    └─────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Login & Dashboard

### EJ-P1-001: Employee Login

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to login page | Login form displays | [ ] |
| 2 | Enter employee credentials | Credentials accepted | [ ] |
| 3 | Click Login | Dashboard loads | [ ] |
| 4 | Verify NO company switcher | Switcher not visible | [ ] |
| 5 | Verify role-based features | Limited menu options | [ ] |

**Role Restrictions Verified**:
- [ ] No company switcher
- [ ] No "Create Objective" option
- [ ] No "Delete" buttons on tasks
- [ ] No reassignment capability

### EJ-P1-002: Dashboard Overview

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View Dashboard | Dashboard loads | [ ] |
| 2 | See task columns | Overdue, Today, Tomorrow | [ ] |
| 3 | See weekly goals | Last, This, Next week | [ ] |
| 4 | Count assigned tasks | Only own tasks visible | [ ] |
| 5 | See progress metrics | Personal progress % | [ ] |

---

## Phase 2: Task Management

### EJ-P2-001: View Task List

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View "Today" column | Today's tasks listed | [ ] |
| 2 | View "Overdue" column | Past due tasks visible | [ ] |
| 3 | View "Tomorrow" column | Tomorrow's tasks listed | [ ] |
| 4 | Expand task details | Notes, due date, goal link | [ ] |
| 5 | Verify only own tasks | No other users' tasks | [ ] |

### EJ-P2-002: Complete Task

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Find task in "Today" | Task visible | [ ] |
| 2 | Click checkbox | Task marked complete | [ ] |
| 3 | Verify visual update | Strikethrough or fade | [ ] |
| 4 | Verify task moves | To "Completed" section | [ ] |
| 5 | Check progress update | Personal % increases | [ ] |
| 6 | Check goal progress | Weekly goal % updates | [ ] |

**Progress Cascade Verification**:
```
Task completed (1/5) → Goal 20% → KR progress updates → Objective progress updates
```

### EJ-P2-003: Uncomplete Task

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Find completed task | Task in completed section | [ ] |
| 2 | Click checkbox again | Task unmarked | [ ] |
| 3 | Verify task moves back | Returns to original column | [ ] |
| 4 | Check progress rollback | Percentages decrease | [ ] |

### EJ-P2-004: Postpone Task

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Find overdue task | Task visible | [ ] |
| 2 | Click "Postpone" button | Date picker modal | [ ] |
| 3 | Select new date | Date validated | [ ] |
| 4 | Confirm postpone | Task moves to new date | [ ] |
| 5 | Verify task in new column | If tomorrow, in Tomorrow | [ ] |

---

## Phase 3: Weekly Goals View

### EJ-P3-001: View Weekly Goals

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View "This Week" section | Current goals visible | [ ] |
| 2 | See goal titles | Meaningful titles | [ ] |
| 3 | See goal progress | Percentage shown | [ ] |
| 4 | See associated tasks | Task count visible | [ ] |
| 5 | Expand goal | Tasks within goal | [ ] |

### EJ-P3-002: Goal Progress Tracking

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Note goal at 40% | 2/5 tasks done | [ ] |
| 2 | Complete 1 task | 3/5 tasks done | [ ] |
| 3 | Verify goal = 60% | Progress updated | [ ] |
| 4 | Complete all tasks | 5/5 done | [ ] |
| 5 | Verify goal = 100% | Complete indicator | [ ] |

---

## Phase 4: Planning View (Read-Only)

### EJ-P4-001: View Planning Page

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Planning | Page loads | [ ] |
| 2 | See objectives row | Company objectives | [ ] |
| 3 | Select objective | KRs load | [ ] |
| 4 | Select KR | Weekly goals visible | [ ] |
| 5 | Verify read-only | No edit buttons | [ ] |

**Employee Restrictions**:
- [ ] Cannot create objectives
- [ ] Cannot create KRs
- [ ] Cannot generate weekly goals (Manager+)
- [ ] Can only view assigned tasks

### EJ-P4-002: Understand Context

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Find own task | Task visible | [ ] |
| 2 | See parent goal | Goal title visible | [ ] |
| 3 | See parent KR | KR title visible | [ ] |
| 4 | See parent objective | Objective title visible | [ ] |
| 5 | Understand "why" | Strategic context clear | [ ] |

---

## Phase 5: Objectives View (Read-Only)

### EJ-P5-001: View Objectives

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Objectives | Page loads | [ ] |
| 2 | See company objectives | All objectives listed | [ ] |
| 3 | Use quarter filter | Filter works | [ ] |
| 4 | View objective details | KRs visible | [ ] |
| 5 | Verify no edit options | Read-only mode | [ ] |

### EJ-P5-002: Category Overview

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | See category coverage | Coverage widget | [ ] |
| 2 | Filter by category | Filter works | [ ] |
| 3 | Understand focus areas | Strategic clarity | [ ] |

---

## Phase 6: Edge Cases

### EJ-P6-001: Empty States

| Scenario | Expected | Status |
|----------|----------|--------|
| No tasks assigned | "No tasks" + context message | [ ] |
| No goals this week | "No goals" message | [ ] |
| All tasks complete | "All caught up!" message | [ ] |
| No overdue tasks | Column hidden or empty state | [ ] |

### EJ-P6-002: Error Handling

| Scenario | Expected | Status |
|----------|----------|--------|
| Network failure on complete | Error toast + retry | [ ] |
| Session expired | Redirect to login | [ ] |
| Task deleted by manager | Graceful removal | [ ] |

### EJ-P6-003: Permission Boundaries

| Action | Expected | Status |
|--------|----------|--------|
| Try to delete task | No delete button | [ ] |
| Try to reassign task | No reassign option | [ ] |
| Try to create objective | No create button | [ ] |
| Access other's task URL | 404 or 403 | [ ] |
| Access manager dashboard | 403 or redirect | [ ] |

---

## Phase 7: Assessment Participation

### EJ-P7-001: Take Assessment

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Receive assessment email | Email with link | [ ] |
| 2 | Click assessment link | Survey page loads | [ ] |
| 3 | Enter name and role | Fields validate | [ ] |
| 4 | Start assessment | Questions load | [ ] |
| 5 | Answer 15 Speed questions | Progress updates | [ ] |
| 6 | Answer 15 Strength questions | Progress updates | [ ] |
| 7 | Answer 15 Intelligence questions | Progress updates | [ ] |
| 8 | Submit assessment | Thank you page | [ ] |
| 9 | Try link again | "Already completed" | [ ] |

### EJ-P7-002: Assessment Progress Saving

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Answer 20 questions | Progress = 44% | [ ] |
| 2 | Close browser | Session saved | [ ] |
| 3 | Open link again | Resume at Q21 | [ ] |
| 4 | Complete remaining | Submit successfully | [ ] |

---

## Full Journey Test Execution

### Daily Workflow Test (30 min)

| # | Test Case | Duration | Status |
|---|-----------|----------|--------|
| 1 | Login | 2 min | [ ] |
| 2 | View Dashboard | 3 min | [ ] |
| 3 | Complete 3 tasks | 5 min | [ ] |
| 4 | Postpone 1 task | 2 min | [ ] |
| 5 | View weekly goals | 3 min | [ ] |
| 6 | View Planning (read-only) | 5 min | [ ] |
| 7 | View Objectives (read-only) | 5 min | [ ] |
| 8 | Verify permission boundaries | 5 min | [ ] |

### Full Journey Test (~1 hour)

| Phase | Test IDs | Duration | Status |
|-------|----------|----------|--------|
| P1: Login & Dashboard | EJ-P1-001, EJ-P1-002 | 10 min | [ ] |
| P2: Task Management | EJ-P2-001 to EJ-P2-004 | 15 min | [ ] |
| P3: Weekly Goals | EJ-P3-001, EJ-P3-002 | 10 min | [ ] |
| P4: Planning View | EJ-P4-001, EJ-P4-002 | 10 min | [ ] |
| P5: Objectives View | EJ-P5-001, EJ-P5-002 | 5 min | [ ] |
| P6: Edge Cases | EJ-P6-001 to EJ-P6-003 | 10 min | [ ] |
| P7: Assessment | EJ-P7-001, EJ-P7-002 | 15 min | [ ] |

**Total Duration**: ~75 minutes

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |

---

**Document Version**: 1.0.0
**Review Cycle**: Each sprint
