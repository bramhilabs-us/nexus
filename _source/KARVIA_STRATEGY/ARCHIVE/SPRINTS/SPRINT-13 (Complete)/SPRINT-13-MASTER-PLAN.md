# Sprint 13 Master Plan V4

**Sprint**: 13 - Unified LLM Context + Objectives Page + SSI Report
**Created**: January 27, 2026
**Updated**: February 20, 2026
**Total Points**: 72 pts (V3 96 pts - Epic N 21 pts - Epic R 3 pts → Sprint 14)
**Duration**: 2 weeks
**Status**: READY TO EXECUTE
**Pages Introduced**: Objectives, SSI Report (redesigned)
**Design Reference**: `sprint_mockups/sprint-13/objectives-redesign.html`
**Prerequisite**: Sprint 11 (s13-patterns.css), Sprint 12 (Dashboard + Planning complete)

### V4 Changes (February 20, 2026)

| Change | Reason | Impact |
|--------|--------|--------|
| **Moved Epic N (21 pts) to Sprint 14** | Focus on AI foundation first | -21 pts |
| **Moved Epic R (3 pts) to Sprint 14** | Branding can wait until OKR features ready | -3 pts |
| Duration reduced | 72 pts fits in 2 weeks | 3 weeks → 2 weeks |

---

## Reorganization (V3)

| Change | Reason | Impact |
|--------|--------|--------|
| Added Epics N (21), O (18) from old Sprint 12 | Page-pairing: Objectives page needs OKR features | +39 pts |
| Added Epic U2 (5pts) | Objectives page redesign | +5 pts |
| Added Epic V (6pts) | SSI Report page redesign | +6 pts |
| Kept Epic R (3pts) + T (5pts) | Branding — final sprint | 0 |
| **Added Epic X (42pts)** | **Unified LLM Context Service — foundation for all AI** | **+42 pts** |
| Net change | From 8pts → 100pts | Extended to 3 weeks |

### Epic X Addition Rationale (V3)

Epic X addresses critical technical debt in AI context building:
- **Current State**: 4+ files with duplicate SSI/context building logic
- **Problem**: Inconsistent context passed to LLM, no learning from rejections
- **Solution**: Single `UnifiedLLMContextService` as source of truth
- **Impact**: Enables all future AI features, fixes Generate Tasks (currently template-based)

See: [EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md](./EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md)

---

## Executive Summary

Sprint 13 delivers the **strategic layer** — Objectives (where leaders set direction) and SSI Report (diagnostic intelligence). It also completes the **Chief AI branding** across all pages. By Sprint 13, all 6 core pages will be redesigned with S13 patterns.

### Core Principle: ZERO HARDCODING (inherited from Sprint 11/12)

All infrastructure from Sprint 11 and 12 carries forward. No new shared modules needed — only page-specific controllers.

---

## Architecture: Reuse Summary

### Full Module Inventory (All Available by Sprint 13)

| Module | Created In | Reused Here |
|--------|-----------|-------------|
| `s13-patterns.css` | Sprint 11 | Objectives, SSI Report |
| `KarviaCommon` | Existing | All |
| `NavigationManager` | Existing | All |
| `Toast` | Existing | All |
| `ObjectivesAPI` | Existing | Objectives page (primary) |
| `GoalsAPIClient` | Existing | Objectives KR display |
| `CategoryIcons` | Existing | Objectives category pills, coverage widget |
| `AssessmentAPI` | Existing (Sprint 11 extended) | SSI Report data |
| `renderScoreRing()` | Sprint 11 (Assessment Hub) | Objectives progress, SSI scores |

### DO NOT Create

- No new CSS file — use `s13-patterns.css`
- No new objectives API client — `ObjectivesAPI` exists
- No new score ring function — reuse from Sprint 11
- No new category badge function — `CategoryIcons.getBadge()` exists
- No new avatar function — `getInitials()` in `common.js`

### User Dropdown (Already in NavigationManager)

The `NavigationManager.renderNavigation()` already renders a user menu with logout button. No additional implementation needed for the user dropdown visible in mockups.

---

## Endpoint Reality Check (Post-Audit)

### SSI/Diagnostic Endpoints (ALL EXIST)

