# Sprint 5: OKR System Consolidation & Enhancement

**Status**: In Progress
**Duration**: 1.5 weeks (48 hours)
**Target Completion**: December 2025
**Priority**: HIGH - Foundation for production launch
**Last Updated**: 2025-11-25 (Post-Codebase Audit)

---

## CODEBASE AUDIT SUMMARY

> **IMPORTANT**: This plan was revised after critical analysis of the actual codebase on 2025-11-25.
> Several assumptions in the original plan were incorrect. This version reflects verified findings.

### Key Corrections Made:

| Original Claim | Actual Finding | Action |
|----------------|----------------|--------|
| "5 entry points for OKR generation" | Only 2 duplicate entry points exist | Reduced scope |
| "Deprecate okr-creation-wizard" | Wizard is template-based, NOT AI - different flow | DO NOT deprecate |
| "Deprecate assessment-results" | Uses unique endpoint `/generate/:assessmentId` | Keep as-is |
| N/A | `business-objectives.html` referenced but doesn't exist | Fix broken links |
| "Consolidate API clients" | Two clients serve different purposes (CRUD vs Dashboard+iBrain) | Keep both separate |
| N/A | **DELETE endpoint missing in Planner Engine** | CRITICAL BUG - implement |

---

## EXECUTIVE SUMMARY

Sprint 5 consolidates and enhances the OKR system for production readiness. This sprint focuses on:
1. **Fixing technical debt** - Broken links, missing DELETE endpoint
2. **Eliminating modal duplication** - ~180 lines of duplicate code removed
3. **Enforcing best practices** - 5 active objectives limit
4. **Dynamic data rendering** - 100% backend-driven UI
5. **Maximum code reuse** - Use existing utilities, don't recreate

---

## SAFETY GUARANTEES (No Breaking Changes)

> **CRITICAL:** Every change must be backward compatible. No existing flows will break.

### Epic 0: SAFE - Fixes Existing Bugs

| Change | Before | After | Impact |
|--------|--------|-------|--------|
| `business-objectives.html` references | 404 error | Works | ✅ Bug fix only |
| DELETE endpoint in Planner Engine | 404 error | Works | ✅ Bug fix only |

**Verification:** These changes FIX broken functionality. No working feature is affected.

### Epic 1: SAFE - Same Behavior, Shared Code

| Guarantee | How We Ensure It |
|-----------|------------------|
| `team-ssi-view.js` still works | Same function signature: `showOKRConfigModal(config)` |
| `objectives.html` still works | Same UI, same button behavior, same API call |
| SSI data handling | Modal accepts **OPTIONAL** SSI data |
| API contract unchanged | Same endpoint: `POST /api/ai-okr/generate-from-company` |

**CRITICAL DISCOVERY:** Two pages send different data to the same endpoint:
- `team-ssi-view.js` sends: `{ company_id, overall_scores, teams, by_function, weak_areas, completion_stats, start_date, period }`
- `objectives.html` sends: `{ company_id, start_date, period }`

**Solution:** Shared modal accepts OPTIONAL SSI data. Backend already handles both (fetches SSI if not provided).

### Epic 2: SAFE - Additive Only

| Change | Type | Breaking? |
|--------|------|-----------|
| Expandable KRs | Enhancement | ✅ Shows MORE, not less |
| Delete button | New feature | ✅ Didn't exist before |
| Dynamic icons | Enhancement | ✅ Additive styling |
| Remove disabled buttons | Cleanup | ✅ Buttons were non-functional |

**Verification:** All changes are additive. No existing working feature is removed or modified.

### Backward Compatibility Checklist

Before merging any Epic, verify:

