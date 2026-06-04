# Sprint 27 — "First Task Completed"

<!-- @GENOME T3-SPR-027-MP | ACTIVE | 2026-05-31 | parent:T1-PRD-002 | auto:- | linked:/strategy,/coding -->
<!-- 2026-05-27 — Workstream E added per /strategy session #260 (Objectives page strategic resolution). 6 items (A20260527-04..09) land objective-creation refinement: NEW Create Individual Objective wizard, Category Coverage + door #5 de-emphasis, Manager-side deferred-KR CTA, objective card polish. Pre-S27-kickoff scope amendment. Existing Workstreams A/B/C/D unchanged. -->
<!-- 2026-05-31 — /audit session #271 documentation reconciliation. Sprint flipped DRAFT → ACTIVE (S26 sealed 2026-05-30). Workstream F (Objective Completion Engine) formally added: Phase 1 (A20260530-01 + -02) consumed from S26 close-session; Phase 2 mints A20260530-03..-06 atomically at this amendment (WeeklyGoal-stall cron + Task-overdue cron + receive-side <NextStep> hero + Re-delegation/Self-cancel CTAs). Pattern locked: B.2 invitation reminder pattern at dailyDigestJob.js:155-280 mirrored onto WeeklyGoal + Task per `feedback_extend_before_wrap`. Existing Workstreams A/B/C/D/E unchanged. -->

**Status**: 🟢 ACTIVE — launched 2026-05-30 at S26 seal. Workstream E partial (8/13 ✅; E.1a/b/c/d + E.9 📝 gated on user wizard fresh-review). Workstream F Phase 1 ✅ SHIPPED 2026-05-30 (consumed); Phase 2 mints 2026-05-31.
**Sprint Goal**: From the Sprint 26 end-state (Objective + KRs saved), the Manager plans, the Employee executes, and the **first task is marked complete** — without dropping the ball. **Plus** (Workstream E added 2026-05-27): the objective-creation flow is unified around the strategic shift to "individual objectives created by BO/consultant/manager." **Plus** (Workstream F added 2026-05-31): every objective placed in the system can be **completed** — persistent-nudge cron coverage across all 3 cascade-stall stages, receive-side hero variants for ownership cohorts, re-delegation + self-cancel CTAs.
**Theme**: Stitch the execution flow end-to-end. Stages 2 → 5. **Plus** objective-creation refinement. **Plus** completion-engine: no objective is allowed to silently die.
**Close Target**: task-driven; scope firms at sprint kickoff
**Sprint type**: User-value delivery — visible execution milestone

---

## Why this sprint exists

Sprint 26 ends with the first Objective saved + KRs ready. The Manager has received an email handoff. From that point, today's flow has these dead zones:

1. **Manager lands on planning page** — no first-time empty-state guidance; Manager doesn't know what to do
2. **Stage 4 LLM (already wired per S23 #192a)** — works, but receive-side experience untested at first-time-use
3. **WeeklyGoal/Task assigned → Employee notified** — no email today
4. **Employee dashboard** — no first-time-use empty-state; "today's tasks" visibility uncertain for new users
5. **Task marked complete** — telemetry fires per R2 audit; but does aggregation propagate to KR/Objective progress?
6. **All KRs at 100% → consultant "ready to mark sustained" email** — no KR-aggregation cron exists; built here
7. **Optional**: Manager visibility into employee task completion — useful for coaching loop

This sprint stitches all 4 handoffs of the **execution half** of the journey, plus the closing-loop notification.

---

## Sprint Goal Statement

> **By the end of Sprint 27**, from the Sprint 26 end-state, this sequence works end-to-end:
>
> Manager logs in → lands on `planning-v2.html` → sees the new KR awaiting plan with clear CTA → clicks "Generate behaviors + tasks" → Stage 4 LLM fires → reviews + assigns to Employee → saves.
>
> Employee receives email → logs in → lands on `dashboard-v2.html` → sees today's task → marks complete.
>
> Telemetry fires `move.completed`. KR progress aggregates upward to Objective. **First task is completed.**
>
> Optional: when all KRs hit 100%, KR-aggregation cron flips Objective stage to `completion_review` and emails consultant + BO.

---

## Hard Prerequisite (blocks sprint start)

Sprint 26 must close successfully:
- [ ] First Objective Created acceptance test passes (both Paths A + B)
- [ ] ActivationPlaybook locked
- [ ] Dispatchers 1-3 fully wired; dispatcher 4 send-side wired
- [ ] Sprint 26 acceptance criterion met

---

## Workstreams

### Workstream A — Extend the Playbook

ActivationPlaybook (from Sprint 26 Workstream A) gets extended to cover Stages 3 → 5. Same artifact, new sections.

For each remaining handoff: trigger, receiver, what they see, what fires, expected action, completion signal.

### Workstream B — Receive-side wiring + new dispatchers

| # | Trigger | Receiver | Email content | UI bridge target |
|---|---|---|---|---|
| 4 (receive) | Manager lands on planning-v2 with unplanned KR | Manager | n/a (already received email in S26) | First-time empty-state on `planning-v2.html` with "Generate behaviors + tasks" CTA primary |
| 4b | WeeklyGoal/Task assigned → Employee | Employee | Static template | First-time empty-state on `dashboard-v2.html` "today's tasks" |
| 5 | All KRs at 100% (KR-aggregation cron) | Consultant + BO | Static template | Workspace "Mark Sustained" CTA visibility on Objective row |
| 5b (optional) | Task completion → Manager | Manager | Static template (low frequency, batched) | Manager dashboard "team progress" section |

### Workstream C — KR-aggregation cron

Build `okrAggregationJob.js` per pattern of `dailyDigestJob.js`. Consumes:
- KR-aggregation formula documented in Sprint 25 PX-1.7 spike
- KeyResult auto-advance status (already in code per R1)
- `OKROutcome` model for outcome capture (already exists per R1)
- LifecycleTransitionService to flip Objective.lifecycle_stage to `completion_review`

Schedule: nightly (configurable via env var, similar to dailyDigestJob).

### Workstream D — Polish + verification

✅ **SEALED 2026-06-02** (A20260602-05 — composite-ship + verification, 5th consecutive SIMPLER-WAY zero-production-diff chunk):

- ✅ **D.1** Dashboard empty-state for new employees (today's tasks visibility) — shipped transitively via B.4b `renderEmptyState` 4-stage cascade at [dashboard-v2.js:459](../../../../client/pages/scripts/dashboard-v2.js#L459) (no-assessment → no-objective → no-plan → no-moves) + Today column UI tokens at [dashboard-v2.html](../../../../client/pages/dashboard-v2.html)
- ✅ **D.2** Planning page first-time empty-state for new managers — shipped via E.7 (A20260529-02) `#planning-v2-zero-kr-redirect` banner at [planning-v2.js:446](../../../../client/pages/scripts/planning-v2.js#L446)
- ✅ **D.3** Task-completion telemetry → KR/Objective progress propagation **verified statically**: Task.status='completed' → `taskSchema.post('save')` → `Goal.updateTaskMetrics` (rolls completion + auto-flips Goal.status) → KR.current_value remains MANUAL outcome metric write (canonical OKR design) → `keyResultSchema.pre('save')` auto-flips status='completed' when progress>=100 → PUT /api/key-results fires LTS Step C predicate → also driven nightly by Workstream C `runOkrAggregationPass`. Goal→KR.current_value gap captured as canonical, not missing seam.
- ⏸️ **D.4** Manager-visibility section on Manager dashboard — **deferred** to refinement-backlog as `RT-MANAGER-VISIBILITY-SECTION` per Q1 resolution. Managers already covered by B.4 + F.5 + F.6 + E.4 + consultant digest. Build only if post-Beta signal demands a dedicated roll-up widget.

Regression: NEW [scripts/test-sprint27-D-polish-and-telemetry-verification.js](../../../../scripts/test-sprint27-D-polish-and-telemetry-verification.js) **47/47 ✓** across 7 PARTs. Sibling sweep 144/144 ✓.

### Workstream E — Objective Creation Refinement (added 2026-05-27 /strategy #260)

**Scope source**: [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](OBJECTIVES_PAGE_STRATEGIC_INPUT.md) (RESOLVED 2026-05-27). All items pre-minted with audit IDs per `feedback_audit_governance`. Additive only — no deletions per user direction.

**Anchoring principle**: strategic shift from "company tracks coverage across 6 categories" → "individual objectives created by BO/consultant/manager, one at a time, with seamless multi-play handoff to Manager." All Workstream E items reinforce this shift.

**Cascade alignment**: new objectives use 4-level canonical (Objective → KR → Weekly Goal → Daily Task) per [CASCADE_MIGRATION_STATE.md](../../../2-TECHNICAL/CASCADE_MIGRATION_STATE.md). Legacy 5-level objectives preserved.

**REVISED 2026-05-28** per /strategy-mini convergence brainstorm (see [OBJECTIVES_PAGE_STRATEGIC_INPUT.md](OBJECTIVES_PAGE_STRATEGIC_INPUT.md) §Plan-Lock 2026-05-28). 3 user directions reshaped the spine: (a) **ONE wizard surface long-term** — reuse existing canonical `objective-wizard.html` via query-param branching, NOT build a new modal; (b) **objectives.html = sole creation surface for Objective+KR** — planning-v2.html becomes consume-only (no KR creation there); (c) **intent-first wizard for new "Add Objective"** — drop strategic-focus category picker, AI infers category from intent, editable downstream. Result: original E.1 modal-build REJECTED; original E.4 (Manager planning-v2 "Generate KRs" CTA) REJECTED in favor of objectives.html card state-CTAs; new E.6 (BE aggregation) + E.8 (B.4 destination change) added. 4 audit IDs minted 📝 PLAN at /strategy-mini: A20260528-02 / -03 / -04 / -05 (all ship as part of revised Workstream E).

| ID | Task | Pages/Files | Audit ID | Est | Deps |
|---|---|---|---|---|---|
| S27-E.0 | ✅ **SHIPPED 2026-05-29** — **UI consistency refactor (objectives.html → my-clients pattern)**. NEW [client/css/objectives.css](../../../../client/css/objectives.css) (~220 LoC, mirrors my-clients.css). 8 deltas on objectives.html: `<body class="obj-page">` + `<main class="obj-page-shell">` shell, page header row (h1 + subtitle + quarter pill), 4-card `.obj-kpi-grid`, navy `.obj-add-btn` CTA (var(--s22-navy)), Category Coverage demoted to collapsible `.obj-category-strip` (E.2 subsumption), restyled `.obj-filter-btn` (navy-active, no gradient), inline color → CSS variable token migration. All 24 JS hook IDs preserved. **Foundation for E.4** — card state-CTAs land in unified design. Test [scripts/test-sprint27-UI-consistency-objectives.js](../../../../scripts/test-sprint27-UI-consistency-objectives.js) **69/69 ✓**. | `client/pages/objectives.html` ✓ + NEW `client/css/objectives.css` ✓ | **A20260529-01** ✅ + A20260527-05 (subsumed) ✅ | ~3h ✓ | None — replaces inline Tailwind drift |
| S27-E.1a | **Restructure `objective-wizard.html` with query-param entry modes** — wizard becomes 3-mode surface: (1) `?source=team_ssi` or no query → legacy 3-step (category → intent → review) UNCHANGED for post-SSI flow; (2) `?creation_mode=individual` → NEW intent-first 3-step (intent + AI-refine + category-inferred → priority/timeline/owner/KR-mode → review); (3) `?objective_id=X&action=add_krs` → JUMP to Screen 3, load existing objective into session, AI generates KRs (consumed by E.4 card CTA + E.8 email handoff). All branches share rendering components per `feedback_extend_before_wrap`. **Critical**: timeline picker in Step 2 sends `time_period_type:'custom' + start_date=today (default) + duration_months` → closes A20260528-02 naturally (no more Jan-1 backfill). Owner dropdown required, gates `[Next]` button → FE-level enforcement of A20260527-01 + -28-03 contract. | `client/pages/objective-wizard.html`, `client/pages/scripts/objective-wizard.js`, `client/css/objective-wizard.css`, `server/routes/objective-wizard.js` (creation_mode + action=add_krs branches in initialize-session/finalize) | A20260527-04 + **A20260528-02 (subsumed)** | 3-4h | None — extends existing endpoints |
| S27-E.1b | **objectives.html "Add Objective" dropdown entry** → 2-option dropdown: "✨ Create new objective" → `/pages/objective-wizard.html?creation_mode=individual`; "📋 Quick add (form)" → existing manual modal (KEPT as additive fallback per locked principle; eventual post-Beta deprecation candidate measured against wizard usage). | `client/pages/objectives.html` (dropdown UI), `client/pages/scripts/objectives.js` (handler) | A20260527-04 | 30 min | E.1a |
| S27-E.1c | **Wizard add_krs mode** — handle `?objective_id=X&action=add_krs` query: load existing Objective into WizardSession via E.5 endpoint, skip Screens 1+2, render Screen 3 with AI-generated KRs ready for review. Save path = finalize-krs (extends finalize OR new endpoint — pick at /coding kickoff per minimal-change). Reused by both BO returning to add-later objectives AND Manager arriving via B.4 email CTA. | `client/pages/scripts/objective-wizard.js` (mode-branch logic) | A20260527-04 | 1-1.5h | E.1a, E.5 |
| S27-E.1d | **BE strict owner_id gate on `/api/objective-wizard/finalize`** — extends A20260527-01's pattern: `if (!objective.owner_id) return 400 'owner_id is required'` after category validation; drop `|| userId` fallback at [objective-wizard.js:895](../../../../server/routes/objective-wizard.js#L895). Aligns BOTH write paths (POST /api/objectives + wizard finalize) with single C.5 contract per A20260506-05. | `server/routes/objective-wizard.js` | **A20260528-03** | 30 min | None |
| S27-E.2 | ✅ **SHIPPED 2026-05-29** (subsumed by A20260529-01 UI consistency refactor) — Category Coverage widget demoted to collapsible `.obj-category-strip` (compact head + click-to-toggle body; smaller `.obj-category-chip` elements; progress bar fillers removed; gap recommendation banner preserved). `updateCategoryCoverage()` JS untouched + works via null-safe `if (barEl)` guard. | `client/pages/objectives.html` ✓ + NEW `client/css/objectives.css` ✓ | A20260527-05 ✅ + A20260529-01 ✅ | 30 min ✓ | — |
| S27-E.3 | ✅ **SHIPPED 2026-05-29** — Pre-edit recon: bulk "Generate OKRs" button was ALREADY deprecated since Sprint 8 (showGenerateOKRButton stub at team-ssi-view.js:1343 clears container). Residual fix: append `?source=team_ssi` to "Generate Objectives →" primary CTA href so E.1a query-param branching has an explicit signal. Test [test-sprint27-E.3-door5-bulk-deemphasis.js](../../../../scripts/test-sprint27-E.3-door5-bulk-deemphasis.js) **11/11 ✓**. | `client/pages/scripts/team-ssi-view.js:238` ✓ | **A20260527-06** ✅ | 30 min ✓ | — |
| S27-E.4 | ✅ **SHIPPED 2026-05-29** — NEW `ObjectiveCalculator.getObjectiveCardState(objective, currentUser, weeklyPlanCount)` pure helper (~140 LoC including JSDoc) + `sumWeeklyPlanCount` E.6 consumer; NEW `renderObjectiveCardActions(objective)` dumb-iterator at [objectives.js:560](../../../../client/pages/scripts/objectives.js#L560); NEW .obj-card-cta + variants in [objectives.css](../../../../client/css/objectives.css). 8-state matrix verified by [test-sprint27-E.4-objective-card-state.js](../../../../scripts/test-sprint27-E.4-objective-card-state.js) **69/69 ✓** including 5-role permission sweep + populated/raw owner_id shape handling + legacy fallback. ZERO role-hardcoding in renderer. | `client/pages/scripts/objective-calculator.js` ✓ + `client/pages/scripts/objectives.js` ✓ + `client/css/objectives.css` ✓ | **A20260527-07 ✅** (scope-flipped) + **A20260527-09 ✅** (merged) | 2.5h ✓ | E.6 ✓ (weekly_plan_summary shipped) |
| S27-E.5 | ✅ **SHIPPED 2026-05-29** — Extended POST /api/objective-wizard/generate-krs with optional `objective_id` parameter. Multi-tenant 404 filter + 400 KR_LIMIT_REACHED at 5-KR cap + `targetKrCount = min(4, 5 - existing)` headroom math + session overrides persisted (category/priority/objective_period) + DO-NOT-DUPLICATE exclude-list in LLM prompt + dynamic `${targetKrCount}` substitution. Legacy flow preserved (objective_id optional). Test [test-sprint27-E.5-generate-krs-objective-id.js](../../../../scripts/test-sprint27-E.5-generate-krs-objective-id.js) **42/42 ✓**. | `server/routes/objective-wizard.js:419-499` ✓ | **A20260527-08** ✅ | 1-1.5h ✓ | — |
| S27-E.6 | ✅ **SHIPPED 2026-05-29** — Extended `GET /api/objectives` with `weekly_plan_summary: {per_kr: {[kr_id]: count}}` field via single `WeeklyGoal.aggregate([$match company_id+key_result_id+status!=cancelled, $group key_result_id with $sum:1])`. Feeds E.4's `getObjectiveCardState` `has_plan` without FE fan-out. Test [scripts/test-sprint27-E.6-weekly-plan-summary.js](../../../../scripts/test-sprint27-E.6-weekly-plan-summary.js) **24/24 ✓**. | `server/routes/objectives.js:14 + 451-471` ✓ | **A20260528-05** ✅ | 1h ✓ | None |
| S27-E.7 | ✅ **SHIPPED 2026-05-29** — Empty-state at planning-v2.js:446 replaced with CTA-bearing banner: id="planning-v2-zero-kr-redirect", "No Key Results yet" headline + "Add KRs on the Objectives page first" body + "→ Go to Objectives" anchor → `/pages/objectives.html?focus=<id>`. Navy inline-styled CTA (no cross-page CSS coupling). Test [test-sprint27-E.7-planning-v2-zero-kr-redirect.js](../../../../scripts/test-sprint27-E.7-planning-v2-zero-kr-redirect.js) **22/22 ✓**. | `client/pages/scripts/planning-v2.js:446-470` ✓ | **A20260529-02** ✅ NEW (split from A20260527-07 at /strategy-mini 2026-05-28; primary delivery sealed at E.4) | 30 min ✓ | — |
| S27-E.8 | ✅ **SHIPPED 2026-05-29** — 5 surfaces: `LifecycleTransitionService.js:518-521` plan_link builder + line 448 docstring; `mailjetService.js:1031-1037` B.4 dispatcher inline comment; `EMAIL_DEEP_LINK_CONTRACT.md` row 4a (also corrected stale dashboard-v2.html reference); `ACTIVATION_PLAYBOOK.md` §B.4 + changelog (structured Original/Current block preserves historical context); `test-sprint26-B.4-objective-handoff.js` migrated. Coach CTA UNCHANGED. NEW test [test-sprint27-E.8-b4-dispatcher-destination.js](../../../../scripts/test-sprint27-E.8-b4-dispatcher-destination.js) **22/22 ✓** + migrated B.4 regression **65/65 ✓**. | LTS + mailjet + EMAIL_DEEP_LINK_CONTRACT + ACTIVATION_PLAYBOOK + B.4 test ✓ | **A20260528-04** ✅ | 30 min ✓ | None |
| S27-E.9 | **Workstream E regression test suite (revised)** — REPLACES original E.7 scope. NEW [scripts/test-sprint27-E-objective-creation-refinement.js](../../../../scripts/test-sprint27-E-objective-creation-refinement.js) covering: (1) wizard 3-mode entry per query-param branch + Step 2 timeline picker sends `custom + today` payload (E.1a + closes -28-02); (2) wizard add_krs mode skip-to-Screen-3 + AI fires (E.1c + E.5); (3) BE strict owner_id 400 on wizard finalize (-28-03 / E.1d); (4) `getObjectiveCardState` pure-function matrix — every combination of `kr_count × has_plan × canEdit × canDelete × objective.status` against expected CTAs + badges (E.4); (5) GET /api/objectives includes `weekly_plan_summary` field shape (E.6 / -28-05); (6) B.4 dispatcher CTA URL contains `/pages/objectives.html?focus=` not `/pages/planning-v2.html` (E.8 / -28-04); (7) planning-v2 0-KR empty-state DOM markers (E.7). Target ~80-100 assertions. | `scripts/test-sprint27-E-objective-creation-refinement.js` (NEW) | — | 2h | E.1*, E.4, E.5, E.6, E.7, E.8 |

**Revised Workstream E total**: ~13 hours = ~1.5 days. Saves ~3-4h vs original plan by reusing existing wizard surface via query-param branching instead of building parallel modal. **Lands before S27 close gate** per user direction.

**Parked from Workstream E** (per additive principle):
- Door #4 (industry-template wizard) retirement — left in place; measure post-Beta
- Door #6 (`/api/ai-okr/generate-single-objective`) retirement — left in place; measure post-Beta
- Quarterly Goal layer full retirement — post-Beta spike (see CASCADE_MIGRATION_STATE.md Q-A)
- WeeklyGoal collection cutover from UNION-READ — post-Beta spike (Q-B)
- Move layer (behavior-based, AI-generated) — post-Beta per Q-C

### Workstream F — Objective Completion Engine (added 2026-05-31 /audit #271; Phase 1 consumed from S26)

**Scope source**: [AUDIT_TRACKER.md /strategy 2026-05-30 comment](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) — "every objective that goes into the system has to be completed" user direction surfaced a 5-gap forward-chain analysis (Stages 0→1 / 1→2 / 2→3 / 3→4 / 4-overdue). Today only Stage 1 (Assessment-pending B.2 reminder cron) is covered; the other 4 stages are silent dead-ends.

**Anchoring principle**: persistent-nudge invariant added on top of the existing 5 one-shot handoffs in `ACTIVATION_PLAYBOOK.md`. Pattern verbatim from B.2 invitation reminder at [dailyDigestJob.js:155-280](../../../../server/jobs/dailyDigestJob.js#L155) — mirrored onto 3 new entities (Objective / WeeklyGoal / Task) per `feedback_extend_before_wrap`. Zero new collections; zero new abstractions; 3 additive optional fields per entity (`reminders_sent`, `last_reminder_at`, `reminder_exhausted_at`).

**Cadence locks** (user direction 2026-05-30):
- Objective-stall (Stage 2→3): 3 / 7 / 14 / 21 / 30 days — 5 tiers, tiers 3+4 cc Consultant, tier-5 exhausts owner-side, consultant digest indefinite
- WeeklyGoal-stall (Stage 3→4): 3 / 7 / 14 / 21 / 30 days — same shape
- Task-overdue (Stage 4): 1 / 3 / 7 / 14 / 21 days — same shape, tighter cadence

**Phase split**:
- **Phase 1** ✅ SHIPPED 2026-05-30 (during S26 close session) — playbook amendments + eligible-owners scope fix + LTS self-nudge variant + Objective-stall cron + consultant digest extension. Attributed to S26 firing-equivalent count.
- **Phase 2** 📝 MINT 2026-05-31 — WeeklyGoal-stall cron + Task-overdue cron + receive-side `<NextStep>` 3-variant hero + Re-delegation/Self-cancel CTAs. Ships in S27.
- **Phase 3** (S29 candidates, deferred) — Profile-stall (Stage 0→1) + Assessment→Objective-stall (Stage 1→2) + dedicated Needs-Attention surface + `Objective.owner_history[]` audit trail + Invitation reminder 3→5 tier migration. IDs `A20260530-07..-11` mint at S29 kickoff.

**Beta line**: Phases 1+2 must ship before S27 close = Beta unblock; Phase 3 acceptable to defer (consultant manual nudge covers gap during Beta).

| ID | Task | Pages/Files | Audit ID | Est | Deps |
|---|---|---|---|---|---|
| S27-F.1 | ✅ **SHIPPED 2026-05-30** (S26 close session) — **Playbook persistent-nudge invariant + eligible-owners scope fix + LTS self-nudge variant**. 4-part bundle: P1 Midfield ball-position relaxed from Manager-only to any `ALLOWED_OWNER_ROLES` holder (BO/EXEC/MANAGER); P2 Handoff #4 gains ext-receiver + author-owns variants; P3 re-delegation rules (BO/Manager/Consultant can assign/reassign owner_id; Employees cannot); P4 cancel rules (owner-or-above can self-cancel cascade entities; Employees self-cancel own Tasks only). Eligible-owners endpoint `$in:['MANAGER','EXECUTIVE']` + ROLE_RANK sort. LTS `if (!ownerIsAuthor)` skip removed; `?author_owns=true` CTA flag emitted for F.5 receive-side hero. mailjet `sendObjectiveHandoffEmail` gains `author_self_nudge` 2-option framing. | `ACTIVATION_PLAYBOOK.md` ✓ + `server/routes/teams.js:230-271` ✓ + `server/services/LifecycleTransitionService.js:507-545` ✓ + `server/services/mailjetService.js` (sendObjectiveHandoffEmail) ✓ | **A20260530-01** ✅ (consumed) | ~3h ✓ | None |
| S27-F.2 | ✅ **SHIPPED 2026-05-30** (S26 close session) — **Objective-stall persistent-nudge cron + consultant digest stall extension**. NEW `runObjectiveStallReminders()` in dailyDigestJob mirroring B.2 `runAssessmentReminders` verbatim. 5-tier 3/7/14/21/30 cadence; tiers 3+4 cc Consultant; tier-5 stamps `reminder_exhausted_at`. 4 surfaces: Objective model 3 additive fields + cron pass + 5-tier mailjet template (cohort-conditional one-liner) + B.5 `aggregateConsultantClientActivity` extended with 6th source (stallAgg → `needs_followup_count` → "Needs Your Follow-up" section). | `server/models/Objective.js:270-294` ✓ + `server/jobs/dailyDigestJob.js:509-731` ✓ + `server/services/mailjetService.js:1357-1500` ✓ + `server/jobs/dailyDigestJob.js:373-419` (B.5 agg ext) ✓ | **A20260530-02** ✅ (consumed) | ~5h ✓ | F.1 (playbook lock) |
| S27-F.3 | ✅ **SHIPPED 2026-05-31** — **WeeklyGoal-stall persistent-nudge cron (Stage 3→4)** — F.2 verbatim mirror onto WeeklyGoal. 3 additive optional fields ✓ ([WeeklyGoal.js:100-125](../../../../server/models/WeeklyGoal.js#L100)); `WEEKLYGOAL_STALL_CADENCE_DAYS=[3,7,14,21,30]` + helpers + `runWeeklyGoalStallReminders` ✓ wired into `runCronTick` ([dailyDigestJob.js](../../../../server/jobs/dailyDigestJob.js)); `sendWeeklyGoalStallReminder` + template ✓ ([mailjetService.js](../../../../server/services/mailjetService.js)); B.5 7th aggregator UNIONED into `needs_followup_count` ✓. Stall condition: `WeeklyGoal.status ∈ {not_started, in_progress} AND no Task under it (or all Tasks status='cancelled')`. Test [test-sprint27-F.3-weeklygoal-stall-cron.js](../../../../scripts/test-sprint27-F.3-weeklygoal-stall-cron.js) **40/40 ✓** + sibling sweep B.2/B.4/B.5/F.2 = **283/283 ✓** zero collateral. | `server/models/WeeklyGoal.js` ✓ + `server/jobs/dailyDigestJob.js` ✓ + `server/services/mailjetService.js` ✓ + NEW test ✓ | **A20260530-03** ✅ | ~2.5h ✓ | F.2 (pattern lock) |
| S27-F.4 | ✅ **SHIPPED 2026-05-31** — **Task-overdue persistent-nudge cron (Stage 4)** — F.2/F.3 mirror onto Task with tighter cadence 1/3/7/14/21. 3 additive optional fields ✓ ([Task.js:342-360](../../../../server/models/Task.js#L342)); `TASK_OVERDUE_CADENCE_DAYS=[1,3,7,14,21]` + helpers + `runTaskOverdueReminders` ✓ wired into `runCronTick`; `sendTaskOverdueReminder` + template with `TASK_OVERDUE_TIER_DAY_LABEL` ✓; B.5 8th aggregator UNIONED into `needs_followup_count` ✓. Overdue condition: `Task.status ∉ {completed, cancelled, deferred} AND due_date < (now - tier_days)`. Recipient = `Task.assigned_to` (execution owner) not `owner_id`. Test [test-sprint27-F.4-task-overdue-cron.js](../../../../scripts/test-sprint27-F.4-task-overdue-cron.js) **41/41 ✓** + sibling sweep B.2/B.4/B.5/F.2/F.3 = **283/283 ✓** zero collateral. | `server/models/Task.js` ✓ + `server/jobs/dailyDigestJob.js` ✓ + `server/services/mailjetService.js` ✓ + NEW test ✓ | **A20260530-04** ✅ | ~2.5h ✓ | F.3 (pattern lock) |
| S27-F.5 | **Receive-side `<NextStep>` 3-variant hero** — consumes `?author_owns=true` flag emitted by F.1's LTS dispatcher. 3 variants: (a) Manager-external (owner ≠ author; current default — "Plan it now"); (b) author-owns (owner === author; "Invite Manager / Plan it yourself" 2-option); (c) re-delegated-to-me (owner re-assigned mid-flight per F.1 P3 rules; "You're now responsible for…" framing). FE-only — no new BE endpoints. | `client/pages/objectives.html` + `client/pages/scripts/objectives.js` (LOCKED 2026-05-31 /audit-review — receive-side hero lands on objectives.html?focus=`<id>`&source=email per [ACTIVATION_PLAYBOOK.md:65](../../../1-PRODUCT/ACTIVATION_PLAYBOOK.md#L65) Handoff #4 + E.8 ship A20260528-04 destination migration), NEW `scripts/test-sprint27-F.5-nextstep-hero-variants.js` | **A20260530-05** 📝 | ~2h | F.1 (author_owns flag shipped) |
| S27-F.6 | **Re-delegation CTA + Self-cancel CTA** — owner-or-above can reassign `owner_id` to any user on `/eligible-owners` list (already expanded in F.1); Employees can self-cancel own Tasks only. NEW PATCH `/api/objectives/:id/reassign-owner` (BO/MANAGER/EXECUTIVE/CONSULTANT gated) + PATCH `/api/tasks/:id/cancel` (owner-or-above per cascade entity per F.1 P4 rules). FE CTAs render conditionally based on currentUser role + entity owner_id. | `server/routes/objectives.js` (reassign endpoint), `server/routes/tasks.js` (extend if needed), `client/pages/scripts/objectives.js` + `planning-v2.js` + `dashboard-v2.js` (CTA renderers), NEW `scripts/test-sprint27-F.6-redelegation-and-cancel.js` | **A20260530-06** 📝 | ~2-3h | F.1 (playbook rules shipped) |

**Workstream F totals**: Phase 1 ~8h ✅ (consumed; not counted in S27 firing math). Phase 2 ~8.5-10h = ~1 day across 3 coding chunks.

**Recommended chunking** (per `feedback_minimal_change_grounding`; avoid mid-flight compaction):
- **Chunk 1** (today): F.3 + F.4 — mechanical mirror of F.2. Same model-field pattern, same cron-section pattern, same template pattern. Highly mechanical; canonical seam already proven. ~4-5h together.
- **Chunk 2**: F.5 — receive-side hero, FE-only, consumes shipped flag.
- **Chunk 3**: F.6 — re-delegation + self-cancel; new endpoints + UI.

**Memory rules driving Workstream F**: `feedback_extend_before_wrap` (B.2 invitation reminder pattern mirrored verbatim onto 3 entities — no new service); `feedback_reuse_max` (existing `notifyTransition()` + `mailjetService` + `cohortDetection` + cron-tick scheduler consumed across all dispatchers); `feedback_minimal_change_grounding` (3 additive optional fields per entity zero migration impact; ~5h Phase 2 split into 3 chunks); `feedback_no_destructive_without_greenlight` (4 open Qs walked + locked with user pre-mint: cadences + 5-tier exhaustion + self-cancel auth scope + re-delegation cohort); `feedback_quote_the_canon` (B.2 cron `dueReminderTier` + `getReminderEligibleInvitations` + `sendReminderForInvitation` + `runAssessmentReminders` patterns will be cited verbatim in F.3/F.4 new functions); `feedback_read_helper_before_consuming` (F.2 helper logic read verbatim before mirroring; same discipline for F.3/F.4); `feedback_audit_governance` (6 IDs minted across 2 phases — 3-places-atomic mint discipline preserved at each phase boundary).

**Parked from Workstream F** (per Phase 3 backlog):
- Profile-stall (Stage 0→1) reminder cron — A20260530-07 mint at S29
- Assessment→Objective-stall (Stage 1→2) reminder cron — A20260530-08 mint at S29
- Dedicated "Needs Attention" surface (cross-entity stall aggregator UI) — A20260530-09 mint at S29
- `Objective.owner_history[]` audit trail for re-delegation chain — A20260530-10 mint at S29
- Invitation reminder migration 3→5 tier for consistency with new pattern — A20260530-11 mint at S29

---

## Acceptance Test (the 5 verbs continued)

From the Sprint 26 end-state (first Objective saved with KRs, Manager email-notified):

| Verb | Action |
|---|---|
| **Plan** | Manager logs in, lands on planning, sees clear path, generates behaviors + tasks via Stage 4 LLM, assigns to Employee, saves |
| **Notify** | Employee receives email |
| **Execute** | Employee logs in, lands on dashboard, sees today's task |
| **Complete** | Employee marks task complete |
| **Aggregate** | Telemetry fires; progress propagates; if first KR completed, observe progression |

If all 5 succeed without out-of-band intervention, Sprint 27 is done. **The full activation + execution journey works.**

---

## What Sprint 27 explicitly does NOT do

- ❌ Does NOT change Stage 4 LLM prompts (refinement track)
- ❌ Does NOT introduce Behavior Persistence β (`Move.behavior_id`)
- ❌ Does NOT implement Hybrid Behavior Classification
- ❌ Does NOT change the notification architecture (Sprint 25 wired `notifyTransition()` helper; Sprint 26 + Sprint 27 add transition emails on top — no event-bus / listener-registry per Cross-sprint audit 2026-05-06, Group 2a)
- ❌ Does NOT add new model fields beyond what cron + aggregation requires
- ❌ Does NOT touch iBrain integration

---

## Architectural Invariants

- [ ] All transition emails fire via inline `notifyTransition()` helper (Sprint 25 PX-2.2) — no event-bus / listener-registry. Manual nudges and auto-fires reuse the same template per transition. *(Cross-sprint audit 2026-05-06, Group 2a.)*
- [ ] All cross-sprint email deep-links conform to `EMAIL_DEEP_LINK_CONTRACT.md` (Sprint 25 deliverable, Group 2b) — receive-side handlers in Sprint 27 read URL params per the spec
- [ ] LifecycleTransitionService sole writer of `Objective.lifecycle_stage` (mirrors `StageTransitionService` pattern; idempotency via Mongo from-stage filter — no new contract per Group 7)
- [ ] KR-aggregation formula matches PX-1.7 spike output (single-source-of-truth aggregation)
- [ ] Cron job follows `dailyDigestJob.js` pattern (same logger, same env-gating, same fail-mode); consultant lifecycle digest extends this same job per Group 5a
- [ ] Prompt regression fixture suite (Sprint 25 deliverable, Group 8b) GREEN before Sprint 27 close — required for Beta launch gate
- [ ] No new role-check sites outside phase3-3 lint allow-list

---

## Risks

- **R1**: KR-aggregation formula has edge cases not surfaced in PX-1.7 spike (e.g., cancelled KRs, target=0, baseline=target). Mitigation: spike output includes edge-case enumeration; tests cover.
- **R2**: First-time empty-states on planning/dashboard duplicate existing empty-state patterns from S22a/S23. Mitigation: refactor common pattern into shared component (similar to S24 component CSS pattern).
- **R3**: Email frequency for "task completed" notifications becomes spam. Mitigation: batch + opt-out preference field on User; default OFF for high-frequency events.

---

## Open Questions (resolve at sprint kickoff)

1. **Manager visibility scope**: per-task completion email, or daily/weekly digest, or just dashboard widget?
2. **KR-aggregation cron schedule**: nightly? Hourly? Both (with different aggregation depth)?
3. **"Mark Sustained" surface**: workspace tab button only, or also Objectives page entry?
4. **Task-completion telemetry**: confirm S22a Phase 3 telemetry pattern still active; confirm receiver pipeline ready for Sprint 27 events.

---

## Beta Launch Connection

Sprint 27 close = full activation + execution journey works = **natural Beta gate**.

Before Sprint 27 ships, Beta would launch with broken execution. After Sprint 27 ships, real paid users can complete the full first-objective + first-task cycle. This is the user-observable threshold for "Beta-ready".

(Sprint 27 close does NOT auto-trigger Beta launch — that's a separate `/deploy` decision. But Sprint 27 makes Beta launch *possible*.)

---

## Sign-off

Sprint 27 created 2026-05-06 as the second user-value-anchored sprint after the four-pass audit. Theme: **First Task Completed**. Closes the execution half of the activation journey.

**Prior sprint**: [`SPRINT-26-First-Objective/`](../SPRINT-26-First-Objective/)
**Following**: Refinement track ([`REFINEMENT-BACKLOG/`](../REFINEMENT-BACKLOG/)) and Beta launch decisioning
