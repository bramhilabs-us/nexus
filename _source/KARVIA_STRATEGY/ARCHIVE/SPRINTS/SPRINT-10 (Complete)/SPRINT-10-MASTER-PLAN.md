# Sprint 10 Master Plan

**Sprint**: 10
**Created**: January 9, 2026
**Updated**: January 20, 2026 (Status Update)
**Total Story Points**: 71 pts (+7 from Audit + Architecture)
**Duration**: 2 weeks
**Status**: COMPLETE

---

## Sprint 10 Goal: Create Consultant Value

> **"Enable consultants to deliver a comprehensive SSI Diagnostic Report that demonstrates immediate value to Financial Services clients (Legacy/Succession) and flows seamlessly into OKR generation and planning."**

### The Consultant's Reality

The consultant is busy. They're juggling multiple clients, each with unique challenges. Karvia exists to **multiply their effectiveness**, not add to their workload.

**For Sprint 10, we focus on:**
1. **Credibility** - The SSI Diagnostic Report must impress the client executive
2. **Speed** - One assessment → Comprehensive insights → Actionable OKRs
3. **Customization** - Settings that let consultants tailor the experience per client

---

## Target Vertical: Financial Services - Legacy/Succession

**Client Profile:**
- Wealth management firms, family offices, succession planning consultants
- Concerned about: Client retention, advisor succession, compliance, AUM growth
- Decision makers: Firm principals, practice leaders

**Why This Vertical First:**
- High willingness to pay for strategic tools
- Clear metrics (AUM, retention rate, succession coverage)
- Consultants already serve this market

---

## Philosophical Framework

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CONSULTANT VALUE CREATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: CREDIBILITY (Sprint 10 Focus)
┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Assessment  │───▶│  SSI Diagnostic  │───▶│  OKR Generation  │
│ Questions   │    │  Report          │    │  (from SSI)      │
│             │    │  1-page or 3-page│    │                  │
│ Consultant  │    │  Executive ready │    │  Personalized    │
│ configures  │    │  Shareable PDF   │    │  to weak blocks  │
└─────────────┘    └──────────────────┘    └──────────────────┘
       │                   │                       │
       ▼                   ▼                       ▼
  Configuration       LLM Narrative           Target Calculator
   (weights)          (insights)              (exact numbers)

PHASE 2: VALUE DEMONSTRATION (Sprint 11)
┌─────────────┐    ┌──────────────────┐
│ Quarterly   │───▶│  Weekly Planning │
│ Goals       │    │  with Tasks      │
└─────────────┘    └──────────────────┘

