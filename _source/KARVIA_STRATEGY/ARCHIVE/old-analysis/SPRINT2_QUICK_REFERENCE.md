# SPRINT 2 QUICK REFERENCE - Task/Goal/Objective Analysis

## TLDR - Critical Issue Summary

**Status**: Goal parent-child hierarchy is BROKEN  
**Impact**: Quarterly→Weekly breakdown persists to DB but can't be queried  
**Fix Time**: 1-2 days (schema + migration)  
**Blocking**: All goal hierarchy UI work  

---

## What Works ✅

| Component | Files | Status |
|-----------|-------|--------|
| Objective Model | `/server/models/Objective.js` | 100% Complete |
| Task Model | `/server/models/Task.js` | 100% Complete |
| Objective API | `/server/routes/objectives.js` | 100% Complete |
| Goal CRUD | `/server/routes/goals.js` (L1-500) | 100% Complete |
| Task CRUD | `/server/routes/tasks.js` | 100% Complete |
| Cascade Mechanics | Task→Goal→Objective | 100% Complete |
| Authorization | Role-based access control | 100% Complete |
| Multi-tenancy | company_id filtering | 100% Complete |

---

## What's Broken ❌

| Component | Issue | Impact | File | Line |
|-----------|-------|--------|------|------|
| Goal Model | Missing `parent_goal_id`, `child_goal_ids`, `time_period` | Data not persisted | `models/Goal.js` | N/A |
| Goal Breakdown | Routes write non-schema fields | Hierarchy structure lost | `routes/goals.js` | 660, 688 |
| Goal Querying | Can't filter by parent_goal_id | Can't get weekly goals | `routes/goals.js` | - |

---

## The Bug in Detail

### What's Happening
```javascript
// routes/goals.js line 660 - WRITES parent_goal_id
weeklyGoal = {
  parent_goal_id: quarterlyGoal._id,    // ❌ NOT IN SCHEMA
  time_period: 'WEEKLY'                 // ❌ NOT IN SCHEMA
}

// models/Goal.js - MISSING THESE FIELDS
// Schema doesn't define parent_goal_id, child_goal_ids, time_period
// Mongoose doesn't know about these fields
// MongoDB receives the data but doesn't store it
// On server restart, data is gone!
```

### Test It
```bash
# Create quarterly goal
curl -X POST http://localhost:5000/api/goals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective_id": "xyz",
    "name": "Q1 Goal",
    "owner_id": "abc",
    "quarter": "Q1",
    "due_date": "2025-03-31"
  }'

# Breakdown into weekly goals
curl -X POST http://localhost:5000/api/goals/GOAL_ID/breakdown \
  -H "Authorization: Bearer YOUR_TOKEN"

# Try to find weekly goals (FAILS)
curl -X GET "http://localhost:5000/api/goals?parent_goal_id=GOAL_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
# Returns empty because parent_goal_id field doesn't exist!
```

---

## The Fix

### Step 1: Update Goal Model (5 minutes)
```javascript
// In /server/models/Goal.js, around line 200, ADD:

// Parent-child hierarchy
parent_goal_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal',
  default: null,
  index: true  // For fast queries
},

child_goal_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal'
}],

// Goal type/period
time_period: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY'],
  default: 'QUARTERLY',
  index: true
}
```

### Step 2: Add Index (1 minute)
```javascript
// In /server/models/Goal.js, in indexes section, ADD:
goalSchema.index({ parent_goal_id: 1 });
goalSchema.index({ company_id: 1, parent_goal_id: 1 });
goalSchema.index({ time_period: 1, status: 1 });
```

### Step 3: Add Methods (3 minutes)
```javascript
// In /server/models/Goal.js, add these methods:

goalSchema.methods.getChildGoals = function() {
  return mongoose.model('Goal').find({ parent_goal_id: this._id });
};

goalSchema.methods.getParentGoal = function() {
  if (!this.parent_goal_id) return null;
  return mongoose.model('Goal').findById(this.parent_goal_id);
};

goalSchema.methods.hasChildren = function() {
  return this.child_goal_ids && this.child_goal_ids.length > 0;
};
```

