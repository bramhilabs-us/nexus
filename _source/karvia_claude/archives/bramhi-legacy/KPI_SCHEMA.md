# BRAMHI KPI Schema

**Version**: 1.0.0
**Last Updated**: January 7, 2026
**Owner**: BRAMHI_LABS
**Status**: Active

---

## Purpose

This document defines the **universal KPI framework** for measuring Claude AI session performance across all BRAMHI_LABS repositories.

---

## Core Metrics (4 Primary KPIs)

### 1. CER - Context Efficiency Ratio

**Definition**: Measures how efficiently context is utilized during a session.

```
Formula: CER = (Documents Actually Used / Documents Loaded) × 100

Components:
- Documents Loaded: Files read into context at session start
- Documents Actually Used: Files referenced/modified during work

Target Range: 85-95%
Warning: < 70%
Critical: < 50%
```

**Calculation Example**:
```
Session loaded: 12 documents
Session used: 10 documents
CER = (10 / 12) × 100 = 83.3%
```

**Improvement Actions**:
- Use QUICK_START.md to load only essential context
- Defer loading large documents until needed
- Use mode-specific context packages

---

### 2. TCV - Task Completion Velocity

**Definition**: Measures task delivery efficiency relative to planning.

```
Formula: TCV = (Tasks Completed / Tasks Planned) × (Estimated Time / Actual Time)

Components:
- Tasks Completed: Number of tasks finished
- Tasks Planned: Number of tasks intended
- Estimated Time: Planned session duration (hours)
- Actual Time: Actual session duration (hours)

Target Range: 0.9 - 1.1
Warning: < 0.7 or > 1.5
Critical: < 0.5 or > 2.0
```

**Calculation Example**:
```
Tasks planned: 5
Tasks completed: 4
Estimated time: 2 hours
Actual time: 2.5 hours
TCV = (4 / 5) × (2 / 2.5) = 0.8 × 0.8 = 0.64
```

**Interpretation**:
- TCV = 1.0: Perfect efficiency
- TCV > 1.0: Ahead of plan (check quality)
- TCV < 1.0: Behind plan (identify blockers)

---

### 3. TES - Token Efficiency Score

**Definition**: Measures business value delivered per token consumed.

```
Formula: TES = (Business Value Points / Tokens Used) × 1000

Components:
- Business Value Points: Story points or value score (0-100)
- Tokens Used: Estimated tokens consumed (in thousands)

Target Range: > 0.60
Warning: 0.40 - 0.60
Critical: < 0.40
```

**Business Value Scoring**:
| Activity | Points |
|----------|--------|
| Critical bug fix | 20 |
| New feature implementation | 15 |
| Security fix | 25 |
| Documentation | 5 |
| Refactoring | 10 |
| Planning | 8 |
| Testing | 10 |

**Calculation Example**:
```
Business value: 35 points (1 feature + 1 bug fix)
Tokens used: 50,000
TES = (35 / 50) × 1000 = 0.70
```

---

### 4. RAI - Resolution Accuracy Index

**Definition**: Measures first-attempt success rate.

```
Formula: RAI = (Successful First Attempts / Total Attempts) × 100

Components:
- Successful First Attempts: Tasks completed correctly first time
- Total Attempts: All attempts including retries

Target Range: 85-95%
Warning: 70-85%
Critical: < 70%
```

**Calculation Example**:
```
First attempts successful: 8
Total attempts (including retries): 10
RAI = (8 / 10) × 100 = 80%
```

**Factors Affecting RAI**:
- Quality of initial context
- Clarity of requirements
- Complexity of task
- Prior codebase familiarity

---

## Secondary Metrics (4 Supporting KPIs)

### 5. SGP - Security Gate Pass Rate

```
Formula: SGP = (Security Gates Passed / Security Gates Required) × 100

Target: 100%
Warning: < 100% (any failure is concerning)
Critical: N/A (must be 100%)
```

### 6. HFI - Handoff Freshness Index

```
Formula: HFI = Days since last SESSION_INDEX.md update

Target: < 1 day
Warning: 1-3 days
Critical: > 3 days
```

### 7. DCI - Documentation Coverage Index

```
Formula: DCI = (Documented Items / Total New Items) × 100

Target: 100%
Warning: 80-100%
Critical: < 80%
```

### 8. TCR - Test Coverage Ratio

```
Formula: TCR = (Lines Covered by Tests / Total Lines) × 100

Target: > 80%
Warning: 60-80%
Critical: < 60%
```

---

## Session Type Benchmarks

### /strategy Sessions

| Metric | Target | Good | Acceptable |
|--------|--------|------|------------|
| CER | 90% | 80% | 70% |
| TCV | 1.0 | 0.9 | 0.8 |
| TES | 0.50 | 0.40 | 0.30 |
| RAI | 90% | 85% | 80% |

### /coding Sessions

