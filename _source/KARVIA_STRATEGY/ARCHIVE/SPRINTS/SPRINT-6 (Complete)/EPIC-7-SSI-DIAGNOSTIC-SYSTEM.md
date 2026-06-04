# Epic 7: SSI Diagnostic Scoring System

**Sprint**: 6
**Points**: 13
**Priority**: P1
**Status**: Ready for Implementation

---

## Overview

Build a completely isolated diagnostic engine that generates comprehensive SSI reports at 4 levels (Individual, Team, Function, Company) plus a unified Diagnostic Report for executives/consultants. This report powers OKR generation with contextual insights.

### Key Principles
- **Complete Isolation**: No imports from existing services
- **80% Completion Gate**: Reports only available after 80% assessment completion
- **Compact UI**: Minimal modal footprint, scannable in 30 seconds
- **Industry-Aware**: Adjacent function analysis based on company industry

---

## Report Types

| Report | Access | Purpose |
|--------|--------|---------|
| Individual | Employee (own), Manager+ | Personal SSI scores |
| Team | Manager (own team), Exec+ | Team aggregate + cohesion |
| Function | Executive+ | Cross-team comparison |
| Company | Executive+ | Overall company health |
| **Diagnostic** | Executive, Consultant | Comprehensive analysis for OKR |

---

## Completion Gate

```
Requirement: 80% of team members must complete assessments

Formula: completed_users / total_team_members >= 0.80

Data Source: Same as /api/assessments/company/:id/team-breakdown
- total_members: Sum of team.member_count
- completed: Unique users with completed assessments
```

---

## Architecture (Isolated)

```
server/services/diagnostic/       # NEW FOLDER
├── DiagnosticEngine.js          # Main engine (standalone)
├── IndustryConfig.js            # Industry adjacency mappings
├── InsightDetector.js           # Pattern detection
└── ReportGenerator.js           # Report formatting

server/models/
└── DiagnosticReport.js          # NEW - Report storage

server/routes/
└── diagnostic-reports.js        # NEW - Isolated routes

client/pages/scripts/
└── team-ssi-view.js             # ADD: Button + compact modal
```

### Zero Dependencies on Existing Services
- Does NOT import SSIScoringService.js
- Queries MongoDB models directly
- Duplicates necessary calculations (intentional isolation)

---

## Industry Adjacency Configuration

```javascript
INDUSTRY_ADJACENCY = {
  'consulting': {
    critical_pairs: [
      ['Sales/Marketing', 'Operations'],  // Promise → Deliver
      ['Product', 'Engineering']
    ]
  },
  'it_services': {
    critical_pairs: [
      ['Engineering', 'Product'],
      ['Engineering', 'Operations']
    ]
  },
  'healthcare': {
    critical_pairs: [
      ['Operations', 'HR/Admin'],
      ['Operations', 'Finance']
    ]
  }
  // ... more industries
}
```

---

## Diagnostic Insights Detected

| Category | Description | Threshold |
|----------|-------------|-----------|
| Dimension Imbalance | Speed/Strength/Intelligence gap | 2.0 points |
| Cross-Function Gap | Critical pair misalignment | 2.0 points |
| Role Perception Gap | Manager vs Employee scores | 1.5 points |
| Function Health | Below company average | 1.5 points |

### Severity Levels
- **CRITICAL**: Score < 5.0 or gap > 3.0
- **WARNING**: Score 5.0-6.5 or gap 2.0-3.0
- **ATTENTION**: Score 6.5-7.5 or gap 1.5-2.0
- **HEALTHY**: Score > 7.5

---

## API Endpoints

```
GET  /api/diagnostic/check-eligibility/:companyId
POST /api/diagnostic/generate
GET  /api/diagnostic/reports/:companyId
GET  /api/diagnostic/report/:reportId
```

---

## UI Integration

### Button Location
- **Page**: team-ssi-view.html
- **Tab**: Company Results (company overview)
- **Visibility**: Only when completion >= 80%
- **Access**: EXECUTIVE, BUSINESS_OWNER, CONSULTANT only

