# 👥 Sprint 2 User Stories & Acceptance Criteria

**Sprint**: Sprint 2 - Goal Management & Task Execution
**Duration**: Nov 17-28, 2025 (10 days)
**Version**: 1.0.0
**Status**: 🔴 Not Started

---

## 📋 Story Overview

**Total Stories**: 10 stories (4 Manager + 6 Employee)
**Story Points**: 54 points
**Average**: 5.4 points per story

| Story ID | Title | Points | Priority | Status | Day |
|----------|-------|--------|----------|--------|-----|
| MGR-016 | Create Team Goals | 8 | P0 | ⬜ Not Started | 1-3 |
| MGR-015 | Assign Goals to Team | 5 | P0 | ⬜ Not Started | 2 |
| MGR-017 | Create Tasks from Goals | 5 | P0 | ⬜ Not Started | 8 |
| MGR-018 | Link Tasks to Goals | 3 | P0 | ⬜ Not Started | 8 |
| EMP-008 | View Daily Tasks | 8 | P0 | ⬜ Not Started | 6 |
| EMP-014 | View My Goals | 5 | P0 | ⬜ Not Started | 7 |
| EMP-015 | Update Goal Progress | 3 | P0 | ⬜ Not Started | 7 |
| EMP-009 | Complete Task | 5 | P0 | ⬜ Not Started | 9 |
| EMP-010 | Update Task Progress | 3 | P0 | ⬜ Not Started | 9 |
| EMP-016 | View "Why Chain" Context | 8 | P0 | ⬜ Not Started | 10 |

---

## 🎯 STORY 1: Create Team Goals

