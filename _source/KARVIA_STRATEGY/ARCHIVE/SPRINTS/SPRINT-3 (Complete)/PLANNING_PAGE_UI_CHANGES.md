# Planning Page: Existing Plan View - UI Design
**Date**: November 24, 2025
**Goal**: Minimal, non-invasive changes to show existing weekly goals

---

## Current UI Analysis

### ✅ What Already Exists (No Changes Needed)

**1. KR Card Buttons (Lines 356-367)**
```html
<!-- Already has conditional buttons! -->
If weeksPlanned > 0:
  [✏️ Edit Plan]  [👁 View]  ← These buttons EXIST!

If weeksPlanned === 0:
  [📋 Create Plan]
```

**Status Indicators Already Working:**
- Gray: "Not planned"
- Orange: "5 of 12 weeks planned"
- Green: "12 of 12 weeks planned"

**Problem**: The "👁 View" button exists but has NO onclick handler (line 360)!

---

## 🎨 Design System (Keep Consistent)

**Colors:**
- Primary gradient: `#667eea` → `#764ba2` (purple)
- Purple backgrounds: `bg-purple-50`, `bg-purple-600`, `bg-purple-700`
- Purple text: `text-purple-600`, `text-purple-700`
- Status colors: Gray (not started), Orange (in progress), Green (complete)

**Components:**
- Cards: `bg-white border border-gray-200 rounded-lg p-4`
- Headers: Gradient from purple-50 to blue-50
- Buttons: Purple primary, Gray secondary

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [Quarter Selector: Q4 2025]                │
├─────────────────────────────────────────────┤
│  [Objective Tabs]                           │
├──────────────────┬──────────────────────────┤
│ Key Results (5)  │  Right Panel (7)         │
│  - KR Cards      │   - Empty State          │
│    with buttons  │   - Planning Form        │
│                  │   - Plan Review          │
│                  │   - [NEW] Existing Plan  │← ADD THIS
└──────────────────┴──────────────────────────┘
```

---

## 🆕 Changes Needed (Minimal)

### **Change 1: Fix "View" Button** (1 line)
**Current (line 360-362):**
```html
<button class="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50">
    👁 View
</button>
```

**New:**
```html
<button onclick="viewExistingPlan('${kr._id}')"
        class="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50">
    👁 View
</button>
```

---

### **Change 2: Add New Panel to Right Side** (After line 203)
Add 4th state alongside Empty/Form/Review:

```html
<!-- NEW: Existing Plan View -->
<div id="existingPlanView" class="hidden">
    <!-- Header matching existing style -->
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900">📋 Weekly Goals</h2>
        <span class="text-sm text-gray-600" id="planSummary">5 of 12 weeks planned</span>
    </div>

    <!-- KR Context (reuse existing style from planningForm) -->
    <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
        <div class="text-sm text-gray-600 mb-1">Key Result</div>
        <div id="viewKRTitle" class="font-semibold text-purple-700 mb-2"></div>
        <div class="flex space-x-6 text-sm">
            <span class="text-gray-600">Current: <span class="font-semibold text-gray-900" id="viewCurrentValue"></span></span>
            <span class="text-gray-600">Target: <span class="font-semibold text-gray-900" id="viewTargetValue"></span></span>
        </div>
    </div>

    <!-- Goals List (scrollable) -->
    <div class="space-y-3 mb-6 max-h-[400px] overflow-y-auto" id="existingGoalsList">
        <!-- Week cards will be inserted here -->
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-3">
        <button onclick="editExistingPlan()"
                class="flex-1 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700">
            ✏️ Edit Plan
        </button>
        <button onclick="addMoreWeeks()"
                class="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
            ➕ Add More Weeks
        </button>
    </div>
