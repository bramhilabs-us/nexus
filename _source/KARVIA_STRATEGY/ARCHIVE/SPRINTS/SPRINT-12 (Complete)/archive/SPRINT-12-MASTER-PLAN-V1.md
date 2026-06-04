# Sprint 12 Master Plan

**Sprint**: 12
**Created**: January 9, 2026
**Updated**: January 20, 2026 (Structure-First Reorganization)
**Focus**: OKR Wizard Foundation + Cohesive Data Flow + LLM Security
**Total Story Points**: 72 pts
**Duration**: 2.5 weeks
**Status**: PLANNING

---

## Reorganization Applied (January 20, 2026)

| Change | Reason | Impact |
|--------|--------|--------|
| Added Epic M Phase 1 (13 pts) | Moved from Sprint 11 - UI standardization first | OKR wizard after UI patterns |
| Reduced Epic Q (26→5 pts) | Focus on CRITICAL/HIGH issues only | Auth + payload fixes |
| Added Epic V (6 pts) | SSI Report UI standardization to S13 | Consistent design |
| **Total**: 72 pts | Streamlined focus | 2.5 weeks duration |

---

## Audit Integration (January 9, 2026)

Audit `RVW-20260109-003` identified 11 issues (1 Critical, 4 High, 6 Medium) related to LLM interaction points. **Epic Q reduced** to focus on CRITICAL/HIGH items only.

| Severity | Count | Resolution |
|----------|-------|------------|
| Critical | 1 | Q1: Auth middleware fix |
| High | 4 | Q2-Q5: Prompt enrichment + payload fix |
| Medium | - | Deferred to future sprint |

---

## Executive Summary

Sprint 12 addresses TWO critical gaps:

1. **Data Flow Gap**: OKR targets are generic hardcoded values instead of company-specific numbers
2. **LLM Quality Gap**: AI prompts missing company context, inconsistent models, security issues

### The Problem

Current flow produces vague OKRs:
```
Assessment → SSI Score 65% → AI generates "Improve client retention by 30%"
                                        ↑
                              Always 30%! Not based on actual retention rate
```

### The Solution

Sprint 12 creates a cohesive data pipeline:
```
Assessment → 12-Block Detailed Scores → Company Profile (with baseline metrics)
                                            ↓
           Business Metrics (Epic K) → Smart Target Calculator → Exact Numbers
                                            ↓
           "Improve client retention from 72% to 85% (13% improvement)"
```

---

## Sprint Dependencies

### From Sprint 10 (Required Complete)
- [x] Epic K: Business Metrics Profile (business_metrics field)
- [x] Shared industries.js configuration
- [x] AIContextService base implementation

### From Sprint 11 (Required Complete)
- [x] Epic M Phase 1: OKR Wizard foundation
- [x] Objective model extensions (level, parent_objective_id)

---

## Epic Overview

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| **Epic M Phase 1** | 13 | P0 | OKR Wizard Foundation (moved from Sprint 11) |
| **Epic N** | 21 | P0 | Detailed SSI Block Persistence & Targeting |
| **Epic O** | 18 | P0 | Smart KR Target Calculator |
| **Epic P** | 9 | P1 | Company Profile Industry Alignment |
| **Epic Q** | 5 | P0 | LLM Security Fixes (CRITICAL/HIGH only) |
| **Epic V** | 6 | P1 | SSI Report UI Standardization (S13 pattern) |
| **Total** | **72** | | |

---

## Epic M Phase 1: OKR Wizard Foundation (13 pts) - FROM SPRINT 11

Reference: [EPIC-M-INTELLIGENT-OKR-WIZARD.md](../SPRINT-11%20(Planned)/EPIC-M-INTELLIGENT-OKR-WIZARD.md)

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| M1 | 5 | OKR Wizard page structure |
| M6 | 3 | Mode selection (New/Gap/Cascade) |
| M10 | 3 | Objective model extensions (level, parent_objective_id, team_id) |
| M2 | 2 | Step 1 - Context review (uses business_metrics from K) |
| **Total** | **13** | |

### M10: Objective Model Extensions (3 pts)

