# User Stories Index

---

**Document**: USER_STORIES_INDEX.md
**Version**: 1.0.0
**Last Updated**: 2026-01-10
**Audit Date**: 2026-01-10
**Source**: Codebase analysis + Sprint 9 Handoff

---

## Overview

This index provides a consolidated view of all user stories across personas. Stories are organized by persona in individual files for easier management and persona-specific planning.

---

## Persona Files

| Persona | File | Total Stories | Complete | Partial | Not Started |
|---------|------|---------------|----------|---------|-------------|
| Employee | [PERSONA_EMP_STORIES.md](PERSONA_EMP_STORIES.md) | 18 | 4 | 5 | 9 |
| Manager | [PERSONA_MGR_STORIES.md](PERSONA_MGR_STORIES.md) | 28 | 12 | 8 | 8 |
| Executive | [PERSONA_EXEC_STORIES.md](PERSONA_EXEC_STORIES.md) | 22 | 14 | 5 | 3 |
| Consultant | [PERSONA_CONS_STORIES.md](PERSONA_CONS_STORIES.md) | 18 | 10 | 5 | 3 |
| Admin/Owner | [PERSONA_ADMIN_STORIES.md](PERSONA_ADMIN_STORIES.md) | 16 | 10 | 4 | 2 |

## Cross-Cutting Stories (Added Feb 2026)

| Category | File | Total Stories | Status |
|----------|------|---------------|--------|
| AI Context | [AI_CONTEXT_STORIES.md](AI_CONTEXT_STORIES.md) | 8 | Sprint 13 Planned |

**Note**: AI Context stories capture the user-facing value of the Unified LLM Context Service (Epic X). See also:
- [CROSS_PAGE_AI_CONTEXT_FLOW.md](../user-journeys/CROSS_PAGE_AI_CONTEXT_FLOW.md) - Visual journey flow
- [SPRINT-13-AUDIT-FRAMEWORK.md](../../3-DELIVERY/1-SPRINTS/SPRINT-13%20(Planned)/SPRINT-13-AUDIT-FRAMEWORK.md) - Validation framework

---

## Consolidated Statistics

### Overall Progress

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Stories** | 102 | 100% |
| **Complete** | 50 | 49% |
| **Partial** | 27 | 26% |
| **Not Started** | 25 | 25% |

### By Category

```
Complete:     ████████████████████░░░░░░░░░░░░░░░░░░░░  49%
Partial:      ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  26%
Not Started:  ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  25%
```

---

## Feature Area Coverage

### Fully Complete Areas

| Area | Stories | Evidence |
|------|---------|----------|
| **Assessment System** | 15+ | 17 API endpoints, 11 client pages, SSI scoring |
| **Objectives/OKR** | 12+ | Full CRUD, fiscal year support, AI generation |
| **Teams/Users** | 10+ | Hierarchy, roles, invitations |
| **Dashboards** | 8+ | 6 dashboard pages, 25+ endpoints |
| **Company Profile** | 6+ | Full management, fiscal configuration |

### Partially Complete Areas

| Area | Complete | Gaps |
|------|----------|------|
| **Goals (Quarterly/Weekly)** | Backend | Frontend pages incomplete |
| **Planning** | Basic | Full calendar view, weekly breakdown |
| **Notifications** | Backend | UI preferences missing |
| **Bulk Operations** | Code exists | Feature flag not enabled |
| **SSI Weights** | Override exists | Configuration UI (Sprint 10) |

### Not Started Areas

| Area | Sprint Target | Notes |
|------|---------------|-------|
| Intervention Alerts | Sprint 11+ | Manager at-risk notifications |
| Capacity Planning | Future | Resource allocation |
| Board Reporting | Future | Executive briefings |
| Audit Logs | Future | Security features |
| Billing | Future | Subscription management |

---

## Sprint Alignment

### Sprint 10 (Planned)
- ADMIN-013, CONS-013: SSI Weight Configuration (Epic S)
- Planning Features: Quarterly/Weekly breakdown

### Sprint 11 (Planned)
- MGR-021, MGR-022, MGR-024: Planning redesign
- CONS-007: Industry benchmarks

### Sprint 12 (Planned)
- Advanced reporting features
- Enhanced export options

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [BLOCK_DEPENDENCIES.md](BLOCK_DEPENDENCIES.md) | Data flow between feature blocks |
| [PRODUCT_ARCHITECTURE.md](../PRODUCT_ARCHITECTURE.md) | System architecture |
| Sprint Handoffs | Implementation verification |

---

## Audit Notes

### What Was Verified
1. **Codebase Analysis**: Examined server routes, models, services, and client pages
2. **Sprint Handoffs**: Reviewed Sprint 3-9 completion records
3. **API Endpoints**: Counted and verified functional endpoints
4. **Frontend Pages**: Verified UI implementation status

### Methodology
- Stories marked "Complete" have both backend and frontend functional
- Stories marked "Partial" have backend or infrastructure but incomplete UI
- Stories marked "Not Started" have no implementation evidence

### Key Findings
- Many stories previously marked incomplete are actually done
- Assessment system is more complete than documented
- Goals frontend is the largest gap in core functionality
- Planning features need Sprint 11 attention

---

## Story ID Prefixes

| Prefix | Persona | Range |
|--------|---------|-------|
| EMP- | Employee | EMP-001 to EMP-018 |
| MGR- | Manager | MGR-001 to MGR-027 |
| EXEC- | Executive | EXEC-001 to EXEC-022 |
| CONS- | Consultant | CONS-001 to CONS-018 |
| ADMIN- | Admin/Owner | ADMIN-001 to ADMIN-016 |

---

**Maintained By**: Product Team
**Review Cycle**: Each sprint retrospective
**Last Audit**: 2026-01-10

