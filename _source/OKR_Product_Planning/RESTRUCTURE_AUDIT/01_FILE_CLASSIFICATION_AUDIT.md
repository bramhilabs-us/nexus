# File Classification Audit Report

**Created**: April 3, 2026
**Scope**: All 99 markdown files in KARVIA_STRATEGY/1-PRODUCT/
**Purpose**: Classify each file as YSELA, KARVIA, MIXED, or NEUTRAL

---

## Classification Legend

| Code | Meaning | Action |
|------|---------|--------|
| **YSELA** | User experience, philosophy, design | Move to YSELA/ |
| **KARVIA** | Technical, engine, implementation | Stay in KARVIA_STRATEGY/ |
| **MIXED** | Contains both layers | Review for splitting |
| **NEUTRAL** | Navigation, governance | Update links only |

---

## ROOT LEVEL (10 files)

| File | Size | Classification | Action |
|------|------|----------------|--------|
| README.md | 8KB | NEUTRAL | Update links |
| CLAUDE_CONTEXT.md | 11KB | KARVIA | Stay |
| FEATURE_CATALOG.md | 12KB | **MIXED** | Review for split |
| GO_TO_MARKET.md | 15KB | YSELA | Consider move |
| KARVIA_PRODUCT_OVERVIEW.md | 10KB | **MIXED** | Review for split |
| KARVIA_SIMPLE_ONEPAGE.md | 3KB | YSELA | Consider move |
| PRODUCT_ARCHITECTURE.md | 24KB | KARVIA | Stay |
| PRODUCT_VISION.md | 10KB | KARVIA | Stay (KARVIA business) |
| SYSTEM_OVERVIEW.md | 15KB | **MIXED** | Review for split |
| USER_JOURNEYS_CONSOLIDATED.md | 14KB | YSELA | Link from YSELA |

---

## STRATEGY/ (13 files)

| File | Size | Classification | Action |
|------|------|----------------|--------|
| README.md | 8KB | NEUTRAL | Update links |
| ASSESSMENT_HUB_CONSULTANT_ANALYSIS.md | 11KB | YSELA | Consider move |
| ibrain_integration_model.md | 17KB | KARVIA | Stay |
| market_signals.md | 12KB | YSELA | Consider move |
| MVP_PRD_V3.md | 73KB | KARVIA | Stay |
| MVP_STRATEGY_V5.md | 50KB | **MIXED** | Review |
| personas_and_jtbd.md | 17KB | YSELA | Consider move |
| product_classification.md | 2KB | NEUTRAL | Stay |
| product_overview.md | 8KB | **MIXED** | Review |
| product_philosophy.md | 16KB | **MIXED** | Review |
| PRODUCT_STRATEGY_MASTER.md | 10KB | YSELA | Consider move |
| STRATEGY_QUICK_REFERENCE.md | 6KB | NEUTRAL | Update |
| value_proposition.md | 13KB | YSELA | Consider move |

---

## USER-JOURNEYS/ (8 files)

| File | Size | Classification | Action |
|------|------|----------------|--------|
| USER_JOURNEYS_MASTER.md | 17KB | YSELA | Link from YSELA |
| CONSULTANT_JOURNEY.md | 29KB | KARVIA | Stay (system journey) |
| ADMIN_JOURNEY.md | 22KB | KARVIA | Stay (system journey) |
| EXECUTIVE_JOURNEY.md | 27KB | KARVIA | Stay (system journey) |
| MANAGER_JOURNEY.md | 17KB | KARVIA | Stay (system journey) |
| EMPLOYEE_JOURNEY.md | 18KB | KARVIA | Stay (system journey) |
| KARVIA_USER_FLOW_SIMPLE.md | 6KB | KARVIA | Stay |
| CROSS_PAGE_AI_CONTEXT_FLOW.md | 42KB | KARVIA | Stay |

**Note**: User journeys describe system features (KARVIA). YSELA journeys TO BE CREATED separately.

---

## USER-STORIES/ (13 files)

