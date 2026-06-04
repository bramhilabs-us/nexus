# Sprint 17 Test Plan

**Sprint**: 17 - Intelligent Context Engine
**Focus**: Prompt Consolidation + Context Maturity + Outcome Tracking
**Created**: March 9, 2026
**Status**: READY FOR TESTING

---

## Sprint Scope

| Phase | Points | Features |
|-------|--------|----------|
| Phase 0: Foundation Fixes | 8 | KeyResult model, frontend schema, docs |
| Phase 1: Prompt Consolidation | 12 | Prompt system, Karvia Coach, templates |
| Phase 2: Activate Existing | 10 | Guidance blocks, rejection history, risk indicators |
| Phase 3: Context Maturity | 15 | Maturity service, 5 stages, auto-detection |
| Phase 4: Benchmarks | 10 | BenchmarkProvider, Stage 0 fallback, validation |
| Phase 5: Outcome Tracking | 12 | OKROutcome model, capture API, quarterly review UI |
| Cleanup | 3 | AILoggingWrapper, documentation |
| **Total** | **70** | |

---

## Test Categories

### Priority Legend
- **P0**: Critical - Must pass before any deployment
- **P1**: High - Must pass before production
- **P2**: Medium - Should pass, workarounds acceptable
- **P3**: Low - Nice to have

---

## Phase 0: Foundation Fixes Tests

### FIX-1: KeyResult Model Dependency

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| FIX1-001 | AIContextService loads without KeyResult import error | Unit | P0 | NOT STARTED |
| FIX1-002 | buildContext() returns valid context without KeyResult | Integration | P0 | NOT STARTED |
| FIX1-003 | AI OKR generation works without KeyResult model | E2E | P0 | NOT STARTED |

---

### FIX-2: Frontend Schema Mismatch

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| FIX2-001 | Company profile saves industry_specific fields | Integration | P0 | NOT STARTED |
| FIX2-002 | Company profile loads existing data correctly | Integration | P0 | NOT STARTED |
| FIX2-003 | No data loss on profile save/load cycle | Integration | P0 | NOT STARTED |

**Corner Cases**:
| Test ID | Corner Case | Expected Behavior |
|---------|-------------|-------------------|
| FIX2-C01 | Empty industry_specific fields | Save succeeds, empty object stored |
| FIX2-C02 | Legacy data with profile.* structure | Migration or graceful fallback |

---

## Phase 1: Prompt Consolidation Tests

### PROMPT-1: Prompt System Structure

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| PR1-001 | server/prompts/index.js exports all functions | Unit | P1 | NOT STARTED |
| PR1-002 | server/prompts/utils.js helper functions work | Unit | P1 | NOT STARTED |
| PR1-003 | getPromptWithMaturity() returns valid prompt | Unit | P0 | NOT STARTED |
| PR1-004 | Prompt includes Karvia Coach personality | Unit | P1 | NOT STARTED |

---

### PROMPT-2: Base System Prompt (Karvia Coach)

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| PR2-001 | Base prompt includes Karvia Coach persona | Unit | P1 | NOT STARTED |
| PR2-002 | Base prompt includes OKR methodology | Unit | P2 | NOT STARTED |
| PR2-003 | Base prompt includes business context template | Unit | P2 | NOT STARTED |

---

### PROMPT-3: Endpoint Templates

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| PR3-001 | okr-generation template produces valid prompt | Unit | P0 | NOT STARTED |
| PR3-002 | single-objective template produces valid prompt | Unit | P0 | NOT STARTED |
| PR3-003 | weekly-plan template produces valid prompt | Unit | P1 | NOT STARTED |
| PR3-004 | ssi-narrative template produces valid prompt | Unit | P1 | NOT STARTED |
| PR3-005 | task-suggestion template produces valid prompt | Unit | P1 | NOT STARTED |

**Workflow Tests**:
| Test ID | Workflow | Steps |
|---------|----------|-------|
| PR3-W01 | OKR Generation with Prompt | 1. Get maturity stage<br>2. Get appropriate prompt<br>3. Build context<br>4. Generate OKR<br>5. Verify Karvia Coach tone in response |

---

### PROMPT-4: GuidanceBuilder Service

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| PR4-001 | GuidanceBuilder creates valid JSON structure | Unit | P0 | NOT STARTED |
| PR4-002 | Guidance block includes required_format | Unit | P1 | NOT STARTED |
| PR4-003 | Guidance block includes validation rules | Unit | P1 | NOT STARTED |
| PR4-004 | AI response follows guidance block format | Integration | P0 | NOT STARTED |

---

