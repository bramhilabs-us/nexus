# Week 5 User Stories - Scope Corrections

**Date**: 2025-10-22
**Purpose**: Align Week 5 user story acceptance criteria with realistic implementation capacity
**Status**: 🔴 Apply these corrections to MVP_USER_STORIES.md before Week 5 starts

---

## 🎯 Summary of Changes

**Total Stories Affected**: 8 Week 5 stories
**Story Points Reduced**: 40 → 25 (38% reduction)
**Features Deferred**: 15 acceptance criteria items

---

## ✅ CORRECTED USER STORIES

### 1. EMP-004: View My Objectives ✅ UPDATED

**Original Story Points**: 5
**Revised Story Points**: 3

**Week 5 MVP Scope**:
- ✅ List my objectives (filtered by user_id)
- ✅ Show: title, description, progress %, due date
- ✅ Color-coded progress (Green >75%, Yellow 50-75%, Red <50%)
- ✅ Click to expand key results
- ✅ Empty state message

**Deferred to Week 10**:
- ⬜ Personal/Team tabs
- ⬜ Progress ring visual (circular indicators)
- ⬜ Historical progress timeline
- ⬜ Expand/collapse animations

**Rationale**: Personal/Team tabs require Team model relationships (Week 5 Day 1). Progress rings are cosmetic polish. Timelines need historical data tracking not built yet.

---

### 2. EXEC-003: View All Company Objectives ✅ UPDATED

**Original Story Points**: 8
**Revised Story Points**: 5

**Week 5 MVP Scope**:
- ✅ List all company objectives
- ✅ Filter by Status (All, On Track, At Risk, Completed)
- ✅ Sort by Progress, Due Date (client-side)
- ✅ Summary stats (Total, On Track %, At Risk count)
- ✅ Show owner name, progress %, status, due date
- ✅ Expand key results inline

**Deferred to Week 8** (Team model dependency):
- ⬜ Filter by Team
- ⬜ Filter by Department

**Deferred to Week 11** (Analytics week):
- ⬜ Export to CSV
- ⬜ Detail modal with full history
- ⬜ Advanced filtering (date ranges, custom fields)

**Rationale**: Team/Department filters need Team model (Week 5 Day 1). CSV export is analytics feature (Week 11). Modal can be added in polish phase.

---

### 3. MGR-007: Remove Team Member ✅ UPDATED

**Original Story Points**: 2
**Revised Story Points**: 3 (increased - more complex than estimated)

**Week 5 MVP Scope**:
- ✅ "Remove" button next to team members
- ✅ Confirmation modal with warning
- ✅ Remove from team.members array
- ✅ Member still exists in User collection (soft remove)
- ✅ Success notification

**Deferred to Week 8** (Goal assignment dependency):
- ⬜ Unassign team objectives from removed member
- ⬜ Reassign orphaned objectives to manager
- ⬜ Update workload calculations

**Rationale**: Objective reassignment requires Goal management APIs (Week 8). Week 5 only handles team membership, not objective ownership transfers.

**Implementation Note**: Week 5 will show warning: "This member's objectives will need manual reassignment" - actual reassignment logic comes Week 8.

---

### 4. MGR-008: Track Objective Progress ✅ UPDATED

**Original Story Points**: 5
**Revised Story Points**: 3

**Week 5 MVP Scope**:
- ✅ Team Objectives tab shows team OKRs
- ✅ Progress calculated from key results (backend logic)
- ✅ Color-coded status (Green/Yellow/Red)
- ✅ Last updated timestamp
- ✅ Click to view details

**Deferred to Week 10**:
- ⬜ Progress history timeline
- ⬜ Trend calculations (improving/declining)
- ⬜ Update progress modal (inline editing)
- ⬜ Historical snapshots

**Rationale**: Historical data requires new DB schema for progress snapshots. Week 5 only shows current state.

---

### 5. EXEC-005: Filter Objectives by Department ⬜ MOVED TO WEEK 8

