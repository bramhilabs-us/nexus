# 🔍 SYSTEM DEPENDENCY & DESIGN CONSISTENCY AUDIT

**Version**: 1.0.0
**Date**: 2025-10-22
**Scope**: All 97 user stories across Week 1-12
**Purpose**: Identify dependencies, design inconsistencies, data flow gaps

---

## 📋 EXECUTIVE SUMMARY

**Audit Status**: 🟡 **8 CRITICAL GAPS FOUND** + 12 Design Inconsistencies

**Critical Findings**:
1. 🔴 **BLOCKING**: Approval workflow incomplete (EXEC approves plan, but no "Goals Become Active" trigger)
2. 🔴 **DATA LOSS RISK**: Task deletion doesn't cascade to progress updates
3. 🔴 **INCONSISTENCY**: Two different "View Objectives" stories (EMP-004 vs EXEC-003) with overlapping scope
4. 🔴 **MISSING LINK**: Manager creates tasks (MGR-017) but no story for "Employee gets notified"
5. 🔴 **GHOST DEPENDENCY**: Dashboard (Week 8) assumes tasks exist, but what if manager hasn't created any?
6. 🔴 **PROGRESS ROLLUP**: No automated progress calculation story (Task 100% → Weekly Goal auto-updates?)
7. 🔴 **PERMISSION GAP**: Who can edit objectives after AI generates them?
8. 🔴 **LINEAGE BREAK**: Assessment deleted → What happens to OKRs/Goals/Tasks derived from it?

---

## 🎯 DEPENDENCY CHAIN ANALYSIS

### **CHAIN 1: Assessment → OKR Generation** ✅ MOSTLY COMPLETE

```
CONS-001: Create Template (Week 1) ✅
    ↓
CONS-003: Send Invitation (Week 1) ✅
    ↓
EMP-001: Take Assessment (Week 1) ✅
    ↓
EMP-002: View Results (Week 1) ✅
    ↓
EXEC-002: Generate AI OKRs (Week 4) ⚠️ BUG ISS-W4-001
    ↓
❌ MISSING: EXEC approves OKRs → OKRs saved to Objectives collection
    ↓
EXEC-003: View All Company Objectives (Week 5) ⬜
```

**Issues Found**:
1. ✅ **EXEC-002 has bug**: Review page not displaying OKRs (ISS-W4-001) - **Fix Week 5 Day 1**
2. ❌ **MISSING STORY**: "EXEC Approve/Reject Individual OKRs"
   - **Current**: EXEC-002 says "Accept/Reject workflow (Week 5 Day 1 fix)"
   - **Problem**: No explicit story for approval UX
   - **Impact**: Where is "Approve All" button? Can exec edit before approving?
   - **Fix**: Add acceptance criteria to EXEC-002 or create EXEC-002B

3. ❌ **DESIGN INCONSISTENCY**: Where do approved OKRs go?
   - **Assumption**: Saved to `Objectives` collection
   - **Problem**: No story explicitly says "Save approved OKRs as Objectives"
   - **Risk**: Generated OKRs might not appear in EXEC-003 (View All Objectives)
   - **Fix**: Update EXEC-002 acceptance criteria: "Approved OKRs saved to Objectives collection with status='active'"

---

### **CHAIN 2: OKR → Team Assignment** 🟡 PARTIAL GAP

```
EXEC-002: Generate OKRs (Week 4) ⚠️
    ↓
❌ MISSING: Assign Objectives to Teams/Managers
    ↓
MGR-008: Track Objective Progress (Week 5)
    ↓
EMP-004: View My Objectives (Week 5)
```

**Issues Found**:
1. ❌ **CRITICAL GAP**: No story for "Assign Objective to Team/Manager"
   - **Problem**: AI generates company-wide objectives, but who assigns them to teams?
   - **Current Assumption**: Objectives have `owner_id` field (set during generation?)
   - **Questions**:
     - Does AI auto-assign objectives to managers based on department?
     - Does EXEC manually assign objectives after approval?
     - Can objectives be unassigned?
   - **Fix**: Add **EXEC-019: Assign Objectives to Teams** [Week 5, 3pts]
     - Acceptance: Select objective → Assign to team → Manager notified

