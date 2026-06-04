# Sprint 15-A: LLM Context Intelligence - Test Plan

**Sprint**: 15-A
**Date**: March 6, 2026
**Total Test Cases**: 47
**Estimated Duration**: 4 hours

---

## Test Strategy

### Objectives
1. Verify AIContextService integration with aiOKRService
2. Validate context completeness (all fields populated)
3. Confirm prompt includes personalized data
4. Test deduplication of existing objectives
5. Verify rejection history learning
6. Validate logging and debugging capabilities

### Test Levels
1. **Unit Tests** (20 tests) - Automated
2. **Integration Tests** (12 tests) - Automated
3. **Manual E2E Tests** (10 tests) - Manual with screenshots
4. **Debug Validation** (5 tests) - Manual API checks

---

## Unit Tests (20 tests)

### Test Suite: aiOKRService.context.test.js

#### Context Building Tests

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| UT-01 | `buildContext()` calls AIContextService | `aiContextService.buildContext` is called with correct params |
| UT-02 | Context includes company profile | `context.company.description` is defined |
| UT-03 | Context includes business model | `context.company.business_model` is defined |
| UT-04 | Context includes value proposition | `context.company.value_proposition` is defined |
| UT-05 | Context includes strategic vision | `context.business.strategic_vision.priority_one` is defined |
| UT-06 | Context includes business metrics | `context.business.metrics` has keys |
| UT-07 | Context includes risk indicators | `context.business.risk_indicators` is array |
| UT-08 | Context includes 12-block SSI | `context.ssi.priorityBlocks.length > 0` |
| UT-09 | Context includes existing objectives | `context.objectives.list` is array |
| UT-10 | Context includes rejection history | `context.rejections.avoidanceGuidance` is array |

#### Prompt Building Tests

| ID | Test Case | Expected Result |
|----|-----------|-----------------|
| UT-11 | Prompt contains COMPANY PROFILE section | `prompt.includes('COMPANY PROFILE')` |
| UT-12 | Prompt contains company description | `prompt.includes(context.company.description)` |
| UT-13 | Prompt contains STRATEGIC VISION section | `prompt.includes('STRATEGIC VISION')` |
| UT-14 | Prompt contains strategic priorities | `prompt.includes('Priority 1')` |
| UT-15 | Prompt contains SSI scores | `prompt.includes('SSI ASSESSMENT')` |
| UT-16 | Prompt contains priority blocks | `prompt.includes('Priority Blocks')` |
| UT-17 | Prompt contains EXISTING OBJECTIVES | `prompt.includes('EXISTING OBJECTIVES')` |
| UT-18 | Prompt contains AVOIDANCE GUIDANCE | `prompt.includes('AVOIDANCE GUIDANCE')` |
| UT-19 | Prompt respects token limit | `prompt.length < 15000` chars |
| UT-20 | Prompt handles missing fields gracefully | No undefined values in prompt |

---

## Integration Tests (12 tests)

### Test Suite: aiOKRService.integration.test.js

#### Full Flow Tests

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| IT-01 | Generate OKRs with full company profile | 1. Create company with profile 2. Generate OKRs | Objectives reference company context |
| IT-02 | Generate OKRs with strategic vision | 1. Set strategic vision 2. Generate OKRs | Objectives align with priorities |
| IT-03 | Generate OKRs avoids existing objectives | 1. Create objective 2. Generate OKRs | No duplicate titles |
| IT-04 | Generate OKRs learns from rejections | 1. Reject an objective 2. Generate OKRs | Avoids similar patterns |
| IT-05 | Generate OKRs with 12-block SSI | 1. Complete assessment 2. Generate OKRs | Focus on low-scoring blocks |
| IT-06 | Generate OKRs with risk indicators | 1. Set metrics with risks 2. Generate OKRs | Addresses risk areas |

#### Context Service Integration

