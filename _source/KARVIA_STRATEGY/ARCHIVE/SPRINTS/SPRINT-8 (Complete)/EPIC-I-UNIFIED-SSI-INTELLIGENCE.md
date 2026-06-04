# EPIC I: Unified SSI Intelligence System

**Sprint**: 8 (Phase 1), 9+ (Phase 2-3)
**Total Estimated Points**: 45 points (25 Phase 1 + 20 Phase 2)
**Priority**: High - Core SSI Experience Enhancement
**Dependencies**: Epic F (SSI Assessments), Epic G (Team Management)

---

## Executive Summary

This epic unifies the SSI results experience across Individual, Team, and Company levels into ONE cohesive story about organizational health. The system leverages the existing 12-Block MECE framework already implemented in the backend to create meaningful, actionable intelligence at every level.

**Key Outcome**: When users view their individual results, they understand their role in the company's health. When managers view team results, they see how their team contributes to company goals. When executives view company results, they see the complete picture.

---

## Codebase Audit Findings

### Existing Backend Services (server/services/diagnostic/)

| Service | Lines | Status | Capabilities |
|---------|-------|--------|--------------|
| `DiagnosticEngine.js` | 1012 | ✅ Active | Individual/Team/Function/Company/Diagnostic reports, 12-Block calculation |
| `SSIScoringService.js` | 509 | ✅ Active | 12-Block MECE scoring, priority calculation |
| `InsightDetector.js` | 357 | ✅ Active | Pattern detection, gap analysis, role perception |
| `IndustryConfig.js` | 251 | ✅ Active | 11 industry configs, critical pairs, dimension priorities |
| `ReportGenerator.js` | 336 | ✅ Active | Report formatting, modal/export formats |
| `OKRRecommendationService.js` | 439 | ✅ Active | 12-block OKR templates, priority → OKR mapping |

### Legacy Service (to be merged)

| Service | Lines | Status | Action |
|---------|-------|--------|--------|
| `server/services/SSIScoringService.js` | 551 | ⚠️ Legacy | Merge into unified service |

### Frontend Pages

| Page | Lines | Current State | Needed Updates |
|------|-------|---------------|----------------|
| `assessment-results.html` | 496 | 3-dimension only | Add 12-block breakdown, role context |
| `team-ssi-view.html` | 196 | 3-dimension + modal | Enhance modal with 12-block view |

### Key Findings

1. **12-Block MECE is ALREADY IMPLEMENTED** in `server/services/diagnostic/SSIScoringService.js`
   - `DIMENSION_BLOCKS`: Maps dimensions to their 4 blocks each
   - `calculateSSI()`: Full 12-block calculation per user
   - `calculatePriorities()`: Priority matrix for OKR generation

2. **DiagnosticEngine already has**:
   - `calculate12BlockScoresForCompany()` - Company-level 12-block
   - `generateIndividualReport()` - But only returns 3-dimension scores
   - Gap: Individual report doesn't include 12-block breakdown

3. **Two SSIScoringService files exist**:
   - `server/services/SSIScoringService.js` (class-based, legacy)
   - `server/services/diagnostic/SSIScoringService.js` (function-based, 12-block)
   - Action: Unify into single service

4. **Frontend is 3-dimension only**:
   - `assessment-results.html` shows radar chart with 3 dimensions
   - No 12-block breakdown visualization
   - No role-context interpretation

---

## 12-Block MECE Framework Reference

```
┌──────────────────────────────────────────────────────────────────────┐
│                         SSI DIMENSIONS                                │
├─────────────────────┬─────────────────────┬─────────────────────────┤
│       SPEED         │     STRENGTH        │     INTELLIGENCE         │
│   (Organization's   │  (Organization's    │   (Organization's        │
│    velocity)        │   resilience)       │    learning capacity)    │
├─────────────────────┼─────────────────────┼─────────────────────────┤
│ • Delivery          │ • Financial         │ • Market                 │
│   (execution)       │   (resources)       │   (customer intel)       │
│ • Decisions         │ • Operations        │ • Data                   │
│   (alignment)       │   (processes)       │   (analytics)            │
│ • Change            │ • People            │ • Strategy               │
│   (adaptability)    │   (culture/talent)  │   (planning)             │
│ • Response          │ • Quality           │ • Learning               │
│   (client service)  │   (standards)       │   (innovation)           │
└─────────────────────┴─────────────────────┴─────────────────────────┘
```

