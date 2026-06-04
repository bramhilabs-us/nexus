# Epic K: Business Metrics Profile

**Epic**: K
**Sprint**: 10
**Story Points**: 10 pts (Focused on Financial Services MVP)
**Priority**: P1
**Status**: PLANNING

**Note**: This is a simplified version focused on Financial Services baseline metrics. Full specification at 30 pts available in version history if needed.

---

## Audit Fixes Applied (January 9, 2026)

| Issue | Resolution | Reference |
|-------|------------|-----------|
| Industry enum mismatch | MUST use shared `server/config/industries.js` | SPRINT-10-11-AUDIT-REPORT.md |

**CRITICAL**: This epic MUST use the shared industry configuration at `server/config/industries.js`.
The `industry-metrics.json` structure MUST align with the industries defined in the shared config.

---

## Executive Summary

This epic enhances the Company Profile page with industry-specific business metrics collection to improve AI-generated OKR quality. Using a **Progressive Disclosure** pattern with **Configuration-Driven Architecture**, the system dynamically presents relevant metrics based on industry and subtype selection.

**Initial Focus**: Financial Services → Legacy & Succession Planning (first client segment)

**Design Principles**:
1. **No Hardcoding** - All metrics defined in configuration
2. **Scalable Architecture** - Easy to add new industries/subtypes
3. **Clean UX** - Progressive disclosure, circular progress, visual benchmarks
4. **AI Integration** - Metrics flow directly into OKR generation prompts

**Simplification Decision (Jan 9, 2026):**
- ✅ Use **virtual property** for `profile_completion` instead of stored field
- Removes storage overhead, eliminates stale data risk, no pre-save hook changes
- Reduces complexity: 34 pts → **30 pts** (-4 pts saved)

---

## Problem Statement

### Current State
- Company Profile captures basic info + business context (mission, vision, etc.)
- OKR generation uses generic company context
- No industry-specific metrics to inform AI recommendations
- Financial Services clients (Legacy/Succession) lack targeted OKRs

### Audit Findings
| Issue | Impact | Resolution |
|-------|--------|------------|
| Generic AI context | Low OKR relevance | Add business metrics to prompt |
| No industry subtype | Can't target specific segments | Add `industry_subtype` field |
| No completion tracking | Users don't know profile completeness | Add progress indicator |

### Business Value
- **10x Better OKRs**: AI can generate succession-specific objectives like "Increase next-gen client engagement from 32% to 55%"
- **Faster Onboarding**: Clear profile completion path
- **Client Differentiation**: Industry-specific experience for Financial Services

---

## Solution Architecture

### Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    BUSINESS METRICS DATA FLOW                               │
└────────────────────────────────────────────────────────────────────────────┘

 [1] CONFIGURATION                    [2] USER ENTRY
 ────────────────────                 ────────────────────
 ┌──────────────────────┐             ┌──────────────────────┐
 │ industry-metrics.json │             │ company-profile.html  │
 │                      │             │                      │
 │ financial_services:  │  fetched    │ ┌──────────────────┐ │
 │   subtypes:          │────via────▶ │ │ Industry: [▼]    │ │
 │     legacy_succession│    API      │ │ Financial Svc    │ │
 │       metrics:       │             │ └──────────────────┘ │
 │         - clients    │             │         │            │
 │         - tenure     │             │         ▼ reveals    │
 │         - succession │             │ ┌──────────────────┐ │
 │                      │             │ │ Subtype: [▼]     │ │
 └──────────────────────┘             │ │ Legacy/Succession│ │
                                      │ └──────────────────┘ │
                                      │         │            │
                                      │         ▼ reveals    │
                                      │ ┌──────────────────┐ │
                                      │ │ Business Metrics │ │
                                      │ │ ┌──────────────┐ │ │
                                      │ │ │Client Count:│ │ │
                                      │ │ │ [245]       │ │ │
                                      │ │ │ ▓▓▓▓▓▓░░ 75%│ │ │
                                      │ │ └──────────────┘ │ │
                                      │ └──────────────────┘ │
                                      └──────────┬───────────┘
                                                 │
 [3] STORAGE                                     │ PUT /api/companies/:id
 ────────────────────                            ▼
 ┌──────────────────────┐             ┌──────────────────────┐
 │ Company Model        │◀────────────│ companies.js routes  │
 │ (MongoDB)            │   save      │                      │
 │                      │             │ - Validates metrics  │
 │ industry_subtype:    │             │ - Calculates profile │
 │   "legacy_succession"│             │   completion %       │
 │                      │             │ - Saves to DB        │
 │ business_metrics:    │             └──────────────────────┘
 │   client_count: 245  │
 │   avg_tenure: 12     │
 │   succession_active: 8│
 │                      │
 │ (profile_completion  │
 │  via virtual prop)   │
 └──────────┬───────────┘
            │
            │ fetched by AIContextService
            ▼
 [4] AI INTEGRATION
 ────────────────────
 ┌──────────────────────────────────────────────────────────────┐
 │ ai-okr.js - OKR Generation Prompt                            │
 │                                                              │
 │ COMPANY CONTEXT:                                             │
 │ - Industry: Financial Services                               │
 │ - Subtype: Legacy & Succession Planning          ← NEW      │
 │                                                              │
 │ BUSINESS METRICS:                                 ← NEW      │
 │ - Total Client Families: 245 (vs benchmark 150)             │
 │ - Avg Client Tenure: 12 years (above 75th percentile)       │
 │ - Active Succession Plans: 8                                 │
 │ - Next-Gen Engagement: 32% (below benchmark 40%)            │
 │                                                              │
 │ AI INTERPRETATION:                                           │
 │ "Client count is strong, but next-gen engagement is below   │
 │  benchmark. Create objective: 'Strengthen intergenerational │
 │  client relationships through structured family meetings'"   │
 └──────────────────────────────────────────────────────────────┘
