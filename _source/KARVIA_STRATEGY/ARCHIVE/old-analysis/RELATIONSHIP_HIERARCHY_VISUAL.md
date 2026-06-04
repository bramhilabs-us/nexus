# KARVIA BUSINESS - OKR HIERARCHY VISUAL MAP

## Overall Hierarchy Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         COMPANY                              │
│                     (Multi-Tenant)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ├─ company_id (primary tenant key)
                       └─ employees_count, subscription, features
                       
┌──────────────────────┴──────────────────────────────────────┐
│                   BUSINESS ASSESSMENT                         │
│              (Speed/Strength/Intelligence Scores)            │
│  - Generated from structured questionnaire                   │
│  - AI-powered scoring (OpenAI)                               │
│  - Generates initial OKR recommendations                     │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─ assessment_id (lineage tracking)
           └─ Can generate 3-10 suggested objectives
           
┌──────────┴──────────────────────────────────────────────────┐
│            OBJECTIVE (Yearly business goals)                  │
│                      ✅ COMPLETE MODEL                       │
│                                                               │
│  Fields:                                                      │
│  ├─ title: "Increase market presence"                        │
│  ├─ category: ['revenue','operational','market','etc']       │
│  ├─ owner_id: User who owns this objective                   │
│  ├─ target_year: 2025                                        │
│  ├─ status: ['draft','active','completed','at_risk']         │
│  ├─ progress_percentage: 0-100 (calc from KRs)              │
│  │                                                           │
│  └─ KEY RESULTS (Embedded array - 2-5 per objective)        │
│     Each KR contains:                                        │
│     ├─ title: "Achieve $2M in new contracts"                │
│     ├─ metric_type: 'number'|'percentage'|'currency'        │
│     ├─ target_value: 2000000                                │
│     ├─ current_value: 0 → 2000000                           │
│     ├─ quarter: 1|2|3|4 (when to achieve)                   │
│     └─ status: auto-updated from progress                    │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─ objective_id (primary key)
           ├─ Can have 2-15 quarterly goals
           └─ Metrics auto-update from child goals
           
┌──────────┴──────────────────────────────────────────────────┐
│        QUARTERLY GOAL (Q1, Q2, Q3, Q4 per objective)         │
│                      ⚠️ INCOMPLETE - MISSING FIELDS         │
│                                                               │
│  WHAT EXISTS:                                                │
│  ├─ name: "Q1 New Client Onboarding"                        │
│  ├─ owner_id: User who owns this goal                        │
│  ├─ quarter: 'Q1'|'Q2'|'Q3'|'Q4'                            │
│  ├─ week: undefined for quarterly (used for weekly)          │
│  ├─ status: ['not_started','in_progress','completed']       │
│  ├─ progress: 0-100 (auto from tasks)                       │
│  ├─ target_value: 50 new clients                            │
│  ├─ key_result_id: optional link to specific KR             │
│  └─ assigned_to: [{user_id, role, assigned_at}]             │
│                                                               │
│  ❌ WHAT'S MISSING (but used in routes!):                   │
│  ├─ parent_goal_id: null (always for quarterly)             │
│  ├─ child_goal_ids: [] (populated on breakdown)             │
│  └─ time_period: 'QUARTERLY'                                │
│                                                               │
│  CRITICAL BUG:                                               │
│  ├─ Routes WRITE these fields                                │
│  ├─ But schema DOESN'T DEFINE them                           │
│  ├─ So data is NOT persisted to MongoDB                      │
│  └─ Breakdown structure is LOST on server restart            │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─ goal_id (primary key)
           ├─ Can be broken down into 13 weekly goals
           ├─ POST /api/goals/:id/breakdown creates children
           └─ Metrics auto-update from child tasks
           
┌──────────┴──────────────────────────────────────────────────┐
│       WEEKLY GOAL (Week 1-13 of a quarterly goal)            │
│                      ⚠️ INCOMPLETE - MISSING FIELDS         │
│                                                               │
│  WHAT EXISTS:                                                │
│  ├─ name: "Q1 New Client Onboarding - Week 1"               │
│  ├─ owner_id: Same as quarterly parent                       │
│  ├─ quarter: 'Q1' (inherited from parent)                   │
│  ├─ week: 1-13 (specific week number)                       │
│  ├─ start_date: Mon of that week                            │
│  ├─ due_date: Fri of that week                              │
│  ├─ target_value: proportional (parent / 13)                │
│  └─ status: auto from task completion                        │
│                                                               │
│  ❌ WHAT'S MISSING:                                         │
│  ├─ parent_goal_id: ID of quarterly parent ← CRITICAL      │
│  ├─ child_goal_ids: [] (empty, has tasks not weekly)        │
│  └─ time_period: 'WEEKLY'                                   │
│                                                               │
│  DATA FLOW:                                                  │
│  ├─ Generated by breakdown endpoint                          │
│  ├─ Assigned parent_goal_id: quarterlyGoal._id              │
│  ├─ But... field doesn't exist in schema!                   │
│  └─ Value is lost, relationship broken                       │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─ goal_id (primary key)
           ├─ Can have 3-20 tasks
           ├─ Tasks reference via goal_id
           └─ Metrics auto-update from task completion
           
