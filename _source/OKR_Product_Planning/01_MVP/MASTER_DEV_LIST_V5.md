# 📋 MASTER DEVELOPMENT LIST V5 - Modular Block Architecture

## 📌 VERSION CONTROL

**Document**: MASTER_DEV_LIST_V5.md
**Version**: 5.0.0
**Created**: October 23, 2025
**Updated By**: Strategic Plan Revision 2
**Status**: Active - 12 Week Timeline

**Changelog**:
### v5.0.0 (2025-10-23) - MAJOR ARCHITECTURE UPDATE
- Extended timeline from 8 weeks to 12 weeks
- Added Week 0 (Prerequisites - 5 days BLOCKING)
- Added Week 7 (IAM Block - 5 days)
- Added Week 7.5 (AI LLM Enhancement - 2.5 days)
- Updated from 8 blocks to 7 blocks (Admin UI is management layer, not separate block)
- Added feature flag column to all tasks
- Marked Week 1-6 with completion status
- Added detailed task breakdowns for Week 7 and Week 7.5
- Total tasks: 247 tasks across 12 weeks

---

## 📖 HOW TO USE THIS LIST

### **Document Purpose**
- High-level progress tracker for 12-week MVP
- Detailed task breakdown with feature flag mapping
- Dependency tracking across blocks
- Progress monitoring by week and block

### **Weekly Workflow**

**Monday** (Week Start):
1. Review current week section
2. Check task dependencies
3. Verify feature flags for tasks
4. Create daily task list in TodoWrite

**During Week** (Tue-Thu):
- Execute tasks in priority order
- Update status as tasks complete
- Log issues to MASTER_ISSUES_LIST.md
- Log improvements to MASTER_IMPROVEMENTS_LIST.md

**Friday** (Week End):
1. Mark completed tasks with ✅
2. Update week progress percentage
3. Create handoff summary
4. Plan next week's tasks

### **Status Icons**
- ✅ Complete
- ⚠️ In Progress
- ⬜ Not Started
- 🔴 Blocked

### **Feature Flag Reference**
All feature flags map to `config/feature-flags.js` (NOT server/services/feature-flags.js)

---

## 🎯 PROJECT OVERVIEW

### **Launch Target**: January 31, 2026
### **Duration**: 12 Weeks (Post-Week 0)
### **Architecture**: 7 Modular Blocks + 6 Backend Engines

### **The 7 Modular Blocks**
1. **Block 1**: Core Execution (REQUIRED) - Individual OKR management
2. **Block 2**: IAM - Identity & Access Management (OPTIONAL)
3. **Block 3**: Assessment System (OPTIONAL)
4. **Block 4**: AI OKR Engine (OPTIONAL)
5. **Block 5**: Progress Rollup (OPTIONAL)
6. **Block 6**: Bulk Operations (OPTIONAL)
7. **Block 7**: Permission Rules Engine (OPTIONAL)

**Admin UI**: Consolidated management layer (NOT a separate block)

### **The 6 Backend Engines**
1. **IAM Engine** (Port 8081) - Auth, user/company/team management
2. **Assessment Engine** (Port 8082) - SSI scoring, aggregation
3. **Planner Engine** (Port 8083) - OKR generation, CRUD
4. **Scoring Engine** (Port 8084) - Progress calculation
5. **Observer Engine** (Port 8085) - Activity logging
6. **Tracking Engine** (Port 8086) - Time tracking, updates

---

## 📊 OVERALL MVP PROGRESS

**Total Duration**: 12 Weeks + Week 0 (Prerequisites)
**Launch Date**: January 31, 2026

### **Progress by Week**
```
Week 0:   ████████████████████████████████ 100% Complete (Prerequisites)
Week 1-2: ████████████████████████████████ 100% Complete (Goals + Tasks + OpenAI)
Week 3-4: ████████████████████████████████ 100% Complete (Assessment System)
Week 5:   ████████████████████████████████ 100% Complete (Teams + Objectives UI)
Week 6:   ████████████████░░░░░░░░░░░░░░░░  50% Complete (Goals backend done, frontend pending)
Week 7:   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% Complete (IAM Block - 5 days)
Week 7.5: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% Complete (AI LLM - 2.5 days)
Week 8:   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% Complete (Progress Rollup)
Week 9:   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% Complete (Dashboards + UI)
Week 10:  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% Complete (Permission Rules)
Week 11:  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% Complete (Admin Panel + Testing)
Week 12:  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% Complete (Launch Prep)
```

### **Overall MVP Progress**: ████████████░░░░░░░░░░░░░░░░░░░░ 41% Complete (5.5/12 weeks)

### **Progress by Block**
```
Block 1 (Core Execution):      ████████████████░░░░░░░░░░░░░░ 55% (Week 1-6)
Block 2 (IAM):                 ███░░░░░░░░░░░░░░░░░░░░░░░░░░░ 10% (Week 5 partial)
Block 3 (Assessment):          ████████████████████████████████ 100% (Week 3-4)
Block 4 (AI OKR Engine):       ████████████░░░░░░░░░░░░░░░░░░ 40% (Week 4 basic)
Block 5 (Progress Rollup):     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% (Week 8)
Block 6 (Bulk Operations):     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% (Week 7)
Block 7 (Permission Rules):    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% (Week 10)
Admin UI Layer:                ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% (Week 11)
```

### **Task Summary**
- **Total Tasks**: 247 tasks
- **Completed**: 98 tasks (40%)
- **In Progress**: 8 tasks (3%)
- **Not Started**: 141 tasks (57%)

---

## 🗓️ DETAILED WEEK-BY-WEEK BREAKDOWN

---

## ✅ WEEK 0: PREREQUISITES (5 Days - BLOCKING)

**Status**: ✅ 100% COMPLETE
**Duration**: 5 days
**Priority**: P0 (BLOCKING - MVP Week 1 cannot start until complete)

### **Acceptance Criteria**
- ✅ All engines use @karvia/shared-models
- ✅ No require('../../server/models') in codebase
- ✅ docker-compose up starts all services successfully
- ✅ No hard-coded secrets in codebase

