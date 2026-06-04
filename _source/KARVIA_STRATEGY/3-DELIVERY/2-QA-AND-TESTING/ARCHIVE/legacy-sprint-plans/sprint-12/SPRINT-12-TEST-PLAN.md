# Sprint 12 Test Plan — Daily Workflow Pages

**Sprint**: 12 | **Points**: 53 | **Pages**: Dashboard, Planning
**Epics**: U1, L, M-Ph1, P
**Created**: January 27, 2026
**Updated**: January 27, 2026 (Post-Audit)

---

## Test Summary

| Category | Test Cases | Priority |
|----------|-----------|----------|
| Unit Tests | 78 | P0-P2 |
| Integration Tests | 38 | P0-P1 |
| E2E / Playwright | 36 | P0-P1 |
| Edge Cases | 38 | P1-P2 |
| **Total** | **192** | |

---

## 1. Epic U1 — Dashboard Page Redesign (6 pts)

### 1.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U1-U01 | `groupTasksByDueDate()` categorizes overdue tasks | `task.due_date < today` goes to overdue | P0 |
| U1-U02 | `groupTasksByDueDate()` categorizes today's tasks | `due_date === today` goes to today | P0 |
| U1-U03 | `groupTasksByDueDate()` categorizes tomorrow's tasks | `due_date === tomorrow` goes to tomorrow | P0 |
| U1-U04 | `groupTasksByDueDate()` categorizes this-week tasks | Within 7 days but not today/tomorrow | P0 |
| U1-U05 | `groupTasksByDueDate()` categorizes later tasks | Beyond 7 days goes to later | P0 |
| U1-U06 | `groupTasksByDueDate()` excludes completed from overdue | Completed tasks with past due_date NOT in overdue | P0 |
| U1-U07 | Task card left border color: high=`#EF4444` | Red border for high priority | P0 |
| U1-U08 | Task card left border color: medium=`#F59E0B` | Amber border for medium | P0 |
| U1-U09 | Task card left border color: low=`#22c55e` | Green border for low | P0 |
| U1-U10 | Task card title rendered with `escapeHtml()` | XSS safe | P0 |
| U1-U11 | Task card shows objective context from populated ref | `task.objective_id.title` displayed | P0 |
| U1-U12 | Task card shows KR context from populated ref | `task.key_result_id.title` displayed | P0 |
| U1-U13 | Assignee avatar from `getInitials(user.name)` | Initials shown | P0 |
| U1-U14 | Missing assignee name shows "?" | Fallback character displayed | P0 |
| U1-U15 | KPI: Total tasks = `tasks.length` | Correct count | P0 |
| U1-U16 | KPI: Overdue count = overdue group length | Red-styled count | P0 |
| U1-U17 | KPI: Completed today = completed tasks with today's date | Correct count | P0 |
| U1-U18 | Objective progress ring uses `renderScoreRing()` | SVG ring from Sprint 11 utility | P0 |
| U1-U19 | Weekly goals displayed in 3 columns (Last/This/Next) | 3 column layout | P0 |
| U1-U20 | Weekly goal progress bar width = `progress_percentage` | CSS width matches data | P0 |

### 1.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U1-I01 | `GET /api/dashboard/today` returns tasks_today, overdue_tasks, blocked_tasks, weekly_goals, celebrations | All dashboard sections populated. Note: supplemental data from `GET /api/dashboard/overview` | P0 |
| U1-I02 | `GET /api/objectives?user_id=X` returns user's objectives | Active objectives only | P0 |
| U1-I03 | `GET /api/goals/weekly?user_id=X&weeks=3` returns 3 weeks | Last, current, next week goals | P0 |
| U1-I04 | Task endpoint filters by company_id | Multi-tenant isolation | P0 |
| U1-I05 | Task endpoint requires authentication | 401 without token | P0 |
| U1-I06 | User A cannot see User B's tasks (same company, different user) | User-scoped results | P0 |
| U1-I07 | Tasks populated with objective and KR titles | `populate('objective_id', 'title')` works | P0 |

### 1.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| U1-E01 | Dashboard loads with task columns | Login → Dashboard | Overdue/Today/Tomorrow columns visible | P0 |
| U1-E02 | Task cards show priority border colors | Check task cards | Left border matches priority | P0 |
| U1-E03 | Hover task shows actions (Complete/Postpone/Assign) | Hover over task card | Action buttons appear | P0 |
| U1-E04 | Complete task action | Click Complete | Task moves to completed, column updates | P0 |
| U1-E05 | Objective context cards display | Check sidebar | SVG rings with objective progress | P1 |
| U1-E06 | Weekly goal columns show 3 weeks | Check columns | Last, This, Next week | P0 |
| U1-E07 | Dashboard with no tasks shows empty state | New user, no tasks | "No tasks" message | P0 |
| U1-E08 | KPI cards update after completing a task | Complete task → verify KPIs | Counts updated | P0 |

