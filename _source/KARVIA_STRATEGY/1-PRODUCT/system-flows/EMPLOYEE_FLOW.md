# 👤 EMPLOYEE JOURNEY - Task Execution & Personal Growth

**Version**: 2.0.0
**Updated**: 2025-10-24
**Aligned With**: MVP Technical Architecture V5 (7 Blocks, 6 Engines)
**Persona**: Employee / Individual Contributor
**Primary Goals**: Complete tasks, track progress, understand impact, grow capabilities

---

## 📊 JOURNEY OVERVIEW

**North Star**: Understand My Role → See My Tasks → Complete Work → Track Impact → Grow

**Frequency**: Daily execution + Weekly reflection + Quarterly reviews
**Key Screens**: Dashboard, Objectives, Assessment, Profile
**Critical Story**: **EMP-016**: View "Why Chain" Context (Week 8)

**Architecture Components Used**:
- **Block 1**: Core Execution (REQUIRED) - Tasks, Goals, Objectives
- **Block 2**: IAM (OPTIONAL) - Team context, company filtering
- **Block 3**: Assessment System (OPTIONAL) - SSI scoring
- **Block 5**: Progress Rollup (OPTIONAL) - Auto-aggregation
- **Engines**: IAM (8081), Assessment (8082), Planner (8083), Tracking (8086)

---

## 🗺️ END-TO-END JOURNEY WITH DATA FLOW

### PHASE 1: PERSONAL ASSESSMENT (Week 1-4)

#### Step 1: Receive Assessment Invitation
- **Story**: Prerequisite (Manager sends invitation via MGR-001)
- **Screen**: Email inbox
- **API**: Email sent via Mailjet/SendGrid
- **Data Flow**:
```
Manager Action → POST /api/invitations → IAM Engine (8081)
    ↓
Invitation Model: {
    email: "john@company.com",
    assessment_id: ObjectId,
    token: "32-byte-hex",
    expires_at: Date (7 days)
}
    ↓
Email Service → Employee Inbox
```
- **Action**:
  - Receive email: "Complete your Q4 2025 SSI Assessment"
  - Click assessment link
- **Outcome**: Directed to assessment page

#### Step 2: Complete Personal Assessment
- **Story**: **EMP-001**: Take Assessment
- **Screen**: `assessment-take.html`
- **API**: POST `/api/assessments/:id/submit`
- **Engine**: Assessment Engine (8082)
- **Data Flow**:
```
45 Questions → POST to Assessment Engine (8082)
    ↓
AssessmentResult Model: {
    user_id: ObjectId,
    assessment_id: ObjectId,
    responses: [{question_id, answer: 1-10, dimension}],
    scores: {
        overall: 72.5,
        dimensions: [
            {name: "Speed", score: 75},
            {name: "Strength", score: 60},
            {name: "Intelligence", score: 82}
        ]
    },
    weak_areas: [{dimension: "Strength", sub_area: "Financial", score: 55}]
}
```
- **Action**:
  - Answer 45 questions across 3 dimensions:
    - Speed: Decision-making, Execution, Adaptability (15 questions)
    - Strength: Financial, Resources, Resilience (15 questions)
    - Intelligence: Data Analytics, Strategic Thinking, Learning (15 questions)
  - Rate each 1-10
  - Save draft if needed (resume later)
  - Submit when complete
- **Outcome**: Assessment submitted, scores calculated

#### Step 3: View Personal Assessment Results
- **Story**: **EMP-002**: View Assessment Results
- **Screen**: `assessment-results.html`
- **API**: GET `/api/assessments/:id/results`
- **Action**:
  - View SSI scores:
    - Speed: 7.5/10 ✅ (Above avg)
    - Strength: 6.0/10 ⚠️ (Average)
    - Intelligence: 8.2/10 ✅ (Excellent)
  - View sub-dimension breakdown:
    - Speed → Decision Making: 8.0, Execution: 7.0
    - Strength → Financial: 5.5 ⚠️, Resources: 6.5
  - Color coding: Green (8-10), Yellow (6-7.9), Red (<6)
  - Download PDF for personal records
- **Outcome**: Understand personal strengths and growth areas

