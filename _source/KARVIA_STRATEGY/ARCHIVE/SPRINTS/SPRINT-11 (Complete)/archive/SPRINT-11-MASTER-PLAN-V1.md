# Sprint 11 Master Plan

**Sprint**: 11
**Created**: January 9, 2026
**Updated**: January 20, 2026 (Structure-First Reorganization + Epic QA)
**Total Story Points**: 90 pts
**Duration**: 3.5 weeks (estimated)
**Status**: PLANNING

---

## Reorganization Applied (January 20, 2026)

| Change | Reason | Impact |
|--------|--------|--------|
| Added Epic U (22 pts) | UI Standardization to S13 patterns | Consistent design across all pages |
| Moved Epic M Phase 1 to Sprint 12 | Better sequencing - UI first, then wizard | Sprint 12: +13 pts |
| Quickfix updated to 2 pts | Scope refinement | Minor adjustment |
| Added Epic QA (13 pts) | Question-Answer Credibility (expanded from 5pt feature) | Credible SSI scores through proper question design |
| **Total**: 90 pts | Structure-first approach approved | 3.5 weeks duration |

**Strategy**: Implement Sprint 13 mockup LAYOUTS now with existing purple theme, defer branding to Sprint 13.

---

## Executive Summary

Sprint 11 focuses on **structure-first UI standardization**, assessment credibility, and planning redesign. The sprint delivers:
1. **UI Standardization** - Apply S13 design patterns to Dashboard, Objectives, Assessment Hub, Question Library (Epic U)
2. **Assessment Credibility** - Modular question system with guaranteed 12-block coverage (Epic J)
3. **Planning Page Redesign** - Week tiles with AI context, two-panel layout (Epic L)
4. **Question-Answer Credibility** - Audit and fix question-answer mismatches, rewrite unscorable questions (Epic QA)
5. **Forgot Password Flow** - Quick fix

**Key Principle**: Structure-first, branding-last. Get modern S13 layouts NOW while keeping existing purple theme. Epic U establishes consistent patterns, Epic L applies them to Planning with full functionality.

---

## Sprint 10 Dependency Gates

**CRITICAL**: Sprint 11 CANNOT start until these Sprint 10 stories are complete.

### Hard Dependencies (Blockers)

| Sprint 10 Story | Points | Required By | Reason |
|-----------------|--------|-------------|--------|
| D1: Dashboard layout | 8 | L4 | Task list data needed for week status |
| D2: Task list | 8 | L4 | Task completion API needed |
| D4: Task status | 3 | L4 | Status update API needed |
| K1-K4: Company Profile | 26 | M2 | Company profile fields for AI context |
| **Total Blocking** | **45** | | Must verify before Sprint 11 start |

### Verification Checklist

Before starting Sprint 11, verify:
- [ ] `GET /api/tasks?weekly_goal_id=X` returns task list with status
- [ ] `PUT /api/tasks/:id/status` updates task status
- [ ] `Company` model has new profile fields from Epic K (founding_year, business_model, etc.)
- [ ] `server/config/industries.js` exists and exports industry configuration

---

## Epic Overview

| Epic | Points | Priority | Description |
|------|--------|----------|-------------|
| **Epic U** | 22 | P0 | UI Standardization to S13 Patterns - Dashboard, Objectives, Assessment |
| Epic J | 28 | P0 | Assessment Credibility - Modular question system with 12-block coverage |
| Epic L | 25 | P1 | Planning Page Redesign - Week tiles + AI context (S13 pattern) |
| **Epic QA** | 13 | P0 | Question-Answer Credibility - Audit questions, rewrite unscorable, validate response types |
| Quickfix | 2 | P2 | Forgot Password Flow |
| **Total** | **90** | | |

---

## Epic U: UI Standardization to S13 Patterns (22 pts) - NEW

### Problem Statement

Current pages have inconsistent layouts, headers, and card designs. Sprint 13 mockups define modern patterns but were planned for later implementation with branding changes.

### Solution: Structure-First Approach

Apply S13 mockup LAYOUTS now while keeping existing purple theme. Branding swap deferred to Sprint 13.

