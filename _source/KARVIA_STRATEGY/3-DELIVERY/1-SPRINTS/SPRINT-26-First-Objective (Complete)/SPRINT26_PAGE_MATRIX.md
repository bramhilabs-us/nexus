# Sprint 26 — Page Matrix & Task Decomposition

<!-- @GENOME T3-SPR-026-PM | ACTIVE | 2026-05-12 | parent:T3-SPR-026-MP | auto:- | linked:/strategy,/coding -->

**Sprint**: 26 — First Objective Created (Stages 0 → 2 activation half)
**Status**: 🟢 LAUNCHED 2026-05-12 (post-S25 close)
**Sprint Goal**: A fresh company reaches "first Objective with KRs saved" without the ball dropping at any handoff.
**Acceptance**: 5-verb test (Onboard / Engage / Diagnose / Author / Hand-off) green for both Path A (consulting) and Path B (self-serve).

---

## Open-question resolutions (locked at kickoff)

| # | Question | Resolution |
|---|---|---|
| **Q1** | Email tone per cohort | **Different copy.** Same template, persona-conditional helper (same pattern as `A20260506-07`). Consulting mode names the consultant; self-serve mode does not. |
| **Q2** | Reminder cadence for assessment-pending | **Default 3 / 7 / 13 days** (1 day before default 14-day expiry). Per-consultant tunability via `User.notification_preferences` **deferred out of S26** (refinement track). |
| **Q3** | AI-pilot fallback threshold | **Reuse PX-5.3 prompt regression invariants**: length sanity (500-50000 chars) + leaked-debug-strings + identity-line present. On fail → revert to static template, log to refinement track. |
| **Q4** | Per-invitee progress widget placement | **Both surfaces.** My Clients tile (consultant glance) + `team-ssi-view.html` (deep view). Different audience, different fidelity. |

---

## Task spine (firing) — 24 total (was 18 → +4 Workstream E /strategy → +2 regression tests B.7/B.8 /audit, 2026-05-12)

### Workstream A — Activation Playbook (Days 1-2, doc-only)

| ID | Task | Pages/Files | Audit ID | Est | Deps |
|---|---|---|---|---|---|
| S26-A.1 | Draft `ACTIVATION_PLAYBOOK.md` — 5 handoffs × {trigger, receiver, UI, email, action, completion signal} | `KARVIA_STRATEGY/1-PRODUCT/ACTIVATION_PLAYBOOK.md` (NEW) | — | 1d | — |
| S26-A.2 | 4-actor dashboard-state table (Coach/Goalkeeper/Midfield/Attack × ball-position) | same | — | 0.5d | A.1 |
| S26-A.3 | Cohort-mode detection table (consulting vs self-serve first-touch) | same | — | 0.5d | A.1 |
| S26-A.4 | Lock playbook (status DRAFT → ACTIVE) — gates Workstream B+C scoping | same | — | — | A.1-3 |

### Workstream B — Dispatch + Bridges (5 dispatchers; B1-B3 fully, B4 send-side only)

| ID | Task | Pages/Files | Audit ID | Est | Deps |
|---|---|---|---|---|---|
| S26-B.1 | **Dispatcher 1 — Profile-complete → BO** (static template via `notifyTransition()`) + `<NextStep>` CTA on `company-profile.html` exit | `client/pages/company-profile.html`, `client/js/next-step.js` (NEW component), `server/services/emailTemplates.js`, `server/services/LifecycleTransitionService.js` | — | 1d | A.4 |
| S26-B.2 | **Dispatcher 2 — Assessment-pending reminder cron** reads `Invitation.reminder_schedule`; default cadence 3/7/13 days | `server/jobs/dailyDigestJob.js` (extend), `server/models/Invitation.js`, `server/services/emailTemplates.js` | — | 1d | A.4 |
| S26-B.3 | **Dispatcher 3 — Assessment-aggregate complete → BO + Consultant + all team** (persona-conditional one-liner; AI pilot for primary content) | `server/routes/assessments.js`, `server/services/emailTemplates.js`, `server/services/LLMGateway.js`, `client/pages/team-ssi-view.html` (Generate Objectives deep-link) | A20260506-07 | 2d | A.4, B.6, **E.1, E.2** *(threshold reads `Company.assessment_scores`; canonical aggregation must work first — finding A20260513-01)* |
| S26-B.4 | **Dispatcher 4 send-side — Objective.post-save → Manager + Consultant** (static; Manager from `owner_id`) | `server/routes/objectives.js`, `server/routes/objective-wizard.js`, `server/services/emailTemplates.js` | A20260506-05 | 1d | A.4, C.5 |
| S26-B.5 | **dailyDigestJob extension** for consultant lifecycle events + `User.notification_preferences` schema field | `server/jobs/dailyDigestJob.js`, `server/models/User.js`, `server/routes/users.js` | A20260506-08 | 1d | A.4 |
| S26-B.6 | **PX-5.1 regression suite** — grep test for legacy env vars + hardcoded prod URL in email-build paths (S25 carryover) | `scripts/test-sprint26-PX5.1-deep-link-contract.js` (NEW) | A20260506-03 | 0.5d | B.1 |
| S26-B.7 | **B.2 reminder cadence regression test** *(NEW per /audit A20260513-03)* — faked-clock + Invitation fixtures verify 3/7/13-day cron fires (and only fires) at correct windows; idempotent on multi-run | `scripts/test-sprint26-B.2-reminder-cadence.js` (NEW) | A20260513-03 | 0.25d | B.2 |
| S26-B.8 | **B.4 objective-handoff send-side regression test** *(NEW per /audit A20260513-04)* — verify Manager + Consultant emails fire correctly on `Objective.post-save`; persona-conditional copy assertion; owner_id resolution from wizard | `scripts/test-sprint26-B.4-objective-handoff.js` (NEW) | A20260513-04 | 0.25d | B.4 |