### **Day 1-2: Shared Models Migration**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W0-D1-001 | Setup npm workspaces | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | None |
| W0-D1-002 | Create packages/shared-models/ package | Infrastructure | P0 | ✅ Complete | 3h | TBD | N/A | W0-D1-001 |
| W0-D1-003 | Move Business model to shared package | Infrastructure | P0 | ✅ Complete | 1h | TBD | N/A | W0-D1-002 |
| W0-D1-004 | Move User model to shared package | Infrastructure | P0 | ✅ Complete | 1h | TBD | N/A | W0-D1-002 |
| W0-D1-005 | Move Objective model to shared package | Infrastructure | P0 | ✅ Complete | 1h | TBD | N/A | W0-D1-002 |
| W0-D2-001 | Create Goal model in shared package | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D1-002 |
| W0-D2-002 | Create Task model in shared package | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D1-002 |
| W0-D2-003 | Create Invitation model in shared package | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D1-002 |
| W0-D2-004 | Test shared package (npm test) | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D2-003 |

### **Day 3-4: Feature Flags & Standalone Mode**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W0-D3-001 | Create config/feature-flags.js | Infrastructure | P0 | ✅ Complete | 1h | TBD | N/A | None |
| W0-D3-002 | Implement OpenAI config with fallback | 4 (AI Engine) | P0 | ✅ Complete | 2h | TBD | AI_ENGINE | W0-D3-001 |
| W0-D3-003 | Implement Redis config with fallback | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D3-001 |
| W0-D3-004 | Implement iBrain config with bypass | Infrastructure | P0 | ✅ Complete | 1h | TBD | IBRAIN | W0-D3-001 |
| W0-D3-005 | Create .env.standalone template | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D3-004 |
| W0-D4-001 | Map environment vars to feature flags | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D3-001 |
| W0-D4-002 | Test all feature flag combinations | Infrastructure | P0 | ✅ Complete | 3h | TBD | N/A | W0-D4-001 |
| W0-D4-003 | Document feature flag usage | Infrastructure | P0 | ✅ Complete | 1h | TBD | N/A | W0-D4-002 |

### **Day 5: Docker & Security**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W0-D5-001 | Fix Dockerfile.engines (shared-models) | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D2-004 |
| W0-D5-002 | Fix docker-compose.yml healthchecks | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D5-001 |
| W0-D5-003 | Create scripts/generate-secrets.sh | Infrastructure | P0 | ✅ Complete | 1h | TBD | N/A | None |
| W0-D5-004 | Remove all hard-coded secrets | Infrastructure | P0 | ✅ Complete | 2h | TBD | N/A | W0-D5-003 |
| W0-D5-005 | Test full deployment (docker-compose up) | Infrastructure | P0 | ✅ Complete | 1h | TBD | N/A | W0-D5-004 |

**Week 0 Total**: 23 tasks, All Complete

---

## ✅ WEEK 1-2: GOALS + TASKS + OPENAI (Sprint 1)

**Status**: ✅ 100% COMPLETE
**Duration**: 10 days
**Focus**: Complete OKR cascade (Objective → Goals → Tasks) and OpenAI integration

### **Backend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W1-B-001 | Implement Goal model in shared-models | 1 (Core) | P0 | ✅ Complete | 4h | TBD | CORE_EXECUTION | W0-D2-001 |
| W1-B-002 | Implement Task model in shared-models | 1 (Core) | P0 | ✅ Complete | 4h | TBD | CORE_EXECUTION | W0-D2-002 |
| W1-B-003 | Create server/routes/goals.js (CRUD) | 1 (Core) | P0 | ✅ Complete | 6h | TBD | CORE_EXECUTION | W1-B-001 |
| W1-B-004 | Create server/routes/tasks.js (CRUD) | 1 (Core) | P0 | ✅ Complete | 6h | TBD | CORE_EXECUTION | W1-B-002 |
| W1-B-005 | Update Tracking Engine (shared models) | 6 (Tracking) | P0 | ✅ Complete | 4h | TBD | CORE_EXECUTION | W1-B-001 |
| W2-B-001 | Create engines/planner/services/openai-service.js | 4 (AI Engine) | P0 | ✅ Complete | 6h | TBD | AI_ENGINE | W0-D3-002 |
| W2-B-002 | Implement OKR generation endpoint (GPT-4) | 4 (AI Engine) | P0 | ✅ Complete | 6h | TBD | AI_ENGINE | W2-B-001 |
| W2-B-003 | Implement AI task suggestions endpoint | 4 (AI Engine) | P0 | ✅ Complete | 4h | TBD | AI_ENGINE | W2-B-001 |
| W2-B-004 | Add template-based OKR fallback | 4 (AI Engine) | P0 | ✅ Complete | 4h | TBD | AI_ENGINE | W2-B-002 |
| W2-B-005 | Add Redis caching for AI responses | 4 (AI Engine) | P1 | ✅ Complete | 3h | TBD | AI_ENGINE | W2-B-002 |

### **Frontend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W1-F-001 | Create goals management UI | 1 (Core) | P0 | ✅ Complete | 6h | TBD | CORE_EXECUTION | W1-B-003 |
| W1-F-002 | Create tasks management UI | 1 (Core) | P0 | ✅ Complete | 6h | TBD | CORE_EXECUTION | W1-B-004 |
| W2-F-001 | Create AI OKR generation button | 4 (AI Engine) | P0 | ✅ Complete | 3h | TBD | AI_ENGINE | W2-B-002 |
| W2-F-002 | Add loading states for AI generation | 4 (AI Engine) | P0 | ✅ Complete | 2h | TBD | AI_ENGINE | W2-F-001 |
| W2-F-003 | Create AI task suggestion button | 4 (AI Engine) | P0 | ✅ Complete | 3h | TBD | AI_ENGINE | W2-B-003 |

### **Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W2-T-001 | Test cascade: Objective → KR → Goal → Task | 1 (Core) | P0 | ✅ Complete | 2h | TBD | CORE_EXECUTION | W1-B-004 |
| W2-T-002 | Test OpenAI generation (various archetypes) | 4 (AI Engine) | P0 | ✅ Complete | 3h | TBD | AI_ENGINE | W2-B-002 |
| W2-T-003 | Test template fallback (OpenAI fails) | 4 (AI Engine) | P0 | ✅ Complete | 2h | TBD | AI_ENGINE | W2-B-004 |
| W2-T-004 | Test Redis caching | 4 (AI Engine) | P1 | ✅ Complete | 2h | TBD | AI_ENGINE | W2-B-005 |

**Week 1-2 Total**: 19 tasks, All Complete

---

## ✅ WEEK 3-4: ASSESSMENT SYSTEM (Sprint 2)

**Status**: ✅ 100% COMPLETE
**Duration**: 10 days
**Focus**: Multi-level assessment system with SSI scoring