```

---

## Technical Specifications

### 1. Database Schema Changes

#### 1.1 Company Model Additions (`server/models/Company.js`)

```javascript
// ============================================================
// ADD AFTER LINE 24 (after industry field definition)
// ============================================================

/**
 * Industry Subtype - Sprint 10 Epic K
 * Specific segment within the selected industry
 * Examples: 'legacy_succession', 'wealth_management', 'insurance_brokerage'
 */
industry_subtype: {
  type: String,
  trim: true,
  default: null,
  index: true,
  description: 'Specific subtype within industry for targeted metrics'
},

// ============================================================
// ADD AFTER LINE 92 (after business_context field)
// ============================================================

/**
 * Business Metrics - Sprint 10 Epic K
 * Industry-specific metrics for AI context enhancement
 * Uses Map type for flexible schema across industries
 */
business_metrics: {
  type: Map,
  of: mongoose.Schema.Types.Mixed,
  default: new Map(),
  description: 'Industry-specific business metrics (key-value pairs)'
}
```

**Virtual Property for Profile Completion** (simplified approach - no stored field):

```javascript
// Add after line 306 (after existing virtuals)
// Sprint 10 Epic K: Profile completion calculated on-the-fly
companySchema.virtual('profile_completion').get(function() {
  let completed = 0;
  const total = 3; // 3 sections

  // Basic info: name + employee_count required
  const basicComplete = !!(this.name && this.employee_count);
  if (basicComplete) completed++;

  // Business context: at least 3 fields filled
  const contextFields = ['description', 'mission', 'vision', 'target_market', 'values'];
  const filledContext = contextFields.filter(f =>
    this.business_context?.[f] &&
    (Array.isArray(this.business_context[f]) ? this.business_context[f].length > 0 : true)
  ).length;
  const contextComplete = filledContext >= 3;
  if (contextComplete) completed++;

  // Industry metrics: has subtype + at least 3 metrics
  const metricsSize = this.business_metrics?.size || 0;
  const metricsComplete = !!(this.industry_subtype && metricsSize >= 3);
  if (metricsComplete) completed++;

  return {
    percentage: Math.round((completed / total) * 100),
    sections: {
      basic_info: basicComplete,
      business_context: contextComplete,
      industry_metrics: metricsComplete
    }
  };
});
```

**Benefits of Virtual Property Approach:**
- No additional storage overhead
- Always reflects current state (no stale data)
- No pre-save hook modification needed
- Simpler schema, cleaner codebase

---

### 2. Configuration System

#### 2.1 Industry Metrics Configuration (`server/config/industry-metrics.json`)

```json
{
  "_version": "1.0.0",
  "_description": "Industry-specific metrics configuration for AI-powered OKR generation",

  "financial_services": {
    "label": "Financial Services",
    "icon": "chart-line",
    "subtypes": {
      "legacy_succession": {
        "label": "Legacy & Succession Planning",
        "description": "Wealth transfer and business succession advisory services",
        "icon": "users-cog",
        "metric_groups": {
          "client_portfolio": {
            "label": "Client Portfolio",
            "description": "Client base composition and characteristics",
            "display_order": 1,
            "fields": [
              {
                "key": "total_client_families",
                "label": "Total Client Families",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 150",
                "help_text": "Number of family units you serve",
                "benchmark": {
                  "p25": 50,
                  "p50": 150,
                  "p75": 300,
                  "unit": "families"
                },
                "ai_context": "Client base size - larger indicates more established practice"
              },
              {
                "key": "total_aum",
                "label": "Total Assets Under Management",
                "type": "currency",
                "required": false,
                "placeholder": "e.g., 500000000",
                "help_text": "Total AUM across all clients",
                "benchmark": {
                  "p25": 100000000,
                  "p50": 500000000,
                  "p75": 2000000000,
                  "unit": "USD"
                },
                "ai_context": "AUM indicates practice scale and complexity"
              },
              {
                "key": "avg_client_tenure_years",
                "label": "Average Client Tenure (Years)",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 12",
                "help_text": "Average years clients have been with your firm",
                "benchmark": {
                  "p25": 5,
                  "p50": 10,
                  "p75": 15,
                  "unit": "years"
                },
                "ai_context": "High tenure suggests strong retention but may indicate aging client base"
              },
              {
                "key": "clients_over_65_percent",
                "label": "Clients Over 65 (%)",
                "type": "percentage",
                "required": false,
                "placeholder": "e.g., 45",
                "help_text": "Percentage of primary clients over age 65",
                "benchmark": {
                  "p25": 30,
                  "p50": 45,
                  "p75": 60,
                  "unit": "%"
                },
                "ai_context": "Higher percentage indicates urgency for succession planning"
              }
            ]
          },
          "succession_readiness": {
            "label": "Succession Readiness",
            "description": "Status of active succession and wealth transfer planning",
            "display_order": 2,
            "fields": [
              {
                "key": "active_succession_plans",
                "label": "Active Succession Plans",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 25",
                "help_text": "Number of clients with active succession plans",
                "ai_context": "Indicates service depth in core offering"
              },
              {
                "key": "succession_plan_rate_percent",
                "label": "Succession Plan Rate (%)",
                "type": "percentage",
                "required": false,
                "placeholder": "e.g., 35",
                "help_text": "% of eligible clients with succession plans",
                "benchmark": {
                  "p25": 20,
                  "p50": 40,
                  "p75": 60,
                  "unit": "%"
                },
                "ai_context": "Low rate suggests opportunity for service expansion"
              },
              {
                "key": "avg_plan_review_months",
                "label": "Avg Plan Review Cycle (Months)",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 12",
                "help_text": "Average months between plan reviews",
                "benchmark": {
                  "p25": 18,
                  "p50": 12,
                  "p75": 6,
                  "unit": "months",
                  "inverse": true
                },
                "ai_context": "Shorter cycles indicate more proactive service"
              }
            ]
          },
          "next_gen_engagement": {
            "label": "Next-Generation Engagement",
            "description": "Engagement with heirs and next generation of wealth holders",
            "display_order": 3,
            "fields": [
              {
                "key": "next_gen_engagement_percent",
                "label": "Next-Gen Engagement Rate (%)",
                "type": "percentage",
                "required": false,
                "placeholder": "e.g., 35",
                "help_text": "% of client families where you've engaged the next generation",
                "benchmark": {
                  "p25": 20,
                  "p50": 40,
                  "p75": 60,
                  "unit": "%"
                },
                "ai_context": "Critical for retention during wealth transfer - low rate is risk"
              },
              {
                "key": "family_meetings_annual",
                "label": "Family Meetings per Year",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 24",
                "help_text": "Total multi-generational family meetings conducted annually",
                "benchmark": {
                  "p25": 10,
                  "p50": 25,
                  "p75": 50,
                  "unit": "meetings"
                },
                "ai_context": "Indicator of structured intergenerational engagement"
              },
              {
                "key": "next_gen_direct_relationships",
                "label": "Direct Next-Gen Relationships",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 45",
                "help_text": "Number of next-gen clients with direct advisory relationship",
                "ai_context": "Shows depth of relationship beyond primary client"
              }
            ]
          },
          "operational_metrics": {
            "label": "Operational Metrics",
            "description": "Business operations and team capacity",
            "display_order": 4,
            "fields": [
              {
                "key": "advisors_count",
                "label": "Number of Advisors",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 8",
                "help_text": "Total client-facing advisors",
                "ai_context": "Team capacity for client service"
              },
              {
                "key": "clients_per_advisor",
                "label": "Clients per Advisor",
                "type": "number",
                "required": false,
                "placeholder": "e.g., 50",
                "help_text": "Average client families per advisor",
                "benchmark": {
                  "p25": 30,
                  "p50": 50,
                  "p75": 75,
                  "unit": "clients"
                },
                "ai_context": "Higher ratio may indicate capacity constraints"
              },
              {
                "key": "annual_client_attrition_percent",
                "label": "Annual Client Attrition (%)",
                "type": "percentage",
                "required": false,
                "placeholder": "e.g., 5",
                "help_text": "% of clients lost annually (excluding death/transfer)",
                "benchmark": {
                  "p25": 8,
                  "p50": 5,
                  "p75": 2,
                  "unit": "%",
                  "inverse": true
                },
                "ai_context": "Low attrition is positive - high indicates retention issues"
              }
            ]
          }
        }
      },
      "wealth_management": {
        "label": "Wealth Management (General)",
        "description": "Coming soon - General wealth management advisory",
        "icon": "wallet",
        "coming_soon": true
      },
      "insurance_brokerage": {
        "label": "Insurance Brokerage",
        "description": "Coming soon - Insurance and risk management",
        "icon": "shield-check",
        "coming_soon": true
      }
    }
  },

  "consulting": {
    "label": "Consulting",
    "icon": "briefcase",
    "subtypes": {
      "general": {
        "label": "General Consulting",
        "description": "Coming soon",
        "coming_soon": true
      }
    }
  },

  "professional_services": {
    "label": "Professional Services",
    "icon": "user-tie",
    "subtypes": {
      "general": {
        "label": "General Professional Services",
        "description": "Coming soon",
        "coming_soon": true
      }
    }
  }
}
```

---

### 3. API Endpoints

#### 3.1 New Config Endpoint (`server/routes/config.js`)

```javascript
/**
 * Config Routes - Sprint 10 Epic K
 * Serves configuration data for dynamic UI rendering
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/authGuards');

// Load config once at startup
const industryMetricsPath = path.join(__dirname, '../config/industry-metrics.json');
let industryMetricsConfig = null;

try {
  industryMetricsConfig = JSON.parse(fs.readFileSync(industryMetricsPath, 'utf8'));
} catch (error) {
  console.error('Failed to load industry-metrics.json:', error.message);
  industryMetricsConfig = {};
}

/**
 * GET /api/config/industry-metrics
 * Returns all industry configurations (high-level)
 */
