# Sprint 13: Task Management Refix Epic (PP)

**Created**: February 21, 2026
**Updated**: February 21, 2026
**Status**: IMPLEMENTED - Pending Testing
**Points**: 13 (estimated)
**Priority**: P0 - Critical Bug Fixes

---

## Executive Summary

Task management across the application has several critical bugs preventing core functionality:

### Planning Page Issues:
- Task assignment/reassignment silently fails
- Task creation fails due to missing required field
- Deleted tasks still visible after deletion
- Owner inheritance not implemented across OKR hierarchy

### Dashboard Issues:
- Tasks show "Untitled Task" (field name mismatch: `name` vs `title`)
- "?" badges for assignee (assigned_to not populated)
- "-1 days ago" / "-2 days ago" for future tasks (formatRelativeTime bug)
- Inconsistent data structures between API and frontend

This epic addresses ALL task management issues across both pages with a systematic approach.

---

## OKR Hierarchy Understanding

### The 4-Level Cascade

```
Level 1: OBJECTIVE (Company-wide strategic goal)
├── Owner: owner_id (required)
├── Contains: Embedded Key Results array
├── Period: Year (calendar/fiscal/custom)
└── Example: "Increase Revenue by 30%"

    └── Level 2: KEY RESULT (Measurable outcome)
        ├── Owner: owner_id (optional, can differ from parent)
        ├── Embedded in: Objective.key_results[]
        ├── Period: Quarter
        └── Example: "Achieve $500K in new contracts by Q2"

            └── Level 3: GOAL (Weekly milestones)
                ├── Owner: owner_id (required)
                ├── Types: QUARTERLY (parent) → WEEKLY (children)
                ├── Period: Week 1-13 per quarter
                └── Example: "Week 3: Identify 10 qualified leads"

                    └── Level 4: TASK (Daily actions)
                        ├── Assignee: assigned_to (required, single user)
                        ├── Status: todo, in_progress, completed, deferred, cancelled
                        └── Example: "Research competitor pricing models"
```

### Owner Field Names

| Level | Field Name | Type | Required | Notes |
|-------|------------|------|----------|-------|
| Objective | `owner_id` | ObjectId → User | YES | Single owner |
| Key Result | `owner_id` | ObjectId → User | NO | Can differ from parent |
| Goal | `owner_id` | ObjectId → User | YES | Single owner |
| Task | `assigned_to` | ObjectId → User | YES | Single assignee (different field name!) |

### Current Owner Inheritance (BROKEN)

```
When creating via AI generation:
┌─────────────────────────────────────────────────────────────┐
│ Objective.owner_id = req.user.id (or specified)            │
│     ↓ NOT INHERITED                                         │
│ KeyResult.owner_id = explicit OR objective.owner_id OR user │
│     ↓ NOT INHERITED                                         │
│ Goal.owner_id = req.user.id (always current user)          │
│     ↓ NOT INHERITED                                         │
│ Task.assigned_to = req.user.id (always current user)       │
└─────────────────────────────────────────────────────────────┘

PROBLEM: Each level defaults to current user, not parent owner.
         Hierarchy ownership is fragmented.
```

---

## Issues Identified

### Issue PP1: Task Reassignment Fails (CRITICAL)

**Symptom**: Clicking reassign dropdown, selecting team member shows success toast, but task still shows "Unassigned"

**Root Cause**: Backend `PUT /api/tasks/:id` does not include `assigned_to` in `allowedUpdates` whitelist

**Location**: `server/routes/tasks.js` lines 240-252

```javascript
// CURRENT (broken)
const allowedUpdates = [
    'name', 'description', 'due_date', 'priority', 'status',
    'progress', 'estimated_hours', 'actual_hours', 'difficulty',
    'tags', 'labels'
    // MISSING: 'assigned_to'
];
```

**Fix**: Add `'assigned_to'` to the `allowedUpdates` array

**Impact**: Blocks all task reassignment functionality

---

### Issue PP2: Manual Task Creation Fails (CRITICAL)

**Symptom**: Clicking "+ Add Task", entering title, submitting results in error

**Root Cause**: Frontend `submitAddTask()` doesn't send `assigned_to` field, but backend requires it

**Location**: `client/pages/scripts/planning-v2.js` lines 934-942

