# SSI Framework: Speed, Strength, Intelligence

## A 12-Block MECE Diagnostic Framework for Organizational Health Assessment

**Version**: 1.0.0
**Last Updated**: April 2, 2026
**Product**: Karvia Business / YSELA Platform

---

## Executive Summary

The **SSI Framework** (Speed, Strength, Intelligence) is a proprietary organizational health diagnostic system that assesses business performance across 12 mutually exclusive, collectively exhaustive (MECE) blocks. Unlike traditional assessments that rely on subjective perception alone, SSI combines quantitative metrics with behavioral indicators to produce a comprehensive 0-100 health score.

**Key differentiators:**
- **12-Block MECE Structure**: Ensures complete coverage with no gaps or overlaps
- **Multi-Response Type**: 7 different question formats for accuracy
- **Industry-Specific Weighting**: Adjusts importance by sector
- **Direct OKR Integration**: Gaps automatically map to actionable objectives
- **Multi-Level Reporting**: Individual → Team → Function → Company views

---

## The 12-Block Framework

The SSI Framework organizes organizational capabilities into **3 dimensions** with **4 blocks each**:

```
                    SSI FRAMEWORK (0-100 Score)
    ┌──────────────────────────────────────────────────────┐
    │                                                      │
    │  ┌─────────────────┬─────────────────┬─────────────┐ │
    │  │     SPEED       │    STRENGTH     │ INTELLIGENCE│ │
    │  │   (Velocity)    │  (Resilience)   │  (Strategy) │ │
    │  ├─────────────────┼─────────────────┼─────────────┤ │
    │  │ • Delivery      │ • Financial     │ • Market    │ │
    │  │ • Decisions     │ • Operations    │ • Data      │ │
    │  │ • Change        │ • People        │ • Strategy  │ │
    │  │ • Response      │ • Quality       │ • Learning  │ │
    │  └─────────────────┴─────────────────┴─────────────┘ │
    │                                                      │
    └──────────────────────────────────────────────────────┘
```

### Dimension 1: SPEED (Organizational Velocity)

Speed measures how quickly and effectively an organization can execute, decide, adapt, and respond.

| Block | What It Measures | Key Questions |
|-------|------------------|---------------|
| **Delivery** | Project/service execution capability | On-time delivery rates, cycle times, bottleneck resolution |
| **Decisions** | Decision-making speed and quality | Time to critical decisions, leadership alignment speed |
| **Change** | Organizational agility | Strategy pivot speed, change adoption rates, scaling capability |
| **Response** | Customer/market responsiveness | Response times, issue resolution speed, first-contact resolution |

### Dimension 2: STRENGTH (Operational Resilience)

Strength measures the foundational capabilities that enable sustainable operations.

| Block | What It Measures | Key Questions |
|-------|------------------|---------------|
| **Financial** | Financial health and discipline | Budget adherence, target achievement, cash flow management |
| **Operations** | Process excellence | Process compliance, SOP coverage, knowledge retention |
| **People** | Human capital and culture | Retention rates, engagement scores, succession coverage |
| **Quality** | Standards and compliance | First-time-right rates, satisfaction scores, compliance rates |

### Dimension 3: INTELLIGENCE (Learning & Strategy)

Intelligence measures the organization's ability to learn, understand markets, and plan strategically.

| Block | What It Measures | Key Questions |
|-------|------------------|---------------|
| **Market** | Customer/competitive understanding | NPS scores, market research frequency, competitive tracking |
| **Data** | Data-driven decision making | Data-backed decision rates, KPI coverage, reporting automation |
| **Strategy** | Strategic planning capability | Strategic review participation, resource ROI, initiative completion |
| **Learning** | Innovation and continuous improvement | Training hours, improvement ideas generated, post-mortems conducted |

---

## Scoring Methodology

### Response Types (7 Formats)

The SSI Framework uses 7 different response types to capture both quantitative metrics and qualitative assessments:

| Response Type | Description | Example Question |
|---------------|-------------|------------------|
| **Percentage** | Quantitative 0-100% | "What % of projects delivered on time?" |
| **Time (Short)** | Hours/days duration | "How long does critical issue resolution take?" |
| **Time (Long)** | Weeks/months duration | "How long does strategy pivot implementation take?" |
| **Frequency** | How often events occur | "How often do you conduct customer research?" |
| **Maturity** | Capability maturity level | "What is your process documentation maturity?" |
| **Perception** | Behavioral 0-10 scale | "Rate leadership decision alignment (0-10)" |
| **Effectiveness** | Outcome effectiveness | "How effective is your employee onboarding?" |

