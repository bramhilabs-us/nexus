# Sprint 16 Master Plan: Tech Debt & Test Coverage

**Sprint**: 16 - Foundation Fortification
**Created**: March 4, 2026
**Total Points**: 55 pts
**Duration**: 2 weeks
**Status**: PLANNED
**Focus**: Tech Debt Resolution, Test Coverage, Quality Improvements
**Prerequisite**: Sprint 15 complete (bug fixes done)

---

## Sprint 16 Goal (Single Statement)

> **Fortify the codebase foundation by resolving all critical tech debt, achieving 60%+ test coverage, and implementing quick wins from project insights analysis.**

---

## Sprint Philosophy

| Principle | Application |
|-----------|-------------|
| **Zero New Features** | Focus purely on quality and stability |
| **Measurable Outcomes** | Test coverage from ~10% → 60% |
| **Security First** | Priority on security-related debt |
| **Sustainable Velocity** | Clean codebase enables faster future sprints |

---

## Problem Statement

### Current State (from `/insights` analysis)

| Issue | Current | Target |
|-------|---------|--------|
| TODO/FIXME items | 19 | 0 |
| Test files | 35 | 100+ |
| Test coverage | ~10% | 60% |
| Console.log in routes | 69 | 0 |
| Outdated packages | 35 | <5 |
| Rate limiting | Not implemented | Implemented |

### Business Impact

- **Security Gap**: No rate limiting on AI endpoints (DoS vulnerability)
- **Authorization Gap**: `managed_businesses` not enforced for CONSULTANT role
- **Maintainability**: Accumulating TODOs create hidden bugs
- **CI/CD Confidence**: Low test coverage means risky deployments

---

## Epic Overview

| Epic | Points | Description | Priority |
|------|--------|-------------|----------|
| **TD** | 21 | Tech Debt Resolution | P0 |
| **TC** | 24 | Test Coverage Expansion | P1 |
| **QW** | 10 | Quick Wins from Insights | P2 |
| **Total** | **55** | | |

---

## Epic TD: Tech Debt Resolution (21 pts)

### TD-1: Rate Limiting Implementation (5 pts) - P0

**Current Issue**: `server/routes/objectives.js:830` - No rate limiting on AI endpoints

**Implementation**:
```javascript
// Add express-rate-limit for AI endpoints
const rateLimit = require('express-rate-limit');

const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: { error: 'Too many AI requests, please try again later' },
  keyGenerator: (req) => `${req.user.company_id}:${req.user._id}`
});

// Apply to AI endpoints
router.post('/api/ai-okr/generate', aiRateLimiter, ...);
router.post('/api/planning/generate-weekly-plan', aiRateLimiter, ...);
```

**Files to Modify**:
- `server/routes/objectives.js` - Add rate limiter
- `server/routes/ai-okr.js` - Add rate limiter
- `server/routes/planning.js` - Add rate limiter
- `package.json` - Add express-rate-limit

**Acceptance Criteria**:
- [ ] Rate limiting configured for all AI endpoints
- [ ] 3 requests per hour per user/company
- [ ] Graceful error message when limit exceeded
- [ ] Remaining requests returned in response headers

---

### TD-2: Managed Businesses Permission (8 pts) - P0

**Current Issue**: `server/routes/companies.js:21-867` - CONSULTANT can access ALL companies

**Reference**: `FEATURE-ROLE-PERMISSIONS.md`

**Implementation**:
```javascript
// Add managed_businesses array to User model
managed_businesses: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company'
}]

// Update companies routes to filter
const filterByManagedBusinesses = async (req, res, next) => {
  if (req.user.role === 'CONSULTANT') {
    req.managedCompanyIds = req.user.managed_businesses || [];
    // If empty, allow all (backwards compatibility for existing consultants)
  }
  next();
};
```

**Files to Modify**:
- `server/models/User.js` - Add managed_businesses field
- `server/routes/companies.js` - Implement filtering (4 locations)
- `server/middleware/auth.js` - Add helper for managed check
- `server/routes/users.js` - Add endpoint to manage consultant assignments

**Acceptance Criteria**:
- [ ] User model has managed_businesses array
- [ ] GET /companies filters by managed_businesses for CONSULTANT
- [ ] POST /companies/:id routes check managed_businesses
- [ ] Admin UI to assign consultants to businesses
- [ ] Backwards compatible: empty array = all access

---

### TD-3: Redis Tracking for AI Refreshes (3 pts) - P1

**Current Issue**: `server/routes/objectives.js:841` - Refresh limits not enforced

**Implementation**:
```javascript
// Use Redis or in-memory fallback
const refreshKey = `ai_refresh:${companyId}:${userId}`;
const refreshCount = await redis.incr(refreshKey);
if (refreshCount === 1) {
  await redis.expire(refreshKey, 3600); // 1 hour TTL
}

if (refreshCount > 3) {
  return res.status(429).json({
    error: 'Refresh limit exceeded',
    remainingRefreshes: 0,
    resetIn: await redis.ttl(refreshKey)
  });
}
```

