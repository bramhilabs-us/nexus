# Sprint 14 Master Plan V2: Assessment Hub UI Redesign

**Sprint Duration**: 5 days (focused sprint)
**Total Points**: 27 pts
**Focus**: UI-Only Changes - Assessment Hub + iBrain Visual Polish
**Reference Mockup**: `sprint_mockups/sprint-14/my-clients-cards-v7.html`

---

## Sprint 14 Goal (Single Statement)

> **Surgically redesign the Assessment Hub UI to match V7 mockup while maintaining all existing functionality, with zero backend changes.**

---

## Sprint Philosophy

| Principle | Application |
|-----------|-------------|
| **Surgical** | Only change what's necessary for V7 |
| **UI-Only** | No backend, no API, no database changes |
| **No Hardcoding** | All thresholds/colors/mappings configurable |
| **Scalable** | CSS classes reusable across app |
| **Zero Regression** | Existing features must continue working |

---

## Scope Summary

### Epic MC-UI: Assessment Hub Redesign (19 pts)

| Story | Points | Description |
|-------|--------|-------------|
| MC-UI-1 | 3 | Header KPI consolidation |
| ~~MC-UI-2~~ | ~~1~~ | ~~Tab reordering~~ → **DEFERRED to Backlog** |
| MC-UI-3 | 4 | Client card structure |
| MC-UI-4 | 3 | SSI ring component |
| MC-UI-5 | 2 | Culture emoji component |
| MC-UI-6 | 2 | Card states & borders |
| MC-UI-7 | 2 | Responsive layout |
| MC-UI-8 | 1 | Add Client button styling |
| MC-UI-9 | 2 | Template filter (Global/My Templates) |

### Epic I-P: iBrain Visual Polish (8 pts)

| Story | Points | Description |
|-------|--------|-------------|
| I-P-1 | 3 | iBrain button standardization |
| I-P-2 | 2 | Loading state consistency |
| I-P-3 | 2 | Badge & tooltip styling |
| I-P-4 | 1 | Documentation update |

---

## Canonical Reference

**Primary Mockup**: `my-clients-cards-v7.html`
```
Location: KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-14/my-clients-cards-v7.html
```

All UI implementation MUST match this file. Deviations require explicit approval.

---

## Detailed Specifications

### Assessment Hub Header (V7 Design)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Assessments Hub                    📁 5        📊 2 pend · 3 sent · 8 done│
│ Manage assessments...                Templates      Assessments          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Data Source**: Existing `assessmentHubData.stats` (no new API)

### Tab Order (V7 Design)

1. 🏢 **My Clients** [6] ← Active by default for consultants
2. 📁 My Templates
3. 📤 Sent by Me
4. ✨ Assigned to Me [2]

### Client Card (V7 Design)

```
┌────────────────────────────────────────────────────────────────┐
│ [M] miMobi ●                              [SSI Ring ⚡🛡🧠]    │
│     Technology / SaaS                                          │
├────────────────────────────────────────────────────────────────┤
│ OBJECTIVE                                              [😐]    │
│ "Set up miMobi in Bangalore with 1 paying customer"    3D     │
├────────────────────────────────────────────────────────────────┤
│ [👤] Ravindra MD                              [Message]        │
│      Primary Contact                                           │
└────────────────────────────────────────────────────────────────┘
```

---

### Template Filter (MC-UI-9)

**Current State**: Single "All Templates" dropdown exists but doesn't filter

**Target State**: Replace dropdown with filter options:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Select a template to send to your team                                  │
│                                                                         │
│ [All Templates ▼]  ←─── Filter dropdown                                │
│   ├── All Templates                                                     │
│   ├── Global Templates                                                  │
│   └── My Templates                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

**Filter Logic** (UI-only, no backend change):
- **All Templates**: Show all templates (current behavior)
- **Global Templates**: Filter where `is_global === true`
- **My Templates**: Filter where `is_global === false` (user-created)

**Implementation**:
```javascript
// Add to assessment-hub.js
function filterTemplates(filterType) {
  const allTemplates = window.assessmentHubData.templates;

  switch(filterType) {
    case 'global':
      return allTemplates.filter(t => t.is_global === true);
    case 'my-templates':
      return allTemplates.filter(t => t.is_global === false);
    default:
      return allTemplates;
  }
}
```

