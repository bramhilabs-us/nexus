# Sprint 18-A Master Plan

**Sprint**: 18-A (Hotfix)
**Focus**: SSI Scoring Unification - Diagnostic Engine Integration
**Created**: March 10, 2026
**Status**: PLANNED
**Priority**: HIGH (Data Integrity Issue)

---

## Executive Summary

### The Problem

**Company Overview and SSI Diagnostic Report show different scores for the same company.**

| Metric | Company Overview | SSI Diagnostic Report |
|--------|------------------|----------------------|
| Speed | 8.6 | 6.0 |
| Strength | 5.4 | 4.1 |
| Intelligence | 7.1 | 6.4 |
| Composite | 7.0 | 5.5 |

This creates a **trust crisis** - users seeing conflicting data in different views undermines confidence in the entire platform.

### Root Cause

Two completely different calculation methods:

1. **Company Overview** (`/api/assessments/company/:id/team-breakdown`)
   - Simple averaging of dimension scores
   - Supports 4 legacy data formats
   - Formula: `(Speed + Strength + Intelligence) / 3`

2. **SSI Diagnostic Report** (`/api/diagnostic/ssi/:id`)
   - Block-level MECE scoring → Dimension aggregation
   - Industry-weighted composite calculation
   - Only recognizes `ssi_result` format
   - Formula: `Speed×0.34 + Strength×0.33 + Intelligence×0.33`

### Solution

Unify Company Overview to use the DiagnosticEngine as the single source of truth for all SSI scores.

---

## Sprint Metrics

| Metric | Value |
|--------|-------|
| **Total Points** | 13 pts |
| **Duration** | 2-3 days |
| **Risk Level** | Medium (data display changes) |
| **Testing Required** | High (multiple views affected) |

---

## Architecture Analysis

### Current Data Flow

```
Assessment Submission
        ↓
UnifiedSSIScoringService.js (0-10 scale, 12-block MECE)
        ↓
    Assessment.ssi_result (stored)
        ↓
    ┌───────────────────────────────────────┐
    │                                       │
    ↓                                       ↓
team-breakdown endpoint              DiagnosticEngine.js
(Simple averaging)                   (Block-level MECE)
    ↓                                       ↓
Company Overview                     SSI Diagnostic Report
(WRONG SCORES)                       (CORRECT SCORES)
```

### Target Data Flow

```
Assessment Submission
        ↓
UnifiedSSIScoringService.js (0-10 scale, 12-block MECE)
        ↓
    Assessment.ssi_result (stored)
        ↓
    DiagnosticEngine.js (Single Source of Truth)
        ↓
    ┌───────────────────────────────────────┐
    │                                       │
    ↓                                       ↓
Company Overview                     SSI Diagnostic Report
(CORRECT SCORES)                     (CORRECT SCORES)
```

---

## File Impact Analysis

### Primary Files to Modify

| File | Lines | Change Type | Risk |
|------|-------|-------------|------|
| `server/routes/assessments.js` | 677-1083 | Major refactor | Medium |
| `server/services/diagnostic/DiagnosticEngine.js` | 68-228 | Minor enhancement | Low |

### Frontend Views Affected

| View | File | Impact |
|------|------|--------|
| Company Overview | `client/pages/company-overview.html` | Score display |
| SSI Results | `client/pages/scripts/team-ssi-view.js` | Score display |
| Dashboard | `client/pages/dashboard.html` | Summary scores |

### Dependent Endpoints

| Endpoint | Used By | Change Required |
|----------|---------|-----------------|
| `/api/assessments/company/:id/team-breakdown` | Company Overview | YES - Replace calc |
| `/api/diagnostic/ssi/:id` | SSI Report | NO - Already correct |
| `/api/assessments/stats` | Dashboard | AUDIT - May use wrong calc |

---

## Epic Definition

### Epic U1: SSI Scoring Unification (13 pts)

**Goal**: All SSI scores across the platform must originate from the DiagnosticEngine to ensure consistency.

#### Story U1.1: Audit Current Score Consumers (2 pts)

**As a** developer
**I want to** identify all places that display SSI scores
**So that** I can ensure nothing is missed during unification

**Acceptance Criteria**:
- [ ] List all API endpoints that return SSI scores
- [ ] List all frontend views that display SSI scores
- [ ] Document current calculation method for each
- [ ] Create test matrix for validation

#### Story U1.2: Create DiagnosticEngine Adapter for team-breakdown (5 pts)

**As a** developer
**I want to** modify the team-breakdown endpoint to use DiagnosticEngine
**So that** Company Overview shows consistent scores

**Acceptance Criteria**:
- [ ] team-breakdown endpoint calls DiagnosticEngine for score calculation
- [ ] Response format remains backward compatible
- [ ] Individual assessment breakdowns still available
- [ ] Legacy data format handling delegated to DiagnosticEngine
- [ ] Performance impact < 50ms increase

