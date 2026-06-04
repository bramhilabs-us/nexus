# 🔬 SPRINT 2 DETAILED TEST CASES

**Document Type**: Test Case Specifications
**Sprint**: Sprint 2
**Version**: 1.0
**Created**: November 12, 2025

---

## 📋 TEST CASE CATEGORIES

1. **Assessment Integration** (TC-ASM)
2. **Objective Management** (TC-OBJ)
3. **Key Results Planning** (TC-KR)
4. **Goal Hierarchy** (TC-GOAL)
5. **Task Management** (TC-TASK)
6. **Dashboard Operations** (TC-DASH)
7. **Cascade Updates** (TC-CASC)
8. **Error Scenarios** (TC-ERR)

---

## 🎯 ASSESSMENT INTEGRATION TEST CASES

### TC-ASM-001: Full Company Assessment Completion
**Priority**: P0
**Type**: Integration
**Precondition**: New company with 50 employees

**Test Steps**:
```javascript
1. POST /api/assessments/bulk-invite
   {
     company_id: "comp_123",
     employee_ids: [/* 50 IDs */]
   }

2. For each employee:
   POST /api/assessments
   {
     user_id: "user_x",
     category_scores: {
       strategy_planning: 65,
       team_performance: 72,
       operational_efficiency: 58,
       customer_experience: 80,
       innovation: 45,
       compliance: 88
     }
   }

3. GET /api/assessments/company/comp_123/analysis
```

**Expected Results**:
```javascript
{
  completion_rate: 100,
  weak_areas: [
    { category: "innovation", avg_score: 45 },
    { category: "operational_efficiency", avg_score: 58 }
  ],
  strong_areas: [
    { category: "compliance", avg_score: 88 }
  ],
  recommended_objectives: 4
}
```

**Verification**:
- All 50 assessments stored
- Averages calculated correctly
- Weak areas < 60 identified
- Ready for objective generation

---

### TC-ASM-002: Partial Assessment - Missing Employees
**Priority**: P1
**Type**: Edge Case
**Scenario**: Only 30/50 employees complete assessment

**Test Steps**:
```javascript
1. Create 50 employees
2. Only 30 complete assessments
3. Try to generate objectives
```

**Expected Behavior**:
```javascript
// Warning returned
{
  warning: "Only 60% completion rate",
  can_proceed: true,
  missing_employees: [/* 20 IDs */],
  recommendation: "Wait for 80% completion for accurate results"
}
```

---

## 🎯 OBJECTIVE & KR TEST CASES

### TC-OBJ-001: Generate Objectives from Assessment
**Priority**: P0
**Type**: Happy Path
**Precondition**: Assessment analysis complete

**Test Steps**:
```javascript
POST /api/objectives/generate-from-assessment
{
  assessment_analysis_id: "analysis_123",
  use_ai: true,
  objective_count: 4
}
```

**Expected Results**:
```javascript
{
  objectives: [
    {
      title: "Drive Innovation Culture",
      description: "Based on innovation score of 45",
      key_results: [
        {
          title: "Launch 3 innovative products",
          target_value: 3,
          current_value: 0,
          metric_type: "number"
        },
        // 3 more KRs
      ]
    },
    // 3 more objectives
  ]
}
```

**Verification**:
- Exactly 4 objectives created
- Each has 4 KRs
- KRs have measurable targets
- Linked to weak areas

---

### TC-KR-001: Planning Page - Generate Weekly Plan
**Priority**: P0
**Type**: Happy Path
**Precondition**: KR exists with target

**Test Steps**:
```javascript
1. Navigate to /planning
2. Select KR "Increase MRR to $2.5M"
3. Set timeline: 12 weeks
4. Set owner: "john_smith"
5. Click "Generate AI Plan"

POST /api/planning/generate-plan
{
  kr_id: "kr_mrr_123",
  timeline_weeks: 12,
  owner_id: "john_smith",
  start_date: "2025-01-01"
}
```

