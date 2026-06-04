# Epic X: Unified LLM Context Service

**Epic ID**: X
**Sprint**: 13
**Total Points**: 42 pts
**Priority**: P0 (Foundation for all AI features)
**Status**: Planned

---

## Executive Summary

Create a **single source of truth** for all LLM interactions across the platform. Currently, context building is fragmented across 4+ files with duplicate logic, inconsistent data structures, and no history tracking. This epic consolidates everything into `UnifiedLLMContextService` that:

1. Builds comprehensive context for ANY AI interaction
2. Tracks all LLM interactions with full history
3. Includes rejection/approval reasons for learning
4. Maintains 1-year task history for pattern recognition
5. Powers Generate Weekly Goals, Generate Tasks, and all AI features

---

## Problem Statement

### Current State (Fragmented)

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   ai-okr.js     │      │   planning.js   │      │ AIContextService│
│                 │      │                 │      │                 │
│  fetchSSIData   │      │  SSI fetching   │      │  getLatestSSI   │
│  ForCompany()   │      │  (lines 804-836)│      │  Scores()       │
│  (170 lines)    │      │  (32 lines)     │      │  (30 lines)     │
│                 │      │                 │      │                 │
│  - 12-block ✅  │      │  - 3D only ⚠️   │      │  - 3D only ⚠️   │
│  - Priority ✅  │      │  - No priority  │      │  - No priority  │
│  - Fallback ✅  │      │  - No fallback  │      │  - No fallback  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                        │
        └────────── INCONSISTENT CONTEXT ─────────────────┘
```

**Problems**:
- 12-block SSI data only available in `ai-okr.js`, not in planning
- Task generation uses hardcoded templates, NOT AI
- No tracking of what context was sent to LLM
- No learning from user rejections/approvals
- Context doesn't accumulate as user creates more OKRs

### Target State (Unified)

```
                    ┌─────────────────────────────────────┐
                    │     UnifiedLLMContextService        │
                    │     (Single Source of Truth)        │
                    ├─────────────────────────────────────┤
                    │  buildContext(companyId, options)   │
                    │                                     │
                    │  Options:                           │
                    │  - scope: 'okr'|'weekly'|'task'     │
                    │  - objectiveId, keyResultId, goalId │
                    │  - includeHistory: true             │
                    │  - includeRejections: true          │
                    │                                     │
                    │  Returns:                           │
                    │  - foundation (company, SSI, team)  │
                    │  - 12-block scores + weak areas     │
                    │  - existing OKRs/goals/tasks        │
                    │  - rejection history (learning)     │
                    │  - context delta (what changed)     │
                    └──────────────┬──────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │  Generate   │         │  Generate   │         │  Generate   │
    │    OKRs     │         │Weekly Goals │         │   Tasks     │
    └─────────────┘         └─────────────┘         └─────────────┘