- [ ] `team-ssi-view.html` → "Generate OKRs" → Redirects to objectives ✅
- [ ] `objectives.html` → "Generate AI OKRs" → Creates objectives ✅
- [ ] `okr-creation-wizard.html` → Template flow unchanged ✅
- [ ] `assessment-results.html` → Assessment-based generation unchanged ✅
- [ ] All navigation links work (no 404s)
- [ ] Delete objective works (soft delete)
- [ ] 5 objective limit shows helpful message (not error)

---

## MAXIMUM REUSE MANDATE

> **CRITICAL:** All new code MUST use existing utilities. DO NOT duplicate.

### Existing Utilities to USE:

| Utility | Location | Use For |
|---------|----------|---------|
| `KarviaCommon.escapeHtml()` | `client/js/common.js:264` | All HTML escaping |
| `KarviaCommon.formatDate()` | `client/js/common.js:194` | All date formatting |
| `KarviaCommon.apiRequest()` | `client/js/common.js:68` | Authenticated API calls |
| `KarviaCommon.showLoading()` | `client/js/common.js:150` | Loading states |
| `Toast.show()` / `Toast.error()` | `client/js/toast.js` | All notifications |

### New Shared Modules to CREATE (Once, Use Everywhere):

| Module | File | Used By |
|--------|------|---------|
| OKR Generation Modal | `client/js/okr-generation-modal.js` | team-ssi-view.js, objectives.html |
| Confirmation Modal | `client/js/confirmation-modal.js` | objectives.js, teams.js, goals.js |
| Category Icon Map | `client/js/category-icons.js` | objectives.js, planning.html, dashboard |

### DO NOT Create:
- New `escapeHtml()` function - use `KarviaCommon.escapeHtml()`
- New `formatDate()` function - use `KarviaCommon.formatDate()`
- New toast system - use `Toast.show()`
- Custom loading spinners - use `KarviaCommon.showLoading()`

**Strategic Impact:**
- Production-ready OKR system
- Consistent UX across all pages
- Enforces OKR methodology (focus on 3-5 objectives)
- Reduced maintenance burden (~180 lines of duplicate code removed)
- Foundation for consultant dashboard and analytics

---

## SPRINT OBJECTIVES

### **Primary Goals**

1. **Fix Technical Debt** - Broken links, duplicate API clients
2. **Consolidate OKR Modal** - Merge duplicate modals in team-ssi-view.js and objectives.html
3. **Enforce Active Objectives Limit** - Maximum 5 active objectives per company
4. **Dynamic Objective Cards** - Show ALL KRs, backend-driven icons, no hardcoded data
5. **Add Delete Functionality** - Frontend UI for existing backend endpoint

### **Success Criteria**

- All broken `business-objectives.html` links fixed
- Single shared OKR generation modal used by both pages
- 5 active objectives limit enforced (frontend + backend)
- Objective cards show all Key Results dynamically
- Icons are category-based (no hardcoded emojis)
- Delete objective button works (UI for existing backend)
- Zero code duplication in OKR generation modal

---

## VERIFIED OKR ENTRY POINTS (From Codebase Audit)

### AI-Based OKR Generation:

| Entry Point | File | Endpoint | Action |
|-------------|------|----------|--------|
| Team SSI View | `team-ssi-view.js:737-998` | `/api/ai-okr/generate-from-company` | **CONSOLIDATE** (duplicate) |
| Objectives Page | `objectives.html:367-888` | `/api/ai-okr/generate-from-company` | **CONSOLIDATE** (duplicate) |
| Assessment Results | `assessment-results.html:446` | `/api/ai-okr/generate/:assessmentId` | **KEEP** (unique endpoint) |
| AI Plan Generation | `objectives.html:656` | `/api/ai-okr/generate-plan` | **KEEP** (for manual objectives) |

### Template-Based (NOT AI):

| Entry Point | File | Endpoint | Action |
|-------------|------|----------|--------|
| OKR Creation Wizard | `okr-creation-wizard.js` | `/api/objectives/suggestions` | **KEEP** (different flow entirely) |