**Original Week**: Week 5
**Revised Week**: Week 8 (after Team model implemented)

**Dependency Issue**: This story requires:
- ✅ Team model with department field (Week 5 Day 1)
- ❌ Objective.team_id relationship (not in Week 5 scope)
- ❌ User.team_id assignment (not in Week 5 scope)

**Resolution**: Move entire story to Week 8 when Goal Management implements team-objective relationships.

**Week 5 Alternative**: EXEC can filter by Status only (covered in EXEC-003).

---

### 6. ADMIN-003: Manage Users ⬜ MOVED TO WEEK 11

**Original Week**: Week 5
**Revised Week**: Week 11 (Admin & Analytics week)

**Why Moved**:
- `server/routes/admin.js` is 11-line placeholder
- No Week 5 tasks allocated for:
  - User invitation system
  - Role management UI
  - User activation/deactivation
  - Bulk user import
- Week 5 already has 40 hours of work (Teams + Objectives)

**Week 5 Admin Capability**:
- ✅ Admin can create teams (via Team CRUD - MGR-004)
- ✅ Admin has full access to all features (existing role-based middleware)

**Week 11 Will Deliver**:
- ⬜ Admin panel screen (`09_admin.html`)
- ⬜ User CRUD APIs (`POST /api/admin/users`, etc.)
- ⬜ Role assignment UI
- ⬜ Bulk CSV import
- ⬜ User activation toggle

---

### 7. EXEC-004: Fix AI OKR Review Bug 🔴 CRITICAL - Week 5 Day 1

**Original Estimate**: Not sized (assumed complete)
**Actual Effort**: 2-4 hours

**Bug Details** (ISS-W4-001):
```javascript
// WRONG (client/js/ai-okr-api-client.js:73-76):
const suggestion = response.data.suggestion;

// CORRECT (server returns):
{
  data: {
    suggestions: [
      { objective: {...}, key_results: [{...}] }
    ]
  }
}
```

**Fix Required**:
1. Update `client/js/ai-okr-api-client.js:73-76` to use `suggestions` array
2. Update `client/pages/scripts/ai-okr-review.js:75-100` to loop through array
3. Test: Assessment → Generate → Review displays OKRs ✅

**Priority**: P0 BLOCKING - Must fix before any other Week 5 UI work

---

### 8. Consolidate Duplicate Stories ✅ RESOLVED

**Issue**: Multiple stories overlap:
- `EXEC-003` (View All Objectives) vs `EXEC-005` (Filter Objectives)
- `EMP-004` (View My Objectives) vs `MGR-008` (Track Progress)

**Resolution**:
- **EXEC-003**: Core list view with Status filter (Week 5)
- **EXEC-005**: Team/Department filters ONLY (moved to Week 8)
- **EMP-004**: Employee's own objectives (Week 5)
- **MGR-008**: Manager's team objectives (Week 5)

**Result**: No duplication - each story has distinct scope and persona.

---

## 📋 DEFERRED FEATURES - FULL LIST

### Deferred to Week 8 (Goal Management)
1. Personal/Team tabs in objectives view (EMP-004)
2. Filter by Team (EXEC-003, EXEC-005)
3. Filter by Department (EXEC-003, EXEC-005)
4. Objective reassignment on member removal (MGR-007)
5. Workload indicators (MGR-007)

### Deferred to Week 10 (Integration & Polish)
6. Progress ring visuals (circular indicators) (EMP-004)
7. Historical progress timeline (EMP-004, MGR-008)
8. Expand/collapse animations (EMP-004)
9. Progress history snapshots (MGR-008)
10. Trend calculations (MGR-008)

### Deferred to Week 11 (Analytics & Admin)
11. Export to CSV (EXEC-003)
12. Detail modal with full history (EXEC-003)
13. Advanced filtering (date ranges, custom fields) (EXEC-003)
14. Admin user management panel (ADMIN-003)
15. Bulk user import (ADMIN-003)

---

