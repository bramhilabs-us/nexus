# Strategic Decisions Log

**Purpose**: Track all significant product roadmap decisions with rationale and outcomes.

**Last Updated**: March 4, 2026

---

## Decision Framework

### Decision Types
| Type | Description |
|------|-------------|
| `STRATEGIC` | Long-term direction, market positioning |
| `TECHNICAL` | Architecture, technology choices |
| `SCOPE` | Feature inclusion/exclusion |
| `PRIORITY` | Sprint ordering, resource allocation |
| `PROCESS` | Development methodology |

### Decision Status
| Status | Meaning |
|--------|---------|
| `ACTIVE` | Currently in effect |
| `SUPERSEDED` | Replaced by newer decision |
| `REVERSED` | Decision was reversed |
| `PENDING` | Awaiting implementation |

---

## 2026 Decisions

### DEC-2026-012: Sprint 16 Tech Debt Focus
**Date**: March 4, 2026
**Type**: PRIORITY
**Status**: PENDING

**Decision**: Dedicate Sprint 16 (55 pts) entirely to technical debt and stabilization.

**Context**:
- 602+ story points delivered across 13 sprints
- Accumulating technical debt in authentication, error handling
- Need stable foundation before Scale phase

**Rationale**:
1. Velocity sustainment requires periodic cleanup
2. Security audit findings need addressing
3. Performance optimization needed before user growth

**Alternatives Considered**:
- Continue feature development (rejected: debt compounding)
- Split sprint 50/50 (rejected: insufficient focus)

**Impact**:
- Feature delivery paused for 2 weeks
- Improved stability and performance
- Reduced future bug rate

---

### DEC-2026-011: Sprint 15 Onboarding Focus
**Date**: February 27, 2026
**Type**: SCOPE
**Status**: ACTIVE

**Decision**: Sprint 15 focuses on Seamless Client Onboarding (45 pts) with 4 epics.

**Context**:
- Consultant → Client onboarding takes >10 minutes
- Assessment completion rate only 60%
- Team invitation rate only 20%

**Rationale**:
1. Onboarding is #1 barrier to adoption
2. Value delivery must be immediate
3. Consultant efficiency critical for scale

**Success Metrics**:
- Onboarding time: 10 min → <3 min
- Assessment completion: 60% → 85%
- First login within 48h: 40% → 70%

---

### DEC-2026-010: Navy/Gold Design System
**Date**: February 15, 2026
**Type**: STRATEGIC
**Status**: ACTIVE