PHASE 3: EXECUTION (Sprint 12)
┌─────────────┐    ┌──────────────────┐
│ Dashboard   │───▶│  Task Management │
│ & Tracking  │    │  & Progress      │
└─────────────┘    └──────────────────┘
```

---

## Epic Overview

| Epic | Points | Priority | Description | Specification |
|------|--------|----------|-------------|---------------|
| Epic S | 16 | P0 | **Configuration Page** - Industry presets, SSI weights, access controls, branding | [EPIC-S-CONFIGURATION.md](./EPIC-S-CONFIGURATION.md) |
| Epic R | 22 | P0 | **SSI Diagnostic Report** - 1-page exec, 3-page detailed, LLM | [EPIC-R-SSI-DIAGNOSTIC-REPORT.md](./EPIC-R-SSI-DIAGNOSTIC-REPORT.md) |
| Epic K | 33 (+7) | P0 | **Company Profile Redesign** - AI-ready context + Architecture Alignment (Decision 6) + Trajectory + Concentration + Data Provenance | [EPIC-K-COMPANY-PROFILE-REDESIGN.md](./EPIC-K-COMPANY-PROFILE-REDESIGN.md) |
| **Total** | **71** | | **(+7 from Audit + Architecture Decisions)** | |

### Epic Moved/Removed from Sprint 10

| Epic | Points | Moved To | Reason |
|------|--------|----------|--------|
| Epic J | 28 | Sprint 11 | Allows Epic K expansion; assessment already functional |
| Epic D | 35 | Sprint 12 | Dashboard is execution phase, not selling phase |
| Epic I | 20 | Sprint 12 | SSI Intelligence UI can follow diagnostic report |

### Epic K Redesign Note (January 10, 2026)

Epic K was expanded from "Business Metrics Profile" (10 pts) to "Company Profile Redesign" (28 pts) to capture comprehensive business context for AI-powered OKR generation. The redesign includes:
- **Tab 1: The Business** - How the company creates value
- **Tab 2: The Numbers** - Current state metrics with benchmarks + **Historical Trajectory**
- **Tab 3: The Vision** - 12-month targets and strategic priorities

This enables LLM to generate McKinsey-quality OKRs with specific numbers derived from the gap between current state and targets.

### Codebase Audit Enhancements (January 10, 2026) - +5 pts

Following a comprehensive codebase audit comparing Epic specs to actual implementation requirements, five critical design decisions were locked:

| # | Decision | Description | Points |
|---|----------|-------------|--------|
| 1 | **Historical Trajectory - Curated 8 Metrics** | Track YoY only for 8 key metrics (revenue, AUM, clients, retention, next-gen, succession, advisors, clients/advisor) | +1 (K1) |
| 2 | **Concentration Risk - Soft Prioritization** | When top 5 clients >50% revenue, suggest retention-first but allow user override | +1 (K6) |
| 3 | **OKR Feasibility - Tiered Validation** | Soft warnings for aggressive targets, auto-retry only for vague phrases | +1 (K8 new) |
| 4 | **Data Provenance** | Each metric tracks value, updated_at, source, updated_by | +1 (K1) |
| 5 | **Industry Validation Middleware** | Pre-save hook validates industry_subtype against config | +1 (K1) |

**Schema additions:**
- `industry_subtype` field on Company model
- `business_metrics` with provenance structure (value, updated_at, source, updated_by)
- `trajectory_metrics` array in industry config

**AI Enhancements:**
- Concentration risk priority override with user consent
- Vague phrase detection with auto-retry
- Stale data flagging (>90 days)

**Impact**: These decisions address all CRITICAL and HIGH severity findings from the audit, making Sprint 10 "investable" per McKinsey standards.

---

## Epic S: Configuration Page (16 pts)

> **Full specification**: [EPIC-S-CONFIGURATION.md](./EPIC-S-CONFIGURATION.md)

### Purpose

The consultant is the admin. They need control over:
1. **SSI Dimension Weights** - Default balance of Speed/Strength/Intelligence
2. **Access Controls** - Who can see what in their client's organization
3. **Report Branding** - Company logo on SSI reports

### Philosophy

Configuration is not about controlling people. Configuration is about:
- **Tailoring the experience** per client's needs
- **Reflecting the consultant's methodology** (some emphasize Speed, others Strength)
- **Managing information access** appropriately

---

### Story S1: Configuration Page Layout (5 pts)

**As a** consultant
**I want** a centralized configuration page for company settings
**So that** I can tailor Karvia to each client's needs

**Acceptance Criteria:**
- [ ] Configuration page accessible from main navigation (gear icon)
- [ ] Tab structure: General | SSI Weights | Access Controls | Branding
- [ ] Changes auto-save with visual confirmation
- [ ] Mobile responsive layout

**Wireframe:**
```
┌────────────────────────────────────────────────────────────────────┐
│  Configuration                                        [? Help]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────┬──────────────┬─────────────────┬──────────┐          │
│  │ General  │ SSI Weights  │ Access Controls │ Branding │          │
│  └──────────┴──────────────┴─────────────────┴──────────┘          │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                                                                ││
│  │   [Tab content displays here]                                  ││
│  │                                                                ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│                                            ✓ All changes auto-saved │
└────────────────────────────────────────────────────────────────────┘
```

---

### Story S2: SSI Weights with Industry Presets (6 pts)

**As a** consultant
**I want** industry-specific weight presets that I can customize
**So that** the SSI score reflects industry priorities while allowing my methodology adjustments

**Acceptance Criteria:**
- [ ] Industry preset dropdown based on company's industry/subtype
- [ ] Selecting preset auto-fills Speed/Strength/Intelligence weights
- [ ] Manual slider adjustment switches to "Custom" mode
- [ ] "Custom" badge shown when weights differ from preset
- [ ] Reset button returns to industry preset values
- [ ] Weights must total 100% (validation)
- [ ] Store both preset selection AND custom flag for iBrain training
- [ ] Weights apply to new assessments (existing unchanged)

**Key Presets:**
| Industry | Subtype | Speed | Strength | Intelligence |
|----------|---------|-------|----------|--------------|
| Financial Services | Legacy Succession | 30% | 40% | 30% |
| Technology | SaaS | 45% | 25% | 30% |
| Healthcare | Clinical | 25% | 35% | 40% |
| *Default* | *Any* | 33% | 33% | 34% |

**Wireframe:**
```
┌────────────────────────────────────────────────────────────────────┐
│  SSI Dimension Weights                                              │
│                                                                     │
│  "Industry presets provide research-backed starting weights.        │
│   Customize to match your methodology."                             │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ Industry Preset                                                 ││
│  │ ┌────────────────────────────────────────────────────────────┐ ││
│  │ │ Financial Services - Legacy Succession                  ▼  │ ││
│  │ └────────────────────────────────────────────────────────────┘ ││
│  │ Recommended: Speed 30% | Strength 40% | Intelligence 30%       ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │  Current Weights                         [Custom] [Reset]       ││
│  │  ────────────────────────────────────────────────────────────  ││
│  │                                                                ││
│  │  Speed          ████████████░░░░░░░░░░░░░░░░░░░░  30%         ││
│  │  Strength       ████████████████░░░░░░░░░░░░░░░░  40%         ││
│  │  Intelligence   ████████████░░░░░░░░░░░░░░░░░░░░  30%         ││
│  │                                                                ││
│  │                                            Total: 100% ✓       ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ⓘ Both preset selection and custom adjustments are stored for    │
│    future iBrain analysis.                                         │
└────────────────────────────────────────────────────────────────────┘
```

---

### Story S3: Access Controls (3 pts)

**As a** consultant
**I want** to control who can view SSI reports and OKRs
**So that** sensitive information is shared appropriately

**Acceptance Criteria:**
- [ ] Role-based visibility settings
- [ ] Options: All users | Managers+ | Executives only | Consultant only
- [ ] Separate settings for: SSI Report, OKRs, Weekly Plans
- [ ] Clear explanation of each access level

**Wireframe:**
```
┌────────────────────────────────────────────────────────────────────┐
│  Access Controls                                                    │
│                                                                     │
│  "Control who can see different parts of the system."              │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ SSI Diagnostic Report                                          ││
│  │ ┌──────────────────────────────────────────────────────────┐   ││
│  │ │ ○ All users  ● Executives only  ○ Consultant only        │   ││
│  │ └──────────────────────────────────────────────────────────┘   ││
│  │                                                                ││
│  │ OKRs and Objectives                                            ││
│  │ ┌──────────────────────────────────────────────────────────┐   ││
│  │ │ ● All users  ○ Managers+  ○ Executives only              │   ││
│  │ └──────────────────────────────────────────────────────────┘   ││
│  │                                                                ││
│  │ Weekly Plans and Tasks                                         ││
│  │ ┌──────────────────────────────────────────────────────────┐   ││
│  │ │ ● All users  ○ Own team only                              │   ││
│  │ └──────────────────────────────────────────────────────────┘   ││
│  └────────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

