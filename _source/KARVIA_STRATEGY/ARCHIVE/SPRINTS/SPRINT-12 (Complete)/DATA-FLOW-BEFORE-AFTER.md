# Data Flow Analysis: Before vs After Sprint 12

## Current State (BEFORE Sprint 12)

### The Problem: Generic OKRs

```
┌───────────────────────────────────────────────────────────────────────┐
│                     CURRENT DISCONNECTED FLOW                         │
└───────────────────────────────────────────────────────────────────────┘

ASSESSMENT                    COMPANY PROFILE              OKR CREATION
┌─────────────┐              ┌─────────────┐             ┌─────────────┐
│ 12 Blocks   │              │ Industry:   │             │ Generic     │
│ Calculated  │──X──LOST──X──│ consulting  │──X──NOT────│ Templates   │
│ But NOT     │              │             │    USED    │             │
│ Persisted   │              │ Metrics:    │             │ Speed: 30%  │
│             │              │ NOT CAPTURED│             │ Strength:20%│
└─────────────┘              └─────────────┘             └─────────────┘
      │                            │                           │
      ▼                            ▼                           ▼
┌─────────────┐              ┌─────────────┐             ┌─────────────┐
│ ONLY SAVED: │              │ ONLY SAVED: │             │ OUTPUT:     │
│ speed: 65   │              │ description │             │ "Improve    │
│ strength:58 │              │ mission     │             │ retention   │
│ intel: 72   │              │ values      │             │ by 30%"     │
│             │              │ (text only) │             │             │
│ NO BLOCKS!  │              │ NO NUMBERS! │             │ ALWAYS 30%! │
└─────────────┘              └─────────────┘             └─────────────┘

RESULT: Every company gets the same generic targets regardless of their
actual business metrics, industry, or specific weak areas.
```

### Current Example Output

```
Company: ABC Wealth Advisors (Financial Services)
Current AUM: $45M
Current Retention: 72%
Current New Clients/Month: 3

AI-Generated OKRs (GENERIC):
┌─────────────────────────────────────────────────────────────────┐
│ Objective: Accelerate Client Acquisition                        │
│                                                                 │
│ KR1: Improve lead conversion by 30%    ← Where does 30% come from?
│ KR2: Reduce sales cycle by 25%         ← No baseline captured   │
│ KR3: Increase referrals by 20%         ← Not based on current data
└─────────────────────────────────────────────────────────────────┘

Problem: These numbers are HARDCODED in templates, not calculated
from actual business data!
```

---

## Target State (AFTER Sprint 12)

### The Solution: Exact Numbers Pipeline

```
┌───────────────────────────────────────────────────────────────────────┐
│                     COHESIVE DATA PIPELINE                            │
└───────────────────────────────────────────────────────────────────────┘

ASSESSMENT (Epic N)           COMPANY PROFILE (Epic P+K)   OKR CREATION (Epic O)
┌─────────────┐              ┌─────────────┐             ┌─────────────┐
│ 12 Blocks   │              │ Industry:   │             │ Target      │
│ PERSISTED   │───FEEDS───▶  │ financial_  │───FEEDS───▶│ Calculator  │
│             │              │ services    │             │             │
│ Each block: │              │ Subtype:    │             │ Uses:       │
│ - score     │              │ wealth_mgmt │             │ - Baseline  │
│ - benchmark │              │             │             │ - Benchmark │
│ - gap       │              │ Metrics:    │             │ - Readiness │
└─────────────┘              │ AUM: $45M   │             └─────────────┘
      │                      │ Clients: 85 │                   │
      │                      │ Retention:  │                   │
      │                      │   72%       │                   │
      │                      └─────────────┘                   │
      │                            │                           │
      ▼                            ▼                           ▼
┌─────────────┐              ┌─────────────┐             ┌─────────────┐
│ SAVED:      │              │ SAVED:      │             │ OUTPUT:     │
│ speed: 65   │              │ All context │             │ "Improve    │
│ strength:58 │              │ + BASELINE  │             │ retention   │
│ intel: 72   │              │ NUMBERS     │             │ from 72%    │
│             │              │             │             │ to 85%"     │
│ + 12 BLOCKS │              │ + INDUSTRY  │             │             │
│ with gaps   │              │ BENCHMARKS  │             │ EXACT #s!   │
└─────────────┘              └─────────────┘             └─────────────┘

RESULT: Each company gets personalized targets based on their actual
starting point, industry benchmarks, and specific weak areas.
```

### Target Example Output

