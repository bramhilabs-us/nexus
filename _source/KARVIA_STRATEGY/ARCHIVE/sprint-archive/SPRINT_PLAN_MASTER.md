# 🚀 KARVIA BUSINESS - MASTER SPRINT PLAN
**Created**: November 2, 2025
**Duration**: 8 weeks (4 sprints × 2 weeks)
**Target Launch**: December 31, 2025
**Current Status**: 70% complete

## 📊 Executive Summary

We have 8 weeks to complete the remaining 30% of the project. The backend is 95% complete, but critical frontend gaps prevent users from accessing the functionality. This sprint plan focuses on delivering value incrementally, with each sprint producing a usable feature set.

## 🎯 Sprint Philosophy

### Principles
1. **User-First**: Each sprint delivers complete user workflows
2. **Incremental Value**: Something deployable every 2 weeks
3. **Risk Mitigation**: Critical blockers first
4. **Parallel Work**: Backend and frontend developers work simultaneously
5. **Testing Throughout**: Not just at the end

### Success Metrics Per Sprint
- ✅ All user stories complete
- ✅ Integration tests passing
- ✅ No P0 bugs remaining
- ✅ Documentation updated
- ✅ Demo-ready features

## 📅 Sprint Overview

| Sprint | Dates | Theme | Completion Target |
|--------|-------|-------|-------------------|
| **Pre-Sprint** | Nov 3-9 | Critical Workflow Fixes | 70% → 75% |
| **Sprint 1** | Nov 10-23 | Core Workflow Foundation | 75% → 82% |
| **Sprint 2** | Nov 24-Dec 7 | Daily Operations | 82% → 88% |
| **Sprint 3** | Dec 8-21 | Enterprise Features | 88% → 95% |
| **Sprint 4** | Dec 22-31 | Production Readiness | 95% → 100% |

---

# 🏃 SPRINT 1: CORE WORKFLOW FOUNDATION
**Duration**: Nov 3-16, 2025 (2 weeks)
**Goal**: Unblock core manager and employee workflows
**Target Completion**: 70% → 82%

## Sprint 1 Objectives
1. Complete Goal Management UI (P0 CRITICAL)
2. Fix Business/Company Management API (P0 CRITICAL)
3. Complete Task Management UI (P1 HIGH)
4. Resolve architecture naming issues

## User Stories (17 stories)

### Week 1 (Nov 3-9): Goal Management
- **MGR-015**: Create quarterly goals from objectives
- **MGR-016**: Break quarterly goals into weekly goals
- **MGR-017**: Create tasks from goals
- **MGR-018**: Assign goals to team members
- **EMP-016**: View "Why Chain" context (CRITICAL)
- **EMP-013**: View assigned goals
- **EMP-014**: Update goal progress

### Week 2 (Nov 10-16): Business & Task Management
- **OWNER-001**: Create business account
- **OWNER-002**: Configure business settings
- **OWNER-003**: Manage business users
- **CONS-001**: Manage multiple businesses
- **EMP-007**: View assigned tasks
- **EMP-008**: Update task progress
- **MGR-009**: Create and assign tasks
- **MGR-010**: Track task completion
- **EXEC-010**: Goal approval workflow
- **EXEC-011**: Quarterly plan approval

## Technical Deliverables

### Frontend (Critical Gap)
```
Goal Management UI (8 files, ~2,050 lines):
├── client/pages/quarterly-goals.html (400 lines)
├── client/pages/goal-details.html (300 lines)
├── client/pages/weekly-goals.html (300 lines)
├── client/pages/scripts/quarterly-goals.js (350 lines)
├── client/pages/scripts/goal-details.js (400 lines)
├── client/pages/scripts/weekly-goals.js (300 lines)
├── client/js/goals-api-client.js (300 lines)
└── client/css/goals.css (150 lines)

Task Management UI Completion (5 files, ~800 lines):
├── client/pages/task-create.html (200 lines)
├── client/pages/task-assign.html (150 lines)
├── client/pages/scripts/task-create.js (200 lines)
├── client/pages/scripts/task-assign.js (150 lines)
└── client/css/tasks.css (100 lines)
```

### Backend
```
Business Management API (6 endpoints, ~400 lines):
├── GET /api/businesses/:id
├── PUT /api/businesses/:id
├── DELETE /api/businesses/:id
├── GET /api/businesses/:id/users
├── GET /api/businesses/:id/teams
└── GET /api/businesses/:id/stats

Architecture Fixes:
├── Rename Business → Company (migration script)
├── Add companies[] array to User model
└── Update all references
```