router.get('/industry-metrics', authenticateToken, (req, res) => {
  try {
    // Return high-level structure (without full metric details)
    const industries = Object.entries(industryMetricsConfig)
      .filter(([key]) => !key.startsWith('_')) // Skip metadata fields
      .map(([key, value]) => ({
        key,
        label: value.label,
        icon: value.icon,
        subtypes: Object.entries(value.subtypes || {}).map(([subKey, subValue]) => ({
          key: subKey,
          label: subValue.label,
          description: subValue.description,
          icon: subValue.icon,
          coming_soon: subValue.coming_soon || false
        }))
      }));

    res.json({
      success: true,
      data: industries,
      version: industryMetricsConfig._version
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load industry configuration'
    });
  }
});

/**
 * GET /api/config/industry-metrics/:industry/:subtype
 * Returns full metric configuration for specific industry/subtype
 */
router.get('/industry-metrics/:industry/:subtype', authenticateToken, (req, res) => {
  try {
    const { industry, subtype } = req.params;

    const industryConfig = industryMetricsConfig[industry];
    if (!industryConfig) {
      return res.status(404).json({
        success: false,
        error: `Industry '${industry}' not found`
      });
    }

    const subtypeConfig = industryConfig.subtypes?.[subtype];
    if (!subtypeConfig) {
      return res.status(404).json({
        success: false,
        error: `Subtype '${subtype}' not found in industry '${industry}'`
      });
    }

    if (subtypeConfig.coming_soon) {
      return res.json({
        success: true,
        data: {
          industry: { key: industry, label: industryConfig.label },
          subtype: { key: subtype, label: subtypeConfig.label },
          coming_soon: true,
          message: 'This industry subtype is coming soon'
        }
      });
    }

    res.json({
      success: true,
      data: {
        industry: { key: industry, label: industryConfig.label, icon: industryConfig.icon },
        subtype: {
          key: subtype,
          label: subtypeConfig.label,
          description: subtypeConfig.description,
          icon: subtypeConfig.icon
        },
        metric_groups: subtypeConfig.metric_groups,
        coming_soon: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load subtype configuration'
    });
  }
});

module.exports = router;
```

#### 3.2 Modified Company Routes (`server/routes/companies.js`)

Add to `PUT /api/companies/:id` (around line 466):

```javascript
// Sprint 10 Epic K: Handle industry_subtype
if (industry_subtype !== undefined) {
  company.industry_subtype = industry_subtype;
}

// Sprint 10 Epic K: Handle business_metrics (Map type)
if (business_metrics && typeof business_metrics === 'object') {
  // Clear existing metrics if subtype changed
  if (industry_subtype && industry_subtype !== company.industry_subtype) {
    company.business_metrics = new Map();
  }

  // Merge new metrics
  Object.entries(business_metrics).forEach(([key, value]) => {
    if (value === null || value === '') {
      company.business_metrics.delete(key);
    } else {
      company.business_metrics.set(key, value);
    }
  });
}
```

#### 3.3 New Dedicated Metrics Endpoint

```javascript
/**
 * PUT /api/companies/:id/metrics
 * Dedicated endpoint for updating business metrics (auto-save support)
 */
router.put('/:id/metrics', authenticateToken, requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE'), async (req, res) => {
  try {
    const companyId = req.params.id;
    const { metrics, industry_subtype } = req.body;

    // Authorization check (same as main PUT)
    const userRole = req.user.role;
    if (userRole !== 'CONSULTANT') {
      if (!req.user.company_id || req.user.company_id.toString() !== companyId) {
        return res.status(403).json({
          success: false,
          error: 'ACCESS_DENIED',
          message: 'You can only update your own company'
        });
      }
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update subtype if provided
    if (industry_subtype) {
      company.industry_subtype = industry_subtype;
    }

    // Update metrics
    if (metrics && typeof metrics === 'object') {
      Object.entries(metrics).forEach(([key, value]) => {
        if (value === null || value === '' || value === undefined) {
          company.business_metrics.delete(key);
        } else {
          company.business_metrics.set(key, value);
        }
      });
    }

    await company.save();

    // Virtual property calculates completion on-the-fly
    res.json({
      success: true,
      message: 'Metrics updated',
      data: {
        industry_subtype: company.industry_subtype,
        business_metrics: Object.fromEntries(company.business_metrics),
        profile_completion: company.profile_completion // Accessed via virtual
      }
    });

  } catch (error) {
    console.error('Error updating company metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update metrics',
      error: error.message
    });
  }
});
```

---

### 4. AI Integration Enhancement

#### 4.1 AIContextService Updates (`server/services/AIContextService.js`)

Modify `getCompanyProfile()` (line 126-141):

```javascript
async getCompanyProfile(companyId) {
  try {
    const company = await Company.findById(companyId)
      .select('name industry industry_subtype employee_count createdAt okr_generation business_context business_metrics profile_completion')
      .lean();

    if (!company) {
      throw new Error('Company not found');
    }

    // Sprint 10 Epic K: Convert Map to object for AI context
    if (company.business_metrics instanceof Map) {
      company.business_metrics = Object.fromEntries(company.business_metrics);
    }

    return company;
  } catch (error) {
    logger.error('[AIContextService] Error fetching company:', error);
    throw error;
  }
}
```

Modify context building (line 46-54) to include new fields:

```javascript
company: {
  id: company._id.toString(),
  name: company.name,
  industry: company.industry || 'General Business',
  industry_subtype: company.industry_subtype || null,  // NEW
  employee_count: company.employee_count || activeUsers.length,
  size_category: this.categorizeCompanySize(company.employee_count || activeUsers.length),
  business_metrics: company.business_metrics || {},     // NEW
  profile_completion: company.profile_completion?.percentage || 0,  // NEW
  created_at: company.createdAt
},
```

#### 4.2 OKR Prompt Enhancement (`server/routes/ai-okr.js`)

Add after line 1563 (Company Context section):

```javascript
// Sprint 10 Epic K: Industry subtype
- Industry Subtype: ${company.industry_subtype ? formatSubtypeLabel(company.industry_subtype) : 'General'}
```

Add new section after BUSINESS PROFILE (around line 1575):

```javascript
${hasBusinessMetrics(company) ? `
BUSINESS METRICS (Industry-Specific Data):
${formatMetricsForPrompt(company.business_metrics, company.industry, company.industry_subtype)}

METRICS INSIGHTS FOR OKR GENERATION:
${generateMetricsInsights(company.business_metrics, company.industry_subtype)}
` : ''}
```

Add helper functions:

```javascript
/**
 * Check if company has meaningful business metrics
 */
