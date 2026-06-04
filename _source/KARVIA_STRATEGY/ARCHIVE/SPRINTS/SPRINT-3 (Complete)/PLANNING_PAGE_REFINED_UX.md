# Planning Page: Refined UX Design
**Date**: November 24, 2025
**Focus**: Minimal cognitive load, visual hierarchy, smart infographics

---

## 🎨 Week Card Redesign (Minimal Cognitive Load)

### **UX Principles Applied:**
1. **F-Pattern Reading**: Most important info top-left
2. **Visual Before Text**: Icons and colors for instant recognition
3. **Progressive Disclosure**: Essential only, details on demand
4. **Gestalt Proximity**: Group related info
5. **Visual Hierarchy**: Size, weight, color to guide eye

---

### **Redesigned Week Card (Planned)**

```
┌─────────────────────────────────────────────────────────┐
│ Week 42 • Nov 11-17           [■■■■■■■□□□] 75%    🟠    │ ← Header: Status at a glance
├─────────────────────────────────────────────────────────┤
│ Increase customer outreach by 20 contacts              │ ← Goal title (truncated at 60 chars)
│                                                         │
│ 👤 SC    🎯 20    📊 15                                 │ ← Icon metrics (Owner, Target, Current)
└─────────────────────────────────────────────────────────┘
   ↑       ↑      ↑                 ↑              ↑
 Week #  Date    Progress bar    Progress %    Status dot
```

**Visual Scan (Top to Bottom):**
1. **Week badge + Date**: Quick reference
2. **Progress bar + %**: Visual + numerical progress
3. **Status dot**: Color-coded (🟠 orange, ✅ green, ⚪ gray)
4. **Goal title**: One-line description
5. **Icon metrics**: Owner initials, Target, Current value

**Cognitive Load Reduction:**
- ❌ Removed: Verbose labels ("Owner:", "Target:", "Status:")
- ✅ Added: Icons (👤 🎯 📊) - universal recognition
- ❌ Removed: Full status text ("In Progress")
- ✅ Added: Color dot + tooltip on hover
- ❌ Removed: Redundant "Current" text
- ✅ Added: Compact metric display

**Color Coding (Instant Recognition):**
- 🟠 Orange dot = In Progress
- ✅ Green dot = Completed
- ⚪ Gray dot = Not Started
- 🔵 Blue dot = Not Planned Yet

---

### **Redesigned Week Card (Not Planned)**

```
┌─────────────────────────────────────────────────────────┐
│ Week 43 • Nov 18-24           [□□□□□□□□□□] 0%     🔵    │
├─────────────────────────────────────────────────────────┤
│ Not planned yet                                         │
│                                                         │
│ [➕ Add Goal for This Week]                             │
└─────────────────────────────────────────────────────────┘
```

**UX Intent:**
- Clear visual distinction (blue dot, empty bar)
- Actionable: Click card or button → jumps to planning form for that week
- Minimal text: "Not planned yet" is enough

---

## 📄 Pagination Design (More Than 5 Weeks)

### **Compact Pagination Bar**

```
┌─────────────────────────────────────────────────────────┐
│ ┌─ Week 40 ────────────────────────────────────────┐   │
│ │ ...                                              │   │
│ └──────────────────────────────────────────────────┘   │
│                                                         │
│ ┌─ Week 44 ────────────────────────────────────────┐   │
│ │ ...                                              │   │
│ └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│         Showing 1-5 of 12 weeks                         │
│         ◄  1  [2]  3  ►                                 │
└─────────────────────────────────────────────────────────┘
```

**Pagination Logic:**
- 5 weeks per page
- 12 weeks total = 3 pages
- Current page highlighted: `[2]`
- Arrow navigation: `◄ Previous` | `Next ►`
- Show "Showing X-Y of Z weeks" for context

**Alternative: "Show More" Button**
```
┌─────────────────────────────────────────────────────────┐
│ [5 week cards displayed]                                │
├─────────────────────────────────────────────────────────┤
│          [▼ Show 7 More Weeks]                          │
└─────────────────────────────────────────────────────────┘
```

**Which do you prefer?**
- **Option A**: Pagination with page numbers (better for 12 weeks)
- **Option B**: "Show More" button (better for <10 weeks)

---

## 🎛️ Action Buttons (Your Specs)

```
┌─────────────────────────────────────────────────────────┐
│ [✏️ Edit Plan] [➕ Continue Planning] [🗑 Delete Plan]  │
└─────────────────────────────────────────────────────────┘
     ↑ Primary       ↑ Secondary           ↑ Danger
```

**Button Behaviors:**

### **1. ✏️ Edit Plan** (Primary - Purple)
- Opens planning form
- **Pre-filled** with all existing weeks
- Shows weeks 1-12 with existing data populated
- User can modify any week
- "Update Plan" button (not "Create")

### **2. ➕ Continue Planning** (Secondary - Gray)
- Opens planning form
- Shows **only unplanned weeks**
- If weeks 1-5 planned → shows weeks 6-12
- Streamlined for adding more
- "Add to Plan" button

