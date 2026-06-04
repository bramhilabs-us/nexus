# Sprint Reorganization Plan

**Created**: January 19, 2026
**Purpose**: Reorganize Sprint 11-12-13 with UI standardization and functional redesigns
**Status**: STRATEGY DISCUSSION

---

## Design Standardization Vision

### Target UI Pattern (from assessment-creation-flow.html)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  STANDARD PAGE STRUCTURE                                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  NAVIGATION BAR (sticky)                                                    │ │
│  │  • Navigation component loaded via navigation.js                           │ │
│  │  • Philosophy colors (Sprint 13 ONLY)                                      │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  <main class="max-w-7xl mx-auto px-6 py-8 space-y-6">                          │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  HEADER SECTION                                                             │ │
│  │  <header class="flex flex-col lg:flex-row lg:items-center gap-4">          │ │
│  │    <h1 class="text-2xl font-bold text-gray-900">Page Title</h1>            │ │
│  │    <p class="text-gray-600 mt-1">Subtitle description</p>                  │ │
│  │  </header>                                                                  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  STEP PILLS / TAB NAVIGATION (if applicable)                               │ │
│  │  <section class="bg-white border border-gray-100 rounded-2xl px-6 py-4">   │ │
│  │    • step-pill active/inactive classes                                     │ │
│  │    • OR tab-button system                                                  │ │
│  │  </section>                                                                 │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  STAT CARDS (4-column grid)                                                │ │
│  │  <section class="grid md:grid-cols-4 gap-4">                               │ │
│  │    • bg-white border border-{color}-100 rounded-2xl p-5                    │ │
│  │    • Consistent stat card structure                                        │ │
│  │  </section>                                                                 │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  MAIN CONTENT AREA                                                          │ │
│  │  <section class="grid lg:grid-cols-5 gap-6">                               │ │
│  │    • Left panel (lg:col-span-2)                                            │ │
│  │    • Right panel (lg:col-span-3)                                           │ │
│  │  </section>                                                                 │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  </main>                                                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Standard CSS Classes

```css
/* Fonts */
body { font-family: 'Inter', sans-serif; background: #f9fafb; }

/* Cards */
.card-base { @apply bg-white border border-gray-200 rounded-2xl p-5; }
.card-stat { @apply bg-white border border-{color}-100 rounded-2xl p-5 shadow-sm; }

/* Step Pills */
.step-pill { border-radius: 999px; padding: 0.55rem 1.1rem; font-size: 0.8rem; font-weight: 600; }
.step-pill.active { background: linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%); color: #fff; }
.step-pill.inactive { background: #ede9fe; color: #4c1d95; }

/* Buttons */
.btn-primary { @apply karvia-gradient text-white px-6 py-3 rounded-lg font-medium; }
.btn-secondary { @apply border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg; }

/* Gradient (will be replaced in Sprint 13) */
.karvia-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
```

---

## Current Page Inventory

| Page | Module | Current State | Target State |
|------|--------|---------------|--------------|
| **dashboard.html** | Dashboard | Custom layout | Standard 3-col |
| **objectives.html** | OKR | Grid layout | Standard with sidebar |
| **planning.html** | Planning | Custom 5/7-col | Standard 2-panel |
| **assessment-hub.html** | Assessment | Tab-based | **REDESIGN to standard** |
| **assessment-question-library.html** | Assessment | Category tabs | **REDESIGN to standard** |
| **assessment-creation-flow.html** | Assessment | **GOLD STANDARD** | Keep as-is |
| **assessment-step2-customize.html** | Assessment | Follows standard | Keep structure |
| **assessment-review-launch.html** | Assessment | Follows standard | Keep structure |
| **team-ssi-view.html** | SSI | Custom | Standard + 12-block |
| **company-profile.html** | Company | Redesigned (S10) | Keep |
| **configuration.html** | Company | Redesigned (S10) | Keep |

---

## Reorganized Sprint Plan

### Separation of Concerns

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  SPRINT 11-12: FUNCTIONAL REDESIGNS (Structure + Features)                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • UI standardization across all pages                                          │
│  • New features (AI context, wizards, etc.)                                     │
│  • Page layout restructuring                                                     │
│  • Keep existing purple gradient                                                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                     ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│  SPRINT 13: BRANDING ONLY (Colors + Logo)                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  • Chief AI logo swap                                                           │
│  • Gradient color update                                                        │
│  • Philosophy colors on navigation                                              │
│  • NO structural changes                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## NEW: Epic U - UI Standardization (20 pts)

### Purpose
Standardize all pages to follow the assessment-creation-flow.html pattern before adding new features.

