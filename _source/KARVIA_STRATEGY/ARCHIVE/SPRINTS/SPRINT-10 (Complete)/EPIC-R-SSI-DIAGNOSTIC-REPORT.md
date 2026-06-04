# Epic R: SSI Diagnostic Report

**Epic**: R
**Sprint**: 10
**Story Points**: 22
**Priority**: P0
**Status**: PLANNING

---

## Purpose

The SSI Diagnostic Report is the **crown jewel of Phase 1**. This is what the consultant shares with the client executive to demonstrate immediate value.

**Philosophy**: The report must answer "So what?" for an executive in 60 seconds.

---

## Target Users

| User | Need | Format |
|------|------|--------|
| CEO/Executive | Quick understanding of org health | One-page executive overview |
| Operations Team | Actionable improvement areas | Three-page detailed report |
| Consultant | Shareable deliverable | PDF + shareable link |

---

## Report Formats

### Format 1: One-Page Executive Overview

For the busy CEO who wants the bottom line in 60 seconds.

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

### Format 2: Three-Page Detailed Report

For the operations team who wants actionable insights.

**Page 1**: Executive summary (same as one-page)
**Page 2**: 12-block breakdown with scores and insights
**Page 3**: Recommended next steps with suggested OKRs

---

## Stories

| Story | Points | Description |
|-------|--------|-------------|
| R1 | 8 | One-page executive overview |
| R2 | 8 | Three-page detailed report |
| R3 | 3 | LLM narrative generation |
| R4 | 2 | PDF export |
| R5 | 1 | Shareable link |
| **Total** | **22** | |

---

## Story R1: One-Page Executive Overview (8 pts)

### User Story

**As a** consultant
**I want** a one-page SSI summary for executives
**So that** I can demonstrate value in a single glance

### Acceptance Criteria

- [ ] Overall SSI score prominently displayed (large number)
- [ ] Speed/Strength/Intelligence breakdown with visual bars
- [ ] Top 3 strengths (highest scoring blocks)
- [ ] Top 3 opportunities (lowest scoring blocks)
- [ ] LLM-generated executive summary (2-3 sentences)
- [ ] Industry comparison bar (if industry data available)
- [ ] Company logo in header (from branding settings)
- [ ] PDF export button
- [ ] Shareable link button
- [ ] Print-friendly layout (fits on one page)

### Data Requirements

| Field | Source | Required |
|-------|--------|----------|
| Overall SSI score | Assessment.overall_score | Yes |
| Dimension scores | Assessment.speed/strength/intelligence_score | Yes |
| 12-block scores | Assessment.detailed_block_scores | Yes |
| Executive summary | LLM generation (Story R3) | Yes |
| Industry benchmark | Industries.js config | No |
| Company logo | Company.branding.logo_url | No |

### Component Structure

```javascript
// client/components/ssi-report/executive-overview.js
class ExecutiveOverview {
  constructor(assessmentData, companyData) {
    this.assessment = assessmentData;
    this.company = companyData;
  }

  render() {
    return `
      <div class="report-header">
        ${this.renderLogo()}
        ${this.renderTitle()}
      </div>
      <div class="report-body">
        ${this.renderOverallScore()}
        ${this.renderDimensionBreakdown()}
        ${this.renderStrengthsOpportunities()}
        ${this.renderIndustryComparison()}
      </div>
      <div class="report-footer">
        ${this.renderActions()}
      </div>
    `;
  }

  getTopStrengths(count = 3) {
    return this.getSortedBlocks('desc').slice(0, count);
  }

  getTopOpportunities(count = 3) {
    return this.getSortedBlocks('asc').slice(0, count);
  }
}
```

### Technical Implementation

**Page URL**: `/pages/ssi-diagnostic.html?assessment_id=xxx`

**API Endpoint**: `GET /api/assessments/:id/diagnostic-report`

Response:
```json
{
  "success": true,
  "data": {
    "assessment": {
      "id": "xxx",
      "created_at": "2026-01-09",
      "overall_score": 68,
      "speed_score": 65,
      "strength_score": 58,
      "intelligence_score": 72,
      "detailed_block_scores": {
        "speed": {
          "delivery": { "score": 72, "benchmark": 70 },
          "decisions": { "score": 68, "benchmark": 65 },
          "change": { "score": 52, "benchmark": 60 },
          "response": { "score": 55, "benchmark": 55 }
        },
        "strength": { /* ... */ },
        "intelligence": { /* ... */ }
      }
    },
    "narrative": {
      "executive_summary": "Your organization demonstrates...",
      "top_risks": ["..."],
      "top_opportunities": ["..."]
    },
    "industry_benchmark": {
      "average": 62,
      "top_quartile": 78
    }
  }
}
```

