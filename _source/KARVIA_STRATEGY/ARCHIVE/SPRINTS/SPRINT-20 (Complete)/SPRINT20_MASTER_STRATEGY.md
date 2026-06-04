# Sprint 20: Intelligent Objective Creation Wizard

**Document ID**: K2-S20-STRATEGY-001
**Version**: 1.1.0
**Created**: March 17, 2026
**Status**: STRATEGY APPROVED
**Sprint Type**: UI + AI Enhancement
**Estimated Points**: 50 pts

---

## Executive Summary

### The Problem

The current objective creation flow is a **single modal with blank fields**. Users stare at empty inputs and must:
- Know what a good objective looks like
- Understand SMART criteria intuitively
- Write Key Results from scratch
- Hope they're aligned with company strategy

**Result**: Poor quality objectives, low AI adoption, user friction.

### The Solution

Transform objective creation into a **3-screen guided wizard** with **session-based AI** that:
1. Asks simple questions (Category, Priority, What)
2. Proactively researches and refines the objective
3. Generates contextually-aware Key Results
4. Feels instant through pre-loaded AI sessions

### The Insight

> "When a user selects 'Customer Success' + 'High Priority', they're telling us the SSI assessment revealed a revenue leak. The AI already knows what to do."

We stop treating AI as an optional feature. It becomes the **default path** to quality objectives.

---

## Strategic Context

### Why This Sprint, Why Now

| Driver | Context |
|--------|---------|
| **Product Maturity** | Sprint 17-18 built Context Maturity + AI infrastructure. Time to use it. |
| **User Feedback** | "I don't know what to write" is the #1 friction point |
| **Competitive Edge** | No OKR tool offers session-based, context-aware objective creation |
| **New User Focus** | First-week users need guidance, not blank forms |

### Strategic Alignment

| Strategy Document | Alignment |
|-------------------|-----------|
| [ROADMAP_OVERVIEW.md](../../1-PRODUCT/roadmap/ROADMAP_OVERVIEW.md) | Phase 2: Intelligence - AI-powered features |
| [Sprint 17 - Context Maturity](../SPRINT-17%20(Complete)/SPRINT17_HANDOFF_DOCUMENT.md) | Uses ContextMaturityService, prompts infrastructure |
| [Sprint 18 - AI-Ready Profile](../SPRINT-18%20(Complete)/SPRINT18_HANDOFF_DOCUMENT.md) | Uses company profile context, maturity indicators |
| [AIContextService](../../../../server/services/AIContextService.js) | Provides buildContext() for session pre-loading |

### Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Objective quality score | N/A | 8/10 avg | AI evaluation of SMART criteria |
| Time to create objective | ~5 min | ~2 min | From click to save |
| AI adoption rate | ~30% | ~90% | % using guided flow vs manual |
| KR acceptance rate | ~60% | ~80% | % of AI KRs kept without edit |

---

## Product Vision

### Current State

```
┌─────────────────────────────────────────┐
│  Create Objective (Manual)         ✕   │
│  ─────────────────────────────────────  │
│                                         │
│  Objective Title*                       │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Description                            │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Category          Priority             │
│  [dropdown]        [dropdown]           │
│                                         │
│  Owner             Target Year          │
│  [dropdown]        [dropdown]           │
│                                         │
│  💡 Need help? Get AI suggestions →    │
│                                         │
│         [Cancel]  [Create Objective]    │
└─────────────────────────────────────────┘

Problems:
- Blank slate intimidation
- AI is hidden/optional
- No guidance on what to write
- No context awareness
- Cold API calls = slow
```

### Future State

```
SCREEN 1: Set Direction              SCREEN 2: Define Intent              SCREEN 3: Review & Generate
────────────────────────────         ────────────────────────────         ────────────────────────────

┌────────────────────────┐          ┌────────────────────────┐          ┌────────────────────────┐
│ Step 1 of 3            │          │ Step 2 of 3            │          │ Step 3 of 3            │
│                        │          │                        │          │                        │
│ Which area needs       │          │ What do you want to    │          │ ✨ Your Refined        │
│ attention?             │          │ achieve?               │          │ Objective:             │
│                        │          │                        │          │                        │
│ 🎯 Customer Success    │          │ ┌──────────────────┐   │          │ ┌──────────────────┐   │
│ 📈 Revenue Growth      │          │ │ Create a customer│   │          │ │ Create a compre- │   │
│ ⚡ Operations          │          │ │ onboarding doc...│   │          │ │ hensive customer │   │
│ 🧠 Innovation          │          │ └──────────────────┘   │          │ │ onboarding play- │   │
│                        │          │                        │          │ │ book reducing    │   │
│ How urgent?            │          │ 💡 SMART Tips:         │          │ │ time-to-value... │   │
│                        │          │ • Be specific          │          │ └──────────────────┘   │
│ ⚡ High  🔶 Medium      │          │ • Include measurable   │          │                        │
│ 🔵 Low                 │          │   outcomes             │          │ [Generate Key Results] │
│                        │          │                        │          │                        │
│          [Next →]      │          │   [← Back] [Next →]    │          │ KR1: ────────── [🔄]   │
│                        │          │                        │          │ KR2: ────────── [🔄]   │
│ ┌────────────────────┐ │          │                        │          │ KR3: ────────── [🔄]   │
│ │ 🔌 Loading AI...   │ │          │                        │          │ KR4: ────────── [🔄]   │
│ └────────────────────┘ │          │                        │          │                        │
│ (Pre-prompt in bg)     │          │                        │          │ [← Back] [Create All]  │
└────────────────────────┘          └────────────────────────┘          └────────────────────────┘
         │                                    │                                    │
         │                                    │                                    │
         ▼                                    ▼                                    ▼
   PRE-PROMPT FIRES                    PROMPT 1: REFINE                    PROMPT 2: KRs
   (Context loaded)                    (Instant response)                  (4 Key Results)
```

