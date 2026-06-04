# Epic J: Assessment Credibility

**Epic**: J
**Sprint**: 10
**Story Points**: 28
**Priority**: P0
**Status**: PLANNING

---

## Purpose

The assessment must produce **reliable 12-block SSI scores**. If the scores aren't credible, the entire SSI Diagnostic Report loses value.

**Current Problem**: Templates can have 0 questions in some blocks, leading to skewed or incomplete SSI scores.

**Solution**: Modular question system with guaranteed coverage.

---

## Problem Statement

### Current Issues

1. **Block Coverage Gaps**: Templates only require 10+ questions, but scoring needs all 12 blocks
2. **No Industry Context**: Questions are generic, not tailored to Financial Services
3. **Mixed Taxonomies**: Legacy subcategories mixed with MECE 12-block structure
4. **Response Scale Inconsistency**: Different question types need different scales

### Impact

- SSI scores may be inaccurate if blocks have 0-1 questions
- Consultants can't create industry-specific assessments
- Client perceives assessment as "off-the-shelf" not tailored

---

## Solution: Modular Question System

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUESTION MODULES                              │
├─────────────────────────────────────────────────────────────────┤
│  CORE MODULE (24 questions - always available)                   │
│  ├── 2 questions per block (1 Quantitative + 1 Qualitative)     │
│  ├── Ensures all 12 blocks have coverage                        │
│  └── NOT locked - can be deselected, but shows warning          │
├─────────────────────────────────────────────────────────────────┤
│  INDUSTRY MODULE: Financial Services (6 questions)              │
│  ├── AUM growth and client retention                            │
│  ├── Succession planning and advisor coverage                   │
│  └── Compliance and regulatory alignment                        │
├─────────────────────────────────────────────────────────────────┤
│  ROLE MODULES (Executive, Manager - 8 questions)                 │
│  ├── Executive: Strategic vision, board alignment               │
│  └── Manager: Team productivity, resource allocation            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stories

| Story | Points | Description |
|-------|--------|-------------|
| J1 | 5 | Module system database schema |
| J2 | 3 | Core questions seed (24 questions) |
| J3 | 3 | Financial Services industry questions (6 questions) |
| J4 | 2 | Role questions (executive, manager - 8 questions) |
| J5 | 5 | Module-filtered questions API |
| J6 | 6 | Step 1: Select Questions UI |
| J7 | 2 | Step 2: Configure Template UI |
| J8 | 2 | Step 3: Review & Save UI |
| **Total** | **28** | |

---

## Story J1: Module System Database Schema (5 pts)

### User Story

**As a** system administrator
**I want** questions organized into modules (Core, Industry, Role)
**So that** templates can be built with guaranteed block coverage

### Acceptance Criteria

- [ ] `module_type` field added to AssessmentQuestion model
- [ ] `question_subtype` field added (quantitative/qualitative)
- [ ] `industry_tags` array field added (uses industries.js enum)
- [ ] `role_tags` array field added
- [ ] `block` field added for explicit 12-block mapping
- [ ] Migration script updates existing questions to `module_type: 'legacy'`
- [ ] All new fields have appropriate defaults (non-breaking)

### Schema Changes

```javascript
// server/models/AssessmentQuestion.js

// IMPORTANT: Import shared industry config
const { getIndustryTagsEnum } = require('../config/industries');

// Add these fields to schema:

module_type: {
  type: String,
  enum: ['core', 'industry', 'role', 'legacy'],
  default: 'legacy',
  index: true,
  description: 'Module classification for question organization'
},

question_subtype: {
  type: String,
  enum: ['quantitative', 'qualitative'],
  description: 'Quantitative (percentage scale) or Qualitative (maturity scale)'
},

industry_tags: {
  type: [String],
  default: [],
  enum: getIndustryTagsEnum(),
  description: 'Industries this question applies to'
},

role_tags: {
  type: [String],
  default: [],
  enum: ['executive', 'manager', 'operations', 'sales', 'technical'],
  description: 'Roles this question targets'
},

block: {
  type: String,
  enum: [
    'delivery', 'decisions', 'change', 'response',  // Speed
    'financial', 'operations', 'people', 'quality',  // Strength
    'market', 'data', 'strategy', 'learning'         // Intelligence
  ],
  description: 'Explicit 12-block MECE mapping'
}
```

