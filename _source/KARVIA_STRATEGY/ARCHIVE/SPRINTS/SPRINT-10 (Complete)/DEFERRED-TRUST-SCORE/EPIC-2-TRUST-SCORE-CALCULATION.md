# EPIC 2: Trust Score Calculation - iBrain Intelligence Layer

**Epic ID**: SPRINT-10-EPIC-2
**Created**: December 21, 2025
**Updated**: December 21, 2025
**Status**: Planning
**Priority**: P0
**Story Points**: 65
**Sprints**: 11-13
**Owner**: iBrain Team

---

## Executive Summary

This EPIC implements the **complete intelligence layer** in iBrain for the Trust Score system. Following the API-only architecture, **all data storage and calculations happen in iBrain**:

1. **Company & Member Storage** - iBrain is the source of truth
2. **Consent Management** - GDPR-compliant storage in iBrain
3. **All Score Calculations** - Trust, Execution, Passion, Empathy
4. **Industry Benchmarks** - Weight configurations per industry
5. **Qualitative Analysis** - LLM-powered theme extraction
6. **Action Plans & Nudges** - AI-generated recommendations

**Karvia's Role**: API consumer only (see EPIC-1)

---

## Data Model: iBrain Collections

### 1. Companies Collection

**Location**: `iBrain/engines/iam-engine/models/Company.js` (NEW)

```javascript
const companySchema = new mongoose.Schema({
  // iBrain Universal ID
  ibrain_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // External App References
  external_refs: {
    karvia: { type: String, index: true },      // Karvia company_id
    prodify: { type: String, index: true },     // Future: Prodify org_id
    // Add more apps as needed
  },

  // Company Profile
  name: { type: String, required: true },
  industry: {
    type: String,
    enum: ['cattle_livestock', 'consulting', 'marketing', 'it_services',
           'professional_services', 'healthcare', 'manufacturing', 'retail', 'other'],
    required: true
  },
  size_category: {
    type: String,
    enum: ['small', 'medium', 'large'],  // 1-50, 51-200, 201-500
    required: true
  },
  employee_count: Number,
  region: String,
  fiscal_year_start: { type: Number, min: 1, max: 12, default: 1 },

  // Trust Score (Calculated & Stored here)
  trust_score: {
    overall: { type: Number, min: 0, max: 100 },
    transparency: { type: Number, min: 0, max: 100 },
    feedback: { type: Number, min: 0, max: 100 },
    culture: { type: Number, min: 0, max: 100 },
    trend: { type: String, enum: ['improving', 'stable', 'declining'] },
    trend_delta: Number,
    calculated_at: Date
  },

  // Execution Score (Calculated from task data)
  execution_score: {
    overall: { type: Number, min: 0, max: 100 },
    completion_rate: Number,
    timeliness: Number,
    quality: Number,
    calculated_at: Date
  },

  // Empathy Score (Aggregate only - privacy)
  empathy_score: {
    overall: { type: Number, min: 0, max: 100 },
    themes: [String],
    response_count: Number,
    calculated_at: Date
  },

  // SSI Scores (Synced from Karvia)
  ssi_scores: {
    speed: Number,
    strength: Number,
    intelligence: Number,
    overall: Number,
    last_synced: Date
  },

  // Industry-Specific Weights
  weights: {
    transparency: { type: Number, default: 0.35 },
    feedback: { type: Number, default: 0.30 },
    culture: { type: Number, default: 0.35 }
  },

  // Score History (for trends)
  score_history: [{
    date: Date,
    trust_score: Number,
    execution_score: Number,
    empathy_score: Number
  }],

  // Alerts
  active_alerts: [{
    type: { type: String, enum: ['warning', 'critical'] },
    component: String,
    message: String,
    created_at: { type: Date, default: Date.now }
  }],

  // Timestamps
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Generate iBrain ID on create
companySchema.pre('save', function(next) {
  if (!this.ibrain_id) {
    this.ibrain_id = `IB-CO-${generateUUID().slice(0, 8).toUpperCase()}`;
  }
  this.updated_at = new Date();
  next();
});
```

