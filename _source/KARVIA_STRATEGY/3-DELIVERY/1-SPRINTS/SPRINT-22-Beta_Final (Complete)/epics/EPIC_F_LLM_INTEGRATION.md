# Epic F: aiOKRService Extension

<!-- @GENOME T3-SPR-022-EF | ACTIVE | 2026-04-29 | parent:T3-SPR-022-MP | auto:/coding | linked:/strategy -->

**Sprint**: 22 - Beta_Final
**Epic**: F - aiOKRService Extension (incl. `enrichCompany()` for Add Client wizard)
**Points**: 10
**Priority**: P0 (raised from P1 — blocks Epic C Phase 3 and Epic E)
**Dependencies**: Epic 0 (Pre-Work), Epic A (Data Models), Epic B (AIContextService Extension)

---

## Session #172 Refactor

**Key Change**: EXTEND existing `aiOKRService.js` instead of creating new `LLMService.js`.

### Original Plan (Rejected)
- Create new `LLMService.js`
- Create new `PromptManager.js`
- Duplicate OpenAI integration

### Refactored Plan (Approved)
- EXTEND `server/services/aiOKRService.js` with new methods
- Add `generateKRs()` for Key Result generation
- Add `generateWeeklyGoals()` for weekly goal generation
- Add `generateMoves()` for move/task generation
- Keep existing `generateOKRsFromAssessment()` working (backwards compatible)

**Rationale**: aiOKRService already has OpenAI integration, template fallback, validation, and context building. Don't duplicate.

---

## Overview

Extend the existing aiOKRService with AI-powered generation for the new cascade model:
- **Key Results** (from objective wizard - Epic E)
- **Weekly Goals** (from KR breakdown)
- **Moves** (daily behaviors from weekly goals)

**Existing Service**: [aiOKRService.js](../../../../server/services/aiOKRService.js)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              EXTENDED aiOKRService                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │         aiOKRService (EXISTING - EXTENDED)                │   │
│  │                                                            │   │
│  │  EXISTING METHODS (keep as-is):                           │   │
│  │  • generateOKRsFromAssessment(assessmentId, options)      │   │
│  │  • buildContext(weakAreas, assessment, options)           │   │
│  │  • generateWithAI(context, options)                       │   │
│  │  • generateFromTemplates(context)                         │   │
│  │  • validateOKRs(okrs)                                     │   │
│  │                                                            │   │
│  │  NEW METHODS (Sprint 22 additions):                       │   │
│  │  • generateKRs(params, context) ← objective wizard        │   │
│  │  • generateWeeklyGoals(params, context)                   │   │
│  │  • generateMoves(params, context)                         │   │
│  │  • enrichCompany({name, website}) ← Add Client wizard     │   │
│  │  • buildCascadePrompt(type, params, context)              │   │
│  │  • parseCascadeResponse(type, response)                   │   │
│  │  • parseJSONResponse(response)                            │   │
│  │  • callOpenAIWithRetry(prompt, attempt?)                  │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                          │                                        │
│                          ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              AIContextService.assembleContext()            │  │
│  │    (Provides company, assessment, discipline context)     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          │                                        │
│                          ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    OPENAI API (GPT-4)                      │  │
│  └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## aiOKRService Extension

**File**: `server/services/aiOKRService.js` (MODIFY existing file)

### New Methods to Add

