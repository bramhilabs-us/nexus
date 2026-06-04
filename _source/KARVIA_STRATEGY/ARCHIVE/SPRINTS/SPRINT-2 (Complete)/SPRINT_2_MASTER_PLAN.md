# 📋 SPRINT 2 MASTER PLAN - FINAL (REVISED)

**Sprint Name**: Goal Hierarchy Fix + Planning Page + Employee Dashboard
**Duration**: 10 Days (November 17-28, 2025)
**Version**: FINAL v3.0 (Post Gap Analysis)
**Status**: Ready for Execution with Critical Fixes
**Last Updated**: November 12, 2025

## ⚠️ CRITICAL UPDATES FROM GAP ANALYSIS

### Must Fix Before Starting:
1. **Goal Model Schema Bug** - BLOCKS ENTIRE SPRINT
2. **Sprint 1 Incomplete Items** - 85% complete, finish critical pieces
3. **Missing 7 APIs** - Must create for test coverage
4. **Technical Spec Corrections** - Fix incorrect file references

---

## 🎯 SPRINT OBJECTIVES

### Primary Deliverables
1. **Fix Goal Model** - Add parent-child relationship fields (P0 CRITICAL)
2. **Planning Page** - AI-powered KR to weekly goal conversion
3. **Employee Dashboard** - Task-centric view with Why Chain
4. **Complete Lineage** - Full traceability from Task → Objective

### Business Value
- **Time Saved**: Planning reduced from 2 hours to 5 minutes per KR
- **Clarity**: Every employee knows exactly what to do and why
- **Automation**: AI generates intelligent weekly breakdowns
- **Visibility**: Complete cascade from strategy to execution

---

## 🚨 CRITICAL PREREQUISITE - GOAL MODEL FIX

### The Problem (Discovered in Deep Dive)
```javascript
// API writes these fields but they DON'T EXIST in schema:
parent_goal_id: quarterlyGoal._id    // ❌ NOT IN SCHEMA
child_goal_ids: []                   // ❌ NOT IN SCHEMA
time_period: 'WEEKLY'                // ❌ NOT IN SCHEMA
key_result_id: krId                  // ❌ NOT IN SCHEMA
```

### The Fix (Day 1 Priority)
```javascript
// Add to Goal.js schema:
const goalSchema = new Schema({
  // ... existing fields ...

  // NEW FIELDS - REQUIRED FOR SPRINT 2
  parent_goal_id: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
    index: true
  },
  child_goal_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'Goal'
  }],
  time_period: {
    type: String,
    enum: ['QUARTERLY', 'WEEKLY', 'MONTHLY'],
    required: true,
    default: 'QUARTERLY'
  },
  key_result_id: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  }
});
```

---

## 📅 10-DAY EXECUTION PLAN

### Day 1: CRITICAL FIX + Foundation (Nov 17)
**Priority 1 (BLOCKER)**: Goal Model Fix - 4 hours
- Add 4 missing fields to Goal schema
- Create and run migration script
- Test hierarchy queries work
- Verify parent-child relationships

**Priority 2**: Complete Sprint 1 Critical Items - 3 hours
- Fix ISS-S1D8-002: Timeline logic
- Fix ISS-S1D8-003: Target year input
- Complete team results heatmap frontend
- Fix password reset UI (if time)

**Priority 3**: Verification - 1 hour
- Verify Goal model changes work
- Test existing Goal APIs still function
- Confirm no regression issues

**Deliverable**: Goal model fixed, Sprint 1 critical items complete

---

### Day 2: Planning Backend APIs (Nov 18)
**Priority 1**: Create Planning Service - 4 hours
- Create /server/routes/planning.js
- POST /api/planning/generate-plan endpoint
- Extend existing aiOKRService.js (NOT create new)
- Add generateWeeklyPlan method

**Priority 2**: Create Goals from Plan - 2 hours
- POST /api/planning/create-goals endpoint
- Transaction support for bulk creation
- Set all parent-child relationships

**Priority 3**: Test Integration - 2 hours
- Test with existing OpenAI service
- Verify weekly breakdown generation
- Confirm parent_goal_id properly set

