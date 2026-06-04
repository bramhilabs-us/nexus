# Sprint 15-A: Dependency & Impact Analysis

**Date**: March 6, 2026
**Purpose**: Validate Sprint 15-A plan before implementation
**Status**: ANALYSIS COMPLETE

---

## Executive Summary

After deep analysis of the codebase, the situation is **more nuanced** than initially assessed:

| Finding | Status |
|---------|--------|
| `generate-from-company` includes company profile | PARTIALLY YES |
| `generate-from-company` includes strategic vision | PARTIALLY YES |
| `generate-from-company` uses `AIContextService` | NO |
| `generate-from-company` includes existing objectives | NO |
| `generate-from-company` includes rejection history | NO |
| `planning.js` routes use `AIContextService` | YES |

**Revised Root Cause**: The `generate-from-company` endpoint DOES include company profile and strategic vision, but:
1. It builds context manually (duplicate code)
2. It does NOT use the centralized `AIContextService`
3. It does NOT include existing objectives (deduplication)
4. It does NOT include rejection history (learning)

---

## AI Generation Endpoints Analysis

### 5 AI OKR Generation Endpoints

| # | Endpoint | Line | Context Source | Uses AIContextService |
|---|----------|------|----------------|----------------------|
| 1 | `POST /generate/:assessmentId` | 146 | `aiOKRService.buildContext()` | NO |
| 2 | `POST /generate-from-team` | 657 | Manual construction | NO |
| 3 | `POST /generate-plan` | 971 | `aiContextService.buildContext()` | YES |
| 4 | `POST /generate-from-company` | 1100 | Manual construction | NO |
| 5 | `POST /generate-single-objective` | 2033 | Manual construction | NO |

### Context Comparison

| Context Field | AIContextService | generate-from-company | generate/:assessmentId |
|--------------|------------------|----------------------|------------------------|
| Company name | YES | YES | YES (limited) |
| Company profile | YES | YES | NO |
| Strategic vision | YES | PARTIAL (different structure) | NO |
| Business metrics | YES | YES (manual) | NO |
| Business targets | YES | YES (manual) | NO |
| 12-block SSI | YES | YES (manual) | NO |
| Priority blocks | YES | YES (derived manually) | NO |
| Existing objectives | YES | NO | NO |
| Objective gaps | YES | NO | NO |
| Rejection history | YES | NO | NO |
| Task history | YES | NO | NO |
| Context delta | YES | NO | NO |
| Token management | YES | NO | NO |

---

## Key Findings

### Finding 1: Duplicate Context Building (Code Duplication)

**Location**: `server/routes/ai-okr.js:1100-1821` (~700 lines)

The `generate-from-company` endpoint manually builds context that's already available in `AIContextService`:

```javascript
// Current: Manual construction (ai-okr.js:1300-1420)
const currentMetrics = company.business_context?.metrics?.current || {};
const targetMetrics = company.business_context?.targets || {};
// ... 120 lines of manual metric extraction ...

// Should use: AIContextService (already consolidated)
const context = await aiContextService.buildContext(companyId, {
    scope: 'okr',
    includeHistory: true,
    includeRejections: true
});
// Context already has: business.metrics, business.targets, etc.
```

### Finding 2: Missing Deduplication Context

**Problem**: Generated objectives may duplicate existing ones because existing objectives are NOT passed to the prompt.

**Evidence**: The prompt in `generate-from-company` does NOT include:
```javascript
// NOT IN CURRENT PROMPT:
EXISTING OBJECTIVES (Avoid Duplicates):
- [Growth] Streamline Operations for Excellence (0% complete)
- [Customer Success] Improve Client Retention (25% complete)

// This IS in AIContextService:
context.objectives = {
    total: 3,
    list: [...],
    gaps: ['No financial objective', 'No people_culture objective']
};
```

### Finding 3: Missing Learning Context

**Problem**: AI doesn't learn from past rejections because rejection history is NOT passed to the prompt.

**Evidence**: `AIContextService` has this capability but it's not used:
```javascript
// Available in AIContextService:
context.rejections = {
    total: 5,
    byCategory: [
        { category: 'too_generic', count: 3 },
        { category: 'not_relevant', count: 2 }
    ],
    avoidanceGuidance: [
        'Avoid vague objectives - be specific about metrics',
        'Ensure suggestions align with company industry'
    ]
};
```

