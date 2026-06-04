# Feature: Question-Answer Type Validation & Standardization

**Sprint**: 11
**Story Points**: 5 pts
**Priority**: P1
**Created**: January 20, 2026

---

## Problem Statement

Assessment questions have semantic mismatch between question wording and answer scale:

**Example Issue**:
- Question: "How often do orders require rework..."
- Current Scale: "Strongly Disagree → Strongly Agree" (perception type)
- Correct Scale: "Never → Always" (frequency type)

This creates:
1. **Cognitive dissonance** for respondents
2. **Unreliable scores** - respondent may interpret scale differently
3. **SSI score variance** - same business reality scored inconsistently

---

## Evolution Path: From Semantic to Quantitative

This feature implements **Phase 1 (Intermediary)** of a three-phase evolution:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ANSWER COLLECTION EVOLUTION                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  PHASE 0 (Current - Broken)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Q: "How often do orders require rework?"                               │   │
│  │  A: [Slider 0-10] "Strongly Disagree ──────────── Strongly Agree"       │   │
│  │  Score: Arbitrary, semantic mismatch                                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                     ↓                                           │
│  PHASE 1 (Sprint 11 - Intermediary)                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Q: "How often do orders require rework?"                               │   │
│  │  A: [Dropdown] "Never | Rarely | Sometimes | Often | Always"            │   │
│  │  Score: Mapped (Never=0, Rarely=2.5, Sometimes=5, Often=7.5, Always=10) │   │
│  │  ✓ Semantically correct, consistent interpretation                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                     ↓                                           │
│  PHASE 2 (Future - Exact Quantitative)                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  Q: "How often do orders require rework?"                               │   │
│  │  A: [Number Input] "___200___ / ___300___ times in the last 12 months"  │   │
│  │  Score: Calculated (200/300 = 66.7% → normalized vs benchmark → 6.5)    │   │
│  │  ✓ Exact data, benchmark comparison, precise scoring                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 Design (Sprint 11 Scope)

### Response Type Categories

| Type | Phase 1 (Intermediary) | Phase 2 (Future Exact) |
|------|------------------------|------------------------|
| `frequency` | "Never → Always" dropdown | "X / Y times in period" |
| `percentage` | 0-100% slider | "X / Y total" (calculated %) |
| `time_short` | "Instant → Several days" dropdown | "X hours average" |
| `time_long` | "Same week → Quarters" dropdown | "X days average" |
| `maturity` | 5-level maturity dropdown | Same (inherently categorical) |
| `perception` | 0-10 slider (no change) | Same (inherently subjective) |

### Data Model Extension (Future-Ready)

```javascript
// server/models/AssessmentQuestion.js - Add fields for Phase 2 readiness

// Existing field
response_type: {
  type: String,
  enum: ['percentage', 'time_short', 'time_long', 'frequency', 'maturity', 'perception'],
  default: 'perception'
},

// NEW: Phase configuration
response_phase: {
  type: String,
  enum: ['semantic', 'quantitative'],
  default: 'semantic',
  description: 'Phase 1 = semantic (dropdown), Phase 2 = quantitative (exact numbers)'
},

// NEW: Quantitative config (for Phase 2)
quantitative_config: {
  numerator_label: {
    type: String,
    description: 'Label for numerator input (e.g., "Orders requiring rework")'
  },
  denominator_label: {
    type: String,
    description: 'Label for denominator input (e.g., "Total orders")'
  },
  period: {
    type: String,
    enum: ['last_month', 'last_quarter', 'last_6_months', 'last_12_months'],
    default: 'last_12_months'
  },
  unit: {
    type: String,
    description: 'Unit of measurement (e.g., "times", "hours", "days", "occurrences")'
  },
  benchmark_low: {
    type: Number,
    description: 'Industry benchmark for low score (Phase 2)'
  },
  benchmark_high: {
    type: Number,
    description: 'Industry benchmark for high score (Phase 2)'
  }
}
```

### Response Type Configuration