### Pages to Standardize

| Story | Page | Points | Changes |
|-------|------|--------|---------|
| **U1** | assessment-hub.html | 5 | Restructure to standard header + tabs + content |
| **U2** | assessment-question-library.html | 5 | Add standard header, restructure filters |
| **U3** | dashboard.html | 5 | Standard header + 3-column content |
| **U4** | objectives.html | 3 | Standard header + grid cards |
| **U5** | planning.html | 2 | Standard header (structure from Epic L) |
| **Total** | | **20** | |

### U1: Assessment Hub Redesign

```
BEFORE:                                    AFTER:
┌──────────────────────┐                  ┌──────────────────────────────────────┐
│ Assessments Hub      │                  │ <header>                             │
│ [Tab Nav inline]     │   ───────────→   │   Assessments Hub                    │
│                      │                  │   Manage assessments and templates   │
│ [Tab Content]        │                  │ </header>                            │
│                      │                  │                                      │
└──────────────────────┘                  │ <section class="bg-white rounded-2xl">│
                                          │   [Tab Pills: Assigned | Templates]  │
                                          │ </section>                            │
                                          │                                      │
                                          │ <section class="grid gap-4">         │
                                          │   [Stat Cards: 4-col grid]           │
                                          │ </section>                            │
                                          │                                      │
                                          │ <section>                            │
                                          │   [Tab Content]                      │
                                          │ </section>                            │
                                          └──────────────────────────────────────┘
```

### U2: Question Library Redesign

```
BEFORE:                                    AFTER:
┌──────────────────────┐                  ┌──────────────────────────────────────┐
│ Create Assessment    │                  │ <header>                             │
│ Template             │   ───────────→   │   SSI Question Library               │
│                      │                  │   Browse and select questions        │
│ [Stats Row]          │                  │ </header>                            │
│                      │                  │                                      │
│ [Category Tabs]      │                  │ <section class="grid md:grid-cols-4">│
│                      │                  │   [Stat Cards]                       │
│ [Question List]      │                  │ </section>                            │
│                      │                  │                                      │
└──────────────────────┘                  │ <section class="bg-white rounded-2xl">│
                                          │   [Filter Pills: Industry | Role]    │
                                          │ </section>                            │
                                          │                                      │
                                          │ <section class="grid lg:grid-cols-5">│
                                          │   LEFT (2): Dimension tabs           │
                                          │   RIGHT (3): Question cards          │
                                          │ </section>                            │
                                          └──────────────────────────────────────┘
```

---

## Reorganized Epic Assignments

### SPRINT 11 (75 pts - 3 weeks)

| Epic | Points | Focus | Module |
|------|--------|-------|--------|
| **Epic U** | 20 | UI Standardization (NEW) | All pages |
| **Epic J** | 28 | Assessment Credibility | Assessment |
| **Epic L** | 25 | Planning Redesign | Planning |
| **Quickfix** | 2 | Forgot Password | Auth |
| **Total** | **75** | | |

**Sprint 11 Breakdown by Module:**

```
MODULE: ASSESSMENT (48 pts)
├── U1: Assessment Hub standardization (5 pts)
├── U2: Question Library standardization (5 pts)
├── J1-J5: Backend schema + API (18 pts)
├── J6-J8: Template wizard (10 pts)
└── J filters already done (Jan 19)

MODULE: PLANNING (27 pts)
├── U5: Planning header standardization (2 pts)
├── L1-L6: Week tiles + AI context (25 pts)

MODULE: DASHBOARD (5 pts)
└── U3: Dashboard standardization (5 pts)

MODULE: OKR (3 pts)
└── U4: Objectives standardization (3 pts)

MODULE: AUTH (2 pts)
└── Quickfix: Forgot password (2 pts)
```

### SPRINT 12 (74 pts - 2.5 weeks)

| Epic | Points | Focus | Module |
|------|--------|-------|--------|
| **Epic D** | 5 | Dashboard 3-column (from S13) | Dashboard |
| **Epic O-style** | 3 | Objectives styling (from S13) | OKR |
| **Epic M Phase 1** | 13 | OKR Wizard Foundation | OKR |
| **Epic N** | 21 | SSI 12-Block Persistence | SSI |
| **Epic O** | 18 | Smart KR Target Calculator | OKR |
| **Epic P** | 9 | Industry Alignment | Company |
| **Epic Q** | 5 | LLM Security Fix (reduced) | AI |
| **Total** | **74** | | |

**Moved from Sprint 13 to Sprint 12:**
- Epic D (Dashboard redesign) - 5 pts
- Epic O-objectives (Objectives styling) - 3 pts

