# Epic K: Company Profile Redesign - AI-Ready Context for Personalized OKR Generation

**Epic**: K
**Sprint**: 10
**Story Points**: 33 pts (+7 from Audit Enhancements)
**Priority**: P0
**Status**: PLANNING
**Renamed From**: Epic K: Business Metrics Profile (January 10, 2026)
**Last Updated**: January 10, 2026 - Added Decision 6: Architecture Alignment

---

## Critical Design Decisions (Audit Resolution)

Following the codebase audit, these architectural decisions were locked:

### Decision 1: Historical Trajectory - Curated Subset (8 Metrics)

**Decision**: Track "Previous Year" for 8 key metrics only, not all metrics.

**Rationale**: Universal tracking creates data entry burden and accuracy risk without proportional value.

**Curated Metrics for Financial Services:**
| # | Metric | Why Track |
|---|--------|-----------|
| 1 | Annual Revenue | Core financial trajectory |
| 2 | Total AUM | Practice scale indicator |
| 3 | Client Families | Base growth/shrinkage |
| 4 | Client Retention Rate | Relationship quality trend |
| 5 | Next-Gen Engagement % | Critical for succession |
| 6 | Succession Plans Active % | Service penetration |
| 7 | Advisor Count | Capacity trajectory |
| 8 | Clients per Advisor | Utilization trend |

**Implementation**: `trajectory_metrics` array in industry config marks which metrics need YoY tracking.

---

### Decision 2: Concentration Risk - Soft Prioritization with Override

**Decision**: When `top_5_clients_revenue_pct > 50%`, system suggests retention-first objective ordering but user can override.

**Behavior**:
```javascript
// In AIContextService
if (metrics.top_5_clients_revenue_pct > 50) {
  context.priority_override = {
    type: 'retention_first',
    reason: 'HIGH concentration risk (>50% from top 5 clients)',
    suggested_objective_order: ['retention', 'deepening', 'growth'],
    user_can_override: true,
    warning_message: 'Your client base is highly concentrated. Consider retention objectives before growth.'
  };
}
```

**UI Behavior**: Yellow banner on OKR generation showing the suggestion with "I understand the risk, proceed with growth-first" option.

---

### Decision 3: OKR Feasibility - Tiered Validation

**Decision**: Use soft warnings for most issues, prompt retry only for clearly vague outputs.

| Scenario | Response | Blocking? |
|----------|----------|-----------|
| KR lacks any number | Soft warning: "Consider adding specific targets" | No |
| Target exceeds 3x historical growth | Soft warning: "This is 3x your historical rate" | No |
| Contradicts risk indicators | Soft warning: "Growth target conflicts with concentration risk" | No |
| Contains vague phrases without numbers | **Prompt retry** with stricter instructions | Yes (auto-retry) |

**Vague phrase detection**:
```javascript
const VAGUE_PATTERNS = [
  /improve\s+(customer|client|employee|team)/i,
  /better\s+(service|quality|performance)/i,
  /increase\s+(satisfaction|engagement)/i,  // Only if no number follows
  /more\s+(efficient|effective)/i
];

function requiresRetry(krText) {
  const hasNumber = /\d+%?|\$[\d,]+|from\s+\d+\s+to\s+\d+/i.test(krText);
  const hasVaguePhraseOnly = VAGUE_PATTERNS.some(p => p.test(krText)) && !hasNumber;
  return hasVaguePhraseOnly;
}
```

---

### Decision 4: Data Provenance for Metrics

**Decision**: Track timestamp, source, and owner for each metric value.

**Schema Enhancement**:
```javascript
business_metrics: {
  type: Map,
  of: {
    value: mongoose.Schema.Types.Mixed,
    updated_at: { type: Date, default: Date.now },
    source: { type: String, enum: ['manual', 'import', 'api', 'calculated'], default: 'manual' },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
}
```

**UI Display**: Show "Last updated: 3 days ago by John" on hover, flag stale data (>90 days).

---

### Decision 5: Industry Validation Middleware

**Decision**: Enforce industry/subtype alignment at save time.

**Implementation**:
```javascript
// Pre-save hook on Company model
companySchema.pre('save', async function(next) {
  if (this.industry && this.industry_subtype) {
    const config = require('../config/industries');
    const validSubtypes = Object.keys(config[this.industry]?.subtypes || {});
    if (!validSubtypes.includes(this.industry_subtype)) {
      throw new Error(`Invalid industry_subtype '${this.industry_subtype}' for industry '${this.industry}'`);
    }
  }
  next();
});
```

---

### Decision 6: Architecture Alignment (Codebase Audit Resolution)

**Decision**: Resolve the 4 HIGH-priority architectural issues identified in the codebase audit.

#### 6A: Industry Source of Truth - `industries.js` is Authoritative

**Problem**: Industry data exists in 4 places that can diverge (Company.js enum, industries.js, IndustryConfig.js, frontend hardcoded).

**Solution**:
```
industries.js (SINGLE SOURCE OF TRUTH)
    ↓
Company.js (validates against industries.js, NO enum)
    ↓
IndustryConfig.js (imports dimension weights from industries.js)
    ↓
Frontend (fetches via GET /api/config/industries)
```

**Implementation**:
```javascript
// Company.js - Remove enum, use string with validation
industry: {
  type: String,  // NOT an enum
  required: true,
  validate: {
    validator: function(v) {
      const industries = require('../config/industries');
      return Object.keys(industries).includes(v);
    },
    message: props => `${props.value} is not a valid industry`
  }
}

// New API endpoint
// GET /api/config/industries - Returns industry options for frontend
router.get('/config/industries', (req, res) => {
  const industries = require('../config/industries');
  res.json(Object.entries(industries).map(([key, val]) => ({
    value: key,
    label: val.label,
    subtypes: Object.entries(val.subtypes || {}).map(([k, v]) => ({
      value: k,
      label: v.label
    }))
  })));
});
```

---

#### 6B: Data Location - Extend `business_context` (No Migration)

**Problem**: Epic K spec shows new top-level fields (`founding_year`, etc.) but existing UI writes to `business_context`, creating dual sources.

**Solution**: Store ALL profile data in `business_context` with nested schema structure.

**Schema Structure**:
```javascript
business_context: {
  // NESTED structure - backwards compatible
  profile: {
    founding_year: Number,
    business_model: String,
    value_proposition: String,
    primary_revenue_driver: String,
    client_profile: String
  },
  industry_context: Map,  // Industry-specific fields
  metrics: {
    current: Map,         // With provenance
    previous: Map         // For trajectory (8 curated)
  },
  targets: Map,           // 12-month targets
  strategic_vision: {
    priority_1: String,
    blocker: String,
    one_thing: String
  }
}
```

**Why This Approach**:
- No data migration needed (existing business_context data preserved)
- Single API handler already merges business_context
- Frontend already writes to business_context
- Cleaner than adding 10+ top-level fields

---

#### 6C: API Field Allowlist - Explicit Handling

**Problem**: PUT `/api/companies/:id` only merges specific fields; new fields will be silently dropped.

**Solution**: Add explicit allowlist in companies.js route.

