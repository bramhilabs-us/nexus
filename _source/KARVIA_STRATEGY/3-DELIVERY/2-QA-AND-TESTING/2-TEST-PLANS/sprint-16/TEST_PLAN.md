# Sprint 16 Test Plan

**Sprint**: 16 - Foundation Fortification
**Focus**: Tech Debt Resolution + Test Coverage + Quick Wins
**Created**: March 9, 2026
**Status**: READY FOR TESTING

---

## Sprint Scope

| Epic | Points | Features |
|------|--------|----------|
| TD: Tech Debt Resolution | 21 | Rate limiting, managed businesses, Redis tracking, team membership, console.log cleanup |
| TC: Test Coverage | 32 | API routes, services, models, frontend, E2E |
| QW: Quick Wins | 10 | Package updates, security headers, Swagger UI, deployment runbook |
| **Total** | **63** | |

---

## Test Categories

### Priority Legend
- **P0**: Critical - Must pass before any deployment
- **P1**: High - Must pass before production
- **P2**: Medium - Should pass, workarounds acceptable
- **P3**: Low - Nice to have

---

## Epic TD: Tech Debt Resolution Tests

### TD-1: Rate Limiting for AI Endpoints

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| TD1-001 | AI OKR generation blocked after 5 requests/hour per company | Integration | P0 | NOT STARTED |
| TD1-002 | AI planning blocked after 10 requests/hour per user | Integration | P0 | NOT STARTED |
| TD1-003 | AI insights blocked after 3 requests/hour per user | Integration | P0 | NOT STARTED |
| TD1-004 | Rate limit headers returned in response (X-RateLimit-*) | Integration | P2 | NOT STARTED |
| TD1-005 | Rate limit resets after TTL expires | Integration | P1 | NOT STARTED |
| TD1-006 | Rate limit 429 response includes retry-after | Integration | P2 | NOT STARTED |
| TD1-007 | Different users have independent rate limits | Integration | P1 | NOT STARTED |
| TD1-008 | Different companies have independent AI generation limits | Integration | P1 | NOT STARTED |

**Endpoints Covered**:
- `/api/ai-okr/generate/:assessmentId`
- `/api/ai-okr/generate-from-team`
- `/api/ai-okr/generate-plan`
- `/api/ai-okr/generate-from-company`
- `/api/ai-okr/generate-single-objective`
- `/api/planning/generate-weekly-plan`
- `/api/planning/generate-tasks`
- `/api/objectives/ibrain/refresh/:userId`
- `/api/objectives/:objectiveId/ai-help`

**Corner Cases**:
| Test ID | Corner Case | Expected Behavior |
|---------|-------------|-------------------|
| TD1-C01 | Redis unavailable during rate check | Graceful degradation - allow request |
| TD1-C02 | Multiple simultaneous requests at limit boundary | Only first N requests succeed |
| TD1-C03 | User switches companies mid-session | New company has fresh limit |
| TD1-C04 | Server restart during rate limit window | Limits persist in Redis |

---

### TD-2: Managed Businesses Permission

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| TD2-001 | Consultant can list only managed businesses | Integration | P0 | NOT STARTED |
| TD2-002 | Consultant can view managed business details | Integration | P0 | NOT STARTED |
| TD2-003 | Consultant cannot view unmanaged business | Integration | P0 | NOT STARTED |
| TD2-004 | Consultant can update managed business | Integration | P0 | NOT STARTED |
| TD2-005 | Consultant cannot update unmanaged business | Integration | P0 | NOT STARTED |
| TD2-006 | Consultant can delete managed business | Integration | P1 | NOT STARTED |
| TD2-007 | Consultant cannot delete unmanaged business | Integration | P0 | NOT STARTED |
| TD2-008 | BUSINESS_OWNER can only access own company | Integration | P0 | NOT STARTED |
| TD2-009 | EXECUTIVE can only access own company | Integration | P0 | NOT STARTED |
| TD2-010 | Consultant can access own company profile | Integration | P0 | NOT STARTED |

**Workflow Tests**:
| Test ID | Workflow | Steps | Priority |
|---------|----------|-------|----------|
| TD2-W01 | Consultant company switching | 1. Login as consultant<br>2. Switch to client company<br>3. Verify data isolation<br>4. Switch back to own company<br>5. Verify context restored | P0 |
| TD2-W02 | Consultant profile save flow | 1. Login as consultant<br>2. Navigate to client company profile<br>3. Edit company data<br>4. Save profile<br>5. Verify changes persist | P0 |
| TD2-W03 | Managed business assignment | 1. Admin assigns business to consultant<br>2. Consultant logs in<br>3. Verify business appears in switcher<br>4. Consultant can access business data | P1 |

**Corner Cases**:
| Test ID | Corner Case | Expected Behavior |
|---------|-------------|-------------------|
| TD2-C01 | Consultant with empty managed_businesses array | Can only access own company |
| TD2-C02 | JWT token has stale managed_businesses | Use fresh DB lookup for critical operations |
| TD2-C03 | Business removed from managed list while consultant logged in | Next request returns 403 |
| TD2-C04 | Consultant viewing own company vs client company | UI shows context banner for client company |

