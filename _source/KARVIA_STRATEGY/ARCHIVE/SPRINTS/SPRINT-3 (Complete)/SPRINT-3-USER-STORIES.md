# 📖 Sprint 3: User Stories & Acceptance Criteria

## Story Point Estimation
- **Total Story Points**: 55
- **Velocity Target**: 27.5 points/week
- **Complexity**: High
- **Risk**: Medium

---

## 🎯 Epic 1: Flexible Date Management System (21 Points)

### OWNER-S3-001: Fiscal Year Objective Creation
**As a** Business Owner
**I want to** set my objectives based on my fiscal year (April-March)
**So that** they align with my financial planning cycle

**Story Points**: 8
**Priority**: P0 (CRITICAL)

**Acceptance Criteria**:
- ✅ Can select "Fiscal Year" as time period type
- ✅ Can choose fiscal year start month (April, July, October)
- ✅ Dates automatically calculate based on selection
- ✅ All child goals inherit fiscal year boundaries
- ✅ Existing calendar year objectives still work

**Technical Tasks**:
1. Update Objective model with time_period_type field
2. Add fiscal_year_start_month field
3. Create DateService.calculateFiscalYear() method
4. Update frontend with fiscal year selector
5. Add date preview in UI

**Test Scenarios**:
- Create April-March fiscal year objective
- Verify Q1 = Apr-Jun, Q2 = Jul-Sep, etc.
- Create goal in Q4, verify it's Jan-Mar
- Change from calendar to fiscal year

---

### OWNER-S3-002: Multi-Year Strategic Objectives
**As a** Business Owner
**I want to** create 18-month strategic objectives
**So that** I can plan beyond annual cycles

**Story Points**: 5
**Priority**: P0

**Acceptance Criteria**:
- ✅ Can select "Custom Period" as time period type
- ✅ Can set any start and end date
- ✅ System calculates duration in months
- ✅ Quarters distribute evenly across period
- ✅ Warning shown if period > 36 months

**Technical Tasks**:
1. Add duration_months field to Objective model
2. Create custom date picker component
3. Implement quarter distribution algorithm
4. Add validation for date ranges
5. Create migration for existing objectives

---

### OWNER-S3-003: Automatic Date Cascade
**As a** Business Owner
**I want** all child dates to update when I change objective dates
**So that** I don't have to manually update each goal and task

**Story Points**: 8
**Priority**: P0

**Acceptance Criteria**:
- ✅ Changing objective dates triggers cascade
- ✅ All child goals shift proportionally
- ✅ Tasks redistribute within new week boundaries
- ✅ Conflicts are highlighted before saving
- ✅ Can preview changes before applying

**Technical Tasks**:
1. Create DateService.cascadeDateChanges() method
2. Implement proportional date distribution
3. Add conflict detection algorithm
4. Create preview UI component
5. Add bulk update transaction

---

## 🎯 Epic 2: Goal Management UI (13 Points)

### MGR-S3-001: Quarterly Goal Creation Interface
**As a** Manager
**I want to** create quarterly goals from objectives
**So that** I can break down annual objectives into manageable chunks

**Story Points**: 5
**Priority**: P0

**Acceptance Criteria**:
- ✅ Can view objectives and their key results
- ✅ Can create quarterly goal for each KR
- ✅ Can set target values for quarter
- ✅ Can assign goal owner
- ✅ Progress automatically calculated

**Technical Tasks**:
1. Create quarterly-goals.html page
2. Build quarterly-goals.js controller
3. Create goals-api-client.js service
4. Add goal creation modal
5. Implement progress calculation

**Files to Create**:
- `client/pages/quarterly-goals.html` (~400 lines)
- `client/pages/scripts/quarterly-goals.js` (~350 lines)
- `client/js/goals-api-client.js` (~300 lines)

---

### MGR-S3-002: Weekly Milestone Management
**As a** Manager
**I want to** break quarterly goals into weekly milestones
**So that** my team has clear short-term targets

**Story Points**: 5
**Priority**: P0