### Button States
```
< 80% completion:
┌────────────────────────────────────────┐
│ Diagnostic Report: Requires 80%        │
│ ████████░░░░░░░░ 62%                  │
│ 9 more assessments needed              │
└────────────────────────────────────────┘

>= 80% completion:
┌────────────────────────────────────────┐
│ [Generate Diagnostic Report]           │
│ Comprehensive analysis • 84% complete  │
└────────────────────────────────────────┘
```

### Modal Design
- **Size**: max-w-xl (compact)
- **Height**: max-h-[85vh] with scroll
- **Sections**: Health, Scores, Issues (collapsible), Rankings, OKR Recommendations
- **Actions**: Export, Use for OKR Generation

---

## Tasks

| # | Task | Hours | Description |
|---|------|-------|-------------|
| 1 | DiagnosticEngine.js | 3h | Core engine with scoring, grouping |
| 2 | IndustryConfig.js | 1h | Industry adjacency mappings |
| 3 | InsightDetector.js | 2h | Pattern detection algorithms |
| 4 | ReportGenerator.js | 2h | Report formatting (all 5 types) |
| 5 | DiagnosticReport.js model | 0.5h | MongoDB schema |
| 6 | diagnostic-reports.js routes | 1.5h | API endpoints |
| 7 | Frontend integration | 2h | Button + compact modal |
| 8 | OKR integration | 1h | Feed diagnostic to ai-okr.js |
| 9 | Testing | 1h | All report types + gate |

**Total**: 14 hours (~13 story points)

---

## Files Created (NEW)

| File | Lines | Purpose |
|------|-------|---------|
| `server/services/diagnostic/DiagnosticEngine.js` | ~350 | Main engine |
| `server/services/diagnostic/IndustryConfig.js` | ~150 | Industry config |
| `server/services/diagnostic/InsightDetector.js` | ~200 | Pattern detection |
| `server/services/diagnostic/ReportGenerator.js` | ~250 | Report formatting |
| `server/models/DiagnosticReport.js` | ~60 | Schema |
| `server/routes/diagnostic-reports.js` | ~150 | Routes |

**Total New Code**: ~1,160 lines

---

## Files Modified (MINIMAL)

| File | Change | Lines |
|------|--------|-------|
| `server/index.js` | Add route import | +2 |
| `team-ssi-view.js` | Add button + modal methods | +120 |
| `displayCompanyResults()` | Call `showDiagnosticButton()` | +1 |

**Total Modified**: ~123 lines added to existing files

---

## Integration with OKR Generation

```javascript
// In ai-okr.js generate-from-company endpoint
// Check for existing diagnostic report

const DiagnosticReport = require('../models/DiagnosticReport');
const latestDiagnostic = await DiagnosticReport.findOne({
  company_id,
  report_type: 'diagnostic',
  status: 'active'
}).sort({ generated_at: -1 });

if (latestDiagnostic) {
  // Use diagnostic insights for better OKR prompts
  const { okrRecommendations, diagnostics } = latestDiagnostic.data;
  // Feed priority areas and insights to OpenAI
}
```

---

## Testing Checklist

- [ ] Completion gate blocks at < 80%
- [ ] Completion gate allows at >= 80%
- [ ] Individual report generates correctly
- [ ] Team report generates correctly
- [ ] Function report generates correctly
- [ ] Company report generates correctly
- [ ] Diagnostic report generates with all insights
- [ ] Industry adjacency uses correct config
- [ ] Button shows/hides based on completion
- [ ] Modal displays compact and readable
- [ ] Reports save to database
- [ ] OKR generation uses diagnostic data

---

## Success Criteria

- [ ] 80% completion gate enforced
- [ ] All 5 report types functional
- [ ] Industry-specific adjacency working
- [ ] Compact modal fits on screen without scrolling (main content)
- [ ] Insights correctly identify issues
- [ ] OKR generation enhanced by diagnostic data
- [ ] Zero impact on existing assessment flow

---

*Epic created: November 26, 2025*
*Ready for implementation*
