# Karvia Sprint Roadmap V2

**Created**: January 27, 2026
**Last Updated**: January 27, 2026 (V2 — Page-Paired Restructure)
**Replaces**: All previous roadmap versions
**Strategy**: 2 page redesigns per sprint, all related functionality ships with its page
**Target Sprint Size**: ~50-60 pts (balanced)

---

## Overview

```
COMPLETED                                          REMAINING
═══════════════════════════════════════════        ══════════════════════════════════════
Sprint 1-3:  Foundation + OKR Core         ✅      Sprint 11:  59 pts  ⏳ NEXT
Sprint 4-5:  Planning + Enhancement        ✅      Sprint 12:  53 pts  📋 PLANNED
Sprint 6:    Bug Fixes + SSI Diagnostic    ✅      Sprint 13:  58 pts  📋 PLANNED
Sprint 7:    OKR Management UI             ✅      Sprint 14:  23 pts  📋 LLM QUALITY
Sprint 8:    Planning + User Feedback      ✅      ─────────────────────────────────
Sprint 9:    Assessment Flow Redesign      ✅      Total:     193 pts remaining
Sprint 10:   Config + Reports + Profile    ✅
```

---

## Sprint Timeline

```
╔═════════════════════════════════════════════════════════════════════════════════╗
║                     PAGE-PAIRED SPRINT ROADMAP (V2)                           ║
╠═════════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  SPRINT 10 ✅ COMPLETE (71 pts)                                              ║
║  Config + Reports + Profile (Epic S, R, K)                                   ║
║                                                                               ║
║  SPRINT 11 (59 pts) — ASSESSMENT PAGES                                       ║
║  ═══════════════════════════════════════                                      ║
║  Pages: Assessment Hub + Question Library + Teams                            ║
║  ┌─────────────┐┌──────────┐┌──────────┐┌──────┐┌────┐┌────┐┌────────┐      ║
║  │ J: Flow (28)││QA: Qual  ││U3: QLib  ││U5:Hub││U4: ││Q1:2││Q2:3    │      ║
║  │ Assessment  ││ (13)     ││ (5)      ││ (2)  ││(4) ││Auth││Valid   │      ║
║  │ Improvements││ Modular  ││ Page     ││Page  ││Team││Fix ││ation  │      ║
║  │             ││ Questions││ Redesign ││Redes.││Rds.││    ││       │      ║
║  └─────────────┘└──────────┘└──────────┘└──────┘└────┘└────┘└────────┘      ║
║  + Quickfix (2)                                                              ║
║                                                                               ║
║  SPRINT 12 (53 pts) — DAILY WORKFLOW PAGES                                   ║
║  ══════════════════════════════════════════                                   ║
║  Pages: Dashboard + Planning                                                 ║
║  ┌──────────────────────┐┌────────────────┐┌───────────────┐┌─────────┐      ║
║  │ L: Planning Page (25)││M-Ph1: OKR      ││P: Observer/   ││U1: Dash │      ║
║  │ Two-panel layout     ││Wizard (13)     ││Tracking (9)   ││(6)      │      ║
║  │ Week cards + tasks   ││Weekly gen +    ││Complete/Post/ ││Page     │      ║
║  │ AI generation        ││Task gen        ││Assign tasks   ││Redesign │      ║
║  └──────────────────────┘└────────────────┘└───────────────┘└─────────┘      ║
║                                                                               ║
║  SPRINT 13 (58 pts) — STRATEGY PAGES + BRANDING                             ║
║  ═════════════════════════════════════════════                                ║
║  Pages: Objectives + SSI Report                                              ║
║  ┌───────────────────┐┌─────────────────┐┌──────┐┌──────┐┌────┐┌────┐       ║
║  │ N: Advanced OKR   ││O: SSI Intel     ││U2:Obj││V:SSI ││R:  ││T:  │       ║
║  │ Features (21)     ││Enhancements (18)││(5)   ││Rpt(6)││(3) ││(5) │       ║
║  │ Creation wizard   ││Team/Company SSI ││Page  ││Page  ││Brnd││Dsgn│       ║
║  │ KR mgmt, archive  ││PDF export       ││Redes.││Redes.││Swap││Sys │       ║
║  └───────────────────┘└─────────────────┘└──────┘└──────┘└────┘└────┘       ║
║                                                                               ║
║  SPRINT 14 (23 pts) — LLM QUALITY                                           ║
║  ═════════════════════════════════════                                        ║
║  ┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌─────┐                          ║
║  │Q3:3││Q4:3││Q5:3││Q6:2││Q7:3││Q8:3││Q9:3││Q11:3│                          ║
║  │Prmp││Tone││Ind.││Cash││Hall││Tokn││Fall││Strm │                          ║
║  │Eng ││Cal ││Tmpl││    ││Grd ││Opt ││back││    │                          ║
║  └────┘└────┘└────┘└────┘└────┘└────┘└────┘└─────┘                          ║
║                                                                               ║
╚═════════════════════════════════════════════════════════════════════════════════╝
```

