# Sprint 12 Master Plan V2

**Sprint**: 12 - Dashboard + Planning Redesign
**Created**: January 27, 2026
**Total Points**: 53 pts
**Status**: PLANNING
**Pages Introduced**: Dashboard, Planning
**Design Reference**: `sprint_mockups/sprint-13/dashboard-redesign.html`, `sprint_mockups/sprint-13/planning-redesign.html`
**Prerequisite**: Sprint 11 complete (s13-patterns.css created, standard page template established)

---

## Reorganization (V2)

| Change | Reason | Impact |
|--------|--------|--------|
| Moved Epic L (25pts) FROM Sprint 11 | Page-pairing: Planning redesign ships with Dashboard | +25 pts |
| Moved Epics N, O, V to Sprint 13 | Page-pairing: Objectives + SSI Report together | -46 pts |
| Added Epic U1 (6pts) | Dashboard page redesign | +6 pts |
| Added Epic M-Ph1 (13pts) | OKR Wizard Phase 1 (supports Planning page) | +13 pts |
| Added Epic P (9pts) | Observer/tracking (supports Dashboard tasks) | +9 pts |
| Net change | From 72pts to 53pts | Balanced |

---

## Executive Summary

Sprint 12 delivers the **daily workflow experience** — Dashboard (where users start their day) and Planning (where they manage weekly goals). These are the two most frequently used pages. Every task card, progress bar, objective summary, weekly goal, and KPI must render from live API data.

### Core Principle: ZERO HARDCODING (inherited from Sprint 11)

All Sprint 11 infrastructure carries forward:
- `s13-patterns.css` — shared design tokens
- Standard page template — nav to content to scripts
- `auth:ready` event pattern — page initialization
- Existing shared modules — `common.js`, `navigation.js`, `toast.js`, etc.

---

## Architecture: Reuse from Sprint 11

### Modules Already Available (from Sprint 11)

| Module | Status | Used By This Sprint |
|--------|--------|-------------------|
| `s13-patterns.css` | Created in S11 | Dashboard, Planning |
| `KarviaCommon` | Existing | All pages |
| `NavigationManager` | Existing | All pages |
| `Toast` | Existing | All pages |
| `ObjectivesAPI` | Existing | Dashboard (objective cards), Planning (objective selector) |
| `GoalsAPIClient` | Existing | Planning (weekly/quarterly goals) |
| `CategoryIcons` | Existing | Dashboard (objective categories), Planning (KR categories) |

### New Modules Needed

| Module | File | Purpose |
|--------|------|---------|
| `DashboardAPI` | Extend `client/js/goals-api-client.js` | Convenience methods wrapping existing `/api/tasks/*` and `/api/dashboard/*` endpoints |
| `PlanningController` | `client/pages/scripts/planning-redesign.js` | Two-panel layout, week management |

### DO NOT Create

- No new API client files for objectives — `ObjectivesAPI` exists
- No new API client files for goals — `GoalsAPIClient` exists
- No new toast/notification system — `Toast` exists
- No new date formatting — `formatDate()` in `common.js`
- No new avatar utilities — `getInitials()` in `common.js`
- No duplicate s13-patterns.css — import from Sprint 11
- **No PlanningAIService.js** — AI generation already exists in `server/routes/planning.js`

---

## Endpoint Reality Check (Post-Audit)

### Dashboard Endpoints (ALL EXIST)

| Endpoint | Status | Used By |
|----------|--------|---------|
| `GET /api/dashboard/today` | **EXISTS** | U1 — role-based: tasks_today, overdue_tasks, blocked_tasks, weekly_goals, celebrations |
| `GET /api/dashboard/overview` | **EXISTS** | U1 KPI row |
| `GET /api/dashboard/weekly-performance` | **EXISTS** | U1 weekly goals column |
| `POST /api/dashboard/complete-task/:taskId` | **EXISTS** | U1 task completion from dashboard |
| `POST /api/dashboard/celebrate/:taskId` | **EXISTS** | U1 celebration note |

### Task Endpoints (ALL EXIST — separate model at /api/tasks)