```javascript
// Add to existing AIOKRService class

/**
 * Sprint 22: Generate Key Results for an objective
 * Called from objective wizard (Epic E)
 *
 * @param {Object} params - Generation parameters
 * @param {String} params.title - Objective title
 * @param {String} params.category - Objective category
 * @param {Array} params.discipline_ids - Selected discipline IDs
 * @param {Object} params.ssi_impact - SSI focus area
 * @param {Object} context - Context from AIContextService.assembleContext()
 * @returns {Promise<Object>} Generated KRs with guidance
 */
async generateKRs(params, context) {
  const { title, category, discipline_ids, ssi_impact } = params;

  if (!this.isOpenAIEnabled) {
    logger.info('[AI OKR] OpenAI disabled, using template KRs');
    return this.generateKRsFromTemplate(params, context);
  }

  try {
    const prompt = this.buildCascadePrompt('kr', params, context);
    const response = await this.callOpenAIWithRetry(prompt);
    return this.parseCascadeResponse('kr', response);
  } catch (error) {
    logger.error('[AI OKR] KR generation failed:', error);
    return this.generateKRsFromTemplate(params, context);
  }
}

/**
 * Sprint 22: Generate Weekly Goals for a Key Result
 *
 * @param {Object} params - Generation parameters
 * @param {String} params.key_result_id - Key Result ID
 * @param {String} params.target_week - Target week number
 * @param {Object} context - Context from AIContextService.assembleContext()
 * @returns {Promise<Object>} Generated weekly goals
 */
async generateWeeklyGoals(params, context) {
  const { key_result_id, target_week } = params;

  if (!this.isOpenAIEnabled) {
    logger.info('[AI OKR] OpenAI disabled, using template weekly goals');
    return this.generateWeeklyGoalsFromTemplate(params, context);
  }

  try {
    const prompt = this.buildCascadePrompt('weekly', params, context);
    const response = await this.callOpenAIWithRetry(prompt);
    return this.parseCascadeResponse('weekly', response);
  } catch (error) {
    logger.error('[AI OKR] Weekly goal generation failed:', error);
    return this.generateWeeklyGoalsFromTemplate(params, context);
  }
}

/**
 * Sprint 22: Generate Moves (daily behaviors) for a Weekly Goal
 *
 * @param {Object} params - Generation parameters
 * @param {String} params.weekly_goal_id - Weekly Goal ID
 * @param {String} params.discipline - Discipline focus
 * @param {Object} context - Context from AIContextService.assembleContext()
 * @returns {Promise<Object>} Generated moves
 */
async generateMoves(params, context) {
  const { weekly_goal_id, discipline } = params;

  if (!this.isOpenAIEnabled) {
    logger.info('[AI OKR] OpenAI disabled, using template moves');
    return this.generateMovesFromTemplate(params, context);
  }

  try {
    const prompt = this.buildCascadePrompt('move', params, context);
    const response = await this.callOpenAIWithRetry(prompt);
    return this.parseCascadeResponse('move', response);
  } catch (error) {
    logger.error('[AI OKR] Move generation failed:', error);
    return this.generateMovesFromTemplate(params, context);
  }
}

/**
 * Sprint 22: Build prompt for cascade generation
 * @private
 */
buildCascadePrompt(type, params, context) {
  const prompts = {
    kr: this.buildKRGenerationPrompt(params, context),
    weekly: this.buildWeeklyGoalPrompt(params, context),
    move: this.buildMovePrompt(params, context)
  };
  return prompts[type];
}

/**
 * Sprint 22: Build KR generation prompt
 * @private
 */
buildKRGenerationPrompt(params, context) {
  const { title, category, discipline_ids, ssi_impact } = params;
  const { company, assessment, discipline } = context;

  // Get discipline details
  const selectedDisciplines = discipline_ids?.map(id =>
    discipline?.find(d => d.id === id)
  ).filter(Boolean) || [];

  return `Generate 3-5 measurable Key Results for this objective.

OBJECTIVE:
Title: ${title}
Category: ${category}

COMPANY CONTEXT:
- Name: ${company?.name || 'Unknown'}
- Industry: ${company?.industry || 'General'}
- Size: ${company?.size || 'Unknown'}

ASSESSMENT DATA:
- Overall SSI: ${assessment?.overall || 'N/A'}
- Speed: ${assessment?.dimensions?.speed || 'N/A'}
- Strength: ${assessment?.dimensions?.strength || 'N/A'}
- Intelligence: ${assessment?.dimensions?.intelligence || 'N/A'}
${ssi_impact?.area ? `- Focus Area: ${ssi_impact.area}` : ''}

SELECTED DISCIPLINES:
${selectedDisciplines.map(d => `- ${d.name}: ${d.description}`).join('\n') || 'None selected'}

REQUIREMENTS:
1. Each KR must be outcome-based (measure impact, not activity)
2. Include specific target and baseline values
3. Achievable within a quarter
4. Measurable without subjective interpretation

