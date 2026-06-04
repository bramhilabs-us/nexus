# OKR Generation Output Analysis

**Date**: March 11, 2026
**Company**: KARVIA Consulting
**Industry**: consulting

---

## Generated OKRs (4 new)

### Objective 1: "Accelerate AI Advisory Revenue to Drive Sustainable Growth"
**Category**: innovation | **Priority**: high

| Q | Key Result | Current | Target |
|---|------------|---------|--------|
| Q1 | Increase AI advisory revenue from 25% to 30% of total revenue | 25% | 30% |
| Q2 | Increase AI advisory revenue from 30% to 35% of total revenue | 30% | 35% |
| Q3 | Increase AI advisory revenue from 35% to 38% of total revenue | 35% | 38% |
| Q4 | Increase AI advisory revenue from 38% to 40% of total revenue | 38% | 40% |

**Analysis**:
- Uses strategic priority from company profile ("Scale recurring AI advisory revenue to 40%")
- Proper baseline progression (25%→40%)
- Correctly uses "from X to Y" format
- **RATING**: 9/10

---

### Objective 2: "Enhance Delivery Speed with Standardized Implementation Playbooks"
**Category**: operations | **Priority**: medium

| Q | Key Result | Current | Target |
|---|------------|---------|--------|
| Q1 | Reduce project delivery time by 10% from baseline | 0% | 10% |
| Q2 | Implement standardized playbooks in 50% of projects | 0% | 50% |
| Q3 | Increase project completion rate on time from 80% to 90% | 80% | 90% |
| Q4 | Achieve 95% adherence to standardized playbooks in all projects | 0% | 95% |

**Analysis**:
- Q1/Q2/Q4: Missing proper baselines (starts from 0)
- Q3: Has proper baseline (80%→90%)
- Flagged by system as "generic" - doesn't reference company/industry
- Addresses delivery block (5.3 in test model)
- **RATING**: 6/10

---

### Objective 3: "Strengthen Client Relationships for Higher Retention"
**Category**: people_culture | **Priority**: medium

| Q | Key Result | Current | Target |
|---|------------|---------|--------|
| Q1 | Increase client retention rate from 88% to 89% | 88% | 89% |
| Q2 | Increase client retention rate from 89% to 90% | 89% | 90% |
| Q3 | Increase client retention rate from 90% to 91% | 90% | 91% |
| Q4 | Increase client retention rate from 91% to 92% | 91% | 92% |

**Analysis**:
- Uses correct baseline from company profile (88%)
- Matches target from company profile (92%)
- Proper "from X to Y" format
- **ISSUE**: Very incremental (1% per quarter) - too conservative?
- All 4 KRs measure the same metric (lacks diversity)
- **RATING**: 7/10

---

### Objective 4: "Cultivate Innovation through Productized AI Services"
**Category**: operations | **Priority**: medium

| Q | Key Result | Current | Target |
|---|------------|---------|--------|
| Q1 | Launch 1 new productized AI service offering | 0 | 1 |
| Q2 | Achieve 10% of total revenue from new AI services | 0% | 10% |
| Q3 | Expand new AI services to 20% of existing clients | 0% | 20% |
| Q4 | Achieve 15% market penetration with new AI services | 0% | 15% |

**Analysis**:
- All KRs start from 0 (no baselines)
- Category is "operations" but should be "innovation"
- Q4 target (15%) is lower than Q3 (20%) - illogical progression
- **RATING**: 5/10

---

## Comparison: Expected vs. Generated

| Test Model Expected | Generated | Match |
|---------------------|-----------|-------|
| Obj 1: Growth - Revenue $6.8M→$7.2M | Not generated | ❌ |
| Obj 2: Operations - Delivery SSI 5.3→6.1 | "Enhance Delivery Speed..." | ~60% |
| Obj 3: Innovation - Data SSI 5.2→6.2, Strategy 5.0→6.3 | "Cultivate Innovation..." | ~40% |
| Obj 4: People - Retention 88%→90% | "Strengthen Client Relationships..." | ✅ 80% |

### Missing From Generated OKRs:
1. **Revenue growth objective** (from $6.8M to $8.2M)
2. **Top-5 client concentration** (43%→35%)
3. **Clients per advisor** (7→8.5)
4. **SSI block improvement KRs** (delivery 5.3→6.1, etc.)

---

## Prompt Issues Identified

### Issue 1: Industry Expertise Missing
The prompt uses `default` fallback because `consulting` is not in `industryExpertise`:
```javascript
'default': {
  context: 'small-medium business operations',
  metrics: ['revenue growth', 'customer satisfaction', 'employee retention', 'operational efficiency']
}
```

**Impact**: AI doesn't know consulting-specific metrics like:
- Utilization rate
- Clients per advisor
- Project on-time delivery
- Recurring revenue %

### Issue 2: SSI Block Scores Not Used
The test model has 12-block scores but they weren't passed to the API. The endpoint auto-fetched SSI but may not have found complete data.

### Issue 3: Baseline Metrics Partially Used
- Client retention (88%) ✅ used
- Revenue ($6.8M) ❌ not used in KRs
- Top-5 concentration (43%) ❌ not used
- Clients per advisor (7) ❌ not used

### Issue 4: KR Diversity Low
- Objective 3 has 4 KRs all measuring the same metric (retention %)
- Should have diverse KRs attacking objective from different angles

---

## Recommendations

### 1. Add Consulting Industry Expertise (P1)
```javascript
'consulting': {
  context: 'strategy consulting, professional services, or advisory',
  metrics: [
    'utilization rate',
    'clients per advisor',
    'project on-time delivery',
    'recurring revenue %',
    'client retention',
    'revenue per consultant'
  ],
  weak_block_actions: {
    'delivery': 'Standardize delivery playbooks',
    'operations': 'Create repeatable engagement templates',
    'strategy': 'Implement client roadmap frameworks'
  }
}
```

### 2. Enforce KR Diversity in Prompt (P1)
Add to system prompt:
```
IMPORTANT: Each objective's 4 Key Results must measure DIFFERENT aspects.
BAD: All 4 KRs measure client retention %
GOOD: KR1=retention, KR2=NPS, KR3=referrals, KR4=tenure
```

### 3. Use Absolute Numbers in Financial KRs (P2)
Change prompt guidance:
```
For financial metrics, use absolute numbers not just percentages:
- "Increase revenue from $6.8M to $7.2M" (not "increase revenue 6%")
- "Grow AUM from $200M to $250M" (not "grow AUM 25%")
```

### 4. Pass SSI 12-Block Scores Explicitly (P2)
The test payload should include SSI scores to ensure they're used:
```json
{
  "company_id": "...",
  "overall_scores": {
    "speed": 5.8,
    "strength": 6.2,
    "intelligence": 5.4
  },
  "block_scores": {
    "delivery": 5.3,
    "strategy": 5.0,
    "market": 5.1,
    "data": 5.2
  }
}
```

---

## Quality Summary

| Metric | Score |
|--------|-------|
| Strategic Alignment | 8/10 (used #1 priority) |
| Baseline Usage | 5/10 (partial) |
| KR Diversity | 4/10 (repetitive) |
| Industry Relevance | 5/10 (generic terms) |
| SSI Targeting | 3/10 (blocks not used) |
| **Overall** | **5/10** |
