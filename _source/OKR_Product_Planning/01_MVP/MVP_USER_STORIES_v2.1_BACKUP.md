# 👥 KARVIA OKR - MVP USER STORIES

**Version**: 2.1
**Date**: October 1, 2025
**Status**: Implementation Ready
**Total Stories**: 72 stories across 5 personas

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [User Personas](#user-personas)
3. [Story Format](#story-format)
4. [Employee User Stories (15)](#employee-user-stories)
5. [Manager User Stories (18)](#manager-user-stories)
6. [Executive User Stories (15)](#executive-user-stories)
7. [Consultant User Stories (16)](#consultant-user-stories)
8. [Admin User Stories (8)](#admin-user-stories)
9. [User Journey Maps](#user-journey-maps)
10. [Acceptance Criteria Patterns](#acceptance-criteria-patterns)

---

## 🎯 OVERVIEW

This document contains all user stories for Karvia OKR MVP, organized by persona. Each story follows the format:

**As a** [persona]
**I want to** [action]
**So that** [business value]

Stories reference screens from [MVP_PRD.md](./MVP_PRD.md) and incorporate the unified design system from `/Karvia_OKR_Mockups/unified_design`.

---

## 👤 USER PERSONAS

### **1. Employee (Individual Contributor)**
- **Role**: Team member focused on personal goals and tasks
- **Access**: Dashboard, Objectives, Assessment, Team
- **Primary Goals**: Complete tasks, track progress, understand personal SSI scores
- **Key Pain Points**: Lack of clarity on priorities, disconnection from company goals

### **2. Manager (Team Leader)**
- **Role**: Manages team members, assigns work, tracks team performance
- **Access**: Dashboard, Objectives, Assessment, Team, Planning
- **Primary Goals**: Align team with company objectives, assess team capabilities, monitor progress
- **Key Pain Points**: Difficulty assessing team capabilities, lack of visibility into bottlenecks

### **3. Executive (Company Leadership)**
- **Role**: Sets strategic direction, owns company-wide OKRs
- **Access**: Dashboard, Objectives, Assessment, Team, Planning, Analytics
- **Primary Goals**: Strategic planning, organization-wide performance visibility, data-driven decisions
- **Key Pain Points**: Lack of actionable insights, difficulty identifying at-risk objectives

### **4. Consultant (External Strategic Advisor)**
- **Role**: Advises multiple companies, creates assessment templates, compares clients
- **Access**: All screens + multi-company switching
- **Primary Goals**: Compare clients, customize assessments, provide strategic guidance
- **Key Pain Points**: Difficult to compare companies, generic assessment templates

### **5. Admin (Super Admin / Company Admin)**
- **Role**: Platform configuration, user management, iBrain feature toggles
- **Access**: All screens + Admin panel
- **Primary Goals**: Configure platform, manage users, control feature access
- **Key Pain Points**: Complex configuration, lack of granular control

---

## 📝 STORY FORMAT

Each user story includes:

```markdown
### [ID] Story Title

**As a** [persona]
**I want to** [action]
**So that** [business value]

**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Screen Reference**: [Screen ID from PRD]
**Priority**: [High | Medium | Low]
**Story Points**: [1, 2, 3, 5, 8]
```

---

## 🙋 EMPLOYEE USER STORIES

### EMP-001: View Personal Dashboard

**As an** employee
**I want to** view my personalized dashboard
**So that** I can quickly see my assigned tasks, progress, and upcoming deadlines

**Acceptance Criteria**:
- [ ] Dashboard displays my name and role
- [ ] Shows 3 key metrics: tasks completed, current progress %, OKRs on track
- [ ] Lists my active tasks with due dates and progress rings
- [ ] Shows my current objectives with completion percentages
- [ ] Navigation bar highlights "Dashboard" as active
- [ ] Karvia gradient header with white background content area

**Screen Reference**: S1 (Employee Dashboard)
**Priority**: High
**Story Points**: 3

---

### EMP-002: Take Individual Assessment

**As an** employee
**I want to** take a personal SSI assessment
**So that** I can understand my individual speed, strength, and intelligence scores

**Acceptance Criteria**:
- [ ] I receive an assessment invitation notification
- [ ] I can access the assessment from Dashboard or Assessment tab
- [ ] Assessment displays 47 questions across 3 dimensions (Speed, Strength, Intelligence)
- [ ] I can rate each question on a scale of 1-10
- [ ] Progress bar shows completion percentage
- [ ] I can save draft and return later
- [ ] Upon completion, I see my individual SSI scores immediately
- [ ] I can view how my scores contribute to team SSI

**Screen Reference**: S2 (Assessment Questionnaire), S18 (Assessment Invitations)
**Priority**: High
**Story Points**: 5

---

### EMP-003: View Individual SSI Results

**As an** employee
**I want to** view my individual SSI assessment results
**So that** I can understand my personal strengths and areas for improvement

**Acceptance Criteria**:
- [ ] SSI results page shows 3 scores: Speed, Strength, Intelligence (out of 10)
- [ ] Each dimension displays a radar chart comparing my scores
- [ ] Weak areas (score <7) are highlighted in red with recommendations
- [ ] I can see question-level breakdown for each dimension
- [ ] I can view how my scores compare to team average (if team assessment complete)
- [ ] Results page includes personalized improvement suggestions
- [ ] I can download my SSI report as PDF

**Screen Reference**: S3 (Assessment Results)
**Priority**: High
**Story Points**: 5

---

### EMP-004: View Assigned Objectives

**As an** employee
**I want to** view objectives assigned to me
**So that** I understand what I need to accomplish and why it matters

**Acceptance Criteria**:
- [ ] Objectives page displays all OKRs assigned to me
- [ ] Each objective shows: name, description, progress %, status, due date
- [ ] Objectives are grouped by: Personal, Team, Company
- [ ] I can expand an objective to see key results and tasks
- [ ] Progress is visualized with progress rings (green: on track, yellow: at risk, red: off track)
- [ ] I can filter by status: All, In Progress, Completed, At Risk
- [ ] Navigation highlights "Objectives" as active

**Screen Reference**: S4 (Objectives List)
**Priority**: High
**Story Points**: 3

---

### EMP-005: View Objective Details

**As an** employee
**I want to** view detailed information about a specific objective
**So that** I can understand key results, tasks, and progress

**Acceptance Criteria**:
- [ ] Objective detail page shows full description and context
- [ ] Displays all key results with completion percentages
- [ ] Lists all tasks under each key result
- [ ] Shows task assignments, due dates, and status
- [ ] I can see comments and updates from my manager
- [ ] Breadcrumb navigation: Objectives > [Objective Name]
- [ ] Progress chart shows historical trend (last 4 weeks)

**Screen Reference**: S5 (Objective Detail)
**Priority**: High
**Story Points**: 5

---

### EMP-006: Update Task Progress

**As an** employee
**I want to** update progress on my tasks
**So that** my manager knows I'm making progress and objectives stay on track

**Acceptance Criteria**:
- [ ] I can update task completion percentage (0-100%)
- [ ] I can change task status: Not Started, In Progress, Completed, Blocked
- [ ] I can add a comment explaining progress or blockers
- [ ] Progress update immediately reflects in Dashboard and Objectives view
- [ ] Manager receives notification when task is marked complete or blocked
- [ ] I can upload files or screenshots as proof of work
- [ ] "Last updated" timestamp is displayed

**Screen Reference**: S6 (Task Detail)
**Priority**: High
**Story Points**: 5

---

### EMP-007: View Team Members

**As an** employee
**I want to** view my team members
**So that** I can see who I'm working with and their roles

**Acceptance Criteria**:
- [ ] Team page displays all members of my team
- [ ] Each member card shows: name, role, avatar, online status
- [ ] I can see each member's assigned objectives (high-level view)
- [ ] I can click on a member to see their profile (if permissions allow)
- [ ] Team page shows team SSI scores (if team assessment complete)
- [ ] Navigation highlights "Team" as active

**Screen Reference**: S10 (Team View)
**Priority**: Medium
**Story Points**: 3

---

### EMP-008: Receive Assessment Invitation

**As an** employee
**I want to** receive and respond to assessment invitations
**So that** I can participate in team and organizational assessments

**Acceptance Criteria**:
- [ ] I receive in-app notification when invited to an assessment
- [ ] Email notification is sent (if email service enabled)
- [ ] Invitation shows: assessment name, type (individual/team), due date
- [ ] I can accept and start the assessment immediately
- [ ] I can see pending invitations in Assessment tab
- [ ] Expired invitations are marked as "Expired"
- [ ] I receive reminder 3 days before due date

**Screen Reference**: S18 (Assessment Invitations)
**Priority**: High
**Story Points**: 3

---

### EMP-009: View Personal OKRs

**As an** employee
**I want to** view OKRs generated specifically for me
**So that** I can focus on objectives that target my individual weak areas

**Acceptance Criteria**:
- [ ] My personal OKRs are clearly labeled "Personal"
- [ ] Each OKR shows which SSI dimension it targets (Speed/Strength/Intelligence)
- [ ] I can see the specific weak questions this OKR addresses
- [ ] Personal OKRs are separate from Team and Company OKRs
- [ ] I can mark personal OKRs as "In Progress" or "Completed"
- [ ] Progress on personal OKRs is visible in my Dashboard

**Screen Reference**: S4 (Objectives List), S5 (Objective Detail)
**Priority**: High
**Story Points**: 3

---

### EMP-010: Add Task Comments

**As an** employee
**I want to** add comments to tasks
**So that** I can communicate progress, ask questions, or highlight blockers

**Acceptance Criteria**:
- [ ] Task detail page has a "Comments" section
- [ ] I can write and submit comments
- [ ] Comments display timestamp and my name
- [ ] Manager receives notification when I comment
- [ ] I can @mention team members or manager
- [ ] I can attach files to comments
- [ ] Comment history is preserved

**Screen Reference**: S6 (Task Detail)
**Priority**: Medium
**Story Points**: 3

---

### EMP-011: View Task Dependencies

**As an** employee
**I want to** see which tasks depend on my work
**So that** I understand the impact of delays and can prioritize accordingly

**Acceptance Criteria**:
- [ ] Task detail shows "Dependent Tasks" section
- [ ] Lists tasks that are blocked by this task
- [ ] Shows who owns each dependent task
- [ ] Highlights critical path tasks (tasks that will delay key results)
- [ ] Visual indicator if dependent tasks are at risk
- [ ] I can navigate to dependent tasks

**Screen Reference**: S6 (Task Detail)
**Priority**: Medium
**Story Points**: 3

---

### EMP-012: Filter My Tasks

**As an** employee
**I want to** filter and sort my tasks
**So that** I can focus on what's most urgent or important

**Acceptance Criteria**:
- [ ] I can filter tasks by: Status, Priority, Due Date, Objective
- [ ] I can sort by: Due Date, Priority, Progress, Alphabetical
- [ ] Active filters are clearly displayed with X to remove
- [ ] Filter selection persists across sessions
- [ ] "Clear All Filters" button resets to default view
- [ ] Filtered task count is displayed

**Screen Reference**: S1 (Employee Dashboard)
**Priority**: Medium
**Story Points**: 2

---

### EMP-013: View Company-Wide Objectives

**As an** employee
**I want to** view company-wide objectives
**So that** I understand the bigger picture and how my work contributes

**Acceptance Criteria**:
- [ ] I can toggle view: My Objectives | Team Objectives | Company Objectives
- [ ] Company objectives show high-level progress only (not detailed tasks)
- [ ] Each company objective shows which teams are contributing
- [ ] I can see if my team's work is linked to company objectives
- [ ] Company objectives are read-only (I cannot edit)
- [ ] Visual connection shows: My Task → Team Objective → Company Objective

**Screen Reference**: S4 (Objectives List)
**Priority**: Low
**Story Points**: 3

---

### EMP-014: Access Quick Actions

**As an** employee
**I want to** access quick actions from the dashboard
**So that** I can perform common tasks without navigating multiple pages

**Acceptance Criteria**:
- [ ] "Quick Actions" widget on Dashboard
- [ ] Actions available: Update Task, Take Assessment, View Team, View Objectives
- [ ] Each action has an icon and clear label
- [ ] Clicking action opens modal or navigates to correct page
- [ ] Quick actions adapt based on context (e.g., "Complete Pending Assessment" if assessment pending)

**Screen Reference**: S1 (Employee Dashboard)
**Priority**: Low
**Story Points**: 2

---

### EMP-015: View Notifications

**As an** employee
**I want to** view all notifications
**So that** I don't miss important updates about tasks, assessments, or objectives

**Acceptance Criteria**:
- [ ] Notification bell icon in header shows unread count
- [ ] Clicking bell opens notification dropdown
- [ ] Notifications include: Task assignments, Assessment invitations, Objective updates, Comments
- [ ] Each notification shows timestamp and action button
- [ ] I can mark notifications as read
- [ ] I can clear all notifications
- [ ] Unread notifications persist across sessions

**Screen Reference**: All screens (Header component)
**Priority**: Medium
**Story Points**: 3

---

## 👔 MANAGER USER STORIES

### MGR-001: View Manager Dashboard

**As a** manager
**I want to** view my management dashboard
**So that** I can monitor team performance, objectives, and identify issues

**Acceptance Criteria**:
- [ ] Dashboard shows team overview: total members, active objectives, task completion rate
- [ ] Displays team SSI scores (if team assessment complete)
- [ ] Lists at-risk objectives with reasons (tasks blocked, overdue, low progress)
- [ ] Shows team member workload distribution (tasks per person)
- [ ] Quick actions: Assign Task, Create Objective, Invite to Assessment
- [ ] Navigation includes: Dashboard, Objectives, Assessment, Team, Planning
- [ ] Karvia gradient header with role badge "Manager"

**Screen Reference**: S7 (Manager Dashboard)
**Priority**: High
**Story Points**: 5

---

### MGR-002: View Team SSI Scores

**As a** manager
**I want to** view my team's aggregated SSI scores
**So that** I can understand team capabilities and identify areas for development

**Acceptance Criteria**:
- [ ] Team SSI page shows aggregated scores: Speed, Strength, Intelligence
- [ ] Radar chart compares team scores to organizational average
- [ ] Member breakdown shows each employee's contribution to team SSI
- [ ] Highlights weak areas at team level (score <7)
- [ ] Shows completion status: X of Y members completed assessments
- [ ] I can drill down to individual member SSI scores
- [ ] Auto-calculates when ≥80% of team completes assessments

**Screen Reference**: S3 (Assessment Results - Team View)
**Priority**: High
**Story Points**: 5

---

### MGR-003: Invite Team to Assessment

**As a** manager
**I want to** invite my team members to take assessments
**So that** I can assess team capabilities and generate relevant team OKRs

**Acceptance Criteria**:
- [ ] Assessment invitation page allows me to select assessment type: Individual, Team, Role-Specific
- [ ] I can select team members to invite (multi-select)
- [ ] I can set due date for assessment completion
- [ ] I can add a custom message to invitation
- [ ] System sends email and in-app notification to invitees
- [ ] I can track completion status: Pending, Started, Completed
- [ ] I can send reminders to pending invitees

**Screen Reference**: S18 (Assessment Invitations)
**Priority**: High
**Story Points**: 5

---

### MGR-004: Assign Goals to Team Members

**As a** manager
**I want to** assign goals and tasks to team members
**So that** work is distributed and everyone knows their responsibilities

**Acceptance Criteria**:
- [ ] I can create a new goal under a team objective
- [ ] I can assign goal to one or more team members
- [ ] I can set due date, priority, and expected outcome
- [ ] I can break down goal into tasks
- [ ] Assigned member receives notification
- [ ] I can reassign goals if needed
- [ ] I can add notes or context to the assignment

**Screen Reference**: S8 (Goals Management), S9 (Task Assignment)
**Priority**: High
**Story Points**: 5

---

### MGR-005: Monitor Team Progress

**As a** manager
**I want to** monitor real-time progress on team objectives
**So that** I can identify blockers early and provide support

**Acceptance Criteria**:
- [ ] Team objectives view shows progress percentage for each objective
- [ ] Visual indicators: Green (on track), Yellow (at risk), Red (blocked/off track)
- [ ] I can see task-level progress for each objective
- [ ] I can filter by: All Objectives, At Risk, Blocked, On Track
- [ ] I receive alerts when objectives fall behind schedule
- [ ] I can see last update timestamp for each task
- [ ] I can drill down to see which tasks are causing delays

**Screen Reference**: S4 (Objectives List - Manager View)
**Priority**: High
**Story Points**: 5

---

### MGR-006: Create Team Objectives

**As a** manager
**I want to** create team-level objectives
**So that** my team is aligned with company goals and works toward common targets

**Acceptance Criteria**:
- [ ] I can access "Create Objective" from Dashboard or Objectives page
- [ ] Form includes: Objective name, description, key results, due date
- [ ] I can specify which team SSI weak areas this objective targets
- [ ] I can link objective to company-wide objectives
- [ ] I can use AI suggestions based on team SSI scores
- [ ] I can save as draft or publish immediately
- [ ] Team members are notified when objective is published

**Screen Reference**: S11 (Objective Creation)
**Priority**: High
**Story Points**: 5

---

### MGR-007: View Team Member Workload

**As a** manager
**I want to** view each team member's workload
**So that** I can balance work distribution and avoid burnout

**Acceptance Criteria**:
- [ ] Team view shows each member with task count and total estimated hours
- [ ] Color coding: Green (<40hrs/week), Yellow (40-50hrs), Red (>50hrs)
- [ ] I can see detailed breakdown of each member's tasks
- [ ] I can filter by: This Week, This Month, This Quarter
- [ ] I can reassign tasks from overloaded members
- [ ] Chart shows workload distribution across team
- [ ] I can export workload report

**Screen Reference**: S10 (Team View - Manager)
**Priority**: High
**Story Points**: 5

---

### MGR-008: Request AI Task Suggestions

**As a** manager
**I want to** get AI-generated task suggestions for objectives
**So that** I can quickly create actionable task lists without manual planning

**Acceptance Criteria**:
- [ ] When creating objective, I can click "Get AI Suggestions"
- [ ] AI generates 5-10 tasks based on objective and team SSI weak areas
- [ ] Each suggested task includes: name, description, estimated effort
- [ ] I can accept all, select specific tasks, or reject all
- [ ] I can edit AI-generated tasks before assigning
- [ ] If OpenAI disabled, I see template-based suggestions
- [ ] AI suggestions appear within 3 seconds

**Screen Reference**: S11 (Objective Creation)
**Priority**: Medium
**Story Points**: 5

---

### MGR-009: Track Assessment Completion

**As a** manager
**I want to** track assessment completion status for my team
**So that** I can follow up with members who haven't completed assessments

**Acceptance Criteria**:
- [ ] Assessment invitations page shows completion summary: X of Y completed
- [ ] List view shows each team member with status: Pending, Started, Completed, Expired
- [ ] I can filter by status
- [ ] I can send reminder to specific members
- [ ] I can extend due date for pending invitees
- [ ] I see when team SSI auto-calculation threshold is reached (80%)
- [ ] I can download completion report

**Screen Reference**: S18 (Assessment Invitations)
**Priority**: High
**Story Points**: 3

---

### MGR-010: View Individual Member SSI

**As a** manager
**I want to** view individual SSI scores for my team members
**So that** I can understand each person's strengths and provide targeted support

**Acceptance Criteria**:
- [ ] From Team view, I can click on a member to see their SSI scores
- [ ] Individual SSI shows: Speed, Strength, Intelligence with radar chart
- [ ] I can see which questions they scored low on (<7)
- [ ] I can compare member's scores to team average
- [ ] I can view their personal OKRs targeting weak areas
- [ ] I can add private notes about development areas (visible only to me and exec)
- [ ] Member receives notification that I viewed their SSI (transparency)

**Screen Reference**: S3 (Assessment Results - Individual View)
**Priority**: Medium
**Story Points**: 3

---

### MGR-011: Generate Team OKRs from SSI

**As a** manager
**I want to** generate team OKRs based on team SSI weak areas
**So that** objectives address actual team capability gaps

**Acceptance Criteria**:
- [ ] After team SSI is calculated, I can click "Generate Team OKRs"
- [ ] AI suggests 3-5 OKRs targeting team weak areas (Speed <7, Strength <7, Intelligence <7)
- [ ] Each OKR shows which SSI dimension and specific questions it addresses
- [ ] I can customize AI-generated OKRs before publishing
- [ ] I can use templates if OpenAI is disabled
- [ ] Generated OKRs include key results and suggested tasks
- [ ] I can assign generated OKRs to team members

**Screen Reference**: S11 (Objective Creation), S3 (Assessment Results)
**Priority**: High
**Story Points**: 5

---

### MGR-012: Comment on Team Member Tasks

**As a** manager
**I want to** comment on team member tasks
**So that** I can provide guidance, feedback, or clarify requirements

**Acceptance Criteria**:
- [ ] I can view all tasks assigned to my team
- [ ] I can add comments to any team member's task
- [ ] Team member receives notification when I comment
- [ ] I can @mention other team members in comments
- [ ] I can attach files (docs, screenshots) to comments
- [ ] Comment thread is visible to task owner and other managers
- [ ] I can mark comments as "Action Required"

**Screen Reference**: S6 (Task Detail)
**Priority**: Medium
**Story Points**: 3

---

### MGR-013: Approve or Reject Task Completion

**As a** manager
**I want to** review and approve completed tasks
**So that** I can ensure quality and accuracy before marking objectives complete

**Acceptance Criteria**:
- [ ] When team member marks task "Completed", I receive notification
- [ ] Task shows "Pending Approval" status
- [ ] I can review task details, comments, and uploaded proof of work
- [ ] I can Approve (task → Completed) or Reject (task → In Progress with comment)
- [ ] If rejected, team member receives notification with reason
- [ ] Objective progress only updates when tasks are approved
- [ ] I can enable/disable approval workflow per objective

**Screen Reference**: S6 (Task Detail)
**Priority**: Medium
**Story Points**: 5

---

### MGR-014: View Team Analytics (Planning Tab)

**As a** manager
**I want to** view team performance analytics
**So that** I can identify trends and make data-driven decisions

**Acceptance Criteria**:
- [ ] Planning tab shows team analytics dashboard
- [ ] Metrics: Task completion rate, average task duration, objectives on track %
- [ ] Charts: Velocity trend (last 4 weeks), task completion by member, objective progress
- [ ] I can filter by date range: Last Week, Last Month, Last Quarter
- [ ] I can compare current period to previous period
- [ ] I can export analytics as PDF or CSV
- [ ] Insights section highlights: top performers, at-risk objectives, bottlenecks

**Screen Reference**: S12 (Planning Dashboard)
**Priority**: Medium
**Story Points**: 5

---

### MGR-015: Reassign Tasks

**As a** manager
**I want to** reassign tasks between team members
**So that** I can balance workload or handle team member absences

**Acceptance Criteria**:
- [ ] From task detail, I can click "Reassign"
- [ ] I can select new assignee from my team
- [ ] I can add a note explaining the reassignment
- [ ] Both old and new assignee receive notifications
- [ ] Task history shows reassignment with timestamp
- [ ] Reassigned tasks are highlighted in new assignee's dashboard
- [ ] Objective progress is not affected by reassignment

**Screen Reference**: S6 (Task Detail), S9 (Task Assignment)
**Priority**: Medium
**Story Points**: 3

---

### MGR-016: Set Task Priorities

**As a** manager
**I want to** set priorities for tasks
**So that** team members know what to focus on first

**Acceptance Criteria**:
- [ ] I can set task priority: High, Medium, Low
- [ ] High priority tasks show red flag icon
- [ ] Team member's dashboard sorts tasks by priority
- [ ] I can bulk update priorities for multiple tasks
- [ ] Priority changes notify task owners
- [ ] I can filter team tasks by priority
- [ ] Critical path tasks are automatically marked High priority

**Screen Reference**: S6 (Task Detail), S9 (Task Assignment)
**Priority**: Medium
**Story Points**: 2

---

### MGR-017: Clone Objectives Across Quarters

**As a** manager
**I want to** clone objectives from previous quarters
**So that** I can quickly recreate similar objectives without starting from scratch

**Acceptance Criteria**:
- [ ] From objectives list, I can select objective and click "Clone"
- [ ] Cloned objective copies: name, description, key results, tasks
- [ ] I can edit cloned objective before publishing
- [ ] Due dates are adjusted to current quarter
- [ ] Task assignments are cleared (I must reassign)
- [ ] Original objective is not modified
- [ ] Cloned objective is marked as "Draft"

**Screen Reference**: S4 (Objectives List), S11 (Objective Creation)
**Priority**: Low
**Story Points**: 3

---

### MGR-018: Export Team Report

**As a** manager
**I want to** export team performance report
**So that** I can share progress with executives or external stakeholders

**Acceptance Criteria**:
- [ ] From Planning tab, I can click "Export Report"
- [ ] Report includes: team SSI scores, objective progress, task completion, member contributions
- [ ] I can choose format: PDF, CSV, Excel
- [ ] I can choose date range: This Week, This Month, This Quarter, Custom
- [ ] Report includes charts and visualizations
- [ ] Exported report is branded with Karvia logo
- [ ] Report is emailed to me (if email service enabled)

**Screen Reference**: S12 (Planning Dashboard)
**Priority**: Low
**Story Points**: 3

---

## 🎖️ EXECUTIVE USER STORIES

### EXEC-001: View Executive Dashboard

**As an** executive
**I want to** view the executive dashboard
**So that** I can monitor company-wide performance and strategic progress

**Acceptance Criteria**:
- [ ] Dashboard shows organizational overview: total objectives, completion rate, at-risk count
- [ ] Displays organizational SSI scores (if org assessment complete)
- [ ] Lists critical company objectives with progress
- [ ] Shows cross-team dependencies and blockers
- [ ] Quick access to: Analytics, Company OKRs, Org Assessment
- [ ] Navigation includes: Dashboard, Objectives, Assessment, Team, Planning, Analytics
- [ ] Karvia gradient header with role badge "Executive"

**Screen Reference**: S13 (Executive Dashboard)
**Priority**: High
**Story Points**: 5

---

### EXEC-002: View Organizational SSI

**As an** executive
**I want to** view organizational SSI scores
**So that** I can understand company-wide capabilities and make strategic decisions

**Acceptance Criteria**:
- [ ] Org SSI page shows aggregated scores: Speed, Strength, Intelligence
- [ ] Displays weighted breakdown: 40% Individual + 30% Team + 20% Role + 10% Org
- [ ] Radar chart shows org SSI vs. industry benchmarks (if available)
- [ ] I can drill down: Org SSI → Team SSI → Individual SSI
- [ ] Highlights organizational weak areas (score <7)
- [ ] Shows completion status: X teams completed, Y individuals completed
- [ ] Auto-calculates when ≥70% of organization completes assessments

**Screen Reference**: S3 (Assessment Results - Org View)
**Priority**: High
**Story Points**: 5

---

### EXEC-003: Create Company-Wide Objectives

**As an** executive
**I want to** create company-wide objectives
**So that** the entire organization is aligned toward strategic goals

**Acceptance Criteria**:
- [ ] I can create objectives marked as "Company-Wide"
- [ ] I can specify which organizational SSI weak areas this objective targets
- [ ] I can assign objectives to specific teams or departments
- [ ] AI suggests OKRs based on organizational SSI weak areas
- [ ] I can link objectives to strategic initiatives
- [ ] All teams see company-wide objectives in their objectives view
- [ ] I can set visibility: All Employees, Managers Only, Executives Only

**Screen Reference**: S11 (Objective Creation)
**Priority**: High
**Story Points**: 5

---

### EXEC-004: Monitor Cross-Team Dependencies

**As an** executive
**I want to** monitor dependencies between teams
**So that** I can identify bottlenecks that impact multiple teams

**Acceptance Criteria**:
- [ ] Analytics tab shows dependency map (visual graph)
- [ ] Highlights blocked dependencies in red
- [ ] I can click on a dependency to see details
- [ ] Shows critical path for company objectives
- [ ] Alerts when dependencies are at risk
- [ ] I can filter by team or objective
- [ ] I can export dependency report

**Screen Reference**: S14 (Analytics Dashboard)
**Priority**: High
**Story Points**: 5

---

### EXEC-005: View Company-Wide Analytics

**As an** executive
**I want to** view company-wide performance analytics
**So that** I can track progress toward strategic goals and identify areas for improvement

**Acceptance Criteria**:
- [ ] Analytics dashboard shows key metrics: OKR completion rate, team velocity, at-risk objectives
- [ ] Charts: Progress trend (last 12 weeks), objectives by team, task completion by department
- [ ] I can filter by: Team, Department, Time Period, Objective Type
- [ ] Comparison view: This Quarter vs. Last Quarter
- [ ] Predictive insights: projected completion dates, at-risk objectives
- [ ] I can create custom views and save them
- [ ] I can schedule weekly analytics report emails

**Screen Reference**: S14 (Analytics Dashboard)
**Priority**: High
**Story Points**: 8

---

### EXEC-006: Invite All Employees to Org Assessment

**As an** executive
**I want to** invite all employees to take organizational assessments
**So that** I can get a complete picture of organizational capabilities

**Acceptance Criteria**:
- [ ] I can create an assessment invitation for "All Employees"
- [ ] I can select assessment type: Organizational, Individual, Both
- [ ] I can set due date and send reminder schedule
- [ ] I can add custom message explaining importance
- [ ] Dashboard shows real-time completion progress
- [ ] I can see completion breakdown by team and department
- [ ] Automated reminders are sent to pending invitees

**Screen Reference**: S18 (Assessment Invitations)
**Priority**: High
**Story Points**: 5

---

### EXEC-007: Compare Teams by SSI

**As an** executive
**I want to** compare teams by their SSI scores
**So that** I can identify high-performing teams and teams that need support

**Acceptance Criteria**:
- [ ] Team comparison view shows all teams side-by-side
- [ ] Each team displays Speed, Strength, Intelligence scores
- [ ] I can sort teams by: Highest Speed, Lowest Strength, etc.
- [ ] Radar chart overlay compares all teams visually
- [ ] I can filter by department or business unit
- [ ] I can drill down to see team member breakdown
- [ ] I can export comparison as PDF

**Screen Reference**: S3 (Assessment Results - Comparison View)
**Priority**: Medium
**Story Points**: 5

---

### EXEC-008: Generate Org OKRs from SSI

**As an** executive
**I want to** generate company OKRs based on organizational SSI weak areas
**So that** strategic objectives address actual organizational capability gaps

**Acceptance Criteria**:
- [ ] After org SSI is calculated, I can click "Generate Company OKRs"
- [ ] AI suggests 3-5 strategic OKRs targeting org weak areas
- [ ] Each OKR shows which SSI dimension and level it addresses (Individual/Team/Org)
- [ ] I can customize AI-generated OKRs before publishing
- [ ] I can cascade OKRs to specific teams
- [ ] Generated OKRs include key results and target owners
- [ ] I can use templates if OpenAI is disabled

**Screen Reference**: S11 (Objective Creation), S3 (Assessment Results)
**Priority**: High
**Story Points**: 5

---

### EXEC-009: View At-Risk Objectives

**As an** executive
**I want to** view all at-risk objectives across the organization
**So that** I can intervene early and prevent failures

**Acceptance Criteria**:
- [ ] Dashboard shows "At-Risk Objectives" widget
- [ ] At-risk defined as: <50% progress with <25% time remaining, or marked blocked
- [ ] Each at-risk objective shows: team, reason, days until due
- [ ] I can click to see details and blockers
- [ ] I can assign executive sponsor to at-risk objectives
- [ ] I can filter by: Team, Severity (High/Medium/Low)
- [ ] I receive weekly email summary of at-risk objectives

**Screen Reference**: S13 (Executive Dashboard)
**Priority**: High
**Story Points**: 5

---

### EXEC-010: Configure iBrain Features

**As an** executive
**I want to** enable or disable iBrain features
**So that** I can control which premium features the company uses

**Acceptance Criteria**:
- [ ] Admin panel shows 6 iBrain feature toggles
- [ ] Features: Predictive Analytics, Sentiment Analysis, AI Coaching, Workflow Automation, Custom ML, Advanced Dashboards
- [ ] Each toggle shows feature description and benefits
- [ ] Toggling feature updates Business model immediately
- [ ] Disabled features are hidden from all users
- [ ] API returns 403 for disabled feature endpoints
- [ ] I can enable/disable features independently
- [ ] Changes are logged in audit trail

**Screen Reference**: S15 (Admin Panel - iBrain Settings)
**Priority**: High
**Story Points**: 5

---

### EXEC-011: View All Users

**As an** executive
**I want to** view all users in the organization
**So that** I can see who has access and manage roles

**Acceptance Criteria**:
- [ ] Admin panel shows all users with: name, email, role, team, status
- [ ] I can filter by: Role, Team, Status (Active/Inactive)
- [ ] I can search by name or email
- [ ] I can edit user roles: Employee → Manager → Executive
- [ ] I can deactivate or reactivate users
- [ ] I can bulk update roles
- [ ] I can export user list as CSV

**Screen Reference**: S15 (Admin Panel - User Management)
**Priority**: Medium
**Story Points**: 5

---

### EXEC-012: Invite Consultant

**As an** executive
**I want to** invite a consultant to access our company data
**So that** they can provide strategic guidance and assess our organization

**Acceptance Criteria**:
- [ ] Admin panel has "Invite Consultant" button
- [ ] I can enter consultant email and name
- [ ] System sends invitation email with onboarding link
- [ ] Consultant account is created with role "Consultant"
- [ ] Consultant can view all company data (objectives, SSI, teams)
- [ ] Consultant can create assessment templates
- [ ] I can revoke consultant access at any time

**Screen Reference**: S15 (Admin Panel - User Management)
**Priority**: Medium
**Story Points**: 3

---

### EXEC-013: Set Strategic Preferences

**As an** executive
**I want to** set company strategic preferences
**So that** AI-generated OKRs align with our strategic direction

**Acceptance Criteria**:
- [ ] Business settings page shows "Strategic Preferences" section
- [ ] I can select from 24 strategic preferences (6 categories × 4 options)
- [ ] Categories: Growth, Efficiency, Innovation, Culture, Market, Operations
- [ ] Selected preferences influence AI OKR generation prompts
- [ ] I can update preferences quarterly
- [ ] Changes are logged with timestamp
- [ ] I can see how preferences are used in OKR generation

**Screen Reference**: S15 (Admin Panel - Business Settings)
**Priority**: Medium
**Story Points**: 3

---

### EXEC-014: View Historical Trends

**As an** executive
**I want to** view historical performance trends
**So that** I can track long-term progress and identify patterns

**Acceptance Criteria**:
- [ ] Analytics tab shows historical trends over 12 months
- [ ] Charts: OKR completion rate trend, team velocity trend, SSI score trend
- [ ] I can compare quarters or years
- [ ] I can see milestone markers (e.g., new hires, product launches)
- [ ] I can overlay external events (market changes, competitor moves)
- [ ] I can export historical data as CSV
- [ ] Insights section highlights: improving trends, declining trends, anomalies

**Screen Reference**: S14 (Analytics Dashboard)
**Priority**: Low
**Story Points**: 5

---

### EXEC-015: Download Company Report

**As an** executive
**I want to** download comprehensive company performance report
**So that** I can share with board members or external stakeholders

**Acceptance Criteria**:
- [ ] Admin panel has "Download Company Report" button
- [ ] Report includes: Org SSI scores, OKR completion, team performance, top achievers
- [ ] I can choose date range: This Quarter, This Year, Custom
- [ ] Report format: Professional PDF with charts and visualizations
- [ ] Report is branded with company logo
- [ ] I can customize report sections (include/exclude)
- [ ] Report is emailed to me (if email service enabled)

**Screen Reference**: S15 (Admin Panel)
**Priority**: Low
**Story Points**: 5

---

## 🧑‍💼 CONSULTANT USER STORIES

### CONS-001: Switch Between Client Companies

**As a** consultant
**I want to** switch between client companies
**So that** I can manage multiple clients from one account

**Acceptance Criteria**:
- [ ] Header shows company dropdown with list of all my clients
- [ ] I can click dropdown to see all companies I have access to
- [ ] Selecting a company switches context immediately
- [ ] All data (dashboard, objectives, assessments) updates to selected company
- [ ] Current company name is always visible in header
- [ ] I can star favorite companies for quick access
- [ ] Last viewed company is remembered across sessions

**Screen Reference**: All screens (Header component)
**Priority**: High
**Story Points**: 5

---

### CONS-002: Compare Clients Side-by-Side

**As a** consultant
**I want to** compare all client companies side-by-side
**So that** I can identify patterns, benchmarks, and best practices

**Acceptance Criteria**:
- [ ] Comparison dashboard shows all clients in table view
- [ ] Each client displays: Org SSI (Speed/Strength/Intelligence), OKR completion %, team count
- [ ] I can sort by any column
- [ ] Radar chart overlay compares all clients visually
- [ ] I can filter by: Industry, Company Size, Assessment Completion
- [ ] I can export comparison as PDF or CSV
- [ ] I can click on a client to drill down to full details

**Screen Reference**: S17 (Consultant Assessment Comparison)
**Priority**: High
**Story Points**: 8

---

### CONS-003: Create Assessment Template

**As a** consultant
**I want to** create custom assessment templates
**So that** I can tailor assessments to different industries or client needs

**Acceptance Criteria**:
- [ ] Template editor allows me to create new template from scratch
- [ ] I can name template and add description
- [ ] I can configure 47 questions with custom weights per dimension
- [ ] I can set assessment type: Individual, Team, Role-Specific, Manager, Organizational
- [ ] I can define target audience: Roles, Teams, Job Functions
- [ ] I can save template and reuse across multiple clients
- [ ] I can clone existing templates and modify

**Screen Reference**: S16 (Assessment Template Editor)
**Priority**: High
**Story Points**: 8

---

### CONS-004: View All Client Assessments

**As a** consultant
**I want to** view all assessments across all clients
**So that** I can track assessment completion and identify trends

**Acceptance Criteria**:
- [ ] Assessment overview shows all clients with completion status
- [ ] I can filter by: Client, Assessment Type, Completion Status, Date Range
- [ ] Each client shows: Total invited, Completed, Pending, Completion %
- [ ] I can see which clients have complete org SSI scores
- [ ] I can drill down to individual client assessment details
- [ ] I can send bulk reminders to all pending assessments
- [ ] Dashboard shows "Assessments Needing Attention"

**Screen Reference**: S18 (Assessment Invitations - Consultant View)
**Priority**: High
**Story Points**: 5

---

### CONS-005: Customize Assessment Weights

**As a** consultant
**I want to** customize question weights in assessment templates
**So that** I can emphasize different factors for different clients

**Acceptance Criteria**:
- [ ] Template editor shows all 47 questions with weight sliders
- [ ] I can adjust weight per question: 0.5x, 1x, 1.5x, 2x
- [ ] I can adjust dimension weights: Speed %, Strength %, Intelligence %
- [ ] Total weights must sum to 100%
- [ ] Preview shows how weight changes affect sample scores
- [ ] I can reset to default weights
- [ ] I can save custom weight profiles for reuse

**Screen Reference**: S16 (Assessment Template Editor)
**Priority**: High
**Story Points**: 5

---

### CONS-006: Invite Client to Assessment

**As a** consultant
**I want to** invite client employees to assessments
**So that** I can collect data needed for strategic recommendations

**Acceptance Criteria**:
- [ ] I can create assessment invitation for any client
- [ ] I can select target audience: All Employees, Specific Teams, Specific Roles
- [ ] I can choose from my custom templates or default templates
- [ ] I can set due date and reminder schedule
- [ ] I can add custom message to invitation
- [ ] Client admin receives notification about invitation
- [ ] I can track completion in real-time

**Screen Reference**: S18 (Assessment Invitations)
**Priority**: High
**Story Points**: 5

---

### CONS-007: View Client OKRs

**As a** consultant
**I want to** view all OKRs for a client
**So that** I can assess strategic alignment and progress

**Acceptance Criteria**:
- [ ] I can view all company, team, and individual OKRs for selected client
- [ ] I can filter by: Objective Type, Team, Status, Due Date
- [ ] I can see which OKRs target SSI weak areas
- [ ] I can add private consultant notes to objectives (visible only to me)
- [ ] I can flag objectives as "Needs Review"
- [ ] I can export client OKRs as PDF
- [ ] I cannot edit client OKRs (read-only)

**Screen Reference**: S4 (Objectives List - Consultant View)
**Priority**: High
**Story Points**: 5

---

### CONS-008: Generate Client Recommendations

**As a** consultant
**I want to** generate strategic recommendations based on client SSI
**So that** I can provide data-driven advice

**Acceptance Criteria**:
- [ ] After client completes assessments, I can click "Generate Recommendations"
- [ ] AI generates recommendations based on: Org SSI weak areas, Industry benchmarks, Best practices
- [ ] Recommendations are categorized: Quick Wins, Strategic Initiatives, Long-Term Improvements
- [ ] Each recommendation includes: rationale, expected impact, implementation steps
- [ ] I can edit recommendations before sharing with client
- [ ] I can save recommendations as PDF report
- [ ] I can share recommendations with client admin

**Screen Reference**: S17 (Consultant Assessment Comparison)
**Priority**: Medium
**Story Points**: 8

---

### CONS-009: View Client Team Structure

**As a** consultant
**I want to** view client team structure and member roles
**So that** I can understand organizational design and identify gaps

**Acceptance Criteria**:
- [ ] Team view shows organizational chart for selected client
- [ ] Each team displays: Team name, Manager, Member count, Team SSI
- [ ] I can expand teams to see all members
- [ ] I can see reporting structure (who reports to whom)
- [ ] I can identify teams without managers or overloaded managers
- [ ] I can add consultant notes about team structure
- [ ] I can export org chart as image or PDF

**Screen Reference**: S10 (Team View - Consultant)
**Priority**: Medium
**Story Points**: 5

---

### CONS-010: Benchmark Client Against Industry

**As a** consultant
**I want to** benchmark client SSI scores against industry averages
**So that** I can show client how they compare to competitors

**Acceptance Criteria**:
- [ ] Comparison view shows client SSI vs. industry benchmark
- [ ] Industry benchmarks are calculated from all clients in same industry
- [ ] Radar chart overlays client scores with industry average
- [ ] Shows percentile rank: "Your company is in the top 25% for Speed"
- [ ] I can filter benchmarks by: Industry, Company Size, Region
- [ ] I can see which specific questions client scores above/below average
- [ ] I can export benchmark report as PDF

**Screen Reference**: S17 (Consultant Assessment Comparison)
**Priority**: Medium
**Story Points**: 5

---

### CONS-011: Clone Template Across Clients

**As a** consultant
**I want to** clone assessment templates across clients
**So that** I can reuse successful templates without recreating them

**Acceptance Criteria**:
- [ ] From template library, I can select template and click "Clone to Client"
- [ ] I can choose which client(s) to clone template to
- [ ] Template is copied with all questions, weights, and settings
- [ ] I can customize cloned template per client if needed
- [ ] Template name is updated: "[Original Name] - [Client Name]"
- [ ] Template is immediately available in target client's templates
- [ ] Original template is not modified

**Screen Reference**: S16 (Assessment Template Editor)
**Priority**: Medium
**Story Points**: 3

---

### CONS-012: Track Client Engagement

**As a** consultant
**I want to** track client engagement metrics
**So that** I can identify clients that need more support

**Acceptance Criteria**:
- [ ] Engagement dashboard shows all clients with metrics
- [ ] Metrics: Last login, Assessment completion rate, OKR update frequency, Active users
- [ ] Color coding: Green (highly engaged), Yellow (moderate), Red (low engagement)
- [ ] I can filter by engagement level
- [ ] I can see trend: engagement increasing or decreasing
- [ ] I can set engagement alerts for specific clients
- [ ] I can export engagement report

**Screen Reference**: S17 (Consultant Assessment Comparison)
**Priority**: Low
**Story Points**: 5

---

### CONS-013: View Client Progress Over Time

**As a** consultant
**I want to** view client progress over multiple quarters
**So that** I can track long-term improvements and show ROI

**Acceptance Criteria**:
- [ ] Historical view shows client SSI scores over time
- [ ] Chart displays: SSI trend (Speed, Strength, Intelligence) by quarter
- [ ] I can see OKR completion rate trend
- [ ] I can overlay milestones (e.g., new initiatives, training programs)
- [ ] I can compare: First assessment vs. Most recent assessment
- [ ] I can export historical report as PDF
- [ ] Report shows: "Client improved Speed by 15% in 6 months"

**Screen Reference**: S17 (Consultant Assessment Comparison)
**Priority**: Low
**Story Points**: 5

---

### CONS-014: Add Private Client Notes

**As a** consultant
**I want to** add private notes about clients
**So that** I can track observations and strategic insights

**Acceptance Criteria**:
- [ ] Client detail page has "Consultant Notes" section
- [ ] Notes are private (visible only to me, not client)
- [ ] I can add notes with timestamp
- [ ] I can tag notes by category: Observation, Recommendation, Follow-Up, Risk
- [ ] I can attach files to notes
- [ ] I can search notes across all clients
- [ ] I can export all notes for a client as PDF

**Screen Reference**: All screens (Consultant Notes sidebar)
**Priority**: Low
**Story Points**: 3

---

### CONS-015: Schedule Client Reviews

**As a** consultant
**I want to** schedule periodic client reviews
**So that** I can maintain regular touchpoints and track progress

**Acceptance Criteria**:
- [ ] I can create review schedule: Weekly, Bi-weekly, Monthly, Quarterly
- [ ] System sends reminder to me and client admin before review
- [ ] Review checklist includes: SSI updates, OKR progress, Blockers, Action items
- [ ] I can add review notes visible to client
- [ ] Past reviews are saved with timestamps
- [ ] I can generate review report from past reviews
- [ ] I can skip or reschedule reviews

**Screen Reference**: S17 (Consultant Assessment Comparison)
**Priority**: Low
**Story Points**: 5

---

### CONS-016: Export Multi-Client Report

**As a** consultant
**I want to** export a report covering all my clients
**So that** I can analyze portfolio performance and identify trends

**Acceptance Criteria**:
- [ ] Export option creates comprehensive multi-client report
- [ ] Report includes: All client SSI scores, OKR completion rates, Engagement metrics
- [ ] Charts: Client comparison radar, Industry benchmarks, Trend analysis
- [ ] I can choose which clients to include in report
- [ ] I can customize report sections
- [ ] Report format: Professional PDF with charts and tables
- [ ] Report is emailed to me (if email service enabled)

**Screen Reference**: S17 (Consultant Assessment Comparison)
**Priority**: Low
**Story Points**: 5

---

## 🔧 ADMIN USER STORIES

### ADMIN-001: Configure iBrain Features

**As an** admin
**I want to** enable or disable iBrain features via toggle switches
**So that** I can control which premium features are active

**Acceptance Criteria**:
- [ ] Admin panel shows 6 iBrain feature toggles with descriptions
- [ ] Features: Predictive Analytics, Sentiment Analysis, AI Coaching, Workflow Automation, Custom ML, Advanced Dashboards
- [ ] Each toggle immediately updates Business model when changed
- [ ] Disabled features are hidden from UI for all users
- [ ] API returns 403 Forbidden for disabled feature endpoints
- [ ] Platform works correctly with all features disabled (standalone mode)
- [ ] Changes are logged in audit trail with timestamp

**Screen Reference**: S15 (Admin Panel - iBrain Settings)
**Priority**: High
**Story Points**: 5

---

### ADMIN-002: Manage Users and Roles

**As an** admin
**I want to** manage user accounts and roles
**So that** I can control access and permissions

**Acceptance Criteria**:
- [ ] User management page shows all users with: name, email, role, status
- [ ] I can create new user accounts manually
- [ ] I can edit user roles: Employee, Manager, Executive, Consultant, Admin
- [ ] I can deactivate users (soft delete - data preserved)
- [ ] I can reactivate deactivated users
- [ ] I can bulk update roles via CSV upload
- [ ] I can filter users by role, team, status
- [ ] I can search users by name or email

**Screen Reference**: S15 (Admin Panel - User Management)
**Priority**: High
**Story Points**: 5

---

### ADMIN-003: Configure OpenAI Integration

**As an** admin
**I want to** configure OpenAI API key
**So that** AI-powered features work for OKR generation and task suggestions

**Acceptance Criteria**:
- [ ] Business settings page has "OpenAI Configuration" section
- [ ] I can enter OpenAI API key (encrypted when stored)
- [ ] System validates API key by making test request
- [ ] I can enable/disable OpenAI features independently
- [ ] If OpenAI disabled or key invalid, system falls back to templates
- [ ] I can monitor API usage: requests per day, cost estimate
- [ ] I can set usage limits to control costs

**Screen Reference**: S15 (Admin Panel - Business Settings)
**Priority**: High
**Story Points**: 5

---

### ADMIN-004: View Audit Logs

**As an** admin
**I want to** view audit logs of system activities
**So that** I can track changes and troubleshoot issues

**Acceptance Criteria**:
- [ ] Audit logs page shows all system events with timestamps
- [ ] Events include: User logins, Role changes, Feature toggles, Data exports, API errors
- [ ] Each log entry shows: timestamp, user, action, IP address, result (success/failure)
- [ ] I can filter logs by: User, Action Type, Date Range, Result
- [ ] I can search logs by keyword
- [ ] I can export logs as CSV
- [ ] Logs are retained for 90 days

**Screen Reference**: S15 (Admin Panel - Audit Logs)
**Priority**: Medium
**Story Points**: 5

---

### ADMIN-005: Configure Email Service

**As an** admin
**I want to** configure email service for invitations and notifications
**So that** users receive email notifications for important events

**Acceptance Criteria**:
- [ ] Email settings page shows email provider options: SendGrid, AWS SES, Mailgun
- [ ] I can enter API key and sender email
- [ ] System validates email configuration by sending test email
- [ ] I can enable/disable email notifications globally
- [ ] If email disabled, system falls back to in-app notifications only
- [ ] I can customize email templates (subject, body)
- [ ] I can monitor email delivery: sent, delivered, bounced, failed

**Screen Reference**: S15 (Admin Panel - Email Settings)
**Priority**: Medium
**Story Points**: 5

---

### ADMIN-006: Set Business Archetype

**As an** admin
**I want to** set company business archetype
**So that** AI-generated OKRs align with our business model

**Acceptance Criteria**:
- [ ] Business settings page shows "Business Archetype" selector
- [ ] I can choose from 16 archetypes (e.g., SaaS, E-commerce, Consulting, Manufacturing)
- [ ] Selected archetype influences AI OKR generation prompts
- [ ] I can see example OKRs for each archetype (preview)
- [ ] I can update archetype quarterly (not recommended to change frequently)
- [ ] Changes are logged with timestamp
- [ ] I can see how archetype is used in OKR generation

**Screen Reference**: S15 (Admin Panel - Business Settings)
**Priority**: Medium
**Story Points**: 3

---

### ADMIN-007: Export All Company Data

**As an** admin
**I want to** export all company data
**So that** I can backup data or migrate to another system

**Acceptance Criteria**:
- [ ] Admin panel has "Export All Data" button with warning
- [ ] Export includes: Users, Objectives, Goals, Tasks, Assessments, SSI scores
- [ ] Export format: JSON or CSV (user choice)
- [ ] Export is generated asynchronously (may take several minutes)
- [ ] I receive email when export is ready for download
- [ ] Export file is encrypted and password-protected
- [ ] Export link expires after 24 hours

**Screen Reference**: S15 (Admin Panel - Data Management)
**Priority**: Low
**Story Points**: 5

---

### ADMIN-008: Configure Platform Branding

**As an** admin
**I want to** customize platform branding
**So that** the platform reflects our company identity

**Acceptance Criteria**:
- [ ] Branding settings page allows me to upload company logo
- [ ] I can customize primary color (replaces Karvia gradient)
- [ ] I can set company name displayed in header
- [ ] I can customize login page background image
- [ ] I can preview changes before saving
- [ ] Changes apply immediately to all users
- [ ] I can reset to default Karvia branding

**Screen Reference**: S15 (Admin Panel - Branding Settings)
**Priority**: Low
**Story Points**: 3

---

## 🗺️ USER JOURNEY MAPS

### Journey 1: New Employee Onboarding

**Persona**: Employee
**Goal**: Get started with Karvia and understand what I need to do

**Steps**:
1. **Receive invitation email** → Click link to create account
2. **Register & login** → See employee dashboard for first time
3. **Receive assessment invitation** → Take individual SSI assessment
4. **Complete assessment** → View my SSI results and weak areas
5. **View assigned objectives** → Understand my personal OKRs
6. **Start working on tasks** → Update task progress
7. **Check dashboard daily** → Track my progress and upcoming deadlines

**Screens Used**: S1, S2, S3, S4, S5, S6
**Success Metrics**: Employee completes assessment within 3 days, starts updating tasks within 1 week

---

### Journey 2: Manager Creates Team OKRs

**Persona**: Manager
**Goal**: Assess my team and create aligned OKRs

**Steps**:
1. **Invite team to assessment** → Send individual assessment invitations to all team members
2. **Monitor completion** → Track who has completed assessments
3. **View team SSI scores** → Review team Speed, Strength, Intelligence scores once ≥80% complete
4. **Identify weak areas** → See which SSI dimensions are below 7
5. **Generate team OKRs** → Use AI to create OKRs targeting weak areas
6. **Customize OKRs** → Edit AI-generated OKRs and add context
7. **Assign goals and tasks** → Break down OKRs into tasks and assign to team members
8. **Monitor progress** → Track team progress weekly

**Screens Used**: S18, S3, S11, S8, S9, S7
**Success Metrics**: Team assessment 100% complete within 1 week, OKRs created within 2 weeks

---

### Journey 3: Executive Strategic Planning

**Persona**: Executive
**Goal**: Understand organizational capabilities and set strategic direction

**Steps**:
1. **Invite all employees to org assessment** → Send company-wide assessment invitation
2. **Monitor org-wide completion** → Track completion across all teams
3. **View organizational SSI** → Review org-level Speed, Strength, Intelligence scores
4. **Drill down to teams** → Identify which teams are weak in which areas
5. **Generate company OKRs** → Create strategic OKRs targeting org weak areas
6. **Cascade to teams** → Assign company OKRs to relevant teams
7. **Monitor progress** → Use Analytics dashboard to track company-wide progress
8. **Adjust strategy** → Make quarterly adjustments based on data

**Screens Used**: S18, S3, S13, S14, S11
**Success Metrics**: Org assessment 70% complete within 2 weeks, Company OKRs published within 3 weeks

---

### Journey 4: Consultant Multi-Client Management

**Persona**: Consultant
**Goal**: Assess and compare multiple clients, provide strategic recommendations

**Steps**:
1. **Switch to Client A** → View Client A dashboard
2. **Create custom assessment template** → Build industry-specific template
3. **Invite Client A employees** → Send assessment invitations
4. **Switch to Client B** → Repeat assessment process
5. **Compare clients** → Use comparison dashboard to see Client A vs Client B SSI scores
6. **Benchmark against industry** → See how clients compare to industry average
7. **Generate recommendations** → Create data-driven strategic recommendations
8. **Share with clients** → Export reports and schedule review meetings

**Screens Used**: S17, S16, S18, S3, Company Switcher
**Success Metrics**: All clients assessed within 4 weeks, recommendations delivered within 6 weeks

---

## ✅ ACCEPTANCE CRITERIA PATTERNS

### Pattern 1: UI/UX Standards

All screens must meet these criteria:

- [ ] Karvia gradient header (#667eea to #764ba2)
- [ ] White background (#ffffff) for content areas
- [ ] Unified navigation with active state (underline)
- [ ] Role-based navigation visibility (progressive disclosure)
- [ ] Responsive design (works on mobile and desktop)
- [ ] Loading states for async operations
- [ ] Error messages are clear and actionable
- [ ] Forms have validation with inline error messages

---

### Pattern 2: Performance Standards

All features must meet these criteria:

- [ ] Dashboard loads in <2 seconds
- [ ] API responses in <500ms (p95)
- [ ] AI operations complete in <5 seconds
- [ ] Page transitions are smooth (<100ms)
- [ ] No blocking operations on main thread
- [ ] Optimistic UI updates where appropriate

---

### Pattern 3: Security & Permissions

All features must enforce these criteria:

- [ ] Users can only access data they have permission to view
- [ ] API endpoints validate user role before returning data
- [ ] Sensitive data (SSI scores, private notes) are protected
- [ ] Audit logs track all permission-related actions
- [ ] CSRF protection on all forms
- [ ] XSS prevention on all user inputs

---

### Pattern 4: Data Integrity

All data operations must meet these criteria:

- [ ] All writes are validated before saving to database
- [ ] Critical operations are wrapped in transactions
- [ ] Soft deletes preserve data (don't hard delete)
- [ ] Audit trail for all data modifications
- [ ] Idempotent API operations where appropriate
- [ ] Data migrations are reversible

---

### Pattern 5: AI Features

All AI-powered features must meet these criteria:

- [ ] Template fallback works when OpenAI disabled
- [ ] AI responses are cached to reduce API calls
- [ ] User can regenerate AI suggestions if not satisfied
- [ ] User can edit AI-generated content before saving
- [ ] AI failures show helpful error messages
- [ ] AI usage is tracked and monitored

---

### Pattern 6: Notifications

All notification features must meet these criteria:

- [ ] In-app notifications always work (even if email disabled)
- [ ] Email notifications are sent if email service configured
- [ ] Users can configure notification preferences
- [ ] Notifications include clear call-to-action
- [ ] Notification history is preserved
- [ ] Users can mark notifications as read/unread

---

## 📊 STORY SUMMARY

| Persona | Total Stories | High Priority | Medium Priority | Low Priority | Total Story Points |
|---------|--------------|---------------|-----------------|--------------|-------------------|
| **Employee** | 15 | 9 | 4 | 2 | 48 |
| **Manager** | 18 | 11 | 5 | 2 | 75 |
| **Executive** | 15 | 10 | 3 | 2 | 70 |
| **Consultant** | 16 | 6 | 5 | 5 | 79 |
| **Admin** | 8 | 3 | 3 | 2 | 31 |
| **TOTAL** | **72** | **39** | **20** | **13** | **303** |

---

## 🎯 MVP PRIORITIZATION

### Must-Have Stories (Blocking Launch)

**Employee**: EMP-001, EMP-002, EMP-003, EMP-004, EMP-005, EMP-006
**Manager**: MGR-001, MGR-002, MGR-003, MGR-004, MGR-005, MGR-006, MGR-011
**Executive**: EXEC-001, EXEC-002, EXEC-003, EXEC-006, EXEC-008, EXEC-010
**Consultant**: CONS-001, CONS-002, CONS-003, CONS-004, CONS-005, CONS-006
**Admin**: ADMIN-001, ADMIN-002, ADMIN-003

**Total Must-Have Stories**: 30
**Total Must-Have Story Points**: 157

---

### Should-Have Stories (Important for Beta)

**Employee**: EMP-007, EMP-008, EMP-009, EMP-010
**Manager**: MGR-007, MGR-008, MGR-009, MGR-010, MGR-012, MGR-013
**Executive**: EXEC-004, EXEC-005, EXEC-007, EXEC-009, EXEC-011
**Consultant**: CONS-007, CONS-008, CONS-009, CONS-010, CONS-011
**Admin**: ADMIN-004, ADMIN-005, ADMIN-006

**Total Should-Have Stories**: 23
**Total Should-Have Story Points**: 104

---

### Nice-to-Have Stories (Post-MVP)

**Employee**: EMP-011, EMP-012, EMP-013, EMP-014, EMP-015
**Manager**: MGR-014, MGR-015, MGR-016, MGR-017, MGR-018
**Executive**: EXEC-012, EXEC-013, EXEC-014, EXEC-015
**Consultant**: CONS-012, CONS-013, CONS-014, CONS-015, CONS-016
**Admin**: ADMIN-007, ADMIN-008

**Total Nice-to-Have Stories**: 19
**Total Nice-to-Have Story Points**: 42

---

## 📝 NOTES FOR IMPLEMENTATION

### Unified Design System Integration

All screens must use the unified design system from `/Karvia_OKR_Mockups/unified_design`:

**Navigation Pattern**:
- Same navigation structure for all roles (progressive disclosure)
- Employee: Dashboard | Objectives | Assessment | Team
- Manager: Dashboard | Objectives | Assessment | Team | Planning
- Executive: Dashboard | Objectives | Assessment | Team | Planning | Analytics
- Admin: + Admin tab

**Visual Design**:
- Karvia gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- White background: `#ffffff`
- Active navigation: 3px bottom border with gradient
- Typography: Inter font family
- Cards: Subtle shadow, 8px border radius

**Component Reuse**:
- Progress rings (circular progress indicators)
- Task cards (collapsible with expand/collapse)
- SSI radar charts (3-dimension comparison)
- User avatars with online status
- Action buttons with icons

---

### Multi-Level Assessment Flow

**Critical Implementation Details**:

1. **Assessment Invitation Flow**:
   - Consultant/Admin creates invitation → Selects target audience → Sets due date → Sends invitations
   - Invitees receive email + in-app notification → Click to start assessment
   - System tracks: pending, started, completed, expired

2. **SSI Calculation Flow**:
   - Individual completes assessment → Individual SSI calculated immediately
   - Team ≥80% complete → Team SSI auto-calculated (weighted average of members)
   - Organization ≥70% complete → Org SSI auto-calculated (40% Individual + 30% Team + 20% Role + 10% Org)

3. **OKR Generation Flow**:
   - SSI scores calculated → Weak areas identified (score <7)
   - User clicks "Generate OKRs" → AI analyzes weak areas + context
   - AI generates OKRs targeting specific weak questions → User reviews and customizes

---

### Role-Based Permissions Summary

| Feature | Employee | Manager | Executive | Consultant | Admin |
|---------|----------|---------|-----------|------------|-------|
| Take assessments | ✅ | ✅ | ✅ | ✅ | ✅ |
| View own SSI | ✅ | ✅ | ✅ | ✅ | ✅ |
| View team SSI | ❌ | ✅ (own team) | ✅ (all teams) | ✅ (all teams) | ✅ |
| View org SSI | ❌ | ❌ | ✅ | ✅ | ✅ |
| Invite to assessments | ❌ | ✅ (own team) | ✅ (all) | ✅ (all) | ✅ |
| Create templates | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign goals | ❌ | ✅ (own team) | ✅ (all) | ❌ (read-only) | ✅ |
| Create company OKRs | ❌ | ❌ | ✅ | ❌ | ✅ |
| Toggle iBrain features | ❌ | ❌ | ✅ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ❌ | ✅ |

---

**Document Owner**: Product & Engineering Team
**Last Updated**: October 1, 2025 (v2.1)
**Status**: ✅ Implementation Ready
**Launch Target**: 🚀 November 30, 2025

---

[◀ Back to MVP Documentation](./README.md) | [PRD](./MVP_PRD.md) | [Technical Architecture ▶](./MVP_TECHNICAL_ARCHITECTURE.md)
