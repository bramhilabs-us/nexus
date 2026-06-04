# YSELA / KARVIA Documentation Restructure Master Plan

**Created**: April 3, 2026
**Purpose**: Plan the separation of YSELA (Product Layer) from KARVIA (Engine Layer) documentation
**Status**: ✅ EXECUTION COMPLETE (Phases 1, 3-6)
**Last Updated**: April 5, 2026

---

## Execution Status (April 5, 2026)

| Phase | Status | Session | Notes |
|-------|--------|---------|-------|
| Phase 0 (Preparation) | ✅ COMPLETE | #148 | File classification, code audit |
| Phase 1 (T1 Vision Docs) | ✅ COMPLETE | #152 | KARVIA_ENGINE_VISION, YSELA_PRODUCT_VISION, PRODUCT_ROADMAP |
| Phase 2 (YSELA Backlog) | ⏸️ DEFERRED | - | CPO ownership, after restructure |
| Phase 3 (Genome Tags) | ✅ COMPLETE | #152 | Already present on YSELA docs |
| Phase 4 (Stale Doc Updates) | ✅ COMPLETE | #152 | 5 docs with transitioning headers |
| Phase 5 (Sprint Archive) | ✅ COMPLETE | #152 | 26 sprints → ARCHIVE/SPRINTS/ |
| Phase 6 (Cross-References) | ✅ COMPLETE | #152 | 5 files updated |

**Next Session**: #153 - T2 Technical Docs Update (optional, can proceed to Beta)

---

## Decisions Made (April 3, 2026)

| Question | Decision |
|----------|----------|
| **Backlogs** | Two separate backlogs (YSELA_BACKLOG + KARVIA_BACKLOG) |
| **User-Journeys** | Rename KARVIA to "system-flows/", create YSELA "user-journeys/" |
| **Mockups** | Move BETA_MOCKUPS to YSELA/ (design system stays in KARVIA) |
| **Beta Roadmaps** | Keep in KARVIA, link from YSELA (too intertwined to split) |
| **Mixed Files** | 2 split, 2 link, 6 keep (see 03_MIXED_FILES_ANALYSIS.md) |

---

## Executive Summary

### The Problem

Currently, YSELA and KARVIA documentation is mixed in `KARVIA_STRATEGY/1-PRODUCT/`. As KARVIA becomes a reusable engine, both layers need their own complete set of product artifacts.

### The Solution

1. Create a new `YSELA/` folder at root level
2. Keep `KARVIA_STRATEGY/` for engine documentation
3. Move YSELA-specific content to new folder
4. Create missing artifacts for both layers

---

## Current State Analysis

### Document Distribution (99 files in 1-PRODUCT)

| Classification | Count | Percentage |
|----------------|-------|------------|
| **YSELA** (user experience) | 38 | 40% |
| **KARVIA** (engine/technical) | 42 | 45% |
| **MIXED** (needs splitting) | 10 | 11% |
| **NEUTRAL** (navigation) | 9 | 10% |

### What Each Layer Needs

| Artifact | YSELA Status | KARVIA Status |
|----------|--------------|---------------|
| Vision | MISSING | EXISTS (PRODUCT_VISION.md) |
| Philosophy | EXISTS (YSELA_PHILOSOPHY.md) | MISSING |
| Strategy | PARTIAL (mixed in strategy/) | PARTIAL (mixed in strategy/) |
| Product Backlog | MISSING | EXISTS (MASTER_PRODUCT_BACKLOG.md - mixed) |
| User Journeys | TO CREATE | EXISTS (user-journeys/) |
| User Stories | MISSING | EXISTS (user-stories/) |
| Mockups | EXISTS (BETA_MOCKUPS/) | N/A (no UI) |
| Architecture | N/A (no code) | EXISTS (PRODUCT_ARCHITECTURE.md) |

---

## Decision Framework (Approved)

```
Q: "Does this document describe..."

├── What users SEE and EXPERIENCE?     → YSELA/
│   • Behavior frameworks (BBB, GRIT)
│   • Coach personality and voice
│   • UI/UX design principles
│   • Gamification (PBL)
│   • User journey simulations
│
├── What the SYSTEM DOES technically?  → KARVIA_STRATEGY/
│   • API specs
│   • Data models
│   • Architecture
│   • Security
│   • Microservices
│
└── How we DELIVER the product?        → KARVIA_STRATEGY/3-DELIVERY/
    • Sprints
    • QA/Testing
    • Release engineering
```

---

