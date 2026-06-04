# Issue Tracker

<!-- @GENOME T2-GOV-010 | ACTIVE | 2026-04-01 | parent:T0-GOV-001 | auto:/coding,/quick-fix | linked:/audit -->

**Purpose**: Track bugs, defects, and issues requiring fixes.

**Last Updated**: April 1, 2026

---

## Quick Add Issue

```markdown
### BUG-S##-###: [Short Title]
**Priority**: P0 | P1 | P2
**Reported**: YYYY-MM-DD
**Sprint**: ## (or "Backlog")
**Status**: OPEN

**Description**: [What's broken?]
**Steps**: [1, 2, 3...]
**Expected**: [What should happen]
**Actual**: [What happens]
**Files**: [path/to/file.js:123]
```

---

## Files

| File | Purpose |
|------|---------|
| [ACTIVE.md](ACTIVE.md) | Open issues (P0, P1, P2) |
| [RESOLVED.md](RESOLVED.md) | Recently closed (last 90 days) |
| [by-sprint/](by-sprint/) | Sprint-specific issue views |
| [archive/](archive/) | Old resolved issues by quarter |

---

## Priority Definitions

| Priority | Response | Description |
|----------|----------|-------------|
| **P0** | Immediate | Blocking production, data loss, security |
| **P1** | This sprint | Major functionality broken |
| **P2** | Next sprint | Minor bugs, polish issues |

---

## Issue Lifecycle

```
OPEN ──► IN_PROGRESS ──► RESOLVED
  │                         │
  └──► BLOCKED              └──► archive/
         │
         └──► (unblock) ──► IN_PROGRESS
```

---

## ID Convention

**Format**: `BUG-S##-###`

- `BUG` = Issue type
- `S##` = Sprint when discovered (e.g., S21)
- `###` = Sequential number (e.g., 001, 002)

**Example**: `BUG-S21-003` = Third issue discovered in Sprint 21

---

## Maintenance

**After each sprint**:
1. Move RESOLVED issues older than 90 days to `archive/YYYY-QX.md`
2. Update `by-sprint/SPRINT-XX.md` with final counts
3. Verify no P0/P1 issues remain open

**Quarterly**:
1. Archive resolved issues to `archive/YYYY-QX.md`
2. Review P2 backlog for relevance
3. Close stale issues (>6 months, no activity)

---

## Migration Note

This structure replaces `MASTER_ISSUES_LIST.md` (March 2026).
Historical issues preserved in that file for reference.
