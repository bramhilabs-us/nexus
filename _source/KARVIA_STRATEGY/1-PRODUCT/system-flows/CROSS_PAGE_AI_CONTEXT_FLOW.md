# Cross-Page AI Context Flow

**Version**: 1.0.0
**Created**: February 16, 2026
**Purpose**: Visualize how AI context accumulates across pages, making the system "smarter" day by day
**Related Epic**: Sprint 13 - Epic X (Unified LLM Context Service)

---

## Vision

> "An intelligent OKR system that gets better day by day via centralized AI context"

The system learns from every interaction — assessments, objectives, goals, tasks, approvals, and rejections — building a comprehensive understanding of each company that powers increasingly relevant AI suggestions.

---

## Cross-Page Context Accumulation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CENTRALIZED AI CONTEXT SERVICE                          │
│                    (UnifiedLLMContextService)                               │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Company   │  │    SSI      │  │   History   │  │  Rejection  │       │
│  │   Profile   │  │  12-Block   │  │   Patterns  │  │   Learning  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
       ▲                   ▲                   ▲                   ▲
       │                   │                   │                   │
       │ WRITES            │ WRITES            │ WRITES            │ WRITES
       │                   │                   │                   │
┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
│   PAGE 1    │     │   PAGE 2    │     │   PAGE 3    │     │   PAGE 4    │
│  Assessment │ ──▶ │   SSI View  │ ──▶ │  Objectives │ ──▶ │  Planning   │
│    Hub      │     │  + OKR Gen  │     │    Page     │     │    Page     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │                   │
                           ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │   Approval  │     │    Edit/    │     │   Task      │
                    │  Rejection  │     │   Archive   │     │ Completion  │
                    │   Actions   │     │   Actions   │     │   Actions   │
                    └─────────────┘     └─────────────┘     └─────────────┘
                           │                   │                   │
                           └───────────────────┴───────────────────┘
                                               │
                                               ▼
                              ┌────────────────────────────────┐
                              │    AIInteractionLog            │
                              │    (Tracks ALL interactions)   │
                              └────────────────────────────────┘
```

---

## Journey Flow: Consultant → Client Onboarding → Intelligent OKRs

### Phase 1: Template Creation (Assessment Hub)
**Persona**: Consultant
**Page**: Assessment Hub → Template Creation

```
┌─────────────────────────────────────────────────────────────────────┐
│ CONSULTANT CREATES TEMPLATE                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Consultant selects questions from library                       │
│  2. Assigns dimension weights (Speed/Strength/Intelligence)         │
│  3. Saves template with industry targeting                          │
│                                                                     │
│  Context Written:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   template_id: "tmpl_abc123",                                 │ │
│  │   industry_focus: "technology",                               │ │
│  │   dimension_weights: { speed: 40, strength: 30, intel: 30 },  │ │
│  │   question_modules: ["core", "industry:tech"]                 │ │
│  │ }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: CONS-001, CONS-002, CONS-014                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 2: Client Onboarding (My Clients)
**Persona**: Consultant
**Page**: Assessment Hub → My Clients Tab

```
┌─────────────────────────────────────────────────────────────────────┐
│ CONSULTANT ADDS NEW CLIENT                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Consultant clicks "Add Client"                                  │
│  2. Enters company details (name, industry, size)                   │
│  3. Client appears in portfolio                                     │
│                                                                     │
│  Context Written:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   company_id: "comp_xyz789",                                  │ │
│  │   company_name: "TechStartup Inc",                            │ │
│  │   industry: "technology",                                     │ │
│  │   employee_count: 75,                                         │ │
│  │   created_by: "consultant_abc",                               │ │
│  │   assessment_status: "pending"                                │ │
│  │ }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: CONS-001 (Onboard Client), CONS-002 (Switch Company)     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 3: Assessment Distribution (Assessment Hub)
**Persona**: Consultant
**Page**: Assessment Hub → Send Assessment

```
┌─────────────────────────────────────────────────────────────────────┐
│ CONSULTANT SENDS ASSESSMENT                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Selects template for client                                     │
│  2. Adds stakeholder emails                                         │
│  3. Sets due date                                                   │
│  4. Sends invitations                                               │
│                                                                     │
│  Context Written:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   assessment_batch_id: "batch_001",                           │ │
│  │   template_used: "tmpl_abc123",                               │ │
│  │   recipients: 15,                                             │ │
│  │   due_date: "2026-03-01",                                     │ │
│  │   company_id: "comp_xyz789",                                  │ │
│  │   dimension_focus: ["speed_delivery", "strength_financial"]   │ │
│  │ }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: CONS-003, CONS-008                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 4: Stakeholders Complete Assessment
**Persona**: Employee, Manager, Executive
**Page**: Assessment Taking Page

