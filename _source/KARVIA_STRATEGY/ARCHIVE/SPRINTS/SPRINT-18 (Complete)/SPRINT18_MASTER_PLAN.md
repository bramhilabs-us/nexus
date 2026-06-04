# Sprint 18 Master Plan

**Sprint**: 18 - AI-Ready Company Profile (Stage-Based Redesign)
**Created**: March 9, 2026
**Updated**: March 9, 2026
**Status**: PLANNED
**Duration**: 2 weeks
**Total Points**: 71 pts (estimated)

---

## Sprint Vision

> **"Transform Company Profile into a stage-based journey that naturally guides users toward AI-ready context"**

Sprint 17 built the intelligent context engine (maturity stages, prompts, benchmarks). Sprint 18 transforms the Company Profile page into a **5-stage visual journey** that makes maturity progression tangible and motivating.

**Design Reference**: `MOCKUP_PROFILE_V4.html`

---

## Sprint Scope: Frontend-Only

> **IMPORTANT**: Sprint 18 is a **UI-only sprint**. No backend schema changes required.

| Component | Scope | Backend Changes |
|-----------|-------|-----------------|
| Stage Navigation | UI | None |
| Discovery Stage | UI + existing fields | None |
| Assessment - SSI | UI (existing API) | None |
| Assessment - Culture Score | **UI-only (placeholder)** | None - display only |
| Assessment - Financial Score | **UI-only (Coming Soon)** | None - placeholder |
| Execution Stage | UI + existing fields | None |
| Locked Stages | UI preview | None |

**Why UI-Only for Culture/Financial Scores?**
- PTH scores will come from iBrain (external system) in future
- Financial Score is a future iBrain feature
- For Sprint 18, these are **display placeholders** showing the UI design
- No impact on OKR generation - AI uses SSI + Company Profile (already complete)

---

## The 5-Stage Journey

| Stage | Name | Threshold | State | Description |
|-------|------|-----------|-------|-------------|
| 0 | Discovery | 0-20% | **Active** | Minimum context for first OKR |
| 1 | Assessment | 20-45% | **Active** | SSI scores + team data |
| 2 | Execution | 45-65% | **Active** | Targets + tracking metrics |
| 3 | Learning | 65-80% | **Locked Preview** | Unlocks after 50+ tasks, 1 OKR cycle |
| 4 | Mastery | 80-100% | **Locked Preview** | Unlocks after 4+ OKR cycles |

**Key Insight**: Stages 0-2 are user-input stages. Stages 3-4 are system-learned stages that unlock based on platform usage.

---

## Strategic Context

### Sprint 17 Delivered (Prerequisites)
- Context Maturity Service (5 stages: Discovery → Mastery)
- Stage-aware prompt system
- Industry benchmarks for Stage 0 fallback
- Outcome tracking for Stage 3+ learning

### The Problem
Despite having 40+ fields in Company Profile, user completion rates are low:
- Strategic Vision fields: ~15% completion
- Business Metrics: ~25% completion
- Profile fields: ~40% completion

**Result**: Most companies stuck at Stage 0-1, limiting AI effectiveness.

### The Solution: Stage-Based UI
Transform the flat 3-tab structure into a **5-stage journey** with:
1. **Stage tabs** as main navigation (Discovery, Assessment, Execution, Learning, Mastery)
2. **Sub-tabs** within each stage (The Business, The Numbers, The Vision)
3. **Visual progression** showing maturity advancement
4. **Locked preview** for future stages (creates aspiration)
5. **Enhanced UI components** (chips, sliders, question cards)

---

## Epic Structure

### Epic CP1: Stage Navigation System (18 pts)
**Goal**: Replace 3-tab navigation with 5-stage journey tabs

| Story | Points | Description |
|-------|--------|-------------|
| CP1-1 | 5 | Implement stage tabs (Discovery, Assessment, Execution, Learning, Mastery) |
| CP1-2 | 4 | Add sub-tabs within each stage (The Business, The Numbers, The Vision) |
| CP1-3 | 4 | Style active/locked/preview states for stage tabs |
| CP1-4 | 3 | Show completion % badge on each sub-tab |
| CP1-5 | 2 | Integrate with ContextMaturityService for stage calculation |

**Acceptance Criteria**:
- 5 stage tabs visible (3 active, 2 locked with preview)
- Sub-tabs work within each stage
- Stage calculation from backend reflected in UI
- Visual difference between active/locked stages

---