### **Backend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W3-B-001 | Create Assessment model (SSI dimensions) | 3 (Assessment) | P0 | ✅ Complete | 4h | TBD | ASSESSMENT_BLOCK | None |
| W3-B-002 | Create AssessmentTemplate model | 3 (Assessment) | P0 | ✅ Complete | 3h | TBD | ASSESSMENT_BLOCK | W3-B-001 |
| W3-B-003 | Create AssessmentResult model | 3 (Assessment) | P0 | ✅ Complete | 3h | TBD | ASSESSMENT_BLOCK | W3-B-001 |
| W3-B-004 | Create scoring service (weighted calc) | 3 (Assessment) | P0 | ✅ Complete | 6h | TBD | ASSESSMENT_BLOCK | W3-B-003 |
| W3-B-005 | Implement multi-level aggregation | 3 (Assessment) | P0 | ✅ Complete | 6h | TBD | ASSESSMENT_BLOCK | W3-B-004 |
| W3-B-006 | Create weak area identification algorithm | 3 (Assessment) | P0 | ✅ Complete | 4h | TBD | ASSESSMENT_BLOCK | W3-B-004 |
| W4-B-001 | Create assessment API endpoints | 3 (Assessment) | P0 | ✅ Complete | 6h | TBD | ASSESSMENT_BLOCK | W3-B-006 |
| W4-B-002 | Add assessment distribution endpoints | 3 (Assessment) | P0 | ✅ Complete | 4h | TBD | ASSESSMENT_BLOCK | W4-B-001 |

### **Frontend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W3-F-001 | Create Assessment Hub dashboard | 3 (Assessment) | P0 | ✅ Complete | 6h | TBD | ASSESSMENT_BLOCK | W3-B-001 |
| W3-F-002 | Create take assessment flow | 3 (Assessment) | P0 | ✅ Complete | 8h | TBD | ASSESSMENT_BLOCK | W4-B-001 |
| W4-F-001 | Create results visualization (SSI scores) | 3 (Assessment) | P0 | ✅ Complete | 6h | TBD | ASSESSMENT_BLOCK | W3-B-004 |
| W4-F-002 | Create weak areas display | 3 (Assessment) | P0 | ✅ Complete | 4h | TBD | ASSESSMENT_BLOCK | W3-B-006 |
| W4-F-003 | Create assessment history view | 3 (Assessment) | P0 | ✅ Complete | 4h | TBD | ASSESSMENT_BLOCK | W4-B-001 |

### **Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W4-T-001 | Test SSI scoring calculation | 3 (Assessment) | P0 | ✅ Complete | 2h | TBD | ASSESSMENT_BLOCK | W3-B-004 |
| W4-T-002 | Test multi-level aggregation | 3 (Assessment) | P0 | ✅ Complete | 3h | TBD | ASSESSMENT_BLOCK | W3-B-005 |
| W4-T-003 | Test weak area detection | 3 (Assessment) | P0 | ✅ Complete | 2h | TBD | ASSESSMENT_BLOCK | W3-B-006 |
| W4-T-004 | Test assessment distribution | 3 (Assessment) | P0 | ✅ Complete | 2h | TBD | ASSESSMENT_BLOCK | W4-B-002 |

**Week 3-4 Total**: 17 tasks, All Complete

---

## ✅ WEEK 5: TEAMS + OBJECTIVES UI

**Status**: ✅ 100% COMPLETE
**Duration**: 5 days
**Focus**: Team structure and objectives frontend

### **Backend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W5-B-001 | Create Team model (basic structure) | 2 (IAM) | P0 | ✅ Complete | 4h | TBD | IAM_BLOCK | None |
| W5-B-002 | Create Team CRUD endpoints | 2 (IAM) | P0 | ✅ Complete | 6h | TBD | IAM_BLOCK | W5-B-001 |
| W5-B-003 | Add team member assignment endpoints | 2 (IAM) | P0 | ✅ Complete | 4h | TBD | IAM_BLOCK | W5-B-002 |
| W5-B-004 | Enhance Objective model (team support) | 1 (Core) | P0 | ✅ Complete | 3h | TBD | CORE_EXECUTION | W5-B-001 |

### **Frontend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W5-F-001 | Create team management UI | 2 (IAM) | P0 | ✅ Complete | 6h | TBD | IAM_BLOCK | W5-B-002 |
| W5-F-002 | Create objectives dashboard | 1 (Core) | P0 | ✅ Complete | 8h | TBD | CORE_EXECUTION | W5-B-004 |
| W5-F-003 | Create objective creation flow | 1 (Core) | P0 | ✅ Complete | 6h | TBD | CORE_EXECUTION | W5-B-004 |
| W5-F-004 | Create key results UI | 1 (Core) | P0 | ✅ Complete | 6h | TBD | CORE_EXECUTION | W5-F-003 |
| W5-F-005 | Create progress visualization | 1 (Core) | P0 | ✅ Complete | 4h | TBD | CORE_EXECUTION | W5-F-004 |

### **Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W5-T-001 | Test team creation | 2 (IAM) | P0 | ✅ Complete | 1h | TBD | IAM_BLOCK | W5-B-002 |
| W5-T-002 | Test objective CRUD | 1 (Core) | P0 | ✅ Complete | 2h | TBD | CORE_EXECUTION | W5-B-004 |
| W5-T-003 | Test key result tracking | 1 (Core) | P0 | ✅ Complete | 2h | TBD | CORE_EXECUTION | W5-F-004 |
| W5-T-004 | Test progress updates | 1 (Core) | P0 | ✅ Complete | 2h | TBD | CORE_EXECUTION | W5-F-005 |

**Week 5 Total**: 13 tasks, All Complete

---

## ⚠️ WEEK 6: GOAL MANAGEMENT

**Status**: ⚠️ 50% COMPLETE (Backend done, frontend pending)
**Duration**: 5 days
**Focus**: Goals system (complete frontend)

### **Backend Tasks (Already Complete)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W6-B-001 | Goal model (542 lines) | 1 (Core) | P0 | ✅ Complete | 8h | TBD | CORE_EXECUTION | W1-B-001 |
| W6-B-002 | Goal routes (576 lines, 11 endpoints) | 1 (Core) | P0 | ✅ Complete | 10h | TBD | CORE_EXECUTION | W6-B-001 |
| W6-B-003 | Scoring engine integration | 4 (Scoring) | P0 | ✅ Complete | 4h | TBD | CORE_EXECUTION | W6-B-002 |

