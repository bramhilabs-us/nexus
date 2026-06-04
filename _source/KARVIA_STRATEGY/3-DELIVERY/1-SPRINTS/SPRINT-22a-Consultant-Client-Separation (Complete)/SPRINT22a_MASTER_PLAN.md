# Sprint 22a — Consultant ↔ Client Architectural Separation

<!-- @GENOME T3-SPR-022a | DRAFT | 2026-04-30 | parent:T1-PRD-001 | auto:/init,/strategy | linked:/coding,/audit -->

**Sprint Type**: Architectural refactor (Beta blocker)
**Trigger**: Sprint 22 #183b uncovered that consultant pages (`quarterly-goals.html`, `planning-v2.html`) JWT-swap consultants into the client tenant — leaking client UI ("Viewing as: Client Company" purple banner) and breaking the "consultant stays in own app" mental model.
**Sprint Duration**: ~5 sessions (~28 pts)
**Dependencies**: Sprint 22 closed (Epic E deferred to Sprint 23)

---

## Sprint Goal

CONSULTANT users stay in their own JWT context (RSM Consulting) and consume client data through new consultant-scoped read APIs (`GET /api/consultant/clients/:id/*`), rendered in a single tabbed page `client-workspace.html` themed for the consultant app. The legacy `PUT /api/auth/switch-company` is retired from consultant flows. Client POCs receive real email invitations, create their own accounts, and live in fully isolated workspaces.

---

## Why this sprint exists (one paragraph)

Today the platform models tenant scope as JWT-derived: `req.user.company_id` IS the tenant. To "view a client", a consultant calls `PUT /api/auth/switch-company`, which mutates the JWT and the user's `current_company_id`. The consultant *becomes* the client. This is wrong on three axes: (1) **UX** — consultant nav, theme, and identity flip mid-session, surfaced by the indigo "Viewing as" banner in `navigation.js:448-465`; (2) **Security** — every read path trusts JWT scoping, so any race or stale token fetches the wrong tenant; (3) **Future-proofing** — invitation flow, client onboarding, and per-client analytics all depend on consultants and clients being separate tenants with separate accounts. Sprint 22a fixes the model, not the symptoms.

---

## Sequencing

| # | Session | Epic | Pts | Status |
|---|---------|------|-----|--------|
| 0 | Audit | Pre-Sprint Architectural Audit (no code) | 0 | ⏳ Next |
| 1 | #184a | Consultant Read API surface | 8 | Queued |
| 2 | #184b | `client-workspace.html` (single tabbed page) | 8 | Queued |
| 3 | #184c | Retire `switch-company` from consultant flows | 3 | Queued |
| 4 | #184d | Invitation flow (Mailjet wired) | 6 | Queued |
| 5 | #184e | Auto stage transitions + history sub-doc | 3 | Queued |

**Total**: 28 pts across 5 sessions + 1 audit. Audit ships **first**, no code.

---

## Audit-First (Pre-Sprint Session)

The audit session is mandatory before #184a. Output goes to `audit/`:

| Artifact | Purpose |
|---|---|
| `AUDIT_BRIEF.md` | What questions the audit must answer (this is the prompt) |
| `AUDIT_REPORT.md` | Findings: every line where switch-company is called, every page that swaps, every model field involved, every assumption |
| `API_CONTRACT.md` | Full request/response shapes for the 6 new consultant endpoints + auth/error contracts |
| `DATA_FLOW.md` | Sequence diagrams: "consultant adds client → POC receives email → POC creates account → consultant sees objectives" |
| `IMPACT_ON_SPRINT22_EPICS.md` | Already drafted in this plan (Section "Sprint 22 Carry-Over Impact" below). Audit confirms or revises. |

**Audit budget**: ~50K tokens, no code.
**Exit criteria**: User reviews and signs off on `API_CONTRACT.md` and `DATA_FLOW.md` before #184a starts.

---

## Epic Briefs

### #184a — Consultant Read API Surface (8 pts)

NEW endpoints in `server/routes/consultant.js`, all `requireRole('CONSULTANT')` + `req.params.id ∈ req.user.managed_businesses`:

