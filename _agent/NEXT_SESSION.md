# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: strategy
**Task**: `N1-P2-04` — Module dependency graph
**Why it's next**: with data models catalogued (N1-P2-02 ✓), the module graph is the last input N1-P4-01 (modularization plan + contracts) needs.

**Queue (Path B, ratified 2026-06-09)**: this session → `N1-P2-07` design tokens → `N1-P2-08` six page mockups (first visible product, ≈ sessions 8–10) → resume Night 1 remainder. Mockup feedback feeds N1-P4-01.

**Cards to draw**:
- `NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md` — engine inventory + shared-model coupling
- `NEXUS_STRATEGY/2-TECHNICAL/DATA_MODELS.md` — which models each engine touches
- Karvia engine code via read-only `karvia_business/engines/*/index.js` (grep the `require('../../server/models/...)` imports)

**Definition of done**:
- `NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md` — every Karvia engine/route-cluster mapped to the models it reads/writes; Mermaid graph with **cycles flagged red** (Night 2 refactor targets)
- Each dependency labeled with its Nexus resolution: stays in-module / becomes a contract call / becomes a domain event
- Wired into the doc graph; validator green

**Watch out for**:
- `karvia_business/` is READ-ONLY (hard rule 1)
- Engines lie about their boundaries (all import shared models) — map *actual* imports, not the engine names
- **C-008 ANSWERED → NOF** (`1-PRODUCT/NOF.md`): 4 levels, Goal/Move dropped, Milestone replaces WeeklyGoal, dynamic objective-relative timelines. N1-P4-01 fully unblocked; map Karvia's goal/move imports as "dies with NOF"
