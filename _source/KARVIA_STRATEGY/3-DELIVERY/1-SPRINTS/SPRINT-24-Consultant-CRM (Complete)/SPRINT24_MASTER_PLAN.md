# Sprint 24 — Consultant CRM (My Clients as Operating Surface)

<!-- @GENOME T3-SPR-024-MP | ACTIVE | 2026-05-04 | parent:T1-PRD-002 | auto:/coding,/strategy | linked:/sprint-review,/audit -->

**Status**: 🟢 OPEN — 2026-05-04
**Sprint Goal**: Turn the My Clients page into the consultant's operating surface so they can retire their tracking spreadsheet.
**Total Points**: 23–29 net new
**Close Target**: task-driven (no fixed date — closes when 5-verb acceptance test passes)
**Beta Launch Target**: post-S24, separate `/deploy` session

---

## Sprint Goal (the why)

The consultant today maintains an external spreadsheet to track:
- Per-objective state (Identified → Handed Off → Sustained)
- Per-objective owner, status %, SSI impact, behaviors, timeframe, free-text notes
- Per-company stage and health

Sprint 24 makes the My Clients page the canonical surface for this work. The consultant should never need to leave the app to know:
- Where each client is in the engagement lifecycle
- Which objectives are theirs vs. handed off vs. sustained
- What's actually happening week-to-week (planning + moves)
- Consolidated assessment results

## Sprint 24 Acceptance Test — The 5 Verbs

Sprint 24 ships when, working on a single client end-to-end, a consultant can:

1. **Onboard** — create the company on `my-clients.html` (Add Client wizard already shipped) → fill profile via `company-profile.html?client=:id` → send invitation
2. **Engage** — open `client-workspace.html#tab=assessments` → view consolidated SSI results via `team-ssi-view.html?client=:id`
3. **Track** — open `client-workspace.html#tab=objectives` → see ball-state per objective + Plan tab tree
4. **Empower** — write consultant_notes per objective → manually transition company stage via Profile tab pill row → mark sustained when ready
5. **Hand-off** — observe ball-state auto-flip from `identified → handed_off` as the client creates KRs and weekly plans

If a consultant can do all 5 with one client and zero spreadsheet, S24 is done.

---

## Architectural Foundation (locked from Sprint 22a)

This sprint builds **on top of** the 4-layer Lego floor established in Sprint 22a. Non-negotiable invariants:

- ✅ Zero executable `switch-company` callers in consultant page scripts
- ✅ LLMGateway sole executable OpenAI chokepoint
- ✅ All consultant data access goes through `requireManagedClient` middleware
- ✅ Two-app boundary: consultant tenant ↔ client tenant; never JWT-swap
- ✅ StageTransitionService is the only writer of `Company.stage` transitions
- 🆕 BallStateService is the only writer of `Objective.ball_state` transitions (NEW for S24)

**Architectural pattern S24 introduces**: page-reuse via `?client=:id` query param. Consultant becomes an alternative entry point to existing client-tenant pages (`company-profile.html`, `team-ssi-view.html`) without forking the page or swapping JWT. Server-side dual-auth is applied surgically to ONE route at a time, gated by `requireManagedClient`.

---

## The Two Lifecycle Axes (the data model story)

The product has two orthogonal lifecycles, both made explicit in S24:

### Axis 1 — Company Lifecycle (per-company)
4 stages: `prospect → onboarding → active → paused/churned`