### 1.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| U1-X01 | User with 0 tasks — all columns empty with empty state | "No tasks" per column | P0 |
| U1-X02 | Task with null `due_date` — categorized to "Later" | No crash, fallback category | P0 |
| U1-X03 | Task with null `assigned_to` — shows "?" avatar | No crash | P0 |
| U1-X04 | Task with null `objective_id` — no context shown | Graceful, no crash | P0 |
| U1-X05 | 200+ tasks — performance acceptable | Renders within 2 seconds | P1 |
| U1-X06 | Task title with XSS payload | Escaped on render | P0 |
| U1-X07 | All tasks overdue — only overdue column populated | Other columns show empty state | P0 |
| U1-X08 | Task due_date exactly at midnight boundary | Correct categorization | P1 |
| U1-X09 | Complete task → cascade to weekly goal progress | Weekly goal progress_percentage updates | P0 |
| U1-X10 | Complete all tasks in weekly goal → KR progress updates | Two-level cascade works | P0 |
| U1-X11 | 500+ tasks — pagination or virtual scroll | No browser freeze, tasks accessible via pagination or virtual scroll | P1 |

---

## 2. Epic L — Planning Page Redesign (25 pts)

### 2.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| L-U01 | Two-panel layout: sidebar 280px, main panel fills remaining | CSS widths correct | P0 |
| L-U02 | Objective selector row rendered from active objectives | Cards from API, not hardcoded | P0 |
| L-U03 | Objective card shows progress ring via `renderScoreRing()` | SVG ring | P0 |
| L-U04 | Objective card shows owner via `getInitials()` | Avatar initials | P0 |
| L-U05 | Objective card shows category via `CategoryIcons.getBadge()` | Category icon + label | P0 |
| L-U06 | KR sidebar cards rendered from quarterly goals | Cards loop over KRs | P0 |
| L-U07 | KR title rendered with `escapeHtml()` | XSS safe | P0 |
| L-U08 | KR progress bar width from `progress_percentage` | CSS width matches data | P0 |
| L-U09 | KR status badge color mapped correctly | on_track=green, at_risk=amber, behind=red | P0 |
| L-U10 | Quarter selector computed from objective dates | Buttons derived, not hardcoded "Q1 2026" | P0 |
| L-U11 | Current quarter gets `.active` class | Active styling applied | P0 |
| L-U12 | Week cards rendered from weekly goals | 12 cards per quarter | P0 |
| L-U13 | Current week gets `.current` class highlight | Highlighted styling | P0 |
| L-U14 | Completed week gets `.completed` class | Completed styling | P0 |
| L-U15 | Week card collapsed: shows title + progress + task count | Summary visible | P0 |
| L-U16 | Week card expanded: shows full task list + "Add Task" | Tasks visible | P0 |
| L-U17 | Week number and dates computed from `DateService` | Dynamic week boundaries | P0 |
| L-U18 | All week titles use `escapeHtml()` | XSS safe | P0 |
| L-U19 | Owner avatar on week card uses `getInitials()` | Initials displayed | P0 |

### 2.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| L-I01 | `GET /api/objectives?status=active` returns active objectives | Only active status | P0 |
| L-I02 | `GET /api/planning/hierarchy` returns full goal hierarchy | Objectives, KRs, quarterly goals, weekly goals in nested structure | P0 |
| L-I03 | `GET /api/planning/goals/weekly?key_result_id=X` returns weekly goals | 12 goals per quarter | P0 |
| L-I04 | `GET /api/tasks?goal_id=X` returns tasks for a week | Tasks for the selected weekly goal | P0 |
| L-I05 | All planning endpoints filter by company_id | Multi-tenant isolation | P0 |
| L-I06 | All planning endpoints require authentication | 401 without token | P0 |
| L-I07 | KR sidebar populated with owner and progress | Populate chains work | P0 |
| L-I08 | `DateService.getCurrentWeek()` returns correct week | Matches calendar | P0 |
| L-I09 | `DateService.getQuarterDates()` returns correct boundaries | Start/end dates accurate | P0 |