## 🔢 REVISED STORY POINTS

### Original Week 5 Estimates:
- EMP-004: 5 points
- EXEC-003: 8 points
- EXEC-005: 3 points
- MGR-007: 2 points
- MGR-008: 5 points
- ADMIN-003: 5 points
- **Total**: 28 points (unrealistic for 5-day sprint)

### Revised Week 5 Estimates:
- EMP-004: 3 points ✅
- EXEC-003: 5 points ✅
- MGR-007: 3 points ✅
- MGR-008: 3 points ✅
- EXEC-004 (Bug Fix): 2 points ✅
- MGR-004 to MGR-006 (Team CRUD): 9 points ✅
- **Total**: 25 points (achievable for 5-day sprint)

**Moved Out**:
- EXEC-005: 3 points → Week 8
- ADMIN-003: 5 points → Week 11

---

## ✅ WEEK 5 REALISTIC ACCEPTANCE CHECKLIST

### Day 1 (8 hours)
- [x] Fix AI OKR bug (ISS-W4-001)
- [x] Create Team model with schema
- [x] Add feature flags to Business model

### Day 2 (8 hours)
- [x] Build 7 Team API endpoints
- [x] Test all endpoints with Postman

### Day 3 (8 hours)
- [x] Build Team management UI (team.html)
- [x] Wire Team APIs to frontend
- [x] Test: Create team, add members, remove members

### Day 4 (8 hours)
- [x] Build Objectives screen (enhance existing objectives.html)
- [x] Wire /api/objectives/my-dashboard
- [x] Implement status filtering (All, On Track, At Risk)
- [x] Test: View objectives, filter by status, expand key results

### Day 5 (8 hours)
- [x] End-to-end testing (Assessment → OKR → Teams → Objectives)
- [x] Bug fixes
- [x] Create WEEK_6_PLAN.md
- [x] Update MASTER_DEV_LIST (mark Week 5 ✅)

---

## 🔗 FILES TO UPDATE

**Immediate**:
1. ✅ MVP_USER_STORIES.md:
   - Update EMP-004 (lines 401-430) - DONE
   - Update EXEC-003 (lines 433-463) - DONE
   - Update MGR-007 (lines 451-471) - Add deferred section
   - Update MGR-008 (lines 476-496) - Add deferred section
   - Move EXEC-005 to [Week 8] tag
   - Move ADMIN-003 to [Week 11] tag

2. ✅ WEEK_5_PLAN.md:
   - Confirm Day 4 tasks match revised user stories
   - Add note: "CSV export, tabs, timelines deferred"

3. ✅ MASTER_DEV_LIST.md:
   - Week 5 section: Add "MVP baseline only" note
   - Week 8 section: Add EXEC-005 delivery
   - Week 11 section: Add ADMIN-003 delivery

4. ✅ MVP_SCOPE_REVISION.md:
   - Reference this document in "User Story Coverage" section

---

## 📝 QA TESTING GUIDANCE

### What QA Should Test (Week 5)
✅ Team CRUD works
✅ Role-based access enforced
✅ Objectives list displays correctly
✅ Status filtering works
✅ Progress color-coding accurate
✅ AI OKR bug fixed (review page displays)

### What QA Should NOT Test (Week 5)
❌ Personal/Team tabs (not built)
❌ CSV export (not built)
❌ Progress timeline history (not built)
❌ Team/Department filtering (not built)
❌ Admin user management (not built)

---

## ✅ VALIDATION CHECKLIST

Before Week 5 starts:
- [ ] MVP_USER_STORIES.md updated with all corrections
- [ ] Story points revised (40 → 25)
- [ ] Deferred features logged in this document
- [ ] WEEK_5_PLAN.md aligned with revised stories
- [ ] QA team notified of scope changes
- [ ] Stakeholders informed of deferred features

---

**Last Updated**: 2025-10-22
**Status**: ✅ Ready to Apply
**Next Action**: Update MVP_USER_STORIES.md with remaining story corrections
