# Cross-Page AI Context Accumulation Tests

**Version**: 1.0.0
**Last Updated**: February 16, 2026
**Feature**: Epic X - Unified LLM Context Service
**Coverage**: AI context accumulation across all pages

---

## Overview

This test suite validates that AI context accumulates correctly as users navigate through the application. Each interaction adds to the context, making subsequent AI suggestions increasingly personalized and relevant.

---

## Context Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                     AI CONTEXT ACCUMULATION FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐ │
│  │ COMPANY  │────▶│   SSI    │────▶│   OKR    │────▶│  GOALS   │────▶│  TASKS   │ │
│  │ PROFILE  │     │ASSESSMENT│     │GENERATION│     │GENERATION│     │GENERATION│ │
│  └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘ │
│       │                │                │                │                │        │
│       ▼                ▼                ▼                ▼                ▼        │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐ │
│  │ +company │     │ +12-block│     │+objectives│     │ +weekly  │     │ +tasks   │ │
│  │  name    │     │  scores  │     │ +KRs     │     │  goals   │     │ +history │ │
│  │ +industry│     │ +weak    │     │+rejections│    │+rejections│    │+patterns │ │
│  │ +size    │     │  areas   │     │          │     │          │     │          │ │
│  └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘ │
│                                                                                     │
│  CONTEXT SIZE:   ~500 tokens   ~1500 tokens   ~3000 tokens   ~5000 tokens   ~8000  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Section 1: Context Building Tests

### 1.1 Company Profile Context

| ID | Test Case | Context Added | Verification |
|----|-----------|---------------|--------------|
| CTX-001 | Company name captured | `company.name` | In all AI prompts |
| CTX-002 | Industry captured | `company.industry` | Industry-specific suggestions |
| CTX-003 | Company size captured | `company.size` | Scale-appropriate goals |
| CTX-004 | Fiscal year captured | `company.fiscal_year_start` | Correct quarter boundaries |
| CTX-005 | Team count captured | `teams.length` | Team-aware assignments |

**Test Steps for CTX-001**:
```
1. Create company "Acme Corp" in "Technology" industry
2. Navigate to OKR generation
3. Inspect buildContext() output
4. VERIFY: context.company.name === "Acme Corp"
5. VERIFY: Generated OKRs reference "Acme Corp" or tech-specific terms
```

### 1.2 SSI 12-Block Context

| ID | Test Case | Context Added | Verification |
|----|-----------|---------------|--------------|
| CTX-010 | Speed dimension | `ssi.dimensions.speed` | Speed-related OKRs |
| CTX-011 | Strength dimension | `ssi.dimensions.strength` | Strength-related OKRs |
| CTX-012 | Intelligence dimension | `ssi.dimensions.intelligence` | Intelligence OKRs |
| CTX-013 | All 12 blocks | `ssi.blocks[0-11]` | Block-specific targeting |
| CTX-014 | Weak blocks (<60%) | `ssi.weakAreas[]` | Priority improvement |
| CTX-015 | Strong blocks (>80%) | `ssi.strongAreas[]` | Leverage strengths |

**Test Steps for CTX-014 (Weak Block Targeting)**:
```
1. Complete assessment with Block 3 "Operational Agility" = 45%
2. Generate OKRs
3. Inspect buildContext() output
4. VERIFY: context.ssi.weakAreas includes "Operational Agility"
5. VERIFY: At least 1 generated OKR addresses operational agility
6. VERIFY: AI reasoning mentions "low score in Operational Agility"
```

### 1.3 Objective Context Accumulation

| ID | Test Case | Context Added | Verification |
|----|-----------|---------------|--------------|
| CTX-020 | Approved objectives | `objectives[].title` | No duplicates generated |
| CTX-021 | Objective categories | `objectives[].category` | Coverage gaps identified |
| CTX-022 | KR targets | `objectives[].keyResults[]` | Aligned goal targets |
| CTX-023 | Objective owners | `objectives[].owner` | Owner-aware suggestions |
| CTX-024 | Objective status | `objectives[].status` | Skip completed |

**Test Steps for CTX-020 (Duplicate Prevention)**:
```
1. Create objective "Increase Customer Retention"
2. Return to OKR generation
3. Generate new OKRs
4. VERIFY: No suggestion titled "Increase Customer Retention"
5. VERIFY: Similar suggestions reference "building on existing retention"
```

---

## Section 2: Rejection Learning Tests

### 2.1 Rejection Reason Capture