### 2.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| L-E01 | Planning page loads with two-panel layout | Login → Navigate | Sidebar + main panel visible | P0 |
| L-E02 | Objective selector shows active objectives | Check top row | Cards from API | P0 |
| L-E03 | Click objective populates KR sidebar | Click objective | KR cards appear in sidebar | P0 |
| L-E04 | Click KR shows weekly goals in main panel | Click KR card | 12 week cards displayed | P0 |
| L-E05 | Expand week card shows tasks | Click week card | Task list expands | P0 |
| L-E06 | Add task within week | Click "Add Task" → fill → save | Task added to week | P0 |
| L-E07 | Quarter selector switches weeks | Click Q2 button | Week cards update to Q2 | P0 |
| L-E08 | Current week highlighted | Check current week card | `.current` class applied | P1 |
| L-E09 | No objectives — empty state | User with no objectives | "Create objectives first" message | P0 |

### 2.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| L-X01 | Objective with 0 KRs — sidebar shows empty state | "Add key results" message | P0 |
| L-X02 | KR with 0 weekly goals — main panel shows empty with generate CTA | "Generate weekly goals" button | P0 |
| L-X03 | Week with 0 tasks — shows empty state inside card | "No tasks yet" message | P0 |
| L-X04 | Custom period objective — quarter selector adapts | Quarters match custom period | P0 |
| L-X05 | Fiscal year objective — quarters start from fiscal month | April/July/October starts | P0 |
| L-X06 | Calendar year objective — standard Q1-Q4 | Jan/Apr/Jul/Oct quarters | P0 |
| L-X07 | Objective with 10+ KRs — sidebar scrollable | No overflow | P1 |
| L-X08 | Week card with 20+ tasks — scrollable within card | No overflow | P1 |
| L-X09 | Objective with 20+ KRs — sidebar scrollable with pagination | Pagination controls shown, no overflow | P1 |

---

## 3. Epic M-Ph1 — OKR Wizard Phase 1 (13 pts)

### 3.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| M-U01 | Generate button disabled when `FEATURE_OPENAI_ENABLED=false` | Button disabled + tooltip | P0 |
| M-U02 | Generate button enabled when `FEATURE_OPENAI_ENABLED=true` | Button clickable | P0 |
| M-U03 | AI generation returns 12 weekly goals | Array of 12 goals | P0 |
| M-U04 | AI generation includes KR context | Goals reference KR title/target | P0 |
| M-U05 | AI generation includes company context | Uses `AIContextService.getContext()` | P0 |
| M-U06 | Task generation returns 3-5 tasks per goal | Array length 3-5 | P0 |
| M-U07 | Regenerate single week replaces only that week | Other weeks unchanged | P0 |
| M-U08 | Regenerate single task replaces only that task | Other tasks unchanged | P0 |
| M-U09 | Manual "Add" buttons work when AI disabled | CRUD operations function | P0 |
| M-U10 | Generated goals have proper date ranges | Week boundaries from DateService | P0 |
| M-U11 | Generated tasks have due_dates within parent week | Task dates within week range | P0 |

### 3.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| M-I01 | `POST /api/planning/generate-weekly-plan` with valid KR returns 12 goals + tasks | 12 weekly goals and associated tasks created | P0 |
| M-I02 | `POST /api/planning/generate-weekly-plan` without KR returns 400 | Validation error | P0 |
| M-I03 | Tasks are created as part of `POST /api/planning/generate-weekly-plan` | Tasks included in generation response, no separate task creation endpoint needed | P0 |
| M-I04 | `POST /api/planning/extend` extends existing plan with additional weeks/tasks | Extended plan returned | P0 |
| M-I05 | `POST /api/planning/regenerate-task` replaces task content | Updated task returned | P0 |
| M-I06 | AI endpoints require authentication | 401 without token | P0 |
| M-I07 | AI endpoints filter by company_id | Multi-tenant isolation | P0 |
| M-I08 | `FEATURE_OPENAI_ENABLED=false` → AI endpoints return 503 | "AI unavailable" message | P0 |
| M-I09 | OpenAI API error → graceful degradation | 503 with retry message | P0 |
| M-I10 | Generated goals saved to database | Goals persisted | P0 |