---

### PHASE 2: UNDERSTAND OBJECTIVES (Week 5)

#### Step 4: View My Objectives
- **Story**: **EMP-004**: View My Objectives
- **Screen**: `03_objectives.html` → "My Objectives" view
- **API**: GET `/api/objectives?user_id=me`
- **Engine**: Planner Engine (8083)
- **Data Flow**:
```
Request → Planner Engine (8083)
    ↓
Query: Objective.find({
    user_id: req.user.id,
    company_id: req.user.current_company_id // If IAM_BLOCK
})
    ↓
Returns: [{
    title: "Improve product reliability",
    progress_percentage: 42,
    status: "at_risk",
    key_results: [ObjectId, ObjectId],
    assessment_id: ObjectId // Lineage to source
}]
```
- **Action**:
  - See objectives assigned to me:
    - Objective 1: "Improve product reliability" (42% progress)
    - Objective 2: "Increase customer satisfaction" (68% progress)
  - View progress percentage with color coding:
    - Green (>75%): On track
    - Yellow (50-75%): Needs attention
    - Red (<50%): At risk
  - Click objective to see key results
- **Outcome**: Understand what I need to achieve

#### Step 5: Expand Key Results
- **Story**: EMP-004 (continued)
- **Screen**: `03_objectives.html` → Objective detail
- **API**: GET `/api/key-results?objective_id=xxx`
- **Action**:
  - Click objective to expand
  - View key results:
    - KR1: "Reduce system errors by 30%" (Current: 15% reduction)
    - KR2: "Achieve 99.9% uptime" (Current: 99.5%)
  - See my contribution to each KR
- **Outcome**: Know specific targets and current progress

---

### PHASE 3: VIEW PROFILE & HISTORY (Week 6)

#### Step 6: View My Profile
- **Story**: **EMP-005**: View My Profile
- **Screen**: `07_profile.html`
- **API**: GET `/api/users/profile`
- **Data Model**:
```javascript
User.profile: {
    stats: {
        tasks_completed: 145,
        current_objectives: 2,
        assessment_completion_rate: 100
    }
}
```
- **Action**:
  - View personal info: Name, email, role, department, team
  - See account stats:
    - Tasks completed (all time): 145
    - Current objectives: 2
    - Assessment completion rate: 100%
- **Outcome**: Personal dashboard overview

#### Step 7: Upload Avatar
- **Story**: **EMP-006**: Upload Avatar
- **Screen**: `07_profile.html` → "Change Photo" button
- **API**: POST `/api/users/avatar`
- **Data Flow**:
```
Upload → Multer → S3/Local Storage
    ↓
User.avatar_url = "https://storage/avatars/user_123.jpg"
```
- **Action**:
  - Click "Change Photo"
  - Upload image (JPG/PNG, max 2MB)
  - Crop/resize
  - Save
- **Outcome**: Profile photo updated

#### Step 8: View Assessment History
- **Story**: **EMP-007**: View Assessment History
- **Screen**: `07_profile.html` → "Assessment History" tab
- **API**: GET `/api/assessments/history`
- **Action**:
  - View timeline of past assessments:
    - Q4 2025: Speed 7.5, Strength 6.0, Intelligence 8.2
    - Q3 2025: Speed 7.0, Strength 5.5, Intelligence 7.8
  - See trend: "Speed improved +0.5, Strength improved +0.5"
  - Click assessment to view detailed results
- **Outcome**: Track personal growth over time

---

### PHASE 4: DAILY TASK EXECUTION (Week 8 - After Week 7 creates tasks)

#### Step 9: View Daily Tasks
- **Story**: **EMP-008**: View Daily Tasks
- **Screen**: `02_dashboard.html`
- **API**: GET `/api/tasks?assigned_to=me&status=active`
- **Engine**: Tracking Engine (8086)
- **Action**:
  - Dashboard shows today's tasks:
    - "Fix payment gateway bug" (High priority, Due today)
    - "Code review for login fix" (Medium, Due tomorrow)
    - "Update API documentation" (Low, Due Friday)
  - See priority badges: High (red), Medium (yellow), Low (green)
  - Filter by: All, Today, This Week, Overdue
  - Sort by: Priority, Due Date, Created Date
