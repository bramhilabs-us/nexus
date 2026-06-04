# SPRINT 8 - USER STORIES

## VERSION CONTROL

**Document**: SPRINT-8-USER-STORIES.md
**Version**: 1.1.0
**Created**: 2025-12-02
**Updated**: 2025-12-02
**Sprint**: 8
**Total Story Points**: 35

**Audit Reference**: [SPRINT_7_8_TECHNICAL_AUDIT.md](../../3-DELIVERY/2-QA-AND-TESTING/SPRINT_7_8_TECHNICAL_AUDIT.md)

---

## ⚠️ AUDIT REQUIREMENTS (Must Follow)

Per the technical audit, Sprint 8 stories must follow these requirements:

| Requirement | Story | Details |
|-------------|-------|---------|
| Use `ValidationService.validateTaskDates()` | D5 | For date validation, NOT inline logic |
| Use `requireRole()` middleware | D6 | For authorization, NOT inline role check |
| Use `authenticateToken` from `authGuards.js` | All | Standard auth middleware |
| Reuse Sprint 7 patterns | All | Follow established patterns |

---

## EXECUTIVE SUMMARY

**Sprint 8 Focus**: Dashboard Task Management Redesign

**Epic Breakdown**:
| Epic | Points | Priority | Stories |
|------|--------|----------|---------|
| Epic D: Dashboard Task Management | 35 | P0 | 8 stories |
| **Total** | **35** | | **8 stories** |

**Design Principle**: UI/UX redesign only. Reuse existing EMP stories and extend with improved visual design. No functional API changes.

---

## EPIC D: DASHBOARD TASK MANAGEMENT REDESIGN (35 pts)

### Goal
Redesign the Dashboard task view with clean, detailed task cards showing full hierarchy (Why Chain), with intuitive task actions (Complete, Postpone, Reassign).

---

### Task Card Design

```
┌─────────────────────────────────────────────────────────────┐
│ ○ Complete quarterly revenue analysis                       │
│                                                             │
│   Priority: High    │    Due: Dec 5, 2025                  │
│                                                             │
│   ┌─ Why Chain ─────────────────────────────────────────┐  │
│   │ Weekly Goal: Week 3 - Financial review milestone    │  │
│   │ Quarterly Goal: Q4 Revenue Analysis                 │  │
│   │ Key Result: Increase revenue by 20%                 │  │
│   │ Objective: Financial Growth 2025                    │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   [Complete]   [Postpone]   [Reassign]                     │
└─────────────────────────────────────────────────────────────┘
```

**Card Elements**:
- Status indicator (○ todo, ◐ in progress, ✓ done, ⚠ overdue)
- Task name (clean, readable)
- Priority badge (High=red, Medium=yellow, Low=green)
- Due date (relative format: Today, Tomorrow, Dec 5)
- Why Chain section (collapsible, shows full hierarchy)
- Action buttons (Complete, Postpone, Reassign)

---

## USER STORIES

### US-S8-D1: Task Cards Redesign (5 pts)

**Extends**: EMP-008 (View Daily Tasks)

**As an** employee
**I want** to see my tasks in clean, detailed cards
**So that** I can quickly understand each task and take action

**Priority**: P0 (Core functionality)
**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria**:
- [ ] Task cards display in vertical list (mobile-first)
- [ ] Each card shows: task name, priority badge, due date
- [ ] Priority colors: High=red, Medium=yellow, Low=green
- [ ] Due date with relative format ("Today", "Tomorrow", "Dec 5")
- [ ] Overdue tasks highlighted with warning styling (red border)
- [ ] Status indicator: ○ (todo), ◐ (in progress), ✓ (done), ⚠ (overdue)
- [ ] Cards are clickable for detail view
- [ ] Loading skeleton while fetching tasks
- [ ] Empty state: "No tasks assigned to you"

**API**: GET `/api/tasks?assigned_to=me` (existing)

**Files**:
- `client/pages/dashboard.html` - Task card template
- `client/pages/scripts/dashboard.js` - Card rendering logic
- `client/css/dashboard.css` - Card styling

---

### US-S8-D2: Why Chain Display (5 pts)

**Extends**: EMP-016 (View "Why Chain" Context)

**As an** employee
**I want** to see how my task connects to company objectives
**So that** I understand the impact of my work

