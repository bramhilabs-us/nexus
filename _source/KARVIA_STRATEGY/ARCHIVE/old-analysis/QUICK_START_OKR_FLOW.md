# KARVIA BUSINESS - QUICK START OKR CASCADE FLOW

## The Complete User Journey (Assessment → Execution)

### PHASE 1: ASSESSMENT (User Takes Test)

**Endpoint**: `GET /pages/assessment-hub.html`

1. User receives assessment invitation (email or link)
2. Clicks assessment link or logs in
3. Takes 45-minute Cultural Discipline Assessment
   - Speed questions: "How quickly do you adapt to change?"
   - Strength questions: "How do you handle pressure?"
   - Intelligence questions: "How do you solve complex problems?"
4. System scores in real-time using **SSIScoringService**

**Database**: Assessment document created with:
```javascript
{
  ssi_scores: { speed: 45, strength: 72, intelligence: 58 },
  dimension_scores: { speed: { raw: 4.5, weighted: 1.35 }, ... },
  composite_score: 58,
  status: 'completed'
}
```

---

### PHASE 2: WEAK AREAS ANALYSIS

**Service**: `analyticsService.getWeakAreas()`

System identifies scores below 40 threshold:
- Speed: 45 (Weak area - below 40)
- Intelligence: 58 (OK)
- Strength: 72 (Strong)

Output:
```javascript
{
  total_weak_count: 1,
  dimensions: [{ dimension: 'speed', score: 45, gap: 5 }],
  categories: [
    { category: 'execution_velocity', weak_questions: 3 },
    { category: 'decision_speed', weak_questions: 2 }
  ]
}
```

---

### PHASE 3: AI OKR GENERATION

**Service**: `aiOKRService.generateOKRsFromAssessment()`

**Context Built**:
```javascript
{
  business: {
    name: "Acme Corp",
    industry: "SaaS",
    size_category: "50-200 employees"
  },
  user: {
    name: "Jane Smith",
    role: "BUSINESS_OWNER"
  },
  weak_areas: {
    speed: 45,
    improvements_needed: "execution_velocity, decision_speed"
  }
}
```

**AI Generates 3-5 SMART Objectives**:

```javascript
[
  {
    title: "Improve organizational decision velocity",
    description: "Reduce time-to-decision by 40% through streamlined processes",
    key_results: [
      {
        title: "Implement daily standup review process",
        metric_type: "percentage",
        target_value: 100,
        quarter: 1
      },
      {
        title: "Deploy decision logging system",
        metric_type: "number",
        target_value: 50,
        quarter: 1
      }
    ]
  },
  // ... 2-4 more objectives
]
```

**Status**: DRAFT (awaiting review)

**Database**: AIOKRSuggestion document created

---

### PHASE 4: REVIEW & APPROVE OKRs

**UI**: `/pages/ai-okr-review.html`

User reviews 3-5 AI-generated objectives:
- Can edit titles, descriptions, KRs
- Can approve individual objectives
- Can reject and regenerate

**Approved objectives** are converted to Objective documents:
```javascript
POST /api/objectives
{
  title: "Improve organizational decision velocity",
  description: "...",
  owner_id: userId,
  target_year: 2025,
  start_date: Date.now(),
  end_date: "2025-12-31",
  status: "active",
  key_results: [
    {
      title: "Implement daily standup review process",
      metric_type: "percentage",
      target_value: 100,
      current_value: 0,
      quarter: 1,
      status: "not_started"
    },
    // ...
  ]
}
```

---

### PHASE 5: CREATE QUARTERLY GOALS

**UI**: `/pages/okr-creation-wizard.html` (Step 2)

For each Key Result, create 4 Quarterly Goals (Q1-Q4):

**Q1 Goal Example**:
```javascript
POST /api/goals
{
  objective_id: objectiveId,
  key_result_id: krId,
  name: "Q1: Implement daily standup review process",
  owner_id: userId,
  quarter: "Q1",
  week: undefined,  // Not set for quarterly
  due_date: "2025-03-31",
  target_value: 25,  // 1/4 of annual target
  status: "not_started"
}
```

