# 🚀 Sprint 2: Goal Management & Task Execution Flow

**Sprint Duration**: 10 Days (Nov 17-28, 2025)
**Sprint Goal**: Complete Goal Management frontend + Task UI + Employee Dashboard for full execution chain
**Status**: 🔴 Not Started
**Version**: 1.0.0
**Created**: November 12, 2025

---

## 📊 Sprint Overview

### **Goal Statement**
Complete the missing execution layer by building Goal Management UI (frontend for existing backend), Task Management UI (30% → 100%), and Employee Dashboard so users can manage the complete OKR cascade: Objectives → Goals → Tasks.

### **Success Criteria**
- ✅ Goal Management UI complete (quarterly + weekly goals pages)
- ✅ Task Management UI enhanced to 100% (creation, assignment, progress)
- ✅ Employee Dashboard built (daily task view + progress tracking)
- ✅ Complete execution chain works: Create Objective → Break into Goals → Create Tasks → Track Progress
- ✅ All "Why Chain" lineage visible (Task → Goal → Objective → Assessment)
- ✅ All critical gaps from Sprint 1 addressed
- ✅ Zero P0 bugs remaining

### **Sprint 1 Completion Summary**
Sprint 1 delivered **85% completion** (Day 6 Complete - Nov 6, 2025):
- ✅ Company invitation automation (Day 1-3)
- ✅ "Send to Company" UI (Day 4)
- ✅ Password setting flow (Day 5)
- ✅ Share with Teams modal (Day 6)
- ✅ Team results backend API (Day 7)
- 🟡 Team results frontend (Day 8 - 70% complete, missing heatmap interactivity)
- ✅ OKR generation integration (Day 9)

**Carried Forward to Sprint 2**:
- Fix ISS-S1D8-001: Change Manager dropdown (P3 - Low)
- Fix ISS-S1D8-002: Timeline status "At Risk" issue (P2 - Medium)
- Fix ISS-S1D8-003: Target year should be user input (P2 - Medium)

---

## 🎯 Sprint 2 Scope

### **Critical Gaps from Audit (All P0)**

