# SPRINT 7 - USER STORIES & JOURNEY AUDIT

## VERSION CONTROL

**Document**: SPRINT-7-USER-STORIES.md
**Version**: 1.2.0
**Created**: 2025-12-02
**Updated**: 2025-12-02
**Sprint**: 7
**Total Story Points**: 56

**Audit Reference**: [SPRINT_7_8_TECHNICAL_AUDIT.md](../../3-DELIVERY/2-QA-AND-TESTING/SPRINT_7_8_TECHNICAL_AUDIT.md)

---

## EXECUTIVE SUMMARY

**Sprint 7 Focus**: OKR Experience Redesign + Company Profile + Planning View

**Epic Breakdown**:
| Epic | Points | Priority | Stories |
|------|--------|----------|---------|
| **Pre-Sprint Fixes (From Audit)** | 6 | P0 | 3 stories |
| Epic A: OKR Generation Redesign | 19 | P0 | 7 stories |
| Epic B: Company Profile Page | 10 | P1 | 4 stories |
| Epic C: Planning Page View | 10 | P1 | 5 stories |
| Bug Fixes | 11 | P0 | 5 stories |
| **Total** | **56** | | **24 stories** |

---

## ⚠️ PRE-SPRINT TECHNICAL FIXES (From Audit - REQUIRED)

These fixes must be completed **before** starting Epic A-C to ensure code consistency and prevent technical debt.

| Fix | Points | Priority | Issue |
|-----|--------|----------|-------|
| BUG6: Category Enum Mismatch | 3 | P0 | Model vs frontend category values differ |
| BUG7: Create Categories Config | 2 | P0 | No single source of truth for categories |
| BUG8: Auth Middleware Standardization | 1 | P1 | Inconsistent auth middleware usage |

### US-S7-BUG6: Category Enum Mismatch (3 pts)

**Priority**: P0 (Critical - Data Integrity)
**Discovered**: Technical Audit

**Problem**:
```javascript
// server/models/Objective.js has:
enum: ['revenue', 'operational', 'market', 'team', 'customer', 'product', 'other']

// client/pages/objectives.html uses:
['growth', 'customer_success', 'operational', 'team', 'product', 'financial']
```

**Acceptance Criteria**:
- [ ] Define MECE categories as single source of truth
- [ ] Update Objective.js model enum
- [ ] Update objectives.html dropdown
- [ ] Add data migration for existing objectives
- [ ] Test with existing data

**Files**:
- `server/config/categories.js` - NEW (single source of truth)
- `server/models/Objective.js` - Update enum
- `client/pages/objectives.html` - Update dropdown

---

### US-S7-BUG7: Create Categories Config (2 pts)

**Priority**: P0 (Architecture)
**Discovered**: Technical Audit

**Acceptance Criteria**:
- [ ] Create `server/config/categories.js`
- [ ] Define MECE categories with display names and colors
- [ ] Export for use in model, routes, and frontend
- [ ] Include category-to-SSI mapping for AI recommendations

**Config Structure**:
```javascript
// server/config/categories.js
module.exports = {
  CATEGORIES: ['growth', 'customer_success', 'operations', 'people_culture', 'innovation', 'financial_health'],
  CATEGORY_DISPLAY: {
    growth: { name: 'Growth', color: '#10b981' },
    customer_success: { name: 'Customer Success', color: '#3b82f6' },
    // ...
  },
  SSI_MAPPING: {
    low_speed: ['operations', 'innovation'],
    low_strength: ['people_culture', 'customer_success'],
    low_intelligence: ['growth', 'financial_health']
  }
};
```

**Files**:
- `server/config/categories.js` - NEW

---

### US-S7-BUG8: Auth Middleware Standardization (1 pt)

**Priority**: P1 (Consistency)
**Discovered**: Technical Audit

**Problem**:
- Some routes use `verifyToken` from `../middleware/auth`
- Others use `authenticateToken` from `../middleware/authGuards`
- Inconsistent patterns cause maintenance issues

**Acceptance Criteria**:
- [ ] All Sprint 7 routes use `authenticateToken` from `authGuards.js`
- [ ] Document standard pattern in CLAUDE.md
- [ ] Add note to deprecate duplicate middleware

**Standard Pattern**:
```javascript
const { authenticateToken } = require('../middleware/authGuards');
const { requireRole } = require('../middleware/roleGuards');

router.get('/endpoint', authenticateToken, handler);
router.post('/admin-endpoint', authenticateToken, requireRole('EXECUTIVE'), handler);
```

**Files**:
- `server/routes/objectives.js` - Verify usage
- `server/routes/companies.js` - Verify usage
- `server/routes/planning.js` - Verify usage

---

## EPIC A: OKR GENERATION REDESIGN (19 pts)

### Goal
Replace the current dual "Create Objective" and "Generate OKRs" buttons with a unified, intuitive flow that generates one objective at a time with user-selected category.

---

### US-S7-A0: Fix Owner Dropdown Population (1 pt)

