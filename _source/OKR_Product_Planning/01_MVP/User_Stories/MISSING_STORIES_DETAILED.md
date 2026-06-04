# 🆕 MISSING USER STORIES - Full Acceptance Criteria

**Version**: 1.0.0
**Created**: 2025-10-22
**Total New Stories**: 9 (5 MVP, 4 BETA)
**Purpose**: Fill gaps identified in user journey mapping

---

## 📋 STORY SUMMARY

| ID | Title | Persona | Week | Priority | Points | MVP/BETA |
|----|-------|---------|------|----------|--------|----------|
| EXEC-011B | Approve Manager Quarterly Plans | Executive | Week 9 | P0 | 5 | MVP |
| MGR-025 | View Team Assessment Health | Manager | Week 6 | P1 | 3 | MVP |
| MGR-026 | Intervention Workflow (Alerts) | Manager | Week 7→8 | P1 | 3 | MVP |
| EMP-016 | View "Why Chain" Context | Employee | Week 7→8 | P0 | 5 | MVP |
| CONS-007B | View Team SSI Breakdown | Consultant | Week 6 | P1 | 3 | MVP |
| CONS-009B | Collaborative OKR Review | Consultant | Week 10 | P2 | 5 | BETA |
| MGR-027 | Generate Weekly Roll-up Report | Manager | Week 11 | P2 | 3 | BETA |
| EMP-017 | See Business Impact Metric | Employee | Week 11 | P2 | 3 | BETA |
| EMP-018 | Recognition Notifications | Employee | Week 10 | P2 | 2 | BETA |

**Total Story Points**: 32 points (MVP: 19 pts, BETA: 13 pts)

---

## 🔴 MVP STORIES (High Priority)

### EXEC-011B: Approve Manager Quarterly Plans

**As an** Executive
**I want to** review and approve manager-created quarterly plans
**So that** I can ensure team plans align with company objectives before execution begins

**Week**: Week 9 Day 4
**Priority**: P0 (Critical)
**Story Points**: 5
**Dependencies**: MGR-021 (Manager creates quarterly plans)

**Acceptance Criteria**:
- [ ] After managers submit quarterly plans (MGR-021), Executive sees "Pending Approval" notification
- [ ] Executive navigates to "Planning Approval" workspace
- [ ] Workspace shows all team plans side-by-side:
  - Team name
  - Manager name
  - Quarterly goals list (3-5 goals per team)
  - Estimated capacity utilization (%)
  - Submission date
- [ ] Executive can click team to see detailed plan view:
  - Full quarterly goals breakdown
  - Weekly allocation
  - Resource requirements
  - Dependencies on other teams
- [ ] Executive can add comments to each team plan
- [ ] Executive can "Approve" or "Request Changes" per team
- [ ] If "Request Changes":
  - Comment field required (explain why)
  - Manager receives notification
  - Plan returns to MGR-021 for editing
- [ ] If "Approve":
  - Plan status changes to "Approved"
  - Manager receives confirmation notification
  - Goals become active and visible to team members
- [ ] Executive dashboard shows approval status:
  - X of Y teams approved
  - Z teams pending changes

**Screen Reference**: New screen `planning-approval.html` (to be designed)
**API**:
- GET `/api/planning/pending-approvals` (returns plans awaiting approval)
- POST `/api/planning/:planId/approve`
- POST `/api/planning/:planId/request-changes`

**Model Changes**:
```javascript
// QuarterlyPlan model (new)
{
  _id, business_id, team_id, manager_id,
  quarter: "Q1 2026",
  goals: [...],
  status: "draft" | "pending_approval" | "approved" | "changes_requested",
  submitted_at: Date,
  reviewed_by: ObjectId (Executive),
  reviewed_at: Date,
  comments: [{
    author_id, text, created_at
  }],
  approved: Boolean
}
```

**Implementation**: Week 9 Day 4 (6-8 hours)

---

### MGR-025: View Team Assessment Health