┌──────────┴──────────────────────────────────────────────────┐
│              TASK (Daily/Weekly actions)                      │
│                      ✅ COMPLETE MODEL                       │
│                                                               │
│  Fields:                                                      │
│  ├─ name: "Call 3 new prospects"                            │
│  ├─ goal_id: Parent weekly goal ID                          │
│  ├─ objective_id: Direct ref to objective (for cascade)     │
│  ├─ assigned_to: User who owns this task                    │
│  ├─ due_date: Specific deadline                             │
│  ├─ status: ['todo','in_progress','completed','blocked']    │
│  ├─ progress: 0-100                                         │
│  ├─ priority: ['low','medium','high','urgent']              │
│  ├─ task_type: ['action','review','meeting','etc']          │
│  │                                                           │
│  ├─ DECOMPOSITION:                                          │
│  │  ├─ subtasks: [{name,completed,completed_at}]           │
│  │  └─ checklist: [{item,checked,checked_at}]              │
│  │                                                           │
│  ├─ COLLABORATION:                                          │
│  │  ├─ comments: [{user_id,message,created_at}]            │
│  │  └─ attachments: [{file_name,file_path,etc}]            │
│  │                                                           │
│  └─ DEPENDENCIES (Horizontal):                              │
│     ├─ dependent_tasks: [{task_id,dependency_type}]        │
│     └─ blocked_by: {reason,blocked_at,blocked_by_task}     │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─ task_id (primary key)
           └─ POST-SAVE MIDDLEWARE cascades metrics up!
           
┌──────────┴──────────────────────────────────────────────────┐
│                    SUBTASKS (Embedded)                        │
│                      ✅ COMPLETE MODEL                       │
│                                                               │
│  Simple array of checkbox items                              │
│  ├─ name: "Email 3 prospects"                               │
│  ├─ completed: true|false                                   │
│  └─ completed_at: Date                                      │
└────────────────────────────────────────────────────────────┘
```

---

## RELATIONSHIP SUMMARY TABLE

| From | To | Type | Field | Status | Notes |
|------|----|----|-------|--------|-------|
| Objective | Goals | Parent→Child | goal_id in Goal | ✅ Works | Can list goals by objective_id |
| Goal | Tasks | Parent→Child | goal_id in Task | ✅ Works | Can list tasks by goal_id |
| Task | Subtasks | Parent→Child | Embedded array | ✅ Works | Subtasks always in-memory |
| Quarterly Goal | Weekly Goals | Parent→Child | ❌ parent_goal_id | ⚠️ Broken | Field not in schema! |
| Weekly Goal | Quarterly Goal | Child→Parent | ❌ parent_goal_id | ⚠️ Broken | Can't trace back up |
| Goal | Goal | Horizontal | dependent_goals[] | ✅ Works | blocks/enables/supports |
| Task | Task | Horizontal | dependent_tasks[] | ✅ Works | blocks/enables/relates_to |
| Objective | Key Results | Parent→Child | Embedded array | ✅ Works | Always in-memory |

---

## CASCADE MECHANICS

### UPWARD CASCADE (Child Changes → Parent Updates)

```
TRIGGER: Task saved
    ↓
POST-SAVE MIDDLEWARE in Task model
    ↓
Query Goal.find({goal_id: doc.goal_id})
    ↓
Call goal.updateTaskMetrics()
    ↓
Updates:
  └─ metrics.total_tasks
  └─ metrics.completed_tasks  
  └─ metrics.blocked_tasks
  └─ progress (recalculated as %)
    ↓
Goal.save()
    ↓
POST-SAVE MIDDLEWARE in Goal model
    ↓
Query Objective.findById(doc.objective_id)
    ↓
Call objective metrics update
    ↓
Updates objective progress from all goals
    ↓
Objective.save() ✅ COMPLETE CHAIN
```

**Status**: ✅ FULLY WORKING (tested and confirmed)

---

### DOWNWARD CASCADE (Parent Creation → Child Generation)

```
TRIGGER: POST /api/goals/:id/breakdown
    ↓
Load quarterly goal
    ↓
Generate 13 weekly goals:
  For week 1..13:
    ├─ Create object with:
    │  ├─ name: "Goal - Week N"
    │  ├─ week: N
    │  ├─ target_value: parent / 13
    │  └─ parent_goal_id: quarterly._id ❌ NOT IN SCHEMA
    │  └─ time_period: 'WEEKLY' ❌ NOT IN SCHEMA
    ↓
Goal.insertMany(weeklyGoals)
    ↓
Fields get created in DB but DON'T PERSIST
    ↓