**Implementation**:
```javascript
// server/routes/companies.js - PUT handler
const ALLOWED_UPDATE_FIELDS = [
  'name',
  'business_context',    // Contains all profile data (6B)
  'industry_subtype',    // Still top-level for index
  'settings',
  'branding',
  // Epic S additions
  'access_controls',
  'ssi_weight_preset_id'
];

router.put('/:id', authenticateToken, async (req, res) => {
  const updateData = {};
  ALLOWED_UPDATE_FIELDS.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Deep merge for business_context
  if (updateData.business_context) {
    const existing = company.business_context?.toObject() || {};
    updateData.business_context = deepMerge(existing, updateData.business_context);
  }

  await Company.findByIdAndUpdate(id, updateData, { new: true });
});
```

---

#### 6D: AI Context Centralization - Single Builder

**Problem**: AI context built in 3 places (AIContextService, ai-okr.js inline, Epic K adds third). Will drift.

**Solution**: ALL context assembly happens in AIContextService. ai-okr.js consumes, doesn't build.

**Implementation**:
```javascript
// AIContextService.js - SINGLE SOURCE OF TRUTH
class AIContextService {
  /**
   * Base context used by ALL AI features
   */
  async getBaseContext(companyId) {
    const company = await Company.findById(companyId);
    const ssi = await this.getLatestSSI(companyId);
    return { company: this.formatCompany(company), ssi };
  }

  /**
   * Epic K: OKR generation context (extends base)
   */
  async getOKRGenerationContext(companyId) {
    const base = await this.getBaseContext(companyId);
    const config = this.getIndustryConfig(base.company.industry);

    return {
      ...base,
      profile: this.formatProfileContext(base.company, config),
      metrics: this.formatMetricsWithBenchmarks(base.company, config),
      trajectory: this.calculateTrajectory(base.company, config),
      risk_indicators: this.extractRiskIndicators(base.company, config),
      targets: this.formatTargetsWithGaps(base.company),
      prompt: this.buildMcKinseyPrompt(base, config)  // Final prompt here
    };
  }

  /**
   * Epic L: Weekly goal context (extends base)
   */
  async getWeeklyGoalContext(companyId, krId, weekNumber) {
    const base = await this.getBaseContext(companyId);
    // ... weekly-specific context
  }
}

// ai-okr.js - CONSUMER ONLY (no inline prompt building)
router.post('/generate', async (req, res) => {
  const context = await AIContextService.getOKRGenerationContext(companyId);
  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: context.prompt }]
  });
  // ... rest of handler
});
```

---

**Impact of Decision 6**:
- +2 story points to K1 (nested schema + API allowlist)
- Prevents 4 HIGH-severity bugs at implementation time
- Ensures Epic K, L, M, and S don't conflict architecturally

---

## Executive Summary

**Objective**: Redesign the Company Profile page to capture comprehensive organizational context that, when combined with SSI diagnostic results, enables the LLM to generate OKRs that feel personally crafted by a management consultant who deeply understands this specific organization.

**The Formula**:
```
COMPANY PROFILE (Quantitative)  +  SSI ASSESSMENT (Qualitative)  =  CREDIBLE OKRs
     "The Numbers"                    "The Capabilities"              "Specific Targets"
```

**Initial Focus**: Financial Services → Legacy & Succession Planning

**Design Principles**:
1. **McKinsey-Level Context** - Capture what a senior consultant would need to know
2. **Quantitative Focus** - Numbers, not opinions (SSI provides qualitative)
3. **Scalable Architecture** - Configuration-driven for future industries
4. **AI-Ready Structure** - Data flows directly into rich LLM prompts

---

## The Consultant's Framework

When a senior McKinsey partner walks into an engagement, they need to understand:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE CONSULTANT'S DISCOVERY FRAMEWORK                      │
└─────────────────────────────────────────────────────────────────────────────┘

1. THE BUSINESS (How does this company actually work?)
   └── Business model, value proposition, revenue drivers
   └── Tab 1: "The Business"