### Workstream C — Activation Surface

| ID | Task | Pages/Files | Audit ID | Est | Deps |
|---|---|---|---|---|---|
| S26-C.1a | **Consultant workspace honesty pass** — KPI rationalization across Summary/Objectives/Plan tabs + My Clients tile hotfix + Risk diagnosis enhancement. 5 audit IDs `A20260514-02..-06`. No new affordances — pure correctness/clarity. (Split from original C.1 at /coding 2026-05-14; nudge action layer carved out as C.1b.) | `server/routes/consultant.js`, `client/pages/scripts/client-workspace.js`, `client/pages/scripts/my-clients.js`, `client/pages/scripts/my-clients.css` | A20260514-02, -03, -04, -05, -06 | 1d | — |
| S26-C.1b | **Consultant nudge action layer** at `client-workspace.html#tab=objectives` — manual nudge button (re-fire B.3 dispatcher) on 🟡 ball position + BO-wizard preview deep-link. Needs wizard-preview-mode verify + 24h cooldown gate. DEFERRED. | `client/pages/scripts/client-workspace.js`, `server/routes/consultant.js` (POST /nudge) | A20260506-04 | 1d | C.1a, wizard-preview verify |
| S26-C.2 | **4-case empty-state helper** in `client/js/display-labels.js` (Stage 0/1 × consultant-view/owner-view) | `client/js/display-labels.js`, `client/pages/objectives.html` | A20260506-06 | 0.5d | — |
| S26-C.3 | **AIOKRSuggestion approval UX refinement** — cohort-aware framing (consultant in consulting mode, BO in self-serve) | `client/pages/ai-okr-review.html`, `client/pages/scripts/ai-okr-review.js` | — | 1d | A.4 |
| S26-C.4 | **Per-invitee progress widget** — both My Clients tile + `team-ssi-view.html` | `client/pages/my-clients.html`, `client/pages/scripts/my-clients.js`, `client/pages/team-ssi-view.html`, `client/pages/scripts/team-ssi-view.js`, `server/routes/consultant.js` (progress aggregate endpoint) | — | 1d | — |
| S26-C.5 | **BO assigns `owner_id` (Manager) during wizard authoring** — feeds B.4 send-side | `client/pages/objective-wizard.html`, `client/pages/scripts/objective-wizard.js`, `server/routes/objective-wizard.js` | A20260506-05 | 0.5d | — |

### Workstream D — Triage / Carryover

| ID | Task | Pages/Files | Audit ID | Est | Deps |
|---|---|---|---|---|---|
| S26-D.1 | ~~Triage A20260512-01 auth bug~~ **RETIRED 2026-05-12** — root-caused as aggregation mismatch (see Workstream E) | — | — | — | — |
| S26-D.2 | **Re-evaluate PX-2.5/2.7 deferrals** — does S26 dispatcher work need either? | — | — | 0.25d | — |
| S26-D.3 | **Prompt regression gate before /close** (if `server/prompts/` touched this sprint) | `npm run test:prompt-regression` | A20260506-11 | — | (close-gate) |