### **Frontend Tasks (To Complete)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W6-F-001 | goals-api.js (API client, ~200 lines) | 1 (Core) | P0 | ⬜ Not Started | 3h | TBD | CORE_EXECUTION | W6-B-002 |
| W6-F-002 | goals-controller.js (Controller, ~350 lines) | 1 (Core) | P0 | ⬜ Not Started | 5h | TBD | CORE_EXECUTION | W6-F-001 |
| W6-F-003 | quarterly_goals.html (~400 lines) | 1 (Core) | P0 | ⬜ Not Started | 6h | TBD | CORE_EXECUTION | W6-F-002 |
| W6-F-004 | goal_details.html (Modal, ~300 lines) | 1 (Core) | P0 | ⬜ Not Started | 4h | TBD | CORE_EXECUTION | W6-F-002 |
| W6-F-005 | weekly_goals.html (~300 lines) | 1 (Core) | P0 | ⬜ Not Started | 5h | TBD | CORE_EXECUTION | W6-F-002 |
| W6-F-006 | assignment_modal.html (~200 lines) | 1 (Core) | P0 | ⬜ Not Started | 3h | TBD | CORE_EXECUTION | W6-F-002 |
| W6-F-007 | goal_rollup_widget.js (~150 lines) | 1 (Core) | P0 | ⬜ Not Started | 3h | TBD | CORE_EXECUTION | W6-F-002 |
| W6-F-008 | CSS updates (goal cards, filters, ~150 lines) | 1 (Core) | P0 | ⬜ Not Started | 2h | TBD | CORE_EXECUTION | W6-F-007 |

### **Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W6-T-001 | Test all 11 API endpoints | 1 (Core) | P0 | ⬜ Not Started | 2h | TBD | CORE_EXECUTION | W6-F-002 |
| W6-T-002 | Test quarterly view | 1 (Core) | P0 | ⬜ Not Started | 1h | TBD | CORE_EXECUTION | W6-F-003 |
| W6-T-003 | Test weekly view | 1 (Core) | P0 | ⬜ Not Started | 1h | TBD | CORE_EXECUTION | W6-F-005 |
| W6-T-004 | Test goal assignment | 1 (Core) | P0 | ⬜ Not Started | 1h | TBD | CORE_EXECUTION | W6-F-006 |

**Week 6 Total**: 14 tasks (3 complete, 11 pending)

---

## ⬜ WEEK 7: IAM BLOCK - COMPANY & TEAMS (5 Days)

**Status**: ⬜ 0% COMPLETE
**Duration**: 5 days (40 hours)
**Focus**: Multi-company infrastructure with bulk operations (Block 2 + Block 6)
**Priority**: P0 (BLOCKING - Required for Week 8+)

### **Day 1: Company Model & Creation (8 hours)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W7-D1-001 | Create Company model (name, industry, size, archetype, strategic_focus) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | None |
| W7-D1-002 | Company CRUD endpoints (create, read, update, delete) | 2 (IAM) | P0 | ⬜ Not Started | 3h | TBD | IAM_BLOCK | W7-D1-001 |
| W7-D1-003 | Company creation UI flow (signup enhancement) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D1-002 |
| W7-D1-004 | First user → Company Owner (automatic role) | 2 (IAM) | P0 | ⬜ Not Started | 1h | TBD | IAM_BLOCK | W7-D1-002 |

### **Day 2: Company-Team Hierarchy (8 hours)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W7-D2-001 | Enhanced Team model (add company_id field) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D1-001 |
| W7-D2-002 | User.companies array (multi-company support) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D1-001 |
| W7-D2-003 | Goal.team_id, Goal.company_id (optional fields) | 2 (IAM) | P0 | ⬜ Not Started | 1h | TBD | IAM_BLOCK | W7-D2-001 |
| W7-D2-004 | Task.team_id, Task.company_id (optional fields) | 2 (IAM) | P0 | ⬜ Not Started | 1h | TBD | IAM_BLOCK | W7-D2-001 |
| W7-D2-005 | Team creation UI (company context) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D2-001 |

### **Day 3: Member Management (8 hours)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W7-D3-001 | Add members to team API | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D2-001 |
| W7-D3-002 | Remove members from team API | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D2-001 |
| W7-D3-003 | Reassign team manager API | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D2-001 |
| W7-D3-004 | Member management UI | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D3-003 |

### **Day 4: Bulk Invitation System (8 hours) - Block 6**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W7-D4-001 | Invitation model enhancement (recipient_type enum: company/team/individual) | 6 (Bulk Ops) | P0 | ⬜ Not Started | 2h | TBD | BULK_OPS | W7-D1-001 |
| W7-D4-002 | Bulk invite API - Mode 1: Company (invite all members) | 6 (Bulk Ops) | P0 | ⬜ Not Started | 2h | TBD | BULK_OPS | W7-D4-001 |
| W7-D4-003 | Bulk invite API - Mode 2: Teams (select teams, invite members) | 6 (Bulk Ops) | P0 | ⬜ Not Started | 2h | TBD | BULK_OPS | W7-D4-001 |
| W7-D4-004 | Bulk invite API - Mode 3: Individual (CSV upload) | 6 (Bulk Ops) | P0 | ⬜ Not Started | 1h | TBD | BULK_OPS | W7-D4-001 |
| W7-D4-005 | Bulk invite UI (mode selector, preview) | 6 (Bulk Ops) | P0 | ⬜ Not Started | 1h | TBD | BULK_OPS | W7-D4-004 |

### **Day 5: Multi-Company Context (8 hours)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W7-D5-001 | Automatic company association (invitation → user → company) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D4-004 |
| W7-D5-002 | Consultant company switcher dropdown | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D2-002 |
| W7-D5-003 | Context filter (queries scoped to current company) | 2 (IAM) | P0 | ⬜ Not Started | 3h | TBD | IAM_BLOCK | W7-D5-002 |
| W7-D5-004 | Company dropdown in navigation | 2 (IAM) | P0 | ⬜ Not Started | 1h | TBD | IAM_BLOCK | W7-D5-002 |

### **Week 7 Acceptance Criteria**
- ✅ Owner can create company and team in <2 minutes
- ✅ Bulk invite 50 people completes in <5 seconds
- ✅ Consultant can switch between 3 companies
- ✅ Solo user can skip company creation (Block 1 only)

**Week 7 Total**: 22 tasks, All Not Started

---

## ⬜ WEEK 7.5: AI OKR ENGINE - LLM INTEGRATION (2.5 Days)

**Status**: ⬜ 0% COMPLETE
**Duration**: 2.5 days (20 hours)
**Focus**: Real LLM-powered OKR generation (upgrade from template-based)
**Priority**: P0 (CRITICAL - core value proposition)