### Entry Point Integration

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     OBJECTIVES PAGE - ADD OBJECTIVE DROPDOWN             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────┐                                               │
│  │  + Add Objective  ▼  │                                               │
│  └──────────────────────┘                                               │
│           │                                                              │
│           ▼                                                              │
│  ┌──────────────────────────────────────┐                               │
│  │  ✏️  Create Manually                 │  ──→  Opens existing modal    │
│  │      Define your own objective       │       (NO CHANGE)              │
│  ├──────────────────────────────────────┤                               │
│  │  ✨  Generate with AI                │  ──→  REDIRECTS TO WIZARD     │
│  │      AI-powered objective creation   │       objective-wizard.html   │
│  └──────────────────────────────────────┘       (SPRINT 20 CHANGE)      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Code Change Required** (`client/pages/objectives.html`):
```javascript
// BEFORE (line 101)
onclick="openAIGenerationModal(); closeAddObjectiveDropdown();"

// AFTER
onclick="window.location.href='/pages/objective-wizard.html'; closeAddObjectiveDropdown();"
```

### User Journey

```
1. User clicks "Add Objective" dropdown
   └─→ Shows two options: "Create Manually" | "Generate with AI"

2. User clicks "Generate with AI"
   └─→ Browser navigates to /pages/objective-wizard.html
   └─→ Full page loads (replaces objectives page)

3. Screen 1: Select Category + Priority
   └─→ User picks "Customer Success" + "High"
   └─→ [Continue] clicked
   └─→ PRE-PROMPT fires in background (user doesn't wait)

4. Screen 2: Type what you want to achieve
   └─→ User types rough idea: "Create customer onboarding document..."
   └─→ SMART tips visible but non-intrusive
   └─→ [Continue] clicked
   └─→ PROMPT 1 fires (session warm = ~1-2 sec response)

5. Screen 3: See refined objective
   └─→ AI-refined objective displayed (editable)
   └─→ User can tweak or accept
   └─→ [Generate Key Results] clicked
   └─→ PROMPT 2 fires (still warm = ~2-3 sec)

6. Screen 3 (expanded): Review 4 KRs
   └─→ Each KR has [🔄] regenerate button
   └─→ Regenerate asks for feedback first
   └─→ [Create Objective + KRs] saves everything

7. Success → Redirect
   └─→ User redirected to Objectives page
   └─→ New objective visible with 4 KRs
   └─→ Toast: "Objective created successfully"
```

---

## Technical Architecture

### Session-Based AI Strategy

#### Why Sessions?

| Approach | Latency | User Experience |
|----------|---------|-----------------|
| Cold API call per screen | 3-5 sec each | Frustrating waits |
| **Session-based** | 1-2 sec after first | Feels instant |

#### Technology Choice: Chat Completions with Message Array

**Decision**: Use OpenAI Chat Completions API with maintained message history.

| Option | Scalability | Complexity | Control | Verdict |
|--------|-------------|------------|---------|---------|
| Assistants API (Threads) | High | High | Low | Over-engineered for 4-5 turns |
| **Chat Completions** | High | Low | High | **SELECTED** |

**Rationale**:
- Our wizard has max 5 turns (pre-prompt, refine, KRs, 1-2 regenerations)
- No need for persistent threads
- Full control over prompts
- Easier to debug
- Token usage predictable

#### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │  Screen 1   │───▶│  Screen 2   │───▶│  Screen 3   │                  │
│  │ Category +  │    │   "What"    │    │  Refined +  │                  │
│  │  Priority   │    │   Input     │    │    KRs      │                  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                  │
│         │                  │                  │                          │
│         │ onClick          │ onClick          │ onClick                  │
│         ▼                  ▼                  ▼                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    WIZARD STATE MANAGER                          │    │
│  │  • category, priority, whatInput, refinedObjective, krs[]       │    │
│  │  • conversationHistory[] (message array)                         │    │
│  │  • sessionActive: boolean                                        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                        │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │              NEW: /api/objective-wizard/*                       │     │
│  │                                                                 │     │
│  │  POST /initialize-session                                       │     │
│  │  ├─ Input: { category, priority, company_id }                  │     │
│  │  ├─ Action: Load context, build pre-prompt, call OpenAI        │     │
│  │  └─ Output: { session_id, ready: true }                        │     │
│  │                                                                 │     │
│  │  POST /refine-objective                                         │     │
│  │  ├─ Input: { session_id, what_input }                          │     │
│  │  ├─ Action: Append to conversation, call OpenAI                │     │
│  │  └─ Output: { refined_objective, reasoning }                   │     │
│  │                                                                 │     │
│  │  POST /generate-krs                                             │     │
│  │  ├─ Input: { session_id, objective }                           │     │
│  │  ├─ Action: Append to conversation, call OpenAI                │     │
│  │  └─ Output: { krs: [{title, metric, target, rationale}] }      │     │
│  │                                                                 │     │
│  │  POST /regenerate-kr                                            │     │
│  │  ├─ Input: { session_id, kr_index, feedback }                  │     │
│  │  ├─ Action: Append feedback, regenerate specific KR            │     │
│  │  └─ Output: { kr: {title, metric, target, rationale} }         │     │
│  │                                                                 │     │
│  │  POST /finalize                                                 │     │
│  │  ├─ Input: { session_id, objective, krs, owner_id, year }      │     │
│  │  ├─ Action: Save to DB, close session                          │     │
│  │  └─ Output: { objective_id, success: true }                    │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │              SESSION STORE (In-Memory/Redis)                    │     │
│  │                                                                 │     │
│  │  sessions: {                                                    │     │
│  │    "sess_abc123": {                                            │     │
│  │      company_id: "...",                                        │     │
│  │      user_id: "...",                                           │     │
│  │      category: "customer_success",                             │     │
│  │      priority: "high",                                         │     │
│  │      conversation: [                                           │     │
│  │        { role: "system", content: PRE_PROMPT },                │     │
│  │        { role: "assistant", content: "Ready..." },             │     │
│  │        { role: "user", content: "Create onboarding..." },      │     │
│  │        { role: "assistant", content: "Refined: ..." },         │     │
│  │        ...                                                     │     │
│  │      ],                                                        │     │
│  │      created_at: Date,                                         │     │
│  │      expires_at: Date (created + 30 min)                       │     │
│  │    }                                                           │     │
│  │  }                                                             │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │              EXISTING: AIContextService                         │     │
│  │                                                                 │     │
│  │  buildContext(company_id) → {                                  │     │
│  │    company: {...},                                             │     │
│  │    ssi: { speed, strength, intelligence, insights },          │     │
│  │    objectives: [...existing objectives...],                    │     │
│  │    maturity: { stage, score, recommendations }                 │     │
│  │  }                                                             │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │              OpenAI API                                         │     │
│  │              (Chat Completions - gpt-4)                         │     │
│  └────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Session Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                     SESSION LIFECYCLE                                 │
│                                                                       │
│  CREATED ────────▶ ACTIVE ────────▶ CLOSED                           │
│     │                 │                │                              │
│     │                 │                │                              │
│  /initialize       /refine          /finalize                        │
│  /session          /generate-krs    OR                               │
│                    /regenerate-kr   timeout (30 min)                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ TIMEOUT HANDLING                                                 │ │
│  │                                                                  │ │
│  │ If session expires:                                              │ │
│  │ • Frontend detects 404/expired response                         │ │
│  │ • Shows: "Session expired. Starting fresh..."                   │ │
│  │ • Redirects to Screen 1                                         │ │
│  │ • User selections preserved in localStorage                      │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### localStorage State Recovery

**Keys for preserving user progress on session timeout:**

| Key | Type | Purpose |
|-----|------|---------|
| `karvia_wizard_category` | string | Selected category (e.g., 'growth') |
| `karvia_wizard_priority` | string | Selected priority ('high', 'medium', 'low') |
| `karvia_wizard_what` | string | User's "what do you want to achieve" input |
| `karvia_wizard_screen` | number | Last active screen (1, 2, or 3) |
| `karvia_wizard_timestamp` | number | When state was saved (for expiry check) |

**Lifecycle:**
1. Save to localStorage on each screen transition
2. On wizard load, check for existing state < 24 hours old
3. If found, offer to resume: "Continue where you left off?"
4. Clear localStorage on successful objective creation or explicit cancel

### Session Cleanup Strategy

**In-memory session store cleanup to prevent memory leaks:**

```javascript
// server/services/WizardSessionService.js
const CLEANUP_INTERVAL = 5 * 60 * 1000;  // 5 minutes
const SESSION_TTL = 30 * 60 * 1000;       // 30 minutes

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.created_at > SESSION_TTL) {
      sessions.delete(sessionId);
      logger.info(`[WizardSession] Cleaned up expired session: ${sessionId}`);
    }
  }
}, CLEANUP_INTERVAL);
```

**Metrics to log:**
- Sessions created per hour
- Sessions completed vs abandoned
- Average session duration

### Error Handling Strategy

| Error | User Message | Action |
|-------|--------------|--------|
| OpenAI API failure | "AI is temporarily unavailable. Please try again." | Log error, show retry button |
| Session expired | "Your session timed out. Let's start fresh." | Redirect to Screen 1 |
| Rate limit | "Too many requests. Please wait a moment." | Show countdown timer |
| Network error | "Connection lost. Check your internet." | Retry with exponential backoff |

**No Fallback Strategy**: As specified, if AI generation fails, we debug and fix. This is not a high-frequency daily task - quality over degraded experience.

---

## Prompt Engineering

### Pre-Prompt (Session Initialization)

```markdown
SYSTEM PROMPT (Pre-loaded on Screen 1 → Next)
═══════════════════════════════════════════════════════════════════════

You are Karvia Coach, an expert OKR strategist. You help business leaders
create strategic, measurable objectives aligned with their company context.

## YOUR CONTEXT

### Company Profile
- Name: {{company.name}}
- Industry: {{company.industry}}
- Size: {{company.employee_count}} employees
- Business Model: {{company.business_model}}
- Strategic Priority: {{company.strategic_priority}}

### SSI Assessment Insights
- Speed Score: {{ssi.speed}}/100 ({{ssi.speed_insight}})
- Strength Score: {{ssi.strength}}/100 ({{ssi.strength_insight}})
- Intelligence Score: {{ssi.intelligence}}/100 ({{ssi.intelligence_insight}})
- Primary Gap: {{ssi.primary_gap}}
- Key Strength: {{ssi.key_strength}}

### User Selection
- Category: {{category}}
- Priority: {{priority}}
- Implication: {{category_priority_insight}}

### Existing Objectives (Avoid Duplicates)
{{#each existing_objectives}}
- {{this.title}} ({{this.category}}, {{this.status}})
{{/each}}

### Context Maturity
- Stage: {{maturity.stage}} ({{maturity.stage_name}})
- Recommendations: {{maturity.recommendations}}

## YOUR CAPABILITIES

1. REFINE OBJECTIVES
   - Transform vague ideas into SMART objectives
   - Ensure alignment with company strategy
   - Add measurable outcomes
   - Include realistic timeframes

2. GENERATE KEY RESULTS
   - Create 4 measurable KRs per objective
   - Balance leading and lagging indicators
   - Include stretch targets
   - Align with SSI gaps

3. PROVIDE REASONING
   - Explain why each suggestion fits
   - Reference company context
   - Highlight strategic alignment

## RESPONSE FORMAT

Always respond in JSON format:
{
  "type": "refine|krs|regenerate",
  "content": {...},
  "reasoning": "..."
}

Acknowledge readiness with: {"type": "ready", "message": "..."}
═══════════════════════════════════════════════════════════════════════
```

### Prompt 1: Refine Objective

```markdown
USER PROMPT (Screen 2 → Next)
═══════════════════════════════════════════════════════════════════════

The user wants to achieve the following:

"{{user_what_input}}"

Transform this into a SMART objective:
- Specific: Clear and unambiguous
- Measurable: Quantifiable outcome
- Achievable: Realistic given context
- Relevant: Aligned with {{category}} and company strategy
- Time-bound: Has a deadline

Consider:
- Their SSI gap in {{ssi.primary_gap}}
- Their selected priority: {{priority}}
- Existing objectives (avoid overlap)

Respond in JSON:
{
  "type": "refine",
  "content": {
    "title": "The refined objective title",
    "description": "1-2 sentence description"
  },
  "reasoning": "Why this refinement improves the original"
}
═══════════════════════════════════════════════════════════════════════
```

### Prompt 2: Generate Key Results

```markdown
USER PROMPT (Screen 3 → Generate KRs)
═══════════════════════════════════════════════════════════════════════

Generate 4 Key Results for this objective:

"{{refined_objective}}"

Requirements for each KR:
- Must be measurable (number, percentage, yes/no)
- Must contribute directly to the objective
- Should be achievable within the objective timeframe
- Mix of leading indicators (activities) and lagging indicators (outcomes)

Consider the company's:
- Industry: {{company.industry}}
- Size: {{company.employee_count}} employees
- SSI scores: Speed {{ssi.speed}}, Strength {{ssi.strength}}, Intelligence {{ssi.intelligence}}

Respond in JSON:
{
  "type": "krs",
  "content": {
    "krs": [
      {
        "title": "KR title",
        "metric_type": "percentage|number|currency|boolean",
        "baseline": "current state",
        "target": "desired state",
        "rationale": "why this KR matters"
      },
      // ... 3 more
    ]
  },
  "reasoning": "Overall strategy behind these KRs"
}
═══════════════════════════════════════════════════════════════════════
```

### Prompt 3: Regenerate KR (with Feedback)

```markdown
USER PROMPT (KR [🔄] click → after feedback)
═══════════════════════════════════════════════════════════════════════

The user wants to regenerate KR #{{kr_index}}:

Current KR: "{{current_kr.title}}"
Target: {{current_kr.target}}

User feedback: "{{user_feedback}}"

Generate an alternative KR that:
- Addresses the user's feedback
- Still contributes to: "{{objective}}"
- Remains measurable and achievable

Respond in JSON:
{
  "type": "regenerate",
  "content": {
    "kr": {
      "title": "New KR title",
      "metric_type": "...",
      "baseline": "...",
      "target": "...",
      "rationale": "..."
    }
  },
  "reasoning": "How this addresses the feedback"
}
═══════════════════════════════════════════════════════════════════════
```

---

## Implementation Plan

### Epic Breakdown

| Epic | Points | Focus | Order |
|------|--------|-------|-------|
| **OW-PREREQ** | 3 | Pre-requisite infrastructure work (from Impact Analysis) | 1st (Day 0) |
| **OW-IMPACT** | 5 | Impact analysis + deprecation plan | 2nd (Day 1) |
| **OW-UI** | 18 | 3-screen wizard UI components | 3rd |
| **OW-API** | 12 | Backend session endpoints | 4th |
| **OW-PROMPT** | 5 | Prompt extension + testing (REDUCED - reusing existing) | 5th |
| **OW-INTEG** | 7 | Integration + polish | 6th |
| **Total** | **50** | | |

---

### Epic OW-PREREQ: Pre-Requisite Infrastructure (3 pts)

**Purpose**: Address architectural findings from Impact Analysis audit (AH-13, AH-14, AM-11) before building new features. This ensures we leverage existing infrastructure rather than duplicating code.

**Source**: [SPRINT20_IMPACT_ANALYSIS.md](./SPRINT20_IMPACT_ANALYSIS.md) - Findings #1-#4

| Story | Points | Priority | Description |
|-------|--------|----------|-------------|
| OW-PREREQ-1 | 1 | HIGH | Extend `single-objective.js` with `getRefinePrompt()` method |
| OW-PREREQ-2 | 1 | HIGH | Extend `single-objective.js` with `getRegenerateKRPrompt()` method |
| OW-PREREQ-3 | 1 | MEDIUM | Document `AIContextService.buildContext()` usage pattern for wizard |

**Resolves Audit Findings**:
- **AH-13**: Prompt Duplication Risk → Extend existing instead of creating new files
- **AH-14**: Missing Maturity Integration → Use `getPromptWithMaturity()`
- **AM-11**: Context Building Duplication → Use `AIContextService.buildContext()`

**Files to Modify**:

```
server/prompts/endpoint-templates/single-objective.js  // Add wizard methods
```

**Code Changes Required**:

```javascript
// ADD to server/prompts/endpoint-templates/single-objective.js

/**
 * Sprint 20: Wizard-specific - Refine user's rough objective input
 * @param {string} roughInput - User's initial "what do you want to achieve"
 * @param {Object} context - Context from AIContextService.buildContext()
 * @returns {string} Prompt for objective refinement
 */
