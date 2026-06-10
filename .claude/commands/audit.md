---
description: Read-only audit pass. Doc-graph health, doc↔code drift, BACKLOG hygiene, decisions coverage, secrets, step-budget tracking.
---

# /audit

Run a read-only audit. Produce a report; do not change anything.

## What to check

- **Doc graph**: run `python3 .claude/hooks/doc-graph-check.py`. Report orphans, broken/one-way edges, missing genomes, staleness warnings (children not updated after a parent changed).
- **Doc ↔ code drift**: any doc in `NEXUS_STRATEGY/` that contradicts code in `src/`, `client/`, `tests/`; any code file whose governing README/genome no longer describes it.
- **Revisit triggers due**: scan genome `revisit:` entries whose `stage` matches the current night — list docs due for re-review.
- **BACKLOG hygiene**: items DONE but not closed, BLOCKED with no clarification, READY with stale depends-on. Re-sum any points/budget tables (never trust the labelled total).
- **Step budget**: journal entries since North Star date vs the EXECUTION_PLAYBOOK phase budgets; flag a night >25% over.
- **DECISIONS coverage**: every architectural choice in code maps to a `DECISIONS.md` entry.
- **Secrets**: scan for likely-leaked credentials (mongodb+srv://, sk-, ghp_, AKIA, etc.).
- **Karvia leakage**: any "karvia" string in code/docs outside `_source/`.

## Output

Write `_agent/AUDIT_<date>.md`: one section per check, one finding per row, severity (low/med/high), recommended action. Do not auto-fix.
