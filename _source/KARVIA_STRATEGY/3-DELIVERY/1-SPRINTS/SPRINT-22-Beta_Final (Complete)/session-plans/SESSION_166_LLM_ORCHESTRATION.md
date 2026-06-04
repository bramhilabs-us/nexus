# Session #166: LLM Orchestration Architecture Strategy

<!-- @GENOME T3-SPR-022-S3 | ACTIVE | 2026-04-20 | parent:T3-SPR-022 | auto:/strategy | linked:/coding -->

**Session Goal**: Create complete strategy for LLM orchestration, prompt management, and AI integration
**Duration**: 1 strategy session
**Status**: 📋 Planned
**Prerequisites**: Sessions #164-165 complete, objective_kr_generation_prompt.md reviewed

---

## Session Objectives

### Primary Goal
Design the LLM orchestration system that assembles rich context from multiple sources, manages prompts systematically, and delivers intelligent, business-focused KR suggestions with graceful fallbacks.

### Deliverables
1. ✅ LLM_ORCHESTRATION_STRATEGY.md (complete strategic doc)
2. ✅ Prompt management system architecture
3. ✅ Context assembly service design
4. ✅ Vertical insights knowledge base structure
5. ✅ Error handling and fallback strategies
6. ✅ Cost optimization approach

---

## Pre-Session Review

### Documents to Read Before Session
1. [objective_kr_generation_prompt.md](../../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) - Current prompt template
2. [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) - LLM service requirements
3. [OBJECTIVE_CREATION_STRATEGY.md](../../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md) - Where LLM is called

### Current State Analysis
- ✅ Prompt template exists (comprehensive, philosophical)
- ✅ Context structure defined (Company + SSI + Behaviors + Vertical)
- ⚠️ No prompt management system yet
- ⚠️ No vertical insights knowledge base
- ⚠️ No context assembly service
- ⚠️ No versioning or A/B testing framework

---

## Session Agenda

### Part 1: Prompt Management System (40 min)

**Core Requirements**:

1. **Prompt Storage**: Where do prompts live?
2. **Versioning**: How to track prompt changes over time?
3. **A/B Testing**: How to test prompt variations?
4. **Audit Trail**: Track what prompt generated which KRs?

**Architecture Options**:

**Option A: File-Based (Simple)**
```
server/prompts/
├── objective_kr_generation/
│   ├── v1.0.md (original)
│   ├── v1.1.md (improved)
│   ├── v2.0.md (major revision)
│   └── current.md (symlink or config pointer)
```

Pros: Simple, version control via git, easy to review
Cons: Can't A/B test easily, no runtime switching

**Option B: Database-Stored (Dynamic)**
```javascript
PromptTemplate {
  name: 'objective_kr_generation',
  version: '1.1',
  template: String (full prompt),
  variables: [String],  // e.g., ['company', 'objective', 'ssi']
  status: 'active' | 'testing' | 'archived',
  created_at: Date,
  performance_metrics: {
    avg_consultant_edit_rate: Number,
    avg_satisfaction_score: Number
  }
}
```

Pros: A/B testing, runtime switching, analytics
Cons: More complex, prompts not in version control

**Option C: Hybrid (Recommended)**
```
File-based storage (version control) +
Database metadata (versioning, routing) +
Config flag (which version to use)
```

Pros: Best of both worlds
Cons: Two sources of truth to maintain

**Questions to Answer**:
1. Which architecture for beta? (Recommendation: File-based for simplicity)
2. When to add database (post-beta with analytics)?
3. How to version prompts (semantic versioning: v1.0, v1.1, v2.0)?

**Output**: Prompt management architecture decision

---

### Part 2: Context Assembly Service (45 min)

**Service Architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│              LLM CONTEXT ASSEMBLY SERVICE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT: ObjectiveData (from Screen 1)                           │
│  ├─ title                                                       │
│  ├─ ssi_impact { area, sub_dimension }                          │
│  ├─ behavior_ids [ObjectId]                                     │
│  ├─ company_id                                                  │
│  └─ owner_id                                                    │
│                                                                  │
│  FETCH FROM DATABASES:                                          │
│  ├─ Company Profile                                             │
│  │  └─ business_profile: { industry, size, priorities... }      │
│  │                                                               │
│  ├─ Latest Assessment                                           │
│  │  └─ SSI scores: { speed, strength, intelligence }            │
│  │  └─ Constraint: { area, sub_dimension, score }               │
│  │                                                               │
│  ├─ Selected Behaviors                                          │
│  │  └─ [{ name, description, foundation }]                      │
│  │                                                               │
│  └─ User (Owner)                                                │
│     └─ { name, role }                                           │
│                                                                  │
│  LOAD FROM KNOWLEDGE BASE:                                      │
│  └─ Vertical Insights                                           │
│     └─ Industry patterns, typical KRs, benchmarks               │
│                                                                  │
│  ASSEMBLE CONTEXT OBJECT:                                       │
│  {                                                               │
│    company: { name, industry, size, priorities, challenges },   │
│    ssi: { scores, constraint, target_dimension },               │
│    objective: { title, implementation_means, behaviors },       │
│    vertical_insights: { typical_krs, benchmarks }               │
│  }                                                               │
│                                                                  │
│  RENDER PROMPT TEMPLATE:                                        │
│  Merge context into template using Handlebars/Mustache          │
│                                                                  │
│  OUTPUT: Complete prompt string (ready for LLM API)             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Code Structure**:

