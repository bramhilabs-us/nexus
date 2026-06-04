# External Audit Response & Integration Plan

**Date**: March 8, 2026
**Responding To**: Sprint 17 Critical Audit + Dependency Matrix + Prompt Pack
**Status**: Internal Review Complete

---

## Executive Summary

The external audit is **largely accurate and valuable**. Of 8 P0/P1 findings:
- **6 are CONFIRMED valid** and need to be addressed
- **1 needs minor clarification** (schema path notation)
- **1 is already partially addressed** (Sprint 15-A is COMPLETE, not in-progress)

The OpenAI Prompt Pack provides excellent guidance that should be incorporated into Sprint 17.

---

## Part 1: Audit Finding Validation

### P0 Findings (Critical)

| ID | Finding | Status | Evidence | Action Required |
|----|---------|--------|----------|-----------------|
| **P0-1** | Plan math inconsistent (2 weeks vs 3 weeks) | **VALID** | Master plan has Week 1/2/3 structure but overview says 2 weeks | Fix: Reconcile to 2 weeks/65 pts |
| **P0-2** | Schema path mismatch (`bc.description`) | **CLARIFICATION** | This was shorthand notation, but should be explicit | Fix: Use full paths in tech docs |
| **P0-3** | KeyResult model missing | **CONFIRMED BUG** | `AIContextService.js:985,1354` requires non-existent model | **P0 BUG: Must fix before Sprint 17** |
| **P0-4** | Prompt architecture fragmented | **VALID** | 5 different AI services with different prompts/models | Fix: Adopt Prompt Pack approach |
| **P0-5** | Sprint dependency unresolved | **PARTIALLY VALID** | Sprint 15-A is COMPLETE (85/85 pts), Sprint 16 is PLANNED | Clarify: Sprint 15-A done, Sprint 16 still gate |

### P1 Findings (High)

| ID | Finding | Status | Evidence | Action Required |
|----|---------|--------|----------|-----------------|
| **P1-1** | Benchmark duplication risk | **CONFIRMED** | `industries.js:380` + `analyticsService.js:544` have separate benchmarks | Fix: Consolidate before adding third |
| **P1-2** | Outcome capture workflow missing | **VALID** | Model proposed without UI/routes | Fix: Include capture workflow in scope |
| **P1-3** | AI logging not centrally wired | **VALID** | `logInteraction` exists but not consistently called | Fix: Add to all AI routes |
| **P1-4** | Frontend/schema mismatch | **CONFIRMED BUG** | Frontend writes `industry_specific.*`, schema has `profile.*` | **P0 BUG: Data loss issue** |
| **P1-5** | AI endpoint protection uneven | **VALID** | Rate limiting exists but not on all AI routes | Fix: Part of Sprint 16 TD-1 |

---

## Part 2: Confirmed Bugs (Must Fix Before Sprint 17)

### BUG-1: KeyResult Model Missing (P0-3)

**Location**: `server/services/AIContextService.js` lines 985, 1354

**Current Code**:
```javascript
const KeyResult = require('../models/KeyResult');  // FILE DOES NOT EXIST
```

**Impact**: Runtime errors when context enrichment tries to use KeyResult queries

**Fix Options**:
1. Create `KeyResult.js` model if needed
2. Remove the require if not actually used (dead code)
3. Replace with Objective.key_results subdocument queries

**Recommended**: Option 2 or 3 - verify if these code paths are actually reached

---

### BUG-2: Frontend Schema Mismatch (P1-4)

**Location**: `client/js/company-profile.js` lines 228-232, 768

**Current Code**:
```javascript
// Frontend WRITES to:
business_context.profile.industry_specific.fee_structure
business_context.profile.industry_specific.service_focus
business_context.profile.industry_specific.client_tenure
```

**Schema EXPECTS**:
```javascript
// Company model has fields at:
business_context.profile.fee_structure      // Line 121
business_context.profile.service_focus      // Line 117
business_context.profile.client_tenure      // Line 126
```

**Impact**: Data saved to wrong path, likely stripped by Mongoose validation = DATA LOSS

**Fix**: Update frontend to write to correct schema paths

---

## Part 3: Cross-Questions for External Audit

### Questions to Clarify/Confirm

