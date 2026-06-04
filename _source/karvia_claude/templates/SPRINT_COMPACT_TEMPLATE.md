# Sprint Compact Template

**Use For**: Compacting multiple sessions from a single sprint into one summary document

---

## Template

```markdown
# Sprint Compact: {SPRINT_ID}

**Sprint**: {Sprint Name}
**Milestone**: {Milestone ID}
**Dates**: {Start Date} - {End Date}
**Sessions Compacted**: {Count}
**Compaction Date**: {Date}

---

## Sprint Summary

{2-3 paragraph executive summary of sprint outcomes, major accomplishments, and any issues encountered}

---

## Key Decisions

| ID | Decision | Rationale | Impact | Session Ref |
|----|----------|-----------|--------|-------------|
| D1 | {Decision text} | {Why this decision} | {High/Med/Low} | SESSION-XXXX |

---

## Action Items Completed

| Item | Owner | Outcome | Session Ref |
|------|-------|---------|-------------|
| {Action description} | {Owner} | {Result achieved} | SESSION-XXXX |

---

## Action Items Pending (Carried Forward)

| Item | Owner | Status | Blocker | Target |
|------|-------|--------|---------|--------|
| {Action description} | {Owner} | {%} | {If blocked} | {When} |

---

## Architecture Changes

| Change | Before | After | Rationale | Session Ref |
|--------|--------|-------|-----------|-------------|
| {What changed} | {Previous state} | {New state} | {Why changed} | SESSION-XXXX |

---

## Key Discussions Summary

### {Topic 1}

**Context**: {Brief background}
**Conclusion**: {What was decided}
**Impact**: {What this affects}

### {Topic 2}

**Context**: {Brief background}
**Conclusion**: {What was decided}
**Impact**: {What this affects}

---

## Blockers Encountered

| Blocker | Resolution | Lesson Learned |
|---------|------------|----------------|
| {Issue description} | {How it was fixed} | {What we learned} |

---

## Dependencies

| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| {What we depend on} | {Internal/External} | {Resolved/Pending} | {Additional context} |

---

## Sprint Metrics

| Metric | Target | Actual | Variance |
|--------|--------|--------|----------|
| Story Points Planned | {X} | {Y} | {+/-Z} |
| Story Points Completed | {X} | {Y} | {+/-Z} |
| Sessions Held | - | {N} | - |
| Decisions Made | - | {N} | - |
| Blockers Hit | - | {N} | - |
| Blockers Resolved | - | {N} | - |

---

## Quality Assessment

| Criteria | Score | Notes |
|----------|-------|-------|
| Objectives Met | {X/10} | {Brief explanation} |
| Code Quality | {X/10} | {Brief explanation} |
| Documentation | {X/10} | {Brief explanation} |
| **Overall Sprint** | **{X/10}** | {Summary} |

---

## Sessions Archived

| Session ID | Date | Type | Summary |
|------------|------|------|---------|
| SESSION-XXXX-XXX-XXX | {Date} | {Type} | {1-line summary} |
| SESSION-XXXX-XXX-XXX | {Date} | {Type} | {1-line summary} |

---

## Artifacts Created This Sprint

| Artifact | Type | Location |
|----------|------|----------|
| {Name} | {Doc/Code/Config} | {Path} |

---

## Lessons Learned

1. **What went well**: {Description}
2. **What could improve**: {Description}
3. **Action for next sprint**: {Specific action}

---

**Compacted By**: Claude
**Compaction Date**: {Date}
**Archive Location**: `4-SESSIONS/archive/{SPRINT_ID}/`
**Sessions Archived**: {Count}
```

---

## Compaction Rules

### What to Extract

| Priority | Content Type | How to Capture |
|----------|--------------|----------------|
| P0 | Decisions | Verbatim with rationale |
| P0 | Action items | Status and outcomes |
| P1 | Architecture changes | Before/after summary |
| P1 | Key discussions | Conclusion only |
| P2 | Blockers | Issue + resolution |
| P2 | Dependencies | Current status |

### What to Archive (Not Include)

- Exploratory back-and-forth without conclusion
- Step-by-step implementation details (in git)
- Duplicate discussions across sessions
- Meeting logistics and scheduling
- Debug sessions (unless lessons learned)

---

**Template Version**: 1.0.0
**Last Updated**: December 21, 2025
