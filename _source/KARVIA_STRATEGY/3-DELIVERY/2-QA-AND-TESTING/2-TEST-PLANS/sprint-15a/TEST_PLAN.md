# Sprint 15-A Test Plan

**Sprint**: 15-A
**Focus**: LLM Context Intelligence + Unified Email System + Testing Infrastructure
**Created**: March 6, 2026
**Status**: ACTIVE

---

## Sprint Scope

| Epic | Points | Test Type |
|------|--------|-----------|
| P0: Strategic Vision Hotfix | 3 | Manual + Unit |
| A: Context Integration | 15 | Integration |
| B: Prompt Enhancement | 8 | Integration |
| C: Testing & Validation | 6 | Unit + Integration |
| D: Task Email Notifications | 15 | Unit + E2E |
| E: Unified Email System | 8 | Unit |
| T: Testing Infrastructure | 30 | Meta (creates tests) |
| **Total** | **85** | |

---

## Test Scope by Epic

### Epic P0: Strategic Vision Hotfix

| Test | Type | Priority | Status |
|------|------|----------|--------|
| Verify strategic_vision fields in prompt | Manual | P0 | NOT STARTED |
| Verify OKR generation uses correct fields | Integration | P0 | NOT STARTED |

### Epic A: Context Integration

| Test | Type | Priority | Status |
|------|------|----------|--------|
| Existing objectives appear in prompt | Integration | HIGH | NOT STARTED |
| Rejection history appears in prompt | Integration | HIGH | NOT STARTED |
| Context logging captures all fields | Unit | MEDIUM | NOT STARTED |
| Debug endpoint returns full context | Integration | MEDIUM | NOT STARTED |

### Epic D: Task Email Notifications

| Test | Type | Priority | Status |
|------|------|----------|--------|
| Task assigned email sends | Integration | HIGH | NOT STARTED |
| Task reassigned email sends | Integration | HIGH | NOT STARTED |
| Daily digest job runs | Unit | MEDIUM | NOT STARTED |
| Email preferences are respected | Unit | MEDIUM | NOT STARTED |

### Epic E: Unified Email System

| Test | Type | Priority | Status |
|------|------|----------|--------|
| Base template renders correctly | Unit | MEDIUM | NOT STARTED |
| Existing emails use new template | Unit | LOW | NOT STARTED |

### Epic T: Testing Infrastructure

| Test | Type | Priority | Status |
|------|------|----------|--------|
| Golden path test runs | E2E | HIGH | NOT STARTED |
| CONSULTANT tests run | E2E | HIGH | NOT STARTED |
| Multi-tenant tests run | Security | HIGH | NOT STARTED |
| CI/CD workflow triggers | Manual | MEDIUM | NOT STARTED |

---

## Test Commands

```bash
# Run all Sprint 15-A tests
npm test

# By category
npm run test:unit
npm run test:integration
npm run test:security

# Specific Epic T tests
npm run test:golden-path
npm run test:consultant
npm run test:multi-tenant
```

---

## Acceptance Criteria

### Must Pass Before Deploy

- [ ] P0 strategic vision fix verified
- [ ] Task emails send correctly
- [ ] No regression in existing features

### Must Pass Before Sprint Close

- [ ] All Epic T tests implemented and passing
- [ ] CI/CD workflow operational
- [ ] Test coverage improved from 38% to 50%

---

## Test Data Requirements

### Accounts Needed

| Role | Email | Purpose |
|------|-------|---------|
| CONSULTANT | consultant@test.com | Multi-company tests |
| BUSINESS_OWNER (Company A) | owner-a@test.com | Isolation tests |
| BUSINESS_OWNER (Company B) | owner-b@test.com | Isolation tests |
| EMPLOYEE | employee@test.com | Role tests |

### Data Setup

```bash
# Seed test data
npm run seed:assessments
npm run seed:mece

# Create test users (manual or script)
```

---

## Risk Areas

| Risk | Mitigation |
|------|------------|
| OKR generation timing (AI slow) | Mock OpenAI in tests |
| Email delivery verification | Use test Mailjet sandbox |
| Multi-tenant data leakage | Run security tests on every PR |

---

**Document Version**: 1.0
**Owner**: QA Team
