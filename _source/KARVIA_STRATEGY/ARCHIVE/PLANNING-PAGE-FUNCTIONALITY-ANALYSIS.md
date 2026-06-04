# Planning Page - Complete Functionality Analysis

**Created**: January 19, 2026
**Purpose**: Document all Planning page features before S13 redesign implementation
**Status**: APPROVED - Structure first, branding later

---

## Current Planning Page Features

### 1. Navigation & Header
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  HEADER SECTION                                                                │
├────────────────────────────────────────────────────────────────────────────────┤
│  • Page title: "Planning"                                                      │
│  • Subtitle: "Convert Key Results into actionable weekly goals"                │
│  • Period type display (Quarterly/Yearly Planning)                            │
│  • Quarter selector dropdown (Q1-Q4, dynamically populated)                   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Objective Tabs (Horizontal)
```
┌────────────────────────────────────────────────────────────────────────────────┐
│  [📊 Objective 1] [⚡ Objective 2] [👥 Objective 3] [🎯 Objective 4]           │
├────────────────────────────────────────────────────────────────────────────────┤
│  • Emoji icons per objective                                                   │
│  • Active tab has gradient background                                          │
│  • Click to switch objectives                                                  │
│  • Shows all company objectives for selected quarter                          │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Two-Panel Layout (5/7 split)

#### LEFT PANEL: Key Results (md:col-span-5)
```
┌─────────────────────────────────────────┐
│  KEY RESULTS                            │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  KR CARD                          │  │
│  │  ─────────────────────────────────│  │
│  │  Title: "Increase revenue by 20%" │  │
│  │  Current: 10 | Target: 20         │  │
│  │  Progress: ━━━━━░░░░░ 50%         │  │
│  │  Status: "3 of 12 weeks planned"  │  │
│  │  [👁 View Plan] [✏️ Edit]         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  KR CARD (Not Planned)            │  │
│  │  Status: "Not planned"            │  │
│  │  [📋 Create Plan]                 │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**KR Card Features:**
- Title display
- Current vs Target values
- Progress bar (gradient)
- Planning status (X of 12 weeks planned)
- Status badges: "Planned", "Complete"
- Action buttons: View Plan, Edit, Create Plan

#### RIGHT PANEL: Planning Workspace (md:col-span-7)

**State 1: Empty State**
```
┌───────────────────────────────────────────────────┐
│                                                   │
│            📋                                     │
│                                                   │
│  "Select a Key Result to Plan"                    │
│  "Choose a KR from the left panel..."            │
│                                                   │
└───────────────────────────────────────────────────┘
```

**State 2: Planning Form (Create New)**
```
┌───────────────────────────────────────────────────┐
│  CREATE WEEKLY GOALS                              │
├───────────────────────────────────────────────────┤
│                                                   │
│  ┌───────────────────────────────────────────────┐
│  │  KR CONTEXT (gradient background)             │
│  │  Key Result: "Increase revenue by 20%"        │
│  │  Current: 10 | Target: 20 | Gap: 10           │
│  └───────────────────────────────────────────────┘
│                                                   │
│  FORM FIELDS:                                     │
│  ┌─────────────────┐  ┌─────────────────┐        │
│  │ Start Week      │  │ Timeline (Weeks) │        │
│  │ [Week 1 ▼]      │  │ [10]             │        │
│  └─────────────────┘  └─────────────────┘        │
│                                                   │
│  Default Owner: [Select team member ▼]            │
│                                                   │
│  [🤖 Generate AI Plan]                            │
│                                                   │
└───────────────────────────────────────────────────┘
```

**State 3: Loading State**
```
┌───────────────────────────────────────────────────┐
│                                                   │
│            ⏳ (spinner)                           │
│                                                   │
│  "AI is generating your plan..."                  │
│                                                   │
└───────────────────────────────────────────────────┘
```

**State 4: Plan Review (After Generation)**
```
┌───────────────────────────────────────────────────┐
│  REVIEW GENERATED PLAN                            │
├───────────────────────────────────────────────────┤
│                                                   │
│  Week 1: Target 2 | Tasks: 3                      │
│  Week 2: Target 2 | Tasks: 3                      │
│  Week 3: Target 2 | Tasks: 3                      │
│  ...                                              │
│                                                   │
│  [✅ Create Goals]  [🔄 Regenerate Plan]          │
│                                                   │
└───────────────────────────────────────────────────┘
```

