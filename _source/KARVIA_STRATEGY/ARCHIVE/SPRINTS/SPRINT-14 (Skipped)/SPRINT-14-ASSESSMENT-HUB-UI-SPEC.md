# Sprint 14: Assessment Hub UI Redesign - Surgical Specification

**Sprint**: 14
**Focus**: UI-Only Changes (No Backend Modifications)
**Reference Mockup**: `sprint_mockups/sprint-14/my-clients-cards-v7.html`
**Total Points**: 18 pts (UI-focused scope)
**Priority**: P0

---

## Executive Summary

Surgical UI redesign of the Assessment Hub page with focus on the "My Clients" tab. This specification covers **ONLY frontend changes** - no backend modifications, no API changes, no database schema updates.

### Sprint Goal (Single Statement)
> Transform the Assessment Hub header and My Clients tab to match V7 mockup design while maintaining all existing functionality.

---

## Design Reference

**Canonical Mockup**: `my-clients-cards-v7.html`

All implementation MUST match this file exactly. Any deviation requires explicit approval.

```
Location: KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-14/my-clients-cards-v7.html
```

---

## Scope Definition

### IN SCOPE (UI Only)
| Item | Description |
|------|-------------|
| Header KPI layout | Move KPIs next to title |
| Tab reordering | My Clients first |
| Client card redesign | SSI ring + Culture emoji + Objective box |
| CSS changes | New styles for cards, header, tabs |
| HTML structure | DOM reorganization |
| JavaScript rendering | Update card rendering logic |

### OUT OF SCOPE (Explicitly Excluded)
| Item | Reason |
|------|--------|
| Backend API changes | Separate sprint |
| Database schema | No changes needed |
| New endpoints | Use existing data |
| 3-step onboarding wizard | Deferred to Sprint 15 |
| Message/Nudge functionality | Deferred (UI placeholder only) |
| New features | This is a UI polish sprint |

---

## Detailed UI Specifications

### 1. Header Section (3 pts)

**Current State**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Assessments Hub                                                  │
│ Manage assessments, templates, and track progress.               │
├─────────────────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                     │
│ │ 0      │ │ 0      │ │ 3      │ │ 0      │  ← 4 separate cards │
│ │Pending │ │Template│ │ Sent   │ │Complete│                     │
│ └────────┘ └────────┘ └────────┘ └────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

**Target State (V7)**:
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Assessments Hub                    📁 5        📊 2 pend · 3 sent · 8 done│
│ Manage assessments...                Templates      Assessments          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Technical Details**:

| Element | Current Class | New Class | Notes |
|---------|--------------|-----------|-------|
| Page header | `.page-header` | `.page-header-flex` | flex container |
| Title section | `.header-title` | `.header-title-left` | flex: 1 |
| KPI section | `.stats-grid` | `.header-kpi-right` | flex row |
| Templates KPI | 4 cards | Single icon+number | Consolidated |
| Assessments KPI | 4 cards | Inline counts | Color-coded |

**CSS Specification**:
```css
/* Header Layout - V7 */
.page-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-title-left {
  flex: 1;
}

.header-title-left h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.header-title-left p {
  font-size: 0.875rem;
  color: #64748b;
}

.header-kpi-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.kpi-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.kpi-icon-templates {
  background: #dbeafe;
}

.kpi-icon-assessments {
  background: #e0e7ff;
}

.kpi-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.kpi-label {
  font-size: 0.75rem;
  color: #64748b;
}

.kpi-inline-counts {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
}

.kpi-count-pending {
  color: #f59e0b;
  font-weight: 600;
}

.kpi-count-sent {
  color: #f97316;
  font-weight: 600;
}

.kpi-count-done {
  color: #22c55e;
  font-weight: 600;
}

.kpi-count-label {
  font-weight: 400;
  color: #94a3b8;
  font-size: 0.75rem;
}
```

