# Karvia Business - Product Overview

<!-- @GENOME T2-PRD-041 | TRANSITIONING | 2026-04-05 | parent:T1-PRD-001 | auto:/init | linked:/strategy -->

> **Document Status: TRANSITIONING**
>
> This document is being superseded by [KARVIA_ENGINE_VISION.md](../1-VISION/KARVIA_ENGINE_VISION.md).
> For engine capabilities, see [KARVIA_1.0_CAPABILITIES.md](./KARVIA_1.0_CAPABILITIES.md).
> Content will be archived after full transition.
> Last substantive update: December 2025

---

**Document Version**: 1.0
**Last Updated**: December 5, 2025
**Status**: TRANSITIONING (Beta Apr 17, 2026)
**Target Launch**: ~~December 31, 2025~~ Beta: April 17, 2026

---

## Executive Summary

**Karvia Business** is a B2B SaaS platform that helps small-to-medium service businesses (50-500 employees) implement and manage OKRs (Objectives and Key Results) with AI-powered insights. The platform combines strategic assessment, intelligent goal-setting, and real-time progress tracking to drive measurable business outcomes.

---

## What It Does

### Core Value Proposition

Karvia transforms how service businesses set and achieve goals by:

1. **Diagnosing Business Health** - Proprietary SSI (Speed, Strength, Intelligence) assessment framework
2. **AI-Powered OKR Generation** - Intelligent objective recommendations based on assessment data
3. **Cascading Goal System** - Objectives → Key Results → Quarterly Goals → Weekly Goals → Tasks
4. **Real-Time Progress Tracking** - Dashboard visibility across all organizational levels
5. **Team Collaboration** - Multi-tenant, role-based access for entire organizations

---

## Key Features

### 1. SSI Assessment System
| Dimension | What It Measures |
|-----------|------------------|
| **Speed** | Operational efficiency, time-to-market, process agility |
| **Strength** | Team capability, customer relationships, market position |
| **Intelligence** | Data usage, decision-making, strategic planning |

- 12-block diagnostic framework
- Industry-specific benchmarking
- Actionable insights and recommendations

### 2. AI-Powered OKR Generation
- OpenAI GPT integration for intelligent objective suggestions
- Assessment-driven recommendations
- Category-balanced objective sets (MECE framework)
- One-click OKR generation with manual refinement

### 3. Goal Cascade System
```
Company Objectives (Annual)
    └── Key Results (Measurable Outcomes)
        └── Quarterly Goals (90-day targets)
            └── Weekly Goals (Sprint-level)
                └── Tasks (Daily execution)
```

### 4. Multi-Tenant Architecture
- Company isolation with secure data boundaries
- Role-based access control (RBAC)
- Consultant portal for multi-company management

### 5. Flexible Time Periods
- Calendar year (Jan-Dec)
- Fiscal year (April/July/October starts)
- Custom periods (6-36 months)

---

## User Roles

| Role | Access Level | Key Capabilities |
|------|--------------|------------------|
| **Consultant** | Full system | Manage multiple companies, all features |
| **Business Owner** | Company admin | Full company access, user management |
| **Executive** | Department oversight | Create objectives, view all teams |
| **Manager** | Team management | Assign goals, track team progress |
| **Employee** | Individual | Own tasks, personal dashboard |

---

## Technology Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB (multi-tenant)
- **AI**: OpenAI GPT-4/GPT-3.5 Turbo
- **Auth**: JWT with role-based guards
- **Architecture**: Microservices with engine modules

### Frontend
- **Framework**: Vanilla JavaScript (no framework dependency)
- **Styling**: TailwindCSS
- **API Layer**: RESTful with dedicated API clients

### Infrastructure
- **Hosting**: Render.com (PaaS)
- **Database**: MongoDB Atlas
- **Monitoring**: Built-in logging and analytics

---

## Codebase Metrics

| Metric | Value |
|--------|-------|
| **Total Lines of Code** | ~127,000 |
| **Source Files** | 518 |
| **Server Models** | 13 |
| **API Routes** | 18 |
| **Services** | 26 |
| **Client Pages** | 30 |
| **Test Files** | 49 |
| **Git Commits** | 263 |

