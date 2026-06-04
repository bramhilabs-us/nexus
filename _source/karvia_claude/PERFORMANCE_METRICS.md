# KARVIA Business - Performance Metrics

<!-- @GENOME T2-ARC-006 | ACTIVE | 2026-03-30 | parent:T0-GOV-001 | auto:/audit | linked:/strategy,/testing -->

**Version**: 1.1.0
**Last Updated**: March 6, 2026
**Status**: Active

---

## Purpose

Track active KPI data for Claude AI sessions on KARVIA Business.

---

## Current Performance Summary

### Aggregate Metrics

| Metric | Current | Target | Status | Trend |
|--------|---------|--------|--------|-------|
| **CER** | 90% | 85-95% | On Target | Stable |
| **TCV** | 1.0 | 0.9-1.1 | On Target | Stable |
| **TES** | 0.70 | >0.60 | On Target | Stable |
| **RAI** | 95% | 85-95% | Excellent | Stable |

### Quality Scores

| Metric | Value | Target |
|--------|-------|--------|
| **Average Session Quality** | 9.5/10 | >=8/10 |
| **Sessions Tracked** | 48 | - |

---

## Session Metrics Log

### Recent Sessions (January 2026)

| Session | Date | Type | CER | TCV | TES | RAI | Quality |
|---------|------|------|-----|-----|-----|-----|---------|
| 048 | Jan 8 | Setup | 95% | 1.0 | 0.80 | 100% | 10/10 |
| 047 | Jan 6 | Coding | 88% | 0.9 | 0.65 | 90% | 8/10 |

### December 2025 Summary

| Metric | Average | Sessions |
|--------|---------|----------|
| Quality | 9.6/10 | 15 |
| CER | 89% | - |
| Story Points | 71 | - |

### November 2025 Summary

| Metric | Average | Sessions |
|--------|---------|----------|
| Quality | 9.4/10 | 28 |
| CER | 88% | - |
| Story Points | 134 | - |

---

## Metric Definitions

| Metric | Formula | Target |
|--------|---------|--------|
| **CER** | (Docs Used / Docs Loaded) × 100 | 85-95% |
| **TCV** | (Completed / Planned) × (Est / Actual) | 0.9-1.1 |
| **TES** | (Business Value / Tokens) × 1000 | >0.60 |
| **RAI** | (First Success / Total) × 100 | 85-95% |

---

## Recording Instructions

### After Each Session

1. **Calculate Metrics** per formulas above
2. **Add Entry** to "Recent Sessions" table
3. **Update Aggregates** if metrics changed
4. **Note Improvements** if any metric below target

### Business Value Points

| Activity | Points |
|----------|--------|
| Critical bug fix | 20 |
| New feature | 15 |
| Security fix | 25 |
| Documentation | 5 |
| Refactoring | 10 |
| Planning | 8 |
| Testing | 10 |

---

## Alerts

```
✅ No active alerts - all metrics on target
```

---

## Historical Performance

### Sprint 3 (Nov 21 - Dec 4, 2025)
- Story Points: 71
- Sessions: 18
- Avg Quality: 9.6/10
- Notable: Complete sprint with 100% test pass rate

### Sprint 6-8 (Dec 2025)
- Story Points: 91
- Sessions: 15
- Avg Quality: 9.7/10
- Notable: Epic H complete, Epic G complete

---

## Related Documents

- [CLAUDE_CHECKLIST.md](./CLAUDE_CHECKLIST.md) - Quality gates
- [SESSION_LOG.md](./SESSION_LOG.md) - Session history
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Quality standards

---

**Document Status**: Active KPI tracking for KARVIA Business.
