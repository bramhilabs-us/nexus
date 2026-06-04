# Master Test Plan V3

**Version**: 3.0.0
**Last Updated**: February 16, 2026
**Status**: Active
**Coverage**: 102 User Stories across 5 Personas + 8 AI Context Stories
**Source**: USER_STORIES_INDEX.md, AI_CONTEXT_STORIES.md

---

## 1. Overview

This Master Test Plan provides comprehensive test coverage mapped directly to user stories. It serves as the single source of truth for "what to test" across the entire Karvia Business platform.

### Test Coverage Summary

| Persona | Stories | Test Cases | Automated | Manual |
|---------|---------|------------|-----------|--------|
| Employee (EMP) | 18 | 72 | 28 | 44 |
| Manager (MGR) | 28 | 112 | 35 | 77 |
| Executive (EXEC) | 22 | 88 | 30 | 58 |
| Consultant (CONS) | 18 | 90 | 32 | 58 |
| Admin (ADMIN) | 16 | 64 | 20 | 44 |
| AI Context | 8 | 48 | 16 | 32 |
| **Total** | **110** | **474** | **161** | **313** |

---

## 2. Test Execution Tiers

| Tier | Name | When | Duration | Focus |
|------|------|------|----------|-------|
| T1 | Smoke | Every deploy | 5 min | Core pages load, auth works |
| T2 | Sanity | Daily | 15 min | Critical paths |
| T3 | Regression | Pre-release | 1 hour | Full BST suite |
| T4 | Full | Major release | 4+ hours | All including edge cases |

---

## 3. Employee (EMP) Test Cases

### EMP-001 to EMP-003: Assessment Taking

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| EMP-TC-001 | Employee receives assessment invitation email | EMP-001 | E2E | P0 | T2 | No |
| EMP-TC-002 | Click invitation link opens assessment | EMP-001 | E2E | P0 | T1 | Yes |
| EMP-TC-003 | Assessment shows template questions | EMP-001 | E2E | P0 | T2 | No |
| EMP-TC-004 | Questions display 1-10 scale | EMP-001 | E2E | P1 | T2 | No |
| EMP-TC-005 | Progress bar updates on answer | EMP-001 | E2E | P1 | T3 | No |
| EMP-TC-006 | Save draft and resume later | EMP-001 | E2E | P1 | T3 | No |
| EMP-TC-007 | Submit only active when all answered | EMP-001 | E2E | P0 | T2 | Yes |
| EMP-TC-008 | Confirmation shown on submit | EMP-001 | E2E | P1 | T2 | No |
| EMP-TC-009 | Individual results show 3 scores | EMP-002 | E2E | P1 | T2 | No |
| EMP-TC-010 | Scores display X/10 with percentage | EMP-002 | E2E | P1 | T3 | No |
| EMP-TC-011 | Color coding correct (green/yellow/red) | EMP-002 | E2E | P1 | T3 | No |
| EMP-TC-012 | PDF download works | EMP-002 | E2E | P2 | T4 | No |

### EMP-004: View My Objectives

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| EMP-TC-013 | Objectives page loads | EMP-004 | E2E | P0 | T1 | Yes |
| EMP-TC-014 | Only assigned objectives visible | EMP-004 | E2E | P1 | T2 | No |
| EMP-TC-015 | Objective cards show progress | EMP-004 | E2E | P1 | T2 | No |
| EMP-TC-016 | KRs display under objectives | EMP-004 | E2E | P1 | T2 | No |

### EMP-008 to EMP-015: Dashboard & Tasks

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| EMP-TC-017 | Dashboard loads with today's tasks | EMP-008 | E2E | P0 | T1 | Yes |
| EMP-TC-018 | Task cards show title, due date | EMP-008 | E2E | P1 | T2 | No |
| EMP-TC-019 | Overdue tasks highlighted red | EMP-008 | E2E | P1 | T2 | No |
| EMP-TC-020 | Click task shows details | EMP-008 | E2E | P1 | T3 | No |
| EMP-TC-021 | Complete task checkbox works | EMP-009 | E2E | P0 | T2 | Yes |
| EMP-TC-022 | Task completion triggers progress update | EMP-009 | Integration | P0 | T2 | Yes |
| EMP-TC-023 | Progress cascades to weekly goal | EMP-009 | Integration | P1 | T2 | Yes |
| EMP-TC-024 | Update task progress (partial) | EMP-010 | E2E | P1 | T3 | No |
| EMP-TC-025 | Task history shows completed items | EMP-011 | E2E | P2 | T4 | No |

