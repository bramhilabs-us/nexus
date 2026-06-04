# End-to-End Journey Gap Report — 2026-05-08

<!-- @GENOME T3-TST-JOURNEY-001 | ACTIVE | 2026-05-08 | parent:T0-SES-001 | auto:- | linked:/coding,/audit -->

**Run by**: API/curl, against `https://karvia-business-1.onrender.com` (DB `karvia_business_preprod`)
**Personas**: Consultant `rsm@karvia.ai` · BO `stringsounds@gmail.com` · Manager `sagar@culturaldiscipline.com`
**Purpose**: Pre-Sprint-25 baseline — drive consultant→client→assessment→objective→plan→task end-to-end, log every gap.
**Verdict**: Journey **completes** with workarounds. **30 gaps surfaced** — all map cleanly to Sprint 25 (plumbing), Sprint 26 (First Objective + emails), or Sprint 27 (First Task + KR aggregation).

---

## Run summary

| Step | Outcome | Notes |
|---|---|---|
| 1. Consultant signup `POST /api/auth/signup` | ✅ | rsm@karvia.ai, role CONSULTANT |
| 2. Add client `POST /api/consultant/clients` | ✅ | Stringsounds Inc + auto-invite email to BO (✉️ #1) |
| 3. Send assessment `POST /api/invitations/create` | ✅ | 2 invites sent to BO + Manager (✉️ #2, #3) |
| 4a. BO accepts invitation | ✅ | account created |
| 4b. Manager accepts invitation | ✅ | account created |
| 4c. BO starts assessment | ❌→✅ | Blocked by Gap #6 (`is_active=false`); patched, then succeeded |
| 4d. Manager starts assessment | ✅ | (after patch) |
| 4e. BO + Manager submit | ✅ | BO 7.12, Manager 5.15 (per `my-assessments`); diverges in consultant view (Gap #7) |
| 5. Client view results | ✅ | Two scoring responses returned (Gap #7) |
| 6. Consultant view results | ✅ | Both respondents visible; team aggregate computed |
| 7. BO creates objective | ✅ | 3 KRs embedded AND in standalone collection (Gap #14, #23) |
| 8a. Quarterly goal | ❌→✅ | Validation rejected `quarter:3` (needed `"Q3"`), required `week`+`due_date`+`owner_id` (Gap #20) |
| 8b. Weekly goal | ❌→✅ | Required `title` not `name` (Gap #21); failed with embedded KR id, succeeded with standalone (Gap #23) |
| 9a. Task create + assign to Manager | ✅ | |
| 9b. Manager completes task | ✅ | Goal cascade works |
| 9c. Cascade verification | ⚠️ | Goal-level OK, KR/Objective/Company **all stuck** (Gap #27, #28, #29) |
| Email transitions | ⚠️ | 3 emails fired (all invitation-type). 0 transition emails (assessment-complete, objective-created, goal-assigned, task-completed) |

---

## Gap catalog (30 findings)

### A. Seed/data integrity — Sprint 25 plumbing

| # | Severity | Gap | Sprint mapping |
|---|---|---|---|
| 1 | 🔴 High | `server/config/ssi-questions-library.json` is pre-MECE. 146/178 (82%) fail Mongoose enum validation: categories like `execution_velocity`, `customer_insights`, `knowledge_sharing`, `learning_culture` are NOT in the 12-block enum. Only 32 seeded successfully via `seed:questions`. | **S25** — retire pre-MECE seed source OR migrate JSON to MECE categories |
| 2 | 🟡 Med | `assessment_templates` collection accumulates user-created garbage with dead FKs and is never cleaned. Pre-wipe held 83 templates with names like `"asd"`, `"terf"`, `"rt5"` — all `business_id`/`created_by` pointing to deleted users. | **S25** — add cleanup hook on user delete; orphan cleanup task |
| 3 | 🔴 High | `seed-default-templates.js` hard-references 47 question IDs (e.g., `S40`, `IN50`) that don't exist post-MECE. Filters them out, then fails: "Template must have at least 10 questions". Seeder is broken-as-shipped. | **S25** — replace with MECE-aware seeder, or retire entirely (`seed:mece` is canonical) |
| 4 | 🟡 Med | Invitation email links use `https://karvia-business-preprod.onrender.com/...` even when API is hit at `karvia-business-1.onrender.com`. Cross-env link bleed — base URL is hard-set to preprod. | **S25** — `EMAIL_DEEP_LINK_CONTRACT.md` (Group 2b) must define env-aware base URL |
| 6 | 🔴 **Blocker** | `seedMECEQuestions.js` does not set `is_active: true`. `/api/assessments/start` filters on `is_active: true` → 0/50 questions match → assessment cannot start. **Hard journey blocker without DB patch.** | **S25** — fix MECE seeder to default `is_active:true` on all rows |

### B. Schema fragmentation — Sprint 25 Cascade Phase B + C (PX-3.x)

| # | Severity | Gap | Sprint mapping |
|---|---|---|---|
| 14 | 🔴 High | `POST /api/objectives` writes BOTH `objectives.key_results[]` (embedded) AND `keyresults` (standalone) collection, with **different `_id` values for the same KR**. | **S25 PX-3.6, PX-3.18** (drop embedded write + drop schema field) |
| 23 | 🔴 **Blocker** | API responses surface embedded KR `_id`s, but `POST /api/weekly-goals` queries standalone `keyresults`. ID mismatch → "Key result not found" until consumer manually swaps in standalone ID. | **S25 PX-3.6** (single source of truth) |
| 25 | 🔴 High | TWO collections coexist for goals with **completely different schemas**: `goals` (QUARTERLY, has `objective_id`, `parent_goal_id`, `quarter`, `year`, `week`, `due_date`) vs `weeklygoals` (WEEKLY, has `title`, `frequency`, `completions`, NO objective/parent linkage). | **S25 PX-3.7, PX-3.8, PX-3.14, PX-3.15, PX-3.16** (cascade consolidation — confirms whole thesis) |
| 5 | 🟡 Med | Assessment endpoint sprawl: 4+ submit paths (`/submit`, `/:id/submit-responses`, `/:id/submit-anonymous`, `/calculate`), 3+ questions paths (`/questions`, `/invitation/:token/questions`, `/:id/questions-anonymous`), 2 questions collections (`assessment_questions` + `assessmentquestions`). | **S25** — endpoint dedupe + collection consolidation |
| 21 | 🟡 Med | Field naming inconsistency on sibling endpoints: `POST /api/goals/quarterly` requires `name`; `POST /api/weekly-goals` requires `title`. | **S25** — pick one name, fix the other |

### C. Validation gaps — Sprint 25/26 plumbing

| # | Severity | Gap | Sprint mapping |
|---|---|---|---|
| 20 | 🟡 Med | `Goal` model: `quarter` is `String` enum `'Q1'..'Q4'` but route doesn't translate from numeric input; `due_date` required but not derived from `quarter+year`; `week` is **unconditionally required** even on QUARTERLY goals; `owner_id` required but not auto-set from JWT. | **S25** — route normalization layer; conditional `required` on `week` |
| 8 | 🟡 Med | `decisions` block in template has `question_count: 0` — MECE coverage gap in the seeded "Home Services" template. | **S25** — template completeness validator |

### D. Scoring divergence — Sprint 25 plumbing

| # | Severity | Gap | Sprint mapping |
|---|---|---|---|
| 7 | 🔴 **High (trust)** | Same submission, different scores in different views: `/api/assessments/my-assessments` returns composite **7.12** (speed 6.69, strength 7.35, intel 7.35); `/api/consultant/clients/:id/assessments` returns overall **5.9** (speed 7, strength 4.5, intel 6.1). Two pipelines, divergent outputs. | **S25 PX-4.x** — scoring service consolidation candidate |
| 12 | 🟡 Med | Same payload from `/api/assessments/team/:id` returns BOTH `team_dimension_scores` (5.92/6.26/6.23 → 6.13) AND `weighted_team_scores` (5.66/5.9/5.86 → 5.81). Three numbers for one team. | **S25** — pick one team-aggregation rule |

### E. Cascade gaps — Sprint 25 + Sprint 27

| # | Severity | Gap | Sprint mapping |
|---|---|---|---|
| 9 | 🔴 High | After 2 completed assessments, `Company.assessment_scores` stays `{0,0,0, getting_started}`. No company-level rollup. | **S25** — assessment→company cascade |
| 10 | 🔴 High | `Company.onboarding_progress.assessment_completed` stays `false` after 2 completed assessments. | **S25** — onboarding state machine |
| 11 | 🔴 **High** | `Company.stage` stays `prospect` despite assessments + objective + goals + completed task. `LifecycleTransitionService`/`StageTransitionService` are NOT invoked on any of these events. | **S25 PX-2.2** (`notifyTransition()`) — **and** entry-point wiring missing entirely |
| 17 | 🟡 Low | `Company.okr_generation.generated` stays `false` after manual objective creation. (May be by design — only AI-generated should flip.) | **S25** — clarify intent + document |
| 18 | 🔴 High | `Company.onboarding_progress.first_objective_created` stays `false` after objective creation. | **S25** — onboarding state machine |
| 19 | 🔴 High | `Company.onboarding_progress.first_goals_assigned` stays `false` after quarterly + weekly goals exist. | **S25** — onboarding state machine |
| 26 | 🟢 OK | Goal-level cascade WORKS: task complete → `goal.status='completed'`, `current_value` bumps `70→80`, `metrics.completed_tasks=1`, `completion_rate=100`. | (no action — passes) |
| 27 | 🔴 **Blocker for S27** | NO cascade Goal → KR → Objective. After goal completes, `KR.current_value` stays 70, `KR.status` stays `'not_started'`, `KR.progress_percentage` undefined. `Objective.key_results_completion` undefined. | **S27** — KR aggregation formula (handoff item from S25) |
| 28 | 🔴 High | Manual objective creation doesn't tick onboarding flag. (Same root as #18.) | **S25** |
| 29 | 🔴 High | Goal creation doesn't tick onboarding flag. (Same root as #19.) | **S25** |

### F. Email coverage — Sprint 26 Workstream B

| # | Severity | Gap | Sprint mapping |
|---|---|---|---|
| 13 | 🟡 Med (expected) | NO email on assessment completion. | **S26 Workstream B** (post-assessment email — Group 4a, persona-conditional one-liner) |
| 15 | 🟡 Med (expected) | NO email on objective creation. | **S26 Workstream B** (Group 3b — manager auto-email when BO assigns `owner_id`) |
| 16 | 🟢 Note | Consultant cannot author objective directly (only BO can). Per Group 3a, this is the **intended** rewording — consultant initiates/monitors/nudges, deep-links to BO wizard. Logging that today's surface is a plain BO-only POST with no consultant initiation seam. | **S26 Workstream C** |
| 30 | 🟡 Med | NO email on: goal-assigned, task-assigned, task-completed, stage-transition. | **S26 Workstream B** + future |

### Working email paths today (positive findings)

| ✉️ | Path | Status |
|---|---|---|
| #1 | Auto-invite-on-client-add (`POST /api/consultant/clients` → BO email) | ✅ Sprint 22a/24 wiring |
| #2 | `POST /api/invitations/create` → BO assessment invitation | ✅ |
| #3 | `POST /api/invitations/create` → Manager assessment invitation | ✅ |

All three flowed through Mailjet (`mail_sent: true, mail_mock: false`). Confirms email infra is healthy; only the **transition-emit** path is unbuilt.

---

## Sprint mapping summary

| Sprint | Gaps it should resolve | Confidence |
|---|---|---|
| **Sprint 25 — Plumbing** | #1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #14, #17, #18, #19, #20, #21, #23, #25, #28, #29 | Very High — these ARE the planned Phase 1-3 tasks (PX-1.x, PX-2.2, PX-3.x) |
| **Sprint 26 — First Objective** | #13, #15, #16, #30 | Very High — Workstream B (4 transition emails) + Workstream C (consultant initiation seam) |
| **Sprint 27 — First Task** | #27 (KR aggregation) | High — explicitly carried forward as "KR-aggregation formula spike output" |
| Already working today | 26 (goal-level cascade), email infra (3 invites fired) | — |

**Net**: nothing surfaced in this run is OUTSIDE the planned S25/S26/S27 scope. Sprint plans are well-targeted at real defects.

---

## Recommended additions to Sprint 25 task list

Items that aren't in the current S25 master plan but should be:

1. **PX-NEW-1**: MECE seeder `is_active: true` default fix (Gap #6 — current seeder ships latent journey blocker)
2. **PX-NEW-2**: Migrate or retire `ssi-questions-library.json` (Gap #1 — 82% unseedable today)
3. **PX-NEW-3**: Field-name unify on goals routes (`name` vs `title`) (Gap #21)
4. **PX-NEW-4**: Goal model `week` conditional `required` based on `time_period` (Gap #20)
5. **PX-NEW-5**: Onboarding state machine — wire `Company.onboarding_progress` ticks on assessment-complete / objective-create / goal-create (Gaps #10, #18, #19, #28, #29)
6. **PX-NEW-6**: `assessment_templates` orphan cleanup on user/company delete (Gap #2)

---

## Test artifacts

- DB state captured in `karvia_business_preprod` as of 2026-05-08T19:43Z
- Personas live for re-run; passwords:
  - rsm@karvia.ai → `JourneyTest2026!`
  - stringsounds@gmail.com → `ClientTest2026!`
  - sagar@culturaldiscipline.com → `ManagerTest2026!`
- Wipe + reseed scripts: `scripts/db/wipe-dev-preserve-templates.js`, `npm run seed:mece`
- 3 real Mailjet emails went to live addresses 19:34Z–19:35Z

---

## Recommended next session

`/strategy` — fold the 6 PX-NEW items above into Sprint 25 master plan; assign audit IDs (e.g., `A20260508-01..06`); confirm whether to launch S25 with this expanded scope or punt the new items to S25-extra.
