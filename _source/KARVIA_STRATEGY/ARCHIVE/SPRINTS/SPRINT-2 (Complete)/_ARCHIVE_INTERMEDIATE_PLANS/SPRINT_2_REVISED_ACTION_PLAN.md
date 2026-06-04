# 🎯 SPRINT 2 REVISED ACTION PLAN

**Sprint Name**: Planning Page & Employee Dashboard with KR Integration
**Duration**: 10 Days (November 17-28, 2025)
**Version**: REVISED
**Status**: ✅ Ready for Execution
**Revised**: November 12, 2025

---

## 🔄 WHAT CHANGED

### New Understanding:
1. **Planning Page is PRIMARY**: Convert KRs → Weekly Goals with AI generation
2. **Employee Dashboard is SECONDARY**: Shows daily tasks with Why Chain
3. **OpenAI Integration REQUIRED**: For intelligent plan generation
4. **Timeline Selection**: 1-12 weeks maximum per KR

### Original vs Revised Focus:
- **ORIGINAL**: Focus on cascading goals manually
- **REVISED**: Focus on AI-powered planning from KRs to weekly goals

---

## 🚀 WHAT WE'RE BUILDING

### 1. Planning Page (PRIMARY DELIVERABLE)
- **Purpose**: Convert KRs into actionable weekly goals using AI
- **Features**:
  - Objective tabs for navigation
  - KR cards showing progress and planning status
  - AI-powered plan generation
  - Owner assignment from existing teams
  - Timeline selection (1-12 weeks)
  - Review and accept generated plans

### 2. Employee Dashboard (SECONDARY)
- **Purpose**: Daily task execution with Why Chain visibility
- **Features**:
  - Today's tasks board (To Do, In Progress, Done)
  - Why Chain showing full cascade
  - Goal progress tracking
  - Quick stats and productivity metrics

### 3. Backend Requirements
- Add `key_result_id` to Goal model
- OpenAI integration for plan generation
- Lineage API for Why Chain
- Weekly goal generation endpoints

---

## 📋 PRE-SPRINT CHECKLIST

### Before Starting (Nov 15-16)
- [ ] Set up OpenAI API key and test connection
- [ ] Confirm Key Results exist in Objective model
- [ ] Review team member data structure
- [ ] Prepare AI prompt templates
- [ ] Set up development environment

---

## 🗓️ REVISED DAY-BY-DAY EXECUTION PLAN

