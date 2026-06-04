# 📋 KARVIA OKR - MVP PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Version**: 2.1 (Multi-Level Assessment Architecture)
**Date**: October 1, 2025
**Launch Target**: November 30, 2025
**Status**: Implementation Ready

---

## ⚠️ CRITICAL UPDATE (v2.1)

**Multi-Level Assessment System**: Every employee, manager, and executive takes assessments. Individual scores aggregate to team scores, which aggregate to organizational SSI scores. This is the foundation for accurate OKR generation at all levels.

**Key Change**: Assessments are no longer just for business owners - they're for everyone in the organization, enabling individual → team → org SSI calculation.

---

## 📋 TABLE OF CONTENTS

1. [Product Overview](#product-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Feature Requirements](#feature-requirements)
   - [Tier 1: Core Features](#tier-1-core-features)
   - [Tier 2: AI-Powered Features](#tier-2-ai-powered-features)
   - [Tier 3: iBrain Features](#tier-3-ibrain-features)
4. [iBrain Admin Toggle System](#ibrain-admin-toggle-system)
5. [15 Core Screens](#15-core-screens)
6. [API Requirements](#api-requirements)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Acceptance Criteria](#acceptance-criteria)

---

## 🎯 PRODUCT OVERVIEW

### **What is Karvia OKR?**

Karvia OKR is an assessment-driven OKR platform that generates contextual objectives based on strategic business questionnaires. It reduces manager planning time from 10+ hours to <20 minutes through AI-powered OKR generation and task suggestions.

### **Product Tiers**

**Tier 1: Karvia Core (Really Good)**
- Always available, works standalone
- No external dependencies except MongoDB
- Template-based OKRs
- Complete team management
- Production-ready

**Tier 2: AI-Powered (Enhanced)**
- Requires customer's OpenAI API key
- AI-generated OKRs from assessment
- AI task suggestions
- Graceful fallback to templates

**Tier 3: iBrain (Exceptional)**
- Proprietary subscription features
- 6 independently toggleable modules
- Predictive analytics, sentiment analysis, AI coaching, workflows, custom ML, advanced dashboards
- Graceful degradation when disabled

---

## 👥 USER ROLES & PERMISSIONS

### **Role Hierarchy**

```
Super Admin (Internal)
    ↓
Company Admin (Owner)
    ↓
Manager
    ↓
Employee

Consultant (Multi-Company Access)
```

### **Role Definitions**

| Role | Description | Count per Business | Key Permissions |
|------|-------------|-------------------|-----------------|
| **Super Admin** | Internal Karvia platform admin | N/A (internal) | All actions, multi-business, iBrain toggle management |
| **Company Admin** | Business owner/CEO | 1-2 | All business data, invite users, assessment, generate OKRs, iBrain toggle (own business) |
| **Manager** | Department head, team lead | 3-10 | View team data, assign goals/tasks, view reports |
| **Employee** | Individual contributor | 10-1000 | View assigned tasks/goals, update progress |
| **Consultant** | External advisor | 1-5 per company | Read-only access to multiple businesses, generate OKRs for clients |

### **Permission Matrix**

| Action | Super Admin | Company Admin | Manager | Employee | Consultant |
|--------|-------------|---------------|---------|----------|------------|
| **Take assessment** | ✅ | ✅ | ✅ | ✅ | ✅ (for client) |
| **View own SSI scores** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View team SSI scores** | ✅ | ✅ | ✅ (own team) | ❌ | ✅ (all teams) |
| **View org SSI scores** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Edit assessment template** | ✅ | ✅ (own business) | ❌ | ❌ | ✅ (for clients) |
| **Modify question weights** | ✅ | ✅ (own business) | ❌ | ❌ | ✅ (for clients) |
| **Create custom templates** | ✅ | ✅ | ❌ | ❌ | ✅ (reusable) |
| **Invite users to assessments** | ✅ | ✅ | ✅ (own team) | ❌ | ✅ (all) |
| **View question-level scores** | ✅ | ✅ | ✅ (own + team) | ✅ (own only) | ✅ (all) |
| Generate OKRs | ✅ | ✅ | ❌ | ❌ | ✅ (for client) |
| Approve objectives | ✅ | ✅ | ❌ | ❌ | ✅ (advisory) |
| Create goals | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign tasks | ✅ | ✅ | ✅ | ❌ | ❌ |
| View all company data | ✅ | ✅ | ❌ | ❌ | ✅ (read-only) |
| View team data | ✅ | ✅ | ✅ (own team) | ❌ | ✅ (read-only) |
| Update own tasks | ✅ | ✅ | ✅ | ✅ | ❌ |
| Invite users | ✅ | ✅ | ✅ (limited) | ❌ | ❌ |
| Manage business profile | ✅ | ✅ | ❌ | ❌ | ❌ |
| Toggle iBrain features | ✅ (all businesses) | ✅ (own business) | ❌ | ❌ | ❌ |
| Access multiple companies | ✅ | ❌ | ❌ | ❌ | ✅ |

---

## 🏗️ FEATURE REQUIREMENTS

---

## TIER 1: CORE FEATURES

### **F1.1: Authentication & Authorization**

**Description**: Secure user authentication and role-based access control.

**Functional Requirements**:
- FR1.1.1: Users can register via invitation token
- FR1.1.2: Users can login with email + password
- FR1.1.3: JWT tokens expire after 1 hour (configurable)
- FR1.1.4: Refresh tokens valid for 7 days
- FR1.1.5: Password must be at least 8 characters with 1 uppercase, 1 number
- FR1.1.6: Role-based authorization middleware on all protected routes
- FR1.1.7: Users can only access data for their business_id
- FR1.1.8: Consultants can switch between authorized businesses

**Technical Requirements**:
- IAM Engine (port 8081) handles all auth
- JWT secrets from environment variables (no hard-coded secrets)
- Bcrypt password hashing (salt rounds: 10)
- Token includes: `{ id, email, role, business_id }`

**Acceptance Criteria**:
- AC1.1.1: User cannot access another business's data
- AC1.1.2: Expired tokens return 401 Unauthorized
- AC1.1.3: Invalid credentials return appropriate error messages
- AC1.1.4: Consultant can switch companies via dropdown

**Priority**: P0 (Blocking)

---

### **F1.2: Business Profile & Archetype**

**Description**: Business onboarding with archetype and strategic preferences.

**Functional Requirements**:
- FR1.2.1: Owner selects 1 of 16 business archetypes during signup
- FR1.2.2: Owner selects 3-5 strategic priorities from 24 focus areas
- FR1.2.3: Owner marks priorities as "Primary" or "Secondary"
- FR1.2.4: Business profile includes: name, industry, employee_count, archetype, preferences
- FR1.2.5: Owner can update business profile after signup

**16 Business Archetypes**:
1. Explorer (Innovation-driven)
2. Consolidator (Efficiency-focused)
3. Expander (Growth-focused)
4. Defender (Stability-focused)
5. Reactor (Adaptive, fast-moving)
6. Analyzer (Data-driven)
7. Prospector (Market-seeking)
8. Cooperator (Partnership-driven)
9. Renovator (Transformation-focused)
10. Optimizer (Process improvement)
11. Disruptor (Market challenger)
12. Specialist (Niche expert)
13. Integrator (M&A, consolidation)
14. Harvester (Mature market, profit extraction)
15. Turnaround (Recovery mode)
16. Sustainer (Maintain status quo)

**24 Strategic Focus Areas**:

**Speed (Business Agility)**:
- Accelerate time-to-market
- Improve decision-making speed
- Enhance operational agility
- Increase execution velocity
- Streamline processes
- Boost innovation speed
- Improve customer response time
- Accelerate learning cycles

**Strength (Operational Stability)**:
- Build organizational resilience
- Improve financial stability
- Strengthen supply chain
- Enhance risk management
- Improve quality & reliability
- Build sustainable processes
- Strengthen competitive moat
- Improve operational efficiency

**Intelligence (Data-Driven Insights)**:
- Enhance data analytics
- Improve forecasting accuracy
- Build predictive capabilities
- Strengthen customer insights
- Improve market intelligence
- Build strategic foresight
- Enhance learning culture
- Improve decision quality

**Technical Requirements**:
- Business model schema includes: archetype (enum), strategic_preferences (array), preference_priority (object)
- OpenAI prompt builder uses archetype + preferences for OKR generation

**Acceptance Criteria**:
- AC1.2.1: Owner must select archetype before completing signup
- AC1.2.2: Owner must select at least 3 strategic priorities
- AC1.2.3: OKRs generated align with selected archetype and priorities
- AC1.2.4: Business profile can be updated by Company Admin

**Priority**: P0 (Blocking)

---

### **F1.3: Dynamic Assessment System** ⭐ **CRITICAL FOR CONSULTANTS**

**Description**: Configurable strategic assessment that scores businesses on Speed, Strength, and Intelligence with dynamic weighted scoring. **This is the foundation for company evaluation and OKR generation.**

---

#### **F1.3.1: Assessment Template Data Model**

**Why This Matters**: Consultants need to customize assessments per client archetype. Dynamic scoring allows consultants to weight questions differently based on industry/context, making evaluations accurate and comparable.

**AssessmentTemplate Schema**:
```javascript
// @karvia/shared-models/models/AssessmentTemplate.js
const assessmentTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "Individual Employee Assessment - Sales Team"
  description: { type: String },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Consultant who created
  author_type: { type: String, enum: ['system', 'consultant', 'admin'] },
  is_global: { type: Boolean, default: false }, // Available to all businesses

  // ⭐ NEW: Assessment Type
  assessment_type: {
    type: String,
    enum: ['individual', 'team', 'role_specific', 'manager', 'organizational'],
    required: true,
    default: 'individual'
  },

  // ⭐ NEW: Target Audience
  target_audience: {
    roles: [{
      type: String,
      enum: ['employee', 'manager', 'company_admin', 'consultant', 'super_admin']
    }],
    teams: [{ type: String }], // ['engineering', 'sales', 'marketing', 'operations']
    job_functions: [{ type: String }], // ['software_engineer', 'sales_rep', 'product_manager']
    specific_users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },

  target_archetypes: [{ type: String }], // Which archetypes this template suits (for org-level assessments)

  // Questions
  questions: [{
    question_id: { type: String, required: true, unique: true }, // "SPEED_001"
    text: { type: String, required: true }, // "How quickly can you launch new products?"
    help_text: { type: String }, // Tooltip/guidance
    dimension: { type: String, enum: ['speed', 'strength', 'intelligence'], required: true },
    sub_dimension: { type: String }, // e.g., "time_to_market", "financial_health"
    question_type: {
      type: String,
      enum: ['slider', 'multiple_choice', 'yes_no'],
      default: 'slider'
    },

    // For slider questions (1-10)
    min_value: { type: Number, default: 1 },
    max_value: { type: Number, default: 10 },
    min_label: { type: String }, // "Very Slow"
    max_label: { type: String }, // "Very Fast"

    // For multiple choice questions
    options: [{
      text: String,
      value: Number // Point value (e.g., A=10, B=7, C=4, D=1)
    }],

    // Scoring weight (higher = more important)
    weight: { type: Number, default: 1.0, min: 0, max: 5.0 },

    // Display order
    order: { type: Number, required: true }
  }],

  // Scoring configuration per dimension
  scoring_config: {
    speed: {
      method: { type: String, enum: ['weighted_average', 'simple_average'], default: 'weighted_average' },
      dimension_weight: { type: Number, default: 1.0 }, // For overall score calculation
      threshold_critical: { type: Number, default: 50 }, // <50 = critical weakness
      threshold_weak: { type: Number, default: 70 } // <70 = needs attention
    },
    strength: {
      method: { type: String, enum: ['weighted_average', 'simple_average'], default: 'weighted_average' },
      dimension_weight: { type: Number, default: 1.0 },
      threshold_critical: { type: Number, default: 50 },
      threshold_weak: { type: Number, default: 70 }
    },
    intelligence: {
      method: { type: String, enum: ['weighted_average', 'simple_average'], default: 'weighted_average' },
      dimension_weight: { type: Number, default: 1.0 },
      threshold_critical: { type: Number, default: 50 },
      threshold_weak: { type: Number, default: 70 }
    }
  },

  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
  version: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
```

---

#### **F1.3.2: Dynamic Scoring Engine**

**Why This Matters**: Different businesses need different evaluation criteria. A startup's "Speed" is more critical than "Strength". A bank's "Strength" is more critical than "Speed". Consultants need to adjust weights.

**Scoring Implementation** (`engines/assessment/services/scoring-service.js`):

```javascript
class ScoringService {
  /**
   * Calculate dimension score with dynamic weights
   */
  calculateDimensionScore(responses, questions, dimension, config) {
    // Filter questions for this dimension
    const dimensionQuestions = questions.filter(q => q.dimension === dimension);

    if (config.method === 'weighted_average') {
      // Weighted average: sum(question_score * weight) / sum(weights)
      let weightedSum = 0;
      let totalWeight = 0;

      dimensionQuestions.forEach(question => {
        const response = responses.find(r => r.question_id === question.question_id);
        if (response) {
          weightedSum += response.value * question.weight;
          totalWeight += question.weight;
        }
      });

      // Normalize to 0-100 scale
      const rawScore = (weightedSum / totalWeight) * 10; // 1-10 scale
      return Math.round(rawScore * 10) / 10; // Round to 1 decimal

    } else {
      // Simple average: sum(question_scores) / count
      const scores = dimensionQuestions.map(question => {
        const response = responses.find(r => r.question_id === question.question_id);
        return response ? response.value : 0;
      });

      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.round(avgScore * 10) / 10;
    }
  }

  /**
   * Calculate overall score with dimension weights
   */
  calculateOverallScore(speedScore, strengthScore, intelligenceScore, scoringConfig) {
    const speedWeight = scoringConfig.speed.dimension_weight;
    const strengthWeight = scoringConfig.strength.dimension_weight;
    const intelligenceWeight = scoringConfig.intelligence.dimension_weight;

    const totalWeight = speedWeight + strengthWeight + intelligenceWeight;

    const overallScore = (
      (speedScore * speedWeight) +
      (strengthScore * strengthWeight) +
      (intelligenceScore * intelligenceWeight)
    ) / totalWeight;

    return Math.round(overallScore * 10) / 10;
  }

  /**
   * Identify weak areas for OKR prioritization
   */
  identifyWeakAreas(assessment, template) {
    const weakAreas = [];

    // Dimension-level weak areas
    ['speed', 'strength', 'intelligence'].forEach(dimension => {
      const score = assessment[`${dimension}_score`];
      const config = template.scoring_config[dimension];

      if (score < config.threshold_critical) {
        weakAreas.push({
          type: 'dimension',
          dimension: dimension,
          score: score,
          severity: 'critical',
          label: `${this.dimensionLabel(dimension)} (CRITICAL)`,
          priority: 1
        });
      } else if (score < config.threshold_weak) {
        weakAreas.push({
          type: 'dimension',
          dimension: dimension,
          score: score,
          severity: 'weak',
          label: `${this.dimensionLabel(dimension)} (Needs Attention)`,
          priority: 2
        });
      }
    });

    // Question-level weak areas (score < 7)
    const questionScores = [];
    template.questions.forEach(question => {
      const response = assessment.responses.find(r => r.question_id === question.question_id);
      if (response && response.value < 7) {
        questionScores.push({
          type: 'question',
          question_id: question.question_id,
          question_text: question.text,
          dimension: question.dimension,
          score: response.value,
          weight: question.weight,
          severity: response.value < 5 ? 'critical' : 'weak',
          priority: response.value < 5 ? 1 : 2
        });
      }
    });

    // Sort by priority, then by score (lowest first)
    weakAreas.push(...questionScores);
    weakAreas.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.score - b.score;
    });

    return weakAreas;
  }

  dimensionLabel(dimension) {
    const labels = {
      speed: 'Speed (Business Agility)',
      strength: 'Strength (Operational Stability)',
      intelligence: 'Intelligence (Data-Driven Insights)'
    };
    return labels[dimension];
  }
}
```

---

#### **F1.3.3: Three Default Assessment Templates**

**Why These Three**: Cover the spectrum of business archetypes. Consultants can use these as starting points and customize.

**Template 1: Growth-Focused Assessment**
- **Target Archetypes**: Explorer, Expander, Prospector, Disruptor
- **Dimension Weights**: Speed (40%), Strength (30%), Intelligence (30%)
- **Key Focus**: Time-to-market, innovation speed, market responsiveness
- **Questions**: 35 total (15 Speed, 10 Strength, 10 Intelligence)
- **Speed Questions** (higher weight):
  - "How quickly can you launch new products?" (weight: 2.0)
  - "How fast can you pivot strategy based on market feedback?" (weight: 1.8)
  - "How rapidly can you scale operations?" (weight: 1.5)

**Template 2: Stability-Focused Assessment**
- **Target Archetypes**: Defender, Sustainer, Consolidator, Harvester
- **Dimension Weights**: Speed (25%), Strength (50%), Intelligence (25%)
- **Key Focus**: Financial stability, operational consistency, risk management
- **Questions**: 35 total (8 Speed, 17 Strength, 10 Intelligence)
- **Strength Questions** (higher weight):
  - "How resilient is your supply chain?" (weight: 2.0)
  - "How strong is your financial position?" (weight: 2.0)
  - "How consistent are your operational processes?" (weight: 1.8)

**Template 3: Transformation-Focused Assessment**
- **Target Archetypes**: Renovator, Turnaround, Analyzer, Integrator
- **Dimension Weights**: Speed (30%), Strength (30%), Intelligence (40%)
- **Key Focus**: Data-driven decisions, strategic foresight, change management
- **Questions**: 35 total (10 Speed, 10 Strength, 15 Intelligence)
- **Intelligence Questions** (higher weight):
  - "How data-driven are your strategic decisions?" (weight: 2.0)
  - "How accurate are your forecasts?" (weight: 1.8)
  - "How quickly do you learn from failures?" (weight: 1.5)

---

#### **F1.3.4: Assessment Question Bank**

**Complete Question List** (35 questions per template):

**SPEED (Business Agility) - 15 Questions**:

| ID | Question | Sub-Dimension | Weight (Growth/Stability/Transform) |
|----|----------|---------------|--------------------------------------|
| SPEED_001 | How quickly can you launch new products to market? | Time-to-market | 2.0 / 1.0 / 1.5 |
| SPEED_002 | How fast can you make strategic decisions? | Decision speed | 1.5 / 1.0 / 1.5 |
| SPEED_003 | How rapidly can you respond to market changes? | Market responsiveness | 1.8 / 1.0 / 1.5 |
| SPEED_004 | How quickly can you scale operations up or down? | Operational agility | 1.5 / 1.2 / 1.3 |
| SPEED_005 | How fast is your innovation cycle? | Innovation speed | 2.0 / 0.8 / 1.3 |
| SPEED_006 | How quickly can you adapt processes? | Process agility | 1.3 / 1.0 / 1.5 |
| SPEED_007 | How fast can you onboard new customers? | Customer acquisition | 1.5 / 1.0 / 1.2 |
| SPEED_008 | How rapidly can you pivot business model? | Pivot capability | 1.8 / 0.8 / 2.0 |
| SPEED_009 | How quickly do you execute on decisions? | Execution velocity | 1.5 / 1.2 / 1.5 |
| SPEED_010 | How fast can you resolve customer issues? | Customer response | 1.3 / 1.2 / 1.0 |
| SPEED_011 | How quickly can you learn new skills/capabilities? | Learning speed | 1.5 / 1.0 / 1.8 |
| SPEED_012 | How fast can you deploy new technology? | Tech adoption | 1.3 / 0.8 / 1.5 |
| SPEED_013 | How rapidly can you test new ideas? | Experimentation speed | 1.5 / 0.8 / 1.5 |
| SPEED_014 | How quickly can you adjust pricing/offers? | Market flexibility | 1.2 / 1.0 / 1.2 |
| SPEED_015 | How fast can you expand to new markets? | Expansion speed | 1.5 / 0.8 / 1.2 |

**STRENGTH (Operational Stability) - 17 Questions**:

| ID | Question | Sub-Dimension | Weight (Growth/Stability/Transform) |
|----|----------|---------------|--------------------------------------|
| STRENGTH_001 | How strong is your financial position (cash reserves)? | Financial health | 1.5 / 2.0 / 1.8 |
| STRENGTH_002 | How resilient is your supply chain? | Supply chain | 1.2 / 2.0 / 1.5 |
| STRENGTH_003 | How consistent is your product/service quality? | Quality | 1.3 / 2.0 / 1.5 |
| STRENGTH_004 | How mature is your risk management? | Risk management | 1.2 / 2.0 / 1.8 |
| STRENGTH_005 | How reliable are your operational processes? | Process maturity | 1.2 / 1.8 / 1.5 |
| STRENGTH_006 | How stable is your team (low turnover)? | Team stability | 1.3 / 1.8 / 1.5 |
| STRENGTH_007 | How strong is your competitive position? | Market position | 1.5 / 1.5 / 1.5 |
| STRENGTH_008 | How diversified are your revenue streams? | Revenue diversity | 1.3 / 1.8 / 1.5 |
| STRENGTH_009 | How strong are your customer relationships? | Customer loyalty | 1.5 / 1.5 / 1.3 |
| STRENGTH_010 | How robust is your technology infrastructure? | Tech infrastructure | 1.2 / 1.5 / 1.8 |
| STRENGTH_011 | How strong is your brand reputation? | Brand strength | 1.3 / 1.5 / 1.3 |
| STRENGTH_012 | How well-documented are your processes? | Process documentation | 1.0 / 1.8 / 1.5 |
| STRENGTH_013 | How strong is your leadership team? | Leadership strength | 1.5 / 1.5 / 1.8 |
| STRENGTH_014 | How effective is your cost management? | Cost efficiency | 1.2 / 1.8 / 1.5 |
| STRENGTH_015 | How resilient are you to economic downturns? | Economic resilience | 1.3 / 2.0 / 1.8 |
| STRENGTH_016 | How strong is your intellectual property? | IP strength | 1.2 / 1.3 / 1.5 |
| STRENGTH_017 | How effective is your compliance/governance? | Governance | 1.0 / 1.8 / 1.5 |

**INTELLIGENCE (Data-Driven Insights) - 15 Questions**:

| ID | Question | Sub-Dimension | Weight (Growth/Stability/Transform) |
|----|----------|---------------|--------------------------------------|
| INTEL_001 | How data-driven are your strategic decisions? | Decision quality | 1.5 / 1.5 / 2.0 |
| INTEL_002 | How accurate are your business forecasts? | Forecasting | 1.3 / 1.5 / 1.8 |
| INTEL_003 | How deep is your customer insight? | Customer intelligence | 1.5 / 1.3 / 1.8 |
| INTEL_004 | How sophisticated is your market intelligence? | Market insight | 1.5 / 1.2 / 1.8 |
| INTEL_005 | How strong is your strategic foresight? | Strategic planning | 1.3 / 1.3 / 2.0 |
| INTEL_006 | How strong is your learning culture? | Learning culture | 1.5 / 1.2 / 1.8 |
| INTEL_007 | How rigorous is your experimentation? | Experimentation | 1.5 / 1.0 / 1.8 |
| INTEL_008 | How effective is your data analytics? | Analytics capability | 1.3 / 1.3 / 2.0 |
| INTEL_009 | How well do you measure performance? | Performance metrics | 1.3 / 1.5 / 1.8 |
| INTEL_010 | How effectively do you share knowledge? | Knowledge sharing | 1.2 / 1.3 / 1.5 |
| INTEL_011 | How quickly do you learn from failures? | Learning agility | 1.5 / 1.2 / 2.0 |
| INTEL_012 | How well do you understand competitors? | Competitive intelligence | 1.3 / 1.3 / 1.5 |
| INTEL_013 | How predictive are your models? | Predictive capability | 1.2 / 1.2 / 1.8 |
| INTEL_014 | How effective is your feedback loop? | Feedback mechanisms | 1.3 / 1.3 / 1.8 |
| INTEL_015 | How well do you identify trends early? | Trend identification | 1.5 / 1.2 / 2.0 |

---

#### **F1.3.5: Assessment Editor UI (For Consultants/Admins)**

**New Screen: S16 - Assessment Template Editor**

**Purpose**: Allow consultants to create/edit assessment templates with custom questions and weights.

**UI Components**:

1. **Template Settings Panel**:
   - Template name (text input)
   - Description (textarea)
   - Target archetypes (multi-select checkboxes)
   - Status (draft/active/archived)

2. **Question List** (sortable, drag-to-reorder):
   - Each question card shows:
     - Question text (editable inline)
     - Dimension badge (Speed/Strength/Intelligence)
     - Weight slider (0.5 - 5.0)
     - Question type (Slider/Multiple Choice/Yes-No)
     - Delete button
   - Add Question button

3. **Scoring Configuration Panel**:
   - Per dimension:
     - Scoring method (Weighted Average / Simple Average)
     - Dimension weight (for overall score)
     - Thresholds: Critical (<50), Weak (<70)
   - Preview: Sample score calculation

4. **Actions**:
   - Save Draft
   - Activate Template
   - Clone Template (create copy)
   - Preview Assessment (test-take it)

**Acceptance Criteria**:
- AC-S16.1: Consultant can create new template
- AC-S16.2: Consultant can edit questions and weights
- AC-S16.3: Consultant can reorder questions (drag-and-drop)
- AC-S16.4: Preview shows sample score calculation
- AC-S16.5: Template can be cloned for customization

---

#### **F1.3.6: Assessment Results with Question-Level Breakdown**

**Enhanced Results Screen (S3)**:

**Component 1: Dimension Scores (Radar Chart)**:
- Speed: 67/100 (⚠️ Needs Attention)
- Strength: 82/100 (✅ Strong)
- Intelligence: 73/100 (✅ Good)
- Overall: 74/100

**Component 2: Question-Level Breakdown** ⭐ **NEW**:

Weak Questions (Score < 7):
```
┌──────────────────────────────────────────────────────────┐
│ CRITICAL (Score < 5) - Highest Priority for OKRs        │
├──────────────────────────────────────────────────────────┤
│ 🔴 SPEED_005: Innovation cycle time                      │
│    Your score: 4/10 (Weight: 2.0)                        │
│    Impact: High weight question, drags down Speed score  │
│    Recommendation: Prioritize OKRs to improve innovation │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ NEEDS ATTENTION (Score 5-7)                              │
├──────────────────────────────────────────────────────────┤
│ 🟡 SPEED_001: Time-to-market                             │
│    Your score: 6/10 (Weight: 2.0)                        │
│                                                          │
│ 🟡 INTEL_007: Experimentation rigor                      │
│    Your score: 6/10 (Weight: 1.5)                        │
│                                                          │
│ 🟡 STRENGTH_002: Supply chain resilience                 │
│    Your score: 7/10 (Weight: 1.2)                        │
└──────────────────────────────────────────────────────────┘
```

**Component 3: OKR Generation Button**:
- "Generate OKRs Focused on Weak Areas" (primary CTA)
- When clicked, OpenAI prompt includes:
  - Dimension scores
  - Top 5 weakest questions (lowest scores, high weights)
  - Question text (so OpenAI understands specific weaknesses)

---

#### **F1.3.7: Integration with OpenAI OKR Generation**

**Enhanced OpenAI Prompt** (includes question-level insights):

```
BUSINESS CONTEXT:
- Archetype: Explorer
- Industry: SaaS
- Size: 25 employees

ASSESSMENT RESULTS (Weighted Scoring):
- Speed (Business Agility): 67/100 ⚠️ NEEDS ATTENTION (Weight in overall: 40%)
- Strength (Operational Stability): 82/100 ✅ STRONG (Weight in overall: 30%)
- Intelligence (Data-Driven Insights): 73/100 ✅ GOOD (Weight in overall: 30%)
- Overall: 74/100

CRITICAL WEAKNESSES (Top 5 Questions - Lowest Scores, High Impact):
1. 🔴 Innovation cycle time: 4/10 (Weight: 2.0, Dimension: Speed)
   Question: "How fast is your innovation cycle?"
   Impact: This high-weight question significantly drags down your Speed score.

2. 🟡 Time-to-market: 6/10 (Weight: 2.0, Dimension: Speed)
   Question: "How quickly can you launch new products to market?"

3. 🟡 Experimentation rigor: 6/10 (Weight: 1.5, Dimension: Intelligence)
   Question: "How rigorous is your experimentation process?"

4. 🟡 Market responsiveness: 6/10 (Weight: 1.8, Dimension: Speed)
   Question: "How rapidly can you respond to market changes?"

5. 🟡 Pivot capability: 6/10 (Weight: 1.8, Dimension: Speed)
   Question: "How quickly can you pivot your business model?"

STRATEGIC PRIORITIES:
Primary: Accelerate time-to-market, Boost innovation speed, Enhance customer insights
Secondary: Improve decision quality, Strengthen competitive position

TASK:
Generate 4-6 quarterly objectives (Q4 2025) that:
1. **PRIORITIZE the critical weaknesses above** (especially innovation cycle, time-to-market)
2. Address the Speed dimension (67/100 - lowest score)
3. Align with primary strategic priorities (80% weight)
4. Are appropriate for Explorer archetype (innovation-driven)
5. Follow OKR best practices

For each objective:
- title: Inspiring, outcome-focused
- rationale: EXPLICITLY reference which weak questions it addresses (e.g., "Addresses SPEED_005: Innovation cycle time")
- focusArea: Which strategic priority + which weak question
- difficulty: easy|medium|hard
- estimatedEffort: 15-25% team capacity
- keyResults: 3-4 measurable outcomes with baseline/target

Return JSON format.
```

**Expected OpenAI Output** (sample):
```json
{
  "objectives": [
    {
      "title": "Reduce product innovation cycle from 12 weeks to 6 weeks",
      "rationale": "Addresses SPEED_005 (Innovation cycle: 4/10) and SPEED_001 (Time-to-market: 6/10). These high-weight questions (2.0 each) are dragging down your Speed score to 67/100. Improving innovation speed is critical for Explorer archetype.",
      "focusArea": "boost_innovation_speed",
      "weak_questions_addressed": ["SPEED_005", "SPEED_001"],
      "difficulty": "medium",
      "estimatedEffort": "25%",
      "keyResults": [
        {
          "description": "Launch MVP in 6 weeks (down from 12 weeks average)",
          "metric": "Time to MVP",
          "baseline": "12 weeks",
          "target": "6 weeks",
          "quarter": 4
        }
      ]
    }
  ]
}
```

---

#### **F1.3.8: Consultant Multi-Company Comparison** ⭐ **CRITICAL**

**Why This Matters**: Consultants managing 5-10 clients need to compare assessment scores across companies to identify patterns and prioritize interventions.

**New Screen: S17 - Consultant Assessment Comparison**

**UI Layout**:

```
┌────────────────────────────────────────────────────────────────┐
│ Assessment Comparison (5 Clients)                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Company      Overall  Speed  Strength  Intelligence  Status  │
│  ──────────   ───────  ─────  ────────  ────────────  ──────  │
│  Acme Inc     74       67🟡   82✅      73✅          Healthy  │
│  Beta Corp    58       52🔴   61🟡      62🟡          At-Risk  │
│  Gamma Ltd    81       78✅   84✅      81✅          Strong   │
│  Delta Co     66       71✅   58🔴      69🟡          Weak     │
│  Epsilon      45       38🔴   48🔴      49🔴          Critical │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│  Average      65       61     67        67                     │
└────────────────────────────────────────────────────────────────┘

📊 Radar Chart (Overlay all 5 companies)
   [Shows all 5 companies on same radar chart for visual comparison]

🔍 Insights:
- 2 companies with critical Speed scores (<50)
- Epsilon needs urgent intervention (all dimensions <50)
- Beta Corp is at-risk (overall <60)
```

**Acceptance Criteria**:
- AC-S17.1: Shows all companies consultant has access to
- AC-S17.2: Sortable by any dimension score
- AC-S17.3: Color-coded (Green >70, Yellow 50-70, Red <50)
- AC-S17.4: Radar chart overlay (all companies on same chart)
- AC-S17.5: Click company → Navigate to detailed assessment results

---

#### **F1.3.9: Technical Requirements**

**Assessment Engine (port 8082)**:
- Service: `engines/assessment/services/scoring-service.js` (dynamic scoring)
- Service: `engines/assessment/services/template-service.js` (CRUD templates)
- Routes: `/api/assessment-templates` (list, create, update, delete)
- Routes: `/api/assessments` (take, submit, view results)
- Routes: `/api/assessments/:id/weak-areas` (get question-level breakdown)

**Database Models**:
- `AssessmentTemplate` (schema above)
- `Assessment` (responses + calculated scores)
- `AssessmentResponse` (individual question responses)

**Caching**:
- Assessment results cached (5-minute TTL)
- Template list cached (1-hour TTL)

**Performance**:
- Scoring calculation: <100ms
- Assessment submission: <500ms
- Question-level breakdown: <200ms

---

#### **F1.3.10: Acceptance Criteria**

**Assessment System**:
- AC1.3.1: Owner/Consultant can take assessment (<15 min)
- AC1.3.2: Scores calculated dynamically based on question weights
- AC1.3.3: Results show dimension scores + weak areas
- AC1.3.4: Question-level breakdown identifies specific weaknesses
- AC1.3.5: "Generate OKRs" button includes weak questions in OpenAI prompt

**Template Editor**:
- AC1.3.6: Consultant can create new template
- AC1.3.7: Consultant can edit questions, weights, scoring config
- AC1.3.8: Consultant can clone template for customization
- AC1.3.9: Preview shows sample score calculation
- AC1.3.10: Template can be activated/deactivated

**Multi-Company Comparison**:
- AC1.3.11: Consultant sees all client assessments in one view
- AC1.3.12: Comparison table sortable by any dimension
- AC1.3.13: Radar chart overlays all companies
- AC1.3.14: Critical companies (<50 any dimension) flagged

**Priority**: **P0 (BLOCKING - CRITICAL FOR CONSULTANTS)**

---

#### **F1.3.11: Multi-Level SSI Aggregation** ⭐ **NEW - CRITICAL**

**Description**: Individual SSI scores aggregate to team scores, which aggregate to organizational SSI. This enables accurate OKR generation at all levels (individual, team, org).

**Why This Matters**:
- **Individuals** see how their performance contributes to team/org scores
- **Managers** identify team strengths/weaknesses and coach individuals
- **Executives** understand organizational capabilities based on real data
- **Consultants** compare companies at individual, team, and org levels

---

**Assessment Type Hierarchy**:

```
┌─────────────────────────────────────────────────────────┐
│ ORGANIZATIONAL SSI (Company-Wide)                       │
│ Aggregated from all assessments below                   │
│ Weighted: 40% Individual + 30% Team + 20% Role + 10% Org│
└─────────────────────────────────────────────────────────┘
                         ↑
           ┌─────────────┼─────────────┐
           │             │             │
┌──────────────────┐ ┌─────────────┐ ┌──────────────────┐
│ INDIVIDUAL SSI   │ │ TEAM SSI    │ │ ROLE SSI         │
│ Every employee   │ │ By dept     │ │ By job function  │
│ (avg of all)     │ │ (avg of     │ │ (avg by role)    │
│                  │ │  members)   │ │                  │
└──────────────────┘ └─────────────┘ └──────────────────┘
```

---

**Assessment Types & Purpose**:

| Type | Who Takes It | Frequency | Questions Focus | SSI Contribution |
|------|--------------|-----------|-----------------|------------------|
| **Individual** | All employees (Employee, Manager, Exec) | Quarterly | Personal speed, learning, decision quality | Individual SSI (40% of org) |
| **Team** | All team members | Quarterly | Team collaboration, shared goals, cross-functional speed | Team SSI (30% of org) |
| **Role-Specific** | Members of specific role (e.g., Sales, Engineering) | Quarterly | Role-specific capabilities (e.g., pipeline velocity, code quality) | Role SSI (20% of org) |
| **Manager** | Managers + Executives only | Quarterly | Leadership effectiveness, team empowerment, strategic clarity | Manager SSI (feeds into org) |
| **Organizational** | All employees (weighted by role) | Annually | Company culture, strategic alignment, market positioning | Organizational SSI (10% of org) |

---

**SSI Aggregation Formula**:

```javascript
// Individual SSI Score (per person)
const calculateIndividualSSI = (userId, assessmentResponses) => {
  return {
    speed: calculateDimensionScore(assessmentResponses, 'speed'),
    strength: calculateDimensionScore(assessmentResponses, 'strength'),
    intelligence: calculateDimensionScore(assessmentResponses, 'intelligence'),
    user_id: userId,
    assessed_at: new Date()
  };
};

// Team SSI Score (average of team members + team dynamics adjustment)
const calculateTeamSSI = (teamId, memberSSIScores, teamAssessmentScore) => {
  const avgMemberSpeed = average(memberSSIScores.map(m => m.speed));
  const avgMemberStrength = average(memberSSIScores.map(m => m.strength));
  const avgMemberIntelligence = average(memberSSIScores.map(m => m.intelligence));

  // Team dynamics adjustment (from team assessment)
  const teamDynamicsAdjustment = teamAssessmentScore ? {
    speed: teamAssessmentScore.collaboration_speed_bonus || 0,
    strength: teamAssessmentScore.cohesion_strength_bonus || 0,
    intelligence: teamAssessmentScore.collective_learning_bonus || 0
  } : {speed: 0, strength: 0, intelligence: 0};

  return {
    speed: Math.min(100, avgMemberSpeed + teamDynamicsAdjustment.speed),
    strength: Math.min(100, avgMemberStrength + teamDynamicsAdjustment.strength),
    intelligence: Math.min(100, avgMemberIntelligence + teamDynamicsAdjustment.intelligence),
    team_id: teamId,
    member_count: memberSSIScores.length,
    assessed_at: new Date()
  };
};

// Organizational SSI Score (weighted average of all levels)
const calculateOrganizationalSSI = (businessId) => {
  // Get all individual SSI scores
  const individualScores = getAllIndividualSSI(businessId);
  const avgIndividualSSI = {
    speed: average(individualScores.map(s => s.speed)),
    strength: average(individualScores.map(s => s.strength)),
    intelligence: average(individualScores.map(s => s.intelligence))
  };

  // Get all team SSI scores
  const teamScores = getAllTeamSSI(businessId);
  const avgTeamSSI = {
    speed: average(teamScores.map(s => s.speed)),
    strength: average(teamScores.map(s => s.strength)),
    intelligence: average(teamScores.map(s => s.intelligence))
  };

  // Get role-specific SSI scores
  const roleScores = getAllRoleSSI(businessId);
  const avgRoleSSI = {
    speed: average(roleScores.map(s => s.speed)),
    strength: average(roleScores.map(s => s.strength)),
    intelligence: average(roleScores.map(s => s.intelligence))
  };

  // Get organizational assessment score (if exists)
  const orgAssessment = getOrganizationalAssessment(businessId);
  const orgAssessmentSSI = orgAssessment ? {
    speed: orgAssessment.speed_score,
    strength: orgAssessment.strength_score,
    intelligence: orgAssessment.intelligence_score
  } : null;

  // Weighted aggregation (40% individual, 30% team, 20% role, 10% org)
  return {
    speed: weightedAverage([
      {value: avgIndividualSSI.speed, weight: 0.4},
      {value: avgTeamSSI.speed, weight: 0.3},
      {value: avgRoleSSI.speed, weight: 0.2},
      {value: orgAssessmentSSI?.speed || avgIndividualSSI.speed, weight: 0.1}
    ]),
    strength: weightedAverage([
      {value: avgIndividualSSI.strength, weight: 0.4},
      {value: avgTeamSSI.strength, weight: 0.3},
      {value: avgRoleSSI.strength, weight: 0.2},
      {value: orgAssessmentSSI?.strength || avgIndividualSSI.strength, weight: 0.1}
    ]),
    intelligence: weightedAverage([
      {value: avgIndividualSSI.intelligence, weight: 0.4},
      {value: avgTeamSSI.intelligence, weight: 0.3},
      {value: avgRoleSSI.intelligence, weight: 0.2},
      {value: orgAssessmentSSI?.intelligence || avgIndividualSSI.intelligence, weight: 0.1}
    ]),
    overall: null, // Calculated as (speed + strength + intelligence) / 3
    business_id: businessId,
    breakdown: {
      individual: avgIndividualSSI,
      team: avgTeamSSI,
      role: avgRoleSSI,
      organizational: orgAssessmentSSI
    },
    total_individuals_assessed: individualScores.length,
    total_teams_assessed: teamScores.length,
    assessed_at: new Date()
  };
};
```

---

**New Data Model: Assessment Invitation**:

```javascript
// @karvia/shared-models/models/AssessmentInvitation.js
const assessmentInvitationSchema = new mongoose.Schema({
  template_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentTemplate', required: true },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  invited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Who should take this assessment
  invitees: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    status: { type: String, enum: ['pending', 'started', 'completed', 'expired'], default: 'pending' },
    invited_at: { type: Date, default: Date.now },
    started_at: { type: Date },
    completed_at: { type: Date },
    assessment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' } // Once completed
  }],

  // Assessment details
  assessment_type: { type: String, enum: ['individual', 'team', 'role_specific', 'manager', 'organizational'] },
  target_team: { type: String }, // If team assessment
  target_role: { type: String }, // If role-specific assessment

  // Deadline
  due_date: { type: Date, required: true },
  reminder_sent: { type: Boolean, default: false },

  // Status tracking
  total_invited: { type: Number, required: true },
  total_completed: { type: Number, default: 0 },
  completion_percentage: { type: Number, default: 0 },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});
```

---

**Functional Requirements**:

- **FR1.3.11.1**: Consultant/Admin creates assessment with target audience (roles, teams, job functions, or specific users)
- **FR1.3.11.2**: System sends invitations to all targeted users with deadline
- **FR1.3.11.3**: Users receive notification to complete assessment
- **FR1.3.11.4**: System tracks completion status (pending, started, completed, expired)
- **FR1.3.11.5**: Individual SSI scores calculated upon assessment completion
- **FR1.3.11.6**: Team SSI scores auto-calculated when all team members complete
- **FR1.3.11.7**: Organizational SSI score auto-calculated from all levels
- **FR1.3.11.8**: Managers can view team SSI breakdown (individual member scores)
- **FR1.3.11.9**: Executives can view org SSI breakdown (team scores, role scores)
- **FR1.3.11.10**: Consultants can compare SSI scores across companies at all levels

---

**Technical Requirements**:

**Assessment Engine (port 8082)**:
- Service: `engines/assessment/services/aggregation-service.js` (SSI aggregation logic)
- Service: `engines/assessment/services/invitation-service.js` (send invitations, track completion)
- Routes: `/api/assessment-invitations` (create, list, track)
- Routes: `/api/assessments/ssi/individual/:userId` (get individual SSI)
- Routes: `/api/assessments/ssi/team/:teamId` (get team SSI)
- Routes: `/api/assessments/ssi/role/:role` (get role SSI)
- Routes: `/api/assessments/ssi/organization/:businessId` (get org SSI)

**Database Models**:
- `AssessmentInvitation` (schema above)
- `IndividualSSI` (cached individual scores)
- `TeamSSI` (cached team scores)
- `OrganizationalSSI` (cached org scores)

**Background Jobs**:
- Daily job: Send reminder emails for pending assessments
- On assessment completion: Recalculate team/org SSI scores
- Weekly job: Generate SSI trend reports

---

**Acceptance Criteria**:

**Invitations**:
- AC1.3.11.1: Consultant can create assessment and invite specific users/teams/roles
- AC1.3.11.2: Invitees receive email notification with assessment link
- AC1.3.11.3: Dashboard shows completion status (X/Y completed, Z% completion rate)
- AC1.3.11.4: Reminder emails sent 2 days before deadline

**Individual SSI**:
- AC1.3.11.5: Individual SSI score calculated upon assessment completion
- AC1.3.11.6: Employee can view own SSI score (speed, strength, intelligence)
- AC1.3.11.7: Employee can see how their score compares to team average

**Team SSI**:
- AC1.3.11.8: Team SSI auto-calculated when ≥80% of team completes assessment
- AC1.3.11.9: Manager can view team SSI breakdown (list of member scores)
- AC1.3.11.10: Manager can identify outliers (members with critical scores <50)

**Organizational SSI**:
- AC1.3.11.11: Org SSI auto-calculated when ≥70% of employees complete assessment
- AC1.3.11.12: Executive can view org SSI breakdown (individual, team, role, org levels)
- AC1.3.11.13: Executive can drill down: Org → Team → Individual
- AC1.3.11.14: Consultant can compare org SSI across all clients

**OKR Generation**:
- AC1.3.11.15: OpenAI prompt includes organizational SSI + team breakdown
- AC1.3.11.16: OKRs can be generated at individual, team, or org level
- AC1.3.11.17: Individual OKRs target personal weak areas (e.g., "John's Speed: 58")
- AC1.3.11.18: Team OKRs target team weak areas (e.g., "Sales Team Speed: 62")
- AC1.3.11.19: Org OKRs target org weak areas (e.g., "Org Speed: 67")

**Priority**: **P0 (BLOCKING - CRITICAL FOR MULTI-LEVEL ASSESSMENT)**

---

---

### **F1.4: Template-Based OKR Generation**

**Description**: Fallback OKR generation using pre-built templates when OpenAI unavailable.

**Functional Requirements**:
- FR1.4.1: System has 20+ pre-built OKR templates
- FR1.4.2: Templates categorized by: archetype, focus area, weak dimension
- FR1.4.3: Template selector uses: business archetype + assessment weak areas
- FR1.4.4: Each template has 4-6 objectives with 3-4 key results each
- FR1.4.5: Templates include placeholders (e.g., `{company_name}`, `{industry}`)
- FR1.4.6: Placeholders auto-filled from business profile
- FR1.4.7: Owner can edit templates before accepting

**Template Structure**:
```json
{
  "template_id": "explorer_innovation_speed",
  "name": "Innovation Speed Improvement",
  "archetypes": ["explorer", "reactor", "disruptor"],
  "focus_areas": ["accelerate_time_to_market", "boost_innovation_speed"],
  "weak_dimensions": ["speed"],
  "objectives": [
    {
      "title": "Reduce product development cycle time by 30%",
      "rationale": "Speed score is {speed_score}/100, indicating slow time-to-market",
      "focus_area": "accelerate_time_to_market",
      "difficulty": "medium",
      "estimated_effort": "20%",
      "key_results": [
        {
          "description": "Ship MVP in 4 weeks instead of 12",
          "metric": "Time to MVP",
          "baseline": "12 weeks",
          "target": "4 weeks",
          "quarter": 4
        }
      ]
    }
  ]
}
```

**Template Categories** (20+ templates):
- Innovation Speed (Explorer, Reactor, Disruptor)
- Operational Efficiency (Consolidator, Optimizer)
- Growth & Expansion (Expander, Prospector)
- Stability & Risk (Defender, Sustainer)
- Transformation (Renovator, Turnaround)
- Data & Analytics (Analyzer)
- Partnerships (Cooperator, Integrator)
- Niche Excellence (Specialist)
- Profit Optimization (Harvester)

**Technical Requirements**:
- Planner Engine (port 8083) handles template selection
- Template service: `engines/planner/services/template-service.js`
- Templates stored in: `engines/planner/data/templates/` (JSON files)
- Fallback automatically triggered when OpenAI fails

**Acceptance Criteria**:
- AC1.4.1: Template OKRs generated in <2 seconds
- AC1.4.2: Templates appropriate for business archetype
- AC1.4.3: Weak areas (score <70) prioritized in template selection
- AC1.4.4: All placeholders replaced with actual business data
- AC1.4.5: Owner can edit generated OKRs before accepting

**Priority**: P0 (Blocking - ensures platform always works)

---

### **F1.5: Goals & Tasks Cascade**

**Description**: Complete OKR cascade from Objective → Key Results → Goals → Tasks.

**Hierarchy**:
```
Objective (Quarterly, 4-6 per business)
  ↓
Key Result (3-4 per objective, measurable outcomes)
  ↓
Goal (Weekly, assigned to individual, 5-10 per key result)
  ↓
Task (Daily, specific actions, 3-7 per goal)
```

**Functional Requirements**:

**Goals (FR1.5.1 - FR1.5.7)**:
- FR1.5.1: Manager selects a Key Result and creates weekly goals
- FR1.5.2: Each goal has: title, description, assigned_to, week_number, quarter, due_date
- FR1.5.3: Goals can be marked: not_started, in_progress, completed, at_risk, blocked
- FR1.5.4: Progress percentage auto-calculated from completed tasks
- FR1.5.5: Manager can reassign goals to different team members
- FR1.5.6: Employee sees all goals assigned to them
- FR1.5.7: Goal detail shows: tasks (count), progress (%), status, due date

**Tasks (FR1.5.8 - FR1.5.14)**:
- FR1.5.8: Manager or Employee creates tasks under a goal
- FR1.5.9: Each task has: title, description, assigned_to, due_date, estimated_hours, priority
- FR1.5.10: Tasks can be marked: todo, in_progress, completed, blocked
- FR1.5.11: Employee can update task status and add completion notes
- FR1.5.12: Manager can see all team tasks in one view
- FR1.5.13: Task priority: low, medium, high, urgent (color-coded)
- FR1.5.14: Employee dashboard shows "Top 3 tasks today" (due today, high priority)

**Progress Calculation**:
```javascript
// Goal progress = % of tasks completed
goal.progress_percentage = (completed_tasks / total_tasks) * 100

// Key Result progress = average of goal progress
key_result.progress_percentage = average(goal.progress_percentage for all goals)

// Objective progress = average of key result progress
objective.progress_percentage = average(key_result.progress_percentage for all KRs)
```

**Technical Requirements**:
- Goal model in `@karvia/shared-models/models/Goal.js`
- Task model in `@karvia/shared-models/models/Task.js`
- Scoring Engine (port 8084) handles progress calculation
- Tracking Engine (port 8086) handles task updates
- Server routes: `/api/goals`, `/api/tasks`

**Acceptance Criteria**:
- AC1.5.1: Manager can create goals from key results
- AC1.5.2: Manager can create tasks from goals
- AC1.5.3: Employee can update task status
- AC1.5.4: Progress auto-updates when task completed
- AC1.5.5: Employee dashboard shows correct "Top 3 tasks today"
- AC1.5.6: Cascade visible: Objective → KR → Goal → Task

**Priority**: P0 (Blocking)

---

### **F1.6: Team Invitation System**

**Description**: Token-based invitation system for onboarding team members.

**Functional Requirements**:
- FR1.6.1: Company Admin can invite users via email
- FR1.6.2: Each invitation includes: email, role, expiration (7 days)
- FR1.6.3: System generates secure token (32-byte hex)
- FR1.6.4: Invitation email sent with registration link + token
- FR1.6.5: Invitee clicks link, lands on registration page (pre-filled email)
- FR1.6.6: Invitee enters name + password, account created with assigned role
- FR1.6.7: Invitation marked "accepted" and cannot be reused
- FR1.6.8: Expired invitations cannot be used (returns error)
- FR1.6.9: Company Admin can resend or cancel invitations

**Invitation States**:
- `pending`: Sent, not yet accepted
- `accepted`: User registered successfully
- `expired`: Past expiration date
- `cancelled`: Manually cancelled by admin

**Email Template**:
```
Subject: You've been invited to join {Business Name} on Karvia OKR

Hi,

{Inviter Name} has invited you to join {Business Name} as a {Role}.

Karvia OKR helps teams align around strategic objectives and track progress.

Click here to accept your invitation:
{APP_URL}/register?token={TOKEN}

This invitation expires in 7 days.

If you have questions, contact {Inviter Email}.

- The Karvia Team
```

**Technical Requirements**:
- Invitation model in `@karvia/shared-models/models/Invitation.js`
- IAM Engine handles: create, validate, accept invitations
- Invitation service: `engines/iam/services/invitation-service.js`
- Email service integration (SendGrid, AWS SES, or similar)
- Token validation middleware

**Acceptance Criteria**:
- AC1.6.1: Invitation email delivered within 1 minute
- AC1.6.2: Registration link pre-fills email field
- AC1.6.3: Valid token creates account with correct role
- AC1.6.4: Expired token shows error message
- AC1.6.5: Accepted invitation cannot be reused
- AC1.6.6: Invitations listed in admin panel with status

**Priority**: P0 (Blocking)

---

### **F1.7: Role-Based Dashboards**

**Description**: Personalized dashboards for each user role.

**Owner Dashboard (Company Admin)**:
- Business health score (overall assessment score)
- Objectives progress (all 4-6 objectives with progress bars)
- Team activity (recent updates, completions)
- Generate OKRs button (if no objectives exist)
- Invite team button

**Manager Dashboard**:
- Team progress summary (team members, task completion rate)
- My team's objectives (objectives with assigned goals)
- Tasks needing attention (overdue, blocked, high priority)
- Assign goals/tasks button
- Team capacity view (workload distribution)

**Employee Dashboard**:
- Top 3 tasks today (due today, high priority)
- My objectives (progress, contribution to company goals)
- Recent updates (comments, status changes)
- This week's goals (weekly view)
- Quick task update (complete, defer)

**Consultant Dashboard**:
- Client list (all companies, health scores)
- Switch company dropdown
- Selected company view (same as owner dashboard, read-only)
- Assessment comparison across clients
- Generate OKRs for client button

**Shared Elements (All Dashboards)**:
- Navigation: Home, Objectives, Goals, Tasks, Settings
- User menu: Profile, Logout
- Notifications (upcoming due dates, mentions)

**Technical Requirements**:
- Dashboard data loaded via API calls (no server-side rendering)
- API endpoint: `/api/dashboard/:role`
- Dashboard caching (Redis or in-memory, 5-minute TTL)
- Lazy loading for large datasets (pagination)

**Acceptance Criteria**:
- AC1.7.1: Dashboard loads in <2 seconds
- AC1.7.2: Role-specific navigation (employees don't see admin features)
- AC1.7.3: Data accurate (matches database)
- AC1.7.4: Consultant can switch companies without page reload

**Priority**: P0 (Blocking)

---

## TIER 2: AI-POWERED FEATURES

### **F2.1: OpenAI OKR Generation**

**Description**: AI-generated OKRs from assessment results using OpenAI GPT-4.

**Functional Requirements**:
- FR2.1.1: Owner clicks "Generate OKRs" after completing assessment
- FR2.1.2: System builds prompt with: business context, assessment scores, archetype, preferences
- FR2.1.3: OpenAI generates 4-6 quarterly objectives
- FR2.1.4: Each objective has: title, rationale, focus area, difficulty, 3-4 key results
- FR2.1.5: Results displayed for review (owner can edit)
- FR2.1.6: Owner can regenerate OKRs (uses same assessment)
- FR2.1.7: Generated OKRs cached for 24 hours (reduce API costs)
- FR2.1.8: If OpenAI fails, automatically fall back to template-based OKRs

**OpenAI Prompt Structure**:
```
BUSINESS CONTEXT:
- Archetype: {archetype}
- Industry: {industry}
- Size: {employee_count} employees

ASSESSMENT RESULTS:
- Speed (Business Agility): {speed_score}/100 {weak_flag}
- Strength (Stability): {strength_score}/100 {weak_flag}
- Intelligence (Insight): {intelligence_score}/100 {weak_flag}
- Overall: {overall_score}/100

WEAKEST AREAS (Priority):
{areas with score <70, sorted by score}

STRATEGIC PRIORITIES:
Primary: {primary_focus_areas}
Secondary: {secondary_focus_areas}

TASK:
Generate 4-6 quarterly objectives (Q{current_quarter}) that:
1. Address weakest assessment areas (scores <70 get highest priority)
2. Align with primary strategic priorities (80% weight)
3. Are appropriate for {archetype} businesses
4. Follow OKR best practices (specific, measurable, time-bound, achievable)

For each objective:
- title: Inspiring, outcome-focused
- rationale: Why this matters based on scores
- focusArea: Which strategic priority it addresses
- difficulty: easy|medium|hard
- estimatedEffort: Percentage of team capacity (15-25%)
- keyResults: 3-4 measurable outcomes with baseline/target

Return JSON format:
{objectives: [{title, rationale, focusArea, difficulty, estimatedEffort, keyResults: [{description, metric, baseline, target, quarter}]}]}
```

**Technical Requirements**:
- OpenAI API integration in Planner Engine
- Service: `engines/planner/services/openai-service.js`
- Model: `gpt-4` (fallback to `gpt-3.5-turbo` if quota exceeded)
- Temperature: 0.7 (balance creativity and consistency)
- Max tokens: 2500
- Response format: JSON mode
- Redis caching (24-hour TTL)
- Error handling: timeout, rate limit, invalid response

**Acceptance Criteria**:
- AC2.1.1: OKRs generated in <5 seconds (p95)
- AC2.1.2: 4-6 objectives returned (validated)
- AC2.1.3: Each objective has 3-4 key results
- AC2.1.4: Objectives align with weak areas (scores <70)
- AC2.1.5: Fallback to templates if OpenAI fails
- AC2.1.6: Cached results returned in <1 second
- AC2.1.7: Regenerate button creates new OKRs

**Priority**: P1 (High - differentiator)

---

### **F2.2: AI Task Suggestions**

**Description**: AI-generated task breakdown for goals using OpenAI GPT-4.

**Functional Requirements**:
- FR2.2.1: Manager selects a goal and clicks "Suggest Tasks"
- FR2.2.2: System builds prompt with: goal context, key result, objective
- FR2.2.3: OpenAI generates 5-7 specific, actionable tasks
- FR2.2.4: Each task has: title, description, estimated_hours, priority, dependencies
- FR2.2.5: Manager reviews tasks (edit, delete, add)
- FR2.2.6: Manager assigns tasks to team members
- FR2.2.7: Suggested tasks cached for 1 hour

**OpenAI Prompt Structure**:
```
GOAL: {goal_title}
DESCRIPTION: {goal_description}

CONTEXT:
- This goal contributes to Key Result: "{key_result_description}"
- Which is part of Objective: "{objective_title}"
- Due: Week {week_number}, Q{quarter}

TASK:
Suggest 5-7 specific, actionable tasks to complete this goal.
For each task:
- title: Specific action (verb + noun, <50 chars)
- description: What needs to be done (<200 chars)
- estimated_hours: Realistic time estimate
- priority: low|medium|high|urgent
- dependencies: Which tasks should be done first (by index)

Return JSON:
{tasks: [{title, description, estimated_hours, priority, dependencies: []}]}
```

**Technical Requirements**:
- OpenAI service: `engines/planner/services/openai-service.js`
- Model: `gpt-4`
- Temperature: 0.7
- Max tokens: 1000
- Redis caching (1-hour TTL)
- Fallback: Return empty array (manager creates tasks manually)

**Acceptance Criteria**:
- AC2.2.1: Tasks generated in <3 seconds
- AC2.2.2: 5-7 tasks returned
- AC2.2.3: Tasks are specific and actionable
- AC2.2.4: Dependencies valid (reference existing task indexes)
- AC2.2.5: Manager can edit before assigning
- AC2.2.6: Fallback doesn't break UI (empty state)

**Priority**: P1 (High - differentiator)

---

## TIER 3: iBRAIN FEATURES

**Note**: All iBrain features are deferred to Beta release (Q1 2026). See [../02_Beta/](../02_Beta/).

For MVP, we implement the **iBrain Admin Toggle System** (UI + backend) so external party can see the architecture, but features themselves are not implemented.

---

## 🎨 iBRAIN ADMIN TOGGLE SYSTEM

### **Overview**

Admin panel with 6 toggle switches (one per iBrain feature). Toggles update Business model and control feature visibility in UI.

### **Features with Toggles**

1. **Predictive Analytics** (`predictive`)
2. **Sentiment Analysis** (`sentiment`)
3. **AI Coaching Assistant** (`coaching`)
4. **Workflow Automation** (`workflows`)
5. **Custom ML Models** (`customML`)
6. **Advanced Dashboards** (`advancedDashboards`)

---

### **F3.1: iBrain Settings Page (Admin Panel)**

**Description**: Admin UI for managing iBrain feature toggles.

**Functional Requirements**:
- FR3.1.1: Super Admin and Company Admin can access iBrain settings
- FR3.1.2: Page shows 6 feature toggle cards
- FR3.1.3: Each card shows: feature name, description, status (active/inactive), toggle switch
- FR3.1.4: Toggling switch sends API request to update Business model
- FR3.1.5: UI updates immediately (optimistic update)
- FR3.1.6: Disabled features hidden from main navigation
- FR3.1.7: Page shows current subscription plan (free, starter, professional, enterprise)

**UI Layout**:

```
┌────────────────────────────────────────────────────────┐
│  iBrain Feature Settings                               │
│  Enable or disable proprietary AI enhancements         │
│                                                        │
│  Current Plan: Professional                            │
│  Subscription: Jan 1, 2026 - Dec 31, 2026            │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  📊 Predictive Analytics                    [●──────]  │ ON
│  Predict at-risk objectives 2 weeks in advance         │
│                                                        │
│  Features:                                             │
│  • At-risk objective detection                         │
│  • Team burnout prediction                             │
│  • Success probability scoring                         │
│                                                        │
│  Status: ✅ Active                                     │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  💬 Sentiment Analysis                      [──────●]  │ OFF
│  Daily mood tracking and reflection system             │
│                                                        │
│  Features:                                             │
│  • Daily mood check-ins                                │
│  • Reflection prompts                                  │
│  • Sentiment trend analysis                            │
│                                                        │
│  Status: ⚪ Inactive                                   │
└────────────────────────────────────────────────────────┘

[Repeat for 4 other features: coaching, workflows, customML, advancedDashboards]
```

**Technical Requirements**:
- Page: `client/pages/admin/ibrain-settings.html`
- API: `/api/ibrain-settings/config` (GET), `/api/ibrain-settings/toggle-feature` (PUT)
- Real-time update (no page reload)
- Optimistic UI (toggle switch updates immediately, revert on API error)

**Acceptance Criteria**:
- AC3.1.1: Only Super Admin and Company Admin can access page
- AC3.1.2: All 6 feature toggles displayed
- AC3.1.3: Toggling switch updates database
- AC3.1.4: UI reflects current state from database
- AC3.1.5: Error handling (show error message, revert toggle if API fails)

**Priority**: P0 (Demonstrates iBrain architecture to external party)

---

### **F3.2: iBrain API Endpoints**

**Description**: Backend API for managing iBrain feature configuration.

**Endpoints**:

**GET `/api/ibrain-settings/config`**
- Returns current iBrain configuration for authenticated user's business
- Response:
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "api_url": "https://ibrain.karvia.ai",
    "subscription_plan": "professional",
    "features": {
      "predictive": true,
      "sentiment": false,
      "coaching": true,
      "workflows": false,
      "customML": false,
      "advancedDashboards": true
    },
    "subscription_start_date": "2026-01-01",
    "subscription_end_date": "2026-12-31"
  }
}
```

**PUT `/api/ibrain-settings/toggle-feature`**
- Toggles specific iBrain feature
- Request body:
```json
{
  "feature": "predictive",
  "enabled": true
}
```
- Response:
```json
{
  "success": true,
  "message": "Feature 'predictive' enabled",
  "data": {
    "predictive": true,
    "sentiment": false,
    "coaching": true,
    "workflows": false,
    "customML": false,
    "advancedDashboards": true
  }
}
```

**PUT `/api/ibrain-settings/update-config`**
- Updates full iBrain configuration (Super Admin only)
- Request body:
```json
{
  "enabled": true,
  "api_url": "https://ibrain.karvia.ai",
  "api_key": "sk_live_...",
  "subscription_plan": "enterprise",
  "subscription_start_date": "2026-01-01",
  "subscription_end_date": "2026-12-31"
}
```

**Technical Requirements**:
- Routes: `server/routes/ibrain-settings.js`
- Middleware: `authenticate`, `authorize(['super_admin', 'company_admin'])`
- Validation: Feature name must be one of 6 valid features
- Business model updated via Mongoose
- Audit log: Observer Engine logs all config changes

**Acceptance Criteria**:
- AC3.2.1: Only authorized users can access endpoints
- AC3.2.2: Invalid feature names return 400 error
- AC3.2.3: Toggle updates Business model in database
- AC3.2.4: Config changes logged in Observer Engine

**Priority**: P0 (Required for toggle system)

---

### **F3.3: Feature Visibility Control**

**Description**: UI conditionally shows/hides features based on iBrain config.

**Functional Requirements**:
- FR3.3.1: Frontend loads iBrain config on app initialization
- FR3.3.2: Navigation menu hides disabled features
- FR3.3.3: Feature pages return 403 if feature disabled
- FR3.3.4: Dashboard widgets hide when features disabled
- FR3.3.5: API endpoints return 403 if feature disabled for business

**Implementation**:

**Frontend (client/js/feature-flags.js)**:
```javascript
// Load iBrain config
async function loadIBrainConfig() {
  const response = await fetch('/api/ibrain-settings/config');
  const { data } = await response.json();

  // Store in localStorage
  localStorage.setItem('ibrain_config', JSON.stringify(data));

  return data;
}

// Check if feature enabled
function isFeatureEnabled(feature) {
  const config = JSON.parse(localStorage.getItem('ibrain_config') || '{}');
  return config.features?.[feature] === true;
}

// Update navigation based on features
function updateNavigation() {
  if (!isFeatureEnabled('predictive')) {
    document.getElementById('nav-predictive')?.remove();
  }
  if (!isFeatureEnabled('sentiment')) {
    document.getElementById('nav-sentiment')?.remove();
  }
  // ... repeat for other features
}
```

**Backend (server/middleware/feature-check.js)**:
```javascript
const { Business } = require('@karvia/shared-models');

function requireFeature(featureName) {
  return async (req, res, next) => {
    const business = await Business.findById(req.user.business_id);

    if (!business.ibrain_config.enabled) {
      return res.status(403).json({
        success: false,
        message: 'iBrain features not enabled for this business'
      });
    }

    if (!business.ibrain_config.features[featureName]) {
      return res.status(403).json({
        success: false,
        message: `Feature '${featureName}' not enabled`
      });
    }

    next();
  };
}

module.exports = { requireFeature };
```

**Usage in Routes**:
```javascript
const { requireFeature } = require('../middleware/feature-check');

// Protected iBrain endpoint
router.get('/predictive-analytics',
  authenticate,
  requireFeature('predictive'),
  async (req, res) => {
    // Feature logic here
  }
);
```

**Acceptance Criteria**:
- AC3.3.1: Disabled features not visible in navigation
- AC3.3.2: Accessing disabled feature URL returns 403
- AC3.3.3: Toggling feature updates UI without page reload
- AC3.3.4: Dashboard widgets hide when features disabled

**Priority**: P0 (Required for toggle system)

---

### **F3.4: Graceful Degradation**

**Description**: Platform continues working when iBrain features disabled.

**Fallback Behaviors**:

| Feature | Enabled | Disabled (Fallback) |
|---------|---------|---------------------|
| **Predictive Analytics** | At-risk flags 2 weeks early, burnout detection | Manual progress tracking only |
| **Sentiment Analysis** | Daily mood tracking, reflection prompts, trends | No sentiment data collected |
| **AI Coaching** | Multi-turn coaching conversations | Static help articles, FAQs |
| **Workflows** | Automated task creation, escalation rules | Manual task creation only |
| **Custom ML** | Fine-tuned models per archetype, company learning | Generic OpenAI models (GPT-4) |
| **Advanced Dashboards** | Predictive dashboard, executive dashboard, analytics | Basic progress dashboards only |

**Functional Requirements**:
- FR3.4.1: Disabling feature does NOT break core functionality
- FR3.4.2: Disabled features return meaningful fallback
- FR3.4.3: User sees helpful message ("This feature requires iBrain Professional plan")
- FR3.4.4: Upgrade prompts shown for disabled features (if applicable)

**Technical Requirements**:
- Feature checks in frontend (hide disabled widgets)
- Feature checks in backend (return 403 or fallback data)
- Error messages user-friendly (not technical)

**Acceptance Criteria**:
- AC3.4.1: Platform works fully with ALL iBrain features disabled
- AC3.4.2: Disabling feature doesn't cause errors in console
- AC3.4.3: Users understand which features are available

**Priority**: P0 (Critical for external party handoff)

---

## 📱 17 CORE SCREENS (Updated with Assessment System)

### **Owner Screens (5)**

#### **S1: Signup & Business Profile**
- Form fields: Business name, industry, employee count, owner name, email, password
- Archetype selector (16 options with descriptions)
- Strategic preferences (24 checkboxes, mark 3-5 as primary/secondary)
- Submit → Creates business + owner account → Redirect to assessment

**Acceptance Criteria**:
- AC-S1.1: Form validation (all required fields)
- AC-S1.2: Password strength indicator
- AC-S1.3: Archetype descriptions visible on hover
- AC-S1.4: Must select at least 3 strategic preferences

---

#### **S2: Take Assessment**
- 30-40 questions (slider 1-10 or radio buttons)
- Progress bar (shows % completion)
- Questions grouped by dimension (Speed, Strength, Intelligence)
- Save progress (can resume later)
- Submit → Calculates scores → Redirect to results

**Acceptance Criteria**:
- AC-S2.1: All questions can be answered
- AC-S2.2: Progress saved every 5 questions
- AC-S2.3: Completion time <15 minutes
- AC-S2.4: Cannot submit until all questions answered

---

#### **S3: Assessment Results + Generate OKRs** ⭐ **ENHANCED**
- **Radar chart** (Speed, Strength, Intelligence scores)
- **Dimension scores** (each dimension + overall, with thresholds)
- **Question-level breakdown** ⭐ **NEW**: Shows weak questions (score <7) with:
  - Question ID and text
  - Score (out of 10)
  - Weight (impact on dimension score)
  - Severity (Critical <5, Weak 5-7)
  - Color-coded (Red for critical, Yellow for weak)
- **Weak areas highlighted** (dimension <70, question <7)
- **"Generate OKRs Focused on Weak Areas"** button (primary CTA)
- **Loading state** (while OpenAI generates OKRs)
- **Fallback message** (if OpenAI fails, templates used)

**Acceptance Criteria**:
- AC-S3.1: Radar chart displays correctly
- AC-S3.2: Dimension scores show thresholds (critical <50, weak <70)
- AC-S3.3: Question-level breakdown shows top 5-10 weakest questions
- AC-S3.4: Questions sorted by severity (critical first) then score (lowest first)
- AC-S3.5: Generate button triggers OKR generation with question-level context
- AC-S3.6: Loading spinner shows during generation
- AC-S3.7: Fallback message if templates used

---

#### **S4: Review Generated OKRs**
- List of 4-6 objectives (expandable cards)
- Each card shows: title, rationale, 3-4 key results
- Edit mode (inline editing of titles, targets)
- Regenerate button (calls OpenAI again)
- Approve button → Saves objectives to database → Redirect to dashboard

**Acceptance Criteria**:
- AC-S4.1: All objectives displayed
- AC-S4.2: Inline editing works
- AC-S4.3: Regenerate creates new OKRs
- AC-S4.4: Approve saves to database
- AC-S4.5: Can edit after approving

---

#### **S5: Invite Team**
- Form: Email, role (dropdown: Manager, Employee, Consultant)
- Send invitation button
- List of sent invitations (status: pending, accepted, expired)
- Resend/cancel buttons for pending invitations

**Acceptance Criteria**:
- AC-S5.1: Email validation
- AC-S5.2: Invitation sent successfully
- AC-S5.3: Invitation list updates in real-time
- AC-S5.4: Resend/cancel work correctly

---

### **Manager Screens (4)**

#### **S6: Manager Dashboard**
- Team progress summary (completion rate, overdue tasks)
- Team members (avatars, task counts)
- Objectives with assigned goals (progress bars)
- Tasks needing attention (overdue, blocked, high priority)
- Quick actions: Assign goal, create task

**Acceptance Criteria**:
- AC-S6.1: Dashboard loads <2 seconds
- AC-S6.2: Data accurate (matches database)
- AC-S6.3: Quick actions work

---

#### **S7: Manager Planning**
- List of approved objectives
- Select objective → View key results
- Select key result → Create goals (weekly breakdown)
- Assign goals to team members (dropdown)
- AI suggest tasks button

**Acceptance Criteria**:
- AC-S7.1: Can create goals from key results
- AC-S7.2: Assign to team members
- AC-S7.3: AI task suggestion works

---

#### **S8: Team Management**
- List of team members (name, role, task count, workload)
- Workload visualization (bar chart: hours assigned vs capacity)
- Filter: by role, by status
- Capacity view: who's overloaded, who has capacity

**Acceptance Criteria**:
- AC-S8.1: Team list accurate
- AC-S8.2: Workload chart displays correctly
- AC-S8.3: Can identify overloaded team members

---

#### **S9: Task Assignment**
- Select goal → AI suggest tasks button
- List of suggested tasks (edit, delete, add more)
- Assign tasks to team members
- Set due dates, priorities
- Bulk actions (assign all to same person)

**Acceptance Criteria**:
- AC-S9.1: AI suggestions work
- AC-S9.2: Can edit suggested tasks
- AC-S9.3: Bulk assign works

---

### **Employee Screens (3)**

#### **S10: Employee Dashboard**
- Top 3 tasks today (due today, high priority)
- My objectives (progress contribution)
- This week's goals (weekly view)
- Quick update (mark task complete, add notes)

**Acceptance Criteria**:
- AC-S10.1: Top 3 tasks correct (due today, high priority)
- AC-S10.2: Quick update works
- AC-S10.3: Dashboard loads <2 seconds

---

#### **S11: My Objectives**
- List of objectives (employee contributes to)
- Progress visualization (contribution %)
- Cascade view: Objective → KR → Goal (assigned to me) → Tasks
- Filter: by quarter, by status

**Acceptance Criteria**:
- AC-S11.1: Only shows objectives employee contributes to
- AC-S11.2: Cascade visible
- AC-S11.3: Progress accurate

---

#### **S12: Task Detail**
- Task title, description, due date, priority
- Status update (todo, in_progress, completed, blocked)
- Completion notes (text area)
- Time tracking (estimated vs actual hours)
- History (status changes, comments)

**Acceptance Criteria**:
- AC-S12.1: Status update saves
- AC-S12.2: Completion notes saved
- AC-S12.3: History visible

---

### **Consultant Screens (2)**

#### **S13: Consultant Client List**
- List of all companies (consultant has access to)
- Each card shows: Company name, health score, objectives count, last activity
- Sort: by health score, by name
- Filter: by industry, by archetype
- Click company → Switch context → Redirect to S14

**Acceptance Criteria**:
- AC-S13.1: All authorized companies visible
- AC-S13.2: Health scores accurate
- AC-S13.3: Click switches context

---

#### **S14: Consultant Company View**
- Same as Owner Dashboard (S3 + S4 combined)
- Read-only mode (consultant can view, not edit)
- Generate OKRs button (creates OKRs for client)
- Company switcher dropdown (top-right)

**Acceptance Criteria**:
- AC-S14.1: Data matches selected company
- AC-S14.2: Read-only (no edit buttons)
- AC-S14.3: Generate OKRs works
- AC-S14.4: Company switcher works

---

### **Shared Screens (1)**

#### **S15: Registration via Invite**
- Token extracted from URL query param
- Email pre-filled (from invitation)
- Form fields: Name, password, confirm password
- Submit → Creates account with assigned role → Redirect to role-specific dashboard

**Acceptance Criteria**:
- AC-S15.1: Email pre-filled
- AC-S15.2: Password validation
- AC-S15.3: Account created with correct role
- AC-S15.4: Redirects to correct dashboard

---

### **Consultant/Admin Screens (2)** ⭐ **NEW**

#### **S16: Assessment Template Editor** ⭐ **CRITICAL FOR CONSULTANTS**
- **Template Settings Panel**:
  - Template name (text input)
  - Description (textarea)
  - Target archetypes (multi-select: 16 archetypes)
  - Status (dropdown: Draft/Active/Archived)
  - Author (auto-filled from logged-in consultant)
- **Question List** (drag-to-reorder):
  - Each question card shows:
    - Question ID (auto-generated, e.g., SPEED_001)
    - Question text (editable inline)
    - Dimension badge (Speed/Strength/Intelligence dropdown)
    - Sub-dimension (optional, text input)
    - Question type (Slider 1-10 / Multiple Choice / Yes-No)
    - Weight slider (0.5 - 5.0, default 1.0)
    - Delete button (with confirmation)
  - **Add Question** button (opens modal)
  - **Reorder** (drag-and-drop)
- **Scoring Configuration Panel** (per dimension):
  - Speed config:
    - Scoring method (Weighted Average / Simple Average)
    - Dimension weight (for overall score, default 1.0)
    - Critical threshold (default <50)
    - Weak threshold (default <70)
  - Strength config (same as above)
  - Intelligence config (same as above)
  - **Preview Score Calculation** button (test with sample responses)
- **Actions**:
  - **Save Draft** (saves without activating)
  - **Activate Template** (makes available to businesses)
  - **Clone Template** (creates editable copy)
  - **Preview Assessment** (test-take the assessment)
  - **Delete Template** (with confirmation)

**Acceptance Criteria**:
- AC-S16.1: Consultant can create new template from scratch
- AC-S16.2: Consultant can edit existing template (own or global if admin)
- AC-S16.3: Consultant can add/remove/reorder questions (drag-and-drop)
- AC-S16.4: Weight slider updates question weight (0.5 - 5.0)
- AC-S16.5: Scoring config updates dimension weights and thresholds
- AC-S16.6: Preview calculates scores with sample responses
- AC-S16.7: Clone creates exact copy with "-Copy" suffix
- AC-S16.8: Activate makes template available to businesses
- AC-S16.9: Delete removes template (with confirmation dialog)
- AC-S16.10: Changes auto-save every 30 seconds (draft mode)

---

#### **S17: Consultant Assessment Comparison** ⭐ **CRITICAL FOR CONSULTANTS**
- **Company Comparison Table**:
  - Columns: Company Name, Overall Score, Speed, Strength, Intelligence, Status
  - Rows: All companies consultant has access to (5-10 companies)
  - Sortable: Click column header to sort (ascending/descending)
  - Color-coded:
    - Green (>70): Strong
    - Yellow (50-70): Needs Attention
    - Red (<50): Critical
  - Status badge: Healthy / At-Risk / Weak / Critical
  - Last assessed date
  - Click row → Navigate to detailed assessment results (S3)
- **Radar Chart Overlay**:
  - Shows all companies on same radar chart
  - Each company different color
  - Legend shows company names + colors
  - Hover over line → Show company name + exact scores
- **Summary Statistics**:
  - Average scores across all clients (Overall, Speed, Strength, Intelligence)
  - Count of companies by status (Healthy, At-Risk, Weak, Critical)
- **Insights Panel** ⭐ **NEW**:
  - "X companies with critical Speed scores (<50)"
  - "Y companies need urgent intervention (overall <50)"
  - "Top performer: [Company Name] (Overall: XX)"
  - "Needs most help: [Company Name] (Overall: XX)"
- **Filters**:
  - Filter by archetype (dropdown: All / Explorer / Consolidator / etc.)
  - Filter by status (dropdown: All / Healthy / At-Risk / Weak / Critical)
  - Filter by dimension weakness (dropdown: All / Speed <70 / Strength <70 / Intelligence <70)
- **Actions**:
  - **Export to CSV** (download comparison data)
  - **Generate Report** (PDF with charts for all companies)

**Acceptance Criteria**:
- AC-S17.1: Shows all companies consultant has access to (multi-company view)
- AC-S17.2: Table sortable by any column (Overall, Speed, Strength, Intelligence)
- AC-S17.3: Color-coded scores (Green >70, Yellow 50-70, Red <50)
- AC-S17.4: Status badge accurate (based on thresholds)
- AC-S17.5: Radar chart overlays all companies (different colors)
- AC-S17.6: Summary stats calculated correctly
- AC-S17.7: Insights panel shows actionable recommendations
- AC-S17.8: Filters work (archetype, status, dimension weakness)
- AC-S17.9: Click company row → Navigate to detailed results
- AC-S17.10: Export to CSV downloads all data
- AC-S17.11: Dashboard loads in <2 seconds (even with 10 companies)

---

#### **S18: Assessment Invitations** ⭐ **NEW - CRITICAL FOR MULTI-LEVEL ASSESSMENT**

**Purpose**: Consultant/Admin sends assessment invitations to individuals, teams, or roles and tracks completion.

**UI Components**:

1. **Create Assessment Invitation Panel**:
   - **Select Template** (dropdown):
     - Shows assessment templates with type badges (Individual, Team, Role-Specific, Manager, Organizational)
     - Template preview on hover
   - **Target Audience** (multi-step selection):
     - **Option 1**: Select by Role (checkboxes: Employee, Manager, Executive)
     - **Option 2**: Select by Team (dropdown multi-select: Engineering, Sales, Marketing, Operations)
     - **Option 3**: Select by Job Function (dropdown multi-select: Software Engineer, Sales Rep, Product Manager)
     - **Option 4**: Select Specific Users (searchable multi-select)
   - **Preview Invitees** (shows list of users who will be invited):
     - Name, Email, Role, Team
     - Total count: "45 people will receive this assessment"
   - **Set Deadline** (date picker):
     - Default: 2 weeks from today
     - Warning if deadline < 1 week
   - **Message** (optional, textarea):
     - Custom message to include in invitation email
   - **Send Invitations** button (primary CTA)

2. **Active Assessments List**:
   - Table with columns:
     - Assessment Name
     - Type (Individual/Team/Role/Manager/Organizational)
     - Status (Active/Completed/Expired)
     - Completion Rate (progress bar + percentage, e.g., "32/45 completed (71%)")
     - Deadline
     - Actions (View Details, Send Reminder, Close Assessment)
   - Filter by:
     - Status (All, Active, Completed, Expired)
     - Assessment Type
     - Completion Rate (<50%, 50-80%, >80%)

3. **Assessment Detail View** (click row to expand):
   - **Completion Breakdown**:
     - **Completed** (green section):
       - List of users who completed (Name, Role, Completed Date, View Results link)
     - **In Progress** (yellow section):
       - List of users who started but not finished (Name, Role, % Complete, Last Activity)
     - **Not Started** (red section):
       - List of users who haven't started (Name, Role, Email, Send Reminder button)
   - **SSI Score Summary** (if ≥80% completion for team assessments):
     - Team SSI Score (Speed, Strength, Intelligence)
     - Individual member scores table
     - Weakest areas highlighted
   - **Actions**:
     - Send Reminder to All Pending
     - Send Reminder to Specific Users
     - Extend Deadline
     - Close Assessment (prevents new submissions)
     - View Aggregated Results

4. **SSI Aggregation Dashboard** ⭐ **NEW**:
   - **Organizational SSI Card**:
     - Overall SSI Score (Speed, Strength, Intelligence, Overall)
     - Breakdown: Individual (40%), Team (30%), Role (20%), Org (10%)
     - Completion status: "67/100 employees assessed (67%)"
   - **Team SSI Breakdown Table**:
     - Columns: Team Name, Members Assessed, Speed, Strength, Intelligence, Overall
     - Click team → Drill down to individual member scores
   - **Role SSI Breakdown Table**:
     - Columns: Role, Members Assessed, Speed, Strength, Intelligence, Overall
     - Click role → Drill down to individual scores
   - **Individual SSI Leaderboard** (optional toggle):
     - Top performers (green, scores >80)
     - Needs support (red, scores <60)
     - Average performers (yellow, scores 60-80)

**Workflows**:

**Workflow 1: Consultant Sends Individual Assessment to Sales Team**
1. Click "Create Assessment Invitation"
2. Select template: "Individual Assessment - Sales Focus"
3. Target audience: Team = "Sales"
4. Preview shows: 12 sales team members
5. Set deadline: 2 weeks
6. Click "Send Invitations"
7. System sends 12 emails with assessment link
8. Dashboard shows: "Sales Team Individual Assessment: 0/12 completed (0%)"

**Workflow 2: Manager Tracks Team Assessment Completion**
1. Views Active Assessments list
2. Sees: "Engineering Team Assessment: 8/10 completed (80%)"
3. Clicks row to expand details
4. Sees:
   - Completed: Alice, Bob, Carol, ... (8 people)
   - Not Started: Mike, Sarah (2 people)
5. Clicks "Send Reminder" for Mike and Sarah
6. Once 9/10 complete (90%), Team SSI auto-calculates
7. Views Team SSI: Speed 72, Strength 68, Intelligence 74

**Workflow 3: Executive Views Organizational SSI Breakdown**
1. Navigates to SSI Aggregation Dashboard
2. Sees Organizational SSI:
   - Speed: 67 (⚠️ Needs Attention)
   - Strength: 75 (✅ Good)
   - Intelligence: 71 (✅ Good)
   - Overall: 71
3. Clicks "View Breakdown"
4. Sees:
   - Individual Avg: Speed 65, Strength 73, Intelligence 70
   - Team Avg: Speed 68, Strength 76, Intelligence 72
   - Role Avg: Speed 69, Strength 77, Intelligence 73
5. Drills down to Team Breakdown
6. Sees Sales Team: Speed 58 (🔴 Critical) ← Weakest team
7. Generates OKRs focused on improving Sales Team speed

**Acceptance Criteria**:
- AC-S18.1: Consultant can create assessment invitation with target audience (roles, teams, job functions, or specific users)
- AC-S18.2: Preview shows correct list of invitees before sending
- AC-S18.3: System sends email notifications to all invitees
- AC-S18.4: Active Assessments list shows completion rate in real-time
- AC-S18.5: Completion breakdown shows who completed/in-progress/not-started
- AC-S18.6: Manager can send reminder to specific users or all pending
- AC-S18.7: Team SSI auto-calculates when ≥80% of team completes
- AC-S18.8: Organizational SSI auto-calculates when ≥70% of employees complete
- AC-S18.9: SSI Aggregation Dashboard shows breakdown (individual, team, role, org)
- AC-S18.10: Executive can drill down: Org → Team → Individual
- AC-S18.11: Weakest teams/roles highlighted for OKR focus

---

## 🔌 API REQUIREMENTS

### **Authentication APIs**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register via invitation token | No |
| `/api/auth/login` | POST | Login with email + password | No |
| `/api/auth/refresh` | POST | Refresh JWT token | No |
| `/api/auth/logout` | POST | Logout (invalidate token) | Yes |
| `/api/auth/me` | GET | Get current user profile | Yes |

---

### **Assessment APIs** ⭐ **UPDATED v2.1**

**Template Management**:

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/assessment-templates` | GET | List assessment templates | Yes |
| `/api/assessment-templates` | POST | Create assessment template | Yes (Consultant, Admin) |
| `/api/assessment-templates/:id` | GET | Get template details | Yes |
| `/api/assessment-templates/:id` | PUT | Update assessment template | Yes (Consultant, Admin) |
| `/api/assessment-templates/:id` | DELETE | Delete assessment template | Yes (Consultant, Admin) |
| `/api/assessment-templates/:id/clone` | POST | Clone template | Yes (Consultant, Admin) |
| `/api/assessment-templates/:id/preview` | POST | Preview score calculation | Yes (Consultant, Admin) |

**Assessment Taking & Results**:

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/assessments` | POST | Submit assessment | Yes (All roles) |
| `/api/assessments/:id` | GET | Get assessment results | Yes |
| `/api/assessments/:id/weak-areas` | GET | Get question-level weak areas | Yes |
| `/api/assessments/:id/generate-okrs` | POST | Generate OKRs from assessment | Yes (Company Admin, Consultant) |
| `/api/assessments/my-assessments` | GET | Get my pending/completed assessments ⭐ **NEW** | Yes (All roles) |

**Invitations** ⭐ **NEW**:

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/assessment-invitations` | POST | Create assessment invitation | Yes (Consultant, Admin, Manager) |
| `/api/assessment-invitations` | GET | List active invitations | Yes |
| `/api/assessment-invitations/:id` | GET | Get invitation details + completion status | Yes |
| `/api/assessment-invitations/:id/send-reminder` | POST | Send reminder to pending invitees | Yes |
| `/api/assessment-invitations/:id/extend-deadline` | PUT | Extend assessment deadline | Yes |
| `/api/assessment-invitations/:id/close` | PUT | Close assessment (no new submissions) | Yes |

**Multi-Level SSI** ⭐ **NEW**:

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/assessments/ssi/individual/:userId` | GET | Get individual SSI score | Yes (Self, Manager, Admin, Consultant) |
| `/api/assessments/ssi/team/:teamId` | GET | Get team SSI score + member breakdown | Yes (Manager, Admin, Consultant) |
| `/api/assessments/ssi/role/:role` | GET | Get role-specific SSI score | Yes (Admin, Consultant) |
| `/api/assessments/ssi/organization/:businessId` | GET | Get organizational SSI + full breakdown | Yes (Admin, Consultant) |
| `/api/assessments/ssi/comparison` | GET | Compare SSI across companies (individual, team, org) | Yes (Consultant) |

---

### **OKR APIs**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/objectives` | GET | List objectives | Yes |
| `/api/objectives` | POST | Create objective | Yes (Company Admin) |
| `/api/objectives/:id` | PUT | Update objective | Yes (Company Admin) |
| `/api/objectives/:id` | DELETE | Delete objective | Yes (Company Admin) |
| `/api/goals` | GET | List goals | Yes |
| `/api/goals` | POST | Create goal | Yes (Manager) |
| `/api/goals/:id` | PUT | Update goal | Yes (Manager) |
| `/api/goals/:id/progress` | PUT | Update progress | Yes |
| `/api/tasks` | GET | List tasks | Yes |
| `/api/tasks` | POST | Create task | Yes (Manager, Employee) |
| `/api/tasks/:id` | PUT | Update task | Yes |
| `/api/tasks/:id/complete` | PUT | Mark task complete | Yes (Assigned user) |

---

### **AI APIs**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/ai/generate-okrs` | POST | Generate OKRs via OpenAI | Yes (Company Admin) |
| `/api/ai/suggest-tasks` | POST | Suggest tasks for goal | Yes (Manager) |

---

### **Team APIs**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/invitations` | POST | Create invitation | Yes (Company Admin, Manager) |
| `/api/invitations` | GET | List invitations | Yes (Company Admin) |
| `/api/invitations/:token` | GET | Validate invitation token | No |
| `/api/invitations/:id/resend` | POST | Resend invitation | Yes (Company Admin) |
| `/api/invitations/:id/cancel` | PUT | Cancel invitation | Yes (Company Admin) |
| `/api/users` | GET | List users in business | Yes |
| `/api/users/:id` | PUT | Update user profile | Yes (Self or Admin) |

---

### **Dashboard APIs**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/dashboard/owner` | GET | Owner dashboard data | Yes (Company Admin) |
| `/api/dashboard/manager` | GET | Manager dashboard data | Yes (Manager) |
| `/api/dashboard/employee` | GET | Employee dashboard data | Yes (Employee) |
| `/api/dashboard/consultant` | GET | Consultant dashboard data | Yes (Consultant) |

---

### **iBrain APIs**

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/ibrain-settings/config` | GET | Get iBrain config | Yes (Company Admin) |
| `/api/ibrain-settings/toggle-feature` | PUT | Toggle feature | Yes (Company Admin) |
| `/api/ibrain-settings/update-config` | PUT | Update config | Yes (Super Admin) |

---

## ⚡ NON-FUNCTIONAL REQUIREMENTS

### **Performance**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard load time | <2s | p90 |
| API response time | <200ms | p90 |
| OKR generation (OpenAI) | <5s | p95 |
| Task suggestion (OpenAI) | <3s | p95 |
| Template fallback | <2s | p95 |
| Database query time | <50ms | p90 |
| Frontend asset load | <1s | p90 |

---

### **Scalability**

| Dimension | Target | Notes |
|-----------|--------|-------|
| Concurrent users | 100 | MVP target |
| Businesses | 50 | Beta target |
| Objectives per business | 100 | Reasonable limit |
| Goals per objective | 50 | Reasonable limit |
| Tasks per goal | 20 | Reasonable limit |
| Team members per business | 100 | MVP limit |

---

### **Reliability**

| Metric | Target | Notes |
|--------|--------|-------|
| Uptime | 99% | MVP target |
| Data loss | 0% | Critical |
| Backup frequency | Daily | Automated |
| Recovery time | <1 hour | From backup |
| Error rate | <5% | User-facing errors |

---

### **Security**

| Requirement | Implementation |
|-------------|----------------|
| Passwords hashed | Bcrypt (salt rounds: 10) |
| JWT secrets | Environment variables (not hard-coded) |
| Token expiration | 1 hour (access), 7 days (refresh) |
| HTTPS only | Production enforced |
| Input validation | All API endpoints |
| SQL injection prevention | Mongoose (parameterized queries) |
| XSS prevention | Content Security Policy headers |
| CSRF protection | SameSite cookies |
| Rate limiting | 100 requests/minute per IP |

---

### **Compatibility**

| Category | Support |
|----------|---------|
| **Browsers** | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| **Mobile** | Responsive web (no native apps for MVP) |
| **Screen sizes** | 1024×768 min (desktop), 375×667 min (mobile) |
| **Node.js** | 18+ |
| **MongoDB** | 4.4+ |
| **Redis** | 6+ (optional) |
| **Docker** | 20+ |

---

## ✅ ACCEPTANCE CRITERIA

### **Week 0 Complete When**:
- ✅ `@karvia/shared-models` package created
- ✅ All engines use shared models (no `../../server/models`)
- ✅ Feature flags implemented (OpenAI, Redis, iBrain)
- ✅ `docker-compose up` works (all services start)
- ✅ No hard-coded secrets in codebase

### **Sprint 1 Complete When (Week 1-2)**:
- ✅ Goal & Task models in shared-models
- ✅ Goals & Tasks APIs functional (all CRUD)
- ✅ OpenAI OKR generation works (<5s)
- ✅ AI task suggestions work (<3s)
- ✅ Template fallback works when OpenAI fails
- ✅ Redis caching reduces API calls

### **Sprint 2 Complete When (Week 3-4)**:
- ✅ Business archetype (16 options) selector works
- ✅ Strategic preferences (24 options) selector works
- ✅ Invitation system functional (email sent, token works)
- ✅ Token-based registration creates account
- ✅ OKRs generated use archetype + preferences

### **Sprint 3 Complete When (Week 5-6)**:
- ✅ All 15 core screens functional
- ✅ Role-based navigation works
- ✅ Manager can assign goals and tasks
- ✅ Employee sees personalized dashboard
- ✅ Consultant can switch companies

### **Sprint 4 Complete When (Week 7-8)**:
- ✅ All user flows work end-to-end
- ✅ Performance targets met (<2s dashboard, <200ms API)
- ✅ Security audit passes
- ✅ 5 beta companies onboarded
- ✅ 50+ users registered
- ✅ 100+ OKRs generated

### **iBrain Admin Toggle System Complete When**:
- ✅ iBrain settings page functional
- ✅ 6 feature toggles work
- ✅ Business model stores feature config
- ✅ UI hides disabled features
- ✅ API returns 403 for disabled features
- ✅ Platform works with ALL features disabled

---

## 📝 NOTES

### **OpenAI API Key**

Customer provides their own OpenAI API key. Karvia does not provide API keys for MVP.

**Configuration**:
- Owner enters OpenAI API key in business settings
- Stored in Business model: `openai_api_key` (encrypted)
- Planner Engine uses customer's key for generation
- If key invalid or quota exceeded → Fallback to templates

---

### **Email Service**

For MVP, we need email delivery for invitations.

**Options**:
1. SendGrid (recommended - free tier: 100 emails/day)
2. AWS SES (requires AWS account)
3. Mailgun (free tier: 5000 emails/month)

**Decision needed by Week 0.**

---

### **iBrain Subscription Plans (Future)**

For MVP, we implement the toggle system but don't enforce subscription plans. All features can be toggled on/off regardless of plan.

For Beta (Q1 2026), we'll add subscription enforcement:
- Free: Karvia Core only (all iBrain features OFF)
- Starter: Karvia Core + Hosted
- Professional: + Predictive Analytics + Sentiment Analysis
- Enterprise: + All 6 iBrain features

---

## 📊 VERSION 2.1 UPDATES SUMMARY

### **What Changed in v2.1** ⭐ **CRITICAL ARCHITECTURE UPDATE**

This version adds **multi-level assessment architecture** - enabling Individual → Team → Organizational SSI aggregation.

**Major Additions**:

1. **F1.3.11: Multi-Level SSI Aggregation** (GAME CHANGER)
   - ⭐ **Individual Assessments**: Every employee, manager, executive takes assessments
   - ⭐ **Team SSI Scores**: Auto-calculate when ≥80% of team completes assessments
   - ⭐ **Organizational SSI**: Weighted aggregation (40% Individual + 30% Team + 20% Role + 10% Org)
   - ⭐ **Assessment Types**: individual, team, role_specific, manager, organizational
   - ⭐ **Target Audience Selection**: Invite by role, team, job function, or specific users
   - ⭐ **SSI Drill-Down**: Org SSI → Team SSI → Individual SSI with full breakdown
   - ⭐ **Dynamic OKR Generation**: Org OKRs target org weaknesses, Team OKRs target team weaknesses, Individual OKRs target personal weaknesses

2. **New Data Models**:
   - **AssessmentInvitation**: Track invitations, completion status, due dates, reminders
   - **IndividualSSI**: Cached individual speed/strength/intelligence scores
   - **TeamSSI**: Cached team scores with member breakdown
   - **OrganizationalSSI**: Cached org scores with full hierarchical breakdown

3. **Enhanced AssessmentTemplate Schema**:
   - **assessment_type**: individual, team, role_specific, manager, organizational
   - **target_audience**: Flexible targeting by roles, teams, job functions, specific users
   - **completion_threshold**: Auto-calculate team/org scores when threshold met

4. **New Screens**:
   - **S18: Assessment Invitations**: Create invitations, track completion, send reminders
   - **S16: Assessment Template Editor**: Consultants create/edit templates with custom weights (v2.0)
   - **S17: Consultant Assessment Comparison**: Multi-company dashboard with radar chart overlay (v2.0)
   - **S3 Enhanced**: Assessment results now show individual/team/org SSI drill-down

5. **New Permissions**:
   - **All Employees**: Can take assessments, view own SSI scores
   - **Managers**: Can invite own team to assessments, view own team SSI scores
   - **Consultants/Admins**: Can invite all users, view all SSI scores, create assessment templates

6. **New APIs**:
   - `/api/assessment-invitations` (POST, GET) - Create and track invitations
   - `/api/assessment-invitations/:id/send-reminder` (POST) - Send reminder to pending invitees
   - `/api/assessments/ssi/individual/:userId` (GET) - Get individual SSI score
   - `/api/assessments/ssi/team/:teamId` (GET) - Get team SSI score + member breakdown
   - `/api/assessments/ssi/role/:role` (GET) - Get role-specific SSI score
   - `/api/assessments/ssi/organization/:businessId` (GET) - Get organizational SSI + full breakdown
   - `/api/assessments/ssi/comparison` (GET) - Compare SSI across companies
   - `/api/assessment-templates` (CRUD) - Template management (v2.0)
   - `/api/assessments/:id/weak-areas` (GET) - Question-level breakdown (v2.0)

**Why This Matters**:
- **For Employees**: Understand personal strengths/weaknesses, see how they contribute to team success
- **For Managers**: Assess team capabilities, identify team-level improvement areas
- **For Executives**: Understand organizational capabilities, data-driven strategic planning
- **For Consultants**: Multi-level assessment framework, compare companies at individual/team/org levels
- **For External Party**: Sophisticated multi-level assessment system (major competitive differentiator)

**Total Screens**: Updated from 15 to **18 core screens**

---

### **Version History**

**v2.1** (October 1, 2025): Multi-level assessment architecture (Individual → Team → Org SSI)
**v2.0** (October 1, 2025): Dynamic assessment system with weighted scoring and templates
**v1.0** (September 25, 2025): Initial MVP PRD

---

**Document Owner**: Product & Engineering Team
**Last Updated**: October 1, 2025 (v2.1)
**Status**: ✅ Implementation Ready
**Launch Target**: 🚀 November 30, 2025

---

[◀ Back to MVP Documentation](./README.md) | [Strategy](./MVP_STRATEGY.md) | [User Stories ▶](./MVP_USER_STORIES.md)