### **Story ID**: MGR-016
### **Story Points**: 8
### **Priority**: P0 (CRITICAL)
### **Persona**: Manager
### **Feature**: Goal Management
### **Implementation**: Days 1-3
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As a Manager
I want to create quarterly and weekly goals for my team
So that I can break down objectives into actionable targets that my team can execute
```

### **Context from Sprint 1**
- Backend: 100% complete (11 API endpoints, Goal model with 11 methods)
- Frontend: 0% complete (all 3 pages missing)
- Gap: Feature completely unusable despite backend being production-ready

### **Acceptance Criteria**

#### **AC-1**: Quarterly Goals Page Exists
- **Given** I am a manager logged into the system
- **When** I navigate to `/pages/quarterly-goals.html`
- **Then** I should see a page with the title "Quarterly Goals"
- **And** I should see a list of all quarterly goals for my team
- **And** I should see a "Create Goal" button at the top right
- **And** the page should load within 2 seconds

#### **AC-2**: Goals List Display
- **Given** I am viewing the quarterly goals page
- **When** the page loads
- **Then** I should see goals grouped by quarter (Q1, Q2, Q3, Q4)
- **And** each goal should display:
  - Goal title
  - Progress bar (0-100%)
  - Owner name and avatar
  - Status badge (On Track/At Risk/Completed)
  - Target value and unit
  - Due date
  - Actions menu (Edit/Delete/View Details)

#### **AC-3**: Goal Filters
- **Given** I am viewing the quarterly goals page
- **When** I use the filter controls
- **Then** I should be able to filter by:
  - Quarter (Q1/Q2/Q3/Q4/All)
  - Owner (All Team Members/Specific Person)
  - Status (All/On Track/At Risk/Completed)
- **And** the list should update immediately (< 500ms)
- **And** filter state should persist in URL query params

#### **AC-4**: Create Goal Modal Opens
- **Given** I am viewing the quarterly goals page
- **When** I click the "Create Goal" button
- **Then** a modal should open with the title "Create Quarterly Goal"
- **And** the modal should contain a form with the following fields:
  - Goal Title (text input, required)
  - Description (textarea, optional)
  - Parent Objective (dropdown, required)
  - Owner (dropdown, required)
  - Quarter (dropdown: Q1-Q4, required)
  - Target Value (number input, required)
  - Unit (text input, e.g., "%", "$", "count", required)
  - Start Date (date picker, auto-filled from quarter)
  - End Date (date picker, auto-filled from quarter)

#### **AC-5**: Form Validation
- **Given** I am filling out the "Create Goal" form
- **When** I click "Create" without required fields
- **Then** I should see validation errors:
  - "Goal title is required"
  - "Please select a parent objective"
  - "Please select an owner"
  - "Please select a quarter"
  - "Target value is required"
  - "Unit is required"
- **When** I enter a target value less than 0
- **Then** I should see "Target value must be positive"
- **When** all required fields are valid
- **Then** the "Create" button should be enabled

#### **AC-6**: Goal Creation Success
- **Given** I have filled out a valid "Create Goal" form
- **When** I click "Create"
- **Then** the system should call `POST /api/goals` with the form data
- **And** I should see a loading spinner on the button
- **And** upon success, the modal should close
- **And** I should see a success notification: "✅ Quarterly goal created successfully"
- **And** the new goal should appear in the goals list
- **And** the list should scroll to the new goal

#### **AC-7**: Weekly Goals Page
- **Given** I am viewing the quarterly goals page
- **When** I click the "Weekly Goals" tab
- **Then** I should be redirected to `/pages/weekly-goals.html`
- **And** I should see goals grouped by week (Week 1-52)
- **And** each weekly goal should show:
  - Goal title
  - Parent quarterly goal (breadcrumb)
  - Progress bar
  - Tasks count (e.g., "3 of 5 tasks completed")
  - Owner
  - Due date
  - "Add Tasks" button

#### **AC-8**: Create Weekly Goal from Quarterly
- **Given** I am viewing a quarterly goal details page
- **When** I click "Create Weekly Goal"
- **Then** a modal should open pre-filled with:
  - Parent Quarterly Goal (read-only, auto-filled)
  - Owner (inherited from quarterly goal)
  - Quarter (inherited from quarterly goal)
- **And** I should enter:
  - Goal Title (required)
  - Week Number (dropdown 1-13 within quarter, required)
  - Target Value (required)
  - Unit (inherited from quarterly goal)
- **And** on submit, the weekly goal should be created
- **And** it should appear under the parent quarterly goal

#### **AC-9**: Goal Details Page
- **Given** I am viewing the goals list
- **When** I click on a goal title or "View Details" button
- **Then** I should be redirected to `/pages/goal-details.html?id={goalId}`
- **And** I should see full goal information:
  - Goal title and description
  - Parent objective (breadcrumb, clickable)
  - Owner name and avatar
  - Progress (circular progress indicator)
  - Target value and current value
  - Status (On Track/At Risk/Completed)
  - Dates (start date, end date, days remaining)
  - Activity timeline (recent updates)
- **And** if quarterly goal, I should see child weekly goals list
- **And** if weekly goal, I should see tasks list
- **And** I should see action buttons: "Edit Goal", "Delete Goal", "Create Task from Goal"

### **Technical Requirements**

**Frontend**:
- Files: `quarterly-goals.html`, `weekly-goals.html`, `goal-details.html`
- Controllers: `quarterly-goals.js`, `weekly-goals.js`, `goal-details.js`
- API Client: `goals-api-client.js`
- Estimated Lines: ~1,650 total

**Backend (Reused)**:
- API: `GET /api/goals`, `POST /api/goals`, `GET /api/goals/:id`, `PUT /api/goals/:id`, `DELETE /api/goals/:id`
- Model: `Goal.js` (existing, 714 lines)
- No changes needed!

### **Test Cases**

1. **Happy Path**: Create quarterly goal → Appears in list → Click to view details
2. **Weekly Goal**: Create weekly from quarterly → Linked correctly → Progress rolls up
3. **Validation**: Submit with missing fields → Shows all errors
4. **Filter**: Filter by Q1 only → Shows Q1 goals only
5. **Sort**: Sort by progress → Goals ordered correctly
6. **Delete**: Delete goal → Confirmation → Goal removed
7. **Edit**: Edit goal details → Save → Changes reflected
8. **Loading**: Test with slow network → Shows loading states

### **Related Files**
- Backend: [Goal.js](../../../../server/models/Goal.js), [goals.js](../../../../server/routes/goals.js)
- Pattern: [objectives.html](../../../../client/pages/objectives.html)

---

## 🎯 STORY 2: Assign Goals to Team

### **Story ID**: MGR-015
### **Story Points**: 5
### **Priority**: P0 (CRITICAL)
### **Persona**: Manager
### **Feature**: Goal Assignment
### **Implementation**: Day 2
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As a Manager
I want to assign quarterly goals to specific team members
So that each person knows their individual quarterly targets
```

### **Acceptance Criteria**

#### **AC-1**: Owner Selection in Goal Creation
- **Given** I am creating a quarterly goal
- **When** I view the "Owner" dropdown
- **Then** I should see a list of all my team members
- **And** each member should show: Name, Avatar, Current Role
- **And** the list should be sorted alphabetically
- **And** I should be able to search/filter by name

#### **AC-2**: Multiple Goal Assignment
- **Given** I have created a quarterly goal
- **When** I want to break it into multiple weekly goals for different owners
- **Then** I should be able to create weekly goals with different owners
- **And** each owner should see only their assigned weekly goals

#### **AC-3**: Goal Visibility for Assignee
- **Given** I have assigned a goal to a team member
- **When** that team member logs in
- **Then** they should see the goal in their "My Goals" view
- **And** they should receive an in-app notification: "New goal assigned: {Goal Title}"
- **And** they should receive an email notification (optional)

