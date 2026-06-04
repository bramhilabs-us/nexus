# Epic 3: Weekly Goals Calendar - Design Audit

**Date**: November 25, 2025
**Epic**: Epic 3 - Weekly Goals Calendar (13 story points)
**Status**: ⚠️ SIGNIFICANT CONCERNS - Potential Redundancy and Complexity
**Recommendation**: DEFER or SIMPLIFY

---

## 📋 Executive Summary

**Proposed Feature**: 7-day calendar view with drag-and-drop goal management
**Story Points**: 13
**Estimated Duration**: 3 days

**Critical Finding**: 70-80% functional overlap with existing planning.html features completed in Sprint 4 Epic 0.

**Recommendation**: **DEFER** to later sprint or **SIMPLIFY** to calendar toggle view within existing planning page.

---

## 🔍 Redundancy Analysis

### What Already Exists (Sprint 4 Epic 0 - Completed)

**File**: `client/pages/planning.html`

#### Existing Weekly Goal Features:
1. ✅ **Weekly Goal Creation** (Lines 137-193)
   - Start week selector
   - Timeline in weeks (1-12)
   - End week preview
   - AI-generated weekly plans

2. ✅ **Existing Plan View** (Lines 858-928)
   - Shows all 12 weeks in quarter
   - Week cards with goal details
   - Status indicators (🟠 In Progress, ✅ Complete, 🔵 Not Planned)
   - Progress visualization

3. ✅ **Filter System** (Lines 214-238)
   - [All (12)] [In Progress (X)] [Completed (X)] [Not Planned (X)]
   - Click-to-filter functionality
   - Badge counts

4. ✅ **Week Navigation** (Lines 240-250)
   - Pagination (5 weeks per page)
   - Previous/Next navigation
   - "Showing X-Y of Z weeks" context

5. ✅ **Action Buttons** (Lines 252-265)
   - Edit Plan
   - Continue Planning
   - Delete Plan

6. ✅ **Week Card Display** (Lines 1051-1118)
   - Week range (e.g., "Week 1: Jan 1-7")
   - Goal title, owner, target, current value
   - Status color coding
   - Icons: 👤 owner, 🎯 target, 📊 current

---

### What Epic 3 Proposes (New Calendar View)

**Proposed File**: `client/pages/weekly-planner.html` (NEW)

#### Proposed Features:
1. **7-Day Calendar Grid**
   - Mon-Sun columns
   - ISO week numbers
   - Goals displayed as cards per day
   - Color coding by status

2. **Drag-and-Drop**
   - Move goals between days
   - Reschedule functionality

3. **Week Navigation**
   - Previous/Next week buttons (⚠️ DUPLICATE)
   - "Today" jump button
   - Week selector dropdown (⚠️ DUPLICATE)

4. **Quick Actions**
   - Click day → Add goal modal
   - Click goal → Edit inline (⚠️ EXISTS in planning.html)
   - Right-click context menu

---

## 🚨 Critical Design Flaws

### Flaw 1: Fundamental Misalignment with OKR Hierarchy

**Problem**: Goals in this system are **not day-specific** - they span **entire weeks**.

**Current Data Model**:
```javascript
Goal {
  week_number: 1,           // Week 1 of quarter
  start_date: "2025-01-01", // Monday
  end_date: "2025-01-07",   // Sunday
  title: "Research top 5 course platforms",
  // NO day-specific field
}
```

**Why Calendar View Doesn't Fit**:
- Goals are designed for **week-level planning**, not day-level
- A 7-day calendar implies daily task granularity
- **Tasks** are day-specific, but they're children of goals (not shown in current UI)

**Epic 3 Assumption Error**:
> "Each day shows goals as cards"

**Reality**: A goal spans the entire week (Mon-Sun). It doesn't belong to a specific day.