### EMP-016: Why Chain

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| EMP-TC-026 | Task shows "Why Chain" breadcrumb | EMP-016 | E2E | P1 | T2 | No |
| EMP-TC-027 | Breadcrumb: Task → Weekly → Quarterly | EMP-016 | E2E | P1 | T2 | No |
| EMP-TC-028 | Breadcrumb: Quarterly → KR → Objective | EMP-016 | E2E | P1 | T2 | No |
| EMP-TC-029 | Each level clickable | EMP-016 | E2E | P1 | T3 | No |
| EMP-TC-030 | SSI insight tooltip visible | EMP-016 | E2E | P2 | T3 | No |

---

## 4. Manager (MGR) Test Cases

### MGR-001 to MGR-003: Team Assessment

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| MGR-TC-001 | Send assessment to team | MGR-001 | E2E | P0 | T2 | No |
| MGR-TC-002 | View team assessment progress | MGR-002 | E2E | P1 | T2 | No |
| MGR-TC-003 | Team SSI results load | MGR-003 | E2E | P0 | T2 | Yes |
| MGR-TC-004 | Team breakdown shows per-member scores | MGR-003 | E2E | P1 | T2 | No |

### MGR-004 to MGR-009: Team Management

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| MGR-TC-005 | Create new team | MGR-004 | E2E | P1 | T2 | No |
| MGR-TC-006 | Team appears in list after creation | MGR-004 | E2E | P1 | T2 | No |
| MGR-TC-007 | Add members to team | MGR-005 | E2E | P1 | T2 | No |
| MGR-TC-008 | View team list | MGR-006 | E2E | P0 | T1 | Yes |
| MGR-TC-009 | Remove team member | MGR-007 | E2E | P1 | T3 | No |
| MGR-TC-010 | Track objective progress | MGR-008 | E2E | P1 | T2 | No |
| MGR-TC-011 | Update team info | MGR-009 | E2E | P2 | T3 | No |

### MGR-015 to MGR-020: Goal Management

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| MGR-TC-012 | Assign goal to team member | MGR-015 | E2E | P0 | T2 | No |
| MGR-TC-013 | Create team goal | MGR-016 | E2E | P1 | T2 | No |
| MGR-TC-014 | Create task from goal | MGR-017 | E2E | P1 | T2 | No |
| MGR-TC-015 | Task links to correct goal | MGR-018 | Integration | P1 | T2 | Yes |
| MGR-TC-016 | Track goal progress | MGR-019 | E2E | P1 | T2 | No |
| MGR-TC-017 | Update goal status | MGR-020 | E2E | P1 | T3 | No |

### MGR-021 to MGR-024: Planning

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| MGR-TC-018 | Planning page loads | MGR-021 | E2E | P0 | T1 | Yes |
| MGR-TC-019 | Quarterly goals displayed | MGR-021 | E2E | P1 | T2 | No |
| MGR-TC-020 | Create quarterly plan | MGR-021 | E2E | P1 | T2 | No |
| MGR-TC-021 | Generate weekly goals with AI | MGR-022 | E2E | P0 | T2 | No |
| MGR-TC-022 | Weekly goals appear under KR | MGR-022 | E2E | P1 | T2 | No |
| MGR-TC-023 | Assign team capacity | MGR-023 | E2E | P2 | T3 | No |
| MGR-TC-024 | Review team planning | MGR-024 | E2E | P1 | T3 | No |

### MGR-025 to MGR-027: Advanced Features

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| MGR-TC-025 | Team assessment health view | MGR-025 | E2E | P1 | T3 | No |
| MGR-TC-026 | Compare team to company average | MGR-025 | E2E | P1 | T3 | No |
| MGR-TC-027 | Intervention alerts appear | MGR-026 | E2E | P2 | T4 | No |
| MGR-TC-028 | Weekly roll-up report | MGR-027 | E2E | P2 | T4 | No |

---

## 5. Executive (EXEC) Test Cases

### EXEC-001 to EXEC-002: Assessment & OKR Generation

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| EXEC-TC-001 | View company assessment results | EXEC-001 | E2E | P0 | T2 | No |
| EXEC-TC-002 | SSI scores display correctly | EXEC-001 | E2E | P1 | T2 | No |
| EXEC-TC-003 | Generate AI OKRs button visible | EXEC-002 | E2E | P0 | T2 | Yes |
| EXEC-TC-004 | OKR generation uses SSI data | EXEC-002 | Integration | P0 | T2 | Yes |
| EXEC-TC-005 | Generated OKRs show for review | EXEC-002 | E2E | P0 | T2 | No |
| EXEC-TC-006 | Approve OKRs creates objectives | EXEC-002 | E2E | P0 | T2 | Yes |
| EXEC-TC-007 | Dismiss OKR with reason | EXEC-002 | E2E | P1 | T2 | No |