#### **AC-4**: Reassign Goal Owner
- **Given** I am viewing a goal details page
- **When** I click "Edit Goal" → Change owner dropdown
- **Then** I should be able to select a different team member
- **And** on save, the goal should be reassigned
- **And** both old and new owners should receive notifications

#### **AC-5**: Bulk Goal Assignment
- **Given** I have created a quarterly goal
- **When** I want to assign it to multiple team members
- **Then** I should be able to select multiple owners (checkbox)
- **And** the system should create one goal instance per owner
- **And** all owners should receive notifications

### **Test Cases**

1. **Happy Path**: Assign goal to John → John sees it in his "My Goals"
2. **Reassign**: Change owner from John to Jane → Notifications sent to both
3. **Bulk**: Assign to 5 people → 5 goal instances created
4. **Notification**: Assign goal → Email sent (verify via logs)

---

## 🎯 STORY 3: Create Tasks from Goals

### **Story ID**: MGR-017
### **Story Points**: 5
### **Priority**: P0 (CRITICAL)
### **Persona**: Manager
### **Feature**: Task Creation
### **Implementation**: Day 8
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As a Manager
I want to create tasks that link to specific weekly goals
So that work is clearly connected to strategic objectives
```

### **Acceptance Criteria**

#### **AC-1**: Create Task Button Visible
- **Given** I am viewing a weekly goal details page
- **When** the page loads
- **Then** I should see a "Create Task from Goal" button
- **And** clicking it should open a "Create Task" modal

#### **AC-2**: Task Creation Modal
- **Given** I have clicked "Create Task from Goal"
- **When** the modal opens
- **Then** I should see a form with fields:
  - Task Title (text input, required)
  - Description (textarea, optional)
  - Parent Goal (dropdown, pre-filled with current goal, required)
  - Assignee (dropdown, required)
  - Due Date (date picker, required)
  - Priority (dropdown: High/Medium/Low, required)
  - Estimated Hours (number input, optional)
- **And** the "Parent Goal" field should be read-only

#### **AC-3**: Form Validation
- **Given** I am filling out the task creation form
- **When** I submit without required fields
- **Then** I should see validation errors
- **When** all fields are valid
- **Then** I should be able to submit

#### **AC-4**: Task Created Successfully
- **Given** I have submitted a valid task form
- **When** the API call succeeds
- **Then** the task should be created
- **And** the task should appear in the goal's tasks list
- **And** I should see: "✅ Task created and assigned to {Assignee Name}"
- **And** the modal should close

#### **AC-5**: Task-Goal Linkage
- **Given** a task has been created from a goal
- **When** I view the task details
- **Then** I should see the parent goal displayed (breadcrumb)
- **And** clicking the goal breadcrumb should navigate to goal details
- **When** I view the goal details
- **Then** I should see the task listed under "Tasks" section

#### **AC-6**: Bulk Task Creation
- **Given** I am viewing a weekly goal
- **When** I click "Create Multiple Tasks"
- **Then** I should be able to enter up to 10 task titles at once
- **And** all tasks should inherit: Parent Goal, Default Assignee, Default Due Date
- **And** on submit, all tasks should be created

### **Test Cases**

1. **Happy Path**: Create task from goal → Task appears in goal's task list
2. **Link**: Click task → View details → See goal breadcrumb
3. **Bulk**: Create 5 tasks at once → All created successfully
4. **Validation**: Submit empty form → Shows errors
5. **Assignment**: Create task assigned to John → John receives notification

---

## 🎯 STORY 4: Link Tasks to Goals

### **Story ID**: MGR-018
### **Story Points**: 3
### **Priority**: P0 (CRITICAL)
### **Persona**: Manager
### **Feature**: Task Linking
### **Implementation**: Day 8
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As a Manager
I want to link existing tasks to goals retrospectively
So that I can organize work under strategic objectives even if tasks were created first
```

### **Acceptance Criteria**

#### **AC-1**: Bulk Link Tasks to Goal
- **Given** I am viewing the tasks list page
- **When** I select multiple tasks (checkboxes)
- **And** I click "Link to Goal" button
- **Then** a dropdown should appear showing all quarterly and weekly goals
- **And** I should select a goal
- **And** on submit, all selected tasks should be linked to that goal

#### **AC-2**: Individual Task Link
- **Given** I am viewing a single task row
- **When** I hover over the task
- **Then** I should see a "Link to Goal" icon/button
- **When** I click it
- **Then** a dropdown should appear with goals
- **And** I should select a goal
- **And** the task should be linked immediately (no modal)