### Score Calculation Process

```
   QUESTION LEVEL              BLOCK LEVEL               DIMENSION LEVEL         OVERALL
   ┌──────────────┐            ┌──────────────┐          ┌──────────────┐       ┌────────┐
   │ Response     │            │ Weighted     │          │ Average of   │       │Weighted│
   │ normalized   │──▶         │ average of   │──▶       │ 4 blocks     │──▶    │average │
   │ to 0-10      │            │ questions    │          │ (0-10)       │       │ (0-100)│
   └──────────────┘            └──────────────┘          └──────────────┘       └────────┘
        │                           │                         │
        │ - Reverse scoring         │ - Question weights      │ - Industry
        │ - Type normalization      │ - Key metric tracking   │   weights
        │                           │                         │
```

1. **Question Level**: Raw responses normalized to 0-10 scale
   - Inverse scoring applied where appropriate
   - Response type-specific normalization formulas

2. **Block Level**: Weighted average of all questions in the block
   - Default weight: 1.0 per question
   - Key metrics identified for each block

3. **Dimension Level**: Average of 4 blocks (0-10)
   - Equal weighting within dimension

4. **Overall SSI**: Weighted average of 3 dimensions
   - Default: 34% Speed, 33% Strength, 33% Intelligence
   - Industry-specific weights applied when relevant

### Status Classification

| Score Range | Status | Color | Action Required |
|-------------|--------|-------|-----------------|
| 8.0 - 10.0 | Good | Green | Leverage as strength |
| 6.0 - 7.9 | Watch | Yellow | Monitor and improve |
| 0 - 5.9 | Alert | Red | Immediate attention |

### Industry-Specific Weighting

Different industries have different critical success factors. The SSI Framework adjusts dimension weights accordingly:

| Industry | Speed | Strength | Intelligence |
|----------|-------|----------|--------------|
| Technology/SaaS | 40% | 25% | 35% |
| Financial Services | 30% | 40% | 30% |
| Healthcare | 25% | 45% | 30% |
| Manufacturing | 30% | 45% | 25% |
| Professional Services | 35% | 35% | 30% |
| Home Services | 35% | 40% | 25% |

---

## Question Library Structure

### Module Types

Questions are organized into three modules:

1. **Core Module** (48-52 questions)
   - Universal questions applicable to all businesses
   - Covers all 12 blocks
   - Forms the baseline assessment

2. **Industry Module** (28+ questions per industry)
   - Sector-specific questions
   - Addresses unique industry challenges
   - Industries: Technology, Healthcare, Financial Services, Manufacturing, Retail, Professional Services, Home Services, Agriculture

3. **Role Module** (8-12 questions per role)
   - Function-specific perspectives
   - Roles: Executive, Manager, Employee, Business Owner

### Sample Questions by Block

**SPEED - Delivery Block**
- "What percentage of your projects/services are delivered on time?" (percentage)
- "What is your average project cycle time from start to completion?" (time_long)
- "How quickly can you resolve operational bottlenecks?" (time_short)

**STRENGTH - People Block**
- "What is your annual employee retention rate?" (percentage)
- "Rate your team's overall engagement level" (perception: 0-10)
- "What percentage of critical roles have succession plans?" (percentage)

**INTELLIGENCE - Data Block**
- "What percentage of key decisions are backed by data analysis?" (percentage)
- "How many KPIs do you actively track for your core processes?" (frequency)
- "Rate your organization's data accessibility" (perception: 0-10)

---

## Assessment Flow

### 80% Completion Gate

The SSI Framework requires **80% assessment completion** before generating diagnostic reports. This ensures:
- Sufficient data for reliable scoring
- All dimensions represented
- Statistically valid results

### Assessment Timeline

```
Day 1-3: Individual Assessments
         └── Each team member completes their assessment
         └── Role-specific questions included
         └── Industry questions for leadership

Day 4: Data Aggregation
       └── Individual scores calculated
       └── Team aggregation performed
       └── Completion rate verified (80%+ required)

Day 5: Report Generation
       └── Diagnostic engine processes results
       └── AI narrative generated
       └── OKR recommendations created
```

---

## Diagnostic Reports (5 Levels)