**HTML Structure**:
```html
<div class="page-header-flex">
  <div class="header-title-left">
    <h1>Assessments Hub</h1>
    <p>Manage assessments, templates, and track progress.</p>
  </div>
  <div class="header-kpi-right">
    <!-- Templates KPI -->
    <div class="kpi-item">
      <div class="kpi-icon kpi-icon-templates">📁</div>
      <div>
        <div class="kpi-value" id="kpi-templates-count">5</div>
        <div class="kpi-label">Templates</div>
      </div>
    </div>
    <!-- Assessments KPI -->
    <div class="kpi-item">
      <div class="kpi-icon kpi-icon-assessments">📊</div>
      <div>
        <div class="kpi-inline-counts">
          <span class="kpi-count-pending"><span id="kpi-pending-count">2</span> <span class="kpi-count-label">pending</span></span>
          <span class="kpi-count-sent"><span id="kpi-sent-count">3</span> <span class="kpi-count-label">sent</span></span>
          <span class="kpi-count-done"><span id="kpi-done-count">8</span> <span class="kpi-count-label">done</span></span>
        </div>
        <div class="kpi-label">Assessments</div>
      </div>
    </div>
  </div>
</div>
```

**Data Binding** (use existing data):
```javascript
// Use existing assessment data from page load
// No new API calls required
const stats = assessmentHubData.stats; // Already available
document.getElementById('kpi-templates-count').textContent = stats.templates || 0;
document.getElementById('kpi-pending-count').textContent = stats.pending || 0;
document.getElementById('kpi-sent-count').textContent = stats.sent || 0;
document.getElementById('kpi-done-count').textContent = stats.completed || 0;
```

---

### 2. Tab Reordering (1 pt)

**Current Order**:
1. Assigned to Me
2. My Templates
3. Sent by Me
4. My Clients

**Target Order (V7)**:
1. **My Clients** (first, active by default for consultants)
2. My Templates
3. Sent by Me
4. Assigned to Me

**Technical Details**:

| Change | File | Location |
|--------|------|----------|
| HTML tab order | `assessment-hub.html` | Line ~45-60 |
| Tab click handler | `assessment-hub.js` | `initializeTabs()` |
| Default tab | `assessment-hub.js` | Page load logic |

**CSS Specification**:
```css
/* Tab Container */
.tabs-container {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f8fafc;
}

.tab-btn.active {
  background: #1e3a5f;
  color: white;
  border-color: #1e3a5f;
}

.tab-btn .tab-count {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 4px;
}

.tab-btn.active .tab-count {
  background: rgba(255,255,255,0.2);
}

.tab-btn:not(.active) .tab-count {
  background: #f1f5f9;
}
```

**JavaScript Change**:
```javascript
// Default tab logic for consultants
function initializeTabs() {
  const userRole = getCurrentUserRole(); // Existing function
  const defaultTab = userRole === 'CONSULTANT' ? 'my-clients' : 'assigned-to-me';
  activateTab(defaultTab);
}
```

---

### 3. Client Card Redesign (10 pts)

**Reference**: V7 mockup card structure

#### 3.1 Card Layout

**Target Structure**:
```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] Company Name ●   [SSI Ring with ⚡🛡🧠]                  │
│        Industry                                                 │
├────────────────────────────────────────────────────────────────┤
│ OBJECTIVE                                               [😐]   │
│ "Strategic goal text here..."                           3D     │
│                                                        emoji   │
├────────────────────────────────────────────────────────────────┤
│ [Avatar] Contact Name             [Message]                     │
│          Primary Contact                                        │
└────────────────────────────────────────────────────────────────┘
```

#### 3.2 SSI Ring Component

