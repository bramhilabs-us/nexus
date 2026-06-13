# Next Session

> Written by the previous session per `/close`. `/init` reads this and starts. Overwritten every session — history lives in JOURNAL.md.

**Type**: CONTRACT (Night 1b, sprint 2 opener)
**Task**: **N1-P4-01 — Modularization plan + contract drafts** (2 steps; may span 2 sessions). Why now: sprint 1 closed with session-27 (P3-01, P3-08, P3-09 all DONE); sprint 2's goal is the frozen build spec, and N1-P4-01 is its opener — N1-P4-02 (Karvia diff + assessment interface) consumes its output.

**READ FIRST** (in order):
1. `_agent/SPRINTS_NIGHT_1B.md` § N1-P4-01 — the spec: MODULARIZATION_PLAN.md (8 modules + AIR impl folder) + MODULE_CONTRACTS_DRAFT.md (TS signatures; journey steps as acceptance criteria; routes cite API_SURFACE; edges cite MODULE_DEPENDENCY_GRAPH); assign the outbound notification/mail owner (audit 4.5)
2. `NEXUS_STRATEGY/2-TECHNICAL/TECH_STRATEGY.md` — module anatomy + the 4 layers + stage machine (C-020)
3. `NEXUS_STRATEGY/2-TECHNICAL/MODULE_DEPENDENCY_GRAPH.md` + `API_SURFACE.md` — the as-is maps whose revisit triggers this task fires
4. `NEXUS_STRATEGY/2-TECHNICAL/USER_JOURNEYS.md` J-index — journey steps are the acceptance criteria; J5's new contract entry point `crm.createCompany(motion=direct)` is flagged there for exactly this task
5. `_agent/DECISIONS.md` C-003 (consolidate engines), C-004 (TS strict), C-005 (Program entity), C-020 — the contracts must reflect all four

**Definition of done** (from the sprint spec):
- MODULARIZATION_PLAN.md + MODULE_CONTRACTS_DRAFT.md exist under 2-TECHNICAL, graph-wired, with TS signatures for the 8 lego blocks + the AIR impl folder
- The outbound notification/mail owner is assigned (contract-fronted, never per-module ad-hoc mail — audit 4.5)
- The stage-weather scan items land in the PageContract draft: stage-keyed primary CTA + stage-keyed Dashboard section; Teams' Prospect empty state = Sponsor matrix import (BACKLOG N1-P4-01 DoD, added session-27 pt 3)
- MODULE_DEPENDENCY_GRAPH + API_SURFACE revisit triggers fired and retired

**Watch out for**:
- **The PR stack is now 6 deep** (#25 ← #26 ← #27 ← #28 ← #29 ← session-27 PR). If all merged: branch from main. If not: continue the chain off `session/2026-06-13-27-c013-brand-rework` — do NOT base on main
- 2-step task: if it splits, seal MODULARIZATION_PLAN as step 1 and carry the contract drafts; don't chain past budget
- Contract-first invariant: interface + contract test shape first (CLAUDE.md rule 7); journey steps as acceptance criteria, not invented ones
- **Founder flags pending** (30-second confirms if in-session): (a) P3-08's fallback cadences (48h/day-3/day-7, carried from session-26); (b) from the session-27 founder review (which approved the re-skin direction + card system): the Builder-dashboard viewer (agent picked Lena Chen · Manager), PQ-1 CTA wording (kept "Push task completion"), and official exports of the derived logo variants (icon/on-dark are programmatic)
- Step count: **34/105** after session-27's three journal entries (EQ-1 raw count — one conversation, three sealed units: re-skin, founder iteration, stage scan). **Night 1b: 5 of 10 spent with 6 steps of task remaining** (P4-01 2 · P4-02 1 · P5-01 1 · P5-02 1 · P6-01 1) — a 1-step squeeze; the N1b close groom re-sums (rule 2) and the global buffer (5) absorbs it if P4/P5 don't come in under
