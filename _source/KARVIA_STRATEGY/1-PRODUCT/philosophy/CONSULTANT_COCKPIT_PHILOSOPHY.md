# Consultant Cockpit — Philosophy & Why-Audit

<!-- @GENOME T2-PRD-PHIL-001 | ACTIVE | 2026-05-12 | parent:T1-PRD-002 | auto:- | linked:/strategy,/audit -->
<!-- Last touched: 2026-05-12 — flipped DRAFT→ACTIVE after user read-pass. Q-PHIL-07 added: SSI-diagnostic-derived risk counts (urgent/medium/improvement) as a future improvement candidate post-Beta. Cross-ref: roadmap/BETA_RELEASE_PROJECT/SPRINT_26_27_MILESTONE_LADDER.md. -->

> *"No field on screen without a why. No why without a source. No source without a regression."*

This document does **not** propose a redesign of the Consultant Cockpit (`client/pages/client-workspace.html`, Summary tab). It audits the cockpit *as it stands today* and asks, for every tile, whether the **why** is solid, the **derivation** is honest, and the **regression invariant** is named.

It is the first entry in [KARVIA_STRATEGY/1-PRODUCT/philosophy/](.) — a new philosophy thread, sibling to the existing vision-flavored [strategy/product_philosophy.md](../strategy/product_philosophy.md). Where `product_philosophy.md` answers *what Karvia is*, this thread answers *why each surface shows what it shows*.

---

## §1 — The Why-First Discipline

Every tile, badge, number, and icon on a Karvia surface should be reducible to four answers:

| Layer | Question | Failure mode if skipped |
|---|---|---|
| **Why** | Why does the user need to know this? | Vanity metrics — informational but inert |
| **What** | What question does it answer in one glance? | Numbers that need a sentence to interpret |
| **How** | How is it derived (which models, which formula)? | "Magic numbers" that can't be regression-tested |
| **When** | When does it update (snapshot rule, refresh cadence)? | Confusing freshness — yesterday's truth shown as today's |

A tile that cannot answer all four is a **shaky tile**. Shaky tiles are not removed — they are *clarified incrementally*. Radical change is not the response to philosophical drift; the response is *naming the drift* and routing the clarification through normal sprint cadence.

---

## §2 — The Anchor Question

> **"What does the consultant need to know about each client *in one glance*?"**

The answer is *already on the screen*. This document does not invent new fields. It asks of the existing answer: **is the screen serving the question, or is the question serving the screen?**

The cockpit (per the live screenshot, May 12 2026) shows six tiles:

1. **SSI** (with Speed / Strength / Intel breakdown)
2. **Risk** (single badge: `urgent` / `at_risk` / `healthy`)
3. **Objectives** (count + 3 lifecycle sub-icons)
4. **Teams** (count)
5. **Assessments** (completed + pending)
6. **Last Activity** (event + date)

§4 audits each one.

---

## §3 — The 5-Verb Backbone

Sprint 26's acceptance test names the consultant arc as five verbs: **Onboard → Engage → Diagnose → Author → Hand-off**. Every cockpit tile must answer the consultant's reflexive question *"where on this spine does this client sit?"* If a tile cannot be located on the spine, it is decorative.

| Verb | Cockpit tile that anchors it | Confidence |
|---|---|---|
| Onboard | Teams (have invitees logged in?) | Soft — see §4.4 |
| Engage | Last Activity (is anyone still showing up?) | Soft — see §4.6 |
| Diagnose | SSI · Assessments | Solid · Solid |
| Author | Objectives → `identified` icon | Solid |
| Hand-off | Objectives → `handed_off` / `sustained` icons | Solid |
| (cross-cutting) | Risk | Solid formula, soft semantics — see §4.2 |

The 5-verb spine is the **canonical thread**. It is also the regression backbone (§7). Cockpit changes should never violate verb-anchoring.

---

## §4 — Why-Audit of the Existing Tiles

For each tile: **Why · What · How · When · Confidence · Open clarification**.

Confidence rubric:
- **Solid** — All four layers answered. Derivation traceable in code. Regression-testable.
- **Soft** — Why is clear; derivation has a defensible default but is under-specified philosophically.
- **Shaky** — Why is asserted but not grounded; or derivation does not match the surfaced label.

---

### §4.1 — SSI Tile

> Visible: `SSI 5 · Speed 8 · Strength 3 · Intel 3`

