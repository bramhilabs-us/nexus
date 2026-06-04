# KARVIA 1.0 Engine Lock-In Master Plan

**Created**: April 3, 2026
**Purpose**: Establish KARVIA 1.0 as a stable, documented, and thoroughly tested engine baseline
**Status**: PLANNING
**Impact**: Zero codebase changes - documentation and testing only

---

## Executive Summary

### The Goal

Lock KARVIA Engine as version 1.0 by:
1. Ensuring all documentation is current, tagged, and synchronized
2. Validating user journeys and stories against actual implementation
3. Creating comprehensive test cases for the engine
4. Establishing a clear baseline for future development

### Why This Matters

```
┌───��─────────────────────────────────────────────────────────────┐
│  BEFORE KARVIA 1.0 LOCK-IN                                      │
│  • Docs may be out of sync with code                            │
│  • User stories may describe unbuilt features                   │
│  • Test coverage at 50%, gaps unknown                           │
│  • No clear "what's in v1.0" definition                         │
├─────────────────────────────────────────────────────────────────┤
│  AFTER KARVIA 1.0 LOCK-IN                                       │
│  • All docs verified and tagged                                 │
│  • Clear "implemented vs planned" matrix                        │
│  • Comprehensive engine test suite                              │
│  • YSELA can confidently build on KARVIA 1.0                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current State Assessment

### Documentation Coverage

| Metric | Current | Target |
|--------|---------|--------|
| Total markdown files in KARVIA_STRATEGY | 616 | - |
| Files with genome tags | 148 | 200+ (critical docs) |
| Genome tag coverage | 24% | 100% (governed docs) |
| Stale docs (>60 days old) | Unknown | 0 critical |

### Test Coverage

| Metric | Current | Target |
|--------|---------|--------|
| Overall test coverage | 50% | 70% |
| Test files | 30 | 50+ |
| Total tests | 622 | 800+ |
| Passing rate | 94.5% | 100% |
| Security tests | 100% | 100% |

### User Journeys & Stories

| Artifact | Count | Validated | Status |
|----------|-------|-----------|--------|
| User journey files | 8 | Unknown | Needs validation |
| User story files | 9 active | Unknown | Needs validation |
| Archived story files | 4 | N/A | Historical |

---

## The Four Pillars of KARVIA 1.0 Lock-In

### Pillar 1: Documentation Governance

**Goal**: Ensure all critical KARVIA docs are properly tagged, current, and synchronized.

```
┌─────────────────────────────────────────────────────────────────┐
│  DOCUMENTATION GOVERNANCE SCOPE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MUST TAG (Governed directories):                               │
│  ├── 1-PRODUCT/                    ← Product docs               │
│  │   ├── user-journeys/            ← 8 files                    │
│  │   ├── user-stories/             ← 9 files                    │
│  │   ├── strategy/                 ← Strategy docs              │
│  │   └── backlog/                  ← Backlog                    │
│  │                                                               │
│  ├── 2-TECHNICAL/                  ← Technical docs             │
│  │   ├── 1-API-SPECIFICATION/      ← API specs                  │
│  │   ├── 2-DATA-MODELS/            ← Schema definitions         │
│  │   └── 3-DESIGN-SYSTEM/          ← Design tokens              │
│  │                                                               │
│  └── 3-DELIVERY/                   ← Active sprint docs only    │
│      └── 2-QA-AND-TESTING/         ← QA docs                    │
│                                                                  │
│  SKIP (Not governed):                                           │
│  ├── Complete sprint folders       ← Historical                 │
│  └── ARCHIVE/                      ← Legacy                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Pillar 2: User Journey Validation

**Goal**: Verify each user journey step is implemented in the codebase.