### Migration Script

```javascript
// scripts/migrate-questions-to-modules.js
async function migrateQuestionsToModules() {
  // Tag all existing questions as legacy
  await AssessmentQuestion.updateMany(
    { module_type: { $exists: false } },
    {
      $set: {
        module_type: 'legacy',
        block: '$category' // Copy category to block
      }
    }
  );

  console.log('Migration complete: All existing questions tagged as legacy');
}
```

---

## Story J2: Core Questions Seed (3 pts)

### User Story

**As a** system administrator
**I want** 24 core questions seeded (2 per block x 12 blocks)
**So that** every template has baseline block coverage available

### Acceptance Criteria

- [ ] 24 questions created (1 quantitative + 1 qualitative per block)
- [ ] Each of 12 blocks has exactly 2 questions
- [ ] Questions tagged with `module_type: 'core'`
- [ ] Quantitative questions use percentage scale (0-20%, 21-40%, etc.)
- [ ] Qualitative questions use maturity scale (Never, Sometimes, Usually, Always)
- [ ] Questions are industry-agnostic (apply to any business)

### Core Questions Design

**Response Scales**:

| Subtype | Scale | Scoring |
|---------|-------|---------|
| Quantitative | 0-20%, 21-40%, 41-60%, 61-80%, 81-100% | 20, 40, 60, 80, 100 |
| Qualitative | Never, Sometimes, Usually, Always | 25, 50, 75, 100 |

### Sample Core Questions

```javascript
// server/seeds/core-questions.js

const CORE_QUESTIONS = [
  // SPEED - Delivery
  {
    module_type: 'core',
    dimension: 'speed',
    block: 'delivery',
    question_subtype: 'quantitative',
    question_text: 'What percentage of projects are delivered on or before the committed deadline?',
    response_options: [
      { text: '0-20%', score: 20 },
      { text: '21-40%', score: 40 },
      { text: '41-60%', score: 60 },
      { text: '61-80%', score: 80 },
      { text: '81-100%', score: 100 }
    ]
  },
  {
    module_type: 'core',
    dimension: 'speed',
    block: 'delivery',
    question_subtype: 'qualitative',
    question_text: 'How often does your team complete deliverables without requiring extensions?',
    response_options: [
      { text: 'Never', score: 25 },
      { text: 'Sometimes', score: 50 },
      { text: 'Usually', score: 75 },
      { text: 'Always', score: 100 }
    ]
  },

  // SPEED - Decisions
  {
    module_type: 'core',
    dimension: 'speed',
    block: 'decisions',
    question_subtype: 'quantitative',
    question_text: 'What percentage of strategic decisions are made within the planned timeframe?',
    // ... response_options
  },
  {
    module_type: 'core',
    dimension: 'speed',
    block: 'decisions',
    question_subtype: 'qualitative',
    question_text: 'How often are decisions made with all necessary stakeholders aligned?',
    // ... response_options
  },

  // ... Continue for all 12 blocks (24 total questions)
];
```

### Block Coverage Matrix

| Dimension | Block | Quant | Qual | Total |
|-----------|-------|-------|------|-------|
| Speed | Delivery | 1 | 1 | 2 |
| Speed | Decisions | 1 | 1 | 2 |
| Speed | Change | 1 | 1 | 2 |
| Speed | Response | 1 | 1 | 2 |
| Strength | Financial | 1 | 1 | 2 |
| Strength | Operations | 1 | 1 | 2 |
| Strength | People | 1 | 1 | 2 |
| Strength | Quality | 1 | 1 | 2 |
| Intelligence | Market | 1 | 1 | 2 |
| Intelligence | Data | 1 | 1 | 2 |
| Intelligence | Strategy | 1 | 1 | 2 |
| Intelligence | Learning | 1 | 1 | 2 |
| **Total** | | **12** | **12** | **24** |

