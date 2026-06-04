# Persona × Stage × Page Ownership Matrix

<!-- @GENOME T1-PRD-PERSONA-MATRIX | ACTIVE | 2026-05-13 | parent:T1-PRD-002 | auto:- | linked:/strategy,/coding,/design -->

**Status**: ACTIVE — captured 2026-05-04
**Source**: Founder hand-drawn matrix walk-through, 2026-05-04
**Purpose**: Single reference for who drives what stage, who lands where, and who owns each page. Drives all role-aware UX and stage-transition design from S24 onward.

---

## The Mental Model

Every objective lives a journey across **stages**. At each stage, a different persona is the **driver** (the one whose action moves the system forward). Other personas are participants. The driver determines:
- Whose mental model the UI should serve at that stage
- Which page is the natural landing/return surface for that persona
- Where the next stage's transition trigger comes from

The four stages (lifecycle layer; mapped from the canonical 6-stage `Objective.lifecycle_stage` enum):

```
   Prospect              Objective            Objective            Objective
                         Identified           Handed Off           Sustained
       │                     │                    │                    │
       ▼                     ▼                    ▼                    ▼
  ★ Consultant         ★ Business Owner      ★ Manager            ★ Employee
   (creates)            (creates objective)   (creates plan)       (executes)
```

★ marks the stage **driver** — the persona whose action initiates the transition into the next stage.

---

## Cohort Modes (added 2026-05-06)

Karvia operates in two cohort modes simultaneously — both are first-class in Beta and beyond:

| Mode | Description | Stage 2 driver | Implications |
|---|---|---|---|
| **Consulting engagement** | Company has an active consultant managing them (consultant-scoped APIs, `requireManagedClient`, page-reuse via `?client=:id` per S22a). Consultant initiates objective authoring on behalf of the client. | **★ Consultant** (with LLM co-author) | BO ratifies / owns / extends what consultant drafts. BO is the Owner of Record but not the first writer. |
| **Self-serve** | Company has no active consultant. BO initiates objective authoring directly via the Objectives page. | **★ Business Owner** (with LLM co-author) | BO is both first writer AND Owner of Record. |

**Key invariant**: Across both modes, the **Objective tenant is always the client company** — consultants do not JWT-swap; they write via consultant-scoped APIs into the client's tenant. The Owner of Record is always the BO.

**Key shared element**: The **LLM is a Stage-2 co-author in both modes**. The human partner (consultant or BO) brings domain insight; the LLM produces stakeholder-aligned phrasing. See "LLM as Co-Author at Stage 2" section below.

---

## The Master Matrix

| Stage | ★ Driver | Consultant | Business Owner | Manager | Employee |
|---|---|---|---|---|---|
| **Prospect** | ★ Consultant | **Add client / Fill profile / Send assessment** | Sign up · Take assessment · Share assessment | Sign up · Take assessment · Share assessment | Sign up · Take assessment · Share assessment |
| **Objective Identified** | ★ Cohort-dependent (see Cohort Modes) | **Author objective with LLM co-author** *(consulting mode)* OR view/ratify drafted objective *(self-serve mode: not driver)* | **Author objective with LLM co-author** *(self-serve mode)* OR ratify/own consultant-drafted objective *(consulting mode)* | Sign up / Login | Sign up / Login · Complete task |
| **Objective Handed Off** | ★ Manager | View objective · View plan | (participates) | **Create plan · Share · Complete task** | Complete task |
| **Objective Sustained** | ★ Employee | (alumni-watch only) | (participates) | (participates) | **Complete task (sustained execution)** |

### Reading the table

- **Star (★)** = primary driver of this stage. The UI for this persona at this stage should be optimized for the driving action.
- **Bold cells** = critical actions taken at this stage by that persona. These become the highest-prominence affordances on that persona's landing page when an objective is in this stage.
- **Plain text** = participatory actions. Lower prominence.
- **Empty / "(participates)"** = persona is present but has no driving action this stage.

---

## Page Ownership (the "toothpaste test")

For each page, identify the persona whose **main return-on-login destination** it is. That persona "owns" the page. Page ownership drives:
- Default landing route per role
- Information architecture priorities
- Notification routing
- "Tile sticker" / IA emphasis decisions

