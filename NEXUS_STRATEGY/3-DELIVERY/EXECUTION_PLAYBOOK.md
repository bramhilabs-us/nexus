# Nexus Execution Playbook — 290 steps becomes 90

**Status**: Active
**Last Updated**: 2026-06-09
**Owner**: Founder + agent (interactive session 2026-06-09)
**Tier**: T3
**Depends on**: [00_NORTH_STAR.md](../00_NORTH_STAR.md), `.claude/TICK_PROTOCOL.md`, `_agent/AUTONOMY.md`, `2-TECHNICAL/IMPROVEMENT_PLAN.md`

---

## Purpose

This is the execution card of the pack: how ≤90 sessions get spent, what kinds of sessions exist, and the rule that lets each session draw the next card with minimal human intervention. Karvia's ~290 recorded sessions are the baseline; this playbook is the route that skips the dead ends.

## TL;DR

- **One session = one step = one journal entry.** The JOURNAL.md entry count is the step counter; budget is 90 to a deployed Nexus beta.
- **Five session types**, each with a defined deliverable; no session may end without one.
- **Five phases (Nights 1–5)** with explicit step budgets summing to 90, including buffer.
- **The pack-of-cards rule**: every session ends by naming the next session in JOURNAL `Next:`. Ambiguity goes to `clarifications.md` and the agent draws the next clear card instead of guessing.
- Quality is non-negotiable per session: every PR passes the `IMPROVEMENT_PLAN.md` gates. Speed comes from skipping discovery, never from skipping gates.

---

## Why 90 is enough

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

A session that produces no deliverable is journaled NO-OP and still counts — pressure to make every step land.

## The phase plan (step budget: 90)

| Phase | Scope | Budget | Exit criteria |
|---|---|---|---|
| **Night 1 — Strategy** (in flight) | This pack of cards; catalogues (data models, API surface, module graph, test inventory); modularization plan; Night 2 sprint | **18** | Every N1 BACKLOG task DONE; contracts drafted on paper |
| **Night 2 — Foundation** | TS toolchain, pnpm workspace, CI gates wired; 6 OKR-chain + CRM modules lifted contract-first; Program entity; one KeyResult representation | **24** | `pnpm bootstrap` < 10 min; contract tests green across lifted modules; AP-1 lint live |
| **Night 3 — Vertical proof** | Assessment provider interface; **AIR impl** (instruments, evidence, scoring, deliverable generators — all data-driven; SSI not carried over per C-006); 6 UI pages on page contracts + minimalistic design system; first-value journey E2E | **18** | Second-provider drill done in hours; first-value journey passes E2E |
| **Night 4 — Transformation OS** | Governance + Knowledge modules; multi-program UX (switcher, memberships); **handover transition + Builder mode**; srishti seam reserved; SaaS plumbing (fresh Mongo, secrets, flags) | **16** | Two concurrent programs run cleanly in one tenant; handover flips a program to Builder mode; knowledge module dogfooded (IM-9) |
| **Night 5 — Launch** | Deploy honesty pass, observability live, rollback runbook, perf, beta polish | **10** | Deployed beta; all IMPROVEMENT_PLAN success-criteria dimensions measured |
| **Buffer** | Hotfixes, retro-driven protocol fixes, unknowns | **4** | — |

Budget overruns are absorbed by the buffer first, then by descoping within the night (journal the descope), never by skipping gates. If a night exceeds budget +25%, that's a mandatory strategy session to re-plan — re-planning is cheaper than drifting.

## The pack-of-cards rule

The mechanism that makes 90 steps run with minimal human intervention:

1. **Start**: `/init` (interactive) or `/nexus-tick` (autonomous) loads context from `_agent/` + the relevant strategy card(s).
2. **Work**: one PR-sized unit, against the card's spec, through the quality gates.
3. **End**: journal the entry with an explicit **`Next:`** — the next card to draw. The next session starts there.
4. **Ambiguity**: append to `clarifications.md`, pick the next *clear* card. Never invent product decisions (hard rule 5).
5. **Protocol bugs** (not product bugs) found during a session → fix in `TICK_PROTOCOL.md`, version it (IM-10).

## Folder and command hierarchy

The workspace the 90 steps operate in (authority: `.claude/MASTER_GUIDE.md`):

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

- **Step counter**: journal entries since 00_NORTH_STAR.md's date. Reported in every `/audit` and night-end groom: `steps used / 90`, by phase vs budget.
- **Quality floor**: gates passed per PR (must be 100% — speed never trades against this).
- **Velocity check**: each night-end groom compares budget vs actual and writes one retro line: what made steps cheaper/dearer. Feeds TICK_PROTOCOL versioning.
- **The final score**: deployed beta, steps used, and the IMPROVEMENT_PLAN success table — all three published in the Night 5 wrap.

## Open questions

- **EQ-1** — Whether Night 1's pre-North-Star sessions (bootstrap + 3 ticks already journaled) count inside the 90. Recommendation: count from this document forward; the prior entries were spent producing the baseline. Confirm at next `/audit`.