### Level 1: Individual Report
- Personal SSI scores across 12 blocks
- Comparison to team and company averages
- Personal development recommendations

### Level 2: Team Report
- Team aggregate scores
- Team cohesion metrics
- Cross-team comparison within function

### Level 3: Function Report
- Department-level analysis
- Cross-function gap identification
- Function health assessment

### Level 4: Company Report
- Overall organizational health (0-100 composite)
- Dimension breakdown with trends
- Industry benchmark comparison

### Level 5: Diagnostic Report
- Comprehensive analysis with AI-generated narrative
- Root cause identification
- Critical pair analysis (function interdependencies)
- OKR recommendations mapped to weak blocks

---

## OKR Integration

### Direct Block-to-OKR Mapping

Each of the 12 blocks has pre-defined objective templates:

**Example: Delivery Block (Low Score)**
```
Objective: Achieve Operational Excellence in Project Delivery

Key Results:
1. Increase on-time delivery from 65% to 85%
2. Reduce average cycle time by 25%
3. Resolve operational bottlenecks within 4 hours
```

**Example: People Block (Low Score)**
```
Objective: Build High-Performance Team Culture

Key Results:
1. Improve employee retention from 72% to 88%
2. Increase employee engagement score to 8.0
3. Maintain 85% succession coverage for critical roles
```

### Priority Matrix

OKR recommendations are prioritized using:

1. **Gap Score**: How far below the "Good" threshold (7.0)
2. **Dimension Weight**: Industry-specific importance
3. **Critical Pair Impact**: Effect on function interdependencies

```
Priority Score = Gap × Dimension Weight × (1 + Pair Impact × 0.5)
```

### Leverage Opportunities

The framework also identifies **strengths** (blocks scoring 7.5+) that can be leveraged to improve weaker areas:

```
Objective: Leverage Operations Strength to Improve Delivery

Key Results:
1. Cross-train operations best practices to delivery team
2. Apply operations processes to improve delivery
```

---

## Value Proposition

### For Business Owners
- **Single Score**: Understand business health at a glance (0-100)
- **Actionable Insights**: Know exactly where to focus
- **Industry Context**: Benchmarked against sector peers
- **OKR Ready**: Recommendations ready for implementation

### For Consultants
- **Diagnostic Depth**: 12-block analysis reveals root causes
- **Evidence-Based**: Quantitative metrics support recommendations
- **Client Alignment**: Clear visual framework for discussions
- **Progress Tracking**: Measurable improvement over time

### For Executives
- **Strategic Clarity**: See dimension-level health
- **Function Comparison**: Identify organizational gaps
- **Resource Allocation**: Data-driven budget decisions
- **Board Reporting**: Executive summary format

### For Managers
- **Team Insights**: Understand team strengths/weaknesses
- **Goal Setting**: OKRs aligned to team priorities
- **Cross-Team View**: Compare with peer teams
- **Development Focus**: Individual improvement areas

---

## Technical Implementation

### Backend Services

| Service | Purpose |
|---------|---------|
| `DiagnosticSSIScoringService.js` | Core scoring algorithms |
| `DiagnosticEngine.js` | Report generation engine |
| `OKRRecommendationService.js` | OKR template mapping |
| `IndustryConfig.js` | Industry-specific weights |
| `InsightDetector.js` | Pattern and gap detection |
| `SSINarrativeService.js` | AI narrative generation |

### Data Models

