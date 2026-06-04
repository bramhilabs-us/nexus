# Sprint 5: Master Plan
**Date**: November 25, 2025
**Status**: Ready for Implementation
**Total Story Points**: 29-32
**Estimated Duration**: 6-7 days (48-56 hours)
**Prerequisites**: Sprint 4 complete (26/31 points)

---

## 📋 Executive Summary

**Sprint Goal**: Enhance OKR generation with configuration flexibility, implement milestone-based planning with task display, and enable consultant multi-company management.

**Key Principle**: Stick to the roots - maximum code reuse, minimal new infrastructure, focus on displaying existing data.

**Strategic Focus**:
1. **User Control**: Let users configure their OKR timeline and scope
2. **Data Visibility**: Show tasks under milestones (already created, just display)
3. **Consultant Scalability**: Enable managing multiple client companies

---

## 🎯 Sprint 5 Epics Overview

| Epic | Story Points | Duration | Priority | Status |
|------|-------------|----------|----------|--------|
| Epic 1: OKR Generation Configuration | 6-7 | 1.5-2 days | 🔥 High | Ready |
| Epic 0: Milestone-Based Planning Display | 8-10 | 1.5-2 days | 🔥 High | Ready |
| Epic 4: Consultant Management Dashboard | 15 | 3-4 hours | 🟡 Medium | Ready |

**Total**: 29-32 story points (48-56 hours)

---

## 🚀 Epic 1: OKR Generation Configuration

### Goal
Allow users to configure start date and period (quarterly/yearly) before generating OKRs

### Story Points: 6-7
### Duration: 1.5-2 days (12-16 hours)

### Features

#### Feature 1.1: SSI-Based Generation with Configuration
**User Story**: As a business owner, I want to choose when my OKRs start and whether they're quarterly or yearly, so I can align with my business cycle.

**Implementation**:
- Configuration modal before OKR generation (team-ssi-view.js)
- Date picker (default: tomorrow)
- Period selection: Quarterly (3 months) OR Yearly (12 months)
- Preview: "Your OKRs will cover Q1-Q4 2026"
- Backend accepts parameters (ai-okr.js)
- Store in company.okr_generation

**Acceptance Criteria**:
- ✅ User clicks "Generate OKRs" → Modal appears
- ✅ Can select start date and period
- ✅ Preview shows date ranges
- ✅ OKRs generated with configuration
- ✅ Configuration stored in company model

---

#### Feature 1.2: Manual Objective Generation with AI
**User Story**: As an executive, I want to describe an objective and have AI generate it with Key Results automatically, so I can quickly create OKRs without manual work.

**Implementation**:
- "Generate Complete OKR" button in objectives.html
- User enters objective description
- Selects start date and timeline
- AI creates objective + 3-5 KRs in one shot
- Preview modal for approval
- New endpoint: /api/ai-okr/generate-single-objective

**Acceptance Criteria**:
- ✅ User enters objective text
- ✅ Clicks "Generate Complete OKR"
- ✅ AI creates objective with KRs
- ✅ Preview modal shows result
- ✅ User approves and objective is created

---

### Reuse Strategy

**From Sprint 4 Epic 1 (objectives.html):**
- 60% Date picker HTML/CSS (lines 327-329)
- 70% Period selection UI (lines 245-280)
- 80% Modal pattern (lines 185-371)

**From Sprint 4 Epic 2 (objectives.html):**
- 50% AI integration pattern (lines 341-448)
- 60% Loading states and fallbacks

**New Code**: ~250 lines (across 5 files)
**Reused Code**: ~400 lines

**Reuse Ratio**: 60-70%

---

### Files Changed

| File | Current Lines | Changes | New Lines | Type |
|------|--------------|---------|-----------|------|
| `client/pages/scripts/team-ssi-view.js` | 943 | Add modal | +180 | Frontend |
| `server/routes/ai-okr.js` | 1300 | Add params + endpoint | +250 | Backend |
| `server/models/Company.js` | ~200 | Add fields | +10 | Model |
| `client/pages/objectives.html` | 732 | Add button + preview | +200 | Frontend |
| `client/pages/planning.html` | 1130 | Read config | +50 | Frontend |