```javascript
// server/models/Objective.js - Add these fields

level: {
  type: String,
  enum: ['company', 'team', 'individual'],
  default: 'company',
  index: true
},

parent_objective_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Objective',
  default: null,
  index: true
},

team_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Team',
  default: null,
  index: true
},

alignment_score: {
  type: Number,
  min: 0,
  max: 100,
  default: null
},

cascade_metadata: {
  inherited_from: String,
  alignment_rationale: String,
  created_via: { type: String, enum: ['wizard_cascade', 'manual', 'ai_generated'] }
}
```

---

## Epic N: Detailed SSI Block Persistence (21 pts)

### Problem
Currently, only aggregate SSI scores (speed_score, strength_score, intelligence_score) are saved to Company model. The detailed 12-block scores are calculated but discarded.

### Solution
Persist detailed block scores and use them for targeted OKR generation.

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| N1 | 5 | Assessment model extension - Add detailed_block_scores field |
| N2 | 3 | UnifiedSSIScoringService update - Save block scores after assessment |
| N3 | 5 | SSI Diagnostic Report UI - Show 12-block breakdown visually |
| N4 | 3 | Company model - Add last_assessment_blocks reference |
| N5 | 5 | AIContextService - Include block scores in OKR generation context |

### N1: Assessment Model Extension (5 pts)

**IMPORTANT**: Block names MUST match existing AssessmentQuestion.category enum (12-block MECE).

```javascript
// server/models/Assessment.js - Add this field
// Block names from: server/models/AssessmentQuestion.js category enum
detailed_block_scores: {
  speed: {
    delivery: { score: Number, benchmark: Number, gap: Number },
    decisions: { score: Number, benchmark: Number, gap: Number },
    change: { score: Number, benchmark: Number, gap: Number },
    response: { score: Number, benchmark: Number, gap: Number }
  },
  strength: {
    financial: { score: Number, benchmark: Number, gap: Number },
    operations: { score: Number, benchmark: Number, gap: Number },
    people: { score: Number, benchmark: Number, gap: Number },
    quality: { score: Number, benchmark: Number, gap: Number }
  },
  intelligence: {
    market: { score: Number, benchmark: Number, gap: Number },
    data: { score: Number, benchmark: Number, gap: Number },
    strategy: { score: Number, benchmark: Number, gap: Number },
    learning: { score: Number, benchmark: Number, gap: Number }
  }
}
```

### N5: AIContextService Block Integration (5 pts)

**NOTE**: These are NEW methods to add to existing AIContextService.js (which currently has `buildObjectiveContext()` only).

```javascript
// NEW METHOD: AIContextService.getOKRGenerationContext()
async getOKRGenerationContext(companyId, options = {}) {
  const baseContext = await this.getBaseContext(companyId);

  // NEW: Include weak blocks for targeted OKR generation
  const weakBlocks = this.identifyWeakBlocks(baseContext.detailedBlockScores);

  return {
    ...baseContext,
    weakBlocks,  // Array of blocks scoring below threshold
    targetBlocks: weakBlocks.slice(0, 3),  // Top 3 weakest for priority
    blockPriorities: this.calculateBlockPriorities(weakBlocks)
  };
}

identifyWeakBlocks(blockScores, threshold = 60) {
  const weakBlocks = [];
  ['speed', 'strength', 'intelligence'].forEach(category => {
    Object.entries(blockScores[category]).forEach(([blockName, data]) => {
      if (data.score < threshold) {
        weakBlocks.push({
          category,
          block: blockName,
          score: data.score,
          gap: data.gap,
          priority: this.calculatePriority(data)
        });
      }
    });
  });
  return weakBlocks.sort((a, b) => a.score - b.score);
}
```

---

## Epic O: Smart KR Target Calculator (18 pts)

### Problem
Current KR targets are hardcoded (30%, 20%, 15%) regardless of company baseline or industry benchmarks.

### Solution
Create a target calculator that uses:
1. Current baseline from business_metrics (Epic K)
2. Industry benchmarks
3. Company readiness level (from SSI)
4. Realistic improvement ranges

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| O1 | 5 | TargetCalculatorService - Core calculation logic |
| O2 | 3 | Industry benchmark data structure |
| O3 | 5 | AI prompt enhancement - Pass baseline + benchmarks |
| O4 | 3 | KR model extension - baseline_value field |
| O5 | 2 | Frontend display - Show "from X to Y" format |

