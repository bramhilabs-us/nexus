# 🚨 SPRINT 2 UPDATED PLAN - CRITICAL BUG FIX REQUIRED

**Sprint Name**: Goal Hierarchy Fix + Planning Page + Dashboard
**Duration**: 10 Days (November 17-28, 2025)
**Version**: UPDATED (Post Deep-Dive Analysis)
**Status**: ⚠️ CRITICAL BUG MUST BE FIXED FIRST
**Updated**: November 12, 2025

---

## 🔴 CRITICAL FINDING - P0 BUG

### The Problem:
**Goal parent-child relationships are BROKEN in the database!**

```javascript
// API writes these fields (goals.js line 660):
parent_goal_id: quarterlyGoal._id    // ❌ NOT IN SCHEMA
child_goal_ids: []                   // ❌ NOT IN SCHEMA
time_period: 'WEEKLY'                // ❌ NOT IN SCHEMA

// But Goal.js model doesn't have these fields!
// Data created but NEVER persisted to database
```

### Impact on Sprint 2:
- **Cannot** query weekly goals by parent quarterly goal
- **Cannot** distinguish quarterly vs weekly goals
- **Cannot** show goal hierarchy in UI
- **Planning page BLOCKED** without this fix

### Required Fix (25 minutes):
```javascript
// Add to Goal.js schema:
parent_goal_id: { type: Schema.Types.ObjectId, ref: 'Goal' },
child_goal_ids: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
time_period: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY', 'MONTHLY'],
  required: true
}
```

---

## 📊 EXISTING RELATIONSHIPS AUDIT

### ✅ What Works:
1. **Objective Model** - 100% Complete
   - Has `key_results` array embedded
   - Links to goals via `goal_ids`
   - Owner tracking works

2. **Task Model** - 100% Complete
   - Has `goal_id` linking to parent goal
   - Has `objective_id` for cascade
   - Has `assigned_to` for owner
   - Subtasks and dependencies work

3. **APIs** - 89% Working (25/28 endpoints)
   - Task CRUD fully functional
   - Goal CRUD mostly working
   - Objective management complete

### ❌ What's Broken:
1. **Goal Model** - Missing critical fields:
   - No `parent_goal_id`
   - No `child_goal_ids`
   - No `time_period`
   - No `key_result_id` (needed for Sprint 2)

2. **Missing APIs**:
   - GET `/api/goals/:id/children`
   - GET `/api/goals/:id/hierarchy`
   - GET `/api/lineage/task/:taskId`

---

## 🗓️ REVISED SPRINT 2 PLAN

