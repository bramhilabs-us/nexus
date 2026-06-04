# Architecture Audit - Q1 2026

<!-- @GENOME T2-ARC-009 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/audit | linked:/strategy -->

**Document ID**: K2-ARCH-AUDIT-001
**Created**: March 10, 2026
**Sprint**: Post-Sprint 18
**Status**: Current
**Next Review**: Q2 2026

---

## Executive Summary

This document captures a comprehensive architecture review across four critical areas:
1. **SSI Scoring Architecture** - Two competing systems causing score inconsistency
2. **Testing Infrastructure** - Strong foundation with CI/CD gaps
3. **AI/LLM Architecture** - Sophisticated maturity-based system
4. **Database/Data Model** - Well-structured multi-tenant design

### Overall Health Assessment

| Area | Health | Action Required |
|------|--------|-----------------|
| SSI Scoring | ⚠️ Warning | Sprint 18-A (13 pts) |
| Testing | ✅ Good | Sprint 19 (75 pts) |
| AI/LLM | ✅ Good | Minor improvements |
| Data Model | ✅ Good | Strategic enhancements |

---

## 1. SSI Scoring Architecture

### Current State

The system has **two competing SSI scoring methods** producing different results:

| Scoring Method | Implementation | Used By |
|----------------|----------------|---------|
| Simple Averaging | Direct dimension average | Team-breakdown endpoint, Company Overview |
| 12-Block MECE | Block-level aggregation with industry weights | SSI Diagnostic Report |

**Example Score Discrepancy:**
| View | Speed | Strength | Intelligence | Composite |
|------|-------|----------|--------------|-----------|
| Company Overview | 8.6 | 5.4 | 7.1 | 7.0 |
| SSI Diagnostic | 6.0 | 4.1 | 6.4 | 5.5 |

### Root Cause Analysis

The `team-breakdown` endpoint in `server/routes/assessments.js:677-1083` uses simple averaging:

```javascript
// Current implementation (simple averaging)
const sumSpeed = teamAssessments.reduce((sum, a) => sum + getDimensionScore(a, 'speed'), 0);
avgSpeed = sumSpeed / teamAssessments.length;
```

While the diagnostic system uses `UnifiedSSIScoringService`:

```javascript
// Correct implementation (12-block MECE)
const ssiResult = UnifiedSSIScoringService.calculateSSI(questions, responses, {
  industry: company.industry,
  includeBlocks: true
});
```

### Key Files

| File | Purpose | Status |
|------|---------|--------|
| `server/services/UnifiedSSIScoringService.js` | 12-Block MECE scoring | ✅ Primary |
| `server/routes/assessments.js:677-1083` | Team-breakdown endpoint | ⚠️ Needs update |
| `server/services/diagnostic/DiagnosticEngine.js` | Company aggregation | ⚠️ Mixed methods |
| `server/services/AIContextService.js:512-517` | AI context scores | ⚠️ Simple avg |

### 12-Block MECE Structure

```
Speed (3 blocks + 1)
├── Delivery (questions about fulfillment speed)
├── Decisions (questions about decision velocity)
├── Change (questions about adaptation speed)
└── Response (questions about customer response time)

Strength (4 blocks)
├── Financial (cash flow, margins)
├── Operations (process efficiency)
├── People (retention, capability)
└── Quality (product/service quality)

Intelligence (4 blocks)
├── Market (market awareness)
├── Data (data utilization)
├── Strategy (strategic clarity)
└── Learning (organizational learning)
```

### Action Items

| Priority | Action | Sprint | Points |
|----------|--------|--------|--------|
| P0 | Update team-breakdown to use DiagnosticEngine | 18-A | 5 |
| P0 | Legacy format support in DiagnosticEngine | 18-A | 3 |
| P0 | Comprehensive testing | 18-A | 3 |
| P1 | AIContextService unification | 19 | 5 |
| P2 | Data migration to ssi_result format | 20+ | 8 |

---

## 2. Testing Infrastructure

### Current Coverage

```
Total Test Files: 42
Total Tests: ~1,333+ (across all suites)

tests/
├── unit/           # 25 files, 1152 tests
├── integration/    # 8 files, 181 tests
├── e2e/            # 4 files, 37 tests
├── security/       # 1 file, 26 tests
└── helpers/        # 4 utility files
```