function hasBusinessMetrics(company) {
  return company.business_metrics &&
         typeof company.business_metrics === 'object' &&
         Object.keys(company.business_metrics).length >= 3;
}

/**
 * Format metrics for AI prompt consumption
 */
function formatMetricsForPrompt(metrics, industry, subtype) {
  if (!metrics || Object.keys(metrics).length === 0) return '';

  const lines = [];

  // Load config for labels (cached)
  const config = getIndustryMetricsConfig();
  const subtypeConfig = config?.[industry]?.subtypes?.[subtype];

  if (subtypeConfig?.metric_groups) {
    // Format with labels from config
    Object.entries(subtypeConfig.metric_groups).forEach(([groupKey, group]) => {
      const groupMetrics = group.fields
        .filter(field => metrics[field.key] !== undefined)
        .map(field => `  - ${field.label}: ${formatMetricValue(metrics[field.key], field.type)}`)
        .join('\n');

      if (groupMetrics) {
        lines.push(`${group.label}:`);
        lines.push(groupMetrics);
      }
    });
  } else {
    // Fallback: raw key-value
    Object.entries(metrics).forEach(([key, value]) => {
      lines.push(`- ${key.replace(/_/g, ' ')}: ${value}`);
    });
  }

  return lines.join('\n');
}