| Journey File | Personas | Steps | Status |
|--------------|----------|-------|--------|
| CONSULTANT_JOURNEY.md | Consultant | ~25 | To validate |
| EXECUTIVE_JOURNEY.md | Executive | ~20 | To validate |
| MANAGER_JOURNEY.md | Manager | ~18 | To validate |
| EMPLOYEE_JOURNEY.md | Employee | ~15 | To validate |
| ADMIN_JOURNEY.md | Admin | ~12 | To validate |
| CROSS_PAGE_AI_CONTEXT_FLOW.md | All | ~30 | To validate |
| USER_JOURNEYS_MASTER.md | All | Index | To validate |
| KARVIA_USER_FLOW_SIMPLE.md | All | Overview | To validate |

**Validation Process**:
1. Read each journey step
2. Map to API endpoint or UI component
3. Mark as: IMPLEMENTED / PARTIAL / NOT_IMPLEMENTED / DEPRECATED
4. Update doc with implementation status

### Pillar 3: User Story Validation

**Goal**: Map each user story to implementation status.

| Story File | Stories | Implemented | Partial | Planned |
|------------|---------|-------------|---------|---------|
| PERSONA_CONS_STORIES.md | ~20 | TBD | TBD | TBD |
| PERSONA_EXEC_STORIES.md | ~15 | TBD | TBD | TBD |
| PERSONA_MGR_STORIES.md | ~15 | TBD | TBD | TBD |
| PERSONA_EMP_STORIES.md | ~15 | TBD | TBD | TBD |
| PERSONA_ADMIN_STORIES.md | ~10 | TBD | TBD | TBD |
| AI_CONTEXT_STORIES.md | ~20 | TBD | TBD | TBD |
| USER_STORIES_MASTER.md | 105+ | TBD | TBD | TBD |

**Validation Process**:
1. Read each user story
2. Check acceptance criteria against codebase
3. Mark as: IMPLEMENTED / PARTIAL / PLANNED / DEFERRED
4. Update story with implementation notes

### Pillar 4: Comprehensive Test Suite

**Goal**: Create test cases for all KARVIA 1.0 engine capabilities.

```
KARVIA 1.0 ENGINE TEST SUITE
├── API Route Tests
│   ├── auth.test.js                 ✓ EXISTS
│   ├── objectives.test.js           ← TO CREATE
│   ├── goals.test.js                ← TO CREATE
│   ├── tasks.test.js                ← TO CREATE
│   ├── teams.test.js                ← TO CREATE
│   ├── companies.test.js            ← TO CREATE
│   ├── assessments.test.js          ← TO CREATE
│   ├── planning.test.js             ← TO CREATE
│   └── ai-okr.test.js               ✓ EXISTS (partial)
│
├── Service Tests
│   ├── DateService.test.js          ✓ EXISTS
│   ├── ValidationService.test.js    ← TO CREATE
│   ├── AIContextService.test.js     ← TO CREATE
│   └── SSIService.test.js           ✓ EXISTS
│
├── Model Tests
│   ├── Company.test.js              ← TO CREATE
│   ├── Objective.test.js            ← TO CREATE
│   ├── Goal.test.js                 ← TO CREATE
│   └── Task.test.js                 ← TO CREATE
│
├── Journey Tests (E2E)
│   ├── consultant-journey.test.js   ✓ EXISTS (partial)
│   ├── executive-journey.test.js    ← TO CREATE
│   ├── manager-journey.test.js      ← TO CREATE
│   ├── employee-journey.test.js     ← TO CREATE
│   └── admin-journey.test.js        ← TO CREATE
│
└── Security Tests
    └── multi-tenant-isolation.test.js ✓ EXISTS (26 tests)
```

---

## KARVIA 1.0 Engine Capabilities (Baseline Definition)

### Core Features Included in 1.0