| Endpoint | Status | Used By |
|----------|--------|---------|
| `GET /api/diagnostic/ssi/:companyId` | **EXISTS** | V — full SSI report (dimensions, blocks, narratives, benchmarks) |
| `GET /api/diagnostic/ssi/:companyId/summary` | **EXISTS** | V — dashboard summary |
| `GET /api/diagnostic/ssi/:companyId/benchmark` | **EXISTS** | V — industry benchmarks |
| `GET /api/diagnostic/ssi/:companyId/history` | **EXISTS** | V — report history |
| `POST /api/diagnostic/ssi/:reportId/share` | **EXISTS** | V — generate 7-day share link |
| `GET /api/diagnostic/ssi/public/:token` | **EXISTS** | V — public view (limited data, no auth needed) |
| `POST /api/diagnostic/ssi/:reportId/refresh-narratives` | **EXISTS** | V — regenerate LLM narratives |

### SSI Analytics Endpoints (ALL EXIST)

| Endpoint | Status | Used By |
|----------|--------|---------|
| `GET /api/analytics/ssi/comparison/:assessmentId` | **EXISTS** | O3 — individual vs team vs org vs industry |
| `GET /api/analytics/ssi/benchmarks/team/:companyId` | **EXISTS** | O1 — team average benchmarks |
| `GET /api/analytics/ssi/benchmarks/industry/:industry` | **EXISTS** | O2 — industry benchmarks |
| `GET /api/analytics/ssi/export/pdf/:assessmentId` | **EXISTS** | O4 — PDF export |
| `GET /api/analytics/ssi/trends/team/:companyId` | **EXISTS** | O1 — team SSI trends |
| `GET /api/analytics/ssi/trends/user/:userId` | **EXISTS** | O3 — individual trends |
| `GET /api/analytics/ssi/weak-areas/:assessmentId` | **EXISTS** | V — weak areas analysis |
| `GET /api/analytics/ssi/strong-areas/:assessmentId` | **EXISTS** | V — strong areas analysis |

### Objectives Endpoints (ALL EXIST)

| Endpoint | Status | Used By |
|----------|--------|---------|
| `POST /api/objectives` | **EXISTS** | N1 — create objective |
| `PUT /api/objectives/:id` | **EXISTS** | N3 owner, N5 archive |
| `GET /api/objectives` | **EXISTS** | U2 — list with filters |
| `POST /api/goals/quarterly` | **EXISTS** | N2 — create KR |

**Reduced from 6 "new" to 0-1 truly new endpoints.**

The only potentially new endpoint:
- `GET /api/diagnostic/ssi/team/:teamId` — team-level aggregation. May be derivable from existing `GET /api/assessments/team/:company_id`.

---

## Epic Overview

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| **X** | **42** | **P0** | **Unified LLM Context Service (AI foundation)** |
| U2 | 5 | P0 | Objectives page redesign (S13 layout) |
| V | 6 | P0 | SSI Report page redesign |
| O | 12 | P1 | SSI Intelligence enhancements (reduced — all endpoints exist) |
| T | 5 | P2 | Design system finalization |
| BF | 2 | P1 | Bug fixes (phantom assessment on client add) |
| **Total** | **72** | | **2 weeks** |

### Moved to Sprint 14

| Epic | Points | Reason |
|------|--------|--------|
| N | 21 | Advanced OKR features — focus on AI foundation first |
| R | 3 | Chief AI branding — wait until OKR features ready |

### Epic X Stories (42 pts)

| Story | Points | Description |
|-------|--------|-------------|
| X1 | 5 | Extend AIContextService with 12-Block SSI |
| X2 | 5 | Create Unified buildContext() Method |
| X3 | 3 | Add Context Delta Detection |
| X4 | 3 | Consolidate Planning Context |
| X5 | 5 | Create AIInteractionLog Model |
| X6 | 3 | Track Rejection Reasons |
| X7 | 5 | Add 1-Year Task History |
| X8 | 5 | AI-Powered Task Generation Endpoint |
| X9 | 5 | Update Frontend Generate Buttons + AI Reasoning UI |
| X10 | 5 | Weekly Goal Assignment UI |

**Full Spec**: [EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md](./EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md)

### X9 Expanded Acceptance Criteria (Per Audit)

**Original Scope (3 pts)**: Update Generate buttons to use new AI endpoint

**Expanded Scope (5 pts)**: Original + AI Reasoning UI

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Generate buttons use AI | Connect to X8 endpoint | P0 |
| Loading states | Show spinner during AI call | P0 |
| Error handling | Graceful fallback on AI failure | P0 |
| **AI Reasoning UI** | Collapsible "Why?" panel showing AI rationale | P1 |
| **Reasoning visibility** | Users can expand to see why AI suggested items | P1 |

