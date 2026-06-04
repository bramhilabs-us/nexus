# Sprint 13 Master Plan

**Sprint**: 13
**Created**: January 14, 2026
**Updated**: January 20, 2026 (Structure-First Reorganization)
**Total Story Points**: 8 pts
**Duration**: 2-3 days
**Status**: PLANNING
**Focus**: Branding Swap Only (Chief AI Rebranding)

---

## Reorganization Applied (January 20, 2026)

| Change | Reason | Impact |
|--------|--------|--------|
| REMOVED Epic D (5 pts) | Dashboard UI moved to Sprint 11 Epic U | Structure-first |
| REMOVED Epic O (3 pts) | Objectives UI moved to Sprint 11 Epic U | Structure-first |
| REMOVED Epic P (5 pts) | Planning UI covered by Sprint 11 Epic L | No duplication |
| **Total**: 8 pts | Branding-only sprint | 2-3 days duration |

**Strategy**: UI structure implemented in Sprint 11-12. Sprint 13 is pure branding swap - logo, colors, philosophy accents.

---

## Executive Summary

Sprint 13 delivers **branding-only changes** - pure CSS/asset swap:

1. **Chief AI Rebranding** - Update logo from "Cultural Discipline" to "Chief AI" with new gradients
2. **Navigation Philosophy Colors** - Add PLAY/ASSESS/ALIGN/PLAN color accents

**Key Deliverables**:
- Chief AI logo in navigation
- Navy gradient replacing purple gradient
- Philosophy colors on navigation hover/active states

**Important**: All UI structure (3-column layouts, two-panel designs, card patterns) already implemented in Sprint 11-12. Sprint 13 only swaps colors and branding.

**Mockup References** (for color/branding only, structure already done):
- [sprint_mockups/sprint13-dashboard-redesign.html](../sprint_mockups/sprint13-dashboard-redesign.html)
- [sprint_mockups/sprint13-objectives-redesign.html](../sprint_mockups/sprint13-objectives-redesign.html)
- [sprint_mockups/sprint13-planning-redesign.html](../sprint_mockups/sprint13-planning-redesign.html)

---

## Sprint Dependencies

### Hard Dependencies
- **Sprint 11 Complete** - Epic U (UI Standardization) must be done first
- **Sprint 12 Complete** - Epic V (SSI Report UI) should be done

### Soft Dependencies
- Navigation should be stable (no active bugs)
- All UI structure patterns from Sprint 11-12 in place

### Why Dependencies?
Sprint 13 is a branding swap only. It changes CSS variables and swaps assets but does NOT change page structure. All structure must be in place from Sprint 11-12 first.

---

## Deep Impact Analysis (Branding-Only)

### What Sprint 13 Changes

Sprint 13 is LIMITED to branding/color changes only:

| Change Type | Files Affected | Sprint 11-12 Setup |
|-------------|----------------|-------------------|
| Logo swap | `navigation.js` | Structure ready |
| Gradient swap | `s13-patterns.css`, inline styles | Patterns established |
| Philosophy colors | `navigation.js` | Nav structure ready |
| Tooltips | `navigation.js` | Nav items ready |

### What Sprint 13 Does NOT Change

All of these were implemented in Sprint 11-12:

| Component | Sprint 11-12 Epic | Status |
|-----------|------------------|--------|
| Dashboard 3-column layout | Epic U (U1) | Done |
| Objectives card grid | Epic U (U2) | Done |
| Planning two-panel layout | Epic L | Done |
| Assessment Hub tabs | Epic U (U3) | Done |
| Question Library sidebar | Epic U (U4) | Done |
| SSI Report 12-block grid | Epic V | Done |

### Dashboard Page Impact Analysis

**Current File**: `client/pages/dashboard.html`

| Aspect | Current State | Sprint 13 Change | Risk Level |
|--------|---------------|------------------|------------|
| Layout | max-w-7xl single column | max-w-1200px, 3-column grid | LOW |
| API Endpoint | `/api/dashboard/today` | No change - same API | NONE |
| Data Rendering | `renderMyTasks()`, `renderWeeklyGoals()` | Rewrite render functions | MEDIUM |
| Task Actions | "Complete" button only | Add Postpone, Assign, Chat | MEDIUM |
| State Management | `dashboardData` object | Add `selectedObjective` filter | LOW |

**API Dependencies (No Backend Changes)**:
- `GET /api/dashboard/today` - Existing endpoint, no modification needed
- Response structure unchanged: `my_focus.tasks_today`, `this_week.my_weekly_goals`

**JavaScript Functions to Preserve**:
- `initDashboard()` - Entry point (keep logic, update rendering)
- `loadDashboard()` - API call (keep as-is)
- `completeTask(taskId)` - Task completion (keep as-is)
- `escapeHtml()` - XSS prevention (must keep)

**Functions to Modify**:
- `renderQuickStats()` → Replace with objective context cards
- `renderMyTasks()` → Split into 3 columns (overdue/today/tomorrow)
- `renderWeeklyGoals()` → Split into 3 columns (last/this/next week)
- `renderTaskCard()` → Add hover actions

**CSS Impact**: Complete rewrite (inline styles in HTML), no external CSS files affected.

---

### Objectives Page Impact Analysis

**Current Files**:
- `client/pages/objectives.html` (HTML + inline CSS)
- `client/pages/scripts/objectives.js` (1382 lines)

| Aspect | Current State | Sprint 13 Change | Risk Level |
|--------|---------------|------------------|------------|
| Layout | Grid auto-fill, minmax(400px) | Same grid, adjust card styling | LOW |
| API Client | `objectives-api-client.js` | No change | NONE |
| Stats Display | 4 stat cards | Stat tiles row | LOW |
| Filter System | Filter buttons + pills | Category pills only | LOW |
| Modal System | View/Edit modal | Keep all modal logic | NONE |
| KR Progress | Inline progress bars | Keep styling approach | LOW |

**API Dependencies (No Backend Changes)**:
- `ObjectivesAPI.getObjectives()` - List objectives
- `ObjectivesAPI.updateObjective()` - Update objective
- `ObjectivesAPI.deleteObjective()` - Delete objective

**JavaScript Functions to Preserve (Critical)**:
- `loadObjectives()` - API data loading
- `calculateStats()` - Stats calculation
- `createObjectiveCard()` - Card generation (modify styling only)
- `renderKeyResultsPreview()` - KR rendering
- `calculateKRProgress()` - Progress calculation
- `getFilteredObjectives()` - Filter logic
- ALL Modal functions (`openViewObjectiveModal`, `saveObjectiveChanges`, etc.)
- `deleteObjective()` + confirmation modal
- `escapeHtml()` - XSS prevention

**Functions to Modify**:
- `calculateStats()` → Update stat tile rendering
- `createObjectiveCard()` → Update card HTML structure
- `renderKeyResultsPreview()` → Update KR item styling

**CSS Impact**: Inline styles will be updated. No external CSS dependencies.

**Critical Preserved Logic**:
- Timeline-aware status calculation (lines 285-360)
- Date range formatting (lines 140-162)
- KR progress coloring (lines 450-482)
- Delete confirmation modal

---

### Planning Page Impact Analysis

**Current File**: `client/pages/planning.html` (all JS inline)

