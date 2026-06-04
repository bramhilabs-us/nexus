# 1-STRATEGY: Strategy Audits

<!-- @GENOME T3-NAV-010 | ACTIVE | 2026-04-01 | parent:T2-NAV-005 | auto:/audit,/strategy | linked:- -->

## Purpose

Verify that product execution aligns with strategic vision. Assess roadmap progress, market positioning, and stakeholder alignment.

## Owner

**Primary**: CPO
**Secondary**: CEO, Product Managers

---

## What Gets Audited

| Area | Questions | Frequency |
|------|-----------|-----------|
| Vision Alignment | Does current work reflect PRODUCT_VISION.md? | Quarterly |
| Roadmap Progress | Are we hitting milestones? | Monthly |
| Market Position | How do we compare to competitors? | Quarterly |
| Stakeholder Alignment | Are all stakeholders on same page? | Per major milestone |
| Documentation Health | Is documentation ecosystem functioning? | Quarterly |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Strategy audit | `YYYY_MM_DD_[TOPIC]_STRATEGY_AUDIT.md` | `2026_04_01_DOCUMENTATION_ECOSYSTEM_STRATEGY_AUDIT.md` |
| Roadmap review | `YYYY_MM_DD_ROADMAP_REVIEW.md` | `2026_04_01_Q2_ROADMAP_REVIEW.md` |
| Market analysis | `YYYY_MM_DD_MARKET_ANALYSIS.md` | `2026_04_01_COMPETITOR_ANALYSIS.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| 1-PRODUCT/PRODUCT_VISION.md | Vision baseline | Compare current to intended |
| 1-PRODUCT/roadmap/ | Milestone targets | Track progress |
| 3-DELIVERY/1-SPRINTS/ | Sprint completion | Execution velocity |
| 4-CUSTOMER/feedback/ | Customer sentiment | Market alignment |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 0-STAKEHOLDERS/ | Executive summary | After each audit |
| 1-PRODUCT/roadmap/ | Roadmap adjustments | If needed |
| 3-DELIVERY/1-SPRINTS/ | Sprint priorities | If reordering needed |

---

## Current Audits

| Date | Audit | Status |
|------|-------|--------|
| 2026-04-01 | Documentation Ecosystem Strategy Audit | DRAFT |

---

## Audit Template

```markdown
# [Topic] Strategy Audit

**Date**: YYYY-MM-DD
**Author**: [Name]
**Status**: DRAFT | REVIEW | APPROVED

## Executive Summary
[Key findings in 3-5 bullets]

## Scope
[What was audited]

## Findings

### Aligned
[What's working]

### Gaps
[What's missing]

### Risks
[What could go wrong]

## Recommendations
| # | Recommendation | Priority | Owner |
|---|----------------|----------|-------|

## Action Items
| Action | Owner | Due |
|--------|-------|-----|

## Appendices
[Supporting data]
```
