# Sprint 17: McKinsey-Style Progressive Context Building

**Sprint**: 17 - Intelligent Context Engine
**Created**: March 8, 2026
**Updated**: March 8, 2026 (External Audit Integrated)
**Status**: PLANNED
**Prerequisite**: Sprint 16 complete + Foundation Fixes

---

## External Audit Integration Summary

Key architectural decisions from external audit (March 8, 2026):

| Decision | Auditor Answer | Implementation |
|----------|---------------|----------------|
| **Schema Paths** | Use full canonical paths | `business_context.profile.description` not `bc.description` |
| **Benchmark Strategy** | BenchmarkProvider interface | Extend `industries.js` → then migrate |
| **Prompt Architecture** | Separate service | `PromptOrchestrator` NOT in `AIContextService` |
| **Guidance Payload** | Required for Sprint 17 | All Sprint 17 AI endpoints must include `guidance` block |

---

## Executive Summary

This sprint transforms Karvia's AI capabilities from "all-or-nothing" OKR generation to a **McKinsey-style progressive engagement model** where recommendations improve as context builds over time. The system will behave like a top management consultant who:

1. **Day 0**: Works with minimal information to provide value immediately
2. **Month 1**: Deepens understanding through guided data collection
3. **Year 1+**: Leverages complete history for highly personalized recommendations

---

## Sprint Overview

| Metric | Value |
|--------|-------|
| **Total Points** | 70 pts (audit-revised from 65) |
| **Duration** | 2 weeks |
| **Focus** | Fix foundations + Consolidate + Activate + Add |
| **Core Principle** | "Consolidation-First" - Fix, then activate, then add |

### Pre-Sprint Gate (MUST COMPLETE BEFORE START)

- [x] Sprint 15-A complete (85/85 pts) - DONE
- [ ] Sprint 16 complete (63 pts) - PENDING
- [x] BUG-1: Fix KeyResult model dependency - FIXED
- [x] BUG-2: Fix frontend schema mismatch - FIXED

### Strategic Insight (Post-Analysis)

**Critical Finding**: We have 70% more infrastructure than we're using.
- **Company Model**: 106 fields, only 8-12 used in AI prompts
- **AIContextService**: 38% dead code, 20-25% token utilization
- **Approach**: Activate existing → Add missing → Improve UI

---

## The McKinsey Approach (Research Findings)

### Key Insights from Top Consulting Firms

| Firm | Methodology | Application to Karvia |
|------|-------------|----------------------|
| **McKinsey** | 7-S Framework diagnostic before goal setting | Map to SSI 12-block assessment |
| **BCG** | 3-part diagnostic (Diagnosis → Policy → Action) | Context stages inform recommendations |
| **Bain** | Outcome-focused metrics over output metrics | KRs should measure outcomes, not activities |
| **All** | Progressive engagement (credibility → context → confidence → capture) | Stage-based prompts |

### The Consulting Engagement Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PROGRESSIVE CONTEXT BUILDING                          │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────┤
│   Stage 0    │   Stage 1    │   Stage 2    │   Stage 3    │   Stage 4   │
│  DISCOVERY   │  ASSESSMENT  │  EXECUTION   │  LEARNING    │  MASTERY    │
├──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ Day 0-7      │ Week 2-4     │ Month 2-3    │ Month 4-6    │ Month 7+    │
│              │              │              │              │             │
│ • Industry   │ • SSI        │ • First OKR  │ • OKR        │ • Full      │
│ • Company    │   assessment │   cycle      │   outcomes   │   history   │
│   name       │ • Business   │ • Task       │ • Velocity   │ • Pattern   │
│ • Size       │   metrics    │   execution  │   trends     │   library   │
│              │ • Strategic  │ • Progress   │ • Success/   │ • Benchmark │
│              │   vision     │   tracking   │   failure    │   data      │
│              │              │              │   analysis   │             │
├──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ CONFIDENCE   │ CONFIDENCE   │ CONFIDENCE   │ CONFIDENCE   │ CONFIDENCE  │
│    20%       │    45%       │    65%       │    80%       │    95%      │
├──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ Industry     │ Company-     │ Performance  │ Learning-    │ Predictive  │
│ benchmarks   │ specific     │ based        │ enhanced     │ & adaptive  │
│ only         │ context      │ refinement   │ suggestions  │ coaching    │
└──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

