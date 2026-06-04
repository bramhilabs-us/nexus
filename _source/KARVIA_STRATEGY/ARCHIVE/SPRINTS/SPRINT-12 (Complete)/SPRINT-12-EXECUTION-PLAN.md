# Sprint 12 Execution Plan

**Sprint**: 12 - Dashboard + Planning Redesign
**Total Points**: 53 pts
**Duration**: 10 days (2 weeks)
**Start**: After Sprint 11 deployment
**Focus**: 100% Frontend - Daily workflow pages

---

## Pre-Sprint Checklist

- [ ] Sprint 11 deployed to production
- [ ] Mockups reviewed: `dashboard-redesign.html`, `planning-redesign.html`
- [ ] Existing APIs verified (all endpoints confirmed working in Sprint 11)
- [ ] `s13-patterns.css` available from Sprint 11

---

## Day-by-Day Execution

### Day 1: Dashboard Layout (U1 - 3 pts)

**Goal**: S13 layout structure with 3-column task grid

**Tasks**:
1. Create new `client/pages/dashboard-v2.html` (don't overwrite existing yet)
2. Import `s13-patterns.css`
3. Build 3-column task layout (Overdue | Today | Tomorrow)
4. Add KPI row at top (placeholder values)
5. Add objective context cards section (placeholder)
6. Add weekly goals column (placeholder)

**Files**:
- CREATE: `client/pages/dashboard-v2.html`
- CREATE: `client/pages/scripts/dashboard-v2.js`

**Verification**:
- [ ] Page loads with S13 styling
- [ ] 3-column layout visible
- [ ] Responsive on mobile (stacked columns)

---

### Day 2: Dashboard Data Integration (U1 - 3 pts)

**Goal**: All dashboard content from API

**Tasks**:
1. Extend `goals-api-client.js` with dashboard methods:
   - `getDashboardToday()` -> `GET /api/dashboard/today`
   - `getDashboardOverview()` -> `GET /api/dashboard/overview`
   - `getMyTasks()` -> `GET /api/tasks/my/tasks`
2. Implement `groupTasksByDueDate(tasks)` client-side grouping
3. Implement `renderTaskCard(task)` with XSS protection
4. Wire objective context cards from `GET /api/objectives?user_id=X`
5. Wire weekly goals from dashboard API response
6. Remove all placeholder values

**Files**:
- MODIFY: `client/js/goals-api-client.js` (+50 lines)
- MODIFY: `client/pages/scripts/dashboard-v2.js` (+200 lines)

**Verification**:
- [ ] Tasks appear from API
- [ ] Grouping shows correct tasks in each column
- [ ] Objective cards show real objectives
- [ ] Weekly goals show real goals
- [ ] KPI numbers calculated from data

---

### Day 3: Task Completion with Cascade (P1 - 3 pts)

**Goal**: Complete tasks from dashboard with progress cascade

**Tasks**:
1. Add task hover actions (Complete | Postpone | Assign)
2. Wire "Complete" button to `PUT /api/tasks/:id/complete`
3. After completion, refresh task list
4. Show success toast
5. Verify cascade works (check weekly goal progress updates)

**Files**:
- MODIFY: `client/pages/scripts/dashboard-v2.js` (+80 lines)

**Verification**:
- [ ] Complete button works
- [ ] Task moves out of list
- [ ] Toast shows success
- [ ] Parent weekly goal progress increases

---

### Day 4: Postpone + Reassign (P2/P3 - 6 pts)

**Goal**: Full task action menu

**Tasks**:
1. Add postpone modal with date picker
2. Wire to `PUT /api/tasks/:id` with `{ due_date: newDate }`
3. Add reassign modal with team member dropdown
4. Fetch team members from `GET /api/teams/:teamId/members`
5. Wire to `PUT /api/tasks/:id` with `{ assigned_to: { user_id } }`
6. Role-gate assign action (MANAGER+ only)

**Files**:
- MODIFY: `client/pages/scripts/dashboard-v2.js` (+150 lines)

**Verification**:
- [ ] Postpone moves task to new date
- [ ] Task appears in correct column after postpone
- [ ] Assign modal shows team members
- [ ] Assign changes task owner
- [ ] EMPLOYEE role cannot see assign button

---

### Day 5: Planning Layout (L1/L2 - 8 pts)

**Goal**: Two-panel layout with objective selector

**Tasks**:
1. Create new `client/pages/planning-v2.html`
2. Build two-panel layout (280px left sidebar + main content)
3. Add objective selector row at top
4. Wire objectives from `GET /api/objectives?status=active`
5. Implement objective card click -> filter KRs
6. Add KR sidebar with cards
7. Wire KRs from `GET /api/goals/quarterly?objective_id=X`

**Files**:
- CREATE: `client/pages/planning-v2.html`
- CREATE: `client/pages/scripts/planning-v2.js`

**Verification**:
- [ ] Two-panel layout renders
- [ ] Objective cards show at top
- [ ] Clicking objective filters KR sidebar
- [ ] KR cards show with progress bars

---

### Day 6: Week Cards + Task Management (L3/L4 - 10 pts)

**Goal**: Weekly goal cards with tasks

**Tasks**:
1. Implement week card component (collapsible)
2. Calculate week dates using `DateService` patterns
3. Wire weekly goals from `GET /api/planning/goals/weekly?key_result_id=X`
4. Show tasks inside each week card
5. Wire tasks from `GET /api/tasks?goal_id=X`
6. Add expand/collapse functionality
7. Highlight current week
8. Add "Add Task" inline form
9. Wire task creation to `POST /api/planning/tasks`

**Files**:
- MODIFY: `client/pages/scripts/planning-v2.js` (+300 lines)

**Verification**:
- [ ] 12-13 week cards visible
- [ ] Current week highlighted
- [ ] Tasks show inside each week
- [ ] Can add new task
- [ ] Expand/collapse works

---

### Day 7: AI Weekly Goal Generation (L5/L6 - 7 pts)

**Goal**: Generate weekly goals from KR

**Tasks**:
1. Add "Generate Weekly Goals" button to KR header
2. Wire to `POST /api/planning/generate-weekly-plan`
3. Show loading state during generation
4. Handle success: refresh week cards
5. Handle graceful degradation when AI disabled
6. Add "Generate Tasks" button per week
7. Add "Extend Plan" button

**Files**:
- MODIFY: `client/pages/scripts/planning-v2.js` (+150 lines)

**Verification**:
- [ ] Generate button calls API
- [ ] Loading spinner shows
- [ ] Week cards populate after generation
- [ ] Works when AI disabled (shows manual entry)

---

### Day 8: OKR Wizard Frontend (M1 - 5 pts)

**Goal**: Full AI generation flow wired

**Tasks**:
1. Confirm all generation endpoints working:
   - `POST /api/planning/generate-weekly-plan`
   - `POST /api/planning/extend`
   - `DELETE /api/planning/weekly-plan/:krId`
2. Add regeneration flow:
   - "Regenerate" button per KR
   - Confirm modal
   - Delete + regenerate
3. Track planned weeks: `GET /api/planning/kr/:krId/planned-weeks`
4. Show "Continue Planning" for partial plans

**Files**:
- MODIFY: `client/pages/scripts/planning-v2.js` (+100 lines)

**Verification**:
- [ ] Regenerate deletes old plan
- [ ] New plan generated
- [ ] Continue works for partial plans

---

### Day 9: Task Generation + Editing (M2/M3 - 8 pts)

**Goal**: Per-week task generation and editing

**Tasks**:
1. Per-week "Generate Tasks" button
2. Wire to appropriate AI endpoint
3. Add inline task editing (click to edit)
4. Add task deletion with confirmation
5. Add task reordering (drag or up/down buttons)
6. Error handling for all operations

**Files**:
- MODIFY: `client/pages/scripts/planning-v2.js` (+150 lines)

**Verification**:
- [ ] Generate tasks per week works
- [ ] Can edit task title inline
- [ ] Can delete task
- [ ] Can reorder tasks

---

### Day 10: Integration Testing + Polish

**Goal**: End-to-end validation

**Tasks**:
1. Full user journey: Dashboard -> complete task -> check Planning progress
2. Full planning journey: Select objective -> KR -> generate -> add tasks
3. Test role gating (EMPLOYEE vs MANAGER)
4. Test graceful degradation (disable AI)
5. Responsive testing (mobile, tablet)
6. XSS verification (try HTML in task titles)
7. Rename v2 files to production names
8. Update navigation links

**Files**:
- RENAME: `dashboard-v2.html` -> `dashboard.html`
- RENAME: `planning-v2.html` -> `planning.html`
- MODIFY: `client/js/navigation.js` (verify links)

**Verification**:
- [ ] End-to-end journey works
- [ ] Role gating correct
- [ ] AI graceful degradation works
- [ ] Responsive layouts work
- [ ] No XSS vulnerabilities

---

## Epic Summary

| Epic | Stories | Points | Days | Status |
|------|---------|--------|------|--------|
| U1 | Dashboard layout + data | 6 | 1-2 | Pending |
| P | Task actions (complete/postpone/assign) | 9 | 3-4 | Pending |
| L | Planning layout + week cards | 25 | 5-7 | Pending |
| M-Ph1 | OKR Wizard frontend | 13 | 8-9 | Pending |
| Testing | Integration | 0 | 10 | Pending |
| **Total** | | **53** | **10** | |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API endpoint missing | All verified in master plan - 0 new endpoints needed |
| DateService issues | Reuse existing patterns from Sprint 10/11 |
| AI latency | Loading spinner + cancel button |
| Mobile responsiveness | Test early on Day 2 |

---

## Definition of Done

- [ ] Dashboard shows real tasks grouped by due date
- [ ] Planning shows two-panel layout with real data
- [ ] All task actions work (complete/postpone/assign)
- [ ] AI generation works with graceful degradation
- [ ] Progress cascade: task -> weekly goal -> KR
- [ ] S13 styling consistent across both pages
- [ ] Zero hardcoded data
- [ ] XSS protected
- [ ] Role-gated where needed

---

## Post-Sprint

1. Deploy to production
2. Create Sprint 12 release email
3. Begin Sprint 13 planning (Objectives + SSI Report)
