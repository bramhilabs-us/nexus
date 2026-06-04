# Epic E: Objective Creation Wizard

<!-- @GENOME T3-SPR-023-EE | ACTIVE | 2026-04-30 | parent:T3-SPR-023-MP | auto:/coding | linked:/strategy -->

**Sprint**: 23 (carried from Sprint 22 by #183-close decision)
**Epic**: E - Objective Creation Wizard
**Points**: 10
**Priority**: P0
**Dependencies**: ✅ S22 #176 Epic A (KeyResult model + Objective `key_results_v2` virtual), ✅ S22 #177 Epic B (AIContextService), ✅ S22 #178 Epic F (`aiOKRService.generateKRs`), ✅ S22a #184e (first-objective stage hook in `objectives.js` POST — DO NOT remove during route extension)

---

## Session #172 Update

**Key Change**: Screen 3 creates Key Results in SEPARATE `KeyResult` collection (not embedded).

- Uses new `KeyResult.js` model from Epic A
- POST creates Objective first, then creates KeyResults with `objective_id`
- Disciplines loaded from `server/config/disciplines.js` config (not DB model)
- Enables proper population and KR-level analytics

---

## Overview

Implement a 3-screen wizard for objective creation that integrates discipline selection and AI-powered KR generation.

**Mockup**: [objective-wizard.html](../../sprint_mockups/sprint-22/objective-wizard.html)
**Reference**: [OBJECTIVE_CREATION_STRATEGY.md](../../../../1-PRODUCT/features/OBJECTIVE_CREATION_STRATEGY.md)
**Implementation file**: `client/pages/objective-wizard.html` (update in place — already exists in production with the 3-screen scaffold + step indicator + nav. Sprint 22 changes the per-screen content fields only).
**Implementation script**: `client/pages/scripts/objective-wizard.js` (EXTEND existing file — D-E-5; spec previously said CREATE which was wrong). Add SSI impact dropdowns, discipline selector grouped by 4 foundations (D-A-5), AI KR generation, and KeyResult collection writes (D-A-1 dual-write, D-E-7).
**Navigation lock**: Production `<nav>` block + `/js/navigation.js` already present. Do not alter.

---

## Wizard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 1: Define Objective                                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Objective Title                                          │   │
│  │ [What do you want to achieve?                         ]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Category:  ( ) Growth  ( ) Operations  ( ) People  ( ) Finance│
│                                                                  │
│  SSI Impact (optional):                                         │
│  [Speed ▼]  [Decision Making ▼]  ← Auto-suggested from SSI     │
│                                                                  │
│                                        [Cancel]  [Next →]       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 2: Select Behaviors (1-3 recommended)                   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ DISCIPLINE                                                   ││
│  │ [x] Truth - Honesty and transparency                        ││
│  │ [ ] Ownership - Full responsibility for outcomes             ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ GROWTH                                                       ││
│  │ [x] Follow-through - Completing commitments                  ││
│  │ [ ] Influence - Positively impacting decisions               ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ ACCOUNTABILITY                                               ││
│  │ [ ] Execution - Consistently delivering results              ││
│  │ [ ] Responsiveness - Timely reactions                        ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ MATURITY                                                     ││
│  │ [ ] Health Balance  [ ] Learning  [ ] Collaboration          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Selected: 2/3 recommended                                      │
│                                                                  │
│                              [← Back]  [Skip]  [Next →]         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SCREEN 3: Key Results                                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [✨ Generate with AI]                [+ Add Manually]    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ KR 1: Reduce decision turnaround from 5 days to 2 days   │   │
│  │       Target: 2 days  |  Current: 5 days  |  [Edit] [✓]  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ KR 2: Achieve 95% on-time project delivery               │   │
│  │       Target: 95%  |  Current: 78%  |  [Edit] [✓]        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ KR 3: Complete weekly team sync with 100% attendance     │   │
│  │       Target: 100%  |  Current: 60%  |  [Edit] [✓]       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  AI Guidance: "Focus on measurable time/cost metrics..."       │
│                                                                  │
│                              [← Back]  [Create Objective]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Screen 1: Define Objective

### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | Text | Yes | Min 10 chars, max 200 |
| category | Radio | Yes | growth, operations, people_culture, financial_health |
| ssi_impact.area | Dropdown | No | speed, strength, intelligence |
| ssi_impact.sub_dimension | Dropdown | No | Based on area selection |

### Auto-Suggestions (D-E-4 corrected reference, D-E-8 empty-state behavior)

If the user has a completed assessment with a `constraint`, auto-suggest SSI impact. Otherwise dropdowns render empty (no nag, no warning).

```javascript
const AIContextService = require('../services/AIContextService');
const ctx = await AIContextService.assembleContext('objective-creation', { company_id });
if (ctx.assessment?.constraint) {
  const { dimension, sub_dimension } = ctx.assessment.constraint;
  // Auto-select in dropdown
}
// else: leave dropdowns empty/placeholder
```

---

## Screen 2: Behavior Selection

### UI Component (D-A-5 / D-E-3 — 4 foundations)

```html
<div class="discipline-selector">
  <!-- Render one group per foundation: discipline / growth / accountability / maturity -->
  <div class="foundation-group" data-foundation="discipline">
    <h4 class="foundation-header">Discipline</h4>
    <div class="discipline-options">
      <label class="discipline-option">
        <input type="checkbox" name="discipline_ids" value="truth">
        <div class="discipline-content">
          <span class="discipline-name">Truth</span>
          <span class="discipline-desc">Honesty and transparency</span>
        </div>
      </label>
      <!-- ownership, follow_through -->
    </div>
  </div>
  <!-- foundation: growth (foresight, alignment) -->
  <!-- foundation: accountability (consistency, handoffs) -->
  <!-- foundation: maturity (energy_stewardship, formation) -->
</div>

<div class="selection-counter">
  Selected: <span id="selected-count">0</span>/3 recommended
</div>
```

### Discipline Selection Logic

```javascript
const MAX_DISCIPLINES = 5;
const RECOMMENDED_DISCIPLINES = 3;

function updateDisciplineSelection() {
  const selected = document.querySelectorAll('input[name="discipline_ids"]:checked');
  const count = selected.length;
  document.getElementById('selected-count').textContent = count;

  if (count > RECOMMENDED_DISCIPLINES) {
    showWarning('More than 3 disciplines may dilute focus');
  }
  if (count >= MAX_DISCIPLINES) {
    document.querySelectorAll('input[name="discipline_ids"]:not(:checked)')
      .forEach(cb => cb.disabled = true);
  }
}
```

---

## Screen 3: Key Results

### Generate with AI

```javascript
async function generateKRsWithAI() {
  showLoadingState();

  try {
    const response = await fetch('/api/objectives/generate-krs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: wizardState.title,
        category: wizardState.category,
        behavior_ids: wizardState.discipline_ids,
        ssi_impact: wizardState.ssi_impact
      })
    });

    const { data } = await response.json();
    renderKRs(data.key_results);
    showGuidance(data.ai_guidance);

  } catch (error) {
    showError('AI generation failed. Please add KRs manually.');
    showManualEntry();
  }
}
```

### Manual KR Entry

```html
<div class="kr-manual-entry">
  <input type="text" placeholder="Key Result description" class="kr-description">
  <div class="kr-metrics">
    <input type="text" placeholder="Target value" class="kr-target">
    <input type="text" placeholder="Current value" class="kr-baseline">
    <select class="kr-unit">
      <option value="number">Number</option>
      <option value="percentage">Percentage</option>
      <option value="currency">Currency</option>
      <option value="days">Days</option>
    </select>
  </div>
  <button class="add-kr">Add Key Result</button>
</div>
```

### KR Card Component

```html
<div class="kr-card" data-kr-id="temp_1">
  <div class="kr-content">
    <span class="kr-number">KR 1</span>
    <p class="kr-description">Reduce decision turnaround from 5 days to 2 days</p>
    <div class="kr-metrics">
      <span class="target">Target: 2 days</span>
      <span class="baseline">Current: 5 days</span>
    </div>
  </div>
  <div class="kr-actions">
    <button class="edit-kr" title="Edit">
      <svg><!-- Edit icon --></svg>
    </button>
    <button class="accept-kr" title="Accept">
      <svg><!-- Check icon --></svg>
    </button>
    <button class="reject-kr" title="Remove">
      <svg><!-- X icon --></svg>
    </button>
  </div>
</div>
```

---

## Objective Model Extension

**File**: `server/models/Objective.js`

```javascript
const ObjectiveSchema = new mongoose.Schema({
  // Existing fields...
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['growth', 'operations', 'people_culture', 'financial_health'],
    required: true
  },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },

  // NEW: Discipline tracking (D-E-2 — string IDs from disciplines.js config, NOT ObjectIds)
  discipline_ids: [{ type: String }],

  // NEW: SSI Impact targeting
  ssi_impact: {
    area: {
      type: String,
      enum: ['speed', 'strength', 'intelligence']
    },
    sub_dimension: { type: String }
  },

  // NEW: AI guidance stored
  ai_guidance: {
    generated: { type: Boolean, default: false },
    guidance_text: { type: String },
    generated_at: { type: Date }
  },

  // Embedded Key Results — KEPT for backwards compat (D-A-1 dual-write).
  // New code reads from KeyResult collection via virtual `key_results_v2`.
  key_results: [{
    title: { type: String, required: true },
    target_value: { type: Number, required: true },
    baseline_value: { type: Number, default: 0 },
    current_value: { type: Number, default: 0 },
    unit: { type: String, default: 'number' },
    ai_generated: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

// Virtual added by Epic A (D-A-1)
ObjectiveSchema.virtual('key_results_v2', {
  ref: 'KeyResult',
  localField: '_id',
  foreignField: 'objective_id'
});
ObjectiveSchema.set('toJSON', { virtuals: true });
ObjectiveSchema.set('toObject', { virtuals: true });
```

---

## API Endpoints

### POST /api/objectives

Create objective with discipline_ids and KRs.

```javascript
// NOTE: existing route at server/routes/objectives.js:87 uses `validateObjectiveLimit` middleware.
// D-E-6: keep middleware. If limit becomes blocker, raise via env var (no S22 code change).
const disciplines = require('../config/disciplines');

router.post('/',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE'),
  validateObjectiveLimit,
  async (req, res) => {
    try {
      const { title, description, category, discipline_ids, ssi_impact, key_results, ai_guidance } = req.body;

      // D-E-2: validate discipline_ids against config (not DB)
      if (discipline_ids?.length) {
        const invalid = discipline_ids.filter(id => !disciplines.isValid(id));
        if (invalid.length) {
          return res.status(400).json({ success: false, error: `Invalid disciplines: ${invalid.join(', ')}` });
        }
      }

      // 1. Save Objective with embedded KRs (backwards compat)
      const objective = await new Objective({
        title, description, category,
        company_id: req.user.company_id,
        owner_id:   req.user.user_id,
        discipline_ids, ssi_impact, key_results, ai_guidance
      }).save();

      // 2. D-A-1 / D-E-7 dual-write: also create KeyResult docs in separate collection
      const KeyResult = require('../models/KeyResult');
      const krDocs = (key_results || []).map(kr => ({
        company_id: objective.company_id,
        objective_id: objective._id,
        title: kr.title,
        metric_type: kr.metric_type || 'number',
        target_value: kr.target_value,
        baseline_value: kr.baseline_value || 0,
        current_value: kr.current_value || 0,
        unit: kr.unit,
        year: objective.target_year, // D-A-4: enforced equal
        owner_id: objective.owner_id,
        created_by: req.user.user_id,
        ai_generated: !!kr.ai_generated
      }));
      if (krDocs.length) await KeyResult.insertMany(krDocs);

      res.status(201).json({ success: true, data: objective });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create objective' });
    }
  }
);
```

### POST /api/objectives/generate-krs

Generate KRs with AI (see Epic F for full implementation).

```javascript
// D-E-4: AIContextService.assembleContext (not orchestrator.context)
// D-F-6: aiGenerationLimiter applied
const AIContextService = require('../services/AIContextService');
const aiOKRService     = require('../services/aiOKRService');
const { aiGenerationLimiter } = require('../middleware/rateLimiters');

router.post('/generate-krs',
  authenticateToken,
  aiGenerationLimiter,
  async (req, res) => {
    try {
      const { title, category, discipline_ids, ssi_impact } = req.body;

      const context = await AIContextService.assembleContext('kr-generation', {
        company_id: req.user.company_id
      });

      // Epic F always returns a fallback shape; signature is (params, context)
      const result = await aiOKRService.generateKRs(
        { title, category, discipline_ids, ssi_impact },
        context
      );

      res.json({
        success: true,
        data: { key_results: result.key_results, ai_guidance: result.guidance }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'AI generation failed', fallback: true });
    }
  }
);
```

---

## Files to Create/Modify (D-E-5 corrected)

| File | Action | Description |
|------|--------|-------------|
| `server/models/Objective.js` | MODIFY | Add `discipline_ids`, `ssi_impact`, `ai_guidance` (D-E-2). KEEP embedded `key_results[]` for backwards compat (D-A-1). Virtual `key_results_v2` added by Epic A |
| `server/routes/objectives.js` | MODIFY | Extend existing POST (with `validateObjectiveLimit` — D-E-6) to accept `discipline_ids` and dual-write KeyResult docs (D-E-7); add `POST /generate-krs` with `aiGenerationLimiter` (D-F-6) |
| `client/pages/objective-wizard.html` | **MODIFY** (file exists in production) | Update per-screen content; preserve nav + script bindings |
| `client/pages/scripts/objective-wizard.js` | **MODIFY** (file exists) | Extend with discipline selector (4 foundations), SSI dropdowns, AI KR generation, dual-write payload |
| `client/css/objective-wizard.css` | CREATE OR fold into `s13-patterns.css` (per D-C-9 pattern) | Wizard styles |

---

## Wizard State Management

```javascript
const wizardState = {
  step: 1,
  data: {
    title: '',
    category: null,
    ssi_impact: { area: null, sub_dimension: null },
    discipline_ids: [],
    key_results: [],
    ai_guidance: null
  }
};

function nextStep() {
  if (validateCurrentStep()) {
    wizardState.step++;
    renderStep(wizardState.step);
  }
}

function prevStep() {
  wizardState.step--;
  renderStep(wizardState.step);
}

function validateCurrentStep() {
  switch (wizardState.step) {
    case 1:
      return wizardState.data.title.length >= 10 && wizardState.data.category;
    case 2:
      return true; // Behaviors optional
    case 3:
      return wizardState.data.key_results.length >= 1;
    default:
      return false;
  }
}
```

---

## Acceptance Criteria

- [ ] 3-screen wizard navigation works (existing scaffold preserved)
- [ ] Screen 1: title, category, SSI impact fields with auto-suggest from `assessment.constraint` (D-E-8)
- [ ] Screen 2: discipline checkboxes grouped by 4 foundations (Discipline / Growth / Accountability / Maturity) per D-A-5
- [ ] Screen 3: AI Generate button calls `/api/objectives/generate-krs` (template fallback on AI failure)
- [ ] Discipline selection limited to 5; warning at >3
- [ ] SSI dropdowns empty when user has no assessment (D-E-8 — no nag)
- [ ] KR edit/accept/reject functionality
- [ ] **Tenant scope** on POST /api/objectives — cross-tenant payload rejected
- [ ] **Dual-write** verified: Objective saved with embedded `key_results[]` AND N matching KeyResult docs in collection (D-A-1, D-E-7)
- [ ] `validateObjectiveLimit` middleware still applied (D-E-6)
- [ ] AI fallback path tested (template KRs returned with `ai_generated: false`)
- [ ] Back/Next/Skip navigation

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| Objective model extension | 1 |
| Screen 1 UI + validation | 2 |
| Screen 2 UI (discipline selector by foundation) | 2 |
| Screen 3 UI (KRs) | 2 |
| Wizard state management | 1 |
| API integration | 1 |
| Testing | 1 |
| **Total** | **10** |

---

**Created**: April 21, 2026 (Session #171)
**Status**: Ready for implementation