---

## Phase 1: Foundation + Individual Enhancement (Sprint 8)

**Points**: 25 points
**Goal**: Unify services and enhance individual results experience

### Story I1: Unify SSI Services (5 pts)

**As a** developer
**I want** a single unified SSIIntelligenceService
**So that** all SSI scoring logic is in one place

**Technical Tasks**:
1. Create `server/services/SSIIntelligenceService.js`:
   - Merge class methods from legacy `SSIScoringService.js`
   - Import functions from `diagnostic/SSIScoringService.js`
   - Export unified API

2. Service API:
```javascript
// server/services/SSIIntelligenceService.js
module.exports = {
  // Individual scoring (from legacy)
  calculateIndividualScores(template, responses, questions),
  normalizeResponseValue(responseValue, question),

  // 12-Block scoring (from diagnostic)
  calculateSSI(questions, responses, industry),
  calculateAllBlockScores(questions, responses),
  calculatePriorities(blockScores, industry),

  // Report generation (wrapper for DiagnosticEngine)
  generateIndividualReport(userId, companyId, options),
  generateTeamReport(teamId, companyId, options),
  generateCompanyReport(companyId, options),
  generateDiagnosticReport(companyId),

  // Constants
  DIMENSION_BLOCKS,
  BLOCK_TO_DIMENSION,
  DEFAULT_THRESHOLDS
};
```

3. Update imports in:
   - `server/routes/assessments.js`
   - `server/routes/diagnostic-reports.js`
   - `server/services/aiOKRService.js`

**Acceptance Criteria**:
- [ ] Single service file exports all SSI functionality
- [ ] Legacy SSIScoringService deprecated with import redirect
- [ ] All existing tests pass
- [ ] No breaking changes to API responses

---

### Story I2: Enhance Individual Report Backend (5 pts)

**As a** user who completed an assessment
**I want** to see my 12-block breakdown
**So that** I understand specifically where I'm strong and weak

**Technical Tasks**:
1. Update `DiagnosticEngine.generateIndividualReport()`:

```javascript
async function generateIndividualReport(userId, companyId, options = {}) {
  // Existing code...

  // NEW: Calculate 12-block scores for individual
  const AssessmentQuestion = mongoose.model('AssessmentQuestion');
  const questions = await AssessmentQuestion.find().lean();

  // Get responses from assessment
  const responseMap = {};
  assessment.responses.forEach(r => {
    if (r.question_id && r.normalized_value !== null) {
      responseMap[r.question_id] = r.normalized_value;
    }
  });

  // Calculate 12-block using SSIScoringService
  const blockResults = calculateSSI(questions, responseMap, company.industry);

  return {
    report_type: 'individual',
    user: { id: userId, name: user.name, role: user.role, team_id: user.team_id },

    // Legacy 3-dimension (backward compatibility)
    scores,
    dimensions: {
      speed: { score: scores.speed, level: getLevelFromScore(scores.speed) },
      strength: { score: scores.strength, level: getLevelFromScore(scores.strength) },
      intelligence: { score: scores.intelligence, level: getLevelFromScore(scores.intelligence) }
    },

    // NEW: 12-block breakdown
    overall_ssi: blockResults.overall,
    blocks: blockResults.blocks,
    blocksByDimension: {
      speed: ['delivery', 'decisions', 'change', 'response'].map(b => blockResults.blocks[b]),
      strength: ['financial', 'operations', 'people', 'quality'].map(b => blockResults.blocks[b]),
      intelligence: ['market', 'data', 'strategy', 'learning'].map(b => blockResults.blocks[b])
    },

    // NEW: Personal insights
    insights: generatePersonalInsights(blockResults, user.role),

    // NEW: Priorities for personal development
    priorities: blockResults.statistics ?
      calculatePriorities(blockResults.blocks, company.industry) : null,

    assessment_date: assessment.completed_at
  };
}
```

