# 🚀 Sprint 2: Goal Management Enhancement & Employee Dashboard (REVISED)

**Sprint Duration**: 10 Days (Nov 17-28, 2025)
**Sprint Goal**: Enhance existing goal management, build Employee Dashboard, implement "Why Chain" lineage
**Status**: 🟡 Revised After Audit
**Version**: 2.0.0
**Created**: November 12, 2025
**Revised**: November 12, 2025

> **⚠️ IMPORTANT**: This is the REVISED plan after discovering that goal management pages already exist with 46,000+ lines of code. This plan focuses on ENHANCEMENT not CREATION.

---

## 📊 Sprint Overview (REVISED)

### **Goal Statement**
Enhance the existing goal management UI (46K+ lines), build the missing Employee Dashboard, complete task management workflows, and implement the critical "Why Chain" lineage that shows how daily tasks connect to company objectives and assessments.

### **Key Discovery**
- ✅ Goal pages EXIST: quarterly-goals.html (13K), weekly-goals.html (18K), goal-details.html (15K)
- ✅ Backend APIs COMPLETE: 24 endpoints ready (goals + tasks)
- ❌ Employee Dashboard MISSING: Genuine gap to fill
- ❌ "Why Chain" API MISSING: Critical feature to build

### **Success Criteria (REVISED)**
- ✅ Existing goal pages enhanced with missing features (assignment, filters)
- ✅ Employee Dashboard created and functional
- ✅ "Why Chain" lineage visible on all tasks
- ✅ Task completion workflows working end-to-end
- ✅ Progress rollup functioning (task → goal → objective)
- ✅ Sprint 1 technical debt cleared (15% completion)
- ✅ All critical features working without breaking existing functionality

### **Out of Scope (DEFERRED)**
- ❌ Recreating existing goal pages (they work!)
- ❌ Hybrid cascading architecture (too complex for MVP)
- ❌ Database schema changes (risk to stability)
- ❌ Auto-breakdown from Key Results (Sprint 3)
- ❌ Drag-and-drop functionality (nice-to-have)
- ❌ Bulk operations (Sprint 3)
- ❌ Real-time collaboration (Post-MVP)

---

## 🔍 Sprint 1 Carryover Items

### Must Complete (Day 1)
1. **ISS-S1D8-002**: Timeline status "At Risk" logic fix (2 hours)
2. **ISS-S1D8-003**: Target year user input fix (1 hour)
3. **Team Results**: Complete heatmap interactivity (3 hours)
4. **ISS-S1D8-001**: Verify Change Manager dropdown fix (1 hour)

**Total Sprint 1 Debt**: 7 hours (Day 1 morning)

---

## 🎯 Sprint 2 Scope (REALISTIC)

### **Critical Path (P0 - MUST HAVE)**

1. **Employee Dashboard** (Days 4-7) - GENUINE NEW WORK
   - Today's Tasks kanban view
   - My Goals progress widget
   - Activity timeline
   - Quick actions (complete, update)
   - **Effort**: 400 lines new code

2. **"Why Chain" Lineage API** (Day 2) - CRITICAL NEW API
   - GET /api/tasks/:taskId/lineage
   - Traverse: Task → Goal → Objective → Assessment
   - Calculate impact percentage
   - **Effort**: 150 lines new code

3. **Goal Page Enhancements** (Days 2-3) - ENHANCE EXISTING
   - Add assignment dropdown to existing pages
   - Improve filters (by owner, status)
   - Add progress rollup visualization
   - Fix any broken functionality
   - **Effort**: 200 lines enhancement

4. **Task Completion Workflows** (Days 8-9) - PARTIAL EXISTS
   - Complete existing task UI (from 30% → 100%)
   - Quick complete checkbox
   - Progress update slider
   - Blocked status handling
   - **Effort**: 300 lines enhancement

### **Should Have (P1)**
- Task-to-goal linking interface
- Goal progress inline updates
- At-risk indicators
- Empty states for no data