**UI Updates**:
- Dropdown options: All Templates, Global Templates, My Templates
- Badge styling: "Global" (blue) vs "Custom" (purple) on template cards
- Empty state: "No custom templates yet. Create your first template!" for My Templates filter

---

## Files to Modify

### Assessment Hub Changes

| File | Action | Est. Lines |
|------|--------|------------|
| `client/pages/assessment-hub.html` | Modify | ~50 |
| `client/pages/scripts/assessment-hub.js` | Modify | ~180 |
| `client/css/s14-assessment-hub.css` | Create | ~300 |

### iBrain Polish Changes

| File | Action | Est. Lines |
|------|--------|------------|
| `client/css/s14-ibrain.css` | Create | ~100 |
| `client/js/components/ibrain-utils.js` | Modify | ~30 |

### Configuration

| File | Action | Content |
|------|--------|---------|
| `client/config/ui-config.js` | Create | All configurable values |

**Total New Code**: ~660 lines
**No Backend Files Changed**: ✅

---

## Configuration Externalization

**All values in `client/config/ui-config.js`**:

```javascript
const SPRINT_14_UI_CONFIG = {
  // SSI Ring Colors
  ssi: {
    thresholds: { high: 7, medium: 5 },
    colors: {
      high: '#22c55e',
      medium: '#fbbf24',
      low: '#ef4444',
      empty: '#cbd5e1'
    }
  },

  // Culture Emoji Mapping
  culture: {
    thresholds: [
      { min: 80, emoji: '😊', label: 'Thriving' },
      { min: 65, emoji: '🙂', label: 'Healthy' },
      { min: 50, emoji: '😐', label: 'Developing' },
      { min: 35, emoji: '😟', label: 'Needs Attention' },
      { min: 0, emoji: '😰', label: 'Critical' }
    ],
    pending: { emoji: '🔮', label: 'Pending' }
  },

  // Card States
  states: {
    active: { border: '#e2e8f0', status: '#22c55e', bg: '#f8fafc' },
    atRisk: { border: '#fde68a', status: '#f59e0b', bg: '#fefce8' },
    onboarding: { border: '#bfdbfe', status: '#3b82f6', bg: '#eff6ff' }
  },

  // Grid Breakpoints
  breakpoints: {
    desktop: { minWidth: 1024, columns: 3 },
    tablet: { minWidth: 640, columns: 2 },
    mobile: { minWidth: 0, columns: 1 }
  },

  // Default Tabs by Role
  defaultTab: {
    CONSULTANT: 'my-clients',
    BUSINESS_OWNER: 'assigned-to-me',
    default: 'assigned-to-me'
  },

  // iBrain Theme
  ibrain: {
    primary: '#1e3a5f',
    hover: '#2d5a87',
    text: '#ffffff'
  }
};
```

---

## Quality Gates

### Gate 1: Design Match
- [ ] V7 mockup comparison - pixel-level match
- [ ] All card states render correctly
- [ ] Responsive breakpoints work

### Gate 2: Data Integrity
- [ ] KPI counts accurate
- [ ] SSI colors map correctly
- [ ] Culture emoji maps correctly
- [ ] Card data populates from existing API
- [ ] Template filter correctly separates Global vs My Templates
- [ ] Empty state shows when no templates match filter

### Gate 3: No Regression
- [ ] Tab switching works
- [ ] Card click navigates
- [ ] Add Client opens modal
- [ ] No console errors
- [ ] Page load < 2s

### Gate 4: Configuration
- [ ] Zero hardcoded values
- [ ] All thresholds in config
- [ ] Colors changeable via config

---

## Dependencies

| Dependency | Status | Required Before |
|------------|--------|-----------------|
| Sprint 13 complete | ✅ Done | Sprint start |
| V7 mockup (`my-clients-cards-v7.html`) | ✅ Done | Development |
| Existing assessment-hub APIs | ✅ Available | Development |

### No New Dependencies
- No new npm packages
- No new backend APIs
- No new database fields