```javascript
// CURRENT (broken)
const taskData = {
    name: title,
    title: title,
    goal_id: goalId,
    objective_id: goal.objective_id || selectedObjectiveId,
    due_date: goal.end_date || goal.due_date,
    status: 'todo',
    priority: 'medium'
    // MISSING: assigned_to
};
```

**Backend Requirement**: `server/routes/tasks.js` line 99 validates:
```javascript
if (!goal_id || !objective_id || !name || !assigned_to || !due_date) {
    return res.status(400).json({ message: 'Missing required fields...' });
}
```

**Fix**: Add `assigned_to` field with owner inheritance:
```javascript
assigned_to: goal.owner_id?._id || goal.owner_id || currentUser._id
```

---

### Issue PP3: Deleted Tasks Still Visible (CRITICAL)

**Symptom**: After deleting a task, it still appears in the task list

**Root Cause**: Frontend `loadTasksForGoals()` doesn't filter out `status: 'cancelled'` tasks

**Location**: `client/pages/scripts/planning-v2.js` line 227

```javascript
// CURRENT (broken)
const response = await fetch(`/api/tasks?goal_id=${goal._id}`, {...});
// Returns ALL tasks including cancelled ones
```

**Backend Behavior**: `DELETE /api/tasks/:id` sets `status = 'cancelled'` (soft delete)

**Fix Options**:
1. **Frontend filter**: Filter out cancelled in `loadTasksForGoals()`
2. **Backend default**: Exclude cancelled unless explicitly requested
3. **Query param**: Add `status=!cancelled` to query

**Recommended**: Frontend filter (least invasive, maintains backwards compatibility)

---

### Issue PP4: Tasks Display "Unassigned" (SYMPTOM)

**Symptom**: All tasks show "Unassigned" even when they should have owners

**Root Cause**: This is a SYMPTOM of Issue PP1 and PP2:
- Tasks created without `assigned_to` (PP2)
- Task reassignment silently fails (PP1)

**Resolution**: Fixes to PP1 and PP2 will resolve this automatically

---

### Issue PP5: Postpone Status Not Persisting (MEDIUM)

**Symptom**: Clicking postpone shows success toast but task may not visually update

**Root Cause**: Possible async timing issue or missing re-render

**Location**: `client/pages/scripts/planning-v2.js` lines 714-743

```javascript
// Current implementation looks correct
await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'deferred' })  // ✓ 'status' IS in allowedUpdates
});
```

**Investigation Needed**: Verify `status` update actually persists and re-render happens

---

### Issue PP6: Owner Inheritance Not Implemented (ENHANCEMENT)

**Current State**: Each level independently assigns owner to current user

**Desired State**: Cascade owner from parent when not explicitly specified

```
DESIRED INHERITANCE FLOW:
┌─────────────────────────────────────────────────────────────┐
│ Objective.owner_id = specified OR req.user.id              │
│     ↓ INHERITS                                              │
│ KeyResult.owner_id = specified OR Objective.owner_id       │
│     ↓ INHERITS                                              │
│ Goal.owner_id = specified OR KeyResult.owner_id            │
│     ↓ INHERITS                                              │
│ Task.assigned_to = specified OR Goal.owner_id              │
└─────────────────────────────────────────────────────────────┘
```

**Implementation Points**:
1. AI generation endpoints should cascade owner
2. Manual creation forms should default to parent owner
3. Backend should allow but not require explicit owner if parent exists

---

## Dashboard-Specific Issues

### Issue PP7: "Untitled Task" Display (CRITICAL)

**Symptom**: All tasks on dashboard show "Untitled Task" instead of actual task names

**Root Cause**: Field name mismatch between backend and frontend
- Task model uses `name` field
- Dashboard frontend expects `title` field

**Location**: `client/pages/scripts/dashboard-v2.js` line 401

```javascript
// CURRENT (broken)
const title = window.KarviaCommon?.escapeHtml?.(task.title) || task.title || 'Untitled Task';
// task.title is undefined, so falls back to 'Untitled Task'
```

**Task Model** (`server/models/Task.js` lines 32-37):
```javascript
name: {
    type: String,
    required: true,
    // ...
}
// NO 'title' field exists!
```