**As a** Manager
**I want to** view my team's assessment scores and compare to company average
**So that** I can identify capability gaps and plan training

**Week**: Week 6 Day 2
**Priority**: P1 (High)
**Story Points**: 3
**Dependencies**: Assessment system (Week 1-4 complete)

**Acceptance Criteria**:
- [ ] Manager navigates to Team Management → Selects team → Clicks "Assessment Health" tab
- [ ] Page displays team's aggregated SSI scores:
  - Speed: 7.2/10 (Company avg: 6.8) ↑ Green
  - Strength: 5.5/10 (Company avg: 7.0) ↓ Red
  - Intelligence: 8.1/10 (Company avg: 7.5) ↑ Green
- [ ] Visual representation:
  - Radar chart showing team vs company average
  - Color coding: Green (above avg), Yellow (at avg), Red (below avg)
- [ ] Breakdown by sub-dimensions:
  - Speed → Decision Making: 7.5, Execution: 6.9
  - Strength → Financial: 5.0, Resources: 6.0
  - Intelligence → Data Analytics: 8.5, Strategic Thinking: 7.7
- [ ] Shows assessment completion status:
  - "5 of 7 team members completed assessment"
  - List of members who haven't completed (with "Send Reminder" button)
- [ ] Historical trend (if multiple assessments):
  - Line chart showing score changes over time
  - "Speed improved +0.5 since last quarter"
- [ ] Recommended actions (AI-generated):
  - "Consider training for Financial Strength dimension"
  - "Leverage team's high Intelligence for strategic projects"
- [ ] Export to PDF button

**Screen Reference**: Enhancement to `05_team.html` (new tab)
**API**: GET `/api/teams/:teamId/assessment-health`

**Backend Calculation**:
```javascript
// Aggregate team member assessments
const teamScores = {
  speed: avg(team.members.map(m => m.assessment.speed)),
  strength: avg(team.members.map(m => m.assessment.strength)),
  intelligence: avg(team.members.map(m => m.assessment.intelligence))
};

// Compare to company average
const companyAvg = {
  speed: avg(allEmployees.map(e => e.assessment.speed)),
  // ...
};
```

**Implementation**: Week 6 Day 2 (4-5 hours)

---

### MGR-026: Intervention Workflow (Automated Alerts)

**As a** Manager
**I want to** receive automated alerts when team members are at risk
**So that** I can intervene early and prevent failures

**Week**: Week 8 Day 4 (after resequencing)
**Priority**: P1 (High)
**Story Points**: 3
**Dependencies**: Dashboard (Week 8), Task system (Week 8)

**Acceptance Criteria**:
- [ ] System monitors team member task status daily (cron job)
- [ ] Triggers alert if:
  - >50% of tasks overdue for 3+ days
  - No tasks marked complete in 7+ days
  - Quarterly goal progress <30% with <30 days remaining
- [ ] Manager receives notification:
  - In-app notification badge (red dot)
  - Email notification (if enabled in settings)
  - Dashboard "At Risk" widget shows count
- [ ] Manager clicks notification → Opens "Intervention Center"
- [ ] Intervention Center shows:
  - Employee name + photo
  - Alert reason: "5 of 8 tasks overdue (3+ days)"
  - Current workload: "8 active tasks, 2 goals"
  - Recent activity: Last task completed 5 days ago
  - Suggested actions (quick buttons):
    - "Message Employee" (opens chat)
    - "Reassign Tasks" (drag-drop to another member)
    - "Extend Deadlines" (bulk adjust +7 days)
    - "Schedule 1:1" (calendar integration)
    - "Dismiss Alert" (mark as handled)
- [ ] Manager can add private notes:
  - "Spoke to John - personal issue, extending deadlines by 1 week"
  - Notes visible only to manager and above
- [ ] Alert status tracked:
  - Open, In Progress, Resolved, Dismissed
- [ ] Dashboard widget shows:
  - "3 team members need attention"
  - Quick preview of top 3 alerts
  - "View All" button → Intervention Center

