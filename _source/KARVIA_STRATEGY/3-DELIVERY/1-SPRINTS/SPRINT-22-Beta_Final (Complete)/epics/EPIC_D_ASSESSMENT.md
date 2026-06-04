# Epic D: Assessment Enhancements

<!-- @GENOME T3-SPR-022-ED | ACTIVE | 2026-04-29 | parent:T3-SPR-022-MP | auto:/coding | linked:/strategy -->

**Sprint**: 22 - Beta_Final
**Epic**: D - Assessment Enhancements
**Points**: 8
**Priority**: P0
**Dependencies**: Epic 0 (Pre-Work). Phase 1 can run parallel to F. Phase 2 needs Phase 1 schema + endpoints.

---

## Overview

Enhance the Assessment module with sub-dimension tracking and new Assessment Hub tabs for results viewing, trends analysis, and comparison.

**Mockup**: [assessment-hub.html](../../sprint_mockups/sprint-22/assessment-hub.html)

---

## Phase 1: Sub-dimensions (5 pts)

### SSI Sub-dimensions Model

Each SSI dimension (Speed, Strength, Intelligence) has 4 sub-dimensions:

| Dimension | Sub-dimensions |
|-----------|----------------|
| **Speed** | Decision Making, Market Response, Execution Velocity, Adaptation Rate |
| **Strength** | Financial Resilience, Team Capability, Process Maturity, Resource Depth |
| **Intelligence** | Data Utilization, Strategic Clarity, Learning Velocity, Innovation Capacity |

### Schema Extension

**File**: `server/models/Assessment.js`

```javascript
// Add to ssi_result schema
ssi_result: {
  overall: { type: Number, min: 0, max: 100 },
  dimensions: {
    speed: { type: Number, min: 0, max: 100 },
    strength: { type: Number, min: 0, max: 100 },
    intelligence: { type: Number, min: 0, max: 100 }
  },
  // NEW: Sub-dimensions
  sub_dimensions: {
    speed: {
      decision_making: { type: Number, min: 0, max: 100 },
      market_response: { type: Number, min: 0, max: 100 },
      execution_velocity: { type: Number, min: 0, max: 100 },
      adaptation_rate: { type: Number, min: 0, max: 100 }
    },
    strength: {
      financial_resilience: { type: Number, min: 0, max: 100 },
      team_capability: { type: Number, min: 0, max: 100 },
      process_maturity: { type: Number, min: 0, max: 100 },
      resource_depth: { type: Number, min: 0, max: 100 }
    },
    intelligence: {
      data_utilization: { type: Number, min: 0, max: 100 },
      strategic_clarity: { type: Number, min: 0, max: 100 },
      learning_velocity: { type: Number, min: 0, max: 100 },
      innovation_capacity: { type: Number, min: 0, max: 100 }
    }
  },
  // NEW: Identified constraint (lowest sub-dimension)
  constraint: {
    dimension: { type: String, enum: ['speed', 'strength', 'intelligence'] },
    sub_dimension: { type: String },
    score: { type: Number }
  }
}
```

### Constraint Auto-Identification

D-D-3: deterministic tie-break — on equal scores prefer dimension order `speed < strength < intelligence`, then alpha sub-dim name. D-D-7: scoring runs at submission time; existing assessments do not back-fill (sub_dimensions absent → UI shows "—").

```javascript
const DIMENSION_ORDER = ['speed', 'strength', 'intelligence'];

function identifyConstraint(sub_dimensions) {
  let best = null; // {dimension, sub_dimension, score, dimRank, subName}
  for (const dim of DIMENSION_ORDER) {
    const subs = sub_dimensions?.[dim] || {};
    const sortedSubNames = Object.keys(subs).sort(); // alpha tie-break
    for (const subName of sortedSubNames) {
      const score = subs[subName];
      if (score == null) continue;
      const dimRank = DIMENSION_ORDER.indexOf(dim);
      if (
        !best ||
        score < best.score ||
        (score === best.score && dimRank < best.dimRank) ||
        (score === best.score && dimRank === best.dimRank && subName < best.subName)
      ) {
        best = { dimension: dim, sub_dimension: subName, score, dimRank, subName };
      }
    }
  }
  return best ? { dimension: best.dimension, sub_dimension: best.sub_dimension, score: best.score } : null;
}
```