---

## Current State vs Target State

### Data Collection Audit Summary

| Data Category | Current Status | Gap Analysis |
|--------------|----------------|--------------|
| **Company Profile** | 60% utilized | Optional fields rarely filled |
| **Baseline Metrics** | 15% available | Most companies have empty metrics.current |
| **SSI Assessment** | 40% completion | Many skip or don't complete assessment |
| **Strategic Vision** | 25% filled | priority_one often missing |
| **OKR Outcomes** | 0% tracked | No success/failure analysis |
| **Task Patterns** | 70% captured | Good but not used optimally |
| **Industry Benchmarks** | 0% available | No external data integration |

### AI Touchpoints (10 Total)

| Service | Current State | Target State |
|---------|--------------|--------------|
| `aiOKRService` | Uses available context | Stage-adaptive prompts |
| `AIObjectivePlanner` | Static prompts | Dynamic based on maturity |
| `AIContextService` | Builds context | Maturity scoring + recommendations |
| `SSINarrativeService` | Basic narratives | Industry-contextualized insights |
| `AIEstimator` | Effort estimation | Historical accuracy learning |

---

## Revised Epic Structure (Audit-Revised)

### Overview: PHASE-BASED APPROACH

```
AUDIT-REVISED SCOPE: 70 pts / 2 weeks

PHASE 0: FOUNDATION FIXES (8 pts) - Day 1-2
├── FIX-1: KeyResult model dependency (3 pts) ✓ DONE
├── FIX-2: Frontend schema mismatch (3 pts) ✓ DONE
└── FIX-3: Reconcile plan math/docs (2 pts)

PHASE 1: PROMPT CONSOLIDATION (12 pts) - Day 3-5
├── PROMPT-1: Create server/prompts/ structure (3 pts)
├── PROMPT-2: Base system prompt (Karvia Coach) (3 pts)
├── PROMPT-3: Endpoint templates (5 files) (4 pts)
└── PROMPT-4: GuidanceBuilder service (2 pts)

PHASE 2: ACTIVATE EXISTING (10 pts) - Day 6-7
├── ACT-1: Wire guidance block to ai-okr.js (3 pts)
├── ACT-2: Wire guidance block to planning.js (3 pts)
├── ACT-3: Enable rejection history (2 pts)
└── ACT-4: Enable risk indicators in prompts (2 pts)

PHASE 3: CONTEXT MATURITY (15 pts) - Day 8-10
├── MAT-1: ContextMaturityService (5 pts)
├── MAT-2: Maturity API endpoint (3 pts)
├── MAT-3: Stage-based prompt selection (4 pts)
└── MAT-4: Dashboard indicator (3 pts)

PHASE 4: BENCHMARKS (Consolidated) (10 pts) - Day 11-12
├── BENCH-1: BenchmarkProvider interface (5 pts)
├── BENCH-2: LegacyBenchmarkProvider (wraps industries.js) (3 pts)
└── BENCH-3: Stage 0 fallback integration (2 pts)

PHASE 5: OUTCOME TRACKING (Full) (12 pts) - Day 13-14
├── OUT-1: OKROutcome model (3 pts)
├── OUT-2: Outcome capture API routes (3 pts)
├── OUT-3: Outcome capture UI (quarterly review) (4 pts)
└── OUT-4: Integration with prompt layer (2 pts)

CLEANUP (3 pts) - Throughout
├── CLN-1: AI interaction logging wrapper (2 pts)
└── CLN-2: Remove dead code from AIContextService (1 pt)
```

---

### Epic A: Context Maturity System (21 pts → 13 pts)

| Story | Points | Description |
|-------|--------|-------------|
| A-1 | 8 | Context Maturity Calculator - Score companies 0-4 based on data completeness |
| A-2 | 5 | Stage-Specific Prompt Templates - Different prompts for each maturity level |
| A-3 | 5 | Maturity Progress API - Endpoints to check and guide improvement |
| A-4 | 3 | Dashboard Maturity Indicator - Visual progress in UI |