Return JSON: { "key_results": [{ "title", "target_value", "baseline_value", "metric_type", "unit" }], "guidance": "brief guidance text" }`;
}

/**
 * Sprint 22: Build weekly goal prompt
 * @private
 */
buildWeeklyGoalPrompt(params, context) {
  const { key_result_id, target_week } = params;
  const { company, keyResult } = context;

  const kr = Array.isArray(keyResult) ? keyResult[0] : keyResult;

  return `Generate 2-4 weekly goals for this Key Result.

KEY RESULT:
Title: ${kr?.title || 'Unknown'}
Target: ${kr?.target_value || 'N/A'} (Current: ${kr?.current_value || 0})
Metric Type: ${kr?.metric_type || 'number'}

COMPANY: ${company?.name || 'Unknown'} (${company?.industry || 'General'})

TARGET WEEK: Week ${target_week}

REQUIREMENTS:
1. Goals should contribute to KR progress
2. Include frequency (once, weekly, biweekly)
3. Be specific and actionable

Return JSON: { "weekly_goals": [{ "title", "frequency", "target_week" }] }`;
}

/**
 * Sprint 22: Build move (daily behavior) prompt
 * @private
 */
buildMovePrompt(params, context) {
  const { discipline } = params;
  const { company, weeklyGoal, discipline: disciplines } = context;

  const goal = Array.isArray(weeklyGoal) ? weeklyGoal[0] : weeklyGoal;
  const disciplineInfo = disciplines?.find(d => d.id === discipline);

  return `Generate 2-5 daily moves (behaviors/actions) for this weekly goal.

WEEKLY GOAL:
Title: ${goal?.title || 'Unknown'}
Frequency: ${goal?.frequency || 'once'}

DISCIPLINE FOCUS: ${disciplineInfo?.name || discipline}
${disciplineInfo?.description ? `Description: ${disciplineInfo.description}` : ''}

COMPANY: ${company?.name || 'Unknown'}

REQUIREMENTS:
1. Moves should be daily behaviors
2. Include move_type: action (one-time), reaction (triggered), or habit (recurring)
3. Include frequency: once, daily, weekly, or triggered
4. Align with the discipline focus

Return JSON: { "moves": [{ "title", "move_type", "frequency", "discipline" }] }`;
}

/**
 * Sprint 22: Parse cascade response
 * @private
 */
parseCascadeResponse(type, response) {
  try {
    const data = this.parseJSONResponse(response);

    switch (type) {
      case 'kr':
        return {
          key_results: (data.key_results || []).slice(0, 5).map(kr => ({
            title: kr.title,
            target_value: this.parseNumber(kr.target_value),
            baseline_value: this.parseNumber(kr.baseline_value || 0),
            metric_type: kr.metric_type || 'number',
            unit: kr.unit || 'number',
            ai_generated: true
          })),
          guidance: data.guidance || ''
        };

      case 'weekly':
        return {
          weekly_goals: (data.weekly_goals || []).slice(0, 4).map(g => ({
            title: g.title,
            frequency: g.frequency || 'once',
            target_week: g.target_week,
            ai_generated: true
          }))
        };

      case 'move':
        return {
          moves: (data.moves || []).slice(0, 5).map(m => ({
            title: m.title,
            move_type: m.move_type || 'action',
            frequency: m.frequency || 'once',
            discipline: m.discipline,
            ai_generated: true
          }))
        };

      default:
        throw new Error(`Unknown cascade type: ${type}`);
    }
  } catch (error) {
    logger.error(`[AI OKR] Failed to parse ${type} response:`, error);
    throw error;
  }
}

/**
 * Sprint 22: Parse JSON from AI response (handles markdown wrapping)
 * @private
 */
parseJSONResponse(response) {
  try {
    return JSON.parse(response);
  } catch {
    // Try extracting from markdown code block
    const jsonMatch = response.match(/```json?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    // Try extracting raw JSON object
    const objectMatch = response.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  }
}

/**
 * Sprint 22: Call OpenAI with retry logic
 * @private
 */
