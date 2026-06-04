# Epic 24.3 — Objectives Tab + Lifecycle Stage Model

<!-- @GENOME T3-SPR-024-EPIC-3 | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 6-8
**Priority**: P0 — meatiest epic of S24
**Closes**: DEBT-007 (Objective Lifecycle Redesign)

---

## Goal

Introduce a canonical 6-stage `Objective.lifecycle_stage` enum (closing DEBT-007) and the consultant's 3-stage ball-view derived from it via mapping. Surface the model on the Objectives tab as the consultant's at-a-glance answer to "where is each ball, who has it, what's it worth?". Replaces the consultant's external tracking spreadsheet.

## Locked Decisions (from architectural audit)

### F-1 — Common state model
- **6-stage system enum** (canonical, stored on Objective): `identified → kr_breakdown → in_execution → completion_review → completed → sustained_mode`
- **3-stage consultant ball-view** (display layer, derived via mapping):
  - `identified` + `kr_breakdown` → 🎯 Identified
  - `in_execution` + `completion_review` → 🤝 Handed Off
  - `completed` + `sustained_mode` → 📊 Sustained
- "Mark Sustained" UX maps `completion_review → sustained_mode` directly (one click; `completed` exists in enum but unused in S24)
- Owner-side rendering deferred to S25 Epic 25.3 (this epic ships schema + consultant view only)