### 3.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| M-E01 | Generate weekly goals button visible | Navigate to Planning → select KR | "Generate" button shown | P0 |
| M-E02 | Click generate → 12 goals appear | Click Generate | 12 week cards populate | P0 |
| M-E03 | Generate tasks for a week | Expand week → Click "Generate Tasks" | 3-5 tasks appear | P0 |
| M-E04 | Regenerate single week | Click regenerate on week card | New content, others unchanged | P1 |
| M-E05 | AI disabled → manual mode works | Feature flag off → Add manually | Manual CRUD functions | P0 |

### 3.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| M-X01 | Generate for KR with no context — AI still produces goals | Generic but functional goals | P0 |
| M-X02 | OpenAI rate limit hit during generation | Retry message, no crash | P0 |
| M-X03 | Network timeout during generation | Loading state, error message after timeout | P0 |
| M-X04 | Generate when weekly goals already exist — confirmation prompt | "Overwrite existing goals?" dialog | P0 |
| M-X05 | Concurrent generation requests — no duplicates | Only one set of 12 created | P0 |
| M-X06 | Very long KR title — AI still generates contextual goals | Goals reference KR appropriately | P1 |

---

## 4. Epic P — Observer/Tracking Improvements (9 pts)

### 4.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| P-U01 | Task complete → `status='completed'`, `completed_at=now` | Fields set correctly | P0 |
| P-U02 | Progress cascade: 3/5 tasks complete → weekly goal = 60% | `Math.round((3/5)*100) = 60` | P0 |
| P-U03 | Progress cascade: all tasks complete → weekly goal = 100% | Full completion | P0 |
| P-U04 | Progress cascade: 0 tasks complete → weekly goal = 0% | Zero progress | P0 |
| P-U05 | KR cascade: average of weekly goal percentages | Correct average | P0 |
| P-U06 | Postpone sets new `due_date` and records `postpone_reason` | Both fields updated | P0 |
| P-U07 | Reassign sets new `assigned_to.user_id` | User ID updated | P0 |
| P-U08 | Reassign only available for MANAGER+ role | EMPLOYEE cannot reassign | P0 |
| P-U09 | Complete task with no sibling tasks → weekly goal = 100% | Single task = 100% | P0 |
| P-U10 | Postpone date must be in the future | Past date rejected | P0 |

### 4.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| P-I01 | `PUT /api/tasks/:id/complete` → cascade fires | Weekly goal progress updated | P0 |
| P-I02 | `PUT /api/tasks/:id/complete` → KR cascade fires | KR progress updated | P0 |
| P-I03 | `PUT /api/tasks/:id` postpone with future `due_date` | Task due_date updated | P0 |
| P-I04 | `PUT /api/tasks/:id` postpone with past `due_date` returns 400 | "Date must be in the future" | P0 |
| P-I05 | `PUT /api/tasks/:id` reassign `assigned_to` as MANAGER succeeds | assigned_to updated | P0 |
| P-I06 | `PUT /api/tasks/:id` reassign `assigned_to` as EMPLOYEE returns 403 | Forbidden | P0 |
| P-I07 | `GET /api/teams/:teamId/members` returns team members for assign modal | Member list | P0 |
| P-I08 | Cascade integrity: undo complete via `PUT /api/tasks/:id/status` → progress decreases | Reverse cascade works | P1 |

### 4.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| P-E01 | Complete task from dashboard | Hover task → click Complete | Task marked done, column updates | P0 |
| P-E02 | Verify progress cascade after completion | Complete task → check weekly goal | Progress bar updated | P0 |
| P-E03 | Postpone task with date picker | Hover → Postpone → pick date → confirm | Task moves to new date column | P0 |
| P-E04 | Reassign task as MANAGER | Hover → Assign → pick user → confirm | Assignee avatar changes | P0 |
| P-E05 | EMPLOYEE cannot see Assign button | Login as Employee → hover task | No Assign action visible | P0 |
| P-E06 | Complete all tasks → weekly goal 100% | Complete all tasks in a week | Progress shows 100% | P0 |

### 4.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| P-X01 | Complete already-completed task — no change | Idempotent operation | P0 |
| P-X02 | Postpone to same date — no error | Accepted, no change | P1 |
| P-X03 | Reassign to self — accepted | No error, same user | P1 |
| P-X04 | Reassign to user from different company — rejected | 403 or 400 | P0 |
| P-X05 | Cascade with 0 sibling tasks — division by zero | No crash, 0% or 100% | P0 |
| P-X06 | Rapid-fire: complete 10 tasks simultaneously | All cascades resolve correctly | P0 |
| P-X07 | Postpone to date beyond objective end — warning | Warning shown or accepted | P1 |
| P-X08 | Network failure during cascade — transaction integrity | No partial updates | P0 |
| P-X09 | Cancelled task excluded from progress denominator | 3 tasks, 1 cancelled, 1 complete = 50% not 33% | P0 |
| P-X10 | Cancel last remaining task — weekly goal progress = N/A or 0% | No crash, sensible default | P0 |
| P-X11 | Date picker opens on Postpone click — calendar widget shown | Calendar widget visible with selectable dates | P1 |
| P-X12 | Date picker rejects past dates — validation error | Past dates disabled or validation error on selection | P0 |

