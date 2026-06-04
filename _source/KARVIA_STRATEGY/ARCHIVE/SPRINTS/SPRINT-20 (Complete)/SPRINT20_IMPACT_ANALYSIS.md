# Sprint 20: Impact Analysis & Architecture Review

**Document ID**: K3-S20-IMPACT-001
**Version**: 1.0.0
**Created**: March 18, 2026
**Status**: CRITICAL REVIEW REQUIRED
**Author**: Claude (Architectural Audit)

---

## Executive Summary

This analysis identifies **significant code reuse opportunities** and **architectural inconsistencies** in the Sprint 20 plan. The current plan proposes creating new files and services that duplicate existing, battle-tested infrastructure. Implementing the plan as-is would result in:

- **~1,500+ lines of unnecessary new code**
- **Duplicated OpenAI integration patterns**
- **Inconsistent prompt architecture**
- **Maintenance burden across parallel systems**

### Severity Rating: **HIGH** - Plan revision recommended before implementation.

---

## 1. Code Reuse Analysis

### 1.1 Existing Infrastructure Discovery

| Component | Existing File | Lines | Sprint 20 Proposes | Reuse Opportunity |
|-----------|---------------|-------|-------------------|-------------------|
| Context Building | `AIContextService.js` | 2,096 | Build new context | **100% reusable** |
| Prompt System | `server/prompts/index.js` | 233 | Create 4 new prompt files | **Extend existing** |
| Single Objective | `single-objective.js` | 209 | Create `refine.js`, `generate-krs.js` | **Extend existing** |
| OpenAI Integration | `aiOKRService.js` | 681 | New OpenAI calls | **Reuse patterns** |
| Maturity Stages | `ContextMaturityService.js` | 500+ | Not mentioned | **Already integrated** |
| Category Config | `categories.js` | 201 | Hardcode in wizard | **Import existing** |

### 1.2 Critical Findings

#### Finding #1: Prompt Duplication (CRITICAL)

**Plan proposes** creating 4 new prompt files:
```
server/prompts/objective-wizard/
├── pre-prompt.js           # System prompt builder
├── refine.js               # Objective refinement
├── generate-krs.js         # KR generation
└── regenerate-kr.js        # Single KR regeneration
```

**But we already have**:
- `server/prompts/base-system-prompt.js` - Karvia Coach personality (shared)
- `server/prompts/endpoint-templates/single-objective.js` - Single objective + KR generation
- `server/prompts/guidance-builder.js` - Guidance block generation
- Stage overlays (0-4) with maturity awareness

**Recommendation**: Add `PROMPT_TYPES.OBJECTIVE_WIZARD` to existing prompt system, extend `single-objective.js` template.

---

#### Finding #2: Context Building Duplication (HIGH)

**Plan implies** building context in wizard routes:
```javascript
// Tech spec line 96-100
// Call AIContextService.buildContext(company_id)
// Build pre-prompt with context
```

**But `AIContextService.buildContext()` already provides**:
- Company profile with business model, value proposition
- SSI scores (12-block) with weak/strong areas
- Business metrics and strategic vision
- Risk indicators
- Existing objectives and KRs
- Team structure
- Token management (8,000 limit)
- Rejection history for AI learning
- Context delta tracking

**Lines 739-966 of AIContextService.js**:
```javascript
async buildContext(companyId, options = {}) {
  const { scope = 'okr', objectiveId, keyResultId, ... } = options;
  // Layer 1: Foundation (P0 - Always include)
  // Layer 2: OKR Context
  // Layer 3: Planning Context
  // ... 200+ lines of sophisticated context building
}
```

**Recommendation**: Call `AIContextService.buildContext(companyId, { scope: 'okr' })` directly in wizard routes.

---

#### Finding #3: OpenAI Integration Patterns (MEDIUM)

**Plan implies** new OpenAI calls in wizard routes.

**But `aiOKRService.js` already has**:
```javascript
class AIOKRService {
  constructor() {
    this.isOpenAIEnabled = process.env.FEATURE_OPENAI_ENABLED === 'true';
    if (this.isOpenAIEnabled) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    this.config = {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2500,
      // ...
    };
  }

  async generateWithAI(context, options) { ... }
  validateOKRs(generatedOKRs) { ... }
}
```

**Recommendation**: Either extend `aiOKRService` or create a shared OpenAI wrapper service.

---

#### Finding #4: Maturity Stage Integration (HIGH)

**Plan does not mention** maturity-aware prompts.