| Aspect | Current State | Sprint 13 Change | Risk Level |
|--------|---------------|------------------|------------|
| Layout | 5-col/7-col grid | Two-panel (KR left, weeks right) | MEDIUM |
| Objective Tabs | Horizontal tabs | Objective cards with progress | LOW |
| KR Cards | Click to select | Same behavior, new styling | LOW |
| Week View | List/Tree toggle | Collapsible week cards | MEDIUM |
| AI Generation | Full plan generation | Per-week generation button | NEW |
| Owner Assignment | Owner select dropdown | Clickable pill in week footer | LOW |

**API Dependencies (No Backend Changes)**:
- `GET /api/objectives` - Load objectives (via fetch)
- `GET /api/goals/quarterly/{krId}` - Load quarterly goals
- `GET /api/goals/weekly/{quarterlyGoalId}` - Load weekly goals
- `POST /api/goals/quarterly` - Create quarterly goal
- `POST /api/goals/weekly` - Create weekly goal
- `PUT /api/goals/weekly/{id}` - Update weekly goal
- AI endpoints for plan generation

**JavaScript Functions to Preserve (Critical)**:
- `loadCompanyConfiguration()` - Company config loading
- `loadObjectives()` - Objectives API call
- `selectObjective()` - Objective selection
- `selectKR()` - KR selection
- `loadExistingPlan()` - Load existing goals
- `generatePlan()` - AI plan generation
- `createGoals()` - Goal creation API calls
- `filterGoals()` - Goal filtering
- ALL tree view functions (if kept)
- ALL pagination functions

**Functions to Modify**:
- `renderObjectiveTabs()` → Objective cards with circular progress
- `renderKRList()` → KR cards with progress bars + status badges
- `renderExistingPlan()` → Collapsible week cards
- Goal card rendering functions

**New Functions to Add**:
- `generateWeekTasks(weekId)` - Per-week AI generation
- `toggleWeekExpand(weekId)` - Week card collapse/expand
- `assignOwnerToWeek(weekId)` - Clickable owner assignment

**CSS Impact**: Inline styles will be updated. Tree view styles may be removed if tree view is deprecated.

---

### Navigation Impact Analysis

**Current File**: `client/js/navigation.js` (264 lines)

| Aspect | Current State | Sprint 13 Change | Risk Level |
|--------|---------------|------------------|------------|
| Logo | Cultural Discipline PNG | Chief AI SVG | LOW |
| Nav Items | Simple list | Grouped with dividers | LOW |
| Hover Effects | Color change only | Philosophy color underlines | LOW |
| Tooltips | Browser title | Custom 500ms delay tooltips | NEW |
| Role-based Items | Maintained | Same logic | NONE |

**Functions to Preserve (Critical)**:
- `init(user)` - Initialization
- `renderNavigation()` - HTML generation (modify)
- `attachUserMenuListeners()` - Event handlers
- `logout()` - Logout logic
- `hasAccessToPage()` - Access control
- `getNavItems()` - Role-based items

**Functions to Modify**:
- `renderNavigation()` → Add dividers, philosophy groups, tooltips

**CSS Changes**: Add to navigation.js inline styles or separate CSS file.

---

### Shared Dependencies Summary

| Dependency | Used By | Impact |
|------------|---------|--------|
| `auth-check.js` | All 3 pages | NO CHANGE |
| `navigation.js` | All 3 pages | MODIFY (rebranding + philosophy) |
| `toast.js` | Dashboard, Objectives | NO CHANGE |
| `common.js` | Multiple pages | NO CHANGE |
| `objectives-api-client.js` | Objectives | NO CHANGE |
| `goals-api-client.js` | Planning (indirect) | NO CHANGE |
| `category-icons.js` | Objectives | NO CHANGE |

---

### Risk Mitigation Strategy

| Risk | Mitigation |
|------|------------|
| Breaking existing API integrations | Keep all API call logic unchanged; only modify rendering |
| XSS vulnerabilities | Preserve all `escapeHtml()` calls in new HTML templates |
| Role-based access regression | Test all 5 roles after navigation changes |
| Mobile responsiveness | Include responsive breakpoints in new CSS |
| Modal functionality loss | Keep all modal JavaScript intact |
| Progress calculation errors | Preserve `calculateKRProgress()` and `getProgressColor()` functions |

---

### Testing Strategy

**Unit Testing Focus**:
- Progress calculation functions
- Date formatting functions
- Filter logic functions

**Integration Testing Focus**:
- API data loading and rendering
- Navigation between pages
- Modal open/close/save flows

**E2E Testing Focus**:
- Full user journeys across redesigned pages
- Role-based access verification
- Task completion flow

---

### Functionality Preservation Checklist

**CRITICAL: All existing functionality MUST work after redesign. UI-only changes mean zero functional regressions.**

#### Navigation Functionality
| Function | Current Behavior | Must Preserve | Test Method |
|----------|-----------------|---------------|-------------|
| Role-based nav items | Different nav for each role | ✅ CRITICAL | Login as all 5 roles |
| Active page highlight | Current page highlighted | ✅ | Navigate between pages |
| User dropdown | Shows profile, settings, logout | ✅ | Click user avatar |
| Logout | Clears tokens, redirects | ✅ | Click logout |
| Page access control | `hasAccessToPage()` enforced | ✅ CRITICAL | Attempt unauthorized access |

#### Dashboard Functionality
| Function | Current Behavior | Must Preserve | Test Method |
|----------|-----------------|---------------|-------------|
| `loadDashboard()` | Fetches `/api/dashboard/today` | ✅ CRITICAL | Page load |
| `completeTask(taskId)` | Marks task complete via API | ✅ CRITICAL | Click task checkbox |
| Task status colors | Overdue=red, Today=blue, Done=green | ✅ | Visual inspection |
| Weekly goal display | Shows goals with progress | ✅ | Visual inspection |
| Navigate to Planning | Click goal → Planning page | ✅ | Click weekly goal |
| Error handling | Shows toast on API error | ✅ | Disconnect network |

#### Objectives Functionality
| Function | Current Behavior | Must Preserve | Test Method |
|----------|-----------------|---------------|-------------|
| `loadObjectives()` | Fetches all objectives via API | ✅ CRITICAL | Page load |
| `createObjectiveCard()` | Renders card with KRs | ✅ | Visual inspection |
| `calculateKRProgress()` | Calculates % from current/target | ✅ CRITICAL | Check math accuracy |
| `filterObjectives()` | Filters by all/at-risk/on-track/ai | ✅ | Click filter buttons |
| `getFilteredObjectives()` | Returns filtered array | ✅ | Check filter results |
| `viewObjectiveDetails()` | Opens view/edit modal | ✅ CRITICAL | Click "View Details" |
| `toggleEditMode()` | Switches modal to edit mode | ✅ | Click "Edit" button |
| `saveObjectiveChanges()` | PUTs updated data to API | ✅ CRITICAL | Edit and save |
| `deleteObjective()` | Shows confirmation modal | ✅ | Click "Delete" |
| `confirmDeleteObjective()` | DELETEs via API | ✅ CRITICAL | Confirm delete |
| `toggleKeyResults()` | Expands/collapses KR list | ✅ | Click "Show more" |
| `calculateStats()` | Updates header stats | ✅ | Check stats after changes |
| `getTimelineContext()` | Shows "X days remaining" | ✅ | Check date labels |
| `formatDateRange()` | Shows "Jan 1 - Dec 31, 2026" | ✅ | Check date formatting |
| `escapeHtml()` | Prevents XSS | ✅ CRITICAL | Check rendered HTML |
| Category icons | Shows 📈 💰 ⚙️ etc. | ✅ | Visual inspection |
| Priority borders | Colors by priority | ✅ | Visual inspection |
| Status colors | Gray/Blue/Green/Red/Amber | ✅ | Check all statuses |