### Epic CP2: Discovery Stage (Stage 0) - 20 pts
**Goal**: Complete Discovery stage with all fields needed for first OKR

| Story | Points | Description |
|-------|--------|-------------|
| CP2-1 | 4 | **The Business**: Company Name, Founded Year, Website, Industry (chips) |
| CP2-2 | 4 | **The Business**: Employee slider, Revenue Model chips, Description |
| CP2-3 | 4 | **The Business**: Value Proposition, Revenue Driver, Target Market |
| CP2-4 | 4 | **The Numbers**: Current metrics grid, Concentration slider, Retention slider |
| CP2-5 | 4 | **The Vision**: #1 Priority, Blocker, One Thing, Challenges (multi-select), 3-5 Year Vision |

**UI Components from V4 Mockup**:
- **Chips**: Single-select for industry/revenue model, multi-select for challenges
- **Sliders**: Employee count, concentration risk (color-coded), retention rate
- **Question cards**: Clean card-based layout with "Why this matters" links
- **Row layouts**: row-2 and row-3 grids for space optimization

**Acceptance Criteria**:
- All Discovery fields from `COMPANY_INFORMATION_ARCHITECTURE.md` present
- Chips work for single and multi-select
- Sliders update values with visual feedback
- Color-coded risk indicators (concentration: green→orange→red)

---

### Epic CP3: Assessment Stage (Stage 1) - 14 pts
**Goal**: Display multi-dimensional assessment scores with 3 sub-tabs

> **UI-ONLY SCOPE**: Culture Score and Financial Score are **display placeholders only**. No backend integration, no data storage, no API calls. Static/demo values for visual design validation.

#### Sub-Tab Structure
| Sub-Tab | Source | Scope | Backend |
|---------|--------|-------|---------|
| **Ops - SSI** | Karvia Assessment Engine | Live data | Existing API |
| **Culture Score** | iBrain PTH (future) | **UI placeholder** | None |
| **Financial Score** | iBrain (future) | **UI placeholder** | None |

| Story | Points | Description |
|-------|--------|-------------|
| CP3-1 | 4 | **Ops - SSI sub-tab**: SSI summary with radar/bar chart, category breakdown, CTA if missing |
| CP3-2 | 5 | **Culture Score sub-tab**: Static PTH display (Progress, Trust, Health), 5D breakdown - **UI only, hardcoded demo values** |
| CP3-3 | 3 | **Financial Score sub-tab**: "Coming Soon" placeholder UI with preview cards - **UI only** |
| CP3-4 | 2 | Tab navigation within Assessment stage, score badges on each sub-tab |

#### Culture Score (PTH) from iBrain
```
┌─────────────────────────────────────────────────┐
│              PTH CULTURE SCORE                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────┬──────────┬──────────┐            │
│  │ PROGRESS │  TRUST   │  HEALTH  │            │
│  │   78     │   71     │   69     │            │
│  │ (green)  │ (blue)   │ (purple) │            │
│  └──────────┴──────────┴──────────┘            │
│                                                  │
│  5D BREAKDOWN (Backend → PTH):                  │
│  ├── Clarity: 72                                │
│  ├── Commitment: 85                             │
│  ├── Adaptability: 68                           │
│  ├── Competency: 61                             │
│  └── Opportunity: 55                            │
│                                                  │
│  Source: iBrain Prodify Platform                │
│  Reference: PTH_UNIFIED_SCORING_FRAMEWORK.md    │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- 3 sub-tabs visible: Ops - SSI, Culture Score, Financial Score
- Ops - SSI: Existing SSI radar/bar display with category scores
- Culture Score: PTH scores displayed with 5D breakdown
- Financial Score: Coming soon placeholder with preview
- Each sub-tab shows completion badge (complete/pending)

---

### Epic CP4: Execution Stage (Stage 2) - 8 pts
**Goal**: Display targets and tracking-ready metrics

| Story | Points | Description |
|-------|--------|-------------|
| CP4-1 | 4 | 12-Month Targets section (revenue, growth, clients, team size) |
| CP4-2 | 2 | Current vs Target comparison visual |
| CP4-3 | 2 | "Why this matters" explanation for targets |

**Acceptance Criteria**:
- Target metrics editable
- Visual comparison (current → target)
- Explanation of how targets improve KRs

---

### Epic CP5: Locked Stages Preview (Learning & Mastery) - 6 pts
**Goal**: Show locked stages with preview of what users will get

| Story | Points | Description |
|-------|--------|-------------|
| CP5-1 | 3 | Learning stage locked preview (execution patterns, OKR outcomes, lessons) |
| CP5-2 | 3 | Mastery stage locked preview (predictions, patterns, recommendations) |

**Acceptance Criteria**:
- Locked banner shows unlock requirements
- Preview cards show what will be available
- Grayed/dimmed state with diagonal stripe overlay

---

### Epic CP6: UI Component Library (5 pts)
**Goal**: Implement reusable V4 UI components

| Story | Points | Description |
|-------|--------|-------------|
| CP6-1 | 2 | Chip component (single/multi-select) with CSS |
| CP6-2 | 2 | Slider component with value display and color-coding |
| CP6-3 | 1 | Question card component with "AI Impact" badge |

**Acceptance Criteria**:
- Components reusable across stages
- Consistent with V4 mockup styling
- Responsive for different screen sizes

---

## Technical Implementation

### Design Reference
**Primary Mockup**: `SPRINT-18 (Planned)/MOCKUP_PROFILE_V4.html`
- Stage tabs with sub-tabs
- Chip-based selections
- Slider components with visual feedback
- Question card layout
- Locked stage preview styling

### Files to Modify

**Frontend**:
```
client/pages/company-profile.html
├── Replace 3-tab nav with 5-stage tabs
├── Add sub-tabs within each stage
├── Convert inputs to chips/sliders where applicable
├── Add locked stage preview sections
├── Import new CSS component styles
└── Keep existing autosave/completion logic

