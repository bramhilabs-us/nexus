# KARVIA OKR - MASTER USER STORIES

## VERSION CONTROL

**Document**: USER_STORIES_MASTER.md
**Version**: 5.0.0 (Persona-Based Organization)
**Last Updated**: 2026-01-10
**Updated By**: Strategy Session

**Changelog**:
### v5.0.0 (2026-01-10) - PERSONA-BASED REORGANIZATION
- Reorganized all stories by **Persona** instead of Week
- Added block dependencies documentation (see [BLOCK_DEPENDENCIES.md](./BLOCK_DEPENDENCIES.md))
- Retained sprint references within each story for implementation tracking
- Improved story format with explicit Block + Feature Flag tagging
- Total stories: 105 (unchanged)

### v4.0.0 (2025-11-04) - CONSOLIDATED MASTER
- Consolidated all user stories from MVP_USER_STORIES_V3.2.md (105 stories)
- Integrated all 9 missing stories from MISSING_STORIES_DETAILED.md

---

## EXECUTIVE SUMMARY

**Total User Stories**: 105 stories
**Organization**: By User Persona (primary), Block (secondary), Priority (tertiary)

**Status Breakdown**:
- Completed: 15 stories
- In Progress: 1 story
- Not Started: 89 stories

**Personas**:
| Persona | Stories | Role |
|---------|---------|------|
| Employee (EMP) | 18 | Individual contributor, task completion |
| Manager (MGR) | 28 | Team leader, goal assignment |
| Executive (EXEC) | 20 | Strategic direction, company OKRs |
| Consultant (CONS) | 16 | External advisor, multi-company |
| Admin (ADMIN) | 10 | Platform configuration |
| Cross-Persona | 13 | IAM Block + AI Engine + Integration |

**Architecture**: 7 Feature Flag Blocks (see [BLOCK_DEPENDENCIES.md](./BLOCK_DEPENDENCIES.md))

---

## TABLE OF CONTENTS

