# Sprint 14 Test Plan — LLM Quality

**Sprint**: 14 | **Points**: 23 | **Focus**: LLM prompt quality, caching, guardrails, streaming
**Epics**: Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q11
**Created**: January 27, 2026
**Updated**: January 27, 2026 (Post-Audit)

---

## Test Summary

| Category | Test Cases | Priority |
|----------|-----------|----------|
| Unit Tests | 56 | P0-P2 |
| Integration Tests | 39 | P0-P1 |
| E2E / Playwright | 16 | P0-P1 |
| Edge Cases | 23 | P1-P2 |
| **Total** | **134** | |

---

## 1. Epic Q3 — OKR Prompt Engineering (3 pts)

### 1.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q3-U01 | `AIContextService.getContext()` includes company name | Context has `company.name` | P0 |
| Q3-U02 | Context includes company industry | `company.industry` present | P0 |
| Q3-U03 | Context includes company size | `company.employee_count` present | P0 |
| Q3-U04 | Context includes existing objectives | Active objectives in context | P0 |
| Q3-U05 | Prompt template references company context | Variables interpolated | P0 |
| Q3-U06 | Prompt template uses role-appropriate language | EXECUTIVE vs MANAGER tone | P1 |
| Q3-U07 | Missing company data → context still valid (partial) | No crash, degrades gracefully | P0 |

### 1.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q3-I01 | OKR generation with enhanced context produces contextual suggestions | Response references company specifics | P0 |
| Q3-I02 | OKR generation without company context → generic suggestions | Fallback prompts work | P0 |
| Q3-I03 | `FEATURE_OPENAI_ENABLED=false` → 503 with graceful message | AI unavailable message | P0 |

---

## 2. Epic Q4 — SSI Narrative Tone Calibration (3 pts)

### 2.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q4-U01 | Tone parameter: `executive` accepted | Valid tone | P0 |
| Q4-U02 | Tone parameter: `managerial` accepted | Valid tone | P0 |
| Q4-U03 | Tone parameter: `technical` accepted | Valid tone | P0 |
| Q4-U04 | Tone parameter: invalid value → default to `executive` | Fallback tone | P0 |
| Q4-U05 | Narrative service receives tone from report type | Tone passed through | P0 |
| Q4-U06 | Executive tone uses higher-level language | No technical jargon | P1 |
| Q4-U07 | Technical tone includes specific metrics | Data-heavy language | P1 |

### 2.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q4-I01 | `GET /api/diagnostic/ssi/:id` with `tone=executive` returns executive narrative | Tone-appropriate text | P0 |
| Q4-I02 | `GET /api/diagnostic/ssi/:id` with `tone=technical` returns technical narrative | Data-focused text | P0 |
| Q4-I03 | No tone parameter → defaults to executive | Default behavior | P0 |
| Q4-I04 | `POST /api/diagnostic/ssi/:reportId/refresh-narratives` triggers re-generation with updated tone | Narratives regenerated with new tone | P0 |

---

## 3. Epic Q5 — Industry-Specific Prompt Templates (3 pts)

### 3.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q5-U01 | Industry profile loads for `technology` | Valid template JSON | P0 |
| Q5-U02 | Industry profile loads for `financial_services` | Valid template JSON | P0 |
| Q5-U03 | Industry profile loads for `healthcare` | Valid template JSON | P0 |
| Q5-U04 | Industry profile loads for `manufacturing` | Valid template JSON | P0 |
| Q5-U05 | Industry profile loads for `professional_services` | Valid template JSON | P0 |
| Q5-U06 | Industry profile loads for `retail` | Valid template JSON | P0 |
| Q5-U07 | Industry profile loads for `education` | Valid template JSON | P0 |
| Q5-U08 | Unknown industry → fallback to generic template | No crash, generic used | P0 |
| Q5-U09 | Industry template has prompt_template field | Non-empty string | P0 |
| Q5-U10 | Industry template has benchmark_context field | Industry benchmarks | P1 |