1. **ISS-AUDIT-001: Goal Management UI Missing** (PRIORITY #1)
   - Backend: 100% complete (11 endpoints, 576 lines)
   - Frontend: 0% complete (8 files missing, ~2,050 lines)
   - Impact: BLOCKS manager planning workflows
   - Timeline: Days 1-5 (5 days)

2. **ISS-AUDIT-003: Employee Dashboard Missing** (PRIORITY #2)
   - Backend: Reuses existing task APIs
   - Frontend: 0% complete
   - Impact: BLOCKS employee daily workflow
   - Timeline: Days 6-7 (2 days)

3. **ISS-AUDIT-004: Task Management UI 30% Complete** (PRIORITY #3)
   - Backend: 100% complete (13 endpoints)
   - Frontend: Basic list exists, missing creation/assignment/progress
   - Impact: Limited task interaction
   - Timeline: Days 8-9 (2 days)

4. **Business/Company Management API** (DEFERRED - Sprint 3)
   - Only 2 stub endpoints exist
   - Need 6+ more endpoints
   - Timeline: Sprint 3 (not blocking execution flow)

### **In Scope - Priority Order**

1. **Goal Management Frontend** (Days 1-5) - P0 CRITICAL
   - Quarterly goals page (Day 1-2)
   - Weekly goals page (Day 3)
   - Goal details page (Day 4)
   - Goals API client (Day 5)
   - Progress rollup automation

2. **Employee Dashboard** (Days 6-7) - P0 CRITICAL
   - Daily task view
   - Progress tracking widgets
   - My goals summary
   - Quick actions (complete task, update progress)

3. **Task Management UI Completion** (Days 8-9) - P0 CRITICAL
   - Task creation from goals
   - Task assignment workflow
   - Progress update interface
   - Task filters and sorting

4. **Integration & Polish** (Day 10) - P0 CRITICAL
   - Cross-page navigation testing
   - "Why Chain" lineage verification
   - Bug fixes from Sprint 1
   - Performance optimization

### **Out of Scope** (Sprint 3+)
- ❌ Business/Company Management API (Sprint 3)
- ❌ Advanced analytics dashboard (Sprint 3)
- ❌ Planning screen (Sprint 3-4)
- ❌ Mobile responsive design (Post-MVP)
- ❌ Real-time collaboration (Post-MVP)
- ❌ Export to PDF/CSV (Post-MVP)

---

## 📅 Sprint Timeline (10 Days)

### **Phase 1: Goal Management Frontend (Days 1-5)**

#### **Day 1: Quarterly Goals Page - List View**
**Date**: Nov 17, 2025
**Owner**: Frontend Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Create `client/pages/quarterly-goals.html` (~400 lines)
- [ ] Build goals list with quarterly grouping
- [ ] Display: Goal title, progress bar, owner, status, due date
- [ ] Add filters: Quarter, Owner, Status (All/On Track/At Risk/Completed)
- [ ] "Create Goal" button (opens creation modal)
- [ ] Integrate with existing layout and navigation

**Deliverables**:
- Quarterly goals page with list view
- Filters working
- Responsive design
- Loading states

**API Used**: `GET /api/goals` (existing)
**Screen Reference**: Create new based on [objectives.html](../../../../client/pages/objectives.html) pattern

---

#### **Day 2: Quarterly Goals - Creation & Detail (ENHANCED: Hybrid Cascading)**
**Date**: Nov 18, 2025
**Owner**: Frontend Dev
**Effort**: 10 hours (+2 hours for cascading logic)

**⭐ CRITICAL**: Implements **Hybrid Goal Cascading** approach (see [GOAL_CASCADING_ARCHITECTURE.md](./GOAL_CASCADING_ARCHITECTURE.md))

**Tasks**:
- [ ] **Path A: Create from Key Result (Recommended)**
  - Add "Create from KR" button on objectives page
  - Build auto-breakdown modal with strategies:
    - Equal division (continuous metrics)
    - Weighted growth (sales curve)
    - Custom targets (manual input)
    - Manual (no auto-breakdown)
  - Implement `POST /api/objectives/:id/key-results/:krId/breakdown` API
  - Auto-create 1-4 quarterly goals based on strategy

- [ ] **Path B: Create from Objective (Flexible)**
  - Build "Create Goal" modal in `quarterly-goals.html`
  - Goal title (required)
  - Description (optional)
  - Parent Objective selector (dropdown)
  - **Key Result selector** (dropdown, optional but recommended)
  - Owner selector (team members)
  - Quarter selector (Q1-Q4)
  - Target value (number)
  - Unit (%, $, count, etc.)
  - **Warning badge** if no KR link selected

- [ ] Form validation for both paths
- [ ] Call `POST /api/goals` API (enhanced with `key_result_id` field)
- [ ] Success/error handling
- [ ] Update list after creation
- [ ] Test both cascading paths

**Deliverables**:
- Auto-breakdown modal (Path A)
- Manual goal creation modal (Path B)
- Dual-path creation workflow
- KR-based cascading logic
- Form validation
- API integration (new endpoint + enhanced existing)
- Success feedback with warnings

**API Used**:
- `POST /api/objectives/:id/key-results/:krId/breakdown` (NEW)
- `POST /api/goals` (enhanced with `key_result_id`)
- `GET /api/objectives` (for parent selector)
- `GET /api/objectives/:id/key-results` (for KR dropdown)
- `GET /api/teams/:id/members` (for owner selector)

**Reference**: See detailed specs in [GOAL_CASCADING_ARCHITECTURE.md](./GOAL_CASCADING_ARCHITECTURE.md)

---

#### **Day 3: Weekly Goals Page**
**Date**: Nov 19, 2025
**Owner**: Frontend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] Create `client/pages/weekly-goals.html` (~300 lines)
- [ ] Build weekly goals list with week grouping
- [ ] Display: Goal title, progress, tasks count, due date
- [ ] Parent quarterly goal breadcrumb
- [ ] "Create Weekly Goal" button
- [ ] Link to task creation: "Add Tasks" button per goal
- [ ] Quick progress update (inline edit)

**Deliverables**:
- Weekly goals page
- Week-based grouping
- Quick actions
- Parent goal breadcrumb

**API Used**: `GET /api/goals?type=weekly` (existing)

---

#### **Day 4: Goal Details Page**
**Date**: Nov 20, 2025
**Owner**: Frontend Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Create `client/pages/goal-details.html` (~300 lines)
- [ ] Display full goal information
- [ ] Progress visualization (circular progress)
- [ ] Child goals list (if quarterly goal)
- [ ] Tasks list (if weekly goal)
- [ ] Activity timeline
- [ ] Edit goal button
- [ ] Delete goal button (with confirmation)
- [ ] "Create Task from Goal" button

**Deliverables**:
- Goal details page
- Progress visualization
- Child/task relationships
- Edit/delete actions

**API Used**:
- `GET /api/goals/:id` (existing)
- `GET /api/goals/:id/children` (existing)
- `GET /api/goals/:id/tasks` (existing)
- `PUT /api/goals/:id` (existing)
- `DELETE /api/goals/:id` (existing)

---

#### **Day 5: Goals API Client & Integration**
**Date**: Nov 21, 2025
**Owner**: Frontend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] Create `client/js/goals-api-client.js` (~300 lines)
- [ ] Implement all API methods:
  - `getGoals(filters)` - List goals
  - `getGoalById(id)` - Get single goal
  - `createGoal(data)` - Create new goal
  - `updateGoal(id, data)` - Update goal
  - `deleteGoal(id)` - Delete goal
  - `getChildren(id)` - Get child goals
  - `getTasks(id)` - Get goal tasks
  - `updateProgress(id, progress)` - Update progress
- [ ] Create `client/pages/scripts/goals-controller.js` (~400 lines)
- [ ] Error handling and retries
- [ ] Test all CRUD operations

**Deliverables**:
- Goals API client
- Controller scripts
- Error handling
- Integration tests

**Code References**:
- Pattern: [objectives-api-client.js](../../../../client/js/objectives-api-client.js)
- Pattern: [team-api-client.js](../../../../client/js/team-api-client.js)

---

### **Phase 2: Employee Dashboard (Days 6-7)**

#### **Day 6: Employee Dashboard - Core Layout**
**Date**: Nov 22, 2025 (Friday)
**Owner**: Frontend Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Create `client/pages/employee-dashboard.html` (~400 lines)
- [ ] Build dashboard layout with sections:
  - Section 1: Today's Tasks (kanban-style)
  - Section 2: My Goals Progress (summary cards)
  - Section 3: Recent Activity (timeline)
  - Section 4: Quick Stats (cards)
- [ ] Today's Tasks section:
  - Columns: To Do, In Progress, Completed
  - Drag-and-drop (optional, nice-to-have)
  - Quick complete checkbox
  - Task priority badges
  - Due date indicators
- [ ] Fetch data from multiple APIs
- [ ] Loading states for each section

**Deliverables**:
- Employee dashboard page
- Today's tasks view
- Multi-section layout
- Responsive design

**API Used**:
- `GET /api/tasks?assigned_to=me&status=pending` (existing)
- `GET /api/goals?owner=me` (existing)
- `GET /api/objectives?team=myTeam` (existing)

---

#### **Day 7: Employee Dashboard - Widgets & Actions**
**Date**: Nov 25, 2025 (Monday)
**Owner**: Frontend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] Build "My Goals Progress" section:
  - Quarterly goals: Progress bars
  - Weekly goals: Mini progress rings
  - At-risk indicators (< 30% progress with < 30 days left)
  - Click to navigate to goal details