function getRefinePrompt(roughInput, context) {
  return `${getBasePrompt()}

USER INPUT: "${roughInput}"
CATEGORY: ${context.category || 'Not specified'}
PRIORITY: ${context.priority || 'medium'}

COMPANY CONTEXT:
- Industry: ${context.company?.industry || 'General Business'}
- SSI Weak Areas: ${context.ssi?.weakAreas?.map(w => w.dimension).join(', ') || 'None identified'}
- Strategic Priority: ${context.business?.strategic_vision?.priority_one || 'Not defined'}

TASK: Transform this rough idea into a SMART objective statement.
- Make it Specific (clear what will be achieved)
- Make it Measurable (quantifiable outcome)
- Make it Achievable (realistic given context)
- Make it Relevant (aligned with company priorities)
- Make it Time-bound (clear deadline/period)

OUTPUT FORMAT (JSON):
{
  "refined_title": "Action-oriented objective statement (10-15 words max)",
  "description": "2-3 sentences explaining the why and business impact",
  "reasoning": "Why this refinement improves the original input"
}`;
}

/**
 * Sprint 20: Wizard-specific - Regenerate a single KR with user feedback
 * @param {number} krIndex - Which KR to regenerate (0-3)
 * @param {string} feedback - User's feedback on what to change
 * @param {Array} existingKRs - Current list of KRs for context
 * @param {Object} context - Full context from buildContext()
 * @returns {string} Prompt for KR regeneration
 */