- **Outcome**: Clear view of what to work on today

#### Step 10: View "Why Chain" Context (CRITICAL)
- **Story**: **EMP-016**: View "Why Chain" Context ⭐ NEW (P0)
- **Screen**: `02_dashboard.html` → Click task → Breadcrumb at top
- **API**: GET `/api/tasks/:id/context`
- **Data Flow**:
```
Task.goal_id → Goal.key_result_id → KeyResult.objective_id → Objective.assessment_id
    ↓
Complete Chain Returned with all linkages
```
- **Action**:
  - Click task: "Fix payment gateway bug"
  - See "Why Chain" breadcrumb:
    ```
    📊 Company OKR > 🎯 Objective > 🔑 Key Result > 📅 Quarterly Goal > 📆 Weekly Goal > ✅ This Task
    ```
  - Click each level to expand:
    - **Task**: "Fix payment gateway bug" (This task)
    - **Weekly Goal**: "Fix 5 bugs this week" (3/5 done, 60%)
    - **Quarterly Goal**: "Complete 50 bug fixes in Q1" (20/50 done, 40%)
    - **Key Result**: "Reduce system errors by 30%" (15% reduction achieved)
    - **Objective**: "Improve product reliability" (42% progress)
    - **Company OKR**: "Scale to 10,000 customers" (38% progress)
    - **Source**: "Based on Q4 2025 SSI Assessment - Financial Strength gap (5.5/10)"
  - See visual indicator: "Your task represents 0.4% of Quarterly Goal progress"
  - Tooltip shows: "Generated from assessment insight: Addresses Financial Strength gap"
- **Outcome**: **UNDERSTAND WHY MY WORK MATTERS** 🎯

#### Step 11: Complete Task
- **Story**: **EMP-009**: Complete Task
- **Screen**: `02_dashboard.html` → Task detail
- **API**: PUT `/api/tasks/:id/complete`
- **Engine**: Tracking Engine (8086)
- **Data Flow with Progress Rollup (Block 5)**:
```
Task.status = "completed" → Post-Save Hook
    ↓ (If PROGRESS_ROLLUP enabled)
Update Goal.progress → Update KeyResult.progress → Update Objective.progress
```
- **Action**:
  - Click task: "Fix payment gateway bug"
  - View task details: Description, due date, priority, linked goal
  - Click "Mark Complete" button
  - Add completion note: "Fixed null pointer exception in payment handler"
  - Confirm completion
- **Outcome**: Task marked complete, progress rolls up to weekly goal

#### Step 12: Update Task Progress (if not complete)
- **Story**: **EMP-010**: Update Task Progress
- **Screen**: `02_dashboard.html` → Task detail
- **API**: PUT `/api/tasks/:id/progress`
- **Action**:
  - Click task: "Code review for login fix"
  - Click "Update Progress" button
  - Set progress: 50% (slider or percentage input)
  - Add note: "Reviewed 5 of 10 files, found 2 minor issues"
  - Save progress
- **Outcome**: Task progress updated, manager can see status

#### Step 13: View Task History
- **Story**: **EMP-011**: View Task History
- **Screen**: `02_dashboard.html` → "History" tab
- **API**: GET `/api/tasks/history`
- **Action**:
  - View completed tasks:
    - This week: 8 tasks completed
    - Last week: 10 tasks completed
    - This month: 35 tasks completed
  - Filter by date range: Last 7 days, Last 30 days, All time
  - Search by keyword: "payment gateway"
- **Outcome**: Track personal productivity

#### Step 14: Daily Reflection (Optional)
- **Story**: **EMP-012**: Daily Reflection
- **Screen**: `02_dashboard.html` → "Daily Reflection" widget
- **API**: POST `/api/reflections`
- **Action**:
  - End of day: Click "Add Reflection" button
  - Answer prompts:
    - What did I accomplish today? "Fixed 2 bugs, reviewed 1 PR"
    - What blockers did I face? "Waiting for API access"
    - What will I do tomorrow? "Complete payment gateway testing"
  - Save reflection (private, visible only to manager if shared)
