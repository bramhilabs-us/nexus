# Epic QA: Question-Answer Credibility System

**Sprint**: 11
**Story Points**: 13 pts
**Priority**: P0
**Created**: January 20, 2026
**Status**: PLANNING

---

## Problem Statement

Assessment questions have **fundamental design flaws** that make SSI scores unreliable:

### Issue 1: Semantic Mismatch (Labels)
Questions show wrong answer scales:
- "How often do orders require rework?" → Shows "Strongly Disagree → Strongly Agree"
- Should show: "Never → Always"

### Issue 2: Unscorable Questions (Structure)
Many questions **cannot be meaningfully answered with any scale**:
- "Why do customers continue to choose us?" → Asks for **reasons** (text answer)
- "Which services generate predictable cash flow?" → Asks for **selection** (multiple choice)
- "What creates trust when issues arise?" → Asks for **factors** (list)

### Audit Results

**Air Products Template (45 questions)**:
| Status | Count | % |
|--------|-------|---|
| Scoreable | 28 | 62% |
| Unscorable | 17 | **38%** |

**Main SSI Library (178 questions)**:
| Status | Count | % |
|--------|-------|---|
| Scoreable | 165+ | ~93% |
| Needs Label Fix | 10-15 | ~7% |

**Total Impact**: ~20% of all questions across templates need attention.

---

## Root Cause Analysis

### Question Interrogative Types

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        QUESTION TYPE CLASSIFICATION                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  SCOREABLE INTERROGATIVES (Can map to 0-10 score)                              │
│  ─────────────────────────────────────────────────                              │
│                                                                                 │
│  HOW MUCH / HOW MANY         → Numeric input → Direct score                    │
│    "How many customer complaints per month?"                                    │
│                                                                                 │
│  HOW OFTEN / HOW FREQUENTLY  → Frequency scale → Mapped score                  │
│    "How often do orders require rework?"                                        │
│                                                                                 │
│  HOW LONG / HOW QUICKLY      → Time scale → Mapped score (inverse)             │
│    "How long does it take to resolve issues?"                                   │
│                                                                                 │
│  HOW EFFECTIVELY / HOW WELL  → Rating scale → Direct score                     │
│    "How effectively does training translate to behavior?"                       │
│                                                                                 │
│  TO WHAT EXTENT              → Extent scale → Direct score                     │
│    "To what extent do you agree with..."                                        │
│                                                                                 │
│  WHAT PERCENTAGE / WHAT RATE → Percentage → Normalized score                   │
│    "What percentage of deliveries are on time?"                                 │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  UNSCORABLE INTERROGATIVES (Cannot map to score without rewrite)               │
│  ──────────────────────────────────────────────────────────────                 │
│                                                                                 │
│  WHY                         → Asks for REASONS (text/explanation)             │
│    ❌ "Why do customers choose us?" → Cannot score                             │
│    ✅ "How likely are customers to choose us?" → CAN score                     │
│                                                                                 │
│  WHAT (open-ended)           → Asks for THINGS/FACTORS/EXAMPLES                │
│    ❌ "What creates trust?" → Cannot score                                      │
│    ✅ "How strong is customer trust?" → CAN score                              │
│                                                                                 │
│  WHICH (open-ended)          → Asks for SELECTION without options              │
│    ❌ "Which services are most profitable?" → Cannot score                      │
│    ✅ "What % of revenue comes from top 3 services?" → CAN score               │
│                                                                                 │
│  WHERE                       → Asks for LOCATION/AREA                          │
│    ❌ "Where do we outperform?" → Cannot score                                  │
│    ✅ "How consistently do we outperform on margins?" → CAN score              │
│                                                                                 │
│  DESCRIBE / EXPLAIN          → Asks for NARRATIVE                              │
│    ❌ "Describe your risk management" → Cannot score                            │
│    ✅ "How mature is your risk management?" → CAN score                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Solution Design