**Expected AI Response**:
```javascript
{
  plan: {
    kr_details: {
      title: "Increase MRR to $2.5M",
      current: 2100000,
      target: 2500000,
      gap: 400000
    },
    weeks: [
      {
        week_number: 1,
        date_range: "Jan 1-7",
        target_value: 2120000,  // Slow start
        tasks: [
          "Review current customer base for upsell opportunities",
          "Create list of 20 enterprise prospects",
          "Schedule 5 discovery calls"
        ]
      },
      {
        week_number: 2,
        date_range: "Jan 8-14",
        target_value: 2145000,  // Gradual increase
        tasks: [
          "Conduct 5 discovery calls",
          "Prepare 3 proposals",
          "Follow up with Q4 prospects"
        ]
      },
      // ... weeks 3-11
      {
        week_number: 12,
        date_range: "Mar 19-25",
        target_value: 2500000,  // Target achieved
        tasks: [
          "Close remaining deals",
          "Onboard new customers",
          "Celebrate achievement"
        ]
      }
    ],
    summary: {
      total_increase: 400000,
      weekly_average: 33333,
      confidence_level: "HIGH"
    }
  }
}
```

---

## 🎯 GOAL HIERARCHY TEST CASES

### TC-GOAL-001: Create Quarterly and Weekly Goals
**Priority**: P0
**Type**: Integration
**Precondition**: AI plan generated and accepted

**Test Steps**:
```javascript
POST /api/planning/create-goals
{
  kr_id: "kr_mrr_123",
  plan_data: { /* AI generated plan */ },
  create_quarterly: true
}
```

**Expected Database State**:
```javascript
// 1 Quarterly Goal created
{
  _id: "q_goal_123",
  title: "Q1 2025: Add $400K MRR",
  objective_id: "obj_revenue",
  key_result_id: "kr_mrr_123",
  time_period: "QUARTERLY",
  parent_goal_id: null,
  child_goal_ids: [/* 12 weekly goal IDs */],
  owner: "john_smith",
  target_value: 2500000,
  current_value: 2100000
}

// 12 Weekly Goals created
{
  _id: "w_goal_001",
  title: "Week 1: Add $20K MRR",
  objective_id: "obj_revenue",
  key_result_id: "kr_mrr_123",
  time_period: "WEEKLY",
  parent_goal_id: "q_goal_123",  // Links to quarterly
  child_goal_ids: [],
  owner: "john_smith",
  target_value: 2120000,
  current_value: 2100000
}
```

**Verification**:
- parent_goal_id set on all weekly goals
- child_goal_ids array on quarterly goal
- time_period correctly set
- key_result_id links to KR

---

### TC-GOAL-002: Goal Hierarchy Query
**Priority**: P0
**Type**: Data Integrity
**Test**: Verify complete lineage queryable

**Test Steps**:
```javascript
GET /api/goals/w_goal_001/hierarchy
```

**Expected Response**:
```javascript
{
  goal: { id: "w_goal_001", title: "Week 1: Add $20K MRR" },
  parent: { id: "q_goal_123", title: "Q1 2025: Add $400K MRR" },
  key_result: { id: "kr_mrr_123", title: "Increase MRR to $2.5M" },
  objective: { id: "obj_revenue", title: "Accelerate Revenue Growth 25%" },
  children: [] // Weekly goals don't have children
}
```

---

## 🎯 TASK MANAGEMENT TEST CASES

### TC-TASK-001: Create Tasks from Weekly Goal
**Priority**: P0
**Type**: Happy Path

**Test Steps**:
```javascript
// Manager creates tasks for Week 1
POST /api/tasks/bulk
{
  tasks: [
    {
      title: "Call Acme Corp CEO",
      goal_id: "w_goal_001",
      assigned_to: "david_lee",
      due_date: "2025-01-02T14:00:00Z",
      priority: "HIGH"
    },
    {
      title: "Demo to TechStart Inc",
      goal_id: "w_goal_001",
      assigned_to: "david_lee",
      due_date: "2025-01-03T10:00:00Z",
      priority: "HIGH"
    },
    {
      title: "Update CRM pipeline",
      goal_id: "w_goal_001",
      assigned_to: "maria_garcia",
      due_date: "2025-01-03T17:00:00Z",
      priority: "MEDIUM"
    }
  ]
}
```

**Verification**:
Each task must have:
- goal_id linking to weekly goal
- objective_id (inherited from goal)
- key_result_id (inherited from goal)
- assigned_to valid user
- due_date within week bounds

---

### TC-TASK-002: Task Completion Cascade
**Priority**: P0
**Type**: Integration
**Test**: Complete task and verify cascade