---

## Story R2: Three-Page Detailed Report (8 pts)

### User Story

**As a** consultant
**I want** a comprehensive SSI report with block-level detail
**So that** I can guide the operations team on specific improvements

### Acceptance Criteria

- [ ] Page 1: Executive summary (same as one-page)
- [ ] Page 2: 12-block breakdown table with columns: Block, Score, Benchmark, Gap, Insight
- [ ] Page 3: Recommended next steps with suggested OKRs (LLM-generated)
- [ ] Each block shows: Score, Industry benchmark, Gap, Key insight
- [ ] Visual indicators: Star for top strength, Warning for priority opportunity
- [ ] LLM-generated recommendations per weak block
- [ ] PDF export and shareable link
- [ ] Table of contents with page numbers

### Page 2 Wireframe: Detailed Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SSI DIAGNOSTIC REPORT - DETAILED ANALYSIS (Page 2 of 3)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SPEED DIMENSION (Score: 65)                                                 │
│  "How fast your organization makes decisions and implements changes"        │
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
│  "Your operational resilience and financial stability"                       │
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
│  "Your strategic insight and data-driven decision making"                    │
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
│  Legend: ★ Top strength (score ≥75)   ⚠ Priority opportunity (gap ≤-5)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Page 3 Wireframe: Recommended Next Steps

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
│  │ Current State:                                                          ││
│  │ Your lead-to-client conversion is below industry average. New client   ││
│  │ acquisition costs are 40% higher than benchmark.                        ││
│  │                                                                         ││
│  │ Recommended Actions:                                                    ││
│  │ • Implement structured referral program with existing clients          ││
│  │ • Reduce average sales cycle from 45 days to 30 days                   ││
│  │ • Establish clear qualification criteria for prospects                  ││
│  │                                                                         ││
│  │ Suggested OKR:                                                          ││
│  │ ┌─────────────────────────────────────────────────────────────────────┐││
│  │ │ Objective: Accelerate Client Acquisition                            │││
│  │ │ KR1: Increase new clients from 3/month to 5/month (67%↑)           │││
│  │ │ KR2: Reduce acquisition cost from $2,400 to $1,800 (25%↓)          │││
│  │ │ KR3: Improve lead conversion from 8% to 12%                         │││
│  │ └─────────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ PRIORITY 2: People & Retention (Score: 48)                              ││
│  │ ─────────────────────────────────────────────────────────────────────── ││
│  │                                                                         ││
│  │ Current State:                                                          ││
│  │ Advisor retention is 72% vs industry benchmark of 85%. Succession      ││
│  │ planning coverage is limited.                                           ││
│  │                                                                         ││
│  │ Recommended Actions:                                                    ││
│  │ • Develop formal succession plan for key advisors                      ││
│  │ • Implement quarterly retention check-ins                              ││
│  │ • Create career progression framework                                   ││
│  │                                                                         ││
│  │ Suggested OKR:                                                          ││
│  │ ┌─────────────────────────────────────────────────────────────────────┐││
│  │ │ Objective: Strengthen Team Retention                                │││
│  │ │ KR1: Improve advisor retention from 72% to 85%                      │││
│  │ │ KR2: Complete succession plans for 100% of key advisors            │││
│  │ │ KR3: Reduce voluntary turnover by 50%                               │││
│  │ └─────────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ───────────────────────────────────────────────────────────────────────────│
│  Ready to act? [Generate OKRs from this Report →]                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**View Toggle**: One-page vs Three-page
```html
<div class="report-view-toggle">
  <button class="active" data-view="one-page">Executive Overview</button>
  <button data-view="three-page">Detailed Report</button>
</div>
```

**Page Navigation for 3-page view**:
```html
<div class="report-pagination">
  <button data-page="1" class="active">1. Executive Summary</button>
  <button data-page="2">2. Detailed Analysis</button>
  <button data-page="3">3. Next Steps</button>
</div>
```

---

## Story R3: LLM Narrative Generation (3 pts)

### User Story

**As a** consultant
**I want** AI-generated insights in the diagnostic report
**So that** the report provides strategic context, not just numbers

### Acceptance Criteria

- [ ] Executive summary generated from assessment data (2-3 sentences)
- [ ] Top 3 risks identified from weak blocks
- [ ] Top 3 opportunities identified
- [ ] Per-block insights generated for weak areas (score < 60)
- [ ] Recommended actions generated for priority blocks (top 3 weakest)
- [ ] Suggested OKRs with KRs for each priority block
- [ ] Model: gpt-4o-mini for consistency
- [ ] Prompt includes industry context (Financial Services)
- [ ] Narrative stored in DiagnosticReport for reuse
- [ ] Graceful fallback if LLM unavailable