function getRegenerateKRPrompt(krIndex, feedback, existingKRs, context) {
  const otherKRs = existingKRs.filter((_, i) => i !== krIndex);

  return `${getBasePrompt()}

OBJECTIVE: ${context.objective?.title || 'Not specified'}

EXISTING KRs (do not duplicate these):
${otherKRs.map((kr, i) => `${i + 1}. ${kr.title}`).join('\n')}

KR TO REPLACE: ${existingKRs[krIndex]?.title || 'N/A'}

USER FEEDBACK: "${feedback}"

TASK: Generate ONE replacement Key Result that:
1. Addresses the user's feedback directly
2. Does NOT duplicate any existing KRs
3. Is measurable with clear target
4. Aligns with the objective

OUTPUT FORMAT (JSON):
{
  "title": "Measurable KR statement with specific target",
  "metric_type": "percentage | number | currency | binary",
  "baseline": "Current state (null if unknown)",
  "target": "Target value/state",
  "rationale": "Why this KR addresses the feedback"
}`;
}

// Update module.exports
module.exports = {
  getBasePrompt,
  getStageOverlay,
  getCategoryExamples,
  getRefinePrompt,        // NEW - Sprint 20
  getRegenerateKRPrompt,  // NEW - Sprint 20
  STAGE_OVERLAYS
};
```

**Acceptance Criteria**:
- [ ] `single-objective.js` exports `getRefinePrompt()` method
- [ ] `single-objective.js` exports `getRegenerateKRPrompt()` method
- [ ] Both methods accept context from `AIContextService.buildContext()`
- [ ] No new prompt files created in `server/prompts/objective-wizard/`
- [ ] Unit tests pass for new methods

**Dependencies**:
- None (modifies existing infrastructure)

**Blocks**:
- OW-PROMPT (reduced scope)
- OW-API (uses these methods)

---

### Epic OW-IMPACT: Impact Analysis & Deprecation Plan (5 pts)

**Purpose**: Before building, understand exactly what we're replacing and its downstream effects.

| Story | Points | Description |
|-------|--------|-------------|
| OW-IMPACT-1 | 2 | Modal deprecation analysis - identify all entry points |
| OW-IMPACT-2 | 2 | Link/redirect audit - find all references to old modal |
| OW-IMPACT-3 | 1 | Migration plan document - user data, localStorage, state |

**Deliverables**:
- `SPRINT20_IMPACT_ANALYSIS.md` - Detailed deprecation plan

**Analysis Scope**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     IMPACT ANALYSIS CHECKLIST                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│ 1. MODAL ENTRY POINTS                                               │
│    □ objectives.html - "Add Objective" button                       │
│    □ objectives.html - dropdown menu options                        │
│    □ OKR wizard existing (okr-creation-wizard.html)                │
│    □ Dashboard quick actions (if any)                               │
│    □ Planning page (if any create links)                            │
│                                                                      │
│ 2. JAVASCRIPT DEPENDENCIES                                          │
│    □ objectives.js - modal functions (openCreateObjectiveModal)    │
│    □ okr-wizard.js - existing wizard component                      │
│    □ common.js - shared modal utilities                             │
│    □ Any localStorage keys for draft state                          │
│                                                                      │
│ 3. API ENDPOINTS AFFECTED                                           │
│    □ POST /api/objectives - still needed for final save            │
│    □ Any AI endpoints being replaced                                │
│                                                                      │
│ 4. USER FLOWS TO PRESERVE                                           │
│    □ Manual creation (still possible via wizard)                    │
│    □ AI generation from SSI (team-ssi-view.html)                   │
│    □ Bulk OKR generation                                            │
│                                                                      │
│ 5. ROLLBACK PLAN                                                    │
│    □ How to restore old modal if issues found                       │
│    □ Feature flag consideration                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Files to Analyze**:
- `client/pages/objectives.html` - Modal HTML + triggers
- `client/pages/scripts/objectives.js` - Modal JS logic
- `client/pages/okr-creation-wizard.html` - Existing wizard (overlap?)
- `client/js/components/okr-wizard.js` - Existing wizard component

**Files to Create**:
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-20 (Planned)/SPRINT20_IMPACT_ANALYSIS.md`

