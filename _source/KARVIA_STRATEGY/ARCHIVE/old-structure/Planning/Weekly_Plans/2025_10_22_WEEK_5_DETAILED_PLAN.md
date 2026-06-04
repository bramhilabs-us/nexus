# Week 5 - Detailed Implementation Plan
## Team Management & Objectives Screens

**Sprint Goal:** Build complete Team Management and Objectives screens with role-based access and team-based assessment workflows

**Dates:** Week 5 (5 days)
**Priority:** 🟢 HIGH - Critical for MVP completion
**Dependencies:** Week 4 (Assessment system, Database models)

---

## 📋 Executive Summary

### What We're Building

**Two Core Features:**
1. **Team Management Screen** - Create, manage, and view teams with role-based permissions
2. **Objectives Screen** - Display generated OKRs with KRs, progress tracking, and filtering

### The Complete User Flow

```
ADMIN/EXEC Flow:
1. Admin/Exec logs in
2. Goes to Team page
3. Creates teams (e.g., "Sales Team", "Engineering Team")
4. Adds members to teams (assigns users to teams)
5. Goes to Assessment page
6. Sends assessment to entire team (all team members get invitations)
7. Team members complete assessments
8. Admin/Exec views aggregated results per team
9. Admin/Exec/Consultant generates OKRs from team assessment
10. Redirects to Objectives screen
11. Views 4-5 generated objectives with KRs
12. Can filter, update progress, view AI insights

MANAGER Flow:
1. Manager logs in
2. Goes to Team page
3. Views their team members
4. Can manage (update, remove) their team members
5. Cannot create new teams or delete teams
6. Can send assessments to their team
7. Views their team's assessment results
8. Views their team's objectives

EMPLOYEE Flow:
1. Employee logs in
2. Goes to Team page
3. Views team members (read-only)
4. Cannot manage or create teams
5. Can view shared team objectives
6. Can update progress on assigned objectives
```

---

## 🎯 Success Criteria

### Week 5 Must-Have (MVP)

**Team Management:**
- [ ] Admin/Exec can create teams
- [ ] Admin/Exec can add/remove members to/from teams
- [ ] Admin/Exec can delete teams
- [ ] Managers can view and manage their team members
- [ ] Employees can view team members (read-only)
- [ ] Teams stored in database with proper relationships

**Objectives Screen:**
- [ ] Display generated OKRs from assessment
- [ ] Show 4-5 objectives with their KRs
- [ ] Progress bars and completion percentages
- [ ] Filter by priority (High/Medium/Low)
- [ ] Role-based display (what you can see/edit)

**Integration:**
- [ ] Assessment invitations can be sent to entire team
- [ ] Team-based assessment results aggregation
- [ ] Generated OKRs linked to team and assessment
- [ ] Proper navigation between screens

### Should-Have (Stretch Goals)

- [ ] Bulk team member import (CSV)
- [ ] Team performance metrics
- [ ] Objective editing on Objectives screen
- [ ] Task breakdown per objective
- [ ] AI insights per team

### Won't-Have This Week

- ❌ Team analytics dashboard
- ❌ Advanced permission management
- ❌ Team objectives approval workflow (Week 6)
- ❌ Cross-team collaboration features
- ❌ Team chat/comments

---

## 🗂️ Database Schema Changes

### New Collection: `teams`

```javascript
{
  _id: ObjectId,
  business_id: ObjectId,  // Company/Business
  name: String,  // "Sales Team", "Engineering Team"
  description: String,  // "Responsible for revenue growth"
  department: String,  // "Sales", "Engineering", "Marketing"
  function: String,  // "Revenue", "Product", "Support"

  // Team Lead/Manager
  manager_id: ObjectId,  // Reference to User
  manager_name: String,  // Denormalized for performance

  // Members
  members: [
    {
      user_id: ObjectId,
      user_name: String,
      user_email: String,
      role: String,  // "MANAGER", "EMPLOYEE", "CONSULTANT"
      joined_at: Date,
      status: String  // "active", "inactive"
    }
  ],

  // Metadata
  created_by: ObjectId,  // Who created the team
  created_at: Date,
  updated_at: Date,
  is_active: Boolean,

  // Stats (calculated fields)
  member_count: Number,
  active_objectives_count: Number,
  team_performance_score: Number  // Average of all members
}
```

### Updated Collection: `invitations`

Add team support:

```javascript
{
  // ... existing fields ...

  team_id: ObjectId,  // NEW: If invitation sent to team
  team_name: String,  // NEW: Denormalized

  // Batch invitation tracking
  is_team_invitation: Boolean,  // NEW
  batch_id: String,  // NEW: Group team invitations
  total_in_batch: Number  // NEW
}
```

### Updated Collection: `assessments`

Add team context:

```javascript
{
  // ... existing fields ...

  team_id: ObjectId,  // NEW: Which team this assessment is for
  team_name: String,  // NEW: Denormalized
  is_team_assessment: Boolean  // NEW
}
```

### Updated Collection: `objectives`

Already has most fields needed, but ensure:

```javascript
{
  // ... existing fields ...

  team_id: ObjectId,  // Link objective to team
  team_name: String,

  // Make sure these exist:
  priority: String,  // "high", "medium", "low"
  effort_estimate: String,  // "small", "medium", "large"
  timeline: {
    target_year: Number,
    quarters: [Number],
    startDate: Date,
    endDate: Date
  }
}
```

---

## 📐 API Endpoints to Build

### Team Management APIs

#### 1. Create Team
```
POST /api/teams/create
Authorization: ADMIN, EXECUTIVE, BUSINESS_OWNER
Body: {
  name: "Sales Team",
  description: "Revenue growth and customer acquisition",
  department: "Sales",
  function: "Revenue",
  manager_id: "user_id",
  initial_members: ["user_id_1", "user_id_2"]
}
Response: {
  success: true,
  team: { _id, name, members, ... }
}
```

#### 2. Get All Teams
```
GET /api/teams
Authorization: All roles (filtered by permission)
Query: ?business_id=xxx
Response: {
  success: true,
  teams: [
    { _id, name, member_count, manager_name, ... }
  ]
}

Role-based filtering:
- ADMIN/EXEC: See all teams in business
- MANAGER: See only their managed teams
- EMPLOYEE: See only teams they're member of
```

#### 3. Get Team Details
```
GET /api/teams/:teamId
Authorization: Team members + ADMIN/EXEC
Response: {
  success: true,
  team: {
    _id, name, description, members: [...],
    objectives_count, performance_score, ...
  }
}
```

#### 4. Add Member to Team
```
POST /api/teams/:teamId/members
Authorization: ADMIN, EXECUTIVE, MANAGER (of that team)
Body: {
  user_id: "xxx",
  role: "EMPLOYEE"
}
Response: {
  success: true,
  team: { updated team with new member }
}
```

#### 5. Remove Member from Team
```
DELETE /api/teams/:teamId/members/:userId
Authorization: ADMIN, EXECUTIVE, MANAGER (of that team)
Response: {
  success: true,
  message: "Member removed successfully"
}
```

#### 6. Update Team
```
PUT /api/teams/:teamId
Authorization: ADMIN, EXECUTIVE, MANAGER (of that team)
Body: {
  name: "New Team Name",
  description: "Updated description",
  manager_id: "new_manager_id"
}
Response: {
  success: true,
  team: { updated team }
}
```

#### 7. Delete Team
```
DELETE /api/teams/:teamId
Authorization: ADMIN, EXECUTIVE only
Response: {
  success: true,
  message: "Team deleted successfully"
}
```

### Assessment + Team Integration APIs

#### 8. Send Team Assessment
```
POST /api/invitations/send-to-team
Authorization: ADMIN, EXECUTIVE, MANAGER
Body: {
  team_id: "xxx",
  assessment_template_id: "xxx",
  message: "Please complete this assessment"
}
Response: {
  success: true,
  batch_id: "batch_xxx",
  invitations_sent: 12,
  invitations: [...]
}

Backend logic:
1. Get all active members of team
2. Create individual invitation for each member
3. Link all invitations with same batch_id and team_id
4. Send emails to all members
```

#### 9. Get Team Assessment Results
```
GET /api/assessments/team/:teamId/results
Authorization: ADMIN, EXECUTIVE, MANAGER (of that team)
Query: ?status=completed&from_date=2024-01-01
Response: {
  success: true,
  team: { name, member_count },
  assessments: [
    {
      user_id, user_name, assessment_id,
      completed_at, overall_score,
      dimensions: { speed, strength, intelligence }
    }
  ],
  aggregated: {
    completion_rate: "83%",  // 10/12 completed
    average_score: 67,
    weak_dimensions: ["speed", "intelligence"],
    recommendations: [...]
  }
}
```

