# Sprint Plans Deep Audit Report

**Audit Date**: January 20, 2026
**Scope**: Sprint 10, 11, 12, 13 Master Plans
**Purpose**: Identify hardcoding, redundancies, and alignment issues with existing codebase

---

## Executive Summary

| Category | Critical | High | Medium | Total |
|----------|----------|------|--------|-------|
| Hardcoding | 1 | 2 | 3 | 6 |
| Redundancy | 1 | 1 | 2 | 4 |
| Alignment | 2 | 2 | 1 | 5 |
| **Total** | **4** | **5** | **6** | **15** |

---

## CRITICAL Issues (Must Fix)

### C1: Sprint 12 Epic N - Block Names Mismatch (CRITICAL)

**Location**: Sprint 12 Master Plan, Epic N: Detailed SSI Block Persistence (lines 166-190)

**Issue**: Sprint 12 specifies hardcoded block names that don't match existing 12-block MECE categories.

**Sprint 12 Spec (WRONG)**:
```javascript
detailed_block_scores: {
  speed: {
    client_acquisition: {...},
    sales_velocity: {...},
    market_response: {...},
    operational_speed: {...}
  },
  strength: {
    financial_stability: {...},
    client_retention: {...},
    team_capability: {...},
    brand_reputation: {...}
  },
  intelligence: {
    data_utilization: {...},
    market_awareness: {...},
    strategic_planning: {...},
    innovation_capacity: {...}
  }
}
```

**Existing AssessmentQuestion.js (CORRECT)**:
```javascript
category: {
  type: String,
  enum: {
    values: [
      // Speed blocks
      'delivery', 'decisions', 'change', 'response',
      // Strength blocks
      'financial', 'operations', 'people', 'quality',
      // Intelligence blocks
      'market', 'data', 'strategy', 'learning'
    ]
  }
}
```

