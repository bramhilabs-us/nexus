---
id: nexus.execution-playbook
title: Nexus Execution Playbook — 290 steps becomes 105
tier: T3
status: active
owner: founder
updated: 2026-06-12
summary: >
  The execution card: 5 session types with deliverables, the 105-step phase
  budgets (N1:29-closed N1b:10 N2:22 N3:14 N4:15 N5:10 buffer:5 — re-baselined
  at the Night-1 close from the original 90, C-022), the pack-of-cards rule
  (every session ends naming the next), folder + command hierarchy, and the
  step-counter measurement against Karvia's ~290-session baseline.
parents:
  - NEXUS_STRATEGY/00_NORTH_STAR.md
  - NEXUS_STRATEGY/2-TECHNICAL/IMPROVEMENT_PLAN.md
children:
  - NEXUS_STRATEGY/3-DELIVERY/SPRINT_PROCESS.md
  - NEXUS_STRATEGY/3-DELIVERY/RELEASE_PROCESS.md
  - NEXUS_STRATEGY/3-DELIVERY/CI_CD.md
revisit:
  - on: "a night exceeds its step budget by more than 25%"
    stage: always
  - on: "autonomy level changes in _agent/AUTONOMY.md"
    stage: always
---

# Nexus Execution Playbook — 290 steps becomes 105

## Purpose

This is the execution card of the pack: how ≤105 sessions get spent, what kinds of sessions exist, and the rule that lets each session draw the next card with minimal human intervention. Karvia's ~290 recorded sessions are the baseline; this playbook is the route that skips the dead ends. The original budget was 90; the Night-1 close re-baselined it to 105 (§ the re-baseline record, C-022).

## TL;DR

- **One session = one step = one journal entry.** The JOURNAL.md entry count is the step counter; budget is 105 to a deployed Nexus beta (re-baselined from 90 at the Night-1 close).
- **Five session types**, each with a defined deliverable; no session may end without one.
- **Six phases (Nights 1, 1b, 2–5)** with explicit step budgets summing to 105, including buffer.
- **The pack-of-cards rule**: every session ends by naming the next session in JOURNAL `Next:`. Ambiguity goes to `clarifications.md` and the agent draws the next clear card instead of guessing.
- Quality is non-negotiable per session: every PR passes the `IMPROVEMENT_PLAN.md` gates. Speed comes from skipping discovery, never from skipping gates.

---

## Why ~100 is enough

Karvia's 290 sessions break down roughly into: discovery and re-strategizing (the journey was being invented), build, rework of things built wrong (dead engines, dual-writes, hardcoded banks, doc drift), and hotfixing. Nexus inherits the destinations without the wandering:

| Karvia cost | Sessions saved by |
|---|---|
| Domain discovery | Proven model carried over untouched (parking lot: "don't redesign domain") |
| Architecture wandering | C-003/C-004/C-005 ratified before a line of code |
| Rework | Anti-pattern gates (AP-1…AP-10) block the known failure modes at PR time |
| Context re-derivation | The pack of cards + `_agent/` state; `/init` restores a session in minutes |
| Manual QA back-and-forth | CI gates per PR (IM-5); tests as ground truth |

## Session types

| Type | Deliverable | Typical share |
|---|---|---|
| **Strategy** | A T0–T2 doc written/updated, decisions ratified | ~15% |
| **Contract** | A module's `contract.ts` + contract tests, red | ~10% |
| **Coding** | Contract tests green; feature behind gates; PR open | ~50% |
| **Test/QA** | Coverage raised, E2E journey walked, bugs filed as BACKLOG items | ~15% |
| **Audit/Groom** | Drift report, BACKLOG groomed, next sprint drafted | ~10% |
| **Improvement** | A lifted Karvia element re-reflected (C-009/IM-11): keep / improve / replace, journaled | folded into the audit share |

A session that produces no deliverable is journaled NO-OP and still counts — pressure to make every step land.

## The phase plan (step budget: 105 — re-baselined 2026-06-12)

| Phase | Scope | Budget | Exit criteria |
|---|---|---|---|
| **Night 1 — Strategy** (CLOSED 2026-06-12) | This pack of cards; the constitutional stack (01–04) + scores library; as-is catalogues (data models, API surface, module graph); design tokens + 10 mockups (Path B pull-forward) | **29 actual** (was 18 — see the re-baseline record) | ✓ Strategy canon ratified (C-001…C-021); catalogues done; remaining doc scope re-phased to Night 1b |
| **Night 1b — Product & technical docs** (added at re-baseline) | CAPABILITIES + ROADMAP (P3-01 pt 2); trigger map + playthroughs + J5 org-direct (P3-08); C-013 brand rework (P3-09); modularization plan + contract drafts (P4-01); Nexus-vs-Karvia diff + assessment interface spec (P4-02); test inventory + coverage path (P5-01/02); close groom | **10** | Every doc the build consumes exists; contracts drafted on paper; Night 2 sprint drafted at the close groom |
| **Night 2 — Foundation** | TS toolchain, pnpm workspace, CI gates wired; 6 OKR-chain + CRM modules lifted contract-first; Program entity; one KeyResult representation | **22** (was 24 — contracts pre-drafted in N1b, C-003/4/5 ratified, module skeletons standing) | `pnpm bootstrap` < 10 min; contract tests green across lifted modules; AP-1 lint live |
| **Night 3 — Vertical proof** | Assessment provider interface; **AIR impl** (instruments, evidence, scoring, deliverable generators — all data-driven; SSI not carried over per C-006); 6 UI pages on page contracts; first-value journey E2E | **14** (was 18 — tokens + all 10 mockups already built in N1; SCORING_MODEL fully specified) | Second-provider drill done in hours; first-value journey passes E2E |
| **Night 4 — Transformation OS** | Governance + Knowledge modules; multi-program UX (switcher, memberships); **handover transition + Builder mode**; srishti seam reserved; SaaS plumbing (fresh Mongo, secrets, flags) | **15** (was 16 — stage machine + runtime model specified) | Two concurrent programs run cleanly in one tenant; handover flips a program to Builder mode; knowledge module dogfooded (IM-9) |
| **Night 5 — Launch** | Deploy honesty pass, observability live, rollback runbook, perf, beta polish | **10** | Deployed beta; all IMPROVEMENT_PLAN success-criteria dimensions measured |
| **Buffer** | Hotfixes, retro-driven protocol fixes, unknowns | **5** (was 4) | — |
| **Total** | | **105** (29 spent + 76 remaining) | |