**Technical Approach**:
```javascript
// Current (assessments.js line ~800)
const calculateTeamBreakdown = async (companyId) => {
  const assessments = await Assessment.find({ company_id: companyId });
  // Simple averaging logic
  return { speed, strength, intelligence, composite };
};

// Target
const calculateTeamBreakdown = async (companyId) => {
  const diagnosticEngine = new DiagnosticEngine();
  const report = await diagnosticEngine.generateReport(companyId);
  return {
    speed: report.dimensions.speed.score,
    strength: report.dimensions.strength.score,
    intelligence: report.dimensions.intelligence.score,
    composite: report.composite.score
  };
};
```

#### Story U1.3: Handle Legacy Data Formats in DiagnosticEngine (3 pts)

**As a** developer
**I want to** DiagnosticEngine to recognize all 4 legacy data formats
**So that** older assessments display correctly

**Acceptance Criteria**:
- [ ] DiagnosticEngine handles `ssi_result` format (current)
- [ ] DiagnosticEngine handles `dimension_scores` format (legacy 1)
- [ ] DiagnosticEngine handles `ssi_scores` format (legacy 2)
- [ ] DiagnosticEngine handles flat `speed/strength/intelligence` fields (legacy 3)
- [ ] Graceful fallback for missing data
- [ ] Unit tests for each format

**Legacy Formats**:
```javascript
// Format 1: ssi_result (current - already supported)
assessment.ssi_result = {
  dimensions: { speed: { score: 7.5 }, ... }
}

// Format 2: dimension_scores (legacy)
assessment.dimension_scores = {
  speed: 75, strength: 54, intelligence: 71  // 0-100 scale
}

// Format 3: ssi_scores (older legacy)
assessment.ssi_scores = {
  speed: 7.5, strength: 5.4, intelligence: 7.1  // 0-10 scale
}

// Format 4: flat fields (oldest)
assessment.speed = 75;
assessment.strength = 54;
assessment.intelligence = 71;
```

#### Story U1.4: Comprehensive Testing (3 pts)

**As a** developer
**I want to** verify all views show consistent scores
**So that** users trust the data

**Acceptance Criteria**:
- [ ] Unit tests for DiagnosticEngine with all 4 formats
- [ ] Integration test: Company Overview matches SSI Report
- [ ] E2E test: Navigate both views, verify identical scores
- [ ] Test with real production data snapshot
- [ ] Regression tests for existing functionality

---

## Technical Implementation

### Step 1: Create Score Extraction Utility in DiagnosticEngine

```javascript
// server/services/diagnostic/DiagnosticEngine.js

/**
 * Extract dimension scores from any assessment format
 * @param {Object} assessment - Assessment document
 * @returns {Object} Normalized scores { speed, strength, intelligence }
 */
extractDimensionScores(assessment) {
  // Priority 1: New ssi_result format
  if (assessment.ssi_result?.dimensions) {
    return {
      speed: assessment.ssi_result.dimensions.speed?.score || 0,
      strength: assessment.ssi_result.dimensions.strength?.score || 0,
      intelligence: assessment.ssi_result.dimensions.intelligence?.score || 0
    };
  }

  // Priority 2: dimension_scores (0-100 scale, needs conversion)
  if (assessment.dimension_scores) {
    return {
      speed: (assessment.dimension_scores.speed || 0) / 10,
      strength: (assessment.dimension_scores.strength || 0) / 10,
      intelligence: (assessment.dimension_scores.intelligence || 0) / 10
    };
  }

  // Priority 3: ssi_scores (already 0-10)
  if (assessment.ssi_scores) {
    return {
      speed: assessment.ssi_scores.speed || 0,
      strength: assessment.ssi_scores.strength || 0,
      intelligence: assessment.ssi_scores.intelligence || 0
    };
  }

  // Priority 4: Flat fields (0-100 scale)
  if (assessment.speed !== undefined) {
    return {
      speed: (assessment.speed || 0) / 10,
      strength: (assessment.strength || 0) / 10,
      intelligence: (assessment.intelligence || 0) / 10
    };
  }

  // No valid format found
  return { speed: 0, strength: 0, intelligence: 0 };
}
```

### Step 2: Modify team-breakdown Endpoint

```javascript
// server/routes/assessments.js (around line 700)

router.get('/company/:companyId/team-breakdown', authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.params;

    // Validate company access
    // ... existing validation code ...

    // NEW: Use DiagnosticEngine for consistent scoring
    const DiagnosticEngine = require('../services/diagnostic/DiagnosticEngine');
    const engine = new DiagnosticEngine();

    // Get assessments for individual breakdown
    const assessments = await Assessment.find({ company_id: companyId })
      .populate('user_id', 'first_name last_name email role');

    // Calculate team scores using DiagnosticEngine
    const teamScores = engine.calculateTeamDimensionScores(assessments);

    // Build response with individual breakdowns
    const breakdown = assessments.map(a => ({
      user: a.user_id,
      scores: engine.extractDimensionScores(a),
      completedAt: a.completed_at
    }));

    res.json({
      success: true,
      data: {
        teamScores,
        breakdown,
        assessmentCount: assessments.length
      }
    });
  } catch (error) {
    // ... error handling ...
  }
});
```

