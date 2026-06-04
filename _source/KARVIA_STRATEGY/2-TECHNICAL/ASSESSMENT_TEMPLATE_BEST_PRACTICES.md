# Assessment Template Best Practices Guide

**Version**: 1.0.0
**Created**: March 23, 2026
**Purpose**: Standard patterns for creating industry-specific assessment templates

---

## 1. The 12-Block MECE Framework

Karvia uses a **Mutually Exclusive, Collectively Exhaustive (MECE)** 12-block assessment model organized under 3 SSI dimensions.

### 1.1 Framework Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SSI FRAMEWORK - 12 BLOCKS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ⚡ SPEED (4 Blocks) - How fast the organization operates                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │ DELIVERY  │  │ DECISIONS │  │  CHANGE   │  │ RESPONSE  │               │
│  │ How fast  │  │ How quick │  │ How fast  │  │ How fast  │               │
│  │ work gets │  │ decisions │  │ org adapts│  │ to serve  │               │
│  │ done      │  │ are made  │  │ to change │  │ customers │               │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘               │
│                                                                             │
│  🛡️ STRENGTH (4 Blocks) - How resilient the organization is               │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │ FINANCIAL │  │OPERATIONS │  │  PEOPLE   │  │  QUALITY  │               │
│  │ Cash flow │  │ Process   │  │ Team      │  │ Product/  │               │
│  │ stability │  │ efficiency│  │ stability │  │ service   │               │
│  │ resilience│  │ & systems │  │ wellbeing │  │ standards │               │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘               │
│                                                                             │
│  🧠 INTELLIGENCE (4 Blocks) - How smart the organization is               │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  MARKET   │  │   DATA    │  │ STRATEGY  │  │ LEARNING  │               │
│  │ Customer  │  │ Analytics │  │ Long-term │  │ Continuous│               │
│  │ & market  │  │ & metrics │  │ planning  │  │ improve-  │               │
│  │ insight   │  │ driven    │  │ foresight │  │ ment      │               │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Block Definitions & Category Values

| Block (category) | Dimension | Description | What It Measures |
|------------------|-----------|-------------|------------------|
| `delivery` | speed | How fast work gets completed | Task completion velocity, sprint delivery |
| `decisions` | speed | How quickly decisions are made | Decision latency, approval cycles |
| `change` | speed | How fast org responds to change | Pivot speed, market responsiveness |
| `response` | speed | Speed of customer service | Response time, resolution speed |
| `financial` | strength | Cash flow, profitability stability | Financial runway, margin consistency |
| `operations` | strength | Operational consistency | Process reliability, uptime |
| `people` | strength | Team stability, burnout prevention | Retention, engagement, capacity |
| `quality` | strength | Product/service consistency | Defect rate, customer satisfaction |
| `market` | intelligence | Understanding of market/customers | Customer insights, market awareness |
| `data` | intelligence | Use of analytics in decisions | Data maturity, metric-driven culture |
| `strategy` | intelligence | Long-term planning capability | Vision clarity, roadmap quality |
| `learning` | intelligence | Continuous improvement mindset | Knowledge sharing, skill development |

### 1.3 Minimum Coverage Requirements

| Requirement | Value | Notes |
|-------------|-------|-------|
| Min questions per block | 1 | At least 1 question per block for coverage |
| Recommended per block | 2 | 2 questions per block = 24 core questions |
| Max questions per block | 4-5 | Beyond 5, consider splitting into sub-areas |
| Total minimum | 10 | Template must have at least 10 questions |
| Recommended total | 24-35 | Balance depth with completion time |

---

## 2. Scoring System Overview

All questions normalize to a **0-10 scale** for calculation. The `score` field in `response_options` determines the normalized value.

### 1.1 Standard Score Distribution

| Level | Score | Description |
|-------|-------|-------------|
| Excellent | 10 | Best-in-class, competitive advantage |
| Good | 8 | Above average, consistent performance |
| Acceptable | 6 | Meeting expectations, room for improvement |
| Needs Work | 4 | Below average, requires attention |
| Critical | 2 | Significant gap, business impact |
| None/Failing | 0-1 | No capability or severe deficiency |

**Guideline**: Use even increments (2, 4, 6, 8, 10) for 5-option questions.

---

## 2. Response Type Patterns

### 2.1 Percentage Questions (`response_type: "percentage"`)

For measuring rates, completion %, utilization, etc.