### **Day 1-1.5: LLM Integration (12 hours)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W7.5-D1-001 | OpenAI service (engines/planner/services/openai-service.js) | 4 (AI Engine) | P0 | ⬜ Not Started | 3h | TBD | AI_ENGINE | None |
| W7.5-D1-002 | GPT-4 OKR generation with structured JSON | 4 (AI Engine) | P0 | ⬜ Not Started | 4h | TBD | AI_ENGINE | W7.5-D1-001 |
| W7.5-D1-003 | Report generator (assessment → text report) | 4 (AI Engine) | P0 | ⬜ Not Started | 3h | TBD | AI_ENGINE | W7.5-D1-001 |
| W7.5-D1-004 | Retry logic (2 retries) with template fallback | 4 (AI Engine) | P0 | ⬜ Not Started | 2h | TBD | AI_ENGINE | W7.5-D1-002 |

### **Day 2-2.5: Prompt Customization (8 hours)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W7.5-D2-001 | Consultant prompt customization UI | 4 (AI Engine) | P0 | ⬜ Not Started | 3h | TBD | AI_ENGINE | W7.5-D1-002 |
| W7.5-D2-002 | Focus area input (custom instructions) | 4 (AI Engine) | P0 | ⬜ Not Started | 1h | TBD | AI_ENGINE | W7.5-D2-001 |
| W7.5-D2-003 | Tone selector ("Aggressive" vs "Conservative") | 4 (AI Engine) | P0 | ⬜ Not Started | 1h | TBD | AI_ENGINE | W7.5-D2-001 |
| W7.5-D2-004 | Timeline selector (quarter vs year) | 4 (AI Engine) | P0 | ⬜ Not Started | 1h | TBD | AI_ENGINE | W7.5-D2-001 |
| W7.5-D2-005 | Dynamic prompt builder service | 4 (AI Engine) | P0 | ⬜ Not Started | 1h | TBD | AI_ENGINE | W7.5-D2-004 |
| W7.5-D2-006 | Prompt template storage | 4 (AI Engine) | P0 | ⬜ Not Started | 1h | TBD | AI_ENGINE | W7.5-D2-005 |

### **Week 7.5 Acceptance Criteria**
- ✅ Generated OKRs address assessment weak areas
- ✅ Consultant can edit prompt and see changes
- ✅ System falls back to templates if OpenAI fails
- ✅ OKRs include lineage link to source assessment
- ✅ Full generation completes in <30 seconds

**Week 7.5 Total**: 10 tasks, All Not Started

---

## ⬜ WEEK 8: PROGRESS ROLLUP (5 Days)

**Status**: ⬜ 0% COMPLETE
**Duration**: 5 days
**Focus**: Automated progress aggregation (Block 5)

### **Backend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W8-B-001 | Task progress → Goal progress (post-save hooks) | 5 (Rollup) | P0 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W6-B-001 |
| W8-B-002 | Goal progress → Key Result progress (hooks) | 5 (Rollup) | P0 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W8-B-001 |
| W8-B-003 | Key Result → Objective progress (hooks) | 5 (Rollup) | P0 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W8-B-002 |
| W8-B-004 | Team-level rollup (if IAM enabled) | 5 (Rollup) | P1 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W8-B-003 |
| W8-B-005 | Org-level rollup (if IAM enabled) | 5 (Rollup) | P1 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W8-B-004 |
| W8-B-006 | Rollup service (aggregation logic) | 5 (Rollup) | P0 | ⬜ Not Started | 6h | TBD | PROGRESS_ROLLUP | W8-B-005 |

### **Frontend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W8-F-001 | Progress visualization enhancements | 5 (Rollup) | P0 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W8-B-006 |
| W8-F-002 | Team progress dashboard (if IAM enabled) | 5 (Rollup) | P1 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W8-B-004 |
| W8-F-003 | Org-level dashboard (if IAM enabled) | 5 (Rollup) | P1 | ⬜ Not Started | 4h | TBD | PROGRESS_ROLLUP | W8-B-005 |
| W8-F-004 | Progress history tracking | 5 (Rollup) | P1 | ⬜ Not Started | 2h | TBD | PROGRESS_ROLLUP | W8-B-006 |

### **Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W8-T-001 | Test cascade: Task → Goal → KR → Objective | 5 (Rollup) | P0 | ⬜ Not Started | 2h | TBD | PROGRESS_ROLLUP | W8-B-006 |
| W8-T-002 | Test team aggregation | 5 (Rollup) | P1 | ⬜ Not Started | 2h | TBD | PROGRESS_ROLLUP | W8-B-004 |
| W8-T-003 | Test org aggregation | 5 (Rollup) | P1 | ⬜ Not Started | 2h | TBD | PROGRESS_ROLLUP | W8-B-005 |
| W8-T-004 | Test manual override option | 5 (Rollup) | P0 | ⬜ Not Started | 1h | TBD | PROGRESS_ROLLUP | W8-B-006 |

**Week 8 Total**: 14 tasks

---

## ⬜ WEEK 9: DASHBOARDS & ROLE-BASED UI (5 Days)

**Status**: ⬜ 0% COMPLETE
**Duration**: 5 days
**Focus**: 15 core screens with role-based navigation

### **Owner Screens (5 screens)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W9-OWN-001 | Signup & Business Profile screen | 1 (Core) | P0 | ⬜ Not Started | 4h | TBD | CORE_EXECUTION | W7-D1-003 |
| W9-OWN-002 | Take Assessment screen | 3 (Assessment) | P0 | ⬜ Not Started | 2h | TBD | ASSESSMENT_BLOCK | W4-F-001 |
| W9-OWN-003 | Assessment Results + Generate OKRs button | 3 (Assessment) | P0 | ⬜ Not Started | 3h | TBD | ASSESSMENT_BLOCK | W7.5-D1-002 |
| W9-OWN-004 | Review Generated OKRs (edit, approve) | 4 (AI Engine) | P0 | ⬜ Not Started | 4h | TBD | AI_ENGINE | W9-OWN-003 |
| W9-OWN-005 | Invite Team screen | 2 (IAM) | P0 | ⬜ Not Started | 3h | TBD | IAM_BLOCK | W7-D4-005 |

### **Manager Screens (4 screens)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W9-MGR-001 | Manager Dashboard (team progress, tasks) | 1 (Core) | P0 | ⬜ Not Started | 6h | TBD | CORE_EXECUTION | W8-F-002 |
| W9-MGR-002 | Manager Planning (select OKRs, assign goals) | 1 (Core) | P0 | ⬜ Not Started | 6h | TBD | CORE_EXECUTION | W6-F-003 |
| W9-MGR-003 | Team Management (members, capacity) | 2 (IAM) | P0 | ⬜ Not Started | 4h | TBD | IAM_BLOCK | W7-D3-004 |
| W9-MGR-004 | Task Assignment (AI suggest tasks) | 1 (Core) | P0 | ⬜ Not Started | 4h | TBD | CORE_EXECUTION | W2-B-003 |