### Design Patterns to Implement

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  COMMON PATTERNS FROM S13 MOCKUPS                                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  HEADER PATTERN                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │  Page Title   📊 KPI  📊 KPI            [Quarter Selector] [Actions]       │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  CARD PATTERN (12px radius, 1px gray border, white bg)                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐              │
│  │  Title           │  │  Title           │  │  Title           │              │
│  │  ━━━━░░░░ 65%    │  │  ━━━━░░░░ 45%    │  │  ━━━━░░░░ 78%    │              │
│  │  Metadata        │  │  Metadata        │  │  Metadata        │              │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘              │
│                                                                                 │
│  TWO-PANEL PATTERN (for complex pages)                                          │
│  ┌─────────────────┐  ┌──────────────────────────────────────────────────────┐ │
│  │  LEFT: Filters  │  │  RIGHT: Content                                      │ │
│  │  ─────────────  │  │  ─────────────────────────────────────────────────   │ │
│  │  Category list  │  │  Cards or list items                                 │ │
│  └─────────────────┘  └──────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Stories

| Story | Points | Page | S13 Pattern Applied |
|-------|--------|------|---------------------|
| U1 | 6 | dashboard.html | 3-column tasks, objective pills, weekly section, progress bars |
| U2 | 5 | objectives.html | Header KPIs, quarter selector, category tabs, card grid |
| U3 | 5 | assessment-hub.html | Header KPIs, tab pills, card grid |
| U4 | 4 | assessment-question-library.html | Two-panel layout, filter sidebar |
| U5 | 2 | Common CSS patterns | Shared styles for headers, cards, progress bars |
| **Total** | **22** | | |

### U1: Dashboard UI Standardization (6 pts)

**Reference Mockup**: `sprint_mockups/sprint13-dashboard-redesign.html`

**Changes**:
1. Header with objective context dropdown and task stats
2. 3-column task layout (Overdue | Today | Tomorrow)
3. Section progress bars
4. 3-column weekly goals (Last Week | This Week | Next Week)

**Preserves**:
- All `loadDashboard()` API logic
- `completeTask()` functionality
- `escapeHtml()` XSS prevention
- Role-specific views

### U2: Objectives Page UI Standardization (5 pts)

**Reference Mockup**: `sprint_mockups/sprint13-objectives-redesign.html`

**Changes**:
1. Clean header with inline KPIs (Active count, At Risk count)
2. Quarter selector pills (Q1-Q4)
3. Category filter tabs
4. 3-column card grid with consistent styling

**Preserves**:
- ALL modal functions (view, edit, delete)
- `calculateKRProgress()` logic
- `getFilteredObjectives()` filter logic
- Category icons and colors

### U3: Assessment Hub UI Standardization (5 pts)

**Changes**:
1. Header with template and pending counts
2. Tab pills (Assigned | My Templates | Sent | Team Results)
3. 3-column assessment card grid

**Preserves**:
- All assessment workflow logic
- Template selection and creation
- Send assessment flow

### U4: Question Library Two-Panel Layout (4 pts)

**Changes**:
1. Two-panel layout (left filter sidebar, right content)
2. Dimension filter sidebar (Speed, Strength, Intelligence)
3. Category grouping in sidebar
4. Collapsible question groups

**Preserves**:
- Question search
- Industry/role filters
- Question CRUD operations

### U5: Common CSS Patterns (2 pts)

**New File**: `client/css/s13-patterns.css`

```css
/* S13 Pattern System - Structure Only, Keep Purple Theme */

/* Container */
.s13-main { max-width: 1200px; margin: 0 auto; padding: 32px; }

/* Page Header */
.s13-header { display: flex; justify-content: space-between; margin-bottom: 24px; }
.s13-title { font-size: 22px; font-weight: 600; color: #111827; }
.s13-kpi { display: flex; gap: 16px; align-items: center; }

/* Cards */
.s13-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
}

/* Progress bars - KEEP PURPLE */
.s13-progress { height: 6px; background: #E5E7EB; border-radius: 3px; }
.s13-progress-fill { background: #667eea; /* KEEP PURPLE */ }

/* Two-panel */
.s13-two-panel { display: grid; grid-template-columns: 280px 1fr; gap: 24px; }
.s13-sidebar { background: white; border-radius: 12px; padding: 16px; }
```

---

## Epic J: Assessment Credibility (28 pts)

**Moved from Sprint 10** - See [EPIC-J-ASSESSMENT-CREDIBILITY.md](./EPIC-J-ASSESSMENT-CREDIBILITY.md)

### Problem Statement

