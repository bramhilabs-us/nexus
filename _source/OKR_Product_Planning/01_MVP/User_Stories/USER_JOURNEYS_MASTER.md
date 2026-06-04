# 🗺️ USER JOURNEYS MASTER - Modular Assessment-Driven OKR System

**Version**: 1.0.0
**Created**: 2025-10-22
**Architecture**: Lego-block modularity - Any Assessment → OKR → Goals → Tasks
**North Star**: Assessment-driven execution with full traceability

---

## 🎯 CORE DESIGN PRINCIPLES

### 1. **Modular Assessment System** (Lego Block #1)
```
ANY Assessment Type → Standardized Output → OKR Generation
```

**Supported Assessment Types**:
- ✅ SSI Assessment (Speed/Strength/Intelligence) - Week 1-4 complete
- ⬜ Performance Review Assessment (Future)
- ⬜ 360-Degree Feedback (Future)
- ⬜ Skills Matrix Assessment (Future)
- ⬜ Custom Assessment (User-defined dimensions)

**Key Requirement**: All assessments output to standard schema:
```javascript
{
  assessment_type: "SSI" | "Performance" | "360" | "Skills" | "Custom",
  business_id: ObjectId,
  dimensions: [
    { name: "Speed", score: 7.5, weight: 0.35 },
    { name: "Strength", score: 6.2, weight: 0.30 },
    { name: "Intelligence", score: 8.1, weight: 0.35 }
  ],
  aggregated_insights: "text summary",
  generated_at: Date
}
```

**Why This Matters**: Tomorrow you can swap SSI → Skills Matrix, system still works.

---

### 2. **Execution Chain** (Lego Blocks #2-6)
```
Assessment → Objective → Key Results → Quarterly Goals → Weekly Goals → Daily Tasks
```

**Full Traceability**:
Every task has a `lineage` object:
```javascript
{
  task_id: "task_123",
  title: "Fix payment gateway bug",
  lineage: {
    daily_task: "task_123",
    weekly_goal: "goal_456",        // Week 8
    quarterly_goal: "goal_789",     // Week 8
    key_result: "kr_101",           // Week 5 (Objective model)
    objective: "obj_202",           // Week 5
    assessment: "assessment_303"    // Week 1-4
  }
}
```

**Context Visibility Rule**: Each persona sees **their level + one level up**
- Employee: Sees Task → Weekly Goal → Quarterly Goal
- Manager: Sees Quarterly Goal → Key Result → Objective
- Executive: Sees Objective → Assessment Insight
- Admin: Sees everything (full chain)

---

## 👤 PERSONA-SPECIFIC JOURNEYS

### **1. EXECUTIVE JOURNEY (Strategic Orchestrator)**

**Context Visibility**: Full cascade (Assessment → all the way to Tasks)

#### Journey Flow:
```
Week 1: Commission Assessment
  ↓
Week 3: Review Assessment Results
  ↓
Week 4: Generate/Accept AI OKRs
  ↓
Week 5: View Company Objectives Dashboard
  ↓
Week 9: Create Yearly → Quarterly Breakdown
  ↓
Week 11: Monitor Analytics (bottlenecks, at-risk OKRs)
  ↓
Ongoing: Course corrections
```

#### Key Stories:
- **EXEC-001**: View Assessment Results [Week 3] ✅
- **EXEC-002**: Generate AI OKRs [Week 4] ✅
- **EXEC-004**: Review AI OKRs [Week 5 Day 1] 🔴
- **EXEC-003**: View All Objectives [Week 5] ⬜
- **EXEC-012**: Create Yearly OKRs [Week 9] ⬜
- **EXEC-013**: Break into Quarterly Goals [Week 9] ⬜
- **EXEC-011**: **CASCADE to Teams** [Week 9] ⬜ **MISSING DETAILS**
- **EXEC-016**: View Analytics Dashboard [Week 11] ⬜

#### **NEW STORY NEEDED**:
**EXEC-011B**: Approve Manager Quarterly Plans
- After managers create quarterly plans (MGR-021), Executive reviews and approves
- Acceptance: Approval workspace, comments, accept/reject per team
- Implementation: Week 9 Day 4

---

### **2. CONSULTANT JOURNEY (Assessment Expert)**

**Context Visibility**: Assessment → OKRs only (not execution details)

#### Journey Flow:
```
Week 1: Create Custom Template (adjust SSI weights)
  ↓
Week 1: Send Invitations (20+ people)
  ↓
Week 3: Track Completion Status
  ↓
Week 3: View Aggregated Results
  ↓
Week 4: Generate AI OKRs
  ↓
Week 4: Collaborative Review with Executive [MISSING]
  ↓
Week 6: Compare Across Clients [Moved from Week 9]
```