### Objectives Display APIs

#### 10. Get User Objectives
```
GET /api/objectives/my-dashboard
Authorization: All authenticated users
Query: ?quarter=Q4&year=2024&priority=high
Response: {
  success: true,
  objectives: [
    {
      _id, title, description, category, priority,
      progress_percentage, status,
      key_results: [...],
      timeline: {...},
      weak_area_reference: {...}
    }
  ],
  stats: {
    total: 5,
    active: 3,
    completed: 2,
    average_progress: 67
  }
}
```

#### 11. Get Team Objectives
```
GET /api/objectives/team/:teamId
Authorization: Team members + ADMIN/EXEC
Response: {
  success: true,
  team: { name, ... },
  objectives: [...]
}
```

---

## 🎨 Frontend Pages to Build

### 1. Team Management Page (`/pages/team.html`)

**File:** `client/pages/team.html`
**Route:** `http://localhost:8080/pages/team.html`

**Features by Role:**

**For ADMIN/EXECUTIVE:**
- Button: "Create New Team"
- List of all teams (cards)
- Each team card shows:
  - Team name
  - Member count
  - Manager name
  - Quick actions: View, Edit, Delete
- Modal: Create Team
  - Form fields: name, description, department, function, manager
  - Member selector (searchable)
- Modal: Edit Team
  - Update team details
  - Add/remove members
- Modal: Delete Team (confirmation)

**For MANAGER:**
- View their managed teams only
- Can view team members
- Can add/remove members (not create/delete teams)
- "Add Member" button
- "Send Assessment" button

**For EMPLOYEE:**
- View teams they're member of (read-only)
- Team member list (read-only)
- No action buttons

**UI Components:**
- Team cards grid (responsive)
- Member list with avatars
- Filter: All Teams / My Teams / By Department
- Search teams by name

### 2. Objectives Page (`/pages/objectives.html`)

**File:** `client/pages/objectives.html`
**Route:** `http://localhost:8080/pages/objectives.html`

**Based on mockup analysis:**

**Layout:**
```
┌─────────────────────────────────────────────┐
│ Header: "Your Objectives" | Q4 2024 | +Add  │
├─────────────────────────────────────────────┤
│ Quick Stats (4 cards)                       │
│ - Active Objectives                         │
│ - Overall Progress                          │
│ - Key Results                               │
│ - AI Accuracy                               │
├─────────────────────────────────────────────┤
│ Focus: Priority Overview (Top 3)            │
│ [High Priority] [Medium] [Low] [Medium]     │
├─────────────────────────────────────────────┤
│ Filters: All | Needs Attention | On Track   │
├─────────────────────────────────────────────┤
│ Objectives Grid (2 columns)                 │
│ ┌─────────────────┐ ┌─────────────────┐    │
│ │ Objective 1     │ │ Objective 2     │    │
│ │ 23% Progress    │ │ 78% Progress    │    │
│ │ ─────────       │ │ ──────────────  │    │
│ │ 4 KRs           │ │ 3 KRs           │    │
│ │ [Tasks][Update] │ │ [Tasks][Update] │    │
│ └─────────────────┘ └─────────────────┘    │
│ ┌─────────────────┐ ┌─────────────────┐    │
│ │ Objective 3     │ │ Objective 4     │    │
│ └─────────────────┘ └─────────────────┘    │
├─────────────────────────────────────────────┤
│ AI Insights (3 cards at bottom)             │
└─────────────────────────────────────────────┘
```

**Features:**
- Display objectives from database
- Each objective card shows:
  - Title
  - Description
  - Progress percentage
  - Progress bar (gradient purple/blue)
  - Priority indicator (red/yellow/green border)
  - Status badge (On Track, Needs Attention, Ahead)
  - Top 2 Key Results with progress
  - Quick stats: "2 KRs on track, 2 need attention"
  - Actions: Tasks button, Update button
- Filter buttons:
  - All Objectives
  - Needs Attention (< 50% progress)
  - On Track (50-80%)
  - Ahead of Schedule (> 80%)
- Priority Overview section (top 3 focus areas)
- AI Insights section at bottom

---

## 📝 User Stories & Acceptance Criteria

### Epic 1: Team Management

