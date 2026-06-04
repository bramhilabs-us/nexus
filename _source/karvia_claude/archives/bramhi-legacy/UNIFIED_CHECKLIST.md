# BRAMHI Unified Checklist

**Version**: 1.0.0
**Last Updated**: January 7, 2026
**Owner**: BRAMHI_LABS
**Status**: Active

---

## Purpose

This is the **MANDATORY quality gate checklist** for all Claude sessions. Every session MUST pass these gates before closure.

---

## Quick Reference Card

```
SESSION START:
□ Run /init
□ Read QUICK_START.md (5 essential files)
□ Check SESSION_INDEX.md for context
□ Verify environment (git status, services)

SESSION WORK:
□ Follow session type workflow (coding/strategy/audit/etc.)
□ Update TODO list frequently
□ Document decisions as you go
□ Verify links before creating documents

SESSION END:
□ Update SESSION_INDEX.md
□ Update CHANGE_LOG.md
□ Calculate KPIs (CER, TCV, TES, RAI)
□ Run /close
□ Create handoff document
```

---

## Pre-Session Gates (MANDATORY)

### Gate 1: Context Verification
```
[ ] Read .claude/README.md (Session Seal)
[ ] Read sessions/SESSION_INDEX.md (Last session summary)
[ ] Read active handoff document (if exists)
[ ] Check git status for uncommitted changes
[ ] Verify services are running (if coding session)
```

### Gate 2: Session Classification
```
[ ] Identify session type:
    [ ] /strategy - Planning, architecture, roadmaps
    [ ] /coding - Implementation, bug fixes
    [ ] /audit - Code review, quality validation
    [ ] /testing - Test execution, coverage
    [ ] /general - Research, questions, quick fixes
[ ] Load appropriate context per session type
[ ] Set token budget expectation
```

---

## During-Session Gates (MANDATORY)

### Gate 3: Security Gates
```
EVERY code change MUST pass:
[ ] No hardcoded secrets (API keys, passwords, tokens)
[ ] No hardcoded credentials (connection strings with passwords)
[ ] Environment variables used for all sensitive config
[ ] Input validation on user-facing endpoints
[ ] SQL/NoSQL injection prevention (parameterized queries)
[ ] XSS prevention (output encoding)
[ ] Authentication on protected routes
[ ] Authorization checks (role-based access)
[ ] Audit logging for security events
[ ] Rate limiting on public endpoints
```

### Gate 4: Architecture Gates
```
EVERY structural change MUST pass:
[ ] Follows established folder structure (CODEBASE_STRUCTURE.md)
[ ] Follows naming conventions (DOCUMENT_STANDARDS.md)
[ ] No circular dependencies introduced
[ ] Service boundaries respected (microservices)
[ ] Database schema changes documented
[ ] API contract changes versioned
[ ] Breaking changes flagged and documented
```

### Gate 5: Documentation Gates
```
EVERY session MUST update:
[ ] Inline comments for complex logic
[ ] Function/method JSDoc or equivalent
[ ] API documentation for new endpoints
[ ] README updates for new features
[ ] CHANGE_LOG.md entry
[ ] Link verification before document creation
```

### Gate 6: Code Quality Gates
```
EVERY code change MUST pass:
[ ] Linting passes (no errors)
[ ] Type checking passes (if applicable)
[ ] Unit tests written for new code
[ ] Test coverage maintained (>80%)
[ ] No console.log statements in production code
[ ] Error handling implemented
[ ] Edge cases considered and handled
```

---

## Post-Session Gates (MANDATORY)

### Gate 7: Session Documentation
```
[ ] SESSION_INDEX.md updated with entry:
    - Session number
    - Date
    - Size (S/M/L)
    - Story points
    - Quality score
    - Summary (2-3 sentences)
[ ] CHANGE_LOG.md updated with changes
[ ] Handoff document created (sessions/handoffs/YYYY-MM-DD_handoff.md)
```

### Gate 8: KPI Calculation
```
[ ] Calculate and record:
    - CER: (Docs Used / Docs Loaded) × 100
    - TCV: (Tasks Completed / Tasks Planned) × (Est / Actual)
    - TES: Business Value / Tokens × 1000
    - RAI: (First Success / Total Attempts) × 100
[ ] Update PERFORMANCE_METRICS.md
[ ] Flag any metrics below target
```

