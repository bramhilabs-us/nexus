# SPRINT 9 - USER STORIES

## VERSION CONTROL

**Document**: SPRINT-9-USER-STORIES.md
**Version**: 1.0.0
**Created**: 2025-12-02
**Sprint**: 9
**Total Story Points**: 26

---

## EXECUTIVE SUMMARY

**Sprint 9 Focus**: Consultant Dashboard & Weekly Goals Calendar

**Epic Breakdown**:
| Epic | Points | Priority | Stories |
|------|--------|----------|---------|
| Epic E: Consultant Dashboard | 13 | P1 | 5 stories |
| Epic F: Weekly Goals Calendar | 13 | P1 | 5 stories |
| **Total** | **26** | | **10 stories** |

**Origin**: These epics were deferred from Sprint 7 for scope management.

---

## EPIC E: CONSULTANT DASHBOARD (13 pts)

### Goal
Provide consultants with a multi-company view to manage all their client companies from a single dashboard.

---

### US-S9-E1: Consultant Company Switcher (3 pts)

**As a** consultant
**I want** to switch between my client companies easily
**So that** I can manage multiple clients without logging out

**Priority**: P0 (Core functionality)

**Acceptance Criteria**:
- [ ] Company dropdown in header (visible only to CONSULTANT role)
- [ ] Shows all companies where user is consultant
- [ ] Current company highlighted
- [ ] Click to switch → context changes
- [ ] All page data refreshes to new company
- [ ] Company logo/name displayed in header
- [ ] "All Companies" option to go to overview dashboard
- [ ] Persists selection in session storage

**API**:
- GET `/api/consultant/companies` - List consultant's companies

**Backend Logic**:
```javascript
// In server/routes/consultant.js
router.get('/companies', authenticateToken, requireRole('CONSULTANT'), async (req, res) => {
  const companies = await Company.find({ consultant_id: req.user._id })
    .select('name logo industry');
  res.json({ companies });
});
```

**Files**:
- `client/js/navigation.js` - Company switcher component
- `server/routes/consultant.js` - NEW
- `server/middleware/auth.js` - Consultant context switching

---

### US-S9-E2: Multi-Company Overview Dashboard (5 pts)

**As a** consultant
**I want** to see an overview of all my client companies
**So that** I can quickly identify which clients need attention

**Priority**: P0 (Core functionality)

**Acceptance Criteria**:
- [ ] Grid of company cards (responsive: 3 per row desktop, 1 mobile)
- [ ] Each card shows:
  - Company name and logo
  - Industry badge
  - SSI completion percentage (circular progress)
  - Active objectives count
  - Overall objective progress
  - Last activity date
- [ ] Cards sorted by last activity (most recent first)
- [ ] Click card → switch to that company
- [ ] Empty state: "No companies assigned to you"
- [ ] Loading skeleton while fetching

**Company Card Design**:
```
┌─────────────────────────────────────────┐
│  [Logo]  TechStart Inc.                 │
│          Software Industry              │
│                                         │
│  SSI: ●●●●●○○○○○ 54%                   │
│                                         │
│  📊 4 Objectives  │  Progress: 45%      │
│                                         │
│  Last Activity: 2 hours ago             │
│                                         │
│  [View Details]  [Quick Actions ▼]      │
└─────────────────────────────────────────┘
```

**API**:
- GET `/api/consultant/overview` - Aggregated stats

**Files**:
- `client/pages/consultant-dashboard.html` - NEW
- `client/pages/scripts/consultant-dashboard.js` - NEW
- `client/css/consultant-dashboard.css` - NEW

---

### US-S9-E3: Company Health Indicators (2 pts)

**As a** consultant
**I want** to see health indicators for each company
**So that** I can prioritize clients that need help

**Priority**: P1 (Enhancement)

**Acceptance Criteria**:
- [ ] Health badge on each company card (🟢 🟡 🔴)
- [ ] Health calculated from:
  - SSI completion (< 50% = risk)
  - Objective progress vs time elapsed
  - Overdue tasks percentage
  - Days since last activity
