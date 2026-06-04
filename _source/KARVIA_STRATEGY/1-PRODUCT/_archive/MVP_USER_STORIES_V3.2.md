# 👥 KARVIA OKR - MVP USER STORIES

## 📌 VERSION CONTROL

**Document**: MVP_USER_STORIES_V3.2.md
**Version**: 3.2 (Modular Block Architecture)
**Last Updated**: 2025-10-23 18:30:00
**Updated By**: Claude (Week 7/7.5 IAM + AI OKR Engine stories)

**Changelog**:
### v3.2.0 (2025-10-23) - WEEK 7/7.5 STORIES + ARCHITECTURE ALIGNMENT
- 🆕 Added 8 new user stories for Week 7 (IAM Block) and Week 7.5 (AI OKR Engine)
- 🏗️ **Week 7 (IAM Block - 5 stories)**:
  - US-W7-001: Company Creation
  - US-W7-002: Team Hierarchy
  - US-W7-003: Member Management
  - US-W7-004: Multi-Company Access
  - US-W7-005: Context Filtering
- 🤖 **Week 7.5 (AI OKR Engine - 3 stories)**:
  - US-W7.5-001: LLM OKR Generation
  - US-W7.5-002: Consultant Prompt Customization
  - US-W7.5-003: Template Fallback
- 🔧 Updated header: 7 blocks (not 8), 12-week timeline, January 31, 2026 launch
- 📝 Changed all "Week 6.5-7" references to "Week 7" and "Week 7.5"
- 🎯 Updated to reference 7 modular blocks (removed Block 8 admin references)
- 🔐 Marked assessment stories as "Block 3 (OPTIONAL)"
- 📧 Marked bulk invitation stories as "Block 6 (OPTIONAL)" (not Block 2)
- ✅ Added feature flag references to all optional block stories
- 📈 Total stories: 97 → 105 (+8)

### v3.1.0 (2025-10-22) - JOURNEY MAPPING STORIES
- 🆕 Added 9 missing stories from user journey analysis
- 🔴 Critical: EMP-016 "Why Chain" context (P0)
- ✅ Approval workflow: EXEC-011B quarterly plan approval
- 📊 Team health: MGR-025, CONS-007B assessment insights
- ⚡ Intervention: MGR-026 automated alerts
- 🔵 4 BETA stories (CONS-009B, MGR-027, EMP-017, EMP-018)
- 📈 Total stories: 88 → 97 (+9)