## Phase 2: Activate Existing Tests

### ACT-1: Guidance Block in AI OKR

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| ACT1-001 | generate-from-company includes guidance block | Integration | P0 | NOT STARTED |
| ACT1-002 | Generated OKR follows guidance format | Integration | P0 | NOT STARTED |
| ACT1-003 | Guidance block validation works | Unit | P1 | NOT STARTED |

---

### ACT-2: Guidance Block in Planning

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| ACT2-001 | generate-weekly-plan includes guidance block | Integration | P1 | NOT STARTED |
| ACT2-002 | generate-tasks includes guidance block | Integration | P1 | NOT STARTED |

---

### ACT-3: Rejection History

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| ACT3-001 | Rejected OKRs stored in context | Integration | P1 | NOT STARTED |
| ACT3-002 | Rejection reasons included in next prompt | Integration | P1 | NOT STARTED |
| ACT3-003 | New generation avoids rejected patterns | E2E | P2 | NOT STARTED |

**Workflow Tests**:
| Test ID | Workflow | Steps |
|---------|----------|-------|
| ACT3-W01 | Rejection-Aware Generation | 1. Generate OKR<br>2. Reject with reason<br>3. Generate again<br>4. Verify new OKR is different<br>5. Verify rejection reason influenced output |

---

### ACT-4: Risk Indicators

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| ACT4-001 | Aging clients risk indicator included when applicable | Integration | P2 | NOT STARTED |
| ACT4-002 | Revenue concentration risk included when applicable | Integration | P2 | NOT STARTED |
| ACT4-003 | Next-gen engagement risk included when applicable | Integration | P2 | NOT STARTED |
| ACT4-004 | AI recommendations mention risk factors | E2E | P2 | NOT STARTED |

---

## Phase 3: Context Maturity Tests

### MAT-1: ContextMaturityService

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| MAT1-001 | Service calculates maturity score (0-100) | Unit | P0 | NOT STARTED |
| MAT1-002 | Service returns correct stage (0-4) | Unit | P0 | NOT STARTED |
| MAT1-003 | 13 weighted factors are evaluated | Unit | P1 | NOT STARTED |
| MAT1-004 | Stage thresholds are correct (0-20, 20-45, 45-65, 65-80, 80-100) | Unit | P0 | NOT STARTED |

**Maturity Stage Tests**:
| Test ID | Stage | Score Range | Expected Behavior |
|---------|-------|-------------|-------------------|
| MAT1-S0 | Stage 0: Discovery | 0-20% | Industry benchmarks only |
| MAT1-S1 | Stage 1: Assessment | 20-45% | Company profile + SSI |
| MAT1-S2 | Stage 2: Execution | 45-65% | + Task patterns |
| MAT1-S3 | Stage 3: Learning | 65-80% | + Outcome history |
| MAT1-S4 | Stage 4: Mastery | 80-100% | Full predictive capability |

**Corner Cases**:
| Test ID | Corner Case | Expected Behavior |
|---------|-------------|-------------------|
| MAT1-C01 | New company with no data | Stage 0, score 0 |
| MAT1-C02 | Company with only SSI complete | Stage 1, ~25% score |
| MAT1-C03 | Company at exact boundary (e.g., 45%) | Lower stage (Stage 1) |
| MAT1-C04 | All factors at maximum | Stage 4, 100% score |
| MAT1-C05 | Missing optional factors | Graceful calculation with available data |

---

### MAT-2: Context Maturity API

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| MAT2-001 | GET /api/context-maturity returns maturity data | Integration | P0 | NOT STARTED |
| MAT2-002 | GET /api/context-maturity/quick returns quick summary | Integration | P1 | NOT STARTED |
| MAT2-003 | GET /api/context-maturity/stage/:n returns stage details | Integration | P1 | NOT STARTED |
| MAT2-004 | GET /api/context-maturity/stages returns all stages | Integration | P2 | NOT STARTED |
| MAT2-005 | GET /api/context-maturity/recommendations returns actions | Integration | P1 | NOT STARTED |

---

### MAT-3: Stage-Based Prompt Selection

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| MAT3-001 | getPromptWithMaturity() auto-detects company stage | Integration | P0 | NOT STARTED |
| MAT3-002 | Stage 0 uses benchmark-focused prompt | Integration | P0 | NOT STARTED |
| MAT3-003 | Stage 1+ uses company-specific prompt | Integration | P0 | NOT STARTED |
| MAT3-004 | Stage 3+ includes outcome context | Integration | P1 | NOT STARTED |
| MAT3-005 | Prompt complexity scales with maturity | Integration | P2 | NOT STARTED |

