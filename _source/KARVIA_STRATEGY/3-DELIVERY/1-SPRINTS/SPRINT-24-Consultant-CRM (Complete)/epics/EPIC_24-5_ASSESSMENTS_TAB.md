# Epic 24.5 — Assessments Tab via Page-Reuse (`?client=:id`)

<!-- @GENOME T3-SPR-024-EPIC-5 | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 3-4
**Priority**: P1

---

## Goal

Let consultants view consolidated SSI results for a managed client by reusing the existing `team-ssi-view.html` page with a `?client=:id` query param. Same architectural pattern as Epic 24.2 (Profile tab page-reuse), with the F-4 ConsultantPageMode helper as shared frontend infrastructure.

## Locked Decisions

### Path α (page-reuse)
- `team-ssi-view.html?client=:id` — page detects param; consultant scopes to managed client
- Read-only for consultants (assessments are taken by employees; consultant role is analytical)
- Full data parity (Q5.D — nothing hidden from consultant)
- Mirror `team-ssi-view.html`'s 4 internal tabs (Company Overview / Teams / Surveys / Diagnostic)

### F-4 — `ConsultantPageMode` helper reused
- Page imports `client/js/consultant-page-mode.js` (created in Epic 24.2)
- Calls `ConsultantPageMode.detect()` on boot
- Calls `ConsultantPageMode.renderBanner(companyName)` if consultant mode
- ZERO new detection logic — pure reuse

### Workspace integration
- `client-workspace.html#tab=assessments` navigates full-page to `/pages/team-ssi-view.html?client=:id&from=workspace`
- "Back to client workspace" link rendered when `from=workspace` flag present
- No data fetch in workspace; navigation transfers control to the page

## Acceptance Criteria

### Page (`client/pages/team-ssi-view.html`)
- [ ] Page boot calls `ConsultantPageMode.detect()` (reused from Epic 24.2)
- [ ] `mode === 'consultant'`: scope all data fetches to `:id` from param
- [ ] `mode === 'self'`: existing behavior unchanged
- [ ] `mode === 'unauthorized'`: "Not authorized" + back link
- [ ] `ConsultantPageMode.renderBanner(companyName)` injects "Viewing assessments for {Company} as their consultant" banner when consultant mode
- [ ] All 4 inner tabs (Overview / Teams / Surveys / Diagnostic) work in consultant mode
- [ ] Trends + Compare from S23 #189 work in consultant mode
- [ ] No write affordances anywhere (consultant cannot trigger assessment, edit responses, etc.)

### Backend
- [ ] `GET /api/assessments` accepts `company_id` from `req.user.managed_businesses` if requester is CONSULTANT
- [ ] `GET /api/assessments/trends` accepts `company_id` query param if requester is CONSULTANT and `:company_id ∈ user.managed_businesses` (S23 #189 endpoint extension)
- [ ] `GET /api/assessments/compare` accepts cross-tenant compare ONLY if both ids ∈ user.managed_businesses
- [ ] All other assessment routes the page hits — gated on `requireManagedClient` or equivalent
- [ ] Cross-tenant access (consultant requesting `:id` not in `managed_businesses`) returns 403

### Workspace integration
- [ ] `client-workspace.html#tab=assessments` navigates full-page to `/pages/team-ssi-view.html?client=:id&from=workspace`
- [ ] `from=workspace` flag triggers "Back to client workspace" link
- [ ] No data fetch in workspace; navigation hands off

## Tests

NEW `scripts/test-sprint24-245-assessments-tab.js`:
- Page detects `?client=:id` via `ConsultantPageMode.detect()` (helper reuse verified)
- Banner reads "Viewing assessments for {Name} as their consultant"
- Page rejects unauthorized `?client=:id` for non-managed client
- Backend: `GET /api/assessments` for consultant + managed client returns 200
- Backend: `GET /api/assessments` for consultant + unmanaged returns 403
- Backend: trends endpoint accepts cross-tenant `company_id` for managed client only
- Backend: compare endpoint rejects compare across managed boundary
- All 4 internal tabs load correctly in consultant mode
- No write affordances (no "Take assessment" / "Edit response" buttons) shown to consultant
- Workspace integration: Assessments tab navigates correctly
- "Back to workspace" link returns to `client-workspace.html?client=:id`
- S23 #189 regression: Trends + Compare for own-tenant still works for BUSINESS_OWNER
- phase3-3 lint: no new role-check sites added

Target: ~25-35 assertions.

## Implementation Notes

### Files to modify
- `server/routes/assessments.js` — extend role/tenant gates on routes the page consumes; allow `company_id` override from CONSULTANT iff managed
- `client/pages/team-ssi-view.html` — `<script>` boot calls `ConsultantPageMode.detect()`; banner placeholder; conditional "Back to workspace"
- `client/pages/scripts/team-ssi-view.js` — boot logic adapts company_id source based on detected mode
- `client/js/assessment-charts.js` (S23 #189) — verify it doesn't read `karvia_user.company_id` directly; if it does, parameterize
- `client/pages/client-workspace.html` — Assessments tab navigation handler
- `client/pages/scripts/client-workspace.js` — Assessments tab activates → navigate full-page

### Surgical reuse
- ✅ `team-ssi-view.html` page (already exists, used by BUSINESS_OWNER)
- ✅ `assessment-charts.js` from S23 #189
- ✅ Existing assessment routes (extend, don't fork)
- ✅ `ConsultantPageMode` helper from Epic 24.2 (F-4 lock)
- ✅ Pattern from Epic 24.2 (Profile tab page-reuse)

### What's net new
- Tenant gate extensions on ~5 assessment routes
- One `<script>` block addition in `team-ssi-view.html` for boot
- "Back to workspace" link conditional

### Risk mitigations
- **R10 (page edge cases)**: pre-implementation audit of `team-ssi-view.html` end-to-end — same checklist as Epic 24.2 R6
- **Cross-tenant compare**: explicit test that consultant cannot compare a managed client's assessment with a non-managed company's

## Sequencing dependency

Epic 24.2 must land first to create `client/js/consultant-page-mode.js`. Epic 24.5 then consumes it. If Epic 24.2 changes the helper API, Epic 24.5 absorbs the change.
