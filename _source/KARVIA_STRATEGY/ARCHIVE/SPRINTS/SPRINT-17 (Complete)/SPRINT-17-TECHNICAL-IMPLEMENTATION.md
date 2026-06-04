# Sprint 17: Technical Implementation Guide

**Sprint**: 17 - Intelligent Context Engine
**Created**: March 8, 2026
**Updated**: March 8, 2026 (Audit-Revised)
**Status**: PLANNED

---

## IMPORTANT: Schema Path Conventions

Per external audit clarification, all technical specs use **full canonical paths**:

| Shorthand | Full Canonical Path |
|-----------|---------------------|
| `bc.description` | `business_context.profile.description` |
| `bc.business_model` | `business_context.profile.business_model` |
| `bc.value_proposition` | `business_context.profile.value_proposition` |
| `sv.priority_one` | `business_context.strategic_vision.priority_one` |
| `metrics.current` | `business_context.metrics.current` |

**Rule**: Always use full paths in implementation code and specs.

---

## 1. Context Maturity Service

### File: `server/services/ContextMaturityService.js`

```javascript
const Company = require('../models/Company');
const Assessment = require('../models/Assessment');
const Objective = require('../models/Objective');
const Task = require('../models/Task');
const OKROutcome = require('../models/OKROutcome');

class ContextMaturityService {

  // ========================================
  // CONSTANTS
  // ========================================

  static MATURITY_STAGES = {
    0: { name: 'Discovery', minScore: 0, maxScore: 0.20, description: 'Minimal context - industry benchmarks only' },
    1: { name: 'Assessment', minScore: 0.20, maxScore: 0.45, description: 'Company profile and SSI available' },
    2: { name: 'Execution', minScore: 0.45, maxScore: 0.65, description: 'Task patterns and velocity known' },
    3: { name: 'Learning', minScore: 0.65, maxScore: 0.80, description: 'OKR outcomes and lessons available' },
    4: { name: 'Mastery', minScore: 0.80, maxScore: 1.0, description: 'Full history for predictive modeling' }
  };

  // Weight distribution: Core Profile (25%) + Metrics (25%) + Assessment (20%) + Historical (30%) = 100%
  static MATURITY_WEIGHTS = {
    // Core Profile (25%)
    has_description: { weight: 0.05, category: 'profile', label: 'Company description' },
    has_business_model: { weight: 0.05, category: 'profile', label: 'Business model defined' },
    has_value_proposition: { weight: 0.05, category: 'profile', label: 'Value proposition' },
    has_strategic_priority: { weight: 0.10, category: 'profile', label: 'Strategic priority (#1)' },

    // Baseline Metrics (25%)
    baseline_metrics_count: { weight: 0.15, category: 'metrics', label: 'Baseline metrics', maxValue: 5 },
    has_targets: { weight: 0.10, category: 'metrics', label: 'Target metrics defined' },

    // Assessment (20%)
    ssi_completed: { weight: 0.12, category: 'assessment', label: 'SSI assessment completed' },
    ssi_recent: { weight: 0.05, category: 'assessment', label: 'SSI within 6 months' },
    twelve_block_coverage: { weight: 0.03, category: 'assessment', label: '12-block coverage' },

    // Historical Data (30%)
    okr_cycles_completed: { weight: 0.08, category: 'historical', label: 'OKR cycles completed', maxValue: 4 },
    task_history_depth: { weight: 0.07, category: 'historical', label: 'Task history (months)', maxValue: 12 },
    has_outcome_tracking: { weight: 0.08, category: 'historical', label: 'OKR outcomes tracked' },
    has_lessons_learned: { weight: 0.07, category: 'historical', label: 'Lessons learned documented' }
  };

  // ========================================
  // MAIN CALCULATION METHOD
  // ========================================

  static async calculateMaturity(companyId) {
    const company = await Company.findById(companyId);
    if (!company) throw new Error('Company not found');

    // Gather all data
    const assessments = await Assessment.find({
      company_id: companyId,
      status: 'completed'
    }).sort({ completed_at: -1 });

    const objectives = await Objective.find({
      company_id: companyId,
      status: { $in: ['active', 'completed'] }
    });

    const tasks = await Task.find({
      company_id: companyId
    }).sort({ created_at: -1 }).limit(500);

    const outcomes = await OKROutcome.find({
      company_id: companyId
    });

    // Calculate individual scores
    const scores = this._calculateScores(company, assessments, objectives, tasks, outcomes);

    // Calculate weighted total
    let totalScore = 0;
    const gaps = [];
    const strengths = [];

    for (const [key, config] of Object.entries(this.MATURITY_WEIGHTS)) {
      const score = scores[key] || 0;
      const weightedScore = score * config.weight;
      totalScore += weightedScore;

      if (score < 0.5) {
        gaps.push({
          key,
          label: config.label,
          category: config.category,
          currentScore: score,
          impact: config.weight,
          priority: config.weight > 0.08 ? 'high' : config.weight > 0.05 ? 'medium' : 'low'
        });
      } else if (score > 0.8) {
        strengths.push({
          key,
          label: config.label,
          category: config.category,
          score
        });
      }
    }

    // Sort gaps by impact (highest first)
    gaps.sort((a, b) => b.impact - a.impact);

    // Determine stage
    const stage = this._getStageFromScore(totalScore);

    // Generate recommendations
    const recommendations = this._generateRecommendations(gaps, stage);

    // Next actions (top 3 most impactful gaps)
    const nextActions = gaps.slice(0, 3).map(gap => ({
      action: this._getActionForGap(gap.key),
      label: gap.label,
      impact: `+${Math.round(gap.impact * 100)}% maturity`
    }));

    return {
      stage: stage.number,
      stageName: stage.name,
      stageDescription: stage.description,
      score: Math.round(totalScore * 100) / 100,
      scorePercentage: Math.round(totalScore * 100),
      gaps,
      strengths,
      recommendations,
      nextActions,
      breakdown: {
        profile: this._getCategoryScore(scores, 'profile'),
        metrics: this._getCategoryScore(scores, 'metrics'),
        assessment: this._getCategoryScore(scores, 'assessment'),
        historical: this._getCategoryScore(scores, 'historical')
      },
      lastUpdated: new Date()
    };
  }

  // ========================================
  // SCORE CALCULATION HELPERS
  // ========================================

  static _calculateScores(company, assessments, objectives, tasks, outcomes) {
    // Use full canonical paths per audit requirements
    const businessContext = company.business_context || {};
    const profile = businessContext.profile || {};
    const strategicVision = businessContext.strategic_vision || {};
    const currentMetrics = businessContext.metrics?.current || {};
    const targetMetrics = businessContext.targets || {};

    const latestSSI = assessments[0];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Calculate task history depth in months
    const oldestTask = tasks[tasks.length - 1];
    const taskHistoryMonths = oldestTask
      ? Math.floor((Date.now() - new Date(oldestTask.created_at)) / (30 * 24 * 60 * 60 * 1000))
      : 0;

    // Count unique OKR cycles (by quarter)
    const uniqueCycles = new Set(objectives.map(o => `${o.calendar_year}-Q${o.quarter || 1}`));

    return {
      // Profile scores (0-1) - using full canonical paths
      // business_context.profile.description
      has_description: profile.description && profile.description.length > 50 ? 1 : profile.description ? 0.5 : 0,
      // business_context.profile.business_model
      has_business_model: profile.business_model && profile.business_model.length > 20 ? 1 : profile.business_model ? 0.5 : 0,
      // business_context.profile.value_proposition
      has_value_proposition: profile.value_proposition && profile.value_proposition.length > 20 ? 1 : profile.value_proposition ? 0.5 : 0,
      // business_context.strategic_vision.priority_one
      has_strategic_priority: strategicVision.priority_one && strategicVision.priority_one.length > 10 ? 1 : strategicVision.priority_one ? 0.5 : 0,

      // Metrics scores - business_context.metrics.current
      baseline_metrics_count: Math.min(Object.keys(currentMetrics).length / 5, 1),
      // business_context.targets
      has_targets: Object.keys(targetMetrics).length > 0 ? 1 : 0,

      // Assessment scores
      ssi_completed: latestSSI ? 1 : 0,
      ssi_recent: latestSSI && new Date(latestSSI.completed_at) > sixMonthsAgo ? 1 : latestSSI ? 0.3 : 0,
      twelve_block_coverage: latestSSI?.ssi_result?.blocks
        ? Object.values(latestSSI.ssi_result.blocks).filter(b => b.score > 0).length / 12
        : 0,

      // Historical scores
      okr_cycles_completed: Math.min(uniqueCycles.size / 4, 1),
      task_history_depth: Math.min(taskHistoryMonths / 12, 1),
      has_outcome_tracking: outcomes.length > 0 ? 1 : 0,
      has_lessons_learned: outcomes.filter(o => o.lessons_learned).length > 0 ? 1 : 0
    };
  }

  static _getStageFromScore(score) {
    for (const [num, stage] of Object.entries(this.MATURITY_STAGES)) {
      if (score >= stage.minScore && score < stage.maxScore) {
        return { number: parseInt(num), ...stage };
      }
    }
    return { number: 4, ...this.MATURITY_STAGES[4] };
  }

  static _getCategoryScore(scores, category) {
    let categoryTotal = 0;
    let categoryMax = 0;

    for (const [key, config] of Object.entries(this.MATURITY_WEIGHTS)) {
      if (config.category === category) {
        categoryTotal += (scores[key] || 0) * config.weight;
        categoryMax += config.weight;
      }
    }

    return categoryMax > 0 ? Math.round((categoryTotal / categoryMax) * 100) : 0;
  }

  // ========================================
  // RECOMMENDATION GENERATION
  // ========================================

  static _generateRecommendations(gaps, stage) {
    const recommendations = [];

    // Stage-based recommendations
    if (stage.number === 0) {
      recommendations.push({
        type: 'stage_progression',
        title: 'Complete Company Profile',
        description: 'Add your company description, business model, and strategic priority to unlock personalized recommendations.',
        priority: 'high',
        estimatedImpact: '+25% maturity'
      });
    }

    if (stage.number <= 1 && gaps.find(g => g.key === 'ssi_completed')) {
      recommendations.push({
        type: 'assessment',
        title: 'Complete SSI Assessment',
        description: 'The Strategic Strength Index helps identify your organization\'s key improvement areas.',
        priority: 'high',
        estimatedImpact: '+12% maturity'
      });
    }

    if (stage.number <= 2 && gaps.find(g => g.key === 'baseline_metrics_count')) {
      recommendations.push({
        type: 'metrics',
        title: 'Add Baseline Metrics',
        description: 'Add 3-5 baseline KPIs to enable "from X to Y" Key Results instead of generic targets.',
        priority: 'medium',
        estimatedImpact: '+15% maturity'
      });
    }

    if (stage.number >= 2 && gaps.find(g => g.key === 'has_outcome_tracking')) {
      recommendations.push({
        type: 'outcomes',
        title: 'Track OKR Outcomes',
        description: 'Record what worked and what didn\'t to enable AI learning and improved recommendations.',
        priority: 'medium',
        estimatedImpact: '+8% maturity'
      });
    }

    return recommendations;
  }

  static _getActionForGap(gapKey) {
    const actions = {
      has_description: 'Add company description in Settings > Company Profile',
      has_business_model: 'Define your business model in Settings > Company Profile',
      has_value_proposition: 'Add your value proposition in Settings > Company Profile',
      has_strategic_priority: 'Set your #1 priority in Settings > Strategic Vision',
      baseline_metrics_count: 'Add baseline metrics in Settings > Business Metrics',
      has_targets: 'Define target metrics in Settings > Business Metrics > Targets',
      ssi_completed: 'Complete the SSI Assessment from the Assessment menu',
      ssi_recent: 'Update your SSI Assessment (last completed over 6 months ago)',
      okr_cycles_completed: 'Complete your first OKR cycle to build history',
      has_outcome_tracking: 'Record outcomes for completed objectives',
      has_lessons_learned: 'Document lessons learned from completed OKR cycles'
    };
    return actions[gapKey] || 'Review and complete missing information';
  }
}

module.exports = ContextMaturityService;
```

