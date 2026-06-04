# WEEK 7 ↔ WEEK 8 RESEQUENCE PROPOSAL

**Version**: 1.0.0
**Created**: 2025-10-22
**Status**: ✅ APPROVED BY USER
**Impact**: Medium (logical flow improvement)

---

## 🎯 EXECUTIVE SUMMARY

**Recommendation**: Swap Week 7 (Dashboard) with Week 8 (Goal Management)

**Why**: Users cannot view daily tasks on a dashboard before the goal/task creation system exists. Current sequence is backwards.

**Impact**:
- ✅ **Logical flow**: Create goals → View goals on dashboard (correct order)
- ✅ **User experience**: Dashboard displays actual data, not empty placeholders
- ✅ **Testing**: Can properly test dashboard with real goals/tasks
- ⚠️ **Breaking changes**: None (both weeks are future work, not started)

---

## 📊 CURRENT SEQUENCE (INCORRECT)

### Week 7: Dashboard
- EMP-008: View Daily Tasks
- EMP-009: Complete Task
- EMP-010: Update Task Progress
- EMP-011: View Task History
- EMP-012: Daily Reflection
- MGR-012: View Team Dashboard
- MGR-013: Monitor Team Tasks
- MGR-014: Task Notifications
- EXEC-009: Executive Dashboard Overview
- EMP-013: Task Reminders

**Problem**: Dashboard tries to show tasks that don't exist yet! ❌

---

### Week 8: Goal Management
- MGR-015: Assign Goals to Team
- MGR-016: Create Team Goals
- MGR-017: Create Tasks from Goals
- MGR-018: Link Tasks to Goals
- MGR-019: Track Goal Progress
- MGR-020: Update Goal Status
- MGR-026: Intervention Workflow (Alerts)
- EMP-014: View My Goals
- EMP-015: Update Goal Progress
- EMP-016: View "Why Chain" Context (CRITICAL)
- EXEC-010: Approve Company Goals
- EXEC-011: Cascade Goals to Teams

**Problem**: Tasks are created AFTER we tried to display them! ❌

---

## ✅ PROPOSED SEQUENCE (CORRECT)

### Week 7: Goal Management (MOVED FROM WEEK 8)
**Theme**: Create the execution chain (Goals → Tasks)

**User Stories** (12 stories):
- MGR-015: Assign Goals to Team
- MGR-016: Create Team Goals
- MGR-017: Create Tasks from Goals ← **Creates tasks**
- MGR-018: Link Tasks to Goals
- MGR-019: Track Goal Progress
- MGR-020: Update Goal Status
- MGR-026: Intervention Workflow (Alerts)
- EMP-014: View My Goals
- EMP-015: Update Goal Progress
- EMP-016: View "Why Chain" Context (CRITICAL)
- EXEC-010: Approve Company Goals
- EXEC-011: Cascade Goals to Teams

**Deliverables**:
- ✅ Goal model (Quarterly, Weekly)
- ✅ Task model
- ✅ API endpoints for goal/task CRUD
- ✅ Planning screen (create goals)
- ✅ Task creation from goals
- ✅ Lineage tracking (Assessment → OKR → Goal → Task)

**Dependencies**: Week 5 (Teams), Week 6 (Profile)

---

### Week 8: Dashboard (MOVED FROM WEEK 7)
**Theme**: Display the execution chain (View tasks, track progress)

**User Stories** (10 stories):
- EMP-008: View Daily Tasks ← **Now tasks exist!** ✅
- EMP-009: Complete Task
- EMP-010: Update Task Progress
- EMP-011: View Task History
- EMP-012: Daily Reflection
- MGR-012: View Team Dashboard
- MGR-013: Monitor Team Tasks
- MGR-014: Task Notifications
- EXEC-009: Executive Dashboard Overview
- EMP-013: Task Reminders

**Deliverables**:
- ✅ Dashboard page with real task data
- ✅ Task completion workflow
- ✅ Progress tracking
- ✅ Team dashboard views
- ✅ Notifications system

**Dependencies**: Week 7 (Goals + Tasks must exist)

---

## 🔗 DEPENDENCY CHAIN (AFTER RESEQUENCE)

