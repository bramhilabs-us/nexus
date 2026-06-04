# Sprint 17 Critical Audit (Strategic + Logical + Technical)

**Date**: March 8, 2026  
**Audited Scope**: Sprint 17 plan set, strategic docs, and current implementation state  
**Mode**: Read-only audit (no application code changes)

---

## 1) Executive Verdict

Sprint 17 has a strong strategic direction (progressive context, stage-aware AI, learning loops), but the current plan is **not execution-safe** in its present form.

**Primary conclusion**: Sprint 17 should **not** execute as written. It needs a gated replan because there are P0 planning contradictions, schema mismatches, missing dependencies, and duplicate architecture paths that would likely create regression and implementation churn.

---

## 2) Audit Inputs Reviewed

### Strategy and product intent
- `KARVIA_STRATEGY/00_MASTER_STRATEGY.md`
- `KARVIA_STRATEGY/1-PRODUCT/strategy/PRODUCT_STRATEGY_MASTER.md`
- `KARVIA_STRATEGY/1-PRODUCT/SYSTEM_OVERVIEW.md`
- `KARVIA_STRATEGY/1-PRODUCT/user-journeys/CROSS_PAGE_AI_CONTEXT_FLOW.md`
- `KARVIA_STRATEGY/1-PRODUCT/strategy/product_overview.md`

### Sprint plans and handoffs
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-17 (Planned)/SPRINT-17-MASTER-PLAN.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-17 (Planned)/SPRINT-17-TECHNICAL-IMPLEMENTATION.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-17 (Planned)/SPRINT-17-IMPACT-ANALYSIS.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-17 (Planned)/SPRINT17_HANDOFF_DOCUMENT.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-16 (Planned)/SPRINT-16-MASTER-PLAN.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-16 (Planned)/SPRINT16_HANDOFF_DOCUMENT.md`
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-15 (Complete)/SPRINT15_HANDOFF_DOCUMENT.md`

### Implementation evidence (server/client)
- `server/routes/ai-okr.js`
- `server/routes/planning.js`
- `server/services/AIContextService.js`
- `server/services/aiOKRService.js`
- `server/services/AIObjectivePlanner.js`
- `server/services/SSINarrativeService.js`
- `server/models/Company.js`
- `client/js/company-profile.js`
- `server/config/ai.js`
- `server/config/industries.js`
- `server/services/analyticsService.js`

---

## 3) P0 Findings (Critical)

## P0-1: Plan math/timeline is internally inconsistent
**What failed**:
- Sprint 17 states **2 weeks** and **65 pts**, but roadmap defines **3 weeks** totaling **89 pts**.

**Evidence**:
- `SPRINT-17-MASTER-PLAN.md`: Total 65 pts, Duration 2 weeks, but Week 1 (28) + Week 2 (31) + Week 3 (30).
- `SPRINT17_HANDOFF_DOCUMENT.md`: still tracks 65 pts/2 weeks.

**Impact**:
- Capacity planning is invalid.
- Any burndown, commitment, or dependency schedule based on this will be misleading.

---

## P0-2: Proposed maturity scoring logic uses wrong schema paths
**What failed**:
- `SPRINT-17-TECHNICAL-IMPLEMENTATION.md` uses `bc.description`, `bc.business_model`, `bc.value_proposition`.
- Actual model stores these under `company.business_context.profile.*`.

**Evidence**:
- Proposal references `bc.description` style scoring.
- `server/models/Company.js` defines `business_context.profile.description`, `business_model`, `value_proposition`.

**Impact**:
- Maturity scoring would undercount profile completeness, biasing many companies toward low maturity stages.
- Downstream prompt stage selection would be wrong.

---

## P0-3: Hidden runtime dependency on non-existent model (`KeyResult`)
**What failed**:
- `AIContextService` calls `require('../models/KeyResult')` in context-delta/focus flows.
- No `server/models/KeyResult.js` exists.

**Evidence**:
- `server/services/AIContextService.js` contains KeyResult requires.
- `server/models` has no KeyResult model file.

**Impact**:
- Context enrichment can error at runtime, especially where key result context is requested.
- Makes maturity/context plans less reliable and increases silent fallback behavior.

---

## P0-4: Prompt architecture is fragmented across multiple independent generators
**What failed**:
- OpenAI prompt logic is distributed across multiple stacks with different models, rules, and output assumptions:
  - `server/services/aiOKRService.js`
  - `server/routes/ai-okr.js` (large inline prompts)
  - `server/services/AIObjectivePlanner.js`
  - `server/routes/planning.js`
  - `server/services/SSINarrativeService.js`

**Evidence**:
- Multiple `openai.chat.completions.create(...)` surfaces with separate prompt conventions and model choices.

**Impact**:
- Inconsistent user experience and tone.
- Higher maintenance cost and drift.
- Hard to guarantee “personal + guided” behavior across all AI interactions.

---

## P0-5: Sprint dependency chain is unresolved
**What failed**:
- Sprint 17 requires Sprint 16 complete.
- Sprint 16 is still planned/pending.
- Sprint 15 handoff indicates in-progress state.

