# 🏃 SPRINT 1: CORE WORKFLOW FOUNDATION
**Sprint Duration**: November 3-16, 2025
**Sprint Goal**: Unblock core manager and employee workflows
**Completion Target**: 70% → 82% overall project completion

## 🎯 Sprint 1 Mission

**Critical Problem**: Managers cannot plan and employees cannot work because the Goal Management UI is completely missing, despite the backend being 100% ready. This is our #1 blocker.

**Sprint Outcome**: By end of Sprint 1, managers will be able to create and assign goals, and employees will be able to view and update their progress.

## 📋 Sprint Backlog (17 User Stories)

### Priority 1: Goal Management (Week 1)
| Story ID | Description | Points | Assignee |
|----------|-------------|--------|----------|
| MGR-015 | Create quarterly goals from objectives | 8 | Frontend Dev 1 |
| MGR-016 | Break quarterly goals into weekly | 5 | Frontend Dev 1 |
| MGR-017 | Create tasks from goals | 5 | Frontend Dev 2 |
| MGR-018 | Assign goals to team members | 3 | Frontend Dev 1 |
| EMP-016 | View "Why Chain" context (P0 CRITICAL) | 8 | Frontend Dev 1 |
| EMP-013 | View assigned goals | 3 | Frontend Dev 1 |
| EMP-014 | Update goal progress | 3 | Frontend Dev 1 |

### Priority 2: Business Management (Week 1)
| Story ID | Description | Points | Assignee |
|----------|-------------|--------|----------|
| OWNER-001 | Create business account | 5 | Backend Dev |
| OWNER-002 | Configure business settings | 3 | Backend Dev |
| OWNER-003 | Manage business users | 5 | Backend Dev |
| CONS-001 | Manage multiple businesses | 5 | Backend Dev |

### Priority 3: Task Completion (Week 2)
| Story ID | Description | Points | Assignee |
|----------|-------------|--------|----------|
| EMP-007 | View assigned tasks | 3 | Frontend Dev 2 |
| EMP-008 | Update task progress | 3 | Frontend Dev 2 |
| MGR-009 | Create and assign tasks | 5 | Frontend Dev 2 |
| MGR-010 | Track task completion | 3 | Frontend Dev 2 |
| EXEC-010 | Goal approval workflow | 5 | Full Team |
| EXEC-011 | Quarterly plan approval | 5 | Full Team |

**Total Story Points**: 77 points

## 🛠️ Technical Implementation Details

### WEEK 1 FOCUS: Goal Management UI

#### Day 1-2: Goal API Client & Foundation
**File**: `client/js/goals-api-client.js`
```javascript
// Template structure (300 lines total)
class GoalAPIClient {
  constructor() {
    this.baseURL = '/api/goals';
  }

  // Implement these methods:
  async listGoals(filters) { }        // GET /api/goals
  async createGoal(goalData) { }      // POST /api/goals
  async getGoal(goalId) { }           // GET /api/goals/:id
  async updateGoal(goalId, data) { }  // PUT /api/goals/:id
  async updateProgress(goalId, progress) { } // PUT /api/goals/:id/progress
  async assignGoal(goalId, userId) { } // PUT /api/goals/:id/assign
  async deleteGoal(goalId) { }        // DELETE /api/goals/:id
  async getQuarterlyGoals(quarter) { } // GET /api/goals/quarter/:quarter
  async getMyGoals() { }               // GET /api/goals/my/goals
  async getOverdueGoals() { }         // GET /api/goals/status/overdue
  async getGoalStats() { }            // GET /api/goals/stats/summary
}
```

**Reference**: Copy patterns from `client/js/assessment-api-client.js`

#### Day 3: Quarterly Goals Page
**File**: `client/pages/quarterly-goals.html`
- Copy structure from `client/pages/objectives.html`
- Modify for quarterly view
- Include filters: quarter, status, owner
- Add "Create Goal" button
- Goal cards with progress indicators

**File**: `client/pages/scripts/quarterly-goals.js`
```javascript
// Key functions to implement:
- loadQuarterlyGoals()
- renderGoalCard()
- handleCreateGoal()
- handleGoalClick()
- updateProgress()
- filterGoals()
```

#### Day 4: Goal Details Modal
**File**: `client/pages/goal-details.html`
- Modal structure for goal details
- Progress update form
- Assignment interface
- Weekly breakdown section
- "Why Chain" visualization (P0 CRITICAL)

**Why Chain Implementation** (EMP-016):
```javascript
// Show the connection hierarchy
function renderWhyChain(goal) {
  // Goal → Key Result → Objective → Company Mission
  const chain = {
    task: goal.task_name,
    goal: goal.title,
    keyResult: goal.key_result_name,
    objective: goal.objective_name,
    mission: "Company Success"
  };
  // Visual representation showing WHY this matters
}
```

#### Day 5: Weekly Goals View
**File**: `client/pages/weekly-goals.html`
- Week selector (1-13)
- Goals grouped by day
- Drag-drop for rescheduling
- Quick progress update

### WEEK 1 PARALLEL: Business Management API

