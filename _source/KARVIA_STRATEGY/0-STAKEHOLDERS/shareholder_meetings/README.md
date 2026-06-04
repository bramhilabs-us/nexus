# Shareholder Meetings

<!-- @GENOME T2-NAV-002 | ACTIVE | 2026-04-01 | parent:T1-NAV-001 | auto:/strategy | linked:/audit -->

## Purpose

Track investor communications, board meetings, and strategic alignment sessions. This folder maintains the historical record of commitments made, decisions taken, and strategic pivots agreed upon with stakeholders.

## Owner

**Primary**: CEO
**Secondary**: CFO

---

## Season Structure

### Current: Season 1 - Beta Launch (Apr-Jun 2026)

| Episode | Milestone | Target Date | Status |
|---------|-----------|-------------|--------|
| E1 | Technical Ready | Apr 10 | Pending |
| E2 | First Customer | Apr 20 | Pending |
| E3 | 10 Customers | May 15 | Pending |
| E4 | Beta Retro | Jun 30 | Pending |

---

## Document Types

| Type | Purpose | Template |
|------|---------|----------|
| Board Deck | Quarterly investor presentation | `_TEMPLATE_BOARD_DECK.md` |
| Meeting Notes | Record of discussions and decisions | `_TEMPLATE_MEETING_NOTES.md` |
| Decision Log | Strategic decisions with rationale | `_TEMPLATE_DECISION_LOG.md` |

---

## Artifacts Stored Here

| Type | Naming | Example |
|------|--------|---------|
| Board deck | `YYYY_QN_BOARD_DECK.md` | `2026_Q2_BOARD_DECK.md` |
| Meeting notes | `YYYY_MM_DD_MEETING_NOTES.md` | `2026_04_15_MEETING_NOTES.md` |
| Decision log | `YYYY_DECISION_LOG.md` | `2026_DECISION_LOG.md` |

---

## Inputs

| Source | What | Why |
|--------|------|-----|
| 5-AUDIT/1-STRATEGY/ | Strategy audit findings | Board discussion topics |
| 5-AUDIT/6-FINANCIAL/ | Financial health | Investor reporting |
| 1-PRODUCT/roadmap/ | Roadmap progress | Milestone updates |
| 4-CUSTOMER/metrics/ | Customer metrics | Growth narrative |

## Outputs

| Destination | What | When |
|-------------|------|------|
| 1-PRODUCT/roadmap/ | Strategic pivots | After board decisions |
| 3-DELIVERY/1-SPRINTS/ | Priority changes | When strategy shifts |
| Team announcements | Filtered updates | After meetings |

---

## Meeting Cadence

| Meeting Type | Frequency | Attendees |
|--------------|-----------|-----------|
| Board Meeting | Quarterly | Board, CEO, CFO |
| Investor Update | Monthly | Investors, CEO |
| Advisory Sync | As needed | Advisors, CEO, CPO |

---

## Governance

- **Pre-meeting**: Materials finalized 48h before
- **Lock**: Deck locks 24h before meeting
- **Post-meeting**: Notes published within 48h
- **Archive**: Move to `archive/` after each season