**UI Implementation**:
```html
<!-- After each AI-generated item (OKR, goal, task) -->
<div class="ai-suggestion-item">
  <div class="suggestion-content">...</div>
  <button class="why-toggle" onclick="toggleReasoning(this)">
    <span class="icon">💡</span> Why?
  </button>
  <div class="ai-reasoning collapsed">
    <p><!-- reasoning from API response --></p>
  </div>
</div>
```

**Addresses**: AI-CONTEXT-006 (Reasoning Visible to User)

---

## Epic U2: Objectives Page Redesign (5 pts)

### Mockup Reference
`sprint_mockups/sprint-13/objectives-redesign.html`

### Decision Record: Category Separation

**Decision**: Objective categories (6) remain **separate** from SSI 12-block categories.

| Aspect | Objectives (6 categories) | SSI (12 blocks) |
|--------|---------------------------|-----------------|
| **Purpose** | Strategic business goals | Organizational capability assessment |
| **Categories** | Growth, Customer Success, Operations, People & Culture, Innovation, Financial Health | Speed (4), Strength (4), Intelligence (4) |
| **Data model** | `objective.category` | `assessment_question.category` |
| **UI component** | Category pills + coverage widget | SSI score rings + block breakdown |

**Rationale**: Different purposes, no data migration needed, lower risk, can align in future sprint if needed.

### Scope Definition

#### IN SCOPE (5 pts)
| Item | Description |
|------|-------------|
| ✅ Visual refresh | S13 patterns, Chief AI navy/gold branding |
| ✅ Inline KR display | Show Key Results inside objective cards |
| ✅ 6-state status system | completed, not-started, overdue, at-risk, needs-attention, in-progress |
| ✅ KR color coding | 5 progress levels with distinct colors |
| ✅ Quarter selector | Interactive Q1-Q4 filter buttons |
| ✅ AI badge | Show when `objective.ai_generated === true` |
| ✅ Owner display | Avatar + initials on objective cards |
| ✅ Progress rings | Reuse `renderScoreRing()` from Sprint 11 |

#### OUT OF SCOPE (Deferred)
| Item | Reason |
|------|--------|
| ❌ Chat button | No backend endpoint exists |
| ❌ Category migration to 12-block | Different purpose, no value add |
| ❌ New API endpoints | All endpoints already exist |

### Key UI Elements

| Element | Data Source | Implementation |
|---------|-------------|----------------|
| Page KPIs | Computed from objectives array | Active count, progress %, KR count, At Risk count |
| Category pills | `objective.category` | Keep existing 6 categories, add counts |
| Quarter selector | Objective date ranges | Interactive filter, highlight current quarter |
| Objective cards | `GET /api/objectives` with KR population | Grid layout, inline KRs |
| KR items | `objective.key_results[]` | Color-coded by progress threshold |
| Owner badge | `objective.owner_id` (populated) | Avatar with `getInitials()` |

### KR Progress Color Logic

```javascript
function getKRColorClass(percentage) {
  if (percentage >= 100) return 'kr-complete';    // Green
  if (percentage >= 70)  return 'kr-70plus';      // Blue
  if (percentage >= 40)  return 'kr-40plus';      // Amber
  if (percentage > 0)    return 'kr-below-40';    // Red
  return 'kr-not-started';                         // Gray
}
```

### Status Badge Logic

```javascript
function getObjectiveStatus(objective) {
  if (objective.status === 'completed') return { class: 'completed', label: 'Completed' };
  if (objective.status === 'not_started') return { class: 'not-started', label: 'Not Started' };
  const expectedProgress = getExpectedProgress(objective);
  const gap = expectedProgress - objective.progress;
  if (gap > 25) return { class: 'at-risk', label: 'At Risk' };
  if (gap > 10) return { class: 'needs-attention', label: 'Needs Attention' };
  if (objective.progress > 0) return { class: 'in-progress', label: 'In Progress' };
  return { class: 'not-started', label: 'Not Started' };
}
```

### Files to Modify

| File | Action | Details |
|------|--------|---------|
| `client/pages/objectives.html` | UPDATE | S13 layout, inline KR display, navy branding |
| `client/pages/scripts/objectives.js` | UPDATE | Add KR rendering, status logic, quarter filter |
| `client/css/s13-patterns.css` | VERIFY | Ensure objective card styles exist |

