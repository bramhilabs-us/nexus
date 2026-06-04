# Sprint 10-11 Cross-Epic Audit Report

**Created**: January 9, 2026
**Purpose**: Identify discrepancies, validate data flows, ensure robust intelligent systems
**Scope**: Sprint 10 (116 pts) + Sprint 11 (28 pts) + Epic M (45 pts)

---

## Executive Summary

### Overall Assessment: **GOOD with 5 Issues to Address**

The sprint plans are well-structured with clear dependencies. However, this audit identified:

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 1 | Industry enum mismatch between Epic J and Epic K |
| **High** | 2 | Missing dependency declarations, Story point recalculation |
| **Medium** | 2 | AI context duplication, Sprint capacity concerns |

---

## 1. Epic Overview & Dependencies

### Sprint 10 Epics (116 pts)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SPRINT 10 DATA FLOW                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Epic J (31 pts)                    Epic K (30 pts)                         │
│  Assessment Credibility             Business Metrics                        │
│  ┌─────────────────────┐            ┌─────────────────────┐                │
│  │ AssessmentQuestion  │            │ Company Model       │                │
│  │ + module_type       │            │ + industry_subtype  │                │
│  │ + industry_tags     │───────────▶│ + business_metrics  │                │
│  │ + role_tags         │  MUST      │ + profile_completion│                │
│  │ + block             │  ALIGN     │   (virtual)         │                │
│  └─────────────────────┘            └─────────────────────┘                │
│           │                                   │                             │
│           │ feeds                             │ enhances                    │
│           ▼                                   ▼                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           AI OKR Generation                          │   │
│  │                    (server/routes/ai-okr.js)                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│           │                                                                 │
│           │ displays                                                        │
│           ▼                                                                 │
│  Epic I (20 pts)                    Epic D (35 pts)                         │
│  SSI Intelligence UI                Dashboard & Tasks                       │
│  ┌─────────────────────┐            ┌─────────────────────┐                │
│  │ 12-block breakdown  │            │ Task management     │                │
│  │ Block insights      │            │ Status tracking     │                │
│  │ Export reports      │            │ Due date alerts     │                │
│  └─────────────────────┘            └─────────────────────┘                │
│                                              │                              │
│                                              │ provides                     │
│                                              ▼                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Week Status Calculation                           │   │
│  │               (consumed by Epic L in Sprint 11)                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Sprint 11 Epics (28 pts + Epic M 45 pts)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SPRINT 11 DATA FLOW                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DEPENDENCIES FROM SPRINT 10:                                               │
│  ├── Epic D (Dashboard) → Epic L (week status from tasks)                   │
│  ├── Epic K (Business Metrics) → Epic M (AI context)                        │
│  └── Epic I (SSI 12-block) → Epic M (gap-filling algorithm)                 │
│                                                                             │
│  Epic L (25 pts)                                                            │
│  Planning Page Redesign                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Week tiles grid                                                      │   │
│  │ KR sidebar                                                           │   │
│  │ AI context assembly ◄─────────── assembleWeeklyGoalContext()        │   │
│  │ Week status ◄───────────────────── Task completion from Dashboard   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Epic M (45 pts) - Planned separately                                       │
│  Intelligent OKR Wizard                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Guided wizard flow                                                   │   │
│  │ Gap-filling mode ◄─────────────── GapAnalyzer service               │   │
│  │ Company→Team cascade ◄──────────── Objective model extensions       │   │
│  │ Enhanced AI prompt ◄────────────── Business metrics + SSI blocks    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Discrepancy Analysis

### CRITICAL: Industry Enum Mismatch

**Location**: Epic J vs Epic K

**Epic J** defines `industry_tags` enum in `AssessmentQuestion.js`:
```javascript
industry_tags: ['consulting', 'trade_contractor', 'wellness', 'oil_gas', 'home_services', 'healthcare']
```