Budget overruns are absorbed by the buffer first, then by descoping within the night (journal the descope), never by skipping gates. If a night exceeds budget +25%, that's a mandatory strategy session to re-plan — re-planning is cheaper than drifting.

### The re-baseline record (2026-06-12, the Night-1 close groom — C-022)

The >25% trigger fired: Night 1 closed at **29 steps vs 18 budgeted** (+61%; audit 2026-06-12 finding 7). This section is the mandated re-plan, recorded by the agent per the groom card; the founder vetoes in PR review.

- **Cause, named**: sessions 19–23 were a founder-driven strategy expansion — the constitution (01), the NBM model (02), the Game (03), the Runtime Model (04), the scores library (BOQ + six drivers), ICP + COMPANY_JOURNEY, SCORING_MODEL, the first reflection audit + fix-pass. None of it was in the original N1 scope; all of it is the "discovery and re-strategizing" Karvia paid ~100+ sessions for, bought here in ~11. Scope growth, not waste — but the table was fiction until this record.
- **The re-plan**: N1 closed at actuals. Its unfinished doc scope plus the C-013 rework became **Night 1b (10)**. Build nights re-cut against the now-richer spec: N2 −2, N3 −4, N4 −1, N5 unchanged (deploy honesty doesn't compress), buffer +1 (overruns demonstrably happen).
- **The arithmetic** (re-summed, not labelled): +11 N1 actuals, +10 Night 1b, −7 build cuts, +1 buffer = **+15; total 90 → 105**.
- **Night numbering is preserved** — Night 2 still means Foundation in every doc that says "Night 2". The new phase is **1b**, sprint file `_agent/SPRINTS_NIGHT_1B.md`, so ~40 existing Night-N references across the doc set stay true (the Karvia stale-doc lesson, applied to ourselves).
- **EQ-1 closed**: every journal entry counts, including the 3 pre-North-Star bootstrap entries — one session = one step, no exemptions. The counter is the raw JOURNAL entry count, which is what every audit and session card has reported all along.

## The pack-of-cards rule

The mechanism that makes 105 steps run with minimal human intervention:

1. **Start**: `/init` (interactive) or `/nexus-tick` (autonomous) loads context from `_agent/` + the relevant strategy card(s).
2. **Work**: one PR-sized unit, against the card's spec, through the quality gates.
3. **End**: journal the entry with an explicit **`Next:`** — the next card to draw. The next session starts there.
4. **Ambiguity**: append to `clarifications.md`, pick the next *clear* card. Never invent product decisions (hard rule 5).
5. **Protocol bugs** (not product bugs) found during a session → fix in `TICK_PROTOCOL.md`, version it (IM-10).

## Folder and command hierarchy

The workspace the 105 steps operate in (authority: `.claude/MASTER_GUIDE.md`):

```
nexus/
├── .claude/            ← how the agent operates (config; commands: /init /nexus-tick /sprint-load /audit /close)
├── _agent/             ← loop state: JOURNAL (the step counter), BACKLOG, DECISIONS, clarifications, AUTONOMY
├── _source/            ← frozen Karvia reference (read-only)
├── NEXUS_STRATEGY/     ← the pack of cards + T0–T4 docs
└── src/ client/ tests/ ← code, Night 2+ (modules per TECH_STRATEGY.md anatomy)
```

Autonomy and budget are governed by `_agent/AUTONOMY.md` (currently Level 0: agent opens PRs, human merges; nightly cron window; per-tick timeout). Raising autonomy levels as trust accrues is itself a step-saver: at Level 1, green-CI merges stop costing human latency between dependent steps.

## Measurement

- **Step counter**: the raw JOURNAL.md entry count (EQ-1 closed — every entry counts). Reported in every `/audit` and night-end groom: `steps used / 105`, by phase vs budget.
- **Quality floor**: gates passed per PR (must be 100% — speed never trades against this).
- **Velocity check**: each night-end groom compares budget vs actual and writes one retro line: what made steps cheaper/dearer. Feeds TICK_PROTOCOL versioning.
- **The final score**: deployed beta, steps used, and the IMPROVEMENT_PLAN success table — all three published in the Night 5 wrap.

## Open questions

- **EQ-1** — ~~Whether Night 1's pre-North-Star sessions count inside the budget.~~ **CLOSED at the Night-1 groom (2026-06-12)**: every journal entry counts — one session = one step, no exemptions. Counting raw entries is what every audit and session card did in practice; the re-baseline (105) absorbs them honestly rather than redefining the counter to flatter the overrun.
