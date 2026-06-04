# WEEK 5 DETAILED PLAN: Foundation - Teams + Objectives

**Version**: 2.0.0
**Created**: 2025-10-22
**Updated**: 2025-10-22 (Aligned with corrected user stories)
**Status**: Ready for Implementation
**Duration**: 5 days (40 hours)

---

## 🎯 WEEK 5 GOALS

**What Users Will Get**:
1. Create and manage teams with role-based access
2. View AI-generated objectives with progress tracking
3. Fix: AI OKR Review page displays generated OKRs correctly

**Success Criteria**:
- [ ] Admin can create teams, add members
- [ ] Managers can view their teams
- [ ] Employees can view team members (read-only)
- [ ] Objectives screen shows OKRs with filtering
- [ ] Week 4 critical bug resolved (ISS-W4-001)

---

## 📋 USER STORIES COVERED THIS WEEK

**Total Story Points**: 25 points (realistic for 5-day sprint)

### Bug Fixes (P0 - BLOCKING):
- **EXEC-004**: Fix AI OKR Review Bug [Week 5 Day 1] - 2 points 🔴

### Team Management (Days 1-3):
- **MGR-004**: Create New Team [Week 5 Day 3] - 3 points
- **MGR-005**: Add Team Members [Week 5 Day 3] - 3 points
- **MGR-006**: View Team List [Week 5 Day 3] - 5 points
- **MGR-007**: Remove Team Member [Week 5 Day 3] - 3 points

### Objectives Display (Day 4):
- **EMP-004**: View My Objectives [Week 5 Day 4] - 3 points
- **EXEC-003**: View All Company Objectives [Week 5 Day 4] - 5 points
- **MGR-008**: Track Objective Progress [Week 5 Day 4] - 3 points

**Reference**: [WEEK_5_USER_STORIES_CORRECTIONS.md](../../WEEK_5_USER_STORIES_CORRECTIONS.md)

**Deferred to Later Weeks**:
- ⬜ EXEC-005: Filter by Team/Department → Week 8
- ⬜ ADMIN-003: Admin User Management → Week 11
- ⬜ CSV Exports → Week 11
- ⬜ Progress Timelines → Week 10

**Testing**: [QA/sprints/sprint-05/test-plan.md](../../QA/sprints/sprint-05/test-plan.md)

---

## 📅 DAY-BY-DAY BREAKDOWN

### **DAY 1 (8 hours): Database + Critical Bug Fix**

**Morning (4 hours): Fix Week 4 Critical Issue**
- [ ] Debug `client/pages/scripts/ai-okr-review.js`
- [ ] Fix data fetching logic
- [ ] Test OKR generation → review flow
- [ ] Verify OKRs display correctly

**Afternoon (4 hours): Team Model**
- [ ] Create `server/models/Team.js`
  ```javascript
  {
    business_id, name, description, department,
    manager_id, manager_name,
    members: [{ user_id, user_name, role, status }],
    created_at, updated_at, is_active
  }
  ```
- [ ] Add indexes (business_id, manager_id)
- [ ] Add methods: addMember(), removeMember()

**Deliverables**:
- ✅ Week 4 bug fixed
- ✅ Team model ready

---

### **DAY 2 (8 hours): Team APIs**

**Full Day: Build 7 Team Endpoints**

1. **POST /api/teams/create** (Admin/Exec only)
   - Validate: name required, unique per business
   - Create team with initial members
   - Return: team object with _id

2. **GET /api/teams** (All roles, filtered by permission)
   - Admin/Exec: all teams in business
   - Manager: only their managed teams
   - Employee: teams they're member of

3. **GET /api/teams/:teamId**
   - Returns: team details with members array
   - Permission check: team member OR admin

4. **PUT /api/teams/:teamId**
   - Admin/Exec/Manager can update
   - Fields: name, description, manager_id

5. **DELETE /api/teams/:teamId**
   - Admin/Exec only
   - Soft delete (is_active = false)

6. **POST /api/teams/:teamId/members**
   - Add user to team
   - Validate: user not already in team

7. **DELETE /api/teams/:teamId/members/:userId**
   - Remove member from team
   - Validate: at least one member remains

**Testing**:
- [ ] Test each endpoint with Postman
- [ ] Test role-based access (403 for unauthorized)
- [ ] Test edge cases (duplicate members, etc.)

**Deliverables**:
- ✅ 7 Team API endpoints working
- ✅ Role-based permissions enforced

---

### **DAY 3 (8 hours): Team Management Frontend**

**Morning (4 hours): Build team.html**
- [ ] Copy `/Finalised_Mockups/05_team.html` to `/client/pages/team.html`
- [ ] Replace static data with API calls
- [ ] Implement role-based UI:
  - Admin: "Create Team" button visible
  - Manager: Can view/edit their teams only
  - Employee: Read-only view

**Afternoon (4 hours): Team JavaScript Logic**
- [ ] Create `client/pages/scripts/team.js`
  ```javascript
  // Key functions:
  - loadTeams() // Fetch teams from API
  - renderTeamCards() // Display team cards
  - createTeam() // Modal form submission
  - addMember() // Add member to team
  - removeMember() // Remove member
  - deleteTeam() // Delete team (admin only)
  ```
- [ ] Create `client/js/team-api-client.js` for API calls

**Testing**:
- [ ] Test as Admin: create, edit, delete team
- [ ] Test as Manager: view team, add/remove members
- [ ] Test as Employee: read-only view

**Deliverables**:
- ✅ Team management page functional
- ✅ Role-based UI working

---

### **DAY 4 (8 hours): Objectives Screen**