### O1: TargetCalculatorService (5 pts)

```javascript
// server/services/TargetCalculatorService.js

class TargetCalculatorService {

  /**
   * Calculate realistic target based on company data
   * @param {Object} params
   * @param {string} params.metricType - 'percentage', 'currency', 'count', 'rating'
   * @param {number} params.currentValue - Baseline from business_metrics
   * @param {number} params.industryBenchmark - From industry config
   * @param {string} params.readinessLevel - 'getting_started', 'developing', 'advanced', 'optimized'
   * @param {string} params.timeframe - 'quarterly', 'yearly'
   */
  calculateTarget(params) {
    const { metricType, currentValue, industryBenchmark, readinessLevel, timeframe } = params;

    // Improvement multipliers by readiness level
    const improvementRanges = {
      getting_started: { min: 0.05, max: 0.15 },  // 5-15% improvement realistic
      developing: { min: 0.10, max: 0.25 },       // 10-25% improvement
      advanced: { min: 0.15, max: 0.35 },         // 15-35% improvement
      optimized: { min: 0.05, max: 0.15 }         // Already high, smaller gains
    };

    // Timeframe adjustments
    const timeMultiplier = timeframe === 'yearly' ? 4 : 1;

    const range = improvementRanges[readinessLevel] || improvementRanges.developing;

    // Calculate based on gap to benchmark
    const gapToBenchmark = industryBenchmark - currentValue;

    if (gapToBenchmark > 0) {
      // Below benchmark: target is percentage of gap closure
      const gapClosureTarget = Math.min(gapToBenchmark * 0.5, currentValue * range.max);
      return {
        baseline: currentValue,
        target: Math.round(currentValue + gapClosureTarget),
        improvement: gapClosureTarget,
        improvementPercent: ((gapClosureTarget / currentValue) * 100).toFixed(1),
        benchmark: industryBenchmark,
        reachable: true
      };
    } else {
      // Above benchmark: target is maintaining or small improvement
      const improvement = currentValue * range.min * timeMultiplier;
      return {
        baseline: currentValue,
        target: Math.round(currentValue + improvement),
        improvement,
        improvementPercent: ((improvement / currentValue) * 100).toFixed(1),
        benchmark: industryBenchmark,
        reachable: true,
        note: 'Above industry benchmark - maintenance target'
      };
    }
  }

  /**
   * Generate KR targets for a specific SSI block
   */
  generateBlockTargets(block, businessMetrics, industryConfig) {
    const blockMetricMappings = {
      client_acquisition: ['new_clients_per_month', 'lead_conversion_rate'],
      sales_velocity: ['average_deal_cycle_days', 'proposals_to_close_ratio'],
      client_retention: ['client_retention_rate', 'client_satisfaction_score'],
      financial_stability: ['revenue_growth_rate', 'profit_margin'],
      // ... more mappings
    };

    const relevantMetrics = blockMetricMappings[block] || [];

    return relevantMetrics.map(metricKey => {
      const currentValue = businessMetrics[metricKey];
      const benchmark = industryConfig.benchmarks?.[metricKey];

      if (currentValue === undefined || currentValue === null) {
        return null;  // No baseline captured
      }

      return {
        metric: metricKey,
        ...this.calculateTarget({
          metricType: this.getMetricType(metricKey),
          currentValue,
          industryBenchmark: benchmark,
          readinessLevel: businessMetrics.readiness_profile || 'developing',
          timeframe: 'quarterly'
        })
      };
    }).filter(Boolean);
  }
}

module.exports = new TargetCalculatorService();
```

### O3: AI Prompt Enhancement (5 pts)

```javascript
// server/routes/ai-okr.js - Enhanced prompt with baselines

function buildOKRPrompt(context) {
  const { company, weakBlocks, businessMetrics, targetSuggestions } = context;

  return `
Generate OKRs for ${company.name}, a ${company.industry} company.