2. THE NUMBERS (What's the current state?)
   └── Key metrics, benchmarks, risk indicators
   └── Tab 2: "The Numbers"

3. THE VISION (Where do they want to go?)
   └── Targets, priorities, constraints
   └── Tab 3: "The Vision"

4. THE CAPABILITIES (What can they execute?)
   └── Organizational strengths and gaps
   └── FROM SSI DIAGNOSTIC (not this epic)
```

---

## Problem Statement

### Current State
- Company Profile captures basic info (name, industry, size)
- OKR generation uses generic company context
- No industry-specific metrics to inform AI recommendations
- Generated OKRs lack specific numbers ("improve by 20%" vs "from 32% to 45%")

### Business Value
- **10x Better OKRs**: AI can generate objectives like "Increase next-gen engagement from 32% to 45%" instead of "Improve client relationships"
- **Consultant-Level Quality**: OKRs feel personalized, not templated
- **Faster Time-to-Value**: Rich context = fewer OKR revisions needed

---

## Three-Tab Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Company Profile                                           [Save] [? Help]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────┬───────────────────────┬───────────────────────┐      │
│  │  1. THE BUSINESS  │   2. THE NUMBERS      │   3. THE VISION       │      │
│  │   (How You Work)  │   (Current State)     │   (Where You're Going)│      │
│  └───────────────────┴───────────────────────┴───────────────────────┘      │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │   [Active tab content displays here]                                    ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Profile Completion: ████████░░ 80%          ✓ Auto-saved                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tab 1: THE BUSINESS (How You Work)

**Purpose**: Help LLM understand how this company creates value

### Universal Fields (All Industries)

| Field | Type | Example | AI Context |
|-------|------|---------|------------|
| **Founding Year** | Number | 2008 | Maturity affects strategy aggressiveness |
| **Business Model** | Dropdown | Fee-based advisory | Determines growth levers |
| **Value Proposition** | Text (1 sentence) | "Multi-generational wealth preservation" | The "why us" that OKRs reinforce |
| **Primary Revenue Driver** | Dropdown | AUM-based fees | Focus for growth KRs |
| **Client Profile** | Text (1 sentence) | "Business owners 55-75 with $5M+ assets" | Target audience for KRs |

### Industry-Specific Fields (Financial Services → Legacy/Succession)

| Field | Type | Options | AI Context |
|-------|------|---------|------------|
| **Service Focus** | Multi-select | Succession Planning, Estate Planning, Investment Mgmt, Insurance | Defines service scope |
| **Fee Structure** | Dropdown | AUM only, AUM + Flat fee, Fee-only, Commission | Affects pricing KRs |
| **Typical Client Tenure** | Dropdown | <5 years, 5-10 years, 10-20 years, 20+ years | Long = retention focus |
| **Primary Referral Source** | Dropdown | CPA/Attorney, Client referrals, Digital, Seminars | Where growth KRs target |

---

## Tab 2: THE NUMBERS (Current State + Trajectory)

**Purpose**: Establish quantitative baseline with historical context. The "FROM" in "from X to Y" plus trajectory analysis.

> **ENHANCEMENT (McKinsey Analysis)**: Each metric now includes a "Previous Year" column to enable trajectory analysis. This allows the LLM to assess whether current targets are realistic based on historical performance patterns.

### Data Entry Layout (Three-Column Display)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  THE NUMBERS                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Metric             │  Previous Year  │  Current      │  vs Last Year       │
│─────────────────────┼─────────────────┼───────────────┼─────────────────────│
│  Annual Revenue     │  $11,200,000    │  $12,000,000  │  ↑ +7.1%           │
│  AUM                │  $450M          │  $500M        │  ↑ +11.1%          │
│  Client Families    │  238            │  245          │  ↑ +2.9%           │
│  Next-Gen Engaged   │  28%            │  32%          │  ↑ +4pp            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Section A: Financial Performance

| Field | Type | Previous Year | Current | Trend | Notes |
|-------|------|---------------|---------|-------|-------|
| Annual Revenue | Currency | $11,200,000 | $12,000,000 | ↑ +7.1% | Required |
| Revenue Growth YoY | Percentage | 6% | 8% | ↑ +2pp | Auto-calculated |
| Gross Margin | Percentage | 63% | 65% | ↑ +2pp | Optional |
| **Top 5 Clients (% Revenue)** | Percentage | - | 45% | - | **Risk indicator** |

### Section B: Client Portfolio (Industry-Specific)

| Field | Type | Previous | Current | Benchmark | AI Context |
|-------|------|----------|---------|-----------|------------|
| Total Client Families | Number | 238 | 245 | p50: 150 | Growth trajectory |
| Assets Under Management | Currency | $450M | $500M | p50: $500M | Growth vs retention priority |
| Avg Client Tenure (Years) | Number | 11 | 12 | p50: 10 | Retention strength |
| Client Retention Rate | Percentage | 96% | 97% | p50: 95% | Improving vs declining |

### Section C: Risk Indicators (Critical for OKR Focus)

| Field | Type | Previous | Current | Warning | AI Context |
|-------|------|----------|---------|---------|------------|
| Clients Over 65 (%) | Percentage | 58% | 62% | >50% = HIGH | Trajectory toward urgency |
| Next-Gen Engagement (%) | Percentage | 28% | 32% | <40% = RISK | +4pp = positive momentum |
| Succession Plans Active (%) | Percentage | 30% | 35% | <50% = GAP | Service expansion trajectory |
| **Top 5 Clients (% Revenue)** | Percentage | - | 45% | >50% = HIGH | Concentration risk |

### Section D: Operational Capacity

| Field | Type | Previous | Current | Benchmark | AI Context |
|-------|------|----------|---------|-----------|------------|
| Advisors | Number | 7 | 8 | - | Team growth capacity |
| Clients per Advisor | Number | 34 | 31 | p50: 50 | Capacity improving |
| Advisor Average Age | Number | 51 | 52 | - | THEIR succession risk |
| Support Staff | Number | 3 | 4 | - | Operational leverage improving |

### Trajectory Analysis Logic

```javascript
// Auto-calculated trajectory indicators
function calculateTrajectory(previous, current, metricType) {
  if (!previous || !current) return null;

  const change = current - previous;
  const pctChange = previous > 0 ? ((change / previous) * 100).toFixed(1) : null;

  return {
    direction: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable',
    absolute_change: change,
    percentage_change: pctChange,
    indicator: change > 0 ? '↑' : change < 0 ? '↓' : '→',
    ai_context: `${metricType} ${change > 0 ? 'improved' : 'declined'} by ${Math.abs(pctChange)}% year-over-year`
  };
}
```

---

## Tab 3: THE VISION (Where You're Going)

**Purpose**: Define the destination. Capture what success looks like.

### Section A: 12-Month Targets

Display as side-by-side comparison with gap calculation:

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Revenue | $12M | $15M | +25% |
| Client Families | 245 | 280 | +35 |
| AUM | $500M | $600M | +20% |
| Next-Gen Engagement | 32% | 50% | +18pp |
| Succession Plan Coverage | 35% | 60% | +25pp |
| Team Size (Advisors) | 8 | 10 | +2 |

### Section B: Strategic Questions (Free Text)

| Question | Purpose | AI Usage |
|----------|---------|----------|
| **"What's your #1 priority for the next 12 months?"** | Focus area | First objective addresses this |
| **"What's the biggest obstacle to achieving this?"** | Constraints | Temper KR aggressiveness |
| **"If you could only accomplish ONE thing this year, what would it be?"** | True north | The "hero objective" |

---

## Database Schema

### Company Model Additions (`server/models/Company.js`)

> **ARCHITECTURE DECISION (Decision 6B)**: All profile data is stored in `business_context`
> with nested structure. This avoids migration issues and leverages existing API handlers.

```javascript
// ============================================================
// EPIC K: Company Profile Redesign
// Architecture: Nested in business_context (Decision 6B)
// ============================================================

/**
 * Industry Subtype - TOP LEVEL for indexing
 * Still top-level because it's used in queries and validation
 */
industry_subtype: {
  type: String,
  index: true,
  description: 'Subtype within industry (e.g., "legacy_succession" for financial_services)'
},

/**
 * Industry validation - Remove enum, validate against config (Decision 6A)
 * MODIFY existing industry field - change from enum to validated string
 */
// In existing industry field, REMOVE the enum and add:
industry: {
  type: String,  // NOT an enum anymore
  required: true,
  index: true,
  validate: {
    validator: function(v) {
      const industries = require('../config/industries');
      return Object.keys(industries).includes(v);
    },
    message: props => `${props.value} is not a valid industry. Check industries.js config.`
  }
},

/**
 * business_context - NESTED STRUCTURE (Decision 6B)
 * All profile data stored here for backwards compatibility
 * Existing business_context data is preserved
 */
business_context: {
  type: new mongoose.Schema({
    // ============================================
    // Tab 1: THE BUSINESS (Profile Identity)
    // ============================================
    profile: {
      founding_year: {
        type: Number,
        min: 1800,
        max: new Date().getFullYear()
      },
      business_model: {
        type: String,
        enum: ['fee_advisory', 'aum_based', 'commission', 'subscription', 'project_based', 'retainer', 'hybrid']
      },
      value_proposition: {
        type: String,
        maxlength: 200
      },
      primary_revenue_driver: {
        type: String,
        enum: ['aum_fees', 'flat_fees', 'hourly', 'commissions', 'subscriptions', 'project_fees']
      },
      client_profile: {
        type: String,
        maxlength: 200
      }
    },

    // Industry-specific business fields (flexible)
    industry_context: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map()
    },

    // ============================================
    // Tab 2: THE NUMBERS (Metrics + Trajectory)
    // ============================================
    metrics: {
      // Current metrics with provenance (Decision #4)
      current: {
        type: Map,
        of: new mongoose.Schema({
          value: mongoose.Schema.Types.Mixed,
          updated_at: { type: Date, default: Date.now },
          source: {
            type: String,
            enum: ['manual', 'import', 'api', 'calculated'],
            default: 'manual'
          },
          updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        }, { _id: false }),
        default: new Map()
      },

      // Previous year - 8 curated metrics only (Decision #1)
      previous: {
        type: Map,
        of: new mongoose.Schema({
          value: mongoose.Schema.Types.Mixed,
          as_of_date: Date,
          source: {
            type: String,
            enum: ['manual', 'import', 'api'],
            default: 'manual'
          }
        }, { _id: false }),
        default: new Map()
      }
    },

    // ============================================
    // Tab 3: THE VISION (Targets + Strategy)
    // ============================================
    targets: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map()
    },

    strategic_vision: {
      priority_1: { type: String, maxlength: 500 },
      blocker: { type: String, maxlength: 500 },
      one_thing: { type: String, maxlength: 500 }
    },

    // ============================================
    // Metadata
    // ============================================
    profile_updated_at: { type: Date, default: Date.now },
    completion_percentage: { type: Number, default: 0 }

  }, { _id: false }),

  default: {}
},

