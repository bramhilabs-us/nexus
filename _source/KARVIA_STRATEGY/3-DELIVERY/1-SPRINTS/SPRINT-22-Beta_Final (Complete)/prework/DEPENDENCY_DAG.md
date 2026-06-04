# Dependency DAG — Sprint 22

<!-- @GENOME T3-SPR-022-PW-DG | ACTIVE | 2026-04-29 | parent:T3-SPR-022-PW0 | auto:- | linked:- -->

Phase-level dependency graph. Goes deeper than the prior epic-level graph so partial work can start in parallel where safe.

---

## Phase-Level Graph

```
                        ┌──────────────────────────┐
                        │     Epic 0 — Pre-Work    │
                        │      (13 pts, P-1)        │
                        │   blocks ALL other work   │
                        └────────────┬─────────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  ▼                  ▼                  ▼
          ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
          │   Epic A     │  │    Epic D    │  │   Epic C     │
          │  Data Models │  │  (Phase 1    │  │  (Phase 1    │
          │  + Disciplines│  │  Sub-dims    │  │  Page shell  │
          │  (5 pts)     │  │  & schema    │  │  +KPI shell  │
          │              │  │  +scoring)   │  │  +Tile +Donut│
          │              │  │  (5 pts)     │  │  +Nav update │
          │              │  │  PARALLEL    │  │  (8 pts)     │
          │              │  │              │  │  PARALLEL    │
          └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
                 │                 │                 │
                 ▼                 │                 │
          ┌──────────────┐         │                 │
          │   Epic B     │         │                 │
          │  AIContext   │         │                 │
          │  Extension   │         │                 │
          │  (10 pts)    │         │                 │
          └──────┬───────┘         │                 │
                 │                 │                 │
                 ▼                 │                 │
          ┌──────────────┐         │                 │
          │   Epic F     │         │                 │
          │  aiOKRSvc    │         │                 │
          │  +enrichCo   │         │                 │
          │  (10 pts)    │         │                 │
          └──┬─────┬──┬──┘         │                 │
             │     │  │            │                 │
             │     │  └────────────┼─────┬───────────┘
             │     │               │     │
             │     │               │     ▼
             │     │               │   ┌──────────────────────┐
             │     │               │   │  Epic C Phase 2      │
             │     │               │   │  (extend portfolio-  │
             │     │               │   │   summary aggregates)│
             │     │               │   │   needs A+EpicC P1   │
             │     │               │   │  (5 pts)             │
             │     │               │   └──────┬───────────────┘
             │     │               │          │
             │     │               │          ▼
             │     │               │   ┌──────────────────────┐
             │     │               │   │  Epic C Phase 3      │
             │     │               │   │  (Add Client wizard  │
             │     │               │   │  with AI auto-fill)  │
             │     │               │   │  needs F enrichCo    │
             │     │               │   │  (5 pts)             │
             │     │               │   └──────┬───────────────┘
             │     │               │          │
             │     │               │          ▼
             │     │               │   ┌──────────────────────┐
             │     │               │   │  Epic C Phase 4      │
             │     │               │   │  (search/filter/     │
             │     │               │   │   nudge stubs)       │
             │     │               │   │  parallel-able after │
             │     │               │   │  P1 (3 pts)          │
             │     │               │   └──────────────────────┘
             │     │
             │     ▼
             │  ┌──────────────────┐
             │  │   Epic E         │
             │  │   Objective      │
             │  │   Wizard         │
             │  │   needs A + F    │
             │  │   (10 pts)       │
             │  └──────┬───────────┘
             │         │
             ▼         ▼
       ┌────────────────────────────┐
       │   Epic H — Planning Page   │
       │   needs A (WeeklyGoal) +   │
       │   E (objectives w/ KRs)    │
       │   AI presets need F        │
       │   (5 pts billed under G)   │
       └─────────────┬──────────────┘
                     │
                     ▼
       ┌────────────────────────────┐
       │   Epic D — Phase 2 Tabs    │
       │   Hub tabs 4-6 (3 pts)     │
       │   needs Phase 1 schema +   │
       │   /trends + /compare       │
       └─────────────┬──────────────┘
                     │
                     ▼
       ┌────────────────────────────┐
       │   Epic G — Dashboard V3    │
       │   + theme alias rollout    │
       │   final consolidation      │
       │   (5 pts)                  │
       └────────────────────────────┘
```

---

## Critical Path

