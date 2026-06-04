# Sprint 24 — Dependencies & Risks

<!-- @GENOME T3-SPR-024-RISKS | ACTIVE | 2026-05-05 | parent:T3-SPR-024-MP | auto:/coding | linked:- -->

**Companion to**: [SPRINT24_MASTER_PLAN.md](SPRINT24_MASTER_PLAN.md)
**Last updated**: 2026-05-05 — architectural audit findings F-1..F-13 + decisions appended below

---

## Dependencies

### Upstream (must hold from prior sprints)

| Dependency | Source | Used by | Verified? |
|---|---|---|---|
| `requireManagedClient` middleware | S22a #184a | All consultant routes | ✅ 55/55 in 184a tests |
| `Company.stage_history[]` sub-doc | S22a #184e | Epic 24.1 history accordion + Epic 24.6 migration | ✅ 36/36 in 184e tests |
| `StageTransitionService.manualTransition()` | S22a #184e | Epic 24.1 stage pill row + Epic 24.6 | ✅ 36/36 in 184e tests |
| `Company.risk_status` virtual | S22 D-C-5 / S22a Phase 3.1 | Epic 24.1 health chip | ✅ Phase 3.1 47/47 |
| Mailjet `brandedHeaderTemplate` | S22a #184d | Epic 24.2 prefill email | ✅ 184d 36/36 |
| `Objective.discipline_ids[]` + `ssi_impact` | S23 #190 | Epic 24.3 tile fields | ✅ 190 76/76 |
| `Objective.virtual('key_results_v2')` + dual-write | S23 #190 | Epic 24.3 KR mix display + Epic 24.7 audit | ✅ 190 76/76 |
| `Assessment.ssi_result.constraint` | S23 #188 | Epic 24.3 constraint banner | ✅ 188 39/39 |
| `GET /api/consultant/clients/:id/{profile,objectives,goals/{quarterly,weekly},assessments}` | S22a #184a | Epic 24.3 + 24.4 + 24.5 | ✅ 184a 55/55 |
| ISO 8601 week helpers | S23 #191 | Epic 24.4 plan tree | ✅ 191 71/71 |
| Move display label constants | S23 #192a | Epic 24.4 plan tree move badges | ✅ 192a 50/50 |
| `LLMGateway.js` sole OpenAI chokepoint | S22a Phase 2.1 | Epic 24.7 enrich diagnosis | ✅ 18/18 |
| `assessment-charts.js` Trends + Compare | S23 #189 | Epic 24.5 in consultant mode | ✅ 189 45/45 |

### Downstream (S24 deliverables that future sprints depend on)

| Future use | Dependency on S24 |
|---|---|
| Hybrid Behavior Classification (S25) | `Objective.ball_state` model is independent — no conflict |
| Owner-side `objectives.html` redesign (S25) | `Objective.consultant_notes` MUST stay private — privacy test inherited |
| Beta launch `/deploy` session | Migration script tested on dev/pre-prod |

---

## Risks (formalized R-list from brainstorm rounds)

### 🔴 Critical

#### R1 — Migration data corruption
**Status**: ✅ Mitigated by your decision (test data only; clean prod launch post-May 15)
**Original risk**: Stage 7→4 collapse + ball-state seeding could lose state on production data
**Mitigation**:
- Migration is dev/pre-prod only
- Idempotent (safe to re-run)
- Each transition writes to history with `triggered_by='migration_2026_05'`
- Production NOT migrated; clean launch post-May 15
**Residual risk**: Low

#### R2 — Two trust modes on `PUT /api/companies/:id`
**Status**: 🟡 Active risk; mitigation in place
**Risk**: Allowing CONSULTANT writes via `requireManagedClient` introduces a new attack surface. Bug in middleware → consultant edits unmanaged company.
**Mitigation**:
- Reuse battle-tested `requireManagedClient` from S22a #184a (55 assertions green)
- Explicit cross-tenant negative tests in Epic 24.2 test suite
- No new middleware written
**Owner**: Epic 24.2

#### R3 — Cross-page CSS coupling on Objectives tile redesign
**Status**: 🟡 Active risk; mitigation in place (D-4 dropped owner-side redesign from S24)
**Risk**: Sharing CSS classes between `objectives.html` (owner) and `client-workspace.html#tab=objectives` (consultant) means edits to one regress the other.
**Mitigation**:
- **Namespace** consultant tile CSS as `.objective-tile--consultant` (per Epic 24.3 acceptance criteria)
- Copy don't share — slightly more LOC, much safer
- Owner-side `objectives.html` untouched in S24
**Owner**: Epic 24.3