**Epic K** defines industries in `industry-metrics.json`:
```json
"financial_services": { ... },
"consulting": { ... },
"professional_services": { ... }
```

**Problem**:
- `financial_services` is in Epic K but NOT in Epic J's enum
- `trade_contractor`, `wellness`, `oil_gas`, `home_services`, `healthcare` are in Epic J but NOT in Epic K
- This breaks the connection between industry-specific questions and industry-specific metrics

**Resolution**:
1. Unify the industry list across both epics
2. Recommended master list:
   ```javascript
   INDUSTRIES = [
     'financial_services',  // Epic K's first target
     'consulting',          // Both epics
     'professional_services', // Epic K
     'trade_contractor',    // Epic J
     'wellness',            // Epic J (map to healthcare?)
     'oil_gas',             // Epic J (map to professional_services?)
     'home_services',       // Epic J
     'healthcare'           // Epic J (merge with wellness?)
   ]
   ```

**Impact**: HIGH - Without alignment, AI cannot correlate industry questions with industry metrics

---

### HIGH: Missing Dependency Declaration

**Location**: Epic L and Sprint 11 Master Plan

**Issue**: Epic L (Planning Page) depends on Epic D (Dashboard) for task status calculation, but this dependency is not strongly enforced.

**From Epic L spec**:
> "Status % = (completed tasks / total tasks) from Dashboard"

**From Sprint 11 Master Plan**:
> "Dependencies: Sprint 10 completion | Required | Epic D (Dashboard) must be done"

**Problem**:
- If Epic D is not complete, Epic L's L4 story (Week Status from Tasks) cannot function
- Sprint 11 could start before Sprint 10 finishes (risky)

**Resolution**:
1. Add explicit dependency gate: "Sprint 11 cannot start until Epic D API endpoints are functional"
2. Or: Make L4 story "stubbed" with mock data, then integrate later

---

### HIGH: Story Point Recalculation Needed

**Issue**: Sprint totals don't account for Epic M placement

**Current State**:
- Sprint 10: 116 pts (4 epics)
- Sprint 11: 28 pts (Epic L + Quickfix)
- Epic M: 45 pts (planned, not assigned)

**Problem**:
- Sprint 11 at 28 pts is unusually small
- Epic M at 45 pts is unusually large for a single sprint
- No clear sprint assignment for Epic M

**Recommendation**:
```
Option A: Sprint 11 = 28 + 13 (Epic M Phase 1) = 41 pts
          Sprint 12 = 32 pts (Epic M Phases 2-3)

Option B: Sprint 11 = 28 pts (unchanged)
          Sprint 12 = 45 pts (full Epic M)

Option C: Sprint 11 = 73 pts (28 + 45) - Very aggressive
```

**Resolution**: Adopt Option A for balanced sprints

---

### MEDIUM: AI Context Duplication

**Location**: Epic L (L5) vs Epic M (M15)

**Epic L - L5 (AI Context Assembly)**:
```javascript
async function assembleWeeklyGoalContext(companyId, keyResultId, targetWeek) {
  // Fetches: company, keyResult, weeklyGoals, tasks, ssiData
  return {
    company: { name, industry, industry_subtype, business_metrics },
    ssi_scores: ssiData,
    objective: { title, category },
    key_result: { title, current_value, target_value },
    week_history: [...],
    // ...
  };
}
```

**Epic M - M15 (Enhanced OKR Prompt)**:
```javascript
function buildEnhancedOKRPrompt(context) {
  // Similar context assembly but for objectives
  return {
    company: { name, industry, industry_subtype, business_metrics },
    ssi: { speed, strength, intelligence, blocks, weakest_blocks },
    existing_objectives,
    gap_analysis,
    // ...
  };
}
```

**Problem**: Both epics build similar AI context independently, leading to:
1. Code duplication
2. Inconsistent context structure
3. Maintenance burden