Current assessment templates can have 0 questions in some blocks, leading to skewed or incomplete SSI scores. The assessment must produce reliable 12-block SSI scores for the SSI Diagnostic Report to be credible.

### Solution: Modular Question System

```
┌─────────────────────────────────────────────────────────────────┐
│  CORE MODULE (24 questions - always available)                   │
│  ├── 2 questions per block (1 Quantitative + 1 Qualitative)     │
│  └── Ensures all 12 blocks have coverage                        │
├─────────────────────────────────────────────────────────────────┤
│  INDUSTRY MODULE: Financial Services (6 questions)              │
│  └── AUM, client retention, succession, compliance              │
├─────────────────────────────────────────────────────────────────┤
│  ROLE MODULES (Executive, Manager - 8 questions)                │
│  └── Role-specific strategic and operational questions          │
└─────────────────────────────────────────────────────────────────┘
```

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| J1 | 5 | Module system database schema |
| J2 | 3 | Core questions seed (24 questions - 2 per block) |
| J3 | 3 | Financial Services industry questions (6 questions) |
| J4 | 2 | Role questions (executive, manager - 8 questions) |
| J5 | 5 | Module-filtered questions API |
| J6 | 6 | Step 1: Select Questions UI |
| J7 | 2 | Step 2: Configure Template UI |
| J8 | 2 | Step 3: Review & Save UI |
| **Total** | **28** | |

### Key Deliverables

1. **AssessmentQuestion Schema Extension**: `module_type`, `question_subtype`, `industry_tags`, `role_tags`, `block` fields
2. **38 New Questions**: 24 core + 6 Financial Services + 8 role-based
3. **3-Step Template Creation Wizard**: Select → Configure → Review & Save
4. **Block Coverage Validation**: Warning when templates don't cover all 12 blocks

---

## Epic L: Planning Page Redesign (25 pts)

### Problem Statement
Current Planning page has information overload, task completion UI in wrong place, and AI suggestions lack historical context.

### Solution
- Week tiles grid layout (see all weeks at glance)
- Expansion panel for editing (no task checkboxes)
- AI context assembly from existing data
- Status calculated from Dashboard task completions

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| L1 | 5 | Week tiles grid layout |
| L2 | 3 | KR sidebar selection |
| L3 | 5 | Week expansion panel |
| L4 | 3 | Week status from tasks |
| L5 | 5 | AI context assembly |
| L6 | 4 | AI suggestions UI |

### Key Design Decisions
1. **No backend changes** - Uses existing Goal/Task models
2. **Planning only** - No task completion UI (Dashboard handles that)
3. **Rich AI context** - Includes all previous weeks + completion status
4. **Quarterly flexibility** - Shows however many weeks are in the quarter

### Wireframe Summary

```
┌─────────────────────────────────────────────────────────────┐
│  Objective Header                                           │
├──────────────────────┬──────────────────────────────────────┤
│  KR List (sidebar)   │  Week Tiles Grid (6 columns)         │
│                      │  ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐      │
│  ● KR 1 (selected)   │  │W1 ││W2 ││W3 ││W4 ││W5 ││W6 │      │
│  ○ KR 2              │  └───┘└───┘└───┘└───┘└───┘└───┘      │
│  ○ KR 3              │  ┌───┐┌───┐┌───┐...                  │
│                      │  │W7 ││W8 ││W9 │                     │
├──────────────────────┴──────────────────────────────────────┤
│  [Expansion Panel - appears when tile clicked]              │
│  Week 3: Jan 20-26 · Goal title · Tasks list                │
│  [✨ Get AI Suggestions]              [Save]                │
└─────────────────────────────────────────────────────────────┘
```

---

## Quickfix: Forgot Password (2 pts)

Reference: [QUICKFIX-FORGOT-PASSWORD.md](./QUICKFIX-FORGOT-PASSWORD.md)

**Note**: Epic M Phase 1 (OKR Wizard Foundation) moved to Sprint 12 per structure-first reorganization.

---

## Epic QA: Question-Answer Credibility System (13 pts)

### Problem Statement

Assessment questions have **two fundamental design flaws** causing unreliable SSI scores:

1. **Semantic Mismatch**: Wrong answer scales for question types
   - "How often do orders require rework?" → Shows "Strongly Disagree → Strongly Agree"
   - Should show: "Never → Always" (frequency scale)