### Workstream E — Assessment Aggregation Reliability (NEW, locked 2026-05-12 /strategy)

Scope locked in [ASSESSMENT_STRATEGY_SESSION_INPUT.md](ASSESSMENT_STRATEGY_SESSION_INPUT.md). Slimmed from 5 → 4 tasks after minimal-change audit (no new service, no new collection — reuses existing `OnboardingProgressService` + `Assessment` versioning). Canonical contract: [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) (T2-ARC-023).

**Beta gate impact**: E.1 directly flips `SEC-7` GREEN (cited in `BETA_LAUNCH_CHECKLIST.md:85`). Unblocks S26-B.3 (Assessment-aggregate-complete dispatcher).

| ID | Task | Pages/Files | Audit ID | Est | Deps |
|---|---|---|---|---|---|
| S26-E.1 | **Path A vs B unification** — `/team-breakdown` ([assessments.js:692-815](../../../../server/routes/assessments.js#L692-L815)) and `/dashboard-summary` ([consultant.js:1408-1514](../../../../server/routes/consultant.js#L1408-L1514)) both read `Company.assessment_scores` (canonical). NO new service. | `server/routes/assessments.js`, `server/routes/consultant.js`, `client/pages/scripts/team-ssi-view.js` (verify still works against new shape) | A20260512-01 *(repurposed)* | 0.5d | E.2 (canonical write must be fixed first), preflight Q9 |
| S26-E.2 | **Rollup field fix** — `OnboardingProgressService` reads `assessment.ssi_result.dimensions.*` instead of legacy `ssi_scores`. One-shot backfill script. | `server/services/OnboardingProgressService.js:51-86`, `scripts/db/backfill-assessment-scores-from-ssi-result.js` (NEW) | A20260512-02 | 0.5d | — |
| S26-E.3 | **`scoring_type` field + dispatch** — Add `scoring_type:{type:String, default:'SSI'}` to `AssessmentTemplate`; light dispatch wrapper in rollup (today's only type = SSI; future-ready) | `server/models/AssessmentTemplate.js`, `server/services/OnboardingProgressService.js` | A20260512-08 | 0.5d | E.2 |
| S26-E.4 | **Cascade-correctness regression test** — proves Q12 invariant: completion + re-take + role change + user delete all cascade correctly | `scripts/test-sprint26-E.4-cascade-correctness.js` (NEW) | A20260512-11 | 0.25d | E.1, E.2, E.3 |
| _(preflight)_ | Verify Q9 — behavior on client with pending invites (15 min, manual) | — | — | 0.25d | — |

**Workstream E total**: ~1.75d (5 work units including preflight). Lands mid-S26 before B.3 dispatcher work.

**Doc-only outputs** (no code, captured in `ASSESSMENT_LIFECYCLE.md`):
- `A20260512-09` Per-role visibility matrix (Q7) — current code already enforces; locked as design intent
- `A20260512-10` `AssessmentScoreLog` collection — deferred to refinement backlog (post-Beta-1)
- `A20260512-03` MANAGER scope restriction — retired (bidirectional invites confirmed correct)
- `A20260512-04` Re-take policy — folded into Q6=b semantics + E.4 test coverage

---

## Page-impact matrix

| Module | Page / File | Change Type | Tasks |
|---|---|---|---|
| **AUTH / SESSION** | `consultant-page-mode.js` | Triage / possible fix | D.1 |
| **DASHBOARD** | `my-clients.html` + `my-clients.js` | Add per-invitee progress widget | C.4 |
| **COMPANY** | `company-profile.html` | `<NextStep>` CTA on completion exit | B.1 |
| **ASSESSMENT** | `team-ssi-view.html` + `team-ssi-view.js` | Generate-Objectives deep-link + per-invitee progress | B.3, C.4 |
| **OKR — Wizard** | `objective-wizard.html` + script + route | Add `owner_id` (Manager) assignment | C.5 |
| **OKR — Standalone** | `objectives.html` + `display-labels.js` | 4-case empty-state helper | C.2 |
| **OKR — Workspace tab** | `client-workspace.html` + script | KPI honesty pass (C.1a, S26) → nudge surface (C.1b, deferred) | C.1a, C.1b |
| **OKR — AI review** | `ai-okr-review.html` + script | Cohort-aware framing refinement | C.3 |
| **NEW COMPONENT** | `client/js/next-step.js` | NEW `<NextStep>` receive-side component | B.1, B.3, B.4 |
| **SERVER routes** | `objectives.js`, `objective-wizard.js`, `assessments.js`, `consultant.js`, `users.js` | Dispatcher hooks + progress aggregate | B.3-5, C.4-5 |
| **SERVER services** | `LifecycleTransitionService.js`, `emailTemplates.js`, `LLMGateway.js` | `notifyTransition()` consumers + AI-pilot fallback | B.1-4 |
| **SERVER jobs** | `dailyDigestJob.js` | Reminder cron + consultant lifecycle batching | B.2, B.5 |
| **SERVER models** | `User.js`, `Invitation.js` | `notification_preferences` field + reminder schedule wiring | B.2, B.5 |
| **GOVERNANCE** | `ACTIVATION_PLAYBOOK.md` | NEW companion to `PERSONA_STAGE_OWNERSHIP_MATRIX.md` | A.1-4 |

---

## Conflicts & overlaps check

- **No overlaps with active sprint folders** — S27 is `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/SPRINT-27-First-Task/`, owns Stages 3 → 5 (planning + execution). S26 stays in 0 → 2.
- **B.4 receive-side intentionally NOT in S26** — Sprint 27 builds Manager dashboard "Plan this KR" CTA when ball lands.
- **Dispatcher 5 (All-KRs-100%) entirely deferred to S27** — depends on KR-aggregation cron (PX-1.7 spike output from S25).
- **`A20260506-06` 4-case helper (C.2) + `A20260506-04` consultant surface (C.1a + C.1b)** both touch consultant-view paradigm but in different files. No overlap.

---

## Implementation order — REVISED 2026-05-12 /audit

Amendment: E.1+E.2 reordered to land BEFORE B.3 (finding A20260513-01 — B.3 threshold reads canonical `Company.assessment_scores`).

```
Day 1   A.1 (playbook draft) || C.2 (empty-state helper, no deps) || C.5 (owner_id) || E.2 (rollup field fix + backfill) || preflight Q9 (15 min)
Day 2   A.2 + A.3 + A.4 (playbook lock) || E.1 (Path A/B unification) || E.3 (scoring_type field)
Day 3   B.1 (dispatcher 1) || B.6 (PX-5.1 regression) || C.4 (progress widget) — note: C.4 starts with 30-min spike to verify if new endpoint needed (finding A20260513-02)
Day 4   B.2 (dispatcher 2 cron) || B.7 (B.2 cadence regression test, after B.2 ✓) || E.4 (cascade regression test — depends on E.1+E.2+E.3 ✓)
Day 5   B.4 (dispatcher 4 send-side) — needs C.5 ✓ || B.8 (B.4 handoff regression test, after B.4 ✓)
Day 6   B.3 (dispatcher 3 + AI pilot) — start — needs E.1+E.2 ✓
Day 7   B.3 — finish
Day 8   B.5 (digestJob extension)
Day 9   C.1a (honesty pass — 5 audit IDs) — ships in one session 2026-05-14
Day 10  C.3 (AIOKR refinement) || C.1b deferred (nudge action layer)
Day 11  5-verb acceptance test — Path A
Day 12  5-verb acceptance test — Path B + close prep
Day 13  /close (D.3 prompt regression if needed)
```

**Total estimated**: ~13 days. Workstream E (1.75d) parallelizes into Days 1-2 of the existing plan — no calendar growth.

**Day-1 unblockers** (all no-dep): A.1, C.2, C.5, E.2, preflight Q9. Each can be picked up by a parallel /coding session if pressure is on.

---

## Acceptance gates

- [ ] All firing tasks ✅ in audit tracker (📝 → 💻 → ✅ for each)
- [ ] 5-verb test green, both paths, zero out-of-band intervention
- [ ] PX-5.1 regression suite green (B.6)
- [ ] Prompt regression suite green if `server/prompts/` touched (D.3)
- [ ] No new role-check sites outside phase3-3 lint allow-list
- [ ] All handoff emails fire via `notifyTransition()` inline helper (no event-bus)
- [ ] Consultant workspace tab is initiate/monitor/nudge — NOT authoring (verify)

---

## Carry-forward to Sprint 27

To populate at S26 close:
- `<NextStep>` component (S27 wires Manager dashboard receive-side for B.4)
- `dailyDigestJob.js` consultant-lifecycle extensions (S27 adds Stages 3-5 events)
- AI-pilot fallback threshold telemetry (refinement track input)
- `User.notification_preferences` UI (S27 if cohort feedback says it matters; else refinement track)
