# LLM Orchestration Strategy

<!-- @GENOME T2-ARC-021 | ACTIVE | 2026-04-20 | parent:T2-ARC-001 | auto:/coding,/strategy | linked:/design -->

**Version**: 1.0
**Created**: April 20, 2026 (Session #166)
**Purpose**: Define LLM integration architecture for intelligent KR generation
**Status**: ACTIVE - Sprint 22 Foundation
**Audience**: Engineering, Architecture, Product

---

## Executive Summary

The **LLM Orchestration System** enables YSELA to generate intelligent, outcome-focused Key Results by assembling rich business context from multiple LEGO pieces and calling OpenAI's API with carefully crafted prompts.

**Core Value**: Transform consultant experience from "blank slate" KR writing to "intelligent suggestions you refine."

**Key Decisions**:
- File-based prompt storage (git-versioned, simple for beta)
- 5-minute context caching (in-memory)
- GPT-4 Turbo for beta (quality critical)
- 4 initial industries + general fallback
- Auto-retry once on timeout

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prompt Management System](#prompt-management-system)
3. [Context Assembly Integration](#context-assembly-integration)
4. [Vertical Insights Knowledge Base](#vertical-insights-knowledge-base)
5. [Error Handling & Fallbacks](#error-handling--fallbacks)
6. [Cost & Performance](#cost--performance)
7. [Implementation Guide](#implementation-guide)
8. [API Reference](#api-reference)

---

## Architecture Overview

### System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         LLM ORCHESTRATION FLOW                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   USER (Consultant)                                                      │
│       │                                                                  │
│       │  1. Creates objective (Screen 1)                                │
│       │     title, ssi_impact, behaviors                                │
│       ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │              LLM ORCHESTRATION SERVICE                           │  │
│   │  ┌─────────────────────────────────────────────────────────┐    │  │
│   │  │  2. CONTEXT ASSEMBLY (via Orchestrator)                  │    │  │
│   │  │     ├─ CompanyProvider → business_context                │    │  │
│   │  │     ├─ AssessmentProvider → ssi_scores, constraint       │    │  │
│   │  │     ├─ BehaviorProvider → selected behaviors             │    │  │
│   │  │     └─ VerticalInsights → industry patterns              │    │  │
│   │  └─────────────────────────────────────────────────────────┘    │  │
│   │                              │                                   │  │
│   │                              ▼                                   │  │
│   │  ┌─────────────────────────────────────────────────────────┐    │  │
│   │  │  3. PROMPT RENDERING                                     │    │  │
│   │  │     Load template + Merge context → Complete prompt      │    │  │
│   │  └─────────────────────────────────────────────────────────┘    │  │
│   │                              │                                   │  │
│   │                              ▼                                   │  │
│   │  ┌─────────────────────────────────────────────────────────┐    │  │
│   │  │  4. LLM API CALL                                         │    │  │
│   │  │     OpenAI GPT-4 Turbo → Retry on timeout → Parse JSON   │    │  │
│   │  └─────────────────────────────────────────────────────────┘    │  │
│   │                              │                                   │  │
│   │                              ▼                                   │  │
│   │  ┌─────────────────────────────────────────────────────────┐    │  │
│   │  │  5. RESPONSE PROCESSING                                  │    │  │
│   │  │     Validate KRs → Add metadata → Log for analytics      │    │  │
│   │  └─────────────────────────────────────────────────────────┘    │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│       │                                                                  │
│       │  6. Returns 3-5 outcome-based KRs + guidance                   │
│       ▼                                                                  │
│   USER reviews, edits, saves (Screen 2 & 3)                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Integration with Orchestrator

The LLM Orchestration Service is a **consumer** of the [Orchestrator Architecture](./ORCHESTRATOR_ARCHITECTURE.md). It uses:

- **ContextAssemblyService** - Fetches data from LEGO pieces
- **WorkflowService** - Emits events after KR generation
- **PresentationService** - Formats suggestions for UI

---

## Prompt Management System

### Architecture Decision

| Aspect | Beta (v1.0) | Post-Beta (v2.0) |
|--------|-------------|------------------|
| **Storage** | File-based (git) | Hybrid (file + database) |
| **Versioning** | Semantic (v1.0, v1.1) | Database + git tags |
| **A/B Testing** | Manual (feature flags) | Built-in (traffic split) |
| **Analytics** | Log-based | Database metrics |

**Rationale**: File-based is simpler, prompts are version-controlled, and we can review changes in PRs. Post-beta, we'll add database storage for A/B testing and analytics.

### File Structure

```
server/
├── prompts/
│   ├── objective_kr_generation/
│   │   ├── v1.0.md          # Current active version
│   │   ├── v1.1.md          # Future iterations
│   │   └── active.json      # Points to active version
│   │
│   ├── weekly_task_generation/
│   │   └── v1.0.md          # Future: Task generation prompt
│   │
│   └── README.md            # Prompt catalog and guidelines
│
├── services/
│   └── PromptService.js     # Loads and renders prompts
```

### Prompt Service

```javascript
// server/services/PromptService.js

const fs = require('fs').promises;
const path = require('path');
const Handlebars = require('handlebars');

class PromptService {
  constructor() {
    this.promptsDir = path.join(__dirname, '../prompts');
    this.cache = new Map();
    this.cacheTTL = 60000; // 1 minute cache for hot reload in dev
  }

  /**
   * Load and render a prompt template
   * @param {string} promptName - e.g., 'objective_kr_generation'
   * @param {object} context - Variables to inject into template
   * @returns {string} Rendered prompt ready for LLM
   */
  async render(promptName, context) {
    const template = await this.loadTemplate(promptName);
    const compiled = Handlebars.compile(template);
    return compiled(context);
  }

  /**
   * Load template from file (with caching)
   */
  async loadTemplate(promptName) {
    const cacheKey = promptName;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.template;
    }

    // Read active version config
    const configPath = path.join(this.promptsDir, promptName, 'active.json');
    const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

    // Read template file
    const templatePath = path.join(this.promptsDir, promptName, `${config.version}.md`);
    const template = await fs.readFile(templatePath, 'utf8');

    // Cache it
    this.cache.set(cacheKey, { template, timestamp: Date.now() });

    return template;
  }

  /**
   * Get prompt metadata (version, last updated, etc.)
   */
  async getMetadata(promptName) {
    const configPath = path.join(this.promptsDir, promptName, 'active.json');
    return JSON.parse(await fs.readFile(configPath, 'utf8'));
  }
}

module.exports = new PromptService();
```

### Active Version Config

```json
// server/prompts/objective_kr_generation/active.json
{
  "version": "v1.0",
  "updated_at": "2026-04-20",
  "updated_by": "Session #166",
  "notes": "Initial behavior-driven, outcome-based prompt"
}
```

### Versioning Strategy

| Version | When | Examples |
|---------|------|----------|
| **Patch** (v1.0.1) | Typo fixes, wording tweaks | Fix grammar, clarify example |
| **Minor** (v1.1) | New examples, added guidance | Add industry-specific tips |
| **Major** (v2.0) | Structure change, new philosophy | Different output format |

---

## Context Assembly Integration

### Context Requirements for KR Generation

The `GENERATE_KRS` action requires data from multiple providers:

```json
// Defined in orchestrator/config/context-rules.json
{
  "GENERATE_KRS": {
    "description": "Context for generating Key Results",
    "requires": [
      {
        "provider": "company",
        "fields": ["name", "industry", "employee_count", "business_context"],
        "priority": "high_value",
        "fallback": { "name": "Unknown Company", "industry": "general" }
      },
      {
        "provider": "assessment",
        "fields": ["ssi_scores", "constraint_area", "sub_dimensions"],
        "priority": "recommended",
        "fallback": { "ssi_scores": { "speed": 50, "strength": 50, "intelligence": 50 } }
      },
      {
        "provider": "objective",
        "fields": ["title", "category", "behaviors", "ssi_impact"],
        "priority": "required",
        "fallback": null
      },
      {
        "provider": "behavior",
        "fields": ["name", "description", "foundation", "success_indicators"],
        "priority": "required",
        "fallback": null
      },
      {
        "provider": "person",
        "fields": ["name", "role"],
        "priority": "optional",
        "fallback": { "name": "Owner", "role": "unknown" }
      }
    ]
  }
}
```

### Context Caching Strategy

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Cache Key** | `company_id` | Company data rarely changes mid-session |
| **Cache Duration** | 5 minutes | Consultant likely creates multiple objectives |
| **Cache Backend** | In-memory (Map) | Simple for beta, Redis post-beta |
| **Invalidation** | On `company.profile_updated` event | Ensure fresh context |

```javascript
// server/services/LLMOrchestrationService.js (caching portion)

class LLMOrchestrationService {
  constructor() {
    this.contextCache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  async getOrFetchContext(action, params) {
    const cacheKey = `${action}:${params.company_id}`;
    const cached = this.contextCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.context;
    }

    // Fetch fresh context via orchestrator
    const context = await orchestrator.contextAssembly.assembleContext(action, params);

    // Cache it
    this.contextCache.set(cacheKey, { context, timestamp: Date.now() });

    return context;
  }

  invalidateCache(companyId) {
    for (const key of this.contextCache.keys()) {
      if (key.includes(companyId)) {
        this.contextCache.delete(key);
      }
    }
  }
}
```

### Context Object Structure

The assembled context for KR generation:

```javascript
{
  _metadata: {
    action: 'GENERATE_KRS',
    assembled_at: '2026-04-20T10:30:00Z',
    completeness: {
      company: 'complete',      // All fields available
      assessment: 'complete',   // SSI scores available
      objective: 'complete',    // Required fields present
      behavior: 'complete',     // Behaviors loaded
      person: 'optional_empty'  // Not critical
    },
    overall_completeness: 100   // Percentage
  },

  company: {
    name: 'Acme Corp',
    industry: 'professional_services',
    employee_count: 75,
    business_model: 'B2B Consulting',
    business_priorities: ['Client retention', 'Team utilization'],
    current_challenges: ['Inconsistent service delivery', 'Knowledge silos']
  },

  assessment: {
    ssi_scores: { speed: 45, strength: 62, intelligence: 58 },
    constraint_area: 'speed',
    constraint_score: 45,
    sub_dimensions: {
      decisions: 38,
      delivery: 52,
      response: 45
    }
  },

  objective: {
    title: 'Establish Weekly Leadership Sync',
    category: 'operations',
    ssi_impact: { area: 'speed', sub_dimension: 'decisions' },
    expected_improvement: '+15 points',
    behaviors: [
      { name: 'Accountability', description: '...', foundation: 'Discipline' },
      { name: 'Truth', description: '...', foundation: 'Growth' }
    ]
  },

  owner: {
    name: 'Sarah Chen',
    role: 'EXECUTIVE'
  },

  vertical_insights: {
    industry: 'professional_services',
    typical_krs: { /* industry-specific patterns */ },
    benchmarks: { /* typical ranges */ }
  }
}
```

---

## Vertical Insights Knowledge Base

### Purpose

The Vertical Insights Knowledge Base provides industry-specific patterns, benchmarks, and coaching guidance to improve KR quality. It makes generic objectives specific to the client's business.

### Industries for Beta

| # | Industry Code | Display Name | Priority | Rationale |
|---|---------------|--------------|----------|-----------|
| 1 | `legacy_succession_planning` | Legacy Succession Planning | P0 | Core YSELA market |
| 2 | `professional_services` | Professional Services | P1 | Law, accounting, consulting |
| 3 | `real_estate` | Real Estate | P1 | Active customer (RR Homes) |
| 4 | `general` | General | P0 | Required fallback |

### Knowledge Base File

```javascript
// server/knowledge/vertical_insights.js

module.exports = {

  // ═══════════════════════════════════════════════════════════════════════
  // LEGACY SUCCESSION PLANNING
  // Family-owned businesses, multi-generational transitions
  // ═══════════════════════════════════════════════════════════════════════

  legacy_succession_planning: {
    name: 'Legacy Succession Planning',
    description: 'Family-owned businesses, multi-generational transitions',

    typical_objectives: [
      'Meeting structures',
      'KPI implementation',
      'Role clarity / org charts',
      'Process documentation',
      'Risk assessment',
      'Foundation building'
    ],

    krs_by_objective_type: {
      meeting_structure: {
        time_savings: {
          metric: 'Operational expenses (meeting time cost)',
          typical_baseline: '$50K-$80K/month for 50-100 person company',
          realistic_target: '10-20% reduction',
          measurement: 'Calculate: meetings × attendees × duration × hourly rate'
        },
        decision_speed: {
          metric: 'Decision-to-action cycle time',
          typical_baseline: '5-7 days average',
          realistic_target: '< 48 hours',
          measurement: 'Track decisions in meeting notes → action started'
        },
        completion_rate: {
          metric: 'Meeting action item completion rate',
          typical_baseline: '40-60% (establish baseline)',
          realistic_target: '> 85%',
          measurement: 'Track action items from notes'
        },
        clarity_score: {
          metric: 'Employee clarity score',
          typical_baseline: '2.8-3.2/5',
          realistic_target: '> 4.2/5',
          measurement: '5-question pulse survey, quarterly'
        }
      },

      kpi_implementation: {
        visibility: {
          metric: 'Management visibility score',
          typical_baseline: '2.5/5',
          realistic_target: '> 4/5',
          measurement: 'Manager survey: "I have the data I need to manage"'
        },
        proactive_ratio: {
          metric: 'Proactive vs reactive work ratio',
          typical_baseline: '20:80 (mostly firefighting)',
          realistic_target: '50:50',
          measurement: 'Manager self-report, weekly'
        }
      },

      role_clarity: {
        role_clarity: {
          metric: 'Employees can describe their role clearly',
          typical_baseline: '60% of employees',
          realistic_target: '> 90%',
          measurement: 'Survey: "I know exactly what I am responsible for"'
        }
      }
    },

    typical_constraints: {
      speed: { typical_range: '35-50', improvement_potential: '+15-25 points' },
      strength: { typical_range: '55-70', improvement_potential: '+10-15 points' },
      intelligence: { typical_range: '45-60', improvement_potential: '+12-18 points' }
    },

    coaching_patterns: {
      common_pitfalls: [
        'Creating too many meeting types at once (start with 1-2)',
        'No agenda = meeting devolves into updates (require agenda 24h before)',
        'Action items not tracked (dedicate last 5 min to review)'
      ],
      success_indicators: [
        'Meetings start and end on time without reminders',
        'Employees proactively prepare agendas',
        'Problems discussed openly, not in hallway conversations'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PROFESSIONAL SERVICES
  // Law firms, accounting, consulting, agencies
  // ═══════════════════════════════════════════════════════════════════════

  professional_services: {
    name: 'Professional Services',
    description: 'Law firms, accounting firms, consulting, agencies',

    typical_objectives: [
      'Utilization tracking',
      'Client retention programs',
      'Knowledge management',
      'Partner accountability',
      'Service delivery standards'
    ],

    krs_by_objective_type: {
      utilization_tracking: {
        utilization_rate: {
          metric: 'Billable utilization rate',
          typical_baseline: '55-65%',
          realistic_target: '70-80%',
          measurement: 'Time tracking system'
        },
        revenue_per_employee: {
          metric: 'Revenue per professional',
          typical_baseline: 'Varies by firm type',
          realistic_target: '+10-15%',
          measurement: 'Revenue / headcount'
        }
      },

      client_retention: {
        retention_rate: {
          metric: 'Client retention rate (annual)',
          typical_baseline: '75-85%',
          realistic_target: '> 90%',
          measurement: 'Clients retained / total clients'
        },
        nps_score: {
          metric: 'Net Promoter Score',
          typical_baseline: '20-40',
          realistic_target: '> 50',
          measurement: 'Quarterly client survey'
        }
      }
    },

    typical_constraints: {
      speed: { typical_range: '50-65', improvement_potential: '+10-15 points' },
      strength: { typical_range: '60-75', improvement_potential: '+8-12 points' },
      intelligence: { typical_range: '55-70', improvement_potential: '+10-15 points' }
    },

    coaching_patterns: {
      common_pitfalls: [
        'Partners resist utilization tracking (position as visibility, not micromanagement)',
        'Time tracking compliance drops after month 1 (weekly review rituals)',
        'Knowledge stays in partner heads (require documentation before promotion)'
      ],
      success_indicators: [
        'Partners review utilization weekly without prompting',
        'Junior staff can find answers in knowledge base',
        'Client calls are returned same day'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // REAL ESTATE
  // Brokerages, property management, development
  // ═══════════════════════════════════════════════════════════════════════

  real_estate: {
    name: 'Real Estate',
    description: 'Brokerages, property management, development firms',

    typical_objectives: [
      'Lead tracking and conversion',
      'Transaction management',
      'Team coordination',
      'Agent onboarding',
      'Market analysis discipline'
    ],

    krs_by_objective_type: {
      lead_tracking: {
        lead_response_time: {
          metric: 'Average lead response time',
          typical_baseline: '4-24 hours',
          realistic_target: '< 1 hour',
          measurement: 'CRM timestamp: lead received → first contact'
        },
        conversion_rate: {
          metric: 'Lead to showing conversion',
          typical_baseline: '15-25%',
          realistic_target: '> 30%',
          measurement: 'Showings / qualified leads'
        }
      },

      transaction_management: {
        closing_time: {
          metric: 'Average time to close',
          typical_baseline: '45-60 days',
          realistic_target: '< 40 days',
          measurement: 'Contract to close date'
        },
        fall_through_rate: {
          metric: 'Transaction fall-through rate',
          typical_baseline: '15-25%',
          realistic_target: '< 10%',
          measurement: 'Failed transactions / total transactions'
        }
      }
    },

    typical_constraints: {
      speed: { typical_range: '45-60', improvement_potential: '+12-18 points' },
      strength: { typical_range: '50-65', improvement_potential: '+10-15 points' },
      intelligence: { typical_range: '40-55', improvement_potential: '+15-20 points' }
    },

    coaching_patterns: {
      common_pitfalls: [
        'Agents resist CRM adoption (show personal benefit first)',
        'Market analysis paralysis (set decision deadlines)',
        'Team meetings become status dumps (focus on deals at risk)'
      ],
      success_indicators: [
        'Agents log activities same day',
        'Weekly pipeline reviews happen without prompting',
        'Agents ask for market data before pricing'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // GENERAL (Fallback)
  // Generic patterns for unmatched industries
  // ═══════════════════════════════════════════════════════════════════════

  general: {
    name: 'General',
    description: 'Generic patterns for any industry',

    typical_objectives: [
      'Meeting structures',
      'KPI implementation',
      'Process documentation',
      'Team accountability',
      'Communication cadence'
    ],

    krs_by_objective_type: {
      meeting_structure: {
        time_savings: {
          metric: 'Meeting time efficiency',
          typical_baseline: 'TBD - establish baseline',
          realistic_target: '15-20% reduction',
          measurement: 'Track total meeting hours weekly'
        },
        action_completion: {
          metric: 'Action item completion rate',
          typical_baseline: '40-50%',
          realistic_target: '> 80%',
          measurement: 'Completed / assigned action items'
        }
      },

      kpi_implementation: {
        dashboard_usage: {
          metric: 'Dashboard review frequency',
          typical_baseline: 'Monthly or less',
          realistic_target: 'Weekly minimum',
          measurement: 'Manager self-report'
        }
      },

      process_documentation: {
        process_coverage: {
          metric: 'Critical processes documented',
          typical_baseline: '30-40%',
          realistic_target: '> 80%',
          measurement: 'Documented / identified processes'
        }
      }
    },

    typical_constraints: {
      speed: { typical_range: '40-55', improvement_potential: '+12-18 points' },
      strength: { typical_range: '50-65', improvement_potential: '+10-15 points' },
      intelligence: { typical_range: '45-60', improvement_potential: '+12-18 points' }
    },

    coaching_patterns: {
      common_pitfalls: [
        'Trying to change everything at once (pick ONE system to implement)',
        'No measurement baseline (establish Week 1)',
        'Leadership not modeling behavior (start at the top)'
      ],
      success_indicators: [
        'Employees reference the new system in conversations',
        'Managers ask for the data they need',
        'Problems are raised before they become crises'
      ]
    }
  }
};
```

### Vertical Insights Service

```javascript
// server/services/VerticalInsightsService.js

const verticalInsights = require('../knowledge/vertical_insights');

class VerticalInsightsService {

  /**
   * Get insights for a company's industry
   * @param {string} industry - Company's industry code
   * @returns {object} Industry insights or general fallback
   */
  getInsights(industry) {
    const normalizedIndustry = this.normalizeIndustry(industry);

    if (verticalInsights[normalizedIndustry]) {
      return verticalInsights[normalizedIndustry];
    }

    // Fallback to general
    console.log(`[VerticalInsights] No match for "${industry}", using general`);
    return verticalInsights.general;
  }

  /**
   * Normalize industry string to knowledge base key
   */
  normalizeIndustry(industry) {
    if (!industry) return 'general';

    const normalized = industry.toLowerCase().replace(/[\s-]/g, '_');

    // Map common variations
    const mappings = {
      'legal': 'professional_services',
      'law': 'professional_services',
      'accounting': 'professional_services',
      'consulting': 'professional_services',
      'real_estate': 'real_estate',
      'property': 'real_estate',
      'family_business': 'legacy_succession_planning',
      'succession': 'legacy_succession_planning',
      'legacy': 'legacy_succession_planning'
    };

    // Check direct match
    if (verticalInsights[normalized]) {
      return normalized;
    }

    // Check mappings
    for (const [variant, canonical] of Object.entries(mappings)) {
      if (normalized.includes(variant)) {
        return canonical;
      }
    }

    return 'general';
  }

  /**
   * Get KR suggestions for specific objective type
   */
  getKRSuggestions(industry, objectiveType) {
    const insights = this.getInsights(industry);

    // Normalize objective type
    const normalizedType = objectiveType.toLowerCase().replace(/[\s-]/g, '_');

    // Find best match
    for (const [key, krs] of Object.entries(insights.krs_by_objective_type)) {
      if (normalizedType.includes(key) || key.includes(normalizedType)) {
        return krs;
      }
    }

    return null; // No specific suggestions
  }

  /**
   * Get coaching patterns for industry
   */
  getCoachingPatterns(industry) {
    const insights = this.getInsights(industry);
    return insights.coaching_patterns;
  }

  /**
   * Get typical SSI ranges for industry
   */
  getTypicalConstraints(industry) {
    const insights = this.getInsights(industry);
    return insights.typical_constraints;
  }
}

module.exports = new VerticalInsightsService();
```

---

## Error Handling & Fallbacks

### Error Scenarios Matrix

| # | Error | Cause | Detection | Fallback | User Message |
|---|-------|-------|-----------|----------|--------------|
| 1 | **LLM Timeout** | OpenAI slow (>30s) | Axios timeout | Auto-retry once, then manual | "AI is taking longer than expected. Retrying..." |
| 2 | **LLM Retry Exhausted** | Still slow after retry | Second timeout | Offer manual entry | "We couldn't generate KRs automatically. [Continue Manually]" |
| 3 | **API Error (5xx)** | OpenAI service down | HTTP 5xx status | Offer retry + manual | "AI service temporarily unavailable. [Manual Entry] [Try Again]" |
| 4 | **Rate Limit (429)** | Too many requests | HTTP 429 status | Wait + retry | "High demand. Retrying in a moment..." |
| 5 | **Invalid JSON** | LLM returns malformed | JSON.parse fails | Parse partial + allow edit | "AI generated partial results. Please review. [Edit KRs]" |
| 6 | **Empty Response** | LLM returns 0 KRs | Empty key_results array | Show error + manual | "AI couldn't generate suggestions. [Create Manually]" |
| 7 | **Context Fetch Failure** | DB query fails | Provider throws error | Use fallbacks from config | No user message (graceful degradation) |
| 8 | **Missing Company Profile** | Profile incomplete | completeness < 50% | Warn + continue | "Company profile incomplete. KRs will be more generic. [Complete Profile] [Continue]" |
| 9 | **Missing Assessment** | No assessment run | assessment is null | Can't auto-suggest SSI | Manual SSI selection required (UI handles) |
| 10 | **Unknown Industry** | Industry not in KB | No match found | Use 'general' fallback | No user message (seamless fallback) |

### Fallback Hierarchy

```
TIER 1: IDEAL STATE
└─ Full context + LLM success
   → High-quality, outcome-based KRs with industry benchmarks

TIER 2: PARTIAL CONTEXT
└─ Missing company profile OR missing assessment
   → Generic but functional KRs + warning banner
   → Consultant can still proceed, quality slightly lower

TIER 3: LLM DEGRADATION
└─ Timeout OR API error
   → Retry once (transparent to user)
   → If retry fails: Manual entry with template
   → Consultant types KRs, no AI assistance

TIER 4: COMPLETE FAILURE
└─ All systems down OR context assembly failed
   → Manual KR form (no AI)
   → Apology message + try again later
   → Consultant can still create objective
```

### Retry Logic Implementation

```javascript
// server/services/LLMOrchestrationService.js (retry portion)

class LLMOrchestrationService {

  async callLLM(prompt, retryCount = 0) {
    const maxRetries = 1; // One retry only
    const retryDelay = 2000; // 2 seconds
    const timeout = 30000; // 30 seconds

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        timeout
      });

      return response.choices[0].message.content;

    } catch (error) {
      // Determine if retryable
      const isRetryable = this.isRetryableError(error);

      if (isRetryable && retryCount < maxRetries) {
        console.log(`[LLM] Retryable error, attempt ${retryCount + 1}/${maxRetries + 1}`);
        await this.sleep(retryDelay);
        return this.callLLM(prompt, retryCount + 1);
      }

      // Not retryable or retries exhausted
      throw new LLMGenerationError(error.message, error.code);
    }
  }

  isRetryableError(error) {
    // Retryable: timeout, 5xx, 429 (rate limit)
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') return true;
    if (error.status >= 500) return true;
    if (error.status === 429) return true;
    return false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Custom error class
class LLMGenerationError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'LLMGenerationError';
    this.code = code;
    this.userFriendly = this.getUserFriendlyMessage(code);
  }

  getUserFriendlyMessage(code) {
    const messages = {
      'ETIMEDOUT': 'AI service is taking too long. Please try again or create KRs manually.',
      'ECONNRESET': 'Connection to AI service was lost. Please try again.',
      '429': 'AI service is busy. Please wait a moment and try again.',
      '500': 'AI service encountered an error. Please try again later.',
      'default': 'Unable to generate KRs automatically. You can create them manually.'
    };
    return messages[code] || messages.default;
  }
}
```

### Response Validation

```javascript
// server/services/LLMOrchestrationService.js (validation portion)

parseAndValidate(llmResponse) {
  let parsed;

  // Try to parse JSON
  try {
    // Extract JSON from response (may have markdown wrapper)
    const jsonMatch = llmResponse.match(/```json\n?([\s\S]*?)\n?```/) ||
                      llmResponse.match(/\{[\s\S]*\}/);

    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : llmResponse;
    parsed = JSON.parse(jsonStr);

  } catch (e) {
    // JSON parsing failed
    console.error('[LLM] Invalid JSON response:', e.message);
    throw new LLMValidationError('Invalid response format', 'INVALID_JSON');
  }

  // Validate structure
  if (!parsed.key_results || !Array.isArray(parsed.key_results)) {
    throw new LLMValidationError('Missing key_results array', 'MISSING_KRS');
  }

  if (parsed.key_results.length === 0) {
    throw new LLMValidationError('Empty key_results array', 'EMPTY_KRS');
  }

  // Validate each KR has required fields
  const requiredFields = ['metric', 'target', 'measurement_method'];
  const validKRs = [];

  for (const kr of parsed.key_results) {
    const missingFields = requiredFields.filter(f => !kr[f]);

    if (missingFields.length === 0) {
      validKRs.push(kr);
    } else {
      console.warn(`[LLM] KR missing fields: ${missingFields.join(', ')}`);
      // Still include partial KR, let consultant complete it
      validKRs.push({ ...kr, _incomplete: true });
    }
  }

  return {
    key_results: validKRs,
    guidance: parsed.guidance || {},
    realistic_timeline: parsed.realistic_timeline || {},
    _validation: {
      total_krs: parsed.key_results.length,
      valid_krs: validKRs.filter(kr => !kr._incomplete).length,
      incomplete_krs: validKRs.filter(kr => kr._incomplete).length
    }
  };
}
```

---

## Cost & Performance

### LLM Cost Model

**Token Usage Per Request**:
```
Input (prompt + context):  ~1,500-2,000 tokens
Output (KRs + guidance):   ~1,000-1,500 tokens
Total per generation:      ~3,000-3,500 tokens
```

**Cost Projections**:

| Phase | Users | Objectives/Month | Cost/Request | Monthly Cost |
|-------|-------|------------------|--------------|--------------|
| **Beta** | 10 consultants | 50 | $0.04 | **$2** |
| **Launch** | 50 consultants | 250 | $0.04 | **$10** |
| **Scale** | 200 consultants | 2,000 | $0.04 | **$80** |

**Cost is negligible** - even at scale, LLM costs are <$100/month.

### Model Selection Strategy

| Phase | Model | Cost/1K Tokens | Rationale |
|-------|-------|----------------|-----------|
| **Beta** | GPT-4 Turbo | $0.01 input / $0.03 output | Quality critical for first impressions |
| **Post-beta** | A/B Test GPT-3.5 Turbo | $0.0005 / $0.0015 | 70% cheaper, test quality impact |
| **Future** | Fine-tuned model | Variable | If we have enough training data |

### Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Context Assembly** | < 500ms | Parallel DB queries, cache hits |
| **LLM Response** | < 15s median, < 30s p95 | OpenAI API latency |
| **Total E2E** | < 20s median, < 35s p95 | Click "Generate" to KRs displayed |
| **Cache Hit Rate** | > 20% | When consultant creates multiple objectives |
| **Success Rate** | > 95% | Successful generation / total attempts |
| **Retry Rate** | < 10% | Requests requiring retry / total |

### Optimization Strategies

**1. Context Caching** (Implemented):
- Cache assembled context for 5 minutes per company
- Reduces DB queries when creating multiple objectives
- Expected cache hit rate: 20-30%

**2. Prompt Compression** (Future):
- Remove verbose examples for production
- Reduce prompt from 2,000 → 1,200 tokens (40% savings)
- Apply when costs become significant

**3. Parallel Fetching** (Implemented):
- Fetch all context providers in parallel
- Target: < 500ms for full context assembly

**4. Response Streaming** (Future):
- Stream KRs as they're generated
- Better UX for slow responses
- Implement post-beta

### Monitoring Dashboard

Track these metrics in production:

```javascript
// server/services/LLMOrchestrationService.js (logging portion)

async logGeneration(objectiveData, context, result, timing) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    company_id: objectiveData.company_id,
    objective_id: objectiveData._id,

    // Performance
    context_assembly_ms: timing.contextAssembly,
    llm_response_ms: timing.llmResponse,
    total_ms: timing.total,

    // Quality
    context_completeness: context._metadata.overall_completeness,
    krs_generated: result.key_results.length,
    krs_incomplete: result._validation?.incomplete_krs || 0,

    // Cost
    tokens_input: result._usage?.prompt_tokens,
    tokens_output: result._usage?.completion_tokens,
    estimated_cost: this.calculateCost(result._usage),

    // Status
    success: true,
    retry_count: timing.retryCount || 0,
    error: null
  };

  // Log to database for analytics
  await LLMGenerationLog.create(logEntry);

  // Also log to console for debugging
  console.log(`[LLM] Generation complete: ${logEntry.total_ms}ms, ${logEntry.krs_generated} KRs`);
}
```

---

## Implementation Guide

### Sprint 22 Implementation Plan

| Story | Points | Description | Dependencies |
|-------|--------|-------------|--------------|
| D1 | 2 | Create PromptService.js | None |
| D2 | 3 | Create LLMOrchestrationService.js | D1, Orchestrator |
| D3 | 2 | Create VerticalInsightsService.js | None |
| D4 | 3 | Implement error handling & retry | D2 |
| D5 | 2 | Add context caching | D2 |
| D6 | 3 | Create API endpoint for KR generation | D2, D3, D4 |
| D7 | 2 | Add logging and monitoring | D6 |
| **Total** | **17** | Epic D: LLM Orchestration | |

### File Creation Order

```
Day 1:
  server/prompts/objective_kr_generation/v1.0.md (copy existing)
  server/prompts/objective_kr_generation/active.json
  server/services/PromptService.js

Day 2:
  server/knowledge/vertical_insights.js
  server/services/VerticalInsightsService.js

Day 3-4:
  server/services/LLMOrchestrationService.js (main service)
  server/services/errors/LLMGenerationError.js
  server/services/errors/LLMValidationError.js

Day 5:
  server/routes/llm-orchestration.js (API endpoint)
  Integration testing

Day 6-7:
  Logging setup
  Performance testing
  Documentation
```

### Testing Checklist

**Unit Tests**:
- [ ] PromptService loads and renders templates
- [ ] VerticalInsightsService matches industries correctly
- [ ] LLMOrchestrationService assembles context
- [ ] Error handling catches and classifies errors
- [ ] Retry logic retries appropriate errors

**Integration Tests**:
- [ ] Full flow: objective → context → LLM → KRs
- [ ] Graceful degradation with missing company profile
- [ ] Graceful degradation with missing assessment
- [ ] Timeout handling and retry
- [ ] Unknown industry falls back to general

**Manual Testing**:
- [ ] Create objective for Legacy Succession company
- [ ] Create objective for Professional Services company
- [ ] Create objective for unknown industry
- [ ] Simulate timeout (mock slow LLM)
- [ ] Simulate API error (mock 500 response)

---

## API Reference

### POST /api/llm/generate-krs

Generate Key Results for an objective.

**Request**:
```json
{
  "objective_id": "507f1f77bcf86cd799439011",
  "title": "Establish Weekly Leadership Sync",
  "ssi_impact": {
    "area": "speed",
    "sub_dimension": "decisions"
  },
  "behavior_ids": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "company_id": "507f1f77bcf86cd799439010"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "key_results": [
      {
        "metric": "Decision-to-action cycle time",
        "target": "< 48 hours",
        "current": "5-7 days average",
        "measurement_frequency": "weekly",
        "measurement_method": "Track decisions in meeting notes",
        "kr_type": "time_savings",
        "ssi_connection": "Improves Speed → Decisions",
        "behavior_connection": "Accountability: Owners assigned, follow-through tracked"
      }
    ],
    "guidance": {
      "implementation_philosophy": "...",
      "coaching_tips": ["...", "..."]
    },
    "realistic_timeline": {
      "week_1_4": "...",
      "month_2_3": "...",
      "quarter_end": "..."
    }
  },
  "meta": {
    "context_completeness": 100,
    "llm_response_time_ms": 12500,
    "total_time_ms": 13200
  }
}
```

**Response (Partial Success - Incomplete Profile)**:
```json
{
  "success": true,
  "data": { ... },
  "warnings": [
    {
      "code": "INCOMPLETE_PROFILE",
      "message": "Company profile is incomplete. KRs may be less specific.",
      "action": {
        "label": "Complete Profile",
        "route": "/pages/company-profile.html?id=507f1f77bcf86cd799439010"
      }
    }
  ],
  "meta": {
    "context_completeness": 65
  }
}
```

**Response (Error - Timeout)**:
```json
{
  "success": false,
  "error": {
    "code": "LLM_TIMEOUT",
    "message": "AI service is taking too long. Please try again or create KRs manually.",
    "retry_count": 1
  },
  "fallback": {
    "action": "MANUAL_ENTRY",
    "route": "/pages/objectives.html?id=507f1f77bcf86cd799439011&step=2&manual=true"
  }
}
```

---

## Related Documents

**Input Documents**:
- [objective_kr_generation_prompt.md](./AI-PROMPTS/objective_kr_generation_prompt.md) - Prompt template
- [ORCHESTRATOR_ARCHITECTURE.md](./ORCHESTRATOR_ARCHITECTURE.md) - Base orchestrator design
- [COMPANY_PROFILE_STRATEGY.md](../1-PRODUCT/features/COMPANY_PROFILE_STRATEGY.md) - Company profile requirements

**Sprint 22 Documents**:
- [BETA_FINAL_STRATEGY_2026.md](../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) - Sprint strategy
- [SESSION_166_LLM_ORCHESTRATION.md](./3-DELIVERY/1-SPRINTS/SPRINT-22-Beta_Final/session-plans/SESSION_166_LLM_ORCHESTRATION.md) - Session plan

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-20 | Session #166 | Initial strategy document |

---

**Document Owner**: Engineering Team
**Created**: April 20, 2026 (Session #166)
**Status**: Active - Ready for Implementation (Sprint 22)
