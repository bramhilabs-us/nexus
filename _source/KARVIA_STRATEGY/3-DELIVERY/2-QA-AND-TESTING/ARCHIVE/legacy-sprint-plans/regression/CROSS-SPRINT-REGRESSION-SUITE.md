# Cross-Sprint Integration Regression Suite

**Purpose**: Ensure no sprint release breaks existing functionality
**Strategy**: Cumulative — each sprint runs its own tests PLUS all prior sprint tests
**Created**: January 27, 2026
**Updated**: January 27, 2026 (Post-Audit)

---

## Regression Pyramid

```
╔══════════════════════════════════════════════════════════════════╗
║                    REGRESSION EXECUTION MODEL                   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  After Sprint 11 Release:                                       ║
║  ┌────────────────────────────────────────────┐                 ║
║  │ Sprint 11 Tests (204)                      │                 ║
║  │ + Existing BST Suite (50)                  │                 ║
║  │ = 254 total tests                          │                 ║
║  └────────────────────────────────────────────┘                 ║
║                                                                  ║
║  After Sprint 12 Release:                                       ║
║  ┌────────────────────────────────────────────┐                 ║
║  │ Sprint 12 Tests (192)                      │                 ║
║  │ + Sprint 11 Regression (204)               │                 ║
║  │ + Existing BST Suite (50)                  │                 ║
║  │ = 446 total tests                          │                 ║
║  └────────────────────────────────────────────┘                 ║
║                                                                  ║
║  After Sprint 13 Release:                                       ║
║  ┌────────────────────────────────────────────┐                 ║
║  │ Sprint 13 Tests (195)                      │                 ║
║  │ + Sprint 12 Regression (192)               │                 ║
║  │ + Sprint 11 Regression (204)               │                 ║
║  │ + Existing BST Suite (50)                  │                 ║
║  │ = 641 total tests                          │                 ║
║  └────────────────────────────────────────────┘                 ║
║                                                                  ║
║  After Sprint 14 Release (FINAL):                               ║
║  ┌────────────────────────────────────────────┐                 ║
║  │ Sprint 14 Tests (134)                      │                 ║
║  │ + Sprint 13 Regression (195)               │                 ║
║  │ + Sprint 12 Regression (192)               │                 ║
║  │ + Sprint 11 Regression (204)               │                 ║
║  │ + Existing BST Suite (50)                  │                 ║
║  │ = 775 total tests                          │                 ║
║  └────────────────────────────────────────────┘                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Critical Integration Points Between Sprints

These are the highest-risk integration seams where one sprint's changes can break another's.

### Sprint 11 → Sprint 12 Integration Risks

| Risk | Sprint 11 Component | Sprint 12 Dependency | Test |
|------|---------------------|---------------------|------|
| Score ring utility | `renderScoreRing()` created in S11 | Dashboard/Planning reuse it | Verify function signature unchanged |
| s13-patterns.css | CSS variables defined in S11 | All S12 pages import it | Verify variables exist and match |
| Auth token | Q1 standardizes to `karvia_auth_token` | All S12 API calls use it | Verify token retrieval works |
| AssessmentAPI client | Extended in S11 (new methods) | S12 doesn't use it but must not break | Import still works |
| common.js utilities | `escapeHtml()`, `formatDate()`, `getInitials()` | S12 pages use all 3 | Functions unchanged |
| auth:ready pattern | Used by S11 pages | S12 pages also use it | Event fires correctly |

### Sprint 12 → Sprint 13 Integration Risks

| Risk | Sprint 12 Component | Sprint 13 Dependency | Test |
|------|---------------------|---------------------|------|
| GoalsAPIClient | Extended in S12 (task endpoints) | S13 objectives use KR progress | KR progress data accurate |
| Progress cascade | Task→Weekly→KR cascade in S12 | S13 objective auto-status reads KR progress | Auto-status computes from cascaded values |
| ObjectivesAPI | Used in S12 (planning selector) | S13 rewrites objectives page | API client backward compatible |
| CategoryIcons | Used in S12 (planning badges) | S13 objectives coverage widget | getAllCategories() returns 6 |
| DateService | Used in S12 (quarter calculation) | S13 objectives quarter selector | Quarter boundaries consistent |
| NavigationManager | Used in S12 pages | S13 adds branding swap to nav | Nav still renders on S12 pages |

### Sprint 13 → Sprint 14 Integration Risks

| Risk | Sprint 13 Component | Sprint 14 Dependency | Test |
|------|---------------------|---------------------|------|
| SSI Report page | Redesigned in S13 | S14 adds streaming/caching to SSI | Page still renders with new backend |
| SSINarrativeService | Existing service | S14 adds tone, caching, guardrails | Existing calls backward compatible |
| s13-patterns.css | Branding updated in S13 | S14 doesn't change CSS | Variables intact |
| Feature flags | `FEATURE_OPENAI_ENABLED` | S14 all epics depend on it | Flag behavior unchanged |
| Diagnostic routes | Extended in S13 (team/company) | S14 adds streaming endpoints | Existing routes unchanged |

---

## Cross-Sprint Smoke Tests (Run After Every Sprint)

These 25 critical tests must pass after EVERY sprint deployment.

| # | Test | Category | Priority |
|---|------|----------|----------|
| 1 | User can login with valid credentials | Auth | P0 |
| 2 | User cannot login with invalid credentials | Auth | P0 |
| 3 | Auth token included in all API requests | Auth | P0 |
| 4 | Unauthenticated request returns 401 | Auth | P0 |
| 5 | Company data isolated between tenants | Multi-tenancy | P0 |
| 6 | User A cannot access Company B data | Multi-tenancy | P0 |
| 7 | EMPLOYEE cannot access admin endpoints | RBAC | P0 |
| 8 | BUSINESS_OWNER has full company access | RBAC | P0 |
| 9 | CONSULTANT has full system access | RBAC | P0 |
| 10 | Navigation renders on all pages | UI | P0 |
| 11 | Navigation links route to correct pages | UI | P0 |
| 12 | Assessment Hub page loads | Page Load | P0 |
| 13 | Question Library page loads | Page Load | P0 |
| 14 | Teams page loads | Page Load | P0 |
| 15 | Dashboard page loads | Page Load | P0 |
| 16 | Planning page loads | Page Load | P0 |
| 17 | Objectives page loads | Page Load | P0 |
| 18 | SSI Report page loads | Page Load | P0 |
| 19 | Company Profile page loads | Page Load | P0 |
| 20 | Configuration page loads | Page Load | P0 |
| 21 | XSS payload in any input field is escaped | Security | P0 |
| 22 | API returns proper error format on 400/404/500 | API | P0 |
| 23 | Feature flag `FEATURE_OPENAI_ENABLED=false` doesn't crash | Degradation | P0 |
| 24 | MongoDB connection handles reconnection | Infrastructure | P0 |
| 25 | All pages use s13-patterns.css (post Sprint 11) | Design System | P0 |

---

## Automated Regression Script

### `run-regression.sh`

```bash
#!/bin/bash
# Cross-Sprint Regression Runner
# Usage: ./run-regression.sh [sprint-number]
# Example: ./run-regression.sh 12  (runs S12 + S11 + BST)

