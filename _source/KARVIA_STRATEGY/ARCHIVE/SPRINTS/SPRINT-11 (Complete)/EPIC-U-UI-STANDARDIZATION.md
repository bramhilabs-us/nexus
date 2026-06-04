# Epic U: UI Standardization to Sprint 13 Patterns

**Epic**: U
**Sprint**: 11
**Created**: January 20, 2026
**Total Story Points**: 22 pts
**Duration**: 1 week (within Sprint 11)
**Status**: PLANNING

---

## Executive Summary

Epic U implements Sprint 13 mockup **layouts and structure** across all major pages while keeping the existing purple theme. This is a "structure-first, branding-last" approach where UI patterns are standardized now, and branding (logo, colors) is swapped in Sprint 13.

### Key Principle

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  EPIC U: STRUCTURE NOW + EXISTING THEME                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ✅ Implement S13 layouts (3-column, two-panel, card grids)                      │
│  ✅ Keep existing purple gradient (.karvia-gradient)                             │
│  ✅ Keep existing Cultural Discipline logo                                       │
│  ✅ Use S13 typography, spacing, card styles                                     │
│  ❌ Do NOT change primary colors yet (Sprint 13)                                 │
│  ❌ Do NOT add philosophy colors yet (Sprint 13)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Design System Reference

### S13 Common Patterns

All pages should follow these patterns:

#### Page Header Pattern

```html
<div class="s13-header">
    <div class="s13-header-left">
        <h1 class="s13-title">Page Title</h1>
        <div class="s13-kpi-group">
            <div class="s13-kpi">
                <svg>...</svg>
                <span class="s13-kpi-value">4</span>
                <span class="s13-kpi-label">Active</span>
            </div>
        </div>
    </div>
    <div class="s13-header-actions">
        <!-- Quarter selector, filters, buttons -->
    </div>
</div>
```

#### Card Pattern

```html
<div class="s13-card">
    <div class="s13-card-header">
        <span class="s13-card-title">Card Title</span>
        <span class="s13-card-badge">Badge</span>
    </div>
    <div class="s13-card-body">
        <!-- Content -->
    </div>
    <div class="s13-card-footer">
        <!-- Actions -->
    </div>
</div>
```

#### Progress Bar Pattern

```html
<div class="s13-progress">
    <div class="s13-progress-fill" style="width: 65%"></div>
</div>
```

---

## Story Breakdown

### U1: Dashboard UI Standardization (6 pts)

**Page**: `client/pages/dashboard.html`
**Mockup Reference**: `sprint_mockups/sprint13-dashboard-redesign.html`

#### Current State

- Single column layout
- Task cards in vertical list
- Weekly goals in separate section
- No objective context in header

#### Target State

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Dashboard                                                         Mon, Jan 20   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  [Growth 65%] [Customer 45%] [Ops 78%]              ● 2 ovr  ● 5 tdy  ● 3 tmrw  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  TASKS  ━━━━░░░░ 40%                                                   10 total │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐              │
│  │   OVERDUE (2)    │  │   TODAY (5)      │  │   TOMORROW (3)   │              │
│  │   ─────────────  │  │   ─────────────  │  │   ─────────────  │              │
│  │   Task cards     │  │   Task cards     │  │   Task cards     │              │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  WEEKLY GOALS  ━━━━━░░░ 60%                                           3 active  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐              │
│  │   LAST WEEK      │  │   THIS WEEK      │  │   NEXT WEEK      │              │
│  │   (completed)    │  │   (in progress)  │  │   (upcoming)     │              │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Implementation Tasks

1. **Header redesign** (2 pts)
   - Add objective context pills with progress
   - Add task stats on right (overdue, today, tomorrow counts)
   - Add date display

2. **3-column task layout** (2 pts)
   - Overdue column (red header)
   - Today column (purple header - keep existing color)
   - Tomorrow column (gray header)
   - Task cards within each column

3. **3-column weekly goals** (1 pt)
   - Last Week | This Week | Next Week
   - Circular progress indicators
   - Goal cards with KR reference

4. **Section progress bars** (1 pt)
   - Tasks section progress bar
   - Weekly goals section progress bar

#### Preserved Functionality

- `loadDashboard()` - No changes
- `completeTask(taskId)` - No changes
- `escapeHtml()` - CRITICAL: Keep all XSS prevention
- All API calls unchanged

---

### U2: Objectives Page UI Standardization (5 pts)

**Page**: `client/pages/objectives.html` + `client/pages/scripts/objectives.js`
**Mockup Reference**: `sprint_mockups/sprint13-objectives-redesign.html`

#### Current State

- Basic header with stats
- Filter buttons
- Card grid (auto-fill)