### 3.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q5-I01 | SSI narrative for tech company references tech benchmarks | Industry-specific language | P0 |
| Q5-I02 | SSI narrative for healthcare references healthcare context | Industry-specific language | P0 |
| Q5-I03 | Company with no industry → generic narrative | No crash | P0 |
| Q5-I04 | All 7 industry profile files load without errors | JSON parse succeeds | P0 |

---

## 4. Epic Q6 — Response Caching (2 pts)

### 4.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q6-U01 | Cache key generated from context hash | Deterministic key | P0 |
| Q6-U02 | Same context → same cache key | Idempotent | P0 |
| Q6-U03 | Different context → different cache key | Unique keys | P0 |
| Q6-U04 | Cache TTL = 86400 seconds (24 hours) | Correct expiry | P0 |
| Q6-U05 | Cache hit returns stored response | No LLM call made | P0 |
| Q6-U06 | Cache miss triggers LLM call and stores result | Response cached | P0 |
| Q6-U07 | Cache key uses `hash(company_id + report_type + dimension + score_bucket)` | Deterministic composite key | P0 |
| Q6-U08 | Score bucket rounds to nearest 5: score 73 → bucket "70-75" | Correct bucketing | P0 |
| Q6-U09 | Timestamps excluded from cache key — same data at different times = same key | Time-invariant key | P0 |
| Q6-U10 | Company update invalidates `llm:*{company_id}*` entries | Targeted invalidation | P0 |

### 4.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q6-I01 | First call → cache miss → LLM called → response cached | Cache entry created | P0 |
| Q6-I02 | Second identical call → cache hit → no LLM call | Response from cache | P0 |
| Q6-I03 | Cache expires after 24 hours → new LLM call | Fresh response | P0 |
| Q6-I04 | Company data updated → cache invalidated | New response generated | P0 |
| Q6-I05 | Cache collection has TTL index | MongoDB `expires` field | P0 |

### 4.3 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q6-X01 | Cache storage fails (MongoDB error) → LLM still returns response | Graceful degradation | P0 |
| Q6-X02 | Cache read fails → LLM called instead | Transparent fallback | P0 |
| Q6-X03 | Concurrent identical requests → only 1 LLM call | Cache lock or dedup | P1 |
| Q6-X04 | Very large LLM response cached | No truncation | P1 |
| Q6-X05 | Cache collection with 10000+ entries — TTL index performance acceptable | No degradation | P1 |

---

## 5. Epic Q7 — Hallucination Guardrails (3 pts)

### 5.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q7-U01 | `validateNarrative()` checks mentioned metrics against company data | Issues flagged | P0 |
| Q7-U02 | Narrative mentions employee count "500" but actual is "50" → flagged | Metric mismatch detected | P0 |
| Q7-U03 | Narrative mentions team name not in company → flagged | Name mismatch detected | P0 |
| Q7-U04 | Narrative with all correct facts → no issues | Empty issues array | P0 |
| Q7-U05 | Hallucinated person name replaced with actual team member | Auto-correction | P0 |
| Q7-U06 | Numerical claims not in company data → flagged | Unknown metrics flagged | P0 |

### 5.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q7-I01 | SSI narrative post-processed through guardrails | Validated response returned | P0 |
| Q7-I02 | Guardrail issues logged for monitoring | Issues recorded | P1 |
| Q7-I03 | Guardrail failure → original narrative still returned | No block, only flag | P0 |

### 5.3 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q7-X01 | Narrative with no numerical claims → no false positives | Zero issues | P0 |
| Q7-X02 | Company with no data to validate against → skip validation | Pass-through | P0 |
| Q7-X03 | Narrative mentions "approximately 50" when actual is 48 → not flagged | Approximate tolerance | P1 |
| Q7-X04 | Narrative in different language → skip validation | No crash | P2 |

---

## 6. Epic Q8 — Token Usage Optimization (3 pts)

