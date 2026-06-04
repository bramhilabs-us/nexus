# Sprint 11 Master Plan V2

**Sprint**: 11 - Assessment Hub + Question Library Redesign
**Created**: January 27, 2026
**Updated**: February 3, 2026 (V2.5 — 28 pts COMPLETE, 52 pts remaining)
**Total Points**: 80 pts (updated from 63)
**Status**: IN PROGRESS (35% complete)
**Pages Introduced**: Assessment Hub, Question Library (+ Teams page updates)
**Design Reference**: `sprint_mockups/sprint-13/assessment-hub.html`, `sprint_mockups/sprint-13/question-library.html`, `sprint_mockups/sprint-13/teams-redesign.html`

---

## Reorganization (V2)

| Change | Reason | Impact |
|--------|--------|--------|
| Moved Epic L (25pts) to Sprint 12 | Page-pairing: Planning page ships with Dashboard | -25 pts |
| Moved Epic Q1 (2pts) + Q2 (3pts) here | Critical auth fix ships first | +5 pts |
| Added Epic U5 (2pts), U3 (5pts), U4 (4pts) | Page redesigns for Assessment Hub, Question Library, Teams | +11 pts |
| Net change | From 90pts → 59pts | Balanced |

---

## Executive Summary

Sprint 11 delivers the **Assessment experience** — the two most interconnected pages (Assessment Hub + Question Library) plus the Teams page which feeds assessments. Every UI element must be **dynamically rendered from API data**. Zero hardcoded content.

### Core Principle: ZERO HARDCODING

Every piece of visible content must come from one of these sources:
1. **API response** — fetched via existing API clients
2. **User session** — from `localStorage.getItem('karvia_user')`
3. **Computed** — derived from API data (e.g., percentages, counts)
4. **Configuration** — from `/api/config` endpoints

**NEVER** hardcode: names, numbers, dates, statuses, counts, percentages, labels that represent data.

---

## Endpoint Reality Check (Post-Audit)

### Endpoints That ALREADY EXIST (Do NOT Rebuild)

| Endpoint | Status | Used By |
|----------|--------|---------|
| `GET /api/assessments/my-assessments` | **EXISTS** | U5 Tab 1: Assigned to Me |
| `GET /api/assessments/team/:company_id` | **EXISTS** | U5 Tab 4: Team Results (per-member scores) |
| `GET /api/invitations/sent-by-me` | **EXISTS** | U5 Tab 3: Sent by Me (batch-grouped with stats) |
| `GET /api/invitations/assigned-to-me` | **EXISTS** | Alternative for Tab 1 |
| `POST /api/invitations/create` | **EXISTS** | Launch assessment (J1-J4) |
| `POST /api/invitations/create-public-link` | **EXISTS** | Anonymous survey link (J6) — has `response_limit` |
| `GET /api/invitations/survey/:token` | **EXISTS** | Public survey metadata |
| `POST /api/invitations/survey/:token/start` | **EXISTS** | Start anonymous assessment |
| `POST /api/invitations/:id/deactivate` | **EXISTS** | Deactivate public link |
| `GET /api/assessment-questions` | **EXISTS** | Questions grouped by dimension (**NOTE: hyphenated route!**) |
| `GET /api/teams` | **EXISTS** | U4 Teams list |
| `GET /api/teams/:id` | **EXISTS** | U4 Team detail |
| `GET /api/auth/users` | **EXISTS** | Create modal user lists |

### New Endpoints to BUILD (Only 4)

| Endpoint | Epic | Description |
|----------|------|-------------|
| `GET /api/assessment-questions/dimensions` | U3 | Dimension/block hierarchy view |
| `GET /api/assessment-questions/modules` | U3, QA | Module type listing |
| `GET /api/assessment-questions/by-module` | U3, QA | Filter questions by module type |
| `GET /api/assessments/company-summary` | U5 | Compute avg SSI scores for KPI cards |

**Reduced from 13 assumed-new to 4 truly new endpoints.**

> **CRITICAL PATH FIX**: The route path is `/api/assessment-questions` (HYPHENATED), NOT `/api/assessmentQuestions`. All references in this plan use the correct hyphenated path.

---

## Architecture: Shared Infrastructure

### Existing Modules to REUSE (Do NOT recreate)

| Module | File | What It Provides |
|--------|------|-----------------|
| `KarviaCommon` | `client/js/common.js` | `apiRequest()`, `escapeHtml()`, `formatDate()`, `getInitials()`, `showToast()`, `showLoading()` |
| `NavigationManager` | `client/js/navigation.js` | Role-based nav, active page highlighting, user menu |
| `Toast` | `client/js/toast.js` | `Toast.success()`, `Toast.error()`, `Toast.warning()` |
| `AssessmentAPI` | `client/js/assessment-api-client.js` | `getTemplates()`, `launchAssessment()`, `submitResponses()`, `getResults()`, `getSentInvitations()`, `getTeamResults()`, `getMyAssessments()` |
| `TeamAPI` | `client/js/team-api-client.js` | `createTeam()`, `getTeams()`, `getTeam()`, `addMember()`, `removeMember()` |
| `CategoryIcons` | `client/js/category-icons.js` | MECE category icons/badges for 6 categories |
| `auth-check.js` | `client/js/auth-check.js` | Auto-fires `auth:ready` event with user object |

### New Shared Module: `s13-patterns.css`

Create ONE shared CSS file for all redesigned pages:

```css
/* /client/css/s13-patterns.css */
/* S13 Design System - Shared across all redesigned pages */

:root {
  --s13-max-width: 1200px;
  --s13-padding: 32px;
  --s13-radius: 12px;
  --s13-radius-sm: 8px;
  --s13-border: #E5E7EB;
  --s13-bg: #FAFAFA;
  --s13-card-bg: white;

  /* Philosophy colors */
  --philosophy-play: #8B5CF6;
  --philosophy-assess: #3B82F6;
  --philosophy-align: #22c55e;
  --philosophy-plan: #F59E0B;

  /* Status colors */
  --status-success: #22c55e;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
  --status-info: #3B82F6;
  --status-neutral: #9CA3AF;

  /* Brand gradient */
  --brand-gradient: linear-gradient(135deg, #1e3a5f, #2d5a87);
}

/* ===== Loading State Pattern ===== */
.s13-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--status-neutral);
}
.s13-loading .spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--s13-border);
  border-top-color: var(--status-info);
  border-radius: 50%;
  animation: s13-spin 0.8s linear infinite;
}
@keyframes s13-spin { to { transform: rotate(360deg); } }

/* ===== Error State Pattern ===== */
.s13-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: var(--status-error);
  gap: 12px;
}
.s13-error .error-icon { font-size: 32px; }
.s13-error .retry-btn {
  padding: 8px 16px;
  border-radius: var(--s13-radius-sm);
  background: var(--status-info);
  color: white;
  border: none;
  cursor: pointer;
}

/* ===== Empty State Pattern ===== */
.s13-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: var(--status-neutral);
  gap: 8px;
}
```

**Rule**: Do NOT create new utility functions that duplicate `common.js`. Do NOT create new API clients for endpoints that existing clients cover.

### Standard Page Template

Every redesigned page MUST follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KARVIA Pro - [Page Name]</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="/css/s13-patterns.css" rel="stylesheet">
  <style>/* Page-specific styles ONLY — no duplicating shared patterns */</style>
