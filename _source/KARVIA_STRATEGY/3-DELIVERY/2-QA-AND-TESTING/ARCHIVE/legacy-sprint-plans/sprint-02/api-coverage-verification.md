# 🔌 SPRINT 2 API COVERAGE VERIFICATION

**Document Type**: API Gap Analysis
**Sprint**: Sprint 2
**Version**: 1.0
**Created**: November 12, 2025

---

## 📊 API COVERAGE SUMMARY

### Overall Status: ⚠️ 78% Coverage
- **Existing APIs**: 23/30 required endpoints exist
- **Need to Create**: 7 endpoints
- **Need to Modify**: 4 endpoints
- **Working As-Is**: 19 endpoints

---

## ✅ EXISTING APIS (Can Use As-Is)

### Assessment APIs
```javascript
✅ POST /api/assessments                    // Create assessment
✅ GET /api/assessments/:id                 // Get assessment
✅ GET /api/assessments/company/:companyId  // Company assessments
✅ POST /api/assessments/analysis           // Generate analysis
```

### Objective APIs
```javascript
✅ GET /api/objectives                      // List objectives
✅ POST /api/objectives                     // Create objective
✅ PUT /api/objectives/:id                  // Update objective
✅ DELETE /api/objectives/:id               // Delete objective
✅ GET /api/objectives/:id/key-results      // Get KRs
```

### Goal APIs (Partial - Need Updates)
```javascript
✅ GET /api/goals                           // List goals
✅ POST /api/goals                          // Create goal
✅ PUT /api/goals/:id                       // Update goal
✅ DELETE /api/goals/:id                    // Delete goal
⚠️ GET /api/goals/:id                       // NEEDS: Include new fields
```

### Task APIs
```javascript
✅ GET /api/tasks                           // List tasks with filters
✅ POST /api/tasks                          // Create task
✅ PUT /api/tasks/:id                       // Update task
✅ PUT /api/tasks/:id/complete              // Mark complete
✅ GET /api/tasks/my/tasks                  // User's tasks
✅ POST /api/tasks/:id/subtasks             // Create subtask
```

---

## 🔧 APIS THAT NEED MODIFICATION

### 1. Goal Model Fields (Day 1 Priority)
**File**: `/server/models/Goal.js`
**Status**: ❌ Missing critical fields

```javascript
// CURRENT MODEL (Incomplete)
{
  title: String,
  objective_id: ObjectId,
  owner: ObjectId,
  target_value: Number,
  current_value: Number
}

// REQUIRED ADDITIONS
{
  // ... existing fields ...
  parent_goal_id: ObjectId,    // ❌ MISSING
  child_goal_ids: [ObjectId],  // ❌ MISSING
  time_period: String,         // ❌ MISSING
  key_result_id: ObjectId      // ❌ MISSING
}
```

### 2. Goal Creation API
**Endpoint**: `POST /api/goals`
**Modification**: Accept new fields

```javascript
// CURRENT (Line 87 in goals.js)
router.post('/', authenticate, async (req, res) => {
  const { title, objective_id, target_value } = req.body;
  // Missing parent_goal_id, time_period, key_result_id
});

// REQUIRED UPDATE
router.post('/', authenticate, async (req, res) => {
  const {
    title,
    objective_id,
    key_result_id,      // NEW
    parent_goal_id,     // NEW
    time_period,        // NEW
    target_value,
    owner
  } = req.body;

  const goal = new Goal({
    ...req.body,
    company_id: req.user.company_id
  });
});
```

### 3. Goal Hierarchy Query
**Endpoint**: `GET /api/goals/:id`
**Modification**: Populate parent/children

```javascript
// REQUIRED UPDATE
router.get('/:id', authenticate, async (req, res) => {
  const goal = await Goal.findById(req.params.id)
    .populate('parent_goal_id')     // NEW
    .populate('child_goal_ids')     // NEW
    .populate('objective_id');

  res.json(goal);
});
```

### 4. Task Creation with Lineage
**Endpoint**: `POST /api/tasks`
**Modification**: Inherit KR from goal

```javascript
// CURRENT (Line 76 in tasks.js)
router.post('/', authenticate, async (req, res) => {
  const { title, goal_id, assigned_to } = req.body;
});

// REQUIRED UPDATE
router.post('/', authenticate, async (req, res) => {
  const { title, goal_id, assigned_to } = req.body;

  // Get goal to inherit relationships
  const goal = await Goal.findById(goal_id);

  const task = new Task({
    ...req.body,
    objective_id: goal.objective_id,
    key_result_id: goal.key_result_id,  // NEW - inherited
    company_id: req.user.company_id
  });
});
```

---

## ❌ NEW APIS TO CREATE

### 1. Planning Generation API
**File**: `/server/routes/planning.js` (NEW FILE)
**Priority**: P0