#### **AC-3**: Unlink Task from Goal
- **Given** a task is already linked to a goal
- **When** I click the "Unlink" button
- **Then** I should see a confirmation: "Remove link to goal? Task will remain but won't contribute to goal progress."
- **When** I confirm
- **Then** the link should be removed
- **And** the task should still exist (not deleted)

#### **AC-4**: API Integration
- **Given** I perform a link/unlink operation
- **When** the API call is made
- **Then** it should call `PUT /api/tasks/:id/link` with `goal_id`
- **Or** `PUT /api/tasks/:id/unlink`
- **And** on success, the UI should update immediately

### **Test Cases**

1. **Bulk Link**: Select 5 tasks → Link to Goal A → All 5 linked
2. **Individual Link**: Click link icon → Select Goal B → Task linked
3. **Unlink**: Click unlink → Confirm → Task unlinked
4. **Error**: Link to invalid goal → Shows error message

---

## 🎯 STORY 5: View Daily Tasks

### **Story ID**: EMP-008
### **Story Points**: 8
### **Priority**: P0 (CRITICAL)
### **Persona**: Employee
### **Feature**: Employee Dashboard
### **Implementation**: Day 6
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As an Employee
I want to see my daily tasks in a dashboard
So that I know what to work on today and can track my progress
```

### **Acceptance Criteria**

#### **AC-1**: Dashboard Page Exists
- **Given** I am an employee logged into the system
- **When** I navigate to `/pages/employee-dashboard.html`
- **Then** I should see my personalized dashboard
- **And** the page should load within 2 seconds
- **And** I should see a welcome message: "Welcome back, {First Name}!"

#### **AC-2**: Today's Tasks Section
- **Given** I am viewing the employee dashboard
- **When** the page loads
- **Then** I should see a section titled "Today's Tasks"
- **And** the section should have 3 columns:
  - To Do (tasks with status "not_started")
  - In Progress (tasks with status "in_progress")
  - Completed (tasks with status "completed" today)
- **And** each column should show task count in header (e.g., "To Do (5)")

#### **AC-3**: Task Card Display
- **Given** I am viewing the "Today's Tasks" section
- **When** I see a task card
- **Then** it should display:
  - Task title
  - Priority badge (High: Red, Medium: Yellow, Low: Green)
  - Due date (with countdown: "Due in 2 hours" or "Overdue by 1 day")
  - Parent goal name (small text, clickable)
  - Progress indicator (0-100%)
  - Quick complete checkbox (for tasks in "To Do" or "In Progress")

#### **AC-4**: Task Filtering
- **Given** I am viewing "Today's Tasks"
- **When** I use the filter dropdown
- **Then** I should be able to filter by:
  - All Tasks (default)
  - High Priority Only
  - Due Today
  - Overdue
  - My Goal (tasks linked to goals I own)
- **And** the columns should update immediately

#### **AC-5**: Task Status Change
- **Given** I am viewing a task in "To Do" column
- **When** I click the quick complete checkbox
- **Then** the task should move to "Completed" column with animation
- **And** I should see a brief success message: "✅ Task marked complete!"
- **And** the API should be called: `PUT /api/tasks/:id/complete`

#### **AC-6**: Drag and Drop (Optional - Nice to Have)
- **Given** I am viewing "Today's Tasks"
- **When** I drag a task from "To Do" to "In Progress"
- **Then** the task should move columns
- **And** the task status should update automatically
- **And** the API should be called: `PUT /api/tasks/:id/status`

#### **AC-7**: Empty State
- **Given** I have no tasks assigned
- **When** I view the dashboard
- **Then** I should see: "🎉 No tasks for today! Check back later or ask your manager for assignments."
- **And** I should see a button: "View My Goals"

#### **AC-8**: Loading State
- **Given** the dashboard is loading tasks
- **When** the API call is in progress
- **Then** I should see skeleton loaders in each column
- **And** the skeleton should resemble task cards

### **Test Cases**

1. **Happy Path**: Load dashboard → See tasks in 3 columns
2. **Complete Task**: Check checkbox → Task moves to Completed
3. **Filter**: Filter by High Priority → Only high priority tasks shown
4. **Empty**: No tasks → Shows empty state message
5. **Overdue**: Task overdue → Shows red "Overdue by X days"
6. **Loading**: Slow network → Shows skeleton loaders

---

## 🎯 STORY 6: View My Goals

### **Story ID**: EMP-014
### **Story Points**: 5
### **Priority**: P0 (CRITICAL)
### **Persona**: Employee
### **Feature**: Goal Visibility
### **Implementation**: Day 7
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As an Employee
I want to see all goals assigned to me on my dashboard
So that I understand my quarterly and weekly targets
```

### **Acceptance Criteria**

