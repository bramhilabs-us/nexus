# Date Cascade Logic: Parent-Child Hierarchy
**Sprint 4 Feature**: Accurate date boundaries across OKR hierarchy
**Critical**: Maintain referential integrity in goal timeline

---

## 🏗️ Goal Hierarchy (Top to Bottom)

```
Objective (12 months)
  ├─ time_period_type: 'calendar_year' | 'fiscal_year' | 'custom'
  ├─ start_date: Jan 1, 2025
  ├─ end_date: Dec 31, 2025
  └─ calculated_quarters: [Q1, Q2, Q3, Q4]

      ↓ CASCADE RULE 1: Quarterly Goal must fit within Objective dates

  Key Result 1
    └─ Quarterly Goal (3 months)
        ├─ time_period: 'QUARTERLY'
        ├─ start_date: Oct 1, 2025 (Q4 start)
        ├─ end_date: Dec 31, 2025 (Q4 end)
        └─ quarter: 4

            ↓ CASCADE RULE 2: Weekly Goal must fit within Quarterly Goal dates

        Weekly Goal 1 (Week 42)
          ├─ time_period: 'WEEKLY'
          ├─ start_date: Oct 13, 2025 (Monday)
          ├─ end_date: Oct 19, 2025 (Sunday)
          └─ week_number: 42

        Weekly Goal 2 (Week 43)
          ├─ start_date: Oct 20, 2025
          ├─ end_date: Oct 26, 2025
          └─ week_number: 43
```

---

## 🔒 Validation Rules

### **Rule 1: Quarterly Goal Date Validation**
```javascript
// Quarterly goal MUST be within objective's quarter boundaries
function validateQuarterlyGoal(quarterlyGoal, objective) {
  const quarter = objective.calculated_quarters.find(
    q => q.quarter === quarterlyGoal.quarter
  );

  if (!quarter) {
    return {
      valid: false,
      error: `Quarter ${quarterlyGoal.quarter} not found in objective`
    };
  }

  // Quarterly goal must fit within quarter dates
  if (quarterlyGoal.start_date < quarter.start_date) {
    return {
      valid: false,
      error: `Goal starts before Q${quarter.quarter} (${quarter.start_date})`
    };
  }

  if (quarterlyGoal.end_date > quarter.end_date) {
    return {
      valid: false,
      error: `Goal ends after Q${quarter.quarter} (${quarter.end_date})`
    };
  }

  return { valid: true };
}
```

### **Rule 2: Weekly Goal Date Validation**
```javascript
// Weekly goal MUST be within quarterly goal dates
function validateWeeklyGoal(weeklyGoal, quarterlyGoal) {
  if (weeklyGoal.start_date < quarterlyGoal.start_date) {
    return {
      valid: false,
      error: `Week starts before quarterly goal (${quarterlyGoal.start_date})`
    };
  }

  if (weeklyGoal.end_date > quarterlyGoal.end_date) {
    return {
      valid: false,
      error: `Week ends after quarterly goal (${quarterlyGoal.end_date})`
    };
  }

  // Weekly goals should be exactly 7 days (Mon-Sun)
  const weekDuration = (weeklyGoal.end_date - weeklyGoal.start_date) / (1000 * 60 * 60 * 24);
  if (weekDuration !== 6) {  // 6 days difference (Mon to Sun inclusive)
    return {
      valid: false,
      error: `Week must be exactly 7 days (Mon-Sun), got ${weekDuration + 1} days`
    };
  }

  // Week should start on Monday (day = 1)
  const startDay = weeklyGoal.start_date.getDay();
  if (startDay !== 1) {
    return {
      valid: false,
      error: `Week must start on Monday, starts on ${getDayName(startDay)}`
    };
  }

  return { valid: true };
}
```

---

## 📅 Date Calculation: Quarter → Weeks

### **Step 1: Get Quarter Boundaries**
```javascript
// For Q4 2025 (Calendar Year)
const quarter = {
  quarter: 4,
  start_date: new Date('2025-10-01'),  // Oct 1
  end_date: new Date('2025-12-31')     // Dec 31
};

// Calculate all weeks in this quarter
const weeks = calculateQuarterWeeks(quarter);
```

