# Activation Playbook — The 5 Handoffs

<!-- @GENOME T1-PRD-ACTIVATION-PLAYBOOK | ACTIVE | 2026-05-30 | parent:T1-PRD-002 | auto:- | linked:/strategy,/coding,/design -->

**Status**: ✅ ACTIVE — locked at S26 task **A.4** close (2026-05-13). 2026-05-30 amendment (A20260530-01): persistent re-nudge invariant added on top of the one-shot 5-handoff layer; Midfield-as-Manager assumption relaxed to "Midfield = any `owner_id` holder"; re-delegation + self-cancel cohort rules formalized.
**Companion to**: [PERSONA_STAGE_OWNERSHIP_MATRIX.md](PERSONA_STAGE_OWNERSHIP_MATRIX.md) (static ownership model — who drives what stage).
**Scope**: The dynamic activation layer — how the ball moves between actors during Stages 0 → 2 (Prospect → Objective Handed Off), AND how the system keeps the ball moving until every objective completes. Each handoff is a {trigger, receiver, UI, email, action, completion-signal} tuple, fired through `notifyTransition()` per the S25 PX-2.2 inline-helper contract; each stalled cascade entity is re-nudged by `dailyDigestJob.js` per the persistent-nudge invariant added 2026-05-30.

---

## Why this doc exists

The persona-ownership matrix answers *who drives which stage*. It does not answer:

- **What event triggers the next stage's driver to act?** (a stage flip? a save? a cron tick?)
- **What does the receiver see when the ball lands on them?** (UI affordance + email)
- **How does the system know the receiver has actually accepted the handoff?** (completion signal)

Without those three answers, the activation chain has gaps where the ball drops out-of-band: emails fire to no follow-through UI, UI shows no obvious next action, completion never propagates upstream. This playbook closes the gaps for the 5 handoffs that span the Stage 0 → 2 acceptance test (5-verb test from S26 master plan: Onboard / Engage / Diagnose / Author / Hand-off).

---

## The 4 actors — football metaphor (A.2)

The persona-ownership matrix names four drivers across the lifecycle. The football metaphor below is the operational mnemonic — **same 4 actors, same drivers**, framed by what they *do* with the ball rather than what their role title says.

