# Sprint 23 — Handoff Document

<!-- @GENOME T3-SPR-023-HANDOFF | ACTIVE | 2026-04-30 | parent:T3-SPR-023-MP | auto:/init,/close | linked:/sprint-review -->

**Status**: 🔒 **CLOSED** 2026-05-04 at **33/33 pts (100%)**
**Sprint Goal**: Complete the four feature epics carried from Sprint 22 (D, E, H, G) to clear the path to Beta launch. ✅
**Total Points**: 33 net new (38 incl. carried-spec migration)
**Target Close**: 2026-05-05 — **closed 1 day early**
**Beta Launch Target**: ⚠️ original 2026-04-10 has slipped — needs re-baseline in Sprint 24 kickoff

---

## Progress

| Session | Date | Epic | Pts Planned | Pts Done | Quality | Status |
|---|---|---|---|---|---|---|
| #188 | Apr 30 | D Phase 1 (sub-dimensions) | 5 | 5 | 10/10 | ✅ Complete |
| #189 | Apr 30 | D Phase 2 (Hub tabs + APIs) | 3 | 3 | 10/10 | ✅ Complete |
| #190 | Apr 30 | E Objective Wizard | 10 | 10 | 10/10 | ✅ Complete |
| #191 | Apr 30 | H Planning page + Phase A consolidation | 5 | 5 | 10/10 | ✅ Complete |
| #191b–h | May 01 | H Defect cluster (7 commits — simplification, ISO-year fix, extend wiring, perf 30s→3s, etc.) | 0 | 0 | 10/10 | ✅ Complete |
| #192-prep | May 01–02 | G Refined scoping doc — Q1–Q10 + Q3b walkthrough; 16/16 §14 items closed | 0 | 0 | 10/10 | ✅ Complete |
| #192a | May 02 | G Phase A — Navy theme + Tasks→Moves rename + display label constants | 3 | 3 | 10/10 | ✅ Complete |
| #192b | May 04 | G Phase B — Dashboard V3 + MoveDashboardService seams + MoveClassifierService + TelemetryService + LLM prompt extension + planning bulk-insert Moves + dashboard-summary aggregator + V3 HTML/JS + 720px responsive | 7 | 7 | 10/10 | ✅ Complete |
| BUG-01 | May 04 | Chores list scoped to today + overdue (single-fn `filterChoresForToday` seam in MoveDashboardService) | 0 | 0 | 10/10 | ✅ Complete |
| BUG-02 | May 04 | Dashboard endpoint paths fixed (`/api/users` → `/api/companies/:id/users`, `/api/companies/me` → `/api/companies/:id`) — eliminated 404/403 console noise + restored Reassign dropdown | 0 | 0 | 10/10 | ✅ Complete |
| #193 | May 04 | Sprint 23 close — full regression sweep (16 suites, 803 assertions all green) + handoff/log updates + folder rename | 0 | 0 | 10/10 | ✅ Complete |
| **Total** | | | **33** | **33/33 (100%)** | | |

### Session #193 — Sprint 23 Close (2026-05-04)

- **Pre-close work this session**: #192b Dashboard V3 (7 pts) + BUG-S23-192b-01 chores scope + BUG-S23-192b-02 endpoint paths.
- **Final regression sweep**: 16 suites, 803 assertions, ALL GREEN.
  - S22a: 184a (55) / 184b (58) / 184c (30) / 184d (36) / 184e (36) — 215 total.
  - Phase: 2.1 (18) / 2.3 (13) / 2.4 (20) / 3.1 (47) / 3.3 (9) — 107 total.
  - S23: 188 (39) / 189 (45) / 190 (76) / 191 (135) / 192a (50) / 192b (136) — 481 total.