### v3.0.0 (2025-10-22) - MAJOR REWRITE
- 🎯 Hybrid structure: Stories by persona + weekly mapping
- ✅ Added Week 1-4 complete stories (historical record)
- 📅 Mapped Week 5-12 stories to implementation plan
- 🎨 High-detail acceptance criteria tied to actual mockups
- 📁 References to `/Finalised_Mockups/` screens
- 🔗 Cross-referenced to weekly plans in `/Daily_Handoffs/`

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Quick Reference: Stories by Week](#quick-reference-stories-by-week)
3. [User Personas](#user-personas)
4. [Story Format](#story-format)
5. [Week 1-4 Stories (COMPLETE)](#week-1-4-stories-complete)
6. [Week 5 Stories (Teams + Objectives)](#week-5-stories-teams--objectives)
7. [Week 6 Stories (Profile)](#week-6-stories-profile)
8. [Week 7 Stories (IAM Block)](#week-7-stories-iam-block)
9. [Week 7.5 Stories (AI OKR Engine)](#week-75-stories-ai-okr-engine)
10. [Week 8 Stories (Goal Management)](#week-8-stories-goal-management)
11. [Week 9 Stories (Planning)](#week-9-stories-planning)
12. [Week 10-12 Stories (Integration, Analytics, Testing)](#week-10-12-stories)
13. [All Stories by Persona](#all-stories-by-persona)

---

## 🎯 OVERVIEW

**Total Stories**: 105 stories mapped to Week 1-12 implementation (12 weeks total)
**Completed**: 15 stories (Week 1-4) ✅
**Remaining**: 90 stories (Week 5-12) ⬜
**Launch Target**: January 31, 2026

This document contains all user stories for Karvia OKR MVP organized in a **hybrid structure**:
1. **Primary Organization**: Stories grouped by implementation week
2. **Cross-Reference**: Stories also categorized by persona (see bottom)
3. **High Detail**: Acceptance criteria tied to actual mockup screens
4. **Architecture Alignment**: Stories aligned with 7 modular blocks + 6 engines

**7 Modular Blocks**:
- Block 1: Core Execution (REQUIRED)
- Block 2: IAM - Company & Teams (OPTIONAL)
- Block 3: Assessment System (OPTIONAL)
- Block 4: AI OKR Engine (OPTIONAL)
- Block 5: Progress Rollup (OPTIONAL)
- Block 6: Bulk Operations (OPTIONAL)
- Block 7: Permission Rules Engine (OPTIONAL)

**Note**: Admin functionality (feature flags, permission management, iBrain toggle) is a consolidated management layer for the 7 blocks, not a separate block.

**Format**:
```
**As a** [persona]
**I want to** [action]
**So that** [business value]
```

---

## 📅 QUICK REFERENCE: STORIES BY WEEK

### **Week 1-4: Assessment System** ✅ COMPLETE (15 stories)
- ✅ Template creation (CONS-001, CONS-002, CONS-003)
- ✅ Question library (ADMIN-001, ADMIN-002)
- ✅ Invitation system (CONS-004, CONS-005, MGR-001)
- ✅ Assessment taking (EMP-001, EMP-002, MGR-002)
- ✅ Results viewing (EMP-003, MGR-003, EXEC-001)
- ✅ AI OKR generation (EXEC-002, CONS-006)

**Code**: [Week_1_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)

---

### **Week 5: Teams + Objectives** ⬜ NOT STARTED (12 stories)
- Team creation (MGR-004, ADMIN-003)
- Team management (MGR-005, MGR-006)
- Member management (MGR-007, EXEC-003)
- Objectives display (EMP-004, MGR-008, EXEC-004)
- OKR filtering (EXEC-005)
- Progress tracking (MGR-009, EXEC-006)

**Plan**: [Week_5_PLAN.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_5/WEEK_5_PLAN.md)

---

### **Week 6: Profile Management** ⬜ NOT STARTED (10 stories)
- Profile viewing (EMP-005, MGR-010)
- Avatar upload (EMP-006, MGR-011)
- Assessment history (EMP-007, EXEC-007)
- Team assessment health (MGR-025)
- Organization info (EXEC-008)
- Multi-company stats (CONS-007, CONS-007B)

---

### **Week 7: IAM Block** ⬜ NOT STARTED (5 stories) ⭐ NEW
- US-W7-001: Company Creation
- US-W7-002: Team Hierarchy
- US-W7-003: Member Management
- US-W7-004: Multi-Company Access
- US-W7-005: Context Filtering

---

### **Week 7.5: AI OKR Engine** ⬜ NOT STARTED (3 stories) ⭐ NEW
- US-W7.5-001: LLM OKR Generation
- US-W7.5-002: Consultant Prompt Customization
- US-W7.5-003: Template Fallback

---

### **Week 8: Goal Management** ⬜ NOT STARTED (12 stories)
- Goal assignment (MGR-015, MGR-016)
- Task creation (MGR-017, MGR-018)
- Task linking (MGR-019, EMP-014)
- Progress tracking (EMP-015, MGR-020)
- Intervention workflow (MGR-026)
- "Why Chain" context (EMP-016 - CRITICAL)
- Goal updates (EXEC-010, EXEC-011)

---

### **Week 9: Planning** ⬜ NOT STARTED (13 stories)
- Yearly OKR creation (EXEC-012, CONS-008)
- Quarterly breakdown (EXEC-013, MGR-021)
- Weekly allocation (MGR-022, MGR-023)
- Team planning (MGR-024, EXEC-014)
- Approval workflow (EXEC-011B - NEW)
- Consultant planning (CONS-009, CONS-010)
- Review workflow (EXEC-015, CONS-011)

---

### **Week 10-12: Integration, Analytics, Admin** ⬜ NOT STARTED (23 stories)
- Analytics dashboard (EXEC-016, EXEC-017, EXEC-018)
- Admin panel (ADMIN-004, ADMIN-005, ADMIN-006)
- User management (ADMIN-007, ADMIN-008)
- System settings (ADMIN-009, ADMIN-010)
- BETA features (CONS-009B, MGR-027, EMP-017, EMP-018)
- Cross-screen navigation (ALL personas)
- Integration testing (ALL personas)

---

## 👤 USER PERSONAS

### **1. Employee (EMP) - Individual Contributor**
- **Role**: Team member focused on personal goals and tasks
- **Access**: Dashboard, Objectives, Assessment, Team, Profile
- **Primary Goals**: Complete tasks, track progress, understand SSI scores
- **Key Screens**: Dashboard, Assessment Results, Objectives

### **2. Manager (MGR) - Team Leader**
- **Role**: Manages team members, assigns work, tracks team performance
- **Access**: Dashboard, Objectives, Assessment, Team, Planning, Profile
- **Primary Goals**: Align team with objectives, assess capabilities, monitor progress
- **Key Screens**: Team Management, Planning, Dashboard

### **3. Executive (EXEC) - Company Leadership**
- **Role**: Sets strategic direction, owns company-wide OKRs
- **Access**: All screens + Analytics
- **Primary Goals**: Strategic planning, organization visibility, data-driven decisions
- **Key Screens**: Analytics, Planning, Objectives

### **4. Consultant (CONS) - External Advisor**
- **Role**: Advises multiple companies, creates templates, compares clients
- **Access**: All screens + multi-company switching
- **Primary Goals**: Compare clients, customize assessments, provide guidance
- **Key Screens**: Assessment Hub, Template Creation, Analytics

### **5. Admin (ADMIN) - Platform Administrator**
- **Role**: Platform configuration, user management, system settings
- **Access**: All screens + Admin panel
- **Primary Goals**: Configure platform, manage users, maintain system
- **Key Screens**: Admin Panel, User Management, Settings

---

## 📝 STORY FORMAT

Each story includes:
- **ID**: [PERSONA-XXX] or [US-WX-XXX] unique identifier
- **Week Tag**: [Week X] implementation mapping
- **Status**: ✅ Complete | ⬜ Not Started
- **Screen Reference**: Mockup file (e.g., `05_team.html`)
- **Block**: Which of the 7 modular blocks this story belongs to
- **Priority**: P0 (critical), P1 (high), P2 (medium)
- **Story Points**: 1-8 (Fibonacci scale)
- **Feature Flag**: Which feature flag controls this functionality
- **Acceptance Criteria**: High-detail with mockup line references

---

## ✅ WEEK 1-4 STORIES (COMPLETE)

### **WEEK 1: Assessment Template System** ✅

#### CONS-001: Create Assessment Template [Week 1] ✅ COMPLETE

**As a** consultant
**I want to** create custom assessment templates
**So that** I can tailor assessments to specific client needs

**Block**: 3 (Assessment System - OPTIONAL)
**Feature Flag**: ASSESSMENT_BLOCK

**Acceptance Criteria**:
- ✅ 4-step wizard flow (Name → Weights → Questions → Review)
- ✅ Step 1: Enter template name, description, select business/global scope
- ✅ Step 2: Set dimension weights (Speed, Strength, Intelligence must sum to 100%)
- ✅ Step 3: Select questions from 146-question library with search/filter
- ✅ Step 4: Review and publish template
- ✅ Template saved to MongoDB with UUID
- ✅ Confirmation message displayed
- ✅ When ASSESSMENT_BLOCK disabled, template creation menu hidden

**Screen Reference**: `client/pages/assessment-creation-flow.html`, `assessment-step-2.html`, `assessment-step-3.html`, `assessment-step-4.html`
**Priority**: P0 (Critical)
**Story Points**: 8
**Code**: [WEEK_1_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)
**Status**: ✅ COMPLETE (Week 1 Day 2)

---

#### CONS-002: View Assessment Templates [Week 1] ✅ COMPLETE

**As a** consultant
**I want to** view all available assessment templates
**So that** I can select appropriate templates for clients

**Block**: 3 (Assessment System - OPTIONAL)
**Feature Flag**: ASSESSMENT_BLOCK

**Acceptance Criteria**:
- ✅ Assessment Hub shows 4 tabs (My Templates, Available, Assigned, Sent)
- ✅ "My Templates" shows consultant-created templates
- ✅ "Available Templates" shows global + business-specific templates
- ✅ Each template card displays: name, SSI breakdown, question count, creation date
- ✅ SSI breakdown shows percentages (e.g., Speed: 35%, Strength: 30%, Intelligence: 35%)
- ✅ Click template card navigates to detail view
- ✅ Role-based filtering (consultants see all, managers see business-specific)
- ✅ When ASSESSMENT_BLOCK disabled, Assessment Hub navigation hidden

**Screen Reference**: `client/pages/assessment-hub.html:150-200`
**Priority**: P0 (Critical)
**Story Points**: 5
**Code**: [WEEK_1_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)
**Status**: ✅ COMPLETE (Week 1 Day 2)

---

#### CONS-003: Send Assessment Invitation [Week 1] ✅ COMPLETE

**As a** consultant
**I want to** send assessment invitations to multiple recipients
**So that** I can collect responses from client teams

**Block**: 3 (Assessment System - OPTIONAL)
**Feature Flag**: ASSESSMENT_BLOCK

**Acceptance Criteria**:
- ✅ "Send Invitation" button on Assessment Hub
- ✅ Modal shows: template selector, recipient email list, due date picker
- ✅ Can add multiple recipients (comma-separated or one per line)
- ✅ Email sent via Mailjet with invitation link
- ✅ Email includes: company name, template name, assessment link, due date
- ✅ Invitation saved to database with status "pending"
- ✅ Success message shows "X invitations sent"
- ✅ When ASSESSMENT_BLOCK disabled, invitation sending unavailable

**Screen Reference**: `client/pages/assessment-hub.html:250-300`
**Priority**: P0 (Critical)
**Story Points**: 5
**Code**: [WEEK_1_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)
**Status**: ✅ COMPLETE (Week 1 Day 3)

---

#### EMP-001: Take Assessment [Week 1] ✅ COMPLETE

**As an** employee
**I want to** complete an assigned assessment
**So that** I can contribute my perspective to team evaluation

**Block**: 3 (Assessment System - OPTIONAL)
**Feature Flag**: ASSESSMENT_BLOCK

**Acceptance Criteria**:
- ✅ Receive email invitation with unique link
- ✅ Click link opens assessment page with template questions
- ✅ Questions grouped by dimension (Speed, Strength, Intelligence)
- ✅ Each question has 1-10 rating scale
- ✅ Progress bar shows completion percentage
- ✅ Can save draft and resume later
- ✅ Submit button active only when all questions answered
- ✅ Confirmation page shows "Assessment submitted successfully"

**Screen Reference**: `client/pages/assessment-take.html`
**Priority**: P0 (Critical)
**Story Points**: 5
**Code**: [WEEK_1_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)
**Status**: ✅ COMPLETE (Week 3 Day 1)

---

#### EMP-002: View Assessment Results [Week 1] ✅ COMPLETE

**As an** employee
**I want to** view my individual assessment results
**So that** I can understand my Speed/Strength/Intelligence scores

**Block**: 3 (Assessment System - OPTIONAL)
**Feature Flag**: ASSESSMENT_BLOCK

**Acceptance Criteria**:
- ✅ Results page shows 3 scores with visual rings (Speed, Strength, Intelligence)
- ✅ Each score displayed as X/10 with percentage
- ✅ Color coding: Green (8-10), Yellow (6-7.9), Red (<6)
- ✅ Dimension breakdown shows sub-scores
- ✅ Can download results as PDF
- ✅ "Back to Dashboard" button navigates to home

**Screen Reference**: `client/pages/assessment-results.html`
**Priority**: P1 (High)
**Story Points**: 5
**Code**: [WEEK_1_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)
**Status**: ✅ COMPLETE (Week 3 Day 1)

---

#### EXEC-001: Generate AI OKRs from Assessment [Week 4] ⚠️ 95% COMPLETE (1 BUG)

**As an** executive
**I want to** generate AI-powered OKRs from assessment results
**So that** I get data-driven strategic objectives

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Feature Flag**: AI_ENGINE

**Acceptance Criteria**:
- ✅ "Generate OKRs" button on assessment results page
- ✅ AI analyzes Speed/Strength/Intelligence scores
- ✅ Generates 3-5 yearly objectives with key results
- ✅ OKRs saved to database with business_id
- ❌ **BUG**: Review page not displaying generated OKRs (ISS-W4-001)
- ⬜ Accept/Reject workflow (Week 5 Day 1 fix)
- ✅ When AI_ENGINE disabled, "Generate OKRs" button hidden
- ✅ Falls back to manual OKR creation if disabled

**Screen Reference**: `client/pages/ai-okr-review.html` (⚠️ HAS BUG)
**Priority**: P0 (CRITICAL - BLOCKING Week 5)
**Story Points**: 8
**Code**: [WEEK_4_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/WEEK_4_CODE_REFERENCES.md)
**Status**: ⚠️ 95% COMPLETE - Fix Week 5 Day 1

---

**Total Week 1-4 Stories**: 15 complete ✅, 1 with bug ⚠️

---

## ⬜ WEEK 5 STORIES (TEAMS + OBJECTIVES)

### MGR-004: Create New Team [Week 5] ⬜ NOT STARTED

**As a** manager
**I want to** create a new team
**So that** I can organize employees into functional groups

**Block**: 2 (IAM - OPTIONAL)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] "Create Team" button on Team Management page
- [ ] Form includes: Team name, description, department dropdown
- [ ] Can assign team manager from dropdown (MANAGER role users)
- [ ] Created team appears in team list immediately
- [ ] Team saved to database with manager_id, business_id
- [ ] Success notification: "Team '{name}' created successfully"
- [ ] When IAM_BLOCK disabled, team creation unavailable (solo user mode)

**Screen Reference**: `Finalised_Mockups/05_team.html:100-150`
**Mockup Location**: `/Karvia_OKR_Mockups/Finalised_Mockups/05_team.html`
**Priority**: P0 (Critical - Week 5 Day 3)
**Story Points**: 3
**Implementation**: Day 3 Morning
**API**: POST `/api/teams/create`
**Model**: `server/models/Team.js` (create Day 1)

---

### MGR-005: Add Team Members [Week 5] ⬜ NOT STARTED

**As a** manager
**I want to** add members to my team
**So that** employees can be assigned to team objectives

**Block**: 2 (IAM - OPTIONAL)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] "Add Members" button on team detail page
- [ ] Modal shows: employee search dropdown, role selector (MANAGER/EMPLOYEE)
- [ ] Search filters by name/email within business
- [ ] Can add multiple members in one action
- [ ] Members list updates immediately
- [ ] Each member shows: name, email, role, "Remove" button
- [ ] Database updates team.members array
- [ ] When IAM_BLOCK disabled, member management unavailable

**Screen Reference**: `Finalised_Mockups/05_team.html:200-250`
**Mockup Location**: `/Karvia_OKR_Mockups/Finalised_Mockups/05_team.html`
**Priority**: P0 (Critical - Week 5 Day 3)
**Story Points**: 3
**Implementation**: Day 3 Afternoon
**API**: POST `/api/teams/:teamId/members`
**Model**: `server/models/Team.js:members[]`

---

### MGR-006: View Team List [Week 5] ⬜ NOT STARTED

**As a** manager
**I want to** view all teams in my organization
**So that** I can see team structure and members

**Block**: 2 (IAM - OPTIONAL)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] Team Management page shows all teams (role-based filter)
- [ ] Each team card displays: name, department, manager name, member count
- [ ] Click team card navigates to team detail page
- [ ] Search box filters teams by name
- [ ] Department filter dropdown
- [ ] Active/Inactive status toggle
- [ ] "Create Team" button visible to ADMIN/MANAGER roles only
- [ ] When IAM_BLOCK disabled, team list hidden (solo user sees only personal view)

**Screen Reference**: `Finalised_Mockups/05_team.html:50-100`
**Mockup Location**: `/Karvia_OKR_Mockups/Finalised_Mockups/05_team.html`
**Priority**: P0 (Critical - Week 5 Day 3)
**Story Points**: 5
**Implementation**: Day 3 Morning
**API**: GET `/api/teams`
**Model**: `server/models/Team.js`

---

### EMP-004: View My Objectives [Week 5] ⬜ NOT STARTED

**As an** employee
**I want to** view objectives assigned to me
**So that** I understand what I need to achieve

**Block**: 1 (Core Execution - REQUIRED)

**Acceptance Criteria (Week 5 MVP)**:
- [ ] Objectives page shows my assigned objectives (filtered by user_id)
- [ ] Each objective card shows: title, description, progress %, due date
- [ ] Progress percentage display (0-100%) with color coding:
  - Green: >75% on track
  - Yellow: 50-75% needs attention
  - Red: <50% at risk
- [ ] Can click objective to see key results list
- [ ] Empty state: "No objectives assigned yet"

**Deferred to Week 10** (Integration & Polish):
- ⬜ Personal/Team tabs (requires team model relationships)
- ⬜ Progress ring visual (circular progress indicator)
- ⬜ Expand/collapse animation
- ⬜ Historical progress timeline

**Screen Reference**: `Finalised_Mockups/03_objectives.html:100-200`
**Mockup Location**: `/Karvia_OKR_Mockups/Finalised_Mockups/03_objectives.html`
**Priority**: P0 (Critical - Week 5 Day 4)
**Story Points**: 3 (reduced from 5)
**Implementation**: Day 4 Morning
**API**: GET `/api/objectives/my-dashboard`
**Model**: `server/models/Objective.js`

---

### EXEC-003: View All Company Objectives [Week 5] ⬜ NOT STARTED

**As an** executive
**I want to** view all company objectives in one place
**So that** I can monitor organization-wide progress

**Block**: 1 (Core Execution - REQUIRED) + 2 (IAM - OPTIONAL for company filtering)
**Feature Flag**: IAM_BLOCK (for company/team filtering)

**Acceptance Criteria (Week 5 MVP)**:
- [ ] Objectives page shows all objectives (no user filter for EXEC role)
- [ ] Can filter by: Status (All, On Track, At Risk, Completed)
- [ ] Can sort by: Progress, Due Date (client-side sorting)
- [ ] Summary stats at top: Total Objectives, On Track %, At Risk Count
- [ ] Each objective shows: owner name, progress %, status badge, due date
- [ ] Click objective to expand key results inline

**Deferred to Week 8** (After Team model exists):
- ⬜ Filter by Team (requires Team model and relationships)
- ⬜ Filter by Department (requires Team.department field)

**Deferred to Week 11** (Analytics & Export):
- ⬜ Export to CSV button
- ⬜ Detail modal with full history
- ⬜ Advanced filtering (date ranges, custom fields)

**Graceful Degradation**:
- If IAM_BLOCK disabled: Shows all user's personal objectives (no company filter)

**Screen Reference**: `Finalised_Mockups/03_objectives.html:50-300`
**Mockup Location**: `/Karvia_OKR_Mockups/Finalised_Mockups/03_objectives.html`
**Priority**: P0 (Critical - Week 5 Day 4)
**Story Points**: 5 (reduced from 8)
**Implementation**: Day 4 Afternoon
**API**: GET `/api/objectives` (returns all for EXEC role)
**Model**: `server/models/Objective.js`

---

### MGR-007: Remove Team Member [Week 5] ⬜ NOT STARTED

**As a** manager
**I want to** remove members from my team
**So that** I can maintain accurate team rosters

**Block**: 2 (IAM - OPTIONAL)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] "Remove" button next to each team member
- [ ] Confirmation modal: "Remove {name} from {team}? This will unassign their team objectives."
- [ ] On confirm: Member removed from team.members array
- [ ] Member still exists in User collection (soft remove)
- [ ] Team objectives assigned to removed member marked "Unassigned"
- [ ] Success notification: "{name} removed from team"
- [ ] When IAM_BLOCK disabled, member removal unavailable

**Screen Reference**: `Finalised_Mockups/05_team.html:250-280`
**Mockup Location**: `/Karvia_OKR_Mockups/Finalised_Mockups/05_team.html`
**Priority**: P1 (High - Week 5 Day 3)
**Story Points**: 2
**Implementation**: Day 3 Afternoon
**API**: DELETE `/api/teams/:teamId/members/:userId`
**Model**: `server/models/Team.js:members[]`

---

### MGR-008: Track Objective Progress [Week 5] ⬜ NOT STARTED

**As a** manager
**I want to** track team objective progress
**So that** I can identify roadblocks early

**Block**: 1 (Core Execution - REQUIRED) + 2 (IAM - OPTIONAL for team filtering)
**Feature Flag**: IAM_BLOCK (for team context)

**Acceptance Criteria**:
- [ ] Team Objectives tab shows all team OKRs
- [ ] Progress calculated from key results completion
- [ ] Visual progress rings: Green (>75%), Yellow (50-75%), Red (<50%)
- [ ] Last updated timestamp visible
- [ ] Can click to update progress (opens modal)
- [ ] Progress history timeline (optional for Week 5)

**Graceful Degradation**:
- If IAM_BLOCK disabled: Shows only personal objectives (no team view)

**Screen Reference**: `Finalised_Mockups/03_objectives.html:150-200`
**Mockup Location**: `/Karvia_OKR_Mockups/Finalised_Mockups/03_objectives.html`
**Priority**: P1 (High - Week 5 Day 4)
**Story Points**: 5
**Implementation**: Day 4 Afternoon
**API**: GET `/api/objectives/:id/progress`
**Model**: `server/models/Objective.js:progress`

---

### EXEC-004: Fix Week 4 Bug - AI OKR Review Display [Week 5] ⬜ NOT STARTED

**As an** executive
**I want to** see AI-generated OKRs on review page
**So that** I can approve or reject them

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Feature Flag**: AI_ENGINE

**Acceptance Criteria**:
- [ ] Fix data fetching logic in `client/pages/scripts/ai-okr-review.js:75-100`
- [ ] Match response format between frontend and backend
- [ ] AI-generated OKRs display correctly
- [ ] Accept/Reject buttons functional
- [ ] Accepted OKRs saved to Objectives collection
- [ ] End-to-end test: Assessment → Generate → Review → Accept ✅

**Screen Reference**: `client/pages/ai-okr-review.html`
**Priority**: P0 (CRITICAL - BLOCKING - Week 5 Day 1 Morning)
**Story Points**: 3
**Implementation**: Day 1 Morning (2-4 hours)
**Issue**: ISS-W4-001
**Files**: `client/pages/scripts/ai-okr-review.js:75-100`, `server/routes/ai-okr.js:45`

---

**Week 5 Total**: 12 stories (1 critical bug fix + 11 new features)

---

## ⬜ WEEK 7 STORIES (IAM BLOCK) ⭐ NEW

### US-W7-001: Company Creation [Week 7] ⬜ NOT STARTED

**As a**: Business Owner
**I want to**: Create my company profile during signup
**So that**: I can establish the top-level organization structure

**Block**: 2 (IAM - OPTIONAL)
**Priority**: P0 (CRITICAL)
**Effort**: 3 points
**Dependencies**: None
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] AC1: First user to sign up automatically becomes Company Owner
- [ ] AC2: Owner fills company form (name, industry, size, archetype)
- [ ] AC3: Company name must be unique across platform
- [ ] AC4: Owner selects from 16 business archetypes (Startup, SMB, Enterprise, etc.)
- [ ] AC5: Owner selects from 24 strategic focus areas (Growth, Profitability, Innovation, etc.)
- [ ] AC6: Company is created with owner as first member
- [ ] AC7: Company ID stored in user.companies array with role "OWNER"
- [ ] AC8: When IAM_BLOCK disabled, users skip company creation (solo mode)

**Test Scenarios**:
1. Happy path: Owner creates company successfully
2. Error: Duplicate company name rejected
3. Fallback: IAM disabled → skip to individual OKR workflow
4. Multi-company: Consultant creates second company (multi-tenant)

**Implementation**: Week 7 Day 1 (8 hours)
**API**: POST `/api/companies/create`
**Model**: `@karvia/shared-models/Company.js` (new)
**Screen**: `client/pages/company-creation.html` (new)

**Graceful Degradation**:
- When IAM_BLOCK=false: Signup skips company step, user works as solo account

---

### US-W7-002: Team Hierarchy [Week 7] ⬜ NOT STARTED

**As a**: Manager
**I want to**: Create teams within my company
**So that**: I can organize employees into functional groups

**Block**: 2 (IAM - OPTIONAL)
**Priority**: P0 (CRITICAL)
**Effort**: 3 points
**Dependencies**: US-W7-001 (Company Creation)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] AC1: Manager can create team with name, description, department
- [ ] AC2: Team must belong to a company (company_id required)
- [ ] AC3: Team has one manager (manager_id)
- [ ] AC4: Manager can add members to team (members array)
- [ ] AC5: Team displays member count, manager name, department
- [ ] AC6: Teams list shows all teams in current company
- [ ] AC7: When IAM_BLOCK disabled, team creation UI hidden

**Test Scenarios**:
1. Happy path: Manager creates "Engineering" team successfully
2. Validation: Team name required, company_id required
3. Authorization: Only MANAGER/OWNER can create teams
4. Fallback: IAM disabled → no team features (solo mode)

**Implementation**: Week 7 Day 2 (8 hours)
**API**: POST `/api/teams/create`
**Model**: `@karvia/shared-models/Team.js` (enhance existing with company_id)
**Screen**: `client/pages/05_team.html` (enhance existing)

**Graceful Degradation**:
- When IAM_BLOCK=false: Team management navigation hidden

---

### US-W7-003: Member Management [Week 7] ⬜ NOT STARTED

**As a**: Manager
**I want to**: Add and remove team members
**So that**: I can maintain accurate team rosters

**Block**: 2 (IAM - OPTIONAL)
**Priority**: P0 (CRITICAL)
**Effort**: 3 points
**Dependencies**: US-W7-002 (Team Hierarchy)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] AC1: Manager can add members to team via search dropdown
- [ ] AC2: Search filters users by name/email within company
- [ ] AC3: Can add multiple members in one action
- [ ] AC4: Each member has role badge (MANAGER/EMPLOYEE)
- [ ] AC5: Manager can remove members from team
- [ ] AC6: Removal confirmation: "Remove {name}? Their team objectives will be unassigned."
- [ ] AC7: Removed member stays in company, just removed from team
- [ ] AC8: When IAM_BLOCK disabled, member management unavailable

**Test Scenarios**:
1. Happy path: Add 5 members to team successfully
2. Validation: Can't add user from different company
3. Authorization: Only team manager/owner can manage members
4. Cascading: Removed member's team objectives marked "Unassigned"

**Implementation**: Week 7 Day 3 (8 hours)
**API**: POST `/api/teams/:teamId/members`, DELETE `/api/teams/:teamId/members/:userId`
**Model**: `@karvia/shared-models/Team.js:members[]`
**Screen**: `client/pages/05_team.html:member-management-section` (new section)

**Graceful Degradation**:
- When IAM_BLOCK=false: Member management UI hidden

---

### US-W7-004: Multi-Company Access [Week 7] ⬜ NOT STARTED

**As a**: Consultant
**I want to**: Switch between multiple client companies
**So that**: I can manage OKRs for different clients

**Block**: 2 (IAM - OPTIONAL)
**Priority**: P0 (CRITICAL)
**Effort**: 5 points
**Dependencies**: US-W7-001 (Company Creation)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] AC1: Consultant user has companies array (multiple company_id + role pairs)
- [ ] AC2: Company switcher dropdown in navigation bar
- [ ] AC3: Dropdown shows: Company name, role, member count
- [ ] AC4: Clicking company switches entire context (all queries scoped to new company)
- [ ] AC5: Current company persisted in session/localStorage
- [ ] AC6: Dashboard, objectives, teams all filtered to current company
- [ ] AC7: Can create new company (multi-tenant support)
- [ ] AC8: When IAM_BLOCK disabled, company switcher hidden (single user mode)

**Test Scenarios**:
1. Happy path: Consultant switches between 3 companies
2. Context isolation: Company A data not visible when Company B selected
3. Persistence: Refresh page → stays on selected company
4. Authorization: Can only see companies where user is member

**Implementation**: Week 7 Day 5 (8 hours)
**API**: GET `/api/users/companies`, POST `/api/users/switch-company`
**Model**: `@karvia/shared-models/User.js:companies[]` (new field)
**Screen**: `client/components/company-switcher-dropdown.html` (new component)

**Database Migration**:
```javascript
// User model enhancement
User.companies = [{
  company_id: ObjectId,
  role: String,
  joined_at: Date
}]; // NEW (optional)
```

**Graceful Degradation**:
- When IAM_BLOCK=false: No company switcher, user operates as solo account

---

### US-W7-005: Context Filtering [Week 7] ⬜ NOT STARTED

**As a**: User (any role)
**I want to**: See only data from my current company
**So that**: I don't see other companies' confidential data

**Block**: 2 (IAM - OPTIONAL)
**Priority**: P0 (CRITICAL - SECURITY)
**Effort**: 5 points
**Dependencies**: US-W7-004 (Multi-Company Access)
**Feature Flag**: IAM_BLOCK

**Acceptance Criteria**:
- [ ] AC1: All queries automatically filter by current company_id
- [ ] AC2: Middleware adds `company_id: req.user.current_company_id` to queries
- [ ] AC3: Objectives, goals, tasks filtered to current company
- [ ] AC4: Teams list filtered to current company
- [ ] AC5: Assessments filtered to current company
- [ ] AC6: Users can only see members of their current company
- [ ] AC7: Authorization check: Ensure user belongs to company before queries
- [ ] AC8: When IAM_BLOCK disabled, no company filtering (solo user sees all their data)

**Test Scenarios**:
1. Happy path: User sees only Company A data when Company A selected
2. Security: User cannot access Company B data via API manipulation
3. Authorization: API returns 403 if user not member of requested company
4. Consultant: Sees different teams/objectives when switching companies

**Implementation**: Week 7 Day 5 (8 hours)
**API**: All existing endpoints enhanced with company scoping middleware
**Middleware**: `server/middleware/company-context.js` (new)
**Model**: All models enhanced with `company_id` field (optional)

**Database Migration** (additive only, backward compatible):
```javascript
// Objective model
Objective.company_id = ObjectId; // NEW (optional)

// Goal model
Goal.company_id = ObjectId; // NEW (optional)
Goal.team_id = ObjectId; // EXISTING (optional)

// Task model
Task.company_id = ObjectId; // NEW (optional)
Task.team_id = ObjectId; // NEW (optional)

// Assessment model
Assessment.company_id = ObjectId; // NEW (optional)
```

**Graceful Degradation**:
- When IAM_BLOCK=false: No company_id filtering, user sees all their data

---

**Week 7 Total**: 5 stories (IAM Block - Company & Teams infrastructure)

---

## ⬜ WEEK 7.5 STORIES (AI OKR ENGINE) ⭐ NEW

### US-W7.5-001: LLM OKR Generation [Week 7.5] ⬜ NOT STARTED

**As a**: Executive
**I want to**: Generate OKRs using GPT-4 from assessment results
**So that**: I get high-quality, contextual objectives based on real data

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Priority**: P0 (CRITICAL - Core Value Proposition)
**Effort**: 8 points
**Dependencies**: Block 3 (Assessment System)
**Feature Flag**: AI_ENGINE

**Acceptance Criteria**:
- [ ] AC1: Report generator converts assessment results to structured text report
- [ ] AC2: Report includes: SSI scores, weak areas, strengths, company profile
- [ ] AC3: Prompt builder creates AI prompt from report + company context
- [ ] AC4: OpenAI SDK integration with GPT-4 model
- [ ] AC5: Structured output mode: JSON schema enforces Objective/KeyResult format
- [ ] AC6: Response parser converts JSON to Objective and KeyResult models
- [ ] AC7: Generated OKRs saved to database with lineage to source assessment
- [ ] AC8: Retry logic: 2 retries on OpenAI failure
- [ ] AC9: Falls back to template-based generation if all retries fail
- [ ] AC10: When AI_ENGINE disabled, "Generate OKRs" button hidden (manual creation only)

**Test Scenarios**:
1. Happy path: Generate 4-6 objectives from assessment in <30 seconds
2. Weak areas: Generated OKRs address identified weaknesses (e.g., Financial Strength gap)
3. Fallback: OpenAI fails → System uses template-based generation
4. Validation: JSON response matches expected schema
5. Lineage: Can trace OKR back to source assessment

**Implementation**: Week 7.5 Day 1-2 (16 hours)
**API**: POST `/api/ai-okr/generate` (enhance existing)
**Services**:
- `engines/planner/services/report-generator.js` (new)
- `engines/planner/services/prompt-builder.js` (new)
- `engines/planner/services/openai-service.js` (enhance existing)
**Dependencies**: `openai` npm package, Redis (for caching)

**Graceful Degradation**:
- When AI_ENGINE=false: No "Generate OKRs" button, users create OKRs manually
- When OpenAI fails: Falls back to template-based generation (Week 4 system)
- When no OpenAI key: Template-based generation only

---

### US-W7.5-002: Consultant Prompt Customization [Week 7.5] ⬜ NOT STARTED

**As a**: Consultant
**I want to**: Edit the AI prompt before generating OKRs
**So that**: I can customize the output for specific client needs

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Priority**: P1 (HIGH - Consultant Feature)
**Effort**: 5 points
**Dependencies**: US-W7.5-001 (LLM OKR Generation)
**Feature Flag**: AI_ENGINE

**Acceptance Criteria**:
- [ ] AC1: "Preview Prompt" button before generation
- [ ] AC2: Modal shows full AI prompt (report + instructions)
- [ ] AC3: Editable textarea allows consultant to modify prompt
- [ ] AC4: Focus area input: "Focus on cost reduction and efficiency"
- [ ] AC5: Tone selector: "Aggressive" (stretch goals) vs "Conservative" (achievable)
- [ ] AC6: Timeline selector: "Next quarter" vs "Next year"
- [ ] AC7: Character counter: Max 4000 characters
- [ ] AC8: Edited prompt sent to OpenAI instead of default
- [ ] AC9: Prompt customizations saved to AssessmentResult for history
- [ ] AC10: When AI_ENGINE disabled, prompt editor unavailable

**Test Scenarios**:
1. Happy path: Consultant edits prompt, adds "Focus on revenue growth", sees different OKRs
2. Tone: "Aggressive" tone generates stretch goals (e.g., 200% growth)
3. Timeline: "Next quarter" generates short-term tactical goals
4. Validation: Prompt over 4000 chars shows error
5. History: Can view previous prompt edits

**Implementation**: Week 7.5 Day 3 (4 hours)
**API**: POST `/api/ai-okr/generate` (enhance with custom_prompt parameter)
**Screen**: `client/pages/prompt-editor-modal.html` (new modal)
**Model**: `@karvia/shared-models/AssessmentResult.js:ai_prompt_customizations` (new field)

**Graceful Degradation**:
- When AI_ENGINE=false: Prompt editor hidden

---

### US-W7.5-003: Template Fallback [Week 7.5] ⬜ NOT STARTED

**As a**: User (any role)
**I want to**: Always get OKRs even when OpenAI is unavailable
**So that**: The platform works reliably without external dependencies

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Priority**: P0 (CRITICAL - Reliability)
**Effort**: 3 points
**Dependencies**: US-W7.5-001 (LLM OKR Generation)
**Feature Flag**: AI_ENGINE

**Acceptance Criteria**:
- [ ] AC1: When OpenAI API fails (all retries exhausted), system falls back to templates
- [ ] AC2: Template generator uses assessment weak areas to select relevant templates
- [ ] AC3: Template-based OKRs marked with flag: `generation_method: "template"`
- [ ] AC4: User sees notification: "AI generation unavailable, using template-based OKRs"
- [ ] AC5: Template OKRs still address assessment weak areas (rule-based matching)
- [ ] AC6: When AI_ENGINE disabled entirely, always use template generation
- [ ] AC7: No OpenAI API key configured → Automatic fallback to templates
- [ ] AC8: Fallback completes in <5 seconds

**Test Scenarios**:
1. Happy path: OpenAI fails → Template generation succeeds
2. No API key: User gets template OKRs without error
3. Weak area matching: Template OKRs address Financial Strength gap
4. Speed: Template generation completes in <5 seconds
5. Notification: User sees clear message about fallback

**Implementation**: Week 7.5 Day 2 (4 hours)
**API**: POST `/api/ai-okr/generate` (enhance with fallback logic)
**Services**:
- `engines/planner/services/template-generator.js` (enhance existing from Week 4)
- `engines/planner/services/fallback-handler.js` (new)

**Fallback Logic**:
```javascript
async function generateOKRs(assessment_id) {
  try {
    // Try OpenAI first (if AI_ENGINE enabled and key exists)
    if (FEATURE_FLAGS.AI_ENGINE && process.env.OPENAI_API_KEY) {
      return await openaiService.generate(assessment_id);
    } else {
      throw new Error('AI_ENGINE disabled or no API key');
    }
  } catch (error) {
    // Fall back to template-based generation
    console.warn('OpenAI failed, using template fallback:', error);
    return await templateGenerator.generate(assessment_id);
  }
}
```

**Graceful Degradation**:
- When AI_ENGINE=false: Always uses template generation (no attempt to call OpenAI)
- When OpenAI fails: Seamless fallback to templates (user experience uninterrupted)

---

**Week 7.5 Total**: 3 stories (AI OKR Engine - Real LLM Integration)

---

## 🆕 NEW STORIES FROM JOURNEY MAPPING (9 STORIES)

**Added**: 2025-10-22 after user journey analysis
**Source**: [USER_JOURNEYS_MASTER.md](./User_Stories/USER_JOURNEYS_MASTER.md)
**Full Details**: [MISSING_STORIES_DETAILED.md](./User_Stories/MISSING_STORIES_DETAILED.md)

These stories fill critical gaps identified during end-to-end journey mapping, particularly around approval workflows, context visibility, and team health monitoring.

### 🔴 CRITICAL: EMP-016: View "Why Chain" Context [Week 8] ⬜ NOT STARTED

**As an** Employee
**I want to** see how my task connects to company objectives
**So that** I understand the impact of my work and stay motivated

**Block**: 1 (Core Execution - REQUIRED) + 3 (Assessment System - OPTIONAL for lineage)

**Acceptance Criteria**:
- [ ] Breadcrumb format: `📊 Company OKR > 🎯 Objective > 🔑 Key Result > 📅 Quarterly Goal > 📆 Weekly Goal > ✅ This Task`
- [ ] Each level clickable showing details (title, progress, owner, due date)
- [ ] Visual indicator: "Your task represents 0.4% of Quarterly Goal progress"
- [ ] Tooltip shows assessment insight: "Generated from Q4 2025 SSI Assessment - Addresses Financial Strength gap (5.5/10)"
- [ ] Mobile responsive: Breadcrumb collapses to dropdown
- [ ] Empty state: "This task is not connected to a goal yet - Ask your manager to link it"

**Priority**: P0 (Critical - core to assessment-driven Lego model)
**Story Points**: 5
**Implementation**: Week 8 Day 3 (6-8 hours)
**API**: GET `/api/tasks/:taskId/lineage`
**Screen**: Enhancement to `02_dashboard.html` (reusable `<why-chain>` component)

---

### EXEC-011B: Approve Manager Quarterly Plans [Week 9] ⬜ NOT STARTED

**As an** Executive
**I want to** review and approve manager-created quarterly plans
**So that** I can ensure team plans align with company objectives before execution begins

**Block**: 1 (Core Execution - REQUIRED) + 2 (IAM - OPTIONAL for approval workflow)
**Feature Flag**: IAM_BLOCK (for multi-team approval workflow)

**Acceptance Criteria**:
- [ ] "Pending Approval" notification after managers submit quarterly plans
- [ ] "Planning Approval" workspace shows all team plans side-by-side (team name, manager, goals, capacity %)
- [ ] Click team → Detailed plan view (goals breakdown, weekly allocation, resource needs, dependencies)
- [ ] Can add comments to each team plan
- [ ] "Approve" or "Request Changes" per team
- [ ] If "Request Changes": Comment required, manager notified, plan returns to MGR-021
- [ ] If "Approve": Status → "Approved", manager notified, goals become active
- [ ] Dashboard shows: "X of Y teams approved, Z teams pending changes"

**Graceful Degradation**:
- When IAM_BLOCK=false: No multi-team approval workflow (solo user approves own plans)

**Priority**: P0 (Critical - closes approval workflow gap)
**Story Points**: 5
**Implementation**: Week 9 Day 4 (6-8 hours)
**API**: GET `/api/planning/pending-approvals`, POST `/api/planning/:planId/approve`, POST `/api/planning/:planId/request-changes`
**Screen**: New `planning-approval.html`
**Model**: New `QuarterlyPlan` model with approval workflow

---

### MGR-025: View Team Assessment Health [Week 6] ⬜ NOT STARTED

**As a** Manager
**I want to** view my team's assessment scores and compare to company average
**So that** I can identify capability gaps and plan training

**Block**: 3 (Assessment System - OPTIONAL)
**Feature Flag**: ASSESSMENT_BLOCK

**Acceptance Criteria**:
- [ ] "Assessment Health" tab on team detail page
- [ ] Shows aggregated SSI scores: Speed 7.2/10 (Company avg: 6.8) ↑ Green
- [ ] Radar chart: team vs company average
- [ ] Sub-dimension breakdown (e.g., Speed → Decision Making: 7.5, Execution: 6.9)
- [ ] Completion status: "5 of 7 team members completed" with "Send Reminder" button
- [ ] Historical trend line chart (if multiple assessments)
- [ ] AI-recommended actions: "Consider training for Financial Strength dimension"
- [ ] Export to PDF button
- [ ] When ASSESSMENT_BLOCK disabled, Assessment Health tab hidden

**Priority**: P1 (High)
**Story Points**: 3
**Implementation**: Week 6 Day 2 (4-5 hours)
**API**: GET `/api/teams/:teamId/assessment-health`
**Screen**: New tab in `05_team.html`

---

### MGR-026: Intervention Workflow (Automated Alerts) [Week 8] ⬜ NOT STARTED

**As a** Manager
**I want to** receive automated alerts when team members are at risk
**So that** I can intervene early and prevent failures

**Block**: 1 (Core Execution - REQUIRED) + 5 (Progress Rollup - OPTIONAL for alerts)
**Feature Flag**: PROGRESS_ROLLUP (for automated alert triggers)

**Acceptance Criteria**:
- [ ] System monitors team members daily (cron job)
- [ ] Triggers alert if: >50% tasks overdue 3+ days, No tasks complete in 7+ days, Goal progress <30% with <30 days left
- [ ] Manager receives: In-app notification badge, email (if enabled), dashboard "At Risk" widget
- [ ] "Intervention Center" shows: Employee name + photo, alert reason, current workload, recent activity
- [ ] Suggested actions: "Message Employee", "Reassign Tasks", "Extend Deadlines", "Schedule 1:1", "Dismiss Alert"
- [ ] Manager can add private notes: "Spoke to John - personal issue, extending deadlines by 1 week"
- [ ] Alert status: Open, In Progress, Resolved, Dismissed
- [ ] Dashboard widget: "3 team members need attention" with quick preview
- [ ] When PROGRESS_ROLLUP disabled, no automated alerts (manual monitoring only)

**Priority**: P1 (High)
**Story Points**: 3
**Implementation**: Week 8 Day 4 (5-6 hours)
**API**: GET `/api/manager/alerts`, POST `/api/manager/alerts/:alertId/action`
**Screen**: Widget on `02_dashboard.html` + modal `intervention-center.html`
**Backend**: Daily cron job at 8 AM

---

### CONS-007B: View Team SSI Breakdown (Heatmap) [Week 6] ⬜ NOT STARTED

**As a** Consultant
**I want to** see SSI scores visualized by team
**So that** I can identify which teams need targeted interventions

**Block**: 3 (Assessment System - OPTIONAL)
**Feature Flag**: ASSESSMENT_BLOCK

**Acceptance Criteria**:
- [ ] "Team Insights" tab on Assessment Hub
- [ ] Heatmap: Rows = Teams, Columns = SSI Dimensions, Cells = Color-coded scores (Green 8-10, Yellow 6-7.9, Red <6)
- [ ] Hover cell shows: Team name, dimension, exact score, company average, trend
- [ ] Click cell → Drill down to individual member scores + sub-dimensions
- [ ] Filter: Department, assessment period, show/hide inactive teams
- [ ] Sort: By team name, lowest score, highest variance
- [ ] Export to Excel with full data + formulas
- [ ] Comparison mode: Toggle "Compare to Company Avg" (default ON)
- [ ] Summary: "3 teams below average in Strength"
- [ ] When ASSESSMENT_BLOCK disabled, Team Insights tab hidden

**Priority**: P1 (High)
**Story Points**: 3
**Implementation**: Week 6 Day 3 (4-5 hours)
**API**: GET `/api/assessments/team-heatmap`
**Screen**: New tab in `assessment-hub.html`

---

### 🔵 BETA STORIES (4 stories - Post-MVP)

**Note**: The following stories are tagged for BETA release (after January 31, 2026 launch). They enhance the MVP but are not blocking.

---

### CONS-009B: Collaborative OKR Review [Week 10 BETA] ⬜ NOT STARTED

**As a** Consultant
**I want to** facilitate real-time OKR reviews with my client
**So that** we can iterate on AI-generated objectives together

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Feature Flag**: AI_ENGINE

**Priority**: P2 (Medium - BETA feature)
**Story Points**: 5
**Full Details**: [MISSING_STORIES_DETAILED.md](./User_Stories/MISSING_STORIES_DETAILED.md#cons-009b)

---

### MGR-027: Generate Weekly Roll-up Report [Week 11 BETA] ⬜ NOT STARTED

**As a** Manager
**I want to** automatically generate weekly team progress reports
**So that** I can share updates with executives efficiently

**Block**: 5 (Progress Rollup - OPTIONAL)
**Feature Flag**: PROGRESS_ROLLUP

**Priority**: P2 (Medium - BETA feature)
**Story Points**: 3
**Full Details**: [MISSING_STORIES_DETAILED.md](./User_Stories/MISSING_STORIES_DETAILED.md#mgr-027)

---

### EMP-017: See Business Impact Metric [Week 11 BETA] ⬜ NOT STARTED

**As an** Employee
**I want to** see a calculated "Business Impact Score" for my work
**So that** I can understand my contribution to company success

**Block**: 5 (Progress Rollup - OPTIONAL)
**Feature Flag**: PROGRESS_ROLLUP

**Priority**: P2 (Medium - BETA feature)
**Story Points**: 3
**Full Details**: [MISSING_STORIES_DETAILED.md](./User_Stories/MISSING_STORIES_DETAILED.md#emp-017)

---

### EMP-018: Recognition Notifications [Week 10 BETA] ⬜ NOT STARTED

**As an** Employee
**I want to** receive recognition when my tasks contribute to achieved goals
**So that** I feel valued and motivated

**Block**: 5 (Progress Rollup - OPTIONAL)
**Feature Flag**: PROGRESS_ROLLUP

**Priority**: P2 (Medium - BETA feature)
**Story Points**: 2
**Full Details**: [MISSING_STORIES_DETAILED.md](./User_Stories/MISSING_STORIES_DETAILED.md#emp-018)

---

## ⬜ WEEK 6-12 STORIES (SUMMARY)

**Note**: Detailed stories for Week 6-12 will be created at end of each week during implementation. Below is high-level summary.

### Week 6: Profile Management (10 stories)
- EMP-005: View My Profile
- EMP-006: Upload Avatar
- EMP-007: View Assessment History
- MGR-010: View Team Member Profiles
- MGR-011: Update Profile Info
- MGR-025: View Team Assessment Health ⭐ NEW
- EXEC-007: View Executive Dashboard
- EXEC-008: View Organization Info
- CONS-007: View Multi-Company Stats
- CONS-007B: View Team SSI Breakdown ⭐ NEW

### Week 8: Goal Management (12 stories)
- MGR-015: Assign Goals to Team
- MGR-016: Create Team Goals
- MGR-017: Create Tasks from Goals
- MGR-018: Link Tasks to Goals
- MGR-019: Track Goal Progress
- MGR-020: Update Goal Status
- MGR-026: Intervention Workflow (Alerts) ⭐ NEW
- EMP-014: View My Goals
- EMP-015: Update Goal Progress
- EMP-016: View "Why Chain" Context ⭐ NEW (CRITICAL)
- EXEC-010: Approve Company Goals
- EXEC-011: Cascade Goals to Teams

### Week 9: Planning (13 stories)
- EXEC-011B: Approve Manager Quarterly Plans ⭐ NEW
- EXEC-012: Create Yearly OKRs
- EXEC-013: Break into Quarterly Goals
- EXEC-014: Review Team Plans
- EXEC-015: Approve Planning Cycles
- MGR-021: Create Quarterly Plans
- MGR-022: Allocate Weekly Goals
- MGR-023: Assign Team Capacity
- MGR-024: Review Team Planning
- CONS-008: Multi-Company Planning View
- CONS-009: Template Planning Workflows
- CONS-010: Compare Client Plans
- CONS-011: Export Planning Reports

### Week 10-12: Analytics, Admin, Integration (23 stories)
- EXEC-016: View Analytics Dashboard
- EXEC-017: Export Analytics Reports
- EXEC-018: Track Company Metrics
- EMP-017: Business Impact Metric ⭐ NEW (BETA)
- EMP-018: Recognition Notifications ⭐ NEW (BETA)
- MGR-027: Weekly Roll-up Report ⭐ NEW (BETA)
- CONS-009B: Collaborative OKR Review ⭐ NEW (BETA)
- ADMIN-003: Manage Users
- ADMIN-004: Configure System Settings
- ADMIN-005: View System Logs
- ADMIN-006: Manage Permissions
- ADMIN-007: Bulk User Import
- ADMIN-008: Deactivate Users
- ADMIN-009: Configure Email Templates
- ADMIN-010: System Health Dashboard
- Plus 8 integration/testing stories

---

## 👥 ALL STORIES BY PERSONA (CROSS-REFERENCE)

### Employee Stories (18 stories)
- ✅ EMP-001: Take Assessment [Week 1]
- ✅ EMP-002: View Assessment Results [Week 1]
- ⬜ EMP-004: View My Objectives [Week 5]
- ⬜ EMP-005: View My Profile [Week 6]
- ⬜ EMP-006: Upload Avatar [Week 6]
- ⬜ EMP-007: View Assessment History [Week 6]
- ⬜ EMP-008: View Daily Tasks [Week 7]
- ⬜ EMP-009: Complete Task [Week 7]
- ⬜ EMP-010: Update Task Progress [Week 7]
- ⬜ EMP-011: View Task History [Week 7]
- ⬜ EMP-012: Daily Reflection [Week 7]
- ⬜ EMP-013: Task Reminders [Week 7]
- ⬜ EMP-014: View My Goals [Week 8]
- ⬜ EMP-015: Update Goal Progress [Week 8]
- ⬜ EMP-016: View "Why Chain" Context [Week 8] ⭐ NEW (CRITICAL)
- ⬜ EMP-017: Business Impact Metric [Week 11] ⭐ NEW (BETA)
- ⬜ EMP-018: Recognition Notifications [Week 10] ⭐ NEW (BETA)

### Manager Stories (28 stories)
- ✅ MGR-001: Send Team Assessment Invitation [Week 1]
- ✅ MGR-002: View Team Assessment Progress [Week 1]
- ✅ MGR-003: View Team SSI Results [Week 1]
- ⬜ MGR-004: Create New Team [Week 5]
- ⬜ MGR-005: Add Team Members [Week 5]
- ⬜ MGR-006: View Team List [Week 5]
- ⬜ MGR-007: Remove Team Member [Week 5]
- ⬜ MGR-008: Track Objective Progress [Week 5]
- ⬜ MGR-009: Update Team Info [Week 5]
- ⬜ MGR-010: View Team Member Profiles [Week 6]
- ⬜ MGR-011: Update Profile Info [Week 6]
- ⬜ MGR-025: View Team Assessment Health [Week 6] ⭐ NEW
- ⬜ MGR-012: View Team Dashboard [Week 7]
- ⬜ MGR-013: Monitor Team Tasks [Week 7]
- ⬜ MGR-014: Task Notifications [Week 7]
- ⬜ MGR-015: Assign Goals to Team [Week 8]
- ⬜ MGR-016: Create Team Goals [Week 8]
- ⬜ MGR-017: Create Tasks from Goals [Week 8]
- ⬜ MGR-018: Link Tasks to Goals [Week 8]
- ⬜ MGR-019: Track Goal Progress [Week 8]
- ⬜ MGR-020: Update Goal Status [Week 8]
- ⬜ MGR-026: Intervention Workflow (Alerts) [Week 8] ⭐ NEW
- ⬜ MGR-021: Create Quarterly Plans [Week 9]
- ⬜ MGR-022: Allocate Weekly Goals [Week 9]
- ⬜ MGR-023: Assign Team Capacity [Week 9]
- ⬜ MGR-024: Review Team Planning [Week 9]
- ⬜ MGR-027: Weekly Roll-up Report [Week 11] ⭐ NEW (BETA)

### Executive Stories (20 stories)
- ✅ EXEC-001: View Company Assessment Results [Week 1]
- ⚠️ EXEC-002: Generate AI OKRs from Assessment [Week 4] (95% - fix Week 5)
- ⬜ EXEC-003: View All Company Objectives [Week 5]
- ⬜ EXEC-004: Fix AI OKR Review Bug [Week 5 Day 1]
- ⬜ EXEC-005: Filter Objectives by Department [Week 5]
- ⬜ EXEC-006: Track Company Progress [Week 5]
- ⬜ EXEC-007: View Executive Dashboard [Week 6]
- ⬜ EXEC-008: View Organization Info [Week 6]
- ⬜ EXEC-009: Executive Dashboard Overview [Week 7]
- ⬜ EXEC-010: Approve Company Goals [Week 8]
- ⬜ EXEC-011: Cascade Goals to Teams [Week 8]
- ⬜ EXEC-011B: Approve Manager Quarterly Plans [Week 9] ⭐ NEW
- ⬜ EXEC-012: Create Yearly OKRs [Week 9]
- ⬜ EXEC-013: Break into Quarterly Goals [Week 9]
- ⬜ EXEC-014: Review Team Plans [Week 9]
- ⬜ EXEC-015: Approve Planning Cycles [Week 9]
- ⬜ EXEC-016: View Analytics Dashboard [Week 11]
- ⬜ EXEC-017: Export Analytics Reports [Week 11]
- ⬜ EXEC-018: Track Company Metrics [Week 11]

### Consultant Stories (16 stories)
- ✅ CONS-001: Create Assessment Template [Week 1]
- ✅ CONS-002: View Assessment Templates [Week 1]
- ✅ CONS-003: Send Assessment Invitation [Week 1]
- ✅ CONS-004: Track Invitation Status [Week 1]
- ✅ CONS-005: View Template Usage Stats [Week 1]
- ✅ CONS-006: Generate Client OKRs [Week 4]
- ⬜ CONS-007: View Multi-Company Stats [Week 6]
- ⬜ CONS-007B: View Team SSI Breakdown [Week 6] ⭐ NEW
- ⬜ US-W7.5-002: Consultant Prompt Customization [Week 7.5] ⭐ NEW
- ⬜ CONS-008: Multi-Company Planning View [Week 9]
- ⬜ CONS-009: Template Planning Workflows [Week 9]
- ⬜ CONS-009B: Collaborative OKR Review [Week 10] ⭐ NEW (BETA)
- ⬜ CONS-010: Compare Client Plans [Week 9]
- ⬜ CONS-011: Export Planning Reports [Week 9]

### Admin Stories (10 stories)
- ✅ ADMIN-001: Manage Question Library [Week 1]
- ✅ ADMIN-002: Create Global Templates [Week 1]
- ⬜ ADMIN-003: Manage Users [Week 5]
- ⬜ ADMIN-004: Configure System Settings [Week 11]
- ⬜ ADMIN-005: View System Logs [Week 11]
- ⬜ ADMIN-006: Manage Permissions [Week 11]
- ⬜ ADMIN-007: Bulk User Import [Week 11]
- ⬜ ADMIN-008: Deactivate Users [Week 11]
- ⬜ ADMIN-009: Configure Email Templates [Week 11]
- ⬜ ADMIN-010: System Health Dashboard [Week 11]

### IAM Block Stories (5 stories - Week 7) ⭐ NEW
- ⬜ US-W7-001: Company Creation [Week 7]
- ⬜ US-W7-002: Team Hierarchy [Week 7]
- ⬜ US-W7-003: Member Management [Week 7]
- ⬜ US-W7-004: Multi-Company Access [Week 7]
- ⬜ US-W7-005: Context Filtering [Week 7]

### AI OKR Engine Stories (3 stories - Week 7.5) ⭐ NEW
- ⬜ US-W7.5-001: LLM OKR Generation [Week 7.5]
- ⬜ US-W7.5-002: Consultant Prompt Customization [Week 7.5]
- ⬜ US-W7.5-003: Template Fallback [Week 7.5]

---

## 📊 STORY STATISTICS

**Total Stories**: 105 (added 8 new stories for Week 7 and Week 7.5)
**By Status**:
- ✅ Complete: 15 stories (Week 1-4)
- ⚠️ In Progress: 1 story (Week 4 bug - fix Week 5 Day 1)
- ⬜ Not Started: 89 stories (Week 5-12)

**By Priority**:
- P0 (Critical): 30 stories (including all Week 7/7.5 IAM and AI Engine stories)
- P1 (High): 41 stories
- P2 (Medium): 34 stories

**By Persona**:
- Employee: 18 stories (+1)
- Manager: 28 stories (+1)
- Executive: 20 stories (+1)
- Consultant: 16 stories (+3)
- Admin: 10 stories
- IAM Block (cross-persona): 5 stories ⭐ NEW
- AI Engine (cross-persona): 3 stories ⭐ NEW
- _Multi-persona: 11 stories (integration/testing)_

**By Week**:
- Week 1-4: 15 stories ✅
- Week 5: 12 stories ⬜
- Week 6: 10 stories ⬜ (+2 new: MGR-025, CONS-007B)
- **Week 7: 5 stories ⬜ ⭐ NEW (IAM Block)**
- **Week 7.5: 3 stories ⬜ ⭐ NEW (AI OKR Engine)**
- Week 8: 12 stories ⬜ (+2 new: MGR-026, EMP-016)
- Week 9: 13 stories ⬜ (+1 new: EXEC-011B)
- Week 10-12: 23 stories ⬜ (+4 new: EMP-017, EMP-018, MGR-027, CONS-009B)

**By Block**:
- Block 1 (Core Execution): 35 stories (always enabled)
- Block 2 (IAM): 18 stories (optional - 5 new Week 7 stories)
- Block 3 (Assessment System): 22 stories (optional)
- Block 4 (AI OKR Engine): 8 stories (optional - 3 new Week 7.5 stories)
- Block 5 (Progress Rollup): 10 stories (optional)
- Block 6 (Bulk Operations): 5 stories (optional)
- Block 7 (Permission Rules): 3 stories (optional)
- Admin UI Layer: 10 stories (management layer, not a separate block)

---

## 🔗 RELATED DOCUMENTATION

**Weekly Plans**:
- [Daily_Handoffs/Week_5/WEEK_5_PLAN.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_5/WEEK_5_PLAN.md)
- [Daily_Handoffs/Week_7/WEEK_7_PLAN.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_7/WEEK_7_PLAN.md) ⭐ NEW
- [Daily_Handoffs/Week_7.5/WEEK_7.5_PLAN.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_7.5/WEEK_7.5_PLAN.md) ⭐ NEW
- [MASTER_DEV_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md)

**Strategic Documents**:
- [MVP_STRATEGY_V5.md](./MVP_STRATEGY_V5.md) - Modular Block Architecture (Version 5.0)
- [MVP_PRD.md](./MVP_PRD.md) - Product Requirements
- [STRATEGIC_DOCS_UPDATE_PLAN.md](../../STRATEGIC_DOCS_UPDATE_PLAN.md) - Master update plan

**Code References**:
- [Week_1_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_CODE_REFERENCES.md)
- [Week_4_CODE_REFERENCES.md](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/WEEK_4_CODE_REFERENCES.md)

**Design Mockups**:
- [Finalised_Mockups/](../../../Karvia_OKR_Mockups/Finalised_Mockups/)

**Issues**:
- [MASTER_ISSUES_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md)

---

**Last Updated**: 2025-10-23 18:30:00
**Version**: 3.2.0
**Status**: ✅ Complete with 105 stories (97 base + 8 Week 7/7.5 stories)
**Next Update**: End of Week 5 (add Week 6 detailed stories)
**Launch Target**: January 31, 2026 (12-week timeline)
