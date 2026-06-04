# Sprint 26 — "First Objective Created"

<!-- @GENOME T3-SPR-026-MP | CLOSED | 2026-05-30 | parent:T1-PRD-002 | auto:- | linked:/strategy,/coding,/sprint-review -->

**Status**: 🟢 **CLOSED 2026-05-30** — /sprint-review official close; functionally sealed at #268 Phase 1 Completion Engine. Retrospective: [SPRINT26_SPRINT_REVIEW.md](SPRINT26_SPRINT_REVIEW.md). 4 firing carryovers locked to S29 via [REFINEMENT-BACKLOG](../REFINEMENT-BACKLOG/README.md#sprint-29-candidates-added-2026-05-30-s26-carryover) (commit a860d95).
**Sprint Goal**: A fresh company (consultant-managed OR self-serve) reaches "first Objective with KRs saved" without the ball dropping at any handoff.
**Theme**: Stitch the activation flow end-to-end. Stages 0 → 2.
**Close Target**: task-driven; scope firms at sprint kickoff
**Sprint type**: User-value delivery — visible activation milestone

---

## Why this sprint exists

After Sprint 25 ships clean plumbing, the system is in a known-good state but the *flow* between actors at the activation cliff is still silent. Specifically, today the journey from "company shell created" to "first Objective set" has these dead zones:

1. **Profile complete → Assessment kickoff** — silent. BO finishes profile, no email or banner pointing to assessment.
2. **Assessment-pending teammates → reminder cron** — `Invitation.reminder_schedule` field exists; no cron reads it.
3. **Per-invitee progress visibility** — neither consultant nor BO can see "3 of 5 invited completed" without navigating into team-ssi-view.
4. **Assessment complete → BO/Consultant notified** — no email; no deep-link to "Generate Objectives".
5. **Stage 2 (consulting mode) authoring** — `client-workspace.html#tab=objectives` is read-only; no "Compose Objective" affordance.
6. **AIOKRSuggestion approval UX** — model + workflow exist; surface verified or built in Sprint 25; refined here.
7. **Objective saved → Manager notified** — no email; Manager learns silently on next login.

This sprint stitches all 5 handoffs of the **activation half** of the journey (Sprint 27 stitches the execution half).

---

## Sprint Goal Statement

> **By the end of Sprint 26**, this sequence works end-to-end with no manual intervention between actors:
>
> **Path A (consulting)**: Consultant invites → BO accepts + completes profile (with "Next Steps" CTA) → BO takes assessment + invites team → assessment-pending reminders fire on cadence → completion progress visible to consultant + BO → diagnostic narrative auto-fires + email to consultant + BO → consultant authors first Objective with LLM in `client-workspace.html#tab=objectives` → AIOKRSuggestion drafts → consultant approves → Objective saved with KRs → Manager receives email handoff.
>
> **Path B (self-serve)**: BO signs up directly → completes profile → takes assessment + invites team → reminders fire → diagnostic auto-fires → BO returns, lands on Objectives page, sees clear path → authors first Objective with LLM via wizard or atomic create → KRs generated → saved.
>
> Both paths reach `Objective.lifecycle_stage='kr_breakdown'` for the first Objective. Manager has the next ball.

---

## Hard Prerequisite (blocks sprint start)

Sprint 25 must close successfully:
- [ ] All Phase 1 verification questions answered
- [ ] Phase 2 leak fixes shipped (or formally deferred)
- [ ] Phase 3 cascade cleanup complete (single-write enforced; legacy retired)
- [ ] Phase 4 service consolidation resolved
- [ ] **`notifyTransition()` helper wired** into `StageTransitionService` entry points (Sprint 25 PX-2.2) — Sprint 26 lands transition emails on top. No event-bus / listener-registry. *(Cross-sprint audit 2026-05-06, Group 2a.)*
- [ ] **`EMAIL_DEEP_LINK_CONTRACT.md` authored** at Sprint 25 close (Group 2b) — Sprint 26 send-side consumes URL parameter shape
- [ ] Sprint 25 acceptance criterion verified

---

## Three Workstreams

### Workstream A — The Playbook (definition first, code after)

Before wiring dispatchers, define the play. **Documentation artifact**, not code.

For each handoff: trigger event, receiver, what they see (UI), what fires (email/notification), expected action, completion signal.

For each actor (Coach / Goalkeeper / Midfield / Attack): what their dashboard shows when the ball is at their position vs. somewhere else; what calls them into the game.

For each cohort mode: which actor takes the first touch; how the system detects mode.

