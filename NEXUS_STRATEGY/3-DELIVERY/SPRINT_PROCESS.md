---
id: nexus.sprint-process
title: Sprint Process — how a night of work runs
tier: T3
status: active
owner: agent
updated: 2026-06-10
summary: >
  How Nexus sprints execute: SPRINTS_NIGHT_N → /sprint-load → BACKLOG →
  tick/session loop → night-end groom. Definition of done per task, the
  in-flight PR rule at Level 0, and the quality self-score. Adapts Karvia's
  16-command sprint machinery down to 5 commands and one JOURNAL.
parents:
  - NEXUS_STRATEGY/3-DELIVERY/EXECUTION_PLAYBOOK.md
children: []
revisit:
  - on: "autonomy level changes (the in-flight PR rule relaxes at Level 1)"
    stage: always
  - on: "a night-end retro files a process change (IM-10)"
    stage: always
---

# Sprint Process — how a night of work runs

## Purpose

The operating procedure between EXECUTION_PLAYBOOK's phase budgets and an individual tick: how a night's sprint is defined, loaded, executed, and groomed. The playbook says *what the 90 steps buy*; this doc says *how each night spends its budget*.

## The sprint cycle

```
SPRINTS_NIGHT_N.md  →  /sprint-load  →  BACKLOG.md  →  tick/session loop  →  night-end groom
   (human-authored)     (agent)          (queue)        (the work)            (audit + next sprint draft)
```

1. **Define** — the human (or a groom session) writes `_agent/SPRINTS_NIGHT_N.md`: tasks with ID (`N<night>-P<phase>-<seq>`), size (S=1 tick, M=2–3, L=split it), dependencies, and a testable definition of done.
2. **Load** — `/sprint-load` decomposes it into `_agent/BACKLOG.md` items (status READY/BLOCKED with reasons).
3. **Execute** — the loop runs: cron fires `/nexus-tick` (autonomous) or the human runs `/init` (interactive). Every unit of work follows ORIENT → PICK → BRANCH → WORK → VERIFY → JOURNAL → COMMIT → PUSH → PR → EXIT (TICK_PROTOCOL.md is authoritative).
4. **Groom** — at night end (or budget +25% overrun, whichever first): `/audit`, re-sum the budget table (never trust a labelled total — SESSION_PRACTICES rule 2), write the retro line, draft `SPRINTS_NIGHT_N+1.md`.

## Picking work (the card chain)

- `_agent/NEXT_SESSION.md` is the card: if it names a tick-executable task, that IS the pick — no BACKLOG scanning.
- **Level-0 in-flight rule**: a task whose PR is open-unmerged — or that depends on one — is in-flight; skip to the next READY item with no in-flight dependency. Never stack onto an unmerged branch. (At Level 1+ this rule relaxes: green-CI auto-merge clears the queue between ticks.)
- Cards always carry a fallback chain so an unmerged PR never stalls the night.
- Ambiguity → `clarifications.md` + pick the next clear card. Never invent product decisions (hard rule 5).

## Definition of done (per task)

A BACKLOG item flips to DONE only when **all** of:

1. Its stated definition-of-done bullets are individually true (✓ them in BACKLOG).
2. Verification appropriate to the work ran green: tests for code, `doc-graph-check.py` for docs, the hex/token scans for visual work.
3. The IMPROVEMENT_PLAN per-PR gate checklist passes (IM-5 — mechanical in CI from Night 2; manual until then).
4. A PR exists; the JOURNAL entry carries a quality self-score (10-point Karvia scale, SESSION_PRACTICES) and an explicit `Next:`.

Two consecutive self-scores ≤7 on the same cause = a **process bug**: fix TICK_PROTOCOL/practices, not just the work (IM-10).

## Roles

| Actor | Owns |
|---|---|
| **Agent** | Everything inside the loop: pick, work, verify, journal, PR |
| **Human (founder)** | Sprint definitions, clarification answers, PR merges (Level 0), autonomy level, founder-review checkpoints (e.g., mockups) |
| **The hooks** | Karvia write-guard, budget kill, doc-graph gate at `/close` |

## Reflection record (IM-11 — lifted from Karvia sprint machinery)

| Question | Answer |
|---|---|
| **Why** | Karvia's sprint process worked but cost ~290 sessions; its bookkeeping itself drifted |
| **What** | The minimal cycle above: one queue, one journal, one card |
| **How** | 16 commands → 5; SESSION_LOG + SESSION_INDEX + CHANGE_LOG + handoffs → one JOURNAL + one NEXT_SESSION card; sprint/release compact templates → JOURNAL entry format |
| **When** | Now — N1-P3-02, before Night 2 makes process load-bearing |
| **Relevant?** | Core — this is the loop the remaining ~75 steps run on |
| **Improving?** | Yes: removes the manual-sync surfaces that drifted at Karvia |
| **Complexity added?** | Net negative — fewer artifacts, same guarantees |
| **Redundancy?** | None — TICK_PROTOCOL holds the per-tick law; this doc holds the per-night cycle |