| File | Size | Classification | Action |
|------|------|----------------|--------|
| USER_STORIES_MASTER.md | 34KB | KARVIA | Stay |
| USER_STORIES_INDEX.md | 5KB | NEUTRAL | Stay |
| PERSONA_CONS_STORIES.md | 14KB | KARVIA | Stay |
| PERSONA_ADMIN_STORIES.md | 9KB | KARVIA | Stay |
| PERSONA_EXEC_STORIES.md | 17KB | KARVIA | Stay |
| PERSONA_MGR_STORIES.md | 13KB | KARVIA | Stay |
| PERSONA_EMP_STORIES.md | 9KB | KARVIA | Stay |
| AI_CONTEXT_STORIES.md | 11KB | KARVIA | Stay |
| BLOCK_DEPENDENCIES.md | 16KB | KARVIA | Stay |
| _ARCHIVE/* | Various | KARVIA | Stay (archived) |

**Note**: User stories are technical requirements for KARVIA engine. YSELA stories TO BE CREATED.

---

## ROADMAP/BETA_RELEASE_PROJECT/ (25 files)

### Root Level

| File | Size | Classification | Action |
|------|------|----------------|--------|
| README.md | 2KB | NEUTRAL | Update |
| 00_BETA_RELEASE_PROJECT_ROADMAP.md | 22KB | **MIXED** | Link from YSELA |
| BETA_ROADMAP_2026.md | 32KB | YSELA | Link from YSELA |
| YSELA_PHILOSOPHY.md | 23KB | **YSELA** | **MOVE** |

### IMPLEMENTATION_PLAN/

| File | Size | Classification | Action |
|------|------|----------------|--------|
| README.md | 2KB | NEUTRAL | Update |
| 00_MASTER_IMPLEMENTATION_PLAN.md | 4KB | NEUTRAL | Stay |
| 00_PHILOSOPHY_PREWORK.md | 2KB | **YSELA** | **MOVE** |
| 01_PROMPT_AND_FRONTEND_PLAN.md | 4KB | KARVIA | Stay |
| 02_MINIMAL_BACKEND_PLAN.md | 3KB | KARVIA | Stay |
| 03_CONSULTANT_BETA_OPERATIONS.md | 2KB | YSELA | Link |
| 04_GATES_DEPENDENCIES_AND_RISKS.md | 3KB | **MIXED** | Review |
| 05_DELIVERY_BACKLOG.md | 2KB | NEUTRAL | Stay |
| 06_YSELA_UX_PRINCIPLES.md | 35KB | **YSELA** | **MOVE** |
| BBB_FRAMEWORK.md | 23KB | **YSELA** | **MOVE** |
| BOOK_INSIGHTS_COMPILATION.md | 33KB | **YSELA** | **MOVE** |
| CONSULTANT_METHODOLOGY.md | 33KB | **YSELA** | **MOVE** |
| MODULE_ARCHITECTURE.md | 20KB | KARVIA | Stay |
| PBL_GAMIFICATION_SPEC.md | 29KB | **YSELA** | **MOVE** |
| PHILOSOPHY_RESEARCH_COMPILATION.md | 14KB | **YSELA** | **MOVE** |
| USER_JOURNEY_SIMULATION.md | 53KB | **YSELA** | **MOVE** |

### PROMPT_TOUCHPOINTS/

| File | Size | Classification | Action |
|------|------|----------------|--------|
| README.md | 2KB | NEUTRAL | Update |
| 00_TOUCHPOINT_INVENTORY.md | 3KB | KARVIA | Stay |
| 01_BETA_PROMPT_GOVERNANCE.md | 3KB | KARVIA | Stay |
| 02_COMPANY_OKR_GENERATION.md | 2KB | KARVIA | Stay |
| 03_SINGLE_OBJECTIVE_AND_WIZARD.md | 2KB | KARVIA | Stay |
| 04_WEEKLY_PLAN_GENERATION.md | 2KB | KARVIA | Stay |
| 05_TASK_TO_NEXT_MOVE_GENERATION.md | 2KB | KARVIA | Stay |
| 06_PLAN_EXTENSION.md | 1KB | KARVIA | Stay |
| 07_SSI_NARRATIVE.md | 1KB | KARVIA | Stay |
| 08_CONSULTANT_WEEKLY_REVIEW.md | 2KB | KARVIA | Stay |
| 09_PROMPT_MIGRATION_MAP.md | 2KB | KARVIA | Stay |
| 10_YSELA_COACH_PERSONA.md | 4KB | **YSELA** | **MOVE** |
| 11_REFERENCE_LIBRARY.md | 5KB | KARVIA | Stay |

---

## MOCKUPS/ (9 files)

| File | Size | Classification | Action |
|------|------|----------------|--------|
| README.md | 2KB | NEUTRAL | Update |
| BETA_MOCKUPS/* | Various | **YSELA** | **MOVE FOLDER** |

All mockups are YSELA visual design - move entire BETA_MOCKUPS folder.

---

## PRODUCT_BACKLOG/ (4 files)

| File | Size | Classification | Action |
|------|------|----------------|--------|
| README.md | 2KB | NEUTRAL | Update |
| MASTER_PRODUCT_BACKLOG.md | 7KB | **MIXED** | Split or tag |
| IDEAS.md | 5KB | YSELA | Consider move |
| archive/README.md | 1KB | NEUTRAL | Stay |

---

## DOCUMENTATION/ (3 files)

| File | Size | Classification | Action |
|------|------|----------------|--------|
| PROJECT_STRUCTURE.md | 6KB | KARVIA | Stay |
| PRODUCT_DOCUMENTATION_CONSOLIDATION_ANALYSIS.md | 28KB | NEUTRAL | Stay |
| LEGACY_FOLDERS_INVENTORY.md | 4KB | NEUTRAL | Stay |

---

## Summary Statistics

### Files by Action

| Action | Count | Files |
|--------|-------|-------|
| **MOVE to YSELA/** | 10 | Philosophy, UX, Gamification, Coach, etc. |
| **MOVE FOLDER** | 1 | BETA_MOCKUPS/ |
| **STAY in KARVIA** | 65 | Technical, architecture, stories |
| **REVIEW for split** | 10 | Mixed content documents |
| **UPDATE links only** | 13 | Navigation files |

### Files to MOVE (Definite)

1. `YSELA_PHILOSOPHY.md` → `YSELA/philosophy/`
2. `BBB_FRAMEWORK.md` → `YSELA/philosophy/`
3. `00_PHILOSOPHY_PREWORK.md` → `YSELA/philosophy/`
4. `PHILOSOPHY_RESEARCH_COMPILATION.md` → `YSELA/philosophy/`
5. `BOOK_INSIGHTS_COMPILATION.md` → `YSELA/philosophy/`
6. `06_YSELA_UX_PRINCIPLES.md` → `YSELA/experience/`
7. `PBL_GAMIFICATION_SPEC.md` → `YSELA/experience/`
8. `USER_JOURNEY_SIMULATION.md` → `YSELA/experience/`
9. `CONSULTANT_METHODOLOGY.md` → `YSELA/methodology/`
10. `10_YSELA_COACH_PERSONA.md` → `YSELA/experience/`
11. `BETA_MOCKUPS/` (folder) → `YSELA/mockups/`

### Files to REVIEW for Split

1. `FEATURE_CATALOG.md` - User features vs implementation status
2. `SYSTEM_OVERVIEW.md` - User flows vs architecture
3. `MVP_STRATEGY_V5.md` - Strategy vs implementation
4. `KARVIA_PRODUCT_OVERVIEW.md` - Value prop vs tech metrics
5. `product_overview.md` - Capabilities vs tech stack
6. `product_philosophy.md` - BBB vs UI patterns
7. `MASTER_PRODUCT_BACKLOG.md` - Product vs technical items
8. `04_GATES_DEPENDENCIES_AND_RISKS.md` - Business vs technical
9. `00_BETA_RELEASE_PROJECT_ROADMAP.md` - Milestones vs timeline
10. `BETA_ROADMAP_2026.md` - Strategy vs phases

---

## Two-Product Artifact Matrix

### What YSELA Needs (Product Layer)

| Artifact | Status | Priority |
|----------|--------|----------|
| Vision | TO CREATE | P1 |
| Philosophy | EXISTS (move) | P0 |
| Strategy | TO CREATE | P2 |
| User Journeys | TO CREATE | P1 |
| User Stories | TO CREATE | P2 |
| Backlog | TO CREATE | P2 |
| Mockups | EXISTS (move) | P0 |
| UX Principles | EXISTS (move) | P0 |
| Gamification | EXISTS (move) | P0 |
| Coach Persona | EXISTS (move) | P0 |
| Methodology | EXISTS (move) | P0 |

### What KARVIA Needs (Engine Layer)

| Artifact | Status | Priority |
|----------|--------|----------|
| Vision | EXISTS | - |
| Engine Philosophy | TO CREATE | P2 |
| Architecture | EXISTS | - |
| User Journeys | EXISTS (system) | - |
| User Stories | EXISTS | - |
| Backlog | EXISTS (needs cleanup) | P2 |
| API Specs | EXISTS | - |
| Data Models | EXISTS | - |

---

**Next**: Review the 10 MIXED files and decide split strategy