---

## Day-by-Day Execution Plan

### Day 1: Foundation
**Focus**: CSS architecture and header

| Task | Owner | Deliverable |
|------|-------|-------------|
| Create `s14-assessment-hub.css` | Dev | Empty file with structure |
| Create `ui-config.js` | Dev | All config values |
| Implement header flex layout | Dev | Header matches V7 |
| Implement KPI components | Dev | Templates + Assessments counts |

**Gate**: Header matches V7 mockup

### Day 2: Tabs & Grid
**Focus**: Tab reordering and grid layout

| Task | Owner | Deliverable |
|------|-------|-------------|
| Reorder tabs in HTML | Dev | Correct order |
| Update tab CSS | Dev | Navy active state |
| Update tab JS | Dev | Default by role |
| Add clients grid CSS | Dev | 3/2/1 columns |

**Gate**: Tabs in correct order, grid responsive

### Day 3: Card Component
**Focus**: Card structure and SSI ring

| Task | Owner | Deliverable |
|------|-------|-------------|
| Create card HTML template | Dev | Matches V7 structure |
| Implement SSI ring SVG generator | Dev | Function outputs SVG |
| Add card CSS | Dev | All card styles |
| Wire card state classes | Dev | active/atRisk/onboarding |

**Gate**: Cards render with correct structure

### Day 4: Culture & States
**Focus**: Culture emoji and card states

| Task | Owner | Deliverable |
|------|-------|-------------|
| Implement culture emoji mapping | Dev | Function + CSS |
| Add 3D effect CSS | Dev | Shadow + perspective |
| Test all card states | QA | All states render |
| Wire data to cards | Dev | Real data displays |

**Gate**: All cards display real data correctly

### Day 5: Polish & QA
**Focus**: Responsive, cross-browser, final QA

| Task | Owner | Deliverable |
|------|-------|-------------|
| Responsive testing (3 breakpoints) | QA | Pass all breakpoints |
| Cross-browser testing | QA | Chrome/Firefox/Safari |
| V7 comparison | Product | Approve match |
| No regression testing | QA | All existing features work |
| Documentation update | Dev | Update CLAUDE.md |

**Gate**: All quality gates pass

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| CSS conflicts | Medium | Medium | Use `s14-` prefix for all new classes |
| JS rendering breaks | Low | High | Test each card type separately |
| Mobile layout issues | Medium | Medium | Test on real devices |
| Data format changes | Low | Low | Use existing API responses only |

---

## Rollback Plan

If critical issues in production:

1. **Immediate**: Revert these 3 files to previous version:
   - `assessment-hub.html`
   - `assessment-hub.js`
   - Remove `s14-assessment-hub.css`

2. **Redeploy**: Push revert commit

3. **Investigate**: Debug in development environment

All changes isolated to 3 files for surgical rollback.

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| V7 mockup match | 100% | Visual comparison |
| Regression bugs | 0 | QA testing |
| Hardcoded values | 0 | Code review |
| Page load impact | < 100ms | Performance test |
| User complaints | 0 | Post-deploy monitoring |

---

## Deferred to Backlog

| Feature | Reason | Points Est. |
|---------|--------|-------------|
| Tab reordering (MC-UI-2) | Low priority, current order works | 1 |
| 3-step onboarding wizard | Requires backend | 10 |
| Message functionality | Requires backend | 2 |
| Nudge functionality | Requires backend | 3 |
| Portfolio overview stats | Requires new API | 4 |
| Search/filter | Requires new API | 3 |
| Add Client wizard | Backend + frontend | 8 |

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| `SPRINT-14-ASSESSMENT-HUB-UI-SPEC.md` | Detailed technical spec |
| `EPIC-MC-UI-ONLY.md` | Story breakdown |
| `my-clients-cards-v7.html` | Canonical mockup |
| `EPIC-MC-MY-CLIENTS-REDESIGN.md` | Original full spec (for reference) |

---

**Document Version**: 2.0
**Last Updated**: February 23, 2026
**Sprint Type**: UI-Only Polish Sprint
**Reference Mockup**: `my-clients-cards-v7.html`