- [ ] Build "Recent Activity" timeline:
  - Task completions
  - Goal updates
  - Team mentions
  - Last 7 days
- [ ] Build "Quick Stats" cards:
  - Tasks Completed This Week
  - Goals On Track
  - My Contribution Score (mock for now)
- [ ] Quick actions:
  - "Add Task" button (opens modal)
  - "Update Progress" button (inline edit)
  - "View All Goals" link

**Deliverables**:
- Goals progress widgets
- Activity timeline
- Quick stats
- Quick actions

**API Used**:
- `GET /api/activities?user=me&days=7` (reuse existing)
- `GET /api/goals/:id/progress` (existing)

---

### **Phase 3: Task Management UI Completion (Days 8-9)**

#### **Day 8: Task Creation & Assignment**
**Date**: Nov 26, 2025 (Tuesday)
**Owner**: Frontend Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Enhance `client/pages/tasks.html` (currently ~30% complete)
- [ ] Build "Create Task" modal:
  - Task title (required)
  - Description (rich text editor optional, textarea for MVP)
  - Parent Goal selector (dropdown)
  - Assignee selector (team members)
  - Due date picker
  - Priority selector (High/Medium/Low)
  - Estimated hours (optional)
- [ ] Build "Assign Task" workflow:
  - Bulk assign (checkbox selection)
  - Individual assign (dropdown per task)
  - Notification to assignee (backend handles)
- [ ] Form validation
- [ ] API integration
- [ ] Success feedback

**Deliverables**:
- Task creation modal
- Assignment workflow
- Form validation
- API integration