---

## 2. Prompt Orchestration Service (SEPARATE from AIContextService)

**Architecture Decision (per external audit Q4)**:
- PromptOrchestrator is a NEW, standalone service
- NOT integrated into AIContextService
- Responsible for prompt policy, tone, and template management
- AIContextService focuses on context data collection only

### File: `server/services/PromptOrchestrator.js`

```javascript
const ContextMaturityService = require('./ContextMaturityService');

class PromptOrchestrator {

  // ========================================
  // PROMPT TYPE DEFINITIONS
  // ========================================

  static PROMPT_TYPES = {
    OBJECTIVE_GENERATION: 'objective_generation',
    KEY_RESULT_GENERATION: 'key_result_generation',
    TASK_SUGGESTION: 'task_suggestion',
    INSIGHT_GENERATION: 'insight_generation',
    SSI_NARRATIVE: 'ssi_narrative'
  };

  // ========================================
  // GET STAGE-APPROPRIATE PROMPT
  // ========================================

  static async getPromptForContext(companyId, promptType, additionalContext = {}) {
    const maturity = await ContextMaturityService.calculateMaturity(companyId);
    const stage = maturity.stage;

    const basePrompt = this.BASE_PROMPTS[promptType];
    const stageOverlay = this.STAGE_OVERLAYS[promptType][stage];

    // Build context string
    const contextString = this._buildContextString(maturity, additionalContext);

    return {
      systemPrompt: `${basePrompt}\n\n${stageOverlay}`,
      contextPrompt: contextString,
      maturityInfo: {
        stage,
        stageName: maturity.stageName,
        confidence: this._getConfidenceForStage(stage),
        limitations: this._getLimitationsForStage(stage)
      }
    };
  }

  // ========================================
  // BASE PROMPTS (Common across all stages)
  // ========================================

  static BASE_PROMPTS = {
    [this.PROMPT_TYPES.OBJECTIVE_GENERATION]: `You are a strategic OKR advisor with expertise in goal-setting methodologies used by top consulting firms like McKinsey, BCG, and Bain.

