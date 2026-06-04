# Week 2: Production Hardening Plan

**Date Created**: October 15, 2025
**Status**: Ready to Start
**Duration**: 5 days (Oct 16-20, 2025)
**Total Tasks**: 20 tasks (16 production hardening + 4 deferred from Week 1)

---

## Executive Summary

### Strategic Decision: Production First, Features Second

After completing Week 1 with all assessment features functional, we've identified critical production readiness gaps that MUST be addressed before adding new features:

1. **Security Issues**: API keys exposed in .env, weak secrets, no proper secrets management
2. **Logging**: No structured logging, impossible to debug in production
3. **Error Handling**: Inconsistent error responses, no global error handling
4. **Validation**: Minimal input validation, vulnerable to injection attacks
5. **Testing**: Incomplete test coverage, no integration tests for critical flows
6. **Monitoring**: No health checks, can't monitor system status
7. **Configuration**: Hardcoded values throughout codebase
8. **Documentation**: No API docs, incomplete deployment guides

### Why This Matters

- **Risk**: Deploying current code to production would expose critical security vulnerabilities
- **Technical Debt**: Shortcuts taken in Week 1 will compound and become harder to fix
- **Customer Trust**: Production incidents damage customer confidence
- **Maintainability**: Hardcoded values make system impossible to configure for different environments

### Decision Impact

- **Week 2**: Production hardening (originally planned as Analytics)
- **Week 3**: Analytics & Insights (original Week 2 plan)
- **Timeline**: No impact on Nov 30 deadline - still 7 weeks remaining
- **Quality**: Production-grade system from Week 2 onwards

---

## Week 2 Overview

### Focus Areas

1. **Security & Secrets** (Day 1)
   - Remove exposed secrets from git
   - Generate strong secrets
   - Implement secrets management

2. **Logging & Error Handling** (Day 1)
   - Production logger (Winston)
   - Comprehensive error handling
   - Custom error classes

3. **Validation & Database** (Day 2)
   - Input validation (Joi)
   - Database connection hardening
   - Performance indexes

4. **Testing** (Day 3)
   - Integration test suite
   - Unit test coverage > 80%
   - CI/CD integration

5. **Monitoring & Config** (Day 4)
   - Health check endpoints
   - Rate limiting verification
   - Environment-specific configs
   - Real Mailjet configuration

6. **Code Quality & Documentation** (Day 5)
   - Remove all hardcoding
   - API documentation (Swagger)
   - Deployment guides
   - Week 1 deferred features

---

## Review Notes (Reality Check Before Kickoff)
- **Fix Week 1 auth debt first.** The new `authenticateToken` middleware still calls a non-existent IAM endpoint and the “local” verifier rejects valid tokens (`server/middleware/authGuards.js:36`, `server/middleware/authGuards.js:108`, `engines/iam/index.js:108`). Hardening on top of a broken auth stack will compound failures.
- **Secrets cleanup will take longer than scheduled.** Removing credentials from git history and rotating keys across OpenAI, Mongo, Mailjet, etc., is far more than a 2-hour chore (`WEEK_2_PRODUCTION_HARDENING_PLAN.md:83`). Budget extra time and involve ops early.
- **Testing targets need infrastructure.** The plan promises 100 % critical flow coverage and 80 % overall in a single day, but we still lack integration scaffolding, stable fixtures, and CI wiring (`WEEK_2_PRODUCTION_HARDENING_PLAN.md:118`). Break this into multiple stories with explicit tooling tasks.
- **“Zero hardcoded values” requires a configuration strategy.** Before stripping literals, define the supported configuration surfaces (feature flags, env defaults, secrets hierarchy) or the work will stall (`WEEK_2_PRODUCTION_HARDENING_PLAN.md:153`).
- **Deferred UI work remains blocked by backend gaps.** Template editing/preview depends on fixing Week 1 validation issues (duplicate questions, invitation role mapping). Flag those dependencies so Day 5 doesn’t start with hidden blockers (`server/models/AssessmentTemplate.js:174`, `server/models/Invitation.js:39`, `WEEK_2_PRODUCTION_HARDENING_PLAN.md:162`).

---

## Daily Breakdown

### Day 1: Security & Logging (8 hours)

**Morning (4 hours)**:
- DEV-W2-001: Security audit and secrets management (2h)
- DEV-W2-002: Winston logger implementation (2h)

**Afternoon (4 hours)**:
- DEV-W2-003: Error handling middleware and custom error classes (3h)
- Code review and testing (1h)

**Deliverables**:
- No secrets in git history
- Production logger operational
- Consistent error handling
- All secrets > 32 characters

---

### Day 2: Validation & Database (8 hours)

**Morning (4 hours)**:
- DEV-W2-004: Joi input validation for all endpoints (4h)

**Afternoon (4 hours)**:
- DEV-W2-005: Database connection hardening (2h)
- DEV-W2-006: Database indexes for performance (2h)

**Deliverables**:
- All endpoints validated
- Database connection pool working
- Performance indexes added
- Query times < 100ms

---

### Day 3: Testing Infrastructure (8 hours)