- [ ] Tooltip explains health score breakdown
- [ ] Filter by health status (All / At Risk / On Track)
- [ ] At-risk companies highlighted with border

**Health Calculation**:
```javascript
function calculateHealth(company) {
  const scores = {
    ssi: company.ssiCompletion >= 80 ? 1 : (company.ssiCompletion >= 50 ? 0.5 : 0),
    progress: company.progressVsTime >= 0.8 ? 1 : (company.progressVsTime >= 0.5 ? 0.5 : 0),
    overdue: company.overduePercent <= 10 ? 1 : (company.overduePercent <= 30 ? 0.5 : 0),
    activity: company.daysSinceActivity <= 7 ? 1 : (company.daysSinceActivity <= 14 ? 0.5 : 0)
  };
  const avg = (scores.ssi + scores.progress + scores.overdue + scores.activity) / 4;
  return avg >= 0.7 ? 'healthy' : (avg >= 0.4 ? 'warning' : 'critical');
}
```

**API**:
- GET `/api/companies/:id/health` - Health metrics for a company

**Files**:
- `client/pages/scripts/consultant-dashboard.js` - Health display
- `server/routes/companies.js` - Health endpoint

---

### US-S9-E4: Quick Actions per Company (2 pts)

**As a** consultant
**I want** quick action buttons for each company
**So that** I can perform common tasks without navigation

**Priority**: P1 (Enhancement)

**Acceptance Criteria**:
- [ ] Quick Actions dropdown on each card
- [ ] Actions:
  - "View SSI Results" → Navigate to Team SSI View
  - "View Objectives" → Navigate to Objectives page
  - "Generate OKRs" → Open OKR generation modal
  - "View Team" → Navigate to Team page
- [ ] Actions switch company context automatically
- [ ] Disabled state for unavailable actions (e.g., Generate OKRs when already generated)

**Files**:
- `client/pages/scripts/consultant-dashboard.js` - Quick action handlers

---

### US-S9-E5: Company Comparison View (1 pt)

**As a** consultant
**I want** to compare companies side-by-side
**So that** I can identify best practices and gaps

**Priority**: P2 (Nice to have)

**Acceptance Criteria**:
- [ ] "Compare" button on dashboard
- [ ] Select 2-4 companies to compare
- [ ] Side-by-side metrics:
  - SSI scores by dimension
  - Objective completion rates
  - Task velocity (tasks/week)
- [ ] Highlight best/worst in each metric
- [ ] Export comparison as PDF (future)

**Files**:
- `client/pages/scripts/consultant-dashboard.js` - Comparison modal
- `client/css/consultant-dashboard.css` - Comparison styling

---

## EPIC F: WEEKLY GOALS CALENDAR (13 pts)

### Goal
Calendar view for weekly goals showing goal timeline, task distribution, and progress over weeks.

---

### US-S9-F1: Weekly Goals Calendar View (5 pts)

**As a** manager
**I want** to see weekly goals in a calendar view
**So that** I can visualize the timeline and workload

**Priority**: P0 (Core functionality)

**Acceptance Criteria**:
- [ ] Calendar grid with weeks as columns
- [ ] Current month displayed as header
- [ ] Week headers show date range (e.g., "Dec 1-7")
- [ ] Goals displayed as horizontal bars
- [ ] Bar spans from goal start_date to end_date
- [ ] Bar color indicates status:
  - Blue: In Progress
  - Green: Completed
  - Red: Overdue
  - Gray: Not Started
- [ ] Bar fill indicates progress percentage
- [ ] Today indicator (vertical line)
- [ ] Responsive: horizontal scroll on mobile