### Implementation Notes

1. **DO NOT** migrate objective categories to 12-block — keep existing 6
2. **DO NOT** create new CSS file — use `s13-patterns.css`
3. **DO NOT** modify API responses — frontend-only changes
4. **REUSE** `CategoryIcons.js` for existing 6-category badges
5. **REUSE** `renderScoreRing()` for progress visualization
6. **REUSE** `getInitials()` for owner avatars

---

## Epic V: SSI Report Page Redesign (6 pts)

### Problem
SSI report pages (ssi-report.html, ssi-report-full.html) need S13 design alignment.

### API Data Sources

| UI Element | API Source | Endpoint |
|-----------|-----------|----------|
| SSI scores (Speed/Strength/Intelligence) | Diagnostic API | `GET /api/diagnostic/ssi/:companyId` |
| 12-block breakdown | Diagnostic API | Same endpoint, nested blocks |
| Industry benchmarks | Config API | `GET /api/diagnostic/ssi/:companyId/benchmark` **(ALREADY EXISTS)** |
| LLM narratives | Diagnostic API | Included in SSI response |
| Historical data | History API | `GET /api/diagnostic/ssi/:companyId/history` **(ALREADY EXISTS)** |
| Share link | Share API | `POST /api/diagnostic/ssi/:reportId/share` **(ALREADY EXISTS — 7-day expiry, limited public view)** |

**All SSI Report data endpoints already exist. Sprint 13 V epic is 100% frontend redesign work.**

### Share Link Security (Already Implemented)

The existing `POST /api/diagnostic/ssi/:reportId/share` endpoint:
- Generates a unique token with 7-day expiry
- Public view at `GET /api/diagnostic/ssi/public/:token` returns limited data (no narratives)
- No authentication required for public view
- Links auto-expire after 7 days

### Rendering Rules

```
RULE 1: SSI scores → from API response.dimensions.speed/strength/intelligence
RULE 2: 12-block scores → from API response.blocks[].score
RULE 3: Benchmarks → from API, NOT hardcoded industry averages
RULE 4: Narratives → from API (LLM-generated), with fallback text
RULE 5: Score colors → computed from thresholds, not hardcoded
RULE 6: Charts → rendered from data arrays, not static SVG
```

### Files to Modify

| File | Action | Details |
|------|--------|---------|
| `client/pages/ssi-report.html` | UPDATE | S13 patterns, dynamic scores |
| `client/pages/ssi-report-full.html` | UPDATE | S13 patterns, 12-block layout |
| `client/js/ssi-report.js` | UPDATE | Ensure all rendering is dynamic |

---

## Epic N: Advanced OKR Features (21 pts)

### Stories

| ID | Story | Points | Description |
|----|-------|--------|-------------|
| N1 | Objective creation wizard | 5 | Manual + AI-assisted objective creation |
| N2 | Key Result management | 5 | CRUD for KRs within objectives |
| N3 | Objective owner assignment | 3 | Assign/reassign objective owners |
| N4 | Objective status automation | 4 | Auto-compute status from KR progress |
| N5 | Objective archiving | 2 | Archive completed objectives |
| N6 | Category management | 2 | Validate MECE category coverage |

### API Data Sources

| Feature | Endpoint | Notes |
|---------|----------|-------|
| Create objective | `POST /api/objectives` | Via `ObjectivesAPI.createObjective()` |
| Create KR | `POST /api/goals/quarterly` | Via `GoalsAPIClient` |
| Update owner | `PUT /api/objectives/:id` | `{ owner_id: userId }` |
| Auto-status | Server-side | Triggered on KR progress update |
| Archive | `PUT /api/objectives/:id` | `{ status: 'archived' }` |
| Team members (for assignment) | `GET /api/auth/users` | Filtered by company |

### DO NOT

- Do not create objective categories client-side — use `CategoryIcons.getAllCategories()`
- Do not hardcode status transitions — compute from progress data
- Do not create new user picker — reuse team member selection pattern from Sprint 11

---

## Epic O: SSI Intelligence Enhancements (12 pts) — REVISED

### Decision Record: Scope Reduction

**Original**: 18 pts | **Revised**: 12 pts | **Savings**: 6 pts

**Rationale**: All backend endpoints already exist. This epic is **100% frontend work** — building UI to consume existing APIs.

### Stories (Revised)