**As a** manager/executive
**I want** the owner dropdown to show all team members
**So that** I can assign objectives to the appropriate person

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P0 (Critical - Blocking objective creation)

**Acceptance Criteria**:
- [ ] Owner dropdown populates with all company users
- [ ] Users filtered by role (EXECUTIVE, MANAGER, EMPLOYEE)
- [ ] Current user shown first or pre-selected
- [ ] Search/filter capability for large teams
- [ ] Works in both Manual and AI generation modals

**Screen Reference**: `client/pages/objectives.html` - Create Objective Modal
**API**: GET `/api/users?company_id=:companyId&roles=EXECUTIVE,MANAGER,EMPLOYEE`
**Files**:
- `client/pages/objectives.html` - Modal dropdown
- `client/pages/scripts/objectives.js` - `populateOwnerDropdown()`

---

### US-S7-A1: Unified "Add Objective" Dropdown Button (3 pts)

**As a** manager/executive
**I want** a single entry point for creating objectives
**So that** I have a clear, simple workflow

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P0

**Acceptance Criteria**:
- [ ] Single "Add Objective" button replaces "Create Objective" + "Generate OKRs"
- [ ] Clicking button shows dropdown with two options:
  - "Create Manually" - Opens existing manual modal
  - "Generate with AI" - Opens new AI generation modal
- [ ] Dropdown styled consistently with design system
- [ ] Keyboard accessible (Enter/Space to open, Arrow keys to navigate, Esc to close)
- [ ] Mobile responsive (full-width on small screens)
- [ ] Dropdown closes when clicking outside

**Screen Reference**: `client/pages/objectives.html` - Header section
**Files**:
- `client/pages/objectives.html` - Replace header buttons
- `client/pages/scripts/objectives.js` - Dropdown toggle logic
- `client/css/objectives.css` - Dropdown styling

**UI Design**:
```
┌──────────────────────────┐
│  + Add Objective  ▼      │
├──────────────────────────┤
│  📝 Create Manually      │
│  🤖 Generate with AI     │
└──────────────────────────┘
```

---

### US-S7-A2: AI Objective Generation Modal - Single Objective (5 pts)

**As a** manager/executive
**I want** to generate one AI objective at a time with category selection
**So that** I have control over what AI creates

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Feature Flag**: AI_ENGINE
**Priority**: P0

**Acceptance Criteria**:
- [ ] Modal opens when clicking "Generate with AI"
- [ ] 6 MECE category radio buttons (mutually exclusive):
  - Growth
  - Customer Success
  - Operations
  - People & Culture
  - Innovation
  - Financial Health
- [ ] Data Sources section showing:
  - ☑ Assessment Results (enabled, shows SSI scores if available)
  - ☐ Company Profile (disabled, "Coming Soon" badge)
  - ☐ Macro Industry Insights (disabled, "Coming Soon" badge)
- [ ] Planning Period selection:
  - Start date picker
  - Duration dropdown (Quarterly, Annual, Custom)
- [ ] "What AI Will Generate" preview section updates based on selection
- [ ] "Generate Objective" button triggers AI generation
- [ ] Loading state during generation (spinner + message)
- [ ] Success: Modal closes, objectives list refreshes, new objective highlighted
- [ ] Error: Inline error message with retry option
- [ ] When AI_ENGINE disabled, show message "AI generation unavailable"

**Screen Reference**: `client/pages/objectives.html` - New modal
**API**: POST `/api/ai-okr/generate-single-objective`
**Files**:
- `client/pages/objectives.html` - Modal HTML
- `client/pages/scripts/objectives.js` - Modal logic
- `server/routes/ai-okr.js` - New endpoint
- `server/services/AIObjectivePlanner.js` - Single objective generation

**UI Design**: See design mockup in Sprint 7 planning discussion

**Date Handling**: Selected planning period dates (start_date, duration) will cascade to all generated goals and tasks. See US-S7-BUG5 for date cascade implementation details.

---

### US-S7-A3: Category Coverage Widget (3 pts)

**As a** business owner/executive
**I want** to see which business areas are covered by my objectives
**So that** I ensure balanced strategic planning

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P1

**Acceptance Criteria**:
- [ ] Widget displays on objectives page below header
- [ ] Shows all 6 MECE categories with progress bars
- [ ] Progress bar filled based on number of objectives in category (max 2)
- [ ] Count shown next to each category (e.g., "Growth (2)")
- [ ] Categories with 0 objectives highlighted as "Gap"
- [ ] Recommendation text: "Consider adding: Operations, Innovation"
- [ ] Widget collapsible (user preference saved to localStorage)
- [ ] Updates dynamically when objectives added/removed
- [ ] Responsive design (2 columns on mobile)