2. Add `generatePersonalInsights()` function:

```javascript
function generatePersonalInsights(blockResults, userRole) {
  const insights = [];

  // Find top 3 strengths (score >= 7.5)
  const strengths = Object.entries(blockResults.blocks)
    .filter(([_, data]) => data.score >= 7.5)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 3)
    .map(([block, data]) => ({
      type: 'strength',
      block,
      score: data.score,
      message: getStrengthMessage(block, data.score, userRole)
    }));

  // Find top 3 areas for development (score < 6.5)
  const development = Object.entries(blockResults.blocks)
    .filter(([_, data]) => data.score !== null && data.score < 6.5)
    .sort((a, b) => a[1].score - b[1].score)
    .slice(0, 3)
    .map(([block, data]) => ({
      type: 'development',
      block,
      score: data.score,
      message: getDevelopmentMessage(block, data.score, userRole)
    }));

  return { strengths, development };
}
```

**Acceptance Criteria**:
- [ ] Individual report includes 12-block breakdown
- [ ] Personal insights generated based on scores
- [ ] Role-appropriate messaging (MANAGER vs EMPLOYEE)
- [ ] API backward compatible (legacy fields still present)

---

### Story I3: Individual Results 12-Block UI (8 pts)

**As a** user viewing my assessment results
**I want** to see a visual breakdown of all 12 blocks
**So that** I can quickly identify my strengths and weaknesses

**Technical Tasks**:
1. Update `assessment-results.html`:

```html
<!-- NEW: 12-Block Breakdown Section -->
<div class="bg-white border border-gray-200 rounded-xl p-6 mb-8" id="block-breakdown">
  <h2 class="text-xl font-semibold text-gray-900 mb-6">Your 12-Block Profile</h2>

  <!-- Dimension Tabs -->
  <div class="flex space-x-4 mb-6 border-b border-gray-200">
    <button class="tab-btn active" data-dimension="speed">Speed</button>
    <button class="tab-btn" data-dimension="strength">Strength</button>
    <button class="tab-btn" data-dimension="intelligence">Intelligence</button>
  </div>

  <!-- Block Cards Grid -->
  <div id="block-cards-container" class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <!-- Dynamically populated -->
  </div>
</div>

<!-- NEW: Personal Insights Section -->
<div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8" id="personal-insights">
  <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Strengths & Development Areas</h2>
  <div class="grid md:grid-cols-2 gap-6">
    <div id="strengths-container">
      <h3 class="font-medium text-green-800 mb-3">💪 Your Strengths</h3>
      <!-- Dynamically populated -->
    </div>
    <div id="development-container">
      <h3 class="font-medium text-orange-800 mb-3">🎯 Areas for Growth</h3>
      <!-- Dynamically populated -->
    </div>
  </div>
</div>
```

2. Update JavaScript in `assessment-results.html`:

```javascript
function render12BlockBreakdown(data) {
  const container = document.getElementById('block-cards-container');
  const dimension = document.querySelector('.tab-btn.active').dataset.dimension;

  const blockColors = {
    speed: 'purple',
    strength: 'blue',
    intelligence: 'teal'
  };

  const blocks = data.blocksByDimension[dimension];
  container.innerHTML = blocks.map(block => `
    <div class="block-card p-4 rounded-lg border-2 ${getBlockBorderColor(block.score)}">
      <div class="flex items-center justify-between mb-2">
        <span class="font-medium text-gray-700 capitalize">${block.block}</span>
        <span class="text-xl font-bold ${getBlockTextColor(block.score)}">
          ${block.score !== null ? block.score.toFixed(1) : 'N/A'}
        </span>
      </div>
      <div class="text-xs text-gray-500">${getBlockDescription(block.block)}</div>
      <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full ${getBlockBarColor(block.score)}"
             style="width: ${block.score ? block.score * 10 : 0}%"></div>
      </div>
    </div>
  `).join('');
}

function renderPersonalInsights(insights) {
  // Strengths
  const strengthsContainer = document.getElementById('strengths-container');
  strengthsContainer.innerHTML += insights.strengths.map(s => `
    <div class="bg-white rounded-lg p-3 mb-2 border-l-4 border-green-500">
      <div class="flex justify-between items-center">
        <span class="font-medium capitalize">${s.block}</span>
        <span class="text-green-600 font-bold">${s.score.toFixed(1)}</span>
      </div>
      <p class="text-sm text-gray-600 mt-1">${s.message}</p>
    </div>
  `).join('');

  // Development areas
  const devContainer = document.getElementById('development-container');
  devContainer.innerHTML += insights.development.map(d => `
    <div class="bg-white rounded-lg p-3 mb-2 border-l-4 border-orange-500">
      <div class="flex justify-between items-center">
        <span class="font-medium capitalize">${d.block}</span>
        <span class="text-orange-600 font-bold">${d.score.toFixed(1)}</span>
      </div>
      <p class="text-sm text-gray-600 mt-1">${d.message}</p>
    </div>
  `).join('');
}
```