**Morning (4 hours)**:
- DEV-W2-007: Integration test suite (4h)

**Afternoon (4 hours)**:
- DEV-W2-008: Unit tests for services (3h)
- DEV-W2-009: Test coverage reports (1h)

**Deliverables**:
- 100% critical flow coverage
- 80% code coverage
- Tests automated
- Coverage reports generated

---

### Day 4: Monitoring & Production Config (8 hours)

**Morning (4 hours)**:
- DEV-W2-010: Health check endpoints (2h)
- DEV-W2-011: Rate limiting verification (2h)

**Afternoon (4 hours)**:
- DEV-W2-012: Configure production Mailjet (1h)
- DEV-W2-013: Environment-specific configuration (3h)

**Deliverables**:
- Health checks working
- Rate limiting verified
- Real emails sending
- 3 environment configs (dev/staging/prod)

---

### Day 5: Code Quality & Documentation (8 hours)

**Morning (4 hours)**:
- DEV-W2-014: Remove all hardcoding (3h)
- DEV-W2-015: API documentation (Swagger) (1h start)

**Afternoon (4 hours)**:
- DEV-W2-015: Complete API documentation (2h)
- DEV-W2-016: Deployment guides and checklists (2h)

**Evening (4 hours - Optional for Week 1 Deferred)**:
- DEV-W2-017: Template editing UI (6h total - can span to next day)
- DEV-W2-018: Template duplication UI (2h)
- DEV-W2-019: Template preview (4h)
- DEV-W2-020: Enhanced question filtering (4h)

**Deliverables**:
- Zero hardcoded values
- Complete API documentation
- Deployment runbook
- Week 1 deferred features (optional)

---

## Task List with Priorities

### P0 (Critical - Must Complete)

1. **DEV-W2-001**: Security audit & secrets management (2h)
2. **DEV-W2-002**: Production logger (Winston) (3h)
3. **DEV-W2-003**: Error handling middleware (3h)
4. **DEV-W2-004**: Input validation (Joi) (4h)
5. **DEV-W2-005**: Database connection hardening (2h)
6. **DEV-W2-007**: Integration tests (4h)
7. **DEV-W2-010**: Health checks (2h)
8. **DEV-W2-012**: Real Mailjet configuration (1h)
9. **DEV-W2-014**: Remove hardcoding (3h)

**Total P0**: 24 hours

### P1 (High - Should Complete)

10. **DEV-W2-006**: Database indexes (2h)
11. **DEV-W2-008**: Unit tests (3h)
12. **DEV-W2-009**: Test coverage (1h)
13. **DEV-W2-011**: Rate limiting verification (2h)
14. **DEV-W2-013**: Environment configs (3h)
15. **DEV-W2-015**: API documentation (3h)
16. **DEV-W2-016**: Deployment guides (2h)
17. **DEV-W2-017**: Template editing UI (6h)

**Total P1**: 22 hours

### P2 (Medium - Nice to Have)

18. **DEV-W2-018**: Template duplication (2h)
19. **DEV-W2-019**: Template preview (4h)
20. **DEV-W2-020**: Enhanced filtering (4h)

**Total P2**: 10 hours

**Grand Total**: 56 hours (40h core + 16h deferred features)
**Available**: 40 hours (5 days × 8 hours)
**Strategy**: Complete all P0 + P1 (46h with buffer), defer P2 if needed

---

## Success Criteria

### Technical Requirements

- [ ] Zero exposed secrets in git
- [ ] All secrets cryptographically random (> 32 chars)
- [ ] Production logger operational (Winston)
- [ ] Logs written to files with rotation
- [ ] Global error handler working
- [ ] All errors return consistent JSON
- [ ] Input validation on all POST/PUT endpoints
- [ ] Database connection pool configured (5-50)
- [ ] Database indexes added (all models)
- [ ] Query performance < 100ms
- [ ] Integration tests for all critical flows
- [ ] Unit test coverage > 80%
- [ ] Health check endpoints working (/health, /health/liveness, /health/readiness)
- [ ] Rate limiting verified on all public endpoints
- [ ] Real Mailjet emails sending
- [ ] Environment configs for dev/staging/prod
- [ ] Zero hardcoded URLs, ports, or values
- [ ] API documentation at /api-docs
- [ ] Complete deployment guide (DEPLOYMENT.md)
- [ ] Production checklist (PRODUCTION_CHECKLIST.md)

### Functional Requirements

- [ ] All Week 1 features still working
- [ ] Assessment template creation working
- [ ] Invitation flow working
- [ ] Assessment taking working
- [ ] Results viewing working
- [ ] Email invitations sending
- [ ] Role-based access control working

### Documentation Requirements

- [ ] README.md updated with full setup
- [ ] DEPLOYMENT.md created
- [ ] PRODUCTION_CHECKLIST.md created
- [ ] ARCHITECTURE.md created
- [ ] API documentation (Swagger) complete
- [ ] All environment variables documented

---

## Risk Mitigation

### Identified Risks

1. **Risk**: Testing takes longer than estimated
   - **Mitigation**: Prioritize integration tests (P0), defer some unit tests if needed
   - **Fallback**: Week 3 can absorb overflow

