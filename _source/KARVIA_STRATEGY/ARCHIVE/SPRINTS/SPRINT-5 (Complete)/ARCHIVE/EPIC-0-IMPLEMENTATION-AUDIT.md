# Sprint 5 Epic 0: Complete System Audit
**Date**: November 25, 2025
**Audit Type**: Comprehensive verification of existing implementation
**Conclusion**: 85% already exists - minimal changes needed

---

## ✅ What Already EXISTS and WORKS

### 1. Backend - Task API Routes (`server/routes/tasks.js`)

**VERIFIED ENDPOINTS**:
```javascript
✅ GET /api/tasks?goal_id=xxx          // Line 15 - Fetch tasks by goal
✅ POST /api/tasks                      // Line 78 - Create single task
✅ PUT /api/tasks/:id                   // Line 214 - Update task
✅ PUT /api/tasks/:id/status            // Line 284 - Update task status
✅ PUT /api/tasks/:id/complete          // Line 340 - Mark task complete
✅ PUT /api/tasks/:id/progress          // Line 393 - Update progress
```

**Task Model Fields** (verified):
- ✅ goal_id (reference to weekly goal/milestone)
- ✅ name, description
- ✅ assigned_to
- ✅ due_date
- ✅ status ('todo', 'in_progress', 'completed')
- ✅ priority ('low', 'medium', 'high')
- ✅ task_type ('action', 'review', etc.)
- ✅ company_id (multi-tenant)

### 2. Backend - Bulk Task Creation (`server/routes/planning.js:559`)

**VERIFIED ENDPOINT**:
```javascript
✅ POST /api/planning/tasks/bulk       // Creates multiple tasks for a goal
```

**How it works**:
```javascript
// Input:
{
  goal_id: "xxx",
  tasks: [
    { name: "Task 1", description: "...", due_date: "...", priority: "high" },
    { name: "Task 2", ... },
    { name: "Task 3", ... }
  ]
}

// Creates all tasks in database
// Returns: { success: true, tasks: [...] }
```

### 3. Frontend - Plan Generation (`client/pages/planning.html`)

**VERIFIED FUNCTIONS**:

**Line 580-732: `generatePlan()`**
- ✅ Generates weekly goals (milestones) based on timeline
- ✅ Automatically creates 3 tasks per week
- ✅ Tasks created with due_date distributed across week
- ✅ Shows preview before saving

**Line 733-826: `createGoals()`**
- ✅ Creates weekly goals via `/api/goals`
- ✅ Then calls `/api/planning/tasks/bulk` to create tasks
- ✅ All tasks saved to database ✅
- ✅ Success message shown

**Task Generation Example** (Line 661-679):
```javascript
const weekGoal = {
  week_number: actualWeekNumber,
  title: `Week ${actualWeekNumber} - ${selectedKR.title}`,
  tasks: [
    {
      name: `Milestone ${actualWeekNumber}: Progress towards ${selectedKR.title}`,
      description: `Main milestone for week ${actualWeekNumber}`,
      owner_id: owner,
      priority: 'high',
      due_date: task1DueDate.toISOString(),
      task_type: 'action'
    },
    {
      name: `Action item ${actualWeekNumber}.1: Review progress`,
      description: `Review and track progress for week ${actualWeekNumber}`,
      owner_id: owner,
      priority: 'medium',
      due_date: task2DueDate.toISOString()
    },
    {
      name: `Action item ${actualWeekNumber}.2: Update metrics`,
      // ... similar structure
    }
  ]
};
```

### 4. Frontend - View Existing Plan (`client/pages/planning.html`)

**VERIFIED UI COMPONENTS**:

**Line 206-262: `existingPlanView` div**
- ✅ Header: "📋 Weekly Goals" (needs: → "📋 Milestones")
- ✅ Filter buttons (All, In Progress, Completed, Not Planned)
- ✅ Goals list container (`existingGoalsList`)
- ✅ Pagination controls
- ✅ Action buttons (Edit Plan, Continue Planning, Delete Plan)

