# Employee (EMP) User Stories

---

**Document**: PERSONA_EMP_STORIES.md
**Version**: 1.0.0
**Last Updated**: 2026-01-10
**Persona**: Employee - Individual Contributor
**Total Stories**: 18
**Status**: 4 Complete, 5 Partial, 9 Not Started

---

## Persona Overview

**Role**: Team member focused on personal goals and tasks
**Access Level**: Dashboard, Objectives (assigned), Assessment, Team, Profile
**Primary Goals**: Complete tasks, track progress, understand SSI scores
**Key Screens**: Dashboard, Assessment Results, Objectives

---

## Story Status Summary

| Status | Count | Stories |
|--------|-------|---------|
| Complete | 4 | EMP-001, EMP-002, EMP-004, EMP-007 |
| Partial | 5 | EMP-008, EMP-009, EMP-010, EMP-014, EMP-015 |
| Not Started | 9 | EMP-005, EMP-006, EMP-011, EMP-012, EMP-013, EMP-016, EMP-017, EMP-018 |

---

## Complete Stories

### EMP-001: Take Assessment

**Status**: COMPLETE
**Verified**: Code audit confirms `server/routes/assessments.js` has full implementation

**As an** employee
**I want to** complete an assigned assessment
**So that** I can contribute my perspective to team evaluation

**Implementation Reference**:
- Backend: `server/routes/assessments.js` - POST `/api/assessments/submit`, POST `/api/assessments/:id/submit-responses`
- Frontend: `client/pages/assessment-take.html`
- Model: `server/models/Assessment.js`

**Acceptance Criteria** (All Met):
- [x] Receive email invitation with unique link
- [x] Click link opens assessment page with template questions
- [x] Questions grouped by dimension (Speed, Strength, Intelligence)
- [x] Each question has 1-10 rating scale
- [x] Progress bar shows completion percentage
- [x] Can save draft and resume later
- [x] Submit button active only when all questions answered
- [x] Confirmation page shows "Assessment submitted successfully"

---

### EMP-002: View Assessment Results

**Status**: COMPLETE
**Verified**: `GET /api/assessments/:id/results` and `GET /api/assessments/:id/detailed-results` implemented

**As an** employee
**I want to** view my individual assessment results
**So that** I can understand my Speed/Strength/Intelligence scores

**Implementation Reference**:
- Backend: `server/routes/assessments.js` - 2 results endpoints
- Frontend: `client/pages/assessment-results.html`
- Service: `server/services/UnifiedSSIScoringService.js`

**Acceptance Criteria** (All Met):
- [x] Results page shows 3 scores with visual rings (Speed, Strength, Intelligence)
- [x] Each score displayed as X/10 with percentage
- [x] Color coding: Green (8-10), Yellow (6-7.9), Red (<6)
- [x] Dimension breakdown shows sub-scores
- [x] Can download results as PDF
- [x] "Back to Dashboard" button navigates to home

---

### EMP-004: View My Objectives

**Status**: COMPLETE
**Verified**: `GET /api/objectives/list` and objectives.html fully functional

**As an** employee
**I want to** view objectives assigned to me
**So that** I understand my priorities and how my work aligns with company goals

**Implementation Reference**:
- Backend: `server/routes/objectives.js` - GET `/api/objectives/`, GET `/api/objectives/list`
- Frontend: `client/pages/objectives.html` (1,365 lines of JavaScript)
- Model: `server/models/Objective.js`

**Acceptance Criteria** (All Met):
- [x] View list of objectives I'm assigned to
- [x] See my key results within each objective
- [x] View progress percentage for each item
- [x] Filter by status (active, completed, at-risk)
- [x] Click objective to see full details and my tasks

---

### EMP-007: View Assessment History

**Status**: COMPLETE
**Verified**: `GET /api/assessments/my-assessments` endpoint exists

**As an** employee
**I want to** view my past assessment results
**So that** I can track my improvement over time

**Implementation Reference**:
- Backend: `server/routes/assessments.js` - GET `/api/assessments/my-assessments`
- Analytics: `server/routes/analytics.js` - SSI trend endpoints

**Acceptance Criteria** (All Met):
- [x] List all assessments I've completed
- [x] Show date, template name, overall score for each
- [x] Click to see detailed breakdown
- [x] Trend chart comparing scores across assessments
- [x] Export history to PDF

---

## Partial Stories (Backend Ready, Frontend Incomplete)

### EMP-008: View Daily Tasks

**Status**: PARTIAL
**Gap**: Dashboard exists but dedicated daily task view needs enhancement

**As an** employee
**I want to** see my tasks for today
**So that** I can focus on what needs to be done