</head>
<body style="font-family: 'Inter', sans-serif; background: var(--s13-bg);">
  <!-- Navigation (populated by NavigationManager) -->
  <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
    <div id="main-navigation"></div>
  </nav>

  <!-- Main Content -->
  <div style="max-width: var(--s13-max-width); margin: 0 auto; padding: var(--s13-padding);">
    <!-- Loading State (use s13-loading class) -->
    <div id="loading-state" class="s13-loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
    <!-- Error State (use s13-error class) -->
    <div id="error-state" class="s13-error" style="display:none;">
      <div class="error-icon">⚠</div>
      <p class="error-message">Something went wrong.</p>
      <button class="retry-btn" onclick="initializePage()">Retry</button>
    </div>
    <!-- Empty State (use s13-empty class) -->
    <div id="empty-state" class="s13-empty" style="display:none;"></div>
    <!-- Content (populated by JS) -->
    <div id="page-content" style="display:none;">
      <!-- ALL content rendered dynamically by page controller -->
    </div>
  </div>

  <!-- Scripts: Auth → Shared → API Client → Page Controller -->
  <script src="/js/auth-check.js"></script>
  <script src="/js/common.js"></script>
  <script src="/js/navigation.js"></script>
  <script src="/js/toast.js"></script>
  <script src="/js/[relevant-api-client].js"></script>
  <script src="/pages/scripts/[page-controller].js"></script>
</body>
</html>
```

### Standard Page Controller Pattern

```javascript
// /client/pages/scripts/[page-name].js
'use strict';

// ============================================
// STATE (no hardcoded data — all from API)
// ============================================
let currentUser = null;
let pageData = {};    // Populated from API
let filters = {};     // User-selected filters

// ============================================
// INITIALIZATION
// ============================================
window.addEventListener('auth:ready', ({ detail: { user } }) => {
  currentUser = user;
  initializePage();
});

async function initializePage() {
  try {
    showLoadingState();
    hideErrorState();
    await loadData();
    renderPage();
    hideLoadingState();
    showContent();
  } catch (error) {
    console.error('[PageName] Init error:', error);
    window.Toast.error('Failed to load page data');
    hideLoadingState();
    showErrorState('Failed to load. Please refresh.');
  }
}

// ============================================
// DATA LOADING (API calls — NEVER hardcode)
// ============================================
async function loadData() {
  // Fetch ALL data from APIs
  // Example: pageData.items = await SomeAPI.getItems();
}

// ============================================
// RENDERING (all content from pageData)
// ============================================
function renderPage() {
  // Generate HTML from pageData
  // Use escapeHtml() for all user-provided text
  // Use formatDate() for all dates
  // Use getInitials() for avatar text
}

// ============================================
// UI STATE MANAGEMENT
// ============================================
function showLoadingState() { document.getElementById('loading-state').style.display = ''; }
function hideLoadingState() { document.getElementById('loading-state').style.display = 'none'; }
function showContent() { document.getElementById('page-content').style.display = ''; }
function showErrorState(msg) {
  const el = document.getElementById('error-state');
  el.querySelector('.error-message').textContent = msg;
  el.style.display = '';
}
function hideErrorState() { document.getElementById('error-state').style.display = 'none'; }
function showEmptyState(msg) {
  document.getElementById('empty-state').textContent = msg;
  document.getElementById('empty-state').style.display = '';
}
```

---

## Epic Overview

| Epic | Points | Priority | Status | Description |
|------|--------|----------|--------|-------------|
| Q1 | 2 | P0-CRITICAL | ✅ COMPLETE | Auth token standardization + security fix |
| Q2 | 3 | P0-CRITICAL | ✅ COMPLETE | Input validation hardening |
| C0 | 4 | P0 | ✅ COMPLETE | Consultant multi-company foundation (bug fix + switch endpoint + nav switcher + assessment exclude/restore) |
| BF | 5 | P1 | ✅ COMPLETE | Architecture audit bug fixes (Jan 28 audit — teams auth, XSS, response format, debug logging) |
| U5a | 5 | P0 | ✅ COMPLETE | Assessment Hub Core - S13 layout, KPI row, role-adaptive tabs |
| U5b | 9 | P0 | ✅ COMPLETE | My Clients CONSULTANT - Portfolio, drill-down, exclude/restore |
| **Completed** | **28** | | ✅ | **35% of sprint** |
| QA | 13 | P0 | ⏳ NEXT | Assessment Quality — modular questions, industry/role modules |
| U3 | 5 | P0 | 📋 PENDING | Question Library page redesign (S13 layout) |
| J | 28 | P1 | 📋 PENDING | Assessment flow improvements — templates, wizard, 3-step creation |
| U4 | 4 | P0 | 📋 PENDING | Teams page redesign (S13 layout) |
| Quickfix | 2 | P0 | 📋 PENDING | Existing bug fixes |
| **Remaining** | **52** | | | |
| **Total** | **80** | | | |

---

## Epic U5: Assessment Hub Page Redesign (2 pts)

### Problem
Current assessment-hub.html uses legacy layout. S13 mockup shows KPI header, 4-tab design, sent-by-me tracking table — all hardcoded in mockup.

### Solution
Rebuild assessment-hub.html using S13 layout with 100% dynamic content. **Role-adaptive tab structure**: CONSULTANT sees 4 tabs (My Clients with drill-down replaces Team Results), non-consultant sees 4 tabs (standard).

### Tab Structure (Finalized — V2.4)

**CONSULTANT (4 tabs)**:

| Tab | Label | Scope | Data Source | Description |
|-----|-------|-------|-------------|-------------|
| 1 | My Clients | Cross-company | `GET /api/companies` (filtered by `managed_businesses`) | Portfolio overview with per-company SSI summary. **Click a company card → drill-down into that company's diagnostic view** (team + anonymous results, exclude/restore). |
| 2 | Assigned to Me | Cross-company | `GET /api/assessments/my-assessments` | Assessments assigned to the consultant across all managed companies |
| 3 | My Templates | Cross-company | `GET /api/assessmentTemplates` | Templates created by consultant. **Override**: filter by `created_by` instead of `company_id` |
| 4 | Sent by Me | Per-company (with filter) | `GET /api/invitations/sent-by-me` | **Company filter dropdown** at top — consultant picks which client's invitations to view |

**Non-consultant (4 tabs)**:

| Tab | Label | Scope | Data Source | Description |
|-----|-------|-------|-------------|-------------|
| 1 | Assigned to Me | Auto-scoped | `GET /api/assessments/my-assessments` | Assessments assigned to current user |
| 2 | My Templates | Auto-scoped | `GET /api/assessmentTemplates` | Templates for current company |
| 3 | Sent by Me | Auto-scoped | `GET /api/invitations/sent-by-me` | Invitations sent by current user |
| 4 | Team Results | Auto-scoped | `GET /api/assessments/team/:company_id` + `/anonymous` | Combined diagnostic view (team + anonymous), no exclude/restore |

**Tab rendering logic**:
```javascript
const tabs = [];
if (currentUser.role === 'CONSULTANT') {
  tabs.push(
    { id: 'my-clients', label: 'My Clients', icon: 'briefcase' },
    { id: 'assigned-to-me', label: 'Assigned to Me', icon: 'clipboard' },
    { id: 'my-templates', label: 'My Templates', icon: 'file-text' },
    { id: 'sent-by-me', label: 'Sent by Me', icon: 'send' }
  );
} else {
  tabs.push(
    { id: 'assigned-to-me', label: 'Assigned to Me', icon: 'clipboard' },
    { id: 'my-templates', label: 'My Templates', icon: 'file-text' },
    { id: 'sent-by-me', label: 'Sent by Me', icon: 'send' },
    { id: 'team-results', label: 'Team Results', icon: 'bar-chart' }
  );
}
```

### Tab 1 (CONSULTANT): My Clients — Portfolio + Drill-Down

**Portfolio view** (default):

Displays a card per managed company:
- Company name, industry
- Latest SSI score ring (from `GET /api/assessments/latest-scores` per company)
- Assessment count, team count
- Click card → enters **drill-down view** for that company

**Drill-down view** (after clicking a company card):

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back to All Clients        AirProducts                     │
├──────────────────────────────────────────────────────────────┤
│ [Diagnostic]  [Sent Assessments]  [Teams]                    │
│                                                              │
│ Source Filter: [All ▼] [Team Surveys] [Anonymous Surveys]    │
│                                                              │
│ ┌─ Response List ──────────────────────────────────────────┐ │
│ │ #  Source       Respondent    Date        Score   Action  │ │
│ │ 1  Team Survey  John D.      Jan 15      78%    [Excl.]  │ │
│ │ 2  Team Survey  Jane S.      Jan 14      82%    [Excl.]  │ │
│ │ 3  Anonymous    —            Jan 13      45%    [Excl.]  │ │
│ │ 4  Anonymous    —            Jan 12      91%    [Excl.]  │ │
│ │ 5  Team Survey  (excluded)   Jan 11      —      [Rest.]  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Aggregate SSI: 74% (auto-recalculated, excludes excluded)    │
│ Speed: 71%  |  Strength: 76%  |  Intelligence: 75%          │
└──────────────────────────────────────────────────────────────┘
```