1. [User Personas](#user-personas)
2. [Story Format](#story-format)
3. [Employee Stories (EMP)](#employee-stories-emp)
4. [Manager Stories (MGR)](#manager-stories-mgr)
5. [Executive Stories (EXEC)](#executive-stories-exec)
6. [Consultant Stories (CONS)](#consultant-stories-cons)
7. [Admin Stories (ADMIN)](#admin-stories-admin)
8. [Cross-Persona Stories](#cross-persona-stories)
9. [Quick Reference: By Block](#quick-reference-by-block)
10. [Quick Reference: By Priority](#quick-reference-by-priority)
11. [Quick Reference: By Sprint](#quick-reference-by-sprint)

---

## USER PERSONAS

### 1. Employee (EMP) - Individual Contributor
**Role**: Team member focused on personal goals and tasks
**Access**: Dashboard, Objectives, Assessment, Team, Profile
**Primary Goals**: Complete tasks, track progress, understand SSI scores
**Key Screens**: Dashboard, Assessment Results, Objectives
**Total Stories**: 18

### 2. Manager (MGR) - Team Leader
**Role**: Manages team members, assigns work, tracks team performance
**Access**: Dashboard, Objectives, Assessment, Team, Planning, Profile
**Primary Goals**: Align team with objectives, assess capabilities, monitor progress
**Key Screens**: Team Management, Planning, Dashboard
**Total Stories**: 28

### 3. Executive (EXEC) - Company Leadership
**Role**: Sets strategic direction, owns company-wide OKRs
**Access**: All screens + Analytics
**Primary Goals**: Strategic planning, organization visibility, data-driven decisions
**Key Screens**: Analytics, Planning, Objectives
**Total Stories**: 20

### 4. Consultant (CONS) - External Advisor
**Role**: Advises multiple companies, creates templates, compares clients
**Access**: All screens + multi-company switching
**Primary Goals**: Compare clients, customize assessments, provide guidance
**Key Screens**: Assessment Hub, Template Creation, Analytics
**Total Stories**: 16

### 5. Admin (ADMIN) - Platform Administrator
**Role**: Platform configuration, user management, system settings
**Access**: All screens + Admin panel
**Primary Goals**: Configure platform, manage users, maintain system
**Key Screens**: Admin Panel, User Management, Settings
**Total Stories**: 10

---

## STORY FORMAT

Each story includes:
- **ID**: `[PERSONA-XXX]` unique identifier
- **Block**: Which feature flag block (1-7)
- **Feature Flag**: Which flag controls this functionality
- **Sprint Reference**: Which sprint this is planned for
- **Status**: Complete, In Progress, Not Started
- **Priority**: P0 (critical), P1 (high), P2 (medium)
- **Story Points**: 1-8 (Fibonacci scale)
- **Acceptance Criteria**: Detailed requirements

---

## EMPLOYEE STORIES (EMP)

Employee stories focus on individual task completion, personal goal tracking, and understanding how work connects to company objectives.

### EMP-001: Take Assessment [COMPLETE]

**As an** employee
**I want to** complete an assigned assessment
**So that** I can contribute my perspective to team evaluation

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Receive email invitation with unique link
- Click link opens assessment page with template questions
- Questions grouped by dimension (Speed, Strength, Intelligence)
- Each question has 1-10 rating scale
- Progress bar shows completion percentage
- Can save draft and resume later
- Submit button active only when all questions answered
- Confirmation page shows "Assessment submitted successfully"

**Screen Reference**: `client/pages/assessment-take.html`

---

### EMP-002: View Assessment Results [COMPLETE]

**As an** employee
**I want to** view my individual assessment results
**So that** I can understand my Speed/Strength/Intelligence scores

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Results page shows 3 scores with visual rings (Speed, Strength, Intelligence)
- Each score displayed as X/10 with percentage
- Color coding: Green (8-10), Yellow (6-7.9), Red (<6)
- Dimension breakdown shows sub-scores
- Can download results as PDF
- "Back to Dashboard" button navigates to home

**Screen Reference**: `client/pages/assessment-results.html`

---

### EMP-004: View My Objectives [NOT STARTED]

**As an** employee
**I want to** view objectives assigned to me
**So that** I understand my priorities and how my work aligns with company goals

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View list of objectives I'm assigned to
- See my key results within each objective
- View progress percentage for each item
- Filter by status (active, completed, at-risk)
- Click objective to see full details and my tasks

**Screen Reference**: `client/pages/objectives.html`

---

### EMP-005: View My Profile [NOT STARTED]

**As an** employee
**I want to** view my profile information
**So that** I can verify my details are correct

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Profile page shows my name, email, role, team
- Display avatar image
- Show when I joined the company
- List my current assignments
- View my assessment history (if ASSESSMENT_BLOCK enabled)

**Screen Reference**: `client/pages/profile.html`

---

### EMP-006: Upload Avatar [NOT STARTED]

**As an** employee
**I want to** upload my profile picture
**So that** my teammates can recognize me

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Click avatar to open upload modal
- Support JPG, PNG formats (max 2MB)
- Preview before saving
- Crop tool for square avatar
- Success message after upload
- Avatar updates across all screens

---

### EMP-007: View Assessment History [NOT STARTED]

**As an** employee
**I want to** view my past assessment results
**So that** I can track my improvement over time

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- List all assessments I've completed
- Show date, template name, overall score for each
- Click to see detailed breakdown
- Trend chart comparing scores across assessments
- Export history to PDF

---

### EMP-008: View Daily Tasks [NOT STARTED]

**As an** employee
**I want to** see my tasks for today
**So that** I can focus on what needs to be done

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Sprint 8 (Redesign) |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Dashboard shows today's tasks prominently
- Tasks grouped by goal they belong to
- Priority indicator (high, medium, low)
- Due time/deadline visible
- Quick action to mark complete
- Overdue tasks highlighted in red

**Note**: Part of Sprint 8 Dashboard Redesign (US-S8-D1)

---

### EMP-009: Complete Task [NOT STARTED]

**As an** employee
**I want to** mark tasks as complete
**So that** my progress is tracked accurately

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Sprint 8 (Redesign) |
| **Priority** | P0 (Critical) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- One-click complete button on each task
- Completion animates with checkmark
- Progress percentage updates immediately
- Optional completion notes
- Undo available for 5 seconds after marking complete
- Manager notified of completion (if PROGRESS_ROLLUP enabled)

**Note**: Part of Sprint 8 Dashboard Redesign (US-S8-D3)

---

### EMP-010: Update Task Progress [NOT STARTED]

**As an** employee
**I want to** update my task progress incrementally
**So that** my manager has visibility into my work

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Sprint 8 (Redesign) |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Slider or input to set percentage complete (0-100%)
- Add notes explaining progress
- Save changes with timestamp
- View progress history on task detail
- Changes roll up to goal progress automatically

**Note**: Part of Sprint 8 Dashboard Redesign (US-S8-D4)

---

### EMP-011: View Task History [NOT STARTED]

**As an** employee
**I want to** view my completed tasks
**So that** I can track what I've accomplished

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 7 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View list of completed tasks
- Filter by date range, goal, objective
- Show completion date and any notes
- Export to CSV

---

### EMP-012: Daily Reflection [NOT STARTED]

**As an** employee
**I want to** log a quick daily reflection
**So that** I can track my learnings and blockers

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 7 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Quick reflection prompt at end of day
- Text field for "What did you accomplish?"
- Text field for "Any blockers?"
- Optional mood indicator
- Manager can view reflections (if enabled)

---

### EMP-013: Task Reminders [NOT STARTED]

**As an** employee
**I want to** receive reminders for upcoming tasks
**So that** I don't miss deadlines

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 7 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- In-app notification for tasks due in 24 hours
- Email reminder option (user configurable)
- Snooze reminder option
- Badge count on dashboard for overdue tasks

---

### EMP-014: View My Goals [NOT STARTED]

**As an** employee
**I want to** see the goals I'm contributing to
**So that** I understand my quarterly and weekly targets

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View quarterly goals assigned to me
- View weekly goals broken down from quarterly
- See tasks under each goal
- Progress bar for each goal
- Due date and time remaining

---

### EMP-015: Update Goal Progress [NOT STARTED]

**As an** employee
**I want to** update progress on my goals
**So that** my manager sees accurate status

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Edit goal progress percentage
- Add status notes
- Progress updates cascade to parent key result
- Activity log shows update history

---

### EMP-016: View "Why Chain" Context [NOT STARTED]

**As an** employee
**I want to** see how my task connects to company objectives
**So that** I understand the impact of my work and stay motivated

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 3 (Assessment for lineage) |
| **Feature Flag** | Always On |
| **Sprint** | Sprint 8 (Redesign) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Breadcrumb format: `Company OKR > Objective > Key Result > Quarterly Goal > Weekly Goal > This Task`
- Each level clickable showing details (title, progress, owner, due date)
- Visual indicator: "Your task represents 0.4% of Quarterly Goal progress"
- Tooltip shows assessment insight: "Generated from Q4 2025 SSI Assessment - Addresses Financial Strength gap (5.5/10)"
- Mobile responsive: Breadcrumb collapses to dropdown
- Empty state: "This task is not connected to a goal yet - Ask your manager to link it"

**Note**: Part of Sprint 8 Dashboard Redesign (US-S8-D2). Critical for connecting daily work to strategy.

---

### EMP-017: Business Impact Metric [BETA - NOT STARTED]

**As an** employee
**I want to** see a calculated "Business Impact Score" for my work
**So that** I can understand my contribution to company success

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 11 (BETA) |
| **Priority** | P2 (Medium) |
| **Story Points** | 3 |
| **Status** | NOT STARTED - BETA |

**Acceptance Criteria**:
- Dashboard widget shows personal impact score
- Score calculated from: task completion rate, goal progress contribution, on-time delivery
- Compare to team average
- Trend line over time

---

### EMP-018: Recognition Notifications [BETA - NOT STARTED]

**As an** employee
**I want to** receive recognition when my tasks contribute to achieved goals
**So that** I feel valued and motivated

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 10 (BETA) |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED - BETA |

**Acceptance Criteria**:
- Notification when a goal I contributed to is completed
- Show my contribution percentage
- Celebration animation
- Manager can add personal recognition note

---

## MANAGER STORIES (MGR)

Manager stories focus on team leadership, goal assignment, progress monitoring, and intervention when team members need support.

### MGR-001: Send Team Assessment Invitation [COMPLETE]

**As a** manager
**I want to** send assessment invitations to my team members
**So that** I can evaluate team capabilities

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Select team members from team roster
- Choose assessment template
- Set due date
- Send bulk invitations
- Track invitation status

---

### MGR-002: View Team Assessment Progress [COMPLETE]

**As a** manager
**I want to** see assessment completion status for my team
**So that** I can follow up with incomplete assessments

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Dashboard shows team assessment status
- List of pending, in-progress, completed assessments
- Send reminder to those not started
- Due date countdown

---

### MGR-003: View Team SSI Results [COMPLETE]

**As a** manager
**I want to** view aggregated SSI results for my team
**So that** I can identify team strengths and weaknesses

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Team average for Speed, Strength, Intelligence
- Comparison to company average
- Individual member scores (anonymized option)
- Export to PDF
- Trigger OKR generation from results

---

### MGR-004: Create New Team [NOT STARTED]

**As a** manager
**I want to** create a new team
**So that** I can organize my department

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Team creation form with name, description
- Set myself as team manager
- Assign parent department (optional)
- Team appears in company hierarchy

---

### MGR-005: Add Team Members [NOT STARTED]

**As a** manager
**I want to** add members to my team
**So that** I can build my team roster

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Search existing users or invite new by email
- Set role (Employee, Manager)
- Bulk add via CSV import (if BULK_OPS enabled)
- Confirmation email sent to new members

---

### MGR-006: View Team List [NOT STARTED]

**As a** manager
**I want to** view all my team members
**So that** I have a clear roster

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 5 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- List view with name, role, email
- Avatar display
- Filter by role
- Quick actions (message, view profile, remove)

---

### MGR-007: Remove Team Member [NOT STARTED]

**As a** manager
**I want to** remove members from my team
**So that** I can keep the roster accurate

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 5 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Confirmation dialog before removal
- Reassign their tasks to another member
- Member's history preserved
- Notification to removed member

---

### MGR-008: Track Objective Progress [NOT STARTED]

**As a** manager
**I want to** see progress on objectives my team is contributing to
**So that** I can ensure we're on track

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Dashboard widget showing team objectives
- Progress bar for each objective/KR
- Status indicators (on track, at risk, behind)
- Drill down to see goal details

---

### MGR-009: Update Team Info [NOT STARTED]

**As a** manager
**I want to** edit my team's information
**So that** I can keep details current

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 5 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Edit team name, description
- Update team avatar
- Change parent department
- View team history log

---

### MGR-010: View Team Member Profiles [NOT STARTED]

**As a** manager
**I want to** view profiles of my team members
**So that** I understand their capabilities

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View full profile including role, contact
- See their current assignments
- View their assessment scores (if ASSESSMENT_BLOCK enabled)
- See their task completion rate

---

### MGR-011: Update Profile Info [NOT STARTED]

**As a** manager
**I want to** update my own profile
**So that** my team has current information

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Edit name, phone, bio
- Upload profile photo
- Set notification preferences
- Change password

---

### MGR-012: View Team Dashboard [NOT STARTED]

**As a** manager
**I want to** see a dashboard of my team's activity
**So that** I have real-time visibility

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 7 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Overview of team goals and progress
- Activity feed of recent updates
- At-risk indicators
- Quick links to team members

---

### MGR-013: Monitor Team Tasks [NOT STARTED]

**As a** manager
**I want to** see all tasks across my team
**So that** I can ensure work is progressing

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 7 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- List all team tasks with assignee
- Filter by status, due date, assignee
- Kanban view option
- Bulk reassignment (if BULK_OPS enabled)

---

### MGR-014: Task Notifications [NOT STARTED]

**As a** manager
**I want to** receive notifications about team task updates
**So that** I stay informed

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 7 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Notification when task completed
- Alert when task overdue
- Daily digest email option
- In-app notification center

---

### MGR-015: Assign Goals to Team [NOT STARTED]

**As a** manager
**I want to** assign goals to team members
**So that** everyone knows their responsibilities

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Select goal from team's objectives
- Choose assignee(s)
- Set individual targets/weights
- Notification sent to assignees
- Goal appears on assignee dashboard

---

### MGR-016: Create Team Goals [NOT STARTED]

**As a** manager
**I want to** create quarterly and weekly goals for my team
**So that** we have clear targets

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Create quarterly goal linked to key result
- Set target metric and due date
- Break into weekly goals
- Assign to team members

---

### MGR-017: Create Tasks from Goals [NOT STARTED]

**As a** manager
**I want to** break goals into tasks
**So that** work is actionable

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Create task under a goal
- Set title, description, due date
- Assign to team member
- Set priority

---

### MGR-018: Link Tasks to Goals [NOT STARTED]

**As a** manager
**I want to** link existing tasks to goals
**So that** all work is connected to objectives

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Select unlinked tasks
- Choose parent goal
- Task now shows in goal lineage

---

### MGR-019: Track Goal Progress [NOT STARTED]

**As a** manager
**I want to** see progress on all team goals
**So that** I know where we stand

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Dashboard view of all goals
- Progress percentage for each
- Status indicators
- Filter by assignee, status

---

### MGR-020: Update Goal Status [NOT STARTED]

**As a** manager
**I want to** update goal status manually
**So that** I can override calculated progress when needed

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 8 |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Edit goal progress percentage
- Add status notes
- Mark as complete, on-hold, cancelled
- Reason field for status changes

---

### MGR-021: Create Quarterly Plans [NOT STARTED]

**As a** manager
**I want to** create quarterly plans for my team
**So that** we have structured targets for the quarter

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 9 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Create plan linked to key results
- Set quarterly goals with targets
- Estimate capacity/effort
- Submit for executive approval (if IAM_BLOCK enabled)

---

### MGR-022: Allocate Weekly Goals [NOT STARTED]

**As a** manager
**I want to** break quarterly goals into weekly goals
**So that** progress is trackable week by week

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 9 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Create weekly goals from quarterly
- Distribute targets across weeks
- Assign to team members
- Calendar view of weekly goals

---

### MGR-023: Assign Team Capacity [NOT STARTED]

**As a** manager
**I want to** track team capacity allocation
**So that** I don't overcommit my team

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 9 |
| **Priority** | P2 (Medium) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Set team member capacity (hours/week)
- Assign goals/tasks with time estimates
- Warning when over capacity
- Capacity dashboard

---

### MGR-024: Review Team Planning [NOT STARTED]

**As a** manager
**I want to** review and adjust team plans
**So that** plans stay realistic

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 9 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View quarterly plan summary
- Adjust goals and assignments
- Compare planned vs actual progress
- Re-plan mid-quarter if needed

---

### MGR-025: View Team Assessment Health [NOT STARTED]

**As a** manager
**I want to** view my team's assessment scores and compare to company average
**So that** I can identify capability gaps and plan training

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- "Assessment Health" tab on team detail page
- Shows aggregated SSI scores: Speed 7.2/10 (Company avg: 6.8) with color indicator
- Radar chart: team vs company average
- Sub-dimension breakdown (e.g., Speed > Decision Making: 7.5, Execution: 6.9)
- Completion status: "5 of 7 team members completed" with "Send Reminder" button
- Historical trend line chart (if multiple assessments)
- AI-recommended actions: "Consider training for Financial Strength dimension"
- Export to PDF button

---

### MGR-026: Intervention Workflow (Automated Alerts) [NOT STARTED]

**As a** manager
**I want to** receive automated alerts when team members are at risk
**So that** I can intervene early and prevent failures

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 8 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- System monitors team members daily (cron job)
- Triggers alert if: >50% tasks overdue 3+ days, No tasks complete in 7+ days, Goal progress <30% with <30 days left
- Manager receives: In-app notification badge, email (if enabled), dashboard "At Risk" widget
- "Intervention Center" shows: Employee name + photo, alert reason, current workload, recent activity
- Suggested actions: "Message Employee", "Reassign Tasks", "Extend Deadlines", "Schedule 1:1", "Dismiss Alert"
- Manager can add private notes
- Alert status: Open, In Progress, Resolved, Dismissed
- Dashboard widget: "3 team members need attention" with quick preview

---

### MGR-027: Generate Weekly Roll-up Report [BETA - NOT STARTED]

**As a** manager
**I want to** automatically generate weekly team progress reports
**So that** I can share updates with executives efficiently

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 11 (BETA) |
| **Priority** | P2 (Medium) |
| **Story Points** | 3 |
| **Status** | NOT STARTED - BETA |

**Acceptance Criteria**:
- One-click report generation
- Summary of goals completed, in progress, at risk
- Highlights and blockers
- Export to PDF/email

---

## EXECUTIVE STORIES (EXEC)

Executive stories focus on strategic planning, company-wide visibility, approval workflows, and data-driven decision making.

### EXEC-001: View Company Assessment Results [COMPLETE]

**As an** executive
**I want to** view company-wide assessment results
**So that** I understand organizational strengths and weaknesses

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Company-level SSI aggregate
- Breakdown by department/team
- Comparison charts
- Drill down to team level

---

### EXEC-002: Generate AI OKRs from Assessment [95% COMPLETE - 1 BUG]

**As an** executive
**I want to** generate AI-powered OKRs from assessment results
**So that** I get data-driven strategic objectives

| Attribute | Value |
|-----------|-------|
| **Block** | 4 (AI OKR Engine) |
| **Feature Flag** | `AI_ENGINE` |
| **Sprint** | Week 4 (with Week 5 Day 1 fix) |
| **Priority** | P0 (Critical) |
| **Story Points** | 8 |
| **Status** | 95% COMPLETE - Fix pending |

**Acceptance Criteria**:
- "Generate OKRs" button on assessment results page
- AI analyzes Speed/Strength/Intelligence scores
- Generates 3-5 yearly objectives with key results
- OKRs saved to database with company_id
- Review page displays generated OKRs (BUG: ISS-W4-001)
- Accept/Reject workflow
- One-time generation enforcement

---

### EXEC-003: View All Company Objectives [NOT STARTED]

**As an** executive
**I want to** see all company objectives
**So that** I have visibility into our strategic plan

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- List all objectives across company
- Filter by status, owner, department
- Progress indicators for each
- Drill down to key results

---

### EXEC-004: Fix AI OKR Review Bug [NOT STARTED]

**As an** executive
**I want to** the AI OKR review page to work correctly
**So that** I can review and approve generated OKRs

| Attribute | Value |
|-----------|-------|
| **Block** | 4 (AI OKR Engine) |
| **Feature Flag** | `AI_ENGINE` |
| **Sprint** | Week 5 Day 1 |
| **Priority** | P0 (Critical - Blocking) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Review page displays generated OKRs correctly
- Can edit, accept, or reject each OKR
- Submit accepts all approved OKRs

---

### EXEC-005: Filter Objectives by Department [NOT STARTED]

**As an** executive
**I want to** filter objectives by department
**So that** I can focus on specific areas

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 5 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Department filter dropdown
- Team filter (sub-filter)
- Multi-select supported
- Persist filter preferences

---

### EXEC-006: Track Company Progress [NOT STARTED]

**As an** executive
**I want to** track overall company OKR progress
**So that** I know if we're meeting our goals

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Dashboard with company-wide progress
- Objective-level progress bars
- Key result rollup
- Trend over time

---

### EXEC-007: View Executive Dashboard [NOT STARTED]

**As an** executive
**I want to** see a tailored dashboard
**So that** I have quick access to key metrics

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 6 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Company health overview
- Top objectives by priority
- Teams at risk
- Recent activity feed

---

### EXEC-008: View Organization Info [NOT STARTED]

**As an** executive
**I want to** view and update company information
**So that** our profile is accurate

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View company name, industry, size
- Edit company profile
- View team hierarchy
- See total headcount

---

### EXEC-009: Executive Dashboard Overview [NOT STARTED]

**As an** executive
**I want to** see high-level metrics at a glance
**So that** I can quickly assess company health

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 7 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- KPI cards: Objectives on track %, Goals completed, At-risk items
- Sparkline trends
- Click to drill down

---

### EXEC-010: Approve Company Goals [NOT STARTED]

**As an** executive
**I want to** approve goals created by managers
**So that** I ensure alignment with strategy

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 7 (Permission Rules) |
| **Feature Flag** | `PERMISSION_RULES` |
| **Sprint** | Week 8 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Approval queue in dashboard
- Review goal details
- Approve or request changes
- Notification to manager

---

### EXEC-011: Cascade Goals to Teams [NOT STARTED]

**As an** executive
**I want to** cascade company objectives to teams
**So that** everyone is aligned

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 8 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Select objective to cascade
- Choose teams to receive
- Auto-create team-level goals
- Track cascade status

---

### EXEC-011B: Approve Manager Quarterly Plans [NOT STARTED]

**As an** executive
**I want to** review and approve manager-created quarterly plans
**So that** I can ensure team plans align with company objectives before execution begins

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 9 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- "Pending Approval" notification after managers submit quarterly plans
- "Planning Approval" workspace shows all team plans side-by-side
- Click team for detailed plan view
- Can add comments to each team plan
- "Approve" or "Request Changes" per team
- If "Request Changes": Comment required, manager notified
- If "Approve": Status changes, manager notified, goals become active
- Dashboard shows: "X of Y teams approved, Z teams pending changes"

---

### EXEC-012: Create Yearly OKRs [NOT STARTED]

**As an** executive
**I want to** create yearly objectives for the company
**So that** we have strategic direction

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 9 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Create objective with title, description
- Set yearly timeframe
- Add key results
- Assign owners
- Set priority

---

### EXEC-013: Break into Quarterly Goals [NOT STARTED]

**As an** executive
**I want to** break yearly objectives into quarterly goals
**So that** we have actionable targets

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 9 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Select yearly objective
- Create Q1-Q4 goals
- Distribute key result targets
- Assign to teams

---

### EXEC-014: Review Team Plans [NOT STARTED]

**As an** executive
**I want to** review all team quarterly plans
**So that** I ensure alignment

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 9 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View all team plans in one place
- Compare planned capacity
- Identify conflicts
- Provide feedback

---

### EXEC-015: Approve Planning Cycles [NOT STARTED]

**As an** executive
**I want to** approve the planning cycle
**So that** we can begin execution

| Attribute | Value |
|-----------|-------|
| **Block** | 7 (Permission Rules) |
| **Feature Flag** | `PERMISSION_RULES` |
| **Sprint** | Week 9 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Final approval step for quarter
- Lock plans after approval
- Notify all teams
- Enable tracking

---

### EXEC-016: View Analytics Dashboard [NOT STARTED]

**As an** executive
**I want to** see detailed analytics
**So that** I can make data-driven decisions

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 11 |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Charts for OKR progress
- Team performance comparisons
- Trend analysis
- Drill-down capabilities

---

### EXEC-017: Export Analytics Reports [NOT STARTED]

**As an** executive
**I want to** export analytics reports
**So that** I can share with stakeholders

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 11 |
| **Priority** | P2 (Medium) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Export to PDF
- Export to Excel
- Scheduled reports (email)
- Custom date ranges

---

### EXEC-018: Track Company Metrics [NOT STARTED]

**As an** executive
**I want to** track key company metrics
**So that** I monitor business health

| Attribute | Value |
|-----------|-------|
| **Block** | 5 (Progress Rollup) |
| **Feature Flag** | `PROGRESS_ROLLUP` |
| **Sprint** | Week 11 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Define custom metrics
- Track against targets
- Visualize trends
- Set alerts for thresholds

---

## CONSULTANT STORIES (CONS)

Consultant stories focus on multi-company management, assessment template creation, client comparison, and advisory workflows.

### CONS-001: Create Assessment Template [COMPLETE]

**As a** consultant
**I want to** create custom assessment templates
**So that** I can tailor assessments to specific client needs

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 8 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- 4-step wizard flow (Name > Weights > Questions > Review)
- Step 1: Enter template name, description, select business/global scope
- Step 2: Set dimension weights (Speed, Strength, Intelligence must sum to 100%)
- Step 3: Select questions from 146-question library with search/filter
- Step 4: Review and publish template
- Template saved to MongoDB with UUID
- Confirmation message displayed

---

### CONS-002: View Assessment Templates [COMPLETE]

**As a** consultant
**I want to** view all available assessment templates
**So that** I can select appropriate templates for clients

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Assessment Hub shows 4 tabs (My Templates, Available, Assigned, Sent)
- "My Templates" shows consultant-created templates
- Each template card displays: name, SSI breakdown, question count, creation date
- Click template card navigates to detail view
- Role-based filtering

---

### CONS-003: Send Assessment Invitation [COMPLETE]

**As a** consultant
**I want to** send assessment invitations to multiple recipients
**So that** I can collect responses from client teams

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- "Send Invitation" button on Assessment Hub
- Modal shows: template selector, recipient email list, due date picker
- Can add multiple recipients
- Email sent via Mailjet with invitation link
- Success message shows "X invitations sent"

---

### CONS-004: Track Invitation Status [COMPLETE]

**As a** consultant
**I want to** track assessment invitation status
**So that** I know who has completed

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- "Sent" tab shows all invitations
- Status: Pending, Started, Completed, Expired
- Send reminder option
- View response when completed

---

### CONS-005: View Template Usage Stats [COMPLETE]

**As a** consultant
**I want to** see how my templates are being used
**So that** I can improve them

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P2 (Medium) |
| **Story Points** | 2 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Template analytics: times used, companies, avg scores
- Completion rate
- Question-level analysis

---

### CONS-006: Generate Client OKRs [COMPLETE]

**As a** consultant
**I want to** generate OKRs for my clients from their assessment
**So that** I provide value-added consulting

| Attribute | Value |
|-----------|-------|
| **Block** | 4 (AI OKR Engine) |
| **Feature Flag** | `AI_ENGINE` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Trigger OKR generation for client company
- AI uses client's assessment data
- Review generated OKRs
- Client receives for approval

---

### CONS-007: View Multi-Company Stats [NOT STARTED]

**As a** consultant
**I want to** see statistics across all my clients
**So that** I can compare and benchmark

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) + 2 (IAM) |
| **Feature Flag** | `ASSESSMENT_BLOCK` + `IAM_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Dashboard showing all client companies
- SSI comparison across companies
- Benchmark against industry
- Identify common gaps

---

### CONS-007B: View Team SSI Breakdown (Heatmap) [NOT STARTED]

**As a** consultant
**I want to** see SSI scores visualized by team
**So that** I can identify which teams need targeted interventions

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 6 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- "Team Insights" tab on Assessment Hub
- Heatmap: Rows = Teams, Columns = SSI Dimensions, Cells = Color-coded scores
- Hover cell shows: Team name, dimension, exact score, company average, trend
- Click cell to drill down to individual member scores
- Filter: Department, assessment period
- Sort: By team name, lowest score, highest variance
- Export to Excel
- Comparison mode: Toggle "Compare to Company Avg"

---

### CONS-008: Multi-Company Planning View [NOT STARTED]

**As a** consultant
**I want to** view planning across all my clients
**So that** I can manage my consulting workload

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 9 |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Dashboard with all client plans
- Filter by client, quarter
- Status indicators
- Quick switch between clients

---

### CONS-009: Template Planning Workflows [NOT STARTED]

**As a** consultant
**I want to** create planning templates
**So that** I can standardize my methodology

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 9 |
| **Priority** | P2 (Medium) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Create reusable planning templates
- Apply templates to clients
- Track template usage

---

### CONS-009B: Collaborative OKR Review [BETA - NOT STARTED]

**As a** consultant
**I want to** facilitate real-time OKR reviews with my client
**So that** we can iterate on AI-generated objectives together

| Attribute | Value |
|-----------|-------|
| **Block** | 4 (AI OKR Engine) |
| **Feature Flag** | `AI_ENGINE` |
| **Sprint** | Week 10 (BETA) |
| **Priority** | P2 (Medium) |
| **Story Points** | 5 |
| **Status** | NOT STARTED - BETA |

**Acceptance Criteria**:
- Share review session with client
- Real-time editing
- Comments and discussion
- Version history

---

### CONS-010: Compare Client Plans [NOT STARTED]

**As a** consultant
**I want to** compare plans across clients
**So that** I can share best practices

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) + 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 9 |
| **Priority** | P2 (Medium) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Side-by-side plan comparison
- Identify patterns
- Create insights report

---

### CONS-011: Export Planning Reports [NOT STARTED]

**As a** consultant
**I want to** export comprehensive planning reports
**So that** I can deliver to clients

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 9 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Export to PDF with branding
- Include charts and tables
- Executive summary
- Detailed breakdowns

---

### US-W7.5-002: Consultant Prompt Customization [NOT STARTED]

**As a** consultant
**I want to** customize AI prompts for OKR generation
**So that** I can tailor output to my methodology

| Attribute | Value |
|-----------|-------|
| **Block** | 4 (AI OKR Engine) |
| **Feature Flag** | `AI_ENGINE` |
| **Sprint** | Week 7.5 |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Edit system prompt template
- Add industry-specific context
- Preview output before saving
- Version history of prompts

---

## ADMIN STORIES (ADMIN)

Admin stories focus on platform configuration, user management, and system maintenance.

### ADMIN-001: Manage Question Library [COMPLETE]

**As an** admin
**I want to** manage the assessment question library
**So that** templates have quality questions

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- CRUD operations on questions
- Categorize by dimension
- Set scoring weights
- Activate/deactivate questions

---

### ADMIN-002: Create Global Templates [COMPLETE]

**As an** admin
**I want to** create global assessment templates
**So that** all users have default options

| Attribute | Value |
|-----------|-------|
| **Block** | 3 (Assessment System) |
| **Feature Flag** | `ASSESSMENT_BLOCK` |
| **Sprint** | Week 1-4 (Complete) |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | COMPLETE |

**Acceptance Criteria**:
- Create templates marked as "global"
- Templates available to all companies
- Cannot be edited by non-admins
- Track usage statistics

---

### ADMIN-003: Manage Users [NOT STARTED]

**As an** admin
**I want to** manage all platform users
**So that** I can support customers

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View all users across companies
- Search and filter
- Reset passwords
- Impersonate user (for support)
- Deactivate accounts

---

### ADMIN-004: Configure System Settings [NOT STARTED]

**As an** admin
**I want to** configure platform settings
**So that** the system works as needed

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 11 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Toggle feature flags
- Set default values
- Configure integrations
- Manage API keys

---

### ADMIN-005: View System Logs [NOT STARTED]

**As an** admin
**I want to** view system logs
**So that** I can troubleshoot issues

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 11 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View application logs
- Filter by severity, date, component
- Search logs
- Export for analysis

---

### ADMIN-006: Manage Permissions [NOT STARTED]

**As an** admin
**I want to** manage role permissions
**So that** access control is correct

| Attribute | Value |
|-----------|-------|
| **Block** | 7 (Permission Rules) |
| **Feature Flag** | `PERMISSION_RULES` |
| **Sprint** | Week 11 |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- View permission matrix
- Edit role permissions
- Create custom roles
- Audit permission changes

---

### ADMIN-007: Bulk User Import [NOT STARTED]

**As an** admin
**I want to** bulk import users
**So that** companies can onboard quickly

| Attribute | Value |
|-----------|-------|
| **Block** | 6 (Bulk Operations) |
| **Feature Flag** | `BULK_OPS` |
| **Sprint** | Week 11 |
| **Priority** | P2 (Medium) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Upload CSV template
- Validate before import
- Handle errors gracefully
- Send welcome emails

---

### ADMIN-008: Deactivate Users [NOT STARTED]

**As an** admin
**I want to** deactivate users
**So that** ex-employees lose access

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 11 |
| **Priority** | P1 (High) |
| **Story Points** | 2 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Deactivate individual or bulk
- Data preserved (not deleted)
- Reassign their tasks
- Revoke tokens immediately

---

### ADMIN-009: Configure Email Templates [NOT STARTED]

**As an** admin
**I want to** customize email templates
**So that** communications match brand

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 11 |
| **Priority** | P2 (Medium) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Edit email templates
- Preview before saving
- Add company logo
- Test send

---

### ADMIN-010: System Health Dashboard [NOT STARTED]

**As an** admin
**I want to** monitor system health
**So that** I can proactively address issues

| Attribute | Value |
|-----------|-------|
| **Block** | 1 (Core Execution) |
| **Feature Flag** | Always On |
| **Sprint** | Week 11 |
| **Priority** | P1 (High) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- API response times
- Error rates
- Database performance
- User activity metrics
- Alerting thresholds

---

## CROSS-PERSONA STORIES

These stories span multiple personas and focus on system-level functionality.

### IAM Block Stories (Week 7)

#### US-W7-001: Company Creation [NOT STARTED]

**As any** authorized user
**I want to** create a new company
**So that** new clients can be onboarded

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 7 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Company registration form
- Industry selection
- Set up admin user
- Configure initial settings

---

#### US-W7-002: Team Hierarchy [NOT STARTED]

**As any** authorized user
**I want to** see the team hierarchy
**So that** I understand organization structure

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 7 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Visual org chart
- Expand/collapse levels
- Show member counts
- Click to view team details

---

#### US-W7-003: Member Management [NOT STARTED]

**As any** authorized user
**I want to** manage team membership
**So that** teams are accurate

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 7 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Add/remove members
- Change roles
- Transfer between teams
- Audit trail

---

#### US-W7-004: Multi-Company Access [NOT STARTED]

**As a** consultant
**I want to** switch between companies
**So that** I can manage multiple clients

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 7 |
| **Priority** | P0 (Critical) |
| **Story Points** | 5 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Company switcher in header
- Maintain session per company
- Recently accessed list
- Search companies

---

#### US-W7-005: Context Filtering [NOT STARTED]

**As any** user
**I want to** filter views by context
**So that** I see relevant data

| Attribute | Value |
|-----------|-------|
| **Block** | 2 (IAM) |
| **Feature Flag** | `IAM_BLOCK` |
| **Sprint** | Week 7 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Filter by company (multi-company users)
- Filter by team
- Persist filter preferences
- Apply to all views

---

### AI OKR Engine Stories (Week 7.5)

#### US-W7.5-001: LLM OKR Generation [NOT STARTED]

**As any** authorized user
**I want to** generate OKRs using AI
**So that** I get intelligent recommendations

| Attribute | Value |
|-----------|-------|
| **Block** | 4 (AI OKR Engine) |
| **Feature Flag** | `AI_ENGINE` |
| **Sprint** | Week 7.5 |
| **Priority** | P0 (Critical) |
| **Story Points** | 8 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Integration with GPT-4
- Use company context (industry, metrics, priorities)
- Use assessment results (SSI scores)
- Generate 3-5 objectives with key results
- Review and edit before accepting

**Data Flow**: See [BLOCK_DEPENDENCIES.md](./BLOCK_DEPENDENCIES.md) - Flow 1 & Flow 2

---

#### US-W7.5-003: Template Fallback [NOT STARTED]

**As any** user
**I want to** get OKR suggestions even if AI is unavailable
**So that** I can still create OKRs

| Attribute | Value |
|-----------|-------|
| **Block** | 4 (AI OKR Engine) |
| **Feature Flag** | `AI_ENGINE` (graceful degradation) |
| **Sprint** | Week 7.5 |
| **Priority** | P1 (High) |
| **Story Points** | 3 |
| **Status** | NOT STARTED |

**Acceptance Criteria**:
- Template-based OKR suggestions when AI unavailable
- Industry-specific templates
- Customizable templates
- Clear indication when using fallback

---

## QUICK REFERENCE: BY BLOCK

### Block 1: Core Execution (35 stories) - Always On
Core OKR functionality that works without any optional blocks.

**Stories**: EMP-004, EMP-008, EMP-009, EMP-010, EMP-011, EMP-014, EMP-015, EMP-016, MGR-008, MGR-012, MGR-013, MGR-015, MGR-016, MGR-017, MGR-018, MGR-019, MGR-020, MGR-021, MGR-022, MGR-024, EXEC-003, EXEC-006, EXEC-007, EXEC-011, EXEC-012, EXEC-013, EXEC-014, CONS-008, CONS-009, CONS-010, CONS-011, ADMIN-004, ADMIN-005, ADMIN-009, ADMIN-010

### Block 2: IAM (18 stories) - Feature Flag: `IAM_BLOCK`
Multi-user, team management, role-based permissions.

**Stories**: EMP-005, EMP-006, MGR-004, MGR-005, MGR-006, MGR-007, MGR-009, MGR-010, MGR-011, EXEC-005, EXEC-008, EXEC-011B, EXEC-014, CONS-007, ADMIN-003, ADMIN-008, US-W7-001 through US-W7-005

### Block 3: Assessment System (22 stories) - Feature Flag: `ASSESSMENT_BLOCK`
SSI scoring, templates, maturity analysis.

**Stories**: EMP-001, EMP-002, EMP-007, MGR-001, MGR-002, MGR-003, MGR-025, EXEC-001, CONS-001, CONS-002, CONS-003, CONS-004, CONS-005, CONS-007, CONS-007B, ADMIN-001, ADMIN-002

### Block 4: AI OKR Engine (8 stories) - Feature Flag: `AI_ENGINE`
GPT-4 OKR generation, smart suggestions.

**Stories**: EXEC-002, EXEC-004, CONS-006, CONS-009B, US-W7.5-001, US-W7.5-002, US-W7.5-003

### Block 5: Progress Rollup (10 stories) - Feature Flag: `PROGRESS_ROLLUP`
Automated calculations, alerts, reports.

**Stories**: EMP-012, EMP-013, EMP-017, EMP-018, MGR-014, MGR-023, MGR-026, MGR-027, EXEC-009, EXEC-016, EXEC-017, EXEC-018

### Block 6: Bulk Operations (5 stories) - Feature Flag: `BULK_OPS`
Mass updates, import/export.

**Stories**: ADMIN-007 (plus bulk features in other stories)

### Block 7: Permission Rules (3 stories) - Feature Flag: `PERMISSION_RULES`
Advanced RBAC, approval workflows.

**Stories**: EXEC-010, EXEC-015, ADMIN-006

---

## QUICK REFERENCE: BY PRIORITY

### P0 (Critical) - 30 stories
Must-have for launch.

### P1 (High) - 41 stories
Important for user experience.

### P2 (Medium) - 34 stories
Nice-to-have, BETA candidates.

---

## QUICK REFERENCE: BY SPRINT

### Completed (Week 1-4): 15 stories
CONS-001, CONS-002, CONS-003, CONS-004, CONS-005, CONS-006, EMP-001, EMP-002, MGR-001, MGR-002, MGR-003, EXEC-001, ADMIN-001, ADMIN-002

### Week 5 (Teams + Objectives): 12 stories
### Week 6 (Profile): 10 stories
### Week 7 (IAM Block): 5 stories
### Week 7.5 (AI Engine): 3 stories
### Week 8 (Goal Management): 12 stories
### Week 9 (Planning): 13 stories
### Week 10-12 (Integration, Analytics, Testing): 35 stories

---

## RELATED DOCUMENTATION

- **[BLOCK_DEPENDENCIES.md](./BLOCK_DEPENDENCIES.md)** - Data flow between blocks
- **[../user-journeys/](../user-journeys/)** - User journey documentation
- **[../strategy/MVP_STRATEGY_V5.md](../strategy/MVP_STRATEGY_V5.md)** - Modular block strategy
- **[../../3-DELIVERY/1-SPRINTS/](../../3-DELIVERY/1-SPRINTS/)** - Sprint plans

---

**Last Updated**: 2026-01-10
**Version**: 5.0.0
**Status**: PERSONA-BASED ORGANIZATION
**Next Update**: As stories progress
