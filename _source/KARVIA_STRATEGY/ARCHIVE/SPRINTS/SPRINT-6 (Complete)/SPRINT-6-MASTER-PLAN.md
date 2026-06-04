# Sprint 6 Master Plan

**Project**: Karvia Business OKR Platform
**Sprint**: 6 (Starting Nov 26, 2025)
**Duration**: 10 days (2 weeks)
**Total Story Points**: 71 points
**Goal**: Complete Sprints 4-5 Carryover + SSI Diagnostic System + Production Polish

---

## Executive Summary

Sprint 6 focuses on completing carryover work from Sprints 4-5 and preparing the platform for production readiness. This includes critical bug fixes, code consolidation, and completing core features.

### Sprint Status Overview

| Sprint | Planned | Completed | Remaining | Status |
|--------|---------|-----------|-----------|--------|
| Sprint 3 | 71 pts | 89 pts | 0 pts | ✅ 125% Complete |
| Sprint 4 | 73 pts | 26 pts | 47 pts | 🟡 36% Complete |
| Sprint 5 | 27 pts | 3 pts | 24 pts | 🟡 11% Complete |
| **Total Carryover** | - | - | **71 pts** | **Sprint 6 Scope** |

---

## Critical Issues Fixed

### Fixed Dec 1, 2025 (Epic 5 Complete)
1. ✅ **business-objectives.html References** - Fixed redirect in ai-okr.js:59 + CLAUDE.md refs
2. ✅ **Timeline "At Risk" for New Objectives** - Added 7-day grace period in Objective.js
3. ✅ **Manager Dropdown Missing Team Members** - Added `populateOwnerDropdown()` in objectives.html
4. ✅ **Target Year Hardcoded** - Added `initTargetYearDropdown()` for dynamic years

### Fixed Nov 26, 2025
1. ✅ **DELETE Endpoint Not Working** - Modified `server/routes/objectives.js` to use MongoDB directly
2. ✅ **Planning Page Week Field Mismatch** - Fixed `g.week_number` → `g.week` in `planning.html:984`
3. ✅ **Token Name Inconsistency** - Updated `common.js` to check `karvia_auth_token` first
4. ✅ **Deleted Objectives Still Visible** - Added `status: { $ne: 'cancelled' }` filter
5. ✅ **Cascade Delete for Objectives** - DELETE permanently removes Objective + Goals + Tasks

### Remaining Critical Issues
1. ✅ **OKR 400 Error from objectives.html** - Fixed by Epic 1: Backend now auto-fetches SSI data if not provided
2. ✅ **Active Objectives Limit** - Already working in okr-generation-modal.js via `/api/objectives/check-limit`
3. ~~**82% OKR Modal Duplication**~~ - NOT an issue: shared modal exists, only API call differs (expected)

**All P0 Critical Issues RESOLVED** ✅

---

## Comprehensive Audit Results (Nov 26 + Dec 1 Update)

**See**: [SPRINT-6-COMPREHENSIVE-AUDIT.md](./SPRINT-6-COMPREHENSIVE-AUDIT.md)

### Key Findings

| Finding | Impact | Savings |
|---------|--------|---------|
| Epic 5 COMPLETED in 45min (was 6h) | HIGH | -5.25h |
| Epic 1 Phases 2 & 3 REDUNDANT (Dec 1 audit) | HIGH | -2h |
| Epic 2 icons ALREADY EXIST in `category-icons.js` | HIGH | -5h |
| Epic 3 has 70% routes done in `businesses.js` | HIGH | -4h |
| No conflicts between epics | LOW | Parallel OK |

### Revised Hours (Dec 1 Update)

| Epic | Original | Nov 26 | Dec 1 | Status |
|------|----------|--------|-------|--------|
| Epic 5 | 8h | 6h | **0.75h** | ✅ **COMPLETE** |
| Epic 1 | 4.5h | 4.5h | **0.5h** | ✅ **COMPLETE** |
| Epic 2 | 13h | 8h | **3h** | ✅ **COMPLETE** |
| Epic 3 | 12h | 8h | - | ⏳ **DEFERRED → Sprint 7** |
| Epic 7 | 14h | 14h | **2h** | ✅ **COMPLETE** |
| **Total** | 51.5h | 40.5h | **6.25h** | ✅ **Sprint 6 COMPLETE** |