```json
{
  "response_type": "percentage",
  "scale": { "min": 0, "max": 100, "step": 5, "default": 50 },
  "labels": {
    "min_label": "Less than 50%",
    "max_label": "Over 95%",
    "neutral_label": "70-85%"
  },
  "response_options": [
    { "value": 50, "label": "Less than 50%", "score": 2 },
    { "value": 60, "label": "50-70%", "score": 4 },
    { "value": 77, "label": "70-85%", "score": 6 },
    { "value": 90, "label": "85-95%", "score": 8 },
    { "value": 97, "label": "Over 95%", "score": 10 }
  ]
}
```

**Use when**: Asking about rates, completion %, retention %, etc.

---

### 2.2 Time-Long Questions (`response_type: "time_long"`)

For measuring durations in weeks/months (cycle times, project durations).

```json
{
  "response_type": "time_long",
  "scale": { "min": 0, "max": 10, "step": 1, "default": 5 },
  "labels": {
    "min_label": "Over 2 months",
    "max_label": "Less than 1 week",
    "neutral_label": "2-4 weeks"
  },
  "response_options": [
    { "value": 1, "label": "Less than 1 week", "score": 10 },
    { "value": 2, "label": "1-2 weeks", "score": 8 },
    { "value": 3, "label": "2-4 weeks", "score": 6 },
    { "value": 6, "label": "1-2 months", "score": 4 },
    { "value": 9, "label": "Over 2 months", "score": 2 }
  ]
}
```

**Use when**: Measuring cycle times, project durations, implementation timelines.
**Note**: Faster = higher score (inverse relationship with actual time).

---

### 2.3 Time-Short Questions (`response_type: "time_short"`)

For measuring durations in hours/days (response times, resolution times).

```json
{
  "response_type": "time_short",
  "scale": { "min": 0, "max": 10, "step": 1, "default": 5 },
  "labels": {
    "min_label": "Over 2 days",
    "max_label": "Less than 1 hour",
    "neutral_label": "Same day"
  },
  "response_options": [
    { "value": 1, "label": "Less than 1 hour", "score": 10 },
    { "value": 3, "label": "1-4 hours", "score": 8 },
    { "value": 8, "label": "Same day", "score": 6 },
    { "value": 24, "label": "1-2 days", "score": 4 },
    { "value": 48, "label": "Over 2 days", "score": 2 }
  ]
}
```

**Use when**: Measuring response times, resolution times, quick turnarounds.

---

### 2.4 Maturity Questions (`response_type: "maturity"`)

For measuring process/capability maturity levels (CMM-style).

```json
{
  "response_type": "maturity",
  "scale": { "min": 0, "max": 10, "step": 2.5, "default": 5 },
  "labels": {
    "min_label": "None",
    "max_label": "Optimized",
    "neutral_label": "Defined"
  },
  "response_options": [
    { "value": 0, "label": "None - No defined process", "score": 0 },
    { "value": 1, "label": "Ad-hoc - Informal processes", "score": 2.5 },
    { "value": 2, "label": "Defined - Documented process", "score": 5 },
    { "value": 3, "label": "Managed - Measured and controlled", "score": 7.5 },
    { "value": 4, "label": "Optimized - Continuously improved", "score": 10 }
  ]
}
```

**Use when**: Measuring process maturity, capability levels, organizational readiness.

**Alternative 5-level pattern** (for simpler interpretation):
```json
{
  "response_options": [
    { "value": "none", "label": "No process exists", "score": 1 },
    { "value": "informal", "label": "Informal guidelines only", "score": 3 },
    { "value": "documented", "label": "Documented SOP exists", "score": 5 },
    { "value": "trained", "label": "SOP + staff training", "score": 7 },
    { "value": "optimized", "label": "Continuously optimized", "score": 10 }
  ]
}
```

---

### 2.5 Frequency Questions (`response_type: "frequency"`)

For measuring how often something occurs.

```json
{
  "response_type": "frequency",
  "scale": { "min": 0, "max": 10, "step": 2, "default": 5 },
  "labels": {
    "min_label": "Never",
    "max_label": "Continuous",
    "neutral_label": "Quarterly"
  },
  "response_options": [
    { "value": "never", "label": "Never/Only when required", "score": 2 },
    { "value": "annual", "label": "Annual", "score": 4 },
    { "value": "quarterly", "label": "Quarterly", "score": 6 },
    { "value": "monthly", "label": "Monthly", "score": 8 },
    { "value": "continuous", "label": "Continuous/Real-time", "score": 10 }
  ]
}
```

**Use when**: Measuring review cycles, audit frequency, monitoring cadence.

---

### 2.6 Perception Questions (`response_type: "perception"`)

For subjective 0-10 scale ratings (slider-based).