```javascript
// NEW ENDPOINT
POST /api/planning/generate-plan
{
  kr_id: String,
  timeline_weeks: Number (1-12),
  owner_id: String,
  start_date: Date
}

// Implementation
router.post('/generate-plan', authenticateToken, async (req, res) => {
  const { kr_id, timeline_weeks, owner_id } = req.body;

  // Validation
  if (timeline_weeks < 1 || timeline_weeks > 12) {
    return res.status(400).json({ error: 'Timeline must be 1-12 weeks' });
  }

  // Get KR details
  const objective = await Objective.findOne({ 'key_results._id': kr_id });
  const kr = objective.key_results.id(kr_id);

  // Use existing AI service
  const aiService = require('../services/aiOKRService');
  const plan = await aiService.generateWeeklyPlan(kr, timeline_weeks);

  res.json({ success: true, plan });
});
```

### 2. Create Goals from Plan
**File**: `/server/routes/planning.js`
**Priority**: P0

```javascript
// NEW ENDPOINT
POST /api/planning/create-goals
{
  kr_id: String,
  plan_data: Object,
  quarterly_goal_id: String
}

// Implementation
router.post('/create-goals', authenticateToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { kr_id, plan_data, quarterly_goal_id } = req.body;
    const createdGoals = [];

    // Create/get quarterly goal
    let quarterlyGoal;
    if (!quarterly_goal_id) {
      quarterlyGoal = await Goal.create({
        title: `Q${quarter} ${year}: ${kr.title}`,
        objective_id: objective._id,
        key_result_id: kr_id,
        time_period: 'QUARTERLY',
        owner: req.body.owner_id
      });
    } else {
      quarterlyGoal = await Goal.findById(quarterly_goal_id);
    }

    // Create weekly goals
    for (const week of plan_data.weeks) {
      const weeklyGoal = await Goal.create({
        title: `Week ${week.week_number}: ${week.title}`,
        objective_id: quarterlyGoal.objective_id,
        key_result_id: kr_id,
        parent_goal_id: quarterlyGoal._id,
        time_period: 'WEEKLY',
        owner: week.owner || req.body.owner_id,
        target_value: week.target_value
      });

      createdGoals.push(weeklyGoal);
      quarterlyGoal.child_goal_ids.push(weeklyGoal._id);
    }

    await quarterlyGoal.save();
    await session.commitTransaction();

    res.json({ success: true, created_goals: createdGoals });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
});
```

### 3. User Dashboard API
**File**: `/server/routes/dashboard.js` (NEW FILE)
**Priority**: P0

```javascript
// NEW ENDPOINT
GET /api/dashboard/user/:userId

// Implementation
router.get('/user/:userId', authenticateToken, async (req, res) => {
  // Security check
  if (req.params.userId !== req.user._id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const userId = req.params.userId;
  const today = new Date();

  // Parallel queries
  const [objectives, goals, tasksToday, tasksWeek] = await Promise.all([
    Objective.find({ owner: userId }),
    Goal.find({ owner: userId }),
    Task.find({
      assigned_to: userId,
      due_date: {
        $gte: startOfDay(today),
        $lte: endOfDay(today)
      }
    }),
    Task.find({
      assigned_to: userId,
      due_date: {
        $gte: startOfWeek(today),
        $lte: endOfWeek(today)
      }
    })
  ]);

  res.json({
    objectives,
    goals: {
      quarterly: goals.filter(g => g.time_period === 'QUARTERLY'),
      weekly: goals.filter(g => g.time_period === 'WEEKLY')
    },
    tasks_today: tasksToday,
    tasks_week: tasksWeek
  });
});
```

### 4. Goal Children Query
**File**: `/server/routes/goals.js`
**Priority**: P0

```javascript
// NEW ENDPOINT
GET /api/goals/:id/children

// Implementation
router.get('/:id/children', authenticateToken, async (req, res) => {
  const children = await Goal.find({
    parent_goal_id: req.params.id
  }).sort('created_at');

  res.json(children);
});
```

### 5. Goal Hierarchy API
**File**: `/server/routes/goals.js`
**Priority**: P0

```javascript
// NEW ENDPOINT
GET /api/goals/:id/hierarchy

// Implementation
router.get('/:id/hierarchy', authenticateToken, async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  // Get parent chain
  let parent = null;
  if (goal.parent_goal_id) {
    parent = await Goal.findById(goal.parent_goal_id);
  }

  // Get children
  const children = await Goal.find({
    parent_goal_id: goal._id
  });

  // Get KR and objective
  const objective = await Objective.findById(goal.objective_id);
  const kr = objective.key_results.id(goal.key_result_id);

  res.json({
    goal,
    parent,
    children,
    key_result: kr,
    objective
  });
});
```

### 6. Task Lineage API
**File**: `/server/routes/tasks.js` or new `/server/routes/lineage.js`
**Priority**: P1