#### **AC-1**: My Goals Section Exists
- **Given** I am viewing the employee dashboard
- **When** I scroll below "Today's Tasks"
- **Then** I should see a section titled "My Goals Progress"
- **And** the section should display both quarterly and weekly goals

#### **AC-2**: Quarterly Goals Display
- **Given** I am viewing "My Goals Progress"
- **When** I see my quarterly goals
- **Then** each quarterly goal should show:
  - Goal title
  - Progress bar (0-100% with color: Green > 70%, Yellow 40-70%, Red < 40%)
  - Target value and current value (e.g., "75 / 100 units")
  - Due date (e.g., "Due Dec 31, 2025")
  - Status badge (On Track/At Risk/Completed)
- **And** goals should be sorted by due date (earliest first)

#### **AC-3**: Weekly Goals Display
- **Given** I am viewing "My Goals Progress"
- **When** I see my weekly goals
- **Then** each weekly goal should show:
  - Goal title
  - Parent quarterly goal (breadcrumb, small text)
  - Mini progress ring (circular, compact)
  - Tasks count (e.g., "3 of 5 tasks completed")
  - Due date
- **And** weekly goals should be grouped by week

#### **AC-4**: At-Risk Indicators
- **Given** I am viewing "My Goals Progress"
- **When** a goal is at risk (< 30% progress with < 30 days remaining)
- **Then** I should see a red "At Risk" badge
- **And** the goal card should have a red border
- **And** I should see a warning icon
- **And** hover tooltip: "This goal is behind schedule. Consider updating progress or discussing with your manager."

#### **AC-5**: Click to View Details
- **Given** I am viewing a goal card
- **When** I click on the goal title
- **Then** I should be redirected to `/pages/goal-details.html?id={goalId}`
- **And** I should see the full goal details page

#### **AC-6**: No Goals State
- **Given** I have no goals assigned
- **When** I view "My Goals Progress"
- **Then** I should see: "You don't have any goals assigned yet. Ask your manager to set up your quarterly targets."
- **And** I should see a button: "Learn About Goals"

### **Test Cases**

1. **Happy Path**: View dashboard → See all assigned goals
2. **Progress**: Goal at 75% → Shows green progress bar
3. **At Risk**: Goal at 20% with 20 days left → Shows "At Risk"
4. **Click**: Click goal → Redirected to details page
5. **Weekly**: View weekly goals → Grouped by week
6. **Empty**: No goals → Shows empty state

---

## 🎯 STORY 7: Update Goal Progress

### **Story ID**: EMP-015
### **Story Points**: 3
### **Priority**: P0 (CRITICAL)
### **Persona**: Employee
### **Feature**: Progress Tracking
### **Implementation**: Day 7
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As an Employee
I want to update progress on my goals
So that my manager and team can see my current status
```

### **Acceptance Criteria**

#### **AC-1**: Quick Update from Dashboard
- **Given** I am viewing my goal card on the employee dashboard
- **When** I hover over the progress bar
- **Then** I should see an "Update" icon/button
- **When** I click it
- **Then** an inline edit should appear:
  - Progress slider (0-100%)
  - Current value input (number)
  - Notes textarea (optional)
  - Save button
  - Cancel button

#### **AC-2**: Progress Slider Interaction
- **Given** I have opened the progress update inline edit
- **When** I drag the progress slider
- **Then** the percentage should update in real-time
- **And** the current value should auto-calculate based on target
- **Example**: Target = 100, Slider = 75% → Current Value = 75

#### **AC-3**: Progress Update Success
- **Given** I have updated the progress slider and entered a note
- **When** I click "Save"
- **Then** the API should be called: `PUT /api/goals/:id/progress`
- **And** on success, I should see: "✅ Progress updated successfully"
- **And** the progress bar should update immediately
- **And** the inline edit should close

#### **AC-4**: Progress Rollup to Parent
- **Given** I have updated a weekly goal progress
- **When** the save is successful
- **Then** the parent quarterly goal progress should automatically recalculate
- **And** the parent progress should be visible on my dashboard
- **And** my manager should see the updated progress in their view

#### **AC-5**: Progress Update from Goal Details Page
- **Given** I am viewing my goal details page
- **When** I click "Update Progress" button
- **Then** a modal should open with:
  - Current Progress (read-only display)
  - New Progress slider
  - Current value input
  - Notes textarea (required for significant changes > 20%)
  - Save button
- **And** on save, the modal should close
- **And** I should see the updated progress

#### **AC-6**: Progress Validation
- **Given** I am updating progress
- **When** I set progress to 100%
- **Then** I should be asked: "Mark this goal as completed?"
- **If** I confirm, the goal status should change to "completed"
- **When** I decrease progress (e.g., from 80% to 60%)
- **Then** I should be required to enter a note explaining why

### **Test Cases**

1. **Happy Path**: Update weekly goal to 50% → Parent quarterly updates
2. **Quick Update**: Inline edit from dashboard → Save → Updates immediately
3. **Validation**: Set to 100% → Prompted to mark complete
4. **Decrease**: Lower progress → Required to add note
5. **Error**: API fails → Shows error, doesn't update UI

---

## 🎯 STORY 8: Complete Task

### **Story ID**: EMP-009
### **Story Points**: 5
### **Priority**: P0 (CRITICAL)
### **Persona**: Employee
### **Feature**: Task Completion
### **Implementation**: Day 9
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As an Employee
I want to mark tasks as complete
So that my progress is tracked and my team has visibility into my work
```