client/js/company-profile.js
├── Add stage tab navigation (showStageTab)
├── Add sub-tab navigation (showSubTab)
├── Add chip selection handlers (single/multi)
├── Add slider value + color handlers
├── Integrate maturity API for stage calculation
├── Update completion tracking for new structure
└── Keep existing save/autosave logic
```

**New CSS** (inline or separate file):
```css
/* Stage Tabs */
.stage-tabs, .stage-tab, .stage-tab.active, .stage-tab.locked

/* Sub-tabs */
.sub-tabs, .sub-tab, .sub-tab.active

/* UI Components */
.chips, .chip, .chip.selected
.slider-row, .slider-track, .slider-value
.question-card, .question-header, .question-label
.row-2, .row-3 (grid layouts)

/* Locked State */
.locked-banner, .locked-preview
```

**Backend** (minimal changes):
```
server/routes/companies.js
└── Add GET /api/companies/:id/maturity (proxy to ContextMaturityService)

server/routes/assessments.js
└── Ensure SSI summary endpoint exists for Stage 1

NO BACKEND CHANGES FOR:
├── Culture Score (PTH) - UI placeholder only
├── Financial Score - UI placeholder only
├── Company.js schema - No modifications
└── No new database fields
```

### API Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/companies/:id/maturity` | GET | Get maturity stage + breakdown | NEW |
| `/api/assessments/company/:id/summary` | GET | SSI scores for Stage 1 | EXISTS |
| `/api/companies/:id` | PUT | Save profile (existing) | EXISTS |

### Key Data Mappings

| V4 Mockup Field | Existing Field ID | Backend Path |
|-----------------|-------------------|--------------|
| Company Name | `companyName` | `name` |
| Industry (chips) | `companyIndustry` | `industry` |
| Employee (slider) | `employeeCount` | `employee_count` |
| Revenue Model | NEW | `business_context.profile.revenue_model` |
| Value Proposition | `valueProposition` | `business_context.profile.value_proposition` |
| Concentration % (slider) | `metric_top_5_clients_revenue_pct` | `business_context.metrics.current.top_5_clients_revenue_pct` |
| Key Challenges | NEW | `business_context.profile.key_challenges[]` |
| #1 Priority | `priorityOne` | `business_context.strategic_vision.priority_one` |

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| Sprint 17 Context Maturity | COMPLETE | MAT-1/2/3/4 delivered |
| Sprint 17 Outcome Tracking | COMPLETE | OUT-1/2/3/4 delivered |
| company-profile.html | READY | 498 lines, 3-tab structure (to be transformed) |
| company-profile.js | READY | Full autosave, completion, risk warnings |
| ContextMaturityService | READY | calculateMaturity() working |
| V4 Mockup | READY | MOCKUP_PROFILE_V4.html approved |

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Major UI change confuses users | MEDIUM | Adoption drop | Clear stage progression, familiar sub-tabs |
| Scope creep with 5 stages | MEDIUM | Delivery delay | Stages 3-4 are just previews (minimal work) |
| CSS conflicts | LOW | Broken styling | Namespace all new classes with `cp-` prefix |
| Existing autosave breaks | LOW | Data loss | Preserve existing JS, add new handlers |