### **Step 2: Calculate Week Boundaries (ISO 8601)**
```javascript
function calculateQuarterWeeks(quarter) {
  const weeks = [];
  let currentMonday = getFirstMondayOfQuarter(quarter.start_date);

  while (currentMonday <= quarter.end_date) {
    const sunday = new Date(currentMonday);
    sunday.setDate(sunday.getDate() + 6);  // Add 6 days to get Sunday

    // Only include week if it STARTS within the quarter
    if (currentMonday <= quarter.end_date) {
      weeks.push({
        week_number: getISOWeekNumber(currentMonday),
        start_date: currentMonday,
        end_date: sunday,
        label: formatWeekLabel(currentMonday, sunday)  // "Oct 6-12"
      });
    }

    // Move to next Monday
    currentMonday = new Date(currentMonday);
    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  return weeks;
}

function getFirstMondayOfQuarter(quarterStart) {
  const date = new Date(quarterStart);
  const day = date.getDay();

  // If quarter starts on Monday (day = 1), use that date
  if (day === 1) {
    return date;
  }

  // Otherwise, find the next Monday
  const daysUntilMonday = (8 - day) % 7;
  date.setDate(date.getDate() + daysUntilMonday);
  return date;
}
```

### **Step 3: ISO Week Number Calculation**
```javascript
function getISOWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  // Set to nearest Thursday (ISO 8601 week definition)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));

  // Get first day of year
  const yearStart = new Date(d.getFullYear(), 0, 1);

  // Calculate week number
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

  return weekNo;
}
```

---

## 🔄 Example: Q4 2025 Calendar Year

### **Objective:**
```json
{
  "time_period_type": "calendar_year",
  "target_year": 2025,
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "calculated_quarters": [
    { "quarter": 1, "start_date": "2025-01-01", "end_date": "2025-03-31" },
    { "quarter": 2, "start_date": "2025-04-01", "end_date": "2025-06-30" },
    { "quarter": 3, "start_date": "2025-07-01", "end_date": "2025-09-30" },
    { "quarter": 4, "start_date": "2025-10-01", "end_date": "2025-12-31" }
  ]
}
```

### **Quarterly Goal (Q4):**
```json
{
  "time_period": "QUARTERLY",
  "quarter": 4,
  "start_date": "2025-10-01",  // Must match Q4 start
  "end_date": "2025-12-31"      // Must match Q4 end
}
```

### **Weekly Goals in Q4:**
```json
[
  {
    "week_number": 40,
    "start_date": "2025-10-06",  // Monday (first Monday in Q4)
    "end_date": "2025-10-12"     // Sunday
  },
  {
    "week_number": 41,
    "start_date": "2025-10-13",
    "end_date": "2025-10-19"
  },
  // ... weeks 42-50
  {
    "week_number": 51,
    "start_date": "2025-12-22",
    "end_date": "2025-12-28"     // Last Monday-Sunday in Q4
  }
  // Week 52 (Dec 29-31) is only 3 days, so not included
]
```

**Total Weeks in Q4 2025**: 12 weeks (Weeks 40-51)

---

## 🧪 Edge Cases

### **Case 1: Fiscal Year (April Start)**
```json
{
  "time_period_type": "fiscal_year",
  "fiscal_year_start_month": 4,  // April
  "target_year": 2025,
  "start_date": "2025-04-01",  // FY2025 starts April 1
  "end_date": "2026-03-31",    // FY2025 ends March 31, 2026
  "calculated_quarters": [
    { "quarter": 1, "start_date": "2025-04-01", "end_date": "2025-06-30" },
    { "quarter": 2, "start_date": "2025-07-01", "end_date": "2025-09-30" },
    { "quarter": 3, "start_date": "2025-10-01", "end_date": "2025-12-31" },
    { "quarter": 4, "start_date": "2026-01-01", "end_date": "2026-03-31" }
  ]
}
```

**Q4 Fiscal = Jan-Mar 2026** (calendar year Q1)

### **Case 2: Custom Period (18 months)**
```json
{
  "time_period_type": "custom",
  "duration_months": 18,
  "custom_period_start": "2025-03-15",
  "custom_period_end": "2026-09-14",  // 18 months later
  "calculated_quarters": [
    { "quarter": 1, "start_date": "2025-03-15", "end_date": "2025-07-14" },
    { "quarter": 2, "start_date": "2025-07-15", "end_date": "2025-11-14" },
    { "quarter": 3, "start_date": "2025-11-15", "end_date": "2026-03-14" },
    { "quarter": 4, "start_date": "2026-03-15", "end_date": "2026-07-14" },
    { "quarter": 5, "start_date": "2026-07-15", "end_date": "2026-09-14" }
  ]
}
```

**Note**: Custom periods can have 5-6 quarters (not always 4)