</div>
```

---

## 📐 Visual Mockup: Existing Plan View

### **Week Goal Card Design** (Matches existing style)
```
┌─────────────────────────────────────────────────────┐
│ Week 42  •  Nov 11 - Nov 17, 2025          [■■■ 75%]│
├─────────────────────────────────────────────────────┤
│ Increase customer outreach by 20 contacts           │
│                                                      │
│ Owner: Sarah Chen                    Target: 20     │
│ Status: In Progress                  Current: 15    │
└─────────────────────────────────────────────────────┘
```

**HTML for Week Card:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-4">
    <!-- Week Header -->
    <div class="flex justify-between items-center mb-3">
        <div class="flex items-center space-x-3">
            <span class="text-sm font-semibold text-purple-600">Week ${weekNum}</span>
            <span class="text-gray-400">•</span>
            <span class="text-xs text-gray-600">${dateRange}</span>
        </div>
        <div class="text-xs font-medium text-gray-700">${progress}%</div>
    </div>

    <!-- Goal Title -->
    <h4 class="font-medium text-gray-900 mb-3">${goalTitle}</h4>

    <!-- Progress Bar (reuse existing style) -->
    <div class="bg-gray-200 rounded-full h-2 mb-3">
        <div class="progress-bar h-2 rounded-full" style="width: ${progress}%;"></div>
    </div>

    <!-- Meta Info -->
    <div class="flex justify-between text-sm">
        <span class="text-gray-600">Owner: <span class="font-medium">${owner}</span></span>
        <span class="text-gray-600">Target: <span class="font-semibold text-purple-600">${target}</span></span>
    </div>
    <div class="flex justify-between text-xs mt-1">
        <span class="inline-flex items-center px-2 py-1 rounded-full ${statusBg} ${statusText}">
            ${statusIcon} ${status}
        </span>
        <span class="text-gray-600">Current: ${current}</span>
    </div>
</div>
```

**Status Badge Colors (match existing):**
- Not Started: `bg-gray-100 text-gray-600`
- In Progress: `bg-orange-100 text-orange-700`
- Completed: `bg-green-100 text-green-700`

---

## 🔄 User Flow (Visual Walkthrough)

### **Scenario 1: No Plan Yet**
```
[Key Result Card]
┌────────────────────────────────┐
│ Increase customer satisfaction │
│ Current: 42   Target: 60       │
│ [Progress: ■■■□□□□□ 30%]       │
│                                │
│ 🟡 Not planned                 │
│           [📋 Create Plan] ←── Only this button
└────────────────────────────────┘

Click "Create Plan" → Shows Planning Form (existing behavior)
```

### **Scenario 2: Partial Plan (NEW BEHAVIOR)**
```
[Key Result Card]
┌────────────────────────────────┐
│ Increase customer satisfaction │
│ Current: 45   Target: 60       │
│ [Progress: ■■■■□□□□ 50%]       │
│                                │
│ 🟠 5 of 12 weeks planned       │
│    [✏️ Edit Plan] [👁 View] ←── Both buttons clickable
└────────────────────────────────┘

Click "View" → Shows Existing Plan View (NEW)
Click "Edit Plan" → Shows Planning Form (existing)
```

**Right Panel After Clicking "View":**
```
┌─────────────────────────────────────────────┐
│ 📋 Weekly Goals        5 of 12 weeks planned│
├─────────────────────────────────────────────┤
│ ┌─ KR Context (purple gradient bg) ───────┐│
│ │ Key Result                               ││
│ │ Increase customer satisfaction           ││
│ │ Current: 45  Target: 60                  ││
│ └──────────────────────────────────────────┘│
│                                             │
│ ┌─ Week 42 ──────────────────────── 75% ─┐│
│ │ Increase outreach by 20 contacts        ││
│ │ [Progress bar: ■■■■■■■■□□ 75%]          ││
│ │ Owner: Sarah    Target: 20              ││
│ │ 🟠 In Progress  Current: 15             ││
│ └─────────────────────────────────────────┘│
│                                             │
│ ┌─ Week 43 ──────────────────────── 100% ┐│
│ │ Send follow-up emails                   ││
│ │ [Progress bar: ■■■■■■■■■■ 100%]         ││
│ │ Owner: John     Target: 30              ││
│ │ ✅ Completed    Current: 30             ││
│ └─────────────────────────────────────────┘│
│                                             │
│ [... 3 more week cards ...]                │
│                                             │
│ [✏️ Edit Plan] [➕ Add More Weeks]         │
└─────────────────────────────────────────────┘
```