### Finding 4: Strategic Vision Structure Mismatch

**AIContextService expects**:
```javascript
business_context.strategic_vision = {
    priority_one: 'Grow AUM to $500M',
    priority_two: 'Implement next-gen engagement',
    priority_three: 'Achieve operational excellence'
};
```

**Current prompt looks for**:
```javascript
company.business_context.strategic_vision = {
    mission: '...',
    vision: '...',
    priorities: ['...', '...']  // Array, not priority_one/two/three
};
```

**Impact**: Strategic vision may not be properly displayed in prompt if structure doesn't match.

---

## Dependency Analysis

### Upstream Dependencies (What Feeds AI Generation)

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA SOURCES                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Company Model                    Assessment Model               │
│  ├── business_context.profile    ├── overall_scores             │
│  │   ├── description             ├── ssi_result.dimensions      │
│  │   ├── business_model          └── ssi_result.blocks          │
│  │   ├── value_proposition                                      │
│  │   └── client_profile           SSIDiagnosticReport Model     │
│  │                                └── getOKRGenerationData()    │
│  ├── business_context.metrics                                   │
│  │   └── current.*                DiagnosticReport Model        │
│  ├── business_context.targets     └── okr_recommendations       │
│  └── business_context.strategic_vision                          │
│                                                                  │
│  Objective Model                  AIInteractionLog Model         │
│  └── (existing objectives)        └── rejection_reasons         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              CONTEXT AGGREGATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  AIContextService.buildContext()  │  Manual (ai-okr.js)         │
│  ────────────────────────────────  │  ─────────────────────────  │
│  ✓ All sources consolidated       │  ✗ Partial sources only     │
│  ✓ Token management               │  ✗ No token management      │
│  ✓ Existing objectives            │  ✗ Missing objectives       │
│  ✓ Rejection history              │  ✗ Missing rejections       │
│  ✓ Context delta                  │  ✗ Missing delta            │
│  ✓ Used by planning.js            │  ✗ Used by ai-okr.js        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI GENERATION                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  generate-from-company  │  generate-plan  │  generate-weekly    │
│  ──────────────────────  │  ─────────────  │  ─────────────────  │
│  Uses: Manual context   │  Uses: AICon.   │  Uses: AIContext    │
│  Model: gpt-4o          │  Model: gpt-4o  │  Model: gpt-4o-mini │
│  Prompt: 1500+ lines    │  Prompt: ~200   │  Prompt: ~200       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Downstream Dependencies (What Uses AI Generation Output)

```
AI Generation Output
        │
        ├── AIOKRSuggestion Model (saves draft objectives)
        │       │
        │       └── objectives.html (displays for review/approval)
        │               │
        │               └── Objective Model (approved objectives saved)
        │                       │
        │                       ├── Key Results (attached)
        │                       │
        │                       └── Planning page (uses objectives)
        │
        └── objectives.html Direct Display
                │
                └── User reviews, edits, approves/dismisses
```

---

## Impact Analysis

### Files That Will Be Modified

| File | Type | Impact | Risk |
|------|------|--------|------|
| `server/routes/ai-okr.js` | Routes | HIGH | MEDIUM |
| `server/services/aiOKRService.js` | Service | MEDIUM | LOW |
| `tests/unit/services/aiOKRService.context.test.js` | Test | NEW | NONE |

### Breaking Change Analysis

| Change | Breaking? | Mitigation |
|--------|-----------|------------|
| Replace manual context with AIContextService | NO | Same output format |
| Add existing objectives to prompt | NO | Additional context only |
| Add rejection history to prompt | NO | Additional context only |
| Change prompt structure | POSSIBLE | Test thoroughly |

### Backward Compatibility

| Concern | Status | Notes |
|---------|--------|-------|
| API response format | COMPATIBLE | No changes to response structure |
| Frontend integration | COMPATIBLE | Uses same data format |
| Existing objectives | COMPATIBLE | Won't affect approved objectives |
| Template fallback | COMPATIBLE | Still available when OpenAI disabled |

---

## Risk Assessment

### Risk 1: Token Limit Exceeded
- **Probability**: LOW
- **Impact**: MEDIUM
- **Mitigation**: AIContextService already has token management (8000 limit)

