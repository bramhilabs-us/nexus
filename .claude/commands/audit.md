---
description: Read-only audit pass. Surfaces inconsistencies between docs and code, stale BACKLOG items, undocumented decisions.
---

# /audit

Run a read-only audit. Produce a report; do not change anything.

## What to check

- **Doc ↔ code drift**: any doc in `NEXUS_STRATEGY/2-TECHNICAL/` that contradicts code in `server/`, `client/`, `engines/`
- **BACKLOG hygiene**: items DONE but not closed, BLOCKED items with no clarification, READY items with stale depends-on
- **DECISIONS coverage**: every architectural choice in code should map to an entry in `DECISIONS.md`
- **Test coverage gap**: modules with no tests, tests with no assertions
- **Secrets in repo**: scan for likely-leaked credentials (mongodb+srv://, sk-, ghp_, AKIA, etc.)
- **Karvia leakage**: any string "karvia" still present in code/docs (excluding `_source/`)

## Output

Write `_agent/AUDIT_<date>.md` with sections per check, one finding per row, severity (low/med/high), recommended action. Do not auto-fix.