| Actor (metaphor) | Role | Ball-handling responsibility | Where they live (page ownership from [PERSONA_STAGE_OWNERSHIP_MATRIX.md](PERSONA_STAGE_OWNERSHIP_MATRIX.md#page-ownership-the-toothpaste-test)) |
|---|---|---|---|
| 🧑‍🏫 **Coach** | `CONSULTANT` | Off the field. Sets the play, nudges. Never takes the shot. | `/pages/my-clients.html` + `/pages/client-workspace.html` |
| 🥅 **Goalkeeper** | `BUSINESS_OWNER` | Defends the goal = owns the objective, ratifies plays, has authority over team composition. Receives possession from the Coach and decides whether to hand it down. | `/pages/objectives.html` |
| ⚽ **Midfield** | `MANAGER` | Orchestrator. Receives possession from the Goalkeeper, distributes into attacking opportunities (weekly goals / moves), shares with the front line. | `/pages/planning-v2.html` |
| 🎯 **Attack** | `EMPLOYEE` | Takes the shot. Completes the task. Closes the loop. | `/pages/dashboard-v2.html` |

> **Important**: This is a mnemonic layer, not a separate ontology. All UI labels, RBAC, and code references stay on the canonical role names (`CONSULTANT` / `BUSINESS_OWNER` / `MANAGER` / `EMPLOYEE`). The football frame appears only in internal narrative docs and onboarding materials — never in user-facing copy unless explicitly chosen per surface.

> **On page co-ownership**: the football frame assigns one canonical "owned page" per actor for clarity. The static ownership matrix recognises co-ownership where it exists — [PERSONA_STAGE_OWNERSHIP_MATRIX.md line 77](PERSONA_STAGE_OWNERSHIP_MATRIX.md#page-ownership-the-toothpaste-test) marks Dashboard as `"★ Manager + Employee (co-owned)"`. The matrix is canonical for co-ownership questions; the table above is the mnemonic primary-owner view.

### The ball-position lens

A company's "ball position" is the *furthest* stage any of its objectives has reached. The same 4 actors play differently at each position:

| Ball position | Mapping (Company.stage / Objective.lifecycle_stage) | Coach | Goalkeeper | Midfield | Attack |
|---|---|---|---|---|---|
| ⚪ **Off the field** (no team / no assessment) | `Company.stage='prospect'`, no `Invitation` rows | **DRIVER** — Add client, fill profile, send assessment | Sign up + take assessment | Sign up + take assessment | Sign up + take assessment |
| 🟡 **Possession won** (team assembled, results in) | `Company.stage='onboarding'`, all team `Assessment.status='completed'` | Nudges — surfaces "your team's results are in" | **DRIVER** *(self-serve)* OR ratifies *(consulting)* — opens authoring | Reads results | Reads results |
| 🎯 **Identified** (objective + KRs saved, no plan yet) | `Objective.lifecycle_stage ∈ {identified, kr_breakdown}` | Read-only via workspace | Owns the objective (and may BE the Midfield — see footnote) | **DRIVER** — whoever holds `Objective.owner_id` receives handoff, creates first weekly goal / move | Reads plan |
| 🤝 **Handed Off** (plan started) | `Objective.lifecycle_stage ∈ {in_execution, completion_review}` | Reads via workspace | Watches outcomes | Plans + shares | **DRIVER** — completes assigned moves/tasks |
| 📊 **Sustained** (KRs at 100%, in sustained mode) | `Objective.lifecycle_stage='sustained_mode'` | Alumni view | Acknowledges | Watches retention | Continued execution |

This table is the **dashboard-state lens** — for any (actor, ball-position) pair, the corresponding dashboard tile / empty-state / CTA should be optimized for the row's verb.

> **Midfield relax (2026-05-30 / A20260530-01 P1)**: "Midfield" is shorthand for *whoever currently holds `Objective.owner_id`*, not the `MANAGER` role specifically. The BE accepts `BUSINESS_OWNER` + `EXECUTIVE` + `MANAGER` as `owner_id` per [`ALLOWED_OWNER_ROLES` at objective-wizard.js:770](../../server/routes/objective-wizard.js#L770). When the BO authors AND owns (solopreneur cohort, small team without a Manager yet, intentional self-ownership), the BO IS the Midfield driver for that objective — the dashboard tile + receive-side `<NextStep>` hero adapt per Handoff #4 variant (see master table below). The football-metaphor row label stays "Midfield" for narrative continuity; the operational role is whichever User `owner_id` references.

---

## The 5 handoffs (A.1) — master table

Each handoff is a single row in this contract. Implementations under S26 Workstream B fill the **Impl seam** column.

| # | Handoff name | Trigger | Receiver | UI affordance (receive-side) | Email | Action requested | Completion signal | Impl seam |
|---|---|---|---|---|---|---|---|---|
| **1** | **Profile-complete → Team-invite** | `Company` profile reaches "complete" — first time all required fields saved on `company-profile.html`. **Fires as history-only marker** on `Company.stage_history` (no stage flip; `Company.stage` stays `prospect` until invitation accepted). | Goalkeeper (BO) | `<NextStep>` CTA on `company-profile.html` exit — "Invite your team to take the assessment →" linking to invitation flow | Static template (Q1: persona-conditional one-liner: consulting mode names the consultant; self-serve does not) | "Invite your team — they take a 5-minute assessment" | First `Invitation` row created for `company_id` with `assessment_template_id` set | B.1 — `notifyTransition()` extended to history-only path; route hook on `company-profile` save |
| **2** | **Assessment-pending reminder** | Cron tick (daily digest job) reading `Invitation.reminder_schedule`. Default cadence **3 / 7 / 13 days** after invite (1 day before 14-day expiry). | Each invited user whose `Assessment.status ≠ 'completed'` | (No new UI — assessment-take landing already exists per `EMAIL_DEEP_LINK_CONTRACT.md`) | Static template; cohort-conditional one-liner (consulting names the consultant) | "Take your assessment — 5 minutes, your team's waiting" | `Assessment.status='completed'` for `(user_id, company_id)` | B.2 — `dailyDigestJob.js` extension; reads `Invitation.reminder_schedule` |
| **3** | **Assessment-aggregate-complete → Generate Objectives** | All invited team members complete OR `Company.assessment_scores` rollup is canonical-non-empty (per Workstream E canonical contract — depends on E.1 + E.2 ✓) | Coach + Goalkeeper + entire team (3 audience rows, same template, persona-conditional content per `A20260506-07`) | `<NextStep>` CTA on `team-ssi-view.html` — "Generate Objectives from your team's results →" deep-link to objective wizard. (Per Path B convergence `A20260512-16(a)`, `team-ssi-view.html` is the canonical post-assessment landing for ALL roles.) | **AI-pilot** for primary content (per Q3: PX-5.3 prompt-regression invariants gate; on fail revert to static template) | (BO) "Your team's results are in — turn them into objectives" / (Coach) "Client X's team has completed assessments" / (team) "Thanks — your results are visible to you and your leader" | First `Objective` saved for `company_id` (i.e., `Company.stage` flips `onboarding → active`) | B.3 — `assessments.js` rollup hook + `LLMGateway.js` + `emailTemplates.js` |
| **4** | **Objective.post-save → Plan-this-KR** *(2 cohort variants — see footnote)* | First successful `Objective.save` with `owner_id` set during BO wizard authoring (C.5 wires `owner_id` capture). Fires via existing `prospect→onboarding` and/or `onboarding→active` stage flip already wired through `notifyTransition()`. | **Variant A (ext-receiver, default)**: Midfield (`owner_id` holder, any leadership role) + Coach. **Variant B (author-owns, NEW 2026-05-30 A20260530-01 P2)**: when `owner_id === created_by`, fire self-nudge to author instead of suppressing (current behaviour at [LifecycleTransitionService.js:508](../../server/services/LifecycleTransitionService.js#L508)) + Coach (consulting mode only). | `<NextStep>` hero on owner's [objectives.html?focus=`<id>`&source=email](../../client/pages/objectives.html) (S27 E.8 / A20260528-04 — destination migrated from planning-v2.html). **Variant A**: single-CTA "Plan this objective →". **Variant B (author-owns, S27 receive-side)**: 2-option hero — "Invite a Manager" → `/pages/teams.html?intent=add_manager&objective_id=<id>` + "Plan it yourself →" → existing planning flow. Coach: no inline render — awareness via email + C.4 lifecycle widget on My Clients tile. | Static template; persona-conditional one-liner (`A20260506-05` + A20260530-01 P2 variant copy) | **Variant A** (Manager) "You've been assigned an objective — plan it" / (Coach) "Client X's BO has assigned an objective to Manager Y". **Variant B** (Author-owns) "You authored AND own this objective — pick your next move: invite a Manager, or plan it yourself" / (Coach, consulting mode) "Client X's BO has authored AND assigned to themselves — consider nudging them to invite a Manager". | First `WeeklyGoal` or `Move` saved under any `KeyResult.objective_id = this`. **Persistent re-nudge** at 3/7/14/21/30 days if no completion signal (A20260530-02). | B.4 — send-side variant fires next /coding (chunk-2 of A20260530-01); receive-side `<NextStep>` 3-variant hero ships in **Sprint 27** part 2 (per page-matrix line 113 + A20260530-01 P2) |
| **5** | **Consultant lifecycle digest** | Cron tick (daily digest job, consultant-batched) | Coach (Consultant) | (No new UI — digest email only; deep-links into `my-clients.html` tiles + `client-workspace.html` tabs) | Aggregated digest (one per consultant per day) with per-client roll-up of lifecycle events: invitations sent, assessments completed, objectives created, plans started | "Review activity across your clients today" | None — informational digest; no completion gate | B.5 — `dailyDigestJob.js` extension + `User.notification_preferences` schema field (`A20260506-08`) |

### Reading the table

- **Trigger column** is the system event. Every trigger fires through `notifyTransition()` (the inline helper at [LifecycleTransitionService.js:63](../../server/services/LifecycleTransitionService.js#L63)) — **except handoffs 2 & 5**, which are cron-driven and bypass `notifyTransition` by design (no real-time event; the cron job is the trigger).
- **Receiver column** is who the system speaks to. When multiple receivers share a handoff (#3 and #4), the **same email template** is used with **persona-conditional copy** (per `A20260506-07`).
- **UI affordance column** is the receive-side surface — the place the receiver lands when they click through. The `<NextStep>` component (new in B.1, reused in B.3, B.4) is the canonical CTA primitive.
- **Email column** is the dispatch contract. Static templates use existing `emailTemplates.js` patterns. The single AI-pilot dispatcher (#3) gates on `PX-5.3` prompt-regression invariants.
- **Action column** is plain-language: what the receiver is being asked to do.
- **Completion signal column** is how the system **knows the handoff was accepted**. This is what closes the loop — without an explicit completion signal, the system can't tell whether to nudge again or move on. Every handoff that flips a stage uses a stage flip as its completion signal; the others rely on a domain artifact (Invitation row, Assessment.status, WeeklyGoal/Move).
- **Impl seam** is the S26 task ID that lands the implementation.

---

## The persistent re-nudge invariant (NEW 2026-05-30 / A20260530-01..-04)

The 5 handoffs above are **one-shot edge events**. They fire once on a state transition and assume the receiver acts. In practice, receivers stall — and today only Handoff #2 (Assessment-pending reminder) re-nudges. Every other stall (Objective unplanned, WeeklyGoal without Tasks, Task overdue) is a silent dead-end.

**Invariant**: every cascade entity (`Invitation`, `Objective`, `WeeklyGoal`, `Task`) that has not reached its completion signal gets re-nudged on a tier schedule by `dailyDigestJob.js`. Tiers 3+4 cc the consultant for second-level escalation. Owner-or-above can self-cancel any cascade entity to stop re-nudging.

### Re-nudge tier model (mirrors B.2 Invitation reminder pattern)

The canonical cron pattern at [`dailyDigestJob.js:155-280`](../../server/jobs/dailyDigestJob.js#L155) (`dueReminderTier` + `getReminderEligibleInvitations` + `sendReminderForInvitation` + `runAssessmentReminders`) is the spec. Each new entity-type cron pass mirrors this contract per `feedback_extend_before_wrap`:

- **Counter-gated**: `tier === reminders_sent` — each tier fires once; missed cron day fires on next tick.
- **Exhausted at tier 5** (test-system default; production may tighten): after 5 reminders, `reminder_exhausted_at` is stamped; owner-side cron silent; entity surfaces indefinitely in consultant lifecycle digest.
- **Idempotent**: same entity in same day cron run sends at most one reminder.
- **Status-filtered**: `status !== 'cancelled'` (existing soft-delete invariant). Cancellation pauses the entity's re-nudge timer.
- **Errors logged, never propagated**: one entity's send failure must not block siblings.

### Cadence table (locked 2026-05-30 per user direction)

| Entity | Stall definition | Tier 0 | Tier 1 | Tier 2 | Tier 3 (Consultant cc) | Tier 4 (Consultant cc) | Cron pass | Audit ID |
|---|---|---|---|---|---|---|---|---|
| `Invitation` | `status ∈ {sent, opened, in_progress}` AND no public-link | 3 d | 7 d | 13 d | — *(post-Beta migration to 5-tier — A20260530-11)* | — | `runAssessmentReminders` ✅ shipped S26 B.2 | A20260506-08 |
| `Objective` | `status='active'` AND no `WeeklyGoal` under any KR (multi-tenant filtered) | 3 d | 7 d | 14 d | 21 d | 30 d | `runObjectiveStallReminders` — **A20260530-02** (next /coding) | A20260530-02 |
| `WeeklyGoal` | `status ∈ {not_started, in_progress}` AND no `Task` under it (or all Tasks cancelled) | 3 d | 7 d | 14 d | 21 d | 30 d | `runWeeklyGoalStallReminders` — **A20260530-03** (Sprint 27) | A20260530-03 |
| `Task` | `due_date < today` AND `status ∉ {completed, cancelled, deferred}` | 1 d | 3 d | 7 d | 14 d | 21 d | `runTaskOverdueReminders` — **A20260530-04** (Sprint 27) | A20260530-04 |

**Why these cadences**: Objective + WeeklyGoal are weeks-to-months-scale entities — sparse re-nudges respect their natural rhythm. Tasks are daily-scale — denser re-nudges match the work cadence.

**Why 5 tiers + tiers 3-4 cc consultant**: User direction 2026-05-30 — test-system context wants more reminders than production-tight defaults; tiers 3+4 escalate to consultant per "consultants follow up as second-level escalation". After tier 4, owner-side cron silent — but consultant digest surfaces the exhausted entity indefinitely until completion or cancel.

### Re-delegation rules (NEW 2026-05-30 / A20260530-01 P3)

Re-delegation = changing `owner_id` on a saved cascade entity. The strict-`owner_id` BE gate (A20260527-01 + A20260528-03) enforces presence at create; re-delegation is the post-create owner-change path.

| Role | Can author? | Can assign `owner_id` at create? | Can reassign `owner_id` post-create? | Reassign scope |
|---|---|---|---|---|
| `CONSULTANT` | No (initiates, doesn't author) | Yes (consultant-scoped APIs) | Yes (managed clients only) | Anyone on `/eligible-owners` list for that tenant |
| `BUSINESS_OWNER` | Yes | Yes | Yes | Anyone on `/eligible-owners` list (incl. self) |
| `EXECUTIVE` | Yes | Yes | Yes | Anyone on `/eligible-owners` list (incl. self) |
| `MANAGER` | Yes (when assigned ownership) | Yes (when authoring) | Yes (when they ARE the current owner — can re-delegate downward) | Anyone on `/eligible-owners` list (incl. self) |
| `EMPLOYEE` | No | No | **No** | — |

**Re-delegation dispatcher**: when `owner_id` changes post-save, B.4 fires again to the new owner with "handed to you by `{previous_owner.name}`" copy variant (Sprint 27 / A20260530-05). The previous owner is NOT notified — clean handoff, no clutter.

**Eligible-owners endpoint**: [`/api/teams/eligible-owners`](../../server/routes/teams.js#L202) returns Managers + Executives + the caller (scoped by tenant, caller-first sort). Closes [teams.js:233 role-filter drift](../../server/routes/teams.js#L233) — pre-2026-05-30 endpoint returned `MANAGER`-only despite BE accepting `EXECUTIVE` as `owner_id`.

### Cancel rules (NEW 2026-05-30 / A20260530-01 P4)

Self-cancel = soft-deleting a cascade entity by setting `status='cancelled'`. Stops re-nudge cron; existing cascade preserves data (parent.status untouched; aggregate progress excludes cancelled children).

| Role | Can cancel Objective? | Can cancel KR? | Can cancel WeeklyGoal? | Can cancel Task? |
|---|---|---|---|---|
| `CONSULTANT` | Yes (managed clients) | Yes (managed clients) | Yes (managed clients) | Yes (managed clients) |
| `BUSINESS_OWNER` | Yes (own company) | Yes (own company) | Yes (own company) | Yes (own company) |
| `EXECUTIVE` | If owner-or-above | If owner-or-above | If owner-or-above | If owner-or-above |
| `MANAGER` | If `owner_id === self` | If `owner_id === self` | If `owner_id === self` | If `owner_id === self` |
| `EMPLOYEE` | **No** | **No** | **No** | If `assigned_to === self` (their own Tasks only) |

**Cancel UX surface**: per-entity card or detail row "Mark cancelled" CTA (Sprint 27 / A20260530-06). Confirmation dialog cites cascade impact ("This will mark N child WeeklyGoals as cancelled too" — depends on completion-aggregation cron).

**Reactivation**: out of scope for Beta. `status='cancelled'` is one-way; revert requires consultant or BO via BE-only operation.

### Consultant digest stall surface (A20260530-02 part 2 — extends B.5)

The existing consultant lifecycle digest at [`dailyDigestJob.js:331+`](../../server/jobs/dailyDigestJob.js#L331) (B.5 / `runConsultantLifecycleDigest`) gains a "Needs Your Follow-up" section per A20260530-02. Rolls up:
- Objectives at tier ≥ 3 (consultant cc'd already, but digest also surfaces for inbox-deferral cases)
- Exhausted entities (tier ≥ 5) — indefinite digest surfacing
- Re-delegation events in last 24h
- Self-cancel events in last 24h

Dedicated "Needs Attention" surface on `client-workspace.html` (with manual nudge buttons that re-fire the dispatcher pre-tier) lands in Sprint 29 backlog / A20260530-09.

---

## Cohort-mode detection (A.3)

Karvia operates in two cohort modes per [PERSONA_STAGE_OWNERSHIP_MATRIX.md §Cohort Modes](PERSONA_STAGE_OWNERSHIP_MATRIX.md#cohort-modes-added-2026-05-06). The activation playbook is **cohort-aware** on first-touch — emails and CTAs adapt language without forking templates.

### Detection rule

A company is in **consulting** mode if it has any **active consultant relationship**; otherwise **self-serve**.

```
isConsultingMode(company_id) :=
  exists Consultant u such that:
    u.role = 'CONSULTANT'
    AND u.company_id = company_id            // tenant scoping invariant
    AND u.status = 'active'
    AND there is an active engagement / managed-client link
       (canonical surface: same predicate used by `requireManagedClient` middleware
        — see `server/middleware/auth.js` / consultant-scoped APIs)
```

> **Grounding note**: The exact predicate used by `requireManagedClient` is the source of truth. This playbook references the middleware rather than re-deriving the predicate to avoid drift. If the predicate evolves (e.g., explicit `Engagement` collection in a future sprint), the playbook auto-tracks via that reference.

### First-touch dispatch table

| Handoff | Consulting-mode copy (one-liner) | Self-serve copy (one-liner) |
|---|---|---|
| **#1** (profile-complete → BO) | "Your consultant **{Coach.name}** has set up your profile — invite your team to take the assessment." | "You've set up your company profile — invite your team to take the assessment." |
| **#2** (assessment reminder) | "Your assessment was sent by **{Coach.name}**. 5 minutes, your team's waiting." | "Your assessment from **{Company.name}** is waiting. 5 minutes, your team's counting on you." |
| **#3** to BO (results ready) | "Your team's assessment results are in. **{Coach.name}** will review with you — open the results to start authoring objectives together." | "Your team's assessment results are in. Open the results to start authoring objectives." |
| **#3** to Coach (results ready) | (only sent in consulting mode) "Your client **{Company.name}** has completed team assessments. Open their workspace to author objectives with them." | (skipped in self-serve mode — no consultant to notify) |
| **#3** to team (results ready) | "Thanks for taking the assessment — your individual results are visible to you, and your team's leader is now reviewing the consolidated results with **{Coach.name}**." | "Thanks for taking the assessment — your individual results are visible to you, and **{BO.name}** is now reviewing the consolidated results to plan next steps." |
| **#4** to Manager (plan this) | "**{BO.name}** has assigned you an objective — plan it. Your consultant **{Coach.name}** is watching for the plan to land." | "**{BO.name}** has assigned you an objective — plan it." |
| **#4** to Coach (audit) | (only sent in consulting mode) "**{BO.name}** at **{Company.name}** has authored an objective and assigned it to **{Manager.name}**." | (skipped) |
| **#5** (consultant digest) | (only sent in consulting mode) | (skipped — no consultant) |

### Why persona-conditional, not template-forked

Templates duplicate the work of every future change. Persona-conditional one-liners (same template, branch on `isConsultingMode` + receiver role) keep one place to edit copy. This is the pattern locked by `A20260506-07` (extends to all 5 handoffs).

---

## Architectural invariants (cross-cutting)

These hold across every handoff. Each row is a non-negotiable; deviations require an explicit audit-tracker entry.

| Invariant | Source | What it forbids |
|---|---|---|
| **Inline branches, not event-bus** | Cross-sprint audit 2026-05-06, Group 2a — locked at [LifecycleTransitionService.js:40-44](../../server/services/LifecycleTransitionService.js#L40-L44) | NO listener-registry, NO pub-sub. Each S26 handoff adds an `if` branch in `notifyTransition()` body for its `(service, fromStage, toStage)` tuple. |
| **Errors logged, never propagated** | Same; locked at [LifecycleTransitionService.js:42-44](../../server/services/LifecycleTransitionService.js#L42-L44) | A failed email MUST NOT block the underlying lifecycle flip. All dispatcher branches wrap in try/catch and `console.error`. |
| **`APP_URL` as sole URL source** | `A20260512-13`; [EMAIL_DEEP_LINK_CONTRACT.md](../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) | No `FRONTEND_URL`. No `||` fallback chains. No hardcoded hosts. Boot-time fail-fast in production. |
| **Tenant isolation** | Multi-tenant invariant ([CLAUDE.md](../../CLAUDE.md#multi-tenancy)) | Every dispatcher query filters by `company_id`. No cross-tenant joins. |
| **Same template per `(service, fromStage, toStage)` regardless of trigger source** | [LifecycleTransitionService.js:45-46](../../server/services/LifecycleTransitionService.js#L45-L46) | Auto-eval and manual-override paths fire the **same** dispatcher branch. |
| **Soft-completion preferred over hard-cancel** | [CLAUDE.md](../../CLAUDE.md#known-constraints) | Receivers that "skip" a handoff don't delete the trigger; they leave the completion signal unmet and the cron reminders take over (handoff #2 pattern). |
| **AI-pilot has static fallback** | Q3 lock + `PX-5.3` prompt regression | Handoff #3 AI dispatcher gates on `PX-5.3` invariants; on fail, static template ships and a refinement-track log entry is written. |

---

## What this playbook does NOT do (anti-overreach)

These are **explicitly out of scope** for S26. Surfacing them here so future sessions don't slip and re-litigate.

- ❌ **No event-bus / listener-registry / message-queue infrastructure.** Inline branches only.
- ❌ **No new `Notification` collection** for delivery state. Lifecycle history is the audit trail; email logs are dispatcher-side concerns.
- ❌ **No per-consultant reminder cadence tuning UI.** Q2 defers `User.notification_preferences` UI to refinement track. Schema field lands in B.5; UI in Sprint 27 (or refinement track if cohort feedback says it doesn't matter).
- ❌ **No `<NextStep>` component for handoffs beyond B.1 / B.3 / B.4 in this sprint.** Other surfaces (e.g., dashboard) stay with existing empty-state copy until cohort feedback justifies expansion.
- ❌ **No Sprint 27 receive-side surfaces.** B.4 send-side fires the email; the Manager's "Plan this KR" CTA on dashboard ships in S27 per the carry-forward.
- ❌ **No handoff for Stages 3-5** (sustained-mode lifecycle, KR completion, alumni-watch). Those are Sprint 27 / 28 scope.
- ❌ **No template inheritance hierarchy.** One template per handoff with persona-conditional branches. Future framework switches (e.g., GRIT/BBB/PBL per [ASSESSMENT_LIFECYCLE.md](../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) plug-in seams) reuse the same dispatch shape; no new email infrastructure.

---

## The `<NextStep>` component contract (cross-handoff)

The same UI primitive lands receive-side surfaces for handoffs **#1, #3, and #4**. Owned by `client/js/next-step.js` (NEW in B.1); reused in B.3 (`team-ssi-view.html`) and B.4 receive-side (Sprint 27).

### Shape

```js
// client/js/next-step.js
window.NextStep.render(container, {
  headline:      String,    // "Your team's assessment results are in"
  body:          String,    // optional one-line subtext
  cta_label:     String,    // "Generate Objectives →"
  cta_href:      String,    // built with APP_URL per EMAIL_DEEP_LINK_CONTRACT
  cta_kind:      'primary' | 'secondary',
  dismissible:   Boolean,   // true for soft-skip; false for blocking handoffs
  telemetry_key: String     // e.g., 'next_step.profile_complete.bo'
});
```

### Invariants

| # | Rule |
|---|---|
| 1 | All user-supplied text fields HTML-escaped via existing `escapeHtml()` ([CLAUDE.md](../../CLAUDE.md#security-patterns)) |
| 2 | `cta_href` MUST be built from `process.env.APP_URL` (backend) or a relative path (frontend) — never a hardcoded host |
| 3 | Telemetry fires `next_step.shown` on render, `next_step.cta_clicked` on click, `next_step.dismissed` on dismiss |
| 4 | Same component for **shown=email-driven** and **shown=session-driven** (e.g., post-save inline reveal) — no fork |
| 5 | Cohort-aware copy is the **caller's** responsibility (caller passes the right `headline`/`body`); component is presentation-only |

### Why the same component for 3 handoffs

Per the page-impact matrix (line 101), `<NextStep>` is shared across B.1, B.3, B.4. Designing the contract once at B.1 prevents 3 retrofits and locks the telemetry shape for cross-handoff analytics ("how many BOs convert at #1 vs. #3 vs. #4?").

### Single-CTA rule (Q-PB-3 resolved at A.4)

`<NextStep>` is **single-CTA only** — one primary action, no stacked primary+secondary. Secondary paths live on the host page itself (tabs, page-level read affordances). The component elevates *the* primary next action; if a handoff feels like it needs two CTAs, that is a signal the handoff is doing two jobs.

Component shape locks this — `opts` accepts one `{cta_label, cta_href, cta_kind}` triple, not an array.

### Role-aware caller recipes — B.3 (now) + B.4 (Sprint 27 receive-side)

The component is presentation-only; the caller decides whether to render at all, and what copy/CTA to pass per viewer role. Below is the locked recipe so that B.3 ship and B.4 S27 ship are mechanical.

#### B.3 — `team-ssi-view.html` post-aggregate-complete

| Viewer role | Render? | Headline (caller passes) | CTA label / href | `dismissible` | `telemetry_key` |
|---|---|---|---|---|---|
| `BUSINESS_OWNER` / `EXECUTIVE` | Yes (always when aggregate-complete) | "Your team's results are in" | "Generate Objectives →" / `/pages/objective-wizard.html` | `false` (blocking — BO is the driver of next stage) | `next_step.aggregate_complete.bo` |
| `CONSULTANT` (cross-tenant via `?company_id=`) | Yes (always when aggregate-complete, consulting mode only) | "Client **{company.name}**'s team completed assessments" | "Open Workspace →" / `/pages/client-workspace.html?client=<id>#tab=objectives` | `false` (blocking — Coach drives in consulting mode) | `next_step.aggregate_complete.coach` |
| `MANAGER` | **No inline render** — Manager has no driver action at handoff #3. Their next step is handoff #4 (B.4) on a different surface (`planning-v2.html`). Keeping the 4-actor ownership crisp. | — | — | — | — |
| `EMPLOYEE` | Yes — but **email-driven only**: render only if URL carries `?source=email`. Avoids cluttering session-driven daily logins of team members who already saw their results. | "Thanks — your team's results are in" | (no CTA — informational; caller passes empty `cta_label`/`cta_href` and `dismissible: true`) | `true` | `next_step.aggregate_complete.employee` |

> **Why no inline render for Manager**: handoff #4 is the Manager's NextStep moment. They land on `planning-v2.html` from the B.4 email (single-hop, see below). Rendering an inline banner on `team-ssi-view.html` would pre-empt the wrong page and break the 4-actor ownership invariant.

#### B.4 — Sprint 27 receive-side forward reference

| Viewer role | Landing page | Render? | Headline (caller passes) | CTA label / href | `dismissible` | `telemetry_key` |
|---|---|---|---|---|---|---|
| `MANAGER` (assigned `owner_id`) | `/pages/planning-v2.html?objective_id=<id>&source=email` (single-hop; matches [PERSONA_STAGE_OWNERSHIP_MATRIX.md line 79](PERSONA_STAGE_OWNERSHIP_MATRIX.md#page-ownership-the-toothpaste-test): `"Planning | ★ Manager"`) | Yes (hero card above planning surface) | "**{BO.name}** assigned you an objective — plan it" | "Plan this objective →" / anchor-link to the objective's planning surface within the page | `false` (blocking — Manager is the driver of next stage) | `next_step.objective_handoff.manager` |
| `CONSULTANT` (audit/awareness copy) | (no inline render — Coach is in observer mode at handoff #4 per ball-position table line 45 `"Coach reads via workspace"`) | **No inline render** — awareness lives in the email + the My Clients tile lifecycle indicator (C.4 widget). Avoids redundant nudges across surfaces. | — | — | — | — |

> **Why Manager lands on `planning-v2.html`, not `objectives.html`**: `objectives.html` is BO-owned per matrix; Manager would be visiting a non-owned page. Single-hop to the Manager's owned planning page respects page ownership and matches the matrix verbatim. The B.4 email CTA builds with `${APP_URL}/pages/planning-v2.html?objective_id=<id>&source=email`.

---

## Implementation seam reference (for S26 Workstream B)

Each row below maps a handoff to the specific code surface where its dispatcher branch lands. Coding sessions reference this section directly.

### Handoff #1 — Profile-complete → BO (B.1, **next coding session**)

| Concern | Surface |
|---|---|
| Trigger event | `company-profile.html` POST save success (route in `server/routes/companies.js`). On first time all required fields meet "profile complete" predicate → call `companyStageInstance.appendHistoryOnly(...)` with actor `'system:profile_complete'` and note `'profile complete'`. **No stage flip** — `Company.stage` stays `prospect` until POC invitation accepted (existing semantics preserved). |
| `notifyTransition` extension | Extend [LifecycleTransitionService.js:63-70](../../server/services/LifecycleTransitionService.js#L63-L70) to (1) add a call site on the history-only path at line ~120 with the same payload shape, but with `fromStage`/`toStage` both null and an additional `historyActor` field; (2) add an `if` branch in `notifyTransition` body matching `service==='company_stage' && historyActor==='system:profile_complete'`. |
| Email template | New mailjet method `sendCompanyProfileCompleteEmail` (extends `MailjetService.prototype` per the S22a `sendInvitationLinkEmail` pattern). Cohort-conditional one-liner per the dispatch table above. Reads recipient + cohort from payload; CTA href is **`${process.env.APP_URL}/pages/company-profile.html?source=email`** verbatim per [EMAIL_DEEP_LINK_CONTRACT.md §4 row 1](../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md#4-the-five-dispatcher-deep-links-s26--s27) (canon). The email lands BO back on `company-profile.html`; receive-side `<NextStep>` (next row) renders the "Invite Your Team →" CTA which deep-links into the invitation flow at `/pages/assessment-hub.html`. |
| Receive-side UI | `<NextStep>` rendered on `company-profile.html` via two triggers (same component, same payload, same telemetry_key `next_step.profile_complete.bo`): (i) **session-driven** — predicate flips FALSE → TRUE this session (synchronous nudge on post-save); (ii) **email-driven** — URL carries `?source=email` per [EMAIL_DEEP_LINK_CONTRACT.md §6 receive-side contract](../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md#6-receive-side-contract-nextstep-slot) (asynchronous nudge on email-landing). The inline `<NextStep>`'s CTA deep-links to `/pages/assessment-hub.html` (where the canonical Invite Team Member modal lives at [assessment-hub.html:842](../../client/pages/assessment-hub.html#L842)). |
| Completion signal | First `Invitation` row created for `company_id`. The dispatcher logs this expectation in telemetry; closing the loop is achieved by handoff #2's cron NOT firing reminders once invitations exist *and* assessments complete (transition to handoff #3). |
| Idempotency | History-only marker is appended once (idempotent at the predicate level — check `stage_history` for an entry with `actor='system:profile_complete'` before appending). Email also gates on "first marker only" to prevent duplicate sends if the BO re-saves the profile. |
| Test surface | New `scripts/test-sprint26-B.1-profile-complete-dispatcher.js` — fixture: prospect company with all required profile fields just-saved; assert (a) history entry written once, (b) `notifyTransition` body branch fires once, (c) email template renders correct cohort copy, (d) idempotent on repeated saves. |

### Handoff #2 — Assessment-pending reminder (B.2)

See [SPRINT26_PAGE_MATRIX.md](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_PAGE_MATRIX.md#L39) row B.2. Cron-driven; `dailyDigestJob.js` extension reads `Invitation.reminder_schedule`. Cadence locked at **3 / 7 / 13 days** (Q2). Regression test in **B.7** (`A20260513-03`).

### Handoff #3 — Assessment-aggregate-complete (B.3)

See [SPRINT26_PAGE_MATRIX.md](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_PAGE_MATRIX.md#L40) row B.3. **Depends on E.1 + E.2 ✓** (`A20260513-01`) — threshold reads canonical `Company.assessment_scores`. AI-pilot gating per Q3. Receive-side `<NextStep>` ships on [team-ssi-view.html](../../client/pages/team-ssi-view.html) per Path B convergence (`A20260512-16(a)`).

### Handoff #4 — Objective.post-save (B.4)

See [SPRINT26_PAGE_MATRIX.md](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_PAGE_MATRIX.md#L41) row B.4. **Depends on C.5** (`owner_id` capture in wizard ✓ shipped 2026-05-13). Send-side only in S26; receive-side `<NextStep>` consumer ships in Sprint 27. Regression test in **B.8** (`A20260513-04`).

**Email CTA target (locked at A.4 / AMENDED at /strategy-mini 2026-05-28 — see changelog)**:

- **Original (2026-05-13 A.4 lock)**: `${APP_URL}/pages/planning-v2.html?objective_id=<id>&source=email` — single-hop to Manager's owned page per [PERSONA_STAGE_OWNERSHIP_MATRIX.md line 79](PERSONA_STAGE_OWNERSHIP_MATRIX.md#page-ownership-the-toothpaste-test) `"Planning | ★ Manager"`.
- **Current (Sprint 27 E.8 / A20260528-04 — 2026-05-29)**: `${APP_URL}/pages/objectives.html?focus=<id>&source=email` — destination changed per /strategy-mini 2026-05-28 lock making objectives.html the sole KR-creation surface (Manager arrives there for E.4 card state-CTAs + E.1c wizard add_krs mode). Matrix line 79 page-ownership invariant preserved at the strategy level — Manager still has the "Planning" pageownership; the email simply routes them to add KRs first when an objective lands with none.

Receive-side `<NextStep>` recipe in §`<NextStep>` component contract above.

**Coach audit copy**: email-only; no inline `<NextStep>` render on `client-workspace.html`. Awareness in-app lives in the C.4 My Clients tile lifecycle widget. This prevents redundant Coach nudges across surfaces (email + workspace + tile = noise; email + tile = signal).

### Handoff #5 — Consultant lifecycle digest (B.5)

See [SPRINT26_PAGE_MATRIX.md](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_PAGE_MATRIX.md#L42) row B.5. Cron-driven; `dailyDigestJob.js` extension + `User.notification_preferences` field add (`A20260506-08`).

---

## A.4 — Lock criteria (DRAFT → ACTIVE) ✅ CLOSED 2026-05-13

This document was 🟡 DRAFT until **all four** of the following held:

- [x] **B.1 shipped** — handoff #1 row implemented end-to-end, regression green (54/54 ✓ session #233 2026-05-13). Validates the {trigger, receiver, UI, email, action, completion-signal} shape works in code.
- [x] **`<NextStep>` contract validated against B.3 + B.4 design constraints** — locked at A.4 close: single-CTA rule (Q-PB-3 resolved), role-aware caller recipes table for B.3 (BO + Coach render; Manager + Employee gated) and B.4 receive-side (Manager → `planning-v2.html` single-hop; Coach no inline). Component contract holds; no shape change needed.
- [x] **Cohort-mode detection wired** — `isConsultingMode(company_id)` concrete implementation shipped in `server/utils/cohortDetection.js` (B.1 session #233 2026-05-13).
- [x] **No open contradictions vs. [PERSONA_STAGE_OWNERSHIP_MATRIX.md](PERSONA_STAGE_OWNERSHIP_MATRIX.md)** — sweep complete at A.4 close: (1) page co-ownership note added to §4 actors table (matrix line 77 canonical for Dashboard co-ownership); (2) B.4 Manager CTA realigned to `planning-v2.html` (matrix line 79 canonical for Planning ownership); (3) ball-position 5-state vs matrix 3-state confirmed as compatible extension, cross-ref added to matrix.

Flipped `Status: 🟡 DRAFT` → `Status: ✅ ACTIVE` + genome `DRAFT` → `ACTIVE` at this commit. A.4 closed.

---

## Open questions (deferred)

Filed here so they're not lost. None block S26.

| # | Question | Deferred to |
|---|---|---|
| Q-PB-1 | Should handoff #3's AI-pilot eventually escalate to per-recipient personalization (currently one rendered email per audience tier)? | Refinement track, post-Beta-1 |
| Q-PB-2 | When a Company switches consulting → self-serve mid-engagement (consultant churned out), do retroactive email templates re-render? Or only forward-looking? | Open; flag if it occurs |
| ~~Q-PB-3~~ | ~~Should the `<NextStep>` component support stacked CTAs (primary + secondary action) or strictly one CTA per handoff?~~ | **RESOLVED 2026-05-13 at A.4 close** — single-CTA only. See §`<NextStep>` component contract → "Single-CTA rule". |
| Q-PB-4 | What's the right telemetry retention window for `next_step.*` events? | Refinement track |
| Q-PB-5 | Future framework families (GRIT/BBB/PBL per [ASSESSMENT_LIFECYCLE.md](../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) plug-in seams) — do they get their own handoff #3 templates, or extend the existing one? | Triggered when a 2nd family is actually scoped |

---

## Cross-references

- [PERSONA_STAGE_OWNERSHIP_MATRIX.md](PERSONA_STAGE_OWNERSHIP_MATRIX.md) — static who-drives-what (canonical companion to this doc)
- [EMAIL_DEEP_LINK_CONTRACT.md](../2-TECHNICAL/EMAIL_DEEP_LINK_CONTRACT.md) — URL build contract; all CTAs in this playbook MUST conform
- [ASSESSMENT_LIFECYCLE.md](../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) — assessment plug-in seams; handoff #3's framework-extension question lives here
- [LifecycleTransitionService.js](../../server/services/LifecycleTransitionService.js) — `notifyTransition()` inline-helper foundation; every handoff branch lands in its body
- [SPRINT26_PAGE_MATRIX.md](../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_PAGE_MATRIX.md) — task decomposition; this playbook is the doc-output of **A.1 + A.2 + A.3**
- [BETA_LAUNCH_CHECKLIST.md](../3-DELIVERY/3-RELEASE-ENGINEERING/BETA_LAUNCH_CHECKLIST.md) — acceptance gating; 5-verb test green is the final lock

---

## Changelog

| Date | Change | By |
|---|---|---|
| 2026-05-13 | Initial draft (A.1 + A.2 + A.3). Status: DRAFT. Awaits A.4 lock criteria. | /coding 2026-05-13 |
| 2026-05-13 | **A.4 close — flipped DRAFT → ACTIVE.** Added single-CTA rule (Q-PB-3 resolved). Added role-aware caller recipes sub-table for B.3 (now) + B.4 (S27 forward-reference). Amended handoff #4 master row + §B.4 Impl seam: Manager CTA → `planning-v2.html?objective_id=<id>&source=email` (single-hop per matrix line 79). Added page co-ownership note to §4 actors table referencing matrix line 77. Coach receive-side at handoff #4 = email + C.4 widget only (no inline). | /strategy 2026-05-13 |
| 2026-05-29 | **Handoff #4 (B.4) CTA destination amended — Sprint 27 E.8 / A20260528-04.** Manager email CTA changed from `planning-v2.html?objective_id=<id>&source=email` → `objectives.html?focus=<id>&source=email` per /strategy-mini 2026-05-28 lock making objectives.html the sole KR-creation surface (Manager arrives there for E.4 card state-CTAs + E.1c wizard add_krs mode). Matrix line 79 page-ownership invariant preserved at the strategy level — destination change is a routing concession to where the KR-add UI lives, not a re-assignment of page ownership. Body text §B.4 Impl seam updated with both original + current targets. Code: `LifecycleTransitionService.js:518-521` + `mailjetService.js:1031-1037` docstring. Contract: EMAIL_DEEP_LINK_CONTRACT row 4a updated. Regression: `test-sprint26-B.4-objective-handoff.js` assertions [3] migrated. | /coding 2026-05-29 |