### 2. Members Collection

**Location**: `iBrain/engines/iam-engine/models/Member.js` (NEW)

```javascript
const memberSchema = new mongoose.Schema({
  // iBrain Universal ID
  ibrain_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Composite Key (Company:Member)
  composite_key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Company Association
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // External App References
  external_refs: {
    karvia: { type: String, index: true },
    prodify: { type: String, index: true }
  },

  // Member Profile
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ['CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE'],
    required: true
  },

  // Consent (GDPR Compliant)
  consent: {
    assessment_data: { type: Boolean, default: true },
    behavioral_tracking: { type: Boolean, default: true },
    aggregated_scoring: { type: Boolean, default: true },
    version: { type: String, default: '1.0' },
    updated_at: { type: Date, default: Date.now }
  },

  // Consent Audit Trail
  consent_history: [{
    previous: Object,
    updated_at: Date
  }],

  // Passion Profile (IKIGAI - Stored here, not Karvia)
  passion_profile: {
    love: [String],         // What they love doing
    good_at: [String],      // Skills they excel at
    needs: [String],        // What the world needs
    paid_for: [String],     // What they're compensated for
    score: Number,          // Overall passion score 0-100
    last_assessed: Date
  },

  // Assessment Stats (Aggregated)
  assessment_stats: {
    total_assessments: { type: Number, default: 0 },
    last_assessment: Date,
    average_score: Number
  },

  // Timestamps
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Generate iBrain ID and composite key
memberSchema.pre('save', async function(next) {
  if (!this.ibrain_id) {
    this.ibrain_id = `IB-MEM-${generateUUID().slice(0, 8).toUpperCase()}`;
  }
  if (!this.composite_key && this.company_id) {
    const company = await mongoose.model('Company').findById(this.company_id);
    this.composite_key = `${company.ibrain_id}:${this.ibrain_id}`;
  }
  this.updated_at = new Date();
  next();
});
```

### 3. Assessments Collection

**Location**: `iBrain/engines/assessment-engine/models/Assessment.js` (NEW)

```javascript
const assessmentSchema = new mongoose.Schema({
  // References
  company_id: { type: String, required: true, index: true },  // IB-CO-xxx
  member_id: { type: String, required: true, index: true },   // IB-MEM-xxx

  // Assessment Data (Synced from Karvia)
  assessment_type: { type: String, default: 'ssi' },
  ssi_scores: {
    speed: Number,
    strength: Number,
    intelligence: Number,
    overall: Number
  },
  dimension_scores: {
    speed: { raw_score: Number, weighted_score: Number },
    strength: { raw_score: Number, weighted_score: Number },
    intelligence: { raw_score: Number, weighted_score: Number }
  },

  // Responses (for qualitative analysis)
  responses: [{
    question_id: String,
    dimension: String,
    response_value: mongoose.Schema.Types.Mixed,
    normalized_value: Number,
    answer_type: String,
    question_text: String  // For qualitative analysis
  }],

  // Qualitative Analysis Results (LLM-generated)
  qualitative_analysis: {
    empathy_score: Number,
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    themes: [String],
    concerns: [String],
    confidence: Number,
    analyzed_at: Date
  },

  // Processing Status
  status: {
    type: String,
    enum: ['received', 'processing', 'analyzed', 'failed'],
    default: 'received'
  },

  // Timestamps
  received_at: { type: Date, default: Date.now },
  completed_at: Date
});
```

### 4. Industry Benchmarks Collection

**Location**: `iBrain/engines/observer-engine/models/IndustryBenchmark.js` (NEW)