2. ❌ **DESIGN INCONSISTENCY**: Two stories for viewing objectives
   - **EMP-004**: "View My Objectives" (filtered by user_id)
   - **EXEC-003**: "View All Company Objectives" (no filter)
   - **Problem**: What about MGR viewing team objectives?
   - **Current**: EMP-004 mentions "Team Objectives tab" (deferred to Week 10)
   - **Risk**: Managers can't see team objectives in Week 5
   - **Fix**: Add MGR-008 acceptance criteria: "Manager can view team objectives on Objectives page"

---

### **CHAIN 3: Quarterly Planning → Goal Creation** 🟡 APPROVAL GAP

```
EXEC-012: Create Yearly OKRs (Week 9)
    ↓
EXEC-013: Break into Quarterly Goals (Week 9)
    ↓
MGR-021: Create Quarterly Plans (Week 9)
    ↓
EXEC-011B: Approve Manager Quarterly Plans (Week 9) ⭐ NEW
    ↓
❌ MISSING: "Goals Become Active" trigger
    ↓
MGR-015: Assign Goals to Team (Week 7) ← ⚠️ WEEK MISMATCH
```

**Issues Found**:
1. ❌ **CRITICAL DEPENDENCY**: EXEC-011B approval doesn't explicitly activate goals
   - **EXEC-011B says**: "If Approve → Plan status='Approved', Manager notified, **Goals become active**"
   - **Problem**: What does "Goals become active" mean technically?
   - **Questions**:
     - Does it change goal.status from 'draft' to 'active'?
     - Does it trigger notifications to team members?
     - Can employees see goals before approval?
   - **Fix**: Add technical spec to EXEC-011B:
     ```javascript
     // When executive approves plan
     await QuarterlyPlan.findByIdAndUpdate(planId, {
       status: 'approved',
       approved_by: executiveId,
       approved_at: new Date()
     });

     // Activate all goals in the plan
     await Goal.updateMany(
       { plan_id: planId },
       { status: 'active', visible_to_team: true }
     );

     // Notify manager + team members
     await Notification.create({
       type: 'plan_approved',
       recipients: [managerId, ...teamMemberIds]
     });
     ```

2. ⚠️ **WEEK SEQUENCE ISSUE**: MGR-015 (Assign Goals) is Week 7, but approval is Week 9
   - **Problem**: Manager assigns goals (Week 7) before planning/approval workflow exists (Week 9)
   - **Interpretation**: Two different flows:
     - **Flow A**: Manager creates ad-hoc goals (Week 7) without formal planning
     - **Flow B**: Manager creates formal quarterly plan (Week 9) → Executive approves
   - **Risk**: Confusion - which flow to use?
   - **Fix**: Clarify in documentation:
     - Week 7: **Quick goal assignment** (tactical, no approval needed)
     - Week 9: **Formal quarterly planning** (strategic, requires executive approval)

---

### **CHAIN 4: Goal → Task Creation** ✅ COMPLETE (with 1 notification gap)

```
MGR-016: Create Team Goals (Week 7)
    ↓
MGR-017: Create Tasks from Goals (Week 7) ⭐ CRITICAL
    ↓
MGR-018: Link Tasks to Goals (Week 7)
    ↓
❌ MISSING: Notify employees when task assigned
    ↓
EMP-008: View Daily Tasks (Week 8)
```

