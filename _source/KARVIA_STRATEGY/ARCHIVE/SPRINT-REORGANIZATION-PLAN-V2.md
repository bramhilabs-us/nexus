# Sprint Reorganization Plan V2

**Created**: January 19, 2026
**Purpose**: Implement Sprint 13 designs NOW with existing theme, defer branding to Sprint 13
**Status**: STRATEGY DISCUSSION

---

## Core Principle: Structure First, Branding Last

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  SPRINT 11-12: SPRINT 13 STRUCTURE + EXISTING THEME                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • Implement Sprint 13 mockup LAYOUTS                                           │
│  • Keep existing purple gradient (.karvia-gradient)                             │
│  • Keep existing Cultural Discipline logo                                       │
│  • All functional features from S11/S12 epics                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│  SPRINT 13: BRANDING SWAP ONLY                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • Swap logo to Chief AI                                                        │
│  • Change gradients from purple to Chief AI colors                              │
│  • Add philosophy colors to navigation                                          │
│  • ~3-5 pts total (simple find/replace)                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Sprint 13 Design System (To Implement Now)

### Common Design Patterns from Mockups

```css
/* STRUCTURE (Implement Sprint 11-12) */

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #FAFAFA;      /* Lighter than current #f9fafb */
    color: #1F2937;
}

.main {
    max-width: 1200px;        /* Consistent container width */
    margin: 0 auto;
    padding: 32px 32px;
}

/* COLORS (Keep existing until Sprint 13) */
.karvia-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* KEEP */
}

/* Will become in Sprint 13:
.chief-gradient {
    background: linear-gradient(135deg, #1e3a5f, #2d5a87);  (navy blue)
}
*/
```

### Page Header Pattern (All Pages)

```html
<!-- Sprint 13 Design - Clean Header -->
<div class="page-header">
    <div class="page-header-left">
        <h1 class="page-title">Page Title</h1>
        <!-- Optional: Inline KPIs -->
        <div class="header-kpis">
            <div class="header-kpi">
                <svg>...</svg>
                <span class="header-kpi-value">4</span>
                <span>Objectives</span>
            </div>
        </div>
    </div>
    <div class="header-actions">
        <!-- Quarter selector, filters, add buttons -->
    </div>
</div>
```

**CSS (implement now with existing theme):**
```css
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.page-title {
    font-size: 22px;
    font-weight: 600;
    color: #111827;
}

.header-kpis {
    display: flex;
    align-items: center;
    gap: 16px;
}

/* Buttons - keep purple until Sprint 13 */
.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  /* EXISTING */
    color: white;
    padding: 10px 18px;
    border-radius: 8px;
    font-weight: 600;
}
```

---

## Page-by-Page Design Extraction

### 1. Dashboard (sprint13-dashboard-redesign.html)

**Key Layout Elements:**
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  DASHBOARD - Sprint 13 Structure                                                │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  HEADER ROW                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Dashboard              ┌─────────────────┐                                │
│  │                         │ Mon, Jan 20     │                                │
│  │  ┌──────────────────────┴─────────────────┴──────────────────────────────┐ │
│  │  │ [Objective Pills]  TASKS: Overdue(2) Today(5) Tomorrow(3)             │ │
│  │  └───────────────────────────────────────────────────────────────────────┘ │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  THREE COLUMN CONTENT                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐            │
│  │  OVERDUE (2)     │  │  TODAY (5)       │  │  TOMORROW (3)    │            │
│  │  ─────────────   │  │  ─────────────   │  │  ─────────────   │            │
│  │  Task Card       │  │  Task Card       │  │  Task Card       │            │
│  │  Task Card       │  │  Task Card       │  │  Task Card       │            │
│  │                  │  │  Task Card       │  │  Task Card       │            │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘            │
│                                                                                │
│  WEEKLY GOALS SECTION                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Weekly Goals     Progress: ━━━━━━░░░░ 60%                                 │
│  │                                                                            │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                     │
│  │  │  LAST WEEK   │  │  THIS WEEK   │  │  NEXT WEEK   │                     │
│  │  │  Card        │  │  Card (focus)│  │  Card        │                     │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                     │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**What to implement (Sprint 11/12):**
- 3-column task layout (Overdue | Today | Tomorrow)
- Objective context pills at top
- Task count badges in header
- Weekly goals section with 3 week cards

**What to defer (Sprint 13):**
- Philosophy colors on nav
- Chief AI logo

---

### 2. Objectives (sprint13-objectives-redesign.html)