**Priority**: P0 (Core - Understanding context)
**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria**:
- [ ] "Why Chain" section in each task card
- [ ] Shows hierarchy: Task → Weekly Goal → Quarterly Goal → KR → Objective
- [ ] Collapsible by default (click chevron to expand)
- [ ] Each level shows title only (keep it clean)
- [ ] Visual tree line connecting levels (indentation)
- [ ] "Not linked" state if task has no parent goal
- [ ] Breadcrumb format on mobile (dropdown)

**Hierarchy Display**:
```
└─ Weekly Goal: Week 3 - Financial review
   └─ Quarterly Goal: Q4 Revenue Analysis
      └─ Key Result: Increase revenue by 20%
         └─ Objective: Financial Growth 2025
```

**API**: GET `/api/tasks/:taskId/lineage` (existing)

**Files**:
- `client/pages/dashboard.html` - Why Chain component
- `client/pages/scripts/dashboard.js` - Lineage fetch and render
- `client/css/dashboard.css` - Tree styling

---

### US-S8-D3: Complete Task Action (3 pts)

**Extends**: EMP-009 (Complete Task)

**As an** employee
**I want** to mark tasks as complete with one click
**So that** I can quickly update my progress

**Priority**: P0 (Core functionality)
**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria**:
- [ ] "Complete" button on each task card
- [ ] Click triggers immediate completion (no confirmation needed)
- [ ] API call: PUT `/api/tasks/:id` with `status: 'completed'`
- [ ] Optimistic UI: Card updates immediately
- [ ] Progress cascades to parent Weekly Goal → Quarterly Goal → KR
- [ ] Success toast: "Task completed!"
- [ ] Completed tasks show checkmark, gray out, move to bottom
- [ ] Cannot complete already-completed tasks

**API**: PUT `/api/tasks/:id` (existing, no changes)

**Files**:
- `client/pages/scripts/dashboard.js` - Complete handler
- Progress cascade handled by existing backend hooks

---

### US-S8-D4: Update Task Progress (3 pts)

**Extends**: EMP-010 (Update Task Progress)

**As an** employee
**I want** to update my task progress percentage
**So that** I can show partial completion

**Priority**: P0 (Core functionality)
**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria**:
- [ ] Progress bar visible on in-progress tasks
- [ ] Click progress bar to update (inline slider)
- [ ] Slider: 0% to 100% in 10% increments
- [ ] API call: PUT `/api/tasks/:id` with `progress: X`
- [ ] Visual update immediately
- [ ] Setting 100% auto-completes task
- [ ] Progress cascades to parent goal

**API**: PUT `/api/tasks/:id` (existing, no changes)

**Files**:
- `client/pages/scripts/dashboard.js` - Progress update handler
- `client/css/dashboard.css` - Progress bar styling

---

### US-S8-D5: Postpone Task with Date Picker (5 pts)

**NEW Story**

**As an** employee
**I want** to postpone a task to a future date
**So that** I can reschedule when I can't complete today

**Priority**: P0 (Core functionality)
**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria**:
- [ ] "Postpone" button on each task card
- [ ] Opens date picker modal
- [ ] Shows current due date for reference
- [ ] User selects new date (only future dates selectable)
- [ ] "Confirm" button saves new date
- [ ] API call: PUT `/api/tasks/:id` with `due_date: newDate`
- [ ] **Backend validation**: New date must be within parent goal's date range
- [ ] Error if date exceeds parent goal: "Date must be before [parent end date]"
- [ ] Card updates with new due date
- [ ] Success toast: "Task rescheduled to Dec 10"
- [ ] Cannot postpone completed tasks (button disabled)

**Validation Rules**:
- New date must be > today
- New date must be <= parent weekly goal's due_date
- If no parent goal, allow any future date within objective range

**API**: PUT `/api/tasks/:id` (existing, add validation)

**⚠️ AUDIT REQUIREMENT - Use ValidationService (NOT Inline Logic)**:
```javascript
// In server/routes/tasks.js - Update handler
// ✅ CORRECT - Use ValidationService
const ValidationService = require('../services/ValidationService');

if (req.body.due_date) {
  const parentGoal = await Goal.findById(task.weekly_goal_id);
  const validation = ValidationService.validateTaskDates(
    { due_date: req.body.due_date },
    parentGoal
  );
  if (!validation.valid) {
    return res.status(400).json({ error: validation.errors.join(', ') });
  }
}

// ❌ WRONG - Do NOT use inline validation
// if (newDate > parentGoal.due_date) { ... }  // This creates redundant code
```

