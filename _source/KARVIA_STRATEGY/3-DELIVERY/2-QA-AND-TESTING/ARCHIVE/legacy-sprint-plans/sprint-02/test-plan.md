# 🧪 SPRINT 2 COMPREHENSIVE TEST PLAN

**Sprint**: Sprint 2 - Planning & Dashboard
**Test Period**: November 26-28, 2025
**Version**: 1.0
**Created**: November 12, 2025

---

## 📊 TEST SCOPE & OBJECTIVES

### What We're Testing
1. **Full OKR Cascade**: Assessment → Objectives → KRs → Quarterly Goals → Weekly Goals → Daily Tasks
2. **Planning Page**: AI generation, goal creation, owner assignment
3. **Employee Dashboard**: Task management, progress tracking, Why Chain
4. **Data Relationships**: Parent-child links, cascading updates
5. **Real-world Scenarios**: Missed tasks, replanning, mid-quarter changes

### Success Criteria
- 100% of happy path scenarios pass
- 95% of edge cases handled gracefully
- No data integrity issues
- Performance < 2s for all operations
- Zero orphaned records

---

## 👥 TEST PERSONAS & COMPANY SETUP

### Test Company: "TechCorp Solutions"
- **Industry**: Software Development
- **Size**: 75 employees
- **Departments**: Engineering (30), Sales (20), Marketing (15), Operations (10)

### Test Personas

#### 1. CEO - Sarah Chen
- Takes initial assessment
- Creates company objectives
- Monitors overall progress

#### 2. VP Sales - John Smith
- Owns "Revenue Growth" objective
- Creates quarterly goals
- Manages sales team tasks

#### 3. Sales Manager - Maria Garcia
- Breaks down quarterly goals to weekly
- Assigns tasks to team
- Tracks team performance

#### 4. Sales Rep - David Lee
- Receives daily tasks
- Updates progress
- Misses some deadlines

#### 5. Engineering Lead - Alex Kumar
- Owns "Product Innovation" objective
- Technical goal planning
- Cross-functional dependencies

---

## 🔄 COMPLETE CASCADE TEST SCENARIOS

### SCENARIO 1: Happy Path - Full Cascade Creation

#### TC-1.1: Assessment to Objectives
**Precondition**: Clean company setup
**Steps**:
1. All 75 employees complete assessments
2. System generates aggregated weak areas
3. CEO reviews and generates 4 objectives using AI

**Expected Results**:
```javascript
// Verify API calls
GET /api/assessments/company/analysis
POST /api/objectives/generate-from-assessment
{
  objectives: [
    {
      title: "Accelerate Revenue Growth by 25%",
      key_results: [
        { title: "Increase MRR to $2.5M", target: 2500000 },
        { title: "Achieve 85% retention", target: 85 },
        { title: "Launch 2 features", target: 2 },
        { title: "Reduce CAC 20%", target: 4000 }
      ]
    }
  ]
}
```

**Verification**:
- [ ] 4 objectives created with 4 KRs each
- [ ] Each KR has metrics and targets
- [ ] Objectives linked to assessment weak areas
- [ ] All have company_id set

#### TC-1.2: KR to Quarterly Goals
**Precondition**: Objectives with KRs exist
**Steps**:
1. VP Sales navigates to Planning page
2. Selects "Increase MRR to $2.5M" KR
3. Sets timeline: 12 weeks
4. Assigns owner: John Smith
5. Clicks "Generate AI Plan"

**Expected Results**:
```javascript
POST /api/planning/generate-plan
{
  kr_id: "kr_123",
  timeline_weeks: 12,
  owner_id: "john_smith_id"
}

// Response
{
  plan: {
    weeks: [
      {
        week_number: 1,
        target_value: 2140000,
        tasks: ["Contact 10 enterprise leads", "Schedule 3 demos"]
      }
      // ... 12 weeks total
    ]
  }
}
```

**Verification**:
- [ ] AI generates progressive targets
- [ ] Each week has 3-5 tasks
- [ ] Targets sum to KR target
- [ ] Owner assigned to all weeks

#### TC-1.3: Create Goals from Plan
**Precondition**: Plan generated and reviewed
**Steps**:
1. VP Sales reviews generated plan
2. Changes Week 3 owner to Maria Garcia
3. Clicks "Create Goals"

**Expected Results**:
```javascript
POST /api/planning/create-goals
{
  kr_id: "kr_123",
  plan_data: { /* plan */ },
  quarterly_goal_id: "q1_goal_id"
}

// Verify database
Goals created with:
- parent_goal_id: "q1_goal_id"
- time_period: "WEEKLY"
- key_result_id: "kr_123"
- owner: assigned_user_id
```

**Verification**:
- [ ] Quarterly goal created with key_result_id
- [ ] 12 weekly goals created with parent_goal_id
- [ ] Each goal has correct time_period
- [ ] Owner overrides applied