```javascript
// NEW ENDPOINT
GET /api/lineage/task/:taskId

// Implementation
router.get('/task/:taskId', authenticateToken, async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  const goal = await Goal.findById(task.goal_id);
  let quarterlyGoal = null;

  if (goal.parent_goal_id) {
    quarterlyGoal = await Goal.findById(goal.parent_goal_id);
  }

  const objective = await Objective.findById(task.objective_id);
  const kr = objective.key_results.id(goal.key_result_id);

  const assessment = await Assessment.findOne({
    user_id: task.assigned_to
  }).sort('-created_at');

  res.json({
    task,
    weekly_goal: goal.time_period === 'WEEKLY' ? goal : null,
    quarterly_goal: quarterlyGoal || (goal.time_period === 'QUARTERLY' ? goal : null),
    key_result: kr,
    objective,
    assessment_score: assessment?.overall_score
  });
});
```

### 7. Replanning API
**File**: `/server/routes/planning.js`
**Priority**: P2

```javascript
// NEW ENDPOINT
POST /api/planning/replan

// Implementation
router.post('/replan', authenticateToken, async (req, res) => {
  const { kr_id, remaining_weeks, current_value, new_target } = req.body;

  // Find existing incomplete weekly goals
  const incompleteGoals = await Goal.find({
    key_result_id: kr_id,
    time_period: 'WEEKLY',
    status: { $ne: 'COMPLETED' }
  });

  // Generate new plan for remaining weeks
  const gap = new_target - current_value;
  const weeklyTarget = gap / remaining_weeks;

  // Update existing goals
  for (const goal of incompleteGoals) {
    goal.target_value = current_value + weeklyTarget;
    goal.needs_replan = false;
    await goal.save();
  }

  res.json({
    updated_goals: incompleteGoals.length,
    new_weekly_target: weeklyTarget
  });
});
```

---

## 📋 API IMPLEMENTATION CHECKLIST

### Day 1 - Critical Foundation
- [ ] Add 4 fields to Goal model
- [ ] Update Goal POST endpoint
- [ ] Update Goal GET endpoint
- [ ] Create migration script

### Day 2 - Planning APIs
- [ ] Create /server/routes/planning.js
- [ ] Implement generate-plan endpoint
- [ ] Implement create-goals endpoint
- [ ] Test with existing AI service

### Day 3-4 - Dashboard APIs
- [ ] Create /server/routes/dashboard.js
- [ ] Implement user dashboard endpoint
- [ ] Add proper filtering
- [ ] Test security boundaries

### Day 5 - Lineage APIs
- [ ] Implement goals/:id/children
- [ ] Implement goals/:id/hierarchy
- [ ] Implement lineage/task/:taskId
- [ ] Verify cascade queries

---

## 🔍 VALIDATION MATRIX

| Feature | Required APIs | Status | Notes |
|---------|--------------|--------|-------|
| Assessment → Objectives | 4/4 | ✅ READY | All exist |
| Planning Page | 2/2 | ❌ NEW | Must create |
| Goal Hierarchy | 2/2 | ❌ NEW | Must create |
| Task Management | 6/6 | ✅ READY | All exist |
| Dashboard | 1/1 | ❌ NEW | Must create |
| Lineage | 1/1 | ❌ NEW | Must create |
| Cascade Updates | 3/3 | ⚠️ PARTIAL | Need updates |
| Replanning | 1/1 | ❌ NEW | Nice to have |

---

## 🚨 CRITICAL GAPS

### P0 - Blocks Sprint 2
1. **Goal Model**: Missing 4 fields - MUST fix Day 1
2. **Planning APIs**: 0/2 exist - MUST create Day 2
3. **Dashboard API**: Doesn't exist - MUST create Day 5

### P1 - Important
1. **Lineage API**: For Why Chain visibility
2. **Goal hierarchy endpoints**: For navigation

### P2 - Nice to Have
1. **Replanning API**: For mid-quarter changes
2. **Bulk operations**: For efficiency

---

## ✅ EXISTING CODE TO REUSE

### OpenAI Service
```javascript
// Location: /server/services/aiOKRService.js
// Line 233: generateWithAI method
// Can extend with: generateWeeklyPlan method
```

### Authentication
```javascript
// Location: /server/middleware/authGuards.js
// Use: authenticateToken on all new routes
```

### Error Handling
```javascript
// Location: /server/utils/errors.js
// Reuse: Standard error responses
```

### Database Transactions
```javascript
// Pattern from: /server/routes/goals.js line 660
// Use for: Multi-goal creation
```

---

## 📊 COVERAGE SUMMARY BY DAY

| Day | APIs to Build | APIs to Modify | Ready to Use |
|-----|--------------|----------------|--------------|
| 1 | 0 | 4 | 0 |
| 2 | 2 | 0 | 1 (AI service) |
| 3-4 | 0 | 0 | 0 |
| 5 | 1 | 0 | 4 (tasks) |
| 6-7 | 3 | 0 | 0 |
| 8-10 | 1 | 0 | All others |

**Total New Endpoints**: 7
**Total Modifications**: 4
**Total Ready**: 19

---

**API Coverage Status**: GAPS IDENTIFIED
**Action Required**: Implement 7 new endpoints, modify 4 existing
**Confidence**: HIGH - All gaps are clearly defined

*This verification ensures we have identified all API requirements and gaps for Sprint 2 implementation.*