### 6.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q8-U01 | Context summarization reduces token count | Shorter context string | P0 |
| Q8-U02 | Selective data inclusion: only relevant fields sent | No unnecessary data | P0 |
| Q8-U03 | Token count before optimization > token count after | Measurable reduction | P0 |
| Q8-U04 | Summarized context preserves key information | Company name, industry, key metrics present | P0 |
| Q8-U05 | Large context (50+ objectives) summarized | Context within token limit | P0 |

### 6.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q8-I01 | OKR generation with optimized context succeeds | Valid response | P0 |
| Q8-I02 | SSI narrative with optimized context succeeds | Valid response | P0 |
| Q8-I03 | Token usage logged for monitoring | Token count recorded | P1 |

### 6.3 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q8-X01 | Minimal context (new company, no data) → no over-summarization | Sufficient context preserved | P0 |
| Q8-X02 | Very large company (500 employees, 100 objectives) → stays within limits | Summarized effectively | P0 |

---

## 7. Epic Q9 — Fallback Narrative Quality (3 pts)

### 7.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q9-U01 | `getFallbackNarrative('speed', 85)` returns high-range template | Positive tone, specific | P0 |
| Q9-U02 | `getFallbackNarrative('speed', 55)` returns medium-range template | Moderate tone | P0 |
| Q9-U03 | `getFallbackNarrative('speed', 25)` returns low-range template | Improvement-focused | P0 |
| Q9-U04 | All 3 dimensions have fallback templates | speed, strength, intelligence | P0 |
| Q9-U05 | All 3 ranges have templates (high ≥80, medium ≥50, low <50) | 9 total templates | P0 |
| Q9-U06 | Fallback includes actual score value | "Your Speed score of 85..." | P0 |
| Q9-U07 | Fallback is meaningful, not "No data available" | Descriptive text | P0 |

### 7.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q9-I01 | `FEATURE_OPENAI_ENABLED=false` → SSI report uses fallbacks | Fallback narratives shown | P0 |
| Q9-I02 | OpenAI timeout → fallback narratives served | Transparent degradation | P0 |
| Q9-I03 | Fallback narratives pass XSS sanitization | Safe text | P0 |

### 7.3 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q9-X01 | Score exactly 80 → high range | Boundary: ≥80 = high | P0 |
| Q9-X02 | Score exactly 50 → medium range | Boundary: ≥50 = medium | P0 |
| Q9-X03 | Score exactly 0 → low range | Valid fallback | P0 |
| Q9-X04 | Score exactly 100 → high range | Valid fallback | P0 |
| Q9-X05 | Undefined dimension → generic fallback or error | No crash | P0 |

---

## 8. Epic Q11 — LLM Response Streaming (3 pts)

### 8.1 Unit Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q11-U01 | SSE endpoint sets `Content-Type: text/event-stream` | Correct header | P0 |
| Q11-U02 | SSE sends `data:` events with partial text | Chunked delivery | P0 |
| Q11-U03 | SSE sends `[DONE]` event on completion | Stream terminated | P0 |
| Q11-U04 | Client EventSource connects and receives events | Chunks received | P0 |
| Q11-U05 | Client renders text incrementally | UI updates per chunk | P0 |

### 8.2 Integration Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q11-I01 | SSE endpoint streams narrative response | Events received in order | P0 |
| Q11-I02 | SSE connection closed after completion | No hanging connections | P0 |
| Q11-I03 | Client disconnects mid-stream → server cleans up | No resource leak | P0 |
| Q11-I04 | `FEATURE_OPENAI_ENABLED=false` → non-streaming fallback | Regular response | P0 |
| Q11-I05 | `POST /api/auth/sse-ticket` with valid Bearer token → returns `{ ticket: "uuid" }` | Valid ticket returned | P0 |
| Q11-I06 | `POST /api/auth/sse-ticket` without auth → returns 401 | Unauthorized | P0 |
| Q11-I07 | `GET /api/streaming/narrative?ticket=UUID` with valid ticket → SSE stream begins | Stream opens | P0 |
| Q11-I08 | `GET /api/streaming/narrative?ticket=UUID` with expired ticket → returns 401 | Expired ticket rejected | P0 |
| Q11-I09 | `GET /api/streaming/narrative?ticket=UUID` ticket is one-time use → second request returns 401 | Replay rejected | P0 |