#### Key Stories:
- **CONS-001 to CONS-006**: Assessment flow [Week 1-4] ✅
- **CONS-007**: View Multi-Company Stats [Week 6] ⬜ **(Moved earlier)**
- **CONS-008**: View SSI Heatmap by Team [Week 6] ⬜ **NEW**
- **CONS-010**: Compare Client Plans [Week 9] ⬜

#### **NEW STORIES NEEDED**:
**CONS-007B**: View Team SSI Breakdown
- See which teams are strong in Speed vs Strength vs Intelligence
- Heatmap visualization
- Implementation: Week 6 Day 3

**CONS-009B**: Collaborative OKR Review with Executive
- Share AI-generated OKRs in-app with Executive
- Real-time comments and adjustments
- Implementation: Week 10 (Polish phase)

---

### **3. MANAGER JOURNEY (Team Orchestrator)**

**Context Visibility**: Quarterly Goals → Key Results → Objectives (one level up)

#### Journey Flow:
```
Week 5: Create Team + Add Members
  ↓
Week 5: View Team Objectives (cascaded from Executive)
  ↓
Week 6: View Team Assessment Health [MISSING]
  ↓
Week 8: Break Objectives → Quarterly Goals
  ↓
Week 8: Assign Goals to Team Members
  ↓
Week 8: Create Weekly Goals from Quarterly
  ↓
Week 7: Monitor Team Dashboard (daily)
  ↓
Week 7: Intervene when member at risk [MISSING WORKFLOW]
  ↓
Weekly: Generate Roll-up Report to Executive [MISSING]
```

#### Key Stories:
- **MGR-004 to MGR-007**: Team Management [Week 5] ⬜
- **MGR-008**: Track Objective Progress [Week 5] ⬜
- **MGR-015 to MGR-020**: Goal Assignment [Week 8] ⬜
- **MGR-012 to MGR-014**: Dashboard & Notifications [Week 7] ⬜
- **MGR-021 to MGR-024**: Planning [Week 9] ⬜

#### **NEW STORIES NEEDED**:

**MGR-025**: View Team Assessment Health [Week 6]
- See team's SSI scores from latest assessment
- Compare to company average
- Identify capability gaps
- Implementation: Week 6 Day 2

**MGR-026**: Intervention Workflow [Week 7]
- Automated alert when team member's tasks are >50% overdue
- Quick actions: Message member, Reassign tasks, Adjust deadline
- Implementation: Week 7 Day 4

**MGR-027**: Generate Weekly Roll-up Report [Week 11]
- Summary of team progress for Executive
- Export as PDF or share link
- Implementation: Week 11 Day 3

---

### **4. EMPLOYEE JOURNEY (Individual Contributor)**

**Context Visibility**: My Tasks → Weekly Goal → Quarterly Goal (two levels up max)

#### Journey Flow:
```
Week 3: Take Assessment (if invited)
  ↓
Week 7: View Dashboard (today's 3-5 tasks)
  ↓
Task Click: See "Why Chain" [MISSING]
  ↓
Week 7: Mark Task Complete
  ↓
Week 7: Update Progress Notes
  ↓
Week 5: See Progress Ring Update (Objective level)
  ↓
Week 7: Receive Recognition Notification [MISSING]
  ↓
Week 7: View Business Impact [MISSING]
  ↓
Week 7: Daily Reflection (journal) [Optional]
```

#### Key Stories:
- **EMP-001 to EMP-003**: Assessment [Week 1-3] ✅
- **EMP-004**: View Objectives [Week 5] ⬜
- **EMP-008 to EMP-013**: Dashboard & Tasks [Week 7] ⬜
- **EMP-014 to EMP-015**: Goals [Week 8] ⬜

#### **NEW STORIES NEEDED**:

**EMP-016**: View "Why Chain" Context [Week 7]
- When viewing task, show breadcrumb:
  - Task → Weekly Goal → Quarterly Goal → Objective → Company OKR
- Click any level to see details
- Implementation: Week 7 Day 3

**EMP-017**: See Business Impact Metric [Week 11]
- "Your 5 completed tasks contributed 2.3% to Company Objective: Increase Revenue"
- Requires calculation engine
- Implementation: Week 11 Day 4

**EMP-018**: Recognition Notification [Week 10]
- Manager can send "Great job!" with badge
- Appears in notification center
- Implementation: Week 10 Day 5 (polish)

