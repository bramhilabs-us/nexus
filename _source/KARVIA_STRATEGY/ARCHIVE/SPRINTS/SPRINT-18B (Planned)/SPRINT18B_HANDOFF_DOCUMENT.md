# Sprint 18-B Handoff Document

**Sprint**: 18-B - SSIModule (Simplified)
**Duration**: 1 week
**Points**: 30 pts
**Status**: PLANNED

---

## Summary

| Before | After |
|--------|-------|
| 3 scoring services | 1 module |
| 4-tier fallback | Single source |
| 15 files planned | 3 files |
| 73 pts / 2 weeks | 30 pts / 1 week |

---

## Structure

```
server/services/SSIModule/
├── index.js        # getSSI(), toLegacy()
├── calculator.js   # calculate()
└── constants.js    # BLOCKS, THRESHOLDS, WEIGHTS
```

---

## API

```javascript
const SSI = require('./services/SSIModule');

// Calculate
SSI.calculate(responses, questions);

// Query
SSI.getSSI(companyId, { level: 'user'|'team'|'company', id });

// Legacy
SSI.toLegacy(result);
```

---

## Stories

| Story | Points | Status |
|-------|--------|--------|
| S1: Structure + constants | 3 | PENDING |
| S2: Calculator | 5 | PENDING |
| S3: getSSI | 5 | PENDING |
| S4: Legacy adapter | 3 | PENDING |
| S5: Migrate assessments.js | 6 | PENDING |
| S6: Migrate other routes | 4 | PENDING |
| S7: Tests | 3 | PENDING |
| S8: Indexes | 1 | PENDING |

---

## Start Here

1. Create `server/services/SSIModule/` folder
2. Create `constants.js` with blocks, thresholds, weights
3. Migrate calculation from `UnifiedSSIScoringService.js`

---

**Version**: 2.0.0 (Simplified)