---

## 5. Additional Test Suites

### 5.1 CONSULTANT Role Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| CON-01 | CONSULTANT can access Dashboard and Planning pages | Both pages load without 403 | P0 |
| CON-02 | CONSULTANT can view all tasks across company | `GET /api/tasks/my/tasks` returns all company tasks (not user-scoped) | P0 |
| CON-03 | CONSULTANT can generate AI weekly plans | `POST /api/planning/generate-weekly-plan` succeeds | P0 |
| CON-04 | CONSULTANT can complete/postpone/reassign any task | All task actions via `PUT /api/tasks/:id/*` succeed | P0 |

### 5.2 Responsive Tests (768px)

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| RESP-01 | Dashboard at 768px — task columns stack vertically | Overdue/Today/Tomorrow columns stack in single column layout | P0 |
| RESP-02 | Planning at 768px — two-panel becomes stacked | Sidebar stacks above main panel, both full width | P0 |

---

## 6. Sprint 12 Integration Regression Tests

Tests verifying Sprint 12 does NOT break Sprint 11 or earlier.

| ID | Test Case | What It Protects | Priority |
|----|-----------|------------------|----------|
| REG-01 | Assessment Hub still loads and shows all 4 tabs | Sprint 11 U5 | P0 |
| REG-02 | Question Library dimension tree still works | Sprint 11 U3 | P0 |
| REG-03 | Teams page still renders with stats | Sprint 11 U4 | P0 |
| REG-04 | Assessment creation wizard completes | Sprint 11 J | P0 |
| REG-05 | Auth token migration shim still works | Sprint 11 Q1 | P0 |
| REG-06 | Input validation still enforced | Sprint 11 Q2 | P0 |
| REG-07 | SSI diagnostic report generates | Sprint 6/10 | P0 |
| REG-08 | OKR generation still works | Sprint 3 | P0 |
| REG-09 | Company profile page loads | Sprint 10 | P0 |
| REG-10 | Configuration page loads | Sprint 10 | P0 |
| REG-11 | Navigation between all pages works | Global | P0 |
| REG-12 | s13-patterns.css variables unchanged | Sprint 11 foundation | P0 |
| REG-13 | renderScoreRing() utility unchanged | Sprint 11 utility | P0 |
| REG-14 | Existing BST suite passes (50 tests) | All existing features | P0 |

---

## 7. User Journey Tests

### Journey 1: Daily Task Workflow

```
1. Login as MANAGER
2. Navigate to Dashboard
3. Verify KPI cards (Total, Overdue, Completed Today)
4. Verify task columns (Overdue/Today/Tomorrow/This Week/Later)
5. Hover over an overdue task → see Complete/Postpone/Assign
6. Click "Complete" on the overdue task
7. Verify task moves out of Overdue column
8. Verify KPI "Completed Today" increments
9. Verify the parent weekly goal progress updates
10. Navigate to Planning page
11. Select the relevant objective → KR → find the week
12. Verify the weekly goal progress bar reflects task completion
13. Return to Dashboard
14. Hover over a Today task → click "Postpone"
15. Select tomorrow's date
16. Verify task moves from Today to Tomorrow column
17. Hover over a task → click "Assign" (MANAGER action)
18. Select a team member from dropdown
19. Verify assignee avatar changes
20. Login as the assigned team member (EMPLOYEE)
21. Verify the task appears on their Dashboard "Today" tab
```

### Journey 2: Planning & AI Generation

```
1. Login as EXECUTIVE
2. Navigate to Planning page
3. Verify objective selector row shows active objectives
4. Click an objective card
5. Verify KR sidebar populates with key results
6. Click a KR card
7. Verify main panel shows weekly goals (or empty state)
8. If empty → click "Generate Weekly Goals"
9. Verify 12 week cards appear
10. Verify week numbers and date ranges are correct
11. Expand Week 1 → verify empty task state
12. Click "Generate Tasks" inside Week 1
13. Verify 3-5 tasks appear
14. Edit a generated task title inline
15. Add a manual task to Week 2
16. Switch quarter selector to Q2
17. Verify week cards update to Q2 range
18. Switch back to Q1
19. Verify Week 1 still has the tasks from step 13
20. Click "Regenerate" on Week 3
21. Confirm the overwrite dialog
22. Verify Week 3 has new content, others unchanged
```