---

## Story J3: Financial Services Industry Questions (3 pts)

### User Story

**As a** consultant serving Financial Services clients
**I want** industry-specific questions for wealth management and succession
**So that** assessments capture industry-relevant insights

### Acceptance Criteria

- [ ] 6 questions created for Financial Services
- [ ] Questions tagged with `module_type: 'industry'`
- [ ] Questions tagged with `industry_tags: ['financial_services']`
- [ ] Questions focus on: AUM, client retention, succession, compliance
- [ ] Each question maps to appropriate block

### Financial Services Questions

```javascript
// server/seeds/industry-questions-financial-services.js

const FINANCIAL_SERVICES_QUESTIONS = [
  {
    module_type: 'industry',
    industry_tags: ['financial_services'],
    dimension: 'strength',
    block: 'financial',
    question_subtype: 'quantitative',
    question_text: 'What is your current client retention rate (clients retained year-over-year)?',
    response_options: [
      { text: '0-60%', score: 20 },
      { text: '61-70%', score: 40 },
      { text: '71-80%', score: 60 },
      { text: '81-90%', score: 80 },
      { text: '91-100%', score: 100 }
    ]
  },
  {
    module_type: 'industry',
    industry_tags: ['financial_services'],
    dimension: 'strength',
    block: 'people',
    question_subtype: 'quantitative',
    question_text: 'What percentage of key advisors have documented succession plans in place?',
    response_options: [
      { text: '0-20%', score: 20 },
      { text: '21-40%', score: 40 },
      { text: '41-60%', score: 60 },
      { text: '61-80%', score: 80 },
      { text: '81-100%', score: 100 }
    ]
  },
  {
    module_type: 'industry',
    industry_tags: ['financial_services'],
    dimension: 'intelligence',
    block: 'strategy',
    question_subtype: 'qualitative',
    question_text: 'How aligned is your AUM growth strategy with your client acquisition and retention efforts?',
    response_options: [
      { text: 'Not aligned', score: 25 },
      { text: 'Somewhat aligned', score: 50 },
      { text: 'Mostly aligned', score: 75 },
      { text: 'Fully aligned', score: 100 }
    ]
  },
  {
    module_type: 'industry',
    industry_tags: ['financial_services'],
    dimension: 'speed',
    block: 'response',
    question_subtype: 'quantitative',
    question_text: 'What is your average response time to client inquiries?',
    response_options: [
      { text: 'Over 48 hours', score: 20 },
      { text: '24-48 hours', score: 40 },
      { text: '4-24 hours', score: 60 },
      { text: '1-4 hours', score: 80 },
      { text: 'Under 1 hour', score: 100 }
    ]
  },
  {
    module_type: 'industry',
    industry_tags: ['financial_services'],
    dimension: 'strength',
    block: 'quality',
    question_subtype: 'quantitative',
    question_text: 'What percentage of compliance reviews pass without remediation requirements?',
    response_options: [
      { text: '0-60%', score: 20 },
      { text: '61-70%', score: 40 },
      { text: '71-80%', score: 60 },
      { text: '81-90%', score: 80 },
      { text: '91-100%', score: 100 }
    ]
  },
  {
    module_type: 'industry',
    industry_tags: ['financial_services'],
    dimension: 'intelligence',
    block: 'market',
    question_subtype: 'qualitative',
    question_text: 'How well does your firm track and respond to competitive offerings in your market?',
    response_options: [
      { text: 'Not at all', score: 25 },
      { text: 'Informally', score: 50 },
      { text: 'Systematically', score: 75 },
      { text: 'Proactively and strategically', score: 100 }
    ]
  }
];
```

