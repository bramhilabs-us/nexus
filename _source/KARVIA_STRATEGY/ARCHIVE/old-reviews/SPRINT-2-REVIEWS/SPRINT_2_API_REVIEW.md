# 🔌 SPRINT 2 API REVIEW & VALIDATION

**Review Date**: November 12, 2025
**Sprint**: SPRINT_2 - Goal Management & Task Execution
**Focus**: API Endpoints Analysis & Validation
**Reviewer**: API Architecture Team

---

## 📊 EXECUTIVE SUMMARY

### Overview
Sprint 2 plans to add 2 new API endpoints while reusing 24+ existing endpoints. The backend is reportedly 100% complete for goals and tasks.

### Key Findings
- ✅ **EXCELLENT**: 92% API reuse (24 of 26 endpoints exist)
- ⚠️ **CONCERN**: New cascading endpoint adds unnecessary complexity
- ⚠️ **MISSING**: "Why Chain" lineage API not found
- ✅ **POSITIVE**: All CRUD operations already implemented
- ⚠️ **RISK**: Planned schema changes could break existing APIs

---

## 🆕 NEW APIS PLANNED

### 1. Auto-Breakdown API (Questionable Need)
```javascript
POST /api/objectives/:objectiveId/key-results/:krId/breakdown
```

**Purpose**: Auto-create quarterly goals from a key result

**Request Payload**:
```json
{
  "breakdown_strategy": "quarterly" | "manual",
  "quarters": ["Q1", "Q2", "Q3", "Q4"],
  "target_division": "equal" | "weighted" | "custom",
  "custom_targets": [250000, 300000, 350000, 400000]
}
```

**Analysis**:
- ⚠️ **Over-engineered** for MVP
- Could be handled client-side
- Adds maintenance burden
- Not critical for goal management

**Recommendation**: **DEFER TO SPRINT 3**

---

### 2. Task Lineage API (Critical)
```javascript
GET /api/tasks/:taskId/lineage
```

**Purpose**: Get complete "Why Chain" from task to assessment

**Expected Response**:
```json
{
  "task_id": "task_123",
  "task_title": "Contact 50 Leads",
  "weekly_goal": {
    "id": "goal_456",
    "title": "Close 10 Deals Q1",
    "progress": 40
  },
  "quarterly_goal": {
    "id": "goal_789",
    "title": "Increase Revenue 25%",
    "progress": 35
  },
  "objective": {
    "id": "obj_012",
    "title": "Improve Financial Strength",
    "progress": 28
  },
  "assessment": {
    "id": "assess_345",
    "dimension": "strength",
    "score": 5.5
  },
  "impact_percentage": 0.4
}
```

**Analysis**:
- ✅ **CRITICAL** for user motivation
- ⚠️ **MISSING** from current codebase
- Simple aggregation of existing data
- Should be built early, not Day 10

**Recommendation**: **BUILD ON DAY 2**

---

## ✅ EXISTING APIs TO REUSE

### Goal Management APIs (11 endpoints)
| Method | Endpoint | Status | Usage in Sprint 2 |
|--------|----------|--------|-------------------|
| GET | /api/goals | ✅ EXISTS | List quarterly/weekly goals |
| GET | /api/goals/:id | ✅ EXISTS | Goal details page |
| POST | /api/goals | ✅ EXISTS | Create new goal |
| PUT | /api/goals/:id | ✅ EXISTS | Update goal |
| DELETE | /api/goals/:id | ✅ EXISTS | Delete goal |
| GET | /api/goals/:id/children | ✅ EXISTS | Get child goals |
| GET | /api/goals/:id/tasks | ✅ EXISTS | Get goal's tasks |
| PUT | /api/goals/:id/progress | ✅ EXISTS | Update progress |
| GET | /api/goals/by-objective/:id | ✅ EXISTS | Goals for objective |
| GET | /api/goals/by-owner/:userId | ✅ EXISTS | User's goals |
| GET | /api/goals/by-quarter/:quarter | ✅ EXISTS | Quarterly filtering |

**Finding**: All needed goal APIs already exist!

### Task Management APIs (13 endpoints)
| Method | Endpoint | Status | Usage in Sprint 2 |
|--------|----------|--------|-------------------|
| GET | /api/tasks | ✅ EXISTS | List tasks |
| GET | /api/tasks/:id | ✅ EXISTS | Task details |
| POST | /api/tasks | ✅ EXISTS | Create task |
| PUT | /api/tasks/:id | ✅ EXISTS | Update task |
| DELETE | /api/tasks/:id | ✅ EXISTS | Delete task |
| PUT | /api/tasks/:id/assign | ✅ EXISTS | Assign task |
| PUT | /api/tasks/:id/status | ✅ EXISTS | Update status |
| PUT | /api/tasks/:id/progress | ✅ EXISTS | Update progress |
| PUT | /api/tasks/:id/complete | ✅ EXISTS | Mark complete |
| PUT | /api/tasks/:id/uncomplete | ✅ EXISTS | Undo complete |
| PUT | /api/tasks/:id/link | ✅ EXISTS | Link to goal |
| PUT | /api/tasks/:id/unlink | ✅ EXISTS | Unlink from goal |
| GET | /api/tasks/by-goal/:goalId | ✅ EXISTS | Tasks for goal |

