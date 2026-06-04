# Epic G Dashboard V3 — Refined Scoping Doc

<!-- @GENOME T3-SPR-023-EG-REFINED | DRAFT | 2026-05-01 | parent:T3-SPR-023-MP | auto:/coding | linked:/strategy,/design -->

**Sprint**: 23
**Session**: #192-prep (pre-coding refinement)
**Source spec**: [EPIC_G_DASHBOARD_UI.md](./EPIC_G_DASHBOARD_UI.md) — original spec, predates the YSELA framing crystallization captured here
**Source mockup**: [sprint_mockups/sprint-22/dashboard-v3.html](../../sprint_mockups/sprint-22/dashboard-v3.html) — the v1 we're building
**Status**: DRAFT — discussion scaffold; §11 open for our walkthrough; no implementation until §14 sign-off

---

## §0. Why This Refinement Exists

The original Epic G spec was written in April 2026 before the YSELA philosophy, BBB framework, and 5-layer cascade had fully crystallized as a single coherent narrative. After researching the canonical docs end-to-end (ECOSYSTEM_ARCHITECTURE.md, YSELA_PHILOSOPHY.md, BBB_FRAMEWORK.md, the YSELA Operating Model white papers 00–05, iBrain SHARED_GLOSSARY.md), four reframings are needed before we touch code:

1. The dashboard is **role-agnostic**, not "the executor's page."
2. Planning, execution, and reflection are **continuous**, not weekly-sliced.
3. KARVIA produces **Tasks**; YSELA presents the behavior-building subset as **Moves** at an explicit handoff.
4. BBB ("can behaviors lead to right outcomes? if so, which?") is a **hypothesis we are testing**, not an answer we are delivering. The dashboard is the experimental surface.

This doc captures those reframings, restates Epic G's scope through them, and leaves the final design questions in §11 for collaborative resolution before code.

---

## §1. The BBB Hypothesis We Are Testing

