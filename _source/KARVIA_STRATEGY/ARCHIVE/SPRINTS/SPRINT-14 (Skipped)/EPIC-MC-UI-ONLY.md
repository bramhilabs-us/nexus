# Epic MC: Assessment Hub UI Redesign (UI-Only)

**Sprint**: 14
**Points**: 18 pts
**Priority**: P0
**Type**: UI-Only (No Backend Changes)
**Reference**: `sprint_mockups/sprint-14/my-clients-cards-v7.html`

---

## Scope Summary

| In Scope | Out of Scope |
|----------|--------------|
| Header KPI layout redesign | Backend API changes |
| Tab reordering | Database schema changes |
| Client card visual redesign | New endpoints |
| SSI ring SVG component | 3-step onboarding wizard |
| Culture emoji component | Message/Nudge functionality |
| Responsive CSS | New features |
| State styling (active/at-risk/onboarding) | Business logic changes |

---

## Story Breakdown

### MC-UI-1: Header KPI Consolidation (3 pts)

**User Story**: As a consultant, I want to see KPI counts at a glance in the header so I don't have to scroll down.

**Acceptance Criteria**:
- [ ] Title + subtitle on left side
- [ ] Templates count with icon on right
- [ ] Assessments with inline pending/sent/done counts
- [ ] Color-coded counts (amber/orange/green)
- [ ] Uses existing data (no new API calls)

**Technical Spec**: See `SPRINT-14-ASSESSMENT-HUB-UI-SPEC.md` Section 1

---

### MC-UI-2: Tab Reordering (1 pt)

**User Story**: As a consultant, I want My Clients to be the first tab so it's my default view.

**Acceptance Criteria**:
- [ ] Tab order: My Clients → My Templates → Sent by Me → Assigned to Me
- [ ] My Clients active by default for CONSULTANT role
- [ ] Assigned to Me active by default for other roles
- [ ] Badge counts display correctly

**Technical Spec**: See `SPRINT-14-ASSESSMENT-HUB-UI-SPEC.md` Section 2

---

### MC-UI-3: Client Card Structure (4 pts)

**User Story**: As a consultant, I want to see company, objective, and contact in a clean card layout.