---

### **5. ADMIN JOURNEY (System Orchestrator)**

**Context Visibility**: Everything (full system access)

#### Journey Flow:
```
Week 5: Create Teams & Assign Managers
  ↓
Week 11: Bulk Import Users (CSV)
  ↓
Week 11: Assign Roles (Admin/Exec/Manager/Employee/Consultant)
  ↓
Week 11: Configure Feature Flags
  ↓
Week 11: View System Health Dashboard
  ↓
Ongoing: User Support & Troubleshooting
```

#### Key Stories:
- **ADMIN-001 to ADMIN-002**: Question Library [Week 1] ✅
- **ADMIN-003**: Manage Users [Week 11] ⬜
- **ADMIN-004 to ADMIN-010**: Admin Panel [Week 11] ⬜

**No new stories needed** - Admin scope is clear.

---

## 🔄 COMPLETE END-TO-END FLOW (Assessment → Execution)

### **The Full Chain** (12 Weeks)

```
WEEK 1-4: ASSESSMENT PHASE
┌─────────────────────────────────────────┐
│ Consultant creates SSI template         │
│         ↓                                │
│ Sends to 20 employees                   │
│         ↓                                │
│ Employees complete assessment           │
│         ↓                                │
│ System calculates:                      │
│   - Individual SSI scores               │
│   - Team aggregated scores              │
│   - Company average scores              │
│         ↓                                │
│ AI generates OKR recommendations        │
└─────────────────────────────────────────┘

WEEK 5: OKR ACCEPTANCE
┌─────────────────────────────────────────┐
│ Executive reviews AI OKRs               │
│         ↓                                │
│ Consultant + Executive collaborate      │ [NEW]
│         ↓                                │
│ Executive accepts 5 company OKRs        │
│         ↓                                │
│ OKRs appear in "Objectives" screen      │
│   Each OKR has 3-5 Key Results          │
└─────────────────────────────────────────┘

WEEK 8: GOAL ASSIGNMENT
┌─────────────────────────────────────────┐
│ Manager views Team Objectives           │
│         ↓                                │
│ Manager breaks KR → Quarterly Goals     │
│   Example: KR "Increase revenue 20%"    │
│            → Q1 Goal "Add 50 clients"   │
│         ↓                                │
│ Manager assigns goals to team members   │
│         ↓                                │
│ System creates Weekly Goals             │
│   Q1 Goal "50 clients"                  │
│   → Week 1: "Close 4 deals"             │
│   → Week 2: "Close 4 deals" ...         │
└─────────────────────────────────────────┘

WEEK 7: DAILY EXECUTION (Reordered!)
┌─────────────────────────────────────────┐
│ Employee logs in to Dashboard           │
│         ↓                                │
│ Sees 3-5 tasks for today                │
│   Each task shows:                      │
│   - "Why Chain" breadcrumb [NEW]        │
│   - Due date, priority                  │
│         ↓                                │
│ Employee completes task                 │
│         ↓                                │
│ Updates progress notes                  │
│         ↓                                │
│ System calculates:                      │
│   Task 100% → Weekly Goal +20%          │
│   Weekly Goal 100% → Quarterly +10%     │
│   Quarterly 100% → Key Result +33%      │
│   Key Result 100% → Objective +20%      │
│         ↓                                │
│ Executive sees updated Objective %      │
└─────────────────────────────────────────┘

WEEK 11: ANALYTICS & COURSE CORRECTION
┌─────────────────────────────────────────┐
│ Executive opens Analytics Dashboard     │
│         ↓                                │
│ Sees: Objective "Increase Revenue"      │
│       Progress: 45% (at risk!)          │
│         ↓                                │
│ Drills down:                            │
│   → Engineering Team: 80% (on track)    │
│   → Sales Team: 30% (bottleneck!)       │
│         ↓                                │
│ Views Sales Team Assessment scores      │ [NEW]
│   → Weakness: "Speed" dimension         │
│         ↓                                │
│ Decision: Hire 2 more sales reps        │
│         ↓                                │
│ Adjusts Q2 targets based on new hire    │
└─────────────────────────────────────────┘
```

---

## 🧩 LEGO BLOCK ARCHITECTURE

### **Block 1: Assessment Engine**
```javascript
class AssessmentEngine {
  async runAssessment(template, respondents) {
    // Can be ANY assessment type
    return {
      type: template.assessment_type,
      dimensions: [...],
      insights: "..."
    }
  }
}
```

