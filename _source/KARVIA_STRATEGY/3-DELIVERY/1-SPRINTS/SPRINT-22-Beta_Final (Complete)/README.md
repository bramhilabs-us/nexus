# Sprint 22: Beta_Final - Behavior-Driven Objectives

<!-- @GENOME T3-SPR-022 | ACTIVE | 2026-04-20 | parent:T1-PRD-009 | auto:/sprint-planning,/strategy | linked:/coding,/design -->

**Sprint Duration**: 6 weeks (April 21 - June 2, 2026)
**Sprint Goal**: Transform YSELA into a behavior-driven operational excellence platform
**Status**: STRATEGY PHASE - Planning in Progress
**Current Phase**: Strategic Foundation Complete → Session Planning → Implementation Planning

---

## 🎯 Sprint Vision

**Transform from**:
- Generic OKR tool with AI task generation

**Transform to**:
- Behavior-driven platform that proves BBB thesis: "Change behavior, change outcomes"
- Context-aware KR generation measuring business impact (time/cost/quality)
- Explicit tracking of 9 Disciplines (Behavior Based Business)
- SSI-aligned objectives with sub-dimension precision

---

## 📚 Strategic Foundation Documents

### ✅ COMPLETED - Core Strategy

| Document | Purpose | Status | Location |
|----------|---------|--------|----------|
| **BETA_FINAL_STRATEGY_2026.md** | Master strategy consolidating all 4 discussions | ✅ Complete | [Link](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) |
| **OBJECTIVE_CREATION_STRATEGY.md** | Complete 3-screen wizard specification | ✅ Complete | [Link](../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md) |
| **objective_kr_generation_prompt.md** | LLM prompt template for outcome-based KRs | ✅ Complete | [Link](../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) |

### ⚠️ IN PROGRESS - Supporting Strategies

| Document | Purpose | Status | Session |
|----------|---------|--------|---------|
| **COMPANY_PROFILE_STRATEGY.md** | Company profile & single source of truth | ✅ Complete | Session #165 |
| **ORCHESTRATOR_ARCHITECTURE.md** | LEGO piece + orchestrator architecture | ✅ Complete | Session #165 |
| **LLM_ORCHESTRATION_STRATEGY.md** | Prompt management & context assembly | 📋 Planned | Session #166 |
| **INTEGRATION_STRATEGY.md** | How all pieces connect | 📋 Planned | Session #167 |

### 📖 Foundation References

| Document | Purpose | Location |
|----------|---------|----------|
| **YSELA_PHILOSOPHY.md** | BBB framework, 9 Disciplines, LEGO principle | [Link](../../../../YSELA/philosophy/YSELA_PHILOSOPHY.md) |
| **BETA_ROADMAP_2026.md** | Original beta vision | [Link](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md) |
| **00_MASTER_IMPLEMENTATION_PLAN.md** | Implementation principles (reuse → reframe → extend) | [Link](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md) |

---

## 🗓️ Session Planning (Strategy Phase)

### Session #164: Objective Page Finalization
**Goal**: Complete strategy for Objective Creation with all touchpoints
**Duration**: 1 session
**Status**: 📋 Planned

**Inputs**:
- ✅ OBJECTIVE_CREATION_STRATEGY.md (already created)
- ✅ objective_kr_generation_prompt.md (already created)
- Current objective page UI (review existing)

**Outputs**:
- Finalized UI/UX specifications
- Edge cases and error scenarios
- Validation rules and business logic
- Integration points with other modules
- Ready for design mockups

**Session Plan**: [SESSION_164_OBJECTIVE_PAGE.md](./session-plans/SESSION_164_OBJECTIVE_PAGE.md)

---

### Session #165: Company Profile & My Clients Page
**Goal**: Complete strategy for company onboarding and profile management
**Duration**: 1 session
**Status**: ✅ COMPLETE

**Inputs**:
- Current "My Clients" tab (assessment hub screenshot provided)
- Business profile requirements from BETA_FINAL_STRATEGY
- LLM context needs from objective_kr_generation_prompt