**Drill-down behavior**:
- Clicking a company card calls `PUT /api/users/switch-company` to set context
- "Back to All Clients" returns to portfolio view (no company switch needed)
- **Diagnostic sub-tab**: Team + anonymous results with exclude/restore (same as non-consultant Team Results)
- **Sent Assessments sub-tab**: Invitations sent to this company (future scope — Sprint 11 ships Diagnostic only)
- **Teams sub-tab**: Teams for this company (future scope)
- **Exclude button**: Calls `PUT /api/assessments/:id/exclude` (CONSULTANT only)
- **Restore button**: Calls `PUT /api/assessments/:id/restore` (CONSULTANT only)
- **Auto-recalculate**: After exclude/restore, re-fetch `latest-scores` to update aggregate display
- **Source labels**: Each row shows "Team Survey" or "Anonymous Survey" based on assessment type

### Tab 4 (Non-consultant): Team Results — Diagnostic View

Same diagnostic table as the consultant drill-down, but:
- Auto-scoped to the user's company (no company picker needed)
- No Exclude/Restore action column
- No sub-tabs (just the diagnostic view directly)

### Mockup Reference
`sprint_mockups/sprint-13/assessment-hub.html`

### API Data Sources (Every UI Element)

| UI Element | API Source | Endpoint | Notes |
|-----------|-----------|----------|-------|
| KPI: Total Assessments | Count from API | `GET /api/assessments?company_id=X` | `.length` of response |
| KPI: Active | Filter by status | `GET /api/assessments?status=active` | Count active |
| KPI: Avg Score | Compute from results | `GET /api/assessments/company-summary` | **BUILD NEW** — avg of all scores |
| KPI: Pending | Filter by status | `GET /api/invitations?status=pending` | Count pending |
| Tab: My Clients (CONSULTANT) | Managed companies | `GET /api/companies` filtered by `managed_businesses` | Portfolio cards with SSI. Drill-down → diagnostic view |
| My Clients drill-down | Team + anonymous scores | `GET /api/assessments/team/:company_id` + `/anonymous` | **(ALREADY EXISTS)** — combined diagnostic with exclude/restore |
| Tab: Assigned to Me | User's assessments | `GET /api/assessments/my-assessments` | **(ALREADY EXISTS)** |
| Tab: My Templates | Template list | `GET /api/assessmentTemplates` | Via `AssessmentAPI.getTemplates()`. **CONSULTANT**: filter by `created_by` not `company_id` |
| Tab: Sent by Me | Sent invitations | `GET /api/invitations/sent-by-me` | **(ALREADY EXISTS)** — CONSULTANT gets company filter dropdown |
| Tab: Team Results (non-consultant) | Team + anonymous scores | `GET /api/assessments/team/:company_id` + `/anonymous` | **(ALREADY EXISTS)** — auto-scoped, no exclude/restore |
| User name in nav | Session | `localStorage.getItem('karvia_user')` | Parse JSON → `.name` |
| User initials | Computed | `getInitials(user.name)` | From `common.js` |
| Page Header Button: "Send Assessment" | Triggers wizard | Opens J1 wizard modal | **Cross-Epic Dependency**: This button triggers Epic J's 3-step wizard |

### Rendering Rules

```
RULE 1: KPI cards → render from computed counts, NEVER hardcode "12", "3", "85%"
RULE 2: Template cards → loop over API response, NEVER hardcode template names
RULE 3: Sent-by-me table → render rows from API data with escapeHtml() on all text
RULE 4: Score rings → SVG stroke-dashoffset calculated from actual score percentage
RULE 5: Empty tabs → show empty state message (s13-empty class), not hidden/hardcoded fallback
RULE 6: Tab counts in tab labels → computed from data.length, shown as "(3)" badge
RULE 7: CONSULTANT gets 4 tabs (My Clients, Assigned, Templates, Sent). Non-consultant gets 4 tabs (Assigned, Templates, Sent, Team Results)
RULE 8: My Clients drill-down → combined diagnostic from team + anonymous sources, with source labels
RULE 9: Exclude/Restore buttons → only rendered inside My Clients drill-down (CONSULTANT only)
RULE 10: Sent by Me (CONSULTANT) → company filter dropdown at top to pick which client's invitations
RULE 11: Team Results tab → only rendered for non-consultant roles (auto-scoped, no exclude/restore)
```

### SVG Score Ring Calculation (Dynamic)

```javascript
// NEVER hardcode stroke-dashoffset values
function renderScoreRing(score, maxScore = 100) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius; // 125.66
  const percentage = (score / maxScore) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return `
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="${radius}" fill="none" stroke="#F3F4F6" stroke-width="4"/>
      <circle cx="24" cy="24" r="${radius}" fill="none"
        stroke="${getScoreColor(percentage)}" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
        transform="rotate(-90 24 24)"/>
    </svg>
    <span class="pct">${Math.round(percentage)}%</span>
  `;
}

function getScoreColor(pct) {
  if (pct >= 70) return 'var(--status-success)';  // #22c55e
  if (pct >= 40) return 'var(--status-warning)';   // #F59E0B
  return 'var(--status-error)';                     // #EF4444
}
```

### Files to Modify

| File | Action | Details |
|------|--------|---------|
| `client/pages/assessment-hub.html` | REWRITE | S13 layout, role-adaptive 4-tab structure (CONSULTANT: My Clients w/ drill-down; non-consultant: Team Results), all dynamic |
| `client/pages/scripts/assessment-hub.js` | CREATE/REWRITE | Page controller following standard pattern |
| `client/js/assessment-api-client.js` | EXTEND | Add `getCompanySummary()` method (calls new endpoint) |
| `client/css/s13-patterns.css` | CREATE | Shared design tokens + loading/error/empty patterns |

### DO NOT

- ❌ Create a new API client — extend existing `AssessmentAPI`
- ❌ Hardcode template names, scores, user names, dates
- ❌ Duplicate navigation HTML — use `NavigationManager`
- ❌ Duplicate utility functions — use `common.js`
- ❌ Create page-specific toast system — use `window.Toast`
- ❌ Inline CSS that belongs in `s13-patterns.css`

