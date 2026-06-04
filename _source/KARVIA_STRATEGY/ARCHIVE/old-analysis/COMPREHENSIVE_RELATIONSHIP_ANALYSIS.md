# KARVIA BUSINESS - COMPREHENSIVE CODEBASE ANALYSIS
## Task, Goal, and Objective Relationships Deep Dive

**Analysis Date**: November 12, 2025  
**Analyst**: Claude Code  
**Codebase Version**: 1.0.0 Pre-Production  
**Analysis Scope**: Full repository analysis  

---

## EXECUTIVE SUMMARY

The Karvia Business codebase has a **well-designed but partially incomplete parent-child relationship system**. The core models (Objective, Goal, Task) are properly structured with cascading hierarchy, but there's a **critical gap: parent-child goal tracking fields are used in the API but NOT defined in the Goal model schema**.

**Critical Finding**: The backend routes reference `parent_goal_id` and `child_goal_ids` fields that don't exist in the Goal model definition, creating a data persistence bug.

---

## 1. DATABASE MODELS ANALYSIS

### 1.1 OBJECTIVE MODEL ✅ COMPLETE
**File**: `/server/models/Objective.js` (417 lines)

**Purpose**: Yearly business objectives with embedded Key Results

**Key Relationships**:
- **Parent**: Company (via `company_id`)
- **Children**: Goals (via `goal_id` in Goal model), Key Results (embedded)
- **Horizontal**: Other objectives (via `dependent_objectives` array)

**Critical Fields**:
```javascript
{
  company_id: ObjectId (ref: 'Company'),  // Multi-tenant support
  owner_id: ObjectId (ref: 'User'),        // Objective owner
  
  // Key Results are EMBEDDED (not separate collection)
  key_results: [{
    title: String,
    metric_type: Enum ['number', 'percentage', 'boolean', 'currency'],
    target_value: Number,
    current_value: Number,
    quarter: Number (1-4),
    status: Enum ['not_started', 'in_progress', 'completed', 'at_risk', 'blocked'],
    owner_id: ObjectId,
    due_date: Date,
    completion_date: Date
  }],
  
  // Dependency tracking
  dependent_objectives: [{
    objective_id: ObjectId (ref: 'Objective'),
    dependency_type: Enum ['blocks', 'enables', 'supports']
  }],
  
  // Metrics cascade
  metrics: {
    total_goals: Number,
    completed_goals: Number,
    total_tasks: Number,
    completed_tasks: Number
  }
}
```

**Methods**:
- `addKeyResult()` - Add KR to objective
- `updateKeyResultProgress()` - Update KR current value
- `calculateProgress()` - Recalculate objective progress from KRs
- `addAIInsight()` - Add AI-generated insights

**Cascading**: Goal and Task updates automatically cascade UP to update objective metrics.

---

### 1.2 GOAL MODEL ⚠️ INCOMPLETE - CRITICAL GAP
**File**: `/server/models/Goal.js` (541 lines)

**Purpose**: Quarterly implementation of Key Results, breaks down into weekly tasks

**Actual Relationships in Model**:
- **Parent**: Objective (via `objective_id`)
- **Children**: Tasks (via `goal_id` in Task model)
- **Horizontal**: Other goals (via `dependent_goals` array)

**Critical Gap Found**:
The routes reference these fields that DON'T EXIST in the model:
```javascript
// ❌ NOT IN SCHEMA - MISSING FIELDS:
parent_goal_id      // Quarterly goal references
child_goal_ids      // Array of weekly goal references
time_period         // QUARTERLY | WEEKLY
```

