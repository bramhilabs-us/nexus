# Epic 25.3 — Owner-Side `objectives.html` Redesign

<!-- @GENOME T3-SPR-025-EPIC-3 | DRAFT | 2026-05-05 | parent:T3-SPR-025-MP | auto:- | linked:- -->

**Points**: 6-8 (estimate)
**Priority**: P0 — needed to align owner experience with consultant view shipped in S24
**Source**: S24 D-4 deferred owner-side from Sprint 24

---

## Goal

Bring `client/pages/objectives.html` (the Business Owner's primary objectives surface, per the [Persona × Stage × Page Ownership Matrix](../../../../1-PRODUCT/PERSONA_STAGE_OWNERSHIP_MATRIX.md)) up to parity with the design system shipped in S22 #192a + S24:
- Navy/gold theming (replace any remaining purple)
- Surface `Objective.lifecycle_stage` (the canonical 6-stage enum from S24 F-1) via owner-facing labels
- Adopt the shared component CSS pattern from S24 F-6 (`client/css/components/objective-tile.css`)
- Use modifier classes (e.g., `.objective-tile.is-owner-view`) instead of new CSS

## What "Redesign" means here

**NOT a redesign-from-scratch.** A visual-refresh + alignment pass.

In scope:
- Visual theming + icon system update
- Lifecycle-stage badge surfaced on each tile
- Tile markup consumes `client/css/components/objective-tile.css` (instead of inline/scattered styles)
- Page header adopts the consultant-side workspace header pattern for visual consistency
- Empty states + edge cases reviewed

Out of scope:
- New features (no AI integrations, no kanban, no bulk-actions in this epic)
- Wholesale information-architecture rethink
- Adding fields the owner can edit beyond what they edit today

## Pre-requisites (must hold from S24)

1. `Objective.lifecycle_stage` field exists with seeded values (S24 Epic 24.6 migration)
2. `client/js/display-labels.js` exists; needs owner mapping populated (covered by Epic 25.4)
3. `client/css/components/` folder exists with `objective-tile.css` base (S24 F-6, Epic 24.3)
4. `LifecycleTransitionService` is canonical writer for `lifecycle_stage` (S24 F-2)

## Acceptance Criteria

### Visual + theming
- [ ] All purple references in `objectives.html` + `objectives.css` (or wherever its styles live) replaced with navy/gold equivalents
- [ ] Page header matches S22a #184b workspace pattern (typography, spacing)
- [ ] Tile design adopts the base `.objective-tile` class from `client/css/components/objective-tile.css` with `.is-owner-view` modifier
- [ ] No inline `<style>` blocks; all styles in component CSS file

### Lifecycle stage surfacing
- [ ] Each objective tile shows a stage badge using the owner-facing label from `lifecycleView(stage, 'business_owner')` (Epic 25.4 provides the labels)
- [ ] Badge styling reuses S24 F-6 component CSS (don't reinvent)
- [ ] Stage badges visible only when `Objective.lifecycle_stage` is non-default — empty/freshly-created objectives don't show a badge

### Component CSS adoption
- [ ] All `.objective-tile`-targeted styles live in `client/css/components/objective-tile.css`
- [ ] Owner-specific tweaks live as `.objective-tile.is-owner-view { ... }` rules in the same file
- [ ] No duplicated tile styles between owner and consultant CSS files

### Behavior preserved
- [ ] All existing owner actions still work: create objective, edit, delete (soft), assign owner, set KRs (or trigger wizard)
- [ ] Wizard entry point unchanged (still routes to `objective-wizard.html`)
- [ ] Existing objective filtering/sorting controls preserved
- [ ] Status enum behavior (`status` field, separate from `lifecycle_stage`) unchanged

### Tests
- [ ] NEW `scripts/test-owner-objectives-redesign.js` covering:
  - phase3-3 lint regression: no new role-check sites
  - Component CSS file is the only source of `.objective-tile` styles
  - Owner-mode banner does NOT render (this is the owner's own page; no `?client=:id` here)
  - Stage badge renders correct owner-facing label
  - Existing owner actions still produce expected route calls
- [ ] Full S22a + S23 + S24 regression sweep stays green
- [ ] Cross-page check: consultant view of same objective (via My Clients → workspace) still renders correctly with `.is-consultant-view` modifier

## Implementation Notes

### Files to modify
- `client/pages/objectives.html` — markup updates for tile structure, header, lifecycle badge
- `client/css/components/objective-tile.css` — extend with `.is-owner-view` modifier rules (file already exists post-S24)
- `client/pages/scripts/objectives.js` (or whatever owner-page controller is) — render stage badge using `DisplayLabels.lifecycleView(stage, 'business_owner')`
- `client/css/objectives.css` (legacy file, if exists) — DELETE if all styles migrate to component CSS

### Surgical reuse
- ✅ Component CSS pattern from S24 F-6 (`client/css/components/objective-tile.css`)
- ✅ Display labels module from S24 F-1d (`window.DisplayLabels.lifecycleView(stage, role)`)
- ✅ `lifecycle_stage` field already populated by S24 migration
- ✅ Navy/gold theme aliases from S22 #192a

### Risk mitigations
- **R1**: Hidden consumers of `Objective.key_results[]` (legacy embedded array) — Phase B (Epic 25.1) addresses; this epic depends on Phase B being clean
- **R2**: Owner-side action regression — mitigate via comprehensive test suite covering existing CRUD paths
- **R3**: Visual drift between owner and consultant tile if modifiers diverge — mitigate via shared component CSS file enforcement

## Open Design Questions for Kickoff

These are visual/UX calls that should be discussed at S25 kickoff (possibly in a `/design` session):

1. **Stage badge prominence**: small chip top-right of tile, OR full-width pill at tile bottom? (Consultant uses small chip; owner could go either way)
2. **Color coding**: do `identified` / `in_execution` / `sustained_mode` get their own accent colors, or stay neutral with text-only labels?
3. **Tile click target**: today owner tile click opens objective detail. Should it adopt the consultant pattern (whole tile clickable) or keep the existing per-action click model?
4. **Empty objective state**: matrix says BO is the driver of "Objective Identified" — empty state should encourage them to create. Update copy?

## Dependencies on Epic 25.4

Epic 25.3 cannot ship without owner-side label mappings populated in `display-labels.js`. Epic 25.4 must complete first OR ship in same session.

---

**Spec status**: Draft. Visual decisions firm up at S25 kickoff (possibly via `/design` session pre-coding).