---

### MAT-4: Dashboard Maturity Indicator

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| MAT4-001 | Maturity indicator visible on dashboard | E2E | P1 | NOT STARTED |
| MAT4-002 | Clicking indicator opens detail modal | E2E | P1 | NOT STARTED |
| MAT4-003 | Modal shows current stage and progress | E2E | P2 | NOT STARTED |
| MAT4-004 | Modal shows recommendations for next stage | E2E | P2 | NOT STARTED |

---

## Phase 4: Benchmark Tests

### BENCH-1: BenchmarkProvider Interface

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| BENCH1-001 | LegacyBenchmarkProvider wraps industries.js | Unit | P0 | NOT STARTED |
| BENCH1-002 | getBenchmarks(industry) returns valid data | Unit | P0 | NOT STARTED |
| BENCH1-003 | getBenchmarks() handles unknown industry | Unit | P1 | NOT STARTED |
| BENCH1-004 | Benchmark includes typical_metrics | Unit | P1 | NOT STARTED |
| BENCH1-005 | Benchmark includes success_indicators | Unit | P1 | NOT STARTED |

---

### BENCH-2: Stage 0 Fallback

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| BENCH2-001 | Stage 0 prompt uses industry benchmarks | Integration | P0 | NOT STARTED |
| BENCH2-002 | OKR generation works with only benchmarks | E2E | P0 | NOT STARTED |
| BENCH2-003 | Benchmarks provide reasonable defaults | Unit | P1 | NOT STARTED |

---

### BENCH-3: Benchmark Validation

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| BENCH3-001 | validateBenchmarks.js script runs | Unit | P1 | NOT STARTED |
| BENCH3-002 | All 42 benchmark tests pass | Unit | P1 | NOT STARTED |
| BENCH3-003 | Invalid benchmark data is rejected | Unit | P2 | NOT STARTED |

**Verification**:
```bash
node server/scripts/validateBenchmarks.js
```

---

## Phase 5: Outcome Tracking Tests

### OUT-1: OKROutcome Model

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| OUT1-001 | OKROutcome model creates valid document | Unit | P0 | NOT STARTED |
| OUT1-002 | getSuccessRate() returns correct percentage | Unit | P0 | NOT STARTED |
| OUT1-003 | getSuccessRateByCategory() groups correctly | Unit | P1 | NOT STARTED |
| OUT1-004 | getCommonFailureReasons() returns top N | Unit | P1 | NOT STARTED |
| OUT1-005 | getLessonsSummary() returns recent lessons | Unit | P1 | NOT STARTED |
| OUT1-006 | getAIContextSummary() returns complete summary | Unit | P0 | NOT STARTED |

**Corner Cases**:
| Test ID | Corner Case | Expected Behavior |
|---------|-------------|-------------------|
| OUT1-C01 | No outcomes recorded | Returns 0% success rate, empty arrays |
| OUT1-C02 | All outcomes successful | Returns 100% success rate |
| OUT1-C03 | All outcomes failed | Returns 0% success rate |
| OUT1-C04 | Single outcome | Calculates correctly |

---

### OUT-2: Outcome Capture API

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| OUT2-001 | POST /api/outcomes creates outcome | Integration | P0 | NOT STARTED |
| OUT2-002 | PUT /api/outcomes/:id updates outcome | Integration | P0 | NOT STARTED |
| OUT2-003 | POST /api/outcomes/:id/submit submits for review | Integration | P1 | NOT STARTED |
| OUT2-004 | GET /api/outcomes lists company outcomes | Integration | P0 | NOT STARTED |
| OUT2-005 | GET /api/outcomes/:id returns single outcome | Integration | P1 | NOT STARTED |
| OUT2-006 | GET /api/outcomes/objective/:id returns objective outcome | Integration | P1 | NOT STARTED |
| OUT2-007 | GET /api/outcomes/analytics/summary returns AI context | Integration | P0 | NOT STARTED |
| OUT2-008 | GET /api/outcomes/analytics/success-rate returns metrics | Integration | P1 | NOT STARTED |
| OUT2-009 | GET /api/outcomes/analytics/failure-reasons returns top reasons | Integration | P1 | NOT STARTED |
| OUT2-010 | GET /api/outcomes/analytics/lessons returns lessons | Integration | P1 | NOT STARTED |
| OUT2-011 | GET /api/outcomes/pending/objectives lists objectives needing review | Integration | P0 | NOT STARTED |