**Morning (4 hours): Build objectives.html**
- [ ] Copy `/Finalised_Mockups/03_objectives.html` to `/client/pages/objectives.html`
- [ ] Replace static data with API calls to `/api/objectives/my-dashboard`
- [ ] Implement filter buttons:
  - All Objectives
  - Needs Attention (< 50% progress)
  - On Track (50-80%)
  - Ahead (> 80%)

**Afternoon (4 hours): Objectives JavaScript Logic**
- [ ] Create `client/pages/scripts/objectives.js`
  ```javascript
  // Key functions:
  - loadObjectives() // Fetch from /api/objectives/my-dashboard
  - renderObjectiveCards() // Display with progress bars
  - filterObjectives(status) // Client-side filtering
  - calculateProgress() // Progress percentage
  - updatePriorityIndicator() // Red/yellow/green border
  ```
- [ ] Implement progress bar gradients
- [ ] Add priority color coding

**Testing**:
- [ ] Test with 0 objectives (empty state)
- [ ] Test with 3-5 objectives
- [ ] Test filtering (All, Needs Attention, etc.)
- [ ] Test progress bar colors

**Deliverables**:
- ✅ Objectives screen displays OKRs
- ✅ Filtering works
- ✅ Progress tracking visual

---

### **DAY 5 (8 hours): Integration Testing + Polish**

**Morning (2 hours): End-to-End Testing**
- [ ] Complete user flow test:
  1. Admin creates team "Sales Team"
  2. Adds 3 members
  3. Members take assessment (existing flow)
  4. Generate OKRs
  5. OKRs appear on Objectives screen
  6. Filter objectives

**Mid-Day (3 hours): Bug Fixes**
- [ ] Fix any issues found during E2E testing
- [ ] Add loading states to team page
- [ ] Add error messages (API failures)
- [ ] Polish UI responsiveness

**Afternoon (3 hours): Documentation**
- [ ] Update MASTER_DEV_LIST.md (mark Week 5 complete)
- [ ] Create Week 5 completion summary
- [ ] Create WEEK_6_DETAILED_PLAN.md for next week
- [ ] Document any new issues in MASTER_ISSUES_LIST.md

**Deliverables**:
- ✅ Week 5 fully tested
- ✅ All bugs fixed
- ✅ Documentation updated
- ✅ Week 6 plan ready

---

## 🗄️ DATABASE CHANGES

### New Collection: `teams`
```javascript
{
  _id: ObjectId,
  business_id: ObjectId,
  name: String,            // "Sales Team"
  description: String,     // "Revenue growth team"
  department: String,      // "Sales"
  function: String,        // "Revenue"
  manager_id: ObjectId,
  manager_name: String,    // Denormalized for performance
  members: [
    {
      user_id: ObjectId,
      user_name: String,
      user_email: String,
      role: String,        // MANAGER, EMPLOYEE, etc.
      joined_at: Date,
      status: String       // "active", "inactive"
    }
  ],
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date,
  is_active: Boolean,
  member_count: Number     // Calculated field
}
```

### Indexes:
```javascript
db.teams.createIndex({ business_id: 1 })
db.teams.createIndex({ manager_id: 1 })
db.teams.createIndex({ "members.user_id": 1 })
```

---

## 🔌 API ENDPOINTS

### 1. POST /api/teams/create
**Auth**: Admin, Executive, Business Owner
**Body**:
```json
{
  "name": "Sales Team",
  "description": "Revenue growth",
  "department": "Sales",
  "manager_id": "user_id_123",
  "initial_members": ["user_id_1", "user_id_2"]
}
```
**Response**:
```json
{
  "success": true,
  "team": { "_id": "team_id", "name": "Sales Team", ... }
}
```

### 2. GET /api/teams?business_id=xxx
**Auth**: All roles (role-filtered results)
**Response**:
```json
{
  "success": true,
  "teams": [...]
}
```

### 3-7. (See Day 2 section for full specifications)

---

## 🎨 FRONTEND PAGES

### 1. /client/pages/team.html
**Source**: `/Finalised_Mockups/05_team.html`
**Features**:
- Team cards grid
- "Create Team" button (Admin only)
- Team member list
- Add/Remove member modals

### 2. /client/pages/objectives.html
**Source**: `/Finalised_Mockups/03_objectives.html`
**Features**:
- Objective cards with progress rings
- Filter buttons
- Priority color-coding
- KR display with progress bars

---

## ✅ TESTING CHECKLIST

### Day 1:
- [ ] AI OKR Review page displays OKRs
- [ ] Team model creates successfully
- [ ] Indexes created

### Day 2:
- [ ] All 7 API endpoints tested
- [ ] Role-based access enforced
- [ ] Error handling works

### Day 3:
- [ ] Team page loads correctly
- [ ] Create team works (Admin)
- [ ] Role-based UI correct

### Day 4:
- [ ] Objectives display correctly
- [ ] Filtering works
- [ ] Progress bars accurate

### Day 5:
- [ ] End-to-end flow works
- [ ] No console errors
- [ ] Mobile responsive

---

## 🚨 KNOWN RISKS

1. **Week 4 Bug Complexity**: May take longer than 4 hours
   - **Mitigation**: Allocate Day 1 afternoon as buffer if needed

2. **Role-Based Access**: Complex permission logic
   - **Mitigation**: Test thoroughly with all 3 roles

3. **Data Migration**: Existing users need team assignment
   - **Mitigation**: Create migration script if needed

---

## 📝 SUCCESS METRICS

**Week 5 Complete When**:
- [ ] Week 4 critical bug fixed ✅
- [ ] Team CRUD working ✅
- [ ] Objectives screen functional ✅
- [ ] All tests passing ✅
- [ ] No P0/P1 bugs remaining ✅

---

**Next Week**: WEEK_6_DETAILED_PLAN.md (Create at end of Week 5)