---

## Epic U3: Question Library Page Redesign (5 pts)

### Problem
Question library needs two-panel layout (dimension tree sidebar + question list), 3-step wizard for template creation, module tabs (Core/Industry/Role). All hardcoded in mockup.

### Mockup Reference
`sprint_mockups/sprint-13/question-library.html`

### API Data Sources

| UI Element | API Source | Endpoint |
|-----------|-----------|----------|
| Dimension tree (sidebar) | Question categories | `GET /api/assessment-questions/dimensions` **(BUILD NEW)** |
| Block list under each dimension | Blocks within dimension | Nested in dimensions response |
| Question count per block | Computed | Count questions per `block_id` |
| Question list (main panel) | Questions filtered by block | `GET /api/assessment-questions/by-module?block=X&module=Y` **(BUILD NEW)** |
| Module tabs (Core/Industry/Role) | Module types | `GET /api/assessment-questions/modules` **(BUILD NEW)** |
| Search filter | Client-side | Filter loaded questions in-memory by `question.text.includes(query)` |
| Template wizard step 1 selections | User state | In-memory selection array |
| Template wizard step 2 config | User input | Form fields → POST payload |
| Template wizard step 3 review | Computed | Selected questions summary |
| Footer bar: block coverage | Computed | Covered blocks / total blocks |
| Question text | API data | `question.text` — render with `escapeHtml()` |
| Question metadata (category, weight) | API data | `question.category`, `question.weight` |

### Client-Side Search (Audit Fix #14)

```javascript
// Search is CLIENT-SIDE ONLY — no API call needed
// Filter the already-loaded questions array in memory
function filterQuestions(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return pageData.questions; // show all
  return pageData.questions.filter(q =>
    q.text.toLowerCase().includes(term) ||
    q.dimension.toLowerCase().includes(term) ||
    q.block.toLowerCase().includes(term)
  );
}
```

### 12-Block MECE Framework (from API, NOT hardcoded)

```
The 12 blocks MUST come from the API response, not hardcoded in HTML.
Current 12-block structure:
  Speed:        Delivery, Decisions, Change, Response
  Strength:     Financial, Operations, People, Quality
  Intelligence: Market, Data, Strategy, Learning

But if the API returns different blocks, the UI must render those.
```

### Rendering Rules

```
RULE 1: Dimension tree → built from API response hierarchy, NOT hardcoded HTML nodes
RULE 2: Question checkboxes → rendered from question array, each with question._id as value
RULE 3: Module tabs → rendered from modules array, NOT hardcoded "Core", "Industry", "Role"
RULE 4: Block coverage badge → computed: selectedBlocks.size / totalBlocks * 100
RULE 5: Wizard steps → state machine (step 1 → 2 → 3), validated before progression
RULE 6: Template save → POST /api/assessmentTemplates with selected question IDs
RULE 7: Empty states → shown when no questions match current filter (use s13-empty class)
RULE 8: Search → client-side filter, debounced 300ms, no API call
```

### Wizard Steps 2-3 Wireframes (Audit Fix #11)

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: CONFIGURE TEMPLATE                                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Template Name:  [________________________]                    │
│ Description:    [________________________]                    │
│                 [________________________]                    │
│                                                               │
│ Scoring:                                                      │
│   ○ Standard (1-5 Likert)                                     │
│   ○ Weighted (use question weights)                           │
│                                                               │
│ Distribution:                                                 │
│   ☑ Team-based (select teams)                                 │
│   ☐ Individual (select users)                                 │
│   ☐ Anonymous link                                            │
│                                                               │
│ Time Limit:                                                   │
│   [7 days ▼]                                                  │
│                                                               │
│               [← Back]  [Next: Review →]                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STEP 3: REVIEW & LAUNCH                                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│ Template: "Q1 Speed Assessment"                               │
│ Questions: 18 selected (8/12 blocks covered)                  │
│ Scoring: Weighted                                             │
│ Distribution: 3 teams (24 members)                            │
│ Time Limit: 7 days                                            │
│                                                               │
│ ┌─ Selected Questions Preview ────────────────────────────┐   │
│ │ Speed > Delivery: 4 questions                           │   │
│ │ Speed > Decisions: 3 questions                          │   │
│ │ Strength > Operations: 5 questions                      │   │
│ │ ... (expandable)                                        │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                               │
│ ⚠ Coverage: 8/12 blocks — 4 blocks have no questions          │
│                                                               │
│               [← Back]  [🚀 Launch Assessment]                │
└──────────────────────────────────────────────────────────────┘
```

### Two-Panel Layout Pattern

```
┌──────────────────────────────────────────────────────┐
│ [Page Header: Question Library]  [🔍 Search] [Create]│
├────────────┬─────────────────────────────────────────┤
│ SIDEBAR    │ MAIN PANEL                              │
│ (280px)    │                                         │
│            │ [Module Tabs: Core | Industry | Role]    │
│ Dimensions │                                         │
│ ├─ Speed   │ ┌─ Question Card ──────────────────┐   │
│ │ ├─Block1 │ │ ☐ Question text (from API)       │   │
│ │ ├─Block2 │ │   Category: X | Weight: Y        │   │
│ │ └─Block3 │ └──────────────────────────────────┘   │
│ ├─ Strength│                                         │
│ └─ Intel.  │ [More question cards from API...]       │
│            │                                         │
│ Block count│ ┌─ Footer Bar ─────────────────────┐   │
│ badges are │ │ Coverage: 8/12 blocks | [Save]    │   │
│ COMPUTED   │ └──────────────────────────────────┘   │
└────────────┴─────────────────────────────────────────┘
```

### Files to Modify

| File | Action | Details |
|------|--------|---------|
| `client/pages/question-library.html` | REWRITE | Two-panel S13 layout |
| `client/pages/scripts/question-library.js` | CREATE/REWRITE | Controller with dimension tree, filters, wizard, client-side search |
| `client/js/assessment-api-client.js` | EXTEND | Add `getDimensions()`, `getModules()`, `getByModule()` |
| `server/routes/assessment-questions.js` | EXTEND | Add `/dimensions`, `/modules`, `/by-module` endpoints (**3 new endpoints**) |

### DO NOT

- ❌ Hardcode dimension names (Speed, Strength, Intelligence) in HTML
- ❌ Hardcode block names in sidebar — render from API
- ❌ Hardcode question text — render from API with `escapeHtml()`
- ❌ Hardcode module tab labels — render from API
- ❌ Create separate CSS file — use `s13-patterns.css` + inline overrides
- ❌ Duplicate two-panel layout CSS if already in `s13-patterns.css`
- ❌ Create server-side search endpoint — use client-side filtering

---

## Epic U4: Teams Page Redesign (4 pts)

### Mockup Reference
`sprint_mockups/sprint-13/teams-redesign.html`

### API Data Sources

| UI Element | API Source | Endpoint |
|-----------|-----------|----------|
| Stats row (Total Teams, Members, Avg Size, Assessments) | Computed from teams | `GET /api/teams` + compute |
| Team cards | Teams list | `GET /api/teams` **(ALREADY EXISTS)** |
| Team name, department | Team object | `team.name`, `team.department` |
| Manager name/avatar | Team members | `team.manager` populated |
| Member count | Computed | `team.members.length` |
| OKR Progress | Computed | `team.okr_progress` or computed from objectives |
| Filter chips (department names) | Computed | Unique departments from teams array |
| Detail panel: member list | Team detail | `GET /api/teams/:teamId` **(ALREADY EXISTS)** |
| Detail panel: pending invitations | Invitations | `GET /api/invitations?team_id=X&status=pending` **(ALREADY EXISTS)** |
| Create modal: manager dropdown | Users by role | `GET /api/auth/users?role=MANAGER,EXECUTIVE,BUSINESS_OWNER` |
| Create modal: member checkboxes | All users | `GET /api/auth/users` |

### Edit & Delete Team Flows (Audit Fix #1 Cross-Cutting)

```
EDIT TEAM:
1. Click edit icon on team card → opens pre-filled modal (same form as Create, populated from GET /api/teams/:id)
2. PUT /api/teams/:id with updated fields (name, department, manager, members)
3. On success → Toast.success(), re-render card
4. Role-gated: MANAGER+ only