| ID | Test Case | Steps | Expected Result |
|----|-----------|-------|-----------------|
| IT-07 | AIContextService.buildContext called | 1. Mock AIContextService 2. Generate OKRs | buildContext called with correct scope |
| IT-08 | Context includes all layers | 1. Generate OKRs 2. Check logs | All context layers logged |
| IT-09 | Token budget respected | 1. Generate OKRs with large context 2. Check metadata | tokensUsed < MAX_TOKENS |
| IT-10 | Fallback when OpenAI fails | 1. Mock OpenAI error 2. Generate OKRs | Template-based objectives generated |
| IT-11 | Context delta included | 1. Make changes 2. Generate OKRs | Delta changes in context |
| IT-12 | Task history patterns included | 1. Complete tasks 2. Generate OKRs | Task patterns in context |

---

## Manual E2E Tests (10 tests)

### Prerequisites
- Test company with filled company profile
- Test company with strategic vision
- Test company with existing objectives
- Test company with rejection history

### Test Scenarios

| ID | Scenario | Steps | Expected Result | Pass/Fail |
|----|----------|-------|-----------------|-----------|
| E2E-01 | Generate OKRs - Full Context | 1. Login as consultant 2. Select company with full profile 3. Navigate to Objectives 4. Click "Generate with AI" 5. Review generated objectives | Objectives mention company description, business model, align with strategic vision | |
| E2E-02 | Generate OKRs - No Company Profile | 1. Use company without profile 2. Generate OKRs | Objectives are still generated, but more generic | |
| E2E-03 | Generate OKRs - With Existing Objectives | 1. Create 2 manual objectives 2. Generate OKRs | No duplicates of existing objective titles | |
| E2E-04 | Generate OKRs - SSI Focus | 1. Complete assessment with low Operations score 2. Generate OKRs | At least one objective targets Operations improvement | |
| E2E-05 | Reject and Regenerate | 1. Generate OKRs 2. Dismiss all as "too generic" 3. Regenerate | New objectives avoid "too generic" pattern | |
| E2E-06 | Check Context Logs | 1. Generate OKRs 2. Check server logs | Logs show context fields populated | |
| E2E-07 | Debug Endpoint | 1. Call GET /api/ai-okr/debug-context/:companyId 2. Inspect response | Response shows all context layers | |
| E2E-08 | Objectives Page Display | 1. Generate OKRs 2. View on Objectives page | Objectives display correctly in UI | |
| E2E-09 | Multiple Company Test | 1. Generate for Company A 2. Generate for Company B | Each gets personalized objectives | |
| E2E-10 | Template Fallback | 1. Disable OpenAI (env var) 2. Generate OKRs | Template objectives generated (verify in logs) | |

---

## Debug Validation Tests (5 tests)

### API Tests (Use curl or Postman)

| ID | Endpoint | Test | Expected |
|----|----------|------|----------|
| DV-01 | `GET /api/ai-okr/debug-context/:companyId` | Check company context | Returns full company profile |
| DV-02 | `GET /api/ai-okr/debug-context/:companyId` | Check SSI context | Returns 12-block scores |
| DV-03 | `GET /api/ai-okr/debug-context/:companyId` | Check objectives context | Returns existing objectives list |
| DV-04 | `GET /api/ai-okr/debug-context/:companyId` | Check rejections context | Returns rejection history |
| DV-05 | `GET /api/ai-okr/debug-context/:companyId` | Check metadata | Returns token count, scope |

---

## Test Data Requirements

### Test Company A (Full Profile)
```json
{
  "name": "Wealth Partners Advisory",
  "industry": "financial_services",
  "employee_count": 45,
  "business_context": {
    "profile": {
      "description": "Boutique wealth management firm serving high-net-worth individuals and families in the Pacific Northwest",
      "business_model": "Fee-based advisory with AUM-based pricing",
      "value_proposition": "Personalized multi-generational wealth planning with dedicated advisor relationships",
      "client_profile": "High-net-worth individuals ($1M+ investable assets), family offices, business owners"
    },
    "strategic_vision": {
      "priority_one": "Grow AUM to $500M by 2027 through referral network expansion",
      "priority_two": "Implement next-generation client engagement to retain wealth transitions",
      "priority_three": "Achieve operational excellence through technology modernization"
    },
    "metrics": {
      "current_aum": 380000000,
      "client_count": 120,
      "retention_rate": 94,
      "nps_score": 72
    },
    "targets": {
      "target_aum": 500000000,
      "target_retention": 96,
      "target_nps": 80
    }
  }
}
```