/**
 * Generate AI-digestible insights from metrics
 */
function generateMetricsInsights(metrics, subtype) {
  const insights = [];

  // Legacy/Succession specific insights
  if (subtype === 'legacy_succession') {
    // Next-gen engagement insight
    const nextGenRate = metrics.next_gen_engagement_percent;
    if (nextGenRate !== undefined) {
      if (nextGenRate < 30) {
        insights.push(`⚠️ CRITICAL: Next-gen engagement at ${nextGenRate}% is below industry benchmark (40%). This is a key retention risk during wealth transfer. Prioritize objectives around intergenerational relationship building.`);
      } else if (nextGenRate < 50) {
        insights.push(`📊 Next-gen engagement at ${nextGenRate}% - room for improvement. Consider objectives around structured family meeting programs.`);
      }
    }

    // Client age insight
    const over65Pct = metrics.clients_over_65_percent;
    if (over65Pct && over65Pct > 50) {
      insights.push(`⚠️ ${over65Pct}% of clients are over 65 - succession planning urgency is HIGH. Prioritize objectives around accelerating plan completion and next-gen onboarding.`);
    }

    // Succession plan coverage
    const planRate = metrics.succession_plan_rate_percent;
    if (planRate !== undefined && planRate < 40) {
      insights.push(`📊 Only ${planRate}% of eligible clients have succession plans. This represents significant service expansion opportunity.`);
    }

    // Capacity insight
    const clientsPerAdvisor = metrics.clients_per_advisor;
    if (clientsPerAdvisor && clientsPerAdvisor > 60) {
      insights.push(`⚠️ High client-to-advisor ratio (${clientsPerAdvisor}:1) may limit service depth. Consider capacity/hiring objectives.`);
    }
  }

  return insights.length > 0 ? insights.join('\n\n') : 'No specific insights - ensure metrics are populated for better OKR targeting.';
}
```

---

### 5. Frontend Implementation

#### 5.1 Company Profile Page Updates (`client/pages/company-profile.html`)

**New Section to Add** (after Business Context section, ~line 250):

```html
<!-- Section 3: Industry Metrics (Sprint 10 Epic K) -->
<div id="metrics-section" class="form-section bg-white border border-gray-200 rounded-xl p-6 hidden">
    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
            </svg>
            <h2 class="text-lg font-semibold text-gray-900">Business Metrics</h2>
        </div>
        <div class="flex items-center space-x-2">
            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Enhances AI OKRs</span>
            <span id="metrics-autosave-status" class="text-xs text-gray-400 hidden">
                <svg class="w-4 h-4 inline animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Saving...
            </span>
        </div>
    </div>

    <!-- Subtype Selection -->
    <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
        <select id="industrySubtype" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm">
            <option value="">Select your specialization...</option>
            <!-- Populated dynamically based on industry -->
        </select>
        <p class="text-xs text-gray-400 mt-1">Choose your specific focus area within the industry</p>
    </div>

    <!-- Metrics Container (dynamically populated) -->
    <div id="metrics-container" class="space-y-6">
        <!-- Metric groups will be rendered here -->
        <div class="text-center py-8 text-gray-400">
            <p>Select a specialization to see relevant metrics</p>
        </div>
    </div>
</div>
```

**Progress Indicator** (add to page header, ~line 60):

```html
<!-- Profile Completion Circle -->
<div class="flex items-center space-x-4">
    <div class="relative">
        <svg class="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" stroke-width="4"/>
            <circle id="progress-circle" cx="32" cy="32" r="28" fill="none" stroke="#8b5cf6" stroke-width="4"
                    stroke-dasharray="176" stroke-dashoffset="176" stroke-linecap="round"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
            <span id="progress-percent" class="text-lg font-bold text-gray-900">0%</span>
        </div>
    </div>
    <div>
        <p class="text-sm font-medium text-gray-700">Profile Complete</p>
        <p class="text-xs text-gray-400">Complete profile for better AI OKRs</p>
    </div>
</div>
```

#### 5.2 New JavaScript Module (`client/js/industry-metrics-renderer.js`)

```javascript
/**
 * Industry Metrics Renderer
 * Sprint 10 Epic K - Dynamic form generation for business metrics
 */