**Calendar Layout**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│  << Nov 2025                    December 2025                    >>     │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────┤
│  Week 1  │  Week 2  │  Week 3  │  Week 4  │  Week 5  │  Week 6  │      │
│  Dec 1-7 │ Dec 8-14 │Dec 15-21 │Dec 22-28 │ Dec 29-  │          │      │
├──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────┤
│ ████████████████░░░░  Revenue Analysis (75%)                           │
│      ████████████████████████  Customer Outreach (100%)                │
│                  ░░░░░░░░░░░░  Team Training (0%)                      │
├────────────────────────────────────────────────────────────────────────┤
│ [Today ↓]                                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

**API**:
- GET `/api/goals/weekly/calendar?start=DATE&end=DATE&kr_id=ID`

**Files**:
- `client/pages/weekly-calendar.html` - NEW
- `client/pages/scripts/weekly-calendar.js` - NEW
- `client/css/weekly-calendar.css` - NEW
- `server/routes/goals.js` - Calendar endpoint

---

### US-S9-F2: Goal Duration Bars (3 pts)

**As a** manager
**I want** to see goal duration as visual bars
**So that** I can understand goal length and overlaps

**Priority**: P0 (Core functionality)

**Acceptance Criteria**:
- [ ] Bar width = goal duration in weeks
- [ ] Bar positioned at correct start week
- [ ] Progress fill (e.g., 75% progress = 75% of bar filled)
- [ ] Overlapping goals stacked vertically
- [ ] Goal title displayed inside bar (truncated if needed)
- [ ] Hover shows full title and progress
- [ ] Maximum 5 visible rows, "+" for more

**Bar Rendering Logic**:
```javascript
function renderGoalBar(goal, weeks) {
  const startWeekIndex = getWeekIndex(goal.start_date, weeks);
  const endWeekIndex = getWeekIndex(goal.end_date, weeks);
  const spanWeeks = endWeekIndex - startWeekIndex + 1;
  const progressWidth = (goal.progress / 100) * spanWeeks;

  return {
    left: `${startWeekIndex * weekWidth}px`,
    width: `${spanWeeks * weekWidth}px`,
    progressWidth: `${progressWidth * weekWidth}px`
  };
}
```

**Files**:
- `client/pages/scripts/weekly-calendar.js` - Bar rendering
- `client/css/weekly-calendar.css` - Bar styling

---

### US-S9-F3: Week Navigation (2 pts)

**As a** manager
**I want** to navigate between weeks/months
**So that** I can see past and future goals

**Priority**: P1 (Navigation)

**Acceptance Criteria**:
- [ ] Previous/Next month arrows
- [ ] Click arrows to navigate
- [ ] Current month highlighted
- [ ] "Today" button to jump to current week
- [ ] URL updates with date range for bookmarking
- [ ] Keyboard navigation (← →)
- [ ] Default view: current month + 1 week buffer

**Files**:
- `client/pages/scripts/weekly-calendar.js` - Navigation handlers

---

### US-S9-F4: Goal Quick View Popover (2 pts)

**As a** manager
**I want** to see goal details on hover/click
**So that** I can get more information without leaving the calendar

**Priority**: P1 (Enhancement)

**Acceptance Criteria**:
- [ ] Click goal bar → popover appears
- [ ] Popover shows:
  - Goal title (full)
  - Date range
  - Progress percentage
  - Task count (completed/total)
  - Assigned to (if any)
  - Parent KR and Objective
- [ ] "View Tasks" button → navigate to tasks
- [ ] "Edit" button (managers only) → edit goal
- [ ] Click outside to close

**Popover Design**:
```
┌────────────────────────────────────┐
│ Revenue Analysis - Week 3          │
├────────────────────────────────────┤
│ Dec 15 - Dec 21, 2025              │
│ Progress: ████████░░ 75%           │
│ Tasks: 6/8 completed               │
│ Assigned to: John Smith            │
├────────────────────────────────────┤
│ KR: Increase revenue by 20%        │
│ Objective: Financial Growth 2025   │
├────────────────────────────────────┤
│ [View Tasks]        [Edit Goal]    │
└────────────────────────────────────┘
```

**Files**:
- `client/pages/scripts/weekly-calendar.js` - Popover logic
- `client/css/weekly-calendar.css` - Popover styling

