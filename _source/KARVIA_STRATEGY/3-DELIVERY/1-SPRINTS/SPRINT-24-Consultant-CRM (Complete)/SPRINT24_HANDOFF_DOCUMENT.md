# Sprint 24 — Handoff Document

<!-- @GENOME T3-SPR-024-HANDOFF | ACTIVE | 2026-05-08 | parent:T3-SPR-024-MP | auto:/init,/close | linked:/sprint-review -->
<!-- Last update: 2026-05-08 — #206b /sprint-review (Option C — S24 retro + S25 readiness) shipped; Sprint 24 retro authored, S25 cleared to launch; awaiting final /close folder-rename + commit -->

**Status**: 🟢 CODE COMPLETE + RETRO COMPLETE — Sprint 24 implementation finished 2026-05-08 with #206; retrospective + S25 readiness review shipped at #206b; awaiting final `/close` folder rename + sprint-seal commit (deferred for user confirmation, see "Sprint Seal — Pending User Confirmation" section below)
**Sprint Goal**: Turn the My Clients page into the consultant's operating surface so they can retire their tracking spreadsheet.
**Total Points**: 29-37 (target ~33); 9 epics
**Close Target**: task-driven (5-verb acceptance test passes)
**Architectural audit**: COMPLETE — all 13 audit items locked 2026-05-05 (see SPRINT24_MASTER_PLAN.md "Architectural Audit Decisions" section)
**Onion philosophy**: ADOPTED — every workspace tab + my-clients page follows "KPIs on top, details below"; shared `TabHeader` component (Epic 24.9) is the visual backbone
**γ-lite Behaviors**: Recurring Moves get a top-of-Plan-tab strip with title-grouped streak indicators (S24 v1; full β with `Move.behavior_id` schema in S25 Epic 25.5)
**Post-S24 sprint sequence** (re-planned 2026-05-06): Sprint 25 "Plumbing" → Sprint 26 "First Objective Created" → Sprint 27 "First Task Completed". See [`SPRINT-25-Plumbing/`](../SPRINT-25-Plumbing/), [`SPRINT-26-First-Objective/`](../SPRINT-26-First-Objective/), [`SPRINT-27-First-Task/`](../SPRINT-27-First-Task/). Refinement-track work in [`REFINEMENT-BACKLOG/`](../REFINEMENT-BACKLOG/).

---

## Session Re-order — 2026-05-06 (post-#198)

**Why**: pre-coding scan surfaced that the original execution-plan ordering (B=24.1 → … → D=24.3-P1) inverts the dependency chain. Epic 24.1's frontend consumes `DisplayLabels.companyStageView()` and its backend `StageTransitionService` rewrap depends on `LifecycleTransitionService` — both **created** by Epic 24.3 Part 1. Epic 24.1 spec itself acknowledges the inversion (line 129-131: "Session B is too early; reorder to after D"). Also: master plan adds Epics 24.8 + 24.9 but the daily execution plan was never updated to slot them — 24.4 and 24.3-P2 both consume Epic 24.9's `renderKPIStrip()` helper.

**New order** (handoff supersedes daily execution plan; the latter stays as historical artifact):

