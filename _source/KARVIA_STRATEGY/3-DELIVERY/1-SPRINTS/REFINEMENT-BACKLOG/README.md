# Refinement Backlog

<!-- @GENOME T3-DELIVERY-REFINEMENT-BACKLOG | ACTIVE | 2026-05-30 | parent:T1-PRD-002 | auto:- | linked:/strategy -->

**Purpose**: Hold drafted-but-deferred epic specs that don't fit the current "Stitch then Refine" sprint structure. Items here are real product work scheduled for the **refinement track** — sprints that run **after** Sprint 27 closes (i.e., after the activation + execution journey is stitched end-to-end).

**Created**: 2026-05-06 during Sprint 25/26/27 replanning
**Last reorganized**: 2026-05-11 Sprint 25 PX-5.4 (Day 12 #228) — split into must-before-Beta / nice-after-Beta classification.

---

## Classification (PX-5.4 — Sprint 25 mandatory sprint-close deliverable)

Every item below is classified on a single axis: **does this block Beta-1 launch?** If yes → must-before-Beta. If no → nice-after-Beta. The classification gives planning sessions a one-glance filter: scan must-before-Beta first when scheduling work between now and Beta launch; scan nice-after-Beta when planning the refinement track after Sprint 27.

When adding a new item: place it in the right bucket at the same time. Don't park an item without classifying.

### 🔴 Must-before-Beta

> **Empty as of 2026-05-11.**
>
> No current refinement-backlog item gates Beta-1 launch. This is meaningful signal — the Beta-launch path is unblocked by anything in this folder; the remaining work lives in Sprint 26 (First Objective) + Sprint 27 (First Task) master plans, not here.
>
> If a future audit or telemetry signal surfaces a must-before-Beta item, slot it here with an explicit gate-rationale ("blocks <user journey / cohort / KPI>") and link the source audit / incident.

### 🟢 Nice-after-Beta

All 12 current items classify as nice-after-Beta (post-Sprint-27 refinement track, post-Beta-1 polish, or feature-owning-sprint in-scope work). Grouped by sub-bucket for navigation:

**Sub-bucket A — Refinement-track epic drafts** (own slot in the refinement track):
| ID | Title | Rationale |
|---|---|---|
| 25-3 | Owner-side `objectives.html` redesign | Polish work; doesn't move the activation/execution ball |
| 25-4 | Display-labels owner-mapping completion | Label presentation, not flow |
| 25-5 | Behavior Persistence + KR-Level Promotion (full β) | γ-lite ships in S24 — full β is refinement quality |
| AI tone consistency / LLM_TONE_GUIDE.md | Prompt-tone consistency; re-eval at behavior-taxonomy lock |
| Cross-codebase field-write symmetry audit | Refinement-track auditing pattern; unlocks single-sweep dual-write-drop |
| PX-2.7 retire `ssi-questions-library.json` | Pure deletion of dormant seed; no Beta path reads this JSON. **Locked to S29 per user direction 2026-05-30** (S26-D.3 carryover; S26 functionally sealed). |
| Q12 canonical-rollup contract — full wiring | Today single-Assessment overwrite + 1 trigger; canonical = latest-per-PERSON + role-weighted + 4 triggers (A20260512-11). **Display-layer slice carved out 2026-05-12 (A20260512-14)** — Team Results endpoint now de-dups to latest-per-user; remaining Q12 work = role-weighted rollup + role-change/delete triggers. |
| RT-AUTH-SPLIT | Carve user-resource endpoints out of `server/routes/auth.js` into new `server/routes/users.js` | `auth.js` currently conflates two concerns: authentication (login/logout/reset/validate — pre-auth or token-bound) and user-resource management (`/me`, `/me/onboarding`, `/me/preferences`, `/users`, `/switch-company` — all `authMiddleware`-gated). Surfaced 2026-05-14 during S26 B.5 implementation: page matrix referenced `server/routes/users.js` which has never existed. **Risks today**: (a) auth.js bloat (~700 LoC, grows with every new /me/* feature); (b) non-RESTful `/api/auth/users` listing endpoint; (c) latent-security smell — mixing pre-auth handlers with auth-required handlers in one file makes copy-paste mistakes more likely (an unprotected handler could land alongside the protected ones). **Not critical today** — every existing user-resource endpoint IS properly middleware-gated; the smell is structural, not active. **Scope when picked up**: rename + re-mount, keep `/api/auth/me/*` URL aliases for backward compat for ≥1 Beta, update FE call sites in a follow-up slice. Owning sprint: refinement track post-S27. Cheap mitigation today: header comment block on auth.js flagging "all /me/* and /users/* require authMiddleware" — apply alongside this item or as a separate 10-min slice. |
| RT-SEND-ASSESSMENT-PERSISTENCE | Persist "Send Assessment" CTA on My Clients tile until SSI score exists (not just until stage moves off `prospect`) | Detailed entry under [Sprint 29 candidates (added 2026-05-29)](#sprint-29-candidates-added-2026-05-29). **Locked to S29** per user direction 2026-05-29. |
| RT-DEFAULT-TEAM-BO-MEMBERSHIP | Auto-add Business Owner (primary_contact) to default team on invitation accept | Detailed entry under [Sprint 29 candidates (added 2026-05-29)](#sprint-29-candidates-added-2026-05-29). **Locked to S29** per user direction 2026-05-29. |
| RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG | Consultant client-workspace Objectives tab shows full progress bar when objective is freshly identified (no plan yet) | ✅ **SHIPPED 2026-06-02** via Session A bundle-fix. Root cause was NOT a sparse BE `kr_rollup` shape (the BE was correctly zero-filling all 5 fields per [consultant.js:1010-1015](../../../../server/routes/consultant.js#L1010-L1015)) but the canonical `KarviaCommon.escapeHtml(0)` returning `""` due to `if (!text) return ''` swallowing zero. The cascade: blank `% progress`, blank at_risk/behind counts, and `style="width:%"` invalid CSS → browser fallback to container width → appearance of "fully red bar at 100%". One-line fix at [client/js/common.js:282](../../../../client/js/common.js#L282): `text === null \|\| text === undefined` + NaN/Infinity guard. 10/10 unit tests pass. Benefits every consumer that calls through `KarviaCommon.escapeHtml`. See new `RT-ESCAPE-HTML-DUPLICATES` for the 9 file-local helpers that still need the same patch. |
| RT-CONSULTANT-TEAMS-TAB-BUGS | Consultant client-workspace Teams tab shows blank manager/member-count + AVG SSI contradicts Assessment Completion KPI | Detailed entry under [Sprint 29 candidates (added 2026-05-29)](#sprint-29-candidates-added-2026-05-29). **Locked to S29** per user direction 2026-05-29. |
| RT-CONSULTANT-NUDGE-ACTION-LAYER | Consultant cockpit nudge-action layer — manual "send reminder" CTA to BO/Manager from My Clients tile or client-workspace, distinct from the auto-cron stall reminders shipped by Workstream B + Phase 1 Completion Engine | Detailed entry under [Sprint 29 candidates (added 2026-05-30)](#sprint-29-candidates-added-2026-05-30-s26-carryover). **Locked to S29** per user direction 2026-05-30 (S26-C.1b carryover; S26 functionally sealed). |
| RT-PER-INVITEE-PROGRESS-WIDGET | Per-invitee SSI progress widget on My Clients tile + team-ssi-view deep view (Q4 resolved 2026-05-12: both surfaces) | Detailed entry under [Sprint 29 candidates (added 2026-05-30)](#sprint-29-candidates-added-2026-05-30-s26-carryover). **Locked to S29** per user direction 2026-05-30 (S26-C.4 carryover; S26 functionally sealed). |
| RT-KR-REGEN-STANDALONE-FE-WIREUP | FE wire-up for KR regen on standalone Objectives page (PX-2.5) — **likely moot** after S27 E.5 + E.1c shipped wizard `?objective_id=X&action=add_krs` mode | Detailed entry under [Sprint 29 candidates (added 2026-05-30)](#sprint-29-candidates-added-2026-05-30-s26-carryover). **Locked to S29 verify-and-likely-close** per user direction 2026-05-30 (S26-D.2 carryover). |
| RT-TEAMS-INTENT-ADD-MANAGER | `teams.html` should auto-open the "add Manager" modal when arrived via `?intent=add_manager&objective_id=<id>` URL | F.5 Variant B emits this URL on the "Invite a Manager" CTA ([objective-calculator.js:740](../../../client/pages/scripts/objective-calculator.js#L740)); teams.html currently no-ops the param and just renders the page. Today's behavior is acceptable for Beta — the user lands on the Teams page and adds a Manager manually — but the wire-up would close the deep-link loop. **Scope when picked up**: parse `?intent=add_manager` in teams.js init, auto-open the existing add-member modal pre-filtered to `role=MANAGER` if found; optionally chain back to objectives.html?focus=<id> after success. Locked at /coding kickoff 2026-06-02 (D2=defer) per `feedback_minimal_change_grounding` — F.5 atomic chunk shipped without it. Owning sprint: refinement track post-S27. |
| RT-MANAGER-VISIBILITY-SECTION | Dedicated Manager-visibility section on the Manager dashboard (team-wide tasks roll-up + objectives-I-own-but-someone-on-my-team-executes view) | S27 Workstream D listed D.4 as "Optional: Manager-visibility section on Manager dashboard" (master plan §82). At /coding Chunk 7 grounding (2026-06-02), the gap was confirmed but the *necessity* for Beta-1 was rejected. Managers ALREADY have visibility through: (a) B.4 per-task email dispatcher → `objectives.html?focus=<id>` deep-link (E.8 A20260528-04); (b) F.5 receive-side `<NextStep>` hero variants A (act-as-receiver) + C (reassigned-to-me) at [objectives.js](../../../client/pages/scripts/objectives.js); (c) F.6 re-delegation + self-cancel CTAs (A20260530-06); (d) E.4 8-state matrix card CTAs render role-aware actions on every Objective card; (e) consultant digest aggregates stalls across all 5 cron tiers (F.2/F.3/F.4) — Manager-owned stalls flow up to Consultant naturally. Gap: there's no single Manager-scoped *roll-up dashboard widget* showing "my team's tasks today" alongside the Manager's own tasks. **Scope when picked up**: design pass first (widget placement on dashboard-v2.html for MANAGER role, KPI shape, FE component pattern); BE likely reuses existing `/api/dashboard-summary` endpoint with a role-aware roll-up query. Locked at /coding Chunk 7 (2026-06-02, A20260602-05 / Q1 resolution) per `feedback_minimal_change_grounding` + `feedback_state_parsimony` — build only if post-Beta signal (telemetry or user feedback) demands a dedicated roll-up surface. Owning sprint: refinement track post-S27 (likely S29 or later, post-Beta-1 if signal demands). |
| RT-OBJECTIVES-CARD-REASSIGN-DUPLICATE | Remove duplicate "Reassign owner" text button from objective-card CTA row on `objectives.html` | ✅ **SHIPPED 2026-06-02** via Session A bundle-fix (merged with RT-OBJECTIVES-REASSIGN-OWNER-LOADER-BUG — see that row for full detail). |
| RT-OBJECTIVES-REASSIGN-OWNER-LOADER-BUG | Clicking owner avatar on objective card fails to load eligible owners — toast `"Failed to load team members"` + `"No eligible owners available to reassign to"` | ✅ **SHIPPED 2026-06-02** via Session A bundle-fix (merged with RT-OBJECTIVES-CARD-REASSIGN-DUPLICATE). Impact analysis surfaced that the text-button and avatar called DIFFERENT endpoints (`/api/teams/eligible-owners` vs `/api/users`). Merged fix: deleted text-button + `openReassignOwnerDialog` (window-prompt UI), migrated avatar path to canonical `/api/teams/eligible-owners`, tightened badge gate to `state.canReassign` (was loose `canAssignOwner()` — let MANAGER non-owner click into 403), propagated consultant `?company_id=` (was missing on avatar path), dropped `teamMembersCache` (tenant-stale across consultant switches), upgraded empty-state copy. ~−70 net LoC in `client/pages/scripts/objectives.js`. Zero server changes — canonical endpoint already had everything needed. |
| RT-TASK-MGMT-CASCADE-AUDIT | ↳ **REPLACED 2026-06-03 by Sprint 27 Arc** (Sprint 27-A audit → 27-B cascade correctness → 27-C legacy retirement → 27-D Move + final regression). Original 4-phase post-S27 refinement-track audit + optional Beta hot-fix slice. The hot-fix slice was attempted as Sprint 27-A canonical-sweep (now [SUPERSEDED](../SPRINT-27a-Cascade-Canonical-Sweep%20(Superseded%202026-06-03)/SUPERSEDED.md) after shipping 3 user-visible bugs on 2026-06-03 + same-day rollback). The full audit + redesign now lives as the Sprint 27 Arc — audit runs as Sprint 27-A (LEGO-by-LEGO product audit, no code) **before** any retirement work. See [SPRINT27_ARC_LESSONS.md](../SPRINT27_ARC_LESSONS.md) for the 4-sprint plan + 7 guard rails + Session 27-A.0 kickoff prompt. **No longer a Sprint 29 candidate** — folded into active arc starting 2026-06-04. |
| RT-ESCAPE-HTML-DUPLICATES | Nine file-local `esc` helpers across `client/` still have the `if (!text) return ''` bug that swallows legitimate `0`/`false` values | Surfaced 2026-06-02 during Session A bundle-fix investigation: canonical `KarviaCommon.escapeHtml` at [client/js/common.js:282](../../../../client/js/common.js#L282) had `if (!text) return ''` which returned `""` for `escapeHtml(0)`, causing blank counts (`4 KRs · 4 on track ·  at risk ·  behind`) and invalid CSS (`style="width:%"` → browser fallback to container width, appearing as full red bar). **Canonical fixed in Session A** (`text === null \|\| text === undefined` + NaN guard) — 10/10 unit tests pass. The same buggy pattern exists in 9 other file-local helpers that don't delegate to `KarviaCommon`: `client/js/maturity-indicator.js:461`, `client/js/ssi-report.js:421`, `client/js/company-profile.js:501`, `client/js/configuration.js:712`, `client/js/ssi-report-full.js:409`, `client/js/components/send-wizard.js:347`, `client/js/components/template-picker.js:256`, `client/js/team-selection.js:348`, plus several `.html` files with inline definitions. **Scope when picked up**: grep `if (!text) return ''` across `client/`, apply the canonical 3-line replacement (null/undefined check + NaN/Infinity guard) to each, verify each helper's call sites don't depend on the broken falsy-coerce behavior. Cheap mechanical sweep (~1h). **Bug, not feature.** Owning sprint: refinement track post-S27. |

**Sub-bucket B — Post-Beta-1 (Beta-2 timeframe)**:
| ID | Title | Rationale |
|---|---|---|
| Self-serve cohort dedicated work | Beta-1 ships consulting cohort first; self-serve is Beta-2 |
| Executive read-only Objectives view | Group 4a covers Executive in email; full read-only surface is Beta-2 |
| Mailjet outage queue/retry | Mailjet 99.9% + Beta cohort <50 → expected loss small; build if scale demands |

**Sub-bucket C — Feature-owning-sprint in-scope** (not deferrals; they execute in their owning sprint):
| ID | Title | Owning sprint |
|---|---|---|
| KR-aggregation edge cases / cron observability / formula lock / cron schedule | S27 |
| GRIT triggers (behavior taxonomy) | Refinement track once taxonomy is locked |
| AI pilot LLMPolicy registration | Wherever AI pilot lands (S25/S26) — in-sprint check, not a backlog item per se |
| Migration script ownership for PX-3.x | S25 daily plan action item (resolved during S25 execution) |

**Bucket totals (2026-05-14 — updated S26 B.5)**: Must-before-Beta = 0 · Nice-after-Beta = 13 (A=8 incl. new RT-AUTH-SPLIT, B=3, C=4 owning-sprint items).

**Bucket totals (2026-05-29 — user-surfaced refinements locked to S29)**: Must-before-Beta = 0 · Nice-after-Beta = 17 (A=12 incl. RT-SEND-ASSESSMENT-PERSISTENCE + RT-DEFAULT-TEAM-BO-MEMBERSHIP + RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG + RT-CONSULTANT-TEAMS-TAB-BUGS, B=3, C=4 owning-sprint items).

**Bucket totals (2026-05-30 — S26 functionally sealed; 3 S26-carryover firing-tasks + PX-2.7 locked to S29)**: Must-before-Beta = 0 · Nice-after-Beta = 20 (A=15 incl. RT-CONSULTANT-NUDGE-ACTION-LAYER (S26-C.1b) + RT-PER-INVITEE-PROGRESS-WIDGET (S26-C.4) + RT-KR-REGEN-STANDALONE-FE-WIREUP (S26-D.2 / PX-2.5; likely moot), B=3, C=4 owning-sprint items). PX-2.7 (S26-D.3) annotated "Locked to S29" without bucket move — already in A.

**Bucket totals (2026-06-02 — 2 objectives-card reassign-UX bugs surfaced from karvia-business-1 walk)**: Must-before-Beta = 0 · Nice-after-Beta = 22 (A=17 incl. RT-OBJECTIVES-CARD-REASSIGN-DUPLICATE + RT-OBJECTIVES-REASSIGN-OWNER-LOADER-BUG, B=3, C=4 owning-sprint items).

**Bucket totals (2026-06-02 — Session A bundle-fix shipped 3 RT bugs + minted 1 new RT)**: Must-before-Beta = 0 · Nice-after-Beta = 20 (A=15 — RT-OBJECTIVES-CARD-REASSIGN-DUPLICATE ✅ + RT-OBJECTIVES-REASSIGN-OWNER-LOADER-BUG ✅ + RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG ✅ all shipped 2026-06-02; RT-ESCAPE-HTML-DUPLICATES ➕ minted, B=3, C=4 owning-sprint items). Net delta: −3 (shipped) +1 (minted) = −2 from prior total of 22. Session B (Bundle-Fix 3 auto-Move-creation + Bundle-Fix 6 Teams tab) remains pending; will trim a further 2 RT entries when shipped (RT-CONSULTANT-TEAMS-TAB-BUGS + a fresh RT for the Move auto-creation rollback if user policy yields disable-and-cleanup).

**Bucket totals (2026-06-02 — RT-TASK-MGMT-CASCADE-AUDIT minted post-Session-A walk)**: Must-before-Beta = 0¹ · Nice-after-Beta = 21 (A=16 — RT-TASK-MGMT-CASCADE-AUDIT ➕ 4-phase audit + redesign + reassignment matrix + regression suite; user-flagged that the underlying breakage —task completion not propagating to consultant view — may warrant a Beta hot-fix slice carved out ahead of the full audit; user to call at refinement-track kickoff, B=3, C=4 owning-sprint items). Net delta: +1 from prior total of 20. ¹If hot-fix slice is approved, Must-before-Beta becomes 1.

---

## Why this folder exists

The original Sprint 25 plan ("Cascade Cleanup + Owner-Side Objectives Redesign") contained five epic drafts. After the four-pass audit (R1-R4) on 2026-05-06, the sprint was re-themed as part of a three-sprint sequence:

- **Sprint 25** = "The Plumbing" (foundational; cascade cleanup moved here, expanded with verification + leak-fix phases)
- **Sprint 26** = "First Objective Created" (activation, Stages 0 → 2)
- **Sprint 27** = "First Task Completed" (execution, Stages 2 → 5)

The cascade-cleanup epics (25-1 Phase B + 25-2 Phase C) moved into Sprint 25 and live at [`SPRINT-25-Plumbing/epics/`](../SPRINT-25-Plumbing/epics/).

The remaining three drafts are **refinement-track work** — they don't move the ball or fix leaks; they polish individual touches once the journey works end-to-end. They live here pending re-scoping when the refinement track begins.

---

## Items in this backlog

### Epic-level drafts (deferred from Sprint 25 replanning)

| ID | Original title | Status | Re-schedule target | Notes |
|---|---|---|---|---|
| 25-3 | Owner-side `objectives.html` redesign — navy/gold theme + lifecycle-stage labels + shared component CSS adoption | DEFERRED | Refinement track | Originally drafted during S24 planning when S25 had owner-side scope. Under re-themed plan, owner-side polish is a refinement concern. |
| 25-4 | Display-labels owner-mapping completion | DEFERRED | Refinement track | Populates `lifecycleView(stage, 'business_owner')` etc. (placeholder created in S24 F-1d). Refinement work — affects label presentation but not flow. |
| 25-5 | Behavior Persistence + KR-Level Promotion (full β) — `Move.behavior_id` schema | DEFERRED | Refinement track | γ-lite ships in S24 (frontend grouping). Full β with stable hash schema is refinement quality, not stitching. |

### Audit-driven deferrals (Cross-sprint audit S24-S27, 2026-05-06)

These items surfaced during the cross-sprint audit walkthrough. They have NO stable IDs (per audit governance — IDs are reserved for actionable plan amendments; deferrals have no implementation to track). Each deferral points back to the audit doc for full context.

**Source**: [`AUDIT_S24_S27_FINDINGS.md`](../AUDIT_S24_S27_FINDINGS.md)
**Master tracker reference**: [`AUDIT_TRACKER.md`](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) — "Deferrals from this audit" section

| Item | Category | Audit ref | Notes |
|---|---|---|---|
| AI tone consistency / `LLM_TONE_GUIDE.md` | Refinement track | Groups 2c / 5e / High P5-1 | Prompt-tone consistency across the 4 LLM stages. Lives with `server/prompts/`. Re-evaluate when behavior-taxonomy lock decision is made (D/G/A/M/U vs GRIT). |
| GRIT triggers (behavior taxonomy) | Refinement track | High P6-2 | Already covered by general "behavior taxonomy lock" candidate above. Specific GRIT-trigger surface needed once taxonomy is decided. |
| Self-serve cohort dedicated work | Post-Beta-1 | Group 3d | Beta-1 ships consulting cohort first. Wizard already covers self-serve via no-consultant-invitation path. Dedicated self-serve onboarding/empty-states are post-Beta-1 polish. |
| Executive read-only Objectives view | Post-Beta-1 | Group 4b | Group 4a covers Executive's persona-conditional acknowledgment in post-assessment email. Read-only Objectives surface (browse company OKRs without edit) is a Beta-2 feature. |
| Mailjet outage queue/retry | Post-Beta | Group 5b / High T9-1 | Mailjet 99.9% uptime + Beta cohort <50 users → expected loss is small. Build a `EmailDeadLetter` collection + hourly retry cron only if scale demands it. ~1 pt at that time. |
| AI pilot LLMPolicy registration | Feature-owning sprint (when AI pilot lands) | High T6-1 | Verify LLMPolicy registration at the time the AI pilot work lands (S25/S26 wherever AI policy is touched). Not a deferral so much as an in-sprint check. |
| KR-aggregation edge cases | Feature-owning sprint (S27) | High T5-1 | Owned by S27. Spec edge cases (partial completion, KR-level promotion, weighted aggregation) when S27 PX-1.7 spike resolves. |
| KR-aggregation cron observability | Feature-owning sprint (S27) | High T8-1 | Owned by S27. Logging + alerting design lands when cron is built. |
| KR-aggregation formula lock | Feature-owning sprint (S27) | High H-γ-2 | Resolved by S27 PX-1.7 spike output (formula spec doc). |
| KR-aggregation cron schedule | Feature-owning sprint (S27) | Group 5c | Decide schedule (hourly / daily / on-demand) when feature is built. |
| Migration script ownership for PX-3.x | Assign in S25 daily plan | High H-α-2 | Each PX-3.x task in S25 needs a named owner at sprint kickoff (not pre-assignable from audit). |

### Sprint 25 Day 3 (#210) deferrals

| Item | Category | Audit ref | Notes |
|---|---|---|---|
| **PX-2.7** — Retire `ssi-questions-library.json` + `seed:questions` + `seed:templates` | Refinement track (post-Sprint-27) | `A20260508-02` | Originally scheduled S25 Day 3. **Deferred** Day 3 #210 (user re-prioritization): pure deletion of a dormant seed path — not a Beta blocker. The actual journey-blocker (`A20260508-01` MECE seeder `is_active:true` default) shipped Day 1 as PX-2.6. The 82% drift in `ssi-questions-library.json` only matters when someone runs `seed:questions`, which no Beta path triggers. No S26/S27 feature reads this JSON. Day-1 #208 strategy decision (RETIRE) still stands when refinement track picks it up. ~30 min of work. |

### Sprint 25 Day 4 (#211) deferrals

| Item | Category | Audit ref | Notes |
|---|---|---|---|
| **Cross-codebase field-write symmetry audit (FE + BE)** — every persisted field, every write site | Refinement track (post-Sprint-27) | Surfaced #211 PX-3.6e Why-first audit | While auditing `Objective.key_results[]` write symmetry for the PX-3.6e/d HYBRID-vs-MIGRATED decision, found 8 embedded-only write paths vs 3 dual-write paths (`PUT /api/objectives/:id`, 5 `ai-okr.js` cascade-acceptance paths, `cascade-engine.js`, `objectiveService.js`). HYBRID kept for PX-3.6 consumer migrations. **Generalize the audit pattern**: for every Mongoose model field that has more than one storage location (embedded + collection, or model + cache, or BE + FE-side localStorage cache), enumerate every write site across `server/routes/` + `server/services/` + `client/js/` + `client/pages/scripts/`, classify dual-write vs single-write, and produce a symmetry matrix. Output goes to `KARVIA_STRATEGY/2-TECHNICAL/FIELD_WRITE_SYMMETRY_AUDIT.md`. Likely surfaces additional leaks (Goal hierarchy fields, `Company.assessment_scores`, `Move` parent-resolution fields, etc.). Pre-req: refinement track started. ~1-2 days of work; mostly grep-driven. Outcome: enables a single sweep to drop all "embedded fallback" hedges and migrate fully to standalone collections. |

### Sprint 26 Day 1 (#224) deferrals

| Item | Category | Audit ref | Notes |
|---|---|---|---|
| **Q12 canonical-rollup contract — full wiring** (`Company.assessment_scores`) | Nice-after-Beta (refinement track) | `A20260512-11` + `A20260512-14` cross-ref; surfaced E.4 grounding 2026-05-12; display-slice shipped 2026-05-12 #coding-hotfix | The /strategy session locked Q5 + Q12 canonical contract: `OnboardingProgressService` writes `Company.assessment_scores` on (a) Assessment completion, (b) User role change, (c) User deletion; rollup formula is **latest-per-PERSON → role-weighted average** via existing [`SSIScoringService.aggregateTeamScoresWeighted`](../../../../server/services/SSIScoringService.js#L484). **Today's reality** (E.4 test [scripts/test-sprint26-E.4-cascade-correctness.js](../../../../scripts/test-sprint26-E.4-cascade-correctness.js) honors this): only trigger (a) is wired; rollup formula is **single-Assessment overwrite (latest-completed wins)**. Specifically NOT wired: (1) `User.pre('save')` hook detecting role-change → rollup; (2) `User.pre('deleteOne')` rollup recompute (today's hook only cleans up orphan templates, no rollup recall); (3) latest-per-PERSON aggregate in `OnboardingProgressService.rollupSSI` (each user's latest Assessment) instead of latest-Assessment-period; (4) role-weighted aggregate across persons (`aggregateTeamScoresWeighted` exists but `OnboardingProgressService.rollupSSI` ignores it). **Display-layer slice carved out 2026-05-12 #coding-hotfix (A20260512-14)**: `GET /api/assessments/company-results` now applies pure-function `dedupeLatestPerUser` to Mongo result set → Team Results UI no longer stacks historical retakes per user. Remaining work in this epic = (1)+(2)+(3)+(4) above — write-path rollup formula + role-change/delete triggers. **Visible gap (write path only after 14)**: Company SSI still bounces between users' latest scores as team members take assessments — for a 5-person company, BO=90 / Manager=50 → SSI shows 50 (Manager's latest), not weighted avg. **Why deferred**: E.4 was sized 0.25d (test only); the full contract is a 1-2 day feature epic. Beta-1 consulting cohort tolerates the gap (small clients, consultant-guided sessions); the contract becomes essential at scale or when team-wide aggregates are the primary surface. **When to pick up**: refinement track after S27, OR earlier if Beta-1 telemetry surfaces credibility issues with bouncing SSI. **User-observation cross-link 2026-05-15**: Preflight Q9 manual smoke verified single-user happy path (Sagar BO of Legacy Succession, SSI=6 on my-clients tile matches Sagar's individual score); user explicitly raised the 10-user hypothetical at verification time and confirmed Q12 gap matches their concern. No new audit ID minted — A20260512-11 + A20260512-14 already cover the scenario. Citation lives in SPRINT26_HANDOFF_DOCUMENT.md Workstream E row. **Reuse opportunity** (per `feedback_reuse_max`): `aggregateTeamScoresWeighted` already exists + the `SCORING_DISPATCH` shape from E.3 cleanly extends to the canonical formula. **Owning sprint**: TBD refinement track. **Cross-link**: ASSESSMENT_STRATEGY_SESSION_INPUT.md Q5, Q12. |

**When refinement track begins**: pick up the refinement-track-categorized items first; post-Beta items wait for Beta-2 planning; feature-owning-sprint items resolve in their owning sprint as part of in-sprint scope.

### Sprint 29 candidates (added 2026-05-29)

User-surfaced flow refinements raised 2026-05-29. **Locked to Sprint 29 per user direction 2026-05-29** — not in S28 scope (S28 = Ysela go-public, brand/infra only). Pick up at S29 planning kickoff.

| ID | Title | Why | Owning surface | Est |
|---|---|---|---|---|
| `RT-SEND-ASSESSMENT-PERSISTENCE` | Persist "Send Assessment" CTA on My Clients tile until SSI score exists | Consultant loses primary trigger the moment BO accepts invite, even though assessment hasn't been taken yet | FE only | XS (≤2h) |
| `RT-DEFAULT-TEAM-BO-MEMBERSHIP` | Auto-add Business Owner (primary_contact) to default team on invitation accept | BO lands in company with no team affiliation → empty-team experience kills engagement | BE only | S (≤4h) |
| `RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG` | Consultant client-workspace Objectives tab shows full progress bar when objective is freshly identified (no plan yet) | Misleading signal — consultant sees "100% complete" when client has only just saved the objective; erodes trust in the dashboard | FE + likely BE | S (≤4h) |
| `RT-CONSULTANT-TEAMS-TAB-BUGS` | Multiple display bugs on client-workspace Teams tab: blank manager, blank member count, AVG SSI contradicts Assessment Completion | Default team is seeded with consultant as manager + at least 1 assessment exists, yet UI shows blanks/contradictions — erodes consultant's view of client state | FE + BE (KPI payload) | M (≤1d, multi-surface) |

### Sprint 29 candidates (added 2026-05-30, S26 carryover)

S26 firing tasks not completed before S26 functional-seal at /close 2026-05-30. **S26 close-gate cleared** (manual gates 6/6 PASS 2026-05-28 + Objective Completion Engine Phase 1 sealed 2026-05-30) — these are polish/refinement items that do not block Beta-1. **Locked to S29 per user direction 2026-05-30** — pick up at S29 planning kickoff. PX-2.7 (S26-D.3) is also locked to S29 but lives under §"Sprint 25 Day 3 (#210) deferrals" (no duplicate row here).

| ID | Title | Why | Owning surface | Est |
|---|---|---|---|---|
| `RT-CONSULTANT-NUDGE-ACTION-LAYER` | Consultant cockpit manual nudge action — "send reminder" CTA distinct from auto-cron stall reminders | S26 shipped the auto-side (B.2 cron + Phase 1 Objective-stall cron); consultant still has no one-click manual nudge from My Clients tile or client-workspace when they want to escalate ahead of cron tier | FE (consultant cockpit) + reuse BE LTS dispatcher | S (≤4h, single CTA + handler) |
| `RT-PER-INVITEE-PROGRESS-WIDGET` | Per-invitee SSI assessment progress widget — My Clients tile glance + team-ssi-view deep view | Q4 kickoff 2026-05-12 locked "both surfaces" but never shipped — consultant sees overall company assessment KPI but not per-invitee state (who's in-progress, who's not started, who's stalled) | FE both surfaces (~2 widgets) + possibly BE per-invitee status aggregation | S–M (≤6h) |
| `RT-KR-REGEN-STANDALONE-FE-WIREUP` | FE wire-up for KR regen on standalone Objectives page (S25-PX-2.5 carryover) — **likely moot** | Originally demoted Sprint 25 #209 because BE endpoint was wizard-session-bound. **However**, S27 E.5 (A20260527-08) extended `POST /api/objective-wizard/generate-krs` with optional `objective_id`, AND S27 E.1c (A20260527-04, gated on user wizard re-review) ships the FE consumer via `?objective_id=X&action=add_krs` mode. **S29 action**: verify whether the wizard add_krs flow fully closes the original PX-2.5 premise (Manager/BO regenerates KRs on an existing Objective); if yes, mark CLOSED-by-S27-E.1c; if any gap remains, scope a residual slice | Verify-only; no expected new code | XS (≤1h verify) |

---

#### RT-CONSULTANT-NUDGE-ACTION-LAYER — Manual nudge action in consultant cockpit

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track)
**Surfaced**: 2026-05-12 S26 kickoff (Workstream C task C.1b); deferred from S26 firing scope on 2026-05-14 #243
**Re-locked**: 2026-05-30 to S29 candidates (S26 functionally sealed)
**Owning surface**: [client/pages/my-clients.html](../../../../client/pages/my-clients.html) + [client/pages/client-workspace.html](../../../../client/pages/client-workspace.html) + reuses [server/services/LifecycleTransitionService.js](../../../../server/services/LifecycleTransitionService.js) dispatchers

**Problem**: S26 Workstream B shipped 5 auto-dispatchers (B.1-B.5) + S26 Phase 1 Completion Engine 2026-05-30 added the 5-tier Objective-stall cron firing at 3/7/14/21/30 days. But consultants have no manual override — when they spot a slipping client ahead of the cron tier, the only path today is out-of-band email. The S26 plan named this gap as C.1b ("nudge action layer") and deferred it to refinement.

**Desired behavior**: From My Clients tile OR client-workspace, consultant clicks "Send reminder" → triggers the same `notifyTransition()` / LTS dispatcher path that the cron uses, with cohort-aware copy + the same EMAIL_DEEP_LINK_CONTRACT URLs. Records the manual send in the same telemetry row the cron writes (`Notification.source = 'manual_consultant_nudge'` vs `'cron_stall'`).

**Scope when picked up**:
1. Decide cockpit surface — My Clients tile inline button OR client-workspace activity tab. Recommend client-workspace tab for breathing room + audit log placement.
2. Add `POST /api/consultant/clients/:companyId/nudge` endpoint that mounts `LifecycleTransitionService.dispatch*` with `source:'manual_consultant_nudge'`.
3. FE CTA + confirm modal (avoid accidental spam).
4. Telemetry: surface "Last manual nudge: <time>" near the CTA so consultants know recent state.
5. Manual gate: consultant clicks "Send reminder" → BO receives email matching B.4 template → telemetry row visible to consultant.

**Reuse opportunity** (per `feedback_reuse_max`): LTS dispatcher methods already exist + EMAIL_DEEP_LINK_CONTRACT enforcement already gates URL shape. New work is purely the consultant-side trigger + telemetry source-tag. **Do NOT** build a parallel mailjet template — reuse B.4 + the new Phase 1 self-nudge variant from A20260530-01.

**Open question for S29 planning**: rate-limit policy (max 1 manual nudge per 24h per client? per consultant per day?) to prevent spam — propose conservative 1/24h with override at /strategy time.

**Cross-link**: [SPRINT26_MASTER_PLAN.md §Workstream C](../SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md) — C.1b original spec. A20260530-01 Phase 1 self-nudge surface — reuse the dispatcher branching.

---

#### RT-PER-INVITEE-PROGRESS-WIDGET — Per-invitee SSI progress on My Clients + team-ssi-view

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track)
**Surfaced**: 2026-05-12 S26 kickoff (Workstream C task C.4, Q4 resolution: "both surfaces")
**Re-locked**: 2026-05-30 to S29 candidates (S26 functionally sealed)
**Owning surface**: [client/pages/my-clients.html](../../../../client/pages/my-clients.html) (consultant glance) + [client/pages/team-ssi-view.html](../../../../client/pages/team-ssi-view.html) (deep view)

**Problem**: Today My Clients tile shows aggregate "1/1 · 100%" assessment completion. team-ssi-view shows the same aggregate. Neither shows **per-invitee state** — who's invited but not started, who's in-progress, who's stalled past reminder tier-2, who completed. Consultants ask for this when triaging clients pre-call ("which of my 12 clients has the most blocked invitees this week?").

**Desired behavior**:
- **My Clients tile** (glance widget): mini status row like `"3 invited · 1 in-progress · 1 complete · 1 stalled-tier2"` — 4-bucket count below the SSI ring.
- **team-ssi-view.html** (deep view): expanded table — per-invitee row with email + status + last-event-at + reminder-tier (if stalled) + manual-nudge CTA (consumes RT-CONSULTANT-NUDGE-ACTION-LAYER once shipped).

**Scope when picked up**:
1. BE: extend `GET /api/companies/:id/assessment-status` (or create if missing) to return `invitees: [{ email, status, last_event_at, reminder_tier }]`. Reuse `Invitation.status` + `Assessment.status` (no new fields).
2. FE — My Clients tile: 4-bucket count component (~30 LoC). Inline navy chips.
3. FE — team-ssi-view: per-invitee table (~80 LoC).
4. Cross-link to RT-CONSULTANT-NUDGE-ACTION-LAYER: row-level CTA only if that item ships first OR ships in same S29 slot.

**Reuse opportunity** (per `feedback_reuse_max`): `Invitation.status` + `Assessment.status` already track all 4 bucket states (invited / in_progress / completed / stalled-with-reminder-tier). No new schema. The Mailjet reminder tier counter (added in B.2 cron) is already persisted; the FE consumes it as a status string.

**Open question for S29 planning**: how does this interact with **RT-CONSULTANT-TEAMS-TAB-BUGS** bug #3 (AVG SSI contradicts Assessment Completion)? If the per-invitee widget surfaces accurate state, the contradiction may be a non-issue — verify dependency at /strategy time.

**Cross-link**: [SPRINT26_HANDOFF_DOCUMENT.md §Workstreams C row](../SPRINT-26-First-Objective/SPRINT26_HANDOFF_DOCUMENT.md) Q4 — both-surfaces decision. Memory `feedback_reuse_max` — extend existing endpoints, don't add new fields.

---

#### RT-KR-REGEN-STANDALONE-FE-WIREUP — PX-2.5 verify-and-likely-close

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track) — **likely moot**, verify-then-close
**Surfaced**: 2026-05-08 Sprint 25 #209 (PX-2.5 FE wire-up for KR regen on standalone Objectives page)
**Re-locked**: 2026-05-30 to S29 candidates as verify-and-likely-close
**Owning surface**: [client/pages/objective-wizard.html](../../../../client/pages/objective-wizard.html) — wizard `?action=add_krs` mode (shipping under S27 E.1c)

**Original problem (2026-05-08)**: BO/Manager saves an Objective on standalone `objectives.html`, then wants to regenerate KRs via AI later. The BE endpoint `POST /api/objective-wizard/generate-krs` was wizard-session-bound at the time — couldn't load an existing Objective into the generation context. Demoted to refinement-track.

**What changed since**:
1. **S27 E.5 shipped 2026-05-29** ([A20260527-08](../../../../scripts/test-sprint27-E.5-generate-krs-objective-id.js)): extended `POST /api/objective-wizard/generate-krs` with optional `objective_id` parameter. Multi-tenant filter + 5-KR cap + DO-NOT-DUPLICATE exclude-list. **BE side closed.**
2. **S27 E.1c pending** (A20260527-04, gated on user wizard re-review): wizard `?objective_id=X&action=add_krs` mode — FE consumer of E.5's BE. **Once E.1c ships, the original PX-2.5 premise is fully closed via the wizard surface.**

**S29 action** (verify-only, ~30 min):
1. Confirm S27 E.1c has shipped (status check at S29 kickoff).
2. Walk the flow: BO saves 0-KR Objective on objectives.html → clicks "Generate KRs" card CTA (E.4) → routes to `/pages/objective-wizard.html?objective_id=X&action=add_krs` → wizard regenerates KRs → save persists to existing Objective.
3. If end-to-end works → mark CLOSED-by-S27-E.1c in this README + cross-link to E.4/E.5/E.1c shipping commits.
4. If any gap remains (e.g., consultant-side regen surface) → scope residual slice.

**Reuse opportunity** (per `feedback_reuse_max`): nothing new — the entire path is the existing wizard.

**Likely outcome**: CLOSED-by-S27-E.1c at S29 verify. Carrying for governance audit-trail only.

**Cross-link**: A20260527-08 (E.5 BE ship) + A20260527-04 (E.1c FE pending). [SPRINT27_MASTER_PLAN.md row E.1c](../SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md).

---

#### RT-SEND-ASSESSMENT-PERSISTENCE — Persist "Send Assessment" CTA until SSI score exists

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track)
**Surfaced**: 2026-05-29 (user observation during S28 planning prep)
**Owning surface**: [client/pages/scripts/my-clients.js](../../../../client/pages/scripts/my-clients.js)

**Current behavior** ([my-clients.js:426-427](../../../../client/pages/scripts/my-clients.js#L426-L427)):
```js
// Sprint 24 Epic 24.1 (Item #11) — Send Assessment CTA: prospect AND no completed assessment.
const showSendAssessment = stage === 'prospect' && aDone === 0;
```

**Problem**: Stage transitions `prospect → onboarding` at invitation-accept time, not at SSI-completion time (per [consultant.js:578-579](../../../../server/routes/consultant.js#L578-L579): "Stage transition `prospect → onboarding` fires at ACCEPT time, not at SEND time"). Result: consultant adds client → client logs in via invitation → CTA disappears → consultant has no way to trigger assessment from the tile, even though no SSI is captured yet.

**Desired behavior**: CTA visible from "Add Client" through SSI capture, hides only once SSI score becomes available. The Assessments tab ([assessment-hub.html:659](../../../../client/pages/assessment-hub.html#L659)) already exposes the same CTA — both surfaces should remain available across the assessment-pending window.

**Scope when picked up**:
1. Change gate at [my-clients.js:427](../../../../client/pages/scripts/my-clients.js#L427) from `stage === 'prospect' && aDone === 0` to something like `(!company.assessment_scores?.overall && aDone === 0)` — verify exact field shape against the API payload `loadClients()` builds.
2. Confirm CTA still surfaces from Assessments hub for the same client lifecycle window (parity check, no code change expected).
3. Manual gate: walk Add Client → BO accepts invite → SSI not yet taken → CTA still visible on tile AND in Assessments tab → BO takes SSI → CTA disappears from both.

**Reuse opportunity** (per `feedback_reuse_max`): the `Company.assessment_scores.overall` field already drives the SSI ring rendering on the same tile ([my-clients.js:461](../../../../client/pages/scripts/my-clients.js#L461)) — same field gates the new CTA visibility. No new fields needed.

**Cross-link**: Sprint 24 Epic 24.1 (Item #11) — original CTA introduction. This is a tightening of that gate, not a redesign.

---

#### RT-DEFAULT-TEAM-BO-MEMBERSHIP — Auto-add BO to default team on invitation accept

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track)
**Surfaced**: 2026-05-29 (user observation during S28 planning prep)
**Owning surface**: [server/routes/consultant.js](../../../../server/routes/consultant.js) (team creation) + invitation-accept handler

**Current behavior** ([consultant.js:554-562](../../../../server/routes/consultant.js#L554-L562)):
```js
// Step 3: default Team
const consultantName = req.user.name || req.user.email || 'Consultant';
const [team] = await Team.create([{
  company_id: createdCompany._id,
  name: 'Default',
  manager_id: userId,
  manager_name: consultantName,
  created_by: userId
}], session ? { session } : undefined);
```

**Problem**: Default Team is seeded with `manager_id: userId` (the consultant). At this point the BO/primary_contact is not yet a User — they're getting an Invitation ([consultant.js:581+](../../../../server/routes/consultant.js#L581)). When the BO accepts and becomes a User, no code joins them to the default team. They land in the company with zero team affiliation → empty surfaces on team page, team SSI, etc. → no engagement hook.

**Desired behavior**: On invitation-accept, if accepted user's email matches `Company.primary_contact.email`, push them into the default Team's `members` array. Keeps BO engaged via team-scoped surfaces from day one.

**Scope when picked up**:
1. Locate the invitation-accept handler (likely `server/routes/invitations.js` or `server/routes/auth.js` — grep `Invitation.findOne` + `.accept` to confirm).
2. After User creation, if `acceptedUser.email === company.primary_contact?.email`, find the default Team (`name: 'Default'`, `company_id: company._id`) and `$addToSet` the user's `_id` into the members array.
3. Confirm Team model `members` schema shape (manager-only? members array with role?) — read [server/models/Team.js](../../../../server/models/Team.js) before writing.
4. Manual gate: consultant adds client with primary_contact email → BO accepts invite → BO appears in default team's members list on team page.

**Reuse opportunity** (per `feedback_reuse_max`): Team membership semantics already exist for Manager-added users via [server/routes/teams.js:139](../../../../server/routes/teams.js#L139) (`new Team({...})` flow). Reuse same field path; don't introduce parallel "primary_contact membership" surface.

**Open question for S29 planning**: should this also apply retroactively (one-time backfill for existing BOs already accepted but not in default team)? If yes, add a backfill script slice. If no, document forward-only behavior.

**Cross-link**: Sprint 22a #184d — Consultant invitation flow (where the gap originates).

---

#### RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG — Misleading "completed" progress bar on freshly identified objective

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track) — **bug, not feature**
**Surfaced**: 2026-05-29 (user observed on `karvia-business-1.onrender.com/pages/client-workspace.html?client=…&tab=objectives`, Cultural D2 client)
**Owning surface**: [client/pages/scripts/client-workspace.js](../../../../client/pages/scripts/client-workspace.js) + possibly backend kr_rollup source

**Observed**: Consultant opens client workspace → Objectives tab → sees an objective in `IDENTIFIED` stage (Ball Position card confirms: "Objective + KRs saved, no plan yet"). Progress bar is rendered **fully red** as if 100% complete. Meta row shows blank `"% progress"` (no number). KR mix row shows `"4 KRs · 4 on track · at risk · behind"` with blank counts for at_risk/behind buckets.

**Root cause hypotheses** (S29 owner to confirm before fixing):
1. **Backend rollup**: `Objective.kr_rollup.avg_progress_pct` likely returns `null` / `undefined` when KRs have no goals/tasks. Need to verify the rollup source returns `0` (or treats no-plan as no-progress) instead of leaving the field unset.
2. **Frontend rendering** at [client-workspace.js:636-637](../../../../client/pages/scripts/client-workspace.js#L636-L637):
   ```js
   const krRoll = o.kr_rollup || { total: 0, on_track: 0, at_risk: 0, behind: 0, avg_progress_pct: 0 };
   const progressPct = Math.max(0, Math.min(100, krRoll.avg_progress_pct || 0));
   ```
   The `|| 0` fallback *should* coerce null to 0, but the meta-row at [line 678](../../../../client/pages/scripts/client-workspace.js#L678) shows blank — suggesting `progressPct` is *not* falling through this path. Possibly the entire `krRoll` object exists but `avg_progress_pct` is `NaN` (which passes `||` falsy check but breaks `Math.min`/`Math.max` and `esc()`).
3. **CSS default**: progress bar at [line 681](../../../../client/pages/scripts/client-workspace.js#L681) has `style="width:${progressPct}%"`. If `progressPct` renders as empty string, inline style becomes `width:%` (invalid) → CSS fallback could be full width.
4. **KR-status counts also blank** ([line 651-652](../../../../client/pages/scripts/client-workspace.js#L651-L652)): suggests the same null-vs-zero issue afflicts the whole `kr_rollup` shape — backend may be returning a sparse object instead of all-zeros.

**Likely fix surface**:
- BE: ensure rollup endpoint always returns fully-populated `kr_rollup` (`total`, `on_track`, `at_risk`, `behind`, `avg_progress_pct` — all zero-filled when no children).
- FE: harden the destructuring at [line 636](../../../../client/pages/scripts/client-workspace.js#L636) — use `??` instead of `||` for `krRoll`, and per-field defaults inside the object spread instead of relying on whole-object fallback.

**Scope when picked up**:
1. Reproduce on dev/preprod — open `client-workspace.html?tab=objectives` for a client with a fresh objective (no goals).
2. Inspect actual API response shape for the objective list endpoint — what does `kr_rollup` look like for IDENTIFIED objectives?
3. Fix at whichever layer is the source (prefer BE — single fix benefits all consumers; FE hardening is a belt-and-suspenders second pass).
4. Manual gate: same screen now shows `0% progress` + empty (not full) bar + `4 KRs · 4 on track · 0 at risk · 0 behind`.

**Reuse opportunity** (per `feedback_reuse_max`): same `kr_rollup` shape is consumed by the owner-side `objectives.html` and `planning-v2.html` (per CLAUDE.md cascade calculator). Whatever fix lands here should be verified against those surfaces too — they may already handle the null-rollup case correctly, in which case mirror their pattern.

**Cross-link**: Originating client = "Cultural D2" (company id `6a19c231a1d54a3565d7cad5`); useful for repro on dev DB if data is preserved.

---

#### RT-CONSULTANT-TEAMS-TAB-BUGS — Multiple display bugs on client-workspace Teams tab

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track) — **bug, not feature**
**Surfaced**: 2026-05-29 (user observed on `karvia-business-1.onrender.com/pages/client-workspace.html?client=…&tab=teams`, Cultural D2 client)
**Owning surface**: [client/pages/scripts/client-workspace.js](../../../../client/pages/scripts/client-workspace.js) §`renderTeams` + `renderTeamsKpiStrip` + the BE endpoint that supplies `teams` + `kpis`

**Observed** (screenshot, Cultural D2 with 2 teams: Default + Executive, 1 user, 1 completed assessment):

| KPI / Row | Shown | Expected |
|---|---|---|
| TEAMS card | `2` · `0 members` | `2` · `1 members` (or "0 in teams, 1 unassigned") |
| ASSESSMENT COMPLETION card | `1/1` · `100%` | correct |
| COVERAGE card | `1` · `1 unassigned employees` · `0 mgrs without team` | correct |
| AVG SSI BY TEAM card | `—` · `No completed assessments` | should reflect the 1 completed assessment |
| Default team row | `— · Manager: — · members` (no count) | `— · Manager: Sagar RS · 0 members` |
| Executive team row | `Training · Manager: — · members` (no count) | `Training · Manager: <name> · 0 members` |

**Bug surfaces** (4 separate issues on one tab — fix together to avoid round-trip):

1. **Manager column blank for Default team**
   - Code at [client-workspace.js:1526](../../../../client/pages/scripts/client-workspace.js#L1526) renders `t.manager_id?.name || t.manager_name || '—'`.
   - Default team IS seeded with manager fields per [consultant.js:559-560](../../../../server/routes/consultant.js#L559-L560):
     ```js
     manager_id: userId,
     manager_name: consultantName,
     ```
   - So either (a) the GET endpoint that lists teams isn't populating `manager_id` (no `.populate('manager_id', 'name')`), AND isn't returning the denormalized `manager_name`; OR (b) one or both fields lost on a later code path.
   - Action: locate the consultant-scoped teams GET (`server/routes/consultant.js` or `server/routes/teams.js`), verify the query populates `manager_id` and returns `manager_name`.

2. **Member count renders as empty (" members" not "0 members")**
   - Code at [client-workspace.js:1527](../../../../client/pages/scripts/client-workspace.js#L1527): `${esc(t.member_count ?? 0)} members`.
   - `??` should coerce null/undefined → 0 → `esc(0)` → `"0"`. The blank output suggests either (a) `esc()` returns empty for numeric `0` (treat-as-falsy bug in escapeHtml — unlikely but check), (b) `member_count` is being passed as empty string `""` (passes `??` check, then `esc("")` → `""`), or (c) the field is missing AND `esc(0)` is being short-circuited somewhere.
   - Action: log actual `t.member_count` value; harden to `${esc(Number(t.member_count) || 0)}`.

3. **AVG SSI BY TEAM = "No completed assessments" contradicts ASSESSMENT COMPLETION = 1/1**
   - Code at [client-workspace.js:1588-1591](../../../../client/pages/scripts/client-workspace.js#L1588-L1591) reads `kpis.avg_ssi_by_team` array; renders `'—'` + "No completed assessments" when empty.
   - Two KPIs are sourced from the same backend response (`payload.kpis`); one says 1 completed, the other shows zero. Backend is producing inconsistent KPI shapes.
   - Action: at the backend KPI builder, ensure `avg_ssi_by_team` is computed when `assessments.completed > 0`. Likely the avg-SSI-by-team rollup is gated on team-membership (and since BO is unassigned per bug #4 + RT-DEFAULT-TEAM-BO-MEMBERSHIP, no team has a "completed assessment" attached). Either rollup logic should fall back to company-level, OR the empty-state copy should say "1 assessment completed but assignee not in a team yet" — clearer signal than the misleading "No completed assessments".

4. **TEAMS card shows "0 members" while 1 user exists**
   - Code at [client-workspace.js:1566](../../../../client/pages/scripts/client-workspace.js#L1566): `${k.total_members ?? 0} members`.
   - `total_members` rollup counts users *in teams*, not company total. The user exists (1 unassigned per Coverage card) but isn't a member of any team. Technically correct, semantically misleading.
   - Action: rename subline to `"0 in teams"` or `"0 assigned · 1 unassigned"` to remove the contradiction-feel.

**Cross-link to `RT-DEFAULT-TEAM-BO-MEMBERSHIP`**: Fixing that item (auto-add BO to default team on invite accept) will incidentally clear bugs #3 and #4 on this entry — BO becomes a team member, gets counted in `total_members`, their completed assessment rolls into Default team's avg_ssi. **However**, bugs #1 (blank manager) and #2 (blank member count) are display/payload bugs independent of membership — they'd persist even after RT-DEFAULT-TEAM-BO-MEMBERSHIP ships.

**Scope when picked up**:
1. Reproduce on dev — `client-workspace.html?tab=teams` for a client with default team + at least 1 user.
2. Inspect actual API response (`Network` tab) — log exact shape of `teams[]` and `kpis`.
3. Fix in priority order: bug #1 (manager population) + bug #2 (member count) are cheap pure-display fixes; bugs #3/#4 require KPI-source decisions (defer until after RT-DEFAULT-TEAM-BO-MEMBERSHIP lands, OR fix in same slice if scope allows).
4. Manual gate: same screen now shows manager name, "0 members" (not blank), and KPI cards internally consistent.

**Reuse opportunity** (per `feedback_reuse_max`): consultant `my-clients.html` may consume the same teams payload — verify whatever fix lands here doesn't regress that surface.

**Cross-link**: Originating client = "Cultural D2" (company id `6a19c231a1d54a3565d7cad5`); same client as `RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG` — useful for batched repro on dev DB.

---

#### RT-TASK-MGMT-CASCADE-AUDIT — Task → KR → Objective cascade redesign + regression suite

**Classification**: Nice-after-Beta · Sub-bucket A (refinement track) — **partial bug-grade** (completion-not-propagating is breaking the circular-economy core loop). May warrant a Must-before-Beta hot-fix slice carved out ahead of the full audit; user to call at sprint kickoff.
**Surfaced**: 2026-06-02 (post Session A bundle-fix walk on karvia-business-1)
**Owning surface**: end-to-end cascade — `server/models/Task.js`, `server/models/WeeklyGoal.js`, `server/models/KeyResult.js`, `server/models/Objective.js`, every aggregation/rollup path in `server/routes/` (planning, objectives, consultant clients, moves dashboard), and every FE consumer that renders progress (dashboard-v2, planning-v2, objectives, client-workspace, my-clients)

**Observed**: User on karvia-business-1 completing tasks from the dashboard. Task `status` flips to `completed` correctly at the row level. But the completion is **not propagating upstream**:
- Planning page progress bars still show pre-completion %
- Objectives page KR progress + Objective progress unchanged
- Consultant My Clients tile + client-workspace Objectives tab unchanged
- Net effect: a user does the work, sees no signal that it counted; consultant looking over their shoulder also sees nothing; the circular-economy promise (`Σ tasks_completed ÷ Σ nudges_sent`) breaks at the FIRST link

User's words (2026-06-02): _"currently as user all the tasks i am completing is not being reflected in the planning page, nor objective page nor the consultant's my client tab"_.

**Methodology directive from user** (memory-aligned with `feedback_state_parsimony` locked 2026-06-01):
> _"every time we think of adding a flag or field in the backend, we should estimate if that info would be required in any other place, or adding this will reduce the computing across any other places — for example here task progress can be updated in the task, which is actually used to upstream up until objective, which even is viewed by consultant"_

In other words: **for any new persisted value, justify (a) where else it gets consumed, AND (b) what compute it saves elsewhere by being stored**. Conversely, when the same fact is being recomputed in N places, that's a signal a single derivation seam is missing and the value MIGHT deserve persistence — but only if the staleness window is acceptable.

**Scope when picked up — 4 phases, each ships as its own slice**:

**Phase 1 — Canonical Cascade Matrix** (~3-4h, design-only)
Build a matrix (Markdown table or spreadsheet) with rows = each entity (`Task`, `WeeklyGoal`, legacy `Goal{time_period:'QUARTERLY'|'WEEKLY'}`, `KeyResult`, `Objective`, `Move`) and columns:
- **Source of truth field** (e.g., `Task.status`, `KR.current_value`)
- **Persisted derived fields** (e.g., `Objective.progress_pct` if it exists, `KR.progress_pct` virtual, `kr_rollup.avg_progress_pct` in consultant route aggregation)
- **Computed-on-read sites** (every route handler / FE renderer that recomputes from children)
- **Cascade trigger sites** (every place that should fire when the source field changes — e.g., Task completion should trigger KR.current_value recalculation IF KR.current_value is derived from task completions)
- **State-parsimony verdict** (KEEP persisted / DERIVE on read / EMIT on event)
- **Staleness window tolerance** (real-time / minutes / hourly / on next-page-load)

Reference inputs:
- [CLAUDE.md §Circular Economy](../../../../CLAUDE.md) — `Σ tasks_completed ÷ Σ nudges_sent` is canonical adoption metric
- [`server/models/KeyResult.js`](../../../../server/models/KeyResult.js) — `progress_percentage` virtual already exists (line 104) but reads `current_value` / `target_value` / `baseline_value`; no auto-update from child Tasks
- [`server/routes/consultant.js:890-913`](../../../../server/routes/consultant.js#L890-L913) — `KeyResult.aggregate` rollup for consultant view; recomputes from KR fields, not from Task descendants
- [`server/routes/goals.js`](../../../../server/routes/goals.js) — quarterly/weekly goal endpoints; look for `progress_pct` field on Goal model + computation paths
- [`server/services/ObjectiveCalculator.js`](../../../../client/pages/scripts/objective-calculator.js) (FE) — `effectiveKRProgress(kr)` + `calculateKRRiskStatus` — these are the canonical FE derivation seams; verify the BE has a parallel seam (Service or Virtual) OR migrate FE callers to read a single BE-computed field
- [`A20260520-05`](../../2-QA-AND-TESTING/AUDIT_TRACKER.md) — "prefer children-rolled-up progress" — earlier audit finding that's directly relevant

**Phase 2 — State-Parsimony Audit Pass** (~4-6h, design + minor implementation)
For every row in the Phase 1 matrix, apply the state-parsimony test:
- _"Could this be derived from a canonical source on every read?"_ → If YES, **drop the persisted copy** + add the derivation helper.
- _"Is this field stored in multiple places (drift risk)?"_ → If YES, **pick one source**, drop the others, add a CLEANUP-TARGET marker (per `feedback_cleanup_boundary_pattern`).
- _"Is this field recomputed inline in N route handlers?"_ → If N≥2, **extract one Service method** + route every handler through it (per `feedback_extend_before_wrap` + `feedback_reuse_max`).
- _"Is the staleness window > acceptable?"_ → If YES, design the **event/trigger** that invalidates or recomputes (cron, hook, virtual).

Output: a list of refactors, each scoped to one slice. Order by **blast radius** (smallest first to build momentum), per the established bundle-fix discipline.

**Phase 3 — Reassignment Model Across Every Scenario** (~6-8h, implementation)
The user explicitly called out _"reassign all the project management tasks, considering every scenario"_. Today's reassignment surface area is incomplete:
- ✅ Objective owner reassignment — shipped S27 F.6 (`PUT /api/objectives/:id` with `owner_id` mutation; dispatcher fires per-receiver email)
- ✅ Move reassignment — shipped (Move dashboard "Reassign" button per [dashboard-v2.js:388](../../../../client/pages/scripts/dashboard-v2.js#L388))
- ❓ KR owner reassignment — does the standalone KeyResult model + endpoint support this? Verify
- ❓ WeeklyGoal owner reassignment — exists?
- ❓ Task owner reassignment — exists? If a Manager re-delegates a Task to a different employee, what fires?
- ❓ Cascade-on-objective-reassign — when objective owner changes, do the child KRs / WGs / Tasks also need to update? Or is it intentional that they don't (assignee independence from objective owner)?

Map every reassignment scenario (16+ cells: 4 cascade levels × 4 actor roles) in a matrix, identify gaps, scope the missing endpoints + FE surfaces, ship them with the canonical-engine-grounding discipline (grep before write).

**Phase 4 — Detailed Regression Test Suite** (~6-8h, test code + framework)
The user explicitly asked for _"a detailed regression test suite to test the task management functionalities that covers every corner case"_. Today the test surface for this area is thin (scattered unit tests in `tests/unit/`, no end-to-end cascade test). Build:
- **BST-style scenario tests** (per [CLAUDE.md §Testing Strategy](../../../../CLAUDE.md)) — `npm run test:bst` namespace — covering:
  - Task complete → KR progress recompute → Objective progress recompute → consultant My Clients tile refresh (end-to-end happy path)
  - Task uncomplete (re-open) → cascade reverse
  - Task delete (soft, status='cancelled') → cascade excludes it
  - KR `current_value` direct update (manual) vs auto-update-from-tasks (verify which is authoritative — settles a Phase 1 matrix question)
  - Multi-tenant isolation (Tenant A tasks completing don't bump Tenant B aggregates)
  - Consultant cross-tenant view consistency (when CONSULTANT acts in client tenant context via `?company_id=`, do BE writes go to the right tenant?)
  - Race condition: two users completing tasks under the same KR concurrently — does the rollup see both?
  - Reassign + complete: task gets reassigned mid-flight to user B who then completes — does the cascade attribute to user A (original) or user B (completer) — what does the circular-economy metric want?
  - Cascade on cancelled objective: completing a task under a cancelled objective — what should happen? Per CLAUDE.md soft-delete pattern, the task may still exist but the objective is terminal; verify behavior is intentional
- **Sibling-sweep tests** (per `feedback_canonical_engine_grounding`) — any FE surface that renders `progress_pct` from a Task/KR/Objective gets a smoke test that simulates a Task completion + verifies the FE re-render
- **Performance gate** — the cascade query path under N=100, N=500, N=1000 tasks per KR should stay under SLA (define SLA in Phase 1)

**Estimated total**: 20-30h across the 4 phases. Should be **session-bifurcated** per `feedback_session_bifurcation` — each phase its own session, with a STRATEGY_INPUT.md handoff between Phase 1 (audit) and Phase 2 (refactor planning).

**Memory rules invoked when this work begins**:
- `feedback_state_parsimony` — the central principle; every persisted field justified
- `feedback_canonical_engine_grounding` — grep + inventory before any new code (Phase 1 IS this grounding pass)
- `feedback_reuse_max` — extract shared Service methods rather than adding new
- `feedback_extend_before_wrap` — extend `ObjectiveCalculator` / `KeyResult` model rather than wrapping with new façades
- `feedback_no_destructive_without_greenlight` — Phase 2 may identify fields to delete; each deletion needs user go-ahead + a safety-net precursor (FE audit, backfill, dual-write window)
- `feedback_cleanup_boundary_pattern` — use the CLEANUP-TARGET registry + inline markers for deferred destructive work
- `feedback_test_fixture_validation` — Phase 4 test fixtures MUST grep the models for `required|enum|minlength` before seeding
- `feedback_audit_governance` — every refactor slice gets an `A{YYYYMMDD}-{nn}` audit ID + tracked through Plan→Code→Tests in the master tracker

**Beta-criticality recommendation**:
Given the current breakage (task completion not visible to the consultant), this RT has a dual identity:
- **Hot-fix slice** (carve out from Phase 1, ~2-4h): identify the single weakest link in the cascade — likely the missing `Task.completed → KR.current_value` recalculation hook — and ship a minimal patch BEFORE the full audit. This restores the "I did the work and I can see it" loop for Beta. Should ship as its own RT row (e.g., `RT-TASK-COMPLETE-PROPAGATION-HOTFIX`) when the bug is scoped post-Phase-1.
- **Full audit + redesign** (Phases 1-4): post-Beta refinement work.

User to lock the split at refinement-track kickoff.

**Cross-link**: This RT subsumes the implicit "what does KR.current_value actually mean" question that has been latent since Sprint 22 KR introduction. Resolving it via Phase 1 will retire several audit-tracker open questions (A20260520-05 explicitly; others likely surface during inventory).

**Cross-link to existing audit-track entries**:
- `RT-CONSULTANT-OBJECTIVE-PROGRESS-BUG` (✅ shipped) addressed the FE rendering of `kr_rollup` (the symptom). This RT addresses the upstream cascade (the root system).
- S27 Phase 1 Completion Engine (B.4 dispatcher) handled the email + re-delegation flow on objective-owner change; this RT handles the data-rollup parallel concern.

---

---

## When refinement track begins

After Sprint 27 closes, the activation + execution journey works. The refinement track then picks up:

- These three drafts (re-scoped + re-numbered to fit new sprint themes)
- Plus other refinement candidates surfaced through Sprint 25-27 telemetry
- Plus AI prompt improvements (better Stage 1 narrative, Stage 2 objective refinement, Stage 3 KR generation, Stage 4 task generation)
- Plus behavior taxonomy lock (D/G/A/M/U vs GRIT — currently being evaluated)
- Plus Ball-model schema additions (`stakeholder_group`, `ball_status_percentage`, `timeframe_label`)
- Plus Hybrid Behavior Classification (`Task.is_behavior` 4-state toggle)

Each refinement sprint will pick 3-5 of these workstreams based on telemetry from Sprints 25-27.

---

## How to handle these drafts

When refinement track planning begins:
1. Re-read each draft for current relevance (model + UX may have shifted)
2. Re-scope to fit new sprint theme
3. Re-number with target sprint ID (e.g., `EPIC_28-2_OWNER_OBJECTIVES_REDESIGN.md`)
4. Move from this backlog into the target sprint's `epics/` folder
5. Update this README to reflect the move (remove the row from the Classification table above + the descriptive entry below)

If a draft becomes obsolete (e.g., problem solved differently), mark it ARCHIVED in this README and delete the file.

When adding a new backlog item:
1. Classify must-before-Beta vs nice-after-Beta in the Classification section
2. Add the descriptive entry to the relevant table below
3. Cross-reference any source audit / incident / decision

---

## Cross-references

- [`SPRINT-25-Plumbing/SPRINT25_MASTER_PLAN.md`](../SPRINT-25-Plumbing/SPRINT25_MASTER_PLAN.md) — current foundation sprint
- [`SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md`](../SPRINT-26-First-Objective/SPRINT26_MASTER_PLAN.md) — activation sprint
- [`SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md`](../SPRINT-27-First-Task/SPRINT27_MASTER_PLAN.md) — execution sprint
- [`PERSONA_STAGE_OWNERSHIP_MATRIX.md`](../../../1-PRODUCT/PERSONA_STAGE_OWNERSHIP_MATRIX.md) — canonical persona reference
- [`CONSOLIDATION_PLAN.md`](../../../2-TECHNICAL/CONSOLIDATION_PLAN.md) — cascade cleanup phases (B+C now in Sprint 25)