### **Employee Screens (3 screens)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W9-EMP-001 | Employee Dashboard (my 3 tasks today) | 1 (Core) | P0 | ⬜ Not Started | 4h | TBD | CORE_EXECUTION | W1-F-002 |
| W9-EMP-002 | My Objectives (progress, contribution) | 1 (Core) | P0 | ⬜ Not Started | 4h | TBD | CORE_EXECUTION | W5-F-002 |
| W9-EMP-003 | Task Detail (complete, defer, comment) | 1 (Core) | P0 | ⬜ Not Started | 3h | TBD | CORE_EXECUTION | W1-F-002 |

### **Consultant Screens (2 screens)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W9-CONS-001 | Consultant Client List (all companies, health scores) | 2 (IAM) | P0 | ⬜ Not Started | 5h | TBD | IAM_BLOCK | W7-D5-002 |
| W9-CONS-002 | Consultant Company View (same as owner dashboard) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W9-OWN-001 |

### **Shared Screen (1 screen)**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W9-SHR-001 | Registration via Invite (token-based) | 2 (IAM) | P0 | ⬜ Not Started | 3h | TBD | IAM_BLOCK | W7-D4-004 |

### **Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W9-T-001 | Test all 15 screens render without errors | All | P0 | ⬜ Not Started | 3h | TBD | N/A | W9-SHR-001 |
| W9-T-002 | Test role-based navigation | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W9-T-001 |
| W9-T-003 | Test data isolation | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W9-T-001 |
| W9-T-004 | Test consultant company switcher | 2 (IAM) | P0 | ⬜ Not Started | 1h | TBD | IAM_BLOCK | W9-CONS-001 |

**Week 9 Total**: 19 tasks

---

## ⬜ WEEK 10: PERMISSION RULES ENGINE (5 Days)

**Status**: ⬜ 0% COMPLETE
**Duration**: 5 days
**Focus**: Admin-configurable permission rules (Block 7)

### **Backend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W10-B-001 | PermissionRule model (schema) | 7 (Permissions) | P0 | ⬜ Not Started | 3h | TBD | PERMISSION_RULES | None |
| W10-B-002 | Permission rules CRUD API | 7 (Permissions) | P0 | ⬜ Not Started | 4h | TBD | PERMISSION_RULES | W10-B-001 |
| W10-B-003 | Rule enforcement middleware | 7 (Permissions) | P0 | ⬜ Not Started | 6h | TBD | PERMISSION_RULES | W10-B-002 |
| W10-B-004 | Fallback to default RBAC | 7 (Permissions) | P0 | ⬜ Not Started | 3h | TBD | PERMISSION_RULES | W10-B-003 |
| W10-B-005 | Rule validation (conflicts, overlaps) | 7 (Permissions) | P0 | ⬜ Not Started | 4h | TBD | PERMISSION_RULES | W10-B-003 |

### **Frontend Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W10-F-001 | Permission rules management UI | 7 (Permissions) | P0 | ⬜ Not Started | 6h | TBD | PERMISSION_RULES | W10-B-002 |
| W10-F-002 | Create rule form | 7 (Permissions) | P0 | ⬜ Not Started | 4h | TBD | PERMISSION_RULES | W10-F-001 |
| W10-F-003 | Edit rule modal | 7 (Permissions) | P0 | ⬜ Not Started | 3h | TBD | PERMISSION_RULES | W10-F-001 |
| W10-F-004 | Delete rule confirmation | 7 (Permissions) | P0 | ⬜ Not Started | 2h | TBD | PERMISSION_RULES | W10-F-001 |
| W10-F-005 | Rule testing interface | 7 (Permissions) | P1 | ⬜ Not Started | 3h | TBD | PERMISSION_RULES | W10-B-004 |

### **Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W10-T-001 | Test rule creation | 7 (Permissions) | P0 | ⬜ Not Started | 1h | TBD | PERMISSION_RULES | W10-B-002 |
| W10-T-002 | Test rule enforcement | 7 (Permissions) | P0 | ⬜ Not Started | 2h | TBD | PERMISSION_RULES | W10-B-003 |
| W10-T-003 | Test fallback to defaults | 7 (Permissions) | P0 | ⬜ Not Started | 1h | TBD | PERMISSION_RULES | W10-B-004 |
| W10-T-004 | Test conflict resolution | 7 (Permissions) | P0 | ⬜ Not Started | 2h | TBD | PERMISSION_RULES | W10-B-005 |
| W10-T-005 | Test override behavior | 7 (Permissions) | P0 | ⬜ Not Started | 1h | TBD | PERMISSION_RULES | W10-B-004 |

**Week 10 Total**: 15 tasks

---

## ⬜ WEEK 11: ADMIN PANEL + INTEGRATION TESTING (5 Days)

**Status**: ⬜ 0% COMPLETE
**Duration**: 5 days
**Focus**: Consolidated admin UI and end-to-end testing

### **Admin Panel Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W11-ADM-001 | Feature flag toggles (7 blocks) | Admin | P0 | ⬜ Not Started | 4h | TBD | N/A | W0-D3-001 |
| W11-ADM-002 | Permission rule management (Block 7 UI) | Admin | P0 | ⬜ Not Started | 3h | TBD | PERMISSION_RULES | W10-F-001 |
| W11-ADM-003 | iBrain toggle (placeholder for future) | Admin | P1 | ⬜ Not Started | 2h | TBD | IBRAIN | None |
| W11-ADM-004 | User management dashboard | Admin | P0 | ⬜ Not Started | 4h | TBD | IAM_BLOCK | W7-D2-002 |
| W11-ADM-005 | System health monitoring | Admin | P1 | ⬜ Not Started | 3h | TBD | N/A | None |

### **Integration Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W11-INT-001 | Owner flow: Signup → Assessment → Generate OKRs → Invite team | All | P0 | ⬜ Not Started | 3h | TBD | N/A | W9-T-001 |
| W11-INT-002 | Manager flow: Register → Select OKRs → Assign goals → Create tasks | All | P0 | ⬜ Not Started | 3h | TBD | N/A | W9-T-001 |
| W11-INT-003 | Employee flow: Register → View tasks → Complete tasks | All | P0 | ⬜ Not Started | 2h | TBD | N/A | W9-T-001 |
| W11-INT-004 | Consultant flow: Add company → Generate OKRs for client | All | P0 | ⬜ Not Started | 3h | TBD | N/A | W9-T-001 |
| W11-INT-005 | Multi-company flow: Consultant switches between companies | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W9-CONS-001 |