**Issues Found**:
1. ❌ **NOTIFICATION GAP**: No story for "Employee receives task assignment notification"
   - **MGR-017**: Manager creates tasks, assigns to John
   - **EMP-008**: John views tasks on dashboard (Week 8)
   - **Problem**: How does John know he has a new task?
   - **Current Workaround**: EMP-013 "Task Reminders" (Week 8) - but this is for DUE tasks, not NEW tasks
   - **Fix**: Add to MGR-017 acceptance criteria:
     ```
     - [ ] When task assigned, employee receives in-app notification
     - [ ] Notification: "New task assigned: Fix payment gateway bug (Due: Friday)"
     - [ ] Email notification (if enabled in settings)
     ```

2. ✅ **DEPENDENCY CONFIRMED**: MGR-017 creates lineage
   - **MGR-017**: "Create Tasks from Goals" → Links task to goal
   - **EMP-016**: "View Why Chain" → Shows lineage breadcrumb
   - **Status**: ✅ Dependency correctly handled

---

### **CHAIN 5: Task Execution → Progress Rollup** 🔴 AUTOMATION GAP

```
EMP-008: View Daily Tasks (Week 8)
    ↓
EMP-009: Complete Task (Week 8)
    ↓
❌ MISSING: Automated progress rollup
    ↓
MGR-019: Track Goal Progress (Week 7) ← Should auto-update
    ↓
MGR-008: Track Objective Progress (Week 5) ← Should auto-update
```

**Issues Found**:
1. 🔴 **CRITICAL**: No automated progress rollup story
   - **EMP-009**: Employee marks task complete (status → 'completed')
   - **Expected**: Weekly goal progress auto-updates (3/5 tasks done → 60%)
   - **Problem**: No story says "System auto-calculates progress"
   - **Current**: MGR-019 "Track Goal Progress" implies manager VIEWS progress, not that it auto-calculates
   - **Risk**: Progress might be manual (manager has to update)
   - **Fix**: Add backend automation story or update MGR-019:
     ```javascript
     // Backend: After task completion
     taskRouter.post('/:taskId/complete', async (req, res) => {
       await Task.findByIdAndUpdate(taskId, { status: 'completed' });

       // AUTO-CALCULATE weekly goal progress
       const weeklyGoal = await Goal.findById(task.weekly_goal_id);
       const tasks = await Task.find({ weekly_goal_id: weeklyGoal._id });
       const completedTasks = tasks.filter(t => t.status === 'completed');
       const progress = (completedTasks.length / tasks.length) * 100;

       await Goal.findByIdAndUpdate(weeklyGoal._id, { progress });

       // ROLLUP to quarterly goal
       const quarterlyGoal = await Goal.findById(weeklyGoal.quarterly_goal_id);
       // ... similar calculation

       // ROLLUP to key result
       const keyResult = await KeyResult.findById(quarterlyGoal.key_result_id);
       // ... similar calculation
     });
     ```

2. ❌ **DESIGN INCONSISTENCY**: Manual vs Automated progress
   - **EMP-010**: "Update Task Progress" → Employee manually sets 50%, 75%
   - **EMP-009**: "Complete Task" → Sets to 100%
   - **Problem**: If task is 75% complete, does goal progress update?
   - **Fix**: Clarify: Progress rollup triggers on BOTH manual update (EMP-010) AND completion (EMP-009)

---

### **CHAIN 6: Dashboard Visibility** 🔴 GHOST DEPENDENCY

```
MGR-017: Create Tasks from Goals (Week 7)
    ↓
❌ GHOST CASE: What if manager creates NO tasks?
    ↓
EMP-008: View Daily Tasks (Week 8)
    → Shows empty state: "No tasks assigned yet"
```

**Issues Found**:
1. 🔴 **GHOST DEPENDENCY**: Dashboard assumes tasks exist
   - **Scenario**: Employee logs in Week 8, manager hasn't created tasks yet
   - **EMP-008 Acceptance Criteria**: Shows task list
   - **Problem**: No explicit "empty state" handling
   - **Fix**: Add to EMP-008:
     ```
     - [ ] Empty state: "No tasks assigned yet"
     - [ ] CTA button: "Talk to your manager" or "View team objectives"
     ```