class IndustryMetricsRenderer {
  constructor(options = {}) {
    this.containerSelector = options.container || '#metrics-container';
    this.subtypeSelector = options.subtypeSelect || '#industrySubtype';
    this.industrySelector = options.industrySelect || '#companyIndustry';
    this.autosaveDelay = options.autosaveDelay || 2000;
    this.onSave = options.onSave || (() => {});

    this.config = null;
    this.currentMetrics = {};
    this.autosaveTimer = null;

    this.init();
  }

  async init() {
    await this.loadConfig();
    this.bindEvents();
  }

  async loadConfig() {
    try {
      const response = await fetch('/api/config/industry-metrics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('karvia_token')}` }
      });
      const data = await response.json();
      if (data.success) {
        this.config = data.data;
      }
    } catch (error) {
      console.error('Failed to load industry metrics config:', error);
    }
  }

  bindEvents() {
    // Industry change - update subtypes
    document.querySelector(this.industrySelector)?.addEventListener('change', (e) => {
      this.updateSubtypeOptions(e.target.value);
    });

    // Subtype change - load metrics form
    document.querySelector(this.subtypeSelector)?.addEventListener('change', async (e) => {
      await this.loadMetricsForm(e.target.value);
    });
  }

  updateSubtypeOptions(industry) {
    const subtypeSelect = document.querySelector(this.subtypeSelector);
    if (!subtypeSelect || !this.config) return;

    const industryConfig = this.config.find(i => i.key === industry);

    subtypeSelect.innerHTML = '<option value="">Select your specialization...</option>';

    if (industryConfig?.subtypes) {
      industryConfig.subtypes.forEach(subtype => {
        const option = document.createElement('option');
        option.value = subtype.key;
        option.textContent = subtype.label;
        option.disabled = subtype.coming_soon;
        if (subtype.coming_soon) {
          option.textContent += ' (Coming Soon)';
        }
        subtypeSelect.appendChild(option);
      });
    }

    // Show/hide metrics section based on industry support
    const metricsSection = document.getElementById('metrics-section');
    if (metricsSection) {
      metricsSection.classList.toggle('hidden', !industryConfig?.subtypes?.length);
    }
  }

  async loadMetricsForm(subtype) {
    const container = document.querySelector(this.containerSelector);
    const industry = document.querySelector(this.industrySelector)?.value;

    if (!container || !subtype || !industry) {
      container.innerHTML = '<div class="text-center py-8 text-gray-400"><p>Select a specialization to see relevant metrics</p></div>';
      return;
    }

    try {
      const response = await fetch(`/api/config/industry-metrics/${industry}/${subtype}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('karvia_token')}` }
      });
      const data = await response.json();

      if (data.success && !data.data.coming_soon) {
        this.renderMetricGroups(data.data.metric_groups, container);
      } else if (data.data.coming_soon) {
        container.innerHTML = `
          <div class="text-center py-8">
            <div class="text-gray-400 mb-2">
              <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
            <p class="text-gray-500 font-medium">Coming Soon</p>
            <p class="text-sm text-gray-400">Metrics for ${data.data.subtype.label} are being developed</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Failed to load metrics form:', error);
      container.innerHTML = '<div class="text-center py-8 text-red-400"><p>Failed to load metrics configuration</p></div>';
    }
  }

  renderMetricGroups(groups, container) {
    container.innerHTML = '';

    // Sort by display_order
    const sortedGroups = Object.entries(groups)
      .sort(([, a], [, b]) => (a.display_order || 0) - (b.display_order || 0));

    sortedGroups.forEach(([groupKey, group]) => {
      const groupEl = document.createElement('div');
      groupEl.className = 'border border-gray-100 rounded-lg p-4 bg-gray-50';
      groupEl.innerHTML = `
        <div class="flex items-center justify-between mb-3 cursor-pointer" onclick="this.parentElement.classList.toggle('collapsed')">
          <div>
            <h3 class="font-medium text-gray-900">${this.escapeHtml(group.label)}</h3>
            <p class="text-xs text-gray-500">${this.escapeHtml(group.description || '')}</p>
          </div>
          <svg class="w-5 h-5 text-gray-400 transform transition-transform group-collapse-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 group-fields">
          ${group.fields.map(field => this.renderField(field)).join('')}
        </div>
      `;
      container.appendChild(groupEl);
    });

    // Bind autosave to all inputs
    container.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('blur', () => this.scheduleAutosave());
      input.addEventListener('change', () => this.scheduleAutosave());
    });
  }

  renderField(field) {
    const value = this.currentMetrics[field.key] || '';
    const benchmarkHtml = field.benchmark ? this.renderBenchmark(field.benchmark, value) : '';

    return `
      <div class="metric-field">
        <label class="block text-sm font-medium text-gray-700 mb-1">${this.escapeHtml(field.label)}</label>
        <div class="relative">
          ${this.renderInput(field, value)}
          ${field.type === 'currency' ? '<span class="absolute left-3 top-2 text-gray-400">$</span>' : ''}
          ${field.type === 'percentage' ? '<span class="absolute right-3 top-2 text-gray-400">%</span>' : ''}
        </div>
        ${field.help_text ? `<p class="text-xs text-gray-400 mt-1">${this.escapeHtml(field.help_text)}</p>` : ''}
        ${benchmarkHtml}
      </div>
    `;
  }

  renderInput(field, value) {
    const baseClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm';
    const currencyClass = field.type === 'currency' ? 'pl-7' : '';
    const percentClass = field.type === 'percentage' ? 'pr-7' : '';

    return `
      <input
        type="number"
        id="metric_${field.key}"
        name="${field.key}"
        value="${value}"
        placeholder="${field.placeholder || ''}"
        class="${baseClass} ${currencyClass} ${percentClass}"
        ${field.required ? 'required' : ''}
      >
    `;
  }

  renderBenchmark(benchmark, currentValue) {
    if (!benchmark.p50) return '';

    // Calculate position (0-100) based on percentiles
    let position = 50; // Default to median
    const val = parseFloat(currentValue);

    if (!isNaN(val)) {
      if (benchmark.inverse) {
        // Lower is better (e.g., attrition rate)
        if (val <= benchmark.p75) position = 85;
        else if (val <= benchmark.p50) position = 50;
        else if (val <= benchmark.p25) position = 25;
        else position = 10;
      } else {
        // Higher is better
        if (val >= benchmark.p75) position = 85;
        else if (val >= benchmark.p50) position = 50;
        else if (val >= benchmark.p25) position = 25;
        else position = 10;
      }
    }

    return `
      <div class="mt-2">
        <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>25th</span>
          <span>50th</span>
          <span>75th</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full relative">
          <div class="absolute h-full bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full" style="width: 100%"></div>
          ${!isNaN(val) ? `<div class="absolute w-3 h-3 bg-purple-600 rounded-full border-2 border-white shadow transform -translate-y-1/2 top-1/2" style="left: ${position}%"></div>` : ''}
        </div>
        <p class="text-xs text-gray-400 mt-1">Industry benchmark: ${benchmark.p50} ${benchmark.unit || ''}</p>
      </div>
    `;
  }

  scheduleAutosave() {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }

    this.autosaveTimer = setTimeout(() => {
      this.saveMetrics();
    }, this.autosaveDelay);
  }

  async saveMetrics() {
    const statusEl = document.getElementById('metrics-autosave-status');
    if (statusEl) statusEl.classList.remove('hidden');

    // Collect all metric values
    const metrics = {};
    document.querySelectorAll('[id^="metric_"]').forEach(input => {
      const key = input.name;
      const value = input.value;
      if (value !== '') {
        metrics[key] = parseFloat(value) || value;
      }
    });

    const subtype = document.querySelector(this.subtypeSelector)?.value;

    try {
      await this.onSave({ metrics, industry_subtype: subtype });

      if (statusEl) {
        statusEl.innerHTML = `
          <svg class="w-4 h-4 inline text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          Saved
        `;
        setTimeout(() => statusEl.classList.add('hidden'), 2000);
      }
    } catch (error) {
      console.error('Autosave failed:', error);
      if (statusEl) {
        statusEl.innerHTML = '<span class="text-red-500">Save failed</span>';
      }
    }
  }

  setCurrentMetrics(metrics) {
    this.currentMetrics = metrics || {};
  }

  escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }
}

// Export for use
window.IndustryMetricsRenderer = IndustryMetricsRenderer;
```

---

## Simplified Stories (10 pts)

| Story | Points | Description |
|-------|--------|-------------|
| K1 | 3 | Add business_metrics field to Company model |
| K2 | 2 | Financial Services metrics config (AUM, retention, clients) |
| K3 | 3 | Profile UI: Business Metrics section |
| K4 | 2 | Autosave and validation |
| **Total** | **10** | |

**Deferred to Sprint 12**: AIContextService enhancement, OKR prompt integration, benchmark visualization

---

## Story Details

### Story K1: Company Model Schema Extensions (3 pts)
**As a** system
**I want** to store industry subtype and business metrics
**So that** AI can use this context for OKR generation

**Acceptance Criteria:**
- [ ] `industry_subtype` field added to Company model
- [ ] `business_metrics` Map field added to Company model
- [ ] `profile_completion` virtual property added (no stored field)

**Technical Details:**
- File: `server/models/Company.js`
- Lines to modify: ~25, ~95, ~310 (add virtual after existing virtuals)
- No pre-save hook modification needed

---

### Story K2: Industry Metrics Configuration (3 pts)
**As a** system administrator
**I want** industry metrics defined in configuration
**So that** the system can be extended without code changes

**Acceptance Criteria:**
- [ ] `server/config/industry-metrics.json` created
- [ ] Financial Services → Legacy/Succession fully defined
- [ ] 4 metric groups with 14 total fields
- [ ] Benchmarks included for applicable fields
- [ ] AI context hints in each field definition

**Technical Details:**
- Create: `server/config/industry-metrics.json`
- ~350 lines of JSON configuration

---

### Story K3: Config API Endpoints (3 pts)
**As a** frontend developer
**I want** API endpoints to fetch industry configurations
**So that** UI can render dynamic forms

**Acceptance Criteria:**
- [ ] `GET /api/config/industry-metrics` returns all industries
- [ ] `GET /api/config/industry-metrics/:industry/:subtype` returns full config
- [ ] Proper authentication required
- [ ] Handles "coming soon" subtypes gracefully
- [ ] Config cached at startup

**Technical Details:**
- Create: `server/routes/config.js`
- Register in: `server/index.js`

---

### Story K4: Company Metrics API (3 pts) ✨ SIMPLIFIED
**As a** company admin
**I want** API endpoints to save business metrics
**So that** profile data persists to database

**Acceptance Criteria:**
- [ ] `PUT /api/companies/:id` handles `industry_subtype` and `business_metrics`
- [ ] `PUT /api/companies/:id/metrics` dedicated endpoint for autosave
- [ ] Profile completion accessed via virtual property (no recalculation needed)
- [ ] Proper authorization (CONSULTANT, BUSINESS_OWNER, EXECUTIVE)
- [ ] Metrics returned in GET company response

**Technical Details:**
- Modify: `server/routes/companies.js`
- Add ~40 lines for metrics handling

---

### Story K5: AIContextService Enhancement (5 pts)
**As an** AI system
**I want** business metrics included in context
**So that** OKR generation is more targeted

**Acceptance Criteria:**
- [ ] `getCompanyProfile()` fetches new fields
- [ ] Metrics converted from Map to object for JSON
- [ ] Context builder includes `industry_subtype` and `business_metrics`
- [ ] Helper functions for prompt formatting
- [ ] Insights generation for low-performing metrics

**Technical Details:**
- Modify: `server/services/AIContextService.js`
- Modify: `server/routes/ai-okr.js` (prompt section)

---

### Story K6: OKR Prompt Enhancement (3 pts)
**As an** AI system
**I want** formatted metrics in OKR generation prompt
**So that** objectives address specific business challenges

**Acceptance Criteria:**
- [ ] Metrics section added to prompt template
- [ ] Metrics formatted with labels from config
- [ ] Insights generated highlighting risks/opportunities
- [ ] Graceful handling when no metrics present
- [ ] Legacy/Succession specific logic for key metrics

**Technical Details:**
- Modify: `server/routes/ai-okr.js` lines 1553-1656
- Add helper functions (~80 lines)

---

### Story K7: Profile Completion Indicator (3 pts)
**As a** company admin
**I want** to see profile completion percentage
**So that** I know what information to add

**Acceptance Criteria:**
- [ ] Circular SVG progress indicator
- [ ] Percentage updates dynamically
- [ ] Sections breakdown available (basic, context, metrics)
- [ ] Visual feedback on completion changes
- [ ] Tooltip explaining what improves completion

**Technical Details:**
- Modify: `client/pages/company-profile.html`
- Add ~30 lines HTML, ~20 lines JS

---

### Story K8: Industry Metrics Section UI (8 pts)
**As a** company admin
**I want** a dynamic metrics form based on my industry
**So that** I can provide relevant business context

**Acceptance Criteria:**
- [ ] Metrics section appears when industry supports it
- [ ] Subtype dropdown populated from config
- [ ] Metrics form renders dynamically based on subtype
- [ ] Collapsible metric groups
- [ ] Benchmark visualization bars
- [ ] Help text visible for each field
- [ ] Responsive two-column layout

**Technical Details:**
- Modify: `client/pages/company-profile.html`
- Create: `client/js/industry-metrics-renderer.js`
- ~400 lines JS, ~100 lines HTML

---

### Story K9: Autosave + Explicit Save (2 pts)
**As a** company admin
**I want** metrics to autosave on blur
**So that** I don't lose data accidentally

**Acceptance Criteria:**
- [ ] Autosave triggers 2 seconds after field blur
- [ ] Visual indicator shows save status
- [ ] Explicit "Save Changes" button still works
- [ ] Debounced to prevent excessive API calls
- [ ] Error handling with retry option

**Technical Details:**
- Part of `industry-metrics-renderer.js`
- ~50 lines additional JS

---

## Implementation Order

### Phase 1: Backend Foundation (Day 1-2) - 11 pts → 8 pts ✨ SIMPLIFIED
| Story | Points | Dependencies |
|-------|--------|--------------|
| K1: Schema Extensions | 2 | None |
| K2: Config File | 3 | None |
| K3: Config API | 3 | K2 |
| K4: Metrics API | 3 | K1 |

### Phase 2: AI Integration (Day 3) - 8 pts
| Story | Points | Dependencies |
|-------|--------|--------------|
| K5: AIContextService | 5 | K1, K4 |
| K6: Prompt Enhancement | 3 | K5 |

### Phase 3: Frontend (Day 4-5) - 13 pts
| Story | Points | Dependencies |
|-------|--------|--------------|
| K7: Progress Indicator | 3 | K4 |
| K8: Metrics UI | 8 | K3, K7 |
| K9: Autosave | 2 | K8 |

---

## Testing Requirements

### Unit Tests
- [ ] Company model with new fields
- [ ] Profile completion virtual property
- [ ] Metrics Map handling
- [ ] Config loading and parsing

### Integration Tests
- [ ] Metrics save/retrieve cycle
- [ ] Profile completion via virtual property
- [ ] Config API responses
- [ ] AI context with metrics

### E2E Tests
- [ ] Industry change → subtype options update
- [ ] Subtype selection → metrics form appears
- [ ] Metrics entry → benchmark visualization
- [ ] Autosave triggers on blur
- [ ] OKR generation uses metrics

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Profile completion rate | >60% (with metrics section) |
| Metrics fields filled (avg) | ≥8 of 14 |
| OKR relevance score (user rating) | >4.0/5.0 |
| Time to complete metrics section | <5 minutes |

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Config file grows unwieldy | Medium | Low | Plan modular structure from start |
| AI prompt too long | High | Medium | Truncate/summarize metrics in prompt |
| User confusion on benchmarks | Medium | Medium | Clear help text + tooltips |
| Autosave race conditions | Low | Low | Debounce + sequential saves |

---

## Related Documents

- [Company.js Model](../../../../server/models/Company.js)
- [AIContextService.js](../../../../server/services/AIContextService.js)
- [ai-okr.js Routes](../../../../server/routes/ai-okr.js)
- [company-profile.html](../../../../client/pages/company-profile.html)
- [companies.js Routes](../../../../server/routes/companies.js)

---

**Epic Owner**: Product Team
**Technical Lead**: TBD
**Estimated Duration**: 5 development days
**Sprint Target**: Sprint 10 (January 2026)