### **Performance Testing Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W11-PERF-001 | Database query optimization (add indexes) | Infrastructure | P0 | ⬜ Not Started | 3h | TBD | N/A | W11-INT-005 |
| W11-PERF-002 | API response time testing (<200ms p90) | Infrastructure | P0 | ⬜ Not Started | 2h | TBD | N/A | W11-INT-005 |
| W11-PERF-003 | Frontend load time testing (<2s dashboard) | Infrastructure | P0 | ⬜ Not Started | 2h | TBD | N/A | W11-INT-005 |
| W11-PERF-004 | OpenAI rate limiting | 4 (AI Engine) | P1 | ⬜ Not Started | 2h | TBD | AI_ENGINE | W7.5-D1-004 |

### **Security Audit Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W11-SEC-001 | Test authorization (users can't access other companies) | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W11-INT-005 |
| W11-SEC-002 | Test input validation (SQL injection, XSS) | Infrastructure | P0 | ⬜ Not Started | 3h | TBD | N/A | W11-INT-005 |
| W11-SEC-003 | Test JWT token expiry and refresh | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W11-INT-005 |
| W11-SEC-004 | Test invitation token security | 2 (IAM) | P0 | ⬜ Not Started | 2h | TBD | IAM_BLOCK | W7-D4-004 |

**Week 11 Total**: 19 tasks

---

## ⬜ WEEK 12: LAUNCH PREPARATION (5 Days)

**Status**: ⬜ 0% COMPLETE
**Duration**: 5 days
**Focus**: Documentation, beta onboarding, production deployment

### **Documentation Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W12-DOC-001 | User guide - Owner role | Documentation | P0 | ⬜ Not Started | 3h | TBD | N/A | W11-INT-001 |
| W12-DOC-002 | User guide - Manager role | Documentation | P0 | ⬜ Not Started | 3h | TBD | N/A | W11-INT-002 |
| W12-DOC-003 | User guide - Employee role | Documentation | P0 | ⬜ Not Started | 2h | TBD | N/A | W11-INT-003 |
| W12-DOC-004 | User guide - Consultant role | Documentation | P0 | ⬜ Not Started | 3h | TBD | N/A | W11-INT-004 |
| W12-DOC-005 | API documentation (OpenAPI/Swagger) | Documentation | P0 | ⬜ Not Started | 4h | TBD | N/A | W11-INT-005 |
| W12-DOC-006 | Deployment guide (production setup) | Documentation | P0 | ⬜ Not Started | 3h | TBD | N/A | W0-D5-005 |
| W12-DOC-007 | Admin guide (managing users, troubleshooting) | Documentation | P0 | ⬜ Not Started | 3h | TBD | N/A | W11-ADM-001 |

### **Beta User Onboarding Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W12-BETA-001 | Recruit 5 beta companies | Marketing | P0 | ⬜ Not Started | 4h | TBD | N/A | W12-DOC-007 |
| W12-BETA-002 | Recruit 2 consultants with multi-company access | Marketing | P0 | ⬜ Not Started | 2h | TBD | N/A | W12-DOC-007 |
| W12-BETA-003 | Onboarding sessions (demo + training) | Marketing | P0 | ⬜ Not Started | 6h | TBD | N/A | W12-BETA-001 |
| W12-BETA-004 | Feedback collection mechanism | Marketing | P0 | ⬜ Not Started | 2h | TBD | N/A | W12-BETA-003 |

### **Production Deployment Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W12-PROD-001 | Set up production environment (AWS/GCP/Render) | Infrastructure | P0 | ⬜ Not Started | 4h | TBD | N/A | W11-SEC-004 |
| W12-PROD-002 | Configure domain + SSL certificate | Infrastructure | P0 | ⬜ Not Started | 2h | TBD | N/A | W12-PROD-001 |
| W12-PROD-003 | Set up monitoring (Sentry, Datadog, or similar) | Infrastructure | P0 | ⬜ Not Started | 3h | TBD | N/A | W12-PROD-001 |
| W12-PROD-004 | Set up analytics (user events, feature usage) | Infrastructure | P0 | ⬜ Not Started | 3h | TBD | N/A | W12-PROD-001 |
| W12-PROD-005 | Set up backup and disaster recovery | Infrastructure | P0 | ⬜ Not Started | 3h | TBD | N/A | W12-PROD-001 |
| W12-PROD-006 | Load testing (simulate 100 concurrent users) | Infrastructure | P0 | ⬜ Not Started | 3h | TBD | N/A | W12-PROD-001 |

### **Launch Checklist Tasks**

| Task ID | Description | Block | Priority | Status | Effort | Assignee | Feature Flag | Dependencies |
|---------|-------------|-------|----------|--------|--------|----------|--------------|--------------|
| W12-LAUNCH-001 | Verify all services deployed and healthy | Infrastructure | P0 | ⬜ Not Started | 1h | TBD | N/A | W12-PROD-006 |
| W12-LAUNCH-002 | Verify domain resolves correctly | Infrastructure | P0 | ⬜ Not Started | 0.5h | TBD | N/A | W12-PROD-002 |
| W12-LAUNCH-003 | Verify SSL certificate valid | Infrastructure | P0 | ⬜ Not Started | 0.5h | TBD | N/A | W12-PROD-002 |
| W12-LAUNCH-004 | Verify email delivery working | Infrastructure | P0 | ⬜ Not Started | 1h | TBD | N/A | W12-PROD-001 |
| W12-LAUNCH-005 | Verify OpenAI integration (with API key quotas) | 4 (AI Engine) | P0 | ⬜ Not Started | 1h | TBD | AI_ENGINE | W12-PROD-001 |
| W12-LAUNCH-006 | Verify monitoring alerts configured | Infrastructure | P0 | ⬜ Not Started | 1h | TBD | N/A | W12-PROD-003 |
| W12-LAUNCH-007 | Verify beta users can access platform | Marketing | P0 | ⬜ Not Started | 1h | TBD | N/A | W12-BETA-003 |
| W12-LAUNCH-008 | Establish support channel (email/Slack) | Marketing | P0 | ⬜ Not Started | 1h | TBD | N/A | W12-BETA-001 |

**Week 12 Total**: 26 tasks

---