### **Acceptance Criteria**

#### **AC-1**: Quick Complete from Dashboard
- **Given** I am viewing a task in "Today's Tasks" (To Do or In Progress)
- **When** I click the quick complete checkbox
- **Then** the task should immediately move to "Completed" column
- **And** I should see a success animation (e.g., task fades and slides)
- **And** the API should be called: `PUT /api/tasks/:id/complete`

#### **AC-2**: Complete with Notes (Optional)
- **Given** I am viewing a task details page
- **When** I click "Mark Complete" button
- **Then** a modal should open with:
  - Task title (read-only)
  - "Add completion notes" textarea (optional)
  - Checkbox: "Notify manager"
  - "Mark Complete" button
- **When** I click "Mark Complete"
- **Then** the task should be marked complete
- **And** the modal should close

#### **AC-3**: Task Status Change
- **Given** I have marked a task complete
- **When** the API call succeeds
- **Then** the task status should change to "completed"
- **And** the completion date should be set to now
- **And** the task should appear in my "Completed Tasks" list

#### **AC-4**: Progress Rollup to Goal
- **Given** I have completed a task linked to a weekly goal
- **When** the completion is saved
- **Then** the parent weekly goal progress should automatically recalculate
- **Example**: Goal has 5 tasks, 3 now completed → Goal progress = 60%
- **And** the parent quarterly goal progress should also update

#### **AC-5**: Celebration Feedback (Optional - Nice to Have)
- **Given** I have completed a task
- **When** the completion is successful
- **Then** I should see a celebration animation (confetti.js or similar)
- **And** I should see: "🎉 Great work! Task completed!"
- **And** if it's the last task for the day, I should see: "🎉 All tasks complete for today! Take a break."

#### **AC-6**: Undo Complete
- **Given** I have accidentally marked a task complete
- **When** I view the completed task
- **Then** I should see an "Undo" button (visible for 5 minutes)
- **When** I click "Undo"
- **Then** the task should return to "In Progress" status
- **And** the API should be called: `PUT /api/tasks/:id/uncomplete`

#### **AC-7**: Batch Complete
- **Given** I have multiple tasks selected (checkboxes)
- **When** I click "Mark All Complete"
- **Then** a confirmation should appear: "Mark 5 tasks as complete?"
- **When** I confirm
- **Then** all selected tasks should be marked complete
- **And** I should see: "✅ 5 tasks marked complete"

### **Test Cases**

1. **Happy Path**: Check checkbox → Task moves to Completed → Goal progress updates
2. **With Notes**: Click "Mark Complete" → Add notes → Save → Notes stored
3. **Rollup**: Complete task → Weekly goal updates → Quarterly goal updates
4. **Undo**: Complete task → Click Undo → Task returns to In Progress
5. **Batch**: Select 3 tasks → Mark all complete → All completed
6. **Last Task**: Complete last task of day → Shows special message

---

## 🎯 STORY 9: Update Task Progress

### **Story ID**: EMP-010
### **Story Points**: 3
### **Priority**: P0 (CRITICAL)
### **Persona**: Employee
### **Feature**: Progress Tracking
### **Implementation**: Day 9
### **Block**: 1 (Core Execution - REQUIRED)

### **User Story**
```
As an Employee
I want to update my task progress percentage
So that managers can see real-time status without waiting for completion
```

### **Acceptance Criteria**

#### **AC-1**: Progress Slider on Task Card
- **Given** I am viewing a task card
- **When** I hover over the progress indicator
- **Then** I should see an "Update Progress" button
- **When** I click it
- **Then** an inline edit should appear with:
  - Progress slider (0-100%)
  - Status dropdown (Not Started/In Progress/Completed/Blocked)
  - Notes textarea (optional)
  - Save and Cancel buttons

#### **AC-2**: Status Dropdown
- **Given** I am updating task progress
- **When** I open the status dropdown
- **Then** I should see 4 options:
  - Not Started (gray)
  - In Progress (blue)
  - Completed (green)
  - Blocked (red)
