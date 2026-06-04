# Week 5 Test Plan - Teams + Objectives

**Version**: 1.0.0
**Created**: 2025-10-22
**Test Period**: Week 5 (Oct 22-26, 2025)
**Scope**: Team Management + Objectives Display + AI OKR Bug Fix

---

## 🎯 TEST OBJECTIVES

**Primary Goals**:
1. Verify Team CRUD operations work correctly with role-based access
2. Verify Objectives display correctly with status filtering
3. Confirm AI OKR Review bug (ISS-W4-001) is resolved
4. Ensure no regression in Week 1-4 Assessment features

**User Stories Under Test**: 8 stories (25 story points)
- EXEC-004: Fix AI OKR Bug (P0 - BLOCKING)
- MGR-004 to MGR-007: Team Management (4 stories)
- EMP-004, EXEC-003, MGR-008: Objectives Display (3 stories)

**Reference**: [WEEK_5_USER_STORIES_CORRECTIONS.md](../../WEEK_5_USER_STORIES_CORRECTIONS.md)

---

## 📋 TEST SCOPE

### ✅ IN SCOPE (Week 5 MVP)

**Team Management**:
- Create team (Admin/Manager)
- View team list (role-filtered)
- Add members to team
- Remove members from team
- Edit team details
- Delete team (soft delete)
- Role-based access control

**Objectives Display**:
- View my objectives (Employee)
- View team objectives (Manager)
- View all objectives (Executive)
- Filter by status (All, On Track, At Risk, Completed)
- Sort by progress/due date (client-side)
- Progress color-coding (Green/Yellow/Red)
- Expand key results

**Bug Fix**:
- AI OKR Review page displays generated OKRs
- End-to-end: Assessment → Generate → Review → Accept

### ❌ OUT OF SCOPE (Deferred)

**NOT Testing Week 5**:
- Personal/Team tabs (Week 10)
- CSV export (Week 11)
- Progress timeline history (Week 10)
- Team/Department filtering (Week 8)
- Admin user management panel (Week 11)
- Objective reassignment on member removal (Week 8)
- Progress ring visuals (Week 10)
- Modal drill-downs (Week 10)

---

## 👥 TEST ROLES

### Test User Accounts Required

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@test.com | Test123! | Full team CRUD, all access |
| Executive | exec@test.com | Test123! | View all objectives, strategic view |
| Manager | manager@test.com | Test123! | Manage teams, view team objectives |
| Employee | employee@test.com | Test123! | View own objectives, read-only teams |
| Consultant | consultant@test.com | Test123! | Generate OKRs, assessment access |

**Setup**: Create these 5 test users in same business before testing starts.

---

## 🧪 TEST ENVIRONMENTS

### Environment Setup

**Server**: `http://localhost:8080`
**Database**: MongoDB (local)
**Engines**: IAM, Assessment, Planner, Scoring, Observer, Tracking

**Prerequisites**:
1. ✅ Week 1-4 code deployed (Assessment system working)
2. ✅ Week 5 code deployed (Team model, APIs, UI)
3. ✅ Test users created (5 roles)
4. ✅ Sample data seeded:
   - 1 business
   - 5 users (all roles)
   - 2-3 assessment templates
   - 3-5 objectives (AI-generated or manual)

---

## 📝 TEST CASES BY STORY

### 🔴 P0 - CRITICAL BUG FIX

#### TC-001: AI OKR Review Page Display (EXEC-004)

**Priority**: P0 (BLOCKING)
**User Story**: EXEC-004
**Preconditions**:
- Assessment completed
- OKRs generated via POST `/api/ai-okr/generate`
- OKRs saved to database

**Test Steps**:
1. Login as Executive
2. Navigate to AI OKR Review page (`/ai-okr-review.html`)
3. Verify page loads without errors
4. Verify AI-generated objectives display in cards
5. Verify each objective shows:
   - Title
   - Description
   - Key results list (3-5 KRs)
   - "Accept" and "Reject" buttons