/**
 * The Vision - Tab 3 fields
 */
targets: {
  type: Map,
  of: mongoose.Schema.Types.Mixed,
  default: new Map(),
  description: '12-month target values for key metrics'
},

strategic_vision: {
  priority_1: {
    type: String,
    maxlength: 500,
    description: '#1 priority for next 12 months'
  },
  blocker: {
    type: String,
    maxlength: 500,
    description: 'Biggest obstacle to achieving priority'
  },
  one_thing: {
    type: String,
    maxlength: 500,
    description: 'The ONE thing to accomplish this year'
  }
}
```

### Virtual Property for Profile Completion

```javascript
companySchema.virtual('profile_completion').get(function() {
  let score = 0;
  const weights = { business: 30, numbers: 40, vision: 30 };

  // Tab 1: The Business (30%)
  const businessFields = ['founding_year', 'business_model', 'value_proposition',
                          'primary_revenue_driver', 'client_profile'];
  const businessFilled = businessFields.filter(f => this[f]).length;
  score += (businessFilled / businessFields.length) * weights.business;

  // Tab 2: The Numbers (40%)
  const metricsSize = this.business_metrics?.size || 0;
  const metricsTarget = 8; // Minimum meaningful metrics
  score += Math.min(metricsSize / metricsTarget, 1) * weights.numbers;

  // Tab 3: The Vision (30%)
  const targetsSize = this.targets?.size || 0;
  const visionFilled = Object.values(this.strategic_vision || {}).filter(v => v).length;
  const visionScore = (Math.min(targetsSize / 4, 1) * 0.5) +
                      (Math.min(visionFilled / 3, 1) * 0.5);
  score += visionScore * weights.vision;

  return {
    percentage: Math.round(score),
    sections: {
      business: Math.round((businessFilled / businessFields.length) * 100),
      numbers: Math.round(Math.min(metricsSize / metricsTarget, 1) * 100),
      vision: Math.round(visionScore * 100)
    }
  };
});
```

---

## Configuration System

### File Structure

```
server/config/
├── industries.js                    # Base industry list (shared)
└── industry-profiles/
    └── financial-services.json      # Financial Services complete config
```

### Financial Services Configuration

```json
{
  "_version": "2.0.0",
  "_description": "Financial Services industry profile configuration",

  "financial_services": {
    "label": "Financial Services",
    "subtypes": {
      "legacy_succession": {
        "label": "Legacy & Succession Planning",
        "description": "Wealth transfer and business succession advisory",

        "trajectory_metrics": [
          "annual_revenue",
          "total_aum",
          "total_client_families",
          "client_retention_rate",
          "next_gen_engagement_pct",
          "succession_plans_active_pct",
          "advisors_count",
          "clients_per_advisor"
        ],

        "business_fields": [
          {
            "key": "service_focus",
            "label": "Service Focus",
            "type": "multiselect",
            "options": [
              {"value": "succession_planning", "label": "Succession Planning"},
              {"value": "estate_planning", "label": "Estate Planning"},
              {"value": "investment_mgmt", "label": "Investment Management"},
              {"value": "tax_planning", "label": "Tax Planning"},
              {"value": "insurance", "label": "Insurance/Risk Management"}
            ],
            "ai_context": "Service scope defines what types of OKRs are relevant"
          },
          {
            "key": "fee_structure",
            "label": "Fee Structure",
            "type": "dropdown",
            "options": [
              {"value": "aum_only", "label": "AUM-based only"},
              {"value": "aum_plus_flat", "label": "AUM + Flat fee retainer"},
              {"value": "fee_only", "label": "Fee-only (no AUM)"},
              {"value": "commission", "label": "Commission-based"}
            ],
            "ai_context": "Fee structure affects growth strategy - AUM firms focus on asset gathering"
          },
          {
            "key": "client_tenure_typical",
            "label": "Typical Client Tenure",
            "type": "dropdown",
            "options": [
              {"value": "under_5", "label": "Under 5 years"},
              {"value": "5_to_10", "label": "5-10 years"},
              {"value": "10_to_20", "label": "10-20 years"},
              {"value": "over_20", "label": "20+ years"}
            ],
            "ai_context": "Long tenure suggests retention focus, short tenure suggests acquisition focus"
          },
          {
            "key": "referral_source",
            "label": "Primary Referral Source",
            "type": "dropdown",
            "options": [
              {"value": "cpa_attorney", "label": "CPA/Attorney network"},
              {"value": "client_referral", "label": "Existing client referrals"},
              {"value": "centers_influence", "label": "Centers of influence"},
              {"value": "digital", "label": "Digital marketing"},
              {"value": "seminars", "label": "Seminars/Events"}
            ],
            "ai_context": "Referral source determines where growth-focused KRs should target"
          }
        ],

        "metrics": {
          "groups": [
            {
              "key": "financial_performance",
              "label": "Financial Performance",
              "display_order": 1,
              "fields": [
                {
                  "key": "annual_revenue",
                  "label": "Annual Revenue",
                  "type": "currency",
                  "required": true,
                  "target_field": true
                },
                {
                  "key": "revenue_growth_yoy",
                  "label": "Revenue Growth YoY (%)",
                  "type": "percentage",
                  "required": false
                },
                {
                  "key": "gross_margin",
                  "label": "Gross Margin (%)",
                  "type": "percentage",
                  "required": false
                }
              ]
            },
            {
              "key": "client_portfolio",
              "label": "Client Portfolio",
              "display_order": 2,
              "fields": [
                {
                  "key": "total_client_families",
                  "label": "Total Client Families",
                  "type": "number",
                  "benchmark": {"p25": 50, "p50": 150, "p75": 300},
                  "target_field": true,
                  "ai_context": "Client base size indicates practice maturity"
                },
                {
                  "key": "total_aum",
                  "label": "Total AUM",
                  "type": "currency",
                  "benchmark": {"p25": 100000000, "p50": 500000000, "p75": 2000000000},
                  "target_field": true,
                  "ai_context": "AUM indicates practice scale and complexity"
                },
                {
                  "key": "avg_client_tenure_years",
                  "label": "Avg Client Tenure (Years)",
                  "type": "number",
                  "benchmark": {"p25": 5, "p50": 10, "p75": 15},
                  "ai_context": "High tenure suggests retention strength but may indicate aging base"
                },
                {
                  "key": "client_retention_rate",
                  "label": "Client Retention Rate (%)",
                  "type": "percentage",
                  "benchmark": {"p25": 90, "p50": 95, "p75": 98},
                  "target_field": true,
                  "ai_context": "Retention quality indicator"
                }
              ]
            },
            {
              "key": "risk_indicators",
              "label": "Risk Indicators",
              "display_order": 3,
              "highlight": true,
              "warning_section": true,
              "fields": [
                {
                  "key": "clients_over_65_pct",
                  "label": "Clients Over 65 (%)",
                  "type": "percentage",
                  "warning_threshold": 50,
                  "warning_direction": "above",
                  "warning_message": "HIGH - Succession planning urgency is critical",
                  "ai_context": "Above 50% indicates critical wealth transfer timeline"
                },
                {
                  "key": "next_gen_engagement_pct",
                  "label": "Next-Gen Engagement (%)",
                  "type": "percentage",
                  "benchmark": {"p25": 20, "p50": 40, "p75": 60},
                  "warning_threshold": 40,
                  "warning_direction": "below",
                  "warning_message": "RISK - May lose families at wealth transfer",
                  "target_field": true,
                  "ai_context": "Below 40% is critical - firm may lose family at transition"
                },
                {
                  "key": "succession_plans_active_pct",
                  "label": "Succession Plans Active (%)",
                  "type": "percentage",
                  "benchmark": {"p25": 20, "p50": 40, "p75": 60},
                  "warning_threshold": 50,
                  "warning_direction": "below",
                  "warning_message": "GAP - Service expansion opportunity",
                  "target_field": true,
                  "ai_context": "Low rate suggests opportunity for service expansion"
                },
                {
                  "key": "top_5_clients_revenue_pct",
                  "label": "Top 5 Clients (% of Revenue)",
                  "type": "percentage",
                  "warning_threshold": 50,
                  "warning_direction": "above",
                  "warning_message": "HIGH CONCENTRATION - Client retention is critical before growth",
                  "ai_context": "Above 50% means retention OKRs should take priority over aggressive growth targets; losing one major client could be catastrophic"
                }
              ]
            },
            {
              "key": "operational_capacity",
              "label": "Operational Capacity",
              "display_order": 4,
              "fields": [
                {
                  "key": "advisors_count",
                  "label": "Number of Advisors",
                  "type": "number",
                  "target_field": true,
                  "ai_context": "Team capacity for client service"
                },
                {
                  "key": "clients_per_advisor",
                  "label": "Clients per Advisor",
                  "type": "number",
                  "benchmark": {"p25": 30, "p50": 50, "p75": 75},
                  "ai_context": "Higher ratio may indicate capacity constraints"
                },
                {
                  "key": "advisor_avg_age",
                  "label": "Advisor Average Age",
                  "type": "number",
                  "warning_threshold": 55,
                  "warning_direction": "above",
                  "warning_message": "Consider your own succession planning",
                  "ai_context": "Older advisor base indicates internal succession risk"
                },
                {
                  "key": "support_staff_count",
                  "label": "Support Staff",
                  "type": "number",
                  "ai_context": "Operational leverage indicator"
                }
              ]
            }
          ]
        },

        "strategic_questions": [
          {
            "key": "priority_1",
            "label": "What's your #1 priority for the next 12 months?",
            "type": "textarea",
            "placeholder": "e.g., Build deeper relationships with next-generation clients before the great wealth transfer...",
            "ai_context": "This should directly inform the first objective generated"
          },
          {
            "key": "blocker",
            "label": "What's the biggest obstacle to achieving this?",
            "type": "textarea",
            "placeholder": "e.g., Advisor capacity, client resistance, technology gaps...",
            "ai_context": "This constraint should temper KR aggressiveness"
          },
          {
            "key": "one_thing",
            "label": "If you could only accomplish ONE thing this year, what would it be?",
            "type": "textarea",
            "placeholder": "e.g., Launch our Family Wealth Review program with 50% participation...",
            "ai_context": "This is the 'hero objective' - must appear in generated OKRs"
          }
        ]
      }
    }
  }
}
```

---

## AI Integration

### AIContextService Enhancement

```javascript
// server/services/AIContextService.js

