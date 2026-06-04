# Sprint 18 Risk & Dependency Audit

**Audit Date**: March 10, 2026
**Auditor**: Claude Strategy Session
**Sprint**: 18 - AI-Ready Company Profile (Stage-Based Redesign)
**Status**: PRE-SPRINT AUDIT COMPLETE

---

## Executive Summary

| Category | Status | Risk Level |
|----------|--------|------------|
| Dependencies | ✅ ALL SATISFIED | LOW |
| Scope Feasibility | ⚠️ AMBITIOUS | MEDIUM |
| Technical Risk | ⚠️ MANAGEABLE | MEDIUM |
| Integration Risk | ✅ LOW IMPACT | LOW |

**Overall Assessment**: Sprint 18 is ready to execute with caution. The 71-point scope is ambitious for a 2-week sprint. Recommend prioritizing CP1 + CP6 first, then CP2 to secure quick wins.

---

## 1. Dependency Verification

### Sprint 17 Dependencies (ALL SATISFIED)

| Dependency | File | Status | Verification |
|------------|------|--------|--------------|
| ContextMaturityService | `server/services/ContextMaturityService.js` | ✅ EXISTS | 430+ lines, 5-stage calculation |
| Context Maturity Routes | `server/routes/context-maturity.js` | ✅ EXISTS | 5 endpoints, registered in index.js |
| Maturity Indicator Component | `client/js/maturity-indicator.js` | ✅ EXISTS | Reusable dashboard component |
| Prompt System | `server/prompts/` | ✅ EXISTS | 9 files, stage-aware prompts |
| BenchmarkProvider | `server/services/BenchmarkProvider.js` | ✅ EXISTS | Industry benchmarks for Stage 0 |
| OKROutcome Model | `server/models/OKROutcome.js` | ✅ EXISTS | Outcome tracking for Stage 3+ |
| Guidance Blocks | `server/prompts/guidance-builder.js` | ✅ EXISTS | Wired to ai-okr.js + planning.js |

### Existing Infrastructure (READY)

| Component | File | Lines | Status |
|-----------|------|-------|--------|
| company-profile.html | `client/pages/company-profile.html` | 498 | 3-tab structure, ready for transformation |
| company-profile.js | `client/js/company-profile.js` | 871 | Complex autosave, completion tracking |
| V4 Mockup | `SPRINT-18 (Planned)/MOCKUP_PROFILE_V4.html` | 1,811 | Approved design reference |
| Info Architecture | `SPRINT-18 (Planned)/COMPANY_INFORMATION_ARCHITECTURE.md` | 475 | Field taxonomy complete |

---

## 2. Risk Register

### RISK-001: Scope Creep (HIGH PROBABILITY)

| Attribute | Value |
|-----------|-------|
| **Risk** | 71 pts in 2 weeks with 1,811-line mockup integration |
| **Probability** | HIGH (70%) |
| **Impact** | Delivery delay, incomplete features |
| **Current State** | V4 mockup is 3.6x more complex than current HTML |

**Mitigation Strategy**:
1. Prioritize epics: CP1 (Navigation) → CP6 (Components) → CP2 (Discovery) → CP3 → CP4 → CP5
2. Implement CP5 (Locked Stages) as simple placeholders, not full previews
3. Track daily velocity - if Day 3 is behind, descope CP4/CP5
4. Consider splitting into Sprint 18A/18B if needed

**Contingency**: CP5 (6 pts) + CP4 (8 pts) can be deferred to Sprint 19 without breaking core functionality.

---

### RISK-002: JavaScript Preservation (MEDIUM PROBABILITY)

| Attribute | Value |
|-----------|-------|
| **Risk** | 871-line JS has complex autosave, completion, risk warning logic |
| **Probability** | MEDIUM (40%) |
| **Impact** | Data loss, broken autosave, completion ring malfunction |
| **Current State** | JS uses DOM selectors tied to current 3-tab structure |

**Analysis of Current JS Functions**:
```javascript
// MUST PRESERVE (Critical for data integrity)
setupAutosave()       // 2s debounced autosave
saveProfile()         // Main save function
collectFormData()     // Gathers all field values
updateCompletion()    // Weighted completion calculation
updateRiskWarnings()  // 3 risk indicator warnings

// MUST EXTEND (For stage navigation)
setupTabListeners()   // Add stage tab handlers
populateForm()        // Extend for new chip/slider inputs

// NEW (To be added)
showStageTab()        // Stage navigation
showSubTab()          // Sub-tab navigation
handleChipSelect()    // Chip input handler
handleSliderChange()  // Slider input handler
```