| Page | Primary Owner | Co-Owners (active participants) | Notes |
|---|---|---|---|
| **My Clients** | ★ Consultant | — | Consultant's CRM operating surface (Sprint 24) |
| **Dashboard** | ★ Manager + Employee (co-owned) | Business Owner (read), Consultant (alumni view) | Daily execution surface — moves, tasks, catch-up |
| **Objectives** | ★ Business Owner | Manager (read), Consultant (read via My Clients) | Where objectives are created and lifecycle is shaped |
| **Planning** | ★ Manager | Employee (consume), Business Owner (read), Consultant (read via My Clients) | Where plans are built per-KR and shared down |
| **Assessments** | ★ Consultant (driver in Prospect) → Business Owner (post-onboarding) | Manager · Employee (take) | Ownership shifts across lifecycle (see "Assessment ownership" below) |
| **Teams** | Business Owner | Consultant (read via My Clients), Manager (read members) | Org-structure surface |

### Toothpaste test (paraphrased)

> *"If this persona logs into the app multiple times a day, which page do they default-return-to expecting the most information for their role?"*

That's the page they **own**. Anyone who comes back here daily but for a secondary purpose is a **co-owner**.

---

## Stage Transition Mechanics

Every stage transition is driven by an **action**, not a date or a passive condition. The driver of the next stage performs the action:

| Transition | System Stage Mapping | Driver Action | Auto-Trigger Predicate |
|---|---|---|---|
| → **Prospect** | (initial state on Company create) | Consultant: Add client | `POST /api/consultant/clients` succeeds |
| Prospect → **Objective Identified** | `Objective.lifecycle_stage` = `identified` | Cohort-dependent: Consultant authors via consultant-scoped POST *(consulting mode)* OR BO authors via own POST *(self-serve mode)*. **LLM co-authors in both modes** (Stage 2 cascade). | First successful `POST /api/objectives` for `company_id=this`, regardless of authoring user's role (CONSULTANT via `requireManagedClient` or BUSINESS_OWNER direct) |
| Objective Identified → **Objective Handed Off** | `lifecycle_stage` = `kr_breakdown → in_execution` | Manager: Create plan (weekly goal / move) under the objective's KR | First WeeklyGoal/Move under any KR of this Objective |
| Objective Handed Off → **Objective Sustained** | `lifecycle_stage` = `completion_review → sustained_mode` | Employee: Continued task completion + manual "Mark Sustained" by consultant when KRs ≥ target | All KRs at 100% (auto flips to `completion_review`); manual click to `sustained_mode` |

Note: the **Company.stage** axis (`prospect → onboarding → active → paused/churned`) is the **company-relationship-with-consultant** lifecycle. The **Objective.lifecycle_stage** axis is the **per-objective journey**. They are orthogonal but related: a Company in `active` stage typically has objectives across multiple `lifecycle_stage` values.

---

## LLM at Stage 1 — Diagnostic Synthesis (added 2026-05-06)

Stage 1 (Diagnosis) is **not data-only**. It is a hybrid pipeline:

| Step | Type | Service | Output |
|---|---|---|---|
| 1a — Score computation | Deterministic | `DiagnosticSSIScoringService` | Raw SSI scores per dimension + sub-dimension |
| 1b — Insight detection | Deterministic | `InsightDetector` | Pattern-based insights, threshold flags |
| 1c — **Narrative synthesis** | **LLM** | `SSINarrativeService` | Executive narrative explaining the diagnosis in stakeholder-readable language |
| 1d — Report assembly | Deterministic | `ReportGenerator` | Combined `DiagnosticReport` document with health score, scores, narrative, insights |

The **LLM is a Stage-1 co-author**, not just a Stage-2 co-author. Without the narrative, the diagnostic is a wall of numbers; with it, the diagnostic becomes a document a consultant can share, a BO can read, and a manager can quote in conversations.

### Inputs to the Stage 1 narrative LLM call

```
{
  scores: { ssi: <numerical>, dimensions: {...}, sub_dimensions: {...} },
  insights: [<deterministic patterns>],
  company_profile: { industry, size, name, focus, ... },
  industry_benchmark_config: <from IndustryConfig>
}
```

### Output