```
┌─────────────────────────────────────────────────────────────────────┐
│ STAKEHOLDERS COMPLETE ASSESSMENTS                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Each stakeholder receives email invitation                      │
│  2. Answers 45 questions (1-10 scale)                               │
│  3. Submits assessment                                              │
│                                                                     │
│  Context Written (per response):                                    │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   response_id: "resp_001",                                    │ │
│  │   respondent_role: "MANAGER",                                 │ │
│  │   department: "Engineering",                                  │ │
│  │   answers: [...],                                             │ │
│  │   completion_time_minutes: 22,                                │ │
│  │   scores: {                                                   │ │
│  │     speed: 7.2,                                               │ │
│  │     strength: 5.5,                                            │ │
│  │     intelligence: 8.1                                         │ │
│  │   },                                                          │ │
│  │   block_scores: {                                             │ │
│  │     delivery: 7.5, decisions: 6.8, change: 7.0, ...          │ │
│  │   }                                                           │ │
│  │ }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: EMP-001, EMP-002, MGR-002                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 5: SSI Results & AI OKR Generation (Team SSI View)
**Persona**: Consultant, Executive
**Page**: Team SSI View

```
┌─────────────────────────────────────────────────────────────────────┐
│ SSI SCORES CALCULATED → AI OKRs GENERATED                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INPUTS (Context Read):                                             │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ • Company profile (industry, size, metrics)                   │ │
│  │ • 12-block SSI scores (4 blocks per dimension)                │ │
│  │ • Team breakdown (which teams are weak/strong)                │ │
│  │ • Weak areas prioritized (financial_strength: 5.5)            │ │
│  │ • Historical context (if exists)                              │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AI Processing:                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ LLM receives full context → Generates targeted OKRs           │ │
│  │                                                               │ │
│  │ Prompt includes:                                              │ │
│  │ • "Financial strength is weakest (5.5/10)"                    │ │
│  │ • "Focus on objectives that address this gap"                 │ │
│  │ • "Company is 75-person tech startup"                         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  OUTPUTS:                                                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 4-6 AI-generated objectives with 3-5 KRs each                 │ │
│  │ Example: "Strengthen Financial Foundation" (addresses 5.5)    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Context Written:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   interaction_type: "okr_generation",                         │ │
│  │   context_snapshot: { ssi_scores, company_size, ... },        │ │
│  │   generated_count: 5,                                         │ │
│  │   llm_reasoning: "Prioritized financial due to low score"     │ │
│  │ }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: CONS-005, EXEC-002                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 6: OKR Review & Approval/Rejection
**Persona**: Consultant, Executive
**Page**: Team SSI View (Review Modal)

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER REVIEWS AI SUGGESTIONS → APPROVES/REJECTS                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Actions:                                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ✅ APPROVE: "Strengthen Financial Foundation"                 │ │
│  │ ✅ APPROVE: "Accelerate Market Expansion" (edit title)        │ │
│  │ ❌ REJECT: "Improve Customer Satisfaction"                    │ │
│  │    Reason: "too_generic" / "already_exists" / "not_relevant"  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ★ LEARNING MOMENT: Context Updated with Rejection                 │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   rejection: {                                                │ │
│  │     type: "objective",                                        │ │
│  │     title: "Improve Customer Satisfaction",                   │ │
│  │     reason: "too_generic",                                    │ │
│  │     timestamp: "2026-02-16T10:30:00Z"                         │ │
│  │   }                                                           │ │
│  │ }                                                             │ │
│  │                                                               │ │
│  │ ➜ Future prompts include: "Avoid generic objectives like     │ │
│  │   'Improve Customer Satisfaction' — user rejected as          │ │
│  │   too_generic"                                                │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: CONS-006, NEW: AI-CONTEXT-002 (Rejection Learning)       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 7: Objectives Page (View & Manage)
**Persona**: Executive, Manager
**Page**: Objectives Page