/**
 * Build comprehensive context for OKR generation
 * Epic K: Company Profile Redesign
 */
async buildOKRGenerationContext(companyId) {
  const company = await this.getCompanyWithProfile(companyId);
  const ssi = await this.getSSIDiagnostic(companyId);
  const config = await this.getIndustryConfig(company.industry, company.industry_subtype);

  return {
    company: this.formatCompanyContext(company, config),
    ssi: this.formatSSIContext(ssi),
    prompt: this.buildMcKinseyPrompt(company, ssi, config)
  };
}

/**
 * Format company data for LLM consumption
 */
formatCompanyContext(company, config) {
  const currentMetrics = Object.fromEntries(company.business_metrics || new Map());
  const previousMetrics = Object.fromEntries(company.business_metrics_previous || new Map());

  return {
    // The Business
    identity: {
      name: company.name,
      founded: company.founding_year,
      age: new Date().getFullYear() - company.founding_year,
      industry: company.industry,
      subtype: company.industry_subtype,
      business_model: company.business_model,
      value_proposition: company.value_proposition,
      revenue_driver: company.primary_revenue_driver,
      client_profile: company.client_profile,
      industry_context: Object.fromEntries(company.industry_business_context || new Map())
    },

    // The Numbers (Current + Trajectory)
    metrics: this.formatMetricsWithBenchmarks(currentMetrics, config.metrics),

    // ENHANCEMENT: Historical trajectory analysis
    trajectory: this.calculateTrajectory(previousMetrics, currentMetrics, config.metrics),

    risk_indicators: this.extractRiskIndicators(currentMetrics, config.metrics),

    // The Vision
    targets: Object.fromEntries(company.targets || new Map()),
    gaps: this.calculateGaps(company.business_metrics, company.targets),
    strategic_vision: company.strategic_vision || {}
  };
}

/**
 * ENHANCEMENT: Calculate year-over-year trajectory for all metrics
 * McKinsey Analysis Gap #1 - Historical Trajectory
 */
calculateTrajectory(previous, current, metricsConfig) {
  const trajectories = {};

  // Iterate through all metric groups
  metricsConfig.groups.forEach(group => {
    group.fields.forEach(field => {
      const prevValue = previous[field.key];
      const currValue = current[field.key];

      if (prevValue !== undefined && currValue !== undefined) {
        const change = currValue - prevValue;
        const pctChange = prevValue > 0 ? ((change / prevValue) * 100) : null;

        trajectories[field.key] = {
          previous: prevValue,
          current: currValue,
          change: change,
          pct_change: pctChange ? parseFloat(pctChange.toFixed(1)) : null,
          direction: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable',
          ai_context: this.generateTrajectoryContext(field, change, pctChange)
        };
      }
    });
  });

  return {
    metrics: trajectories,
    summary: this.generateTrajectorySummary(trajectories)
  };
}

/**
 * Generate AI context based on trajectory
 */
generateTrajectoryContext(field, change, pctChange) {
  const direction = change > 0 ? 'improved' : change < 0 ? 'declined' : 'remained stable';
  const magnitude = Math.abs(pctChange);

  if (magnitude > 10) {
    return `${field.label} ${direction} significantly (${magnitude.toFixed(1)}%) - strong momentum`;
  } else if (magnitude > 5) {
    return `${field.label} ${direction} moderately (${magnitude.toFixed(1)}%) - positive trend`;
  } else {
    return `${field.label} ${direction} slightly (${magnitude.toFixed(1)}%) - gradual change`;
  }
}