**Card Anatomy**:
```
┌─────────────────────────────────────┐
│ [Logo] Company  ●  [SSI Ring]       │ ← Header
│        Industry                      │
├─────────────────────────────────────┤
│ OBJECTIVE                    [😐]   │ ← Objective Box
│ "Goal text..."                3D    │
├─────────────────────────────────────┤
│ [👤] Contact        [Message]       │ ← Contact Row
│      Primary Contact                 │
└─────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Company logo (gradient + initial)
- [ ] Company name + industry
- [ ] Status dot (green/amber/blue)
- [ ] SSI ring SVG component
- [ ] Objective box with text
- [ ] Contact with avatar/initials
- [ ] Message button (visual only, uses existing mailto)

---

### MC-UI-4: SSI Ring Component (3 pts)

**User Story**: As a consultant, I want to see SSI scores as a visual ring so I can quickly assess client health.

**Component Spec**:
- 40x40px SVG
- 3 broken arcs (Speed/Strength/Intelligence)
- Emoji labels (⚡🛡🧠)
- Color-coded by score (configurable thresholds)

**Score → Color Mapping** (configurable):
| Score Range | Color | Hex |
|-------------|-------|-----|
| ≥ 7 | Green | #22c55e |
| 5-6 | Amber | #fbbf24 |
| < 5 | Red | #ef4444 |
| null | Gray dashed | #cbd5e1 |

**Acceptance Criteria**:
- [ ] SVG renders correctly
- [ ] Colors map from score thresholds
- [ ] Tooltip shows "⚡Speed: X | 🛡Strength: Y | 🧠Intelligence: Z"
- [ ] Onboarding state shows dashed gray arcs
- [ ] Thresholds externalized (no hardcoding)

---

### MC-UI-5: Culture Emoji Component (2 pts)

**User Story**: As a consultant, I want to see a culture score emoji so I understand overall client sentiment.

**Component Spec**:
- Positioned: bottom-right corner of objective box
- 3D effect: drop-shadow + perspective
- Hover: scale up animation

**Score → Emoji Mapping** (configurable):
| Score Range | Emoji | Label |
|-------------|-------|-------|
| 80-100 | 😊 | Thriving |
| 65-79 | 🙂 | Healthy |
| 50-64 | 😐 | Developing |
| 35-49 | 😟 | Needs Attention |
| 0-34 | 😰 | Critical |
| null | 🔮 | Pending |

**Acceptance Criteria**:
- [ ] Emoji renders at correct position
- [ ] 3D shadow effect applied
- [ ] Hover scales emoji
- [ ] Tooltip shows label
- [ ] Mapping configurable

---

### MC-UI-6: Card States & Borders (2 pts)

**User Story**: As a consultant, I want visual differentiation between active, at-risk, and onboarding clients.

**State Definitions**:
| State | Border | Status Dot | SSI Ring | Objective BG |
|-------|--------|------------|----------|--------------|
| Active | 1px #e2e8f0 | Green solid | Colored | #f8fafc |
| At Risk | 2px #fde68a | Amber solid | Colored | #fefce8 |
| Onboarding | 1px #bfdbfe | Blue pulse | Gray dashed | #eff6ff |

**Acceptance Criteria**:
- [ ] Active cards have default styling
- [ ] At-risk cards have amber border + background
- [ ] Onboarding cards have blue border + pulsing dot
- [ ] States determined by existing data flags

---

### MC-UI-7: Responsive Layout (2 pts)

**User Story**: As a consultant on mobile, I want the layout to stack properly.

**Breakpoints**:
| Breakpoint | Header | Grid | Tabs |
|------------|--------|------|------|
| Desktop (≥1024px) | Side by side | 3 columns | Inline |
| Tablet (640-1023px) | Stacked | 2 columns | Inline |
| Mobile (<640px) | Stacked | 1 column | Wrapped |

**Acceptance Criteria**:
- [ ] Desktop: 3-column card grid
- [ ] Tablet: 2-column card grid
- [ ] Mobile: 1-column card grid
- [ ] Header KPIs stack on mobile
- [ ] Tabs wrap on mobile

---

### MC-UI-8: Add Client Button Styling (1 pt)

**User Story**: As a consultant, I want the Add Client button to match the navy theme.

**Acceptance Criteria**:
- [ ] Navy background (#1e3a5f)
- [ ] White text
- [ ] Hover state (#2d5a87)
- [ ] Plus icon
- [ ] Triggers existing modal (no new functionality)

---

## Files Modified

| File | Type | Changes |
|------|------|---------|
| `client/pages/assessment-hub.html` | Modify | Header, tabs, card template |
| `client/pages/scripts/assessment-hub.js` | Modify | Card rendering, tab init |
| `client/css/s14-assessment-hub.css` | Create | All new styles (~300 lines) |

**No Backend Files Changed**

---

## Quality Gates

### Pre-Development
- [ ] V7 mockup reviewed and approved
- [ ] Existing assessment-hub.js understood
- [ ] Data structure from API documented

### During Development
- [ ] Each component matches V7 mockup
- [ ] No console errors
- [ ] Existing functionality preserved

### Post-Development
- [ ] All 8 stories acceptance criteria met
- [ ] Responsive layout tested (3 breakpoints)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] No regression in existing features

---

## Configuration (No Hardcoding)

All values externalized to `config/ui-config.js`:

```javascript
const ASSESSMENT_HUB_UI_CONFIG = {
  ssi: {
    thresholds: { high: 7, medium: 5 },
    colors: { high: '#22c55e', medium: '#fbbf24', low: '#ef4444', empty: '#cbd5e1' }
  },
  culture: {
    thresholds: [
      { min: 80, emoji: '😊', label: 'Thriving' },
      { min: 65, emoji: '🙂', label: 'Healthy' },
      { min: 50, emoji: '😐', label: 'Developing' },
      { min: 35, emoji: '😟', label: 'Needs Attention' },
      { min: 0, emoji: '😰', label: 'Critical' }
    ],
    pending: { emoji: '🔮', label: 'Pending Assessment' }
  },
  states: {
    active: { border: '#e2e8f0', status: '#22c55e', objectiveBg: '#f8fafc' },
    atRisk: { border: '#fde68a', status: '#f59e0b', objectiveBg: '#fefce8' },
    onboarding: { border: '#bfdbfe', status: '#3b82f6', objectiveBg: '#eff6ff' }
  },
  grid: {
    desktop: { minWidth: 1024, columns: 3 },
    tablet: { minWidth: 640, columns: 2 },
    mobile: { minWidth: 0, columns: 1 }
  },
  defaultTab: {
    CONSULTANT: 'my-clients',
    default: 'assigned-to-me'
  }
};
```

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Sprint 13 complete | ✅ | Required |
| V7 mockup (`my-clients-cards-v7.html`) | ✅ | Reference |
| Existing assessment-hub data | ✅ | No new APIs |
| Tailwind CSS (via CDN) | ✅ | For mockup only |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| V7 mockup visual match | 100% |
| Regression bugs | 0 |
| New features added | 0 (this is UI polish) |
| Hardcoded values | 0 |
| Page load time impact | < 100ms |

---

## Deferred to Sprint 15

| Item | Reason |
|------|--------|
| 3-step onboarding wizard | Requires backend |
| Message functionality | Requires backend |
| Nudge functionality | Requires backend |
| Portfolio overview stats | Requires new API |
| Search/filter | Requires new API |

---

**Document Version**: 1.0
**Created**: February 23, 2026
**Reference**: `sprint_mockups/sprint-14/my-clients-cards-v7.html`