#### Backend Developer Tasks (Days 1-3)
**File**: `server/routes/businesses.js`
```javascript
// Replace stub endpoints with real implementation
router.get('/api/businesses/:id', async (req, res) => {
  // Implement real business fetch
});

router.put('/api/businesses/:id', async (req, res) => {
  // Implement business update
});

router.delete('/api/businesses/:id', async (req, res) => {
  // Soft delete implementation
});

router.get('/api/businesses/:id/users', async (req, res) => {
  // List all users in business
});

router.get('/api/businesses/:id/teams', async (req, res) => {
  // List all teams in business
});

router.get('/api/businesses/:id/stats', async (req, res) => {
  // Aggregate statistics
});
```

#### Architecture Fix (Days 4-5)
1. Create migration script for Business → Company
2. Add companies[] array to User model
3. Update all business_id references
4. Test multi-company scenarios

### WEEK 2 FOCUS: Task UI Completion & Integration

#### Days 6-7: Task Creation & Assignment
**Files to complete**:
- `client/pages/task-create.html`
- `client/pages/task-assign.html`
- `client/pages/scripts/task-create.js`
- `client/pages/scripts/task-assign.js`

**Reference existing**: `client/pages/team-tasks.html`

#### Days 8-9: Integration & Testing
- Connect Goal → Task flow
- Test assignment workflows
- Implement approval processes
- Fix integration bugs

#### Day 10: Sprint Review Prep
- Complete all stories
- Update documentation
- Prepare demo scenarios
- Fix P0/P1 bugs

## 📚 Reference Documentation

### Backend (Already Complete)
- Goal Model: `/server/models/Goal.js` (714 lines)
- Goal Routes: `/server/routes/goals.js` (576 lines, 11 endpoints)
- Task Model: `/server/models/Task.js` (881 lines)
- Task Routes: `/server/routes/tasks.js` (13 endpoints)

### UI Mockups to Follow
- Planning: `/Karvia_OKR_Mockups/Finalised_Mockups/06_planning.html`
- Dashboard: `/Karvia_OKR_Mockups/Finalised_Mockups/02_dashboard.html`
- Use existing CSS: `/client/css/theme.css`

### Patterns to Reuse
- API Client: Copy from `/client/js/assessment-api-client.js`
- Page Structure: Copy from `/client/pages/objectives.html`
- Controller Pattern: Copy from `/client/pages/scripts/objectives.js`
- Modal Pattern: Copy from assessment creation flow

## ✅ Definition of Done Checklist

### For Each Story
- [ ] Code complete
- [ ] Unit tests written
- [ ] Integration test passes
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design
- [ ] Accessibility checked

### For Sprint 1
- [ ] All 17 stories complete
- [ ] Goal creation → assignment → tracking flow works
- [ ] Business management fully functional
- [ ] Task management integrated
- [ ] Zero P0 bugs
- [ ] Demo ready
- [ ] Documentation updated

## 🚨 Risk Mitigation

### Risk 1: Goal UI Complexity
**Mitigation**:
- Reuse objective display patterns
- Simplify first version
- Focus on core functionality

### Risk 2: "Why Chain" Implementation
**Mitigation**:
- This is P0 - must be done
- Simple text version first
- Visual enhancement later

### Risk 3: Business/Company Naming
**Mitigation**:
- Clear migration script
- Test on copy first
- Have rollback plan

## 📊 Daily Standup Questions

1. What did you complete yesterday?
2. What will you complete today?
3. Are you blocked on anything?
4. Are we on track for sprint goal?

## 🎯 Sprint 1 Success Criteria

**Must Have (100% required)**:
- Managers can create quarterly goals
- Managers can assign goals to employees
- Employees can view their goals with context
- Employees can update progress
- Business CRUD operations work

**Should Have (80% target)**:
- Weekly breakdown interface
- Task creation from goals
- Bulk assignment features

**Nice to Have (if time)**:
- Drag-drop goal scheduling
- Advanced filters
- Goal templates

## 📅 Key Milestones

| Date | Milestone | Status |
|------|-----------|--------|
| Nov 3 | Sprint starts | 🟢 Ready |
| Nov 5 | Goal API client complete | ⏳ Pending |
| Nov 7 | Quarterly goals page live | ⏳ Pending |
| Nov 9 | Week 1 complete | ⏳ Pending |
| Nov 12 | Task UI complete | ⏳ Pending |
| Nov 14 | Integration testing | ⏳ Pending |
| Nov 16 | Sprint review/demo | ⏳ Pending |

## 🔗 Quick Links

- [MASTER_ISSUES_LIST.md](/KARVIA_STRATEGY/3-DELIVERY/MASTER_ISSUES_LIST.md) - Known bugs
- [MVP_USER_STORIES.md](/Karvia_OKR_Product_Planning/01_MVP/MVP_USER_STORIES.md) - Story details
- [Goal Model](/server/models/Goal.js) - Backend reference
- [Goal Routes](/server/routes/goals.js) - API endpoints

---

**Sprint Start**: November 3, 2025
**Sprint Review**: November 16, 2025, 3:00 PM
**Next Sprint Planning**: November 16, 2025, 4:00 PM