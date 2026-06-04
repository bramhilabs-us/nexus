# Sprint 20: Technical Specification

**Document ID**: K3-S20-TECHSPEC-001
**Version**: 1.0.0
**Created**: March 18, 2026
**Status**: IN PROGRESS
**Parent**: [SPRINT20_MASTER_STRATEGY.md](./SPRINT20_MASTER_STRATEGY.md)

---

## Overview

This document provides detailed technical specifications for implementing the Intelligent Objective Creation Wizard. It supplements the strategy document with implementation-ready details.

---

## 1. File Structure

### New Files to Create

```
client/
├── pages/
│   ├── objective-wizard.html          # 3-screen wizard page
│   └── scripts/
│       └── objective-wizard.js         # Wizard logic + state management
├── css/
│   └── objective-wizard.css            # Wizard-specific styles

server/
├── routes/
│   └── objective-wizard.js             # 5 new API endpoints
└── services/
    └── WizardSessionService.js         # Session management + cleanup
```

### Files to Modify (CRITICAL - Code Reuse)

| File | Change | Priority |
|------|--------|----------|
| `server/prompts/endpoint-templates/single-objective.js` | Add `getRefinePrompt()` + `getRegenerateKRPrompt()` methods | **PREREQ** |
| `server/index.js` | Register `/api/objective-wizard` routes | High |
| `client/pages/objectives.html` | Change "Generate with AI" to redirect to wizard | High |
| `client/js/navigation.js` | Add wizard route (if needed) | Medium |

### Files NOT to Create (Leverage Existing)

| ~~Proposed~~ | Use Instead | Reason |
|--------------|-------------|--------|
| ~~`server/prompts/objective-wizard/pre-prompt.js`~~ | `getPromptWithMaturity()` from `server/prompts/index.js` | Already handles maturity stages 0-4 |
| ~~`server/prompts/objective-wizard/refine.js`~~ | `getRefinePrompt()` added to `single-objective.js` | Extends existing template |
| ~~`server/prompts/objective-wizard/generate-krs.js`~~ | `single-objective.js` base prompt | Already generates KRs |
| ~~`server/prompts/objective-wizard/regenerate-kr.js`~~ | `getRegenerateKRPrompt()` added to `single-objective.js` | Extends existing template |

### Dependencies to Import in Routes

```javascript
// server/routes/objective-wizard.js - Required imports
const AIContextService = require('../services/AIContextService');
const { getPromptWithMaturity, PROMPT_TYPES } = require('../prompts');
const singleObjective = require('../prompts/endpoint-templates/single-objective');
const { OBJECTIVE_CATEGORIES } = require('../config/categories');
const WizardSessionService = require('../services/WizardSessionService');
```

### Entry Point Code Change

**File**: `client/pages/objectives.html` (line ~101)

```html
<!-- BEFORE -->
<button onclick="openAIGenerationModal(); closeAddObjectiveDropdown();" ...>
  Generate with AI
</button>

<!-- AFTER -->
<button onclick="window.location.href='/pages/objective-wizard.html';" ...>
  Generate with AI
</button>
```

**Note**: The "Create Manually" option remains unchanged - it still opens the existing modal.

---

## 2. API Endpoints

### 2.1 POST /api/objective-wizard/initialize-session

**Purpose**: Create session, load context, fire pre-prompt

**Request:**
```json
{
  "category": "growth",
  "priority": "high"
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "sess_abc123def456",
  "ready": true,
  "expires_at": "2026-03-18T15:30:00Z"
}
```

**Implementation Notes:**
- Generate UUID for session_id
- Call `AIContextService.buildContext(company_id)`
- Build pre-prompt with context
- Fire OpenAI API call asynchronously
- Store session in memory with 30-min TTL

### 2.2 POST /api/objective-wizard/refine-objective

**Purpose**: Refine user's rough objective into SMART format

**Request:**
```json
{
  "session_id": "sess_abc123def456",
  "what_input": "Create customer onboarding documentation"
}
```

**Response:**
```json
{
  "success": true,
  "refined_objective": {
    "title": "Create comprehensive customer onboarding playbook reducing time-to-value by 40%",
    "description": "Develop standardized onboarding documentation and training materials..."
  },
  "reasoning": "The original goal lacked measurable outcomes. Added 40% reduction target..."
}
```

### 2.3 POST /api/objective-wizard/generate-krs

**Purpose**: Generate 4 Key Results for the objective

**Request:**
```json
{
  "session_id": "sess_abc123def456",
  "objective": "Create comprehensive customer onboarding playbook..."
}
```