**Resolution**: Create shared `AIContextService` that both epics use:
```javascript
// server/services/AIContextService.js (ENHANCE EXISTING)
class AIContextService {
  async getBaseContext(companyId) {
    return { company, ssi_scores, business_metrics };
  }

  async getOKRContext(companyId, options) {
    // For Epic M wizard
    return { ...baseContext, existing_objectives, gap_analysis };
  }

  async getWeeklyGoalContext(companyId, keyResultId, weekNumber) {
    // For Epic L planning
    return { ...baseContext, key_result, week_history };
  }
}
```

**Impact**: MEDIUM - Both epics work independently but codebase becomes messy

---

### MEDIUM: Sprint 10 Capacity Concern

**Issue**: Sprint 10 at 116 pts is very large

**Analysis**:
- Average previous sprint: ~50 pts
- Sprint 10: 116 pts (2.3x average)
- Duration: "2 weeks (estimated)"

**Risk**: Sprint 10 delays cascade to Sprint 11

**Story Distribution**:
| Epic | Points | Complexity |
|------|--------|------------|
| Epic I | 20 | Medium (UI) |
| Epic D | 35 | High (Core workflow) |
| Epic J | 31 | High (Schema + UI redesign) |
| Epic K | 30 | Medium (Config-driven) |

**Resolution Options**:
1. Split Sprint 10 into 10A and 10B
2. Defer Epic K to Sprint 11 (reduces to 86 pts)
3. Accept longer duration (3 weeks instead of 2)

---

## 3. Data Model Coherence Check

### Models to Modify in Sprint 10

| Model | Epic | Changes |
|-------|------|---------|
| `AssessmentQuestion.js` | J | +module_type, +industry_tags, +role_tags, +block, +question_subtype |
| `AssessmentTemplate.js` | J | +modules_used, +block_coverage |
| `Company.js` | K | +industry_subtype, +business_metrics (Map), +profile_completion (virtual) |

### Models to Modify in Sprint 11/Epic M

| Model | Epic | Changes |
|-------|------|---------|
| `Objective.js` | M | +level, +parent_objective_id, +team_id, +alignment_score, +cascade_metadata |

### Cross-Model Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DATA MODEL RELATIONSHIPS                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Company                                                                    │
│  ├── industry (existing)                                                    │
│  ├── industry_subtype (Epic K - NEW)  ◄─── Must match industry_tags list   │
│  └── business_metrics (Epic K - NEW)                                        │
│           │                                                                 │
│           └──────────────────────────────────────────────────────────────┐  │
│                                                                          │  │
│  AssessmentQuestion                                              uses    │  │
│  ├── industry_tags[] (Epic J - NEW)  ◄────────────────────────────────────┤  │
│  ├── role_tags[] (Epic J - NEW)                                          │  │
│  ├── module_type (Epic J - NEW)                                          │  │
│  └── block (Epic J - NEW)                                                │  │
│           │                                                                 │
│           │ included in                                                     │
│           ▼                                                                 │
│  AssessmentTemplate                                                         │
│  ├── modules_used[] (Epic J - NEW)                                         │
│  └── block_coverage{} (Epic J - NEW)                                       │
│           │                                                                 │
│           │ generates                                                       │
│           ▼                                                                 │
│  Assessment (SSI Results)                                                   │
│  └── ssi_result (existing - 12-block MECE)                                 │
│           │                                                                 │
│           │ informs                                                         │
│           ▼                                                                 │
│  AI OKR Generation                                                          │
│  └── Uses: ssi_result + business_metrics + industry context                │
│           │                                                                 │
│           │ creates                                                         │
│           ▼                                                                 │
│  Objective                                                                  │
│  ├── level (Epic M - NEW): 'company' | 'team'                              │
│  ├── parent_objective_id (Epic M - NEW)                                    │
│  ├── team_id (Epic M - NEW)                                                │
│  └── cascade_metadata (Epic M - NEW)                                       │
│           │                                                                 │
│           │ cascades to                                                     │
│           ▼                                                                 │
│  Key Result → Goal → Weekly Goal → Task                                    │
│                          │                                                  │
│                          │ tracked in                                       │
│                          ▼                                                  │
│  Dashboard (Epic D) → provides status to → Planning (Epic L)               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. AI Integration Coherence Check

