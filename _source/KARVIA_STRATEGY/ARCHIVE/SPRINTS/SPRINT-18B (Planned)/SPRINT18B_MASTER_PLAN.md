# Sprint 18-B Master Plan: SSIModule (Simplified)

**Sprint**: 18-B
**Duration**: 1 week
**Total Points**: 30 pts
**Status**: PLANNED
**Created**: March 11, 2026

---

## Problem

Same company shows different SSI scores in different views.

| View | Speed | Strength | Intelligence |
|------|-------|----------|--------------|
| Company Overview | 8.6 | 5.4 | 7.1 |
| SSI Diagnostic | 6.0 | 4.1 | 6.4 |

**Root Cause**: Multiple services + 4-tier fallback mixing scales.

---

## Solution

**One module, 3 files, 3 methods.**

```
server/services/SSIModule/
├── index.js        # Entry + getSSI()
├── calculator.js   # calculate() - single algorithm
└── constants.js    # Blocks, thresholds
```

---

## API

```javascript
const SSI = require('./services/SSIModule');

// Calculate (assessment submission)
const result = SSI.calculate(responses, questions);

// Query (any level)
const ssi = await SSI.getSSI(companyId, {
  level: 'user' | 'team' | 'company',
  id: entityId,                    // userId or teamId
  includeAnonymous: false,         // for company level
  filters: { role, department }    // optional
});

// Legacy (backward compat)
const legacy = SSI.toLegacy(result);
```

---

## Stories

| ID | Story | Points |
|----|-------|--------|
| S1 | Create SSIModule structure + constants.js | 3 |
| S2 | Migrate calculation to calculator.js | 5 |
| S3 | Implement getSSI (user/team/company) | 5 |
| S4 | Add toLegacy/fromLegacy | 3 |
| S5 | Migrate assessments.js routes | 6 |
| S6 | Migrate analytics.js + diagnostic-reports.js | 4 |
| S7 | Tests | 3 |
| S8 | Add indexes to Assessment model | 1 |
| **Total** | | **30** |

---

## Implementation

### constants.js

```javascript
module.exports = {
  BLOCKS: {
    speed: ['delivery', 'decisions', 'change', 'response'],
    strength: ['financial', 'operations', 'people', 'quality'],
    intelligence: ['market', 'data', 'strategy', 'learning']
  },

  THRESHOLDS: { alert: 5.0, watch: 7.0 },

  DIMENSION_WEIGHTS: { speed: 0.34, strength: 0.33, intelligence: 0.33 },

  ROLE_WEIGHTS: {
    BUSINESS_OWNER: 1.5, EXECUTIVE: 1.3, MANAGER: 1.2, EMPLOYEE: 1.0
  }
};
```

### calculator.js

```javascript
// Migrate from UnifiedSSIScoringService.js
// ~200 lines - single algorithm, 12-block MECE

function calculate(responses, questions) {
  // Calculate blocks → dimensions → overall
  // Return unified ssi_result structure
}

module.exports = { calculate };
```

### index.js

```javascript
const { calculate } = require('./calculator');
const { ROLE_WEIGHTS } = require('./constants');

async function getSSI(companyId, options = {}) {
  const { level = 'company', id, includeAnonymous = false, filters = {} } = options;

  // Build query
  const query = { company_id: companyId, status: 'completed' };

  if (level === 'user') {
    query.user_id = id;
  } else if (level === 'team') {
    const team = await Team.findById(id);
    query.user_id = { $in: team.members };
  }

  if (!includeAnonymous) {
    query.is_anonymous = { $ne: true };
  }

  // Get assessments
  const assessments = await Assessment.find(query)
    .populate('user_id', 'role');

  if (assessments.length === 0) {
    return { status: 'no_data' };
  }

  // Single assessment = return directly
  if (level === 'user' || assessments.length === 1) {
    return assessments[0].ssi_result;
  }

  // Aggregate with role weights
  return aggregate(assessments);
}

function aggregate(assessments) {
  let totalWeight = 0;
  const sums = { speed: 0, strength: 0, intelligence: 0, overall: 0 };

  for (const a of assessments) {
    const weight = ROLE_WEIGHTS[a.user_id?.role] || 1.0;
    totalWeight += weight;
    sums.speed += a.ssi_result.dimensions.speed.score * weight;
    sums.strength += a.ssi_result.dimensions.strength.score * weight;
    sums.intelligence += a.ssi_result.dimensions.intelligence.score * weight;
    sums.overall += a.ssi_result.overall.score * weight;
  }

  return {
    overall: { score: sums.overall / totalWeight },
    dimensions: {
      speed: { score: sums.speed / totalWeight },
      strength: { score: sums.strength / totalWeight },
      intelligence: { score: sums.intelligence / totalWeight }
    },
    aggregation: { count: assessments.length, method: 'role_weighted' }
  };
}

function toLegacy(ssiResult) {
  return {
    ssi_scores: {
      speed: { score: Math.round(ssiResult.dimensions.speed.score * 10) },
      strength: { score: Math.round(ssiResult.dimensions.strength.score * 10) },
      intelligence: { score: Math.round(ssiResult.dimensions.intelligence.score * 10) },
      overall: { score: Math.round(ssiResult.overall.score * 10) }
    }
  };
}

module.exports = { calculate, getSSI, toLegacy };
```

---

## Route Migration

### Before

```javascript
// 4-tier fallback chaos
const score = assessment.ssi_result?.dimensions?.speed?.score ||
              assessment.dimension_scores?.speed?.raw_score ||
              (assessment.dimension_scores?.speed?.score / 10) ||
              (assessment.ssi_scores?.speed?.score / 10);
```

### After

```javascript
const SSI = require('../services/SSIModule');

// Just use ssi_result
const ssi = await SSI.getSSI(companyId, { level: 'team', id: teamId });
res.json({ success: true, data: ssi });
```

---

## Schedule

| Day | Work | Points |
|-----|------|--------|
| 1 | S1 + S2 (structure + calculator) | 8 |
| 2 | S3 (getSSI) | 5 |
| 3 | S4 + S5 (legacy + assessments.js) | 9 |
| 4 | S6 (analytics + diagnostic) | 4 |
| 5 | S7 + S8 (tests + indexes) | 4 |

---

## Files

### Create (3)

- `server/services/SSIModule/index.js`
- `server/services/SSIModule/calculator.js`
- `server/services/SSIModule/constants.js`

### Modify (3)

- `server/routes/assessments.js` - use SSIModule
- `server/routes/analytics.js` - use SSIModule
- `server/routes/diagnostic-reports.js` - use SSIModule

### Deprecate (2)

- `server/services/SSIScoringService.js` - add deprecation notice
- `server/services/diagnostic/DiagnosticSSIScoringService.js` - delete

---

## Success Criteria

- [ ] Same score shown everywhere
- [ ] No more 4-tier fallback
- [ ] Tests pass
- [ ] Legacy endpoints still work

---

**Document Version**: 2.0.0 (Simplified)
**Last Updated**: March 11, 2026