3. Add tab switching functionality
4. Add block descriptions (from OKRRecommendationService)
5. Add responsive design for mobile

**UI Mockup**:
```
┌─────────────────────────────────────────────────────────────────┐
│ Your 12-Block Profile                                           │
├─────────────────────────────────────────────────────────────────┤
│ [Speed]  [Strength]  [Intelligence]                             │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │ Delivery │ │Decisions │ │  Change  │ │ Response │            │
│ │   7.8    │ │   6.2    │ │   8.1    │ │   7.5    │            │
│ │ ████████░│ │ ██████░░░│ │ ████████░│ │ ███████░░│            │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Your Strengths & Development Areas                              │
├────────────────────────────┬────────────────────────────────────┤
│ 💪 Your Strengths          │ 🎯 Areas for Growth                │
│ ┌─────────────────────────┐│ ┌─────────────────────────────────┐│
│ │ Change         8.1     ││ │ Decisions           6.2        ││
│ │ Great adaptability!    ││ │ Focus on faster decision-making ││
│ └─────────────────────────┘│ └─────────────────────────────────┘│
└────────────────────────────┴────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] 12-block grid displays for each dimension
- [ ] Tab switching between Speed/Strength/Intelligence
- [ ] Color coding based on score thresholds
- [ ] Personal insights section with strengths and development areas
- [ ] Responsive design for mobile

---

### Story I4: Role-Context Messaging (3 pts)

**As a** user viewing my results
**I want** insights relevant to my role
**So that** recommendations are actionable for my position

**Technical Tasks**:
1. Create role-specific message templates:

```javascript
// server/config/ssi-messages.js
const ROLE_MESSAGES = {
  EXECUTIVE: {
    strengths: {
      delivery: 'Your execution leadership drives organizational success',
      decisions: 'Your decision-making aligns teams effectively',
      // ... all 12 blocks
    },
    development: {
      delivery: 'Consider delegating execution details to focus on strategy',
      decisions: 'Create frameworks to accelerate team decision-making',
      // ... all 12 blocks
    }
  },
  MANAGER: {
    strengths: {
      delivery: 'Your team benefits from your execution focus',
      people: 'Your people management creates strong team culture',
      // ... all 12 blocks
    },
    development: {
      delivery: 'Work with your team to identify delivery bottlenecks',
      people: 'Invest more time in 1:1s and team development',
      // ... all 12 blocks
    }
  },
  EMPLOYEE: {
    strengths: {
      delivery: 'You consistently deliver quality work on time',
      learning: 'Your growth mindset is a valuable asset',
      // ... all 12 blocks
    },
    development: {
      delivery: 'Focus on improving estimation and time management',
      strategy: 'Seek opportunities to understand bigger picture goals',
      // ... all 12 blocks
    }
  }
};
```

2. Update `generatePersonalInsights()` to use role templates

**Acceptance Criteria**:
- [ ] Messages vary by role (EXECUTIVE, MANAGER, EMPLOYEE)
- [ ] All 12 blocks have role-specific messages
- [ ] Messages are actionable and constructive

---

### Story I5: Individual-to-Company Context (4 pts)

**As a** user viewing my results
**I want** to see how my scores compare to company averages
**So that** I understand my contribution to organizational health

**Technical Tasks**:
1. Add company context to individual report API
2. Update frontend to show comparison:

```javascript
// Backend addition to individual report
const companyScores = await calculate12BlockScoresForCompany(companyId);