**Deliverable**: 2 planning APIs complete and tested

---

### Day 3: Planning Frontend (Nov 19)
- Create planning.html page
- Objective tabs navigation
- KR cards with progress
- Planning form interface
- Owner selection from teams

**Deliverable**: Planning page UI complete

---

### Day 4: Planning Integration (Nov 20)
- Connect to OpenAI API
- Display generated plans
- Create weekly goals with relationships
- Update KR planning status
- Test full planning flow

**Deliverable**: Planning page fully functional

---

### Day 5: Dashboard Backend (Nov 21)
- Create dashboard API endpoints
- Filter by logged-in user
- Aggregate objectives, KRs, goals, tasks
- Implement Why Chain queries
- Optimize with indexes

**Deliverable**: Dashboard data layer ready

---

### Day 6: Dashboard Frontend (Nov 22)
- Create dashboard.html
- Today/This Week tabs
- Task list with priorities
- Context bar with objective/KR
- Checkbox interactions

**Deliverable**: Dashboard UI complete

---

### Day 7: Dashboard Integration (Nov 25)
- Connect to backend APIs
- Real-time task updates
- Progress cascade up hierarchy
- Tab switching logic
- Error handling

**Deliverable**: Dashboard fully functional

---

### Day 8: Integration Testing (Nov 26)
- End-to-end flow testing
- Create objective → Plan KRs → Generate goals → Create tasks
- Verify all relationships
- Test user filtering
- Performance testing

**Deliverable**: Integrated system working

---

### Day 9: Polish & Optimization (Nov 27)
- Fix discovered bugs
- UI/UX improvements
- Loading states
- Error messages
- Cross-browser testing

**Deliverable**: Production-ready features

---

### Day 10: Documentation & Deployment (Nov 28)
- User documentation
- Technical documentation
- Deployment to staging
- Sprint retrospective
- Demo preparation

**Deliverable**: Sprint 2 complete!

---

## ✅ TEST COVERAGE MAPPING

### Day-by-Day Test Coverage Achievement

| Day | Implementation | Test Cases Covered | Coverage % |
|-----|---------------|-------------------|------------|
| Day 1 | Goal Model Fix | TC-1.2, TC-1.3, TC-1.4 | 20% |
| Day 2 | Planning APIs | TC-1.2, TC-1.3 | 33% |
| Day 3 | Planning UI | TC-1.2 | 40% |
| Day 4 | Dashboard | TC-2.1, TC-2.2 | 53% |
| Day 5 | Sprint 1 Items | TC-1.1 | 60% |
| Day 6 | Lineage APIs | TC-1.4, TC-2.2 | 73% |
| Day 7 | Integration | TC-3.1, TC-3.3 | 86% |
| Day 8-10 | Testing | TC-4.1, TC-4.2, TC-5.1, TC-5.2, TC-6.1, TC-6.2 | 100% |

### P0 Test Cases (MUST PASS)
- TC-1.1 to TC-1.4: Full cascade creation ✅
- TC-2.1 to TC-2.2: Dashboard and updates ✅
- TC-5.1 to TC-5.2: Regression testing ✅
- TC-6.1 to TC-6.2: Security ✅

### P1 Test Cases (SHOULD PASS)
- TC-3.1: Overdue tasks ✅
- TC-3.3: Employee deactivation ⚠️

### P2 Test Cases (NICE TO HAVE)
- TC-3.2: Mid-quarter replanning ❌ (deferred)
- TC-4.1 to TC-4.2: Performance testing ⚠️ (basic only)

---

## 🚨 RISK MITIGATION (Based on Gap Analysis)

### Critical Risks & Mitigations

1. **Goal Model Schema Bug**
   - **Risk**: Entire sprint blocked
   - **Mitigation**: Fix on Day 1 morning (4 hours max)
   - **Fallback**: If > 4 hours, escalate immediately

2. **Sprint 1 Dependencies**
   - **Risk**: Missing functionality for Sprint 2
   - **Mitigation**: Complete critical items Day 1
   - **Accept**: 85% completion is sufficient