### Prompt Design

```javascript
// server/services/diagnostic/DiagnosticNarrativeService.js

const SYSTEM_PROMPT = `You are a business strategy advisor analyzing an SSI (Speed, Strength, Intelligence) assessment.
Your role is to:
1. Summarize ONLY the provided data - do not make assumptions
2. Identify risks and opportunities based on score gaps
3. Recommend specific, actionable improvements
4. Suggest OKRs with measurable key results

Output must be valid JSON. Be concise and executive-focused.`;

async function generateNarrative(assessmentData, companyContext) {
  const userPrompt = `
## Company Context
- Name: ${companyContext.name}
- Industry: ${companyContext.industry} (${companyContext.industry_subtype || 'general'})
- Employee Count: ${companyContext.employee_count || 'Unknown'}

## Assessment Results
- Overall SSI Score: ${assessmentData.overall_score}/100
- Speed: ${assessmentData.speed_score}/100
- Strength: ${assessmentData.strength_score}/100
- Intelligence: ${assessmentData.intelligence_score}/100

## 12-Block Breakdown
${formatBlockScores(assessmentData.detailed_block_scores)}

## Business Metrics (if available)
${formatBusinessMetrics(companyContext.business_metrics)}

Generate a JSON response with:
{
  "executive_summary": "2-3 sentence summary for CEO",
  "top_risks": [
    { "block": "block_name", "risk": "description", "impact": "business impact" }
  ],
  "top_opportunities": [
    { "block": "block_name", "opportunity": "description", "potential": "business potential" }
  ],
  "priority_recommendations": [
    {
      "block": "block_name",
      "current_state": "description",
      "actions": ["action1", "action2", "action3"],
      "suggested_okr": {
        "objective": "objective title",
        "key_results": ["KR1", "KR2", "KR3"]
      }
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1500
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### Storage

**DiagnosticReport Model Extension**:
```javascript
// server/models/DiagnosticReport.js
llm_narrative: {
  executive_summary: String,
  top_risks: [{
    block: String,
    risk: String,
    impact: String
  }],
  top_opportunities: [{
    block: String,
    opportunity: String,
    potential: String
  }],
  priority_recommendations: [{
    block: String,
    current_state: String,
    actions: [String],
    suggested_okr: {
      objective: String,
      key_results: [String]
    }
  }],
  generated_at: Date,
  model_used: String
}
```

### Fallback Behavior

If LLM is unavailable:
```javascript
function generateFallbackNarrative(assessmentData) {
  const weakBlocks = getWeakBlocks(assessmentData, 3);
  const strongBlocks = getStrongBlocks(assessmentData, 3);

  return {
    executive_summary: `Your organization scored ${assessmentData.overall_score}/100 on the SSI assessment. Key strengths include ${strongBlocks[0].block} and ${strongBlocks[1].block}. Areas for improvement include ${weakBlocks[0].block} and ${weakBlocks[1].block}.`,
    top_risks: weakBlocks.map(b => ({
      block: b.block,
      risk: `Below benchmark by ${Math.abs(b.gap)} points`,
      impact: 'Potential competitive disadvantage'
    })),
    top_opportunities: strongBlocks.map(b => ({
      block: b.block,
      opportunity: `Above benchmark by ${b.gap} points`,
      potential: 'Leverage as competitive advantage'
    })),
    priority_recommendations: [] // Empty - no LLM recommendations
  };
}
```

---

## Story R4: PDF Export (2 pts)

### User Story

**As a** consultant
**I want** to download the SSI report as a PDF
**So that** I can share it with clients who prefer documents

### Acceptance Criteria

- [ ] One-page PDF option (single page, print-ready)
- [ ] Three-page PDF option (full report)
- [ ] Client logo in header
- [ ] Professional formatting with consistent fonts
- [ ] File name: `SSI-Report-{CompanyName}-{Date}.pdf`
- [ ] Download triggers immediately on button click

### Technical Implementation

**Option 1: Client-Side PDF (html2pdf.js)**
```javascript
// client/js/pdf-export.js
async function exportToPDF(format = 'one-page') {
  const element = document.getElementById(
    format === 'one-page' ? 'executive-overview' : 'full-report'
  );

  const opt = {
    margin: 0.5,
    filename: `SSI-Report-${companyName}-${formatDate(new Date())}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(element).save();
}
```

**Option 2: Server-Side PDF (puppeteer)**
```javascript
// server/services/pdf/ReportPDFService.js
async function generateReportPDF(assessmentId, format) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Render the report HTML
  await page.goto(`${baseUrl}/api/reports/render/${assessmentId}?format=${format}`);

  const pdf = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' }
  });

  await browser.close();
  return pdf;
}
```

**Recommendation**: Use client-side (html2pdf.js) for simplicity. Server-side only if client-side quality is insufficient.

---

## Story R5: Shareable Link (1 pt)

### User Story

**As a** consultant
**I want** to share the SSI report via a link
**So that** clients can view it without logging in

### Acceptance Criteria

- [ ] Generate unique share link on button click
- [ ] Link expires after 30 days (configurable)
- [ ] View-only access (no edit, no navigation to other pages)
- [ ] Track link views (view count, last viewed)
- [ ] Copy link to clipboard with confirmation toast
- [ ] Revoke link option

### Technical Implementation

**ShareLink Model**:
```javascript
// server/models/ShareLink.js
const ShareLinkSchema = new mongoose.Schema({
  report_type: {
    type: String,
    enum: ['ssi_diagnostic', 'okr_summary'],
    required: true
  },
  report_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  expires_at: {
    type: Date,
    required: true
  },
  view_count: {
    type: Number,
    default: 0
  },
  last_viewed_at: Date,
  is_revoked: {
    type: Boolean,
    default: false
  }
});
```

**Endpoints**:
```javascript
// Create share link
POST /api/share-links
{ report_type: 'ssi_diagnostic', report_id: 'xxx', expires_in_days: 30 }