### EXEC-003 to EXEC-006: Objectives & Progress

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| EXEC-TC-008 | View all company objectives | EXEC-003 | E2E | P0 | T1 | Yes |
| EXEC-TC-009 | Objectives show KRs inline | EXEC-003 | E2E | P1 | T2 | No |
| EXEC-TC-010 | Filter objectives by department | EXEC-005 | E2E | P2 | T3 | No |
| EXEC-TC-011 | Track company progress | EXEC-006 | E2E | P1 | T2 | No |
| EXEC-TC-012 | Progress rings update | EXEC-006 | E2E | P1 | T2 | No |

### EXEC-010 to EXEC-015: Goal & Planning Management

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| EXEC-TC-013 | Approve company goals | EXEC-010 | E2E | P1 | T2 | No |
| EXEC-TC-014 | Cascade goals to teams | EXEC-011 | E2E | P1 | T3 | No |
| EXEC-TC-015 | Create yearly OKRs | EXEC-012 | E2E | P1 | T2 | No |
| EXEC-TC-016 | Break into quarterly goals | EXEC-013 | E2E | P1 | T3 | No |
| EXEC-TC-017 | Review team plans | EXEC-014 | E2E | P1 | T3 | No |
| EXEC-TC-018 | Approve planning cycles | EXEC-015 | E2E | P2 | T4 | No |

---

## 6. Consultant (CONS) Test Cases

### CONS-001 to CONS-002: Client & Company Management

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| CONS-TC-001 | Onboard new client company | CONS-001 | E2E | P0 | T2 | No |
| CONS-TC-002 | Client appears in portfolio | CONS-001 | E2E | P1 | T2 | No |
| CONS-TC-003 | Company switcher dropdown | CONS-002 | E2E | P0 | T1 | Yes |
| CONS-TC-004 | Switch company changes context | CONS-002 | E2E | P0 | T2 | Yes |
| CONS-TC-005 | Current company clearly indicated | CONS-002 | E2E | P1 | T2 | No |

### CONS-003 to CONS-006: Assessment & OKR

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| CONS-TC-006 | Send assessment to client | CONS-003 | E2E | P0 | T2 | No |
| CONS-TC-007 | Select assessment template | CONS-003 | E2E | P1 | T2 | No |
| CONS-TC-008 | Choose recipients | CONS-003 | E2E | P1 | T2 | No |
| CONS-TC-009 | Set due date | CONS-003 | E2E | P1 | T3 | No |
| CONS-TC-010 | View client SSI results | CONS-004 | E2E | P0 | T2 | Yes |
| CONS-TC-011 | 12-block breakdown displays | CONS-004 | E2E | P1 | T2 | No |
| CONS-TC-012 | Team vs company comparison | CONS-004 | E2E | P1 | T3 | No |
| CONS-TC-013 | Generate OKRs for client | CONS-005 | E2E | P0 | T2 | Yes |
| CONS-TC-014 | One-time generation guard | CONS-005 | Integration | P0 | T2 | Yes |
| CONS-TC-015 | Review generated OKRs | CONS-006 | E2E | P0 | T2 | No |
| CONS-TC-016 | Edit objectives before approval | CONS-006 | E2E | P1 | T2 | No |
| CONS-TC-017 | Accept creates objectives | CONS-006 | E2E | P0 | T2 | Yes |

### CONS-008 to CONS-011: Tracking & Reporting

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| CONS-TC-018 | Track assessment completion | CONS-008 | E2E | P1 | T2 | No |
| CONS-TC-019 | View sent invitations | CONS-008 | E2E | P1 | T2 | No |
| CONS-TC-020 | Send reminders | CONS-008 | E2E | P2 | T3 | No |
| CONS-TC-021 | View client dashboard | CONS-010 | E2E | P1 | T2 | No |
| CONS-TC-022 | Manage client users | CONS-011 | E2E | P1 | T3 | No |