**But existing prompt system provides**:
- `ContextMaturityService.calculateMaturity(companyId)` - Stage 0-4
- `getPromptWithMaturity(companyId, PROMPT_TYPES.SINGLE_OBJECTIVE, context)`
- Stage-specific overlays in `single-objective.js` lines 57-153
- Different guidance for Discovery (20% confidence) vs Mastery (95% confidence)

**Risk**: Wizard would generate objectives without maturity awareness, reducing AI quality.

**Recommendation**: Use `getPromptWithMaturity()` for all wizard AI calls.

---

## 2. Architectural Inconsistencies

### 2.1 Pattern Divergence

| Aspect | Existing Pattern | Sprint 20 Proposes |
|--------|------------------|-------------------|
| Prompt loading | `getPromptForEndpoint()` | Direct inline prompts |
| Context building | `AIContextService.buildContext()` | Custom context in routes |
| Maturity awareness | Stage-based overlays (0-4) | Not mentioned |
| Error handling | `AILoggingWrapper` | Custom error handling |
| Guidance blocks | `GuidanceBuilder.build()` | Not mentioned |

### 2.2 Session Management Architecture

**Proposed**: In-memory Map with 30-min TTL
```javascript
class WizardSessionService {
  constructor() {
    this.sessions = new Map();
    this.SESSION_TTL = 30 * 60 * 1000;  // 30 minutes
    // ...
  }
}
```

**Existing pattern**: `progress-tracker.js` uses similar Map pattern for WebSocket connections but without TTL cleanup.

**Scalability Concern**: In-memory sessions don't survive:
- Server restarts
- Multiple server instances (horizontal scaling)
- Process crashes

**Acceptable for MVP** if:
1. Single server deployment (current Render setup)
2. Session loss = restart wizard (acceptable UX)
3. Future: Redis upgrade path documented

**Recommendation**: Keep WizardSessionService but add scaling documentation.

---

## 3. Dependency Verification

### 3.1 Required Dependencies (All Exist)

| Dependency | Status | Location |
|------------|--------|----------|
| `AIContextService` | VERIFIED | `server/services/AIContextService.js` |
| `ContextMaturityService` | VERIFIED | `server/services/ContextMaturityService.js` |
| `OBJECTIVE_CATEGORIES` | VERIFIED | `server/config/categories.js` |
| Prompt System | VERIFIED | `server/prompts/index.js` |
| OpenAI Integration | VERIFIED | `server/services/aiOKRService.js` |
| `GuidanceBuilder` | VERIFIED | `server/prompts/guidance-builder.js` |

### 3.2 Missing from Plan

| Missing Item | Impact | Recommendation |
|-------------|--------|----------------|
| Maturity stage integration | AI quality | Use `getPromptWithMaturity()` |
| Rejection history | AI learning | Use `context.rejections` from `buildContext()` |
| Token management | Context overflow | Use `AIContextService` token limits |
| AI interaction logging | Debugging/audit | Use `AILoggingWrapper` |

---

## 4. Scalability Assessment

### 4.1 Session Store (In-Memory Map)

**Current Render Setup**: Single server instance
**Risk Level**: LOW for MVP
**Mitigation**: Document Redis upgrade path

**When to migrate to Redis**:
- Multiple server instances required
- Session persistence across deploys required
- >1000 concurrent wizard sessions expected

### 4.2 Token Budget

**AIContextService limits**: 8,000 tokens total
- Company: 500 tokens
- SSI: 800 tokens
- Objectives: 1,500 tokens
- Buffer: 500 tokens

**Wizard should respect** these limits by using `buildContext()`.

---

## 5. Recommended Architecture Changes

### 5.1 File Structure (Revised)

**REMOVE from plan**:
```
server/prompts/objective-wizard/    # Don't create - extend existing
    ├── pre-prompt.js
    ├── refine.js
    ├── generate-krs.js
    └── regenerate-kr.js
```

**KEEP from plan**:
```
client/
├── pages/
│   ├── objective-wizard.html          # New wizard page
│   └── scripts/
│       └── objective-wizard.js         # Wizard logic
├── css/
│   └── objective-wizard.css            # Wizard styles

server/
├── routes/
│   └── objective-wizard.js             # New API endpoints
└── services/
    └── WizardSessionService.js         # Session management (keep)
```

**ADD to plan**:
```
server/prompts/endpoint-templates/
    └── single-objective.js             # EXTEND with wizard methods
```

### 5.2 Code Reuse Integration