**Finding**: All task APIs fully implemented!

### Supporting APIs
| Method | Endpoint | Status | Usage |
|--------|----------|--------|--------|
| GET | /api/teams/:id/members | ✅ EXISTS | Owner dropdowns |
| GET | /api/users/me | ✅ EXISTS | Current user |
| GET | /api/objectives | ✅ EXISTS | Parent objective selector |
| GET | /api/objectives/:id | ✅ EXISTS | Objective details |
| GET | /api/companies/:id | ✅ EXISTS | Company context |

---

## ⚠️ API CONCERNS & RISKS

### 1. Schema Change Impact
**Issue**: Proposed Goal model changes could break APIs

**Current Goal Schema**:
```javascript
{
  objective_id: ObjectId,
  name: String,
  quarter: String,
  target_value: Number
}
```

**Proposed Changes**:
```javascript
{
  // NEW FIELDS:
  key_result_id: ObjectId,
  goal_type: "quarterly" | "weekly",
  cascade_source: String,
  has_key_result_link: Boolean
}
```

**Risk**: Existing API responses will change

**Mitigation**:
- Make new fields optional
- Default values for existing records
- Version the API (v1 vs v2)

### 2. Progress Rollup Performance
**Issue**: Cascading updates could be slow

**Current Flow**:
```
Task complete → Update Goal → Update Objective → Update KR
```

**Risk**: Synchronous updates could timeout

**Mitigation**:
- Use async job queue
- Batch updates
- Cache calculations

### 3. Missing Error Handling
**Issue**: Plan doesn't address error scenarios

**Scenarios Not Covered**:
- Circular goal references
- Orphaned tasks (goal deleted)
- Progress > 100%
- Negative progress
- Concurrent updates

**Recommendation**: Add validation middleware

---

## 📈 API USAGE PATTERNS

### Day 1-5: Goal Management
```javascript
// Page: quarterly-goals.html
GET /api/goals?type=quarterly
POST /api/goals
GET /api/objectives (for parent selector)
GET /api/teams/:id/members (for owner dropdown)

// Page: weekly-goals.html
GET /api/goals?type=weekly&parent_id={quarterlyGoalId}
POST /api/goals

// Page: goal-details.html
GET /api/goals/:id
GET /api/goals/:id/children
GET /api/goals/:id/tasks
PUT /api/goals/:id
DELETE /api/goals/:id
```

### Day 6-7: Employee Dashboard
```javascript
// Page: employee-dashboard.html
GET /api/tasks?assigned_to=me&status=pending
GET /api/goals?owner=me
GET /api/activities?user=me&days=7
PUT /api/tasks/:id/progress (quick update)
```

### Day 8-9: Task Management
```javascript
// Page: tasks.html
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id/assign
PUT /api/tasks/:id/progress
PUT /api/tasks/:id/complete
PUT /api/tasks/:id/link
```

### Day 10: Integration
```javascript
// New lineage API
GET /api/tasks/:taskId/lineage
```

---

## 🔧 API IMPLEMENTATION RECOMMENDATIONS

### 1. Build Lineage API Early
```javascript
// server/routes/tasks.js - Add this on Day 2, not Day 10

router.get('/:taskId/lineage', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('goal_id');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build lineage
    const lineage = {
      task_id: task._id,
      task_title: task.title
    };

    if (task.goal_id) {
      const goal = await Goal.findById(task.goal_id._id)
        .populate('parent_goal_id')
        .populate('objective_id');

      lineage.weekly_goal = {
        id: goal._id,
        title: goal.name,
        progress: goal.progress
      };

      if (goal.parent_goal_id) {
        lineage.quarterly_goal = {
          id: goal.parent_goal_id._id,
          title: goal.parent_goal_id.name,
          progress: goal.parent_goal_id.progress
        };
      }

      if (goal.objective_id) {
        const objective = goal.objective_id;
        lineage.objective = {
          id: objective._id,
          title: objective.title,
          progress: objective.progress_percentage
        };

        // Get assessment if linked
        if (objective.assessment_id) {
          const assessment = await Assessment.findById(objective.assessment_id);
          lineage.assessment = {
            id: assessment._id,
            dimension: assessment.dimension_focus,
            score: assessment.overall_score
          };
        }
      }
    }

    // Calculate impact
    if (task.goal_id) {
      const totalTasks = await Task.countDocuments({
        goal_id: task.goal_id._id
      });
      lineage.impact_percentage = (1 / totalTasks * 100).toFixed(1);
    }

    res.json(lineage);
  } catch (error) {
    console.error('Lineage API Error:', error);
    res.status(500).json({ error: 'Failed to fetch lineage' });
  }
});
```

