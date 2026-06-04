# Sprint 18-A Handoff Document

**Sprint**: 18-A (Hotfix) - SSI Scoring Unification
**Created**: March 10, 2026
**Status**: PLANNED

---

## Sprint Overview

| Metric | Value |
|--------|-------|
| **Total Points** | 13 pts |
| **Duration** | 2-3 days |
| **Priority** | HIGH |
| **Focus** | Unify SSI scoring to use DiagnosticEngine |

---

## Progress Summary

### Stories

| Story | Points | Status | Notes |
|-------|--------|--------|-------|
| U1.1: Audit Score Consumers | 2 | PENDING | Identify all SSI display points |
| U1.2: DiagnosticEngine Adapter | 5 | PENDING | Modify team-breakdown endpoint |
| U1.3: Legacy Format Support | 3 | PENDING | Handle 4 data formats |
| U1.4: Comprehensive Testing | 3 | PENDING | Verify consistency |

```
Total Progress: [          ] 0/13 pts (0%)
```

---

## The Problem

**Conflicting SSI scores** between Company Overview and SSI Diagnostic Report:

| View | Speed | Strength | Intelligence | Composite |
|------|-------|----------|--------------|-----------|
| Company Overview | 8.6 | 5.4 | 7.1 | 7.0 |
| SSI Diagnostic | 6.0 | 4.1 | 6.4 | 5.5 |

**Root Cause**: Two different calculation methods:
- Company Overview uses simple averaging
- SSI Diagnostic uses block-level MECE with industry weights

---

## Key Files

### To Modify

| File | Purpose |
|------|---------|
| `server/routes/assessments.js` | team-breakdown endpoint (lines 677-1083) |
| `server/services/diagnostic/DiagnosticEngine.js` | Add legacy format support |

### To Create

| File | Purpose |
|------|---------|
| `tests/unit/services/DiagnosticEngine.test.js` | Legacy format unit tests |
| `tests/integration/ssi-consistency.test.js` | Score consistency tests |

### Reference Files

| File | Purpose |
|------|---------|
| `server/services/UnifiedSSIScoringService.js` | Primary scoring engine |
| `client/pages/scripts/team-ssi-view.js` | Frontend score display |

---

## Quick Commands

```bash
# Run existing tests
npm test

# Run diagnostic service tests
npm test -- --testPathPattern=diagnostic

# Start dev server
npm run dev
```

---

## Recommendations for First Session

### Start With: Story U1.1 (Audit)

**Why**: Need complete picture before making changes.

**Steps**:
1. Search for all `/api/assessments` endpoints returning scores
2. Search for all `/api/diagnostic` endpoints
3. Grep frontend for SSI score display logic
4. Document each consumer's current calculation method

### Then: Story U1.3 (Legacy Format Support)

**Why**: DiagnosticEngine must handle all formats before we can switch.

---

## Session History

| Date | Type | Duration | Points | Notes |
|------|------|----------|--------|-------|
| Mar 10, 2026 | Strategy | 1.5h | 0 (planning) | Architecture audit - SSI scoring deep-dive |

### Architecture Audit Findings (Mar 10, 2026)

Comprehensive architecture audit completed. Key findings for Sprint 18-A:

1. **Root Cause Confirmed**: `assessments.js:677-1083` uses simple averaging while `DiagnosticEngine` uses 12-block MECE
2. **4 Data Formats**: Assessment stores `ssi_scores`, `dimension_scores`, `ssi_result`, `blocks` - all need support
3. **AIContextService Impact**: Also uses simple averaging at lines 512-517
4. **Full audit doc**: `KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/ARCHITECTURE_AUDIT_2026Q1.md`

---

## Related Documents

- [Sprint 18-A Master Plan](./SPRINT18A_MASTER_PLAN.md)
- [Sprint 18 Handoff](../SPRINT-18%20(Planned)/SPRINT18_HANDOFF_DOCUMENT.md)
- [Sprint 19 Master Plan](../SPRINT-19%20(Planned)/SPRINT19_MASTER_PLAN.md)
- [**Architecture Audit Q1 2026**](../../2-TECHNICAL/0-SYSTEM-ARCHITECTURE/ARCHITECTURE_AUDIT_2026Q1.md) - Comprehensive findings

