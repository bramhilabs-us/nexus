# 📖 SPRINT 2 USER STORIES

**Sprint**: Sprint 2 - Planning & Dashboard
**Duration**: November 17-28, 2025
**Last Updated**: November 12, 2025

---

## 🎯 EPIC: Goal Planning & Daily Execution

As an organization using Karvia Business, we need to efficiently convert our Key Results into actionable weekly goals and provide employees with clear daily task visibility, so that strategy translates into execution.

---

## 📋 USER STORIES

### 🔧 STORY 1: Fix Goal Hierarchy (P0 - CRITICAL)
**As a** system administrator
**I want** the Goal model to properly track parent-child relationships
**So that** quarterly and weekly goals are connected and queryable

#### Acceptance Criteria:
- [ ] Goal model has parent_goal_id field
- [ ] Goal model has child_goal_ids array
- [ ] Goal model has time_period field (QUARTERLY/WEEKLY)
- [ ] Goal model has key_result_id field
- [ ] Migration script updates existing goals
- [ ] Can query all weekly goals for a quarterly goal
- [ ] Can trace lineage from task to objective

#### Technical Notes:
```javascript
// Required fields to add:
parent_goal_id: ObjectId (ref: 'Goal')
child_goal_ids: [ObjectId] (ref: 'Goal')
time_period: String (enum: ['QUARTERLY', 'WEEKLY'])
key_result_id: ObjectId
```

**Story Points**: 3
**Priority**: P0 - BLOCKER
**Assigned**: Backend Developer

---

### 📊 STORY 2: Planning Page - KR Selection
**As a** manager/executive
**I want** to see all my objectives and Key Results on a planning page
**So that** I can select which KRs need planning

#### Acceptance Criteria:
- [ ] Planning page accessible from main navigation
- [ ] Objectives displayed as tabs
- [ ] KRs shown as cards under selected objective
- [ ] Each KR shows current vs target values
- [ ] Each KR shows planning status (X of 12 weeks planned)
- [ ] "Plan" button visible for each KR
- [ ] Visual progress indicator on each KR

#### UI Mockup:
```
[Revenue Growth] [Operational] [Culture] [Market]
┌─────────────────────────┐
│ KR: Increase MRR $2.5M  │
│ Current: $2.1M          │
│ Target: $2.5M           │
│ ████░░░░ 40% complete   │
│ 2 of 12 weeks planned   │
│ [📋 Plan Remaining]     │
└─────────────────────────┘
```

**Story Points**: 5
**Priority**: P0
**Assigned**: Frontend Developer

---

### 🤖 STORY 3: AI-Powered Plan Generation
**As a** manager
**I want** to generate weekly goal breakdowns using AI
**So that** I can quickly create intelligent, progressive plans

#### Acceptance Criteria:
- [ ] Can select timeline (1-12 weeks maximum)
- [ ] Can assign default owner from team members
- [ ] Click "Generate AI Plan" calls OpenAI
- [ ] AI returns weekly targets and tasks
- [ ] Plan shows progressive targets (slow start, accelerate)
- [ ] Each week has 3-5 specific tasks
- [ ] Can regenerate if not satisfied
- [ ] Loading state while generating

#### Technical Flow:
```javascript
// Request to OpenAI
{
  kr: "Increase MRR to $2.5M",
  current: 2100000,
  target: 2500000,
  weeks: 10
}

// Response structure
{
  weeks: [
    {
      week_number: 1,
      target: 2140000,
      tasks: ["Contact 10 leads", "Schedule 3 demos"]
    }
  ]
}
```

**Story Points**: 8
**Priority**: P0
**Assigned**: Full Stack Developer

---

### 👥 STORY 4: Goal Creation with Ownership
**As a** manager
**I want** to review and accept the generated plan
**So that** weekly goals are created with proper assignments

#### Acceptance Criteria:
- [ ] Preview shows all generated weeks
- [ ] Can change owner per week if needed
- [ ] "Create Goals" button saves to database
- [ ] Each goal has parent_goal_id set
- [ ] Each goal has time_period = 'WEEKLY'
- [ ] Each goal has key_result_id set
- [ ] KR status updates to show planning complete
- [ ] Success notification shown

**Story Points**: 5
**Priority**: P0
**Assigned**: Backend Developer

---

### 📱 STORY 5: Employee Dashboard - Today View
**As an** employee
**I want** to see my tasks for today with context
**So that** I know what to focus on and why

#### Acceptance Criteria:
- [ ] Dashboard shows logged-in user's name and date
- [ ] "Today" tab is default view
- [ ] Tasks grouped by priority (based on due time)
- [ ] Each task shows which KR it relates to
- [ ] Checkbox for quick task completion
- [ ] Completed tasks show at bottom
- [ ] Context bar shows current objective and KR
- [ ] Empty state if no tasks today

#### UI Layout:
```
Welcome, John | Tuesday, Jan 14 | Week 2 of Q1

Your Focus: Revenue Growth → MRR $2.5M → Close 3 Deals

TODAY'S TASKS (8)
HIGH PRIORITY
□ Review Q4 report | Due: 2pm
  └─ KR: MRR $2.5M
□ Call Acme Corp | Due: 3pm
  └─ KR: MRR $2.5M

COMPLETED (2)
✓ Team standup | Done: 9am
✓ Send emails | Done: 10am
```