### Test Company B (Minimal Profile)
```json
{
  "name": "Acme Consulting",
  "industry": "consulting",
  "employee_count": 25,
  "business_context": {}
}
```

---

## Context Validation Checklist

When running tests, verify the following context fields are populated:

### Company Profile
- [ ] `company.name`
- [ ] `company.industry`
- [ ] `company.industry_label`
- [ ] `company.size_category`
- [ ] `company.description`
- [ ] `company.business_model`
- [ ] `company.value_proposition`
- [ ] `company.client_profile`

### Business Context
- [ ] `business.metrics` (object with keys)
- [ ] `business.targets` (object with keys)
- [ ] `business.strategic_vision.priority_one`
- [ ] `business.strategic_vision.priority_two`
- [ ] `business.strategic_vision.priority_three`
- [ ] `business.risk_indicators` (array)

### SSI Context
- [ ] `ssi.dimensions.speed`
- [ ] `ssi.dimensions.strength`
- [ ] `ssi.dimensions.intelligence`
- [ ] `ssi.composite`
- [ ] `ssi.priorityBlocks` (array, length > 0)
- [ ] `ssi.has12BlockData` (true)

### Objectives Context
- [ ] `objectives.total`
- [ ] `objectives.list` (array)
- [ ] `objectives.gaps` (array)

### Rejections Context
- [ ] `rejections.total`
- [ ] `rejections.avoidanceGuidance` (array)

### Metadata
- [ ] `metadata.tokensUsed`
- [ ] `metadata.scope`
- [ ] `metadata.completeness`

---

## Logging Validation

### Required Log Entries

When generating OKRs, these log entries should appear:

```
[AIContextService] Building context for company X, scope: okr
[AIContextService] Fetching full SSI scores for company X
[AIContextService] Full SSI scores: Speed=X, Strength=Y, Intelligence=Z, 12-block=true
[AIContextService] Context built: scope=okr, tokens=XXXX/8000, delta=N changes

[AI OKR] Context built: {
    hasCompanyProfile: true,
    hasStrategicVision: true,
    hasMetrics: 4,
    hasTargets: 3,
    riskIndicators: 2,
    existingObjectives: 3,
    gaps: 2,
    ssiComposite: 6.5,
    priorityBlocks: 3,
    rejectionCount: 5,
    tokensUsed: 3200
}

[AI OKR] Calling OpenAI API...
[AI OKR] Generated 4 objectives in XXXms
```

---

## Acceptance Criteria

### Must Pass
- [ ] All 20 unit tests pass
- [ ] All 12 integration tests pass
- [ ] At least 8/10 E2E tests pass
- [ ] All 5 debug validation tests pass

### Quality Gates
- [ ] Generated objectives reference company description when available
- [ ] Generated objectives align with strategic priorities
- [ ] No duplicate objectives when existing ones present
- [ ] Context logging shows all fields populated
- [ ] Token usage stays under 8000 limit

---

## Test Execution Order

1. **Unit Tests** - Run first (`npm run test:unit -- --grep aiOKRService`)
2. **Integration Tests** - Run second (`npm run test:integration -- --grep aiOKRService`)
3. **Debug Validation** - Run API tests with curl
4. **E2E Tests** - Run manually with screenshots

---

## Defect Categories

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Blocks OKR generation | Context throws error |
| High | Objectives are generic | Company profile not in prompt |
| Medium | Missing context field | Risk indicators not included |
| Low | Cosmetic/logging | Log format incorrect |

---

**Document Version**: 1.0
**Created**: March 6, 2026
**Author**: Claude Code