---

---

## Epic P1: OKR Prompt Quality Improvements (15 pts)

**Added**: March 11, 2026
**Priority**: HIGH
**Trigger**: KARVIA Consulting Flow testing revealed prompt gaps

### Problem Statement

OKR generation output quality is ~5/10 due to:
1. Missing consulting industry expertise (falls back to generic)
2. SSI 12-block scores not reaching prompt (no test data)
3. Low KR diversity (4 identical KRs measuring same metric)
4. Prompt is bloated (~6,500 tokens) diluting key instructions
5. No explicit category guidance (wrong category assignment)

### Stories

| Story | Points | Status | Description |
|-------|--------|--------|-------------|
| P1.1: Add Consulting Industry Expertise | 3 | PENDING | Add `consulting` and `it_consulting` to industryExpertise |
| P1.2: Seed KARVIA SSI Test Data | 2 | PENDING | Create SSI assessment data for test company |
| P1.3: Lean Prompt Restructure | 5 | PENDING | Remove visual bloat, consolidate rules |
| P1.4: Add Category Guidance | 2 | PENDING | Explicit category-to-SSI mapping in prompt |
| P1.5: Strengthen KR Diversity | 3 | PENDING | Add "different angles" enforcement |

```
Epic P1 Progress: [          ] 0/15 pts (0%)
```

---

### P1.1: Add Consulting Industry Expertise (3 pts)

**File**: `server/routes/ai-okr.js` (~line 1710)

**Add to industryExpertise object**:
```javascript
'consulting': {
  context: 'strategy consulting, professional services, or advisory',
  metrics: [
    'utilization rate',
    'clients per advisor',
    'project on-time delivery',
    'recurring revenue %',
    'client retention rate',
    'revenue per consultant',
    'client concentration risk'
  ],
  weak_block_actions: {
    'delivery': 'Standardize delivery playbooks, implement sprint methodology',
    'operations': 'Create repeatable engagement templates, automate reporting',
    'strategy': 'Develop client roadmap frameworks, implement planning cadence',
    'data': 'Build KPI dashboards, implement data-driven decision protocols',
    'people': 'Create capability matrices, implement structured career paths',
    'financial': 'Track margin by engagement, implement utilization targets'
  }
},
'it_consulting': {
  context: 'IT strategy, digital transformation, or technology implementation',
  metrics: [
    'project delivery rate',
    'consultant utilization',
    'client satisfaction score',
    'repeat business %',
    'implementation success rate',
    'time to value'
  ],
  weak_block_actions: {
    'delivery': 'Implement agile delivery, reduce cycle time',
    'operations': 'Standardize tech stacks, create reusable components',
    'strategy': 'Develop AI/data roadmaps for clients',
    'learning': 'Create certification paths, tech skill matrices'
  }
}
```

---

### P1.2: Seed KARVIA SSI Test Data (2 pts)

**Location**: `KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/payloads/`

**Create**: `karvia_ssi_assessment_seed.json`

Based on test model scores:
```json
{
  "company_id": "699cabf79e1b64e364352c9e",
  "dimension_scores": {
    "speed": 5.8,
    "strength": 6.2,
    "intelligence": 5.4
  },
  "block_scores": {
    "delivery": 5.3,
    "decisions": 5.6,
    "change": 6.0,
    "response": 6.2,
    "financial": 6.4,
    "operations": 5.7,
    "people": 6.1,
    "quality": 6.5,
    "market": 5.1,
    "data": 5.2,
    "strategy": 5.0,
    "learning": 6.0
  }
}
```

**Also update seed script** to inject this data before OKR generation.

---

### P1.3: Lean Prompt Restructure (5 pts)