**API Used**:
- `POST /api/tasks` (existing)
- `PUT /api/tasks/:id/assign` (existing)
- `GET /api/teams/:id/members` (existing)
- `GET /api/goals` (for parent selector)

**Enhancement to Existing**:
- Current: Basic task list
- Add: Creation modal, assignment dropdowns
- Improve: Filters, sorting, pagination

---

#### **Day 9: Task Progress & Completion**
**Date**: Nov 27, 2025 (Wednesday)
**Owner**: Frontend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] Build "Update Progress" interface:
  - Progress slider (0-100%)
  - Status dropdown (Not Started/In Progress/Completed/Blocked)
  - Notes textarea (optional)
  - Update button
  - Inline quick update (click progress bar → slider)
- [ ] Build "Complete Task" workflow:
  - Checkbox to complete
  - Completion confirmation modal
  - Completion notes (optional)
  - Celebration animation (confetti.js - optional)
- [ ] Task filters enhancement:
  - By Status (All/Pending/Completed/Blocked)
  - By Priority (All/High/Medium/Low)
  - By Assignee (filter dropdown)
  - By Due Date (Overdue/Today/This Week/Future)
- [ ] Task sorting:
  - By Due Date
  - By Priority
  - By Progress
  - By Created Date
- [ ] Pagination (20 tasks per page)

**Deliverables**:
- Progress update interface
- Task completion workflow
- Enhanced filters
- Sorting and pagination

**API Used**:
- `PUT /api/tasks/:id/progress` (existing)
- `PUT /api/tasks/:id/complete` (existing)
- `PUT /api/tasks/:id/status` (existing)

---

### **Phase 4: Integration & Polish (Day 10)**

#### **Day 10: Integration, Testing & Bug Fixes**
**Date**: Nov 28, 2025 (Thursday)
**Owner**: Full Stack Dev
**Effort**: 8 hours

**Tasks**:
- [ ] **Cross-Page Navigation Testing**:
  - Objectives → Goals → Tasks (create flow)
  - Employee Dashboard → Task Details → Goal Details
  - Quarterly Goals → Weekly Goals → Tasks
  - Verify all breadcrumbs work
  - Verify all "Back" buttons work

- [ ] **"Why Chain" Lineage Verification**:
  - Test: Task → Weekly Goal → Quarterly Goal → Objective → Assessment
  - Verify API: `GET /api/tasks/:id/lineage`
  - Display breadcrumb on task details page
  - Display tooltip with assessment context

- [ ] **Sprint 1 Bug Fixes**:
  - Fix ISS-S1D8-002: Timeline status "At Risk" logic (2 hours)
  - Fix ISS-S1D8-003: Target year user input (1 hour)
  - Test ISS-S1D8-001: Change Manager dropdown (verify fix)

- [ ] **Performance Optimization**:
  - Test page load times (< 2 seconds target)
  - Optimize API calls (batch where possible)
  - Add caching for static data (teams, users)
  - Lazy load images and charts

- [ ] **Final QA**:
  - Test complete execution chain:
    1. Create Objective
    2. Break into Quarterly Goal
    3. Break into Weekly Goal
    4. Create Tasks from Weekly Goal
    5. Assign tasks to employees
    6. Employee completes tasks
    7. Progress rolls up: Task → Weekly → Quarterly → Objective
  - Test on Chrome, Safari, Firefox
  - Test responsive breakpoints (desktop, tablet, mobile)
  - Verify all error messages are user-friendly
  - Check loading states on slow connection

**Deliverables**:
- All navigation working
- "Why Chain" lineage visible
- Bug fixes completed
- Performance targets met
- QA checklist completed

---

## 📝 User Stories Implemented

### **Priority User Stories (Sprint 2)**

#### **MGR-015: Assign Goals to Team [Week 8]** - Sprint 2 Day 2
**As a** Manager
**I want to** assign quarterly goals to my team
**So that** team members know their quarterly targets

**Acceptance Criteria**:
- ✅ "Create Goal" modal on quarterly-goals.html
- ✅ Assign to team member dropdown
- ✅ Link goal to parent objective
- ✅ Set target value and quarter
- ✅ Success notification
- ✅ Goal appears in team member's "My Goals" view

**Implementation**: Day 2 - Quarterly Goals Creation

---

#### **MGR-016: Create Team Goals [Week 8]** - Sprint 2 Days 1-3
**As a** Manager
**I want to** create quarterly and weekly goals for my team
**So that** I can break down objectives into actionable targets