set -e

SPRINT=${1:-14}
RESULTS_DIR="QA/sprints/regression/results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$RESULTS_DIR/regression-${TIMESTAMP}-sprint${SPRINT}.txt"

mkdir -p "$RESULTS_DIR"

echo "=== CROSS-SPRINT REGRESSION: After Sprint $SPRINT ===" | tee "$REPORT_FILE"
echo "Started: $(date)" | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"

PASS=0
FAIL=0

# Phase 1: Unit Tests (all sprints up to current)
echo "--- Phase 1: Unit Tests ---" | tee -a "$REPORT_FILE"
for s in $(seq 11 $SPRINT); do
  echo "Running Sprint $s unit tests..." | tee -a "$REPORT_FILE"
  if npm test -- tests/unit/sprint-$s/ 2>&1 | tee -a "$REPORT_FILE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
  fi
done

# Phase 2: Integration Tests (all sprints up to current)
echo "--- Phase 2: Integration Tests ---" | tee -a "$REPORT_FILE"
for s in $(seq 11 $SPRINT); do
  echo "Running Sprint $s integration tests..." | tee -a "$REPORT_FILE"
  if npm test -- tests/integration/sprint-$s/ 2>&1 | tee -a "$REPORT_FILE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
  fi
done

# Phase 3: E2E Tests (all sprints up to current)
echo "--- Phase 3: E2E Tests ---" | tee -a "$REPORT_FILE"
for s in $(seq 11 $SPRINT); do
  echo "Running Sprint $s E2E tests..." | tee -a "$REPORT_FILE"
  if npx playwright test QA/sprints/sprint-$s/e2e/ 2>&1 | tee -a "$REPORT_FILE"; then
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
  fi