**Sprint 6 Adjusted Scope**: 58 pts (was 71 pts, -13 pts deferred)

### Optimal Implementation Order (Updated)

```
1. Epic 5 (Bug Fixes)      → ✅ COMPLETE (Dec 1)
2. Epic 1 (OKR Fix)        → ✅ COMPLETE (Dec 1)
3. Epic 2 (Objectives)     → ✅ COMPLETE (Dec 1)
4. Epic 7 (SSI Diagnostic) → ✅ COMPLETE (Dec 1)
5. Epic 3 (Consultant)     → ⏳ DEFERRED TO SPRINT 7
```

---

## Sprint 6 Epics

### Epic 1: Complete Sprint 5 - OKR Consolidation (10 pts) ✅ COMPLETE
**Priority**: P0 - CRITICAL
**Estimated Hours**: 2.5h → **Actual: 30min**
**Status**: ✅ **COMPLETE** (Dec 1, 2025)

#### Audit Findings (Nov 26 + Dec 1 Re-Audit)
See: [EPIC-1-OKR-CONSOLIDATION-AUDIT.md](./EPIC-1-OKR-CONSOLIDATION-AUDIT.md)

**Root Cause of objectives.html 400 Error**:
- `generate-from-company` endpoint requires `overall_scores` in request body
- objectives.html only sends `company_id`, `start_date`, `period` (no SSI data)
- **Solution**: Backend auto-fetch SSI data if not provided

**Already Working** (92% code reuse):
- ✅ Shared modal `okr-generation-modal.js` (351 lines)
- ✅ team-ssi-view.js uses shared modal correctly
- ✅ Backend limit middleware `/api/objectives/check-limit`
- ✅ OpenAI integration with timeout
- ✅ Company okr_generation flag

#### Dec 1 Re-Audit: Phases 2 & 3 REMOVED (Redundant)

| Original Phase | Issue Found | Decision |
|----------------|-------------|----------|
| Phase 2: Duration Dropdown | Current "quarterly/yearly" works. New Q1/Q1-Q2/Q1-Q3 options would require backend OKR count logic changes - semantic mismatch with existing flow | ❌ **SKIP** - 1h saved |
| Phase 3: Data Sources Selection | Backend auto-fetches SSI and falls back to Company Profile automatically. User checkboxes add UI complexity without benefit | ❌ **SKIP** - 1h saved |

**Savings**: 2h removed (4.5h → 2.5h)

#### Simplified Implementation Plan:

**Phase 1: Backend Auto-Fetch SSI** (2h) - CRITICAL & ONLY PHASE NEEDED
- Modify `/server/routes/ai-okr.js` line 996
- Make `overall_scores` optional
- Add `fetchSSIDataForCompany()` helper function
- Add `getCompanyProfileData()` fallback
- Update variable references to use fetched data

**Phase 2: Testing** (30min)
- Test generate from team-ssi-view.html (with SSI data)
- Test generate from objectives.html (auto-fetch, no SSI)
- Verify fallback to Company Profile works
- Test limit enforcement still works

#### Files to Modify (1 only):
| File | Changes |
|------|---------|
| `/server/routes/ai-okr.js` | Auto-fetch SSI logic, make overall_scores optional |

#### Files NOT to Modify (Keep As-Is):
| File | Reason |
|------|--------|
| `/client/js/okr-generation-modal.js` | Current quarterly/yearly UI works fine |
| `/client/pages/objectives.html` | Already sends correct data |
| `/client/pages/scripts/team-ssi-view.js` | Already working perfectly |
| `/server/routes/assessments.js` | No new endpoint needed |

---

### Epic 2: Complete Sprint 5 - Objectives Enhancement (8 pts) ✅ COMPLETE
**Priority**: P0 - CRITICAL
**Estimated Hours**: 8h → **Actual: 3h**
**Status**: ✅ **COMPLETE** (Dec 1, 2025)

#### Audit Findings (Already Implemented)
- ✅ **Icons ALREADY EXIST** in `client/js/category-icons.js` (161 lines)
- ✅ **Backend DELETE working** (fixed with cascade in Sprint 6)
- ✅ **KR Expandability** already working in objectives.js