**Files to Modify**:
- `server/services/redis-client.js` - Create Redis wrapper with fallback
- `server/routes/objectives.js` - Implement tracking
- `server/routes/ai-okr.js` - Apply same pattern

**Acceptance Criteria**:
- [ ] Redis tracking implemented (or in-memory fallback)
- [ ] 3 refreshes per hour limit enforced
- [ ] Reset time returned to frontend
- [ ] Graceful degradation if Redis unavailable

---

### TD-4: Team Membership Check (2 pts) - P1

**Current Issue**: `server/services/objectiveService.js:96`

**Implementation**:
```javascript
// Add team membership validation
const validateTeamMembership = async (userId, teamId) => {
  const team = await Team.findById(teamId);
  if (!team) throw new AppError('Team not found', 404);

  const isMember = team.members.some(m =>
    m.user_id.toString() === userId.toString()
  );

  if (!isMember) {
    throw new AppError('User is not a member of this team', 403);
  }
  return true;
};
```

**Files to Modify**:
- `server/services/objectiveService.js` - Add validation
- `server/services/teamService.js` - Add helper method

**Acceptance Criteria**:
- [ ] Team membership validated before objective assignment
- [ ] Clear error message when user not in team
- [ ] Admin/Manager bypass for assignment

---

### TD-5: Console.log Cleanup (3 pts) - P2

**Current Issue**: 69 console.log statements in production routes

**Implementation**:
```bash
# Replace console.log with proper logger
grep -rn "console.log" server/routes/*.js | wc -l  # 69 occurrences
```

**Pattern**:
```javascript
// Before
console.log('Creating objective:', data);

// After
logger.debug('Creating objective', { data, userId: req.user._id });
```

**Files to Modify**:
- `server/routes/*.js` - Replace all console.log (21 files)
- `server/utils/logger.js` - Ensure Winston logger configured

**Acceptance Criteria**:
- [ ] Zero console.log in server/routes/
- [ ] All logs use Winston logger
- [ ] Log levels appropriate (debug, info, warn, error)
- [ ] Sensitive data not logged

---

## Epic TC: Test Coverage Expansion (24 pts)

### TC-1: API Route Tests (8 pts)

**Current Coverage**: 0% for most routes

**Target**: 80% coverage for critical routes

| Route File | Tests to Add | Priority |
|------------|--------------|----------|
| `companies.js` | 15 tests | P0 |
| `objectives.js` | 12 tests | P0 |
| `goals.js` | 10 tests | P1 |
| `assessments.js` | 10 tests | P1 |
| `users.js` | 8 tests | P1 |
| `teams.js` | 8 tests | P2 |
| `invitations.js` | 8 tests | P2 |

**Test Structure**:
```
tests/
├── integration/
│   ├── routes/
│   │   ├── companies.test.js
│   │   ├── objectives.test.js
│   │   ├── goals.test.js
│   │   ├── assessments.test.js
│   │   ├── users.test.js
│   │   ├── teams.test.js
│   │   └── invitations.test.js
```

**Acceptance Criteria**:
- [ ] 70+ route tests added
- [ ] All CRUD operations tested
- [ ] Auth/RBAC tested for each route
- [ ] Multi-tenant isolation tested

---

### TC-2: Service Layer Tests (6 pts)

**Target Services**:
| Service | Tests | Priority |
|---------|-------|----------|
| `AIContextService.js` | 15 tests | P0 |
| `DateService.js` | 10 tests | P0 |
| `ValidationService.js` | 10 tests | P1 |
| `objectiveService.js` | 8 tests | P1 |
| `analyticsService.js` | 8 tests | P2 |

**Acceptance Criteria**:
- [ ] 50+ service tests added
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Mock external dependencies

---

### TC-3: Model Validation Tests (4 pts)

**Target Models**:
| Model | Tests | Priority |
|-------|-------|----------|
| `Company.js` | 10 tests | P0 |
| `Objective.js` | 10 tests | P0 |
| `Goal.js` | 8 tests | P1 |
| `User.js` | 8 tests | P1 |
| `Assessment.js` | 8 tests | P2 |

**Acceptance Criteria**:
- [ ] 44+ model tests added
- [ ] Required fields validated
- [ ] Enum values tested
- [ ] Relationships tested

---

### TC-4: Frontend Component Tests (6 pts)

**Target Components**:
| Component | Tests | Priority |
|-----------|-------|----------|
| `assessment-flow.js` | 10 tests | P0 |
| `objectives.js` | 10 tests | P0 |
| `planning-v2.js` | 8 tests | P1 |
| `dashboard-v2.js` | 8 tests | P1 |
| `team-ssi-view.js` | 6 tests | P2 |

**Acceptance Criteria**:
- [ ] 42+ frontend tests added
- [ ] User interactions tested
- [ ] API error handling tested
- [ ] Loading states tested

---

## Epic QW: Quick Wins from Insights (10 pts)

