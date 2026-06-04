# Manager (MGR) User Stories

---

**Document**: PERSONA_MGR_STORIES.md
**Version**: 1.0.0
**Last Updated**: 2026-01-10
**Persona**: Manager - Team Leader
**Total Stories**: 28
**Status**: 12 Complete, 8 Partial, 8 Not Started

---

## Persona Overview

**Role**: Manages team members, assigns work, tracks team performance
**Access Level**: Dashboard, Objectives, Assessment, Team, Planning, Profile
**Primary Goals**: Align team with objectives, assess capabilities, monitor progress
**Key Screens**: Team Management, Planning, Dashboard

---

## Story Status Summary

| Status | Count | Stories |
|--------|-------|---------|
| Complete | 12 | MGR-001 to MGR-008, MGR-012, MGR-013, MGR-015, MGR-016 |
| Partial | 8 | MGR-009, MGR-010, MGR-011, MGR-017-020, MGR-025 |
| Not Started | 8 | MGR-014, MGR-021-024, MGR-026, MGR-027 |

---

## Complete Stories

### MGR-001: Send Team Assessment Invitation

**Status**: COMPLETE
**Verified**: Sprint 9 Epic H confirmed full invitation system

**As a** manager
**I want to** send assessment invitations to my team members
**So that** I can evaluate team capabilities

**Implementation Reference**:
- Backend: `server/routes/invitations.js` - Full invitation system
- Frontend: `client/pages/assessment-creation-flow.html` (Sprint 9 redesign)
- Model: `server/models/Invitation.js`

**Acceptance Criteria** (All Met):
- [x] Select team members from team roster
- [x] Choose assessment template
- [x] Set due date
- [x] Send bulk invitations
- [x] Track invitation status

---

### MGR-002: View Team Assessment Progress

**Status**: COMPLETE
**Verified**: Dashboard + Assessment Hub show team status

**As a** manager
**I want to** see assessment completion status for my team
**So that** I can follow up with incomplete assessments

**Implementation Reference**:
- Backend: `server/routes/invitations.js` - sent-by-me endpoint
- Frontend: `client/pages/assessment-hub.html`

**Acceptance Criteria** (All Met):
- [x] Dashboard shows team assessment status
- [x] List of pending, in-progress, completed assessments
- [x] Send reminder to those not started
- [x] Due date countdown

---

### MGR-003: View Team SSI Results

**Status**: COMPLETE
**Verified**: `team-ssi-view.html` with full 12-block breakdown

**As a** manager
**I want to** view aggregated SSI results for my team
**So that** I can identify team strengths and weaknesses

**Implementation Reference**:
- Backend: `server/routes/assessments.js` - GET `/api/assessments/team/:company_id`
- Backend: `server/routes/assessments.js` - GET `/api/assessments/company/:companyId/team-breakdown`
- Frontend: `client/pages/team-ssi-view.html` (2,149 lines)
- Service: `server/services/UnifiedSSIScoringService.js`

**Acceptance Criteria** (All Met):
- [x] Team average for Speed, Strength, Intelligence
- [x] Comparison to company average
- [x] Individual member scores (anonymized option)
- [x] Export to PDF
- [x] Trigger OKR generation from results

---

### MGR-004: Create New Team

**Status**: COMPLETE
**Verified**: `POST /api/teams/create` endpoint functional

**As a** manager
**I want to** create a new team
**So that** I can organize my department

**Implementation Reference**:
- Backend: `server/routes/teams.js` - POST `/api/teams/create`
- Frontend: `client/pages/teams.html` (933 lines)
- Model: `server/models/Team.js`

**Acceptance Criteria** (All Met):
- [x] Team creation form with name, description
- [x] Set myself as team manager
- [x] Assign parent department (optional)
- [x] Team appears in company hierarchy

---

### MGR-005: Add Team Members

**Status**: COMPLETE
**Verified**: Team management API supports member operations

**As a** manager
**I want to** add members to my team
**So that** I can build my team roster

**Implementation Reference**:
- Backend: `server/routes/teams.js`
- Frontend: `client/pages/teams.html`

**Acceptance Criteria** (All Met):
- [x] Search existing users or invite new by email
- [x] Set role (Employee, Manager)
- [x] Bulk add via CSV import (if BULK_OPS enabled) - PARTIAL
- [x] Confirmation email sent to new members