### **Day 1: Sprint 1 Completion & Backend Setup**
**Date**: November 17, 2025 (Sunday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Fix ISS-S1D8-002: Timeline "At Risk" logic (1.5 hrs)
- [ ] Fix ISS-S1D8-003: Target year input (1 hr)
- [ ] Complete team results heatmap (1.5 hrs)

#### Afternoon (4 hours)
- [ ] Add `key_result_id` field to Goal model
- [ ] Create OpenAI service wrapper
- [ ] Test OpenAI connection
- [ ] Prepare prompt templates for plan generation

**Deliverable**: Sprint 1 complete, OpenAI ready, Goal model updated

---

### **Day 2: Planning Page Backend APIs**
**Date**: November 18, 2025 (Monday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Create API: POST /api/planning/generate-plan
  ```javascript
  {
    kr_id: "kr_123",
    timeline_weeks: 10,
    owner_id: "user_456",
    start_date: "2025-01-20"
  }
  ```
- [ ] Implement OpenAI call for plan generation
- [ ] Parse and structure AI response

#### Afternoon (4 hours)
- [ ] Create API: POST /api/planning/create-goals
- [ ] Implement batch goal creation from plan
- [ ] Add validation for timeline (1-12 weeks)
- [ ] Test with Postman

**Deliverable**: Planning APIs complete with OpenAI integration

---

### **Day 3: Planning Page Frontend - Structure**
**Date**: November 19, 2025 (Tuesday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Create planning.html page
- [ ] Implement objective tabs
- [ ] Build KR cards with status indicators
- [ ] Add navigation to existing menu

#### Afternoon (4 hours)
- [ ] Create planning workspace (right panel)
- [ ] Build empty state
- [ ] Implement KR selection interaction
- [ ] Add form for timeline and owner selection

**Deliverable**: Planning page structure complete

---

### **Day 4: Planning Page Frontend - AI Integration**
**Date**: November 20, 2025 (Wednesday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Connect to generate-plan API
- [ ] Implement loading states
- [ ] Display generated weekly plans
- [ ] Add owner selection per week

#### Afternoon (4 hours)
- [ ] Implement plan review interface
- [ ] Add accept/regenerate functionality
- [ ] Connect to create-goals API
- [ ] Update KR card status after planning

**Deliverable**: Planning page fully functional

---

### **Day 5: Lineage API & Why Chain**
**Date**: November 21, 2025 (Thursday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Build Why Chain Lineage API
  ```javascript
  GET /api/lineage/task/:taskId
  Returns: assessment → objective → kr → quarterly → weekly → task
  ```
- [ ] Optimize query performance
- [ ] Add caching layer

#### Afternoon (4 hours)
- [ ] Create lineage display component
- [ ] Test with various task IDs
- [ ] Document API endpoints
- [ ] Add to existing goal pages

**Deliverable**: Complete lineage tracking system

---

### **Day 6: Employee Dashboard - Structure**
**Date**: November 22, 2025 (Friday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Create employee-dashboard.html
- [ ] Build header with greeting and date
- [ ] Implement Why Chain card
- [ ] Add quick stats section

#### Afternoon (4 hours)
- [ ] Create three-column task board
- [ ] Implement task cards with KR links
- [ ] Add drag-and-drop functionality
- [ ] Connect to existing task APIs

**Deliverable**: Dashboard structure complete

---

### **Day 7: Employee Dashboard - Functionality**
**Date**: November 25, 2025 (Monday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Implement task status updates
- [ ] Add quick complete checkbox
- [ ] Connect to lineage API for Why Chain
- [ ] Add real-time updates

#### Afternoon (4 hours)
- [ ] Build goals progress section
- [ ] Add weekly and quarterly goal cards
- [ ] Implement progress indicators
- [ ] Test all interactions

**Deliverable**: Dashboard fully functional

---

### **Day 8: Integration with Existing Pages**
**Date**: November 26, 2025 (Tuesday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Add "Plan" button to objectives page KRs
- [ ] Update quarterly-goals.html to show KR relationship
- [ ] Add navigation links to planning page
- [ ] Ensure consistent styling

#### Afternoon (4 hours)
- [ ] Test flow: Objective → Planning → Goals → Tasks
- [ ] Fix any navigation issues
- [ ] Update breadcrumbs
- [ ] Add tooltips and help text

**Deliverable**: Full integration with existing app

---

### **Day 9: Testing & Optimization**
**Date**: November 27, 2025 (Wednesday)
**Hours**: 8

#### Morning (4 hours)
- [ ] End-to-end testing of planning flow
- [ ] Test AI generation with various KR types
- [ ] Verify goal creation and assignment
- [ ] Test Why Chain accuracy

#### Afternoon (4 hours)
- [ ] Performance optimization
- [ ] Fix any bugs found
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check

**Deliverable**: Fully tested and optimized

---

### **Day 10: Polish & Documentation**
**Date**: November 28, 2025 (Thursday)
**Hours**: 8

#### Morning (4 hours)
- [ ] Add loading animations
- [ ] Improve error messages
- [ ] Add success notifications
- [ ] Polish UI transitions

#### Afternoon (4 hours)
- [ ] Create user documentation
- [ ] Record demo video
- [ ] Deploy to staging
- [ ] Sprint retrospective

**Deliverable**: Sprint 2 complete and deployed!

---

## 🔑 KEY API ENDPOINTS

### Planning APIs
```javascript
// Generate AI plan for a KR
POST /api/planning/generate-plan
Request: { kr_id, timeline_weeks, owner_id }
Response: { weeks: [{ week_num, targets, tasks, dependencies }] }

// Create goals from approved plan
POST /api/planning/create-goals
Request: { kr_id, plan_data }
Response: { created_goals: [...] }

// Get planning status for KRs
GET /api/planning/status/:objectiveId
Response: { krs: [{ id, planned_weeks, total_weeks }] }
```

### Lineage API
```javascript
// Get Why Chain for any entity
GET /api/lineage/:type/:id
Response: { chain: [assessment, objective, kr, quarterly, weekly, task] }
```

---

## ✅ DEFINITION OF DONE

### Planning Page
- [ ] All KRs can be planned
- [ ] AI generates relevant weekly goals
- [ ] Goals are created with correct relationships
- [ ] Status updates correctly
- [ ] Timeline validation works (1-12 weeks)

### Employee Dashboard
- [ ] Shows today's tasks
- [ ] Why Chain is accurate
- [ ] Tasks can be updated
- [ ] Progress rolls up correctly
- [ ] Real-time updates work

### Integration
- [ ] Navigation between pages works
- [ ] Data consistency maintained
- [ ] No console errors
- [ ] Performance < 2s page load
- [ ] Mobile responsive

---

## 📊 SUCCESS METRICS

### Must Have (P0)
- ✅ Planning page converts KRs to weekly goals
- ✅ OpenAI integration works reliably
- ✅ Goals created with KR relationship
- ✅ Employee dashboard shows tasks
- ✅ Why Chain visible

### Should Have (P1)
- ✅ Owner assignment per week
- ✅ Plan regeneration option
- ✅ Progress indicators
- ✅ Real-time updates

### Nice to Have (P2)
- ⭐ Drag-and-drop on dashboard
- ⭐ Plan templates
- ⭐ Export to calendar
- ⭐ Team collaboration features

---

## 🚨 RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI API failures | HIGH | Implement retry logic, cache responses |
| Complex AI prompts | MEDIUM | Start with simple templates, iterate |
| Timeline calculation | LOW | Default to even distribution |
| Owner assignment | LOW | Default to KR owner |

---

## 📝 NOTES FOR IMPLEMENTATION

### OpenAI Prompt Template
```
Given a Key Result: "${kr.title}"
Current Value: ${kr.current}
Target Value: ${kr.target}
Timeline: ${weeks} weeks
Start Date: ${start_date}

Generate a weekly plan with:
1. Progressive weekly targets
2. 3-5 specific tasks per week
3. Dependencies between weeks
4. Realistic progression curve

Format as JSON with structure:
{
  weeks: [{
    week_number: 1,
    target_value: X,
    tasks: ["task1", "task2"],
    dependencies: ["week_0_completion"]
  }]
}
```

### UI Considerations
- Use existing Karvia gradient for CTAs
- Maintain consistent card styles
- Keep loading states under 2 seconds
- Show progress immediately after actions

---

## 🎯 FINAL DELIVERABLES

1. **Planning Page** - Full KR to weekly goal conversion
2. **Employee Dashboard** - Daily task management with context
3. **OpenAI Integration** - Intelligent plan generation
4. **Lineage System** - Complete Why Chain visibility
5. **Updated Goal Model** - KR relationships maintained

---

**Sprint Confidence**: HIGH ✅
**Risk Level**: LOW (simplified from original plan)
**Team Required**: 1-2 developers

---

*This revised plan focuses on the Planning page as the primary deliverable, with clear OpenAI integration for intelligent plan generation.*