**Evidence**:
- Sprint 17 docs list dependency “Sprint 16 complete: pending”.
- Sprint 16 docs list “Status: PLANNED”.
- Sprint 15 handoff status is “IN PROGRESS”.

**Impact**:
- Sprint 17 implementation would begin on unstable foundation (known test/tech debt/security gaps).

---

## 4) P1 Findings (High)

## P1-1: Benchmark architecture duplication risk
Current state already has benchmark logic in:
- `server/config/industries.js` (industry benchmark dataset + helpers)
- `server/services/SSINarrativeService.js` (consumes above)
- `server/services/analyticsService.js` (separate placeholder benchmark map)

Sprint 17 proposes adding a new `IndustryBenchmark` model/service, creating a **third source of truth** unless migrated intentionally.

**Impact**: inconsistent benchmark outputs across SSI narrative, analytics, and OKR prompts.

---

## P1-2: Outcome-learning design is valid but lacks capture workflow
Sprint 17 proposes `OKROutcome` model and learning loop, but there is no active closeout workflow in routes/UI for collecting:
- variance reasons
- lessons learned
- repeatability markers

**Impact**: data model can exist without data capture, resulting in fake stage progression assumptions.

---

## P1-3: AI interaction logging exists but is not centrally wired
`AIContextService.logInteraction` exists, but current route-level AI flows are not consistently invoking it.

**Impact**: weak observability, poor feedback loop for personalization quality.

---

## P1-4: Company profile frontend/schema mismatch reduces context quality
`client/js/company-profile.js` writes industry data under `business_context.profile.industry_specific.*`, while schema defines top-level profile fields (`service_focus`, `fee_structure`, `client_tenure`, etc.) directly under `profile`.

**Impact**: likely data loss/strip under strict schema, reducing context richness for AI prompts.

---

## P1-5: AI endpoint protection/perf foundation still uneven
There is rate-limiting middleware in codebase, but high-cost AI generation routes still show uneven protection and very large prompt construction paths.

**Impact**: abuse/cost/performance risk remains while Sprint 17 increases AI call complexity.

---

## 5) Logical/Design Flaw Summary

1. **Capacity contradiction**: 2-week sprint with 3-week workload profile.  
2. **Premature expansion**: adding multiple net-new components before consolidating existing AI paths.  
3. **No canonical prompt layer**: “personal + guided” cannot be guaranteed with current route-level prompt fragmentation.  
4. **Data confidence inflation risk**: stage confidence labels (20/45/65/80/95) are not yet tied to validated instrumentation.  
5. **Foundation mismatch**: dependency on unresolved Sprint 16 quality/security/testing work.

---

## 6) Technical Flaw Summary

1. Schema path mismatch in proposed maturity algorithm.  
2. Non-existent model dependency (`KeyResult`) in live context flows.  
3. Inconsistent model selection and prompt config usage (`gpt-4`, `gpt-4o`, `gpt-4o-mini`, config defaults to `gpt-3.5-turbo-0125`).  
4. Duplicate benchmark systems without migration strategy.  
5. Frontend-to-schema mismatch in profile data collection.

---

## 7) Impact Assessment

## Product impact
- Users may receive inconsistent AI behavior across pages (objective generation vs planning vs narratives).
- “Personal and guided” objective risks failing despite heavy implementation effort.

## Engineering impact
- Higher regression risk due to cross-route prompt divergence.
- New services/models without consolidation increase long-term maintenance cost.

## Delivery impact
- Sprint predictability degrades due to contradictory scope math and unresolved prerequisites.

## Business impact
- AI trust can degrade if context maturity labels feel arbitrary or outputs vary by endpoint.

---

## 8) Recommended Reframe for Sprint 17

## Phase 0 (Gate, mandatory)
- Freeze scope until sprint math is corrected (single point estimate + realistic duration).
- Enforce prerequisite gate: Sprint 16 closeout criteria met.

## Phase 1 (Consolidation-first)
- Introduce a single prompt orchestration layer (one source of truth for prompt policy/tone).
- Normalize OpenAI model/config usage via `server/config/ai.js`.
- Fix schema/path mismatches before maturity scoring rollout.

## Phase 2 (Maturity + Learning)
- Implement `ContextMaturityService` only after data path validation.
- Add outcome capture UX + API in same sprint slice as `OKROutcome` model.

## Phase 3 (Experience quality)
- Add mandatory `guidance` payload in every AI response (why this, what next, assumptions, confidence).
- Add acceptance tests for personalized guidance behavior across AI endpoints.

---

## 9) Definition of Done (Revised, audit recommendation)

Sprint 17 should be considered complete only if:
1. Scope math and timeline are internally consistent and approved.
2. Maturity scoring uses validated schema paths and test coverage.
3. No unresolved model import/runtime dependency remains (`KeyResult` class of failures).
4. AI prompt behavior is centralized and consistent across all user-facing AI endpoints.
5. Every AI response includes a user-guidance block (personalized + actionable).
6. Outcome learning includes both storage model and operational capture workflow.

---

## 10) Final Recommendation

Proceed with Sprint 17 only after a **replan + foundation gate**. The strategy is strong, but current plan/design has multiple P0 execution blockers that can be removed quickly with a consolidation-first approach.