```javascript
const benchmarkSchema = new mongoose.Schema({
  industry: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  display_name: String,

  // Trust Score Weights (Industry-specific)
  weights: {
    transparency: { type: Number, required: true },
    feedback: { type: Number, required: true },
    culture: { type: Number, required: true }
  },

  // Benchmark Percentiles
  benchmarks: {
    trust_score: {
      avg: Number,
      p25: Number,
      p75: Number,
      excellent: Number
    },
    ssi_score: {
      avg: Number,
      p25: Number,
      p75: Number,
      excellent: Number
    },
    execution_score: {
      avg: Number,
      p25: Number,
      p75: Number,
      excellent: Number
    }
  },

  // Industry Characteristics
  characteristics: {
    seasonal_workforce: Boolean,
    family_business_heavy: Boolean,
    geographic_dispersion: { type: String, enum: ['low', 'medium', 'high'] },
    knowledge_intensive: Boolean,
    client_facing: Boolean
  },

  // Timestamps
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
```

---

## API Endpoints (iBrain)

### Identity APIs (IAM Engine - Port 8083)

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/api/v1/identity/company/register` | POST | Register company | `{external_id, name, industry, size, ...}` | `{ibrain_company_id, weights}` |
| `/api/v1/identity/member/register` | POST | Register member | `{external_id, ibrain_company_id, email, role, consent}` | `{ibrain_member_id, composite_key}` |
| `/api/v1/identity/consent/:member_id` | GET | Get consent | - | `{consent, version, updated_at}` |
| `/api/v1/identity/consent/:member_id` | PUT | Update consent | `{consent}` | `{success, consent}` |
| `/api/v1/identity/lookup` | GET | Lookup identity | `?email=...` or `?external_id=...` | `{exists, ibrain_id, linked_apps}` |

### Ingestion APIs (Assessment Engine)

| Endpoint | Method | Description | Request |
|----------|--------|-------------|---------|
| `/api/v1/ingest/assessment` | POST | Submit assessment | `{company_id, member_id, ssi_scores, responses}` |
| `/api/v1/ingest/task-events` | POST | Submit task events | `{company_id, events[]}` |
| `/api/v1/ingest/behavioral` | POST | Submit behavioral events | `{member_id, events[]}` |

### Score APIs (Scoring Engine)

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/v1/scores/trust/:company_id` | GET | Get Trust Score | See response schema below |
| `/api/v1/scores/execution/:company_id` | GET | Get Execution Score | `{overall, completion_rate, timeliness, ...}` |
| `/api/v1/scores/empathy/:company_id` | GET | Get Empathy Score | `{overall, themes, response_count}` |
| `/api/v1/scores/passion/:member_id` | GET | Get Passion Score | `{score, love, good_at, needs, paid_for}` |
| `/api/v1/scores/category-kpis/:company_id` | GET | Get Category KPIs | `{categories[{id, health, trend}]}` |

### Trust Score Response Schema

```javascript
// GET /api/v1/scores/trust/:company_id
{
  "company_id": "IB-CO-ABC12345",
  "trust_score": {
    "overall": 72,
    "transparency": 68,
    "feedback": 74,
    "culture": 75
  },
  "weights": {
    "transparency": 0.30,
    "feedback": 0.25,
    "culture": 0.45
  },
  "trend": "improving",
  "trend_delta": 5,
  "ssi_score": {
    "speed": 65,
    "strength": 70,
    "intelligence": 68,
    "overall": 68
  },
  "execution_score": 71,
  "empathy_score": 69,
  "alerts": [
    {
      "type": "warning",
      "component": "transparency",
      "message": "Transparency score below industry average"
    }
  ],
  "benchmarks": {
    "industry": "cattle_livestock",
    "trust_avg": 62,
    "your_percentile": 75
  },
  "calculated_at": "2025-12-21T10:30:00Z",
  "cache_ttl": 3600
}
```

### Intelligence APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/intelligence/action-plan/:company_id` | GET | Get 12-month action plan |
| `/api/v1/intelligence/nudges/:company_id` | GET | Get active nudges |
| `/api/v1/intelligence/passion-match` | POST | Get best task-person matches |

