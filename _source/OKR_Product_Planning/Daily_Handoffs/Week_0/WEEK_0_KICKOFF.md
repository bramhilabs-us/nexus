# 🚀 WEEK 0 KICKOFF - MVP FOUNDATION WEEK

**Sprint**: Week 0 (Foundation Week)
**Duration**: 5 days (January 13-17, 2025)
**Status**: CRITICAL - BLOCKING all subsequent work
**Team**: 1-2 developers full-time

---

## 🎯 WEEK 0 OBJECTIVES

**Primary Goal**: Create the 4 missing critical models and unblock core MVP features

**Success Criteria**:
- ✅ Goal model implemented and tested
- ✅ Task model implemented and tested
- ✅ Invitation model implemented and tested
- ✅ Assessment model implemented (for history tracking)
- ✅ All models have proper schemas, indexes, methods
- ✅ CRUD operations tested manually (Postman/Thunder Client)
- ✅ No blockers for Week 1 work

---

## 📋 WEEK 0 SCHEDULE

### **Day 1 (Monday, Jan 13)** - Goal Model
**Focus**: Create Goal model (quarterly breakdown of Objectives)
**Estimated Hours**: 8 hours
**Deliverables**:
- server/models/Goal.js (200-250 lines)
- Schema, indexes, methods, validators
- Manual CRUD testing

**Tasks**:
- [ ] Morning (4h): Implement Goal model
- [ ] Afternoon (4h): Implement Task model

**See**: [Day_1_2025-01-13.md](./Day_1_2025-01-13.md) for detailed handoff

---

### **Day 2 (Tuesday, Jan 14)** - Invitation & Assessment Models
**Focus**: Create Invitation and Assessment models
**Estimated Hours**: 8 hours
**Deliverables**:
- server/models/Invitation.js (150-180 lines)
- server/models/Assessment.js (180-200 lines)
- Token generation system
- Assessment history tracking

**Tasks**:
- [ ] Morning (3h): Implement Invitation model
- [ ] Afternoon (3h): Implement Assessment model
- [ ] Evening (2h): Test all 4 models together

**See**: [Day_2_2025-01-14.md](./Day_2_2025-01-14.md) for detailed handoff

---

### **Day 3 (Wednesday, Jan 15)** - Goals API Implementation
**Focus**: Build server/routes/goals.js with full CRUD
**Estimated Hours**: 8 hours
**Deliverables**:
- server/routes/goals.js (6 endpoints)
- GET /api/goals (list with filters)
- POST /api/goals (create)
- GET /api/goals/:id (details)
- PUT /api/goals/:id (update)
- DELETE /api/goals/:id (soft delete)
- PUT /api/goals/:id/progress (update progress)

**Tasks**:
- [ ] Morning (4h): Implement GET/POST/GET:id endpoints
- [ ] Afternoon (4h): Implement PUT/DELETE/progress endpoints + testing

**See**: [Day_3_2025-01-15.md](./Day_3_2025-01-15.md) for detailed handoff

---

### **Day 4 (Thursday, Jan 16)** - Tasks API Implementation
**Focus**: Build server/routes/tasks.js with full CRUD
**Estimated Hours**: 8 hours
**Deliverables**:
- server/routes/tasks.js (7 endpoints)
- GET /api/tasks (list with filters)
- POST /api/tasks (create)
- GET /api/tasks/:id (details)
- PUT /api/tasks/:id (update)
- DELETE /api/tasks/:id (soft delete)
- PUT /api/tasks/:id/complete (mark complete)
- GET /api/tasks/my-tasks (today + overdue)

**Tasks**:
- [ ] Morning (4h): Implement GET/POST/GET:id/PUT endpoints
- [ ] Afternoon (4h): Implement DELETE/complete/my-tasks + testing

**See**: [Day_4_2025-01-16.md](./Day_4_2025-01-16.md) for detailed handoff

---