```
{
  executive_narrative: <one-page narrative>,
  per_dimension_explanation: { speed: <text>, strength: <text>, intelligence: <text> },
  constraint_hypothesis: <which is the binding constraint and why>,
  recommended_focus_areas: [...]
}
```

### Where it lives in code

- Endpoint: `POST /api/assessments/:id/narrative`
- Prompt: `server/prompts/endpoint-templates/ssi-narrative.js`
- Service: `server/services/SSINarrativeService.js` (LLM call + fallback)
- Storage: `DiagnosticReport` model (`server/models/DiagnosticReport.js` + `server/models/SSIDiagnosticReport.js`)
- Permission: `LLMPolicy.js` — CONSULTANT, BUSINESS_OWNER, EXECUTIVE

### Why this matters for downstream stages

The Stage 1 narrative is the **canonical input to Stage 2 LLM co-authoring**. The consultant doesn't author from raw scores; they author with the diagnostic narrative open. The LLM at Stage 2 is also given the narrative (not just raw scores) so its phrasing aligns with what stakeholders have already read in the diagnostic.

**Implication**: Stage 1 must complete and produce a `DiagnosticReport` before Stage 2 begins. Today's bulk `team-ssi-view → Generate from Assessment` flow may not fully consume the narrative — worth verifying in S25 that the canonical Stage 2 surface (`POST /api/objective-wizard/refine-objective`) reads from `DiagnosticReport`, not just raw scores.

---

## LLM as Co-Author at Stage 2 (added 2026-05-06)

The Stage 2 transition (Prospect → Objective Identified) is **not a solo human action** — it is a human + LLM co-authoring loop. This is canonical, not optional.

### Why LLM is a co-author (not a suggestion-only assistant)

The consultant (or BO in self-serve) brings:
- Domain insight ("this company needs structured customer success")
- Strategic intent ("focus on Q2 retention")
- Stakeholder context (who is in the company; what the assessment said)

The LLM brings:
- Stakeholder-aligned phrasing — text that BO, managers, and employees all read the same way
- OKR grammar discipline (outcome-based, measurable framing)
- Cross-company pattern recognition from training

The output (an Objective title + tags) requires both. The LLM consumes the full context (assessment, company profile, consultant intent) and produces a refined formulation that the consultant ratifies. Without the LLM, the consultant produces shorthand that not all stakeholders parse the same way. Without the consultant, the LLM produces generic OKR-speak with no domain grounding.

### Inputs to the Stage 2 LLM call

```
{
  company_profile: { name, industry, size, focus, ... },
  assessment: { ssi_scores, weak_areas, threshold_constraint, ... },
  consultant_intent: {
    raw_text: <consultant's draft / hint / domain phrase>,
    optional_ssi_focus: <which SSI dimension>,
    optional_behavior_focus: <which discipline / behavior>,
    optional_stakeholder_group: <who this objective serves>,
    optional_timeframe: <month / quarter / continual>
  }
}
```

### Output of the Stage 2 LLM call

```
{
  refined_objective: {
    title: <stakeholder-readable, outcome-framed>,
    description: <one paragraph, plain language>,
    suggested_ssi_impact: { area, sub_dimension },
    suggested_discipline_ids: [...],
    suggested_stakeholder_group: <inferred from context>,
    suggested_timeframe_label: <inferred from context>,
    rationale: <why this framing fits assessment + profile>
  },
  alternatives: [<2-3 alternative phrasings>] (optional)
}
```

### Where this lives in code (today's reality vs. canonical)

- **Today**: `aiOKRService.generateObjectives` produces a *bulk batch* of objectives from weak areas (Stage 1 + Stage 2 collapsed into one call). It does not yet support a *single-objective refinement loop* with consultant-supplied draft input.
- **Canonical**: a per-objective LLM endpoint (`POST /api/objective-wizard/refine-objective` exists but is currently lightweight — accepts `{what, category, priority}` and produces a refined title/description). This is the closest existing surface; it would need to be extended to consume full Stage-2 input shape above and produce the full output shape.
- **The bulk-batch generator is not "wrong"**, just one mode. It's appropriate for a consultant who wants to triage 5 weak areas at once. The single-objective co-author is appropriate for the canonical authoring flow described in this matrix.

