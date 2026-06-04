# Karvia Sprint Roadmap V3

**Created**: February 23, 2026
**Last Updated**: February 23, 2026
**Replaces**: SPRINT_ROADMAP_V2.md (January 27, 2026)
**Strategy**: iBrain-first branding, then feature expansion
**Target Sprint Size**: ~50-60 pts (balanced)

---

## Executive Summary

**Current Status**: Sprint 13 COMPLETE (Feb 22, 2026)
**Total Delivered**: 602 story points across 13 sprints
**Next Up**: Sprint 14 - iBrain Visual Identity (53 pts)
**Target Launch**: H1 2026

### What Changed Since V2

| Change | Old (V2) | New (V3) |
|--------|----------|----------|
| Sprint 13 | 58 pts planned | 72 pts COMPLETE |
| Sprint 14 | LLM Quality (23 pts) | iBrain Visual Identity (53 pts) |
| Q-series epics | Sprint 14 | Superseded by Epic X; remnants to Sprint 15 |
| Epic X | Not planned | Added to Sprint 13 (42 pts) - COMPLETE |

---

## Overview

```
COMPLETED (602 pts)                              REMAINING (~180 pts)
═══════════════════════════════════════════      ══════════════════════════════════════
Sprint 1-3:   Foundation + OKR Core       ✅      Sprint 14:  53 pts  → IN PLANNING
Sprint 4-5:   Planning + Enhancement      ✅      Sprint 15:  55 pts  → ESTIMATED
Sprint 6-7:   Bug Fixes + OKR Management  ✅      Sprint 16:  45 pts  → ESTIMATED
Sprint 8:     Planning + User Feedback    ✅      Sprint 17:  30 pts  → ESTIMATED
Sprint 9:     Assessment Flow Redesign    ✅      ─────────────────────────────────
Sprint 10:    Config + Reports + Profile  ✅      Total:     ~183 pts remaining
Sprint 11:    Assessment Hub + Wizard     ✅
Sprint 12:    Dashboard + Planning V2     ✅      Target: All core features by S17
Sprint 13:    iBrain Foundation (Epic X)  ✅
```

---

## Sprint Timeline