```
Epic 0 ──> Epic A ──> Epic B ──> Epic F ──> Epic E ──> Epic H ──> Epic D Ph2 ──> Epic G

Estimated: 13 + 5 + 10 + 10 + 10 + 5 + 3 + 5 = 61 pts on critical path
Parallel slack: Epic C Phase 1+4 (11 pts) + Epic D Phase 1 (5 pts) = 16 pts wall-clock saved
```

---

## Parallel Lanes

After Epic 0 sign-off, three lanes can run simultaneously:

| Lane | Work | Blocked when |
|------|------|--------------|
| **Backend Foundation** | A → B → F | nothing — runs first |
| **UI Foundation** | Epic C Phase 1 (page shell, KPIs, tile, donut, nav update) | nothing — pure UI |
| **Assessment Schema** | Epic D Phase 1 (sub_dimensions + constraint + scoring) | nothing — additive |

Once F lands:
- Epic C Phase 2 starts (needs A + Epic C P1)
- Epic C Phase 3 starts (needs F)
- Epic E starts (needs A + F)

Once E + H lands:
- Epic D Phase 2 (Hub tabs 4-6)
- Epic G (final theme + dashboard V3)

---

## Phase-Level Detail

### Epic 0 (13 pts)
Internal phases:
- 0a. Discovery (8 pts) — inventories + cross-cutting docs
- 0b. Decision Resolution (3 pts) — DECISIONS_LOG sign-off
- 0c. Spec Patches (2 pts) — single coordinated pass on all 8 epics + master plan + handoff

### Epic A (5 pts)
Phases:
- A.1 disciplines.js + KeyResult model (1.5)
- A.2 WeeklyGoal model + Move model (2.5)
- A.3 Disciplines route + Objective virtual + indexes (1.0)

### Epic B (10 pts)
Phases:
- B.1 AIContextService extension (registerProvider, assembleContext, cache) (3)
- B.2 6 providers (3)
- B.3 disciplines.js consumption + initializeProviders (2)
- B.4 Tests + integration smoke (2)

### Epic C (21 pts) — split-by-phase
- **C.1 (8)** — page shell, KPIs, tile, donut, nav update — **parallel to F**
- **C.2 (5)** — extended /portfolio-summary endpoint + aggregations — **needs A complete**
- **C.3 (5)** — Add Client wizard (2-step AI flow) + /enrich + /clients endpoints — **needs F complete**
- **C.4 (3)** — search/filter/nudge stub + acceptance — **after C.1**

### Epic D (8 pts)
- **D.1 (5)** — sub_dimensions schema + scoring + detailed-results extension — **parallel to F**
- **D.2 (3)** — Hub tabs 4 (All Results), 5 (Trends), 6 (Compare) + chart wiring

### Epic E (10 pts) — needs A + F
- E.1 Objective model extensions (1)
- E.2 Screen 1 + 2 + 3 UI updates to existing wizard (6)
- E.3 POST /objectives extended + KeyResult dual-write (1.5)
- E.4 Tests (1.5)

### Epic F (10 pts)
- F.1 generateKRs + buildCascadePrompt + parseCascadeResponse (3)
- F.2 generateWeeklyGoals + generateMoves (3)
- F.3 enrichCompany with web-search tool + cache + 3s timeout (3) — **was missing from spec**
- F.4 Tests + retry + rate-limit verification (1)

### Epic G (5 pts) — final
- G.1 theme alias `--karvia-primary: var(--s22-navy)` (0.5)
- G.2 dashboard-v2.html replace body content with V3 mockup (2.5)
- G.3 dashboard-v2.js rewrite for V3 data (1.5)
- G.4 Visual regression + manual sweep (0.5)

### Epic H (5 pts) — needs A + E + (optional) F
- H.1 planning-v2.html monthly grouping (2)
- H.2 planning-v2.js week-grouping logic (1.5)
- H.3 AI preset UI (stub OR live if F ready) (1)
- H.4 Tests (0.5)

---

## Risks (P0 — must mitigate before /coding)

| Risk | Mitigation |
|------|------------|
| Epic 0 surfaces a P0 spec contradiction we cannot resolve quickly | Decision logs include "DEFER to Sprint 23" option per item |
| Epic A introduces models that break existing OKR generation | Coexistence policy (D-A-1, D-A-2, D-A-3) keeps old paths working |
| Epic F enrichCompany OpenAI tool support uncertain | Fallback to manual Step 2 is defined; degrades gracefully |
| Epic C Phase 2 blocked on Epic A indefinitely | C.1 + C.4 (11 pts) can ship independently; Phase 2 ships when A lands |
| Epic G theme alias affects unintended pages | Pre-flight grep confirms only `.k-btn-primary` and tab-border use the alias |