6. Click "Accept" on one objective
7. Verify objective saved to Objectives collection
8. Navigate to Objectives page
9. Verify accepted objective appears in list

**Expected Result**:
- ✅ Review page displays OKRs (not blank)
- ✅ Data structure correct: `response.data.suggestions[]`
- ✅ No console errors
- ✅ Accept/Reject buttons functional

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

**Bug Reference**: ISS-W4-001 (resolved if Pass)

---

### 👥 TEAM MANAGEMENT

#### TC-002: Create Team (MGR-004)

**Priority**: P0
**User Story**: MGR-004
**Test As**: Admin

**Test Steps**:
1. Login as Admin
2. Navigate to Team Management page (`/team.html`)
3. Click "Create Team" button
4. Fill form:
   - Name: "Engineering Team"
   - Description: "Product development team"
   - Department: "Engineering"
   - Manager: Select from dropdown (Manager user)
5. Click "Create"
6. Verify success notification appears
7. Verify new team appears in team list
8. Verify team card shows:
   - Team name
   - Department
   - Manager name
   - Member count (0 initially)

**Expected Result**:
- ✅ Team created successfully
- ✅ Saved to database with business_id, manager_id
- ✅ Team appears in list immediately

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

#### TC-003: Add Team Members (MGR-005)

**Priority**: P0
**User Story**: MGR-005
**Test As**: Manager (of created team)

**Preconditions**:
- Team "Engineering Team" exists
- 2-3 employee users exist in business

**Test Steps**:
1. Login as Manager
2. Navigate to Team Management
3. Click on "Engineering Team" card
4. Click "Add Members" button
5. Select 2 employees from dropdown
6. Click "Add"
7. Verify members added to list
8. Verify each member shows:
   - Name
   - Email
   - Role (EMPLOYEE)
   - "Remove" button
9. Refresh page
10. Verify members persist

**Expected Result**:
- ✅ Members added to team.members array
- ✅ Member count updated (shows "2 members")
- ✅ No duplicate members allowed

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

#### TC-004: View Team List (MGR-006)

**Priority**: P0
**User Story**: MGR-006
**Test As**: Admin, Manager, Employee (3 separate tests)

**Test Steps (Admin)**:
1. Login as Admin
2. Navigate to Team Management
3. Verify all teams in business visible
4. Verify search box filters teams by name
5. Verify "Create Team" button visible

**Test Steps (Manager)**:
1. Login as Manager
2. Navigate to Team Management
3. Verify only managed teams visible
4. Verify "Create Team" button hidden

**Test Steps (Employee)**:
1. Login as Employee
2. Navigate to Team Management
3. Verify only teams where employee is member visible
4. Verify read-only view (no Create/Edit buttons)

**Expected Result**:
- ✅ Role-based filtering works
- ✅ Search filters by team name
- ✅ Correct button visibility per role

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

#### TC-005: Remove Team Member (MGR-007)

**Priority**: P0
**User Story**: MGR-007
**Test As**: Manager

**Preconditions**:
- Team has 2+ members

**Test Steps**:
1. Login as Manager
2. Navigate to Engineering Team detail
3. Click "Remove" button next to one member
4. Verify confirmation modal appears with warning:
   - "Remove [Name] from [Team]?"
   - "This member's objectives will need manual reassignment"
5. Click "Confirm"
6. Verify success notification
7. Verify member removed from list
8. Verify member count decremented
9. Login as removed member
10. Verify team no longer appears in their team list

**Expected Result**:
- ✅ Member removed from team.members array
- ✅ Member still exists in User collection (soft remove)
- ✅ Warning message displayed (objective reassignment manual)

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

**Note**: Automatic objective reassignment NOT tested (deferred to Week 8)

---

### 🎯 OBJECTIVES DISPLAY

#### TC-006: View My Objectives - Employee (EMP-004)

**Priority**: P0
**User Story**: EMP-004
**Test As**: Employee

**Preconditions**:
- 2-3 objectives assigned to employee user
- Objectives have varied progress (0%, 50%, 90%)