## Resource Allocation
- **Frontend Developer 1**: Goal Management UI (Week 1)
- **Frontend Developer 2**: Task Management UI (Week 1)
- **Backend Developer**: Business API + Architecture (Week 1)
- **QA**: Testing as features complete (Week 2)

## Definition of Done
- ✅ All 17 user stories implemented
- ✅ Goals: Create, assign, track progress
- ✅ Tasks: Create, assign, complete
- ✅ Business: Full CRUD operations
- ✅ Integration tests: 80% coverage
- ✅ No P0/P1 bugs
- ✅ Documentation updated

## Sprint 1 Demo Scenarios
1. Manager creates quarterly goals from objectives
2. Manager breaks down to weekly goals
3. Manager assigns goals to employees
4. Employee views goal with "Why Chain"
5. Employee updates progress
6. Business owner manages settings

## Dependencies & Risks
- **Risk**: Goal UI complexity
  - Mitigation: Reuse existing patterns from assessment UI
- **Risk**: Business/Company naming conflicts
  - Mitigation: Clear migration script

## Reference Documentation
- Technical: `/KARVIA_STRATEGY/2-TECHNICAL/3-DATA/database_schema.md`
- User Stories: `/Karvia_OKR_Product_Planning/01_MVP/MVP_USER_STORIES.md`
- Mockups: `/Karvia_OKR_Mockups/Finalised_Mockups/06_planning.html`
- Backend Routes: `/server/routes/goals.js` (already complete)

---

# 🏃 SPRINT 2: DAILY OPERATIONS
**Duration**: Nov 17-30, 2025 (2 weeks)
**Goal**: Complete daily workflow for all personas
**Target Completion**: 82% → 88%

## Sprint 2 Objectives
1. Build Employee Dashboard (P0 CRITICAL)
2. Complete Planning Screen
3. Implement Profile Management
4. Add notification system

## User Stories (19 stories)

### Week 3 (Nov 17-23): Dashboard & Planning
- **EMP-008**: View daily tasks dashboard
- **EMP-009**: Complete tasks from dashboard
- **EMP-010**: Track daily progress
- **EMP-011**: View team progress
- **EMP-012**: Receive task notifications
- **MGR-012**: Monitor team dashboard
- **MGR-013**: Track team productivity
- **MGR-014**: Receive alerts on delays
- **EXEC-009**: Executive overview dashboard

### Week 4 (Nov 24-30): Planning & Profile
- **MGR-019**: Create quarterly plans
- **MGR-020**: Allocate quarterly to weekly
- **MGR-021**: Review planning history
- **EXEC-012**: Approve quarterly plans
- **EXEC-013**: Strategic planning view
- **EMP-001**: Update profile information
- **EMP-002**: Set preferences
- **MGR-022**: View team profiles
- **MGR-023**: Manage team settings
- **OWNER-004**: Organization settings

## Technical Deliverables

### Frontend
```
Employee Dashboard (5 files, ~1,500 lines):
├── client/pages/employee-dashboard.html (400 lines)
├── client/pages/scripts/employee-dashboard.js (500 lines)
├── client/pages/components/task-widget.js (200 lines)
├── client/pages/components/progress-chart.js (200 lines)
└── client/css/dashboard.css (200 lines)

Planning Screen (4 files, ~1,200 lines):
├── client/pages/planning.html (400 lines)
├── client/pages/scripts/planning.js (500 lines)
├── client/pages/components/quarter-selector.js (150 lines)
└── client/css/planning.css (150 lines)

Profile Management (3 files, ~600 lines):
├── client/pages/profile.html (200 lines)
├── client/pages/scripts/profile.js (300 lines)
└── client/css/profile.css (100 lines)
```

### Backend
```
Notification System (3 files, ~500 lines):
├── server/services/notification-service.js (200 lines)
├── server/models/Notification.js (150 lines)
└── server/routes/notifications.js (150 lines)

Planning Enhancements:
├── server/services/planning-service.js (300 lines)
└── Quarter allocation algorithms
```

## Resource Allocation
- **Frontend Developer 1**: Employee Dashboard (Week 3)
- **Frontend Developer 2**: Planning Screen (Week 3)
- **Backend Developer**: Notification system (Week 3)
- **Full Team**: Profile + Integration (Week 4)

## Definition of Done
- ✅ Employee dashboard fully functional
- ✅ Planning workflow complete
- ✅ Profile management working
- ✅ Notifications operational
- ✅ All 19 user stories complete
- ✅ 85% test coverage

## Sprint 2 Demo Scenarios
1. Employee logs in → sees dashboard → completes tasks
2. Manager creates quarterly plan → allocates weekly
3. Executive approves plans → monitors progress
4. User updates profile → sets preferences
5. System sends notifications on events