**Permission Tests**:
| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| OUT2-P01 | CONSULTANT can create outcome | 201 Created |
| OUT2-P02 | BUSINESS_OWNER can create outcome | 201 Created |
| OUT2-P03 | EXECUTIVE can create outcome | 201 Created |
| OUT2-P04 | MANAGER can create outcome | 201 Created |
| OUT2-P05 | EMPLOYEE cannot create outcome | 403 Forbidden |
| OUT2-P06 | User can only view own company outcomes | 200 with filtered data |

---

### OUT-3: Quarterly Review UI

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| OUT3-001 | /pages/quarterly-review.html loads | E2E | P0 | NOT STARTED |
| OUT3-002 | Pending tab shows objectives without outcomes | E2E | P0 | NOT STARTED |
| OUT3-003 | Completed tab shows recorded outcomes | E2E | P0 | NOT STARTED |
| OUT3-004 | Outcome capture modal opens | E2E | P0 | NOT STARTED |
| OUT3-005 | Modal includes all required fields | E2E | P1 | NOT STARTED |
| OUT3-006 | Save outcome updates list | E2E | P0 | NOT STARTED |
| OUT3-007 | Analytics modal shows metrics | E2E | P2 | NOT STARTED |

**Workflow Tests**:
| Test ID | Workflow | Steps |
|---------|----------|-------|
| OUT3-W01 | Complete Outcome Capture | 1. Navigate to quarterly-review.html<br>2. Click pending objective<br>3. Open outcome modal<br>4. Fill outcome status<br>5. Add lessons learned<br>6. Save outcome<br>7. Verify objective moves to completed tab |
| OUT3-W02 | View Analytics | 1. Navigate to quarterly-review.html<br>2. Open analytics modal<br>3. Verify success rate displayed<br>4. Verify category breakdown shown<br>5. Verify lessons summary visible |

---

### OUT-4: Outcome Integration with Prompts

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| OUT4-001 | Stage 3+ prompts include outcome context | Integration | P0 | NOT STARTED |
| OUT4-002 | getOutcomeContextForPrompt() returns valid data | Unit | P0 | NOT STARTED |
| OUT4-003 | Outcome lessons influence AI suggestions | E2E | P2 | NOT STARTED |
| OUT4-004 | Failure patterns mentioned in AI warnings | E2E | P2 | NOT STARTED |

---

## Cleanup Tests

### CLN-1: AILoggingWrapper

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| CLN1-001 | AILogBuilder creates valid log entry | Unit | P1 | NOT STARTED |
| CLN1-002 | withAILogging wrapper logs interactions | Unit | P1 | NOT STARTED |
| CLN1-003 | logAIInteraction creates database entry | Integration | P1 | NOT STARTED |
| CLN1-004 | Errors are logged with stack trace | Unit | P2 | NOT STARTED |

---

## End-to-End Workflow Tests

### WF-001: New Company Journey (Stage 0 to Stage 1)

**Preconditions**: New company registration

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create new company | Company created, Stage 0 |
| 2 | Check maturity indicator | Shows "Discovery" stage |
| 3 | Open AI generation modal | Company Profile shows "Not available" |
| 4 | Generate OKR | Uses industry benchmarks only |
| 5 | Complete company profile (>50%) | Profile saved |
| 6 | Complete SSI assessment | Assessment results saved |
| 7 | Check maturity indicator | Shows "Assessment" stage (Stage 1) |
| 8 | Generate new OKR | Uses company profile + SSI data |
| 9 | Verify OKR is more customized | Company-specific metrics mentioned |

---

### WF-002: Complete OKR Cycle with Outcome

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Generate OKR with AI | Objective created |
| 2 | Add quarterly goals | Goals linked to objective |
| 3 | Track progress over time | Progress updates recorded |
| 4 | Complete objective period | Objective status changed |
| 5 | Navigate to quarterly review | Objective appears in pending list |
| 6 | Record outcome | Outcome modal opens |
| 7 | Fill outcome details | Achievement %, lessons, what worked |
| 8 | Submit outcome | Outcome saved, moves to completed |
| 9 | Check analytics | Success rate updated |
| 10 | Generate next OKR | AI mentions lessons learned |

---

### WF-003: Maturity Stage Progression

| Step | Action | Expected Stage |
|------|--------|----------------|
| 1 | New company | Stage 0: Discovery (0-20%) |
| 2 | Complete SSI assessment | Stage 1: Assessment (20-45%) |
| 3 | Add company profile | Stage 1-2: Assessment/Execution |
| 4 | Create objectives + goals | Stage 2: Execution (45-65%) |
| 5 | Track tasks regularly | Stage 2-3 |
| 6 | Record outcomes | Stage 3: Learning (65-80%) |
| 7 | Multiple cycles complete | Stage 4: Mastery (80-100%) |