**Acceptance Criteria**:
- ✅ Quarterly goals page with list view
- ✅ Weekly goals page with week grouping
- ✅ Creation modals for both types
- ✅ Parent-child relationship visible
- ✅ Progress tracking enabled

**Implementation**: Days 1-3 - Goal Management Pages

---

#### **MGR-017: Create Tasks from Goals [Week 8]** - Sprint 2 Day 8
**As a** Manager
**I want to** create tasks that link to specific goals
**So that** work is clearly connected to strategic objectives

**Acceptance Criteria**:
- ✅ "Create Task" modal on tasks.html
- ✅ Parent Goal selector dropdown
- ✅ Task details: title, description, due date, priority
- ✅ Assignee selection
- ✅ Task appears under parent goal
- ✅ API: `POST /api/tasks` with `goal_id`

**Implementation**: Day 8 - Task Creation

---

#### **MGR-018: Link Tasks to Goals [Week 8]** - Sprint 2 Day 8
**As a** Manager
**I want to** link existing tasks to goals
**So that** I can organize work under strategic objectives

**Acceptance Criteria**:
- ✅ Bulk link: Select tasks → "Link to Goal" button
- ✅ Individual link: Dropdown on task row
- ✅ Unlink option available
- ✅ API: `PUT /api/tasks/:id/link`

**Implementation**: Day 8 - Task Assignment

---

#### **EMP-008: View Daily Tasks [Week 7]** - Sprint 2 Day 6
**As an** Employee
**I want to** see my daily tasks in a dashboard
**So that** I know what to work on today

**Acceptance Criteria**:
- ✅ Employee dashboard with "Today's Tasks" section
- ✅ Kanban-style columns: To Do, In Progress, Completed
- ✅ Task priority badges (High/Medium/Low)
- ✅ Due date indicators
- ✅ Quick complete checkbox
- ✅ Filter by priority/status

**Implementation**: Day 6 - Employee Dashboard Core

---

#### **EMP-009: Complete Task [Week 7]** - Sprint 2 Day 9
**As an** Employee
**I want to** mark tasks as complete
**So that** my progress is tracked and team visibility is maintained

**Acceptance Criteria**:
- ✅ Checkbox to complete task
- ✅ Completion confirmation modal
- ✅ Optional completion notes
- ✅ Task moves to "Completed" column
- ✅ API: `PUT /api/tasks/:id/complete`
- ✅ Success feedback (celebration optional)

**Implementation**: Day 9 - Task Completion

---

#### **EMP-010: Update Task Progress [Week 7]** - Sprint 2 Day 9
**As an** Employee
**I want to** update my task progress percentage
**So that** managers can see real-time status

**Acceptance Criteria**:
- ✅ Progress slider (0-100%)
- ✅ Status dropdown (Not Started/In Progress/Completed/Blocked)
- ✅ Notes textarea
- ✅ Inline quick update (click progress bar)
- ✅ API: `PUT /api/tasks/:id/progress`
- ✅ Visual feedback on update

**Implementation**: Day 9 - Task Progress

---

#### **EMP-014: View My Goals [Week 8]** - Sprint 2 Day 7
**As an** Employee
**I want to** see all goals assigned to me
**So that** I understand my quarterly and weekly targets

**Acceptance Criteria**:
- ✅ "My Goals Progress" section on employee dashboard
- ✅ Quarterly goals with progress bars
- ✅ Weekly goals with mini progress rings
- ✅ At-risk indicators
- ✅ Click to navigate to goal details
- ✅ API: `GET /api/goals?owner=me`

**Implementation**: Day 7 - Employee Dashboard Widgets

---

#### **EMP-015: Update Goal Progress [Week 8]** - Sprint 2 Day 7
**As an** Employee
**I want to** update progress on my goals
**So that** my contributions are tracked

**Acceptance Criteria**:
- ✅ "Update Progress" button on goal details page
- ✅ Quick update from dashboard (inline edit)
- ✅ Progress slider with notes
- ✅ API: `PUT /api/goals/:id/progress`
- ✅ Progress rolls up to parent goal
- ✅ Visual feedback on save

**Implementation**: Day 7 - Dashboard Quick Actions

---

#### **EMP-016: View "Why Chain" Context [Week 8]** - Sprint 2 Day 10 (CRITICAL)
**As an** Employee
**I want to** see how my task connects to company objectives
**So that** I understand the impact of my work and stay motivated