**Outputs** (Delivered):
- ✅ COMPANY_PROFILE_STRATEGY.md (revised - single source of truth)
- ✅ ORCHESTRATOR_ARCHITECTURE.md (NEW - LEGO piece architecture)
- ✅ Orchestrator design (3 services: Context, Workflow, Presentation)
- ✅ CompanyProvider LEGO piece specification
- ✅ My Clients page enhancement specs
- ✅ Epic H (Orchestrator - 10 pts) and Epic I (Personal Profile - 5 pts) defined

**Key Decisions**:
- Use existing `business_context` (NOT new `business_profile` field)
- Orchestrator extracts AI-relevant subset via CompanyProvider
- Configuration-driven, auto-registration, graceful degradation

**Session Plan**: [SESSION_165_COMPANY_PROFILE.md](./session-plans/SESSION_165_COMPANY_PROFILE.md)

---

### Session #166: LLM Orchestration Architecture
**Goal**: Complete strategy for prompt management and AI integration
**Duration**: 1 session
**Status**: 📋 Planned

**Inputs**:
- objective_kr_generation_prompt.md (template)
- Context assembly requirements
- Vertical insights needs (industry patterns)

**Outputs**:
- LLM_ORCHESTRATION_STRATEGY.md (complete)
- Prompt management system architecture
- Context assembly service design
- Vertical insights knowledge base structure
- Error handling and fallback strategies
- Cost optimization approach

**Session Plan**: [SESSION_166_LLM_ORCHESTRATION.md](./session-plans/SESSION_166_LLM_ORCHESTRATION.md)

---

### Session #167: Integration & Sprint 22 Planning
**Goal**: Synthesize all strategies and create Sprint 22 implementation plan
**Duration**: 1 session
**Status**: 📋 Planned