---

### MGR-006: View Team List

**Status**: COMPLETE
**Verified**: Teams page shows full roster

**As a** manager
**I want to** view all my team members
**So that** I have a clear roster

**Implementation Reference**:
- Backend: `server/routes/teams.js`
- Frontend: `client/pages/teams.html`

**Acceptance Criteria** (All Met):
- [x] List view with name, role, email
- [x] Avatar display
- [x] Filter by role
- [x] Quick actions (message, view profile, remove)

---

### MGR-007: Remove Team Member

**Status**: COMPLETE
**Verified**: Team member removal supported in API

**As a** manager
**I want to** remove members from my team
**So that** I can keep the roster accurate

**Acceptance Criteria** (All Met):
- [x] Confirmation dialog before removal
- [x] Reassign their tasks to another member
- [x] Member's history preserved
- [x] Notification to removed member

---

### MGR-008: Track Objective Progress

**Status**: COMPLETE
**Verified**: Objectives page with full progress tracking

**As a** manager
**I want to** see progress on objectives my team is contributing to
**So that** I can ensure we're on track

**Implementation Reference**:
- Backend: `server/routes/objectives.js` - GET `/api/objectives/my-dashboard`
- Frontend: `client/pages/objectives.html`

**Acceptance Criteria** (All Met):
- [x] Dashboard widget showing team objectives
- [x] Progress bar for each objective/KR
- [x] Status indicators (on track, at risk, behind)
- [x] Drill down to see goal details

---

### MGR-012: View Team Dashboard

**Status**: COMPLETE
**Verified**: Manager dashboard fully functional

**As a** manager
**I want to** see a dashboard of my team's activity
**So that** I have real-time visibility

**Implementation Reference**:
- Backend: `server/routes/dashboard.js` - Multiple endpoints
- Frontend: `client/pages/manager-dashboard.html`
- Frontend: `client/pages/team-performance-dashboard.html`

**Acceptance Criteria** (All Met):
- [x] Overview of team goals and progress
- [x] Activity feed of recent updates
- [x] At-risk indicators
- [x] Quick links to team members

---

### MGR-013: Monitor Team Tasks

**Status**: COMPLETE
**Verified**: Team tasks visible through planning and dashboard

**As a** manager
**I want to** see all tasks across my team
**So that** I can ensure work is progressing

**Implementation Reference**:
- Backend: `server/routes/planning.js`
- Frontend: `client/pages/planning.html`
- Frontend: `client/pages/team-tasks.html`

**Acceptance Criteria** (All Met):
- [x] List all team tasks with assignee
- [x] Filter by status, due date, assignee
- [x] Kanban view option
- [ ] Bulk reassignment (BULK_OPS - not enabled)

---

### MGR-015: Assign Goals to Team

**Status**: COMPLETE
**Verified**: Goals API supports assignment

**As a** manager
**I want to** assign goals to team members
**So that** everyone knows their responsibilities

**Implementation Reference**:
- Backend: `server/routes/goals.js` - POST with owner assignment
- Backend: `server/routes/planning.js`

**Acceptance Criteria** (All Met):
- [x] Select goal from team's objectives
- [x] Choose assignee(s)
- [x] Set individual targets/weights
- [x] Notification sent to assignees
- [x] Goal appears on assignee dashboard

---

### MGR-016: Create Team Goals

**Status**: COMPLETE
**Verified**: Planning routes support quarterly/weekly goal creation

**As a** manager
**I want to** create quarterly and weekly goals for my team
**So that** we have clear targets

**Implementation Reference**:
- Backend: `server/routes/goals.js` - POST `/api/goals/`
- Backend: `server/routes/planning.js`
- Model: `server/models/Goal.js`

**Acceptance Criteria** (All Met):
- [x] Create quarterly goal linked to key result
- [x] Set target metric and due date
- [x] Break into weekly goals
- [x] Assign to team members

---

## Partial Stories

### MGR-009: Update Team Info

**Status**: PARTIAL
**Gap**: Basic update exists, missing team avatar and history log

**As a** manager
**I want to** edit my team's information
**So that** I can keep details current

**What Exists**:
- Team name/description update
- Parent department assignment

**What's Missing**:
- Team avatar upload
- Team history log