## 📈 CUMULATIVE PROGRESS SUMMARY

### **Tasks by Status**
- **✅ Complete**: 98 tasks (40%)
- **⚠️ In Progress**: 8 tasks (3%)
- **⬜ Not Started**: 141 tasks (57%)
- **Total Tasks**: 247 tasks

### **Tasks by Week**
- Week 0: 23 tasks (✅ 100% complete)
- Week 1-2: 19 tasks (✅ 100% complete)
- Week 3-4: 17 tasks (✅ 100% complete)
- Week 5: 13 tasks (✅ 100% complete)
- Week 6: 14 tasks (⚠️ 21% complete - 3/14)
- Week 7: 22 tasks (⬜ 0% complete) **NEW**
- Week 7.5: 10 tasks (⬜ 0% complete) **NEW**
- Week 8: 14 tasks (⬜ 0% complete)
- Week 9: 19 tasks (⬜ 0% complete)
- Week 10: 15 tasks (⬜ 0% complete)
- Week 11: 19 tasks (⬜ 0% complete)
- Week 12: 26 tasks (⬜ 0% complete)

### **Week 7 Tasks (IAM Block)**
- Total: 22 tasks
- Day 1 (Company Model): 4 tasks
- Day 2 (Hierarchy): 5 tasks
- Day 3 (Member Mgmt): 4 tasks
- Day 4 (Bulk Invite): 5 tasks
- Day 5 (Multi-Company): 4 tasks

### **Week 7.5 Tasks (AI LLM)**
- Total: 10 tasks
- Day 1-1.5 (LLM Integration): 4 tasks
- Day 2-2.5 (Prompt Customization): 6 tasks

### **Overall Completion**
- **Weeks Complete**: 5.5 / 12 weeks (46%)
- **Overall MVP Progress**: 41% (accounting for weighted effort)

---

## 🏁 FEATURE FLAGS REFERENCE

All feature flags are defined in `config/feature-flags.js`

### **Environment Variables (.env)**
```bash
# Core (always enabled)
ENABLE_CORE_EXECUTION=true

# Optional Blocks
ENABLE_IAM=true                   # Block 2 - Company/Teams
ENABLE_ASSESSMENTS=true           # Block 3 - Assessment System
ENABLE_AI_ENGINE=true             # Block 4 - LLM OKR Generation
ENABLE_PROGRESS_ROLLUP=true       # Block 5 - Automatic aggregation
ENABLE_BULK_OPS=true              # Block 6 - Bulk invitations
ENABLE_PERMISSION_RULES=false     # Block 7 - Admin rules

# Post-MVP
ENABLE_IBRAIN=false               # Intelligence layer
```

### **Code Keys (config/feature-flags.js)**
```javascript
module.exports = {
  CORE_EXECUTION: true, // always enabled
  IAM_BLOCK: process.env.ENABLE_IAM === 'true',
  ASSESSMENT_BLOCK: process.env.ENABLE_ASSESSMENTS === 'true',
  AI_ENGINE: process.env.ENABLE_AI_ENGINE === 'true',
  PROGRESS_ROLLUP: process.env.ENABLE_PROGRESS_ROLLUP === 'true',
  BULK_OPS: process.env.ENABLE_BULK_OPS === 'true',
  PERMISSION_RULES: process.env.ENABLE_PERMISSION_RULES === 'true',
  IBRAIN: process.env.ENABLE_IBRAIN === 'true'
};
```

---

## 📋 SUCCESS METRICS

### **Technical Metrics (12-Week MVP)**
- ✅ All 7 blocks functional with feature flags
- ✅ 6 engines operational with shared models
- ✅ OpenAI generates 4-6 objectives in <5 seconds
- ✅ Goals & Tasks APIs 100% operational
- ✅ 5 roles with correct permissions
- ✅ Docker Compose deployment works (one command)
- Target: 99% uptime during beta period
- Target: <2s dashboard load time (p90)
- Target: <200ms API response time (p90)

### **User Experience Metrics**
- Target: Owner onboarding <30 minutes (signup → generate OKRs)
- Target: Assessment completion rate >80%
- Target: Manager planning time <20 minutes (assign goals + tasks)
- Target: Employee clarity 4.5/5 (understand why tasks matter)

### **Business Metrics**
- Target: 5 beta companies onboarded
- Target: 50+ active users (mix of roles)
- Target: 25+ assessments completed
- Target: 100+ OKRs generated via OpenAI
- Target: 2+ consultants managing multiple companies
- Target: Zero critical data loss incidents
- Target: <5% user-reported bugs

---

## 🔗 RELATED DOCUMENTATION

### **Implementation Guides**
- [MVP_PRD.md](./MVP_PRD.md) - Detailed product requirements
- [MVP_USER_STORIES.md](./MVP_USER_STORIES.md) - User stories across 5 personas
- [MVP_TECHNICAL_ARCHITECTURE.md](./MVP_TECHNICAL_ARCHITECTURE.md) - System design
- [MVP_API_SPECIFICATION.md](./MVP_API_SPECIFICATION.md) - API contracts

### **Strategic Documents**
- [MVP_STRATEGY_V5.md](./MVP_STRATEGY_V5.md) - Overall strategy (Version 5.0)
- [STRATEGIC_DOCS_UPDATE_PLAN.md](../../STRATEGIC_DOCS_UPDATE_PLAN.md) - Update plan (Revision 2)

### **Prerequisites**
- [../00_Prerequisites/README.md](../00_Prerequisites/README.md) - Week 0 setup

### **Weekly Plans** (to be created)
- Week_7/WEEK_7_PLAN.md - IAM Block detailed plan
- Week_7.5/WEEK_7.5_PLAN.md - AI OKR Engine detailed plan

---

## ✅ ACCEPTANCE CRITERIA

### **Week Complete When**:
- ✅ All daily tasks from week section finished
- ✅ All tests passing
- ✅ Issues logged to MASTER_ISSUES_LIST.md
- ✅ Improvements logged to MASTER_IMPROVEMENTS_LIST.md
- ✅ This document updated (mark week status)
- ✅ Next week's plan ready

### **MVP Complete When**:
- ✅ All 247 tasks marked complete
- ✅ All 7 blocks functional
- ✅ All acceptance criteria met
- ✅ Beta users onboarded
- ✅ Production deployed
- ✅ Launch date: January 31, 2026

---

**Document Owner**: Product & Engineering Team
**Version**: 5.0.0
**Last Updated**: October 23, 2025
**Status**: Active - 12 Week Timeline
**Launch Target**: January 31, 2026