---

## Score Calculators

### 1. Trust Score Calculator

**File**: `iBrain/engines/scoring-engine/services/TrustScoreCalculator.js`

```javascript
class TrustScoreCalculator {

  async calculateTrustScore(companyId) {
    const company = await Company.findOne({ ibrain_id: companyId });
    if (!company) throw new Error('Company not found');

    // Get industry weights
    const benchmark = await IndustryBenchmark.findOne({ industry: company.industry });
    const weights = benchmark?.weights || { transparency: 0.35, feedback: 0.30, culture: 0.35 };

    // Calculate components
    const transparency = await this.calculateTransparency(company);
    const feedback = await this.calculateFeedback(company);
    const culture = await this.calculateCulture(company);

    // Weighted composite
    const overall = Math.round(
      transparency * weights.transparency +
      feedback * weights.feedback +
      culture * weights.culture
    );

    // Calculate trend
    const trend = this.calculateTrend(company, overall);

    // Generate alerts
    const alerts = this.generateAlerts(transparency, feedback, culture, benchmark);

    // Store score
    company.trust_score = {
      overall,
      transparency: Math.round(transparency),
      feedback: Math.round(feedback),
      culture: Math.round(culture),
      trend: trend.direction,
      trend_delta: trend.delta,
      calculated_at: new Date()
    };

    // Add to history
    company.score_history.push({
      date: new Date(),
      trust_score: overall,
      execution_score: company.execution_score?.overall,
      empathy_score: company.empathy_score?.overall
    });

    // Keep last 90 days of history
    if (company.score_history.length > 90) {
      company.score_history = company.score_history.slice(-90);
    }

    company.active_alerts = alerts;
    await company.save();

    return {
      company_id: companyId,
      trust_score: company.trust_score,
      weights,
      trend: trend.direction,
      trend_delta: trend.delta,
      ssi_score: company.ssi_scores,
      execution_score: company.execution_score?.overall,
      empathy_score: company.empathy_score?.overall,
      alerts,
      benchmarks: {
        industry: company.industry,
        trust_avg: benchmark?.benchmarks?.trust_score?.avg || 60,
        your_percentile: this.calculatePercentile(overall, benchmark)
      },
      calculated_at: company.trust_score.calculated_at,
      cache_ttl: 3600
    };
  }

  async calculateTransparency(company) {
    // Intelligence (SSI) component - 40%
    const intelligence = company.ssi_scores?.intelligence || 50;

    // Document upload component - 30% (placeholder for now)
    const documents = 50; // Will be enhanced with document analysis

    // Policy compliance - 30% (placeholder)
    const policies = 50;

    return (intelligence * 0.4) + (documents * 0.3) + (policies * 0.3);
  }

  async calculateFeedback(company) {
    // Get recent assessments
    const assessments = await Assessment.find({
      company_id: company.ibrain_id,
      status: 'analyzed'
    }).sort({ received_at: -1 }).limit(10);

    // Assessment participation - 50%
    const participation = Math.min(assessments.length * 10, 100);

    // Empathy from qualitative - 30%
    const empathy = company.empathy_score?.overall || 50;

    // Engagement (response rate, depth) - 20%
    const avgResponses = assessments.length > 0
      ? assessments.reduce((sum, a) => sum + a.responses.length, 0) / assessments.length
      : 0;
    const engagement = Math.min(avgResponses * 2, 100);

    return (participation * 0.5) + (empathy * 0.3) + (engagement * 0.2);
  }

  async calculateCulture(company) {
    // Execution score - 40%
    const execution = company.execution_score?.overall || 50;

    // Passion score (company aggregate) - 30%
    const members = await Member.find({ company_id: company._id });
    const avgPassion = members.length > 0
      ? members.reduce((sum, m) => sum + (m.passion_profile?.score || 50), 0) / members.length
      : 50;

    // Collaboration metrics - 30% (placeholder)
    const collaboration = 50;

    return (execution * 0.4) + (avgPassion * 0.3) + (collaboration * 0.3);
  }

  calculateTrend(company, currentScore) {
    const history = company.score_history || [];
    if (history.length < 2) return { direction: 'stable', delta: 0 };

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const oldScores = history.filter(h => new Date(h.date) < thirtyDaysAgo);

    if (oldScores.length === 0) return { direction: 'stable', delta: 0 };

    const oldAvg = oldScores.reduce((sum, h) => sum + h.trust_score, 0) / oldScores.length;
    const delta = currentScore - oldAvg;

    return {
      direction: delta > 5 ? 'improving' : delta < -5 ? 'declining' : 'stable',
      delta: Math.round(delta)
    };
  }

  generateAlerts(t, f, c, benchmark) {
    const alerts = [];
    const industryAvg = benchmark?.benchmarks?.trust_score?.avg || 60;

    if (t < 50) {
      alerts.push({
        type: 'warning',
        component: 'transparency',
        message: 'Transparency score needs attention',
        created_at: new Date()
      });
    }

    if (f < 50) {
      alerts.push({
        type: 'warning',
        component: 'feedback',
        message: 'Team feedback engagement is low',
        created_at: new Date()
      });
    }

    if (c < 50) {
      alerts.push({
        type: 'warning',
        component: 'culture',
        message: 'Culture indicators need improvement',
        created_at: new Date()
      });
    }

    return alerts;
  }

  calculatePercentile(score, benchmark) {
    if (!benchmark) return 50;
    const { p25, avg, p75 } = benchmark.benchmarks.trust_score;

    if (score >= p75) return 75 + (score - p75) / (100 - p75) * 25;
    if (score >= avg) return 50 + (score - avg) / (p75 - avg) * 25;
    if (score >= p25) return 25 + (score - p25) / (avg - p25) * 25;
    return (score / p25) * 25;
  }
}
```

