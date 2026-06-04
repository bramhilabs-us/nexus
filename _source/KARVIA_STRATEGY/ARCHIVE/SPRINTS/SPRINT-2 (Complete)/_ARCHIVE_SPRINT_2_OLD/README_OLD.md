# Sprint 2: Goal Management & Task Execution Flow

**Duration**: Nov 17-28, 2025 (10 days)
**Status**: 🔴 Not Started
**Sprint Goal**: Complete the execution layer with Goal Management UI, Task Management UI, and Employee Dashboard

---

## 📁 Sprint 2 Documentation

### **Planning Documents**
- [SPRINT_2_MASTER_PLAN.md](./SPRINT_2_MASTER_PLAN.md) - Complete sprint plan with daily breakdown
- [SPRINT_2_USER_STORIES.md](./SPRINT_2_USER_STORIES.md) - All 10 user stories with detailed acceptance criteria

### **Reference Documents** (Copied from Strategy)
- [MASTER_DEV_LIST_REFERENCE.md](./MASTER_DEV_LIST_REFERENCE.md) - Current development status
- [MASTER_ISSUES_LIST_REFERENCE.md](./MASTER_ISSUES_LIST_REFERENCE.md) - Known issues and bugs
- [MASTER_IMPROVEMENTS_LIST_REFERENCE.md](./MASTER_IMPROVEMENTS_LIST_REFERENCE.md) - Future enhancements
- [USER_STORIES_MASTER_REFERENCE.md](./USER_STORIES_MASTER_REFERENCE.md) - All 105 MVP user stories
- [SPRINT_1_COMPLETION_REFERENCE.md](./SPRINT_1_COMPLETION_REFERENCE.md) - Sprint 1 achievements

---

## 🎯 Sprint Overview

### **What We're Building**

Sprint 2 completes the **execution chain** missing from Sprint 1:

```
✅ Sprint 1: Objectives (100% complete)
    ↓
⬜ Sprint 2: Goals (Frontend 0% → 100%)
    ↓
⬜ Sprint 2: Tasks (Frontend 30% → 100%)
    ↓
⬜ Sprint 2: Employee Dashboard (NEW)
    ↓
⬜ Sprint 2: "Why Chain" Lineage (CRITICAL)
```

### **Critical Gaps from Audit**

1. **ISS-AUDIT-001**: Goal Management UI Missing (P0)
   - Backend: 100% ✅
   - Frontend: 0% ❌
   - Days 1-5

2. **ISS-AUDIT-003**: Employee Dashboard Missing (P0)
   - Backend: Reuses existing APIs ✅
   - Frontend: 0% ❌
   - Days 6-7

3. **ISS-AUDIT-004**: Task Management UI 30% Complete (P0)
   - Backend: 100% ✅
   - Frontend: 30% → 100% 🔄
   - Days 8-9

4. **EMP-016**: "Why Chain" Lineage (P0 CRITICAL)
   - Backend: Need new API endpoint 🆕
   - Frontend: NEW component 🆕
   - Day 10

---

## 📊 Sprint Metrics

### **Code Metrics**
- **New Code**: ~2,850 lines (8 new files)
- **Enhanced Code**: ~550 lines (2 existing files)
- **Total**: ~3,400 lines
- **Backend Changes**: 0 (except 1 new API endpoint)
- **Backend Reuse**: 💯 100%

### **User Stories**
- **Total**: 10 stories
- **Manager Stories**: 4
- **Employee Stories**: 6
- **Story Points**: 54

### **Timeline**
- **Phase 1**: Goal Management (Days 1-5)
- **Phase 2**: Employee Dashboard (Days 6-7)
- **Phase 3**: Task Management (Days 8-9)
- **Phase 4**: Integration & Polish (Day 10)

---

## 🚀 Getting Started

### **Pre-Sprint Checklist**

- [ ] Review [SPRINT_2_MASTER_PLAN.md](./SPRINT_2_MASTER_PLAN.md)
- [ ] Review [SPRINT_2_USER_STORIES.md](./SPRINT_2_USER_STORIES.md)
- [ ] Review Sprint 1 completion summary
- [ ] Understand current issues from MASTER_ISSUES_LIST
- [ ] Set up local development environment
- [ ] Verify all backend APIs working (11 goal endpoints, 13 task endpoints)
- [ ] Sprint kickoff meeting scheduled (Nov 17)

