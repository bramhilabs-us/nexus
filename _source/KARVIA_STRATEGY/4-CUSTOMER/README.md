# 4-CUSTOMER: Customer Intelligence

<!-- @GENOME T1-NAV-003 | ACTIVE | 2026-04-01 | parent:ROOT | auto:/strategy,/audit | linked:/general -->

## Purpose

Central repository for all customer-related intelligence: feedback, evidence of product-market fit, interview transcripts, and customer metrics. This folder represents the "inward ear" of the product - how we listen to and learn from those who use our product.

## Owner

**Primary**: CPO
**Secondary**: Customer Success Lead, UX Research

---

## Stakeholder Views

### CEO / Investor
- Product-market fit evidence
- Customer growth metrics
- Churn and retention signals
- Market validation for fundraising

### CPO (Product)
- Feature requests and priorities
- Pain points driving roadmap
- Customer journey insights
- Beta feedback synthesis

### CTO (Technical)
- Technical pain points
- Integration requests
- Performance complaints
- Security/reliability concerns

### Customer Success
- Support ticket patterns
- Onboarding friction
- Retention risk signals
- Success story candidates

---

## Folder Structure

| Folder | Purpose | Owner |
|--------|---------|-------|
| `feedback/` | Raw customer feedback (tickets, emails, calls) | Customer Success |
| `evidence/` | Product-market fit evidence, testimonials | CPO |
| `interviews/` | User research transcripts and syntheses | UX Research |
| `metrics/` | Customer health metrics, NPS, churn | Analytics |

---

## Document Lifecycle

### Feedback Flow

```
Raw Feedback (feedback/)
        │
        ├──→ Synthesized → Evidence (evidence/)
        │
        ├──→ Patterns → Issues (3-DELIVERY/6-ISSUES/)
        │
        └──→ Insights → Roadmap (1-PRODUCT/roadmap/)
```

### Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Feedback batch | `YYYY_MM_DD_FEEDBACK_[SOURCE].md` | `2026_04_01_FEEDBACK_SUPPORT.md` |
| Interview | `YYYY_MM_DD_INTERVIEW_[COMPANY].md` | `2026_04_01_INTERVIEW_ACME.md` |
| Metrics report | `YYYY_MM_CUSTOMER_METRICS.md` | `2026_04_CUSTOMER_METRICS.md` |
| Evidence | `YYYY_MM_DD_EVIDENCE_[TYPE].md` | `2026_04_01_EVIDENCE_PMF.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| Support system | Tickets, complaints | Pain point identification |
| Sales calls | Prospect feedback | Market validation |
| User interviews | Research transcripts | Deep insights |
| Analytics | Usage data | Behavior patterns |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 1-PRODUCT/product_backlog/ | Feature requests | After synthesis |
| 3-DELIVERY/6-ISSUES/ | Bug reports | When identified |
| 0-STAKEHOLDERS/ | Customer metrics | Monthly/Quarterly |
| 5-AUDIT/1-STRATEGY/ | PMF evidence | Strategy audits |

---

## Customer Segments

| Segment | Size | Characteristics |
|---------|------|-----------------|
| Early Adopters | 50-100 employees | Tech-forward, feedback-rich |
| Growth Stage | 100-300 employees | Scaling challenges |
| Established | 300-500 employees | Process-heavy, integration needs |

---

## Key Metrics Tracked

| Metric | Definition | Target |
|--------|------------|--------|
| NPS | Net Promoter Score | >50 |
| CSAT | Customer Satisfaction | >4.5/5 |
| Churn | Monthly churn rate | <3% |
| Activation | % completing onboarding | >80% |
| Engagement | Weekly active rate | >70% |

---

## Governance

- **Privacy**: Anonymize customer data in shared docs
- **Consent**: Interview recordings require consent
- **Retention**: Raw feedback archived after 6 months
- **Access**: Metrics visible to leadership, raw feedback restricted