```javascript
// server/services/LLMOrchestrationService.js

class LLMOrchestrationService {

  async generateKeyResults(objectiveData) {
    // 1. Fetch all required data
    const context = await this.assembleContext(objectiveData);

    // 2. Load prompt template
    const template = await this.loadPromptTemplate('objective_kr_generation');

    // 3. Render prompt with context
    const prompt = this.renderPrompt(template, context);

    // 4. Call LLM API
    const response = await this.callLLM(prompt);

    // 5. Parse and validate response
    const krs = this.parseAndValidate(response);

    // 6. Log for analytics
    await this.logGeneration(objectiveData, prompt, krs);

    return krs;
  }

  async assembleContext(objectiveData) {
    // Parallel fetches for performance
    const [company, assessment, behaviors, owner, verticalInsights] =
      await Promise.all([
        Company.findById(objectiveData.company_id),
        this.getLatestAssessment(objectiveData.company_id),
        Behavior.find({ _id: { $in: objectiveData.behavior_ids } }),
        User.findById(objectiveData.owner_id),
        this.getVerticalInsights(objectiveData.company_id)
      ]);

    return {
      company: this.formatCompanyContext(company),
      ssi: this.formatSSIContext(assessment, objectiveData.ssi_impact),
      objective: this.formatObjectiveContext(objectiveData, behaviors),
      vertical_insights: verticalInsights,
      owner: { name: owner.name, role: owner.role }
    };
  }

  formatCompanyContext(company) {
    return {
      name: company.name,
      industry: company.business_profile?.industry_vertical || 'unspecified',
      size: company.business_profile?.employee_count ||
            company.business_profile?.employee_range ||
            'unspecified',
      business_model: company.business_profile?.business_model ||
                      'Not provided',
      business_priorities: company.business_profile?.business_priorities || [],
      current_challenges: company.business_profile?.current_challenges || []
    };
  }

  async callLLM(prompt) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',  // or configurable
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
        timeout: 30000  // 30 second timeout
      });

      return response.choices[0].message.content;
    } catch (error) {
      // Handle errors (see Part 4)
      throw new LLMGenerationError(error);
    }
  }
}
```

**Questions to Answer**:
1. Caching strategy (cache assembled context for how long)?
2. Parallel vs sequential fetches (parallel for performance)?
3. What if one data source is slow/unavailable (timeout per fetch)?
4. Context size limits (max tokens for prompt)?

**Output**: Context assembly service specification

---

### Part 3: Vertical Insights Knowledge Base (35 min)

**Structure**:

```javascript
// server/knowledge/vertical_insights.js

module.exports = {
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

    typical_krs_by_objective: {
      'meeting_structure': {
        time_savings: {
          metric: 'Operational expenses (meeting time cost)',
          realistic_target: '10-20% reduction',
          typical_baseline: '$50K-$80K/month for 50-100 person company',
          measurement: 'Calculate: meetings × attendees × duration × hourly rate'
        },
        speed_improvement: {
          metric: 'Decision-to-action cycle time',
          realistic_target: '< 48 hours (from 5-7 days)',
          typical_baseline: '5-7 days average',
          measurement: 'Track decisions in meeting notes, measure until action starts'
        },
        accountability: {
          metric: 'Meeting action item completion rate',
          realistic_target: '> 85% within committed timeframe',
          typical_baseline: '40-60% (establish baseline)',
          measurement: 'Track action items from notes, mark completed/overdue'
        },
        quality: {
          metric: 'Employee clarity score',
          realistic_target: '> 4.2/5 on "I know what\'s expected this week"',
          typical_baseline: '2.8-3.2/5',
          measurement: '5-question pulse survey, quarterly'
        }
      },

      'kpi_implementation': {
        visibility: {
          metric: 'Management visibility score',
          realistic_target: '> 4/5 on "I have the data I need to manage"',
          typical_baseline: '2.5/5',
          measurement: 'Manager survey'
        },
        proactive_work: {
          metric: 'Proactive vs reactive work ratio',
          realistic_target: '50:50 (from 20:80)',
          typical_baseline: '20:80 (mostly firefighting)',
          measurement: 'Manager self-report, weekly'
        }
      }

      // ... more objective types
    },

    typical_constraints: {
      speed: {
        common_sub_dimensions: ['decisions', 'response'],
        typical_score_range: '35-50',
        improvement_potential: '+15-25 points in 3 months'
      },
      strength: {
        common_sub_dimensions: ['operations', 'people'],
        typical_score_range: '55-70',
        improvement_potential: '+10-15 points in 3 months'
      },
      intelligence: {
        common_sub_dimensions: ['learning', 'data'],
        typical_score_range: '45-60',
        improvement_potential: '+12-18 points in 3 months'
      }
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

  professional_services: {
    // ... similar structure for law firms, accounting, consulting
  },

  real_estate: {
    // ... similar structure
  }

  // ... 5-7 core industries
};
```