### Conclusion:
- Only 2 pages have duplicate modal code: `team-ssi-view.js` and `objectives.html`
- `okr-creation-wizard` is template-based, NOT a duplicate - DO NOT deprecate
- `assessment-results.html` uses a different endpoint - DO NOT deprecate

---

## EPIC BREAKDOWN

### **Epic 0: Technical Debt Fix (NEW)**

**Story Points**: 3
**Duration**: 3 hours
**Priority**: CRITICAL - Must do first

**Scope:**
- Fix broken `business-objectives.html` references (4 files)
- **Implement DELETE endpoint in Planner Engine** (CRITICAL BUG)

**CRITICAL BUG DISCOVERED:**
The DELETE endpoint chain is broken:
- `server/routes/objectives.js:193` proxies to Planner Engine
- Planner Engine (`engines/planner/index.js`) has NO DELETE route
- Current delete calls return 404!

**Deliverables:**
- Fix 4 files referencing non-existent `business-objectives.html`:
  - `client/pages/scripts/business-assessment.js` (lines 527, 554)
  - `client/pages/scripts/okr-creation-wizard.js` (line 252)
  - `client/pages/quarterly-goals.html` (line 73)
- Add `DELETE /api/planning/objectives/:id` to `engines/planner/index.js`
  - Implement soft delete (set status to 'cancelled')
  - Handle cascade to Key Results

**NOTE:** API clients are NOT duplicates - keep both:
- `objectives-api-client.js` - Basic CRUD for objectives page
- `objective-api-client.js` - Dashboard + iBrain features

**Dependencies:** None (foundational)

---

### **Epic 1: OKR Generation Modal Consolidation (REVISED)**

**Story Points**: 8 (reduced from 10)
**Duration**: 12 hours (reduced from 16)
**Priority**: CRITICAL - Blocks other epics

**Scope (REVISED):**
- Extract shared modal from `team-ssi-view.js:showOKRConfigModal()` (lines 811-998)
- Create reusable `okr-generation-modal.js` module
- Replace duplicate modal in `objectives.html` (lines 367-496)
- Enforce 5 active objectives limit (frontend + backend)
- **DO NOT touch** okr-creation-wizard (different flow)
- **DO NOT touch** assessment-results (unique endpoint)

**What We're NOT Doing (Clarification):**
- NOT deprecating `okr-creation-wizard.html` - It's template-based, not AI
- NOT deprecating `assessment-results.html` - Uses unique `/generate/:assessmentId` endpoint
- NOT consolidating 5 entry points - Only 2 are actual duplicates

**Deliverables:**
- `client/js/okr-generation-modal.js` - Shared modal module (~180 lines)
- `server/middleware/validateObjectiveLimit.js` - Limit enforcement
- `GET /api/objectives/check-limit` - Limit check endpoint
- Updated: `objectives.html` - Use shared module, remove inline modal
- Updated: `team-ssi-view.js` - Use shared module

**Source Code References:**
- Duplicate 1: `client/pages/scripts/team-ssi-view.js` lines 811-998
- Duplicate 2: `client/pages/objectives.html` lines 367-496, 763-888 (inline JS)

**REUSE REQUIREMENTS:**
- Use `KarviaCommon.escapeHtml()` in modal rendering
- Use `KarviaCommon.formatDate()` for date display
- Use `Toast.show()` for notifications
- Use `KarviaCommon.apiRequest()` for API calls with auth

**Dependencies:** Epic 0 (clean codebase)

---

### **Epic 2: Objectives Page Enhancement**

**Story Points**: 8
**Duration**: 10 hours
**Priority**: HIGH - User-facing improvements

**Scope:**
- Show ALL Key Results (expandable design: show 2, click to show all)
- Dynamic icon system (backend category -> icon mapping)
- Remove disabled placeholder buttons (lines 230-235)
- Add delete objective button (uses Epic 0 backend + confirmation modal)
- Ensure 100% dynamic data (no hardcoded elements)