**Screen Reference**: New widget on `02_dashboard.html` + new `intervention-center.html` modal
**API**:
- GET `/api/manager/alerts` (returns at-risk team members)
- POST `/api/manager/alerts/:alertId/action` (reassign, extend, dismiss)
- POST `/api/manager/alerts/:alertId/notes`

**Backend (Cron Job)**:
```javascript
// Run daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  const allManagers = await User.find({ role: 'MANAGER' });

  for (const manager of allManagers) {
    const teamMembers = await getTeamMembers(manager);

    for (const member of teamMembers) {
      const alerts = [];

      // Check overdue tasks
      const overdueTasks = await Task.find({
        user_id: member._id,
        due_date: { $lt: new Date() },
        status: { $ne: 'completed' }
      });

      if (overdueTasks.length > 0) {
        alerts.push({
          type: 'overdue_tasks',
          severity: 'high',
          count: overdueTasks.length
        });
      }

      // Create alert in DB
      if (alerts.length > 0) {
        await Alert.create({
          manager_id: manager._id,
          employee_id: member._id,
          alerts,
          status: 'open'
        });
      }
    }
  }
});
```

**Implementation**: Week 8 Day 4 (5-6 hours)

---

### EMP-016: View "Why Chain" Context

**As an** Employee
**I want to** see how my task connects to company objectives
**So that** I understand the impact of my work and stay motivated

**Week**: Week 8 Day 3 (after resequencing)
**Priority**: P0 (Critical - core to assessment-driven model)
**Story Points**: 5
**Dependencies**: Full execution chain implemented (Week 8)

**Acceptance Criteria**:
- [ ] When viewing any task on Dashboard, employee sees "Why Chain" breadcrumb at top
- [ ] Breadcrumb format:
  ```
  📊 Company OKR > 🎯 Objective > 🔑 Key Result > 📅 Quarterly Goal > 📆 Weekly Goal > ✅ This Task
  ```
- [ ] Each level is clickable and shows:
  - **Task level** (current):
    - Title: "Fix payment gateway bug"
    - Description, due date, priority
    - Status: In Progress
  - **Weekly Goal** (click to expand):
    - Title: "Complete 5 bug fixes"
    - Progress: 3/5 (60%)
    - Due: End of week
  - **Quarterly Goal** (click to expand):
    - Title: "Improve system stability"
    - Progress: 45%
    - Due: Mar 31, 2026
    - Owner: Engineering Team
  - **Key Result** (click to expand):
    - Title: "Reduce system errors by 30%"
    - Current: 15% reduction
    - Target: 30% reduction
    - Owner: CTO
  - **Objective** (click to expand):
    - Title: "Increase product reliability"
    - Progress: 42%
    - Due: Dec 31, 2026
    - Owner: CEO
    - Source: "Based on Strength assessment - Financial Stability"
  - **Company OKR** (top level):
    - Title: "Scale to 10,000 customers"
    - Progress: 38%
    - This objective contributes: 20%
- [ ] Visual indicator shows contribution:
  - "Your task represents 0.4% of Quarterly Goal progress"
  - Progress bar animates when task marked complete
- [ ] Tooltip on "Source" shows assessment insight:
  - "Generated from Q4 2025 SSI Assessment"
  - "Addresses: Financial Strength gap (5.5/10)"
- [ ] Mobile responsive: Breadcrumb collapses to dropdown on small screens
- [ ] Empty state: If task not linked to goal yet:
  - "This task is not connected to a goal yet"
  - "Ask your manager to link it to a quarterly goal"

**Screen Reference**: Enhancement to `02_dashboard.html` (task detail view)
**Component**: Reusable `<why-chain>` component (can be used anywhere)

**API**: GET `/api/tasks/:taskId/lineage`

**Backend Response**:
```javascript
{
  task: { _id, title, ... },
  weekly_goal: { _id, title, progress, ... },
  quarterly_goal: { _id, title, progress, ... },
  key_result: { _id, title, progress, target, ... },
  objective: { _id, title, progress, owner, ... },
  assessment: { _id, type: "SSI", insight: "...", ... }
}
```