| Endpoint | Status | Used By |
|----------|--------|---------|
| `GET /api/tasks/my/tasks` | **EXISTS** | U1 user's tasks |
| `GET /api/tasks/status/overdue` | **EXISTS** | U1 overdue column |
| `GET /api/tasks/status/due-soon` | **EXISTS** | U1 tomorrow/this-week |
| `PUT /api/tasks/:id/complete` | **EXISTS** | P1 — auto-cascades to parent Goal |
| `PUT /api/tasks/:id/status` | **EXISTS** | P1 status changes |
| `PUT /api/tasks/:id` | **EXISTS** | P2 postpone (due_date), P3 reassign (assigned_to) |
| `GET /api/tasks/stats/summary` | **EXISTS** | U1 KPI stats |

### Planning Endpoints (ALL EXIST)

| Endpoint | Status | Used By |
|----------|--------|---------|
| `GET /api/planning/hierarchy` | **EXISTS** | L1 full goal hierarchy |
| `GET /api/planning/weeks` | **EXISTS** | L1 13 weeks for quarter |
| `GET /api/planning/goals/weekly` | **EXISTS** | L3 weekly goals for KR |
| `POST /api/planning/goals/weekly` | **EXISTS** | L4 create weekly goal |
| `POST /api/planning/goals/quarterly` | **EXISTS** | L4 create quarterly goal |
| `PUT /api/planning/goals/:id/progress` | **EXISTS** | L3 update progress |
| `POST /api/planning/tasks/bulk` | **EXISTS** | L4 bulk create tasks |
| `POST /api/planning/generate-weekly-plan` | **EXISTS** | M1 — AI generates weekly goals + tasks for a KR |
| `POST /api/planning/extend` | **EXISTS** | M3 — extend plan with more weeks |
| `DELETE /api/planning/weekly-plan/:krId` | **EXISTS** | M3 — delete plan for full regen |
| `GET /api/planning/kr/:krId/planned-weeks` | **EXISTS** | L5 check which weeks are planned |

**ZERO new backend endpoints needed. Sprint 12 is 100% frontend work.**

The only optional backend enhancements:
- Add `postpone_history` array to Task model (track postpone count/dates)
- Add client-side grouping by due_date (use `GET /api/tasks?due_date_from=X&due_date_to=Y`)

---

## Epic Overview

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| U1 | 6 | P0 | Dashboard page redesign (S13 layout) |
| L | 25 | P0 | Planning page redesign + functionality |
| M-Ph1 | 13 | P1 | OKR Wizard Phase 1 (weekly goal generation) |
| P | 9 | P1 | Observer/tracking improvements (task actions) |
| **Total** | **53** | | |

---

## Epic U1: Dashboard Page Redesign (6 pts)

### Problem
Current dashboard uses legacy layout. S13 mockup shows 3-column task layout (Overdue/Today/Tomorrow), objective context cards, weekly goal columns — all hardcoded.

### Mockup Reference
`sprint_mockups/sprint-13/dashboard-redesign.html`

### Dashboard Data Loading Strategy (2 API calls)

**Primary call**: `GET /api/dashboard/today`
Returns: `my_focus.tasks_today`, `my_focus.overdue_tasks`, `my_focus.blocked_tasks`, `this_week.my_weekly_goals`, `celebrations.my_completions_today`

**Secondary call**: `GET /api/dashboard/overview`
Returns: Quarter-level metrics for KPI cards

**Column grouping**: Do client-side grouping of tasks from `/api/dashboard/today`:
- Overdue column: `my_focus.overdue_tasks`
- Today column: `my_focus.tasks_today`
- This Week column: tasks from `GET /api/tasks?due_date_from=tomorrow&due_date_to=end_of_week`

### API Data Sources (Every UI Element)