DELETE TEAM:
1. Click delete icon → confirmation dialog: "Delete team '{team.name}'? This cannot be undone."
2. Require typing team name to confirm (prevents accidental deletion)
3. DELETE /api/teams/:id (soft delete via status change)
4. On success → Toast.success(), remove card from grid
5. Role-gated: BUSINESS_OWNER+ only
```

### Rendering Rules

```
RULE 1: Stat cards → computed from teams API response, NEVER hardcode "5", "32", "6.4"
RULE 2: Team cards → loop over teams array, render each dynamically
RULE 3: Filter chips → derived from unique team.department values, not hardcoded
RULE 4: Manager avatars → getInitials(manager.name), not hardcoded "SM"
RULE 5: Progress bars → width from team.okr_progress percentage
RULE 6: Create modal → manager dropdown populated from users API
RULE 7: Detail panel → loaded on team card click via GET /api/teams/:id
RULE 8: Role-gated buttons → check currentUser.role before rendering Create/Edit/Delete
RULE 9: Edit modal → pre-populated from team data, same form as Create
RULE 10: Delete → confirmation dialog with team name verification
```

### Files to Modify

| File | Action | Details |
|------|--------|---------|
| `client/pages/teams.html` | REWRITE | S13 layout with stats, grid, detail panel |
| `client/pages/scripts/teams.js` | REWRITE | Dynamic rendering, detail panel, create/edit/delete modals |
| `client/js/team-api-client.js` | VERIFY | Ensure `updateTeam()`, `deleteTeam()` methods exist |

---

## Epic QA: Assessment Quality (13 pts)

### Stories

| ID | Story | Points | Description |
|----|-------|--------|-------------|
| QA1 | Modular question architecture | 5 | Core (24q) + Industry (6q) + Role (8q) question modules |
| QA2 | Industry-specific question sets | 3 | Load questions based on company.industry |
| QA3 | Role-specific question overlays | 3 | Additional questions based on respondent role |
| QA4 | Question weight calibration | 2 | Adjustable weights per question within blocks |

### Day 1 Migration Step (Audit Fix #9)

Before any QA epic work, run a migration to backfill existing questions:

```javascript
// migration: backfill-module-type.js
// Run on Sprint 11 Day 1 BEFORE any QA work

const result = await AssessmentQuestion.updateMany(
  { module_type: { $exists: false } },
  { $set: { module_type: 'core' } }
);
console.log(`Migrated ${result.modifiedCount} questions to module_type: 'core'`);
```

This ensures all existing questions are tagged as `core` before industry/role modules are added.

### API Data Sources

| Feature | Endpoint | Dynamic Data |
|---------|----------|-------------|
| Core questions | `GET /api/assessment-questions/by-module?module=core` | 24 questions from DB |
| Industry questions | `GET /api/assessment-questions/by-module?module=industry&industry=X` | 6 questions matched to company |
| Role questions | `GET /api/assessment-questions/by-module?module=role&role=X` | 8 questions matched to role |
| Question weights | `GET /api/assessment-questions/:id` | `question.weight` field |
| Company industry | `GET /api/companies/:id` | `company.industry` |

### Backend Changes

```javascript
// server/routes/assessment-questions.js — EXTEND existing route
// NOTE: Route file is assessment-questions.js (HYPHENATED), mounted at /api/assessment-questions

// NEW: Get questions by module type
router.get('/by-module', authenticateToken, async (req, res) => {
  const { module, industry, role } = req.query;
  const query = { company_id: req.user.company_id };

  if (module) query.module_type = module;  // 'core', 'industry', 'role'
  if (industry) query.industry = industry;
  if (role) query.target_role = role;

  const questions = await AssessmentQuestion.find(query)
    .sort({ dimension: 1, block: 1, order: 1 });

  res.json({ success: true, data: questions });
});

// NEW: Get dimension/block hierarchy
router.get('/dimensions', authenticateToken, async (req, res) => {
  const questions = await AssessmentQuestion.find({
    company_id: req.user.company_id
  }).distinct('dimension');

  // Build hierarchy from actual data
  const hierarchy = buildDimensionHierarchy(questions);
  res.json({ success: true, data: hierarchy });
});

// NEW: Get available module types
router.get('/modules', authenticateToken, async (req, res) => {
  const modules = await AssessmentQuestion.find({
    company_id: req.user.company_id
  }).distinct('module_type');

  res.json({ success: true, data: modules });
});
```

### Model Changes

```javascript
// server/models/AssessmentQuestion.js — ADD fields if missing
module_type: { type: String, enum: ['core', 'industry', 'role'], default: 'core' },
industry: { type: String },        // Only for industry module questions
target_role: { type: String },      // Only for role module questions
weight: { type: Number, default: 1, min: 0.1, max: 5 },
```

---

## Epic J: Assessment Flow Improvements (28 pts)

### Stories

| ID | Story | Points | Description |
|----|-------|--------|-------------|
| J1 | 3-step creation wizard | 8 | Select Template → Configure Audience → Review & Launch |
| J2 | Template selection UI | 5 | Card-based template picker with preview |
| J3 | Audience configuration | 5 | Teams / Email / Secure Link distribution methods |
| J4 | Review & launch screen | 3 | Summary of all selections before launch |
| J5 | Sent-by-me tracking enhancement | 4 | Stats per invitation (completed, pending, expired) |
| J6 | Anonymous survey support | 3 | Secure link generation, response without auth |

### Cross-Epic Dependency (Audit Fix #10)

> **U5 → J**: The "Send Assessment" button in U5's page header triggers J1's 3-step wizard. Implement the wizard as a modal overlay so it can be launched from the Assessment Hub without navigation.

### API Data Sources

| Feature | Endpoint | Dynamic Data |
|---------|----------|-------------|
| Template list | `GET /api/assessmentTemplates` | Template cards (name, description, question count) |
| Template preview | `GET /api/assessmentTemplates/:id` | Full template with questions |
| Team list for audience | `GET /api/teams` | Via existing `TeamAPI.getTeams()` |
| User list for email | `GET /api/auth/users` | Name, email, role |
| Launch assessment | `POST /api/invitations/create` | **(ALREADY EXISTS)** |
| Sent-by-me data | `GET /api/invitations/sent-by-me` | **(ALREADY EXISTS)** — batch-grouped with completion stats |
| Secure link generation | `POST /api/invitations/create-public-link` | **(ALREADY EXISTS)** — has `response_limit` |
| Survey metadata | `GET /api/invitations/survey/:token` | **(ALREADY EXISTS)** — public endpoint |
| Start anonymous | `POST /api/invitations/survey/:token/start` | **(ALREADY EXISTS)** |

### Anonymous Survey Security (Audit Fix #13)

```
EXISTING PROTECTIONS (in create-public-link endpoint):
- response_limit: configurable max responses per link
- deactivation: POST /api/invitations/:id/deactivate