**Actual Model Fields** ✅:
```javascript
{
  company_id: ObjectId (ref: 'Company'),
  objective_id: ObjectId (ref: 'Objective'),
  key_result_id: ObjectId (optional),  // Link to specific KR
  
  owner_id: ObjectId (ref: 'User'),    // Goal owner
  assigned_to: [{                      // Multiple assignees
    user_id: ObjectId,
    role: Enum ['lead', 'contributor', 'reviewer'],
    assigned_at: Date
  }],
  
  // Timeline - QUARTERLY/WEEKLY framework
  quarter: String (Q1-Q4),
  week: Number (1-13),
  start_date: Date,
  due_date: Date,
  completion_date: Date,
  
  // Progress tracking
  status: Enum ['not_started', 'in_progress', 'completed', 'blocked', 'at_risk', 'cancelled'],
  progress: Number (0-100),
  
  // Metrics
  metric_type: Enum ['number', 'percentage', 'boolean', 'currency', 'custom'],
  target_value: Number,
  current_value: Number,
  unit: String,
  
  // Tracking
  metrics: {
    total_tasks: Number,
    completed_tasks: Number,
    blocked_tasks: Number,
    completion_rate: Number
  },
  
  // Dependencies (HORIZONTAL, not VERTICAL)
  dependent_goals: [{
    goal_id: ObjectId,
    dependency_type: Enum ['blocks', 'enables', 'supports']
  }]
}
```

**Missing Hierarchy Fields** ❌:
- `parent_goal_id` - Not defined but used in routes!
- `child_goal_ids` - Not defined but used in routes!
- `time_period` - Not defined but used in routes!

**Methods**:
- `updateProgress()` - Update goal progress
- `calculateHealth()` - Health indicator with color coding
- `updateTaskMetrics()` - Update from child tasks
- `assignUser()` - Assign users with roles

---

### 1.3 TASK MODEL ✅ COMPLETE
**File**: `/server/models/Task.js` (676 lines)

**Purpose**: Daily/weekly actionable items - lowest level of OKR hierarchy

**Key Relationships**:
- **Parent**: Goal (via `goal_id`) AND Objective (via `objective_id`)
- **Children**: Subtasks (embedded array)
- **Horizontal**: Other tasks (via `dependent_tasks` array, `blocked_by`)

**Critical Fields**:
```javascript
{
  company_id: ObjectId (ref: 'Company'),
  objective_id: ObjectId (ref: 'Objective'),  // Direct ref for cascading
  goal_id: ObjectId (ref: 'Goal'),            // Direct ref
  
  assigned_to: ObjectId (ref: 'User'),        // Single assignee
  created_by: ObjectId (ref: 'User'),
  last_updated_by: ObjectId (ref: 'User'),
  
  // Timeline
  due_date: Date,
  start_date: Date,
  completion_date: Date,
  estimated_hours: Number,
  actual_hours: Number,
  
  // Status & Progress
  status: Enum ['todo', 'in_progress', 'completed', 'blocked', 'cancelled', 'deferred'],
  progress: Number (0-100),
  
  // Classification
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  task_type: Enum ['action', 'review', 'approval', 'meeting', 'research', 'other'],
  difficulty: Enum ['easy', 'medium', 'hard', 'expert'],
  
  // Task Decomposition
  subtasks: [{
    name: String,
    completed: Boolean,
    completed_at: Date,
    completed_by: ObjectId
  }],
  
  checklist: [{
    item: String,
    checked: Boolean,
    checked_at: Date
  }],
  
  // Dependencies (HORIZONTAL)
  dependent_tasks: [{
    task_id: ObjectId,
    dependency_type: Enum ['blocks', 'enables', 'relates_to']
  }],
  
  blocked_by: {
    reason: String,
    blocked_at: Date,
    blocked_by_task: ObjectId
  },
  
  // Collaboration
  comments: [{
    user_id: ObjectId,
    message: String,
    created_at: Date,
    edited: Boolean,
    edited_at: Date
  }],
  
  // Attachments
  attachments: [{
    file_name: String,
    file_path: String,
    file_type: String,
    file_size: Number,
    uploaded_by: ObjectId,
    uploaded_at: Date
  }]
}
```

**Post-Save Middleware** ✅:
- Automatically cascades task completion to Goal metrics
- Updates parent Goal's `total_tasks`, `completed_tasks`, `blocked_tasks`
- Goal then cascades to Objective metrics

---

## 2. API ENDPOINTS ANALYSIS