### **Daily Workflow**

1. **Morning**: Check today's tasks in Master Plan
2. **During Day**: Implement features, write tests, update progress
3. **End of Day**: Update completion status, create handoff notes
4. **Every Day**: Update todo list with TodoWrite tool

### **Testing Strategy**

- **Unit Tests**: Write as you code (target > 80% coverage)
- **Integration Tests**: End of each phase
- **End-to-End Tests**: Day 10
- **Manual QA**: Throughout sprint

---

## 📝 Daily Progress Tracking

### **Days 1-5: Goal Management Frontend**
- [ ] Day 1: Quarterly goals list page
- [ ] Day 2: Goal creation modal + Assignment
- [ ] Day 3: Weekly goals page
- [ ] Day 4: Goal details page
- [ ] Day 5: Goals API client + Integration

### **Days 6-7: Employee Dashboard**
- [ ] Day 6: Dashboard core + Today's tasks
- [ ] Day 7: Goals widgets + Activity + Stats

### **Days 8-9: Task Management Completion**
- [ ] Day 8: Task creation + Assignment workflow
- [ ] Day 9: Progress update + Completion + Filters

### **Day 10: Integration & Polish**
- [ ] Cross-page navigation testing
- [ ] "Why Chain" lineage implementation
- [ ] Sprint 1 bug fixes
- [ ] Performance optimization
- [ ] Final QA

---

## 🔗 Key Links

### **Backend APIs (Already Complete)**
- Goal Routes: [server/routes/goals.js](../../../../server/routes/goals.js) - 11 endpoints
- Task Routes: [server/routes/tasks.js](../../../../server/routes/tasks.js) - 13 endpoints
- Goal Model: [server/models/Goal.js](../../../../server/models/Goal.js) - 714 lines
- Task Model: [server/models/Task.js](../../../../server/models/Task.js) - 881 lines

### **Frontend Patterns (For Reuse)**
- Objectives Page: [client/pages/objectives.html](../../../../client/pages/objectives.html)
- Manager Dashboard: [client/pages/manager-dashboard.html](../../../../client/pages/manager-dashboard.html)
- Teams Page: [client/pages/teams.html](../../../../client/pages/teams.html)

### **Planning Documents**
- Sprint 1 Master Plan: [../SPRINT_1/SPRINT_1_MASTER_PLAN.md](../SPRINT_1/SPRINT_1_MASTER_PLAN.md)
- Sprint 1 Completion: [../SPRINT_1/DAY_6_COMPLETION_SUMMARY.md](../SPRINT_1/DAY_6_COMPLETION_SUMMARY.md)
- Master Dev List: [../../../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md](../../../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md)

---

## ✅ Success Criteria

Sprint 2 is successful when:

- ✅ All 10 user stories implemented and tested
- ✅ Complete execution chain works: Objective → Goal → Task → Completion
- ✅ Employee dashboard is live and usable
- ✅ "Why Chain" lineage is visible and working
- ✅ All Sprint 1 P2 bugs fixed
- ✅ Zero P0/P1 bugs remaining
- ✅ Performance targets met (< 2s page loads)
- ✅ All integration tests passing
- ✅ Sprint retrospective completed
- ✅ Sprint 3 planned

---

## 📞 Sprint Contacts

**Sprint Master**: TBD
**Product Owner**: TBD
**Dev Team**: TBD
**QA**: TBD

---

## 🎉 Let's Build!

Sprint 2 will complete the core execution layer, making Karvia OKR fully functional for the Objective → Goal → Task workflow. This is a critical sprint that enables the full user journey from strategic planning to daily execution.

**Sprint Kickoff**: November 17, 2025
**Sprint Review**: November 28, 2025
**Sprint Retrospective**: November 29, 2025

---

**Version**: 1.0.0
**Created**: November 12, 2025
**Status**: 🔴 Ready for Sprint Start