```
╔═════════════════════════════════════════════════════════════════════════════════╗
║                     iBrain-FIRST SPRINT ROADMAP (V3)                           ║
╠═════════════════════════════════════════════════════════════════════════════════╣
║                                                                                 ║
║  SPRINT 13 ✅ COMPLETE (72 pts) — February 20-22, 2026                         ║
║  ════════════════════════════════════════════════                               ║
║  Theme: Unified LLM Context Service + UI Redesigns                              ║
║  ┌───────────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐           ║
║  │ X: LLM Context││U2: Obj ││V: SSI  ││O: Intel││T: Dsgn ││BF: Fix │           ║
║  │   (42 pts)    ││ (5 pts)││ (6 pts)││(12 pts)││ (5 pts)││ (2 pts)│           ║
║  │ AIContext.js  ││Page S13││Page S13││Charts  ││ System ││ P0 bugs│           ║
║  │ buildContext()││Redesign││Redesign││PDF Exp ││ Final  ││        │           ║
║  └───────────────┘└────────┘└────────┘└────────┘└────────┘└────────┘           ║
║                                                                                 ║
║  SPRINT 14 (53 pts) — iBRAIN VISUAL IDENTITY                                    ║
║  ═══════════════════════════════════════════                                    ║
║  Theme: Brand all AI touchpoints + Dashboard intelligence                       ║
║  ┌───────────────┐┌────────────────┐┌────────────────┐┌─────────────┐          ║
║  │ I: Visual ID  ││ M: Marketing   ││ S: Dashboard   ││ D: Dash AI  │          ║
║  │   (15 pts)    ││    (15 pts)    ││   (8 pts)      ││  (15 pts)   │          ║
║  │ Navy buttons  ││ Onboarding     ││ Signals header ││ Task suggest│          ║
║  │ Retrofit all  ││ Feature page   ││ iBrain footer  ││ KR focus    │          ║
║  └───────────────┘└────────────────┘└────────────────┘└─────────────┘          ║
║                                                                                 ║
║  SPRINT 15 (55 pts) — OKR WIZARD + INTEGRATIONS                                ║
║  ═════════════════════════════════════════════                                  ║
║  Theme: Complete OKR automation + LLM polish                                    ║
║  ┌───────────────┐┌────────────────┐┌────────────────┐┌─────────────┐          ║
║  │ M-Ph2: Wizard ││ Q5: Industry   ││ Q6: Caching    ││ Q11: Stream │          ║
║  │   (32 pts)    ││ Templates (5)  ││   (5 pts)      ││  (5 pts)    │          ║
║  │ Cascade mode  ││ Sector prompts ││ Redis TTL      ││ SSE support │          ║
║  │ Gap-filling   ││ Tone presets   ││ 24hr expiry    ││ Real-time   │          ║
║  └───────────────┘└────────────────┘└────────────────┘└─────────────┘          ║
║  + Q10: Edge case hardening (8 pts)                                            ║
║                                                                                 ║
║  SPRINT 16 (45 pts) — ANALYTICS + CONFIGURATION                                ║
║  ═════════════════════════════════════════════                                  ║
║  Theme: Executive reporting + Admin controls                                    ║
║  ┌───────────────┐┌────────────────┐                                           ║
║  │ Analytics     ││ Config Page    │                                           ║
║  │   (30 pts)    ││   (15 pts)     │                                           ║
║  │ Company trends││ SSI weights    │                                           ║
║  │ Predictions   ││ Industry select│                                           ║
║  │ Exec reports  ││ White-label    │                                           ║
║  └───────────────┘└────────────────┘                                           ║
║                                                                                 ║
║  SPRINT 17 (30 pts) — COLLABORATION + POLISH                                   ║
║  ═══════════════════════════════════════════                                    ║
║  Theme: Team features + final polish                                            ║
║  ┌───────────────┐┌────────────────┐                                           ║
║  │ Collab        ││ Import/Export  │                                           ║
║  │   (25 pts)    ││   (5 pts)      │                                           ║
║  │ Comments      ││ CSV bulk       │                                           ║
║  │ @mentions     ││ Goal import    │                                           ║
║  └───────────────┘└────────────────┘                                           ║
║                                                                                 ║
╚═════════════════════════════════════════════════════════════════════════════════╝
```

---

## Completed Sprints Summary

| Sprint | Points | Status | Key Deliverables |
|--------|--------|--------|------------------|
| Sprint 1 | 45 | ✅ DONE | Core auth, basic dashboard |
| Sprint 2 | 55 | ✅ DONE | Assessment engine, SSI scoring |
| Sprint 3 | 71 | ✅ DONE | OKR generation control, weekly goals UI |
| Sprint 4 | 26 | ✅ DONE | Planning page, flexible objectives |
| Sprint 5 | 3 | ✅ DONE | Planning page integration |
| Sprint 6 | 39 | ✅ DONE | OKR Consolidation, SSI Diagnostic |
| Sprint 7 | 52 | ✅ DONE | Objective & KR Management UI |
| Sprint 8 | 31 | ✅ DONE | Continue Planning, User Feedback |
| Sprint 9 | 42 | ✅ DONE | Assessment Flow Redesign |
| Sprint 10 | 33 | ✅ DONE | Company Profile, AIContextService foundation |
| Sprint 11 | 80 | ✅ DONE | Assessment Hub, Question Library, Wizard |
| Sprint 12 | 53 | ✅ DONE | Dashboard V2, Planning V2, OKR Wizard Ph1 |
| Sprint 13 | 72 | ✅ DONE | Unified LLM Context, SSI Report, Objectives |
| **Total** | **602** | | |

---

## Sprint 14: iBrain Visual Identity & Growth (53 pts)

**Theme**: Brand all AI touchpoints + Dashboard intelligence
**Duration**: 2 weeks (TBD start date)
**Dependencies**: Sprint 13 complete ✅

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| I | 15 | P0 | Visual Identity System - navy buttons, tooltips, loading states |
| M | 15 | P1 | Marketing & Onboarding - feature page, guided setup |
| S | 8 | P0 | Dashboard Enhancement - signals header, iBrain footer |
| D | 15 | P2 | Dashboard Intelligence - task suggestions, KR focus |