### AI Touch Points Across Epics

| Epic | AI Feature | Context Used | Output |
|------|------------|--------------|--------|
| Epic I | SSI Insights | 12-block scores | Block-level recommendations |
| Epic J | N/A (Template creation) | - | - |
| Epic K | OKR Enhancement | Business metrics | Industry-specific objectives |
| Epic L | Weekly Goal Suggestions | Week history, KR progress, SSI | Weekly goal + tasks |
| Epic M | OKR Generation | SSI + Metrics + Gaps | Full objectives with KRs |

### Prompt Consistency Analysis

**Current State**: Each epic builds its own prompt

**Recommended**: Standardize prompt structure:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  STANDARD AI PROMPT STRUCTURE                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SECTION 1: COMPANY CONTEXT (always include)                               │
│  - Company name, industry, industry_subtype                                 │
│  - Employee count, size category                                            │
│  - Business metrics (from Epic K)                                           │
│                                                                             │
│  SECTION 2: SSI CONTEXT (always include)                                   │
│  - Overall scores (Speed, Strength, Intelligence)                           │
│  - 12-block breakdown with scores                                           │
│  - Weakest blocks (priority areas)                                          │
│  - Strongest blocks (leverage points)                                       │
│                                                                             │
│  SECTION 3: HIERARCHICAL CONTEXT (depends on feature)                      │
│  - For OKR Generation: Existing objectives, category coverage              │
│  - For Weekly Goals: Objective → KR → Week history                         │
│                                                                             │
│  SECTION 4: REQUEST CONTEXT (always include)                               │
│  - What to generate (objective/weekly goal/insights)                        │
│  - Constraints (category, timeline, etc.)                                   │
│  - Generation mode (new/gap-fill/cascade)                                   │
│                                                                             │
│  SECTION 5: OUTPUT FORMAT (always include)                                 │
│  - JSON schema for response                                                 │
│  - Required fields                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Recommended Resolutions

### Resolution 1: Unify Industry List (CRITICAL)

**Action**: Create shared industry configuration

**File**: `server/config/industries.js`
```javascript
module.exports = {
  INDUSTRIES: {
    financial_services: {
      label: 'Financial Services',
      subtypes: ['legacy_succession', 'wealth_management', 'insurance_brokerage'],
      questions_available: true,  // Epic J
      metrics_available: true     // Epic K
    },
    consulting: {
      label: 'Consulting',
      subtypes: ['general', 'management', 'it'],
      questions_available: true,
      metrics_available: true
    },
    healthcare: {
      label: 'Healthcare',
      subtypes: ['general', 'wellness'],
      questions_available: true,
      metrics_available: false  // Coming soon
    },
    trade_contractor: {
      label: 'Trade Contractor',
      subtypes: ['general', 'electrical', 'plumbing', 'hvac'],
      questions_available: true,
      metrics_available: false
    },
    home_services: {
      label: 'Home Services',
      subtypes: ['general'],
      questions_available: true,
      metrics_available: false
    },
    oil_gas: {
      label: 'Oil & Gas',
      subtypes: ['general'],
      questions_available: true,
      metrics_available: false
    },
    professional_services: {
      label: 'Professional Services',
      subtypes: ['general', 'legal', 'accounting'],
      questions_available: false,
      metrics_available: true
    }
  },

  getIndustryList() {
    return Object.keys(this.INDUSTRIES);
  },

  getSubtypes(industry) {
    return this.INDUSTRIES[industry]?.subtypes || [];
  }
};
```

**Update Epic J**: Use shared config for `industry_tags` enum
**Update Epic K**: Use shared config for `industry-metrics.json` structure

