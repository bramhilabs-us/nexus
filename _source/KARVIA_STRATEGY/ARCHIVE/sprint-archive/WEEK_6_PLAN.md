# 📅 WEEK 6 DETAILED PLAN - Goal Management

**Week**: 6 of 12
**Focus**: Quarterly + Weekly Goals (Create, Assign, Track)
**Duration**: 5 days (40 hours)
**Complexity**: 🔴 HIGH (Cascade ownership, Progress rollup)
**Status**: 📋 **PLANNING**

---

## 🎯 WEEK 6 OBJECTIVES

### **Primary Goals**:
1. ✅ Build Quarterly Goal creation from Objectives
2. ✅ Implement Weekly Goal breakdown system
3. ✅ Create Goal assignment workflows
4. ✅ Build Progress tracking + rollup automation
5. ✅ Implement Manager approval flows

### **Success Criteria**:
- Manager can create quarterly goals from objectives
- Quarterly goals can be broken into weekly goals
- Goals can be assigned to team members
- Progress rolls up: Weekly → Quarterly → Key Result
- Manager can approve/reject goals

---

## 📚 PREREQUISITE READING

**Must Read Before Starting**:
1. [PERMISSION_MATRIX.md](../../PERMISSION_MATRIX.md) - Cascade ownership rules
2. [BACKEND_AUTOMATION_SPECS.md](../../BACKEND_AUTOMATION_SPECS.md) - Progress rollup logic
3. [SYSTEM_DEPENDENCY_AUDIT.md](../../SYSTEM_DEPENDENCY_AUDIT.md) - Critical dependencies
4. [Week 7-8 User Stories](../../MVP_USER_STORIES.md#week-7-goal-management) - MGR-025, MGR-026, EMP-013, EMP-014

**Key Concepts**:
- **Cascade Ownership**: Executive owns Objective → Manager owns Goals → Employee executes
- **Progress Rollup**: Weekly Goal progress → Quarterly Goal → Key Result → Objective
- **Approval Workflow**: Manager creates → Assigns to employee → Employee executes

---

## 🗓️ DAY-BY-DAY BREAKDOWN

---

### **DAY 1 (8 hours): Database + Quarterly Goal Model**

#### **Morning (4 hours): Goal Data Models**

**Task 1.1**: Create Goal Model
**File**: `server/models/Goal.js`
**Time**: 2 hours

**Schema**:
```javascript
{
  // Hierarchy
  objective_id: ObjectId,           // Parent objective
  quarterly_plan_id: ObjectId,      // Part of quarterly plan

  // Goal Info
  type: String,                     // "quarterly" | "weekly"
  title: String,                    // "Increase MRR by $15K"
  description: String,

  // Ownership
  owner_id: ObjectId,               // Manager who created
  assigned_to: ObjectId,            // Employee executing
  business_id: ObjectId,
  team_id: ObjectId,

  // Timeline
  quarter: String,                  // "Q4 2024"
  start_date: Date,
  end_date: Date,
  week_number: Number,              // For weekly goals (1-13)

  // Progress
  progress_percentage: Number,      // 0-100
  status: String,                   // "draft", "active", "completed", "at_risk"

  // Relationships
  parent_goal_id: ObjectId,         // For weekly goals → quarterly parent
  child_goals: [ObjectId],          // For quarterly → weekly children

  // Lineage (for traceability)
  lineage: {
    assessment_id: ObjectId,
    objective_id: ObjectId,
    key_result_id: ObjectId,
    quarterly_goal_id: ObjectId     // Self-reference for weekly goals
  },

  // Metadata
  is_active: Boolean,
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `{ objective_id: 1 }` - Find goals by objective
- `{ owner_id: 1, status: 1 }` - Manager's goals
- `{ assigned_to: 1, status: 1 }` - Employee's assigned goals
- `{ parent_goal_id: 1 }` - Find child goals
- `{ quarterly_plan_id: 1 }` - Find goals in a plan

**Instance Methods**:
- `createWeeklyGoals(weekCount)` - Auto-generate weekly breakdown
- `calculateProgress()` - Rollup from child goals or tasks
- `assignTo(userId)` - Assign goal to employee
- `updateStatus()` - Auto-update based on progress

**Static Methods**:
- `findByObjective(objectiveId)` - Get all goals for objective
- `findByOwner(userId)` - Get manager's goals
- `findAssignedGoals(userId)` - Get employee's assigned goals
- `findWeeklyGoals(quarterlyGoalId)` - Get weekly breakdown

**Deliverable**: `server/models/Goal.js` (300+ lines)

---

**Task 1.2**: Create QuarterlyPlan Model (if not exists)
**File**: `server/models/QuarterlyPlan.js`
**Time**: 1 hour

**Schema**:
```javascript
{
  business_id: ObjectId,
  owner_id: ObjectId,               // Manager who created plan
  quarter: String,                  // "Q4 2024"
  start_date: Date,
  end_date: Date,

  goals: [ObjectId],                // Array of goal IDs
  status: String,                   // "draft", "pending_approval", "approved", "active"

  approval: {
    approved_by: ObjectId,          // Executive who approved
    approved_at: Date,
    notes: String
  },

  created_at: Date,
  updated_at: Date
}
```

**Deliverable**: `server/models/QuarterlyPlan.js` (150+ lines)

---

**Task 1.3**: Update Existing Models
**Files**: `server/models/Objective.js`, `server/models/KeyResult.js`
**Time**: 1 hour

**Changes**:
- Add `goals: [ObjectId]` to Objective model
- Add `quarterly_goal_id: ObjectId` to KeyResult model (for linkage)
- Update indexes

**Deliverable**: Modified Objective + KeyResult models

---

#### **Afternoon (4 hours): Goal API Routes - Part 1**

**Task 1.4**: Create Quarterly Goal Endpoints
**File**: `server/routes/goals.js`
**Time**: 4 hours

**Endpoints to Build** (5 total):

1. **POST /api/goals/quarterly/create**
   - **Access**: MANAGER, EXECUTIVE
   - **Body**: `{ objective_id, title, description, quarter, team_id }`
   - **Logic**:
     - Validate objective exists and user has access
     - Create quarterly goal
     - Link to objective
     - Return goal object

2. **GET /api/goals/quarterly**
   - **Access**: All (role-filtered)
   - **Query**: `?status=active&owner_id=xxx`
   - **Logic**:
     - MANAGER: See own goals
     - EXECUTIVE: See all goals in business
     - EMPLOYEE: See assigned goals

3. **GET /api/goals/quarterly/:goalId**
   - **Access**: Owner, Assigned user, Manager+
   - **Logic**:
     - Return goal with child goals (weekly breakdown)
     - Include progress rollup

4. **PUT /api/goals/quarterly/:goalId**
   - **Access**: Owner, Manager+
   - **Body**: `{ title, description, status }`
   - **Logic**:
     - Update goal fields
     - Recalculate progress if needed

5. **POST /api/goals/quarterly/:goalId/assign**
   - **Access**: Owner, Manager+
   - **Body**: `{ assigned_to: userId }`
   - **Logic**:
     - Validate user belongs to same team/business
     - Assign goal to employee
     - Send notification (future)

**Deliverable**: `server/routes/goals.js` - Quarterly endpoints (400+ lines)

---

**Task 1.5**: Register Routes
**File**: `server/index.js`
**Time**: 5 minutes

**Change**:
```javascript
app.use('/api/goals', require('./routes/goals')); // Week 6 - Goal Management
```

**Deliverable**: 1 line added to server/index.js

---

**End of Day 1 Deliverables**:
- ✅ Goal model created
- ✅ QuarterlyPlan model created
- ✅ 5 Quarterly goal API endpoints
- ✅ Routes registered

---

### **DAY 2 (8 hours): Weekly Goals + Progress Rollup**

#### **Morning (4 hours): Weekly Goal Endpoints**

**Task 2.1**: Weekly Goal Creation Endpoint
**File**: `server/routes/goals.js`
**Time**: 2 hours

**Endpoint**: **POST /api/goals/quarterly/:goalId/breakdown**
- **Access**: Owner, Manager+
- **Body**: `{ week_count: 12, auto_distribute: true }`
- **Logic**:
  - Get quarterly goal
  - Calculate weekly targets (divide quarterly by week_count)
  - Create weekly goal documents
  - Link to parent quarterly goal
  - Return array of weekly goals

**Example**:
```javascript
// Quarterly: Increase MRR $0 → $15K
// Weekly breakdown (12 weeks):
// Week 1: $0 → $1,250
// Week 2: $1,250 → $2,500
// ...
// Week 12: $13,750 → $15,000
```

**Deliverable**: Weekly breakdown endpoint (150 lines)

---

**Task 2.2**: Weekly Goal CRUD Endpoints
**File**: `server/routes/goals.js`
**Time**: 2 hours

**Endpoints** (4):

1. **GET /api/goals/weekly?quarterly_goal_id=xxx**
   - Get all weekly goals for a quarterly goal

2. **GET /api/goals/weekly/:goalId**
   - Get single weekly goal details

3. **PUT /api/goals/weekly/:goalId**
   - Update weekly goal (title, description, target)

4. **PUT /api/goals/weekly/:goalId/progress**
   - Update progress → Trigger rollup to quarterly goal

**Deliverable**: 4 weekly goal endpoints (300 lines)

---

#### **Afternoon (4 hours): Progress Rollup Automation**

**Task 2.3**: Create Progress Rollup Service
**File**: `server/services/progressRollupService.js`
**Time**: 3 hours

**Functions**:

```javascript
// Rollup weekly goals → quarterly goal
async function rollupQuarterlyGoalProgress(quarterlyGoalId) {
  const weeklyGoals = await Goal.find({ parent_goal_id: quarterlyGoalId });
  const avgProgress = weeklyGoals.reduce((sum, g) => sum + g.progress_percentage, 0) / weeklyGoals.length;

  await Goal.findByIdAndUpdate(quarterlyGoalId, {
    progress_percentage: Math.round(avgProgress)
  });

  return avgProgress;
}

// Rollup quarterly goal → key result
async function rollupKeyResultProgress(keyResultId) {
  const goals = await Goal.find({ 'lineage.key_result_id': keyResultId });
  const avgProgress = goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length;

  await KeyResult.findByIdAndUpdate(keyResultId, {
    current_value: calculateKRValue(avgProgress) // Convert % to KR value
  });

  return avgProgress;
}

// Rollup key results → objective
async function rollupObjectiveProgress(objectiveId) {
  const objective = await Objective.findById(objectiveId).populate('key_results');
  const avgKRProgress = objective.key_results.reduce((sum, kr) => sum + kr.progress, 0) / objective.key_results.length;

  await Objective.findByIdAndUpdate(objectiveId, {
    progress_percentage: Math.round(avgKRProgress)
  });

  return avgKRProgress;
}

// Full rollup chain
async function rollupProgressChain(weeklyGoalId) {
  const weeklyGoal = await Goal.findById(weeklyGoalId);

  // Step 1: Weekly → Quarterly
  await rollupQuarterlyGoalProgress(weeklyGoal.parent_goal_id);

  // Step 2: Quarterly → Key Result
  const quarterlyGoal = await Goal.findById(weeklyGoal.parent_goal_id);
  if (quarterlyGoal.lineage.key_result_id) {
    await rollupKeyResultProgress(quarterlyGoal.lineage.key_result_id);
  }

  // Step 3: Key Result → Objective
  if (quarterlyGoal.lineage.objective_id) {
    await rollupObjectiveProgress(quarterlyGoal.lineage.objective_id);
  }
}
```

**Deliverable**: `server/services/progressRollupService.js` (250+ lines)

---

**Task 2.4**: Integrate Rollup in Update Endpoints
**Files**: `server/routes/goals.js`
**Time**: 1 hour

**Changes**:
- In `PUT /api/goals/weekly/:goalId/progress`:
  ```javascript
  // Update weekly goal
  weeklyGoal.progress_percentage = newProgress;
  await weeklyGoal.save();

  // Trigger rollup chain
  await progressRollupService.rollupProgressChain(weeklyGoal._id);
  ```

**Deliverable**: Integrated rollup in update endpoint

---

**End of Day 2 Deliverables**:
- ✅ Weekly goal breakdown endpoint
- ✅ 4 Weekly goal CRUD endpoints
- ✅ Progress rollup service
- ✅ Automated rollup integrated

---

### **DAY 3 (8 hours): Frontend - Quarterly Goals UI**

#### **Morning (4 hours): Goal Creation UI**

**Task 3.1**: Create Goals API Client
**File**: `client/js/goals-api-client.js`
**Time**: 1 hour

**Methods**:
- `createQuarterlyGoal(data)`
- `getQuarterlyGoals(params)`
- `getQuarterlyGoal(id)`
- `updateQuarterlyGoal(id, updates)`
- `assignGoal(goalId, userId)`
- `createWeeklyBreakdown(goalId, weekCount)`
- `getWeeklyGoals(quarterlyGoalId)`
- `updateWeeklyGoalProgress(goalId, progress)`

**Deliverable**: `client/js/goals-api-client.js` (300 lines)

---

**Task 3.2**: Create Quarterly Goals Page
**File**: `client/pages/quarterly-goals.html`
**Time**: 2 hours

**Features**:
- Header with quarter selector (Q1, Q2, Q3, Q4)
- "Create Goal" button (Manager+ only)
- Goal cards grid:
  - Goal title + description
  - Progress bar
  - Assigned to (if assigned)
  - Weekly goals count
  - "View Details" button
- Empty state with CTA

**Deliverable**: `client/pages/quarterly-goals.html` (200 lines)

---

**Task 3.3**: Create Goals Page Controller
**File**: `client/pages/scripts/quarterly-goals.js`
**Time**: 1 hour

**Functions**:
- `loadQuarterlyGoals()` - Fetch and render goals
- `openCreateGoalModal()` - Show creation form
- `createGoal(formData)` - Submit new goal
- `filterByQuarter(quarter)` - Filter goals by Q1/Q2/Q3/Q4
- `assignGoalToEmployee(goalId, userId)` - Assignment flow

**Deliverable**: `client/pages/scripts/quarterly-goals.js` (350 lines)

---

#### **Afternoon (4 hours): Goal Details Page**

**Task 3.4**: Create Goal Details Page
**File**: `client/pages/goal-details.html`
**Time**: 2 hours

**Features**:
- Goal header (title, description, owner, assigned to)
- Progress summary (overall + by week)
- Weekly goals table:
  - Week number
  - Week dates
  - Target
  - Progress %
  - Edit button
- "Create Weekly Breakdown" button (if no breakdown exists)
- Back to quarterly goals link

**Deliverable**: `client/pages/goal-details.html` (250 lines)

---

**Task 3.5**: Goal Details Controller
**File**: `client/pages/scripts/goal-details.js`
**Time**: 2 hours

**Functions**:
- `loadGoalDetails(goalId)` - Fetch goal + weekly breakdown
- `createWeeklyBreakdown(weekCount)` - Generate weekly goals
- `updateWeeklyProgress(weekId, progress)` - Update single week
- `renderWeeklyGoalsTable()` - Display weekly breakdown
- `renderProgressChart()` - Visual progress over weeks

**Deliverable**: `client/pages/scripts/goal-details.js` (400 lines)

---

**End of Day 3 Deliverables**:
- ✅ Goals API client
- ✅ Quarterly goals list page
- ✅ Goal details page with weekly breakdown
- ✅ Controllers for both pages

---

### **DAY 4 (8 hours): Frontend - Weekly Goals + Assignment**

#### **Morning (4 hours): Weekly Goal Management**

**Task 4.1**: Create Weekly Goals Page
**File**: `client/pages/weekly-goals.html`
**Time**: 2 hours

**Features**:
- Week selector (Week 1-13 of quarter)
- Goals for selected week:
  - Goal title (linked to quarterly goal)
  - Target
  - Progress input slider (0-100%)
  - Update button
- Filter: My Goals / Team Goals
- Empty state

**Deliverable**: `client/pages/weekly-goals.html` (200 lines)

---

**Task 4.2**: Weekly Goals Controller
**File**: `client/pages/scripts/weekly-goals.js`
**Time**: 2 hours

**Functions**:
- `loadWeeklyGoals(weekNumber)` - Fetch goals for week
- `updateProgress(goalId, progress)` - Update + trigger rollup
- `selectWeek(weekNumber)` - Change week view
- `filterGoals(filter)` - My Goals vs Team Goals

**Deliverable**: `client/pages/scripts/weekly-goals.js` (300 lines)

---

#### **Afternoon (4 hours): Goal Assignment Flow**

**Task 4.3**: Create Assignment Modal
**File**: `client/components/assign-goal-modal.html` (component)
**Time**: 1.5 hours

**Features**:
- Modal overlay
- User search/select dropdown (team members)
- Assignment notes textarea
- Assign button
- Cancel button

**Deliverable**: Assignment modal component (150 lines)

---

**Task 4.4**: Integrate Assignment in Quarterly Goals Page
**File**: `client/pages/scripts/quarterly-goals.js`
**Time**: 1.5 hours

**Changes**:
- Add "Assign" button to goal cards
- Click → Open assignment modal
- Select user → Call `assignGoal(goalId, userId)`
- Show success toast
- Refresh goal card (show assigned user)

**Deliverable**: Assignment flow integrated

---

**Task 4.5**: Add Assignment Notifications (Placeholder)
**File**: `client/js/notifications.js` (stub)
**Time**: 1 hour

**Stub Functions**:
```javascript
// To be fully implemented in Week 9
function sendGoalAssignedNotification(goalId, userId) {
  console.log(`Notification: Goal ${goalId} assigned to ${userId}`);
  // TODO: Week 9 - Real-time notification via WebSocket
}
```

**Deliverable**: Notification stubs (50 lines)

---

**End of Day 4 Deliverables**:
- ✅ Weekly goals page
- ✅ Assignment modal
- ✅ Assignment flow integrated
- ✅ Notification stubs

---

### **DAY 5 (8 hours): Integration Testing + Polish**

#### **Morning (3 hours): End-to-End Testing**

**Test Scenario 1: Manager Creates Quarterly Goal**
1. Login as Manager
2. Navigate to Quarterly Goals page
3. Click "Create Goal"
4. Fill form (title, description, select objective)
5. Submit → Goal appears in grid
6. Click goal → View details
7. Click "Create Weekly Breakdown" (12 weeks)
8. Weekly goals appear in table

**Expected Result**: ✅ 1 quarterly goal + 12 weekly goals created

---

**Test Scenario 2: Assign Goal to Employee**
1. As Manager, open goal details
2. Click "Assign to Employee"
3. Select employee from dropdown
4. Assign → Goal card shows "Assigned to: [Name]"
5. Logout, login as Employee
6. Navigate to Weekly Goals
7. See assigned goal in Week 1

**Expected Result**: ✅ Employee sees assigned weekly goal

---

**Test Scenario 3: Update Weekly Progress → Rollup**
1. As Employee, select Week 1
2. Update goal progress to 50%
3. Click Update
4. Navigate to Quarterly Goals
5. Quarterly goal progress updated to ~4% (50% of 1/12 weeks)
6. Navigate to Objectives page
7. Linked objective progress updated

**Expected Result**: ✅ Progress rolls up through chain

---

**Test Scenario 4: Manager Views Team Progress**
1. As Manager, navigate to Quarterly Goals
2. See all goals (own + assigned)
3. Click goal → View weekly breakdown
4. See progress across all weeks
5. Identify at-risk weeks (<30% progress)

**Expected Result**: ✅ Manager has full visibility

---

#### **Afternoon (5 hours): Bug Fixes + Documentation**

**Task 5.1**: Fix Discovered Bugs
**Time**: 2 hours

**Expected Issues**:
- Rollup calculation edge cases (division by zero)
- Permission checks not enforcing correctly
- UI loading states missing
- Progress bar animations not smooth

**Deliverable**: Bug fixes documented in WEEK_6_ISSUES.md

---

**Task 5.2**: Create Week 6 Completion Summary
**File**: `Daily_Handoffs/Week_6/WEEK_6_COMPLETION_SUMMARY.md`
**Time**: 1 hour

**Contents**:
- Overview of deliverables
- Files created (count + list)
- Code quality metrics
- Testing results
- Known issues
- Week 7 preview

**Deliverable**: WEEK_6_COMPLETION_SUMMARY.md

---

**Task 5.3**: Update Master Documentation
**Files**: Multiple
**Time**: 1.5 hours

**Updates**:
1. **MASTER_DEV_LIST.md**: Mark Week 6 complete
2. **MASTER_ISSUES_LIST.md**: Add any new issues found
3. **API_DOCUMENTATION.md**: Document 14 new goal endpoints
4. **DATABASE_SCHEMA.md**: Add Goal + QuarterlyPlan models

**Deliverable**: 4 documentation files updated

---

**Task 5.4**: Create Week 7 Plan
**File**: `Daily_Handoffs/Week_7/WEEK_7_PLAN.md`
**Time**: 30 minutes

**Week 7 Preview**:
- Focus: Task Management (break weekly goals into tasks)
- Key features: Task creation, assignment, completion, tracking
- Estimated effort: 5 days

**Deliverable**: WEEK_7_PLAN.md (outline)

---

**End of Day 5 Deliverables**:
- ✅ Integration tests passed
- ✅ Bugs fixed
- ✅ Week 6 completion summary
- ✅ Documentation updated
- ✅ Week 7 plan created

---

## 📊 WEEK 6 SUMMARY

### **Total Deliverables**:
- **Backend**: 2 models (Goal, QuarterlyPlan), 1 service (progressRollup), 14 API endpoints
- **Frontend**: 4 pages, 4 controllers, 1 API client, 1 modal component
- **Documentation**: Completion summary, API docs, test plan

### **Files Created**: ~18 files
### **Total Lines of Code**: ~3,500 lines
### **Estimated Time**: 40 hours (5 days)

### **Key Achievements**:
- ✅ Full goal hierarchy (Quarterly → Weekly)
- ✅ Automated progress rollup
- ✅ Assignment workflows
- ✅ Manager + Employee views
- ✅ End-to-end integration tested

---

## 🚀 WEEK 7 PREVIEW

**Focus**: Task Management
**Key Features**:
- Task creation from weekly goals
- Task assignment to employees
- Task completion tracking
- Daily/weekly task views
- Automated progress rollup to goals

**Complexity**: Medium-High
**Estimated Effort**: 5 days

---

**Created By**: Claude
**Creation Date**: 2025-10-22
**Status**: 📋 **READY FOR IMPLEMENTATION**
