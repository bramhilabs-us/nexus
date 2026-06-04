# Metrics: Customer Health Metrics

<!-- @GENOME T3-NAV-007 | ACTIVE | 2026-04-01 | parent:T1-NAV-003 | auto:/audit | linked:/strategy -->

## Purpose

Track and report customer health metrics, usage analytics, and growth indicators. This folder provides the quantitative foundation for customer intelligence.

## Owner

**Primary**: Analytics Lead
**Secondary**: CPO, Customer Success

---

## Core Metrics

| Metric | Definition | Target | Frequency |
|--------|------------|--------|-----------|
| NPS | Net Promoter Score | >50 | Quarterly |
| CSAT | Customer Satisfaction (1-5) | >4.5 | Monthly |
| Churn | Monthly churn rate | <3% | Monthly |
| Activation | % completing onboarding | >80% | Weekly |
| WAU/MAU | Weekly/Monthly active users | >70% | Weekly |
| Expansion | % accounts upgrading | >20% | Monthly |
| Time to Value | Days to first success metric | <7 days | Monthly |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Monthly report | `YYYY_MM_CUSTOMER_METRICS.md` | `2026_04_CUSTOMER_METRICS.md` |
| Quarterly deep-dive | `YYYY_QN_METRICS_ANALYSIS.md` | `2026_Q2_METRICS_ANALYSIS.md` |
| Cohort analysis | `YYYY_MM_DD_COHORT_[FOCUS].md` | `2026_04_01_COHORT_ONBOARDING.md` |

---

## Metric Categories

### Acquisition
- New signups
- Trial starts
- Conversion rate

### Activation
- Onboarding completion
- First objective created
- First team invited

### Retention
- 7-day retention
- 30-day retention
- 90-day retention

### Revenue
- MRR
- ARR
- ARPU
- LTV

### Engagement
- Daily active users
- Feature adoption
- Session duration

---

## Report Template

```markdown
# Customer Metrics - [Month Year]

**Period**: YYYY-MM-DD to YYYY-MM-DD
**Author**: [Name]

## Executive Summary
[2-3 sentence overview of customer health]

## Key Metrics

| Metric | Target | Actual | Trend | Status |
|--------|--------|--------|-------|--------|
| NPS | >50 | XX | ↑/↓/→ | 🟢/🟡/🔴 |
| Churn | <3% | X.X% | ↑/↓/→ | 🟢/🟡/🔴 |
| Activation | >80% | XX% | ↑/↓/→ | 🟢/🟡/🔴 |
| WAU/MAU | >70% | XX% | ↑/↓/→ | 🟢/🟡/🔴 |

## Highlights
- [Positive highlight 1]
- [Positive highlight 2]

## Concerns
- [Concern 1]
- [Concern 2]

## Cohort Analysis
[Key cohort insights]

## Recommendations
1. [Recommendation 1]
2. [Recommendation 2]

## Data Sources
- [Source 1]
- [Source 2]
```

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| Analytics platform | Usage data | Behavior tracking |
| Billing system | Revenue data | Financial metrics |
| Support system | Ticket volume | Health signals |
| NPS surveys | Survey responses | Satisfaction tracking |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 0-STAKEHOLDERS/ | Investor metrics | Monthly |
| 5-AUDIT/1-STRATEGY/ | Strategic metrics | Quarterly |
| 1-PRODUCT/ | Feature adoption data | Monthly |