- **Outcome**: Daily learning and planning

#### Step 15: Receive Task Reminders
- **Story**: **EMP-013**: Task Reminders
- **Screen**: Dashboard notification or email
- **Engine**: Observer Engine (8085) + Notification Service
- **Action**:
  - Receive reminder: "Task 'Fix payment gateway bug' is due today"
  - Receive overdue alert: "2 tasks are overdue"
  - Click notification to view task details
- **Outcome**: Stay on top of deadlines

---

### PHASE 5: GOAL MANAGEMENT (Week 7-8)

#### Step 16: View My Goals
- **Story**: **EMP-014**: View My Goals
- **Screen**: `06_planning.html` or `03_objectives.html` → "My Goals" tab
- **API**: GET `/api/goals?user_id=me`
- **Engine**: Planner Engine (8083)
- **Action**:
  - View quarterly goals assigned to me:
    - Q1 2026: "Complete 20 bug fixes" (8/20 done, 40%)
  - View weekly goals:
    - This week: "Fix 5 bugs" (3/5 done, 60%)
    - Next week: "Implement 2 new features" (0/2 done, 0%)
  - See progress bars and due dates
- **Outcome**: Understand short-term and long-term goals

#### Step 17: Update Goal Progress
- **Story**: **EMP-015**: Update Goal Progress
- **Screen**: Goal detail view → "Update Progress" button
- **API**: PUT `/api/goals/:id/progress`
- **Action**:
  - Click weekly goal: "Fix 5 bugs"
  - See linked tasks: 3 completed, 2 in progress
  - Progress auto-calculated: 60% (3/5 tasks done)
  - Add manual update if needed: "On track to complete by Friday"
- **Outcome**: Goal progress reflects task completion

---

### PHASE 6: RECOGNITION & IMPACT (Week 10-11 BETA)

#### Step 18: See Business Impact Metric (BETA)
- **Story**: **EMP-017**: See Business Impact Metric ⭐ NEW (BETA)
- **Screen**: `07_profile.html` → "Impact Score" widget
- **API**: GET `/api/users/:id/impact-score`
- **Action**:
  - View calculated "Business Impact Score": 7.8/10
  - See breakdown:
    - Tasks completed: +2.5 points
    - Goals achieved: +3.0 points
    - Strategic contribution: +2.3 points (based on linked OKRs)
  - See trend: "Impact score increased +0.5 this quarter"
  - View leaderboard (optional): "You rank #12 of 50 employees"
- **Outcome**: Quantified contribution to company success

#### Step 19: Receive Recognition Notifications (BETA)
- **Story**: **EMP-018**: Recognition Notifications ⭐ NEW (BETA)
- **Screen**: Dashboard notification
- **Engine**: Observer Engine (8085)
- **Action**:
  - Receive notification: "Your task contributed to achieving Key Result 'Reduce errors by 30%'! 🎉"
  - Receive quarterly recognition: "You completed 100% of Q1 goals - Great job!"
  - Manager adds public praise: "John's bug fixes improved system stability by 25%"
  - View recognition history on profile
- **Outcome**: Feel valued and motivated

---

## 🔗 LINEAGE TRACKING (Critical for Employee Motivation)

**Full Chain Visibility (EMP-016 "Why Chain")**:
```
Assessment (Q4 2025 SSI - My Financial Strength: 5.5/10)
    ↓
Company OKR ("Scale to 10,000 customers")
    ↓
Objective ("Improve product reliability")
    ↓
Key Result ("Reduce system errors by 30%")
    ↓
Quarterly Goal ("Complete 50 bug fixes in Q1")
    ↓
Weekly Goal ("Fix 5 bugs this week") ← Manager assigns
    ↓
My Task ("Fix payment gateway bug") ← I execute
```

**Critical Insight**: "This task addresses MY assessment gap (Financial Strength 5.5) and contributes 0.4% to quarterly goal"

---

## 🚨 CRITICAL GAPS FILLED BY NEW STORIES