**Files**:
- `client/pages/dashboard.html` - Date picker modal
- `client/pages/scripts/dashboard.js` - Postpone handler
- `server/routes/tasks.js` - Add validation using **ValidationService**
- `server/services/ValidationService.js` - **REUSE** existing `validateTaskDates()`

---

### US-S8-D6: Reassign Task (Manager Only) (5 pts)

**NEW Story**

**As a** manager
**I want** to reassign tasks to other team members
**So that** I can redistribute workload when needed

**Priority**: P1 (Manager feature)
**Block**: 1 (Core Execution - REQUIRED) + 2 (IAM - for role check)

**Acceptance Criteria**:
- [ ] "Reassign" button visible ONLY for managers/executives/consultants
- [ ] Employees see button hidden or disabled
- [ ] Click opens team member dropdown
- [ ] Dropdown shows: member name, avatar, current task count
- [ ] Only shows team members from same company
- [ ] Select member → Confirm reassignment
- [ ] API call: PUT `/api/tasks/:id` with `assigned_to: userId`
- [ ] Task disappears from original assignee's dashboard
- [ ] Task appears on new assignee's dashboard
- [ ] Success toast: "Task reassigned to John Smith"
- [ ] Activity log entry created

**Role Check** (Frontend):
```javascript
// Frontend visibility check
const canReassign = ['MANAGER', 'EXECUTIVE', 'CONSULTANT'].includes(user.role);
```

**API**: PUT `/api/tasks/:id/reassign` (new endpoint with middleware)

**⚠️ AUDIT REQUIREMENT - Use requireRole() Middleware (NOT Inline Check)**:
```javascript
// In server/routes/tasks.js
const { authenticateToken } = require('../middleware/authGuards');
const { requireRole } = require('../middleware/roleGuards');

// ✅ CORRECT - Use requireRole middleware
router.put('/:id/reassign',
  authenticateToken,
  requireRole('MANAGER', 'EXECUTIVE', 'CONSULTANT'),
  async (req, res) => {
    // Role already validated by middleware
    const newAssignee = await User.findById(req.body.assigned_to);

    // Still need to verify company isolation
    if (newAssignee.company_id.toString() !== req.user.company_id.toString()) {
      return res.status(400).json({ error: 'Can only reassign to team members' });
    }

    // Proceed with reassignment...
  }
);

// ❌ WRONG - Do NOT use inline role check
router.put('/:id/reassign', authenticateToken, async (req, res) => {
  if (!['MANAGER', 'EXECUTIVE', 'CONSULTANT'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only managers can reassign tasks' });
  }
  // This is redundant and inconsistent with other routes
});
```

**Files**:
- `client/pages/dashboard.html` - Reassign modal
- `client/pages/scripts/dashboard.js` - Reassign handler, frontend role check
- `server/routes/tasks.js` - New endpoint with **requireRole()** middleware
- `server/middleware/authGuards.js` - **REUSE** existing `requireRole()` function

---

### US-S8-D7: Task Grouping by Due Date (5 pts)

**NEW Story**

**As an** employee
**I want** to see my tasks grouped by due date
**So that** I can focus on what's due soonest

**Priority**: P1 (UX enhancement)
**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria**:
- [ ] Tasks grouped into sections:
  - **Overdue** (past due date, not completed) - Always first, red header
  - **Today** (due today)
  - **Tomorrow** (due tomorrow)
  - **This Week** (due within 7 days)
  - **Later** (due after 7 days)