### Acceptance for "LLM is co-author"

A Stage 2 transition is correctly co-authored when:
1. The LLM was called with full company + assessment context (not just title text)
2. The human partner (consultant or BO) reviewed and ratified the LLM's refined output
3. The saved Objective contains the *ratified* text, not the raw human input or the raw LLM output

Implementation note: the saved Objective should also carry provenance metadata (e.g., `authored_by: 'consultant_with_llm' | 'bo_with_llm' | 'manual'`) for telemetry on how this flow performs in production.

---

## Assessment Ownership (the example of shifting ownership)

Assessment is the clearest case of ownership shifting across the lifecycle:

| Phase | Driver | What "ownership" means |
|---|---|---|
| Initial assessment send | Consultant | Consultant initiates from My Clients, sends invitation links to BO/Manager/Employee |
| Assessment completion | BO + Manager + Employee | Each persona takes the assessment in their own login |
| Result review | BO + Consultant (jointly) | Both want consolidated SSI results; consultant uses them to coach, BO uses them to act |
| Recurring assessments (post-launch) | Business Owner | BO triggers new assessment cycles independently; consultant in advisory role |

**Implication for S24**: Assessments tab on `client-workspace.html` (consultant view via `?client=:id`) is the consultant's *consumption* surface. It does NOT need write affordances because at this lifecycle stage the BO is taking ownership of running assessments. The consultant is in analytical mode.

---

## Implications for Sprint 24 (revisit)

These are the design choices in S24 that the matrix validates or adjusts:

### ✅ Validated by the matrix

1. **My Clients = Consultant-owned page** (toothpaste test passes). Sprint 24's "make it the consultant's CRM" goal is correct.
2. **Per-Objective lifecycle is orthogonal to per-Company stage**. The two-axis model from F-1 holds.
3. **Page-reuse via `?client=:id`** for Profile + Assessments works because consultants are consumers/setup-helpers at those moments, not primary drivers.
4. **Read-only Plan tab in workspace** is correct — Manager owns the planning page; consultant consumes it.
5. **Read-only Objectives tab in workspace** is correct — Business Owner owns the objectives page; consultant tracks state, doesn't create.
6. **Ball state mental model (3-stage)** matches the matrix exactly: Prospect rows aren't ball-state-relevant (no objective yet); Objective-Identified maps to `🎯 Identified`; Objective-Handed-Off maps to `🤝 Handed Off`; Objective-Sustained maps to `📊 Sustained`.

### ⚠️ Adjustments to consider

**Adjustment 1 — `display-labels.js` needs persona-aware labels**

A single `OBJECTIVE_LIFECYCLE_LABEL` constant isn't enough. The matrix shows that **the same lifecycle stage shows different labels to different personas**. So:

```js
// Instead of:
OBJECTIVE_LIFECYCLE_LABEL[stage] = "Identified"

// We need:
window.DisplayLabels.lifecycleView(stage, role) = {
  consultant: "🎯 Identified",
  business_owner: "Just created",  // owner-facing label
  manager: "Awaiting plan",        // manager-facing label
  employee: "Pending"              // employee-facing label
}
```

For S24, only the `consultant` mapping matters (Path A from F-1b). But the helper signature should accept role from day 1 so S25 owner-side can extend it without API change.

**Adjustment 2 — "Send assessment" affordance lives on My Clients tile (Prospect stage CTA)**