### QW-1: Update Outdated Packages (3 pts)

**Current Issue**: 35 outdated npm packages

**Process**:
```bash
# Step 1: Audit
npm outdated

# Step 2: Update non-breaking
npm update

# Step 3: Major updates (careful)
npm install package@latest

# Step 4: Test
npm test && npm run build
```

**Acceptance Criteria**:
- [ ] All patch/minor updates applied
- [ ] Major updates reviewed individually
- [ ] No breaking changes
- [ ] All tests pass after update

---

### QW-2: Security Headers (2 pts)

**Implementation**:
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // For inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));
```

**Files to Modify**:
- `server/index.js` - Add helmet middleware
- `package.json` - Add helmet dependency

**Acceptance Criteria**:
- [ ] Helmet middleware configured
- [ ] CSP headers set
- [ ] HSTS enabled
- [ ] X-Frame-Options: DENY

---

### QW-3: API Documentation (3 pts)

**Implementation**: Create OpenAPI/Swagger spec

**Structure**:
```
docs/
├── api/
│   ├── openapi.yaml          # Main spec file
│   ├── paths/
│   │   ├── companies.yaml
│   │   ├── objectives.yaml
│   │   └── ...
│   └── schemas/
│       ├── Company.yaml
│       ├── Objective.yaml
│       └── ...
```

**Acceptance Criteria**:
- [ ] OpenAPI 3.0 spec created
- [ ] All routes documented
- [ ] Request/response schemas defined
- [ ] Swagger UI accessible at /api-docs

---

### QW-4: Deployment Runbook (2 pts)

**Create**: `docs/DEPLOYMENT_RUNBOOK.md`

**Contents**:
- Pre-deployment checklist
- Deployment steps for each environment
- Rollback procedures
- Health check endpoints
- Monitoring setup
- Incident response

**Acceptance Criteria**:
- [ ] Runbook created with all sections
- [ ] Environment-specific instructions
- [ ] Rollback tested and documented

---

## Execution Schedule

### Week 1: Tech Debt Focus

| Day | Epic | Stories | Points |
|-----|------|---------|--------|
| Day 1 | TD | TD-1 Rate Limiting | 5 |
| Day 2-3 | TD | TD-2 Managed Businesses | 8 |
| Day 4 | TD | TD-3 Redis Tracking, TD-4 Team Check | 5 |
| Day 5 | TD | TD-5 Console.log Cleanup | 3 |

**Week 1 Total**: 21 pts (Epic TD complete)

### Week 2: Test Coverage + Quick Wins

| Day | Epic | Stories | Points |
|-----|------|---------|--------|
| Day 6 | TC | TC-1 API Route Tests (Part 1) | 4 |
| Day 7 | TC | TC-1 API Route Tests (Part 2) | 4 |
| Day 8 | TC | TC-2 Service Tests, TC-3 Model Tests | 10 |
| Day 9 | TC | TC-4 Frontend Tests | 6 |
| Day 10 | QW | QW-1 to QW-4 | 10 |

**Week 2 Total**: 34 pts (Epics TC + QW complete)

---

## Success Criteria

### Sprint 16 is complete when:

- [ ] All 19 TODO/FIXME items resolved
- [ ] Rate limiting implemented on all AI endpoints
- [ ] managed_businesses permission enforced
- [ ] Test coverage ≥ 60%
- [ ] Zero console.log in production routes
- [ ] < 5 outdated npm packages
- [ ] Security headers implemented
- [ ] API documentation created
- [ ] Deployment runbook written
- [ ] All tests passing (npm test)

### Metrics to Track

| Metric | Before | After Target |
|--------|--------|--------------|
| TODO items | 19 | 0 |
| Test files | 35 | 100+ |
| Test coverage | ~10% | ≥60% |
| Console.logs | 69 | 0 |
| Outdated packages | 35 | <5 |
| Security headers | 0 | 6+ |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking changes from package updates | Medium | High | Test thoroughly, update incrementally |
| Rate limiting too restrictive | Low | Medium | Make limits configurable |
| Test writing takes longer | Medium | Medium | Prioritize critical paths first |
| Managed businesses breaks existing flow | Medium | High | Backwards compatible (empty = all access) |

---

## Dependencies

| Dependency | Required For | Status |
|------------|--------------|--------|
| Sprint 15 complete | Start Sprint 16 | Pending |
| Redis access (optional) | TD-3 | Available (with fallback) |
| Jest/Playwright setup | TC-* | Already configured |

---

## Related Documents

- [PROJECT_INSIGHTS.md](../../4-AUDIT/1-INTERNAL/PROJECT_INSIGHTS.md) - Source of improvements
- [FEATURE-ROLE-PERMISSIONS.md](../SPRINT-9%20(Complete)/FEATURE-ROLE-PERMISSIONS.md) - Managed businesses spec
- [CLAUDE.md](../../../../CLAUDE.md) - Project standards

---

**Document Version**: 1.0
**Created**: March 4, 2026
**Author**: Claude Code `/insights` analysis