#### Completed Tasks (Dec 1):
1. ✅ **Delete Confirmation Modal** (`objectives.html:294-331`)
   - Professional styled modal with warning icon
   - Shows objective title being deleted
   - Clear warning about cascade deletion
   - Cancel and Delete buttons

2. ✅ **Delete Functions** (`objectives.js:483-538`)
   - `deleteObjective()` - Opens modal, stores pending ID
   - `closeDeleteConfirmModal()` - Closes modal, clears state
   - `confirmDeleteObjective()` - Performs API delete

3. ✅ **KR Toggle Enhancement** (`objectives.js:296-312`)
   - Shows completion count: "Show 3 more KRs (1 completed)"
   - `hiddenCompleted` counts completed KRs in hidden section

4. ✅ **Testing** - Syntax validation passed

---

### Epic 3: Complete Sprint 4 - Consultant Dashboard (13 pts) → DEFERRED
**Priority**: P1 - HIGH
**Estimated Hours**: 8h (reduced from 12h after audit)
**Status**: ⏳ **DEFERRED TO SPRINT 7** (Dec 1, 2025)

#### Deferral Reason
Prioritized P0 bug fixes (Epic 5) and OKR consolidation (Epic 1) first. Epic 3 is not blocking any other features.

**See**: [SPRINT-7-MASTER-PLAN.md](../SPRINT-7/SPRINT-7-MASTER-PLAN.md)

#### Audit Findings (Preserved for Sprint 7)
- ✅ **70% routes exist** in `server/routes/businesses.js` (482 lines)
- ✅ `GET /:id`, `GET /:id/stats`, `GET /:id/users`, `GET /:id/teams` all working
- Only need: Multi-company listing + Dashboard UI

---

### Epic 4: Complete Sprint 4 - Weekly Goals Calendar (13 pts) - DEFERRED
**Priority**: P2 - DEFERRED TO SPRINT 7
**Estimated Hours**: 10h
**Status**: Deferred

> **Deferral Note**: Moved to Sprint 7 to prioritize SSI Diagnostic System (Epic 7) and OKR Consolidation (Epic 1).

#### Tasks (Sprint 7):
1. Calendar View Component (4h)
2. Goal Assignment UI (3h)
3. Status Management (2h)
4. Testing (1h)

---

### Epic 5: Bug Fixes & Technical Debt (8 pts) ✅ COMPLETE
**Priority**: P0 - CRITICAL
**Estimated Hours**: 6h → **Actual: 45min**
**Status**: ✅ **COMPLETE** (Dec 1, 2025)

#### All Bugs Fixed (Dec 1):
| Bug | File | Priority | Status | Fix Applied |
|-----|------|----------|--------|-------------|
| business-objectives.html references | ai-okr.js:59, CLAUDE.md | P0 | ✅ Fixed | Changed redirect to `/pages/objectives.html` |
| Timeline "At risk" for new objectives | Objective.js:315-330 | P1 | ✅ Fixed | Added 7-day grace period for new objectives |
| Manager dropdown missing team members | objectives.html | P1 | ✅ Fixed | Added `populateOwnerDropdown()` using `/api/businesses/:id/users` |
| Target year hardcoded | objectives.html:261-263 | P2 | ✅ Fixed | Added `initTargetYearDropdown()` - dynamic year selection |

#### Previously Fixed (Nov 26):
- ✅ Token names consolidated → `karvia_auth_token`
- ✅ DELETE cascade working
- ✅ Planning page week field
- ✅ Deleted objectives visibility

#### Files Modified (Dec 1):
| File | Changes |
|------|---------|
| `server/routes/ai-okr.js:59` | Redirect path fixed |
| `CLAUDE.md:220, 304` | Documentation references fixed |
| `server/models/Objective.js:315-330` | 7-day grace period for health_status |
| `client/pages/objectives.html` | Owner dropdown + dynamic target year |

---

### Epic 6: Production Polish (13 pts)
**Priority**: P1 - HIGH
**Estimated Hours**: 10h