#### TC-1.4: Weekly Goals to Daily Tasks
**Precondition**: Weekly goals exist
**Steps**:
1. Maria Garcia opens Week 1 goal
2. Creates 5 daily tasks
3. Assigns 3 to David Lee, 2 to herself

**Expected Results**:
```javascript
POST /api/tasks
{
  goal_id: "week1_goal_id",
  title: "Call Acme Corp CEO",
  assigned_to: "david_lee_id",
  due_date: "2025-01-15T14:00:00Z",
  objective_id: "obj_123",  // Inherited
  key_result_id: "kr_123"   // Inherited
}
```

**Verification**:
- [ ] Tasks have complete lineage
- [ ] Due dates within week bounds
- [ ] Assigned users notified
- [ ] Tasks appear in dashboard

---

## 📱 DASHBOARD TEST SCENARIOS

### SCENARIO 2: Employee Daily Workflow

#### TC-2.1: Dashboard Data Filtering
**Precondition**: David Lee has 15 tasks assigned
**Steps**:
1. David logs in
2. Opens Dashboard
3. Views "Today" tab

**Expected Results**:
```javascript
GET /api/dashboard/user/david_lee_id

// Response shows ONLY:
{
  objectives: [], // None - he doesn't own any
  key_results: [], // None - not assigned
  tasks_today: [
    // Only tasks due today
    { id: "task_1", due_date: "2025-01-15T14:00:00Z" },
    { id: "task_2", due_date: "2025-01-15T16:00:00Z" }
  ],
  tasks_week: [/* 8 tasks total this week */]
}
```

**Verification**:
- [ ] No data from other users
- [ ] Tasks sorted by due time
- [ ] Overdue tasks highlighted
- [ ] Why Chain visible for each task

#### TC-2.2: Task Completion & Cascade
**Precondition**: David has 5 tasks today
**Steps**:
1. David checks first task checkbox
2. System updates backend
3. Progress cascades up

**Expected Results**:
```javascript
PUT /api/tasks/task_1/complete
{ completed: true }

// Cascade updates:
Task (20% of daily) →
Weekly Goal (progress: 20%) →
Quarterly Goal (progress: 1.7%) →
KR (progress: 0.4%)
```

**Verification**:
- [ ] Task marked complete in < 500ms
- [ ] Weekly goal progress updates
- [ ] Quarterly goal progress updates
- [ ] KR current_value increases
- [ ] No page refresh needed

---

## 🔴 EDGE CASES & FAILURE SCENARIOS

### SCENARIO 3: Missed Tasks & Replanning

#### TC-3.1: Overdue Task Handling
**Precondition**: David has 3 overdue tasks from yesterday
**Steps**:
1. Dashboard shows overdue tasks in red
2. David can:
   - Complete late
   - Reschedule
   - Cancel with reason

**Expected Results**:
```javascript
// Overdue tasks query
GET /api/tasks?assigned_to=david&due_date<now&completed=false

// Reschedule
PUT /api/tasks/task_1
{
  due_date: "2025-01-16T14:00:00Z",
  rescheduled: true,
  reschedule_reason: "Client postponed meeting"
}
```

**Verification**:
- [ ] Overdue tasks show in red
- [ ] Reschedule updates goal timeline
- [ ] History tracks reschedules
- [ ] Manager notified of delays

#### TC-3.2: Mid-Quarter Objective Change
**Precondition**: Q1 Week 6, objective underperforming
**Steps**:
1. CEO modifies objective target
2. System recalculates KR targets
3. Prompts replanning for affected goals

**Expected Results**:
```javascript
PUT /api/objectives/obj_123
{
  key_results: [{
    id: "kr_123",
    target_value: 2300000  // Reduced from 2500000
  }]
}

// Triggers
POST /api/planning/recalculate
{
  kr_id: "kr_123",
  remaining_weeks: 6,
  new_target: 2300000
}
```

**Verification**:
- [ ] Existing goals marked "needs replan"
- [ ] New targets proportionally adjusted
- [ ] Historical data preserved
- [ ] Audit trail created

#### TC-3.3: Employee Leaves Mid-Quarter
**Precondition**: Maria Garcia has 20 tasks, 5 goals owned
**Steps**:
1. HR deactivates Maria's account
2. System identifies orphaned items
3. Manager reassigns ownership

**Expected Results**:
```javascript
POST /api/users/maria_garcia_id/deactivate

// System identifies:
{
  orphaned_goals: 5,
  orphaned_tasks: 20,
  suggested_reassignment: "john_smith_id" // Her manager
}

// Bulk reassign
POST /api/goals/bulk-reassign
{
  from_user: "maria_garcia_id",
  to_user: "john_smith_id",
  goal_ids: [/* 5 goals */]
}
```