/**
 * Generate overall trajectory summary for LLM
 */
generateTrajectorySummary(trajectories) {
  const improving = Object.values(trajectories).filter(t => t.direction === 'improving').length;
  const declining = Object.values(trajectories).filter(t => t.direction === 'declining').length;
  const stable = Object.values(trajectories).filter(t => t.direction === 'stable').length;
  const total = improving + declining + stable;

  return {
    improving_count: improving,
    declining_count: declining,
    stable_count: stable,
    momentum: improving > declining ? 'positive' : declining > improving ? 'negative' : 'mixed',
    ai_context: `Overall trajectory: ${improving}/${total} metrics improving, ${declining}/${total} declining. ${improving > declining ? 'Positive momentum supports ambitious targets.' : declining > improving ? 'Negative momentum suggests conservative targets.' : 'Mixed momentum suggests selective ambition.'}`
  };
}

/**
 * Calculate gaps between current and target
 */
calculateGaps(current, targets) {
  const gaps = {};
  const currentObj = Object.fromEntries(current || new Map());
  const targetsObj = Object.fromEntries(targets || new Map());

  Object.keys(targetsObj).forEach(key => {
    if (currentObj[key] !== undefined) {
      const curr = parseFloat(currentObj[key]);
      const tgt = parseFloat(targetsObj[key]);
      if (!isNaN(curr) && !isNaN(tgt)) {
        gaps[key] = {
          current: curr,
          target: tgt,
          absolute: tgt - curr,
          percentage: curr > 0 ? Math.round(((tgt - curr) / curr) * 100) : null
        };
      }
    }
  });

  return gaps;
}

/**
 * Extract and format risk indicators with warnings
 */
extractRiskIndicators(metrics, config) {
  const risks = [];

  config.groups.forEach(group => {
    if (group.warning_section) {
      group.fields.forEach(field => {
        const value = metrics[field.key];
        if (value !== undefined && field.warning_threshold) {
          const isWarning = field.warning_direction === 'above'
            ? value > field.warning_threshold
            : value < field.warning_threshold;

          if (isWarning) {
            risks.push({
              metric: field.label,
              value: value,
              threshold: field.warning_threshold,
              message: field.warning_message,
              ai_context: field.ai_context
            });
          }
        }
      });
    }
  });

  return risks;
}
```

### OKR Prompt Construction

```javascript
// server/routes/ai-okr.js - Add to generateOKRs function

/**
 * Build McKinsey-style OKR generation prompt
 * Epic K: Company Profile Redesign
 */
