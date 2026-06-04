# Break-Proof Execution Plan

<!-- @GENOME T3-SPR-EXEC-001 | ACTIVE | 2026-04-05 | parent:T0-GOV-001 | auto:/strategy,/audit | linked:/init -->

**Version**: 2.0
**Created**: April 5, 2026
**Updated**: April 5, 2026
**Purpose**: Detailed execution plan ensuring zero breakage during doc restructure
**Session**: #150 - Planning Session

### Session Roadmap
| Session | Type | Purpose |
|---------|------|---------|
| #150 | Planning | This document (COMPLETE) |
| #151 | Audit | Verify plan, code dependencies |
| #152 | Strategy | Finalize T1 Vision docs (CEO/CPO/CTO/Architect) |
| #153 | Technical | Update T2 docs based on T1 |
| #154+ | Execution | Phases 3-6 implementation |

### Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-05 | Initial plan creation |
| 2.0 | 2026-04-05 | Added Sessions #152 (Vision) and #153 (Technical), stakeholder doc loading, cascade matrix |

---

## Table of Contents

1. [Session Roadmap](#1-session-roadmap)
2. [Code Dependency Map](#2-code-dependency-map)
3. [Safe vs Unsafe Operations](#3-safe-vs-unsafe-operations)
4. [Document Dependency Matrix](#4-document-dependency-matrix)
5. [Session Doc Loading Requirements](#5-session-doc-loading-requirements)
6. [Phase 1: T1 Vision Documents](#6-phase-1-t1-vision-documents)
7. [Phase 2: T2 Backlog & Journeys](#7-phase-2-t2-backlog--journeys)
8. [Phase 3: Genome Tag Addition](#8-phase-3-genome-tag-addition)
9. [Phase 4: Stale Doc Updates](#9-phase-4-stale-doc-updates)
10. [Phase 5: Sprint Archive](#10-phase-5-sprint-archive)
11. [Phase 6: Cross-Reference Updates](#11-phase-6-cross-reference-updates)
12. [Verification Procedures](#12-verification-procedures)
13. [Rollback Procedures](#13-rollback-procedures)
14. [Audit Checklist](#14-audit-checklist-for-session-151)
15. [Session #152: Product Vision Finalization](#15-session-152-product-vision-finalization)
16. [Session #153: Technical Docs Update](#16-session-153-technical-docs-update)

---

## 1. Session Roadmap

### Complete Session Flow

```
Session #150 (Current)     Session #151              Session #152                  Session #153
   PLANNING          →       AUDIT           →    VISION FINALIZATION      →    TECHNICAL UPDATE

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│ • Create plans  │    │ • Review plans  │    │ • Finalize KARVIA   │    │ • Update arch docs  │
│ • Impact analysis│    │ • Verify deps   │    │   engine vision     │    │ • Update API specs  │
│ • Doc gap audit │    │ • Code check    │    │ • Finalize YSELA    │    │ • Update data docs  │
│ • Define phases │    │ • Sign-off      │    │   product vision    │    │ • Cascade changes   │
└─────────────────┘    └─────────────────┘    │ • Strategy docs     │    │ • Verify consistency│
                                              │ • User journeys     │    └─────────────────────┘
                                              └─────────────────────┘

      ↓                       ↓                        ↓                          ↓
  Planning Docs           Audit Report           T1 Docs Finalized         T2 Docs Updated
  (This document)         (Sign-off)             (Strategy Complete)       (Technical Aligned)
```

### Session Dependencies

| Session | Prerequisite | Deliverable | Next Session Trigger |
|---------|-------------|-------------|---------------------|
| #150 Planning | None | This execution plan | User approval |
| #151 Audit | Plan approved | Audit sign-off | Sign-off complete |
| #152 Vision | Audit passed | Finalized T1 docs | T1 docs complete |
| #153 Technical | T1 docs finalized | Updated T2 docs | All docs consistent |
| #154+ Execution | T1+T2 finalized | Phases 3-6 complete | Per-phase completion |

### Document Tier Flow

```
T0 (Constitutional)          T1 (Strategic)           T2 (Canonical)            T3 (Working)
━━━━━━━━━━━━━━━━━━━          ━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━━━           ━━━━━━━━━━━━━

CLAUDE.md ──────────────────→ KARVIA_ENGINE_VISION ─→ backend_architecture ──→ Sprint docs
SESSION_LOG                   YSELA_VISION            api_contracts            Handoffs
CONTEXT_REGISTRY              PRODUCT_ROADMAP         database_schema          Session notes
                              ECOSYSTEM_ARCH          security docs
                                    │                       │
                                    └───────────────────────┴────────────────────────┘
                                                    │
                                          Changes flow DOWN
                                     (T1 change → updates T2 → updates T3)
```

---

## 2. Code Dependency Map

### 1.1 Critical Code References (CANNOT BREAK)

| File | Line | Reference | Action |
|------|------|-----------|--------|
| `package.json` | 36-38 | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/PLAYWRIGHT/` | DO NOT TOUCH |
| `server/index.js` | 148 | `KARVIA_STRATEGY/2-TECHNICAL/1-API-SPECIFICATION/openapi.yaml` | DO NOT TOUCH |
| `playwright.config.ts` | 13 | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/PLAYWRIGHT/tests` | DO NOT TOUCH |
| `.eslintrc.js` | 55 | `KARVIA_STRATEGY/` (ignore pattern) | SAFE (folder stays) |
| `bramhi/scan-genome.js` | 13 | `KARVIA_STRATEGY` base dir | SAFE (folder stays) |
| `.claude/project.yaml` | 23 | `strategy_folder: "KARVIA_STRATEGY"` | SAFE (folder stays) |

### 1.2 Generated Files (Will Auto-Update)

| File | Generated By | Trigger |
|------|--------------|---------|
| `bramhi/genome-database.json` | `bramhi/scan-genome.js` | Run `node bramhi/scan-genome.js` after genome changes |

### 1.3 Folder Paths That MUST Stay Unchanged

```
KARVIA_STRATEGY/                      # Referenced by .eslintrc, bramhi, .claude
├── 2-TECHNICAL/                      # Could be renamed but no benefit
│   └── 1-API-SPECIFICATION/          # CRITICAL - server/index.js refs openapi.yaml
│       └── openapi.yaml              # CRITICAL - DO NOT MOVE
└── 3-DELIVERY/
    └── 2-QA-AND-TESTING/
        └── QA/
            └── PLAYWRIGHT/           # CRITICAL - package.json, playwright.config.ts
                ├── tests/            # CRITICAL
                ├── run-bst-tests.sh
                ├── run-journey-tests.sh
                └── run-edge-case-tests.sh
```

### 1.4 Documentation References (191 .md files)

These reference KARVIA_STRATEGY paths but are NOT code dependencies:
- `.claude/*.md` files (12 files)
- `KARVIA_STRATEGY/**/*.md` files (~170 files)
- `YSELA/**/*.md` files (21 files)
- `Karvia_OKR_Product_Planning/**/*.md` files (~10 files)

**Impact**: If paths change, these need cross-reference updates (Phase 6).
**Mitigation**: We're NOT renaming core folders, only creating new ones and moving content.

---

## 2. Safe vs Unsafe Operations

### 2.1 SAFE Operations (Zero Risk)

| Operation | Why Safe |
|-----------|----------|
| Create `1-VISION/` folder | New folder, no existing refs |
| Create new .md files | New files, no existing refs |
| Modify .md file content | Content only, not paths |
| Add genome tags to files | Metadata only |
| Move sprint folders to `ARCHIVE/` | No code refs to sprint folders |
| Create `YSELA/backlog/` folder | New folder |
| Create `YSELA/user-journeys/` folder | New folder |

### 2.2 LOW RISK Operations (Verify After)

| Operation | Risk | Verification |
|-----------|------|--------------|
| Rename `PRODUCT_VISION.md` | 59 md files reference it | Update refs, grep verify |
| Archive `product_overview.md` | 59 md files reference it | Update refs, grep verify |
| Update file genome tags | bramhi/genome-database.json | Re-run scanner |

### 2.3 UNSAFE Operations (DO NOT DO)

| Operation | Why Unsafe | Alternative |
|-----------|------------|-------------|
| Rename `KARVIA_STRATEGY/` | 11 code files reference | Keep name |
| Rename `2-TECHNICAL/` | server/index.js refs | Keep name |
| Move `openapi.yaml` | server/index.js line 148 | Keep in place |
| Rename `3-DELIVERY/` | package.json, playwright | Keep name |
| Move Playwright folder | 3 code files reference | Keep in place |

---

## 4. Document Dependency Matrix

### 4.1 Change Cascade Rules

When a document changes, dependent documents may need updates. This matrix shows the cascade flow.

```
CHANGE IN               TRIGGERS UPDATE IN
═══════════════════════════════════════════════════════════════════════════

T1 STRATEGIC DOCS
├─ KARVIA_ENGINE_VISION.md
│   ├── backend_architecture.md (T2)
│   ├── api_contracts.md (T2)
│   ├── database_schema.md (T2)
│   ├── KARVIA_BACKLOG.md (T2)
│   └── Sprint docs (T3) - if scope changes
│
├─ YSELA_VISION.md
│   ├── UX_PRINCIPLES.md (T2)
│   ├── COACH_PERSONA.md (T2)
│   ├── PBL_GAMIFICATION.md (T2)
│   ├── YSELA_BACKLOG.md (T2)
│   ├── user-journeys/*.md (T2)
│   └── mockups/*.md (T2)
│
├─ ECOSYSTEM_ARCHITECTURE.md
│   ├── backend_architecture.md (T2)
│   ├── All service-level docs (T2)
│   └── CLAUDE.md (T0) - key docs section
│
└─ PRODUCT_ROADMAP.md
    ├── Sprint master plans (T3)
    ├── BETA_ROADMAP_2026.md (T2)
    └── Implementation plans (T2)

T2 CANONICAL DOCS
├─ backend_architecture.md
│   ├── API spec files (T2)
│   ├── Sprint technical specs (T3)
│   └── Deployment docs (T2)
│
├─ database_schema.md
│   ├── API contracts (T2)
│   ├── Model implementation (code)
│   └── Migration scripts (code)
│
└─ user-journeys/*.md
    ├── system-flows/*.md (T2)
    ├── mockups/*.md (T2)
    └── Sprint user stories (T3)
```

### 4.2 Dependency Check Commands

Before finalizing any T1 document, run these checks:

```bash
# Find all docs that reference KARVIA_ENGINE_VISION
grep -rl "KARVIA_ENGINE_VISION" --include="*.md" .

# Find all docs that reference YSELA_VISION
grep -rl "YSELA_VISION\|YSELA_PRODUCT_VISION" --include="*.md" .

# Find all docs linking to a specific file
grep -rl "backend_architecture" --include="*.md" .

# Generate dependency graph (using genome parent field)
grep -r "parent:" --include="*.md" | grep "@GENOME"
```

### 4.3 Cascade Verification Checklist

After updating a T1 doc, verify cascades:

| T1 Document Changed | Check These T2 Docs | Verification Command |
|--------------------|---------------------|---------------------|
| KARVIA_ENGINE_VISION | Architecture docs | `grep -l "engine\|KARVIA" KARVIA_STRATEGY/2-TECHNICAL/**/*.md` |
| YSELA_VISION | Experience docs | `grep -l "YSELA\|experience" YSELA/**/*.md` |
| ECOSYSTEM_ARCHITECTURE | All service docs | `grep -l "microservice\|engine" KARVIA_STRATEGY/2-TECHNICAL/**/*.md` |
| PRODUCT_ROADMAP | Sprint/release docs | `grep -l "roadmap\|milestone" KARVIA_STRATEGY/3-DELIVERY/**/*.md` |

---

## 5. Session Doc Loading Requirements

### 5.1 Stakeholder-Based Doc Loading

Each session type requires specific documents to be loaded based on stakeholder perspective.

#### Session #152: Product Vision Finalization

**Stakeholder Perspectives Required**:

| Stakeholder | Role | Docs to Load | Why |
|-------------|------|--------------|-----|
| **CEO** | Business direction | `PRODUCT_VISION.md`, `GO_TO_MARKET.md`, `BETA_ROADMAP_2026.md` | Business viability |
| **CPO** | Product experience | `YSELA_VISION.md`, `YSELA_PHILOSOPHY.md`, `UX_PRINCIPLES.md`, `user-journeys/*.md` | User value |
| **CTO** | Technical feasibility | `KARVIA_ENGINE_OVERVIEW.md`, `backend_architecture.md`, `KARVIA_1.0_CAPABILITIES.md` | What's buildable |
| **Architect** | System design | `ECOSYSTEM_ARCHITECTURE.md`, `api_contracts.md`, `database_schema.md` | How to build |

**Session #152 Auto-Load List** (in order):

```markdown
<!-- Session #152 Doc Loading Order -->

## T0 - Governance Context
1. CLAUDE.md - Project rules and constraints
2. SESSION_LOG.md - Progress context

## T1 - Strategic Docs (Primary Focus)
3. KARVIA_STRATEGY/1-PRODUCT/PRODUCT_VISION.md - Current vision (to update)
4. KARVIA_STRATEGY/1-PRODUCT/KARVIA_ENGINE_OVERVIEW.md - Engine context
5. KARVIA_STRATEGY/1-PRODUCT/KARVIA_1.0_CAPABILITIES.md - What engine does
6. YSELA/vision/YSELA_VISION.md - Product vision (to finalize)
7. YSELA/philosophy/YSELA_PHILOSOPHY.md - Product philosophy
8. ECOSYSTEM_ARCHITECTURE.md - Three-layer model

## T2 - Supporting Context
9. YSELA/experience/UX_PRINCIPLES.md - User experience rules
10. KARVIA_STRATEGY/1-PRODUCT/system-flows/*.md - Technical user journeys
11. KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/backend_architecture.md - Technical reality
```

#### Session #153: Technical Docs Update

**Stakeholder Perspectives Required**:

| Stakeholder | Role | Docs to Load | Why |
|-------------|------|--------------|-----|
| **CTO** | Technical direction | `KARVIA_ENGINE_VISION.md` (finalized), `backend_architecture.md` | Align tech to vision |
| **Architect** | System design | `api_contracts.md`, `database_schema.md`, security docs | Update to match |
| **Tech Lead** | Implementation | Sprint technical specs, code references | Validate feasibility |

**Session #153 Auto-Load List** (in order):

```markdown
<!-- Session #153 Doc Loading Order -->

## T0 - Governance Context
1. CLAUDE.md - Project rules
2. SESSION_LOG.md - Progress context

## T1 - Finalized Strategy (Source of Truth)
3. KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md - FINALIZED engine vision
4. KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md - FINALIZED product vision
5. ECOSYSTEM_ARCHITECTURE.md - Three-layer model

## T2 - Docs to Update
6. KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/backend_architecture.md
7. KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/api_contracts.md
8. KARVIA_STRATEGY/2-TECHNICAL/3-DATA/database_schema.md
9. KARVIA_STRATEGY/2-TECHNICAL/1-API-SPECIFICATION/JWT_SECURITY_DESIGN.md
10. KARVIA_STRATEGY/2-TECHNICAL/1-API-SPECIFICATION/MULTI_TENANCY_SECURITY.md
11. KARVIA_STRATEGY/2-TECHNICAL/1-API-SPECIFICATION/RBAC_IMPLEMENTATION_GUIDE.md
```

### 5.2 Doc Loading Verification

Before starting each session, verify correct docs are loaded:

```bash
# Verify T1 docs exist
ls -la KARVIA_STRATEGY/1-VISION/
ls -la YSELA/vision/

# Verify T2 docs exist
ls -la KARVIA_STRATEGY/2-TECHNICAL/0-SYSTEM-ARCHITECTURE/
ls -la KARVIA_STRATEGY/2-TECHNICAL/1-API-SPECIFICATION/

# Check genome tags are present
grep -l "@GENOME" KARVIA_STRATEGY/1-VISION/*.md
grep -l "@GENOME" KARVIA_STRATEGY/2-TECHNICAL/**/*.md
```

### 5.3 Session Type → Doc Auto-Load Mapping

| Session Command | Stakeholder Mix | Primary Docs |
|-----------------|-----------------|--------------|
| `/strategy` | CEO + CPO + CTO + Architect | T1 Vision + ECOSYSTEM + Roadmap |
| `/coding` | CTO + Architect + Tech Lead | T2 Technical + CLAUDE.md |
| `/design` | CPO + UX Lead | YSELA docs + UX_PRINCIPLES |
| `/audit` | All stakeholders | All T0, T1, T2 relevant to scope |
| `/testing` | QA Lead + Tech Lead | Test specs + CLAUDE.md |

---

## 6. Phase 1: T1 Vision Documents

### 3.1 Task: Create `1-VISION/` Folder

**Location**: `KARVIA_STRATEGY/1-VISION/`
**Risk Level**: SAFE
**Dependencies**: None

**Verification**:
```bash
# After creation, verify:
ls -la KARVIA_STRATEGY/1-VISION/
# Expected: Empty folder or README.md
```

### 3.2 Task: Create `KARVIA_ENGINE_VISION.md`

**Location**: `KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md`
**Risk Level**: SAFE (new file)
**Dependencies**: None

**Content Sources** (read-only, don't modify originals yet):
- `1-PRODUCT/PRODUCT_VISION.md` - Extract technical sections
- `1-PRODUCT/KARVIA_ENGINE_OVERVIEW.md` - Reference for capabilities
- `1-PRODUCT/KARVIA_1.0_CAPABILITIES.md` - Link to (don't duplicate)

**Required Sections**:
```markdown
# KARVIA Engine Vision

<!-- @GENOME T1-KRV-001 | ACTIVE | 2026-04-XX | parent:ROOT | auto:/strategy,/coding | linked:/init,/audit -->

## What is KARVIA?
- KARVIA is the OKR engine (invisible to users)
- KARVIA powers YSELA (the user-facing product)
- KARVIA is NOT the product brand

## Engine Capabilities
- Link to KARVIA_1.0_CAPABILITIES.md
- Summary of what the engine does

## Technical Architecture
- Link to 2-TECHNICAL/0-SYSTEM-ARCHITECTURE/

## Relationship to YSELA
- YSELA wraps KARVIA
- YSELA provides: UI, behavior frameworks, brand
- KARVIA provides: Data, APIs, business logic

## Relationship to iBrain
- Future integration
- Not required for Beta
```

**Verification**:
```bash
# After creation:
head -5 KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md
# Expected: Genome tag present

grep "@GENOME" KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md
# Expected: T1-KRV-001
```

### 3.3 Task: Create `YSELA_PRODUCT_VISION.md` (Link File)

**Location**: `KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md`
**Risk Level**: SAFE (new file)
**Dependencies**: `YSELA/vision/YSELA_VISION.md` must exist

**Content**:
```markdown
# YSELA Product Vision

<!-- @GENOME T1-YSL-001 | ACTIVE | 2026-04-XX | parent:ROOT | auto:/strategy,/design | linked:/init -->

> This document links to the authoritative YSELA vision in the YSELA folder.

## Authoritative Source

**Primary Document**: [YSELA_VISION.md](../../YSELA/vision/YSELA_VISION.md)

## Quick Summary

YSELA is the user-facing product layer that wraps the KARVIA engine.

- **YSELA** = Product brand, user experience, behavior frameworks
- **KARVIA** = OKR engine, APIs, data (invisible to users)

## Key YSELA Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Vision | [YSELA_VISION.md](../../YSELA/vision/YSELA_VISION.md) | Product direction |
| Philosophy | [YSELA_PHILOSOPHY.md](../../YSELA/philosophy/YSELA_PHILOSOPHY.md) | Core beliefs |
| UX Principles | [UX_PRINCIPLES.md](../../YSELA/experience/UX_PRINCIPLES.md) | Design philosophy |
| Methodology | [CONSULTANT_METHODOLOGY.md](../../YSELA/methodology/CONSULTANT_METHODOLOGY.md) | Consultant approach |

## See Also

- [KARVIA_ENGINE_VISION.md](./KARVIA_ENGINE_VISION.md) - Engine layer vision
- [ECOSYSTEM_ARCHITECTURE.md](../../ECOSYSTEM_ARCHITECTURE.md) - Three-layer model
```

**Verification**:
```bash
# After creation:
grep "@GENOME" KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md
# Expected: T1-YSL-001

# Verify links work (manual check):
# - ../../YSELA/vision/YSELA_VISION.md should resolve
```

### 3.4 Task: Finalize `YSELA/vision/YSELA_VISION.md`

**Location**: `YSELA/vision/YSELA_VISION.md` (existing file)
**Risk Level**: LOW (content update only)
**Dependencies**: None

**Current State**: Draft exists (created earlier this session)

**Required Updates**:
1. Add genome tag (currently missing)
2. Add "KARVIA Separation" section
3. Add links to KARVIA_ENGINE_VISION.md
4. Review and finalize content

**Genome Tag to Add**:
```markdown
<!-- @GENOME T1-YSL-002 | ACTIVE | 2026-04-XX | parent:ROOT | auto:/strategy,/design | linked:/init,/coding -->
```

**Sections to Add/Update**:
```markdown
## Relationship to KARVIA

YSELA is the **product layer** built on top of the KARVIA engine.

| Layer | What It Is | User Sees? |
|-------|------------|------------|
| **YSELA** | Product brand, UX, behavior frameworks | Yes - this is the product |
| **KARVIA** | OKR engine, APIs, data models | No - invisible infrastructure |
| **iBrain** | AI/ML intelligence (future) | No - behind the scenes |

For engine details, see [KARVIA_ENGINE_VISION.md](../../KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md).
```

**Verification**:
```bash
# After update:
grep "@GENOME" YSELA/vision/YSELA_VISION.md
# Expected: T1-YSL-002

grep "KARVIA_ENGINE_VISION" YSELA/vision/YSELA_VISION.md
# Expected: Link present
```

### 3.5 Task: Create `PRODUCT_ROADMAP.md` (Index)

**Location**: `KARVIA_STRATEGY/1-VISION/PRODUCT_ROADMAP.md`
**Risk Level**: SAFE (new file)
**Dependencies**: Existing roadmap files

**Content Structure**:
```markdown
# Product Roadmap

<!-- @GENOME T1-RDM-001 | ACTIVE | 2026-04-XX | parent:ROOT | auto:/strategy | linked:/sprint-review -->

## Current Phase: Beta (Apr 2026)

**Target Date**: April 17, 2026
**Status**: Sprint 21 in progress

## Roadmap Documents

### Beta Release
- [BETA_ROADMAP_2026.md](../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md)
- [00_BETA_RELEASE_PROJECT_ROADMAP.md](../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/00_BETA_RELEASE_PROJECT_ROADMAP.md)

### Implementation Plans
- [00_MASTER_IMPLEMENTATION_PLAN.md](../1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/IMPLEMENTATION_PLAN/00_MASTER_IMPLEMENTATION_PLAN.md)

### Historical (MVP)
- [ROADMAP_OVERVIEW.md](../1-PRODUCT/roadmap/MVP_ROADMAP/ROADMAP_OVERVIEW.md)

## Timeline Summary

| Phase | Dates | Focus |
|-------|-------|-------|
| MVP | Oct 2025 - Mar 2026 | Core OKR engine |
| Beta | Apr 2026 | YSELA experience, pilot customer |
| GA | Q3 2026 | Public launch |
```

**Verification**:
```bash
# After creation:
grep "@GENOME" KARVIA_STRATEGY/1-VISION/PRODUCT_ROADMAP.md
# Expected: T1-RDM-001
```

### 3.6 Task: Create `1-VISION/README.md`

**Location**: `KARVIA_STRATEGY/1-VISION/README.md`
**Risk Level**: SAFE (new file)

**Content**:
```markdown
# 1-VISION: Strategic Vision Documents

<!-- @GENOME T1-NAV-VIS-001 | ACTIVE | 2026-04-XX | parent:ROOT | auto:/init,/strategy | linked:- -->

This folder contains T1 (Strategic) tier documents that define vision and direction.

## Documents

| Document | Purpose | Owner |
|----------|---------|-------|
| [KARVIA_ENGINE_VISION.md](./KARVIA_ENGINE_VISION.md) | KARVIA engine vision | CTO |
| [YSELA_PRODUCT_VISION.md](./YSELA_PRODUCT_VISION.md) | YSELA product vision (link) | CPO |
| [PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md) | Unified roadmap index | Product |

## Governance

- **Tier**: T1 (Strategic)
- **Change Authority**: Product Owner / CTO approval required
- **Review Cycle**: Quarterly
```

---

## 4. Phase 2: T2 Backlog & Journeys

### 4.1 Task: Create `YSELA/backlog/` Folder

**Location**: `YSELA/backlog/`
**Risk Level**: SAFE (new folder)

**Verification**:
```bash
mkdir -p YSELA/backlog
ls -la YSELA/backlog/
```

### 4.2 Task: Create `YSELA/user-journeys/` Folder

**Location**: `YSELA/user-journeys/`
**Risk Level**: SAFE (new folder)

**Verification**:
```bash
mkdir -p YSELA/user-journeys
ls -la YSELA/user-journeys/
```

### 4.3 Task: Create `YSELA_BACKLOG.md`

**Location**: `YSELA/backlog/YSELA_BACKLOG.md`
**Risk Level**: SAFE (new file)
**Source**: Extract from `1-PRODUCT/product_backlog/MASTER_PRODUCT_BACKLOG.md`

**Content Focus** (YSELA = Experience Layer):
- UI/UX improvements
- Behavior framework features (BBB, GRIT, PBL)
- Gamification features
- User journey enhancements
- Copy and language
- Coach persona features

**Required Genome Tag**:
```markdown
<!-- @GENOME T2-YSL-BKL-001 | ACTIVE | 2026-04-XX | parent:T1-YSL-001 | auto:/strategy | linked:/coding,/design -->
```

**Template Structure**:
```markdown
# YSELA Product Backlog

<!-- @GENOME T2-YSL-BKL-001 | ACTIVE | 2026-04-XX | parent:T1-YSL-001 | auto:/strategy | linked:/coding,/design -->

## Overview

This backlog contains **YSELA experience layer** features - UI, UX, behavior frameworks, gamification.

For **KARVIA engine** features (APIs, data models, backend), see [KARVIA_BACKLOG.md](../../KARVIA_STRATEGY/1-PRODUCT/product_backlog/KARVIA_BACKLOG.md).

## Backlog Items

### P0 - Beta Must Have

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| YSL-001 | Coach Persona | YSELA coach voice and guidance | Planned |
| YSL-002 | Gamification UI | Points, badges, leaderboards display | Planned |

### P1 - Beta Should Have

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| YSL-010 | Weekly Reflection | End-of-week reflection flow | Planned |
| YSL-011 | Streak Momentum | Streak tracking and celebration | Planned |

### P2 - Post-Beta

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| YSL-020 | Team Formation Wizard | Guided team setup | Planned |
```

### 4.4 Task: Create `KARVIA_BACKLOG.md`

**Location**: `KARVIA_STRATEGY/1-PRODUCT/product_backlog/KARVIA_BACKLOG.md`
**Risk Level**: SAFE (new file)
**Source**: Extract from `MASTER_PRODUCT_BACKLOG.md`

**Content Focus** (KARVIA = Engine Layer):
- API improvements
- Data model changes
- Backend services
- Performance optimization
- Security enhancements
- Infrastructure

**Required Genome Tag**:
```markdown
<!-- @GENOME T2-KRV-BKL-001 | ACTIVE | 2026-04-XX | parent:T1-KRV-001 | auto:/coding | linked:/strategy -->
```

### 4.5 Task: Update `MASTER_PRODUCT_BACKLOG.md`

**Location**: `KARVIA_STRATEGY/1-PRODUCT/product_backlog/MASTER_PRODUCT_BACKLOG.md`
**Risk Level**: LOW (content update)

**Change**: Convert to index/redirect pointing to split backlogs

**New Content Header**:
```markdown
# Master Product Backlog

<!-- @GENOME T2-PRD-BKL-IDX | ACTIVE | 2026-04-XX | parent:T1-PRD-001 | auto:/strategy | linked:/coding -->

> **Note**: This backlog has been split into two focused backlogs:
> - [YSELA_BACKLOG.md](../../../YSELA/backlog/YSELA_BACKLOG.md) - Experience layer features
> - [KARVIA_BACKLOG.md](./KARVIA_BACKLOG.md) - Engine layer features

## Quick Links

| Backlog | Focus | Owner |
|---------|-------|-------|
| [YSELA Backlog](../../../YSELA/backlog/YSELA_BACKLOG.md) | UI, UX, behavior, gamification | CPO |
| [KARVIA Backlog](./KARVIA_BACKLOG.md) | APIs, data, backend, infra | CTO |

---

## Historical Content (Archive Reference)

[Original content preserved below for reference...]
```

### 4.6 Task: Create 3 YSELA Experience Journeys

**Locations**:
- `YSELA/user-journeys/CONSULTANT_EXPERIENCE.md`
- `YSELA/user-journeys/BUSINESS_OWNER_EXPERIENCE.md`
- `YSELA/user-journeys/EMPLOYEE_EXPERIENCE.md`

**Risk Level**: SAFE (new files)

**Key Difference from `system-flows/`**:
- `system-flows/` = Technical (what the system does, API calls, data flow)
- `user-journeys/` = Experiential (how users feel, emotional arc, transformation)

**Template for Experience Journeys**:
```markdown
# [PERSONA] Experience Journey

<!-- @GENOME T2-YSL-EXP-00X | ACTIVE | 2026-04-XX | parent:T1-YSL-002 | auto:/design | linked:/strategy -->

## The Transformation Promise

> "What the [persona] experiences and how they transform through YSELA"

## Emotional Arc

| Phase | Emotion | YSELA Response |
|-------|---------|----------------|
| Discovery | Curious but skeptical | Show quick wins |
| Onboarding | Overwhelmed | 3-step guidance |
| First Week | Uncertain | Clear next moves |
| First Month | Growing confidence | Visible progress |
| Ongoing | Empowered | Recognition and growth |

## Key Moments That Matter

### Moment 1: [Name]
- **Trigger**: What happens
- **Feeling**: How they feel
- **YSELA Action**: What we do
- **Outcome**: How they feel after

## Touchpoints

| Touchpoint | YSELA Feature | Behavior Framework |
|------------|---------------|-------------------|
| Morning check-in | Priority view | BBB - Daily rhythm |
| Task completion | Celebration | PBL - Points/badges |
| Weekly review | Reflection prompt | GRIT - Growth signals |

## Success Indicators

- What does success look like for this persona?
- How do we measure their transformation?
```

### 4.7 Task: Create `YSELA/user-journeys/README.md`

**Location**: `YSELA/user-journeys/README.md`
**Risk Level**: SAFE (new file)

**Content**:
```markdown
# YSELA User Experience Journeys

<!-- @GENOME T2-NAV-YSL-EXP | ACTIVE | 2026-04-XX | parent:T1-YSL-002 | auto:/design | linked:/strategy -->

## Purpose

These documents describe the **experiential journey** of YSELA users - how they feel, what transforms, and the emotional arc of using YSELA.

**Different from `KARVIA_STRATEGY/1-PRODUCT/system-flows/`**:
- System flows = Technical (API calls, data flow, system behavior)
- Experience journeys = Emotional (feelings, transformation, moments that matter)

## Journeys

| Journey | Persona | Focus |
|---------|---------|-------|
| [CONSULTANT_EXPERIENCE.md](./CONSULTANT_EXPERIENCE.md) | Consultant | Multi-client advisory, building capability |
| [BUSINESS_OWNER_EXPERIENCE.md](./BUSINESS_OWNER_EXPERIENCE.md) | Business Owner | Visibility, control, peace of mind |
| [EMPLOYEE_EXPERIENCE.md](./EMPLOYEE_EXPERIENCE.md) | Employee | Purpose, recognition, growth |
```

---

## 5. Phase 3: Genome Tag Addition

### 5.1 Files Needing Genome Tags

#### YSELA Folder (21 files, 0 have genome)

| File | Proposed ID | Tier |
|------|-------------|------|
| `YSELA/README.md` | T1-NAV-YSL-001 | T1 |
| `YSELA/philosophy/YSELA_PHILOSOPHY.md` | T2-YSL-PHI-001 | T2 |
| `YSELA/philosophy/BBB_FRAMEWORK.md` | T2-YSL-PHI-002 | T2 |
| `YSELA/philosophy/BOOK_INSIGHTS.md` | T3-YSL-PHI-003 | T3 |
| `YSELA/philosophy/PHILOSOPHY_RESEARCH.md` | T3-YSL-PHI-004 | T3 |
| `YSELA/philosophy/PHILOSOPHY_PREWORK.md` | T3-YSL-PHI-005 | T3 |
| `YSELA/experience/UX_PRINCIPLES.md` | T2-YSL-UX-001 | T2 |
| `YSELA/experience/COACH_PERSONA.md` | T2-YSL-UX-002 | T2 |
| `YSELA/experience/PBL_GAMIFICATION.md` | T2-YSL-UX-003 | T2 |
| `YSELA/experience/USER_JOURNEY_SIMULATION.md` | T2-YSL-UX-004 | T2 |
| `YSELA/methodology/CONSULTANT_METHODOLOGY.md` | T2-YSL-MTD-001 | T2 |
| `YSELA/mockups/README.md` | T2-NAV-YSL-MCK | T2 |
| `YSELA/beta-launch/README.md` | T3-YSL-BTA-001 | T3 |

#### 2-TECHNICAL Folder (22 files, 2 have genome)

| File | Proposed ID | Tier |
|------|-------------|------|
| `0-SYSTEM-ARCHITECTURE/backend_architecture.md` | T2-ARC-SYS-001 | T2 |
| `0-SYSTEM-ARCHITECTURE/api_contracts.md` | T2-ARC-SYS-002 | T2 |
| `1-API-SPECIFICATION/JWT_SECURITY_DESIGN.md` | T2-ARC-SEC-001 | T2 |
| `1-API-SPECIFICATION/MULTI_TENANCY_SECURITY.md` | T2-ARC-SEC-002 | T2 |
| `1-API-SPECIFICATION/RBAC_IMPLEMENTATION_GUIDE.md` | T2-ARC-SEC-003 | T2 |
| `1-API-SPECIFICATION/THREAT_MODEL_MITIGATIONS.md` | T2-ARC-SEC-004 | T2 |
| `3-DATA/database_schema.md` | T2-ARC-DAT-001 | T2 |
| `3-DATA/CASCADE_DELETE_POLICY.md` | T2-ARC-DAT-002 | T2 |

### 5.2 Genome Tag Template

```markdown
<!-- @GENOME [ID] | [STATUS] | [DATE] | parent:[PARENT] | auto:[COMMANDS] | linked:[COMMANDS] -->
```

**Insert Location**: Within first 10 lines of file, after title

### 5.3 Post-Genome Update

After adding genome tags, regenerate the database:

```bash
cd /Users/sagarrs/Desktop/official_dev/karvia_business
node bramhi/scan-genome.js
```

**Verification**:
```bash
# Check genome-database.json was updated
ls -la bramhi/genome-database.json

# Verify new entries exist
grep "T1-KRV-001" bramhi/genome-database.json
grep "T1-YSL-001" bramhi/genome-database.json
```

---

## 6. Phase 4: Stale Doc Updates

### 6.1 Files Requiring Content Update

| File | Current State | Action |
|------|---------------|--------|
| `1-PRODUCT/PRODUCT_VISION.md` | Stale (Nov 2025) | Add transitioning header |
| `1-PRODUCT/KARVIA_ENGINE_OVERVIEW.md` | Stale (Dec 2025) | Add transitioning header |
| `1-PRODUCT/FEATURE_CATALOG.md` | Stale (Nov 2025) | Update status, add note |
| `1-PRODUCT/GO_TO_MARKET.md` | Stale (Nov 2025) | Update with Beta context |
| `1-PRODUCT/strategy/personas_and_jtbd.md` | Stale (Oct 2025) | Add genome, note review needed |

### 6.2 Transitioning Header Template

Add to top of docs being superseded:

```markdown
> **Document Status: TRANSITIONING**
>
> This document is being superseded by [NEW_DOC_NAME](./path/to/new/doc.md).
> Content will be archived after full transition.
> Last substantive update: [ORIGINAL_DATE]
```

### 6.3 Genome Status Update

Change genome status from `ACTIVE` to `TRANSITIONING`:

```markdown
<!-- @GENOME T1-PRD-001 | TRANSITIONING | 2026-04-XX | parent:ROOT | auto:/strategy | linked:/design -->
```

---

## 7. Phase 5: Sprint Archive

### 7.1 Sprints to Archive

Move to `KARVIA_STRATEGY/ARCHIVE/SPRINTS/`:

| Sprint | Status | Action |
|--------|--------|--------|
| SPRINT-1 (Complete) | Complete | Archive |
| SPRINT-2 (Complete) | Complete | Archive |
| SPRINT-3 (Complete) | Complete | Archive |
| SPRINT-4 (Complete) | Complete | Archive |
| SPRINT-5 (Complete) | Complete | Archive |
| SPRINT-6 (Complete) | Complete | Archive |
| SPRINT-7 (Complete) | Complete | Archive |
| SPRINT-8 (Complete) | Complete | Archive |
| SPRINT-9 (Complete) | Complete | Archive |
| SPRINT-10 (Complete) | Complete | Archive |
| SPRINT-11 (Complete) | Complete | Archive |
| SPRINT-12 (Complete) | Complete | Archive |
| SPRINT-13 (Complete) | Complete | Archive |
| SPRINT-14 (Skipped) | Skipped | Archive |
| SPRINT-15 (Complete) | Complete | Archive |
| SPRINT-15A (Complete) | Complete | Archive |
| SPRINT-16 (Complete) | Complete | Archive |
| SPRINT-16D (Superseded) | Superseded | Archive |
| SPRINT-17 (Complete) | Complete | Archive |
| SPRINT-18 (Complete) | Complete | Archive |
| SPRINT-18A (Hotfix) | Complete | Archive |
| SPRINT-18B (Planned) | Never started | Archive |
| SPRINT-18T (Test Simulation) | Complete | Archive |
| SPRINT-19 (Planned) | Never started | Archive |
| SPRINT-20 (Complete) | Complete | Archive |
| SPRINT-20.5 (Pre-Beta Bridge) | Complete | Archive |

**KEEP in active**:
| Sprint | Status | Action |
|--------|--------|--------|
| SPRINT-21 (In Progress) | Active | KEEP |

### 7.2 Archive Command

```bash
# Create archive folder
mkdir -p KARVIA_STRATEGY/ARCHIVE/SPRINTS

# Move completed sprints (one by one for safety)
mv "KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-1 (Complete)" KARVIA_STRATEGY/ARCHIVE/SPRINTS/
mv "KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-2 (Complete)" KARVIA_STRATEGY/ARCHIVE/SPRINTS/
# ... etc for all 26 sprints

# Verify SPRINT-21 still exists
ls -la "KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-21 (In Progress)"
```

### 7.3 Create Archive README

Create `KARVIA_STRATEGY/ARCHIVE/SPRINTS/README.md`:

```markdown
# Archived Sprints

<!-- @GENOME T3-NAV-ARC-SPR | ARCHIVED | 2026-04-XX | parent:T0-GOV-001 | auto:- | linked:- -->

This folder contains archived sprint documentation.

## Archived Sprints

| Sprint | Dates | Summary |
|--------|-------|---------|
| Sprint 1-20 | Oct 2025 - Mar 2026 | MVP Development |
| Sprint 20.5 | Mar-Apr 2026 | Pre-Beta Bridge |

## Active Sprints

Active sprints are located at: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/`

Currently active: **Sprint 21**
```

---

## 8. Phase 6: Cross-Reference Updates

### 8.1 Files Requiring Path Updates

| File | References To Update |
|------|---------------------|
| `ECOSYSTEM_ARCHITECTURE.md` | Add links to new 1-VISION docs |
| `CLAUDE.md` | Add 1-VISION to "Key Documentation Files" |
| `.claude/CONTEXT_REGISTRY.md` | Add new T1 docs |
| `KARVIA_STRATEGY/README.md` | Add 1-VISION section |
| `KARVIA_STRATEGY/1-PRODUCT/README.md` | Note backlog split |

### 8.2 ECOSYSTEM_ARCHITECTURE.md Updates

Add to "Key Documents" section:

```markdown
## Key Documents

### Vision Layer (T1)
- [KARVIA_ENGINE_VISION.md](KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md) - Engine vision
- [YSELA_PRODUCT_VISION.md](KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md) - Product vision
- [YSELA_VISION.md](YSELA/vision/YSELA_VISION.md) - Detailed YSELA vision
```

### 8.3 CLAUDE.md Updates

Add to "Key Documentation Files" section:

```markdown
**Vision Documents** (T1):
- `KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md` - What KARVIA engine is
- `YSELA/vision/YSELA_VISION.md` - What YSELA product is
```

---

## 9. Verification Procedures

### 9.1 Pre-Execution Verification

Before starting, verify:

```bash
# 1. Git status is clean
git status
# Expected: nothing to commit, working tree clean

# 2. All tests pass
npm test
# Expected: All tests pass

# 3. Server starts
npm run dev:server &
sleep 5
curl http://localhost:5000/health
# Expected: OK response
kill %1
```

### 9.2 Post-Phase Verification

After each phase, verify:

```bash
# 1. Git diff shows only expected changes
git diff --stat

# 2. No code files modified (unless intentional)
git diff --name-only | grep -E "\.(js|ts|json|yaml)$"
# Expected: Empty or only genome-database.json

# 3. Server still starts
npm run dev:server &
sleep 5
curl http://localhost:5000/health
kill %1

# 4. Tests still pass
npm test
```

### 9.3 Final Verification Checklist

- [ ] All tests pass: `npm test`
- [ ] Server starts: `npm run dev:server`
- [ ] OpenAPI spec loads: Check `http://localhost:5000/api-docs`
- [ ] Playwright tests run: `npm run test:bst`
- [ ] No broken links in new docs (manual spot check)
- [ ] Genome scanner runs: `node bramhi/scan-genome.js`
- [ ] All new docs have genome tags

---

## 10. Rollback Procedures

### 10.1 Git-Based Rollback

All changes are to documentation only. Rollback is simple:

```bash
# Option 1: Rollback specific file
git checkout HEAD -- path/to/file.md

# Option 2: Rollback entire phase
git stash

# Option 3: Hard reset (nuclear option)
git reset --hard HEAD
```

### 10.2 Rollback Triggers

Execute rollback if:
- [ ] Any test fails after changes
- [ ] Server fails to start
- [ ] OpenAPI spec fails to load
- [ ] Playwright tests fail

### 10.3 Rollback Plan by Phase

| Phase | Rollback Command |
|-------|------------------|
| Phase 1 | `rm -rf KARVIA_STRATEGY/1-VISION` |
| Phase 2 | `rm -rf YSELA/backlog YSELA/user-journeys` |
| Phase 3 | `git checkout HEAD -- [files with genome]` |
| Phase 4 | `git checkout HEAD -- [updated files]` |
| Phase 5 | `mv ARCHIVE/SPRINTS/* 3-DELIVERY/1-SPRINTS/` |
| Phase 6 | `git checkout HEAD -- [cross-ref files]` |

---

## 11. Audit Checklist for Session #151

### 11.1 Pre-Audit Verification

Before execution session, auditor should verify:

**Code Dependencies**:
- [ ] Confirm `package.json` test paths unchanged
- [ ] Confirm `server/index.js` openapi path unchanged
- [ ] Confirm `playwright.config.ts` test dir unchanged
- [ ] Confirm `.eslintrc.js` ignore pattern unchanged

**Current State**:
- [ ] Git repository is clean
- [ ] All tests pass
- [ ] Server starts successfully
- [ ] Genome scanner runs without errors

### 11.2 Plan Review

- [ ] Phase 1 tasks are clear and complete
- [ ] Phase 2 tasks are clear and complete
- [ ] Phase 3 genome tag list is complete
- [ ] Phase 4 stale doc list is complete
- [ ] Phase 5 archive list is correct (26 sprints)
- [ ] Phase 6 cross-reference list is complete

### 11.3 Risk Assessment

- [ ] No unsafe operations identified
- [ ] All operations marked SAFE or LOW RISK
- [ ] Rollback procedures documented
- [ ] Verification procedures documented

### 11.4 Sign-Off

```
Audit Completed By: _______________
Date: _______________
Approved for Execution: [ ] Yes [ ] No

Notes:
_________________________________
_________________________________
```

---

## 15. Session #152: Product Vision Finalization

### 15.1 Session Overview

**Session ID**: #152
**Type**: Strategy Session
**Prerequisite**: Session #151 Audit passed
**Objective**: Finalize all T1 Vision documents for KARVIA and YSELA

### 15.2 Stakeholder Roles

| Stakeholder | Perspective | Key Questions to Answer |
|-------------|-------------|------------------------|
| **CEO** | Business viability | Is this vision commercially viable? Does it differentiate us? |
| **CPO** | User value | Does this solve real user problems? Is the experience compelling? |
| **CTO** | Technical feasibility | Can we build this? Are there technical blockers? |
| **Architect** | System design | Does this fit our architecture? Are there integration concerns? |

### 15.3 Session Agenda

```
SESSION #152 AGENDA (Estimated: 2-3 hours)
═══════════════════════════════════════════

Part 1: KARVIA Engine Vision (45-60 min)
────────────────────────────────────────
1. Review KARVIA_ENGINE_OVERVIEW.md (current state)
2. Review KARVIA_1.0_CAPABILITIES.md (what engine does)
3. Draft/finalize KARVIA_ENGINE_VISION.md
4. CTO validation: Technical accuracy
5. Architect validation: Architecture alignment

Part 2: YSELA Product Vision (45-60 min)
────────────────────────────────────────
1. Review YSELA_VISION.md (draft)
2. Review YSELA_PHILOSOPHY.md (core beliefs)
3. Finalize YSELA_VISION.md
4. CPO validation: User value proposition
5. CEO validation: Business viability

Part 3: Ecosystem Alignment (30-45 min)
───────────────────────────────────────
1. Review ECOSYSTEM_ARCHITECTURE.md
2. Ensure KARVIA/YSELA/iBrain separation is clear
3. Update cross-references
4. Validate three-layer model accuracy

Part 4: User Journey Review (30-45 min)
───────────────────────────────────────
1. Review existing system-flows/*.md (technical)
2. Draft experiential user-journeys (YSELA layer)
3. Ensure technical and experiential journeys align
4. Identify any gaps
```

### 15.4 Deliverables

| Deliverable | Status Before | Status After | Owner |
|-------------|---------------|--------------|-------|
| KARVIA_ENGINE_VISION.md | Draft/New | FINALIZED | CTO |
| YSELA_VISION.md | Draft | FINALIZED | CPO |
| YSELA_PRODUCT_VISION.md (link) | New | CREATED | Product |
| ECOSYSTEM_ARCHITECTURE.md | Current | UPDATED | Architect |
| User Experience Journeys (3) | Missing | DRAFTED | CPO |

### 15.5 Session Entry Checklist

Before starting Session #152, verify:

- [ ] Session #151 audit passed and signed off
- [ ] Git status is clean
- [ ] All prerequisite docs exist:
  - [ ] `KARVIA_STRATEGY/1-PRODUCT/KARVIA_ENGINE_OVERVIEW.md`
  - [ ] `KARVIA_STRATEGY/1-PRODUCT/KARVIA_1.0_CAPABILITIES.md`
  - [ ] `YSELA/vision/YSELA_VISION.md`
  - [ ] `YSELA/philosophy/YSELA_PHILOSOPHY.md`
  - [ ] `ECOSYSTEM_ARCHITECTURE.md`
- [ ] Session doc loading list prepared (Section 5.1)

### 15.6 Session Exit Criteria

Session #152 is complete when:

- [ ] KARVIA_ENGINE_VISION.md has genome tag T1-KRV-001 and status ACTIVE
- [ ] YSELA_VISION.md has genome tag T1-YSL-002 and status ACTIVE
- [ ] All T1 docs have stakeholder sign-off comments
- [ ] Change cascade identified (which T2 docs need updates)
- [ ] Session #153 input list prepared

### 15.7 Change Cascade Tracking

After finalizing T1 docs, document what T2 docs need updates:

```markdown
## T1 → T2 Cascade Tracker

### From KARVIA_ENGINE_VISION.md Changes:
- [ ] backend_architecture.md - Update engine description
- [ ] api_contracts.md - Align terminology
- [ ] database_schema.md - Verify model descriptions
- [ ] KARVIA_BACKLOG.md - Update backlog priorities

### From YSELA_VISION.md Changes:
- [ ] UX_PRINCIPLES.md - Align to vision
- [ ] COACH_PERSONA.md - Update persona details
- [ ] PBL_GAMIFICATION.md - Update gamification approach
- [ ] YSELA_BACKLOG.md - Update backlog priorities
- [ ] user-journeys/*.md - Create/update journeys
```

---

## 16. Session #153: Technical Docs Update

### 16.1 Session Overview

**Session ID**: #153
**Type**: Technical Strategy Session
**Prerequisite**: Session #152 complete (T1 docs finalized)
**Objective**: Update all T2 Technical docs to align with finalized T1 vision

### 16.2 Stakeholder Roles

| Stakeholder | Perspective | Key Questions to Answer |
|-------------|-------------|------------------------|
| **CTO** | Technical direction | Does technical direction align with vision? |
| **Architect** | System design | Are all architecture docs consistent? |
| **Tech Lead** | Implementation | Is this implementable? Any blockers? |

### 16.3 Session Agenda

```
SESSION #153 AGENDA (Estimated: 2-3 hours)
═══════════════════════════════════════════

Part 1: Architecture Docs (60-75 min)
─────────────────────────────────────
1. Load finalized KARVIA_ENGINE_VISION.md
2. Review backend_architecture.md
   - Update to align with engine vision
   - Add/update genome tag
3. Review api_contracts.md
   - Verify terminology matches vision
   - Update contract descriptions
4. Architect validation

Part 2: Data Layer Docs (30-45 min)
───────────────────────────────────
1. Review database_schema.md
   - Align model descriptions with vision
   - Verify cascade delete policies
2. Review CASCADE_DELETE_POLICY.md
3. CTO validation

Part 3: Security Docs (30-45 min)
─────────────────────────────────
1. Review JWT_SECURITY_DESIGN.md
2. Review MULTI_TENANCY_SECURITY.md
3. Review RBAC_IMPLEMENTATION_GUIDE.md
4. Review THREAT_MODEL_MITIGATIONS.md
5. Verify all align with engine capabilities

Part 4: Cross-Reference Verification (15-30 min)
────────────────────────────────────────────────
1. Run cascade verification commands (Section 4.2)
2. Verify all T2 docs reference T1 correctly
3. Update genome tags with proper parent refs
4. Regenerate genome-database.json
```

### 16.4 Deliverables

| Deliverable | Updates Required | Owner |
|-------------|-----------------|-------|
| backend_architecture.md | Align to engine vision | Architect |
| api_contracts.md | Terminology alignment | Architect |
| database_schema.md | Model descriptions | CTO |
| JWT_SECURITY_DESIGN.md | Verify alignment | CTO |
| MULTI_TENANCY_SECURITY.md | Verify alignment | CTO |
| RBAC_IMPLEMENTATION_GUIDE.md | Verify alignment | CTO |
| THREAT_MODEL_MITIGATIONS.md | Verify alignment | CTO |
| genome-database.json | Regenerate | Auto |

### 16.5 Session Entry Checklist

Before starting Session #153, verify:

- [ ] Session #152 complete
- [ ] T1 docs finalized:
  - [ ] `KARVIA_STRATEGY/1-VISION/KARVIA_ENGINE_VISION.md` - ACTIVE
  - [ ] `YSELA/vision/YSELA_VISION.md` - ACTIVE
- [ ] Change cascade tracker from Session #152 available
- [ ] All T2 docs exist and are readable
- [ ] Session doc loading list prepared (Section 5.1)

### 16.6 Session Exit Criteria

Session #153 is complete when:

- [ ] All T2 architecture docs updated
- [ ] All T2 security docs verified
- [ ] All T2 data docs updated
- [ ] All T2 docs have genome tags with correct parent refs
- [ ] genome-database.json regenerated
- [ ] No terminology inconsistencies between T1 and T2
- [ ] Cascade verification commands pass

### 16.7 Consistency Verification Commands

Run after all updates:

```bash
# 1. Verify T1 → T2 terminology consistency
grep -i "karvia engine" KARVIA_STRATEGY/2-TECHNICAL/**/*.md
# Should match vision doc terminology

# 2. Verify parent references
grep "parent:T1-KRV-001" KARVIA_STRATEGY/2-TECHNICAL/**/*.md
# Should return T2 docs that reference KARVIA vision

# 3. Verify no stale references
grep -i "product vision" KARVIA_STRATEGY/2-TECHNICAL/**/*.md
# Should NOT reference old product_vision.md

# 4. Regenerate genome database
node bramhi/scan-genome.js

# 5. Verify database includes new docs
grep "T1-KRV-001\|T1-YSL-002" bramhi/genome-database.json
```

### 16.8 Post-Session Actions

After Session #153 completes:

1. **Commit T1 + T2 changes together** (atomic commit)
2. **Update SESSION_LOG.md** with sessions 152-153 summary
3. **Ready for Session #154+** (Phase 3-6 execution)

---

## Summary

### Complete Session Roadmap

| Session | Purpose | Deliverable | Stakeholders | Status |
|---------|---------|-------------|--------------|--------|
| #150 | Planning | This execution plan | All | ✅ COMPLETE |
| #151 | Audit | Signed audit report | QA Lead | ✅ COMPLETE (Apr 5) |
| #152 | Vision Finalization | Finalized T1 docs | CEO, CPO, CTO, Architect | ✅ COMPLETE (Apr 5) |
| #153 | Technical Update | Updated T2 docs | CTO, Architect, Tech Lead | ⏳ NEXT |
| #154+ | Execution | Phases 3-6 complete | All | ✅ DONE IN #152 |

### Execution Order

1. **Phase 1**: Create 1-VISION folder and 4 T1 docs (~90 min) ✅ COMPLETE (Session #152)
2. **Phase 2**: Create backlogs and 3 experience journeys (~95 min) ⏸️ DEFERRED (CPO ownership)
3. **Phase 3**: Add genome tags to 40+ files (~40 min) ✅ COMPLETE (already present)
4. **Phase 4**: Update 5 stale docs (~50 min) ✅ COMPLETE (Session #152)
5. **Phase 5**: Archive 26 sprints (~15 min) ✅ COMPLETE (Session #152)
6. **Phase 6**: Update 5 cross-reference files (~30 min) ✅ COMPLETE (Session #152)

**Total Estimated Time**: ~5-6 hours
**Actual Time**: ~3 hours (Sessions #151 + #152)

### Risk Summary

| Risk Level | Count | Description |
|------------|-------|-------------|
| SAFE | 15 tasks | New files, no dependencies |
| LOW | 8 tasks | Content updates, verify after |
| UNSAFE | 0 tasks | None planned |

### Break-Proof Guarantees

1. ✅ No folder renames that code depends on
2. ✅ No file moves that code depends on
3. ✅ No changes to `openapi.yaml` location
4. ✅ No changes to Playwright test location
5. ✅ All changes reversible via git
6. ✅ Verification procedures at each phase
7. ✅ Rollback procedures documented

---

## Full Session Timeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        KARVIA/YSELA RESTRUCTURE TIMELINE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Session #150          Session #151         Session #152         Session #153
│  ═══════════          ═══════════         ═══════════         ═══════════
│  PLANNING              AUDIT               VISION              TECHNICAL
│  (Complete)            (Next)              FINALIZATION        UPDATE
│                                                                             │
│  Deliverables:         Deliverables:       Deliverables:       Deliverables:
│  • This plan           • Sign-off          • KARVIA_ENGINE     • backend_arch
│  • Gap analysis        • Risk verified     • YSELA_VISION      • api_contracts
│  • Dependency map      • Code checked      • User journeys     • database_schema
│                                            • Cascade tracker   • Security docs
│                                                                             │
│  Stakeholders:         Stakeholders:       Stakeholders:       Stakeholders:
│  • Planning team       • QA Lead           • CEO               • CTO
│                        • Reviewer          • CPO               • Architect
│                                            • CTO               • Tech Lead
│                                            • Architect                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Session #154+                                                              │
│  ═══════════                                                                │
│  EXECUTION (Phases 3-6)                                                     │
│                                                                             │
│  • Phase 3: Genome tags (40+ files)                                         │
│  • Phase 4: Stale doc updates (5 files)                                     │
│  • Phase 5: Sprint archive (26 sprints)                                     │
│  • Phase 6: Cross-reference updates (5 files)                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**Plan Status**: ✅ EXECUTION COMPLETE (Apr 5, 2026)

### Completed Sessions
- **Session #151 (Audit)**: COMPLETE - Verified zero code impact, approved plan
- **Session #152 (Vision + Execution)**: COMPLETE - T1 docs created, Phases 3-6 executed

### Remaining Work
- **Session #153 (Technical Update)**: OPTIONAL - T2 docs alignment (can proceed to Beta without)
- **Phase 2 (CPO Work)**: DEFERRED - YSELA backlog, experience journeys (post-restructure)