> **Hypothesis (BBB):** If the right behaviors are built and repeated, the right outcomes follow.
>
> **Open question (we don't yet have an answer):** Which behaviors? In what combination? For whom? Under what conditions?

This dashboard is **not** a polished output of a working theory. It is a credible first instance of the BBB hypothesis-testing engine — built from what KARVIA already has, presented through YSELA's behavior lens, designed to be **replaced piece by piece** as we observe what works.

**Design implication:** every element on the dashboard gets shipped *with the mockup's framing* AND with a documented seam for replacement. We're not committing to "Accountability / Growth / Maturity / Discipline are the right disciplines forever" — we're committing to "let's render these for v1 and watch what users do."

The BBB philosophy doc (BBB_FRAMEWORK.md L526–540) names the underlying belief plainly:

> "When behaviors change, outcomes follow. Not because people try harder, but because the system makes the right behavior natural."

This dashboard is the place where the system tries to make that natural. We don't yet know if it succeeds. That's the test.

---

## §2. The Continuous Loop, Not the Weekly Cadence

A correction to my earlier reading. YSELA_PHILOSOPHY.md L388–415 presents an "Operating Rhythm" of Mon=plan, Tue–Thu=execute, Fri=reflect. **That's a teaching device, not a hard schedule.**

**The actual operating reality is continuous:**

```
                  ┌────────────────────────────────────┐
                  │   CONTINUOUS LOOP                   │
                  │   (no day-of-week boundaries,       │
                  │    no role boundaries)              │
                  │                                     │
                  │   Plan ──→ Identify Moves ──→      │
                  │    ▲                       │       │
                  │    │                       ▼       │
                  │   Reflect ◀── Execute ◀──          │
                  └────────────────────────────────────┘
```

A consultant might be planning at 10am, executing a Move at 11am, reflecting on yesterday's outcome at 11:15am. A business owner the same. An employee the same. The dashboard doesn't gate by day or by role — it shows whatever Move is in front of the actor right now.

**Design implication:** the dashboard is the **always-available execution surface** — the one page where any role, at any time, can see the Moves in their lane and act.

---

## §3. The 5-Layer Cascade With Explicit Handoff

KARVIA's OKR engine and YSELA's behavior layer are **separate concerns** with a clean handoff between them. The cascade reads:

```
1. OBJECTIVES                      What everyone is chasing.
   (set by stakeholder —            E.g., RR Homes business owner says
    e.g., business owner)           "I want an org chart for the company."
        │
        ▼
2. KEY RESULTS                     The consultant identifies what
   (consultant breaks               measurable outcomes constitute
    the objective down)             progress.
                                    E.g., (a) all roles documented,
                                          (b) all stakeholders informed,
                                          (c) chart implemented + adopted.
        │
        ▼
3. WEEKLY GOALS / PLAN             The realistic path to each KR,
   (planning page —                 documented and agreed.
    already built)
        │
        ▼
4. TASKS                           Daily consumable units.
   (planning page —                 ◀── KARVIA STOPS HERE ──
    already built)
        │
   ════════════ HANDOFF POINT ════════════════════════════════
        │
        ▼
5. MOVES                           YSELA takes Tasks and asks:
   (presented on dashboard)         "Which of these, repeated, build
                                     a behavior? For whom?"
                                    Then presents them to all actors
                                    (top to bottom) as a Play.
```

### The org-chart worked example

Same Objective. Same KRs. Same plan. Different Moves per actor:

| KARVIA Task (planning page) | YSELA Move (dashboard) | For whom |
|---|---|---|
| "Interview Manager X about role responsibilities" | **Move:** Conduct the interview | Consultant |
| (same task, fans out) | **Move:** Show up, answer honestly | Manager X |
| "Distribute draft chart to leadership" | **Move:** Send the draft | Consultant |
| (same task, fans out) | **Move:** Review and respond within 48h | Each leadership member |
| "Hold adoption workshop" | **Move:** Lead the workshop | Consultant |
| (same task, fans out) | **Move:** Attend, ask 1 clarifying question | Each employee |

**The same KARVIA Task can become different Moves for different actors** — that's what makes the dashboard a Play surface (per MOP §6, paper 03_MISSIONS_OUTCOMES_PLAYS.md L122–135), not just a task list.

For #192 we render Moves with at-most-1 assignee (the existing schema). Multi-actor fan-out is captured in §8 as a future capability.

---

## §4. The "Use What's There" Principle

**Inventory of what KARVIA already has** (do NOT rebuild any of these):

| Component | Status | Where |
|---|---|---|
| `Objective` model with `discipline_ids[]` | Shipped S23 #190 | server/models/Objective.js |
| `KeyResult` (embedded + standalone) | Shipped S23 #190 | server/models/Objective.js (embedded), server/models/KeyResult.js (standalone) |
| `Goal{QUARTERLY}` / `Goal{WEEKLY}` (legacy) | Shipped pre-S22 | server/models/Goal.js |
| `WeeklyGoal` (new canonical) | Shipped S22 #176 | server/models/WeeklyGoal.js |
| `Task` (legacy daily unit) | Shipped pre-S22 | server/models/Task.js |
| `Move` (post-Beta canonical, with `move_type ∈ {action, reaction, habit}`) | Shipped S22 #176 | server/models/Move.js |
| Planning page with full Objective→KR→Goal→Task cascade | Shipped + simplified S23 #191b–h | client/pages/planning-v2.html |
| `/api/moves/*` route | Shipped | server/routes/moves.js |
| 4 foundations / discipline taxonomy | Shipped S23 #190 | server/config/disciplines.js |
| LLMGateway + AIContextService | Shipped S22a Phase 2.x | server/services/ |

**What we are NOT building in #192:**

- ❌ A new data layer or new collection.
- ❌ A schema migration of `Move.move_type` enum (display rename only).
- ❌ A new cascade. The existing 5-layer cascade is the cascade.
- ❌ A new Task→Move filter algorithm. Moves are whatever already lives in the Move collection.
- ❌ Multi-actor Plays (one Move can today have one assignee — see §8).
- ❌ Reflection page or weekly-rhythm enforcement.
- ❌ iBrain integration wiring (Phase 1 telemetry foundation is Q2 2026).

**What we ARE building in #192:**

- ✅ A role-agnostic dashboard page that renders existing Moves through the BBB lens.
- ✅ Navy/gold theme + display-only `Habit → Behavior` rename.
- ✅ One new aggregator endpoint `GET /api/moves/dashboard-summary` that joins existing data without inventing schema.
- ✅ The mockup at `sprint_mockups/sprint-22/dashboard-v3.html` as the v1 layout.
- ✅ Documentation of every "seam" so a piece can be replaced post-Beta without rewriting the page.

The dashboard's job is **to filter, reframe, and distribute** existing entities through a behavior+role lens. Not to invent.

---

## §5. The Role-Agnostic Dashboard

**One dashboard. All roles see it. Same layout, same language.**

What changes per role:

| Role | Visible scope (data) | Permitted actions |
|---|---|---|
| `CONSULTANT` (on own tenant) | Own Moves only (consultant-tenant data) | Complete / Postpone / Reassign / Edit |
| `BUSINESS_OWNER` | All company Moves (filterable) | Complete / Postpone / Reassign / Edit / Delete |
| `EXECUTIVE` | All company Moves in own departments | Complete / Postpone / Reassign / Edit |
| `MANAGER` | Own + team Moves | Complete / Postpone / Reassign (team only) / Edit |
| `EMPLOYEE` | Own Moves only | Complete / Postpone / (no Reassign) / Edit own |

What stays the same regardless of role:

- Layout (KPI strip, group switch, catch-up tiles, causal-chain cards, chores list)
- YSELA voice and copy
- BBB causal-chain rendering per card
- Empty-state copy
- Mobile responsiveness

**The consultant's own dashboard ≠ a managed client's dashboard.** A consultant viewing a managed client's data goes through `my-clients.html` → client workspace (existing flow, unchanged). The consultant's *own* dashboard shows the consultant tenant's Moves, like any tenant.

---

## §6. Element-by-Element Framing

Each element gets: (a) the philosophical anchor, (b) the data dependency, (c) the "v1 proposal — replaceable" note naming the seam for future iteration.

### 6.1 KPI strip — `83 moves · 85% this week · ▲`

- **Anchor:** BBB Part 6 ("Behavior Metrics (Leading) + Outcome Metrics (Lagging)") + iBrain SHARED_GLOSSARY (Momentum is iBrain-owned).
- **Data:** quarter-to-date Move completion count; this-week completion rate; momentum arrow (period-over-period delta).
- **v1 proposal — replaceable:** Today computed by KARVIA from local Move + Task collections. Post-Beta, "Momentum" can be replaced by an iBrain-computed signal (per `iBRAIN_Integration/INTEGRATION_OVERVIEW.md` Phase 2). The labels "moves / this week / ▲" are first-pass — A/B candidates: "behaviors built / consistency / trajectory."

### 6.2 Group switch — `All / Objective / Behavior`

- **Anchor:** Two BBB axes — the cascade axis (group by parent Objective) vs the discipline axis (group by which behavior is being built).
- **Data:** purely client-side filter on the same `moves[]` array.
- **v1 proposal — replaceable:** "Behavior" grouping rendering is OPEN (see §11 Q1). Could group by `Objective.discipline_ids` (the practiced discipline) or by `Move.move_type` (action/reaction/habit). Choice deferred to §11.

### 6.3 Catch-up tiles — `pushed (N) · forgotten (N) · this week (N)`

- **Anchor:** GRIT-T (Trigger) signal from YSELA_PHILOSOPHY L148–158. BBB Anti-Pattern 4 ("Delayed Feedback") L404–415.
- **Data:**
    - `pushed` = Moves with `due_date != original_due_date` OR with at least one entry in `postpone_history[]` (whichever the schema supports — TBD §11 Q4).
    - `forgotten` = Moves where `due_date < today AND status ∉ {completed, cancelled}` AND not in `pushed`.
    - `this week` = Moves where `due_date ∈ [Mon, Sun] of current ISO week AND status ∈ {todo, in_progress}`.
- **v1 proposal — replaceable:** "Forgotten" is psychology-friendly, not "overdue." If users find it confusing, swap label without changing the bucket logic.

### 6.4 Causal-chain card — left "building" / right "moving"

- **Anchor:** Literal BBB diagram (BBB_FRAMEWORK L70–115): Behavior → Based On → Outcome.
- **Data per card:**
    - Title: `move.name`
    - Left column (building): discipline label (from parent Objective's `discipline_ids`), build-days `N/M` (count of recent completions for `move_type='habit'`), behavior-lock % (rolling completion rate).
    - Right column (moving): parent KR title, target_value, current_value, lift since reference period.
    - Card state: `active` / `paused` / `assigned-out` / `completed` / `forgotten`.
    - Assignee initials + handoff icon `▸▸`.
- **v1 proposal — replaceable:**
    - The left-column metric ("build-days N/M") is a guess at what makes the building axis legible. Could be replaced by streak count, lock-in %, deliberate-practice score, etc.
    - The right-column "lift since X" depends on a reference value we don't currently snapshot. For v1, show `current_value` directly; defer "lift" to a future epic where KR snapshots exist.
    - The discipline labels themselves (Accountability / Growth / Maturity / Discipline shown in mockup) come from `server/config/disciplines.js` — see §11 Q2 for whether this is the right taxonomy.

### 6.5 Chores list — non-Move work

- **Anchor:** YSELA philosophy "Not a Task Manager" L427. The dashboard surfaces behavior-building work; chores are the rest.
- **Data:** legacy Tasks assigned to current user that are NOT in the Move collection. Lightweight rendering (single-line, smaller font, lower contrast).
- **v1 proposal — replaceable:** The visual de-emphasis is intentional cognitive separation. If users complain that chores feel hidden, can be flipped without changing the data model.

### 6.6 Empty states

- **Anchor:** YSELA philosophy "Diagnose Before Prescribe" L241–292.
- **Data-driven CTA routing:**
    - No SSI assessment → "Diagnose first" → `assessment-hub.html`
    - Assessment but no Objective → "Set an Objective" → `objectives.html`
    - Objective but no plan → "Build a plan for [Objective]" → `planning-v2.html?objective=<id>`
    - Plan but no Moves yet → "No Moves identified yet — Moves will appear as the plan progresses" (passive copy, no CTA — Moves are produced by the plan, not by the user)
- **v1 proposal — replaceable:** Copy and CTA targets follow the operating loop today. As the loop matures (e.g., post-Beta when SSI re-assessment is automated), CTAs will need to evolve.

---

## §7. The Task → Move Filter (For #192: Implicit, Pre-Existing)

**Today's reality:** The Move collection already exists. Some Moves are in it; some Tasks aren't. The filter that decided which Tasks became Moves is implicit in whoever populated the Move collection (manual or via some pre-#192 generation path).

**For #192:** We do NOT try to formalize this filter. The dashboard renders:
- **Moves:** anything in the `Move` collection scoped to current company.
- **Chores:** anything in the `Task` collection that is NOT mirrored in the Move collection.

**Future epic (out of scope for #192):**
- An explicit Task→Move conversion criterion ("a Task qualifies as a Move when it: is recurring / builds a discipline / has a measurable behavior signal / etc.").
- A generation step in the planning flow that proposes Move candidates from the Task list.
- A consultant-facing UI to confirm or override Move classification.

This future epic is documented in `MASTER_PRODUCT_BACKLOG.md` (will be added when this doc is committed).

---

## §8. The Role-Distribution Model (Plays — Future)

The org-chart example (§3) shows how one KARVIA Task fans out to Moves for multiple actors. The **Play** in MOP terms is the coordinated set of those Moves.

**Today's reality:** Move schema has a single `assigned_to` field. One Move = one actor.

**For #192:** We render Moves at-most-1-actor. A Task that should fan out to 5 actors today produces 5 separate Moves (one per actor) OR is represented as 1 Move assigned to the orchestrator (e.g., consultant). The choice between these is determined by whoever populated the Move collection — the dashboard simply renders.

**Future epic (out of scope for #192):**
- A `Play` collection that groups related Moves under a coordination header.
- Multi-actor Move rendering on the dashboard (each actor sees their slice; aggregate Play status visible to manager+).
- Handoff visualization between actors within a Play.

This is documented for the backlog, NOT decided here.

---

## §9. Modular Boundaries (What Can Be Swapped Without Rewriting)

Concrete seams for future replacement, recorded so #192 implementation respects them:

**Per §10a Hardline Modularity, every seam = exactly one named function.** Replacing a seam = replacing one function. No coordination with other code paths.

| Seam | Owner function (single point of change) | What lives behind it today | What can replace it later |
|---|---|---|---|
| Momentum signal | `MoveDashboardService.computeMomentum(moves, period)` | Local computation from Move counts | iBrain `/api/momentum/:user_id` |
| Move-foundation derivation | `MoveDashboardService.deriveMoveFoundations(move, objective)` | Inherit `Objective.discipline_ids[]`, primary = first in array (Q1b.2.i) | Move-level `foundation_ids[]` field, SSI-driven primary, etc. |
| Objective lifecycle derivation | `MoveDashboardService.deriveObjectiveLifecycle(objective, krs, plan)` | View-time 6-stage derivation from existing fields (status, KRs, end_date) per Q3b.1 | Future `Objective.lifecycle_stage` schema field replaces the derivation; one-function swap |
| Move-status display labels | `MOVE_STATUS_LABEL` constant in `dashboard-v2.js` | System terms: `not_started / in_progress / done / removed / overdue` (Q3.B) | YSELA football voice: `Ready to Play / In Play / Goal! / removed / Injury Time` |
| Health-status display labels | `HEALTH_STATUS_LABEL` constant in `dashboard-v2.js` | System terms: `on_track / at_risk / behind` | YSELA football voice: `Winning / Close Match / Trailing` |
| Catch-up bucket assignment | `MoveDashboardService.bucketizeMove(item, today)` | Pure derivation from `created_at`, `due_date`, `updated_at` (Q4 RESOLVED 2026-05-01). Pushed = due-today-and-touched-today-and-not-born-today; forgotten = `due_date<today AND status∉{completed,cancelled}`; this_week = `due_date∈[Mon,Sun] of current ISO week AND status∈{not_started,in_progress}`. | iBrain Phase 1 telemetry adds real postpone-counting; bucket becomes data-driven |
| Right-column data resolution | `MoveDashboardService.deriveRelevantKR(move)` + `MoveDashboardService.deriveObjectiveSummary(objective)` | View-time chain `Move→WeeklyGoal→KR→Objective` via populate; right column shows Objective short_label (or truncated title) + progress % + KR title (Q5.1.ii). Soft-fail on orphan Moves with `Unassigned KR` placeholder. | DEBT-007 Epic D may add time-based progress snapshots if needed |
| Objective short label | `Objective.short_label` field (optional, NEW for #192 — §10a exception) | Empty by default; falls back to truncated title. Wizard/UI can capture it incrementally. | n/a |
| Discipline taxonomy lookup | `MoveDashboardService.resolveFoundationLabel(id)` | Reads `server/config/disciplines.js` (4 foundations) | 9 Disciplines or other taxonomy |
| Move-type display labels | `MOVE_TYPE_LABEL` constant in `dashboard-v2.js` | `{ action: 'Action', reaction: 'Reaction', habit: 'Behavior' }` | Schema rename when Move enum migrated |
| Empty-state CTA routing | `dashboard-v2.js renderEmptyState(state)` | Inline if/else against Objective + Assessment counts | YSELA Coach onboarding flow |
| Chores rendering | `dashboard-v2.js renderChores(tasks)` | Legacy Task fetch, lightweight render | Hide entirely OR fold into Move |
| Causal-chain card metrics | `dashboard-v2.js renderCausalChainCard(move)` | `build_days N/M` left, `current_value` right | Discipline-grade Follow-through, KR lift with snapshot |
| Aggregator endpoint shape | `GET /api/moves/dashboard-summary` route handler | Single round-trip aggregator | Could split into per-section endpoints if perf demands; today's shape is the contract |
| Task → Move classification (v1) | `MoveClassifierService.classifyTaskFromAIResponse(taskResponse)` | LLM tags each Task with move_type/frequency/discipline OR null. Function returns `(Move doc \| null)`. | A/B candidates: always-Move (no chores), rule-based, hybrid. Research project filed as `BEHAVIORAL_CLASSIFICATION_RESEARCH`. |
| Telemetry sink | `TelemetryService.emit(event, payload)` | Logger-only sink: `logger.info('[telemetry] ' + JSON.stringify(...))`. Emits `move.completed`, `move.postponed`, `move.reassigned`, `dashboard.viewed`. | Phase 1 swaps `logger.info` for `await fetch(IBRAIN_WEBHOOK_URL, ...)`. Single function edit. |

**Implementation discipline:** every "v1 proposal — replaceable" element in §6 maps to one of these seams. No element gets a special-case implementation that bypasses a seam.

---

## §10a. Implementation Discipline — Hardline Modularity (BINDING for #192)

User direction recorded 2026-05-01:

> "we are showing a dashboard that takes the tasks that are planned and presents it with a twist and shows how in future this is going to be valuable. So that's why try to keep this as isolated as possible so that we don't create any dependencies."

This is a binding implementation rule for #192. It supersedes anything earlier in this doc that conflicts.

**What this rule forbids:**

- ❌ Adding required fields to `Move`, `Objective`, `Task`, or any other existing schema.
- ❌ Creating new collections that other code paths must populate.
- ❌ Coupling planning-page, objective-wizard, or other features to dashboard logic.
- ❌ Persisting any "twist" (e.g., primary_foundation, momentum cache, lift snapshot) onto entities that other features read.
- ❌ Hard dependencies between dashboard sections — if KPI strip data is missing, cards still render; if cards are missing, chores still render.
- ❌ A single function that combines two seams (e.g., one function that both buckets catch-up AND computes momentum). One seam = one function.

**What this rule requires:**

- ✅ Read-only consumption of existing schema (`Objective`, `KeyResult`, `Goal`, `WeeklyGoal`, `Move`, `Task`).
- ✅ One additive aggregator endpoint (`GET /api/moves/dashboard-summary`).
- ✅ All "twists" — primary-foundation derivation, momentum, catch-up bucketing, KR lift, empty-state routing — computed AT VIEW TIME inside `MoveDashboardService`.
- ✅ Each twist isolated in **a single named function** in `MoveDashboardService`. Replacing the rule = replacing one function. No coordination with other teams or other code paths.
- ✅ Each frontend section (KPI strip / group switch / catch-up tiles / cards / chores / empty states) renders independently from the `dashboard-summary` response. Pulling any section out of the page does not break the rest.

**Why this discipline matters:** the BBB hypothesis is unproven (§1). We will replace pieces. If pieces are coupled, replacement requires migrations and coordination. Isolated pieces let us iterate without friction. This is the load-bearing architectural discipline of #192 — every other section in this doc derives from it.

---

## §10. Schema Decisions for #192

**No schema migrations. Display changes only.** Concrete list:

| Change | Type | Where |
|---|---|---|
| `--karvia-primary: #7C3AED → #1e3a5f` | CSS variable rename | `client/css/objective-wizard.css:13` |
| Defensive alias `:root { --karvia-primary: var(--s22-navy, #1e3a5f); }` | CSS additive | `client/css/s13-patterns.css` |
| Sweep 13 inline `#8B5CF6` + 2 Tailwind `bg-purple-100/text-purple-600` | CSS sweep | `client/pages/dashboard-v2.html` |
| Sweep `'purple'` string in colors array | Single line edit | `client/pages/scripts/dashboard-v2.js:433` |
| Word-boundary rename Tasks→Moves in HTML strings only | Display rename | `client/pages/dashboard-v2.html` |
| `MOVE_TYPE_LABEL = { action: 'Action', reaction: 'Reaction', habit: 'Behavior' }` | New constant | `client/pages/scripts/dashboard-v2.js` |
| New aggregator endpoint `GET /api/moves/dashboard-summary` | Additive route | `server/routes/moves.js` + new `server/services/MoveDashboardService.js` |
| V3 layout body replacement | HTML rewrite | `client/pages/dashboard-v2.html` (nav block + script tags PRESERVED VERBATIM) |

**What does NOT change:**
- `Move.move_type` enum stays `['action', 'reaction', 'habit']`. Schema rename deferred to a future sprint.
- `Task` model untouched. `/api/tasks/*` routes untouched.
- All JS identifiers (`taskId`, `taskList`, function/parameter names) stay as `task*`.
- Move/Task collection contents untouched.
- All other pages (planning-v2, objectives, assessment-hub, my-clients, team-ssi-view, objective-wizard) untouched except the wizard's CSS goes navy from the alias.

---

## §11. Discussion Questions (Q1, Q2 RESOLVED — Q3–Q10 OPEN)

### Q1 — Group switch: what does "Behavior" group by? ✅ RESOLVED 2026-05-01

**Conceptual frame agreed:** the Behavior tab is a **regrouping that surfaces meaning**, not a filter that hides Moves. Every Move on the list appears under a foundation header. The tab answers the user's "why am I doing this task?" question by clustering Moves under the foundation each one builds when repeated.

```
ALL TAB                     OBJECTIVE TAB              BEHAVIOR TAB
─────────                   ─────────────              ────────────
Flat chronological          Grouped by parent          Grouped by foundation
list of today's Moves       Objective they serve       they build when repeated

(time view)                 (cascade view)             (BBB hypothesis view —
                                                       why am I doing this?)
```

#### Q1a — Foundation-per-Move signal source ✅ RESOLVED

**Decision:** Inherit from parent `Objective.discipline_ids[]` (Path 1, the hybrid Q1a.4 form: pure inheritance now, Move-level override is a future epic). Already in the data, ship-ready, no schema change.

#### Q1b — Multi-foundation Moves rendering ✅ RESOLVED

**Decision:** Show under primary foundation with `+1 more` badge (Q1b.2). Tiebreaker rule: **first item in `Objective.discipline_ids[]` array wins** (Q1b.2.i — order-of-insertion, deterministic, view-time-only, replaceable in a single function per §10a).

This rule is owned by the function `MoveDashboardService.deriveMoveFoundations(move, objective)` per §10a Hardline Modularity. If the rule turns out wrong, replacement = one function edit, no migration, no coordination.

### Q2 — Discipline taxonomy ✅ RESOLVED 2026-05-01

**Decision:** Use the 4 foundations from `server/config/disciplines.js` as v1 starter labels (Discipline / Growth / Accountability / Maturity). **Not presented as definitive** — credible starting taxonomy because (a) already in the system, (b) easier to reason about Task→Behavior conversion in conversation, (c) ready to ship without schema changes.

The GRIT_DISCIPLINES_RESEARCH.md 9-discipline list is **out of scope for #192**. Whether it ever supersedes the 4 foundations is its own future decision tracked separately.

### Q3 — Status display vocabulary ✅ RESOLVED 2026-05-01

**Decision: Q3.B (system terms, not football voice).**

For #192, drastic UX language shifts are out of scope — we keep operator-friendly system terms for both Move/task lifecycle and health-status badges:

| Layer | v1 display | Source |
|---|---|---|
| Move/task lifecycle | `not_started / in_progress / done / removed / overdue` | `MOVE_STATUS_LABEL` constant in dashboard-v2.js |
| Move/task health | `on_track / at_risk / behind` | `HEALTH_STATUS_LABEL` constant |

YSELA football voice (`Goal! / In Play / Injury Time / Winning / Close Match`) per `SHARED_GLOSSARY.md` L57–70 stays available as a labelled future replacement; constants are single-line edits when the brand call is made.

### Q3b — Objective Lifecycle (Separate Axis from Status/Health) ✅ RESOLVED 2026-05-01

**The opening:** Q3 surfaced that today's `Objective.status` enum (`draft / active / completed / paused / cancelled / at_risk`) confusingly conflates three independent axes:

| Axis | Question | Today |
|---|---|---|
| Lifecycle | "Where in its journey is this Objective?" | ❌ NOT cleanly modeled |
| Health | "Is this Objective on track to succeed?" | ✅ `on_track / at_risk / behind` |
| Operational state | "Is this Objective active or paused right now?" | ⚠️ Overloaded into `Objective.status` |

User declared the lifecycle axis must exist as its own concept.

#### Q3b.1 — Lifecycle stages ✅ RESOLVED

**Decision: 6-stage list.** Each stage has a distinct visible cue.

| Stage | Meaning | Trigger condition (v1, view-time) |
|---|---|---|
| `identified` | Stakeholder declared the Objective. No KRs yet. | `status='draft'` OR `key_results.length === 0` |
| `kr_breakdown` | KRs being defined; plan being built. | Has KRs but no Goal/WeeklyGoal yet |
| `in_execution` | Plan executing; Moves happening daily. | Has plan + `status='active'` |
| `completion_review` | KRs hit; verifying actual outcome. | All KRs `current_value ≥ target_value` AND `status != 'completed'` |
| `completed` | Fully signed off as achieved. | `status='completed' AND end_date < today by < 90 days` |
| `sustained_mode` | Behaviors are now habits being maintained. | `status='completed' AND end_date < today by ≥ 90 days` |

Edge cases:
- `status='paused'` → render as `paused` (operational state, fall back verbatim)
- `status='cancelled'` → not rendered on dashboard
- `status='at_risk'` → fall back to lifecycle derivation; the `at_risk` signal is now properly the health axis, not lifecycle

#### Q3b.2 — `sustained_mode` semantics ✅ RESOLVED

**Reading (b): "Behaviors that produced the outcome are now habits being maintained."**

Plainly: the Objective has moved **from "delivered by the consultant" to "part of the company culture."** Ownership has transferred from the delivery agent to the receiving organism. When behaviors become culture, the Objective is in sustained_mode.

This is the cleanest articulation of BBB's logical conclusion: behaviors, once compounded into habits, sustain outcomes without continued external scaffolding. The dashboard's role is to **make this transition visible** so consultants and owners see when their work has crossed that threshold.

**v1 trigger (crude proxy):** `status='completed' AND end_date < today by ≥ 90 days`. Acknowledged as an approximation — the "real" definition (KR target shifts to maintenance, outcome metrics confirm no regression, behavior signals show habituation) is post-#192 work tracked in the new backlog item below.

#### Q3b.3 — Backend impact: NONE for #192 ✅

**Per user direction: "Nothing major changes. We only use the middleware to show this information for now. If something at the backend has to be changed, let's not do it."**

This is a strict §10a Hardline Modularity application:

| What we DO in #192 | What we DON'T do |
|---|---|
| ✅ Add `MoveDashboardService.deriveObjectiveLifecycle(objective, krs, plan)` — single function, view-time only | ❌ Add `Objective.lifecycle_stage` schema field |
| ✅ Render lifecycle as a badge on Objective group header in dashboard | ❌ Modify `Objective.status` enum |
| ✅ Use existing fields (`status`, `end_date`, KR `current_value/target_value`, presence of plan) to derive stage | ❌ Modify objective-wizard or planning-page to capture/transition lifecycle |
| ✅ File backlog item for formal Objective Lifecycle Redesign | ❌ Touch S22a stage-transition hooks (`onFirstObjectiveCreated`, etc.) |

**New backlog item to file:** `OBJECTIVE_LIFECYCLE_REDESIGN` (P1 post-Beta) — formalizes the 6-stage lifecycle as a schema field, rewires wizard + planning + reporting to manage transitions, adds `onObjectiveHandedOff`, `onObjectiveCompleted`, `onObjectiveEnteredSustainedMode` stage hooks, defines real (not crude-proxy) trigger conditions for `sustained_mode` based on KR maintenance and outcome metrics. To be tracked in `MASTER_PRODUCT_BACKLOG.md` alongside DEBT-006/FEAT-043.

### Q4 — `pushed` bucket signal ✅ RESOLVED 2026-05-01

**Decision: simplest possible signal using existing fields. No persistent counting.**

```
"pushed to today" =
    isToday(item.due_date)        AND
    isToday(item.updated_at)      AND
    NOT isToday(item.created_at)
```

Plain meaning: "this Move/Task's due date is now today, it was touched today, and it didn't start out today." We do not care how many times it was pushed, when, or why — only that *right now* its due date is today and it wasn't born today.

User direction: *"There is a creation date there is a due date, and there is an updated date. So every time we can for now push to today is nothing but if it was yesterday, and it is pushed to today, it just shows task. We will not persistently count over this thing... Let's keep it very simple."*

**Implementation:** Single function `MoveDashboardService.bucketizeMove(item, today)` per §10a. Reads only existing fields (`created_at`, `due_date`, `updated_at`). Zero schema changes. Zero new endpoints. Zero data-collection changes.

**Audit finding (recorded for backlog):** During Q4 walkthrough we discovered that Task today has a working postpone modal flow that captures a `postpone_reason` from the user, but the Task schema has no field to receive it — Mongoose silently drops the data. The postpone modal has been silently losing user reason inputs. This is a **separate pre-existing bug** unrelated to the dashboard. Captured in backlog as `BEHAVIORAL_TELEMETRY_POSTPONE_TRACKING` for the future iBrain Phase 1 telemetry layer. Q4's resolution does NOT fix it; the dashboard simply renders without depending on the counting/reason data that should have been persisted.

**Edge cases acknowledged for v1:**

| Edge case | Behavior with v1 logic |
|---|---|
| Move pushed from yesterday → today | ✅ Counts as pushed |
| Move pushed from yesterday → tomorrow | ❌ Does NOT count (falls into "this week" bucket) |
| Move pushed from last week → today | ✅ Counts as pushed |
| Move whose title was edited today (and `due_date` was already today) | ⚠️ False positive — counts as pushed because `updated_at=today AND due_date=today AND created_at<today`. Accepted v1 cost. |
| Move marked complete then re-opened today | ⚠️ Likely false positive (edge case, rare). Accepted v1 cost. |

The false-positive cost is accepted because eliminating it requires the persistent counting / due-date history that is out of scope for #192 and lives in the BACKLOG_BEHAVIORAL_TELEMETRY epic.

### Q5 — Right column of causal-chain card ✅ RESOLVED 2026-05-01

**Reframing during walkthrough:** the right column is NOT "KR lift over time" as the original mockup wording (`↑ 50% from 25% in Jan`) suggested. It is **Objective progress** — `Meeting Structure / Charter Alignment / Implement KPI` are short Objective titles, and the percentage is the Objective's overall progress. The card answers per Move: "this Move is building [Foundation] AND advancing [Objective] via [specific KR] which is at [X]%."

This is a tighter BBB causal chain than what the mockup originally implied. No time-based snapshot system is needed; existing `Objective.progress_percentage` field is sufficient.

#### Q5.1.ii — What the right column shows ✅ RESOLVED

Right column = **Objective short label + Objective progress % + the specific KR this Move advances** (via the chain Move → WeeklyGoal → KR).

#### Q5.x.A — How "the specific KR" is derived ✅ RESOLVED

View-time chain: `Move → WeeklyGoal.findById(move.weekly_goal_id) → KeyResult` resolved via `.populate('weekly_goal_id')` in the dashboard aggregator query. Single function `MoveDashboardService.deriveRelevantKR(move)`. No schema change. No denormalization. The chain is already structurally enforced (`WeeklyGoal.key_result_id` is required).

**User invariant captured:** "Moves are nothing but tasks in disguise. Every Move has to be linked to a key result ID." — this is logically true via the chain, even though `Move.key_result_id` is not a direct field. View-time derivation is the implementation that honors the invariant without denormalization.

**Soft-fail on orphan Moves:** if the chain breaks (orphan WeeklyGoal reference, deleted KR), the Move still renders with placeholder `Unassigned KR`. User sees the orphan and can take action. We do NOT silently drop. Per §10a, this is one branch of `deriveRelevantKR()` — replacement = one function edit.

#### Q5.2.ii — Truncation rule for the Objective short label ✅ RESOLVED

**Add optional field** `Objective.short_label: String` (default empty, no forced migration). Right column displays `short_label` if set, falls back to truncated `title` (first ~25 chars + ellipsis) when empty.

This is an **§10a-permitted exception** explicitly acknowledged: optional field with default empty, no required-field rule violated, no other surface forced to populate it. Wizard / objective creation can capture it incrementally; existing Objectives keep working unchanged.

#### Q5.3 — Time-based snapshot system ✅ RESOLVED

**Path 3 — defer to DEBT-007 Epic D walkthrough.** No backlog item filed now. When DEBT-007's "Real `sustained_mode` triggers" epic begins, the team picks it up will discover whether time-based KR/Objective progress snapshots are needed. If yes, it gets filed then. If no, never filed.

A single-line note appended to DEBT-007's Epic D entry in MASTER_PRODUCT_BACKLOG.md preserves the question without committing scope.

#### Q5.x.C deferral — `Move.key_result_id` as schema-enforced invariant

**Not filed.** The Move → WeeklyGoal → KR chain already satisfies the structural relationship; denormalizing `key_result_id` onto Move would create cache-staleness risk (if a WeeklyGoal moves between KRs, Move would have stale data) without real read-performance benefit at our current scale. Indefinite deferral.

If at some future point the chain causes performance issues (`populate` becomes a bottleneck under load), the question gets revisited then with real data — not preemptively scoped now.

### Q6 — Move classification + empty-state ✅ RESOLVED 2026-05-01

**Reframing during walkthrough.** Q6 surfaced that the Task and Move tables are TWO DISCONNECTED COLLECTIONS in the codebase today:

- `tasks` (legacy, well-used): every plan generates Tasks. Parent: `Goal{WEEKLY}` (legacy weekly goal).
- `moves` (new, barely used): designed for behavior-building units. Parent: `WeeklyGoal` (new collection added in S22 #176).
- **No bridge.** Tasks never become Moves automatically. The Move collection sits empty for almost every tenant.

The walkthrough shifted from "how does the dashboard render empty Move data" to a deeper architectural question: **WHEN does Task → Move classification happen, and HOW?**

#### Q6.1 — Trigger model ✅ RESOLVED

**Option Now — classify inside the existing per-KR LLM generation step.**

User direction: post-S23 the planning flow is already scoped to ONE KR at a time. The LLM is in per-KR context when it generates Tasks; classifying each Task is a tiny extension of an already-narrow ask.

```
User clicks "Generate Weekly Goals" for a specific KR
  → /api/planning/generate-weekly-plan
       → aiOKRService asks LLM (per-KR scope):
           "Given this Objective and KR, what tasks do we need?
            For each task: classify as behavior (action/reaction/habit + frequency + discipline)
            OR null if it's just admin/chores."
       → bulk-insert Tasks (existing path)
       → MoveClassifierService.fromAIResponse(taskResponses, kr, objective)
            → returns array of (Move doc | null) — null for chores
       → bulk-insert Moves for non-null entries (new path, parallel)
       → return both
```

Why Option Now over Later/Hybrid:
- **No payload bloat.** LLM is already reasoning about each Task in per-KR context — adding classification is ~20 extra tokens per Task.
- **Atomic.** Tasks and Moves created in same `Promise.all` (extends #191g bulk-insert pattern). No drift window.
- **Cheaper.** Single LLM call instead of two.
- **Most accurate.** LLM has fresh context (Objective + KR + plan + Task) when classifying.
- **Simplest.** No event emitter, no async classifier, no eventual-consistency, no fallback dashboard logic.

Trade-off accepted: the planning route gains a write to the `moves` table. This is a §10a-permitted extension because (a) no required fields added to existing schemas, (b) the `moves` collection already exists and was designed for this data, (c) the new logic lives in its own service file (`MoveClassifierService.js`).

#### Q6.2 — Classification mechanism for v1 ✅ RESOLVED

**LLM-based, piggybacks on existing Task generation prompt.** Each generated Task carries `move_type` (action/reaction/habit) + `frequency` (once/daily/weekly) + `discipline` fields OR a null/chore signal.

#### Q6.3 — "Behavior" vs "chore" semantic ⚠️ OPEN BY DESIGN

User direction: *"We don't know the answer — that's why we need to make this modular and then figure out actually how do we do this classification. Is there a right way to classify?"*

This is the same stance taken on the BBB hypothesis itself in §1. We're not deciding between "every Task becomes a Move" vs "LLM picks behavior-vs-chore" because we genuinely don't know which is right. **Modular is the answer:** we ship a deliberately-naive v1 that's a single replaceable function, then learn from real data.

**v1 implementation:** "LLM picks per Task, returns a Move doc OR null." Tasks the LLM tags as chores produce no Move row.

**v1 classification semantic is itself a known unknown.** The discipline:

| What this forbids | What this requires |
|---|---|
| ❌ Writing a "smart" classifier that hides assumptions inside complex logic | ✅ Single function `MoveClassifierService.classifyTaskFromAIResponse(taskResponse)` that returns `{move_doc \| null}` per Task |
| ❌ Coupling the dashboard to specific classification semantics | ✅ Dashboard reads `moves` table whatever the classifier produced |
| ❌ Rich classifier output schema | ✅ Output is just `(Move doc \| null)` — easy to replace later |

If the LLM turns out unreliable, we replace the function. If we want to A/B "always-Move" vs "LLM-picks," the function is the swap point. New backlog item filed: `BEHAVIORAL_CLASSIFICATION_RESEARCH` (P2 post-Beta) — research project to determine the right Task→Move classification rule based on observed user data.

#### Q6.4 — Backfill of pre-#192 Tasks ✅ RESOLVED

**No backfill.** User direction: *"We don't have to worry about the existing data — we will be going live later this month, so it's all new data that we need to focus on."*

Beta tenants are new. Their first plan after #192 ships generates both Tasks and Moves atomically. No script, no migration, no on-demand button. The "pre-#192 Tasks backfill" branch of the design disappears entirely.

#### Q6.5 — Empty state when `moves` table is empty ✅ RESOLVED

**Q6.A — honest empty state.** Tenants who haven't regenerated a plan post-#192 see the empty-state copy:

> *"No Moves yet. Generate a plan to get started — your tasks will be classified into behaviors automatically."*

CTA: button → `planning-v2.html?objective=<id>` (per existing empty-state routing rules).

#### Q6.6 — Chores list ✅ RESOLVED

**Preserved at dashboard bottom.** Populated from Tasks where the classifier returned null (no corresponding Move row was created). Lightweight rendering (per §6.5 of this doc). Honors the conceptual distinction: not every task is a behavior; some are admin overhead.

#### #192b implementation deltas (from this Q6 resolution)

The original #192b scope grows by three items:

1. **`aiOKRService` prompt extension** — ask LLM for per-Task classification fields in the same call.
2. **`MoveClassifierService.js`** — new isolated service. Single function `classifyTaskFromAIResponse(taskResponse)` returns `(Move doc | null)`.
3. **`/api/planning/generate-weekly-plan` route** — extended to bulk-insert Moves alongside Tasks in the same `Promise.all` we built in #191g.

All three respect §10a Hardline Modularity. No required fields added to existing schemas. New write goes to a collection (`moves`) that was already designed for this data. Classifier logic isolated in its own service file.

### Q7 — Consultant own dashboard scope ✅ RESOLVED 2026-05-02

**Decision: Q7.A pure role-agnostic.** Consultant's own dashboard renders their own Moves like any other tenant member's dashboard. No consultant-specific layout. No banner pointer to `my-clients.html`. No portfolio aggregate.

**Justification on record (user direction):**

> "Even consultant needs to do tasks or as we call behaviours, so dashboard can make them also a part of the game. Lets go with pure Q7A."

This justification reinforces the football-match metaphor from `YSELA_PHILOSOPHY.md` L46–104: the coach is also a player. The dashboard treats every actor the same way — owner, executive, manager, employee, AND consultant — because every actor has Moves to make. Coaching prep, client check-ins, internal admin, behavior building: it all runs through the same dashboard.

**§5 role-agnostic principle preserved.** No exceptions. No special-casing. The same code path renders the consultant's dashboard as any other user's. Cross-client portfolio views remain on `my-clients.html` (existing flow, untouched by #192).

**Scope clarification for #192:**

| Surface | What renders for consultant | Same logic as other roles? |
|---|---|---|
| dashboard-v2.html | Own Moves (consultant tenant scope) | ✅ Yes |
| my-clients.html | Managed-client list + per-client workspace links | ✅ Existing flow, untouched |
| client-workspace.html (per client) | That client's data via `requireManagedClient` middleware | ✅ Existing flow, untouched |

### Q8 — Mobile breakpoints ✅ RESOLVED 2026-05-02

**Decision: Q8.A — single breakpoint at 720px.**

User direction: *"isn't it simple and can be opened in mobile tablet or desktop, only for dashboard, but make sure we do minimal changes — lets not go for more effort — focus to showcase value."*

Single `@media (max-width: 720px)` block, ~10–15 lines of CSS:
- Catch-up tiles stack vertically (full-width each).
- Group switch chips become full-width row (or a `<select>` if effort budget shrinks further — single decision at implementation time).
- Causal-chain cards stack left column above right column.
- Month / Objective group summary text hides on narrow widths to reduce visual clutter.

**Viewport coverage:**

| Viewport | Behavior |
|---|---|
| Desktop ≥1100px | Mockup-perfect (the screenshot exactly) |
| Laptop 900–1100px | Mockup-perfect (flexbox compresses naturally) |
| Tablet landscape 1024px | Mockup-perfect |
| Tablet portrait 768–1023px | Mockup-perfect-ish (slightly tight, functional) |
| Borderline 720–767px | Acceptable v1 weak zone |
| Phone & narrow <720px | Graceful full stack |

**Why not more breakpoints (Q8.B/Q8.C):** they require 2–3× the CSS to write/verify for marginal tablet-portrait improvement. We don't spend #192's sprint budget tuning tablet — if real users complain post-Beta, a middle breakpoint becomes a small follow-up.

**Modular discipline:** all responsive rules live in a single `@media` block at the bottom of `dashboard-v2.html`'s inline `<style>`. Replaceable in one place when we decide to refine.

### Q9 — Telemetry emission for iBrain Phase 1 readiness ✅ RESOLVED 2026-05-02

**Decision: Q9.B — light scaffold, log-sink only.**

Add `TelemetryService.emit(event, payload)` that calls `logger.info('[telemetry] ' + JSON.stringify({event, payload, timestamp}))`. Each Move action endpoint (`complete`, `postpone`, `reassign`, etc.) calls `TelemetryService.emit(...)` once after the DB action succeeds.

**Why Q9.B over Q9.A / Q9.C / Q9.D:**

| Option | Cost now | Phase 1 retrofit cost | Decision rationale |
|---|---|---|---|
| Q9.A — don't emit | 0 | Full retrofit across every Move-action endpoint | Skipped — known future debt |
| **Q9.B — log sink** | ~30 lines | Swap one function (the sink) | ✅ Minimum cost now, single-seam swap later |
| Q9.C — telemetry_events collection | New collection + ongoing storage | Phase 1 reads from collection | Skipped — §10a violation (new collection) |
| Q9.D — HTTP webhook | ~50 lines | Set env var only | Skipped — adds network failure modes for marginal gain over Q9.B |

**§10a compliance:** zero schema changes. Single new service file (`TelemetryService.js`). Emit-points are one-liner additions to existing route handlers. Single sink function — Phase 1 swaps `logger.info` for `await fetch(IBRAIN_WEBHOOK_URL, ...)` in one place.

**Events emitted in #192b (initial set):**

| Event | Payload shape (v1) | Where emitted |
|---|---|---|
| `move.completed` | `{user_id, company_id, move_id, completed_at, move_type, discipline}` | After successful Move complete action |
| `move.postponed` | `{user_id, company_id, move_id, old_due_date, new_due_date, postponed_at}` | After successful Move postpone action |
| `move.reassigned` | `{user_id, company_id, move_id, old_assignee, new_assignee, reassigned_at}` | After successful Move reassign action |
| `dashboard.viewed` | `{user_id, company_id, viewed_at, summary_counts}` | On dashboard page load (single emit per session, throttled) |

The exact payload shape is v1 — Phase 1 will tell us what fields it actually needs and we adjust. The single-seam discipline (§10a) makes the adjustment trivial.

**Tradeoff acknowledged:** logfile-based telemetry is not queryable. Phase 1 has to either ignore the logged history (start fresh) or build a log-parser. We accept that — Phase 1 was always going to build a consumer; the consumer can read DB state for backfill if needed.

**Modular discipline:** all emit-points go through `TelemetryService.emit()`. Replacing the sink (logger → HTTP webhook → message queue → whatever Phase 1 wants) is a single function edit. Phase 1 may also choose to add structured event types or a versioned envelope; the seam supports it.

### Q10 — Causal-chain card actions menu ✅ RESOLVED 2026-05-02

**Decision: Q10.B — universal action set with greyed-out for invalid.**

Every Move card renders the same hover actions regardless of state: **Complete / Postpone / Reassign / Edit**. The only state-specific swap is `Complete` ↔ `Re-open` for `completed` Moves (a label-toggle, not a separate code path). Role permissions already hide Reassign for Employees.

**Why Q10.B over Q10.A / Q10.C:**

| Option | Cost | Decision rationale |
|---|---|---|
| Q10.A — per-state whitelist | New state→action mapping logic for 5 states × 4 actions; new tests | Skipped — over-engineering for v1; designing for states users may not encounter on Day 1 |
| **Q10.B — universal greyed-out** | ~5 lines extra (Complete/Re-open toggle); matches existing dashboard pattern | ✅ Minimum effort; lowest risk; consistent layout |
| Q10.C — hybrid | Decision points within decision points; bikeshedding | Skipped — middle path adds rules-within-rules cost without proportional UX gain |

**Implementation discipline:** action rendering lives in `dashboard-v2.js renderCausalChainCard(move)` — single function per §10a. The state→action toggle (the one Re-open swap) lives in one inline expression. If we ever want richer state-aware behavior, it's a single-function replacement.

**Matches existing dashboard pattern:** the current `dashboard-v2.js` already renders hover actions universally on every task row. #192b doesn't introduce a new pattern; it preserves what works.

---

## §12. What We Are NOT Deciding in This Doc

To keep the discussion focused, the following are explicitly **out of scope for #192**:

- The date-sync workstream (DEBT-006 / FEAT-043 in MASTER_PRODUCT_BACKLOG.md).
- The explicit Task→Move filter algorithm (future epic, see §7).
- Multi-actor Plays (future epic, see §8).
- The Reflection page (Friday-cadence reflection — not a #192 surface).
- iBrain Phase 1 telemetry detailed wiring (Q2 2026).
- Schema rename of `Move.move_type` enum.
- The 9-Disciplines vs 4-foundations canonical decision (we'll pick one for v1 in Q2; the broader debate is its own doc).
- Coach onboarding flow.
- A YSELA-voice copy migration on pages outside the dashboard.

When any of these come up in the §11 walkthrough, we capture them as backlog items — not as #192 scope creep.

---

## §13. Iterative Refinement Plan

Once #192 ships, here's what we watch and what we replace next.

**Signals to observe (post-launch, ~2 weeks of usage):**
- Catch-up tile click-through rates — do users actually engage with `pushed` and `forgotten`?
- Group switch toggle frequency — which grouping is used most?
- Causal-chain card scroll depth — do users read both columns or just the title?
- "Behavior" group switch — does Q1's chosen grouping logic produce useful clusters?
- Empty-state CTA conversion — do empty-state users follow the prompted path?

**v2 candidates (in order of likely return):**
1. Replace placeholder KR-lift with real snapshot-based lift (resolves §6.4 v1 caveat).
2. Make "Behavior" grouping respond to Q1's chosen taxonomy as it stabilizes.
3. Add iBrain Phase 1 telemetry emission (resolves Q9 deferred).
4. Replace 4-foundations with 9-disciplines OR vice versa once Q2 is settled.
5. Multi-actor Play rendering (resolves §8 future epic).
6. YSELA voice (Goal! / Injury Time / etc.) toggle.

**Anti-patterns to avoid in v2:**
- Adding richer signals before observing how the v1 signals are used.
- Replacing the layout structure based on speculation rather than usage data.
- Coupling iBrain integration to the dashboard layout (the iBrain seams in §9 must stay clean).

---

## §14. Sign-Off Checklist

Cannot move from doc to code until ALL of the following are true:

- [x] §1–§5 reframings agreed by user (2026-05-01).
- [x] §10a Hardline Modularity rule accepted as binding (2026-05-01).
- [x] §6 element-by-element framing reviewed via Q1–Q10 walkthrough (2026-05-01 → 2026-05-02). Each element resolved through its corresponding Q.
- [x] §11 Q1 (Behavior grouping) — RESOLVED: regrouping not filter; Q1a inheritance from Objective; Q1b.2.i first-in-array primary.
- [x] §11 Q2 (Discipline taxonomy) — RESOLVED: 4 foundations from `disciplines.js` as v1 starter.
- [x] §11 Q3 (Status vocabulary) — RESOLVED: system terms (Q3.B); YSELA voice deferred.
- [x] §11 Q3b (Objective lifecycle as separate axis) — RESOLVED: 6-stage view-time derivation, `sustained_mode` = behaviors-as-culture (reading b), zero schema changes, new backlog item `OBJECTIVE_LIFECYCLE_REDESIGN` filed for formal redesign post-Beta.
- [x] §11 Q4 (Pushed bucket signal) — RESOLVED: simplest possible derivation from existing `created_at`, `due_date`, `updated_at`. No persistent counting; persistent counting + reason capture filed as backlog item `BEHAVIORAL_TELEMETRY_POSTPONE_TRACKING` for iBrain Phase 1.
- [x] §11 Q5 (Right column / KR lift reference) — RESOLVED: reframed to Objective progress + KR via Move→WeeklyGoal chain; optional `Objective.short_label` field added (§10a-permitted exception); orphan Moves soft-fail with placeholder; time-based snapshots deferred to DEBT-007 Epic D walkthrough.
- [x] §11 Q6 (Move classification + empty state) — RESOLVED: Option Now (classify inside per-KR LLM generation), LLM-based piggyback, MoveClassifierService isolated service, no backfill (Beta is new data), Q6.A honest empty state, chores list populated from null-classified Tasks. New backlog item `BEHAVIORAL_CLASSIFICATION_RESEARCH` filed for the open question of WHAT the right classification rule actually is.
- [x] §11 Q7 (Consultant own dashboard scope) — RESOLVED: Q7.A pure role-agnostic. Consultant is also a player in the game; same layout, same data scope as any other tenant member. Cross-client view stays on my-clients.html. No special-casing.
- [x] §11 Q8 (Mobile breakpoints) — RESOLVED: Q8.A single breakpoint at 720px. Minimum-effort responsive — desktop+tablet get the mockup as-is; below 720px graceful stack. ~10–15 lines of CSS in one @media block.
- [x] §11 Q9 (Telemetry emission) — RESOLVED: Q9.B light scaffold with log sink. `TelemetryService.emit()` writes via logger; Phase 1 swaps the sink to HTTP webhook in one function edit. Initial events: `move.completed / move.postponed / move.reassigned / dashboard.viewed`.
- [x] §11 Q10 (Card actions menu) — RESOLVED: Q10.B universal action set (Complete / Postpone / Reassign / Edit) with greyed-out for invalid; only state-specific swap is Complete↔Re-open for completed Moves. Matches existing dashboard pattern. Single function ownership.
- [x] §9 modular seams accepted as the implementation discipline for #192. Every "twist" lives in a single named function per §10a Hardline Modularity.
- [x] §10 schema decisions (no migrations) accepted, with one §10a-permitted exception: optional `Objective.short_label: String` field per Q5.2.ii. All other existing schemas (Task, Move, Goal, KeyResult, Objective.status enum) untouched.
- [x] §13 iterative plan understood: ship credible v1 from the mockup; observe usage 2 weeks post-Beta; iterate via single-function seam swaps.
- [x] All decisions captured inline in §11 across commits 6fd620b → 217076c → 31b0b84 → ae275ca → 6ceebab → 03b1a4e → e015cbc → c9bf634 → (this commit).

**§14 STATUS: ALL 16 ITEMS COMPLETE. CLEARED FOR IMPLEMENTATION.**

After all boxes ticked: split #192 into #192a (theme + rename, ~3 pts) and #192b (V3 layout + Move data + BBB framing, ~7 pts) per the original phasing, but with §6 framings and §9 seams baked in.

---

**Created**: 2026-05-01 (Session #192-prep)
**Author**: refined collaboratively from research pass across YSELA + KARVIA + iBrain canonical docs
**Status**: DRAFT — §11 open for walkthrough; do not implement yet