**Result**: 4 Goal documents created (Q1, Q2, Q3, Q4)

---

### PHASE 6: BREAK DOWN INTO WEEKLY GOALS ⚠️ BROKEN

**Endpoint**: `POST /api/goals/:id/breakdown`

This endpoint SHOULD break Q1 Goal into 13 weekly goals:

```javascript
POST /api/goals/[Q1_GOAL_ID]/breakdown
{
  // No body needed, system calculates
}
```

**Expected Behavior**:
- Creates 13 Goal documents (one per week)
- Each has: `parent_goal_id: Q1_GOAL_ID`
- Each has: `time_period: "WEEKLY"`
- Each has: `target_value: Q1_target / 13`

**CRITICAL BUG**: These fields DON'T EXIST in Goal schema!
```javascript
// ❌ MISSING FROM SCHEMA:
parent_goal_id      // Route tries to save, MongoDB ignores
child_goal_ids      // Route tries to save, MongoDB ignores
time_period         // Route tries to save, MongoDB ignores
```

**Workaround**: Manually link weekly goals via frontend logic

---

### PHASE 7: CREATE TASKS

**UI**: `/pages/goal-details.html`

For each weekly goal, create 3-20 action tasks:

```javascript
POST /api/tasks
{
  goal_id: weeklyGoalId,
  objective_id: objectiveId,
  name: "Review standup notes and identify blockers",
  description: "Each day in the week",
  assigned_to: userId,
  due_date: "2025-01-10",
  priority: "high",
  task_type: "action",
  status: "todo",
  progress: 0,
  
  // Can add subtasks immediately
  subtasks: [
    { name: "Read 5 standup summaries" },
    { name: "Identify 3 key blockers" },
    { name: "Document in shared drive" }
  ]
}
```

**Result**: Task document in database

---

### PHASE 8: EXECUTION & PROGRESS

**Team Members**:
1. View assigned tasks in `/pages/team-tasks.html`
2. Update task status: `todo` → `in_progress` → `completed`
3. Update progress: `0%` → `50%` → `100%`
4. Add subtask completions and checklist items

**API Call**:
```javascript
PUT /api/tasks/:id
{
  status: "in_progress",
  progress: 50
}
```

**Post-Save Cascade** (Automatic):
```javascript
Task complete → Goal updates metrics → Objective updates progress
```

---

### PHASE 9: PROGRESS TRACKING

**Dashboards Show Real-Time Progress**:

**Executive Dashboard** (`/pages/executive-dashboard.html`):
```
Objective: "Improve organizational decision velocity"
├─ Status: Active (55% complete)
├─ Q1 Goal: 40% complete (4/10 tasks done)
├─ Q2 Goal: 0% complete
├─ Q3 Goal: 0% complete
└─ Q4 Goal: 0% complete
```

**Task Dashboard** (`/pages/team-tasks.html`):
```
Weekly Goal: "Week 1 - Process Implementation"
├─ Task 1: Complete ✓ (Jane)
├─ Task 2: In Progress (50%) (John)
├─ Task 3: Blocked (waiting for approvals)
└─ Task 4: Not Started (pending assignment)
```

---

## DATA RELATIONSHIPS AT A GLANCE

```
Assessment (User scores)
  ↓
  └─ AI Analysis → Weak Areas
       ↓
       └─ AI OKR Generation → AIOKRSuggestion (Draft)
            ↓
            └─ User Approves → Objective (Annual)
                 ↓
                 ├─ Key Result 1
                 │  ├─ Q1 Goal → (13 Weekly Goals) → Tasks
                 │  ├─ Q2 Goal → (13 Weekly Goals) → Tasks
                 │  ├─ Q3 Goal → (13 Weekly Goals) → Tasks
                 │  └─ Q4 Goal → (13 Weekly Goals) → Tasks
                 │
                 ├─ Key Result 2
                 │  └─ (same structure)
                 │
                 └─ Key Result 3 (etc...)
```

---

## CRITICAL FIELDS REFERENCE