**Swap-ability**: Change SSI → Skills Matrix, just update `template.assessment_type`

---

### **Block 2: OKR Generator**
```javascript
class OKRGenerator {
  async generateFromAssessment(assessmentResults) {
    // Assessment-agnostic
    const dimensions = assessmentResults.dimensions;
    return {
      objectives: [
        {
          title: "...",
          key_results: [...],
          source_dimension: dimensions[0].name,
          source_insight: "Based on low Speed scores..."
        }
      ]
    }
  }
}
```

**Swap-ability**: Works with any dimensional assessment

---

### **Block 3-6: Execution Chain**
```javascript
// Objective
{
  _id, title, key_results: [...],
  source_assessment: "assessment_123",
  lineage: { assessment: "assessment_123" }
}

// Key Result
{
  _id, objective_id, target, current,
  lineage: { assessment: "...", objective: "..." }
}

// Quarterly Goal
{
  _id, key_result_id,
  lineage: { assessment: "...", objective: "...", key_result: "..." }
}

// Weekly Goal
{
  _id, quarterly_goal_id,
  lineage: { ...all above }
}

// Task
{
  _id, weekly_goal_id,
  lineage: { ...full chain to assessment }
}
```

**Swap-ability**: Lineage tracks back to ANY assessment type

---

## 📋 MISSING STORIES - TO ADD

### **HIGH PRIORITY (Add to MVP)**

1. **EXEC-011B**: Approve Manager Quarterly Plans [Week 9]
   - Approval workspace UI
   - Accept/reject per team
   - Comments thread

2. **MGR-025**: View Team Assessment Health [Week 6]
   - Team SSI dashboard
   - Compare to company average
   - Identify gaps

3. **MGR-026**: Intervention Workflow [Week 7]
   - Automated alerts
   - Quick actions (message, reassign)

4. **EMP-016**: View "Why Chain" Context [Week 7]
   - Breadcrumb: Task → Goal → Objective → OKR
   - Click any level for details

5. **CONS-007B**: View Team SSI Breakdown [Week 6]
   - Heatmap by team
   - Speed/Strength/Intelligence comparison

### **MEDIUM PRIORITY (Add to BETA)**

6. **CONS-009B**: Collaborative OKR Review [Week 10/BETA]
   - In-app review with Executive
   - Real-time comments

7. **MGR-027**: Generate Weekly Roll-up Report [Week 11]
   - Manager → Executive reporting
   - PDF export

8. **EMP-017**: See Business Impact Metric [Week 11]
   - "Your tasks = X% of Company OKR"

9. **EMP-018**: Recognition Notification [Week 10/BETA]
   - Manager sends "Great job!" badge

---

## 🎯 WEEK RESEQUENCING RECOMMENDATION

**Current Issue**: Progress updates (Week 7) before Goal creation (Week 8) is backwards!

**Recommended Sequence**:
```
Week 5: Teams + Objectives ✅ (correct)
Week 6: Profile ✅ (correct)
Week 7: Goal Management (SWAP with Week 8)
Week 8: Dashboard + Tasks (SWAP with Week 7)
Week 9: Planning ✅ (correct)
Week 10-12: ✅ (correct)
```

**Rationale**: Can't update task progress if tasks don't exist yet!

---

## 📁 ARTIFACTS IN THIS FOLDER

This folder (`01_MVP/User_Stories/`) will contain:

1. **USER_JOURNEYS_MASTER.md** (this file) - Overview
2. **EXECUTIVE_JOURNEY.md** - Detailed Executive flow
3. **CONSULTANT_JOURNEY.md** - Detailed Consultant flow
4. **MANAGER_JOURNEY.md** - Detailed Manager flow
5. **EMPLOYEE_JOURNEY.md** - Detailed Employee flow
6. **ADMIN_JOURNEY.md** - Detailed Admin flow
7. **MISSING_STORIES.md** - All 9 new stories detailed
8. **ARCHITECTURE_VALIDATION.md** - Does 6-engine model support this?
9. **WEEK_RESEQUENCE_PROPOSAL.md** - Swap Week 7 ↔ Week 8

---

## ✅ NEXT STEPS

1. **Review this master journey** - Does this match your vision?
2. **Approve missing stories** - Should all 9 be added to MVP?
3. **Approve week resequence** - Swap Week 7 ↔ Week 8?
4. **I'll create detailed artifacts** - One file per persona with full acceptance criteria

**Then**: Update MVP_USER_STORIES.md with all new stories + resequence weeks.

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Status**: ✅ Ready for Review
**Next**: Create detailed journey files per persona