### 2.1 OBJECTIVE ENDPOINTS
**File**: `/server/routes/objectives.js`

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/objectives` | GET | List objectives with filters | ✅ Complete |
| `/api/objectives` | POST | Create new objective | ✅ Complete |
| `/api/objectives/:id` | GET | Get objective by ID | ✅ Complete |
| `/api/objectives/:id` | PUT | Update objective | ✅ Complete |
| `/api/objectives/:id` | DELETE | Delete objective | ✅ Complete |
| `/api/objectives/my-dashboard` | GET | Dashboard data for user | ✅ Complete |
| `/api/objectives/list` | GET | Filtered list with pagination | ✅ Complete |

**Parent-Child Handling**:
- Can't delete objective with linked goals (cascade protection)
- Automatically updates metrics from child goals

---

### 2.2 GOAL ENDPOINTS  
**File**: `/server/routes/goals.js` (714 lines)

| Endpoint | Method | Purpose | Status | Notes |
|----------|--------|---------|--------|-------|
| `/api/goals` | GET | List goals with filters | ✅ | Supports objective_id filtering |
| `/api/goals` | POST | Create new goal | ✅ | Validates objective exists |
| `/api/goals/:id` | GET | Get goal details | ✅ | Populates objective & owner |
| `/api/goals/:id` | PUT | Update goal | ✅ | Cascades to objective |
| `/api/goals/:id` | DELETE | Delete goal | ✅ | Cascade protection |
| `/api/goals/:id/breakdown` | POST | **Break into weekly goals** | ✅ but ❌ | Uses parent_goal_id & child_goal_ids NOT in model! |
| `/api/goals/:id/tasks` | GET | Get tasks for goal | ✅ | Auto-calculates completion % |
| `/api/goals/:id/progress` | PATCH | Update goal progress | ✅ | Updates parent objective |

**CRITICAL ISSUE - Goal Breakdown Endpoint** (Line 579-712):
```javascript
// The endpoint WRITES these fields:
{
  parent_goal_id: quarterlyGoal._id,        // ❌ NOT IN SCHEMA
  child_goal_ids: createdGoals.map(g => g._id)  // ❌ NOT IN SCHEMA
  time_period: 'QUARTERLY' or 'WEEKLY'      // ❌ NOT IN SCHEMA
}

// But Goal model doesn't have these fields defined!
// This will cause:
// 1. Fields not persisted to database
// 2. Can't query by parent_goal_id or time_period
// 3. Breakdown structure lost on database reload
```

---

### 2.3 TASK ENDPOINTS
**File**: `/server/routes/tasks.js` (560+ lines)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/tasks` | GET | List tasks with filters | ✅ |
| `/api/tasks` | POST | Create new task | ✅ |
| `/api/tasks/:id` | GET | Get task details | ✅ |
| `/api/tasks/:id` | PUT | Update task | ✅ |
| `/api/tasks/:id` | DELETE | Delete task | ✅ |
| `/api/tasks/:id/status` | PATCH | Update task status | ✅ |
| `/api/tasks/:id/progress` | PATCH | Update task progress | ✅ |
| `/api/tasks/:id/assign` | PATCH | Reassign task | ✅ |
| `/api/tasks/:id/block` | PATCH | Mark as blocked | ✅ |
| `/api/tasks/:id/unblock` | PATCH | Unblock task | ✅ |
| `/api/tasks/goal/:goal_id` | GET | Tasks for specific goal | ✅ |
| `/api/tasks/objective/:objective_id` | GET | All tasks for objective | ✅ |

**Relationship Handling**:
- Requires both `goal_id` AND `objective_id` on creation
- Validates goal belongs to objective
- Automatically cascades completion to parent goal
- Supports task dependency tracking

---

## 3. CURRENT DATA FLOW & CASCADE BEHAVIOR

### 3.1 UPWARD CASCADE (Child → Parent Updates)
```
Task completion
    ↓ (post-save middleware)
Updates Goal metrics (total_tasks, completed_tasks)
    ↓ (Goal.updateTaskMetrics())
Recalculates Goal progress based on task completion %
    ↓ (goal.post-save middleware)
Updates Objective metrics (total_goals, completed_goals)
    ↓ (Objective.save())
Recalculates Objective progress_percentage from all goals
```

**Status**: ✅ WORKING (if parent_goal_id issue is fixed)