**Screen Reference**: `client/pages/objectives.html` - Below header
**API**: GET `/api/objectives/coverage?company_id=:companyId`
**Files**:
- `client/pages/objectives.html` - Widget HTML
- `client/pages/scripts/objectives.js` - Coverage calculation
- `client/css/objectives.css` - Widget styling

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Strategic Coverage                              [Hide]   │
├─────────────────────────────────────────────────────────────┤
│  Growth            ████████░░ 2    Customer Success ████░░░░ 1 │
│  Operations        ░░░░░░░░░░ 0    People & Culture ████░░░░ 1 │
│  Innovation        ░░░░░░░░░░ 0    Financial Health ░░░░░░░░ 0 │
│                                                             │
│  ⚠️ Gaps: Operations, Innovation, Financial Health          │
└─────────────────────────────────────────────────────────────┘
```

---

### US-S7-A4: Category Balance Validation (3 pts)

**As a** business owner/executive
**I want** to be warned when adding objectives to already-covered categories
**So that** I maintain balanced strategic coverage

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P1

**Acceptance Criteria**:
- [ ] Validation triggered when selecting category in AI modal
- [ ] Warning modal shown if category already has 2+ objectives
- [ ] Warning shows:
  - Count of existing objectives in selected category
  - Suggestion of uncovered categories
  - "Choose Different" and "Continue Anyway" buttons
- [ ] "Choose Different" returns to category selection
- [ ] "Continue Anyway" proceeds with generation
- [ ] Validation also runs before manual objective creation
- [ ] API endpoint for validation check

**Screen Reference**: `client/pages/objectives.html` - Warning modal
**API**: GET `/api/objectives/validate-category?category=:category&company_id=:companyId`
**Files**:
- `client/pages/objectives.html` - Warning modal HTML
- `client/pages/scripts/objectives.js` - Validation logic
- `server/routes/objectives.js` - Validation endpoint
- `server/services/OKRValidationService.js` - NEW service

**Warning Modal Design**:
```
┌─────────────────────────────────────────────────┐
│  ⚠️ Category Already Covered                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  You already have 2 objectives in "Growth".     │
│                                                 │
│  Consider creating an objective in:             │
│  • Operations (0 objectives)                    │
│  • Innovation (0 objectives)                    │
│                                                 │
│           [Choose Different]  [Continue Anyway] │
└─────────────────────────────────────────────────┘
```

---

### US-S7-A5: Assessment-Driven Recommendations (2 pts)

**As a** user who completed SSI assessment
**I want** AI to consider my assessment results when generating objectives
**So that** objectives address identified weaknesses

**Block**: 4 (AI OKR Engine - OPTIONAL) + Block 3 (Assessment - OPTIONAL)
**Feature Flag**: AI_ENGINE, ASSESSMENT_BLOCK
**Priority**: P1

**Acceptance Criteria**:
- [ ] AI modal fetches SSI scores when opened (if available)
- [ ] Low-scoring dimensions (< 60%) highlighted in modal
- [ ] Recommendation box shows suggested categories based on SSI:
  - Low Speed → Operations, Innovation
  - Low Strength → People & Culture, Customer Success
  - Low Intelligence → Growth, Financial Health
- [ ] Recommended categories have "Recommended" badge
- [ ] AI prompt includes SSI scores as context
- [ ] Generated objectives reference assessment insights in description
- [ ] "Based on your assessment" label on AI-generated objectives
- [ ] Graceful fallback if no assessment data (use company profile)

**Screen Reference**: `client/pages/objectives.html` - AI modal
**API**: GET `/api/assessments/latest-scores?company_id=:companyId`
**Files**:
- `client/pages/scripts/objectives.js` - Fetch and display SSI
- `server/routes/ai-okr.js` - Include SSI in AI prompt
- `server/services/AIObjectivePlanner.js` - SSI-aware generation

**UI Enhancement**:
```
┌─────────────────────────────────────────────────────┐
│  💡 Based on your Assessment                        │
├─────────────────────────────────────────────────────┤
│  Your Speed score (52) suggests focusing on:        │
│  • Operations - Process efficiency   [Recommended]  │
│  • Innovation - Faster iteration     [Recommended]  │
└─────────────────────────────────────────────────────┘
```

---

### US-S7-A6: Data Sources Placeholder UI (2 pts)

**As a** user
**I want** to see future data source options (disabled)
**So that** I understand the roadmap and what's coming

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P2

**Acceptance Criteria**:
- [ ] Data Sources section in AI modal shows 3 options:
  - Assessment Results - Enabled, checked by default
  - Company Profile - Disabled, "Coming Soon" badge
  - Macro Industry Insights - Disabled, "Coming Soon" badge
- [ ] Disabled checkboxes have visual distinction (grayed out)
- [ ] Lock icon (🔒) next to disabled options
- [ ] Hover tooltip on disabled options: "This feature is coming soon"
- [ ] When Company Profile enabled (future), checkbox becomes active
- [ ] Clean styling consistent with design system

**Screen Reference**: `client/pages/objectives.html` - AI modal
**Files**:
- `client/pages/objectives.html` - Checkbox UI
- `client/css/objectives.css` - Disabled state styling

---

## EPIC B: COMPANY PROFILE PAGE (10 pts)

### Goal
Create a dedicated company profile page where business owners can manage company information used for AI objective generation.

---

### US-S7-B1: Company Profile Page - Basic (5 pts)

**As a** business owner/consultant
**I want** a dedicated page to manage company information
**So that** AI can generate better, more relevant objectives

**Block**: 2 (IAM - OPTIONAL)
**Feature Flag**: IAM_BLOCK
**Priority**: P0

**Acceptance Criteria**:
- [ ] New page accessible from sidebar under "Settings > Company Profile"
- [ ] Form sections:
  - **Basic Information**: Company Name*, Industry*, Size*, Stage*, Founded Year
  - **Mission & Vision**: Mission Statement, Vision Statement (text areas)
  - **Strategic Context**: Strategic Priorities (3 text fields), Key Challenges, Competitive Advantage
- [ ] Required fields marked with asterisk (*)
- [ ] Industry dropdown with predefined options (Technology, Healthcare, Finance, etc.)
- [ ] Company Size dropdown (1-10, 11-50, 51-200, 201-500, 500+)
- [ ] Stage dropdown (Startup, Growth, Mature, Enterprise)
- [ ] Auto-save on field blur OR explicit "Save Changes" button
- [ ] Success toast: "Profile updated successfully"
- [ ] Validation errors shown inline
- [ ] Mobile responsive layout

**Screen Reference**: `client/pages/company-profile.html` - NEW
**API**:
- GET `/api/companies/:id/profile`
- PUT `/api/companies/:id/profile`
**Files**:
- `client/pages/company-profile.html` - NEW page
- `client/pages/scripts/company-profile.js` - NEW controller
- `server/models/Company.js` - Add profile fields
- `server/routes/companies.js` - Profile endpoints

**Data Model Extension**:
```javascript
// Company.js - profile field addition
profile: {
  mission: String,
  vision: String,
  founded_year: Number,
  strategic_priorities: [String],  // Max 3
  key_challenges: String,
  competitive_advantage: String,
  profile_completeness: Number     // 0-100%
}
```

---

### US-S7-B2: Profile Access Control (2 pts)

**As an** admin
**I want** only authorized users to edit company profile
**So that** sensitive company data is protected

**Block**: 2 (IAM - OPTIONAL)
**Priority**: P1

**Acceptance Criteria**:
- [ ] Only EXECUTIVE and CONSULTANT roles can edit profile
- [ ] MANAGER and EMPLOYEE roles see read-only view
- [ ] Edit button hidden for unauthorized roles
- [ ] API returns 403 Forbidden for unauthorized edit attempts
- [ ] Audit log captures profile changes (who, what, when)

**API**: PUT `/api/companies/:id/profile` - Role check middleware
**Files**:
- `server/routes/companies.js` - Add role validation
- `server/middleware/auth.js` - requireRole('EXECUTIVE', 'CONSULTANT')

---

### US-S7-B3: Profile Integration with AI Generation (2 pts)

**As a** user generating AI objectives
**I want** AI to use company profile data
**So that** objectives are tailored to my specific business context

**Block**: 4 (AI OKR Engine - OPTIONAL)
**Feature Flag**: AI_ENGINE
**Priority**: P1

**Acceptance Criteria**:
- [ ] When "Company Profile" data source enabled (future):
  - AI fetches company profile data
  - Profile data included in AI prompt
  - Mission/Vision influence objective alignment
  - Strategic priorities guide KR focus
  - Key challenges addressed in risk factors
- [ ] Currently: Backend prepared but checkbox disabled in UI
- [ ] API to fetch profile for AI context
- [ ] Graceful fallback if profile incomplete

**API**: GET `/api/companies/:id/profile-for-ai`
**Files**:
- `server/services/AIContextService.js` - Fetch profile
- `server/services/AIObjectivePlanner.js` - Include in prompt

---

### US-S7-B4: Profile Completeness Indicator (1 pt)

**As a** business owner
**I want** to see how complete my company profile is
**So that** I know what information is missing

**Block**: 2 (IAM - OPTIONAL)
**Priority**: P2

**Acceptance Criteria**:
- [ ] Progress bar on profile page showing completeness %
- [ ] Calculation: (filled fields / total fields) * 100
- [ ] Color coding: Red (<50%), Yellow (50-80%), Green (>80%)
- [ ] List of missing fields below progress bar
- [ ] Appears in AI modal when Company Profile enabled (future)
- [ ] Link to profile page: "Complete your profile for better AI suggestions"

**Files**:
- `client/pages/company-profile.html` - Progress indicator
- `client/pages/scripts/company-profile.js` - Calculate completeness
- `server/routes/companies.js` - Return completeness in response

---

## EPIC C: PLANNING PAGE VIEW (10 pts)

### Goal
Enhance the Planning page to display generated plans (Quarterly → Weekly → Tasks) in a read-only tree view.

---

### US-S7-C1: Plan Status on KR Cards (2 pts)

**As a** manager/executive
**I want** to see which KRs have plans created
**So that** I know which areas need attention

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P0

**Acceptance Criteria**:
- [ ] Each KR card shows plan status badge:
  - "Not Planned" (gray) - No goals exist for this KR
  - "Planned" (blue) - Has quarterly/weekly goals
  - "In Progress" (yellow) - Has started execution
  - "Complete" (green) - All goals completed
- [ ] Owner shown on KR card (currently missing)
- [ ] Plan progress percentage shown (if planned)
- [ ] "Create Plan" button for unplanned KRs
- [ ] "View Plan" button for planned KRs
- [ ] Status updates automatically when goals created

**Screen Reference**: `client/pages/planning.html` - Left panel
**API**: GET `/api/goals/quarterly?key_result_id=:krId` - Check if exists
**Files**:
- `client/pages/planning.html` - KR card template
- `client/pages/scripts/planning.js` - Status calculation

**UI Design**:
```
┌───────────────────────────────────┐
│ ✅ Identify 2 operational improv..│  ← Has plan indicator
│ Current: 1    Target: 2           │
│ ████████░░░░░░░░░░░░░░░░░ 50%     │
│ Owner: @John    Status: Planned   │
│                        [View →]   │
└───────────────────────────────────┘
```

---

### US-S7-C2: Fetch Plan Hierarchy (2 pts)

**As a** system
**I want** to load the complete plan hierarchy for a KR
**So that** users can see Quarterly → Weekly → Tasks

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P0

**Acceptance Criteria**:
- [ ] When user clicks planned KR, fetch full hierarchy:
  1. Quarterly goals for the KR
  2. Weekly goals for each quarterly goal
  3. Tasks for each weekly goal
- [ ] Data assembled into nested structure for display
- [ ] Loading state while fetching
- [ ] Cache hierarchy to avoid repeated fetches
- [ ] Handle empty states at each level

**API Calls**:
1. GET `/api/goals/quarterly/:keyResultId`
2. GET `/api/goals/weekly/:quarterlyGoalId` (for each)
3. GET `/api/tasks?goal_id=:weeklyGoalId` (for each)

**Files**:
- `client/pages/scripts/planning.js` - `loadPlanHierarchy(krId)`

**Data Structure**:
```javascript
{
  keyResult: { id, title, target, current },
  quarterlyGoals: [{
    id, name, progress, status,
    weeklyGoals: [{
      id, name, week, progress, status,
      tasks: [{
        id, name, status, due_date
      }]
    }]
  }]
}
```

---

### US-S7-C3: Tree View Display - Read Only (3 pts)

**As a** manager/executive
**I want** to see the plan as a collapsible tree
**So that** I can understand the full execution breakdown

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P0

**Acceptance Criteria**:
- [ ] Right panel shows tree view when planned KR selected
- [ ] Hierarchy levels:
  - Quarter (Q1, Q2, etc.) - Collapsible
  - Week (Week 1, Week 2, etc.) - Collapsible
  - Tasks - Leaf nodes
- [ ] Each level shows:
  - Name/title
  - Progress percentage with bar
  - Status icon (✅ 🔄 ○)
- [ ] Click quarter to expand/collapse weeks
- [ ] Click week to expand/collapse tasks
- [ ] Default state: Current quarter expanded, others collapsed
- [ ] Smooth animations for expand/collapse
- [ ] No editing capability (view only)

**Screen Reference**: `client/pages/planning.html` - Right panel
**Files**:
- `client/pages/planning.html` - Tree structure HTML
- `client/pages/scripts/planning.js` - Tree rendering
- `client/css/planning.css` - Tree styling

**UI Design**:
```
📅 Q1 2026                                    ████░░ 50%
│
├─ 📌 Week 1: Research pain points           ████████ ✓
│   ├─ ✅ Review customer feedback
│   ├─ ✅ Analyze support tickets
│   └─ ✅ Document findings
│
├─ 📌 Week 2: Interview stakeholders         ████████ ✓
│   ├─ ✅ Schedule 5 interviews
│   ├─ ✅ Conduct interviews
│   └─ ✅ Summarize insights
│
├─ 📌 Week 3: Analyze & prioritize           ███░░░ 33%
│   ├─ ✅ Create analysis framework
│   ├─ 🔄 Score improvement areas
│   └─ ○ Prioritize top 3
│
└─ 📌 Week 4: Document & present             ░░░░░░ 0%
    ├─ ○ Create presentation
    ├─ ○ Review with manager
    └─ ○ Finalize recommendation