| ID | Story | Original | Revised | Description |
|----|-------|----------|---------|-------------|
| O1 | Team-level SSI aggregation | 5 | 3 | UI to display team scores (endpoint exists) |
| O2 | Company-level SSI dashboard | 5 | 4 | Dashboard with department breakdown (endpoint exists) |
| O3 | Cross-level comparison | 4 | 3 | Comparison visualization charts (endpoint exists) |
| O4 | Enhanced PDF export | 4 | 2 | Wire up existing PDF endpoint + button |

### Existing Endpoints (NO Backend Work Needed)

| Story | Endpoint | Line # | Status |
|-------|----------|--------|--------|
| O1 | `GET /api/analytics/ssi/benchmarks/team/:companyId` | 661 | ✅ EXISTS |
| O1 | `GET /api/analytics/ssi/trends/team/:companyId` | 405 | ✅ EXISTS |
| O2 | `GET /api/analytics/ssi/benchmarks/org/:companyId` | 698 | ✅ EXISTS |
| O3 | `GET /api/analytics/ssi/comparison/:assessmentId` | 592 | ✅ EXISTS |
| O3 | `GET /api/analytics/ssi/comparison/user/:userId` | 632 | ✅ EXISTS |
| O4 | `GET /api/analytics/ssi/export/pdf/:assessmentId` | 997 | ✅ EXISTS |
| O4 | `GET /api/analytics/ssi/export/csv/:assessmentId` | 1039 | ✅ EXISTS |
| — | `GET /api/analytics/ssi/weak-areas/:assessmentId` | 909 | ✅ BONUS |
| — | `GET /api/analytics/ssi/strong-areas/:assessmentId` | 951 | ✅ BONUS |
| — | `GET /api/analytics/ssi/benchmarks/industry/:industry` | 735 | ✅ BONUS |

**All endpoints in**: `server/routes/analytics.js`

### Scope Definition

#### IN SCOPE (12 pts)
| Item | Description |
|------|-------------|
| ✅ Team SSI view | Display aggregated team scores using existing endpoint |
| ✅ Department breakdown | Show SSI by department (if teams have department field) |
| ✅ Comparison charts | Visual comparison: Individual vs Team vs Company |
| ✅ PDF export button | Wire up existing PDF endpoint with download trigger |
| ✅ S13 styling | Apply navy branding, s13-patterns.css |

#### OUT OF SCOPE
| Item | Reason |
|------|--------|
| ❌ New backend endpoints | All already exist |
| ❌ Real-time SSI calculation | Use existing aggregation logic |
| ❌ Custom chart library | Use existing visualization patterns |

### UI Location Decision

**Option A**: Add as tabs/views within SSI Report page (Epic V)
**Option B**: Create separate "SSI Analytics" page

**Recommendation**: Option A — add to SSI Report as additional views. Reduces page count, better UX.

### Implementation Notes

1. **DO NOT** create new backend endpoints — all exist in `analytics.js`
2. **DO NOT** duplicate SSI calculation logic — use existing aggregation
3. **REUSE** chart patterns from existing pages
4. **INTEGRATE** with Epic V (SSI Report) as additional tabs if feasible
5. **VERIFY** department field exists on Team model before O2 implementation

---

## Epic R: Chief AI Branding (3 pts)

### Scope
Replace Karvia purple branding with Chief AI navy/gold across ALL pages.

### Color Swap Map

| Element | Current (Karvia) | New (Chief AI) |
|---------|-----------------|----------------|
| Primary gradient | `#667eea → #764ba2` (purple) | `#1e3a5f → #2d5a87` (navy) |
| Success green | `#10b981` | `#22c55e` (already in mockups) |
| Accent | Purple variants | Gold `#d4a853` for highlights |
| Logo | Karvia logo | Chief AI star + wordmark SVG |

### Implementation

```css
/* s13-patterns.css — UPDATE variables */
:root {
  --brand-gradient: linear-gradient(135deg, #1e3a5f, #2d5a87);  /* Navy */
  --brand-accent: #d4a853;                                        /* Gold */
  --brand-primary: #1e3a5f;
  /* Philosophy colors stay the same */
}
```

### Files to Update

ALL pages that reference the old gradient. Use find-and-replace:
- `linear-gradient(135deg, #667eea` → `linear-gradient(135deg, #1e3a5f`
- `karvia-gradient` class → update CSS definition
- Logo SVG in `navigation.js` → replace with Chief AI SVG