**Total**: 5 files, ~690 new lines, 0 files deleted

---

### Dependencies

**Depends On:**
- ✅ Sprint 3 complete (DateService exists)
- ✅ Sprint 4 Epic 0 complete (planning.html exists)
- ✅ Sprint 4 Epic 1 complete (flexible dates exist)
- ✅ Sprint 4 Epic 2 complete (AI integration exists)

**Enables:**
- 🔜 Epic 0 (Planning page benefits from known period)
- 🔜 Future quarterly OKR regeneration

---

### Implementation Phases

**Phase 1: SSI-Based Configuration (4-5 hours)**
1. Configuration modal UI (2h)
2. Backend API update (2-3h)
3. Company model fields (15m)

**Phase 2: Manual Generation (3-4 hours)**
1. Generate button UI (1h)
2. Generate function with preview (2h)
3. Backend endpoint (1-2h)

**Phase 3: Planning Page Integration (2-3 hours)**
1. Fetch configuration (1h)
2. Use in quarter calculations (1-2h)

**Phase 4: Testing (2 hours)**
1. End-to-end testing
2. Edge case validation

---

## 📊 Epic 0: Milestone-Based Planning Display

### Goal
Display tasks under weekly goals (renamed "milestones") with interactive checkboxes and auto-calculated status

### Story Points: 8-10
### Duration: 1.5-2 hours (actual implementation)

### Key Insight
**85% already exists!** Just need to display existing data.

### What Exists (No Changes Needed)

✅ **Backend**:
- Tasks API endpoints: GET/POST/PUT/DELETE `/api/tasks`
- Tasks are created when generating weekly plans
- Parent-child relationship: weekly goals → tasks
- Status field exists on tasks

✅ **Data Model**:
- Task model with all required fields
- Links to weekly goals via `parent_goal_id`
- Completion tracking via `status` field

✅ **Frontend**:
- Planning page shows weekly goals
- Modal for viewing plan exists
- Week cards rendering exists

### What Needs to Be Added (15% - 6 Changes)

#### Change 1: Fetch Tasks (15 min)
**File**: `client/pages/planning.html`
**Location**: `viewExistingPlan()` function

```javascript
// BEFORE: Only fetch weekly goals
const goalsResponse = await fetch(`/api/planning/goals/weekly?key_result_id=${keyResultId}`);

// AFTER: Also fetch tasks for each goal
const goalsData = await goalsResponse.json();
for (const goal of goalsData.goals) {
  const tasksResponse = await fetch(`/api/tasks?parent_goal_id=${goal._id}`);
  const tasksData = await tasksResponse.json();
  goal.tasks = tasksData.tasks || [];
}
```

---

#### Change 2: Calculate Milestone Status (10 min)
**File**: `client/pages/planning.html`
**Function**: Add new helper

```javascript
function calculateMilestoneStatus(tasks) {
  if (!tasks || tasks.length === 0) return 'not_planned';

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  if (completed === total) return 'completed';
  if (completed > 0) return 'in_progress';
  return 'not_started';
}
```

---

#### Change 3: Display Tasks in Week Cards (30 min)
**File**: `client/pages/planning.html`
**Function**: `renderWeekCard()`

```javascript
// Add after line 1095 (after status display)

<!-- Tasks/Action Items -->
${goal.tasks && goal.tasks.length > 0 ? `
  <div class="mt-4 border-t border-gray-200 pt-3">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-medium text-gray-700">Action Items (${goal.tasks.filter(t => t.status === 'completed').length}/${goal.tasks.length})</span>
      <button onclick="toggleTasks('${goal._id}')" class="text-xs text-purple-600 hover:text-purple-700">
        <span id="toggle-icon-${goal._id}">▼</span> Show
      </button>
    </div>
    <div id="tasks-${goal._id}" class="hidden space-y-2 mt-2">
      ${goal.tasks.map(task => `
        <label class="flex items-start space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input type="checkbox"
            ${task.status === 'completed' ? 'checked' : ''}
            onchange="toggleTaskStatus('${task._id}', this.checked)"
            class="mt-1 h-4 w-4 text-purple-600 rounded border-gray-300">
          <span class="${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-700'}">
            ${task.title || task.name}
          </span>
        </label>
      `).join('')}
    </div>
  </div>