2. ✅ **EMPTY STATE CONFIRMED**: EMP-004 has empty state
   - **EMP-004**: "Empty state: No objectives assigned yet"
   - **Good practice**: Should replicate to EMP-008, EMP-014

---

### **CHAIN 7: Intervention Workflow** ✅ COMPLETE

```
Cron job runs daily (8 AM)
    ↓
MGR-026: Intervention Workflow (Week 8) ⭐ NEW
    ↓
Manager receives alert: "John has 5 overdue tasks"
    ↓
Manager takes action: Reassign, Extend deadlines, Schedule 1:1
    ↓
Task status updated, employee notified
```

**Issues Found**:
1. ✅ **DEPENDENCY CONFIRMED**: MGR-026 is complete
   - Backend cron job, alert logic, intervention actions all specified
   - No gaps found

---

### **CHAIN 8: Approval Workflows** 🟡 PARTIAL

```
MGR-021: Manager creates quarterly plan (Week 9)
    ↓
EXEC-011B: Executive approves plan (Week 9) ⭐ NEW
    ↓
If approved → Goals become active
    ↓
If rejected → Manager edits, resubmits
```

**Issues Found**:
1. ❌ **MISSING**: What happens when executive requests changes?
   - **EXEC-011B**: "If Request Changes → Manager notified, Plan returns to MGR-021"
   - **Problem**: Does plan status change to 'changes_requested'?
   - **Fix**: Add to EXEC-011B model:
     ```javascript
     {
       status: 'draft' | 'pending_approval' | 'approved' | 'changes_requested',
       executive_comments: String, // "Focus more on reliability"
       revision_history: [{
         submitted_at: Date,
         executive_feedback: String,
         revised_at: Date
       }]
     }
     ```

---

## 🔴 CRITICAL GAPS SUMMARY

### **GAP 1: Approval → Activation Trigger** (P0)
- **Story**: EXEC-011B
- **Missing**: Technical spec for "Goals become active" after approval
- **Impact**: Goals approved but employees can't see them
- **Fix**: Add activation logic to EXEC-011B acceptance criteria

### **GAP 2: OKR Assignment to Teams** (P0)
- **Missing Story**: EXEC-019: Assign Objectives to Teams
- **Impact**: AI generates OKRs, but they're not assigned to anyone
- **Fix**: Add new story (3 points, Week 5)

### **GAP 3: Automated Progress Rollup** (P0)
- **Missing**: Backend automation for progress calculation
- **Impact**: Progress might require manual updates (not scalable)
- **Fix**: Add backend logic to task completion handler

### **GAP 4: Task Assignment Notification** (P1)
- **Missing**: Employee notification when task assigned
- **Impact**: Employees don't know they have new work
- **Fix**: Add to MGR-017 acceptance criteria

### **GAP 5: Permission System** (P1)
- **Missing**: Who can edit objectives after creation?
- **Questions**:
   - Can managers edit objectives assigned to them?
   - Can employees edit objectives they own?
   - Only executives?
- **Fix**: Create permission matrix document

### **GAP 6: Cascade Delete Logic** (P0)
- **Missing**: What happens when assessment deleted?
- **Scenario**: Assessment deleted → 50 OKRs, 200 goals, 1000 tasks derived from it
- **Options**:
   1. Prevent deletion (soft delete only)
   2. Cascade delete all derived data (dangerous)
   3. Orphan derived data (break lineage)
- **Fix**: Add data retention policy document

### **GAP 7: Empty State Handling** (P2)
- **Partial**: EMP-004 has empty state, EMP-008 doesn't explicitly mention it
- **Impact**: Poor UX when no data exists
- **Fix**: Add empty state to all "View" stories