**Visual Mismatch**:
```
❌ Epic 3 Proposed (doesn't match data):
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │ Sun │
│Goal1│Goal2│     │Goal3│     │     │     │ ← Goals on specific days?
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘

✅ Current Implementation (matches data):
┌───────────────────────────────────────────┐
│ Week 1: Jan 1-7 (Mon-Sun)                 │
│ Goal: Research top 5 course platforms     │ ← Goal spans entire week
│ 👤 John  🎯 5 platforms  📊 3 researched  │
└───────────────────────────────────────────┘
```

---

### Flaw 2: Drag-and-Drop Violates OKR Cascade Logic

**Proposed Feature**: "Drag goals between days to reschedule"

**Problem**: This breaks the OKR hierarchy and date cascade rules.

**Current Architecture** (Sprint 3):
- Goals are validated against **quarter boundaries**
- Week numbers are **sequential** (Week 1, 2, 3... 12)
- Moving a goal to a different week requires:
  1. Validation against quarter dates
  2. Recalculation of dependencies
  3. Notification to goal owner
  4. Update to child tasks (if Sprint 5 implemented)

**Epic 3 Drag-and-Drop Risk**:
```javascript
// User drags goal from Monday to Friday
// What should happen?
// - Does this change the week_number?
// - Does this move it to next week?
// - Does this create day-level granularity (breaking data model)?
```

**Why This is Dangerous**:
- ❌ Could orphan goals outside valid quarter dates
- ❌ No validation in drag-and-drop UI (complex to add)
- ❌ Confuses "week-level planning" with "day-level scheduling"
- ❌ Contradicts Sprint 3's ValidationService design

---

### Flaw 3: 70% Functional Overlap

**Comparison Table**:

| Feature | Planning.html (Exists) | Epic 3 Calendar (Proposed) | Overlap % |
|---------|------------------------|----------------------------|-----------|
| View weekly goals | ✅ Week cards | ✅ Calendar cells | 90% |
| Filter by status | ✅ 4 filter buttons | ❌ Not in spec | 0% |
| Week navigation | ✅ Pagination | ✅ Prev/Next buttons | 100% |
| Add goal | ✅ Create form | ✅ Click day modal | 80% |
| Edit goal | ✅ Edit button | ✅ Click goal | 90% |
| Delete goal | ✅ Delete button | ✅ Context menu | 90% |
| Status display | ✅ Color dots + icons | ✅ Color coding | 85% |
| Progress tracking | ✅ Progress bars | ❌ Not in spec | 0% |
| Owner display | ✅ 👤 icon | ❌ Not in spec | 0% |
| Target/Current | ✅ 🎯📊 icons | ❌ Not in spec | 0% |

**Overall Functional Overlap**: ~70%

**Unique to Epic 3**: Drag-and-drop (which is problematic, see Flaw 2)

---

### Flaw 4: Creates Two Planning Interfaces (UX Confusion)

**User Experience Problem**:

**Scenario**: Manager wants to plan weekly goals
- **Option 1**: Go to `/pages/planning.html` → Click KR → Create weekly goals
- **Option 2**: Go to `/pages/weekly-planner.html` → Same goals, different view

**Questions**:
1. Which is the "primary" interface?
2. Do changes in one sync to the other?
3. Why two pages for the same data?
4. Where do users start their workflow?

**Best Practice**: Single source of truth with view toggle
```
✅ Better Design:
/pages/planning.html
  ├─ [List View] (current)
  ├─ [Calendar View] (toggle) ← Add this as a VIEW option
  └─ Same data, different visualization
```

---

### Flaw 5: Missing Data for Calendar Functionality

**Epic 3 Assumption**: "Each day shows goals as cards"

**Data Required** (Not in current model):
- `day_of_week` field (Mon, Tue, Wed...)
- `specific_date` field (not just start_date/end_date of week)
- Day-level status tracking

**Current Goal Model**:
```javascript
Goal {
  week_number: 1,
  start_date: "2025-01-01",  // Week start (Monday)
  end_date: "2025-01-07",     // Week end (Sunday)
  // NO day-specific fields
}
```

**To Support 7-Day Calendar**:
Would need to either:
1. Add day-specific fields (breaks existing model)
2. Show same goal across all 7 days (redundant, confusing)
3. Show goal only on Monday (arbitrary, incomplete)