## Files to Move to YSELA/

### From `1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/`

| File | Size | Destination |
|------|------|-------------|
| `YSELA_PHILOSOPHY.md` | 23KB | `YSELA/philosophy/` |

### From `1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/`

| File | Size | Destination |
|------|------|-------------|
| `BBB_FRAMEWORK.md` | 23KB | `YSELA/philosophy/` |
| `00_PHILOSOPHY_PREWORK.md` | 2KB | `YSELA/philosophy/` |
| `PHILOSOPHY_RESEARCH_COMPILATION.md` | 14KB | `YSELA/philosophy/` |
| `BOOK_INSIGHTS_COMPILATION.md` | 33KB | `YSELA/philosophy/` |
| `06_YSELA_UX_PRINCIPLES.md` | 35KB | `YSELA/experience/` |
| `PBL_GAMIFICATION_SPEC.md` | 29KB | `YSELA/experience/` |
| `USER_JOURNEY_SIMULATION.md` | 53KB | `YSELA/experience/` |
| `CONSULTANT_METHODOLOGY.md` | 33KB | `YSELA/methodology/` |

### From `1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/PROMPT_TOUCHPOINTS/`

| File | Size | Destination |
|------|------|-------------|
| `10_YSELA_COACH_PERSONA.md` | 4KB | `YSELA/experience/` |

### From `1-PRODUCT/mockups/BETA_MOCKUPS/`

| Folder | Destination |
|--------|-------------|
| Entire `BETA_MOCKUPS/` folder | `YSELA/mockups/` |