` : ''}
```

---

#### Change 4: Task Toggle Functionality (15 min)
**File**: `client/pages/planning.html`

```javascript
// Add new functions

function toggleTasks(goalId) {
  const tasksDiv = document.getElementById(`tasks-${goalId}`);
  const icon = document.getElementById(`toggle-icon-${goalId}`);

  if (tasksDiv.classList.contains('hidden')) {
    tasksDiv.classList.remove('hidden');
    icon.textContent = '▲';
  } else {
    tasksDiv.classList.add('hidden');
    icon.textContent = '▼';
  }
}

async function toggleTaskStatus(taskId, isCompleted) {
  try {
    const token = localStorage.getItem('karvia_token');
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: isCompleted ? 'completed' : 'not_started'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    // Refresh to recalculate milestone status
    await viewExistingPlan(currentKeyResultId);

  } catch (error) {
    console.error('Error updating task:', error);
    alert('Failed to update task status');
  }
}
```

---

#### Change 5: Update Status Icons (5 min)
**File**: `client/pages/planning.html`

```javascript
// BEFORE: Hardcoded status icons
<span class="status-icon ${goal.status === 'completed' ? 'complete' : 'in-progress'}">

// AFTER: Use calculated status
const milestoneStatus = calculateMilestoneStatus(goal.tasks);
<span class="status-icon ${milestoneStatus === 'completed' ? 'complete' : milestoneStatus === 'in_progress' ? 'in-progress' : 'not-started'}">
```

---

#### Change 6: Terminology Change (2 min)
**File**: `client/pages/planning.html`

```javascript
// Find and replace (4 occurrences)
"Weekly Goals" → "Milestones"
"Week" → "Milestone" (in certain contexts, keep "Week 1-12" labels)

// Example:
<h3>Create Weekly Goals</h3>  →  <h3>Create Milestones</h3>
```

---

### Summary of Changes

**All Changes in ONE File**: `client/pages/planning.html`

| Change | Description | Lines Added | Duration |
|--------|-------------|-------------|----------|
| 1 | Fetch tasks | ~15 | 15 min |
| 2 | Calculate status | ~10 | 10 min |
| 3 | Display tasks | ~30 | 30 min |
| 4 | Toggle functionality | ~35 | 15 min |
| 5 | Update icons | ~5 | 5 min |
| 6 | Terminology | ~0 (find/replace) | 2 min |

**Total New Code**: ~95 lines
**Total Time**: ~77 minutes (1.3 hours)

**Story Point Estimate**: 8-10 points accounting for testing and edge cases

---

### Reuse Strategy

**Existing Code Reused**:
- 100% Backend APIs (no changes)
- 100% Data model (no changes)
- 100% Planning page structure (just enhanced)
- 90% Week card rendering (just add tasks section)

**New Code**: ~95 lines
**Existing Code**: ~1,130 lines (entire planning.html)

**Reuse Ratio**: 92%

---

### Testing Checklist

- [ ] Tasks fetched correctly for each milestone
- [ ] Status calculated from task completion
- [ ] Tasks display in week cards
- [ ] Toggle show/hide works
- [ ] Checkbox updates task status
- [ ] Milestone status updates after task toggle
- [ ] Empty state (no tasks) displays correctly
- [ ] Mobile responsive

---

### Dependencies

**Depends On:**
- ✅ Sprint 3 complete (Tasks API exists)
- ✅ Sprint 4 Epic 0 complete (Planning page exists)
- 🔜 Epic 1 (Benefits from OKR configuration)

**Enables:**
- 🔜 Task-based progress tracking
- 🔜 Milestone completion automation

---

## 👥 Epic 4: Consultant Management Dashboard

