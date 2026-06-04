# 📋 WEEK 6 IMPLEMENTATION - DETAILED TODO LIST

**Created**: October 23, 2025
**Status**: ⚠️ 50% Complete (Backend Done, Frontend Missing)
**Last Updated**: October 23, 2025

---

## 🎯 OVERVIEW

Week 6 backend is **complete and excellent quality** (Goal model + 11 API endpoints). However, **all frontend work is missing** (0/8 files). This TODO list provides the detailed implementation plan to complete Week 6.

**Audit Report**: See [WEEK_6_AUDIT_REPORT.md](WEEK_6_AUDIT_REPORT.md) for full analysis.

---

## ✅ COMPLETED WORK (Backend)

### Backend - DONE ✅
- [x] Goal Model (542 lines) - [server/models/Goal.js](server/models/Goal.js)
  - Schema with all fields (associations, timeline, progress, metrics, dependencies)
  - 6 compound indexes
  - 4 virtual fields (health_status, completion_display, days_remaining, is_overdue)
  - 6 instance methods (updateProgress, calculateHealth, etc.)
  - 5 static methods (findByQuarter, findByOwner, etc.)
  - Pre/post save hooks (auto-status, cascade to Objective)
- [x] Goal API Routes (576 lines) - [server/routes/goals.js](server/routes/goals.js)
  - 11 endpoints (GET list, POST create, GET/:id, PUT/:id, PUT/:id/progress, etc.)
  - Full RBAC (Employee/Manager/Executive role filtering)
  - Proper validation & error handling
  - Multi-tenant security (business_id isolation)