**Questions to Answer**:
1. How many industries to build for beta? (Recommendation: 3-5 core)
2. Static file or database? (Recommendation: Static file for beta, migrate to DB post-beta for learning)
3. Who maintains this? (Product team curates based on consultant feedback)
4. How detailed should benchmarks be? (Start simple, enrich over time)
5. What if company industry doesn't match? (Use 'general' fallback patterns)

**Output**: Vertical insights structure and initial seed data

---

### Part 4: Error Handling & Fallbacks (30 min)

**Error Scenarios**:

| Error | Cause | Fallback Strategy |
|-------|-------|-------------------|
| **LLM Timeout** | OpenAI API slow (>30s) | Retry once, then offer manual KR entry |
| **LLM API Error** | OpenAI service down, rate limit | Show error, offer manual entry, log for retry |
| **Invalid Response** | LLM returns malformed JSON | Parse what's available, log error, allow editing |
| **Empty Response** | LLM returns 0 KRs | Show error, offer manual entry |
| **Context Assembly Failure** | Database query fails | Use partial context (warn quality may be lower) |
| **Missing Company Profile** | Profile incomplete/empty | Generic KRs, warn consultant |
| **Missing Assessment** | No assessment run yet | Can't auto-suggest SSI, proceed with manual selection |
| **No Vertical Insights** | Industry not in knowledge base | Use generic patterns (no industry-specific benchmarks) |

**Fallback Hierarchy**:

```
1. IDEAL STATE
   └─ Full context + LLM success → High-quality outcome-based KRs

2. PARTIAL CONTEXT
   └─ Missing company profile → Generic but functional KRs + warning

3. LLM DEGRADATION
   └─ Timeout/error → Retry once → Manual KR entry with template

4. COMPLETE FAILURE
   └─ All systems down → Manual KR form (no AI) + apology message
```

**Retry Logic**:

```javascript
async callLLM(prompt, retryCount = 0) {
  try {
    return await openai.chat.completions.create({...});
  } catch (error) {
    if (retryCount < 1 && error.isRetryable()) {
      // Wait 2 seconds, retry once
      await sleep(2000);
      return this.callLLM(prompt, retryCount + 1);
    }
    throw new LLMGenerationError(error);
  }
}
```

**User-Facing Messages**:

| Scenario | Message to Consultant |
|----------|----------------------|
| Success | "Key Results generated! Review and edit as needed." |
| Timeout (retry) | "AI is taking longer than expected. Retrying..." |
| Timeout (final) | "We couldn't generate KRs automatically. Let's create them manually. [Continue]" |
| API Error | "AI service temporarily unavailable. You can create KRs manually or try again later. [Manual Entry] [Try Again]" |
| Partial Context | "ℹ️ Your company profile is incomplete. KRs will be more generic. [Complete Profile] [Continue]" |
| Invalid Format | "AI generated partial results. Please review and add missing details. [Edit KRs]" |

**Output**: Complete error handling matrix

---

### Part 5: Cost Optimization & Performance (20 min)

**Cost Factors**:

```
OpenAI API Costs (GPT-4 Turbo):
- Prompt tokens: ~1,500-2,000 tokens (with full context)
- Completion tokens: ~1,000-1,500 tokens (3-5 KRs + guidance)
- Total per generation: ~3,000-3,500 tokens
- Cost: ~$0.03-$0.05 per objective created

Monthly estimate (Beta with 10 consultants, 5 objectives/consultant/month):
- 50 objectives/month × $0.04 = $2.00/month
- Negligible for beta

Scale estimate (100 consultants, 20 objectives/consultant/month):
- 2,000 objectives/month × $0.04 = $80/month
- Still very affordable
```

**Optimization Strategies**:

1. **Context Caching**:
   - Cache assembled context for 5 minutes per company
   - Saves redundant DB queries if consultant creates multiple objectives
   - Implementation: Redis or in-memory cache