**Acceptance Criteria**:
- ✅ Breadcrumb: `Company OKR > Objective > Quarterly Goal > Weekly Goal > This Task`
- ✅ Each level clickable (opens detail modal)
- ✅ Visual indicator: "Your task represents 0.4% of Quarterly Goal progress"
- ✅ Tooltip: "Generated from Q4 2025 SSI Assessment - Addresses Financial Strength gap (5.5/10)"
- ✅ Mobile responsive (breadcrumb → dropdown)
- ✅ API: `GET /api/tasks/:taskId/lineage`

**Implementation**: Day 10 - Integration Testing

**Priority**: P0 (Critical - core to assessment-driven model)

---

### **Total Stories**: 10 implemented in Sprint 2
- Manager Stories: 4 (MGR-015, MGR-016, MGR-017, MGR-018)
- Employee Stories: 6 (EMP-008, EMP-009, EMP-010, EMP-014, EMP-015, EMP-016)

---

## 🗂️ Technical Architecture

### **New Components Created**

| Component | Type | Lines of Code | Status |
|-----------|------|---------------|--------|
| `client/pages/quarterly-goals.html` | UI | ~400 | Day 1-2 |
| `client/pages/weekly-goals.html` | UI | ~300 | Day 3 |
| `client/pages/goal-details.html` | UI | ~300 | Day 4 |
| `client/js/goals-api-client.js` | API Client | ~300 | Day 5 |
| `client/pages/scripts/quarterly-goals.js` | Controller | ~350 | Day 5 |
| `client/pages/scripts/weekly-goals.js` | Controller | ~300 | Day 5 |
| `client/pages/scripts/goal-details.js` | Controller | ~400 | Day 5 |
| `client/pages/employee-dashboard.html` | UI | ~400 | Day 6-7 |
| `client/pages/scripts/employee-dashboard.js` | Controller | ~350 | Day 6-7 |
| Enhanced `client/pages/tasks.html` | UI | +300 | Day 8-9 |
| Enhanced `client/pages/scripts/tasks.js` | Controller | +250 | Day 8-9 |

**Total New Code**: ~3,050 lines (+200 for hybrid cascading logic)
**Enhanced Code**: ~650 lines (+100 for KR integration)
**Total Sprint 2 Effort**: ~3,700 lines

### **Reused Components**

| Component | Location | Reuse Level |
|-----------|----------|-------------|
| Goal Model | `server/models/Goal.js` | 💯 100% |
| Task Model | `server/models/Task.js` | 💯 100% |
| Objective Model | `server/models/Objective.js` | 💯 100% |
| Goal Routes | `server/routes/goals.js` | 💯 100% (11 endpoints) |
| Task Routes | `server/routes/tasks.js` | 💯 100% (13 endpoints) |
| Team API Client | `client/js/team-api-client.js` | 🟢 90% |
| Objectives Pattern | `client/pages/objectives.html` | 🟢 85% (UI pattern) |
| Dashboard Layout | `client/pages/manager-dashboard.html` | 🟢 80% (layout pattern) |

**Overall Backend Reuse**: 💯 100% (Zero backend changes needed!)
**Overall Frontend Reuse**: 🟢 85% (UI patterns and components)

---

## 🧪 Testing Plan

### **Unit Tests** (Per Day)

**Day 1-5: Goal Management**
- [ ] Goal list rendering with filters
- [ ] Goal creation form validation
- [ ] Goal detail page data display
- [ ] API client methods (create, read, update, delete)
- [ ] Progress calculation logic

**Day 6-7: Employee Dashboard**
- [ ] Dashboard data fetching
- [ ] Today's tasks grouping (To Do/In Progress/Completed)
- [ ] Goals progress widgets
- [ ] Activity timeline rendering
- [ ] Quick stats calculations

**Day 8-9: Task Management**
- [ ] Task creation modal validation
- [ ] Assignment dropdown logic
- [ ] Progress slider interaction
- [ ] Completion workflow
- [ ] Filter and sort logic

**Day 10: Integration**
- [ ] Cross-page navigation
- [ ] "Why Chain" lineage API
- [ ] Progress rollup cascade
- [ ] End-to-end execution chain

### **Integration Tests**