**Test Steps**:
1. Login as Employee
2. Navigate to Objectives page (`/objectives.html`)
3. Verify page displays employee's assigned objectives only
4. For each objective, verify displayed:
   - Title
   - Description (truncated or full)
   - Progress percentage (0-100%)
   - Due date
   - Status color:
     - Green if progress >75%
     - Yellow if progress 50-75%
     - Red if progress <50%
5. Click objective to expand
6. Verify key results list appears
7. Verify empty state if no objectives: "No objectives assigned yet"

**Expected Result**:
- ✅ Only employee's objectives shown (filtered by user_id)
- ✅ Progress color-coding correct
- ✅ Key results expand on click
- ✅ No Team/Personal tabs (deferred to Week 10)

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

#### TC-007: View All Objectives - Executive (EXEC-003)

**Priority**: P0
**User Story**: EXEC-003
**Test As**: Executive

**Preconditions**:
- 5-10 objectives exist across multiple users
- Objectives have varied statuses

**Test Steps**:
1. Login as Executive
2. Navigate to Objectives page
3. Verify page displays ALL company objectives (no user filter)
4. Verify summary stats at top:
   - Total Objectives count
   - On Track % (progress >75%)
   - At Risk count (progress <50%)
5. Test status filter dropdown:
   - Select "All" → See all objectives
   - Select "On Track" → See only green objectives
   - Select "At Risk" → See only red objectives
   - Select "Completed" → See completed objectives
6. Test sort dropdown:
   - Sort by Progress → Verify order (high to low)
   - Sort by Due Date → Verify order (nearest first)
7. Verify each objective shows:
   - Owner name
   - Progress %
   - Status badge
   - Due date

**Expected Result**:
- ✅ All objectives visible (no filtering)
- ✅ Summary stats calculated correctly
- ✅ Status filter works (client-side)
- ✅ Sorting works (client-side)
- ✅ NO CSV export button (deferred Week 11)
- ✅ NO Team/Department filter (deferred Week 8)

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

#### TC-008: Track Team Objectives - Manager (MGR-008)

**Priority**: P0
**User Story**: MGR-008
**Test As**: Manager

**Preconditions**:
- Manager manages a team with 2+ members
- Team has 3+ assigned objectives

**Test Steps**:
1. Login as Manager
2. Navigate to Objectives page
3. Verify page shows team objectives (objectives assigned to team members)
4. Verify progress calculated from key results
5. Verify color-coded status (Green/Yellow/Red)
6. Verify last updated timestamp visible
7. Click objective to view details
8. Verify key results list shown

**Expected Result**:
- ✅ Team objectives displayed
- ✅ Progress accurate (from KR completion)
- ✅ Color coding correct
- ✅ Last updated timestamp shown
- ✅ NO progress history timeline (deferred Week 10)
- ✅ NO update progress modal (deferred Week 10)

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

## 🔄 END-TO-END SCENARIOS

### E2E-001: Complete Team + Objectives Flow

**Duration**: 15-20 minutes
**Roles**: Admin, Manager, Employee

**Steps**:
1. **Admin creates team**:
   - Login as Admin
   - Create "Sales Team"
   - Assign Manager as team manager
2. **Manager adds members**:
   - Login as Manager
   - Add 2 employees to Sales Team
3. **Consultant generates OKRs**:
   - Login as Consultant
   - Complete assessment for business
   - Generate AI OKRs
   - Accept OKRs on review page (verify ISS-W4-001 fixed)
4. **Admin assigns objectives**:
   - Login as Admin
   - Manually assign 1 objective to each Sales Team member
5. **Employee views objectives**:
   - Login as Employee
   - Navigate to Objectives page
   - Verify can see assigned objective
   - Expand to see key results
6. **Manager views team objectives**:
   - Login as Manager
   - Navigate to Objectives page
   - Verify can see both team members' objectives
   - Filter by status
7. **Executive views all objectives**:
   - Login as Executive
   - Navigate to Objectives page
   - Verify can see all company objectives
   - Check summary stats accurate