### Three-Part Solution

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        QUESTION-ANSWER CREDIBILITY SYSTEM                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  PART 1: QUESTION AUDIT & CLASSIFICATION (QA1-QA2)                             │
│  ─────────────────────────────────────────────────                              │
│  • Audit all questions in all templates                                         │
│  • Classify by interrogative type                                               │
│  • Flag unscorable questions                                                    │
│  • Generate rewrite recommendations                                             │
│                                                                                 │
│  PART 2: QUESTION REWRITE (QA3-QA4)                                            │
│  ─────────────────────────────────                                              │
│  • Rewrite unscorable questions to scoreable format                            │
│  • Add correct response_type to all questions                                   │
│  • Preserve original intent while making scoreable                              │
│  • Update seed files                                                            │
│                                                                                 │
│  PART 3: ANSWER TYPE ENFORCEMENT (QA5-QA6)                                     │
│  ─────────────────────────────────────────                                      │
│  • Create responseTypes.js config                                               │
│  • Validation service for question/answer matching                              │
│  • Assessment Form renders correct input per type                               │
│  • Question Library shows validation warnings                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Stories

| Story | Points | Description | Deliverable |
|-------|--------|-------------|-------------|
| QA1 | 2 | Question Audit Script | Script that audits all questions, outputs classification |
| QA2 | 1 | Question Classification Report | Markdown report of all questions by scoreability |
| QA3 | 3 | Air Products Question Rewrite | Rewrite 17 unscorable questions |
| QA4 | 2 | Core Library Question Fixes | Fix ~15 questions with wrong response_type |
| QA5 | 3 | Response Type Config + Validation Service | `responseTypes.js` + `QuestionValidationService` |
| QA6 | 2 | Assessment Form Input Types | Render correct input per response_type |
| **Total** | **13** | | |

---

## QA1: Question Audit Script (2 pts)

Create automated audit script that analyzes all questions.

**File**: `server/scripts/auditQuestionScoreability.js`

```javascript
/**
 * Question Scoreability Audit Script
 *
 * Analyzes all assessment questions and classifies by scoreability.
 * Outputs JSON report and markdown summary.
 *
 * Run: node server/scripts/auditQuestionScoreability.js
 */

const SCOREABLE_PATTERNS = {
  // Direct rating questions
  effectiveness: /^how (effectively|well|successfully|confidently)/i,
  frequency: /^how (often|frequently|regularly|consistently)/i,
  time: /^how (long|quickly|fast|soon)/i,
  extent: /^(to what extent|how much|how many)/i,
  percentage: /^what (percentage|%|rate|proportion)/i,
  satisfaction: /^how (satisfied|happy|comfortable)/i,
  likelihood: /^how (likely|probable)/i,
  maturity: /^(how mature|what (level|stage))/i,

  // Statement agreement (can use agree/disagree)
  statement: /^(I |we |our |the )/i
};

const UNSCORABLE_PATTERNS = {
  why: /^why /i,
  what_open: /^what (creates|causes|drives|factors|signals|indicators|processes|practices|metrics|services|risks)/i,
  which_open: /^which (services|relationships|processes|areas|teams)/i,
  where: /^where (do|does|are|is)/i,
  describe: /^(describe|explain|list)/i
};

function classifyQuestion(text) {
  // Check unscorable first (more specific)
  for (const [type, pattern] of Object.entries(UNSCORABLE_PATTERNS)) {
    if (pattern.test(text)) {
      return { scoreable: false, type, pattern: pattern.toString() };
    }
  }

  // Check scoreable patterns
  for (const [type, pattern] of Object.entries(SCOREABLE_PATTERNS)) {
    if (pattern.test(text)) {
      return { scoreable: true, type, pattern: pattern.toString() };
    }
  }

  // Default: needs manual review
  return { scoreable: 'review', type: 'unknown', pattern: null };
}

function suggestRewrite(question) {
  const text = question.text;

  // Why → How likely/How strongly
  if (/^why /i.test(text)) {
    return text.replace(/^why (do|does|are|is) /i, 'How likely are ')
               .replace(/\?$/, ' to happen?');
  }

  // What creates → How effectively
  if (/^what creates /i.test(text)) {
    return text.replace(/^what creates /i, 'How effectively do you create ')
               .replace(/\?$/, '?');
  }

  // Which X are most → What % of X
  if (/^which .* (are|is) (the )?most /i.test(text)) {
    return text.replace(/^which (.*) (are|is) (the )?most/i, 'What percentage of $1 are highly')
               .replace(/\?$/, '?');
  }

  // Where do we → How consistently do we
  if (/^where do (we|you) /i.test(text)) {
    return text.replace(/^where do (we|you) /i, 'How consistently do $1 ')
               .replace(/\?$/, '?');
  }

  // What signals/indicators → How reliably can you identify
  if (/^what (signals|indicators) /i.test(text)) {
    return text.replace(/^what (signals|indicators) /i, 'How reliably can you identify when ')
               .replace(/\?$/, '?');
  }

  return '[MANUAL REWRITE NEEDED] ' + text;
}

// Export for use
module.exports = { classifyQuestion, suggestRewrite, SCOREABLE_PATTERNS, UNSCORABLE_PATTERNS };
```

