# Epic H: Planning Page Updates

<!-- @GENOME T3-SPR-023-EH | ACTIVE | 2026-04-30 | parent:T3-SPR-023-MP | auto:/coding | linked:/design -->

**Sprint**: 23 (carried from Sprint 22 by #183-close decision)
**Epic**: H - Planning Page Updates
**Points**: 5 (now billed standalone — Epic G's combined-UI-budget arrangement was a Sprint 22 artifact and is unwound for Sprint 23)
**Priority**: P1
**Dependencies**: ✅ S22 #176 Epic A (WeeklyGoal model), ⏳ S23 Epic E (objectives with KRs — sequenced before H in S23). AI presets need ✅ S22 #178 Epic F (`generateWeeklyGoals` already shipped) — wire live, no "Coming soon" toast needed (D-H-3 supersedes).

---

## Budget Note (D-H-6 corrected)

**Epic H's 5 pts roll up into Epic G's combined 10pt UI budget** for cleaner reporting. Work, mockup, and acceptance criteria are tracked separately for execution and PR scope clarity. Sprint 22 master plan total is **87 pts** (Epic 0: 13 + A: 5 + B: 10 + C: 21 + D: 8 + E: 10 + F: 10 + G+H: 10).

---

## Overview

Enhance the Planning page to display full quarters (12-13 weeks) with monthly grouping and collapsible sections.

**Mockup**: [planning.html](../../sprint_mockups/sprint-22/planning.html)

**Implementation file**: `client/pages/planning-v2.html` (update in place — preserves URL and existing `planning-v2.js` script binding).

**Navigation lock**: Production `<nav>` block and `<script src="/js/navigation.js">` already in planning-v2.html. Do not alter.

---

## Changes Summary

| Current | New |
|---------|-----|
| 4 weeks shown | 12-13 weeks (full quarter) |
| Flat week list | Monthly grouping (collapsible) |
| No AI generation | AI preset options (4/8/12 weeks) |

---

## Monthly Grouping

### Structure

```
Quarter Tabs: [Q1] [Q2] [Q3] [Q4]
                    ↓
┌─────────────────────────────────────────────────────────────────┐
│  April 2026                                          [−]       │
├─────────────────────────────────────────────────────────────────┤
│  Week 1 (Apr 1-7)     │ Goals: 3  │ Progress: 2/3            │
│  Week 2 (Apr 8-14)    │ Goals: 4  │ Progress: 1/4            │
│  Week 3 (Apr 15-21)   │ Goals: 2  │ Progress: 2/2  ✓         │
│  Week 4 (Apr 22-28)   │ Goals: 3  │ Progress: 0/3            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  May 2026                                            [+]       │
├─────────────────────────────────────────────────────────────────┤
│  (collapsed)                                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  June 2026                                           [+]       │
├─────────────────────────────────────────────────────────────────┤
│  (collapsed)                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### HTML Structure

```html
<div class="planning-container">
  <!-- Quarter Tabs -->
  <div class="quarter-tabs">
    <button class="quarter-tab" data-quarter="Q1">Q1</button>
    <button class="quarter-tab active" data-quarter="Q2">Q2</button>
    <button class="quarter-tab" data-quarter="Q3">Q3</button>
    <button class="quarter-tab" data-quarter="Q4">Q4</button>
  </div>

  <!-- Month Groups -->
  <div class="month-groups">
    <!-- April -->
    <div class="month-group expanded" data-month="2026-04">
      <div class="month-header" onclick="toggleMonth(this)">
        <span class="month-name">April 2026</span>
        <span class="month-summary">4 weeks | 12 goals | 8 complete</span>
        <button class="month-toggle">
          <svg class="icon-minus"><!-- Minus icon --></svg>
          <svg class="icon-plus hidden"><!-- Plus icon --></svg>
        </button>
      </div>

      <div class="month-content">
        <div class="week-list">
          <!-- Week rows -->
          <div class="week-row" data-week="1">
            <div class="week-info">
              <span class="week-label">Week 1</span>
              <span class="week-dates">Apr 1-7</span>
            </div>
            <div class="week-stats">
              <span class="goal-count">3 goals</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 66%"></div>
              </div>
              <span class="progress-text">2/3</span>
            </div>
            <button class="week-expand" onclick="selectWeek(1)">
              <svg><!-- Chevron right --></svg>
            </button>
          </div>
          <!-- More week rows -->
        </div>
      </div>
    </div>

    <!-- May (collapsed) -->
    <div class="month-group collapsed" data-month="2026-05">
      <div class="month-header" onclick="toggleMonth(this)">
        <span class="month-name">May 2026</span>
        <span class="month-summary">4 weeks | 8 goals | 0 complete</span>
        <button class="month-toggle">
          <svg class="icon-plus"><!-- Plus icon --></svg>
        </button>
      </div>
      <div class="month-content" style="display: none;">
        <!-- Week rows -->
      </div>
    </div>

    <!-- June (collapsed) -->
    <div class="month-group collapsed" data-month="2026-06">
      <!-- ... -->
    </div>
  </div>
</div>
```

---

## Week Calculation

### Decisions

- **Week boundaries (D-H-5)**: ISO 8601 — Monday start, Sunday end.
- **Week→month assignment (D-H-1)**: a week belongs to the month containing its **Monday (start)**. Example: week starting Mar 30 → March group, even if it spans into April.
- **Goal count source (D-H-2)**: WeeklyGoal collection only (legacy Goal.js with `time_period: 'WEEKLY'` is NOT surfaced on the new Planning page — consistent with D-A-2 coexistence rule).
- **Auto-expand (D-H-4)**: client local timezone via `new Date()`.

### Full Quarter Logic

```javascript
// SERVICE_EXTENSIONS.md: verify these exist on DateService; add if absent.
const { getQuarterStartDate, getQuarterEndDate, getWeekStart, addDays } = require('../services/DateService');

function getQuarterWeeks(year, quarter) {
  const quarterStart = getQuarterStartDate(year, quarter);
  const quarterEnd   = getQuarterEndDate(year, quarter);

  const weeks = [];
  let currentWeekStart = getWeekStart(quarterStart); // ISO Monday (D-H-5)
  let weekNumber = 1;

  while (currentWeekStart < quarterEnd) {
    const weekEnd = addDays(currentWeekStart, 6); // Sun
    weeks.push({
      number: weekNumber,
      start:  currentWeekStart,
      end:    weekEnd,
      // D-H-1: assignment by week-start Monday's month
      month:  currentWeekStart.toLocaleString('default', { month: 'long', year: 'numeric' })
    });
    currentWeekStart = addDays(currentWeekStart, 7);
    weekNumber++;
  }
  return weeks; // 12-13 weeks
}

function groupWeeksByMonth(weeks) {
  const grouped = {};
  for (const week of weeks) {
    (grouped[week.month] ||= []).push(week);
  }
  return grouped;
}
```

---

## AI Generation Presets

### UI Component

```html
<div class="ai-generation-panel">
  <h3>Generate Weekly Goals</h3>
  <p class="hint">AI will generate weekly goals from your quarterly goals</p>

  <div class="preset-buttons">
    <button class="preset-btn" data-weeks="4">
      Next 4 Weeks
    </button>
    <button class="preset-btn" data-weeks="8">
      Next 8 Weeks
    </button>
    <button class="preset-btn" data-weeks="12">
      Full Quarter
    </button>
  </div>

  <div class="generation-options">
    <label>
      <input type="checkbox" id="include-moves" checked>
      Also generate Moves for each week
    </label>
  </div>

  <button class="btn-generate btn-navy">
    <svg><!-- Sparkle icon --></svg>
    Generate with AI
  </button>
</div>
```

### Generation Logic (D-H-3 — UI-only in S22; live wiring if Epic F ready)

```javascript
async function generateWeeklyGoals(weeksToGenerate) {
  if (!FEATURE_AI_WEEKLY_GOALS_ENABLED) {
    showToast('Coming soon');
    return;
  }
  const keyResults = await getCurrentQuarterKeyResults(); // from KeyResult collection (Epic A)

  const response = await fetch('/api/weekly-goals/generate', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key_result_ids: keyResults.map(k => k._id),
      weeks: weeksToGenerate,
      include_moves: document.getElementById('include-moves').checked
    })
  });
  const { data } = await response.json();
  renderGeneratedGoals(data.weekly_goals);
}
```

---

## CSS Updates

```css
/* Month Group */
.month-group {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #F9FAFB;
  cursor: pointer;
  transition: background 0.15s;
}