```

---

## Audit Summary: Reuse Analysis

### Code Reuse Matrix

| Component | Location | Lines | Action | Reuse % |
|-----------|----------|-------|--------|---------|
| `AIContextService.buildObjectiveContext()` | AIContextService.js | 514 | **EXTEND** | 100% |
| `fetchSSIDataForCompany()` | ai-okr.js:22-169 | 147 | **MOVE** to service | 100% |
| `getCompanyProfileData()` | ai-okr.js:208-237 | 29 | **CONSOLIDATE** | 100% |
| `getBlockDimension()` | ai-okr.js:174-181 | 7 | **EXTRACT** utility | 100% |
| `getBlockOKRFocus()` | ai-okr.js:186-202 | 16 | **EXTRACT** utility | 100% |
| SSI context (planning.js) | planning.js:804-836 | 32 | **REMOVE** (use service) | 0% |
| `AIOKRSuggestion` model | AIOKRSuggestion.js | 520 | **EXTEND** for history | 80% |
| `generateWeeklyPlanWithAI()` | planning.js | 120 | **KEEP** (use new context) | 100% |
| `generateWeekTasks()` | planning-v2.js:1004 | 95 | **REPLACE** with AI | 0% |

**Total Reuse: ~80%** | **New Code: ~20%**

### What Already Exists (NO NEW CODE)

- Company profile fetching
- Team structure fetching
- Active objectives fetching
- Risk indicator analysis
- Business context extraction
- Quarter calculations
- OKR suggestion tracking (AIOKRSuggestion)
- Weekly plan AI generation
- Extended plan AI generation

### What Needs Consolidation (MOVE/MERGE)

- 12-block SSI extraction → Move from ai-okr.js to AIContextService
- Company fallback logic → Merge into single method
- SSI fetching → Single method with options

### What's Truly New (CREATE)

- `AIInteractionLog` model (track prompts/responses)
- Context snapshot storage
- Rejection reason tracking
- 1-year task history aggregation
- AI-powered task generation endpoint
- Assignment UI for weekly goals

---

## User Stories

### Phase 1: Context Service Consolidation (16 pts)

#### X1: Extend AIContextService with 12-Block SSI (5 pts)
**As a** developer
**I want** AIContextService to return 12-block SSI data
**So that** all AI features can access detailed SSI insights

**Acceptance Criteria**:
- [ ] Move `fetchSSIDataForCompany()` logic to `AIContextService.getFullSSIScores()`
- [ ] Add optional parameter `include12Block: boolean`
- [ ] Return structure includes:
  ```javascript
  {
    dimensions: { speed, strength, intelligence },
    blocks: { delivery, decisions, change, response, financial,
              operations, people, quality, market, data, strategy, learning },
    priorityBlocks: [{ block, score, gap, dimension }],
    weakAreas: [...],
    strongAreas: [...],
    has12BlockData: boolean
  }
  ```
- [ ] Fallback to 3D if 12-block unavailable
- [ ] Update ai-okr.js to use new method (remove duplicate)

**Files to Modify**:
- `server/services/AIContextService.js` - Add `getFullSSIScores()` method
- `server/routes/ai-okr.js` - Remove `fetchSSIDataForCompany()`, use service

**Reuse**: 100% of logic exists in ai-okr.js:22-169

---

#### X2: Create Unified buildContext() Method (5 pts)
**As a** developer
**I want** a single method to build context for any LLM interaction
**So that** all AI features use consistent, complete context

**Acceptance Criteria**:
- [ ] Create `buildContext(companyId, options)` method
- [ ] Options support:
  ```javascript
  {
    scope: 'okr' | 'weekly' | 'task' | 'full',
    objectiveId?: string,
    keyResultId?: string,
    goalId?: string,
    includeHistory: boolean,      // Include past interactions
    includeRejections: boolean,   // Include rejection reasons
    taskHistoryMonths: number     // Default 12 (1 year)
  }
  ```
- [ ] Returns layered context based on scope
- [ ] Includes focus context for specific item being worked on

**Context Layers**:
```javascript
// Scope: 'okr' - Foundation + OKR layer
// Scope: 'weekly' - Foundation + OKR + Planning layer
// Scope: 'task' - Foundation + OKR + Planning + Task layer
// Scope: 'full' - Everything
```

**Files to Modify**:
- `server/services/AIContextService.js` - Add `buildContext()` method

**Reuse**: Orchestrates existing methods (getCompanyProfile, getFullSSIScores, etc.)

---

#### X3: Add Context Delta Detection (3 pts)
**As a** LLM consumer
**I want** to know what changed since my last interaction
**So that** I can provide more relevant, contextual suggestions

**Acceptance Criteria**:
- [ ] Track last interaction timestamp per company
- [ ] Detect changes since last call:
  - New objectives created
  - KR progress changes (>10% delta)
  - Tasks completed
  - SSI scores updated
  - Team changes
- [ ] Return delta in context:
  ```javascript
  {
    delta: {
      since: '2026-02-14T10:30:00Z',
      changes: [
        { type: 'objective_created', id, title, category },
        { type: 'kr_progress', id, from: 20, to: 45 },
        { type: 'tasks_completed', count: 3 },
        { type: 'ssi_updated', newScores: {...} }
      ]
    }
  }
  ```

**Files to Modify**:
- `server/services/AIContextService.js` - Add `getContextDelta()` method
- `server/models/Company.js` - Add `last_llm_interaction` field

**Reuse**: Uses existing model queries with date filters

---

#### X4: Consolidate Planning Context (3 pts)
**As a** developer
**I want** planning.js to use UnifiedLLMContextService
**So that** weekly goal generation has full context

**Acceptance Criteria**:
- [ ] Remove inline SSI fetching from planning.js (lines 804-836)
- [ ] Replace with `AIContextService.buildContext(companyId, { scope: 'weekly', keyResultId })`
- [ ] Update prompt building to use unified context structure
- [ ] Ensure 12-block data is included in weekly goal prompts
- [ ] Test: Generate weekly goals includes SSI weak areas in reasoning

**Files to Modify**:
- `server/routes/planning.js` - Remove duplicate context, use service

**Reuse**: 100% - Just removing duplicate code

---

### Phase 2: LLM History & Learning (13 pts)

#### X5: Create AIInteractionLog Model (5 pts)
**As a** system administrator
**I want** to track all LLM interactions
**So that** we can debug, audit, and improve AI quality

**Acceptance Criteria**:
- [ ] Create `server/models/AIInteractionLog.js` with schema:
  ```javascript
  {
    company_id: ObjectId,
    user_id: ObjectId,
    interaction_type: enum ['okr_generation', 'weekly_plan', 'task_generation',
                            'plan_extension', 'diagnostic', 'narrative'],
    context_snapshot: {
      version: String,
      company_summary: Object,
      ssi_summary: Object,
      okr_count: Number,
      existing_goals_count: Number
    },
    prompt: {
      system: String,
      user: String,
      tokens_estimated: Number
    },
    response: {
      raw: String,
      parsed: Object,
      tokens_used: Number,
      latency_ms: Number,
      model: String
    },
    outcome: {
      status: enum ['success', 'error', 'partial', 'rejected'],
      items_generated: Number,
      items_approved: Number,
      items_rejected: Number,
      rejection_reasons: [String]
    },
    created_at: Date
  }
  ```
- [ ] Add indexes for company_id, created_at, interaction_type
- [ ] Add TTL index (retain 1 year of logs)

**Files to Create**:
- `server/models/AIInteractionLog.js`

**Reuse**: Pattern from AIOKRSuggestion model

---

#### X6: Track Rejection Reasons (3 pts)
**As a** LLM
**I want** to know why users rejected previous suggestions
**So that** I can avoid similar suggestions in future

**Acceptance Criteria**:
- [ ] Extend AIOKRSuggestion dismissal to require reason category:
  ```javascript
  reasons: ['too_generic', 'not_relevant', 'already_exists',
            'wrong_scope', 'unrealistic', 'other']
  ```
- [ ] Store rejection reasons in AIInteractionLog
- [ ] Include in context when `includeRejections: true`:
  ```javascript
  {
    rejectionHistory: [
      { type: 'objective', reason: 'too_generic', example: 'Improve customer satisfaction' },
      { type: 'weekly_goal', reason: 'unrealistic', example: 'Complete full migration in Week 1' }
    ]
  }
  ```
- [ ] Add rejection prompt section: "Avoid suggestions similar to previously rejected items"

**Files to Modify**:
- `server/models/AIOKRSuggestion.js` - Add reason categories
- `server/services/AIContextService.js` - Add `getRejectionHistory()` method
- `client/pages/scripts/team-ssi-view.js` - Update dismiss modal with reason picker

**Reuse**: Extends existing AIOKRSuggestion.dismissObjective()

---

#### X7: Add 1-Year Task History (5 pts)
**As a** LLM generating tasks
**I want** to see patterns from past year's tasks
**So that** I can suggest realistic, proven task types

**Acceptance Criteria**:
- [ ] Create `AIContextService.getTaskHistory(companyId, months = 12)` method
- [ ] Aggregate task patterns:
  ```javascript
  {
    taskHistory: {
      period: '12 months',
      totalTasks: 486,
      completedTasks: 342,
      completionRate: 70.4,
      averageTasksPerWeek: 9.3,
      commonTaskTypes: [
        { pattern: 'Research *', count: 45 },
        { pattern: 'Review *', count: 38 },
        { pattern: 'Update *', count: 32 }
      ],
      completionByCategory: {
        'financial_health': { total: 120, completed: 95, rate: 79.2 },
        'operational_excellence': { total: 98, completed: 68, rate: 69.4 }
      },
      velocityTrend: [
        { month: 'Jan', completed: 28 },
        { month: 'Feb', completed: 32 }
      ]
    }
  }
  ```
- [ ] Include in context for task generation scope
- [ ] Add prompt section: "Historical completion rate is X%, suggest achievable tasks"

**Files to Modify**:
- `server/services/AIContextService.js` - Add `getTaskHistory()` method

**Reuse**: Uses existing Task model queries

---

### Phase 3: AI-Powered Planning Features (13 pts)

#### X8: AI-Powered Task Generation Endpoint (5 pts)
**As a** user
**I want** Generate Tasks to use AI with full context
**So that** tasks are specific to my weekly goal and situation

**Acceptance Criteria**:
- [ ] Create `POST /api/planning/generate-tasks` endpoint
- [ ] Request body:
  ```javascript
  {
    goal_id: string,           // Weekly goal to generate tasks for
    task_count: number,        // 3-5 (default 4)
    include_context: boolean   // Send full context to AI
  }
  ```
- [ ] Build context using `AIContextService.buildContext(companyId, { scope: 'task', goalId })`
- [ ] AI prompt includes:
  - Weekly goal details (title, week number, KR context)
  - Other weeks' tasks (to avoid duplication)
  - SSI weak areas (for targeted improvement)
  - Task history patterns (realistic suggestions)
  - Rejection history (avoid similar rejected tasks)
- [ ] Response:
  ```javascript
  {
    tasks: [
      { name, description, priority, estimated_hours, suggested_day },
    ],
    reasoning: "Why these tasks for this week",
    context_used: { ssi_blocks, existing_tasks_count, velocity }
  }
  ```
- [ ] Fallback to template if AI disabled

**Files to Create**:
- None (add to existing planning.js)

**Files to Modify**:
- `server/routes/planning.js` - Add `/generate-tasks` endpoint
- `client/pages/scripts/planning-v2.js` - Update `generateWeekTasks()` to call new endpoint

**Reuse**: Pattern from `generateWeeklyPlanWithAI()`, context from unified service

---

#### X9: Update Frontend Generate Buttons (3 pts)
**As a** user
**I want** Generate Weekly Goals and Generate Tasks buttons to use full context
**So that** AI suggestions are relevant to my current situation

**Acceptance Criteria**:
- [ ] Update `generateWeeklyGoals()` in planning-v2.js:
  - Call `/api/planning/generate-weekly-plan` with existing goals awareness
  - Smart merge: Generate only missing weeks if some exist
  - Show "Extending plan..." vs "Generating plan..." based on state
- [ ] Update `generateWeekTasks()` in planning-v2.js:
  - Call new `/api/planning/generate-tasks` endpoint (not bulk template)
  - Pass goal_id and include_context: true
  - Show AI reasoning in UI (collapsible)
- [ ] Add loading states with context-aware messaging:
  - "Analyzing your organization..." (fetching context)
  - "Generating personalized goals..." (AI working)
  - "Creating tasks based on Week 2 focus..." (task generation)

**Files to Modify**:
- `client/pages/scripts/planning-v2.js` - Update generate functions
- `client/pages/planning-v2.html` - Update button labels, add reasoning display

**Reuse**: Existing button handlers, just updating API calls

---

#### X10: Weekly Goal Assignment UI (5 pts)
**As a** manager
**I want** to assign weekly goals and tasks to team members
**So that** work is distributed appropriately

**Acceptance Criteria**:
- [ ] Make "Unassigned" label clickable on weekly goal cards
- [ ] Show dropdown with team members:
  ```javascript
  [
    { id, name, role, avatar, currentTasks: 5 },
    ...
  ]
  ```
- [ ] Call `PATCH /api/goals/weekly/:id` with `{ owner_id }`
- [ ] Update UI immediately with assignee avatar + name
- [ ] Add same functionality to task cards:
  - Click assignee → dropdown
  - Call `PATCH /api/tasks/:id` with `{ assigned_to }`
- [ ] Show workload indicator (tasks assigned this week)
- [ ] RBAC: Only MANAGER+ roles can reassign

**Files to Modify**:
- `client/pages/planning-v2.html` - Add assignment dropdowns
- `client/pages/scripts/planning-v2.js` - Add assignment handlers
- `server/routes/goals.js` - Ensure PATCH endpoint supports owner_id

**Reuse**: Pattern from dashboard-v2.js reassign modal

---

## Technical Design

### Context Structure (Complete)

```javascript
// Full context returned by buildContext(companyId, { scope: 'full' })
{
  // Layer 1: FOUNDATION (Always present)
  company: {
    id, name, industry, industry_subtype, employee_count,
    size_category, mission, business_model, value_proposition,
    client_profile, created_at
  },
  ssi: {
    dimensions: { speed, strength, intelligence },
    composite: number,
    blocks: {
      delivery, decisions, change, response,
      financial, operations, people, quality,
      market, data, strategy, learning
    },
    priorityBlocks: [{ block, score, gap, dimension }],
    weakAreas: [{ block, score, recommendation }],
    strongAreas: [{ block, score }],
    has12BlockData: boolean,
    assessmentDate: Date
  },
  business: {
    metrics: { revenue, growth, margins, ... },
    targets: { ... },
    strategic_priorities: [...],
    key_challenges: [...],
    risk_indicators: [{ type, severity, message }]
  },
  team: {
    count: number,
    departments: [...],
    members: [{ id, name, role, currentTasks }],
    capacity: { totalHours, availableHours }
  },

  // Layer 2: OKR CONTEXT (scope: 'okr', 'weekly', 'task', 'full')
  objectives: {
    total: number,
    active: number,
    byCategory: { financial: 1, operational: 2, ... },
    gaps: ['No people objective'],
    list: [{ id, title, category, progress, krCount, status }]
  },
  keyResults: {
    total: number,
    completed: number,
    atRisk: number,
    byObjective: { 'obj-123': [{ id, title, progress }] }
  },

  // Layer 3: PLANNING CONTEXT (scope: 'weekly', 'task', 'full')
  planning: {
    quarterlyGoals: { total, byKR: {...} },
    weeklyGoals: {
      total: number,
      thisQuarter: number,
      existingWeeks: [{ week, title, progress, tasks }]
    }
  },

  // Layer 4: TASK CONTEXT (scope: 'task', 'full')
  tasks: {
    total: number,
    completed: number,
    overdue: number,
    velocity: number,  // per week
    byGoal: { 'goal-456': { total, completed } },
    existingTasks: [{ name, status, assignee }]
  },

  // Layer 5: HISTORY & LEARNING
  history: {
    lastInteraction: Date,
    interactionCount: number,
    rejections: [{ type, reason, example }],
    taskPatterns: {
      commonTypes: [...],
      completionRate: number,
      velocityTrend: [...]
    }
  },

  // Layer 6: DELTA (what changed)
  delta: {
    since: Date,
    changes: [{ type, id, details }]
  },

  // Focus context (specific item being worked on)
  focus: {
    type: 'objective' | 'keyResult' | 'weeklyGoal',
    ...itemDetails
  },

  // Metadata
  metadata: {
    generatedAt: Date,
    contextVersion: '3.0.0',
    scope: string,
    completeness: { hasSSI, hasMetrics, hasTeam, hasHistory }
  }
}
```

### API Changes

| Endpoint | Change | Description |
|----------|--------|-------------|
| `POST /api/planning/generate-weekly-plan` | MODIFY | Use unified context, smart merge |
| `POST /api/planning/generate-tasks` | CREATE | New AI-powered task generation |
| `PATCH /api/goals/weekly/:id` | VERIFY | Support owner_id assignment |
| `PATCH /api/tasks/:id` | VERIFY | Support assigned_to assignment |

### Database Changes

| Model | Change | Fields |
|-------|--------|--------|
| `AIInteractionLog` | CREATE | Full schema as specified in X5 |
| `Company` | MODIFY | Add `last_llm_interaction: Date` |
| `AIOKRSuggestion` | MODIFY | Add `rejection_reason: enum` to dismissal |

---

## Dependencies

### Prerequisites (Must Complete First)
- None - This epic is foundational

### Enables (Blocked Until This Completes)
- Any future AI feature improvements
- AI chat/assistant features
- Personalized recommendations

### External Dependencies
- OpenAI API (existing)
- Redis for caching (optional, existing)

---

## Testing Strategy

### Unit Tests
- [ ] `AIContextService.getFullSSIScores()` - Returns 12-block data
- [ ] `AIContextService.buildContext()` - Returns correct layers by scope
- [ ] `AIContextService.getContextDelta()` - Detects changes correctly
- [ ] `AIContextService.getTaskHistory()` - Aggregates 1-year data
- [ ] `AIContextService.getRejectionHistory()` - Returns rejection patterns

### Integration Tests
- [ ] Generate Weekly Goals uses unified context
- [ ] Generate Tasks calls new AI endpoint
- [ ] Context includes rejection history after dismissal
- [ ] Assignment persists and shows in UI

### E2E Tests
- [ ] Full flow: Generate OKRs → Generate Weekly Goals → Generate Tasks
- [ ] Context accumulates correctly across interactions
- [ ] Rejection reason captured and influences next generation

---

## Rollout Plan

### Phase 1: Backend Consolidation (Week 1)
1. Deploy X1 (12-block in AIContextService)
2. Deploy X2 (Unified buildContext)
3. Deploy X4 (Planning uses service)
4. Validate: No regressions in OKR/planning generation

### Phase 2: History Tracking (Week 1-2)
1. Deploy X5 (AIInteractionLog model)
2. Deploy X6 (Rejection tracking)
3. Deploy X7 (Task history)
4. Validate: Logs being created, history accessible

### Phase 3: Frontend Features (Week 2)
1. Deploy X8 (AI task generation endpoint)
2. Deploy X9 (Frontend button updates)
3. Deploy X10 (Assignment UI)
4. Validate: Full user flow works

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Context building code locations | 4+ files | 1 file |
| Duplicate SSI fetching code | 3 implementations | 1 implementation |
| Task generation AI-powered | No (templates) | Yes |
| LLM interactions tracked | 0% | 100% |
| Rejection reasons captured | No | Yes |
| Task history in context | 0 months | 12 months |

---

## Story Point Summary

| Story | Points | Phase |
|-------|--------|-------|
| X1: 12-Block SSI in Service | 5 | 1 |
| X2: Unified buildContext() | 5 | 1 |
| X3: Context Delta Detection | 3 | 1 |
| X4: Consolidate Planning Context | 3 | 1 |
| X5: AIInteractionLog Model | 5 | 2 |
| X6: Track Rejection Reasons | 3 | 2 |
| X7: 1-Year Task History | 5 | 2 |
| X8: AI Task Generation Endpoint | 5 | 3 |
| X9: Frontend Generate Buttons | 3 | 3 |
| X10: Assignment UI | 5 | 3 |
| **Total** | **42** | |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Context too large for token limit | High | Add context summarization, prioritize recent/relevant |
| AI latency increases with more context | Medium | Cache context, parallelize fetches |
| Breaking existing OKR generation | High | Feature flag, A/B test before full rollout |
| Task history query performance | Medium | Add indexes, limit to 1000 tasks in history |

---

## Context Token Limit Handling (Added per Audit)

> **Requirement**: Context must not exceed 8000 tokens to ensure reliable AI responses

### Token Budget Allocation

| Context Section | Max Tokens | Priority | Truncation Strategy |
|-----------------|------------|----------|---------------------|
| Company Profile | 500 | P0 (always keep) | Never truncate |
| SSI 12-Block Scores | 800 | P0 (always keep) | Never truncate |
| Focus Item (current objective/goal) | 400 | P0 (always keep) | Never truncate |
| Active Objectives (up to 10) | 1500 | P1 | Keep most recent 10 |
| Rejection History | 600 | P1 | Keep last 20 rejections |
| Weekly Goals (current quarter) | 1200 | P2 | Keep current + next week |
| Task History Patterns | 800 | P2 | Summarize, don't list |
| Context Delta | 400 | P2 | Keep last 10 changes |
| Team Info | 300 | P3 | Keep count + managers only |
| **Reserve Buffer** | 500 | — | For prompt template |
| **Total** | **8000** | | |

### Implementation

```javascript
// In AIContextService.buildContext()