- **§10a invariants verified**: zero executable `switch-company` callers in `client/pages/scripts/`; LLMGateway sole OpenAI chokepoint (executable, comments excluded); StageTransitionService hooks present in objectives.js / assessments.js / invitations.js / objective-wizard.js; Move enum unchanged; Task model untouched.
- **Sprint outcome**: 33/33 pts (100%) shipped. Epic D + E + H + G all delivered. Beta-launch path cleared on the dashboard surface; Hybrid Behavior Classification (Q1–Q7 decisions locked) deferred to Sprint 24 by user direction.
- **Open follow-ups carried to Sprint 24**:
  - **EPIC**: Hybrid Behavior Classification (~4 pts) — `Task.is_behavior` + `Task.behavior_confirmed_by`, planning-page 4-state toggle (chore / AI-suggested / user-confirmed / unclassified), `PATCH /api/tasks/:id/classification` with Move lifecycle (create-on / soft-delete-off), classifier P1 precedence.
  - **DECISION REQUIRED**: re-baseline Beta launch date — original Apr 10 has slipped 24 days.

### Session #192b — Epic G Phase B (2026-05-04)

- **Backend (read-only, additive)**:
  - NEW [server/services/MoveDashboardService.js](../../../../server/services/MoveDashboardService.js) — single-fn seams per §10a: `bucketizeMove` (Q4), `deriveMoveFoundations` (Q1b.2.i first-in-array), `deriveObjectiveLifecycle` (Q3b 6 stages), `deriveRelevantKR` (Q5.x.A soft-fail), `deriveObjectiveSummary` (Q5.2.ii short_label fallback), `computeMomentum`, `computeKRLift`, `resolveFoundationLabel`, `listFoundations`, plus `filterChoresForToday` added by BUG-01.
  - NEW [server/services/MoveClassifierService.js](../../../../server/services/MoveClassifierService.js) — single export `classifyTaskFromAIResponse(taskResponse)` returning `(Move POJO | null)` per Q6. Q4 hides AI-vs-user provenance from current UI (decision deferred to S24 hybrid epic).
  - NEW [server/services/TelemetryService.js](../../../../server/services/TelemetryService.js) — Q9.B log-sink `emit(event, payload)` writing `[telemetry]` prefix via `logger.info`. Phase 1 swaps the sink to HTTP webhook in one function. Never throws (best-effort).
  - NEW route `GET /api/moves/dashboard-summary` in [server/routes/moves.js](../../../../server/routes/moves.js) — single-RT aggregator. Route handler ASSEMBLES the join (Move → parent goal → Objective → KR via populate or embedded-KR lookup) and DELEGATES every twist to MoveDashboardService. Tenant-scoped. Soft-fails orphan Moves with `Unassigned KR` placeholder.
  - `PUT /api/moves/:id` extended to emit `move.completed` / `move.postponed` / `move.reassigned` per state-changing diff (no false emits on no-ops). Single envelope shape v1.
  - [server/routes/planning.js](../../../../server/routes/planning.js) `/generate-weekly-plan` + `/extend` — LLM prompt extended with `move_type / frequency / discipline / is_chore` per-Task fields; classifier piggybacks; non-null classifications bulk-insert Moves alongside Tasks atomically (extends #191g `Promise.all` pattern).
  - [server/models/Objective.js](../../../../server/models/Objective.js) — added optional `short_label: String` field (Q5.2.ii §10a-permitted exception, default `''`, no forced migration).
- **Frontend (V3 single-fetch render)**:
  - [client/pages/dashboard-v2.html](../../../../client/pages/dashboard-v2.html) — replaced two old `<section>` blocks (Tasks 3-col + Weekly Goals 3-col) with V3 layout: KPI strip (`X moves · Y% this week · ▲`), group switch (`All / Objective / Behavior` per Q1), catch-up tiles (`pushed / forgotten / this week` per Q3), causal-chain cards (left=Building / right=Moving per Q5), chores list (§6.5), empty states (§6.6 data-driven CTA routing). Single `@media (max-width: 720px)` block (Q8.A). Nav block + script tags + modals preserved verbatim.
  - [client/pages/scripts/dashboard-v2.js](../../../../client/pages/scripts/dashboard-v2.js) — full V3 rewrite. Single fetch to `/api/moves/dashboard-summary`. Per-section renderers (`renderKPI` / `renderCatchUpTiles` / `renderMovesGroups` / `renderEmptyState` / `renderChores` / `renderCausalChainCard`). Q10.B universal action set with Complete↔Re-open toggle. Display label constants (`MOVE_TYPE_LABEL` / `MOVE_STATUS_LABEL` / `HEALTH_STATUS_LABEL` / `OBJECTIVE_LIFECYCLE_LABEL`) — single-seam swap point for Q3 voice (deferred per Q3.B).
- **Test**: [scripts/test-sprint23-192b-dashboard-v3.js](../../../../scripts/test-sprint23-192b-dashboard-v3.js) — **136/136 green**. Pure-fn (40) + classifier (13) + telemetry (3) + frontend wiring (28) + §10a invariants (15) + live aggregator (20) + telemetry emission (6) + cross-tenant guard + orphan soft-fail.
- **Commits**: `2530cf2` (#192b), `290be2d` (BUG-01), this session (BUG-02 + close).
- **Sprint 23 Progress**: 33/33 (100%) — sprint closes here.

### Session #188 — Epic D Phase 1 (2026-04-30)

- **Schema**: `Assessment.ssi_result.sub_dimensions` (12 named fields, 0-100) + `Assessment.ssi_result.constraint` (`{dimension, sub_dimension, score}`) added.
- **Projection**: `UnifiedSSIScoringService.projectSubDimensions(blocks)` and `identifyConstraint(subs)` exported. Sub-dimensions = block × 10; null block → null sub. Constraint = lowest non-null sub-dimension across all 12 (ties: first encountered wins, deterministic).
- **Wiring**: `calculateSSI` now appends `sub_dimensions` + `constraint` to its return; `version` bumped 2.0 → 2.1. Every new assessment via `/submit` automatically persists the new fields (no backfill).
- **API**: `/api/assessments/:id/detailed-results` now returns `scores.sub_dimensions` and `scores.constraint`.
- **Test**: `scripts/test-sprint23-188-sub-dimensions.js` — **39/39 green**.
- **S22a regression**: 184a (55) + 184e (36) + phase2-1 (18) + phase3-1 (47) + phase3-3 (9) all still green. Stage hook `onFirstAssessmentCompleted` still wired in `/submit`.
- **Architecture preserved**: 4-layer Lego floor untouched (no role-check sites added; no JWT swap; no new OpenAI imports).

### Session #191b — Epic H Planning Simplification (2026-05-01)

- **Why**: User feedback — the Epic H planning page (#191) shipped two competing generation surfaces (top-right modal CTA + inline "Next 4 / 8 / Full Quarter" AI-Presets panel) plus a 12-13-week empty scaffold that masked the empty state. Net effect: clicking *Generate Weekly Goals* appeared to do nothing because the scaffold already showed those weeks as empty placeholders.
- **Three-state model** (replaces the scaffold + presets approach):
  - **State A** (`weeklyGoals.length === 0`) — empty CTA card in `weeks-stack` ("No weekly plan yet…"). Top-right button label = **Generate Weekly Goals**. No month groups, no scaffold.
  - **State B** (`weeklyGoals.length > 0`) — month groups built from REAL weeks only via new `buildRealWeeksFromGoals(goals)` helper. Top-right button label flips to **Extend Plan** and pre-fills the modal's `start_date` with the Monday after the latest existing week.
  - **State C** (generating) — existing modal-driven `/api/planning/generate-weekly-plan` flow unchanged.
- **Frontend HTML** ([client/pages/planning-v2.html](../../../../client/pages/planning-v2.html)):
  - Removed `.ai-presets-panel` block (HTML + CSS).
  - Removed `.week-card.scaffold` CSS.
  - Added `.planning-empty-cta` block for state A.
  - Wrapped button label in `.btn-generate-goals-label` span for dynamic relabeling.
- **Frontend JS** ([client/pages/scripts/planning-v2.js](../../../../client/pages/scripts/planning-v2.js)):
  - Dropped `buildQuarterWeekScaffold`, `getQuarterStartEnd`, `renderEmptyScaffoldWeek`, `formatScaffoldDateRange`, `triggerAIPreset`, `isAIPresetRunning`, AI-preset event delegation, `triggerAIPreset` from public API.
  - Added `getDateFromISOWeek(year, week)` (inverse of `getISOWeekNumber`), `buildRealWeeksFromGoals(goals)` (replaces `buildQuarterWeekScaffold` — only emits weeks that have goals), `getNextStartDateForExtend()` (returns Monday after latest existing week, or `today` if no goals).
  - Rewrote `renderWeeklyGoals` for three-state model.
  - Updated `generateWeeklyGoals` for smart prefill: `start_date` = Monday-after-latest if extending, else today; modal header switches to **Extend Weekly Plan** in extend mode.
  - Simplified `renderMonthGroup` (no more scaffold/empty-week branch).
  - Kept `getISOWeekStart`, `getISOWeekNumber`, `addDays`, `indexGoalsByYearWeek`, `groupWeeksByMonth`, `toggleMonth`, `autoExpandCurrentMonth` (D-H-1 / D-H-4 / D-H-5 invariants intact).
- **Backend untouched**: `GET /api/weekly-goals/:keyResultId` (UNION READ) and `POST /api/weekly-goals/generate` from #191 stay. `POST /api/planning/generate-weekly-plan` is the canonical generation endpoint (was already wired).
- **Test**: `scripts/test-sprint23-191-planning-page.js` — **85/85 green** (was 71/71). Net delta: dropped AI-presets/scaffold/triggerAIPreset assertions; added empty-CTA / button-relabel / `getDateFromISOWeek` inverse / `buildRealWeeksFromGoals` / `getNextStartDateForExtend` / "no scaffold in groupWeeksByMonth" assertions. UNION READ + S22a hot-zone hooks + ISO helpers all still green.
- **S22a regression**: 184a (55) + 184c (30) + 184e (36) all still green. Two-app boundary (`switch-company` only in doc-comments) and LLMGateway sole-OpenAI-chokepoint invariants both intact.
- **Sprint 23 Progress**: 23/33 (70%) — unchanged. Next: #192 Epic G Dashboard V3 + theme alias (10 pts).

### Session #191 — Epic H Planning Page + Phase A Consolidation (2026-04-30)

- **Phase A consolidation** (NEW [CONSOLIDATION_PLAN.md](../../../2-TECHNICAL/CONSOLIDATION_PLAN.md)): `GET /api/weekly-goals/:keyResultId` is now a UNION READ across the new `WeeklyGoal` collection AND legacy `Goal{time_period:'WEEKLY', key_result_id}`. Both sources project to a normalized shape with `_source: 'new' | 'legacy'`. Legacy `(year, quarter='Q1..Q4', week=1..13)` mapped to ISO 8601 `(target_year, target_week)` via `legacyWeekToISO()` so legacy + new align on the same scaffold. Deprecation notice added to `/api/goals/weekly/*` section in goals.js pointing at the plan.
- **Frontend consolidation**: [planning-v2.js loadWeeklyGoals](../../../../client/pages/scripts/planning-v2.js) now reads ONLY `/api/weekly-goals/:krId` (legacy `/api/goals/weekly/by-kr/:keyResultId` no longer called). Backward-compat aliases (`name`, `week`, `week_number`, `tasks`) preserved on the unified shape so existing `renderWeekCard` works unchanged.
- **Epic H Planning page**: full quarter scaffold (12-13 ISO 8601 weeks per D-H-5; week→month assignment by Monday's month per D-H-1) with collapsible `.month-group` wrappers around the existing `.week-card` rendering (D2 = wrap, preserves all assignment/task behavior). Empty-week scaffold rows render dashed-border placeholders. `autoExpandCurrentMonth()` opens the current-month group on load via client local timezone (D-H-4). Helper functions `getISOWeekStart`, `getISOWeekNumber`, `addDays`, `getQuarterStartEnd`, `buildQuarterWeekScaffold`, `groupWeeksByMonth`, `indexGoalsByYearWeek`, `toggleMonth` added.
- **AI Generation Presets** (D-H-3 wired live, D3 = client-side loop): NEW navy-gradient panel above the weeks stack with `Next 4 Weeks / Next 8 Weeks / Full Quarter` buttons + "Also generate Moves" toggle + progress bar (`aria-live="polite"`). `triggerAIPreset(N)` runs a sequential client-side loop of `POST /api/weekly-goals/generate` (one per upcoming ISO week starting from this Monday). Each call is tenant-scoped, AI-rate-limited, and falls back to template per-call (Sprint 22a Phase 2.3 cascade-cap shipped). Re-fetches the union read after the loop and shows a success/warning toast.
- **CSS**: appended `.ai-presets-panel`, `.month-group`, `.month-header`, `.month-content`, `.week-card.scaffold`, `.hidden` utility, mobile responsive cascade. All inline in [planning-v2.html](../../../../client/pages/planning-v2.html) `<style>` block.
- **Test**: `scripts/test-sprint23-191-planning-page.js` — **71/71 green**: frontend wiring (16) + ISO 8601 helpers via vm.Script sandbox incl. legitimate Q2 2026 edge case where Mar 30 Monday legitimately groups under March (D-H-1) (10) + consolidation governance asserts (4) + S22a hot-zone hooks preserved (4) + boot (1) + UNION READ behavior (24: 3 empty-state + 21 mixed sources incl. cross-tenant 404 + cancelled exclusion + invalid id) (12).
- **S22a + Epic D + Epic E regression**: 184a (55) + 184c (30) + 184e (36) + phase2-1 (18) + phase3-1 (47) + phase3-3 (9) + 188 (39) + 189 (45) + 190 (76) all still green. **Total: 426 assertions across 10 suites**.
- **Sprint 23 Progress**: 23/33 (70%). Next: #192 Epic G Dashboard V3 + theme alias (10 pts).

### Session #190 — Epic E Objective Wizard (2026-04-30)

- **Model**: `Objective.js` extended with `discipline_ids: [String]` (validated against `disciplines.isValid()` per D-E-2 — strings, NOT ObjectIds), `ssi_impact: { area, sub_dimension }` (D-E-8 — both optional), `ai_guidance: { generated, guidance_text, generated_at }`. Embedded `key_results[]` retained for backwards compat (D-A-1 dual-write window).
- **Routes**: `POST /api/objectives` (canonical) extended to accept new fields, validate disciplines, and dual-write KeyResult docs (D-A-1, D-E-7) with `year === target_year` (D-A-4); existing `validateObjectiveLimit` middleware (D-E-6) and S22a #184e stage hook preserved. `POST /api/objective-wizard/finalize` (wizard) extended identically + NEW: now enforces objective limit + fires `StageTransitionService.onFirstObjectiveCreated` (S22a #184e was previously bypassed on the wizard path). NEW `GET /api/objective-wizard/context-hints` returns `assessment_constraint` from latest completed assessment (or null per D-E-8 empty state).
- **Frontend**: [client/pages/objective-wizard.html](client/pages/objective-wizard.html) extended in place — nav block + step indicator + scripts preserved verbatim per D-E-5. Screen 1 gets SSI Impact section (2 dropdowns + suggestion banner). Screen 2 gets discipline selector grouped by 4 foundations (Discipline / Growth / Accountability / Maturity per D-A-5) with `0/3 recommended` counter, soft warning at >3, hard cap at 5. [client/pages/scripts/objective-wizard.js](client/pages/scripts/objective-wizard.js) extended with `WizardState.ssiImpact` + `WizardState.disciplineIds`, `initSSIDropdowns()` + `fetchAndApplySSISuggestion()` (auto-suggest from assessment.constraint), `initDisciplineSelector()` (grouped tile renderer with delegated change handler), and finalize payload now sends `discipline_ids` / `ssi_impact` / `ai_guidance`. `escapeHtml` applied to all dynamic discipline-card interpolation (lock-in-by-test). [client/css/objective-wizard.css](client/css/objective-wizard.css) appended `.ssi-section` + `.ssi-suggestion` + `.discipline-selector` + `.foundation-group` + `.discipline-option` (with `:has(input:checked)` highlight) + `.hidden` utility.
- **Two-app boundary preserved**: wizard JS has zero `switch-company` callers (test-asserted).
- **Test**: `scripts/test-sprint23-190-objective-wizard.js` — **76/76 green** (frontend wiring 36 + S22a regression 3 + boot 1 + context-hints 7 + canonical POST 14 + wizard finalize 13 + objective-limit 2). Live express + MongoMemoryReplSet; verifies dual-write KR persistence, discipline parity with `server/config/disciplines.js`, stage transition fired on both paths, 6th-objective rejection.
- **S22a + Epic D regression**: 184a (55) + 184c (30) + 184e (36) + phase2-1 (18) + phase3-1 (47) + phase3-3 (9) + 188 (39) + 189 (45) all still green. Total: 355 assertions across 9 suites.
- **Sprint 23 Progress**: 18/33 (55%). Next: #191 Epic H Planning page (5 pts).

### Session #189 — Epic D Phase 2 (2026-04-30)

- **API**: NEW `GET /api/assessments/trends` (period=6months|12months, groupByMonth aggregation, returns dimension scores 0-100 ×10 from storage; tenant-scoped via `req.user.company_id`; role gate: CONSULTANT/BUSINESS_OWNER/EXECUTIVE/MANAGER). NEW `GET /api/assessments/compare?id1=<>&id2=<>` (two-assessment delta; cross-tenant returns 403; surfaces `sub_dimensions` + `constraint` per side).
- **Frontend**: Added Tab 5 (Trends) + Tab 6 (Compare) to [client/pages/assessment-hub.html](client/pages/assessment-hub.html) — visible to managers/consultants in tenant context. NEW [client/js/assessment-charts.js](client/js/assessment-charts.js) — Chart.js line-chart renderer for trends + side-by-side cards w/ deltas for compare. Chart.js loaded via CDN. Module never reads/writes `karvia_user` (no JWT swap, two-app boundary preserved); all dynamic HTML escaped via `KarviaCommon.escapeHtml`.
- **Test**: `scripts/test-sprint23-189-trends-compare.js` — **45/45 green** (live express + MongoMemoryServer; 2 tenants; role gate × 2; cross-tenant compare 403; missing IDs 400; unknown ID 404; period filter; frontend wiring; S22a regression).
- **Maintenance**: phase3-3 lint blessed-sites updated for assessment-hub.html line shifts (7 entries; pre-existing checks, line numbers only).
- **Sprint 23 Progress**: 8/33 (24%) — Epic D fully complete. Next: #190 Epic E Objective Wizard (10 pts).

---

## Restart Guide

When `/init` runs at the start of a new conversation, it should:

1. Read this handoff (auto-loaded by genome).
2. Read [SPRINT23_MASTER_PLAN.md](SPRINT23_MASTER_PLAN.md) (linked from this doc).
3. Identify next pending session row in the Progress table.
4. Recommend `/coding` with that epic's spec (e.g. `/coding` → `epics/EPIC_D_ASSESSMENT.md`).

---

## Architectural State (inherited from Sprint 22a — DO NOT regress)

| Layer | Score | Source |
|---|---|---|
| Frontend | **10/10** | S22a #184c retired switch-company; #186 Phase 3.3 froze 22 role-check sites |
| Middleware | **10/10** | S22a #184a `requireManagedClient` middleware enforces tenant scope server-side |
| Backend | **10/10** | S22a Phase 3.1 extracted CompanyDisplayService |
| AI Orchestrator | **10/10** | S22a Phase 2.1-2.4 LLMGateway + LLMPolicy singletons |

**Sprint 23 invariants to verify at every session close**:

```bash
# Two-app boundary still enforced
git grep -nE '\bswitch-company\b' client/pages/scripts/ | grep -vE '^\s*//'
# Expected: zero executable callers (only doc-comments)

# LLMGateway is sole OpenAI chokepoint
git grep -lnE "require\\(\\s*['\\\"]openai['\\\"]\\s*\\)" server/
# Expected: only server/services/LLMGateway.js

# Stage transition hooks still wired
grep -n "StageTransitionService" server/routes/objectives.js server/routes/assessments.js server/routes/invitations.js
# Expected: 1 call site each in objectives.js (POST), assessments.js (POST /submit), invitations.js (POST /accept)
```

---

## Test Suite Inheritance (must stay green)

These are the regression suites Sprint 23 cannot break:

| Suite | Assertions | Source Sprint |
|---|---|---|
| test-sprint22a-184a-consultant-reads.js | 55/55 | S22a #184a |
| test-sprint22a-184b-client-workspace.js | 58/58 | S22a #184b |
| test-sprint22a-184c-retire-switch-company.js | 30/30 | S22a #184c |
| test-sprint22a-184d-mailjet-invitation.js | 36/36 | S22a #184d |
| test-sprint22a-184e-stage-transitions.js | 36/36 | S22a #184e |
| test-phase2-1-llm-gateway.js | 18/18 | S22a Phase 2.1 |
| test-phase2-3-cascade-cap.js | 13/13 | S22a Phase 2.3 |
| test-phase2-4-llm-policy.js | 20/20 | S22a Phase 2.4 |
| test-phase3-1-company-display.js | 47/47 | S22a Phase 3.1 |
| test-phase3-3-frontend-role-checks.js | 9/9 | S22a Phase 3.3 |

Each S23 session should re-run the most relevant subset. **#193 sprint-close MUST run the full set.**

---

## Sequence Rationale (locked)

```
D (independent)  →  E (Wizard)  →  H (Planning)  →  G (Dashboard, last consolidator)
```

- **D first**: zero deps, lowest risk, validates carry-over spec.
- **E before H/G**: H needs Objective KRs to render in Planning; G needs Objective discipline labels for causal-chain cards.
- **G last**: theme alias is a sprint-wide visual flip — visual regression check naturally covers everything D/E/H added.

---

## Hot Zones (S22a hooks must be preserved)

| File | Hook | Preserve in |
|---|---|---|
| `server/routes/objectives.js` | `StageTransitionService.onFirstObjectiveCreated()` | #190 (Epic E) |
| `server/routes/assessments.js` | `StageTransitionService.onFirstAssessmentCompleted()` | #188-189 (Epic D) |
| `server/models/Objective.js` | `key_results_v2` virtual | #190 (Epic E) |
| `client/pages/dashboard-v2.html` | (preserved verbatim per D-G-1) `<nav>` block + navigation.js script tag | #192 (Epic G) |
| `client/pages/planning-v2.html` | (preserved verbatim per Epic H) `<nav>` block + navigation.js script tag | #191 (Epic H) |
| `client/pages/objective-wizard.html` | (preserved verbatim per D-E-5) `<nav>` block + step-indicator scaffold | #190 (Epic E) |

---

## Theme-Alias Drift Note (for #192)

Before applying the 1-line alias in `s13-patterns.css`, run:

```bash
git grep -nE '\bvar\(--karvia-primary\)\b' client/
```

Expected count on 2026-04-30: **27** (9 in s13-patterns.css, 18 in objective-wizard.css). If higher, audit new sites individually before flipping.

---

## Commit Cadence

- **Per-session commits** during S23 (decided at /sprint-review on 2026-04-30).
- One commit per #188 / #189 / #190 / #191 / #192, plus a final close commit at #193.
- Squash only if an architectural Phase rides along (none currently planned).

---

## Known Issues (filed to backlog)

Both items below have been **filed in [MASTER_PRODUCT_BACKLOG.md → DEBT-006](../../../1-PRODUCT/product_backlog/MASTER_PRODUCT_BACKLOG.md)** (also indexed as P1 FEAT-043). Picked up out of S23.

| Issue | First seen | Severity | Where it lives now |
|---|---|---|---|
| **Mid-week start_date splits across two month groups** | 2026-05-01 (#191h verification) | Low (visual) | DEBT-006 Epic D (Auto-snap UX, 1 pt). User picks `start_date = Fri May 1`; ISO 8601 snaps that into the week of Mon Apr 27 (Thu Apr 30 = "April 2026") so a 4-week plan splits 1 / 3 across April / May. Auto-snap to next Monday on/after the picked date is the simplest fix. |
| **Date-sync across OKR cascade (Objective → KR → Goal → Task/Move)** | 2026-05-01 | Medium | DEBT-006 Epics A-C (Schema canonicalization + Range validators + Frontend cascade, ~12-18 pts). KR has no own date fields; weekly-goal / task / move dates aren't validated against parent Objective range; the legacy `week ≤ 13` schema cap silently truncates multi-quarter plans; two clocks (legacy quarter+week vs modern start_date) since #191h. Full audit + suggested epic split lives in DEBT-006. |

## Watch-Items

| Item | Trigger | Action |
|---|---|---|
| Beta-launch slip | If #192 closes after May 5 | Escalate Beta date to Apr 12-15 in roadmap |
| Theme alias scope creep | If pre-flight grep > 27 callers | Audit new sites; do not auto-extend |
| Move collection emptiness | Most users won't have AI cascade output by Beta | Verify #192 empty-state path is dominant; test fixture must include both empty and populated |
| F-M-05 Redis trigger | Production p95 sustained > 500ms at > 50 RPS on `/portfolio-summary` or `/dashboard-summary` | Promote F-M-05 from backlog to S24 |
| F-L-02 denorm trigger | Any consultant > 100 clients | Promote F-L-02 from backlog to S24 |

---

## Out of Scope (explicit)

- F-M-05 Redis cache (Phase 4 backlog, trigger-gated)
- F-L-02 `managed_businesses[]` denorm (Phase 4 backlog, trigger-gated)
- Move-type "Reaction" badge (D-G-3 descope)
- Old Sprint 23 "Epic A Behavior Model" (already shipped in S22 #176)
- `quarterly-goals.html` deletion (already done in S22a #184c)

---

## Sign-off Checklist (for #193)

- [ ] All 4 epics shipped with green test suites
- [ ] All S22a regression suites still green
- [ ] No purple on dashboard (`git grep '#8B5CF6' client/pages/dashboard-v2.html` clean)
- [ ] Two-app invariants verified (3 grep checks above)
- [ ] Stage transition hooks still wired (3 grep checks above)
- [ ] Beta deploy checklist updated in `KARVIA_STRATEGY/3-DELIVERY/3-RELEASE-ENGINEERING/`
- [ ] This handoff updated with final tally + commit hash
- [ ] Folder renamed `SPRINT-23` → `SPRINT-23 (Complete)`

---

**Last Updated**: 2026-05-02 (#192a shipped + paused mid-epic for user dev verification — see [SESSION_BREAK_NOTES.md](SESSION_BREAK_NOTES.md) for restart point)