**Key Layout Elements:**
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  OBJECTIVES - Sprint 13 Structure                                               │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  HEADER                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Objectives   📊 4 Active  ⚠️ 1 At Risk        [Q1][Q2][Q3][Q4]  [+ Add]   │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  CATEGORY TABS                                                                 │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  [All] [Growth] [Customer] [Operations] [People] [Innovation] [Financial] │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  OBJECTIVE CARDS (3 per row)                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐            │
│  │  OBJECTIVE 1     │  │  OBJECTIVE 2     │  │  OBJECTIVE 3     │            │
│  │  ─────────────   │  │  ─────────────   │  │  ─────────────   │            │
│  │  [Growth] 65%    │  │  [Customer] 45%  │  │  [People] 78%    │            │
│  │                  │  │                  │  │                  │            │
│  │  KR 1 ━━━░░ 70%  │  │  KR 1 ━━░░░ 50%  │  │  KR 1 ━━━━░ 80%  │            │
│  │  KR 2 ━━━░░ 60%  │  │  KR 2 ━░░░░ 40%  │  │  KR 2 ━━━░░ 75%  │            │
│  │                  │  │                  │  │                  │            │
│  │  [View Details]  │  │  [View Details]  │  │  [View Details]  │            │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘            │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**What to implement (Sprint 11/12):**
- Clean header with inline KPIs
- Quarter selector (Q1-Q4 pills)
- Category filter tabs
- 3-column objective card grid
- Progress bars within cards

**What to defer (Sprint 13):**
- Orange button gradient → keep purple
- Philosophy colors

---

### 3. Planning (sprint13-planning-redesign.html)

**Key Layout Elements:**
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  PLANNING - Sprint 13 Structure (Two-Panel)                                    │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  HEADER                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Planning                                              [Week Navigation]   │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  OBJECTIVES ROW (Selectable Pills)                                            │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  [Obj 1 | Growth | 65%]  [Obj 2 | Customer | 45%]  [Obj 3 | People | 78%] │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  TWO-PANEL LAYOUT                                                              │
│  ┌─────────────────┐  ┌──────────────────────────────────────────────────────┐│
│  │  LEFT: KR LIST  │  │  RIGHT: WEEK CARDS                                   ││
│  │  ─────────────  │  │  ─────────────────────────────────────────────────   ││
│  │                 │  │                                                      ││
│  │  KEY RESULTS    │  │  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐   ││
│  │  ○ KR 1 (70%)   │  │  │ Week 1   ││ Week 2   ││ Week 3   ││ Week 4   │   ││
│  │  ● KR 2 (sel)   │  │  │ Jan 1-7  ││ Jan 8-14 ││ Jan 15-21││ Jan 22-28│   ││
│  │  ○ KR 3 (50%)   │  │  │          ││          ││ CURRENT  ││          │   ││
│  │                 │  │  │ ━━░░ 40% ││ ━━━░ 60% ││ ━━━━░80% ││ ░░░░ 0%  │   ││
│  │                 │  │  └──────────┘└──────────┘└──────────┘└──────────┘   ││
│  │  OWNERS         │  │                                                      ││
│  │  ○ All          │  │  EXPANDED WEEK (if selected)                         ││
│  │  ● Sarah (3)    │  │  ┌──────────────────────────────────────────────────┐││
│  │  ○ John (2)     │  │  │  Week 3: Jan 15-21                               │││
│  │                 │  │  │  ─────────────────────────────────────────────   │││
│  └─────────────────┘  │  │  Task 1: Prepare report              [Complete]  │││
│                       │  │  Task 2: Review with team            [In Progress]│││
│                       │  │  Task 3: Send to client              [Pending]   │││
│                       │  └──────────────────────────────────────────────────┘││
│                       └──────────────────────────────────────────────────────┘│
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

**What to implement (Sprint 11/12):**
- Two-panel layout (left sidebar, right content)
- Objective pills at top
- KR filter list in sidebar
- Owner filter in sidebar
- Week cards grid
- Expandable week detail panel

**What to defer (Sprint 13):**
- Orange accent colors → keep purple

---

### 4. Assessment Hub & Question Library