**Implementation**: Week 8 Day 3 (6-8 hours)

---

### CONS-007B: View Team SSI Breakdown (Heatmap)

**As a** Consultant
**I want to** see SSI scores visualized by team
**So that** I can identify which teams need targeted interventions

**Week**: Week 6 Day 3
**Priority**: P1 (High)
**Story Points**: 3
**Dependencies**: Assessment system, Team model (Week 5)

**Acceptance Criteria**:
- [ ] Consultant navigates to Assessment Hub → "Team Insights" tab
- [ ] Heatmap displays all teams in business:
  - Rows: Teams (Engineering, Sales, Marketing, ...)
  - Columns: SSI Dimensions (Speed, Strength, Intelligence)
  - Cells: Color-coded scores
    - Green: 8-10 (Excellent)
    - Yellow: 6-7.9 (Average)
    - Red: <6 (Needs improvement)
- [ ] Hover over cell shows:
  - Team name
  - Dimension name
  - Exact score: "Speed: 7.2/10"
  - Company average: "Company avg: 6.8"
  - Trend: "↑ +0.5 since last quarter"
- [ ] Click cell → Drills down to team detail:
  - Individual member scores within that dimension
  - Sub-dimension breakdown
  - Recommended actions
- [ ] Filter controls:
  - Department dropdown (filter teams)
  - Assessment period (Q1, Q2, Q3, Q4)
  - Show/hide inactive teams
- [ ] Sort options:
  - By team name (A-Z)
  - By lowest score (identify weakest teams first)
  - By highest variance (identify inconsistent teams)
- [ ] Export to Excel:
  - Full heatmap with all data
  - Includes formulas for calculations
- [ ] Comparison mode:
  - Toggle "Compare to Company Avg" (default ON)
  - Toggle "Compare to Industry Benchmark" (if data available)
- [ ] Summary stats at bottom:
  - "3 teams below average in Strength"
  - "All teams above average in Intelligence"
  - "Engineering team is most balanced"

**Screen Reference**: New tab in `assessment-hub.html`
**API**: GET `/api/assessments/team-heatmap`

**Backend Calculation**:
```javascript
const teams = await Team.find({ business_id });
const heatmap = [];

for (const team of teams) {
  const members = await User.find({ _id: { $in: team.members } });
  const assessments = await Assessment.find({
    user_id: { $in: members.map(m => m._id) }
  });

  const teamScores = {
    speed: avg(assessments.map(a => a.speed)),
    strength: avg(assessments.map(a => a.strength)),
    intelligence: avg(assessments.map(a => a.intelligence))
  };

  heatmap.push({
    team_name: team.name,
    scores: teamScores
  });
}
```

**Implementation**: Week 6 Day 3 (4-5 hours)

---

## 🟡 BETA STORIES (Medium Priority)

### CONS-009B: Collaborative OKR Review

**As a** Consultant
**I want to** review AI-generated OKRs collaboratively with Executive in real-time
**So that** we can iterate quickly and reach consensus

**Week**: Week 10 Day 5 / BETA
**Priority**: P2 (Nice to have)
**Story Points**: 5
**Dependencies**: AI OKR generation (Week 4)

**Acceptance Criteria**:
- [ ] After generating AI OKRs (CONS-006), Consultant sees "Invite Executive to Review" button
- [ ] Clicking button opens modal:
  - "Invite [Executive Name] to collaborative review session"
  - Optional message field
  - "Send Invitation" button
- [ ] Executive receives notification:
  - In-app notification
  - Email with direct link to review session
- [ ] Both Consultant and Executive enter shared review workspace:
  - Shows all 5 AI-generated OKRs side-by-side
  - Real-time presence indicator: "John (Executive) is viewing Objective 2"