---

### Epic OW-UI: Wizard UI Components (18 pts)

| Story | Points | Description |
|-------|--------|-------------|
| OW-UI-1 | 5 | Screen 1: Category + Priority selection |
| OW-UI-2 | 5 | Screen 2: "What" input with SMART hints |
| OW-UI-3 | 5 | Screen 3: Refined objective + KR cards |
| OW-UI-4 | 3 | Wizard navigation + state management |

**Files to Create**:
- `client/pages/objective-wizard.html` - 3-screen wizard page
- `client/pages/scripts/objective-wizard.js` - Wizard logic + state
- `client/css/objective-wizard.css` - Wizard-specific styles

**Files to Modify**:
- `client/pages/objectives.html` - Update "Add Objective" button to open wizard
- `client/js/navigation.js` - Add wizard route if needed

### Epic OW-API: Backend Session Endpoints (12 pts)

| Story | Points | Description |
|-------|--------|-------------|
| OW-API-1 | 4 | POST /initialize-session endpoint (uses `AIContextService.buildContext()`) |
| OW-API-2 | 3 | POST /refine-objective endpoint (uses `singleObjective.getRefinePrompt()`) |
| OW-API-3 | 3 | POST /generate-krs endpoint (uses `getPromptWithMaturity()`) |
| OW-API-4 | 2 | POST /regenerate-kr + /finalize endpoints |

**Files to Create**:
- `server/routes/objective-wizard.js` - All wizard endpoints
- `server/services/WizardSessionService.js` - Session management

**Files to Modify**:
- `server/index.js` - Register new routes

**CRITICAL: Code Reuse Requirements** (from Impact Analysis):