---

### WF-004: Consultant Company Profile Access

**Preconditions**: Consultant with managed businesses

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as consultant | Dashboard loads |
| 2 | Switch to client company | Company context changes |
| 3 | Open Company Profile | Client profile loads |
| 4 | Edit profile fields | Changes made |
| 5 | Save profile | Save succeeds (not 403) |
| 6 | Open AI modal | Company Profile shows "Available" |
| 7 | Generate OKR | Uses client company context |
| 8 | Switch back to own company | Own company data shows |

---

## Bug Fixes Applied During Sprint 17

| Bug ID | Description | Fix Applied | Test Coverage |
|--------|-------------|-------------|---------------|
| FIX-1 | KeyResult model missing | Removed dependency | FIX1-001 to FIX1-003 |
| FIX-2 | Frontend schema mismatch | Fixed field mapping | FIX2-001 to FIX2-003 |
| ISS-S17-001 | outcome-capture routes using wrong auth | Switched to authGuards/roleGuards | OUT2-P01 to OUT2-P06 |
| ISS-S17-002 | Consultant can't save company profile | Added own company check | WF-004 |
| ISS-S17-003 | Company Profile "Not available" for consultant | Fixed GET route permission | WF-004, Step 6 |

---

## Corner Case Matrix

| Category | Corner Case | Test ID | Expected Behavior |
|----------|-------------|---------|-------------------|
| **Maturity** | New company, no data | MAT1-C01 | Stage 0, 0% score |
| **Maturity** | Exact boundary score | MAT1-C03 | Use lower stage |
| **Outcome** | No outcomes recorded | OUT1-C01 | 0% success, empty arrays |
| **Outcome** | All failed | OUT1-C03 | 0% success, failure reasons populated |
| **Benchmark** | Unknown industry | BENCH1-003 | Use generic benchmarks |
| **Prompt** | Stage 0 with no company data | BENCH2-002 | Works with benchmarks only |
| **Prompt** | Stage 3 with no outcomes | MAT3-004 | Gracefully omit outcome context |
| **Permission** | Consultant with no managed businesses | TD2-C01 | Access own company only |

---

## Test Commands

```bash
# Run all Sprint 17 tests
npm test

# By category
npm run test:unit -- --grep "Sprint 17"
npm run test:integration -- --grep "context-maturity"
npm run test:integration -- --grep "outcome"

# Specific services
npm test -- --grep "ContextMaturityService"
npm test -- --grep "BenchmarkProvider"
npm test -- --grep "OKROutcome"
npm test -- --grep "AILoggingWrapper"

# Validate benchmarks
node server/scripts/validateBenchmarks.js

# E2E tests
npm run test:e2e -- --grep "quarterly-review"
npm run test:e2e -- --grep "maturity"
```

---

## API Endpoint Reference

### Context Maturity API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/context-maturity | GET | Get full maturity data |
| /api/context-maturity/quick | GET | Quick summary |
| /api/context-maturity/stage/:n | GET | Stage details |
| /api/context-maturity/stages | GET | All stages |
| /api/context-maturity/recommendations | GET | Next actions |

### Outcome API
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/outcomes | POST | Create outcome |
| /api/outcomes | GET | List outcomes |
| /api/outcomes/:id | GET | Get outcome |
| /api/outcomes/:id | PUT | Update outcome |
| /api/outcomes/:id/submit | POST | Submit for review |
| /api/outcomes/objective/:id | GET | Outcome by objective |
| /api/outcomes/analytics/summary | GET | AI context summary |
| /api/outcomes/analytics/success-rate | GET | Success metrics |
| /api/outcomes/analytics/failure-reasons | GET | Top failure reasons |
| /api/outcomes/analytics/lessons | GET | Lessons learned |
| /api/outcomes/pending/objectives | GET | Objectives needing review |

---

## Acceptance Criteria

### Must Pass Before Deploy

- [ ] All Phase 0 fixes verified (P0)
- [ ] Context maturity calculation correct
- [ ] Stage-based prompt selection working
- [ ] Outcome capture API functional
- [ ] Consultant company access fixed
- [ ] No regressions in AI generation

### Must Pass Before Sprint Close

- [ ] All maturity stages tested
- [ ] Complete OKR cycle workflow passes
- [ ] Quarterly review UI functional
- [ ] Benchmark validation passes (42/42)
- [ ] AILoggingWrapper tests pass

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |

---

**Document Version**: 1.0
**Last Updated**: March 9, 2026
