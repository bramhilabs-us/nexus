# Documentation Sync & Update Plan

**Created**: April 3, 2026
**Purpose**: Identify all stale, outdated, or conflicting KARVIA docs and plan updates
**Status**: AUDIT COMPLETE - Update Plan Ready
**Impact**: Zero codebase changes - documentation only

---

## Executive Summary

### Problem Statement

After the YSELA/KARVIA separation and KARVIA 1.0 lock-in, many docs will be:
- **Stale**: Last updated months ago with outdated information
- **Broken**: Referencing files that are moving or being renamed
- **Conflicting**: Using old terminology or structure
- **Misinforming**: Showing wrong dates, percentages, or status

### Key Findings

| Category | Count | Impact |
|----------|-------|--------|
| **Severely stale docs** (5+ months old) | 2 major | HIGH |
| **Docs referencing moving files** | 20+ | MEDIUM |
| **Docs using old terminology** | 15+ | LOW |
| **Navigation READMEs needing update** | 56 | MEDIUM |
| **Docs with broken genome tags** | 2 | LOW |

---

## Stale Documentation Inventory

### CRITICAL: Major Navigation Docs (5+ Months Stale)

#### 1. KARVIA_STRATEGY/README.md
**Last Updated**: October 24, 2025 (6 months old!)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Last Updated | Oct 24, 2025 | Apr 2026 |
| Launch Target | January 31, 2026 | April 17, 2026 (Recovery) |
| Current Sprint | "Week 6" | Sprint 21 |
| Progress | "41% Complete (5.5/12 weeks)" | Sprint 21 progress |
| Structure | Old folder structure | Current structure |
| Tech Stack | PostgreSQL deprecated notice | Remove (fully migrated) |
| Block Count | "7 blocks" | Verify current |

**Content to Update**:
- [ ] Remove all "Week X" references (we use Sprint N now)
- [ ] Update folder structure diagram
- [ ] Update progress status
- [ ] Remove PostgreSQL migration notices (complete)
- [ ] Add YSELA/KARVIA separation context
- [ ] Update launch date to April 17, 2026

---

#### 2. KARVIA_STRATEGY/1-PRODUCT/README.md
**Last Updated**: November 2025 (5 months old!)

| Issue | Current | Should Be |
|-------|---------|-----------|
| Last Updated | November 2025 | Apr 2026 |
| Launch Date | January 31, 2026 | April 17, 2026 |
| Backend | "95% complete" | Verify current |
| Frontend | "50% complete" | Verify current |
| Testing | "20% coverage" | 50% (per Sprint 15-A) |
| User Journeys | `user-journeys/` | `system-flows/` (after rename) |
| Structure | Old | Add YSELA separation context |

**Content to Update**:
- [ ] Update all progress percentages
- [ ] Add YSELA/KARVIA layer explanation
- [ ] Update folder references
- [ ] Update test coverage (50% not 20%)
- [ ] Update launch date
- [ ] Reference new YSELA/ folder

---

### HIGH PRIORITY: Docs Referencing Moving Files

These docs reference YSELA files that will move to `YSELA/`:

| Document | References | Action Needed |
|----------|------------|---------------|
| `ECOSYSTEM_ARCHITECTURE.md` | `YSELA_PHILOSOPHY.md` path | Update path after move |
| `PRODUCT_ARCHITECTURE.md` | `YSELA_PHILOSOPHY.md`, `BBB_FRAMEWORK.md` | Update paths |
| `PRODUCT_VISION.md` | `YSELA_PHILOSOPHY.md`, `COACH_PERSONA` | Update paths |
| `00_BETA_RELEASE_PROJECT_ROADMAP.md` | `YSELA_PHILOSOPHY.md`, `PBL_GAMIFICATION` | Update paths |
| `MODULE_ARCHITECTURE.md` | Multiple YSELA refs | Update paths |
| `MVP_STRATEGY_V5.md` | `YSELA_PHILOSOPHY.md` | Update paths |
| `PRODUCT_STRATEGY_MASTER.md` | `YSELA_PHILOSOPHY.md` | Update paths |
| `Sprint 21 docs` | Multiple YSELA refs | Update paths |

**Total files affected**: ~20 files

---

### MEDIUM PRIORITY: Docs Referencing Renamed Folders