```json
{
  "response_type": "perception",
  "scale": { "min": 0, "max": 10, "step": 0.5, "default": 5 },
  "labels": {
    "min_label": "Critical gap, causing business impact",
    "max_label": "Excellent, competitive advantage",
    "neutral_label": "Acceptable, meeting expectations"
  }
}
```

**Use when**: Measuring subjective perceptions, confidence levels, satisfaction.
**Note**: No `response_options` needed - uses slider interface.

---

## 3. Question Structure Requirements

### 3.1 Required Fields

```javascript
{
  question_id: 'IND-XXX-1',     // REQUIRED: Unique ID
  text: 'Question text?',       // REQUIRED: The question
  dimension: 'speed',           // REQUIRED: speed | strength | intelligence
  category: 'delivery',         // REQUIRED: One of 12 MECE blocks
  module_type: 'industry',      // REQUIRED: core | industry | role
  industry: 'professional_services', // REQUIRED for industry module
  response_type: 'maturity',    // REQUIRED: Type of response
  weight: 1.0                   // REQUIRED: Question weight (0.5-2.0)
}
```

### 3.2 12-Block MECE Categories

| Dimension | Categories (Blocks) |
|-----------|---------------------|
| **Speed** | delivery, decisions, change, response |
| **Strength** | financial, operations, people, quality |
| **Intelligence** | market, data, strategy, learning |

**Rule**: Each question's `category` must match its `dimension`.

---

## 4. Question ID Conventions

### 4.1 ID Patterns

| Module | Pattern | Example |
|--------|---------|---------|
| Core | S1-S48, ST1-ST46, IN1-IN52 | S1, ST25, IN42 |
| Industry | IND-{CODE}-{N} | IND-LSC-1, IND-FIN-15 |
| Role | ROLE-{ROLE}-{N} | ROLE-EXEC-1, ROLE-MGR-5 |

### 4.2 Industry Codes

| Industry | Code | Example |
|----------|------|---------|
| Financial Services | FIN | IND-FIN-1 |
| Luxury Shooting Club | LSC | IND-LSC-1 |
| Home Services | HSV | IND-HSV-1 |
| Agriculture/Ranch | AGR | IND-AGR-1 |
| Technology | TECH | IND-TECH-1 |

---

## 5. Weight Guidelines

| Weight | Use Case |
|--------|----------|
| **1.5** | Safety-critical, high liability, existential risk |
| **1.2-1.3** | Core competency, competitive differentiator |
| **1.0** | Standard importance (default) |
| **0.8** | Nice-to-have, supplementary |

**Example**: Safety response time in shooting club = weight 1.5

---

## 6. Template Configuration

### 6.1 Dimension Weights

Weights must sum to 1.0 (100%).

| Industry Type | Speed | Strength | Intelligence |
|---------------|-------|----------|--------------|
| Service-heavy | 30% | 40% | 30% |
| Knowledge-work | 25% | 35% | 40% |
| Manufacturing | 35% | 45% | 20% |
| Default | 33% | 33% | 34% |

### 6.2 Thresholds

Standard thresholds:
```json
{
  "thresholds": {
    "needs_attention": 7.0,  // Below this = yellow
    "critical": 5.0          // Below this = red
  }
}
```

### 6.3 Minimum Questions

- **Total**: At least 10 questions
- **Per dimension**: At least 1 question
- **Recommended**: 20-35 questions for comprehensive coverage

---

## 7. Seed Script Structure

### 7.1 File Location

```
server/seeds/seed{IndustryName}Template.js
```

### 7.2 Script Template

```javascript
/**
 * Seed {Industry} Assessment Template
 * Creates a global template for {Industry Description}
 *
 * Template: X questions total (Y Speed, Z Strength, W Intelligence)
 * Weights: A% Speed, B% Strength, C% Intelligence
 *
 * IDEMPOTENT: Safe to run multiple times
 * SURGICAL: Only adds questions with IND-XXX- prefix
 *
 * Run: node server/seeds/seed{Industry}Template.js
 * Production: MONGODB_URI=<uri> node server/seeds/seed{Industry}Template.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AssessmentTemplate = require('../models/AssessmentTemplate');
const AssessmentQuestion = require('../models/AssessmentQuestion');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/karvia_business';

const QUESTIONS = [
  // ... questions
];

const TEMPLATE = {
  template_id: 'SSI-{INDUSTRY-CODE}',
  name: 'SSI Pulse – {Industry Name}',
  description: 'Description...',
  category: '{category}',
  is_global: true,
  is_active: true,
  company_id: null,
  created_by: null,
  dimensions: {
    speed: { weight: 0.30, thresholds: {...}, selected_questions: [...] },
    strength: { weight: 0.40, thresholds: {...}, selected_questions: [...] },
    intelligence: { weight: 0.30, thresholds: {...}, selected_questions: [...] }
  }
};

async function seed() {
  // 1. Connect
  // 2. Safety check (no conflicts)
  // 3. Upsert questions
  // 4. Verify block coverage
  // 5. Create/update template
  // 6. Display summary
}

seed();
```

