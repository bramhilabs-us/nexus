# Backlog

Loaded from `SPRINTS_NIGHT_1.md` on 2026-06-03.
Status legend: READY | IN-PROGRESS | BLOCKED | DONE

---

### N1-P1-01 — Snapshot Karvia docs into `_source/`
- **Status**: DONE (PR pending merge — tick 2026-06-03-01)
- **Size**: S (1 tick)
- **Depends on**: none
- **Definition of done**:
  - Copy KARVIA_STRATEGY, .claude (no local settings), docs (no large bin), OKR planning, iBRAIN_Integration, top-level MDs
  - All exclusions honored (.env*, node_modules, logs, snapshots, test-results, .git, YSELA, bramhi, mockups, .DS_Store)
  - Secret scan of `_source/` clean (or redacted)
- **Notes**: Mechanical. Hooks must NOT fire on karvia path (reads only).

### N1-P2-01 — System architecture map
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - `NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md` written
  - 2 Mermaid diagrams (high-level + request lifecycle)
  - Nexus deltas section at bottom

### N1-P2-02 — Data models catalogue
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - `NEXUS_STRATEGY/2-TECHNICAL/DATA_MODELS.md` lists every Mongoose schema
  - Per-cluster ER diagrams (CRM, OKR, Assessment)

### N1-P2-03 — API surface catalogue
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - `NEXUS_STRATEGY/2-TECHNICAL/API_SURFACE.md` per-engine route tables
  - Shape-tagging (CRM-shape, OKR-shape, Assessment-shape) per route

### N1-P2-04 — Module dependency graph
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - `NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md` with Mermaid
  - Cycles flagged red — these are Night 2 refactor targets

### N1-P2-06 — Engineering principles & improvement bar
- **Status**: DONE (PR pending merge — tick 2026-06-04-03)
- **Size**: M (1 tick)
- **Depends on**: N1-P2-01 (DONE, PR #2 pending merge)
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/IMPROVEMENT_PLAN.md` written
  - ✓ 10 named anti-patterns sourced from Karvia evidence
  - ✓ 10 improvements with measurable enforcement
  - ✓ Per-PR quality gate checklist
  - ✓ Parking lot (out of scope explicitly)
  - ✓ Success criteria table (Karvia baseline vs Nexus target)
  - ✓ Implications for C-003/4/5 stated
- **Notes**: This doc is the bar every Night 2-5 tick is measured against. Added mid-sprint per human request.

### N1-P2-05 — User journeys
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - 4 journeys with numbered steps + Mermaid sequence diagrams
  - File: `NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md`

### N1-P3-01 — Populate 0-BUSINESS and 1-PRODUCT (Transformation OS framing)
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01 (DONE — pending PR merge)
- **Definition of done**:
  - 4 files each in 0-BUSINESS/ and 1-PRODUCT/
  - Leads with "Transformation OS"; AI Readiness as launch vertical
  - Both GTM motions covered: consultant-led + direct-to-org
  - Karvia adaptations cited; TODOs flagged where untranslatable
- **Notes**: C-001 answered — broad scope (Transformation OS). See DECISIONS.md 2026-06-03.

### N1-P3-02 — Populate 3-DELIVERY skeleton
- **Status**: READY
- **Size**: S (1 tick)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - SPRINT_PROCESS.md, RELEASE_PROCESS.md, CI_CD.md written

### N1-P3-03 — Populate 4-CUSTOMER skeleton
- **Status**: READY
- **Size**: S (1 tick)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - INTERVIEW_TEMPLATE, FEEDBACK_LOG, EVIDENCE_INDEX, METRICS templates

### N1-P4-01 — Modularization plan + contract drafts
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P2-04 (module graph), N1-P2-02 (data models)
- **Definition of done**:
  - MODULARIZATION_PLAN.md with 6 modules + assessment impls
  - MODULE_CONTRACTS_DRAFT.md with TS interface signatures

### N1-P4-02 — Nexus vs Karvia diff + Assessment interface spec
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P4-01
- **Definition of done**:
  - NEXUS_VS_KARVIA_DIFF.md (module-by-module)
  - ASSESSMENT_INTERFACE_SPEC.md (pluggable contract)

### N1-P5-01 — Test inventory
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - `NEXUS_STRATEGY/3-DELIVERY/QA/TEST_INVENTORY.md` with every Karvia test file catalogued

### N1-P5-02 — Coverage map + path to 80%
- **Status**: READY
- **Size**: M (2 ticks)
- **Depends on**: N1-P5-01, N1-P2-04
- **Definition of done**:
  - COVERAGE_MAP.md, COVERAGE_GAPS.md, PATH_TO_80_PERCENT.md

### N1-P6-01 — Journal + BACKLOG groom + Night 2 sprint draft
- **Status**: READY
- **Size**: S (1 tick)
- **Depends on**: all other N1 tasks DONE or accounted for
- **Definition of done**:
  - JOURNAL summary for Night 1
  - BACKLOG groomed
  - SPRINTS_NIGHT_2.md draft proposed