These docs reference `user-journeys/` which is being renamed to `system-flows/`:

| Document | Current Reference | Update To |
|----------|-------------------|-----------|
| `1-PRODUCT/README.md` | `user-journeys/` | `system-flows/` |
| `documentation/PRODUCT_DOCUMENTATION_CONSOLIDATION_ANALYSIS.md` | `user-journeys/` | `system-flows/` |
| `strategy/README.md` | `user-journeys/` | `system-flows/` |
| `USER_STORIES_INDEX.md` | `user-journeys/` | `system-flows/` |
| `USER_STORIES_MASTER.md` | `user-journeys/` | `system-flows/` |
| `AI_CONTEXT_STORIES.md` | `user-journeys/` | `system-flows/` |
| Various Sprint docs | `user-journeys/` | `system-flows/` |
| Various Audit docs | `user-journeys/` | `system-flows/` |

**Total files affected**: ~20 files

---

### LOW PRIORITY: Docs with Stale Genome Tags

| Document | Tag Date | Action |
|----------|----------|--------|
| `SPRINT20.5_MASTER_PLAN_V3.md` | 2025-XX-XX | Update to 2026 |
| `SPRINT20.5_MASTER_PLAN_V4.md` | 2025-XX-XX | Update to 2026 |

---

## Navigation READMEs Needing Update

### Active READMEs (56 total in KARVIA_STRATEGY)

**Priority Update List** (Navigation hubs):

| README | Priority | Reason |
|--------|----------|--------|
| `KARVIA_STRATEGY/README.md` | P0 | Main navigation hub - severely stale |
| `KARVIA_STRATEGY/1-PRODUCT/README.md` | P0 | Product navigation hub - severely stale |
| `KARVIA_STRATEGY/3-DELIVERY/README.md` | P1 | Delivery navigation |
| `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/README.md` | P1 | QA navigation |
| `KARVIA_STRATEGY/1-PRODUCT/roadmap/BETA_RELEASE_PROJECT/README.md` | P1 | Beta project navigation |
| `KARVIA_STRATEGY/1-PRODUCT/strategy/README.md` | P2 | Strategy navigation |
| `KARVIA_STRATEGY/1-PRODUCT/mockups/README.md` | P2 | Will update after mockups move |

**Skip (Archived/Complete sprints)**: 30+ READMEs in complete sprint folders

---

## Terminology Updates Required

### Old Terminology → New Terminology

| Old Term | New Term | Context |
|----------|----------|---------|
| "user-journeys" | "system-flows" | KARVIA folder name |
| "Tasks" | "Next Moves" | YSELA user-facing (prompts) |
| "task list" | "work queue" | YSELA user-facing |
| "January 31, 2026" | "April 17, 2026" | Beta launch date |
| "B2B OKR platform" | "Behavior transformation platform" | Product positioning |
| "KARVIA Pro" | "KARVIA Engine" | Engine vs product |

---

## Documents That Need YSELA Context Addition

These docs should reference the YSELA/KARVIA separation:

| Document | Current State | Add |
|----------|---------------|-----|
| `KARVIA_STRATEGY/README.md` | No YSELA mention | YSELA/KARVIA layer explanation |
| `1-PRODUCT/README.md` | No YSELA mention | Link to YSELA/ folder |
| `PRODUCT_ARCHITECTURE.md` | Has some YSELA refs | Update with separation |
| `PRODUCT_VISION.md` | Mixed | Clarify KARVIA engine focus |
| `CLAUDE.md` | Has ecosystem explanation | Update paths after restructure |

---

## Update Execution Plan

### Phase 1: Critical Navigation Docs (Day 1)

| Task | Priority | Effort |
|------|----------|--------|
| Update `KARVIA_STRATEGY/README.md` | P0 | M |
| Update `1-PRODUCT/README.md` | P0 | M |
| Update `ECOSYSTEM_ARCHITECTURE.md` (after file moves) | P0 | S |

### Phase 2: Path References (After Restructure - Day 2-3)

| Task | Priority | Effort |
|------|----------|--------|
| Update all `YSELA_PHILOSOPHY.md` references (20 files) | P1 | M |
| Update all `user-journeys/` references (20 files) | P1 | M |
| Update all mockups references | P1 | S |