async callOpenAIWithRetry(prompt, attempt = 0) {
  try {
    const response = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert business consultant specializing in OKRs and behavioral improvement. Generate measurable, outcome-based results.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens
    });
    return response.choices[0].message.content;
  } catch (error) {
    if (attempt < 1 && (error.status === 429 || error.status >= 500)) {
      await new Promise(r => setTimeout(r, 2000));
      return this.callOpenAIWithRetry(prompt, attempt + 1);
    }
    throw error;
  }
}

// Template fallbacks
generateKRsFromTemplate(params, context) {
  return {
    key_results: [
      { title: `Achieve ${params.title} milestone 1`, target_value: 25, baseline_value: 0, metric_type: 'percentage', ai_generated: false },
      { title: `Complete ${params.category} deliverable`, target_value: 1, baseline_value: 0, metric_type: 'boolean', ai_generated: false },
      { title: `Improve key metric by 20%`, target_value: 20, baseline_value: 0, metric_type: 'percentage', ai_generated: false }
    ],
    guidance: 'These are template KRs. Edit them to match your specific needs.'
  };
}

generateWeeklyGoalsFromTemplate(params, context) {
  return {
    weekly_goals: [
      { title: `Weekly progress checkpoint`, frequency: 'weekly', ai_generated: false },
      { title: `Complete key deliverable`, frequency: 'once', ai_generated: false }
    ]
  };
}

generateMovesFromTemplate(params, context) {
  return {
    moves: [
      { title: `Daily standup check-in`, move_type: 'habit', frequency: 'daily', ai_generated: false },
      { title: `Complete primary action`, move_type: 'action', frequency: 'once', ai_generated: false }
    ]
  };
}

// Helper
parseNumber(value) {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}
```

---

## enrichCompany — Add Client Wizard AI Auto-Fill (D-F-1)

Required by Epic C Phase 3. Spec: 2-step wizard's Step 1 → Step 2 transition calls `POST /api/consultant/clients/enrich`, which delegates to this method.

```javascript
// Add to AIOKRService class

constructor() {
  // ... existing setup
  this._enrichCache = new Map(); // D-F-2: in-memory cache; lost on restart
  this.ENRICH_TTL_MS = 24 * 60 * 60 * 1000; // 24h
  this.ENRICH_TIMEOUT_MS = 3000; // hard 3s limit
  this.enrichModel = process.env.OPENAI_ENRICH_MODEL || 'gpt-4-turbo'; // D-F-5
}

/**
 * Sprint 22 — D-F-1: AI-enrich a company from name + website.
 * Used by Epic C's Add Client wizard. Web-search tool produces sources + signals.
 *
 * @param {Object} input - { name, website? }
 * @returns {Promise<Object>} enrichment payload (see API_DELTAS.md for shape)
 * @throws {EnrichUnavailableError} on timeout or fatal error → route returns 504
 */
async enrichCompany({ name, website }) {
  if (!name || name.trim().length < 2) throw new Error('name required (min 2 chars)');

  const cacheKey = `enrich:${name.trim().toLowerCase()}|${(website || '').toLowerCase()}`;
  const cached = this._enrichCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < this.ENRICH_TTL_MS) return cached.data;

  // Graceful degrade if OpenAI disabled or web-search not available
  if (!this.isOpenAIEnabled) {
    return this._enrichTemplateStub({ name, website });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), this.ENRICH_TIMEOUT_MS);
  try {
    const prompt = this.buildCascadePrompt('enrich', { name, website });
    const response = await this.openai.chat.completions.create({
      model: this.enrichModel,
      messages: [
        { role: 'system', content: 'You are a B2B research assistant. Use web search. Return only JSON matching the requested schema.' },
        { role: 'user', content: prompt }
      ],
      tools: [{ type: 'web_search' }],   // D-F-5; if env model lacks tools, fallback at parse time
      tool_choice: 'auto',
      temperature: 0.2,
      max_tokens: 1200
    }, { signal: ctrl.signal });

    const data = this.parseCascadeResponse('enrich', response.choices[0].message.content);
    this._enrichCache.set(cacheKey, { data, ts: Date.now() });
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new EnrichUnavailableError('timeout');
    logger.error('[AI OKR] enrichCompany failed:', err);
    throw new EnrichUnavailableError(err.message);
  } finally {
    clearTimeout(timer);
  }
}