### Risk 2: Prompt Quality Degradation
- **Probability**: MEDIUM
- **Impact**: HIGH
- **Mitigation**:
  - Keep existing prompt structure
  - Add new sections (existing objectives, rejections) at end
  - Test with multiple companies

### Risk 3: Strategic Vision Structure Mismatch
- **Probability**: HIGH
- **Impact**: MEDIUM
- **Finding**: Company model uses `priority_one/two/three` but prompt looks for `mission/vision/priorities`
- **Mitigation**: Normalize in AIContextService OR update prompt

### Risk 4: Regression in Objective Quality
- **Probability**: LOW
- **Impact**: HIGH
- **Mitigation**:
  - A/B test with real companies
  - Keep rollback path (can revert to manual context)

---

## Design Flaws Identified

### Flaw 1: Strategic Vision Structure Mismatch (CRITICAL)

**Problem**: The prompt looks for fields that DON'T EXIST in the Company model!

```javascript
// ACTUAL Company Model Structure (Company.js:221-243):
business_context.strategic_vision = {
    priority_one: String,           // #1 priority for next 12 months
    biggest_blocker: String,        // Obstacle to growth
    one_thing: String,              // What to change
    strategic_priorities: [String], // Array of priorities
    growth_aspirations: String      // 3-5 year vision
};

// CURRENT PROMPT LOOKS FOR (ai-okr.js:1696-1701):
company.business_context.strategic_vision.mission       // DOESN'T EXIST!
company.business_context.strategic_vision.vision        // DOESN'T EXIST!
company.business_context.strategic_vision.priorities    // WRONG NAME! (should be strategic_priorities)
```

**Impact**: Strategic vision is likely NOT being included in the prompt because the code references non-existent fields!

**Root Cause**: Prompt was written expecting different field names than what the model actually has.

**Fix Required**: Update prompt to use correct field names:
- `priority_one` instead of `mission`
- `growth_aspirations` instead of `vision`
- `strategic_priorities` instead of `priorities`
- Also add: `biggest_blocker`, `one_thing`

### Flaw 2: No Standardized Context Interface

**Problem**: `AIContextService.buildContext()` returns different structure than `generate-from-company` expects.

**Recommendation**: Either:
- A) Adapt `generate-from-company` to use AIContextService output
- B) Create a transformer function to convert formats

### Flaw 3: Duplicate Logic in Multiple Endpoints

**Problem**: 5 AI endpoints each build context differently.

**Recommendation**: Consolidate all to use `AIContextService.buildContext()`.

---

## Revised Sprint 15-A Plan

Based on this analysis, I recommend **revising the plan**:

### Phase 1: Audit & Normalize (Day 1)
- [ ] Audit Company model for actual strategic_vision structure
- [ ] Verify business_context.profile fields
- [ ] Document current vs expected structures

### Phase 2: AIContextService Enhancement (Day 2)
- [ ] Add method to output context in prompt-ready format
- [ ] Ensure all structures are normalized
- [ ] Add existing objectives to context output

### Phase 3: Integration (Day 3-4)
- [ ] Replace manual context in `generate-from-company` with AIContextService
- [ ] Add existing objectives section to prompt
- [ ] Add rejection history section to prompt

### Phase 4: Testing (Day 5)
- [ ] Unit tests for context output
- [ ] Integration tests for generation
- [ ] Manual E2E testing with real companies

---

## Validation Checklist

Before implementation, verify:

- [ ] Company model `business_context.strategic_vision` structure confirmed
- [ ] Company model `business_context.profile` fields confirmed
- [ ] AIContextService output matches expected prompt input
- [ ] Token budget sufficient for added context
- [ ] Rollback plan documented

---

## Appendix: Code Locations

### AIContextService Methods
- `buildContext()`: Line 711-938
- `getFullSSIScores()`: Line 427-538
- `_summarizeObjectives()`: Line 1030-1062
- `_getRejectionHistoryForContext()`: Line 1227-1270

### ai-okr.js generate-from-company
- Route handler: Line 1100-1950
- Manual context building: Line 1125-1300
- Prompt construction: Line 1554-1821
- OpenAI call: Line 1823-1850

### planning.js (Reference for correct pattern)
- AIContextService usage: Line 820, 1593
- Shows correct integration pattern

---

**Document Version**: 1.0
**Created**: March 6, 2026
**Author**: Claude Code