### **Nice to Have (P2 - If Time Permits)**
- Celebration animations
- Undo complete feature
- Bulk task operations
- Advanced filtering

---

## 📅 Sprint Timeline (10 Days) - REVISED

### **Day 1: Sprint 1 Completion & Audit**
**Date**: Nov 17, 2025 (Sunday)
**Owner**: Full Stack Dev
**Effort**: 8 hours

**Tasks**:
- [x] Complete Sprint 1 carryover items (7 hours)
  - Fix ISS-S1D8-002: Timeline "At Risk" logic
  - Fix ISS-S1D8-003: Target year input
  - Complete team results heatmap
  - Verify ISS-S1D8-001: Manager dropdown
- [x] Audit existing implementations (1 hour)
  - Review quarterly-goals.html functionality
  - Review weekly-goals.html functionality
  - Review goal-details.html functionality
  - Document gaps vs requirements

**Deliverables**:
- Sprint 1 items complete
- Audit document of existing vs needed features

---

### **Day 2: Critical API & Planning**
**Date**: Nov 18, 2025 (Monday)
**Owner**: Full Stack Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Build "Why Chain" Lineage API (4 hours)
  ```javascript
  GET /api/tasks/:taskId/lineage
  Response: {
    task: { id, title },
    weekly_goal: { id, title, progress },
    quarterly_goal: { id, title, progress },
    objective: { id, title, progress },
    assessment: { id, dimension, score },
    impact_percentage: 0.4
  }
  ```
- [ ] Create enhancement specifications (2 hours)
- [ ] Set up development environment (1 hour)
- [ ] Write lineage API tests (1 hour)

**Deliverables**:
- Lineage API working
- Enhancement specs documented
- Tests passing

---

### **Day 3: Goal Page Enhancements**
**Date**: Nov 19, 2025 (Tuesday)
**Owner**: Full Stack Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Enhance quarterly-goals.html (3 hours)
  - Add owner assignment dropdown
  - Improve filters (owner, status, quarter)
  - Fix any broken functionality
  - Add "Why Chain" breadcrumb
- [ ] Enhance weekly-goals.html (2 hours)
  - Add parent goal breadcrumb
  - Add task count display
  - Improve progress visualization
- [ ] Enhance goal-details.html (2 hours)
  - Add edit capability
  - Add task creation button
  - Show child goals/tasks
- [ ] Test all enhancements (1 hour)

**Deliverables**:
- Goal pages enhanced
- Assignment working
- Filters improved

---

### **Day 4-5: Employee Dashboard (Core)**
**Date**: Nov 20-21, 2025 (Wed-Thu)
**Owner**: Frontend Dev
**Effort**: 16 hours

**Day 4 Tasks**:
- [ ] Create employee-dashboard.html structure (2 hours)
- [ ] Build dashboard layout (2 hours)
  - Header with welcome message
  - Three-column layout
  - Responsive design
- [ ] Implement Today's Tasks section (4 hours)
  - To Do column
  - In Progress column
  - Completed column
  - Task cards with priority badges

**Day 5 Tasks**:
- [ ] Add task quick actions (2 hours)
  - Complete checkbox
  - Progress update
  - View details link
- [ ] Implement loading states (1 hour)
- [ ] Add empty states (1 hour)
- [ ] Create dashboard controller (2 hours)
- [ ] API integration for tasks (2 hours)

**Deliverables**:
- Dashboard page created
- Today's Tasks working
- API connected

---

### **Day 6-7: Employee Dashboard (Widgets)**
**Date**: Nov 22 & 25, 2025 (Fri & Mon)
**Owner**: Frontend Dev
**Effort**: 16 hours

**Day 6 Tasks** (Nov 22 - Friday):
- [ ] Build My Goals widget (4 hours)
  - Quarterly goals with progress bars
  - Weekly goals with mini rings
  - At-risk indicators
  - Click to navigate
- [ ] Create Activity Timeline (3 hours)
  - Recent completions
  - Goal updates
  - Team mentions