## Current Business State
${businessMetrics ? `
- Revenue: $${businessMetrics.annual_revenue?.toLocaleString()} (${businessMetrics.revenue_growth_rate}% growth)
- Client Count: ${businessMetrics.total_clients}
- Retention Rate: ${businessMetrics.client_retention_rate}%
- Average Deal Size: $${businessMetrics.average_deal_size?.toLocaleString()}
` : 'No baseline metrics captured yet.'}

## Weakest SSI Blocks (Priority Areas)
${weakBlocks.map((b, i) => `${i + 1}. ${b.block} (${b.category}) - Score: ${b.score}/100, Gap: ${b.gap} points`).join('\n')}

## Target Suggestions (Use These Exact Numbers)
${targetSuggestions.map(t => `
- ${t.metric}: Current ${t.baseline} → Target ${t.target} (${t.improvementPercent}% improvement)
`).join('')}

Generate 4 objectives (1 Speed, 2 Strength, 1 Intelligence) with 3 Key Results each.
IMPORTANT: Use the EXACT baseline and target numbers provided above. Do not invent numbers.
`;
}
```

### O4: KR Model Extension (3 pts)

```javascript
// server/models/Objective.js - Add to key_results schema
key_results: [{
  // ... existing fields ...

  // NEW: Baseline tracking
  baseline_value: {
    type: Number,
    default: null,
    description: 'Starting value when KR was created'
  },
  baseline_date: {
    type: Date,
    default: null,
    description: 'When baseline was captured'
  },
  baseline_source: {
    type: String,
    enum: ['business_metrics', 'manual_entry', 'ai_estimated'],
    default: null
  }
}]
```

---

## Epic P: Company Profile Industry Alignment (9 pts)

### Problem
Company model industry enum doesn't match shared industries.js configuration.

**NOTE**: `industry_subtype` field already exists in Company.js (Sprint 10 Epic K). P2 is for adding **validation**, not the field itself.

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| P1 | 3 | Company model - Use industries.js enum for `industry` field |
| P2 | 3 | Add industry_subtype validation against industries.js (field exists, validation missing) |
| P3 | 3 | Company Profile UI - Use industry dropdowns from config |

### P1: Company Model Update (3 pts)

**IMPORTANT**: `industry_subtype` field already exists (line 52-56). Only add enum validation for `industry` field.

```javascript
// server/models/Company.js

const { getIndustryTagsEnum, isValidSubtype } = require('../config/industries');

// UPDATE: Add enum validation for industry field (currently has no enum)
industry: {
  type: String,
  enum: getIndustryTagsEnum(),  // From shared config
  default: 'other'  // Match existing default
},

// EXISTING field - ADD validation only (field already at line 52-56)
industry_subtype: {
  type: String,
  index: true,
  validate: {
    validator: function(v) {
      if (!v) return true;
      return isValidSubtype(this.industry, v);
    },
    message: 'Invalid industry subtype for selected industry'
  }
}
```

---

## Epic Q: LLM Security Fixes (5 pts) - REDUCED

### Source
Audit Report: `RVW-20260109-003` (January 9, 2026)

### Scope Reduction
Focus on CRITICAL and HIGH severity issues only. Medium severity items deferred to future sprint.

### Stories (CRITICAL/HIGH Only)

| Story | Points | Severity | Description | File Reference |
|-------|--------|----------|-------------|----------------|
| Q1 | 2 | CRITICAL | Add auth middleware to OKR generation endpoint | `ai-okr.js:1201` |
| Q2 | 3 | HIGH | Fix objective AI plan payload mismatch | `objectives.html:1538`, `ai-okr.js:1074` |
| **Total** | **5** | | | |

### Deferred to Future Sprint (MEDIUM Severity)

| Story | Points | Description | Status |
|-------|--------|-------------|--------|
| Q3 | 5 | Enrich OKR prompt with company profile + SSI metrics | DEFERRED |
| Q4 | 3 | Enrich weekly plan prompt with company context | DEFERRED |
| Q5 | 3 | Enrich edit/extend plan prompt with priorities | DEFERRED |
| Q6 | 5 | Add LLM narrative to SSI diagnostic report | DEFERRED |
| Q7 | 2 | Standardize LLM model across all calls | DEFERRED |
| Q8 | 1 | Enforce category precedence in OKR prompts | DEFERRED |
| Q9 | 2 | Surface stale SSI warning to users | DEFERRED |
| Q11 | 2 | Add JSON response_format to weekly plan | DEFERRED |