---

### Story S4: Report Branding (2 pts)

**As a** consultant
**I want** to add my client's logo to SSI reports
**So that** the report feels like theirs, not a generic template

**Acceptance Criteria:**
- [ ] Logo upload (PNG/JPG, max 1MB)
- [ ] Logo preview on settings page
- [ ] Logo appears on PDF report header
- [ ] Default: Karvia logo if none uploaded

---

## Epic R: SSI Diagnostic Report (22 pts)

> **Full specification**: [EPIC-R-SSI-DIAGNOSTIC-REPORT.md](./EPIC-R-SSI-DIAGNOSTIC-REPORT.md)

### Purpose

The SSI Diagnostic Report is the **crown jewel of Phase 1**. This is what the consultant shares with the client executive to demonstrate value.

### Philosophy

**One-Page Executive Overview**: For the busy CEO who wants the bottom line
**Three-Page Detailed Report**: For the operations team who wants actionable insights

Both formats must be:
- **Printable** as PDF
- **Shareable** via link
- **Professional** looking
- **Data-driven** with exact numbers

---

### Story R1: One-Page Executive Overview (8 pts)

**As a** consultant
**I want** a one-page SSI summary for executives
**So that** I can demonstrate value in a single glance

**Acceptance Criteria:**
- [ ] Overall SSI score prominently displayed
- [ ] Speed/Strength/Intelligence breakdown with visual bars
- [ ] Top 3 strengths (highest scoring blocks)
- [ ] Top 3 opportunities (lowest scoring blocks)
- [ ] LLM-generated executive summary (2-3 sentences)
- [ ] Industry comparison if available
- [ ] PDF export with branding
- [ ] Shareable link option