```
Company: ABC Wealth Advisors (Financial Services - Wealth Management)
Current AUM: $45M
Current Retention: 72%
Current New Clients/Month: 3
Industry Benchmark Retention: 85%

Weak SSI Blocks:
1. Client Acquisition (Speed) - Score: 52/100
2. Client Retention (Strength) - Score: 61/100
3. Strategic Planning (Intelligence) - Score: 58/100

AI-Generated OKRs (PERSONALIZED):
┌─────────────────────────────────────────────────────────────────┐
│ Objective: Accelerate Client Acquisition (targeting weak block) │
│                                                                 │
│ KR1: Increase new clients from 3/month to 5/month (67% ↑)      │
│      Baseline: 3 | Target: 5 | Benchmark: 6                    │
│                                                                 │
│ KR2: Reduce client acquisition cost from $2,400 to $1,800 (25%↓)
│      Baseline: $2,400 | Target: $1,800 | Benchmark: $1,500     │
│                                                                 │
│ KR3: Improve lead-to-client conversion from 8% to 12%          │
│      Baseline: 8% | Target: 12% | Benchmark: 15%               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Objective: Strengthen Client Relationships (targeting weak block)
│                                                                 │
│ KR1: Improve retention rate from 72% to 85%                    │
│      Baseline: 72% | Target: 85% | Benchmark: 85%              │
│                                                                 │
│ KR2: Increase AUM from $45M to $58M (29% ↑)                    │
│      Baseline: $45M | Target: $58M | Benchmark: $75M           │
│                                                                 │
│ KR3: Improve NPS from 42 to 55                                 │
│      Baseline: 42 | Target: 55 | Benchmark: 60                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module-by-Module Changes

### Module 1: Assessment

| Aspect | Before | After |
|--------|--------|-------|
| Score Storage | 3 summary scores only | 12 detailed block scores |
| Gap Analysis | Not captured | Each block has gap-to-benchmark |
| Persistence | Discarded after display | Saved to Assessment model |
| AI Usage | Only aggregate scores | Weak blocks prioritized |

### Module 2: Company Profile

| Aspect | Before | After |
|--------|--------|-------|
| Industry | 6 basic options | Expanded list from industries.js |
| Subtype | Not available | industry_subtype field |
| Metrics | Text descriptions only | Numeric baseline values (Epic K) |
| Benchmarks | None | Industry-specific benchmarks |

### Module 3: OKR Creation

| Aspect | Before | After |
|--------|--------|-------|
| Target Source | Hardcoded templates | TargetCalculatorService |
| Baseline | Always 0 | Captured from business_metrics |
| Personalization | Same for all | Based on readiness + industry |
| Weak Area Focus | Random | Targets lowest SSI blocks |

### Module 4: Planning (No Changes)

The planning module already works well - it cascades goals from OKRs properly.

### Module 5: Dashboard (No Changes)

Dashboard task management already works well - progress rolls up correctly.

---

## Data Model Evolution

### Before (Disconnected)

```
Company                          Assessment
├── name                         ├── company_id
├── industry (limited enum)      ├── responses[]
├── business_context (text)      ├── speed_score
├── assessment_scores            ├── strength_score
│   ├── speed_score              └── intelligence_score
│   ├── strength_score
│   └── intelligence_score       (No detailed blocks!)
│
└── (No business_metrics!)

Objective
├── key_results[]
│   ├── target_value (always generic)
│   └── current_value (always 0)
```

### After (Connected)

```
Company                          Assessment
├── name                         ├── company_id
├── industry (from industries.js)├── responses[]
├── industry_subtype (NEW)       ├── speed_score
├── business_context (text)      ├── strength_score
├── assessment_scores            ├── intelligence_score
│   └── ...                      │
├── business_metrics (Epic K)    └── detailed_block_scores (NEW)
│   ├── annual_revenue               ├── speed
│   ├── client_count                 │   ├── client_acquisition
│   ├── retention_rate               │   │   ├── score
│   └── ...                          │   │   ├── benchmark
│                                    │   │   └── gap
└── last_assessment_id (NEW)         │   └── ...
                                     └── ...

Objective
├── key_results[]
│   ├── target_value (calculated)
│   ├── current_value (from metrics)
│   ├── baseline_value (NEW)
│   ├── baseline_date (NEW)
│   └── baseline_source (NEW)
```

---

## Integration Points

### 1. Assessment → Company Profile

```javascript
// After assessment completion (Epic N)
const detailedScores = await UnifiedSSIScoringService.calculateDetailedBlocks(responses);

await Assessment.findByIdAndUpdate(assessmentId, {
  detailed_block_scores: detailedScores
});

await Company.findByIdAndUpdate(companyId, {
  last_assessment_id: assessmentId,
  assessment_scores: {
    speed_score: detailedScores.speed.aggregate,
    strength_score: detailedScores.strength.aggregate,
    intelligence_score: detailedScores.intelligence.aggregate,
    last_assessed: new Date()
  }
});
```

### 2. Company Profile → OKR Creation

```javascript
// During OKR generation (Epic O)
const context = await AIContextService.getOKRGenerationContext(companyId, {
  includeMetrics: true,
  includeWeakBlocks: true,
  includeBenchmarks: true
});

const targetSuggestions = await TargetCalculatorService.generateAllTargets({
  businessMetrics: context.businessMetrics,
  weakBlocks: context.weakBlocks,
  industryConfig: context.industryConfig,
  readinessLevel: context.readinessProfile
});

// Pass to AI with exact numbers
const prompt = buildOKRPrompt(context, targetSuggestions);
```

### 3. OKR Creation → Planning

No changes needed - existing cascade works perfectly.

```javascript
// Existing flow remains:
Objective.key_results[0].target_value = 85  // Now exact number
                    ↓
QuarterlyGoal.target_value = 78  // Q1 target toward 85
                    ↓
WeeklyGoal (tasks toward 78)
```

---

## Benefits Summary

| Metric | Before | After |
|--------|--------|-------|
| Target Accuracy | Generic 30%/20%/15% | Based on actual baseline + benchmark |
| Personalization | Same for all companies | Industry + readiness specific |
| Weak Area Focus | Random selection | Targeted at lowest SSI blocks |
| Progress Tracking | "X% complete" | "From 72% to 85%" visible |
| User Confidence | "Where did 30% come from?" | Clear baseline → target logic |