| Module | Feature | Status | Tests |
|--------|---------|--------|-------|
| **Authentication** | Login/Logout | IMPLEMENTED | YES |
| | JWT tokens | IMPLEMENTED | YES |
| | Role-based access | IMPLEMENTED | YES |
| | Password reset | IMPLEMENTED | PARTIAL |
| **Multi-Tenancy** | Company isolation | IMPLEMENTED | YES |
| | Data separation | IMPLEMENTED | YES |
| | Tenant context | IMPLEMENTED | YES |
| **OKR Hierarchy** | Objectives CRUD | IMPLEMENTED | PARTIAL |
| | Key Results CRUD | IMPLEMENTED | PARTIAL |
| | Goals CRUD | IMPLEMENTED | PARTIAL |
| | Tasks CRUD | IMPLEMENTED | PARTIAL |
| | Cascade system | IMPLEMENTED | NO |
| **Assessment** | SSI Assessment | IMPLEMENTED | PARTIAL |
| | 12-Block scoring | IMPLEMENTED | YES |
| | Industry presets | IMPLEMENTED | YES |
| | Report generation | IMPLEMENTED | PARTIAL |
| **AI Integration** | OKR generation | IMPLEMENTED | PARTIAL |
| | Context service | IMPLEMENTED | YES |
| | Prompt system | IMPLEMENTED | PARTIAL |
| **Teams** | Team CRUD | IMPLEMENTED | PARTIAL |
| | Membership | IMPLEMENTED | PARTIAL |
| **Planning** | Weekly planning | IMPLEMENTED | NO |
| | Quarterly review | IMPLEMENTED | NO |
| **Dashboard** | Role dashboards | IMPLEMENTED | NO |
| | Metrics | IMPLEMENTED | NO |

### Features NOT in 1.0 (Planned for Later)

- Behavior Engine (GRIT) - Sprint 22+
- iBrain Integration - Future
- Gamification (PBL) - Sprint 23+
- Advanced Analytics - Sprint 24+
- Mobile PWA - Future

---

## Implementation Plan

### Phase 1: Documentation Audit (Days 1-3)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Identify all governed docs in KARVIA_STRATEGY | P0 | S | CTO |
| Add genome tags to untagged critical docs | P0 | M | CTO |
| Update stale docs (>60 days) or mark deprecated | P1 | M | CTO |
| Create KARVIA_1.0_CAPABILITIES.md (baseline) | P0 | M | CTO |
| Update CLAUDE.md with 1.0 references | P1 | S | CTO |

**Estimated governed docs to tag**: ~50-80 files

### Phase 2: Journey Validation (Days 2-4)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Read CONSULTANT_JOURNEY.md, map to code | P0 | M | CTO |
| Read EXECUTIVE_JOURNEY.md, map to code | P0 | M | CTO |
| Read MANAGER_JOURNEY.md, map to code | P1 | M | CTO |
| Read EMPLOYEE_JOURNEY.md, map to code | P1 | M | CTO |
| Read ADMIN_JOURNEY.md, map to code | P1 | S | CTO |
| Create JOURNEY_VALIDATION_MATRIX.md | P0 | M | CTO |

**Deliverable**: Each journey file updated with implementation status tags

### Phase 3: Story Validation (Days 3-5)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Read USER_STORIES_MASTER.md (105 stories) | P0 | L | CTO |
| Map each story to implementation status | P0 | L | CTO |
| Create STORY_IMPLEMENTATION_MATRIX.md | P0 | M | CTO |
| Update story files with status tags | P1 | M | CTO |

**Deliverable**: Clear view of what's built vs planned

### Phase 4: Test Suite Creation (Days 4-7)

| Task | Priority | Effort | Tests |
|------|----------|--------|-------|
| Create objectives route tests | P0 | M | ~15 |
| Create goals route tests | P0 | M | ~15 |
| Create tasks route tests | P0 | M | ~15 |
| Create teams route tests | P1 | M | ~10 |
| Create companies route tests | P1 | M | ~10 |
| Create journey E2E tests (4 personas) | P1 | L | ~40 |
| Create model unit tests | P2 | M | ~20 |

**Target**: Increase from 622 tests to 800+ tests

### Phase 5: Validation & Baseline (Days 6-8)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Run full test suite, achieve 100% pass | P0 | M | CTO |
| Generate coverage report | P0 | S | CTO |
| Create KARVIA_1.0_RELEASE_NOTES.md | P0 | M | CTO |
| Update TEST_COVERAGE_DASHBOARD.md | P1 | S | CTO |
| Final documentation review | P1 | M | Both |

---

## Deliverables

### Documentation Deliverables