_enrichTemplateStub({ name, website }) {
  // Empty-but-valid shape; UI shows manual Step 2
  return {
    industry: 'other', industry_secondary: null, vertical: null,
    size: null, estimated_employees: null, estimated_revenue_band: null,
    founded: null, hq: null, annual_projects: null,
    description: '', detected_signals: [],
    suggested_ssi_focus: [], suggested_template_id: null,
    suggested_contacts: [],
    sources: [], confidence: 0
  };
}

class EnrichUnavailableError extends Error {
  constructor(reason) { super(reason); this.name = 'EnrichUnavailableError'; }
}
module.exports.EnrichUnavailableError = EnrichUnavailableError;
```

### enrichCompany Prompt (within `buildCascadePrompt('enrich', ...)`)

```text
Research the company "${name}"${website ? ` (website: ${website})` : ''} using web search.
Return ONLY a JSON object with these keys (no markdown, no commentary):
- industry, industry_secondary, vertical
- size (one of: 1-10, 11-50, 51-200, 201-500), estimated_employees
- estimated_revenue_band, founded (year), hq (city, state/country)
- annual_projects, description (2-4 sentences)
- detected_signals (array of short strings: e.g. growth_phase, succession_planning)
- suggested_ssi_focus (array of {dimension, sub_dimension})
- suggested_template_id (string|null)
- suggested_contacts (array of {name, title, email, is_primary, source, note})
- sources (array of source URLs cited)
- confidence (0..1)
Set unknown fields to null. Do not fabricate emails — leave them null if uncertain.
```

### parseCascadeResponse('enrich', ...) — sketch

```javascript
case 'enrich': {
  const d = this.parseJSONResponse(response);
  return {
    industry: d.industry || 'other',
    industry_secondary: d.industry_secondary || null,
    vertical: d.vertical || null,
    size: ['1-10','11-50','51-200','201-500'].includes(d.size) ? d.size : null,
    estimated_employees: this.parseNumber(d.estimated_employees) || null,
    estimated_revenue_band: d.estimated_revenue_band || null,
    founded: this.parseNumber(d.founded) || null,
    hq: d.hq || null,
    annual_projects: d.annual_projects || null,
    description: (d.description || '').slice(0, 1000),
    detected_signals: Array.isArray(d.detected_signals) ? d.detected_signals.slice(0, 8) : [],
    suggested_ssi_focus: Array.isArray(d.suggested_ssi_focus) ? d.suggested_ssi_focus.slice(0, 3) : [],
    suggested_template_id: d.suggested_template_id || null,
    suggested_contacts: Array.isArray(d.suggested_contacts) ? d.suggested_contacts.slice(0, 5) : [],
    sources: Array.isArray(d.sources) ? d.sources.slice(0, 6) : [],
    confidence: typeof d.confidence === 'number' ? Math.max(0, Math.min(1, d.confidence)) : 0
  };
}
```

### Min/Max guard for KRs (D-F-4)

`parseCascadeResponse('kr', ...)` enforces `min 1` (throws so caller falls back to template) and `max 5` (slice).

---

## Route Integration

### Objective Wizard KR Generation

**File**: `server/routes/objectives.js` (MODIFY)

```javascript
const aiOKRService = require('../services/aiOKRService');
const AIContextService = require('../services/AIContextService');