2. **Unscorable Questions**: Questions that cannot be answered with any scale
   - "Why do customers continue to choose us?" → Asks for REASONS (text answer)
   - "Which services generate predictable cash flow?" → Asks for SELECTION

**Audit Results**: 17 out of 45 Air Products questions (38%) are unscorable.

### Solution: Three-Part System

```
PART 1: Audit & Classification (QA1-QA2)
└── Audit all 223 questions, classify by scoreability

PART 2: Question Rewrite (QA3-QA4)
└── Rewrite 17 unscorable Air Products questions + fix response_type

PART 3: Answer Type Enforcement (QA5-QA6)
└── responseTypes.js config, validation service, correct form inputs
```

### Stories

| Story | Points | Description |
|-------|--------|-------------|
| QA1 | 2 | Question Audit Script |
| QA2 | 1 | Question Classification Report |
| QA3 | 3 | Air Products Question Rewrite (17 questions) |
| QA4 | 2 | Core Library Question Fixes |
| QA5 | 3 | Response Type Config + Validation Service |
| QA6 | 2 | Assessment Form Input Types |
| **Total** | **13** | |

### Response Types

| Type | Input | Labels | Scoring |
|------|-------|--------|---------|
| `perception` | Slider 0-10 | Strongly Disagree → Agree | Direct |
| `effectiveness` | Slider 0-10 | Not effective → Extremely | Direct |
| `frequency` | Dropdown | Never → Always (5 options) | Mapped |
| `percentage` | Slider 0-100% | 0% → 100% | Normalized |
| `time_short` | Dropdown | Instant → Week+ | Mapped/Inverse |
| `time_long` | Dropdown | Same week → 3+ months | Mapped/Inverse |
| `maturity` | Dropdown | Ad-hoc → Optimized (5 levels) | Mapped |

### Question Rewrite Example

| Original (Unscorable) | Rewritten (Scoreable) | Type |
|----------------------|----------------------|------|
| "Why do customers choose us?" | "How likely are customers to choose us?" | perception |
| "Which services are most profitable?" | "What % of revenue comes from top 3 services?" | percentage |
| "What creates trust when issues arise?" | "How effectively do we build trust when issues arise?" | effectiveness |

Reference: [EPIC-QA-QUESTION-ANSWER-CREDIBILITY.md](./EPIC-QA-QUESTION-ANSWER-CREDIBILITY.md)

---

## Implementation Schedule (3.5 Weeks)

### Week 1: Epic QA (Question Credibility) + Epic U Start (7 days)

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 1 | QA1 | 2 | Question audit script |
| 2 | QA2, QA3 start | 2 | Audit report + Air Products rewrite start |
| 3 | QA3 complete | 2 | Air Products rewrite (17 questions) |
| 4 | QA4, QA5 start | 3 | Core library fixes + response config start |
| 5 | QA5 complete, QA6 | 4 | Validation service + Assessment form inputs |
| 6 | U5, U1 start | 4 | Common CSS patterns + Dashboard UI start |
| 7 | U1 complete | 4 | Dashboard 3-column layout + progress bars |
| **Week 1** | **QA1-QA6, U5, U1** | **21** | |

### Week 2: Epic U Complete + Epic J Backend (7 days)

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 8 | U2 | 5 | Objectives page UI standardization |
| 9 | U3 | 5 | Assessment Hub UI standardization |
| 10 | U4 | 4 | Question Library two-panel layout |
| 11 | J1 | 5 | Module system database schema |
| 12 | J2, J3 | 6 | Core questions seed + Financial Services questions |
| 13 | J4, J5 | 7 | Role questions + Module-filtered API |
| 14 | J6 | 6 | Step 1: Select Questions UI |
| **Week 2** | **U2-U4, J1-J6** | **38** | |

### Week 3: Epic J Complete + Epic L (7 days)

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 15 | J7, J8 | 4 | Step 2 & 3: Configure + Review UI |
| 16 | L1 | 5 | Week tiles grid layout (S13 pattern) |
| 17 | L2 | 3 | KR sidebar selection |
| 18 | L3 | 5 | Week expansion panel |
| 19 | L4 | 3 | Week status from tasks |
| 20 | L5 | 5 | AI context assembly (uses shared AIContextService) |
| 21 | L6 | 4 | AI suggestions UI |
| **Week 3** | **J7-J8, L1-L6** | **29** | |