**Verified Existing Code:**
- Disabled buttons at: `objectives.js` lines 230-235
- KR slice at: `objectives.js` line 259 (`keyResults.slice(0, 2)`)
- Backend delete: `server/routes/objectives.js` line 193 → Planner Engine (Epic 0 fixes this)
- API client delete: `objectives-api-client.js` line 192

**Deliverables:**
- New: `client/js/confirmation-modal.js` - Reusable confirmation modal (replaces browser `confirm()`)
- New: `client/js/category-icons.js` - Centralized category → icon mapping
- Updated: `client/pages/scripts/objectives.js` - Expandable KRs, delete button
- Updated: `client/pages/planning.html` - Dynamic icons from backend

**REUSE REQUIREMENTS:**
- Use `KarviaCommon.escapeHtml()` - NOT inline escapeHtml()
- Use `Toast.error()` / `Toast.success()` - NOT custom toasts
- Use `KarviaCommon.formatDate()` - NOT inline formatDate()
- Use new `confirmation-modal.js` - NOT browser `confirm()`

**Dependencies:** Epic 0 (DELETE endpoint), Epic 1 (for consistent modal patterns)

---

### **Epic 3: Planning Page Integration**

**Story Points**: 3
**Duration**: 0 hours
**Priority**: DONE

**Status:** COMPLETED in Sprint 5 Epic 1 Phase 3

**Deliverables (Already Done):**
- Updated: `client/pages/planning.html` (lines 86-385)
- Functions: `loadCompanyConfiguration()`, `populateQuarterSelector()`

---

### **Epic 4: Consultant Dashboard Foundation**

**Story Points**: 6
**Duration**: 8-10 hours
**Priority**: LOW - Defer to Sprint 6

**Status:** DEFERRED - Focus on Epic 0-2 first

**Scope (For Sprint 6):**
- Create consultant dashboard page
- Company list view with OKR status
- Quick stats: Total objectives, completion rate, at-risk count
- Filter by company, status, period

---

## IMPLEMENTATION TIMELINE

### **Day 1: Technical Debt + Modal Start (8 hours)**

**Epic 0: Technical Debt + DELETE Bug (3h)**
- Fix `business-objectives.html` -> `objectives.html` (4 files) - 30 min
- Implement DELETE endpoint in Planner Engine - 1.5h
  - Add `DELETE /api/planning/objectives/:id` route
  - Soft delete (status='cancelled')
  - Handle Key Results cascade
- Test delete end-to-end - 1h

**Epic 1 Phase 1: Backend (3h)**
- Create `validateObjectiveLimit.js` middleware - 1h
- Add `GET /api/objectives/check-limit` endpoint - 1h
- Add limit check to existing create endpoint - 1h

**Epic 1 Phase 2: Shared Modal Start (3h)**
- Extract modal from `team-ssi-view.js:showOKRConfigModal()` - 2h
- Create `okr-generation-modal.js` module structure - 1h

---

### **Day 2: Modal Completion + Epic 2 Start (8 hours)**

**Epic 1 Phase 3: Modal Integration (4h)**
- Integrate shared modal into `team-ssi-view.js` - 1.5h
- Replace inline modal in `objectives.html` - 1.5h
- Add limit checks to modal - 1h

**Epic 1 Phase 4: Testing (2h)**
- Test both entry points work identically - 1h
- Test limit enforcement - 1h

**Epic 2 Phase A: Quick Wins (2h)**
- Remove disabled buttons (lines 230-235) - 15 min
- Add delete button UI - 1h
- Wire delete to existing API - 45 min

---

### **Day 3: Epic 2 Completion (6 hours)**

**Epic 2 Phase B: Expandable KRs (2h)**
- Update `renderKeyResultsPreview()` - 1h
- Add expand/collapse UI - 1h

