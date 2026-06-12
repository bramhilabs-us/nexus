---
description: Seal a Nexus session — verify, journal with a quality score, write the NEXT_SESSION card, commit, push, PR. No session ends without naming the next one.
---

# /close

Seal the session. A session is not over until the next one is defined.

## Steps (in order)

1. **Verify**: tests/lint/typecheck for code; `python3 .claude/hooks/doc-graph-check.py` for docs. **A red doc-graph blocks the seal** — fix edges/genomes first.
2. **Journal**: append to `_agent/JOURNAL.md` (standard format) plus a **quality self-score X/10** with one-line justification (scale in `SESSION_PRACTICES.md`). ≤7 twice in a row on the same cause → file the process fix.
3. **Backlog**: mark items DONE/BLOCKED; add discovered items with IDs.
4. **Write `_agent/NEXT_SESSION.md`** — the card for the next session:
   - Session type (strategy | contract | coding | test | audit/groom)
   - Task (BACKLOG ID + title) and why it's next (one line)
   - Pack cards to draw (specific docs)
   - Definition of done (1–3 bullets)
   - Watch out for (invariants touched, known drift, open clarifications)
5. **Ship**: commit (secret-scan the diff first), push, open/update the PR. Link the BACKLOG ID.
6. **Report**: ≤8 lines — what shipped, quality score, step count used/105, what the next session is.

Do not run mid-refactor with a broken tree — finish or stash-with-journal first, ask the human if unsure.