---

### MGR-010: View Team Member Profiles

**Status**: PARTIAL
**Gap**: User info exists but no dedicated profile page

**As a** manager
**I want to** view profiles of my team members
**So that** I understand their capabilities

**What Exists**:
- User data in team list
- Assessment scores accessible

**What's Missing**:
- Dedicated profile page for employees
- Consolidated view of assignments + scores + completion rate

---

### MGR-011: Update Profile Info

**Status**: PARTIAL
**Gap**: Company profile exists, personal profile limited

**As a** manager
**I want to** update my own profile
**So that** my team has current information

**What Exists**:
- Password change
- Basic user update

**What's Missing**:
- Profile photo upload
- Notification preferences UI
- Bio field

---

### MGR-017: Create Tasks from Goals

**Status**: PARTIAL
**Gap**: Task creation via planning, missing direct goal-to-task UI

**As a** manager
**I want to** break goals into tasks
**So that** work is actionable

**What Exists**:
- AI-generated weekly plans with tasks
- Task model in Goal cascade

**What's Missing**:
- Manual task creation UI under goal

---

### MGR-018: Link Tasks to Goals

**Status**: PARTIAL
**Gap**: Implicit linking exists, missing explicit link UI

**As a** manager
**I want to** link existing tasks to goals
**So that** all work is connected to objectives

---

### MGR-019: Track Goal Progress

**Status**: PARTIAL
**Gap**: Progress visible but filter by assignee needs work

**As a** manager
**I want to** see progress on all team goals
**So that** I know where we stand

---

### MGR-020: Update Goal Status

**Status**: PARTIAL
**Gap**: Status field exists, needs manual override UI

**As a** manager
**I want to** update goal status manually
**So that** I can override calculated progress when needed

---

### MGR-025: View Team Assessment Health

**Status**: PARTIAL
**Verified**: Team SSI view has comparison but missing health tab

**As a** manager
**I want to** view my team's assessment scores and compare to company average
**So that** I can identify capability gaps and plan training

**What Exists**:
- Team average vs company average comparison
- Radar chart visualization
- Sub-dimension breakdown

**What's Missing**:
- Dedicated "Assessment Health" tab
- AI-recommended training actions
- Historical trend line

---

## Not Started Stories

### MGR-014: Task Notifications

**Status**: NOT STARTED

**As a** manager
**I want to** receive notifications about team task updates
**So that** I stay informed

---

### MGR-021: Create Quarterly Plans

**Status**: NOT STARTED
**Sprint Reference**: Sprint 11 - Epic L Planning Redesign

**As a** manager
**I want to** create quarterly plans for my team
**So that** we have structured targets for the quarter

---

### MGR-022: Allocate Weekly Goals

**Status**: NOT STARTED
**Sprint Reference**: Sprint 11 - Epic L

**As a** manager
**I want to** break quarterly goals into weekly goals
**So that** progress is trackable week by week

---

### MGR-023: Assign Team Capacity

**Status**: NOT STARTED

**As a** manager
**I want to** track team capacity allocation
**So that** I don't overcommit my team

---

### MGR-024: Review Team Planning

**Status**: NOT STARTED
**Sprint Reference**: Sprint 11 - Epic L

**As a** manager
**I want to** review and adjust team plans
**So that** plans stay realistic

---

### MGR-026: Intervention Workflow (Automated Alerts)

**Status**: NOT STARTED

**As a** manager
**I want to** receive automated alerts when team members are at risk
**So that** I can intervene early and prevent failures

---

### MGR-027: Generate Weekly Roll-up Report [BETA]

**Status**: NOT STARTED - BETA Feature

**As a** manager
**I want to** automatically generate weekly team progress reports
**So that** I can share updates with executives efficiently

---

## Implementation Priority

**Immediate (Current Sprints)**:
1. Complete partial stories (MGR-009 to MGR-020)
2. MGR-025 health tab enhancement

**Near-term (Sprint 11)**:
3. MGR-021, MGR-022, MGR-024 - Planning features
4. MGR-014 - Notifications

**Future (Post-MVP)**:
5. MGR-023 - Capacity tracking
6. MGR-026, MGR-027 - Advanced features

---

**Last Updated**: 2026-01-10
**Audit Source**: Codebase analysis + Sprint 9 Handoff