const TOKEN_LIMITS = {
  company: 500,
  ssi: 800,
  focus: 400,
  objectives: 1500,
  rejections: 600,
  weeklyGoals: 1200,
  taskHistory: 800,
  delta: 400,
  team: 300,
  buffer: 500
};

const MAX_TOKENS = 8000;

async buildContext(companyId, options) {
  const context = {};
  let tokenCount = 0;

  // P0: Always include (non-negotiable)
  context.company = await this.getCompanyProfile(companyId);
  tokenCount += this.estimateTokens(context.company);

  context.ssi = await this.getFullSSIScores(companyId);
  tokenCount += this.estimateTokens(context.ssi);

  if (options.focusId) {
    context.focus = await this.getFocusItem(options.focusId);
    tokenCount += this.estimateTokens(context.focus);
  }

  // P1: Include if budget allows
  if (tokenCount + TOKEN_LIMITS.objectives < MAX_TOKENS) {
    context.objectives = await this.getObjectives(companyId, { limit: 10 });
    tokenCount += this.estimateTokens(context.objectives);
  }

  if (options.includeRejections && tokenCount + TOKEN_LIMITS.rejections < MAX_TOKENS) {
    context.rejections = await this.getRejectionHistory(companyId, { limit: 20 });
    tokenCount += this.estimateTokens(context.rejections);
  }

  // P2: Include if significant budget remains
  if (tokenCount < MAX_TOKENS * 0.7) {
    context.weeklyGoals = await this.getWeeklyGoals(companyId, { currentQuarter: true });
    tokenCount += this.estimateTokens(context.weeklyGoals);
  }

  if (options.includeHistory && tokenCount < MAX_TOKENS * 0.8) {
    context.taskHistory = await this.getTaskHistorySummary(companyId); // Summarized, not full list
    tokenCount += this.estimateTokens(context.taskHistory);
  }

  // Log token usage
  context.metadata = {
    tokensUsed: tokenCount,
    tokenLimit: MAX_TOKENS,
    truncated: tokenCount >= MAX_TOKENS * 0.9
  };

  return context;
}