**Acceptance Criteria**:
- ✅ Can create weekly goals from quarterly goals
- ✅ Weeks automatically calculated (13 per quarter)
- ✅ Can assign different owners to each week
- ✅ Progress rolls up to quarterly goal
- ✅ Can bulk create weekly goals

**Technical Tasks**:
1. Create weekly-goals.html page
2. Build weekly-goals.js controller
3. Add week selector component
4. Implement bulk creation logic
5. Add rollup calculation

**Files to Create**:
- `client/pages/weekly-goals.html` (~300 lines)
- `client/pages/scripts/weekly-goals.js` (~300 lines)

---

### MGR-S3-003: Goal Assignment Workflow
**As a** Manager
**I want to** assign goals to team members
**So that** everyone knows their responsibilities

**Story Points**: 3
**Priority**: P0

**Acceptance Criteria**:
- ✅ Can search and select team members
- ✅ Can assign multiple contributors to one goal
- ✅ Can set role (lead, contributor, reviewer)
- ✅ Assignees receive notification
- ✅ Can bulk assign to team

**Technical Tasks**:
1. Create assignment modal component
2. Add user search functionality
3. Implement role selection
4. Add notification trigger
5. Create bulk assignment logic

---

## 🎯 Epic 3: Employee Dashboard (8 Points)

### EMP-S3-001: Daily Task View
**As an** Employee
**I want to** see my tasks for today when I log in
**So that** I know what to focus on

**Story Points**: 3
**Priority**: P0

**Acceptance Criteria**:
- ✅ Dashboard shows today's tasks first
- ✅ Tasks sorted by priority
- ✅ Overdue tasks highlighted in red
- ✅ Can mark tasks complete from dashboard
- ✅ Progress updates parent goal

**Technical Tasks**:
1. Create employee-dashboard.html
2. Build employee-dashboard.js controller
3. Add task list component
4. Implement quick complete feature
5. Add progress sync logic

**Files to Create**:
- `client/pages/employee-dashboard.html` (~500 lines)
- `client/pages/scripts/employee-dashboard.js` (~400 lines)

---

### EMP-S3-002: Why Chain Context
**As an** Employee
**I want to** understand why each task matters
**So that** I stay motivated and aligned

**Story Points**: 3
**Priority**: P1

**Acceptance Criteria**:
- ✅ Each task shows parent goal
- ✅ Goal shows parent objective
- ✅ Objective shows company mission link
- ✅ Can expand to see full chain
- ✅ Visual hierarchy displayed

**Technical Tasks**:
1. Create WhyChain component
2. Add recursive parent fetching
3. Build expandable UI widget
4. Add visual hierarchy display
5. Cache chain data for performance

---

### EMP-S3-003: Quick Progress Updates
**As an** Employee
**I want to** update task progress without leaving dashboard
**So that** I can stay focused on work

**Story Points**: 2
**Priority**: P0

**Acceptance Criteria**:
- ✅ Progress slider on each task
- ✅ Can add quick comment
- ✅ Updates save automatically
- ✅ Parent goal progress updates
- ✅ Undo option for 5 seconds

**Technical Tasks**:
1. Create progress slider component
2. Add auto-save functionality
3. Implement optimistic updates
4. Add undo mechanism
5. Create sync queue for offline

---

## 🎯 Epic 4: Business Management API (8 Points)

### CONSULT-S3-001: Multi-Business Management
**As a** Consultant
**I want to** manage multiple client businesses
**So that** I can provide OKR services efficiently

**Story Points**: 5
**Priority**: P0

**Acceptance Criteria**:
- ✅ Can switch between businesses
- ✅ Each business completely isolated
- ✅ Can view cross-business analytics
- ✅ Single login for all businesses
- ✅ Business selector in header

**Technical Tasks**:
1. Create GET /api/businesses/:id endpoint
2. Create PUT /api/businesses/:id endpoint
3. Add business switcher component
4. Implement session management
5. Add cross-business analytics