### **Scenario 3: Complete Plan**
```
[Key Result Card]
┌────────────────────────────────┐
│ Increase customer satisfaction │
│ Current: 60   Target: 60       │
│ [Progress: ■■■■■■■■ 100%]      │
│                                │
│ ✅ 12 of 12 weeks planned      │
│    [✏️ Edit Plan] [👁 View] ←── Same buttons
└────────────────────────────────┘

Click "View" → Shows all 12 weeks in scrollable list
```

---

## 📊 Before & After Comparison

### **BEFORE (Current)**
```
User clicks KR with 5 weeks planned
  ↓
Always shows Planning Form (empty)
  ↓
User confused: "I already created this!"
  ❌ Can't see what was created
  ❌ Risk of duplicate creation
```

### **AFTER (New)**
```
User clicks "View" button
  ↓
Shows 5 existing week cards
  ↓
User sees what was created
  ✅ Can review existing goals
  ✅ Can edit if needed
  ✅ Can add more weeks (6-12)
```

---

## 🎯 What Changes (Summary)

### **HTML Changes:**
1. Line 360: Add `onclick="viewExistingPlan('${kr._id}')"`
2. After line 203: Add `<div id="existingPlanView">` panel (~60 lines)

### **JavaScript Changes:**
3. Add `viewExistingPlan(krId)` function (~30 lines)
4. Add `renderWeekCard(goal)` function (~20 lines)
5. Modify `planKR()` to route to edit mode (~5 lines)

### **CSS Changes:**
0 new CSS classes needed! Reuses all existing styles.

---

## 🚦 Visual Design Rules

**Match existing patterns:**
- ✅ Same purple gradient for KR context box
- ✅ Same border/shadow for cards
- ✅ Same progress bar style
- ✅ Same button colors (purple primary, gray secondary)
- ✅ Same text sizes and spacing
- ✅ Same status badge colors

**New elements blend in:**
- Week cards look like KR cards
- Header matches Planning Form header
- Buttons match existing button styles
- No new colors introduced

---

## 🤔 Discussion Points

**1. Week Card Info - Show all this?**
```
Current design shows:
✅ Week number + date range
✅ Goal title
✅ Progress bar
✅ Owner name
✅ Status badge
✅ Target value
✅ Current value

Too much? Remove anything?
```

**2. Scrolling behavior**
- Max height 400px with scroll?
- Show all weeks (could be 12)?
- Paginate if more than 5?

**3. Action Buttons**
```
Current mockup:
[✏️ Edit Plan] [➕ Add More Weeks]

Alternative:
[✏️ Edit Plan] [➕ Continue Planning] [🗑 Delete Plan]
```

**4. Empty weeks indication**
If 5 of 12 weeks planned:
- Show only the 5 created weeks?
- Show all 12 with 7 as "Not planned yet"?
- Show 5 + message "7 weeks remaining"?

**5. Sort order**
- Chronological (Week 40, 41, 42...)?
- Recent activity first?
- Status-based (In Progress → Not Started → Completed)?

---

## ⚡ Implementation Estimate

**Total effort: 2 hours**
- HTML structure: 30 min
- JavaScript functions: 45 min
- Testing & polish: 45 min

**Files modified: 1**
- `client/pages/planning.html` (~100 lines added)

**Zero breaking changes:**
- Existing flows untouched
- Only adds new "View" functionality
- Backward compatible

---

**Next Step**: Confirm visual design, then implement!

What do you think about:
1. Week card layout - too much info?
2. Colors/styling - matches existing?
3. Button labels - clear enough?
4. Anything to simplify further?