| Q# | Question | Context |
|----|----------|---------|
| **Q1** | Sprint 15 status: Audit says "In Progress" but our records show Sprint 15-A COMPLETE (85/85 pts, Mar 8, 2026). Was this reviewing an outdated handoff document? | We have SESSION_LOG.md showing completion |
| **Q2** | Schema path notation: When tech docs use `bc.description`, this is shorthand for `business_context.profile.description`. Should we always use full paths for clarity, or is abbreviation acceptable in implementation specs? | Code uses `bc` as local variable |
| **Q3** | Benchmark consolidation: Should the new `IndustryBenchmark` model REPLACE `industries.js` benchmarks, or should it be an extension? What's the migration strategy? | industries.js has 180+ industry configs |
| **Q4** | Prompt orchestration layer: The Prompt Pack suggests a "base layer" system prompt. Should this be a new service (`PromptOrchestrationService`) or integrated into existing `AIContextService`? | Architectural decision |
| **Q5** | Guidance payload: The `guidance` block is marked as "optional" in the contract. Should it be REQUIRED for Sprint 17, or optional with progressive adoption? | UX consistency vs rollout flexibility |

### Potential Misunderstandings to Address

| Item | Clarification |
|------|---------------|
| **Sprint 15 status** | Sprint 15-A is COMPLETE as of Mar 8, 2026. The audit may have reviewed Sprint 15 (original) which was superseded by Sprint 15-A. |
| **65 pts vs 89 pts** | The original plan was 89 pts/3 weeks. After our internal impact analysis, we revised to 65 pts/2 weeks. The audit caught that the master plan wasn't fully updated. |
| **"Activate Before Add"** | Our strategy already aligns with audit recommendation of "consolidation-first". We identified 60 underutilized fields. |

---

## Part 4: Prompt Pack Integration Plan

### Key Takeaways from OpenAI Prompt Pack

| Principle | Current State | Sprint 17 Action |
|-----------|--------------|------------------|
| **Shared System Prompt** | None - each service has its own | Create `server/prompts/base-system-prompt.js` |
| **Guidance Block** | Not implemented | Add to all AI response schemas |
| **Non-Negotiable Rules** | Partially implemented | Codify in shared prompt |
| **Personalization Inputs** | Available but not consistently used | Create minimum context envelope |
| **Anti-Patterns** | Some present | Add validation checks |

### Proposed Integration

**NEW: Create `server/prompts/` directory with:**

```
server/prompts/
├── base-system-prompt.js       # Shared "Karvia Coach" personality
├── endpoint-templates/
│   ├── okr-generation.js       # Company OKR template
│   ├── single-objective.js     # Single objective template
│   ├── weekly-plan.js          # Weekly plan template
│   ├── task-generation.js      # Task generation template
│   └── ssi-narrative.js        # SSI narrative template
├── guidance-builder.js         # Construct guidance block
└── context-envelope.js         # Minimum required context
```

### Guidance Block Schema (Add to all AI responses)

```javascript
// Add to every AI endpoint response
{
  // ... existing response data ...

  guidance: {
    coach_message: "Short personalized explanation",
    why_this_now: "Why this recommendation is timely",
    next_best_action: {
      label: "One concrete next step",
      reason: "Expected impact"
    },
    assumptions: ["Assumption 1", "Assumption 2"],
    confidence: {
      level: "low|medium|high",
      rationale: "What made confidence this level"
    },
    ask_user: "One focused clarifying question if needed"
  }
}
```

---

## Part 5: Revised Sprint 17 Plan

### Pre-Sprint Gate (From Audit)

**Must complete BEFORE Sprint 17 starts:**

- [x] Sprint 15-A complete (DONE - 85/85 pts)
- [ ] Sprint 16 complete (PENDING - still planned)
- [x] BUG-1: Fix KeyResult model dependency ✓ FIXED (AIContextService.js)
- [x] BUG-2: Fix frontend schema mismatch ✓ FIXED (company-profile.js)
- [x] Reconcile Sprint 17 scope math ✓ DONE (70 pts / 2 weeks)

### Revised Epic Structure (Incorporating Audit)