```

---

### US-S7-C4: Task Status Display (2 pts)

**As a** manager/executive
**I want** to see task status in the tree
**So that** I understand execution progress

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P1

**Acceptance Criteria**:
- [ ] Task status icons:
  - ✅ Completed (green)
  - 🔄 In Progress (blue)
  - ○ Not Started/Todo (gray)
  - ⚠️ At Risk/Overdue (yellow/red)
  - 🚫 Blocked (red)
- [ ] Status from database `task.status` field
- [ ] Overdue detection: due_date < today && status != completed
- [ ] Task shows assigned user initials (avatar)
- [ ] Hover tooltip: Full task name, due date, assignee
- [ ] READ ONLY - No status changes from planning page

**Files**:
- `client/pages/scripts/planning.js` - Status icon mapping
- `client/css/planning.css` - Icon styling

---

### US-S7-C5: Link to Dashboard for Task Management (1 pt)

**As a** user viewing a plan
**I want** to quickly navigate to Dashboard
**So that** I can manage tasks there

**Block**: 1 (Core Execution - REQUIRED)
**Priority**: P2

**Acceptance Criteria**:
- [ ] "Open Dashboard" button in plan view header
- [ ] Button links to dashboard with optional KR filter
- [ ] Footer note: "To update tasks, go to Dashboard"
- [ ] Dashboard link passes context (KR ID) if possible
- [ ] Consistent CTA styling

**Screen Reference**: `client/pages/planning.html` - Right panel header
**Files**:
- `client/pages/planning.html` - Add button
- `client/pages/scripts/planning.js` - Navigation handler

---

## BUG FIXES (11 pts)

### US-S7-BUG1: SSI Diagnostic Report 500 Error (2 pts)

**As a** user
**I want** the SSI Diagnostic Report to generate successfully
**So that** I can view comprehensive team analysis

**Priority**: P0 (Critical - Production broken)
**Location**: `team-ssi-view.html` → "Generate SSI Diagnostic Report" button

**Bug Details**:
```
POST /api/diagnostic/generate → 500 (Internal Server Error)