**Reduced:**
- Epic Q from 26 pts to 5 pts (auth fix only, defer prompt enrichment)

### SPRINT 13 (11 pts - 0.5 weeks)

| Epic | Points | Focus | Module |
|------|--------|-------|--------|
| **Epic R** | 3 | Chief AI Rebranding | Global |
| **Epic T** | 5 | Philosophy Colors | Navigation |
| **Epic QA** | 3 | Cross-page QA + Polish | All |
| **Total** | **11** | | |

**Sprint 13 is BRANDING ONLY:**
- Logo swap
- Color gradient update
- Navigation philosophy colors
- Final QA pass

---

## Visual Comparison: Before vs After

### Assessment Hub Evolution

```
CURRENT STATE (S10):                      SPRINT 11 TARGET:
┌────────────────────────────────┐        ┌────────────────────────────────┐
│ Assessments Hub                │        │ <header>                       │
│ Manage assessments...          │        │   Assessments Hub              │
│                                │        │   Manage assessments...        │
│ ┌─────────────────────────────┐│        │ </header>                      │
│ │ [Assigned] [Templates] [Sent]││        │                                │
│ └─────────────────────────────┘│        │ ┌──────────────────────────────┐
│                                │        │ │ Step Pills in card container │
│ ┌─────────────────────────────┐│        │ └──────────────────────────────┘
│ │ Tab Content                 ││        │                                │
│ │ (empty states)              ││        │ ┌─────┐┌─────┐┌─────┐┌─────┐  │
│ │                             ││  ───→  │ │Stats││Stats││Stats││Stats│  │
│ └─────────────────────────────┘│        │ └─────┘└─────┘└─────┘└─────┘  │
│                                │        │                                │
│                                │        │ ┌──────────────────────────────┐
│                                │        │ │ Tab Content with consistent  │
│                                │        │ │ card layouts                 │
│                                │        │ └──────────────────────────────┘
└────────────────────────────────┘        └────────────────────────────────┘
```

### Dashboard Evolution

```
CURRENT STATE (S10):                      SPRINT 11 (U3) + SPRINT 12 (D):
┌────────────────────────────────┐        ┌────────────────────────────────┐
│ ┌──────────────────────────────┐        │ <header>                       │
│ │ Gradient Header              │        │   Dashboard                    │
│ │ Dashboard | Your daily...    │        │   Your daily focus             │
│ └──────────────────────────────┘        │ </header>                      │
│                                │        │                                │
│ ┌────┐┌────┐┌────┐┌────┐      │        │ [Objective Context Cards]      │
│ │Stat││Stat││Stat││Stat│      │        │                                │
│ └────┘└────┘└────┘└────┘      │  ───→  │ TASKS ━━━░░░░░░░ 17%          │
│                                │        │ ┌──────┐┌──────┐┌──────┐      │
│ ┌──────────────────────────────┐        │ │Overdue│ Today │Tomorrow│     │
│ │ Tasks Today (list)           │        │ └──────┘└──────┘└──────┘      │
│ └──────────────────────────────┘        │                                │
│                                │        │ WEEKLY ━━━━━━░░░░ 40%         │
│ ┌──────────────────────────────┐        │ ┌──────┐┌──────┐┌──────┐      │
│ │ Weekly Goals (list)          │        │ │Last  ││This  ││Next  │      │
│ └──────────────────────────────┘        │ └──────┘└──────┘└──────┘      │
└────────────────────────────────┘        └────────────────────────────────┘
```

---

## Implementation Order

### Sprint 11 Execution (3 weeks)

```
WEEK 1: UI STANDARDIZATION (20 pts)
├── Day 1-2: U1 - Assessment Hub (5 pts)
├── Day 3-4: U2 - Question Library (5 pts)
├── Day 5: U3 - Dashboard header (5 pts)
├── Day 6: U4 - Objectives header (3 pts)
└── Day 7: U5 - Planning header (2 pts)

WEEK 2: ASSESSMENT CREDIBILITY (28 pts)
├── Day 8-9: J1-J3 - Schema + seeds (11 pts)
├── Day 10-11: J4-J5 - API + role questions (7 pts)
└── Day 12-14: J6-J8 - Template wizard UI (10 pts)

WEEK 3: PLANNING + QUICKFIX (27 pts)
├── Day 15-16: L1-L2 - Week tiles + KR sidebar (8 pts)
├── Day 17-18: L3-L4 - Expansion + status (8 pts)
├── Day 19-20: L5-L6 - AI context + UI (9 pts)
└── Day 21: Quickfix - Forgot password (2 pts)
```

