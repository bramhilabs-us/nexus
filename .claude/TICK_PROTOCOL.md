# Tick Protocol — One Iteration of the Autonomous Loop

**Status**: MANDATORY
**Triggered by**: `/nexus-tick` (cron or manual)
**Token budget per tick**: ~15k input, ~5k output target

---

## The loop

```
1. ORIENT       Read AUTONOMY.md, JOURNAL.md tail (last 5 entries), BACKLOG.md head
2. PICK         Choose the next ready task from BACKLOG (skip blocked, paused)
3. BRANCH       git checkout -b tick/<date>-<slot>-<task-slug>
4. WORK         Execute the task (write/edit/test as needed)
5. VERIFY       Run tests if code touched; lint markdown if docs touched
6. JOURNAL      Append outcome to JOURNAL.md
7. COMMIT       git commit with descriptive message
8. PUSH         git push origin <branch>
9. PR / MERGE   Open PR; auto-merge if autonomy >= 1 AND checks green
10. EXIT        Stop. Cron will fire the next tick.
```

---

## When to stop the tick early

| Condition | Action |
|---|---|
| BACKLOG empty | Append "no-op: backlog empty" to JOURNAL, exit. |
| All BACKLOG items blocked on clarifications | Append to JOURNAL, exit. |
| Daily budget exceeded (check AUTONOMY.md) | Append to JOURNAL, exit. Hook should kill the session anyway. |
| Task is ambiguous after one re-read | Append question to `clarifications.md`, mark task BLOCKED in BACKLOG, pick next. |
| Tests red after 2 fix attempts | Open PR as draft, mark BLOCKED in BACKLOG, journal it, exit. |
| Detect a write attempt against `karvia_business/` | ABORT entire tick, journal a security note. Hook should prevent this. |

---

## What the agent must NOT do during a tick

- Resolve clarifications on its own. Ambiguity → ask, don't guess.
- Self-modify `.claude/CLAUDE.md`, `MASTER_GUIDE.md`, or `TICK_PROTOCOL.md`. These are human-authored.
- Bump autonomy level. Only humans edit `AUTONOMY.md`.
- Run destructive git operations (`reset --hard`, `push --force`, `branch -D` on shared branches).
- Touch `karvia_business/` in any way other than read.
- Commit secrets. Re-check diffs before every commit for `password`, `key`, `token`, `mongodb+srv://`.

---

## Tick output contract

By end of every tick, exactly one of these must be true:

1. **A PR exists** for the work done (open or merged).
2. **A JOURNAL entry exists** explaining why no PR was produced (no-op, blocked, ambiguous).
3. **An entry in `clarifications.md`** exists asking the human a precise question.

Never an empty tick with no trace.

---

## Autonomy levels

Defined in `_agent/AUTONOMY.md`:

| Level | Behavior |
|---|---|
| 0 | Open PRs only. Human merges in the morning. |
| 1 | Auto-merge on green CI. No prod deploy. |
| 2 | Auto-merge + auto-deploy to staging. Prod stays human-gated. |
| 3 | Full auto-deploy to prod. (Not in scope for Nights 1–5.) |

Nights 1–3 default: **Level 0**. Nights 4–5 may move to Level 1 per area.