**Story Points**: 8
**Priority**: P0
**Assigned**: Frontend Developer

---

### 📅 STORY 6: Employee Dashboard - Week View
**As an** employee
**I want** to see my entire week's tasks
**So that** I can plan ahead and track weekly progress

#### Acceptance Criteria:
- [ ] "This Week" tab shows Monday-Friday
- [ ] Tasks grouped by day
- [ ] Completed days collapsed by default
- [ ] Today highlighted and expanded
- [ ] Shows task count per day
- [ ] Progress bar for week completion
- [ ] Can expand/collapse each day
- [ ] Shows which tasks are overdue in red

**Story Points**: 5
**Priority**: P1
**Assigned**: Frontend Developer

---

### ✅ STORY 7: Real-Time Task Updates
**As an** employee
**I want** my task completions to immediately update the backend
**So that** progress is tracked in real-time

#### Acceptance Criteria:
- [ ] Checkbox click triggers API call
- [ ] Task status updates in database
- [ ] Weekly goal progress updates
- [ ] Quarterly goal progress updates
- [ ] KR progress updates (cascade up)
- [ ] Visual feedback on completion
- [ ] Error handling if update fails
- [ ] No page refresh required

#### Technical Flow:
```javascript
// On checkbox click
PUT /api/tasks/:taskId/complete
{
  completed: true,
  completed_at: Date.now()
}

// Cascade updates
Task → Weekly Goal → Quarterly Goal → Key Result
```

**Story Points**: 5
**Priority**: P0
**Assigned**: Backend Developer

---

### 🔍 STORY 8: Why Chain Visibility
**As an** employee
**I want** to see how my task connects to company objectives
**So that** I understand the importance of my work

#### Acceptance Criteria:
- [ ] Each task shows its parent KR
- [ ] Context bar shows full chain
- [ ] Lineage API returns complete hierarchy
- [ ] Can click to see full Why Chain
- [ ] Shows: Task → Weekly → Quarterly → KR → Objective
- [ ] Assessment score visible at top

#### Example Chain:
```
Assessment (7.5/10)
  └─ Objective: Revenue Growth 25%
      └─ KR: Increase MRR to $2.5M
          └─ Q1 Goal: Add $125K MRR
              └─ Week 2: Close 3 deals
                  └─ Task: Call Acme Corp
```

**Story Points**: 5
**Priority**: P1
**Assigned**: Full Stack Developer

---

### 🔐 STORY 9: User-Specific Filtering
**As an** employee
**I want** to see only my assigned work
**So that** I can focus on my responsibilities

#### Acceptance Criteria:
- [ ] Dashboard filters by logged-in user ID
- [ ] Only shows objectives where user is owner
- [ ] Only shows KRs assigned to user
- [ ] Only shows goals assigned to user
- [ ] Only shows tasks assigned to user
- [ ] No team or company-wide data visible
- [ ] Proper authorization checks

**Story Points**: 3
**Priority**: P0
**Assigned**: Backend Developer

---

### 📈 STORY 10: Progress Tracking
**As a** manager
**I want** to see planning and execution progress
**So that** I can track if we're on schedule

#### Acceptance Criteria:
- [ ] Planning page shows % of KRs planned
- [ ] Each KR shows weeks planned vs total
- [ ] Dashboard shows daily task completion %
- [ ] Dashboard shows weekly progress
- [ ] Visual indicators for on-track vs at-risk
- [ ] Progress bars with color coding

**Story Points**: 3
**Priority**: P1
**Assigned**: Frontend Developer

---

## 📊 STORY POINTS SUMMARY

| Developer | Stories | Points |
|-----------|---------|--------|
| Backend | 1, 4, 7, 9 | 16 |
| Frontend | 2, 5, 6, 10 | 21 |
| Full Stack | 3, 8 | 13 |
| **Total** | **10 stories** | **50 points** |

---

## 🎯 SPRINT GOALS

### Must Have (P0)
- Goal model fixed with relationships
- Planning page functional
- AI plan generation working
- Dashboard showing today's tasks
- Real-time updates working

### Should Have (P1)
- Week view on dashboard
- Why Chain visibility
- Progress tracking

### Nice to Have (P2)
- Animations and transitions
- Keyboard shortcuts
- Export functionality

---

## ✅ DEFINITION OF DONE

Each story is complete when:
1. Code is written and reviewed
2. Unit tests pass
3. Integration tests pass
4. Acceptance criteria met
5. Documentation updated
6. No console errors
7. Performance acceptable (<2s)
8. Deployed to staging

---

## 📝 DEPENDENCIES

- **BLOCKER**: Story 1 (Goal Model Fix) blocks all other stories
- Stories 2-4 must be completed sequentially (Planning flow)
- Stories 5-7 can be done in parallel (Dashboard)
- Story 8 depends on Story 1 (needs relationships)
- Story 9 required for Stories 5-6 (filtering)

---

**Sprint Velocity Target**: 50 points
**Team Size**: 2-3 developers
**Daily Velocity Required**: 5 points/day

*These user stories provide clear, testable requirements for Sprint 2 implementation with proper acceptance criteria and technical specifications.*