---

## Page-to-Sprint Mapping

| Page | Sprint | Related Epics | Points |
|------|--------|--------------|--------|
| Assessment Hub | 11 | U5, QA, J | 43 |
| Question Library | 11 | U3, QA | 18 |
| Teams | 11 | U4 | 4 |
| Dashboard | 12 | U1, P | 15 |
| Planning | 12 | L, M-Ph1 | 38 |
| Objectives | 13 | U2, N | 26 |
| SSI Report | 13 | V, O | 24 |
| All Pages | 13 | R, T | 8 |

---

## Sprint Details

### Sprint 11: Assessment Pages (59 pts)

| Epic | Pts | Description |
|------|-----|-------------|
| J | 28 | Assessment flow — 3-step wizard, templates, audience config, sent-by-me |
| QA | 13 | Assessment quality — modular questions (Core/Industry/Role), weights |
| U3 | 5 | Question Library page redesign (two-panel, dimension tree) |
| U4 | 4 | Teams page redesign (S13 layout, stats, detail panel) |
| U5 | 2 | Assessment Hub page redesign (4-tab, KPIs, dynamic) |
| Q1 | 2 | Auth token standardization (CRITICAL) |
| Q2 | 3 | Input validation hardening |
| Quickfix | 2 | Bug fixes |

**Key deliverable**: `s13-patterns.css` (shared design system for all future sprints)

### Sprint 12: Daily Workflow Pages (53 pts)

| Epic | Pts | Description |
|------|-----|-------------|
| L | 25 | Planning page redesign — two-panel, week cards, AI generation |
| M-Ph1 | 13 | OKR Wizard Phase 1 — weekly goal + task generation |
| P | 9 | Observer/tracking — task complete/postpone/assign with cascade |
| U1 | 6 | Dashboard page redesign — 3-column tasks, objective cards |

**Key deliverable**: Task action system (complete → cascade progress up)

### Sprint 13: Strategy Pages + Branding (58 pts)

| Epic | Pts | Description |
|------|-----|-------------|
| N | 21 | Advanced OKR — creation wizard, KR management, auto-status |
| O | 18 | SSI Intelligence — team/company aggregation, comparison, PDF |
| V | 6 | SSI Report page redesign |
| U2 | 5 | Objectives page redesign — grid, category coverage, KR items |
| T | 5 | Design system finalization — cross-page consistency audit |
| R | 3 | Chief AI branding swap across all pages |

**Key deliverable**: All 6 pages redesigned, brand complete

### Sprint 14: LLM Quality (23 pts)

| Epic | Pts | Description |
|------|-----|-------------|
| Q3 | 3 | OKR prompt engineering |
| Q4 | 3 | SSI narrative tone calibration |
| Q5 | 3 | Industry-specific prompt templates |
| Q6 | 2 | Response caching (24hr TTL) |
| Q7 | 3 | Hallucination guardrails |
| Q8 | 3 | Token usage optimization |
| Q9 | 3 | Fallback narrative quality |
| Q11 | 3 | LLM response streaming (SSE) |

---

## Epic Registry (All Sprints)