**Total: 10 files + 1 folder moving to YSELA/**

---

## Files That Need Splitting

These files contain both YSELA and KARVIA content:

| File | Current | YSELA Content | KARVIA Content |
|------|---------|---------------|----------------|
| `FEATURE_CATALOG.md` | 12KB | User capabilities | Implementation status |
| `SYSTEM_OVERVIEW.md` | 15KB | User flows | Architecture overview |
| `MVP_STRATEGY_V5.md` | 50KB | Strategic decisions | Implementation timeline |
| `KARVIA_PRODUCT_OVERVIEW.md` | 10KB | Value proposition | Technical metrics |
| `product_overview.md` | 8KB | Role capabilities | Tech stack |
| `product_philosophy.md` | 16KB | BBB/YSELA positioning | UI patterns |
| `MASTER_PRODUCT_BACKLOG.md` | 7KB | Product features | Technical items |
| `04_GATES_DEPENDENCIES_AND_RISKS.md` | 3KB | Business risks | Technical deps |
| `00_BETA_RELEASE_PROJECT_ROADMAP.md` | 22KB | Product milestones | Technical timeline |
| `BETA_ROADMAP_2026.md` | 32KB | Release strategy | Feature phases |

**Action**: Review each and decide whether to:
- Split into two documents
- Keep in one place and link
- Refactor for clarity

---

## Documents to CREATE

### For YSELA/

| Document | Purpose | Priority |
|----------|---------|----------|
| `YSELA/README.md` | Navigation hub | P0 |
| `YSELA/vision/YSELA_VISION.md` | YSELA product vision | P1 |
| `YSELA/user-journeys/` (all) | YSELA-specific user journeys | P1 |
| `YSELA/backlog/YSELA_BACKLOG.md` | YSELA product backlog | P2 |
| `YSELA/strategy/YSELA_STRATEGY.md` | YSELA product strategy | P2 |

### For KARVIA_STRATEGY/

| Document | Purpose | Priority |
|----------|---------|----------|
| `1-PRODUCT/KARVIA_ENGINE_PHILOSOPHY.md` | Engine design principles | P2 |
| Refactored PRODUCT_BACKLOG (engine-only) | Technical backlog | P2 |

---

## Proposed New Structure (FINALIZED)

```
karvia_business/
│
├── YSELA/                                  ← NEW (Product Layer)
│   ├── README.md                           ← Navigation hub
│   │
│   ├── vision/
│   │   └── YSELA_VISION.md                 ← TO CREATE (P1)
│   │
│   ├── philosophy/                         ← MOVE existing files
│   │   ├── YSELA_PHILOSOPHY.md             ← Move from BETA_RELEASE_PROJECT/
│   │   ├── BBB_FRAMEWORK.md                ← Move from IMPLEMENTATION_PLAN/
│   │   ├── PHILOSOPHY_PREWORK.md           ← Move from IMPLEMENTATION_PLAN/
│   │   ├── PHILOSOPHY_RESEARCH.md          ← Move from IMPLEMENTATION_PLAN/
│   │   ├── BOOK_INSIGHTS.md                ← Move from IMPLEMENTATION_PLAN/
│   │   └── BBB_EXTRACT.md                  ← Extract from product_philosophy.md
│   │
│   ├── experience/                         ← MOVE existing files
│   │   ├── UX_PRINCIPLES.md                ← Move (06_YSELA_UX_PRINCIPLES.md)
│   │   ├── PBL_GAMIFICATION.md             ← Move (PBL_GAMIFICATION_SPEC.md)
│   │   ├── COACH_PERSONA.md                ← Move (10_YSELA_COACH_PERSONA.md)
│   │   └── USER_JOURNEY_SIMULATION.md      ← Move
│   │
│   ├── methodology/
│   │   └── CONSULTANT_METHODOLOGY.md       ← Move
│   │
│   ├── user-journeys/                      ← TO CREATE (P1) - Experience focus
│   │   ├── README.md
│   │   ├── CONSULTANT_EXPERIENCE.md        ← How consultant FEELS using YSELA
│   │   ├── BUSINESS_OWNER_EXPERIENCE.md    ← How owner experiences transformation
│   │   └── EMPLOYEE_EXPERIENCE.md          ← How employee experiences coach
│   │
│   ├── mockups/                            ← MOVE from KARVIA
│   │   └── BETA_MOCKUPS/                   ← All beta design visuals
│   │
│   ├── backlog/                            ← TO CREATE (P2)
│   │   └── YSELA_BACKLOG.md                ← Extract from MASTER_PRODUCT_BACKLOG
│   │
│   └── beta-launch/                        ← Links to KARVIA delivery
│       └── README.md                       ← References to roadmap docs
│           "Master Roadmap: ../KARVIA_STRATEGY/.../BETA_ROADMAP_2026.md"
│           "Project Roadmap: ../KARVIA_STRATEGY/.../00_BETA_RELEASE_PROJECT_ROADMAP.md"
│
├── KARVIA_STRATEGY/                        ← STAYS (Engine Layer - purified)
│   ├── 1-PRODUCT/
│   │   ├── PRODUCT_VISION.md               ← Stays (KARVIA engine vision)
│   │   ├── PRODUCT_ARCHITECTURE.md         ← Stays (engine architecture)
│   │   ├── KARVIA_ENGINE_OVERVIEW.md       ← Rename from KARVIA_PRODUCT_OVERVIEW
│   │   │
│   │   ├── system-flows/                   ← RENAME from user-journeys/
│   │   │   ├── README.md
│   │   │   ├── CONSULTANT_FLOW.md          ← Rename (system interactions)
│   │   │   ├── EMPLOYEE_FLOW.md
│   │   │   ├── MANAGER_FLOW.md
│   │   │   ├── EXECUTIVE_FLOW.md
│   │   │   └── ADMIN_FLOW.md
│   │   │
│   │   ├── user-stories/                   ← Stays (technical requirements)
│   │   │
│   │   ├── backlog/
│   │   │   └── KARVIA_BACKLOG.md           ← Rename/extract technical items
│   │   │
│   │   └── strategy/                       ← Stays (keep historical docs)
│   │
│   ├── 2-TECHNICAL/
│   │   └── 3-DESIGN-SYSTEM/                ← Stays (shared components)
│   │       ├── colors.md
│   │       ├── components.md
│   │       └── patterns.md
│   │
│   └── 3-DELIVERY/                         ← Unchanged (delivery is neutral)
│
└── iBRAIN_Integration/                     ← Unchanged (future layer)
```

---

## Implementation Phases

### Phase 0: Preparation (This Session) ✓ COMPLETE
- [x] Audit all 1-PRODUCT files (99 files classified)
- [x] Create restructure planning folder
- [x] Finalize file classification (see 01_FILE_CLASSIFICATION_AUDIT.md)
- [x] Identify code dependencies (server/index.js:148, package.json:36-38)
- [x] Analyze 10 mixed files (see 03_MIXED_FILES_ANALYSIS.md)
- [x] Make decisions on open questions
- [ ] Get approval on plan ← **NEXT STEP**

### Phase 1: Create YSELA Structure (Sprint 22)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Create `YSELA/` folder with subfolders | P0 | S | CTO |
| Create `YSELA/README.md` navigation hub | P0 | S | CTO |
| Move 10 YSELA files to new locations | P0 | M | CTO |
| Move `BETA_MOCKUPS/` to `YSELA/mockups/` | P0 | S | CTO |
| Rename `user-journeys/` → `system-flows/` | P1 | S | CTO |
| Rename journey files with `-FLOW` suffix | P1 | S | CTO |
| Create `YSELA/beta-launch/README.md` with links | P1 | S | CTO |

### Phase 2: Create Missing Artifacts (Sprint 22-23)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Create `YSELA_VISION.md` | P1 | M | CPO |
| Create 3 YSELA user experience journeys | P1 | L | CPO |
| Extract YSELA items → `YSELA_BACKLOG.md` | P2 | M | CPO |
| Extract BBB → `YSELA/philosophy/BBB_EXTRACT.md` | P2 | S | CTO |
| Create `KARVIA_BACKLOG.md` (technical items) | P2 | S | CTO |
| Rename `KARVIA_PRODUCT_OVERVIEW` → `ENGINE_OVERVIEW` | P2 | S | CTO |

### Phase 3: Cleanup (Sprint 23)

| Task | Priority | Effort | Owner |
|------|----------|--------|-------|
| Update all cross-references in moved files | P2 | M | CTO |
| Update `ECOSYSTEM_ARCHITECTURE.md` | P2 | S | CTO |
| Update `CLAUDE.md` paths | P2 | S | CTO |
| Consolidate `product_overview.md` into engine overview | P3 | S | CTO |
| Remove duplicate/obsolete content | P3 | S | CTO |
| Verify no broken links | P3 | S | CTO |

---

## Code Impact Assessment

### Files with Code References to KARVIA_STRATEGY

| File | Line | Reference | Impact |
|------|------|-----------|--------|
| `server/index.js` | 148 | `openapi.yaml` path | Keep in place |
| `package.json` | 36-38 | Test script paths | Keep in place |
| `.eslintrc.js` | 55 | Ignore pattern | Add YSELA/ |

### Production Safety

- Deployment script (`sync-production.sh`) excludes `KARVIA_STRATEGY/`
- Production app has ZERO documentation dependencies
- Restructure is documentation-only

---

## Tasks Generated (Finalized)

### Phase 1 Tasks (Sprint 22) - Structure Creation ✅ COMPLETE

| # | Task | Priority | Effort | Owner | Status |
|---|------|----------|--------|-------|--------|
| 1 | Create `YSELA/` folder structure | P0 | S | CTO | ✅ Done (Apr 4) |
| 2 | Create `YSELA/README.md` | P0 | S | CTO | ✅ Done (Apr 4) |
| 3 | Move 10 YSELA files | P0 | M | CTO | ✅ Done (Apr 4) |
| 4 | Move `BETA_MOCKUPS/` folder | P0 | S | CTO | ✅ Done (Apr 4) |
| 5 | Rename `user-journeys/` → `system-flows/` | P1 | S | CTO | ✅ Done (Apr 4) |
| 6 | Create `YSELA/beta-launch/README.md` | P1 | S | CTO | ✅ Done (Apr 4) |

**Session #148**: All Phase 1 tasks completed with git history preserved.

### Phase 2 Tasks (Sprint 22-23) - Content Creation

| # | Task | Priority | Effort | Owner | Status |
|---|------|----------|--------|-------|--------|
| 7 | Create `YSELA_VISION.md` | P1 | M | CPO | Pending |
| 8 | Create YSELA user experience journeys (3) | P1 | L | CPO | Pending |
| 9 | Split `MASTER_PRODUCT_BACKLOG` → two backlogs | P2 | M | Both | Pending |
| 10 | Extract BBB from `product_philosophy.md` | P2 | S | CTO | Pending |
| 11 | Rename `KARVIA_PRODUCT_OVERVIEW` | P2 | S | CTO | ✅ Done (Apr 4) |

### Phase 3 Tasks (Sprint 23) - Cleanup

| # | Task | Priority | Effort | Owner | Status |
|---|------|----------|--------|-------|--------|
| 12 | Update cross-references in all moved files | P2 | M | CTO | ✅ Done (Apr 4) |
| 13 | Update `ECOSYSTEM_ARCHITECTURE.md` | P2 | S | CTO | ✅ Done (Apr 4) |
| 14 | Update `CLAUDE.md` | P2 | S | CTO | ✅ Done (Apr 4) |
| 15 | Consolidate overlapping docs | P3 | S | CTO | Pending |
| 16 | Verify no broken links | P3 | S | CTO | ✅ Done (Apr 4) |

### KARVIA 1.0 Lock-In Tasks (Added Apr 4)

| # | Task | Priority | Effort | Owner | Status |
|---|------|----------|--------|-------|--------|
| 17 | Create `KARVIA_1.0_CAPABILITIES.md` | P0 | M | CTO | ✅ Done (Apr 4) |
| 18 | Add 65 integration tests (Session #147) | P0 | L | CTO | ✅ Done (Apr 4) |

**Session #148 Progress**: 6 additional tasks completed (Phase 2: 1, Phase 3: 4, KARVIA 1.0: 1)

**Total Effort Estimate**: ~8-12 hours (spread across Sprint 22-23)

---

## Open Questions - RESOLVED

| # | Question | Resolution |
|---|----------|------------|
| 1 | **User Journeys in KARVIA** | Rename folder to `system-flows/`, keep files with `-FLOW` suffix. Create new YSELA `user-journeys/` with `-EXPERIENCE` suffix. |
| 2 | **Product Backlog Split** | **Two separate backlogs**. YSELA_BACKLOG (experience items) + KARVIA_BACKLOG (technical items). |
| 3 | **Strategy Docs** | Keep in KARVIA. Most strategy docs are delivery-focused. Link from YSELA where needed. |
| 4 | **Mockups** | **Move BETA_MOCKUPS to YSELA/**. Design system (colors, components) stays in KARVIA. |
| 5 | **Roadmap Docs** | **Keep in KARVIA, link from YSELA**. Beta roadmaps are bridge documents - better intact. |

---

## Mixed Files Handling - DECIDED

See `03_MIXED_FILES_ANALYSIS.md` for detailed analysis.

| Action | Files | Notes |
|--------|-------|-------|
| **SPLIT** | MASTER_PRODUCT_BACKLOG.md, product_philosophy.md | Create YSELA and KARVIA versions |
| **LINK** | 00_BETA_RELEASE_PROJECT_ROADMAP.md, BETA_ROADMAP_2026.md | Reference from YSELA/beta-launch/ |
| **KEEP** | 04_GATES..., FEATURE_CATALOG, SYSTEM_OVERVIEW, KARVIA_PRODUCT_OVERVIEW, MVP_STRATEGY_V5, product_overview | Technical/delivery docs |

---

## Naming Conventions - DECIDED

| Layer | Folder | File Suffix | Example |
|-------|--------|-------------|---------|
| KARVIA | `system-flows/` | `-FLOW.md` | `CONSULTANT_FLOW.md` |
| YSELA | `user-journeys/` | `-EXPERIENCE.md` | `CONSULTANT_EXPERIENCE.md` |

**Rationale**:
- "Flows" = system interactions, what happens technically
- "Experiences" = emotional journey, how user feels

---

## Mockups Strategy - DECIDED

```
KARVIA_STRATEGY/2-TECHNICAL/
└── 3-DESIGN-SYSTEM/              ← STAYS (shared components)
    ├── colors.md                  (Navy/Gold palette)
    ├── components.md              (buttons, cards, etc.)
    └── patterns.md                (S13 pattern, etc.)

YSELA/mockups/                     ← MOVE HERE (experience visuals)
└── BETA_MOCKUPS/
    ├── dashboard-v3/
    ├── coach-interface/
    └── gamification/
```

**Rationale**: Mockups are aspirational designs (YSELA), not implementation specs (KARVIA).

---

## Approval Status

| Stakeholder | Status | Date |
|-------------|--------|------|
| CPO | **Pending Review** | - |
| CTO | **Pending Review** | - |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [01_FILE_CLASSIFICATION_AUDIT.md](./01_FILE_CLASSIFICATION_AUDIT.md) | File-by-file classification |
| [02_TWO_PRODUCT_GAP_ANALYSIS.md](./02_TWO_PRODUCT_GAP_ANALYSIS.md) | What each product needs |
| [03_MIXED_FILES_ANALYSIS.md](./03_MIXED_FILES_ANALYSIS.md) | Mixed files detailed analysis |
| [04_KARVIA_1.0_LOCKIN_PLAN.md](./04_KARVIA_1.0_LOCKIN_PLAN.md) | KARVIA 1.0 Engine lock-in plan |
| [05_KARVIA_1.0_TEST_CASES.md](./05_KARVIA_1.0_TEST_CASES.md) | Comprehensive test case definitions |

---

**Next Step**: Get stakeholder approval, then proceed to Phase 1 execution