---

## Story J4: Role Questions (2 pts)

### User Story

**As a** consultant
**I want** role-specific questions for executives and managers
**So that** assessments can target specific job functions

### Acceptance Criteria

- [ ] 4 questions for Executive role
- [ ] 4 questions for Manager role
- [ ] Questions tagged with `module_type: 'role'`
- [ ] Questions tagged with appropriate `role_tags`
- [ ] 8 total questions

### Role Questions

```javascript
// server/seeds/role-questions.js

const ROLE_QUESTIONS = [
  // EXECUTIVE (4 questions)
  {
    module_type: 'role',
    role_tags: ['executive'],
    dimension: 'intelligence',
    block: 'strategy',
    question_subtype: 'qualitative',
    question_text: 'How often does the leadership team review and update strategic priorities?',
    // ...
  },
  {
    module_type: 'role',
    role_tags: ['executive'],
    dimension: 'speed',
    block: 'decisions',
    question_subtype: 'qualitative',
    question_text: 'How effectively does the board communicate decisions to the organization?',
    // ...
  },
  // ... 2 more executive questions

  // MANAGER (4 questions)
  {
    module_type: 'role',
    role_tags: ['manager'],
    dimension: 'strength',
    block: 'people',
    question_subtype: 'qualitative',
    question_text: 'How effectively do managers develop and retain top performers on their teams?',
    // ...
  },
  {
    module_type: 'role',
    role_tags: ['manager'],
    dimension: 'strength',
    block: 'operations',
    question_subtype: 'quantitative',
    question_text: 'What percentage of team resources are allocated to high-priority initiatives?',
    // ...
  },
  // ... 2 more manager questions
];
```

---

## Story J5: Module-Filtered Questions API (5 pts)

### User Story

**As a** template creator
**I want** to fetch questions filtered by module, industry, and role
**So that** I can build targeted assessment templates

### Acceptance Criteria

- [ ] `GET /api/assessment-questions` supports `?module=core`
- [ ] `GET /api/assessment-questions` supports `?industry=financial_services`
- [ ] `GET /api/assessment-questions` supports `?role=executive`
- [ ] Response includes module metadata and counts
- [ ] Response can be grouped by module → dimension → block
- [ ] Supports multiple filters: `?module=core,industry&industry=financial_services`

### API Enhancement

```javascript
// server/routes/assessments.js

// GET /api/assessment-questions
router.get('/questions', authenticateToken, async (req, res) => {
  const { module, industry, role, grouped } = req.query;

  // Build filter
  const filter = {};

  if (module) {
    const modules = module.split(',');
    filter.module_type = { $in: modules };
  }

  if (industry) {
    filter.industry_tags = industry;
  }

  if (role) {
    filter.role_tags = role;
  }

  const questions = await AssessmentQuestion.find(filter).sort({ dimension: 1, block: 1 });

  // If grouped=true, organize by module → dimension → block
  if (grouped === 'true') {
    const groupedData = groupQuestions(questions);
    return res.json({
      success: true,
      data: questions,
      grouped: groupedData,
      modules: getModuleSummary(questions)
    });
  }

  res.json({
    success: true,
    data: questions,
    count: questions.length
  });
});

function groupQuestions(questions) {
  const grouped = {
    core: { speed: {}, strength: {}, intelligence: {} },
    industry: {},
    role: {}
  };

  questions.forEach(q => {
    const module = q.module_type;
    const dim = q.dimension;
    const block = q.block;

    if (module === 'core') {
      if (!grouped.core[dim][block]) grouped.core[dim][block] = [];
      grouped.core[dim][block].push(q);
    } else if (module === 'industry') {
      q.industry_tags.forEach(tag => {
        if (!grouped.industry[tag]) grouped.industry[tag] = [];
        grouped.industry[tag].push(q);
      });
    } else if (module === 'role') {
      q.role_tags.forEach(tag => {
        if (!grouped.role[tag]) grouped.role[tag] = [];
        grouped.role[tag].push(q);
      });
    }
  });

  return grouped;
}

function getModuleSummary(questions) {
  return {
    core: {
      count: questions.filter(q => q.module_type === 'core').length,
      description: 'Core questions - 2 per block for full coverage'
    },
    industry: {
      count: questions.filter(q => q.module_type === 'industry').length,
      industries: [...new Set(questions.flatMap(q => q.industry_tags))]
    },
    role: {
      count: questions.filter(q => q.module_type === 'role').length,
      roles: [...new Set(questions.flatMap(q => q.role_tags))]
    }
  };
}
```