### CI/CD Pipeline

**GitHub Actions Workflow: `.github/workflows/test.yml`**

| Test Level | Branches | Blocking | Status |
|------------|----------|----------|--------|
| Unit | All | Yes | ✅ |
| Integration | All | Yes | ✅ |
| Security | pre-prod, production | Yes | ✅ |
| E2E | pre-prod, production | Yes | ✅ |
| Post-deploy Smoke | None | No | ❌ Missing |

### Test Helpers

| Helper | Purpose | Lines |
|--------|---------|-------|
| `authHelper.js` | JWT token generation, auth mocking | ~150 |
| `dbHelper.js` | Database operations, scenario creation | ~200 |
| `testUtils.js` | Setup/teardown, mock request/response | ~250 |
| `factories.js` | Test data factories for all models | ~350 |

### Coverage Configuration

**Current Thresholds:**
```javascript
// tests/jest.config.js
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50
  }
}
```

**Target Thresholds (Post-Sprint 19):**
```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 80,
    lines: 80,
    statements: 80
  }
}
```

### Gaps Identified

| Gap | Impact | Sprint 19 Epic |
|-----|--------|----------------|
| No post-deploy smoke tests | Production blind spots | T4 (15 pts) |
| IAM mock server missing | 30 tests skipped in CI | T5 (10 pts) |
| Coverage threshold low (50%) | Quality gate ineffective | T3 (12 pts) |
| No test documentation | Onboarding difficult | T6 (8 pts) |
| Tests don't block deploys | Quality risk | T2 (15 pts) |

### Action Items

| Priority | Action | Sprint | Points |
|----------|--------|--------|--------|
| P1 | Test organization audit | 19 | 10 |
| P1 | CI/CD deployment gates | 19 | 15 |
| P1 | Post-deploy smoke tests | 19 | 15 |
| P2 | Service mocking (IAM) | 19 | 10 |
| P2 | Coverage infrastructure | 19 | 12 |
| P3 | Test documentation | 19 | 8 |

---

## 3. AI/LLM Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Context Pipeline                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Request → ContextMaturityService.calculateMaturity()        │
│              ↓                                               │
│           AIContextService.buildContext()                    │
│              ↓                                               │
│           prompts/index.js → getPromptWithMaturity()         │
│              ↓                                               │
│           OpenAI API Call                                    │
│              ↓                                               │
│           AILoggingWrapper → AIInteractionLog                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Maturity-Based Context System

| Stage | Score Range | Context Available | AI Confidence |
|-------|-------------|-------------------|---------------|
| 0 (Discovery) | 0-20% | Industry benchmarks only | 20% |
| 1 (Assessment) | 20-45% | + Company profile, SSI scores | 45% |
| 2 (Execution) | 45-65% | + Task patterns, velocity | 65% |
| 3 (Learning) | 65-80% | + OKR outcomes, lessons | 80% |
| 4 (Mastery) | 80-100% | + Predictive patterns | 95% |

### Token Budget Management

```javascript
const TOKEN_LIMITS = {
  company: 500,       // P0: Company profile
  ssi: 800,           // P0: SSI 12-block scores
  focus: 400,         // P0: Focus item
  objectives: 1500,   // P1: Active objectives
  rejections: 600,    // P1: Rejection history
  weeklyGoals: 1200,  // P2: Weekly goals
  taskHistory: 800,   // P2: Task history
  delta: 400,         // P2: Context changes
  team: 300,          // P3: Team info
  buffer: 500         // Reserve for prompt template
};
const MAX_TOKENS = 8000;
```

### Key Services

| Service | File | Purpose | Lines |
|---------|------|---------|-------|
| AIContextService | `server/services/AIContextService.js` | Context building | 2095 |
| ContextMaturityService | `server/services/ContextMaturityService.js` | Stage calculation | ~300 |
| Prompt Router | `server/prompts/index.js` | Prompt selection | ~500 |
| AILoggingWrapper | `server/services/AILoggingWrapper.js` | Logging interface | ~200 |
| GuidanceBuilder | `server/prompts/guidance-builder.js` | Response guidance | ~150 |