- [x] Routes registered in [server/index.js:113](server/index.js#L113)

---

## 📋 REMAINING WORK - DETAILED TASKS

### **PHASE 1: Goals API Client** (Est: 3-4 hours)

#### Task 1.1: Create Goals API Client
**File**: `client/js/goals-api-client.js`
**Lines**: ~300
**Status**: ❌ NOT STARTED

**Implementation**:
```javascript
// Goals API Client - Week 6
window.GoalsAPI = {
  // GET /api/goals - List goals with filters
  async getGoals(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/goals?${params}`, { credentials: 'include' });
    return response.json();
  },

  // POST /api/goals - Create new goal
  async createGoal(goalData) {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(goalData)
    });
    return response.json();
  },

  // GET /api/goals/:id - Get single goal
  async getGoal(goalId) {
    const response = await fetch(`/api/goals/${goalId}`, { credentials: 'include' });
    return response.json();
  },

  // PUT /api/goals/:id - Update goal
  async updateGoal(goalId, updates) {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  // PUT /api/goals/:id/progress - Update progress
  async updateProgress(goalId, progress) {
    const response = await fetch(`/api/goals/${goalId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ progress })
    });
    return response.json();
  },

  // PUT /api/goals/:id/assign - Assign goal to user
  async assignGoal(goalId, userId, role = 'contributor') {
    const response = await fetch(`/api/goals/${goalId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ user_id: userId, role })
    });
    return response.json();
  },

  // DELETE /api/goals/:id - Delete goal
  async deleteGoal(goalId) {
    const response = await fetch(`/api/goals/${goalId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response.json();
  },

  // GET /api/goals/quarter/:quarter - Get goals by quarter
  async getGoalsByQuarter(quarter) {
    const response = await fetch(`/api/goals/quarter/${quarter}`, { credentials: 'include' });
    return response.json();
  },

  // GET /api/goals/my/goals - Get my assigned goals
  async getMyGoals() {
    const response = await fetch('/api/goals/my/goals', { credentials: 'include' });
    return response.json();
  },

  // GET /api/goals/status/overdue - Get overdue goals
  async getOverdueGoals() {
    const response = await fetch('/api/goals/status/overdue', { credentials: 'include' });
    return response.json();
  },

  // GET /api/goals/stats/summary - Get goal statistics
  async getStats() {
    const response = await fetch('/api/goals/stats/summary', { credentials: 'include' });
    return response.json();
  }
};
```

**Acceptance Criteria**:
- [ ] All 11 API endpoints wrapped
- [ ] Proper error handling (try-catch)
- [ ] Credentials included for auth
- [ ] Returns parsed JSON
- [ ] Namespace: `window.GoalsAPI`

---

### **PHASE 2: Quarterly Goals Page** (Est: 6-8 hours)

#### Task 2.1: Create Quarterly Goals HTML
**File**: `client/pages/quarterly-goals.html`
**Lines**: ~200
**Status**: ❌ NOT STARTED

**UI Components**:
- Header with page title "Quarterly Goals"
- Quarter selector tabs (Q1, Q2, Q3, Q4) with active state
- "Create Goal" button (visible for Manager+ only)
- Goals grid (3 columns on desktop, 1 on mobile)
- Goal cards:
  - Goal name (title)
  - Description (truncated)
  - Owner avatar + name
  - Assigned users (avatars)
  - Progress bar with percentage
  - Status badge (not_started, in_progress, completed, at_risk)
  - Health indicator (color dot: green/blue/yellow/red)
  - Quarter + Week (e.g., "Q4 Week 3")
  - "View Details" button
- Empty state (no goals yet)
- Loading state
- Create Goal Modal:
  - Goal name input
  - Description textarea
  - Select objective (dropdown)
  - Select owner (dropdown, defaults to current user)
  - Quarter selector (Q1-Q4)
  - Week number input (1-13)
  - Due date picker
  - Priority selector (low, medium, high, critical)
  - Target value input + unit
  - Create button + Cancel button

**Design**:
- Use Karvia gradient for header (#667eea → #764ba2)
- Card hover effect (lift + shadow)
- Tailwind CSS for styling
- Inter font family

**Acceptance Criteria**:
- [ ] Page renders with header
- [ ] Quarter tabs functional
- [ ] Goal cards display correctly
- [ ] Create button shows modal
- [ ] Modal form validates input
- [ ] Empty state shows when no goals
- [ ] Loading spinner during API calls

---

#### Task 2.2: Create Quarterly Goals Controller
**File**: `client/pages/scripts/quarterly-goals.js`
**Lines**: ~350
**Status**: ❌ NOT STARTED

**Functions to Implement**:

```javascript
// Global state
let currentQuarter = 'Q4'; // Default to current quarter
let allGoals = [];
let currentUser = null;

// Initialize page
async function initializeQuarterlyGoalsPage(user) {
  currentUser = user;
  setupEventListeners();
  await loadGoals();
  updateQuarterTabs();
}

// Load goals from API
async function loadGoals() {
  showLoading();
  try {
    const response = await window.GoalsAPI.getGoals({ quarter: currentQuarter });
    if (response.success) {
      allGoals = response.goals || [];
      renderGoalCards();
    } else {
      showError(response.message);
    }
  } catch (error) {
    showError('Failed to load goals');
  }
  hideLoading();
}

// Render goal cards in grid
function renderGoalCards() {
  const container = document.getElementById('goals-grid');
  if (allGoals.length === 0) {
    showEmptyState();
    return;
  }

  container.innerHTML = allGoals.map(goal => `
    <div class="goal-card bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
      <!-- Goal name -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2">${escapeHtml(goal.name)}</h3>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4">${escapeHtml(goal.description || '').substring(0, 100)}...</p>

      <!-- Owner -->
      <div class="flex items-center mb-3">
        <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <span class="text-sm font-medium text-purple-600">${getInitials(goal.owner_id.name)}</span>
        </div>
        <span class="ml-2 text-sm text-gray-700">${goal.owner_id.name}</span>
      </div>

      <!-- Progress bar -->
      <div class="mb-3">
        <div class="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span class="font-semibold">${goal.progress}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="progress-bar h-2 rounded-full" style="width: ${goal.progress}%"></div>
        </div>
      </div>

      <!-- Status & Health -->
      <div class="flex items-center justify-between mb-4">
        <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(goal.status)}">
          ${goal.status.replace('_', ' ')}
        </span>
        <div class="flex items-center">
          <span class="h-3 w-3 rounded-full ${getHealthColor(goal.health_status)}"></span>
          <span class="ml-1 text-xs text-gray-600">${goal.quarter} Week ${goal.week}</span>
        </div>
      </div>

      <!-- View button -->
      <button onclick="viewGoalDetails('${goal._id}')"
              class="w-full py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
        View Details
      </button>
    </div>
  `).join('');
}

// Open create goal modal
function openCreateGoalModal() {
  // Load objectives for dropdown
  loadObjectivesForGoal();
  // Show modal
  document.getElementById('create-goal-modal').classList.remove('hidden');
}

// Handle create goal form submission
async function handleCreateGoal(event) {
  event.preventDefault();

  const formData = {
    objective_id: document.getElementById('goal-objective').value,
    name: document.getElementById('goal-name').value,
    description: document.getElementById('goal-description').value,
    owner_id: currentUser.id,
    quarter: document.getElementById('goal-quarter').value,
    week: parseInt(document.getElementById('goal-week').value),
    due_date: document.getElementById('goal-due-date').value,
    priority: document.getElementById('goal-priority').value,
    target_value: parseFloat(document.getElementById('goal-target').value) || 100,
    unit: document.getElementById('goal-unit').value || '%'
  };

  try {
    const response = await window.GoalsAPI.createGoal(formData);
    if (response.success) {
      showToast('Goal created successfully', 'success');
      closeCreateGoalModal();
      await loadGoals();
    } else {
      showToast(response.message || 'Failed to create goal', 'error');
    }
  } catch (error) {
    showToast('Error creating goal', 'error');
  }
}

// Filter by quarter
function filterByQuarter(quarter) {
  currentQuarter = quarter;
  updateQuarterTabs();
  loadGoals();
}

// Navigate to goal details
function viewGoalDetails(goalId) {
  window.location.href = `/pages/goal-details.html?id=${goalId}`;
}

// Helper functions
function getStatusClass(status) {
  const classes = {
    'not_started': 'bg-gray-100 text-gray-700',
    'in_progress': 'bg-blue-100 text-blue-700',
    'completed': 'bg-green-100 text-green-700',
    'at_risk': 'bg-yellow-100 text-yellow-700',
    'blocked': 'bg-red-100 text-red-700'
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
}

function getHealthColor(health) {
  const colors = {
    'excellent': 'bg-green-500',
    'on_track': 'bg-blue-500',
    'at_risk': 'bg-yellow-500',
    'critical': 'bg-red-500'
  };
  return colors[health] || 'bg-gray-400';
}
```

**Acceptance Criteria**:
- [ ] Page initializes on auth:ready event
- [ ] Goals load and render correctly
- [ ] Quarter filtering works
- [ ] Create goal form submits and creates goal
- [ ] View Details button navigates to goal-details page
- [ ] Loading/empty states work
- [ ] Toast notifications show for success/error

---

### **PHASE 3: Goal Details Page** (Est: 8-10 hours)

#### Task 3.1: Create Goal Details HTML
**File**: `client/pages/goal-details.html`
**Lines**: ~250
**Status**: ❌ NOT STARTED

**UI Components**:
- Back button (to quarterly-goals page)
- Goal header:
  - Goal name (editable inline for owner)
  - Description (editable inline for owner)
  - Owner info
  - Assigned users list
  - Status badge
  - Health indicator
  - Progress percentage (large display)
- Progress section:
  - Large progress bar
  - Current value / Target value
  - Update progress button (for assigned users)
- Timeline section:
  - Quarter + Week
  - Start date → Due date
  - Days remaining
  - Overdue warning (if applicable)
- Metrics section:
  - Total tasks (coming in Week 7)
  - Completed tasks
  - Hours logged
  - Completion rate
- Actions section (role-based):
  - Assign to user button (Manager+)
  - Edit goal button (Owner)
  - Delete goal button (Manager+)
- Activity log (future):
  - Progress updates
  - Assignments
  - Comments

**Acceptance Criteria**:
- [ ] Page loads with goal ID from URL
- [ ] Goal details display correctly
- [ ] Progress update modal works
- [ ] Assignment modal works
- [ ] Edit/delete actions work
- [ ] Back button navigates correctly

---

#### Task 3.2: Create Goal Details Controller
**File**: `client/pages/scripts/goal-details.js`
**Lines**: ~400
**Status**: ❌ NOT STARTED

**Functions**:
```javascript
let goalData = null;
let currentUser = null;

async function initializeGoalDetailsPage(user) {
  currentUser = user;
  const urlParams = new URLSearchParams(window.location.search);
  const goalId = urlParams.get('id');

  if (!goalId) {
    showError('No goal ID provided');
    return;
  }

  await loadGoalDetails(goalId);
  setupEventListeners();
}

async function loadGoalDetails(goalId) {
  showLoading();
  try {
    const response = await window.GoalsAPI.getGoal(goalId);
    if (response.success) {
      goalData = response.goal;
      renderGoalDetails();
    } else {
      showError(response.message);
    }
  } catch (error) {
    showError('Failed to load goal details');
  }
  hideLoading();
}

function renderGoalDetails() {
  // Populate all fields
  document.getElementById('goal-name').textContent = goalData.name;
  document.getElementById('goal-description').textContent = goalData.description;
  // ... render all sections
}

async function updateProgress(newProgress) {
  try {
    const response = await window.GoalsAPI.updateProgress(goalData._id, newProgress);
    if (response.success) {
      showToast('Progress updated', 'success');
      await loadGoalDetails(goalData._id);
    }
  } catch (error) {
    showToast('Failed to update progress', 'error');
  }
}

async function assignGoalToUser(userId) {
  try {
    const response = await window.GoalsAPI.assignGoal(goalData._id, userId);
    if (response.success) {
      showToast('Goal assigned', 'success');
      await loadGoalDetails(goalData._id);
    }
  } catch (error) {
    showToast('Failed to assign goal', 'error');
  }
}
```

**Acceptance Criteria**:
- [ ] Goal details load correctly
- [ ] Progress updates work
- [ ] Assignment works
- [ ] Edit/delete work
- [ ] Role-based actions enforced

---

### **PHASE 4: Weekly Goals Page** (Est: 4-5 hours)

#### Task 4.1: Create Weekly Goals HTML
**File**: `client/pages/weekly-goals.html`
**Lines**: ~200
**Status**: ❌ NOT STARTED

**UI Components**:
- Header with "Weekly Goals"
- Week selector dropdown (Week 1-13 of current quarter)
- Filter toggle: "My Goals" / "Team Goals"
- Goals list (not grid, list format):
  - Goal name (links to details)
  - Related objective
  - Progress slider (0-100%)
  - Target value display
  - Update button
- Empty state

**Acceptance Criteria**:
- [ ] Week selector works
- [ ] Goals load for selected week
- [ ] Progress sliders functional
- [ ] Update button saves progress
- [ ] Filter toggle works

---

#### Task 4.2: Create Weekly Goals Controller
**File**: `client/pages/scripts/weekly-goals.js`
**Lines**: ~300
**Status**: ❌ NOT STARTED

**Functions**:
```javascript
let currentWeek = 1;
let filter = 'my'; // 'my' or 'team'

async function loadWeeklyGoals() {
  const filters = { week: currentWeek };
  if (filter === 'my') {
    const response = await window.GoalsAPI.getMyGoals();
    // Filter by week
  } else {
    const response = await window.GoalsAPI.getGoals(filters);
  }
  renderWeeklyGoals();
}

function selectWeek(weekNumber) {
  currentWeek = weekNumber;
  loadWeeklyGoals();
}

async function updateGoalProgress(goalId, progress) {
  await window.GoalsAPI.updateProgress(goalId, progress);
  showToast('Progress updated', 'success');
  loadWeeklyGoals();
}
```

**Acceptance Criteria**:
- [ ] Weekly goals load
- [ ] Week selection works
- [ ] Progress updates trigger rollup
- [ ] Filter works

---

### **PHASE 5: Assignment Modal Component** (Est: 2-3 hours)

#### Task 5.1: Create Assignment Modal
**File**: `client/components/assign-goal-modal.html`
**Lines**: ~150
**Status**: ❌ NOT STARTED

**UI**:
- Modal overlay (dark background)
- Modal content:
  - Title: "Assign Goal"
  - User search/select dropdown (team members)
  - Role selector (lead, contributor, reviewer)
  - Notes textarea (optional)
  - Assign button + Cancel button

**Acceptance Criteria**:
- [ ] Modal opens on assign button click
- [ ] User dropdown populated with team members
- [ ] Role selector works
- [ ] Assign button calls API
- [ ] Modal closes on success

---

### **PHASE 6: Backend Enhancement** (Est: 2-3 hours)

#### Task 6.1: Add Weekly Breakdown Endpoint
**File**: `server/routes/goals.js`
**Status**: ❌ NOT STARTED

**Endpoint**: `POST /api/goals/breakdown`

**Purpose**: Auto-create 12 weekly goals from a base goal

**Input**:
```json
{
  "base_goal_id": "67xxx",
  "week_count": 12
}
```

**Logic**:
```javascript
// Get base goal
const baseGoal = await Goal.findById(base_goal_id);

// Create 12 weekly goals
const weeklyGoals = [];
for (let week = 1; week <= week_count; week++) {
  const weeklyGoal = new Goal({
    ...baseGoal.toObject(),
    _id: undefined, // New ID
    week: week,
    name: `${baseGoal.name} - Week ${week}`,
    due_date: calculateWeekDueDate(baseGoal.start_date, week),
    progress: 0,
    status: 'not_started',
    tags: [...(baseGoal.tags || []), `weekly-breakdown-${base_goal_id}`]
  });
  await weeklyGoal.save();
  weeklyGoals.push(weeklyGoal);
}

return { success: true, goals: weeklyGoals };
```

**Acceptance Criteria**:
- [ ] Endpoint creates 12 goals
- [ ] Each goal has unique week number
- [ ] Due dates calculated correctly
- [ ] Goals linked via tags

---

### **PHASE 7: Testing & Polish** (Est: 8 hours)

#### Task 7.1: End-to-End Testing

**Test Scenario 1: Manager Creates Goal**
- [ ] Login as Manager
- [ ] Navigate to Quarterly Goals
- [ ] Click "Create Goal"
- [ ] Fill form (name, objective, quarter, week, due date)
- [ ] Submit → Goal appears in grid
- [ ] Goal has correct quarter badge
- [ ] Progress bar shows 0%

**Test Scenario 2: Assign Goal**
- [ ] Open goal details
- [ ] Click "Assign to User"
- [ ] Select employee
- [ ] Assign → Employee appears in "Assigned to" list
- [ ] Logout, login as Employee
- [ ] Navigate to Weekly Goals
- [ ] See assigned goal in correct week

**Test Scenario 3: Update Progress**
- [ ] As Employee, select Week 1
- [ ] Find assigned goal
- [ ] Update progress to 50%
- [ ] Click Update
- [ ] Navigate to goal details
- [ ] Progress bar shows 50%
- [ ] Navigate to Objectives page
- [ ] Parent objective progress updated (via post-save hook)

**Test Scenario 4: Manager Views Team Progress**
- [ ] As Manager, navigate to Quarterly Goals
- [ ] See all team goals
- [ ] Filter by Q4
- [ ] View goal details
- [ ] See progress history
- [ ] Identify at-risk goals (yellow health indicator)

---

#### Task 7.2: Bug Fixes
**Time**: 2-3 hours

**Expected Issues**:
- [ ] Progress update not triggering objective rollup
- [ ] Assignment modal user dropdown empty
- [ ] Health status color incorrect
- [ ] Loading states not showing
- [ ] Quarter tabs not highlighting active

---

#### Task 7.3: Documentation
**Time**: 2-3 hours

- [ ] Create `WEEK_6_COMPLETION_SUMMARY.md`
  - Overview of deliverables
  - Files created + line counts
  - Testing results
  - Known issues
- [ ] Update `API_DOCUMENTATION.md`
  - Add 11 goal endpoints
  - Request/response examples
- [ ] Update `DATABASE_SCHEMA.md`
  - Add Goal model schema
  - Add indexes
  - Add relationships

---

## 📊 ESTIMATION SUMMARY

| Phase | Tasks | Estimated Hours |
|-------|-------|----------------|
| Phase 1: Goals API Client | 1 task | 3-4 hours |
| Phase 2: Quarterly Goals Page | 2 tasks | 6-8 hours |
| Phase 3: Goal Details Page | 2 tasks | 8-10 hours |
| Phase 4: Weekly Goals Page | 2 tasks | 4-5 hours |
| Phase 5: Assignment Modal | 1 task | 2-3 hours |
| Phase 6: Backend Enhancement | 1 task | 2-3 hours |
| Phase 7: Testing & Polish | 3 tasks | 8 hours |
| **TOTAL** | **12 tasks** | **33-41 hours (~5 days)** |

---

## 🎯 IMPLEMENTATION PRIORITY

### Must Have (P0):
1. **Goals API Client** - Foundation for all frontend
2. **Quarterly Goals Page** - Main entry point
3. **Goal Details Page** - Core functionality
4. **Progress Update** - Key user action

### Should Have (P1):
5. **Weekly Goals Page** - Alternative view
6. **Assignment Modal** - Manager workflow
7. **Testing** - Quality assurance

### Nice to Have (P2):
8. **Breakdown Endpoint** - Automation feature
9. **Documentation** - Future reference

---

## ✅ ACCEPTANCE CRITERIA (Week 6 Complete)

- [ ] Manager can create quarterly goals from objectives page
- [ ] Goals display in quarterly view with filters
- [ ] Manager can assign goals to employees
- [ ] Employees can update goal progress
- [ ] Progress updates cascade to parent Objective
- [ ] Goal details page shows full information
- [ ] Weekly view shows goals by week number
- [ ] Health indicators (green/blue/yellow/red) display correctly
- [ ] All role-based permissions enforced
- [ ] Zero JavaScript errors in console
- [ ] All 4 test scenarios pass
- [ ] Documentation complete

---

## 📌 NEXT STEPS

1. **Start with Phase 1** - Create goals-api-client.js
2. **Then Phase 2** - Build quarterly-goals page
3. **Then Phase 3** - Build goal-details page
4. **Test incrementally** - Test each phase before moving on
5. **Polish** - Fix bugs, add documentation

**Estimated Completion Time**: 5 days (40 hours)

---

**Created By**: Claude
**Date**: October 23, 2025
**Status**: Ready for Implementation