**Goal**: Reduce from ~6,500 tokens to ~3,500 tokens (46% reduction)

**Changes**:

1. **Remove visual decorations** (~800 tokens saved):
   - `━━━━━` box borders → simple `---` separators
   - `┏━━━┓` tables → markdown tables
   - Emoji clutter → minimal markers

2. **Consolidate repeated rules** (~400 tokens saved):
   - "Use baseline numbers" appears 5x → 1x
   - "Objectives are aspirational" appears 4x → 1x

3. **Tighten examples** (~300 tokens saved):
   - Keep 2 good/2 bad examples instead of 4/4

4. **Remove redundant sections**:
   - If no rejectionHistory, skip entire section
   - If full category coverage, skip gap analysis

---

### P1.4: Add Category Guidance (2 pts)

**Add to system prompt** (after OKR FUNDAMENTALS):

```
CATEGORY ASSIGNMENT RULES:
Each objective MUST be assigned to ONE category that best matches its focus:

| Category | When to Use | SSI Dimensions |
|----------|-------------|----------------|
| growth | Revenue, market expansion, new clients | Financial, Market |
| operations | Delivery, processes, efficiency | Delivery, Operations |
| innovation | New products, technology, R&D | Strategy, Data, Learning |
| people_culture | Team, retention, culture, skills | People, Learning |
| customer | Client satisfaction, NPS, retention | Response, Quality, Market |
| financial | Margins, costs, profitability | Financial |

WRONG: "Cultivate Innovation..." → operations (should be innovation)
RIGHT: "Cultivate Innovation..." → innovation
```

---

### P1.5: Strengthen KR Diversity (3 pts)

**Add to system prompt** (after KEY RESULTS section):

```
KEY RESULT DIVERSITY RULE:
The 4 Key Results for each objective MUST measure DIFFERENT aspects:

✗ WRONG (all same metric):
  KR1: Increase retention from 88% to 89%
  KR2: Increase retention from 89% to 90%
  KR3: Increase retention from 90% to 91%
  KR4: Increase retention from 91% to 92%

✓ RIGHT (diverse metrics attacking same objective):
  KR1: Increase client retention from 88% to 92%
  KR2: Improve NPS from 45 to 65
  KR3: Increase client referral rate from 15% to 30%
  KR4: Extend average client tenure from 2.8 to 3.5 years

Each KR should prove the objective from a DIFFERENT angle.
```

---

### Testing the Improvements

After implementing P1.1-P1.5, re-run KARVIA Consulting Flow:

```bash
BASE_URL="https://karvia-business-1.onrender.com" \
EMAIL="rsm@karvia.ai" \
PASSWORD="Testuser@123" \
START_DATE="2026-04-01" \
bash KARVIA_STRATEGY/4-AUDIT/2-EXTERNAL/2026_03_11_KARVIA_CONSULTING_FLOW/scripts/seed_karvia_consulting_flow.sh
```

**Success Criteria**:
- [ ] Generated OKRs use consulting-specific terminology
- [ ] SSI weak blocks (strategy, market, data) are targeted
- [ ] Each objective has 4 diverse KRs
- [ ] Category assignments are correct
- [ ] Quality score improves from 5/10 to 8/10

---

---

## Epic P2: Incremental Weekly Planning with Context (13 pts)

**Added**: March 11, 2026
**Priority**: HIGH
**Trigger**: Planning page only supports 4-week blocks, quarter has 12 weeks

### Problem Statement

Current planning flow generates 4 weekly goals at once. But:
1. A quarter has ~12 weeks, users need to add more weeks incrementally
2. When adding Week 5-8, AI doesn't know what happened in Week 1-4
3. Tasks aren't scoped realistically to timeframe
4. No context accumulation between planning sessions

### User Journey Example