| UI Element | API Source | Endpoint | Dynamic Data |
|-----------|-----------|----------|-------------|
| Task columns (Overdue/Today/Tomorrow) | Tasks by due date | `GET /api/tasks/my/tasks` | Group client-side by due date |
| Task card: title | Task object | `task.title` | Render with `escapeHtml()` |
| Task card: objective context | Populated reference | `task.objective_id.title` | From populated Task -> Objective |
| Task card: priority badge | Task field | `task.priority` | Map to color: high=red, medium=amber, low=green |
| Task card: assignee avatar | Task field | `task.assigned_to` | `getInitials(user.name)` |
| Task card: due date | Task field | `task.due_date` | `formatDate(task.due_date)` |
| Task hover: Complete action | Task action | `PUT /api/tasks/:id/complete` | Auto-cascades via post-save middleware |
| Task hover: Postpone action | Task action | `PUT /api/tasks/:id` | `{ due_date: newDate }` |
| Task hover: Assign action | Task action | `PUT /api/tasks/:id` | `{ assigned_to: userId }` |
| Objective context cards | Objectives | `GET /api/objectives?user_id=X` | Active objectives with progress |
| Objective SVG progress ring | Computed | `objective.progress` | Same `renderScoreRing()` from Sprint 11 |
| Weekly goals | Dashboard API | `GET /api/dashboard/today` -> `this_week.my_weekly_goals` | 3-column layout |
| Weekly goal progress bar | Goal field | `goal.progress_percentage` | Width from percentage |
| Page KPI: Total tasks | Computed | Tasks array `.length` | Count |
| Page KPI: Overdue count | Computed | Filter `task.due_date < today` | Count with red styling |
| Page KPI: Completed today | Computed | Filter `task.status === 'completed'` | Count |

### 3-Column Task Layout (Dynamic Grouping)

```javascript
// NEVER hardcode task groups — compute from data
function groupTasksByDueDate(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

  return {
    overdue: tasks.filter(t => new Date(t.due_date) < today && t.status !== 'completed'),
    today: tasks.filter(t => {
      const d = new Date(t.due_date);
      return d >= today && d < tomorrow;
    }),
    tomorrow: tasks.filter(t => {
      const d = new Date(t.due_date);
      return d >= tomorrow && d < new Date(tomorrow.getTime() + 86400000);
    }),
    thisWeek: tasks.filter(t => {
      const d = new Date(t.due_date);
      return d >= new Date(tomorrow.getTime() + 86400000) && d <= endOfWeek;
    }),
    later: tasks.filter(t => new Date(t.due_date) > endOfWeek)
  };
}
```

### Task Card Rendering

```javascript
function renderTaskCard(task) {
  const priorityColors = {
    high: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
    medium: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
    low: { bg: '#DCFCE7', text: '#166534', border: '#22c55e' }
  };
  const p = priorityColors[task.priority] || priorityColors.medium;
  const ownerInitials = task.assigned_to?.user_id?.name
    ? window.KarviaCommon.getInitials(task.assigned_to.user_id.name)
    : '?';

  return `
    <div class="task-card" data-task-id="${task._id}"
         style="border-left: 3px solid ${p.border};">
      <div class="task-title">${window.KarviaCommon.escapeHtml(task.title)}</div>
      <div class="task-context">
        ${task.objective_id?.title
          ? `<span class="task-objective">${window.KarviaCommon.escapeHtml(task.objective_id.title)}</span>`
          : ''}
      </div>
      <div class="task-meta">
        <span class="task-due">${window.KarviaCommon.formatDate(task.due_date)}</span>
        <span class="task-owner-avatar">${ownerInitials}</span>
      </div>
      <div class="task-actions">
        <button onclick="completeTask('${task._id}')" title="Complete">check</button>
        <button onclick="postponeTask('${task._id}')" title="Postpone">clock</button>
        <button onclick="assignTask('${task._id}')" title="Assign">user</button>
      </div>
    </div>
  `;
}
```

### Files to Modify

| File | Action | Details |
|------|--------|---------|
| `client/pages/dashboard.html` | REWRITE | S13 3-column layout, objective cards, weekly goals |
| `client/pages/scripts/dashboard.js` | REWRITE | Task grouping, actions, dynamic rendering |
| `client/js/goals-api-client.js` | EXTEND | Add convenience methods wrapping existing `/api/tasks/*` and `/api/dashboard/*` endpoints |
| `server/routes/dashboard.js` | VERIFY ONLY | Already has /today, /overview, /weekly-performance |

### DO NOT