---

### US-S9-F5: Calendar Export (1 pt)

**As a** manager
**I want** to export the calendar to external tools
**So that** I can integrate with my personal calendar

**Priority**: P2 (Nice to have)

**Acceptance Criteria**:
- [ ] "Export" button on calendar
- [ ] Export formats:
  - iCal (.ics) - for Google Calendar, Outlook
  - CSV - for spreadsheets
- [ ] Export includes:
  - Goal title as event title
  - Date range
  - Description with KR and Objective
- [ ] Success toast: "Calendar exported"
- [ ] Download starts automatically

**iCal Format**:
```
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Revenue Analysis - Week 3
DTSTART:20251215
DTEND:20251221
DESCRIPTION:KR: Increase revenue by 20%\nObjective: Financial Growth 2025
END:VEVENT
END:VCALENDAR
```

**Files**:
- `client/pages/scripts/weekly-calendar.js` - Export handlers
- `server/routes/goals.js` - iCal generation endpoint

---

## SPRINT 9 STORY SUMMARY

### By Priority

| Priority | Stories | Points |
|----------|---------|--------|
| P0 (Critical) | 4 | 16 |
| P1 (High) | 4 | 8 |
| P2 (Medium) | 2 | 2 |
| **Total** | **10** | **26** |

### Implementation Order

```
Week 1 (Days 1-4): Epic E - Consultant Dashboard
├── Day 1:
│   └── US-S9-E1: Company Switcher (3 pts)
├── Day 2-3:
│   └── US-S9-E2: Multi-Company Overview (5 pts)
└── Day 4:
    ├── US-S9-E3: Health Indicators (2 pts)
    ├── US-S9-E4: Quick Actions (2 pts)
    └── US-S9-E5: Comparison View (1 pt)

Week 2 (Days 5-8): Epic F - Weekly Calendar
├── Day 5-6:
│   ├── US-S9-F1: Calendar View (5 pts)
│   └── US-S9-F2: Goal Duration Bars (3 pts)
└── Day 7-8:
    ├── US-S9-F3: Week Navigation (2 pts)
    ├── US-S9-F4: Goal Popover (2 pts)
    └── US-S9-F5: Calendar Export (1 pt)
```

---

## SUCCESS CRITERIA

### Epic E: Consultant Dashboard
- [ ] Company switcher works for consultants
- [ ] Overview dashboard shows all client companies
- [ ] Health indicators accurately reflect company status
- [ ] Quick actions navigate correctly
- [ ] Context switches properly when changing companies

### Epic F: Weekly Goals Calendar
- [ ] Calendar displays weeks correctly
- [ ] Goal bars span correct date ranges
- [ ] Progress indicated by bar fill
- [ ] Navigation works forward/backward
- [ ] Popover shows goal details
- [ ] Export generates valid iCal file

---

## DEPENDENCIES

- Sprint 7: Company Profile page (API foundation)
- Sprint 7: DateService enhancements
- Sprint 8: Dashboard patterns established
- Sprint 8: Task management working

---

## TECHNICAL NOTES

### Role Access

| Feature | CONSULTANT | EXECUTIVE | MANAGER | EMPLOYEE |
|---------|------------|-----------|---------|----------|
| Consultant Dashboard | ✅ | ❌ | ❌ | ❌ |
| Company Switcher | ✅ | ❌ | ❌ | ❌ |
| Weekly Calendar | ✅ | ✅ | ✅ | 🔒 Read-only |

### Multi-Tenant Considerations

```javascript
// Consultant sees multiple companies
if (req.user.role === 'CONSULTANT') {
  const companies = await Company.find({ consultant_id: req.user._id });
  // All company data accessible with proper context switching
}

// Non-consultants see only their company
else {
  const company = await Company.findById(req.user.company_id);
  // Single company context
}
```

---

**Document Created**: 2025-12-02
**Version**: 1.0.0
**Sprint**: 9
**Status**: Ready for Implementation (after Sprints 7 & 8)