### Goal
Enable consultants to manage multiple client companies by distinguishing between internal (own firm) and external (client) assessments and results

### Story Points: 15
### Duration: 3-4 hours
### Status: Deferred from Sprint 4

### Why Deferred from Sprint 4
- 🔴 3 Critical issues found that would break feature
- Backend API changes required (not in original estimate)
- team-ssi-view.js needs major rework for query parameters
- Null safety for consultants without own firm needed

### Implementation Phases

**Phase 1: Backend Changes (1.25 hours)**
1. Fix `/api/invitations/sent-by-me` to include company_id/company_name (30 min)
2. Verify JWT includes managed_businesses (15 min)
3. Update team-ssi-view.js for query parameter support (30 min)

**Phase 2: Frontend Changes (3.5 hours)**
1. Add internal/external sub-tabs to "Sent by Me" (45 min)
2. Rename "Team Results" → "Results" with sub-tabs (45 min)
3. Fetch and display managed companies (30 min)
4. Add null safety for consultants without firm (30 min)
5. Testing and bug fixes (1 hour)

---

### Files Changed

| File | Changes | Duration |
|------|---------|----------|
| `server/routes/invitations.js` | Add company_id to API response | 30 min |
| `server/middleware/authGuards.js` | Verify JWT payload | 15 min |
| `client/pages/scripts/team-ssi-view.js` | Support query parameters | 30 min |
| `client/pages/assessment-hub.html` | Internal/external tabs | 90 min |

---

### Reuse Strategy

**Existing Code Reused**:
- 100% Assessment hub structure
- 100% Tab navigation pattern
- 90% Results display logic (just add filtering)
- 80% Invitation display (just add company name)

**New Code**: ~200 lines
**Existing Code**: ~2,000 lines (assessment-hub + team-ssi-view)

**Reuse Ratio**: 90%

---

### Dependencies

**Depends On:**
- ✅ Sprint 3 complete (Consultant auth exists)
- ✅ Invitations API exists
- ✅ Assessment hub exists

**Enables:**
- 🔜 Consultant scalability (manage 10+ clients)
- 🔜 Multi-company analytics (future sprint)

---

## 📊 Sprint 5 Summary Dashboard

### Story Points Breakdown

```
Epic 1: OKR Configuration     [█████████░] 6-7 pts  (21-23%)
Epic 0: Milestones            [██████████] 8-10 pts (28-31%)
Epic 4: Consultant Dashboard  [███████████████] 15 pts (47%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:                        [████████████████████] 29-32 pts
```

### Duration Breakdown

```
Epic 1: Configuration         [███████░] 12-16 hrs (25-28%)
Epic 0: Milestones            [███░░░░░] 1.5-2 hrs (3-4%)
Epic 4: Consultant Dashboard  [████████] 4-5 hrs   (8-10%)
Testing & Integration         [████████] 4-5 hrs   (8-10%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Development:            48-56 hours (6-7 days)
```

### Reuse Metrics

| Epic | New Lines | Reused Lines | Reuse % |
|------|-----------|--------------|---------|
| Epic 1 | ~690 | ~400 | 60-70% |
| Epic 0 | ~95 | ~1,130 | 92% |
| Epic 4 | ~200 | ~2,000 | 90% |
| **Total** | **~985** | **~3,530** | **78%** |

**Key Takeaway**: 78% code reuse across all epics - "Sticking to the roots" ✅

---

## 🗓️ Recommended Implementation Order

### Week 1: Core Features

**Day 1-2: Epic 1 Configuration (12-16 hours)**
- High priority: Affects all OKR generation
- Foundation for planning
- Morning: SSI-based configuration (4-5h)
- Afternoon: Manual generation (3-4h)
- Next day: Planning integration + testing (4-5h)

**Day 3: Epic 0 Milestones (1.5-2 hours)**
- Quick win: Only 95 new lines
- Benefits from Epic 1 configuration
- Morning: Implementation (1.5h)
- Test immediately after Epic 1

