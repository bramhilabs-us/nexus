# Legacy Folders Inventory

<!-- @GENOME T3-PRD-010 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:- | linked:/audit -->

**Version**: 1.0.0
**Created**: March 30, 2026
**Purpose**: Inventory of legacy folders pending migration to KARVIA_STRATEGY/

---

## Overview

Two legacy folders exist at the project root that predate the KARVIA_STRATEGY/ reorganization. These folders contain historical documentation that may still be referenced but should eventually be migrated or archived.

---

## Folder 1: Karvia_OKR_Product_Planning/

### Contents

| Item | Type | Description |
|------|------|-------------|
| 00_Prerequisites/ | Directory | Setup requirements |
| 01_MVP/ | Directory | MVP planning docs |
| 03_Product_Foundation/ | Directory | Foundation documents |
| Archive/ | Directory | Archived documents |
| Daily_Handoffs/ | Directory | Historical sprint handoffs |
| QA/ | Directory | QA documents |
| Review_Docs/ | Directory | Review documents |
| MASTER_DEV_LIST.md | File | Development tracking (historical) |
| MASTER_IMPROVEMENTS_LIST.md | File | Improvement tracking (historical) |
| MASTER_ISSUES_LIST.md | File | Issue tracking (historical) |
| MVP_SCOPE_REVISION.md | File | MVP scope (historical) |

### Current References

| Referencing Document | Reference Type |
|---------------------|----------------|
| .claude/CODEBASE_STRUCTURE.md | Structure diagram |
| .claude/DATA_STRUCTURE.md | Structure diagram |
| KARVIA_STRATEGY/00_MASTER_STRATEGY.md | Multiple links |
| KARVIA_STRATEGY/1-PRODUCT/documentation/PROJECT_STRUCTURE.md | Multiple links |

### Migration Recommendation

**Status**: LOW PRIORITY (post-Beta)

**Recommendation**:
1. Keep folder as-is during Beta
2. After Beta stabilization:
   - Archive Daily_Handoffs/ to KARVIA_STRATEGY/archive/
   - Migrate active MASTER_*_LIST.md content to current sprint tracking
   - Update references in active docs to point to KARVIA_STRATEGY/ equivalents

---

## Folder 2: Karvia_OKR_Mockups/

### Contents

| Item | Type | Description |
|------|------|-------------|
| *.html | Files (15) | HTML mockups for various pages |
| Design_elements/ | Directory | Design elements |
| Finalised_Mockups/ | Directory | Final mockups |
| MVP_Nov30Rel/ | Directory | MVP release mockups |
| _shared_navigation.html | File | Navigation template |
| README.md | File | Mockups overview |

### Current References

| Referencing Document | Reference Type |
|---------------------|----------------|
| .claude/CODEBASE_STRUCTURE.md | Structure diagram |
| .claude/DATA_STRUCTURE.md | Structure diagram |
| KARVIA_STRATEGY/00_MASTER_STRATEGY.md | Mockups reference |
| KARVIA_STRATEGY/1-PRODUCT/documentation/PROJECT_STRUCTURE.md | Structure diagram |

### Migration Recommendation

**Status**: LOW PRIORITY (post-Beta)

**Recommendation**:
1. Keep folder as-is during Beta
2. After Beta stabilization:
   - Move to KARVIA_STRATEGY/1-PRODUCT/mockups/archive/
   - Keep as reference for historical design decisions
   - New mockups go to KARVIA_STRATEGY/1-PRODUCT/mockups/

---

## Action Plan (Post-Beta)

### Phase 1: Documentation Update (Sprint 22+)
- [ ] Update .claude/CODEBASE_STRUCTURE.md to remove legacy references
- [ ] Update .claude/DATA_STRUCTURE.md to remove legacy references
- [ ] Update KARVIA_STRATEGY/00_MASTER_STRATEGY.md links

### Phase 2: Content Migration (Sprint 23+)
- [ ] Archive Daily_Handoffs/ historical content
- [ ] Migrate any still-relevant MASTER_*_LIST.md items
- [ ] Move mockups to KARVIA_STRATEGY/1-PRODUCT/mockups/archive/

### Phase 3: Cleanup (Sprint 24+)
- [ ] Rename folders to indicate archived status
- [ ] Or delete if all content migrated

---

## Current Decision: NO ACTION

**Rationale**:
1. Beta launch is priority (Apr 10, 2026)
2. Breaking references now adds risk
3. Content is historical, not actively used
4. Migration can wait until post-Beta stabilization

**Owner**: Product Team
**Review Date**: Post-Sprint 21 (after Beta launch)