- [ ] Features in review workspace:
  - **Inline comments**: Click any OKR → Add comment → Both see instantly
  - **Edit mode**: Either person can edit OKR text → Changes sync live
  - **Vote buttons**: 👍 Approve, 👎 Reject, 🤔 Needs Discussion
  - **Chat sidebar**: Text chat for quick questions
  - **Version history**: See all edits made during session
- [ ] Executive can:
  - Accept OKR as-is (green checkmark)
  - Request changes (yellow warning)
  - Reject OKR (red X)
- [ ] Consultant can:
  - Regenerate specific OKR (re-run AI)
  - Add custom OKR manually
  - Reorder OKRs by priority
- [ ] Session status:
  - "Waiting for Executive approval on 3 OKRs"
  - "Review complete - 5/5 approved"
- [ ] Session ends when:
  - All OKRs approved by Executive
  - Either person clicks "End Session"
  - 24 hours of inactivity
- [ ] Final state:
  - Approved OKRs moved to Objectives screen
  - Rejected OKRs archived with reason
  - Session transcript saved for audit

**Screen Reference**: New `okr-collaborative-review.html`
**Technology**: WebSocket for real-time sync
**API**:
- POST `/api/ai-okr/start-review-session`
- WebSocket `/ws/review-session/:sessionId`
- POST `/api/ai-okr/review-session/:sessionId/finalize`

**Implementation**: Week 10 Day 5 or BETA Phase 1 (8-10 hours)

---

### MGR-027: Generate Weekly Roll-up Report

**As a** Manager
**I want to** generate a weekly summary report of team progress
**So that** I can share updates with Executive efficiently

**Week**: Week 11 Day 3 / BETA
**Priority**: P2 (Nice to have)
**Story Points**: 3

**Acceptance Criteria**:
- [ ] Manager navigates to Team Dashboard → "Generate Report" button
- [ ] Modal opens with report configuration:
  - Report period: Select week (default: current week)
  - Include sections (checkboxes):
    - ✅ Team progress summary
    - ✅ Completed goals/tasks
    - ✅ At-risk items
    - ✅ Blockers and issues
    - ✅ Next week's priorities
    - ⬜ Individual member breakdown (optional)
  - Recipients: Select Executives (multi-select)
  - Delivery: Email, PDF download, or Share Link
- [ ] Report content:
  - **Header**: Team name, week, manager name
  - **Executive Summary**: 3-5 bullet points (auto-generated)
  - **Progress Overview**:
    - Objectives: 2/5 on track, 3/5 at risk
    - Goals: 8/12 completed this week
    - Tasks: 45/50 completed (90%)
  - **Completed This Week**:
    - List of completed goals with ✅
    - Key achievements
  - **At Risk**:
    - List of at-risk objectives with 🔴
    - Root causes (auto-detected or manager-entered)
  - **Blockers**:
    - Dependencies on other teams
    - Resource constraints
    - External dependencies
  - **Next Week**:
    - Planned goals (3-5)
    - Required support from Executive
  - **Individual Contributions** (if enabled):
    - Top performers this week
    - Members needing support
- [ ] Report generated as:
  - PDF (downloadable)
  - HTML (shareable link expires in 30 days)
  - Email (sent to selected recipients)
- [ ] Report saved in history:
  - Manager can access past reports
  - "View Week 42 Report" → Opens archived version
- [ ] Executive receives:
  - Email with PDF attachment
  - Or link to view online
  - Can reply with comments

**Screen Reference**: New modal on `02_dashboard.html`
**API**: POST `/api/reports/weekly-rollup/generate`

**Implementation**: Week 11 Day 3 or BETA Phase 1 (4-5 hours)

---

### EMP-017: See Business Impact Metric

**As an** Employee
**I want to** see how my completed tasks contribute to company OKRs
**So that** I understand my impact and feel motivated

**Week**: Week 11 Day 4 / BETA
**Priority**: P2 (Nice to have)
**Story Points**: 3
**Dependencies**: Full lineage tracking, Analytics calculation engine