**Mitigation Strategy**:
1. Keep existing `setupTabListeners()` for sub-tabs, add `setupStageListeners()` separately
2. Preserve all existing form field IDs - don't rename
3. Add adapter functions for chips → select values
4. Add adapter functions for sliders → number inputs
5. Test autosave after EVERY file change

---

### RISK-003: CSS Class Conflicts (MEDIUM PROBABILITY)

| Attribute | Value |
|-----------|-------|
| **Risk** | V4 uses custom CSS variables, current uses Tailwind |
| **Probability** | MEDIUM (35%) |
| **Impact** | Broken layouts, overlapping styles |
| **Current State** | Tailwind inline styles vs custom CSS system |

**V4 CSS Variables**:
```css
:root {
  --navy: #1e3a5f;
  --purple: #8b5cf6;
  --gold: #d4a853;
  /* ... more */
}
```

**Current CSS**:
- Tailwind CDN inline classes
- Custom `.tab-btn`, `.tab-content`, `.metric-card` classes

**Mitigation Strategy**:
1. **Namespace ALL new classes** with `cp-` prefix (e.g., `cp-stage-tab`, `cp-chip`, `cp-slider`)
2. Add CSS variables to `:root` without conflicting names
3. Keep Tailwind for existing elements, use custom CSS for new components
4. Test on both desktop (1920px) and tablet (768px) breakpoints

---

### RISK-004: Tab Structure Migration (MEDIUM PROBABILITY)

| Attribute | Value |
|-----------|-------|
| **Risk** | Changing from 3 tabs to 5 stage tabs + sub-tabs |
| **Probability** | MEDIUM (40%) |
| **Impact** | Lost user context, navigation confusion |
| **Current State** | `tab-business`, `tab-numbers`, `tab-vision` |

**Current Structure**:
```
[The Business] [The Numbers] [The Vision]
     └── Tab content sections
```

**Target Structure**:
```
[Discovery] [Assessment] [Execution] [Learning🔒] [Mastery🔒]
     └── [The Business] [The Numbers] [The Vision]
              └── Section content
```

**Mitigation Strategy**:
1. Keep existing content sections (`tab-business`, `tab-numbers`, `tab-vision`) as sub-tab content
2. Wrap with stage tab containers
3. Stage 0 (Discovery) = Current 3 tabs as sub-tabs
4. Stage 1 (Assessment) = SSI + Culture + Financial sub-tabs
5. Stage 2 (Execution) = Targets sub-tab
6. Stages 3-4 = Locked preview only

---

### RISK-005: Culture/Financial Score Confusion (LOW PROBABILITY)

| Attribute | Value |
|-----------|-------|
| **Risk** | Users may expect Culture/Financial scores to work |
| **Probability** | LOW (20%) |
| **Impact** | Support tickets, user frustration |
| **Current State** | Master plan specifies UI-only placeholders |

**Mitigation Strategy**:
1. Add prominent "Coming Soon" badge on Culture Score sub-tab
2. Add "iBrain Integration Required" message on Financial Score sub-tab
3. Use grayed-out styling with diagonal stripe overlay
4. Include tooltip explaining future integration

---

### RISK-006: Autosave Break Risk (LOW PROBABILITY)

| Attribute | Value |
|-----------|-------|
| **Risk** | New chip/slider inputs may not trigger autosave |
| **Probability** | LOW (25%) |
| **Impact** | Data loss if user navigates away |
| **Current State** | Autosave listens to `input` events on form elements |

**Mitigation Strategy**:
1. Chips: Call `markDirty()` and `debouncedSave()` in chip click handler
2. Sliders: Call `markDirty()` on slider `input` event
3. Hidden inputs: Map chip selections to hidden `<select>` elements
4. Test: Fill form → wait 2s → check network tab for autosave request

---

## 3. Integration Points

### API Endpoints (Required)

| Endpoint | Status | Purpose |
|----------|--------|---------|
| `GET /api/context-maturity` | ✅ EXISTS | Get company's maturity stage |
| `GET /api/context-maturity/quick` | ✅ EXISTS | Quick stage-only response |
| `GET /api/assessments/company/:id/summary` | ✅ EXISTS | SSI scores for Assessment stage |
| `PUT /api/companies/:id` | ✅ EXISTS | Save profile (existing autosave) |

### New API Endpoint (Optional Enhancement)

| Endpoint | Status | Purpose | Sprint 18 Impact |
|----------|--------|---------|------------------|
| `GET /api/companies/:id/maturity` | OPTIONAL | Proxy to ContextMaturityService | Not blocking - use /api/context-maturity |

---

## 4. Technical Debt Considerations