Stack trace:
- team-ssi-view.js:1133 → generateDiagnosticReport()
- team-ssi-view.js:740 → Event handler
```

**Acceptance Criteria**:
- [ ] Diagnostic report generates without 500 error
- [ ] Report displays in modal
- [ ] Error handling with user-friendly message
- [ ] Production environment tested

**Files to Investigate**:
- `server/routes/diagnostic-reports.js`
- `server/services/DiagnosticEngine.js`
- `client/pages/scripts/team-ssi-view.js`

---

### US-S7-BUG2: Owner Dropdown Empty (1 pt)

*Covered by US-S7-A0 above*

---

### US-S7-BUG3: Remove "Company Owner" from Signup Role Dropdown (1 pt)

**As a** new user signing up
**I want** clear, non-confusing role options
**So that** I select the correct role for my account

**Priority**: P1 (UX Polish)
**Location**: `signup.html` - Role dropdown

**Bug Details**:
- Current dropdown shows: Employee, Manager, Executive, **Company Owner**, Consultant
- "Company Owner" is confusing alongside "Executive"
- Should only show: Employee, Manager, Executive, Consultant

**Acceptance Criteria**:
- [ ] Remove "Company Owner" option from role dropdown
- [ ] Keep only: Employee, Manager, Executive, Consultant
- [ ] Existing "Company Owner" accounts still work (backend unchanged)
- [ ] Signup flow tested end-to-end

**Files**:
- `client/pages/signup.html` - Remove option from dropdown

---

### US-S7-BUG4: KR Plan Status Not Updating After Generation (2 pts)

**As a** manager/executive
**I want** KR cards to show correct plan status
**So that** I know which KRs have plans and can view them

**Priority**: P0 (Critical - Core functionality broken)
**Location**: `planning.html` - KR cards in left panel

**Bug Details**:
- When a plan is generated for a KR, the card still shows "Not planned" + "Create Plan"
- Dialog correctly detects existing plan ("A weekly plan already exists... Existing weeks: 24")
- But the KR card UI doesn't reflect this state
- User should see "Planned" badge + "View" button instead

**Current Behavior**:
```
┌─────────────────────────────────────┐
│ Launch social media campaign...     │
│ Current: 0    Target: 1             │
│ Not planned         [Create Plan]   │  ← WRONG
└─────────────────────────────────────┘
```

**Expected Behavior**:
```
┌─────────────────────────────────────┐
│ Launch social media campaign...     │
│ Current: 0    Target: 1             │
│ ████████░░ 50%   Planned  [View →]  │  ← CORRECT
└─────────────────────────────────────┘
```

**Root Cause Investigation**:
- KR cards not checking for existing goals on load
- Need to call `/api/goals/quarterly/:keyResultId` to check if plan exists
- Status calculation missing from card rendering

**Acceptance Criteria**:
- [ ] On page load, check if each KR has existing quarterly/weekly goals
- [ ] If goals exist: Show "Planned" badge + "View" button
- [ ] If no goals: Show "Not planned" + "Create Plan" button
- [ ] Show progress bar if plan exists
- [ ] "View" button opens tree view (Epic C feature)

**Files**:
- `client/pages/planning.html` - KR card template
- `client/pages/scripts/planning.js` - Add plan status check on load

**Note**: This bug is foundational to Epic C. Fix this first, then build tree view on top.

---

### US-S7-BUG5: Date Cascade Misalignment in AI-Generated Plans (5 pts)

**As a** manager/executive creating objectives
**I want** AI-generated goals and tasks to respect my objective's date range
**So that** a 6-month objective (Jul-Dec) doesn't have tasks scheduled for January

**Priority**: P0 (Critical - Data Integrity)
**Location**: `server/routes/planning.js` - AI plan generation

**Bug Details**:
When user creates an Objective with:
- `time_period_type`: `fiscal_year` or `custom`
- `start_date`: July 1, 2025
- `end_date`: December 31, 2025

The AI plan generator uses hardcoded calendar quarters:
```javascript
// planning.js:32-42 (CURRENT - WRONG)
function getQuarterDates(quarter, year) {
  const quarterMap = {
    'Q1': { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },  // Jan-Mar
    'Q2': { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },  // Apr-Jun
    'Q3': { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },  // Jul-Sep
    'Q4': { start: new Date(year, 9, 1), end: new Date(year, 11, 31) }  // Oct-Dec
  };
  return quarterMap[quarter];
}
```

**Result**:
- Q1 quarterly goal gets Jan 1 - Mar 31 dates (OUTSIDE objective range!)
- Q2 quarterly goal gets Apr 1 - Jun 30 dates (OUTSIDE objective range!)
- Weekly goals and tasks inherit these wrong dates
- Data integrity broken for fiscal_year and custom objectives

**Expected Behavior**:
Should use `DateService.calculateQuarterDates(objective.start_date, objective.end_date, quarterNumber)`:
```javascript
// EXPECTED - Relative to Objective dates
// For 6-month objective (Jul-Dec):
// Quarter 1: Jul 1 - Aug 15
// Quarter 2: Aug 16 - Sep 30
// Quarter 3: Oct 1 - Nov 15
// Quarter 4: Nov 16 - Dec 31
```

**Root Cause Analysis**:
1. `planning.js` has local `getQuarterDates()` that ignores Objective dates
2. `DateService.calculateQuarterDates()` exists but is NOT called
3. `ValidationService.validateGoalDates()` exists but is NOT called during AI generation
4. Objective's `start_date` and `end_date` are available but never passed to date calculations

**⚠️ AUDIT REQUIREMENT - Use Existing Services**:
```javascript
// Replace local functions with DateService
const DateService = require('../services/DateService');
const ValidationService = require('../services/ValidationService');