---

### Resolution 2: Enforce Sprint 10 → 11 Dependency

**Action**: Add dependency gate to Sprint 11 Master Plan

```markdown
## Hard Dependencies (Must be complete before Sprint 11 starts)

| Epic | Stories Required | Reason |
|------|------------------|--------|
| Epic D | D1, D2, D4 | L4 (Week Status) needs task completion data |
| Epic K | K1, K4 | Epic M needs business_metrics in Company model |

## Soft Dependencies (Can parallelize with caution)

| Epic | Stories | Notes |
|------|---------|-------|
| Epic I | All | Epic L can start independently |
| Epic J | All | Epic L doesn't use modular questions |
```

---

### Resolution 3: Create Shared AIContextService

**Action**: Enhance existing AIContextService to be the single source of AI context

**File**: `server/services/AIContextService.js`

```javascript
/**
 * AIContextService - Unified context provider for all AI features
 * Sprint 10-11 Enhancement
 */
class AIContextService {

  /**
   * Base context - used by ALL AI features
   */
  async getBaseContext(companyId) {
    const [company, ssiData] = await Promise.all([
      Company.findById(companyId)
        .select('name industry industry_subtype employee_count business_metrics')
        .lean(),
      this.getLatestSSI(companyId)
    ]);

    return {
      company: {
        name: company.name,
        industry: company.industry,
        industry_subtype: company.industry_subtype,
        employee_count: company.employee_count,
        size_category: this.categorizeSize(company.employee_count),
        business_metrics: this.mapToObject(company.business_metrics)
      },
      ssi: {
        overall: {
          speed: ssiData?.speed || 0,
          strength: ssiData?.strength || 0,
          intelligence: ssiData?.intelligence || 0
        },
        blocks: ssiData?.blocks || {},
        weakest: this.getWeakestBlocks(ssiData, 3),
        strongest: this.getStrongestBlocks(ssiData, 3)
      }
    };
  }

  /**
   * OKR Generation context - used by Epic M wizard
   */
  async getOKRGenerationContext(companyId, options = {}) {
    const [base, objectives, gapAnalysis] = await Promise.all([
      this.getBaseContext(companyId),
      Objective.find({ company_id: companyId, status: { $ne: 'cancelled' } }).lean(),
      this.analyzePortfolioGaps(companyId)
    ]);

    return {
      ...base,
      objectives: {
        existing: objectives.map(o => ({
          title: o.title,
          category: o.category,
          level: o.level || 'company',
          status: o.status
        })),
        by_category: this.groupByCategory(objectives),
        total: objectives.length
      },
      gap_analysis: gapAnalysis,
      request: options
    };
  }

  /**
   * Weekly Goal context - used by Epic L planning page
   */
  async getWeeklyGoalContext(companyId, keyResultId, targetWeek) {
    const [base, keyResult, weekHistory] = await Promise.all([
      this.getBaseContext(companyId),
      KeyResult.findById(keyResultId).populate('objective_id').lean(),
      this.getWeekHistory(keyResultId)
    ]);

    return {
      ...base,
      objective: {
        title: keyResult.objective_id.title,
        category: keyResult.objective_id.category
      },
      key_result: {
        title: keyResult.title,
        current: keyResult.current_value,
        target: keyResult.target_value,
        progress: Math.round((keyResult.current_value / keyResult.target_value) * 100)
      },
      week_history: weekHistory,
      target_week: targetWeek,
      analysis: this.analyzeWeekProgress(weekHistory, targetWeek)
    };
  }
}
```

---

### Resolution 4: Adopt Sprint Distribution Option A

**Action**: Update Sprint 11 to include Epic M Phase 1

**New Sprint Structure**:

| Sprint | Epics | Points |
|--------|-------|--------|
| Sprint 10 | I (20) + D (35) + J (31) + K (30) | 116 |
| Sprint 11 | L (25) + Quickfix (3) + M Phase 1 (13) | **41** |
| Sprint 12 | M Phases 2-3 (32) | **32** |