### Phase 3: Secondary Navigation (Day 3-4)

| Task | Priority | Effort |
|------|----------|--------|
| Update `3-DELIVERY/README.md` | P1 | S |
| Update `2-QA-AND-TESTING/README.md` | P1 | S |
| Update `BETA_RELEASE_PROJECT/README.md` | P1 | S |
| Update `strategy/README.md` | P2 | S |

### Phase 4: Content Alignment (Day 4-5)

| Task | Priority | Effort |
|------|----------|--------|
| Add YSELA context to key docs | P2 | M |
| Update launch dates across all docs | P2 | M |
| Update progress percentages | P2 | S |
| Fix stale genome tags | P3 | S |

---

## Automated Update Script Candidates

These updates can be partially automated with sed/replace:

```bash
# Update user-journeys → system-flows
find KARVIA_STRATEGY -name "*.md" -exec sed -i '' 's/user-journeys/system-flows/g' {} \;

# Update January 31, 2026 → April 17, 2026
find KARVIA_STRATEGY -name "*.md" -exec sed -i '' 's/January 31, 2026/April 17, 2026/g' {} \;

# Update YSELA_PHILOSOPHY path (after move)
find KARVIA_STRATEGY -name "*.md" -exec sed -i '' 's|roadmap/BETA_RELEASE_PROJECT/YSELA_PHILOSOPHY.md|../../YSELA/philosophy/YSELA_PHILOSOPHY.md|g' {} \;
```

**Note**: Manual review required after automated updates.

---

## Documents to Create

| Document | Purpose | Priority |
|----------|---------|----------|
| `KARVIA_STRATEGY/1-PRODUCT/KARVIA_ENGINE_OVERVIEW.md` | Define what KARVIA 1.0 engine includes | P1 |
| `KARVIA_STRATEGY/1-PRODUCT/system-flows/README.md` | Navigation for renamed folder | P1 |
| `KARVIA_STRATEGY/CHANGELOG.md` | Track major doc structure changes | P2 |

---

## Documents to Archive/Deprecate

| Document | Reason | Action |
|----------|--------|--------|
| Old sprint plans in complete folders | Historical | Mark as archived |
| Duplicate product overviews | Consolidation | Merge into one |
| Legacy guides (pre-March 2026) | Superseded | Move to ARCHIVE |

---

## Validation Checklist

After all updates complete:

### Structure Validation
- [ ] All navigation READMEs point to valid paths
- [ ] No broken links to YSELA files (moved)
- [ ] No references to `user-journeys/` (renamed)
- [ ] `ECOSYSTEM_ARCHITECTURE.md` has correct paths

### Content Validation
- [ ] Launch date is April 17, 2026 everywhere
- [ ] Progress percentages are current
- [ ] No references to "Week X" (use Sprint N)
- [ ] YSELA/KARVIA separation is clear

### Genome Tag Validation
- [ ] All governed docs have genome tags
- [ ] No tags with 2025 dates in active docs
- [ ] Parent references are valid

---

## Dependency on Other Plans

This plan **depends on**:
1. **YSELA Restructure (Phase 1)** - Files must be moved before updating paths
2. **Folder Rename** - `user-journeys/` → `system-flows/` must happen first

This plan **is independent of**:
1. KARVIA 1.0 Test Suite creation
2. User journey validation
3. User story validation

---

## Timeline

```
After Phase 1 of YSELA Restructure:
├── Day 1: Update critical navigation docs (2 major READMEs)
├── Day 2: Update path references (YSELA file moves)
├── Day 3: Update folder references (system-flows rename)
├── Day 4: Update secondary navigation
└── Day 5: Content alignment, validation

Total: ~5 working days (can overlap with other tasks)
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [00_RESTRUCTURE_MASTER_PLAN.md](./00_RESTRUCTURE_MASTER_PLAN.md) | YSELA/KARVIA separation plan |
| [04_KARVIA_1.0_LOCKIN_PLAN.md](./04_KARVIA_1.0_LOCKIN_PLAN.md) | KARVIA 1.0 lock-in plan |
| [TEST_COVERAGE_DASHBOARD.md](../../KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/TEST_COVERAGE_DASHBOARD.md) | Current test metrics |

---

**Next Step**: Execute Phase 1 of YSELA restructure, then begin doc updates