**Acceptance Criteria**:
- [ ] Employee Dashboard shows "Your Impact" widget
- [ ] Widget displays:
  - "This week, your work contributed:"
  - "2.3% to Objective: Increase Revenue"
  - "1.8% to Objective: Improve Product Quality"
  - Visual: Progress bar showing contribution
- [ ] Calculation logic:
  - Employee completed 5 tasks this week
  - Each task → Weekly Goal (5 tasks = 100% of weekly goal)
  - Weekly Goal → Quarterly Goal (1 weekly = 8% of quarterly)
  - Quarterly Goal → Key Result (1 quarterly = 25% of KR)
  - Key Result → Objective (3 KRs = 33% of objective)
  - Formula: `(5 tasks / 5 total) * 8% * 25% * 33% = 2.3%`
- [ ] Hover over percentage shows breakdown:
  - "Your 5 tasks"
  - "→ Completed Weekly Goal: Close 5 Deals"
  - "→ Advanced Quarterly Goal: 50 Clients (+10%)"
  - "→ Progressed Key Result: $500K Revenue (+2.5%)"
  - "→ Progressed Objective: Increase Revenue (+2.3%)"
- [ ] Historical view:
  - "This Month: 8.7% total contribution"
  - "This Quarter: 24.3% total contribution"
  - Line chart showing weekly contributions
- [ ] Gamification (optional):
  - Badge unlocked: "High Impact Contributor" (>5% in one week)
  - Leaderboard (opt-in): Top contributors this month
- [ ] Share feature:
  - "Share your impact" → Generates shareable image
  - "I contributed 2.3% to company objectives this week!"
  - Shareable on internal chat or social

**Screen Reference**: New widget on `02_dashboard.html`
**API**: GET `/api/employee/business-impact`

**Backend Calculation Engine**:
```javascript
async function calculateImpact(employeeId, week) {
  const completedTasks = await Task.find({
    user_id: employeeId,
    status: 'completed',
    completed_at: { $gte: weekStart, $lte: weekEnd }
  });

  const impacts = [];

  for (const task of completedTasks) {
    // Traverse lineage
    const weeklyGoal = await Goal.findById(task.weekly_goal_id);
    const quarterlyGoal = await Goal.findById(weeklyGoal.quarterly_goal_id);
    const keyResult = await KeyResult.findById(quarterlyGoal.key_result_id);
    const objective = await Objective.findById(keyResult.objective_id);

    // Calculate contribution
    const taskWeight = 1 / weeklyGoal.total_tasks; // 1/5 = 20%
    const weeklyWeight = weeklyGoal.weight_in_quarterly; // 8%
    const quarterlyWeight = quarterlyGoal.weight_in_kr; // 25%
    const krWeight = keyResult.weight_in_objective; // 33%

    const impact = taskWeight * weeklyWeight * quarterlyWeight * krWeight * 100;

    impacts.push({
      objective_title: objective.title,
      impact_percentage: impact.toFixed(1)
    });
  }

  return impacts;
}
```

**Implementation**: Week 11 Day 4 or BETA Phase 1 (5-6 hours)

---

### EMP-018: Recognition Notifications

**As an** Employee
**I want to** receive recognition from my manager when I do great work
**So that** I feel appreciated and motivated

**Week**: Week 10 Day 5 / BETA
**Priority**: P2 (Nice to have)
**Story Points**: 2

**Acceptance Criteria**:
- [ ] Manager Dashboard has "Send Recognition" button next to each team member
- [ ] Clicking opens "Send Recognition" modal:
  - Employee name (pre-filled)
  - Recognition type (dropdown):
    - 🌟 Great Job!
    - 🚀 Above and Beyond
    - 🎯 Goal Achieved
    - 💡 Innovation
    - 🤝 Team Player
    - 🏆 MVP of the Week
  - Message field (optional): "Great work on fixing the payment bug!"
  - Visibility (radio):
    - Private (employee only)
    - Team (visible to team)
    - Company (visible to everyone)
  - Send button
- [ ] Employee receives notification:
  - In-app notification badge
  - Email notification (if enabled)
  - Push notification (if enabled)