**State 5: Existing Plan View**
```
┌───────────────────────────────────────────────────┐
│  📋 WEEKLY GOALS                     [Dashboard →]│
├───────────────────────────────────────────────────┤
│                                                   │
│  VIEW TOGGLE:                                     │
│  [📋 List] [🌳 Tree]                              │
│                                                   │
│  KR CONTEXT:                                      │
│  Key Result: "..." | Current: 10 | Target: 20    │
│                                                   │
│  FILTERS:                                         │
│  [All (12)] [🟠 In Progress (3)] [✅ Completed (5)]│
│  [🔵 Not Planned (4)]                             │
│                                                   │
│  WEEK CARDS:                                      │
│  ┌───────────────────────────────────────────────┐
│  │  Week 1 • Jan 1-7            🟠 In Progress   │
│  │  "Complete initial setup"                     │
│  │  Progress: ━━━━━░░░░░ 50%                     │
│  │  👤 John Smith | 🎯 Target: 2                 │
│  │                                               │
│  │  📋 Tasks (2/4 done)                    [▼]   │
│  │  ┌─────────────────────────────────────────┐ │
│  │  │ ☑ Task 1: Setup environment             │ │
│  │  │ ☑ Task 2: Configure database            │ │
│  │  │ ☐ Task 3: Deploy to staging             │ │
│  │  │ ☐ Task 4: Run tests                     │ │
│  │  └─────────────────────────────────────────┘ │
│  └───────────────────────────────────────────────┘
│                                                   │
│  PAGINATION: [◄ Prev] Page 1 of 3 [Next ►]       │
│                                                   │
│  ACTIONS:                                         │
│  [✏️ Edit Plan] [➕ Continue Planning] [🗑 Delete] │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## Complete Feature List

### PLANNING FEATURES

| # | Feature | Description | Sprint |
|---|---------|-------------|--------|
| **P1** | Quarter Selector | Dynamic Q1-Q4 based on company config | S5 |
| **P2** | Period Type Display | Shows "Quarterly" or "Yearly" planning mode | S5 |
| **P3** | Objective Tabs | Horizontal tabs to switch between objectives | Core |
| **P4** | KR Cards | Display KR status, progress, planning count | Core |
| **P5** | KR Selection | Click KR to view/create plan | Core |
| **P6** | Week Generation | Generate weeks from objective date range | S8 |

### AI GENERATION FEATURES

| # | Feature | Description | Sprint |
|---|---------|-------------|--------|
| **G1** | Start Week Selection | Dropdown with weeks from objective period | S8 |
| **G2** | Timeline Input | Number of weeks to generate (1-12) | Core |
| **G3** | Default Owner | Assign owner to all generated goals | Core |
| **G4** | AI Plan Generation | Backend generates milestones + tasks | S5 |
| **G5** | Plan Review | Review generated plan before saving | S5 |
| **G6** | Regenerate Plan | Discard and regenerate | Core |
| **G7** | Plan Extension | Continue planning remaining weeks | S8 F |

### EXISTING PLAN VIEW FEATURES

| # | Feature | Description | Sprint |
|---|---------|-------------|--------|
| **V1** | KR Context Display | Show current/target values | S4 |
| **V2** | Status Filters | All, In Progress, Completed, Not Planned | S4 |
| **V3** | Filter Counts | Badge counts per status | S4 |
| **V4** | Week Cards | Display week with tasks, owner, progress | S5 |
| **V5** | Expandable Tasks | Click to show/hide task list | S5 |
| **V6** | Task Checkboxes | Toggle task completion inline | S5 |
| **V7** | Pagination | 5 weeks per page | S4 |
| **V8** | List View | Default card-based view | S4 |
| **V9** | Tree View | Hierarchical Q → Week → Task view | S7 C |
| **V10** | Dashboard Link | Quick nav to dashboard | S7 C5 |

### TASK MANAGEMENT FEATURES

| # | Feature | Description | Sprint |
|---|---------|-------------|--------|
| **T1** | Task Display | Name, assignee, due date, priority | S5 |
| **T2** | Task Status Toggle | Checkbox to mark complete | S5 |
| **T3** | Status Update API | PUT /api/tasks/:id/status | S5 |
| **T4** | Progress Calculation | % from completed tasks | S5 |

### PLAN MANAGEMENT FEATURES

| # | Feature | Description | Sprint |
|---|---------|-------------|--------|
| **M1** | Edit Plan | Switch to planning form | S4 |
| **M2** | Continue Planning | Add more weeks to existing plan | S8 F |
| **M3** | Delete Plan | Bulk delete all weeks/tasks | S5 |
| **M4** | Conflict Detection | Alert if plan already exists | S5 |

### OWNER ASSIGNMENT FEATURES

| # | Feature | Description | Sprint |
|---|---------|-------------|--------|
| **O1** | Team Member Dropdown | Fetch users from /api/auth/users | Core |
| **O2** | Owner Display | Show owner name on week cards | S5 |
| **O3** | Per-Week Owner | Week-level owner dropdown in review | Core |

### POSTPONING FEATURES (Not Yet Implemented)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| **PP1** | Postpone Week | Move week goals to next week | NOT IMPLEMENTED |
| **PP2** | Reschedule Task | Move individual task to different date | NOT IMPLEMENTED |
| **PP3** | Bulk Reschedule | Move multiple tasks | NOT IMPLEMENTED |

---

## Features to Add in S13 Redesign

### New Features for Epic L (Planning Redesign)

| # | Feature | Points | Description |
|---|---------|--------|-------------|
| **L-NEW-1** | Week Tiles Grid | 3 | 6-column week tiles instead of cards |
| **L-NEW-2** | KR Sidebar | 2 | Left panel with KR filter list |
| **L-NEW-3** | Owner Filter | 2 | Filter by task owner in sidebar |
| **L-NEW-4** | Week Expansion | 3 | Click week to show task details |
| **L-NEW-5** | AI Context Assembly | 5 | Gather context for AI suggestions |
| **L-NEW-6** | AI Suggestions Panel | 4 | Show AI recommendations |
| **L-NEW-7** | Clickable Owner | 2 | Click owner to assign/reassign |

### Postponing Features (Add to Epic L or Future Sprint)

| # | Feature | Points | Description |
|---|---------|--------|-------------|
| **PP1** | Postpone Week | 3 | Button to move week to next |
| **PP2** | Reschedule Task | 2 | Drag or date picker to reschedule |
| **PP3** | Postpone Reason | 1 | Optional reason when postponing |

---

## S13 Design Implementation Plan

### Existing Features to PRESERVE

All features V1-V10, T1-T4, M1-M4, O1-O3 must be preserved in the new design.

### UI Changes (Structure Only)

```
CURRENT (S10):                           S13 TARGET:
┌────────────────────────────────────┐   ┌────────────────────────────────────┐
│ Header (gradient bg)               │   │ Header (clean, no gradient)        │
│ ┌───────────────────────────────┐  │   │ Planning          [Week Nav]       │
│ │ Planning                      │  │   │                                    │
│ │ Convert KRs to weekly goals   │  │   │ ┌─────────────────────────────────┐│
│ └───────────────────────────────┘  │   │ │ Objective Pills (minimalist)    ││
├────────────────────────────────────┤   │ │ [O1|65%] [O2|45%] [O3|78%]     ││
│ [Objective Tabs - Full Width]      │   │ └─────────────────────────────────┘│
├────────────────────────────────────┤   ├────────────────────────────────────┤
│ ┌───────────┐  ┌─────────────────┐ │   │ ┌────────┐  ┌─────────────────────┐│
│ │ KR List   │  │ Planning        │ │   │ │SIDEBAR │  │ WEEK TILES GRID     ││
│ │ (5 cols)  │  │ Workspace       │ │   │ │(280px) │  │ (flex)              ││
│ │           │  │ (7 cols)        │ │   │ │        │  │                     ││
│ │ [KR Card] │  │ [Week Cards]    │ │   │ │ KR LIST│  │ ┌──┐┌──┐┌──┐┌──┐   ││
│ │ [KR Card] │  │ [Week Cards]    │ │   │ │ ○ KR1  │  │ │W1││W2││W3││W4│   ││
│ │ [KR Card] │  │ [Pagination]    │ │   │ │ ● KR2  │  │ └──┘└──┘└──┘└──┘   ││
│ │           │  │                 │ │   │ │ ○ KR3  │  │ ┌──┐┌──┐┌──┐┌──┐   ││
│ │           │  │ [Actions]       │ │   │ │        │  │ │W5││W6││W7││W8│   ││
│ └───────────┘  └─────────────────┘ │   │ │OWNERS  │  │ └──┘└──┘└──┘└──┘   ││
│                                    │   │ │ ○ All  │  │                     ││
│                                    │   │ │ ● Sarah│  │ [Expanded Week]     ││
│                                    │   │ │ ○ John │  │                     ││
│                                    │   │ └────────┘  └─────────────────────┘│
└────────────────────────────────────┘   └────────────────────────────────────┘
```

### Feature Migration Table

| Current Feature | S13 Location | Change |
|-----------------|--------------|--------|
| Header gradient | Clean header | Remove gradient |
| Objective tabs | Objective pills | Horizontal minimalist cards |
| KR Card list | Left sidebar KR list | Compact radio-style list |
| Week cards | Week tiles grid | 4x3 grid of mini tiles |
| Task expansion | Week expansion panel | Bottom panel on tile click |
| Filters | Sidebar filters | Move filters to sidebar |
| Tree view | KEEP | Preserve as toggle option |
| Pagination | REMOVE | All weeks visible as tiles |

---

## Implementation Order

### Week 1: Structure Migration (Epic L Stories L1-L2)

1. **L1: Week Tiles Grid (5 pts)**
   - Replace week cards with 4-column grid
   - Preserve all data display
   - Keep progress bars, status badges

2. **L2: KR Sidebar (3 pts)**
   - Move KR list to left sidebar
   - Radio-style selection
   - Preserve all KR card data

### Week 2: Enhanced Features (Epic L Stories L3-L4)

3. **L3: Week Expansion Panel (5 pts)**
   - Click tile to expand below
   - Show full task list in panel
   - Preserve task checkboxes

4. **L4: Status Calculation (3 pts)**
   - Calculate week status from tasks
   - Visual status on tiles
   - Preserve filter counts

### Week 3: AI Integration (Epic L Stories L5-L6)

5. **L5: AI Context Assembly (5 pts)**
   - Gather context for suggestions
   - Company profile, SSI, history

6. **L6: AI Suggestions Panel (4 pts)**
   - Show AI recommendations
   - "Suggested actions" section

---

## Postponing Feature Specification

### PP1: Postpone Week (3 pts)

**User Story**: As a manager, I want to postpone an entire week's goals to the next week when my team can't complete them on time.

**UI Location**: Week card/tile action menu

```html
<!-- Week Card Actions -->
<div class="week-actions">
    <button onclick="postponeWeek('${weekId}')">
        ⏭ Postpone to Next Week
    </button>