**Verification**:
- [ ] No orphaned records
- [ ] New owner notified
- [ ] Dashboard updated immediately
- [ ] History shows reassignment

---

## 🚨 STRESS & BOUNDARY TESTING

### SCENARIO 4: Scale & Performance

#### TC-4.1: Large Company Simulation
**Setup**: 500 employees, 20 objectives, 80 KRs, 1000 goals, 5000 tasks
**Tests**:
1. Dashboard load time < 2s
2. Planning page handles 52-week timeline
3. Cascade updates with 1000 concurrent users

**Verification**:
- [ ] Response times within SLA
- [ ] No memory leaks
- [ ] Database indexes working
- [ ] Pagination functioning

#### TC-4.2: Boundary Conditions
**Test Cases**:
1. Create plan with 1 week (minimum)
2. Create plan with 12 weeks (maximum)
3. Create plan with 13 weeks (should fail)
4. 0% progress (start state)
5. 100% progress (completion)
6. 150% progress (overachievement)

---

## 🔄 REGRESSION TESTING

### SCENARIO 5: Existing Features Still Work

#### TC-5.1: Goal CRUD Operations
```javascript
// All must still work after adding new fields
POST /api/goals   // Create
GET /api/goals    // List
PUT /api/goals/:id // Update
DELETE /api/goals/:id // Delete
```

#### TC-5.2: Assessment Flow
- [ ] Assessments still generate objectives
- [ ] Weak area analysis unchanged
- [ ] OpenAI integration stable

---

## 🔐 SECURITY & AUTHORIZATION

### SCENARIO 6: Access Control

#### TC-6.1: Cross-User Data Access
**Test**: David tries to access John's tasks
```javascript
GET /api/tasks?assigned_to=john_smith_id
// Should return 403 Forbidden
```

#### TC-6.2: Role-Based Permissions
- Employee: Can only update own tasks
- Manager: Can assign within team
- Executive: Can create objectives
- CEO: Full access

---

## 📊 TEST DATA REQUIREMENTS

### Initial Setup Script
```javascript
// test-data.js
async function setupTestData() {
  // 1. Create company
  const company = await Company.create({
    name: "TechCorp Solutions",
    size: 75
  });

  // 2. Create users
  const users = await User.bulkCreate([
    { name: "Sarah Chen", role: "CEO" },
    { name: "John Smith", role: "VP_SALES" },
    { name: "Maria Garcia", role: "MANAGER" },
    { name: "David Lee", role: "EMPLOYEE" },
    // ... 71 more
  ]);

  // 3. Create assessments
  for (const user of users) {
    await Assessment.create({
      user_id: user.id,
      scores: generateRandomScores()
    });
  }

  // 4. Generate objectives from assessments
  await generateObjectivesFromAssessments();

  return { company, users };
}
```

---

## ✅ TEST EXECUTION CHECKLIST

### Day 8: Integration Testing (Nov 26)
- [ ] Happy path scenarios (1.1-1.4)
- [ ] Dashboard workflows (2.1-2.2)
- [ ] Edge cases (3.1-3.3)

### Day 9: Performance & Security (Nov 27)
- [ ] Stress testing (4.1-4.2)
- [ ] Regression testing (5.1-5.2)
- [ ] Security testing (6.1-6.2)

### Day 10: User Acceptance (Nov 28)
- [ ] End-to-end workflows
- [ ] Real user testing
- [ ] Bug fixes
- [ ] Sign-off

---

## 📈 METRICS & REPORTING

### Test Coverage Targets
- Unit Tests: 80% code coverage
- Integration Tests: 100% API coverage
- E2E Tests: All critical paths

### Bug Severity Levels
- **P0**: Blocks core functionality
- **P1**: Major feature broken
- **P2**: Minor feature issue
- **P3**: Cosmetic/UX issue

### Exit Criteria
- Zero P0 bugs
- < 3 P1 bugs (with workarounds)
- All happy paths passing
- Performance within SLA

---

## 🔧 TEST ENVIRONMENT

### Required Setup
```bash
# Environment variables
TEST_DB_URL=mongodb://localhost:27017/karvia_test
OPENAI_API_KEY=[REDACTED]
NODE_ENV=test

# Test users
TEST_CEO_EMAIL=ceo@test.com
TEST_MANAGER_EMAIL=manager@test.com
TEST_EMPLOYEE_EMAIL=employee@test.com

# All passwords: Test123!
```

### Test Automation
```javascript
// Run all tests
npm run test:sprint2

// Run specific scenarios
npm run test:cascade
npm run test:dashboard
npm run test:edge-cases
```

---

**Test Plan Version**: 1.0
**Approved By**: QA Lead
**Last Updated**: November 12, 2025

*This comprehensive test plan ensures Sprint 2 features work correctly in real-world scenarios.*