---
description: Start a Nexus session — load the NEXT_SESSION card, scan the docs that session type needs (and only those), state what this session is, begin. The only command a human needs to remember.
---

# /init

Start a session. The session chain rule: **the previous session already decided what this one is** — it's written in `_agent/NEXT_SESSION.md`. Load it, scan what *that type of session* needs, verify reality, start. Fully automatable (no questions if the card is valid), yet flexible: the human can override the type in one line.

## Always read (every session type, cheap)

1. `_agent/NEXT_SESSION.md` — the card: type, task, cards to draw, definition of done
2. `.claude/CLAUDE.md` — hard rules
3. `.claude/SESSION_PRACTICES.md` — the session shape (pre-scan!)
4. `_agent/JOURNAL.md` — tail, last 5 entries (step count vs 90)
5. `_agent/clarifications.md` — human answers since last session

## Then scan by session type (from the card, or the human's one-line override)

| Type | Additional scan | Skip |
|---|---|---|
| **strategy** | The named pack card(s) in full; `_agent/DECISIONS.md` latest entries; `DOCUMENTATION_GRAPH.md` revisit-triggers due | Code, sprint detail |
| **contract** | `TECH_STRATEGY.md` (module anatomy + the module's section); the module's `src/modules/<name>/README.md`; sibling contracts it touches | Business docs |
| **coding** | The task's BACKLOG entry; the governing module README + contract; the actual files the card names (verify they exist as claimed); relevant AP/IM invariants from `IMPROVEMENT_PLAN.md` | Full strategy re-read |
| **test** | The module's contract tests; `tests/README.md`; model validation contracts (grep required/enum) before fixtures | Strategy docs |
| **audit/groom** | Active `SPRINTS_NIGHT_*.md`; full `BACKLOG.md`; `EXECUTION_PLAYBOOK.md` budgets; doc-graph staleness output | Module internals |
| **sprint-planning** | Active + next `SPRINTS_NIGHT_*.md`; full `BACKLOG.md` (re-sum tables!); `EXECUTION_PLAYBOOK.md` phase budgets | Code |
| **general** | Nothing extra — light core only. Free-form: human drives. **Does not consume the NEXT_SESSION card** (it stays for the next planned session). | Everything else until asked |

## Then

1. Run `python3 .claude/hooks/doc-graph-check.py` — if red, fixing the graph becomes step one (except general sessions: just report it).
2. Report in ≤10 lines: **this session is** (type + task from the card, or "general — what do you want to explore?"), step count used/90, anything blocked on the human, doc-graph/staleness warnings, revisit-triggers due this night.
3. **Pre-scan** per SESSION_PRACTICES for work sessions: ground the card against reality; surface drifts as a numbered list.
4. Card still right → start. Reality moved → say why, propose the corrected card, confirm, start.

If `NEXT_SESSION.md` is missing or empty: fall back to BACKLOG order + EXECUTION_PLAYBOOK phase budgets, propose a card, proceed.