### Gate 9: Handoff Quality
```
[ ] Next session priorities listed (3-5 items)
[ ] Blockers documented (if any)
[ ] Key files identified for next session
[ ] Incomplete work clearly marked
[ ] Decision log for architectural choices
```

---

## Session Type-Specific Checklists

### /strategy Sessions
```
ADDITIONAL GATES:
[ ] Business requirements documented
[ ] Technical approach justified
[ ] Alternatives considered and documented
[ ] Risks identified and mitigation planned
[ ] Story points estimated
[ ] Dependencies mapped
[ ] Timeline feasible
```

### /coding Sessions
```
ADDITIONAL GATES:
[ ] Tests written before/with code (TDD preferred)
[ ] Manual testing performed
[ ] Edge cases handled
[ ] Error messages user-friendly
[ ] Performance considered
[ ] No N+1 queries introduced
[ ] Database indexes reviewed
```

### /audit Sessions
```
ADDITIONAL GATES:
[ ] Scope clearly defined
[ ] All files in scope reviewed
[ ] Issues categorized (CRITICAL/HIGH/MEDIUM/LOW)
[ ] Each issue has remediation plan
[ ] Blockers escalated immediately
[ ] Quality score calculated
[ ] Re-audit scheduled if needed
```

### /testing Sessions
```
ADDITIONAL GATES:
[ ] Test plan documented
[ ] Coverage baseline recorded
[ ] New tests for new code
[ ] Regression tests for bug fixes
[ ] Integration tests for API changes
[ ] E2E tests for user journeys
[ ] Performance benchmarks (if applicable)
```

---

## Quality Scoring Matrix

### Session Quality Score (1-10)

| Score | Criteria |
|-------|----------|
| **10** | All gates passed, exceptional documentation, zero issues |
| **9** | All gates passed, comprehensive documentation, minor improvements |
| **8** | All mandatory gates passed, good documentation |
| **7** | Most gates passed, adequate documentation |
| **6** | Minimum gates passed, basic documentation |
| **5** | Some gates missed, documentation gaps |
| **<5** | Multiple gates failed, significant gaps |

### Target Scores

| Session Type | Minimum | Target | Stretch |
|--------------|---------|--------|---------|
| /strategy | 7 | 8 | 9+ |
| /coding | 7 | 8 | 9+ |
| /audit | 8 | 9 | 10 |
| /testing | 7 | 8 | 9+ |
| /general | 6 | 7 | 8+ |

---

## Red Flag Indicators

### STOP and Escalate If:
```
❌ Hardcoded credentials detected
❌ Security vulnerability introduced
❌ Breaking change without version bump
❌ Production data exposed in logs
❌ Authentication bypassed
❌ Unauthorized data access possible
❌ Rate limiting disabled
❌ Audit logging removed
```

### Warning Signs (Document and Continue):
```
⚠️ Test coverage dropped
⚠️ Technical debt increased
⚠️ Documentation incomplete
⚠️ KPIs below target
⚠️ Handoff unclear
⚠️ Dependencies outdated
```

---

## Enforcement

### Pre-Commit Hooks
The following should be checked before any commit:
1. Linting passes
2. Type checking passes
3. Tests pass
4. No secrets in code (git-secrets or similar)
5. Required files exist (verify_claude.sh)

### Session Close Enforcement
The `/close` command MUST:
1. Verify SESSION_INDEX.md updated
2. Verify CHANGE_LOG.md updated
3. Calculate and record KPIs
4. Create handoff document
5. Update Session Seal in README.md

---

## Checklist Versioning

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 7, 2026 | Initial unified checklist from cross-repo analysis |

---

## Related Documents

- [BRAMHI_MASTER_PLAN.md](./BRAMHI_MASTER_PLAN.md) - Framework overview
- [KPI_SCHEMA.md](./KPI_SCHEMA.md) - Metrics definitions
- [../BEST_PRACTICES.md](../BEST_PRACTICES.md) - Quality standards
- [../DOCUMENT_STANDARDS.md](../DOCUMENT_STANDARDS.md) - Documentation rules

---

**Document Status**: Mandatory quality gate checklist for all Claude sessions.
