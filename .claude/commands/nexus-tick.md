---
description: One iteration of the Nexus autonomous loop. Reads BACKLOG, picks next task, executes, journals, commits, PRs, exits.
---

# /nexus-tick

You are running one tick of the Nexus autonomous loop. Follow the protocol exactly. Do not improvise.

## Read first (in order)

1. `.claude/CLAUDE.md` — hard rules, what Nexus is
2. `.claude/TICK_PROTOCOL.md` — the loop steps you must follow
3. `.claude/SESSION_PRACTICES.md` — pre-scan discipline, quality scoring
4. `_agent/AUTONOMY.md` — current level + budget status
5. `_agent/NEXT_SESSION.md` — the card: if it names a tick-executable task, that IS your pick (skip BACKLOG scanning)
6. `_agent/JOURNAL.md` — tail, last 5 entries (skip if empty)
7. `_agent/BACKLOG.md` — full file only if the card is missing/blocked (fallback queue)
8. `_agent/clarifications.md` — check for human answers since last tick

## Then execute the protocol

Per `TICK_PROTOCOL.md`:

```
ORIENT → PICK → BRANCH → WORK → VERIFY → JOURNAL → COMMIT → PUSH → PR → EXIT
```

## Exit conditions (in priority order)

1. Daily budget exceeded → journal "budget-stop", exit.
2. BACKLOG empty or all blocked → journal "no-op", exit.
3. Task ambiguous → append to `clarifications.md`, mark BACKLOG item BLOCKED, pick next or exit if none.
4. Task complete + tests/lint green → open PR, journal "done", exit.
5. Task failed twice → open draft PR, mark BACKLOG item BLOCKED, journal "blocked", exit.

## What you must NOT do

- Touch `karvia_business/` in any way other than reading.
- Self-modify `.claude/CLAUDE.md`, `.claude/MASTER_GUIDE.md`, `.claude/TICK_PROTOCOL.md`, `_agent/AUTONOMY.md`.
- Run multiple tasks in one tick. One tick = one unit of work.
- Commit secrets. Diff-check before every commit.
- Force-push, hard-reset, or delete shared branches.

## End-of-tick deliverable

Exactly one of:
- A PR (open or merged) for completed work.
- A JOURNAL entry explaining the no-op.
- An entry in `clarifications.md` posing a precise question.

Never an empty tick. **Plus, always**: rewrite `_agent/NEXT_SESSION.md` naming the next session (type, task, cards to draw, definition of done) — the chain must never break, even on a no-op.
