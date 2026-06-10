# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: strategy
**Task**: `N1-P2-04` — Module dependency graph
**Why it's next**: with data models catalogued (N1-P2-02 ✓), the module graph is the last input N1-P4-01 (modularization plan + contracts) needs. C-008 blocks only the OKR-chain contracts, not this mapping work.

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
- **C-008 is OPEN** (Goal/Move layer) — answer it before or during N1-P4-01; if it's still open when P4-01 starts, draft the CRM/assessment/governance/knowledge contracts first and leave the OKR chain for last