**SVG Specification** (40x40px):
```html
<svg width="40" height="40" viewBox="0 0 40 40" class="ssi-ring">
  <!-- Speed arc (top) -->
  <path d="M 20 4 A 16 16 0 0 1 33.8 12"
        fill="none"
        stroke="{{speedColor}}"
        stroke-width="4"
        stroke-linecap="round"
        class="ssi-arc ssi-speed"/>
  <!-- Strength arc (right) -->
  <path d="M 35.5 16 A 16 16 0 0 1 20 36"
        fill="none"
        stroke="{{strengthColor}}"
        stroke-width="4"
        stroke-linecap="round"
        class="ssi-arc ssi-strength"/>
  <!-- Intelligence arc (left) -->
  <path d="M 16 35.5 A 16 16 0 0 1 4.5 12"
        fill="none"
        stroke="{{intelligenceColor}}"
        stroke-width="4"
        stroke-linecap="round"
        class="ssi-arc ssi-intelligence"/>
  <!-- Emoji labels -->
  <text x="20" y="7" font-size="6" text-anchor="middle">⚡</text>
  <text x="34" y="26" font-size="6" text-anchor="middle">🛡</text>
  <text x="6" y="26" font-size="6" text-anchor="middle">🧠</text>
</svg>
```

**Color Mapping** (NO hardcoding - use config):
```javascript
// SSI Score to Color Mapping (configurable)
const SSI_COLOR_CONFIG = {
  thresholds: {
    high: 7,    // >= 7 = green
    medium: 5,  // >= 5 = amber
    low: 0      // < 5 = red
  },
  colors: {
    high: '#22c55e',   // green-500
    medium: '#fbbf24', // amber-400
    low: '#ef4444',    // red-500
    empty: '#cbd5e1'   // slate-300 (for onboarding)
  }
};

function getSSIColor(score) {
  if (score === null || score === undefined) return SSI_COLOR_CONFIG.colors.empty;
  if (score >= SSI_COLOR_CONFIG.thresholds.high) return SSI_COLOR_CONFIG.colors.high;
  if (score >= SSI_COLOR_CONFIG.thresholds.medium) return SSI_COLOR_CONFIG.colors.medium;
  return SSI_COLOR_CONFIG.colors.low;
}
```

#### 3.3 Culture Emoji Component

**Position**: Absolute, bottom-right corner of objective box

**CSS Specification**:
```css
.culture-emoji {
  position: absolute;
  right: -8px;
  bottom: -8px;
  font-size: 1.75rem;
  filter: drop-shadow(2px 3px 4px rgba(0,0,0,0.15));
  transform: perspective(100px) rotateY(-5deg);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.culture-emoji:hover {
  transform: perspective(100px) rotateY(0deg) scale(1.1);
}
```

**Emoji Mapping** (configurable):
```javascript
// Culture Score to Emoji Mapping
const CULTURE_EMOJI_CONFIG = {
  thresholds: [
    { min: 80, emoji: '😊', label: 'Thriving' },
    { min: 65, emoji: '🙂', label: 'Healthy' },
    { min: 50, emoji: '😐', label: 'Developing' },
    { min: 35, emoji: '😟', label: 'Needs Attention' },
    { min: 0,  emoji: '😰', label: 'Critical' }
  ],
  onboarding: { emoji: '🔮', label: 'Pending Assessment' }
};

function getCultureEmoji(overallScore) {
  if (overallScore === null || overallScore === undefined) {
    return CULTURE_EMOJI_CONFIG.onboarding;
  }
  for (const threshold of CULTURE_EMOJI_CONFIG.thresholds) {
    if (overallScore >= threshold.min) {
      return { emoji: threshold.emoji, label: threshold.label };
    }
  }
  return CULTURE_EMOJI_CONFIG.onboarding;
}
```

#### 3.4 Card States

| State | Border | Status Dot | SSI Ring | Objective BG |
|-------|--------|------------|----------|--------------|
| Active | `#e2e8f0` | `#22c55e` (green) | Colored | `#f8fafc` |
| At Risk | `#fde68a` (2px amber) | `#f59e0b` (amber) | Colored | `#fefce8` |
| Onboarding | `#bfdbfe` (blue) | `#3b82f6` (blue, pulse) | Dashed gray | `#eff6ff` |