### Code Distribution

| Component | Lines | % of Total |
|-----------|-------|------------|
| Server Core | 52,415 | 41% |
| Microservice Engines | 30,210 | 24% |
| Client HTML | 17,600 | 14% |
| Client JavaScript | 14,330 | 11% |
| Tests | 12,775 | 10% |

---

## Development Timeline

### Pre-Sprint Foundation (Weeks 0-7)

| Phase | Duration | Story Points | Focus Area |
|-------|----------|--------------|------------|
| Week 0 | Foundation | 45 pts | Database, Auth, Infrastructure, API Structure |
| Weeks 1-4 | Assessment | 68 pts | Templates, SSI Scoring, AI OKR Generation |
| Week 5 | Teams | 28 pts | Team Management, Objectives Display |
| Weeks 6-7 | Goals | 52 pts | Goal Hierarchy, Company Migration |
| **Pre-Sprint Total** | 7 weeks | **193 pts** | Core Infrastructure & Features |

### Sprint-Based Development

| Sprint | Duration | Story Points | Focus Area |
|--------|----------|--------------|------------|
| Sprint 1 | Week 8-9 | 45 pts | Company Invitations, Assessment Distribution |
| Sprint 2 | Week 10-11 | 54 pts | Dashboard, Date Cascade, Planning |
| Sprint 3 | Week 12-13 | 89 pts | Flexible Dates, OKR Control, Validation |
| Sprint 4-5 | Week 14-15 | 29 pts | Carryover Features |
| Sprint 6 | Week 16-17 | 65 pts | SSI Diagnostics |
| Sprint 7 | Week 18 | 52 pts | OKR Redesign |
| Sprint 8 | Week 19 | 11 pts | Planning Features |
| Sprint 9 | Current | 8 pts | Edit Objectives, Fixes |
| **Sprint Total** | 12 weeks | **353 pts** | Feature Implementation |

### Total Development Time

| Phase | Duration | Points |
|-------|----------|--------|
| **Foundation** (Weeks 0-7) | 7 weeks | 193 pts |
| **Sprint Development** (Sprints 1-9) | 12 weeks | 353 pts |
| **Total Elapsed** | ~12 weeks active | **546 pts** |
| **Remaining to MVP** | ~4 weeks | ~50 pts |

---

## Effort Estimate

### Story Points Analysis

| Category | Points |
|----------|--------|
| Pre-Sprint Foundation (Weeks 0-7) | 193 pts |
| Sprint 1-2 (Core Features) | 99 pts |
| Sprint 3-9 (Feature Development) | 254 pts |
| **Total Delivered** | **~546 pts** |
| Remaining for MVP | ~50 pts |
| **Total Project** | **~600 pts** |

### Hours Breakdown

| Activity | Hours |
|----------|-------|
| Development (600 pts × 6 hrs) | 3,600 hrs |
| Planning/Architecture (20%) | 720 hrs |
| Testing/QA (15%) | 540 hrs |
| Documentation (5%) | 180 hrs |
| **Total Hours** | **~5,040 hrs** |

### Story Points by Category

| Category | Points | % of Total |
|----------|--------|------------|
| Backend Development | 165 pts | 30% |
| Frontend Development | 125 pts | 23% |
| Infrastructure & DevOps | 32 pts | 6% |
| AI & Intelligence | 20 pts | 4% |
| Sprint Features | 204 pts | 37% |

---

## Cost Estimate

### Traditional Development Cost

| Team Type | Hourly Rate | Total Cost |
|-----------|-------------|------------|
| US Senior Team | $150-200/hr | $750k - $1M |
| US Mid-Level | $100-150/hr | $500k - $750k |
| Mixed Team | $75-100/hr | $375k - $500k |
| Offshore Senior | $50-80/hr | $250k - $400k |
| Offshore Mid | $30-50/hr | $150k - $250k |

### Detailed Budget Breakdown