CORE PRINCIPLES:
1. Objectives should be aspirational but achievable
2. Focus on outcomes, not activities
3. Align to strategic priorities
4. Be specific to the company context
5. Avoid buzzwords (transform, pioneer, cutting-edge, revolutionary)

QUALITY STANDARDS:
- Each objective should be completable within the time period
- Key Results must be measurable with clear targets
- Reference company-specific context when available`,

    [this.PROMPT_TYPES.KEY_RESULT_GENERATION]: `You are designing measurable Key Results that drive meaningful progress toward objectives.

PRINCIPLES:
1. Key Results are outcomes, not tasks
2. Each KR should be independently measurable
3. Include both leading and lagging indicators
4. Consider team capacity and historical velocity`,

    [this.PROMPT_TYPES.TASK_SUGGESTION]: `You are a productivity expert suggesting actionable tasks that contribute to goal achievement.

PRINCIPLES:
1. Tasks should be completable within 1-2 weeks
2. Consider team workload and availability
3. Reference past task patterns when available
4. Include clear acceptance criteria`
  };

  // ========================================
  // STAGE-SPECIFIC OVERLAYS
  // ========================================

  static STAGE_OVERLAYS = {
    [this.PROMPT_TYPES.OBJECTIVE_GENERATION]: {
      0: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ STAGE 0: DISCOVERY MODE                                           ┃
┃ Context Confidence: 20%                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

AVAILABLE CONTEXT:
- Industry: {{industry}}
- Company size: {{employeeCount}} employees
- Region: {{region}} (if available)

LIMITATIONS:
- NO company-specific metrics or baselines
- NO SSI assessment data
- NO historical OKR data
- NO task execution patterns

STRATEGY:
1. Use INDUSTRY BENCHMARKS for target setting
2. Generate CONSERVATIVE objectives (foundation-building)
3. Use TARGET-ONLY format for Key Results
   ✓ "Achieve 85% customer satisfaction"
   ✗ "Improve from 70% to 85%" (you don't know the baseline!)
4. Include ONE "baseline establishment" Key Result per objective:
   Example: "Establish baseline metrics by completing Q1 audit"
5. Focus on UNIVERSAL best practices for the industry

RECOMMENDED OBJECTIVE CATEGORIES:
- Operational efficiency (safe starting point)
- Customer/client experience
- Team capability building

OUTPUT FORMAT:
When generating objectives, prefix with:
"[Stage 0 - Based on industry benchmarks for {{industry}}]"`,

      1: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ STAGE 1: ASSESSMENT MODE                                          ┃
┃ Context Confidence: 45%                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

AVAILABLE CONTEXT:
- Full company profile: {{companyProfile}}
- SSI Assessment scores: {{ssiScores}}
- Strategic priority: {{priorityOne}}
- Identified weak areas: {{weakBlocks}}

NEW CAPABILITIES:
✓ Can reference company's stated priority
✓ Can address SSI weak areas
✓ Can use company-specific language/context

STILL LIMITED:
- No baseline metrics (use industry benchmarks)
- No historical execution data
- No previous OKR outcomes

STRATEGY:
1. ALIGN objectives to stated priority ({{priorityOne}})
2. ADDRESS SSI weak blocks: {{weakBlocks}}
3. Use company description/business model for specificity
4. Still use TARGET-ONLY format until metrics available

OBJECTIVE PRIORITIZATION:
- 50% aligned to strategic priority
- 30% addressing SSI weak areas
- 20% operational foundation