**Initial State**:
```javascript
Task: { completed: false }
Weekly Goal: { current_value: 2100000, target: 2120000 }
Quarterly Goal: { current_value: 2100000, target: 2500000 }
KR: { current_value: 2100000, target: 2500000 }
```

**Test Steps**:
```javascript
PUT /api/tasks/task_001/complete
{
  completed: true,
  actual_value: 10000  // This task worth $10K MRR
}
```

**Expected Cascade**:
```javascript
// Task updated
Task: { completed: true, actual_value: 10000 }

// Weekly Goal updated (50% complete)
Weekly Goal: { current_value: 2110000 }

// Quarterly Goal updated (2.5% complete)
Quarterly Goal: { current_value: 2110000 }

// KR updated (2.5% complete)
KR: { current_value: 2110000 }
```

---

## 📱 DASHBOARD TEST CASES

### TC-DASH-001: User Dashboard Filtering
**Priority**: P0
**Type**: Security
**Test**: Ensure users only see their data

**Test Setup**:
```javascript
// Database state
- John owns: 1 objective, 4 KRs, 5 goals, 0 tasks
- David owns: 0 objectives, 0 KRs, 0 goals, 15 tasks
```

**Test Steps**:
```javascript
// David's dashboard request
GET /api/dashboard/user/david_lee
Headers: { Authorization: "Bearer david_token" }
```

**Expected Response**:
```javascript
{
  objectives: [],  // Empty - David owns none
  key_results: [],  // Empty - David owns none
  quarterly_goals: [],  // Empty - David owns none
  weekly_goals: [],  // Empty - David owns none
  tasks_today: [
    { id: "task_1", title: "Call Acme Corp", due: "14:00" },
    { id: "task_2", title: "Demo to TechStart", due: "15:00" }
  ],
  tasks_week: [/* 8 tasks this week */]
}
```

**Security Verification**:
```javascript
// David tries to access John's data
GET /api/dashboard/user/john_smith
Headers: { Authorization: "Bearer david_token" }

// Expected: 403 Forbidden
{
  error: "Unauthorized: Cannot access other user's dashboard"
}
```

---

### TC-DASH-002: Today vs Week Tab
**Priority**: P1
**Type**: Functional

**Test Data**:
```javascript
// David has tasks across the week
Monday: 3 tasks (1 overdue from last week)
Tuesday (today): 5 tasks
Wednesday: 4 tasks
Thursday: 3 tasks
Friday: 2 tasks
```

**Today Tab Test**:
```javascript
GET /api/dashboard/user/david_lee?view=today

Response: {
  tasks_today: [
    { id: "t1", title: "Overdue: Follow up", due: "Yesterday", status: "OVERDUE" },
    { id: "t2", title: "Call prospect", due: "09:00", status: "COMPLETED" },
    { id: "t3", title: "Team meeting", due: "10:00", status: "COMPLETED" },
    { id: "t4", title: "Proposal review", due: "14:00", status: "PENDING" },
    { id: "t5", title: "Client demo", due: "15:30", status: "PENDING" },
    { id: "t6", title: "Update reports", due: "17:00", status: "PENDING" }
  ],
  stats: {
    total: 6,
    completed: 2,
    pending: 3,
    overdue: 1
  }
}
```

**Week Tab Test**:
```javascript
GET /api/dashboard/user/david_lee?view=week

Response: {
  tasks_week: {
    monday: { completed: 2, pending: 0, overdue: 1 },
    tuesday: { completed: 2, pending: 3, overdue: 0 },
    wednesday: { completed: 0, pending: 4, overdue: 0 },
    thursday: { completed: 0, pending: 3, overdue: 0 },
    friday: { completed: 0, pending: 2, overdue: 0 }
  },
  week_stats: {
    total: 17,
    completed: 4,
    completion_rate: 23.5
  }
}
```

---

## 🔴 ERROR & EDGE CASE TEST CASES

### TC-ERR-001: Missed Task Handling
**Priority**: P0
**Type**: Edge Case
**Scenario**: Task not completed by due date

**Test Timeline**:
```javascript
Day 1: Task created, due Day 2 at 14:00
Day 2, 14:01: Task becomes overdue
Day 2, 16:00: User logs in
Day 3: User completes overdue task
```