#### Story 1.1: Admin Creates Team
**As an** Admin/Executive
**I want to** create a new team
**So that** I can organize employees and send team-based assessments

**Acceptance Criteria:**
- [ ] Admin sees "Create Team" button on team page
- [ ] Click opens modal with form (name, description, department, manager, members)
- [ ] Manager dropdown populated from users with MANAGER role
- [ ] Members multi-select populated from all employees
- [ ] Form validation: name required, must be unique per business
- [ ] Submit creates team in database
- [ ] Success message shown
- [ ] Team appears in team list immediately
- [ ] Creator auto-assigned as team admin

**Test Cases:**
1. Create team with valid data → Success
2. Create team with duplicate name → Error "Team name already exists"
3. Create team without name → Error "Name is required"
4. Create team with 0 members → Success (can add later)
5. Create team with 50 members → Success (bulk add)

---

#### Story 1.2: Admin Manages Team Members
**As an** Admin/Executive
**I want to** add and remove team members
**So that** I can keep teams up-to-date as people join/leave

**Acceptance Criteria:**
- [ ] Admin clicks team card → Opens team detail view
- [ ] Team detail shows all current members with avatars, names, roles
- [ ] "Add Member" button opens member selector
- [ ] Member selector shows available employees (not already in team)
- [ ] Select member → Confirm → Member added to team
- [ ] Each member has "Remove" button (trash icon)
- [ ] Click remove → Confirmation modal "Remove [name] from [team]?"
- [ ] Confirm → Member removed from team
- [ ] Removal doesn't delete user, just removes from team

**Test Cases:**
1. Add employee to team → Employee appears in member list
2. Remove employee from team → Employee no longer in list
3. Try to add same employee twice → Not allowed (greyed out)
4. Remove last member from team → Team still exists, just empty
5. Add manager to team → Manager appears with badge "Manager"

---

#### Story 1.3: Manager Views Their Team
**As a** Manager
**I want to** view my team members
**So that** I can see who I'm managing and their status

**Acceptance Criteria:**
- [ ] Manager logs in → Goes to Team page
- [ ] Sees only teams they manage (not all teams)
- [ ] Team card shows member count, performance score
- [ ] Click team → Opens team detail
- [ ] Sees list of all team members with:
  - Avatar, name, role
  - Objective progress (average)
  - Last activity timestamp
  - Status indicator (active/inactive)
- [ ] Can see shared team objectives
- [ ] Cannot see "Create Team" or "Delete Team" buttons
- [ ] Can see "Add Member" and "Remove Member" buttons (for their team only)

**Test Cases:**
1. Manager with 1 team → Sees 1 team
2. Manager with 0 teams → Sees empty state "No teams assigned"
3. Manager tries to view another manager's team → 403 Forbidden
4. Manager can add member to their team → Success
5. Manager cannot delete team → Button not visible

---

#### Story 1.4: Employee Views Team (Read-Only)
**As an** Employee
**I want to** view my team members
**So that** I know who I'm working with

**Acceptance Criteria:**
- [ ] Employee logs in → Goes to Team page
- [ ] Sees teams they're member of (not managing)
- [ ] Team card shows team name, member count, manager name
- [ ] Click team → Opens read-only team view
- [ ] Sees list of team members (no action buttons)
- [ ] Sees shared team objectives (read-only)
- [ ] NO "Create Team" button
- [ ] NO "Add/Remove Member" buttons
- [ ] NO "Delete Team" button
- [ ] NO "Edit Team" button

**Test Cases:**
1. Employee in 1 team → Sees 1 team
2. Employee in multiple teams → Sees all teams
3. Employee in 0 teams → Sees message "Not assigned to any team yet"
4. Employee clicks team → Opens, shows members, no edit buttons
5. Employee tries API to delete team → 403 Forbidden

---

### Epic 2: Team-Based Assessments

#### Story 2.1: Send Assessment to Team
**As an** Admin/Executive/Manager
**I want to** send assessment to entire team at once
**So that** I don't have to invite each member individually

**Acceptance Criteria:**
- [ ] On Assessment page, "Send Assessment" button visible
- [ ] Click opens modal with:
  - Assessment template selector
  - Recipient selector with "Send to Team" option
  - Team selector (dropdown of teams)
