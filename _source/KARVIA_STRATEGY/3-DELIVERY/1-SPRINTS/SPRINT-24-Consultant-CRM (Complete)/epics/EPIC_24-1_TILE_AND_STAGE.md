# Epic 24.1 — My Clients Tile + Company Lifecycle + Send-Assessment CTA

<!-- @GENOME T3-SPR-024-EPIC-1 | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 4-5
**Priority**: P0 (blocks Epic 24.2 — Profile tab depends on stage pill row)

> **Spec amendment 2026-05-06** (post-#198): canonical `Company.stage` set is **6 stages** (not 5) — `prospect / onboarding / active / paused / churned / completed`. Updated to align with `server/constants/companyStages.js` shipped in #198 and the S25 prereq gate in the handoff. `completed` is mandatory because `LEGACY_TO_CANONICAL` maps `sustained → completed`. All references below read "5 → 6" and "drop completed" prose has been struck.

---

## Goal

Three things:
1. Quiet the My Clients tile — drop two dropdown buttons; pencil icon for edit; whole tile becomes a single click target
2. Collapse `Company.stage` enum from the 10-value transitional superset (`ALL_STAGES_TRANSITIONAL` = 6 canonical + 4 legacy from #198) to the 6 canonical values (`prospect / onboarding / active / paused / churned / completed`); surface a stage pill row + history accordion in the Profile tab
3. Add a **Send Assessment CTA** on tiles where the company is in `prospect` stage AND has no completed assessment (Item #11 from audit; matrix-aligned per `PERSONA_STAGE_OWNERSHIP_MATRIX.md`)

## Locked Decisions

### Tile cleanup
- Drop `Plan ▾` and `Status ▾` dropdown buttons
- Whole tile (except pencil icon) = single click → `client-workspace.html?client=:id#tab=summary`
- Pencil icon (top-right) = Edit modal (existing modal extended with Danger zone footer)
- `Remove from portfolio` lives inside Edit modal (Danger zone)
- Stage chip displays one of: Prospect / Onboarding / Active / Paused / Churned / Completed (using `DisplayLabels.companyStageView(stage)`)
- Health chip displayed alongside (computed from `Company.risk_status` virtual — S22 D-C-5 / S22a Phase 3.1)

### Send Assessment CTA (Item #11 — matrix-driven)
- Visible ONLY when `Company.stage === 'prospect'` AND `latest assessment.completed_at` is null
- Routes to existing assessment-invitation flow scoped to client (no new backend endpoint)
- Visual: small secondary button or link near the pencil icon; not a primary affordance
- Hidden once any assessment is completed (transition is implicit via existing `StageTransitionService.onPocInvitationAccepted` from S22a #184d)

### Ball-state distribution micro-line (D-Onion-4)
- Visible on tile when `Company.stage` is `active` OR `paused` (i.e., client has objectives in flight)
- Hidden on `prospect` / `onboarding` (no objectives yet) and on `churned`
- Format: `🎯 N · 🤝 M · 📊 K` (counts of objectives in each consultant ball-view bucket)
- Counts derived by mapping `Objective.lifecycle_stage` (6 stages) → 3 ball-view buckets per `DisplayLabels.lifecycleView(stage, 'consultant')` mapping
- Renders as small subdued text below stage/health chips
- Empty state (e.g., `🎯 0 · 🤝 0 · 📊 0`): render `─` (em-dash) instead of zero counts to keep tile visually quiet

### 6-stage company lifecycle (collapsed from 10-value transitional superset)
- `Company.stage` enum reduced to canonical 6: `prospect`, `onboarding`, `active`, `paused`, `churned`, `completed` (sourced from `server/constants/companyStages.js` `STAGES`)
- Drops legacy values from `ALL_STAGES_TRANSITIONAL`: `objective_identified`, `handed_off`, `in_progress`, `sustained`
- `at_risk` is no longer a stage — it surfaces as the `health` chip (computed from existing `risk_status` virtual)
- All legacy → canonical mappings already applied on disk by Epic 24.6 migration (#198); this epic narrows the schema enum so future writes can only use canonical values
- `StageTransitionService.onFirstObjectiveCreated` retargeted: now flips `onboarding → active` (was `→ objective_identified`)
- `completed` is a terminal stage (per `TRANSITIONS` table); reachable from `active` via manual transition (e.g., engagement successfully wrapped)

### Stage pill row + history accordion (in Profile tab)
- Horizontal pill row under company-name header in `client-workspace.html#tab=profile`
- Click on a non-active pill → confirmation modal: *"Move {Company} from {current} → {target}?"*
- Confirm calls `StageTransitionService.manualTransition()` (now a thin wrapper around `LifecycleTransitionService.companyStageInstance.manualTransition()` per F-2)
- Stage history accordion (collapsed by default); reads `Company.stage_history[]` (already exists from S22a #184e)

### Display label reuse (F-1d)
- Stage labels come from `window.DisplayLabels.companyStageView(stage)` (NEW in Epic 24.3's `display-labels.js`)
- This epic CONSUMES `display-labels.js`; Epic 24.3 CREATES it. Sequence: Epic 24.3 backend session lands display-labels module before this epic's frontend session

## Acceptance Criteria

### Tile (`my-clients.html`)
- [ ] No `Plan ▾` or `Status ▾` dropdown buttons
- [ ] Pencil icon button rendered top-right of tile, opens Edit modal
- [ ] Click on tile body navigates to `client-workspace.html?client=:id#tab=summary` (single click, no confirmation)
- [ ] Stage chip displays one of 6 values via `DisplayLabels.companyStageView()`
- [ ] Health chip (sourced from `Company.risk_status` virtual)
- [ ] Edit modal includes "Danger zone" footer with "Remove from portfolio" CTA (amber styling reused from S22 #182)
- [ ] **Send Assessment CTA** rendered conditionally: visible when `stage='prospect'` AND no completed assessment; routes to existing assessment-invitation flow
- [ ] **Ball-state distribution micro-line** (`🎯 N · 🤝 M · 📊 K`) renders below chips when stage ∈ {active, paused}; hidden on prospect/onboarding/churned; em-dash if all zero

### Profile tab (`client-workspace.html#tab=profile`)
- [ ] Stage pill row renders under company-name header
- [ ] 6 pills shown: Prospect / Onboarding / Active / Paused / Churned / Completed (only one highlighted)
- [ ] Click on non-active pill opens confirmation modal
- [ ] Confirm calls `StageTransitionService.manualTransition()` (works via F-2 wrapper preserving public API)
- [ ] On success: pill row updates, history accordion gets new entry, toast shows "Stage updated"
- [ ] Stage history accordion collapsed by default; click expands; lists `stage_history[]` newest-first
- [ ] Health chip floats right of stage pill row

### Backend
- [ ] `Company.stage` enum reduced to canonical 6 values (drops 4 legacy values from `ALL_STAGES_TRANSITIONAL`)
- [ ] `StageTransitionService.onFirstObjectiveCreated` updated: target is `active` (was `objective_identified`)
- [ ] `StageTransitionService` is now a thin wrapper around `LifecycleTransitionService.companyStageInstance` (per F-2)
- [ ] No new endpoints; existing `manualTransition` covers pill clicks
- [ ] `Company.risk_status` virtual unchanged (used as health source)

### Tests

NEW `scripts/test-sprint24-241-tile-and-stage.js`:
- Tile: no Plan/Status buttons present in markup
- Tile: pencil icon present
- Tile: click navigates correctly (vm-sandboxed)
- Tile: Send-Assessment CTA visible only for prospect + no-assessment case (truth table over 4 combinations)
- Edit modal: Danger zone with Remove CTA
- Stage pill row renders 5 pills with correct active state via `DisplayLabels`
- Confirmation modal fires on non-active-pill click
- Manual transition via UI writes to `stage_history[]`
- Stage history accordion populates from `Company.stage_history[]`
- Backend: `StageTransitionService.onFirstObjectiveCreated` writes `active` (regression: 184e contract)
- Backend: `Company.stage` enum rejects retired values
- F-2 wrapper test: `StageTransitionService` public methods produce identical behavior to direct `companyStageInstance` calls

Target: ~35-45 assertions.

## Implementation Notes

### Files to modify
- `server/models/Company.js` — narrow `stage` enum from `ALL_STAGES_TRANSITIONAL` (10 values) to canonical `STAGES` (6 values) — sourced from `server/constants/companyStages.js`
- `server/services/StageTransitionService.js` — refactor to thin wrapper around `LifecycleTransitionService.companyStageInstance`; update `onFirstObjectiveCreated` target
- `client/pages/my-clients.html` — drop dropdown markup, add pencil icon, conditional Send-Assessment CTA
- `client/pages/scripts/my-clients.js` — remove Plan/Status handlers; simplify click delegation; Send-Assessment CTA wiring; consume `DisplayLabels`
- `client/css/my-clients.css` — pencil icon position, retire 2 stage badge variants (`objective_identified`, `inactive`)
- `client/pages/client-workspace.html` — stage pill row markup at top of `#tab=profile` content
- `client/pages/scripts/client-workspace.js` — render pill row + history accordion; wire confirmation modal
- `client/css/client-workspace.css` — `.stage-pill-row`, `.stage-pill`, `.stage-pill--active`, `.stage-history-accordion`

### Surgical reuse
- ✅ `Company.stage_history[]` from S22a #184e
- ✅ `LifecycleTransitionService` from Epic 24.3 (via wrapped `StageTransitionService`)
- ✅ Confirmation modal pattern from `my-clients.js` Edit/Remove
- ✅ Existing assessment-invitation flow for Send Assessment routing
- ✅ `DisplayLabels` module from Epic 24.3 (consumed here)
- ✅ `Company.risk_status` virtual

### Risk mitigations
- **R3 (CSS coupling)**: stage badge classes used both in `my-clients.html` and `client-workspace.html` — confirm no owner-side page consumes them; namespace if needed
- **R5 (semantic loss on `at_risk` collapse)**: pre-migration audit script (Epic 24.6) lists currently-`at_risk` companies + their computed `health` for review

## Sequencing dependency

Epic 24.3 must land its backend session (LifecycleTransitionService + display-labels module) BEFORE Epic 24.1 frontend can consume `DisplayLabels.companyStageView()` and the F-2 wrapper. Order in execution plan: Epic 24.3 (Session D) → Epic 24.1 (Session B is too early; reorder to after D OR have Epic 24.1 rendered as Session F).