// View shared report (public - no auth)
GET /api/shared/:token

// Revoke link
DELETE /api/share-links/:id
```

**Public View Page**: `/pages/shared-report.html?token=xxx`

---

## File Structure

### Files to Create

| File | Purpose |
|------|---------|
| `client/pages/ssi-diagnostic.html` | Main report page |
| `client/js/ssi-diagnostic.js` | Report page controller |
| `client/components/ssi-report/executive-overview.js` | One-page component |
| `client/components/ssi-report/detailed-analysis.js` | Page 2 component |
| `client/components/ssi-report/next-steps.js` | Page 3 component |
| `client/js/pdf-export.js` | PDF generation |
| `client/pages/shared-report.html` | Public share view |
| `server/services/diagnostic/DiagnosticNarrativeService.js` | LLM narrative |
| `server/models/ShareLink.js` | Share link model |
| `server/routes/share-links.js` | Share link endpoints |

### Files to Modify

| File | Changes |
|------|---------|
| `server/routes/assessments.js` | Add diagnostic-report endpoint |
| `server/models/DiagnosticReport.js` | Add llm_narrative field |
| `client/js/navigation.js` | Add SSI Diagnostic link |

---

## API Endpoints

### GET /api/assessments/:id/diagnostic-report

Returns complete diagnostic report data.

**Response**:
```json
{
  "success": true,
  "data": {
    "assessment": { /* assessment data */ },
    "company": { /* company context */ },
    "narrative": { /* LLM-generated narrative */ },
    "industry_benchmark": { /* if available */ }
  }
}
```

### POST /api/assessments/:id/generate-narrative

Triggers LLM narrative generation (or regeneration).

**Response**:
```json
{
  "success": true,
  "data": {
    "narrative": { /* generated narrative */ },
    "generated_at": "2026-01-09T12:00:00Z"
  }
}
```

---

## Testing Requirements

### Unit Tests

- [ ] Narrative generation prompt formatting
- [ ] Block sorting (strengths/opportunities)
- [ ] Fallback narrative when LLM unavailable
- [ ] Share link token generation
- [ ] Share link expiration check

### Integration Tests

- [ ] Complete diagnostic report API response
- [ ] LLM narrative generation and storage
- [ ] Share link creation and retrieval
- [ ] PDF generation (if server-side)

### E2E Tests

- [ ] View one-page report after assessment
- [ ] View three-page report and navigate pages
- [ ] Export PDF and verify file download
- [ ] Create share link and access public view
- [ ] Verify share link expiration

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Report page load time | < 1s |
| LLM narrative generation | < 5s |
| PDF generation | < 3s |
| One-page fits single printed page | Yes |
| Share link view tracking accuracy | 100% |

---

## Dependencies

- Assessment with detailed_block_scores (Epic N from Sprint 12, OR use aggregate scores for MVP)
- Company branding settings (Story S4)
- Industries.js benchmark data (Epic K)
- OpenAI API for LLM narrative

---

## Related Documents

- [Sprint 10 Master Plan](./SPRINT-10-MASTER-PLAN.md)
- [Epic S Configuration](./EPIC-S-CONFIGURATION.md)
- [DiagnosticEngine](../../../../server/services/diagnostic/DiagnosticEngine.js)

---

**Story Owner**: Product Team
**Sprint**: 10
