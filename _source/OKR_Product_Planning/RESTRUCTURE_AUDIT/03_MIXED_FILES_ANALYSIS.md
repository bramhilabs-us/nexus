# Mixed Files Analysis Report

**Created**: April 3, 2026
**Purpose**: Detailed analysis of 10 mixed files and recommendations for handling each
**Context**: Part of YSELA/KARVIA documentation restructure

---

## Executive Summary

After reading all 10 mixed files, the recommendation is:

| Action | Count | Files |
|--------|-------|-------|
| **SPLIT** | 2 | MASTER_PRODUCT_BACKLOG, product_philosophy |
| **LINK** | 2 | Beta roadmaps (keep in KARVIA, reference from YSELA) |
| **KEEP** | 6 | Delivery, technical, and historical docs |

---

## Detailed File Analysis

### 1. MASTER_PRODUCT_BACKLOG.md (7KB)

**Location**: `1-PRODUCT/product_backlog/`

**Content Breakdown**:
- P0 Beta Items: YSELA voice prompts, frontend reframing, behavior features
- P1-P3 Items: Mix of experience and technical features
- Technical Debt: Pure KARVIA (test coverage, API docs, performance)
- Delivered Summary: Historical record

**YSELA Content** (~40%):
- FEAT-021 Prompt System Overhaul (YSELA voice)
- FEAT-022 Frontend Reframing (Task → Work terminology)
- FEAT-026 Behavior Engine V1
- Experience improvements

**KARVIA Content** (~60%):
- Technical debt items (DEBT-001 to DEBT-005)
- API enhancements
- Infrastructure items
- Implementation tracking

**Recommendation**: **SPLIT**
```
YSELA/backlog/YSELA_BACKLOG.md
├── Experience improvements
├── Coach enhancements
├── Gamification features
└── Behavior framework items

KARVIA_STRATEGY/1-PRODUCT/backlog/KARVIA_BACKLOG.md
├── Technical debt
├── API enhancements
├── Performance improvements
└── Engine feature additions
```

---

### 2. 04_GATES_DEPENDENCIES_AND_RISKS.md (3KB)

**Location**: `1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/`

**Content Breakdown**:
- Gate 1: Narrative Alignment (YSELA positioning)
- Gate 2: Prompt Coverage (technical)
- Gate 3: Frontend Reframing (implementation)
- Gate 4: Beta Operations (process)
- Dependencies table (technical)
- Risk register (mixed)
- Go/No-Go checklist (delivery)

**Analysis**: Primarily a **delivery document**. The gates are about *implementing* YSELA, not *defining* YSELA.

**Recommendation**: **KEEP in KARVIA**
- This is a delivery governance document
- Lives correctly in IMPLEMENTATION_PLAN/
- No action needed

---

### 3. 00_BETA_RELEASE_PROJECT_ROADMAP.md (22KB)

**Location**: `1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/`

**Content Breakdown**:
- Philosophy Stack (BBB, GRIT, YSELA) - YSELA
- Core Insight (Garmin analogy) - YSELA
- Beta Goals & Success Metrics - YSELA
- Architecture Decision - KARVIA
- Story Map - MIXED
- Sprint Structure (21-25) - KARVIA
- iBrain Event Types - KARVIA
- Team Formation Mockups - YSELA
- Go/No-Go Gates - KARVIA
- GRIT-UX Principles - YSELA

**Analysis**: This is the **master strategy document** for beta. It's inherently mixed because it bridges YSELA vision with KARVIA implementation.

**Recommendation**: **LINK from YSELA**
```
YSELA/beta-launch/README.md
└── "Primary beta strategy document:
     ../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/00_BETA_RELEASE_PROJECT_ROADMAP.md"
```

**Rationale**:
- Splitting would fragment the cohesive narrative
- This document is the "bridge" between layers
- Better to keep intact and reference

---

### 4. BETA_ROADMAP_2026.md (32KB)

**Location**: `1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/`

**Content Breakdown**:
- Executive Decision (YSELA positioning)
- What Exists vs Missing (product analysis)
- Beta Thesis (YSELA philosophy)
- Product Model (4-step: Assess → Team → Objectives → Tasks)
- Workstreams A-G (implementation)
- Phasing (delivery)
- Technical Build Plan (KARVIA)
- CPO Perspective (YSELA strategy)
- CTO Perspective (KARVIA architecture)
- Sprint Breakdown (delivery)

**Analysis**: The **most important strategic document**. Contains dual perspectives (CPO/CTO) by design.

**Recommendation**: **LINK from YSELA**
```
YSELA/beta-launch/README.md
└── "Master beta roadmap:
     ../KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md"
```

**Rationale**:
- This is the "constitution" of the beta launch
- CPO/CTO perspectives are intentionally together
- Splitting would destroy the dual-perspective value

---

### 5. FEATURE_CATALOG.md (12KB)

**Location**: `1-PRODUCT/`