#### Target State

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Objectives   📊 4 Active  ⚠️ 1 At Risk              [Q1][Q2][Q3][Q4]  [+ Add]  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  [All] [Growth] [Customer] [Operations] [People] [Innovation] [Financial]       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ 📈 Increase Revenue  │  │ 👥 Build Culture     │  │ ⚙️ Streamline Ops    │  │
│  │    ━━━━░░░ 65%       │  │    ━━━━━░░ 78%       │  │    ━━░░░░░ 35%       │  │
│  │    3 KRs · On Track  │  │    4 KRs · On Track  │  │    2 KRs · At Risk   │  │
│  │    [View Details]    │  │    [View Details]    │  │    [View Details]    │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Implementation Tasks

1. **Header with inline KPIs** (2 pts)
   - Title with KPI badges (Active count, At Risk count)
   - Quarter selector pills (Q1-Q4)
   - Add button on right

2. **Category filter tabs** (1 pt)
   - Horizontal tab/pill style
   - All categories from `category-icons.js`

3. **Objective card styling** (2 pts)
   - Consistent 12px border-radius
   - Category icon + title
   - Progress bar (keep purple)
   - KR count + status
   - View Details action

#### Preserved Functionality

- ALL modal functions (view, edit, delete, confirm)
- `loadObjectives()` - No changes
- `calculateKRProgress()` - No changes
- `getFilteredObjectives()` - No changes
- `escapeHtml()` - CRITICAL: Keep all XSS prevention
- Category icons and colors from `category-icons.js`

---

### U3: Assessment Hub UI Standardization (5 pts)

**Page**: `client/pages/assessment-hub.html`

#### Current State

- Tab-based navigation (inline)
- Mixed card layouts

#### Target State

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Assessments   📋 3 Templates  📨 2 Pending                  [+ Create Template] │
├─────────────────────────────────────────────────────────────────────────────────┤
│  [Assigned to Me]  [My Templates]  [Sent by Me]  [Team Results]                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ SSI Assessment       │  │ Financial Services   │  │ Leadership 360       │  │
│  │ From: Sarah          │  │ Self-assigned        │  │ From: HR Team        │  │
│  │ Due: Jan 25          │  │ Due: Jan 30          │  │ Due: Feb 1           │  │
│  │ [Start]              │  │ [Continue]           │  │ [Start]              │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Implementation Tasks

1. **Header with counts** (2 pts)
   - Templates count, Pending count
   - Create Template button

2. **Tab pills** (1 pt)
   - Pill-style tabs instead of inline links
   - Active tab styling

3. **Assessment card grid** (2 pts)
   - 3-column grid
   - Consistent card styling
   - Status-based actions

---

### U4: Question Library Two-Panel Layout (4 pts)

**Page**: `client/pages/assessment-question-library.html`

#### Current State

- Single column with filters at top
- Search bar
- Question list

#### Target State

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Question Library   📊 286 Total  🟣 96 Speed  🟢 95 Strength  🔵 95 Intel      │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Industry: [All ▼]   Role: [All ▼]   🔍 Search questions...                     │
├─────────────────────┬───────────────────────────────────────────────────────────┤
│  FILTERS            │  QUESTIONS                                                │
│  ─────────────      │  ─────────────────────────────────────────────────────    │
│                     │                                                           │
│  DIMENSION          │  ▼ Speed: Response Time (12 questions)                    │
│  ○ All (286)        │    □ How quickly does your team respond to...             │
│  ● Speed (96)       │    □ What is the average time to close...                 │
│  ○ Strength (95)    │                                                           │
│  ○ Intelligence (95)│  ▶ Speed: Market Adaptation (8 questions)                 │
│                     │                                                           │
│  CATEGORY           │  ▶ Speed: Decision Velocity (10 questions)                │
│  ○ Response Time    │                                                           │
│  ○ Market Adapt     │                                                           │
│  ○ Decision Vel     │                                                           │
│  ...                │                                                           │
└─────────────────────┴───────────────────────────────────────────────────────────┘
```

#### Implementation Tasks

1. **Two-panel layout** (2 pts)
   - Left sidebar (280px)
   - Right content area

2. **Filter sidebar** (1 pt)
   - Dimension radio buttons
   - Category checkboxes
   - Counts per filter

3. **Question grouping** (1 pt)
   - Collapsible sections by subcategory
   - Question checkboxes
   - Question count badges

---

### U5: Common CSS Patterns (2 pts)

**New File**: `client/css/s13-patterns.css`

#### Implementation

```css
/* S13 Pattern System - Structure Only, Keep Purple Theme */

/* ==================== Container ==================== */
.s13-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;
}