.month-header:hover {
  background: #F3F4F6;
}

.month-name {
  font-weight: 600;
  color: #1e3a5f;
}

.month-summary {
  font-size: 13px;
  color: #6B7280;
}

.month-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.month-content {
  border-top: 1px solid #E5E7EB;
}

/* Week Row */
.week-row {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #F3F4F6;
  transition: background 0.15s;
}

.week-row:hover {
  background: #FAFAFA;
}

.week-row:last-child {
  border-bottom: none;
}

.week-info {
  flex: 1;
}

.week-label {
  font-weight: 500;
  color: #374151;
}

.week-dates {
  font-size: 12px;
  color: #9CA3AF;
  margin-left: 8px;
}

.week-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 80px;
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10B981;
  border-radius: 3px;
  transition: width 0.3s;
}

/* Collapsed state */
.month-group.collapsed .month-content {
  display: none;
}

.month-group.collapsed .icon-minus {
  display: none;
}

.month-group.expanded .icon-plus {
  display: none;
}
```

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `client/pages/planning-v2.html` | MODIFY | Monthly grouping layout |
| `client/pages/scripts/planning-v2.js` | MODIFY | Week calculation, toggle logic |
| `client/css/planning.css` | MODIFY | Month group styles |

---

## JavaScript Functions

```javascript
// Toggle month expansion
function toggleMonth(headerElement) {
  const monthGroup = headerElement.closest('.month-group');
  monthGroup.classList.toggle('expanded');
  monthGroup.classList.toggle('collapsed');
}