**Note**: Q10 covered by Epic P. Total deferred: 23 pts.

### Q1: Auth Middleware Fix (2 pts) - CRITICAL

**Problem**: `/api/ai-okr/generate-from-company` uses `req.user` without auth middleware.

**Fix**:
```javascript
// server/routes/ai-okr.js:1201
// BEFORE:
router.post('/generate-from-company', async (req, res) => {

// AFTER:
router.post('/generate-from-company', authenticateToken, async (req, res) => {
```

### Q2: Objective AI Plan Payload Fix (3 pts) - HIGH

**Problem**: Frontend sends `{ objective, category }` but backend expects `{ objectiveData }`.

**Fix** (client/pages/objectives.html:1538):
```javascript
// BEFORE:
const payload = { objective: objectiveData, category: selectedCategory };

// AFTER:
const payload = { objectiveData: objectiveData, category: selectedCategory };
```

**Fix** (server/routes/ai-okr.js:1074):
```javascript
// Ensure backend accepts both formats for backward compatibility
const objective = req.body.objectiveData || req.body.objective;
```

### Q3: OKR Prompt Enrichment (5 pts) - HIGH

**Problem**: OKR prompt misses company profile fields + SSI key metrics.

**Enhancement**:
```javascript
// server/routes/ai-okr.js - buildOKRPrompt() enhancement

function buildEnrichedOKRPrompt(context) {
  const { company, ssiResult, businessMetrics, assessmentDate, templateId } = context;

  return `
## Company Context
- Name: ${company.name}
- Industry: ${company.industry} (${company.industry_subtype || 'general'})
- Mission: ${company.business_context?.mission || 'Not specified'}
- Vision: ${company.business_context?.vision || 'Not specified'}
- Target Market: ${company.business_context?.target_market || 'Not specified'}
- Strategic Priorities: ${company.business_context?.strategic_priorities?.join(', ') || 'None'}
- Key Challenges: ${company.business_context?.key_challenges?.join(', ') || 'None'}

## Assessment Context
- Template ID: ${templateId}
- Assessment Date: ${assessmentDate}
- Overall Score: ${ssiResult?.overall_score || 'N/A'}

## SSI Block Scores (12-block MECE)
${formatBlockScores(ssiResult?.detailed_block_scores)}

## Key Business Metrics
${formatBusinessMetrics(businessMetrics)}

## Generation Rules
1. User-selected category is PRIMARY focus
2. SSI weak blocks provide EVIDENCE and KPI targets
3. Use EXACT baseline numbers from business metrics
4. Each KR must reference a specific metric
`;
}
```

### Q4: Weekly Plan Prompt Enrichment (3 pts) - HIGH

**Problem**: Weekly plan prompt omits company profile and SSI priorities.

**Enhancement** (server/routes/planning.js:1450):
```javascript
// Add company context to weekly plan prompt
const weeklyPlanPrompt = `
## Company Context
${company.business_context?.mission ? `Mission: ${company.business_context.mission}` : ''}
${company.business_context?.strategic_priorities?.length ? `Priorities: ${company.business_context.strategic_priorities.join(', ')}` : ''}

## SSI Priority Blocks
${topPriorityBlocks.map(b => `- ${b.block}: Score ${b.score}/100`).join('\n')}

## KR Context
- KR: ${keyResult.title}
- Current: ${keyResult.current_value} | Target: ${keyResult.target_value}
- Gap: ${keyResult.target_value - keyResult.current_value}

Generate weekly tasks that directly move the KR metric from current to target.
Each task should specify which metric it impacts.
`;
```

### Q5: Edit/Extend Plan Prompt Enrichment (3 pts) - HIGH

**Problem**: Extension prompt lacks strategic priorities and key challenges.

**Enhancement** (server/routes/planning.js:1605):
```javascript
// Add strategic context to plan extension
const extendPlanPrompt = `
## Strategic Context (Maintain Alignment)
- Priorities: ${company.business_context?.strategic_priorities?.join(', ') || 'Growth'}
- Key Challenges: ${company.business_context?.key_challenges?.join(', ') || 'None specified'}

