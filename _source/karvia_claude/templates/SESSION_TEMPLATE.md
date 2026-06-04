# Session Template

**Use For**: Strategy, design, architecture, and planning session documentation

---

## Template

```markdown
# {SESSION_ID}

**Session ID**: SESSION-{YYYYMMDD}-{TYPE}-{CODE}
**Date**: {YYYY-MM-DD}
**Type**: {Strategy/Design/Architecture/Review/Implementation/Debug/Testing/Documentation}
**Sprint**: {Sprint ID or Pre-MVP}
**Status**: {Active/Completed/Blocked}
**Duration**: {Estimated duration}

---

## Session Objective

{Clear, 1-2 sentence statement of what this session aims to accomplish}

---

## Context

### Background

{Brief context for why this session is needed}

### Related Sessions

| Session | Relationship |
|---------|--------------|
| {Session ID} | {Depends on / Blocks / Related to} |

### Pre-Requisites

- [ ] {Pre-req 1}
- [ ] {Pre-req 2}

---

## Agenda

1. {Agenda item 1}
2. {Agenda item 2}
3. {Agenda item 3}

---

## Decisions Made

| ID | Decision | Rationale | Impact | Owner |
|----|----------|-----------|--------|-------|
| D1 | {What was decided} | {Why} | {High/Med/Low} | {Who owns implementation} |

---

## Action Items

### Completed This Session

| Item | Owner | Outcome |
|------|-------|---------|
| {Action} | {Owner} | {What was done} |

### Created This Session

| Item | Owner | Priority | Due | Status |
|------|-------|----------|-----|--------|
| {Action} | {Owner} | {P0/P1/P2} | {When} | {Pending} |

---

## Key Discussions

### {Topic 1}

**Context**: {Brief background}

**Discussion Points**:
- {Point 1}
- {Point 2}

**Conclusion**: {What was decided or determined}

---

## Blockers & Risks

| Issue | Type | Status | Mitigation |
|-------|------|--------|------------|
| {Issue} | {Blocker/Risk} | {Open/Resolved} | {How to handle} |

---

## Artifacts Created

| Artifact | Type | Location |
|----------|------|----------|
| {Name} | {Doc/Code/Config} | {Path} |

---

## Session Outcomes

### Objectives Met

- [ ] {Objective 1}
- [ ] {Objective 2}

### Key Takeaways

1. {Takeaway 1}
2. {Takeaway 2}

---

## Next Steps

| Action | Owner | When |
|--------|-------|------|
| {Next action} | {Who} | {Timeline} |

---

## Follow-up Sessions

| Session | Type | Objective | Planned Date |
|---------|------|-----------|--------------|
| {Session ID} | {Type} | {Objective} | {Date} |

---

## Session Quality

**Self-Assessment**: {X/10}

| Criteria | Score | Notes |
|----------|-------|-------|
| Objective Met | {X/10} | {Notes} |
| Clarity of Decisions | {X/10} | {Notes} |
| Actionable Outcomes | {X/10} | {Notes} |

---

**Session Status**: {Completed/In Progress/Blocked}
**Compaction Status**: {Active - awaiting compaction}
```

---

## Session Types Reference

| Type | Code | Use When |
|------|------|----------|
| Strategy | STR | Planning, roadmap, prioritization |
| Design | DES | System/feature design |
| Architecture | ARC | Technical architecture decisions |
| Review | REV | Code, document, or design review |
| Implementation | IMP | Coding session notes |
| Debug | DBG | Troubleshooting and debugging |
| Testing | TST | Test planning and execution |
| Documentation | DOC | Documentation-focused work |

---

## Code Conventions

| Code Pattern | Meaning | Example |
|--------------|---------|---------|
| `DM-NNN` | Decision Matrix item | DM-001 |
| `DP-NNN` | Data Processing decision | DP-002 |
| `MxSy` | Milestone x Sprint y | M1S1 |
| `{ENGINE}` | Engine name | TRUST, PASSION |
| `{FEATURE}` | Feature name | MVP-AUDIT |

---

**Template Version**: 1.0.0
**Last Updated**: December 21, 2025