- [ ] Add Quick Stats cards (1 hour)

**Day 7 Tasks** (Nov 25 - Monday):
- [ ] Implement goal progress updates (3 hours)
  - Inline edit capability
  - Progress slider
  - Save without page reload
- [ ] Add filtering and sorting (2 hours)
- [ ] Performance optimization (2 hours)
- [ ] Cross-browser testing (1 hour)

**Deliverables**:
- All dashboard widgets functional
- Progress updates working
- Performance optimized

---

### **Day 8-9: Task Management Completion**
**Date**: Nov 26-27, 2025 (Tue-Wed)
**Owner**: Full Stack Dev
**Effort**: 16 hours

**Day 8 Tasks**:
- [ ] Complete task UI (from 30% to 100%) (4 hours)
  - Task creation modal
  - Assignment workflow
  - Parent goal selector
- [ ] Implement task completion flow (4 hours)
  - Complete checkbox
  - Completion modal with notes
  - Status updates
  - API integration

**Day 9 Tasks**:
- [ ] Build progress update interface (3 hours)
  - Progress slider (0-100%)
  - Status dropdown
  - Blocked status handling
- [ ] Add task filtering (2 hours)
  - By status, priority, assignee
  - By due date
- [ ] Implement task-goal linking (2 hours)
- [ ] Test all workflows (1 hour)

**Deliverables**:
- Task UI 100% complete
- Completion working
- Progress updates functional
- Filters operational

---

### **Day 10: Integration & Polish**
**Date**: Nov 28, 2025 (Thursday)
**Owner**: Full Stack Dev + QA
**Effort**: 8 hours

**Tasks**:
- [ ] End-to-end testing (3 hours)
  - Test complete execution chain
  - Verify progress rollup
  - Check "Why Chain" everywhere
  - Cross-page navigation
- [ ] Bug fixes from testing (2 hours)
- [ ] Performance optimization (1 hour)
  - API call batching
  - Caching implementation
  - Loading optimization
- [ ] Documentation updates (1 hour)
- [ ] Deploy to staging (1 hour)

**Deliverables**:
- All features integrated
- Tests passing
- Performance targets met
- Ready for production

---

## 📊 Effort Analysis (REVISED)

### Original vs Revised Estimates

| Component | Original Estimate | Reality | Revised Effort |
|-----------|------------------|---------|----------------|
| Goal Pages | 1,000 lines (create) | EXIST (46K lines) | 200 lines (enhance) |
| Goal API Client | 300 lines | Probably exists | 50 lines (verify) |
| Employee Dashboard | 400 lines | Correct (missing) | 400 lines |
| Task UI | 550 lines | 30% exists | 300 lines |
| Lineage API | 0 (not planned) | Missing | 150 lines |
| Testing/Integration | N/A | Always needed | 100 lines |
| **TOTAL** | **3,700 lines** | **Mostly exists** | **1,200 lines** |

### Actual Work Distribution
- **New Development**: 25% (Employee Dashboard, Lineage API)
- **Enhancement**: 60% (Goal pages, Task UI)
- **Testing/Integration**: 15% (Quality assurance)

---

## 🧪 Testing Strategy

### Unit Tests (Throughout Sprint)
- [ ] Lineage API traversal logic
- [ ] Progress calculation algorithms
- [ ] Dashboard data fetching
- [ ] Task completion logic
- [ ] Filter and sort functions

### Integration Tests (Days 9-10)
- [ ] Complete OKR execution chain
- [ ] Progress rollup cascade
- [ ] Cross-page navigation
- [ ] API response handling
- [ ] Error scenarios

### E2E Test Scenarios (Day 10)
1. **Manager Journey**: Create goal → Assign → Create tasks → Monitor progress
2. **Employee Journey**: View dashboard → Complete task → Update progress → See impact
3. **Executive Journey**: View objectives → See progress → Drill down to tasks

---

## 🚨 Risk Mitigation (UPDATED)

