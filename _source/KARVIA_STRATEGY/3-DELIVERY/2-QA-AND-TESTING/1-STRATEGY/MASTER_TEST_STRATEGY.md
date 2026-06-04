# Karvia Business - Master Test Strategy

**Version**: 2.0
**Last Updated**: December 1, 2025
**Owner**: QA Lead
**Status**: Active

---

## Executive Summary

This document defines the comprehensive testing strategy for Karvia Business OKR Platform. It serves as the **single source of truth** for all testing approaches, methodologies, and standards across the product lifecycle.

---

## 1. Testing Philosophy

### Core Principles
1. **Shift Left**: Catch defects early through unit tests and code reviews
2. **Risk-Based Testing**: Prioritize critical business flows
3. **Automation First**: Automate repeatable tests, manual for exploratory
4. **Continuous Quality**: Integrate testing into every sprint cycle
5. **Evidence-Based**: Every test result must be documented and traceable

### Quality Gates
| Gate | Criteria | Blocking? |
|------|----------|-----------|
| Pre-Commit | Linting passes, unit tests pass | Yes |
| Pre-Merge | All tests pass, coverage ≥75% | Yes |
| Pre-Deploy | BST checklist complete, smoke tests pass | Yes |
| Pre-Release | Full regression, performance baseline | Yes |

---

## 2. Test Pyramid

```
                    ┌─────────┐
                    │   E2E   │  5% - Critical Journeys
                    │ (Manual │  Playwright, Manual
                    │  + Auto)│
                ┌───┴─────────┴───┐
                │   Integration   │  15% - API & DB
                │    (Jest +      │  Supertest, MongoDB
                │    Supertest)   │
            ┌───┴─────────────────┴───┐
            │         Unit            │  80% - Logic & Validators
            │    (Jest + Memory DB)   │  Services, Models, Utils
            └─────────────────────────┘
```

### Layer Responsibilities

| Layer | Scope | Tools | Speed Target | Coverage Target |
|-------|-------|-------|--------------|-----------------|
| **Unit** | Pure functions, validators, services | Jest, Mongo Memory Server | < 30s | 80% |
| **Integration** | API routes, DB operations, middleware | Jest, Supertest | < 2min | 15% |
| **E2E** | User journeys, UI flows | Playwright, Manual | < 10min | 5% critical paths |

---

## 3. Test Categories

### 3.1 Smoke Tests
**Purpose**: Quick validation that core functionality works
**When**: After every deployment, before deeper testing
**Duration**: < 5 minutes
**Scope**:
- Server starts without errors
- All API endpoints respond (2xx or expected 4xx)
- Authentication works
- Database connectivity

### 3.2 Functional Tests
**Purpose**: Verify features work as specified
**When**: Every sprint, per-feature basis
**Types**:
- **Unit Tests**: Individual function/method testing
- **Integration Tests**: API endpoint testing
- **Component Tests**: UI component testing

### 3.3 User Journey Tests
**Purpose**: End-to-end business flow validation
**When**: Before release, after major changes
**Critical Journeys**:
1. Authentication → Dashboard → Profile
2. Assessment Creation → Team Assignment → Completion
3. SSI Results → Diagnostic Report → OKR Generation
4. Objective Management → Key Results → Goal Tracking
5. Consultant → Multi-Company → Reporting

### 3.4 Regression Tests
**Purpose**: Ensure existing functionality isn't broken
**When**: Before every release
**Scope**: All previously working features

### 3.5 Edge Case Tests
**Purpose**: Validate boundary conditions and error handling
**Categories**:
- Empty/null inputs
- Maximum limits
- Concurrent operations
- Network failures
- Session expiry
- Role-based access violations

### 3.6 Performance Tests
**Purpose**: Validate system responsiveness under load
**Metrics**:
- API response time < 200ms (p95)
- Page load time < 3s
- Concurrent user capacity ≥ 100

---

## 4. Test Environments