| Deliverable | Purpose |
|-------------|---------|
| `KARVIA_1.0_CAPABILITIES.md` | Official list of what's in 1.0 |
| `KARVIA_1.0_RELEASE_NOTES.md` | Release documentation |
| `JOURNEY_VALIDATION_MATRIX.md` | Journey step → implementation mapping |
| `STORY_IMPLEMENTATION_MATRIX.md` | Story → implementation mapping |
| Updated genome tags on all governed docs | Documentation governance |

### Test Deliverables

| Deliverable | Tests | Location |
|-------------|-------|----------|
| Objectives route tests | ~15 | `tests/integration/` |
| Goals route tests | ~15 | `tests/integration/` |
| Tasks route tests | ~15 | `tests/integration/` |
| Teams route tests | ~10 | `tests/integration/` |
| Companies route tests | ~10 | `tests/integration/` |
| Executive journey tests | ~10 | `tests/e2e/` |
| Manager journey tests | ~10 | `tests/e2e/` |
| Employee journey tests | ~10 | `tests/e2e/` |
| Admin journey tests | ~8 | `tests/e2e/` |

**Total new tests**: ~100+ tests

---

## Success Criteria

### Documentation Success

- [ ] All governed docs have current genome tags
- [ ] No critical doc is >60 days stale without being marked deprecated
- [ ] KARVIA_1.0_CAPABILITIES.md exists and is approved
- [ ] All journey files have implementation status annotations

### Test Success

- [ ] Test count increased from 622 to 750+
- [ ] All tests pass (100% pass rate)
- [ ] Coverage increased from 50% to 65%+
- [ ] Each API route has at least basic test coverage

### Validation Success

- [ ] 100% of user journeys validated against code
- [ ] 100% of user stories have implementation status
- [ ] STORY_IMPLEMENTATION_MATRIX.md shows clear implemented/planned split
- [ ] No "assumed implemented" features without verification

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Discovering major gaps in implementation | Medium | High | Document gaps, don't fix (zero code changes) |
| Tests reveal bugs | Medium | Medium | Log as issues, don't fix in this effort |
| Documentation overwhelm | Medium | Low | Focus on governed dirs only, skip archives |
| Time overrun | Low | Medium | Parallelize doc/test work, prioritize P0 items |

---

## Timeline

```
Day 1-2: Phase 1 (Documentation Audit)
├── Identify governed docs
├── Add genome tags
└── Create capabilities baseline

Day 2-4: Phase 2 (Journey Validation)
├── Validate 5 journey files
└── Create validation matrix

Day 3-5: Phase 3 (Story Validation)
├── Validate 105+ stories
└── Create implementation matrix

Day 4-7: Phase 4 (Test Suite Creation)
├── Create API route tests
├── Create E2E journey tests
└── Create model tests

Day 6-8: Phase 5 (Validation & Baseline)
├── Run full test suite
├── Generate reports
└── Create release documentation

Total: 8 working days (~2 weeks with buffer)
```

---

## Zero Code Impact Guarantee

This effort makes **zero changes** to:

- `server/` - No backend changes
- `client/` - No frontend changes
- `engines/` - No microservice changes
- `package.json` - No dependency changes (except test files)

**Only changes are to**:
- `KARVIA_STRATEGY/` - Documentation updates
- `tests/` - New test files
- `Karvia_OKR_Product_Planning/` - Planning documents

---

## Approval

| Stakeholder | Status | Date |
|-------------|--------|------|
| CPO | Pending | - |
| CTO | Pending | - |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [00_RESTRUCTURE_MASTER_PLAN.md](./00_RESTRUCTURE_MASTER_PLAN.md) | YSELA/KARVIA separation |
| [TEST_COVERAGE_DASHBOARD.md](../../KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/TEST_COVERAGE_DASHBOARD.md) | Current test metrics |
| [USER_STORIES_MASTER.md](../../KARVIA_STRATEGY/1-PRODUCT/user-stories/USER_STORIES_MASTER.md) | All user stories |

---

**Next Step**: Get stakeholder approval, then begin Phase 1