- Do not hardcode task titles, names, dates, priority colors as static HTML
- Do not create a new DashboardAPIClient — extend GoalsAPIClient
- Do not duplicate objective card rendering — reuse pattern from objectives page
- Do not create new date utilities — use `formatDate()` from `common.js`
- Hardcode column headers "Overdue", "Today", "Tomorrow" — these are OK as UI labels (not data)

---

## Epic L: Planning Page Redesign (25 pts)

### Stories

| ID | Story | Points | Description |
|----|-------|--------|-------------|
| L1 | Two-panel layout with KR sidebar | 5 | Left: KR list (280px), Right: Weekly goals |
| L2 | Objective selector row | 3 | Horizontal objective cards at top |
| L3 | Weekly goal cards (collapsible) | 5 | Week cards with expand/collapse, tasks inside |
| L4 | Task management within weeks | 5 | Add/edit/delete/reorder tasks per week |
| L5 | AI-powered weekly goal generation | 4 | Generate 12 weekly goals from KR |
| L6 | AI-powered task generation per week | 3 | Generate 3-5 tasks from weekly goal |

### Mockup Reference
`sprint_mockups/sprint-13/planning-redesign.html`

### API Data Sources

| UI Element | API Source | Endpoint | Dynamic Data |
|-----------|-----------|----------|-------------|
| Objective selector row | Objectives | `GET /api/objectives?status=active` | Via `ObjectivesAPI.getObjectives()` |
| Objective progress ring | Computed | `objective.progress` | SVG ring |
| Objective owner | Populated | `objective.owner_id.name` | `getInitials()` |
| Objective category badge | Field | `objective.category` | `CategoryIcons.getBadge()` |
| KR sidebar cards | Key Results | `GET /api/goals/quarterly?objective_id=X` | Via `GoalsAPIClient` |
| KR title | Field | `kr.title` | `escapeHtml()` |
| KR progress bar | Field | `kr.progress_percentage` | Width percentage |
| KR status badge | Field | `kr.status` | Map to color |
| Week cards | Weekly goals | `GET /api/planning/goals/weekly?key_result_id=X` | 12 weeks |
| Week tasks | Tasks | `GET /api/tasks?goal_id=X` | Task list per week |
| Generate Weekly Goals button | AI endpoint | `POST /api/planning/generate-weekly-plan` | **(ALREADY EXISTS)** |
| Extend Plan button | AI endpoint | `POST /api/planning/extend` | **(ALREADY EXISTS)** |
| Quarter selector | Computed | Current quarter from DateService | Q1/Q2/Q3/Q4 buttons |
| Current week highlight | Computed | `DateService.getCurrentWeek()` | `.current` class |

### Two-Panel Layout

```
+----------------------------------------------------------+
| [Planning]                    [Q4 2025] [Q1 2026] [Q2]   |
+----------------------------------------------------------+
| [Obj 1: Revenue 35%] [Obj 2: NPS 60%] [Obj 3: Team]     |
+------------+---------------------------------------------+
| KEY RESULTS| WEEKLY GOALS for selected KR                 |
| (280px)    |                                              |
|            | KR: Close $500K -- 45% -- $225K achieved      |
| +--KR1---+ | [Generate Weekly Goals]                       |
| | Close  | |                                              |
| | $500K  | | +- Week 1 (Jan 6-12) ---- 100% done ------+ |
| | == 45% | | | > Outreach to 50 leads                   | |
| +--------+ | |   3 tasks                                | |
| +--KR2---+ | +------------------------------------------+ |
| | Churn  | | +- Week 2 (Jan 13-19) -- 40% THIS WEEK --+ |
| | <5%    | | | v Close 5 deals worth $50K               | |
| | == 30% | | |   * Finalize Acme Corp proposal          | |
| +--------+ | |   * Send contract to TechStart           | |
| +--KR3---+ | |   [+ Add Task]                           | |
| | Launch | | |   3 tasks - Owner: JD                    | |
| | 2 prods| | +------------------------------------------+ |
| | -- 0%  | | +- Week 3 (Jan 20-26) -- 0% -------------+ |
| +--------+ | |   [Generate Tasks]                       | |
|            | +------------------------------------------+ |
+------------+---------------------------------------------+

ALL content from API. Week dates from DateService.
Task titles from task.title with escapeHtml().
Progress bars from goal.progress_percentage.
Owner avatars from getInitials(user.name).
```