### 🟡 High

#### R4 — Ball-state trigger evaluation latency
**Status**: ✅ Mitigated by D-3 decision (`res.on('finish')` post-response)
**Risk**: Every `POST /weekly-goals`, `POST /moves`, `PUT /objectives` re-evaluates a composite predicate. On large clients, could add latency.
**Mitigation**:
- Predicate evaluation deferred to `res.on('finish')` — fires after response sent, zero perceived latency
- Predicate is 1-2 indexed lookups, cheap
- Errors logged but not propagated
**Residual risk**: Very Low

#### R5 — `at_risk` semantic loss after stage collapse
**Status**: 🟡 Active; pre-migration audit covers
**Risk**: Companies currently `at_risk` lose explicit badge. Computed `health` chip may not match consultant expectations.
**Mitigation**:
- Migration audit pass lists all `at_risk` companies with their computed `health` side-by-side BEFORE proceeding
- If formula needs tuning, surface as a side-quest in Session A
**Owner**: Epic 24.6

#### R6 — `company-profile.html` edge cases under dual-trust
**Status**: 🟡 Active risk; audit-before-edit policy
**Risk**: Page wasn't built for two trust modes. Hidden role checks, tenant assumptions, redirect-on-403 logic could surface unexpected behavior when `?client=:id` is set.
**Mitigation**:
- Pre-implementation audit step in Epic 24.2 — read page end-to-end, document findings
- Fix any role-coupling discovered as part of the same epic
- Reference: S22a #183b discovered the purple-banner regression via similar audit
**Owner**: Epic 24.2

#### R7 — `Objective.consultant_notes` leakage
**Status**: 🟡 Active risk; explicit test mitigates
**Risk**: Mongoose returns all schema fields by default. If `consultant_notes` is included in any owner-facing GET response, the field leaks.
**Mitigation**:
- Explicit field exclusion in `routes/objectives.js` GET projections
- `select: false` on the schema field as belt-and-braces
- Privacy test in Epic 24.3 test suite: owner GET on objective with non-empty notes returns object without `consultant_notes`
- Frontend grep-assert: no reference to `consultant_notes` in owner-side HTML/JS
**Owner**: Epic 24.3

### 🟢 Medium

#### R8 — Email-on-prefill spam
**Status**: ✅ Mitigated by D-6 (default first-save-only)
**Risk**: Multiple consultant saves → multiple emails to owner.
**Mitigation**:
- `Company.profile_prefilled_at` timestamp; email fires only when null on save (then set)
- Test: 5 consecutive saves → exactly 1 email
**Owner**: Epic 24.2

#### R9 — Stage-pill click triggers wrong stage
**Status**: ✅ Mitigated by D-9 (confirmation modal)
**Risk**: Consultant click-throughs misfire stage transitions.
**Mitigation**: Confirmation modal with stage diff ("Move from Onboarding → Active?")
**Owner**: Epic 24.1

#### R10 — `team-ssi-view.html` edge cases under dual-trust
**Status**: 🟡 Same shape as R6; audit-before-edit
**Mitigation**: Pre-implementation audit in Epic 24.5 (lighter than R6 — page is more recently touched and cleaner)
**Owner**: Epic 24.5

#### R11 — Backups pre-S24
**Status**: ✅ Mitigated by your decision (R2 backlogged; test data only)
**Risk**: No automated DB backups in dev/pre-prod
**Mitigation**: Logged in BACKLOG.md; not blocking S24
**Residual risk**: Low (test data; migration idempotent)

### ⚪ Low

#### R12 — `ball_state_history[]` unbounded growth
**Status**: ⏸️ Not a Beta concern
**Mitigation**: Flag for S30+ if entries exceed 100 per objective in production