**Apply Same Sprint 13 Patterns:**
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ASSESSMENT HUB - Sprint 13 Pattern                                            │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  HEADER                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Assessments   📋 3 Templates  📨 2 Pending         [+ Create Assessment]  │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  TAB PILLS (not inline)                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  [Assigned to Me]  [My Templates]  [Sent by Me]  [Team Results]           │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  TAB CONTENT                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Assessment cards in grid (3 per row)                                      │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  QUESTION LIBRARY - Sprint 13 Pattern (Two-Panel)                              │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  HEADER                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Question Library   📊 286 Total  🟣 96 Speed  🟢 95 Strength  🔵 95 Intel │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  FILTER ROW                                                                    │
│  ┌────────────────────────────────────────────────────────────────────────────┐
│  │  Industry: [All ▼]   Role: [All ▼]   Dimension: [All][Speed][Str][Intel]  │
│  └────────────────────────────────────────────────────────────────────────────┘
│                                                                                │
│  TWO-PANEL (like Planning)                                                     │
│  ┌─────────────────┐  ┌──────────────────────────────────────────────────────┐│
│  │  LEFT: CATS     │  │  RIGHT: QUESTIONS                                    ││
│  │  ─────────────  │  │  ─────────────────────────────────────────────────   ││
│  │                 │  │                                                      ││
│  │  DIMENSIONS     │  │  Question cards (collapsible by subcategory)         ││
│  │  ○ All          │  │                                                      ││
│  │  ● Speed        │  │                                                      ││
│  │  ○ Strength     │  │                                                      ││
│  │  ○ Intelligence │  │                                                      ││
│  │                 │  │                                                      ││
│  │  CATEGORIES     │  │                                                      ││
│  │  ○ Response     │  │                                                      ││
│  │  ○ Change       │  │                                                      ││
│  │  ○ Decisions    │  │                                                      ││
│  │  ...            │  │                                                      ││
│  └─────────────────┘  └──────────────────────────────────────────────────────┘│
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Updated Sprint Plan

### SPRINT 11 (77 pts - 3 weeks)

| Epic | Points | Focus | Design Source |
|------|--------|-------|---------------|
| **Epic U** | 22 | UI Standardization to S13 patterns | S13 mockups |
| **Epic J** | 28 | Assessment Credibility | New features |
| **Epic L** | 25 | Planning Redesign | S13 planning mockup |
| **Quickfix** | 2 | Forgot Password | - |

**Epic U Breakdown (22 pts):**

| Story | Page | Points | S13 Pattern Applied |
|-------|------|--------|---------------------|
| U1 | dashboard.html | 6 | 3-column tasks, objective pills, weekly section |
| U2 | objectives.html | 5 | Header KPIs, quarter selector, category tabs, card grid |
| U3 | assessment-hub.html | 5 | Header KPIs, tab pills, card grid |
| U4 | assessment-question-library.html | 4 | Two-panel layout, filter sidebar |
| U5 | planning.html | 2 | Header (Epic L does main redesign) |

### SPRINT 12 (72 pts - 2.5 weeks)

| Epic | Points | Focus |
|------|--------|-------|
| **Epic M Phase 1** | 13 | OKR Wizard Foundation |
| **Epic N** | 21 | SSI 12-Block Persistence |
| **Epic O** | 18 | Smart KR Target Calculator |
| **Epic P** | 9 | Industry Alignment |
| **Epic Q-reduced** | 5 | LLM Security Fix |
| **Epic V** | 6 | SSI Report Standardization (S13 pattern) |

### SPRINT 13 (8 pts - 0.5 weeks)

| Epic | Points | Focus |
|------|--------|-------|
| **Epic R** | 3 | Chief AI Logo + Gradient Swap |
| **Epic T** | 5 | Philosophy Colors on Nav |

**Sprint 13 is pure CSS/asset swap:**
- Replace logo SVG
- Change `.karvia-gradient` to `.chief-gradient`
- Add philosophy colors to navigation

---

## Color System: Now vs Sprint 13

### Current (Keep in Sprint 11-12)

```css
/* Main gradient - KEEP */
.karvia-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Accent colors - KEEP existing */
.accent-purple { color: #667eea; }
.bg-purple-50 { background: #f5f3ff; }
.border-purple-200 { border-color: #ddd6fe; }

/* Status colors - KEEP */
.status-danger { color: #EF4444; }
.status-warning { color: #F59E0B; }
.status-success { color: #22c55e; }
```

### Sprint 13 (Swap only)

```css
/* New gradient - SPRINT 13 ONLY */
.chief-gradient {
    background: linear-gradient(135deg, #1e3a5f, #2d5a87);
}

/* New accent - SPRINT 13 ONLY */
.accent-navy { color: #1e3a5f; }
.bg-navy-50 { background: #f0f4f8; }

/* Philosophy colors - SPRINT 13 ONLY */
.philosophy-play { color: #8B5CF6; }
.philosophy-assess { color: #3B82F6; }
.philosophy-align { color: #22c55e; }
.philosophy-plan { color: #F59E0B; }
```