### Assessment Model
```javascript
composite_score         // 0-100 final score
dimension_scores       // speed, strength, intelligence (each 0-100)
ssi_scores            // Legacy score format (0-100 scale)
status                // 'completed' triggers OKR generation
```

### Objective Model
```javascript
title                 // "Improve organizational decision velocity"
status                // 'draft' | 'active' | 'completed'
progress_percentage   // Auto-calc from key results
key_results          // Embedded array, NOT separate collection
```

### Goal Model (INCOMPLETE)
```javascript
objective_id         // Parent objective
quarter              // 'Q1' | 'Q2' | 'Q3' | 'Q4'
week                 // 1-13 (if weekly) | undefined (if quarterly)
progress             // 0-100 (auto-calc from tasks)
status               // 'not_started' | 'in_progress' | 'completed'

// ❌ MISSING BUT USED IN ROUTES:
parent_goal_id       // Should link weekly → quarterly
child_goal_ids       // Should list quarterly's weekly children
time_period          // 'QUARTERLY' or 'WEEKLY'
```

### Task Model
```javascript
goal_id              // Parent goal (required)
objective_id         // Objective (for cascade, required)
assigned_to          // User ID (single assignment)
status               // 'todo' | 'in_progress' | 'completed' | 'blocked'
progress             // 0-100
priority             // 'low' | 'medium' | 'high' | 'urgent'
subtasks             // Embedded array for decomposition
```

---

## API ENDPOINTS QUICK REFERENCE

### Assessment
```
POST /api/assessments/invitation/:token/questions     - Get questions
POST /api/assessments/invitation/:token/submit        - Submit responses
GET  /api/assessments/results/:companyId              - Get results
```

### Objectives
```
POST /api/objectives                                  - Create
GET  /api/objectives                                  - List with filters
PUT  /api/objectives/:id                              - Update
POST /api/objectives/:id/key-results                  - Add KR
```

### Goals
```
POST /api/goals                                       - Create
GET  /api/goals                                       - List with filters
PUT  /api/goals/:id                                   - Update
POST /api/goals/:id/breakdown                         - BROKEN: Create weekly breakdown
```

### Tasks
```
POST /api/tasks                                       - Create
GET  /api/tasks                                       - List with filters
PUT  /api/tasks/:id                                   - Update
PUT  /api/tasks/:id/progress                          - Update just progress
POST /api/tasks/:id/subtask                           - Add subtask
```

---

## KEY SERVICES & SCORING

### SSI Scoring (Speed/Strength/Intelligence)
```javascript
Template weights: { speed: 0.35, strength: 0.35, intelligence: 0.30 }
Raw score calculation: Average of 0-10 responses
Weighted score: raw_score * template_weight * 10
Composite: Sum of all weighted scores (0-100 scale)
```

### AI OKR Generation
```javascript
Threshold: 40 (scores below = weak area)
Model: GPT-4
Temperature: 0.7
Max tokens: 2500
Output: 3-5 objectives with 2-4 KRs each
```

### Cascade Rules
```javascript
Max goals per department: 5
Max goals per team: 3
Min team size for assignment: 3
Category weight distribution: revenue (40%), operational (20%), etc.
```

---

## DEBUGGING CHECKLIST

If OKRs not creating:
- [ ] Assessment completed? Check `status: 'completed'`
- [ ] Weak areas detected? Run `analyticsService.getWeakAreas()`
- [ ] AI enabled? Check `FEATURE_OPENAI_ENABLED=true`
- [ ] GPT-4 quota? Check OpenAI account
- [ ] MongoDB connection? Check logs

If tasks not cascading to goals:
- [ ] Task saved? Check post-save hook triggered
- [ ] Goal document exists? Verify `goal_id` is valid
- [ ] Check `goal.updateTaskMetrics()` called

If weekly goals not created:
- [ ] Check `/api/goals/:id/breakdown` endpoint
- [ ] Verify parent goal exists
- [ ] Check for `parent_goal_id` field (BROKEN - missing from schema)
- [ ] Manual workaround: Link weekly goals via frontend

---

**Last Updated**: November 12, 2025  
**Status**: Pre-Production (Ready except for Goal breakdown bug)