**Response:**
```json
{
  "success": true,
  "krs": [
    {
      "title": "Reduce customer time-to-first-value from 14 to 7 days",
      "metric_type": "number",
      "baseline": "14 days",
      "target": "7 days",
      "rationale": "Faster onboarding correlates with higher retention..."
    }
  ],
  "reasoning": "Balanced leading and lagging indicators..."
}
```

### 2.4 POST /api/objective-wizard/regenerate-kr

**Purpose**: Regenerate a single KR with user feedback

**Request:**
```json
{
  "session_id": "sess_abc123def456",
  "kr_index": 2,
  "feedback": "Make it more specific to our consulting industry"
}
```

**Response:**
```json
{
  "success": true,
  "kr": {
    "title": "Achieve 90% client satisfaction in onboarding surveys",
    "metric_type": "percentage",
    "baseline": "75%",
    "target": "90%",
    "rationale": "Direct measure of onboarding effectiveness..."
  }
}
```

### 2.5 POST /api/objective-wizard/finalize

**Purpose**: Save objective + KRs to database, close session

**Request:**
```json
{
  "session_id": "sess_abc123def456",
  "objective": {
    "title": "Create comprehensive customer onboarding playbook...",
    "description": "...",
    "category": "customer_success",
    "priority": "high",
    "owner_id": "user_123",
    "target_year": 2026
  },
  "krs": [
    { "title": "...", "metric_type": "number", "target": "..." }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "objective_id": "obj_789xyz",
  "key_result_ids": ["kr_1", "kr_2", "kr_3", "kr_4"],
  "redirect": "/pages/objectives.html"
}
```

---

## 3. Session Management

### WizardSessionService

```javascript
// server/services/WizardSessionService.js

class WizardSessionService {
  constructor() {
    this.sessions = new Map();
    this.SESSION_TTL = 30 * 60 * 1000;  // 30 minutes
    this.CLEANUP_INTERVAL = 5 * 60 * 1000;  // 5 minutes
    this.startCleanupInterval();
  }

  createSession(userId, companyId, category, priority) {
    const sessionId = `sess_${uuid.v4().replace(/-/g, '').slice(0, 12)}`;
    const session = {
      id: sessionId,
      user_id: userId,
      company_id: companyId,
      category,
      priority,
      conversation: [],
      created_at: Date.now(),
      expires_at: Date.now() + this.SESSION_TTL
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (Date.now() > session.expires_at) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  appendMessage(sessionId, role, content) {
    const session = this.getSession(sessionId);
    if (!session) throw new Error('Session not found or expired');
    session.conversation.push({ role, content });
    return session;
  }

  closeSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      for (const [id, session] of this.sessions.entries()) {
        if (now > session.expires_at) {
          this.sessions.delete(id);
          cleaned++;
        }
      }
      if (cleaned > 0) {
        logger.info(`[WizardSession] Cleaned ${cleaned} expired sessions`);
      }
    }, this.CLEANUP_INTERVAL);
  }
}

module.exports = new WizardSessionService();
```

---

## 4. localStorage Keys

| Key | Type | Example | Expiry |
|-----|------|---------|--------|
| `karvia_wizard_category` | string | `"growth"` | 24 hours |
| `karvia_wizard_priority` | string | `"high"` | 24 hours |
| `karvia_wizard_what` | string | `"Improve customer onboarding"` | 24 hours |
| `karvia_wizard_screen` | number | `2` | 24 hours |
| `karvia_wizard_timestamp` | number | `1710771234567` | N/A |

**Frontend helper:**
```javascript
const WizardStorage = {
  KEYS: ['category', 'priority', 'what', 'screen', 'timestamp'],
  PREFIX: 'karvia_wizard_',
  EXPIRY: 24 * 60 * 60 * 1000,  // 24 hours

  save(data) {
    data.timestamp = Date.now();
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    });
  },

  load() {
    const timestamp = JSON.parse(localStorage.getItem(this.PREFIX + 'timestamp') || '0');
    if (Date.now() - timestamp > this.EXPIRY) {
      this.clear();
      return null;
    }
    const data = {};
    this.KEYS.forEach(key => {
      const value = localStorage.getItem(this.PREFIX + key);
      if (value) data[key] = JSON.parse(value);
    });
    return Object.keys(data).length > 1 ? data : null;
  },

  clear() {
    this.KEYS.forEach(key => localStorage.removeItem(this.PREFIX + key));
  }
};
```

---

## 5. UI Components