#### Planning Functionality
| Function | Current Behavior | Must Preserve | Test Method |
|----------|-----------------|---------------|-------------|
| `loadCompanyConfiguration()` | Fetches company OKR config | ✅ CRITICAL | Page load |
| `loadObjectives()` | Fetches objectives | ✅ CRITICAL | Page load |
| `selectObjective()` | Highlights selected, loads KRs | ✅ | Click objective tab |
| `selectKR()` | Highlights KR, loads plan | ✅ | Click KR card |
| `renderKRList()` | Shows KR cards with progress | ✅ | Visual inspection |
| `loadExistingPlan()` | Loads weekly goals for KR | ✅ | Select KR with plan |
| `generatePlan()` | Calls AI endpoint | ✅ CRITICAL | Click "Generate AI Plan" |
| `createGoals()` | POSTs weekly goals to API | ✅ CRITICAL | Click "Create Goals" |
| `filterGoals()` | Filters by all/in_progress/completed | ✅ | Click filter buttons |
| `setViewMode()` | Toggles list/tree view | ✅ | Click view buttons |
| `renderExistingPlan()` | Shows week cards | ✅ | Visual inspection |
| Pagination | Shows 5 per page | ✅ | Check pagination |
| `editExistingPlan()` | Enables editing mode | ✅ | Click "Edit Plan" |
| `addMoreWeeks()` | Continues planning | ✅ | Click "Continue Planning" |
| `deletePlan()` | DELETEs plan | ✅ CRITICAL | Click "Delete Plan" |
| Quarter selector | Changes displayed quarter | ✅ | Change quarter |
| Owner assignment | Shows owner dropdown | ✅ | Click owner field |

#### API Endpoints (No Changes Required)
| Endpoint | Method | Used By | Verify |
|----------|--------|---------|--------|
| `/api/dashboard/today` | GET | Dashboard | ✅ |
| `/api/objectives` | GET | Objectives, Planning | ✅ |
| `/api/objectives/:id` | PUT | Objectives modal | ✅ |
| `/api/objectives/:id` | DELETE | Objectives delete | ✅ |
| `/api/goals/quarterly/:krId` | GET | Planning | ✅ |
| `/api/goals/weekly/:goalId` | GET | Planning | ✅ |
| `/api/goals/quarterly` | POST | Planning | ✅ |
| `/api/goals/weekly` | POST | Planning | ✅ |
| `/api/goals/weekly/:id` | PUT | Planning | ✅ |
| `/api/ai/generate-plan` | POST | Planning AI | ✅ |

#### Security Functions (Must Never Break)
| Function | Location | Purpose |
|----------|----------|---------|
| `escapeHtml()` | All pages | XSS prevention |
| `requireRole()` | Backend | RBAC enforcement |
| Token validation | `auth-check.js` | JWT verification |
| Company isolation | API layer | Multi-tenant security |

---

### Implementation Rules

**DO NOT:**
- ❌ Change any API endpoint URLs
- ❌ Modify request/response formats
- ❌ Remove or rename any existing JavaScript functions
- ❌ Change function signatures (parameters/return values)
- ❌ Remove `escapeHtml()` calls from any template
- ❌ Modify authentication/authorization logic
- ❌ Change localStorage key names (`karvia_auth_token`, `karvia_user`)

