---
description: Read the active SPRINTS_NIGHT_N.md and populate BACKLOG.md with discrete tick-sized tasks.
---

# /sprint-load

Translate the most recent `_agent/SPRINTS_NIGHT_N.md` into actionable BACKLOG items.

## Steps

1. Find the highest-N `SPRINTS_NIGHT_*.md` file
2. For each goal/phase/task in it, produce a BACKLOG item with:
   - ID: `N{night}-{phase}-{slot}` (e.g., `N1-P2-03`)
   - Title (imperative, ≤80 chars)
   - Definition of done (1–3 bullets)
   - Estimated tick budget (S/M/L = 1/2/4 ticks)
   - Depends-on: list of upstream BACKLOG IDs
   - Status: READY | BLOCKED | DONE
3. Replace the body of `_agent/BACKLOG.md` with the new list (keep header)
4. Journal the load: "Loaded SPRINTS_NIGHT_N → X items into BACKLOG"

## Do not

- Auto-prioritize beyond the sprint file's order.
- Drop items the agent thinks are unnecessary. Sprint authority = human.
- Combine items. One BACKLOG item per discrete unit.
