# Sprint 22: Beta_Final - Master Implementation Plan

<!-- @GENOME T3-SPR-022-MP | ACTIVE | 2026-04-29 | parent:T3-SPR-022 | auto:/coding,/strategy | linked:/design -->

**Sprint Duration**: 6 weeks (April 22 - June 6, 2026) — Epic 0 prework runs ahead of sprint kickoff
**Sprint Goal**: Transform YSELA into behavior-driven operational excellence platform
**Total Story Points**: **87 pts** (Session #175 added Epic 0 Pre-Work 13 pts; was 74 after Session #174)
**Status**: IMPLEMENTATION READY (post Epic 0 sign-off — Session #175 / 2026-04-29)

---

## Data Model Foundation (Session #172 Decision)

### Simplified Cascade Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SIMPLIFIED CASCADE (Confirmed)                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Objective.js (Yearly - exists, remove embedded KRs)                        │
│      │                                                                       │
│      └── KeyResult.js (NEW - separate model)                                │
│          └── Can span 1-4 quarters via quarters: [1,2,3,4]                  │
│              │                                                               │
│              └── WeeklyGoal.js (REPLACES Goal.js)                           │
│                  └── frequency: once | weekly | biweekly | monthly          │
│                  └── completions: [] (for recurring - Option A)             │
│                      │                                                       │
│                      └── Move.js (REPLACES Task.js)                         │
│                          └── move_type: action | reaction | habit           │
│                          └── discipline: 9 disciplines (from config)        │
│                          └── frequency: once | daily | weekly | triggered   │
│                          └── completions: [] (for habits - Option A)        │
│                                                                              │
│  KEY DECISIONS:                                                              │
│  • KeyResults are SEPARATE model (not embedded)                             │
│  • Recurring items use SINGLE record + completions array (Option A)         │
│  • 9 Disciplines defined in CONFIG file (not separate Behavior model)       │
│  • Frequency field defines behavior at every level                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Relationships (1:N at each level)

| Parent | Child | Foreign Key |
|--------|-------|-------------|
| Company | Objective | `objective.company_id` |
| Objective | KeyResult | `keyResult.objective_id` |
| KeyResult | WeeklyGoal | `weeklyGoal.key_result_id` |
| WeeklyGoal | Move | `move.weekly_goal_id` |

---

## Sprint 22 Scope (Updated — Session #175 Epic 0)

| Order | Epic | Name | Points | Priority | Spec File |
|-------|------|------|--------|----------|-----------|
| 0 | **0** | **Pre-Work / Discovery + Gap Closure** | **13** | **P-1** | [prework/](./prework/) |
| 1 | A | Data Models & Disciplines | 5 | P0 | [EPIC_A_BEHAVIOR_MODEL.md](./epics/EPIC_A_BEHAVIOR_MODEL.md) |
| 2 | B | AIContextService Extension | 10 | P0 | [EPIC_B_ORCHESTRATOR.md](./epics/EPIC_B_ORCHESTRATOR.md) |
| 3 | F | aiOKRService Extension (incl. `enrichCompany()`) | 10 | P0 (raised) | [EPIC_F_LLM_INTEGRATION.md](./epics/EPIC_F_LLM_INTEGRATION.md) |
| 4 | C | My Clients Page (incl. Add Client wizard, AI auto-fill) | 21 | P0 | [EPIC_C_MY_CLIENTS.md](./epics/EPIC_C_MY_CLIENTS.md) |
| 5 | E | Objective Wizard | 10 | P0 | [EPIC_E_OBJECTIVE_WIZARD.md](./epics/EPIC_E_OBJECTIVE_WIZARD.md) |
| 6 | H | Planning Page (12-13 weeks, monthly groups) | 5 | P1 | [EPIC_H_PLANNING_PAGE.md](./epics/EPIC_H_PLANNING_PAGE.md) |
| 7 | D | Assessment Enhancements (Hub tabs + sub-dimensions) | 8 | P0 | [EPIC_D_ASSESSMENT.md](./epics/EPIC_D_ASSESSMENT.md) |
| 8 | G | Dashboard V3 + UI Updates (Navy/Gold theme alias) | 5 | P1 | [EPIC_G_DASHBOARD_UI.md](./epics/EPIC_G_DASHBOARD_UI.md) |
| | **Total** | | **87** | | |

**Reorder rationale (Session #175)**:
- **Epic 0 inserted first** — 13 pts of pure spec/discovery work; produces all `prework/*.md` files; closes 59 gap decisions before /coding.
- **Epic F moved up to slot 3** (was P1, after C) — F is hard dependency for Epic C Phase 3 (`enrichCompany()`) and Epic E (`generateKRs()`). Building F first means C/E never block on missing service methods.
- **Epic C split-by-phase** — Phase 1 + 4 (page shell, KPIs, tile, donut, nav, search/filter/nudge stubs — 11 pts) start parallel to F. Phase 2 needs Epic A complete. Phase 3 needs Epic F complete.
- **Epic H pulled before D** — H consumes A's WeeklyGoal model directly; D is additive UI on existing Assessment infra and is safest to land late.
- **Epic G stays last** — final consolidation; absorbs nav href decisions and `--karvia-primary` theme alias rollout.

**Per-epic notes**:
- Epic D restored to scope (Session #174) — assessment-hub.html mockup aligned.
- Epic H tracked separately for execution/PR clarity; its 5pts roll up under Epic G's combined 10pt UI budget (G+H billed jointly — D-H-6).
- All cross-epic decisions resolved in [prework/DECISIONS_LOG.md](./prework/DECISIONS_LOG.md) (59 decisions APPROVED 2026-04-29).

---

## Refactored Approach (Session #172 Audit)

### Key Changes from Original Plan

| Original | Refactored | Reason |
|----------|------------|--------|
| New `Behavior.js` model | Config file `disciplines.js` | Simpler, no extra collection |
| New `ContextAssemblyService` | Extend `AIContextService` | Service already exists |
| New `LLMService` | Extend `aiOKRService` | Service already exists |
| Embedded `key_results[]` | Separate `KeyResult.js` | Proper relationships |
| `Goal.js` dual-purpose | `WeeklyGoal.js` single purpose | Clearer naming |
| `Task.js` | `Move.js` | User-facing terminology |

### Zero Impact Guarantee

- New models are ADDITIVE (KeyResult.js, WeeklyGoal.js, Move.js)
- Existing models kept working (backwards compatible)
- Service EXTENSIONS, not replacements
- Config file approach for disciplines (no DB migration)

---

## 6-Week Execution Roadmap

### Pre-Sprint: Epic 0 (13 pts) — runs before Sprint Day 1

| Epic | Tasks | Points |
|------|-------|--------|
| 0 | Inventories per epic, MODEL/API/SERVICE/TENANCY deltas, DAG, Test stubs, DECISIONS_LOG, spec patches | 13 |

**Milestone**: Zero unknowns; all 8 epics consistent with live codebase; 59 decisions resolved.

### Week 1: Foundation (25 pts)

| Epic | Tasks | Points |
|------|-------|--------|
| A | Data models (KeyResult, WeeklyGoal, Move) + Disciplines config + CRUD scaffolds | 5 |
| B | AIContextService extension + 6 Providers | 10 |
| F | aiOKRService extension (KR / WG / Move generation + `enrichCompany()`) | 10 |

**Milestone**: New models deployed, context assembly working, AI services live (incl. enrichCompany).

### Week 2-3: My Clients + Wizard (31 pts)

| Epic | Tasks | Points |
|------|-------|--------|
| C | My Clients Page (Phase 1 + 4 parallel to F; Phase 2 after A; Phase 3 after F) | 21 |
| E | Objective Wizard (3 screens; dual-write KRs to KeyResult collection) | 10 |

**Milestone**: My Clients functional, Objective creation with KRs (dual-write).

### Week 4-5: Planning + Assessment Hub (13 pts)

| Epic | Tasks | Points |
|------|-------|--------|
| H | Planning page (12-13 weeks, monthly groups, AI presets stub) | 5 |
| D | Assessment sub-dimensions + Hub tabs 4-6 (All Results / Trends / Compare) | 8 |

**Milestone**: Planning surfaces WeeklyGoals; Assessment Hub trends + compare live.

### Week 6: Polish (5 pts)

| Epic | Tasks | Points |
|------|-------|--------|
| G | Dashboard V3 (causal-chain) + Navy/Gold theme alias + Moves terminology | 5 |

**Milestone**: Sprint 22 complete, ready for beta

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEEK 1 (Foundation)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐                                            │
│  │     Epic A       │ ← MUST BE FIRST                            │
│  │   Data Models    │                                            │
│  │  + Disciplines   │                                            │
│  └────────┬─────────┘                                            │
│           │                                                       │
│           ▼                                                       │
│  ┌──────────────────┐                                            │
│  │     Epic B       │                                            │
│  │  AIContextService│                                            │
│  │   Extension      │                                            │
│  └────────┬─────────┘                                            │
│           │                                                       │
├───────────┼─────────────────────────────────────────────────────┤
│           │          WEEK 2-5 (Parallel Tracks)                  │
├───────────┼─────────────────────────────────────────────────────┤
│           │                                                       │
│           ├────────────────┬────────────────┐                    │
│           ▼                ▼                ▼                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Epic C     │  │   Epic E     │  │   Epic F     │           │
│  │  My Clients  │  │   Wizard     │  │  AI/LLM      │           │
│  │ (parallel)   │  │ (needs A,B)  │  │ (needs B)    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                        WEEK 6 (Polish)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐                                            │
│  │     Epic G       │                                            │
│  │  Dashboard UI    │                                            │
│  │  + Moves Theme   │                                            │
│  └──────────────────┘                                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Critical Path

```
Epic 0 → Epic A → Epic B → Epic F → Epic E → Epic H → Epic D Ph2 → Epic G → Beta Ready
  13       5        10       10       10       5         3           5
  pre-S    Wk1      Wk1      Wk1      Wk2-3    Wk4       Wk5         Wk6

Critical path: 61 pts. Parallel slack: 16 pts (Epic C P1+P4 + Epic D P1).
Total: 87 pts in 6 weeks + 4 days pre-sprint for Epic 0.
```

See [prework/DEPENDENCY_DAG.md](./prework/DEPENDENCY_DAG.md) for the phase-level dependency graph.

---

## New Files to Create

| File | Epic | Description |
|------|------|-------------|
| `server/models/KeyResult.js` | A | Separate KR model |
| `server/models/WeeklyGoal.js` | A | Replaces Goal.js for weekly |
| `server/models/Move.js` | A | Replaces Task.js with behavior support |
| `server/config/disciplines.js` | A | 9 disciplines config |
| `server/routes/key-results.js` | E | KR CRUD endpoints |
| `server/routes/weekly-goals.js` | E | Weekly goal endpoints |
| `server/routes/moves.js` | G | Move endpoints |

---

## API Endpoints (Sprint 22)

| Method | Endpoint | Epic | Description |
|--------|----------|------|-------------|
| GET | `/api/key-results/:objectiveId` | E | List KRs for objective |
| POST | `/api/key-results` | E | Create KR (separate model) |
| GET | `/api/weekly-goals/:keyResultId` | E | List weekly goals |
| POST | `/api/weekly-goals` | E | Create weekly goal |
| GET | `/api/moves/:weeklyGoalId` | G | List moves |
| POST | `/api/moves` | G | Create move |
| POST | `/api/objectives/generate-krs` | F | AI KR generation |
| GET | `/api/consultant/portfolio-summary` | C | My Clients data |

---

## Success Criteria

### Sprint Complete When:
- [ ] KeyResult, WeeklyGoal, Move models deployed (A)
- [ ] Disciplines config file created (A)
- [ ] AIContextService extended with providers (B)
- [ ] My Clients page functional with tiles (C)
- [ ] Objective Wizard creates objectives + separate KRs (E)
- [ ] AI KR generation working via extended aiOKRService (F)
- [ ] Dashboard Navy/Gold theme + Moves terminology (G)

---

## Quick Links

### Sprint 22 Epics (in execution order)

Backend pre-reqs (parallel):
- [Epic A: Data Models & Disciplines](./epics/EPIC_A_BEHAVIOR_MODEL.md) — 5 pts
- [Epic B: AIContextService Extension](./epics/EPIC_B_ORCHESTRATOR.md) — 10 pts
- [Epic F: aiOKRService Extension](./epics/EPIC_F_LLM_INTEGRATION.md) — 10 pts (incl. `enrichCompany()` for Add Client wizard)

UI work (locked execution order, Session #174):
1. [Epic C: My Clients Page + Add Client Wizard](./epics/EPIC_C_MY_CLIENTS.md) — 21 pts (16 page + 5 wizard with AI auto-fill)
2. [Epic E: Objective Wizard](./epics/EPIC_E_OBJECTIVE_WIZARD.md) — 10 pts
3. [Epic H: Planning Page](./epics/EPIC_H_PLANNING_PAGE.md) — 5 pts (billed under Epic G's combined UI budget)
4. [Epic D: Assessment Enhancements](./epics/EPIC_D_ASSESSMENT.md) — 8 pts
5. [Epic G: Dashboard V3 + UI Updates](./epics/EPIC_G_DASHBOARD_UI.md) — 5 pts (also lands `--karvia-primary` Navy alias)

### Sprint Mockups (post Session #174 cleanup)

All 6 mockups live in [../sprint_mockups/sprint-22/](../sprint_mockups/sprint-22/) with verified Navy/Gold theme, locked production navigation, and source-of-truth boundary notes.

---

**Updated**: April 29, 2026 (Session #175 — Epic 0 Pre-Work + Gap Closure)
**Status**: Implementation Ready — **87 pts** (was 74 + Epic 0 13 pts)
**Key Changes (Session #175)**:
- **Epic 0 added** (13 pts) — pre-work / discovery / gap closure runs before Sprint Day 1
- **Epic F moved up to slot 3** (was P1, after C) — F is hard dependency for Epic C Phase 3 and Epic E
- **`enrichCompany()` formally added to Epic F** (was missing despite Epic C dependency)
- **Epic C dependencies declared** (was "None") — needs A + F
- **Epic C split-by-phase** — Phase 1 + 4 parallel to F; Phase 2 after A; Phase 3 after F
- **Company schema additions specified** — stage, primary_contact, industry_secondary, vertical, hq, estimated_revenue_band, ai_enrichment_used, ai_confidence; description lifted to top-level; employee_count made optional with size-band derivation
- **`risk_status` formula defined** — computed at read-time, not stored
- **All AIContextService method references corrected** — D-B-1 (no more fictional `buildContext`/`getActiveObjectives`)
- **Disciplines config unified** — 4 foundations (Discipline / Growth / Accountability / Maturity), single API surface
- **discipline_ids replaces behavior_ids** everywhere — D-E-2
- **Dual-write pattern locked** for KeyResult — embedded `Objective.key_results[]` kept for backwards compat (D-A-1)
- **Welcome email, Reaction badge, Cost tracking** descoped to S23 — D-C-8, D-G-3, D-F-7
- **All 59 cross-epic decisions APPROVED** — see `prework/DECISIONS_LOG.md`

**Prior session changes preserved**:
- Epic D restored to scope (Session #174)
- Epic H billed under Epic G's combined UI budget (Session #174)
- 6 mockups cleaned + theme-locked + nav-locked (Session #174)
- s22 tokens in `client/css/s13-patterns.css` (Session #174)

**Next Action**: `/coding` — Begin Epic A (Data Models). All Epic 0 outputs in [`prework/`](./prework/).