OUTPUT FORMAT:
"[Stage 1 - Aligned to {{companyName}}'s priority: {{priorityOne}}]"`,

      2: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ STAGE 2: EXECUTION MODE                                           ┃
┃ Context Confidence: 65%                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

AVAILABLE CONTEXT:
- Company profile + SSI (from Stage 1)
- Task execution patterns: {{taskPatterns}}
- Team velocity: {{velocity}} tasks/week
- Completion rate: {{completionRate}}%
- Common task types: {{commonTaskTypes}}

NEW CAPABILITIES:
✓ Can estimate realistic timelines
✓ Can calibrate ambition to capacity
✓ Can reference execution strengths/weaknesses

STRATEGY:
1. Use velocity data to set realistic KR targets
2. Consider {{completionRate}}% completion when sizing scope
3. Reference successful task patterns
4. Set STRETCH goals at 20% above historical capacity

CAPACITY-BASED TARGETS:
- Conservative: Match historical velocity
- Standard: 10% above historical
- Stretch: 20-30% above historical

AVOID:
- Objectives requiring 2x historical capacity
- Task types with <60% historical completion

OUTPUT FORMAT:
"[Stage 2 - Calibrated to team velocity: {{velocity}} tasks/week]"`,

      3: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ STAGE 3: LEARNING MODE                                            ┃
┃ Context Confidence: 80%                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

AVAILABLE CONTEXT:
- All Stage 2 context PLUS:
- Previous OKR outcomes: {{outcomesSummary}}
- Success rate: {{successRate}}%
- Common failure reasons: {{failureReasons}}
- Documented lessons: {{lessonsLearned}}

NEW CAPABILITIES:
✓ Can learn from past successes/failures
✓ Can avoid repeating mistakes
✓ Can build on proven strategies
✓ Can provide specific risk warnings

LEARNING-ENHANCED STRATEGY:
1. BUILD ON successful objective categories: {{successfulCategories}}
2. AVOID patterns that led to failure: {{failurePatterns}}
3. APPLY lessons: {{lessonsLearned}}
4. WARN about specific risks based on history

OBJECTIVE RECOMMENDATIONS:
- Prioritize categories with >70% historical success
- Add risk mitigation for categories with <50% success
- Include "lessons checkpoint" milestones

OUTPUT FORMAT:
"[Stage 3 - Informed by {{totalCycles}} OKR cycles, {{successRate}}% success rate]"`,

      4: `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ STAGE 4: MASTERY MODE                                             ┃
┃ Context Confidence: 95%                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

FULL CONTEXT AVAILABLE:
- Complete company history: {{historySummary}}
- {{totalCycles}} OKR cycles analyzed
- Year-over-year trends: {{yoyTrends}}
- Seasonal patterns: {{seasonalPatterns}}
- Team evolution: {{teamChanges}}
- External factors: {{externalFactors}}

MASTERY CAPABILITIES:
✓ Predictive success modeling
✓ Proactive risk identification
✓ Personalized coaching
✓ Continuous improvement recommendations
✓ Benchmark against own history

ADVANCED STRATEGIES:
1. PREDICT success probability for each objective
2. IDENTIFY optimal timing based on seasonal patterns
3. RECOMMEND team assignments based on historical fit
4. SUGGEST scope adjustments based on trend analysis
5. PROACTIVELY warn about risks before they occur

PREDICTIVE MODELING:
- High confidence (>80%): "Based on 4 similar cycles, expect completion"
- Medium confidence (50-80%): "Mixed results historically, consider X"
- Low confidence (<50%): "This pattern has struggled, recommend Y"

OUTPUT FORMAT:
"[Stage 4 - Predictive confidence: {{predictionConfidence}}% based on {{totalCycles}} cycles]"
Include: Predicted success %, Risk factors, Recommended mitigations`
    }
  };

  // ========================================
  // HELPER METHODS
  // ========================================

  static _getConfidenceForStage(stage) {
    const confidenceMap = { 0: 20, 1: 45, 2: 65, 3: 80, 4: 95 };
    return confidenceMap[stage] || 20;
  }

  static _getLimitationsForStage(stage) {
    const limitationsMap = {
      0: ['No company-specific data', 'No baseline metrics', 'Using industry benchmarks only'],
      1: ['No baseline metrics', 'No execution history', 'Limited personalization'],
      2: ['No OKR outcome data', 'Cannot learn from past cycles'],
      3: ['Limited predictive capability', 'Building pattern library'],
      4: [] // No significant limitations
    };
    return limitationsMap[stage] || [];
  }

  static _buildContextString(maturity, additionalContext) {
    // Build stage-appropriate context string
    const parts = [];

    parts.push(`MATURITY: Stage ${maturity.stage} (${maturity.stageName})`);
    parts.push(`CONFIDENCE: ${this._getConfidenceForStage(maturity.stage)}%`);

    if (maturity.gaps.length > 0) {
      parts.push(`\nTOP GAPS: ${maturity.gaps.slice(0, 3).map(g => g.label).join(', ')}`);
    }

    if (maturity.strengths.length > 0) {
      parts.push(`STRENGTHS: ${maturity.strengths.slice(0, 3).map(s => s.label).join(', ')}`);
    }

    // Add any additional context
    if (additionalContext.company) {
      parts.push(`\nCOMPANY: ${additionalContext.company.name}`);
      parts.push(`INDUSTRY: ${additionalContext.company.industry}`);
    }

    return parts.join('\n');
  }
}

module.exports = PromptOrchestrator;
```

---

## 3. OKR Outcome Model