- [ ] **Test 1**: Manager creates quarterly goal → Goal appears in list
- [ ] **Test 2**: Manager creates weekly goal from quarterly → Parent-child link works
- [ ] **Test 3**: Manager creates tasks from weekly goal → Tasks linked correctly
- [ ] **Test 4**: Manager assigns task to employee → Employee sees in dashboard
- [ ] **Test 5**: Employee completes task → Progress rolls up to weekly goal
- [ ] **Test 6**: Weekly goal progress updates → Quarterly goal progress updates
- [ ] **Test 7**: Quarterly goal progress updates → Objective progress updates
- [ ] **Test 8**: View "Why Chain" on task → Shows full lineage
- [ ] **Test 9**: Filter goals by quarter → Correct goals displayed
- [ ] **Test 10**: Update goal progress → Child progress percentages recalculated

### **End-to-End Tests**

- [ ] **E2E Test 1**: Complete execution chain
  - Login as Executive → Create Objective
  - Switch to Manager → Create Quarterly Goal from Objective
  - Create Weekly Goal from Quarterly Goal
  - Create 3 Tasks from Weekly Goal
  - Assign Tasks to Employees
  - Switch to Employee → View Dashboard
  - Complete 1 Task → Verify progress rollup
  - Update Task Progress → Verify rollup
  - View "Why Chain" → Verify full lineage

- [ ] **E2E Test 2**: Employee daily workflow
  - Login as Employee → View Dashboard
  - See "Today's Tasks" section
  - Click task → See goal context
  - Update progress → See visual feedback
  - Complete task → See celebration
  - View "My Goals" → See progress bars updated

- [ ] **E2E Test 3**: Manager goal management
  - Login as Manager → Create Quarterly Goal
  - Break into 4 Weekly Goals
  - Create 12 Tasks (3 per weekly goal)
  - Assign to team members
  - View team dashboard → See all tasks
  - Monitor progress → See rollup

---

## 🚨 Risks & Mitigations

### **Risk 1: Goal Management Complexity**
**Probability**: Medium
**Impact**: High
**Mitigation**: Reuse Objectives UI pattern heavily, break into small components
**Contingency**: Simplify UI to list + create only (defer advanced features)

### **Risk 2: Progress Rollup Performance**
**Probability**: Low
**Impact**: Medium
**Mitigation**: Backend already has optimized aggregation (works in Sprint 1)
**Contingency**: Add caching layer if > 100 goals per company

### **Risk 3: Employee Dashboard Data Loading**
**Probability**: Medium
**Impact**: Low
**Mitigation**: Fetch data in parallel, show loading states
**Contingency**: Add pagination if > 50 tasks

### **Risk 4: "Why Chain" Lineage API Missing**
**Probability**: High
**Impact**: High
**Mitigation**: Create API endpoint on Day 10 if missing (2 hours)
**Contingency**: Show simplified lineage (Task → Goal only)

### **Risk 5: Cross-Browser Compatibility**
**Probability**: Low
**Impact**: Medium
**Mitigation**: Test on Chrome/Safari/Firefox throughout sprint
**Contingency**: Focus on Chrome for MVP, defer others to Sprint 3

---

## 📊 Success Metrics

### **Development Metrics**
- **Sprint Velocity**: ~3,400 lines of code in 10 days (340 lines/day avg)
- **Backend Reuse**: 100% (Zero backend changes!)
- **Frontend Reuse**: 85% (UI patterns and components)
- **Test Coverage**: > 80% (unit + integration)
- **Code Review**: All changes reviewed before merge

### **Functional Metrics**
- **Goal Creation Time**: < 30 seconds (from click to saved)
- **Dashboard Load Time**: < 2 seconds (for 50 tasks)
- **Task Assignment Time**: < 10 seconds (bulk assign 10 tasks)
- **Progress Update Time**: < 5 seconds (inline edit)
- **Cross-Page Navigation**: < 1 second (cached data)

### **User Metrics** (Post-Sprint)
- **Goal Creation Rate**: > 70% (managers create goals within 1 week)
- **Task Completion Rate**: > 60% (employees complete assigned tasks)
- **Dashboard Daily Active Users**: > 80% (employees check dashboard daily)
- **Progress Update Frequency**: > 50% (updated at least once per week)

---

## 🔗 Related Documentation

### **Sprint 2 Architecture** ⭐
- [GOAL_CASCADING_ARCHITECTURE.md](./GOAL_CASCADING_ARCHITECTURE.md) - **CRITICAL READ**: Hybrid cascading approach (Objective → KR → Quarterly Goal → Weekly Goal → Tasks)

### **Sprint 1 References**
- [Sprint 1 Master Plan](../SPRINT_1/SPRINT_1_MASTER_PLAN.md)
- [Sprint 1 User Stories](../SPRINT_1/SPRINT_1_USER_STORIES.md)
- [Day 6 Completion Summary](../SPRINT_1/DAY_6_COMPLETION_SUMMARY.md)