2. **Risk**: Secret rotation breaks existing functionality
   - **Mitigation**: Test thoroughly in development before production
   - **Fallback**: Keep old secrets in backup .env.backup

3. **Risk**: Database migrations cause downtime
   - **Mitigation**: Index creation is online operation, no downtime
   - **Fallback**: Create indexes off-peak hours

4. **Risk**: Week 1 deferred features don't complete
   - **Mitigation**: These are P2, not blocking production
   - **Fallback**: Move to Week 3

### Quality Gates

Each day ends with:
- [ ] Code review of all changes
- [ ] All new code tested
- [ ] No regressions in existing features
- [ ] Documentation updated
- [ ] Commit with clear message

---

## Dependencies

### External Dependencies

- Mailjet account (for DEV-W2-012)
- MongoDB Atlas (existing)
- NPM packages: winston, joi, swagger-jsdoc, nyc, mongodb-memory-server

### Internal Dependencies

- Week 1 code complete (✅ Done)
- Database access (✅ Available)
- Git repository (✅ Available)
- Development environment (✅ Ready)

### Team Dependencies

- Engineering Lead: Security, architecture decisions
- Backend Team: API changes, database work
- Frontend Team: Template features (DEV-W2-017 to DEV-W2-020)
- QA Team: Test writing and execution

---

## Communication Plan

### Daily Standups

**Time**: 9:00 AM (15 min)
**Format**:
- What did you complete yesterday?
- What are you working on today?
- Any blockers?

### Mid-Week Checkpoint

**Time**: Wednesday 3:00 PM
**Review**:
- Progress vs plan
- Risk assessment
- Adjust priorities if needed

### End-of-Week Demo

**Time**: Friday 3:00 PM
**Demo**:
- Production-ready system
- Health checks operational
- Real emails working
- Test coverage reports
- API documentation

---

## Week 2 vs Week 1 Comparison

| Aspect | Week 1 | Week 2 |
|--------|--------|--------|
| Focus | Features | Production Hardening |
| Secrets | Exposed in git ❌ | Secure management ✅ |
| Logging | console.log ❌ | Winston (production) ✅ |
| Errors | Inconsistent ❌ | Global handler ✅ |
| Validation | Minimal ❌ | Comprehensive (Joi) ✅ |
| Testing | Incomplete ❌ | > 80% coverage ✅ |
| Monitoring | None ❌ | Health checks ✅ |
| Config | Hardcoded ❌ | Environment-specific ✅ |
| Documentation | Basic ❌ | Complete (Swagger) ✅ |
| Production Ready | No ❌ | Yes ✅ |

---

## Tools & Technologies

### New Dependencies to Install

```bash
# Logging
npm install winston winston-daily-rotate-file

# Validation
npm install joi

# API Documentation
npm install swagger-jsdoc swagger-ui-express

# Testing
npm install --save-dev mongodb-memory-server
npm install --save-dev nyc  # Code coverage

# Error tracking (optional)
npm install @sentry/node
```

### Configuration Files to Create

- `.env.development`
- `.env.staging`
- `.env.production.example`
- `.nycrc` (test coverage config)
- `DEPLOYMENT.md`
- `PRODUCTION_CHECKLIST.md`
- `ARCHITECTURE.md`
- `docs/OPERATIONS_RUNBOOK.md`

---

## Next Steps

### Immediate Actions (Today)

1. ✅ Review this plan with team
2. ⬜ Create Week 2 branch: `git checkout -b week-2-production-hardening`
3. ⬜ Set up development environment for Week 2
4. ⬜ Install new dependencies (Winston, Joi, etc.)
5. ⬜ Start DEV-W2-001 (Security audit)

### Tomorrow (Day 1)

1. Complete security audit
2. Remove secrets from git
3. Implement Winston logger
4. Start error handling

### Week 2 Goal

**Transform prototype into production-grade system with zero shortcuts**

---

## Appendix: Issues Addressed

This week addresses the following issues from MASTER_ISSUES_LIST.md:

- **ISS-002**: Hard-coded secrets (DEV-W2-001)
- **ISS-W1-005**: No question library seeding (integrated in testing)
- **ISS-W1-006**: No question validation (DEV-W2-004)
- **ISS-W1-007**: No template editing UI (DEV-W2-017)
- **ISS-W1-008**: No template duplication UI (DEV-W2-018)
- **ISS-024**: Integration tests missing (DEV-W2-007)
- **ISS-027**: Rate limiter verification (DEV-W2-011)
- **ISS-028**: Email sending (DEV-W2-012)

And improvements from MASTER_IMPROVEMENTS_LIST.md:

- **IMP-W1-001**: Percentage conversion utility (in constants)
- **IMP-W1-002**: Template preview (DEV-W2-019)
- **IMP-W1-003**: Question filtering (DEV-W2-020)
- **IMP-W1-006**: Bulk operations (deferred to Week 3)

---

**Document Version**: 1.0
**Last Updated**: October 15, 2025
**Next Review**: End of Day 1 (Oct 16)