| Epic | Sprint | Points | Status | Description |
|------|--------|--------|--------|-------------|
| A | 1 | — | ✅ | Foundation setup |
| B | 2 | — | ✅ | OKR core models |
| C | 3 | — | ✅ | OKR generation |
| D | 4-5 | 35 | ✅ | Dashboard task management |
| E | 6 | 20 | ✅ | SSI diagnostic reporting |
| F | 8 | 8 | ✅ | Continue planning |
| G | 8 | 23 | ✅ | User feedback system |
| H | 9 | 42 | ✅ | Assessment creation flow |
| I | 10 | 45 | ✅ | SSI Intelligence (Phase 1 + 2) |
| J | 11 | 28 | ⏳ | Assessment flow improvements |
| K | 10 | 33 | ✅ | Company profile redesign |
| L | 12 | 25 | 📋 | Planning page redesign |
| M-Ph1 | 12 | 13 | 📋 | OKR Wizard Phase 1 |
| N | 13 | 21 | 📋 | Advanced OKR features |
| O | 13 | 18 | 📋 | SSI Intelligence enhancements |
| P | 12 | 9 | 📋 | Observer/tracking improvements |
| Q1 | 11 | 2 | ⏳ | Auth token standardization |
| Q2 | 11 | 3 | ⏳ | Input validation hardening |
| Q3-Q9,Q11 | 14 | 23 | 📋 | LLM quality improvements |
| QA | 11 | 13 | ⏳ | Assessment quality (modular questions) |
| R | 13 | 3 | 📋 | Chief AI branding |
| S | 10 | 16 | ✅ | Configuration page |
| T | 13 | 5 | 📋 | Design system finalization |
| U1 | 12 | 6 | 📋 | Dashboard page redesign |
| U2 | 13 | 5 | 📋 | Objectives page redesign |
| U3 | 11 | 5 | ⏳ | Question Library page redesign |
| U4 | 11 | 4 | ⏳ | Teams page redesign |
| U5 | 11 | 2 | ⏳ | Assessment Hub page redesign |
| V | 13 | 6 | 📋 | SSI Report page redesign |

---

## Capacity Summary

| Sprint | Points | Balance | Theme |
|--------|--------|---------|-------|
| Sprint 11 | 59 | Balanced | Assessment Pages |
| Sprint 12 | 53 | Balanced | Daily Workflow Pages |
| Sprint 13 | 58 | Balanced | Strategy Pages + Branding |
| Sprint 14 | 23 | Light | LLM Quality Polish |
| **Total** | **193** | | |

Previous distribution: 90 / 72 / 8 (very imbalanced)
New distribution: 59 / 53 / 58 / 23 (balanced)

---

## Architecture Decisions

### 1. Shared Design System (`s13-patterns.css`)
Created in Sprint 11, reused in 12 and 13. Contains CSS variables for colors, spacing, radii. No page-specific styles.

### 2. Zero Hardcoding Policy
Every sprint plan documents API data sources for every UI element. All KPIs, cards, lists, progress bars, avatars, dates, and statuses come from API calls or computed from API data.

### 3. Maximum Code Reuse
Architectural review (Jan 27) identified 10+ existing shared modules. Sprint plans explicitly list what to REUSE and what NOT to create.

### 4. Standard Page Template
All 6 redesigned pages follow identical structure: nav (NavigationManager) → content (dynamic) → scripts (auth-check → common → navigation → api-client → controller).

### 5. Graceful Degradation
All AI/LLM features check `FEATURE_OPENAI_ENABLED` flag. When disabled: generate buttons disabled, manual entry available, fallback text shown.

---

## Key Decision Log

| Decision | Date | Rationale |
|----------|------|-----------|
| 2 pages per sprint | Jan 27 | Ensures related functionality ships with its page |
| Assessment first (Sprint 11) | Jan 27 | Assessment Hub + Question Library are most interconnected |
| Q1 auth fix in Sprint 11 | Jan 27 | Critical security fix ships first, not in Sprint 12+ |
| Sprint 14 for LLM quality | Jan 27 | Non-blocking quality items, all features work without them |
| s13-patterns.css in Sprint 11 | Jan 27 | Foundation for all future page redesigns |
| Branding last (Sprint 13) | Jan 27 | Structure first, cosmetic last — no rework |

---

## Master Plan Documents

| Sprint | Plan Document |
|--------|--------------|
| Sprint 11 | `SPRINT-11 (Planned)/SPRINT-11-MASTER-PLAN-V2.md` |
| Sprint 12 | `SPRINT-12 (Planned)/SPRINT-12-MASTER-PLAN-V2.md` |
| Sprint 13 | `SPRINT-13 (Planned)/SPRINT-13-MASTER-PLAN-V2.md` |
| Sprint 14 | `SPRINT-14 (Planned)/SPRINT-14-MASTER-PLAN.md` |

---

*Document Version: V2 — Page-Paired Restructure*
*Last Updated: January 27, 2026*