---

## Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Profile completion rate | ~40% | 75% |
| Strategic Vision completion | ~15% | 60% |
| Avg maturity stage | 0.8 | 1.8 |
| Companies at Stage 2+ | 10% | 50% |
| Time to complete Discovery | Unknown | <5 minutes |

---

## Sprint Schedule

| Day | Focus | Deliverables |
|-----|-------|--------------|
| 1-2 | Epic CP1 | Stage tabs navigation, sub-tabs |
| 3-4 | Epic CP6 | UI component library (chips, sliders, cards) |
| 5-6 | Epic CP2 (part 1) | Discovery - The Business sub-tab |
| 7-8 | Epic CP2 (part 2) | Discovery - The Numbers, The Vision |
| 9-10 | Epic CP3-CP4 | Assessment + Execution stages |
| 11-12 | Epic CP5 | Locked stage previews (Learning, Mastery) |
| 13-14 | Testing & Polish | E2E validation, responsive, bug fixes |

---

## Integration Approach (Surgical)

The integration follows a **surgical approach** to minimize risk:

### Keep As-Is
- Page header with completion ring
- Autosave indicator and Save button
- All existing JavaScript save/load logic
- **Company model schema (NO CHANGES)**
- All existing CSS that doesn't conflict
- **No new backend fields or APIs for PTH/Financial**

### Replace
- 3-tab navigation → 5-stage tabs with sub-tabs
- Standard dropdowns → Chip selections (where applicable)
- Number inputs for sliders → Slider components
- Grid layouts → row-2/row-3 optimized grids

### Add
- Stage tab CSS and handlers
- Chip component CSS and handlers
- Slider component CSS and handlers
- Locked stage preview sections
- Culture Score UI (static/demo values - **no backend**)
- Financial Score UI (placeholder - **no backend**)

---

## Related Documents

- [MOCKUP_PROFILE_V4.html](./MOCKUP_PROFILE_V4.html) - **Primary design reference**
- [COMPANY_INFORMATION_ARCHITECTURE.md](./COMPANY_INFORMATION_ARCHITECTURE.md) - Field taxonomy
- [Sprint 17 Handoff](../SPRINT-17%20(Complete)/SPRINT17_HANDOFF_DOCUMENT.md) - Context Maturity foundation
- [Company Model](../../../../server/models/Company.js) - Schema reference
- [ContextMaturityService](../../../../server/services/ContextMaturityService.js) - Maturity calculation
- [company-profile.html](../../../../client/pages/company-profile.html) - Current page (to be transformed)
- [company-profile.js](../../../../client/js/company-profile.js) - Current JS (to be extended)

---

## Appendix: Stage Tab HTML Structure

```html
<!-- Stage Tabs (main navigation) -->
<div class="stage-tabs">
  <button class="stage-tab active" onclick="showStageTab(0)">
    <span class="stage-num">1</span> Discovery
    <span class="stage-badge complete">85%</span>
  </button>
  <button class="stage-tab" onclick="showStageTab(1)">
    <span class="stage-num">2</span> Assessment
  </button>
  <button class="stage-tab" onclick="showStageTab(2)">
    <span class="stage-num">3</span> Execution
  </button>
  <button class="stage-tab locked" onclick="showStageTab(3)">
    <span class="stage-num">🔒</span> Learning
  </button>
  <button class="stage-tab locked" onclick="showStageTab(4)">
    <span class="stage-num">🔒</span> Mastery
  </button>
</div>

<!-- Sub-tabs (within each stage) -->
<div class="sub-tabs">
  <button class="sub-tab active" onclick="showSubTab(0, 'business')">The Business</button>
  <button class="sub-tab" onclick="showSubTab(0, 'numbers')">The Numbers</button>
  <button class="sub-tab" onclick="showSubTab(0, 'vision')">The Vision</button>
</div>
```

---

**Document Version**: 2.1
**Last Updated**: March 9, 2026
**Change Log**:
- v2.1: Clarified UI-only scope for Culture Score (PTH) and Financial Score - no backend changes
- v2.0: Added 5-stage journey approach with V4 mockup integration
- v1.0: Initial plan with maturity visibility focus
