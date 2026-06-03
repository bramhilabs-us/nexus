---
description: End a Nexus session cleanly — journal what happened, commit pending work, push, summarize.
---

# /close

End the current session.

## Steps

1. Append a session summary entry to `_agent/JOURNAL.md`:
   - Date, session length
   - What was accomplished
   - What's blocked
   - What's next
2. Update `_agent/BACKLOG.md` — mark completed items, surface new ones discovered
3. If there are uncommitted local changes, commit them (only if clearly part of the session's work)
4. Push the current branch
5. Report the session summary back to the user

Do not run if there is an active uncommitted refactor mid-flight — ask the user first.