// For quarterly goal dates - use DateService.calculateQuarterDates()
const quarterDates = DateService.calculateQuarterDates(
  objective.start_date,
  objective.end_date,
  quarterNumber
);

// Validate before creating goals
const validation = ValidationService.validateGoalDates(goalData, objective);
if (!validation.valid) {
  throw new Error(validation.errors.join(', '));
}
```

**Acceptance Criteria**:
- [ ] Remove local `getQuarterDates()` function from `planning.js`
- [ ] Replace with `DateService.calculateQuarterDates()`
- [ ] Pass Objective dates to goal/task creation
- [ ] Add `ValidationService.validateGoalDates()` call during AI plan generation
- [ ] Weekly goal dates fall within their parent quarterly goal
- [ ] Task dates fall within their parent weekly goal
- [ ] All dates stay within Objective's start_date to end_date range
- [ ] Test with calendar_year, fiscal_year, and custom period objectives

**Test Scenarios**:
```
Scenario 1: Calendar Year (Jan-Dec 2025)
- Q1: Jan 1 - Mar 31 ✓
- Q2: Apr 1 - Jun 30 ✓
- Q3: Jul 1 - Sep 30 ✓
- Q4: Oct 1 - Dec 31 ✓

Scenario 2: Fiscal Year (Apr 2025 - Mar 2026)
- Q1: Apr 1 - Jun 30 ✓
- Q2: Jul 1 - Sep 30 ✓
- Q3: Oct 1 - Dec 31 ✓
- Q4: Jan 1 - Mar 31 ✓

