# Karvia Product Strategy Master Document (Historical)

<!-- @GENOME T1-PRD-005 | HISTORICAL | 2026-04-05 | parent:T1-PRD-001 | auto:- | linked:/strategy -->

**Status**: HISTORICAL (Pre-Beta Strategy)
**Original Version**: 1.0 | November 2025
**Archived**: April 5, 2026

---

> **This document is HISTORICAL.**
>
> Product strategy has evolved through the YSELA/KARVIA separation.
>
> **For current documentation, see:**
> - **Official Description**: "YSELA uses the current execution stack to guide handoffs, ownership, and next moves."
> - **Product Vision**: [YSELA/vision/YSELA_VISION.md](../../../YSELA/vision/YSELA_VISION.md)
> - **Engine Vision**: [KARVIA_ENGINE_VISION.md](../../1-VISION/KARVIA_ENGINE_VISION.md)
> - **Beta Roadmap**: [BETA_ROADMAP_2026.md](../roadmap/BETA_RELEASE_PROJECT/BETA_ROADMAP_2026.md)
>
> The content below is preserved for historical reference.

---

## Historical Content (November 2025)

The original document described Karvia as a "B2B OKR management platform."

**Evolution**: Product has since separated into:
- **KARVIA**: The OKR engine (invisible infrastructure)
- **YSELA**: The product brand (behavior-based operating system)

---

## 1️⃣ FOUNDATION - Why We Exist

### Core Philosophy
**"Assessment-First, Outcome-Driven, SMB-Optimized"**

We believe that:
- Generic OKRs fail because they ignore business context
- SMBs need simplicity, not enterprise complexity
- Consultants are the key to SMB transformation
- AI should augment, not replace, human judgment
- Progress visibility drives accountability

### Problem We Solve
```
Current Reality:
- 74% of SMBs struggle with strategic alignment
- Managers spend 10+ hours/quarter on planning
- 77% of employees don't understand their impact
- Spreadsheet chaos costs 15+ hours/week
- No early warning system for failing objectives
```

### Solution Approach
```
Assessment → Insights → AI OKRs → Cascade → Track → Recognize → Improve
```

---

## 2️⃣ MARKET - Where We Compete

### Market Opportunity
- **TAM**: $112B (5.2M SMBs globally × 150 employees × $12/month)
- **SAM**: $9.7B (450K tech-forward SMBs in English markets)
- **SOM**: $32.4M (1,500 businesses Year 1)
- **Growth**: 22% CAGR in performance management software

### Target Segments

| Segment | Size | Characteristics | Pain Points |
|---------|------|----------------|-------------|
| **Primary** | 50-200 employees | Tech-forward, growth-focused | Scaling challenges, alignment issues |
| **Secondary** | 200-500 employees | Established, structured | Complex coordination, visibility gaps |
| **Future** | 20-50 employees | Startups, high-growth | Resource constraints, focus issues |

### Competitive Landscape

| Competitor | Strength | Weakness | Our Advantage |
|------------|----------|----------|---------------|
| **Asana** | Brand, features | Not OKR-native | Purpose-built for OKRs |
| **Monday.com** | Flexibility | Complexity | 10x simpler setup |
| **Weekdone** | OKR-focused | No AI, no assessment | AI + assessment-driven |
| **Spreadsheets** | Free, familiar | Manual, chaotic | Automated, structured |

---

## 3️⃣ POSITIONING - How We Win

### Unique Value Proposition
> "The only OKR platform that generates contextual objectives from business assessment, delivered through consultant partnerships for guaranteed success."

### 5 Outcome Pillars

| Pillar | Customer Need | Our Solution | Measurable Impact |
|--------|---------------|--------------|-------------------|
| **Clarity** | "What should we focus on?" | AI-generated OKRs from assessment | 80% reduction in planning time |
| **Commitment** | "Will teams follow through?" | Clear cascade, visible progress | 3x improvement in completion |
| **Adaptability** | "Can we pivot quickly?" | Real-time tracking, early warnings | 2 weeks advance notice |
| **Competency** | "Are we getting better?" | Historical tracking, insights | 25% capability improvement |
| **Opportunity** | "What's possible?" | Recognition, growth paths | 60% engagement increase |

### ROI Model
For a 50-person SMB:
- **Investment**: $7,200/year ($12 × 50 × 12)
- **Return**: $315,000/year (10% productivity × $63K average salary × 50)
- **ROI**: 4,275% (43x return)

---

## 4️⃣ SOLUTION - What We Build

### Product Architecture (7 Modular Blocks)

```
Block 1: Core Execution (Standalone)
├── Manual OKR creation
├── Progress tracking
└── Basic reporting

Block 2: Team Management (Optional)
├── Multi-user access
├── Role permissions (6 levels)
└── Team hierarchy

Block 3: Assessment Framework (Optional)
├── SSI scoring (Speed/Strength/Intelligence)
├── 146 question bank
└── Weakness analysis

Block 4: AI Generation (Requires Block 3)
├── GPT-4 integration
├── Context-aware OKRs
└── Template fallback

Block 5: Advanced Analytics (Optional)
├── Predictive insights
├── Risk detection
└── Trend analysis

Block 6: Bulk Operations (Optional)
├── Mass invitations
├── Import/export
└── Batch updates

Block 7: iBrain Integration (Premium)
├── Behavioral nudging
├── Sentiment analysis
└── AI coaching
```

### Feature Implementation Status