**CSS for States**:
```css
/* Default/Active State */
.client-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  transition: all 0.2s;
  cursor: pointer;
}

.client-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

/* At Risk State */
.client-card.at-risk {
  border: 2px solid #fde68a;
}

.client-card.at-risk .objective-box {
  background: #fefce8;
}

/* Onboarding State */
.client-card.onboarding {
  border: 1px solid #bfdbfe;
}

.client-card.onboarding .objective-box {
  background: #eff6ff;
}

.client-card.onboarding .ssi-ring {
  opacity: 0.4;
}

/* Status Dots */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.active { background: #22c55e; }
.status-dot.at-risk { background: #f59e0b; }
.status-dot.onboarding {
  background: #3b82f6;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

#### 3.5 Complete Card HTML Template

```html
<div class="client-card {{stateClass}}" data-company-id="{{companyId}}">
  <!-- Header -->
  <div class="card-header">
    <div class="company-logo" style="background: {{logoGradient}}">
      {{logoInitial}}
    </div>
    <div class="company-info">
      <div class="company-name-row">
        <h3 class="company-name">{{companyName}}</h3>
        <span class="status-dot {{statusClass}}" title="{{statusLabel}}"></span>
      </div>
      <p class="company-industry">{{industry}}</p>
    </div>
    <!-- SSI Ring -->
    <div class="ssi-ring-container" title="⚡Speed: {{speed}} | 🛡Strength: {{strength}} | 🧠Intelligence: {{intelligence}}">
      {{ssiRingSVG}}
    </div>
  </div>

  <!-- Objective Box -->
  <div class="objective-box">
    <div class="objective-label">OBJECTIVE</div>
    <p class="objective-text">"{{objective}}"</p>
    <div class="culture-emoji" title="Culture Score: {{cultureLabel}}">
      {{cultureEmoji}}
    </div>
  </div>

  <!-- Contact Row -->
  <div class="contact-row">
    <div class="contact-avatar" style="background: {{avatarGradient}}">
      {{avatarContent}}
    </div>
    <div class="contact-info">
      <div class="contact-name">{{contactName}}</div>
      <div class="contact-role">Primary Contact</div>
    </div>
    <button class="btn-message" data-email="{{contactEmail}}">Message</button>
  </div>
</div>
```

---

### 4. Responsive Design (2 pts)

**Breakpoints**:
```css
/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .clients-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Tablet: 2 columns */
@media (min-width: 640px) and (max-width: 1023px) {
  .clients-grid { grid-template-columns: repeat(2, 1fr); }
  .header-kpi-right { flex-direction: column; gap: 16px; }
}

