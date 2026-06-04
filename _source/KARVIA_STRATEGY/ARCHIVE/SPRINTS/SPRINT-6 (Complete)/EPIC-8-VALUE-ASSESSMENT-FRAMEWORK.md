# Epic 8: VALUE Assessment Framework - Design Specification

**Sprint**: 7 (Planned)
**Priority**: P1 - Strategic Enhancement
**Points**: TBD (13-21 estimated)
**Hours**: TBD
**Date**: December 1, 2025
**Status**: Design Complete - Ready for Sprint 7 Planning

---

## Executive Summary

The VALUE Assessment Framework (Value-Aligned Leadership & Understanding Evaluation) is a comprehensive organizational assessment system designed to replace/enhance the existing SSI (Speed, Strength, Intelligence) framework with a more strategic, value-creation focused approach.

### Why VALUE?

| Current SSI | VALUE Framework |
|-------------|-----------------|
| Measures operational capability only | Measures strategic readiness + operational capability |
| 3 dimensions (Speed, Strength, Intelligence) | 7 pillars (External + Internal) |
| ~146 questions | ~78 questions (optimized for SMBs) |
| Individual → Team → Company | Individual → Team → Function → Company |
| No external awareness | Full macro/industry/competitive awareness |
| No strategic alignment metrics | Mission, Vision, Values, Goal Cascade |

---

## Framework Architecture