- [ ] Notification content:
  - "🌟 [Manager Name] recognized your work!"
  - Message: "Great work on fixing the payment bug!"
  - Badge icon: Gold star
  - "View Recognition" button
- [ ] Clicking notification → Opens Recognition Center:
  - Shows all recognitions received
  - Grouped by month
  - Each recognition card shows:
    - Badge icon
    - Recognition type
    - From: Manager name
    - Message
    - Date
    - Visibility level
- [ ] Recognition appears on Employee Profile:
  - "Recognitions" section
  - Shows recent 5 recognitions
  - "View All" button → Recognition Center
- [ ] If public/team visibility:
  - Recognition posted to Team Feed
  - Other members can "Like" or comment
  - "Congrats!" reactions
- [ ] Manager can view sent recognitions:
  - "Recognition History" page
  - Filter by employee, type, date
  - Analytics: "You sent 12 recognitions this month"
- [ ] Executive Dashboard shows:
  - Company recognition stats
  - "Managers sent 45 recognitions this month"
  - "Top recognized employees this quarter"

**Screen Reference**:
- New modal on Manager Dashboard
- New `recognition-center.html` for employee
- Widget on Profile page

**API**:
- POST `/api/recognition/send`
- GET `/api/recognition/received` (employee)
- GET `/api/recognition/sent` (manager)

**Model**:
```javascript
{
  _id, business_id,
  from_user_id: ObjectId (Manager),
  to_user_id: ObjectId (Employee),
  type: "great_job" | "above_beyond" | "goal_achieved" | ...,
  message: String,
  visibility: "private" | "team" | "company",
  created_at: Date,
  reactions: [
    { user_id, type: "like" | "congrats", created_at }
  ],
  comments: [
    { user_id, text, created_at }
  ]
}
```

**Implementation**: Week 10 Day 5 or BETA Phase 1 (3-4 hours)

---

## 📊 IMPLEMENTATION SUMMARY

### MVP Stories (19 points)
- **Week 6**: MGR-025 (3 pts), CONS-007B (3 pts) = 6 pts
- **Week 8**: EMP-016 (5 pts), MGR-026 (3 pts) = 8 pts
- **Week 9**: EXEC-011B (5 pts) = 5 pts

### BETA Stories (13 points)
- **Week 10/BETA**: CONS-009B (5 pts), EMP-018 (2 pts) = 7 pts
- **Week 11/BETA**: MGR-027 (3 pts), EMP-017 (3 pts) = 6 pts

---

## 🔗 INTEGRATION POINTS

**These stories connect to existing stories**:

1. **EXEC-011B** requires **MGR-021** (Manager creates quarterly plans)
2. **MGR-025** uses data from **CONS-001-006** (Assessment system)
3. **MGR-026** monitors **EMP-010** (Complete tasks) and **MGR-020** (Update goals)
4. **EMP-016** uses lineage from **All execution stories** (Week 5-9)
5. **CONS-007B** aggregates **Team model** (Week 5) + **Assessments** (Week 1-4)
6. **CONS-009B** enhances **EXEC-002** (AI OKR generation)
7. **MGR-027** summarizes **MGR-012-014** (Dashboard monitoring)
8. **EMP-017** calculates from **EMP-008-013** (Task completion)
9. **EMP-018** triggered by **MGR-012** (Monitor team)

---

## ✅ ACCEPTANCE CHECKLIST

Before marking these stories complete:
- [ ] All acceptance criteria met
- [ ] API endpoints documented and tested
- [ ] Database schema changes deployed
- [ ] Frontend UI matches mockups/designs
- [ ] Role-based access control tested
- [ ] Mobile responsive
- [ ] Error handling tested
- [ ] Performance tested (<500ms API, <2s page load)
- [ ] Test cases written (QA folder)
- [ ] Code references documented

---

**Last Updated**: 2025-10-22
**Status**: ✅ Ready to add to MVP_USER_STORIES.md
**Next**: Create detailed persona journey files