### 2. Simplify Goal Creation
```javascript
// Instead of complex breakdown API, use existing POST /api/goals

// Client-side can handle the breakdown logic:
async function createQuarterlyGoals(objectiveId, krTarget) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const targetPerQuarter = krTarget / 4;

  for (const quarter of quarters) {
    await fetch('/api/goals', {
      method: 'POST',
      body: JSON.stringify({
        objective_id: objectiveId,
        name: `Q${quarter} Target`,
        quarter: quarter,
        target_value: targetPerQuarter
      })
    });
  }
}
```

### 3. Add Validation Middleware
```javascript
// server/middleware/goalValidation.js

const validateGoalProgress = (req, res, next) => {
  const { progress } = req.body;

  if (progress < 0) {
    return res.status(400).json({
      error: 'Progress cannot be negative'
    });
  }

  if (progress > 100) {
    return res.status(400).json({
      error: 'Progress cannot exceed 100%'
    });
  }

  next();
};

// Apply to routes:
router.put('/:id/progress', validateGoalProgress, updateProgress);
```

### 4. Handle Cascading Asynchronously
```javascript
// Use event emitters for cascading updates

// server/events/progressEvents.js
const EventEmitter = require('events');
const progressEmitter = new EventEmitter();

progressEmitter.on('task.completed', async (taskId) => {
  // Update parent goal asynchronously
  const task = await Task.findById(taskId).populate('goal_id');
  if (task.goal_id) {
    await updateGoalProgress(task.goal_id._id);
  }
});

progressEmitter.on('goal.updated', async (goalId) => {
  // Update parent objective asynchronously
  const goal = await Goal.findById(goalId);
  if (goal.objective_id) {
    await updateObjectiveProgress(goal.objective_id);
  }
});

// In task completion API:
router.put('/:id/complete', async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: 'completed', completed_at: new Date() },
    { new: true }
  );

  // Respond immediately
  res.json({ success: true, task });

  // Cascade asynchronously
  progressEmitter.emit('task.completed', task._id);
});
```

---

## 📊 API TESTING REQUIREMENTS

### Unit Tests Needed
```javascript
// test/api/goals.test.js
describe('Goal APIs', () => {
  test('GET /api/goals returns quarterly goals', async () => {
    const res = await request(app)
      .get('/api/goals?type=quarterly')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.goals).toBeDefined();
    expect(res.body.goals[0].quarter).toBeDefined();
  });

  test('Progress update cascades to parent', async () => {
    // Create goal → task → update task → check goal progress
  });
});
```

### Integration Tests
```javascript
// test/integration/execution-chain.test.js
describe('Full Execution Chain', () => {
  test('Complete flow: Objective → Goal → Task → Completion', async () => {
    // 1. Create objective
    // 2. Create quarterly goal
    // 3. Create weekly goal
    // 4. Create task
    // 5. Complete task
    // 6. Verify progress rolled up
  });
});
```

### Load Tests
```javascript
// test/load/progress-cascade.test.js
describe('Progress Cascade Performance', () => {
  test('Handle 100 concurrent task completions', async () => {
    // Create 100 tasks
    // Complete all simultaneously
    // Measure response times
    // Verify no timeouts
  });
});
```

---

## 🚨 CRITICAL API GAPS

### 1. No Batch Operations
**Missing**: Bulk create/update goals
```javascript
// Needed:
POST /api/goals/batch
PUT /api/tasks/batch-complete
```

### 2. No Filtering by Date Range
**Missing**: Goals/tasks in date range
```javascript
// Needed:
GET /api/goals?start_date=2025-01-01&end_date=2025-03-31
```

### 3. No Aggregation Endpoints
**Missing**: Summary statistics
```javascript
// Needed:
GET /api/goals/summary?user_id=123
GET /api/tasks/statistics?team_id=456
```

---

## 📋 FINAL API RECOMMENDATIONS

### Must Have (Sprint 2)
1. ✅ Build lineage API early (Day 2)
2. ✅ Use existing goal/task APIs (no changes)
3. ✅ Add basic validation middleware
4. ✅ Test progress cascading

### Nice to Have (Sprint 3)
1. ⏸️ Defer auto-breakdown API
2. ⏸️ Defer batch operations
3. ⏸️ Defer advanced filtering
4. ⏸️ Defer aggregation endpoints

### Don't Do
1. ❌ Don't change existing schemas
2. ❌ Don't add complex cascading
3. ❌ Don't version APIs yet
4. ❌ Don't add KR linking complexity

---

## ✅ API READINESS ASSESSMENT

| Category | Score | Notes |
|----------|-------|-------|
| Existing APIs | 95% | Nearly complete |
| New APIs | 50% | Only lineage needed |
| Performance | 70% | Needs async cascading |
| Error Handling | 60% | Needs validation |
| Testing | 40% | Needs test coverage |
| **Overall** | **73%** | **Good, needs polish** |

---

**Review Complete**
**Recommendation**: Proceed with minimal new APIs, focus on frontend

---

*Generated by API Architecture Team*
*Date: November 12, 2025*
*Version: 1.0.0*