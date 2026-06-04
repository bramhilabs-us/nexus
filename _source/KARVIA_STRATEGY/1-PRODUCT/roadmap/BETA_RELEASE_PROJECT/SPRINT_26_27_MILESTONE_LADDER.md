# Sprint 26 → 27 → (28) Milestone Ladder

<!-- @GENOME T2-PRD-MILESTONE-001 | ACTIVE | 2026-05-12 | parent:T1-PRD-002 | auto:- | linked:/strategy,/init -->

> *"Sprint 26 = First Objective. Sprint 27 = First Task. Sprint 28 = TBD. Beta launches between S26 and S27."*

This document is an **addendum** to [BETA_ROADMAP_2026.md](BETA_ROADMAP_2026.md) (T1-PRD-002). It does **not** replace or restructure the canonical roadmap. It captures the *milestone-ladder framing* that emerged from the May 12 2026 strategy session ([CONSULTANT_COCKPIT_PHILOSOPHY.md](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md)) — specifically the success criteria, the ladder of mini-milestones inside each sprint, and the explicit deferrals.

It is incremental by design — one ladder per sprint, named in plain language, each step measurable from the consultant's cockpit.

---

## §1 — The Standing Constraint (Re-Stated)

This entry exists *because* the standing constraint matters:

- **Incremental, never radical.** No new tiles. No new features. No new endpoints.
- **The cockpit shows what is gettable.** Middleware does light intelligence work and trade-offs. Anything beyond that is post-Beta.
- **One consultant, super-admin role.** The cockpit page IS the consultant's product surface for the duration of S26.
- **Beta launches after S26 closes.** Measurement begins immediately. Learning feeds S27.

Every milestone below is checked against this constraint. Anything that asks for new surface area is explicitly deferred.

---

## §2 — Sprint 26: First Objective

### Goal (re-stated for canonical clarity)

> **Every client a consultant adds completes the spine: assessment taken → team members added → team members assess → SSI calculated → risk surfaced → first objective created.**

### Success Criterion (the number that matters)

> **9 clients × 5 team members each, all assessments correctly computed, all cockpit tiles credible.**

Concretely, at S26 close, the consultant's cockpit (`client/pages/client-workspace.html`, Summary tab) for each of the 9 clients shows:

| Cockpit tile | What must be true at S26 close |
|---|---|
| **SSI** | A credible non-zero number, with Speed / Strength / Intel breakdown reflecting actual completed assessments |
| **Risk** | Surfaces the right state (`urgent` / `at_risk` / `healthy`) per the D-C-5 formula. *State-level only — counts deferred to post-Beta (see §5).* |
| **Objectives** | At least 1 (the first objective) — visible in the `identified` lifecycle bucket |
| **Teams** | ≥5 (team members who took the step) |
| **Assessments** | ≥5 completed; pending count accurate |
| **Last Activity** | Within the past few days — proof the relationship is warm |

### Mini-Milestone Ladder (per-client, ordered)

```
Add client
  ↓
Client (BO) takes the assessment            ← assessment count = 1
  ↓
BO adds team members                        ← Teams count begins climbing
  ↓
Team members log in                         ← Onboard verb anchor
  ↓
Team members take their assessments         ← assessment count climbs
  ↓
SSI is correctly calculated                 ← SSI tile becomes credible
  ↓
Risk is surfaced (state badge)              ← Risk tile becomes credible
  ↓
First objective is created                  ← S26 acceptance criterion met
```

Every step is measurable from the cockpit. No step requires new surface area. Each step is a *gate* — if it fails, the client cannot progress.

### What S26 explicitly does NOT do

- ❌ Decompose Risk into urgent/medium/improvement counts (deferred — see §5)
- ❌ Widen "Last Activity" sources (deferred — see [Q-PHIL-04](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions))
- ❌ Pin "Teams" semantic with new UX (deferred — see [Q-PHIL-03](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions))
- ❌ Add a legend to the 3 Objective sub-icons (deferred — see [Q-PHIL-05](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions))
- ❌ Introduce a second consultant role / departmental hierarchy

S26 fights *only* for the spine. Clarifications are post-Beta.

### Beta Launch Trigger

When the success criterion in this section is *demonstrable* (i.e., the consultant can show 9 clients with the cockpit credibly populated), Beta launches. The 9-client cohort becomes the first measured group. Real customers replace test clients in the same surface.

---

## §3 — Sprint 27: First Task

### Goal (preliminary — to be detailed by S27 strategy session)

> **Every objective created in S26 leads to the first task being created, owned, and visible to the right person.**

The First Task milestone is the bridge from *authoring* (consultant verb) to *execution* (client verb). If S26 proves *handoff is possible*, S27 proves *handoff sustains*.

### Mini-Milestone Ladder (per-objective, ordered, preliminary)

```
First objective exists (S26 carryover)
  ↓
KRs cascade or are manually defined
  ↓
First quarterly goal lands under a KR
  ↓
First weekly goal lands under the quarterly
  ↓
First task lands under the weekly                  ← S27 acceptance criterion
  ↓
The task has an owner who is logged in
  ↓
The owner sees it on their surface
```

Same constraint: every step measurable, no new surface area, no decomposition of existing tiles.

### What S27 will pick up from S26 learning