**Key Deliverables**:
- All AI buttons use `.ibrain-button` class (navy gradient + lightning bolt)
- `/pages/ibrain-overview.html` feature explainer
- Dashboard signals header with objective status circles
- "iBrain suggests" footer bar on dashboard

**Detailed Plan**: [SPRINT-14-MASTER-PLAN.md](./SPRINT-14%20(Planned)/SPRINT-14-MASTER-PLAN.md)

---

## Sprint 15: OKR Wizard Phase 2-3 + LLM Polish (55 pts)

**Theme**: Complete OKR automation + remaining LLM quality items
**Duration**: 2 weeks

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| M-Ph2/3 | 32 | P0 | OKR Wizard Phases 2-3 - cascade mode, gap-filling, team objectives |
| Q5 | 5 | P1 | Industry-specific prompt templates |
| Q6 | 5 | P1 | Response caching with Redis (24hr TTL) |
| Q11 | 5 | P1 | LLM response streaming (SSE) |
| Q10 | 8 | P2 | Edge case hardening (timeout handling, retry logic) |

**Q-Series Reconciliation**:
The original Sprint 14 "LLM Quality" epics were partially addressed by Epic X in Sprint 13:
- ✅ Q3 (Prompt Engineering) → Addressed by X1-X4
- ✅ Q8 (Token Optimization) → Addressed by X2 buildContext()
- ✅ Q7 (Hallucination Guardrails) → Addressed by X6 rejection tracking
- ✅ Q9 (Fallback Quality) → Addressed by X8 template fallback
- 📋 Q5, Q6, Q11 → Moved to Sprint 15

---

## Sprint 16: Analytics & Configuration (45 pts)

**Theme**: Executive reporting + Admin controls
**Duration**: 2 weeks

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| Analytics | 30 | P0 | Company metrics, trends, predictions, exec reports |
| Config | 15 | P1 | SSI weights, industry presets, white-label |

**Key Deliverables**:
- `/pages/analytics.html` with trend charts, predictions
- `/pages/configuration.html` for company admins
- PDF executive reports with AI summaries
- White-label branding controls

---

## Sprint 17: Collaboration & Polish (30 pts)

**Theme**: Team features + final polish
**Duration**: 2 weeks

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| Collaboration | 25 | P0 | Comments, @mentions, activity feeds |
| Import/Export | 5 | P1 | CSV bulk operations for goals |

**Post-MVP Backlog** (H2 2026+):
- Goal Templates Library (15 pts)
- Slack/Teams Integration (20 pts)
- Mobile PWA (35 pts)
- Advanced reporting (15 pts)

---

## Epic Registry (All Sprints)

| Epic | Sprint | Points | Status | Description |
|------|--------|--------|--------|-------------|
| A-C | 1-3 | — | ✅ | Foundation + OKR core |
| D | 4-5 | 35 | ✅ | Dashboard task management |
| E | 6 | 20 | ✅ | SSI diagnostic reporting |
| F | 8 | 8 | ✅ | Continue planning |
| G | 8 | 23 | ✅ | User feedback system |
| H | 9 | 42 | ✅ | Assessment creation flow |
| I (S14) | 14 | 15 | 📋 | iBrain Visual Identity |
| J | 11 | 28 | ✅ | Assessment flow improvements |
| K | 10 | 33 | ✅ | Company profile redesign |
| L | 12 | 25 | ✅ | Planning page redesign |
| M-Ph1 | 12 | 13 | ✅ | OKR Wizard Phase 1 |
| M-Ph2/3 | 15 | 32 | 📋 | OKR Wizard Phases 2-3 |
| M (S14) | 14 | 15 | 📋 | Marketing & Onboarding |
| N | 13 | — | ⚠️ | Deferred (scope cut) |
| O | 13 | 12 | ✅ | SSI Intelligence enhancements |
| P | 12 | 9 | ✅ | Observer/tracking |
| Q1-Q2 | 11 | 5 | ✅ | Auth + validation fixes |
| Q5 | 15 | 5 | 📋 | Industry-specific templates |
| Q6 | 15 | 5 | 📋 | Response caching |
| Q10 | 15 | 8 | 📋 | Edge case hardening |
| Q11 | 15 | 5 | 📋 | LLM streaming |
| QA | 11 | 13 | ✅ | Modular questions |
| R | 13 | — | ⚠️ | Merged into Sprint 14 Epic I |
| S (S14) | 14 | 8 | 📋 | Dashboard Enhancement |
| T | 13 | 5 | ✅ | Design system finalization |
| U1-U5 | 11-13 | 22 | ✅ | UI standardization |
| V | 13 | 6 | ✅ | SSI Report redesign |
| X | 13 | 42 | ✅ | **Unified LLM Context Service** |
| D (S14) | 14 | 15 | 📋 | Dashboard Intelligence |
| BF | 13 | 2 | ✅ | Bug fixes |