#### R13 — Auto-transition race conditions
**Status**: ✅ Mitigated by `findOneAndUpdate` predicate
**Risk**: Concurrent writes (owner set + WeeklyGoal create simultaneously) double-fire transition
**Mitigation**: `findOneAndUpdate({_id, ball_state: fromState})` predicate prevents double-fire (same pattern as S22a #184e)
**Owner**: Epic 24.3

#### R14 — Test suite runtime growth
**Status**: 🟡 Active; not blocking
**Risk**: S24 adds ~200+ new assertions; CI runtime creeps
**Mitigation**: Use in-memory MongoDB (already pattern); skip live OpenAI in tests

---

## Open Watch-Items (mid-sprint check-ins)

- [ ] After Session A: Did KR creation audit surface any blocker? If yes, scope of fix?
- [ ] After Session A: Did enrich endpoint diagnosis surface a code bug or upstream config issue?
- [ ] After Session A: Migration ran clean on dev? If pre-prod, also clean?
- [ ] After Session C: Did `company-profile.html` audit (R6) surface unexpected role-coupling?
- [ ] After Session E: Is the constraint banner accurate for clients with no completed assessment?
- [ ] After Session G: 5-verb acceptance test executed end-to-end with one real client?
- [ ] After Session G: Beta-launch readiness — is the system ready for clean-data prod launch post-May 15?

---

## Assumption Tracker (from Round 5)

| ID | Assumption | Status |
|---|---|---|
| A1 | Consultant primary use is onboarding + objective creation + tracking + nudging | ✅ Confirmed |
| A2 | Consultant is sole user of My Clients page | ✅ Confirmed |
| A3 | `consultant_notes` truly invisible to client side | ✅ Confirmed; R7 enforces |
| A4 | Sustained = stays alumni, no archive | ✅ Confirmed |
| A5 | Objective requires ≥1 KR before `handed_off` | ✅ Confirmed |
| A6 | `Objective.owner_id` always intra-tenant | 🟡 To verify in Session A |
| A7 | Profile completion check optional (Q-B (c) → just objective created) | ✅ Confirmed |
| A8 | "Latest assessment exists" = ≥1 with `status='completed'` | ✅ N/A (Q-B (c) dropped this preconditon) |
| A9 | Production has clean launch post-May 15 — no prod migration | ✅ Confirmed |
| A10 | Dev/pre-prod data safely migratable | ✅ Confirmed |
| A11 | S24 = consultant-side only; owner-side untouched (incl. owner-side `objectives.html`) | ✅ Confirmed (D-4) |
| A12 | Mailjet template/DKIM config in place | ✅ Confirmed; reused from S22a #184d |
| A13 | Live browser smoke = post-S24 `/testing` session | ✅ Confirmed |
| A14 | Beta date doesn't block sprint planning | ✅ Confirmed (D-1) |
| A15 | "Mark Sustained" only on `sustained_eligible=true` tiles | ✅ Confirmed |
| A16 | Auto-transitions silent (no toast) | ✅ Confirmed (D-6) |
| A17 | Stage pill row requires confirmation modal | ✅ Confirmed (D-9) |


---

## Architectural Audit Findings (F-1 through F-13) — locked 2026-05-05

The audit walkthrough produced 13 findings; all locked. This section formalizes them post-resolution.

### Critical findings (F-1, F-2)

#### F-1 — Common state model + label cohesion
**Resolution**: Adopt 6-stage canonical `Objective.lifecycle_stage` enum (closes DEBT-007). Consultant 3-stage ball-view derived via mapping function. Unified `client/js/display-labels.js` subsumes S23 #192a label constants.
**Closes**: DEBT-007 / FEAT-044 (Objective Lifecycle Redesign)
**Owner**: Epic 24.3

#### F-2 — Generic LifecycleTransitionService
**Resolution**: Path α — new generic service; `StageTransitionService` becomes thin wrapper; telemetry emission via existing `TelemetryService`. Two configured instances (Company stage + Objective lifecycle).
**Owner**: Epic 24.3

### High findings (F-3, F-4, F-5)

#### F-3 — Email-on-prefill tracking
**Resolution**: REMOVED from scope. No prefill tracking field/sub-doc/email. Rely on existing S22a #184d `sendInvitationLinkEmail` invitation flow. Consultant context banner kept (Q2.C).
**Owner**: Epic 24.2

#### F-4 — Page-reuse pattern shared helper
**Resolution**: NEW `client/js/consultant-page-mode.js` exposed as `window.ConsultantPageMode`. Consumed by Profile + Assessments pages. Tightly scoped — only page-mode detection + banner.
**Owner**: Epic 24.2 (creates), Epic 24.5 (reuses)

#### F-5 — Migration script path
**Resolution**: NEW `scripts/db/` folder. Migration named by behavior, no sprint number, no date: `scripts/db/migrate-stages-and-lifecycle.js`. Move existing `seed-assessments.js` + `validate-assessments.js` into `scripts/db/`. Update `package.json` paths.
**Owner**: Epic 24.6

### Medium findings (F-6, F-7, F-9, F-10, Epic 24.8)

#### F-6 — Component CSS pattern
**Resolution**: NEW `client/css/components/` folder with `objective-tile.css` as first component. Modifier classes (`.is-consultant-view`, `.is-owner-view`). Owner-side adoption deferred to S25 Epic 25.3. Pattern documented in `.claude/DESIGN_SYSTEM.md`.
**Owner**: Epic 24.3

#### F-7 — `?include=tasks,moves` API convention
**Resolution**: Inline implementation in 2 existing consultant goal endpoints. Hard-coded whitelist. No shared middleware (YAGNI — extract only if 3rd consumer appears).
**Owner**: Epic 24.4

#### F-9 — `sustained_eligible` storage
**Resolution**: Mongoose virtual computed at read time. No stored field, no update hooks. Aligns with S22a Phase 3.1 virtuals pattern.
**Owner**: Epic 24.3

#### F-10 — `handoff_eligible` storage
**Resolution**: Not stored, not exposed as virtual. Predicate is internal to `LifecycleTransitionService.evaluateAndTransitionAfterWrite()`. Once predicate is true, hook flips `lifecycle_stage` directly. The lifecycle field IS the answer.
**Owner**: Epic 24.3

#### Epic 24.8 — Bug Backlog Sweep (NEW)
**Resolution**: YES — covers B-6 (`postpone_reason` schema persistence, ~1 pt) + B-8 (navigation purple-banner cleanup verify, ~1 pt). Total ~2 pts. Rides along with Epic 24.1 (both touch navigation.js).
**Owner**: Epic 24.8

### Low findings (F-11, F-12, F-13)

#### F-11 — Emoji icons consistency
**Resolution**: Acceptable for v1; SVG polish in S25.

#### F-12 — Helper module scope discipline
**Resolution**: Keep `ConsultantPageMode` tightly scoped (page-mode + banner only). Don't let other consultant utilities accumulate.

#### F-13 — Test suite runtime growth
**Resolution**: Acceptable; flag for future CI optimization.

### Matrix-driven additions (Items #11, #12, #13)

#### Item #11 — Send-Assessment CTA on Prospect tile
**Resolution**: YES — added to Epic 24.1 (~1 pt). Visible only when `Company.stage='prospect'` AND no completed assessment exists. Routes to existing assessment-invitation flow.

#### Item #12 — Driver-aware empty state copy
**Resolution**: YES — Objectives + Plan tab empty states reflect Persona × Stage × Page Ownership matrix. Free spec adjustment.

#### Item #13 — `lifecycleView(stage, role)` signature
**Resolution**: YES — role parameter accepted; only `consultant` populated in S24. Owner/manager/employee mappings deferred to S25 Epic 25.4. Forward-compatible signature.

---

## Cross-cutting outputs from this audit

- ✅ DEBT-007 closes via S24 (canonical 6-stage `Objective.lifecycle_stage`)
- ✅ Post-S24 sprint sequence (re-planned 2026-05-06): Sprint 25 "Plumbing" + Sprint 26 "First Objective Created" + Sprint 27 "First Task Completed". Original cascade-cleanup epics (25-1, 25-2) absorbed into Sprint 25; owner-side polish epics (25-3, 25-4, 25-5) deferred to refinement track in `REFINEMENT-BACKLOG/`.
- ✅ `KARVIA_STRATEGY/1-PRODUCT/PERSONA_STAGE_OWNERSHIP_MATRIX.md` captured as canonical product reference (informs all 4 driver-aware empty-state decisions)
- ✅ S24 master plan + handoff doc updated to point each deferral at its specific S25 epic

## Updated bug list disposition

| ID | Severity | Item | Disposition |
|---|---|---|---|
| B-1 | High | AI enrich endpoint broken on dev | Epic 24.7 |
| B-2 | Suspected | KR creation flow audit | Epic 24.7 |
| B-3 | Medium | Mid-week start_date splits across two month groups | DEBT-006 / FEAT-043 (S25+) |
| B-4 | Medium | Date-sync absent across OKR cascade | DEBT-006 / FEAT-043 (S25+) |
| B-5 | P1 | Objective.status enum confusion | ✅ CLOSED by F-1 lock |
| B-6 | Medium | `postpone_reason` silently dropped | Epic 24.8 |
| B-7 | Low | Move collection emptiness for Beta | post-S24 `/testing` |
| B-8 | Low | navigation.js purple banner cleanup verify | Epic 24.8 |