### Step 4: Migration Script (10 minutes)
```bash
# Create file: scripts/migrate-goal-hierarchy.js
```

### Step 5: Run Migration (5 minutes)
```bash
node scripts/migrate-goal-hierarchy.js
# Verifies all weekly goals have parent_goal_id
# Verifies all quarterly goals have child_goal_ids populated
```

**Total Time**: ~25 minutes

---

## After Fix - New Capabilities

### Query Weekly Goals for a Quarterly Goal
```javascript
// routes/goals.js - NEW ENDPOINT
router.get('/:id/children', authenticateToken, async (req, res) => {
  const weeklyGoals = await Goal.find({
    parent_goal_id: req.params.id,
    company_id: req.user.company_id
  }).sort({ week: 1 });
  res.json({ success: true, goals: weeklyGoals });
});
```

### Query by Time Period
```javascript
// Get all quarterly goals
const quarterlyGoals = await Goal.find({
  time_period: 'QUARTERLY',
  company_id: companyId
});

// Get all weekly goals
const weeklyGoals = await Goal.find({
  time_period: 'WEEKLY',
  company_id: companyId
});
```

### Navigate Hierarchy
```javascript
// Get parent quarterly goal from weekly
const weeklyGoal = await Goal.findById(weeklyGoalId);
const quarterlyGoal = await weeklyGoal.getParentGoal();

// Get all children
const children = await quarterlyGoal.getChildGoals();
```

---

## Files to Modify

### Must Change
1. **`server/models/Goal.js`** - Add 3 fields, 3 methods, 3 indexes (20 lines)
2. **`server/routes/goals.js`** - No changes needed (already uses the fields correctly!)

### Should Add
3. **`scripts/migrate-goal-hierarchy.js`** - New file (50 lines)
4. **`server/routes/goals.js`** - Add 2 new endpoints (40 lines):
   - GET `/api/goals/:id/children` - List weekly goals
   - GET `/api/goals/:id/hierarchy` - Full tree

### Nice to Have
5. **`client/pages/goal-details.html`** - Show weekly children (UI)
6. **`client/pages/quarterly-goals.html`** - Show breakdown button (UI)

---

## API Endpoints Status

### Fully Working ✅
```
GET    /api/objectives                    - List objectives
POST   /api/objectives                    - Create objective
GET    /api/objectives/:id                - Get objective details
PUT    /api/objectives/:id                - Update objective
DELETE /api/objectives/:id                - Delete objective

GET    /api/goals                         - List goals
POST   /api/goals                         - Create goal
GET    /api/goals/:id                     - Get goal details
PUT    /api/goals/:id                     - Update goal
DELETE /api/goals/:id                     - Delete goal
PATCH  /api/goals/:id/progress            - Update progress

GET    /api/tasks                         - List tasks
POST   /api/tasks                         - Create task
GET    /api/tasks/:id                     - Get task details
PUT    /api/tasks/:id                     - Update task
DELETE /api/tasks/:id                     - Delete task
PATCH  /api/tasks/:id/status              - Update status
PATCH  /api/tasks/:id/progress            - Update progress
```

### Partially Broken ⚠️
```
POST   /api/goals/:id/breakdown           - Creates weekly goals but doesn't persist hierarchy
```

### Missing ❌
```
GET    /api/goals/:id/children            - Should list weekly goals
GET    /api/goals/:id/hierarchy           - Should show full tree
PUT    /api/goals/:id/children            - Should bulk update weekly goals
```

---

## Data Relationships Reference