### **Day 1: CRITICAL BUG FIX + Sprint 1**
**Date**: November 17, 2025 (Sunday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Fix ISS-S1D8-002: Timeline "At Risk" logic (1.5 hrs)
- [ ] Fix ISS-S1D8-003: Target year input (1 hr)
- [ ] Complete team results heatmap (1.5 hrs)

#### Afternoon (4 hours) - CRITICAL
- [ ] **FIX GOAL MODEL** (P0 - 1 hour):
  ```javascript
  // Add to Goal.js:
  parent_goal_id: { type: Schema.Types.ObjectId, ref: 'Goal' },
  child_goal_ids: [{ type: Schema.Types.ObjectId, ref: 'Goal' }],
  time_period: { type: String, enum: ['QUARTERLY', 'WEEKLY'], required: true },
  key_result_id: { type: Schema.Types.ObjectId, ref: 'Objective.key_results' }
  ```
- [ ] Create migration script (30 min)
- [ ] Run migration to fix existing data (30 min)
- [ ] Test goal hierarchy queries (1 hour)
- [ ] Update goal APIs to use new fields (1 hour)

**Deliverable**: Goal model fixed, Sprint 1 complete

---

### **Day 2: Planning APIs with Hierarchy**
**Date**: November 18, 2025 (Monday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Create API: POST /api/planning/generate-plan
  ```javascript
  // Must set proper parent-child relationships:
  {
    quarterly_goal_id: "parent_id",
    weekly_goals: [...],
    time_period: "WEEKLY"
  }
  ```
- [ ] Use existing OpenAI service for generation
- [ ] Ensure parent_goal_id is set on all weekly goals

#### Afternoon (4 hours)
- [ ] Create API: GET /api/goals/:id/children
- [ ] Create API: GET /api/goals/:id/hierarchy
- [ ] Create API: GET /api/lineage/task/:taskId
- [ ] Test all parent-child queries

**Deliverable**: Planning APIs with proper relationships

---

### **Day 3: Planning Page Frontend**
**Date**: November 19, 2025 (Tuesday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Create planning.html (reuse objectives.html structure)
- [ ] Implement objective tabs (reuse existing CSS)
- [ ] Build KR cards showing planning status
- [ ] Query goals to show "X of 12 weeks planned"

#### Afternoon (4 hours)
- [ ] Planning form with timeline/owner
- [ ] Connect to generate-plan API
- [ ] Ensure weekly goals created with:
  - `parent_goal_id` set
  - `time_period: 'WEEKLY'`
  - `key_result_id` set

**Deliverable**: Planning page creating proper hierarchies

---

### **Day 4: Task Creation with Full Lineage**
**Date**: November 20, 2025 (Wednesday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Update task creation to include:
  ```javascript
  {
    goal_id: weeklyGoal._id,
    objective_id: objective._id,
    key_result_id: kr._id,
    assigned_to: owner._id
  }
  ```
- [ ] Test full lineage: Task → Weekly → Quarterly → KR → Objective

#### Afternoon (4 hours)
- [ ] Create task breakdown UI
- [ ] Show Why Chain on task cards
- [ ] Test lineage API responses

**Deliverable**: Tasks with complete parent relationships

---

### **Day 5: Dashboard Data Layer**
**Date**: November 21, 2025 (Thursday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Create dashboard API:
  ```javascript
  GET /api/dashboard/user/:userId
  // Must return properly filtered:
  {
    objectives: [], // where owner_id = userId
    key_results: [], // from owned objectives
    quarterly_goals: [], // where owner = userId & time_period = 'QUARTERLY'
    weekly_goals: [], // where owner = userId & time_period = 'WEEKLY'
    tasks_today: [], // where assigned_to = userId & due = today
    tasks_week: [] // where assigned_to = userId & week = current
  }
  ```

#### Afternoon (4 hours)
- [ ] Optimize queries with proper indexes
- [ ] Test filtering by user
- [ ] Verify parent relationships in response

**Deliverable**: Dashboard API with proper filtering

---

### **Day 6: Dashboard Frontend - Structure**
**Date**: November 22, 2025 (Friday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Create dashboard.html
- [ ] Build Today/This Week tabs
- [ ] Context bar showing:
  - User's objective (from owner_id)
  - Active KR (from key_result_id)
  - Current goal (from parent_goal_id chain)

#### Afternoon (4 hours)
- [ ] Task list with priority by due time
- [ ] Show KR context on each task
- [ ] Connect to dashboard API

**Deliverable**: Dashboard showing proper relationships

---

### **Day 7: Dashboard - Real-time Updates**
**Date**: November 25, 2025 (Monday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Implement task checkbox → backend update
- [ ] Update progress through hierarchy:
  - Task complete → Update weekly goal progress
  - Weekly progress → Update quarterly goal
  - Quarterly progress → Update KR progress

#### Afternoon (4 hours)
- [ ] Test cascade updates
- [ ] Add loading states
- [ ] Error handling

**Deliverable**: Real-time updates with cascade

---

### **Day 8: Integration Testing**
**Date**: November 26, 2025 (Tuesday)
**Hours**: 8

#### Full Flow Testing:
- [ ] Create Objective with KRs
- [ ] Use Planning page to create quarterly goals (with key_result_id)
- [ ] Break down to weekly goals (with parent_goal_id)
- [ ] Create tasks from weekly goals (with full lineage)
- [ ] View in Dashboard with proper filtering
- [ ] Complete task and verify cascade updates

**Deliverable**: End-to-end flow working

---

### **Day 9: Bug Fixes & Polish**
**Date**: November 27, 2025 (Wednesday)
**Hours**: 8

- [ ] Fix any relationship bugs found
- [ ] Verify all parent-child links
- [ ] Performance optimization
- [ ] Cross-browser testing

**Deliverable**: Stable, bug-free implementation

---

### **Day 10: Documentation & Deployment**
**Date**: November 28, 2025 (Thursday)
**Hours**: 8

- [ ] Document relationship model
- [ ] Create user guide
- [ ] Deploy to staging
- [ ] Sprint retrospective

**Deliverable**: Sprint 2 complete!

---

## 🔑 CRITICAL SUCCESS FACTORS

### Must Verify on Every Goal/Task Creation:

```javascript
// QUARTERLY GOAL must have:
{
  objective_id: objectiveId,
  key_result_id: krId,
  time_period: 'QUARTERLY',
  owner: userId
}

// WEEKLY GOAL must have:
{
  objective_id: objectiveId,
  key_result_id: krId,
  parent_goal_id: quarterlyGoalId,
  time_period: 'WEEKLY',
  owner: userId
}

// TASK must have:
{
  goal_id: weeklyGoalId,
  objective_id: objectiveId,
  key_result_id: krId,
  assigned_to: userId
}
```

---

## ⚠️ DEPENDENCY VALIDATION CHECKLIST

### Before Starting Sprint 2:
- [ ] Confirm Goal.js is modifiable
- [ ] Check no hardcoded queries assuming old schema
- [ ] Verify migration won't break existing data
- [ ] Ensure indexes exist for parent_goal_id queries

### During Development:
- [ ] Every goal creation sets time_period
- [ ] Every weekly goal has parent_goal_id
- [ ] Every task has complete lineage
- [ ] Dashboard filters by correct user fields

### Testing Requirements:
- [ ] Can query all weekly goals for a quarterly goal
- [ ] Can trace from task back to objective
- [ ] Dashboard shows only user's items
- [ ] Progress cascades up correctly

---

## 📊 UPDATED RISK MATRIX

| Risk | Impact | Mitigation |
|------|--------|------------|
| Goal model migration fails | CRITICAL | Test on dev first, backup prod |
| Existing goals lack parent_goal_id | HIGH | Migration script to infer relationships |
| Performance with nested queries | MEDIUM | Add indexes on all foreign keys |
| Dashboard slow with full lineage | LOW | Cache lineage, paginate tasks |

---

## 🎯 DEFINITION OF DONE

### Planning Page:
- [ ] Creates quarterly goals with key_result_id
- [ ] Creates weekly goals with parent_goal_id
- [ ] All goals have time_period set
- [ ] Can query hierarchy correctly

### Dashboard:
- [ ] Shows only logged user's tasks
- [ ] Displays correct KR context
- [ ] Updates cascade up hierarchy
- [ ] Today/Week tabs filter correctly

### Data Integrity:
- [ ] No orphaned goals (missing parent)
- [ ] No tasks without goal_id
- [ ] All relationships queryable
- [ ] Cascade delete works

---

**CRITICAL**: Day 1 afternoon MUST fix the Goal model schema. Without this, the entire Sprint 2 is blocked. This is a P0 bug that affects all goal hierarchy features.

**Confidence Level**: HIGH (after bug fix)
**Risk Level**: MEDIUM (migration required)
**Estimated Completion**: 100% achievable if Day 1 fix succeeds

---

*This updated plan addresses the critical Goal model bug discovered in deep-dive analysis and ensures all parent-child relationships are properly established throughout the system.*