Scenario 3: Custom 6-Month (Jul-Dec 2025)
- Q1: Jul 1 - Aug 15 ✓
- Q2: Aug 16 - Sep 30 ✓
- Q3: Oct 1 - Nov 15 ✓
- Q4: Nov 16 - Dec 31 ✓
```

**Files**:
- `server/routes/planning.js` - Replace getQuarterDates() with DateService call
- `server/services/DateService.js` - Already has calculateQuarterDates() method
- `server/services/ValidationService.js` - Add validation call during creation

**Note**: This is a data integrity issue. All existing fiscal_year and custom objectives with AI-generated plans have misaligned dates.

---

## TASK MANAGEMENT COVERAGE VERIFICATION

### Existing Stories (Already Documented)

The following task management stories are already covered in USER_STORIES_MASTER.md:

| Story ID | Title | Week | Status |
|----------|-------|------|--------|
| EMP-008 | View Daily Tasks | Week 8 | ⬜ |
| EMP-009 | Complete Task | Week 8 | ⬜ |
| EMP-010 | Update Task Progress | Week 8 | ⬜ |
| EMP-011 | View Task History | Week 8 | ⬜ |
| EMP-012 | Daily Reflection | Week 8 | ⬜ |
| EMP-013 | Task Reminders | Week 8 | ⬜ |
| EMP-014 | View My Goals | Week 7 | ⬜ |
| EMP-015 | Update Goal Progress | Week 7 | ⬜ |
| EMP-016 | View "Why Chain" Context | Week 8 | ⬜ |

### Task Visibility Flow (Verified)

```
AI generates plan → Tasks created in database
         ↓