### Quarter Selector (Dynamic)

```javascript
function renderQuarterSelector(objectives) {
  const quarters = [...new Set(objectives.map(o => {
    const date = new Date(o.start_date);
    const q = Math.ceil((date.getMonth() + 1) / 3);
    return `Q${q} ${date.getFullYear()}`;
  }))].sort();

  const currentQ = getCurrentQuarter();
  return quarters.map(q => `
    <button class="quarter-btn ${q === currentQ ? 'active' : ''}"
            onclick="selectQuarter('${q}')">
      ${q}
    </button>
  `).join('');
}
```

### Files to Modify

| File | Action | Details |
|------|--------|---------|
| `client/pages/planning.html` | REWRITE | Two-panel S13 layout |
| `client/pages/scripts/planning.js` | REWRITE | Objective selector, KR sidebar, week cards |
| `client/js/goals-api-client.js` | EXTEND | Add `getWeeklyGoals()`, `getTasksForWeek()` |
| `server/routes/planning.js` | VERIFY ONLY | Already has all generation endpoints |
| `server/routes/goals.js` | VERIFY | Ensure weekly goal CRUD works |
| `server/services/DateService.js` | VERIFY | Quarter/week calculations exist |

---

## Epic M-Ph1: OKR Wizard Phase 1 (13 pts)

### Stories

| ID | Story | Points | Description |
|----|-------|--------|-------------|
| M1 | Weekly goal generation from KR | 5 | AI generates 12 weekly steps to achieve a KR |
| M2 | Task generation from weekly goal | 4 | AI generates 3-5 actionable tasks per week |
| M3 | Regeneration + editing | 4 | Regenerate individual weeks/tasks, edit in-place |

### API Endpoints (All ALREADY EXIST)

| Endpoint | Method | Exists? | Notes |
|----------|--------|---------|-------|
| `/api/planning/generate-weekly-plan` | POST | **YES** | Generates weekly goals + tasks for a KR |
| `/api/planning/extend` | POST | **YES** | Add more weeks to existing plan |
| `/api/planning/weekly-plan/:krId` | DELETE | **YES** | Delete plan for full regeneration |
| `/api/planning/kr/:krId/planned-weeks` | GET | **YES** | Check which weeks are already planned |

No new endpoints needed for M-Ph1. Only frontend wiring.

### AI Generation (ALREADY EXISTS in planning.js route)

The AI weekly plan generation is **already implemented** in `server/routes/planning.js`:
- `POST /api/planning/generate-weekly-plan` — uses gpt-3.5-turbo, builds context with SSI scores, has template fallback
- `POST /api/planning/extend` — extend existing plan with more weeks
- `DELETE /api/planning/weekly-plan/:krId` — delete all weekly goals + tasks for regen

**DO NOT create PlanningAIService.js** — the AI logic is embedded in the route handler.

Sprint 12 M-Ph1 scope is **frontend only**:
- Wire "Generate Weekly Goals" button to `POST /api/planning/generate-weekly-plan`
- Wire "Extend Plan" button to `POST /api/planning/extend`
- Wire "Regenerate" to `DELETE /api/planning/weekly-plan/:krId` + `POST /api/planning/generate-weekly-plan`
- Show loading state during generation
- Handle graceful degradation when `FEATURE_OPENAI_ENABLED = false`

### Graceful Degradation

```
IF OpenAI unavailable:
  - Show "Generate" buttons as disabled with tooltip "AI unavailable"
  - Show "Add manually" buttons prominently
  - All manual CRUD still works
  - Feature flag: FEATURE_OPENAI_ENABLED = false
```

---

## Epic P: Observer/Tracking Improvements (9 pts)

### Stories

| ID | Story | Points | Description |
|----|-------|--------|-------------|
| P1 | Task completion with progress cascade | 3 | Complete task -> update weekly goal -> update KR progress |
| P2 | Postpone task with date picker | 3 | Move task to future date, track postpone history |
| P3 | Task reassignment | 3 | Assign task to different user within team |

### API Data Sources