| Metric | Target | Good | Acceptable |
|--------|--------|------|------------|
| CER | 85% | 75% | 65% |
| TCV | 1.0 | 0.85 | 0.70 |
| TES | 0.70 | 0.60 | 0.50 |
| RAI | 85% | 80% | 75% |

### /audit Sessions

| Metric | Target | Good | Acceptable |
|--------|--------|------|------------|
| CER | 95% | 90% | 85% |
| TCV | 1.0 | 0.95 | 0.90 |
| TES | 0.80 | 0.70 | 0.60 |
| RAI | 95% | 90% | 85% |

### /testing Sessions

| Metric | Target | Good | Acceptable |
|--------|--------|------|------------|
| CER | 85% | 80% | 70% |
| TCV | 1.0 | 0.90 | 0.80 |
| TES | 0.65 | 0.55 | 0.45 |
| RAI | 90% | 85% | 80% |

### /general Sessions

| Metric | Target | Good | Acceptable |
|--------|--------|------|------------|
| CER | 80% | 70% | 60% |
| TCV | 1.0 | 0.85 | 0.70 |
| TES | 0.50 | 0.40 | 0.30 |
| RAI | 85% | 80% | 75% |

---

## KPI Tracking Template

### Per-Session Recording

```markdown
## Session KPIs

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| CER | XX% | 85% | [GREEN/YELLOW/RED] |
| TCV | X.XX | 1.0 | [GREEN/YELLOW/RED] |
| TES | X.XX | 0.60 | [GREEN/YELLOW/RED] |
| RAI | XX% | 85% | [GREEN/YELLOW/RED] |
| SGP | XX% | 100% | [GREEN/RED] |
| HFI | X days | <1 | [GREEN/YELLOW/RED] |

### Calculation Details
- Documents loaded: X
- Documents used: X
- Tasks planned: X
- Tasks completed: X
- Estimated time: X hours
- Actual time: X hours
- Business value: X points
- Tokens used: ~Xk
- First attempts: X
- Total attempts: X
```

---

## Aggregate Metrics (Weekly/Monthly)

### Weekly Review Template

```markdown
## Weekly KPI Summary (Week of YYYY-MM-DD)

### Session Count
| Type | Count | Avg Quality |
|------|-------|-------------|
| /strategy | X | X.X |
| /coding | X | X.X |
| /audit | X | X.X |
| /testing | X | X.X |
| /general | X | X.X |
| **Total** | **X** | **X.X** |

### Aggregate KPIs
| Metric | Week Avg | Trend | vs Target |
|--------|----------|-------|-----------|
| CER | XX% | ↑/↓/→ | +X%/-X% |
| TCV | X.XX | ↑/↓/→ | +X/-X |
| TES | X.XX | ↑/↓/→ | +X/-X |
| RAI | XX% | ↑/↓/→ | +X%/-X% |

### Story Points Delivered
| Milestone | Planned | Delivered | % |
|-----------|---------|-----------|---|
| M1 | X | X | X% |
| M2 | X | X | X% |

### Action Items
1. [Improvement focus for next week]
2. [Process adjustment]
3. [Training need]
```

---

## KPI Status Definitions

### GREEN (On Track)
- Metric at or above target
- No action required
- Continue current practices

### YELLOW (Warning)
- Metric below target but above acceptable
- Monitor closely
- Consider minor adjustments

### RED (Critical)
- Metric below acceptable threshold
- Immediate action required
- Root cause analysis needed

---

## Improvement Playbook

### Low CER (< 70%)
1. Review QUICK_START.md usage
2. Implement mode-specific context loading
3. Defer non-essential document loading
4. Use MASTER_TREE files for navigation

### Low TCV (< 0.7)
1. Break tasks into smaller chunks
2. Improve initial estimates
3. Identify and remove blockers early
4. Better scope definition

### Low TES (< 0.40)
1. Focus on high-value tasks
2. Reduce context switching
3. Use templates to reduce token usage
4. Batch similar operations

### Low RAI (< 70%)
1. Improve initial context gathering
2. Clarify requirements before starting
3. Use checklists more diligently
4. Learn from retry patterns

---

## Data Collection Points

### Automatic (from automation scripts)
- Session start/end times
- Git commits in session
- Files modified
- Test results

### Manual (recorded by Claude)
- Tasks planned vs completed
- Documents loaded vs used
- First attempt success tracking
- Business value assessment

---

## Related Documents

- [BRAMHI_MASTER_PLAN.md](./BRAMHI_MASTER_PLAN.md) - Framework overview
- [UNIFIED_CHECKLIST.md](./UNIFIED_CHECKLIST.md) - Quality gates
- [../PERFORMANCE_METRICS.md](../PERFORMANCE_METRICS.md) - Active metrics data
- [../sessions/SESSION_INDEX.md](../sessions/SESSION_INDEX.md) - Session history

---

**Document Status**: Universal KPI framework for Claude AI session measurement.