**Endpoints to Create**:
```
GET    /api/businesses/:id
PUT    /api/businesses/:id
DELETE /api/businesses/:id
GET    /api/businesses/:id/users
GET    /api/businesses/:id/teams
GET    /api/businesses/:id/stats
```

---

### CONSULT-S3-002: Business Isolation
**As a** Consultant
**I want** complete data isolation between businesses
**So that** client data remains secure and private

**Story Points**: 3
**Priority**: P0

**Acceptance Criteria**:
- ✅ No data leaks between businesses
- ✅ All queries filtered by business_id
- ✅ Cannot access other business data via API
- ✅ Audit log of all access attempts
- ✅ Business data completely separate

**Technical Tasks**:
1. Add business_id validation middleware
2. Update all queries with business filter
3. Add audit logging
4. Implement row-level security
5. Add integration tests

---

## 🎯 Epic 5: Task Management UI Completion (5 Points)

### EMP-S3-004: Task Creation Interface
**As an** Employee
**I want to** create tasks from my goals
**So that** I can break down work into actionable items

**Story Points**: 3
**Priority**: P1

**Acceptance Criteria**:
- ✅ Can create task from goal details page
- ✅ Task inherits goal dates
- ✅ Can set estimated hours
- ✅ Can add subtasks
- ✅ Can attach files

**Technical Tasks**:
1. Create task creation modal
2. Add file upload component
3. Build subtask manager
4. Add hours estimation
5. Implement validation

---

### EMP-S3-005: Task Assignment Flow
**As a** Manager
**I want to** assign tasks to team members
**So that** work is distributed effectively

**Story Points**: 2
**Priority**: P1

**Acceptance Criteria**:
- ✅ Can assign task to any team member
- ✅ Can change assignment
- ✅ Assignee gets notification
- ✅ Can bulk assign tasks
- ✅ Workload visualization

**Technical Tasks**:
1. Create assignment interface
2. Add workload calculation
3. Build notification system
4. Add bulk operations
5. Create workload chart

---

## 📊 Story Summary by Priority

### P0 - MUST HAVE (Production Blockers)
- 9 stories
- 41 story points
- Must complete for launch

### P1 - SHOULD HAVE
- 4 stories
- 14 story points
- Highly desirable for launch

### P2 - NICE TO HAVE
- 0 stories
- 0 story points
- Deferred to Sprint 4

---

## 🧪 Testing Requirements

### Unit Tests Required
- DateService: 15 test cases
- Goal UI Controllers: 20 test cases
- Business API: 10 test cases
- Dashboard Components: 12 test cases

### Integration Tests Required
- Date cascade flow: 5 scenarios
- Goal creation flow: 8 scenarios
- Multi-business flow: 6 scenarios
- Task assignment flow: 4 scenarios

### E2E Tests Required
- Business owner creates fiscal year objective
- Manager creates and assigns quarterly goals
- Employee completes daily tasks
- Consultant switches between businesses

---

## 📝 Documentation Requirements

### User Documentation
- How to set fiscal year
- Goal creation guide
- Dashboard overview
- Why Chain explanation

### Technical Documentation
- DateService API
- Business API endpoints
- Goal UI components
- Migration guide

---

## ✅ Definition of Ready

Each story is ready when:
1. ✅ Acceptance criteria defined
2. ✅ Technical tasks identified
3. ✅ Dependencies resolved
4. ✅ Test cases written
5. ✅ UI mockups available

---

## ✅ Definition of Done

Each story is done when:
1. ✅ All acceptance criteria met
2. ✅ Code reviewed and merged
3. ✅ Unit tests passing (>80% coverage)
4. ✅ Integration tests passing
5. ✅ Documentation updated
6. ✅ No P0 or P1 bugs
7. ✅ Deployed to staging
8. ✅ Product owner approved

---

**Total Sprint 3 Commitment**: 55 story points across 13 user stories
**Must Complete (P0)**: 41 points (75% of sprint)
**Stretch Goals (P1)**: 14 points (25% of sprint)