**Deliverables**:
```javascript
// Context Maturity Calculator
const maturityStage = calculateContextMaturity(company);
// Returns: { stage: 2, score: 0.65, gaps: [...], nextActions: [...] }

// Maturity-aware prompt selection
const prompt = getPromptForStage(maturityStage, 'objective_generation');
// Returns: Stage-appropriate system prompt with correct instructions
```

### Epic B: Intelligent Data Collection (18 pts)

| Story | Points | Description |
|-------|--------|-------------|
| B-1 | 5 | Guided Profile Completion - AI prompts for missing data |
| B-2 | 5 | Baseline Metric Templates - Industry-specific templates |
| B-3 | 5 | Progressive Disclosure - Request data at optimal moments |
| B-4 | 3 | Data Quality Scoring - Rate data reliability |

**Key Innovation**: Never block users, but strategically prompt for missing data at high-value moments.

```javascript
// After first objective creation
"I noticed you haven't filled in your #1 priority yet.
 Companies with clear priorities see 26% better OKR alignment.
 Would you like to add it now? [Yes] [Later]"
```

### Epic C: Adaptive AI Prompts (24 pts)

| Story | Points | Description |
|-------|--------|-------------|
| C-1 | 8 | Stage 0 Prompts - Industry benchmarks only |
| C-2 | 5 | Stage 1 Prompts - Company profile + SSI context |
| C-3 | 5 | Stage 2 Prompts - Add execution patterns |
| C-4 | 3 | Stage 3 Prompts - Add outcome learning |
| C-5 | 3 | Stage 4 Prompts - Full historical context |

**Prompt Evolution Example**:

```
STAGE 0 (Day 0):
"For a ${industry} company with ${employeeCount} employees,
 typical strategic priorities include..."

STAGE 2 (Month 2):
"Based on ${companyName}'s SSI profile showing weak ${weakBlock},
 and their stated priority of '${priorityOne}',
 with ${taskVelocity} tasks/week execution capacity..."

STAGE 4 (Year 1+):
"${companyName} has completed ${okrCyclesCount} OKR cycles.
 Historical success rate: ${successRate}%. Top performing categories:
 ${topCategories}. Challenges: ${commonBlockers}.
 Last quarter's key learning: ${lastQuarterInsight}..."
```

### Epic D: Industry Benchmark System (13 pts)

| Story | Points | Description |
|-------|--------|-------------|
| D-1 | 5 | Benchmark Data Structure - Store industry templates |
| D-2 | 5 | Fallback System - Use benchmarks when no company data |
| D-3 | 3 | Benchmark Administration - Consultant can customize |

**Industry Template Example**:
```javascript
{
  industry: "financial_services",
  subtype: "wealth_management",
  typical_metrics: {
    client_retention_rate: { median: 92, p25: 88, p75: 96 },
    aum_growth_rate: { median: 8, p25: 4, p75: 15 },
    client_satisfaction: { median: 4.2, p25: 3.8, p75: 4.6 }
  },
  typical_priorities: [
    "Client retention during succession",
    "Next-gen client acquisition",
    "Fee compression management"
  ],
  typical_risks: [
    "Advisor succession",
    "Technology adoption",
    "Regulatory compliance"
  ]
}
```

### Epic E: Outcome Tracking & Learning (13 pts)

| Story | Points | Description |
|-------|--------|-------------|
| E-1 | 5 | OKR Outcome Model - Track success/failure + reasons |
| E-2 | 5 | Learning Loop Integration - Feed outcomes back to AI |
| E-3 | 3 | Quarterly Review Prompts - Structured reflection capture |

**OKR Outcome Schema**:
```javascript
{
  objective_id: ObjectId,
  cycle: "Q1-2026",
  outcome: "exceeded" | "achieved" | "partial" | "missed",
  achievement_percentage: 87,
  variance_reasons: [
    { reason: "resource_constraint", details: "Lost 2 team members" },
    { reason: "scope_change", details: "Pivoted to new market" }
  ],
  lessons_learned: "Need buffer for unexpected departures",
  would_repeat: false,
  ai_insight: "Consider 20% scope reduction for similar objectives"
}
```

---

## Technical Architecture

