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
- **Status**: DONE (PR pending merge — tick 2026-06-03-02)
- **Size**: M (2 ticks; completed in 1)
- **Depends on**: N1-P1-01 (DONE, merged)
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md` written
  - ✓ 2 Mermaid diagrams (high-level + request lifecycle)
  - ✓ 8 Nexus deltas with rationale
  - ✓ Opened C-003 / C-004 / C-005 on architecture questions

### N1-P2-02 — Data models catalogue
- **Status**: DONE (PR pending merge — session 2026-06-09-02)
- **Size**: M (2 ticks; completed in 1 session)
- **Depends on**: N1-P1-01
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/2-TECHNICAL/DATA_MODELS.md` — all 19 Mongoose schemas (~9,300 lines) with key fields, relations, validations
  - ✓ Per-cluster ER diagrams (CRM, OKR, Assessment) in `diagrams/er-*.mmd`
  - ✓ Per-model Nexus disposition (lift / lift+program_id / redesign / fold / defer)
  - ✓ Wired into doc graph (genome, 2 parents); validator green
- **Notes**: Surfaced C-008 (Goal/Move layer) — ANSWERED same day by the founder: **NOF** (`1-PRODUCT/NOF.md`, DECISIONS C-008/C-009). N1-P4-01 fully unblocked; dispositions updated in DATA_MODELS.md.

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

### N1-P0-02 — Strategy pack: North Star + product/tech/execution cards
- **Status**: DONE (PR pending merge — interactive session 2026-06-09-01)
- **Size**: M (completed in 1 interactive session)
- **Depends on**: N1-P2-01, N1-P2-06, DECISIONS C-001/3/4/5
- **Definition of done**:
  - ✓ `NEXUS_STRATEGY/00_NORTH_STAR.md` — ≤90-step thesis, three-layer model, pack-of-cards system
  - ✓ `1-PRODUCT/PRODUCT_STRATEGY.md` — page contracts for all 6 pages, lifecycle stages, first-value journey
  - ✓ `2-TECHNICAL/TECH_STRATEGY.md` — 3 layers, 8-block anatomy, AssessmentProvider contract
  - ✓ `3-DELIVERY/EXECUTION_PLAYBOOK.md` — session types, 90-step phase budgets, measurement
- **Notes**: Human-directed (founder voice brief + iPad notes), added mid-sprint. Downstream: N1-P3-01 builds on PRODUCT_STRATEGY; N1-P4-01 aligns with TECH_STRATEGY; EXECUTION_PLAYBOOK governs all future step budgets.

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
- **Status**: READY (C-003/4/5 all answered — see DECISIONS.md 2026-06-04)
- **Size**: M (2 ticks)
- **Depends on**: N1-P2-04 (module graph), N1-P2-02 (data models)
- **Definition of done**:
  - MODULARIZATION_PLAN.md with 8 modules (CRM, Objectives, KeyResults, WeeklyGoals, Tasks, Assessment + Governance + Knowledge) + assessment impl (AIR — SSI dropped per C-006, Karvia reference only)
  - MODULE_CONTRACTS_DRAFT.md with TS interface signatures
  - Reflects ratified decisions: consolidate engines, TypeScript strict, Program as first-class entity
- **Notes**: All 3 architectural clarifications now answered (2026-06-04). N1-P4-02 also unblocked.

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