**Expected Result**:
- ✅ Complete flow works end-to-end
- ✅ All roles see correct data based on permissions
- ✅ No errors in any step
- ✅ Data persists across sessions

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

## 🐛 REGRESSION TESTING

### Week 1-4 Features (No Regressions)

**Must verify Week 5 changes don't break existing features**:

#### RT-001: Assessment Template Creation
- [ ] Can create assessment template
- [ ] Can select questions from library
- [ ] Can set SSI dimension weights
- [ ] Template saves correctly

#### RT-002: Assessment Taking
- [ ] Can receive assessment invitation email
- [ ] Can complete assessment
- [ ] Can submit responses
- [ ] Results calculate correctly

#### RT-003: AI OKR Generation (Backend)
- [ ] Can generate OKRs from assessment results
- [ ] OKRs save to database
- [ ] OpenAI integration works (if configured)

**Expected Result**:
- ✅ All Week 1-4 features still work
- ✅ No broken endpoints
- ✅ No data corruption

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

## 🔐 SECURITY TESTING

### SEC-001: Role-Based Access Control

**Test unauthorized access attempts**:

1. **Team Management Access**:
   - [ ] Employee cannot create teams (403 error)
   - [ ] Employee cannot delete teams (403 error)
   - [ ] Manager cannot access other managers' teams (filtered)

2. **Objectives Access**:
   - [ ] Employee cannot see other employees' personal objectives
   - [ ] Manager can only see team objectives
   - [ ] Consultant cannot modify objectives (read-only)

3. **API Endpoint Protection**:
   - [ ] POST /api/teams/create requires Admin/Manager role
   - [ ] DELETE /api/teams/:id requires Admin role
   - [ ] GET /api/objectives filters by user role

**Expected Result**:
- ✅ All unauthorized access blocked (403 Forbidden)
- ✅ No data leakage between roles
- ✅ JWT token validation works

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

## 🎨 UI/UX TESTING

### UI-001: Responsive Design

**Test on different screen sizes**:

1. **Desktop** (1920x1080):
   - [ ] Team cards display in grid (3-4 columns)
   - [ ] Objectives list readable
   - [ ] Modals centered and sized correctly

2. **Tablet** (768x1024):
   - [ ] Team cards adjust to 2 columns
   - [ ] Navigation menu accessible
   - [ ] Forms usable

3. **Mobile** (375x667):
   - [ ] Team cards stack vertically
   - [ ] Objectives list scrolls
   - [ ] Buttons large enough to tap

**Expected Result**:
- ✅ Layout adapts to screen size
- ✅ No horizontal scrolling
- ✅ All elements accessible

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

### UI-002: Loading States & Empty States

**Test user feedback**:

1. **Loading States**:
   - [ ] Spinner shows while loading teams
   - [ ] Spinner shows while loading objectives
   - [ ] Button disabled during API calls

2. **Empty States**:
   - [ ] "No teams yet" message if no teams exist
   - [ ] "No objectives assigned yet" message if no objectives
   - [ ] Clear call-to-action ("Create Team" button)

3. **Error States**:
   - [ ] Error message if API fails (network error)
   - [ ] Toast notification for success/error
   - [ ] Form validation errors clear

**Expected Result**:
- ✅ User always knows system state
- ✅ No blank screens without explanation
- ✅ Errors are user-friendly

**Actual Result**: ___________

**Status**: ⬜ Pass | ⬜ Fail | ⬜ Blocked

---

## ⚡ PERFORMANCE TESTING

### PERF-001: Page Load Times

**Target**: <2 seconds for all pages

| Page | Target | Actual | Pass/Fail |
|------|--------|--------|-----------|
| Team Management | <2s | ___ | ⬜ |
| Objectives List | <2s | ___ | ⬜ |
| AI OKR Review | <2s | ___ | ⬜ |

**Expected Result**:
- ✅ All pages load in <2 seconds
- ✅ No unnecessary API calls
- ✅ Images/assets optimized

---

### PERF-002: API Response Times