**Expected Behavior**:
```javascript
// Day 2, 14:01 - Automatic status update
{
  task_id: "task_001",
  status: "OVERDUE",
  overdue_since: "2025-01-02T14:01:00Z"
}

// Day 3 - Late completion
PUT /api/tasks/task_001/complete
{
  completed: true,
  completed_at: "2025-01-03T09:30:00Z",
  completion_note: "Client rescheduled"
}

// System tracks
{
  planned_date: "2025-01-02T14:00:00Z",
  actual_date: "2025-01-03T09:30:00Z",
  delay_hours: 19.5,
  impact_on_goal: "MINIMAL"
}
```

---

### TC-ERR-002: Replanning Mid-Quarter
**Priority**: P1
**Type**: Change Management
**Scenario**: KR target changed after 6 weeks

**Initial State**:
```javascript
KR: { target: 2500000, current: 2250000 }
Weeks completed: 6 of 12
Remaining target: 250000
```

**Change Event**:
```javascript
PUT /api/objectives/obj_123/key-results/kr_123
{
  target_value: 2400000  // Reduced by $100K
}
```

**System Response**:
```javascript
{
  replan_required: true,
  affected_goals: 6,  // Remaining 6 weekly goals
  suggested_action: "REPLAN",
  new_weekly_target: 25000,  // (2400000-2250000)/6

  // Trigger replan
  POST /api/planning/replan
  {
    kr_id: "kr_123",
    remaining_weeks: 6,
    current_value: 2250000,
    new_target: 2400000
  }
}
```

---

### TC-ERR-003: User Deactivation with Active Tasks
**Priority**: P0
**Type**: Data Integrity
**Scenario**: Employee leaves company mid-sprint

**Test Setup**:
```javascript
Maria Garcia:
- Owns: 3 weekly goals
- Assigned: 25 active tasks
- Reports to: John Smith
```

**Deactivation Process**:
```javascript
POST /api/users/maria_garcia/deactivate
{
  effective_date: "2025-02-01",
  reassign_to: "john_smith"
}
```

**System Actions**:
```javascript
{
  // Immediate actions
  user_status: "INACTIVE",
  login_disabled: true,

  // Reassignment
  goals_reassigned: {
    count: 3,
    new_owner: "john_smith",
    notification_sent: true
  },

  tasks_reassigned: {
    count: 25,
    new_owner: "john_smith",
    notification_sent: true
  },

  // Audit trail
  audit_log: {
    action: "USER_DEACTIVATED",
    affected_items: 28,
    reassigned_to: "john_smith",
    timestamp: "2025-02-01T00:00:00Z"
  }
}
```

---

### TC-ERR-004: OpenAI Service Failure
**Priority**: P1
**Type**: Resilience
**Scenario**: OpenAI API unavailable during plan generation

**Test Steps**:
```javascript
// Simulate OpenAI timeout
POST /api/planning/generate-plan
// OpenAI returns 503 or timeout
```

**Expected Fallback**:
```javascript
{
  error: "AI service temporarily unavailable",
  fallback_option: "TEMPLATE",
  template_plan: {
    weeks: [
      {
        week_number: 1,
        target_value: 2133333,  // Linear distribution
        tasks: [
          "Week 1 standard tasks from template",
          "Contact prospects",
          "Update pipeline"
        ]
      }
      // ... linear progression
    ]
  },
  message: "Using template plan. You can modify before saving."
}
```

---

## 🔄 CASCADE UPDATE TEST CASES

### TC-CASC-001: Complete Bottom-Up Cascade
**Priority**: P0
**Type**: Integration
**Test**: Verify progress flows up correctly

**Test Sequence**:
```javascript
// 1. Complete 5 tasks worth $20K total
for (task of week1_tasks) {
  PUT /api/tasks/${task.id}/complete
  { completed: true, value: 4000 }
}

// 2. Verify weekly goal updated
GET /api/goals/w_goal_001
Expected: { current_value: 2120000 }  // +20K

// 3. Verify quarterly goal updated
GET /api/goals/q_goal_123
Expected: { current_value: 2120000 }  // +20K

// 4. Verify KR updated
GET /api/objectives/obj_123/key-results/kr_123
Expected: { current_value: 2120000 }  // +20K

// 5. Verify objective progress
GET /api/objectives/obj_123
Expected: {
  overall_progress: 5,  // 20K of 400K = 5%
  kr_progress: [
    { kr_id: "kr_123", progress: 5 }
  ]
}
```

