# Sprint 5 - Epic 0: Milestone-Based Planning Display
**Priority**: P1 (Display existing tasks with milestones)
**Story Points**: 8-10
**Estimated Duration**: 1.5-2 hours
**Status**: Ready for Sprint 5 Implementation

---

## 📋 Executive Summary

**Goal**: Display tasks under weekly goals (milestones) on the planning page with interactive checkboxes and auto-calculated status.

**Key Insight**: 85% already exists! Tasks are already being created and saved to database. We just need to DISPLAY them.

---

## ✅ What Already Exists

### Backend (100% Complete)
- ✅ Task model with all fields (goal_id, name, status, due_date, etc.)
- ✅ `GET /api/tasks?goal_id=xxx` - Fetch tasks for a goal
- ✅ `PUT /api/tasks/:id/status` - Update task status
- ✅ `POST /api/planning/tasks/bulk` - Bulk create tasks
- ✅ Tasks ARE created (3 per week) when user generates plan
- ✅ Tasks ARE saved to database

### Frontend (Existing Structure)
- ✅ Planning page with objective tabs
- ✅ KR cards on left panel
- ✅ "View Existing Plan" functionality
- ✅ Week cards displaying goals
- ✅ Filter system (All, In Progress, Completed, Not Planned)
- ✅ Pagination

---

## ❌ What Needs to be Added

### Changes Required (All in ONE file: `client/pages/planning.html`)

**1. Fetch tasks when viewing plan** (15 min)
- Location: Line 885 in `viewExistingPlan()` function
- Add API call to fetch tasks for each goal

**2. Calculate milestone status from tasks** (10 min)
- New function: `calculateMilestoneStatus(tasks, endDate)`
- Logic: ✅ Completed, 🟡 In Progress, 🔴 Overdue, ⏸️ Not Started

**3. Display tasks in week cards** (30 min)
- Location: Line 1077 in `renderWeekCard()` function
- Add task checkboxes with compact design
- Show progress bar (X/Y tasks complete)

**4. Task toggle functionality** (15 min)
- New function: `toggleTaskStatus(taskId, isChecked)`
- Update task status on checkbox change

**5. Update status icons** (5 min)
- Location: Line 1053 in `renderWeekCard()`
- Add overdue status: 🔴

**6. Terminology change** (2 min)
- Line 209: "📋 Weekly Goals" → "📋 Milestones"

---

## 🎯 Implementation Guide

### Step 1: Fetch Tasks (15 min)

**File**: `client/pages/planning.html`
**Location**: After line 885 in `viewExistingPlan()` function

