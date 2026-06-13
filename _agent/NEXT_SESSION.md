# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: CONTRACT (Night 1b, sprint 2 — N1-P4-02)
**Task**: **N1-P4-02 — Nexus-vs-Karvia diff + Assessment interface spec** (2 deliverables). Why now: N1-P4-01 sealed both steps (session-28 placement, session-29 signatures) — the contract surface is fixed, so the next move is (a) the module-by-module diff that tells the Night 2 lift what changes vs Karvia, and (b) the full `AssessmentProvider` spec whose acceptance test is the second-provider drill. It consumes MODULE_CONTRACTS_DRAFT directly.

**READ FIRST** (in order):
1. `NEXUS_STRATEGY/2-TECHNICAL/MODULE_CONTRACTS_DRAFT.md` — **the source for this session**: the 8 `contract.ts` interfaces, the AIR `AssessmentProvider` registration, the shells, NotificationPort, orchestrator. The diff and the spec build *on* these signatures.
2. `NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md` § pluggable assessment (the `AssessmentProvider` TS, L271–305) — the spec extends this to its full shape (Instrument, Evidence, Score, Deliverable, ObjectiveDraft, ProgramContext, lifecycle hooks); ASSESSMENT_INTERFACE_SPEC.md is the canonical home those types graduate into.
3. `NEXUS_STRATEGY/2-TECHNICAL/MODULARIZATION_PLAN.md` § @nexus/assessment + the AIR impl-folder layout — the diff's assessment row; what dies (SSI bank, 40 routes) vs what AIR ships.
4. `NEXUS_STRATEGY/2-TECHNICAL/SYSTEM_ARCHITECTURE.md` + `API_SURFACE.md` — the Karvia side of every diff row (engines → modules, 410 routes → 8 surfaces + 2 shells).
5. `_agent/DECISIONS.md` C-006 (SSI drop — the assessment diff's spine), C-003/4/5/C-020 (the four the diff must reflect).
6. Karvia reference (READ-ONLY, CLAUDE.md rule 1): `_source/` snapshot for the module-by-module before/after; `karvia_business/engines/assessment/` as the SSI counter-example the spec cites but does not lift.

**Definition of done**:
- `NEXUS_VS_KARVIA_DIFF.md` under 2-TECHNICAL, graph-wired (parent: SYSTEM_ARCHITECTURE or MODULARIZATION_PLAN — pick by altitude) — **module-by-module**: for each of the 8 blocks + 2 shells, what Karvia had → what Nexus keeps/reshapes/drops, citing the route/model dispositions already catalogued (don't re-derive — cite API_SURFACE / MODULE_DEPENDENCY_GRAPH / the contracts draft).
- `ASSESSMENT_INTERFACE_SPEC.md` under 2-TECHNICAL, graph-wired (child of TECH_STRATEGY; sibling of MODULE_CONTRACTS_DRAFT) — the **full pluggable contract**: every type the `AssessmentProvider` interface references fleshed out, the registration lifecycle, the AIR impl as the worked example, and **the second-provider drill written as the acceptance test** (implementing provider #2 touches only `assessment/impls/<new>/`).
- Doc-graph green; both new docs carry summary + parents + revisit triggers; retire any N1 revisit trigger they satisfy.

**Watch out for**:
- **PR stack is now 8 deep** (#25←…←session-28←session-29). Continue the chain off `session/2026-06-13-28-modularization-plan` — do NOT base on main unless the stack has merged. (Branch name is stale vs session number — that's fine, the stack is what matters.)
- **Step-count drift to reconcile (rule 2)**: the session-28 card listed `P6-01` among Night-1b's remaining steps, but BACKLOG shows N1-P6-01 **DONE in session-24** (the Night-1 close-out). Either the card double-counted or there's a distinct Night-1b close-out not yet in BACKLOG. **The N1b close groom (whoever runs it) must re-sum and name where that step went** — do not trust the labelled "5 remaining."
- **Founder flags still pending** (carried since session-27, none block this session): (a) the §7 NotificationPort owner ratification (governance dispatch + crm-direct invitation mail); (b) P3-08 fallback cadences (48h/day-3/day-7); (c) review leftovers (Builder viewer = Lena Chen·Manager, PQ-1 "Push task completion" wording, official logo-variant exports). 30-sec confirms if the founder is in-session.
- Don't re-invent the `AssessmentProvider` interface — it's fixed in TECH_STRATEGY and cited in the contracts draft. The spec *fleshes out its referenced types and the drill*, it doesn't re-shape the interface (if a type reveals the interface is wrong, fix TECH_STRATEGY — the newer record wins, rule 1 — and note it).
- Step count: **36/105** after session-29 (one sealed unit). **Night 1b: 7 of 10 spent**; task-steps remaining after this: P5-01 · P5-02 (the test pair) — then the N1b close groom. Re-sum at the groom.