---

## Phase 2: Assessment Hub Tabs (3 pts)

### Tab 4: All Results

**Purpose**: List view of all completed assessments

**API**: Existing `/api/assessments/company-results` (extend)

**UI Elements**:
- Assessment cards with SSI mini-scores (3 pills)
- Date completed
- Team name
- Click to view details

### Tab 5: Trends

**Purpose**: SSI trends over time (line chart)

**New API**: `GET /api/assessments/trends`

```javascript
router.get('/trends',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER'),
  async (req, res) => {
    try {
      const { team_id, period = '12months' } = req.query;
      const company_id = req.user.company_id;

      const dateFilter = getDateFilter(period); // Last 12 months

      const query = {
        company_id,
        status: 'completed',
        completed_at: { $gte: dateFilter }
      };
      if (team_id) query.team_id = team_id;

      const assessments = await Assessment.find(query)
        .sort({ completed_at: 1 })
        .select('completed_at ssi_result.overall ssi_result.dimensions team_id')
        .populate('team_id', 'name')
        .lean();

      // Group by month
      const trends = groupByMonth(assessments);

      res.json({ success: true, data: trends });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to load trends' });
    }
  }
);
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "month": "2026-01",
      "overall": 68,
      "speed": 65,
      "strength": 72,
      "intelligence": 67,
      "count": 3
    },
    {
      "month": "2026-02",
      "overall": 71,
      "speed": 68,
      "strength": 74,
      "intelligence": 70,
      "count": 4
    }
  ]
}
```

### Tab 6: Compare

**Purpose**: Side-by-side comparison of two assessments

**New API**: `GET /api/assessments/compare` — D-D-4: enforce tenant scope on BOTH ids. Reject 403 if either assessment's `company_id` is not in user scope (or `managed_businesses[]` for CONSULTANT).

```javascript
router.get('/compare',
  authenticateToken,
  async (req, res) => {
    try {
      const { id1, id2 } = req.query;
      if (!id1 || !id2) return res.status(400).json({ success: false, error: 'Two assessment IDs required' });

      const [a1, a2] = await Promise.all([
        Assessment.findById(id1).select('completed_at ssi_result team_id company_id').populate('team_id', 'name').lean(),
        Assessment.findById(id2).select('completed_at ssi_result team_id company_id').populate('team_id', 'name').lean()
      ]);

      // D-D-4: tenant gate
      const allowedCompanies = req.user.role === 'CONSULTANT'
        ? (req.user.managed_businesses || []).map(String)
        : [String(req.user.company_id)];
      const inScope = a => a && allowedCompanies.includes(String(a.company_id));
      if (!inScope(a1) || !inScope(a2)) return res.status(403).json({ success: false, error: 'Forbidden' });

      const deltas = {
        overall:      a2.ssi_result.overall - a1.ssi_result.overall,
        speed:        a2.ssi_result.dimensions.speed - a1.ssi_result.dimensions.speed,
        strength:     a2.ssi_result.dimensions.strength - a1.ssi_result.dimensions.strength,
        intelligence: a2.ssi_result.dimensions.intelligence - a1.ssi_result.dimensions.intelligence
      };
      res.json({ success: true, data: { assessment1: a1, assessment2: a2, deltas } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to compare assessments' });
    }
  }
);
```

---

## UI Specifications

### All Results Tab

```html
<!-- Assessment Card -->
<div class="assessment-card">
  <div class="card-header">
    <span class="team-name">Operations Team</span>
    <span class="date">Mar 15, 2026</span>
  </div>
  <div class="ssi-pills">
    <span class="pill speed">S: 72</span>
    <span class="pill strength">St: 68</span>
    <span class="pill intelligence">I: 75</span>
  </div>
  <div class="overall">
    <span class="score">72</span>
    <span class="label">Overall SSI</span>
  </div>
</div>
```