**Fix**: Use `task.name` instead of `task.title`:
```javascript
const title = window.KarviaCommon?.escapeHtml?.(task.name || task.title) || task.name || task.title || 'Untitled Task';
```

---

### Issue PP8: "?" Badge for Assignees (CRITICAL)

**Symptom**: All tasks show "?" instead of assignee initials

**Root Cause**: `assigned_to` field not populated in API responses

**Location**:
- `server/routes/tasks.js` line 759-761 (`/api/tasks/my/tasks` endpoint)
- `client/pages/scripts/dashboard-v2.js` lines 421-423

**API Query** (broken):
```javascript
// /api/tasks/my/tasks
const tasks = await Task.findByAssignee(company_id, user_id, status)
    .populate('goal_id', 'name quarter week')
    .populate('objective_id', 'title category');
    // MISSING: .populate('assigned_to', 'name first_name last_name')
```

**Frontend** (expects populated data):
```javascript
const assignee = task.assigned_to?.user_id || task.assigned_to;
const assigneeName = assignee?.name || assignee?.first_name || '';
const assigneeInitials = assigneeName ? getInitials(assigneeName) : '?';
// assigneeName is empty → shows '?'
```

**Fix Options**:
1. **Backend**: Always populate `assigned_to` in task queries
2. **Frontend**: For "my tasks", use current user's info (since assigned_to = current user)

**Recommended**: Combination - populate on backend AND fallback to current user on frontend

---

### Issue PP9: "-1 days ago" / "-2 days ago" Display (MEDIUM)

**Symptom**: Future tasks show "-1 days ago" or "-2 days ago" instead of proper future dates

**Root Cause**: `formatRelativeTime()` doesn't handle future dates (negative diff)

**Location**: `client/pages/scripts/dashboard-v2.js` lines 175-185

```javascript
// CURRENT (broken)
function formatRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;  // ❌ Returns "-1 days ago" for tomorrow!
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

**Problem**: When `date` is in the future:
- `diffMs = now - date` is NEGATIVE
- `diffDays = -1` for tomorrow → outputs `"-1 days ago"`

**Fix**:
```javascript
function formatRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Handle past dates
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

    // Handle future dates (negative diffDays)
    if (diffDays === -1) return 'Tomorrow';
    if (diffDays < -1 && diffDays > -7) return `In ${Math.abs(diffDays)} days`;

    // Default to formatted date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

---

## Cross-Page Consistency Matrix

| Field | Task Model | Planning Page | Dashboard | Status |
|-------|------------|---------------|-----------|--------|
| Task name | `name` | `task.title \|\| task.name` | `task.title` | ❌ MISMATCH |
| Goal name | `name` | `goal.name` | `goal.title` | ❌ MISMATCH |
| Assignee | `assigned_to` (ObjectId) | Populated | NOT Populated | ❌ INCONSISTENT |
| Due date format | Date object | `formatShortDate()` | `formatRelativeTime()` | ⚠️ Different |
| Status filter | All statuses | No filter | No filter | ⚠️ Both show cancelled |

---

## Fix Plan

### PP1: Add assigned_to to Backend allowedUpdates (2 pts)

**File**: `server/routes/tasks.js`

**Change**:
```javascript
const allowedUpdates = [
    'name',
    'description',
    'due_date',
    'priority',
    'status',
    'progress',
    'estimated_hours',
    'actual_hours',
    'difficulty',
    'tags',
    'labels',
    'assigned_to'  // ADD THIS
];
```

**RBAC Consideration**: Only MANAGER+ should be able to reassign tasks (already handled by route-level auth)

**Testing**:
- [ ] Reassign task via dropdown
- [ ] Verify database updated
- [ ] Verify UI reflects new assignee

---

### PP2: Add Owner Inheritance to Task Creation (2 pts)

**File**: `client/pages/scripts/planning-v2.js`

**Change in `submitAddTask()`**:
```javascript
const taskData = {
    name: title,
    title: title,
    goal_id: goalId,
    objective_id: goal.objective_id || selectedObjectiveId,
    due_date: goal.end_date || goal.due_date,
    status: 'todo',
    priority: 'medium',
    // OWNER INHERITANCE: Use goal owner, fallback to current user
    assigned_to: goal.owner_id?._id || goal.owner_id || currentUser._id
};
```