### **Day 5 (Friday, Jan 17)** - Integration & OpenAI Connection
**Focus**: Connect OpenAI to Planner engine + E2E testing
**Estimated Hours**: 8 hours
**Deliverables**:
- OpenAI integration in Planner engine
- Template fallback when OPENAI_API_KEY missing
- End-to-end flow: Assessment → OKR → Goals → Tasks
- Week 0 completion report

**Tasks**:
- [ ] Morning (4h): Move OpenAI from Insights to Planner + fallback
- [ ] Afternoon (3h): E2E testing (create company → assess → generate OKRs → assign goals → create tasks)
- [ ] Evening (1h): Document Week 0 completion + handoff to Week 1

**See**: [Day_5_2025-01-17.md](./Day_5_2025-01-17.md) for detailed handoff

---

## 📊 WEEK 0 PROGRESS TRACKING

### Daily Check-in Format
- **Morning Standup** (9:00 AM): Review yesterday's handoff, set today's goals
- **Midday Check** (12:00 PM): Quick status update (on track / need help)
- **EOD Handoff** (5:00 PM): Complete daily handoff document

### Progress Visualization
```
Day 1: ⬜⬜⬜⬜⬜ (Goal & Task models)
Day 2: ⬜⬜⬜⬜⬜ (Invitation & Assessment models)
Day 3: ⬜⬜⬜⬜⬜ (Goals API)
Day 4: ⬜⬜⬜⬜⬜ (Tasks API)
Day 5: ⬜⬜⬜⬜⬜ (OpenAI + E2E)
```

Update this visualization in each daily handoff:
- ⬜ = Not started
- 🔄 = In progress
- ✅ = Complete
- ❌ = Blocked

---

## 🚧 KNOWN RISKS & MITIGATION

### Risk 1: Model Complexity Underestimated
**Risk**: Models take longer than 4 hours each
**Mitigation**: Start simple, add advanced features later
**Fallback**: Extend Day 1-2 by 1 day, adjust Week 1 timeline

### Risk 2: API Route Testing Takes Too Long
**Mitigation**: Use Postman collections for automated testing
**Fallback**: Manual testing only for Week 0, unit tests in Week 1

### Risk 3: OpenAI Integration Complexity
**Mitigation**: Copy existing code from Insights engine, refactor later
**Fallback**: Template-only mode for Week 0, OpenAI in Week 1

### Risk 4: Cascading Updates Between Models
**Risk**: Goal progress → Objective progress updates might be tricky
**Mitigation**: Start with manual refresh, optimize later
**Fallback**: Manager manually updates Objective progress for Week 0

---

## 🛠️ TOOLS & SETUP

### Required Tools
- **IDE**: VS Code (or preferred)
- **API Testing**: Postman or Thunder Client
- **Database**: MongoDB Compass (for manual data inspection)
- **Git**: GitHub Desktop or command line
- **Terminal**: iTerm2 or built-in terminal

### Environment Setup
```bash
# Clone repo (if not already)
cd /Users/sagarrs/Desktop/official_dev/karvia_business

# Install dependencies
npm install

# Start MongoDB (via Docker)
docker-compose up -d karvia-mongo

# Verify MongoDB connection
docker-compose logs karvia-mongo

# Start main server (for testing)
npm run dev:server

# Start individual engines (as needed)
npm run dev:iam
npm run dev:planner
```

### Database Setup
```bash
# Connect to MongoDB
mongodb://localhost:27017/karvia_business

# Create test business
use karvia_business
db.businesses.insertOne({
  name: "Test Company",
  owner_email: "test@example.com",
  archetype: "explorer",
  status: "active"
})

# Verify
db.businesses.find().pretty()
```

---

## 📚 REFERENCE DOCUMENTS

### Primary References
1. **MASTER_DEV_LIST_FINAL.md** - Single source of truth for tasks
2. **IMPLEMENTATION_STATUS_REPORT.md** - Current state analysis
3. **MVP_STRATEGY_FINAL.md** - Overall MVP strategy

### Model References
- **server/models/Business.js** (240 lines) - Example of well-structured model
- **server/models/User.js** (367 lines) - Example with role-based logic
- **server/models/Objective.js** (417 lines) - Example with cascade logic