### 2. Execution Score Calculator

**File**: `iBrain/engines/scoring-engine/services/ExecutionScoreCalculator.js`

```javascript
class ExecutionScoreCalculator {

  async calculateExecutionScore(companyId, taskEvents) {
    // Get tasks for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTasks = taskEvents.filter(t =>
      new Date(t.timestamp) > thirtyDaysAgo
    );

    if (recentTasks.length === 0) {
      return { overall: 50, completion_rate: 0.5, timeliness: 0.5, quality: 0.5 };
    }

    // Completion Rate (40%)
    const completed = recentTasks.filter(t => t.status === 'completed').length;
    const total = recentTasks.filter(t => t.status !== 'cancelled').length;
    const completionRate = total > 0 ? completed / total : 0.5;

    // Timeliness (30%)
    const completedTasks = recentTasks.filter(t => t.status === 'completed');
    const onTime = completedTasks.filter(t =>
      new Date(t.completion_date) <= new Date(t.due_date)
    ).length;
    const timeliness = completedTasks.length > 0 ? onTime / completedTasks.length : 0.5;

    // Quality (15%) - From state signals
    const quality = this.calculateQualityFromSignals(recentTasks);

    // State Signals (15%)
    const stateSignals = this.calculateStateSignals(recentTasks);

    const overall = Math.round(
      (completionRate * 0.40 +
       timeliness * 0.30 +
       quality * 0.15 +
       stateSignals * 0.15) * 100
    );

    return {
      overall,
      completion_rate: Math.round(completionRate * 100),
      timeliness: Math.round(timeliness * 100),
      quality: Math.round(quality * 100),
      calculated_at: new Date()
    };
  }

  calculateStateSignals(tasks) {
    const signalWeights = {
      'completed': 1.0,
      'in_progress': 0.5,
      'blocked': 0.3,
      'deferred': 0.2,
      'cancelled': 0.0,
      'todo': 0.4
    };

    const signals = tasks.map(t => signalWeights[t.status] || 0.4);
    return signals.reduce((a, b) => a + b, 0) / signals.length;
  }

  calculateQualityFromSignals(tasks) {
    // Tasks that went blocked → completed get quality bonus
    const overcameBlocked = tasks.filter(t =>
      t.status === 'completed' && t.was_blocked
    ).length;

    const baseQuality = 0.5;
    const blockedBonus = Math.min(overcameBlocked * 0.05, 0.2);

    return baseQuality + blockedBonus;
  }
}
```

