# Epic 24.2 — Profile Tab via Page-Reuse (`?client=:id`)

<!-- @GENOME T3-SPR-024-EPIC-2 | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Points**: 3-4
**Priority**: P0

---

## Goal

Let consultants edit a managed client's company profile by reusing the existing `company-profile.html` with a `?client=:id` query param. Owner's first-login friction drops to ~0 because the profile is already filled in.

## Locked Decisions (post-audit)

### Path 2-α (page-reuse)
- `company-profile.html?client=:id` — page detects param; consultant edits managed client's profile
- ONE backend tweak: extend `PUT /api/companies/:id` middleware to allow `CONSULTANT` role iff `:id ∈ user.managed_businesses`
- Reuse `requireManagedClient` middleware from S22a #184a
- Full field parity (no consultant-restricted fields)

### F-3 — Prefill tracking REMOVED from scope
- ❌ NO `Company.profile_prefilled_at` field
- ❌ NO `sendProfilePrefilledEmail` template
- ❌ NO email debounce logic
- ✅ Rely on existing S22a #184d `sendInvitationLinkEmail` invitation flow — owner gets the standard workspace-claim email when consultant adds the client; clicks link; logs in; sees a profile that may already be filled in
- ✅ Audit log of profile changes → S25 backlog (file under `MASTER_PRODUCT_BACKLOG.md` as "profile activity feed" — out of scope here)

### F-4 — Shared `ConsultantPageMode` helper
- NEW `client/js/consultant-page-mode.js` exposed as `window.ConsultantPageMode`
- Public API:
  - `ConsultantPageMode.detect()` returns `{ mode, clientId, fromWorkspace, isAuthorized }` where `mode ∈ ['self', 'consultant', 'unauthorized']`
  - `ConsultantPageMode.renderBanner(companyName)` — renders the consultant context banner if `mode === 'consultant'`
- Both Profile (`company-profile.html`) and Assessments (`team-ssi-view.html`, Epic 24.5) consume this
- Strictly scoped — only page-mode detection + banner

### Q2.C — Consultant context banner kept
- "You are editing **{Company}** as their consultant" — top of page when in consultant mode
- Prevents wrong-tab edits

### No auto-stage-transition on consultant prefill (Q2.E)
- Stage transition `prospect → onboarding` stays tied to BO accepting invitation (S22a #184d)
- Consultant-prefill does NOT trigger any auto stage change

## Acceptance Criteria

### Page (`client/pages/company-profile.html`)
- [ ] Page boot calls `ConsultantPageMode.detect()` to determine mode
- [ ] `mode === 'consultant'` (param present + role CONSULTANT + client managed): load via `GET /api/companies/:id` for `:id` from param
- [ ] `mode === 'self'` (param absent): existing behavior unchanged
- [ ] `mode === 'unauthorized'` (param present + access invalid): show "Not authorized" + back link
- [ ] `ConsultantPageMode.renderBanner(companyName)` renders banner when in consultant mode
- [ ] Save (`PUT /api/companies/:id`) works for consultant on managed clients
- [ ] All form fields editable in consultant mode (full parity)
- [ ] No prefill email on save — page stays focused on profile editing
- [ ] If `?from=workspace` query param present: render "Back to client workspace" link

### Backend
- [ ] `PUT /api/companies/:id` middleware extended to accept CONSULTANT role iff `:id ∈ user.managed_businesses`
- [ ] Reuse `requireManagedClient` middleware (no new middleware code)
- [ ] No new email plumbing
- [ ] No new model fields

### Workspace integration (Profile tab)
- [ ] `client-workspace.html#tab=profile` content navigates to `/pages/company-profile.html?client=:id&from=workspace`
- [ ] Stage pill row + history accordion (per Epic 24.1) render at top of profile body via the same page

### `ConsultantPageMode` helper (`client/js/consultant-page-mode.js`)
- [ ] Exposed on `window.ConsultantPageMode`
- [ ] `detect()` reads URL params + `karvia_user`; checks `managed_businesses`; returns mode object
- [ ] `renderBanner(companyName)` injects banner DOM if consultant mode; idempotent (re-renders OK)
- [ ] No state — pure functions calling `karvia_user` from `localStorage`
- [ ] Tightly scoped — does NOT include other consultant utilities

## Tests

NEW `scripts/test-sprint24-242-profile-tab.js`:
- `ConsultantPageMode.detect()` truth table: 4 combinations of param × role × managed → correct mode
- `ConsultantPageMode.renderBanner()` injects banner DOM correctly; idempotent
- Page in consultant mode shows banner; in self mode does not
- Page rejects unauthorized `?client=:id` (consultant + not in managed_businesses)
- Backend: `PUT /api/companies/:id` accepts CONSULTANT for managed client
- Backend: rejects CONSULTANT for unmanaged client (403)
- Backend: rejects CONSULTANT for cross-tenant id (403)
- Owner-side save (no `?client`) unchanged
- Workspace Profile tab navigates correctly to `?client=:id&from=workspace`
- Banner content reads "You are editing {name} as their consultant"

Target: ~25-35 assertions.

## Implementation Notes

### Files to create
- `client/js/consultant-page-mode.js`
- `scripts/test-sprint24-242-profile-tab.js`

### Files to modify
- `server/middleware/auth.js` (or wherever route middleware composes) — extend `PUT /api/companies/:id`
- `server/routes/companies.js` — confirm CONSULTANT branch works in PUT handler
- `client/pages/company-profile.html` — `<script>` boot calls `ConsultantPageMode.detect()`; banner markup placeholder
- `client/pages/scripts/company-profile.js` (or wherever page controller lives) — adapt load/save target based on detected mode
- `client/pages/client-workspace.html` — Profile tab content area (page-navigate)
- `client/pages/scripts/client-workspace.js` — Profile tab handler

### Surgical reuse
- ✅ `requireManagedClient` middleware from S22a #184a
- ✅ Existing `GET /api/companies/:id` (already permits consultant access via tenant check)
- ✅ Existing `PUT /api/companies/:id` route handler (just gate role earlier)
- ✅ Existing `company-profile.html` form, validation, save UX
- ✅ S22a #184d `sendInvitationLinkEmail` (no new email work)

### What's net new
- 1 middleware composition tweak (1-line change)
- 1 page query-param branch in boot
- `consultant-page-mode.js` shared helper (~50-80 LOC)
- Banner markup + render fn

### Risk mitigations
- **R6 (page edge cases under dual-trust)**: pre-implementation audit step — read `company-profile.html` end-to-end for hidden role/tenant assumptions. Document findings before edits. If purple-banner-style regressions surface, fix in this epic.
- **R2 (two trust modes on PUT)**: explicit cross-tenant negative tests verify consultant can't edit unmanaged company

## Out of Scope (deferred elsewhere)

- Audit trail of profile edits → MASTER_PRODUCT_BACKLOG (post-Beta)
- Email notification on consultant prefill → REMOVED entirely (rely on standard invitation email)
- Field-level edit history / activity feed → S25+ backlog if desired