```
┌─────────────────────────────────────────────────────────────────────┐
│ APPROVED OBJECTIVES VISIBLE → FURTHER REFINEMENT                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Actions:                                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ • View 4 active objectives with inline KRs                    │ │
│  │ • Edit objective titles/descriptions                          │ │
│  │ • Add manual objectives (with AI assistance)                  │ │
│  │ • Archive completed objectives                                │ │
│  │ • See category coverage (MECE 6-category)                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Context Updated:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   objectives: {                                               │ │
│  │     active: 4,                                                │ │
│  │     by_category: {                                            │ │
│  │       "financial_health": 2,                                  │ │
│  │       "operational_excellence": 1,                            │ │
│  │       "growth": 1                                             │ │
│  │     },                                                        │ │
│  │     gaps: ["No 'people' category objective"],                 │ │
│  │     total_krs: 14                                             │ │
│  │   }                                                           │ │
│  │ }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ➜ Future AI knows: "No people objective yet — suggest adding"     │
│                                                                     │
│  Stories: EXEC-003, N1-N6 (Epic N)                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 8: Planning Page (Goals & Tasks)
**Persona**: Manager
**Page**: Planning Page

```
┌─────────────────────────────────────────────────────────────────────┐
│ WEEKLY GOALS & TASKS GENERATED WITH FULL CONTEXT                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INPUTS (Full Context):                                             │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ • Company profile                                             │ │
│  │ • SSI 12-block scores (weak areas highlighted)                │ │
│  │ • All active objectives and KRs                               │ │
│  │ • Existing quarterly goals                                    │ │
│  │ • Previous weeks' tasks (to avoid duplication)                │ │
│  │ • 1-year task history (completion patterns)                   │ │
│  │ • Rejection history (what NOT to suggest)                     │ │
│  │ • Context delta (what changed since last time)                │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AI Processing (Generate Weekly Goals):                             │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ LLM generates 4-6 weeks of goals considering:                 │ │
│  │ • KR targets and deadlines                                    │ │
│  │ • SSI weak areas (focus on improvement)                       │ │
│  │ • Historical velocity (realistic task counts)                 │ │
│  │ • Already-existing goals (no duplication)                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AI Processing (Generate Tasks):                                    │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ For each weekly goal, AI generates 3-5 tasks:                 │ │
│  │ • Specific to the weekly goal focus                           │ │
│  │ • Based on past task patterns ("Research X" common)           │ │
│  │ • Avoid rejected task types                                   │ │
│  │ • Realistic based on 70% completion rate history              │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Context Updated:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   interaction_type: "weekly_plan",                            │ │
│  │   weeks_generated: [1, 2, 3, 4],                              │ │
│  │   tasks_generated: 18,                                        │ │
│  │   context_used: {                                             │ │
│  │     ssi_weak_area: "financial_strength",                      │ │
│  │     existing_goals: 2,                                        │ │
│  │     historical_velocity: 9.3                                  │ │
│  │   }                                                           │ │
│  │ }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: MGR-021, MGR-022, L-Epic, X8, X9                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
```

### Phase 9: Dashboard (Daily Execution)
**Persona**: Employee
**Page**: Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ TASKS DISPLAYED → COMPLETION → PROGRESS CASCADE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Actions:                                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ • View today's 3-5 tasks                                      │ │
│  │ • See "Why Chain" (Task → Goal → KR → Objective → SSI)        │ │
│  │ • Complete tasks                                              │ │
│  │ • Postpone/reassign tasks                                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Progress Cascade:                                                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Task 100% → Weekly Goal +20% → Quarterly Goal +10%            │ │
│  │ → Key Result +5% → Objective Progress +2%                     │ │
│  │                                                               │ │
│  │ All tracked for context:                                      │ │
│  │ • Tasks completed today: 3                                    │ │
│  │ • Weekly velocity: 12 tasks                                   │ │
│  │ • On-track for KR target                                      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Context Updated:                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ {                                                             │ │
│  │   task_history: {                                             │ │
│  │     tasks_completed_this_week: 12,                            │ │
│  │     completion_rate: 85%,                                     │ │
│  │     common_patterns: ["Review *", "Update *"]                 │ │
│  │   }                                                           │ │
│  │ }                                                             │ │
│  │                                                               │ │
│  │ ➜ Future task generation knows: "This team completes 12       │ │
│  │   tasks/week on average, suggest realistic count"             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Stories: EMP-008-015, P-Epic                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Context Accumulation Over Time

```
Week 1: Company created
        ├─ Company profile: Industry, size, mission
        └─ Context completeness: 20%