- **Why**: SSI is Karvia's single canonical "is this client healthy on the inside?" signal. It compresses Speed (execution velocity), Strength (organizational stability), Intelligence (decision quality) into one number a consultant can scan in one second.
- **What question**: *"At a single-digit resolution, how healthy is this client across the three dimensions Karvia measures?"*
- **How derived**: `d.ssi.overall` from `GET /api/consultant/clients/:id/summary`. Backed by the canonical SSI 12-block calculation rooted in completed assessments. Dimensions surfaced as `dimensions.speed / .strength / .intelligence`. Reference: [ASSESSMENT_LIFECYCLE.md](../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md).
- **When**: Recomputed on every assessment completion (server-side). Read at tile-render time — not a stored snapshot per se, but conceptually a "latest-canonical-rollup" snapshot.
- **Confidence**: **Solid** on derivation. **Soft** on snapshot philosophy — see §6.
- **Open clarification**: *Is `5` the company-canonical score, the consultant's last-seen score, or a rollup across multiple internal assessment sources?* The label says "SSI" without qualification; the philosophy of which SSI is unspecified. **§6 parks this.**

---

### §4.2 — Risk Tile

> Visible: `RISK · URGENT`

- **Why**: Risk is the consultant's "do I need to do something this week?" trigger. A green-yellow-red signal that surfaces above the dashboard noise.
- **What question**: *"Should I intervene on this client right now?"*
- **How derived**: `d.riskStatus`, computed server-side at read time (not stored) in [server/routes/consultant.js:42-57](../../../server/routes/consultant.js#L42-L57) — function `computeRiskStatus`. Inputs: `avgSSI`, `lastAssessmentAt`, `objectiveBuckets`. Rules (D-C-5):
  - **`urgent`** if any of:
    - No assessment in ≥90 days, OR
    - `avgSSI > 0 && avgSSI < 50`, OR
    - Any objective stale-at-risk for ≥30 days (`behindStale > 0`)
  - **`at_risk`** if any of:
    - `avgSSI` between 50–65, OR
    - ≥50% of active objectives bucketed `at_risk` or `behind`
  - **`healthy`** otherwise.
- **When**: Computed on every read of the summary endpoint — always live.
- **Confidence**: **Solid** on derivation (formula is named, testable, has a sprint-attached ID `D-C-5`). **Soft** on what the consultant should *do* with it — the badge names a state, not an action.
- **Open clarification**: *"URGENT" tells the consultant the state is bad; it does not tell them which of the three triggers fired.* A stale assessment, a low SSI, and a stale-at-risk objective demand three different consultant responses. Today the badge collapses them. **Listed in §5.** This is not (yet) a redesign — it is a *disclosure* question.
- **Note on the earlier brainstorm**: An earlier instinct was to split Risk into "Ops Risk" + "Strategy Risk." On audit, the existing formula *already mixes both* — SSI band = strategy signal, objective-bucket health + assessment recency = ops signal. The formula is correct in spirit. The clarification is **disclosure, not decomposition**: the badge could carry a tooltip naming which trigger fired. **No new tile is implied.**

---

### §4.3 — Objectives Tile

> Visible: `OBJECTIVES 0 · 🎯 0 🏅 0 📊 0`

- **Why**: Objectives are the *output* of the consultant's authoring work. Their count + lifecycle state tell the consultant what they've shipped and what's still in-flight on the 5-verb spine.
- **What question**: *"What have I authored, what have I handed off, what is the client sustaining on their own?"*
- **How derived**: `d.objectives.total` plus `d.objectives.lifecycle = { identified, handed_off, sustained }`. Computed via `bucketByLifecycle()` in [server/routes/consultant.js:86-111](../../../server/routes/consultant.js#L86-L111), mapping `Objective.lifecycle_stage` (S24 D-Onion-4) into the 3-state consultant ball-view. Source of truth: `server/constants/objectiveLifecycle.js` (`CONSULTANT_BALL_VIEW`).
- **When**: Read-time aggregation. Updates whenever any objective's `lifecycle_stage` is mutated.
- **Confidence**: **Solid** on derivation. **Shaky on legibility** — the three sub-icons (target / medal / chart) are graphically small and semantically opaque; the consultant cannot tell at a glance which icon means `identified` vs `handed_off` vs `sustained`.
- **Open clarification**: *The 3 icons map to the cleanest possible philosophical anchor — three verbs on the 5-verb spine.* That mapping is *invisible* to the user. Incremental fix: tooltip + legend. **Listed in §8.** No layout change.
- **Why this matters philosophically**: When a tile encodes the philosophy correctly but renders it illegibly, the failure is *expression*, not *concept*. The cockpit holds. The pixel does not.

---

### §4.4 — Teams Tile

> Visible: `TEAMS 0`

- **Why**: The Teams count is the consultant's first signal of **Onboard** progress. Before any assessment can complete or any objective can be authored, real humans must show up.
- **What question**: *"How many people from this client have actually crossed the threshold into the platform?"*
- **How derived**: `d.teams.count`. Source: `GET /api/consultant/clients/:id/summary`. The number reflects users associated with the client company — but the precise definition (invited vs. logged-in-at-least-once vs. active) is **not pinned in this document** and warrants confirmation.
- **When**: Read-time.
- **Confidence**: **Soft.** The *why* is strong (Onboard verb anchor). The *what* is ambiguous: does `Teams = 0` mean "no one invited" or "no one logged in yet" or "no one assessed"? The same display means very different consultant states.
- **Open clarification**: *Pin the semantic.* You named (in conversation) the desired semantic: "people who have taken the first step — logged in." If that is the intent, the field name (`Teams`) and the semantic (`logged-in users`) are mismatched. Either:
  - The display label remains "Teams" and the tooltip names "members onboarded," OR
  - The number itself is redefined to "departments / teams structurally created."
- **Listed in §5 and §8.** No new tile; clarify the existing one.

---

### §4.5 — Assessments Tile

> Visible: `ASSESSMENTS 2 · 0 pending`

- **Why**: The Assessments tile is the **Diagnose** verb's progress indicator. Without completed assessments, SSI cannot exist; without SSI, Risk has no inputs; without Risk, the consultant has no trigger.
- **What question**: *"Has the client given me enough diagnostic data to act on?"*
- **How derived**: `d.assessments.completed` (top number) and `d.assessments.pending` (subline). Source: `GET /api/consultant/clients/:id/summary`.
- **When**: Read-time. Updates on assessment completion and on new assessment dispatch.
- **Confidence**: **Solid** on the two-number disclosure. **Soft** on granularity — the tile does not distinguish *which cohort* the assessments belong to (BO / Manager / Employee / Executive), nor *which template type*.
- **Open clarification**: The tile is a *roll-up*. The granular view is on the dedicated Assessments tab. The philosophical question — *is the roll-up the right resolution for the consultant's glance?* — is answered **yes** today (one second of attention, one decision: "do I need to nudge?"). Granularity belongs on the deep view. **No change implied.**

---

### §4.6 — Last Activity Tile

> Visible: `LAST ACTIVITY · Completed assessment · May 12, 2026`

- **Why**: A pulse. Even if every other tile looks fine, a six-month silence is a problem. Last Activity is the **Engage** verb's heartbeat.
- **What question**: *"Is this relationship still warm?"*
- **How derived**: `d.lastActivity = { description, date }`. Computed in [server/routes/consultant.js:731-739](../../../server/routes/consultant.js#L731-L739) as the *later* of:
  - `lastAssessmentAt` (most recent completed assessment), OR
  - `latestObjective.updated_at` (most recent objective mutation).
  Whichever wins decides `description`.
- **When**: Read-time.
- **Confidence**: **Shaky.** The "activity" definition is **binary** — assessment completions OR objective updates. It does *not* include:
  - User logins (the strongest signal of Engage)
  - KR / weekly-goal / task updates (the strongest signal of execution rhythm)
  - Team-member additions (the strongest signal of Onboard motion)
  - Email opens or deep-link clicks (the consultant's own nudge return-signal)
- **Open clarification**: *Either the label or the derivation is wrong.* If the tile genuinely measures "last meaningful event on this client," its sources are too narrow. If it measures specifically "last data-changing event," the label is misleading.
- **Listed in §5.** No code change today; the *philosophical pin* is what matters first. Once we know what "activity" *means*, we can decide whether to widen the sources or rename the tile.

---

## §5 — Open Philosophical Questions

Not assigned to a sprint. Listed for future strategy sessions to consume.

| # | Question | Source tile / section | Resolution path |
|---|---|---|---|
| Q-PHIL-01 | When `riskStatus = urgent`, *which* trigger fired? (low SSI / stale assessment / stale-at-risk objective) | §4.2 | Decision: disclose via tooltip vs. leave consolidated |
| Q-PHIL-02 | What is the canonical SSI when multiple snapshot sources exist (consultant-issued vs. manager-internal vs. employee-level)? | §4.1, §6 | Likely converges with Sprint 26-E (Assessment Aggregation Reliability) outcomes — but the *philosophy* may need to lead the engineering |
| Q-PHIL-03 | What does `Teams: N` count? Members? Departments? Logged-in users? Onboarded users? | §4.4 | Semantic pin needed before any UX clarification; one-line decision |
| Q-PHIL-04 | What counts as "Last Activity"? | §4.6 | Decision: widen sources, narrow label, or both |
| Q-PHIL-05 | Are the 3 Objective sub-icons (🎯 🏅 📊) legible without a legend? | §4.3 | Probably no. Tooltip / inline label is the incremental fix |
| Q-PHIL-06 | Are there fields the cockpit *currently lacks* that the consultant's reflex would expect? (e.g., a "next nudge due" pulse) | cross-cutting | Deferred to a future why-audit — *additions* are a different conversation than *clarifications*; this doc explicitly does not propose them |
| Q-PHIL-07 | Should the Risk tile surface **counts** (urgent / medium / improvement) sourced from the **SSI diagnostic report's LLM-tagged risk elements**, alongside the D-C-5 state badge? | §4.2 | The SSI diagnostic report (LLM-generated) already tags items by severity. The Risk tile today shows a *state* (`urgent`); the consultant's reflex question is *"how many things, and which ones?"* — a count-based disclosure may be more actionable than a state-based one. **Deferred to post-Beta** per [SPRINT_26_27_MILESTONE_LADDER.md](../roadmap/BETA_RELEASE_PROJECT/SPRINT_26_27_MILESTONE_LADDER.md) — improvement, not S26 scope. |

---

## §6 — SSI as a Snapshot, Not a Reading

> *"SSI is not a thermometer reading. It is a photograph taken from a specific angle, at a specific moment, with a specific exposure."*

The SSI tile shows one number. The underlying reality is *layered*:

| Layer | Who issues | What it captures | When it updates |
|---|---|---|---|
| **Consultant snapshot** | Consultant via Karvia-issued assessment to BO + leadership | Outside-in diagnostic across the 12 SSI blocks | On consultant-issued assessment completion |
| **Manager internal snapshot** *(future)* | Manager assessing their own team | Inside-out diagnostic of department execution | On manager-issued internal assessment completion |
| **Employee self-snapshot** *(future)* | Individual contributor self-reporting | Ground-truth velocity / blockers | On employee touchpoint completion |
| **Canonical company SSI** | Computed | Reconciled aggregate across the above | On any feeder completion |

**The philosophical question**: *When the layers disagree, which wins?* Consultant-issued is the **outside-in baseline**. Manager-internal is **inside-out adjustment**. Reconciliation rules are **not yet philosophically pinned**. Sprint 26-E (Assessment Aggregation Reliability) addresses the *engineering* of aggregation; this section flags that the **product question** (which layer is canonical for the consultant's cockpit?) is separate and unresolved.

**No change is recommended today.** What is recommended: *that the SSI tile's label "5" be interpreted as the **outside-in consultant snapshot** until reconciliation rules are pinned.* That is the most defensible default — and it should be tooltip-disclosable when the question is asked.

This section will likely expand into its own document (`SSI_SNAPSHOT_PHILOSOPHY.md`) when reconciliation logic is on the table.

---

## §7 — Regression as Backbone

> *"Tests are the spine. Flows are the ribs."*

Every tile in §4 corresponds to one regression invariant. The cockpit is *philosophically stable* if and only if those invariants hold. Listed below as named claims, not as test code:

| Tile | Invariant (read-time claim that must always hold) |
|---|---|
| §4.1 SSI | `d.ssi.overall` is in `[0, 100]` and equals the canonical SSI block-rollup over completed canonical assessments |
| §4.2 Risk | `d.riskStatus ∈ {healthy, at_risk, urgent}` and matches the deterministic D-C-5 formula for the same inputs |
| §4.3 Objectives | `d.objectives.lifecycle.{identified + handed_off + sustained} ≤ d.objectives.total` (excluded statuses can make the sum strictly less; never greater) |
| §4.4 Teams | `d.teams.count ≥ 0` and matches the semantic pinned by Q-PHIL-03 |
| §4.5 Assessments | `d.assessments.completed + d.assessments.pending` equals total dispatched (no orphans) |
| §4.6 Last Activity | `d.lastActivity.date ≤ now()` and `d.lastActivity.description` matches one of the source events listed in the (forthcoming) semantic for Q-PHIL-04 |

The 5-verb backbone (§3) is the canonical thread. Cockpit regressions exist *because* the spine exists; they are not arbitrary. When a tile's semantic is clarified (Q-PHIL-03, -04), its invariant gets sharper, not louder.

Cross-reference: the prompt-regression fixture suite (Sprint 25 PX-5.3) is the model for how invariants become tests. The same discipline applies here.

---

## §8 — Incremental Improvement Candidates

These are **not tasks**. They are *clarifications surfaced by the audit*. They follow the user's standing rule: **incremental change, never radical.** If any one of them is later promoted to a sprint task, it inherits a stable audit ID per the audit-governance convention.

| # | Tile | Candidate clarification | Type | Cost |
|---|---|---|---|---|
| C-01 | §4.2 Risk | Add tooltip on `URGENT` badge naming which trigger fired (low SSI / stale assessment / stale objective) | Disclosure | ~XS |
| C-02 | §4.3 Objectives | Add visible legend or per-icon tooltip naming `identified` · `handed_off` · `sustained` | Disclosure | ~XS |
| C-03 | §4.4 Teams | Pin semantic in [client-workspace.html](../../../client/pages/client-workspace.html) tile (e.g., subline: "members logged in" or "members invited"), aligned to Q-PHIL-03 resolution | Disclosure | ~XS |
| C-04 | §4.6 Last Activity | Expand source list to include logins / KR updates / team adds OR narrow the label to "Last data update" | Semantic | ~S |
| C-05 | §4.1 SSI | Add hover-disclosure: "outside-in consultant snapshot as of `<date>`" | Disclosure | ~XS |

Each is a single-line change to a tooltip / subline / data source. None require new tiles, new endpoints, or layout shifts.

---

## §9 — What This Document Explicitly Refuses to Do

By design — to keep the philosophy thread credible:

- ❌ Propose new tiles (Ops Risk + Strategy Risk as separate cards, "Next Nudge Due" pulse, etc.) — *additions belong in a different conversation*
- ❌ Recommend specific Sprint 26 tasks — the open questions feed *strategy sessions*, not sprint scope, until you say otherwise
- ❌ Touch code, models, endpoints, or layouts
- ❌ Resolve any of the Q-PHIL-XX open questions — *naming them is the deliverable*

When the open questions are picked up, the resolution lives in a follow-up doc (likely `SSI_SNAPSHOT_PHILOSOPHY.md`, `RISK_DISCLOSURE_PHILOSOPHY.md`, etc.), and incremental clarifications (§8) are routed through normal sprint cadence with stable audit IDs.

---

## §10 — Cross-References

- [client/pages/client-workspace.html](../../../client/pages/client-workspace.html) — cockpit page
- [client/pages/scripts/client-workspace.js](../../../client/pages/scripts/client-workspace.js) — tile rendering (`renderSummary` at line ~260)
- [server/routes/consultant.js](../../../server/routes/consultant.js) — `computeRiskStatus` (L42), `bucketByLifecycle` (L86), summary endpoint (L729+)
- [ASSESSMENT_LIFECYCLE.md](../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) — canonical assessment reference (T2-ARC-023)
- [KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md](../../2-TECHNICAL/KR_AGGREGATION_AND_LIFECYCLE_AUDIT.md) — rollup audit
- [SPRINT26_HANDOFF_DOCUMENT.md](../../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_HANDOFF_DOCUMENT.md) — sprint 26 (5-verb acceptance test)
- [strategy/product_philosophy.md](../strategy/product_philosophy.md) — sibling vision-flavored doc
- [YSELA/philosophy/YSELA_PHILOSOPHY.md](../../../YSELA/philosophy/YSELA_PHILOSOPHY.md) — brand layer philosophy

---

## §11 — Document Lifecycle

- **Status**: `ACTIVE` (authored + flipped 2026-05-12 after user read-pass; Q-PHIL-07 added in same revision)
- **Auto-loaded by**: nothing (intentionally — `auto:-`)
- **Linked by**: `/strategy`, `/audit` (referenced when philosophy questions surface during sprint planning or audit sessions)
- **Successor docs (when written)**: `SSI_SNAPSHOT_PHILOSOPHY.md`, `RISK_DISCLOSURE_PHILOSOPHY.md`, `COCKPIT_ACTIVITY_DEFINITION.md`
- **Expected revision triggers**: resolution of any Q-PHIL-XX item; addition of a new cockpit tile; redesign of any audited tile

---

*First entry in `KARVIA_STRATEGY/1-PRODUCT/philosophy/`. The thread is incremental by design — one why-audit at a time.*