**Wireframe:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SSI DIAGNOSTIC REPORT                                    │
│                     ABC Wealth Advisors                                      │
│                     [Logo]                         January 9, 2026           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │        OVERALL SSI SCORE                                                ││
│  │                                                                         ││
│  │              ┌───────────┐                                              ││
│  │              │           │                                              ││
│  │              │    68     │    "Your organization demonstrates           ││
│  │              │   /100    │     moderate operational maturity with       ││
│  │              │           │     significant opportunity in client        ││
│  │              └───────────┘     acquisition and retention processes."    ││
│  │                                                                         ││
│  │  ─────────────────────────────────────────────────────────────────────  ││
│  │                                                                         ││
│  │  SPEED              STRENGTH           INTELLIGENCE                     ││
│  │  ██████████░░  65   ████████░░░░  58   ██████████████  72               ││
│  │  Delivery pace      Operational        Strategic                        ││
│  │                     resilience         insight                          ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────┐  ┌────────────────────────────────────┐│
│  │ TOP STRENGTHS                   │  │ TOP OPPORTUNITIES                  ││
│  │                                 │  │                                    ││
│  │ 1. Strategic Planning (82)     │  │ 1. Client Acquisition (45)        ││
│  │    Strong vision alignment     │  │    Lead conversion needs work     ││
│  │                                 │  │                                    ││
│  │ 2. Data Analytics (78)         │  │ 2. Change Management (52)         ││
│  │    Good use of insights        │  │    Slow adaptation to change      ││
│  │                                 │  │                                    ││
│  │ 3. Quality Control (75)        │  │ 3. Response Time (55)             ││
│  │    Consistent standards        │  │    Client queries take too long   ││
│  └─────────────────────────────────┘  └────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ INDUSTRY COMPARISON: Financial Services - Wealth Management             ││
│  │ Your Score: 68 | Industry Average: 62 | Top Quartile: 78               ││
│  │ ████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ───────────────────────────────────────────────────────────────────────────│
│  Prepared by: Karvia Business Intelligence      [Download PDF] [Share Link] │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Story R2: Three-Page Detailed Report (8 pts)

**As a** consultant
**I want** a comprehensive SSI report with block-level detail
**So that** I can guide the operations team on specific improvements

**Acceptance Criteria:**
- [ ] Page 1: Executive summary (same as one-page)
- [ ] Page 2: 12-block breakdown with scores and insights
- [ ] Page 3: Recommended next steps (LLM-generated)
- [ ] Each block shows: Score, Benchmark, Gap, Key insight
- [ ] LLM-generated recommendations per weak block
- [ ] PDF export and shareable link