| Line Item | Low Est. | High Est. |
|-----------|----------|-----------|
| Development | $300,000 | $500,000 |
| AI/OpenAI Integration | $15,000 | $30,000 |
| Infrastructure/DevOps | $20,000 | $40,000 |
| Testing/QA | $30,000 | $60,000 |
| Project Management | $40,000 | $70,000 |
| Design/UX | $20,000 | $40,000 |
| Contingency (15%) | $64,000 | $111,000 |
| **Total** | **$489,000** | **$851,000** |

### AI-Assisted Development (Actual)

| Factor | Value |
|--------|-------|
| Development Time | ~8 weeks |
| Claude Code Sessions | ~50 sessions |
| Estimated Actual Cost | **$50k - $80k** |
| Cost Savings | **80-90%** |

---

## ROI Analysis

### Value Delivered

| Metric | Value |
|--------|-------|
| Market Value | $500k - $850k |
| Actual Investment | ~$65k (est.) |
| **ROI Multiplier** | **7-13x** |
| Time Compression | 6-12 months → 12 weeks |

### Comparable Products

| Product | Pricing | Features |
|---------|---------|----------|
| Lattice | $11/user/month | OKRs, Performance |
| 15Five | $14/user/month | OKRs, Engagement |
| Profit.co | $7/user/month | Pure OKR |
| **Karvia** | $199/user/month* | OKR + SSI Assessment + AI |

*Target ARPU with premium positioning

---

## Revenue Projections (2026)

### Growth Stages

| Stage | Customers | Users | MRR | Net (after costs) |
|-------|-----------|-------|-----|-------------------|
| Q1 (Jan-Mar) | 1 | 20 | $3,980 | -$10,020 |
| Q2 (Apr-Jun) | 3 | 60 | $11,940 | -$9,060 |
| Q3 (Jul-Sep) | 10 | 200 | $39,800 | +$8,800 |
| Q4 (Oct-Dec) | 25 | 500 | $99,500 | +$62,000 |

### Key Milestones

| Milestone | Target |
|-----------|--------|
| MVP Launch | Dec 31, 2025 |
| First Customer | Jan 2026 |
| Breakeven | ~8 customers (Jun 2026) |
| Dec 2026 MRR | $99,500 |
| Dec 2026 ARR | ~$1.2M |

---

## Competitive Advantages

1. **SSI Framework** - Proprietary assessment methodology
2. **AI-Native** - Built with AI from the ground up
3. **Service Business Focus** - Tailored for 50-500 employee companies
4. **Consultant-Friendly** - Multi-company management portal
5. **Full Cascade** - Complete Objective → Task hierarchy
6. **Flexible Periods** - Calendar, fiscal, and custom year support

---

## Remaining Work (MVP Completion)

### Sprint 9-10 (Final)

| Feature | Points | Status |
|---------|--------|--------|
| Edit Objectives Modal | 5 | In Progress |
| Consultant Dashboard | 13 | Planned |
| Weekly Goals Calendar | 13 | Planned |
| Production Polish | 10 | Planned |
| Bug Fixes | 5 | Ongoing |
| **Total Remaining** | **~46 pts** |

### Feature Completion Status

| Feature Area | Delivered | Remaining | % Complete |
|--------------|-----------|-----------|------------|
| Assessment System | 68 pts | 0 | 100% |
| OKR/Objectives | 55 pts | 16 | 77% |
| Teams | 28 pts | 0 | 100% |
| Goals | 52 pts | 13 | 80% |
| Dashboard | 54 pts | 8 | 87% |
| Planning | 30 pts | 21 | 59% |
| Tasks | 25 pts | 15 | 63% |
| Infrastructure | 30 pts | 5 | 86% |

### Post-MVP Roadmap

- Mobile responsive optimization
- Email notifications
- Slack/Teams integration
- Advanced analytics
- Custom reporting
- API for third-party integrations

---

## Conclusion

Karvia Business represents a significant technical achievement: a production-ready B2B SaaS platform built in approximately 12 weeks using AI-assisted development. The platform delivers ~$500k+ of equivalent development value at a fraction of traditional costs, positioning it for a strong market entry in 2026.

---

*Document maintained by Karvia Development Team*
*For questions: [Internal Documentation]*