### **GAP 8: Duplicate Goal Creation** (P1)
- **Question**: Can manager create goals from MGR-016 (Week 7) AND from quarterly planning MGR-021 (Week 9)?
- **Risk**: Two different goal creation flows = confusion
- **Fix**: Clarify distinction:
   - MGR-016: **Tactical goals** (quick, no approval)
   - MGR-021: **Strategic quarterly plan** (formal, requires approval)

---

## 🟡 DESIGN INCONSISTENCIES

### **INCONSISTENCY 1: Two "View Objectives" Stories**
- **EMP-004**: View My Objectives (filtered by user_id)
- **EXEC-003**: View All Company Objectives (no filter)
- **Issue**: What about managers viewing team objectives?
- **Current**: EMP-004 has "Team Objectives tab" but deferred to Week 10
- **Fix**: Add MGR-008B or update MGR-008 to include "View Team Objectives"

### **INCONSISTENCY 2: Progress Update Methods**
- **EMP-009**: Complete Task → 100%
- **EMP-010**: Update Task Progress → Manual % (50%, 75%)
- **MGR-020**: Update Goal Status → Status change (In Progress, Completed)
- **Issue**: Three different progress mechanisms
- **Fix**: Standardize: Tasks/Goals have both `progress %` and `status`

### **INCONSISTENCY 3: Notification Stories**
- **EMP-013**: Task Reminders (due date reminders)
- **MGR-014**: Task Notifications (team task updates)
- **Missing**: New task assignment notification
- **Fix**: Create unified notification system story

### **INCONSISTENCY 4: Assessment Health Views**
- **MGR-003**: View Team SSI Results (aggregate)
- **MGR-025**: View Team Assessment Health (with heatmap) ⭐ NEW
- **Issue**: Two stories for same functionality?
- **Difference**: MGR-003 is basic (Week 1), MGR-025 is advanced (Week 6)
- **Fix**: Clarify MGR-025 enhances MGR-003 (not replaces)

### **INCONSISTENCY 5: Team Member Management**
- **MGR-005**: Add Team Members
- **MGR-007**: Remove Team Member
- **Missing**: Edit team member role (change from EMPLOYEE to MANAGER)
- **Fix**: Add to MGR-005 or create MGR-005B

### **INCONSISTENCY 6: Goal Creation Timing**
- **Week 7**: MGR-015, MGR-016 (Create goals)
- **Week 9**: MGR-021 (Create quarterly plans)
- **Issue**: Can manager create goals twice?
- **Fix**: Document two distinct flows (see GAP 8)

### **INCONSISTENCY 7: Objective Owner Field**
- **EXEC-002**: AI generates objectives → Who is owner?
- **Assumption**: Executive? Manager? Auto-assigned by department?
- **Fix**: Update EXEC-002: "Executive sets objective owner during approval"

### **INCONSISTENCY 8: Assessment Scope**
- **CONS-001**: Template scope (Global vs Business-specific)
- **Issue**: Can business admins edit global templates?
- **Fix**: Add permission: Only template creator can edit

### **INCONSISTENCY 9: Lineage Display**
- **EMP-016**: "Why Chain" shows full lineage
- **Question**: Do managers/executives see "Why Chain" too?
- **Fix**: Clarify EMP-016 is reusable component (all personas can use)

### **INCONSISTENCY 10: Dashboard Filters**
- **EMP-008**: Filter by "All, Today, This Week, Overdue"
- **MGR-012**: Team dashboard filters (not specified)
- **Fix**: Standardize filters across personas

### **INCONSISTENCY 11: Deletion Handling**
- **MGR-007**: Remove team member → Objectives "Unassigned"
- **Question**: What about their tasks? Goals?
- **Fix**: Add cascade rules: Tasks reassigned to manager, Goals stay with team

### **INCONSISTENCY 12: Time Zones**
- **Missing**: All stories assume server time
- **Issue**: Global teams in different time zones
- **Fix**: Add timezone handling to date fields (due dates, deadlines)

---

## ✅ RECOMMENDED FIXES (Prioritized)