### Response Format

```json
{
  "success": true,
  "data": [ /* array of questions */ ],
  "grouped": {
    "core": {
      "speed": {
        "delivery": [ /* questions */ ],
        "decisions": [ /* questions */ ],
        "change": [ /* questions */ ],
        "response": [ /* questions */ ]
      },
      "strength": { /* ... */ },
      "intelligence": { /* ... */ }
    },
    "industry": {
      "financial_services": [ /* questions */ ]
    },
    "role": {
      "executive": [ /* questions */ ],
      "manager": [ /* questions */ ]
    }
  },
  "modules": {
    "core": { "count": 24, "description": "Core questions..." },
    "industry": { "count": 6, "industries": ["financial_services"] },
    "role": { "count": 8, "roles": ["executive", "manager"] }
  }
}
```

---

## Story J6: Step 1 - Select Questions UI (6 pts)

### User Story

**As a** consultant
**I want** a left-right layout to select questions from modules
**So that** I can build assessment templates efficiently

### Acceptance Criteria

- [ ] Left sidebar with module tabs (Core, Industry, Role)
- [ ] Industry dropdown shown when Industry tab active
- [ ] Role dropdown shown when Role tab active
- [ ] Collapsible category tree (Dimension → Block)
- [ ] Right panel shows questions for selected category
- [ ] Questions display Quant/Qual badges
- [ ] Checkbox selection with Select All / Deselect All
- [ ] Selection persists in localStorage
- [ ] Footer shows: total selected + block coverage status
- [ ] Block coverage warning if any block has 0 questions
- [ ] "Next Step" button navigates to Step 2

### Wireframe