### DO NOT

- Do not change any functionality — branding only
- Do not change layout or component structure
- Do not modify API responses or data models
- Do not touch any business logic

---

## Epic T: Design System Finalization (5 pts)

### Stories

| ID | Story | Points | Description |
|----|-------|--------|-------------|
| T1 | Finalize s13-patterns.css | 2 | Ensure all shared tokens are complete |
| T2 | Navigation component polish | 1 | Philosophy colors, tooltips, responsive |
| T3 | Cross-page consistency audit | 2 | Verify all 6 pages match design system |

### Checklist

- [ ] All 6 pages import `s13-patterns.css`
- [ ] All 6 pages use `--brand-gradient` (not hardcoded hex)
- [ ] All 6 pages use `NavigationManager` (not inline nav HTML)
- [ ] All 6 pages use philosophy color underlines
- [ ] All status badges use same 6-state system
- [ ] All progress rings use same `renderScoreRing()` function
- [ ] All avatar initials use `getInitials()` from `common.js`
- [ ] All dates use `formatDate()` from `common.js`
- [ ] All user text escaped with `escapeHtml()`
- [ ] Responsive: all pages work at 768px breakpoint

---

## Implementation Schedule

> **V4 Update (Feb 20, 2026)**: Epic N and R moved to Sprint 14
> - Sprint reduced from 3 weeks to 2 weeks (72 pts)
> - Focus on AI foundation (Epic X) + page redesigns (U2, V, O)

### Week 1: Epic X - Unified LLM Context (Foundation)
| Day | Stories | Points | Focus | Risk |
|-----|---------|--------|-------|------|
| 1 | X1 | 5 | 12-Block SSI in AIContextService | Medium |
| 2 | X2 | 5 | Unified buildContext() method + token counting | Medium |
| 3 | X3, X4 | 6 | Context delta + consolidate planning | Low |
| 4 | X5, X7 (partial) | 7 | AIInteractionLog + task history queries | Low |
| 5 | X6, X7 (partial) | 6 | Rejection tracking + history aggregation | Low |

**Week 1 Checkpoint (Day 5 EOD)**: 29 pts
- [ ] All AI endpoints use `AIContextService.buildContext()`
- [ ] Token counting implemented (max 8000 tokens)
- [ ] Integration test: OKR generation still works
- [ ] AIInteractionLog capturing all LLM calls

### Week 2: Epic X (cont.) + Page Redesigns + Polish
| Day | Stories | Points | Focus | Risk |
|-----|---------|--------|-------|------|
| 6 | X8 | 5 | AI task generation endpoint | Medium |
| 7 | X9, X10 | 10 | Frontend buttons + assignment UI + AI reasoning UI | Medium |
| 8 | U2 | 5 | Objectives S13 layout | Low |
| 9 | V, O1, O2 | 13 | SSI Report redesign + Team/Company SSI | Low |
| 10 | O3, O4, T, BF | 10 | Comparison + PDF + Design system + Bug fix | Low |

**Week 2 Checkpoint (Day 10 EOD)**: 43 pts (72 total)
- [ ] Generate buttons use AI with full context
- [ ] AI reasoning visible in collapsible panel
- [ ] Objectives page renders from API (S13 patterns)
- [ ] SSI Report redesigned with S13 patterns
- [ ] Design system audit passes
- [ ] BF1 phantom assessment fixed
- [ ] BST regression suite passes

---

## Success Criteria

### Epic X Success Criteria (Foundation)
- [ ] All AI endpoints use `UnifiedLLMContextService.buildContext()`
- [ ] 12-block SSI data available in all AI prompts
- [ ] Context delta detection working (shows changes since last interaction)
- [ ] AIInteractionLog tracking all LLM calls
- [ ] Rejection reasons captured and included in future context
- [ ] 1-year task history included in task generation context
- [ ] Generate Tasks button uses AI (not hardcoded templates)
- [ ] Weekly goal assignment UI functional
- [ ] Duplicate SSI fetching code removed from ai-okr.js and planning.js

### Sprint Completion Checklist
- [ ] Objectives page renders all data from API — zero hardcoded content
- [ ] Category coverage widget computes from real objectives
- [ ] KR colors computed from percentage thresholds
- [ ] Status badges computed from progress vs expected
- [ ] SSI Report shows real scores from diagnostic API
- [ ] Team/company SSI aggregation works
- [ ] All 6 pages pass design system consistency audit (branding deferred to S14)
- [ ] No new shared modules created (all reused from Sprint 11/12)
- [ ] PDF export includes dynamic data
- [ ] BF1 phantom assessment bug fixed