---

## 🚨 Common Errors to Prevent

### **Error 1: Week Starts Before Quarter**
```
❌ INVALID:
Quarter 4: Oct 1 - Dec 31
Week 40: Sep 30 - Oct 6  ← Starts before Q4

✅ VALID:
Quarter 4: Oct 1 - Dec 31
Week 40: Oct 6 - Oct 12  ← First Monday in Q4
```

### **Error 2: Week Extends Beyond Quarter**
```
❌ INVALID:
Quarter 4: Oct 1 - Dec 31
Week 52: Dec 29 - Jan 4  ← Extends into Q1 next year

✅ VALID:
Quarter 4: Oct 1 - Dec 31
Week 51: Dec 22 - Dec 28 ← Last complete week in Q4
```

### **Error 3: Non-Monday Start**
```
❌ INVALID:
Week 42: Oct 15 (Wednesday) - Oct 21

✅ VALID:
Week 42: Oct 13 (Monday) - Oct 19 (Sunday)
```

### **Error 4: Quarterly Goal Spans Multiple Quarters**
```
❌ INVALID:
Goal: Oct 15 - Jan 15  ← Spans Q4 + Q1

✅ VALID:
Goal 1 (Q4): Oct 1 - Dec 31
Goal 2 (Q1): Jan 1 - Mar 31
```

---

## 🔍 Planning Page: Date Validation Flow

```
User clicks "View Plan" for Key Result
  ↓
1. Fetch Objective (to get quarter boundaries)
  const objective = await fetch(`/api/objectives/${objectiveId}`);

2. Get quarter for this KR
  const quarter = objective.calculated_quarters.find(q => q.quarter === kR.quarter);

3. Calculate all weeks in quarter
  const allWeeks = calculateQuarterWeeks(quarter);
  // Returns: [Week 40, Week 41, ..., Week 51]

4. Fetch existing weekly goals for this KR
  const existingGoals = await fetch(
    `/api/goals?key_result_id=${krId}&time_period=WEEKLY`
  );

5. Merge: Full list with "not planned" slots
  const fullWeekList = allWeeks.map(week => {
    const goal = existingGoals.find(g => g.week_number === week.week_number);
    return goal || { ...week, status: 'not_planned' };
  });

6. Validate each existing goal (error check)
  fullWeekList.forEach(item => {
    if (item.status !== 'not_planned') {
      const validation = validateWeeklyGoal(item, quarter);
      if (!validation.valid) {
        console.error(`Week ${item.week_number}: ${validation.error}`);
      }
    }
  });

7. Display all 12 weeks (with filters)
  renderExistingPlanView(fullWeekList);
```

---

## ✅ Implementation Checklist

**Backend (Already Done - Sprint 3):**
- [x] DateService.js - Quarter calculation
- [x] ValidationService.js - Date validation
- [x] Objective model - `calculated_quarters` field
- [x] Goal model - `week_number` field

**Frontend (To Implement):**
- [ ] Fetch quarter boundaries from objective
- [ ] Calculate all weeks in quarter (Mon-Sun ISO 8601)
- [ ] Merge existing goals with week slots
- [ ] Validate dates client-side (error display)
- [ ] Sort: Chronological (Week 40 → 51)
- [ ] Filters: All, In Progress, Completed, Not Planned
- [ ] Show week cards with accurate dates

**Date Accuracy Guarantees:**
- ✅ Weeks always start Monday, end Sunday
- ✅ Weeks always within quarter boundaries
- ✅ ISO 8601 week numbering
- ✅ Fiscal year support
- ✅ Custom period support
- ✅ Parent-child referential integrity

---

## 🎯 Sprint 4 Feature: Enhanced Date Management

**Epic Name**: Planning with Date Integrity
**Story Points**: 8
**Priority**: High (foundational)

**User Story**:
> As a manager planning weekly goals, I want to see accurate week boundaries that match my objective's time period, so I don't create goals outside valid date ranges.

**Acceptance Criteria**:
1. All weeks display correct Mon-Sun dates
2. Weeks fit within quarter boundaries
3. Fiscal year quarters calculated correctly
4. Custom period quarters distributed evenly
5. No week can extend beyond its quarter
6. Week numbers use ISO 8601 standard
7. Visual error if date mismatch detected

**Technical Debt Addressed**:
- Prevents orphaned weekly goals
- Ensures data integrity
- Supports all 3 time period types
- Handles year boundaries correctly

---

**Ready to implement!** This will be part of Sprint 4's core features.