---

## 8. Validation Checklist

Before running seed script:

- [ ] Question IDs follow `IND-{CODE}-{N}` pattern
- [ ] All questions have required fields
- [ ] Each category matches its dimension
- [ ] response_options have value, label, score
- [ ] Scores use 0-10 scale
- [ ] Template weights sum to 1.0
- [ ] At least 10 total questions
- [ ] Each dimension has at least 1 question
- [ ] Template ID is unique (`SSI-{CODE}`)
- [ ] No conflicting question IDs with existing data

---

## 9. Running in Production

### 9.1 Local Test First

```bash
# Test locally
node server/seeds/seedLuxuryShootingClubTemplate.js
```

### 9.2 Production Deploy

```bash
# Set production connection string
MONGODB_URI="mongodb+srv://..." node server/seeds/seedLuxuryShootingClubTemplate.js
```

### 9.3 Verify in Database

```javascript
// MongoDB shell
db.assessment_templates.findOne({ template_id: 'SSI-LUXURY-SHOOTING-CLUB' })
db.assessment_questions.find({ question_id: /^IND-LSC/ }).count()
```

---

## 10. Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|------------------|
| Score values outside 0-10 | Normalize all scores to 0-10 |
| Category doesn't match dimension | delivery, decisions, change, response → speed |
| Missing response_options for non-perception | Always include options for discrete responses |
| Weight > 2.0 or < 0.5 | Keep weights between 0.5-1.5 |
| Template weights don't sum to 1.0 | Always verify 30% + 40% + 30% = 100% |
| Hardcoded MongoDB URI | Use process.env.MONGODB_URI |
| Non-idempotent script | Use upsert pattern |

---

## 11. Block-Level Scoring Aggregation

### 11.1 How Scores Roll Up

The diagnostic engine calculates scores at multiple levels:

```
Question Score (0-10)
      ↓ (weighted average)
Block Score (0-10) - e.g., "delivery" block
      ↓ (average of 4 blocks)
Dimension Score (0-10) - e.g., "speed" dimension
      ↓ (weighted by dimension.weight)
Overall SSI Score (0-10)
```

### 11.2 Block Score Calculation

```javascript
// For each block (e.g., "delivery")
blockScore = Σ(question.score × question.weight) / Σ(question.weight)
```

### 11.3 Dimension Score Calculation

```javascript
// For each dimension (e.g., "speed")
dimensionScore = average(deliveryScore, decisionsScore, changeScore, responseScore)
```

### 11.4 Overall Score Calculation

```javascript
overallScore = (
  dimensionScores.speed × dimensions.speed.weight +      // e.g., 0.30
  dimensionScores.strength × dimensions.strength.weight + // e.g., 0.40
  dimensionScores.intelligence × dimensions.intelligence.weight // e.g., 0.30
)
```

### 11.5 Threshold Interpretation

| Score Range | Status | Color |
|-------------|--------|-------|
| 7.0 - 10.0 | Healthy | Green |
| 5.0 - 6.9 | Needs Attention | Yellow |
| 0.0 - 4.9 | Critical | Red |

### 11.6 Industry Template Scoring Considerations

When creating industry templates, ensure:
- **Safety-critical blocks** have higher question weights (1.3-1.5)
- **All 12 blocks covered** for complete organizational health picture
- **Block distribution** matches industry priorities (more operations questions for manufacturing, more market questions for services)

---

## 12. Quick Reference Checklist

```
Before seeding a new template:

□ Question IDs follow IND-{CODE}-{N} pattern
□ All 12 blocks have at least 1 question
□ Each question's category matches its dimension:
    - delivery, decisions, change, response → speed
    - financial, operations, people, quality → strength
    - market, data, strategy, learning → intelligence
□ response_options use standard scoring patterns (0, 2.5, 5, 7.5, 10)
□ Template weights sum to 1.0 (100%)
□ Safety-critical questions have weight 1.3-1.5
□ At least 10 total questions
□ Template ID is unique (SSI-{INDUSTRY-CODE})
□ Script is idempotent (uses upsert)
□ Test locally before production
```

---

**Document Owner**: Karvia Engineering
**Last Updated**: March 23, 2026