**DO:**
- ✅ Only modify HTML structure within render functions
- ✅ Only change CSS/styling
- ✅ Keep all event handlers intact
- ✅ Keep all API call logic unchanged
- ✅ Add new UI elements alongside existing ones
- ✅ Use existing class names or add new ones (don't rename)

---

### Pre-Implementation Checklist

Before starting any Epic:
- [ ] Read current implementation file completely
- [ ] Document all functions and their purposes
- [ ] Identify API calls and their exact formats
- [ ] Note all event handlers and their targets
- [ ] List all DOM element IDs used in JavaScript

### Post-Implementation Checklist

After completing any Epic:
- [ ] All API calls return same data
- [ ] All buttons/links work as before
- [ ] All modals open/close/save correctly
- [ ] All filters produce correct results
- [ ] All progress calculations are accurate
- [ ] All 5 user roles see correct content
- [ ] No console errors
- [ ] XSS prevention still works (test with `<script>alert(1)</script>`)

---

## Epic Overview

| Epic | Points | Description | Status |
|------|--------|-------------|--------|
| Epic R | 3 | Chief AI Rebranding | ACTIVE |
| Epic T | 5 | Navigation Philosophy Colors | ACTIVE |
| ~~Epic D~~ | ~~5~~ | ~~Dashboard Redesign~~ | MOVED → Sprint 11 Epic U |
| ~~Epic O~~ | ~~3~~ | ~~Objectives Page Redesign~~ | MOVED → Sprint 11 Epic U |
| ~~Epic P~~ | ~~5~~ | ~~Planning Page Redesign~~ | MOVED → Sprint 11 Epic L |
| **Total** | **8** | | |

---

## Epic R: Chief AI Rebranding (3 pts)

### Vision

Rebrand the application from "Cultural Discipline" to "Chief AI - Your AI Chief of Staff"

### Brand Assets

- **Logo**: `/KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/3-BRANDING/chief-ai/ChiefAI_Logo.svg`
- **Primary Color**: Navy Blue #1E3A5F
- **Accent Color**: Gold #D4A853
- **Tagline**: "Your AI Chief of Staff"

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| R1 | 1 | Update navigation logo to Chief AI |
| R2 | 1 | Update page titles and meta tags |
| R3 | 1 | Update user avatar styling with brand gradient |
| **Total** | **3** | |

---

## Epic T: Navigation Visual Enhancement (5 pts)

### Vision

Transform navigation to reflect PLAY → ASSESS → ALIGN → PLAN philosophy:

```
Dashboard  │  Assessments  │  Teams  │  Objectives   Planning
   ▔▔▔▔         ▔▔▔▔▔         ▔▔▔▔       ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  PLAY         ASSESS        ALIGN           PLAN
 (purple)      (blue)       (green)        (orange)
```

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| T1 | 1 | Reorder navigation items |
| T2 | 1 | Add visual dividers between philosophy groups |
| T3 | 1 | Add philosophy color accents on hover/active |
| T4 | 2 | Add custom tooltips with 500ms delay |
| **Total** | **5** | |

### Philosophy Mapping

| Nav Item | Philosophy | Color | Tooltip |
|----------|------------|-------|---------|
| Dashboard | PLAY | Purple #8B5CF6 | "Play - Your daily focus" |
| Assessments | ASSESS | Blue #3B82F6 | "Assess - Understand your org" |
| Teams | ALIGN | Green #10B981 | "Align - Get everyone aligned" |
| Objectives | PLAN | Orange #F59E0B | "Plan - Strategic direction" |
| Planning | PLAN | Orange #F59E0B | "Plan - Weekly execution" |

---

## ~~Epic D: Dashboard Redesign~~ - MOVED TO SPRINT 11 Epic U

**Status**: MOVED to Sprint 11 Epic U1 (6 pts)

All dashboard UI changes (3-column layout, objective pills, progress bars) now implemented as part of Epic U in Sprint 11.

---

## ARCHIVED: Original Epic D Vision (For Reference Only)

~~### Vision

Create a minimalist, low-cognitive-load dashboard with three sections:~~

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Dashboard                                                     Wed, Jan 14  │
├─────────────────────────────────────────────────────────────────────────────┤
│  [35% Obj1] [60% Obj2] [45% Obj3]              ● 2 ovr  ● 4 tdy  ● 2 tmrw  │
├─────────────────────────────────────────────────────────────────────────────┤
│  TASKS  ━━━░░░░░░░░░ 17%                                           8 total │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │   Overdue   │  │    Today    │  │  Tomorrow   │                         │
│  │   2 tasks   │  │ 4 tasks     │  │   2 tasks   │                         │
│  │             │  │ (1 done)    │  │             │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  WEEKLY GOALS  ━━━━━━━░░░░░ 40%                                   2 active │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │  Last Week  │  │  This Week  │  │  Next Week  │                         │
│  │    Done     │  │   Active    │  │  Upcoming   │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Features

1. **Header with Objective Context**
   - Title + date on top row
   - Objective cards with circular progress (clickable to filter)
   - Task stats on right (overdue, today, tomorrow)

2. **Tasks Section (3 columns)**
   - Overdue | Today | Tomorrow
   - Completed tasks shown within Today section
   - Task actions on hover: Postpone, Assign, Chat
   - Progress bar in section header

3. **Weekly Goals Section (3 columns)**
   - Last Week | This Week | Next Week
   - Circular progress with percentage
   - Goal title and KR association
   - Click navigates to Planning page

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| D1 | 1 | Implement header with objective context dropdown |
| D2 | 2 | Implement 3-column task layout with actions |
| D3 | 1 | Implement 3-column weekly goals with progress |
| D4 | 1 | Add section progress bars |
| **Total** | **5** | |

### Task Actions

| Action | Icon | Hover Color | Description |
|--------|------|-------------|-------------|
| Postpone | Clock | Amber #FEF3C7 | Reschedule task to later |
| Assign | User+ | Blue #DBEAFE | Delegate to another person |
| Chat | Message | Indigo #E0E7FF | Open discussion thread |

---

## ~~Epic O: Objectives Page Redesign~~ - MOVED TO SPRINT 11 Epic U

**Status**: MOVED to Sprint 11 Epic U2 (5 pts)

All objectives page UI changes (header KPIs, quarter selector, category tabs, card grid) now implemented as part of Epic U in Sprint 11.

---

## ARCHIVED: Original Epic O Vision (For Reference Only)

~~### Vision

Modernize the Objectives page with consistent styling while preserving ALL existing functionality including filters, modals, KR progress, and CRUD operations.~~

### Design Updates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Objectives                                              FY 2026  Q1  Q2 ▾  │
├─────────────────────────────────────────────────────────────────────────────┤
│  [All] [Growth] [Revenue] [Operations] [People]         4 Active Objectives │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┐  ┌──────────────────────────┐                 │
│  │ 📈 Increase Revenue      │  │ 👥 Build Team Culture    │                 │
│  │    35% ━━━━░░░░          │  │    60% ━━━━━━░░░         │                 │
│  │    3 KRs · In Progress   │  │    4 KRs · On Track      │                 │
│  │    [View] [Plan] [Edit]  │  │    [View] [Plan] [Edit]  │                 │
│  └──────────────────────────┘  └──────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Styling Changes (No Functionality Changes)

1. **Header Row** - Consistent with Dashboard header styling
2. **Category Filters** - Pill-style category buttons
3. **Objective Cards** - 12px border-radius, unified padding
4. **Progress Bars** - Same height as Dashboard progress bars
5. **KR Previews** - Consistent with Planning KR cards

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| O1 | 1 | Update header and filter pill styling |
| O2 | 1 | Update objective card visual design |
| O3 | 1 | Ensure modal styling matches new design |
| **Total** | **3** | |

### Preserved Functionality (No Changes)

- `loadObjectives()` - Unchanged
- `createObjectiveCard()` - Only HTML/CSS changes
- `calculateKRProgress()` - Unchanged
- `filterObjectives()` / `getFilteredObjectives()` - Unchanged
- ALL modal functions - Unchanged
- `deleteObjective()` / `confirmDeleteObjective()` - Unchanged
- `toggleKeyResults()` - Unchanged
- `escapeHtml()` - Unchanged

**Mockup**: [sprint13-objectives-redesign.html](../../1-PRODUCT/mockups/sprint13-objectives-redesign.html)

---

## ~~Epic P: Planning Page Redesign~~ - MOVED TO SPRINT 11 Epic L

**Status**: MOVED to Sprint 11 Epic L (25 pts)

All planning page UI changes (two-panel layout, week tiles, KR sidebar) now implemented as part of Epic L in Sprint 11. Epic L provides comprehensive planning redesign with AI context assembly.

---

## ARCHIVED: Original Epic P Vision (For Reference Only)

~~### Vision

Transform the Planning page into a two-panel layout with KR selection on the left and collapsible weekly goals on the right, enabling intuitive quarter planning with clear hierarchy.~~

### Two-Panel Layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Obj 1 35%] [Obj 2 60%] [Obj 3 45%]                              Q1 2026   │
├────────────────────┬─────────────────────────────────────────────────────────┤
│  KEY RESULTS       │  WEEKLY GOALS: Close $500K in new deals                │
│                    │  12 weeks · 45% complete                               │
│  ┌──────────────┐  │  ┌─────────────────────────────────────────────────┐   │
│  │ ● Close $500K│  │  │ ▼ Week 1 - Foundation          ○○○○● [Generate]│   │
│  │   45% ━━━░░░ │  │  │   ✓ Task 1: Research competitors                │   │
│  │   PLANNED    │  │  │   ✓ Task 2: Build prospect list                 │   │
│  └──────────────┘  │  │   Owner: JD                                     │   │
│                    │  └─────────────────────────────────────────────────┘   │
│  ┌──────────────┐  │  ┌─────────────────────────────────────────────────┐   │
│  │ ○ Launch 3   │  │  │ ▶ Week 2 - Outreach (collapsed)    [Generate]  │   │
│  │   Products   │  │  └─────────────────────────────────────────────────┘   │
│  │   0% ░░░░░░░ │  │  ┌─────────────────────────────────────────────────┐   │
│  │   NO PLAN    │  │  │ ▶ Week 3 - Follow-ups (collapsed)  [Generate]  │   │
│  └──────────────┘  │  └─────────────────────────────────────────────────┘   │
└────────────────────┴─────────────────────────────────────────────────────────┘
```

### Key Features

1. **Left Panel - KR Selection**
   - Objective tabs at top with circular progress
   - KR cards with inline progress bars
   - Plan status badges (PLANNED, NO PLAN, IN PROGRESS)
   - Click KR to load weekly goals on right

2. **Right Panel - Weekly Goals Stack**
   - Week cards stacked vertically (not columns)
   - Collapsible cards (chevron toggle)
   - Tasks visible inline when expanded
   - "Generate" button on right corner of each week header

3. **Collapsible Week Cards**
   - Header shows: week number, title, progress dots, generate button
   - Body shows: task list with checkboxes, add task option
   - Footer shows: clickable owner assignment pill

4. **Clickable Owner Assignment**
   - Owner pill with avatar + name in week footer
   - Click to open assignment dropdown
   - Shows "Assign" tooltip on hover

5. **AI Generation Options**
   - Per-week "Generate" button for individual week tasks
   - Generates tasks based on KR context

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| P1 | 1 | Implement two-panel layout with KR sidebar |
| P2 | 2 | Implement collapsible week cards with inline tasks |
| P3 | 2 | Implement clickable owner assignment |
| **Total** | **5** | |

**Mockup**: [sprint13-planning-redesign.html](../../1-PRODUCT/mockups/sprint13-planning-redesign.html) (v4)

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `client/js/navigation.js` | Chief AI branding, reorder items, dividers, tooltips |
| `client/pages/dashboard.html` | Complete redesign with new layout |
| `client/pages/scripts/dashboard.js` | New dashboard logic (objective context, task actions) |
| `client/pages/planning.html` | Two-panel redesign with KR sidebar |
| `client/pages/scripts/planning.js` | Objective tabs, KR selection, week layout |

### New Features

- Objective context dropdown in header
- Section progress bars
- Task hover actions (Postpone, Assign, Chat)
- Unified 3-column grid layout

### No Backend Changes

All changes are frontend CSS/JS only.

---

## Success Criteria

### Epic R Success Criteria (Chief AI Rebranding)
- [ ] Chief AI logo appears in navigation
- [ ] Navy gradient (`#1e3a5f`, `#2d5a87`) replaces purple gradient
- [ ] Page titles updated to "Chief AI" branding
- [ ] User avatar uses brand gradient

### Epic T Success Criteria (Navigation Philosophy Colors)
- [ ] Navigation items in PLAY → ASSESS → ALIGN → PLAN order
- [ ] Visual dividers between philosophy groups
- [ ] Philosophy color accents on hover (purple, blue, green, orange)
- [ ] Tooltips appear after 500ms delay with philosophy descriptions
- [ ] All 5 roles see correct navigation items

### What's NOT in Sprint 13 (Already Done in Sprint 11-12)
The following were moved to Sprint 11-12 and should already be working:
- ~~Dashboard 3-column layout~~ (Sprint 11 Epic U)
- ~~Dashboard objective pills and progress bars~~ (Sprint 11 Epic U)
- ~~Objectives page card grid~~ (Sprint 11 Epic U)
- ~~Planning page two-panel layout~~ (Sprint 11 Epic L)
- ~~Planning page week tiles~~ (Sprint 11 Epic L)

---

## Testing Checklist

### Rebranding (Epic R)
- [ ] Chief AI logo displays correctly in navigation
- [ ] User avatar uses brand gradient
- [ ] Page titles show "Chief AI" branding
- [ ] Navy gradient visible on primary buttons (replacing purple)

### Navigation Philosophy (Epic T)
- [ ] Items in PLAY → ASSESS → ALIGN → PLAN order
- [ ] Dividers in correct positions between groups
- [ ] Color accents work on hover:
  - [ ] Dashboard (purple)
  - [ ] Assessments (blue)
  - [ ] Teams (green)
  - [ ] Objectives (orange)
  - [ ] Planning (orange)
- [ ] Tooltips have 500ms delay
- [ ] Tooltip text shows philosophy description

### Role Testing
- [ ] CONSULTANT sees all nav items
- [ ] BUSINESS_OWNER sees all nav items
- [ ] EXECUTIVE sees correct nav items
- [ ] MANAGER sees correct nav items
- [ ] EMPLOYEE sees correct nav items

### Visual Regression (No Changes Expected)
The following should work exactly as in Sprint 11-12:
- [ ] Dashboard layout unchanged
- [ ] Objectives page layout unchanged
- [ ] Planning page layout unchanged
- [ ] Assessment pages layout unchanged

### Responsive
- [ ] Desktop (> 1024px) - Full layout
- [ ] Tablet (768px - 1024px) - Adjusted spacing
- [ ] Mobile (< 768px) - Stacked, no tooltips

---

## Sprint Completion Checklist

- [ ] R1-R3: Chief AI rebranding complete (logo, gradient, titles)
- [ ] T1-T4: Navigation philosophy colors complete
- [ ] All 5 roles tested
- [ ] Responsive design verified
- [ ] Branding consistent across all pages
- [ ] Committed and deployed

### Moved to Sprint 11-12 (Verify Already Done)
- [x] Dashboard redesign (Sprint 11 Epic U)
- [x] Objectives page redesign (Sprint 11 Epic U)
- [x] Planning page redesign (Sprint 11 Epic L)
- [x] SSI Report UI (Sprint 12 Epic V)

---

## Related Documents

### Sprint 13 (Branding Only)
- [EPIC-T-NAVIGATION-REDESIGN.md](./EPIC-T-NAVIGATION-REDESIGN.md) - Navigation epic specification
- [ChiefAI_Logo.svg](../../3-RELEASE-ENGINEERING/3-BRANDING/chief-ai/ChiefAI_Logo.svg) - Brand logo
- [navigation.js](../../../client/js/navigation.js) - Current navigation implementation

### Mockups (Structure in Sprint 11, Branding Reference Only)
- [sprint_mockups/sprint13-dashboard-redesign.html](../sprint_mockups/sprint13-dashboard-redesign.html) - Dashboard mockup (v16)
- [sprint_mockups/sprint13-objectives-redesign.html](../sprint_mockups/sprint13-objectives-redesign.html) - Objectives mockup
- [sprint_mockups/sprint13-planning-redesign.html](../sprint_mockups/sprint13-planning-redesign.html) - Planning mockup (v4)

### Related Sprint Plans
- [Sprint 11 Master Plan](../SPRINT-11%20(Planned)/SPRINT-11-MASTER-PLAN.md) - Epic U (UI) + Epic L (Planning)
- [Sprint 12 Master Plan](../SPRINT-12%20(Planned)/SPRINT-12-MASTER-PLAN.md) - Epic V (SSI Report UI)
- [SPRINT-REORGANIZATION-PLAN-V2.md](../SPRINT-REORGANIZATION-PLAN-V2.md) - Structure-first strategy

---

**Plan Owner**: Product Team
**Sprint Target**: Sprint 13

---

## Appendix A: Complete Functionality Preservation Audit

This appendix documents ALL functionality from existing pages that MUST be preserved during Sprint 13 redesign. This is the authoritative reference for implementation.

---

### A.1 Dashboard.html Complete Audit

**File**: `client/pages/dashboard.html` (716 lines)
**Last Audited**: January 14, 2026

#### A.1.1 JavaScript Functions (Complete List)

| Function | Lines | Purpose | Preserve |
|----------|-------|---------|----------|
| `initDashboard()` | 140-149 | Entry point - checks auth, loads data | ✅ CRITICAL |
| `loadDashboard()` | 151-168 | Fetches `/api/dashboard/today`, stores in `dashboardData` | ✅ CRITICAL |
| `renderQuickStats(data)` | 170-212 | Renders 4 stat cards (tasks today, goals active, overdue, completed) | MODIFY - Replace with objective context |
| `renderMyTasks(tasks)` | 214-268 | Renders task cards grouped by status | MODIFY - Split into 3 columns |
| `renderTaskCard(task)` | 270-315 | Individual task card with checkbox, priority badge, due time | MODIFY - Add hover actions |
| `renderOverdueTaskCard(task)` | 317-352 | Red-styled overdue task with "X days overdue" | ✅ KEEP |
| `renderBlockedTaskCard(task)` | 354-390 | Purple-styled blocked task with blocker info | ✅ KEEP |
| `renderWeeklyGoals(goals)` | 392-438 | Renders goal cards with progress | MODIFY - Split into 3 columns |
| `renderGoalCard(goal)` | 440-495 | Goal card with circular progress, KR link | MODIFY - Update styling |
| `renderRoleSpecific(data)` | 497-520 | Renders role-based sections (manager/executive views) | ✅ KEEP |
| `renderManagerView(data)` | 522-578 | Manager-specific dashboard section | ✅ KEEP |
| `renderExecutiveView(data)` | 580-625 | Executive-specific dashboard section | ✅ KEEP |
| `completeTask(taskId)` | 627-658 | POST `/api/tasks/{id}/complete` - marks task done | ✅ CRITICAL |
| `celebrateTask(taskId)` | 660-685 | Manager celebration feature | ✅ KEEP |
| `escapeHtml(text)` | 687-695 | XSS prevention - maps &<>"' to entities | ✅ CRITICAL - NEVER REMOVE |
| `getPriorityBadgeClass(priority)` | 697-706 | Returns Tailwind classes for priority | ✅ KEEP |
| `getProgressColor(progress)` | 708-716 | Returns color based on progress % | ✅ KEEP |

#### A.1.2 Global Variables

| Variable | Line | Purpose | Preserve |
|----------|------|---------|----------|
| `dashboardData` | 138 | Stores API response for re-renders | ✅ KEEP |

#### A.1.3 API Endpoints Used

| Endpoint | Method | Request Body | Response Structure | Used In |
|----------|--------|--------------|-------------------|---------|
| `/api/dashboard/today` | GET | None | `{ my_focus: { tasks_today: [], overdue_tasks: [] }, this_week: { my_weekly_goals: [] }, quick_stats: {...}, role_specific: {...} }` | `loadDashboard()` |
| `/api/tasks/{id}/complete` | POST | None | `{ success: true, task: {...} }` | `completeTask()` |
| `/api/tasks/{id}/celebrate` | POST | None | `{ success: true }` | `celebrateTask()` |

#### A.1.4 DOM Element IDs

| Element ID | Purpose | Used By Function |
|------------|---------|------------------|
| `quick-stats` | Stats cards container | `renderQuickStats()` |
| `my-tasks` | Task cards container | `renderMyTasks()` |
| `weekly-goals` | Goals container | `renderWeeklyGoals()` |
| `role-specific` | Role-based section container | `renderRoleSpecific()` |
| `loading-spinner` | Loading indicator | `loadDashboard()` |
| `error-message` | Error display | `loadDashboard()` |
| `task-{id}` | Individual task card | `renderTaskCard()` |
| `goal-{id}` | Individual goal card | `renderGoalCard()` |

#### A.1.5 Event Handlers

| Event | Target | Handler | Action |
|-------|--------|---------|--------|
| `click` | `.task-checkbox` | inline onclick | Calls `completeTask(taskId)` |
| `click` | `.goal-card` | inline onclick | Navigates to Planning page |
| `click` | `.celebrate-btn` | inline onclick | Calls `celebrateTask(taskId)` |
| `DOMContentLoaded` | document | anonymous | Calls `initDashboard()` |

#### A.1.6 Critical Logic to Preserve

**Task Status Calculation** (lines 270-315):
```javascript
// Priority badge classes
HIGH: 'bg-red-100 text-red-800'
MEDIUM: 'bg-amber-100 text-amber-800'
LOW: 'bg-green-100 text-green-800'

// Due time formatting
if (task.due_date) {
  const dueDate = new Date(task.due_date);
  // Format: "2:30 PM" or "Tomorrow"
}
```

**Progress Color Calculation** (lines 708-716):
```javascript
function getProgressColor(progress) {
  if (progress >= 100) return '#10B981'; // Green - complete
  if (progress >= 70) return '#3B82F6';  // Blue - on track
  if (progress >= 40) return '#F59E0B';  // Amber - needs attention
  return '#EF4444';                       // Red - at risk
}
```

**XSS Prevention** (lines 687-695):
```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
```

---

### A.2 Planning.html Complete Audit

**File**: `client/pages/planning.html` (1958 lines)
**Last Audited**: January 14, 2026

#### A.2.1 JavaScript Functions (Complete List)

| Function | Lines | Purpose | Preserve |
|----------|-------|---------|----------|
| `initPlanning()` | 185-210 | Entry point - loads config, objectives | ✅ CRITICAL |
| `loadCompanyConfiguration()` | 212-245 | Fetches company OKR config (quarters, fiscal year) | ✅ CRITICAL |
| `populateQuarterSelector()` | 247-295 | Populates quarter/year dropdowns based on config | ✅ CRITICAL |
| `loadObjectives()` | 297-350 | Fetches objectives with hierarchy | ✅ CRITICAL |
| `renderObjectiveTabs()` | 352-420 | Renders objective selection tabs | MODIFY - Update to cards with progress |
| `selectObjective(objectiveId)` | 422-465 | Handles objective selection, loads KRs | ✅ CRITICAL |
| `renderKRCards(keyResults)` | 467-545 | Renders KR cards with progress and plan status | MODIFY - Update styling |
| `checkKRPlanStatus(krId)` | 547-580 | Checks if KR has existing quarterly/weekly goals | ✅ CRITICAL |
| `selectKR(krId)` | 582-625 | Handles KR selection, loads plan | ✅ CRITICAL |
| `planKR(krId)` | 627-680 | Opens planning form for unplanned KR | ✅ KEEP |
| `populateWeeksFromObjective(objective)` | 682-735 | Generates weeks array from objective dates | ✅ CRITICAL |
| `generatePlan()` | 737-815 | Calls AI endpoint to generate plan | ✅ CRITICAL |
| `createGoals(planData)` | 817-895 | POSTs quarterly + weekly goals to API | ✅ CRITICAL |
| `viewExistingPlan(krId)` | 897-945 | Loads and displays existing weekly goals | ✅ CRITICAL |
| `renderExistingGoals(goals)` | 947-1025 | Renders paginated goal list | MODIFY - Update to collapsible cards |
| `renderWeekCard(goal)` | 1027-1095 | Individual week card with tasks | MODIFY - Add collapse/expand |
| `renderTaskItem(task)` | 1097-1145 | Task checkbox with status | ✅ KEEP logic, update styling |
| `toggleTaskStatus(taskId, newStatus)` | 1147-1195 | PUT `/api/tasks/{id}` - updates task status | ✅ CRITICAL |
| `filterGoals(filter)` | 1197-1245 | Filters goals by status | ✅ CRITICAL |
| `setViewMode(mode)` | 1247-1285 | Toggles between list and tree view | ✅ KEEP if tree view retained |
| `renderTreeView(goals)` | 1287-1365 | Renders tree hierarchy: Quarter → Week → Task | ✅ KEEP if tree view retained |
| `renderTreeWeekNode(goal)` | 1367-1420 | Week node in tree view | ✅ KEEP if tree view retained |
| `renderTreeTaskNode(task)` | 1422-1465 | Task node in tree view | ✅ KEEP if tree view retained |
| `editExistingPlan(krId)` | 1467-1515 | Enables editing mode for plan | ✅ CRITICAL |
| `addMoreWeeks(krId)` | 1517-1575 | Extends plan with more weeks | ✅ CRITICAL |
| `deletePlan(krId)` | 1577-1635 | Deletes quarterly + weekly goals | ✅ CRITICAL |
| `confirmDeletePlan()` | 1637-1680 | Confirmation modal for delete | ✅ CRITICAL |
| `getQuarterBoundaries(year, quarter)` | 1682-1720 | Returns start/end dates for quarter | ✅ CRITICAL |
| `generateAllWeeks(startDate, endDate)` | 1722-1770 | Generates array of week objects | ✅ CRITICAL |
| `formatWeekRange(weekStart)` | 1772-1795 | Formats "Jan 6 - Jan 12" string | ✅ KEEP |
| `calculateWeekProgress(tasks)` | 1797-1820 | Calculates % complete from tasks | ✅ CRITICAL |
| `getProgressDots(progress)` | 1822-1855 | Returns 5 dots colored by progress | MODIFY - Update styling |
| `escapeHtml(text)` | 1857-1865 | XSS prevention (duplicate of dashboard) | ✅ CRITICAL |
| `showToast(message, type)` | 1867-1895 | Shows toast notification | ✅ KEEP |
| `closeModal()` | 1897-1910 | Closes active modal | ✅ KEEP |
| `changePage(direction)` | 1912-1945 | Pagination handler | ✅ KEEP |
| `updatePagination()` | 1947-1958 | Updates pagination UI | ✅ KEEP |

#### A.2.2 Global Variables

| Variable | Line | Purpose | Preserve |
|----------|------|---------|----------|
| `companyConfig` | 180 | Stores company OKR configuration | ✅ KEEP |
| `objectives` | 181 | Stores loaded objectives | ✅ KEEP |
| `selectedObjective` | 182 | Currently selected objective | ✅ KEEP |
| `selectedKR` | 183 | Currently selected key result | ✅ KEEP |
| `currentPlan` | 184 | Currently displayed plan | ✅ KEEP |
| `currentPage` | 185 | Pagination current page | ✅ KEEP |
| `itemsPerPage` | 186 | Items per page (default: 5) | ✅ KEEP |
| `currentFilter` | 187 | Current filter state | ✅ KEEP |
| `viewMode` | 188 | 'list' or 'tree' | ✅ KEEP |

#### A.2.3 API Endpoints Used

| Endpoint | Method | Request Body | Response Structure | Used In |
|----------|--------|--------------|-------------------|---------|
| `/api/companies/{id}` | GET | None | `{ company: { okr_config: {...} } }` | `loadCompanyConfiguration()` |
| `/api/objectives` | GET | None | `{ objectives: [...] }` | `loadObjectives()` |
| `/api/objectives/{id}` | GET | None | `{ objective: {..., key_results: [...] } }` | `selectObjective()` |
| `/api/goals/quarterly?key_result_id={id}` | GET | None | `{ goals: [...] }` | `checkKRPlanStatus()` |
| `/api/goals/weekly?quarterly_goal_id={id}` | GET | None | `{ goals: [...] }` | `viewExistingPlan()` |
| `/api/goals/quarterly` | POST | `{ key_result_id, title, target_value, ... }` | `{ goal: {...} }` | `createGoals()` |
| `/api/goals/weekly` | POST | `{ quarterly_goal_id, title, week_number, ... }` | `{ goal: {...} }` | `createGoals()` |
| `/api/goals/weekly/{id}` | PUT | `{ title, status, owner_id, ... }` | `{ goal: {...} }` | `editExistingPlan()` |
| `/api/goals/weekly/{id}` | DELETE | None | `{ success: true }` | `deletePlan()` |
| `/api/tasks/{id}` | PUT | `{ status }` | `{ task: {...} }` | `toggleTaskStatus()` |
| `/api/ai/generate-plan` | POST | `{ key_result_id, weeks, context }` | `{ plan: { weeks: [...] } }` | `generatePlan()` |

#### A.2.4 DOM Element IDs

| Element ID | Purpose | Used By Function |
|------------|---------|------------------|
| `quarter-selector` | Quarter dropdown | `populateQuarterSelector()` |
| `year-selector` | Year dropdown | `populateQuarterSelector()` |
| `objective-tabs` | Objective tabs container | `renderObjectiveTabs()` |
| `kr-cards` | KR cards container | `renderKRCards()` |
| `plan-container` | Main plan display area | `viewExistingPlan()` |
| `plan-header` | Plan header with title/actions | `renderExistingGoals()` |
| `goals-list` | Goals list container | `renderExistingGoals()` |
| `tree-view` | Tree view container | `renderTreeView()` |
| `filter-buttons` | Filter button group | `filterGoals()` |
| `view-mode-buttons` | List/Tree toggle buttons | `setViewMode()` |
| `pagination` | Pagination controls | `updatePagination()` |
| `delete-modal` | Delete confirmation modal | `confirmDeletePlan()` |
| `loading-overlay` | Loading spinner overlay | Multiple |
| `toast-container` | Toast notifications | `showToast()` |
| `obj-{id}` | Individual objective tab | `renderObjectiveTabs()` |
| `kr-{id}` | Individual KR card | `renderKRCards()` |
| `goal-{id}` | Individual goal/week card | `renderWeekCard()` |
| `task-{id}` | Individual task item | `renderTaskItem()` |

#### A.2.5 Event Handlers

| Event | Target | Handler | Action |
|-------|--------|---------|--------|
| `click` | `.objective-tab` | inline onclick | Calls `selectObjective(id)` |
| `click` | `.kr-card` | inline onclick | Calls `selectKR(id)` |
| `click` | `.plan-kr-btn` | inline onclick | Calls `planKR(id)` |
| `click` | `.view-plan-btn` | inline onclick | Calls `viewExistingPlan(id)` |
| `click` | `#generate-btn` | inline onclick | Calls `generatePlan()` |
| `click` | `#create-goals-btn` | inline onclick | Calls `createGoals()` |
| `click` | `.filter-btn` | inline onclick | Calls `filterGoals(filter)` |
| `click` | `.view-mode-btn` | inline onclick | Calls `setViewMode(mode)` |
| `click` | `.edit-plan-btn` | inline onclick | Calls `editExistingPlan(id)` |
| `click` | `.add-weeks-btn` | inline onclick | Calls `addMoreWeeks(id)` |
| `click` | `.delete-plan-btn` | inline onclick | Calls `deletePlan(id)` |
| `click` | `#confirm-delete-btn` | inline onclick | Calls `confirmDeletePlan()` |
| `click` | `.task-checkbox` | inline onclick | Calls `toggleTaskStatus(id, status)` |
| `click` | `.page-btn` | inline onclick | Calls `changePage(direction)` |
| `change` | `#quarter-selector` | onchange | Reloads objectives for quarter |
| `change` | `#year-selector` | onchange | Reloads objectives for year |
| `change` | `.owner-select` | onchange | Updates goal owner |
| `DOMContentLoaded` | document | anonymous | Calls `initPlanning()` |

#### A.2.6 Critical Logic to Preserve

**Quarter Boundaries Calculation** (lines 1682-1720):
```javascript
function getQuarterBoundaries(year, quarter) {
  const quarters = {
    Q1: { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
    Q2: { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
    Q3: { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
    Q4: { start: new Date(year, 9, 1), end: new Date(year, 11, 31) }
  };
  return quarters[quarter];
}
```

**Week Generation** (lines 1722-1770):
```javascript
function generateAllWeeks(startDate, endDate) {
  const weeks = [];
  let currentWeekStart = new Date(startDate);
  // Align to Monday
  const day = currentWeekStart.getDay();
  if (day !== 1) {
    currentWeekStart.setDate(currentWeekStart.getDate() - (day === 0 ? 6 : day - 1));
  }
  let weekNumber = 1;
  while (currentWeekStart < endDate) {
    weeks.push({
      number: weekNumber,
      startDate: new Date(currentWeekStart),
      endDate: new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
    });
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekNumber++;
  }
  return weeks;
}
```

**Plan Status Badge Logic** (lines 547-580):
```javascript
async function checkKRPlanStatus(krId) {
  const response = await fetch(`/api/goals/quarterly?key_result_id=${krId}`);
  const data = await response.json();
  if (data.goals && data.goals.length > 0) {
    const quarterlyGoal = data.goals[0];
    const weeklyResponse = await fetch(`/api/goals/weekly?quarterly_goal_id=${quarterlyGoal._id}`);
    const weeklyData = await weeklyResponse.json();
    if (weeklyData.goals && weeklyData.goals.length > 0) {
      return { status: 'PLANNED', quarterlyGoal, weeklyGoals: weeklyData.goals };
    }
    return { status: 'PARTIAL', quarterlyGoal };
  }
  return { status: 'NO_PLAN' };
}
```

**Progress Calculation** (lines 1797-1820):
```javascript
function calculateWeekProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
}
```

**XSS Prevention** (lines 1857-1865):
```javascript
// MUST be identical to dashboard version
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}
```

---

### A.3 Objectives.js Complete Audit

**File**: `client/pages/scripts/objectives.js` (1382 lines)
**Last Audited**: January 14, 2026

#### A.3.1 Status State System (6 States)

| Status | Color | Condition |
|--------|-------|-----------|
| `completed` | Emerald #10B981 | progress === 100 |
| `not_started` | Slate #64748B | progress === 0 AND no activity |
| `overdue` | Red #EF4444 | end_date < today AND progress < 100 |
| `at_risk` | Red #EF4444 | progress < expected_progress - 20% |
| `needs_attention` | Amber #F59E0B | progress < expected_progress - 10% |
| `in_progress` | Blue #3B82F6 | default active state |

#### A.3.2 KR Progress Coloring (5 Levels)

| Level | Color | Condition |
|-------|-------|-----------|
| Not Started | Slate #64748B | progress === 0 |
| Complete | Emerald #10B981 | progress >= 100 |
| 70%+ | Blue #3B82F6 | progress >= 70 |
| 40%+ | Amber #F59E0B | progress >= 40 |
| Below 40% | Red #EF4444 | progress < 40 |

#### A.3.3 Category Colors (MECE)

| Category | Icon | Color |
|----------|------|-------|
| `growth` | 📈 | Blue #3B82F6 |
| `customer_success` | 💼 | Green #10B981 |
| `operations` | ⚙️ | Amber #F59E0B |
| `people_culture` | 👥 | Purple #8B5CF6 |
| `innovation` | 💡 | Indigo #6366F1 |
| `financial_health` | 💰 | Emerald #059669 |

---

### A.4 Implementation Verification Checklist

After implementing each Epic, verify ALL items in this checklist:

#### Dashboard Verification
- [ ] `initDashboard()` runs on page load
- [ ] `loadDashboard()` successfully fetches `/api/dashboard/today`
- [ ] `dashboardData` variable populated correctly
- [ ] All task cards render with correct priority badges
- [ ] Task checkbox calls `completeTask(taskId)` on click
- [ ] Task completion updates UI without page reload
- [ ] Weekly goals display with correct progress
- [ ] Clicking goal navigates to Planning page
- [ ] Manager view renders for MANAGER role
- [ ] Executive view renders for EXECUTIVE role
- [ ] `escapeHtml()` applied to all user-generated content
- [ ] Toast appears on API errors
- [ ] Loading spinner shows during API calls

#### Planning Verification
- [ ] `initPlanning()` runs on page load
- [ ] `loadCompanyConfiguration()` fetches company config
- [ ] Quarter/year selectors populate correctly
- [ ] `loadObjectives()` fetches all objectives
- [ ] Objective tabs render with correct data
- [ ] Clicking objective tab calls `selectObjective(id)`
- [ ] KR cards show plan status badges
- [ ] `checkKRPlanStatus()` correctly determines status
- [ ] Clicking KR card calls `selectKR(id)`
- [ ] `generatePlan()` calls AI endpoint
- [ ] `createGoals()` POSTs quarterly and weekly goals
- [ ] Week cards render with tasks
- [ ] Task checkbox calls `toggleTaskStatus()`
- [ ] Filter buttons work correctly
- [ ] Pagination works correctly
- [ ] Tree view toggles (if retained)
- [ ] `editExistingPlan()` enables editing
- [ ] `addMoreWeeks()` extends plan
- [ ] `deletePlan()` shows confirmation
- [ ] `confirmDeletePlan()` deletes goals
- [ ] `escapeHtml()` applied to all user content
- [ ] Owner dropdown updates goal owner

#### Objectives Verification
- [ ] All 6 status states display correctly
- [ ] All 5 KR progress color levels work
- [ ] All 6 category colors/icons display
- [ ] Filter by category works
- [ ] Filter by status works
- [ ] View/Edit modal opens
- [ ] Delete confirmation modal works
- [ ] KR progress bars calculate correctly
- [ ] AI Generated badge displays for AI objectives
- [ ] Timeline context shows days remaining

---

### A.5 New Sprint 13 Features (Additions Only)

These are NEW features added in Sprint 13 that DO NOT exist in current implementation:

#### Dashboard New Features
| Feature | Location | Implementation Notes |
|---------|----------|---------------------|
| Objective context dropdown | Header | New state: `selectedObjective` filter |
| Task hover actions | Task cards | Postpone, Assign, Chat buttons |
| Section progress bars | Section headers | Calculate from task/goal data |
| 3-column task layout | Task section | Overdue / Today / Tomorrow |
| 3-column goal layout | Goals section | Last Week / This Week / Next Week |

#### Planning New Features
| Feature | Location | Implementation Notes |
|---------|----------|---------------------|
| Collapsible week cards | Right panel | `toggleWeekExpand(weekId)` |
| Per-week AI generation | Week header | `generateWeekTasks(weekId)` |
| Clickable owner pill | Week footer | `assignOwnerToWeek(weekId)` |
| Objective cards with progress | Header | Replace tabs with circular progress cards |

#### Navigation New Features
| Feature | Location | Implementation Notes |
|---------|----------|---------------------|
| Philosophy dividers | Nav bar | Visual separators between groups |
| Philosophy color accents | Hover/active | PLAY=purple, ASSESS=blue, ALIGN=green, PLAN=orange |
| Custom tooltips | Nav items | 500ms delay, philosophy descriptions |
| Chief AI branding | Logo area | New SVG logo, tagline |

---

**Audit Complete**: January 14, 2026
**Next Review**: Before implementation start