**Wireframe - Page 2:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SSI DIAGNOSTIC REPORT - DETAILED ANALYSIS (Page 2 of 3)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SPEED DIMENSION (Score: 65)                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Block           Score   Benchmark   Gap     Insight                     ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ Delivery         72       70        +2     Meeting project deadlines    ││
│  │ Decisions        68       65        +3     Good decision velocity       ││
│  │ Change Mgmt      52       60        -8     ⚠ Slow change adaptation    ││
│  │ Response Time    55       55         0     Client response average     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  STRENGTH DIMENSION (Score: 58)                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Block           Score   Benchmark   Gap     Insight                     ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ Financial        62       68        -6     Revenue stability needs work ││
│  │ Operations       65       60        +5     Solid operational base      ││
│  │ People           48       55        -7     ⚠ Team retention concerns   ││
│  │ Quality          75       65       +10     ★ Strength: High standards  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  INTELLIGENCE DIMENSION (Score: 72)                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Block           Score   Benchmark   Gap     Insight                     ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ Market           65       70        -5     Competitive awareness gap   ││
│  │ Data             78       72        +6     ★ Good analytics usage      ││
│  │ Strategy         82       75        +7     ★ Strong vision alignment   ││
│  │ Learning         58       60        -2     Continuous improvement OK   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Legend: ★ Top strength   ⚠ Priority opportunity                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Wireframe - Page 3:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SSI DIAGNOSTIC REPORT - RECOMMENDED NEXT STEPS (Page 3 of 3)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Based on your assessment, here are recommended focus areas:                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ PRIORITY 1: Client Acquisition (Score: 45)                              ││
│  │ ─────────────────────────────────────────────────────────────────────── ││
│  │                                                                         ││
│  │ Current State: Your lead-to-client conversion is below industry        ││
│  │ average. New client acquisition costs are 40% higher than benchmark.   ││
│  │                                                                         ││
│  │ Recommended Actions:                                                    ││
│  │ • Implement structured referral program with existing clients          ││
│  │ • Reduce average sales cycle from 45 days to 30 days                   ││
│  │ • Establish clear qualification criteria for prospects                  ││
│  │                                                                         ││
│  │ Suggested OKR:                                                          ││
│  │ "Increase new client acquisition from 3/month to 5/month (67%↑)"       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ PRIORITY 2: Change Management (Score: 52)                               ││
│  │ ─────────────────────────────────────────────────────────────────────── ││
│  │                                                                         ││
│  │ Current State: Organization struggles to adapt to market changes.      ││
│  │ Process updates take 3x longer than industry average.                  ││
│  │                                                                         ││
│  │ Recommended Actions:                                                    ││
│  │ • Establish quarterly process review cadence                           ││
│  │ • Create change champion network across teams                          ││
│  │ • Implement small pilot → rollout pattern for changes                  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ PRIORITY 3: People & Retention (Score: 48)                              ││
│  │ ─────────────────────────────────────────────────────────────────────── ││
│  │                                                                         ││
│  │ Current State: Advisor retention is 72% vs industry benchmark of 85%.  ││
│  │ Succession planning coverage is limited.                                ││
│  │                                                                         ││
│  │ Recommended Actions:                                                    ││
│  │ • Develop formal succession plan for key advisors                      ││
│  │ • Implement quarterly retention check-ins                              ││
│  │ • Create career progression framework                                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ───────────────────────────────────────────────────────────────────────────│
│  Ready to act? [Generate OKRs from this Report →]                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Story R3: LLM Narrative Generation (3 pts)

**As a** consultant
**I want** AI-generated insights in the diagnostic report
**So that** the report provides strategic context, not just numbers

**Acceptance Criteria:**
- [ ] Executive summary generated from assessment data
- [ ] Top 3 risks and opportunities identified
- [ ] Per-block insights generated for weak areas
- [ ] Recommended actions generated for priority blocks
- [ ] Model: gpt-4o-mini for consistency
- [ ] Prompt includes industry context (Financial Services)
- [ ] Stored in SSIDiagnosticReport for reuse

