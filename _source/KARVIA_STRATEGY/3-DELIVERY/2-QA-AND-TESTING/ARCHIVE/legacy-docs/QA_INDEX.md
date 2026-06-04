# QA Documentation Index

**Last Updated**: February 16, 2026
**Version**: 3.0
**Status**: Active

---

## Overview

This is the master index for all QA documentation in the Karvia Business project. The QA strategy follows a layered approach ensuring comprehensive coverage from unit tests to end-to-end user journeys.

---

## Folder Structure

```
QA/
├── QA_INDEX.md                              # THIS FILE - Master index
│
├── master/                                  # Master test documentation
│   ├── MASTER_TEST_PLAN_V3.md              # Comprehensive test catalog (user-story based)
│   ├── TEST_DATA_REQUIREMENTS.md           # Test data specifications
│   └── TEST_ENVIRONMENT_SETUP.md           # Environment configuration
│
├── regression/                              # Release regression testing
│   ├── BST_REGRESSION_SUITE.md             # Business Scenario Tests (run every release)
│   ├── SMOKE_TEST_SUITE.md                 # 5-minute deployment verification
│   └── API_CONTRACT_TESTS.md               # API stability tests
│
├── boundary-cases/                          # Edge case and boundary testing
│   ├── BOUNDARY_CORNER_CASES.md            # Comprehensive boundary tests
│   ├── ERROR_HANDLING_TESTS.md             # Error scenario coverage
│   └── CONCURRENT_OPERATION_TESTS.md       # Race condition tests
│
├── user-journeys/                           # End-to-end journey tests
│   ├── CONSULTANT_JOURNEY_TESTS.md         # Full consultant flow
│   ├── EXECUTIVE_JOURNEY_TESTS.md          # Executive OKR flow
│   ├── MANAGER_JOURNEY_TESTS.md            # Manager planning flow
│   ├── EMPLOYEE_JOURNEY_TESTS.md           # Employee task flow
│   └── CROSS_PAGE_AI_CONTEXT_TESTS.md      # AI context accumulation tests
│
├── sprints/                                 # Sprint-specific test plans
│   ├── templates/                           # Test plan templates
│   ├── sprint-11/                           # Sprint 11 tests
│   ├── sprint-12/                           # Sprint 12 tests
│   ├── sprint-13/                           # Sprint 13 tests (CURRENT)
│   │   └── SPRINT-13-COMPREHENSIVE-TEST-PLAN.md
│   └── regression/                          # Cross-sprint regression
│
├── automation/                              # Automated test infrastructure
│   ├── atlas/                               # Atlas automation framework
│   └── playwright/                          # Playwright E2E tests
│
├── BST/                                     # Legacy BST folder (deprecated)
│   └── README.md                            # Points to regression/
│
└── issues/                                  # Issue tracking
    └── templates/                           # Issue templates
```

---

## Test Hierarchy

### Level 1: Smoke Tests (T1)
**Run**: Every deployment | **Duration**: 5 min | **Location**: `regression/SMOKE_TEST_SUITE.md`

Core functionality verification:
- Authentication works
- Key pages load
- Critical APIs respond

### Level 2: BST Regression (T2)
**Run**: After every sprint release | **Duration**: 30-45 min | **Location**: `regression/BST_REGRESSION_SUITE.md`

Business scenario validation:
- All user journeys complete
- No regression in existing features
- Cross-page flows work

### Level 3: Sprint Tests (T3)
**Run**: During sprint development | **Duration**: 1-2 hours | **Location**: `sprints/sprint-XX/`

Sprint-specific feature validation:
- New features work as specified
- Integration with existing features
- Edge cases for new code

### Level 4: Full Regression (T4)
**Run**: Major releases | **Duration**: 4+ hours | **Location**: All folders

Comprehensive coverage:
- All boundary cases
- All error scenarios
- Performance under load
- Security verification

---

## Quick Links

### For Developers
| Task | Document |
|------|----------|
| What to test for my PR | `sprints/sprint-XX/test-plan.md` |
| API contracts | `regression/API_CONTRACT_TESTS.md` |
| Test data needed | `master/TEST_DATA_REQUIREMENTS.md` |

### For QA Engineers
| Task | Document |
|------|----------|
| Release verification | `regression/BST_REGRESSION_SUITE.md` |
| Edge case reference | `boundary-cases/BOUNDARY_CORNER_CASES.md` |
| Sprint 13 testing | `sprints/sprint-13/SPRINT-13-COMPREHENSIVE-TEST-PLAN.md` |

### For Product Managers
| Task | Document |
|------|----------|
| Test coverage report | `master/MASTER_TEST_PLAN_V3.md` |
| User journey validation | `user-journeys/` |
| Sprint sign-off | `sprints/sprint-XX/test-report.md` |

---

## Test Commands

```bash
# Smoke Tests (T1)
npm run test:smoke

# Unit + Integration (T2)
npm run test:unit
npm run test:integration

# E2E Tests (T3)
npm run test:e2e
npm run test:playwright

# Full Regression (T4)
npm test -- --coverage
npm run test:playwright -- --project=all

# Specific Sprint
npm run test:sprint13
```

---

## Test Execution Checklist

### Pre-Release Checklist
- [ ] All T1 smoke tests pass
- [ ] BST regression suite pass
- [ ] Sprint-specific tests pass
- [ ] No P0/P1 bugs open
- [ ] Test report generated
- [ ] Sign-off obtained

### Post-Release Verification
- [ ] Production smoke test
- [ ] Key user journeys verified
- [ ] No error spikes in logs
- [ ] Performance metrics stable

---

## Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| User Stories | `KARVIA_STRATEGY/1-PRODUCT/user-stories/` | Test case source |
| User Journeys | `KARVIA_STRATEGY/1-PRODUCT/user-journeys/` | E2E test flows |
| Sprint Plans | `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/` | Feature specs |
| AI Context Stories | `user-stories/AI_CONTEXT_STORIES.md` | AI test requirements |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2025 | Initial structure |
| 2.0 | Dec 2025 | Added Sprint 6-9 tests |
| 3.0 | Feb 16, 2026 | Reorganized structure, added user-journey tests, Sprint 13 |

---

**Maintained By**: QA Team
**Review Cycle**: Each sprint retrospective
