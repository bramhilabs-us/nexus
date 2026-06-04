# 6-FINANCIAL: Financial Audits

<!-- @GENOME T3-NAV-015 | ACTIVE | 2026-04-01 | parent:T2-NAV-005 | auto:/audit | linked:- -->

## Purpose

Track costs, measure ROI, and ensure financial sustainability of product development and operations.

## Owner

**Primary**: CFO/Finance Lead
**Secondary**: CEO, CPO

---

## What Gets Audited

| Area | Questions | Frequency |
|------|-----------|-----------|
| Infrastructure Costs | Render, database, third-party services | Monthly |
| Development Costs | Team allocation, contractor spend | Monthly |
| ROI Analysis | Feature value vs cost | Quarterly |
| Budget Tracking | Actual vs projected | Monthly |
| Revenue Metrics | ARR, MRR, churn | Monthly |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Cost report | `YYYY_MM_DD_COST_REPORT.md` | `2026_04_01_MONTHLY_COSTS.md` |
| ROI analysis | `YYYY_MM_DD_ROI_ANALYSIS.md` | `2026_04_01_FEATURE_ROI.md` |
| Budget review | `YYYY_MM_DD_BUDGET_REVIEW.md` | `2026_Q2_BUDGET_REVIEW.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| Render dashboard | Infrastructure costs | Cost tracking |
| HR/Payroll | Team costs | Resource allocation |
| Payment provider | Revenue data | Revenue tracking |
| 3-DELIVERY/1-SPRINTS/ | Sprint velocity | Productivity metrics |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 0-STAKEHOLDERS/ | Financial reports | Monthly/Quarterly |
| 1-PRODUCT/ | Budget constraints | When relevant |
| 3-DELIVERY/ | Resource allocation | Per sprint |

---

## Key Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| CAC | Customer Acquisition Cost | <$X |
| LTV | Lifetime Value | >$Y |
| Burn Rate | Monthly cash burn | <$Z |
| Runway | Months of cash remaining | >12 |
| Cost per Sprint Point | Total cost / points delivered | <$XX |

---

## Cost Categories

| Category | Includes | Owner |
|----------|----------|-------|
| Infrastructure | Render, MongoDB Atlas, third-party APIs | DevOps |
| Development | Salaries, contractors, tools | CTO |
| Marketing | Ads, content, events | Marketing |
| Operations | Support, admin, legal | COO |
| R&D | Research, prototyping | CPO/CTO |

---

## Financial Health Template

```markdown
# Financial Review - [Period]

**Date**: YYYY-MM-DD
**Period**: [Month/Quarter]

## Summary
| Metric | Target | Actual | Variance |
|--------|--------|--------|----------|

## Revenue
- MRR: $XX
- New customers: X
- Churn: X%

## Costs
| Category | Budgeted | Actual | Variance |
|----------|----------|--------|----------|

## Burn Rate
- Monthly burn: $XX
- Runway: X months

## Recommendations
[Cost optimizations, investment priorities]
```