done

# Phase 4: Existing BST Suite
echo "--- Phase 4: BST Suite (50 tests) ---" | tee -a "$REPORT_FILE"
if npm run test:bst 2>&1 | tee -a "$REPORT_FILE"; then
  PASS=$((PASS + 1))
else
  FAIL=$((FAIL + 1))
fi

# Phase 5: Cross-Sprint Smoke Tests
echo "--- Phase 5: Cross-Sprint Smoke Tests (25 tests) ---" | tee -a "$REPORT_FILE"
if npx playwright test QA/sprints/regression/smoke.spec.ts 2>&1 | tee -a "$REPORT_FILE"; then
  PASS=$((PASS + 1))
else
  FAIL=$((FAIL + 1))
fi

# Summary
echo "" | tee -a "$REPORT_FILE"
echo "=== REGRESSION SUMMARY ===" | tee -a "$REPORT_FILE"
echo "Suites passed: $PASS" | tee -a "$REPORT_FILE"
echo "Suites failed: $FAIL" | tee -a "$REPORT_FILE"
echo "Completed: $(date)" | tee -a "$REPORT_FILE"

if [ $FAIL -gt 0 ]; then
  echo "❌ REGRESSION FAILED — DO NOT DEPLOY" | tee -a "$REPORT_FILE"
  exit 1
else
  echo "✅ REGRESSION PASSED — SAFE TO DEPLOY" | tee -a "$REPORT_FILE"
  exit 0