```
┌────────────────────────────────────────────────────────────────────────┐
│  Create Assessment Template                                             │
│  Step 1 of 3: Select Questions                                          │
├──────────────────────────────────┬─────────────────────────────────────┤
│  LEFT SIDEBAR (280px)            │  RIGHT PANEL (flex-1)               │
│                                  │                                      │
│  ┌─────────────────────────────┐ │  ┌──────────────────────────────────┐│
│  │ MODULE TABS                 │ │  │ PANEL HEADER                     ││
│  │ [Core] [Industry] [Role]    │ │  │ "Delivery" - Speed · 4 questions ││
│  └─────────────────────────────┘ │  │ [Select All] [Deselect All]      ││
│                                  │  └──────────────────────────────────┘│
│  ┌─────────────────────────────┐ │                                      │
│  │ DROPDOWN (context-based)    │ │  ┌──────────────────────────────────┐│
│  │ Industry: [Financial Svcs ▼]│ │  │ QUESTION LIST                    ││
│  │                             │ │  │                                  ││
│  │ - or -                      │ │  │ ☑ [Quant] What % of projects...  ││
│  │                             │ │  │ ☑ [Qual] How often does your...  ││
│  │ Role: [Executive ▼]         │ │  │ ☐ [Quant] What percentage of...  ││
│  └─────────────────────────────┘ │  │ ☐ [Qual] Rate your team's...     ││
│                                  │  │                                  ││
│  ┌─────────────────────────────┐ │  └──────────────────────────────────┘│
│  │ CATEGORY TREE               │ │                                      │
│  │                             │ │                                      │
│  │ ▼ Speed (8 selected)        │ │                                      │
│  │   ├─ Delivery (2) ← active  │ │                                      │
│  │   ├─ Decisions (2)          │ │                                      │
│  │   ├─ Change (2)             │ │                                      │
│  │   └─ Response (2)           │ │                                      │
│  │                             │ │                                      │
│  │ ▶ Strength (8 selected)     │ │                                      │
│  │ ▶ Intelligence (8 selected) │ │                                      │
│  └─────────────────────────────┘ │                                      │
│                                  │                                      │
├──────────────────────────────────┴─────────────────────────────────────┤
│  FOOTER BAR                                                             │
│  24 questions selected · 12/12 blocks covered ✓       [Back] [Next →]   │
│  ─ or ─                                                                 │
│  18 questions selected · ⚠ 2 blocks missing coverage  [Back] [Next →]   │
└────────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Page**: `client/pages/assessment-template-step1.html`

**State Management**:
```javascript
// client/js/template-creation.js
const TemplateWizard = {
  state: {
    selectedQuestions: [],   // Array of question IDs
    currentModule: 'core',   // 'core' | 'industry' | 'role'
    currentIndustry: null,   // 'financial_services' | etc.
    currentRole: null,       // 'executive' | 'manager' | etc.
    currentDimension: 'speed',
    currentBlock: 'delivery'
  },

  getBlockCoverage() {
    const blocks = new Set();
    this.state.selectedQuestions.forEach(qId => {
      const question = this.getQuestionById(qId);
      blocks.add(question.block);
    });
    return {
      covered: blocks.size,
      total: 12,
      missingBlocks: ALL_BLOCKS.filter(b => !blocks.has(b))
    };
  },

  saveToLocalStorage() {
    localStorage.setItem('template_wizard_state', JSON.stringify(this.state));
  },

  loadFromLocalStorage() {
    const saved = localStorage.getItem('template_wizard_state');
    if (saved) {
      this.state = JSON.parse(saved);
    }
  }
};
```

---

## Story J7: Step 2 - Configure Template UI (2 pts)

### User Story

**As a** consultant
**I want** to configure template name, description, and visibility
**So that** my template has proper metadata

### Acceptance Criteria

- [ ] Template name input (required)
- [ ] Description textarea (optional)
- [ ] Visibility toggle (Private / Company-wide)
- [ ] Estimated duration display (calculated from question count)
- [ ] "Back" returns to Step 1 (preserves selections)
- [ ] "Next" navigates to Step 3

### Wireframe

```
┌────────────────────────────────────────────────────────────────────────┐
│  Create Assessment Template                                             │
│  Step 2 of 3: Configure Template                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Template Name *                                                        │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Q1 2026 Financial Services Assessment                              │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Description (Optional)                                                 │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Quarterly assessment for wealth management firms focusing on      │ │
│  │ client retention and succession planning.                          │ │
│  │                                                                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  Visibility                                                             │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ ○ Private - Only you can use this template                        │ │
│  │ ● Company-wide - All managers in your company can use it          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Summary                                                            │ │
│  │ Questions: 30                                                      │ │
│  │ Estimated Duration: ~12 minutes                                    │ │
│  │ Block Coverage: 12/12 ✓                                           │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
├────────────────────────────────────────────────────────────────────────┤
│                                     [← Back to Questions] [Review →]    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Story J8: Step 3 - Review & Save UI (2 pts)

### User Story

**As a** consultant
**I want** to review my template before saving
**So that** I can verify all settings are correct

### Acceptance Criteria

- [ ] Summary card with name, description, estimated duration
- [ ] Question breakdown: by dimension, by module, by type (quant/qual)
- [ ] Block coverage indicator (12/12 blocks)
- [ ] Expandable question preview list by dimension
- [ ] "Back" returns to Step 2
- [ ] "Save Template" creates template and redirects to hub
- [ ] Success toast on save