### 3. Qualitative Analyzer

**File**: `iBrain/engines/assessment-engine/services/QualitativeAnalyzer.js`

```javascript
class QualitativeAnalyzer {

  constructor() {
    this.llmService = new LLMService();
  }

  async analyzeAssessment(assessment) {
    // Get text responses only
    const textResponses = assessment.responses.filter(r =>
      r.answer_type === 'text' && r.response_value?.length > 10
    );

    if (textResponses.length < 2) {
      // Not enough text for analysis
      return {
        empathy_score: null,
        sentiment: 'neutral',
        themes: [],
        concerns: [],
        confidence: 0.3
      };
    }

    const prompt = this.buildPrompt(textResponses);
    const result = await this.llmService.analyze(prompt);

    // Store analysis in assessment
    assessment.qualitative_analysis = {
      empathy_score: result.empathy_score,
      sentiment: result.sentiment,
      themes: result.themes,
      concerns: result.concerns,
      confidence: result.confidence,
      analyzed_at: new Date()
    };
    assessment.status = 'analyzed';
    await assessment.save();

    // Update company empathy score (aggregate)
    await this.updateCompanyEmpathyScore(assessment.company_id);

    return result;
  }

  buildPrompt(responses) {
    return `
Analyze these workplace feedback responses for empathy and culture indicators.

RESPONSES:
${responses.map((r, i) => `[${i + 1}] Q: ${r.question_text}\n   A: ${r.response_value}`).join('\n\n')}

Extract and return JSON:
{
  "empathy_score": <1-100 score>,
  "sentiment": "<positive|neutral|negative>",
  "themes": ["theme1", "theme2", "theme3"],
  "concerns": ["concern1"],
  "confidence": <0.0-1.0>
}
    `;
  }

  async updateCompanyEmpathyScore(companyId) {
    const company = await Company.findOne({ ibrain_id: companyId });
    if (!company) return;

    // Get all analyzed assessments in last 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const assessments = await Assessment.find({
      company_id: companyId,
      status: 'analyzed',
      received_at: { $gte: ninetyDaysAgo },
      'qualitative_analysis.empathy_score': { $ne: null }
    });

    if (assessments.length < 4) {
      // Privacy: Need minimum 4 responses
      company.empathy_score = {
        overall: null,
        themes: [],
        response_count: assessments.length,
        calculated_at: new Date()
      };
    } else {
      // Calculate aggregate
      const avgEmpathy = assessments.reduce(
        (sum, a) => sum + a.qualitative_analysis.empathy_score, 0
      ) / assessments.length;

      // Aggregate themes
      const allThemes = assessments.flatMap(a => a.qualitative_analysis.themes);
      const themeCounts = {};
      allThemes.forEach(t => { themeCounts[t] = (themeCounts[t] || 0) + 1; });
      const topThemes = Object.entries(themeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme]) => theme);

      company.empathy_score = {
        overall: Math.round(avgEmpathy),
        themes: topThemes,
        response_count: assessments.length,
        calculated_at: new Date()
      };
    }

    await company.save();
  }
}
```

---

## Industry Benchmarks Seed Data

**File**: `iBrain/engines/observer-engine/seeds/industryBenchmarks.js`