ADDITIONAL PROTECTIONS TO ADD:
- Rate limiting: max 5 survey starts per IP per hour (add to route middleware)
- Link expiry: add expires_at field (default 30 days) to public link document
- CAPTCHA: Optional — add if abuse detected post-launch (NOT in Sprint 11 scope)

Implementation:
  router.post('/create-public-link', authenticateToken, rateLimiter({ max: 10, window: '1h' }), ...)
  router.post('/survey/:token/start', rateLimiter({ max: 5, window: '1h' }), ...)
```

### Rendering Rules

```
RULE 1: Template cards → rendered from API, not hardcoded
RULE 2: Team selection → reuse existing team-selection.js module
RULE 3: Wizard state → managed in JS, not with separate HTML pages
RULE 4: Sent-by-me table → all rows from API with escapeHtml()
RULE 5: Stats (completed %, pending) → computed from invitation data
RULE 6: Secure links → generated server-side, displayed as copyable URL
RULE 7: Wizard launched as modal overlay from U5 header button
```

---

## Epic Q1: Auth Token Standardization (2 pts) — CRITICAL

### Problem
Codebase uses 3 different localStorage keys: `karvia_auth_token`, `karvia_token`, `token`.

### Solution
Standardize ALL new code to `karvia_auth_token`. Add migration shim.

### Implementation

```javascript
// In auth-check.js — ADD migration at top
(function migrateTokenKey() {
  const legacy1 = localStorage.getItem('karvia_token');
  const legacy2 = localStorage.getItem('token');
  const current = localStorage.getItem('karvia_auth_token');

  if (!current && (legacy1 || legacy2)) {
    localStorage.setItem('karvia_auth_token', legacy1 || legacy2);
    // Don't remove legacy keys yet — gradual migration
  }
})();
```

### Files to Modify

| File | Change |
|------|--------|
| `client/js/auth-check.js` | Add migration shim |
| `client/js/common.js` | Ensure `getAuthToken()` checks `karvia_auth_token` first |
| All new page controllers | Use `karvia_auth_token` exclusively |

---

## Epic Q2: Input Validation Hardening (3 pts)

### Implementation
Add server-side validation for all assessment-related inputs:

```javascript
// server/middleware/validate.js — EXTEND existing
const validateAssessmentInput = (req, res, next) => {
  const { title, template_id, recipients } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Title must be at least 3 characters' });
  }
  if (title.length > 200) {
    return res.status(400).json({ success: false, error: 'Title must be under 200 characters' });
  }
  if (!template_id || !mongoose.Types.ObjectId.isValid(template_id)) {
    return res.status(400).json({ success: false, error: 'Valid template_id required' });
  }
  // Sanitize HTML from title
  req.body.title = sanitizeHtml(req.body.title);
  next();
};
```

---

## Epic Quickfix: Bug Fixes (2 pts)

Existing tracked bugs to resolve. Specific items TBD from issue tracker.

---

## Epic C0: Consultant Multi-Company Foundation (4 pts) — NEW

### Problem

The CONSULTANT role has `managed_businesses`, `current_company_id`, and `companies[]` fields on the User model, but the plumbing to actually use them is broken or missing:

1. **Bug**: `POST /api/companies` writes to `managed_companies` (doesn't exist) instead of `managed_businesses`
2. **Gap**: JWT token doesn't include `managed_businesses`, so auth middleware can't check it
3. **Gap**: No endpoint to switch `current_company_id` after login
4. **Gap**: Auth middleware doesn't use `current_company_id` to override `company_id` for consultants
5. **Gap**: No frontend company switcher UI

### Scope

**4 backend fixes (~22 lines) + 1 frontend component (~80 lines) + 2 assessment response management endpoints (~30 lines)**

Zero data model changes. Zero new models. Uses only existing schema fields.

### Stories

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| C0-1 | Fix `managed_companies` → `managed_businesses` typo in `POST /api/companies` | 0 | P0-CRITICAL (bug) |
| C0-2 | Add `managed_businesses` to JWT token payload in `server/routes/auth.js` | 0.5 | P0 |
| C0-3 | Add `PUT /api/users/switch-company` endpoint — validates company is in `managed_businesses`, updates `current_company_id`, returns updated user | 1 | P0 |
| C0-4 | Update auth middleware — for CONSULTANT role, use `current_company_id` as `req.user.company_id` when set | 0.5 | P0 |
| C0-5 | Add company switcher dropdown to navigation bar (frontend) — shows `managed_businesses` list, calls switch endpoint, reloads page | 1 | P1 |
| C0-6 | Add `PUT /api/assessments/:id/exclude` and `PUT /api/assessments/:id/restore` endpoints — soft-exclude/restore individual assessment responses, CONSULTANT only | 0.5 | P1 |
| C0-7 | Update aggregation queries to filter `status: 'excluded'` responses — SSI auto-recalculates on next request | 0.5 | P1 |

### Technical Specification

#### C0-1: Bug Fix (1 line)

**File**: `server/routes/companies.js` (~line 392)
```javascript
// BEFORE (bug):
req.user.managed_companies.push(company._id);