```javascript
// server/config/responseTypes.js

const RESPONSE_TYPE_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════
  // FREQUENCY - "How often does X happen?"
  // Phase 1: Never → Always semantic scale
  // Phase 2: "X / Y times in last 12 months"
  // ═══════════════════════════════════════════════════════════════════════════
  frequency: {
    phase: 'semantic',
    input_type: 'select',
    labels: {
      min: 'Never',
      neutral: 'Sometimes',
      max: 'Always'
    },
    options: [
      { value: 0, label: 'Never (0%)', score: 0, quantitative_range: '0%' },
      { value: 1, label: 'Rarely (1-25%)', score: 2.5, quantitative_range: '1-25%' },
      { value: 2, label: 'Sometimes (26-50%)', score: 5, quantitative_range: '26-50%' },
      { value: 3, label: 'Often (51-75%)', score: 7.5, quantitative_range: '51-75%' },
      { value: 4, label: 'Always (76-100%)', score: 10, quantitative_range: '76-100%' }
    ],
    scoring: 'mapped',
    // Phase 2 preview: What the exact input will look like
    phase2_preview: {
      input_type: 'fraction',
      example: '200 / 300 times in the last 12 months',
      scoring: 'percentage_normalized'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PERCENTAGE - "What % of X achieves Y?"
  // Phase 1: 0-100% slider
  // Phase 2: "X / Y total" with calculated percentage
  // ═══════════════════════════════════════════════════════════════════════════
  percentage: {
    phase: 'semantic',
    input_type: 'slider',
    scale: { min: 0, max: 100, step: 5 },
    labels: {
      min: '0%',
      neutral: '50%',
      max: '100%'
    },
    options: null,
    scoring: 'normalize',
    normalization: (value) => value / 10, // 100% → 10 score
    phase2_preview: {
      input_type: 'fraction',
      example: '85 / 100 projects delivered on time',
      scoring: 'direct_percentage'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME_SHORT - "How quickly does X happen?" (hours/days)
  // Phase 1: Descriptive ranges
  // Phase 2: "X hours average" with benchmark comparison
  // ═══════════════════════════════════════════════════════════════════════════
  time_short: {
    phase: 'semantic',
    input_type: 'select',
    labels: {
      min: 'Instant (best)',
      neutral: 'Same day',
      max: 'Several days (worst)'
    },
    options: [
      { value: 'instant', label: 'Instant (< 1 hour)', score: 10, hours_range: '0-1' },
      { value: 'few_hours', label: 'Within a few hours (1-4h)', score: 8, hours_range: '1-4' },
      { value: 'same_day', label: 'Same day (4-8h)', score: 6, hours_range: '4-8' },
      { value: 'next_day', label: 'Next day (8-24h)', score: 4, hours_range: '8-24' },
      { value: 'few_days', label: '2-3 days', score: 2, hours_range: '24-72' },
      { value: 'week', label: 'A week or more', score: 0, hours_range: '72+' }
    ],
    scoring: 'mapped',
    is_inverse: false, // Already scored with faster = higher
    phase2_preview: {
      input_type: 'number',
      example: 'Average response time: ___ hours',
      scoring: 'benchmark_comparison'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME_LONG - "How long does X take?" (weeks/months)
  // Phase 1: Descriptive ranges
  // Phase 2: "X days average" with benchmark comparison
  // ═══════════════════════════════════════════════════════════════════════════
  time_long: {
    phase: 'semantic',
    input_type: 'select',
    labels: {
      min: 'Same week (best)',
      neutral: 'Same month',
      max: 'Several months (worst)'
    },
    options: [
      { value: 'same_week', label: 'Same week (1-7 days)', score: 10, days_range: '1-7' },
      { value: 'two_weeks', label: '1-2 weeks', score: 8, days_range: '7-14' },
      { value: 'same_month', label: '2-4 weeks', score: 6, days_range: '14-30' },
      { value: 'two_months', label: '1-2 months', score: 4, days_range: '30-60' },
      { value: 'quarter', label: '2-3 months', score: 2, days_range: '60-90' },
      { value: 'longer', label: '3+ months', score: 0, days_range: '90+' }
    ],
    scoring: 'mapped',
    is_inverse: false,
    phase2_preview: {
      input_type: 'number',
      example: 'Average cycle time: ___ days',
      scoring: 'benchmark_comparison'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MATURITY - "How mature is your process for X?"
  // Phase 1 & 2: Same (inherently categorical, no exact numbers)
  // ═══════════════════════════════════════════════════════════════════════════
  maturity: {
    phase: 'semantic',
    input_type: 'select',
    labels: {
      min: 'Level 1: Ad-hoc',
      neutral: 'Level 3: Defined',
      max: 'Level 5: Optimized'
    },
    options: [
      { value: 1, label: 'Level 1: Initial / Ad-hoc - No formal process', score: 2 },
      { value: 2, label: 'Level 2: Repeatable - Basic process, inconsistent', score: 4 },
      { value: 3, label: 'Level 3: Defined - Documented, standardized', score: 6 },
      { value: 4, label: 'Level 4: Managed - Measured, controlled', score: 8 },
      { value: 5, label: 'Level 5: Optimized - Continuous improvement', score: 10 }
    ],
    scoring: 'mapped',
    phase2_preview: null // Maturity is inherently categorical
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PERCEPTION - "How do you rate X?"
  // Phase 1 & 2: Same (inherently subjective, no exact numbers)
  // ═══════════════════════════════════════════════════════════════════════════
  perception: {
    phase: 'semantic',
    input_type: 'slider',
    scale: { min: 0, max: 10, step: 0.5 },
    labels: {
      min: 'Strongly Disagree',
      neutral: 'Neutral',
      max: 'Strongly Agree'
    },
    options: null,
    scoring: 'direct',
    phase2_preview: null // Perception is inherently subjective
  }
};

module.exports = RESPONSE_TYPE_CONFIG;
```