**Epic 2 Phase C: Dynamic Icons (2h)**
- Create `getCategoryIcon()` helper - 1h
- Integrate into objective cards - 1h

**Epic 2 Phase D: Testing (2h)**
- Test all CRUD operations - 1h
- Test expandable KRs - 30 min
- Test dynamic icons - 30 min

---

### **Buffer: 2 hours**

For unexpected issues discovered during implementation.

---

## EFFORT DISTRIBUTION (REVISED)

| Epic | Hours | % of Sprint | Priority | Status |
|------|-------|-------------|----------|--------|
| Epic 0: Technical Debt + DELETE Bug | 3h | 11% | CRITICAL | NEW |
| Epic 1: Modal Consolidation | 12h | 44% | CRITICAL | Revised |
| Epic 2: Objectives Enhancement | 10h | 37% | HIGH | Unchanged |
| Epic 3: Planning Integration | 0h | 0% | DONE | Complete |
| Epic 4: Consultant Dashboard | 0h | 0% | DEFERRED | Sprint 6 |
| **Buffer** | 2h | 7% | - | - |
| **TOTAL** | **27h** | **100%** | | **3-4 days** |

**Original Estimate:** 40h (1 week)
**Revised Estimate:** 27h (3-4 days)
**Savings:** 13h due to accurate scoping

---

## QUALITY GATES

Every epic must pass these gates before completion:

### **1. Redundancy Check**
- Target: < 15% code duplication
- Epic 1: 0% (shared modal eliminates duplicates)
- Epic 2: < 10% (reuses Epic 1 components)

### **2. Link Validation**
- All navigation links resolve (no 404s)
- All redirects point to existing pages
- `business-objectives.html` references fixed

### **3. Dynamic Data Validation**
- All UI elements pull from backend
- No hardcoded data (emojis, limits, text)
- 100% configurable

### **4. Design Flaw Assessment**
- No breaking changes
- Cascade delete validated
- RBAC enforced
- Security reviewed

### **5. Production Readiness**
- Error handling comprehensive
- Loading states implemented
- User feedback clear
- Edge cases covered

---

## DEPENDENCIES & RISKS (REVISED)

### **Dependencies**

1. **Epic 1 depends on Epic 0**
   - Clean codebase needed before consolidation

2. **Epic 2 depends on Epic 1**
   - Shared modal needed for delete confirmation
   - Limit check used before showing create buttons

### **Risks & Mitigation (REVISED)**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| ~~Deprecating okr-creation-wizard breaks template flow~~ | N/A | N/A | **ELIMINATED** - Not deprecating |
| ~~Assessment-results unique flow lost~~ | N/A | N/A | **ELIMINATED** - Not deprecating |
| Delete cascade breaks data integrity | Medium | High | Thorough testing, soft delete only |
| Backend limit bypass | Low | Medium | Double validation (frontend + backend) |
| Shared module breaks existing pages | Low | High | Incremental rollout, test both pages |

---

## ACCEPTANCE CRITERIA (REVISED)

### **Sprint 5 is complete when:**

**Epic 0:**
- All `business-objectives.html` references point to `objectives.html`
- DELETE endpoint implemented in Planner Engine (soft delete with cascade)
- Delete functionality works end-to-end (tested)

**Epic 1:**
- Single shared modal used by `team-ssi-view.js` AND `objectives.html`
- Both call same endpoint with identical behavior
- 5 active objectives limit enforced (frontend + backend)
- `okr-creation-wizard` untouched (confirmed working)
- `assessment-results` untouched (confirmed working)

**Epic 2:**
- Objective cards show ALL Key Results (expandable)
- Icons are backend-driven (no hardcoded emojis)
- Disabled placeholder buttons removed
- Delete objective button works (calls existing backend)
- 100% dynamic data (no hardcoded values)

**Epic 3:**
- Already completed in Phase 3

**Quality:**
- All links resolve (no 404s)
- All tests pass
- No regressions in existing functionality