/* Mobile: 1 column */
@media (max-width: 639px) {
  .clients-grid { grid-template-columns: 1fr; }
  .page-header-flex { flex-direction: column; gap: 16px; }
  .header-kpi-right { width: 100%; }
  .tabs-container { flex-wrap: wrap; }
}
```

---

### 5. Add Client Button (2 pts)

**Current**: Links to existing modal
**Change**: Styling only (navy theme)

```css
.btn-add-client {
  background: #1e3a5f;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add-client:hover {
  background: #2d5a87;
}
```

---

## Files to Modify

### Frontend Changes

| File | Changes | Lines Affected (est.) |
|------|---------|----------------------|
| `client/pages/assessment-hub.html` | Header structure, tab order | ~30-80 |
| `client/pages/scripts/assessment-hub.js` | Card rendering, tab init | ~100-200 |
| `client/css/assessment-hub.css` | All new styles | New ~300 lines |

### No Backend Changes
- `server/*` - No changes
- `models/*` - No changes
- `routes/*` - No changes

---

## Quality Gates

### Gate 1: Design Match (Must Pass)
- [ ] Header matches V7 mockup exactly
- [ ] Tabs in correct order
- [ ] Client cards match V7 structure
- [ ] SSI ring renders correctly
- [ ] Culture emoji positioned correctly

### Gate 2: Data Binding (Must Pass)
- [ ] KPI counts display from existing data
- [ ] Client cards populate from existing API
- [ ] SSI colors compute correctly
- [ ] Culture emoji maps correctly

### Gate 3: Responsiveness (Must Pass)
- [ ] Desktop: 3-column grid
- [ ] Tablet: 2-column grid
- [ ] Mobile: 1-column grid
- [ ] Header stacks on mobile

### Gate 4: No Regression (Must Pass)
- [ ] All existing tab functionality works
- [ ] Client click navigates correctly
- [ ] Add Client button works
- [ ] No console errors
- [ ] Page load time unchanged

---

## Dependencies

### Required Before Start
| Dependency | Status | Owner |
|------------|--------|-------|
| Sprint 13 complete | ✅ Done | Team |
| V7 mockup approved | ✅ Done | Product |
| Existing assessment-hub data APIs | ✅ Available | Backend |

### No New Dependencies
- No new APIs required
- No new libraries required
- No backend changes required

---

## Implementation Checklist

### Day 1: Foundation
- [ ] Create `client/css/s14-assessment-hub.css`
- [ ] Add header flex layout CSS
- [ ] Add KPI component CSS
- [ ] Update `assessment-hub.html` header structure

### Day 2: Tabs & Grid
- [ ] Reorder tabs in HTML
- [ ] Update tab initialization JS
- [ ] Add tab CSS styles
- [ ] Add clients grid CSS

### Day 3: Card Component
- [ ] Create SSI ring SVG generator function
- [ ] Create card HTML template
- [ ] Add card CSS styles
- [ ] Implement culture emoji mapping

### Day 4: Integration
- [ ] Update card rendering function
- [ ] Wire KPI data binding
- [ ] Add card state classes
- [ ] Test all states (active, at-risk, onboarding)

### Day 5: Polish & QA
- [ ] Responsive testing
- [ ] Cross-browser testing
- [ ] Quality gate verification
- [ ] Final V7 mockup comparison

---

## Configuration Points (No Hardcoding)

All configurable values externalized:

```javascript
// config/ui-config.js
const ASSESSMENT_HUB_CONFIG = {
  // SSI thresholds
  ssi: {
    highThreshold: 7,
    mediumThreshold: 5,
    colors: {
      high: '#22c55e',
      medium: '#fbbf24',
      low: '#ef4444',
      empty: '#cbd5e1'
    }
  },

  // Culture emoji mapping
  culture: {
    thresholds: [
      { min: 80, emoji: '😊' },
      { min: 65, emoji: '🙂' },
      { min: 50, emoji: '😐' },
      { min: 35, emoji: '😟' },
      { min: 0, emoji: '😰' }
    ],
    pending: '🔮'
  },

  // Card states
  states: {
    active: { borderColor: '#e2e8f0', statusColor: '#22c55e' },
    atRisk: { borderColor: '#fde68a', statusColor: '#f59e0b' },
    onboarding: { borderColor: '#bfdbfe', statusColor: '#3b82f6' }
  },

  // Grid breakpoints
  grid: {
    desktop: { minWidth: 1024, columns: 3 },
    tablet: { minWidth: 640, columns: 2 },
    mobile: { minWidth: 0, columns: 1 }
  },

  // Default tab per role
  defaultTabs: {
    CONSULTANT: 'my-clients',
    BUSINESS_OWNER: 'assigned-to-me',
    EMPLOYEE: 'assigned-to-me'
  }
};
```

---

## Success Criteria

| Criteria | Target | Measurement |
|----------|--------|-------------|
| V7 mockup match | 100% | Visual comparison |
| Zero regressions | 0 bugs | QA testing |
| Page load time | <2s | Performance test |
| Mobile responsive | Pass | Device testing |
| No console errors | 0 | Dev tools check |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing CSS conflicts | Medium | Use scoped class names with `s14-` prefix |
| JS rendering breaks | High | Test each card type before deployment |
| Mobile layout issues | Medium | Test on real devices |
| Data format changes | Low | Use existing API responses only |

---

## Rollback Plan

If critical issues found:
1. Revert `assessment-hub.html` to previous version
2. Revert `assessment-hub.js` to previous version
3. Remove `s14-assessment-hub.css`
4. Redeploy

All changes isolated to 3 files for easy rollback.

---

**Document Version**: 1.0
**Created**: February 23, 2026
**Reference Mockup**: `sprint_mockups/sprint-14/my-clients-cards-v7.html`
**Author**: Strategy Session