/* ==================== Page Header ==================== */
.s13-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.s13-header-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.s13-title {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.s13-kpi-group {
    display: flex;
    gap: 16px;
}

.s13-kpi {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #6B7280;
}

.s13-kpi-value {
    font-weight: 600;
    color: #111827;
}

.s13-header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* ==================== Cards ==================== */
.s13-card {
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    padding: 16px;
    transition: box-shadow 0.2s;
}

.s13-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.s13-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.s13-card-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
}

.s13-card-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

/* ==================== Progress ==================== */
.s13-progress {
    height: 6px;
    background: #E5E7EB;
    border-radius: 3px;
    overflow: hidden;
}

.s13-progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
}

/* KEEP PURPLE - Will change in Sprint 13 */
.s13-progress-fill {
    background: linear-gradient(90deg, #667eea, #764ba2);
}

/* ==================== Two-Panel Layout ==================== */
.s13-two-panel {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
}

.s13-sidebar {
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    padding: 16px;
    height: fit-content;
    position: sticky;
    top: 80px;
}

.s13-sidebar-section {
    margin-bottom: 20px;
}

.s13-sidebar-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #9CA3AF;
    margin-bottom: 8px;
}

/* ==================== Tabs/Pills ==================== */
.s13-tab-group {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}

.s13-tab {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
    background: white;
    color: #6B7280;
    cursor: pointer;
    transition: all 0.2s;
}

.s13-tab:hover {
    border-color: #667eea;
    color: #667eea;
}

.s13-tab.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

/* ==================== 3-Column Grid ==================== */
.s13-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

@media (max-width: 1024px) {
    .s13-grid-3 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .s13-grid-3 {
        grid-template-columns: 1fr;
    }

    .s13-two-panel {
        grid-template-columns: 1fr;
    }

    .s13-sidebar {
        position: relative;
        top: 0;
    }
}

/* ==================== Quarter Selector ==================== */
.s13-quarter-selector {
    display: flex;
    gap: 4px;
}

.s13-quarter-pill {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
    background: white;
    color: #6B7280;
    cursor: pointer;
}

.s13-quarter-pill:hover {
    border-color: #667eea;
}

.s13-quarter-pill.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

/* ==================== Section Headers ==================== */
.s13-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.s13-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.s13-section-stats {
    font-size: 12px;
    color: #6B7280;
}

/* ==================== Buttons - KEEP PURPLE ==================== */
.s13-btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
}

.s13-btn-primary:hover {
    opacity: 0.9;
}

.s13-btn-secondary {
    background: white;
    color: #374151;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #E5E7EB;
    cursor: pointer;
}

.s13-btn-secondary:hover {
    border-color: #D1D5DB;
    background: #F9FAFB;
}
```

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| S13 mockups | Ready | `sprint_mockups/` folder |
| Existing page JS | Ready | Keep all API logic |
| Tailwind CSS | Ready | Can coexist with s13-patterns.css |

---

## Success Criteria

### Per-Story Criteria

| Story | Success Criteria |
|-------|------------------|
| U1 | Dashboard has 3-column tasks + 3-column goals + progress bars |
| U2 | Objectives has header KPIs + quarter selector + category tabs |
| U3 | Assessment Hub has header counts + tab pills + card grid |
| U4 | Question Library has two-panel layout with filter sidebar |
| U5 | `s13-patterns.css` created and included in all pages |

### Overall Epic U Criteria

- [ ] All 5 pages use S13 layout patterns
- [ ] All pages still use purple theme (not navy)
- [ ] No functional regressions (all APIs work)
- [ ] All modals still work
- [ ] XSS prevention intact (`escapeHtml()` preserved)
- [ ] Mobile responsive (breakpoints at 1024px, 768px)

---

## Implementation Order

1. **Day 1**: U5 (Common CSS) - Create foundation patterns
2. **Day 2**: U1 (Dashboard) - Apply patterns to most visible page
3. **Day 3**: U2 (Objectives) - Apply card grid patterns
4. **Day 4**: U3 (Assessment Hub) - Apply tab + card patterns
5. **Day 5**: U4 (Question Library) - Apply two-panel pattern

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing JS | Medium | High | Only modify render HTML, not logic |
| CSS conflicts | Low | Medium | Use `s13-` prefix for all new classes |
| XSS regression | Low | Critical | Never remove `escapeHtml()` calls |
| Mobile responsiveness | Medium | Medium | Test at 1024px, 768px breakpoints |

---

## Related Documents

- [SPRINT-REORGANIZATION-PLAN-V2.md](../SPRINT-REORGANIZATION-PLAN-V2.md) - Strategy document
- [SPRINT-11-MASTER-PLAN.md](./SPRINT-11-MASTER-PLAN.md) - Parent sprint
- [Sprint 13 Mockups](../sprint_mockups/) - Design reference

---

**Epic Owner**: Product Team
**Sprint**: 11
**Target**: Week 1 of Sprint 11