**All options are problematic**.

---

### Flaw 6: Scope Creep - Not Core to OKR Workflow

**OKR Workflow** (Core path):
1. Define Objectives
2. Set Key Results
3. Create Quarterly Goals
4. Break into Weekly Goals ← **Current state: Working**
5. Track progress
6. Update status

**Where Calendar View Fits**: Nowhere in critical path

**When Would Users Need Calendar View**:
- ❓ To see which day a **week-long goal** is due? (Doesn't make sense)
- ❓ To drag goals between days? (Breaks data model)
- ❓ To see daily tasks? (Tasks not in current scope)

**Alternative Need**: Maybe users want to see **tasks** (daily) in calendar?
- **But**: Sprint 5 Epic 0 already plans to show tasks under weekly goals
- **And**: Tasks would be displayed in milestone view (week cards), not calendar

---

## 💰 Cost-Benefit Analysis

### Costs:
- **Development**: 13 story points (~3 days)
- **Files**: 3 new files (HTML + JS + CSS)
- **Maintenance**: Another UI to maintain
- **Complexity**: Drag-and-drop with validation
- **Testing**: New UI, interaction patterns
- **Documentation**: User guide for calendar view
- **UX**: Two interfaces for same data (confusion)

**Total Cost**: ~24-30 hours development + ongoing maintenance

### Benefits:
- ✅ Visual calendar representation
- ✅ Drag-and-drop (but problematic)
- ❌ No new functionality (all features exist)
- ❌ Doesn't align with data model (week-level, not day-level)
- ❌ Not in critical OKR workflow path

**Total Benefit**: Minimal - mostly aesthetic preference

**ROI**: 🔴 **NEGATIVE** - High cost, low benefit, high risk

---

## 📊 Relevancy Assessment

### Question: Do users need this?

**Evidence Against**:
1. **Planning page already works** - Completed in Sprint 4 Epic 0
2. **No user requests** for calendar view (assumption-driven)
3. **Data model doesn't support** day-level granularity
4. **OKR methodology** operates at week-level, not day-level
5. **Sprint 5** already plans task display (milestone-based)

**Evidence For**:
1. Calendar is familiar mental model
2. Some users prefer visual scheduling
3. Might help with resource allocation

**Verdict**: 🟡 **LOW RELEVANCY** - Nice to have, not need to have

---

## 🔧 Alternative Approaches

### Option 1: Add Calendar Toggle to Existing Planning Page (Recommended)

**Approach**: Single page, two view modes

**Implementation** (~3-5 story points):
```
/pages/planning.html
  Header: [List View 📋] [Calendar View 📅] ← Toggle

  List View (current):
  ┌───────────────────────────────┐
  │ Week 1: Jan 1-7               │
  │ Goal: Research platforms      │
  └───────────────────────────────┘

  Calendar View (new):
  ┌───────────────────────────────┐
  │ Week 1: Jan 1-7               │
  │ [===Goal Block===]            │ ← Spans full week
  └───────────────────────────────┘
```

**Benefits**:
- ✅ Single source of truth
- ✅ No duplicate functionality
- ✅ Simpler (just different rendering)
- ✅ ~60% less work (3-5 pts vs 13 pts)
- ✅ Respects data model (week-level display)

---

### Option 2: Wait for Sprint 5 Task Feature, Then Reconsider

**Rationale**: Sprint 5 Epic 0 adds task display

**Sprint 5 Plan**:
- Display tasks under weekly goals (milestones)
- Tasks are day-specific (or action-specific)
- Interactive task checkboxes

**After Sprint 5**: Assess if calendar view makes sense for **tasks** (not goals)

**Timeline**: Defer to Sprint 6 or later

---

### Option 3: Simplify to Week-at-a-Glance Widget

**Minimal Implementation** (~2-3 story points):

```
Current Week Widget (Dashboard/Planning Page):
┌────────────────────────────────────────┐
│ This Week (Week 45: Nov 25 - Dec 1)   │
├─────┬─────┬─────┬─────┬─────┬──┬──────┤
│ Mon │ Tue │ Wed │ Thu │ Fri │..│ Sun  │
│  •  │  ✓  │  •  │     │     │  │      │ ← Task dots
└─────┴─────┴─────┴─────┴─────┴──┴──────┘
Goal: Research course platforms
```

**Show**:
- Current week only (not full quarter)
- Task completion dots (after Sprint 5)
- Collapsed view (not full calendar)

**Effort**: 2-3 points vs 13 points

---

### Option 4: Cancel Epic 3 Entirely

**Rationale**:
- Planning.html already provides all necessary features
- Calendar view doesn't align with OKR methodology
- Better to focus on Sprint 5 (milestones + tasks)
- Can revisit if user feedback demands it

**Recommendation**: ✅ **YES** - Cancel Epic 3

---

## 🎯 Final Recommendations

### Primary Recommendation: **CANCEL EPIC 3**

**Reasons**:
1. 🔴 70% redundant with existing planning.html
2. 🔴 Data model doesn't support day-level granularity
3. 🔴 Drag-and-drop breaks validation logic
4. 🔴 Creates UX confusion (two interfaces)
5. 🔴 Not in critical OKR workflow path
6. 🔴 High cost, low benefit (negative ROI)
7. 🔴 Sprint 5 tasks feature is more relevant

### Alternative Recommendation: **SIMPLIFY DRASTICALLY**

**If you still want calendar visualization**:
- ✅ Add toggle view to existing planning.html (3-5 points)
- ✅ Display goals as week-spanning blocks (not daily)
- ✅ NO drag-and-drop (keep existing edit flow)
- ✅ Reuse existing filter/navigation (no duplication)

**Effort**: 3-5 points vs 13 points (60% savings)

---

## 📝 Discussion Points

### 1. User Need Validation
**Question**: Have users requested calendar view?
- If NO: Cancel Epic 3
- If YES: Understand their exact use case
  - Are they looking for daily task tracking? (Sprint 5 handles this)
  - Do they want visual week representation? (Simpler toggle view)

### 2. Data Model Alignment
**Question**: Should goals be day-specific or week-specific?
- Current design: Week-specific (aligns with OKR methodology)
- Calendar view implies: Day-specific (contradicts data model)
- **Decision needed**: Which paradigm to follow?

### 3. Sprint 5 Dependency
**Question**: Should we wait to see Sprint 5 task display first?
- Sprint 5 adds tasks under weekly goals
- Tasks are more suitable for daily calendar
- Recommendation: See Sprint 5 first, then reassess

### 4. ROI Justification
**Question**: Is 13 story points justified for aesthetic preference?
- Planning page works well (user feedback?)
- Other features might provide more value
- Could those 13 points be better spent elsewhere?

### 5. UX Complexity
**Question**: How do users choose between list view and calendar view?
- Toggle on same page? (Recommended)
- Separate pages? (Confusing)
- Context-dependent? (Complex)

---

## ✅ Conclusion

**Epic 3 (Weekly Goals Calendar) should be CANCELLED or DRASTICALLY SIMPLIFIED.**

**Primary Issues**:
- 70% feature redundancy
- Data model misalignment
- High risk (drag-and-drop breaks validation)
- Low ROI (aesthetic change, not functional)
- Sprint 5 tasks are more relevant for daily view

**Recommended Action**:
1. **Cancel Epic 3** from Sprint 4
2. **Focus on Sprint 5** (Milestone-based planning with tasks)
3. **Revisit calendar concept** after Sprint 5 if user feedback demands it
4. **If calendar needed**: Implement as toggle view (3-5 pts), not separate page (13 pts)

**Story Points Saved**: 13 points (3 days of development)
**Better Use of Time**: Sprint 5 Epic 0 (Milestones) + Sprint 5 Epic 4 Phase 1 (Consultant backend)

---

**Created**: November 25, 2025
**Status**: Recommendation - Defer or Cancel Epic 3
**Next Action**: Discuss with stakeholders, validate user need