**Fix Required**:
Update Sprint 12 N1 to use existing block names:
```javascript
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

---

### C2: Sprint 12 Epic P2 - Redundant Field Creation (CRITICAL)

**Location**: Sprint 12 Master Plan, Epic P: Company Profile Industry Alignment (line 421-426)

**Issue**: Story P2 proposes to "Add industry_subtype field to Company" but this field **already exists**.

**Existing Company.js (lines 51-56)**:
```javascript
// Sprint 10 Epic S/K: Industry subtype for more specific targeting
industry_subtype: {
  type: String,
  index: true,
  description: 'Specific subtype within the industry (e.g., legacy_succession for financial_services)'
}
```

**Fix Required**:
- Remove P2 from Sprint 12 (-3 pts)
- OR Rename P2 to "Add industry_subtype validation" if validation is missing
- Update Sprint 12 total from 72 to 69 pts

---

### C3: Sprint 10 Folder Status Mismatch (CRITICAL)

**Location**: Sprint 10 folder name vs Master Plan status

**Issue**:
- Folder: `SPRINT-10 (Complete)`
- Master Plan: `**Status**: PLANNING`

**Fix Required**:
Update Sprint 10 Master Plan line 8:
```markdown
**Status**: COMPLETE
```

---

### C4: Epic J Ownership Conflict (CRITICAL)

**Location**: Sprint 10 + Sprint 11 Master Plans

**Issue**: Ambiguous ownership of Epic J (Assessment Credibility, 28 pts)

- Sprint 10 Master Plan (line 89): "Epic J | 28 | Sprint 11 | Allows Epic K expansion"
- Sprint 11 Master Plan (line 219): References `EPIC-J-ASSESSMENT-CREDIBILITY.md` in `SPRINT-10 (Complete)` folder
- Epic J file actually lives in: `SPRINT-10 (Complete)/EPIC-J-ASSESSMENT-CREDIBILITY.md`

**Fix Required**:
1. Move `EPIC-J-ASSESSMENT-CREDIBILITY.md` from `SPRINT-10 (Complete)` to `SPRINT-11 (Planned)`
2. Update Sprint 11 reference to: `[EPIC-J-ASSESSMENT-CREDIBILITY.md](./EPIC-J-ASSESSMENT-CREDIBILITY.md)`

---

## HIGH Issues

### H1: Sprint 12 Epic O - Hardcoded Block Metric Mappings

**Location**: Sprint 12 Master Plan, O1: TargetCalculatorService (lines 318-325)

**Issue**: Hardcoded block-to-metric mappings that should reference existing config.

**Spec (HARDCODED)**:
```javascript
const blockMetricMappings = {
  client_acquisition: ['new_clients_per_month', 'lead_conversion_rate'],
  sales_velocity: ['average_deal_cycle_days', 'proposals_to_close_ratio'],
  client_retention: ['client_retention_rate', 'client_satisfaction_score'],
  financial_stability: ['revenue_growth_rate', 'profit_margin'],
  // ... more mappings
};
```

**Fix Required**:
1. Create `server/config/block-metric-mappings.js` as single source of truth
2. Update TargetCalculatorService to import from config
3. Use correct block names (delivery, decisions, etc.)

---

### H2: Sprint 12 Epic N5 - AIContextService Methods Don't Exist

**Location**: Sprint 12 Master Plan, N5: AIContextService Block Integration (lines 192-227)

**Issue**: Spec references methods that don't exist in current AIContextService.js:
- `getOKRGenerationContext()` - doesn't exist
- `identifyWeakBlocks()` - doesn't exist
- `calculateBlockPriorities()` - doesn't exist

**Current AIContextService.js Methods** (verified):
- `buildObjectiveContext()`
- `getCompanyProfile()`
- `getLatestSSIScores()`
- `getActiveObjectives()`
- `getTeamStructure()`
- `getActiveUsers()`
- `extractBusinessContext()`
- `identifyRiskIndicators()`

**Fix Required**:
1. Sprint 12 N5 should explicitly state these are NEW methods to implement
2. OR create separate story for AIContextService refactor
3. Document dependency: N5 depends on N1-N4 completion

---

### H3: Sprint 11 Epic L - AIContextService.getWeeklyGoalContext() Doesn't Exist

**Location**: Sprint 11 Master Plan, AIContextService Usage section (lines 419-428)

**Issue**: Spec references method that doesn't exist:
```javascript
// Epic L (Planning) uses:
AIContextService.getWeeklyGoalContext(companyId, keyResultId, weekNumber)
```

**Fix Required**:
Add explicit story to create this method, or note it's a new implementation requirement within L5.

---

### H4: Sprint 10 Epic S2 - Hardcoded Industry Presets

**Location**: Sprint 10 Master Plan, Story S2: SSI Weights with Industry Presets (lines 199-204)

**Issue**: Hardcoded preset values instead of referencing config:
```
| Industry | Subtype | Speed | Strength | Intelligence |
|----------|---------|-------|----------|--------------|
| Financial Services | Legacy Succession | 30% | 40% | 30% |
| Technology | SaaS | 45% | 25% | 30% |
| Healthcare | Clinical | 25% | 35% | 40% |
| *Default* | *Any* | 33% | 33% | 34% |
```

**Existing Config**: `server/config/industry-presets.js` exists

**Fix Required**:
1. Reference industry-presets.js as source of truth
2. Remove hardcoded table from spec
3. Note: "Presets loaded from `server/config/industry-presets.js`"

---

### H5: Sprint 12 Epic O - Hardcoded Improvement Ranges

**Location**: Sprint 12 Master Plan, O1: TargetCalculatorService (lines 273-278)

**Issue**: Hardcoded improvement multipliers:
```javascript
const improvementRanges = {
  getting_started: { min: 0.05, max: 0.15 },
  developing: { min: 0.10, max: 0.25 },
  advanced: { min: 0.15, max: 0.35 },
  optimized: { min: 0.05, max: 0.15 }
};
```

**Fix Required**:
1. Move to `server/config/target-calculation.js`
2. Allow industry-specific overrides
3. TargetCalculatorService imports from config

---

## MEDIUM Issues

### M1: Sprint 12 Epic N - Missing Reference to Existing ssi_result Field

**Location**: Sprint 12 Master Plan, Epic N (line 148-154)

**Issue**: Assessment.js already has `ssi_result` field with dimension/block structure. Sprint 12 N1 may be partially redundant.

**Existing Assessment.js**:
```javascript
ssi_result: {
  dimensions: {...},
  blocks: {...},  // 12-block structure exists
  statistics: {...}
}
```

**Fix Required**:
Review if N1 needs to add `detailed_block_scores` or can extend existing `ssi_result.blocks`.

---

### M2: Sprint 11 Epic QA - Response Type "effectiveness" Not in AssessmentQuestion Model

**Location**: Sprint 11 EPIC-QA-QUESTION-ANSWER-CREDIBILITY.md, responseTypes.js spec

**Issue**: Epic QA defines 7 response types including `effectiveness`, but AssessmentQuestion model only has 6:
```javascript
response_type: {
  enum: ['percentage', 'time_short', 'time_long', 'frequency', 'maturity', 'perception']
}
```

Missing: `effectiveness`

**Fix Required**:
Add `effectiveness` to AssessmentQuestion.response_type enum, or map it to `perception` in validation.

---

### M3: Sprint 12 Epic Q - Deferred Items Missing Future Sprint Assignment

**Location**: Sprint 12 Master Plan, Epic Q Deferred section (lines 473-486)

**Issue**: 23 pts of deferred items have no assigned sprint:
- Q3-Q9, Q11 all marked "DEFERRED" with no target sprint

**Fix Required**:
Create placeholder in Sprint 14 or Sprint 15 for deferred LLM improvements.

---

### M4: Sprint 10/11/12 - Inconsistent Date Service References

**Issue**: Some specs reference DateService methods that may not exist:
- `DateService.getQuarterForDate(date, objectiveId)` - second param?
- `DateService.getQuarterDates(year, quarter, objectiveId)` - third param?

**Current DateService.js signature** needs verification.

**Fix Required**:
Verify DateService method signatures match spec references.

---

### M5: Sprint 13 - Archived Epics Still in Document

**Location**: Sprint 13 Master Plan (lines 460-623)

**Issue**: Contains extensive "ARCHIVED" sections for Epics D, O, P that were moved to Sprint 11. This adds 160+ lines of stale content.

**Fix Required**:
Remove archived sections or collapse to single reference line each.

---

### M6: Sprint 11 Epic J - Story References May Be Stale

**Location**: Sprint 11 Master Plan, Epic J section (line 217)

**Issue**: References external file that may have old story definitions:
```markdown
**Moved from Sprint 10** - See [EPIC-J-ASSESSMENT-CREDIBILITY.md](../SPRINT-10%20(Complete)/EPIC-J-ASSESSMENT-CREDIBILITY.md)
```

**Fix Required**:
Verify Epic J spec file is up-to-date with current requirements.

---

## Redundancy Summary

| Item | Sprint | Status | Action |
|------|--------|--------|--------|
| `industry_subtype` field | 12 (P2) | Already exists in Company.js | Remove P2 or repurpose |
| 12-block structure | 12 (N1) | Partially exists in Assessment.ssi_result.blocks | Clarify scope |
| Industry presets | 10 (S2) | Exists in industry-presets.js | Reference config |
| ssi_config | 10 (S2) | Already exists in Company.js | Verify not duplicating |

---

## Alignment Issues Summary

| Issue | Sprint | Conflict With |
|-------|--------|---------------|
| Block names | 12 (N1) | AssessmentQuestion.category enum |
| AIContextService methods | 11 (L5), 12 (N5) | Current service implementation |
| Response type enum | 11 (QA) | AssessmentQuestion.response_type |
| Epic J ownership | 10, 11 | File location vs sprint assignment |
| Status field | 10 | Folder name vs document status |

---

## Recommended Fixes by Priority

### Immediate (Before Sprint 11 Start)

1. **Fix Sprint 12 N1 block names** - Use existing enum values
2. **Move Epic J spec file** - From Sprint 10 to Sprint 11 folder
3. **Update Sprint 10 status** - Change to COMPLETE
4. **Remove/repurpose Sprint 12 P2** - industry_subtype already exists

### Before Sprint 12 Start

5. **Create config files**:
   - `server/config/block-metric-mappings.js`
   - `server/config/target-calculation.js`
6. **Add `effectiveness` to response_type enum**
7. **Document AIContextService new methods** explicitly

### Cleanup Tasks

8. **Remove Sprint 13 archived sections**
9. **Assign deferred Q3-Q11 to future sprint**
10. **Verify DateService signatures**

---

## Files to Update

| File | Changes |
|------|---------|
| `SPRINT-10-MASTER-PLAN.md` | Update Status to COMPLETE |
| `SPRINT-11-MASTER-PLAN.md` | Fix Epic J reference path |
| `SPRINT-12-MASTER-PLAN.md` | Fix block names (N1), remove P2, add config references |
| `SPRINT-13-MASTER-PLAN.md` | Remove archived sections |
| `server/models/AssessmentQuestion.js` | Add `effectiveness` to response_type enum |
| `EPIC-J-ASSESSMENT-CREDIBILITY.md` | Move to Sprint 11 folder |

---

## Verification Checklist

Before implementation, verify:

- [ ] All block names match AssessmentQuestion.category enum
- [ ] All service methods referenced actually exist (or are marked as NEW)
- [ ] All config references point to existing files
- [ ] No duplicate field definitions across sprints
- [ ] Sprint folder names match document status
- [ ] Epic ownership is clear and consistent
- [ ] Deferred items have future sprint assignment

---

**Audit Completed**: January 20, 2026
**Next Review**: Before Sprint 11 implementation start