### **Technical References**
- [Goal Model](../../../../server/models/Goal.js) - Backend model (100% complete)
- [Goal Routes](../../../../server/routes/goals.js) - API endpoints (11 endpoints)
- [Task Model](../../../../server/models/Task.js) - Backend model (100% complete)
- [Task Routes](../../../../server/routes/tasks.js) - API endpoints (13 endpoints)
- [Objectives UI Pattern](../../../../client/pages/objectives.html) - Reusable pattern

### **Product Strategy**
- [User Stories Master](../../../../KARVIA_STRATEGY/1-PRODUCT/user-stories/USER_STORIES_MASTER.md)
- [MVP Technical Architecture](../../../../KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/MVP_TECHNICAL_ARCHITECTURE_V5.md)
- [Product Vision](../../../../KARVIA_STRATEGY/1-PRODUCT/PRODUCT_VISION.md)

### **Master Lists**
- [MASTER_DEV_LIST.md](../../../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md)
- [MASTER_ISSUES_LIST.md](../../../../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md)
- [MASTER_IMPROVEMENTS_LIST.md](../../../../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md)

---

## 📋 Sprint Backlog

### **Days 1-5: Goal Management**
- [ ] Day 1: Quarterly goals list page
- [ ] Day 2: Goal creation modal
- [ ] Day 3: Weekly goals page
- [ ] Day 4: Goal details page
- [ ] Day 5: Goals API client + controllers

### **Days 6-7: Employee Dashboard**
- [ ] Day 6: Dashboard core layout + Today's tasks
- [ ] Day 7: Goals widgets + Activity timeline + Quick stats

### **Days 8-9: Task Management**
- [ ] Day 8: Task creation + Assignment workflow
- [ ] Day 9: Progress update + Completion + Filters

### **Day 10: Integration & Polish**
- [ ] Integration testing
- [ ] "Why Chain" lineage
- [ ] Bug fixes
- [ ] Performance optimization

---

## ✅ Definition of Done

A task is considered "done" when:
- ✅ Code written and self-reviewed
- ✅ Unit tests written and passing (> 80% coverage)
- ✅ Integration tests passing
- ✅ Code reviewed by peer
- ✅ Merged to main branch
- ✅ Manual QA tested
- ✅ Documentation updated
- ✅ No P0/P1 bugs remaining

---

## 🎉 Sprint Completion Criteria

Sprint 2 is complete when:
- ✅ All 10 days' tasks marked complete
- ✅ All 10 user stories pass acceptance criteria
- ✅ End-to-end execution chain working: Objective → Goals → Tasks → Completion
- ✅ Employee dashboard live and usable
- ✅ "Why Chain" lineage visible and working
- ✅ All Sprint 1 bugs fixed
- ✅ Performance metrics met (< 2s page loads)
- ✅ No P0 bugs remaining
- ✅ Sprint retrospective completed
- ✅ Sprint 3 planned

---

## 📈 Sprint 2 Progress Tracking

| Day | Component | Status | Completion |
|-----|-----------|--------|------------|
| Day 1 | Quarterly Goals List | ⬜ Not Started | 0% |
| Day 2 | Goal Creation Modal | ⬜ Not Started | 0% |
| Day 3 | Weekly Goals Page | ⬜ Not Started | 0% |
| Day 4 | Goal Details Page | ⬜ Not Started | 0% |
| Day 5 | Goals API Client | ⬜ Not Started | 0% |
| Day 6 | Employee Dashboard Core | ⬜ Not Started | 0% |
| Day 7 | Dashboard Widgets | ⬜ Not Started | 0% |
| Day 8 | Task Creation & Assignment | ⬜ Not Started | 0% |
| Day 9 | Task Progress & Completion | ⬜ Not Started | 0% |
| Day 10 | Integration & Testing | ⬜ Not Started | 0% |

**Overall Sprint 2**: **0% Complete** (Starting Nov 17)

---

**Created By**: Claude Code
**Date**: November 12, 2025
**Version**: 1.0.0
**Status**: 🔴 Not Started - Ready for Sprint Kickoff

---

**Next Steps**:
1. Review Sprint 2 plan with stakeholders
2. Create Day 1 detailed task breakdown
3. Set up Sprint 2 folder with daily completion tracking
4. Sprint kickoff meeting Nov 17, 2025