### API References
- **server/routes/objectives.js** (6.6 KB) - Example of complete CRUD
- **server/routes/assessments.js** (3.8 KB) - Example of proxy to engine

---

## ✅ WEEK 0 ACCEPTANCE CRITERIA

Week 0 is COMPLETE when ALL of these are true:

### Models Acceptance
- [ ] Goal.js exists with full schema (200+ lines)
- [ ] Task.js exists with full schema (250+ lines)
- [ ] Invitation.js exists with token system (150+ lines)
- [ ] Assessment.js exists for history tracking (180+ lines)
- [ ] All models have proper indexes
- [ ] All models have validation
- [ ] All models have methods (updateProgress, complete, etc.)

### API Routes Acceptance
- [ ] GET /api/goals returns list (with filters)
- [ ] POST /api/goals creates new goal
- [ ] PUT /api/goals/:id updates goal
- [ ] DELETE /api/goals/:id soft-deletes goal
- [ ] PUT /api/goals/:id/progress updates progress & cascades to Objective
- [ ] GET /api/tasks returns list (with filters)
- [ ] POST /api/tasks creates new task
- [ ] PUT /api/tasks/:id updates task
- [ ] DELETE /api/tasks/:id soft-deletes task
- [ ] PUT /api/tasks/:id/complete marks task complete & cascades to Goal
- [ ] GET /api/tasks/my-tasks returns today's tasks + overdue

### Integration Acceptance
- [ ] Can create Goal linked to Objective
- [ ] Goal progress update reflects in Objective
- [ ] Can create Task linked to Goal
- [ ] Task completion updates Goal progress
- [ ] OpenAI generates OKRs when API key present
- [ ] Template fallback works when API key missing
- [ ] End-to-end flow tested: Assess → OKR → Goal → Task

### Testing Acceptance
- [ ] Postman collection with all endpoints created
- [ ] Manual CRUD testing completed for all endpoints
- [ ] Happy path works: Create → Read → Update → Delete
- [ ] Authorization works: Manager can create, Employee can view
- [ ] Cascade works: Task complete → Goal progress → Objective progress

### Documentation Acceptance
- [ ] Daily handoffs completed (Day 1-5)
- [ ] MASTER_DEV_LIST_FINAL.md updated with completed tasks
- [ ] Week 0 summary document created
- [ ] Handoff to Week 1 document created

---

## 🔜 HANDOFF TO WEEK 1

At end of Week 0, create [WEEK_0_SUMMARY.md](./WEEK_0_SUMMARY.md) with:

1. **What Was Accomplished**
   - List all completed tasks
   - Show code metrics (lines written, files created)

2. **What's Working**
   - Demo video or screenshots
   - Proof that E2E flow works

3. **Known Issues**
   - Any bugs found but not fixed
   - Technical debt created

4. **Week 1 Readiness**
   - Confirm no blockers for Week 1 tasks
   - List dependencies ready

5. **Recommendations**
   - What to prioritize in Week 1
   - What to watch out for

---

## 📞 SUPPORT & ESCALATION

### Daily Support
- **Slack**: #karvia-dev
- **Quick Questions**: @engineering-lead
- **Code Review**: Tag @senior-developer

### Blocker Escalation
If blocked for >2 hours:
1. Document blocker in daily handoff
2. Post in #karvia-dev with @engineering-lead
3. Include: Problem, What you tried, What you need

### Emergency Contact
For critical issues (production down, data loss):
1. Slack: @engineering-lead (immediate)
2. Email: lead@example.com
3. Phone: [XXX-XXX-XXXX]

---

## 🎉 WEEK 0 SUCCESS = MVP UNBLOCKED

Completing Week 0 means:
- ✅ All critical models exist
- ✅ Core APIs functional
- ✅ E2E flow proven
- ✅ Team can start Week 1 with confidence
- ✅ 6-8 week timeline to MVP is realistic

**Let's ship this! 🚀**

---

**Kickoff Date**: January 13, 2025
**Target Completion**: January 17, 2025
**Owner**: Development Team
**Status**: READY TO START