**Deliverable**: `KARVIA_STRATEGY/1-PRODUCT/ACTIVATION_PLAYBOOK.md` — companion to `PERSONA_STAGE_OWNERSHIP_MATRIX.md`. Drafted Day 1 of the sprint, locked Day 2, then drives all subsequent task scoping.

**Why this comes first**: without it, the dispatch wiring becomes opinion. With it, wiring is mechanical.

### Workstream B — Dispatch + Bridges (the connective tissue)

Wire emails to the `notifyTransition()` helper built in Sprint 25 PX-2.2 (per Cross-sprint audit 2026-05-06, Group 2 — inline helper, NOT an event-bus / listener-registry). Five handoff dispatchers, each delivering:

1. **Trigger** — `notifyTransition()` call from existing `StageTransitionService` entry point after successful flip (auto path), OR consultant-initiated nudge action firing the same `notifyTransition()` call (manual path). Same template both triggers.
2. **Email/notification** — using existing `mailjetService` + `emailTemplates.js` (already centralized; per Q2 lock: 3 static templates + 1 AI pilot on Assessment-complete handoff)
3. **UI bridge** — `<NextStep>` component on the receiving page that renders the appropriate CTA when the receiving actor lands. URL params follow `EMAIL_DEEP_LINK_CONTRACT.md` (S25 deliverable, Group 2b).

The five handoffs to wire:

| # | Trigger | Receiver | Email content | UI bridge target |
|---|---|---|---|---|
| 1 | Profile complete | BO | Static template | "Next Steps: take assessment" CTA on `company-profile.html` exit |
| 2 | Assessment invitation N days unanswered | Mgr/Emp/Exec | Static template | n/a (email-only) |
| 3 | Assessment-aggregate threshold met | BO + Consultant + **all team members (persona-conditional one-liner: BO / Manager / Executive / Employee)** *(Cross-sprint audit Group 4a)* | **AI pilot** for primary content + static persona-conditional one-liner | `team-ssi-view.html` "Generate Objectives" deep-link |
| 4 | Objective.post-save (first time per company) | **Manager (assigned via `owner_id` at authoring time)** + Consultant *(Cross-sprint audit Group 3b: BO assigns manager during wizard authoring; system auto-emails on objective.create)* | Static template | Manager dashboard "Plan this KR" CTA *(receiver-side wiring continues in Sprint 27)* |
| 5 | All KRs reach 100% (KR-aggregation cron from PX-1.7 spike) | Consultant + BO | Static template | Workspace "Mark Sustained" CTA *(this fires in Sprint 27 territory)* |

Sprint 26 builds dispatchers 1-3 fully (activation half) plus dispatcher 4's *send side*. Sprint 27 wires dispatcher 4's *receive experience* + dispatcher 5 entirely.

**Notification governance** *(Cross-sprint audit Group 5a)*: extend existing `dailyDigestJob.js` to batch consultant lifecycle events (only urgent + BO-self-service notifications go real-time). Add `User.notification_preferences` schema field for opt-out. **+1-2 pts.**

### Workstream C — The Activation Surface (Stage 2)

Stage 2 is the cliff. This workstream builds the **consultant-side initiate/monitor/nudge surface** (NOT consultant authoring — see Cross-sprint audit 2026-05-06, Group 3a) and verifies/refines the BO-side authoring flow.

- **Consultant side**: `client-workspace.html#tab=objectives` is an **initiate / monitor / nudge** surface. Consultant sees client lifecycle state, nudge buttons per stage, and a deep-link to the BO's existing `objective-wizard.html` for any "show me how" moment. Consultant does NOT author objectives in their own app — the consultant initiates; the BO authors. *(Cross-sprint audit Group 3a — minimal change to original plan; same point budget.)*
- **BO side**: `objectives.html` empty-state polish via 4-case helper in `display-labels.js` (Stage 0 vs Stage 1 × consultant-view vs owner-view). *(Cross-sprint audit Group 3c — +0.5 pt.)* `objective-wizard.html` is the canonical authoring surface for BOTH cohorts (consulting + self-serve); BO assigns `owner_id` to a manager during authoring (drives Workstream B dispatcher 4 auto-email).
- **AIOKRSuggestion approval UX**: refine the surface built in Sprint 25 PX-2.4 (or the verified-existing one); ensure cohort-aware framing (consultant approves in consulting mode; BO approves in self-serve).
- **Self-serve cohort**: dedicated work deferred post-Beta-1 — wizard already covers self-serve via no-consultant-invitation path. *(Cross-sprint audit Group 3d.)*
- **Asymmetric page-reuse decision**: consultant workspace tab owns the consultant-side surface (initiate/monitor/nudge); BO uses the wizard. Two surfaces, two stakeholders, two jobs — not duplicates.