| Module | Features | Backend | Frontend | Overall |
|--------|----------|---------|----------|---------|
| **Authentication** | 7 | 95% | 90% | 93% |
| **Assessment** | 10 | 100% | 100% | 100% |
| **OKR Management** | 9 | 100% | 50% | 75% |
| **Planning** | 8 | 100% | 20% | 60% |
| **Teams** | 7 | 100% | 80% | 90% |
| **Analytics** | 8 | 100% | 40% | 70% |
| **Communication** | 7 | 70% | 20% | 45% |
| **AI Features** | 8 | 80% | 30% | 55% |
| **TOTAL** | **89** | **93%** | **54%** | **70%** |

### Critical Gaps (P0)
1. **Planning Page UI** - 0% frontend (blocks OKR→task conversion)
2. **Employee Dashboard** - 0% built (blocks employee adoption)
3. **Goal Management UI** - 30% complete (missing quarterly/weekly views)

---

## 5️⃣ EXECUTION - How We Deliver

### Go-to-Market Strategy

**Distribution Model**: Consultant-Led Growth
```
Consultant (Tanner) → Executive (Shane) → Team (Steven, Matt, Eugene)
     ↓                      ↓                    ↓
  20% rev share     Owns implementation    Daily execution
```

### Pricing Strategy

| Tier | Users | Price | Features | Target |
|------|-------|-------|----------|--------|
| **Starter** | ≤20 | $10/user/mo | Core OKRs | Testing teams |
| **Professional** | 21-200 | $12/user/mo | Full suite + AI | Core SMBs |
| **Enterprise** | 200+ | Custom (~$15) | iBrain + white-label | Large SMBs |

### Launch Timeline

**Phase 1: MVP** (Weeks 1-4) ✅ Complete
- Assessment framework
- Core OKR functionality
- Basic analytics

**Phase 2: Beta** (Weeks 5-12) 🔄 Current
- Complete UI gaps
- Mobile responsive
- Integration testing

**Phase 3: Launch** (Jan 31, 2026)
- 50 pioneer consultants
- 100 beta customers
- PR campaign

**Phase 4: Growth** (Q1-Q2 2026)
- Scale to 1,500 customers
- Public API
- Integrations (Slack, Teams)

### Customer Acquisition

| Channel | Strategy | CAC | LTV:CAC |
|---------|----------|-----|---------|
| **Consultants** | 20% revenue share | $500 | 12:1 |
| **Content/SEO** | Blog, webinars | $750 | 8:1 |
| **Paid Search** | Google, LinkedIn | $1,500 | 4:1 |
| **Referrals** | Customer program | $300 | 20:1 |

### Success Metrics

| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| **Customers** | 20 | 500 | 1,500 |
| **MRR** | $3.6K | $90K | $270K |
| **Users** | 300 | 7,500 | 22,500 |
| **NPS** | >40 | >50 | >60 |
| **Churn** | <8% | <5% | <3% |

---

## 6️⃣ TECHNOLOGY - How We Build

### Tech Stack
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Vanilla JS → React (planned)
- **AI**: OpenAI GPT-4
- **Infrastructure**: Render (→ AWS planned)
- **Integrations**: Mailjet, Stripe, Slack (planned)

### iBrain Integration (Optional Premium)
```javascript
// Toggle-based architecture
if (company.ibrain_enabled) {
  // AI-powered features active
  enableBehavioralNudging();
  enablePredictiveAnalytics();
  enableAICoaching();
} else {
  // Standard features only
  useManualWorkflows();
}
```

### Data Architecture
- 11 MongoDB collections
- Multi-tenant isolation
- Company-based partitioning
- Role-based access control
- JWT authentication (24hr + refresh)

---

## 7️⃣ ROADMAP - Where We're Going

### 2026: Foundation Year
- Q1: Launch + 500 customers
- Q2: Mobile app + API
- Q3: Advanced AI features
- Q4: International expansion

### 2027: Growth Year
- 10,000 customers
- $24M ARR
- Platform marketplace
- Industry verticals

### 2028: Scale Year
- 50,000 customers
- $120M ARR
- IPO readiness
- Market leader position

---

## 8️⃣ RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Slow adoption** | High | Medium | Free tier, aggressive onboarding |
| **Competition** | Medium | High | Focus on SMB niche, move fast |
| **Tech debt** | Medium | Medium | 20% refactoring time |
| **Economic downturn** | High | Low | Emphasize ROI, flexible pricing |
| **Consultant churn** | High | Medium | Higher rev share, better support |

---

## 9️⃣ KEY DECISIONS & RATIONALE

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Start with consultants** | Consultant-led GTM | Lower CAC, higher success rate |
| **Assessment first** | SSI framework | Contextual OKRs > generic templates |
| **Modular architecture** | 7 independent blocks | Start simple, scale complexity |
| **Vanilla JS initially** | No framework | Ship faster, migrate later |
| **iBrain optional** | Toggle-based | Reduce dependencies, flexible pricing |

---

## 🎯 Strategic Priorities (Next 60 Days)

### Must Do (P0)
1. Complete Planning Page UI
2. Build Employee Dashboard
3. Finish Goal Management UI
4. Mobile responsive design
5. Integration testing

### Should Do (P1)
1. Performance optimization
2. Enhanced error handling
3. Onboarding flow
4. Help documentation

### Could Do (P2)
1. Advanced analytics
2. Slack integration
3. Export features
4. Custom reports

---

## 📊 Success Criteria

We win when:
- **Customers say**: "This transformed how we work"
- **Consultants say**: "This is my secret weapon"
- **Metrics show**: 60% weekly active, <5% churn
- **Market shows**: Top 3 in SMB OKR category
- **Team says**: "We're changing SMB performance"

---

## 📞 Governance

**Owner**: Product Strategy Team
**Review**: Monthly strategic review
**Updates**: After major decisions
**Distribution**: All stakeholders

---

**This master document represents the complete product strategy for Karvia. All strategic decisions should align with and reference this document.**

**Next Review**: December 2025 (Pre-beta launch)