**Target**: <500ms for API endpoints

| Endpoint | Target | Actual | Pass/Fail |
|----------|--------|--------|-----------|
| GET /api/teams | <500ms | ___ | ⬜ |
| POST /api/teams/create | <500ms | ___ | ⬜ |
| GET /api/objectives | <500ms | ___ | ⬜ |

**Expected Result**:
- ✅ APIs respond in <500ms
- ✅ Database queries optimized (indexes used)
- ✅ No N+1 query problems

---

## 📊 TEST METRICS

### Coverage

**Target Coverage**: >90% of acceptance criteria

| Story | Test Cases | Covered | Coverage % |
|-------|------------|---------|------------|
| EXEC-004 | TC-001 | 1/1 | 100% |
| MGR-004 | TC-002 | 1/1 | 100% |
| MGR-005 | TC-003 | 1/1 | 100% |
| MGR-006 | TC-004 | 1/1 | 100% |
| MGR-007 | TC-005 | 1/1 | 100% |
| EMP-004 | TC-006 | 1/1 | 100% |
| EXEC-003 | TC-007 | 1/1 | 100% |
| MGR-008 | TC-008 | 1/1 | 100% |

**Total**: 8 stories, 8 test cases, 100% coverage ✅

---

## 🐛 DEFECT TRACKING

### Known Issues (Before Testing)

| ID | Description | Severity | Status |
|----|-------------|----------|--------|
| ISS-W4-001 | AI OKR Review page blank | P0 Critical | Fixed (verify TC-001) |

### New Defects (Found During Testing)

| ID | Description | Severity | Found By | Date | Status |
|----|-------------|----------|----------|------|--------|
| ISS-W5-001 | ___ | ___ | ___ | ___ | Open |
| ISS-W5-002 | ___ | ___ | ___ | ___ | Open |

**Log new defects to**: [MASTER_ISSUES_LIST.md](../../MASTER_ISSUES_LIST.md)

---

## ✅ TEST SIGN-OFF

### Exit Criteria

**Week 5 testing complete when**:
- [ ] All 8 primary test cases (TC-001 to TC-008) passed
- [ ] E2E scenario (E2E-001) passed
- [ ] Regression tests passed (no Week 1-4 features broken)
- [ ] Security tests passed (role-based access works)
- [ ] UI/UX tests passed (responsive, loading states)
- [ ] Performance targets met (<2s load, <500ms API)
- [ ] All P0/P1 defects resolved
- [ ] Test report created

### Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | ___ | ___ | ___ |
| Dev Lead | ___ | ___ | ___ |
| Product Owner | ___ | ___ | ___ |

---

## 📎 APPENDICES

### Test Data

**File**: [test-data.sql](./test-data.sql) (to be created)

**Sample Teams**:
- Engineering Team (Manager: manager@test.com, Members: 3)
- Sales Team (Manager: manager2@test.com, Members: 2)
- Marketing Team (Manager: manager3@test.com, Members: 4)

**Sample Objectives**:
- Objective 1: "Increase revenue by 20%" (Owner: exec@test.com, Progress: 75%)
- Objective 2: "Launch new product" (Owner: manager@test.com, Progress: 50%)
- Objective 3: "Improve customer satisfaction" (Owner: employee@test.com, Progress: 30%)

---

## 🔗 REFERENCES

- [WEEK_5_PLAN.md](../../Daily_Handoffs/Week_5/WEEK_5_PLAN.md) - Implementation plan
- [WEEK_5_USER_STORIES_CORRECTIONS.md](../../WEEK_5_USER_STORIES_CORRECTIONS.md) - Corrected user stories
- [MVP_USER_STORIES.md](../../01_MVP/MVP_USER_STORIES.md) - Full user story details
- [MASTER_ISSUES_LIST.md](../../MASTER_ISSUES_LIST.md) - Known issues
- [INTEGRATION_TESTING_GUIDE.md](../../INTEGRATION_TESTING_GUIDE.md) - E2E testing guide

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Status**: ✅ Ready for Week 5 Testing
