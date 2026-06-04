# Sprint 8 Handoff Document

**Sprint**: 8
**Created**: December 2, 2025
**Updated**: December 11, 2025
**Status**: Epic F + Epic G Complete + 5 Bugs Fixed + Epic H Planned
**Audit**: [SPRINT_7_8_TECHNICAL_AUDIT.md](../../2-QA-AND-TESTING/SPRINT_7_8_TECHNICAL_AUDIT.md)

---

## Sprint 8 Overview

| Metric | Value |
|--------|-------|
| **Total Points** | 116 pts |
| **Epics** | 5 |
| **Total Stories** | 35 |
| **Estimated Days** | 16-18 days |
| **Start Date** | December 2, 2025 |

### Progress Tracking

| Epic | Points | Status | Completion |
|------|--------|--------|------------|
| Epic D: Dashboard Task Management | 35 | Not Started | 0/8 stories |
| Epic E: Comprehensive SSI Reporting | 20 | Not Started | 0/5 stories |
| Epic F: Continue Planning Feature | 8 | ✅ Complete | 3/3 stories |
| Epic G: User Feedback System | 23 | ✅ Complete | 9/9 stories |
| **Epic H: Streamline Assessment Flow** | **30** | **Planned** | **0/10 stories** |
| Bug Fixes | - | ✅ 5 Fixed | BUG-S8-1, BUG-S8-2, BUG-S8-3, BUG-S8-4, BUG-S8-5 |
| **Total** | **116** | | **12/35 stories + 5 bugs** |

---

## ⚠️ AUDIT NOTES (From Technical Audit)

**Key Requirements from Audit:**
1. **D5 (Postpone)**: Use `ValidationService.validateTaskDates()` for date validation
2. **D6 (Reassign)**: Use `requireRole()` middleware, NOT inline role check
3. **All Stories**: Use `authenticateToken` from `authGuards.js` for new routes
4. **Reuse**: Use existing patterns from Sprint 7 implementation

---

## Bug Fixes (Sprint 8)

### BUG-S8-1: Executive Cannot Save Company Profile ✅ FIXED

**Reported**: December 3, 2025
**Fixed**: December 3, 2025
**Priority**: P0 (Blocking)

**Problem**: Executives (company owners/leaders) were unable to save company profile changes. The API returned 403 Forbidden.

**Root Cause**: `PUT /api/companies/:id` endpoint only allowed `CONSULTANT` and `BUSINESS_OWNER` roles, excluding `EXECUTIVE`.

**Fix Applied**:
1. Added `EXECUTIVE` to `requireRole()` middleware on company update endpoint
2. Added authorization logic for EXECUTIVE (can only update their own company)
3. Updated branding permission check to include EXECUTIVE

**Files Modified**:
- `server/routes/companies.js` (line 416, 429-430, 470)

**Audit Finding**: This was the ONLY endpoint missing EXECUTIVE access for company management. All other routes (goals, tasks, diagnostic-reports, assessments) correctly include EXECUTIVE.

---

### BUG-S8-2: Role Standardization - Use BUSINESS_OWNER for Company Owners ✅ FIXED

**Reported**: December 3, 2025
**Fixed**: December 3, 2025
**Priority**: P1 (Important)

**Problem**: Consultant-invited company owners were getting `EXECUTIVE` role, which had fewer permissions than `BUSINESS_OWNER` (used by direct signup users). This created inconsistent access.

**Root Cause**: The `create-company-invitation` endpoint was creating users with `EXECUTIVE` role instead of `BUSINESS_OWNER`.

**Fix Applied**:
1. Changed invitation flow to create `BUSINESS_OWNER` instead of `EXECUTIVE`
2. Updated signup page to show `BUSINESS_OWNER` instead of `EXECUTIVE`
3. Updated assessment-creation-flow to hide `EXECUTIVE` from role options
4. Updated invitation-accept page to handle both `BUSINESS_OWNER` and `EXECUTIVE` redirects

**Files Modified**:
- `server/routes/invitations.js` (lines 1011-1032, 1072)
- `client/pages/signup.html` (role dropdown)
- `client/pages/invitation-accept.html` (redirect logic)
- `client/pages/assessment-creation-flow.html` (role dropdowns)

