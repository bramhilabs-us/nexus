---
description: Initialize a Nexus session — load context from CLAUDE.md, JOURNAL, BACKLOG, current SPRINT file. Use when starting fresh, not for autonomous ticks.
---

# /init

Load context for a Nexus session. This is for interactive sessions; cron-fired autonomous runs use `/nexus-tick` instead.

## Read in order

1. `.claude/CLAUDE.md`
2. `.claude/MASTER_GUIDE.md`
3. `_agent/AUTONOMY.md` — know the current autonomy level
4. `_agent/JOURNAL.md` — tail, last 10 entries
5. `_agent/BACKLOG.md`
6. `_agent/clarifications.md`
7. Most recent `_agent/SPRINTS_NIGHT_*.md`
8. Latest entry in `_agent/DECISIONS.md`

## Then report

Give a short status:

- What was done in the last few ticks (from JOURNAL)
- What's queued (from BACKLOG)
- What's blocked on you (from clarifications.md)
- What sprint is active
- Current autonomy level

End with: "Ready. What would you like to work on?"