### File: `server/models/OKROutcome.js`

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OKROutcomeSchema = new Schema({
  company_id: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  objective_id: {
    type: Schema.Types.ObjectId,
    ref: 'Objective',
    required: true
  },

  // Cycle identification
  cycle: {
    type: String,
    required: true  // e.g., "Q1-2026", "Q2-2026"
  },

  time_period_type: {
    type: String,
    enum: ['calendar_year', 'fiscal_year', 'custom'],
    required: true
  },

  // Outcome assessment
  outcome: {
    type: String,
    enum: ['exceeded', 'achieved', 'partial', 'missed', 'cancelled'],
    required: true
  },

  achievement_percentage: {
    type: Number,
    min: 0,
    max: 150  // Allow for exceeding targets
  },

  // Key Result outcomes
  key_result_outcomes: [{
    key_result_id: Schema.Types.ObjectId,
    title: String,
    target_value: Number,
    final_value: Number,
    achievement_percentage: Number,
    outcome: {
      type: String,
      enum: ['exceeded', 'achieved', 'partial', 'missed']
    }
  }],

  // Analysis
  variance_reasons: [{
    reason: {
      type: String,
      enum: [
        'resource_constraint',
        'scope_change',
        'external_factor',
        'dependency_blocked',
        'timeline_issue',
        'priority_shift',
        'skill_gap',
        'underestimation',
        'overestimation',
        'market_change',
        'other'
      ]
    },
    details: String,
    impact_percentage: Number  // How much this contributed to variance
  }],

  // Learnings
  lessons_learned: {
    type: String,
    maxlength: 2000
  },

  what_worked: [{
    type: String,
    maxlength: 500
  }],

  what_didnt_work: [{
    type: String,
    maxlength: 500
  }],

  // Future recommendations
  would_repeat: {
    type: Boolean
  },

  recommended_changes: {
    type: String,
    maxlength: 1000
  },

  // AI-generated insight
  ai_insight: {
    summary: String,
    success_factors: [String],
    risk_factors: [String],
    recommendations: [String],
    confidence_score: Number,
    generated_at: Date
  },

  // Metadata
  recorded_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  reviewed_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  review_notes: String

}, {
  timestamps: true
});

// Indexes
OKROutcomeSchema.index({ company_id: 1, cycle: 1 });
OKROutcomeSchema.index({ company_id: 1, outcome: 1 });
OKROutcomeSchema.index({ company_id: 1, created_at: -1 });

// Virtual for success rate calculation
OKROutcomeSchema.statics.getSuccessRate = async function(companyId) {
  const outcomes = await this.find({ company_id: companyId });
  if (outcomes.length === 0) return null;

  const successful = outcomes.filter(o =>
    o.outcome === 'exceeded' || o.outcome === 'achieved'
  ).length;

  return {
    total: outcomes.length,
    successful,
    rate: Math.round((successful / outcomes.length) * 100)
  };
};

// Get common failure reasons
OKROutcomeSchema.statics.getCommonFailureReasons = async function(companyId) {
  const outcomes = await this.find({
    company_id: companyId,
    outcome: { $in: ['partial', 'missed'] }
  });

  const reasonCounts = {};
  outcomes.forEach(o => {
    (o.variance_reasons || []).forEach(vr => {
      reasonCounts[vr.reason] = (reasonCounts[vr.reason] || 0) + 1;
    });
  });

  return Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => ({ reason, count }));
};

// Get lessons learned summary
OKROutcomeSchema.statics.getLessonsSummary = async function(companyId) {
  const outcomes = await this.find({
    company_id: companyId,
    lessons_learned: { $exists: true, $ne: '' }
  }).sort({ created_at: -1 }).limit(10);

  return outcomes.map(o => ({
    cycle: o.cycle,
    outcome: o.outcome,
    lesson: o.lessons_learned,
    whatWorked: o.what_worked,
    whatDidntWork: o.what_didnt_work
  }));
};

module.exports = mongoose.model('OKROutcome', OKROutcomeSchema);
```

---

## 3.5. Required Guidance Block (All AI Responses)

**MANDATORY for Sprint 17 endpoints (per external audit Q5)**:
- `/api/ai-okr/generate` - REQUIRED
- `/api/planning/weekly-plan` - REQUIRED
- `/api/ai-okr/single-objective` - REQUIRED
- Other AI endpoints - Optional (progressive adoption)

### Guidance Block Schema

```javascript
/**
 * GuidanceBlock - Required output contract for Sprint 17 AI endpoints
 * Based on OpenAI Prompt Pack guidance
 */

const GuidanceBlockSchema = {
  // Required fields for Sprint 17 endpoints
  coach_message: {
    type: String,
    required: true,
    maxlength: 500,
    description: 'Short personalized explanation in plain language'
  },

  why_this_now: {
    type: String,
    required: true,
    maxlength: 300,
    description: 'Why this recommendation is timely'
  },

  next_best_action: {
    label: {
      type: String,
      required: true,
      maxlength: 100,
      description: 'One concrete next step'
    },
    reason: {
      type: String,
      required: true,
      maxlength: 200,
      description: 'Expected impact of taking it'
    }
  },

  assumptions: [{
    type: String,
    maxlength: 200
  }],

  confidence: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    rationale: {
      type: String,
      required: true,
      maxlength: 300,
      description: 'What made confidence this level'
    }
  },

  // Optional - only when AI needs clarification
  ask_user: {
    type: String,
    maxlength: 200,
    description: 'One focused clarifying question if needed'
  }
};

/**
 * Example response with guidance block:
 */
const exampleResponse = {
  success: true,
  data: {
    objectives: [/* generated objectives */],

    // REQUIRED guidance block
    guidance: {
      coach_message: "Based on your SSI assessment showing weak client experience scores, I've prioritized objectives that strengthen your client relationships.",
      why_this_now: "Q2 is your busiest season - establishing client retention processes now will protect revenue during peak.",
      next_best_action: {
        label: "Review generated Key Results",
        reason: "Ensure the metrics align with your actual measurement capabilities"
      },
      assumptions: [
        "Client retention is higher priority than new acquisition",
        "Your team has capacity to implement 3-4 objectives"
      ],
      confidence: {
        level: "medium",
        rationale: "SSI data available but no baseline metrics for precise targets"
      },
      ask_user: "Do you have client satisfaction survey data to inform more specific targets?"
    },

    maturity: {
      stage: 1,
      stageName: "Assessment"
    }
  }
};

module.exports = { GuidanceBlockSchema };
```

### File: `server/services/GuidanceBuilder.js`

```javascript
/**
 * GuidanceBuilder - Constructs guidance blocks for AI responses
 * Used by PromptOrchestrator to ensure consistent output format
 */