### Service Separation (Audit-Required)

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Request Flow                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Route (ai-okr.js)                                             │
│       │                                                        │
│       ├──→ AIContextService.buildContext()                     │
│       │         └── Returns: company data, metrics, history    │
│       │                                                        │
│       ├──→ ContextMaturityService.calculateMaturity()          │
│       │         └── Returns: stage, score, gaps, strengths     │
│       │                                                        │
│       ├──→ PromptOrchestrator.getPromptForContext()           │
│       │         └── Returns: stage-appropriate system prompt   │
│       │                                                        │
│       ├──→ OpenAI API Call                                     │
│       │         └── Uses: prompt + context                     │
│       │                                                        │
│       └──→ GuidanceBuilder.build()                             │
│                 └── Returns: REQUIRED guidance block           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Context Maturity Service

```javascript
// server/services/ContextMaturityService.js
// NOTE: This service calculates maturity, NOT prompts

class ContextMaturityService {

  static MATURITY_STAGES = {
    STAGE_0: { name: 'Discovery', minScore: 0, maxScore: 0.20 },
    STAGE_1: { name: 'Assessment', minScore: 0.20, maxScore: 0.45 },
    STAGE_2: { name: 'Execution', minScore: 0.45, maxScore: 0.65 },
    STAGE_3: { name: 'Learning', minScore: 0.65, maxScore: 0.80 },
    STAGE_4: { name: 'Mastery', minScore: 0.80, maxScore: 1.0 }
  };

  static MATURITY_WEIGHTS = {
    // Core Profile (25%)
    company_description: 0.05,
    business_model: 0.05,
    value_proposition: 0.05,
    strategic_vision: 0.10,

    // Metrics (25%)
    baseline_metrics_count: 0.15,
    targets_defined: 0.10,

    // Assessment (20%)
    ssi_completed: 0.15,
    ssi_recency: 0.05,

    // Historical (30%)
    okr_cycles_completed: 0.10,
    task_history_depth: 0.10,
    outcome_tracking: 0.10
  };

  async calculateMaturity(companyId) {
    const company = await Company.findById(companyId);
    const assessments = await Assessment.find({ company_id: companyId });
    const objectives = await Objective.find({ company_id: companyId });
    const tasks = await Task.find({ company_id: companyId });

    let score = 0;
    const gaps = [];
    const recommendations = [];

    // Calculate weighted score...
    // Identify gaps...
    // Generate recommendations...

    return {
      stage: this.getStageFromScore(score),
      score,
      gaps,
      recommendations,
      nextActions: this.getNextActions(gaps)
    };
  }
}
```

### Prompt Orchestration Service (SEPARATE from AIContextService)

**Architecture Decision**: PromptOrchestrator is standalone, NOT integrated into AIContextService.
- AIContextService: DATA collection only
- PromptOrchestrator: Prompt policy, templates, tone

```javascript
// server/services/PromptOrchestrator.js
// NOTE: This is a SEPARATE service, not part of AIContextService

class PromptOrchestrator {

  static getSystemPrompt(maturityStage, promptType) {
    const templates = this.PROMPT_TEMPLATES[promptType];
    const basePrompt = templates.base;
    const stageOverlay = templates.stages[maturityStage.stage];

    return `${basePrompt}\n\n${stageOverlay}`;
  }

  static PROMPT_TEMPLATES = {
    objective_generation: {
      base: `You are a strategic OKR advisor...`,
      stages: {
        0: `CONTEXT LIMITATIONS:
           - No company-specific data available
           - Use industry benchmarks for ${industry}
           - Focus on universal best practices
           - DO NOT make assumptions about current metrics

           APPROACH:
           - Generate industry-appropriate objectives
           - Use target-only KR format (no "from X to Y")
           - Include baseline establishment as first KR
           - Recommend data collection actions`,

        1: `AVAILABLE CONTEXT:
           - Company profile: ${profile}
           - SSI Assessment: ${ssiScores}
           - Strategic priority: ${priorityOne}

           APPROACH:
           - Align objectives to stated priority
           - Address SSI weak areas (${weakBlocks})
           - Still use conservative estimates
           - Request baseline metrics in recommendations`,

        2: `RICH CONTEXT:
           - Profile + SSI + ${taskCount} tasks executed
           - Velocity: ${velocity} tasks/week
           - Completion rate: ${completionRate}%
           - Patterns: ${topPatterns}

           APPROACH:
           - Use realistic targets based on capacity
           - Reference execution patterns
           - Include stretch goals based on velocity`,

        3: `LEARNING CONTEXT:
           - Previous OKR outcomes available
           - Success rate: ${successRate}%
           - Common blockers: ${blockers}
           - Lessons: ${lessons}

           APPROACH:
           - Apply lessons from past cycles
           - Avoid repeating failed patterns
           - Build on successful strategies`,

        4: `FULL HISTORICAL CONTEXT:
           - ${totalCycles} OKR cycles completed
           - Detailed outcome analysis available
           - Year-over-year trends
           - Predictive confidence: HIGH

           APPROACH:
           - Highly personalized recommendations
           - Predictive success modeling
           - Proactive risk mitigation
           - Continuous improvement suggestions`
      }
    }
  };
}
```