### Existing Debt (Won't Fix in S18)

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Hardcoded risk thresholds | `company-profile.js:27-31` | Defer to Sprint 19 (config file) |
| Token naming inconsistency | `karvia_auth_token` vs `karvia_token` | Use existing, document |
| Tailwind CDN dependency | `company-profile.html:7` | Keep for now, bundle later |

### New Debt (Acceptable for S18)

| Issue | Justification |
|-------|---------------|
| Inline CSS for new components | Mockup-first approach, extract later |
| Culture/Financial placeholders | Future iBrain integration |
| Locked stages as static HTML | System-observed data not ready |

---

## 5. Recommended Execution Order

Based on risk analysis, execute epics in this order:

| Priority | Epic | Points | Risk Mitigation |
|----------|------|--------|-----------------|
| 1 | CP6: UI Components | 5 | Build foundation first |
| 2 | CP1: Stage Navigation | 18 | Core structure |
| 3 | CP2: Discovery Stage | 20 | Largest scope, most impact |
| 4 | CP3: Assessment Stage | 14 | SSI existing, PTH placeholder |
| 5 | CP4: Execution Stage | 8 | Targets (simple) |
| 6 | CP5: Locked Previews | 6 | Lowest priority, can defer |

**Day-by-Day Recommendation**:
- Days 1-2: CP6 + CP1 (23 pts) - Foundation
- Days 3-6: CP2 (20 pts) - Discovery stage
- Days 7-9: CP3 (14 pts) - Assessment stage
- Days 10-11: CP4 (8 pts) - Execution stage
- Days 12-13: CP5 (6 pts) - Locked previews
- Day 14: Testing & Polish

---

## 6. Testing Requirements

### Unit Tests (Recommended)

```javascript
// Test chip selection mapping
test('Chip selection maps to hidden select value', () => {
  selectChip('industry', 'financial_services');
  expect(getInputValue('companyIndustry')).toBe('financial_services');
});

// Test slider value mapping
test('Slider updates hidden input value', () => {
  moveSlider('employeeCount', 150);
  expect(getInputValue('employeeCount')).toBe('150');
});

// Test autosave trigger
test('Chip change triggers autosave', async () => {
  selectChip('revenueModel', 'recurring');
  await wait(2100); // Debounce time
  expect(mockFetch).toHaveBeenCalledWith('/api/companies/...');
});
```

### Manual Testing Checklist

- [ ] Stage navigation works (Discovery → Assessment → Execution)
- [ ] Sub-tabs work within each stage
- [ ] Locked stages show preview with unlock requirements
- [ ] Autosave triggers on chip/slider changes
- [ ] Completion ring updates in real-time
- [ ] Risk warnings still display correctly
- [ ] Mobile responsive (768px breakpoint)
- [ ] Industry-specific fields show/hide correctly

---

## 7. Blockers & Prerequisites

### No Blockers Identified

All Sprint 17 dependencies are satisfied. Sprint 18 can proceed immediately.

### Prerequisites Confirmed

| Prerequisite | Status | Date Verified |
|--------------|--------|---------------|
| Sprint 17 Complete | ✅ 70/70 pts | March 9, 2026 |
| V4 Mockup Approved | ✅ Ready | March 9, 2026 |
| Info Architecture | ✅ Complete | March 9, 2026 |
| Master Plan | ✅ Complete | March 9, 2026 |

---

## 8. Recommendations

### CRITICAL (Must Do)

1. **Test autosave after every coding session** - Don't break data persistence
2. **Namespace all new CSS classes with `cp-` prefix** - Prevent conflicts
3. **Keep existing field IDs unchanged** - Backend mapping depends on them

### HIGH (Should Do)

4. Execute CP6 first to build component library before integration
5. Track velocity daily - descope CP5 if behind by Day 7
6. Add "Coming Soon" badges prominently on placeholder features

### MEDIUM (Could Do)

7. Create separate CSS file for new components (currently inline in mockup)
8. Add loading states for maturity API calls
9. Consider A/B test framework for measuring adoption impact

---

## Audit Conclusion

**Sprint 18 is READY TO EXECUTE** with the following caveats:

1. **Scope is ambitious** - 71 pts in 2 weeks requires focused execution
2. **JS preservation is critical** - Surgical additions, not rewrites
3. **CSS namespacing required** - Prevent Tailwind conflicts
4. **Autosave testing mandatory** - Test after every session

**Recommended First Session**: `/coding` → Epic CP6 (UI Components) + Epic CP1-1 (Stage Tabs)

---

**Document Version**: 1.0
**Last Updated**: March 10, 2026
**Next Review**: After Day 3 (velocity check)