---

## 🧪 PERFORMANCE TEST CASES

### TC-PERF-001: Dashboard Load Time
**Priority**: P0
**Requirement**: < 2 seconds
**Test Data**: User with 50 tasks, 10 goals

**Test Steps**:
```javascript
// Measure time
const start = Date.now();
const response = await fetch('/api/dashboard/user/userId');
const end = Date.now();

assert(end - start < 2000, 'Dashboard must load in < 2s');
```

### TC-PERF-002: Concurrent Updates
**Priority**: P1
**Scenario**: 10 users updating tasks simultaneously

**Test Steps**:
```javascript
// 10 parallel requests
const updates = users.map(user =>
  fetch(`/api/tasks/${user.taskId}/complete`, {
    method: 'PUT',
    body: JSON.stringify({ completed: true })
  })
);

await Promise.all(updates);

// Verify no race conditions
// All cascades calculated correctly
```

---

## 📝 TEST DATA SETUP SCRIPT

```javascript
// test-setup.js
const TestDataFactory = {
  async createFullHierarchy() {
    // 1. Company
    const company = await Company.create({
      name: "TestCorp",
      size: 50
    });

    // 2. Users
    const ceo = await User.create({
      name: "Test CEO",
      role: "CEO",
      company_id: company.id
    });

    // 3. Assessment
    const assessment = await Assessment.create({
      user_id: ceo.id,
      scores: {
        innovation: 40,
        efficiency: 55
      }
    });

    // 4. Objectives with KRs
    const objective = await Objective.create({
      title: "Test Objective",
      company_id: company.id,
      owner: ceo.id,
      key_results: [
        {
          title: "Test KR",
          target_value: 100,
          current_value: 0
        }
      ]
    });

    // 5. Goals
    const quarterlyGoal = await Goal.create({
      title: "Q1 Test Goal",
      objective_id: objective.id,
      key_result_id: objective.key_results[0]._id,
      time_period: "QUARTERLY",
      parent_goal_id: null
    });

    const weeklyGoals = [];
    for (let week = 1; week <= 12; week++) {
      const wg = await Goal.create({
        title: `Week ${week} Goal`,
        objective_id: objective.id,
        key_result_id: objective.key_results[0]._id,
        time_period: "WEEKLY",
        parent_goal_id: quarterlyGoal.id
      });
      weeklyGoals.push(wg);
    }

    // Update quarterly goal with children
    quarterlyGoal.child_goal_ids = weeklyGoals.map(g => g.id);
    await quarterlyGoal.save();

    // 6. Tasks
    const tasks = [];
    for (const weeklyGoal of weeklyGoals.slice(0, 3)) {
      for (let i = 0; i < 5; i++) {
        const task = await Task.create({
          title: `Task ${i + 1}`,
          goal_id: weeklyGoal.id,
          objective_id: objective.id,
          assigned_to: ceo.id,
          due_date: new Date()
        });
        tasks.push(task);
      }
    }

    return {
      company,
      users: [ceo],
      objective,
      quarterlyGoal,
      weeklyGoals,
      tasks
    };
  }
};
```

---

## ✅ TEST EXECUTION MATRIX

| Test Category | P0 | P1 | P2 | Total |
|--------------|----|----|----|----|
| Assessment | 1 | 1 | 0 | 2 |
| Objectives | 1 | 0 | 0 | 1 |
| Planning | 2 | 0 | 0 | 2 |
| Goals | 2 | 0 | 0 | 2 |
| Tasks | 2 | 0 | 0 | 2 |
| Dashboard | 2 | 1 | 0 | 3 |
| Cascade | 1 | 0 | 0 | 1 |
| Errors | 2 | 2 | 0 | 4 |
| Performance | 1 | 1 | 0 | 2 |
| **TOTAL** | **14** | **5** | **0** | **19** |

---

**Test Cases Version**: 1.0
**Total Test Cases**: 19 detailed scenarios
**Estimated Execution Time**: 16 hours
**Required Test Data**: ~1GB

*These detailed test cases ensure comprehensive coverage of Sprint 2 functionality including happy paths, edge cases, and error scenarios.*