---

## Implementation Roadmap (Audit-Revised)

### Week 1: Fixes + Consolidation (35 pts)

**Day 1-2: Foundation Fixes (8 pts)**
- [x] FIX-1: KeyResult model dependency (3 pts) ✓
- [x] FIX-2: Frontend schema mismatch (3 pts) ✓
- [ ] FIX-3: Plan math reconciliation (2 pts)

**Day 3-5: Prompt Consolidation (12 pts)**
- [ ] PROMPT-1: Create server/prompts/ structure (3 pts)
- [ ] PROMPT-2: Base system prompt (Karvia Coach) (3 pts)
- [ ] PROMPT-3: Endpoint templates (4 pts)
- [ ] PROMPT-4: GuidanceBuilder service (2 pts)

**Day 6-7: Activate Existing (10 pts)**
- [ ] ACT-1: Wire guidance to ai-okr.js (3 pts)
- [ ] ACT-2: Wire guidance to planning.js (3 pts)
- [ ] ACT-3: Enable rejection history (2 pts)
- [ ] ACT-4: Enable risk indicators (2 pts)

### Week 2: Maturity + Learning (35 pts)

**Day 8-10: Context Maturity (15 pts)**
- [ ] MAT-1: ContextMaturityService (5 pts)
- [ ] MAT-2: Maturity API endpoint (3 pts)
- [ ] MAT-3: Stage-based prompt selection (4 pts)
- [ ] MAT-4: Dashboard indicator (3 pts)

**Day 11-12: Benchmarks (10 pts)**
- [ ] BENCH-1: BenchmarkProvider interface (5 pts)
- [ ] BENCH-2: LegacyBenchmarkProvider (3 pts)
- [ ] BENCH-3: Stage 0 fallback (2 pts)

**Day 13-14: Outcome Tracking (12 pts)**
- [ ] OUT-1: OKROutcome model (3 pts)
- [ ] OUT-2: Outcome capture API (3 pts)
- [ ] OUT-3: Outcome capture UI (4 pts)
- [ ] OUT-4: Prompt layer integration (2 pts)

**Throughout: Cleanup (3 pts)**
- [ ] CLN-1: AI logging wrapper (2 pts)
- [ ] CLN-2: Dead code removal (1 pt)

---

## Success Metrics

### Quantitative

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Profile completion rate | 25% | 70% | % companies with >80% profile filled |
| SSI completion rate | 40% | 75% | % companies with completed SSI |
| OKR relevance score | 6/10 | 8.5/10 | User feedback rating |
| Baseline metrics available | 15% | 60% | % companies with metrics.current |
| Context maturity avg | Stage 0.5 | Stage 2.0 | Average maturity score |

### Qualitative

- Users say "This feels like working with a consultant"
- OKRs reference company-specific context
- Recommendations improve noticeably over time
- Users voluntarily provide more data

---

## Integration with iBrain (Future)

Sprint 17 establishes the foundation for iBrain integration:

```
Sprint 17 (Now)              Sprint 20+ (Future)
─────────────────────────    ─────────────────────────
Context Maturity System  →   iBrain Learning Engine
Outcome Tracking         →   Predictive Modeling
Pattern Recognition      →   Autonomous Suggestions
Stage-based Prompts      →   Adaptive AI Coaching
```

**iBrain Hooks Created**:
1. `llm_context.maturity_stage` - Current maturity level
2. `llm_context.outcome_history` - What worked/didn't
3. `llm_context.pattern_library` - Company-specific patterns
4. `llm_context.prediction_confidence` - How confident AI should be

