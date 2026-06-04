# Sprint 25 — System State Verification Report

<!-- @GENOME T2-TECH-SPR25-VERIFY | ACTIVE | 2026-05-09 | parent:T3-SPR-025-MP | auto:- | linked:/coding,/audit -->

**Status**: 🟢 ACTIVE — Phase 1 sealed 2026-05-09 (Session #209)
**Purpose**: Single source of truth for the 11 verification questions Sprint 25 Phase 1 had to answer before any leak-fix or consolidation work began.
**Created**: 2026-05-06 · **Sealed**: 2026-05-09

---

## Phase 1 Deliverable Summary

| ID | Verified? | Gap? | Phase 2/4 trigger |
|---|---|---|---|
| PX-1.1 | ✅ | NO — defined | PX-2.3 → **DEFER, not needed** |
| PX-1.2 | ✅ | Partial — lazy on read, not auto | PX-2.1 → **DEFER, lazy is acceptable** |
| PX-1.3 | ✅ | NO — full surface exists | PX-2.4 → **DEFER, not needed** |
| PX-1.4 | ✅ | YES — BE endpoint exists but is **wizard-session-bound**; cannot regen saved Objectives | PX-2.5 → **DEFER to own session** (needs NEW BE endpoint, not wire-up) |
| PX-1.5 | ✅ | YES — no inline `notifyTransition()` helper exists | PX-2.2 → **FIRE** |
| PX-1.6 | ✅ | **GATE GREEN** — all 4 prereqs shipped | Sprint 25 proceeds |
| PX-1.7 | ✅ | NO scheduler — read-time aggregation; single canonical writer | Doc → S27 cron design input |
| PX-1.8 | ✅ | YES — 12-block fetched into context but not in prompt | **Refinement track** (not S25) |
| PX-1.9 | ✅ | YES — dead code | PX-4.3 → **FIRE** (retire) |
| PX-1.10 | ✅ | Partial — `AIObjectivePlanner` consolidatable; routes are NOT redundant | PX-4.1 → **DEFER, low value** · PX-4.2 → **KEEP** |
| PX-1.11 | ✅ | **CRITICAL** — 8 files read embedded `Objective.key_results[]`; PX-3.6/3.18 NOT SAFE without migration sub-phase | Add migration sub-tasks before PX-3.6 |

---

## PX-1.1 — `showEmptyState()` definition status

**Question**: Is `showEmptyState()` defined in `client/pages/scripts/objectives.js`, or just referenced?

**Actual**: ✅ **Defined**. No runtime error.

**Citations**:
- Definition: [`client/pages/scripts/objectives.js:662`](../../client/pages/scripts/objectives.js#L662)
- Call sites: lines 54, 70, 75, 798

**Gap**: NO. **PX-2.3 not needed.**

---

## PX-1.2 — Stage 1c narrative trigger timing

**Question**: When does narrative generation fire? Auto-on-save / lazy-on-read / manual / never?

**Actual**: 🟡 **Lazy on read (on-demand)**. NOT eager.

**Citations**:
- `Assessment.post-save` hook ([`server/models/Assessment.js:1102-1124`](../../server/models/Assessment.js#L1102-L1124)) updates invitation status only — does NOT trigger narrative.
- Generation route: [`server/routes/diagnostic-reports.js:612-627`](../../server/routes/diagnostic-reports.js#L612-L627) — `GET /api/diagnostic/ssi/:companyId?include_narratives=true` calls `SSINarrativeService.generateNarratives()`.
- Service: [`server/services/SSINarrativeService.js:135`](../../server/services/SSINarrativeService.js#L135) — LLM via LLMGateway with templated fallback.
- Manual refresh: [`server/routes/diagnostic-reports.js:749`](../../server/routes/diagnostic-reports.js#L749) — `/api/diagnostic/ssi/:reportId/refresh-narratives`.

**Gap**: NOT eager — but lazy is acceptable for current load profile. **PX-2.1 DEFERRED to refinement track** (not a Beta blocker).

---

## PX-1.3 — AIOKRSuggestion approval workflow surface

**Question**: Does a "review pending suggestions" UI exist?

**Actual**: ✅ **Full surface exists** — backend + frontend.

**Citations**:
- Model: [`server/models/AIOKRSuggestion.js:30-35`](../../server/models/AIOKRSuggestion.js#L30-L35) — status enum: `draft | approved | dismissed | partially_approved | regenerating | rejected`.
- Endpoints: [`server/routes/ai-okr.js:423`](../../server/routes/ai-okr.js#L423) (`GET /suggestions/:userId`), `:585` (`POST /approve`), `:976` (`POST /approve-draft`), `:722` (`DELETE /dismiss/:suggestionId/:objectiveIndex`).
- Review page: [`client/pages/ai-okr-review.html:1-180`](../../client/pages/ai-okr-review.html)
- Script: [`client/pages/scripts/ai-okr-review.js:105+`](../../client/pages/scripts/ai-okr-review.js#L105) — calls `AIOkrAPI.approveSuggestions()` at line 581.

**Gap**: NO. **PX-2.4 not needed.**

---

## PX-1.4 — Standalone "regenerate KRs" FE affordance

**Question**: Outside the wizard, can the user regenerate KRs for an existing Objective?

**Actual**: 🟡 **Wizard-only flow today. Existing endpoint NOT usable for saved Objectives.**

**Citations**:
- BE endpoint: [`server/routes/objective-wizard.js:488-563`](../../server/routes/objective-wizard.js#L488-L563) — `POST /regenerate-kr` accepts `session_id`, `kr_index`, `feedback`. **Wizard-session-bound** — validates `WizardSessionService.getSession(session_id)` (in-memory state); writes via `WizardSessionService.updateKR(...)`. Never touches persisted `Objective` or `KeyResult` collections.
- FE in wizard: [`client/pages/objectives.html:2233`](../../client/pages/objectives.html#L2233) (`WizardAPI.regenerateKR()`), wizard UI lines 874-889, 2568, 2580-2620.
- FE in standalone view: NOT FOUND in [`client/pages/scripts/objectives.js:853-973`](../../client/pages/scripts/objectives.js#L853-L973) (View Details modal).

**Gap**: YES — but larger than initially scoped. The existing endpoint cannot regenerate a KR for an already-saved Objective (wizard session has expired post-finalize). True standalone regen requires a **new endpoint** (e.g., `POST /api/objectives/:objectiveId/key-results/:krId/regenerate`) that loads the persisted Objective + KR + context, calls the LLM, and writes back to the standalone `KeyResult` collection (per PX-3.6a-h direction).

**Decision (Day 2 #209)**: PX-2.5 **DEFERRED to its own session** (not the small wire-up originally scoped). Estimated effort: BE endpoint + service + FE button + handler + tests ≈ 2-3 hours. Schedule after PX-2.2 + PX-2.8 land.

---

## PX-1.5 — Stage-transition hook listeners

**Question**: What listens to stage-transition events today? Any zero-listener events?

**Actual**: ✅ **All transitions have at least one call site. No event-bus / `notifyTransition()` helper exists yet.**

**Objective lifecycle entry points** (all in [`server/services/LifecycleTransitionService.js`](../../server/services/LifecycleTransitionService.js)):

| Transition | Trigger | Caller | Downstream |
|---|---|---|---|
| `identified → kr_breakdown` | Auto: KR exists | `evaluateAndTransitionAfterWrite()` (lines 276-294); fired by `objectives.js:281`, `key-results.js:95/152`, `weekly-goals.js:318`, `moves.js:304` post-response | `lifecycle.transition` telemetry |
| `kr_breakdown → in_execution` | Auto: client-role owner + ≥1 WeeklyGoal | Same evaluator (lines 299-340) | `lifecycle.transition` telemetry |
| `in_execution → completion_review` | Auto: all KRs complete | Same evaluator (lines 344-367) | `lifecycle.transition` telemetry |
| `completion_review → sustained_mode` | Manual: consultant | `markSustained()` (lines 379-402); guarded by `Objective.sustained_eligible` virtual ([`Objective.js:449-453`](../../server/models/Objective.js#L449-L453)) | `lifecycle.transition` telemetry |

**Company stage entry points**:

| Transition | Trigger | Caller |
|---|---|---|
| `prospect → onboarding` | First POC accepts invitation | `StageTransitionService.onPocInvitationAccepted()` ([`invitations.js:263`](../../server/routes/invitations.js#L263)) |
| `onboarding → active` | First Objective created | `StageTransitionService.onFirstObjectiveCreated()` ([`objectives.js:263`](../../server/routes/objectives.js#L263), [`objective-wizard.js:766`](../../server/routes/objective-wizard.js#L766)) |
| (history-only, no flip) | First Assessment completed | `StageTransitionService.onFirstAssessmentCompleted()` ([`assessments.js:344`](../../server/routes/assessments.js#L344)) |
| Manual stage edit | Consultant override | `StageTransitionService.manualTransition()` ([`consultant.js:1620-1621`](../../server/routes/consultant.js#L1620-L1621)) |

**Inline helper status**: `fireAfterWriteEvaluator()` ([`LifecycleTransitionService.js:423-437`](../../server/services/LifecycleTransitionService.js#L423-L437)) is a per-route Express `res.on('finish')` hook — NOT a global `notifyTransition()`.

**Gap**: YES — **PX-2.2 → FIRE**. Add `notifyTransition()` inline helper at every `_record()` success site, called from `StageTransitionService` + `LifecycleTransitionService` entry points. Per cross-sprint audit Group 2a: NO event-bus / listener-registry abstraction.

---

## PX-1.6 — S24 dependency gate (HARD GATE)

**🟢 STATUS: GREEN — sprint proceeds.**

| Prereq | Shipped? | Citation |
|---|---|---|
| 4-stage `Company.stage` collapse | ✅ | [`server/models/Company.js:89-94`](../../server/models/Company.js#L89-L94) imports `COMPANY_STAGE_ENUM` from [`server/constants/companyStages.js:12-19`](../../server/constants/companyStages.js#L12-L19) — canonical 6: `prospect/onboarding/active/paused/churned/completed` (note: 6 canonical + 4 legacy = original "10→6 collapse"). |
| 6-stage canonical `Objective.lifecycle_stage` enum | ✅ | [`server/models/Objective.js:125-130`](../../server/models/Objective.js#L125-L130) imports `LIFECYCLE_STAGES` from [`server/constants/objectiveLifecycle.js:11-18`](../../server/constants/objectiveLifecycle.js#L11-L18) — exactly 6: `identified/kr_breakdown/in_execution/completion_review/completed/sustained_mode`. |
| `LifecycleTransitionService` generic abstraction | ✅ | [`server/services/LifecycleTransitionService.js`](../../server/services/LifecycleTransitionService.js) exists. Factory + 2 instances: `companyStageInstance` (lines 216-223), `objectiveLifecycleInstance` (lines 225-232). Idempotent `findOneAndUpdate` with `fromStage` filter (lines 88-122). |
| `client/js/display-labels.js` consultant mapping populated | ✅ | [`client/js/display-labels.js`](../../client/js/display-labels.js) — `COMPANY_STAGE_LABEL` (lines 71-78), `OBJECTIVE_LIFECYCLE_LABEL` (lines 56-63), `CONSULTANT_BALL_VIEW` (lines 93-100), helpers `companyStageView()` / `lifecycleView(stage,role)` (lines 105-140). |

**Git evidence**: `6456832` (Epic 24.6 stage migration) · `90b0a25` (Epic 24.3 P1 backbone) · `106d095` (Epic 24.3 P2 UI) · `d34d753` (Epic 24.3 P1 close).

---

## PX-1.7 — KR-aggregation formula + lifecycle-state writers spike

**Question**: How is Objective progress aggregated from KRs? Where does `lifecycle_stage` get written?

**Actual**: 🟢 Single canonical writer ✅. Aggregation = read-time (no scheduler).

**Full audit**: [`KARVIA_STRATEGY/2-TECHNICAL/KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md`](KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md).

**Summary**:
- **Objective progress formula**: average of KR progress; KR progress = `(current - baseline) / (target - baseline) * 100`. Computed at READ time via [`Objective.js:491-510`](../../server/models/Objective.js#L491-L510) `calculateProgress()`. No scheduler.
- **`lifecycle_stage` writers**: ONLY [`LifecycleTransitionService.js`](../../server/services/LifecycleTransitionService.js). 5 entry points (`transitionTo` / `manualTransition` / `manualOverride` / `appendHistoryOnly` / `evaluateAndTransitionAfterWrite`). Telemetry on every flip.
- **No KR aggregation cron** — confirms Sprint 27 must design one if real-time progress is wanted.

---

## PX-1.8 — Stage 2 LLM grounding from DiagnosticReport

**Question**: Does refine-objective consume structured DiagnosticReport, or only raw scores?

**Actual**: 🟡 **Partial — 12-block data fetched into context but NOT exposed to prompt.**

**Citations**:
- Context loader: [`server/services/AIContextService.js:750`](../../server/services/AIContextService.js#L750) — `buildContext(companyId, { scope: 'okr' })`. Calls `getFullSSIScores(companyId, { include12Block: true })` (line 796) — `context.ssi = { dimensions, blocks, priorityBlocks, has12BlockData: true }`.
- Prompt template: [`server/prompts/endpoint-templates/single-objective.js:181-226`](../../server/prompts/endpoint-templates/single-objective.js#L181-L226) — embeds company name, industry, **dimension-level** weak/strong areas (lines 184-185), existing objectives. Does NOT embed full 12-block matrix.
- Execution: [`server/routes/objective-wizard.js:281-294`](../../server/routes/objective-wizard.js#L281-L294) — pulls `session.context` from `WizardSessionService` (preloaded line 210), passes to prompt builder.

**Gap**: 12-block structured data available in context but lost before prompt assembly. **Refinement track** (not Beta-blocker).

---

## PX-1.9 — `OKRRecommendationService` role

**Question**: Live or dead?

**Actual**: ❌ **Dead code.**

**Citations**:
- File exists: [`server/services/diagnostic/OKRRecommendationService.js`](../../server/services/diagnostic/OKRRecommendationService.js).
- Only caller: `testSSIDiagnostic.js:38` (test script).
- Production callers: zero (`grep -rn "OKRRecommendationService" server/routes/ server/services/` confirms).

**Gap**: YES — **PX-4.3 → FIRE** (retire file + test stub).

---

## PX-1.10 — AI service redundancy audit

**Question**: Are services and routes duplicated?

**Actual**: 🟡 Partial redundancy. LLMGateway sole chokepoint ✅.

**Endpoint → service map**:

| Endpoint | Service | Status |
|---|---|---|
| POST `/api/ai-okr/generate/:assessmentId` | `aiOKRService.generateOKRsFromAssessment()` | LIVE |
| POST `/api/ai-okr/generate-single-objective` | `aiOKRService.generateKRs()` | LIVE |
| POST `/api/ai-okr/generate-plan` | `AIObjectivePlanner.generateObjectivePlan()` | LIVE (single caller) |
| POST `/api/objective-wizard/refine-objective` | LLMGateway direct | LIVE |
| POST `/api/objective-wizard/generate-krs` | LLMGateway direct | LIVE |

**Findings**:
1. `aiOKRService` vs `AIObjectivePlanner`: overlap in concept (both generate OKRs from SSI). `AIObjectivePlanner` is single-purpose with one caller. **Consolidatable but low-value** — defer.
2. `/api/ai-okr/*` vs `/api/objective-wizard/*`: NOT redundant. Different flows (backend cascade vs user-guided wizard). **Keep both, formally retain**.
3. `LLMGateway` is sole OpenAI chokepoint ✅: `grep -rn "openai\|OpenAI" server/services/` confirms only [`LLMGateway.js:77`](../../server/services/LLMGateway.js#L77) imports the SDK.

**Gap**: PX-4.1 → **DEFER** (low value, working). PX-4.2 → **KEEP** (formally retain with rationale: distinct UX flows).

---

## PX-1.11 — Consumer audit of `Objective.key_results[]` + cascade dual-write

**🚨 CRITICAL — gates PX-3.6 + PX-3.18.**

**Question**: List every consumer of embedded `Objective.key_results[]` + legacy `Goal{WEEKLY}` reads. Categorize migrated vs not-migrated.

**Actual**: ❌ **NOT SAFE to fire PX-3.6 + PX-3.18 without a migration sub-phase.**

**Embedded `Objective.key_results[]` consumer table**:

| File | Pattern | Status |
|---|---|---|
| [`server/routes/objectives.js`](../../server/routes/objectives.js) | POST dual-writes embedded + collection (PX-3.6i aligned); PUT bulkWrite-syncs collection on KR edits (upsert by `_id`, soft-cancel removed); `Objective.addKeyResult` + `updateKeyResultProgress` instance methods dual-write | HYBRID ✓ #213 (PX-3.6a) |
| [`server/routes/weekly-goals.js`](../../server/routes/weekly-goals.js) | KR existence/tenant precheck in `GET /:keyResultId` is now collection-only — Sprint 23 #191c embedded `Objective.key_results[]` fallback dropped (PX-3.6h #216 canary lift). `Objective` model `require()` also dropped (was solely for the retired fallback). Sprint 23 #191 union-read contract (`WeeklyGoal` + legacy `Goal{WEEKLY}` projection with `_source` tags) preserved untouched. POST/PUT/DELETE write surface unchanged. PX-3.6 macro now unblocked | ✅ MIGRATED #216 (PX-3.6h) |
| [`server/routes/ai-okr.js`](../../server/routes/ai-okr.js) | 5 write sites all dual-write to `KeyResult` collection (PX-3.6i `_id` pass-through). HYBRID — embedded write retained as source of truth, dual-write non-blocking. Sites: `/approve` (legacy) · `/approve-draft` · `/generate-from-company` (SOLE cascade-acceptance writer) · `/generate-single-objective` AI-disabled fallback + AI-enabled main | HYBRID ✓ #214 (PX-3.6b) |
| [`server/routes/objective-wizard.js`](../../server/routes/objective-wizard.js) | `/finalize` POST dual-writes embedded `newObjective.key_results[]` + standalone `KeyResult` collection (PX-3.6i `_id` pass-through). HYBRID — embedded retained as response shape + source of truth. Migration was done in Sprint 23 Epic E (D-A-1, D-E-7) + refined Day 5 #212 by PX-3.6i; PX-3.6c #215 formalizes lineage tag + drift-lock test | HYBRID ✓ #215 (PX-3.6c) |
| [`server/routes/key-results.js`](../../server/routes/key-results.js) | Queries `KeyResult` standalone collection | MIGRATED ✓ |
| [`server/services/LifecycleTransitionService.js`](../../server/services/LifecycleTransitionService.js) | Queries `KeyResult` standalone | MIGRATED ✓ |
| [`server/routes/consultant.js`](../../server/routes/consultant.js) | Reads `KeyResult` collection per Goal page slice; swaps `objective_id.key_results` post-populate; embedded retained as HYBRID fallback | HYBRID ✓ #212 (PX-3.6d) |
| [`server/routes/cascade.js`](../../server/routes/cascade.js) | Reads `KeyResult` collection with `$in` over root + dept + team objective ids in `/hierarchy/:id`, per-objective embedded fallback | HYBRID ✓ #211 (PX-3.6e) |
| [`server/routes/planning.js`](../../server/routes/planning.js) | Reads `KeyResult` collection at 3 sites (generate-weekly-plan, append-weekly-plan-extension, generate-tasks); embedded `key_results.id()` retained as HYBRID fallback | HYBRID ✓ #212 (PX-3.6f) |
| [`server/routes/moves.js`](../../server/routes/moves.js) | Reads `KeyResult` collection in `dashboard-summary`, embedded as fallback for unmigrated rows | HYBRID ✓ #210 (PX-3.6g) |

**Schema state**: [`server/models/Objective.js:383`](../../server/models/Objective.js#L383) — embedded `key_results[]` array still present alongside standalone `KeyResult` collection. No automatic dual-write hook; dual-write is manual at each write site.

**Counts**: 0 NOT-MIGRATED + 7 HYBRID + 3 MIGRATED — **first MIGRATED consumer route landed; PX-3.6 macro now unblocked**. (was 0+8+2 before PX-3.6h #216; 1+7+2 before PX-3.6c #215; 2+6+2 before PX-3.6b #214; 3+5+2 before PX-3.6a #213; 5+3+2 before PX-3.6d/f #212; 6+2+2 before PX-3.6e #211; 7+1+2 before PX-3.6g #210.)

**Verdict**: PX-3.6 (drop embedded write from POST routes) and PX-3.18 (drop schema field) prerequisite — all 8 consumer routes ≥ HYBRID with `weekly-goals.js` MIGRATED as the canary — is **MET as of #216 (PX-3.6h)**. Next: PX-3.6 macro can now drop the 7 remaining HYBRID embedded-read fallbacks across the other consumer routes simultaneously, paired with the embedded-write removal at POST sites. PX-3.7 backfill (`scripts/db/migrate-legacy-weekly-to-new.js`) runs before PX-3.18 to cover any pre-Sprint-22 embedded-only legacy KRs that the canary would 404.

**Required new sub-tasks** (proposed insertion before PX-3.6 in Phase 3):

| New ID | Task | File | Status |
|---|---|---|---|
| **PX-3.6a** | Migrate `objectives.js` KR read/write to standalone `KeyResult` (incl. `Objective.addKeyResult` + `updateKeyResultProgress`) | `routes/objectives.js`, `models/Objective.js` | ✅ HYBRID #213 |
| **PX-3.6b** | Migrate `ai-okr.js` cascade-write to standalone `KeyResult` | `routes/ai-okr.js` | ✅ HYBRID #214 |
| **PX-3.6c** | Migrate `objective-wizard.js` finalize to standalone `KeyResult` | `routes/objective-wizard.js` | ✅ HYBRID #215 |
| **PX-3.6d** | Migrate `consultant.js` populate to standalone `KeyResult` | `routes/consultant.js` | ✅ HYBRID #212 |
| **PX-3.6e** | Migrate `cascade.js` reads to standalone `KeyResult` | `routes/cascade.js` | ✅ HYBRID #211 |
| **PX-3.6f** | Migrate `planning.js` reads to standalone `KeyResult` | `routes/planning.js` | ✅ HYBRID #212 |
| **PX-3.6g** | Migrate `moves.js` reads to standalone `KeyResult` | `routes/moves.js` | ✅ HYBRID #210 |
| **PX-3.6h** | Resolve HYBRID in `weekly-goals.js` — drop embedded fallback | `routes/weekly-goals.js` | ✅ MIGRATED #216 |
| **PX-3.6i** | KR `_id` pass-through in 2 dual-write `KeyResult.insertMany` sites | `routes/objectives.js`, `routes/objective-wizard.js` | ✅ #212 |

After 3.6a-i ship, original PX-3.6 (drop embedded write at POST sites) and PX-3.18 (drop schema field) become safe.

**PX-3.6i rationale (added Day 4 #211)**: PX-3.6d + PX-3.6f populate `objective_id` with `key_results` for FE-side `objective.key_results.id(key_result_id)` lookups. `KeyResult.insertMany(krDocs)` in dual-write sites does NOT pass `_id: kr._id`, so embedded subdoc `_id` and collection `_id` are different ObjectIds for the same logical KR — switching the populate to collection KRs today breaks FE FK lookups. PX-3.6i passes `_id: kr._id` through, unifying the ID system; PX-3.6d + PX-3.6f then become mechanical mirrors of PX-3.6e.

**Sprint impact**: +9 sub-tasks → **Sprint 25 task count 47 → 56** (was 55 before PX-3.6i added Day 4).

---

## Sign-off

✅ All 11 sections populated and verified.
✅ Phase 2 conditional decisions finalized (PX-2.1/2.3/2.4 defer; PX-2.2/2.5 fire).
✅ Phase 4 conditional decisions finalized (PX-4.1 defer; PX-4.2 keep; PX-4.3 fire).
✅ PX-1.6 gate GREEN — Sprint 25 proceeds.
🚨 PX-1.11 critical: 8 consumer migrations required before PX-3.6/3.18.
📌 Refinement track items captured: PX-2.1 (eager narrative), PX-1.8 (12-block in prompt), PX-4.1 (`AIObjectivePlanner` consolidation).

Sprint 25 ready to proceed to Phase 2/3/4 execution.
