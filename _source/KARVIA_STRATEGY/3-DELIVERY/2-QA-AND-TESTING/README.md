# Karvia Business - QA & Testing Hub

**Last Updated**: March 6, 2026
**Status**: Active
**Sprint**: 15-A

---

## Quick Start

| Task | Go To |
|------|-------|
| **Run Tests** | See [Test Commands](#test-commands) below |
| **Current Sprint Tests** | `2-TEST-PLANS/sprint-15a/TEST_PLAN.md` |
| **Report a Bug** | `6-ISSUES/templates/BUG_REPORT_TEMPLATE.md` |
| **View Coverage** | `TEST_COVERAGE_DASHBOARD.md` |
| **Audit Findings** | `QA/AUDIT_TRACKER.md` |

---

## Test Commands

```bash
# All tests
npm test

# By type
npm run test:unit           # Unit tests (fast, ~30s)
npm run test:integration    # Integration tests (~2min)
npm run test:e2e           # End-to-end tests (~10min)

# Critical paths (address audit findings)
npm run test:golden-path    # Full lifecycle test (AH-9)
npm run test:consultant     # CONSULTANT role tests (AH-10)
npm run test:multi-tenant   # Tenant isolation tests (AH-11)
npm run test:security       # All security tests

# Coverage
npm run test:coverage       # With coverage report

# Playwright (browser tests)
npm run test:playwright     # All Playwright tests
npm run test:bst           # Business Scenario Tests
npm run test:journeys      # User journey tests
```

---

## Folder Structure

```
2-QA-AND-TESTING/
│
├── QA_README.md                    # You are here
├── TESTING_STANDARDS.md            # Quality gates, metrics
├── TEST_COVERAGE_DASHBOARD.md      # Live metrics
├── TESTING_INFRASTRUCTURE_PLAN.md  # Redesign plan (Sprint 15-A)
│
├── 1-STRATEGY/                     # Strategy docs
│   ├── MASTER_TEST_STRATEGY.md     # Single consolidated strategy
│   └── QUALITY_GATES.md            # Pre-commit, pre-merge rules
│
├── 2-TEST-PLANS/                   # Active sprint plans
│   ├── sprint-15a/
│   │   └── TEST_PLAN.md
│   └── templates/
│
├── 3-TEST-SUITES/                  # Test specifications
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   │   ├── USER_JOURNEYS.md
│   │   ├── CONSULTANT_JOURNEYS.md
│   │   └── GOLDEN_PATH.md
│   └── security/
│       └── MULTI_TENANT_TESTS.md
│
├── 4-AUTOMATION/                   # Automation tooling
│   ├── playwright/
│   └── ci/
│
├── 5-REPORTS/                      # Test results
│   └── archive/
│
├── 6-ISSUES/                       # Bug tracking
│   └── templates/
│
├── QA/                             # Legacy (being migrated)
│   └── AUDIT_TRACKER.md            # Active audit tracking
│
└── ARCHIVE/                        # Historical docs
```

---

## Audit Issues - RESOLVED (Sprint 15-A) ✓

| ID | Issue | Status | Test File |
|----|-------|--------|-----------|
| **AH-9** | Golden Path Lifecycle Test | **RESOLVED** ✓ | `tests/e2e/golden-path.test.js` |
| **AH-10** | CONSULTANT Role Tests | **RESOLVED** ✓ | `tests/e2e/consultant-role.test.js` |
| **AH-11** | Multi-Tenant Isolation | **RESOLVED** ✓ | `tests/security/multi-tenant-isolation.test.js` |

**Full Audit Tracker**: `AUDIT_TRACKER.md`

---

## Test Coverage Summary (Sprint 15-A)

| Layer | Files | Tests | Pass Rate |
|-------|-------|-------|-----------|
| Unit Tests | 19 | ~450 | 95% |
| Integration | 5 | 88 | 100% |
| E2E Journeys | 3 | 29 | Partial* |
| Security | 1 | 26 | **100%** ✓ |

*E2E tests require engine services (Sprint 16 TC-5)

**Detailed Metrics**: `TEST_COVERAGE_DASHBOARD.md`

---

## Quality Gates

### Pre-Commit
- Linting passes
- Unit tests pass for changed files

### Pre-Merge (PR)
- All unit tests pass
- Coverage ≥75%
- No critical bugs open

### Pre-Deploy
- BST checklist complete
- Smoke tests pass
- Security tests pass (pre-prod/prod)

### Pre-Release
- Full regression complete
- Golden path test passes
- CONSULTANT suite passes
- Multi-tenant isolation passes

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project overview, dev standards |
| `tests/` | Actual test files |
| `.github/workflows/` | CI/CD configuration |

---

## Migration Status (Sprint 15-A) ✓

| Legacy Files | Action | Status |
|--------------|--------|--------|
| Sprint 1-14 plans | Archived | **COMPLETE** ✓ |
| Old audit reports | Archived | **COMPLETE** ✓ |
| Legacy docs | Archived | **COMPLETE** ✓ |
| QA folder | Removed | **COMPLETE** ✓ |

**Archive Location**: `ARCHIVE/`
- `legacy-sprint-plans/` - Sprint 1-14 plans
- `legacy-audit-reports/` - Historical audit reports
- `legacy-docs/` - Outdated documentation

**Migration Plan**: `TESTING_INFRASTRUCTURE_PLAN.md`

---

**Document Version**: 2.0 (Sprint 15-A Update)
**Owner**: QA Team
**Last Updated**: March 8, 2026