### F-1d — Unified display-labels module
- NEW `client/js/display-labels.js` exposed as `window.DisplayLabels`
- Subsumes S23 #192a label constants (`MOVE_TYPE_LABEL`, `MOVE_STATUS_LABEL`, `HEALTH_STATUS_LABEL`, `OBJECTIVE_LIFECYCLE_LABEL`)
- Adds `COMPANY_STAGE_LABEL` and `lifecycleView(stage, role)` (Item #13)
- Only `consultant` mapping populated in S24; other roles return placeholder until S25 Epic 25.4

### F-2 — Generic LifecycleTransitionService
- NEW `server/services/LifecycleTransitionService.js`
- Configured instances: `companyStageInstance` (Company.stage) + `objectiveLifecycleInstance` (Objective.lifecycle_stage)
- `StageTransitionService` becomes a thin wrapper preserving S22a public API; 184e tests serve as contract
- Telemetry: every transition emits `lifecycle.transition` via existing `TelemetryService` from S23 #192b
- Predicate catalogs:
  ```
  OBJECTIVE_LIFECYCLE_TRANSITIONS = {
    identified:        ['kr_breakdown'],
    kr_breakdown:      ['in_execution'],
    in_execution:      ['completion_review'],
    completion_review: ['sustained_mode', 'in_execution'],
    completed:         ['sustained_mode'],   // unused in S24
    sustained_mode:    []
  };
  ```

### F-9 — `sustained_eligible` is a virtual
- Mongoose virtual on Objective; computed at read time via `key_results.every(kr => kr.progress === 100)`
- No stored field, no update hooks
- Aligns with S22a Phase 3.1 "virtuals over stored fields" pattern

### F-10 — `handoff_eligible` is internal predicate, not exposed
- The `kr_breakdown → in_execution` predicate is evaluated inside `LifecycleTransitionService.evaluateAndTransitionAfterWrite()`
- When the predicate becomes true, the service flips `lifecycle_stage` directly
- No stored or virtual field; `lifecycle_stage` IS the answer

### F-6 — Component CSS pattern
- NEW folder `client/css/components/`
- NEW file `client/css/components/objective-tile.css` — base styles + modifier classes (`.is-consultant-view`, `.is-owner-view`)
- Owner-side adoption deferred to S25 Epic 25.3
- Pattern documented in `.claude/DESIGN_SYSTEM.md`

### Item #12 — Driver-aware empty state
- Empty-state copy reflects matrix: BO drives "Objective Identified" stage
- Copy: *"{Company} hasn't created their first objective yet. Owner login required. [Send a reminder] · [Check assessment status]"* (or similar driver-aware framing)

### Other product locks (carried from earlier rounds)
- View-only — no edit, no wizard-trigger from consultant view
- One tile per objective; KRs not expanded inline
- Constraint banner at top of tab using latest assessment's `ssi_result.constraint`
- Emoji icons in v1 (`🎯 / 🤝 / 📊`); SVG polish to S25
- Manual override dropdown on each tile for edge cases
- `Objective.consultant_notes` — single-line, 280 chars, consultant-private (R7)

## Acceptance Criteria

### Schema
- [ ] `Objective.lifecycle_stage` enum field added: `['identified', 'kr_breakdown', 'in_execution', 'completion_review', 'completed', 'sustained_mode']`, default `'identified'`
- [ ] `Objective.consultant_notes` String field, max 280 chars, default `''`, schema-level `select: false` AND explicitly excluded from owner-facing route projections
- [ ] `Objective.lifecycle_history[]` sub-doc array: `{ from, to, actor_id, at, triggered_by_kind, note }` — mirrors `Company.stage_history[]`
- [ ] Mongoose virtual `Objective.sustained_eligible` — computes `key_results.every(kr => kr.progress === 100)`; returns `false` for zero-KR objectives

### `LifecycleTransitionService` (NEW)
- [ ] `transitionTo(docId, targetState, actor, triggeredByKind, note?)` — idempotent via `findOneAndUpdate({_id, [stageField]: fromState})`; appends to history
- [ ] `evaluateAndTransitionAfterWrite(docId, predicateContext)` — composite predicate evaluator; called from `res.on('finish')` hooks on relevant routes
- [ ] `manualTransition(docId, targetState, actor, note?)` — validated against transition catalog
- [ ] `markSustained(docId, actor)` — manual transition; only allowed if `sustained_eligible=true` virtual returns true; transitions `completion_review → sustained_mode`
- [ ] Manual override pathway (`triggered_by_kind='manual_override'`) bypasses transition catalog for edge cases
- [ ] Every transition emits `lifecycle.transition` telemetry event
- [ ] Two configured instances exported: `companyStageInstance`, `objectiveLifecycleInstance`
- [ ] `StageTransitionService` refactored to thin wrapper around `companyStageInstance` (4 public methods preserved verbatim)

### Auto-transition hooks (via `res.on('finish')` per D-3)
- [ ] `routes/objectives.js POST` — fires `evaluateAndTransitionAfterWrite` (sets `identified`)
- [ ] `routes/objectives.js PUT` — fires when `owner_id` changes
- [ ] KR write paths (`routes/objectives.js` dual-write OR `routes/key-results.js`) — fires; can trigger `identified → kr_breakdown` and `kr_breakdown → in_execution`
- [ ] `routes/weekly-goals.js POST` — fires; can trigger `kr_breakdown → in_execution`
- [ ] `routes/moves.js POST` — fires; can trigger `kr_breakdown → in_execution`
- [ ] All hooks fire-and-forget (best-effort); errors logged but not propagated to user

### Display labels module (NEW `client/js/display-labels.js`)
- [ ] Exposed as `window.DisplayLabels`
- [ ] `lifecycleView(stage, role)` returns role-aware label (consultant populated in S24; other roles placeholder)
- [ ] Subsumes S23 #192a constants: `MOVE_TYPE_LABEL`, `MOVE_STATUS_LABEL`, `HEALTH_STATUS_LABEL`, `OBJECTIVE_LIFECYCLE_LABEL`
- [ ] Adds `COMPANY_STAGE_LABEL` (canonical 6 stages: prospect / onboarding / active / paused / churned / completed — sourced from `server/constants/companyStages.js` `META`)
- [ ] Default fallback: invalid role → consultant mapping; invalid stage → empty string

### 3 new consultant endpoints
- [ ] `PATCH /api/consultant/clients/:id/objectives/:oid/notes` — updates `consultant_notes`; rate-limited via debounce on frontend
- [ ] `POST /api/consultant/clients/:id/objectives/:oid/mark-sustained` — calls `objectiveLifecycleInstance.markSustained()`
- [ ] `POST /api/consultant/clients/:id/objectives/:oid/override-state` — body `{ target_state, note }`; calls manual override
- [ ] All 3 gated by `requireManagedClient` middleware (S22a #184a)

### Objectives tab UI (`client-workspace.html#tab=objectives`)
- [ ] **KPI strip at top** (via Epic 24.9 `renderKPIStrip()` helper): 4 cards — HEALTH (ball-state distribution counts), CONSTRAINT (latest assessment constraint), DRIVERS (owner role distribution), VELOCITY (moves done last week + trend)
- [ ] Constraint banner from earlier draft is REPLACED by the CONSTRAINT KPI card (within the unified strip)
- [ ] Tile component uses `client/css/components/objective-tile.css` with `.is-consultant-view` modifier
- [ ] Tile shows: ball-state icon (mapped from lifecycle_stage), title, owner avatar+name, % progress (KR-aggregated), KR mix string, SSI impact pill, discipline pills (foundations from S23 #190), target timeframe, consultant_notes (inline-editable, debounced save), "Mark Sustained ✓" button (only when `sustained_eligible=true`), "⋯" overflow with manual override
- [ ] Sort: balls in `in_execution`/`completion_review` first, then `identified`/`kr_breakdown`, then `sustained_mode`
- [ ] **Driver-aware empty state**: *"{Company} hasn't created their first objective yet. Owner login required. [Send a reminder] · [Check assessment status]"*
- [ ] All dynamic interpolation passes through `KarviaCommon.escapeHtml`

### Owner-side privacy (Risk R7)
- [ ] `routes/objectives.js GET` and any owner-facing route returning Objective explicitly projects out `consultant_notes`
- [ ] Test: owner-side fetch of an objective with non-empty `consultant_notes` returns object without that key
- [ ] Frontend grep-assert: no reference to `consultant_notes` in `client/pages/objectives.html` / `objective-wizard.html` / their JS

### Tests

NEW `scripts/test-sprint24-243-objectives-and-lifecycle.js`:
- Schema validation (enum rejects invalid; consultant_notes ≤ 280 chars)
- `LifecycleTransitionService` idempotency (second call no-op)
- `evaluateAndTransitionAfterWrite` predicate truth table:
  - bare new → `identified`
  - first KR added → `kr_breakdown`
  - owner=client + KRs + WG/Move → `in_execution`
  - all KRs at 100% → `completion_review`
  - manual mark sustained → `sustained_mode`
  - owner=consultant blocks `in_execution`
- `StageTransitionService` 184e regression: 36/36 still green (wrapper preserves contract)
- Hook fires post-response (timing test via spy)
- Hook errors don't propagate
- 3 new consultant endpoints: tenant scope, role gate, managed-client check
- `sustained_eligible` virtual: false at <100%, true at 100%, false for 0 KRs
- Display labels module: consultant labels for all 6 stages, role fallback, invalid stage handling
- **Privacy test (R7)**: owner GET on objective with non-empty `consultant_notes` returns no `consultant_notes` key
- Frontend grep-assert: no `consultant_notes` references in owner-side files
- Telemetry: `lifecycle.transition` event emitted with full payload on every transition
- Component CSS: `client/css/components/objective-tile.css` exists; both `.is-consultant-view` modifier present
- Empty-state copy assertion: contains "Owner login" or driver-framing keyword
- S22a + S23 regression: 184a + 184c + 184e + phase3-3 + 188 + 190 still green

Target: ~80-100 assertions.

## Implementation Notes

### Files to create
- `server/services/LifecycleTransitionService.js`
- `client/js/display-labels.js`
- `client/css/components/objective-tile.css`
- `scripts/test-sprint24-243-objectives-and-lifecycle.js`

### Files to modify
- `server/models/Objective.js` — add `lifecycle_stage`, `consultant_notes`, `lifecycle_history[]`, virtual `sustained_eligible`
- `server/services/StageTransitionService.js` — refactor to thin wrapper around `companyStageInstance`
- `server/routes/objectives.js` — wire `res.on('finish')` hooks; project out `consultant_notes` on GETs
- `server/routes/weekly-goals.js` — wire `res.on('finish')` hook on POST
- `server/routes/moves.js` — wire `res.on('finish')` hook on POST
- `server/routes/consultant.js` — add 3 new endpoints
- `client/pages/client-workspace.html` — Objectives tab content area
- `client/pages/scripts/client-workspace.js` — Objectives tab renderer + handlers
- `client/css/client-workspace.css` — `.constraint-banner`, `.consultant-notes-input`, `.mark-sustained-btn`, `.override-state-menu`
- `.claude/DESIGN_SYSTEM.md` — document component CSS pattern

### Surgical reuse
- ✅ `Company.stage_history[]` schema shape — mirror for `lifecycle_history[]`
- ✅ `Objective.ssi_impact` and `Objective.discipline_ids[]` from S23 #190
- ✅ `disciplines.js` config + foundation grouping from S23 #190
- ✅ `Assessment.ssi_result.constraint` from S23 #188
- ✅ `requireManagedClient` middleware from S22a #184a
- ✅ Existing `TelemetryService.emit()` from S23 #192b
- ✅ S22a Phase 3.1 virtuals pattern (precedent for `sustained_eligible`)

### Risk mitigations
- **R3 (CSS coupling)**: F-6 component CSS pattern — `is-consultant-view` modifier in shared file; owner-side untouched in S24
- **R4 (latency)**: `res.on('finish')` post-response evaluation; predicate is 1-2 indexed lookups
- **R7 (consultant_notes leak)**: schema `select: false` + explicit field exclusion test on owner GETs
- **R12 (race conditions)**: `findOneAndUpdate({_id, lifecycle_stage: fromState})` predicate prevents double-fires (same pattern as S22a #184e)

## Out of Scope (deferred elsewhere)

- Owner-side rendering of `lifecycle_stage` → S25 Epic 25.3
- Owner/manager/employee labels in `display-labels.js` → S25 Epic 25.4
- Cascade cleanup (Phase B/C of CONSOLIDATION_PLAN) → S25 Epics 25.1/25.2
- Hybrid Behavior Classification → S25 (TBD epic)
- Notification routing on transitions (matrix Adjustment 4) → post-S24 backlog

## Sequencing within Sprint 24

Recommended split into TWO sessions:
- **Session D (~3-4 pts)**: Backend foundation — schema + service + hooks + 3 endpoints + virtual + display-labels module + privacy projection
- **Session E (~3-4 pts)**: Frontend — Objectives tab UI + tile component CSS + constraint banner + driver-aware empty state + manual override menu

Tests append to the same `scripts/test-sprint24-243-objectives-and-lifecycle.js` file across both sessions.