| ID | Rejection Reason | Test Case | AI Adaptation |
|----|------------------|-----------|---------------|
| REJ-001 | too_generic | Reject "Improve performance" | More specific suggestions |
| REJ-002 | too_ambitious | Reject "100% market share" | Realistic targets |
| REJ-003 | not_aligned | Reject unrelated OKR | Better strategic fit |
| REJ-004 | not_strategic | Reject operational item | Strategic-level only |
| REJ-005 | already_exists | Reject duplicate | Different angles |
| REJ-006 | wrong_timeframe | Reject timing issue | Correct period suggestions |

**Test Steps for REJ-001 (Too Generic)**:
```
1. Generate OKRs
2. Reject objective "Improve team performance" with reason "too_generic"
3. VERIFY: AIInteractionLog contains:
   - interaction_type: "OKR_GENERATION"
   - outcome: "REJECTED"
   - rejection_reason: "too_generic"
   - rejected_content: "Improve team performance"
4. Generate OKRs again
5. VERIFY: New prompt includes: "Avoid generic suggestions like 'Improve team performance'"
6. VERIFY: New suggestions are more specific (e.g., "Reduce average ticket resolution time by 30%")
```

### 2.2 Rejection Pattern Learning

| ID | Pattern | Test Case | Expected Behavior |
|----|---------|-----------|-------------------|
| REJ-010 | 3x same reason | Reject 3 with "too_generic" | Heavy weighting on specificity |
| REJ-011 | Mixed reasons | Reject with different reasons | Balanced adaptation |
| REJ-012 | All rejected | Reject all 5 suggestions | Completely different approach |
| REJ-013 | Some approved | 2 approved, 3 rejected | Learn from accepted |

**Test Steps for REJ-012 (All Rejected)**:
```
1. Generate 5 OKRs
2. Reject all 5 with various reasons
3. Generate again
4. VERIFY: All 5 new suggestions are significantly different
5. VERIFY: None overlap with rejected titles
6. VERIFY: AI reasoning mentions "based on previous feedback"
```

---

## Section 3: Task History Context

### 3.1 History Capture

| ID | Test Case | Data Captured | Verification |
|----|-----------|---------------|--------------|
| HIST-001 | Task titles | Last 12 months of tasks | Pattern recognition |
| HIST-002 | Completion rates | % tasks completed | Workload calibration |
| HIST-003 | Task durations | Average time to complete | Realistic estimates |
| HIST-004 | Recurring patterns | Weekly/monthly tasks | Suggest recurring |
| HIST-005 | Seasonal patterns | Quarter-based variations | Season-appropriate |

**Test Steps for HIST-004 (Recurring Patterns)**:
```
1. Create 12 weeks of tasks including "Weekly team standup" every week
2. Navigate to task generation for new week
3. Generate tasks
4. VERIFY: context.taskHistory includes 12 "Weekly team standup" entries
5. VERIFY: AI suggests "Weekly team standup" automatically
6. VERIFY: AI reasoning mentions "recurring task detected"
```

### 3.2 Pattern Application

| ID | Pattern | Test Case | Expected Suggestion |
|----|---------|-----------|---------------------|
| HIST-010 | Monday tasks | Always "Review metrics" on Monday | Suggest Monday metric review |
| HIST-011 | Month-end tasks | "Close books" at month end | Suggest month-end close |
| HIST-012 | Never completed | "Write documentation" 0% rate | Reduce/omit suggestion |
| HIST-013 | High completion | "Quick wins" 95% rate | Prioritize similar tasks |

---

## Section 4: Context Delta Detection

### 4.1 Change Detection

| ID | Change Type | Test Case | Delta Included |
|----|-------------|-----------|----------------|
| DELTA-001 | SSI score change | Block 3: 45% → 65% | +20% improvement noted |
| DELTA-002 | New objective | Added "Growth" objective | "New focus area" |
| DELTA-003 | Completed KR | KR reaches 100% | "Achievement unlocked" |
| DELTA-004 | Team change | New team member added | "Team expanded" |
| DELTA-005 | Role change | User promoted to Manager | "New responsibilities" |

**Test Steps for DELTA-001 (SSI Score Improvement)**:
```
1. Complete first assessment with Block 3 = 45%
2. Generate OKRs (note suggestions focus on Block 3)
3. Complete second assessment with Block 3 = 65%
4. Generate new OKRs
5. VERIFY: context.delta includes:
   - type: "SSI_IMPROVEMENT"
   - block: "Operational Agility"
   - change: +20%
6. VERIFY: AI suggestions acknowledge improvement
7. VERIFY: Suggestions shift focus to other weak areas
```

### 4.2 Delta Impact on Suggestions