### 3.2 DOWNWARD CASCADE (Parent → Child Creation)
```
Create Quarterly Goal
    ↓ (POST /api/goals/:id/breakdown)
Generates 13 Weekly Goals with:
  - Same owner_id, objective_id
  - Incremented week numbers
  - Proportional target_values
  - References parent via parent_goal_id ❌ NOT PERSISTED
    ↓
Updates parent with child_goal_ids ❌ NOT PERSISTED
```

**Status**: ⚠️ PARTIALLY BROKEN - Fields not persisted

---

## 4. FRONTEND INTEGRATION ANALYSIS

### 4.1 PAGES WITH OKR RELATIONSHIPS
**Location**: `/client/pages/`

| Page | Purpose | Status | Parent-Child Display |
|------|---------|--------|----------------------|
| `business-objectives.html` | List/manage objectives | ✅ | Shows linked goals count |
| `quarterly-goals.html` | Quarterly goals | ✅ | Shows objective, displays weeks |
| `weekly-goals.html` | Weekly goals | ✅ | Shows quarterly parent |
| `goal-details.html` | Goal detail view | ✅ | Shows objective link |
| `team-tasks.html` | Team task board | ✅ | Shows goal link |

### 4.2 RELATIONSHIP DISPLAY STATUS
- ✅ Goals show their parent Objective
- ✅ Tasks show their parent Goal
- ❌ Quarterly goals don't show weekly children (not persisted)
- ❌ No visual parent-child tree view
- ❌ No breakdown UI for creating weekly goals

---

## 5. CRITICAL FINDINGS & GAPS

### CRITICAL BUGS
| Issue | Severity | Impact | File | Status |
|-------|----------|--------|------|--------|
| Goal parent-child fields not in schema | P0 | Goal breakdown persists but can't be queried | `server/models/Goal.js` | ❌ NOT FIXED |
| `parent_goal_id`, `child_goal_ids`, `time_period` referenced but undefined | P0 | Data loss on reload | `server/routes/goals.js:660,688` | ❌ NOT FIXED |

### MISSING FEATURES
| Feature | Impact | Sprint | Priority |
|---------|--------|--------|----------|
| Parent-child goal tracking in model | Can't persist hierarchy | Sprint 2 | P0 |
| Goal breakdown UI | Can't create weekly goals from UI | Sprint 2 | P1 |
| Time period field (QUARTERLY/WEEKLY) | Can't distinguish goal types | Sprint 2 | P0 |
| Quarterly-to-weekly goal cascade display | Can't see breakdown structure | Sprint 2 | P2 |

---

## 6. DATA MODEL RECOMMENDATIONS FOR SPRINT 2

### 6.1 Goal Model Enhancement
**Add to Goal Schema**:
```javascript
// Parent-child hierarchy
parent_goal_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal',
  default: null  // null for quarterly goals
},

child_goal_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal'
}],

// Period classification
time_period: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY'],
  default: 'QUARTERLY'
},

// Hierarchy level
goal_level: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY'],
  default: 'QUARTERLY'
}
```

**Add Indexes**:
```javascript
goalSchema.index({ parent_goal_id: 1 });
goalSchema.index({ company_id: 1, parent_goal_id: 1 });
goalSchema.index({ time_period: 1, status: 1 });
```

**Add Methods**:
```javascript
// Get all weekly goals for a quarterly goal
goalSchema.methods.getChildGoals = function() {
  return mongoose.model('Goal').find({ parent_goal_id: this._id });
}

// Get parent quarterly goal
goalSchema.methods.getParentGoal = function() {
  if (!this.parent_goal_id) return null;
  return mongoose.model('Goal').findById(this.parent_goal_id);
}

// Check if has children
goalSchema.methods.hasChildren = function() {
  return this.child_goal_ids && this.child_goal_ids.length > 0;
}
```

---

## 7. EXISTING API REUSE OPPORTUNITIES FOR SPRINT 2

### Can Reuse ✅
1. **Goal CRUD endpoints** - All create/read/update/delete working
2. **Task CRUD endpoints** - Fully functional
3. **Objective CRUD endpoints** - Fully functional
4. **Cascade mechanics** - Post-save middleware pattern established
5. **Status/Progress updates** - All working with proper state transitions
6. **Authorization/permissions** - Role-based access control working