- [ ] Select team → Shows member count preview "Will send to 12 members"
- [ ] Confirm → Creates invitations for all team members
- [ ] Each invitation linked to team_id and same batch_id
- [ ] Success message: "Assessment sent to 12 members of Sales Team"
- [ ] All team members receive email invitation
- [ ] Each invitation has team context in UI

**Test Cases:**
1. Send assessment to 10-member team → 10 invitations created
2. Send assessment to team with 1 inactive member → Only 9 active get invited
3. Team member already has pending invitation → Skip (no duplicate)
4. Send to team with 0 members → Error "Team has no members"
5. Check batch_id → All invitations have same batch_id

---

#### Story 2.2: View Team Assessment Results
**As an** Admin/Executive
**I want to** view aggregated assessment results per team
**So that** I can understand team-wide strengths and weaknesses

**Acceptance Criteria:**
- [ ] On Assessment Results page, filter by "View by Team"
- [ ] Dropdown shows all teams in business
- [ ] Select team → Shows aggregated results:
  - Completion rate (e.g., "10/12 completed")
  - Average overall score (e.g., 67%)
  - Team weak dimensions (Speed: 45%, Intelligence: 52%)
  - Individual member results in table
  - Chart: Score distribution across team
- [ ] Can click individual member → View their detailed results
- [ ] "Generate Team OKRs" button visible
- [ ] Click → Generates OKRs for team based on aggregated weak areas

**Test Cases:**
1. View results for team with 100% completion → All scores shown
2. View results for team with 50% completion → Shows completed only
3. Generate team OKRs → OKRs linked to team_id
4. Manager views their team results → Success
5. Manager tries to view other team's results → 403 Forbidden

---

### Epic 3: Objectives Display

#### Story 3.1: View Generated Objectives
**As a** User (any role)
**I want to** see generated objectives from my assessment
**So that** I know what goals to work towards

**Acceptance Criteria:**
- [ ] After OKR generation, redirected to Objectives page
- [ ] Sees 4-5 objective cards in grid layout
- [ ] Each card shows:
  - Objective title (e.g., "Accelerate Revenue Growth by 10%")
  - Description
  - Progress percentage (e.g., 23%)
  - Progress bar (gradient purple/blue)
  - Priority indicator (border color: red/yellow/green)
  - Status badge (On Track, Needs Attention, Ahead)
  - Top 2 key results with progress bars
  - Timeline (e.g., "Q4 2024 • Week 3/12")
  - Action buttons: "Tasks", "Update"
- [ ] Priority border colors:
  - High (red): < 50% progress
  - Medium (yellow): 50-70%
  - Low (green): > 70%
- [ ] Objectives sorted by priority (high first)

**Test Cases:**
1. User with 3 objectives → Sees 3 cards
2. User with 0 objectives → Sees empty state "No objectives yet"
3. Objective at 23% progress → Yellow/medium priority
4. Objective at 85% progress → Green/low priority (ahead)
5. Click "Tasks" button → Opens task view (placeholder for now)

---

#### Story 3.2: Filter Objectives
**As a** User
**I want to** filter objectives by status
**So that** I can focus on what needs attention

**Acceptance Criteria:**
- [ ] Filter buttons above objective list:
  - "All Objectives" (default active)
  - "Needs Attention" (< 50% progress)
  - "On Track" (50-80%)
  - "Ahead of Schedule" (> 80%)
- [ ] Click filter → Only matching objectives shown
- [ ] Active filter has gradient background (purple/blue)
- [ ] Count updates: "2 of 5 objectives"
- [ ] Filter state persists on page refresh

**Test Cases:**
1. Click "Needs Attention" → Only shows objectives < 50%
2. Click "On Track" → Shows 50-80% objectives
3. Click "Ahead" → Shows > 80% objectives
4. Click "All" → Shows all objectives
5. No objectives match filter → "No objectives found" message

---

#### Story 3.3: View Objective Details
**As a** User
**I want to** see all key results for an objective
**So that** I understand what I need to achieve

**Acceptance Criteria:**
- [ ] Each objective card shows top 2 KRs inline
- [ ] Shows "2 KRs on track, 2 need attention" summary
- [ ] Click objective card → Expands to show all KRs
- [ ] Each KR shows:
  - Title (e.g., "MRR: $152K → $167K")
  - Current value → Target value
  - Progress percentage
  - Progress bar (color-coded by status)
  - Quarter target (Q1, Q2, Q3, Q4)
  - Last updated timestamp