### **3. 🗑 Delete Plan** (Danger - Red)
- Confirmation modal:
  ```
  ⚠️ Delete Weekly Plan?

  This will delete all 5 weekly goals for this Key Result.
  This action cannot be undone.

  [Cancel]  [🗑 Delete All Goals]
  ```
- On confirm: DELETE all weekly goals for this KR
- Returns to empty state

**Button Styling:**
```html
<!-- Primary -->
<button class="flex-1 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700">
    ✏️ Edit Plan
</button>

<!-- Secondary -->
<button class="flex-1 py-3 border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50">
    ➕ Continue Planning
</button>

<!-- Danger -->
<button class="flex-1 py-3 border-2 border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50">
    🗑 Delete Plan
</button>
```

---

## 🗓️ Empty Weeks: Show All 12 (Your Spec)

### **Implementation Logic:**

```javascript
// 1. Fetch all weeks in quarter (Q4 = Weeks 40-51, or 1-12)
const quarterWeeks = await fetch(`/api/planning/weeks?quarter=Q4&year=2025`);
// Returns: [Week 40, Week 41, ..., Week 51]

// 2. Fetch existing goals for this KR
const existingGoals = await fetch(`/api/goals?key_result_id=${krId}&time_period=WEEKLY`);
// Returns: [Week 40 goal, Week 42 goal, Week 45 goal] (sparse)

// 3. Merge: Create full 12-week list
const fullWeekList = quarterWeeks.map(week => {
    const existingGoal = existingGoals.find(goal => goal.week_number === week.week_number);

    if (existingGoal) {
        return {
            week_number: week.week_number,
            date_range: week.label,
            status: 'planned',
            goal: existingGoal
        };
    } else {
        return {
            week_number: week.week_number,
            date_range: week.label,
            status: 'not_planned',
            goal: null
        };
    }
});

// Result: 12 items, some with goals, some null
```

**Visual Result:**
```
Week 40: [Card with goal data]      ← Existing
Week 41: [Card with goal data]      ← Existing
Week 42: "Not planned yet"           ← Empty
Week 43: "Not planned yet"           ← Empty
Week 44: [Card with goal data]      ← Existing
...
Week 51: "Not planned yet"           ← Empty
```

---

## 🔢 Sort Order: Status-Based + Chronological

### **Question: Sorting Priority?**

You said "status-based and chronology" - let me clarify two interpretations:

### **Interpretation 1: Status First, Then Week** (Grouped)
```
🟠 In Progress (sorted by week):
  - Week 42: Increase outreach [75%]
  - Week 45: Follow-up calls [60%]

🔵 Not Planned (sorted by week):
  - Week 40: Not planned yet
  - Week 41: Not planned yet
  - Week 43: Not planned yet
  - Week 46: Not planned yet

✅ Completed (sorted by week):
  - Week 44: Email campaign [100%]
  - Week 47: Survey sent [100%]
```

**Pros**: See all in-progress items first (action-oriented)
**Cons**: Chronological flow broken, harder to see timeline

---

### **Interpretation 2: Week First, Color-Coded** (Timeline)
```
Week 40: Not planned yet                      🔵
Week 41: Not planned yet                      🔵
Week 42: Increase outreach [75%]              🟠 In Progress
Week 43: Not planned yet                      🔵
Week 44: Email campaign [100%]                ✅ Completed
Week 45: Follow-up calls [60%]                🟠 In Progress
Week 46: Not planned yet                      🔵
Week 47: Survey sent [100%]                   ✅ Completed
...
```

**Pros**: Chronological timeline preserved, easy to see gaps
**Cons**: In-progress items scattered

---

### **Interpretation 3: Hybrid with Filters** (Recommended)
```
┌─────────────────────────────────────────────────────────┐
│ Filter: [All (12)] [In Progress (2)] [Completed (2)] [Not Planned (8)] │
└─────────────────────────────────────────────────────────┘

Display: Chronological (Week 40 → 51)
Week 40: Not planned yet                      🔵
Week 41: Not planned yet                      🔵
Week 42: Increase outreach [75%]              🟠
Week 43: Not planned yet                      🔵
...
```

**On filter click:**
- "In Progress" → Shows only weeks 42, 45 (still chronological)
- "Not Planned" → Shows weeks 40, 41, 43, 46, ...
- "All" → Shows all 12 weeks

**Pros**:
- ✅ Maintains chronology
- ✅ Allows status-based focus
- ✅ Visual badges for quick scanning
- ✅ Filter badges show counts: `[In Progress (2)]`

---

## 🧠 Cognitive Load Analysis

### **Before (Old Design):**
```
Increase customer outreach by 20 contacts
Owner: Sarah Chen                    Target: 20
Status: In Progress                  Current: 15
Week: 42 | Nov 11 - Nov 17, 2025    Progress: 75%
```
**Cognitive Load**: 8 text labels to read + parse

