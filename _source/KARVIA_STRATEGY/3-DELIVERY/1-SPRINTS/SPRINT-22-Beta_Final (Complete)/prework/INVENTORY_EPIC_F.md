# Inventory — Epic F: aiOKRService Extension

<!-- @GENOME T3-SPR-022-PW-IF | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

**Spec**: [EPIC_F_LLM_INTEGRATION.md](../epics/EPIC_F_LLM_INTEGRATION.md)
**Points**: 10

---

## Reuse-First Matrix

| Capability | Status | Existing | Action |
|------------|--------|----------|--------|
| OpenAI client + retry | ✅ exists | `aiOKRService.js` constructor (line 14), `isOpenAIEnabled` flag | REUSE — `callOpenAIWithRetry` is NEW per spec but similar retry pattern exists in `generateWithAI` (line 233) |
| Existing OKR-from-assessment generation | ✅ exists | `generateOKRsFromAssessment` (line 45) | KEEP unchanged — backwards compat |
| Template fallback infrastructure | ✅ exists | `generateFromTemplates` (line 423), `createTemplateObjective` (line 462) | REUSE pattern; ADD specific fallbacks for KR/WG/Move |
| Validation infrastructure | ✅ exists | `validateOKRs` (line 529) | REUSE; ADD `validateKRs`, `validateWeeklyGoals`, `validateMoves` |
| `generateKRs(params, context)` | 🆕 new | none | ADD |
| `generateWeeklyGoals(params, context)` | 🆕 new | none | ADD |
| `generateMoves(params, context)` | 🆕 new | none | ADD |
| `enrichCompany({ name, website })` | ⚠️ MISSING from spec | none — and Epic F body does NOT list this method despite Epic C dependency | ADD to Epic F spec (D-F-1) |
| `buildCascadePrompt`, `parseCascadeResponse`, `parseJSONResponse` | 🆕 new | none | ADD as private helpers |
| `callOpenAIWithRetry` | 🔧 extend | `generateWithAI` has retry logic | EXTRACT into `callOpenAIWithRetry` shared helper |
| Web-search tool for enrich | 🆕 new | none — current OpenAI calls do not use tools | ADD tool-config support for `enrichCompany` |
| 24h cache for enrich | 🆕 new | none | ADD in-memory cache OR Redis (gracefully degraded) |

---

## ⚠️ Critical Gap

`enrichCompany({ name, website })` is referenced by:
- EPIC_C §5 (Step 1 → Step 2 transition)
- SPRINT22_MASTER_PLAN line 245 ("Epic F (incl. `enrichCompany()`)")
- HANDOFF doc line 49 (canonical 2-step AI flow)

…but is **not in EPIC_F's "NEW METHODS"** list. Must be added with full spec:

- Prompt template
- OpenAI tool config (web search)
- 3s timeout enforcement
- Cache key + TTL
- Error contract (504 with `{error: "enrich_unavailable"}`)
- Fields returned (industry, secondary, vertical, size, founded, hq, revenue band, signals, suggested_ssi_focus, suggested_template_id, suggested_contacts, sources, confidence)

---

## Existing Code Touched

| File | Lines | Current behavior | Sprint 22 change |
|------|-------|------------------|------------------|
| `server/services/aiOKRService.js` | 1-700+ | 12 existing methods (constructor, generateOKRsFromAssessment, buildContext, getIndustryFocus, getRoleContext, getSizeCategory, generateWithAI, generateWithTemplate, buildSystemPrompt, buildUserPrompt, generateFromTemplates, createTemplateObjective, validateOKRs) | ADD: generateKRs, generateWeeklyGoals, generateMoves, enrichCompany, buildCascadePrompt, parseCascadeResponse, parseJSONResponse, callOpenAIWithRetry, plus per-type template fallbacks and per-type validators |
| `server/routes/objectives.js` | n/a | n/a | ADD `POST /generate-krs` (depends on Epic E route changes) |
| `server/routes/weekly-goals.js` | NEW per Epic A scaffold? | n/a | ADD `POST /generate` |
| `server/routes/moves.js` | NEW | n/a | ADD `POST /generate` |
| `server/routes/consultant.js` | 24-110 | n/a | ADD `POST /clients/enrich` (calls aiOKRService.enrichCompany) |

---

## Conflicts / Decisions Required

| ID | Conflict | Refer to |
|----|----------|----------|
| F-1 | `enrichCompany()` missing from Epic F body — must be added | DECISIONS_LOG.md → D-F-1 |
| F-2 | Cache strategy for enrich: in-memory Map vs Redis. Redis is feature-flagged today. Pick fallback | DECISIONS_LOG.md → D-F-2 |
| F-3 | `parseNumber` in spec strips non-numeric — but currency unit ($, €) loses sign info. Confirm | DECISIONS_LOG.md → D-F-3 |
| F-4 | `parseCascadeResponse` slices to `.slice(0, 5)` for KRs — but Epic E says "3-5 measurable KRs". Min check missing | DECISIONS_LOG.md → D-F-4 |
| F-5 | OpenAI model selection: Epic F uses `this.config.model`. Confirm it supports tool use for enrichCompany web search; if not, use a different model for enrich | DECISIONS_LOG.md → D-F-5 |
| F-6 | Rate limiting: existing `aiGenerationLimiter` middleware on routes (server/routes/ai-okr.js:285). New endpoints `/generate-krs`, `/generate`, `/clients/enrich` should also apply | DECISIONS_LOG.md → D-F-6 |
| F-7 | Cost tracking: AI calls are billed. Need per-org meter or quota? | DECISIONS_LOG.md → D-F-7 |

---

## Acceptance-Criteria Coverage Audit

Current AC (9 items) covers: 3 generate methods, prompt builder, parser, retry, fallback, context integration, backwards compat. **Gaps**:
- No AC for `enrichCompany`
- No AC for cache hit/miss
- No AC for rate limiting
- No AC for cost tracking (if scoped)

Add 4 AC items (3 if cost tracking descoped).

---

## Test-Plan Stub

- Unit: each generate* method handles AI success, AI fail (fallback), OpenAI disabled (immediate fallback)
- Unit: parseCascadeResponse normalizes shape; rejects malformed JSON gracefully
- Unit: enrichCompany returns expected shape; respects 3s timeout
- Integration: cache hit → no OpenAI call (mock spy)
- Integration: rate limiter blocks 11th request in window
- Mock test: web-search tool returns sources; sources flow through to client
- Backwards compat: `generateOKRsFromAssessment` still works