Update parent:
    ├─ child_goal_ids: [created goal IDs] ❌ NOT IN SCHEMA
    └─ Parent.save()
    ↓
Fields get created in DB but DON'T PERSIST ❌ BROKEN
```

**Status**: ❌ PARTIALLY BROKEN - Structure created but not persisted

---

## AUTHORIZATION HIERARCHY

```
OBJECTIVE:
├─ OWNER can: view, edit, delete, add KRs
├─ ASSIGNED_TO (multiple) can: view, update progress
├─ MANAGER+ can: override, delegate
└─ EMPLOYEE can: view only (if assigned or in department)

GOAL:
├─ OWNER can: view, edit, delete, breakdown
├─ ASSIGNED_TO can: view, update progress
└─ MANAGER+ can: assign, reassign

TASK:
├─ ASSIGNED_TO can: view, update status/progress, comment
├─ CREATED_BY can: view, edit
├─ GOAL_OWNER can: reassign, update
└─ MANAGER+ can: force complete, override
```

---

## MULTI-TENANCY ISOLATION

Every relationship respects `company_id`:

```
Goal.find({
  company_id: req.user.company_id,  ← ALWAYS first filter
  objective_id: objectiveId          ← Then filter by relationship
})
```

No cross-tenant data leakage possible because:
1. Every model has `company_id` index
2. All queries filter by company first
3. No global queries exist
4. API middleware validates company context

---

## CRITICAL FIX NEEDED FOR SPRINT 2

### The Problem
```javascript
// In routes/goals.js line 660:
weekly_goal = {
  ...
  parent_goal_id: quarterlyGoal._id,  // ❌ WRITES TO FIELD
  time_period: 'WEEKLY'               // ❌ WRITES TO FIELD
}

// But in models/Goal.js - these fields don't exist!
// So insertMany() creates docs but fields aren't persisted
// They disappear on next server restart!
```

### The Solution
```javascript
// ADD TO Goal Schema:
parent_goal_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal',
  index: true,
  default: null
},

child_goal_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal'
}],

time_period: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY'],
  default: 'QUARTERLY',
  index: true
}
```

### Impact
- ✅ Goal breakdown will persist correctly
- ✅ Can query weekly goals by parent_goal_id
- ✅ Can find all goals of type QUARTERLY or WEEKLY
- ✅ Frontend can show full hierarchy tree
- ✅ Relationship data not lost on restart

---

## API ENDPOINTS BY RELATIONSHIP TYPE

### Objective → Goal Relationship
```
Create:  POST /api/goals/
         {objective_id, name, owner_id, quarter, week, due_date, ...}

List:    GET /api/goals?objective_id=xyz
         
Get:     GET /api/goals/:id
         ├─ Includes objective details
         └─ Shows all assigned users

Update:  PUT /api/goals/:id
         └─ Can change owner, reassign users

Delete:  DELETE /api/goals/:id
         └─ Cascade protection (must delete tasks first)
```

### Goal → Task Relationship
```
Create:  POST /api/tasks/
         {goal_id, objective_id, name, assigned_to, due_date, ...}

List:    GET /api/tasks?goal_id=xyz
         
Get:     GET /api/tasks/:id
         ├─ Includes goal details
         └─ Shows objective

Update:  PUT /api/tasks/:id
         └─ Can update goal reference

Delete:  DELETE /api/tasks/:id
         └─ Auto-cascades to goal metrics
```

### Quarterly → Weekly Goal Relationship ❌ NEEDS WORK
```
Create:  POST /api/goals/:id/breakdown
         └─ ❌ parent_goal_id not persisted!

List:    GET /api/goals?parent_goal_id=xyz
         └─ ❌ Can't work - field not in model!

Get:     GET /api/goals/:id/children
         └─ ❌ Endpoint doesn't exist

Delete:  DELETE /api/goals/:id
         └─ ❌ Should cascade to weekly children
```

---

## SPRINT 2 CHECKLIST

### Before Building UI
- [ ] Add parent_goal_id to Goal schema
- [ ] Add child_goal_ids to Goal schema  
- [ ] Add time_period to Goal schema
- [ ] Create migration to back-populate existing data
- [ ] Run migration and verify data

### API Endpoints to Add
- [ ] GET /api/goals/:id/hierarchy (full tree)
- [ ] GET /api/goals/:id/children (weekly goals)
- [ ] PUT /api/goals/:id/children (bulk update)

### Frontend Pages to Update
- [ ] goal-details.html - show weekly children
- [ ] weekly-goals.html - show quarterly parent
- [ ] quarterly-goals.html - add breakdown button

### Testing
- [ ] Create quarterly goal
- [ ] Breakdown into weekly goals
- [ ] Verify parent_goal_id is persisted
- [ ] Query weekly goals by parent_goal_id
- [ ] Update weekly goal, check parent updates
- [ ] Delete quarterly with children (should fail)

