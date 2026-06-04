# KARVIA Business - Session Protocol

**Version**: 1.0.0
**Last Updated**: January 8, 2026
**Owner**: BRAMHI_LABS
**Status**: Active

---

## Purpose

Define session management rules for Claude AI sessions on KARVIA Business.

---

## Session Lifecycle

```
START SESSION
     │
     ▼
┌─────────────────────────────────────────┐
│ 1. Read latest handoff (if exists)      │
│ 2. Check SESSION_INDEX.md for context   │
│ 3. Review QUICK_START.md commands       │
│ 4. Optional: run start-session.js       │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ DURING SESSION                          │
│ - Follow CLAUDE_CHECKLIST.md gates      │
│ - Update SESSION_LOG.md for tracking    │
│ - Document decisions and changes        │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ END SESSION                             │
│ 1. Update SESSION_INDEX.md with entry   │
│ 2. Create handoff if needed             │
│ 3. Update CHANGE_LOG.md                 │
│ 4. Optional: run end-session.js         │
└─────────────────────────────────────────┘
```

---

## Session Types

| Type | Command | Purpose | Duration |
|------|---------|---------|----------|
| **Init** | `/init` | Session setup | 5-10 min |
| **Strategy** | `/strategy` | Planning | 1-3 hours |
| **Coding** | `/coding` | Implementation | 1-4 hours |
| **Testing** | `/testing` | Test execution | 1-2 hours |
| **Audit** | `/audit` | Code review | 1-2 hours |
| **General** | `/general` | Research/questions | Variable |
| **Close** | `/close` | Session closure | 5-15 min |

---

## Handoff Requirements

### When to Create Handoff

```
CREATE HANDOFF IF:
[ ] Session duration > 2 hours
[ ] Significant work completed
[ ] Complex context needs preservation
[ ] Mid-task break required
[ ] Switching to different work stream
```

### Handoff Location

```
.claude/sessions/handoffs/YYYY-MM-DD_handoff.md
```

### Handoff Content

```markdown
# Session Handoff - [Date]

## Session Summary
- Duration: [X hours]
- Type: [Strategy/Coding/etc.]
- Story Points: [X]

## Work Completed
- [Item 1]
- [Item 2]

## Work In Progress
- [Item 1] - [Status]

## Next Steps
1. [Priority 1]
2. [Priority 2]

## Key Context
- [Important context]
- [Decisions made]

## Files Changed
- [file1.js] - [description]
- [file2.md] - [description]
```

---

## Session Index Entry

After each session, add entry to SESSION_INDEX.md:

```markdown
| # | Date | Size | Points | Quality | Summary |
|---|------|------|--------|---------|---------|
| [N] | [Date] | [S/M/L] | [X] | [X/10] | **[Title]** - [Brief description] |
```

---

## Quality Scoring

| Score | Criteria |
|-------|----------|
| **10/10** | All goals met, no issues, clean code |
| **9/10** | Goals met, minor issues, good quality |
| **8/10** | Most goals met, some issues |
| **7/10** | Partial completion, notable issues |
| **6/10** | Below expectations |
| **<6/10** | Significant problems |

---

## Size Classification

| Size | Duration | Complexity | Points |
|------|----------|------------|--------|
| **S** | <1 hour | Single task | 0-5 |
| **M** | 1-3 hours | Feature/Epic | 5-15 |
| **L** | 3+ hours | Complex work | 15+ |

---

## Automation (Optional)

### Start Session
```bash
node .claude/automation/start-session.js
```

### End Session
```bash
# Interactive mode
node .claude/automation/end-session.js

# Auto mode (uses git)
node .claude/automation/end-session.js --auto
```

---

## Related Documents

- [SESSION_INDEX.md](./SESSION_INDEX.md) - Session chronicle
- [../CLAUDE_CHECKLIST.md](../CLAUDE_CHECKLIST.md) - Quality gates
- [../PERFORMANCE_METRICS.md](../PERFORMANCE_METRICS.md) - KPI tracking
- [../automation/README.md](../automation/README.md) - Automation scripts

---

**Document Status**: Active session management protocol for KARVIA Business.