**Implementation:**
```javascript
// server/services/diagnostic/DiagnosticNarrativeService.js
async function generateNarrative(assessmentData, companyContext) {
  const prompt = buildDiagnosticPrompt(assessmentData, companyContext);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: DIAGNOSTIC_SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

---

### Story R4: PDF Export (2 pts)

**As a** consultant
**I want** to download the SSI report as a PDF
**So that** I can share it with clients who prefer documents

**Acceptance Criteria:**
- [ ] One-page PDF option
- [ ] Three-page PDF option
- [ ] Client logo in header
- [ ] Professional formatting
- [ ] Print-friendly layout

---

### Story R5: Shareable Link (1 pt)

**As a** consultant
**I want** to share the SSI report via a link
**So that** clients can view it without logging in

**Acceptance Criteria:**
- [ ] Generate unique share link
- [ ] Link expires after 30 days
- [ ] View-only access (no edit)
- [ ] Track link views

---

## Epic J: Assessment Credibility (28 pts)

> **Full specification**: [EPIC-J-ASSESSMENT-CREDIBILITY.md](./EPIC-J-ASSESSMENT-CREDIBILITY.md)

### Core Focus

The assessment must produce reliable 12-block scores. This requires:
1. **Modular questions** - Core (guaranteed coverage) + Industry + Role
2. **Template creation** - Simple 3-step wizard
3. **Block coverage validation** - Warning if blocks are missing

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| J1 | 5 | Module system database schema |
| J2 | 3 | Core questions seed (24 questions, 2 per block) |
| J3 | 3 | Financial Services industry questions (6 questions) |
| J4 | 2 | Role questions (executive, manager - 8 questions) |
| J5 | 5 | Module-filtered questions API |
| J6 | 6 | Step 1: Select Questions UI |
| J7 | 2 | Step 2: Configure Template UI |
| J8 | 2 | Step 3: Review & Save UI |

*Detailed specs remain in original plan - see Epic J section above*

---

## Epic K: Business Metrics (10 pts)

> **Full specification**: [EPIC-K-BUSINESS-METRICS-PROFILE.md](./EPIC-K-BUSINESS-METRICS-PROFILE.md)

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| K1 | 3 | Add business_metrics field to Company model |
| K2 | 2 | Financial Services metrics config (AUM, retention, clients) |
| K3 | 3 | Profile UI: Business Metrics section |
| K4 | 2 | Autosave and validation |

---

## Implementation Order (2.5 Weeks)

### Week 1: Foundation + Assessment

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 1 | S1, S2 | 11 | Configuration page + SSI weights with industry presets |
| 2 | S3, S4 | 5 | Access controls + branding |
| 3 | J1, J2, J3 | 11 | Schema + Core + Financial Services questions |
| 4 | J4, J5 | 7 | Role questions + API |
| 5 | J6 | 6 | Step 1 UI |
| **Week 1** | **S1-S4, J1-J6** | **40** | **Configuration + Assessment backend + UI start** |

### Week 2: Assessment UI + Report

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 6 | J7, J8 | 4 | Steps 2 & 3 UI |
| 7 | R1 | 8 | One-page executive overview |
| 8 | R2 | 8 | Three-page detailed report |
| 9 | R3 | 3 | LLM narrative generation |
| 10 | R4, R5 | 3 | PDF export + shareable link |
| **Week 2** | **J7-J8, R1-R5** | **26** | **Assessment complete + SSI Report** |

### Week 2.5: Business Metrics

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 11-12 | K1-K4 | 10 | Business metrics for Financial Services |
| **Week 2.5** | **K1-K4** | **10** | **Baseline values ready for OKR** |

**Total: 76 pts over 2.5 weeks (~30 pts/week)**

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Consultant can generate SSI report in < 5 clicks | Yes |
| One-page report fits on single printed page | Yes |
| LLM narrative generation < 5 seconds | Yes |
| 12-block coverage in core questions | 100% |
| Financial Services industry questions available | Yes |

---

## What Moved to Sprint 12

| Epic | Points | Reason |
|------|--------|--------|
| Epic D: Dashboard & Task Management | 35 | Execution phase, not selling phase |
| Epic I: SSI Intelligence UI | 20 | Can follow after diagnostic report proves value |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM narrative quality | Medium | Use structured prompts, test with real data |
| PDF generation complexity | Medium | Use proven library (puppeteer/pdf-lib) |
| Settings complexity creep | Low | Lock to core features only |

---

## Related Documents

- [DATA-FLOW-BEFORE-AFTER.md](../SPRINT-12 (Planned)/DATA-FLOW-BEFORE-AFTER.md) - Complete data flow
- [EPIC-K-BUSINESS-METRICS-PROFILE.md](./EPIC-K-BUSINESS-METRICS-PROFILE.md) - Business metrics detail
- [RVW-20260109-003-audit.md](/.codex/reviews/reports/RVW-20260109-003-audit.md) - LLM audit findings

---

**Plan Owner**: Product Team
**Target Vertical**: Financial Services - Legacy/Succession
**Sprint Target**: January 9-24, 2026