class GuidanceBuilder {
  /**
   * Build guidance block from AI response and context
   * @param {Object} aiResponse - Raw AI response
   * @param {Object} maturityContext - Company maturity data
   * @param {Object} options - Additional options
   * @returns {Object} Formatted guidance block
   */
  static build(aiResponse, maturityContext, options = {}) {
    const { stage, gaps, strengths } = maturityContext;

    return {
      coach_message: this._generateCoachMessage(aiResponse, maturityContext),
      why_this_now: this._generateTimingRationale(aiResponse, options),
      next_best_action: this._extractNextAction(aiResponse, gaps),
      assumptions: this._extractAssumptions(aiResponse),
      confidence: {
        level: this._getConfidenceLevel(stage),
        rationale: this._getConfidenceRationale(stage, gaps, strengths)
      },
      ask_user: this._generateClarifyingQuestion(gaps, stage)
    };
  }

  static _getConfidenceLevel(stage) {
    const levels = { 0: 'low', 1: 'low', 2: 'medium', 3: 'high', 4: 'high' };
    return levels[stage] || 'low';
  }

  static _getConfidenceRationale(stage, gaps, strengths) {
    if (stage === 0) {
      return 'Using industry benchmarks only - no company-specific data available';
    }
    if (stage === 1) {
      return `Company profile complete but missing ${gaps.slice(0, 2).map(g => g.label).join(', ')}`;
    }
    if (stage === 2) {
      return `Execution patterns available - ${strengths.length} data strengths identified`;
    }
    if (stage >= 3) {
      return `Historical outcome data informs recommendations - ${strengths.length} patterns learned`;
    }
    return 'Limited context available';
  }

  // ... additional helper methods
}

module.exports = GuidanceBuilder;
```

---

## 4. Benchmark Provider Pattern (Consolidation Strategy)

**Architecture Decision (per external audit Q3)**:
- Use BenchmarkProvider interface pattern
- Strategy: Extend existing `industries.js` THEN migrate to new model
- Avoid creating third source of truth

### File: `server/services/BenchmarkProvider.js` (Interface)

```javascript
/**
 * BenchmarkProvider Interface
 *
 * This interface allows multiple benchmark sources to coexist during migration:
 * 1. LegacyBenchmarkProvider - wraps existing industries.js
 * 2. DatabaseBenchmarkProvider - uses new IndustryBenchmark model
 *
 * Migration Strategy:
 * Phase 1: Create interface + LegacyBenchmarkProvider (Sprint 17)
 * Phase 2: Create DatabaseBenchmarkProvider + IndustryBenchmark model
 * Phase 3: Gradual migration with feature flags
 * Phase 4: Deprecate LegacyBenchmarkProvider
 */

class BenchmarkProvider {
  /**
   * Get benchmarks for an industry
   * @param {string} industry - Industry identifier
   * @param {string} subtype - Industry subtype (optional)
   * @param {number} employeeCount - Company size
   * @param {string} region - Geographic region
   * @returns {Promise<BenchmarkData>}
   */
  async getBenchmarks(industry, subtype, employeeCount, region) {
    throw new Error('Not implemented');
  }

  /**
   * Get typical metrics for an industry
   * @returns {Promise<MetricsData>}
   */
  async getTypicalMetrics(industry) {
    throw new Error('Not implemented');
  }

  /**
   * Get OKR templates for an industry
   * @returns {Promise<TemplateData[]>}
   */
  async getObjectiveTemplates(industry, maturityStage) {
    throw new Error('Not implemented');
  }
}

// Legacy provider wrapping industries.js (existing source)
const industries = require('../config/industries');

class LegacyBenchmarkProvider extends BenchmarkProvider {
  async getBenchmarks(industry, subtype, employeeCount, region) {
    const industryConfig = industries.getIndustryConfig(industry);
    return {
      source: 'legacy',
      ...industryConfig?.benchmarks || {},
      confidence: 'medium' // Legacy data has medium confidence
    };
  }

  async getTypicalMetrics(industry) {
    const industryConfig = industries.getIndustryConfig(industry);
    return industryConfig?.metrics || {};
  }

  async getObjectiveTemplates(industry, maturityStage) {
    const industryConfig = industries.getIndustryConfig(industry);
    return industryConfig?.okr_templates || [];
  }
}

module.exports = { BenchmarkProvider, LegacyBenchmarkProvider };
```

---

## 5. Industry Benchmark Model (Future - Phase 2)

### File: `server/models/IndustryBenchmark.js`

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IndustryBenchmarkSchema = new Schema({
  industry: {
    type: String,
    required: true,
    index: true
  },

  industry_subtype: {
    type: String,
    index: true
  },

  region: {
    type: String,
    enum: ['north_america', 'europe', 'asia_pacific', 'latin_america', 'global'],
    default: 'global'
  },

  company_size_range: {
    min: Number,
    max: Number
  },

  // Typical metrics for this industry
  typical_metrics: {
    // Financial
    revenue_growth_rate: {
      median: Number,
      p25: Number,  // 25th percentile
      p75: Number   // 75th percentile
    },
    profit_margin: {
      median: Number,
      p25: Number,
      p75: Number
    },

    // Client/Customer
    client_retention_rate: {
      median: Number,
      p25: Number,
      p75: Number
    },
    customer_satisfaction: {
      median: Number,
      p25: Number,
      p75: Number
    },
    nps_score: {
      median: Number,
      p25: Number,
      p75: Number
    },

    // Operational
    employee_turnover: {
      median: Number,
      p25: Number,
      p75: Number
    },
    project_completion_rate: {
      median: Number,
      p25: Number,
      p75: Number
    },

    // Custom metrics (industry-specific)
    custom: [{
      name: String,
      unit: String,
      median: Number,
      p25: Number,
      p75: Number
    }]
  },

  // Typical strategic priorities
  typical_priorities: [{
    priority: String,
    frequency: Number  // % of companies citing this
  }],

  // Common risks
  typical_risks: [{
    risk: String,
    severity: String,  // high, medium, low
    frequency: Number
  }],

  // OKR templates
  objective_templates: [{
    category: String,
    title_template: String,
    description_template: String,
    typical_key_results: [String],
    success_rate: Number,  // Historical success rate
    recommended_for: [String]  // e.g., ["growth_stage", "mature"]
  }],

  // Seasonal patterns
  seasonal_patterns: [{
    quarter: Number,
    focus_areas: [String],
    avoid_areas: [String],
    notes: String
  }],

  // Metadata
  data_source: String,
  last_validated: Date,
  validation_notes: String,

  // Admin
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  is_active: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

// Compound indexes
IndustryBenchmarkSchema.index({ industry: 1, industry_subtype: 1, region: 1 });
IndustryBenchmarkSchema.index({ industry: 1, 'company_size_range.min': 1, 'company_size_range.max': 1 });

// Find best matching benchmark
IndustryBenchmarkSchema.statics.findBestMatch = async function(industry, subtype, employeeCount, region) {
  // Try exact match first
  let benchmark = await this.findOne({
    industry,
    industry_subtype: subtype,
    region: region || 'global',
    'company_size_range.min': { $lte: employeeCount },
    'company_size_range.max': { $gte: employeeCount },
    is_active: true
  });

  // Fall back to industry + size match
  if (!benchmark) {
    benchmark = await this.findOne({
      industry,
      'company_size_range.min': { $lte: employeeCount },
      'company_size_range.max': { $gte: employeeCount },
      is_active: true
    });
  }

  // Fall back to industry only
  if (!benchmark) {
    benchmark = await this.findOne({
      industry,
      is_active: true
    });
  }

  // Fall back to global defaults
  if (!benchmark) {
    benchmark = await this.findOne({
      industry: 'general',
      region: 'global',
      is_active: true
    });
  }

  return benchmark;
};

module.exports = mongoose.model('IndustryBenchmark', IndustryBenchmarkSchema);
```