### 8.3 E2E Tests (Playwright)

| ID | Test Case | Steps | Expected Result | Priority |
|----|-----------|-------|-----------------|----------|
| Q11-E01 | Long narrative streams visually | Generate SSI report | Text appears progressively | P0 |
| Q11-E02 | Short narrative completes quickly | Generate short response | Full text appears fast | P0 |
| Q11-E03 | Stream error → fallback shown | Simulate error | Non-streaming fallback | P0 |
| Q11-E04 | Browser back during stream → no crash | Navigate away mid-stream | Clean navigation | P0 |

### 8.4 Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| Q11-X01 | Narrative < 100 words → non-streaming (not worth it) | Regular response | P1 |
| Q11-X02 | Network disconnection mid-stream | Partial text + error message | P0 |
| Q11-X03 | Concurrent streams from same user | Both work independently | P1 |
| Q11-X04 | Browser doesn't support EventSource → fallback to fetch | Polyfill or fallback | P1 |

---

## 9. Sprint 14 Integration Regression Tests

| ID | Test Case | What It Protects | Priority |
|----|-----------|------------------|----------|
| REG-01 | Assessment Hub loads | Sprint 11 | P0 |
| REG-02 | Question Library works | Sprint 11 | P0 |
| REG-03 | Teams page works | Sprint 11 | P0 |
| REG-04 | Dashboard task columns work | Sprint 12 | P0 |
| REG-05 | Planning page works | Sprint 12 | P0 |
| REG-06 | Progress cascade works | Sprint 12 | P0 |
| REG-07 | Objectives page works | Sprint 13 | P0 |
| REG-08 | SSI Report works | Sprint 13 | P0 |
| REG-09 | Chief AI branding intact | Sprint 13 | P0 |
| REG-10 | Design system consistent across 6 pages | Sprint 13 | P0 |
| REG-11 | Auth token works | Sprint 11 | P0 |
| REG-12 | Existing BST suite passes (50 tests) | All prior | P0 |

### 9.1 CONSULTANT Role Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| CON-01 | CONSULTANT can trigger narrative refresh | Refresh succeeds, new narratives returned | P0 |
| CON-02 | CONSULTANT can view SSI reports with all tone options | All tones accessible | P0 |
| CON-03 | CONSULTANT can access streaming endpoint | SSE stream opens successfully | P0 |

---

## 10. User Journey Tests

### Journey 1: LLM Feature with Graceful Degradation

```
1. Set FEATURE_OPENAI_ENABLED=true
2. Navigate to SSI Report
3. Verify LLM-generated narratives display
4. Verify narratives are tone-appropriate
5. Navigate to Planning → generate weekly goals
6. Verify AI-generated goals reference company context
7. Set FEATURE_OPENAI_ENABLED=false
8. Refresh SSI Report
9. Verify fallback narratives display (not "No data")
10. Navigate to Planning
11. Verify "Generate" button disabled with tooltip
12. Verify "Add manually" works
13. Re-enable FEATURE_OPENAI_ENABLED
14. Verify SSI narrative regenerates with LLM
```

### Journey 2: Caching & Performance

```
1. Navigate to SSI Report (first load)
2. Note response time (~2-3 seconds with LLM)
3. Navigate away, then back to SSI Report
4. Verify response time < 500ms (cache hit)
5. Update company data (e.g., change employee count)
6. Navigate to SSI Report
7. Verify new narrative reflects updated data (cache invalidated)
8. Verify response time ~2-3 seconds (cache miss)
```

---

## 11. Automated Test File Structure