return {
  // ... existing fields

  // NEW: Company context
  company_context: {
    company_overall: companyScores?.overall?.score,
    block_comparisons: Object.entries(blockResults.blocks).map(([block, data]) => ({
      block,
      your_score: data.score,
      company_avg: companyScores?.blocks?.[block]?.score,
      delta: data.score && companyScores?.blocks?.[block]?.score
        ? data.score - companyScores.blocks[block].score
        : null,
      status: getComparisonStatus(data.score, companyScores?.blocks?.[block]?.score)
    }))
  }
};
```

3. Add comparison indicators in UI:
```html
<!-- In block card -->
<div class="text-xs mt-1">
  <span class="${delta > 0 ? 'text-green-600' : 'text-red-600'}">
    ${delta > 0 ? '↑' : '↓'} ${Math.abs(delta).toFixed(1)} vs company avg
  </span>
</div>
```

**Acceptance Criteria**:
- [ ] Individual report includes company average comparison
- [ ] Visual indicators show above/below company average
- [ ] Graceful handling when company data unavailable

---

## Phase 2: Team & Company Integration (Sprint 9)

**Points**: 20 points
**Goal**: Enhance team-ssi-view with 12-block breakdown and unified story

### Story I6: Team 12-Block View (5 pts)

Enhance `team-ssi-view.html` diagnostic modal to show 12-block breakdown.

### Story I7: Company Dashboard 12-Block (5 pts)

Add 12-block visualization to company overview.

### Story I8: Cross-Level Comparison (5 pts)

Enable comparison: Individual ↔ Team ↔ Company

### Story I9: Export Enhanced Reports (5 pts)

PDF export with full 12-block breakdown.

---

## Phase 3: Future Enhancements (Sprint 10+)

**Not Scoped**: To be planned later

1. **Industry Benchmarks**:
   - Add `industry_sector` field to Company model (hook ready)
   - External benchmark data integration
   - "How do you compare to your industry?"

2. **AI Narrative Generation**:
   - Generate human-readable story from SSI data
   - "Your company excels in Speed, particularly in Change..."

3. **User Profile Integration**:
   - Store individual SSI history
   - Track progress over time
   - Career development recommendations

4. **Function-Level Deep Dive**:
   - Department-specific insights
   - Cross-function collaboration gaps

---

## Technical Architecture

### Service Unification

```
BEFORE:
┌─────────────────────────────────┐    ┌──────────────────────────────┐
│ server/services/               │    │ server/services/diagnostic/  │
│ SSIScoringService.js (class)   │    │ SSIScoringService.js (funcs) │
│ - calculateScores()            │    │ - calculateSSI()             │
│ - aggregateTeamScores()        │    │ - calculatePriorities()      │
└─────────────────────────────────┘    └──────────────────────────────┘