## Dependencies & Risks
- **Dependency**: Sprint 1 goal management must be complete
- **Risk**: Dashboard performance with large datasets
  - Mitigation: Implement pagination and caching

## Reference Documentation
- Mockups: `/Karvia_OKR_Mockups/Finalised_Mockups/02_dashboard.html`
- Planning Logic: `/KARVIA_STRATEGY/1-PRODUCT/0-STRATEGY/product_overview.md`
- User Journeys: `/Karvia_OKR_Product_Planning/01_MVP/User_Stories/EMPLOYEE_JOURNEY.md`

---

# 🏃 SPRINT 3: ENTERPRISE FEATURES
**Duration**: Dec 1-14, 2025 (2 weeks)
**Goal**: Add enterprise capabilities
**Target Completion**: 88% → 95%

## Sprint 3 Objectives
1. Implement IAM Block (multi-company)
2. Build Analytics Dashboard
3. Create Admin Panel
4. Add bulk operations

## User Stories (15 stories)

### Week 5 (Dec 1-7): IAM & Multi-Company
- **CONS-002**: Switch between companies
- **CONS-003**: Cross-company analytics
- **CONS-004**: Consolidated reporting
- **OWNER-005**: Add users in bulk
- **OWNER-006**: Bulk team creation
- **ADMIN-001**: System administration
- **ADMIN-002**: User management
- **ADMIN-003**: Permission management

### Week 6 (Dec 8-14): Analytics & Admin
- **EXEC-014**: Analytics dashboard
- **EXEC-015**: KPI tracking
- **EXEC-016**: Export reports
- **MGR-024**: Team analytics
- **MGR-025**: Performance insights
- **CONS-007**: Assessment insights
- **MGR-026**: Automated alerts

## Technical Deliverables

### Frontend
```
Analytics Dashboard (5 files, ~1,800 lines):
├── client/pages/analytics.html (400 lines)
├── client/pages/scripts/analytics.js (600 lines)
├── client/pages/components/charts/ (multiple, 500 lines)
├── client/js/chart-library-wrapper.js (200 lines)
└── client/css/analytics.css (100 lines)

Admin Panel (4 files, ~1,200 lines):
├── client/pages/admin.html (300 lines)
├── client/pages/scripts/admin.js (500 lines)
├── client/pages/components/user-table.js (200 lines)
└── client/css/admin.css (200 lines)

IAM UI Updates (3 files, ~600 lines):
├── client/pages/components/company-switcher.js (200 lines)
├── client/pages/scripts/multi-company.js (300 lines)
└── Updates to existing files (100 lines)
```

### Backend
```
IAM Block Implementation:
├── server/models/Company.js (300 lines)
├── server/routes/companies.js (400 lines)
├── server/middleware/company-context.js (150 lines)
├── server/services/bulk-operations.js (300 lines)
└── Migration scripts (200 lines)

Analytics Engine:
├── server/services/analytics-engine.js (500 lines)
├── server/routes/analytics.js (300 lines)
└── Aggregation pipelines (400 lines)
```

## Resource Allocation
- **Backend Developer**: IAM Block (Week 5)
- **Frontend Developer 1**: Analytics Dashboard (Week 5-6)
- **Frontend Developer 2**: Admin Panel (Week 5-6)
- **Full Team**: Integration (Week 6)

## Definition of Done
- ✅ Multi-company support working
- ✅ Analytics dashboard complete
- ✅ Admin panel functional
- ✅ Bulk operations tested
- ✅ 15 user stories complete
- ✅ Performance benchmarks met

## Sprint 3 Demo Scenarios
1. Consultant switches between companies
2. Executive views analytics dashboard
3. Admin manages users and permissions
4. Bulk invitation of 50 users
5. Cross-company performance comparison

## Dependencies & Risks
- **Risk**: IAM complexity with existing data
  - Mitigation: Careful migration scripts
- **Risk**: Analytics performance
  - Mitigation: Pre-calculated aggregates

## Reference Documentation
- IAM Spec: `/KARVIA_STRATEGY/2-TECHNICAL/1-API-DESIGN/auth_service.md`
- Analytics Requirements: `/KARVIA_STRATEGY/1-PRODUCT/3-USER-EXPERIENCE/analytics_dashboard.md`

---

# 🏃 SPRINT 4: PRODUCTION READINESS
**Duration**: Dec 15-31, 2025 (2 weeks + buffer)
**Goal**: Polish, test, and launch
**Target Completion**: 95% → 100%

## Sprint 4 Objectives
1. Complete integration testing
2. Performance optimization
3. Security audit and fixes
4. Bug fixing
5. Documentation completion
6. Production deployment