```javascript
// EXISTING CODE (Line 878-885):
const response = await fetch(`/api/planning/goals/weekly?key_result_id=${krId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
existingGoals = data.goals || [];

// ADD THIS (after line 885):
// Fetch tasks for each goal
for (let goal of existingGoals) {
    const tasksResponse = await fetch(`/api/tasks?goal_id=${goal._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasksData = await tasksResponse.json();
    goal.tasks = tasksData.tasks || [];

    // Calculate milestone status from tasks
    goal.calculated_status = calculateMilestoneStatus(goal.tasks, goal.end_date);
}
```

---

### Step 2: Add Status Calculation Function (10 min)

**File**: `client/pages/planning.html`
**Location**: After line 928 (after `viewExistingPlan()` function)

```javascript
/**
 * Calculate milestone status based on tasks completion
 */
function calculateMilestoneStatus(tasks, endDate) {
    if (!tasks || tasks.length === 0) {
        if (endDate && new Date(endDate) < new Date()) {
            return 'overdue';  // 🔴
        }
        return 'not_started';  // ⏸️
    }

    const completedCount = tasks.filter(t =>
        t.status === 'completed' || t.status === 'done'
    ).length;

    // All tasks complete
    if (completedCount === tasks.length) {
        return 'completed';  // ✅
    }

    // Some tasks complete
    if (completedCount > 0) {
        return 'in_progress';  // 🟡
    }

    // No tasks complete, check if overdue
    if (endDate && new Date(endDate) < new Date()) {
        return 'overdue';  // 🔴
    }

    return 'not_started';  // ⏸️
}
```

---

### Step 3: Display Tasks in Week Cards (30 min)

**File**: `client/pages/planning.html`
**Location**: Line 1077-1091 in `renderWeekCard()` function

**REPLACE THIS**:
```javascript
${goal ? `
    <h4 class="font-medium text-gray-900 mb-3">${goal.title}</h4>
    <div class="bg-gray-200 rounded-full h-2 mb-3">
        <div class="progress-bar h-2 rounded-full" style="width: ${progress}%;"></div>
    </div>
    <div class="flex justify-between text-sm">
        <span class="text-gray-600">👤 ${goal.owner_name || 'Unassigned'}</span>
        <span class="text-gray-600">🎯 ${goal.target_value}</span>
        <span class="text-gray-600">📊 ${goal.current_value}</span>
    </div>
` : `
    <p class="text-gray-500 text-sm">No goal planned for this week</p>
`}
```

**WITH THIS** (compact card with tasks):
```javascript
${goal ? `
    <!-- Milestone Header -->
    <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-gray-900 text-sm">${goal.title}</h4>
        <span class="text-xs px-2 py-0.5 rounded ${status.class}">${status.label}</span>
    </div>

    <!-- Tasks List -->
    ${goal.tasks && goal.tasks.length > 0 ? `
        <div class="space-y-1 mb-3 ml-2">
            ${goal.tasks.map(task => `
                <label class="flex items-center space-x-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input type="checkbox"
                           ${task.status === 'completed' || task.status === 'done' ? 'checked' : ''}
                           onchange="toggleTaskStatus('${task._id}', this.checked)"
                           class="w-3 h-3 rounded text-purple-600">
                    <span class="${task.status === 'completed' || task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-700'} flex-1">
                        ${escapeHtml(task.name)}
                    </span>
                </label>
            `).join('')}
        </div>

        <!-- Task Progress Bar -->
        <div class="flex items-center space-x-2 text-xs">
            <div class="flex-1 h-1 bg-gray-200 rounded-full">
                <div class="h-full bg-purple-600" style="width: ${Math.round((goal.tasks.filter(t => t.status === 'completed' || t.status === 'done').length / goal.tasks.length) * 100)}%;"></div>
            </div>
            <span class="text-gray-600 font-medium">
                ${goal.tasks.filter(t => t.status === 'completed' || t.status === 'done').length}/${goal.tasks.length}
            </span>
        </div>
    ` : `
        <p class="text-gray-400 text-xs ml-2">No tasks yet</p>
    `}
` : `
    <p class="text-gray-500 text-sm">No milestone planned for this week</p>
`}
```

**ALSO ADD** escapeHtml helper (after line 1100):
```javascript
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
```

---

### Step 4: Add Task Toggle Function (15 min)

**File**: `client/pages/planning.html`
**Location**: After line 1100

```javascript
/**
 * Toggle task status between completed and pending
 */
async function toggleTaskStatus(taskId, isChecked) {
    try {
        const status = isChecked ? 'completed' : 'todo';

        const response = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Failed to update task');

        // Reload plan to reflect changes
        if (selectedKR) {
            await viewExistingPlan(selectedKR._id);
        }

    } catch (error) {
        console.error('Error toggling task:', error);
        alert('Failed to update task. Please try again.');
        event.target.checked = !isChecked;
    }
}
```

---

### Step 5: Update Status Icons (5 min)

**File**: `client/pages/planning.html`
**Location**: Line 1053-1057

**REPLACE**:
```javascript
const statusConfig = {
    in_progress: { icon: '🟠', label: 'In Progress', class: 'bg-orange-100 text-orange-700' },
    completed: { icon: '✅', label: 'Completed', class: 'bg-green-100 text-green-700' },
    not_planned: { icon: '🔵', label: 'Not Planned', class: 'bg-blue-100 text-blue-700' }
};
```

**WITH**:
```javascript
const statusConfig = {
    completed: { icon: '✅', label: 'Completed', class: 'bg-green-100 text-green-700' },
    in_progress: { icon: '🟡', label: 'In Progress', class: 'bg-yellow-100 text-yellow-700' },
    overdue: { icon: '🔴', label: 'Overdue', class: 'bg-red-100 text-red-700' },
    not_started: { icon: '⏸️', label: 'Not Started', class: 'bg-gray-100 text-gray-700' },
    not_planned: { icon: '🔵', label: 'Not Planned', class: 'bg-blue-100 text-blue-700' }
};
```

**AND UPDATE** (Line 1058):
```javascript
const status = statusConfig[goal?.calculated_status || week.status];
```

---

### Step 6: Terminology Change (2 min)

**File**: `client/pages/planning.html`
**Location**: Line 209

**CHANGE**:
```html
<h2 class="text-lg font-semibold text-gray-900 mb-6">📋 Weekly Goals</h2>
```

**TO**:
```html
<h2 class="text-lg font-semibold text-gray-900 mb-6">📋 Milestones</h2>
```

---

## 📊 Visual Result

### Before (Current):
```
┌───────────────────────────────────┐
│ Week 1: Jan 1-7                   │
│ Enroll in online course           │
│ Progress: ████░░░ 60%             │
│ 👤 John  🎯 1  📊 0.6             │
└───────────────────────────────────┘
```

### After (With Tasks):
```
┌──────────────────────────────────────┐
│ Week 1: Research course       ✅     │
│ ☑ Research top 5 platforms          │
│ ☑ Compare course options            │
│ ☑ Read instructor reviews           │
│ Progress: ███████ 3/3                │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ Week 2: Purchase course        🟡    │
│ ☑ Select course                      │
│ ☐ Make payment                       │
│ ☐ Setup account                      │
│ Progress: ██░░░░░ 1/3                │
└──────────────────────────────────────┘
```

---

## ✅ Testing Checklist

### Test Scenario 1: View Existing Plan
1. [ ] Click KR with existing milestones
2. [ ] Verify tasks display under each milestone
3. [ ] Verify task checkboxes reflect correct status
4. [ ] Verify progress bar shows correct X/Y count
5. [ ] Verify milestone status icon is correct

### Test Scenario 2: Toggle Task
1. [ ] Check task checkbox
2. [ ] Verify task status updates
3. [ ] Verify milestone status recalculates
4. [ ] Verify progress bar updates
5. [ ] Refresh page - verify status persists

### Test Scenario 3: Status Calculation
1. [ ] All tasks complete → ✅ Completed
2. [ ] Some tasks complete → 🟡 In Progress
3. [ ] No tasks complete, not overdue → ⏸️ Not Started
4. [ ] No tasks complete, overdue → 🔴 Overdue

### Test Scenario 4: Multiple Milestones
1. [ ] View plan with 4+ milestones
2. [ ] Verify all milestones display tasks
3. [ ] Toggle tasks in different milestones
4. [ ] Verify filter system still works

---

## 📝 Acceptance Criteria

- [ ] Tasks display under each milestone/weekly goal
- [ ] Task checkboxes work (mark complete/incomplete)
- [ ] Milestone status auto-calculates from task completion
- [ ] Status icons show: ✅ 🟡 🔴 ⏸️ 🔵
- [ ] Progress bar shows X/Y tasks complete
- [ ] "Weekly Goals" changed to "Milestones"
- [ ] Filter system works with new statuses
- [ ] All changes in planning.html only (no backend changes)
- [ ] No database schema changes needed
- [ ] Multi-tenant isolation maintained

---

## 🚀 Deployment Notes

### Files Changed:
- `client/pages/planning.html` - ALL changes in this ONE file

### Database Changes:
- NONE ✅

### API Changes:
- NONE (all endpoints exist) ✅

### Breaking Changes:
- NONE ✅

### Rollback Plan:
- Simple: Revert planning.html to previous version

---

## 📊 Story Points Breakdown

| Task | Points | Time |
|------|--------|------|
| Fetch tasks in viewExistingPlan() | 1 | 15 min |
| Add calculateMilestoneStatus() | 1 | 10 min |
| Update renderWeekCard() with tasks | 3 | 30 min |
| Add toggleTaskStatus() function | 1 | 15 min |
| Update status icons | 0.5 | 5 min |
| Terminology change | 0.5 | 2 min |
| Testing & validation | 2 | 30 min |
| **TOTAL** | **8-10** | **1.5-2 hours** |

---

## 🎯 Success Metrics

**User sees**:
- Clear milestone-based plan for each KR
- Tasks organized under weekly milestones
- Visual progress (X/Y tasks complete)
- Auto-calculated status (✅🟡🔴⏸️)
- Easy task completion (checkbox)

**System maintains**:
- All existing functionality
- Performance (no slow queries)
- Multi-tenant isolation
- Data integrity

---

## 📚 Related Documents

**Sprint 5 Planning**:
- This document (implementation spec)

**Archived/Reference** (not needed for implementation):
- EPIC-0-MILESTONE-BASED-PLANNING.md (original complex spec)
- MILESTONE-PLANNING-FLOW-DIAGRAMS.md (detailed visualizations)
- EPIC-0-DESIGN-AUDIT.md (audit findings)
- EPIC-0-IMPLEMENTATION-AUDIT.md (detailed audit)

---

## 🔜 Future Enhancements (Post-Sprint 5)

**Not in this epic** (separate future work):
- Enhanced AI task generation (contextual tasks)
- Drag-and-drop task reordering
- Task templates
- Bulk task operations
- Task dependencies

---

**Epic Status**: Ready for Sprint 5
**Prerequisites**: Sprint 4 complete
**Complexity**: Low (display existing data)
**Risk**: Minimal (no breaking changes)

---

**Created**: November 25, 2025
**Last Updated**: November 25, 2025
**Next Review**: Start of Sprint 5