**Line 867-928: `viewExistingPlan(krId)` function**
- ✅ Fetches existing weekly goals for selected KR
- ✅ Calls `/api/planning/goals/weekly?key_result_id=${krId}`
- ✅ Generates all 12 weeks for quarter
- ✅ Merges existing goals with week structure
- ✅ Updates UI with KR context
- ❌ Does NOT fetch tasks (missing!)

**Line 1051-1100: `renderWeekCard(week)` function**
- ✅ Displays week number and date range
- ✅ Shows status icon (🟠 🔵 ✅)
- ✅ Shows progress bar
- ✅ Shows goal title, owner, target, current value
- ❌ Does NOT show tasks (missing!)

---

## ❌ What's MISSING (Gaps to Fill)

### Gap 1: Fetch Tasks in Existing Plan View

**Location**: `planning.html:867` - `viewExistingPlan()` function

**Current Code** (Line 878-885):
```javascript
// Fetch existing goals for this KR
const response = await fetch(`/api/planning/goals/weekly?key_result_id=${krId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
});

const data = await response.json();
existingGoals = data.goals || [];
```

**NEED TO ADD** (after line 885):
```javascript
// NEW: Fetch tasks for each goal
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

**Estimated Time**: 15 minutes

---

### Gap 2: Calculate Milestone Status

**Location**: `planning.html` - NEW function needed