| Endpoint | Returns |
|---|---|
| `GET /api/consultant/clients/:id/profile` | Company doc + computed risk + last activity |
| `GET /api/consultant/clients/:id/objectives` | Objectives w/ KR rollups, scoped to that client |
| `GET /api/consultant/clients/:id/goals/quarterly?quarter=&year=` | Quarterly goals for the client |
| `GET /api/consultant/clients/:id/goals/weekly?quarterly_id=` | Weekly goals under a Q goal |
| `GET /api/consultant/clients/:id/teams` | Team list + member counts |
| `GET /api/consultant/clients/:id/assessments` | Assessments + status + last completion |
| `GET /api/consultant/clients/:id/dashboard-summary` | One-call summary: SSI + objectives + teams + assessments + last activity |

Tests: in-memory `MongoMemoryReplSet`, ~30 assertions (happy path + 403-on-unmanaged + tenant-isolation negative).
**No model changes. No write paths. Read-only.**

### #184b — `client-workspace.html` (8 pts)

NEW `client/pages/client-workspace.html` + `client/pages/scripts/client-workspace.js`. Single tabbed page in **consultant theme** (no purple banner, no JWT swap):
- Tabs: Profile / Objectives / Plan / Teams / Assessments
- Tab state in URL hash (`#tab=plan`); back button works
- Each tab consumes the matching #184a endpoint
- Top nav stays "RSM Consulting" — never changes
- Repoints `my-clients.js`:
  - Status ▾ → `client-workspace.html?client=X#tab=assessments`
  - Plan ▾ → `client-workspace.html?client=X#tab=plan`
  - Objectives box → `client-workspace.html?client=X#tab=objectives`
  - Tile body → `client-workspace.html?client=X#tab=profile`

### #184c — Retire `switch-company` from consultant flows (3 pts)

- `my-clients.js navigateToClient()` no longer calls `switch-company`; just navigates with `?client=X`
- `KarviaCommon.ensureActiveCompany()` early-returns for CONSULTANT (deprecated for that role)
- `objectives.js` / `quarterly-goals.js` preflights become no-ops for CONSULTANT
- `navigation.js` purple "Viewing as" banner code path stays for non-CONSULTANT roles only (BUSINESS_OWNER multi-org future)
- DELETE `client/pages/quarterly-goals.html` + `client/js/quarterly-goals.js` (orphaned prototype, only inbound link was Plan ▾ which moves to client-workspace)
- DELETE phantom reference to `weekly-goals.html` (page never existed)
- KEEP `planning-v2.html` intact — it remains the canonical planning page for BUSINESS_OWNER / EXECUTIVE / MANAGER

`switch-company` route stays alive but is no longer used by the consultant frontend.

### #184d — Invitation flow wired (6 pts)

- `POST /api/consultant/clients` reactivates D-C-8: creates `Invitation` document (model exists), sends Mailjet email
- NEW `client/pages/accept-invitation.html` + handler — POC enters first/last/password → server creates User w/ role `BUSINESS_OWNER`, `company_id = clientCompany`, links via Invitation token
- On accept: Company.stage transitions `prospect → onboarding`
- Email template: "{POC name}, RSM Consulting set up your YSELA workspace at {company.name}. Click to claim."

### #184e — Auto stage transitions (3 pts)

- New `Company.stage_history` sub-doc (audit trail of transitions w/ actor + timestamp)
- Hooks (post-save middleware OR explicit calls in route handlers):
  - First POC User created → `prospect → onboarding`
  - First Objective created for client → `onboarding → objective_identified`
  - First Assessment completes → progress signal (no stage flip yet, just history entry)
- Manual stage edits still allowed (consultant can override via Edit modal)

---

## Sprint 22 Carry-Over Impact (per audit)

The audit of remaining Sprint 22 epics determined:

| Epic | Pts | Original Sprint 22 status | Sprint 22a impact | Disposition |
|------|-----|---------------------------|--------------------|-------------|
| **Epic E (Objective Wizard)** | 10 | Queued next | Wizard is role-agnostic; doesn't assume JWT-swap. Consultant access path becomes `client-workspace.html` (post-22a) | **Defer to Sprint 23** — Sprint 22a takes its slot |
| **Epic H (Planning Page)** | 10 | Bundled with G | `planning-v2.html` is BUSINESS_OWNER/EXECUTIVE/MANAGER-native; doesn't assume consultant JWT-swap | **No conflict** — can ship Sprint 23 |
| **Epic D (Assessment Hub)** | 8 | Queued | Already uses `managed_businesses[]` pattern (line 208 of D spec). No JWT-swap assumption | **No conflict** — can ship Sprint 23 |
| **Epic G (Dashboard V3 + Theme)** | 10 | Buffer | V3 layout + Navy/Gold theme are safe. **Tasks→Moves rename** has consultant-view risk if it ships before #184c | **Split** — ship V3 layout + theme in Sprint 23; Tasks→Moves rename gated on #184c (post Sprint 22a) |

Audit identified a planning gap: **none of the Sprint 22 epic specs explicitly document user role**. Sprint 22a's audit deliverable will produce a retroactive Epic ↔ Role matrix to prevent recurrence.

---

## Decisions Locked Before Coding

| # | Decision | Rationale |
|---|---|---|
| D1 | Single tabbed `client-workspace.html` (not per-resource pages) | One URL, one lifecycle, lazy-load tabs, consistent consultant theme |
| D2 | Audit session before #184a | Catches data-model gaps before they become bugs |
| D3 | Sprint 22 closes BEFORE Sprint 22a opens | Clean velocity tracking, clean genome separation |
| D4 | Epic E deferred to Sprint 23 | Sprint 22a is Beta blocker; Epic E is not |
| D5 | `switch-company` route stays alive | Legacy admin / future BUSINESS_OWNER multi-org may need it; #184c only retires the *consultant frontend usage* |
| D6 | `quarterly-goals.html` deleted in #184c, not before | Plan ▾ button (added in #183b) is its only inbound link; deleting now would 404; bundled w/ repoint to `client-workspace.html` |
| D7 | `planning-v2.html` preserved | Active for BUSINESS_OWNER / EXECUTIVE / MANAGER; only consultant entry path retires |

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Audit underestimates a hidden JWT-swap caller and #184c misses it | Medium | Audit produces exhaustive grep results; #184c test asserts zero `switch-company` calls from consultant pages |
| Mailjet template not configured for invitation copy | Low | #184d audit task #1 — verify template ID + dry-run sandbox before scoping |
| `client-workspace.html` consultant theme drifts from "RSM Consulting" mental model | Low | #184b reuses existing nav rendering; tab content is the only new theme |
| Stage auto-transition #184e fires retroactively on legacy companies | Medium | History entry only on go-forward; no backfill; explicit `created_at` guard |
| Dropping switch-company breaks BUSINESS_OWNER flows we don't know about | Low | The route stays alive; only consultant *callers* are retired |

---

## Success Criteria

By Sprint 22a close:

- [ ] Audit report signed off by user
- [ ] Six new consultant-scoped read endpoints live + tested
- [ ] `client-workspace.html` loads any managed client in consultant theme; no purple banner; no JWT swap
- [ ] All four `my-clients.js` tile actions repoint to `client-workspace.html`
- [ ] `quarterly-goals.html` deleted; nothing 404s
- [ ] `planning-v2.html` untouched; BUSINESS_OWNER flows still work
- [ ] Add Client wizard sends real Mailjet invitation; POC can accept and create account
- [ ] Stage `prospect → onboarding` fires on POC account creation
- [ ] Zero `switch-company` calls in consultant frontend (grep-asserted in test)
- [ ] All Sprint 22 regression tests still green (Epic C Phase 3 37/37, C-Polish 40/40, Status 24/24, Cockpit 34/34)

---

**Status**: DRAFT — pending audit completion
**Next session**: Audit (no code) — see `audit/AUDIT_BRIEF.md`