// AFTER (fix):
req.user.managed_businesses.push(company._id);
```

#### C0-2: JWT Token Update (3 lines)

**File**: `server/routes/auth.js` (~line 216)
```javascript
const token = jwt.sign(
  {
    user_id: user._id,
    email: user.email,
    role: user.role,
    company_id: user.company_id || user.current_company_id || null,
    managed_businesses: user.managed_businesses || []  // ADD THIS
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

#### C0-3: Company Switch Endpoint (~15 lines)

**File**: `server/routes/users.js` (new route)
```javascript
router.put('/switch-company', authenticateToken, requireRole('CONSULTANT'), async (req, res) => {
  const { company_id } = req.body;

  if (!company_id) {
    return res.status(400).json({ error: 'company_id required' });
  }

  const user = await User.findById(req.user.user_id);
  if (!user.managed_businesses.includes(company_id)) {
    return res.status(403).json({ error: 'Not authorized for this company' });
  }

  user.current_company_id = company_id;
  await user.save();

  // Return updated user (frontend updates localStorage)
  res.json({ success: true, data: { current_company_id: company_id } });
});
```

#### C0-4: Auth Middleware Override (~5 lines)

**File**: `server/middleware/auth.js` (in token decode block)
```javascript
// After decoding JWT, before attaching to req:
if (decoded.role === 'CONSULTANT' && decoded.managed_businesses?.length) {
  // Use current_company_id if set, otherwise first managed business
  const user = await User.findById(decoded.user_id).select('current_company_id');
  if (user?.current_company_id) {
    decoded.company_id = user.current_company_id;
  }
}
req.user = decoded;
```

#### C0-5: Frontend Company Switcher (~80 lines)

**File**: `client/js/navigation.js` (extend existing NavigationManager)

Add a dropdown next to the user menu that:
1. Only renders when `currentUser.role === 'CONSULTANT'`
2. Fetches company names for IDs in `currentUser.managed_businesses`
3. Shows current company name with dropdown arrow
4. On selection: calls `PUT /api/users/switch-company`, updates `localStorage`, reloads page
5. Styled with existing `s13-patterns.css` variables

#### C0-6: Assessment Response Exclude/Restore (~20 lines)

**File**: `server/routes/assessments.js` (new routes)
```javascript
// Exclude a single assessment response (soft-exclude, not delete)
router.put('/:id/exclude', authenticateToken, requireRole('CONSULTANT'), async (req, res) => {
  const assessment = await Assessment.findOne({
    _id: req.params.id,
    company_id: req.user.company_id
  });
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

  assessment.status = 'excluded';
  assessment.excluded_by = req.user.user_id;
  assessment.excluded_at = new Date();
  await assessment.save();

  res.json({ success: true, message: 'Response excluded. SSI scores will recalculate on next view.' });
});

// Restore a previously excluded response
router.put('/:id/restore', authenticateToken, requireRole('CONSULTANT'), async (req, res) => {
  const assessment = await Assessment.findOne({
    _id: req.params.id,
    company_id: req.user.company_id,
    status: 'excluded'
  });
  if (!assessment) return res.status(404).json({ error: 'Assessment not found or not excluded' });

  assessment.status = 'completed';
  assessment.excluded_by = undefined;
  assessment.excluded_at = undefined;
  await assessment.save();

  res.json({ success: true, message: 'Response restored. SSI scores will recalculate on next view.' });
});
```

#### C0-7: Aggregation Query Filter (~10 lines)

**Files**: All aggregation endpoints in `server/routes/assessments.js`

Add `status: { $ne: 'excluded' }` filter to every aggregation query that feeds SSI scoring:

```javascript
// BEFORE (in team-breakdown, anonymous, latest-scores, company-summary):
const assessments = await Assessment.find({ company_id: companyId });

// AFTER:
const assessments = await Assessment.find({
  company_id: companyId,
  status: { $ne: 'excluded' }
});
```

Since `UnifiedSSIScoringService` calculates on-demand from the query results, excluding responses from the query automatically recalculates SSI scores without any changes to the scoring engine itself.

### SSI Scoring — Zero Changes Needed

The `UnifiedSSIScoringService` already calculates per-assessment, and every Assessment record already carries `company_id`. All aggregation endpoints already filter by company:

| Endpoint | Filter | Status |
|----------|--------|--------|
| `GET /api/assessments/company/:companyId/team-breakdown` | `:companyId` param | **EXISTS** |
| `GET /api/assessments/company/:companyId/anonymous` | `:companyId` param | **EXISTS** |
| `GET /api/assessments/latest-scores` | `req.user.company_id` | **EXISTS** |
| `GET /api/diagnostic/ssi/:companyId` | `:companyId` param | **EXISTS** |

Once C0-4 ships (auth middleware overrides `company_id` for consultants), these endpoints automatically return the switched company's data. No scoring engine changes. No aggregation changes. The company filter propagates through the entire stack.

**Consultant assessment journey after C0**:
1. Switch to "AirProducts" → `current_company_id` = AirProducts
2. Send survey via public link → `Assessment.company_id` = AirProducts (automatic)
3. View results → all endpoints filter by AirProducts → correct SSI scores
4. Switch to "Legacy Succession" → same endpoints, different data

**Frontend integration** (Epic U5 Tab 4): Call both `team-breakdown` and `anonymous` endpoints, render combined view with source labels ("Team" vs "Survey"). Combined SSI is already computed by `latest-scores` which aggregates all assessments regardless of type.

### Dependencies

- **None** — all changes are additive to existing code
- Does NOT touch any Sprint 11 epic work (U5, U3, U4, QA, J)
- Does NOT add new models or schema fields
- Does NOT change any existing endpoint behavior for non-CONSULTANT roles
- Does NOT modify `UnifiedSSIScoringService` or any aggregation logic

### Acceptance Criteria

- [ ] `POST /api/companies` correctly adds to `managed_businesses` array
- [ ] JWT token includes `managed_businesses` array
- [ ] `PUT /api/users/switch-company` validates and persists company switch
- [ ] After switching, all data endpoints return data for the selected company
- [ ] SSI scores, team breakdown, and anonymous results all scoped to switched company
- [ ] Company switcher dropdown visible only to CONSULTANT users
- [ ] Non-consultant users see zero UI changes
- [ ] Existing tests pass (no regression)

### Rollback

| Scenario | Action |
|----------|--------|
| Switch endpoint fails | Consultant falls back to default `company_id` from signup |
| JWT size concern | Move `managed_businesses` to DB lookup only (remove from token) |
| Navigation breaks | Remove switcher component, no other impact |

---

## Epic BF: Architecture Audit Bug Fixes (5 pts) — Jan 28 Audit

**Source**: [ARCHITECTURE_AUDIT_REPORT_JAN28.md](../SPRINT-3/ARCHITECTURE_AUDIT_REPORT_JAN28.md)

Issues already covered by other epics (excluded):
- Token key inconsistency → **Epic Q1** (already planned)
- Input validation → **Epic Q2** (already planned)
- Companies.js consultant access → **Epic C0** (already planned)

### Stories

| ID | Story | Points | Severity | Description |
|----|-------|--------|----------|-------------|
| BF-1 | Add requireRole to teams routes | 1 | CRITICAL | `server/routes/teams.js` POST/PUT/DELETE missing `requireRole()` middleware — any authenticated user can mutate teams |
| BF-2 | XSS hardening pass | 2 | HIGH | Add `escapeHtml()` to all innerHTML with user data in: `navigation.js` (user menu), `feedback-admin.js`, `business-assessment.js`, `objective-detail.js` |
| BF-3 | Standardize error response format | 1 | HIGH | Fix `analytics.js` `error: undefined` in production, ensure all routes use `{ success, error?, message?, data? }` pattern |
| BF-4 | Remove debug logging from auth middleware | 0.5 | HIGH | `server/middleware/authGuards.js:41-47` logs cookie keys and auth header on every request in production |
| BF-5 | Fix rate limiter fallback | 0.5 | MEDIUM | `server/middleware/rateLimiting.js:108` — fall back to IP when `req.user._id` is undefined on optional-auth routes |

### Implementation Details

#### BF-1: Teams Route Authorization (CRITICAL)

**File**: `server/routes/teams.js`

```javascript
// ADD to POST /api/teams/create (line ~25):
router.post('/create', authenticateToken, requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER'), async (req, res) => { ... });

// ADD to PUT /api/teams/:id (line ~188):
router.put('/:id', authenticateToken, requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER'), async (req, res) => { ... });

// ADD to DELETE /api/teams/:id (line ~271):
router.delete('/:id', authenticateToken, requireRole('CONSULTANT', 'BUSINESS_OWNER'), async (req, res) => { ... });
```

#### BF-2: XSS Hardening

**Files to fix** (add `escapeHtml()` from `common.js`):
- `client/js/navigation.js:107-120` — escape `userName` and `this.currentUser.email` in user menu
- `client/pages/scripts/feedback-admin.js:179,219,281` — escape user data in `innerHTML` map operations
- `client/pages/scripts/business-assessment.js:482,486,493` — escape API response text fields
- `client/pages/scripts/objective-detail.js:191,253` — escape user-provided text in template literals

#### BF-3: Response Format Fix

**File**: `server/routes/analytics.js` (~17 catch blocks)

```javascript
// BEFORE (lines 46, 74, 105, etc.):
error: process.env.NODE_ENV === 'development' ? error.message : undefined

// AFTER:
...(process.env.NODE_ENV === 'development' && { error: error.message })
```

#### BF-4: Auth Debug Logging

**File**: `server/middleware/authGuards.js:41-47`

```javascript
// BEFORE:
console.log('Cookies:', Object.keys(req.cookies || {}));
console.log('Auth header present:', !!req.headers.authorization);

// AFTER: Remove these lines entirely (or wrap in NODE_ENV check)
if (process.env.NODE_ENV === 'development') {
  console.log('Cookies:', Object.keys(req.cookies || {}));
  console.log('Auth header present:', !!req.headers.authorization);
}
```

#### BF-5: Rate Limiter Fallback

**File**: `server/middleware/rateLimiting.js:108`

```javascript
// BEFORE:
keyGenerator: (req) => req.user._id

// AFTER:
keyGenerator: (req) => req.user?._id || req.ip
```

### Schedule

All BF stories can be done on **Day 1** alongside Q1/Q2/C0 as they are small, focused fixes.

---

## API Contracts for New Endpoints (Audit Fix #6 Cross-Cutting)

### `GET /api/assessment-questions/dimensions`

**Request**: `GET /api/assessment-questions/dimensions`
**Auth**: Bearer token required
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "dimension": "Speed",
      "blocks": [
        { "block": "Delivery", "question_count": 6 },
        { "block": "Decisions", "question_count": 5 },
        { "block": "Change", "question_count": 7 },
        { "block": "Response", "question_count": 6 }
      ]
    },
    {
      "dimension": "Strength",
      "blocks": [...]
    },
    {
      "dimension": "Intelligence",
      "blocks": [...]
    }
  ]
}
```

### `GET /api/assessment-questions/modules`

**Request**: `GET /api/assessment-questions/modules`
**Auth**: Bearer token required
**Response**:
```json
{
  "success": true,
  "data": ["core", "industry", "role"]
}
```

### `GET /api/assessment-questions/by-module`

**Request**: `GET /api/assessment-questions/by-module?module=core&dimension=Speed&block=Delivery`
**Auth**: Bearer token required
**Query params**: `module` (required), `dimension` (optional), `block` (optional), `industry` (optional for industry module), `role` (optional for role module)
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "text": "How quickly does your team deliver on commitments?",
      "dimension": "Speed",
      "block": "Delivery",
      "module_type": "core",
      "weight": 1.0,
      "order": 1
    }
  ]
}
```