```javascript
// server/routes/objective-wizard.js - MUST use these patterns

const AIContextService = require('../services/AIContextService');
const { getPromptWithMaturity, PROMPT_TYPES } = require('../prompts');
const singleObjective = require('../prompts/endpoint-templates/single-objective');
const { OBJECTIVE_CATEGORIES } = require('../config/categories');
const WizardSessionService = require('../services/WizardSessionService');

// POST /initialize-session
router.post('/initialize-session', authenticateToken, async (req, res) => {
  const { category, priority } = req.body;
  const companyId = req.user.company_id;

  // ✅ REUSE: Build context using existing 2,096-line service
  const context = await AIContextService.buildContext(companyId, { scope: 'okr' });

  // ✅ REUSE: Get maturity-aware prompt (Stage 0-4)
  const promptData = await getPromptWithMaturity(
    companyId,
    PROMPT_TYPES.SINGLE_OBJECTIVE,
    { category, priority, ...context }
  );

  // Create session with preloaded context
  const session = WizardSessionService.createSession(
    req.user._id, companyId, category, priority
  );
  session.context = context;
  session.promptData = promptData;
  session.maturityStage = promptData.maturity.stage;

  res.json({ success: true, session_id: session.id, ... });
});

// POST /refine-objective
router.post('/refine-objective', authenticateToken, async (req, res) => {
  const { session_id, what_input } = req.body;
  const session = WizardSessionService.getSession(session_id);

  // ✅ REUSE: Use extended method from OW-PREREQ
  const refinePrompt = singleObjective.getRefinePrompt(what_input, session.context);

  // Call OpenAI with maturity-aware system prompt
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: session.promptData.systemPrompt },
      { role: 'user', content: refinePrompt }
    ]
  });

  res.json({ success: true, refined_objective: JSON.parse(completion.choices[0].message.content) });
});
```

**Depends On**:
- OW-PREREQ (must complete first - provides `getRefinePrompt()` and `getRegenerateKRPrompt()`)

### Epic OW-PROMPT: Prompt Engineering (5 pts) — REVISED

**Note**: Reduced from 8 pts to 5 pts. OW-PREREQ handles prompt extension. This epic now focuses on integration testing and KR generation prompt (which uses existing `single-objective.js` stage overlays).

| Story | Points | Description |
|-------|--------|-------------|
| OW-PROMPT-1 | 2 | Pre-prompt integration: use `getPromptWithMaturity()` in session init |
| OW-PROMPT-2 | 2 | KR generation: use existing `single-objective.js` with KR focus |
| OW-PROMPT-3 | 1 | Prompt testing + refinement across maturity stages |

**Files to Create**:
- ~~`server/prompts/objective-wizard/pre-prompt.js`~~ NOT NEEDED - use `getPromptWithMaturity()`
- ~~`server/prompts/objective-wizard/refine.js`~~ NOT NEEDED - added to `single-objective.js` in OW-PREREQ
- ~~`server/prompts/objective-wizard/generate-krs.js`~~ NOT NEEDED - use existing `single-objective.js`
- ~~`server/prompts/objective-wizard/regenerate-kr.js`~~ NOT NEEDED - added to `single-objective.js` in OW-PREREQ

**Files to Modify**:
- `server/prompts/index.js` - Add `PROMPT_TYPES.OBJECTIVE_WIZARD_REFINE` alias (optional)

**Code Pattern to Use in OW-API**:
```javascript
// In wizard routes - use existing infrastructure
const AIContextService = require('../services/AIContextService');
const { getPromptWithMaturity, PROMPT_TYPES } = require('../prompts');
const singleObjective = require('../prompts/endpoint-templates/single-objective');

// Session initialization
const context = await AIContextService.buildContext(companyId, { scope: 'okr' });
const promptData = await getPromptWithMaturity(companyId, PROMPT_TYPES.SINGLE_OBJECTIVE, context);

// Objective refinement
const refinePrompt = singleObjective.getRefinePrompt(userInput, context);

// KR regeneration
const regenPrompt = singleObjective.getRegenerateKRPrompt(krIndex, feedback, existingKRs, context);
```

**Acceptance Criteria**:
- [ ] All wizard AI calls use `getPromptWithMaturity()` for maturity-aware prompts
- [ ] Context built using `AIContextService.buildContext(companyId, { scope: 'okr' })`
- [ ] Stage 0 (Discovery) prompts use industry benchmarks
- [ ] Stage 3+ (Learning) prompts include historical success patterns
- [ ] No new prompt files created (all in existing `single-objective.js`)

### Epic OW-INTEG: Integration + Polish (7 pts)

| Story | Points | Description |
|-------|--------|-------------|
| OW-INTEG-1 | 3 | Wire UI to API, end-to-end flow |
| OW-INTEG-2 | 2 | Loading states, error handling |
| OW-INTEG-3 | 2 | Redirect from old modal, deprecation |

---

## Dependencies

### Required (Must Exist)

| Dependency | Location | Status |
|------------|----------|--------|
| AIContextService.buildContext() | [server/services/AIContextService.js](../../../../server/services/AIContextService.js) | ✅ Exists (Sprint 10) |
| ContextMaturityService | [server/services/ContextMaturityService.js](../../../../server/services/ContextMaturityService.js) | ✅ Exists (Sprint 17) |
| Prompts infrastructure | [server/prompts/](../../../../server/prompts/) | ✅ Exists (Sprint 17) |
| Company Profile fields | [server/models/Company.js](../../../../server/models/Company.js) | ✅ Exists |
| OpenAI API integration | [server/routes/ai-okr.js](../../../../server/routes/ai-okr.js) | ✅ Exists |