**Acceptance Criteria**:
- [ ] Script classifies all 223 questions (178 core + 45 Air Products)
- [ ] Outputs JSON report with classification
- [ ] Generates markdown summary
- [ ] Suggests rewrites for unscorable questions

---

## QA2: Question Classification Report (1 pt)

Generate comprehensive audit report.

**File**: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-11 (Planned)/QUESTION-AUDIT-REPORT.md`

**Structure**:
```markdown
# Question Scoreability Audit Report

## Summary
- Total Questions: 223
- Scoreable: X (Y%)
- Needs Label Fix: X (Y%)
- Unscorable (Rewrite Required): X (Y%)

## By Template
| Template | Total | Scoreable | Label Fix | Rewrite |
|----------|-------|-----------|-----------|---------|
| SSI Core Library | 178 | X | X | X |
| Air Products | 45 | X | X | X |

## Unscorable Questions (Detailed)
### Air Products Template
| ID | Original | Issue | Suggested Rewrite |
|----|----------|-------|-------------------|
| ST46 | Why do customers... | WHY question | How likely are customers... |
...
```

**Acceptance Criteria**:
- [ ] Report lists all unscorable questions
- [ ] Each has suggested rewrite
- [ ] Summary statistics by template
- [ ] Approved by product team

---

## QA3: Air Products Question Rewrite (3 pts)

Rewrite all 17 unscorable Air Products questions.

**Rewrite Guide**:

| ID | Original (Unscorable) | Rewritten (Scoreable) | Response Type |
|----|----------------------|----------------------|---------------|
| ST36 | "Where do we consistently outperform expectations on margins?" | "How consistently do we outperform expectations on margins?" | `effectiveness` |
| ST37 | "Which services generate the most predictable cash flow?" | "What percentage of revenue comes from predictable cash flow sources?" | `percentage` |
| ST38 | "What financial processes work smoothly even under pressure?" | "How smoothly do financial processes run under pressure?" | `effectiveness` |
| ST39 | "What risks are we especially well prepared to handle?" | "How well prepared are we to handle major operational risks?" | `effectiveness` |
| ST41 | "What early-warning indicators reliably signal emerging risk?" | "How reliably do our early-warning indicators signal emerging risks?" | `effectiveness` |
| ST42 | "What safety practices are followed consistently without enforcement?" | "How consistently are safety practices followed without enforcement?" | `frequency` |
| ST43 | "Where do employees proactively prevent incidents or near misses?" | "How often do employees proactively prevent incidents or near misses?" | `frequency` |
| ST45 | "What safety metrics best demonstrate strong performance?" | "How effectively do our safety metrics demonstrate performance?" | `effectiveness` |
| ST46 | "Why do customers continue to choose us over alternatives?" | "How likely are customers to choose us over alternatives?" | `perception` |
| ST47 | "Which customer relationships are the most durable?" | "What percentage of customer relationships last 5+ years?" | `percentage` |
| ST48 | "What creates trust when issues arise?" | "How effectively do we build trust when issues arise?" | `effectiveness` |
| ST50 | "What signals indicate a customer relationship is strong and stable?" | "How reliably can you identify strong and stable customer relationships?" | `effectiveness` |
| IN34 | "What data signals predict issues before they occur?" | "How effectively does our data predict issues before they occur?" | `effectiveness` |
| IN37 | "What early indicators show market demand is shifting?" | "How reliably can you detect when market demand is shifting?" | `effectiveness` |
| IN39 | "What local market insights give us an advantage?" | "How strong is our local market intelligence advantage?" | `perception` |
| IN41 | "What feedback loops support real-time learning?" | "How effectively do feedback loops support real-time learning?" | `effectiveness` |
| IN47 | "What signals show a competitor gaining or losing advantage?" | "How reliably can you detect competitor position changes?" | `effectiveness` |

**Acceptance Criteria**:
- [ ] All 17 questions rewritten
- [ ] Each has correct `response_type` assigned
- [ ] Seed file updated
- [ ] Questions preserve original business intent
- [ ] Rewritten questions reviewed by product team

---

## QA4: Core Library Question Fixes (2 pts)

Fix response_type for questions that need label adjustments.

**Examples from Core Library**:

| ID | Text | Current response_type | Correct response_type |
|----|------|----------------------|----------------------|
| S3 | "How often do projects experience last-minute rushes?" | perception (default) | `frequency` |
| S5 | "How often do blockers get resolved within the same day?" | perception (default) | `frequency` |
| S33 | "How long does it typically take from request to confirmation?" | perception (default) | `time_long` |
| S43 | "What is the average lead time from order to delivery?" | perception (default) | `time_long` |
| S50 | "What is the typical time from discovery to draft delivery?" | perception (default) | `time_long` |
| ST47 | "What percentage of your revenue is recurring?" | perception (default) | `percentage` |

**Update Pattern**:
```javascript
// In seed file, add explicit response_type
{
  question_id: 'S3',
  text: 'How often do projects experience last-minute rushes to meet deadlines?',
  dimension: 'speed',
  category: 'delivery',
  response_type: 'frequency',  // ADD THIS
  is_inverse: true,  // More often = worse
  ...
}
```

**Acceptance Criteria**:
- [ ] All "How often" questions → `frequency`
- [ ] All "How long/quickly" questions → `time_short` or `time_long`
- [ ] All "What percentage" questions → `percentage`
- [ ] All "How mature/what level" questions → `maturity`
- [ ] Seed files updated with correct response_type

---

## QA5: Response Type Config + Validation Service (3 pts)

Create centralized configuration and validation.

**File 1**: `server/config/responseTypes.js`

```javascript
/**
 * Response Type Configuration
 *
 * Defines answer formats, labels, and scoring for each question type.
 * Phase 1: Semantic scales (Never→Always, etc.)
 * Phase 2: Exact quantitative inputs (future)
 */

