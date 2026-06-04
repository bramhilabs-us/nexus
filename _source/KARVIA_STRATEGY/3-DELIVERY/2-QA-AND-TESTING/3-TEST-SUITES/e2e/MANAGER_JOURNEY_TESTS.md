# Manager Journey Tests

**Version**: 1.0.0
**Last Updated**: February 16, 2026
**Persona**: MANAGER (Team Lead)
**Journey Duration**: Weekly planning and team management workflow

---

## Overview

The Manager journey focuses on team planning, goal creation, and task assignment. This test suite validates the manager experience from planning through team coordination.

---

## Journey Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MANAGER JOURNEY FLOW                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│  │  LOGIN  │───▶│DASHBOARD│───▶│ PLANNING│───▶│ GENERATE│             │
│  │         │    │ + TEAM  │    │  PAGE   │    │  GOALS  │             │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘             │
│       │              │              │              │                   │
│       ▼              ▼              ▼              ▼                   │
│  [Team View]   [My Tasks +    [KR Selection] [AI Weekly               │
│               Team Tasks]                     Goals]                   │
│                                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│  │ GENERATE│───▶│ ASSIGN  │───▶│ MONITOR │───▶│ ADJUST  │             │
│  │  TASKS  │    │  TASKS  │    │ PROGRESS│    │ WORKLOAD│             │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Login & Team Dashboard

### MJ-P1-001: Manager Login

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to login page | Login form displays | [ ] |
| 2 | Enter manager credentials | Credentials accepted | [ ] |
| 3 | Click Login | Dashboard loads | [ ] |
| 4 | Verify team view enabled | Team tab visible | [ ] |
| 5 | Verify reassignment enabled | Reassign buttons visible | [ ] |

**Manager Capabilities Verified**:
- [ ] Can see team members' tasks
- [ ] Can reassign tasks
- [ ] Can generate weekly goals
- [ ] Can generate tasks
- [ ] Cannot create objectives (Executive+)

### MJ-P1-002: Team Dashboard View

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View Dashboard | Dashboard loads | [ ] |
| 2 | See own tasks | Personal tasks in columns | [ ] |
| 3 | Toggle to Team View | Team member list | [ ] |
| 4 | See team members | All direct reports | [ ] |
| 5 | See team task counts | Task counts per member | [ ] |
| 6 | See workload distribution | Visual indicators | [ ] |

---

## Phase 2: Planning & Goals

### MJ-P2-001: Access Planning Page

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Planning | Two-panel layout | [ ] |
| 2 | See objectives row | Company objectives | [ ] |
| 3 | See KRs for objectives | KR cards | [ ] |
| 4 | See weekly goals per KR | Goal list | [ ] |
| 5 | See tasks per goal | Task count | [ ] |

### MJ-P2-002: Generate Weekly Goals

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select objective | KRs appear in sidebar | [ ] |
| 2 | Select KR | Weekly goals section | [ ] |
| 3 | Click "Generate Weekly Goals" | Modal opens | [ ] |
| 4 | Select start week | Date picker | [ ] |
| 5 | Select week count (4) | 4 weeks selected | [ ] |
| 6 | Click Generate | AI processing | [ ] |
| 7 | Wait for results | 4 goal suggestions | [ ] |
| 8 | View AI reasoning | Reasoning panel (X9) | [ ] |
| 9 | Edit goal title | Inline edit works | [ ] |
| 10 | Approve 3 goals | 3 selected | [ ] |
| 11 | Reject 1 with reason | Reason modal | [ ] |
| 12 | Select "not_aligned" | Reason saved | [ ] |
| 13 | Click "Create Selected" | Goals created | [ ] |
| 14 | Verify in KR section | 3 new goals visible | [ ] |

**Context Verification**:
- [ ] AI received objective context
- [ ] AI received KR target
- [ ] AI received SSI scores
- [ ] AI received existing goals

### MJ-P2-003: Edit Weekly Goals

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select existing goal | Goal details expand | [ ] |
| 2 | Click Edit | Edit modal | [ ] |
| 3 | Change title | Title updates | [ ] |
| 4 | Change week | Week validates | [ ] |
| 5 | Save changes | Goal updated | [ ] |

---

## Phase 3: Task Generation & Assignment

### MJ-P3-001: Generate Tasks

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Select weekly goal | Goal highlighted | [ ] |
| 2 | Click "Generate Tasks" | AI processing | [ ] |
| 3 | Wait for results | Task suggestions | [ ] |
| 4 | View AI reasoning | Context shown | [ ] |
| 5 | Verify SSI in context | Tasks address weaknesses | [ ] |
| 6 | Verify history in context | Patterns from 1-year | [ ] |
| 7 | Edit task title | Inline edit | [ ] |
| 8 | Approve tasks | Tasks selected | [ ] |
| 9 | Click "Create Tasks" | Tasks created | [ ] |

**Context Accumulation Verification**:
```
Task generation context includes:
- Company profile
- SSI 12-block scores
- Current objective
- Current KR
- Current weekly goal
- Existing tasks (avoid duplicates)
- 1-year task history
- Previous rejection reasons
```

