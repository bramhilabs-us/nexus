# 0-STAKEHOLDERS: Stakeholder Communications

<!-- @GENOME T1-NAV-001 | ACTIVE | 2026-04-01 | parent:ROOT | auto:/strategy | linked:/audit,/general -->

## Purpose

Central hub for all stakeholder communications, investor updates, board materials, and strategic alignment documentation. This folder represents the "outward voice" of the product - how we communicate progress, vision, and value to those who invest in and guide the product.

## Owner

**Primary**: CEO
**Secondary**: CPO, CFO

---

## Stakeholder Views

### CEO / Investor
- Investor updates and board materials
- Strategic milestones and pivot decisions
- Financial health and runway status
- Market positioning and competitive analysis

### CPO (Product)
- Product roadmap alignment with investor promises
- Feature delivery vs communicated timeline
- Customer success metrics for stakeholder reports

### CTO (Technical)
- Technical milestones for board presentations
- Infrastructure costs and scaling projections
- Security posture for due diligence

---

## Folder Structure

| Folder | Purpose | Cadence |
|--------|---------|---------|
| `shareholder_meetings/` | Investor updates, board decks, meeting notes | Quarterly + ad-hoc |
| `advisory_board/` | Advisory communications (future) | As needed |
| `partner_updates/` | Strategic partner communications (future) | As needed |

---

## Document Lifecycle

### Season/Episode Model

Stakeholder communications follow a **Season/Episode** structure:

- **Season** = Major phase (e.g., "Season 1: Beta Launch")
- **Episode** = Milestone within phase (e.g., "Episode 3: First 10 Customers")

```
Season 1: Beta Launch (Apr-Jun 2026)
├── Episode 1: Technical Ready
├── Episode 2: First Customer Onboard
├── Episode 3: 10 Customer Milestone
└── Episode 4: Beta Retrospective
```

### Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Board deck | `YYYY_MM_DD_BOARD_DECK.md` | `2026_04_01_BOARD_DECK.md` |
| Investor update | `YYYY_MM_DD_INVESTOR_UPDATE.md` | `2026_Q2_INVESTOR_UPDATE.md` |
| Meeting notes | `YYYY_MM_DD_MEETING_NOTES.md` | `2026_04_15_BOARD_MEETING_NOTES.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| 1-PRODUCT/roadmap/ | Product milestones | Progress reporting |
| 3-DELIVERY/1-SPRINTS/ | Sprint velocity | Delivery metrics |
| 5-AUDIT/6-FINANCIAL/ | Financial reports | Investor updates |
| 4-CUSTOMER/metrics/ | Customer metrics | Growth reporting |

## Outputs

| Destination | What | When |
|-------------|------|------|
| Board/Investors | Quarterly updates | Quarterly |
| 1-PRODUCT/ | Strategic pivots | After board decisions |
| Team (all hands) | Filtered updates | Monthly |

---

## Connection to Product Lifecycle

```
0-STAKEHOLDERS (Strategic Voice)
        │
        ├──→ Informs 1-PRODUCT/ (what to build)
        │
        ├──←── Fed by 5-AUDIT/ (progress, health)
        │
        └──←── Fed by 4-CUSTOMER/ (market validation)
```

---

## Governance

- **Lock Rule**: Board materials lock 24h before meeting
- **Archive Rule**: Materials archived after each season
- **Access**: Restricted to leadership team