**Role System After Fix**:
| Role | Visibility | Use Case |
|------|------------|----------|
| CONSULTANT | Visible | External advisors managing multiple companies |
| BUSINESS_OWNER | Visible | Company owners with full access |
| MANAGER | Visible | Team/department managers |
| EMPLOYEE | Visible | Individual contributors |
| EXECUTIVE | Hidden | Reserved for future (C-level who aren't owners) |

**Note**: EXECUTIVE role remains in the system for backward compatibility and future use. It has equivalent permissions to BUSINESS_OWNER but is hidden from UI.

---

### BUG-S8-3: Invitation Token Storage Key Mismatch ✅ FIXED

**Reported**: December 3, 2025
**Fixed**: December 3, 2025
**Priority**: P0 (Blocking)

**Problem**: Users who accepted invitations could not save company profile or use other features. Error: "Failed to update company" shown in console.

**Root Cause**: `invitation-accept.html` was storing the JWT token as `token` and user as `user`, but the rest of the application expects `karvia_auth_token` and `karvia_user`.

**Fix Applied**:
1. Changed token storage key from `token` to `karvia_auth_token`
2. Changed user storage key from `user` to `karvia_user`

**Files Modified**:
- `client/pages/invitation-accept.html` (lines 464-465)

**Note**: Existing users who accepted invitations before this fix will need to log out and log back in to get the correct token storage.

---

### BUG-S8-4: JWT Token Key Mismatch (500 Error on Company Save) ✅ FIXED

**Reported**: December 3, 2025
**Fixed**: December 3, 2025
**Priority**: P0 (Blocking)

**Problem**: Users who accepted invitations received 500 Internal Server Error when saving company profile. Error was `Cannot read property 'toString' of undefined`.

**Root Cause**: The JWT token generated in `invitations.js` used camelCase keys (`userId`, `companyId`), but the rest of the application expected snake_case keys (`user_id`, `company_id`). This caused `req.user.company_id` to be undefined.

**Fix Applied**:
1. Changed JWT payload keys from camelCase to snake_case
2. Added `email` field for consistency with auth.js
3. Changed expiry from 24h to 7d to match auth.js

**Before**:
```javascript
const tokenPayload = {
  userId: user._id,
  companyId: user.company_id,
  role: user.role
};
```

**After**:
```javascript
const tokenPayload = {
  user_id: user._id,
  email: user.email,
  company_id: user.company_id,
  role: user.role
};
```

**Files Modified**:
- `server/routes/invitations.js` (lines 271-278)

**Note**: Existing users who accepted invitations before this fix will need to log out and log back in.

---

### BUG-S8-5: Company Settings Undefined Values Cause Validation Error ✅ FIXED

**Reported**: December 3, 2025
**Fixed**: December 3, 2025
**Priority**: P0 (Blocking)

**Problem**: Users could not save company profile. Error: "Company validation failed: settings.business_hours: Cast to Object failed for value 'undefined'"

**Root Cause**: When the frontend sends partial updates to company settings/branding/business_context, some fields may be `undefined`. The spread operator (`{...existing, ...new}`) includes these undefined values, which Mongoose rejects during validation.

**Fix Applied**:
1. Filter out undefined values before merging settings
2. Applied same fix to branding and business_context objects
3. Only defined values are now merged with existing data

**Before**:
```javascript
company.settings = { ...company.settings, ...settings };
```

**After** (Final Fix - filters BOTH existing and new data):
```javascript
const existingSettings = company.settings?.toObject?.() || company.settings || {};
const merged = { ...existingSettings, ...settings };
company.settings = Object.fromEntries(
  Object.entries(merged).filter(([_, v]) => v !== undefined)
);
```

**Files Modified**:
- `server/routes/companies.js` (lines 469-496)

**Note**: Initial fix only filtered incoming data. Final fix filters the merged result to handle cases where existing database data already contains undefined values.

---

## Epic Summary

| Epic | Points | Priority | Stories | Status |
|------|--------|----------|---------|--------|
| **Epic D**: Dashboard Task Management Redesign | 35 | P0 | 8 | Not Started |
| **Epic E**: Comprehensive SSI Diagnostic Reporting | 20 | P1 | 5 | Not Started |
| **Epic F**: Continue Planning Feature | 8 | P0 | 3 | ✅ Complete |
| **Epic G**: User Feedback System | 23 | P1 | 9 | ✅ Complete |
| **Epic H**: Streamline Assessment Creation Flow | 30 | P0 | 10 | Planned |
| **Total** | **116** | | **35** | 31 pts done |

### Recommended Implementation Order

1. **Epic F (8 pts)** - ✅ COMPLETE. Quick win, fixes a user-reported bug
2. **Epic G (23 pts)** - ✅ COMPLETE. User feedback collection, AI estimation
3. **Epic H (30 pts)** - Streamline assessment flow, reuses existing code
4. **Epic D (35 pts)** - Core dashboard functionality, largest epic
5. **Epic E (20 pts)** - Reporting enhancements, can run in parallel

---

## Epic D: Dashboard Task Management Redesign (35 pts)

**Goal**: Redesign the Dashboard task view with clean, detailed task cards showing full hierarchy, with intuitive task actions (Complete, Postpone, Reassign).

### Design Principle
> **UI/UX redesign only** - No functional changes to task APIs. Reuse existing stories and extend with improved visual design.

---

### Task Card Design (Option B - Detailed, Clean)

```
┌─────────────────────────────────────────────────────────────┐
│ ○ Complete quarterly revenue analysis                       │
│                                                             │
│   Priority: High    │    Due: Dec 5, 2025                  │
│                                                             │
│   ┌─ Why Chain ─────────────────────────────────────────┐  │
│   │ Weekly Goal: Week 3 - Financial review milestone    │  │
│   │ Quarterly Goal: Q4 Revenue Analysis                 │  │
│   │ Key Result: Increase revenue by 20%                 │  │
│   │ Objective: Financial Growth 2025                    │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   [✓ Complete]   [📅 Postpone]   [👤 Reassign]             │
└─────────────────────────────────────────────────────────────┘
```

**Card Elements**:
- Status indicator (○ todo, ◐ in progress, ✓ done, ⚠ overdue)
- Task name (truncated with ellipsis if long)
- Priority badge (High/Medium/Low with color)
- Due date (with overdue styling if past)
- Why Chain section (collapsible, shows full hierarchy)
- Action buttons (Complete, Postpone, Reassign)

---

### User Stories

| ID | Title | Points | Priority | Base Story |
|----|-------|--------|----------|------------|
| US-S8-D1 | Task Cards Redesign | 5 | P0 | EMP-008 |
| US-S8-D2 | Why Chain Display | 5 | P0 | EMP-016 |
| US-S8-D3 | Complete Task Action | 3 | P0 | EMP-009 |
| US-S8-D4 | Update Task Progress | 3 | P0 | EMP-010 |
| US-S8-D5 | Postpone Task with Date Picker | 5 | P0 | NEW |
| US-S8-D6 | Reassign Task (Manager Only) | 5 | P1 | NEW |
| US-S8-D7 | Task Grouping by Due Date | 5 | P1 | NEW |
| US-S8-D8 | Task Filters & Overdue Indicators | 4 | P2 | NEW |

---

### US-S8-D1: Task Cards Redesign (5 pts)

**Extends**: EMP-008 (View Daily Tasks)

**As an** employee
**I want** to see my tasks in clean, detailed cards
**So that** I can quickly understand each task and take action

**Acceptance Criteria**:
- [ ] Task cards display in vertical list (mobile-first)
- [ ] Each card shows: task name, priority, due date
- [ ] Priority badge with colors (High=red, Medium=yellow, Low=green)
- [ ] Due date with relative format ("Today", "Tomorrow", "Dec 5")
- [ ] Overdue tasks highlighted with warning styling
- [ ] Status indicator shows current state (todo, in_progress, done)
- [ ] Cards are tappable/clickable for detail view
- [ ] Loading skeleton while fetching

**Files**:
- `client/pages/dashboard.html` - Task card template
- `client/pages/scripts/dashboard.js` - Card rendering logic
- `client/css/dashboard.css` - Card styling

---

### US-S8-D2: Why Chain Display (5 pts)

**Extends**: EMP-016 (View "Why Chain" Context)

**As an** employee
**I want** to see how my task connects to company objectives
**So that** I understand the impact of my work

**Acceptance Criteria**:
- [ ] "Why Chain" section in each task card
- [ ] Shows hierarchy: Task → Weekly Goal → Quarterly Goal → KR → Objective
- [ ] Collapsible by default (click to expand)
- [ ] Each level shows title only (keep it clean)
- [ ] Visual tree line connecting levels
- [ ] "Not linked" state if task has no goal

**API**: GET `/api/tasks/:taskId/lineage` (existing)

**Files**:
- `client/pages/dashboard.html` - Why Chain component
- `client/pages/scripts/dashboard.js` - Lineage fetch and render
- `client/css/dashboard.css` - Tree styling

---

### US-S8-D3: Complete Task Action (3 pts)

**Extends**: EMP-009 (Complete Task)

**As an** employee
**I want** to mark tasks as complete with one click
**So that** I can quickly update my progress

**Acceptance Criteria**:
- [ ] "Complete" button on each task card
- [ ] Click → Confirmation (optional: instant complete)
- [ ] API call: PUT `/api/tasks/:id` with `status: 'completed'`
- [ ] Card updates immediately (optimistic UI)
- [ ] Progress cascades to parent goals
- [ ] Success toast: "Task completed!"
- [ ] Completed tasks move to "Done" section or fade out

**Files**:
- `client/pages/scripts/dashboard.js` - Complete handler
- `server/routes/tasks.js` - Existing endpoint (no changes)

---

### US-S8-D4: Update Task Progress (3 pts)

**Extends**: EMP-010 (Update Task Progress)

**As an** employee
**I want** to update task progress percentage
**So that** I can show partial completion

**Acceptance Criteria**:
- [ ] Progress indicator on task card (optional, for in_progress)
- [ ] Click to update progress (modal or inline slider)
- [ ] API call: PUT `/api/tasks/:id` with `progress: X`
- [ ] Progress bar updates in real-time
- [ ] Progress cascades to parent goal

**Files**:
- `client/pages/scripts/dashboard.js` - Progress update handler
- `server/routes/tasks.js` - Existing endpoint (no changes)

---

### US-S8-D5: Postpone Task with Date Picker (5 pts)

**NEW Story**

**As an** employee
**I want** to postpone a task to a future date
**So that** I can reschedule when I can't complete today

**Acceptance Criteria**:
- [ ] "Postpone" button on each task card
- [ ] Opens date picker modal
- [ ] Shows current due date
- [ ] User selects new date (must be future date)
- [ ] "Confirm Postpone" button
- [ ] API call: PUT `/api/tasks/:id` with `due_date: newDate`
- [ ] **Backend validates**: new date within parent goal's date range
- [ ] Card updates with new due date
- [ ] Success toast: "Task rescheduled to Dec 10"
- [ ] Cannot postpone completed tasks

**Validation Rules**:
- New date must be > today
- New date must be <= parent weekly goal's due_date
- If no parent goal, allow any future date

**⚠️ AUDIT REQUIREMENT - Use Existing Services**:
```javascript
// Backend validation - MUST use ValidationService (NOT inline validation)
const ValidationService = require('../services/ValidationService');

// In PUT /api/tasks/:id handler:
const parentGoal = await Goal.findById(task.weekly_goal_id);
const validation = ValidationService.validateTaskDates(
  { due_date: newDate },
  parentGoal
);
if (!validation.valid) {
  return res.status(400).json({ error: validation.errors.join(', ') });
}
```

**Files**:
- `client/pages/dashboard.html` - Date picker modal
- `client/pages/scripts/dashboard.js` - Postpone handler
- `server/routes/tasks.js` - Update endpoint (add date validation)
- `server/services/ValidationService.js` - **REUSE** `validateTaskDates()` method

---

### US-S8-D6: Reassign Task (Manager Only) (5 pts)

**NEW Story**

**As a** manager
**I want** to reassign tasks to other team members
**So that** I can redistribute workload when needed

**Acceptance Criteria**:
- [ ] "Reassign" button visible ONLY for managers/executives
- [ ] Opens team member dropdown
- [ ] Shows: member name, current task count
- [ ] Select member → Confirm
- [ ] API call: PUT `/api/tasks/:id/reassign` with `assigned_to: userId`
- [ ] Task moves from original assignee's view
- [ ] Notification to new assignee (if notifications enabled)
- [ ] Success toast: "Task reassigned to John"
- [ ] Employees see "Reassign" button disabled or hidden

**Role Check**:
- MANAGER, EXECUTIVE, CONSULTANT can reassign
- EMPLOYEE cannot reassign

**⚠️ AUDIT REQUIREMENT - Use requireRole() Middleware**:
```javascript
// In server/routes/tasks.js - Use middleware, NOT inline role check
const { authenticateToken } = require('../middleware/authGuards');
const { requireRole } = require('../middleware/roleGuards');

// ✅ CORRECT - Use requireRole middleware
router.put('/:id/reassign',
  authenticateToken,
  requireRole('MANAGER', 'EXECUTIVE', 'CONSULTANT'),
  async (req, res) => {
    // Handler code - role already validated by middleware
  }
);

// ❌ WRONG - Do NOT use inline role check
router.put('/:id/reassign', authenticateToken, async (req, res) => {
  if (!['MANAGER', 'EXECUTIVE', 'CONSULTANT'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // This is redundant and inconsistent
});
```

**Files**:
- `client/pages/dashboard.html` - Reassign modal
- `client/pages/scripts/dashboard.js` - Reassign handler, frontend role check
- `server/routes/tasks.js` - New reassign endpoint with `requireRole()` middleware
- `server/middleware/authGuards.js` - **REUSE** existing `requireRole()` function

---

### US-S8-D7: Task Grouping by Due Date (5 pts)

**NEW Story**

**As an** employee
**I want** to see my tasks grouped by due date
**So that** I can focus on what's due soonest

**Acceptance Criteria**:
- [ ] Tasks grouped into sections:
  - **Overdue** (past due date, not completed)
  - **Today** (due today)
  - **Tomorrow** (due tomorrow)
  - **This Week** (due within 7 days)
  - **Later** (due after 7 days)
- [ ] Section headers with count (e.g., "Today (3)")
- [ ] Overdue section always expanded, highlighted
- [ ] Empty sections hidden
- [ ] Sorting: Overdue first, then Today, etc.

**Grouping Options** (Future):
- By Status (To Do, In Progress, Done)
- By Priority (High, Medium, Low)
- By Objective/KR

**Files**:
- `client/pages/scripts/dashboard.js` - Grouping logic
- `client/css/dashboard.css` - Section styling

---

### US-S8-D8: Task Filters & Overdue Indicators (4 pts)

**NEW Story**

**As an** employee
**I want** to filter my tasks and see overdue warnings
**So that** I can focus on priority items

**Acceptance Criteria**:
- [ ] Filter bar at top of task list
- [ ] Quick filters: All, Overdue, Today, High Priority
- [ ] Overdue tasks have red border/badge
- [ ] Overdue count badge on Dashboard nav item
- [ ] Filter persists during session
- [ ] "No tasks" empty state for filtered view

**Files**:
- `client/pages/dashboard.html` - Filter bar
- `client/pages/scripts/dashboard.js` - Filter logic
- `client/css/dashboard.css` - Overdue styling

---

## Implementation Order

```
Day 1-2:
├── US-S8-D1: Task Cards Redesign (5 pts)
└── US-S8-D2: Why Chain Display (5 pts)

Day 3:
├── US-S8-D3: Complete Task Action (3 pts)
└── US-S8-D4: Update Task Progress (3 pts)

Day 4-5:
├── US-S8-D5: Postpone Task (5 pts) - includes backend validation
└── US-S8-D6: Reassign Task (5 pts) - manager role check

Day 6-7:
├── US-S8-D7: Task Grouping (5 pts)
└── US-S8-D8: Filters & Overdue (4 pts)
```

---

## Technical Notes

### Services to Reuse (From Audit)

| Service | Method | Sprint 8 Usage |
|---------|--------|----------------|
| `ValidationService` | `validateTaskDates()` | D5 - Postpone date validation |
| `ValidationService` | `validateFutureDate()` | D5 - Ensure date > today |
| `authGuards.js` | `authenticateToken` | All new routes |
| `roleGuards.js` | `requireRole()` | D6 - Reassign authorization |
| `DateService` | Date utilities | D7, D8 - Grouping by due date |

### API Endpoints Used

**Existing Endpoints** (no changes needed):
- GET `/api/tasks?assigned_to=me` - Fetch user's tasks
- PUT `/api/tasks/:id` - Update task (status, progress, due_date)
- GET `/api/tasks/:taskId/lineage` - Get Why Chain hierarchy

**New Endpoints** (Sprint 8):
- PUT `/api/tasks/:id/reassign` - Reassign task (manager only, uses requireRole)

**Enhanced Validation** (US-S8-D5):
- Use `ValidationService.validateTaskDates()` for date range validation
- Use `ValidationService.validateFutureDate()` to ensure new date > today
- **DO NOT** create inline validation logic

### Role-Based Access (US-S8-D6)

```javascript
// Frontend - Reassign button visibility
const canReassign = ['MANAGER', 'EXECUTIVE', 'CONSULTANT'].includes(user.role);

// Backend - Use requireRole() middleware (NOT inline check)
const { authenticateToken } = require('../middleware/authGuards');
const { requireRole } = require('../middleware/roleGuards');

router.put('/:id/reassign',
  authenticateToken,
  requireRole('MANAGER', 'EXECUTIVE', 'CONSULTANT'),
  handler
);
```

### Code Review Checklist

Before merging Sprint 8 code, verify:

| Check | Requirement |
|-------|-------------|
| ✅ Auth Middleware | All new routes use `authenticateToken` from `authGuards.js` |
| ✅ Role Middleware | D6 uses `requireRole()`, not inline role check |
| ✅ Date Validation | D5 uses `ValidationService.validateTaskDates()` |
| ✅ No Hardcoding | No hardcoded dates, quarters, or role arrays |
| ✅ Error Handling | All endpoints return proper error structure |
| ✅ Multi-tenant | All queries filter by `company_id` |

### Frontend Components

```
dashboard.html
├── task-list (container)
│   ├── task-group (by due date)
│   │   ├── group-header ("Today (3)")
│   │   └── task-cards
│   │       ├── task-card
│   │       │   ├── status-indicator
│   │       │   ├── task-name
│   │       │   ├── meta (priority, due date)
│   │       │   ├── why-chain (collapsible)
│   │       │   └── actions (complete, postpone, reassign)
```

---

## Success Criteria

### Functional Criteria
- [ ] Task cards display with clean, detailed design
- [ ] Why Chain shows full hierarchy (Task → Objective)
- [ ] Complete action works with cascade
- [ ] Postpone opens date picker, updates backend
- [ ] Reassign visible only for managers
- [ ] Tasks grouped by due date
- [ ] Overdue tasks highlighted
- [ ] Filters work correctly
- [ ] Mobile responsive

### Audit Compliance Criteria
- [ ] D5 uses `ValidationService.validateTaskDates()` for date validation
- [ ] D6 uses `requireRole()` middleware (not inline check)
- [ ] All new routes use `authenticateToken` from `authGuards.js`
- [ ] No new hardcoded date calculations
- [ ] All queries filter by `company_id`
- [ ] Code review checklist passed before merge

---

## Dependencies

- Sprint 7 complete (especially BUG5 - Date Cascade fix)
- Existing task APIs functional
- EMP-016 Why Chain API implemented

---

---

## Epic E: Comprehensive SSI Diagnostic Reporting (NEW - 20 pts)

**Goal**: Enhance the SSI Diagnostic Report to provide a comprehensive, executive-ready analysis that helps management understand assessment results and make data-driven decisions.

### Background
The current diagnostic report provides basic SSI scores and insights. This epic expands the report to include:
- Detailed trend analysis
- Comparative industry benchmarks
- Actionable recommendations for each department
- Visual charts and graphs for executive presentations
- PDF export for board presentations

### User Stories

| ID | Title | Points | Priority |
|----|-------|--------|----------|
| US-S8-E1 | Executive Summary Section | 5 | P0 |
| US-S8-E2 | Trend Analysis (Historical Comparison) | 5 | P0 |
| US-S8-E3 | Department Deep-Dive Analysis | 5 | P0 |
| US-S8-E4 | Visual Charts & Graphs | 3 | P1 |
| US-S8-E5 | PDF Export with Formatting | 2 | P1 |

---

### US-S8-E1: Executive Summary Section (5 pts)

**As a** business owner or executive
**I want** a clear executive summary at the top of the diagnostic report
**So that** I can quickly understand the key findings without reading the full report

**Acceptance Criteria**:
- [ ] One-page executive summary with:
  - Company health score with color-coded status
  - Top 3 strengths (highest-scoring areas)
  - Top 3 improvement areas (critical issues)
  - 90-day priority recommendations
- [ ] Summary written in clear, non-technical language
- [ ] Links to detailed sections for each finding
- [ ] Print-friendly format

**Technical Implementation**:
- Extend `DiagnosticEngine.js` - `generateDiagnosticReport()` to include `executive_summary`
- Add `formatExecutiveSummary()` to `ReportGenerator.js`

---

### US-S8-E2: Trend Analysis (Historical Comparison) (5 pts)

**As a** business owner
**I want** to see how our SSI scores have changed over time
**So that** I can track improvement and identify regression

**Acceptance Criteria**:
- [ ] Show score changes vs. last report (if available)
- [ ] Trend indicators: ↑ improved, ↓ declined, → stable
- [ ] Historical chart showing last 4 reports
- [ ] Highlight significant changes (>10% movement)
- [ ] "First assessment" indicator if no prior data

**Technical Implementation**:
- Add `getHistoricalScores()` to `DiagnosticEngine.js`
- Store historical scores in `DiagnosticReport` model
- Calculate deltas and trend direction

---

### US-S8-E3: Department Deep-Dive Analysis (5 pts)

**As an** executive
**I want** detailed analysis for each department/function
**So that** I can understand specific team strengths and issues

**Acceptance Criteria**:
- [ ] Section for each department with:
  - Department SSI scores (Speed, Strength, Intelligence)
  - Team-level breakdown within department
  - Top performer in department
  - Key issue for department
  - Specific recommendation for department
- [ ] Departments sorted by score (lowest first for attention)
- [ ] Comparison to company average
- [ ] "Not enough data" state for departments with <3 assessments

**Technical Implementation**:
- Extend `generateFunctionReport()` in `DiagnosticEngine.js`
- Add department-specific insights to `InsightDetector.js`

---

### US-S8-E4: Visual Charts & Graphs (3 pts)

**As a** management user
**I want** visual charts in the diagnostic report
**So that** I can present findings to the board

**Acceptance Criteria**:
- [ ] Radar chart for SSI dimensions
- [ ] Bar chart comparing departments
- [ ] Pie chart for issue severity distribution
- [ ] Trend line for historical scores
- [ ] Charts render in modal and PDF export

**Technical Implementation**:
- Use Chart.js for frontend rendering
- Generate SVG/PNG for PDF export
- Add chart data to report response

---

### US-S8-E5: PDF Export with Formatting (2 pts)

**As a** business owner
**I want** to export the diagnostic report as a professional PDF
**So that** I can share with board members and stakeholders

**Acceptance Criteria**:
- [ ] "Export PDF" button in report modal
- [ ] PDF includes:
  - Company logo and name
  - Generation date
  - Executive summary
  - All sections with formatting
  - Charts and graphs
  - Page numbers
- [ ] Consistent branding and styling
- [ ] File named: `{CompanyName}_SSI_Report_{Date}.pdf`

**Technical Implementation**:
- Use `jsPDF` or `html2pdf` for frontend PDF generation
- Include chart images in PDF
- Add company branding from `company.branding`

---

### Report Structure (Enhanced)

```
┌─────────────────────────────────────────────────────┐
│ KARVIA SSI DIAGNOSTIC REPORT                        │
│ Company Name | Generated: Dec 2, 2025               │
├─────────────────────────────────────────────────────┤
│ EXECUTIVE SUMMARY                                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Overall Health: 7.2 (Good)        ⬆ +0.5        │ │
│ │                                                 │ │
│ │ Top Strengths:                                  │ │
│ │ ✓ Strong customer relationships (8.1)          │ │
│ │ ✓ Efficient operations team (7.8)              │ │
│ │                                                 │ │
│ │ Improvement Areas:                             │ │
│ │ ⚠ Sales team speed below benchmark (5.2)       │ │
│ │ ⚠ Intelligence gap in marketing (5.8)         │ │
│ │                                                 │ │
│ │ 90-Day Priorities:                             │ │
│ │ 1. Sales training program (Speed)              │ │
│ │ 2. Marketing analytics tools (Intelligence)    │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ DETAILED ANALYSIS                                   │
│ • Company Overview (scores, trends)                 │
│ • Department Deep-Dives                             │
│ • Team Rankings                                     │
│ • Recommendations                                   │
└─────────────────────────────────────────────────────┘
```

---

## Epic F: Planning Page - Continue Planning Feature (NEW - 8 pts)

**Goal**: Enable users to extend existing AI-generated plans by continuing from where they left off, without disrupting already-planned weeks.

### Background
Currently, when a KR has partial weeks planned (e.g., 3 of 12 weeks), clicking "Continue Planning" shows all weeks in the dropdown. Users need to see only the remaining weeks (4-12) and generate plans that extend the existing plan with full context.

### User Stories

| ID | Title | Points | Priority |
|----|-------|--------|----------|
| US-S8-F1 | Show Remaining Weeks in Dropdown | 2 | P0 |
| US-S8-F2 | Extend Plan API Endpoint | 4 | P0 |
| US-S8-F3 | Context-Aware Plan Generation | 2 | P0 |

---

### US-S8-F1: Show Remaining Weeks in Dropdown (2 pts) ✅ COMPLETE

**As a** manager or executive
**I want** the Start Week dropdown to show only unplanned weeks
**So that** I can continue planning from where I left off

**Acceptance Criteria**:
- [x] When viewing a KR with existing plans (e.g., 3 of 12 weeks planned):
  - Start Week dropdown shows Week 4, Week 5, ... Week 12 (remaining weeks only)
  - Dropdown label indicates "Continue from Week X"
- [x] If all weeks planned, show "All weeks planned" message
- [x] Timeline (Weeks) input defaults to remaining weeks count
- [x] "Generate AI Plan" button text changes to "Continue AI Plan" when extending

**Implementation Notes (Dec 2, 2025)**:
- Added `isExtendingPlan` and `plannedWeeksData` global state variables
- Updated `populateWeeksFromObjective()` to filter planned weeks when extending
- Button text dynamically changes between "Generate AI Plan" and "Continue AI Plan"
- Auto-selects first remaining week when entering extension mode

**Technical Implementation**:
```javascript
// In planning.js - Fetch existing plan weeks
async function getPlannedWeeks(keyResultId) {
  const response = await fetch(`/api/planning/kr/${keyResultId}/planned-weeks`);
  return response.json(); // { planned_weeks: [1, 2, 3], total_weeks: 12 }
}

// Populate dropdown with remaining weeks only
function populateStartWeekDropdown(plannedWeeks, totalWeeks) {
  const dropdown = document.getElementById('start-week-select');
  dropdown.innerHTML = '';

  for (let week = 1; week <= totalWeeks; week++) {
    if (!plannedWeeks.includes(week)) {
      const option = document.createElement('option');
      option.value = week;
      option.textContent = `Week ${week}`;
      dropdown.appendChild(option);
    }
  }
}
```

**Files**:
- `client/pages/scripts/planning.js` - Dropdown population logic
- `client/pages/planning.html` - Updated dropdown, button text change

---

### US-S8-F2: Extend Plan API Endpoint (4 pts) ✅ COMPLETE

**As a** system
**I want** a new API endpoint to extend existing plans
**So that** AI can generate additional weeks without overwriting existing data

**Acceptance Criteria**:
- [x] New endpoint: POST `/api/planning/extend`
- [x] Request includes:
  - `key_result_id`: The KR to extend plan for
  - `start_week`: First week to generate (e.g., 4)
  - `timeline_weeks`: Number of weeks to generate (e.g., 9)
  - `owner_id`: Default task owner
- [x] Response includes generated weekly goals and tasks
- [x] Existing weeks (1-3) are NOT modified
- [x] New weeks (4-12) are created and saved
- [x] Proper error handling for invalid week ranges

**Implementation Notes (Dec 2, 2025)**:
- Added GET `/api/planning/kr/:key_result_id/planned-weeks` - returns planned/remaining weeks
- Added POST `/api/planning/extend` - generates new weeks with context awareness
- Validates start_week is not already planned, prevents overlap
- Uses same goal/task creation pattern as generate-weekly-plan
- Returns `total_weeks_planned` count in response for UI feedback

**API Design**:
```javascript
// POST /api/planning/extend
{
  "key_result_id": "abc123",
  "start_week": 4,
  "timeline_weeks": 9,
  "owner_id": "user456"
}

// Response
{
  "success": true,
  "data": {
    "weeks_generated": 9,
    "start_week": 4,
    "end_week": 12,
    "weekly_goals": [...],
    "tasks": [...]
  }
}
```

**Files**:
- `server/routes/planning.js` - New `/extend` endpoint
- `server/services/AIObjectivePlanner.js` - `extendPlan()` method

---

### US-S8-F3: Context-Aware Plan Generation (2 pts) ✅ COMPLETE

**As a** system
**I want** AI to receive context of existing plan when extending
**So that** new weeks are coherent and don't duplicate existing work

**Acceptance Criteria**:
- [x] OpenAI prompt includes summary of existing weeks:
  - Week 1-3 goals and key tasks (brief summary)
  - What was accomplished/planned so far
  - Current progress percentage
- [x] AI generates new weeks that:
  - Build upon existing work
  - Don't repeat tasks from earlier weeks
  - Maintain consistent naming conventions
  - Progress toward KR target logically
- [x] Prompt explicitly states: "Continue the plan, do not repeat existing weeks"

**Implementation Notes (Dec 2, 2025)**:
- Created `generateExtendedPlanWithAI()` function in planning.js
- System prompt explicitly instructs AI to "CONTINUE an existing plan, not start fresh"
- User prompt includes:
  - Existing weeks summary with milestone names and status
  - Current progress percentage
  - Clear instruction to NOT repeat tasks from previous weeks
- Falls back to template generation if AI fails

**Prompt Structure**:
```javascript
const extendPrompt = `
You are extending an existing OKR execution plan.

EXISTING PLAN CONTEXT:
- Key Result: ${kr.title}
- Target: ${kr.target_value} ${kr.unit}
- Current Progress: ${kr.current_value} (${progressPct}%)
- Weeks Already Planned: ${existingWeeks.length}

EXISTING WEEKS SUMMARY:
${existingWeeks.map(w => `Week ${w.week_number}: ${w.title} - ${w.tasks?.length || 0} tasks`).join('\n')}

INSTRUCTION:
Continue this plan from Week ${startWeek} to Week ${endWeek}.
- Build upon the existing work
- Do NOT repeat tasks from earlier weeks
- Maintain consistent naming conventions
- Progress logically toward the target

Generate ${timelineWeeks} additional weeks with 5 tasks each.
`;
```

**Files**:
- `server/services/AIObjectivePlanner.js` - Context-aware prompt
- `server/routes/planning.js` - Fetch existing plan for context

---

### Implementation Flow

```
User clicks "Continue Planning" on KR with 3/12 weeks planned
                ↓
Frontend fetches: GET /api/planning/kr/:krId/planned-weeks
                ↓
Dropdown shows: Week 4, Week 5, ... Week 12
Timeline defaults to: 9 weeks
                ↓
User clicks "Continue AI Plan"
                ↓
Frontend calls: POST /api/planning/extend
  - Includes existing plan context
  - Specifies start_week: 4, timeline_weeks: 9
                ↓
Backend:
  1. Fetches existing weeks 1-3 for context
  2. Calls OpenAI with context-aware prompt
  3. Generates weeks 4-12
  4. Saves to database (doesn't touch weeks 1-3)
  5. Returns new weeks
                ↓
Frontend updates: "12 of 12 weeks planned"
```

---

### Backend Changes Summary

| File | Change |
|------|--------|
| `server/routes/planning.js` | Add `GET /kr/:krId/planned-weeks` endpoint |
| `server/routes/planning.js` | Add `POST /extend` endpoint |
| `server/services/AIObjectivePlanner.js` | Add `extendPlan()` method with context-aware prompt |

### Frontend Changes Summary

| File | Change |
|------|--------|
| `client/pages/planning.html` | Update dropdown, button text |
| `client/pages/scripts/planning.js` | Add `getPlannedWeeks()`, `populateRemainingWeeks()`, `extendPlan()` |

---

## Epic G: User Feedback System (NEW - 23 pts)

**Goal**: Create a comprehensive feedback collection system allowing users to rate features, submit ideas, and vote on priorities. Includes AI-powered development estimation for admin planning.

**Design Constraint**: All UI must match existing KARVIA design patterns exactly - same fonts, colors, spacing. No new design elements.

### Background

This epic creates a "Feature Pulse" page where users can:
1. Submit weekly sentiment pulse (emoji-based)
2. Rate existing features (thumbs up/down with improvement tags)
3. Submit new feature ideas with structured data collection
4. Vote on ideas from all KARVIA users (global visibility)

Admins get a dashboard to view aggregated feedback and AI-powered development estimates.

---

### User Stories

| ID | Title | Points | Priority |
|----|-------|--------|----------|
| US-S8-G1 | Feedback Page Structure & Routing | 2 | P0 |
| US-S8-G2 | Weekly Pulse Component | 2 | P0 |
| US-S8-G3 | Feature Rating Cards with Tags | 3 | P0 |
| US-S8-G4 | Multi-Step Idea Submission Form | 3 | P0 |
| US-S8-G5 | Global Feature Ideas Board | 2 | P0 |
| US-S8-G6 | Feedback API + Model | 3 | P0 |
| US-S8-G7 | AI Estimation Service | 3 | P1 |
| US-S8-G8 | Admin Dashboard (Top Ideas) | 3 | P1 |
| US-S8-G9 | Estimate Detail Modal + Override | 2 | P1 |

---

### US-S8-G1: Feedback Page Structure & Routing (2 pts)

**As a** user
**I want** to access a Feedback page from the navigation menu
**So that** I can provide feedback on the platform

**Acceptance Criteria**:
- [ ] New page: `client/pages/feedback.html`
- [ ] Navigation link added below "Settings" in user dropdown
- [ ] Page layout matches existing pages (same header, padding, card styles)
- [ ] Mobile responsive
- [ ] Shows "Last submitted: X days ago" indicator

**Navigation Change** (surgical, 5 lines):
```javascript
// In client/js/navigation.js - Add after Settings menu item
{ label: 'Feedback', href: '/pages/feedback.html' }
```

**Files**:
- `client/pages/feedback.html` - NEW (reuse objectives.html layout)
- `client/js/navigation.js` - Add menu item (+5 lines)

---

### US-S8-G2: Weekly Pulse Component (2 pts)

**As a** user
**I want** to quickly rate my weekly experience with emojis
**So that** I can provide sentiment feedback without effort

**Acceptance Criteria**:
- [ ] Card with 5 emoji options: 😔 😕 😐 🙂 😊
- [ ] One-click selection (radio button style)
- [ ] Optional text comment field
- [ ] "Submit Pulse" button
- [ ] Shows "Thanks! See you next week" after submission
- [ ] Prevents duplicate submission same week

**API**: POST `/api/feedback/pulse`

**Files**:
- `client/pages/feedback.html` - Pulse component
- `client/pages/scripts/feedback.js` - Pulse handler

---

### US-S8-G3: Feature Rating Cards with Tags (3 pts)

**As a** user
**I want** to rate features I've used with thumbs up/down
**So that** I can indicate which features work well or need improvement

**Acceptance Criteria**:
- [ ] Grid of feature cards (Assessment, Objectives, Planning, Team Mgmt, Dashboard)
- [ ] Each card has 👍 and 👎 buttons
- [ ] Click 👎 expands improvement tag selector:
  - Navigation, Speed, Missing Features, Confusing UI, Bugs, Other
- [ ] Optional text comment after tags
- [ ] Submit per-feature (not all at once)
- [ ] Visual feedback on submitted ratings (checkmark)

**Tag Options**:
```javascript
const IMPROVEMENT_TAGS = [
  'navigation',      // Hard to find things
  'speed',           // Too slow
  'missing_features', // Doesn't do what I need
  'confusing_ui',    // Don't understand how to use
  'bugs',            // Something broken
  'other'            // Freeform
];
```

**API**: POST `/api/feedback/features`

**Files**:
- `client/pages/feedback.html` - Feature rating grid
- `client/pages/scripts/feedback.js` - Rating handler with tag expansion

---

### US-S8-G4: Multi-Step Idea Submission Form (3 pts)

**As a** user
**I want** to submit detailed feature ideas
**So that** the product team can accurately estimate and prioritize

**Acceptance Criteria**:
- [ ] 3-step modal form:
  - Step 1: Title, Description, Problem Statement
  - Step 2: Category, Affected Features, Target Users
  - Step 3: User Complexity Estimate, Urgency, Technical Notes
- [ ] Progress indicator (Step 1/3)
- [ ] Back/Next navigation
- [ ] Form validation per step
- [ ] "Submit Idea" on final step
- [ ] Success message with idea preview

**Form Fields**:
```javascript
// Step 1 - Core Info (required)
idea_title: String,           // Max 100 chars
idea_description: String,     // Max 500 chars
problem_statement: String,    // Max 300 chars

// Step 2 - Classification
idea_category: enum ['integration', 'reporting', 'automation', 'mobile', 'ui_ux', 'new_feature'],
affected_features: array ['assessment', 'objectives', 'planning', 'team_management', 'dashboard', 'none'],
target_users: enum ['all_users', 'specific_roles', 'admins_only'],

// Step 3 - Estimation Hints
user_complexity_estimate: enum ['simple', 'moderate', 'significant', 'major'],
urgency: enum ['nice_to_have', 'significant_help', 'critical'],
technical_notes: String       // Optional, max 300 chars
```

**API**: POST `/api/feedback/ideas`

**Files**:
- `client/pages/feedback.html` - Multi-step modal
- `client/pages/scripts/feedback.js` - Form wizard logic

---

### US-S8-G5: Global Feature Ideas Board (2 pts)

**As a** user
**I want** to see and vote on ideas from all KARVIA users
**So that** popular features get prioritized

**Acceptance Criteria**:
- [ ] List of top ideas sorted by vote count
- [ ] Each idea shows: title, description preview, category, vote count
- [ ] Upvote button (▲) toggles vote
- [ ] "✓ voted" indicator if user already voted
- [ ] Prevents duplicate votes (toggle off if clicked again)
- [ ] "View All" pagination (show top 10 initially)
- [ ] "+ Add Idea" button opens submission modal

**Voting Scope**: Global - all users across all companies see/vote on same ideas

**API**:
- GET `/api/feedback/ideas` - List all (global, paginated)
- POST `/api/feedback/ideas/:id/vote` - Toggle vote

**Files**:
- `client/pages/feedback.html` - Ideas board section
- `client/pages/scripts/feedback.js` - Voting handler

---

### US-S8-G6: Feedback API + Model (3 pts)

**As a** system
**I want** backend API endpoints for feedback operations
**So that** frontend can persist and retrieve feedback data

**Acceptance Criteria**:
- [ ] Feedback Mongoose model with type discriminator
- [ ] User endpoints:
  - GET `/api/feedback/pulse/latest` - User's last pulse
  - POST `/api/feedback/pulse` - Submit pulse
  - GET `/api/feedback/features` - User's feature ratings
  - POST `/api/feedback/features` - Submit rating
  - GET `/api/feedback/ideas` - List all ideas (global)
  - POST `/api/feedback/ideas` - Submit new idea
  - POST `/api/feedback/ideas/:id/vote` - Toggle vote
- [ ] Admin endpoints:
  - GET `/api/feedback/admin/stats` - Aggregated stats
  - GET `/api/feedback/admin/ideas` - All ideas with estimates
  - POST `/api/feedback/admin/ideas/:id/estimate` - Trigger AI estimation
  - PUT `/api/feedback/admin/ideas/:id` - Update status, override estimate
- [ ] Proper authentication on all endpoints
- [ ] Role check for admin endpoints (CONSULTANT only)

**Data Model**:
```javascript
const FeedbackSchema = new mongoose.Schema({
  // Scoping
  company_id: { type: ObjectId, ref: 'Company' }, // null for global ideas
  user_id: { type: ObjectId, ref: 'User', required: true },

  // Type discriminator
  type: {
    type: String,
    enum: ['pulse', 'feature_rating', 'feature_idea'],
    required: true
  },

  // Pulse fields
  pulse_score: { type: Number, min: 1, max: 5 },
  pulse_comment: String,

  // Feature Rating fields
  feature: {
    type: String,
    enum: ['assessment', 'objectives', 'planning', 'team_management', 'dashboard']
  },
  rating: { type: String, enum: ['like', 'dislike'] },
  improvement_tags: [{
    type: String,
    enum: ['navigation', 'speed', 'missing_features', 'confusing_ui', 'bugs', 'other']
  }],
  rating_comment: String,

  // Feature Idea fields (GLOBAL - company_id null)
  idea_title: String,
  idea_description: String,
  problem_statement: String,
  idea_category: { type: String, enum: ['integration', 'reporting', 'automation', 'mobile', 'ui_ux', 'new_feature'] },
  affected_features: [String],
  target_users: { type: String, enum: ['all_users', 'specific_roles', 'admins_only'] },
  user_complexity_estimate: { type: String, enum: ['simple', 'moderate', 'significant', 'major'] },
  urgency: { type: String, enum: ['nice_to_have', 'significant_help', 'critical'] },
  technical_notes: String,

  // Voting
  vote_count: { type: Number, default: 0 },
  voters: [{ type: ObjectId, ref: 'User' }],

  // AI Estimation
  ai_estimate: {
    story_points: Number,
    estimated_hours: Number,
    estimated_cost: Number,
    confidence: { type: String, enum: ['low', 'medium', 'high'] },
    breakdown: {
      backend_hours: Number,
      frontend_hours: Number,
      testing_hours: Number,
      design_hours: Number
    },
    assumptions: [String],
    risks: [String],
    estimated_at: Date,
    model_used: String
  },

  // Admin Override
  admin_estimate: {
    story_points: Number,
    estimated_hours: Number,
    notes: String,
    estimated_by: { type: ObjectId, ref: 'User' },
    estimated_at: Date
  },

  // Status
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'estimated', 'planned', 'in_progress', 'completed', 'declined'],
    default: 'submitted'
  }
}, { timestamps: true });

// Index for global ideas listing
FeedbackSchema.index({ type: 1, status: 1, vote_count: -1 });
```

**Files**:
- `server/models/Feedback.js` - NEW (~120 lines)
- `server/routes/feedback.js` - NEW (~350 lines)
- `server/index.js` - Add route import (+1 line)

---

### US-S8-G7: AI Estimation Service (3 pts)

**As an** admin
**I want** AI to estimate development effort for feature ideas
**So that** I can make informed prioritization decisions

**Acceptance Criteria**:
- [ ] Service file: `server/services/AIEstimator.js`
- [ ] Generates estimate based on:
  - Idea description and problem statement
  - Category and affected features
  - User complexity hint
  - KARVIA tech stack context
- [ ] Returns: story points (Fibonacci), hours, cost ($125/hr), confidence level
- [ ] Includes breakdown: backend, frontend, testing, design hours
- [ ] Lists assumptions and risks
- [ ] Falls back gracefully if OpenAI unavailable

**AI Prompt Structure**:
```javascript
const estimatePrompt = `You are a senior software engineer estimating development effort.

**Tech Stack Context:**
- Backend: Node.js, Express, MongoDB
- Frontend: Vanilla JavaScript, Tailwind CSS
- Authentication: JWT
- Existing features: OKR management, Assessments, Task tracking, Team management

**Feature Request:**
Title: ${idea.idea_title}
Description: ${idea.idea_description}
Problem: ${idea.problem_statement}
Category: ${idea.idea_category}
Affected Features: ${idea.affected_features.join(', ')}
User Complexity Estimate: ${idea.user_complexity_estimate}
Technical Notes: ${idea.technical_notes || 'None'}

**Story Point Guidelines:**
- 1-2: Simple UI change, no backend
- 3-5: New component with minor backend
- 8: New feature with significant backend
- 13: Complex feature, multiple integrations
- 21: Major new system

**Provide JSON response:**
{
  "story_points": number,
  "estimated_hours": number,
  "confidence": "low|medium|high",
  "breakdown": {
    "backend_hours": number,
    "frontend_hours": number,
    "testing_hours": number,
    "design_hours": number
  },
  "assumptions": ["..."],
  "risks": ["..."],
  "reasoning": "..."
}`;
```

**Files**:
- `server/services/AIEstimator.js` - NEW (~100 lines)
- `server/routes/feedback.js` - Admin estimate endpoint

---

### US-S8-G8: Admin Dashboard (Top Ideas) (3 pts)

**As an** admin (CONSULTANT role)
**I want** a dashboard showing top feature ideas with estimates
**So that** I can prioritize development backlog

**Acceptance Criteria**:
- [ ] New page: `client/pages/feedback-admin.html`
- [ ] Access restricted to CONSULTANT role
- [ ] Overview stats: Avg Pulse, Total Responses, Feature Ratings, Ideas count
- [ ] Feature Satisfaction bars (% thumbs up per feature)
- [ ] Top Issues list (most mentioned improvement tags)
- [ ] Top Ideas table:
  - Rank, Idea Title, Votes, Estimate (pts/hours/cost), Status
  - "Estimate" button for unestimated ideas
  - "Details" button opens estimate modal
- [ ] Export CSV button
- [ ] Recent Comments section

**Dashboard Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  📊 Feedback Dashboard (Admin)              [Export CSV]    │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ Avg Pulse │ │ Responses │ │ Ratings   │ │ Ideas     │   │
│  │   4.2/5   │ │    127    │ │    89     │ │    23     │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                             │
│  Feature Satisfaction:                                      │
│  Assessment    ████████████████████░░░░  82% 👍            │
│  Objectives    ████████████████░░░░░░░░  68% 👍            │
│  Planning      ██████████████░░░░░░░░░░  58% 👍            │
│  Team Mgmt     █████████████████████░░░  85% 👍            │
│  Dashboard     ████████████░░░░░░░░░░░░  52% 👍            │
│                                                             │
│  Top Issues:                                                │
│  1. Missing Features  ████████████████  34 mentions         │
│  2. Navigation        ████████████      24 mentions         │
│                                                             │
│  Top Ideas:                                                 │
│  │ # │ Idea               │ Votes │ Est   │ Status │       │
│  │ 1 │ Mobile App         │  47   │ 13pts │[Estimate]│      │
│  │ 2 │ Custom Reports     │  31   │ 8pts  │ Estimated│      │
└─────────────────────────────────────────────────────────────┘
```

**Files**:
- `client/pages/feedback-admin.html` - NEW (~450 lines)
- `client/pages/scripts/feedback-admin.js` - NEW (~300 lines)

---

### US-S8-G9: Estimate Detail Modal + Override (2 pts)

**As an** admin
**I want** to view AI estimate details and override if needed
**So that** I can refine estimates based on my knowledge

**Acceptance Criteria**:
- [ ] Modal shows when clicking "Details" on idea row
- [ ] Displays:
  - Story Points, Total Hours, Cost
  - Breakdown bars (Backend, Frontend, Testing, Design)
  - Confidence level indicator
  - Assumptions list
  - Risks list
- [ ] Override section:
  - Story Points dropdown (1,2,3,5,8,13,21)
  - Custom hours input
  - Notes textarea
  - Status dropdown (submitted → planned → in_progress → completed → declined)
- [ ] Save Override button
- [ ] Idea metadata: submitted by, votes, days since submission

**Modal Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  📊 Estimate Details: Custom Reports               [X]      │
├─────────────────────────────────────────────────────────────┤
│  AI Estimate                     Confidence: HIGH           │
│                                                             │
│  Story Points: 8      Total Hours: 64                       │
│  Estimated Cost: $8,000                                     │
│                                                             │
│  Breakdown:                                                 │
│  ├── Backend:  24h  ████████████░░░░░░  37%                │
│  ├── Frontend: 20h  ██████████░░░░░░░░  31%                │
│  ├── Testing:  12h  ██████░░░░░░░░░░░░  19%                │
│  └── Design:    8h  ████░░░░░░░░░░░░░░  13%                │
│                                                             │
│  Assumptions:                                               │
│  • PDF generation using existing library                    │
│  • Standard templates, not fully customizable               │
│                                                             │
│  Risks:                                                     │
│  • Large datasets may cause memory issues                   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Admin Override (optional)                          │   │
│  │  Story Points: [8 ▼]    Hours: [____]              │   │
│  │  Notes: ___________________________________         │   │
│  │  Status: [Estimated ▼]                             │   │
│  │                          [Save Override] [Close]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Submitted by: john@company.com • 47 votes • 12 days ago   │
└─────────────────────────────────────────────────────────────┘
```

**Files**:
- `client/pages/feedback-admin.html` - Modal component
- `client/pages/scripts/feedback-admin.js` - Modal handler, override save

---

### Implementation Order

```
Day 1 (7 pts):
├── US-S8-G6: Feedback Model + API Endpoints (3 pts)
├── US-S8-G1: Feedback Page Structure (2 pts)
└── US-S8-G2: Weekly Pulse Component (2 pts)

Day 2 (5 pts):
├── US-S8-G3: Feature Rating Cards (3 pts)
└── US-S8-G5: Global Ideas Board (2 pts)

Day 3 (6 pts):
├── US-S8-G4: Multi-Step Idea Form (3 pts)
└── US-S8-G7: AI Estimation Service (3 pts)

Day 4 (5 pts):
├── US-S8-G8: Admin Dashboard (3 pts)
└── US-S8-G9: Estimate Modal + Override (2 pts)
```

---

### Files Summary

| Type | File | Lines | Reuses From |
|------|------|-------|-------------|
| **NEW** | `server/models/Feedback.js` | ~120 | Goal.js patterns |
| **NEW** | `server/routes/feedback.js` | ~350 | objectives.js patterns |
| **NEW** | `server/services/AIEstimator.js` | ~100 | ai-okr.js patterns |
| **NEW** | `client/pages/feedback.html` | ~600 | objectives.html layout |
| **NEW** | `client/pages/scripts/feedback.js` | ~400 | objectives.js patterns |
| **NEW** | `client/pages/feedback-admin.html` | ~450 | planning.html layout |
| **NEW** | `client/pages/scripts/feedback-admin.js` | ~300 | existing patterns |
| **MODIFY** | `server/index.js` | +1 line | Route import |
| **MODIFY** | `client/js/navigation.js` | +5 lines | Menu item |

**Total new code: ~2,320 lines | Existing modified: 6 lines**

---

### Design Constraints (MANDATORY)

**Navigation Dropdown** - Exact pattern match:
```html
<!-- Existing pattern (Settings) -->
<a href="/pages/settings.html"
   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
  Settings
</a>

<!-- New - identical styling -->
<a href="/pages/feedback.html"
   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
  Feedback
</a>
```

**Page Components** - Reuse existing:
| Component | Source Reference |
|-----------|------------------|
| Page layout | `objectives.html` |
| Card styling | `planning.html` |
| Button styles | `company-profile.html` |
| Form inputs | `company-profile.html` |
| Modal design | `objectives.html` AI modal |
| Color scheme | Indigo/gray (existing) |

---

### Success Criteria

**Functional**:
- [ ] Users can submit weekly pulse (emoji + optional comment)
- [ ] Users can rate features with thumbs up/down + tags
- [ ] Users can submit detailed feature ideas (3-step form)
- [ ] Users can view and vote on global ideas
- [ ] Admins can view aggregated feedback stats
- [ ] Admins can trigger AI estimation for ideas
- [ ] Admins can override estimates and update status
- [ ] Feedback nav link appears below Settings

**Design Compliance**:
- [ ] No new fonts, colors, or design elements
- [ ] Matches existing page layouts exactly
- [ ] Mobile responsive
- [ ] Same button/form styles as existing pages

---

## Epic H: Streamline Assessment Creation Flow (NEW - 30 pts)

**Goal**: Streamline the 3-step assessment creation flow to reduce cognitive load and improve UX.

**Detailed Spec**: [EPIC-H-STREAMLINE-ASSESSMENT-FLOW.md](./EPIC-H-STREAMLINE-ASSESSMENT-FLOW.md)

### Key Changes

**Step 1: Template & Audience (REDESIGN)**
- Show ONLY selected template (not all templates)
- Inline team selection (like hub modal, but inline)
- "Send to: My Teams / New Company" toggle (consultant only)
- Remove "Add Recipients" manual email input

**Step 2: Customize Questions (REDESIGN)**
- Left-right layout: Categories left, Questions right
- Collapsible category tree
- "+ Add Questions" shows only unselected questions

**Step 3: Review & Launch (ENHANCE)**
- Cart-style checkout with recipient list
- Checkbox to include/exclude recipients
- "Edit Teams" inline modal
- Remove email delivery option (in-app only for teams)

### User Stories

| ID | Title | Points | Priority |
|----|-------|--------|----------|
| H1 | Redesign Step 1 layout (left-right) | 5 | P0 |
| H2 | Add inline team selection | 3 | P0 |
| H3 | Add send-to toggle (consultant only) | 3 | P0 |
| H4 | Redesign Step 2 left-right layout | 5 | P0 |
| H5 | Update Add Questions modal | 2 | P0 |
| H6 | Redesign Step 3 as cart checkout | 5 | P0 |
| H7 | Add Edit Teams inline modal | 3 | P1 |
| H8 | Remove email delivery option | 2 | P1 |
| H9 | Update step navigation pills | 1 | P2 |
| H10 | Remove old recipients section | 1 | P0 |
| **Total** | | **30** | |

### Code Reuse Summary

| Component | Source | Reuse |
|-----------|--------|-------|
| Team Selection UI | `assessment-hub.html:257-335` | 100% |
| Team Selection JS | `assessment-hub.html:877-973` | 100% |
| Company Form | `assessment-hub.html:143-255` | 100% |
| Question Items | `assessment-step2-customize.html:369-379` | 100% |
| Template Summary | `assessment-review-launch.html:35-72` | 100% |

### Key Design Decisions

1. **Team selection required** in Step 1 (can't proceed without)
2. **Only CONSULTANT** sees "Send to Company" option
3. **No email option** for teams (in-app notification only)
4. **Edit Teams modal** is inline (not go back to Step 1)
5. **Backward compatible** draft structure

---

## Updated Sprint 8 Summary

| Epic | Points | Priority | Stories | Status |
|------|--------|----------|---------|--------|
| **Epic D**: Dashboard Task Management | 35 | P0 | 8 | Not Started |
| **Epic E**: Comprehensive SSI Reporting | 20 | P1 | 5 | Not Started |
| **Epic F**: Continue Planning Feature | 8 | P0 | 3 | ✅ Complete |
| **Epic G**: User Feedback System | 23 | P1 | 9 | ✅ Complete |
| **Epic H**: Streamline Assessment Flow | 30 | P0 | 10 | Planned |
| **Total** | **116** | | **35** | 31 pts done |

---

## Sprint 9 Epics (Next Sprint)

| Epic | Points | Sprint 9 ID |
|------|--------|-------------|
| Consultant Dashboard | 13 | Epic F |
| Weekly Goals Calendar | 13 | Epic G |

**See**: [SPRINT9_HANDOFF_DOCUMENT.md](../SPRINT-9/SPRINT9_HANDOFF_DOCUMENT.md)

## Deferred to Future Sprints

| Feature | Reason |
|---------|--------|
| Task Notifications | Future enhancement |
| Drag-and-drop reordering | Future enhancement |
| AI-powered report insights | Requires GPT integration |

---

---

## Session Notes

### Bug Fix Session (December 3, 2025)
**Duration**: ~1.5 hours
**Focus**: P0 Production Blockers
**Result**: All 5 bugs fixed, production verified working

**Bugs Fixed**:
1. **BUG-S8-1**: Executive Cannot Save Company Profile
   - Added EXECUTIVE to `requireRole()` middleware
2. **BUG-S8-2**: Role Standardization
   - Changed invited users to BUSINESS_OWNER
   - Hid EXECUTIVE from UI dropdowns
3. **BUG-S8-3**: Invitation Token Storage Key Mismatch
   - Fixed `token` → `karvia_auth_token`
4. **BUG-S8-4**: JWT Token Key Mismatch
   - Fixed camelCase → snake_case in JWT payload
5. **BUG-S8-5**: Company Settings Undefined Values
   - Filter merged object to remove undefined before Mongoose save

**Key Learning**: First fix for BUG-S8-5 only filtered incoming data. Existing database data also contained undefined values, requiring the final fix to filter the FINAL merged object.

### Epic F Session (December 2, 2025)
- Completed Sprint 7 handoff documentation
- Added Epic F (Continue Planning bug fix) to Sprint 8
- Implemented all 3 stories (8 pts)
- Successfully deployed to preprod

### Epic G Session (December 10, 2025)
**Duration**: ~2 hours
**Focus**: User Feedback System (23 pts)
**Result**: All 9 stories implemented

**Files Created**:
1. `server/models/Feedback.js` - Mongoose model with pulse/rating/idea types (~300 lines)
2. `server/routes/feedback.js` - Full API with user + admin endpoints (~550 lines)
3. `server/services/AIEstimator.js` - AI estimation service with OpenAI + fallback (~350 lines)
4. `client/pages/feedback.html` - User feedback page with pulse, ratings, ideas (~500 lines)
5. `client/pages/scripts/feedback.js` - Frontend logic for feedback page (~550 lines)
6. `client/pages/feedback-admin.html` - Admin dashboard page (~450 lines)
7. `client/pages/scripts/feedback-admin.js` - Admin dashboard logic (~450 lines)

**Files Modified**:
- `server/index.js` (+1 line) - Added feedback route
- `client/js/navigation.js` (+1 line) - Added Feedback link after Settings

**Features Implemented**:
- Weekly Pulse: Emoji-based sentiment with optional comment
- Feature Ratings: Thumbs up/down with improvement tags
- Multi-Step Idea Form: 3-step wizard for detailed idea submission
- Global Ideas Board: Cross-company visibility with voting
- AI Estimation: OpenAI-powered story point estimation with fallback
- Admin Dashboard: Stats, satisfaction bars, top issues, idea management
- Override & Status: Admin can override AI estimates and update status
- CSV Export: Export all feedback data

**API Endpoints Created**:
- GET `/api/feedback/pulse/latest` - User's current week pulse
- POST `/api/feedback/pulse` - Submit pulse
- GET `/api/feedback/features` - User's feature ratings
- POST `/api/feedback/features` - Submit feature rating
- GET `/api/feedback/ideas` - Global ideas list (paginated)
- POST `/api/feedback/ideas` - Submit new idea
- POST `/api/feedback/ideas/:id/vote` - Toggle vote
- GET `/api/feedback/admin/stats` - Aggregated statistics
- GET `/api/feedback/admin/ideas` - Admin ideas list
- POST `/api/feedback/admin/ideas/:id/estimate` - Trigger AI estimation
- PUT `/api/feedback/admin/ideas/:id` - Update status/override
- GET `/api/feedback/admin/export` - CSV export

### Next Session - Implementation Start
**Recommended First Task**: Epic D (Dashboard Task Management - 35 pts) or Epic E (SSI Reporting - 20 pts)

---

*Created: December 2, 2025*
*Updated: December 10, 2025 - Completed Epic G (User Feedback System - 23 pts)*
*Status: Epic F + Epic G Complete + All Bugs Fixed, Ready for Epic D/E*