- Real beta cohort feedback (9 clients, by then ~30+ active team members)
- Which mini-milestone gates *break* in the wild — those become S27's bug surface
- Whether SSI calculation is provably correct under multi-source aggregation (Sprint 26-E's deliverable, consumed by S27)
- Which deferrals from §5 below have *escalated* due to beta usage patterns

### What S27 explicitly does NOT do (preliminary)

- ❌ Add new consultant roles, sub-roles, or multi-consultant collaboration
- ❌ Redesign the cockpit
- ❌ Address any of the §5 deferrals unless a beta finding *forces* it

---

## §4 — Sprint 28: Placeholder

> **Intentionally blank.** S28 will be scoped after the S26 beta cohort has been measured for at least 2 weeks and S27 has shipped. Likely candidates (drawn from §5 deferrals + S27 carryover) — but **no commitments here**.

Adding S28 entries today would violate the standing constraint (don't design for hypothetical futures). The slot is named only so the ladder reads forward.

---

## §5 — Improvement Candidates Deferred Past S26

These are *not* roadmap commitments. They are the deferred-improvement queue surfaced by [CONSULTANT_COCKPIT_PHILOSOPHY.md](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md). Each carries the philosophy doc's reference so the *why* is traceable.

| # | Improvement | Source (Q-PHIL) | Earliest sprint that could pick it up |
|---|---|---|---|
| I-01 | Risk tile shows **counts** (urgent / medium / improvement) sourced from the SSI diagnostic report's LLM-tagged risk elements, alongside the D-C-5 state | [Q-PHIL-07](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions) | Post-Beta (S28+) |
| I-02 | Risk badge tooltip naming which D-C-5 trigger fired | [Q-PHIL-01](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions) | S28+ |
| I-03 | Legend / tooltips for the 3 Objective lifecycle icons | [Q-PHIL-05](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions) | S28+ |
| I-04 | "Teams" semantic pin (logged-in vs invited vs onboarded) + subline | [Q-PHIL-03](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions) | S28+ |
| I-05 | "Last Activity" widened to include logins / KR updates / team adds | [Q-PHIL-04](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#5--open-philosophical-questions) | S28+ |
| I-06 | SSI multi-source reconciliation philosophy + label disclosure | [Q-PHIL-02](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md#6--ssi-as-a-snapshot-not-a-reading) | Tied to S26-E delivery; surface change post-Beta |
| I-07 | Consultant **Assessments tab** in [client-workspace.html](../../../../client/pages/client-workspace.html) shows in-tab summary (who invited, who sent, who took, who pending — MECE by role × status) instead of redirecting the consultant into the client's BO assessment surface. Same cockpit-principle family as I-04 (Teams semantic). | Surfaced 2026-05-12 post-/strategy #222 by user direction; no Q-PHIL parent (new) | Post-Beta (S28+) |

### Specific note on I-01 (the new insight from May 12 session)

The Risk tile today is a **state** (one of `urgent` / `at_risk` / `healthy`). The consultant's reflex question is *"how many things should I act on, and at what severity?"* — a question better answered by **counts**.

The natural source is the **SSI diagnostic report**, which already runs LLM analysis over the assessment results and tags risk elements. If those tags can be reduced to three buckets (urgent / medium / improvement), the Risk tile could show the count of urgent items, with a tooltip breakdown.

**This is an improvement, not S26 scope.** Adding it now would:

- Introduce dependency on the diagnostic-report pipeline being read-callable from the cockpit endpoint
- Require a new aggregation path through middleware
- Risk the S26 timeline / 9-client beta criterion

It is captured here so the insight is not lost; it is *not* a commitment.

---

## §6 — How This Ladder Connects to the Canonical Roadmap

- **[BETA_ROADMAP_2026.md](BETA_ROADMAP_2026.md)** (T1-PRD-002) remains the canonical product roadmap. It defines the four-step Beta product model (Assess → Team → Objectives → Tasks).
- **This document** sharpens the *sprint-level milestone ladder* for the two sprints that ship around the Beta launch boundary.
- The success criterion in §2 is the *Beta-launch trigger*. S26 close + criterion-met = launch.
- Anything in §5 surfaces back into BETA_ROADMAP_2026.md *only when promoted* by a future strategy session. Until then, it stays deferred here.

---

## §7 — Cross-References

- [BETA_ROADMAP_2026.md](BETA_ROADMAP_2026.md) — canonical Beta roadmap (parent)
- [CONSULTANT_COCKPIT_PHILOSOPHY.md](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md) — source of the cockpit why-audit and Q-PHIL-XX open questions
- [SPRINT26_HANDOFF_DOCUMENT.md](../../../3-DELIVERY/1-SPRINTS/SPRINT-26-First-Objective/SPRINT26_HANDOFF_DOCUMENT.md) — S26 task spine (24 firing tasks across A/B/C/D/E)
- [ASSESSMENT_LIFECYCLE.md](../../../2-TECHNICAL/ASSESSMENT_LIFECYCLE.md) — assessment reference for SSI calculation correctness
- [client/pages/client-workspace.html](../../../../client/pages/client-workspace.html) — the single cockpit page that is the consultant's S26 product surface

---

## §8 — Document Lifecycle

- **Status**: `ACTIVE` (authored 2026-05-12 as session output of strategy session: cockpit philosophy + roadmap framing)
- **Auto-loaded by**: nothing (`auto:-`)
- **Linked by**: `/strategy`, `/init` (read when planning next sprint or restoring sprint context)
- **Revision trigger**: Beta cohort measurement (post-S26 close); S27 scoping; any promotion of a §5 deferral into a sprint

---

*Sibling to [CONSULTANT_COCKPIT_PHILOSOPHY.md](../../philosophy/CONSULTANT_COCKPIT_PHILOSOPHY.md). The philosophy answers* why *the cockpit shows what it shows; this ladder answers* when *each cockpit number first becomes credible.*