| Model | Purpose |
|-------|---------|
| `Assessment.js` | Stores individual assessments |
| `AssessmentQuestion.js` | Question library |
| `AssessmentTemplate.js` | Dynamic templates |
| `DiagnosticReport.js` | Report storage |

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/assessments` | Submit assessment |
| `GET /api/assessments/:id/score` | Get SSI scores |
| `GET /api/diagnostics/company/:id` | Company diagnostic |
| `GET /api/diagnostics/team/:id` | Team diagnostic |
| `POST /api/ai-okr/generate` | Generate OKR recommendations |

---

## Sample Output: Company Diagnostic

```
╔══════════════════════════════════════════════════════════════╗
║                    COMPANY SSI DIAGNOSTIC                     ║
║                      TechStart Inc.                           ║
║                   Industry: Technology                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  OVERALL SSI SCORE: 67/100                                    ║
║  ████████████████████░░░░░░░░  [WATCH]                       ║
║                                                               ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  SPEED (Velocity): 7.2/10                                     ║
║  ├── Delivery:   6.8  ⚠️  Watch                               ║
║  ├── Decisions:  7.5  ✅  Good                                ║
║  ├── Change:     6.2  ⚠️  Watch                               ║
║  └── Response:   8.3  ✅  Good                                ║
║                                                               ║
║  STRENGTH (Resilience): 5.9/10                                ║
║  ├── Financial:  6.5  ⚠️  Watch                               ║
║  ├── Operations: 5.2  🔴  Alert                               ║
║  ├── People:     5.8  🔴  Alert                               ║
║  └── Quality:    6.1  ⚠️  Watch                               ║
║                                                               ║
║  INTELLIGENCE (Strategy): 7.1/10                              ║
║  ├── Market:     7.8  ✅  Good                                ║
║  ├── Data:       6.9  ⚠️  Watch                               ║
║  ├── Strategy:   6.5  ⚠️  Watch                               ║
║  └── Learning:   7.2  ✅  Good                                ║
║                                                               ║
╠══════════════════════════════════════════════════════════════╣
║  TOP 3 PRIORITIES:                                            ║
║  1. Operations (5.2) - Critical: Process standardization      ║
║  2. People (5.8) - Critical: Talent retention                 ║
║  3. Change (6.2) - Watch: Organizational agility              ║
║                                                               ║
║  LEVERAGE OPPORTUNITIES:                                      ║
║  • Response (8.3) - Use to improve Operations                 ║
║  • Market (7.8) - Strong customer understanding               ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Appendix A: Complete Block Definitions

### SPEED Dimension

| Block | Full Definition | Measured By |
|-------|-----------------|-------------|
| **Delivery** | The organization's ability to execute projects, services, and commitments on time and within scope | On-time rates, cycle times, bottleneck resolution, resource utilization |
| **Decisions** | Speed and quality of decision-making processes across the organization | Decision time, leadership alignment, decision reversals, delegation effectiveness |
| **Change** | Organizational agility and ability to adapt to new circumstances | Pivot speed, change adoption, scaling capability, crisis response |
| **Response** | Responsiveness to customer, market, and stakeholder needs | Response times, resolution rates, first-contact resolution, escalation handling |

### STRENGTH Dimension

| Block | Full Definition | Measured By |
|-------|-----------------|-------------|
| **Financial** | Financial health, discipline, and capital efficiency | Budget adherence, target achievement, cash flow, cost control |
| **Operations** | Operational excellence and process consistency | Process compliance, documentation, knowledge management, efficiency |
| **People** | Human capital management, culture, and talent development | Retention, engagement, succession planning, training investment |
| **Quality** | Standards, compliance, and continuous improvement | First-time-right, customer satisfaction, compliance rates, defect rates |

### INTELLIGENCE Dimension

| Block | Full Definition | Measured By |
|-------|-----------------|-------------|
| **Market** | Customer understanding and competitive intelligence | NPS, market research, competitive tracking, customer feedback loops |
| **Data** | Data-driven decision making and analytics capability | Data-backed decisions, KPI coverage, reporting automation, data quality |
| **Strategy** | Forward-looking planning and resource allocation | Strategic reviews, initiative completion, resource ROI, vision alignment |
| **Learning** | Innovation, R&D, and organizational learning culture | Training hours, innovation ideas, post-mortems, experimentation |

---

## Appendix B: References

### Source Files

| File | Path | Purpose |
|------|------|---------|
| DiagnosticSSIScoringService | `/server/services/diagnostic/DiagnosticSSIScoringService.js` | Core scoring |
| OKRRecommendationService | `/server/services/diagnostic/OKRRecommendationService.js` | OKR templates |
| Assessment Model | `/server/models/Assessment.js` | Data schema |
| Question Model | `/server/models/AssessmentQuestion.js` | Question library |
| IndustryConfig | `/server/services/diagnostic/IndustryConfig.js` | Industry weights |

### Related Documentation

- Epic 7: SSI Diagnostic System (Sprint 6)
- Epic I: Unified SSI Intelligence (Sprint 8)
- Epic R: SSI Diagnostic Report (Sprint 10)
- System Overview (1-PRODUCT/SYSTEM_OVERVIEW.md)
- Product Overview (1-PRODUCT/KARVIA_PRODUCT_OVERVIEW.md)

---

**Document Status**: Production Ready
**Classification**: Marketing / Product Documentation
**Audience**: Consultants, Prospects, Internal Teams