The matrix says: in Prospect stage, the consultant's three driving actions are **Add client / Fill profile / Send assessment**. We have:
- ✅ Add client → wizard (S22 #181)
- ✅ Fill profile → Profile tab page-reuse (S24 Epic 24.2)
- ❓ Send assessment → does the consultant have an explicit "Send assessment" action surface in S24?

Currently, sending an assessment requires the consultant to navigate into the workspace's Assessments tab and trigger from there (or use the existing invitation flow). Per the matrix, it should be **as prominent as Add Client and Fill Profile** when the company is in Prospect stage.

**Recommendation for S24** (small addition, ~1 pt): on the My Clients tile, when `Company.stage = 'prospect'` AND no assessment exists, show a "**Send Assessment** →" action alongside the existing tile CTA. Routes to the existing assessment-invitation flow scoped to the client. This is matrix-aligned and tiny.

**Adjustment 3 — Empty states should reflect stage driver**

The Objectives tab empty state ("This client has no objectives yet…") was originally going to be silent. The matrix says: in Objective-Identified stage, **the BO is the driver, not the consultant**. So the empty state should say:

> "*{Company} hasn't created their first objective yet. Owner login: [send a reminder] or [check assessment status]*"

NOT:
> "Create one with them"

Subtle UX shift: the consultant nudges, the BO drives. The matrix makes that explicit.

**Adjustment 4 — Notification routing aligns with drivers**

When `Objective.lifecycle_stage` transitions, the notification target should be the **next stage's driver**:
- `identified → kr_breakdown` (auto on first KR): notify the BO ("KR added — you can break it down further")
- `kr_breakdown → in_execution` (auto on first plan): notify the Manager ("Plan started — share with team")
- `in_execution → completion_review` (auto on all KRs at 100%): notify the Consultant ("Ready to mark sustained")

For S24 we deferred email-on-prefill (already locked) and silent auto-transitions (D-6). But if we ever wire transition notifications, the routing rule comes from this matrix.

---

## Persona Landing Routes (default after login)

This matrix implies what each persona's default landing route should be:

| Role | Default landing | Why |
|---|---|---|
| `CONSULTANT` | `/pages/my-clients.html` | Their owned page |
| `BUSINESS_OWNER` | `/pages/objectives.html` (current default is dashboard — flag for re-eval) | They own this page in matrix |
| `MANAGER` | `/pages/planning-v2.html` (current default is dashboard — flag for re-eval) | They own this page in matrix |
| `EMPLOYEE` | `/pages/dashboard-v2.html` | Their owned page (with Manager) |

**Note**: changing landing routes for BO/Manager is a **post-S24** consideration; flag for S25 design discussion. S24 stays focused on consultant-side.

---

## Future Open Questions (filed for later)

- **Q1**: When the BO logs in and the company's primary objective is in `Sustained` stage, what's the most-information page? Is it still Objectives, or does it shift to Dashboard? (Suggests post-launch ownership re-eval.)
- **Q2**: Do we want a **stage-aware homepage** that picks the right surface based on Company.stage AND the user's role-driven priority? (Possible S26 epic.)
- **Q3**: How do we surface to a Consultant that **THEIR** action is required vs **the BO's**? (E.g. "5 of your 12 clients need YOU to take action this week".) — driver-aware todo list.
- **Q4**: Manager owns Planning page in this matrix — but Sprint 22a #184a built `client-workspace.html#tab=plan` for consultant read-only. Reconcile: consultant has a *secondary* view of Planning via workspace; Manager has *primary* view via own login.

---

## Maintenance

This document is **canonical** for persona/stage/ownership questions. Update it when:
- A new persona is introduced (e.g., admin role, observer role)
- A new page is added to the platform
- A stage's driver changes (rare; would indicate a major product shift)
- A page's primary owner changes (also rare; would indicate IA reorganization)

Cross-references:
- [ACTIVATION_PLAYBOOK.md](ACTIVATION_PLAYBOOK.md) — **dynamic activation companion** to this static ownership matrix. Models the 5 handoffs (trigger / receiver / UI / email / action / completion-signal) that move the ball between actors. Extends the matrix's 3-stage objective-lifecycle ball-state model (line 251 of "Implications for Sprint 24") to a 5-position company-journey ball-state model (Off the field → Possession won → Identified → Handed Off → Sustained). The two views are compatible: the matrix is per-objective; the playbook adds the pre-objective positions for the activation chain.
- [SPRINT24_MASTER_PLAN.md](../3-DELIVERY/1-SPRINTS/SPRINT-24-Consultant-CRM%20%28In%20Progress%29/SPRINT24_MASTER_PLAN.md) — first sprint to formally adopt this matrix
- [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md) — overall product architecture
- [USER_JOURNEYS_CONSOLIDATED.md](USER_JOURNEYS_CONSOLIDATED.md) — journey detail
- DEBT-007 (in `product_backlog/MASTER_PRODUCT_BACKLOG.md`) — formal Objective.lifecycle_stage schema work; closes alongside S24