### Trends Tab

```html
<!-- Chart container -->
<div class="trends-chart">
  <div class="chart-header">
    <select id="team-filter">
      <option value="">All Teams</option>
    </select>
    <select id="period-filter">
      <option value="6months">Last 6 Months</option>
      <option value="12months" selected>Last 12 Months</option>
    </select>
  </div>
  <canvas id="trends-line-chart"></canvas>
  <div class="chart-legend">
    <span class="legend-speed">Speed</span>
    <span class="legend-strength">Strength</span>
    <span class="legend-intelligence">Intelligence</span>
  </div>
</div>
```

### Compare Tab

```html
<!-- Comparison View -->
<div class="compare-container">
  <div class="compare-selectors">
    <select id="assessment-1"><!-- Assessment options --></select>
    <span class="vs">vs</span>
    <select id="assessment-2"><!-- Assessment options --></select>
  </div>

  <div class="compare-cards">
    <div class="compare-card left">
      <h4>Operations Team - Mar 15</h4>
      <div class="scores">
        <div class="score-row">
          <span>Overall</span>
          <span>68</span>
        </div>
        <div class="score-row">
          <span>Speed</span>
          <span>65</span>
        </div>
        <!-- ... -->
      </div>
    </div>

    <div class="compare-deltas">
      <div class="delta positive">+4</div>
      <div class="delta positive">+7</div>
      <!-- ... -->
    </div>

    <div class="compare-card right">
      <h4>Operations Team - Apr 15</h4>
      <!-- ... -->
    </div>
  </div>
</div>
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `server/models/Assessment.js` | MODIFY | Add `ssi_result.sub_dimensions` + `ssi_result.constraint` |
| `server/routes/assessments.js` | MODIFY | Extend `/:id/detailed-results` to include sub_dimensions; add `/trends`, `/compare` |
| `client/pages/assessment-hub.html` | MODIFY | Add tabs 4 (All Results), 5 (Trends), 6 (Compare); add Chart.js CDN script tag — D-D-6 |
| `client/pages/scripts/assessment-hub.js` | **CREATE** (D-D-1 — file does not exist; spec previously said MODIFY) | Tab logic, page state |
| `client/js/assessment-charts.js` | CREATE | Chart.js wrappers for trends + compare |

---

## API Summary

| Method | Endpoint | New/Extend | Description |
|--------|----------|------------|-------------|
| GET | `/api/assessments/:id/detailed-results` | EXTEND | +sub_dimensions |
| GET | `/api/assessments/trends` | NEW | SSI trends over time |
| GET | `/api/assessments/compare` | NEW | Compare two assessments |

---

## Acceptance Criteria

### Phase 1: Sub-dimensions
- [ ] Assessment model includes 12 sub-dimensions under `ssi_result.sub_dimensions` (D-D-2)
- [ ] Scoring runs at submission time and writes sub_dimensions; existing assessments handle gracefully when absent (D-D-7)
- [ ] Constraint auto-identified with deterministic tie-break (D-D-3)
- [ ] Detailed results API returns sub_dimensions when present, omits when absent

### Phase 2: Tabs
- [ ] Tab 4 (All Results) shows assessment cards
- [ ] Tab 5 (Trends) shows line chart; partial current month included with `(MTD)` indicator (D-D-5)
- [ ] Tab 6 (Compare) shows side-by-side view; rejects cross-tenant assessment ids with 403 (D-D-4)
- [ ] Deltas calculated and color-coded
- [ ] Team and period filters work
- [ ] Chart.js loaded via CDN script tag in assessment-hub.html (D-D-6)
- [ ] Existing assessments without sub_dimensions still load (read-side compat, D-D-7)

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| Sub-dimensions schema | 1 |
| Constraint identification | 1 |
| Scoring updates | 1 |
| Trends API | 1 |
| Compare API | 1 |
| Tab 4 UI | 1 |
| Tabs 5-6 UI + charts | 2 |
| **Total** | **8** |

---

**Created**: April 21, 2026 (Session #171)
**Status**: Ready for implementation