| Environment | Purpose | Data | URL |
|-------------|---------|------|-----|
| Local | Development testing | Seeded test data | localhost:5000 |
| Test | Integration testing | Sanitized prod copy | test.karvia.io |
| Staging | Pre-production validation | Production mirror | staging.karvia.io |
| Production | Live monitoring only | Real data | app.karvia.io |

---

## 5. Testing Workflow by Sprint Phase

### Phase 1: Sprint Planning
- [ ] Review user stories for testability
- [ ] Identify high-risk areas
- [ ] Create sprint test plan from template
- [ ] Assign test ownership

### Phase 2: Development
- [ ] Developers write unit tests (TDD preferred)
- [ ] Code review includes test review
- [ ] Integration tests for new APIs
- [ ] Update regression suite

### Phase 3: Feature Complete
- [ ] Execute sprint test plan
- [ ] Run automated regression
- [ ] Exploratory testing session
- [ ] Log all defects

### Phase 4: Pre-Release
- [ ] Complete BST checklist
- [ ] Performance baseline check
- [ ] Security scan
- [ ] Sign-off approval

---

## 6. Defect Management

### Severity Levels
| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| **P0 - Critical** | System down, data loss | Immediate | Auth broken, data corruption |
| **P1 - High** | Major feature broken | Same day | OKR generation fails, assessment broken |
| **P2 - Medium** | Feature impaired | Next sprint | UI glitch, minor calculation error |
| **P3 - Low** | Cosmetic, minor | Backlog | Typo, alignment issue |

### Defect Workflow
1. Log in issue tracker with steps to reproduce
2. Assign severity and priority
3. Developer investigates and fixes
4. QA verifies fix
5. Close with evidence

---

## 7. Automation Strategy

### What to Automate
- All smoke tests
- Critical user journeys (top 5)
- Regression test suite
- API contract tests
- Data validation checks

### What NOT to Automate
- Exploratory testing
- Usability testing
- Visual regression (unless ROI positive)
- One-time tests

### Automation Tools
| Tool | Purpose | Location |
|------|---------|----------|
| Jest | Unit & Integration | `tests/` |
| Supertest | API testing | `tests/integration/` |
| Playwright | E2E browser tests | `QA/PLAYWRIGHT/` |
| Atlas Suite | MongoDB validation | `QA/automation/atlas/` |

---

## 8. Reporting & Metrics

### Key Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | ≥80% | Jest coverage report |
| Critical Path Coverage | ≥95% | Manual tracking |
| Defect Escape Rate | <5% | Prod bugs / Total bugs |
| Test Automation Rate | ≥70% | Automated / Total tests |
| Mean Time to Detect | <1 day | From introduction to detection |

### Reporting Cadence
- **Daily**: Automated test results in CI
- **Sprint**: Test summary in sprint retro
- **Release**: Full test report with BST sign-off
- **Quarterly**: QA health assessment

---

## 9. Roles & Responsibilities

| Role | Testing Responsibilities |
|------|--------------------------|
| **Developer** | Unit tests, integration tests, code review |
| **QA Engineer** | Test planning, E2E tests, BST, defect tracking |
| **Tech Lead** | Coverage standards, automation strategy |
| **Product Owner** | UAT sign-off, acceptance criteria |
| **Release Manager** | Final release approval, evidence collection |

---

## 10. Related Documents

| Document | Purpose | Location |
|----------|---------|----------|
| Master Test Plan | Execution details | `MASTER_TEST_PLAN.md` |
| Sprint Test Template | Per-sprint planning | `QA/sprints/templates/` |
| BST Checklist | Pre-release validation | `QA/BST/bst-checklist.md` |
| Issue Log Template | Defect tracking | `QA/issues/templates/` |
| Playwright Guide | E2E automation | `QA/PLAYWRIGHT/` |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 2025 | QA Team | Initial strategy |
| 2.0 | Dec 1, 2025 | Claude | Consolidated as single source of truth |

---

*This document is the authoritative source for testing strategy. All sprint-specific testing derives from these standards.*