**Content Breakdown**:
- Feature list organized by module
- Implementation status (Ready/Partial/Planned)
- Code locations for each feature
- Coverage metrics

**Analysis**: This is an **implementation registry** - tracks what's built in the codebase.

**Recommendation**: **KEEP in KARVIA**
- It's about KARVIA engine capabilities
- YSELA features are implemented in KARVIA
- No split needed

---

### 6. SYSTEM_OVERVIEW.md (15KB)

**Location**: `1-PRODUCT/`

**Content Breakdown**:
- Persona descriptions
- System architecture diagrams
- Data flow
- API structure
- Integration points

**Analysis**: This is a **system documentation** file - describes how KARVIA works.

**Recommendation**: **KEEP in KARVIA**
- Technical system documentation
- Personas are described in terms of system interactions
- No split needed

---

### 7. KARVIA_PRODUCT_OVERVIEW.md (10KB)

**Location**: `1-PRODUCT/`

**Content Breakdown**:
- Value proposition
- Market positioning
- Technical capabilities
- Feature specifications

**Analysis**: The name says it all - this is about KARVIA as a product/engine.

**Recommendation**: **KEEP in KARVIA**
- Consider renaming to `KARVIA_ENGINE_OVERVIEW.md`
- Add YSELA reference in intro: "YSELA uses KARVIA as its engine"
- No split needed

---

### 8. MVP_STRATEGY_V5.md (50KB)

**Location**: `1-PRODUCT/strategy/`

**Content Breakdown**:
- Modular block architecture
- Implementation phases
- Historical strategy decisions
- Technical specifications

**Analysis**: This is **historical documentation** - captures how we got here.

**Recommendation**: **KEEP in KARVIA**
- Valuable historical record
- V5 suggests multiple iterations
- Archive-worthy, not split-worthy

---

### 9. product_overview.md (8KB)

**Location**: `1-PRODUCT/strategy/`

**Content Breakdown**:
- Role capabilities
- Persona descriptions
- Tech stack overview
- Deliverables list

**Analysis**: Overlaps significantly with KARVIA_PRODUCT_OVERVIEW.md (#7).

**Recommendation**: **CONSOLIDATE with #7**
- Merge into KARVIA_ENGINE_OVERVIEW.md
- Remove duplicate content
- Simplify navigation

---

### 10. product_philosophy.md (16KB)

**Location**: `1-PRODUCT/strategy/`

**Content Breakdown**:
- BBB (Behavior Based Business) positioning - YSELA
- iBrain architecture description - KARVIA
- UI patterns and button CSS - KARVIA
- Touchpoint map - MIXED

**Analysis**: Contains **distinct BBB content** that belongs in YSELA.

**Recommendation**: **SPLIT**
```
Extract to YSELA/philosophy/:
├── BBB positioning content
├── Behavior change philosophy
└── YSELA as operating system concept

Keep in KARVIA:
├── iBrain architecture
├── UI patterns
└── Technical touchpoint map
```

---

## Summary Action Plan

### Files to SPLIT (2)

| File | YSELA Extraction | KARVIA Remainder |
|------|------------------|------------------|
| MASTER_PRODUCT_BACKLOG.md | Experience/behavior items | Technical/API items |
| product_philosophy.md | BBB philosophy content | iBrain/UI patterns |

### Files to LINK (2)

| File | Action |
|------|--------|
| 00_BETA_RELEASE_PROJECT_ROADMAP.md | Reference in YSELA/beta-launch/README.md |
| BETA_ROADMAP_2026.md | Reference in YSELA/beta-launch/README.md |

### Files to KEEP (6)

| File | Notes |
|------|-------|
| 04_GATES_DEPENDENCIES_AND_RISKS.md | Delivery governance |
| FEATURE_CATALOG.md | Implementation registry |
| SYSTEM_OVERVIEW.md | System documentation |
| KARVIA_PRODUCT_OVERVIEW.md | Rename to ENGINE_OVERVIEW |
| MVP_STRATEGY_V5.md | Historical record |
| product_overview.md | Consolidate with #7 |

---

## Effort Estimation

| Action | Files | Effort |
|--------|-------|--------|
| Create YSELA_BACKLOG.md | 1 | Medium |
| Create KARVIA_BACKLOG.md | 1 | Small |
| Extract BBB to YSELA | 1 | Medium |
| Create YSELA/beta-launch/README.md | 1 | Small |
| Rename KARVIA_PRODUCT_OVERVIEW | 1 | Small |
| Consolidate product_overview.md | 1 | Small |
| **Total Effort** | - | **~4-6 hours** |

---

## Decisions Captured

1. **Two Backlogs**: YSELA_BACKLOG and KARVIA_BACKLOG (confirmed by user)
2. **Beta Roadmaps**: Keep together, link from YSELA
3. **Historical Docs**: Keep in KARVIA as archive
4. **Consolidation**: product_overview.md → merge into engine overview

---

**Next**: Update 00_RESTRUCTURE_MASTER_PLAN.md with final decisions