**Day 4-5: Epic 4 Consultant Dashboard (4-5 hours)**
- Lower priority but high value
- Morning: Backend changes (1.25h)
- Afternoon: Frontend changes (3h)
- Buffer: Testing and refinement (1h)

**Day 6-7: Integration & Polish**
- End-to-end testing across all epics
- Bug fixes and refinements
- Documentation updates
- Deployment preparation

---

## 🎯 Success Criteria

### Sprint 5 is successful when:

**Epic 1:**
- ✅ 80%+ users configure OKR dates/period
- ✅ AI generates quality objectives with KRs
- ✅ Planning page correctly uses configuration
- ✅ Zero critical bugs

**Epic 0:**
- ✅ Tasks display under milestones
- ✅ Checkbox toggle updates status
- ✅ Milestone status auto-calculates
- ✅ Mobile responsive

**Epic 4:**
- ✅ Consultants see internal/external tabs
- ✅ Can switch between client companies
- ✅ Results display correctly per company
- ✅ Null-safe for consultants without firm

**Overall:**
- ✅ All epics deployed to production
- ✅ User feedback positive
- ✅ No regression bugs in existing features
- ✅ Performance remains good (<2s page loads)

---

## 🚨 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI generation quality | Medium | Medium | Template fallback exists |
| Date calculation bugs | Low | High | Reuse DateService (tested in Sprint 3) |
| Task display performance | Low | Medium | Pagination already exists |
| Consultant auth issues | Low | High | Use existing auth patterns |
| Configuration conflicts | Low | Medium | Company-level + per-objective flexibility |

**Overall Risk**: 🟢 **LOW** - Mostly reusing existing, tested code

---

## 📝 Documentation Requirements

### User Documentation

**Add to User Guide:**
1. OKR Configuration Guide
   - How to choose start date
   - Quarterly vs yearly decision guide
   - Manual objective generation tutorial

2. Milestone Planning Guide
   - Understanding milestones vs tasks
   - How to track action items
   - Status calculation explanation

3. Consultant Multi-Company Guide
   - Internal vs external assessments
   - Switching between companies
   - Viewing client results

### Developer Documentation

**Update Technical Docs:**
1. API Documentation
   - `/api/ai-okr/generate-from-company` parameters
   - `/api/ai-okr/generate-single-objective` endpoint
   - `/api/tasks` usage with milestones

2. Data Model Documentation
   - Company.okr_generation fields
   - Task model relationship
   - Milestone status calculation

3. Frontend Components
   - Configuration modal pattern
   - Task display component
   - Tab switching pattern

---

## 🔧 Technical Debt Addressed

**From Sprint 3/4:**
- ✅ OKR start date hardcoded (now configurable)
- ✅ Tasks created but not displayed (now visible)
- ✅ Consultants can't manage multiple companies (now supported)

**Created in Sprint 5:**
- ⚠️ Modal code in JS (should be separate component) - Defer to Sprint 6
- ⚠️ Task status enum in frontend (should use backend enum) - Defer to Sprint 6

**Total Debt**: Minimal, addressable in future sprints

---

## 🚀 Deployment Strategy

### Pre-Deployment Checklist

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] End-to-end tests pass (BST methodology)
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Staging environment validated
- [ ] Database backup created
- [ ] Rollback plan documented

### Deployment Order

1. **Backend First** (Zero Downtime)
   - Deploy Company model (additive fields)
   - Deploy ai-okr.js (parameters optional)
   - Deploy invitations.js (additive response fields)
   - Deploy tasks API enhancements

2. **Frontend Next**
   - Deploy team-ssi-view.js
   - Deploy objectives.html
   - Deploy planning.html
   - Deploy assessment-hub.html
   - Clear CDN cache

3. **Verification** (30 min monitoring)
   - Test OKR generation
   - Test manual objective creation
   - Test milestone display
   - Test consultant dashboard
   - Monitor error logs

### Rollback Plan

**If Critical Issues Occur:**

1. **Backend Rollback**
   - Revert route files (parameters are optional - graceful degradation)
   - Keep model changes (additive only, safe)

2. **Frontend Rollback**
   - Revert all frontend files
   - Clear CDN cache
   - System continues with defaults