### CONS-014: Template Creation

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| CONS-TC-023 | Create assessment template | CONS-014 | E2E | P0 | T2 | No |
| CONS-TC-024 | Template creation wizard (4 steps) | CONS-014 | E2E | P1 | T2 | No |
| CONS-TC-025 | Select questions from library | CONS-014 | E2E | P1 | T2 | No |
| CONS-TC-026 | Set dimension weights | CONS-014 | E2E | P1 | T2 | No |
| CONS-TC-027 | Template appears in My Templates | CONS-014 | E2E | P1 | T2 | No |

---

## 7. AI Context Test Cases

### AI-CONTEXT-001: Context Accumulation

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| AI-TC-001 | OKR gen includes company profile | AI-CONTEXT-001 | Integration | P0 | T2 | Yes |
| AI-TC-002 | Weekly gen includes existing OKRs | AI-CONTEXT-001 | Integration | P0 | T2 | Yes |
| AI-TC-003 | Task gen includes weekly goal context | AI-CONTEXT-001 | Integration | P0 | T2 | Yes |
| AI-TC-004 | Context snapshot stored | AI-CONTEXT-001 | Integration | P1 | T3 | Yes |
| AI-TC-005 | No re-entry needed between features | AI-CONTEXT-001 | E2E | P1 | T3 | No |

### AI-CONTEXT-002: Rejection Learning

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| AI-TC-006 | Dismiss requires reason selection | AI-CONTEXT-002 | E2E | P0 | T2 | No |
| AI-TC-007 | Reason options: too_generic, not_relevant, etc. | AI-CONTEXT-002 | E2E | P1 | T2 | No |
| AI-TC-008 | Rejection stored in AIInteractionLog | AI-CONTEXT-002 | Integration | P0 | T2 | Yes |
| AI-TC-009 | Future prompts include rejection history | AI-CONTEXT-002 | Integration | P0 | T3 | Yes |
| AI-TC-010 | AI avoids rejected patterns | AI-CONTEXT-002 | Integration | P1 | T4 | No |

### AI-CONTEXT-003: Task History

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| AI-TC-011 | Task gen accesses 12-month history | AI-CONTEXT-003 | Integration | P1 | T3 | Yes |
| AI-TC-012 | Completion rate influences suggestions | AI-CONTEXT-003 | Integration | P1 | T3 | No |
| AI-TC-013 | Common patterns in generated tasks | AI-CONTEXT-003 | Integration | P2 | T4 | No |
| AI-TC-014 | Velocity trend adjusts difficulty | AI-CONTEXT-003 | Integration | P2 | T4 | No |

### AI-CONTEXT-004: Context Delta

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| AI-TC-015 | Delta tracks last interaction time | AI-CONTEXT-004 | Integration | P1 | T3 | Yes |
| AI-TC-016 | New objectives in delta | AI-CONTEXT-004 | Integration | P1 | T3 | Yes |
| AI-TC-017 | KR progress changes in delta | AI-CONTEXT-004 | Integration | P1 | T3 | Yes |
| AI-TC-018 | Tasks completed in delta | AI-CONTEXT-004 | Integration | P1 | T3 | Yes |

### AI-CONTEXT-005: 12-Block SSI

| ID | Test Case | Story | Type | Priority | Tier | Auto |
|----|-----------|-------|------|----------|------|------|
| AI-TC-019 | OKR gen uses 12-block scores | AI-CONTEXT-005 | Integration | P0 | T2 | Yes |
| AI-TC-020 | Weak blocks prioritized | AI-CONTEXT-005 | Integration | P0 | T2 | Yes |
| AI-TC-021 | Generated OKRs address weak areas | AI-CONTEXT-005 | Integration | P1 | T3 | No |
| AI-TC-022 | Weekly goals reference SSI | AI-CONTEXT-005 | Integration | P1 | T3 | No |

---

## 8. Cross-Page Journey Tests

### Journey 1: Consultant Full Flow

| Step | Test Case | Priority | Tier |
|------|-----------|----------|------|
| 1 | Consultant logs in, sees company switcher | P0 | T2 |
| 2 | Creates assessment template | P0 | T2 |
| 3 | Adds new client company | P0 | T2 |
| 4 | Sends assessment to client stakeholders | P0 | T2 |
| 5 | Tracks completion progress | P1 | T3 |
| 6 | Views SSI results with 12-block | P0 | T2 |
| 7 | Generates OKRs with full context | P0 | T2 |
| 8 | Reviews and approves with rejections | P0 | T2 |
| 9 | Views objectives page | P1 | T2 |
| 10 | Generates weekly goals | P1 | T3 |
| 11 | Context accumulates correctly | P0 | T3 |

### Journey 2: Executive OKR Flow