**What Exists**:
- Dashboard page: `client/pages/dashboard.html`
- Dashboard endpoints: `server/routes/dashboard.js`
- Task model: `server/models/Task.js` (implicit in Goal cascade)

**What's Missing**:
- Dedicated "Today's Tasks" widget
- Priority indicator UI
- Quick complete action
- Overdue highlighting

**Sprint Reference**: Sprint 8 Dashboard Redesign (US-S8-D1)

---

### EMP-009: Complete Task

**Status**: PARTIAL
**Gap**: Goal/Task completion exists but one-click UX incomplete

**As an** employee
**I want to** mark tasks as complete
**So that** my progress is tracked accurately

**What Exists**:
- Goal progress update endpoint
- Planning page with goal management

**What's Missing**:
- One-click complete button
- Completion animation
- Undo functionality
- Manager notification on completion

**Sprint Reference**: Sprint 8 Dashboard Redesign (US-S8-D3)

---

### EMP-010: Update Task Progress

**Status**: PARTIAL
**Gap**: Progress update exists on planning page, needs dashboard integration

**As an** employee
**I want to** update my task progress incrementally
**So that** my manager has visibility into my work

**What Exists**:
- Progress update via planning routes
- Goal model with progress field

**What's Missing**:
- Dashboard progress slider
- Progress notes field
- Progress history view

**Sprint Reference**: Sprint 8 Dashboard Redesign (US-S8-D4)

---

### EMP-014: View My Goals

**Status**: PARTIAL
**Gap**: Backend ready, frontend pages incomplete

**As an** employee
**I want to** see the goals I'm contributing to
**So that** I understand my quarterly and weekly targets

**What Exists**:
- Backend: `server/routes/goals.js` with filtering
- Backend: `server/routes/planning.js` for quarterly/weekly goals
- Frontend: `client/pages/quarterly-goals.html` (exists, status unclear)
- Frontend: `client/pages/weekly-goals.html` (exists, status unclear)

**What's Missing**:
- Verified functional quarterly goals page
- Verified functional weekly goals page
- Goal-to-task relationship display

---

### EMP-015: Update Goal Progress

**Status**: PARTIAL
**Gap**: API exists, frontend integration incomplete

**As an** employee
**I want to** update progress on my goals
**So that** my manager sees accurate status

**What Exists**:
- PUT `/api/objectives/:objectiveId/progress` endpoint
- Goal progress calculation

**What's Missing**:
- Dedicated progress update UI on goals pages
- Progress notes integration
- Automatic cascade to parent

---

## Not Started Stories

### EMP-005: View My Profile

**Status**: NOT STARTED

**As an** employee
**I want to** view my profile information
**So that** I can verify my details are correct

**Notes**: Company profile exists but no dedicated employee profile page.

---

### EMP-006: Upload Avatar

**Status**: NOT STARTED

**As an** employee
**I want to** upload my profile picture
**So that** my teammates can recognize me

---

### EMP-011: View Task History

**Status**: NOT STARTED

**As an** employee
**I want to** view my completed tasks
**So that** I can track what I've accomplished

---

### EMP-012: Daily Reflection

**Status**: NOT STARTED

**As an** employee
**I want to** log a quick daily reflection
**So that** I can track my learnings and blockers

---

### EMP-013: Task Reminders

**Status**: NOT STARTED

**As an** employee
**I want to** receive reminders for upcoming tasks
**So that** I don't miss deadlines

---

### EMP-016: View "Why Chain" Context

**Status**: NOT STARTED
**Priority**: P0 (Critical for employee motivation)

**As an** employee
**I want to** see how my task connects to company objectives
**So that** I understand the impact of my work and stay motivated

**Sprint Reference**: Sprint 8 Dashboard Redesign (US-S8-D2)

---

### EMP-017: Business Impact Metric [BETA]

**Status**: NOT STARTED - BETA Feature

**As an** employee
**I want to** see a calculated "Business Impact Score" for my work
**So that** I can understand my contribution to company success

---

### EMP-018: Recognition Notifications [BETA]

**Status**: NOT STARTED - BETA Feature

**As an** employee
**I want to** receive recognition when my tasks contribute to achieved goals
**So that** I feel valued and motivated

---

## Implementation Priority

**Immediate (Sprint 8)**:
1. EMP-008, EMP-009, EMP-010, EMP-016 - Dashboard redesign
2. EMP-014, EMP-015 - Goals pages completion

**Near-term (Sprint 10-11)**:
3. EMP-005, EMP-006 - Profile features
4. EMP-011, EMP-012, EMP-013 - Task management enhancements

**Future (Post-MVP)**:
5. EMP-017, EMP-018 - BETA gamification features

---

**Last Updated**: 2026-01-10
**Audit Source**: Codebase analysis + Sprint 9 Handoff