### Journey 3: Progress Cascade Complete Flow

```
1. Login as MANAGER
2. Navigate to Planning → select objective → KR
3. Note KR progress bar value (e.g., 20%)
4. Expand a week with tasks
5. Complete Task 1 of 4
6. Verify weekly goal progress = 25%
7. Complete Task 2 of 4
8. Verify weekly goal progress = 50%
9. Navigate to Dashboard → verify KPI "Completed Today" = 2
10. Return to Planning
11. Complete Task 3 and Task 4
12. Verify weekly goal progress = 100%
13. Verify KR progress bar increased
14. Check the objective progress ring reflects cascade
```

---

## 8. Automated Test File Structure

```
QA/sprints/sprint-12/
├── SPRINT-12-TEST-PLAN.md              (this file)
├── unit/
│   ├── dashboard.test.js               (U1-U01 to U1-U20)
│   ├── planning-layout.test.js         (L-U01 to L-U19)
│   ├── okr-wizard.test.js              (M-U01 to M-U11)
│   ├── task-actions.test.js            (P-U01 to P-U10)
│   └── progress-cascade.test.js        (P-U02 to P-U09)
├── integration/
│   ├── dashboard-api.test.js           (U1-I01 to U1-I07)
│   ├── planning-api.test.js            (L-I01 to L-I09)
│   ├── ai-generation-api.test.js       (M-I01 to M-I10)
│   ├── task-actions-api.test.js        (P-I01 to P-I08)
│   └── date-service.test.js            (L-I08 to L-I09)
├── e2e/
│   ├── dashboard.spec.ts               (U1-E01 to U1-E08)
│   ├── planning.spec.ts                (L-E01 to L-E09)
│   ├── okr-wizard.spec.ts              (M-E01 to M-E05)
│   ├── task-actions.spec.ts            (P-E01 to P-E06)
│   ├── consultant-role.spec.ts         (CON-01 to CON-04)
│   ├── responsive.spec.ts              (RESP-01 to RESP-02)
│   └── regression.spec.ts             (REG-01 to REG-14)
├── journeys/
│   ├── daily-task-workflow.spec.ts     (Journey 1)
│   ├── planning-ai-generation.spec.ts (Journey 2)
│   └── progress-cascade.spec.ts       (Journey 3)
└── edge-cases/
    ├── dashboard-edge.test.js          (U1-X01 to U1-X11)
    ├── planning-edge.test.js           (L-X01 to L-X09)
    ├── okr-wizard-edge.test.js         (M-X01 to M-X06)
    └── task-actions-edge.test.js       (P-X01 to P-X12)
```

---

## 9. Test Execution Order

```
Phase 1: Unit Tests
  npm test -- tests/unit/sprint-12/

Phase 2: Integration Tests (requires DB)
  npm test -- tests/integration/sprint-12/

Phase 3: E2E Tests (requires running server)
  npx playwright test QA/sprints/sprint-12/e2e/

Phase 4: Journey Tests
  npx playwright test QA/sprints/sprint-12/journeys/

Phase 5: Regression (Sprint 11 + all prior)
  npx playwright test QA/sprints/sprint-12/e2e/regression.spec.ts
  npx playwright test QA/sprints/sprint-11/e2e/  (Sprint 11 E2E re-run)
  npm run test:bst  (existing 50 BST tests)
```

---

## 10. Pass Criteria

| Gate | Requirement |
|------|-------------|
| Unit Tests | 100% pass rate |
| Integration Tests | 100% pass rate |
| E2E Tests | 100% pass rate |
| Journey Tests | 95% pass rate |
| Edge Cases | 90% pass rate |
| Regression (Sprint 11 + BST) | 100% pass rate |
| Code Coverage | ≥ 80% lines for new code |
| Security | All XSS/injection tests pass |
| Multi-tenancy | All isolation tests pass |
| Progress Cascade | All cascade tests pass (P0 CRITICAL) |
| Performance | All pages render < 2 seconds |
| DateService | Quarter boundaries accurate for all 3 period types |

---

*Sprint 12 Test Plan — 192 total test cases*
*Last Updated: January 27, 2026*