- [ ] KRs color-coded:
  - Green: On track (> 70%)
  - Yellow: Warning (40-70%)
  - Red: At risk (< 40%)
- [ ] Click "Update" button → Opens update modal (future feature)

**Test Cases:**
1. Objective with 4 KRs → Shows 2 inline, "View 2 more" link
2. Expand objective → All 4 KRs visible
3. KR at 87% → Green background, "On track" badge
4. KR at 37% → Red background, "At risk" badge
5. Click KR → Shows detail view with update history

---

### Epic 4: Integration & Navigation

#### Story 4.1: Team → Assessment → Objectives Flow
**As an** Executive
**I want to** complete the full workflow from creating team to seeing objectives
**So that** I can manage team performance end-to-end

**Acceptance Criteria:**
- [ ] Step 1: Create team "Sales Team" with 5 members → Success
- [ ] Step 2: Go to Assessment page
- [ ] Step 3: Send assessment to "Sales Team" → 5 invitations sent
- [ ] Step 4: Team members complete assessments (simulated)
- [ ] Step 5: View team assessment results → Shows aggregated scores
- [ ] Step 6: Click "Generate Team OKRs" → OKRs generated
- [ ] Step 7: Redirected to Objectives page
- [ ] Step 8: See 4 team objectives linked to "Sales Team"
- [ ] Step 9: Each objective shows team name "Sales Team"
- [ ] Step 10: Can filter to show only "Sales Team" objectives

**Test Cases:**
1. Complete full flow → All steps work
2. Generated OKRs have team_id set → Correct
3. Objectives page shows team name → "Sales Team"
4. Manager of Sales Team can see objectives → Success
5. Employee from different team cannot see → 403 Forbidden

---

## 🛠️ Technical Implementation Details

### Phase 1: Backend (Days 1-2)

**Day 1: Database & Models**
1. Create `Team` model (`server/models/Team.js`)
   - Schema as defined above
   - Indexes: business_id, manager_id, members.user_id
   - Virtual fields: member_count, active_members
   - Methods: addMember, removeMember, getMemberIds

2. Update `Invitation` model
   - Add team_id, team_name fields
   - Add is_team_invitation, batch_id fields

3. Update `Assessment` model
   - Add team_id, team_name fields
   - Add is_team_assessment field

4. Update `Objective` model
   - Ensure team_id, team_name fields exist

**Day 2: API Routes**
1. Create `server/routes/teams.js`
   - POST /create
   - GET /
   - GET /:teamId
   - PUT /:teamId
   - DELETE /:teamId
   - POST /:teamId/members
   - DELETE /:teamId/members/:userId

2. Update `server/routes/invitations.js`
   - POST /send-to-team

3. Update `server/routes/assessments.js`
   - GET /team/:teamId/results

4. Update `server/routes/objectives.js`
   - GET /team/:teamId

### Phase 2: Frontend (Days 3-4)

**Day 3: Team Management Page**
1. Copy mockup `team.html` to `client/pages/team.html`
2. Create `client/pages/scripts/team.js`
   - loadTeams()
   - renderTeamCards()
   - openCreateTeamModal()
   - createTeam()
   - openTeamDetails()
   - addMemberToTeam()
   - removeMemberFromTeam()
   - deleteTeam()
   - filterTeams()

3. Create `client/js/team-api-client.js`
   - TeamAPI.getAll()
   - TeamAPI.create()
   - TeamAPI.update()
   - TeamAPI.delete()
   - TeamAPI.addMember()
   - TeamAPI.removeMember()

4. Role-based UI logic
   - Hide/show buttons based on user role
   - Filter teams based on permissions

**Day 4: Objectives Page**
1. Copy mockup `objectives.html` to `client/pages/objectives.html`
2. Create `client/pages/scripts/objectives.js`
   - loadObjectives()
   - renderObjectiveCards()
   - calculateProgress()
   - filterObjectives()
   - updateObjectiveProgress() (placeholder)

3. Create `client/js/objective-api-client.js` (if not exists)
   - ObjectiveAPI.getMyDashboard()
   - ObjectiveAPI.getTeamObjectives()
   - ObjectiveAPI.update()

4. Connect to generated OKRs
   - Fetch from database
   - Display with correct styling
   - Show priority indicators
   - Show KRs with progress

### Phase 3: Integration & Testing (Day 5)