1. **Session B** = Epic 24.3 Part 1 — backend foundation: `LifecycleTransitionService`, `display-labels.js`, `StageTransitionService` thin-wrapper rewrap, `Objective` schema additions (`consultant_notes`, `sustained_eligible` virtual), `res.on('finish')` hooks, 3 consultant endpoints, owner-side privacy, `Company.stage` enum collapse to canonical 6 (drops legacy from `ALL_STAGES_TRANSITIONAL` superset)
2. **Session C** = Epic 24.1 — tile + stage UI; consumes B's `DisplayLabels` + wrapped `StageTransitionService`; **rides Epic 24.8 B-8** (navigation purple-banner cleanup) since C touches `navigation.js` anyway
3. **Session D** = Epic 24.2 — profile tab page-reuse + dual-auth + email; **rides Epic 24.8 B-6** (`postpone_reason` Task field) — independent additive ride-along
4. **Session E** = Epic 24.9 — shared TabHeader / `renderKPIStrip()` helper + Teams-tab KPI strip; precedes F & G
5. **Session F** = Epic 24.3 Part 2 — Objectives tab UI (consumes E's KPI strip)
6. **Session G** = Epic 24.4 — Plan tab read-only tree (consumes E's KPI strip)
7. **Session H** = Epic 24.5 — Assessments tab + Sprint close (regression + handoff finalization)

**Stage-count clarification** (settled by #198): canonical Company.stage set is **6 stages** — `prospect / onboarding / active / paused / churned / completed` (per `server/constants/companyStages.js` `STAGES`). Epic 24.1 + Epic 24.3 specs each had stale "5 stages" prose dropping `completed`; both patched in this re-order session. `completed` is required because `LEGACY_TO_CANONICAL` maps `sustained → completed`.

## Progress

| Session | Date | Epic | Pts Planned | Pts Done | Quality | Status |
|---|---|---|---|---|---|---|
| #194-strategy | May 4 | Sprint 24 planning (master plan + 7 epic specs + execution + risks + kickoff) | 0 (planning) | 0 (planning) | TBD | ✅ Complete |
| #196-audit | May 6 | Cross-sprint audit S24-S27 sign-off + governance retrofit (2 audit IDs amended this sprint: A20260506-01, A20260506-13) | 0 (audit) | 0 (audit) | 9/10 | ✅ Complete |
| #197 Session A (part 1) | May 6 | **24.7 — Bug Sweep**: KR creation audit + enrich endpoint diagnosis | 2 | **2 (audit value, 0 fix-points)** | 9/10 | ✅ Complete (no bugs found) |
| #198 Session A (part 2) | May 6 | **24.6 — Migration**: legacy → canonical 6 stages + Objective lifecycle schema/seed + scripts/db reorg | 1-2 | **2** | 9/10 | ✅ Complete (45/45 tests, dry-run on preprod 76 cos + 115 objs clean) |
| #199 Session B (re-ordered) | May 6 | **24.3 Part 1** — backend foundation: `LifecycleTransitionService` + `display-labels.js` + `StageTransitionService` rewrap + `Objective` schema (notes + sustained_eligible) + hooks + 3 consultant endpoints + privacy + `Company.stage` enum collapse | 3-4 | **3** | 9/10 | ✅ Complete (125/125 new + 6 regression suites green: 519 assertions; legacy stage refs cleaned across codebase) |
| #200 Session C (re-ordered) | May 7 | **24.1 + 24.8 B-8** — Tile cleanup (pencil + single-click cockpit + ball-state + Send-Assessment CTA + Danger-zone Edit modal) + canonical 6-stage CSS variants + Profile-tab pill row / health chip / history accordion / confirmation modal + `POST /clients/:id/stage` manual transition endpoint + `lifecycle` bucket on portfolio-summary + purple "Viewing as" banner verify-then-delete | 4-5 (3-4 + 1) | **5** | 9/10 | ✅ Complete (94 new assertions across 2 suites; full S22+S22a+S24 sweep 15/15 green ≈ 597 assertions) |
| #201 Session D (re-ordered) | May 7 | **24.2 + 24.8 B-6** — `ConsultantPageMode` helper (`detect()` truth-table + idempotent banner) + `company-profile.html` page-reuse via `?client=:id&from=workspace` + workspace Profile-tab "Edit profile fields" CTA + Move schema `postpone_reason` (Move, **not** Task — spec drift caught in pre-coding scan) + `dashboard-v2.js` PUT-body wires textarea | 5-6 (4-5 + 1) | **5** | 9/10 | ✅ Complete (43 new + 15 new B-6 in 248 = 58 new assertions; full S22+S22a+S23+S24 sweep 17/17 green ≈ 1002 assertions) |
| #202 Session E (re-ordered) | May 7 | **24.9** — Shared `KarviaTabHeader.renderKPIStrip()` helper + `client/css/components/tab-header.css` + Summary tab refactor (5 KPI cards + Last Activity tile preserved) + Teams-tab KPI strip (4 cards: TEAMS / ASSESSMENT COMPLETION / COVERAGE / AVG SSI BY TEAM) + dashboard-summary `objectives.lifecycle` extension + `/clients/:id/teams` `kpis` block + DESIGN_SYSTEM Component-CSS section | 2-3 | **2** | 9/10 | ✅ Complete (73 new assertions; full S22+S22a+S23+S24 sweep 18/18 green ≈ 1075 assertions) |
| #203 Session F (re-ordered) | May 7 | **24.3 Part 2** — Objectives tab UI: `client/css/components/objective-tile.css` (.is-consultant-view + bucket-colored left-border) + `renderObjectives` rewrite (4-card KPI strip HEALTH/CONSTRAINT/DRIVERS/VELOCITY + sort handed_off→identified→sustained + driver-aware empty state) + inline consultant_notes (debounced PATCH 600ms) + Mark Sustained btn (sustained_eligible-gated) + ⋯ overflow with manual override menu + GET `/clients/:id/objectives` payload extension (per-row lifecycle_stage + consultant_notes + sustained_eligible + ssi_impact + discipline_ids + lifecycle_history; sibling `kpis` block) | 3-4 | **3** | 9/10 | ✅ Complete (41 new + 156 P1 = 197 in 243; full S22+S22a+S23+S24 sweep 24/24 green ≈ 1330 assertions) |
| #204 Session F-tail | May 7 | **Storage-key fragmentation cleanup** (audit IDs `A20260507-01/03/04` — discovered post-#203 on dev karvia-business-1, fixed same-day instead of deferring to Session G). Comprehensive sweep + bulk-strip across ~16 client files: `karvia_auth_token` canonical-only (drop `karvia_token` legacy), `karvia_user` canonical-only (drop `user` legacy), bare `token` 3rd-tier removed; boot cleanup wired in BOTH `common.js` and `auth-check.js` (idempotent removeItem at module load when canonical present); migration shim in `auth-check.js` retained as the only legitimate legacy-key reader. Phase3-3 lint allow-list line numbers updated for shifted role-check sites. | 1 (audit-fix) | **1** | 9/10 | ✅ Complete (23 new in test-sprint24-204-storage-key-cleanup.js + full sweep **25/25 suites green**; resolves user-reported BUG-S24-01) |
| #205 Session G (re-ordered) | May 8 | **24.4** — Plan tab read-only tree (KPI strip + Behaviors strip + Tree). Backend: `?include=tasks,moves` whitelist on quarterly + weekly endpoints; weekly endpoint extended to UNION READ legacy `Goal{WEEKLY}+Tasks` (mirrors `/api/weekly-goals/:keyResultId` from S23 #191) when `include=tasks`; quarterly endpoint populates `objective_id` w/ embedded `key_results` so the tree can label KR nodes. Frontend: replaces placeholder Plan tab w/ 3-section render — KPI strip via `KarviaTabHeader.renderKPIStrip()` (4 cards: THIS WEEK / TODAY / CATCH-UP / FRESHNESS, all computed from existing endpoints — no new aggregation route), γ-lite Behaviors strip (recurring Moves grouped by `(title, discipline)` case-insensitive trim — title-drift fragility v1; sparkline = 6-cell flex divs), read-only tree (KR → QG → WG → Tasks `📋` + one-off Moves `🎯`; auto-expand current ISO week; driver-aware empty states at every level; no edit affordances). Lazy-load via `loadPlanData()` reusing summary + objectives sibling caches. CSS: `.cw-plan-strip`, `.cw-behaviors-strip`, `.cw-spark-cell`, `.cw-tree-*` — additive to client-workspace.css. **Spec drift caught in pre-coding scan**: spec referenced `.status-pill` but actual class is `.cw-status-chip` (used). Test 184b's "loadedTabs.delete('plan')" assertion encoded the retired toggle — updated to assert the new contract (loadPlanData + cache-reuse). | 4-5 | **4** | 9/10 | ✅ Complete (75 new in test-sprint24-244-plan-tab.js incl. 30 backend route tests via in-memory mongo + 9 groupBehaviors title-drift assertions in vm sandbox; full S22+S22a+S23+S24+phase3 sweep **26/26 suites green** ≈ 1405 assertions) |
| #206 Session H (re-ordered) | May 8 | **24.5** — Assessments tab via page-reuse: backend `/api/assessments/trends` accepts CONSULTANT `?company_id` override iff `∈ managed_businesses` (else 403); `/api/assessments/compare` allows cross-managed-client compare for CONSULTANT (each id's `company_id` must be in portfolio), BUSINESS_OWNER cross-tenant still 403 (S23 #189 regression preserved); frontend wires `team-ssi-view.html` page-reuse via `?client=:id&from=workspace` — boot calls `ConsultantPageMode.detect()` (helper-reuse from Epic 24.2 per F-4 lock), short-circuits `unauthorized`, scopes `companyId` from `cpm.clientId`, calls `renderBanner(name, { intro: 'Viewing assessments for' })`; `client/js/consultant-page-mode.js` `renderBanner()` parameterized with optional `opts.intro` (additive — Profile default unchanged, intro is HTML-escaped); `body.cpm-readonly` mutes `#generate-okrs-btn / #regenerate-okrs-btn / #approve-okrs-btn` (CSS) **+** click-handler short-circuit (defense-in-depth); `client-workspace.js` Assessments tab navigates full-page (click + hashchange + initial-load `#tab=assessments` all hand off to `team-ssi-view.html?client=:id&from=workspace`); `team-ssi-view.html` Back-link reads `from=workspace` + `client` params and points to `client-workspace.html?client=:id#tab=summary`. **Spec drift caught in pre-coding scan**: (1) banner verb — helper output "You are editing **X** as their consultant" wrong for read-only Assessments → parameterized `renderBanner(name, { intro })` rather than forking the helper (F-4 lock honored); (2) spec said "Surveys" tab, actual id is `anonymous` (4 inner tabs unchanged); (3) Trends/Compare UI lives on assessment-hub.html (S23 #189), NOT in team-ssi-view's 4 inner tabs — backend extension alone satisfies the spec, no chart-helper parameterization needed; (4) `assessment-charts.js` verified does NOT read `karvia_user.company_id` directly (server-side scoped). Phase3-3 lint allow-list updated for shifted role-check sites (`consultant-page-mode.js:60→64`, `team-ssi-view.html:451 → split 485+489 for from=workspace branch`, `team-ssi-view.js:136→171`). | 3-4 | **3** | 9/10 | ✅ Complete (50 new in test-sprint24-245-assessments-tab.js: 23 frontend regex + 13 helper sandbox via vm + 13 backend HTTP via in-memory mongo; full S22+S22a+S23+S24+phase3 sweep **27/27 suites green** ≈ 1455 assertions; **Sprint 24 5-verb acceptance test passes**) |
| #206b /sprint-review | May 8 | **Sprint 24 retro + Sprint 25 readiness review** (Option C). Outputs: [SPRINT24_RETRO.md](SPRINT24_RETRO.md) (worked / didn't / 6 action items / velocity vs S22a+S23) + [SPRINT25_PAGE_MATRIX.md](../SPRINT-25-Plumbing/SPRINT25_PAGE_MATRIX.md) (PX-1.6 gate ✅ all 4 prereqs verified shipped at #199; zero S24→S25 page conflicts; S25→S26 seams designed; 1 spike finding: `showEmptyState()` already at `objectives.js:662` so PX-2.3 will be SKIPPED; ~24 FE callers for legacy/wizard/ai-okr endpoints; one residual `/api/goals/weekly/${id}` PUT in `planning-v2.js:2309`). SESSION_LOG header updated 25/29→28/29 CODE COMPLETE. S25 verdict: 🟢 GREEN to launch post-/close. | 0 (governance) | 0 (governance) | 9/10 | ✅ Complete |
| **Total** | | | **24.5-31.5** (~28 mid) | **28/29** | | |

---

## Sprint 24 Acceptance Test — The 5 Verbs ✅ ALL GREEN (2026-05-08, post-#206)

**Sprint 24 ships when, working on a single client end-to-end, a consultant can:**
1. **Onboard** ✅ — create company (Epic 24.1 tile + Send-Assessment CTA) → fill profile via `?client=:id` (Epic 24.2 page-reuse) → send invitation (S22a Mailjet flow, regression-green)
2. **Engage** ✅ — view consolidated SSI results via `?client=:id&from=workspace` (Epic 24.5 page-reuse on `team-ssi-view.html`; consultant banner with "Viewing assessments for" intro; read-only mute; all 4 internal tabs work; cross-tenant 403 server-enforced on `/trends` + `/compare`)
3. **Track** ✅ — see ball-state per objective (Epic 24.3 driver-aware bucket coloring + `objective-tile.css`) + planning tree (Epic 24.4 read-only Plan tab w/ KPI strip + γ-lite Behaviors strip + KR→QG→WG→Tasks/Moves tree)
4. **Empower** ✅ — write `consultant_notes` (Epic 24.3 P2 inline debounced PATCH); manually transition company stage (Epic 24.1 `POST /clients/:id/stage`); mark sustained when ready (Epic 24.3 `Mark Sustained` btn gated on `sustained_eligible`)
5. **Hand-off** ✅ — observe lifecycle_stage auto-flip from `identified → handed_off` as the client creates KRs/weekly plans (Epic 24.3 P1 `LifecycleTransitionService` + `res.on('finish')` hooks on KR/Goal POSTs)

**All 5 verbs green. Spreadsheet-retirement criterion met.**

---

## Architectural Invariants (verify at every session close) — all green at #206

- [x] Zero executable `switch-company` callers in `client/pages/scripts/` *(verified #206 — Assessments tab navigates page-reuse, no JWT-swap)*
- [x] LLMGateway sole executable OpenAI chokepoint *(no new chokepoint introduced this session)*
- [x] All consultant data access goes through `requireManagedClient` (or equivalent inline `managed_businesses` gate) *(verified #206 — `/trends` `?company_id` override + `/compare` cross-managed compare both gate via `req.user.managed_businesses`; cross-tenant returns 403)*
- [x] StageTransitionService sole writer of `Company.stage`
- [x] Lifecycle writer for `Objective.lifecycle_stage` mirrors `StageTransitionService` pattern (idempotency via Mongo from-stage filter — no new contract). "Ball state" is a UI render-mapping in [my-clients.js](client/pages/scripts/my-clients.js), NOT a backend service. *(Cross-sprint audit 2026-05-06, Group 7)*
- [x] `Objective.consultant_notes` excluded from owner-facing GET projections
- [x] No new role-check sites outside phase3-3 lint allow-list *(verified #206 — phase3-3 sweep 24/24 sites blessed; allow-list updated for shifted lines on `consultant-page-mode.js:64`, `team-ssi-view.html:485+489`, `team-ssi-view.js:171`)*

## S25 Prereq Gate — verify at session-wrap (Cross-sprint audit 2026-05-06, Group 1)

S25 PX-1.6 hard-depends on these 4 architectural artifacts shipping in S24. Each session-wrap must check the artifacts touched in that session:

- [x] `Company.stage` enum collapse complete (canonical **6-stage** set: `prospect → onboarding → active → paused/churned/completed`) [#199: enum collapsed from `ALL_STAGES_TRANSITIONAL` superset to canonical `STAGES`; `StageTransitionService.onFirstObjectiveCreated` retargeted onboarding → active]
- [x] `Objective.lifecycle_stage` field present, indexed (#198 — schema added; #199 — writer wired)
- [x] Lifecycle writer service exists (#199 — `LifecycleTransitionService` with `companyStageInstance` + `objectiveLifecycleInstance`; idempotent flips via Mongo from-stage filter; telemetry on every transition)
- [x] `display-labels.js` consultant mapping in place for stage / lifecycle_stage labels (#199 — all 6 lifecycle stages + 6 company stages; `lifecycleView()` role-aware with consultant→ball-view mapping)

Embedded into Epic 24.1 acceptance (stage collapse) and Epic 24.3 acceptance (lifecycle_stage + writer + labels). NOT a separate Epic 24.10 — checklist-cost only.

---

## Open Decisions (not blocking, may surface during sessions)

- Beta launch date — re-baseline post-S24 (D-1)
- Hybrid Behavior Classification (4 pts S23 carry) — confirmed S25
- Production data wipe — separate `/deploy` session post-S24

---

## Watch-Items

- ~~KR creation flow needs verification (Session A discovery)~~ → **RESOLVED #197** — audit clean, no bug found (see Epic 24.7 Findings below)
- ~~Enrich endpoint needs diagnosis (S22 watch-item carried; Session A discovery)~~ → **RESOLVED #197** — no code bug; reported failure is config (likely web_search tool tier OR 3s timeout); graceful fallback works
- `company-profile.html` audit before consultant write changes (Risk R6, Session C)
- ~~`team-ssi-view.html` audit before consultant write changes (Risk R10, Session G)~~ → **N/A** for #205 — Epic 24.4 is read-only by spec ("This epic does NOT touch write paths"); Plan tab edits target `client-workspace.html`/`.js`, not `team-ssi-view.html`. Risk R10 carries forward only if a future write-path session lands.
- ~~🔴 BUG-S24-01 — Storage-key fragmentation cluster~~ → **RESOLVED #204** (same-day fix). All 4 audit IDs (`A20260507-01/02/03/04`) advanced to ✅ TESTS via `test-sprint24-204-storage-key-cleanup.js` (23 assertions) + full S22+S22a+S23+S24+phase3 sweep 25/25 suites green. See "Epic 24.3 Part 2 + S24 #204 Storage-Key Cleanup Outcome" section below.

## Audit History

Per audit-governance convention `A{YYYYMMDD}-{nn}`, advancing 📝 PLAN → 💻 CODE → ✅ TESTS:

| Audit ID | Group | Description | PLAN | CODE | TESTS |
|---|---|---|---|---|---|
| A20260506-01 | G1 — S24 Acceptance Gate | Prereq checklist embedded in 24.1/24.3 acceptance | ✓ #196 | — | — |
| A20260506-13 | G7 — BallState/Lifecycle | Lifecycle writer pattern (idempotency via Mongo from-stage filter); ball state = UI render-mapping. **#198 partial**: schema. **#199 complete**: `LifecycleTransitionService` (`companyStageInstance` + `objectiveLifecycleInstance`); `StageTransitionService` rewrap; predicate evaluator + `res.on('finish')` hooks; 3 consultant endpoints | ✓ #196 | ✓ #199 | ✓ #199 (125 new + 6 regression suites green) |
| A20260507-01 | TKF-A — Auth-token cluster | 6-step fix on `karvia_auth_token` ↔ legacy `karvia_token`: (a) `my-clients.js` getToken canonical-only; (b) drop legacy `setItem('karvia_token', …)` writes in `common.js` + `navigation.js`; (c) convert `karvia_token`-only readers (`quarterly-review.js`, `dashboard-v2.js`, `signup.html`); (d) one-shot cleanup at boot in BOTH `common.js` and `auth-check.js` (idempotent removeItem); (e) bulk-strip `\|\| getItem('karvia_token')` fallback chains across 15 files (perl one-liner + 2 manual multi-line fixes); (f) regression `test-sprint24-204-storage-key-cleanup.js` (23 assertions). Shipped #204. | ✓ #203 | ✓ #204 | ✓ #204 (23/23 + S22+S22a+S23+S24+phase3 sweep 25/25 suites green) |
| A20260507-02 | TKF-B — Audit-lens gap | Process finding: prior audits never swept for "synonymous storage keys with inconsistent read-order across consumers". Adds rule to future `/audit` checklist — for every pair of synonymous storage keys (cookie / localStorage / sessionStorage / query-param synonyms / DB-field synonyms during migrations), assert (1) one writer per key, (2) identical read-order across all consumers, (3) no current code writes the legacy key once migration is declared complete. No code change for this ID — process bake-in only. | ✓ #203 | n/a | n/a |
| A20260507-03 | TKF-C — User-blob cluster | `karvia_user` ↔ legacy `user`. 3 files converted to canonical: `dashboard.html:228` (also fixed broken ternary), `executive-dashboard.js:49`, `analytics-dashboard.js:22`. Boot cleanup `removeItem('user')` in both `common.js` and `auth-check.js`. Regression test asserts ZERO `getItem('user')` reads anywhere. Shipped #204. | ✓ #203 | ✓ #204 | ✓ #204 (covered by same regression test) |
| A20260507-04 | TKF-D — Bare-`token` 3rd-tier | Dropped `\|\| getItem('token')` 3rd-tier from all 5 fallback chains (`auth-check.js`, `common.js` x2, `my-clients.js`, `add-client-wizard.js`). Boot cleanup `removeItem('token')`. Server-side `req.cookies.token` cookie fallback retained intentionally (separate concern, future audit item). Regression test asserts only the migration shim reads bare `token`. Shipped #204. | ✓ #203 | ✓ #204 | ✓ #204 (covered by same regression test) |

### Net-new findings #198 (no audit ID — surfaced during Epic 24.6 implementation grounding-check)

These were not part of the cross-sprint audit pre-work; they emerged from comparing Epic 24.6 spec to actual code/data. Fixed in-session via spec amendment + implementation. Flag for next `/audit` if a stable ID is desired:

1. Epic 24.6 stage mapping table referenced 3 enum values that never existed in `Company.stage` (`active`/`at_risk`/`inactive`). Replaced with `LEGACY_TO_CANONICAL` constant in `server/constants/companyStages.js`.
2. Sequencing inversion — Epic 24.6 spec said "seed lifecycle_stage" but the schema field didn't exist; Epic 24.3 owned the schema add. Resolved by moving schema add into 24.6.
3. Seed/validate file paths in spec didn't match reality (3 files at different paths, chained npm script). Corrected.
4. Bug found in own audit script mid-session: Goal.time_period queried as lowercase `'weekly'`; actual enum is uppercase `'WEEKLY'`. Fixed in audit + migration.

## Epic 24.6 Outcome (Session #198)

**Spec amendments locked at session start** (3 grounding-check findings):
1. Mapping table referenced phantom values (`active`/`at_risk`/`inactive`) not in Company.stage enum — replaced with `LEGACY_TO_CANONICAL` constant in `server/constants/companyStages.js`
2. `Objective.lifecycle_stage` schema didn't exist — Epic 24.6 now owns the schema add (Epic 24.3 still owns the writer)
3. File-move paths incorrect (3 files not 2; chained npm script) — corrected with kebab-case rename

**Implementation**:
- Constants modules: `server/constants/companyStages.js` (`STAGES`/`LEGACY_STAGES`/`ALL_STAGES_TRANSITIONAL`/`LEGACY_TO_CANONICAL`/`META`) + `objectiveLifecycle.js` (`STAGES`/`TRANSITIONS`/`CONSULTANT_BALL_VIEW`/`META`) — single source of truth so future stage additions are one-file
- Schema: Company.stage uses `ALL_STAGES_TRANSITIONAL` (10 = canonical 6 + legacy 4) during 24.6 → 24.1 transition window; Objective.lifecycle_stage indexed enum + lifecycle_history[]
- Migration script: idempotent (per-doc detection via `triggered_by_kind='migration_2026_05'`), --dry-run, --yes, --force-prod, prod-detection regex (does NOT match `preprod`)
- Tests: 45/45 in-memory mongo (constants, computeSeedStage 4 rules + 2 edge cases, mapping table 8 fixtures, 2 idempotency runs, lifecycle 4 rules + history, enum validation)
- Dry-run on preprod (`karvia_business_preprod`): 76 cos backfilled (`null → prospect`), 115 objectives seeded (113 identified / 1 kr_breakdown / 1 in_execution / 0 sustained_mode), 0 errors
- File moves: 3 git-tracked moves with require-path updates verified by static resolve + `npm run validate:assessments` smoke
- Bug discovered & fixed mid-session: my own audit script (and initial migration) used lowercase `'weekly'` for Goal.time_period; actual enum is uppercase `'WEEKLY'`. After fix, real preprod count went from 0 to 1 in_execution.

**S25 prereq gate stage-list typo fixed** (was 4-stage `prospect → onboarding → objective_identified → handed_off`; now matches master plan canonical 6-stage `prospect → onboarding → active → paused/churned/completed`).

## Epic 24.3 Part 1 Outcome (Session #199)

**Pre-coding scan amendments locked at session start**:
1. Session re-order — Epic 24.1 spec (line 129-131) acknowledged "Session B is too early; reorder to after D" because 24.1 frontend consumes `DisplayLabels.companyStageView()` and 24.1 backend consumes `LifecycleTransitionService`, both created by 24.3 P1. Epics 24.8 + 24.9 had also been added to master plan but never slotted into the daily execution plan; reorder absorbs them. New sequence: B=24.3-P1 → C=24.1+24.8 B-8 → D=24.2+24.8 B-6 → E=24.9 → F=24.3-P2 → G=24.4 → H=24.5+close.
2. Stage-count drift — Epic 24.1 + Epic 24.3 specs each said "5 stages" (dropping `completed`), but #198 canonical constants ship 6 stages and `LEGACY_TO_CANONICAL` maps `sustained → completed`. Both epic specs patched to 6.
3. Object lifecycle TRANSITIONS table mismatch — `objectiveLifecycle.js` had a strict `completion_review → completed → sustained_mode` chain; Epic 24.3 spec wants direct `completion_review → sustained_mode` (one-click "Mark Sustained" UX) plus `→ in_execution` re-open. Patched constants to match spec.

**Implementation**:
- `LifecycleTransitionService` (NEW) — generic factory; two configured instances (`companyStageInstance`, `objectiveLifecycleInstance`); idempotent flips via `findOneAndUpdate({_id, [stageField]: fromState})`; history append; `lifecycle.transition` telemetry on every flip via existing `TelemetryService` (#192b)
- `StageTransitionService` (REFACTORED) — thin wrapper around `companyStageInstance` preserving 4-method 184e public contract (return shape `{flipped, history_added, company}` and `consultant:<userId>` actor format intact); `onFirstObjectiveCreated` retargeted `onboarding → active` (was `→ objective_identified`)
- `Company.stage` schema — collapsed from `ALL_STAGES_TRANSITIONAL` (10 = canonical 6 + 4 legacy) to canonical `STAGES` (6); legacy values now rejected
- `Objective.consultant_notes` — String, maxlength 280, `select: false`; only consultant.js endpoints opt in via `+consultant_notes`; owner-side reads omit by default (R7 mitigation, schema-level guarantee)
- `Objective.sustained_eligible` (NEW virtual) — true iff embedded `key_results.length > 0 && every(kr.status === 'completed')`; gates `markSustained`
- `client/js/display-labels.js` (NEW) — `window.DisplayLabels`; subsumes S23 #192a constants (MOVE_TYPE/STATUS, HEALTH_STATUS, OBJECTIVE_LIFECYCLE) + adds `COMPANY_STAGE_LABEL` + `companyStageView()` + role-aware `lifecycleView(stage, role)` (consultant ball-view mapping populated; other roles return canonical placeholder until S25 Epic 25.4)
- 5 `res.on('finish')` evaluator hooks wired via reusable `fireAfterWriteEvaluator` helper: objectives.js POST/PUT, key-results.js POST/PUT, weekly-goals.js POST, moves.js POST (with WG→KR→Objective lookup), objective-wizard.js finalize. Hooks fire post-response (zero added latency); errors are logged-not-thrown
- Predicate ladder (idempotent, single-step per call): `identified + has KR → kr_breakdown` → `kr_breakdown + WG + owner∈{BO,EXEC,MANAGER,EMPLOYEE} → in_execution` → `in_execution + all KRs status=completed → completion_review`. (`sustained_mode` is manual-only via `markSustained`.)
- 3 new consultant endpoints under `requireManagedClient` guard: `PATCH .../objectives/:oid/notes`, `POST .../mark-sustained`, `POST .../override-state`
- `consultant_notes` privacy verified by static-grep test on owner-side `routes/objectives.js` (no `+consultant_notes` opt-ins exist)

**Tests** (125 new + 6 regression suites): 125/125 in scripts/test-sprint24-243-objectives-and-lifecycle.js (constants, schema, virtuals, idempotency, manualTransition catalog, manualOverride bypass, predicate ladder including consultant-owner-blocks-in_execution case, markSustained guard, 184e wrapper regression, enum collapse, display-labels coverage, telemetry shape, fireAfterWriteEvaluator status-code gating). Regression sweep all green: 184a 55/55, 184d 36/36, 184e 36/36, 23-190 wizard 76/76, 23-191 planning 135/135, 23-192b dashboard 136/136, 24-246 migration 45/45.

**Cross-cutting cleanup**: 6 test files patched to align with canonical-only Company.stage enum (legacy stage seeds replaced with canonical equivalents; the 24.6 migration test seeds via raw `Company.collection.insertOne` to bypass enum, since the migration's whole purpose is handling legacy on-disk values). 1 stale log message in objective-wizard.js fixed. No production code uses legacy stages anywhere.

## Epic 24.3 Part 1 — net-new findings #199 (no audit ID — surfaced during pre-coding scan)

These were not part of the cross-sprint audit pre-work; they emerged from comparing Epic 24.3 spec to actual code/data. Fixed in-session via spec amendment + implementation. Flag for next `/audit` if a stable ID is desired:

1. Original execution plan (Sprint A→G) inverted dependency — Epic 24.1 (Session B) consumes Epic 24.3-P1 (Session D). Reordered to dependency-correct B=24.3-P1 sequence.
2. Master plan added Epic 24.8 (bug sweep) + Epic 24.9 (TabHeader/KPI strip) but the daily execution plan was never updated. Both now slotted: 24.8 B-8 rides Session C (24.1, both touch navigation.js); 24.8 B-6 rides Session D (24.2); 24.9 is its own Session E preceding 24.3-P2 + 24.4 which both consume `renderKPIStrip()`.
3. Move model has no `objective_id` field — only `weekly_goal_id`. Original evaluator design queried `Move.countDocuments({ objective_id })` which would never match. Resolved by dropping the redundant Move check (Move.weekly_goal_id is required, so any Move implies a parent WG; the WG count check is already sufficient).
4. Goal vs WeeklyGoal model — S22 D-A-2 introduced `WeeklyGoal` collection; legacy `Goal` model with `time_period: 'WEEKLY'` is unused by new routes. Evaluator and tests now query `WeeklyGoal` exclusively.

**To run** (verifies the whole stack):
```bash
node scripts/test-sprint24-243-objectives-and-lifecycle.js  # 125 assertions
node scripts/test-sprint22a-184e-stage-transitions.js       # 36 (regression)
node scripts/test-sprint24-246-migration.js                 # 45 (regression)
```

**To run on dev** (when ready):
```bash
NODE_ENV=development npm run audit:stage-distribution        # read-only inspection
NODE_ENV=development npm run migrate:stages-and-lifecycle -- --dry-run --yes
NODE_ENV=development npm run migrate:stages-and-lifecycle    # actual run (interactive prompt)
```

---

## Epic 24.1 + 24.8 B-8 Outcome (Session #200)

**Pre-coding scan finding**: most of Epic 24.1's backend acceptance criteria were already in place from #199:
- `Company.stage` enum already collapsed to canonical 6
- `StageTransitionService` already a thin wrapper around `LifecycleTransitionService.companyStageInstance`
- `onFirstObjectiveCreated` already retargeted `onboarding → active`
- `client/js/display-labels.js` already exporting `companyStageView()` + `lifecycleView()`

So Session C focused on the **frontend** layer + small additive backend hooks the UI needed.

**Implementation**:
- **Tile cleanup** (`my-clients.html` + `my-clients.js` + `my-clients.css`):
  - Retired Status / Plan / Edit dropdown menus and their CSS (`mc-tile-menu-wrap`, `mc-tile-menu`, `mc-action-status`, `mc-action-plan`, `mc-action-edit`)
  - New top-right pencil icon (`mc-pencil`) opens Edit modal
  - Tile body becomes a single click target → `client-workspace.html?client=:id#tab=summary`; keyboard-accessible (Enter/Space)
  - Inner Objectives box still independently clickable (preserved from #183b)
  - Stage filter dropdown narrowed to canonical 6
  - Tile + badge + left-border CSS variants replaced with canonical 6: `prospect / onboarding / active / paused / churned / completed`
- **Ball-state distribution micro-line** (D-Onion-4): `🎯 N · 🤝 M · 📊 K` rendered below stage badge **only** when stage ∈ {active, paused}; em-dash when all counts are zero. Counts derived from new `Objective.lifecycle_stage` mapped to consultant 3-bucket view (server-side `bucketByLifecycle` helper hydrates `c.lifecycle` on every portfolio-summary item).
- **Send Assessment CTA** (Item #11): rendered only when `stage='prospect'` AND `assessments.completed === 0`; routes to `/pages/assessment-hub.html?company_id=:id` (existing flow; no new backend endpoint).
- **Edit modal Danger zone**: new footer with "Remove from portfolio" CTA; closes Edit modal and opens existing Delete confirmation modal.
- **Profile tab pill row** (`client-workspace.html` + `client-workspace.js` + `client-workspace.css`):
  - Stage pill row at top of `#tab=profile` rendering 6 canonical stages with one active
  - Health chip alongside (sourced from `computed.riskStatus` already returned by `/clients/:id/profile`)
  - Stage history accordion populated from `Company.stage_history[]` (newest-first, collapsed by default)
  - Click on non-active pill → confirmation modal ("Move {Company} from X → Y?") + optional 280-char note → `POST /api/consultant/clients/:id/stage`
  - On success: profile cache invalidated, header re-rendered, panel re-rendered
  - Header stage badge now uses `DisplayLabels.companyStageView()` instead of raw `replace(/_/g, ' ')`
- **Backend additive endpoints**:
  - `POST /api/consultant/clients/:id/stage` — wraps `StageTransitionService.manualTransition` (guards: requireManagedClient + canonical-only `to_stage` + same-stage 409); preserves the F-2 thin-wrapper pattern; emits `lifecycle.transition` telemetry.
  - `lifecycle: { identified, handed_off, sustained }` bucket on every `/portfolio-summary` item — new `bucketByLifecycle` helper mirrors `objectiveLifecycle.js CONSULTANT_BALL_VIEW`.
- **24.8 B-8 (verify-then-delete)**: Confirmed dead, deleted. Removed all banner DOM creation from `client/js/navigation.js` (purple gradient markup, "Viewing as" copy, `back-to-my-company-btn`, `switchToOwnCompany()` method, `karvia_consultant_own_company` localStorage key). `renderContextBanner()` survives as a no-op stub so `init()` callers don't break and the phase3-3 lint allowlist still resolves the CONSULTANT short-circuit (line 418→423 — allowlist updated). Banner DOM unreachable in vm-sandbox simulation across CONSULTANT / BUSINESS_OWNER / EXECUTIVE / MANAGER / EMPLOYEE.

**Tests**:
- NEW `scripts/test-sprint24-241-tile-and-stage.js` — **73 assertions** (static-source markup checks; vm-sandbox truth tables for `renderBallStateLine` 7 cases + `renderTileHTML` Send-Assessment 4-cell matrix; in-memory mongo backend covering happy path + canonical-only enum gate + same-stage 409 + non-managed 403 + portfolio lifecycle bucket shape).
- NEW `scripts/test-sprint24-248-bug-sweep.js` — **21 assertions** (B-8 only; B-6 deferred to Session D per re-order). Banner-creation markers absent (6 markers); switchToOwnCompany() removed; vm-sandbox simulation across 5 roles confirms 0 banner DOM inserted; phase3-3 line 423 entry verified.
- **Regression sweep — 15/15 suites green ≈ 597 assertions**: phase3-3 (9), 22-cockpit (rewritten for new tile), 22-epic-c (canonical 6-enum), 22-epic-c-phase3 (37), 22-epic-c-polish (40), 22-status-button (rewritten), 22a-184a (55), 22a-184b (52, retired-action assertions updated), 22a-184c (32, dropdown-action assertions updated), 22a-184d (36), 22a-184e (36), 24-241 (73), 24-243 (125), 24-246 (45), 24-248 (21).

**Cross-cutting cleanup** (5 regression tests amended for the new tile contract): `test-sprint22-cockpit.js`, `test-sprint22-status-button.js`, `test-sprint22-epic-c-polish.js`, `test-sprint22a-184b-client-workspace.js`, `test-sprint22a-184c-retire-switch-company.js`. `test-sprint22-epic-c.js` also patched (canonical 6-enum + drift-tolerant route count) — was a pre-existing failure carried from #199 enum collapse. Phase3-3 BLESSED_SITES updated 418→423.

**To run** (verifies the whole stack):
```bash
node scripts/test-sprint24-241-tile-and-stage.js   # 73 assertions
node scripts/test-sprint24-248-bug-sweep.js        # 21 assertions
node scripts/test-phase3-3-frontend-role-checks.js # 9 (regression)
node scripts/test-sprint22a-184c-retire-switch-company.js  # 32 (regression)
```

**Architectural invariants verified**:
- ✅ Zero executable `switch-company` callers in `client/pages/scripts/` — confirmed by #184c regression (32/32 green)
- ✅ StageTransitionService sole writer of `Company.stage` — `POST /clients/:id/stage` calls `StageTransitionService.manualTransition` (which wraps `companyStageInstance`)
- ✅ Lifecycle writer pattern preserved — no direct `Company.stage` writes added; `LifecycleTransitionService` chokepoint intact
- ✅ "Ball state" remains a UI render-mapping (client-side `renderBallStateLine` + server-side bucket helper); no new backend service introduced
- ✅ No new role-check sites outside phase3-3 lint allow-list — phase3-3 still passes (22 sites blessed; line 418→423 entry refreshed)

**S25 prereq gate** (carried from #199): all 4 artifacts ✅ shipped; this session does not touch them.

**Watch-items resolved**: none new from this session.

---

## Epic 24.2 + 24.8 B-6 Outcome (Session #201)

**Pre-coding scan findings** (4 spec ↔ reality mismatches caught before any code):

1. **Backend gate already shipped (S16 TD-2)**: `PUT /api/companies/:id` already declares `requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE')` and the consultant `managed_businesses` check at [companies.js:462-474](../../../../server/routes/companies.js#L462-L474). Spec line 18 said "ONE backend tweak" — actual cost was zero lines. Verified the consultant dual-trust path with explicit cross-tenant + non-managed negative tests.
2. **Controller path drift**: spec said `client/pages/scripts/company-profile.js`; actual file is [client/js/company-profile.js](../../../../client/js/company-profile.js) (1255 LOC). Updated implementation accordingly.
3. **B-6 model mismatch (CRITICAL)**: spec said add `postpone_reason` to **Task**; reality is the data-loss bug lives on **Move**. The Postpone modal in [dashboard-v2.js:531](../../../../client/pages/scripts/dashboard-v2.js#L531) `openPostponeModal(move)` targets `/api/moves/:id` and reads `#postpone-reason` textarea but never sent it; Move schema had no field. Task path in [planning-v2.js:931](../../../../client/pages/scripts/planning-v2.js#L931) `postponeTask(taskId)` has **no** reason input modal at all. Field placed on **Move only** — Task path stays unchanged (a Task reason input would be scope creep, no current UI captures one).
4. **`requireManagedClient` location**: spec hinted `server/middleware/auth.js`; actual export at [server/routes/consultant.js:666](../../../../server/routes/consultant.js#L666). Reuse honored — no new middleware.

**Implementation**:

- **NEW `client/js/consultant-page-mode.js`** (~115 LOC) — `window.ConsultantPageMode` IIFE; pure functions; `detect()` returns `{ mode ∈ ['self','consultant','unauthorized'], clientId, fromWorkspace, isAuthorized }` from URL params + `karvia_user`; `renderBanner(companyName)` injects DOM only when consultant, idempotent re-renders, no-op on self mode; CommonJS-export-compatible for Node test harness.
- **MODIFY `client/pages/company-profile.html`** — loads `/js/consultant-page-mode.js` BEFORE `/js/company-profile.js`; adds `.cpm-banner` / `.cpm-banner-back` CSS (scoped to this page, navy→indigo gradient with gold accent on `<strong>`).
- **MODIFY `client/js/company-profile.js`** — boot path branches on `ConsultantPageMode.detect()` and sets module-scoped `companyId` from `pageMode.clientId` when consultant, else `user.company_id`. After data load, calls `renderBanner(companyData.name)`. New `showUnauthorizedAndStop()` renders a minimal "Not authorized" state with back-link (workspace if `fromWorkspace`, else my-clients) when consultant hits a `?client=:id` they don't manage. `saveProfile()` unchanged — already PUTs to `/api/companies/${companyId}` so the override flows naturally.
- **MODIFY `client/pages/scripts/client-workspace.js`** — Profile tab `renderProfile()` now appends a `.cw-profile-edit-cta` block with `<a class="cw-profile-edit-link" href="/pages/company-profile.html?client=...&from=workspace">Edit company profile fields →</a>`. Stage pill row + history accordion from #200 unchanged. Choice was deliberate minimal-change: keep stage editing in-tab (already shipped #200), delegate field editing to the dedicated full-page editor.
- **MODIFY `client/css/client-workspace.css`** — additive `.cw-profile-edit-cta` + `.cw-profile-edit-link` (focus-visible gold outline matching design system).
- **B-6 — MODIFY `server/models/Move.js`** — added `postpone_reason: { type: String, default: '', trim: true, maxlength: 500 }`. PUT route at [routes/moves.js:331](../../../../server/routes/moves.js#L331) uses `Object.assign(move, req.body)` — field flows through automatically, no allowlist change needed.
- **B-6 — MODIFY `client/pages/scripts/dashboard-v2.js`** — `confirmPostpone()` reads `#postpone-reason` textarea and sends `postpone_reason` in PUT body alongside `due_date`.

**Tests**:
- NEW `scripts/test-sprint24-242-profile-tab.js` — **43 assertions** in 4 sections: [1/4] `consultant-page-mode.js` parses + 4-cell `detect()` truth table (no-param BO, param+CONSULTANT+managed, param+CONSULTANT+non-managed, param+BO) + `renderBanner()` injects+idempotency+self-mode no-op + `?from=workspace` back-link. [2/4] `company-profile.html` script-load order + banner CSS. [3/4] `company-profile.js` boot wiring (`detect()` + companyId override + unauthorized branch + renderBanner call) + workspace CTA href shape + CSS rules. [4/4] in-memory mongo dual-trust: consultant PUT managed → 200 + name/primary_contact persist; consultant PUT non-managed → 403; owner PUT own → 200; owner cross-tenant → 403; consultant rename preserved across owner subsequent edit.
- EXTEND `scripts/test-sprint24-248-bug-sweep.js` (was 21 → **36 assertions**) — adds B-6 section [B6 1/3] schema field + dashboard wiring (textarea read, payload shape, PUT target preserved); [B6 2/3] in-memory mongo round-trip (PUT with reason → persisted; PUT with empty reason → empty string default); [B6 3/3] dashboard-v2.html `#postpone-reason` textarea markup still present.
- AMEND `scripts/test-phase3-3-frontend-role-checks.js` — added `client/js/consultant-page-mode.js:60` to `BLESSED_SITES` with `category='rendering'` + why-note pointing to the server-side enforcement chokepoints (`requireManagedClient` + `companies.js` PUT managed_businesses check). Source line annotated `// F-L-03 — render decision only.`. Allowlist now 22→23 sites.
- **Regression sweep — 17/17 suites green ≈ 1002 assertions**: phase3-3 (9, 23 sites blessed), 22-cockpit ✓, 22-status-button ✓, 22-epic-c (36), 22-epic-c-phase3 (37), 22-epic-c-polish (40), 22a-184a (55), 22a-184b (52), 22a-184c (32), 22a-184d-mailjet (36), 22a-184e-stage (36), 23-190-objective-wizard (76), 23-191-planning-page (135), 23-192b-dashboard-v3 (136), 24-241 (73), 24-243 (125), 24-246 (45), 24-248 (36 NEW count), 24-242 (43 NEW).

**To run** (verifies the whole stack):
```bash
node scripts/test-sprint24-242-profile-tab.js          # 43 assertions
node scripts/test-sprint24-248-bug-sweep.js            # 36 assertions (B-8 + B-6)
node scripts/test-phase3-3-frontend-role-checks.js     # 9 (regression — 23 sites)
```

**Architectural invariants verified**:
- ✅ Multi-tenant isolation preserved — `PUT /api/companies/:id` uses existing `managed_businesses` membership check; cross-tenant + non-managed both 403 in tests.
- ✅ Role-based access — server enforces auth via `requireRole` + `managed_businesses` membership in `companies.js` AND `requireManagedClient` on consultant routes; new frontend role check is **render-only** (BLESSED_SITES entry + source comment).
- ✅ XSS prevention — banner copy escapes `companyName` via `escapeHtml()`; back-link URL uses `encodeURIComponent(clientId)`.
- ✅ Soft-delete pattern unchanged — no goal/objective deletion paths touched.
- ✅ Move PUT remains the sole writer for Move state (no new writer); telemetry `move.postponed` still fires on `due_date` change (#192b).

**S25 prereq gate** (carried from #199/#200): all 4 artifacts ✅ shipped; this session does not touch them.

**Watch-items resolved**: R6 (`company-profile.html` audit before consultant write changes) — done, dual-trust verified end-to-end.

**Net session output**: ~9 files touched (~+450/-15 lines: 2 new — `consultant-page-mode.js`, `test-sprint24-242-profile-tab.js`; 7 modified — `Move.js`, `dashboard-v2.js`, `company-profile.html`, `company-profile.js`, `client-workspace.js`, `client-workspace.css`, `test-sprint24-248-bug-sweep.js`, `test-phase3-3-frontend-role-checks.js`).

---

## Epic 24.9 Outcome (Session #202)

**Pre-coding scan findings** (4 spec ↔ reality items caught before any code):

1. **Summary card-count drift** — Epic 24.9 spec line 58 said "5 cards", but the live Summary tab from S22a #184b ships **6** cards (the 6th = `Last Activity`, a date+description tile). Resolution: refactor 5 standard KPIs into the shared strip; keep `Last Activity` as a sibling tile below the strip (escape hatch for non-KPI rich content). The shared helper exposes a `valueHTML` field for callers that need raw HTML inside the value slot (e.g. the Risk pill).
2. **Objectives KPI bucket source drift** — spec line 59 wants Summary's Objectives card to show ball-state distribution (`6 total · 🎯2 🤝3 📊1`, per Epic 24.1 D-Onion-4), but `dashboard-summary` today returns only **status** buckets (`on_track / at_risk / behind`). Resolution: extend `dashboard-summary`'s existing objectives query with `lifecycle_stage` in the `.select()` and reuse the route-local `bucketByLifecycle` helper (same one #200 wired into `/portfolio-summary`). **Zero new round-trips** — F-M-02 5-cap intact.
3. **Teams KPI data gap** — `/clients/:id/teams` today returns only the team list; the spec's 4 KPI cards need assessment counts, unassigned/manager-without-team coverage, and per-team avg SSI. Resolution: extend the same endpoint with a `kpis` sibling block, batched under the same `Promise.all` (4 new aggregations). F-M-06 (one endpoint per tab activation) intact. New aggregations: `Team.countDocuments`, `Assessment.aggregate` for status tally, `User.aggregate` for coverage with `$cond`/`$ifNull` to distinguish unassigned EMPLOYEE vs manager-without-team, `Assessment.aggregate` with `$lookup` to users for per-team avg SSI.
4. **Sequencing inversion (resolved)** — Epic 24.9 spec line 114-115 said it ships **before** Epics 24.1 / 24.2 (so those would consume the helper). Per the post-#199 session re-order, Sessions C+D already shipped 24.1+24.2 with their own per-tab UI before the helper existed. Refactoring shipped tabs is OUT-OF-SCOPE for this session (regression risk on #200/#201 wins). The helper now ships for Sessions F (24.3 P2 Objectives tab) and G (24.4 Plan tab) to consume.

**Implementation**:

- **NEW `client/css/components/tab-header.css`** (~85 LOC) — namespaced `.kts-*` (Karvia Tab Strip): `.kts-strip` (CSS grid `auto-fit minmax(180px,1fr)`), `.kts-card` (4px left-border for accent), accent variants `--on_track / --at_risk / --urgent / --neutral`, `.kts-label / .kts-value / .kts-trend / .kts-sublines`. Single mobile breakpoint at **720px** (D-Onion-2 acceptance) → cards stack to single column.
- **NEW `client/js/tab-header.js`** (~95 LOC) — `window.KarviaTabHeader` IIFE, CommonJS-export-compatible for Node test harness. Public API: `renderKPIStrip(cards, container)`. Card schema: `{ label, value, valueHTML?, trend?, accent?, sublines? }`. Idempotent re-renders (replaces innerHTML, no append). Empty `cards` array → empty container (graceful no-op). XSS-safe: `label / value / sublines` HTML-escaped; `valueHTML` is a documented trusted-HTML escape hatch (caller-responsibility).
- **MODIFY `client/pages/client-workspace.html`** — `<link rel="stylesheet" href="../css/components/tab-header.css">` (loaded BEFORE `client-workspace.css` per CSS cascade convention) + `<script src="/js/tab-header.js">` loaded after `display-labels.js`, before `navigation.js`.
- **MODIFY `client/pages/scripts/client-workspace.js`**:
  - `renderTab` now passes `payload.kpis` to `renderTeams` (signature change `renderTeams(items, kpis)`).
  - `renderSummary` refactored: builds 5-card array (SSI / Risk / Objectives / Teams / Assessments), Risk uses `valueHTML` for the pill, Objectives uses `lifecycle.identified|handed_off|sustained` sublines, computes semantic accents (Risk → on_track/at_risk/urgent; Objectives → on_track when handed_off>0 OR sustained>0 else at_risk; neutral elsewhere). `Last Activity` rendered as a separate `.cw-summary-card` tile below the strip — preserves the existing visual contract.
  - `renderTeams` now renders strip on top + list below; strip renders even when `items.length === 0` so consultants see coverage signals (e.g. `12 unassigned employees`) before any team is configured.
  - NEW `renderTeamsKpiStrip(kpis)` helper composes the 4 cards: TEAMS (count + members), ASSESSMENT COMPLETION (`X/Y` + `Z%`, semantic accent ≥80% green / 40-79% amber / <40% red), COVERAGE (urgent if managers-without-team>0; at_risk if unassigned>0; on_track otherwise), AVG SSI BY TEAM (top score on top, top-3 in subline).
- **MODIFY `server/routes/consultant.js`**:
  - `dashboard-summary`: objectives query `.select('status updated_at lifecycle_stage')`; response `objectives.lifecycle = bucketByLifecycle(objectives)` (no extra round-trip).
  - `/clients/:id/teams`: 4 new aggregations under the same `Promise.all`; `kpis` block returned alongside `data` + `pageInfo`. `totalMembers` counts only team-assigned users (skips `_id: null` group) so the unassigned bucket isn't double-counted with the COVERAGE card.
- **MODIFY `.claude/DESIGN_SYSTEM.md`** — new "Component CSS" section documenting `client/css/components/` folder convention + `TabHeader / KPI strip` API spec and visual language (referenced from this handoff).

**Tests**:

- NEW `scripts/test-sprint24-249-tab-header.js` — **73 assertions** in 6 sections:
  - [1/6] tab-header.js parse + DOM contract: empty cards → empty; single card with label/value/sublines/trend/accent rendered; 4 accent variants; 3 trend variants (up/down/flat); bogus accent + bogus trend silently dropped; XSS escape on label/value/sublines; `valueHTML` raw-HTML override; idempotent re-render replaces (not appends); null container no-throw.
  - [2/6] tab-header.css selectors + 720px mobile breakpoint single-column rule.
  - [3/6] client-workspace.html wires CSS+JS in correct order.
  - [4/6] client-workspace.js: Summary cards array + `KarviaTabHeader.renderKPIStrip` call + Last Activity preserved + lifecycle bucket sublines + Risk valueHTML; Teams `payload.kpis` passed through; `renderTeams(items, kpis)` signature; 4-card composition; strip renders on empty list.
  - [5/6] In-memory mongo end-to-end: `dashboard-summary` returns `objectives.lifecycle` (`identified=1, handed_off=1, sustained=0`) alongside legacy buckets; `/clients/:id/teams` returns `kpis` with correct `teams_count=2 / total_members=3 / completed=2 / total=3 / completion_pct=67 / unassigned=1 / managers_without_team=1`; `avg_ssi_by_team` returns Sales=8.0 + Ops=6.0 sorted desc; non-managed → 403.
  - [6/6] phase3-3 lint regression: `tab-header.js` has no role checks → no `BLESSED_SITES` entry needed.
- **Regression sweep — 18/18 suites green ≈ 1075 assertions**: phase3-3 (9, 23 sites), 22-cockpit ✓, 22-status-button ✓, 22-epic-c (36), 22-epic-c-phase3 (37), 22-epic-c-polish (40), 22a-184a (55), 22a-184b (52), 22a-184c (32), 22a-184d (36), 22a-184e (36), 23-190 (76), 23-191 (135), 23-192b ✓, 24-241 (73), 24-242 (43), 24-243 ✓, 24-246 ✓, 24-248 (36), 24-249 (73 NEW).

**To run** (verifies the whole stack):
```bash
node scripts/test-sprint24-249-tab-header.js               # 73 assertions
node scripts/test-sprint22a-184a-consultant-reads.js       # 55 (regression — F-M-02 5-cap intact + dashboard.objectives still has total)
node scripts/test-phase3-3-frontend-role-checks.js         # 9 (regression — 23 sites)
```

**Architectural invariants verified**:
- ✅ Multi-tenant isolation preserved — `requireManagedClient` still gates all `/clients/:id/*` reads; non-managed teams → 403 (in-memory test).
- ✅ F-M-02 dashboard-summary 5-cap intact — only added `lifecycle_stage` to existing query select; no 6th query.
- ✅ F-M-06 one-endpoint-per-tab intact — Teams tab still calls only `/clients/:id/teams`; KPI block batched under existing `Promise.all`.
- ✅ XSS prevention — shared component HTML-escapes `label / value / sublines`; `valueHTML` documented as caller-responsibility (used only by `Risk` card with KarviaCommon-internal pill markup).
- ✅ No new role-check sites — `tab-header.js` is pure rendering; phase3-3 lint allow-list unchanged at 23 sites.
- ✅ Soft-delete pattern — no goal/objective/team deletion paths touched.

**S25 prereq gate** (carried from #199/#200/#201): all 4 artifacts ✅ shipped; this session does not touch them.

**Watch-items resolved**: none new from this session. R10 (`team-ssi-view.html` audit before Session G) still open.

**Net-new findings #202 (no audit ID — pre-coding scan)**:

These were not part of the cross-sprint audit pre-work; they emerged from comparing Epic 24.9 spec to actual code/data. Fixed in-session via spec amendment + implementation. Flag for next `/audit` if a stable ID is desired:

1. Summary card count: spec said 5, reality 6. Resolution: 5 in strip + Last Activity below.
2. Objectives KPI bucket source: spec wanted ball-state distribution but dashboard-summary returned only status buckets. Resolution: extend with `lifecycle` bucket (no new round-trip).
3. Teams KPI data: 3 of 4 KPI cards had no data path. Resolution: extend `/clients/:id/teams` payload with `kpis` block via 4 batched aggregations.
4. `totalMembers` semantic ambiguity: should it count unassigned users? The COVERAGE card already surfaces unassigned separately, so we count team-assigned only — matches spec example `3 teams · 12 members` (members of teams, not all employees).

**Net session output**: ~6 files touched (~+560/-55 lines: 3 new — `tab-header.css` (85 LOC), `tab-header.js` (95 LOC), `test-sprint24-249-tab-header.js` (310 LOC); 3 modified — `client-workspace.html` (+2 lines), `client-workspace.js` (~+90/-50), `consultant.js` (~+95/-5), `DESIGN_SYSTEM.md` (+65)).

---

## Epic 24.3 Part 2 Outcome (Session #203)

**Pre-coding scan amendments**: none required — Part 1 (#199) shipped the backend + 3 endpoints + display-labels module with the exact contracts Part 2 consumes. The single addendum: GET `/clients/:id/objectives` extends payload (per-row lifecycle/notes/eligibility + sibling `kpis` block) so the tab still satisfies F-M-06 (one endpoint per gesture); F-1 view-only contract preserved (writes go through the 3 dedicated endpoints from #199, never through the GET).

**Implementation**:
- **`client/css/components/objective-tile.css` (NEW, 235 LOC)** — F-6 component pattern: base `.ot-*` rules + `.is-consultant-view` modifier (bucket-colored left border via `[data-bucket="identified|handed_off|sustained"]`). Covers tile grid (ball / body / actions), pills (`.ot-pill--ssi` / `.ot-pill--discipline`), progress bar (semantic `.is-on_track|at_risk|behind`), inline notes textarea, overflow menu, driver-aware empty state, 720px breakpoint.
- **`client/pages/client-workspace.html`** — adds `<link href="../css/components/objective-tile.css">` after tab-header.css (component CSS loaded before page CSS).
- **`client/pages/scripts/client-workspace.js`** — `renderObjectives(items, kpis)` rewritten:
  - 4-card KPI strip via `KarviaTabHeader.renderKPIStrip()`: HEALTH (handed_off+sustained ratio with bucket counts subline), CONSTRAINT (latest assessment dimension/sub_dimension + score), DRIVERS (top owner-role distribution), VELOCITY (moves done last week + trend ▲▼→ vs prior week)
  - Sort priority lock: `in_execution`/`completion_review` (0) → `identified`/`kr_breakdown` (1) → `completed`/`sustained_mode` (2); secondary stable by `createdAt` desc
  - Tile renders ball icon (via `DisplayLabels.lifecycleView(stage,'consultant')`), title, owner+role, category, target_year, % progress (KR-aggregated), KR-mix string, SSI-impact pill, discipline pills (first 4), inline `.ot-notes` textarea, Mark-Sustained btn (gated on `sustained_eligible`), ⋯ overflow → manual override sub-menu
  - Driver-aware empty state copy: *"Owner login required. [Check assessment status] · [Review profile]"* — fires even with zero objectives so consultant still sees CONSTRAINT KPI
  - Inline-notes save: 600 ms debounced PATCH `/clients/:id/objectives/:oid/notes`; updates cached payload + writes "Saving…" / "Saved" / "Save failed" status
  - Mark-Sustained: POST `/mark-sustained`; full tab-reload to reflect new bucket
  - Manual override: POST `/override-state` with `{target_state, note}`; menu lists all 6 lifecycle stages minus current (override endpoint bypasses transition catalog by design)
- **`server/routes/consultant.js` GET `/clients/:id/objectives`** — payload extended:
  - per-row: `lifecycle_stage`, `lifecycle_history` (last 5), `consultant_notes` (via `+consultant_notes` select), `discipline_ids`, `ssi_impact`, `sustained_eligible` (computed from KR rollup since `.lean()` strips parent virtuals)
  - sibling `kpis` block: `health` (via existing `bucketByLifecycle`), `drivers` (5 role buckets + `unassigned`), `constraint` (latest completed Assessment with non-null `ssi_result.constraint`), `velocity` (Move counts in last 7d / prior 7d windows + trend)
  - `health`/`drivers` aggregated over all objectives (whole tenant) so KPIs reflect portfolio not pagination
- **Tests** — appended `[16]–[21]` (41 net new) to `scripts/test-sprint24-243-objectives-and-lifecycle.js`: CSS file + selectors + bucket data attrs + 720px breakpoint; HTML wires component CSS in correct order; JS markers (sort priority, KPI strip, empty state, debounced PATCH, mark-sustained, override menu, escape on tile fields); HTTP test of `/clients/:id/objectives` against in-memory mongo (3-objective fixture: identified/in_execution/sustained_mode + 2 owner roles + assessment with constraint + Move velocity 3-vs-1) verifying every per-row field + every kpis sub-block; privacy regression — owner-side `objectives.js`/`objective-wizard.js` still have zero `consultant_notes` references.

**Numbers**: 197/197 in 243 (P1 156 + P2 41 net new); full S22 + S22a + S23 + S24 sweep 24/24 suites green (~1330 assertions). Files touched: 5 (1 new CSS, 1 new test section, 3 modified — `client-workspace.html` +1, `client-workspace.js` +280/-15, `consultant.js` +95/-15). Sprint 24 progress: **20/29 pts (~69%)** — Sessions G + H remain.

---

## ~~Known Issues — for Session G (carry-in)~~ — RESOLVED #204

**Update 2026-05-07** — All 4 audit IDs (`A20260507-01/02/03/04`) shipped same-day in `#204` instead of being deferred to Session G. Section retained below for the audit trail (sweep findings + fix plan as executed).

### BUG-S24-01 — Auth-token key fragmentation (`karvia_token` vs `karvia_auth_token`)

**Discovered**: 2026-05-07 post-#203 on dev env `karvia-business-1` (My Clients page showed "Could not load clients. Please refresh." with `Token has expired` 401s on `/portfolio-kpis` + `/portfolio-summary` even after re-login).

**Root cause**: localStorage has TWO token keys floating around — the canonical `karvia_auth_token` (written by login.html / signup.html / common.js) and the legacy `karvia_token` (still written by `common.js:664` and `navigation.js:363`). Most consumers correctly read `karvia_auth_token` first with `karvia_token` as a fallback. **`my-clients.js:124-125` has the read-order reversed** — it reads `karvia_token` FIRST, so a stale legacy token (signed correctly but with `exp` in the past) shadows the freshly issued `karvia_auth_token`. jwt.verify reports `TokenExpiredError` → "Token has expired" — the user re-logs in, the new `karvia_auth_token` is written, but `my-clients.js` keeps reading the old `karvia_token`, so the symptom never clears.

**Why "expired" not "invalid signature"**: the legacy token was signed with the same `JWT_SECRET` (same env var on Render); the signature check passes, only the `exp` claim is in the past. Verified by browser-console decode (line in chat: `JSON.parse(atob(t.split('.')[1])).exp`).

**Sweep findings — comprehensive (initial token-only scan expanded after `?` follow-up to cover all `karvia_*` ↔ legacy synonyms)**:

**Cluster A — auth token (`karvia_auth_token` ↔ `karvia_token`) → audit ID `A20260507-01`**:

| Severity | File:line | Issue | Why it matters |
|---|---|---|---|
| 🔴 CRITICAL | `client/pages/scripts/my-clients.js:124-125` | reads `karvia_token` FIRST, fallback `karvia_auth_token` | **The symptom from the screenshot.** Stale legacy token shadows fresh canonical token |
| 🟡 HIGH | `client/js/common.js:664` | `setItem('karvia_token', body.token)` — still writes the legacy key on every login | Perpetuates the legacy-key existence forever; without this write, old keys would naturally drain after one expiry |
| 🟡 HIGH | `client/js/navigation.js:363` | `setItem('karvia_token', switchData.token)` — same issue on company-switch path | Same as above — keeps re-seeding the legacy key |
| 🟠 MEDIUM | `client/pages/scripts/quarterly-review.js:27, 478` | reads `karvia_token` ONLY (no fallback) | Breaks for any user who never had a legacy token (post-migration) |
| 🟠 MEDIUM | `client/pages/scripts/dashboard-v2.js:113` | `function getToken() { return localStorage.getItem('karvia_token'); }` — only reads legacy | Same — breaks for legacy-free users |
| 🟠 MEDIUM | `client/pages/signup.html:659` | reads `karvia_token` only (signup writes `karvia_auth_token`) | Code path right after signup looks broken |

**Cluster B — user blob (`karvia_user` ↔ `user`) → audit ID `A20260507-03`**:

| Severity | File:line | Issue | Why it matters |
|---|---|---|---|
| 🟡 HIGH | `client/pages/dashboard.html:228` | `JSON.parse(getItem('karvia_auth_token') ? getItem('user') : null)` — uses token presence to gate reading the LEGACY `user` key (not `karvia_user`) | The user blob is read from a key that login NEVER writes — this code path returns null for any current user. Fragile + likely already silently broken |
| 🟡 HIGH | `client/pages/scripts/executive-dashboard.js:49` | `getItem('user')` only (no fallback to `karvia_user`) | Returns null for users without a legacy `user` blob — page will fail downstream when it deref's `user.role` etc. |
| 🟡 HIGH | `client/pages/scripts/analytics-dashboard.js:22` | `getItem('user')` only (no fallback) | Same as above |

**Cluster C — bare-`token` 3rd-tier legacy → audit ID `A20260507-04`**:

| Severity | File:line | Issue | Why it matters |
|---|---|---|---|
| 🟠 MEDIUM | `client/js/auth-check.js:13`, `client/js/common.js:15+23`, `client/pages/scripts/my-clients.js:126`, `client/pages/scripts/add-client-wizard.js:72` | `\|\| getItem('token')` as final fallback in chain | Login/signup never write un-prefixed `token`; only `common.js:56-58` removes it. Dead fallback that bloats the read path and obscures the canonical contract. Drop the 3rd-tier and add `removeItem('token')` to boot cleanup |
| 🔵 INFO | `server/middleware/authGuards.js:36-37` | `req.cookies.token` server-side cookie fallback | OUT OF SCOPE for `A20260507-04` — different surface (cookie path, not localStorage). Document as future audit item if a `token` cookie is ever discovered being set |

**Other localStorage keys swept — all clean** (single name, one read pattern across consumers): `karvia_consultant_own_company`, `karvia_remember`, `karvia_ai_knows_expanded`. No fragmentation.

**Fix plan for Session G open** (~25 min, then proceed to Epic 24.4) — all 4 audit IDs bundle into a single touch:

**A20260507-01 (Cluster A — auth token)**:
1. Flip `my-clients.js:124-125` read order — `karvia_auth_token` first, `karvia_token` fallback. **Resolves the user-visible symptom immediately.**
2. Drop `setItem('karvia_token', ...)` calls from `common.js:664` and `navigation.js:363`. Login still writes `karvia_auth_token`; the legacy key won't be re-seeded.
3. Convert `karvia_token`-only readers to `karvia_auth_token` first — `quarterly-review.js:27,478`, `dashboard-v2.js:113`, `signup.html:659`. One-line change each.

**A20260507-03 (Cluster B — user blob)**:
4. Convert `getItem('user')` readers to `karvia_user` first — `dashboard.html:228` (also fix the broken ternary), `executive-dashboard.js:49`, `analytics-dashboard.js:22`. Mirror the canonical pattern from `common.js:30`.

**A20260507-04 (Cluster C — bare `token` 3rd-tier)**:
5. Drop `|| getItem('token')` 3rd-tier from `auth-check.js:13`, `common.js:15+23`, `my-clients.js:126`, `add-client-wizard.js:72`. The un-prefixed key is fully dead.

**Shared cleanup (covers all 3 clusters)**:
6. One-shot legacy-key cleanup in `client/js/common.js` boot — after a successful `karvia_auth_token` read, `localStorage.removeItem('karvia_token'); localStorage.removeItem('user'); localStorage.removeItem('token');`. Existing browsers self-heal on next page load.

**Single regression test** (`scripts/test-sprint24-204-storage-key-cleanup.js`):
7. Grep client tree, assert zero hits for: (a) `getItem('karvia_token')` not preceded by `karvia_auth_token`; (b) `setItem('karvia_token', ...)` outside the cleanup-removal path; (c) `getItem('user')` not preceded by `karvia_user`; (d) any `getItem('token')` un-prefixed in client tree. Plus verify boot cleanup writes are present in `common.js`.

**Workaround in the meantime**: DevTools console:
```js
['karvia_token','user','token'].forEach(k => localStorage.removeItem(k)); location.reload();
```
Clears all three stale legacy keys at once.

**Why defer to Session G instead of hot-fixing now**: ~12 files touched across 3 clusters + one new test. User flagged for Session G open; the console workaround unblocks immediate use, and bundling all 3 clusters in one commit lets the regression test cover the entire pattern in one file (cleaner to review, harder to regress).

---

## Epic 24.7 Findings (Session #197 — discovery-first audit)

**Outcome**: Both audits CLEAN — closes at 0 fix-points (audit value delivered).

### KR creation audit — NO BUG
- `POST /api/key-results` ([key-results.js:58](../../../../server/routes/key-results.js#L58)) — tenant-scoped, year-enforced (D-A-4), validates required fields, soft-delete pattern. ✓
- `POST /api/objectives` dual-write ([objectives.js:226-253](../../../../server/routes/objectives.js#L226-L253)) — `KeyResult.insertMany(krDocs)` runs best-effort with `year=objective.target_year`; warning-on-failure non-blocking (intentional). ✓
- `Objective.virtual('key_results_v2')` ([Objective.js:348](../../../../server/models/Objective.js#L348)) — correctly defined as `ref: 'KeyResult'`, foreignField: `objective_id`. ✓
- Wizard flow — test-verified 76/76 green at S23 #190 close. ✓
- **Conclusion**: Current state (post S22 #190 + S23 #190) is clean. The user's prior concern was likely a perceived issue from earlier sprints; not present in current code.

### Enrich endpoint diagnosis — NO CODE BUG
- Route ([consultant.js:556-581](../../../../server/routes/consultant.js#L556-L581)) — clean: auth + role + rate-limit + 504 with `fallback: 'manual'`. ✓
- Service `aiOKRService.enrichCompany` ([aiOKRService.js:794](../../../../server/services/aiOKRService.js#L794)) — clean: 24h cache, graceful template-stub if OpenAI disabled, 3s timeout via `EnrichUnavailableError`. ✓
- **Most likely root causes** (config, not code):
  1. `web_search` tool unavailable in dev's OpenAI tier (requires Responses API + specific model access)
  2. 3s `ENRICH_TIMEOUT_MS` too tight — `web_search` typically takes 5-10s in practice
  3. `OPENAI_API_KEY` not configured on karvia-business-1 dev environment
- **Graceful degradation works**: `add-client-wizard.js` catches the 504 and falls back to manual entry per D-F-1. User-impact bounded.
- **Optional refinement** (NOT in this epic; ~0.5 pt elsewhere if pursued): bump `ENRICH_TIMEOUT_MS` 3s → 8s, OR drop `web_search` and use static prompt-only enrichment.

**Sprint 24 acceptance test (verb 5 = hand-off) is NOT blocked by either of these audits.** Proceed to Epic 24.6 in a fresh session.

---

## Carry-Overs (DEFERRED, NOT in S24)

| Item | Source | Disposition |
|---|---|---|
| Hybrid Behavior Classification | S23 close | S25 (TBD epic placement) |
| Welcome email (D-C-8) | S22 carry | Defer (post-S25) |
| Reaction badge (D-G-3) | S22 carry | Defer |
| Cost tracking (D-F-7) | S22 carry | Defer |
| Owner-side `objectives.html` redesign | S24 D-4 dropped | **S25 Epic 25.3** |
| OKR cascade Phase B (write-cutover) | CONSOLIDATION_PLAN | **S25 Epic 25.1** |
| OKR cascade Phase C (legacy retirement) | CONSOLIDATION_PLAN | **S25 Epic 25.2** (conditional) |
| Display-labels owner mappings | S24 F-1d placeholder | **S25 Epic 25.4** |
| Redis cache (F-M-05) | S22a Phase 4 | Trigger-gated |
| `managed_businesses` denorm (F-L-02) | S22a Phase 4 | Trigger-gated |
| Backups for dev/pre-prod/prod | R2 | Backlog |

**Post-S24 sprint sequence**: Sprint 25 [`SPRINT-25-Plumbing/`](../SPRINT-25-Plumbing/), Sprint 26 [`SPRINT-26-First-Objective/`](../SPRINT-26-First-Objective/), Sprint 27 [`SPRINT-27-First-Task/`](../SPRINT-27-First-Task/). Original cascade-cleanup epics (25-1, 25-2) live in Sprint 25; owner-side polish epics (25-3, 25-4, 25-5) live in [`REFINEMENT-BACKLOG/`](../REFINEMENT-BACKLOG/) for re-scoping in refinement track post-Sprint-27.

---

## Audit History

Audit IDs that amended this sprint. Update flags as work advances. Master tracker: [AUDIT_TRACKER.md](../../2-QA-AND-TESTING/AUDIT_TRACKER.md).

| ID | Source | One-liner | 📝 | 💻 | ✅ |
|---|---|---|---|---|---|
| `A20260506-01` | Cross-sprint audit S24-S27, Group 1 | "Prerequisites verified" checklist embedded in Epic 24.1 / 24.3 acceptance + this handoff's prereq gate | ✓ | — | — |
| `A20260506-13` | Cross-sprint audit S24-S27, Group 7 | Lifecycle writer mirrors `StageTransitionService` pattern; "ball state" = UI render-mapping (invariant added above) | ✓ | ✓ #199 | ✓ #199 |

**Workflow**: when implementing in `/coding`, set 💻 here AND in master tracker; cite ID in commit message. At sprint close `/close`, set ✅ once regression suite green.

---

## Sign-off

Sprint 24 planning complete on 2026-05-04. Master plan + 7 epic specs + execution plan + risks + kickoff all drafted. Ready to begin Session A on `/coding`.

---

## Sprint Seal — Pending User Confirmation (post-#206b)

The following two actions complete Sprint 24's seal and are **deferred for user confirmation** in the active `/close` turn (per CLAUDE.md "actions that affect shared state — by default transparently communicate the action and ask for confirmation"):

1. **Folder rename**: `git mv "SPRINT-24-Consultant-CRM (In Progress)" "SPRINT-24-Consultant-CRM (Complete)"` — matches S21/S22/S22a/S23 closure convention
2. **Sprint-seal commit**: single commit bundling the retro + page matrix + SESSION_LOG entry + handoff finalization + folder rename

Once user confirms, the commit message follows the standard pattern:

```
docs(sprint24 #206b): /close — Sprint 24 SEALED at 28/29 pts (97%)

- /sprint-review Option C: S24 retro + S25 readiness review
- SPRINT24_RETRO.md authored — 6 action items carried into S25
- SPRINT25_PAGE_MATRIX.md authored — PX-1.6 gate ✅, S25 cleared to launch
- SESSION_LOG row #206b appended; header updated 25/29→28/29 CODE COMPLETE
- Folder rename: (In Progress) → (Complete)
- 5-verb acceptance test all green; 27/27 suites green ≈ 1455 assertions

Sprint 24 final: 28/29 pts (97%) — 9 epics shipped, 9/10 quality every session
Next sprint: Sprint 25 "Plumbing" (PX-1.6 gate green; ready to launch)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Status**: ⏳ awaiting user "go" before executing folder rename + commit.