#### Tasks:
1. **Loading States** (2h)
   - Add skeleton loaders to all cards
   - Consistent loading indicators

2. **Error Handling** (2h)
   - User-friendly error messages
   - Retry mechanisms
   - Offline state handling

3. **Performance Optimization** (3h)
   - Lazy loading for large lists
   - Image optimization
   - API response caching

4. **Accessibility** (2h)
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

5. **Documentation** (1h)
   - API documentation update
   - User guide updates

---

### Epic 7: SSI Diagnostic Scoring System (13 pts) ✅ COMPLETE
**Priority**: P1 - HIGH
**Estimated Hours**: 14h → **Actual: 2h**
**Status**: ✅ **COMPLETE** (Dec 1, 2025)
**Spec**: [EPIC-7-SSI-DIAGNOSTIC-SYSTEM.md](./EPIC-7-SSI-DIAGNOSTIC-SYSTEM.md)

#### Overview
Build a completely isolated diagnostic engine that generates comprehensive SSI reports at 4 levels (Individual, Team, Function, Company) plus a unified Diagnostic Report for executives/consultants. This report powers OKR generation with contextual insights.

#### Completed Tasks (Dec 1):
1. ✅ **DiagnosticEngine.js** (~350 lines) - Core scoring engine with 4-level reports
2. ✅ **IndustryConfig.js** (~180 lines) - Industry adjacency mappings for 8 industries
3. ✅ **InsightDetector.js** (~280 lines) - Pattern detection (dimension imbalance, cross-function gaps, role perception)
4. ✅ **ReportGenerator.js** (~200 lines) - Report formatting for API, modal, export
5. ✅ **DiagnosticReport.js model** (~150 lines) - MongoDB schema with history tracking
6. ✅ **diagnostic-reports.js routes** (~250 lines) - Full REST API with eligibility, generate, export
7. ✅ **Frontend integration** - Button + compact modal in team-ssi-view.html/js
8. ✅ **OKR integration** - Diagnostic insights fed to ai-okr.js OpenAI prompt

#### Key Features:
- **80% Completion Gate**: Reports only available after 80% assessment completion
- **Complete Isolation**: New service, no imports from existing SSIScoringService
- **Industry-Aware**: Adjacent function analysis based on company industry
- **Compact UI**: Minimal modal footprint, scannable in 30 seconds

#### Files to Create (NEW):
| File | Lines | Purpose |
|------|-------|---------|
| `server/services/diagnostic/DiagnosticEngine.js` | ~350 | Main scoring engine |
| `server/services/diagnostic/IndustryConfig.js` | ~150 | Industry adjacency mappings |
| `server/services/diagnostic/InsightDetector.js` | ~200 | Pattern detection algorithms |
| `server/services/diagnostic/ReportGenerator.js` | ~250 | Report formatting (5 types) |
| `server/models/DiagnosticReport.js` | ~60 | MongoDB schema |
| `server/routes/diagnostic-reports.js` | ~150 | API endpoints |

#### Files to Modify (MINIMAL):
| File | Change |
|------|--------|
| `server/index.js` | Add route import (+2 lines) |
| `team-ssi-view.js` | Add button + modal methods (+120 lines) |

#### Tasks:
1. **DiagnosticEngine.js** (3h) - Core engine with scoring, grouping
2. **IndustryConfig.js** (1h) - Industry adjacency mappings
3. **InsightDetector.js** (2h) - Pattern detection algorithms
4. **ReportGenerator.js** (2h) - Report formatting (all 5 types)
5. **DiagnosticReport.js model** (0.5h) - MongoDB schema
6. **diagnostic-reports.js routes** (1.5h) - API endpoints
7. **Frontend integration** (2h) - Button + compact modal
8. **OKR integration** (1h) - Feed diagnostic to ai-okr.js
9. **Testing** (1h) - All report types + gate

---

## Sprint Schedule

### Week 1 (Days 1-5)

| Day | Focus | Epics | Points |
|-----|-------|-------|--------|
| Day 1 | Critical Fixes | Epic 5 (Bugs) | 4 pts |
| Day 2 | OKR Consolidation | Epic 1 (Phases 1-3) | 5 pts |
| Day 3 | OKR Consolidation | Epic 1 (Phases 4-6) | 5 pts |
| Day 4 | Objectives Enhancement | Epic 2 (Tasks 1-3) | 5 pts |
| Day 5 | Objectives Enhancement | Epic 2 (Tasks 4-5) | 3 pts |

