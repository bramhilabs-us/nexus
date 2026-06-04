# Company Information Architecture for AI-Powered OKRs

**Sprint 18 Planning Document**
**Created**: March 9, 2026
**Purpose**: Define ALL information needed from a company for personalized OKR generation

---

## Executive Summary

This document catalogs every piece of company information needed for AI to generate excellent, personalized OKRs. Based on:
- **McKinsey 7-S Framework** (Strategy, Structure, Systems, Skills, Staff, Style, Shared Values)
- **OKR Best Practices** (Portfolio balance, MECE categories, gap-based targeting)
- **Karvia's ContextMaturityService** (13 weighted factors across 4 categories)
- **Sprint 17 Outcome Learning** (What worked, what didn't)

**Key Insight**: Get users to their **first personalized objective in <5 minutes** by collecting only the **minimum viable context** upfront, then progressively gathering more.

---

## Information Categories

### Overview: Who Provides What

| Category | Provider | Collection Method | Maturity Impact |
|----------|----------|-------------------|-----------------|
| **Company Profile** | User (forms) | Direct input | 25% weight |
| **Assessment Results** | User (questionnaire) | SSI completion | 20% weight |
| **Business Metrics** | User (forms) | Direct input | 25% weight |
| **Company Behavior** | System (observation) | Auto-tracked | 30% weight |

---

## Category 1: Company Profile (User-Provided)

**Purpose**: WHO you are and HOW you operate

### 1.1 Core Identity (Stage 0→1 Unlock)

| Field | Type | AI Impact | Priority | McKinsey Element |
|-------|------|-----------|----------|------------------|
| **Company Name** | Text | Low | Required | - |
| **Industry** | Select | High | Required | Strategy |
| **Industry Subtype** | Select | High | Required | Strategy |
| **Employee Count** | Number | Medium | Required | Staff |
| **Founded Year** | Number | Medium | Optional | - |

**Why These Matter**:
- Industry drives benchmark selection and category weighting
- Employee count affects goal scale ("hire 2 people" vs "hire 200")
- Founded year indicates maturity (startup vs established)

### 1.2 Business Model (Stage 1→2 Enhancement)

| Field | Type | AI Impact | Priority | McKinsey Element |
|-------|------|-----------|----------|------------------|
| **Business Description** | Textarea | High | High | Strategy |
| **Business Model** | Textarea | High | High | Systems |
| **Value Proposition** | Textarea | High | High | Strategy |
| **Primary Revenue Driver** | Text | High | High | Systems |
| **Client Profile** | Textarea | Medium | Medium | Strategy |
| **Fee Structure** | Select | Medium | Industry-specific | Systems |
| **Referral Source** | Select | Low | Optional | Systems |

**Why These Matter**:
- Business model determines KPI types (recurring vs project)
- Value proposition becomes objective alignment check
- Revenue driver focuses AI on what actually matters

### 1.3 Organizational Context (Stage 2+ Enhancement)

| Field | Type | AI Impact | Priority | McKinsey Element |
|-------|------|-----------|----------|------------------|
| **Mission Statement** | Textarea | Medium | Optional | Shared Values |
| **Vision Statement** | Textarea | Medium | Optional | Strategy |
| **Core Values** | Multi-select | Medium | Optional | Shared Values |
| **Target Market** | Textarea | Medium | Optional | Strategy |
| **Competitive Advantages** | Multi-text | Medium | Optional | Skills |
| **Key Challenges** | Multi-text | High | Medium | Strategy |

---

## Category 2: Assessment Results (User-Provided via Questionnaire)

**Purpose**: WHERE you are strong and weak (organizational capabilities)

### 2.1 SSI Assessment (12-Block Model)

**Collection**: Questionnaire responses (12 blocks, ~36 questions)
**Display**: Read-only results on Company Profile

| Dimension | Blocks | AI Impact | McKinsey Element |
|-----------|--------|-----------|------------------|
| **Speed** | Decision Velocity, Implementation Speed, Market Response, Innovation Cycle | Critical | Systems |
| **Strength** | Financial Resilience, Operational Capacity, Market Position, Team Capability | Critical | Structure, Staff |
| **Intelligence** | Data Utilization, Strategic Clarity, Learning Agility, Customer Insight | Critical | Skills, Style |

**Why This Matters**:
- Weak blocks become objective categories
- Block scores inform KR aggressiveness
- Example: Speed weak → "Reduce decision cycle from 14 days to 7 days"

### 2.2 Derived Insights (System-Calculated)

| Insight | Calculation | AI Impact |
|---------|-------------|-----------|
| **Overall SSI Score** | Weighted average of 3 dimensions | High |
| **Readiness Profile** | getting_started/developing/advanced/optimized | High |
| **Gap Analysis** | Top 3 weakest blocks | Critical |
| **Capability Profile** | Top 3 strongest blocks | Medium |

---

## Category 3: Business Metrics (User-Provided)

**Purpose**: Current performance and where you want to go

### 3.1 Financial Performance

| Metric | Type | AI Impact | Stage | Industry-Specific |
|--------|------|-----------|-------|-------------------|
| **Annual Revenue** | Currency | Critical | 0-1 | No |
| **Revenue Growth YoY %** | Percent | High | 1-2 | No |
| **Profit Margin %** | Percent | Medium | 2+ | No |
| **Top 5 Clients Revenue %** | Percent | Critical (Risk) | 1-2 | Partial |

**Concentration Risk Logic**:
- >50% in top 5 → Retention objectives prioritized over growth
- 30-50% → Balanced approach
- <30% → Growth objectives can be aggressive

### 3.2 Client Portfolio (Industry-Specific: Financial Services)

| Metric | Type | AI Impact | Stage |
|--------|------|-----------|-------|
| **Total Client Families** | Number | High | 1-2 |
| **Assets Under Management** | Currency | High | 1-2 |
| **Average Client Tenure** | Years | Medium | 2+ |
| **Client Retention Rate %** | Percent | High | 1-2 |

### 3.3 Risk Indicators (Industry-Specific: Financial Services)

| Metric | Type | AI Impact | Risk Flag |
|--------|------|-----------|-----------|
| **Clients Over 65 %** | Percent | Critical | >40% = high |
| **Next-Gen Engagement %** | Percent | High | <20% = risk |
| **Succession Plans Active** | Number | High | 0 = critical |

### 3.4 Operational Capacity

| Metric | Type | AI Impact | Stage |
|--------|------|-----------|-------|
| **Total Advisors/Staff** | Number | Medium | 1-2 |
| **Clients per Advisor** | Ratio | Medium | 2+ |
| **Average Advisor Age** | Years | Medium | 2+ |
| **Support Staff Count** | Number | Low | 2+ |

### 3.5 Target Metrics (Gap Analysis)

| Field | Purpose | AI Impact |
|-------|---------|-----------|
| **Target Revenue** | "From $X to $Y" KRs | Critical |
| **Target Growth %** | Validates realism | High |
| **Target Client Count** | Portfolio growth | High |
| **Target Retention %** | Retention focus | High |

**Why Targets Matter**:
- Enable specific KRs: "Increase revenue from $2M to $2.5M"
- AI checks historical trajectory: "8% growth target with -2% history = unrealistic"
- Gap = Objective opportunity

---

## Category 4: Strategic Vision (User-Provided)

**Purpose**: Where you want to go and what's blocking you

### 4.1 Priority Questions (McKinsey Discovery)

| Question | Field Name | AI Impact | Stage |
|----------|------------|-----------|-------|
| "What's your #1 priority for the next 12 months?" | `priority_one` | **CRITICAL** | 0-1 |
| "What's the biggest obstacle to achieving this?" | `biggest_blocker` | High | 1-2 |
| "If you could only accomplish ONE thing this year?" | `one_thing` | High | 1-2 |

**Why These Are Gold**:
- `priority_one` → First objective is ALWAYS about this
- `biggest_blocker` → AI can create objective to remove blocker
- `one_thing` → "Hero objective" that gets most resources

### 4.2 Strategic Context

| Field | Type | AI Impact | Stage |
|-------|------|-----------|-------|
| **Strategic Priorities** | Multi-text | High | 2+ |
| **Growth Aspirations** | Textarea | Medium | 2+ |
| **3-5 Year Vision** | Textarea | Medium | 2+ |

---

## Category 5: Company Behavior (System-Observed)

**Purpose**: How you actually operate (not what you say)

### 5.1 Platform Usage Patterns

| Behavior | What It Reveals | AI Impact | Stage |
|----------|-----------------|-----------|-------|
| **Task Completion Rate** | Execution capability | High | 2+ |
| **Average Task Velocity** | Speed of execution | High | 2+ |
| **Goal Achievement Rate** | Target realism | Critical | 3+ |
| **Login Frequency** | Engagement level | Medium | 2+ |

### 5.2 OKR History (Stage 3+)

| Behavior | What It Reveals | AI Impact |
|----------|-----------------|-----------|
| **Completed OKR Cycles** | Experience level | High |
| **Objective Categories Used** | Focus areas | High |
| **KR Achievement Rates** | Target calibration | Critical |
| **Common Variance Reasons** | Failure patterns | Critical |

### 5.3 Learning Data (Stage 3-4)

| Data Point | Source | AI Impact |
|------------|--------|-----------|
| **What Worked** | OKR outcomes | Critical |
| **What Didn't Work** | OKR outcomes | Critical |
| **Lessons Learned** | Outcome capture | High |
| **Success by Category** | Historical analysis | High |

---

## Stage-Based Information Collection

### Stage 0: Discovery (0-20% maturity)

**Goal**: Get to first personalized objective FAST

**Minimum Viable Context (5 fields)**:
1. Company Name (required)
2. Industry + Subtype (required)
3. Employee Count (required)
4. Annual Revenue (optional but high impact)
5. **#1 Priority** (required) ← THIS IS THE KEY

**Time to Complete**: <2 minutes
**First Personalized Objective**: Immediately after #1 Priority

**What AI Can Do**:
- Use industry benchmarks for category weighting
- Create objective around stated priority
- Suggest industry-typical KRs

### Stage 1: Assessment (20-45% maturity)

**Additional Information**:
1. Complete SSI Assessment (12 blocks)
2. Business Description + Model
3. Value Proposition
4. 3-5 Baseline Metrics
5. Biggest Blocker

**Time to Complete**: 15-30 minutes (with SSI)
**New AI Capabilities**:
- Gap-based objectives (weak SSI blocks)
- Specific "from X to Y" KRs
- Capability-aware targets

### Stage 2: Execution (45-65% maturity)

**System Observes**:
- Task completion patterns
- Velocity metrics
- Goal achievement rates

**Additional User Input**:
- Target metrics (gaps)
- Previous year metrics (trajectory)
- Strategic priorities

**New AI Capabilities**:
- Pattern-informed goal setting
- Realistic timeline recommendations
- Workload-aware task distribution

### Stage 3: Learning (65-80% maturity)

**System Observes**:
- OKR cycle outcomes
- Variance reasons
- What worked/didn't work

**New AI Capabilities**:
- Success pattern recognition
- Failure avoidance
- Lesson-informed recommendations
- Category success prediction

### Stage 4: Mastery (80-100% maturity)

**System Has**:
- Full behavioral history
- Multiple OKR cycles
- Rich outcome data
- Organizational patterns

**New AI Capabilities**:
- Predictive modeling
- Proactive recommendations
- Risk warnings
- Cross-cycle optimization

---

## Quick Path to First Personalized Objective

### The "2-Minute Win" Flow

```
Step 1: Industry Selection (30 sec)
├── Select industry from dropdown
├── Select subtype if applicable
└── AI loads industry benchmarks + SSI weights

Step 2: Size Context (15 sec)
├── Employee count
└── Annual revenue (optional)

Step 3: The Magic Question (60 sec)
└── "What's your #1 priority for the next 12 months?"
    ├── Free text input
    ├── OR select from industry suggestions
    └── AI parses intent immediately

Step 4: Generate First Objective (15 sec)
└── AI creates personalized objective based on:
    ├── Stated priority
    ├── Industry benchmarks
    ├── Size-appropriate scale
    └── 3-5 Key Results with industry-typical metrics
```

**Total Time**: <2 minutes to first personalized objective

### Progressive Engagement After First Win

| Action | Unlocks | Time |
|--------|---------|------|
| Complete SSI Assessment | Gap-based objectives | 15 min |
| Add 3 baseline metrics | "From X to Y" KRs | 3 min |
| Add biggest blocker | Blocker-removal objectives | 1 min |
| Complete first OKR cycle | Pattern learning | (ongoing) |
| Capture first outcome | Lesson-based recommendations | 5 min |

---

## Maturity Weight Mapping

### Current ContextMaturityService Weights

| Factor | Weight | Category | User/System |
|--------|--------|----------|-------------|
| Company description | 5% | Profile | User |
| Business model | 5% | Profile | User |
| Value proposition | 5% | Profile | User |
| Strategic priority (#1) | 10% | Profile | User |
| Baseline metrics (0-5) | 15% | Metrics | User |
| Target metrics | 10% | Metrics | User |
| SSI completed | 12% | Assessment | User |
| SSI recency (<6 mo) | 5% | Assessment | User |
| 12-block coverage | 3% | Assessment | User |
| OKR cycles completed | 8% | Historical | System |
| Task history depth | 7% | Historical | System |
| Outcome tracking | 8% | Historical | System |
| Lessons learned | 7% | Historical | System |

**Key Insight**:
- **User-provided** = 70% of maturity (Profile 25% + Metrics 25% + Assessment 20%)
- **System-observed** = 30% of maturity (Historical)

---

## Gamification Elements

### Stage Progression

| Stage | Badge | Reward |
|-------|-------|--------|
| 0 → 1 | "Profile Pioneer" | First personalized objective |
| 1 → 2 | "Assessment Achiever" | Gap-based recommendations |
| 2 → 3 | "Execution Expert" | Pattern-informed targets |
| 3 → 4 | "Learning Leader" | Predictive insights |
| 4 (sustained) | "Mastery Master" | Full AI capabilities |

### Quick Wins (Dopamine Triggers)

1. **Instant feedback** on #1 Priority → Objective appears
2. **Completion indicators** fill as fields are added
3. **Stage unlock animations** on progression
4. **AI confidence meter** shows "AI knows X% about your company"
5. **Weekly progress emails** showing maturity improvements

### Intrinsic Motivation Design

| Element | Purpose | Implementation |
|---------|---------|----------------|
| **Autonomy** | User controls pace | No forced completion |
| **Competence** | Show progress | Maturity ring, completion % |
| **Purpose** | Connect to outcomes | "This helps AI understand X" |
| **Relatedness** | Team context | Show team completion too |

---

## Implementation Priority for Sprint 18

### Epic 1: Minimum Viable Context (Quick Win)
- Industry + Subtype selector
- Employee count
- #1 Priority question
- → Generate first objective

### Epic 2: Profile Enhancement
- Business description/model (with AI impact badges)
- Value proposition
- Baseline metrics quick-input

### Epic 3: Maturity Visibility
- Stage indicator with progression
- Completion breakdown by category
- "What AI knows" summary

### Epic 4: Behavioral Transparency
- Show system-observed data
- Task completion patterns
- OKR history insights

---

## Summary: Complete Information Taxonomy

### User-Provided (70% of maturity)

| Category | Fields | Collection Time | Stage |
|----------|--------|-----------------|-------|
| Core Identity | 5 fields | 1 min | 0 |
| Business Model | 7 fields | 3 min | 0-1 |
| Org Context | 6 fields | 3 min | 1-2 |
| SSI Assessment | 12 blocks | 15 min | 1 |
| Financial Metrics | 4 fields | 2 min | 1-2 |
| Client Portfolio | 4 fields | 2 min | 1-2 |
| Risk Indicators | 3 fields | 1 min | 1-2 |
| Operations | 4 fields | 1 min | 2+ |
| Targets | 4 fields | 2 min | 2 |
| Strategic Vision | 5 fields | 3 min | 0-2 |

**Total**: ~44 fields, ~33 minutes for full completion

### System-Observed (30% of maturity)

| Category | Data Points | Collection | Stage |
|----------|-------------|------------|-------|
| Platform Usage | 4 metrics | Auto | 2+ |
| OKR History | 4 metrics | Auto | 3+ |
| Learning Data | 4 data points | Auto | 3-4 |

**Total**: 12 observed data points, collected automatically

---

**Document Version**: 1.0
**Last Updated**: March 9, 2026
**Next Step**: Create stage-based Company Profile mockup