---

### TD-3: Redis Tracking for Refreshes

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| TD3-001 | First refresh creates Redis key with TTL | Integration | P1 | NOT STARTED |
| TD3-002 | Subsequent refreshes increment counter | Integration | P1 | NOT STARTED |
| TD3-003 | Remaining refreshes calculated correctly | Integration | P1 | NOT STARTED |
| TD3-004 | Key expires after 1 hour | Integration | P2 | NOT STARTED |
| TD3-005 | Graceful degradation when Redis down | Integration | P0 | NOT STARTED |

**Corner Cases**:
| Test ID | Corner Case | Expected Behavior |
|---------|-------------|-------------------|
| TD3-C01 | Redis connection drops mid-operation | Request succeeds, fallback to in-memory |
| TD3-C02 | Multiple users refreshing simultaneously | Each user has independent counter |
| TD3-C03 | Redis key already expired during read | Treat as fresh start (0 refreshes used) |

---

### TD-4: Team Membership Check

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| TD4-001 | Manager can only see own team objectives | Integration | P1 | NOT STARTED |
| TD4-002 | Manager cannot see other team objectives | Integration | P1 | NOT STARTED |
| TD4-003 | BUSINESS_OWNER sees all company objectives | Integration | P1 | NOT STARTED |
| TD4-004 | Query includes team membership filter | Unit | P2 | NOT STARTED |

---

### TD-5: Console.log Cleanup

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| TD5-001 | No console.log in production logs (jobs/) | Manual | P2 | NOT STARTED |
| TD5-002 | Logger used consistently in assessmentTemplates.js | Manual | P3 | NOT STARTED |
| TD5-003 | Debug logs wrapped with NODE_ENV check | Manual | P3 | NOT STARTED |

---

## Epic TC: Test Coverage Tests

### TC-1: API Route Tests (80 tests)

| Test ID | Test Suite | Tests | Coverage | Priority | Status |
|---------|------------|-------|----------|----------|--------|
| TC1-001 | auth.test.js | 16 | Auth endpoints | P0 | VERIFY |
| TC1-002 | companies.test.js | 28 | Company CRUD | P0 | VERIFY |
| TC1-003 | objectives.test.js | 20 | Objective CRUD | P0 | VERIFY |
| TC1-004 | goals.test.js | 16 | Goal CRUD | P0 | VERIFY |

**Verification**:
```bash
npm run test:integration -- --grep "API Routes"
```

---

### TC-2: Service Layer Tests (151 tests)

| Test ID | Test Suite | Tests | Coverage | Priority | Status |
|---------|------------|-------|----------|----------|--------|
| TC2-001 | AIContextService.test.js | ~75 | Context building | P0 | VERIFY |
| TC2-002 | ValidationService.test.js | ~76 | Input validation | P0 | VERIFY |

---

### TC-3: Model Validation Tests (357 tests)

| Test ID | Test Suite | Tests | Coverage | Priority | Status |
|---------|------------|-------|----------|----------|--------|
| TC3-001 | Company.test.js | ~90 | Company model | P1 | VERIFY |
| TC3-002 | Objective.test.js | ~85 | Objective model | P1 | VERIFY |
| TC3-003 | Goal.test.js | ~92 | Goal model | P1 | VERIFY |
| TC3-004 | Assessment.test.js | ~90 | Assessment model | P1 | VERIFY |

---

### TC-4: Frontend Component Tests (173 tests)

| Test ID | Test Suite | Tests | Coverage | Priority | Status |
|---------|------------|-------|----------|----------|--------|
| TC4-001 | objectives-ui.test.js | ~85 | Objectives UI | P2 | VERIFY |
| TC4-002 | dashboard-widgets.test.js | ~88 | Dashboard widgets | P2 | VERIFY |

---

### TC-5: E2E Test Fixes (37 tests)

| Test ID | Test Suite | Tests | Coverage | Priority | Status |
|---------|------------|-------|----------|----------|--------|
| TC5-001 | golden-path.test.js | ~20 | Core user journey | P0 | VERIFY |
| TC5-002 | consultant-role.test.js | ~17 | Consultant flows | P0 | VERIFY |

---

## Epic QW: Quick Wins Tests

### QW-1: Package Updates

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| QW1-001 | All 22 updated packages pass build | Manual | P0 | NOT STARTED |
| QW1-002 | No security vulnerabilities (npm audit) | Manual | P0 | NOT STARTED |
| QW1-003 | App starts without dependency errors | Smoke | P0 | NOT STARTED |

---

### QW-2: Security Headers

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| QW2-001 | Helmet middleware active | Integration | P0 | NOT STARTED |
| QW2-002 | X-Content-Type-Options: nosniff present | Integration | P1 | NOT STARTED |
| QW2-003 | X-Frame-Options: DENY present | Integration | P1 | NOT STARTED |
| QW2-004 | Permissions-Policy header present | Integration | P2 | NOT STARTED |
| QW2-005 | Content-Security-Policy configured | Integration | P1 | NOT STARTED |