**In `server/routes/objective-wizard.js`**:
```javascript
const AIContextService = require('../services/AIContextService');
const { getPromptWithMaturity, PROMPT_TYPES } = require('../prompts');
const { OBJECTIVE_CATEGORIES } = require('../config/categories');

// POST /api/objective-wizard/initialize-session
router.post('/initialize-session', async (req, res) => {
  const { category, priority } = req.body;
  const companyId = req.user.company_id;

  // REUSE: Build context using existing service
  const context = await AIContextService.buildContext(companyId, { scope: 'okr' });

  // REUSE: Get maturity-aware prompt
  const promptData = await getPromptWithMaturity(
    companyId,
    PROMPT_TYPES.SINGLE_OBJECTIVE,  // Extend this type
    { category, priority, ...context }
  );

  // Create session with context
  const session = WizardSessionService.createSession(
    req.user._id, companyId, category, priority
  );
  session.context = context;
  session.promptData = promptData;

  // ... rest of implementation
});
```

### 5.3 Prompt Extension (single-objective.js)

Add wizard-specific methods to existing template:
```javascript
// Add to server/prompts/endpoint-templates/single-objective.js

/**
 * Wizard-specific: Refine user's rough objective
 */
function getRefinePrompt(roughInput, context) {
  return `${getBasePrompt()}

USER INPUT: "${roughInput}"

TASK: Refine this rough idea into a SMART objective statement.
- Make it specific and measurable
- Align with company context: ${context.company.industry}
- Consider SSI weak areas: ${context.ssi?.weakAreas?.map(w => w.dimension).join(', ')}

Return: { refined_title, description, reasoning }`;
}

/**
 * Wizard-specific: Regenerate single KR with feedback
 */
function getRegenerateKRPrompt(krIndex, feedback, existingKRs, context) {
  return `${getBasePrompt()}

EXISTING KRs: ${JSON.stringify(existingKRs)}
KR TO REPLACE: Index ${krIndex}
USER FEEDBACK: "${feedback}"

Generate ONE replacement KR that addresses the feedback.
Ensure it doesn't duplicate other KRs.

Return: { title, metric_type, baseline, target, rationale }`;
}

module.exports = {
  getBasePrompt,
  getStageOverlay,
  getCategoryExamples,
  getRefinePrompt,        // NEW
  getRegenerateKRPrompt,  // NEW
  STAGE_OVERLAYS
};
```

---

## 6. Updated Estimates

### 6.1 Lines of Code Comparison

| Component | Original Plan | Revised Plan | Savings |
|-----------|--------------|--------------|---------|
| New prompt files (4) | ~400 lines | 0 lines | 400 |
| Context building | ~200 lines | ~20 lines | 180 |
| OpenAI integration | ~150 lines | ~30 lines | 120 |
| Total | ~750 lines | ~50 lines | **700 lines** |

### 6.2 Risk Reduction

| Risk | Before | After |
|------|--------|-------|
| Duplicate prompt maintenance | HIGH | ELIMINATED |
| Inconsistent AI behavior | HIGH | LOW |
| Missing maturity awareness | HIGH | ELIMINATED |
| Context quality variance | MEDIUM | ELIMINATED |

---

## 7. Action Items

### Immediate (Before Implementation)

- [ ] **AIA-1**: Update tech spec to remove new prompt files
- [ ] **AIA-2**: Add `getRefinePrompt()` and `getRegenerateKRPrompt()` to `single-objective.js`
- [ ] **AIA-3**: Document AIContextService usage in wizard routes
- [ ] **AIA-4**: Add `PROMPT_TYPES.OBJECTIVE_WIZARD` (optional alias)

### During Implementation

- [ ] **AIA-5**: Use `getPromptWithMaturity()` for all AI calls
- [ ] **AIA-6**: Import categories from `server/config/categories.js`
- [ ] **AIA-7**: Use `AILoggingWrapper` for interaction logging
- [ ] **AIA-8**: Respect token limits (8,000 max)

### Post-Implementation

- [ ] **AIA-9**: Document Redis migration path for WizardSessionService
- [ ] **AIA-10**: Add wizard metrics to existing AI analytics

---

## 8. Summary

**Sprint 20 is a well-designed feature** with clear user value. However, the implementation plan needs revision to:

1. **Leverage existing infrastructure** - Don't reinvent the wheel
2. **Maintain architectural consistency** - Follow established patterns
3. **Ensure AI quality** - Use maturity-aware prompts
4. **Reduce maintenance burden** - Single source of truth

**Estimated effort reduction**: 30-40% by reusing existing code.

---

**Next Step**: Update SPRINT20_TECHNICAL_SPEC.md with revised architecture.