### `GET /api/assessments/company-summary`

**Request**: `GET /api/assessments/company-summary`
**Auth**: Bearer token required
**Response**:
```json
{
  "success": true,
  "data": {
    "total_assessments": 12,
    "active": 3,
    "completed": 8,
    "avg_score": 72.5,
    "dimensions": {
      "Speed": 68,
      "Strength": 75,
      "Intelligence": 74
    }
  }
}
```

---

## Implementation Schedule

### Week 1: Foundation + Assessment Hub
| Day | Stories | Points | Focus | Status |
|-----|---------|--------|-------|--------|
| 1 | Q1, Q2, C0, BF, s13-patterns.css | 14 | Auth fix, validation, consultant foundation, architecture audit fixes | ✅ COMPLETE (Jan 29) |
| 2 | U5a, U5b | 14 | Assessment Hub Core + My Clients CONSULTANT, SSI helpers | ✅ COMPLETE (Feb 3) |
| 3 | QA1 (part 1) | 3 | Modular question architecture backend (3 new endpoints) | ⏳ NEXT |
| 4 | QA1 (part 2), QA2 | 5 | Question modules + industry questions | 📋 |
| 5 | QA3, QA4 | 5 | Role questions + weight calibration | 📋 |

### Week 2: Question Library + Assessment Flow
| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 6 | U3 | 5 | Question Library page layout (with client-side search) |
| 7 | J1, J2 | 13 | Wizard (all 3 steps) + template selection |
| 8 | J3, J4 | 8 | Audience config + review |
| 9 | J5, J6 | 7 | Sent-by-me (existing endpoint) + anonymous surveys (existing endpoint + rate limiting) |
| 10 | U4, Quickfix | 6 | Teams page (with edit/delete flows) + bug fixes |

---

## Success Criteria

### Per Epic
- [ ] **U5**: Assessment Hub renders role-adaptive 4 tabs (CONSULTANT: My Clients w/ drill-down, Assigned, Templates, Sent; non-consultant: Assigned, Templates, Sent, Team Results), all data from API, zero hardcoded content
- [ ] **U3**: Question Library renders dimension tree, questions, modules from API + client-side search works
- [ ] **U4**: Teams page renders cards, stats, detail panel from API + edit/delete flows work
- [ ] **QA**: 3 question modules (Core/Industry/Role) load dynamically, migration complete
- [ ] **J**: 3-step wizard creates assessments, sent-by-me tracks stats, anonymous links have rate limiting
- [ ] **Q1**: Auth token standardized, migration shim works
- [ ] **Q2**: All assessment inputs validated server-side
- [ ] **C0**: Consultant can switch companies, all pages show switched company's data, bug fix deployed, exclude/restore assessment responses works with auto-recalculation

### Sprint Completion Checklist
- [ ] All pages use `s13-patterns.css` for shared styles (incl. loading/error/empty states)
- [ ] All pages follow standard page template (nav → content → scripts)
- [ ] All pages use `auth:ready` event for initialization
- [ ] All data comes from API calls — zero hardcoded content
- [ ] All user text rendered with `escapeHtml()`
- [ ] All dates rendered with `formatDate()`
- [ ] All avatars use `getInitials()` from `common.js`
- [ ] No duplicate utility functions created
- [ ] No new API clients created for covered endpoints
- [ ] Loading, error, and empty states work for all pages
- [ ] Role-gated UI elements check `currentUser.role`
- [ ] Multi-tenant isolation: all queries filter by `company_id`
- [ ] Team edit/delete flows work with proper role gating
- [ ] Client-side search works in Question Library

---

## Rollback Plan

| Scenario | Action | Impact |
|----------|--------|--------|
| S13 layout breaks on specific browser | Revert to legacy page layout (git revert page files), keep backend changes | Cosmetic only |
| Module type migration corrupts questions | Re-run migration with `module_type: 'core'` default — idempotent | None — all questions become core |
| New assessment-questions endpoints fail | Frontend falls back to `GET /api/assessment-questions` (exists) for flat list | Loses hierarchy/module features |
| Auth token migration breaks existing sessions | Remove migration shim, keep dual-key support in `getAuthToken()` | Users re-login once |
| Wizard flow causes incomplete assessments | Disable wizard, expose direct `POST /api/invitations/create` form | Simpler UX |
| Teams edit/delete causes data loss | Verify soft-delete only, disable delete button via feature flag | Read-only teams |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Missing API endpoints for new UI needs | Medium | Medium | Extend existing routes, don't create new route files |
| CSS conflicts between old and new styles | Low | Low | s13-patterns.css uses namespaced variables |
| Assessment question schema changes | Medium | Medium | Use additive schema changes only, no breaking changes |
| Module type migration on large datasets | Low | Low | Run as one-time script, idempotent |
| Anonymous survey abuse | Medium | Medium | Rate limiting + response_limit + deactivation |

---

## Related Documents

- Mockups: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-13/`
- Previous Sprint 11 plan: `SPRINT-11-MASTER-PLAN.md` (superseded by this V2)
- Architecture review: Conducted Jan 27, 2026 — see session notes
- Shared modules inventory: `client/js/common.js`, `navigation.js`, `toast.js`, `category-icons.js`, `assessment-api-client.js`, `team-api-client.js`
- Audit Fix Plan: `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/sprints/AUDIT-FIX-SESSION-PLAN.md`

---

**Sprint 11 V2.4 — Post-Audit + Consultant Foundation (Epic C0 w/ 7 stories, 4pts) + Role-Adaptive 4-Tab Assessment Hub (My Clients Drill-Down) + Diagnostic Exclude/Restore, Enterprise Grade, Zero Hardcoding**