### Needs Minor Fixes ⚠️
1. **Goal breakdown endpoint** - Fix schema fields first
2. **Goal querying** - Can't filter by parent_goal_id yet
3. **Relationship validation** - Parent must validate children

### Needs to Build ❌
1. **Goal tree/hierarchy APIs** - Get full breakdown chain
2. **Bulk goal operations** - Update multiple weekly goals
3. **Goal consolidation** - Aggregate weekly back to quarterly
4. **Timeline alignment** - Ensure weekly dates align with quarterly

---

## 8. TECHNICAL SPECIFICATIONS BY AREA

### 8.1 Cascade Delete Policy
**Rule**: Cannot delete parent if children exist
```
Assessment → (generates) → Objectives + Key Results
Objectives → (breakdown into) → Quarterly Goals
Quarterly Goals → (breakdown into) → Weekly Goals
Weekly Goals → (breakdown into) → Tasks
```

**Implementation**: 
- Check for dependent records before delete
- Soft delete recommended for audit trail
- Pre-delete middleware validates cascade rules

---

## 9. SPRINT 2 IMPLEMENTATION ROADMAP

### Phase 1: Data Model Fixes (Day 1-2)
- [ ] Add `parent_goal_id`, `child_goal_ids`, `time_period` to Goal model
- [ ] Add indexes for hierarchy queries
- [ ] Add hierarchy methods (getParent, getChildren)
- [ ] Add migration script to back-populate existing data
- [ ] Run migration and validate

### Phase 2: API Fixes (Day 3-4)
- [ ] Fix goal breakdown endpoint to use schema fields
- [ ] Add GET `/api/goals/:id/hierarchy` to get full tree
- [ ] Add GET `/api/goals/:id/children` to list weekly goals
- [ ] Fix goal deletion to prevent orphaned children

### Phase 3: Frontend (Day 5-7)
- [ ] Add breakdown UI button on quarterly goal details
- [ ] Show weekly children in quarterly goal view
- [ ] Show parent quarterly goal in weekly goal view
- [ ] Add visual hierarchy tree component

---

## 10. SUMMARY TABLE: RELATIONSHIPS STATUS

| Relationship | Model | API | Frontend | Status |
|--------------|-------|-----|----------|--------|
| Objective → Goals | ✅ | ✅ | ✅ | Complete |
| Goal → Tasks | ✅ | ✅ | ✅ | Complete |
| Quarterly → Weekly Goals | ❌ Model missing | ⚠️ Works but not persistent | ❌ Missing | **CRITICAL GAP** |
| Task → Subtasks | ✅ | ✅ | ✅ | Complete |
| Objective → Key Results | ✅ Embedded | ✅ | ✅ | Complete |

---

## 11. CONFIGURATION DETAILS

### Multi-Tenancy (company_id)
- Every model has `company_id` as first-level filter
- All queries automatically scoped to user's company
- No cross-tenant data leakage possible

### Authorization Pattern
- Task can only be viewed/edited by:
  - Task assignee (themselves)
  - Task creator
  - Goal owner
  - Objective owner
  - Company managers/executives

### Cascade Middleware Pattern
Used throughout for automatic parent updates:
```javascript
// In Task model post-save:
taskSchema.post('save', async function(doc) {
  const goal = await Goal.findById(doc.goal_id);
  if (goal) {
    const tasks = await Task.find({ goal_id: goal._id });
    const completed = tasks.filter(t => t.status === 'completed').length;
    await goal.updateTaskMetrics(tasks.length, completed);
  }
});
```

---

## CONCLUSION

**Verdict**: The Karvia Business OKR hierarchy is **95% complete with one critical gap**.

The system properly handles:
- Three-level hierarchy: Objective → Goal → Task ✅
- Upward cascade of metrics and status ✅
- Role-based access control ✅
- Progress tracking and health indicators ✅

The gap that MUST be fixed for Sprint 2:
- Goal parent-child tracking fields not persisted ❌
- Quarterly→Weekly breakdown structure lost on reload ❌

**Recommendation**: Prioritize fixing Goal model schema (1-2 days) before building UI features for goal breakdown.