**Day 5: Integration**
1. Update Assessment page
   - Add "Send to Team" option in invitation modal
   - Add team selector dropdown
   - Show member count preview

2. Update Assessment Results page
   - Add "View by Team" filter
   - Show aggregated team results
   - Link to Generate Team OKRs

3. Fix Week 4 issue: AI OKR Review page
   - Debug display bug
   - Ensure generated OKRs show correctly
   - Test redirect flow

4. End-to-End Testing
   - Test complete user flow (all stories)
   - Test role-based permissions
   - Test edge cases
   - Fix bugs

---

## 📊 Data Flow Diagrams

### Team Creation Flow
```
User (Admin) → Frontend: Click "Create Team"
Frontend → User: Show modal form
User → Frontend: Submit form
Frontend → API: POST /api/teams/create
API → DB: Insert team document
DB → API: Team created (with _id)
API → Frontend: { success: true, team: {...} }
Frontend → User: Success message, show team card
```

### Send Team Assessment Flow
```
User (Exec) → Frontend: Click "Send Assessment", select team
Frontend → API: GET /api/teams/:teamId (get members)
API → Frontend: { members: [...] }
Frontend → User: Show preview "Send to 12 members"
User → Frontend: Confirm
Frontend → API: POST /api/invitations/send-to-team
API → DB: Create 12 invitations (same batch_id, team_id)
API → Email Service: Send 12 emails
Email Service → API: Emails sent
API → Frontend: { success: true, count: 12 }
Frontend → User: "Assessment sent to 12 members"
```

### View Team Assessment Results Flow
```
User (Exec) → Frontend: Go to Results, select team
Frontend → API: GET /api/assessments/team/:teamId/results
API → DB: Find assessments where team_id = X
DB → API: Return assessments[]
API → Service: Calculate aggregated scores
Service → API: { aggregated: {...} }
API → Frontend: { assessments: [...], aggregated: {...} }
Frontend → User: Show table + charts
```

### Generate Team OKRs → Display Flow
```
User (Exec) → Frontend: Click "Generate Team OKRs"
Frontend → API: POST /api/ai-okr/generate/:assessmentId
API → Service: analyzeTeamWeakAreas(team_id)
Service → DB: Get all team assessments
Service → Service: Calculate team aggregates
Service → Service: Generate 4-5 objectives
Service → DB: Save objectives with team_id
DB → Service: Objectives saved
Service → API: { success: true, objectives: [...] }
API → Frontend: { data: { objectives: [...] } }
Frontend → Frontend: Redirect to /pages/objectives.html?team_id=X
Frontend → API: GET /api/objectives/team/:teamId
API → DB: Find objectives where team_id = X
DB → API: Return objectives[]
API → Frontend: { objectives: [...] }
Frontend → User: Render objective cards
```

---

## 🎨 UI/UX Specifications

### Design System (From Mockups)

**Colors:**
- Primary Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Success Green: `#10b981`
- Warning Yellow: `#f59e0b`
- Danger Red: `#ef4444`
- Blue: `#3b82f6`
- Purple: `#8b5cf6`

**Typography:**
- Font Family: `'Inter', sans-serif`
- Heading: `font-bold text-gray-900`
- Body: `text-gray-600`
- Small: `text-xs text-gray-500`

**Components:**
- Cards: `bg-white border border-gray-200 rounded-xl p-6 shadow-sm`
- Buttons Primary: `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg`
- Progress Bar: `bg-gray-200 rounded-full h-2` with gradient fill
- Badges: `px-2 py-1 rounded-full text-xs font-medium`

**Responsive Breakpoints:**
- Mobile: < 768px (1 column)
- Tablet: 768-1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

---

## ✅ Definition of Done

### Feature is considered complete when:

**Backend:**
- [ ] All API endpoints implemented and tested
- [ ] Database models created with indexes
- [ ] Role-based permissions enforced
- [ ] Error handling for all edge cases
- [ ] API returns consistent response structure
- [ ] Logs added for debugging

**Frontend:**
- [ ] UI matches mockups (responsive)
- [ ] All user interactions work
- [ ] Role-based UI elements show/hide correctly
- [ ] Error messages displayed to user
- [ ] Loading states shown during API calls
- [ ] Success messages after actions

**Integration:**
- [ ] End-to-end user flow works
- [ ] Data persists correctly to database
- [ ] Navigation between pages works
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari

**Testing:**
- [ ] Manual testing completed for all stories
- [ ] Role-based testing (Admin, Manager, Employee)
- [ ] Edge cases tested
- [ ] No critical bugs remaining

**Documentation:**
- [ ] API endpoints documented in code comments
- [ ] Complex logic explained in comments
- [ ] README updated with new features

---

## 🚀 Week 5 Day-by-Day Plan

### Day 1: Database & API Foundation
**Goal:** Backend infrastructure ready

**Tasks:**
- [ ] Create Team model with schema
- [ ] Add migration script to add team fields to existing collections
- [ ] Create teams API routes (CRUD)
- [ ] Test API with Postman/curl
- [ ] Create seed script with 2-3 sample teams

**Deliverable:** All team APIs working, tested via API client

---

### Day 2: Team API Integration & Assessment Updates
**Goal:** Team-based assessment workflows

**Tasks:**
- [ ] Implement send-to-team invitation endpoint
- [ ] Update invitation model with team fields
- [ ] Implement team assessment results aggregation
- [ ] Update assessment routes for team context
- [ ] Test team invitation flow end-to-end

**Deliverable:** Can send assessment to team, view aggregated results

---

### Day 3: Team Management Frontend
**Goal:** Users can create and manage teams

**Tasks:**
- [ ] Build team.html page (copy from mockup)
- [ ] Implement team-api-client.js
- [ ] Build team.js page logic
- [ ] Add role-based UI logic
- [ ] Test create, view, edit, delete team flows

**Deliverable:** Fully functional Team Management page

---

### Day 4: Objectives Screen Frontend
**Goal:** Users can view generated objectives

**Tasks:**
- [ ] Build objectives.html page (copy from mockup)
- [ ] Implement objectives page logic
- [ ] Connect to objectives API
- [ ] Implement filtering
- [ ] Add priority indicators and progress bars
- [ ] Show key results

**Deliverable:** Fully functional Objectives page displaying generated OKRs

---

### Day 5: Integration, Bug Fixes & Testing
**Goal:** Everything works end-to-end

**Tasks:**
- [ ] Fix Week 4 critical issue (AI OKR Review page)
- [ ] Integrate team selector in assessment invitation
- [ ] Test complete user flow (create team → assess → generate → view)
- [ ] Test all roles (Admin, Manager, Employee)
- [ ] Fix any bugs found
- [ ] Update documentation

**Deliverable:** Working Week 5 MVP, ready for user testing

---

## 📋 Testing Checklist

### Manual Test Scenarios

#### Admin/Executive Tests
1. [ ] Create team with name, description, manager, 5 members → Success
2. [ ] View all teams → Sees all teams in business
3. [ ] Edit team → Update name → Success
4. [ ] Add member to team → Member added
5. [ ] Remove member from team → Member removed
6. [ ] Delete team → Team deleted, members remain as users
7. [ ] Send assessment to team → All members get invitations
8. [ ] View team assessment results → See aggregated scores
9. [ ] Generate team OKRs → OKRs created with team_id
10. [ ] View objectives → See generated OKRs

#### Manager Tests
1. [ ] Login as manager → Go to Team page
2. [ ] See only managed teams → Correct
3. [ ] Try to see other manager's team → 403 Forbidden
4. [ ] Add member to managed team → Success
5. [ ] Try to delete team → Button not visible
6. [ ] Send assessment to managed team → Success
7. [ ] View team assessment results → Success
8. [ ] View team objectives → Success

#### Employee Tests
1. [ ] Login as employee → Go to Team page
2. [ ] See teams they're member of → Correct
3. [ ] View team members → Read-only, no actions
4. [ ] Try to add/remove member via API → 403 Forbidden
5. [ ] View own objectives → Success
6. [ ] View team objectives → Success (read-only)

---

## 🎉 Success Metrics

**Week 5 is successful if:**
1. ✅ Admin can create teams and add members
2. ✅ Assessments can be sent to entire teams
3. ✅ Team assessment results show aggregated data
4. ✅ Generated OKRs display on Objectives screen
5. ✅ 4-5 objectives with KRs shown with progress
6. ✅ Role-based permissions work correctly
7. ✅ Complete user flow works end-to-end
8. ✅ No critical bugs

---

**Created:** 2025-10-22
**Sprint:** Week 5
**Team:** Full Stack (1 developer)
**Estimated Hours:** 40 hours (5 days × 8 hours)