// POST /api/objectives/generate-krs
router.post('/generate-krs',
  authenticateToken,
  async (req, res) => {
    try {
      const { title, category, discipline_ids, ssi_impact } = req.body;
      const company_id = req.user.company_id;

      // Assemble context using AIContextService
      const context = await AIContextService.assembleContext(
        'kr-generation',
        { company_id }
      );

      // Generate KRs using extended aiOKRService
      const result = await aiOKRService.generateKRs(
        { title, category, discipline_ids, ssi_impact },
        context
      );

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      logger.error('[Objectives] KR generation failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate Key Results',
        fallback: true
      });
    }
  }
);
```

---

## Error Handling

### Graceful Degradation Tiers

| Tier | Condition | Response |
|------|-----------|----------|
| 1 | Success | Return AI-generated items |
| 2 | Retry succeeded | Return AI-generated items (delayed) |
| 3 | AI fails | Return template-based fallback |
| 4 | Complete failure | Return empty with guidance |

### Fallback Pattern

All `generate*` methods automatically fall back to template-based generation:

```javascript
async generateKRs(params, context) {
  if (!this.isOpenAIEnabled) {
    // Immediate fallback if OpenAI not configured
    return this.generateKRsFromTemplate(params, context);
  }

  try {
    // Try AI generation
    const prompt = this.buildCascadePrompt('kr', params, context);
    const response = await this.callOpenAIWithRetry(prompt);
    return this.parseCascadeResponse('kr', response);
  } catch (error) {
    // Fallback on any error
    logger.error('[AI OKR] KR generation failed:', error);
    return this.generateKRsFromTemplate(params, context);
  }
}
```

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `server/services/aiOKRService.js` | MODIFY | Add generateKRs, generateWeeklyGoals, generateMoves, **enrichCompany** (D-F-1), buildCascadePrompt, parseCascadeResponse, parseJSONResponse, callOpenAIWithRetry, per-type template fallbacks |
| `server/routes/objectives.js` | MODIFY | Add `/generate-krs` with `aiGenerationLimiter` (D-F-6) |
| `server/routes/weekly-goals.js` | MODIFY | Add `/generate` with `aiGenerationLimiter` |
| `server/routes/moves.js` | MODIFY | Add `/generate` with `aiGenerationLimiter` (route file scaffolded by Epic A — D-A-6) |
| `server/routes/consultant.js` | MODIFY | Add `/clients/enrich` with `aiGenerationLimiter` (lower limit, e.g. 20/hr/user — D-F-6) — calls `aiOKRService.enrichCompany`, maps `EnrichUnavailableError` to 504 |

---

## Configuration

### Existing Environment Variables (No Changes)

```env
OPENAI_API_KEY=[REDACTED]           # Already used by aiOKRService
FEATURE_OPENAI_ENABLED=true     # Already controls AI availability
```

### Existing Feature Flag (No Changes)

```javascript
// In aiOKRService constructor (already exists)
this.isOpenAIEnabled = process.env.FEATURE_OPENAI_ENABLED === 'true';
```

---

## Acceptance Criteria

- [ ] aiOKRService extended with `generateKRs()`, `generateWeeklyGoals()`, `generateMoves()`
- [ ] **`enrichCompany({name, website})` implemented** with web-search tool, 24h in-memory cache, 3s AbortController timeout, and `EnrichUnavailableError` propagation (D-F-1, D-F-2, D-F-5)
- [ ] `buildCascadePrompt()` handles types: `kr`, `weekly`, `move`, `enrich`
- [ ] `parseCascadeResponse('kr', ...)` enforces min 1 / max 5 KRs (D-F-4); throws on min violation so route falls back
- [ ] `parseNumber` strips non-digits while `unit` retains string (e.g. 'USD', 'days') — D-F-3
- [ ] Retry logic on 429/5xx via `callOpenAIWithRetry`
- [ ] Template fallback when OpenAI disabled or fails
- [ ] Integration with `AIContextService.assembleContext()`
- [ ] Backwards compatibility with existing `generateOKRsFromAssessment()`
- [ ] All 4 new AI endpoints rate-limited via `aiGenerationLimiter` (D-F-6)
- [ ] enrich cache hit avoids OpenAI call (verified via mock spy)
- [ ] Cost tracking descoped to S23 (D-F-7) — no per-tenant quota in S22

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| generateKRs() method | 1.5 |
| **enrichCompany() method (D-F-1) — incl. cache + timeout + parser** | 2 |
| generateWeeklyGoals() method | 1.5 |
| generateMoves() method | 1.5 |
| Prompt building (4 types incl. enrich) | 0.5 |
| Response parsing (4 types) | 1 |
| Route integration (4 endpoints + rate-limit wiring) | 1 |
| Testing (incl. enrich cache hit, timeout, fallback) | 1 |
| **Total** | **10** |

---

**Created**: April 21, 2026 (Session #171)
**Updated**: April 22, 2026 (Session #172 - Refactored to extend aiOKRService)
**Status**: Ready for implementation