```
Week 1-4: User generates initial plan for "Increase training completion from 60% to 85%"
  → Week 1: Establish Training Needs Assessment
  → Week 2: Develop Training Program
  → Week 3: Launch Pilot Training
  → Week 4: Full Training Program Implementation

[2 weeks later...]

Week 5-8: User wants to add more weeks
  AI NEEDS TO KNOW:
  - Week 1-4 tasks exist
  - Week 4 was "Full Implementation"
  - Week 5 should logically continue (e.g., "Monitor Training Adoption")

  → Week 5: Monitor Training Adoption Metrics
  → Week 6: Address Training Gaps
  → Week 7: Scale to Remaining Teams
  → Week 8: Measure Initial Impact

[Later...]

Week 9-12: User adds final weeks
  AI KNOWS: Weeks 1-8 context
  → Week 9: Optimize Based on Feedback
  → Week 10: Launch Advanced Training Modules
  → Week 11: Certify Training Champions
  → Week 12: Final Assessment & KR Review
```

### Stories

| Story | Points | Status | Description |
|-------|--------|--------|-------------|
| P2.1: Add "Generate More Weeks" UI | 3 | PENDING | Button to add Week 5-8, 9-12 |
| P2.2: Context Accumulation Endpoint | 5 | PENDING | Fetch previous weeks for AI context |
| P2.3: Realistic Task Scoping | 3 | PENDING | Prompt guidance for timeframe realism |
| P2.4: Journey Continuity Prompt | 2 | PENDING | "Continue from Week X" in prompt |

```
Epic P2 Progress: [          ] 0/13 pts (0%)
```

---

### P2.1: Add "Generate More Weeks" UI (3 pts)

**File**: `client/pages/planning-v2.html`

**Current State**: Shows 4 weeks with "Generate Weekly Goals" button

**New State**:
```
┌─────────────────────────────────────────────────────────────┐
│ KR: Increase training completion rate from 60% to 85%       │
│ Weekly Goals · 12 weeks available · 4 weeks generated       │
├─────────────────────────────────────────────────────────────┤
│ Week 1  Mar 11-17  Establish Training Needs Assessment  0%  │
│ Week 2  Mar 18-24  Develop Training Program             0%  │
│ Week 3  Mar 25-31  Launch Pilot Training                0%  │
│ Week 4  Apr 1-7    Full Training Program Implementation 0%  │
├─────────────────────────────────────────────────────────────┤
│         [+ Generate Weeks 5-8]  [+ Generate Weeks 9-12]     │
│         (disabled until 1-4 exist) (disabled until 5-8)    │
└─────────────────────────────────────────────────────────────┘
```

**Logic**:
- Show "Generate Weeks 5-8" only after Weeks 1-4 exist
- Show "Generate Weeks 9-12" only after Weeks 5-8 exist
- Each block generates 4 more weekly goals

---

### P2.2: Context Accumulation Endpoint (5 pts)

**File**: `server/routes/planning.js`

**New Endpoint**: `GET /api/planning/weekly-context/:keyResultId`

```javascript
router.get('/weekly-context/:keyResultId', async (req, res) => {
  const { keyResultId } = req.params;

  // Get all existing weekly goals for this KR
  const existingWeeks = await Goal.find({
    key_result_id: keyResultId,
    time_period: 'WEEKLY'
  }).sort({ week_number: 1 });

  // Get the KR and Objective context
  const objective = await Objective.findOne({
    'key_results._id': keyResultId
  });
  const keyResult = objective.key_results.id(keyResultId);

  // Build context summary
  const context = {
    objective: {
      title: objective.title,
      category: objective.category
    },
    key_result: {
      title: keyResult.title,
      current_value: keyResult.current_value,
      target_value: keyResult.target_value
    },
    existing_weeks: existingWeeks.map(w => ({
      week_number: w.week_number,
      title: w.title,
      status: w.status,
      tasks: w.tasks?.map(t => t.title) || []
    })),
    last_week_completed: existingWeeks.length,
    next_week_start: existingWeeks.length + 1
  };

  res.json({ success: true, data: context });
});
```

---

### P2.3: Realistic Task Scoping (3 pts)

**File**: `server/routes/planning.js` (generate-weekly-plan endpoint)