**Verification**:
```bash
curl -I https://karvia-business-1.onrender.com/api/health | grep -E "(X-|Content-Security|Permissions)"
```

---

### QW-3: API Documentation (Swagger UI)

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| QW3-001 | /api-docs endpoint loads | Manual | P1 | NOT STARTED |
| QW3-002 | 105 endpoints documented | Manual | P2 | NOT STARTED |
| QW3-003 | Try-it-out with valid token works | Manual | P2 | NOT STARTED |

---

### QW-4: Deployment Runbook

| Test ID | Test Case | Type | Priority | Status |
|---------|-----------|------|----------|--------|
| QW4-001 | DEPLOYMENT_RUNBOOK.md exists | Manual | P2 | NOT STARTED |
| QW4-002 | Runbook steps are accurate | Manual | P3 | NOT STARTED |

---

## Workflow Tests

### WF-001: Consultant Multi-Company Workflow

**Preconditions**: Consultant with 2+ managed businesses

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as consultant | Dashboard loads with company switcher visible |
| 2 | Click company switcher | Dropdown shows managed businesses + own company |
| 3 | Select client company A | Page refreshes with Company A context, banner shows "Viewing: Company A" |
| 4 | Navigate to Company Profile | Company A profile loads |
| 5 | Edit profile fields | Fields are editable |
| 6 | Save profile | Save succeeds, toast shows "Saved" |
| 7 | Navigate to Objectives | Company A objectives shown |
| 8 | Generate AI objective | AI uses Company A context |
| 9 | Switch to client company B | Context updates to Company B |
| 10 | Verify Company B data | Previous Company A data not visible |
| 11 | Switch back to own company | Own company data visible, no client banner |

---

### WF-002: Rate-Limited AI Generation

**Preconditions**: Company with SSI assessment complete

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open AI generation modal | Modal shows data sources available |
| 2 | Generate objective (1st time) | Succeeds, objective created |
| 3 | Generate 4 more objectives | All succeed (total 5) |
| 4 | Generate 6th objective | 429 error, "Rate limit exceeded" |
| 5 | Wait 1 hour | Rate limit resets |
| 6 | Generate objective | Succeeds |

---

### WF-003: Redis Refresh Tracking

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click iBrain refresh | Refresh succeeds, shows remaining count |
| 2 | Refresh 2 more times | Counter decrements correctly |
| 3 | Hit Redis rate limit | Shows "No refreshes remaining" |
| 4 | Wait for TTL expiry | Refreshes reset |

---

## Corner Case Matrix

| Category | Corner Case | Test ID | Expected Behavior |
|----------|-------------|---------|-------------------|
| **Rate Limiting** | Concurrent requests at boundary | TD1-C02 | Atomic increment, only N succeed |
| **Rate Limiting** | Redis down | TD1-C01 | Graceful degradation, allow request |
| **Permissions** | Stale JWT managed_businesses | TD2-C02 | DB lookup for mutations |
| **Permissions** | Business unassigned mid-session | TD2-C03 | 403 on next request |
| **Redis** | Connection drops mid-operation | TD3-C01 | Fallback to in-memory |
| **Consultant** | Empty managed_businesses | TD2-C01 | Only access own company |
| **Consultant** | Viewing own vs client company | TD2-C04 | Context banner for client |

---

## Test Commands

```bash
# Run all Sprint 16 tests
npm test

# By category
npm run test:unit
npm run test:integration
npm run test:e2e

# Specific test suites
npm test -- --grep "rate limiting"
npm test -- --grep "managed businesses"
npm test -- --grep "Redis"

# Verify test counts
npm test -- --reporter=dot | grep "passing"

# E2E tests
npm run test:golden-path
npm run test:consultant
```

---

## Bug Fixes Applied During Sprint 16

| Bug ID | Description | Fix Applied | Test Coverage |
|--------|-------------|-------------|---------------|
| ISS-S16-001 | Consultant can access unmanaged companies | Added managed_businesses check | TD2-001 to TD2-010 |
| ISS-S16-002 | AI endpoints have no rate limits | Added 3 rate limiters | TD1-001 to TD1-008 |
| ISS-S16-003 | Redis tracking not working | Implemented trackRefresh() | TD3-001 to TD3-005 |

---

## Acceptance Criteria

### Must Pass Before Deploy

- [ ] All TD-1 rate limiting tests pass (P0)
- [ ] All TD-2 permission tests pass (P0)
- [ ] Consultant company switching workflow works
- [ ] No security vulnerabilities in npm audit
- [ ] E2E golden-path tests pass

### Must Pass Before Sprint Close

- [ ] All 898 tests passing
- [ ] Swagger UI accessible at /api-docs
- [ ] Security headers verified
- [ ] Deployment runbook reviewed

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