**ADD THIS FUNCTION** (after line 928):
```javascript
/**
 * Calculate milestone status based on tasks completion
 * @param {Array} tasks - Array of task objects
 * @param {String} endDate - Milestone end date
 * @returns {String} - 'completed', 'in_progress', 'overdue', 'not_started'
 */
function calculateMilestoneStatus(tasks, endDate) {
    if (!tasks || tasks.length === 0) {
        // Check if overdue
        if (endDate && new Date(endDate) < new Date()) {
            return 'overdue';  // 🔴
        }
        return 'not_started';  // ⏸️
    }

    const completedCount = tasks.filter(t =>
        t.status === 'completed' || t.status === 'done'
    ).length;

    const totalCount = tasks.length;

    // All tasks complete
    if (completedCount === totalCount) {
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

**Estimated Time**: 10 minutes

---

### Gap 3: Display Tasks in Week Cards

**Location**: `planning.html:1051` - `renderWeekCard()` function

**Current Code** (Line 1077-1091):
```javascript
${goal ? `
    <!-- Goal Title -->
    <h4 class="font-medium text-gray-900 mb-3">${goal.title}</h4>

    <!-- Progress Bar -->
    <div class="bg-gray-200 rounded-full h-2 mb-3">
        <div class="progress-bar h-2 rounded-full" style="width: ${progress}%;"></div>
    </div>

    <!-- Meta Info (Icon-based for reduced cognitive load) -->
    <div class="flex justify-between text-sm">
        <span class="text-gray-600">👤 ${goal.owner_name || 'Unassigned'}</span>
        <span class="text-gray-600">🎯 ${goal.target_value}</span>
        <span class="text-gray-600">📊 ${goal.current_value}</span>
    </div>
` : `
    <p class="text-gray-500 text-sm">No goal planned for this week</p>
`}
```

**REPLACE WITH** (compact card format with tasks):
```javascript
${goal ? `
    <!-- Milestone Title (compact) -->
    <div class="flex items-center justify-between mb-2">
        <h4 class="font-medium text-gray-900 text-sm">${goal.title}</h4>
        <span class="text-xs px-2 py-0.5 rounded ${status.class}">${status.label}</span>
    </div>

    <!-- Tasks List (compact) -->
    ${goal.tasks && goal.tasks.length > 0 ? `
        <div class="space-y-1 mb-3 ml-2">
            ${goal.tasks.map(task => `
                <label class="flex items-center space-x-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded group">
                    <input type="checkbox"
                           ${task.status === 'completed' || task.status === 'done' ? 'checked' : ''}
                           onchange="toggleTaskStatus('${task._id}', this.checked)"
                           class="w-3 h-3 rounded text-purple-600 focus:ring-1 focus:ring-purple-500">
                    <span class="${task.status === 'completed' || task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-700'} flex-1">
                        ${escapeHtml(task.name)}
                    </span>
                    <span class="text-xs text-gray-400 opacity-0 group-hover:opacity-100">
                        ${new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </label>
            `).join('')}
        </div>

        <!-- Task Progress -->
        <div class="flex items-center space-x-2 text-xs">
            <div class="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-purple-600 transition-all"
                     style="width: ${Math.round((goal.tasks.filter(t => t.status === 'completed' || t.status === 'done').length / goal.tasks.length) * 100)}%;"></div>
            </div>
            <span class="text-gray-600 font-medium">
                ${goal.tasks.filter(t => t.status === 'completed' || t.status === 'done').length}/${goal.tasks.length}
            </span>
        </div>
    ` : `
        <p class="text-gray-400 text-xs ml-2 mb-2">No tasks created yet</p>
    `}
` : `
    <p class="text-gray-500 text-sm">No milestone planned for this week</p>
`}
```

**Also ADD escapeHtml helper** (after line 1100):
```javascript
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
```

**Estimated Time**: 30 minutes

---

### Gap 4: Task Toggle Function

**Location**: `planning.html` - NEW function needed

**ADD THIS FUNCTION** (after line 1100):
```javascript
/**
 * Toggle task status between completed and pending
 * @param {String} taskId - Task ID to update
 * @param {Boolean} isChecked - Checkbox state
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

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        // Reload existing plan to reflect changes
        if (selectedKR) {
            await viewExistingPlan(selectedKR._id);
        }

    } catch (error) {
        console.error('Error toggling task:', error);
        alert('Failed to update task status. Please try again.');
        // Revert checkbox
        event.target.checked = !isChecked;
    }
}
```

**Estimated Time**: 15 minutes

---

### Gap 5: Update Status Icons

**Location**: `planning.html:1053` - `renderWeekCard()` function

**Current statusConfig** (Line 1053-1057):
```javascript
const statusConfig = {
    in_progress: { icon: '🟠', label: 'In Progress', class: 'bg-orange-100 text-orange-700' },
    completed: { icon: '✅', label: 'Completed', class: 'bg-green-100 text-green-700' },
    not_planned: { icon: '🔵', label: 'Not Planned', class: 'bg-blue-100 text-blue-700' }
};
```

**UPDATE TO** (add overdue status):
```javascript
const statusConfig = {
    completed: { icon: '✅', label: 'Completed', class: 'bg-green-100 text-green-700' },
    in_progress: { icon: '🟡', label: 'In Progress', class: 'bg-yellow-100 text-yellow-700' },
    overdue: { icon: '🔴', label: 'Overdue', class: 'bg-red-100 text-red-700' },
    not_started: { icon: '⏸️', label: 'Not Started', class: 'bg-gray-100 text-gray-700' },
    not_planned: { icon: '🔵', label: 'Not Planned', class: 'bg-blue-100 text-blue-700' }
};
```

**ALSO UPDATE** (Line 1058):
```javascript
// Use calculated status if available, otherwise week.status
const status = statusConfig[goal?.calculated_status || week.status];
```

**Estimated Time**: 5 minutes

---

### Gap 6: Terminology Change

**Location**: Multiple places in `planning.html`

**FIND & REPLACE**:
```
Line 209: "📋 Weekly Goals" → "📋 Milestones"
```

**That's it!** Keep "Tasks" as "Tasks" (no change needed).

**Estimated Time**: 2 minutes

---

### Gap 7: Enhanced AI Task Generation (Optional)

**Location**: `planning.html:612` - Inside `generatePlan()` function

**Current** (Line 661-679): Generic tasks
```javascript
tasks: [
    {
        name: `Milestone ${actualWeekNumber}: Progress towards ${selectedKR.title}`,
        description: `Main milestone for week ${actualWeekNumber}`,
        // ...
    },
    {
        name: `Action item ${actualWeekNumber}.1: Review progress`,
        // ...
    }
]
```

**ENHANCE WITH** (call OpenAI if available):
```javascript
// NEW: Generate contextual tasks with AI
async function generateTasksForWeek(weekNumber, krTitle, weeklyTarget, company) {
    if (typeof openai === 'undefined') {
        // Fallback to template tasks
        return [
            {
                name: `Week ${weekNumber}: Work towards ${krTitle}`,
                description: `Make progress on weekly target of ${weeklyTarget}`,
                priority: 'high'
            },
            {
                name: `Week ${weekNumber}: Review progress`,
                description: 'Check status and adjust approach',
                priority: 'medium'
            },
            {
                name: `Week ${weekNumber}: Update metrics`,
                description: 'Track and document progress',
                priority: 'medium'
            }
        ];
    }

    // Call OpenAI to generate contextual tasks
    const prompt = `Generate 3-5 specific, actionable tasks for week ${weekNumber} to help achieve this Key Result: "${krTitle}". Target for this week: ${weeklyTarget}. Company context: ${company.name} in ${company.industry}. Return JSON array of {name, description, priority}.`;

    try {
        const response = await fetch('/api/ai/generate-tasks', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, krTitle, weekNumber, weeklyTarget })
        });

        const { tasks } = await response.json();
        return tasks;
    } catch (error) {
        console.error('AI task generation failed, using templates:', error);
        return fallbackTasks;
    }
}
```

**Note**: This requires new backend endpoint `/api/ai/generate-tasks` (optional enhancement).

**Estimated Time**: 2-3 hours (if implementing AI enhancement)

---

## 📊 Summary

### What EXISTS ✅ (85%):
1. ✅ Task model & database schema
2. ✅ Task API endpoints (GET, POST, PUT)
3. ✅ Bulk task creation endpoint
4. ✅ Weekly goals generation
5. ✅ Tasks creation (3 per week) during plan generation
6. ✅ Tasks saved to database
7. ✅ Existing plan view UI structure
8. ✅ Week cards rendering
9. ✅ Filter system
10. ✅ Pagination

### What's MISSING ❌ (15%):
1. ❌ Fetch tasks when viewing existing plan (15 min)
2. ❌ Calculate milestone status from tasks (10 min)
3. ❌ Display tasks in week cards (30 min)
4. ❌ Task checkbox toggle functionality (15 min)
5. ❌ Update status icons (5 min)
6. ❌ Terminology: "Weekly Goals" → "Milestones" (2 min)
7. ❌ Enhanced AI task generation (2-3 hours - OPTIONAL)

---

## ⏱️ Total Implementation Time

### Core Features (Required):
- **1.5 hours** (without AI enhancement)
- **8-10 story points**

### With AI Enhancement (Optional):
- **4-5 hours** total
- **13-15 story points**

---

## 🎯 Implementation Phases

### Phase 1: Display Tasks (1 hour)
1. Update `viewExistingPlan()` to fetch tasks
2. Add `calculateMilestoneStatus()` function
3. Update `renderWeekCard()` to show tasks
4. Add task checkboxes
5. Update status icons

### Phase 2: Task Interaction (30 min)
1. Add `toggleTaskStatus()` function
2. Wire up checkbox onChange
3. Test task completion flow

### Phase 3: Polish (15 min)
1. Change "Weekly Goals" → "Milestones"
2. Test filter system with new statuses
3. Verify status calculations

### Phase 4: AI Enhancement (Optional - 2-3 hours)
1. Create AI task generation endpoint
2. Update generatePlan() to use AI
3. Add fallback templates
4. Test AI integration

---

## 🚀 Ready to Implement?

**Recommendation**: Start with Phase 1-3 (core features, 1.5 hours) to get immediate value. Add Phase 4 (AI enhancement) later if needed.

**All changes are in ONE file**: `client/pages/planning.html`
**No database changes needed** ✅
**No new models needed** ✅
**All APIs already exist** ✅

---

**Status**: Ready for implementation
**Complexity**: Low (85% already built)
**Risk**: Minimal (no breaking changes)