### Sprint 12 Execution (2.5 weeks)

```
WEEK 1: DASHBOARD + OBJECTIVES + OKR (21 pts)
├── Day 1-2: D1-D4 - Dashboard 3-column (5 pts)
├── Day 3: O1-O3 - Objectives styling (3 pts)
└── Day 4-6: M1, M6, M10 - OKR Wizard (13 pts)

WEEK 2: SSI + CALCULATOR (39 pts)
├── Day 7-10: N1-N6 - 12-block persistence (21 pts)
└── Day 11-14: O1-O6 - Target calculator (18 pts)

WEEK 2.5: INDUSTRY + LLM FIX (14 pts)
├── Day 15-16: P1-P3 - Industry alignment (9 pts)
└── Day 17: Q-auth - LLM security fix (5 pts)
```

### Sprint 13 Execution (0.5 weeks)

```
DAYS 1-2: BRANDING (8 pts)
├── R1-R3: Chief AI logo + meta (3 pts)
└── T1-T4: Navigation philosophy colors (5 pts)

DAY 3: QA + POLISH (3 pts)
└── QA pass across all redesigned pages
```

---

## Summary: Epic Reordering

### FROM (Original)

| Sprint | Epics | Points |
|--------|-------|--------|
| Sprint 11 | J, L, M Phase 1, QF | 69 |
| Sprint 12 | N, O, P, Q | 74 |
| Sprint 13 | R, T, D, O-style, P-planning | 21 |

### TO (Reorganized)

| Sprint | Epics | Points | Focus |
|--------|-------|--------|-------|
| Sprint 11 | **U (NEW)**, J, L, QF | 75 | UI Standardization + Assessment + Planning |
| Sprint 12 | **D, O-style**, M Phase 1, N, O, P, Q-reduced | 74 | Dashboard + OKR + SSI + Industry |
| Sprint 13 | R, T, QA | 11 | **Branding ONLY** |

### Changes Made

| Change | Reason |
|--------|--------|
| **+Epic U (20 pts)** | UI standardization before features |
| **M Phase 1 → Sprint 12** | Depends on standardized objectives page |
| **D, O-style → Sprint 12** | Functional redesigns before branding |
| **P-planning REMOVED** | Overlap with Epic L |
| **Q reduced 26→5 pts** | Auth fix only, defer prompt enrichment |
| **+Epic QA (3 pts)** | Final polish pass |

---

## Discussion Points

1. **Approve Epic U (UI Standardization)?**
   - 20 pts to standardize all pages to assessment-creation-flow pattern
   - Foundation before adding new features

2. **Move D + O-style to Sprint 12?**
   - Dashboard and Objectives functional redesigns before branding
   - Sprint 13 becomes branding-only (clean separation)

3. **Reduce Epic Q from 26 to 5 pts?**
   - Do auth security fix now
   - Defer prompt enrichment to later sprint

4. **Sprint 11 capacity (75 pts in 3 weeks)?**
   - 25 pts/week is achievable
   - Week 1 is UI standardization (foundational work)

5. **Sprint 13 reduced to 11 pts?**
   - Becomes a focused branding sprint
   - Can be done in 2-3 days

---

## Appendix: Standard Component Library

### Header Component

```html
<header class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div>
        <h1 class="text-2xl font-bold text-gray-900">{Page Title}</h1>
        <p class="text-gray-600 mt-1">{Subtitle}</p>
    </div>
    <div class="flex items-center gap-3">
        {Action Buttons}
    </div>
</header>
```

### Stat Card Component

```html
<div class="bg-white border border-{color}-100 rounded-2xl p-5 shadow-sm">
    <p class="text-xs uppercase text-{color}-600 font-semibold">{Label}</p>
    <p class="text-2xl font-bold text-gray-900 mt-2">{Value}</p>
    <p class="text-sm text-gray-500 mt-1">{Description}</p>
</div>
```

### Step Pills Component

```html
<section class="bg-white border border-gray-100 rounded-2xl px-6 py-4 flex flex-wrap gap-3">
    <div class="step-pill active">Step 1 · {Name}</div>
    <div class="step-pill inactive">Step 2 · {Name}</div>
    <div class="step-pill inactive">Step 3 · {Name}</div>
</section>
```

### Two-Panel Layout

```html
<section class="grid lg:grid-cols-5 gap-6">
    <div class="lg:col-span-2">
        {Left Panel - Sidebar/Selection}
    </div>
    <div class="lg:col-span-3">
        {Right Panel - Main Content}
    </div>
</section>
```

---

**Document Status**: Ready for approval
**Next Action**: Approve reorganization, then update individual sprint master plans