---

## SSI Scoring Impact

### Scoring Logic by Phase

```javascript
// server/services/QuestionValidationService.js

class QuestionValidationService {
  /**
   * Normalize response to 0-10 score
   * Works for both Phase 1 (semantic) and Phase 2 (quantitative)
   */
  static normalizeResponse(response, question) {
    const config = RESPONSE_TYPE_CONFIG[question.response_type];
    const phase = question.response_phase || 'semantic';

    // ═══════════════════════════════════════════════════════════
    // PHASE 1: Semantic Scoring (Sprint 11)
    // ═══════════════════════════════════════════════════════════
    if (phase === 'semantic') {
      switch (config.scoring) {
        case 'direct':
          // Perception: value IS the score
          return parseFloat(response.value) || 0;

        case 'mapped':
          // Frequency, Time, Maturity: lookup score from options
          const option = config.options.find(o =>
            o.value === response.value ||
            o.value === parseInt(response.value)
          );
          return option ? option.score : 5;

        case 'normalize':
          // Percentage: 0-100 → 0-10
          return config.normalization(parseFloat(response.value) || 0);
      }
    }

    // ═══════════════════════════════════════════════════════════
    // PHASE 2: Quantitative Scoring (Future)
    // ═══════════════════════════════════════════════════════════
    if (phase === 'quantitative') {
      const { numerator, denominator } = response;

      // Calculate actual percentage/rate
      const actualValue = denominator > 0 ? (numerator / denominator) * 100 : 0;

      // Compare to benchmarks if available
      if (question.quantitative_config?.benchmark_low != null &&
          question.quantitative_config?.benchmark_high != null) {
        return this.benchmarkScore(
          actualValue,
          question.quantitative_config.benchmark_low,
          question.quantitative_config.benchmark_high,
          question.is_inverse
        );
      }

      // Default: direct percentage normalization
      return Math.min(10, actualValue / 10);
    }

    return 5; // Default neutral
  }

  /**
   * Score based on benchmark comparison
   * Example: If benchmark_low=20%, benchmark_high=80%
   *          actualValue=60% → score = (60-20)/(80-20) * 10 = 6.67
   */
  static benchmarkScore(actualValue, benchmarkLow, benchmarkHigh, isInverse = false) {
    const range = benchmarkHigh - benchmarkLow;
    if (range <= 0) return 5;

    let normalized = (actualValue - benchmarkLow) / range;
    normalized = Math.max(0, Math.min(1, normalized)); // Clamp 0-1

    let score = normalized * 10;

    if (isInverse) {
      score = 10 - score;
    }

    return Math.round(score * 10) / 10; // One decimal place
  }
}
```

### Score Comparison: Before vs After

| Question Type | Before (Phase 0) | After Phase 1 | Future Phase 2 |
|---------------|------------------|---------------|----------------|
| "How often do orders require rework?" | User: slides to 3 (confused by "disagree/agree") → Score: 3 | User: selects "Often" → Score: 7.5 | User: enters 200/300 → 66.7% → Score: 6.7 |
| "What % of projects on time?" | User: slides to 7 (guessing) → Score: 7 | User: slides to 75% → Score: 7.5 | User: enters 45/60 → 75% → Score: 7.5 |
| "Response time to client issues?" | User: slides to 4 (?) → Score: 4 | User: selects "Same day" → Score: 6 | User: enters 6 hours → vs benchmark → Score: 7 |

### Migration & Compatibility

```javascript
// Assessment model tracking
scoring_version: {
  type: String,
  enum: ['1.0', '2.0', '3.0'],
  default: '2.0',
  description: '1.0=legacy, 2.0=Phase 1 semantic, 3.0=Phase 2 quantitative'
}

// No retroactive changes to existing assessments
// Dashboard can segment by scoring_version for trend analysis
```