estimateTokens(obj) {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(JSON.stringify(obj).length / 4);
}
```

### Acceptance Criteria (X2 Addition)

- [ ] `buildContext()` never returns > 8000 tokens
- [ ] Token count logged in `context.metadata.tokensUsed`
- [ ] P0 sections always included regardless of size
- [ ] P2/P3 sections truncated first when budget exceeded
- [ ] Warning logged when context > 7000 tokens

---

## Appendix: Files to Modify

### Backend
| File | Action | Stories |
|------|--------|---------|
| `server/services/AIContextService.js` | EXTEND | X1, X2, X3, X6, X7 |
| `server/routes/ai-okr.js` | MODIFY | X1, X4 |
| `server/routes/planning.js` | MODIFY | X4, X8 |
| `server/models/AIInteractionLog.js` | CREATE | X5 |
| `server/models/AIOKRSuggestion.js` | MODIFY | X6 |
| `server/models/Company.js` | MODIFY | X3 |

### Frontend
| File | Action | Stories |
|------|--------|---------|
| `client/pages/scripts/planning-v2.js` | MODIFY | X9, X10 |
| `client/pages/planning-v2.html` | MODIFY | X9, X10 |
| `client/pages/scripts/team-ssi-view.js` | MODIFY | X6 |

---

**Document Created**: February 15, 2026
**Author**: Claude Code
**Version**: 1.0