---

## Implementation Example: Dashboard

### Step 1 (Sprint 11): Apply S13 Layout with Existing Theme

```html
<!-- dashboard.html - Sprint 11 Implementation -->
<body class="font-inter bg-[#FAFAFA]">
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div id="main-navigation"></div>
    </nav>

    <main class="max-w-[1200px] mx-auto px-8 py-8">
        <!-- Header - S13 pattern -->
        <div class="page-header flex items-center justify-between mb-6">
            <div class="flex items-center gap-6">
                <h1 class="text-[22px] font-semibold text-gray-900">Dashboard</h1>
                <!-- Objective Pills -->
                <div class="flex gap-2">
                    <span class="px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700">
                        Growth · 65%
                    </span>
                    <span class="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
                        Customer · 45%
                    </span>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <!-- Task stats -->
                <div class="flex gap-3 text-sm">
                    <span class="text-red-500 font-semibold">2 Overdue</span>
                    <span class="text-purple-600 font-semibold">5 Today</span>
                    <span class="text-gray-500">3 Tomorrow</span>
                </div>
                <span class="text-gray-400 text-sm">Mon, Jan 20</span>
            </div>
        </div>

        <!-- 3-Column Tasks - S13 pattern -->
        <div class="grid grid-cols-3 gap-6 mb-8">
            <!-- Overdue Column -->
            <div>
                <h3 class="text-xs uppercase tracking-wide text-red-500 font-semibold mb-3">
                    Overdue (2)
                </h3>
                <div class="space-y-3">
                    <!-- Task cards -->
                </div>
            </div>
            <!-- Today Column -->
            <div>
                <h3 class="text-xs uppercase tracking-wide text-purple-600 font-semibold mb-3">
                    Today (5)
                </h3>
                <div class="space-y-3">
                    <!-- Task cards -->
                </div>
            </div>
            <!-- Tomorrow Column -->
            <div>
                <h3 class="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
                    Tomorrow (3)
                </h3>
                <div class="space-y-3">
                    <!-- Task cards -->
                </div>
            </div>
        </div>

        <!-- Weekly Goals Section - S13 pattern -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">Weekly Goals</h2>
                <div class="flex items-center gap-3">
                    <div class="w-48 bg-gray-200 rounded-full h-2">
                        <div class="bg-purple-600 h-2 rounded-full" style="width: 60%"></div>
                    </div>
                    <span class="text-sm text-gray-600">60%</span>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
                <!-- Week cards -->
            </div>
        </div>
    </main>
</body>
```

### Step 2 (Sprint 13): Swap Theme Only

```css
/* Sprint 13: Simple color swap */

/* Find and replace */
.karvia-gradient → .chief-gradient
#667eea → #1e3a5f
#764ba2 → #2d5a87
text-purple-600 → text-navy-600 (or keep purple for some elements)

/* Add philosophy colors to navigation only */
```

---

## Summary: What Goes Where

### Sprint 11-12 (Implement Now)

| Category | What to Implement |
|----------|-------------------|
| **Layout** | S13 mockup structures (3-col, 2-panel, card grids) |
| **Typography** | 22px titles, 13px body, Inter font |
| **Spacing** | 32px padding, 24px gaps, 1200px max-width |
| **Components** | Quarter selectors, category tabs, KPI badges |
| **Cards** | White bg, 12px radius, 1px gray border |
| **Buttons** | **Keep purple gradient** |
| **Logo** | **Keep Cultural Discipline** |

### Sprint 13 (Defer)

| Category | What to Swap |
|----------|--------------|
| **Logo** | Cultural Discipline → Chief AI |
| **Primary gradient** | Purple → Navy |
| **Nav accents** | Add philosophy colors |
| **Button gradients** | Purple → Orange/Navy as appropriate |

---

## Discussion Points

1. **Approve structure-first approach?**
   - S11-12: Implement S13 layouts with existing purple theme
   - S13: Simple color/logo swap

2. **Epic U increased to 22 pts**
   - More comprehensive S13 layout implementation
   - Dashboard, Objectives, Assessment Hub, Question Library all get S13 structure

3. **Sprint 13 reduced to 8 pts**
   - Pure CSS variable swap
   - Logo asset replacement
   - Philosophy colors in navigation.js

4. **Total capacity:**
   - Sprint 11: 77 pts (3 weeks)
   - Sprint 12: 72 pts (2.5 weeks)
   - Sprint 13: 8 pts (2-3 days)

---

**Ready to approve?** This approach gives you modern Sprint 13 designs NOW while deferring the branding decision to Sprint 13.