### **P0 - BLOCKING (Must fix before Week 5)**
1. ✅ **ISS-W4-001**: Fix AI OKR Review bug (Week 5 Day 1) - ALREADY PLANNED
2. ❌ **Add**: EXEC-011B activation logic (goals become active after approval)
3. ❌ **Add**: Automated progress rollup backend logic
4. ❌ **Add**: Cascade delete policy (prevent assessment deletion if OKRs exist)

### **P1 - HIGH (Fix during Week 5-6)**
5. ❌ **New Story**: EXEC-019: Assign Objectives to Teams [Week 5, 3pts]
6. ❌ **Update**: MGR-017 add task assignment notification
7. ❌ **Create**: Permission matrix document (who can edit what)
8. ❌ **Update**: Add empty states to EMP-008, EMP-014

### **P2 - MEDIUM (Fix during Week 7-9)**
9. ❌ **Clarify**: Two goal creation flows (tactical vs strategic)
10. ❌ **Update**: Standardize progress mechanisms
11. ❌ **Update**: Unified notification system
12. ❌ **Add**: Team member role editing

### **P3 - LOW (Fix during Week 10-12)**
13. ❌ **Add**: Timezone handling
14. ❌ **Clarify**: "Why Chain" reusable across personas
15. ❌ **Standardize**: Dashboard filters

---

## 📊 DEPENDENCY MATRIX

| Story | Depends On | Triggers | Potential Issues |
|-------|-----------|----------|------------------|
| EXEC-002 | EMP-002 | EXEC-003 | ⚠️ Bug ISS-W4-001 |
| EXEC-003 | EXEC-002 | - | ❌ OKR assignment missing |
| MGR-004 | - | MGR-005 | ✅ OK |
| MGR-005 | MGR-004 | MGR-006 | ✅ OK |
| MGR-017 | MGR-016 | EMP-008 | ❌ No notification |
| EMP-008 | MGR-017 | EMP-009 | ❌ Empty state not explicit |
| EMP-009 | EMP-008 | MGR-019 | ❌ Auto-rollup missing |
| EMP-016 | MGR-017, MGR-018 | - | ✅ OK |
| MGR-021 | EXEC-013 | EXEC-011B | ✅ OK |
| EXEC-011B | MGR-021 | MGR-015 | ❌ Activation logic missing |
| MGR-026 | EMP-009, MGR-019 | - | ✅ OK |

---

## 🔗 NEXT STEPS

### **Immediate Actions** (Before Week 5 starts):
1. ✅ Fix ISS-W4-001 (Week 5 Day 1 Morning) - ALREADY PLANNED
2. ❌ Update EXEC-011B with activation logic specification
3. ❌ Create backend automation spec for progress rollup
4. ❌ Add cascade delete policy document

### **During Week 5**:
5. ❌ Add EXEC-019: Assign Objectives to Teams (3pts)
6. ❌ Update MGR-017 with notification acceptance criteria
7. ❌ Create PERMISSION_MATRIX.md document

### **During Week 6-9**:
8. ❌ Clarify tactical vs strategic goal creation flows
9. ❌ Standardize notification system

### **Week 10-12 Polish**:
10. ❌ Add timezone support
11. ❌ Final consistency pass

---

## 📝 AUDIT CONCLUSION

**System Robustness**: 🟡 **85% Complete**

**Strong Points**:
- ✅ Assessment → OKR generation well-defined
- ✅ Task creation → Employee dashboard flow clear
- ✅ Intervention workflow (MGR-026) comprehensive
- ✅ Journey mapping exposed gaps early

**Weak Points**:
- 🔴 Approval → Activation trigger undefined
- 🔴 Progress rollup automation missing
- 🔴 OKR assignment workflow missing
- 🔴 Notification system incomplete

**Recommendation**: **Fix P0 issues before Week 5 Day 2**. P1 issues can be addressed during Week 5-6 implementation.

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Next Audit**: After Week 8 (re-audit dashboard dependencies)