## SSI Priority Blocks
${topPriorityBlocks.slice(0, 2).map(b => `- ${b.block}: Score ${b.score}/100`).join('\n')}

## Existing Plan Summary
${existingPlanSummary}

## KR Delta
- Current: ${keyResult.current_value} | Target: ${keyResult.target_value}
- Remaining Gap: ${keyResult.target_value - keyResult.current_value}

Extend the plan while maintaining alignment with:
1. Original objective category and focus
2. Company strategic priorities
3. KR metric targets
`;
```

### Q6: SSI Diagnostic LLM Narrative (5 pts) - MEDIUM

**Problem**: SSI diagnostic report is deterministic only; no executive-ready narrative.

**Enhancement** (server/services/diagnostic/DiagnosticEngine.js):
```javascript
// Add LLM narrative generation
async generateExecutiveNarrative(reportData) {
  const prompt = `
You are a business strategy advisor. Summarize ONLY the provided data.
Do not make assumptions or add information not in the data.

## SSI Report Data
${JSON.stringify(reportData, null, 2)}

Generate a JSON response with:
{
  "executive_brief": "2-3 sentence summary",
  "top_risks": ["risk1", "risk2", "risk3"],
  "top_opportunities": ["opp1", "opp2", "opp3"],
  "recommended_objectives": ["obj1", "obj2"],
  "key_metrics_to_track": ["metric1", "metric2", "metric3"]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Summarize ONLY provided data. No assumptions.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

**Store narrative in SSIDiagnosticReport model**:
```javascript
// Add to DiagnosticReport schema
llm_narrative: {
  executive_brief: String,
  top_risks: [String],
  top_opportunities: [String],
  recommended_objectives: [String],
  key_metrics_to_track: [String],
  generated_at: Date
}
```

### Q7: Model Standardization (2 pts) - MEDIUM

**Problem**: OKR uses `gpt-4o-mini`, planning uses `gpt-3.5-turbo-0125`.

**Fix**: Standardize all LLM calls to `gpt-4o-mini`:
```javascript
// server/config/ai.js (create if doesn't exist)
module.exports = {
  DEFAULT_MODEL: 'gpt-4o-mini',
  FALLBACK_MODEL: 'gpt-3.5-turbo',
  MAX_TOKENS: {
    okr_generation: 2000,
    weekly_plan: 1500,
    plan_extension: 1000,
    diagnostic_narrative: 1000
  }
};
```

Update all LLM calls to use config:
- `server/routes/ai-okr.js`
- `server/routes/planning.js`
- `server/services/diagnostic/DiagnosticEngine.js`

### Q8: Category Precedence Enforcement (1 pt) - MEDIUM

**Problem**: OKR prompt doesn't enforce that user-selected category leads.

**Fix** (server/routes/ai-okr.js):
```javascript
// Add explicit instruction to prompt
const categoryInstruction = `
CRITICAL: The user selected "${selectedCategory}" as the PRIMARY category.
- Generate 2 objectives in ${selectedCategory} category
- Generate 1 objective each in the other 2 categories
- ${selectedCategory} objectives should directly address the category's weak blocks
- Other objectives should SUPPORT the ${selectedCategory} focus
`;
```

### Q9: Stale SSI User Warning (2 pts) - MEDIUM

**Problem**: Stale SSI (>90 days) is logged but not surfaced to users.

**Fix** (client-side modal enhancement):
```javascript
// client/pages/objectives.html - OKR generation modal
async function checkAssessmentFreshness(companyId) {
  const response = await fetch(`/api/assessments/latest/${companyId}`);
  const { assessment } = await response.json();

  if (!assessment) {
    return { status: 'none', message: 'No assessment found. Run assessment first.' };
  }

  const daysSinceAssessment = Math.floor(
    (Date.now() - new Date(assessment.created_at)) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceAssessment > 90) {
    return {
      status: 'stale',
      days: daysSinceAssessment,
      message: `Assessment is ${daysSinceAssessment} days old. Results may not reflect current state.`,
      options: ['Use existing assessment', 'Run new assessment']
    };
  }

  return { status: 'fresh', days: daysSinceAssessment };
}
```

### Q11: JSON Response Format Enforcement (2 pts) - MEDIUM

**Problem**: Weekly plan JSON parsing is brittle; no response_format enforcement.

**Fix** (server/routes/planning.js:1547):
```javascript
// BEFORE:
const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo-0125',
  messages: [...],
  // No response_format
});

// AFTER:
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',  // Q7: Standardized model
  messages: [...],
  response_format: { type: 'json_object' }  // Enforce valid JSON
});
```

---

## Implementation Schedule (2.5 Weeks)

### Week 1: Security Fixes + OKR Wizard + SSI Persistence (Days 1-5)

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 1 | Q1, Q2 | 5 | **CRITICAL**: Auth fix + payload fix |
| 2 | M1, M6 | 8 | OKR Wizard page structure + mode selection |
| 3 | M10, M2 | 5 | Objective model extensions + context review |
| 4 | N1, N2 | 8 | Assessment block persistence |
| 5 | N3 | 5 | SSI diagnostic UI with 12-block view |
| **Week 1** | | **31** | |

### Week 2: SSI Integration + Smart Targets + Industry Alignment (Days 6-10)

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 6 | N4, N5 | 8 | Company model + AIContextService integration |
| 7 | P1, P2, P3 | 9 | Industry alignment (all P stories) |
| 8 | O1 | 5 | TargetCalculatorService core |
| 9 | O2, O4 | 6 | Benchmarks + KR model extension |
| 10 | O3, O5 | 7 | AI prompt enhancement + frontend |
| **Week 2** | | **35** | |

### Week 3: SSI Report UI + Polish (Days 11-12)

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 11 | V1-V3 | 6 | SSI Report UI standardization (S13 pattern) |
| 12 | Buffer | - | Integration testing + E2E validation |
| **Week 3** | | **6** | |

**Total: 72 pts over 12 days (2.5 weeks)**

---

## Epic V: SSI Report UI Standardization (6 pts) - NEW

### Problem
SSI Diagnostic Report UI inconsistent with Sprint 13 design patterns established in Sprint 11.

### Solution
Apply S13 patterns to SSI Report page.

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| V1 | 2 | Report header with inline KPIs |
| V2 | 2 | 12-block grid layout |
| V3 | 2 | Block detail cards with consistent styling |
| **Total** | **6** | |

---

## Data Flow After Sprint 12

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        COHESIVE DATA PIPELINE                          │
└─────────────────────────────────────────────────────────────────────────┘

1. ASSESSMENT MODULE
   ┌──────────────┐
   │ 12-Block SSI │──→ Detailed scores PERSISTED (Epic N)
   │  Questions   │    Each block: score + benchmark + gap
   └──────────────┘

2. COMPANY PROFILE MODULE
   ┌──────────────┐     ┌──────────────┐
   │   Industry   │     │  Business    │
   │   Subtype    │──→  │   Metrics    │──→ Baseline values captured
   │   (Epic P)   │     │   (Epic K)   │    Current retention: 72%
   └──────────────┘     └──────────────┘    Current revenue: $2.4M

3. OKR CREATION MODULE (Epic O)
   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
   │ Weak Blocks  │     │  Baseline    │     │   Industry   │
   │ from SSI     │──→  │  + Target    │──→  │  Benchmarks  │
   │ (Epic N)     │     │  Calculator  │     │              │
   └──────────────┘     └──────────────┘     └──────────────┘
                               │
                               ▼
   ┌─────────────────────────────────────────────────────────┐
   │ EXACT OKR OUTPUT:                                       │
   │ "Improve client retention from 72% to 85%"              │
   │ "Increase AUM from $45M to $58M"                        │
   │ "Reduce client acquisition cost from $2,400 to $1,800"  │
   └─────────────────────────────────────────────────────────┘

4. PLANNING MODULE (Existing - No changes needed)
   KR targets cascade to quarterly goals → weekly goals → tasks

5. DASHBOARD MODULE (Existing - No changes needed)
   Task completion rolls up to show progress against EXACT numbers
```

---

## Success Criteria

### Epic M Phase 1 Success Criteria
- [ ] OKR Wizard page loads with mode selection
- [ ] Objective model has level, parent_objective_id, team_id fields
- [ ] Wizard Step 1 displays company context + SSI + company profile data
- [ ] Mode selection (New/Gap/Cascade) navigates to correct flow

### Epic N Success Criteria
- [ ] Assessment saves 12-block detailed scores
- [ ] SSI Diagnostic shows visual breakdown of all 12 blocks
- [ ] AIContextService includes weak blocks in context
- [ ] Company profile shows last assessment block reference

### Epic O Success Criteria
- [ ] TargetCalculatorService generates realistic targets
- [ ] KR model stores baseline_value and baseline_source
- [ ] AI-generated OKRs use exact numbers from business metrics
- [ ] Frontend displays "from X to Y" format

### Epic P Success Criteria
- [ ] Company model uses shared industries.js enum
- [ ] industry_subtype field functional
- [ ] Company profile dropdown matches industries.js

### Epic Q Success Criteria (CRITICAL/HIGH Only)
- [ ] Q1: Auth middleware on `/api/ai-okr/generate-from-company` - no unauthenticated access
- [ ] Q2: Objective AI plan payload works correctly - no parsing errors

### Epic V Success Criteria
- [ ] SSI Report has header with inline KPIs (S13 pattern)
- [ ] 12-block grid layout implemented
- [ ] Block detail cards styled consistently with S13 patterns

### Sprint 12 Completion Checklist
- [ ] OKR Wizard Phase 1 functional (M1, M2, M6, M10)
- [ ] All 12 SSI blocks persisted and displayed
- [ ] At least one KR generated with exact baseline → target numbers
- [ ] Industry alignment complete between Company model and industries.js
- [ ] End-to-end flow tested: Assessment → OKR with exact numbers
- [ ] CRITICAL/HIGH audit findings resolved (Q1, Q2)
- [ ] SSI Report UI standardized to S13 pattern
- [ ] E2E test: Financial Services → Legacy/Succession flow validated

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Sprint 10/11 delays | Medium | High | Can start Epic P independently |
| Industry benchmark data incomplete | Medium | Medium | Use reasonable defaults, expand later |
| AI doesn't follow exact numbers | Low | Medium | Strong prompt engineering + validation |

---

## Testing Requirements

### E2E Test: Financial Services → Legacy/Succession Flow

As specified in audit report, validate end-to-end:

1. **Profile Setup**: Populate mission/vision/priorities/challenges + numeric anchors
2. **Assessment**: Run Financial Services template; ensure 12-block scores + key metrics
3. **SSI Diagnostic**: Generate LLM narrative from report data; store in SSIDiagnosticReport
4. **OKR Generation**: Choose category (e.g., Growth). Verify objectives are category-led but reference SSI priorities + KPIs
5. **Quarterly Plan**: Generate plan with KR targets; verify milestones map to KPI changes
6. **Edit Plan**: Extend plan; verify no duplication and alignment with priorities
7. **Weekly Plan**: Generate weekly tasks; verify each task maps to a KR metric and timeline

### Unit Tests Required
- TargetCalculatorService: 20+ tests
- AIContextService block integration: 15+ tests
- Auth middleware coverage: 5+ tests

---

## Related Documents

- [Sprint 10 Master Plan](../SPRINT-10%20(Complete)/SPRINT-10-MASTER-PLAN.md)
- [Sprint 11 Master Plan](../SPRINT-11%20(Planned)/SPRINT-11-MASTER-PLAN.md)
- [Epic K: Business Metrics Profile](../SPRINT-10%20(Complete)/EPIC-K-BUSINESS-METRICS-PROFILE.md)
- [AIContextService Enhancement Spec](../SPRINT-10%20(Complete)/AICONTEXTSERVICE-ENHANCEMENT-SPEC.md)
- [Audit Report RVW-20260109-003](../../.codex/reviews/reports/RVW-20260109-003-audit.md)
- [Data Flow Before/After](./DATA-FLOW-BEFORE-AFTER.md)

---

**Plan Owner**: Product Team
**Technical Lead**: TBD
**Target**: After Sprint 11 completion
**Audit Reference**: RVW-20260109-003