Tasks assigned to users (assigned_to field)
         ↓
Employee logs into Dashboard
         ↓
Dashboard fetches: GET /api/tasks?assigned_to=me
         ↓
Employee sees their tasks with:
- Task name
- Due date
- Priority
- Status
- Linked goal (Why Chain)
         ↓
Employee completes task:
PUT /api/tasks/:id/complete
         ↓
Progress cascades: Task → Weekly Goal → Quarterly Goal → KR → Objective
```

### Gaps Identified (None Critical)

- ✅ Task creation via AI - Covered in planning.js
- ✅ Task assignment - Covered in Task model
- ✅ Task visibility for employees - EMP-008
- ✅ Task completion - EMP-009
- ✅ Progress updates - EMP-010
- ✅ Why Chain context - EMP-016

**Conclusion**: Task management in Dashboard is fully covered by existing user stories.

---

## USER JOURNEY UPDATES NEEDED

### Journey: OKR Creation (NEW)

```
Executive/Manager lands on Objectives page
         ↓
Clicks "+ Add Objective" button
         ↓
Dropdown shows: "Create Manually" | "Generate with AI"
         ↓
[If "Generate with AI"]:
  → Opens AI Generation Modal
  → Selects MECE category (sees recommendations based on SSI)
  → Sees data sources (Assessment enabled, others "Coming Soon")
  → Sets planning period
  → Clicks "Generate Objective"
  → AI creates 1 objective + 3-5 KRs
  → Success: Redirects to objectives list
         ↓
[If "Create Manually"]:
  → Opens existing manual modal
  → Fills form (now with working owner dropdown)
  → Saves objective
```

### Journey: Planning Page View (NEW)

```
Manager lands on Planning page
         ↓
Sees Objective tabs at top
         ↓
Clicks objective to see KRs on left panel
         ↓
Each KR shows:
- Plan status badge (Not Planned / Planned / In Progress)
- Owner name
- Progress bar
         ↓
[If KR has plan]:
  → Clicks "View" button
  → Right panel shows tree view:
    - Quarterly goals (collapsible)
    - Weekly goals (collapsible)
    - Tasks (with status icons)
  → READ ONLY - no edits
  → Link to Dashboard for task management
         ↓
[If KR has no plan]:
  → Clicks "Create Plan" button
  → Opens planning form (existing flow)
```

---

## SPRINT 7 STORY SUMMARY

### By Priority

| Priority | Stories | Points |
|----------|---------|--------|
| P0 (Critical) | 9 | 25 |
| P1 (High) | 8 | 16 |
| P2 (Medium) | 4 | 9 |
| **Total** | **21** | **50** |

### By Epic

| Epic | Stories | Points |
|------|---------|--------|
| A: OKR Redesign | 7 | 19 |
| B: Company Profile | 4 | 10 |
| C: Planning View | 5 | 10 |
| Bug Fixes | 5 | 11 |
| **Total** | **21** | **50** |

### Implementation Order

```
Week 1:
├── Day 1: US-S7-A0 (Owner fix) + US-S7-BUG1 (Diagnostic) + US-S7-BUG3 (Signup) + US-S7-BUG4 (KR status) + US-S7-BUG5 (Date cascade)
├── Day 2-3: US-S7-A1 (Unified button) + US-S7-A2 (AI modal)
├── Day 4: US-S7-A6 (Placeholder UI) + US-S7-A3 (Coverage widget)
└── Day 5: US-S7-A4 (Validation) + US-S7-A5 (Assessment recs)

Week 2:
├── Day 1-2: US-S7-B1 (Company Profile page)
├── Day 2: US-S7-B2 (Access control) + US-S7-B4 (Completeness)
├── Day 3: US-S7-B3 (AI integration)
├── Day 4: US-S7-C1 (KR status) + US-S7-C2 (Fetch hierarchy)
└── Day 5: US-S7-C3 (Tree view) + US-S7-C4 (Task status) + US-S7-C5 (Dashboard link)

Testing:
└── Day 6-7: Integration testing, bug fixes
```

---

## RELATED DOCUMENTATION

- [USER_STORIES_MASTER.md](./USER_STORIES_MASTER.md) - All user stories
- [USER_JOURNEYS_MASTER.md](../user-journeys/USER_JOURNEYS_MASTER.md) - Journey overview
- [EMPLOYEE_JOURNEY.md](../user-journeys/EMPLOYEE_JOURNEY.md) - Employee journey (task management)
- [EXECUTIVE_JOURNEY.md](../user-journeys/EXECUTIVE_JOURNEY.md) - Executive journey

---

**Document Created**: 2025-12-02
**Version**: 1.2.0
**Sprint**: 7
**Status**: Ready for Implementation
**Last Updated**: 2025-12-02 (Added Pre-Sprint fixes BUG6-8 from audit, updated BUG5 with service requirements)