### Week 4: Quickfix + Buffer (2 days)

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 22 | Quickfix | 2 | Forgot password |
| 23 | Buffer | - | Integration testing + polish |
| **Week 4** | **Quickfix** | **2** | |

**Total: 90 pts over 23 days (3.5 weeks)**

---

## AIContextService Usage

Epic L uses the enhanced AIContextService for AI planning suggestions:

**NOTE**: These are NEW methods to be implemented as part of L5. Current AIContextService only has `buildObjectiveContext()`.

```javascript
// NEW METHOD for Epic L (Planning):
AIContextService.getWeeklyGoalContext(companyId, keyResultId, weekNumber)

// NEW METHOD: Base context shared across features:
AIContextService.getBaseContext(companyId) // company + SSI + business_metrics
```

See: `server/services/AIContextService-enhancement-spec.md` (created in Sprint 10)

**Note**: Epic M (OKR Wizard) moved to Sprint 12, where it will use `AIContextService.getOKRGenerationContext()`

---

## Dependencies

| Dependency | Status | Required By | Notes |
|------------|--------|-------------|-------|
| Sprint 10 D1, D2, D4 | **BLOCKING** | L4 | Task API must work |
| Sprint 10 industries.js | Ready | J1 | Shared industry config for question tagging |
| Existing weekly goal API | Ready | L3 | No changes needed |
| AI generation endpoint | Ready | L6 | May add context parameter |
| AssessmentQuestion model | Ready | J1 | Base model exists, just adding fields |
| S13 mockups | Ready | U1-U4 | Design reference for UI standardization |

**Note**: Sprint 10 K1-K4 dependency moved to Sprint 12 Epic M

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Sprint 10 delays | Medium | High | Can start QA1-QA6, J1-J5, L1-L3 independently |
| AI context performance | Low | Medium | Parallel fetches, caching |
| Sprint capacity (90 pts) | Medium | Medium | Epic QA front-loaded; J and L can run in parallel |
| Question rewrite quality | Medium | Medium | Product team reviews all 17 Air Products rewrites |
| Question seeding accuracy | Low | Medium | Review questions against 12-block MECE framework |
| Existing assessment data | Low | Low | No retroactive changes - new scoring for new assessments only |
| Response type integration | Low | Medium | responseTypes.js and validation service have clear interfaces |

---

## Success Criteria

### Epic U Success Criteria (UI Standardization)
- [ ] Dashboard has 3-column task layout (Overdue | Today | Tomorrow)
- [ ] Dashboard has objective context pills in header
- [ ] Dashboard has section progress bars
- [ ] Dashboard has 3-column weekly goals section
- [ ] Objectives page has clean header with inline KPIs
- [ ] Objectives page has quarter selector pills
- [ ] Objectives page has category filter tabs
- [ ] Assessment Hub has header with template/pending counts
- [ ] Assessment Hub has tab pills for sections
- [ ] Question Library has two-panel layout with filter sidebar
- [ ] Common CSS patterns file created (s13-patterns.css)
- [ ] All pages maintain existing functionality (no regressions)

### Epic J Success Criteria
- [ ] AssessmentQuestion model has module_type, question_subtype, industry_tags, role_tags, block fields
- [ ] 24 core questions seeded (2 per block x 12 blocks)
- [ ] 6 Financial Services questions seeded
- [ ] 8 role questions seeded (4 executive + 4 manager)
- [ ] GET /api/assessment-questions supports module, industry, role filters
- [ ] 3-step template creation wizard functional
- [ ] Block coverage warning displays when <12 blocks selected
- [ ] Template save creates template with selected questions

### Epic L Success Criteria
- [ ] Planning page renders week tiles grid (S13 pattern)
- [ ] Two-panel layout (KR sidebar, week content)
- [ ] Can create weekly goal without leaving page
- [ ] AI suggestions include historical context
- [ ] No task checkboxes on planning page
- [ ] Week status reflects Dashboard completion (L4)
- [ ] Mobile responsive