- [ ] Section headers show count: "Today (3)"
- [ ] Overdue section always expanded with warning styling
- [ ] Empty sections hidden (don't show "Today (0)")
- [ ] Within each section, sort by priority (High → Medium → Low)
- [ ] Collapsible sections (except Overdue)

**Grouping Logic**:
```javascript
function groupTasksByDueDate(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    overdue: tasks.filter(t => t.due_date < today && t.status !== 'completed'),
    today: tasks.filter(t => isSameDay(t.due_date, today)),
    tomorrow: tasks.filter(t => isSameDay(t.due_date, addDays(today, 1))),
    thisWeek: tasks.filter(t => isWithinDays(t.due_date, 7)),
    later: tasks.filter(t => t.due_date > addDays(today, 7))
  };
}
```

**Files**:
- `client/pages/scripts/dashboard.js` - Grouping logic
- `client/css/dashboard.css` - Section styling

---

### US-S8-D8: Task Filters & Overdue Indicators (4 pts)

**NEW Story**

**As an** employee
**I want** to filter my tasks and see overdue warnings
**So that** I can focus on priority items

**Priority**: P2 (UX enhancement)
**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria**:
- [ ] Filter bar at top of task list
- [ ] Quick filter buttons: All | Overdue | Today | High Priority
- [ ] Active filter highlighted
- [ ] Overdue tasks have red left border
- [ ] Overdue count badge on "Overdue" filter button
- [ ] Dashboard nav item shows overdue badge (red dot with count)
- [ ] Filter state persists during session (not across refresh)
- [ ] "No tasks match filter" empty state

**Filter Bar UI**:
```
┌─────────────────────────────────────────────────────────────┐
│ [All (12)] [Overdue (3)🔴] [Today (5)] [High Priority (4)]  │
└─────────────────────────────────────────────────────────────┘
```

**Files**:
- `client/pages/dashboard.html` - Filter bar
- `client/pages/scripts/dashboard.js` - Filter logic
- `client/css/dashboard.css` - Filter and overdue styling

---

## SPRINT 8 STORY SUMMARY

### By Priority

| Priority | Stories | Points |
|----------|---------|--------|
| P0 (Critical) | 5 | 21 |
| P1 (High) | 2 | 10 |
| P2 (Medium) | 1 | 4 |
| **Total** | **8** | **35** |

### Implementation Order

```
Day 1-2:
├── US-S8-D1: Task Cards Redesign (5 pts) - Foundation
└── US-S8-D2: Why Chain Display (5 pts) - Context

Day 3:
├── US-S8-D3: Complete Task Action (3 pts)
└── US-S8-D4: Update Task Progress (3 pts)

Day 4-5:
├── US-S8-D5: Postpone Task (5 pts) - With backend validation
└── US-S8-D6: Reassign Task (5 pts) - Manager role check

Day 6-7:
├── US-S8-D7: Task Grouping (5 pts)
└── US-S8-D8: Filters & Overdue (4 pts)
```

---

## RELATED BASE STORIES

These Sprint 8 stories extend/redesign the following existing stories:

| Sprint 8 Story | Base Story | Relationship |
|----------------|------------|--------------|
| US-S8-D1 | EMP-008: View Daily Tasks | Redesign UI |
| US-S8-D2 | EMP-016: View "Why Chain" Context | Integrate into cards |
| US-S8-D3 | EMP-009: Complete Task | Same functionality, new UI |
| US-S8-D4 | EMP-010: Update Task Progress | Same functionality, new UI |
| US-S8-D5 | NEW | Postpone with date picker |
| US-S8-D6 | NEW | Reassign (manager only) |
| US-S8-D7 | NEW | Grouping by due date |
| US-S8-D8 | NEW | Filters and overdue |

---

## SUCCESS CRITERIA

### Functional Criteria
- [ ] Task cards display with clean, detailed design
- [ ] Why Chain shows full hierarchy in each card
- [ ] Complete action works with progress cascade
- [ ] Postpone opens date picker, validates against parent dates
- [ ] Reassign visible only for managers
- [ ] Tasks grouped by due date (Overdue first)
- [ ] Overdue tasks highlighted with red styling
- [ ] Filters work correctly
- [ ] Mobile responsive design

### Audit Compliance Criteria
- [ ] D5 uses `ValidationService.validateTaskDates()` for date validation
- [ ] D6 uses `requireRole()` middleware (NOT inline role check)
- [ ] All new routes use `authenticateToken` from `authGuards.js`
- [ ] No new hardcoded date calculations
- [ ] All queries filter by `company_id`
- [ ] Code follows patterns established in Sprint 7

---

## DEPENDENCIES

- Sprint 7 complete (especially US-S7-BUG5 - Date Cascade fix)
- Existing task APIs functional
- Why Chain lineage API implemented

---

**Document Created**: 2025-12-02
**Version**: 1.1.0
**Sprint**: 8
**Status**: Ready for Implementation
**Last Updated**: 2025-12-02 (Added audit compliance requirements for D5, D6)