### Prompt System

**Location:** `server/prompts/`

```
prompts/
├── base-system-prompt.js       # "Karvia Coach" personality
├── index.js                    # Central router
├── guidance-builder.js         # Guidance block builder
└── endpoint-templates/
    ├── okr-generation.js       # Full OKR set
    ├── single-objective.js     # Single objective refinement
    ├── weekly-plan.js          # Weekly execution
    ├── ssi-narrative.js        # SSI diagnostics
    └── task-suggestion.js      # Task generation
```

### Strengths

- **Context Delta Detection**: Tracks changes between AI interactions
- **Layered Context Building**: P0→P3 priority layers with token budgets
- **Graceful Degradation**: Works without OpenAI enabled
- **Maturity-aware Prompts**: Stage-specific overlays
- **Comprehensive Logging**: AILoggingWrapper + AIInteractionLog model

### Areas for Improvement

| Issue | Current State | Recommendation |
|-------|---------------|----------------|
| Token estimation | ~1 token per 4 chars (rough) | Use js-tiktoken |
| Rejection learning | Manual guidance injection | Auto-block patterns |
| Prompt storage | Hard-coded JS files | Migrate to database |
| Maturity caching | Calculated on every request | Cache with 7-day TTL |
| Benchmark data | Static config file | Database with versioning |

### Action Items

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| P1 | Cache maturity scores | 1 day | Performance |
| P1 | Accurate token counting | 1 day | Reliability |
| P2 | Auto rejection blocking | 2 days | UX |
| P3 | Prompt database migration | 2 weeks | A/B testing |

---

## 4. Database/Data Model Architecture

### Model Hierarchy

```
Company (Multi-tenant Root) - 19,805 bytes
├── User (5 roles + CONSULTANT) - 13,048 bytes
├── Team (members[]) - 7,608 bytes
├── Objective (key_results[] embedded) - 10,766 bytes
│   └── Goal (QUARTERLY/WEEKLY discriminator) - 14,097 bytes
│       └── Task (atomic work items) - 15,318 bytes
├── Assessment (SSI scoring) - 30,152 bytes
├── AssessmentQuestion - 11,154 bytes
├── AssessmentTemplate - 10,778 bytes
├── Invitation (survey distribution) - 21,763 bytes
├── OKROutcome (Sprint 17) - 11,531 bytes
├── SSIDiagnosticReport - 12,392 bytes
├── DiagnosticReport - 4,388 bytes
├── Feedback - 11,318 bytes
├── AIInteractionLog - 9,650 bytes
└── AIOKRSuggestion - 13,512 bytes

Total: 16 models
```

### Multi-Tenancy Pattern

**Standard Implementation:**
```javascript
// Every model includes:
company_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',
  required: true,
  index: true
}

// Compound indexes for common queries:
{ company_id: 1, status: 1 }
{ company_id: 1, owner_id: 1 }
{ company_id: 1, team_id: 1 }
```

**Multi-Company User Support:**
```javascript
// User model supports multiple companies
companies: [{
  company_id: ObjectId,
  role: String,
  joined_at: Date,
  is_primary: Boolean,
  status: 'active'|'inactive'|'suspended'
}]
```

### Soft Delete Pattern

All models use status-based soft delete:

| Model | Status Values |
|-------|---------------|
| Objective | draft, active, completed, paused, cancelled, at_risk |
| Goal | not_started, in_progress, completed, blocked, at_risk, cancelled |
| Task | todo, in_progress, completed, blocked, cancelled, deferred |
| Assessment | draft, in_progress, completed, reviewed, archived |
| User | active, inactive, pending_invite, suspended |

### Date Management

**Supported Period Types:**
1. **Calendar Year**: Jan 1 - Dec 31
2. **Fiscal Year**: Configurable start month (April, July, October)
3. **Custom Period**: 6-36 months

**Cascade System:**
- Parent date changes cascade DOWN to children
- Proportional recalculation through hierarchy
- Mongoose transactions for consistency
- Conflict detection before cascading

### Known Constraints

