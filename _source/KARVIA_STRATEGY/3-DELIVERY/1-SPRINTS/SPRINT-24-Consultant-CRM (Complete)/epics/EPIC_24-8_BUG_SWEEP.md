# Epic 24.8 — Bug Backlog Sweep

<!-- @GENOME T3-SPR-024-EPIC-8 | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 2
**Priority**: P1 — non-blocking, ride-along cleanup

---

## Goal

Close two outstanding bug/cleanup items that were surfaced during the Sprint 24 sprint review (Phase 1 of architectural audit). Both are small, defensible to land in S24 because they ride along with code paths we're already touching.

## Items in scope

### B-6 — `postpone_reason` schema persistence (Task model)

**Problem**: When a user clicks "Postpone" on a Task, the modal asks for a free-text reason. The reason is captured in the modal but **never persisted** — the Task schema doesn't have a `postpone_reason` field. User effort is silently dropped.

**Source**: DEBT-008 / FEAT-045 (filed during S23 #192-prep Q4 walkthrough). Identified as a pre-existing data-loss bug independent of the larger telemetry epic. Fix portion only — telemetry portion stays in DEBT-008 for post-Beta.

**Fix shape**:
- Add `postpone_reason: { type: String, default: '' }` to `Task` schema
- Wire the Postpone modal handler in `client/pages/scripts/dashboard-v2.js` and `client/pages/scripts/planning-v2.js` to send the captured reason in the PUT payload
- Verify route handler accepts and persists the field
- Test that postpone followed by GET returns the persisted reason

**Cost**: ~1 pt. Pure additive schema change. No migration needed (default empty string).

### B-8 — `navigation.js` purple "Viewing as" banner verify-and-cleanup

**Problem**: Pre-S22a, when a consultant "switched into" a client's tenant via JWT swap, a purple banner appeared at the top of the page: *"Viewing as: Client Company"*. Sprint 22a #184c killed the JWT-swap flow that triggered the banner. The banner code is **supposedly** unreachable but was never explicitly verified or deleted.

**Source**: S22 close watch-items carry-over. Sprint 22a closed the trigger but the residual code remains.

**Fix shape**:
- Verify under all consultant-page-load scenarios that the banner DOM never appears (write test that visits each consultant page in vm-sandbox and grep-asserts `.context-banner` / "Viewing as" never renders)
- If confirmed dead: delete the banner code from `client/js/navigation.js` and any related CSS
- If still alive in some edge case: identify and fix
- Update the existing `phase3-3-frontend-role-checks.js` lint allowlist if necessary

**Cost**: ~1 pt. Defensive cleanup; ride-along with Epic 24.1 (which already touches `navigation.js` for tile cleanup).

## Locked Decisions

- B-6 fixes the **persistence layer only**, not the broader telemetry/postpone-tracking epic (DEBT-008 stays separate, post-Beta)
- B-8 is **verify-then-delete** — if there's any non-trivial fix, it stops being a 1-pt task and gets re-scoped
- Both items ship as additive, low-risk, non-blocking changes
- Tests for both go into a single new test file: `scripts/test-sprint24-248-bug-sweep.js`

## Acceptance Criteria

### B-6
- [ ] `Task.postpone_reason: String` field added (default `''`)
- [ ] Postpone modal in `dashboard-v2.js` reads the user's input and sends it as `postpone_reason` in the PUT request
- [ ] Postpone modal in `planning-v2.js` does the same (if planning page has its own modal)
- [ ] PUT handler for Task accepts and persists the field
- [ ] GET responses include the persisted reason
- [ ] Test: round-trip postpone → reason persists; postpone with empty reason persists empty

### B-8
- [ ] Test scans all consultant page bootstrap paths (vm-sandboxed) and asserts the banner DOM is never emitted
- [ ] If confirmed dead: banner code in `client/js/navigation.js` removed
- [ ] If confirmed dead: any banner-only CSS rules removed from `client/css/`
- [ ] phase3-3 lint regression: still 9/9 green (no new role-check sites)
- [ ] No regression in business-owner / executive / manager / employee context-banner rendering (those legitimately show banners in their own use cases)

## Implementation Notes

### Files likely touched
- `server/models/Task.js` — add `postpone_reason` field
- `client/pages/scripts/dashboard-v2.js` — wire postpone modal payload
- `client/pages/scripts/planning-v2.js` — wire postpone modal payload (if applicable)
- `server/routes/tasks.js` — verify handler accepts the field (likely already accepts via schema spread)
- `client/js/navigation.js` — banner verification + possible deletion
- `client/css/` — possible CSS removal

### Test file
- `scripts/test-sprint24-248-bug-sweep.js`
- Target ~20-30 assertions

### Surgical reuse
- ✅ Existing PUT route + handler patterns
- ✅ phase3-3 lint regression pattern from S22a Phase 3.3

### Risk mitigations
- **R1 (B-6)**: Wrong field placement — verify Task schema is the right model (not Move, since Postpone is a Task concept). Confirmed by reading existing Postpone modal code paths.
- **R2 (B-8)**: Hidden consumer of the banner — search for any code that explicitly tests for the banner's existence; if any test suite asserts banner-renders-for-consultant, remove that assertion too.

## Out of Scope

- DEBT-008's broader telemetry capture (postpone counts over time, behavioral signals) — stays in backlog for post-Beta
- Any other consultant-side cleanup not specifically B-6 or B-8

## Sequencing

Recommended to land Epic 24.8 alongside Epic 24.1 (Session B), since both touch `navigation.js`. Combined session keeps the file edits cohesive.