3. **Database Rollback**
   - Not needed (additive schema changes only)

**Rollback Time**: <15 minutes

---

## 📈 Post-Sprint Metrics

**Track for 2 weeks:**

1. **Adoption Metrics**
   - % users configuring OKRs
   - Quarterly vs yearly ratio
   - AI generation usage rate
   - Milestone task completion rate
   - Consultant multi-company usage

2. **Performance Metrics**
   - Page load times (target: <2s)
   - API response times (target: <500ms)
   - AI generation time (target: <10s)
   - Task toggle responsiveness (target: <100ms)

3. **Quality Metrics**
   - Bug count (target: <5 non-critical)
   - User-reported issues (target: <10)
   - Support tickets (target: decrease by 30%)
   - User satisfaction (target: >4.5/5)

---

## 🎓 Lessons from Sprint 4

**Applied to Sprint 5:**

1. ✅ **Do comprehensive audits BEFORE coding**
   - Cancelled Epic 3 (13 pts saved)
   - Deferred Epics 5, 6 (16 pts saved)
   - Caught Epic 4 issues early (11 bugs prevented)

2. ✅ **Stick to the roots - maximum reuse**
   - Epic 0: 92% reuse (85% exists, just display)
   - Epic 1: 70% reuse (date pickers already built)
   - Epic 4: 90% reuse (assessment hub exists)

3. ✅ **Identify redundancy early**
   - Epic 3 had 70% overlap with planning.html
   - Epic 5 had 60% overlap with quarterly-goals.html
   - Epic 6 had 70% overlap with planning.html

4. ✅ **Validate data model alignment**
   - Goals are week-level, not day-level
   - Calendar view doesn't fit OKR methodology
   - Configuration aligns with existing DateService

**Result**: Sprint 5 is lean, focused, high-value, low-risk

---

## 🏁 Sprint Completion Checklist

### Planning Phase
- [x] Epics audited for flaws
- [x] Redundancy analysis complete
- [x] Implementation specs created
- [x] Master plan documented
- [ ] Team review and approval

### Development Phase
- [ ] Epic 1 implemented
- [ ] Epic 0 implemented
- [ ] Epic 4 implemented
- [ ] All tests passing
- [ ] Code reviewed

### Testing Phase
- [ ] Unit tests written
- [ ] Integration tests passing
- [ ] End-to-end BST tests passing
- [ ] Edge cases covered
- [ ] Performance validated

### Deployment Phase
- [ ] Staging validated
- [ ] Production deployed
- [ ] Post-deployment verification
- [ ] Monitoring setup
- [ ] Documentation updated

### Closure Phase
- [ ] Sprint retrospective
- [ ] Metrics collected
- [ ] Lessons documented
- [ ] Sprint 6 planning

---

## 🎯 Sprint 5 → Sprint 6 Handoff

**Completed Features:**
- OKR generation with configuration
- Milestone-based planning with tasks
- Consultant multi-company dashboard

**Foundation for Sprint 6:**
- OKR regeneration (with existing config)
- Advanced task management (deadlines, priorities)
- Multi-company analytics (consultant insights)
- Configuration templates (startup/enterprise modes)

**Technical Debt to Address:**
- Modal componentization
- Enum consistency (frontend/backend)
- Additional error handling

---

## ✅ Final Sprint 5 Status

**Ready for Implementation**: ✅ YES

**Confidence Level**: 🟢 HIGH
- Comprehensive audits completed
- No major flaws identified
- High code reuse (78%)
- Clear implementation path
- Realistic estimates

**Risk Level**: 🟢 LOW
- Additive changes only
- Reusing tested components
- Graceful degradation built-in
- Fast rollback capability

**Value Level**: 🔥 HIGH
- Addresses real user pain points
- Enables consultant scalability
- Improves planning workflow
- Foundation for future features

---

**Sprint 5 is ready to begin!**

**Prepared by**: Claude Code + Strategic Analysis
**Date**: November 25, 2025
**Next Action**: Team review and implementation start

