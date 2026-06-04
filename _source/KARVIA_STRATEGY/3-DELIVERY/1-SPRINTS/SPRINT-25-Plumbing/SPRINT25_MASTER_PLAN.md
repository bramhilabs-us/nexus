# Sprint 25 — "The Plumbing"

<!-- @GENOME T3-SPR-025-MP | DRAFT | 2026-05-08 | parent:T1-PRD-002 | auto:- | linked:/strategy,/coding,/audit -->

**Status**: 🟡 DRAFT — created 2026-05-06; awaiting S24 PX-1.6 prereq gate before launch. Amended 2026-05-08 with 6 IDs from Journey Smoke Test (Session #207). Sequencing + Phase 5 IDs added 2026-05-08 (Session #208 strategy review).
**Sprint Goal**: Fix every leak, retire every redundancy, verify every assumption. Ship a system in a known-good state before Sprint 26 attempts to stitch the activation flow.
**Total Tasks**: **55 across 5 phases** (11 Discovery + 9 Leak Fixes [5 conditional · 4 confirmed-via-journey unconditional] + 28 Cascade Cleanup [+2 from journey + **+8 PX-3.6a-h consumer migrations from Phase 1 PX-1.11**] + 3 Service Consolidation conditional + 4 Sprint-Close Deliverables mandatory). *Scope expanded 47→55 at Day 2 #209 after PX-1.11 finding identified 8 not-migrated consumers.*
**Close Target**: task-driven (no fixed dates); estimated ~10 working days
**Sprint type**: Foundational — no user-visible features; pure plumbing

---

## Why this sprint exists

After a four-pass code+strategy audit (Backend / Middleware / Frontend / Strategy Lineage, completed 2026-05-06), the system was found to have:

- **Cascade dual-write state** — legacy `Goal{WEEKLY}` collection + new `WeeklyGoal` collection both write-target today (Phase A union-read shipped in S23 #191; Phase B/C still pending)
- **Embedded `Objective.key_results[]` dual-write** — alongside standalone `KeyResult` collection
- **Six unverified assumptions** about FE/BE wiring (showEmptyState definition, narrative trigger timing, AIOKRSuggestion approval UX, standalone KR regen, stage-transition listeners, S24 schema-shipped state)
- **Service redundancies** — `aiOKRService` vs `AIObjectivePlanner.js`, `/api/ai-okr/*` vs `/api/objective-wizard/*`, `OKRRecommendationService` of unclear role
- **Missing single-writer pattern** for stage-transition dispatch — Sprint 26 needs a hookable foundation; today no such pattern exists

**The user-value chain (Sprint 26 = First Objective Created → Sprint 27 = First Task Completed) cannot be reliably stitched on top of leaky pipes.** Sprint 25 fixes the pipes.

**Gift of timing**: no real paid users on the system yet. Migration risk profile inverts. We build production-grade tooling against test data; the same scripts run cleanly when paid users arrive.

---

## Hard Prerequisite (blocks sprint start)

Sprint 24 must have shipped:
- 4-stage `Company.stage` collapse (`prospect/onboarding/active/paused/churned`)
- 6-stage canonical `Objective.lifecycle_stage` enum (per S24 F-1)
- `LifecycleTransitionService` generic abstraction (per S24 F-2)
- `client/js/display-labels.js` consultant mapping populated (per S24 F-1d)

**Task PX-1.6 is the gate.** If any of these have NOT shipped, Sprint 25 stops immediately.

---

## Sprint Goal Statement

> **By the end of Sprint 25:**
> 1. The OKR cascade has ONE canonical write path: `Objective → KeyResult → WeeklyGoal → Move`. Legacy `Goal{WEEKLY}` and embedded `Objective.key_results[]` are deleted.
> 2. The 6 verification questions have definitive code-cited answers in `KARVIA_STRATEGY/2-TECHNICAL/SPRINT_X_VERIFICATION.md`.
> 3. Every leak surfaced during verification is either fixed or formally deferred with rationale.
> 4. Service redundancies (`AIObjectivePlanner`, `/api/ai-okr/*`, `OKRRecommendationService` if dead) are retired or formally retained with rationale.
> 5. The `notifyTransition()` helper is wired into `StageTransitionService` entry points — ready for Sprint 26 to land transition emails on top (no event-bus / listener-registry; per Cross-sprint audit 2026-05-06, Group 2a).
> 6. A regression-test suite passes against the consolidated cascade + the new state.

---

## Phase Breakdown

### Phase 1 — Discovery (read-only verification)

All tasks are pure research — no code change. Each produces a citation-backed answer in `SPRINT_X_VERIFICATION.md`.

| ID | Task | Layer | Acceptance |
|---|---|---|---|
| **PX-1.1** | Verify `showEmptyState()` is defined in `objectives.js` | FE read | Yes/no with line citation |
| **PX-1.2** | Verify Stage 1c narrative trigger timing | BE read | Auto on submit / lazy / manual / never with citations |
| **PX-1.3** | Verify AIOKRSuggestion approval workflow surface | FE + BE read | URL + flow if exists; gap-flag if not |
| **PX-1.4** | Verify standalone "regenerate KRs" FE affordance | FE read | Yes/no with citations |
| **PX-1.5** | Verify Stage-transition hook listeners | BE read | List every listener subscribing today; identify zero-listener events |
| **PX-1.6** | **S24 dependency gate** — confirm S24 shipped its prereqs | BE read + git log | Hard yes/no per prereq item; **if any "no", stop sprint** |
| **PX-1.7** | KR-aggregation formula + lifecycle-state writers spike | BE read | Reference doc at `KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md` |
| **PX-1.8** | Verify Stage 2 LLM grounding from DiagnosticReport | BE read | Does refine-objective consume DiagnosticReport, or only raw scores? |
| **PX-1.9** | Verify `OKRRecommendationService` role | BE read | Purpose + actual usage; flag if dead code or live |
| **PX-1.10** | AI service redundancy audit | BE read | Map every endpoint to its single canonical service |
| **PX-1.11** | **Consumer audit** of embedded `Objective.key_results[]` + cascade dual-write (legacy reads) | BE read | List every consumer; categorize migrated/not-migrated; **gate prereq** for PX-3.6 / PX-3.18. *Cross-sprint audit 2026-05-06, Group 6.* |

**Phase 1 deliverable**: `KARVIA_STRATEGY/2-TECHNICAL/SPRINT_X_VERIFICATION.md` consolidating all 11 task outputs.

### Phase 2 — Leak Fixes (conditional on Phase 1)

These fire **only if** Phase 1 confirms the leak. Each is a candidate, not a commitment.

| ID | Task | Conditional on | Layer |
|---|---|---|---|
| **PX-2.1** | Wire SSI narrative auto-fire on Assessment.post-save | PX-1.2 confirms not auto today | BE |
| **PX-2.2** | Add inline `notifyTransition()` helper called from existing `StageTransitionService` entry points after successful flip — NO event-bus / listener-registry abstraction. *Cross-sprint audit 2026-05-06, Group 2a (replaces "StageTransitionDispatcher foundation pattern" from original draft).* | PX-1.5 confirms no notification path exists | MW |
| **PX-2.3** | Define `showEmptyState()` if missing | PX-1.1 confirms undefined | FE |
| **PX-2.4** | Build minimal AIOKRSuggestion review-pending surface | PX-1.3 confirms no UI exists | FE |
| **PX-2.5** | Wire standalone "regenerate KRs" affordance on objectives.html | PX-1.4 confirms missing AND Sprint 26/27 needs it | FE |
| **PX-2.6** | **MECE seeder `is_active:true` default fix** (`server/scripts/seedMECEQuestions.js`) — assessment cannot start until questions are flagged active. *Journey Smoke Test 2026-05-08, `A20260508-01` (CRITICAL).* | **Confirmed via journey — unconditional** | BE |
| **PX-2.7** | **Retire `ssi-questions-library.json` + `seed:questions` + `seed:templates`** in favor of `seed:mece` (post-Sprint-9 canonical source). 82% of JSON's questions fail MECE enum today. Decision at kickoff: retire vs migrate. *Journey Smoke Test 2026-05-08, `A20260508-02` (HIGH).* | **Confirmed via journey — unconditional**; Strategy decision required | BE + Strategy |
| **PX-2.8** | **Onboarding state machine wiring.** `Company.assessment_scores`, `Company.onboarding_progress.{assessment_completed, first_objective_created, first_goals_assigned}`, and `Company.stage` never tick today. Wire entry-point calls from `Assessment.post-save`, `Objective.post-save`, `Goal.post-save` into `StageTransitionService` (sole writer of `Company.stage`). Couples with `PX-2.2` `notifyTransition()` helper — each tick is a transition entry-point that S26 hangs an email off. *Journey Smoke Test 2026-05-08, `A20260508-05` (HIGH).* | **Confirmed via journey — unconditional**; depends on PX-2.2 | BE |
| **PX-2.9** | **`assessment_templates` orphan cleanup hooks.** Add `User.pre('deleteOne')` + `Company.pre('deleteOne')` to cascade-delete or archive owned templates. Decision at kickoff: cascade-delete vs reassign-to-system vs archive flag. *Journey Smoke Test 2026-05-08, `A20260508-06` (MEDIUM).* | **Confirmed via journey — unconditional**; Strategy decision required | BE |

**Phase 2 governance**: PX-2.1 through PX-2.5 get yes/no decisions after Phase 1 reports. PX-2.6 through PX-2.9 are **unconditional** — confirmed live via Journey Smoke Test 2026-05-08, no Phase 1 dependency.

### Phase 3 — Cascade Cleanup (Phase B + Phase C combined)

Per [CONSOLIDATION_PLAN.md](../../../2-TECHNICAL/CONSOLIDATION_PLAN.md). Phase C is **promoted from stretch to mandatory** because no real-user data exists; the 48h telemetry watchdog collapses to a 30-min verification check.

**Phase B (write-side cutover)**:

| ID | Task | Layer |
|---|---|---|
| **PX-3.1** | Pre-flight telemetry — verify `sources.legacy` trending to zero | BE (read-only ops) |
| **PX-3.2** | Decide Phase B open questions: frequency mapping, Tasks vs Moves, progress seeding | Strategy |
| **PX-3.3** | Port `legacyWeekToISO()` helper to shared `services/WeeklyGoalConsolidation.js` | BE |
| **PX-3.4** | Audit & remove FE callers to legacy `/api/goals/weekly/*` write endpoints | FE |
| **PX-3.5** | Update assignment dropdown handler in `planning-v2.js` | FE |
| **PX-3.6a** | Migrate `routes/objectives.js` KR read/write to standalone `KeyResult` (Phase 1 PX-1.11 NOT-MIGRATED #1) | BE |
| **PX-3.6b** | Migrate `routes/ai-okr.js` cascade-write to standalone `KeyResult` (Phase 1 PX-1.11 NOT-MIGRATED #2) | BE |
| **PX-3.6c** | Migrate `routes/objective-wizard.js` finalize to standalone `KeyResult` (Phase 1 PX-1.11 NOT-MIGRATED #3) | BE |
| **PX-3.6d** | Migrate `routes/consultant.js` populate to standalone `KeyResult` (Phase 1 PX-1.11 NOT-MIGRATED #4) | BE |
| **PX-3.6e** | Migrate `routes/cascade.js` reads to standalone `KeyResult` (Phase 1 PX-1.11 NOT-MIGRATED #5) | BE |
| **PX-3.6f** | Migrate `routes/planning.js` reads to standalone `KeyResult` (Phase 1 PX-1.11 NOT-MIGRATED #6) | BE |
| **PX-3.6g** | Migrate `routes/moves.js` reads to standalone `KeyResult` (Phase 1 PX-1.11 NOT-MIGRATED #7) | BE |
| **PX-3.6h** | Resolve HYBRID in `routes/weekly-goals.js` — drop embedded fallback (Phase 1 PX-1.11 HYBRID #1) | BE |
| **PX-3.6j** | **Services-layer + model-methods migration batch** — addresses PX-1.11 audit scope gap (`A20260510-01`). 4 sub-slices: (j-1) `services/objectiveService.js:457` `updateProgress` — embedded subdoc mutation → dual-write standalone HYBRID, **LIVE caller** at `PUT /api/objectives/:id/progress`; (j-2) `services/AIContextService.js:1027` `_getFocusContext` — `Objective.findOne({'key_results._id'})` → standalone-first read with embedded fallback (mirror PX-3.6f planning.js pattern), **LIVE callers** at moves/weekly-goals/ai-okr routes; (j-3) retire dead `services/progress-tracker.js:133` `trackKeyResultUpdate` (0 callers); (j-4) retire dead `Objective.addKeyResult` + `updateKeyResultProgress` instance methods (`models/Objective.js:460/500`, defined at PX-3.6a #213 but never wired). Sequential commits with drift-lock test per slice. | BE |
| **PX-3.6** | Drop embedded `Objective.key_results[]` dual-write from POST routes (**prereq: PX-3.6a-h + PX-3.6j ALL ✓ + PX-1.11 GREEN**) | BE |
| **PX-3.7** | Implement `scripts/db/migrate-legacy-weekly-to-new.js` (idempotent, `--dry-run`, `_migrated_to`) | BE |
| **PX-3.8** | 🟡 **DEFERRED → Sprint Cleanup, post-S28/S29** (per Day 12 #224 PX-3.21 — destructive; logged in [CLEANUP-REGISTRY.md](../../CLEANUP-REGISTRY.md); inline marker at `server/routes/goals.js:1243`). Block legacy write endpoints — POST/PUT/DELETE return `410 Gone` | BE |
| **PX-3.9** | Dry-run migration on pre-prod; capture log | BE (ops) |
| **PX-3.10** | Regression test suite for single-write path | BE |
| **PX-3.11** | Rollback plan documentation (artifact for future production migrations) | Doc |
| **PX-3.12** | Test-data migration execution | BE (ops) |

**Phase C (legacy retirement)** — was originally telemetry-gated stretch; **promoted to mandatory** under no-real-users freedom:

| ID | Task | Depends on |
|---|---|---|
| **PX-3.13** | Migration verification (~30 min check, replaces 48h telemetry watch) | PX-3.12 |
| **PX-3.14** | 🟡 **DEFERRED → Sprint Cleanup, post-S28/S29** (#224 PX-3.21). Delete `/api/goals/weekly/*` route block (`routes/goals.js:1241-1652`) | PX-3.13 |
| **PX-3.15** | 🟡 **DEFERRED → Sprint Cleanup, post-S28/S29** (#224 PX-3.21). Delete legacy weekly entries: `db.goals.deleteMany({ time_period: 'WEEKLY', _migrated_to: { $exists: true } })` | PX-3.13 |
| **PX-3.16** | 🟡 **DEFERRED → Sprint Cleanup, post-S28/S29** (#224 PX-3.21). Delete `/api/planning/goals/weekly` (overlaps `/api/weekly-goals/`) | PX-3.13 |
| **PX-3.17** | 🟡 **DEFERRED → Sprint Cleanup, post-S28/S29** (#224 PX-3.21). Drop `legacyWeekToISO()` projection from union read | PX-3.13 |
| **PX-3.18** | 🟡 **DEFERRED → Sprint Cleanup, post-S28/S29** (#224 PX-3.21 — HIGHEST-RISK entry; schema drop in single-purpose commit). Drop embedded `Objective.key_results[]` field from schema entirely (**prereq: PX-3.6a-h + PX-3.6j ALL ✓ + PX-3.6 ✓ + PX-1.11 GREEN**) | PX-3.13 + tests pass |
| **PX-3.19** | **Goals route field-name unify** — `POST /api/goals/quarterly` requires `name`, `POST /api/weekly-goals` requires `title`. Pick one canonical (recommend `title`); accept both during cutover; remove the alias once `PX-3.16` deletes `/api/planning/goals/weekly`. *Journey Smoke Test 2026-05-08, `A20260508-03` (MEDIUM).* | None — pure consolidation |
| **PX-3.20** | **`Goal.week` conditional `required`** — change `server/models/Goal.js` from unconditional `required:true` to `required: function() { return this.time_period === 'WEEKLY'; }`. Remove `week:1` arbitrary workarounds from any seeder/test/route normalizer. *Journey Smoke Test 2026-05-08, `A20260508-04` (HIGH).* | None — schema-only |
| **PX-3.21** | **Cleanup Boundary Marking** (Day 12 #224) — produce [`KARVIA_STRATEGY/3-DELIVERY/CLEANUP-REGISTRY.md`](../../CLEANUP-REGISTRY.md), inline `// CLEANUP-TARGET: PX-3.X` markers at every code site that will be deleted by PX-3.8 / 3.14 / 3.15 / 3.16 / 3.17 / 3.18 (PX-3.18 spans 9 fallback-reader sites across `routes/planning.js`, `routes/moves.js`, 5 services + schema field in `models/Objective.js`), and `scripts/audit-cleanup-targets.js` (`npm run audit:cleanup-targets`) cross-checking registry ↔ markers. Per user direction 2026-05-11: defer destructive work to a separate cleanup sprint after Beta + 50-100 user validation; meanwhile mark boundaries so the cleanup is mechanical. NOT a deletion task — purely additive plumbing. | None — additive |

Epic specs: [EPIC_25-1_CASCADE_PHASE_B.md](epics/EPIC_25-1_CASCADE_PHASE_B.md) + [EPIC_25-2_CASCADE_PHASE_C.md](epics/EPIC_25-2_CASCADE_PHASE_C.md) (both retained from original S25 draft; scope refined here).

### Phase 4 — Service Consolidation (conditional on Phase 1)

| ID | Task | Conditional on |
|---|---|---|
| **PX-4.1** | Retire `AIObjectivePlanner.js` if duplicates `aiOKRService` | PX-1.10 |
| **PX-4.2** | Retire `/api/ai-okr/*` if duplicates `/api/objective-wizard/*` | PX-1.10 |
| **PX-4.3** | Retire (or wire-in) `OKRRecommendationService` based on PX-1.9 finding | PX-1.9 |

### Phase 5 — Sprint-Close Deliverables (mandatory)

Authored at sprint close. Required for `/close` to pass. Tracked as PX-* IDs so they appear in the audit history table and progress matrix (previously prose-only — risk of being dropped).

| ID | Task | Source |
|---|---|---|
| **PX-5.1** | `KARVIA_STRATEGY/2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md` — 1-page spec of URL parameter shape, redirect targets, token semantics for S26→S27 cross-sprint emails | Cross-sprint audit 2026-05-06, Group 2b |
| **PX-5.2** | `KARVIA_STRATEGY/3-DELIVERY/BETA_LAUNCH_CHECKLIST.md` — functional / code quality / perf+ops / security / cohort setup / documentation gates with concrete pass/fail criteria; consolidates S26 + S27 acceptance into Beta-launch row-per-sprint | Cross-sprint audit 2026-05-06, Group 8a + 8d |
| **PX-5.3** | Prompt regression fixture suite — fixture set of input contexts → expected output shapes/qualities; runs at every sprint close that touches `server/prompts/`; failure blocks close. Extends existing `scripts/test-*` pattern. **+2 pts** | Cross-sprint audit 2026-05-06, Group 8b |
| **PX-5.4** | `REFINEMENT-BACKLOG/` reorganized — items split into `must-before-Beta/` and `nice-after-Beta/` subfolders or README sections | Cross-sprint audit 2026-05-06, Group 8c |

---

## Execution Sequencing

```
Day 1       Kickoff: 3 batched strategy decisions before any code runs:
              • PX-2.7 — retire vs migrate `ssi-questions-library.json`
              • PX-2.9 — cascade-delete vs reassign vs archive (orphan templates)
              • PX-3.2 — Phase B open Qs (frequency mapping, Tasks vs Moves, progress seeding)
            Phase 1 Discovery (11 tasks parallel, PX-1.6 reviewed first; if failed, stop sprint)
            Early-bird unblockers in parallel (no Phase 1 dependency):
              • PX-3.20 — `Goal.week` conditional `required` (today blocks QUARTERLY goal creation)
              • PX-3.19 — Goals route field-name unify
              • PX-2.6 — MECE seeder `is_active:true` default fix (CRITICAL journey-blocker)
Day 2       Phase 1 deliverable: SPRINT_X_VERIFICATION.md consolidates all 11 task outputs
            Phase 2 (PX-2.1–2.5) + Phase 4 conditional task lists finalized based on findings
Day 3       PX-2.2 (notifyTransition helper) → PX-2.8 (onboarding state-machine wiring) — sequential
            PX-2.1, PX-2.3, PX-2.4, PX-2.5 (post-Phase-1 conditionals) — parallel
            PX-2.9 (orphan cleanup, post-Day-1-decision)
Day 4-5     Phase 3.1-3.3 (pre-flight telemetry + `legacyWeekToISO()` helper port)
Day 6-8     Phase 3.4-3.12 (migration build + execution; PX-3.6/3.7 gated on PX-1.11 GREEN)
Day 9       Phase 3.13 (~30min verification) → Phase 3.14-3.18 (Phase C cleanup) parallel
            Phase 4 retirements parallel (PX-4.1/4.2/4.3 only if PX-1.10/1.9 confirm)
Day 10      Phase 5 sprint-close deliverables (PX-5.1–5.4)
            Final regression suite + acceptance verification + handoff to S26
```

Dates above are *relative ordering*, not commitments. Sprint closes when acceptance criterion is met.

**Sequencing rationale** (added 2026-05-08, Session #208 strategy review):
- **Day-1 strategy decisions batched**: PX-2.7, PX-2.9, PX-3.2 each require a Strategy call. Batching at kickoff prevents mid-execution blockers.
- **PX-3.20/3.19/2.6 promoted to Day 1**: These three are Phase 2/3-numbered but have no Phase 1 dependency. PX-3.20 in particular unblocks QUARTERLY goal creation across the regression test suite — must land early or downstream tests cannot set up valid fixtures.
- **PX-2.2 → PX-2.8 sequential**: PX-2.8 explicitly depends on PX-2.2's `notifyTransition()` helper (each onboarding tick fires a transition notification).

---

## Acceptance Criterion

Sprint 25 closes when:

- [ ] All 11 Phase 1 tasks complete; `SPRINT_X_VERIFICATION.md` populated with citations
- [ ] All confirmed-needed Phase 2 tasks complete (PX-2.1–2.5 conditional · **PX-2.6–2.9 unconditional**, confirmed via Journey Smoke Test 2026-05-08; or formally deferred with rationale)
- [ ] All 20 Phase 3 tasks complete (B mandatory + C now mandatory under no-users freedom; **+PX-3.19/3.20 from Journey Smoke Test 2026-05-08**)
- [ ] All confirmed-needed Phase 4 tasks complete (or services formally retained with rationale)
- [ ] All 4 Phase 5 sprint-close deliverables shipped (PX-5.1–5.4)
- [ ] Single-write path: `grep -rnE "/api/goals/weekly/(POST|PUT|DELETE)" client/` returns zero hits
- [ ] Legacy `Goal{WEEKLY}` documents deleted from test DB; `db.goals.countDocuments({ time_period:'WEEKLY' })` returns 0
- [ ] Embedded `Objective.key_results[]` field removed from schema
- [ ] `notifyTransition()` helper wired into `StageTransitionService` entry points (no event-bus / dispatcher abstraction)
- [ ] Regression test suite green
- [ ] Sprint closure doc + handoff to Sprint 26 written

---

## What Sprint 25 explicitly does NOT do

- ❌ Does NOT introduce any user-visible features
- ❌ Does NOT modify LLM prompts (defer to refinement track)
- ❌ Does NOT add new model fields beyond what migration cleanup requires
- ❌ Does NOT wire stage-transition emails (foundation only; subscribers come in Sprint 26)
- ❌ Does NOT touch behavior taxonomy (D/G/A/M/U vs GRIT — defer to refinement)
- ❌ Does NOT add Ball-model schema enhancements (`stakeholder_group`, etc. — defer to refinement)
- ❌ Does NOT touch iBrain integration (post-Beta separate track)

---

## Architectural Invariants (verify at every session close)

Carried forward from S22a / S23 / S24:

- [ ] Zero executable `switch-company` callers in `client/pages/scripts/`
- [ ] LLMGateway sole executable OpenAI chokepoint
- [ ] All consultant data access goes through `requireManagedClient`
- [ ] StageTransitionService sole writer of `Company.stage`
- [ ] LifecycleTransitionService sole writer of `Objective.lifecycle_stage`
- [ ] `Objective.consultant_notes` excluded from owner-facing GET projections
- [ ] No new role-check sites outside phase3-3 lint allow-list
- [ ] **NEW**: Cascade single-writer enforced — `WeeklyGoal` is sole write target for weekly goals; `KeyResult` is sole write target for KRs
- [ ] **NEW** *(Cross-sprint audit 2026-05-06, Group 7)*: Lifecycle writer for `Objective.lifecycle_stage` mirrors `StageTransitionService` pattern — idempotency via Mongo from-stage filter; no new contract. "Ball state" is a UI render-mapping, NOT a backend service.
- [ ] **NEW** *(Cross-sprint audit 2026-05-06, Group 2)*: All transition emails fire via inline `notifyTransition()` helper called from `StageTransitionService` entry points. No event-bus / listener-registry. Manual nudges and auto-fires use the same template per transition.

---

## Dependencies

### Hard upstream
- Sprint 24 must ship its lifecycle-stage prereqs (PX-1.6 gate)

### Downstream consumers
- Sprint 26 ("First Objective Created") wires emails into `notifyTransition()` helper built here (no separate dispatcher subscribers)
- Sprint 27 ("First Task Completed") relies on KR-aggregation formula spike output (PX-1.7) for its cron design
- Refinement track inherits clean schema for Ball-model additions

### Risks
- **R1**: PX-1.6 fails (S24 not shipped) — mitigation: sprint pauses, work moves into S24's window
- **R2**: Phase B migration finds unexpected legacy shapes — mitigation: dry-run + manual review before PX-3.12; trivial recovery (test data, can re-run)
- **R3**: Service retirement (PX-4.*) breaks unknown caller — mitigation: grep-first audit; retain if any caller exists; rationale documented

---

## Carry-forward to Sprint 26

When Sprint 25 closes, these items become Sprint 26 inputs:

- Single canonical cascade (single-write everywhere)
- `notifyTransition()` helper wired into `StageTransitionService` entry points (Sprint 26 lands 4 transition emails on top)
- `EMAIL_DEEP_LINK_CONTRACT.md` (Sprint 26 send-side + Sprint 27 receive-side both consume)
- `BETA_LAUNCH_CHECKLIST.md` (Sprint 26 + Sprint 27 reference for acceptance gating)
- Prompt regression fixture suite (Sprint 26 + Sprint 27 must run before close)
- KR-aggregation formula (documented in spike; Sprint 27 consumes)
- Verified empty-state / approval-workflow / dispatcher status (no more unknowns)

---

## Sign-off

Sprint 25 plan created 2026-05-06 after the four-pass audit (R1-R4) of backend, middleware, frontend, and strategy-doc lineage. The "everything is already built" framing was substantially confirmed; the gaps are in FE orchestration + a handful of plumbing leaks. This sprint fixes the plumbing so Sprint 26 can stitch the flow.

**Next sprint**: [`SPRINT-26-First-Objective/`](../SPRINT-26-First-Objective/) — "First Objective Created"
**Following sprint**: [`SPRINT-27-First-Task/`](../SPRINT-27-First-Task/) — "First Task Completed"
**Refinement backlog**: [`REFINEMENT-BACKLOG/`](../REFINEMENT-BACKLOG/) — three deferred drafts (owner-side redesign, display-labels owner mapping, behavior persistence β)