### Optional (Nice to Have)

| Dependency | Location | Benefit |
|------------|----------|---------|
| Redis for sessions | - | Persistent sessions across server restarts |
| BenchmarkProvider | [server/services/BenchmarkProvider.js](../../../../server/services/BenchmarkProvider.js) | Industry-specific KR suggestions |

---

## Reference Documents

### Strategy Documents
- [ROADMAP_OVERVIEW.md](../../1-PRODUCT/roadmap/ROADMAP_OVERVIEW.md) - Product roadmap
- [PRODUCT_VISION.md](../../1-PRODUCT/PRODUCT_VISION.md) - Long-term vision

### Technical Documents
- [CLAUDE.md](../../../../CLAUDE.md) - Architecture overview, conventions
- [AIContextService.js](../../../../server/services/AIContextService.js) - Context building (2059 lines)
- [ContextMaturityService.js](../../../../server/services/ContextMaturityService.js) - Maturity stages

### Sprint References
- [Sprint 17 Handoff](../SPRINT-17%20(Complete)/SPRINT17_HANDOFF_DOCUMENT.md) - Prompt system, context maturity
- [Sprint 18 Handoff](../SPRINT-18%20(Complete)/SPRINT18_HANDOFF_DOCUMENT.md) - AI-ready company profile

### Existing Code Patterns
- [ai-okr.js](../../../../server/routes/ai-okr.js) - OKR generation patterns
- [objectives.js routes](../../../../server/routes/objectives.js) - Objective CRUD

---

## Locked-In Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Category/Priority values** | Use existing Objective model enum | Consistency with data model, no migration needed |
| **Session storage** | In-memory (Sprint 20), Redis (future) | Zero latency, simple; migrate when scaling |
| **Session timeout** | 30 minutes | Users get distracted; generous timeout |
| **Wizard entry** | Replace AI modal only; keep manual modal | "Generate with AI" → wizard page; "Create Manually" → existing modal |
| **KR count** | 4 Key Results | Balanced, not overwhelming |
| **KR regeneration** | Ask for feedback first | Better results through user input |
| **Fallback strategy** | None - show error, debug/fix | Not a daily task; quality over degraded UX |
| **Wizard naming** | "Smart Objective Wizard" (new) vs "OKR Template Wizard" (existing) | Clear differentiation; existing wizard uses industry templates, new wizard uses AI |

### Wizard Differentiation Strategy

**Two wizards, different purposes:**

| Wizard | File | Purpose | When to Use |
|--------|------|---------|-------------|
| **Smart Objective Wizard** (NEW) | `objective-wizard.html` | AI-powered, session-based, context-aware | Primary path for creating objectives |
| **OKR Template Wizard** (EXISTING) | `okr-creation-wizard.html` | Industry template-based, manual selection | When user wants predefined industry objectives |

**Navigation labels:**
- New wizard: "Create Objective" (default action)
- Existing wizard: "Use Industry Templates" (secondary option in dropdown)

**Post-Sprint 20:** Evaluate if template wizard is still needed or can be deprecated based on usage metrics.

### Category Enum (from Objective model)
```javascript
category: ['growth', 'customer_success', 'operations',
           'people_culture', 'innovation', 'financial_health']
priority: ['high', 'medium', 'low']
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OpenAI latency spikes | Medium | High | Pre-loading reduces impact; timeout handling |
| Users abandon mid-wizard | Medium | Medium | Save progress to localStorage |
| KR quality inconsistent | Low | Medium | Prompt iteration; feedback loop for improvement |
| Session state lost | Low | High | Graceful restart from Screen 1 |

---

## Definition of Done

- [ ] **Impact analysis complete** - All entry points documented
- [ ] **Deprecation plan approved** - Migration path clear
- [ ] 3-screen wizard functional end-to-end
- [ ] Session-based AI with pre-loading works
- [ ] Objective refinement feels instant (<2 sec)
- [ ] KR generation completes in <3 sec
- [ ] KR regeneration with feedback works
- [ ] Old modal replaced or redirects to wizard
- [ ] Error states handled gracefully
- [ ] No fallback required - AI availability is prerequisite

---

## Next Steps

1. ✅ **Strategy approved** - Decisions locked in
2. **Execute Epic OW-IMPACT** (Day 1) - Impact analysis before any code
3. **Create SPRINT20_TECHNICAL_SPEC.md** - Detailed code specs
4. **Create SPRINT20_HANDOFF_DOCUMENT.md** - Execution tracking
5. **Begin Epic OW-UI** - After impact analysis complete

### Execution Order

```
Day 1:     OW-IMPACT (5 pts) - Analyze before building
Days 2-4:  OW-UI (18 pts) - Build 3 screens
Days 5-6:  OW-API (12 pts) - Backend endpoints
Days 7-8:  OW-PROMPT (8 pts) - Prompt engineering
Days 9-10: OW-INTEG (7 pts) - Wire together + polish
```

---

**Document Status**: APPROVED
**Author**: Claude (Strategy Session)
**Approved By**: User (March 17, 2026)
**Last Updated**: March 17, 2026