</div>
```

**API Endpoint**:
```javascript
// POST /api/planning/goals/:goalId/postpone
{
    "target_week": 5,  // Move from week 4 to week 5
    "reason": "Team capacity reduced"  // Optional
}
```

**Behavior**:
1. Click "Postpone" on Week 4
2. All incomplete tasks move to Week 5
3. Week 4 status becomes "Postponed"
4. Week 5 tasks merge with existing (if any)
5. Log postponement in goal history

### PP2: Reschedule Task (2 pts)

**User Story**: As a user, I want to reschedule a specific task to a different week or date.

**UI Location**: Task row action

```html
<!-- Task Row -->
<div class="task-item">
    <span>Task Name</span>
    <button onclick="openRescheduleModal('${taskId}')">
        📅 Reschedule
    </button>
</div>
```

**Modal**:
```
┌────────────────────────────────────┐
│  Reschedule Task                   │
├────────────────────────────────────┤
│  Task: "Complete report"           │
│  Current Week: Week 3              │
│                                    │
│  Move to: [Week 4 ▼]               │
│  OR                                │
│  New Date: [📅 Jan 25, 2026]       │
│                                    │
│  Reason (optional):                │
│  [________________]                │
│                                    │
│  [Cancel]  [Reschedule]            │
└────────────────────────────────────┘
```

---

## Summary: What to Preserve vs Change

### MUST PRESERVE (Critical Functionality)

| Feature | Reason |
|---------|--------|
| AI Plan Generation | Core workflow |
| Task Checkboxes | Daily usage |
| KR Progress Display | Key metric |
| Plan Extension | Incremental planning |
| Delete Plan | Housekeeping |
| Filter System | Navigation |
| Tree View | Alternative view |

### CHANGE (UI Only)

| Current | S13 Target | Benefit |
|---------|------------|---------|
| Week cards (vertical) | Week tiles (grid) | More weeks visible |
| KR cards (large) | KR list (compact) | More sidebar space |
| Filters (inline) | Filters (sidebar) | Cleaner layout |
| Header (gradient) | Header (clean) | Modern look |
| Objective tabs | Objective pills | Space efficient |

### ADD (New Features)

| Feature | Points | Priority |
|---------|--------|----------|
| Clickable owner assignment | 2 | P1 |
| AI suggestions panel | 4 | P2 |
| Postpone week | 3 | P2 |
| Reschedule task | 2 | P3 |

---

## Approved Sprint 11 Plan

With this analysis, Sprint 11 Epic L scope is confirmed:

| Story | Points | Description |
|-------|--------|-------------|
| L1 | 5 | Week tiles grid |
| L2 | 3 | KR sidebar |
| L3 | 5 | Week expansion panel |
| L4 | 3 | Status calculation |
| L5 | 5 | AI context assembly |
| L6 | 4 | AI suggestions UI |
| **Total** | **25** | |

**Postponing features (PP1-PP3)**: Defer to Sprint 12 or 13 as separate epic.

---

**Document Status**: APPROVED
**Next Action**: Begin Sprint 11 implementation with Epic U (UI standardization) first