### Screen 1: Direction Selection
- 6 category cards (2x3 grid)
- 3 priority pills (horizontal)
- "Continue" button (disabled until selection made)
- Pre-prompt fires in background on "Continue" click

### Screen 2: Intent Input
- Single textarea with placeholder
- SMART tips (collapsible or tooltip)
- Character counter (optional)
- Back/Continue navigation

### Screen 3: Review & Generate
- Refined objective display (editable)
- "Generate Key Results" button
- 4 KR cards with regenerate buttons
- Feedback modal for regeneration
- "Create Objective" final action

---

## 6. Error Handling

| Error Code | HTTP Status | User Message | Recovery |
|------------|-------------|--------------|----------|
| `SESSION_NOT_FOUND` | 404 | "Session expired. Starting fresh..." | Redirect to Screen 1 |
| `SESSION_EXPIRED` | 410 | "Session timed out. Let's start again." | Redirect to Screen 1 |
| `OPENAI_ERROR` | 503 | "AI is temporarily unavailable." | Retry button |
| `RATE_LIMITED` | 429 | "Too many requests. Please wait." | Countdown timer |
| `VALIDATION_ERROR` | 400 | Specific field errors | Highlight invalid fields |

---

## 7. Testing Strategy

### Unit Tests
- WizardSessionService: create, get, append, close, cleanup
- Prompt builders: template rendering, context injection

### Integration Tests
- Full wizard flow: initialize → refine → generate-krs → finalize
- Session expiry handling
- Error scenarios

### E2E Tests (Playwright)
- Complete wizard journey
- Session timeout recovery
- KR regeneration flow

---

## 8. Code Reuse Patterns (OW-PREREQ)

### AIContextService Usage

All wizard endpoints should use `AIContextService.buildContext()` for consistent context building:

```javascript
const AIContextService = require('../services/AIContextService');

// In wizard routes - build context once per session
router.post('/initialize-session', async (req, res) => {
  const { category, priority } = req.body;
  const companyId = req.user.company_id;

  // Build unified context with OKR scope
  const context = await AIContextService.buildContext(companyId, {
    scope: 'okr',
    includeRejections: true  // Learn from past AI rejections
  });

  // Context object includes:
  // - context.company: { name, industry, employeeCount, ... }
  // - context.ssi: { overall, dimensions, weakAreas, strongAreas }
  // - context.existing_objectives: [{ title, category, status }]
  // - context.tokens: { used, remaining, limit }

  // Store context in session for subsequent calls
  const session = WizardSessionService.createSession(
    req.user._id, companyId, category, priority
  );
  session.context = context;

  // ... rest of implementation
});
```

### Prompt Template Usage

Use the extended `single-objective.js` methods (added in OW-PREREQ):

```javascript
const singleObjective = require('../prompts/endpoint-templates/single-objective');

// For refining user's rough objective
router.post('/refine-objective', async (req, res) => {
  const { session_id, what_input } = req.body;
  const session = WizardSessionService.getSession(session_id);

  // Use the refine prompt with session context
  const prompt = singleObjective.getRefinePrompt(
    what_input,
    session.category,
    session.priority,
    session.context  // From initialize-session
  );

  // Call OpenAI with prompt...
});

// For regenerating a specific KR
router.post('/regenerate-kr', async (req, res) => {
  const { session_id, kr_index, feedback } = req.body;
  const session = WizardSessionService.getSession(session_id);

  // Use the regenerate prompt
  const prompt = singleObjective.getRegenerateKRPrompt(
    kr_index,
    feedback,
    session.currentKRs,      // Stored from generate-krs
    session.objectiveTitle,  // Stored from refine
    session.context
  );

  // Call OpenAI with prompt...
});
```

### Maturity-Aware Prompts (Optional Enhancement)

For higher AI quality, use maturity-aware prompts:

```javascript
const { getPromptWithMaturity, PROMPT_TYPES } = require('../prompts');

// For KR generation, use maturity-aware base prompt
const promptData = await getPromptWithMaturity(
  companyId,
  PROMPT_TYPES.SINGLE_OBJECTIVE,
  { category, priority, ...session.context }
);
```

---

## Status

| Section | Status |
|---------|--------|
| File Structure | Defined |
| API Endpoints | Specified |
| Session Management | Specified |
| localStorage | Specified |
| UI Components | Outlined |
| Error Handling | Specified |
| Testing Strategy | Outlined |
| Code Reuse Patterns | **IMPLEMENTED (OW-PREREQ)** |

---

**Next Action**: Begin Epic OW-UI implementation