**Also update AI task generation** in `generateWeekTasks()` to inherit owner

**Testing**:
- [ ] Add task via form
- [ ] Verify task.assigned_to = goal.owner_id
- [ ] Verify task displays with correct owner

---

### PP3: Filter Cancelled Tasks (1 pt)

**File**: `client/pages/scripts/planning-v2.js`

**Option A - Query Parameter (RECOMMENDED)**:
```javascript
// In loadTasksForGoals(), line 227
const response = await fetch(`/api/tasks?goal_id=${goal._id}&status=todo,in_progress,completed,deferred,blocked`, {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

**Option B - Frontend Filter**:
```javascript
// After line 232
goal.tasks = extractData(data).filter(t => t.status !== 'cancelled') || [];
```

**Testing**:
- [ ] Delete a task
- [ ] Verify it disappears from list
- [ ] Verify backend still has it (soft delete preserved)

---

### PP4: Verify Postpone Functionality (1 pt)

**File**: `client/pages/scripts/planning-v2.js`

**Verification Steps**:
1. Check `postponeTask()` sends correct request
2. Check backend accepts `status: 'deferred'`
3. Check `renderTaskItem()` shows "Postponed" badge for deferred
4. Check refresh properly re-fetches and re-renders

**Current Code Review**:
- Lines 714-743: `postponeTask()` looks correct
- Line 552: `const isDeferred = task.status === 'deferred';` - correct check
- Line 598: Shows deferred badge - correct

**Potential Issue**: If cancelled tasks are in the list, progress calculation is wrong (line 247)

**Fix**: Also filter deferred from progress calculation or handle appropriately

---

### PP5: Owner Inheritance Cascade (2 pts)

**Files to Modify**:
1. `server/routes/planning.js` - AI generation
2. `client/pages/scripts/planning-v2.js` - Manual creation

**Backend - Weekly Plan Generation** (`/api/planning/generate-weekly-plan`):
```javascript
// When creating goals, inherit from KR owner
const ownerForGoals = keyResult.owner_id || objective.owner_id || req.user.id;

// When creating tasks, inherit from goal owner
const ownerForTasks = goal.owner_id || ownerForGoals;
```

**Backend - Task Generation** (`/api/planning/generate-tasks`):
```javascript
// Inherit from parent goal
assigned_to: goal.owner_id || req.user.id
```

**Frontend - submitAddTask()**:
```javascript
// Already addressed in PP2
```

---

### PP7: Fix Dashboard Task Title Display (1 pt)

**File**: `client/pages/scripts/dashboard-v2.js`

**Change in `renderTaskRow()`** (line 401):
```javascript
// BEFORE (broken):
const title = window.KarviaCommon?.escapeHtml?.(task.title) || task.title || 'Untitled Task';

// AFTER (fixed):
const title = window.KarviaCommon?.escapeHtml?.(task.name || task.title) ||
              task.name || task.title || 'Untitled Task';
```

**Testing**:
- [ ] Tasks show actual names instead of "Untitled Task"
- [ ] Both `name` and `title` fields work

---

### PP8: Fix Dashboard Assignee Display (1 pt)

**Files to Modify**:
1. `server/routes/tasks.js` - Add populate to API
2. `client/pages/scripts/dashboard-v2.js` - Add fallback logic

**Backend Fix** (Add to `findByAssignee` static or route):
```javascript
// In /api/tasks/my/tasks route
const tasks = await Task.findByAssignee(company_id, user_id, status)
    .populate('goal_id', 'name quarter week')
    .populate('objective_id', 'title category')
    .populate('assigned_to', 'name first_name last_name');  // ADD THIS
```

**Frontend Fallback** (use current user for "my tasks"):
```javascript
// In renderTaskRow()
const assignee = task.assigned_to?.user_id || task.assigned_to;
const assigneeName = assignee?.name || assignee?.first_name ||
                     currentUser?.name || currentUser?.first_name || '';