### MJ-P3-002: Assign Tasks to Team

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View generated tasks | Tasks listed | [ ] |
| 2 | Click "Assign" on task | Team member dropdown | [ ] |
| 3 | See team members | Only own team visible | [ ] |
| 4 | Select team member | Assignment saves | [ ] |
| 5 | Verify task appears in member's list | Dashboard shows | [ ] |
| 6 | Bulk assign 3 tasks | Multi-select | [ ] |
| 7 | Assign to same person | All 3 assigned | [ ] |

### MJ-P3-003: Reassign Tasks

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View team member's tasks | Task list | [ ] |
| 2 | Identify overloaded member | High task count | [ ] |
| 3 | Click "Reassign" | Team dropdown | [ ] |
| 4 | Select different member | Task moves | [ ] |
| 5 | Verify workload balance | Counts update | [ ] |

---

## Phase 4: Team Monitoring

### MJ-P4-001: Monitor Team Progress

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | View Team Dashboard | Team overview | [ ] |
| 2 | See progress by member | Individual % | [ ] |
| 3 | Identify blocked members | Low progress | [ ] |
| 4 | See overdue tasks | Overdue count | [ ] |
| 5 | Drill into member | Member's tasks | [ ] |

### MJ-P4-002: Progress Cascade

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Member completes task | Task status = complete | [ ] |
| 2 | Verify goal progress | Goal % increases | [ ] |
| 3 | Verify KR progress | KR % updates | [ ] |
| 4 | Verify objective progress | Objective % updates | [ ] |
| 5 | Real-time update | No refresh needed | [ ] |

---

## Phase 5: Workload Management

### MJ-P5-001: Adjust Workload

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Identify uneven workload | Member A: 10, B: 2 | [ ] |
| 2 | Reassign 4 tasks from A to B | Tasks move | [ ] |
| 3 | Verify new balance | A: 6, B: 6 | [ ] |
| 4 | Verify no orphan tasks | All assigned | [ ] |

### MJ-P5-002: Handle Team Member Absence

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Team member goes on leave | Tasks need reassign | [ ] |
| 2 | Bulk select member's tasks | Multi-select | [ ] |
| 3 | Reassign to other members | Tasks distributed | [ ] |
| 4 | Verify nothing dropped | All accounted for | [ ] |

---

## Phase 6: Objectives View (Limited)

### MJ-P6-001: View Objectives

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Navigate to Objectives | Page loads | [ ] |
| 2 | View company objectives | All visible | [ ] |
| 3 | Verify no "Create" button | Executive+ only | [ ] |
| 4 | Verify no "Delete" option | Executive+ only | [ ] |
| 5 | Can view KR details | Details expand | [ ] |

---

## Phase 7: Edge Cases

### MJ-P7-001: Permission Boundaries

| Action | Expected | Status |
|--------|----------|--------|
| Create objective | No button visible | [ ] |
| Delete objective | No button visible | [ ] |
| Assign to other team | Only own team in dropdown | [ ] |
| Access other team's tasks | 403 or not visible | [ ] |

### MJ-P7-002: Generation Edge Cases

| Scenario | Expected | Status |
|----------|----------|--------|
| Generate goals for completed KR | Warning shown | [ ] |
| Generate tasks with no SSI data | Uses default context | [ ] |
| All suggestions rejected | Can regenerate | [ ] |
| Duplicate goal names | AI avoids duplicates | [ ] |

### MJ-P7-003: Error Handling

| Scenario | Expected | Status |
|----------|----------|--------|
| AI service down | Error message + manual fallback | [ ] |
| Network failure mid-assign | Retry option | [ ] |
| Concurrent reassignment | Last write wins or warning | [ ] |

---

## Full Journey Test Execution

### Weekly Planning Session (45 min)

| # | Test Case | Duration | Status |
|---|-----------|----------|--------|
| 1 | Login as Manager | 2 min | [ ] |
| 2 | Review team dashboard | 5 min | [ ] |
| 3 | Navigate to Planning | 3 min | [ ] |
| 4 | Generate weekly goals (4 weeks) | 10 min | [ ] |
| 5 | Generate tasks for each goal | 15 min | [ ] |
| 6 | Assign tasks to team | 10 min | [ ] |
| 7 | Verify team view updates | 5 min | [ ] |

### Full Journey Test (~1.5 hours)

| Phase | Test IDs | Duration | Status |
|-------|----------|----------|--------|
| P1: Login & Dashboard | MJ-P1-001, MJ-P1-002 | 10 min | [ ] |
| P2: Planning & Goals | MJ-P2-001 to MJ-P2-003 | 20 min | [ ] |
| P3: Task Gen & Assignment | MJ-P3-001 to MJ-P3-003 | 20 min | [ ] |
| P4: Team Monitoring | MJ-P4-001, MJ-P4-002 | 10 min | [ ] |
| P5: Workload Management | MJ-P5-001, MJ-P5-002 | 15 min | [ ] |
| P6: Objectives View | MJ-P6-001 | 5 min | [ ] |
| P7: Edge Cases | MJ-P7-001 to MJ-P7-003 | 15 min | [ ] |

**Total Duration**: ~95 minutes

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |

---

**Document Version**: 1.0.0
**Review Cycle**: Each sprint