```
QA/sprints/sprint-14/
├── SPRINT-14-TEST-PLAN.md              (this file)
├── unit/
│   ├── prompt-engineering.test.js      (Q3-U01 to Q3-U07)
│   ├── tone-calibration.test.js        (Q4-U01 to Q4-U07)
│   ├── industry-templates.test.js      (Q5-U01 to Q5-U10)
│   ├── response-caching.test.js        (Q6-U01 to Q6-U10)
│   ├── hallucination-guard.test.js     (Q7-U01 to Q7-U06)
│   ├── token-optimization.test.js      (Q8-U01 to Q8-U05)
│   ├── fallback-narrative.test.js      (Q9-U01 to Q9-U07)
│   └── sse-streaming.test.js           (Q11-U01 to Q11-U05)
├── integration/
│   ├── prompt-api.test.js              (Q3-I01 to Q3-I03)
│   ├── tone-api.test.js                (Q4-I01 to Q4-I04)
│   ├── industry-api.test.js            (Q5-I01 to Q5-I04)
│   ├── cache-api.test.js               (Q6-I01 to Q6-I05)
│   ├── guardrails-api.test.js          (Q7-I01 to Q7-I03)
│   ├── token-api.test.js               (Q8-I01 to Q8-I03)
│   ├── fallback-api.test.js            (Q9-I01 to Q9-I03)
│   └── streaming-api.test.js           (Q11-I01 to Q11-I09)
├── e2e/
│   ├── streaming.spec.ts               (Q11-E01 to Q11-E04)
│   ├── graceful-degradation.spec.ts    (feature flag on/off tests)
│   ├── caching-performance.spec.ts     (cache hit/miss timing)
│   └── regression.spec.ts             (REG-01 to REG-12, CON-01 to CON-03)
├── journeys/
│   ├── llm-graceful-degradation.spec.ts (Journey 1)
│   └── caching-performance.spec.ts     (Journey 2)
└── edge-cases/
    ├── caching-edge.test.js            (Q6-X01 to Q6-X05)
    ├── guardrails-edge.test.js         (Q7-X01 to Q7-X04)
    ├── fallback-edge.test.js           (Q9-X01 to Q9-X05)
    └── streaming-edge.test.js          (Q11-X01 to Q11-X04)
```

---

## 12. Test Execution Order

```
Phase 1: Unit Tests
  npm test -- tests/unit/sprint-14/

Phase 2: Integration Tests (requires DB + optional OpenAI mock)
  npm test -- tests/integration/sprint-14/

Phase 3: E2E Tests (requires running server)
  npx playwright test QA/sprints/sprint-14/e2e/

Phase 4: Journey Tests
  npx playwright test QA/sprints/sprint-14/journeys/

Phase 5: Full Regression (ALL sprints)
  npx playwright test QA/sprints/sprint-14/e2e/regression.spec.ts
  npx playwright test QA/sprints/sprint-13/e2e/  (Sprint 13 re-run)
  npx playwright test QA/sprints/sprint-12/e2e/  (Sprint 12 re-run)
  npx playwright test QA/sprints/sprint-11/e2e/  (Sprint 11 re-run)
  npm run test:bst  (existing 50 BST tests)
```

---

## 13. Pass Criteria

| Gate | Requirement |
|------|-------------|
| Unit Tests | 100% pass rate |
| Integration Tests | 100% pass rate |
| E2E Tests | 100% pass rate |
| Journey Tests | 95% pass rate |
| Edge Cases | 90% pass rate |
| Regression (Sprint 11 + 12 + 13 + BST) | 100% pass rate |
| Code Coverage | ≥ 80% lines for new code |
| Caching | Cache hit < 500ms, cache invalidation works |
| Graceful Degradation | All LLM features work with flag off |
| Fallback Quality | All 9 fallback templates meaningful |
| Industry Templates | All 7 industries load successfully |
| Streaming | SSE works for narratives > 500 words |
| Hallucination | Known metric mismatches caught |
| Token Optimization | ≥ 30% reduction for repeated queries |

---

*Sprint 14 Test Plan — 134 total test cases*
*Last Updated: January 27, 2026*