**Update Sprint 11 Master Plan**:
```markdown
## Epic Overview (Updated)

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| Epic L | 25 | P1 | Planning Page Redesign |
| Epic M Phase 1 | 13 | P1 | OKR Wizard Foundation |
| Quickfix | 3 | P2 | Forgot Password |
| **Total** | **41** | | |
```

---

## 6. Validation Checklist

### Pre-Sprint 10 Checklist

- [ ] Industry enum unified across Epic J and Epic K
- [ ] AIContextService enhancement planned
- [ ] Sprint 10 execution order defined (J → K for industry alignment)
- [ ] Epic D stories D1, D2, D4 identified as Sprint 11 blockers

### Pre-Sprint 11 Checklist

- [ ] Epic D (Dashboard) D1, D2, D4 complete
- [ ] Epic K (Business Metrics) K1, K4 complete
- [ ] Company model has business_metrics field populated
- [ ] Industry config shared between J and K

### Pre-Epic M Implementation Checklist

- [ ] Epic K fully complete (business metrics available)
- [ ] GapAnalyzer service designed
- [ ] Objective model extension spec finalized
- [ ] AIContextService enhanced with getOKRGenerationContext()

---

## 7. Risk Matrix

| Risk | Probability | Impact | Sprint | Mitigation |
|------|-------------|--------|--------|------------|
| Industry mismatch breaks AI | High | Critical | 10 | Unify before J starts |
| Sprint 10 delays | Medium | High | 10-11 | Accept 3-week duration |
| Epic D incomplete | Medium | High | 11 | Block L4 story |
| AI context inconsistent | Low | Medium | 11-12 | Shared AIContextService |
| Epic M scope creep | Medium | Medium | 12 | Lock 45 pts, defer extras |

---

## 8. Recommended Implementation Order

### Sprint 10 (Weeks 1-3)

```
Week 1:
├── Epic K (K1-K4): Backend foundation
│   └── Creates industry_subtype, business_metrics fields
├── Epic J (J1): Schema changes
│   └── Uses shared industry config from K
└── Epic I (I2-I3): SSI UI can parallel

Week 2:
├── Epic J (J2-J5): Question seeds + API
├── Epic D (D1-D3): Dashboard core
└── Epic K (K5-K6): AI integration

Week 3:
├── Epic J (J6-J8): Template creation UI
├── Epic D (D4-D7): Dashboard completion
└── Epic K (K7-K9): Metrics UI
└── Epic I (I4-I5): Export + mobile
```

### Sprint 11 (Week 4-5)

```
Week 4:
├── Epic L (L1-L4): Layout + interaction
└── Epic M Phase 1 (M1, M6, M10): Foundation

Week 5:
├── Epic L (L5-L6): AI context + UI
├── Epic M Phase 1 (M2): Context review
└── Quickfix: Forgot password
```

### Sprint 12 (Week 6-7)

```
Week 6:
├── Epic M Phase 2: Core generation
│   └── M3, M4, M5, M7, M8, M15, M16

Week 7:
├── Epic M Phase 3: Cascade + polish
│   └── M9, M11, M12, M13, M14
```

---

## 9. Action Items Summary

| Priority | Action | Owner | Sprint |
|----------|--------|-------|--------|
| CRITICAL | Unify industry enum list | Dev | Pre-10 |
| HIGH | Update Sprint 11 with M Phase 1 | Planning | Pre-11 |
| HIGH | Add dependency gate documentation | Planning | Pre-11 |
| MEDIUM | Design shared AIContextService | Dev | 10 |
| MEDIUM | Review Sprint 10 capacity (116 pts) | Planning | Pre-10 |

---

**Report Prepared By**: Claude Code
**Date**: January 9, 2026
**Status**: READY FOR REVIEW