**Week 1 Total**: 22 pts

### Week 2 (Days 6-10)

| Day | Focus | Epics | Points |
|-----|-------|-------|--------|
| Day 6 | Consultant Dashboard | Epic 3 (Tasks 1-2) | 7 pts |
| Day 7 | Consultant Dashboard | Epic 3 (Tasks 3-4) | 6 pts |
| Day 8 | SSI Diagnostic System | Epic 7 (Tasks 1-3) | 6 pts |
| Day 9 | SSI Diagnostic System | Epic 7 (Tasks 4-7) | 7 pts |
| Day 10 | Production Polish + Buffer | Epic 6 (partial) | 6 pts |

**Week 2 Total**: 32 pts

> **Note**: Epic 4 (Weekly Goals Calendar, 13 pts) deferred to Sprint 7

---

## Success Criteria

### Must Have (P0)
- [ ] All P0 bugs fixed
- [ ] DELETE objectives working in production
- [ ] OKR generation limit enforced (5 max)
- [ ] OKR modal code consolidated (<20% duplication)
- [ ] All navigation paths working

### Should Have (P1)
- [ ] Consultant dashboard functional
- [ ] Weekly goals calendar view
- [ ] All P1 bugs fixed
- [ ] Loading states on all pages
- [ ] Error handling improved

### Nice to Have (P2)
- [ ] Drag-and-drop goal reorganization
- [ ] Export functionality
- [ ] Advanced analytics

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Planner Engine dependency | HIGH | LOW | Already mitigated - direct MongoDB access |
| Time overrun on consolidation | MEDIUM | MEDIUM | Phase-based approach allows partial completion |
| Production deployment issues | HIGH | LOW | Staging environment testing |
| Multi-tenant data leak | CRITICAL | LOW | Strict company_id filtering in all queries |

---

## Definition of Done

### Feature Completion
- [ ] Code implemented and working
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Code review completed
- [ ] Documentation updated

### Quality Gates
- [ ] No critical bugs
- [ ] No console errors in production
- [ ] Mobile responsive
- [ ] Performance acceptable (<3s page load)
- [ ] Multi-tenant isolation verified

---

## Files Modified This Session (Nov 26)

### Critical Fixes Already Applied:
1. `server/routes/objectives.js` - DELETE route now uses MongoDB directly
2. `client/pages/planning.html` - Fixed week field mismatch
3. `client/js/common.js` - Fixed token name inconsistency

### Files to Monitor:
- `client/pages/scripts/team-ssi-view.js` - OKR modal source
- `client/js/okr-generation-modal.js` - Shared modal module
- `client/pages/objectives.html` - Objectives page
- `server/middleware/validateObjectiveLimit.js` - Limit enforcement

---

## Handoff Notes

### Starting Sprint 6:
1. Read this document completely
2. Check `SESSION_LOG.md` for latest updates
3. Verify critical fixes are deployed to production
4. Start with Epic 5 (Bug Fixes) to clear blockers
5. Proceed with Epics 1-2 (Sprint 5 completion)

### Key Technical Decisions:
- **MongoDB Direct Access**: Preferred over Planner Engine proxy for reliability
- **Soft Delete**: All deletions use status='cancelled', not hard delete
- **Token Standard**: Use `karvia_auth_token` as primary token name
- **Multi-tenant**: Always filter by `company_id` in queries

---

## Metrics to Track

| Metric | Current | Target | Notes |
|--------|---------|--------|-------|
| Sprint 4 Completion | 36% | 100% | +47 pts needed |
| Sprint 5 Completion | 11% | 100% | +24 pts needed |
| Code Duplication | 82% | <20% | OKR modal consolidation |
| Critical Bugs | 1 | 0 | business-objectives.html |
| Test Coverage | ~20% | 60% | Add unit tests |
| API Endpoints | 114 | 120 | Add consultant APIs |

---

*Last Updated: November 26, 2025*
*Sprint 6 Planning Complete*