### Epic QA Success Criteria (Question-Answer Credibility)
- [ ] Question audit script runs and classifies all 223 questions
- [ ] Audit report generated with scoreability classification
- [ ] All 17 Air Products unscorable questions rewritten
- [ ] Core library questions have correct response_type assigned
- [ ] `responseTypes.js` config created with all 7 types (perception, effectiveness, frequency, percentage, time_short, time_long, maturity)
- [ ] `QuestionValidationService` detects semantic mismatches
- [ ] `QuestionValidationService.normalizeResponse()` correctly scores all types
- [ ] Assessment Form renders correct input per response_type:
  - [ ] `perception` → slider with "Strongly Disagree → Strongly Agree"
  - [ ] `effectiveness` → slider with "Not effective → Extremely effective"
  - [ ] `frequency` → dropdown with "Never, Rarely, Sometimes, Often, Always"
  - [ ] `percentage` → slider with "0% → 100%"
  - [ ] `time_short` → dropdown with hour/day time ranges
  - [ ] `time_long` → dropdown with week/month duration ranges
  - [ ] `maturity` → dropdown with 5 maturity levels
- [ ] All responses correctly normalized to 0-10 for SSI scoring
- [ ] Zero unscorable questions remain in any template
- [ ] No regressions on existing assessments (backward compatible)

### Sprint 11 Completion Checklist
- [ ] All QA stories (QA1-QA6) complete - Question-Answer Credibility
- [ ] All U stories (U1-U5) complete - UI Standardization
- [ ] All J stories (J1-J8) complete - Assessment Credibility
- [ ] All L stories (L1-L6) complete - Planning Redesign
- [ ] Quickfix (Forgot Password) complete
- [ ] AIContextService shared methods implemented
- [ ] No functional regressions (all APIs work, all modals work)
- [ ] Sprint 12 handoff document created

---

## Related Documents

- [EPIC-QA-QUESTION-ANSWER-CREDIBILITY.md](./EPIC-QA-QUESTION-ANSWER-CREDIBILITY.md) - Question audit, rewrite, and validation system (13 pts)
- [EPIC-U-UI-STANDARDIZATION.md](./EPIC-U-UI-STANDARDIZATION.md) - UI Standardization to S13 patterns
- [EPIC-J-ASSESSMENT-CREDIBILITY.md](./EPIC-J-ASSESSMENT-CREDIBILITY.md) (moved from Sprint 10)
- [EPIC-L-PLANNING-PAGE-REDESIGN.md](./EPIC-L-PLANNING-PAGE-REDESIGN.md)
- [QUICKFIX-FORGOT-PASSWORD.md](./QUICKFIX-FORGOT-PASSWORD.md)
- [ISSUE-INDUSTRY-TAGGING.md](./ISSUE-INDUSTRY-TAGGING.md) - Industry tagging for question library
- [Sprint 10 Master Plan](../SPRINT-10%20(Complete)/SPRINT-10-MASTER-PLAN.md)
- [SPRINT-REORGANIZATION-PLAN-V2.md](../SPRINT-REORGANIZATION-PLAN-V2.md) - Structure-first strategy
- [PLANNING-PAGE-FUNCTIONALITY-ANALYSIS.md](../PLANNING-PAGE-FUNCTIONALITY-ANALYSIS.md) - Detailed planning page audit

### S13 Mockup References
- [sprint13-dashboard-redesign.html](../sprint_mockups/sprint13-dashboard-redesign.html) - Dashboard mockup (v16)
- [sprint13-objectives-redesign.html](../sprint_mockups/sprint13-objectives-redesign.html) - Objectives mockup
- [sprint13-planning-redesign.html](../sprint_mockups/sprint13-planning-redesign.html) - Planning mockup (v4)

**Note**: Epic M (OKR Wizard) moved to Sprint 12

---

## Quick Fixes Applied (January 19, 2026)

The following quick fixes were applied to the Assessment Question Library:
1. UI badge updated from "Professional Services Library" → "Comprehensive Question Library"
2. Industry filter chips added (All, Air Products, Cattle, Financial Services, Core)
3. Search functionality enhanced
4. Air Products template created (45 questions) - S33-S47, ST36-ST50, IN34-IN48
5. Financial Services questions seeded (28 questions) - S49-S57, ST51-ST57, IN53-IN64

**Production Database Status (Jan 19):**
- Total Questions: 173 (100 core + 45 Air Products + 28 Financial Services)
- All industry filters working

Full industry tagging solution will be implemented as part of Epic J.

---

**Plan Owner**: Product Team
**Technical Lead**: TBD
**Sprint Target**: February 2026