const assigneeInitials = assigneeName ? getInitials(assigneeName) : '?';
```

**Testing**:
- [ ] Tasks show user initials instead of "?"
- [ ] Hover shows full name

---

### PP10: "Untitled Goal" Display (CRITICAL)

**Symptom**: All weekly goals on dashboard show "Untitled Goal" instead of actual goal names

**Root Cause**: Same as PP7 - field name mismatch between backend and frontend
- Goal model uses `name` field
- Dashboard frontend expects `title` field

**Location**: `client/pages/scripts/dashboard-v2.js` line 500 (`renderGoalRow()`)

```javascript
// CURRENT (broken):
const title = window.KarviaCommon?.escapeHtml?.(goal.title) || goal.title || 'Untitled Goal';
// goal.title is undefined, so falls back to 'Untitled Goal'
```

**Fix**: Use `goal.name` instead of `goal.title`:
```javascript
const title = window.KarviaCommon?.escapeHtml?.(goal.name || goal.title) ||
              goal.name || goal.title || 'Untitled Goal';
```

**Testing**:
- [ ] Goals show actual names instead of "Untitled Goal"
- [ ] Both `name` and `title` fields work

---

### PP9: Fix Dashboard Date Display (1 pt)

**File**: `client/pages/scripts/dashboard-v2.js`

**Change `formatRelativeTime()`** (lines 175-185):
```javascript
function formatRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Handle today
    if (diffDays === 0) return 'Today';

    // Handle past dates (positive diffDays)
    if (diffDays === 1) return '1 day ago';
    if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

    // Handle future dates (negative diffDays)
    if (diffDays === -1) return 'Tomorrow';
    if (diffDays < -1 && diffDays > -7) return `In ${Math.abs(diffDays)} days`;

    // Default to formatted date for far dates
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

**Testing**:
- [ ] Today shows "Today"
- [ ] Yesterday shows "1 day ago"
- [ ] Tomorrow shows "Tomorrow"
- [ ] Future shows "In X days"
- [ ] Far dates show "Feb 25" format

---

## Implementation Order (Dependency-Driven)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: UNBLOCK CORE OPERATIONS (3 pts)    [PLANNING]     │
├─────────────────────────────────────────────────────────────┤
│  PP1: Add assigned_to to allowedUpdates        [BACKEND]    │
│       ↓ unblocks reassignment                               │
│  PP2: Add assigned_to to submitAddTask()       [FRONTEND]   │
│       ↓ enables task creation                               │
│  PP3: Filter cancelled tasks                   [FRONTEND]   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: DASHBOARD FIXES (4 pts)             [DASHBOARD]   │
├─────────────────────────────────────────────────────────────┤
│  PP7: Fix task.name vs task.title              [FRONTEND]   │
│  PP10: Fix goal.name vs goal.title             [FRONTEND]   │
│  PP8: Populate assigned_to in API              [BACKEND]    │
│  PP9: Fix formatRelativeTime for future        [FRONTEND]   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: VERIFY & ENHANCE (3 pts)           [FULL STACK]   │
├─────────────────────────────────────────────────────────────┤
│  PP4: Verify postpone functionality            [FRONTEND]   │
│  PP5: Implement owner inheritance cascade      [FULL STACK] │
│  PP6: Cross-page consistency validation        [BOTH]       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: TESTING (3 pts)                                   │
├─────────────────────────────────────────────────────────────┤
│  Full E2E testing of all task operations:                   │
│  Planning Page:                                              │
│  - Create task (manual)                                     │
│  - Assign/reassign task                                     │
│  - Postpone task                                            │
│  - Delete task                                              │
│  - AI generate tasks with owner inheritance                 │
│                                                              │
│  Dashboard:                                                 │
│  - Tasks display correct names                              │
│  - Tasks display correct assignee initials                  │
│  - Tasks display correct due dates                          │
│  - Complete/postpone/reassign from dashboard                │
└─────────────────────────────────────────────────────────────┘
```

**Total Points**: 13 (Planning: 5, Dashboard: 4, Enhancement: 2, Testing: 2)

---

## User Journey Validation

### After Fixes, User Can:

1. **View Planning Page**
   - See all weekly goals with correct owner
   - See all tasks with correct assignee (not "Unassigned")
   - Cancelled tasks NOT shown

2. **Add Task Manually**
   - Enter title → Submit
   - Task created with owner inherited from weekly goal
   - Task appears in list immediately

3. **Reassign Task**
   - Click assign button
   - Select team member from dropdown
   - Task updates to show new assignee
   - Database reflects change

4. **Postpone Task**
   - Click postpone button
   - Task shows "Postponed" badge
   - Task grayed out but visible
   - Removed from progress calculation

5. **Delete Task**
   - Click delete button
   - Confirm in modal
   - Task disappears from list
   - Backend soft-deletes (status='cancelled')

6. **Generate AI Tasks**
   - Click "Generate Tasks"
   - AI creates tasks
   - Each task assigned to weekly goal owner (inheritance)
   - Tasks appear in list with correct assignee

---

## Files Modified

| File | Changes | Lines |
|------|---------|-------|
| `server/routes/tasks.js` | Add `assigned_to` to allowedUpdates | ~5 |
| `client/pages/scripts/planning-v2.js` | Add owner inheritance to submitAddTask, filter cancelled | ~15 |
| `server/routes/planning.js` | Add owner cascade to AI generation | ~10 |

**Total Estimated Changes**: ~30 lines

---

## Acceptance Criteria

### PP1: Task Reassignment
- [ ] Backend accepts `assigned_to` in PUT request
- [ ] Task.assigned_to updates in database
- [ ] Frontend shows new assignee after reassignment
- [ ] Toast confirms "Task assigned to [name]"

### PP2: Task Creation with Inheritance
- [ ] submitAddTask sends `assigned_to` field
- [ ] New task inherits owner from weekly goal
- [ ] Task appears in list with correct assignee
- [ ] Toast confirms "Task added successfully"

### PP3: Cancelled Tasks Hidden
- [ ] Deleted tasks no longer appear in list
- [ ] Progress calculation excludes cancelled tasks
- [ ] Backend soft delete preserved

### PP4: Postpone Works
- [ ] Postponed tasks show "Postponed" badge
- [ ] Postponed tasks excluded from progress %
- [ ] Postpone button hidden for already-postponed tasks

### PP5: Owner Inheritance
- [ ] AI-generated tasks inherit goal owner
- [ ] AI-generated goals inherit KR/Objective owner
- [ ] Manual tasks inherit goal owner

---

## Testing Checklist

### Manual Testing

```
[ ] Navigate to Planning Page
[ ] Select Objective → Select KR
[ ] Verify weekly goals load with owners