const RESPONSE_TYPES = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PERCEPTION - Subjective rating (default)
  // ═══════════════════════════════════════════════════════════════════════════
  perception: {
    input_type: 'slider',
    scale: { min: 0, max: 10, step: 0.5 },
    labels: {
      min: 'Strongly Disagree',
      neutral: 'Neutral',
      max: 'Strongly Agree'
    },
    scoring: 'direct',
    description: 'Subjective perception or agreement rating'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTIVENESS - How well/effectively something works
  // ═══════════════════════════════════════════════════════════════════════════
  effectiveness: {
    input_type: 'slider',
    scale: { min: 0, max: 10, step: 0.5 },
    labels: {
      min: 'Not at all effective',
      neutral: 'Moderately effective',
      max: 'Extremely effective'
    },
    scoring: 'direct',
    description: 'Effectiveness or quality rating'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FREQUENCY - How often something happens
  // ═══════════════════════════════════════════════════════════════════════════
  frequency: {
    input_type: 'select',
    options: [
      { value: 0, label: 'Never (0%)', score: 0 },
      { value: 1, label: 'Rarely (1-25%)', score: 2.5 },
      { value: 2, label: 'Sometimes (26-50%)', score: 5 },
      { value: 3, label: 'Often (51-75%)', score: 7.5 },
      { value: 4, label: 'Always (76-100%)', score: 10 }
    ],
    labels: {
      min: 'Never',
      neutral: 'Sometimes',
      max: 'Always'
    },
    scoring: 'mapped',
    description: 'Frequency of occurrence'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PERCENTAGE - What % of something
  // ═══════════════════════════════════════════════════════════════════════════
  percentage: {
    input_type: 'slider',
    scale: { min: 0, max: 100, step: 5 },
    labels: {
      min: '0%',
      neutral: '50%',
      max: '100%'
    },
    scoring: 'normalize', // value / 10
    description: 'Percentage or rate'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME_SHORT - Duration in hours/days
  // ═══════════════════════════════════════════════════════════════════════════
  time_short: {
    input_type: 'select',
    options: [
      { value: 'instant', label: 'Instant (< 1 hour)', score: 10 },
      { value: 'hours', label: 'Within hours (1-4h)', score: 8 },
      { value: 'same_day', label: 'Same day (4-8h)', score: 6 },
      { value: 'next_day', label: 'Next day (8-24h)', score: 4 },
      { value: 'days', label: '2-3 days', score: 2 },
      { value: 'week', label: 'A week or more', score: 0 }
    ],
    labels: {
      min: 'Instant',
      neutral: 'Same day',
      max: 'Week+'
    },
    scoring: 'mapped',
    is_inverse: true, // Faster is better
    description: 'Short duration (hours to days)'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIME_LONG - Duration in weeks/months
  // ═══════════════════════════════════════════════════════════════════════════
  time_long: {
    input_type: 'select',
    options: [
      { value: 'same_week', label: 'Same week (1-7 days)', score: 10 },
      { value: 'two_weeks', label: '1-2 weeks', score: 8 },
      { value: 'same_month', label: '2-4 weeks', score: 6 },
      { value: 'two_months', label: '1-2 months', score: 4 },
      { value: 'quarter', label: '2-3 months', score: 2 },
      { value: 'longer', label: '3+ months', score: 0 }
    ],
    labels: {
      min: 'Same week',
      neutral: 'Same month',
      max: '3+ months'
    },
    scoring: 'mapped',
    is_inverse: true,
    description: 'Long duration (weeks to months)'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MATURITY - Process/capability maturity level
  // ═══════════════════════════════════════════════════════════════════════════
  maturity: {
    input_type: 'select',
    options: [
      { value: 1, label: 'Level 1: Initial / Ad-hoc', score: 2 },
      { value: 2, label: 'Level 2: Repeatable', score: 4 },
      { value: 3, label: 'Level 3: Defined', score: 6 },
      { value: 4, label: 'Level 4: Managed', score: 8 },
      { value: 5, label: 'Level 5: Optimized', score: 10 }
    ],
    labels: {
      min: 'Ad-hoc',
      neutral: 'Defined',
      max: 'Optimized'
    },
    scoring: 'mapped',
    description: 'Process maturity level (CMMI-style)'
  }
};

module.exports = RESPONSE_TYPES;
```

**File 2**: `server/services/QuestionValidationService.js`

```javascript
const RESPONSE_TYPES = require('../config/responseTypes');

class QuestionValidationService {
  /**
   * Validate question text matches response_type
   */
  static validateQuestion(text, responseType) {
    const warnings = [];
    const textLower = text.toLowerCase();

    // Frequency detection
    if (/^how (often|frequently|regularly)/.test(textLower) && responseType !== 'frequency') {
      warnings.push({
        type: 'type_mismatch',
        message: 'Question asks "how often" but response_type is not "frequency"',
        suggested: 'frequency'
      });
    }

    // Time detection
    if (/^how (long|quickly|fast)/.test(textLower) &&
        !['time_short', 'time_long'].includes(responseType)) {
      warnings.push({
        type: 'type_mismatch',
        message: 'Question asks about time/duration but response_type is not time-based',
        suggested: 'time_short'
      });
    }

    // Percentage detection
    if (/^what (percentage|%)/.test(textLower) && responseType !== 'percentage') {
      warnings.push({
        type: 'type_mismatch',
        message: 'Question asks for percentage but response_type is not "percentage"',
        suggested: 'percentage'
      });
    }

    // Unscorable detection (should have been rewritten)
    if (/^(why |what creates|which .* are most|where do)/.test(textLower)) {
      warnings.push({
        type: 'unscorable',
        message: 'Question cannot be scored with any scale - needs rewrite',
        suggested: null
      });
    }

    return warnings;
  }

  /**
   * Normalize response value to 0-10 score
   */
  static normalizeResponse(value, responseType, isInverse = false) {
    const config = RESPONSE_TYPES[responseType];
    if (!config) return parseFloat(value) || 5;

    let score;

    switch (config.scoring) {
      case 'direct':
        score = parseFloat(value) || 5;
        break;

      case 'mapped':
        const option = config.options.find(o => o.value === value || o.value === parseInt(value));
        score = option ? option.score : 5;
        break;

      case 'normalize':
        score = (parseFloat(value) || 0) / 10;
        break;

      default:
        score = parseFloat(value) || 5;
    }

    // Handle inverse scoring
    if (isInverse || config.is_inverse) {
      score = 10 - score;
    }

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Get response configuration for a question type
   */
  static getResponseConfig(responseType) {
    return RESPONSE_TYPES[responseType] || RESPONSE_TYPES.perception;
  }
}

module.exports = QuestionValidationService;
```

**Acceptance Criteria**:
- [ ] `responseTypes.js` exports all 7 types (perception, effectiveness, frequency, percentage, time_short, time_long, maturity)
- [ ] `QuestionValidationService.validateQuestion()` detects mismatches
- [ ] `QuestionValidationService.normalizeResponse()` correctly scores all types
- [ ] Unit tests for all response types

---

## QA6: Assessment Form Input Types (2 pts)

Update Assessment Form to render correct input based on response_type.

**Changes to**: `client/js/assessment-form.js` (or equivalent)

```javascript
const RESPONSE_TYPES = {
  perception: {
    render: (question) => `
      <div class="response-slider">
        <input type="range" min="0" max="10" step="0.5" value="5"
               name="${question.question_id}" />
        <div class="slider-labels">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
      </div>
    `
  },

  frequency: {
    render: (question) => `
      <select name="${question.question_id}" class="response-select">
        <option value="">Select frequency...</option>
        <option value="0">Never (0%)</option>
        <option value="1">Rarely (1-25%)</option>
        <option value="2">Sometimes (26-50%)</option>
        <option value="3">Often (51-75%)</option>
        <option value="4">Always (76-100%)</option>
      </select>
    `
  },

  percentage: {
    render: (question) => `
      <div class="response-percentage">
        <input type="range" min="0" max="100" step="5" value="50"
               name="${question.question_id}" />
        <div class="slider-labels">
          <span>0%</span>
          <span>100%</span>
        </div>
        <span class="percentage-value">50%</span>
      </div>
    `
  },

  time_short: {
    render: (question) => `
      <select name="${question.question_id}" class="response-select">
        <option value="">Select timeframe...</option>
        <option value="instant">Instant (< 1 hour)</option>
        <option value="hours">Within hours (1-4h)</option>
        <option value="same_day">Same day (4-8h)</option>
        <option value="next_day">Next day (8-24h)</option>
        <option value="days">2-3 days</option>
        <option value="week">A week or more</option>
      </select>
    `
  },

  // ... similar for time_long, maturity, effectiveness
};

function renderQuestionInput(question) {
  const responseType = question.response_type || 'perception';
  const config = RESPONSE_TYPES[responseType];

  if (!config) {
    console.warn(`Unknown response_type: ${responseType}, falling back to perception`);
    return RESPONSE_TYPES.perception.render(question);
  }

  return config.render(question);
}
```

**Acceptance Criteria**:
- [ ] `perception` → Slider with "Strongly Disagree → Strongly Agree"
- [ ] `effectiveness` → Slider with "Not effective → Extremely effective"
- [ ] `frequency` → Dropdown with "Never, Rarely, Sometimes, Often, Always"
- [ ] `percentage` → Slider with "0% → 100%" and value display
- [ ] `time_short` → Dropdown with hour/day options
- [ ] `time_long` → Dropdown with week/month options
- [ ] `maturity` → Dropdown with 5 maturity levels
- [ ] All inputs correctly save to assessment response

---

## Implementation Schedule

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 1 | QA1 | 2 | Audit script |
| 2 | QA2 | 1 | Audit report |
| 3-4 | QA3 | 3 | Air Products rewrite (17 questions) |
| 5 | QA4 | 2 | Core library fixes |
| 6-7 | QA5 | 3 | Response config + validation service |
| 8 | QA6 | 2 | Assessment form inputs |
| **Total** | | **13** | 8 days |

---

## SSI Scoring Impact

### Before Epic QA

```
User takes assessment:
  Q: "How often do orders require rework?"
  A: Slider showing "Strongly Disagree ─────── Strongly Agree"
  User thinks: "I disagree that rework happens often"
  User slides to: 3

  Actual reality: Rework happens 60% of the time
  Expected score: 6 (Often)
  Actual score: 3 (Disagree)

  ERROR: Score understated by 3 points!
```

### After Epic QA

```
User takes assessment:
  Q: "How often do orders require rework?"
  A: Dropdown showing "Never | Rarely | Sometimes | Often | Always"
  User selects: "Often (51-75%)"

  System stores: value = 3
  System calculates: score = 7.5 (is_inverse=true → 2.5)

  Result: Accurate SSI score reflecting actual business reality
```

---

## Success Criteria

### Epic QA Success Criteria
- [ ] All questions audited and classified
- [ ] 0 unscorable questions remain (all rewritten)
- [ ] All questions have correct response_type
- [ ] Assessment Form renders 7 different input types
- [ ] SSI scores use correct normalization per response_type
- [ ] No regressions on existing assessments (backward compatible)

### Sprint 11 Integration
- [ ] Epic QA completes before Epic J (Assessment Credibility)
- [ ] Question rewrites reviewed by product team
- [ ] responseTypes.js used by Assessment Form

---

## Related Documents

- [AssessmentQuestion Model](../../../server/models/AssessmentQuestion.js)
- [Air Products Seed Script](../../../server/scripts/seedAirProductsTemplate.js)
- [SSI Questions Library](../../../server/config/ssi-questions-library.json)
- [Epic J: Assessment Credibility](../SPRINT-10%20(Complete)/EPIC-J-ASSESSMENT-CREDIBILITY.md)
- [Sprint 11 Master Plan](./SPRINT-11-MASTER-PLAN.md)

---

**Epic Owner**: Product Team
**Sprint**: 11
**Dependencies**: None (can start immediately)
**Blocks**: Epic J (Assessment Credibility) should use fixed questions