### Wireframe

```
┌────────────────────────────────────────────────────────────────────────┐
│  Create Assessment Template                                             │
│  Step 3 of 3: Review & Save                                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ TEMPLATE SUMMARY                                                    ││
│  │                                                                     ││
│  │ Name: Q1 2026 Financial Services Assessment                         ││
│  │ Description: Quarterly assessment for wealth management firms...   ││
│  │ Visibility: Company-wide                                            ││
│  │ Estimated Duration: ~12 minutes                                     ││
│  │                                                                     ││
│  │ ┌─────────────────────────────────────────────────────────────────┐││
│  │ │ BREAKDOWN                                                       │││
│  │ │                                                                 │││
│  │ │ By Dimension:          By Module:           By Type:            │││
│  │ │ Speed: 10 (33%)        Core: 24             Quantitative: 15    │││
│  │ │ Strength: 12 (40%)     Industry: 4          Qualitative: 15     │││
│  │ │ Intelligence: 8 (27%)  Role: 2                                  │││
│  │ │                                                                 │││
│  │ │ Block Coverage: 12/12 ✓ (All blocks represented)                │││
│  │ └─────────────────────────────────────────────────────────────────┘││
│  │                                                                     ││
│  │ ┌─────────────────────────────────────────────────────────────────┐││
│  │ │ QUESTIONS PREVIEW                                               │││
│  │ │ ▼ Speed (10 questions)                                          │││
│  │ │   ├─ [Quant] What percentage of projects delivered on time?    │││
│  │ │   ├─ [Qual] How often does your team complete deliverables...  │││
│  │ │   └─ ... [+8 more]                                              │││
│  │ │ ▶ Strength (12 questions)                                       │││
│  │ │ ▶ Intelligence (8 questions)                                    │││
│  │ └─────────────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
├────────────────────────────────────────────────────────────────────────┤
│                                    [← Back to Configure] [Save Template]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

### Files to Create

| File | Purpose |
|------|---------|
| `client/pages/assessment-template-step1.html` | Step 1: Select Questions |
| `client/pages/assessment-template-step2.html` | Step 2: Configure |
| `client/pages/assessment-template-step3.html` | Step 3: Review & Save |
| `client/js/template-creation.js` | Shared wizard state management |
| `server/seeds/core-questions.js` | 24 core questions |
| `server/seeds/industry-questions-financial-services.js` | 6 FS questions |
| `server/seeds/role-questions.js` | 8 role questions |
| `scripts/migrate-questions-to-modules.js` | Migration script |

### Files to Modify

| File | Changes |
|------|---------|
| `server/models/AssessmentQuestion.js` | Add module fields |
| `server/routes/assessments.js` | Add module filtering to questions API |
| `client/pages/assessment-hub.html` | Update "Create Template" link |

---

## Testing Requirements

### Unit Tests

- [ ] Module filtering query builder
- [ ] Block coverage calculation
- [ ] Question grouping function

### Integration Tests

- [ ] Core questions seed execution
- [ ] Module-filtered API response
- [ ] Template creation with modular questions

### E2E Tests

- [ ] Complete 3-step wizard flow
- [ ] Module switching (Core → Industry → Role)
- [ ] Block coverage warning display
- [ ] Template save and redirect

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Core module provides 12-block coverage | 100% |
| Template creation completion rate | >90% |
| Average questions per new template | 25-35 |
| Block coverage in new templates | 12/12 |

---

## Dependencies

- Industries.js shared config (for industry enum)
- AssessmentQuestion model
- AssessmentTemplate model

---

## Related Documents

- [Sprint 10 Master Plan](./SPRINT-10-MASTER-PLAN.md)
- [Epic S Configuration](./EPIC-S-CONFIGURATION.md)
- [AssessmentQuestion Model](../../../../server/models/AssessmentQuestion.js)

---

**Story Owner**: Product Team
**Sprint**: 10