---

## Acceptance Test (the 5 verbs)

Working with a single fresh client end-to-end, verify both paths:

| Path | Verbs |
|---|---|
| **Consulting mode** | Onboard (consultant adds client) · Engage (BO + team take assessment, reminders fire) · Diagnose (narrative + completion email lands) · Author (consultant writes Objective in workspace tab, LLM refines, saves) · Hand-off (Manager receives email) |
| **Self-serve mode** | Onboard (BO signs up directly) · Engage (BO invites team, reminders fire) · Diagnose (narrative + completion email lands) · Author (BO uses wizard or atomic create, LLM refines, saves) · Hand-off (Manager receives email) |

If both paths complete with zero out-of-band intervention, Sprint 26 is done.

---

## What Sprint 26 explicitly does NOT do

- ❌ Does NOT touch Stage 4 (planning) or Stage 5 (execution) — that's Sprint 27
- ❌ Does NOT refine LLM prompts (refinement track)
- ❌ Does NOT introduce new model fields (Sprint 25 cleaned models; Sprint 26 uses them)
- ❌ Does NOT lock behavior taxonomy decisions (D/G/A/M/U vs GRIT)
- ❌ Does NOT add Ball-model schema enhancements (`stakeholder_group`, `ball_status_percentage`, `timeframe_label`)
- ❌ Does NOT extend asymmetric page-reuse (consultant-view of `objectives.html`)
- ❌ Does NOT touch iBrain integration

---

## Architectural Invariants (verify at every session close)

Carried forward; one new:

- [ ] Zero executable `switch-company` callers
- [ ] LLMGateway sole AI chokepoint
- [ ] requireManagedClient gates all consultant data access
- [ ] StageTransitionService + LifecycleTransitionService sole stage-state writers
- [ ] No new role-check sites outside phase3-3 lint allow-list
- [ ] **NEW**: All handoff emails fire via inline `notifyTransition()` helper (Sprint 25 PX-2.2). No event-bus / listener-registry abstraction. Manual nudges and auto-fires reuse the same template per transition. *(Cross-sprint audit 2026-05-06, Group 2a.)*
- [ ] **NEW**: Consultant workspace tab is initiate/monitor/nudge — NOT authoring. BO/manager is the sole author of objectives via the existing wizard. *(Cross-sprint audit 2026-05-06, Group 3a/3b.)*

---

## Risks

- **R1**: ACTIVATION_PLAYBOOK takes longer than expected → delays Workstream B. Mitigation: timebox Workstream A to Day 2; ship draft + iterate.
- **R2**: AI-pilot email content (per Q2) needs prompt-regression testing infrastructure → scope creep. Mitigation: simple A/B fallback to static template if AI output fails validation.
- **R3**: Consultant workspace "Compose Objective" surface duplicates wizard logic → maintenance burden. Mitigation: reuse wizard endpoints under the hood; UI is thin.

---

## Open Questions (resolve at sprint kickoff)

1. **Email content tone per cohort**: does consulting-mode "first objective" email to BO read differently than self-serve mode? (My read: yes — consultant is named in consulting mode; absent in self-serve.)
2. **Reminder cadence for assessment-pending**: 3 days, 7 days, 13 days (1 day before expiry)? Or different schedule?
3. **AI pilot fallback threshold**: when does AI-generated content fail validation and revert to static? (Length? Toxicity? Off-tone signal?)
4. **Per-invitee progress widget placement**: My Clients tile (consultant view) only? team-ssi-view.html? Both?

---

## Carry-Forward to Sprint 27

When Sprint 26 closes:
- ActivationPlaybook covers Stages 0 → 2; Sprint 27 extends to Stages 3 → 5
- Dispatcher 4 send-side wired; Sprint 27 wires receive-side experience
- Dispatcher 5 (KR-aggregation) NOT yet built; Sprint 27 builds it (consumes PX-1.7 spike output from Sprint 25)

---

## Sign-off

Sprint 26 created 2026-05-06 after replanning the original "Cascade + Owner Objectives" theme. The cascade work moved to Sprint 25 (Plumbing); the owner-side redesign moved to refinement track. Sprint 26 now has a single, user-value-anchored theme: **First Objective Created**.

**Prior sprint**: [`SPRINT-25-Plumbing/`](../SPRINT-25-Plumbing/)
**Next sprint**: [`SPRINT-27-First-Task/`](../SPRINT-27-First-Task/)
**Refinement backlog**: [`REFINEMENT-BACKLOG/`](../REFINEMENT-BACKLOG/)