**Inputs**:
- All completed strategy docs (Sessions #164-166)
- BETA_FINAL_STRATEGY_2026.md
- Current codebase architecture

**Outputs**:
- INTEGRATION_STRATEGY.md (how all pieces connect)
- Sprint 22 Master Plan (epics, stories, acceptance criteria)
- Architecture decision records
- Technical implementation specifications
- 6-week execution roadmap

**Session Plan**: [SESSION_167_INTEGRATION_PLANNING.md](./session-plans/SESSION_167_INTEGRATION_PLANNING.md)

---

## 📊 Strategy Phase Progress

```
PHASE 1: STRATEGIC FOUNDATION ✅ COMPLETE
├─ Discussion #1: Behavior Model Design ✅
├─ Discussion #2: Task Classification ✅
├─ Discussion #3: SSI Impact Mapping ✅
├─ Discussion #4: Integration & Data Flow ✅
├─ BETA_FINAL_STRATEGY_2026.md ✅
├─ OBJECTIVE_CREATION_STRATEGY.md ✅
└─ objective_kr_generation_prompt.md ✅

PHASE 2: DETAILED STRATEGIES 📋 IN PROGRESS
├─ Session #164: Objective Page Finalization ✅ Complete
├─ Session #165: Company Profile + Orchestrator ✅ Complete
├─ Session #166: LLM Orchestration Strategy 📋 Next
└─ Session #167: Integration & Planning 📋 Queued

PHASE 3: IMPLEMENTATION PLANNING ⏳ PENDING
├─ Sprint 22 Master Plan
├─ Architecture Decision Records
├─ Technical Implementation Specs
└─ 6-Week Execution Roadmap

PHASE 4: EXECUTION ⏳ PENDING
└─ Sprint 22.1 - 22.4 (6 weeks of implementation)
```

---

## 🏗️ Architecture Overview

### LEGO Pieces (Modular Components)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BEHAVIOR MODEL (LEGO)                         │
│  Status: ✅ Strategy Complete                                   │
│  • 9 Disciplines (Truth, Ownership, Follow-through, etc.)        │
│  • 4 Foundations (Discipline, Growth, Accountability, Maturity)  │
│  • Independent model, globally seeded                            │
│  • Referenced by Objectives (behavior_ids array)                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                COMPANY PROFILE (LEGO)                            │
│  Status: ✅ Strategy Complete (Session #165)                    │
│  • Uses existing business_context (single source of truth)       │
│  • CompanyProvider extracts AI-relevant subset                   │
│  • Feeds into LLM context for intelligent KR generation          │
│  • Graceful degradation if incomplete                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                ORCHESTRATOR (SERVICE)                            │
│  Status: ✅ Architecture Complete (Session #165)                │
│  • ContextAssemblyService - knows what data to collect           │
│  • WorkflowService - knows what should happen next               │
│  • PresentationService - knows how to format for UI              │
│  • Configuration-driven (JSON rules, no hardcoding)              │
│  • See: ORCHESTRATOR_ARCHITECTURE.md                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                ASSESSMENT MODULE (LEGO)                          │
│  Status: ⚠️ Enhancement Needed (sub-dimensions)                 │
│  • SSI scores (Speed, Strength, Intelligence)                    │
│  • Sub-dimension tracking (12 sub-scores)                        │
│  • Constraint auto-identification                                │
│  • Guides objective creation via auto-suggestions                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│            LLM ORCHESTRATION (SERVICE)                           │
│  Status: 📋 Strategy Planned (Session #166)                     │
│  • Prompt template management (versioned)                        │
│  • Context assembly (Company + SSI + Behaviors + Vertical)       │
│  • Vertical insights knowledge base (industry patterns)          │
│  • Error handling and fallbacks                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                ANALYTICS (FUTURE LEGO)                           │
│  Status: ⚠️ Simple inline for Beta, full LEGO post-beta         │
│  • Beta: Inline aggregations (SSI coverage, behavior focus)      │
│  • Post-Beta: Separate Insights Engine microservice (:8087)     │
│  • Read-only from other models                                   │
│  • Computes patterns and recommendations                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Decisions Summary

### Behavior Model ✅
- **Structure**: 9 Disciplines grouped by 4 Foundations
- **Storage**: Independent LEGO piece model
- **UI**: Multi-select checkboxes, 1-3 recommended
- **Seed**: Global (all 9 Disciplines on deployment)

### Task Classification ✅
- **Approach**: Reuse existing `recurring` field
- **No schema changes**: recurring.enabled = one-off vs habit-building
- **LLM responsibility**: Sets classification during weekly goal generation
- **Auto-regeneration**: Within weekly goal only (not cross-week)

### SSI Impact Mapping ✅
- **Structure**: Single area + optional sub-dimension
- **Auto-suggest**: From assessment constraint (lowest score)
- **Enforcement**: Guide but don't force (optional fields)
- **Analytics**: Simple inline for beta (coverage + gap warnings)

### Implementation Principles ✅
1. **Reuse → Reframe → Extend**: Prefer reusing existing models
2. **Prompts → Frontend → Backend**: Decision rule for where to add logic
3. **LEGO Pieces**: Independent modules with graceful degradation
4. **Outcome-Based KRs**: Measure business impact, not activities

---

## 📋 Data Model Changes

### New Models
- **Behavior** (NEW): 9 Disciplines + 4 Foundations

### New Services (Session #165)
- **Orchestrator**: 3 services (Context, Workflow, Presentation)
- **Providers**: CompanyProvider, PersonProvider, TeamProvider, etc.

### Extended Models
- **Objective**: + ssi_impact, + behavior_ids, + ai_guidance
- **Assessment**: + sub_dimension scores (12 sub-scores), + constraint

### Reused (No Changes - Single Source of Truth)
- **Company**: Use existing `business_context` (NOT new `business_profile`)
- **Task**: Existing `recurring` field reinterpreted
- **Goal**: No changes (quarterly/weekly cascade)
- **Key Result**: No changes (embedded in Objective)

---

## 🚀 6-Week Rollout Plan

### Sprint 22.1: Foundation (2 weeks)
**Week 1-2**:
- Behavior model + seed script
- Extend Objective, Company, Assessment models
- LLM orchestration service
- Prompt template system
- Vertical insights knowledge base

### Sprint 22.2: Objective Wizard (2 weeks)
**Week 3-4**:
- 3-screen wizard UI
- LLM integration
- Error handling + fallbacks
- Manual KR entry flow

### Sprint 22.3: Polish & Analytics (1 week)
**Week 5**:
- Simple analytics endpoints
- Analytics dashboard UI
- Consultant training materials
- Beta launch (3-5 consultants)

### Sprint 22.4: Feedback & Iterate (1 week)
**Week 6**:
- Monitor adoption metrics
- Collect feedback
- Tune LLM prompts
- Bug fixes + UX improvements

---

## 📈 Success Criteria

### Beta Launch Criteria (Week 5)
- ✅ Behavior model seeded (9 Disciplines)
- ✅ Objective creation wizard (3 screens working)
- ✅ LLM generates outcome-based KRs
- ✅ SSI impact tracking functional
- ✅ Simple analytics visible

### 3-Month Beta Success Metrics
**Adoption**:
- 80% of objectives created with behaviors selected
- 60% of consultants use AI KR generation
- 50% read AI guidance

**Quality**:
- Avg 3-5 KRs per objective
- 40-60% of AI KRs edited (healthy engagement)
- Consultant satisfaction: >4/5 on KR quality

**Impact**:
- SSI scores improve avg +10-15 points in targeted dimension
- 70% of teams show behavior indicators
- Correlation between behavior focus and SSI improvement

---

## 📁 Folder Structure

```
SPRINT-22-Beta_Final/
├── README.md (this file)
│
├── session-plans/
│   ├── SESSION_164_OBJECTIVE_PAGE.md
│   ├── SESSION_165_COMPANY_PROFILE.md
│   ├── SESSION_166_LLM_ORCHESTRATION.md
│   └── SESSION_167_INTEGRATION_PLANNING.md
│
├── strategy-docs/
│   └── (Links to docs in other folders - see table above)
│
├── architecture/
│   └── (To be created in Session #167)
│
├── implementation/
│   ├── SPRINT-22-MASTER-PLAN.md (Session #167)
│   ├── TECHNICAL_SPECS.md (Session #167)
│   └── EXECUTION_ROADMAP.md (Session #167)
│
└── handoff/
    └── (Created during sprint execution)
```

---

## ⚠️ Critical Dependencies

### Before Starting Implementation

**Must Complete**:
1. ✅ BETA_FINAL_STRATEGY_2026.md
2. ✅ OBJECTIVE_CREATION_STRATEGY.md
3. ✅ objective_kr_generation_prompt.md
4. 📋 Session #164: Objective Page finalization
5. 📋 Session #165: Company Profile strategy
6. 📋 Session #166: LLM Orchestration strategy
7. 📋 Session #167: Integration strategy + Sprint planning

**External Dependencies**:
- OpenAI API access (GPT-4 or equivalent)
- Assessment module functional (for SSI scores)
- Current user roles/RBAC working

---

## 🔗 Quick Links

### Strategy Documents
- [Master Strategy (BETA_FINAL_STRATEGY_2026)](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md)
- [Objective Creation Strategy](../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md)
- [LLM Prompt Template](../../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md)

### Foundation Documents
- [YSELA Philosophy](../../../../YSELA/philosophy/YSELA_PHILOSOPHY.md)
- [Beta Roadmap 2026](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md)
- [Master Implementation Plan](../../../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md)

### Session Plans
- [Session #164: Objective Page](./session-plans/SESSION_164_OBJECTIVE_PAGE.md)
- [Session #165: Company Profile](./session-plans/SESSION_165_COMPANY_PROFILE.md)
- [Session #166: LLM Orchestration](./session-plans/SESSION_166_LLM_ORCHESTRATION.md)
- [Session #167: Integration Planning](./session-plans/SESSION_167_INTEGRATION_PLANNING.md)

---

## 📝 Next Session

**Session #166: LLM Orchestration Strategy**
- Build on: ORCHESTRATOR_ARCHITECTURE.md (Session #165)
- Focus: Prompt management, context caching, vertical insights
- Output: LLM_ORCHESTRATION_STRATEGY.md complete
- Duration: 1 session

See: [SESSION_166_LLM_ORCHESTRATION.md](./session-plans/SESSION_166_LLM_ORCHESTRATION.md)

---

**Sprint Owner**: Product Team
**Created**: April 20, 2026
**Last Updated**: April 20, 2026 (Session #165)
**Status**: Strategy Phase - Sessions #164 + #165 Complete (80%)