**Decision**: Adopt Navy (#1a365d) / Gold (#d69e2e) as primary brand colors for iBrain visual identity.

**Context**:
- Need consistent visual language across platform
- iBrain AI features require distinctive styling
- Previous mixed color palette created confusion

**Rationale**:
1. Navy conveys trust and professionalism
2. Gold conveys intelligence and premium quality
3. High contrast for accessibility
4. Distinctive from competitors (blue/green dominant)

**Implementation**:
- S13: Cross-page consistency (Epic T)
- S14: iBrain Visual Identity (Epic I)

---

### DEC-2026-009: AIContextService Unification
**Date**: January 10, 2026
**Type**: TECHNICAL
**Status**: ACTIVE

**Decision**: Create unified AIContextService with buildContext() method for all AI interactions.

**Context**:
- AI features scattered across multiple files
- Inconsistent context passed to LLM
- Code duplication in ai-okr.js, planning.js, etc.

**Rationale**:
1. Single source of truth for AI context
2. Token budget management in one place
3. Context delta detection for personalization
4. Easier to add new AI features

**Technical Spec**:
```javascript
AIContextService.buildContext(companyId, {
  scope: 'okr' | 'weekly' | 'task' | 'full',
  focusObjectiveId: string,
  includeHistory: boolean
})
```

**Outcome**: Epic X (42 pts) completed in Sprint 13

---

### DEC-2026-008: 12-Block SSI Architecture
**Date**: January 6, 2026
**Type**: TECHNICAL
**Status**: ACTIVE

**Decision**: Implement 12-block SSI scoring mapped to 3 dimensions (Speed, Strength, Intelligence).

**Context**:
- Original SSI had only 3 aggregate scores
- AI couldn't identify specific weakness areas
- OKR recommendations too generic

**Rationale**:
1. Granular targeting for AI recommendations
2. Better diagnostic reports for users
3. Industry benchmark comparison at block level

**Block Structure**:
```
Speed (4 blocks): Execution, Agility, Responsiveness, Efficiency
Strength (4 blocks): Resilience, Stability, Resources, Culture
Intelligence (4 blocks): Learning, Innovation, Adaptation, Strategy
```

**Outcome**: Integrated into AIContextService and SSI diagnostic

---

### DEC-2026-007: Defer Epic N (Smart KR Calculator)
**Date**: February 15, 2026
**Type**: PRIORITY
**Status**: ACTIVE

**Decision**: Defer Smart KR Target Calculator from Sprint 14 to post-MVP.

**Context**:
- Epic N would calculate precise KR targets from baselines
- Requires industry benchmark data we don't have
- Current hardcoded targets (30%, 20%, 15%) functional

**Rationale**:
1. Onboarding more critical than precision
2. Can iterate on targets post-launch
3. Reduces Sprint 14 scope for iBrain focus

**Alternative**: Include in Sprint 17 after Analytics Dashboard

---

### DEC-2026-006: Sprint 14 = iBrain Identity
**Date**: February 11, 2026
**Type**: SCOPE
**Status**: ACTIVE

**Decision**: Sprint 14 (53 pts) focuses on iBrain Visual Identity and Growth Foundation.

**Epics**:
- Epic I: iBrain Visual Identity (15 pts)
- Epic M: Marketing & Onboarding (15 pts)
- Epic S: Dashboard Enhancement (8 pts)
- Epic D: Dashboard Intelligence (15 pts)

**Rationale**:
1. Differentiate from competitors with AI identity
2. Build marketing assets for launch
3. Polish dashboard for first impressions

---

### DEC-2026-005: Assessment Hub Consolidation
**Date**: February 3, 2026
**Type**: TECHNICAL
**Status**: ACTIVE

**Decision**: Create unified Assessment Hub with role-adaptive tabs.

**Context**:
- Assessment pages scattered (assessment-hub.html, team-ssi-view.html, etc.)
- Consultants needed "My Clients" view
- Business owners needed "My Assessments" view

**Implementation** (Epic U5):
- Single Assessment Hub page
- Role-based tab visibility
- Drill-down from clients to assessments

**Outcome**: 14 pts delivered in Sprint 11

---

## 2025 Decisions

### DEC-2025-015: Graceful Degradation Pattern
**Date**: November 26, 2025
**Type**: TECHNICAL
**Status**: ACTIVE

**Decision**: All optional services (OpenAI, Redis, Email) must work when disabled.

**Context**:
- Development environment shouldn't require all services
- Production should gracefully handle service failures
- Feature flags needed for premium features

**Implementation**:
```javascript
// server/services/feature-flags.js
FEATURE_OPENAI_ENABLED: false → fallback templates
FEATURE_REDIS_ENABLED: false → no caching
FEATURE_EMAIL_ENABLED: false → skip email send
```

---

### DEC-2025-014: One-Time OKR Generation
**Date**: November 23, 2025
**Type**: SCOPE
**Status**: ACTIVE

**Decision**: OKR generation can only happen once per company (okr_generation.generated flag).

**Context**:
- Multiple OKR generations created chaos
- Objectives duplicated with slight variations
- Users confused by multiple sets

**Implementation**:
- Company.okr_generation.generated = true after first generation
- Button shows "Already Generated" state
- Redirects to objectives page

---

### DEC-2025-013: Fiscal Year Support
**Date**: November 23, 2025
**Type**: TECHNICAL
**Status**: ACTIVE

**Decision**: Support calendar_year, fiscal_year (April/July/October), and custom periods.

**Context**:
- Not all companies use Jan-Dec fiscal year
- Custom objective periods needed (e.g., 18-month goals)
- Quarter calculations must respect fiscal boundaries

**Implementation**:
- DateService.js handles all date calculations
- Objective model stores period_type and fiscal_start
- Goals cascade dates from parent objective

---

### DEC-2025-012: Multi-Tenant Isolation
**Date**: November 21, 2025
**Type**: TECHNICAL
**Status**: ACTIVE

**Decision**: All data queries MUST filter by company_id from authenticated user.

**Context**:
- B2B SaaS requires strict data isolation
- Security audit requirement
- Prevent cross-company data leaks

**Implementation**:
- Middleware validates company_id on all routes
- Models include company_id in all schemas
- Frontend stores karvia_user with company context

---

### DEC-2025-011: Soft Delete Pattern
**Date**: November 21, 2025
**Type**: TECHNICAL
**Status**: ACTIVE

**Decision**: Never hard delete goals/objectives - use status='cancelled'.

**Context**:
- Audit trail required for compliance
- Users may want to restore deleted items
- Historical reporting needs complete data

**Implementation**:
- Goal.status enum includes 'cancelled'
- DELETE endpoints set status, don't remove
- UI filters out cancelled by default

---

## Decision Template

```markdown
### DEC-YYYY-XXX: [Title]
**Date**: [Date]
**Type**: STRATEGIC | TECHNICAL | SCOPE | PRIORITY | PROCESS
**Status**: ACTIVE | SUPERSEDED | REVERSED | PENDING

**Decision**: [One sentence summary]

**Context**:
- [Background point 1]
- [Background point 2]

**Rationale**:
1. [Reason 1]
2. [Reason 2]

**Alternatives Considered**:
- [Alternative 1] (rejected: [reason])

**Impact**:
- [Impact point 1]
- [Impact point 2]

**Outcome**: [Results if known]
```

---

**Document Owner**: Product Team
**Review Cadence**: As decisions are made
**Archive Policy**: Superseded decisions move to archive section annually