---

## Files to Create/Modify

### New Files

```
server/
├── services/
│   ├── ContextMaturityService.js    # NEW: Maturity calculator
│   ├── PromptOrchestrator.js        # NEW: Stage-based prompts (SEPARATE from AIContextService)
│   ├── GuidanceBuilder.js           # NEW: Builds required guidance blocks
│   ├── BenchmarkProvider.js         # NEW: Interface + LegacyBenchmarkProvider
│   └── OutcomeTrackingService.js    # NEW: OKR outcomes
├── models/
│   ├── OKROutcome.js               # NEW: Outcome tracking
│   └── IndustryBenchmark.js        # NEW: Benchmark templates (Phase 2)
├── routes/
│   ├── context-maturity.js         # NEW: Maturity API
│   └── outcome-capture.js          # NEW: Outcome capture API
├── prompts/                         # NEW: Prompt template directory
│   ├── base-system-prompt.js       # Shared "Karvia Coach" personality
│   ├── endpoint-templates/
│   │   ├── okr-generation.js
│   │   ├── single-objective.js
│   │   ├── weekly-plan.js
│   │   └── ssi-narrative.js
│   └── guidance-builder.js
└── seeds/
    └── industry-benchmarks.js      # NEW: Initial benchmark data

client/
└── pages/scripts/
    ├── context-progress.js         # NEW: Maturity UI component
    └── outcome-capture.js          # NEW: Quarterly review UI
```

### Modified Files

```
server/
├── services/
│   └── AIContextService.js         # Context DATA only (prompts moved out)
├── routes/
│   ├── ai-okr.js                   # Use PromptOrchestrator + GuidanceBuilder
│   └── planning.js                 # Add guidance block to responses
└── models/
    └── Company.js                  # Add maturity tracking fields
```

### Architecture Separation (per audit)

```
BEFORE (fragmented):
  AIContextService → builds context + selects prompts + generates

AFTER (clean separation):
  AIContextService → context DATA only
  PromptOrchestrator → prompt policy + templates
  GuidanceBuilder → output format (guidance block)
  ai-okr.js → orchestrates all three
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| User friction from data requests | Progressive disclosure, clear value messaging |
| Benchmark data inaccuracy | Start with conservative estimates, allow consultant override |
| Complexity overwhelm | Stage-based rollout, hide complexity from users |
| Prompt engineering drift | Comprehensive testing, A/B validation |

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Sprint 16 complete | PENDING | Tech debt resolution needed first |
| Industry benchmark research | DONE | Research completed this session |
| Data audit | DONE | Gaps identified this session |
| Prompt validation framework | READY | Existing test infrastructure |
| **P0 Bug Fixes** | **DONE** | KeyResult + frontend schema fixed |
| External audit integration | DONE | Auditor answers incorporated |

### Pre-Sprint Gate Checklist

- [x] Sprint 15-A complete (85/85 pts)
- [ ] Sprint 16 complete (pending)
- [x] BUG-1: KeyResult model dependency fixed
- [x] BUG-2: Frontend schema mismatch fixed
- [x] Auditor cross-questions answered
- [x] Sprint 17 plan updated with audit findings

---

## Quick Reference

### Context Maturity API

```bash
# Get company maturity
GET /api/context-maturity/:companyId
# Returns: { stage: 2, score: 0.65, gaps: [...], recommendations: [...] }

# Get improvement suggestions
GET /api/context-maturity/:companyId/suggestions
# Returns: Prioritized list of data to collect

# Trigger guided data collection
POST /api/context-maturity/:companyId/prompt
# Returns: Next data collection prompt for UI
```

### Stage Determination Logic

```javascript
// Quick reference for stage calculation
Stage 0: score < 0.20 (Industry only)
Stage 1: score 0.20-0.45 (Profile + SSI)
Stage 2: score 0.45-0.65 (+ Execution data)
Stage 3: score 0.65-0.80 (+ Outcome learning)
Stage 4: score > 0.80 (Full history)
```

---

**Document Version**: 1.0
**Last Updated**: March 8, 2026
**Next Review**: Sprint 17 Kickoff