## Focus Areas

### Week 7 (Dec 15-21): Testing & Optimization
- End-to-end testing all workflows
- Performance optimization
- Security vulnerability scanning
- Load testing
- Cross-browser testing
- Mobile responsiveness

### Week 8 (Dec 22-31): Launch
- Final bug fixes
- Production environment setup
- Monitoring configuration
- Beta user onboarding
- Launch preparation
- Go-live (Dec 31)

## Technical Deliverables

### Testing
```
Test Coverage:
├── Unit tests: 80% coverage
├── Integration tests: All APIs
├── E2E tests: All user journeys
├── Performance tests: <200ms response
├── Security tests: OWASP top 10
└── Load tests: 1000 concurrent users
```

### Documentation
```
Complete Documentation:
├── API documentation (Swagger)
├── User guides (all personas)
├── Admin documentation
├── Deployment guide
├── Troubleshooting guide
└── Developer onboarding
```

### DevOps
```
Production Setup:
├── Docker containers optimized
├── Kubernetes manifests validated
├── CI/CD pipelines configured
├── Monitoring (Prometheus/Grafana)
├── Logging (ELK stack)
└── Backup strategies
```

## Resource Allocation
- **Full Team**: Testing and bug fixes (Week 7)
- **DevOps Lead**: Production setup (Week 7-8)
- **QA Team**: Final validation (Week 8)
- **Product Owner**: UAT and sign-off (Week 8)

## Definition of Done
- ✅ Zero P0/P1 bugs
- ✅ All user stories complete
- ✅ Performance targets met
- ✅ Security audit passed
- ✅ Documentation complete
- ✅ Production deployed
- ✅ Monitoring active
- ✅ Beta users onboarded

## Launch Criteria
1. All 97 user stories implemented
2. Test coverage >80%
3. Response time <200ms
4. Zero critical security issues
5. Documentation complete
6. Support process defined
7. Rollback plan tested

## Sprint 4 Demo Scenarios
1. Complete user journey (assessment → OKR → goals → tasks)
2. Stress test with 100 concurrent users
3. Failover and recovery demonstration
4. Multi-company workflow
5. Full reporting cycle

## Risk Mitigation
- **Risk**: Last-minute critical bugs
  - Mitigation: 1-week buffer built in
- **Risk**: Performance issues
  - Mitigation: Early performance testing in Sprint 3
- **Risk**: Deployment failures
  - Mitigation: Staged rollout, rollback plan

---

## 📊 Sprint Metrics & Tracking

### Velocity Tracking
- Sprint 1: 17 stories (baseline)
- Sprint 2: 19 stories
- Sprint 3: 15 stories
- Sprint 4: Testing & launch

### Progress Indicators
- Daily standups
- Sprint reviews every 2 weeks
- Burndown charts
- Blocker tracking
- Risk register

### Success Metrics
- Story completion rate: >90%
- Bug discovery rate: decreasing
- Test coverage: increasing
- Performance: consistent <200ms

---

## 🔗 Reference Documents

### Pre-Sprint Documents (USE THESE!)
- **Audit & Findings**: `/KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/PRE_SPRINT_AUDIT_COMPLETE.md`
- **Implementation Guide**: `/KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/PRE_SPRINT_IMPLEMENTATION.md`

### Strategy
- Master Strategy: `/KARVIA_STRATEGY/00_MASTER_STRATEGY.md`
- Technical Architecture: `/KARVIA_STRATEGY/2-TECHNICAL/`
- Product Strategy: `/KARVIA_STRATEGY/1-PRODUCT/`

### Planning
- User Stories: `/Karvia_OKR_Product_Planning/01_MVP/MVP_USER_STORIES.md`
- Weekly Plans: `/Karvia_OKR_Product_Planning/Daily_Handoffs/`
- Issues List: `/KARVIA_STRATEGY/3-DELIVERY/MASTER_ISSUES_LIST.md`

### Design
- Mockups: `/Karvia_OKR_Mockups/Finalised_Mockups/`
- UI Components: `/Karvia_OKR_Mockups/Design_elements/`

### Code
- Backend: `/server/` (models, routes, services)
- Frontend: `/client/` (pages, scripts, css)
- Tests: `/tests/`

---

## 📝 Notes

1. **Parallel Work**: Each sprint has opportunities for parallel development
2. **Incremental Value**: Each sprint delivers working features
3. **Risk-First**: Critical blockers addressed in Sprint 1
4. **Buffer Time**: Sprint 4 includes holiday buffer
5. **Continuous Testing**: Not just at the end

**Document Status**: Living document - update after each sprint review
**Next Review**: November 16, 2025 (End of Sprint 1)