---

## SUCCESS METRICS (REVISED)

### **Technical Metrics**

- **Code Duplication:** ~180 lines -> 0 (shared modal)
- **Broken Links:** 4 -> 0
- **Critical Bugs Fixed:** 1 (DELETE endpoint)
- **Test Coverage:** > 80%

### **Business Metrics**

- **OKR Generation Success Rate:** > 95%
- **Objective Limit Compliance:** 100%
- **User Error Rate:** < 5%
- **Page Load Time:** < 2 seconds

### **User Experience Metrics**

- **Modal Consistency:** 100% (all use shared modal)
- **Error Message Clarity:** User-friendly messages
- **Feature Discoverability:** Clear entry points
- **Delete Safety:** Confirmation modal, soft delete

---

## NEXT SPRINT (Sprint 6)

**Building on Sprint 5 foundation:**

1. **Consultant Dashboard** (Epic 4 from Sprint 5)
2. **Advanced OKR Analytics** - Progress trends, forecasting
3. **Bulk Operations** - Archive multiple objectives, mass update
4. **Notifications** - OKR approaching deadline, at-risk alerts
5. **Mobile Optimization** - Responsive design improvements

---

## NOTES & ASSUMPTIONS (REVISED)

### **Verified Facts (From Codebase Audit)**

1. `okr-creation-wizard.js` uses industry templates, NOT AI generation
2. `assessment-results.html` uses unique endpoint `/api/ai-okr/generate/:assessmentId`
3. Only `team-ssi-view.js` and `objectives.html` have duplicate modal code
4. **CRITICAL BUG:** `DELETE /api/objectives/:id` proxies to Planner Engine which has NO DELETE route
   - `server/routes/objectives.js:193` → `engines/planner/index.js` (404!)
5. API clients are NOT duplicates - serve different purposes:
   - `objectives-api-client.js` - Basic CRUD for objectives page (Week 5)
   - `objective-api-client.js` - Dashboard + iBrain features (Week 4)
6. `business-objectives.html` does NOT exist but is referenced in 4 places
7. No "5 active objectives limit" exists anywhere in the codebase

### **Assumptions**

1. ~~Backend DELETE endpoint handles cascade properly~~ → **Must implement from scratch**
2. 5 objective limit aligns with OKR best practices
3. Soft delete is preferred over hard delete (set status='cancelled')
4. Category -> icon mapping is sufficient (no custom icons needed yet)
5. Planner Engine is the correct place for DELETE (maintains architectural consistency)

### **Out of Scope**

- Whitelabel icon customization (future sprint)
- Advanced RBAC for delete (current: any authenticated user can delete own objectives)
- Undo/restore deleted objectives (future enhancement)
- Bulk objective creation (future sprint)
- Import/export OKRs (future sprint)

---

## RELATED DOCUMENTS

### **Sprint Planning**
- [SPRINT-5-HANDOFF-DOCUMENT.md](./SPRINT-5-HANDOFF-DOCUMENT.md) - Progress tracking

### **Epic Documentation**
- [Epic 1: OKR Consolidation](./EPIC-1-OKR-CONSOLIDATION/)
- [Epic 2: Objectives Enhancement](./EPIC-2-OBJECTIVES-ENHANCEMENT/)
- [Epic 3: Planning Page](./EPIC-3-PLANNING-PAGE/)
- [Epic 4: Consultant Dashboard](./EPIC-4-CONSULTANT-DASHBOARD/)

### **Project Context**
- [CLAUDE.md](../../../../CLAUDE.md) - Project overview
- [Sprint 4 Handoff](../SPRINT-4/SPRINT4_HANDOFF_DOCUMENT.md) - Previous sprint

---

**Sprint Owner:** Development Team
**Stakeholders:** Product Owner, UX Designer, QA Team
**Status:** READY TO START (Post-Audit)
**Last Updated:** 2025-11-25