```javascript
const benchmarks = [
  {
    industry: 'cattle_livestock',
    display_name: 'Cattle & Livestock',
    weights: { transparency: 0.30, feedback: 0.25, culture: 0.45 },
    benchmarks: {
      trust_score: { avg: 62, p25: 48, p75: 74, excellent: 80 },
      ssi_score: { avg: 58, p25: 45, p75: 68, excellent: 80 },
      execution_score: { avg: 55, p25: 42, p75: 65, excellent: 75 }
    },
    characteristics: {
      seasonal_workforce: true,
      family_business_heavy: true,
      geographic_dispersion: 'high'
    }
  },
  {
    industry: 'consulting',
    display_name: 'Consulting Services',
    weights: { transparency: 0.35, feedback: 0.35, culture: 0.30 },
    benchmarks: {
      trust_score: { avg: 68, p25: 55, p75: 78, excellent: 85 },
      ssi_score: { avg: 72, p25: 60, p75: 82, excellent: 88 },
      execution_score: { avg: 70, p25: 58, p75: 80, excellent: 85 }
    },
    characteristics: {
      knowledge_intensive: true,
      client_facing: true
    }
  },
  {
    industry: 'it_services',
    display_name: 'IT Services',
    weights: { transparency: 0.35, feedback: 0.30, culture: 0.35 },
    benchmarks: {
      trust_score: { avg: 65, p25: 52, p75: 76, excellent: 82 },
      ssi_score: { avg: 70, p25: 58, p75: 80, excellent: 86 },
      execution_score: { avg: 68, p25: 55, p75: 78, excellent: 84 }
    },
    characteristics: {
      knowledge_intensive: true
    }
  }
];

module.exports = benchmarks;
```

---

## Implementation Checklist

### Sprint 11: IAM & Data Models
- [ ] Create Company model in iBrain IAM Engine
- [ ] Create Member model in iBrain IAM Engine
- [ ] Create Assessment model in Assessment Engine
- [ ] Implement company registration endpoint
- [ ] Implement member registration endpoint
- [ ] Implement consent endpoints

### Sprint 12: Score Calculators
- [ ] Implement TrustScoreCalculator
- [ ] Implement ExecutionScoreCalculator
- [ ] Implement Trust Score API endpoint
- [ ] Create industry benchmarks collection
- [ ] Seed cattle_livestock, consulting, it_services

### Sprint 13: Qualitative & Intelligence
- [ ] Implement QualitativeAnalyzer
- [ ] Implement empathy score aggregation
- [ ] Implement action plan generator (placeholder)
- [ ] Implement nudge system (placeholder)

---

## Code Metrics

| Component | Location | Lines | Notes |
|-----------|----------|-------|-------|
| Company model | IAM Engine | ~100 | New collection |
| Member model | IAM Engine | ~80 | New collection |
| Assessment model | Assessment Engine | ~60 | New collection |
| TrustScoreCalculator | Scoring Engine | ~150 | Core calculation |
| ExecutionScoreCalculator | Scoring Engine | ~80 | Task signals |
| QualitativeAnalyzer | Assessment Engine | ~100 | LLM integration |
| Industry Benchmarks | Observer Engine | ~50 | Seed data |
| API Routes | IAM + Scoring | ~150 | Endpoints |
| **Total iBrain New Code** | | **~770 lines** | |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Score calculation time | <500ms |
| Qualitative analysis time | <3s |
| API availability | >99.5% |
| Score accuracy correlation | >85% |

---

## Related Documents

- [EPIC-1-TRUST-SCORE-FOUNDATION.md](./EPIC-1-TRUST-SCORE-FOUNDATION.md) - Karvia integration
- [iBrain IAM Engine](../../../../../iBrain/engines/iam-engine/)
- [iBrain Scoring Engine](../../../../../iBrain/engines/scoring-engine/)

---

**EPIC Owner**: iBrain Team
**Sprint Target**: Sprint 11-13
**Story Points**: 65
