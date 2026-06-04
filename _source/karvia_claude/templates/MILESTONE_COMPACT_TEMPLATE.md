# Milestone Compact Template

**Use For**: Rolling up sprint compacts into a milestone-level summary

---

## Template

```markdown
# Milestone Compact: {MILESTONE_ID}

**Milestone**: {Milestone Name}
**Release**: {Version}
**Dates**: {Start Date} - {End Date}
**Sprints Compacted**: {Count}
**Total Sessions**: {Count across all sprints}
**Compaction Date**: {Date}

---

## Milestone Summary

{3-4 paragraph executive summary of milestone outcomes, major features delivered, and strategic value achieved}

---

## Sprint Summaries

### Sprint 1: {Sprint Name}
**Dates**: {Start} - {End}
**Key Outcome**: {1-2 sentence summary}

### Sprint 2: {Sprint Name}
**Dates**: {Start} - {End}
**Key Outcome**: {1-2 sentence summary}

### Sprint 3: {Sprint Name}
**Dates**: {Start} - {End}
**Key Outcome**: {1-2 sentence summary}

---

## Major Decisions (Milestone-Level)

| ID | Decision | Impact | Sprint |
|----|----------|--------|--------|
| {D1} | {Strategic decision that spans sprints} | {High} | {Which sprint} |

---

## Features Delivered

| Feature | Description | Quality | Sprint |
|---------|-------------|---------|--------|
| {Feature name} | {What it does} | {Rating} | {Sprint ID} |

---

## Architecture Evolution

| Component | Initial State | Final State | Rationale |
|-----------|---------------|-------------|-----------|
| {Component} | {How it started} | {How it ended} | {Why evolved} |

---

## Key Technical Achievements

1. **{Achievement 1}**: {Description and value}
2. **{Achievement 2}**: {Description and value}
3. **{Achievement 3}**: {Description and value}

---

## Challenges Overcome

| Challenge | Solution | Sprints Affected |
|-----------|----------|------------------|
| {Challenge} | {How solved} | {Sprint IDs} |

---

## Dependencies Resolved

| Dependency | Type | Resolution | Impact |
|------------|------|------------|--------|
| {Dep} | {Internal/External} | {How resolved} | {What it unlocked} |

---

## Carried Forward to Next Milestone

| Item | Type | Priority | Notes |
|------|------|----------|-------|
| {Item} | {Tech Debt/Feature/Bug} | {P0/P1/P2} | {Context} |

---

## Milestone Metrics

| Metric | Target | Actual | Variance |
|--------|--------|--------|----------|
| Story Points | {X} | {Y} | {+/-Z%} |
| Features Planned | {X} | {Y} | {+/-Z} |
| Sprints | {X} | {Y} | {+/-Z} |
| Total Sessions | - | {N} | - |
| Major Decisions | - | {N} | - |

---

## Quality Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Feature Completeness | {X/10} | {Notes} |
| Code Quality | {X/10} | {Notes} |
| Test Coverage | {X/10} | {Notes} |
| Documentation | {X/10} | {Notes} |
| Architecture | {X/10} | {Notes} |
| **Overall Milestone** | **{X/10}** | {Summary} |

---

## Sprint Compacts Rolled Up

| Compact File | Sprint | Sessions | Key Outcomes |
|--------------|--------|----------|--------------|
| SPRINT_COMPACT_{ID}.md | {Sprint} | {N} | {Summary} |

---

## Lessons Learned (Milestone Level)

### What Worked Well
1. {Lesson 1}
2. {Lesson 2}

### What to Improve
1. {Improvement 1}
2. {Improvement 2}

### Process Changes for Next Milestone
1. {Change 1}
2. {Change 2}

---

**Compacted By**: Claude
**Compaction Date**: {Date}
**Sprint Compacts Location**: `4-SESSIONS/compacted/sprints/`
**Archive Status**: All sprint compacts preserved
```

---

## Compaction Rules

### Rolling Up Sprint Compacts

| Content | How to Handle |
|---------|---------------|
| Decisions | Keep only milestone-level decisions |
| Actions | Summarize completed, detail pending |
| Architecture | Show evolution across sprints |
| Blockers | Only those affecting multiple sprints |
| Metrics | Aggregate across all sprints |

---

**Template Version**: 1.0.0
**Last Updated**: December 21, 2025