2. **Prompt Compression**:
   - Remove verbose examples for production prompts
   - Keep essential context only
   - Reduce from 2,000 → 1,200 tokens (40% savings)

3. **Model Selection**:
   - Beta: Use GPT-4 Turbo (quality critical)
   - Post-beta: A/B test GPT-3.5 Turbo for cost (70% cheaper)
   - Future: Fine-tune smaller model on successful KR patterns

4. **Batching** (future):
   - If consultant creates 4 objectives at once, batch into single API call
   - Not for beta (adds complexity)

**Performance Targets**:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Context Assembly | < 500ms | Database queries in parallel |
| LLM Response | < 15s median, < 30s p95 | OpenAI API latency |
| Total Generation | < 20s median, < 35s p95 | End-to-end from click to Screen 3 |
| Cache Hit Rate | > 20% (if multiple objectives) | Redis metrics |

**Output**: Cost model and optimization strategy

---

## Session Deliverables

### Must Create in Session

1. **LLM_ORCHESTRATION_STRATEGY.md**
   - Complete strategic document
   - All architecture decisions documented
   - Ready for engineering implementation

2. **Prompt Management Architecture**
   - Where prompts are stored
   - Versioning strategy
   - A/B testing framework (future)

3. **Context Assembly Service Spec**
   - Complete service design
   - Data fetch strategy (parallel)
   - Caching approach
   - Error handling

4. **Vertical Insights Knowledge Base**
   - Structure defined
   - 3-5 industries seeded
   - Maintenance plan

5. **Error Handling Matrix**
   - All failure scenarios
   - Fallback strategies
   - User-facing messages
   - Retry logic

6. **Cost & Performance Model**
   - Monthly cost estimates
   - Optimization strategies
   - Performance targets

---

## Key Decisions Needed in Session

### Decision 1: Prompt Storage

**Question**: File-based or database?

**Recommendation**: File-based for beta, database post-beta for A/B testing

---

### Decision 2: Context Caching

**Question**: Cache assembled context? For how long?

**Recommendation**: Yes, cache for 5 minutes per company (consultant likely creating multiple objectives)

---

### Decision 3: LLM Model

**Question**: GPT-4 Turbo or GPT-3.5 Turbo?

**Recommendation**: GPT-4 Turbo for beta (quality critical), test GPT-3.5 post-beta

---

### Decision 4: Vertical Insights Scope

**Question**: How many industries to build?

**Recommendation**: 3-5 core industries for beta:
1. Legacy Succession Planning
2. Professional Services
3. Real Estate
4. General (fallback for others)

---

### Decision 5: Error Retry Strategy

**Question**: Auto-retry or manual?

**Recommendation**: Auto-retry once (transparent to user), then offer manual entry

---

## Post-Session Actions

### For Product Team
- [ ] Review LLM_ORCHESTRATION_STRATEGY.md
- [ ] Approve architecture decisions
- [ ] Validate vertical insights content

### For Engineering Team
- [ ] Build context assembly service
- [ ] Implement prompt rendering
- [ ] Build vertical insights loader
- [ ] Implement error handling and retries
- [ ] Set up LLM API integration

### For Content Team (if exists)
- [ ] Write vertical insights for 3-5 industries
- [ ] Review LLM prompt for tone and clarity
- [ ] Write error messages and user guidance

---

## Success Criteria

**Session is successful if**:
- ✅ LLM_ORCHESTRATION_STRATEGY.md is complete
- ✅ All architecture decisions made and documented
- ✅ Context assembly logic clearly specified
- ✅ Vertical insights structure defined
- ✅ Error handling comprehensive with user-friendly messages
- ✅ Cost model validated as affordable

**Ready for next phase when**:
- Engineering can start implementation immediately
- No open questions on architecture
- Cost projections approved by stakeholders

---

## Related Documents

**Input Documents**:
- [objective_kr_generation_prompt.md](../../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md)
- [BETA_FINAL_STRATEGY_2026.md](../../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md)

**Output Document** (to be created in session):
- `LLM_ORCHESTRATION_STRATEGY.md` → Location: `KARVIA_STRATEGY/2-TECHNICAL/`

**Previous Sessions**:
- [SESSION_164_OBJECTIVE_PAGE.md](./SESSION_164_OBJECTIVE_PAGE.md)
- [SESSION_165_COMPANY_PROFILE.md](./SESSION_165_COMPANY_PROFILE.md)

**Next Session**:
- [SESSION_167_INTEGRATION_PLANNING.md](./SESSION_167_INTEGRATION_PLANNING.md)

---

**Session Owner**: Product + Engineering Teams
**Created**: April 20, 2026
**Status**: Planned - Ready to Execute