TASK CRUD:
[ ] Add task via form → Verify shows with owner
[ ] Edit task title → Verify saves
[ ] Reassign task → Verify updates
[ ] Postpone task → Verify badge shows
[ ] Delete task → Verify disappears

AI GENERATION:
[ ] Generate weekly goals → Verify owner set
[ ] Generate tasks → Verify inherit from goal
```

### E2E Tests to Add

```typescript
// tests/sprint13/02-planning-page-crud.spec.ts
test('PP1: Task reassignment works', async () => {
  // Login as manager
  // Navigate to planning page
  // Click assign on a task
  // Select team member
  // Verify task shows new assignee
});

test('PP2: Manual task creation with inheritance', async () => {
  // Navigate to planning page
  // Click "+ Add Task"
  // Enter title, submit
  // Verify task created with goal owner
});

test('PP3: Deleted tasks hidden', async () => {
  // Create a task
  // Delete task
  // Verify task not visible
});
```

---

## Sprint 13 Integration

This epic adds to Sprint 13 progress:

| Epic | Points | Status |
|------|--------|--------|
| X - Unified LLM Context | 42 | Complete |
| **PP - Planning Page Refix** | **8** | **NEW** |
| U2 - Objectives Redesign | 5 | Not Started |
| V - SSI Report Redesign | 6 | Not Started |
| O - SSI Intelligence | 12 | Not Started |
| T - Design System | 5 | Not Started |
| BF - Bug Fixes | 2 | Not Started |
| **Total** | **80** | 42/80 pts |

---

## References

- Investigation Agent ID: a552d9c (Task CRUD analysis)
- Data Model Agent ID: a66a610 (OKR hierarchy)
- LLM Integration Agent ID: a69de65 (AI generation)
- Frontend Journey Agent ID: a886b13 (User journeys)

---

**Document Version**: 1.0
**Last Updated**: February 21, 2026
**Author**: Claude Code