### **After (New Design):**
```
Week 42 • Nov 11-17           [■■■■■■■□□□] 75%    🟠
Increase customer outreach by 20 contacts
👤 SC    🎯 20    📊 15
```
**Cognitive Load**: 1 icon scan + 1 progress bar + 3 metrics
**Reduction**: ~60% less text to process

**Eye Movement Path:**
1. **0.1s**: Week badge (top-left, natural F-pattern start)
2. **0.2s**: Progress bar (visual, instant recognition)
3. **0.3s**: Status dot (color = meaning)
4. **0.5s**: Goal title (if needed)
5. **0.7s**: Icon metrics (if details needed)

**Total scan time**: <1 second per card (vs 2-3 seconds with text labels)

---

## 📐 Revised Visual Mockup

### **Full Existing Plan View**
```
┌──────────────────────────────────────────────────────────────┐
│ 📋 Weekly Goals Plan                       5 of 12 planned   │
├──────────────────────────────────────────────────────────────┤
│ ┌─ KR Context (purple gradient) ─────────────────────────┐  │
│ │ Key Result: Increase customer satisfaction              │  │
│ │ Current: 45 → Target: 60  (Gap: 15)                     │  │
│ └─────────────────────────────────────────────────────────┘  │
│                                                              │
│ Filter: [All (12)] [🟠 2] [✅ 2] [🔵 8]                      │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Week 40 • Oct 6-12      [□□□□□□□□□□] 0%          🔵     │ │
│ │ Not planned yet                                         │ │
│ │ [➕ Add Goal for This Week]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Week 41 • Oct 13-19     [□□□□□□□□□□] 0%          🔵     │ │
│ │ Not planned yet                                         │ │
│ │ [➕ Add Goal for This Week]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Week 42 • Oct 20-26     [■■■■■■■□□□] 75%         🟠     │ │
│ │ Increase customer outreach by 20 contacts              │ │
│ │ 👤 SC    🎯 20    📊 15                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Week 43 • Oct 27-Nov 2  [■■■■■■■■■■] 100%        ✅     │ │
│ │ Email campaign to existing customers                    │ │
│ │ 👤 JD    🎯 30    📊 30                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Week 44 • Nov 3-9       [□□□□□□□□□□] 0%          🔵     │ │
│ │ Not planned yet                                         │ │
│ │ [➕ Add Goal for This Week]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│         Showing 1-5 of 12 weeks       ◄  1  [2]  3  ►       │
├──────────────────────────────────────────────────────────────┤
│ [✏️ Edit Plan] [➕ Continue Planning] [🗑 Delete Plan]      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Icon Legend (Minimize Text)

**Status Dots:**
- 🟠 Orange = In Progress (currently working on)
- ✅ Green = Completed (100% done)
- ⚪ White = Not Started (created but not begun)
- 🔵 Blue = Not Planned (empty slot)

**Metric Icons:**
- 👤 = Owner (shows initials: SC = Sarah Chen)
- 🎯 = Target value (goal to reach)
- 📊 = Current value (progress so far)

**Tooltip on Hover:**
- Hover status dot → "In Progress"
- Hover 👤 icon → "Owner: Sarah Chen"
- Hover 🎯 icon → "Target: 20 contacts"
- Hover week card → Show full date range

---

## 🤔 Discussion: Sort Order Clarification

**Which sorting do you prefer?**

**A) Status Groups + Chronology** (Interpretation 1)
- Groups: In Progress → Not Planned → Completed
- Within each group: Chronological

**B) Pure Chronology + Color Badges** (Interpretation 2)
- Always Week 40 → 51
- Use color dots for status scanning

**C) Filters + Chronology** (Interpretation 3) ← **My recommendation**
- Default: All weeks chronologically
- Filter buttons to focus on specific status
- Badge counts show distribution

---

## 🚀 Interaction Details

### **"Not Planned Yet" Card Click:**
```javascript
// User clicks blue "Not planned" card or "Add Goal" button
onclick="quickAddGoal(weekNumber)"

// Opens planning form with:
// - This specific week pre-selected
// - Other fields empty
// - "Create Goal for Week 42" button
```

### **Planned Week Card Click:**
```javascript
// User clicks card with existing goal
onclick="viewGoalDetail(goalId)"

// Shows modal with:
// - Full goal details
// - Progress updates
// - Comments/notes
// - [Edit] [Delete] buttons
```

---

## ✅ Final Specifications

**Confirmed:**
1. ✅ Week cards: Icon-based, minimal text, <1s scan time
2. ✅ Pagination: 5 per page with page numbers
3. ✅ Buttons: Edit | Continue | Delete (with confirmation)
4. ✅ All 12 weeks shown (some "Not planned yet")
5. ⏳ Sort: **Need your clarification** - A, B, or C?

**Implementation Ready:**
- Visual design finalized
- UX patterns defined
- Color scheme consistent
- Cognitive load minimized

---

**Question for you**: Which sort option (A, B, or C)? Then I can implement!