| ID | Scenario | Before | After |
|----|----------|--------|-------|
| DELTA-010 | Weak → Strong | Target weak block | Target next weak |
| DELTA-011 | New team member | Team of 5 | "Onboard new member" task |
| DELTA-012 | KR completed | Progress KR | Maintain/stretch goal |
| DELTA-013 | Objective archived | Active in context | Removed from context |

---

## Section 5: Full Journey Context Test

### 5.1 Complete 13-Step Journey

| Step | Page | Action | Context Added | Cumulative Size |
|------|------|--------|---------------|-----------------|
| 1 | My Clients | Add client company | Company profile | ~500 tokens |
| 2 | My Clients | Set industry "Retail" | Industry context | ~550 tokens |
| 3 | Assessment Hub | Create template (45 Q) | Template structure | ~600 tokens |
| 4 | Assessment Hub | Send to 3 stakeholders | Distribution record | ~650 tokens |
| 5 | (External) | 3 stakeholders complete | SSI responses | ~700 tokens |
| 6 | Team SSI | View SSI Report | 12-block scores | ~1500 tokens |
| 7 | Team SSI | Generate OKRs | Request logged | ~1600 tokens |
| 8 | OKR Review | Approve 3, reject 2 | Objectives + rejections | ~2500 tokens |
| 9 | Objectives | View S13 Objectives | Navigation context | ~2550 tokens |
| 10 | Planning | Generate weekly goals | Goals + rejections | ~3500 tokens |
| 11 | Planning | Generate tasks | Tasks | ~4500 tokens |
| 12 | Dashboard | Complete 5 tasks | Task history | ~5000 tokens |
| 13 | Planning | Generate more tasks | Full context | ~6000 tokens |

**Full Journey Execution**:
```
TEST: AI Context Accumulates Correctly Across Full Journey

SETUP:
- New test company "Journey Test Corp"
- Fresh consultant user
- No prior data

EXECUTION:
1. [My Clients] Add "Journey Test Corp" - Retail, 100-250 employees
   → VERIFY: buildContext() includes company data

2. [Assessment Hub] Create "Full SSI" template with 45 questions
   → VERIFY: Template ID tracked

3. [Assessment Hub] Send to user1@test.com, user2@test.com, user3@test.com
   → VERIFY: Distribution logged

4. [External] All 3 complete assessment
   → VERIFY: SSI scores calculated

5. [Team SSI] View SSI Report
   → VERIFY: 12 blocks visible
   → NOTE: Block 5 = 42%, Block 9 = 38% (weakest)

6. [Team SSI] Click "Generate OKRs"
   → VERIFY: buildContext() includes SSI 12-block
   → VERIFY: Generated OKRs target Block 5 and Block 9

7. [OKR Review] Approve 3, reject 2 with "too_generic"
   → VERIFY: AIInteractionLog has 5 entries
   → VERIFY: 2 rejection entries with reason

8. [Objectives] View Objectives page
   → VERIFY: 3 approved objectives visible

9. [Planning] Select Objective 1, KR 1
   → VERIFY: Context includes objective details

10. [Planning] Generate weekly goals
    → VERIFY: buildContext() includes:
       - Company profile
       - SSI 12-block
       - Approved objectives
       - Rejection history
    → VERIFY: Goals avoid "too_generic" pattern

11. [Planning] Generate tasks for Goal 1
    → VERIFY: buildContext() includes weekly goal

12. [Dashboard] Complete 5 tasks
    → VERIFY: Task completion logged

13. [Planning] Generate more tasks
    → VERIFY: buildContext() includes:
       - All previous context
       - 5 completed tasks in history
       - Completion patterns
    → VERIFY: AI suggests tasks similar to completed (high success rate)

FINAL VERIFICATION:
- Total context tokens: ~6000
- All 7 context layers present
- Rejection learning applied
- Task history influences suggestions
- No duplicate suggestions
- AI reasoning references all context sources
```

### 5.2 Context Verification Points

| Checkpoint | Location | Verification Method |
|------------|----------|---------------------|
| Company context | Step 1 | API log inspection |
| SSI context | Step 6 | buildContext() debug |
| Rejection context | Step 7 | AIInteractionLog query |
| Objective context | Step 9 | buildContext() debug |
| Goal context | Step 10 | buildContext() debug |
| Task history | Step 13 | buildContext() debug |
| Delta detection | Step 13 | Compare to Step 7 context |

---

## Section 6: API Contract Tests

### 6.1 buildContext() Response Structure