| Step | Test Case | Priority | Tier |
|------|-----------|----------|------|
| 1 | Executive views company SSI | P0 | T2 |
| 2 | Generates AI OKRs | P0 | T2 |
| 3 | Reviews with reasoning visible | P1 | T3 |
| 4 | Rejects one with reason | P1 | T2 |
| 5 | Approves remaining | P0 | T2 |
| 6 | Objectives appear on page | P0 | T2 |
| 7 | Generates weekly goals | P1 | T3 |
| 8 | Assigns to team | P1 | T3 |

### Journey 3: Manager Planning Flow

| Step | Test Case | Priority | Tier |
|------|-----------|----------|------|
| 1 | Manager opens planning page | P0 | T1 |
| 2 | Sees objectives and KRs | P0 | T2 |
| 3 | Generates weekly goals with AI | P0 | T2 |
| 4 | Goals include SSI context | P1 | T3 |
| 5 | Generates tasks for week | P0 | T2 |
| 6 | Tasks use task history | P1 | T3 |
| 7 | Assigns tasks to team | P1 | T2 |
| 8 | Tracks completion | P1 | T2 |

### Journey 4: Employee Daily Flow

| Step | Test Case | Priority | Tier |
|------|-----------|----------|------|
| 1 | Employee sees dashboard | P0 | T1 |
| 2 | Today's tasks displayed | P0 | T2 |
| 3 | Views "Why Chain" on task | P1 | T3 |
| 4 | Completes task | P0 | T2 |
| 5 | Progress cascades up | P0 | T2 |
| 6 | Views objectives | P1 | T3 |

---

## 9. API Contract Tests

### Authentication
| Endpoint | Method | Expected | Test ID |
|----------|--------|----------|---------|
| `/api/auth/login` | POST | 200 + token | API-001 |
| `/api/auth/refresh` | POST | 200 + new token | API-002 |
| `/api/auth/logout` | POST | 200 | API-003 |

### Objectives
| Endpoint | Method | Expected | Test ID |
|----------|--------|----------|---------|
| `/api/objectives` | GET | 200 + list | API-010 |
| `/api/objectives` | POST | 201 + objective | API-011 |
| `/api/objectives/:id` | PUT | 200 + updated | API-012 |
| `/api/objectives/:id` | DELETE | 200 | API-013 |

### Goals
| Endpoint | Method | Expected | Test ID |
|----------|--------|----------|---------|
| `/api/goals/quarterly` | GET | 200 + list | API-020 |
| `/api/goals/quarterly` | POST | 201 + goal | API-021 |
| `/api/goals/weekly/:qgId` | GET | 200 + list | API-022 |
| `/api/goals/weekly` | POST | 201 + goal | API-023 |

### Planning (AI)
| Endpoint | Method | Expected | Test ID |
|----------|--------|----------|---------|
| `/api/planning/generate-weekly-plan` | POST | 200 + goals | API-030 |
| `/api/planning/generate-tasks` | POST | 200 + tasks | API-031 |
| `/api/planning/hierarchy` | GET | 200 + tree | API-032 |

### AI Context (Sprint 13)
| Endpoint | Method | Expected | Test ID |
|----------|--------|----------|---------|
| `/api/ai-context/build` | POST | 200 + context | API-040 |
| `/api/ai-context/delta` | GET | 200 + delta | API-041 |
| `/api/ai-interaction-log` | GET | 200 + logs | API-042 |

---

## 10. Test Data Requirements

### Minimum Dataset
- 2 Companies (TestCorp, ClientCo)
- 6 Users per company (all roles)
- 4 Teams with 5+ members
- 25+ completed SSI assessments (>80% for diagnostic)
- 6 Objectives with 4 KRs each
- 12 Quarterly goals
- 24 Weekly goals
- 100+ Tasks (for history patterns)

### Test Credentials
| Role | Email | Company |
|------|-------|---------|
| Employee | emp@testcorp.com | TestCorp |
| Manager | mgr@testcorp.com | TestCorp |
| Executive | exec@testcorp.com | TestCorp |
| Admin | admin@testcorp.com | TestCorp |
| Consultant | consultant@karvia.com | Multi |

---

## 11. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2025 | Initial plan |
| 2.0 | Dec 2025 | Added Sprint 6-9 features |
| 3.0 | Feb 16, 2026 | Complete rewrite based on user stories, added AI context tests |

---

**Maintained By**: QA Team
**Review Cycle**: Each sprint
**Next Update**: Sprint 14