AFTER:
┌──────────────────────────────────────────────────────────────────────┐
│ server/services/SSIIntelligenceService.js                           │
│                                                                      │
│ // Individual Scoring (from legacy)                                  │
│ calculateScores(template, responses, questions)                      │
│ normalizeResponseValue(value, question)                              │
│ validateResponses(responses, template)                               │
│                                                                      │
│ // 12-Block Scoring (from diagnostic)                                │
│ calculateSSI(questions, responses, industry)                         │
│ calculateAllBlockScores(questions, responses)                        │
│ calculatePriorities(blockScores, industry)                           │
│                                                                      │
│ // Reports (wrapper for DiagnosticEngine)                           │
│ generateIndividualReport(userId, companyId, options)                │
│ generateTeamReport(teamId, companyId, options)                      │
│ generateCompanyReport(companyId)                                    │
│ generateDiagnosticReport(companyId)                                 │
│                                                                      │
│ // Insights (from InsightDetector)                                  │
│ generateAllInsights(data, industry)                                 │
│ generatePersonalInsights(blockResults, userRole)                    │
│                                                                      │
│ // Constants                                                        │
│ DIMENSION_BLOCKS, BLOCK_TO_DIMENSION, DEFAULT_THRESHOLDS            │
└──────────────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Endpoint | Method | Updates |
|----------|--------|---------|
| `/api/assessments/:id/detailed-results` | GET | Add 12-block, insights, company_context |
| `/api/diagnostic-reports/individual/:userId` | GET | New - full individual 12-block report |
| `/api/diagnostic-reports/team/:teamId` | GET | Add 12-block breakdown |
| `/api/diagnostic-reports/company/:companyId` | GET | Already has 12-block |

---

## Code Reuse Matrix

| Component | Source File | Lines | Reuse Type |
|-----------|-------------|-------|------------|
| 12-Block calculation | `diagnostic/SSIScoringService.js` | 1-509 | 100% reuse |
| Block constants | `diagnostic/SSIScoringService.js` | 31-43 | Export as-is |
| Priority calculation | `diagnostic/SSIScoringService.js` | 320-379 | 100% reuse |
| Insight detection | `diagnostic/InsightDetector.js` | 1-357 | 100% reuse |
| Industry config | `diagnostic/IndustryConfig.js` | 1-251 | 100% reuse |
| OKR templates | `diagnostic/OKRRecommendationService.js` | 23-191 | Reuse for block descriptions |
| Individual report | `diagnostic/DiagnosticEngine.js` | 308-356 | Extend |
| Report formatting | `diagnostic/ReportGenerator.js` | 84-196 | Extend for 12-block |
| Score normalization | `services/SSIScoringService.js` | 15-45 | Merge into unified service |

---

## Story Points Summary

### Phase 1 (Sprint 8): 25 points
| Story | Points | Description |
|-------|--------|-------------|
| I1 | 5 | Unify SSI services |
| I2 | 5 | Enhance individual report backend |
| I3 | 8 | Individual results 12-block UI |
| I4 | 3 | Role-context messaging |
| I5 | 4 | Individual-to-company context |

### Phase 2 (Sprint 9): 20 points
| Story | Points | Description |
|-------|--------|-------------|
| I6 | 5 | Team 12-block view |
| I7 | 5 | Company dashboard 12-block |
| I8 | 5 | Cross-level comparison |
| I9 | 5 | Export enhanced reports |

---

## Acceptance Criteria Summary

### Phase 1 Complete When:
- [ ] Single SSIIntelligenceService exports all SSI functionality
- [ ] Individual results show 12-block breakdown with tabs
- [ ] Personal insights show strengths and development areas
- [ ] Role-appropriate messaging for all user types
- [ ] Company average comparison visible on individual results
- [ ] All existing tests pass
- [ ] No breaking changes to existing APIs

### Definition of Done:
- [ ] Code reviewed and merged
- [ ] Unit tests for new functions
- [ ] Integration tests for API changes
- [ ] Manual QA on individual results page
- [ ] Documentation updated

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing scoring | High | Keep backward compatibility, run parallel |
| Performance with company avg | Medium | Cache company scores, lazy load comparison |
| Overwhelming UI complexity | Medium | Progressive disclosure, tabs for 12-block |
| Role message quality | Low | Review with stakeholders, iterate |

---

## Dependencies

- **Epic F**: SSI Assessment system (Complete)
- **Epic G**: Team Management (Complete)
- **Assessment Questions**: 12-block categories in database (Complete)
- **DiagnosticEngine**: Backend already supports 12-block (Complete)

---

## Notes

- 12-block backend is already implemented - this epic is primarily about:
  1. Unifying services
  2. Enhancing individual results (frontend + API)
  3. Adding role context and company comparison
- Question migration to 12-block categories is OUT OF SCOPE (Sprint 9+)
- Industry benchmarks are OUT OF SCOPE (Sprint 10+)
