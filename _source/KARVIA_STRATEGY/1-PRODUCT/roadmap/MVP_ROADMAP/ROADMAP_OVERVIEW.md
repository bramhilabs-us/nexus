# Karvia Product Roadmap Overview

**Version**: 1.0
**Last Updated**: March 4, 2026
**Status**: Active
**Next Review**: April 2026

---

## Executive Summary

Karvia is building the **go-to OKR platform for SMBs** with AI-powered insights. This roadmap outlines our journey from MVP to market leadership across 5 phases over 2 years.

---

## Current Position

| Metric | Value |
|--------|-------|
| **Overall Progress** | 90% MVP Complete |
| **Story Points Delivered** | 602+ |
| **Sprints Completed** | 13 |
| **Active Sprint** | Sprint 15 (In Progress) |
| **Target Launch** | Q1 2026 |

---

## Roadmap Phases

### Phase 1: Foundation (Q4 2025) - COMPLETE
**Focus**: Core platform infrastructure

| Milestone | Status | Sprints |
|-----------|--------|---------|
| Authentication & RBAC | DONE | S1 |
| Assessment Engine | DONE | S2 |
| OKR Management | DONE | S3-S4 |
| Team Management | DONE | S5-S6 |
| Basic Analytics | DONE | S7 |

**Key Outcomes**:
- 6-tier role hierarchy (Consultant to Employee)
- SSI Assessment framework (Speed, Strength, Intelligence)
- AI-powered OKR generation from assessments
- Multi-tenant architecture

---

### Phase 2: Intelligence (Q1 2026) - IN PROGRESS
**Focus**: AI-powered features and user experience

| Milestone | Status | Sprints |
|-----------|--------|---------|
| AI Context Service | DONE | S10 |
| Assessment Hub | DONE | S11 |
| Dashboard V2 | DONE | S12 |
| Planning V2 | DONE | S12 |
| OKR Wizard Phase 1 | DONE | S12 |
| Unified LLM Context | DONE | S13 |
| SSI Report Redesign | DONE | S13 |
| iBrain Visual Identity | PLANNED | S14 |
| Seamless Onboarding | DONE | S15 |
| LLM Context Intelligence | IN PROGRESS | S15-A |
| Task Email Notifications | IN PROGRESS | S15-A |
| Documentation Infrastructure | PLANNED | S16-D |

**Key Outcomes**:
- AIContextService with buildContext() for all AI features
- 12-block SSI scoring with dimension mapping
- Context delta detection for personalized AI
- Navy/Gold design system standardization

---

### Phase 3: Growth (Q2 2026) - PLANNED
**Focus**: User acquisition and retention features

| Milestone | Target Sprint |
|-----------|---------------|
| OKR Wizard Phase 2-3 (Cascade) | S16 |
| Configuration Page | S16 |
| Analytics Dashboard | S17 |
| Goal Templates Library | S17 |
| Collaboration Features | S18 |

**Success Metrics**:
- 50 active teams
- <7 days time to value
- 60% weekly active rate

---

### Phase 4: Scale (Q3-Q4 2026) - PLANNED
**Focus**: Enterprise features and integrations

| Milestone | Target |
|-----------|--------|
| Public API & Webhooks | Q3 |
| Slack/Teams Integration | Q3 |
| Mobile PWA | Q3 |
| Import/Export | Q3 |
| Custom Report Builder | Q4 |
| White-label Capability | Q4 |

**Success Metrics**:
- 500 active teams
- $200K MRR
- >60 NPS score

---

### Phase 5: Platform (2027) - VISION
**Focus**: Ecosystem and market leadership

| Milestone | Target |
|-----------|--------|
| Marketplace for Templates | Q1 |
| Consultant Portal | Q1 |
| Industry Benchmarks | Q2 |
| SSO/SAML | Q2 |
| Advanced Security (SOC2) | Q3 |
| Peer Learning Network | Q4 |

**Success Metrics**:
- 10,000 active customers
- $24M ARR
- Market leader in SMB segment

---

## Sprint Roadmap (Next 6 Sprints)

```
Sprint 15-A (Mar 2026)   Sprint 16-D (Mar 2026)   Sprint 16 (Apr 2026)
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ LLM Context +   │      │ Documentation   │      │ Tech Debt &     │
│ Task Emails     │      │ Infrastructure  │      │ Stabilization   │
│ 85 pts          │      │ 81 pts          │      │ 55 pts          │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
Sprint 17 (Apr 2026)     Sprint 18 (May 2026)     Sprint 19 (May 2026)
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ OKR Wizard      │ ──── │ Analytics       │ ──── │ Integrations    │
│ Phase 2-3       │      │ Dashboard       │      │ Foundation      │
│ 35 pts          │      │ 30 pts          │      │ 25 pts          │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

## Key Metrics Dashboard

### Development Velocity
| Metric | Value |
|--------|-------|
| Avg Points/Sprint | 46 |
| Sprint Duration | 2 weeks |
| Bug Rate | <5% |
| Test Coverage | 95%+ |

### Product Health
| Metric | Current | Target |
|--------|---------|--------|
| Feature Completion | 90% | 100% |
| Backend Complete | 95% | 100% |
| Frontend Complete | 85% | 100% |
| Mobile Ready | 60% | 100% |

---

## Strategic Decisions Log

See [ROADMAP_DECISIONS.md](./ROADMAP_DECISIONS.md) for the full decision log.

### Recent Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| Mar 2026 | Sprint 16-D = Documentation Infrastructure | Create living doc system with README hierarchy, metadata, and registry |
| Mar 2026 | Sprint 15-A = LLM Context + Emails | Fix AI context bug, add task notifications |
| Mar 2026 | Sprint 16 = Tech Debt | Stabilize before scaling |
| Feb 2026 | Defer Epic N (Smart KRs) | Focus on onboarding first |
| Feb 2026 | Navy/Gold design system | iBrain visual identity |
| Jan 2026 | AIContextService unification | Foundation for all AI |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Sprint 14 blocking Sprint 15 | HIGH | UI blocked | Backend-first approach |
| Email deliverability | MEDIUM | User acquisition | SPF/DKIM verification |
| Technical debt accumulation | MEDIUM | Velocity slowdown | Sprint 16 dedicated |
| Feature creep | LOW | Launch delay | Strict MoSCoW |

---

## How to Use This Roadmap

1. **For Strategic Planning**: Reference phases and milestones
2. **For Sprint Planning**: Use sprint roadmap section
3. **For Decision Making**: Check decisions log
4. **For Stakeholder Updates**: Use executive summary

---

## Visual Roadmap

**Interactive visualization available at**: [PRODUCT_ROADMAP.html](./PRODUCT_ROADMAP.html)

Open in browser to see:
- Timeline view with phases
- Sprint details on hover
- Progress indicators
- Feature status legend

---

## Related Documents

- [PRODUCT_VISION.md](../PRODUCT_VISION.md) - Long-term vision
- [FEATURE_CATALOG.md](../FEATURE_CATALOG.md) - Feature inventory
- [MASTER_PRODUCT_BACKLOG.md](../product_backlog/MASTER_PRODUCT_BACKLOG.md) - Prioritized backlog
- [SPRINT_ROADMAP_V3.md](../../3-DELIVERY/1-SPRINTS/SPRINT_ROADMAP_V3.md) - Sprint details

---

**Document Owner**: Product Team
**Review Cadence**: Monthly
**Next Review**: April 2026
