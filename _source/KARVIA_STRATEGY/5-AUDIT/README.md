# 5-AUDIT: Verification Layer

<!-- @GENOME T2-NAV-005 | ACTIVE | 2026-04-01 | parent:T0-GOV-001 | auto:/audit | linked:/strategy -->

## Purpose

Verify that what we built aligns with what we set out to build. The final checkpoint in the product development lifecycle before cycling back to stakeholder input.

## Owner

**Primary**: Quality Lead
**Secondary**: All domain leads (for their respective audit types)

---

## Stakeholder Views

### CEO/Investor View
- **What matters**: Are we on track? Are risks managed?
- **Key artifacts**: Strategy audits, financial audits
- **Decisions informed**: Course corrections, investment priorities

### CPO View
- **What matters**: Does product match vision? Customer satisfaction?
- **Key artifacts**: Strategy audits, evidence from 4-CUSTOMER
- **Decisions informed**: Roadmap adjustments, feature priorities

### CTO/Architect View
- **What matters**: Architecture health, technical debt, security
- **Key artifacts**: Technical audits, security audits
- **Decisions informed**: Refactoring priorities, architecture evolution

### Senior Developer View
- **What matters**: Code quality trends, test coverage
- **Key artifacts**: Technical audits (code quality section)
- **Decisions informed**: Tech debt paydown, tooling improvements

### QA/Ops View
- **What matters**: Deployment stability, incident trends
- **Key artifacts**: Operations audits
- **Decisions informed**: Infrastructure improvements, process changes

---

## Subfolders

| Folder | Focus | Frequency | Owner |
|--------|-------|-----------|-------|
| [1-STRATEGY/](1-STRATEGY/) | Vision alignment, roadmap progress | Quarterly | CPO |
| [2-TECHNICAL/](2-TECHNICAL/) | Code quality, architecture health | Monthly | CTO |
| [3-OPERATIONS/](3-OPERATIONS/) | Uptime, deployment, performance | Weekly | DevOps |
| [4-COMPLIANCE/](4-COMPLIANCE/) | Regulatory, legal requirements | Quarterly | Legal |
| [5-SECURITY/](5-SECURITY/) | Vulnerabilities, access control | Monthly | Security |
| [6-FINANCIAL/](6-FINANCIAL/) | Costs, ROI, budget tracking | Quarterly | CFO |

---

## Inputs

| Source | Artifact | Frequency |
|--------|----------|-----------|
| 3-DELIVERY/1-SPRINTS/ | Sprint retrospectives | Per sprint |
| 3-DELIVERY/6-ISSUES/ | Bug trends | Weekly |
| 4-CUSTOMER/evidence/ | Beta evidence | Continuous |
| 4-CUSTOMER/metrics/ | Usage data | Weekly |

## Outputs

| Destination | Artifact | Frequency |
|-------------|----------|-----------|
| 0-STAKEHOLDERS/ | Executive summaries | Quarterly |
| 1-PRODUCT/ | Roadmap recommendations | Per audit |
| 2-TECHNICAL/ | Architecture recommendations | Per audit |

---

## Connections

```
                    ┌─────────────────┐
                    │ 0-STAKEHOLDERS  │ ◄── Executive reports
                    └────────▲────────┘
                             │
┌─────────────────┐          │          ┌─────────────────┐
│   1-PRODUCT     │◄─────────┼──────────│   4-CUSTOMER    │
└─────────────────┘          │          └────────┬────────┘
        ▲                    │                   │
        │            ┌───────┴───────┐           │
        │            │    5-AUDIT    │◄──────────┘
        │            │   (this)      │
        │            └───────┬───────┘
        │                    │
        └────────────────────┘
              Recommendations
```

---

## Lock Rules

| Condition | Lock Status | Authority |
|-----------|-------------|-----------|
| During sprint | UNLOCKED | Any contributor |
| During release | UNLOCKED | Quality Lead |
| Published audit | LOCKED (archive) | Quality Lead |

---

## Verification Checklist

- [ ] All audit subfolders have README
- [ ] Audit naming convention followed (YYYY_MM_DD_[TYPE]_AUDIT.md)
- [ ] Each audit has clear recommendations
- [ ] Recommendations tracked to resolution
- [ ] No audits older than 90 days without follow-up

---

## Naming Convention

Audit files should be named:
```
YYYY_MM_DD_[DESCRIPTION]_AUDIT.md
```

Example: `2026_04_01_DOCUMENTATION_ECOSYSTEM_STRATEGY_AUDIT.md`

---

## Migration Note

This folder consolidates the former flat `4-AUDIT/` structure. Content migrated:
- `4-AUDIT/1-INTERNAL/` → `4-AUDIT/1-STRATEGY/`
- `4-AUDIT/2-EXTERNAL/` → `4-AUDIT/2-TECHNICAL/`

**Migration Date**: 2026-04-01