---

## 6. Context Maturity API Route

### File: `server/routes/context-maturity.js`

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const ContextMaturityService = require('../services/ContextMaturityService');
const PromptOrchestrator = require('../services/PromptOrchestrator');

/**
 * GET /api/context-maturity/:companyId
 * Get context maturity assessment for a company
 */
router.get('/:companyId',
  authenticateToken,
  async (req, res, next) => {
    try {
      const { companyId } = req.params;

      // Verify user has access to this company
      if (req.user.company_id.toString() !== companyId &&
          !['CONSULTANT'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const maturity = await ContextMaturityService.calculateMaturity(companyId);

      res.json({
        success: true,
        data: maturity
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/context-maturity/:companyId/suggestions
 * Get prioritized suggestions for improving context maturity
 */
router.get('/:companyId/suggestions',
  authenticateToken,
  async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const maturity = await ContextMaturityService.calculateMaturity(companyId);

      // Combine next actions and recommendations
      const suggestions = [
        ...maturity.nextActions.map((a, i) => ({
          priority: i + 1,
          type: 'action',
          ...a
        })),
        ...maturity.recommendations.map((r, i) => ({
          priority: i + 4,
          type: 'recommendation',
          ...r
        }))
      ];

      res.json({
        success: true,
        data: {
          currentStage: maturity.stage,
          stageName: maturity.stageName,
          suggestions
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/context-maturity/:companyId/breakdown
 * Get detailed breakdown of maturity scores by category
 */
router.get('/:companyId/breakdown',
  authenticateToken,
  async (req, res, next) => {
    try {
      const { companyId } = req.params;
      const maturity = await ContextMaturityService.calculateMaturity(companyId);

      res.json({
        success: true,
        data: {
          overall: {
            stage: maturity.stage,
            score: maturity.scorePercentage
          },
          categories: maturity.breakdown,
          gaps: maturity.gaps,
          strengths: maturity.strengths
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/context-maturity/:companyId/prompt-context/:promptType
 * Get stage-appropriate prompt context for AI calls
 */
router.get('/:companyId/prompt-context/:promptType',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER'),
  async (req, res, next) => {
    try {
      const { companyId, promptType } = req.params;

      const promptContext = await PromptOrchestrator.getPromptForContext(
        companyId,
        promptType
      );

      res.json({
        success: true,
        data: promptContext
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
```

---

## 7. Integration with AIContextService

**Note**: AIContextService focuses on context DATA only. Prompt logic lives in PromptOrchestrator.

### Changes to: `server/services/AIContextService.js`

```javascript
// Add to imports - context maturity only, NOT prompt orchestration
const ContextMaturityService = require('./ContextMaturityService');
// PromptOrchestrator is called separately from routes, NOT from AIContextService

// Add new method to AIContextService class
class AIContextService {
  // ... existing methods ...

  /**
   * Build context with maturity awareness
   * Returns stage-appropriate context and prompt modifications
   */
  async buildMaturityAwareContext(companyId, options = {}) {
    // Get standard context
    const context = await this.buildContext(companyId, options);

    // Get maturity assessment
    const maturity = await ContextMaturityService.calculateMaturity(companyId);

    // Get stage-appropriate prompt
    const promptType = options.promptType || 'objective_generation';
    const promptContext = await PromptOrchestrator.getPromptForContext(
      companyId,
      promptType,
      { company: context.company }
    );

    return {
      ...context,
      maturity: {
        stage: maturity.stage,
        stageName: maturity.stageName,
        score: maturity.scorePercentage,
        confidence: promptContext.maturityInfo.confidence,
        limitations: promptContext.maturityInfo.limitations,
        gaps: maturity.gaps.slice(0, 3),
        nextActions: maturity.nextActions
      },
      prompts: {
        system: promptContext.systemPrompt,
        context: promptContext.contextPrompt
      },
      completeness: {
        ...context.completeness,
        maturityStage: maturity.stage,
        dataQuality: maturity.scorePercentage
      }
    };
  }
}
```

---

## 8. Integration with ai-okr.js

**Key Architecture Changes**:
- AIContextService provides DATA only
- PromptOrchestrator provides PROMPTS separately
- GuidanceBuilder constructs REQUIRED guidance block

### Changes to: `server/routes/ai-okr.js`

```javascript
// Add at the top - NOTE: separate services, not merged
const ContextMaturityService = require('../services/ContextMaturityService');
const PromptOrchestrator = require('../services/PromptOrchestrator');
const GuidanceBuilder = require('../services/GuidanceBuilder');

// Modify the objective generation endpoint
router.post('/generate', async (req, res) => {
  // ... existing validation ...

  // STEP 1: Get context DATA from AIContextService
  const contextData = await AIContextService.buildContext(req.user.company_id);

  // STEP 2: Get maturity assessment separately
  const maturity = await ContextMaturityService.calculateMaturity(req.user.company_id);

  // STEP 3: Get stage-appropriate prompt from PromptOrchestrator
  const promptConfig = await PromptOrchestrator.getPromptForContext(
    req.user.company_id,
    'objective_generation',
    { company: contextData.company }
  );

  // Add maturity info to user prompt
  const maturityContext = `
CONTEXT MATURITY: Stage ${maturity.stage} (${maturity.stageName})
CONFIDENCE LEVEL: ${promptConfig.maturityInfo.confidence}%
${promptConfig.maturityInfo.limitations.length > 0
  ? `LIMITATIONS: ${promptConfig.maturityInfo.limitations.join(', ')}`
  : ''}
`;

  // ... AI generation logic using promptConfig.systemPrompt ...

  // STEP 4: Build REQUIRED guidance block
  const guidance = GuidanceBuilder.build(aiResponse, maturity, {
    context: contextData
  });

  // Include guidance block in response (REQUIRED for Sprint 17)
  res.json({
    success: true,
    data: {
      objectives: generatedObjectives,

      // REQUIRED guidance block
      guidance: guidance,

      // Maturity context
      maturity: {
        stage: maturity.stage,
        stageName: maturity.stageName,
        score: maturity.scorePercentage
      },

      quality_warnings: validationWarnings,
      quality_score: qualityScore
    }
  });
});
```

---

## Testing Requirements

### Unit Tests

```javascript
// tests/unit/services/ContextMaturityService.test.js

describe('ContextMaturityService', () => {
  describe('calculateMaturity', () => {
    it('should return Stage 0 for new company with no data', async () => {
      const maturity = await ContextMaturityService.calculateMaturity(newCompanyId);
      expect(maturity.stage).toBe(0);
      expect(maturity.score).toBeLessThan(0.20);
    });

    it('should return Stage 1 when company profile and SSI complete', async () => {
      const maturity = await ContextMaturityService.calculateMaturity(profiledCompanyId);
      expect(maturity.stage).toBe(1);
      expect(maturity.score).toBeGreaterThan(0.20);
    });

    it('should identify correct gaps', async () => {
      const maturity = await ContextMaturityService.calculateMaturity(partialCompanyId);
      expect(maturity.gaps.length).toBeGreaterThan(0);
      expect(maturity.gaps[0]).toHaveProperty('label');
      expect(maturity.gaps[0]).toHaveProperty('impact');
    });

    it('should generate actionable recommendations', async () => {
      const maturity = await ContextMaturityService.calculateMaturity(partialCompanyId);
      expect(maturity.recommendations.length).toBeGreaterThan(0);
      expect(maturity.nextActions.length).toBeLessThanOrEqual(3);
    });
  });
});

// tests/unit/services/PromptOrchestrator.test.js

describe('PromptOrchestrator', () => {
  it('should return Stage 0 prompt with industry benchmarks only', async () => {
    const prompt = await PromptOrchestrator.getPromptForContext(
      newCompanyId,
      'objective_generation'
    );
    expect(prompt.systemPrompt).toContain('STAGE 0');
    expect(prompt.systemPrompt).toContain('industry benchmarks');
    expect(prompt.maturityInfo.confidence).toBe(20);
  });

  it('should include SSI data in Stage 1 prompt', async () => {
    const prompt = await PromptOrchestrator.getPromptForContext(
      ssiCompletedCompanyId,
      'objective_generation'
    );
    expect(prompt.systemPrompt).toContain('STAGE 1');
    expect(prompt.systemPrompt).toContain('SSI Assessment');
  });

  it('should include historical data in Stage 4 prompt', async () => {
    const prompt = await PromptOrchestrator.getPromptForContext(
      matureCompanyId,
      'objective_generation'
    );
    expect(prompt.systemPrompt).toContain('STAGE 4');
    expect(prompt.systemPrompt).toContain('Predictive');
  });
});
```

---

## API Documentation

### Context Maturity Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/context-maturity/:companyId` | Get full maturity assessment |
| GET | `/api/context-maturity/:companyId/suggestions` | Get improvement suggestions |
| GET | `/api/context-maturity/:companyId/breakdown` | Get score breakdown by category |
| GET | `/api/context-maturity/:companyId/prompt-context/:promptType` | Get stage-appropriate prompt |

### Response Examples

**GET /api/context-maturity/:companyId**
```json
{
  "success": true,
  "data": {
    "stage": 1,
    "stageName": "Assessment",
    "stageDescription": "Company profile and SSI available",
    "score": 0.35,
    "scorePercentage": 35,
    "gaps": [
      {
        "key": "baseline_metrics_count",
        "label": "Baseline metrics",
        "category": "metrics",
        "currentScore": 0,
        "impact": 0.15,
        "priority": "high"
      }
    ],
    "strengths": [
      {
        "key": "ssi_completed",
        "label": "SSI assessment completed",
        "score": 1
      }
    ],
    "recommendations": [
      {
        "type": "metrics",
        "title": "Add Baseline Metrics",
        "description": "Add 3-5 baseline KPIs...",
        "priority": "medium",
        "estimatedImpact": "+15% maturity"
      }
    ],
    "nextActions": [
      {
        "action": "Add baseline metrics in Settings > Business Metrics",
        "label": "Baseline metrics",
        "impact": "+15% maturity"
      }
    ],
    "breakdown": {
      "profile": 75,
      "metrics": 10,
      "assessment": 80,
      "historical": 0
    }
  }
}
```

---

**Document Version**: 1.0
**Last Updated**: March 8, 2026