| Constraint | Description | Workaround |
|------------|-------------|------------|
| Enum changes need migration | Cannot change role/status enums | Use dynamic validation |
| Fiscal year limited months | Only Apr/Jul/Oct official | Custom periods available |
| Cascade is one-way | Parent → Children only | By design |
| Soft delete only | No hard deletes permitted | Archive process |
| Key Results embedded | Can't query KRs independently | Extract to model (P2) |

### Action Items

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| P1 | Standardize SSI data format | 2 days | Data consistency |
| P2 | Extract KeyResult model | 3 days | Query flexibility |
| P2 | Add audit trail | 5 days | Compliance |
| P3 | Schema versioning | 3 days | Migration tracking |
| P3 | Async cascade processing | 5 days | Performance |

---

## Cross-Architecture Integration Points

### SSI ↔ AI Integration

```
Assessment.ssi_result
       ↓
AIContextService.getFullSSIScores()
       ↓
buildContext() includes 12-block data
       ↓
Prompt templates reference SSI weak areas
```

**Issue**: Score inconsistency flows through to AI suggestions.

### Data Model ↔ Testing Integration

```
Test Factories (factories.js)
       ↓
Create test entities (Company, User, Goal, etc.)
       ↓
Test helpers (dbHelper.js) insert to test DB
       ↓
Integration tests validate multi-tenant isolation
```

**Issue**: SSI scoring path not consistently mocked in tests.

### AI ↔ Data Model Integration

```
ContextMaturityService
       ↓
Queries: Company, Assessment, Goal, Task, OKROutcome
       ↓
Calculates maturity score (0-100)
       ↓
Determines stage (0-4)
       ↓
AIInteractionLog records interaction
```

**Issue**: Maturity calculation queries multiple models - expensive.

---

## Priority Action Matrix

### P0 (Immediate - Sprint 18-A)

| Action | Area | Points | Timeline |
|--------|------|--------|----------|
| Fix SSI scoring inconsistency | SSI | 13 | 2-3 days |

### P1 (Next Sprint - Sprint 19)

| Action | Area | Points | Timeline |
|--------|------|--------|----------|
| Testing infrastructure | Testing | 75 | 1.5 weeks |
| Cache maturity scores | AI | - | 1 day |
| Standardize SSI format | Data | - | 2 days |

### P2 (Following Sprints)

| Action | Area | Effort | Impact |
|--------|------|--------|--------|
| Accurate token counting | AI | 1 day | Reliability |
| Extract KeyResult model | Data | 3 days | Query flexibility |
| Coverage to 70% | Testing | Ongoing | Quality |

### P3 (Backlog)

| Action | Area | Effort | Impact |
|--------|------|--------|--------|
| Audit trail | Data | 5 days | Compliance |
| Prompt database | AI | 2 weeks | A/B testing |
| Schema versioning | Data | 3 days | Migration tracking |

---

## Appendices

### A. File Reference Quick Lookup

| Category | Key Files |
|----------|-----------|
| SSI Scoring | `UnifiedSSIScoringService.js`, `assessments.js:677-1083` |
| Testing | `jest.config.js`, `.github/workflows/test.yml`, `tests/helpers/` |
| AI/LLM | `AIContextService.js`, `ContextMaturityService.js`, `prompts/` |
| Data Model | `server/models/*.js`, `server/services/DateService.js` |

### B. Sprint Mapping

| Sprint | Focus | Points |
|--------|-------|--------|
| 18-A | SSI Scoring Unification | 13 |
| 19 | Testing Infrastructure | 75 |
| 20 | TBD (Architecture improvements candidate) | - |

### C. Related Documents

| Document | Path |
|----------|------|
| MVP Technical Architecture | `2-TECHNICAL/0-SYSTEM-ARCHITECTURE/MVP_TECHNICAL_ARCHITECTURE_V5.md` |
| Database Schema | `2-TECHNICAL/3-DATA/database_schema.md` |
| Multi-Tenancy Security | `2-TECHNICAL/1-API-SPECIFICATION/MULTI_TENANCY_SECURITY.md` |
| RBAC Implementation | `2-TECHNICAL/1-API-SPECIFICATION/RBAC_IMPLEMENTATION_GUIDE.md` |

---

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | March 10, 2026 | Claude Code | Initial architecture audit |

---

*Generated during Strategy Session - Architecture Review*