Week 2: Assessment completed
        ├─ SSI 12-block scores added
        ├─ Weak areas identified
        └─ Context completeness: 50%

Week 3: OKRs generated and reviewed
        ├─ Approved objectives added
        ├─ Rejection reasons captured
        └─ Context completeness: 70%

Week 4: Weekly goals generated
        ├─ Planning patterns captured
        ├─ Task history begins
        └─ Context completeness: 80%

Week 5+: Tasks completed daily
        ├─ Velocity patterns emerge
        ├─ Completion rates tracked
        ├─ Context delta tracked
        └─ Context completeness: 90%+

Month 3+: Rich context enables
        ├─ Highly personalized suggestions
        ├─ Rejection patterns inform generation
        ├─ Historical velocity ensures realism
        └─ System "gets smarter"
```

---

## Missing User Stories (To Add)

Based on this flow, the following stories should be added to capture AI context nuances:

### AI-CONTEXT-001: Context Accumulates Across Interactions
**As a** system
**I want to** build cumulative context from all user interactions
**So that** AI suggestions improve over time

**Acceptance Criteria**:
- Context includes company profile, SSI scores, objectives, goals, tasks
- Each AI interaction reads existing context before generating
- Context snapshot stored with each interaction for debugging

### AI-CONTEXT-002: Rejection Reasons Improve Future Suggestions
**As a** user
**I want** my rejection reasons to influence future AI suggestions
**So that** the AI learns what I don't want

**Acceptance Criteria**:
- Rejection modal requires reason selection
- Reasons stored in AIInteractionLog
- Future prompts include rejection history
- AI explicitly avoids similar patterns

### AI-CONTEXT-003: Task History Informs Task Generation
**As a** manager
**I want** task generation to consider my team's history
**So that** suggested tasks are realistic and achievable

**Acceptance Criteria**:
- 12-month task history included in context
- Completion rate influences task count suggestions
- Common task patterns inform naming
- Velocity trend adjusts difficulty

### AI-CONTEXT-004: Context Delta Shows What Changed
**As a** LLM
**I want** to know what changed since last interaction
**So that** I can provide contextually relevant suggestions

**Acceptance Criteria**:
- Delta tracked between interactions
- Changes include: new objectives, KR progress, tasks completed
- Delta included in AI prompts
- LLM can reference "Since your last interaction, 3 tasks were completed"

---

## User Story Updates Needed

### Existing Stories to Enhance:

| Story | Current Focus | Add |
|-------|--------------|-----|
| CONS-005 | Generate OKRs | Reference to context building, 12-block SSI input |
| CONS-006 | Review OKRs | Rejection reason capture, learning feedback |
| EMP-016 | Why Chain | Connection to AI context (SSI insight tooltip) |
| MGR-021 | Create Quarterly Plans | Context-aware AI generation |
| X1-X10 | Technical implementation | User-facing value statements |

---

## Sprint 13 Audit Checklist

Based on this flow, verify Sprint 13 achieves:

| Requirement | Epic/Story | Status |
|-------------|-----------|--------|
| 12-block SSI available to all AI | X1 | Planned |
| Unified context for all LLM calls | X2 | Planned |
| Context delta detection | X3 | Planned |
| Planning uses unified context | X4 | Planned |
| All interactions logged | X5 | Planned |
| Rejection reasons captured | X6 | Planned |
| 1-year task history | X7 | Planned |
| AI-powered task generation | X8 | Planned |
| Frontend updated for context | X9 | Planned |
| Assignment UI | X10 | Planned |
| User stories updated | ? | **NEEDED** |
| User journeys updated | ? | **NEEDED** |

---

## Related Documents

- [USER_JOURNEYS_MASTER.md](./USER_JOURNEYS_MASTER.md) - Original journeys
- [CONSULTANT_JOURNEY.md](./CONSULTANT_JOURNEY.md) - Consultant flow
- [EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md](../../3-DELIVERY/1-SPRINTS/SPRINT-13%20(Planned)/EPIC-X-UNIFIED-LLM-CONTEXT-SERVICE.md) - Technical spec
- [SPRINT-13-MASTER-PLAN.md](../../3-DELIVERY/1-SPRINTS/SPRINT-13%20(Planned)/SPRINT-13-MASTER-PLAN.md) - Sprint plan

---

**Document Created**: February 16, 2026
**Author**: Claude Code
**Status**: READY FOR REVIEW