### Objective Structure
```javascript
{
  _id: ObjectId,
  company_id: ObjectId,
  owner_id: ObjectId,
  title: String,
  status: ['draft','active','completed','at_risk'],
  key_results: [{
    title: String,
    target_value: Number,
    current_value: Number,
    quarter: 1-4,
    status: String
  }],
  metrics: {
    total_goals: Number,
    completed_goals: Number
  }
}
```

### Goal Structure (After Fix)
```javascript
{
  _id: ObjectId,
  company_id: ObjectId,
  objective_id: ObjectId,      // Parent objective
  owner_id: ObjectId,
  parent_goal_id: ObjectId,    // Parent quarterly goal (NEW)
  child_goal_ids: [ObjectId],  // Weekly goals (NEW)
  time_period: 'QUARTERLY'|'WEEKLY',  // (NEW)
  quarter: 'Q1'-'Q4',
  week: 1-13,
  status: String,
  progress: Number (0-100),
  metrics: {
    total_tasks: Number,
    completed_tasks: Number
  }
}
```

### Task Structure
```javascript
{
  _id: ObjectId,
  company_id: ObjectId,
  objective_id: ObjectId,      // Direct ref for cascade
  goal_id: ObjectId,           // Parent goal
  assigned_to: ObjectId,
  status: ['todo','in_progress','completed','blocked'],
  priority: String,
  subtasks: [{name, completed}],
  checklist: [{item, checked}]
}
```

---

## Testing Checklist

Before deploying:
- [ ] Created quarterly goal (Q1 with target 100)
- [ ] Breakdown into 13 weekly goals (13 × 7.7 target each)
- [ ] Query GET `/api/goals?parent_goal_id=QUARTERLY_ID` returns 13 goals
- [ ] Update weekly goal progress to 50
- [ ] Verify quarterly goal updates to ~4% (1/13 * 50%)
- [ ] Verify objective metrics update
- [ ] Delete quarterly goal (should be prevented if has weekly children)
- [ ] Create task under weekly goal
- [ ] Verify task completion updates weekly goal
- [ ] Verify weekly goal updates quarterly goal
- [ ] Verify quarterly goal updates objective

---

## FAQ

**Q: Why weren't these fields in the model originally?**
A: Likely development oversight - the breakdown endpoint was implemented before the model was finished.

**Q: Will existing data be lost?**
A: No. The fields were partially written to DB. The migration script will populate them correctly.

**Q: How long does this block other work?**
A: All Goal hierarchy UI depends on this fix. Can't build:
- Goal detail page (needs parent/children display)
- Goal breakdown UI (needs parent_goal_id persistence)
- Weekly goal view (needs parent navigation)

**Q: Is there workaround without the fix?**
A: No. The fields can't be queried without being in the schema.

**Q: Can this be done incrementally?**
A: No. Must fix schema + migration before building UI.

---

## Success Criteria

After completing the fix, these should work:

```javascript
// 1. Create and breakdown
const quarterly = await Goal.create({objective_id, name, owner_id, quarter});
const weekly = await Goal.find({parent_goal_id: quarterly._id});
// Result: 13 weekly goals ✅

// 2. Navigate up
const goalWeek5 = weekly[4];
const parent = await goalWeek5.getParentGoal();
assert(parent._id.equals(quarterly._id));
// Result: Can navigate parent-child ✅

// 3. Cascade updates
await Task.create({goal_id: goalWeek5._id, ...});
const updatedWeekly = await Goal.findById(goalWeek5._id);
assert(updatedWeekly.progress > 0);
// Result: Task completion updates weekly goal ✅

// 4. Type filtering
const allQuarterly = await Goal.find({time_period: 'QUARTERLY'});
const allWeekly = await Goal.find({time_period: 'WEEKLY'});
// Result: Can filter by type ✅
```

---

## Final Notes

- This is a HIGH PRIORITY fix (P0)
- Should be done FIRST in Sprint 2 (before UI work)
- Should take 1-2 days total
- Unblocks 3-4 frontend features
- No breaking changes to existing APIs