### MECE Structure (Mutually Exclusive, Collectively Exhaustive)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    V.A.L.U.E. Assessment Framework                      │
│            (Value-Aligned Leadership & Understanding Evaluation)        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LEVEL 1: EXTERNAL vs INTERNAL (MECE Split)                             │
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐       │
│  │     EXTERNAL AWARENESS      │  │     INTERNAL READINESS       │       │
│  │   (What's happening TO us)  │  │   (What we can control)      │       │
│  │                             │  │                              │       │
│  │  E1: Market & Macro         │  │  I1: Strategic Alignment     │       │
│  │  E2: Disruption Readiness   │  │  I2: Organizational Health   │       │
│  │  E3: Competitive Position   │  │  I3: Team Dynamics           │       │
│  │                             │  │  I4: Operational Excellence  │       │
│  └─────────────────────────────┘  └─────────────────────────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## The 7 Pillars

### External Awareness (3 Pillars)

| Pillar | What It Measures | OKR Impact |
|--------|------------------|------------|
| **E1: Market & Macro Awareness** | Economic trends, regulatory landscape, supply chain stability | Defensive OKRs, risk mitigation |
| **E2: Disruption Readiness** | Technology threats, innovation gaps, industry shifts | Innovation OKRs, R&D priorities |
| **E3: Competitive Position** | Market differentiation, customer perception, pricing power | Growth OKRs, market expansion |

### Internal Readiness (4 Pillars)

| Pillar | What It Measures | OKR Impact |
|--------|------------------|------------|
| **I1: Strategic Alignment** | Mission clarity, vision resonance, goal cascade effectiveness | Strategic OKRs, leadership focus |
| **I2: Organizational Health** | Decision speed, change adaptability, resource allocation | Efficiency OKRs, capability building |
| **I3: Team Dynamics** | Individual competency, team collaboration, cross-functional alignment | People OKRs, culture initiatives |
| **I4: Operational Excellence** | Process efficiency, quality standards, customer satisfaction | Operational OKRs, service improvement |

---

## Question Bank (78 Questions)

### Distribution Summary

| Pillar | Questions | Role Filter | Categories |
|--------|-----------|-------------|------------|
| E1: Market & Macro | 12 | Leadership + Managers | Economic, Regulatory, Supply Chain, Geopolitical |
| E2: Disruption Ready | 10 | All | Tech Disruption, Business Model, Market Shift |
| E3: Competitive | 10 | All | Differentiation, Customer Value, Competitive Intel |
| I1: Strategic Align | 12 | All | Mission, Vision, Values, Goal Cascade |
| I2: Org Health | 12 | All | Leadership, Decision Speed, Change, Resources |
| I3: Team Dynamics | 12 | All | Competency, Collaboration, Cross-Functional, Safety |
| I4: Operations | 10 | All | Process, Quality, Customer Satisfaction |
| **TOTAL** | **78** | - | 25 sub-categories |

---

## E1: Market & Macro Awareness (12 Questions)

**Who Answers**: Leadership + Managers only

| ID | Question | Category | Inverse |
|----|----------|----------|---------|
| E1.1.1 | "I understand how current inflation/interest rates affect our pricing decisions" | Economic | No |
| E1.1.2 | "Our leadership regularly discusses economic trends that could impact our business" | Economic | No |
| E1.1.3 | "I feel prepared for a potential economic downturn in the next 12 months" | Economic | No |
| E1.2.1 | "I'm aware of regulatory changes coming in our industry this year" | Regulatory | No |
| E1.2.2 | "Our company proactively adapts to new compliance requirements" | Regulatory | No |
| E1.2.3 | "We have dedicated resources for tracking regulatory changes" | Regulatory | No |
| E1.3.1 | "We have backup plans if a key supplier fails to deliver" | Supply Chain | No |
| E1.3.2 | "I know who our critical suppliers are and their risk profiles" | Supply Chain | No |
| E1.3.3 | "We've experienced supply disruptions that hurt our business in the past year" | Supply Chain | **Yes** |
| E1.4.1 | "I understand how global events (trade, conflicts) could affect our customers" | Geopolitical | No |
| E1.4.2 | "Our business is overly dependent on a single geographic market" | Geopolitical | **Yes** |
| E1.4.3 | "We actively monitor international factors relevant to our industry" | Geopolitical | No |

**OKR Examples**:
- Low E1.1 → "Establish quarterly economic impact reviews"
- Low E1.3 → "Develop supplier diversification strategy"

---

## E2: Disruption Readiness (10 Questions)

**Who Answers**: All employees

| ID | Question | Category | Inverse |
|----|----------|----------|---------|
| E2.1.1 | "I'm aware of technologies that could make our products/services obsolete" | Tech Disruption | No |
| E2.1.2 | "Our company invests in learning new technologies relevant to our industry" | Tech Disruption | No |
| E2.1.3 | "We've been surprised by a competitor's technology advantage in the past year" | Tech Disruption | **Yes** |
| E2.1.4 | "AI tools are actively used in my daily work" | Tech Disruption | No |
| E2.2.1 | "We regularly explore new ways to deliver value to customers" | Business Model | No |
| E2.2.2 | "Our revenue comes from too few sources" | Business Model | **Yes** |
| E2.2.3 | "Leadership encourages experimentation with new business approaches" | Business Model | No |
| E2.3.1 | "I can identify at least 2 major trends that could change our industry in 3 years" | Market Shift | No |
| E2.3.2 | "Our company has a clear view of where the market is heading" | Market Shift | No |
| E2.3.3 | "We react to market changes rather than anticipate them" | Market Shift | **Yes** |

**OKR Examples**:
- Low E2.1 → "Launch technology scouting program"
- Low E2.2 → "Explore 2 new revenue stream opportunities"

---

## E3: Competitive Position (10 Questions)

**Who Answers**: All employees

| ID | Question | Category | Inverse |
|----|----------|----------|---------|
| E3.1.1 | "I can clearly articulate what makes us different from competitors" | Differentiation | No |
| E3.1.2 | "Customers choose us primarily because of price, not value" | Differentiation | **Yes** |
| E3.1.3 | "Our unique strengths are difficult for competitors to copy" | Differentiation | No |
| E3.2.1 | "Customers consistently rate our value highly compared to alternatives" | Customer Value | No |
| E3.2.2 | "We regularly lose customers to competitors" | Customer Value | **Yes** |
| E3.2.3 | "I receive positive feedback from customers about our service/product" | Customer Value | No |
| E3.2.4 | "Customers refer others to us frequently" | Customer Value | No |
| E3.3.1 | "I know who our top 3 competitors are and their strengths" | Competitive Intel | No |
| E3.3.2 | "We systematically track what competitors are doing" | Competitive Intel | No |
| E3.3.3 | "We've been caught off-guard by a competitor's move in the past year" | Competitive Intel | **Yes** |

**OKR Examples**:
- Low E3.1 → "Define and communicate unique value proposition"
- Low E3.3 → "Establish competitive intelligence process"

---

## I1: Strategic Alignment (12 Questions)

**Who Answers**: All employees

| ID | Question | Category | Inverse |
|----|----------|----------|---------|
| I1.1.1 | "I can explain our company's mission in one sentence" | Mission Clarity | No |
| I1.1.2 | "Our mission genuinely guides how we make decisions" | Mission Clarity | No |
| I1.1.3 | "I joined this company partly because I believe in its mission" | Mission Clarity | No |
| I1.2.1 | "I believe our company's long-term vision is achievable" | Vision Resonance | No |
| I1.2.2 | "I'm excited about where this company is heading" | Vision Resonance | No |
| I1.2.3 | "Leadership paints a clear picture of our future success" | Vision Resonance | No |
| I1.3.1 | "People here actually live our stated company values" | Values Alignment | No |
| I1.3.2 | "I've seen decisions made that contradict our stated values" | Values Alignment | **Yes** |
| I1.3.3 | "I'm proud to tell others about our company's values" | Values Alignment | No |
| I1.4.1 | "I understand how my goals connect to company objectives" | Goal Cascade | No |
| I1.4.2 | "My team's priorities are clearly aligned with company strategy" | Goal Cascade | No |
| I1.4.3 | "I often work on tasks that don't seem connected to company goals" | Goal Cascade | **Yes** |

**OKR Examples**:
- Low I1.1 → "Relaunch mission communication program"
- Low I1.4 → "Implement OKR cascade training for all managers"

---

## I2: Organizational Health (12 Questions)

**Who Answers**: All employees

| ID | Question | Category | Inverse |
|----|----------|----------|---------|
| I2.1.1 | "Leadership sets a clear direction for our team" | Leadership | No |
| I2.1.2 | "I trust our leadership to make good decisions for the company" | Leadership | No |
| I2.1.3 | "Leaders here lead by example" | Leadership | No |
| I2.2.1 | "Decisions are made quickly enough to respond to opportunities" | Decision Speed | No |
| I2.2.2 | "Too many approvals are needed to get things done" | Decision Speed | **Yes** |
| I2.2.3 | "The right people are involved in decisions that affect my work" | Decision Speed | No |
| I2.3.1 | "This company adapts well to change" | Change Adaptability | No |
| I2.3.2 | "People here resist new ways of doing things" | Change Adaptability | **Yes** |
| I2.3.3 | "We learn from our failures and improve" | Change Adaptability | No |
| I2.4.1 | "Resources are allocated fairly across teams" | Resource Allocation | No |
| I2.4.2 | "I have the tools and resources I need to do my job well" | Resource Allocation | No |
| I2.4.3 | "Some teams seem to get more support than others unfairly" | Resource Allocation | **Yes** |

**OKR Examples**:
- Low I2.2 → "Reduce decision approval layers by 50%"
- Low I2.3 → "Launch change management capability program"

---

## I3: Team Dynamics (12 Questions)

**Who Answers**: All employees

**Note**: This pillar integrates with existing SSI dimensions for backward compatibility.

| ID | Question | Category | Maps to SSI |
|----|----------|----------|-------------|
| I3.1.1 | "I have the skills needed to excel in my current role" | Individual Competency | Speed |
| I3.1.2 | "I'm actively developing new skills relevant to my job" | Individual Competency | Intelligence |
| I3.1.3 | "I know what skills I need to develop for my next role" | Individual Competency | Intelligence |
| I3.2.1 | "My team works well together to solve problems" | Team Collaboration | Strength |
| I3.2.2 | "Team members help each other without being asked" | Team Collaboration | Strength |
| I3.2.3 | "Conflicts within my team are resolved constructively" | Team Collaboration | Strength |
| I3.3.1 | "Teams across departments work well together" | Cross-Functional | Speed |
| I3.3.2 | "Information flows freely between teams" | Cross-Functional | Speed |
| I3.3.3 | "Silos between departments hurt our effectiveness" | Cross-Functional | Speed (Inverse) |
| I3.4.1 | "I feel safe to take risks and speak up without fear" | Psychological Safety | Intelligence |
| I3.4.2 | "Mistakes are treated as learning opportunities, not failures" | Psychological Safety | Intelligence |
| I3.4.3 | "I can disagree with my manager without negative consequences" | Psychological Safety | Strength |

**OKR Examples**:
- Low I3.2 → "Implement team effectiveness program"
- Low I3.3 → "Launch cross-functional collaboration initiatives"

---

## I4: Operational Excellence (10 Questions)

**Who Answers**: All employees

| ID | Question | Category | Inverse |
|----|----------|----------|---------|
| I4.1.1 | "Our processes are efficient and minimize wasted effort" | Process Efficiency | No |
| I4.1.2 | "I spend too much time on administrative tasks vs. valuable work" | Process Efficiency | **Yes** |
| I4.1.3 | "We regularly improve how we do things" | Process Efficiency | No |
| I4.2.1 | "We consistently deliver high-quality work" | Quality | No |
| I4.2.2 | "Quality problems are caught and fixed quickly" | Quality | No |
| I4.2.3 | "We cut corners to meet deadlines" | Quality | **Yes** |
| I4.3.1 | "We truly understand what our customers need" | Customer Satisfaction | No |
| I4.3.2 | "Customer complaints are handled effectively" | Customer Satisfaction | No |
| I4.3.3 | "We proactively improve based on customer feedback" | Customer Satisfaction | No |
| I4.3.4 | "I'm confident our customers would recommend us" | Customer Satisfaction | No |

**OKR Examples**:
- Low I4.1 → "Reduce administrative overhead by 30%"
- Low I4.2 → "Implement quality management system"

---

## Scoring & OKR Generation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     VALUE → OKR GENERATION FLOW                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  VALUE Assessment Results                                               │
│           │                                                             │
│           ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  SCORE ANALYSIS (Per Pillar)                                 │        │
│  │                                                             │        │
│  │  E1: Market Awareness    → 4.2/10  → 🔴 CRITICAL            │        │
│  │  E2: Disruption Ready    → 6.8/10  → 🟡 NEEDS ATTENTION     │        │
│  │  E3: Competitive         → 7.5/10  → 🟢 ON TRACK            │        │
│  │  I1: Strategic Align     → 5.1/10  → 🟡 NEEDS ATTENTION     │        │
│  │  I2: Org Health          → 6.2/10  → 🟡 NEEDS ATTENTION     │        │
│  │  I3: Team Dynamics       → 8.1/10  → 🟢 ON TRACK            │        │
│  │  I4: Operations          → 7.8/10  → 🟢 ON TRACK            │        │
│  └─────────────────────────────────────────────────────────────┘        │
│           │                                                             │
│           ▼                                                             │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │  AI-GENERATED OKR PRIORITIES                                │        │
│  │                                                             │        │
│  │  Objective 1: "Build macro-economic monitoring capability"  │        │
│  │  ← Driven by E1 gap (4.2)                                   │        │
│  │                                                             │        │
│  │  Objective 2: "Strengthen strategic communication cascade"  │        │
│  │  ← Driven by I1 gap (5.1)                                   │        │
│  │                                                             │        │
│  │  Objective 3: "Improve organizational decision velocity"    │        │
│  │  ← Driven by I2 gap (6.2)                                   │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Industry Adaptation

The framework supports industry-specific weight adjustments:

| Industry | Adjusted Weights |
|----------|-----------------|
| **Manufacturing** | E1.3 (Supply Chain) +50%, I4.2 (Quality) +25% |
| **Professional Services** | I3.3 (Cross-Functional) +50%, E2.1 (Tech) +25% |
| **Retail** | E3.2 (Customer Value) +50%, I4.3 (Customer Sat) +25% |
| **Healthcare** | E1.2 (Regulatory) +75%, I4.2 (Quality) +50% |
| **Technology** | E2.1 (Tech Disruption) +50%, E2.2 (Business Model) +25% |

---

## Assessment Modes

### 1. Full VALUE Assessment (~78 questions, ~25 min)
- Annual deep dive
- All 7 pillars
- Full diagnostic report
- OKR generation ready

### 2. Quarterly Pulse (~15 questions, ~5 min)
- 2 questions per pillar
- Track trend over time
- Quick health check
- Flags significant changes

### 3. Legacy SSI Mode (~146 questions)
- Backward compatible
- Maps to I3 pillar
- Existing reports still work

---

## Implementation Phases (Sprint 7)

### Phase 1: Data Model (3h)
- Extend AssessmentQuestion model with pillar/category
- Add VALUE template type
- Migration script for existing questions

### Phase 2: Question Library (4h)
- Seed 78 VALUE questions
- Set up category relationships
- Configure inverse scoring

### Phase 3: Assessment UI (6h)
- Framework selector in Assessment Hub
- Pillar-based progress tracking
- Role-filtered questions

### Phase 4: Scoring & Reports (5h)
- Pillar-level score calculation
- VALUE diagnostic report
- OKR integration

### Phase 5: Testing (3h)
- Full assessment flow
- Report generation
- OKR generation from VALUE

**Total Estimate**: 21h (~21 story points)

---

## Open Questions for Sprint 7 Planning

1. **SSI Relationship**: Keep as separate option or fully migrate to VALUE I3?
2. **External Questions**: Leadership-only or allow all employees with role weighting?
3. **Industry Modules**: Pre-built for top 5 industries or admin-configurable?
4. **Pulse Frequency**: Quarterly or monthly option?

---

## Research Sources

- [McKinsey Organizational Health Index](https://www.mckinsey.com/solutions/orgsolutions/overview/organizational-health-index)
- [Baldrige Excellence Framework (NIST)](https://www.nist.gov/baldrige/publications/baldrige-excellence-framework)
- [APQC Process Classification Framework](https://www.apqc.org/process-frameworks)
- [MECE Framework Best Practices](https://caseinterview.com/mece)
- [Business Resilience Assessment](https://centricconsulting.com/blog/11-self-assessment-questions-to-help-your-business-become-more-resilient/)

---

*Design completed: December 1, 2025*
*Ready for Sprint 7 planning*