- **When** I select "Blocked"
- **Then** the notes field should become required
- **And** I should enter a blocker description

#### **AC-3**: Quick Progress Update
- **Given** I am viewing my task on the dashboard
- **When** I click directly on the progress bar
- **Then** a slider should appear inline
- **And** I can drag to new percentage
- **And** I can click "Save" without opening a modal

#### **AC-4**: Progress Update Success
- **Given** I have updated task progress
- **When** I click "Save"
- **Then** the API should be called: `PUT /api/tasks/:id/progress`
- **And** on success, I should see: "✅ Progress updated"
- **And** the progress bar should update immediately
- **And** the status badge should change color

#### **AC-5**: Blocked Task Workflow
- **Given** I have set a task status to "Blocked"
- **When** the save is successful
- **Then** my manager should receive a notification: "{Employee Name} blocked on task: {Task Title}"
- **And** the task should appear in manager's "Blocked Tasks" widget
- **And** the task card should have a red border
- **And** an alert icon should be visible

#### **AC-6**: Progress Validation
- **Given** I am updating progress
- **When** I set progress to 100%
- **Then** I should be asked: "Mark this task as completed?"
- **If** I confirm, the task should be marked complete
- **If** I cancel, progress stays at 100% but status remains "In Progress"

### **Test Cases**

1. **Happy Path**: Update progress to 50% → Saves successfully
2. **Quick Update**: Click progress bar → Drag slider → Save → Updates
3. **Blocked**: Set status to Blocked → Enter reason → Manager notified
4. **100% Progress**: Set to 100% → Prompted to complete
5. **Rollup**: Update task progress → Goal progress recalculates

---

## 🎯 STORY 10: View "Why Chain" Context

### **Story ID**: EMP-016
### **Story Points**: 8
### **Priority**: P0 (CRITICAL - Core to Assessment-Driven Model)
### **Persona**: Employee
### **Feature**: Task Lineage
### **Implementation**: Day 10
### **Block**: 1 (Core Execution) + 3 (Assessment System - optional for lineage)

### **User Story**
```
As an Employee
I want to see how my task connects to company objectives and the original assessment
So that I understand the impact of my work and stay motivated
```

### **Context**
This is a **critical missing story** identified in the user journey analysis. It closes the loop between assessments and daily execution, answering the question: "Why am I doing this task?"

### **Acceptance Criteria**

#### **AC-1**: Why Chain Breadcrumb Visible
- **Given** I am viewing a task details page
- **When** the page loads
- **Then** I should see a breadcrumb at the top:
  - Format: `Company OKR > Objective > Quarterly Goal > Weekly Goal > This Task`
  - Example: `Karvia 2025 > Improve Financial Strength > Increase Revenue 25% > Close 10 Deals Q1 > Contact 50 Leads > This Task`
- **And** each level should be clickable
- **And** the breadcrumb should be styled with arrow separators

#### **AC-2**: Click to View Level Details
- **Given** I am viewing the "Why Chain" breadcrumb
- **When** I click on "Quarterly Goal" level
- **Then** a modal should open showing:
  - Goal title
  - Goal description
  - Owner name and avatar
  - Progress (visual ring)
  - Target value and current value
  - Due date
  - "View Full Details" button (navigates to goal details page)

#### **AC-3**: Impact Indicator
- **Given** I am viewing my task
- **When** the "Why Chain" is displayed
- **Then** I should see a visual indicator:
  - Text: "Your task represents 0.4% of Quarterly Goal progress"
  - Icon: Small progress contribution indicator
  - Color: Green (contributing), Yellow (neutral), Red (behind)

#### **AC-4**: Assessment Context Tooltip
- **Given** the task is linked to an objective generated from an assessment
- **When** I hover over the "Objective" level in the breadcrumb
- **Then** I should see a tooltip:
  - "Generated from Q4 2025 SSI Assessment"
  - "Addresses Financial Strength gap (5.5/10)"
  - "Your work helps improve this dimension"
  - Link: "View Full Assessment Results"

#### **AC-5**: Mobile Responsive View
- **Given** I am viewing the "Why Chain" on a mobile device
- **When** the breadcrumb is too long for the screen
- **Then** the breadcrumb should collapse to a dropdown
- **And** I should see: "This Task ▼" (dropdown button)
- **When** I click the dropdown
- **Then** I should see all levels in a vertical menu

#### **AC-6**: Empty State (No Lineage)
- **Given** I am viewing a task that is not linked to any goal
- **When** the page loads
- **Then** I should see: "⚠️ This task is not connected to a goal yet"
- **And** I should see: "Ask your manager to link it to a goal to see how it contributes to company objectives"
- **And** I should see a button: "Learn About Goals"