---

## Rollback Plan

| Scenario | Action | Impact |
|----------|--------|--------|
| Objectives page breaks | Revert to existing objectives.html | Users see old layout |
| SSI Report redesign breaks | Revert to existing ssi-report.html / ssi-report-full.html | Users see old layout |
| Branding swap looks wrong | Revert s13-patterns.css variables to original values | Instant revert |
| PDF export fails | Existing PDF export endpoint is unchanged — only frontend trigger is new | None |

---

## Related Documents

- **Epic X Spec**: [EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md](./EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md)
- Sprint 11 V2: `SPRINT-11-MASTER-PLAN-V2.md`
- Sprint 12 V2: `SPRINT-12-MASTER-PLAN-V2.md`
- Mockup: `sprint_mockups/sprint-13/objectives-redesign.html`
- ObjectivesAPI: `client/js/objectives-api-client.js`
- CategoryIcons: `client/js/category-icons.js`
- Existing objectives.js: `client/pages/scripts/objectives.js`
- SSI endpoints: `server/routes/diagnostic-reports.js`
- AIContextService: `server/services/AIContextService.js`
- AI OKR routes: `server/routes/ai-okr.js`
- Planning routes: `server/routes/planning.js`

---

## Bug Fixes (Carried from Production)

### BF1: Phantom Assessment on Client Add (2 pts)

**Reported**: February 16, 2026
**Severity**: Medium
**Environment**: Production

**Description**:
When a CONSULTANT user adds a new client company via the "My Clients" tab, an assessment is automatically created and sent with "Unknown Template" status. The user only intended to add the client — no assessment should be created or sent.

**Current Behavior**:
1. Consultant clicks "Add Client" in My Clients tab
2. Enters client company information
3. Client is added successfully
4. **Bug**: An assessment batch is automatically created and appears in "Sent by Me" tab
5. Assessment shows "Unknown Template", 2 Pending, 0% progress

**Expected Behavior**:
Adding a client should ONLY create the company record. No assessments should be created or sent. The consultant should explicitly use the Assessment Wizard to send assessments.

**Root Cause Investigation**:
- Check `server/routes/consultant.js` — client creation endpoint
- Check `server/routes/companies.js` — company creation logic
- Look for any hooks or triggers that auto-create assessments on company creation

**Files to Investigate**:
- `server/routes/consultant.js`
- `server/routes/companies.js`
- `server/models/Company.js` (pre/post save hooks)
- `client/pages/assessment-hub.html` (My Clients tab JS)

**Fix Approach**:
1. Remove any auto-assessment creation logic from client/company creation
2. Ensure assessment creation is explicit via wizard only
3. Clean up orphan "Unknown Template" assessments in production

---

---

## Sprint 14 Preview

### Moved from Sprint 13 (V4)

| Epic | Points | Description |
|------|--------|-------------|
| **N** | **21** | **Advanced OKR Features** |
| N1 | 5 | Objective creation wizard (manual + AI-assisted) |
| N2 | 5 | Key Result management (CRUD within objectives) |
| N3 | 3 | Objective owner assignment/reassignment |
| N4 | 4 | Objective status automation (compute from KR progress) |
| N5 | 2 | Objective archiving |
| N6 | 2 | Category management (validate MECE coverage) |
| **R** | **3** | **Chief AI Branding Swap** |
| — | 3 | Replace Karvia purple with Chief AI navy/gold across all pages |

### Additional Sprint 14 Items (Per Audit)

| Item | Story ID | Description | Points (Est.) |
|------|----------|-------------|---------------|
| Why Chain with SSI Lineage | EMP-016 | Show employees how their tasks connect back to SSI scores | 5 |
| Cross-Company Learning | AI-CONTEXT-007 | AI learns from anonymized patterns across companies (Consultant view) | 8 |
| Enhanced Reasoning UI | AI-CONTEXT-006 ext. | Full reasoning expansion with edit capability | 3 |

**Sprint 14 Estimated Total**: ~40 pts (N:21 + R:3 + new:16)

---

**Sprint 13 V4 — AI Foundation + Page Redesigns, Zero Hardcoding (72 pts / 2 weeks)**