function buildMcKinseyPrompt(company, ssi, config) {
  return `
You are a senior McKinsey partner advising ${company.identity.name} on their annual OKRs.

═══════════════════════════════════════════════════════════════════════════════
THE BUSINESS (How They Create Value)
═══════════════════════════════════════════════════════════════════════════════

Industry: ${company.identity.industry} → ${formatLabel(company.identity.subtype)}
Founded: ${company.identity.founded} (${company.identity.age} years in business)
Business Model: ${formatLabel(company.identity.business_model)}
Value Proposition: "${company.identity.value_proposition || 'Not specified'}"
Primary Revenue Driver: ${formatLabel(company.identity.revenue_driver)}
Typical Client: "${company.identity.client_profile || 'Not specified'}"

${formatIndustryContext(company.identity.industry_context)}

═══════════════════════════════════════════════════════════════════════════════
THE NUMBERS (Current State + Historical Trajectory)
═══════════════════════════════════════════════════════════════════════════════

${formatMetricsSections(company.metrics)}

📊 YEAR-OVER-YEAR TRAJECTORY:
${formatTrajectory(company.trajectory)}

${company.trajectory.summary.ai_context}

⚠️ RISK INDICATORS:
${formatRiskIndicators(company.risk_indicators)}

💰 REVENUE CONCENTRATION:
${formatConcentrationRisk(company.metrics.top_5_clients_revenue_pct)}

═══════════════════════════════════════════════════════════════════════════════
THE VISION (Where They Want To Go)
═══════════════════════════════════════════════════════════════════════════════

12-Month Targets:
${formatTargetsWithGaps(company.gaps)}

Strategic Context (In Their Words):

#1 Priority: "${company.strategic_vision.priority_1 || 'Not specified'}"

Biggest Blocker: "${company.strategic_vision.blocker || 'Not specified'}"

If Only One Thing: "${company.strategic_vision.one_thing || 'Not specified'}"

═══════════════════════════════════════════════════════════════════════════════
ORGANIZATIONAL CAPABILITIES (From SSI Diagnostic)
═══════════════════════════════════════════════════════════════════════════════

Overall Scores:
- Speed: ${ssi.speed}/10 ${ssi.speed >= 7 ? '✓ Strength' : '⚠️ Gap'}
- Strength: ${ssi.strength}/10 ${ssi.strength >= 7 ? '✓ Strength' : '⚠️ Gap'}
- Intelligence: ${ssi.intelligence}/10 ${ssi.intelligence >= 7 ? '✓ Strength' : '⚠️ Gap'}

Top Capability Gaps (Constrain execution):
${formatWeakBlocks(ssi.weakBlocks)}

Top Strengths (Leverage these):
${formatStrongBlocks(ssi.strongBlocks)}

═══════════════════════════════════════════════════════════════════════════════
OKR GENERATION INSTRUCTIONS
═══════════════════════════════════════════════════════════════════════════════

Generate 3-4 Objectives with 3-4 Key Results each.

CRITICAL RULES:

1. FIRST OBJECTIVE must address their stated #1 priority

2. ALL Key Results must use specific numbers:
   - Use CURRENT values from "The Numbers"
   - Use TARGET values from "The Vision"
   - Set KRs BETWEEN current and target (achievable stretch)

3. USE HISTORICAL TRAJECTORY to validate target realism:
   - If a metric improved 7% last year, a 25% target is aggressive (possible with intervention)
   - If a metric declined last year, targets should include recovery buffer
   - Positive momentum = can push toward upper end of target
   - Negative momentum = conservative targets, focus on stabilization first
   - Example: Revenue grew 7.1% YoY → 15% growth target is ambitious but achievable

4. CONSIDER CAPABILITY GAPS when setting targets:
   - If SSI shows weak execution speed, reduce KR aggressiveness by 20-30%
   - If SSI shows strong analytics, leverage data-driven approaches

5. ADDRESS RISK INDICATORS:
   - If clients_over_65 > 50%, include succession-related objective
   - If next_gen_engagement < 40%, include family engagement objective
   - If top_5_clients_revenue_pct > 50%, RETENTION takes priority over growth

6. REVENUE CONCENTRATION LOGIC:
   - Above 50%: "Retention is survival" - first objective should focus on deepening existing relationships
   - Below 30%: "Diversified base" - can pursue aggressive growth targets
   - 30-50%: "Balanced" - mix of retention and growth objectives

7. RESPECT CONSTRAINTS mentioned in "Biggest Blocker"

8. ENSURE ACHIEVABILITY:
   - Consider team size when setting activity-based KRs
   - Consider client count when setting coverage KRs
   - Factor in SSI capability scores for realism
   - Factor in historical trajectory for realistic improvement rates

EXAMPLE OF EXCELLENT OUTPUT (WITH TRAJECTORY ANALYSIS):

Objective 1: Strengthen intergenerational client relationships to secure wealth transfer retention
(Addresses #1 priority + risk indicator: low next-gen engagement)

KR1: Increase next-gen engagement from 32% to 45%
     (Current: 32%, Target: 50%, SSI shows moderate execution → 45% realistic)
     TRAJECTORY CHECK: +4pp improvement last year (28%→32%) supports +13pp target this year

KR2: Launch Family Wealth Review program with 40% of client families participating
     (Directly from their "one thing" + realistic given 8 advisors)
     TRAJECTORY CHECK: First-year program, no historical baseline - conservative 40% vs 50% target

KR3: Onboard 15 next-gen clients as primary contacts
     (8 advisors × 2 each = 16, reduced to 15 accounting for SSI execution gap)
     TRAJECTORY CHECK: Advisor count grew from 7→8 last year, supports capacity for new initiative

EXAMPLE WITH HIGH CONCENTRATION RISK:

Objective 1: De-risk client concentration while maintaining service excellence
(CRITICAL: Top 5 clients = 55% of revenue - retention is survival)

KR1: Reduce top 5 client concentration from 55% to 45%
     (Add 3 new clients at $500K+ AUM to dilute concentration)

KR2: Achieve 100% retention of top 10 clients
     (BEFORE pursuing growth - cannot afford to lose anchor clients)

KR3: Deepen top 5 client relationships with quarterly strategic reviews
     (Defensive positioning while building diversification)
`;
}
```

---

## User Stories (33 pts) ← Updated +7 pts (McKinsey + Audit + Architecture)

| Story | Points | Description |
|-------|--------|-------------|
| K1 | 7 (+4) | **Schema Extensions**: Nested business_context structure (Decision 6B), industry validation (Decision 6A), API allowlist (Decision 6C), **+ data provenance + industry_subtype** |
| K2 | 4 | **Industry Config**: Complete Financial Services configuration **+ trajectory_metrics array + GET /api/config/industries endpoint** |
| K3 | 4 | **Tab 1 UI**: "The Business" - identity + industry-specific business fields |
| K4 | 7 (+1) | **Tab 2 UI**: "The Numbers" - metrics with benchmarks **+ Previous Year column + provenance display (stale data warning)** |
| K5 | 4 | **Tab 3 UI**: "The Vision" - targets with gaps + strategic questions |
| K6 | 4 (+1) | **AIContextService**: Centralized context builder (Decision 6D) **+ concentration risk soft prioritization + trajectory analysis** |
| K7 | 2 | **Completion Indicator**: Profile completion percentage + autosave |
| K8 | 1 | **OKR Validation**: Vague phrase detection + auto-retry logic |
| **Total** | **33** | **(+7 pts: +2 McKinsey, +3 Audit, +2 Architecture)** |

### Impact Assessment - All Enhancements

| Enhancement | Impact | Effort | Story | Added Points |
|-------------|--------|--------|-------|--------------|
| **Historical Trajectory (curated 8 metrics)** | HIGH | MEDIUM | K1, K4 | +1 (absorbed) |
| **Data Provenance** | MEDIUM | MEDIUM | K1, K4 | +1 (K1) |
| **Industry Validation Middleware** | HIGH | LOW | K2 | Absorbed |
| **Concentration Risk Soft Prioritization** | HIGH | MEDIUM | K6 | +1 (K6) |
| **OKR Vague Phrase Detection** | MEDIUM | LOW | K8 | +1 (new story) |
| **Trajectory Metrics Config** | LOW | LOW | K2 | Absorbed |
| **Decision 6A: Industry SOT (industries.js)** | HIGH | LOW | K1, K2 | +1 (K1) |
| **Decision 6B: Nested business_context** | HIGH | MEDIUM | K1 | +1 (K1) |
| **Decision 6C: API Field Allowlist** | HIGH | LOW | K1 | Absorbed in K1 |
| **Decision 6D: AI Context Centralization** | HIGH | LOW | K6 | Absorbed in K6 |

**Total Impact**: +7 pts (26 → 33 pts from original spec)

---

## Story Details

### K1: Company Model Schema Extensions (7 pts) ← +4 pts for audit + architecture

**As a** system
**I want** to store comprehensive business context with historical trajectory and data provenance
**So that** AI can generate personalized OKRs with realistic, trustworthy targets

**Acceptance Criteria:**

#### Decision 6A: Industry Source of Truth
- [ ] Remove `enum` from Company.industry field
- [ ] Add custom validator that checks against `industries.js` config
- [ ] Industry validation error message references config file

#### Decision 6B: Nested business_context Structure
- [ ] `business_context.profile` contains: founding_year, business_model, value_proposition, primary_revenue_driver, client_profile
- [ ] `business_context.industry_context` Map for industry-specific fields
- [ ] `business_context.metrics.current` Map with provenance (value, updated_at, source, updated_by) **(Decision #4)**
- [ ] `business_context.metrics.previous` Map for 8 curated trajectory metrics **(Decision #1)**
- [ ] `business_context.targets` Map for 12-month targets
- [ ] `business_context.strategic_vision` object with priority_1, blocker, one_thing
- [ ] `business_context.profile_updated_at` timestamp
- [ ] `business_context.completion_percentage` calculated field

#### Decision 6C: API Field Allowlist
- [ ] `ALLOWED_UPDATE_FIELDS` constant in companies.js route
- [ ] PUT /api/companies/:id uses allowlist to filter updates
- [ ] Deep merge for business_context preserves existing data
- [ ] `industry_subtype` field added (top-level for indexing)

#### Decision 5: Industry Validation Middleware
- [ ] Pre-save hook validates industry_subtype against industries.js
- [ ] Error thrown for invalid industry/subtype combination

#### Backwards Compatibility
- [ ] Existing business_context data preserved (no migration needed)
- [ ] All new fields have sensible defaults

---

### K2: Industry Configuration - Financial Services (4 pts)

**As a** system administrator
**I want** complete configuration for Financial Services Legacy/Succession
**So that** the profile dynamically adapts to this industry

**Acceptance Criteria:**
- [ ] `server/config/industry-profiles/financial-services.json` created
- [ ] Business fields: service_focus, fee_structure, client_tenure, referral_source
- [ ] Metrics: 4 groups with all fields, benchmarks, and AI context
- [ ] Risk indicators with warning thresholds
- [ ] `top_5_clients_revenue_pct` field in risk indicators **(NEW - McKinsey Enhancement)**
- [ ] Strategic questions with placeholders
- [ ] All `ai_context` hints populated for LLM guidance

---

### K3: Tab 1 UI - "The Business" (4 pts)

**As a** business owner
**I want** to describe how my business works
**So that** AI understands our value creation model

**Acceptance Criteria:**
- [ ] Tab 1 displays universal fields (founding year, business model, etc.)
- [ ] Industry-specific fields load from config when subtype selected
- [ ] Multi-select fields work correctly (service_focus)
- [ ] Dropdown options from config
- [ ] Help text/tooltips for each field
- [ ] Autosave on field blur

---

### K4: Tab 2 UI - "The Numbers" (7 pts) ← +1 pt for trajectory display

**As a** business owner
**I want** to enter my current and previous year business metrics
**So that** AI has the baseline AND trajectory for generating realistic KRs

**Acceptance Criteria:**
- [ ] Metrics organized by groups from config
- [ ] Currency formatting for currency fields
- [ ] Percentage formatting for percentage fields
- [ ] **Three-column layout: Previous Year | Current | vs Last Year** **(NEW - McKinsey Enhancement)**
- [ ] **Auto-calculated trajectory indicators (↑/↓/→ with percentage)** **(NEW - McKinsey Enhancement)**
- [ ] Benchmark visualization bars (you vs industry)
- [ ] Risk indicators section with warning highlights
- [ ] Warning messages display when thresholds exceeded
- [ ] Revenue concentration warning for top 5 clients **(NEW - McKinsey Enhancement)**
- [ ] Responsive layout that collapses gracefully on mobile
- [ ] Autosave with status indicator

---

### K5: Tab 3 UI - "The Vision" (4 pts)

**As a** business owner
**I want** to set my targets and articulate priorities
**So that** AI knows where I want to go

**Acceptance Criteria:**
- [ ] Target fields auto-populated from metrics with `target_field: true`
- [ ] Side-by-side Current → Target display with calculated gap
- [ ] Three strategic question textareas
- [ ] Placeholder text from config
- [ ] Character count indicators
- [ ] Autosave on blur

---

### K6: AIContextService Enhancement (4 pts) ← +1 pt for concentration prioritization

**As an** AI system
**I want** rich, structured context from the company profile with trajectory analysis and risk-aware prioritization
**So that** I can generate McKinsey-quality OKRs with realistic, contextually-appropriate targets

**Acceptance Criteria:**
- [ ] `buildOKRGenerationContext()` method returns structured context
- [ ] Metrics formatted with benchmarks and provenance indicators
- [ ] **Trajectory analysis for 8 curated metrics** (Audit Decision #1)
- [ ] **Trajectory summary with improving/declining/stable counts**
- [ ] Risk indicators extracted and highlighted
- [ ] **Concentration risk soft prioritization with user override** (Audit Decision #2)
- [ ] **Priority override object when top_5_clients_revenue_pct > 50%**
- [ ] Gaps calculated between current and targets
- [ ] McKinsey-style prompt template with trajectory + concentration instructions
- [ ] SSI data merged appropriately
- [ ] Graceful handling of incomplete profiles
- [ ] Flag stale metrics (>90 days old) in context

---

### K7: Profile Completion Indicator (2 pts)

**As a** business owner
**I want** to see how complete my profile is
**So that** I know what to fill in for better OKRs

**Acceptance Criteria:**
- [ ] Circular progress indicator shows overall percentage
- [ ] Breakdown by tab (Business, Numbers, Vision)
- [ ] Updates dynamically as fields are filled
- [ ] Autosave status indicator (saving... / saved)
- [ ] Tooltip explaining what improves completion

---

### K8: OKR Validation & Guardrails (1 pt) ← NEW (Audit Enhancement)

**As a** system
**I want** to detect vague OKR outputs and automatically retry
**So that** generated OKRs always have specific, measurable targets

**Acceptance Criteria:**
- [ ] Vague phrase detection using regex patterns
- [ ] Auto-retry with stricter prompt when vague KRs detected
- [ ] Soft warnings for targets exceeding 3x historical growth
- [ ] Soft warning for growth targets when concentration risk is high
- [ ] All warnings displayed in UI but not blocking

**Implementation**:
```javascript
// In ai-okr.js
const VAGUE_PATTERNS = [
  /improve\s+(customer|client|employee|team)/i,
  /better\s+(service|quality|performance)/i,
  /increase\s+(satisfaction|engagement)/i,
  /more\s+(efficient|effective)/i
];