| Action | Endpoint | Payload |
|--------|----------|---------|
| Complete task | `PUT /api/tasks/:id/complete` | Auto-cascades via post-save middleware |
| Postpone task | `PUT /api/tasks/:id` | `{ due_date: newDate, postpone_reason: text }` |
| Reassign task | `PUT /api/tasks/:id` | `{ assigned_to: { user_id: newUserId } }` |
| Get team members (for assign) | `GET /api/teams/:teamId/members` | Via `TeamAPI` |

### Progress Cascade (ALREADY BUILT)

Task completion cascade is **already implemented** in `server/models/Task.js` post-save middleware:
- `PUT /api/tasks/:id/complete` -> post-save middleware calls `goal.updateTaskMetrics()`
- This automatically recomputes weekly goal progress from task completion percentages
- Weekly goal progress then cascades to quarterly goal (KR) progress

**DO NOT rebuild cascade logic.** It already works. Sprint 12 only needs to:
1. Call `PUT /api/tasks/:id/complete` from the dashboard UI
2. After completion, refresh the task list to show updated progress
3. Optionally refresh the weekly goals column to show cascaded progress

---

## Implementation Schedule

### Week 1: Dashboard
| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 1 | U1 (layout) | 3 | Dashboard S13 layout, task columns |
| 2 | U1 (data) | 3 | Task rendering, objective cards, weekly goals |
| 3 | P1 | 3 | Task completion with cascade |
| 4 | P2, P3 | 6 | Postpone + reassign actions |

### Week 2: Planning + OKR Wizard
| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 5 | L1, L2 | 8 | Two-panel layout, objective selector |
| 6 | L3, L4 | 10 | Week cards, task management |
| 7 | L5, L6 | 7 | AI generation buttons |
| 8 | M1 | 5 | Weekly goal generation frontend wiring |
| 9 | M2, M3 | 8 | Task generation + editing |
| 10 | Integration testing | 0 | End-to-end validation |

---

## Success Criteria

### Per Epic
- [ ] **U1**: Dashboard renders tasks grouped by date, all from API
- [ ] **L**: Planning shows two-panel layout with objective->KR->week hierarchy, all from API
- [ ] **M-Ph1**: AI generates weekly goals and tasks, graceful degradation when AI off
- [ ] **P**: Complete/postpone/assign tasks works with progress cascade

### Sprint Completion Checklist
- [ ] Dashboard and Planning pages use `s13-patterns.css`
- [ ] Both pages follow standard page template from Sprint 11
- [ ] All task data comes from API — zero hardcoded task titles/dates/names
- [ ] All progress bars computed from real data
- [ ] Quarter selector computed from objective dates
- [ ] Week cards show dates from DateService calculations
- [ ] AI generation degrades gracefully when OpenAI disabled
- [ ] Progress cascade works: task->weekly->KR
- [ ] Role-gated actions (assign only for managers+)
- [ ] Reuses `ObjectivesAPI`, `GoalsAPIClient`, `CategoryIcons` — no new clients

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| GoalsAPIClient missing task methods | Medium | Low | Extend existing class, don't create new |
| DateService quarter calculations | Low | Medium | Already validated in Sprint 10 |
| AI generation latency | Medium | Low | Show loading spinner, allow cancel |
| Task cascade complexity | Low | Low | Already built in Task model post-save middleware |

---

## Rollback Plan

| Scenario | Action | Impact |
|----------|--------|--------|
| Dashboard rendering fails | Revert to existing dashboard page | Users see old layout |
| Planning page breaks | Revert to existing planning page | Users see old layout |
| AI generation times out | Graceful degradation already built — shows "AI unavailable", manual entry works | None |
| Task cascade breaks | Task model post-save middleware is unchanged — only UI calls are new | None |

---

## Related Documents

- Sprint 11 V2 (prerequisite): `SPRINT-11-MASTER-PLAN-V2.md`
- Mockups: `sprint_mockups/sprint-13/dashboard-redesign.html`, `planning-redesign.html`
- GoalsAPIClient: `client/js/goals-api-client.js`
- ObjectivesAPI: `client/js/objectives-api-client.js`
- DateService: `server/services/DateService.js`
- Planning routes: `server/routes/planning.js`

---

**Sprint 12 V2 — Daily Workflow, Zero Hardcoding**
