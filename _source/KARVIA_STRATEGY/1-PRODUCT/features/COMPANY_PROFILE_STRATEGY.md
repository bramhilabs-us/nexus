# Company Profile & Business Context Strategy

<!-- @GENOME T1-PRD-010 | ACTIVE | 2026-04-20 | parent:T1-PRD-009 | auto:/strategy,/coding | linked:/design -->

**Version**: 2.0 (Revised)
**Created**: April 20, 2026 (Session #165)
**Revised**: April 20, 2026 (Session #165 - Single Source of Truth)
**Purpose**: Define company profile collection for LLM-powered objective creation
**Status**: ACTIVE - Sprint 22 Foundation
**Audience**: Product, Engineering, Design, Consultants

---

## Executive Summary

**Company Profile** provides business context that enables YSELA Coach (LLM) to generate intelligent, industry-specific, reality-grounded Key Results during objective creation.

### The Problem

Without business context:
- LLM generates generic KRs ("Increase efficiency by 20%")
- No industry-specific insights or benchmarks
- Can't align with actual business priorities
- Misses current challenges that objectives should address
- Treats all 50-employee companies the same regardless of industry

### The Solution

**Single Source of Truth**: Use the existing `business_context` structure (Epic K, Sprint 10) - NOT a separate field.

The **Orchestrator's CompanyProvider** extracts the AI-relevant subset from `business_context`:
- **Industry vertical**: From `company.industry`
- **Company size**: From `company.employee_count`
- **Business model**: From `business_context.profile.business_model`
- **Business priorities**: From `business_context.strategic_vision.priority_one`
- **Current challenges**: From `business_context.strategic_vision.biggest_blocker`

### Architectural Position

**Single System, Smart Extraction**:
- `business_context` (EXISTS) → Comprehensive company profile (Company Profile page)
- `CompanyProvider` (NEW) → Extracts AI-relevant subset for LLM context
- `PresentationService` (NEW) → Formats for UI display (client cards, etc.)

**Why Single Source?**
1. No data duplication
2. No synchronization issues
3. Company Profile page already exists and works
4. Orchestrator handles intelligent extraction
5. LEGO principle: Each piece independent, orchestrator connects them

---

## Table of Contents

1. [Existing Company Profile Page](#existing-company-profile-page)
2. [AI-Critical Fields](#ai-critical-fields)
3. [Company Onboarding Wizard](#company-onboarding-wizard)
4. [My Clients Page Enhancements](#my-clients-page-enhancements)
5. [Orchestrator Integration](#orchestrator-integration)
6. [Implementation Plan](#implementation-plan)

---

## Existing Company Profile Page

The Company Profile page **already exists** with comprehensive fields organized into 3 tabs:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COMPANY PROFILE PAGE (Already Built)                                        │
│  URL: /pages/company-profile.html                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  The Business   │  │  The Numbers    │  │   The Vision    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                              │
│  TAB 1: THE BUSINESS                                                         │
│  ├─ Company Name *              ├─ Industry [AI Impact]                     │
│  ├─ Industry Subtype            ├─ Employee Count *                         │
│  ├─ Year Founded                ├─ Website                                  │
│  ├─ Business Description [AI]   ├─ Business Model [AI]                      │
│  ├─ Value Proposition [AI]      ├─ Primary Revenue Driver                   │
│  └─ Ideal Client Profile                                                    │
│                                                                              │
│  TAB 2: THE NUMBERS                                                          │
│  ├─ Annual Revenue [AI]         ├─ Revenue Growth %                         │
│  ├─ Profit Margin %             ├─ Top 5 Clients % [AI]                     │
│  ├─ Total Client Families       ├─ Total AUM                                │
│  ├─ Client Retention Rate       ├─ Avg Client Tenure                        │
│  └─ Operational Capacity metrics                                            │
│                                                                              │
│  TAB 3: THE VISION                                                           │
│  ├─ #1 Priority [HIGH AI IMPACT] ← Critical for OKRs                        │
│  ├─ Biggest Obstacle [HIGH AI IMPACT] ← Critical for OKRs                   │
│  ├─ If You Could Change One Thing                                           │
│  ├─ 12-Month Targets                                                        │
│  └─ Long-Term Vision                                                        │
│                                                                              │
│  FEATURES:                                                                   │
│  ✓ "AI Impact" badges on fields used by LLM                                 │
│  ✓ "What AI knows about your company" expandable section                    │
│  ✓ Profile completion % ring (5 required, 14 optional)                      │
│  ✓ Autosave functionality                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**No changes needed to Company Profile page** - it already works well.

---

## AI-Critical Fields

The **CompanyProvider** extracts these 6 AI-critical fields from `business_context`:

| Field | Source | AI Impact | Fallback |
|-------|--------|-----------|----------|
| **Industry** | `company.industry` | Vertical insights, benchmarks | "Not specified" |
| **Size** | `company.employee_count` | Scale recommendations | 50 (default) |
| **Business Model** | `business_context.profile.business_model` | Service context | Generic recs |
| **#1 Priority** | `business_context.strategic_vision.priority_one` | Align objectives | Generic recs |
| **Biggest Blocker** | `business_context.strategic_vision.biggest_blocker` | Address pain points | Generic recs |
| **Revenue Range** | `business_context.metrics.current.annual_revenue` | Budget context | Not shown |

### Profile Completion Calculation

```javascript
// CompanyProvider.calculateProfileCompletion()
const aiCriticalFields = {
  industry: company.industry,
  size: company.employee_count,
  description: business_context?.profile?.description,
  business_model: business_context?.profile?.business_model,
  priority: business_context?.strategic_vision?.priority_one,
  blocker: business_context?.strategic_vision?.biggest_blocker
};

const filled = Object.values(aiCriticalFields).filter(Boolean).length;
const percentage = Math.round((filled / 6) * 100);

// Thresholds:
// 0-30%  = Minimal - generic recommendations
// 31-50% = Basic - some specificity
// 51-70% = Good - industry-aware recommendations
// 71-100% = Complete - highly tailored recommendations
```

---

## Company Onboarding Wizard

### When Does Onboarding Trigger?

**Option A: Immediate After "Add Client"** ✅ **RECOMMENDED**
- Consultant clicks "Add Client" in My Clients tab
- Modal 1: Basic company info (name, contact)
- Modal 2: Company Profile Wizard (business context)
- Captures context while fresh, consultant has all info

**Option B: Banner Prompt** (Alternative)
- Client added with basic info only
- Banner shows: "Complete [Client Name]'s profile for better AI recommendations"
- Consultant can defer, complete later
- Risk: Profile never completed

**Option C: Just-in-Time** (Alternative)
- Prompt when creating first objective
- Shows: "Want better KRs? Complete company profile first"
- Risk: Interrupts workflow, consultant may skip

**Decision**: **Option A** - Immediate onboarding wizard after "Add Client"

---

### Wizard Flow Design

**Approach: Single-Screen Wizard** (Fast, all-in-one)

**Rationale**:
- Consultants are time-constrained
- All fields optional - no pressure to complete
- Can skip and return later via "Complete Profile" action
- Multi-step risks abandonment

**Wizard Structure**:

```
┌─────────────────────────────────────────────────────────────────┐
│  TELL US ABOUT [CLIENT NAME]                                    │
│  Help us generate better AI recommendations                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏢 BUSINESS BASICS                                              │
│                                                                  │
│  What industry are they in?                                     │
│  [Dropdown: Select industry ▼]                                  │
│  [If "Other"] Specify: [___________]                            │
│                                                                  │
│  How many employees?                                            │
│  [● Exact number]  [○ Range]                                    │
│  [Number input: _____] OR [Dropdown: Select range ▼]            │
│                                                                  │
│  Annual revenue range? (optional)                               │
│  [Dropdown: Select range ▼ | Prefer not to say]                │
│                                                                  │
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│  📝 BUSINESS MODEL (1-2 sentences)                               │
│  [Text area: Describe how the business works                    │
│   ________________________________________________________      │
│   ________________________________________________________      │
│  ]                                                              │
│  💡 Example: "Multi-location real estate brokerage..."         │
│  200 chars max | [180 remaining]                               │
│                                                                  │
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│  🎯 TOP 3-5 BUSINESS PRIORITIES                                  │
│  What matters most to them right now?                           │
│                                                                  │
│  1. [________________________________________________]          │
│  2. [________________________________________________]          │
│  3. [________________________________________________]          │
│  [+ Add another priority] (max 5)                               │
│                                                                  │
│  💡 Examples: "Reduce operational costs", "Retain key staff"   │
│                                                                  │
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│  ⚠️ CURRENT CHALLENGES (optional)                                │
│  What are they struggling with? (helps focus objectives)        │
│                                                                  │
│  • [________________________________________________]           │
│  • [________________________________________________]           │
│  [+ Add another challenge] (max 5)                              │
│                                                                  │
│  ────────────────────────────────────────────────────────────── │
│                                                                  │
│  📊 Profile Completion: [██████░░░░] 70%                        │
│  "Good! This is enough for quality AI recommendations."         │
│                                                                  │
│  [Skip for Now]                        [Save & Continue]        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Wizard UX Specifications

**Progressive Disclosure**:
- All fields visible but collapsible sections
- "Business Basics" expanded by default
- Real-time completion % at bottom
- Encouraging messages as fields filled

**Completion % Messaging**:
```javascript
completionMessages = {
  0-30: "⚠️ Minimal profile - AI will generate generic recommendations",
  31-50: "📝 Basic profile - AI can generate okay recommendations",
  51-70: "✅ Good profile - AI will generate quality recommendations",
  71-100: "🎯 Complete profile - AI will generate excellent, tailored recommendations"
}
```

**Skip vs Save Logic**:
- **Skip for Now**: Saves partial profile, shows banner reminder in My Clients
- **Save & Continue**: Saves profile, proceeds to next step (Assessment or Dashboard)
- No "Cancel" button - always save progress

**Field Validation Messages**:
- Industry empty: "💡 Industry helps us provide vertical insights"
- Size both empty: "⚠️ Company size required (exact number or range)"
- Priorities < 3: "💡 3-5 priorities help focus your objectives"
- Model empty: "💡 Business model helps generate specific recommendations"

---

### Post-Wizard Actions

**If Profile 70%+ Complete**:
- Success toast: "✅ [Client Name]'s profile saved! Ready for AI-powered objectives."
- Redirect to: Company dashboard or Assessment page

**If Profile < 70%**:
- Info toast: "📝 Profile saved. Complete it later for better AI recommendations."
- Banner shown in My Clients: "Complete Profile" button with completion %

**Profile Completion Reminder**:
- Show banner in My Clients until >= 70%
- Banner dismissible but reappears next session
- When creating first objective, show inline reminder if < 70%

---

## My Clients Page Enhancements

### Current State (team-ssi-view.html)

**Existing Features**:
- Client cards showing: Name, # Teams, # Responses
- "View Results" button per client
- "Add Client" button (triggers onboarding)

**Gap**: No visibility into profile completion or ability to edit profile

---

### Enhancement #1: Profile Completion Indicator

**Add to Client Card**:

```
┌─────────────────────────────────────────────┐
│  Legency Consulting                         │
│  Real Estate | 75 employees                 │
│                                             │
│  1 Team | 1 Assessment Response             │
│                                             │
│  Profile: [████████░░] 80% ✅               │
│                                             │
│  [Complete Profile]    [View Results]       │
└─────────────────────────────────────────────┘
```

**Visual States**:
- 0-30%: Red progress bar + ⚠️ "Profile incomplete"
- 31-70%: Yellow progress bar + 📝 "Profile partial"
- 71-100%: Green progress bar + ✅ "Profile complete"

**Tooltip on Hover**:
```
Profile Completion: 80%
─────────────────
✅ Industry: Real Estate
✅ Size: 75 employees
✅ Model: Described
✅ Priorities: 4 listed
✅ Challenges: 2 listed
⚠️ Revenue: Not provided
```

---

### Enhancement #2: Profile Edit Flow

**"Complete Profile" Button Actions**:
- **If < 70%**: Opens onboarding wizard (same as initial)
- **If >= 70%**: Opens profile editor (same wizard, pre-filled)

**Edit Flow Options**:

**Option A: Modal Overlay** ✅ **RECOMMENDED**
- Opens same wizard as onboarding
- Pre-filled with existing data
- "Save Changes" button
- Quick, inline editing

**Option B: Separate Page**
- Navigate to /company-profile/:id
- More space for complex edits
- Overkill for simple fields

**Option C: Inline Edit**
- Edit fields directly in card
- Too cramped for lists (priorities, challenges)

**Decision**: **Option A** - Modal overlay with wizard

---

### Enhancement #3: Industry & Size Display

**Add to Client Card Header**:

**Before**:
```
Legency Consulting
1 Team | 1 Response
```

**After**:
```
Legency Consulting
Real Estate | 75 employees
─────────────────────────────
1 Team | 1 Assessment Response
```

**Formatting Rules**:
- Industry: Full label (not value)
- Size: Exact if provided, else range
- If both empty: "(Industry & size not specified)"

---

### Enhancement #4: Sorting & Filtering

**Filter Options** (Dropdown):
```
All Clients (12)           ▼
─────────────────────────────
By Industry:
  └─ All Industries
  └─ Legacy & Succession (3)
  └─ Professional Services (5)
  └─ Real Estate (2)
  └─ Other (2)

By Profile Status:
  └─ All Profiles
  └─ Complete (70%+) (8)
  └─ Incomplete (<70%) (4)
```

**Sort Options** (Dropdown):
```
Sort by: Name (A-Z)        ▼
─────────────────────────────
  └─ Name (A-Z)
  └─ Name (Z-A)
  └─ Profile Completion (High to Low)
  └─ Profile Completion (Low to High)
  └─ Recently Added
```

---

### Enhancement #5: Bulk Actions

**If Multiple Incomplete Profiles**:

Show banner at top of page:
```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ 4 clients have incomplete profiles (<70%)                   │
│                                                                  │
│  Complete profiles to unlock better AI recommendations          │
│  for your clients.                                              │
│                                                                  │
│  [View Incomplete Profiles]           [Remind Me Later]  [×]    │
└─────────────────────────────────────────────────────────────────┘
```

**"View Incomplete Profiles"** → Filters to incomplete only

---

### My Clients Page Mockup (Enhanced)

```
┌─────────────────────────────────────────────────────────────────┐
│  MY CLIENTS                                                     │
│                                                                  │
│  [Filter: All Industries ▼]  [Sort: Name (A-Z) ▼]  [Search...] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⚠️ 2 clients have incomplete profiles (<70%)                   │
│  [View Incomplete]  [×]                                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏢 Legency Consulting                                   │   │
│  │ Real Estate | 75 employees                              │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │ 1 Team | 1 Assessment Response                          │   │
│  │                                                         │   │
│  │ Profile: [████████░░] 80% ✅                            │   │
│  │                                                         │   │
│  │ [Edit Profile]              [View Results]             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏢 Smith Financial Group                                │   │
│  │ Legacy & Succession | 12 employees                      │   │
│  │ ─────────────────────────────────────────────────────── │   │
│  │ 2 Teams | 3 Assessment Responses                        │   │
│  │                                                         │   │
│  │ Profile: [███░░░░░░░] 30% ⚠️                            │   │
│  │                                                         │   │
│  │ [Complete Profile]          [View Results]             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [+ Add New Client]                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Orchestrator Integration

The Company Profile functionality is implemented through the **Orchestrator Architecture** using the **CompanyProvider** as a LEGO piece.

**Full architecture details**: [ORCHESTRATOR_ARCHITECTURE.md](../../2-TECHNICAL/ORCHESTRATOR_ARCHITECTURE.md)

### CompanyProvider (LEGO Piece)

```javascript
// server/services/providers/CompanyProvider.js

const DataProvider = require('../orchestrator/interfaces/DataProvider');
const Company = require('../../models/Company');

class CompanyProvider extends DataProvider {
  constructor() {
    super('company');
  }

  /**
   * Get company data for context assembly
   * Extracts AI-relevant subset from existing business_context
   */
  async getData(params, fields) {
    const company = await Company.findById(params.company_id);
    if (!company) return null;

    // Extract AI-critical fields from existing business_context
    const bc = company.business_context || {};

    return {
      // Core fields
      name: company.name,
      industry: company.industry || 'Not specified',
      employee_count: company.employee_count || 50,

      // From business_context (already exists in Company Profile page)
      business_model: bc?.profile?.business_model || 'Not provided',
      priority_one: bc?.strategic_vision?.priority_one || 'Not specified',
      biggest_blocker: bc?.strategic_vision?.biggest_blocker || 'Not specified',
      revenue_range: bc?.metrics?.current?.annual_revenue || 'Not provided',

      // Profile completion calculation
      profile_completion: this.calculateProfileCompletion(company)
    };
  }

  /**
   * Calculate profile completion based on 6 AI-critical fields
   */
  calculateProfileCompletion(company) {
    const bc = company.business_context || {};

    const aiCriticalFields = {
      industry: company.industry,
      size: company.employee_count,
      description: bc?.profile?.description,
      business_model: bc?.profile?.business_model,
      priority: bc?.strategic_vision?.priority_one,
      blocker: bc?.strategic_vision?.biggest_blocker
    };

    const filled = Object.values(aiCriticalFields).filter(Boolean).length;
    const percentage = Math.round((filled / 6) * 100);

    return {
      percentage,
      status: percentage >= 70 ? 'complete' : percentage >= 30 ? 'partial' : 'minimal',
      missing_fields: Object.keys(aiCriticalFields).filter(k => !aiCriticalFields[k])
    };
  }

  /**
   * Store company data (updates business_context)
   */
  async storeData(data) {
    const company = await Company.findByIdAndUpdate(
      data.company_id,
      { $set: data.updates },
      { new: true }
    );

    // Emit event for workflow suggestions
    await this.emitEvent('updated', { company_id: company._id });
    return company;
  }
}

module.exports = new CompanyProvider();
```

---

### Context Assembly Usage

When creating objectives, the orchestrator assembles company context:

```javascript
// Using the Orchestrator's ContextAssemblyService
const context = await orchestrator.contextAssembly.assembleContext(
  'CREATE_OBJECTIVE',
  { company_id: req.params.companyId }
);

// Returns:
{
  company: {
    name: "Legency Consulting",
    industry: "Real Estate",
    employee_count: 75,
    business_model: "Multi-location residential brokerage...",
    priority_one: "Increase lead conversion",
    biggest_blocker: "Information silos between offices",
    profile_completion: { percentage: 83, status: "complete" }
  },
  assessment: { ... },
  behavior: { ... },
  _metadata: { completeness: { company: "complete", ... } }
}
```

---

### Graceful Degradation

**If Profile Incomplete or Missing**:

The orchestrator handles missing data through configuration fallbacks:

```json
// config/context-rules.json
{
  "CREATE_OBJECTIVE": {
    "requires": [
      {
        "provider": "company",
        "fields": ["name", "industry", "business_context"],
        "priority": "required",
        "fallback": { "industry": "Not specified", "business_model": "Generic recommendations" }
      }
    ]
  }
}
```

**LLM Behavior by Completion Level**:

| Completion | LLM Approach |
|------------|--------------|
| **0-30%** (Minimal) | Generic KRs, acknowledge limited context in guidance |
| **31-50%** (Basic) | Some specificity, still generic language |
| **51-70%** (Good) | Industry-aware KRs, some priority alignment |
| **71-100%** (Complete) | Highly specific KRs, priority-aligned, challenge-addressed |

---

### Warning Display (Frontend)

**Screen 2 of Objective Wizard** - If profile < 70%:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ COMPANY PROFILE INCOMPLETE (40%)                            │
│                                                                  │
│  AI recommendations will be generic without more context.       │
│                                                                  │
│  [Complete Profile Now]      [Continue with Generic KRs]        │
└─────────────────────────────────────────────────────────────────┘
```

**If consultant chooses "Continue"**:
- Generate KRs anyway (graceful degradation)
- Show notice in guidance: "Complete company profile for more specific recommendations"

---

## Implementation Plan

**Note**: Company Profile is now part of the **Orchestrator Architecture** (Epic H). The Company Profile page already exists and works - we're adding CompanyProvider to extract AI-relevant context.

### Related Sprint 22 Epics

| Epic | Points | Focus |
|------|--------|-------|
| **Epic H: Orchestrator Services** | 10 pts | ContextAssembly, Workflow, Presentation + CompanyProvider |
| **Epic B: My Clients Enhancements** | 5 pts | Profile completion UI, filtering, sorting |
| **Epic I: Personal Profile** | 5 pts | PersonProvider + personal-profile.html |

---

### Epic H: Orchestrator Services (10 Story Points)

#### Story H1: Core Orchestrator Services (4 pts)
```
AS A system
I WANT configuration-driven orchestration services
SO THAT LEGO pieces can be connected without hardcoding

Acceptance Criteria:
- ContextAssemblyService implemented with provider registration
- WorkflowService implemented with event handling
- PresentationService implemented with formatting rules
- JSON config files (context-rules, workflow-rules, presentation-rules)
- Feature flag FEATURE_ORCHESTRATOR_ENABLED

Files:
- server/services/orchestrator/ContextAssemblyService.js (new)
- server/services/orchestrator/WorkflowService.js (new)
- server/services/orchestrator/PresentationService.js (new)
- server/services/orchestrator/config/*.json (new)
```

#### Story H2: CompanyProvider LEGO Piece (3 pts)
```
AS A developer
I WANT CompanyProvider to extract AI context from business_context
SO THAT LLM can access company data without duplicating fields

Acceptance Criteria:
- CompanyProvider extends DataProvider interface
- getData() extracts AI-critical fields from business_context
- calculateProfileCompletion() based on 6 AI fields
- Auto-registers with orchestrator on startup
- Unit tests for extraction and completion calculation

Files:
- server/services/providers/CompanyProvider.js (new)
- server/services/orchestrator/interfaces/DataProvider.js (new)
```

#### Story H3: Orchestrator API Routes (3 pts)
```
AS A frontend developer
I WANT API endpoints for context assembly and presentation
SO THAT UI can request formatted data

Acceptance Criteria:
- GET /api/orchestrator/context/:action - assemble context
- GET /api/orchestrator/present/:component - format for UI
- POST /api/orchestrator/event - emit workflow events
- Graceful fallback when orchestrator disabled

Files:
- server/routes/orchestrator.js (new)
- server/index.js (register route)
```

---

### Epic B: My Clients Enhancements (5 Story Points)

#### Story B1: Profile Completion Indicator (2 pts)
```
AS A consultant
I WANT to see profile completion on client cards
SO THAT I know which clients need profile updates

Acceptance Criteria:
- Profile completion % from orchestrator/present endpoint
- Progress bar with color coding (red/yellow/green)
- Tooltip shows which AI fields are missing

Files:
- client/pages/scripts/team-ssi-view.js (enhance cards)
```

#### Story B2: Client Card Enhancements (2 pts)
```
AS A consultant
I WANT industry and size visible on client cards
SO THAT I can quickly identify client context

Acceptance Criteria:
- Industry and employee count in card header
- "Edit Profile" redirects to company-profile.html
- SSI mini-bars when assessment exists

Files:
- client/pages/scripts/team-ssi-view.js (update render)
```

#### Story B3: Filtering & Sorting (1 pt)
```
AS A consultant
I WANT to filter and sort my clients
SO THAT I can find specific clients quickly

Acceptance Criteria:
- Filter by industry and profile completion status
- Sort by name, completion %, recently added

Files:
- client/pages/scripts/team-ssi-view.js (add filters)
```

---

### Integration Dependencies

**Depends On**:
- ✅ Company model with business_context (already exists)
- ✅ Company Profile page (already exists)
- ✅ Assessment model (for SSI scores)

**Blocks**:
- Epic D: LLM Orchestration (uses CompanyProvider context)
- Epic E: Objective Wizard Screen 2 (uses profile completion check)

---

### Testing Strategy

**Unit Tests**:
- Company model validation rules
- Profile completion virtual calculation
- CompanyProfileService context assembly
- Format helpers (industry, size, revenue)

**Integration Tests**:
- Wizard saves profile correctly
- Profile updates via edit flow
- Filter/sort in My Clients page
- Migration script for existing companies

**User Acceptance Tests** (BST):
```
SCENARIO: Consultant onboards new client with full profile
GIVEN consultant is on My Clients page
WHEN they click "Add Client"
  AND fill out basic info + profile wizard (100% completion)
  AND click "Save & Continue"
THEN profile is saved
  AND client card shows 100% completion with ✅
  AND profile data is available for LLM context

SCENARIO: Consultant skips profile during onboarding
GIVEN consultant is in profile wizard
WHEN they click "Skip for Now"
THEN partial profile is saved
  AND client card shows completion % < 70% with ⚠️
  AND banner reminder shown in My Clients
  AND LLM can still generate KRs (generic mode)

SCENARIO: Consultant edits existing profile
GIVEN client has partial profile (50%)
WHEN consultant clicks "Complete Profile"
  AND fills missing fields
  AND saves changes
THEN completion increases
  AND "Complete Profile" changes to "Edit Profile"
  AND LLM gets updated context for next objective
```

---

## Success Criteria

### Beta Launch Criteria

**Must Have** (Sprint 22):
- ✅ CompanyProvider extracting AI context from business_context
- ✅ Orchestrator services (Context, Workflow, Presentation)
- ✅ Profile completion indicator on client cards
- ✅ Edit profile redirects to Company Profile page
- ✅ Graceful degradation if profile incomplete

**Nice to Have** (Post-Beta):
- ⚠️ Industry-specific field recommendations
- ⚠️ Bulk profile completion reminders
- ⚠️ Profile analytics (which fields most valuable for KR quality)

### Success Metrics (3-Month Beta)

**Adoption**:
- **Target**: 80% of companies have >= 70% profile completion
- **Measure**: Average profile completion % across all companies

**Quality Impact**:
- **Target**: KRs from complete profiles rated 20% higher than incomplete
- **Measure**: Consultant satisfaction survey on AI KR quality

**Workflow**:
- **Target**: < 5 minutes average time to complete profile wizard
- **Measure**: Wizard session duration tracking

**Completion Drivers**:
- **Target**: 60% complete profile during initial onboarding
- **Target**: 30% complete profile via edit flow after reminder
- **Target**: 10% never complete (acceptable)

---

## Open Questions & Decisions

### Resolved in Session #165

✅ **Q1**: Required vs optional fields?
- **A**: All optional, but warnings for < 70% completion

✅ **Q2**: When to collect profile?
- **A**: Immediate during onboarding (Option A)

✅ **Q3**: Exact vs range for employee count?
- **A**: Both options available (consultant chooses)

✅ **Q4**: Industry list size?
- **A**: 9 core industries + Other

✅ **Q5**: Separate field vs reuse business_context?
- **A**: **REVISED** - Use existing `business_context` (SINGLE SOURCE OF TRUTH)
- CompanyProvider extracts AI-relevant subset, no duplicate fields
- Company Profile page already exists and works

✅ **Q6**: Orchestrator architecture?
- **A**: Configuration-driven with 3 services (Context, Workflow, Presentation)
- JSON config files, auto-registration, feature flags
- See [ORCHESTRATOR_ARCHITECTURE.md](../../2-TECHNICAL/ORCHESTRATOR_ARCHITECTURE.md)

### For Future Sessions

❓ **Q7**: Which 3-5 industries to seed with vertical insights first?
- Session #166 (LLM Orchestration)

❓ **Q8**: Mobile experience for wizard?
- Design session (likely desktop-only for Beta)

---

## Related Documents

**Foundation**:
- [BETA_FINAL_STRATEGY_2026.md](../roadmap/BETA_RELEASE_PROJECT/BETA_FINAL_STRATEGY_2026.md) - Overall Sprint 22 strategy
- [OBJECTIVE_CREATION_STRATEGY.md](./OBJECTIVE_CREATION_STRATEGY.md) - 3-screen wizard that uses company profile

**Technical**:
- [ORCHESTRATOR_ARCHITECTURE.md](../../2-TECHNICAL/ORCHESTRATOR_ARCHITECTURE.md) - Orchestrator + LEGO piece architecture
- [objective_kr_generation_prompt.md](../../2-TECHNICAL/AI-PROMPTS/objective_kr_generation_prompt.md) - LLM prompt template structure
- Company.js - Existing Company model with business_context (Epic K)

**To Be Created**:
- `LLM_ORCHESTRATION_STRATEGY.md` (Session #166) - Vertical insights, context caching
- `ASSESSMENT_ENHANCEMENT_STRATEGY.md` (Session #167) - Sub-dimension tracking

**Session Plan**:
- [SESSION_165_COMPANY_PROFILE.md](../../3-DELIVERY/1-SPRINTS/SPRINT-22-Beta_Final/session-plans/SESSION_165_COMPANY_PROFILE.md)

---

## Appendix: Example Scenarios

### Scenario 1: Complete Profile (100%)

**Company**: Legency Consulting
**Industry**: Real Estate
**Size**: 75 employees
**Revenue**: $5M-$10M
**Model**: "Multi-location residential real estate brokerage with 20 agents across 3 offices in the southeast region."
**Priorities**:
1. Increase lead conversion rate
2. Improve agent productivity
3. Reduce operational costs
4. Enhance customer satisfaction
5. Expand market share

**Challenges**:
1. "Information silos between offices causing duplicate work and missed handoffs"
2. "High agent turnover (30% annually) losing institutional knowledge"

**LLM Context Generated**:
```json
{
  "company": {
    "name": "Legency Consulting",
    "industry": "Real Estate Services",
    "size": "75 employees",
    "revenue_range": "$5M-$10M",
    "business_model": "Multi-location residential real estate brokerage with 20 agents across 3 offices in the southeast region.",
    "business_priorities": [
      "Increase lead conversion rate",
      "Improve agent productivity",
      "Reduce operational costs",
      "Enhance customer satisfaction",
      "Expand market share"
    ],
    "current_challenges": [
      "Information silos between offices causing duplicate work and missed handoffs",
      "High agent turnover (30% annually) losing institutional knowledge"
    ]
  },
  "_metadata": {
    "completion_percentage": 100,
    "completion_status": "complete",
    "missing_fields": [],
    "has_minimal_context": true
  }
}
```

**LLM Output Quality**: Highly specific KRs addressing information silos, agent productivity, and multi-location coordination challenges.

---

### Scenario 2: Partial Profile (50%)

**Company**: Smith Financial Group
**Industry**: Legacy & Succession Planning
**Size**: 12 employees
**Revenue**: (not provided)
**Model**: (not provided)
**Priorities**:
1. Client retention

**Challenges**: (none provided)

**LLM Context Generated**:
```json
{
  "company": {
    "name": "Smith Financial Group",
    "industry": "Legacy & Succession Planning",
    "size": "12 employees",
    "revenue_range": "Not provided",
    "business_model": "Not provided - KRs will be more generic",
    "business_priorities": ["Client retention"],
    "current_challenges": []
  },
  "_metadata": {
    "completion_percentage": 50,
    "completion_status": "partial",
    "missing_fields": ["revenue_range", "business_model", "business_priorities", "current_challenges"],
    "has_minimal_context": true
  }
}
```

**LLM Output Quality**: Okay KRs with some industry specificity (legacy succession patterns) but generic without business model and challenge context.

---

### Scenario 3: Minimal Profile (20%)

**Company**: ABC Services
**Industry**: (not provided)
**Size**: 50 employees
**Revenue**: (not provided)
**Model**: (not provided)
**Priorities**: (none)
**Challenges**: (none)

**LLM Context Generated**:
```json
{
  "company": {
    "name": "ABC Services",
    "industry": "Not specified",
    "size": "50 employees",
    "revenue_range": "Not provided",
    "business_model": "Not provided - KRs will be more generic",
    "business_priorities": [],
    "current_challenges": []
  },
  "_metadata": {
    "completion_percentage": 20,
    "completion_status": "minimal",
    "missing_fields": ["industry_vertical", "revenue_range", "business_model", "business_priorities", "current_challenges"],
    "has_minimal_context": false
  }
}
```

**LLM Output Quality**: Very generic KRs ("Improve efficiency", "Increase productivity") with generic guidance. Consultant should complete profile for better results.

---

**Document Owner**: Product Team
**Created**: April 20, 2026 (Session #165)
**Revised**: April 20, 2026 (Session #165 - Orchestrator Architecture)
**Status**: Active - Ready for Implementation (Sprint 22)
**Next Session**: [SESSION_166_LLM_ORCHESTRATION.md](../../3-DELIVERY/1-SPRINTS/SPRINT-22-Beta_Final/session-plans/SESSION_166_LLM_ORCHESTRATION.md)