3. **OpenAI Service Confusion**
   - **Risk**: Creating duplicate service
   - **Mitigation**: Use `/server/services/aiOKRService.js` ONLY
   - **NOT**: `/server/services/openAI.js` (doesn't exist)

4. **Test Coverage Gaps**
   - **Risk**: 28% of test cases have no implementation
   - **Mitigation**: Focus on P0 test cases first
   - **Defer**: P2 features like replanning

### Technical Corrections
- Use `authenticateToken` NOT `authenticate`
- Use `aiOKRService.js` NOT `openAI.js`
- Use existing `this.openai.chat.completions.create()` pattern

---

## 📊 API GAP COVERAGE

### APIs That MUST Be Created (7 Total)
1. **POST /api/planning/generate-plan** (Day 2)
2. **POST /api/planning/create-goals** (Day 2)
3. **GET /api/dashboard/user/:userId** (Day 4)
4. **GET /api/goals/:id/children** (Day 6)
5. **GET /api/goals/:id/hierarchy** (Day 6)
6. **GET /api/lineage/task/:taskId** (Day 6)
7. **POST /api/planning/replan** (Day 7 - Nice to have)

### APIs That Need Modification (4 Total)
1. **Goal Model** - Add 4 fields (Day 1)
2. **POST /api/goals** - Accept new fields (Day 1)
3. **GET /api/goals/:id** - Populate parent/children (Day 1)
4. **POST /api/tasks** - Inherit lineage from goal (Day 2)

### APIs We Can Reuse As-Is (19 Total)
✅ All assessment, objective, and existing task APIs

---

## 🔧 TECHNICAL SPECIFICATIONS

### Data Model Requirements
```javascript
// Hierarchy Structure
Objective (1)
  └── Key Results (4)
       └── Quarterly Goals (1 per quarter)
            └── Weekly Goals (12-13 per quarter)
                 └── Tasks (multiple per week)

// Required Relationships
Task.goal_id → Weekly Goal
Task.objective_id → Objective
Task.key_result_id → Key Result (via goal)

Weekly Goal.parent_goal_id → Quarterly Goal
Weekly Goal.key_result_id → Key Result
Weekly Goal.time_period = 'WEEKLY'

Quarterly Goal.key_result_id → Key Result
Quarterly Goal.time_period = 'QUARTERLY'
```

### API Endpoints

#### Planning APIs
```javascript
POST /api/planning/generate-plan
Request: {
  kr_id: String,
  timeline_weeks: Number (1-12),
  owner_id: String,
  start_date: Date
}
Response: {
  weeks: [{
    week_number: Number,
    target_value: Number,
    tasks: [String],
    dependencies: [String]
  }]
}

POST /api/planning/create-goals
Request: {
  kr_id: String,
  plan_data: Object,
  parent_goal_id: String
}
Response: {
  created_goals: [Goal],
  status: String
}
```

#### Dashboard APIs
```javascript
GET /api/dashboard/user/:userId
Response: {
  objectives: [Objective],  // where owner = userId
  key_results: [KR],       // from owned objectives
  quarterly_goals: [Goal], // where time_period = 'QUARTERLY'
  weekly_goals: [Goal],    // where time_period = 'WEEKLY'
  tasks_today: [Task],     // due today
  tasks_week: [Task]       // due this week
}

GET /api/lineage/task/:taskId
Response: {
  task: Task,
  weekly_goal: Goal,
  quarterly_goal: Goal,
  key_result: KR,
  objective: Objective,
  assessment_score: Number
}
```

### OpenAI Integration
```javascript
// Reuse existing service
const { openAIService } = require('../services/openAI');

// Planning prompt template
const generatePlanPrompt = (kr, weeks) => `
Given Key Result: ${kr.title}
Current: ${kr.current_value}
Target: ${kr.target_value}
Timeline: ${weeks} weeks

Generate a weekly plan with:
1. Progressive targets (slow start, accelerate, maintain)
2. 3-5 specific tasks per week
3. Dependencies between weeks
4. Realistic progression

Return as JSON with weekly breakdowns.
`;
```

---

## ✅ ACCEPTANCE CRITERIA

### Planning Page
- [ ] User can select any KR from their objectives
- [ ] AI generates intelligent weekly plans
- [ ] Timeline selection works (1-12 weeks)
- [ ] Owner assignment from team members
- [ ] Goals created with all relationships
- [ ] Planning status updates on KR cards

### Employee Dashboard
- [ ] Shows only logged user's tasks
- [ ] Today/This Week tabs functional
- [ ] Tasks show KR context
- [ ] Checkbox updates backend immediately
- [ ] Priority by due time works
- [ ] Why Chain visible on tasks

### Data Integrity
- [ ] All goals have time_period set
- [ ] Weekly goals have parent_goal_id
- [ ] Tasks have complete lineage
- [ ] No orphaned records
- [ ] Cascade updates work

### Performance
- [ ] Page load < 2 seconds
- [ ] API response < 500ms
- [ ] Smooth UI interactions
- [ ] No memory leaks

---

## 🎨 UI/UX SPECIFICATIONS

### Planning Page Layout
```
┌─────────────────────────────────────┐
│ Navigation (existing)                │
├─────────────────────────────────────┤
│ Objective Tabs                       │
│ [Revenue] [Efficiency] [Culture]    │
├──────────────┬──────────────────────┤
│ KR List      │ Planning Workspace   │
│              │                      │
│ ▢ MRR $2.5M  │ Timeline: [12 weeks] │
│   2/12 planned│ Owner: [John Smith] │
│   [Plan]     │                      │
│              │ [Generate AI Plan]   │
└──────────────┴──────────────────────┘
```

### Dashboard Layout
```
┌─────────────────────────────────────┐
│ Welcome, John | Week 2 of Q1        │
├─────────────────────────────────────┤
│ [Today] [This Week]                 │
├─────────────────────────────────────┤
│ Context: Revenue Growth → MRR $2.5M │
├─────────────────────────────────────┤
│ TODAY'S TASKS (8)                   │
│ □ Review Q4 report | Due: 2pm       │
│   └─ KR: MRR $2.5M                  │
│ □ Call Acme Corp | Due: 3pm         │
│   └─ KR: MRR $2.5M                  │
└─────────────────────────────────────┘
```

---

## 📊 RISK MATRIX

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Goal model migration fails | Low | Critical | Test on dev, backup prod |
| OpenAI API issues | Low | High | Retry logic, cache responses |
| Performance problems | Medium | Medium | Add indexes, pagination |
| User adoption | Low | Medium | Clear UI, training docs |

---

## 👥 TEAM ASSIGNMENTS

### Backend Developer
- Days 1-2: Goal model fix, Planning APIs
- Days 5: Dashboard APIs
- Days 8-9: Integration, optimization

### Frontend Developer
- Days 3-4: Planning page
- Days 6-7: Dashboard
- Days 8-9: Polish, testing

### Full Team
- Day 1 Morning: Sprint 1 completion
- Day 8: Integration testing
- Day 10: Documentation, deployment

---

## 📈 SUCCESS METRICS

- **Planning Time**: Reduced by 95% (2 hours → 5 minutes)
- **Goal Creation**: 100% have proper relationships
- **User Productivity**: 8+ tasks completed daily
- **System Performance**: All pages < 2s load time
- **Data Integrity**: Zero orphaned records

---

## 🏁 SPRINT COMPLETION CHECKLIST

### Technical Deliverables
- [ ] Goal model updated with 4 new fields
- [ ] Planning page live and functional
- [ ] Dashboard live and functional
- [ ] All APIs documented and tested
- [ ] Migration script executed successfully

### Business Deliverables
- [ ] Users can plan KRs in under 5 minutes
- [ ] Employees see daily tasks with context
- [ ] Full lineage from task to objective
- [ ] Progress cascades automatically

### Documentation
- [ ] User guide created
- [ ] Technical docs updated
- [ ] API documentation complete
- [ ] Training materials ready

---

**Sprint Status**: READY TO EXECUTE
**Confidence Level**: HIGH (95%)
**Critical Dependency**: Day 1 Goal Model Fix

*This master plan incorporates all findings from the deep dive analysis and ensures successful delivery of Planning and Dashboard features with complete data relationships.*