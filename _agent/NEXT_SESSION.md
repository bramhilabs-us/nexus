# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: strategy
**Task**: `N1-P2-02` — Data models catalogue
**Why it's next**: it's the head of the critical path to code — N1-P2-02 (data models) → N1-P2-04 (module graph) → N1-P4-01 (modularization plan + contracts) → Night 2 toolchain. Everything else in Night 1 can run after or in parallel.

**Cards to draw**:
- `NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md` — Layer 3 rules (program-scoped, private models, one KeyResult representation)
- `NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md` — data model hierarchy section
- Karvia models via `_source/` + read-only `karvia_business/server/models/`

**Definition of done**:
- `NEXUS_STRATEGY/2-TECHNICAL/DATA_MODELS.md` catalogues every Karvia Mongoose schema (fields, indexes, validations, relations)
- Per-cluster ER diagrams (CRM, OKR, Assessment) as Mermaid in `diagrams/`
- Each model annotated with its Nexus disposition: lift / lift+program_id / redesign / drop — consistent with C-005 and the module ownership map
- New doc wired into the document graph (genome + parent/child edges) and `doc-graph-check.py` green

**Watch out for**:
- Karvia's embedded `key_results[]` + standalone KeyResult dual-write (AP-4) — catalogue both, disposition: standalone only
- `karvia_business/` is READ-ONLY (hard rule 1)
- The catalogue describes Karvia *as-is*; Nexus deltas go in the disposition column, not mixed into the description
