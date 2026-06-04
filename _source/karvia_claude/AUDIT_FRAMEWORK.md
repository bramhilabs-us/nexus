# Audit Framework & Sub-Audit Commands

<!-- @GENOME T2-GOV-004 | ACTIVE | 2026-04-06 | parent:T0-GOV-001 | auto:/audit | linked:/strategy,/init -->

**Version**: 1.0
**Created**: April 6, 2026
**Purpose**: Comprehensive audit framework with MECE sub-audit commands and document cascade verification

---

## Table of Contents

1. [Document Web Architecture](#1-document-web-architecture)
2. [Cascade Verification System](#2-cascade-verification-system)
3. [Team Access Patterns](#3-team-access-patterns)
4. [Sub-Audit Command Specifications](#4-sub-audit-command-specifications)
5. [Audit Execution Playbook](#5-audit-execution-playbook)

---

## 1. Document Web Architecture

### 1.1 Tier Hierarchy

```
┌────────────────────��─────────────────────────────────��──────────────────────────┐
│  T0 (Constitutional) - ROOT Level                                                │
│  ════════════════════════════════════════════════════════��══════════════════════ │
│  Changes: RARE, require explicit approval                                        │
│                                                                                  │
│  ┌──────────────┐   ┌──────────────────┐                                        │
│  │  CLAUDE.md   │   │  SESSION_LOG.md  │                                        │
│  │  T0-GOV-001  │   │   T0-SES-001     │                                        │
│  └──────┬───────┘   └────────┬─────────┘                                        │
│         │                    │                                                   │
└─────────┼────────────────────┼──────────────────────────────────────────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────────────────────────────────���───────────────────────────────┐
│  T1 (Strategic) - Vision Level                                                   │
│  ═══════════════════════════════════════════════════════════════════════════════ │
│  Changes: Cascade to ALL dependent T2 docs                                       │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │  ECOSYSTEM_ARCH     │  │ KARVIA_ENGINE_VISION│  │  YSELA_VISION       │     │
│  │    T1-ARC-001       │  │    T1-KRV-001       │  │  T1-PRD-YSELA-002   │     │
│  │  (parent: ROOT)     │  │  (parent: ROOT)     │  │  (parent: ROOT)     │     │
│  └──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘     │
│             │                        │                        │                  │
│  ┌──────────┴───────────────────────┴───���────────────────────┴───────────┐     │
│  │  T1-PRD-001, T1-PRD-002, T1-PRD-006, T1-RDM-001, T1-NAV-*             │     │
│  │  (Product roadmaps, beta plans, navigation)                           │     │
│  └───────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  T2 (Canonical) - Implementation Level                                           │
│  ═══════════════════════════════════════════════════════════════════════════════ │
│  Changes: Cascade to relevant T3 docs                                            │
│                                                                                  │
│  ARCHITECTURE (T2-ARC-*)          │  PRODUCT (T2-PRD-*)                         │
│  ───────────────────────          │  ────────────────────                        │
│  • backend_architecture           │  • UX_PRINCIPLES                             │
│  • api_contracts                  │  • COACH_PERSONA                             │
│  • database_schema                │  • BBB_FRAMEWORK                             │
│  • KARVIA_1.0_CAPABILITIES        │  • CONSULTANT_METHODOLOGY                    │
│  • JWT_SECURITY_DESIGN            │  • MODULE_ARCHITECTURE                       │
│  • RBAC_IMPLEMENTATION            │  • PROMPT_TOUCHPOINTS/*                      │
│  • MULTI_TENANCY_SECURITY         │  • USER_JOURNEY_SIMULATION                   │
│  • PORT_ALLOCATION                │  • PBL_GAMIFICATION                          │
│                                   │                                              │
│  GOVERNANCE (T2-GOV-*)            │  DESIGN (T2-DES-*)                           │
│  ──────────────────────           │  ────────────────────                        │
│  • DOCUMENT_STANDARDS             │  • DESIGN_SYSTEM                             │
│  • PROMPT_GOVERNANCE              │                                              │
│  • This file (AUDIT_FRAMEWORK)    │                                              │
│                                   │                                              │
│  COMMANDS (T2-CMD-*)              │  NAVIGATION (T2-NAV-*)                       │
│  ──────────────────────           │  ────────────────────                        │
│  • /init, /close, /coding, etc.   │  • README files (folder indexes)             │
└─────────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  T3 (Working) - Ephemeral Level                                                  │
│  ══════════════════════════════════��════════════════════════════���═══════════════ │
│  Changes: No cascade (disposable after sprint)                                   │
│                                                                                  │
│  • Sprint handoff documents (T3-SPR-*)                                          │
│  • Session break notes (T3-SES-*)                                               │
│  • Mockup READMEs (T3-NAV-*)                                                    │
│  • Design specs (T3-DES-*)                                                      │
│  • Audit findings (before FIXED)                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Parent-Child Relationships

| Parent | Children | Cascade Rule |
|--------|----------|--------------|
| `ROOT` | T0-GOV-001, T0-SES-001, T1-ARC-001, T1-KRV-001, T1-PRD-*, T1-RDM-001 | Full policy cascade |
| `T0-GOV-001` | All T2-GOV-*, T2-ARC-*, T2-CMD-* | Standards cascade |
| `T1-ARC-001` | T2-ARC-002, T2-ARC-008-018 | Architecture cascade |
| `T1-KRV-001` | T1-KRV-002, T2-ARC-008, 011-018 | Engine spec cascade |
| `T1-PRD-001` | T1-PRD-002-007, T2-PRD-* | Product spec cascade |
| `T1-PRD-002` | T1-NAV-001, T2-PRD-011-* | Beta roadmap cascade |
| `T2-PRD-011` | T2-PRD-012-024, MODULE_ARCHITECTURE | Implementation cascade |
| `T2-PRD-026` | T2-PRD-027-037, COACH_PERSONA | Prompt system cascade |

---

## 2. Cascade Verification System

### 2.1 Change Impact Analysis

When a document changes, run this verification:

```bash
# 1. Find all children of changed document
grep -r "parent:CHANGED_ID" --include="*.md" .claude/ KARVIA_STRATEGY/ YSELA/

# 2. Check if children were updated after parent
# Compare @GENOME dates

# 3. Verify no contradictions exist
# Run content checks
```

### 2.2 Cascade Triggers

| When This Changes | These Must Be Reviewed | Verification Command |
|-------------------|------------------------|---------------------|
| T0: CLAUDE.md security patterns | All T2-ARC security docs | `grep -r "XSS\|multi-tenant" --include="*.md"` |
| T1: KARVIA_ENGINE_VISION | T2: Capabilities, Architecture, API | `grep -r "parent:T1-KRV-001" --include="*.md"` |
| T1: YSELA_VISION | T2: UX_PRINCIPLES, COACH_PERSONA | `grep -r "parent:T1-PRD-YSELA" --include="*.md"` |
| T1: ECOSYSTEM_ARCHITECTURE | All boundary definitions | `grep -r "KARVIA.*YSELA" --include="*.md"` |
| T2: API contracts | T3: Sprint implementation plans | Check sprint handoffs |
| T2: COACH_PERSONA | All prompt touchpoints | `grep -r "YSELA Coach" --include="*.md"` |

### 2.3 Cascade Verification Checklist

```markdown
## Cascade Verification for [DOCUMENT_ID]

### Pre-Change
- [ ] Document current @GENOME date
- [ ] List all child documents (grep for parent:THIS_ID)
- [ ] List all linked documents
- [ ] Identify potential contradictions

### Post-Change
- [ ] Update @GENOME date
- [ ] Review each child for required updates
- [ ] Verify no new contradictions
- [ ] Update linked documents if needed
- [ ] Run content consistency check
```

---

## 3. Team Access Patterns

### 3.1 Role-Based Document Access

```
┌─────────────────────────────────────────────────��────────────────────────���───────┐
│                            TEAM ACCESS MATRIX                                     │
├──────────────────┬──────────────────┬──────────────────┬────────────────────────���
│   STRATEGY       │     PRODUCT      │   ENGINEERING    │         QA             │
│   (CEO/CPO)      │   (PM/Designer)  │    (CTO/Dev)     │      (Tester)          │
├──────────────────┼──────────────────┼──────────────────┼────────────────────────┤
│ ENTRY POINT:     │ ENTRY POINT:     │ ENTRY POINT:     │ ENTRY POINT:           │
│ /strategy        │ /design          │ /coding          │ /testing               │
├──────────────────┼──────────────────┼──────────────────┼────────────────────────┤
│ PRIMARY DOCS:    │ PRIMARY DOCS:    │ PRIMARY DOCS:    │ PRIMARY DOCS:          │
│                  │                  │                  │                        │
│ T0: CLAUDE.md    │ T1: YSELA_VISION │ T1: ENGINE_VISION│ T2: Test plans         │
│ T1: ECOSYSTEM    │ T2: UX_PRINCIPLES│ T2: ARCHITECTURE │ T2: API contracts      │
│ T1: ROADMAP      │ T2: COACH_PERSONA│ T2: CAPABILITIES │ T3: Sprint specs       │
│ T1: Vision docs  │ T2: User journeys│ T2: API docs     │ T3: Test cases         │
│                  │ T3: Mockups      │ T2: Security docs│                        │
├──────────────────┼──────────────────┼──────────────────┼────────────────────────┤
│ AUDIT COMMANDS:  │ AUDIT COMMANDS:  │ AUDIT COMMANDS:  │ AUDIT COMMANDS:        │
│                  │                  │                  │                        │
│ /audit-docs      │ /audit-ux        │ /audit-arch      │ /audit-quality         │
│ /audit-compliance│ /audit-a11y      │ /audit-security  │ /audit-coverage        │
│                  │                  │ /audit-data      │                        │
└──────────────────┴──────────────────┴──────────────────┴────────────────────────┘
```

### 3.2 Document Loading by Session Type

| Session Type | Auto-Load Docs | Token Budget |
|--------------|----------------|--------------|
| `/strategy` | T0-GOV-001, T1-ARC-001, T1-RDM-001, T1-PRD-* | ~3,000 |
| `/coding` | T0-GOV-001 (patterns), T2-ARC-*, Current sprint | ~2,500 |
| `/design` | T1-YSELA-*, T2-PRD-018, T2-DES-001 | ~2,000 |
| `/testing` | T2-ARC-* (contracts), Test plans | ~1,500 |
| `/audit` | All relevant to audit scope | ~2,000 |

### 3.3 Cross-Team Handoff Points

| From → To | Handoff Document | Verification |
|-----------|------------------|--------------|
| Strategy → Product | T1 Vision docs | Product confirms understanding |
| Product → Engineering | T2 Implementation specs | Engineering estimates story points |
| Engineering → QA | T3 Sprint specs | QA creates test cases |
| QA → Strategy | Test reports, audit findings | Strategy reviews quality |

---

## 4. Sub-Audit Command Specifications

### 4.1 Master Audit Command (`/audit`)

**Purpose**: Routes to appropriate sub-audit based on scope

**Workflow**:
1. Read AUDIT_TRACKER.md for previous state
2. Ask user for audit scope
3. Route to appropriate sub-audit OR run directly
4. Update AUDIT_TRACKER.md with findings

---

### 4.2 `/audit-docs` - Documentation Audit

**Focus**: Document tier compliance, cascade integrity, team accessibility

**Industry Standard**: Documentation governance, ISO 30400

**Checklist**:
```markdown
## Documentation Audit Checklist

### Tier Compliance
- [ ] All T0-T2 docs have @GENOME tags
- [ ] Parent references are valid (parent exists)
- [ ] Status is accurate (ACTIVE, DRAFT, ARCHIVED)
- [ ] Dates are current (not stale >90 days)

### Cascade Integrity
- [ ] T1 changes reflected in T2 children
- [ ] No contradictions between parent and child
- [ ] Cross-references are valid (targets exist)
- [ ] Linked documents are consistent

### Team Accessibility
- [ ] Strategy team can find vision docs
- [ ] Product team can find UX specs
- [ ] Engineering team can find technical docs
- [ ] QA team can find test requirements

### Content Quality
- [ ] No orphan documents (missing parent)
- [ ] No circular references
- [ ] README navigation hubs are current
- [ ] Table of contents match actual content
```

**Exit Criteria**:
- All T0-T2 docs have valid genome tags
- No cascade violations
- No orphan documents

---

### 4.3 `/audit-security` - Security Audit

**Focus**: Authentication, authorization, data protection, OWASP Top 10

**Industry Standard**: OWASP, SOC 2, ISO 27001

**Checklist**:
```markdown
## Security Audit Checklist

### Authentication (AuthN)
- [ ] JWT implementation follows best practices
- [ ] Token expiration configured correctly
- [ ] Refresh token rotation implemented
- [ ] No hardcoded secrets in code
- [ ] JWT_SECRET validated in production

### Authorization (AuthZ)
- [ ] RBAC enforced on all protected routes
- [ ] Role hierarchy properly implemented
- [ ] No privilege escalation paths
- [ ] requireRole() middleware used consistently

### Multi-Tenant Isolation
- [ ] All queries filter by company_id
- [ ] No cross-tenant data leakage
- [ ] Tenant context validated in middleware
- [ ] Security tests cover isolation (26+ tests)

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] PII handling compliant
- [ ] Input validation on all endpoints
- [ ] XSS prevention (escapeHtml used)
- [ ] SQL/NoSQL injection prevention

### OWASP Top 10
- [ ] A01: Broken Access Control - Verified
- [ ] A02: Cryptographic Failures - Verified
- [ ] A03: Injection - Verified
- [ ] A04: Insecure Design - Verified
- [ ] A05: Security Misconfiguration - Verified
- [ ] A07: Auth Failures - Verified
```

**Exit Criteria**:
- Zero CRITICAL or HIGH security findings
- All OWASP Top 10 items addressed
- Security test suite passing (26+ tests)

---

### 4.4 `/audit-architecture` - Architecture Audit

**Focus**: Modularity (LEGO), scalability, API contracts, service boundaries

**Industry Standard**: TOGAF, Clean Architecture, Twelve-Factor App

**Checklist**:
```markdown
## Architecture Audit Checklist

### LEGO Principle (Modularity)
- [ ] YSELA layer can be swapped without KARVIA changes
- [ ] KARVIA engine can power different product layers
- [ ] iBrain integration is optional (graceful degradation)
- [ ] No tight coupling between layers

### Scalability
- [ ] Stateless API design
- [ ] Database queries are efficient (indexes)
- [ ] Caching strategy defined (Redis optional)
- [ ] Horizontal scaling possible

### API Contracts
- [ ] All endpoints documented
- [ ] Request/response schemas defined
- [ ] Versioning strategy in place
- [ ] Breaking changes documented

### Service Boundaries
- [ ] Microservices have clear responsibilities
- [ ] Port allocation documented
- [ ] No circular dependencies
- [ ] Feature flags enable graceful degradation

### Code Organization
- [ ] Separation of concerns (routes, services, models)
- [ ] Business logic in services, not routes
- [ ] No dead code or unreachable paths
- [ ] Consistent naming conventions
```

**Exit Criteria**:
- LEGO principle verified
- All API contracts documented
- No architectural violations

---

### 4.5 `/audit-data` - Data Audit

**Focus**: Data models, cascade policies, privacy (GDPR), data integrity

**Industry Standard**: GDPR, CCPA, Data Governance

**Checklist**:
```markdown
## Data Audit Checklist

### Data Model Integrity
- [ ] All models have required fields
- [ ] Relationships properly defined
- [ ] Indexes on frequently queried fields
- [ ] Soft delete implemented (no hard deletes)

### Cascade Policies
- [ ] Parent deletion cascades correctly
- [ ] Orphan records prevented
- [ ] CASCADE_DELETE_POLICY.md followed
- [ ] Data cleanup jobs defined

### Privacy & Compliance
- [ ] PII fields identified
- [ ] Data retention policy defined
- [ ] User data export capability
- [ ] User data deletion capability
- [ ] Audit trail for data changes

### Multi-Tenant Data
- [ ] Company isolation enforced
- [ ] No cross-company data exposure
- [ ] Tenant context in all queries
- [ ] Backup isolation by tenant
```

**Exit Criteria**:
- All data models documented
- Cascade policies verified
- Privacy requirements met

---

### 4.6 `/audit-ops` - Operations Audit

**Focus**: Deployment safety, monitoring, incident response, backup/recovery

**Industry Standard**: SRE practices, ITIL, DevOps maturity

**Checklist**:
```markdown
## Operations Audit Checklist

### Deployment Safety
- [ ] CI/CD pipeline defined
- [ ] Staging environment exists
- [ ] Rollback procedure documented
- [ ] Database migration strategy
- [ ] Feature flags for gradual rollout

### Monitoring & Alerting
- [ ] Application logs structured
- [ ] Error tracking configured
- [ ] Health check endpoints exist
- [ ] Performance metrics collected
- [ ] Alert thresholds defined

### Incident Response
- [ ] Incident severity levels defined
- [ ] Escalation path documented
- [ ] Runbooks for common issues
- [ ] Post-mortem process defined

### Backup & Recovery
- [ ] Database backup schedule
- [ ] Backup verification process
- [ ] Recovery time objective (RTO)
- [ ] Recovery point objective (RPO)
- [ ] Disaster recovery plan
```

**Exit Criteria**:
- Deployment process documented
- Monitoring in place
- Recovery plan tested

---

### 4.7 `/audit-ux` - UX/Accessibility Audit

**Focus**: WCAG compliance, mobile responsiveness, user experience consistency

**Industry Standard**: WCAG 2.1 AA, Section 508

**Checklist**:
```markdown
## UX/Accessibility Audit Checklist

### WCAG 2.1 AA Compliance
- [ ] Color contrast ratios (4.5:1 minimum)
- [ ] Keyboard navigation functional
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Form labels associated
- [ ] Error messages accessible

### Mobile Responsiveness
- [ ] Touch targets adequate (44x44px)
- [ ] No horizontal scroll on mobile
- [ ] Text readable without zoom
- [ ] Navigation works on mobile

### UX Consistency
- [ ] Design system followed
- [ ] Navy/Gold branding applied
- [ ] Button styles consistent
- [ ] Typography hierarchy correct
- [ ] Loading states implemented
- [ ] Error states designed

### User Journey
- [ ] FTUE (First Time User Experience) defined
- [ ] Empty states designed
- [ ] Help text available
- [ ] Tooltips contextual
```

**Exit Criteria**:
- WCAG 2.1 AA compliant
- Mobile-responsive
- Design system followed

---

### 4.8 `/audit-quality` - Code Quality Audit

**Focus**: Test coverage, technical debt, code metrics, performance

**Industry Standard**: ISO 25010, SonarQube metrics

**Checklist**:
```markdown
## Code Quality Audit Checklist

### Test Coverage
- [ ] Unit test coverage >80%
- [ ] Integration tests for critical paths
- [ ] E2E tests for user journeys
- [ ] Security tests passing
- [ ] Performance tests defined

### Technical Debt
- [ ] No TODO without ticket
- [ ] No commented-out code
- [ ] No console.log in production
- [ ] Dependencies up to date
- [ ] No deprecated API usage

### Code Metrics
- [ ] Functions <50 lines
- [ ] Cyclomatic complexity <10
- [ ] No duplicate code blocks
- [ ] Consistent code style (ESLint)

### Performance
- [ ] API response time <200ms P95
- [ ] Database queries optimized
- [ ] No N+1 query patterns
- [ ] Assets minified
```

**Exit Criteria**:
- Test suite passing (98%+)
- No critical technical debt
- Performance targets met

---

### 4.9 `/audit-compliance` - Compliance Audit

**Focus**: Regulatory requirements, audit trails, data retention

**Industry Standard**: SOX, HIPAA (if applicable), industry-specific

**Checklist**:
```markdown
## Compliance Audit Checklist

### Audit Trail
- [ ] User actions logged
- [ ] Data changes tracked
- [ ] Login/logout recorded
- [ ] Access attempts logged
- [ ] Logs tamper-proof

### Data Retention
- [ ] Retention policy defined
- [ ] Automatic purge implemented
- [ ] Archive strategy documented
- [ ] Legal hold capability

### Regulatory
- [ ] Terms of service current
- [ ] Privacy policy current
- [ ] Cookie consent implemented
- [ ] Data processing agreements
- [ ] Export compliance (if applicable)

### Documentation
- [ ] Policies documented
- [ ] Procedures documented
- [ ] Training records maintained
- [ ] Audit history preserved
```

**Exit Criteria**:
- Audit trail complete
- Policies documented
- No compliance gaps

---

## 5. Audit Execution Playbook

### 5.1 Running a Full Audit

```bash
# Step 1: Check previous audit state
cat KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/AUDIT_TRACKER.md

# Step 2: Select audit scope
/audit  # Interactive selection

# Step 3: Run specific sub-audits
/audit-docs       # Documentation cascade
/audit-security   # Security review
/audit-arch       # Architecture review
# ... etc.

# Step 4: Update tracker with findings
# Each sub-audit adds to AUDIT_TRACKER.md

# Step 5: Generate summary
/audit-summary    # Produces audit report
```

### 5.2 Audit Frequency

| Audit Type | Frequency | Trigger |
|------------|-----------|---------|
| `/audit-docs` | Every sprint | T1 doc changes |
| `/audit-security` | Bi-weekly | Auth changes, new endpoints |
| `/audit-arch` | Monthly | New services, refactors |
| `/audit-data` | Quarterly | Schema changes |
| `/audit-ops` | Monthly | Deployment changes |
| `/audit-ux` | Per feature | UI changes |
| `/audit-quality` | Every sprint | Before release |
| `/audit-compliance` | Quarterly | Policy changes |

### 5.3 Severity Classification

| Severity | Action | SLA |
|----------|--------|-----|
| **CRITICAL** | Stop release | Fix within 24 hours |
| **HIGH** | Block feature | Fix within sprint |
| **MEDIUM** | Schedule fix | Fix within 2 sprints |
| **LOW** | Backlog | Fix when convenient |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [AUDIT_TRACKER.md](../KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/AUDIT_TRACKER.md) | Active findings |
| [CLAUDE.md](../CLAUDE.md) | T0 governance |
| [DOCUMENT_STANDARDS.md](./DOCUMENT_STANDARDS.md) | Doc formatting rules |

---

**Framework Owner**: CTO
**Last Updated**: April 6, 2026
**Next Review**: Sprint 22