```
REVISED SPRINT 17: 70 pts / 2 weeks

PHASE 0: FOUNDATION FIXES (8 pts) - Day 1-2
├── FIX-1: KeyResult model dependency (3 pts)
├── FIX-2: Frontend schema mismatch (3 pts)
└── FIX-3: Reconcile plan math/docs (2 pts)

PHASE 1: PROMPT CONSOLIDATION (12 pts) - Day 3-5
├── PROMPT-1: Create server/prompts/ structure (3 pts)
├── PROMPT-2: Base system prompt (Karvia Coach) (3 pts)
├── PROMPT-3: Endpoint templates (5 files) (4 pts)
└── PROMPT-4: Guidance block builder (2 pts)

PHASE 2: ACTIVATE EXISTING (10 pts) - Day 6-7
├── ACT-1: Wire guidance block to ai-okr.js (3 pts)
├── ACT-2: Wire guidance block to planning.js (3 pts)
├── ACT-3: Enable rejection history (2 pts)
└── ACT-4: Enable risk indicators in prompts (2 pts)

PHASE 3: CONTEXT MATURITY (15 pts) - Day 8-10
├── MAT-1: ContextMaturityService (5 pts)
├── MAT-2: Maturity API endpoint (3 pts)
├── MAT-3: Stage-based prompt selection (4 pts)
└── MAT-4: Dashboard indicator (3 pts)

PHASE 4: BENCHMARKS (Consolidated) (10 pts) - Day 11-12
├── BENCH-1: Consolidate industries.js + analyticsService (5 pts)
├── BENCH-2: Stage 0 fallback integration (3 pts)
└── BENCH-3: Seed data validation (2 pts)

PHASE 5: OUTCOME TRACKING (Full) (12 pts) - Day 13-14
├── OUT-1: OKROutcome model (3 pts)
├── OUT-2: Outcome capture API routes (3 pts)
├── OUT-3: Outcome capture UI (quarterly review) (4 pts)
└── OUT-4: Integration with prompt layer (2 pts)

CLEANUP (3 pts) - Throughout
├── CLN-1: AI interaction logging wrapper (2 pts)
└── CLN-2: Remove dead code from AIContextService (1 pt)
```

### Changes from Previous Plan

| Before | After | Reason |
|--------|-------|--------|
| 65 pts / 2 weeks | 70 pts / 2 weeks | Added foundation fixes + prompt consolidation |
| BUILD first | FIXES + CONSOLIDATE first | Audit: "consolidation-first approach" |
| IndustryBenchmark model | Consolidate existing | Audit: "third source of truth" risk |
| OKROutcome model only | Model + API + UI | Audit: "lacks capture workflow" |
| No guidance block | Add to all endpoints | Prompt Pack integration |

---

## Part 6: Acceptance Criteria (Audit-Aligned)

### Definition of Done for Sprint 17

From audit recommendations + prompt pack:

1. **Scope math reconciled** ✓
   - Duration + points + week allocation consistent

2. **Foundation bugs fixed** ✓
   - KeyResult dependency resolved
   - Frontend schema aligned

3. **Prompt architecture consolidated** ✓
   - Single shared system prompt
   - Consistent model/config usage
   - All AI endpoints use templates

4. **Guidance block in all AI responses** ✓
   - coach_message present
   - next_best_action present
   - assumptions declared
   - confidence with rationale

5. **Maturity scoring uses correct schema** ✓
   - Full paths: `business_context.profile.description`
   - Unit tests validate stage assignment

6. **Outcome learning is complete** ✓
   - Model + API + UI delivered together
   - Data flows to prompt layer

7. **Benchmark consolidated** ✓
   - Single source of truth
   - industries.js as canonical

8. **AI interaction logging centralized** ✓
   - Wrapper function for all OpenAI calls
   - Logs to Company.llm_context

---

## Part 7: Summary Table

### Audit Findings → Sprint 17 Actions

| Finding | Severity | Action | Sprint Phase |
|---------|----------|--------|--------------|
| P0-1: Plan math | P0 | Reconcile docs | Phase 0 |
| P0-2: Schema paths | Low | Use full paths | Phase 0 |
| P0-3: KeyResult bug | P0 | Fix before sprint | Phase 0 |
| P0-4: Prompt fragmentation | P0 | Consolidate | Phase 1 |
| P0-5: Sprint dependency | P0 | Gate on Sprint 16 | Pre-Sprint |
| P1-1: Benchmark duplication | P1 | Consolidate | Phase 4 |
| P1-2: Outcome capture missing | P1 | Full workflow | Phase 5 |
| P1-3: AI logging | P1 | Centralize | Cleanup |
| P1-4: Frontend mismatch | P0 | Fix schema | Phase 0 |
| P1-5: Rate limiting | P1 | Sprint 16 TD-1 | Pre-Sprint |

### Prompt Pack → Implementation

| Prompt Pack Item | Implementation |
|------------------|----------------|
| Shared system prompt | `server/prompts/base-system-prompt.js` |
| Endpoint templates | `server/prompts/endpoint-templates/*.js` |
| Guidance block | All AI endpoint responses |
| Personalization inputs | Context envelope standard |
| Anti-patterns | Validation in prompt builder |

---

**Document Status**: IMPLEMENTED
**Completed**:
- Cross-questions answered by auditor
- P0 bugs fixed (KeyResult model, frontend schema)
- Sprint 17 plan updated with audit findings
- Technical docs updated with full canonical paths
- PromptOrchestrator as separate service (not AIContextService)
- BenchmarkProvider interface pattern documented
- Guidance payload requirement documented

**Next Step**: Wait for Sprint 16 completion, then begin Sprint 17 execution