**Add to System Prompt**:

```
TIMEFRAME REALISM RULE:
Tasks must be achievable within their assigned week.

WRONG (too ambitious for 1 week):
  Week 1: "Launch company-wide training program"
  Week 1: "Achieve 85% training completion"

RIGHT (realistic for 1 week):
  Week 1: "Identify training needs via survey"
  Week 1: "Draft training curriculum outline"

PROGRESSION PATTERN:
- Week 1-2: Research, Plan, Prepare
- Week 3-4: Build, Pilot, Test
- Week 5-8: Launch, Scale, Monitor
- Week 9-12: Optimize, Measure, Report
```

---

### P2.4: Journey Continuity Prompt (2 pts)

**Modify**: `server/routes/planning.js` (generate-weekly-plan endpoint)

**When generating Weeks 5-8 or 9-12, add context section**:

```javascript
// In buildWeeklyPlanPrompt()
if (existingWeeks.length > 0) {
  prompt += `
## PREVIOUS WEEKS CONTEXT

The following weeks have already been planned:

${existingWeeks.map(w => `Week ${w.week_number}: ${w.title}
  Tasks: ${w.tasks.map(t => t.title).join(', ')}`).join('\n')}

IMPORTANT:
- Continue logically from Week ${existingWeeks.length}
- Do NOT repeat tasks already covered
- Build on progress made in previous weeks
- Weeks ${nextWeekStart}-${nextWeekEnd} should show PROGRESSION

Generate Weeks ${nextWeekStart} through ${nextWeekEnd}:
`;
}
```

---

### P2 Simulation for Sprint 18-T

Add to Stage 5.5 (Incremental Planning):

**Prompt for Weeks 5-8**:
```
## OBJECTIVE
Foster a Thriving and Engaged Workforce

## KEY RESULT
Increase training completion rate from 60% to 85%

## PREVIOUS WEEKS (1-4)
Week 1: Establish Training Needs Assessment
  Tasks: Survey employees, analyze skill gaps, prioritize needs
Week 2: Develop Training Program
  Tasks: Design curriculum, create materials, set up LMS
Week 3: Launch Pilot Training
  Tasks: Select pilot group, run sessions, gather feedback
Week 4: Full Training Program Implementation
  Tasks: Roll out to all teams, track enrollment, support users

## GENERATE WEEKS 5-8
Continue the journey. Build on Week 4's implementation.
```

**Expected AI Response**:
```json
{
  "weekly_goals": [
    {
      "week": 5,
      "title": "Monitor Training Adoption Metrics",
      "tasks": [
        "Track daily active users in LMS",
        "Identify teams with low engagement",
        "Send reminder communications"
      ]
    },
    {
      "week": 6,
      "title": "Address Training Gaps and Barriers",
      "tasks": [
        "Interview low-engagement teams",
        "Remove access barriers",
        "Add supplementary resources"
      ]
    },
    {
      "week": 7,
      "title": "Scale to Remaining Teams",
      "tasks": [
        "Onboard remaining departments",
        "Train department champions",
        "Schedule completion deadlines"
      ]
    },
    {
      "week": 8,
      "title": "Measure Initial Impact",
      "tasks": [
        "Run completion rate report",
        "Compare to 60% baseline",
        "Document early wins"
      ]
    }
  ]
}
```

---

### Testing P2

1. Create a KR with 4 weeks
2. Click "Generate Weeks 5-8"
3. Verify AI response references Weeks 1-4
4. Verify tasks are progressive, not repetitive
5. Click "Generate Weeks 9-12"
6. Verify full 12-week journey makes sense

**Success Criteria**:
- [ ] "Generate More Weeks" buttons appear after initial plan
- [ ] Context endpoint returns previous weeks
- [ ] AI responses reference previous work
- [ ] Tasks are realistically scoped to week
- [ ] Full 12-week journey is coherent

---

**Document Version**: 1.2.0
**Last Updated**: March 11, 2026