```
Week 1-4: Assessment System ✅
         ↓
Week 5: Teams + Objectives ✅
         ↓
Week 6: Profile Management ✅
         ↓
Week 7: Goal Management (CREATE execution chain) ✅ NEW ORDER
         ↓
Week 8: Dashboard (DISPLAY execution chain) ✅ NEW ORDER
         ↓
Week 9: Planning (Strategic planning) ✅
         ↓
Week 10-12: Integration + Analytics ✅
```

---

## 📝 RATIONALE

### Why This Order Makes Sense

1. **Data First, Display Second**
   - Week 7: Create goals and tasks (data layer)
   - Week 8: Display goals and tasks (presentation layer)

2. **Testing Logic**
   - Cannot test dashboard without real data
   - Dashboard E2E tests will fail if no tasks exist

3. **User Journey**
   - Manager creates quarterly goal (Week 7)
   - Manager creates tasks from goal (Week 7)
   - Employee sees tasks on dashboard (Week 8) ← **NOW LOGICAL** ✅

4. **EMP-016 "Why Chain" Context**
   - This critical story (P0) shows task → goal → OKR lineage
   - Must be implemented BEFORE dashboard displays tasks
   - Otherwise dashboard has broken breadcrumbs

5. **Alignment with MVP Scope**
   - Assessment-driven model: Assessment → OKR → Goal → Task
   - Week 7 completes the creation chain
   - Week 8 visualizes the completed chain

---

## ⚠️ IMPACT ANALYSIS

### Breaking Changes
**None** - Both weeks are future work (Week 5 is current week)

### Documentation Updates Required
1. ✅ MASTER_DEV_LIST.md - Swap Week 7 ↔ Week 8 sections
2. ✅ MVP_USER_STORIES.md - Update week references (already updated in v3.1.0)
3. ⬜ Create WEEK_7_PLAN.md (Goal Management, not Dashboard)
4. ⬜ Create WEEK_8_PLAN.md (Dashboard, not Goal Management)

### Code Impact
**None** - No code written for Week 7-8 yet

### Team Communication
- Inform team: Week sequence changed for logical flow
- Update project board (if using Jira/Linear)
- No timeline impact (both weeks still 5 days each)

---

## 📅 UPDATED WEEK BREAKDOWN

| Week | Theme | Stories | Points | Duration |
|------|-------|---------|--------|----------|
| Week 1-4 | Assessment System | 15 | 45 | 20 days ✅ |
| Week 5 | Teams + Objectives | 12 | 25 | 5 days ⬜ |
| Week 6 | Profile Management | 10 | 18 | 5 days ⬜ |
| **Week 7** | **Goal Management** (was Week 8) | **12** | **28** | **5 days** ⬜ |
| **Week 8** | **Dashboard** (was Week 7) | **10** | **22** | **5 days** ⬜ |
| Week 9 | Planning | 13 | 30 | 5 days ⬜ |
| Week 10-12 | Integration, Analytics, Admin | 22 | 50 | 15 days ⬜ |

**Total**: 97 stories, ~220 points, 60 days

---

## ✅ APPROVAL

**User Decision**: ✅ YES - Proceed with resequencing

**Date**: 2025-10-22

**Next Steps**:
1. ✅ Update MASTER_DEV_LIST.md
2. ✅ Create Week 7 detailed plan (Goal Management)
3. ✅ Create Week 8 detailed plan (Dashboard)
4. ✅ Link resequence proposal from CLAUDE_ONBOARDING_GUIDE

---

## 🔗 RELATED DOCUMENTATION

- [MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md) - Will be updated with new sequence
- [MVP_USER_STORIES.md](./01_MVP/MVP_USER_STORIES.md) - Already updated in v3.1.0
- [USER_JOURNEYS_MASTER.md](./01_MVP/User_Stories/USER_JOURNEYS_MASTER.md) - Original analysis
- [WEEK_5_PLAN.md](./Daily_Handoffs/Week_5/WEEK_5_PLAN.md) - Current week

---

**Version**: 1.0.0
**Status**: ✅ APPROVED
**Last Updated**: 2025-10-22