#### **AC-7**: API Integration
- **Given** the "Why Chain" is being displayed
- **When** the page loads
- **Then** the system should call: `GET /api/tasks/:taskId/lineage`
- **And** the response should include:
  ```json
  {
    "task_id": "task_123",
    "task_title": "Contact 50 Leads",
    "weekly_goal": { "id": "goal_456", "title": "Close 10 Deals Q1", "progress": 40 },
    "quarterly_goal": { "id": "goal_789", "title": "Increase Revenue 25%", "progress": 35 },
    "objective": { "id": "obj_012", "title": "Improve Financial Strength", "progress": 28 },
    "assessment": { "id": "assess_345", "dimension": "strength", "score": 5.5 },
    "impact_percentage": 0.4
  }
  ```

#### **AC-8**: Backend API Creation (If Missing)
- **Given** the API endpoint `GET /api/tasks/:taskId/lineage` does not exist
- **When** it is created on Day 10
- **Then** it should:
  - Query the task → Find parent goal
  - Traverse: Task → Weekly Goal → Quarterly Goal → Objective → Assessment
  - Calculate impact percentage: (1 / total tasks in quarterly goal) * 100
  - Return lineage JSON
  - Handle null parents gracefully (return partial lineage)

### **Technical Requirements**

**Frontend**:
- Component: Reusable `<why-chain>` component
- Location: Can be used in task details page AND dashboard
- Estimated Lines: ~200 lines (component + styles)

**Backend (New API)**:
- API: `GET /api/tasks/:taskId/lineage`
- Controller: `server/routes/tasks.js` (add new endpoint)
- Service: `server/services/lineageService.js` (new file)
- Estimated Lines: ~150 lines

**Database (No Changes)**:
- Uses existing relationships:
  - Task.goal_id → Goal._id
  - Goal.parent_goal_id → Goal._id (quarterly)
  - Goal.objective_id → Objective._id
  - Objective.assessment_id → Assessment._id

### **Test Cases**

1. **Happy Path**: View task → See full lineage: Task → Goal → Quarterly → Objective → Assessment
2. **Partial Lineage**: Task with no goal → Shows "Not connected" message
3. **Impact**: Task is 1 of 10 in goal → Shows "10% impact"
4. **Tooltip**: Hover objective → Shows assessment context
5. **Click**: Click quarterly goal → Modal opens with details
6. **Mobile**: View on mobile → Breadcrumb becomes dropdown
7. **API**: Call lineage API → Returns correct hierarchy

### **Acceptance Test Script**

```gherkin
Feature: Why Chain Context Display

Scenario: Employee views task lineage
  Given I am logged in as an employee
  And I have a task "Contact 50 Leads" assigned to me
  And the task is linked to weekly goal "Close 10 Deals Q1"
  And the weekly goal is linked to quarterly goal "Increase Revenue 25%"
  And the quarterly goal is linked to objective "Improve Financial Strength"
  And the objective was generated from "Q4 2025 SSI Assessment" (Strength dimension)
  When I navigate to the task details page
  Then I should see the breadcrumb: "Karvia 2025 > Improve Financial Strength > Increase Revenue 25% > Close 10 Deals Q1 > Contact 50 Leads"
  And I should see "Your task represents 10% of Quarterly Goal progress"
  When I hover over "Improve Financial Strength"
  Then I should see tooltip: "Generated from Q4 2025 SSI Assessment - Addresses Financial Strength gap (5.5/10)"
  When I click on "Increase Revenue 25%"
  Then a modal should open showing the quarterly goal details
  And I should see the goal progress ring at 35%
```

---

## 📊 Story Dependencies

```
MGR-016 (Create Goals)
    ↓
MGR-015 (Assign Goals)
    ↓
EMP-014 (View My Goals)
    ↓
MGR-017 (Create Tasks from Goals)
    ↓
MGR-018 (Link Tasks to Goals)
    ↓
EMP-008 (View Daily Tasks)
    ↓
EMP-009 (Complete Task)
EMP-010 (Update Task Progress)
EMP-015 (Update Goal Progress)
    ↓
EMP-016 (View Why Chain) ← CRITICAL FINALE
```

---

## 🔗 Related Documentation

- [Sprint 2 Master Plan](./SPRINT_2_MASTER_PLAN.md)
- [User Stories Master](../../../../KARVIA_STRATEGY/1-PRODUCT/user-stories/USER_STORIES_MASTER.md)
- [Sprint 1 User Stories](../SPRINT_1/SPRINT_1_USER_STORIES.md)
- [MASTER_DEV_LIST.md](../../../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md)
- [MASTER_ISSUES_LIST.md](../../../../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md)

---

**Version**: 1.0.0
**Created**: November 12, 2025
**Status**: 🔴 Not Started
