# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: CONTRACT (Night 1b, sprint 2 — N1-P4-01 step 2 of 2)
**Task**: **N1-P4-01 step 2 — MODULE_CONTRACTS_DRAFT.md** (1 step). Why now: step 1 (MODULARIZATION_PLAN) sealed in session-28 — the placement is fixed; step 2 draws the actual `contract.ts` TypeScript signatures on those placements. N1-P4-02 (Karvia diff + assessment interface spec) consumes this.

**READ FIRST** (in order):
1. `NEXUS_STRATEGY/2-TECHNICAL/MODULARIZATION_PLAN.md` — **the spec for this session**: §the eight blocks (what each owns/consumes/republishes), §the two shells, §Layer-4 + stage machine placement, §7 the NotificationPort owner, §"What N1-P4-01 step 2 takes from here" (the explicit draw-list)
2. `NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md` § "Journey ↔ contract index" (lines ~313–326) — **these calls/events ARE the acceptance criteria**; every `crm.*`/`assessment.*`/`objectives.*`/`milestones.*`/`tasks.*`/`governance.*`/`knowledge.*` + every `event …` there must appear in a signature
3. `NEXUS_STRATEGY/2-TECHNICAL/API_SURFACE.md` — route sets each block republishes (cite the cluster tables)
4. `NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md` — the bold cross-boundary edges = exactly the contract surface; nothing else crosses a boundary in v1
5. `NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md` — the `PageContract` + `AssessmentProvider` TS already drafted there (§Layer 1, §pluggable assessment); the contracts draft extends/cites them, doesn't re-invent
6. `_agent/DECISIONS.md` C-003/C-004/C-005/C-020 — the four the signatures must reflect

**Definition of done**:
- `MODULE_CONTRACTS_DRAFT.md` exists under 2-TECHNICAL, **graph-wired as a child of MODULARIZATION_PLAN** (the plan already carries a `revisit` trigger expecting exactly this; retire it on landing) — TS `contract.ts` signature per the 8 blocks + the AIR provider registration + the 2 shells' composition interfaces
- Every entry in the USER_JOURNEYS journey↔contract index has a matching signature (acceptance criteria); routes cite API_SURFACE, edges cite MODULE_DEPENDENCY_GRAPH
- **PageContract draft carries the stage-weather items** (session-27 pt 3, in the plan's handoff §): stage-keyed primary CTA + stage-keyed Dashboard section as declared config; Teams' Prospect empty state = Sponsor matrix import; the **rules surface** field (N1-P3-10) rendered in the contract
- The **`NotificationPort`** and **Layer-4 orchestrator** interfaces (plan §7, §C-020) drafted
- Contract-first invariant (CLAUDE.md rule 7): interface + the contract-test *shape* (shapes/errors/idempotency/tenant-isolation per TECH_STRATEGY anatomy), not implementations

**Watch out for**:
- **PR stack is now 7 deep** (#25←#26←#27←#28←#29←#30←session-28 PR). Continue the chain off `session/2026-06-13-28-modularization-plan` — do NOT base on main unless the stack has merged
- Don't re-draw the placement — it's fixed in the plan; step 2 is signatures *on* it. If a signature reveals a placement is wrong, fix the plan (the newer record wins, SESSION_PRACTICES rule 1) and note it, don't silently diverge
- **Founder flags still pending** (30-sec confirms if in-session): (a) the §7 mail-owner assignment (governance dispatch + crm-direct invitation mail) — the plan flagged it for ratification; (b) P3-08 fallback cadences (48h/day-3/day-7); (c) session-27 review leftovers (Builder viewer = Lena Chen·Manager, PQ-1 "Push task completion" wording, official logo-variant exports)
- The roll-up engine host (objectives vs a thin `platform/rollup`) was deferred from step 1 — decide it here as a contract-shape call
- Step count: **35/105** after session-28 (one sealed unit). **Night 1b: 6 of 10 spent, 5 steps of task remaining** (P4-01 step 2 · P4-02 1 · P5-01 1 · P5-02 1 · P6-01 1) — the squeeze is now resolved (step 1 + mail-owner done in one unit absorbed it); the N1b close groom re-sums (rule 2)