| Stage | Meaning | Trigger |
|---|---|---|
| `prospect` | Lead identified, no commitment | Default on create |
| `onboarding` | Engagement started; profile/teams/first assessment in setup | Auto on first invitation accepted (S22a #184d, existing) |
| `active` | At least one ball in flight | Auto on first objective created (rename from `objective_identified`) |
| `paused` | Engagement on hold, may resume | Manual only |
| `churned` | Relationship ended, won't return | Manual only |

Drop entirely: `objective_identified` (folds into `active`), `inactive` (renames to `paused`), `at_risk` (becomes computed `health`).

### Axis 2 — Ball Lifecycle (per-objective, NEW)
3 states: `identified → handed_off → sustained` (alumni — kept engaged but not actively tracked)

| Ball State | Icon | Meaning | Trigger |
|---|---|---|---|
| `identified` | 🎯 | Objective created on the client tenant | Auto on `POST /api/objectives` (no preconditions per Q-B answer (c)) |
| `handed_off` | 🤝 | Client is naturally executing — owner assigned + KRs exist + planning underway | **Auto via composite predicate** evaluated post-response (D-3 = `res.on('finish')`): `Objective.owner_id` is a client-tenant non-CONSULTANT user AND ≥1 KR exists AND ≥1 WeeklyGoal or Move exists under any KR |
| `sustained` | 📊 | All KRs hit target. Stays alumni. | **Smart-prompted manual** — system flags `sustained_eligible=true` when all KRs complete; consultant clicks "Mark Sustained" on the tile |

Observational philosophy: the ball-state model **detects state**, doesn't enforce it. The client side is untouched. If a consultant creates an objective without KRs, the system shows `🎯 Identified` until KRs naturally appear.

### Axis 3 — Health (computed, not stored)
Reuses `risk_status` virtual (S22 D-C-5 / S22a Phase 3.1). Surfaced as a chip alongside the stage.

---

## Top 4 Categories (the product surface)

### Category 1 — The Tile (My Clients page)
The consultant's at-a-glance card per client.
- Drop `Plan ▾` and `Status ▾` buttons
- Whole tile = single click → workspace `#tab=summary`
- Pencil icon (top-right) = Edit modal (with `Remove from portfolio` in Danger zone footer)
- Stage chip (4-stage company lifecycle) + Health chip (computed) — read-only

### Category 2 — The Workspace (5 tabs)
The deep view per client at `client-workspace.html`.

| Tab | Implementation pattern |
|---|---|
| **Summary** | Already shipped in S22a #184b — no changes |
| **Profile** | Page-reuse `company-profile.html?client=:id`. Dual-auth `PUT /api/companies/:id`. Banner. Email-on-prefill. 4-stage pill row + history accordion |
| **Objectives** | View-only tiles, one per objective. Ball-state icon + KR mix + owner + SSI impact + discipline pills + timeframe + consultant_notes (NEW, 280 chars). Constraint banner at top |
| **Plan** | Read-only tree (KR → QG → WG → Tasks + Moves). Auto-expand current week. Backend: `?include=tasks,moves` populate extension on existing consultant endpoints |
| **Assessments** | Page-reuse `team-ssi-view.html?client=:id`. Read-only |

### Category 3 — Ball Lifecycle (per-objective state model)
NEW `Objective.ball_state` enum + `Objective.consultant_notes` + `Objective.ball_state_history[]`. NEW `BallStateService` mirroring `StageTransitionService`. Composite trigger evaluated post-response.

### Category 4 — Company Lifecycle (per-company state model)
Reuse existing `StageTransitionService`. Rename one trigger (`onboarding → active`). Drop 3 enum values.

---

## The Onion Philosophy (locked 2026-05-05)

Every layer of the consultant surface follows the same shape: **KPIs at the top, details below**. The consultant peels through layers — once they learn one, they know all of them.

| Layer | Surface | KPI strip | Details below |
|---|---|---|---|
| Layer 1 | `my-clients.html` | 4 portfolio KPIs | Tile grid (each tile = mini-KPI: stage chip, health chip, ball-state distribution micro-line) |
| Layer 2 | `client-workspace.html` Summary tab | 5 client-level KPIs (refactored to use shared component) | Navigation index (no details section in S24) |
| Layer 3 | Workspace Objectives tab | 4 cards (Health / Constraint / Drivers / Velocity) | Objective tiles with ball-state icons |
| Layer 3 | Workspace Plan tab | 4 cards (This Week / Today / Catch-up / Freshness) | Behaviors strip (γ-lite) + tree (Tasks-only) |
| Layer 3 | Workspace Teams tab | 4 cards (Teams / Assessment Completion / Coverage / Avg SSI) | Existing team list (unchanged) |
| Layer 3 | Workspace Assessments tab | Existing 4 cards via page-reuse (`team-ssi-view.html`) | Existing layout (unchanged) |

**Implementation backbone**: shared `client/css/components/tab-header.css` + `renderKPIStrip()` helper (Epic 24.9). Every consumer renders identically; only data differs.

## Epic Breakdown (post-architectural-audit + onion philosophy, 2026-05-05)

| Epic | Description | Pts | Spec |
|---|---|---|---|
| **24.1** | Tile cleanup + 5-stage company lifecycle + Profile-tab stage pill row + history accordion + Send-Assessment CTA on Prospect tiles + **ball-state distribution micro-line** | 4-5 | [EPIC_24-1_TILE_AND_STAGE.md](epics/EPIC_24-1_TILE_AND_STAGE.md) |
| **24.2** | Profile tab page-reuse + dual-auth middleware + consultant banner + shared `ConsultantPageMode` helper (no prefill tracking, no new email) | 3-4 | [EPIC_24-2_PROFILE_TAB.md](epics/EPIC_24-2_PROFILE_TAB.md) |
| **24.3** | Objectives tab + 6-stage `Objective.lifecycle_stage` enum (closes DEBT-007) + generic `LifecycleTransitionService` + composite triggers + `consultant_notes` + **KPI strip via Epic 24.9 component** + unified `display-labels.js` + `sustained_eligible` virtual + driver-aware empty state | 7-9 | [EPIC_24-3_OBJECTIVES_AND_BALL_STATE.md](epics/EPIC_24-3_OBJECTIVES_AND_BALL_STATE.md) |
| **24.4** | Plan tab read-only tree + inline `?include=tasks,moves` populate + **γ-lite Behaviors strip (recurring Moves grouped by title; v1 — full β in S25 Epic 25.5)** + **KPI strip via Epic 24.9 component** | 5-6 | [EPIC_24-4_PLAN_TAB.md](epics/EPIC_24-4_PLAN_TAB.md) |
| **24.5** | Assessments tab — page-reuse `team-ssi-view.html?client=:id` (Path α) + `ConsultantPageMode` helper reuse | 3-4 | [EPIC_24-5_ASSESSMENTS_TAB.md](epics/EPIC_24-5_ASSESSMENTS_TAB.md) |
| **24.6** | Migration script in `scripts/db/` (dev/pre-prod only): 7→5 company stages + Objective `lifecycle_stage` seeding; ALSO move existing seed/validate scripts into `scripts/db/` | 1-2 | [EPIC_24-6_MIGRATION.md](epics/EPIC_24-6_MIGRATION.md) |
| **24.7** | Bug-fix sweep — enrich endpoint diagnosis + KR-creation discovery audit | 2 | [EPIC_24-7_BUG_SWEEP.md](epics/EPIC_24-7_BUG_SWEEP.md) |
| **24.8** | Bug Backlog Sweep — B-6 (`postpone_reason` schema fix) + B-8 (navigation purple-banner cleanup verify) | 2 | [EPIC_24-8_BUG_SWEEP.md](epics/EPIC_24-8_BUG_SWEEP.md) |
| **24.9** | **NEW**: Shared TabHeader / KPI strip component (`client/css/components/tab-header.css` + `renderKPIStrip()`) + Teams tab KPI strip (consumed by 24.3, 24.4, refactored Summary tab, Teams) | 2-3 | [EPIC_24-9_TAB_HEADER.md](epics/EPIC_24-9_TAB_HEADER.md) |
| **Total** | | **29-37 pts** | |

**Cross-cutting deliverables shipped within these epics**:
- `client/js/display-labels.js` (Epic 24.3) — unified label module subsuming S23 #192a constants
- `client/js/consultant-page-mode.js` (Epic 24.2) — shared frontend helper for page-reuse pattern
- `client/css/components/objective-tile.css` (Epic 24.3) — first component in `client/css/components/` folder
- `server/services/LifecycleTransitionService.js` (Epic 24.3) — generic lifecycle abstraction; `StageTransitionService` becomes thin wrapper
- `scripts/db/` folder (Epic 24.6) — convention for all database scripts
- `.claude/DESIGN_SYSTEM.md` updated with component CSS pattern (Epic 24.3)
- DEBT-007 closed by adopting canonical 6-stage `Objective.lifecycle_stage` enum

---

## Dependency Order (recommended session sequence)

1. **Epic 24.7 (Bug Sweep)** — discovery first. KR-creation audit + enrich endpoint diagnosis. Blocks Epic 24.3 if KR creation has blockers.
2. **Epic 24.6 (Migration)** — dev/pre-prod migration script. Run first so subsequent test data uses the new schema.
3. **Epic 24.1 (Tile + Stages)** — surface change is small, unblocks visual integration testing.
4. **Epic 24.3 (Objectives + Ball State)** — the meatiest epic. Depends on 24.6 (schema migration) and 24.1 (4-stage company lifecycle in place).
5. **Epic 24.2 (Profile Tab)** — page-reuse pattern; once 24.1 stage pill row is wired this epic adds the profile body.
6. **Epic 24.4 (Plan Tab)** — read-only tree, depends only on existing endpoints.
7. **Epic 24.5 (Assessments Tab)** — last; standalone page-reuse, no dependencies.

---

## Architectural Constraints (carried from Sprint 22a, must hold)

§10a invariants verified at every session close:

- [ ] Zero executable `switch-company` callers in `client/pages/scripts/`
- [ ] LLMGateway sole executable OpenAI chokepoint
- [ ] All consultant data access goes through `requireManagedClient` middleware
- [ ] StageTransitionService sole writer of `Company.stage`
- [ ] BallStateService sole writer of `Objective.ball_state` (NEW)
- [ ] `Objective.consultant_notes` excluded from owner-facing GET routes (Risk R7)
- [ ] No new role-check sites in `client/` outside the 22 sites locked by phase3-3 lint

---

## Architectural Audit Decisions (locked 2026-05-05)

The following 13 audit findings were walked through one-by-one and locked. All affect the epic specs above.

| ID | Finding | Decision |
|---|---|---|
| F-1 | Common state model + label cohesion | 6-stage `Objective.lifecycle_stage` enum (closes DEBT-007); 3-stage consultant ball-view via mapping in unified `client/js/display-labels.js` |
| F-2 | Service generalization | Path α — generic `LifecycleTransitionService` + `StageTransitionService` as thin wrapper; telemetry emission via existing `TelemetryService` |
| F-3 | Email-on-prefill tracking | **REMOVED** — rely on existing S22a #184d invitation flow; no new email/field |
| F-4 | Page-reuse helper | Shared `client/js/consultant-page-mode.js` (`window.ConsultantPageMode`) consumed by Profile + Assessments pages |
| F-5 | Migration script path | `scripts/db/` folder; behavior-based naming (no sprint number, no date); also move existing seed/validate scripts |
| F-6 | Component CSS pattern | `client/css/components/objective-tile.css` + modifier classes; documented in `.claude/DESIGN_SYSTEM.md` |
| F-7 | `?include=` API convention | Inline implementation in 2 endpoints; hard-coded whitelist; no shared middleware |
| F-9 | `sustained_eligible` storage | Mongoose virtual computed at read time |
| F-10 | `handoff_eligible` storage | NOT stored or virtual; predicate is internal to `LifecycleTransitionService`; `lifecycle_stage` IS the answer |
| Item #11 | Send-Assessment CTA on Prospect tile | YES — added to Epic 24.1 |
| Item #12 | Empty-state copy reflects stage driver | YES — driver-aware empty states across Objectives + Plan tabs |
| Item #13 | `lifecycleView(stage, role)` signature | YES — role param accepted; only consultant populated in S24 |
| Epic 24.8 | Bug backlog sweep | YES — B-6 + B-8, ~2 pts |

Cross-cutting:
- DEBT-007 closes by adopting canonical 6-stage enum
- S25 placeholder folder created with cascade cleanup + owner-side objectives redesign + display-labels owner mapping epics
- `KARVIA_STRATEGY/1-PRODUCT/PERSONA_STAGE_OWNERSHIP_MATRIX.md` captures Persona × Stage × Page Ownership canonical reference (informs all 4 driver-aware empty-state decisions)

## Locked Decisions (from 6 rounds of brainstorming)

### Product
- D-1: Dates parked, focus on tasks. Sprint closes when 5-verb test passes.
- D-2: KR creation NOT force-blocked. Ball-state observes natural state.
- D-3: Composite trigger evaluation via `res.on('finish')` (zero added latency).
- D-4: Owner-side `objectives.html` NOT touched in S24 (deferred to S25).
- D-5: Single-tile sustained marking (no bulk).
- D-6: Silent auto-transitions (no toast).
- D-7: `consultant_notes` capped at 280 chars.
- D-8: Emoji icons in v1 (`🎯 🤝 📊`); proper SVG in S25 polish.
- D-9: Confirmation modal on stage pill click.
- D-10: Reuse existing `risk_status` virtual (no formula tuning).
- D-11: Production data wipe = separate `/deploy` session post-S24.

### Architectural
- Path 2-α (page-reuse via `?client=:id`) for Profile + Assessments tabs.
- Dual-auth on `PUT /api/companies/:id` via `requireManagedClient` reuse.
- 3-state ball lifecycle (`identified → handed_off → sustained`); sustained = alumni, not closed.
- Q-B (c): Identified trigger = simply objective created. No profile/assessment preconditions.
- Q-C (a): Two distinct end-stages (`paused` ≠ `churned`).
- Stage 7→4 collapse with one-shot dev/pre-prod migration. Production goes clean post-May 15.

### Testing
- 5-verb acceptance test is the canonical sprint deliverable check.
- Each epic ships with its own `scripts/test-sprint24-*.js` test file.
- Full regression sweep at sprint close (S22a + S23 + S24 suites).

---

## Files Created in This Sprint (anticipated)

### NEW
- `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-24-Consultant-CRM (In Progress)/` (this folder)
- `server/services/BallStateService.js`
- `server/scripts/migrate-stages-and-ball-states.js` (one-shot)
- 7 test files in `scripts/test-sprint24-*.js`

### MODIFIED
- `server/models/Company.js` — drop 3 stage enum values
- `server/models/Objective.js` — add `ball_state`, `consultant_notes`, `ball_state_history[]`
- `server/routes/companies.js` — extend `PUT /:id` middleware (dual-auth)
- `server/routes/consultant.js` — extend goals endpoints with `?include=tasks,moves`
- `server/routes/objectives.js` — wire ball-state triggers via `res.on('finish')`
- `server/routes/key-results.js` (or wherever KR progress writes) — sustained_eligible flag
- `server/routes/weekly-goals.js`, `server/routes/moves.js` — wire handed_off trigger
- `server/services/mailjetService.js` — add `sendProfilePrefilledEmail`
- `client/pages/my-clients.html`, `my-clients.css`, `scripts/my-clients.js` — tile cleanup
- `client/pages/client-workspace.html`, `scripts/client-workspace.js`, `client-workspace.css` — Objectives + Plan + Assessments tab implementations
- `client/pages/company-profile.html` — accept `?client=:id` query param + banner
- `client/pages/team-ssi-view.html` — accept `?client=:id` query param

### UNTOUCHED (S24 boundary)
- `client/pages/objectives.html` (owner-side; deferred to S25)
- `client/pages/planning-v2.html` (owner-side)
- `client/pages/dashboard-v2.html` (owner-side)
- `client/pages/assessment-hub.html` (owner-side; only the consultant tab in workspace differs)

---

## What Sprint 24 is NOT

- ❌ NOT touching the owner-side experience (except read-only protections like Risk R7)
- ❌ NOT shipping the Hybrid Behavior Classification epic (4 pts → S25)
- ❌ NOT shipping a Welcome email feature (S22 carry → defer)
- ❌ NOT shipping a Reaction badge feature (S22 carry → defer)
- ❌ NOT shipping cost tracking (S22 D-F-7 → defer)
- ❌ NOT migrating production data (clean launch post-May 15)
- ❌ NOT redesigning owner-side `objectives.html` (D-4 → **S25 Epic 25.3**)
- ❌ NOT cleaning up the legacy OKR cascade (CONSOLIDATION_PLAN Phase B → **S25 Epic 25.1**)
- ❌ NOT retiring legacy `Goal{WEEKLY}` collection (CONSOLIDATION_PLAN Phase C → **S25 Epic 25.2**)
- ❌ NOT populating owner-facing labels in `display-labels.js` (placeholder only → **S25 Epic 25.4**)
- ❌ NOT building a "Ball Board" kanban view (potential S26)
- ❌ NOT introducing a new audit log (Q2.A → backlog)

## Sprint 25 placeholder created

Post-S24 work re-planned 2026-05-06 into a 3-sprint sequence: Sprint 25 = "Plumbing" ([`SPRINT-25-Plumbing/`](../SPRINT-25-Plumbing/SPRINT25_MASTER_PLAN.md)), Sprint 26 = "First Objective Created" ([`SPRINT-26-First-Objective/`](../SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md)), Sprint 27 = "First Task Completed" ([`SPRINT-27-First-Task/`](../SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md)). Original "Cascade + Owner Objectives" theme was decomposed: cascade work moved to Sprint 25; owner-side polish moved to refinement track ([`REFINEMENT-BACKLOG/`](../REFINEMENT-BACKLOG/)). Four epics drafted at S24 close (now superseded but preserved in refinement backlog or moved to S25 epics):
- **25.1** Cascade Phase B (write-side cutover)
- **25.2** Cascade Phase C (legacy retirement, conditional)
- **25.3** Owner-side `objectives.html` redesign
- **25.4** Display-labels owner mapping completion

S25 scope firms up at S25 kickoff post-Beta. S24 ships consultant CRM cleanly without touching cascade structure or owner pages.

---

## Sign-off

**Ready to begin**: 2026-05-04
**First session recommendation**: `/coding` on Epic 24.7 (Bug Sweep — discovery first)

After sprint close: `/sprint-review` for retrospective, then `/deploy` for clean prod launch + Beta date re-baseline.