### Step 3: Add Team Scoring Method to DiagnosticEngine

```javascript
// server/services/diagnostic/DiagnosticEngine.js

/**
 * Calculate team dimension scores from multiple assessments
 * Uses block-level MECE aggregation consistent with individual reports
 * @param {Array} assessments - Array of assessment documents
 * @returns {Object} Team scores { speed, strength, intelligence, composite }
 */
calculateTeamDimensionScores(assessments) {
  if (!assessments || assessments.length === 0) {
    return { speed: 0, strength: 0, intelligence: 0, composite: 0 };
  }

  // Extract normalized scores from all assessments
  const allScores = assessments.map(a => this.extractDimensionScores(a));

  // Calculate averages
  const count = allScores.length;
  const totals = allScores.reduce((acc, s) => ({
    speed: acc.speed + s.speed,
    strength: acc.strength + s.strength,
    intelligence: acc.intelligence + s.intelligence
  }), { speed: 0, strength: 0, intelligence: 0 });

  const speed = totals.speed / count;
  const strength = totals.strength / count;
  const intelligence = totals.intelligence / count;

  // Industry-weighted composite (consistent with individual reports)
  const composite = (speed * 0.34) + (strength * 0.33) + (intelligence * 0.33);

  return {
    speed: Math.round(speed * 10) / 10,
    strength: Math.round(strength * 10) / 10,
    intelligence: Math.round(intelligence * 10) / 10,
    composite: Math.round(composite * 10) / 10
  };
}
```

---

## Testing Strategy

### Unit Tests

```javascript
// tests/unit/services/DiagnosticEngine.test.js

describe('DiagnosticEngine - Legacy Format Support', () => {
  describe('extractDimensionScores', () => {
    it('handles ssi_result format', () => {
      const assessment = {
        ssi_result: {
          dimensions: {
            speed: { score: 7.5 },
            strength: { score: 5.4 },
            intelligence: { score: 6.8 }
          }
        }
      };
      const scores = engine.extractDimensionScores(assessment);
      expect(scores).toEqual({ speed: 7.5, strength: 5.4, intelligence: 6.8 });
    });

    it('handles dimension_scores format (0-100 scale)', () => {
      const assessment = {
        dimension_scores: { speed: 75, strength: 54, intelligence: 68 }
      };
      const scores = engine.extractDimensionScores(assessment);
      expect(scores).toEqual({ speed: 7.5, strength: 5.4, intelligence: 6.8 });
    });

    // ... tests for other formats
  });
});
```

### Integration Tests

```javascript
// tests/integration/ssi-consistency.test.js

describe('SSI Score Consistency', () => {
  it('Company Overview matches SSI Diagnostic Report', async () => {
    // Create test company with assessments
    const { companyId, token } = await setupTestCompany();

    // Get Company Overview scores
    const overviewRes = await request(app)
      .get(`/api/assessments/company/${companyId}/team-breakdown`)
      .set('Authorization', `Bearer ${token}`);

    // Get SSI Diagnostic scores
    const diagnosticRes = await request(app)
      .get(`/api/diagnostic/ssi/${companyId}`)
      .set('Authorization', `Bearer ${token}`);

    // Scores must match
    expect(overviewRes.body.data.teamScores.speed)
      .toEqual(diagnosticRes.body.data.dimensions.speed.score);
    expect(overviewRes.body.data.teamScores.composite)
      .toEqual(diagnosticRes.body.data.composite.score);
  });
});
```

---

## Rollback Plan

If issues discovered post-deployment:

1. **Immediate**: Revert the team-breakdown endpoint changes
2. **Data**: No data migration required (read-only changes)
3. **Frontend**: No frontend rollback needed (same response format)

---

## Definition of Done

- [ ] All 4 legacy data formats handled by DiagnosticEngine
- [ ] team-breakdown endpoint uses DiagnosticEngine
- [ ] Company Overview scores match SSI Diagnostic Report
- [ ] Unit tests passing for all format handlers
- [ ] Integration tests verify score consistency
- [ ] No performance regression (< 50ms increase)
- [ ] Manual QA verification in pre-prod
- [ ] Production deployment with monitoring

---

## Related Documents

- [Sprint 18 Handoff](../SPRINT-18%20(Planned)/SPRINT18_HANDOFF_DOCUMENT.md)
- [Sprint 19 Master Plan](../SPRINT-19%20(Planned)/SPRINT19_MASTER_PLAN.md)
- [DiagnosticEngine Source](../../../../server/services/diagnostic/DiagnosticEngine.js)
- [Assessment Routes](../../../../server/routes/assessments.js)

---

**Document Version**: 1.0.0
**Last Updated**: March 10, 2026