```javascript
// Expected buildContext() response
{
  company: {
    id: "ObjectId",
    name: "string",
    industry: "string",
    size: "string",
    fiscal_year_start: "string"
  },
  ssi: {
    dimensions: {
      speed: 0-100,
      strength: 0-100,
      intelligence: 0-100
    },
    blocks: [
      { id: 1, name: "string", score: 0-100 },
      // ... 12 blocks
    ],
    weakAreas: ["string"],
    strongAreas: ["string"],
    lastUpdated: "ISO date"
  },
  objectives: [
    {
      id: "ObjectId",
      title: "string",
      category: "string",
      status: "string",
      keyResults: [...]
    }
  ],
  rejectionHistory: [
    {
      type: "OKR" | "GOAL" | "TASK",
      reason: "string",
      rejectedContent: "string",
      timestamp: "ISO date"
    }
  ],
  taskHistory: {
    last12Months: [...],
    patterns: {
      recurring: [...],
      completionRate: 0-100,
      avgDuration: "string"
    }
  },
  delta: {
    ssiChanges: [...],
    newObjectives: [...],
    completedKRs: [...]
  },
  metadata: {
    contextSize: number,
    lastBuildTime: "ISO date",
    version: "string"
  }
}
```

### 6.2 AIInteractionLog Structure

```javascript
// Expected AIInteractionLog entry
{
  _id: "ObjectId",
  company_id: "ObjectId",
  user_id: "ObjectId",
  interaction_type: "OKR_GENERATION" | "GOAL_GENERATION" | "TASK_GENERATION",
  request_context: { /* snapshot of context */ },
  generated_items: [
    {
      type: "OBJECTIVE" | "GOAL" | "TASK",
      content: "string",
      reasoning: "string",
      outcome: "APPROVED" | "REJECTED" | "PENDING"
    }
  ],
  rejection_reasons: [
    {
      item_index: number,
      reason: "string",
      timestamp: "ISO date"
    }
  ],
  timestamp: "ISO date",
  duration_ms: number
}
```

---

## Section 7: Edge Cases

### 7.1 Context Boundary Cases

| ID | Scenario | Expected |
|----|----------|----------|
| EDGE-001 | No SSI data | Context proceeds with company only |
| EDGE-002 | No objectives yet | Empty objectives array |
| EDGE-003 | No task history | Empty history, no patterns |
| EDGE-004 | Context > 30k tokens | Truncation with priority retention |
| EDGE-005 | Concurrent AI calls | Queue or deduplicate |

**Test Steps for EDGE-004 (Context Overflow)**:
```
1. Create company with extensive history (5 years, 1000+ tasks)
2. Build full context
3. VERIFY: Total tokens < 30,000
4. VERIFY: Priority data retained:
   - Recent SSI (last assessment)
   - Recent objectives (last year)
   - Recent tasks (last 12 months)
   - All rejection history
5. VERIFY: Older data truncated first
```

### 7.2 Data Consistency Cases

| ID | Scenario | Expected |
|----|----------|----------|
| CONSIST-001 | SSI updated mid-generation | Use snapshot from start |
| CONSIST-002 | Objective deleted during | Graceful handling |
| CONSIST-003 | User role changed | Permissions still enforce |
| CONSIST-004 | Company switched mid-generation | Block or cancel |

### 7.3 AI Service Failures

| ID | Scenario | Expected |
|----|----------|----------|
| FAIL-001 | OpenAI timeout | Error message, retry option |
| FAIL-002 | OpenAI rate limit | Queue, show wait time |
| FAIL-003 | Invalid AI response | Graceful fallback |
| FAIL-004 | Partial response | Show what completed |

---

## Section 8: Test Execution

### 8.1 Quick Context Test (15 min)

| # | Test | Duration | Status |
|---|------|----------|--------|
| 1 | Login, view company context | 2 min | [ ] |
| 2 | View SSI, verify 12-block in context | 3 min | [ ] |
| 3 | Generate OKRs, verify SSI used | 5 min | [ ] |
| 4 | Reject 1, verify rejection logged | 3 min | [ ] |
| 5 | Regenerate, verify learning | 2 min | [ ] |

### 8.2 Full Context Accumulation Test (1 hour)

| Phase | Test IDs | Duration | Status |
|-------|----------|----------|--------|
| Context Building | CTX-001 to CTX-024 | 20 min | [ ] |
| Rejection Learning | REJ-001 to REJ-013 | 15 min | [ ] |
| Task History | HIST-001 to HIST-013 | 10 min | [ ] |
| Context Delta | DELTA-001 to DELTA-013 | 10 min | [ ] |
| Full Journey | 13-step journey | 20 min | [ ] |
| Edge Cases | EDGE + CONSIST + FAIL | 15 min | [ ] |

**Total Duration**: ~90 minutes

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |
| Tech Lead | | | |

---

**Document Version**: 1.0.0
**Sprint**: 13 (Epic X)
**Review Cycle**: Each sprint