| Risk | Mitigation | Status |
|------|------------|--------|
| Existing code conflicts | Audit completed, enhancing not recreating | ✅ RESOLVED |
| Sprint 1 incomplete | Day 1 dedicated to completion | 🟡 PLANNED |
| Schema changes break APIs | No schema changes in Sprint 2 | ✅ AVOIDED |
| Complex cascading | Simplified to single path | ✅ RESOLVED |
| Performance issues | Async updates, caching planned | 🟡 READY |

---

## ✅ Definition of Done (Sprint 2)

A feature is complete when:
- ✅ Code implemented and peer reviewed
- ✅ Existing functionality not broken
- ✅ Unit tests written (>80% coverage)
- ✅ Integration tests passing
- ✅ Responsive on desktop/tablet/mobile
- ✅ Performance targets met (<2s load)
- ✅ Documentation updated
- ✅ No P0/P1 bugs remaining

---

## 📈 Success Metrics

### Development Metrics
- **Code Delivered**: ~1,200 lines (vs 3,700 original)
- **Code Enhanced**: ~1,000 lines
- **Tests Written**: >100 test cases
- **Bugs Fixed**: All P0/P1
- **Technical Debt**: Cleared from Sprint 1

### Functional Metrics
- **Dashboard Load Time**: <2 seconds
- **Task Completion Time**: <1 second
- **Progress Update Time**: <3 seconds
- **Lineage API Response**: <500ms
- **Page Navigation**: <1 second

### Business Metrics (Post-Sprint)
- **Dashboard Adoption**: >80% daily active users
- **Task Completion Rate**: >70% on time
- **Progress Updates**: >60% tasks updated
- **Goal Achievement**: >50% on track

---

## 🔗 Dependencies

### From Sprint 1 (Must Be Complete)
- ✅ Company/User creation system
- ✅ Team structure and members
- ✅ Assessment results (for OKR context)
- 🟡 Team results page (70% → 100%)

### External Dependencies
- None identified

### Technical Dependencies
- MongoDB running
- API authentication working
- Frontend build process

---

## 📋 Sprint Backlog Summary

### Committed (P0)
- ✅ Sprint 1 completion (Day 1)
- ✅ Lineage API (Day 2)
- ✅ Goal enhancements (Day 3)
- ✅ Employee Dashboard (Days 4-7)
- ✅ Task management (Days 8-9)
- ✅ Integration (Day 10)

### Stretch Goals (P1) - If Time Permits
- ⭐ Celebration animations
- ⭐ Advanced filtering
- ⭐ Bulk operations
- ⭐ Export functionality

### Deferred to Sprint 3 (P2)
- ❌ Hybrid cascading
- ❌ Schema changes
- ❌ Auto-breakdown
- ❌ Mobile app
- ❌ Real-time sync

---

## 🎯 Sprint 2 Commitment

**We commit to delivering**:
1. A fully functional Employee Dashboard
2. Complete "Why Chain" visibility
3. Enhanced goal management
4. Working task workflows
5. Cleared technical debt

**By November 28, 2025**, every employee will have a dashboard showing their daily priorities and understanding of how their work impacts company objectives.

---

## 📞 Sprint Ceremonies

| Ceremony | Schedule | Duration |
|----------|----------|----------|
| Daily Standup | 9:00 AM daily | 15 mins |
| Sprint Review | Nov 28, 3:00 PM | 1 hour |
| Sprint Retro | Nov 28, 4:30 PM | 45 mins |
| Sprint 3 Planning | Nov 29, 10:00 AM | 2 hours |

---

**Document Status**: REVISED & READY FOR EXECUTION
**Revision Reason**: Audit revealed existing implementations
**Next Review**: Day 5 Mid-Sprint Check
**Questions**: Contact Product Owner

---

*This revised plan incorporates all findings from the Sprint 2 comprehensive audit conducted on November 12, 2025. Original assumptions have been corrected based on actual codebase analysis.*