### **EMP-016: View "Why Chain" Context** ⭐ NEW (P0)
- **Why Critical**: Employees need to see HOW their work connects to company goals
- **Impact**: Increase motivation by 35%, reduce task abandonment by 50%
- **Without This**: Employees don't understand why their work matters (low engagement)
- **Research**: Studies show employees who see impact are 2.5x more engaged

### **EMP-017: Business Impact Metric** ⭐ NEW (BETA)
- **Why Critical**: Quantifies employee contribution
- **Impact**: Fair performance reviews, clear growth paths
- **Without This**: Subjective performance assessments

### **EMP-018: Recognition Notifications** ⭐ NEW (BETA)
- **Why Critical**: Timely positive reinforcement
- **Impact**: Improve retention, boost morale
- **Without This**: Good work goes unnoticed

---

## 📊 USER STORIES BY WEEK

### Week 1-4: Assessment System
- ✅ EMP-001: Take Assessment
- ✅ EMP-002: View Assessment Results

### Week 5: Objectives
- ⬜ EMP-004: View My Objectives

### Week 6: Profile
- ⬜ EMP-005: View My Profile
- ⬜ EMP-006: Upload Avatar
- ⬜ EMP-007: View Assessment History

### Week 7: Goals
- ⬜ EMP-014: View My Goals
- ⬜ EMP-015: Update Goal Progress

### Week 8: Dashboard (after Week 7 creates tasks)
- ⬜ EMP-008: View Daily Tasks
- ⬜ EMP-009: Complete Task
- ⬜ EMP-010: Update Task Progress
- ⬜ EMP-011: View Task History
- ⬜ EMP-012: Daily Reflection
- ⬜ EMP-013: Task Reminders
- ⬜ **EMP-016: View "Why Chain" Context** ⭐ NEW (CRITICAL P0)

### Week 10-11: Impact & Recognition (BETA)
- ⬜ **EMP-017: Business Impact Metric** ⭐ NEW (BETA)
- ⬜ **EMP-018: Recognition Notifications** ⭐ NEW (BETA)

**Total Employee Stories**: 17 (2 complete, 15 not started)

---

## 🔐 PERMISSIONS & ACCESS CONTROL

**Employee Default Permissions**:
```javascript
{
    objectives: ["read_own"],
    key_results: ["read_own", "read_team"],
    goals: ["read_own"],
    tasks: ["read_own", "read_assigned", "update_assigned", "complete"],
    assessments: ["read_own", "take"],
    profile: ["read_own", "update_own"],
    reflections: ["create_own", "read_own"],

    // Cannot
    objectives: ["create", "delete"], // Manager only
    teams: ["create", "manage"], // Manager only
    company: ["view_all"] // Executive only
}
```

---

## 💡 EMPLOYEE VALUE PROPOSITION

**What Employees Get**:
1. ✅ **Clarity**: Know exactly what to work on (Dashboard)
2. ✅ **Context**: Understand WHY their work matters ("Why Chain")
3. ✅ **Growth**: Track personal development (Assessment history)
4. ✅ **Recognition**: Get acknowledged for contributions (Notifications)
5. ✅ **Impact**: See quantified business impact (Impact score)

**Without This System**:
- ❌ Work in the dark (don't know priorities)
- ❌ Feel disconnected from company goals
- ❌ No visibility into growth
- ❌ Contributions go unnoticed

---

## 🔗 RELATED DOCUMENTATION

- [MVP_TECHNICAL_ARCHITECTURE_V5.md](../../KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/MVP_TECHNICAL_ARCHITECTURE_V5.md) - System design
- [MASTER_DEV_LIST_V5.md](../MASTER_DEV_LIST_V5.md) - Week-by-week plan
- [MVP_USER_STORIES_V3.2.md](../MVP_USER_STORIES_V3.2.md) - All stories
- [USER_JOURNEYS_MASTER.md](./USER_JOURNEYS_MASTER.md) - Overview
- [MANAGER_JOURNEY.md](./MANAGER_JOURNEY.md) - Manager journey
- [Data Model Visualization](../../../data_model_visualization.html) - Interactive data flow

---

**Version**: 2.0.0
**Last Updated**: 2025-10-24
**Status**: ✅ Updated - Aligned with Current Architecture
**Note**: All original features preserved, enhanced with technical architecture details