---

## Stories (Sprint 11 Scope)

| Story | Points | Description |
|-------|--------|-------------|
| QV1 | 2 | Create `responseTypes.js` config + `QuestionValidationService` |
| QV2 | 1 | Add validation warnings to Question Library UI |
| QV3 | 2 | Update Assessment Form to use correct input type per response_type |
| **Total** | **5** | |

### QV1: Response Type Configuration (2 pts)

**Files**:
- NEW: `server/config/responseTypes.js` - Full config as specified above
- NEW: `server/services/QuestionValidationService.js` - Validation + scoring
- UPDATE: `server/routes/assessment-questions.js` - Add validation warnings endpoint

**Acceptance Criteria**:
- [ ] `RESPONSE_TYPE_CONFIG` exported with all 6 types
- [ ] Each type has `phase2_preview` for future planning
- [ ] `QuestionValidationService.validateQuestionText()` detects:
  - [ ] "how often" → suggests frequency
  - [ ] "what %" → suggests percentage
  - [ ] "how long/quickly" → suggests time_short/time_long
- [ ] `QuestionValidationService.normalizeResponse()` correctly scores
- [ ] Unit tests for all scoring paths

### QV2: Question Library Validation UI (1 pt)

**Files**:
- UPDATE: `client/pages/assessment-question-library.html`
- UPDATE: `client/pages/scripts/assessment-question-library.js`

**Acceptance Criteria**:
- [ ] When response_type changes, label preview updates to show correct labels
- [ ] Warning banner if question text doesn't match response_type
- [ ] Warning shows suggested response_type with "Change" button
- [ ] Options preview shows score mapping for dropdown types

### QV3: Assessment Form Input Types (2 pts)

**Files**:
- UPDATE: `client/pages/assessment-take.html`
- UPDATE: `client/js/assessment-form.js`

**Acceptance Criteria**:
- [ ] `perception` → Slider (0-10) with "Strongly Disagree → Strongly Agree"
- [ ] `frequency` → Dropdown with 5 options (Never → Always)
- [ ] `percentage` → Slider (0-100%) with "0% → 100%"
- [ ] `time_short` → Dropdown with 6 time options
- [ ] `time_long` → Dropdown with 6 duration options
- [ ] `maturity` → Dropdown with 5 maturity levels
- [ ] All responses store `normalized_value` correctly for SSI

---

## Testing Checklist

### Backend Tests

- [ ] `responseTypes.js` exports all 6 types with correct structure
- [ ] Each frequency option maps to correct score:
  - Never → 0, Rarely → 2.5, Sometimes → 5, Often → 7.5, Always → 10
- [ ] Percentage normalization: 75% → 7.5 score
- [ ] Time options have correct inverse scoring (faster = higher)
- [ ] Validation detects "how often" mismatch with perception type

### UI Tests

- [ ] Question Library: response_type change updates label preview
- [ ] Question Library: warning appears for semantic mismatch
- [ ] Assessment Form: perception shows slider
- [ ] Assessment Form: frequency shows dropdown
- [ ] Assessment Form: all inputs save correct normalized_value

### Integration Tests

- [ ] Create question with frequency type
- [ ] Take assessment, select "Often"
- [ ] Verify assessment.responses[].normalized_value = 7.5
- [ ] Verify SSI block score uses normalized value

---

## Future Work (Phase 2 - Not in Sprint 11)

When Phase 2 is implemented:

1. **Add quantitative input UI**:
   ```html
   <div class="quantitative-input">
     <input type="number" name="numerator" placeholder="200">
     <span>/</span>
     <input type="number" name="denominator" placeholder="300">
     <span>times in the last 12 months</span>
   </div>
   ```

2. **Industry benchmarks for scoring**:
   - Financial Services: 95% on-time delivery = score 10
   - Manufacturing: 85% on-time delivery = score 10
   - etc.

3. **Trend tracking with exact numbers**:
   - Q1: 200/300 (66.7%)
   - Q2: 250/300 (83.3%)
   - Delta: +16.6%

---

## Related Documents

- [AssessmentQuestion Model](../../../server/models/AssessmentQuestion.js)
- [Assessment Model](../../../server/models/Assessment.js)
- [Epic J: Assessment Credibility](./EPIC-J-ASSESSMENT-CREDIBILITY.md)
- [Sprint 11 Master Plan](./SPRINT-11-MASTER-PLAN.md)

---

**Feature Owner**: Product Team
**Sprint**: 11
**Dependencies**: None (can be implemented independently)
**Phase**: 1 of 2 (Semantic intermediary)