---

## Velocity & Capacity

### Historical Velocity

| Sprint | Planned | Delivered | Velocity |
|--------|---------|-----------|----------|
| Sprint 11 | 59 | 80 | 135% |
| Sprint 12 | 53 | 53 | 100% |
| Sprint 13 | 72 | 72 | 100% |
| **Average** | **61** | **68** | **112%** |

### Projected Completion

| Sprint | Points | Cumulative | Expected Date |
|--------|--------|------------|---------------|
| Sprint 14 | 53 | 655 | Mar 2026 |
| Sprint 15 | 55 | 710 | Mar 2026 |
| Sprint 16 | 45 | 755 | Apr 2026 |
| Sprint 17 | 30 | 785 | Apr 2026 |

**MVP Target**: Sprint 17 completion (April 2026)
**All features delivered**: ~785 story points

---

## Architecture Decisions

### 1. iBrain Visual Identity (NEW - Sprint 14)
All AI-powered features use consistent navy gradient button with lightning bolt icon. Creates brand recognition and user trust.

### 2. Unified LLM Context (Sprint 13)
`AIContextService.buildContext()` provides 8K-token-optimized context for all AI operations. Supersedes individual context building in each feature.

### 3. Graceful Degradation
All AI/LLM features check `FEATURE_OPENAI_ENABLED` flag. When disabled: generate buttons disabled, manual entry available, fallback text shown.

### 4. Shared Design System (`s13-patterns.css`)
Created in Sprint 11, used in all subsequent sprints. Contains CSS variables for colors, spacing, radii.

### 5. Zero Hardcoding Policy
Every UI element comes from API data. No hardcoded values.

---

## Key Decision Log

| Decision | Date | Rationale |
|----------|------|-----------|
| Epic X added to S13 | Feb 17 | Critical foundation for all AI features |
| LLM Quality (Q3-Q11) superseded | Feb 20 | Epic X addressed most concerns; remnants to S15 |
| iBrain branding prioritized | Feb 22 | User recognition and trust before features |
| Epic N deferred | Feb 20 | Advanced OKR features not blocking MVP |
| Sprint 14 scope changed | Feb 22 | Visual identity + marketing > pure technical polish |

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Sprint 14 scope creep | High | Medium | Fixed 53 pts, P2 items cut if needed |
| iBrain branding inconsistent | Medium | Low | Comprehensive retrofit in I2 |
| Dashboard intelligence complexity | High | Medium | Start with simple suggestions |
| Analytics scope explosion | High | Medium | Define fixed metrics set |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sprint completion rate | >90% | Points delivered / planned |
| iBrain recognition | 80% | "What does navy button mean?" survey |
| AI feature adoption | +20% | Usage after visual identity launch |
| MVP feature completeness | 100% | All P0 epics complete by S17 |

---

## Related Documents

| Document | Path |
|----------|------|
| Sprint 14 Master Plan | `SPRINT-14 (Planned)/SPRINT-14-MASTER-PLAN.md` |
| Sprint 13 Handoff | `SPRINT-13 (Planned)/SPRINT13_HANDOFF_DOCUMENT.md` |
| Product Philosophy | `KARVIA_STRATEGY/1-PRODUCT/strategy/product_philosophy.md` |
| Master Backlog | `KARVIA_STRATEGY/1-PRODUCT/product_backlog/MASTER_PRODUCT_BACKLOG.md` |

---

*Document Version: V3 — iBrain-First Roadmap*
*Last Updated: February 23, 2026*
