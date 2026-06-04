# 2-TECHNICAL: Technical Audits

<!-- @GENOME T3-NAV-011 | ACTIVE | 2026-04-01 | parent:T2-NAV-005 | auto:/audit | linked:/coding -->

## Purpose

Assess code quality, architecture health, and technical debt. Ensure the codebase is maintainable, scalable, and secure.

## Owner

**Primary**: CTO
**Secondary**: Architects, Senior Developers

---

## What Gets Audited

| Area | Questions | Frequency |
|------|-----------|-----------|
| Code Quality | Test coverage, linting, complexity | Monthly |
| Architecture | Is design holding up? Technical debt? | Quarterly |
| Dependencies | Outdated packages? Security vulnerabilities? | Monthly |
| Performance | Response times, database queries | Monthly |
| API Health | Contracts respected? Breaking changes? | Per release |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Code audit | `YYYY_MM_DD_CODE_QUALITY_AUDIT.md` | `2026_04_01_CODE_QUALITY_AUDIT.md` |
| Architecture review | `YYYY_MM_DD_ARCHITECTURE_REVIEW.md` | `2026_04_01_ARCHITECTURE_REVIEW.md` |
| Dependency audit | `YYYY_MM_DD_DEPENDENCY_AUDIT.md` | `2026_04_01_DEPENDENCY_AUDIT.md` |
| Performance report | `YYYY_MM_DD_PERFORMANCE_REPORT.md` | `2026_04_01_PERFORMANCE_REPORT.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| 2-TECHNICAL/architecture/ | Design docs | Compare implementation to design |
| server/, client/ | Codebase | Audit subject |
| 3-DELIVERY/6-ISSUES/ | Bug patterns | Identify problem areas |
| CI/CD reports | Test results | Quality metrics |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 1-PRODUCT/product_backlog/ | Tech debt items | After each audit |
| 3-DELIVERY/1-SPRINTS/ | Urgent fixes | If critical |
| 2-TECHNICAL/decisions/ | ADRs | If architecture changes needed |

---

## Key Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | >70% | TBD |
| Lint Errors | 0 | TBD |
| Critical Dependencies | 0 outdated | TBD |
| P0 Bugs | 0 open | TBD |

---

## Audit Template

```markdown
# Technical Audit - [Focus Area]

**Date**: YYYY-MM-DD
**Author**: [Name]
**Scope**: [What was audited]

## Summary
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|

## Findings

### Critical
[Must fix immediately]

### High
[Fix this sprint]

### Medium
[Schedule for next sprint]

### Low
[Add to backlog]

## Technical Debt Inventory
| Item | Severity | Effort | Priority |
|------|----------|--------|----------|

## Recommendations
[Action items with owners]
```