fi
```

---

## API Endpoint Regression Matrix

Every API endpoint tested across sprints to ensure backward compatibility.

### Assessment Endpoints (Sprint 11)

| Endpoint | Method | Added | Must Not Break |
|----------|--------|-------|----------------|
| `/api/assessments` | GET | Pre-S11 | S11, S12, S13, S14 |
| `/api/assessments?status=active` | GET | S11 | S12, S13, S14 |
| `/api/assessments/company-summary` | GET | S11 | S12, S13, S14 |
| `/api/assessments/team-results` | GET | S11 | S12, S13, S14 |
| `/api/assessment-questions/dimensions` | GET | S11 | S12, S13, S14 |
| `/api/assessment-questions/modules` | GET | S11 | S12, S13, S14 |
| `/api/assessment-questions/by-module` | GET | S11 | S12, S13, S14 |
| `/api/assessmentTemplates` | GET/POST | Pre-S11 | S11, S12, S13, S14 |
| `/api/invitations/create` | POST | Pre-S11 | S11, S12, S13, S14 |
| `/api/invitations/sent-by-me` | GET | S11 | S12, S13, S14 |

### Planning Endpoints (Sprint 12)

| Endpoint | Method | Added | Must Not Break |
|----------|--------|-------|----------------|
| `/api/tasks/*` | GET/PUT/POST/DELETE | S12 | S13, S14 |
| `/api/goals/weekly` | GET | Pre-S12 | S12, S13, S14 |
| `/api/goals/quarterly` | GET/POST | Pre-S12 | S12, S13, S14 |
| `/api/dashboard/today` | GET | S12 | S13, S14 |
| `/api/dashboard/overview` | GET | S12 | S13, S14 |
| `/api/planning/generate-weekly-plan` | POST | S12 | S13, S14 |
| `/api/planning/extend` | POST | S12 | S13, S14 |
| `/api/planning/hierarchy` | GET | S12 | S13, S14 |
| `/api/planning/planned-weeks` | GET | S12 | S13, S14 |

### Objectives & SSI Endpoints (Sprint 13)

| Endpoint | Method | Added | Must Not Break |
|----------|--------|-------|----------------|
| `/api/objectives` | GET/POST/PUT | Pre-S13 | S13, S14 |
| `/api/diagnostic/ssi/:companyId` | GET | Pre-S13 | S13, S14 |
| `/api/diagnostic/ssi/:companyId/benchmark` | GET | Pre-S13 (exists) | S13, S14 |
| `/api/diagnostic/ssi/:companyId/history` | GET | Pre-S13 (exists) | S13, S14 |
| `/api/analytics/ssi/comparison/:assessmentId` | GET | Pre-S13 (exists) | S13, S14 |
| `/api/analytics/ssi/benchmarks/team/:companyId` | GET | Pre-S13 (exists) | S13, S14 |
| `/api/analytics/ssi/export/pdf/:assessmentId` | GET | Pre-S13 (exists) | S13, S14 |
| `/api/diagnostic/ssi/:reportId/share` | POST | Pre-S13 (exists) | S13, S14 |

### LLM Endpoints (Sprint 14)

| Endpoint | Method | Added | Must Not Break |
|----------|--------|-------|----------------|
| All existing endpoints | — | — | S14 adds caching/streaming layer, must not break |

---

## Shared Module Regression Matrix

| Module | Created | Extended In | Test Strategy |
|--------|---------|-------------|---------------|
| `common.js` (`escapeHtml`, `formatDate`, `getInitials`) | Pre-S11 | — | Unit test function signatures + outputs |
| `auth-check.js` | Pre-S11 | S11 (migration shim) | Verify `auth:ready` fires, token resolution |
| `navigation.js` (NavigationManager) | Pre-S11 | S13 (branding) | Verify nav renders on all pages |
| `toast.js` | Pre-S11 | — | Verify toast still works |
| `assessment-api-client.js` | Pre-S11 | S11 (new methods) | Verify old methods unchanged |
| `team-api-client.js` | Pre-S11 | — | Verify methods work |
| `objectives-api-client.js` | Pre-S11 | — | Verify methods work |
| `goals-api-client.js` | Pre-S11 | S12 (task methods) | Verify old methods unchanged |
| `category-icons.js` | Pre-S11 | — | `getAllCategories()` returns 6 |
| `s13-patterns.css` | S11 | S13 (brand colors) | Variables exist, values match |
| `renderScoreRing()` | S11 | — | Function signature + output unchanged |
| `groupTasksByDueDate()` | S12 | — | Function signature + output unchanged |
| `SSINarrativeService` | Pre-S11 | S14 (tone, cache, guardrails) | Existing methods backward compatible |
| `AIContextService` | Pre-S11 | S14 (enhanced context) | `getContext()` still returns valid object |

---

## Cross-Sprint Journey Tests (Post-Audit Additions)

### Journey A: Golden Path Lifecycle (End-to-End OKR Flow)

```
1. Login as BUSINESS_OWNER
2. Complete SSI Assessment
3. View SSI Report → verify 3 dimensions + 12 blocks
4. Generate OKRs from SSI results
5. Navigate to Objectives → verify objectives created
6. Navigate to Planning → select objective → KR
7. Generate weekly goals (AI or manual)
8. Expand week → generate tasks
9. Navigate to Dashboard → verify tasks appear
10. Complete a task → verify cascade:
    - Weekly goal progress updates
    - KR progress updates
    - Objective progress ring updates
11. Export SSI PDF → verify download
12. Verify all pages use Chief AI branding (S13+)
```

**Purpose**: Validates the complete OKR lifecycle across all 4 sprints in a single flow.

### Journey B: Multi-Tenant Isolation Suite

```
1. Create Company A user (BUSINESS_OWNER)
2. Create Company B user (BUSINESS_OWNER)
3. Login as Company A → create objective, assessment, team
4. Login as Company B → verify ZERO Company A data visible:
   - GET /api/objectives → 0 results
   - GET /api/assessments → 0 results
   - GET /api/teams → 0 results
   - GET /api/tasks → 0 results (via /api/tasks/my/tasks)
   - GET /api/dashboard/today → empty
5. Attempt to access Company A objective by ID → 404 or 403
6. Login as CONSULTANT → verify can see both companies' data
```

**Purpose**: Ensures company_id isolation holds across all endpoints from all sprints.

### Journey C: Full Cascade Chain Test

```
1. Login as MANAGER
2. Navigate to Planning → select objective → KR → week
3. Create 4 tasks in the week
4. Complete Task 1 → verify weekly goal = 25%
5. Cancel Task 2 → verify weekly goal = 33% (1/3, cancelled excluded from denominator)
6. Complete Task 3 → verify weekly goal = 67% (2/3)
7. Complete Task 4 → verify weekly goal = 100% (3/3)
8. Verify KR progress reflects weekly goal completion
9. Verify objective auto-status updates based on KR progress
10. Undo completion of Task 4 → verify reverse cascade:
    - Weekly goal drops back to 67%
    - KR progress decreases
    - Objective status recalculates
```

**Purpose**: Validates forward and reverse cascade including cancelled task exclusion.

---

## Data Integrity Tests

Run after every sprint to verify database consistency.

| # | Test | Query | Expected |
|---|------|-------|----------|
| 1 | No orphan KRs (quarterly goals without valid objective) | `Goal.find({ time_period: 'QUARTERLY', objective_id: { $exists: false } })` | 0 results |
| 2 | No orphan weekly goals without KR parent | `Goal.find({ time_period: 'WEEKLY', parent_goal_id: { $exists: false } })` | 0 results |
| 3 | No orphan tasks without weekly goal | `Task.find({ weekly_goal_id: { $exists: false } })` | 0 results |
| 4 | All users belong to valid company | `User.find({ company_id: { $exists: false } })` | 0 results |
| 5 | No assessments without company | `Assessment.find({ company_id: { $exists: false } })` | 0 results |
| 6 | All teams belong to valid company | `Team.find({ company_id: { $exists: false } })` | 0 results |
| 7 | No cancelled items in active views | Verify soft-deleted items filtered out | 0 in active queries |
| 8 | Progress percentages in range 0-100 | `Goal.find({ progress_percentage: { $gt: 100 } })` | 0 results |
| 9 | All assessment questions have valid dimension | `AssessmentQuestion.find({ dimension: { $exists: false } })` | 0 results |
| 10 | LLM cache entries have TTL index | `db.llmcaches.getIndexes()` | TTL index exists |

---

## Performance Baselines

| Metric | Sprint 11 Baseline | Sprint 12 | Sprint 13 | Sprint 14 |
|--------|-------------------|-----------|-----------|-----------|
| Assessment Hub load | < 2s | Maintain | Maintain | Maintain |
| Question Library load | < 2s | Maintain | Maintain | Maintain |
| Teams page load | < 2s | Maintain | Maintain | Maintain |
| Dashboard load | — | < 2s | Maintain | Maintain |
| Planning page load | — | < 2s | Maintain | Maintain |
| Objectives page load | — | — | < 2s | Maintain |
| SSI Report load | — | — | < 2s | < 2s (cached < 500ms) |
| API response time (avg) | < 500ms | < 500ms | < 500ms | < 500ms |
| LLM response (uncached) | — | — | — | < 5s |
| LLM response (cached) | — | — | — | < 500ms |

---

## Deployment Checklist (Run Before Every Sprint Release)

- [ ] All unit tests pass (current sprint)
- [ ] All integration tests pass (current sprint)
- [ ] All E2E tests pass (current sprint)
- [ ] Journey tests ≥ 95% pass rate
- [ ] Edge case tests ≥ 90% pass rate
- [ ] ALL prior sprint regression tests pass (cumulative)
- [ ] Existing BST suite passes (50 tests)
- [ ] Cross-sprint smoke tests pass (25 tests)
- [ ] Data integrity tests pass (10 tests)
- [ ] Performance baselines maintained
- [ ] No security vulnerabilities (XSS, injection, RBAC)
- [ ] Multi-tenant isolation verified
- [ ] Feature flag degradation verified
- [ ] Code coverage ≥ 80% for new code

---

## Test Count Summary

| Sprint | Unit | Integration | E2E | Edge | Journeys | Regression | Total |
|--------|------|------------|-----|------|----------|------------|-------|
| Sprint 11 | 87 | 42 | 35 | 28 | 3 flows | 12 | 204 |
| Sprint 12 | 78 | 38 | 36 | 38 | 3 flows | 14 | 192 |
| Sprint 13 | 82 | 40 | 34 | 30 | 3 flows | 16 | 195 |
| Sprint 14 | 56 | 39 | 16 | 23 | 2 flows | 12 | 134 |
| Cross-Sprint | — | — | — | — | 3 journeys | 25 smoke + 10 data | 38 |
| **Total** | **303** | **159** | **121** | **119** | **14 flows** | **89** | **725 + BST 50 = 775** |

---

*Cross-Sprint Integration Regression Suite*
*Total: 775 test cases across 4 sprints (post-audit)*
*Last Updated: January 27, 2026 (Post-Audit)*
