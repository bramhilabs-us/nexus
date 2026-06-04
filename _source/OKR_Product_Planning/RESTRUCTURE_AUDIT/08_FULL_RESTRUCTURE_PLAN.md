# KARVIA_STRATEGY Full Restructure Plan

<!-- @GENOME T3-SPR-RESTR-001 | ACTIVE | 2026-04-05 | parent:T0-GOV-001 | auto:- | linked:/strategy -->

**Version**: 1.0
**Created**: April 5, 2026
**Status**: EXECUTION READY
**Session**: #150 - Doc Restructure Phase 3

---

## Impact Analysis Summary

### Code-Level Dependencies (CANNOT break)

| File | Path Referenced | Impact |
|------|-----------------|--------|
| `package.json:36-38` | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/PLAYWRIGHT/` | Test scripts |
| `server/index.js:148` | `KARVIA_STRATEGY/2-TECHNICAL/1-API-SPECIFICATION/openapi.yaml` | API docs |
| `playwright.config.ts:13` | `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/PLAYWRIGHT/tests` | Test dir |

**Conclusion**: Folder names `2-TECHNICAL/`, `3-DELIVERY/` are referenced in code. These CANNOT be renamed without code changes.

### Documentation Dependencies (191 files)

| Category | Count | Action Required |
|----------|-------|-----------------|
| CLAUDE.md & .claude/ files | 15 | Update paths if changed |
| Sprint docs (archived) | 80+ | No action - moving to ARCHIVE |
| Active docs referencing paths | 30+ | Update cross-references |
| Legacy/ARCHIVE docs | 60+ | No action |

### Safe Operations (No Code Impact)

| Operation | Risk | Notes |
|-----------|------|-------|
| Create `1-VISION/` folder | SAFE | New folder, no existing refs |
| Move completed sprints to ARCHIVE | SAFE | Just docs, no code refs |
| Rename files in `1-PRODUCT/` | SAFE | No code references |
| Create new KARVIA_ENGINE_VISION.md | SAFE | New file |
| Update file contents | SAFE | Content changes only |
| Archive stale docs | SAFE | Moving, not deleting |

### Risky Operations (Requires Code Update)

| Operation | Risk | Mitigation |
|-----------|------|------------|
| Rename `2-TECHNICAL/` | HIGH | Don't rename - keep name |
| Rename `3-DELIVERY/` | HIGH | Don't rename - keep name |
| Move `openapi.yaml` | HIGH | Keep in place |
| Move Playwright tests | HIGH | Keep in place |

---

## Execution Plan

### Phase 1: Foundation Documents (P0)

#### Task 1.1: Create KARVIA_ENGINE_VISION.md
**Priority**: P0 | **Risk**: SAFE | **Est**: 30 min

- [ ] Create `KARVIA_STRATEGY/1-VISION/` folder
- [ ] Create `KARVIA_ENGINE_VISION.md` with:
  - Clear statement: KARVIA is the OKR engine, not the product
  - Technical capabilities (pulled from KARVIA_1.0_CAPABILITIES.md)
  - Architecture reference (link to 2-TECHNICAL)
  - Explicit separation from YSELA

**Sources to consolidate**:
- `PRODUCT_VISION.md` (technical sections)
- `KARVIA_ENGINE_OVERVIEW.md` (all)
- `KARVIA_1.0_CAPABILITIES.md` (reference, don't duplicate)

#### Task 1.2: Create YSELA_PRODUCT_VISION.md (link file)
**Priority**: P0 | **Risk**: SAFE | **Est**: 10 min

- [ ] Create `KARVIA_STRATEGY/1-VISION/YSELA_PRODUCT_VISION.md`
- [ ] Content: Link/redirect to `YSELA/vision/YSELA_VISION.md`
- [ ] Explain relationship: YSELA wraps KARVIA

#### Task 1.3: Update PRODUCT_VISION.md header
**Priority**: P1 | **Risk**: SAFE | **Est**: 10 min

- [ ] Add clear header: "This document is being superseded by KARVIA_ENGINE_VISION.md"
- [ ] Update genome tag status to TRANSITIONING
- [ ] Add redirect note

#### Task 1.4: Archive product_overview.md
**Priority**: P2 | **Risk**: SAFE | **Est**: 5 min

- [ ] Move to `1-PRODUCT/_archive/`
- [ ] Content merged into KARVIA_ENGINE_VISION.md

---

### Phase 2: Sprint Archive Cleanup (P1)

#### Task 2.1: Move completed sprints to ARCHIVE
**Priority**: P1 | **Risk**: SAFE | **Est**: 15 min

Sprints to move to `ARCHIVE/SPRINTS/`:
- [ ] SPRINT-1 (Complete)
- [ ] SPRINT-2 (Complete)
- [ ] SPRINT-3 (Complete)
- [ ] SPRINT-4 (Complete)
- [ ] SPRINT-5 (Complete)
- [ ] SPRINT-6 (Complete)
- [ ] SPRINT-7 (Complete)
- [ ] SPRINT-8 (Complete)
- [ ] SPRINT-9 (Complete)
- [ ] SPRINT-10 (Complete)
- [ ] SPRINT-11 (Complete)
- [ ] SPRINT-12 (Complete)
- [ ] SPRINT-13 (Complete)
- [ ] SPRINT-14 (Skipped)
- [ ] SPRINT-15 (Complete)
- [ ] SPRINT-15A (Complete)
- [ ] SPRINT-16 (Complete)
- [ ] SPRINT-16D (Superseded by 20.5)
- [ ] SPRINT-17 (Complete)
- [ ] SPRINT-18 (Complete)
- [ ] SPRINT-18A (Hotfix)
- [ ] SPRINT-18B (Planned)
- [ ] SPRINT-18T (Test Simulation)
- [ ] SPRINT-19 (Planned)
- [ ] SPRINT-20 (Complete)
- [ ] SPRINT-20.5 (Pre-Beta Bridge)

**Keep in active**:
- [ ] SPRINT-21 (In Progress) - KEEP

#### Task 2.2: Create ARCHIVE/SPRINTS/README.md
**Priority**: P2 | **Risk**: SAFE | **Est**: 5 min

- [ ] Create index of archived sprints
- [ ] Note: Historical reference only

---

### Phase 3: YSELA Completion (P1)

#### Task 3.1: Finalize YSELA_VISION.md
**Priority**: P0 | **Risk**: SAFE | **Est**: 30 min

- [ ] Review current draft at `YSELA/vision/YSELA_VISION.md`
- [ ] Add clear KARVIA separation section
- [ ] Add links to KARVIA_ENGINE_VISION.md
- [ ] Update genome tag

#### Task 3.2: Split MASTER_PRODUCT_BACKLOG.md
**Priority**: P1 | **Risk**: SAFE | **Est**: 20 min

- [ ] Read current `1-PRODUCT/product_backlog/MASTER_PRODUCT_BACKLOG.md`
- [ ] Create `YSELA/backlog/YSELA_BACKLOG.md` (experience items)
- [ ] Create `1-PRODUCT/product_backlog/KARVIA_BACKLOG.md` (technical items)
- [ ] Update MASTER_PRODUCT_BACKLOG.md to be index/redirect

#### Task 3.3: Create YSELA User Experience Journeys
**Priority**: P1 | **Risk**: SAFE | **Est**: 45 min

- [ ] Create `YSELA/user-journeys/CONSULTANT_EXPERIENCE.md`
- [ ] Create `YSELA/user-journeys/BUSINESS_OWNER_EXPERIENCE.md`
- [ ] Create `YSELA/user-journeys/EMPLOYEE_EXPERIENCE.md`

**Key difference from system-flows/**:
- system-flows = technical (what the system does)
- user-journeys = experiential (how users feel, transformations)

#### Task 3.4: Extract BBB from product_philosophy.md
**Priority**: P2 | **Risk**: SAFE | **Est**: 15 min

- [ ] Read `1-PRODUCT/strategy/product_philosophy.md`
- [ ] Create `YSELA/philosophy/BBB_EXTRACT.md` (if not exists)
- [ ] Extract BBB-specific content

---

### Phase 4: Cross-Reference Updates (P2)

#### Task 4.1: Update ECOSYSTEM_ARCHITECTURE.md
**Priority**: P1 | **Risk**: SAFE | **Est**: 15 min

- [ ] Add links to new vision docs
- [ ] Update folder structure section
- [ ] Verify YSELA/KARVIA/iBrain explanation is current

#### Task 4.2: Update CLAUDE.md
**Priority**: P1 | **Risk**: SAFE | **Est**: 10 min

- [ ] Update "Key Documentation Files" section
- [ ] Add reference to KARVIA_ENGINE_VISION.md
- [ ] Update folder structure if changed

#### Task 4.3: Update README.md files
**Priority**: P2 | **Risk**: SAFE | **Est**: 20 min

- [ ] Update `KARVIA_STRATEGY/README.md`
- [ ] Update `KARVIA_STRATEGY/1-PRODUCT/README.md`
- [ ] Create `KARVIA_STRATEGY/1-VISION/README.md`
- [ ] Update `KARVIA_STRATEGY/ARCHIVE/README.md`

#### Task 4.4: Update genome tags on stale docs
**Priority**: P2 | **Risk**: SAFE | **Est**: 15 min

Documents needing genome tag updates:
- [ ] `PRODUCT_VISION.md` - mark TRANSITIONING
- [ ] `KARVIA_ENGINE_OVERVIEW.md` - mark TRANSITIONING
- [ ] `FEATURE_CATALOG.md` - update date
- [ ] `GO_TO_MARKET.md` - update date
- [ ] `00_MASTER_STRATEGY.md` - add genome tag

---

### Phase 5: Cleanup & Verification (P3)

#### Task 5.1: Consolidate overlapping docs
**Priority**: P3 | **Risk**: SAFE | **Est**: 15 min

- [ ] Mark `product_overview.md` as archived
- [ ] Mark duplicates in strategy/ folder

#### Task 5.2: Update RESTRUCTURE_MASTER_PLAN
**Priority**: P2 | **Risk**: SAFE | **Est**: 10 min

- [ ] Mark all tasks complete
- [ ] Update status to COMPLETE

#### Task 5.3: Verify no broken references
**Priority**: P2 | **Risk**: SAFE | **Est**: 10 min

- [ ] Grep for old file names
- [ ] Fix any broken links

---

## Task Execution Order

### Batch 1: Foundation (Do First)
1. Task 1.1: Create KARVIA_ENGINE_VISION.md
2. Task 1.2: Create YSELA_PRODUCT_VISION.md link
3. Task 3.1: Finalize YSELA_VISION.md

### Batch 2: Backlog & Journeys
4. Task 3.2: Split MASTER_PRODUCT_BACKLOG.md
5. Task 3.3: Create YSELA User Experience Journeys
6. Task 3.4: Extract BBB

### Batch 3: Archive & Cleanup
7. Task 2.1: Move completed sprints to ARCHIVE
8. Task 2.2: Create ARCHIVE/SPRINTS/README.md
9. Task 1.3: Update PRODUCT_VISION.md header
10. Task 1.4: Archive product_overview.md

### Batch 4: Cross-References
11. Task 4.1: Update ECOSYSTEM_ARCHITECTURE.md
12. Task 4.2: Update CLAUDE.md
13. Task 4.3: Update README.md files
14. Task 4.4: Update genome tags

### Batch 5: Final
15. Task 5.1: Consolidate overlapping docs
16. Task 5.2: Update RESTRUCTURE_MASTER_PLAN
17. Task 5.3: Verify no broken references

---

## Success Criteria

### Must Have
- [ ] KARVIA_ENGINE_VISION.md exists and clearly separates engine from product
- [ ] YSELA_VISION.md is finalized
- [ ] Backlog split into YSELA and KARVIA
- [ ] Sprint archive cleaned up
- [ ] No broken code references

### Should Have
- [ ] All stale docs have updated genome tags
- [ ] README files updated
- [ ] ECOSYSTEM_ARCHITECTURE.md updated

### Nice to Have
- [ ] All 3 YSELA experience journeys created
- [ ] BBB extract created

---

## Rollback Plan

If something breaks:
1. All changes are to documentation only
2. Git history preserves all previous states
3. No code changes required
4. `git checkout` can restore any file

---

**Ready for execution. Proceed with Batch 1?**