function validateOKROutput(okrs) {
  const warnings = [];
  const requiresRetry = okrs.some(okr =>
    okr.key_results.some(kr => {
      const hasNumber = /\d+%?|\$[\d,]+|from\s+\d+\s+to\s+\d+/i.test(kr.description);
      const isVague = VAGUE_PATTERNS.some(p => p.test(kr.description));
      return isVague && !hasNumber;
    })
  );

  return { requiresRetry, warnings };
}
```

---

## Implementation Order

### Phase 1: Backend Foundation (Days 1-3) - 11 pts
| Story | Points | Dependencies |
|-------|--------|--------------|
| K1: Schema Extensions + Architecture | 7 (+4) | None |
| K2: Industry Config + API Endpoint | 4 | None |

### Phase 2: Frontend (Days 4-6) - 15 pts
| Story | Points | Dependencies |
|-------|--------|--------------|
| K3: Tab 1 UI | 4 | K2 |
| K4: Tab 2 UI | 7 (+1) | K2 |
| K5: Tab 3 UI | 4 | K4 (for target fields) |

### Phase 3: AI Integration + Validation (Day 7) - 7 pts
| Story | Points | Dependencies |
|-------|--------|--------------|
| K6: AIContextService (Centralized) | 4 (+1) | K1, K2 |
| K7: Completion Indicator | 2 | K3, K4, K5 |
| K8: OKR Validation | 1 | K6 |

**Total: 33 pts** (+7 from McKinsey + Audit + Architecture Enhancements)

---

## Testing Requirements

### Unit Tests
- [ ] Company model with new fields
- [ ] Profile completion virtual property
- [ ] Gap calculation logic
- [ ] Risk indicator extraction

### Integration Tests
- [ ] Full profile save/retrieve cycle
- [ ] Industry config loading
- [ ] AIContextService context building
- [ ] Prompt construction with all sections

### E2E Tests
- [ ] Tab navigation works
- [ ] Industry-specific fields load on subtype change
- [ ] Autosave triggers on blur
- [ ] Benchmarks display correctly
- [ ] Risk warnings appear at thresholds
- [ ] Completion indicator updates

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Profile completion rate | >70% of users complete all 3 tabs |
| Time to complete profile | <10 minutes |
| OKR specificity (contains numbers) | >90% of KRs have specific numbers |
| OKR revision rate | <2 revisions before acceptance |
| User satisfaction with OKR quality | >4.0/5.0 rating |

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Config grows complex | Medium | Medium | Modular structure from start |
| AI prompt too long | High | Medium | Truncate/summarize lower-priority sections |
| User fatigue with data entry | Medium | Medium | Clear progress indicator, autosave |
| Incomplete profiles | Medium | High | Show OKR quality preview based on completion |

---

## Related Documents

- [Company.js Model](../../../../server/models/Company.js)
- [AIContextService.js](../../../../server/services/AIContextService.js)
- [ai-okr.js Routes](../../../../server/routes/ai-okr.js)
- [company-profile.html](../../../../client/pages/company-profile.html)
- [EPIC-R-SSI-DIAGNOSTIC-REPORT.md](./EPIC-R-SSI-DIAGNOSTIC-REPORT.md) - SSI provides qualitative context

---

**Epic Owner**: Product Team
**Technical Lead**: TBD
**Estimated Duration**: 6 development days
**Sprint Target**: Sprint 10 (January 2026)