// Select week (load into detail panel)
function selectWeek(weekNumber) {
  // Load week details into right panel
  loadWeekGoals(weekNumber);
}

// Auto-expand current month
function expandCurrentMonth() {
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthGroup = document.querySelector(
    `.month-group[data-month="${currentMonthKey}"]`
  );

  if (currentMonthGroup) {
    currentMonthGroup.classList.remove('collapsed');
    currentMonthGroup.classList.add('expanded');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  expandCurrentMonth();
});
```

---

## Acceptance Criteria

- [ ] Full quarter shown (12-13 weeks)
- [ ] Weeks grouped by month using week-start Monday rule (D-H-1)
- [ ] Week boundaries Mon–Sun (D-H-5)
- [ ] Goal count sourced from WeeklyGoal collection only (D-H-2)
- [ ] Month headers collapsible; current month auto-expanded by client local timezone (D-H-4)
- [ ] Week progress bars accurate
- [ ] AI generation presets visible; live if Epic F ready, otherwise toast "Coming soon" (D-H-3)
- [ ] Clicking week loads detail panel
- [ ] Quarter tabs filter correctly
- [ ] Partial weeks at quarter boundaries handled (week 1 starting Mon may pre-date Apr 1)
- [ ] Mobile responsive

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| Week calculation (12-13) | 1 |
| Monthly grouping HTML | 1 |
| Collapse/expand logic | 1 |
| CSS styling | 1 |
| Testing | 1 |
| **Total** | **5** |

---

**Created**: April 21, 2026 (Session #171)
**Status**: Ready for implementation
