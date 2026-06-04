# Epic S: Configuration Page

**Epic**: S
**Sprint**: 10
**Story Points**: 16
**Priority**: P0
**Status**: PLANNING

---

## Purpose

The consultant is the admin. The Configuration page gives consultants control over how Karvia works for each client, without overwhelming them with options.

**Philosophy**: Configuration is not about controlling people. It's about:
- Tailoring the experience per client's methodology
- Reflecting the consultant's emphasis (Speed vs Strength vs Intelligence)
- Managing information access appropriately

---

## Target User

**Primary**: Consultant (CONSULTANT role)
**Secondary**: Business Owner (BUSINESS_OWNER role)

---

## Page Structure

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

## Stories

| Story | Points | Description |
|-------|--------|-------------|
| S1 | 5 | Configuration page layout + General tab |
| S2 | 6 | SSI Weights with Industry Presets tab |
| S3 | 3 | Access Controls tab |
| S4 | 2 | Report Branding tab |
| **Total** | **16** | |

---

## Story S1: Configuration Page Layout + General Tab (5 pts)

### User Story

**As a** consultant
**I want** a centralized configuration page for company settings
**So that** I can tailor Karvia to each client's needs in one place

### Acceptance Criteria

- [ ] Configuration page accessible from main navigation (gear icon)
- [ ] Tab structure: General | SSI Weights | Access Controls | Branding
- [ ] Changes auto-save with visual confirmation ("Saved" toast)
- [ ] Mobile responsive layout
- [ ] General tab shows company name, description, and basic settings
- [ ] URL: `/pages/configuration.html`

### General Tab Content

```
┌────────────────────────────────────────────────────────────────────┐
│  General Settings                                                   │
│                                                                     │
│  Company Name                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ABC Wealth Advisors                                            │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Industry                                                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Financial Services                                        ▼   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Industry Subtype                                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Wealth Management / Legacy Succession                     ▼   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Fiscal Year Start                                                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ○ January  ● April  ○ July  ○ October                         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Time Zone                                                          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ America/New_York (EST)                                    ▼   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Frontend**: `client/pages/configuration.html`

```html
<!-- Tab navigation -->
<div class="config-tabs">
  <button class="tab active" data-tab="general">General</button>
  <button class="tab" data-tab="ssi-weights">SSI Weights</button>
  <button class="tab" data-tab="access">Access Controls</button>
  <button class="tab" data-tab="branding">Branding</button>
</div>

<!-- Tab content container -->
<div class="tab-content" id="general-content">
  <!-- General settings form -->
</div>
```

**Backend**: Uses existing `/api/companies/:id` endpoint for updates

**Navigation**: Add to `client/js/navigation.js`
```javascript
{
  label: 'Configuration',
  icon: 'settings',
  href: '/pages/configuration.html',
  roles: ['CONSULTANT', 'BUSINESS_OWNER']
}
```

### Dependencies

- Company model (existing)
- Industries.js shared config (from Epic K)

---

## Story S2: SSI Weights with Industry Presets (6 pts)

### User Story

**As a** consultant
**I want** industry-specific weight presets that I can customize
**So that** the SSI score reflects industry priorities while allowing my methodology adjustments

### Why Industry Presets?

Different industries naturally emphasize different dimensions:
- **Financial Services - Legacy Succession**: Strength matters most (40%) - stability during transitions
- **Technology - SaaS**: Speed matters most (45%) - rapid iteration is survival
- **Healthcare - Clinical**: Intelligence matters most (40%) - data-driven decisions save lives
- **Manufacturing**: Balanced with slight Strength emphasis (35%) - operational consistency

**Option B Philosophy**: Start with industry best-practices, allow consultant customization, track both for future iBrain learning.

### Acceptance Criteria

- [ ] Industry preset dropdown based on company's industry/subtype
- [ ] Selecting preset auto-fills Speed/Strength/Intelligence weights
- [ ] Manual slider adjustment switches to "Custom" mode
- [ ] "Custom" badge shown when weights differ from preset
- [ ] Reset button returns to industry preset values
- [ ] Weights must total 100% (validation)
- [ ] Store both preset selection AND custom flag for iBrain training
- [ ] Weights apply to NEW assessments only (existing unchanged)

### Wireframe

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
│  │                                                                 ││
│  │ Recommended for this industry:                                  ││
│  │ Speed 30% | Strength 40% | Intelligence 30%                     ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │  Current Weights                         [Custom] [Reset]       ││
│  │  ────────────────────────────────────────────────────────────  ││
│  │                                                                ││
│  │  Speed          ●━━━━━━━━━━━━○─────────────────────  30%       ││
│  │  Decision speed and change implementation                      ││
│  │                                                                ││
│  │  Strength       ●━━━━━━━━━━━━━━━━━━○───────────────  40%       ││
│  │  Operational resilience and financial stability                ││
│  │                                                                ││
│  │  Intelligence   ●━━━━━━━━━━━━○─────────────────────  30%       ││
│  │  Strategic insight and data-driven decisions                   ││
│  │                                                                ││
│  │  ────────────────────────────────────────────────────────────  ││
│  │                                            Total: 100% ✓       ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ Preview: If a company scores Speed=80, Strength=60, Intel=70   ││
│  │ Current weights: 30/40/30 → Overall SSI: 69.0                  ││
│  │ Industry preset (30/40/30): → Same (no custom)                 ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ⓘ These weights apply to new assessments only. Both preset and   │
│    custom adjustments are stored for future analysis.              │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Industry Preset Definitions

| Industry | Subtype | Speed | Strength | Intelligence | Rationale |
|----------|---------|-------|----------|--------------|-----------|
| Financial Services | Legacy Succession | 30% | 40% | 30% | Stability critical during ownership transitions |
| Financial Services | Wealth Management | 30% | 35% | 35% | Balance of stability and strategic insight |
| Financial Services | General | 33% | 34% | 33% | Balanced default |
| Technology | SaaS | 45% | 25% | 30% | Speed-to-market is competitive advantage |
| Technology | Enterprise | 30% | 40% | 30% | Stability for large clients |
| Healthcare | Clinical | 25% | 35% | 40% | Data-driven decisions paramount |
| Healthcare | Administrative | 35% | 35% | 30% | Balanced with operational focus |
| Manufacturing | General | 30% | 40% | 30% | Operational consistency priority |
| Professional Services | Consulting | 35% | 30% | 35% | Balance of speed and insight |
| Professional Services | Legal | 25% | 40% | 35% | Accuracy and stability |
| *Default* | *Any* | 33% | 33% | 34% | Balanced when no match |

### Custom Mode Behavior

```
STATE MACHINE:
┌─────────────┐                           ┌─────────────┐
│   Preset    │ ──── Slider adjusted ──── │   Custom    │
│   Mode      │                           │   Mode      │
│ is_custom:  │ ◄── Reset button ──────── │ is_custom:  │
│   false     │                           │   true      │
└─────────────┘                           └─────────────┘

Preset Mode: Weights match industry preset exactly
Custom Mode: Any slider has been manually adjusted
```

### Technical Implementation

**Company Model Extension** (`server/models/Company.js`):
```javascript
// Add to Company schema
ssi_config: {
  // Industry preset selection
  industry_preset: {
    type: String,
    enum: [
      'financial_services_legacy_succession',
      'financial_services_wealth_management',
      'financial_services_general',
      'technology_saas',
      'technology_enterprise',
      'healthcare_clinical',
      'healthcare_administrative',
      'manufacturing_general',
      'professional_services_consulting',
      'professional_services_legal',
      'balanced'  // Default fallback
    ],
    default: 'balanced'
  },
  // Actual weights in use
  dimension_weights: {
    speed: { type: Number, default: 33, min: 0, max: 100 },
    strength: { type: Number, default: 33, min: 0, max: 100 },
    intelligence: { type: Number, default: 34, min: 0, max: 100 }
  },
  // Tracks if consultant customized (for iBrain training)
  is_custom: { type: Boolean, default: false },
  // When weights were last modified
  weights_modified_at: { type: Date },
  // Who modified (for audit)
  weights_modified_by: { type: Schema.Types.ObjectId, ref: 'User' }
}
```

**Industry Presets Config** (`shared/config/industry-presets.js`):
```javascript
const INDUSTRY_PRESETS = {
  financial_services_legacy_succession: {
    speed: 30, strength: 40, intelligence: 30,
    label: 'Financial Services - Legacy Succession',
    rationale: 'Stability critical during ownership transitions'
  },
  financial_services_wealth_management: {
    speed: 30, strength: 35, intelligence: 35,
    label: 'Financial Services - Wealth Management',
    rationale: 'Balance of stability and strategic insight'
  },
  technology_saas: {
    speed: 45, strength: 25, intelligence: 30,
    label: 'Technology - SaaS',
    rationale: 'Speed-to-market is competitive advantage'
  },
  healthcare_clinical: {
    speed: 25, strength: 35, intelligence: 40,
    label: 'Healthcare - Clinical',
    rationale: 'Data-driven decisions paramount'
  },
  balanced: {
    speed: 33, strength: 33, intelligence: 34,
    label: 'Balanced (Default)',
    rationale: 'No specific industry emphasis'
  }
  // ... other presets
};

function getPresetForIndustry(industry, subtype) {
  const key = `${industry.toLowerCase()}_${subtype.toLowerCase()}`.replace(/\s+/g, '_');
  return INDUSTRY_PRESETS[key] || INDUSTRY_PRESETS.balanced;
}

module.exports = { INDUSTRY_PRESETS, getPresetForIndustry };
```

**Validation Middleware**:
```javascript
function validateSSIWeights(weights) {
  const total = weights.speed + weights.strength + weights.intelligence;
  if (total !== 100) {
    throw new Error(`Weights must total 100%. Current: ${total}%`);
  }
}
```

**Auto-Preset on Industry Change**:
```javascript
// When company industry/subtype changes, suggest new preset
async function suggestPresetOnIndustryChange(companyId, newIndustry, newSubtype) {
  const preset = getPresetForIndustry(newIndustry, newSubtype);

  // Don't auto-apply if custom weights exist
  const company = await Company.findById(companyId);
  if (company.ssi_config?.is_custom) {
    return {
      action: 'suggest',
      message: `New industry detected. Suggested weights: ${preset.label}`,
      preset: preset
    };
  }

  // Auto-apply for non-custom
  return {
    action: 'apply',
    preset: preset
  };
}
```

**UnifiedSSIScoringService Update**:
```javascript
// Use company-specific weights instead of hardcoded 33/33/34
async function calculateOverallScore(dimensionScores, companyId) {
  const company = await Company.findById(companyId);
  const weights = company.ssi_config?.dimension_weights || {
    speed: 33, strength: 33, intelligence: 34
  };

  return (
    (dimensionScores.speed * weights.speed / 100) +
    (dimensionScores.strength * weights.strength / 100) +
    (dimensionScores.intelligence * weights.intelligence / 100)
  );
}
```

### Future iBrain Integration

The data model captures:
1. `industry_preset` - Which preset was selected
2. `is_custom` - Whether consultant adjusted
3. `dimension_weights` - Actual weights used
4. `weights_modified_at` - When changes happened

**Future Analysis Questions**:
- Do consultants in Financial Services consistently adjust Strength higher?
- Which presets get customized most often?
- Is there a correlation between custom weights and client success?

### Dependencies

- Company model
- UnifiedSSIScoringService
- Industries.js shared config (from Epic K)

---

## Story S3: Access Controls (3 pts)

### User Story

**As a** consultant
**I want** to control who can view SSI reports, OKRs, and plans
**So that** sensitive strategic information is shared appropriately

### Acceptance Criteria

- [ ] Role-based visibility settings for each feature area
- [ ] Options per area: All users | Managers+ | Executives only | Consultant only
- [ ] Separate settings for: SSI Report, OKRs/Objectives, Weekly Plans
- [ ] Clear explanation of each access level
- [ ] Changes apply immediately to navigation and API access

### Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│  Access Controls                                                    │
│                                                                     │
│  "Control who can see different parts of the system. Users without │
│   access will not see these items in navigation or search."        │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                                                                ││
│  │  SSI Diagnostic Report                                         ││
│  │  Strategic assessment results and recommendations              ││
│  │  ┌──────────────────────────────────────────────────────────┐  ││
│  │  │ ○ All users  ● Executives only  ○ Consultant only        │  ││
│  │  └──────────────────────────────────────────────────────────┘  ││
│  │                                                                ││
│  │  ─────────────────────────────────────────────────────────────  ││
│  │                                                                ││
│  │  OKRs and Objectives                                           ││
│  │  Company objectives and key results                            ││
│  │  ┌──────────────────────────────────────────────────────────┐  ││
│  │  │ ● All users  ○ Managers+  ○ Executives only              │  ││
│  │  └──────────────────────────────────────────────────────────┘  ││
│  │                                                                ││
│  │  ─────────────────────────────────────────────────────────────  ││
│  │                                                                ││
│  │  Weekly Plans and Tasks                                        ││
│  │  Individual task assignments and progress                      ││
│  │  ┌──────────────────────────────────────────────────────────┐  ││
│  │  │ ● All users  ○ Own team only                              │  ││
│  │  └──────────────────────────────────────────────────────────┘  ││
│  │                                                                ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ⓘ Changes take effect immediately. Users may need to refresh.     │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Access Level Definitions

| Level | Who Can See | Role Mapping |
|-------|-------------|--------------|
| All users | Everyone in the company | EMPLOYEE, MANAGER, EXECUTIVE, BUSINESS_OWNER, CONSULTANT |
| Managers+ | Managers and above | MANAGER, EXECUTIVE, BUSINESS_OWNER, CONSULTANT |
| Executives only | Executives and above | EXECUTIVE, BUSINESS_OWNER, CONSULTANT |
| Consultant only | Just the consultant | CONSULTANT |
| Own team only | User's assigned team members | Dynamic based on team membership |

### Technical Implementation

**Company Model Extension**:
```javascript
access_controls: {
  ssi_report: {
    type: String,
    enum: ['all', 'managers', 'executives', 'consultant'],
    default: 'executives'
  },
  okrs: {
    type: String,
    enum: ['all', 'managers', 'executives', 'consultant'],
    default: 'all'
  },
  weekly_plans: {
    type: String,
    enum: ['all', 'own_team'],
    default: 'all'
  }
}
```

**Middleware for Access Check**:
```javascript
// server/middleware/accessControl.js
function checkFeatureAccess(feature) {
  return async (req, res, next) => {
    const company = await Company.findById(req.user.company_id);
    const accessLevel = company.access_controls?.[feature] || 'all';
    const userRole = req.user.role;

    if (!hasAccess(userRole, accessLevel)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this content'
      });
    }
    next();
  };
}
```

### Dependencies

- Company model
- Auth middleware
- Navigation component

---

## Story S4: Report Branding (2 pts)

### User Story

**As a** consultant
**I want** to add my client's logo to SSI reports
**So that** the report feels like theirs, not a generic template

### Acceptance Criteria

- [ ] Logo upload (PNG/JPG, max 1MB, recommended 200x60px)
- [ ] Logo preview on configuration page
- [ ] Logo appears on PDF report header
- [ ] Default: Karvia logo if none uploaded
- [ ] Delete option to remove uploaded logo

### Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│  Report Branding                                                    │
│                                                                     │
│  "Add your client's logo to make reports feel personalized."       │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                                                                ││
│  │  Company Logo                                                  ││
│  │                                                                ││
│  │  ┌─────────────────────────────────────────┐                   ││
│  │  │                                         │                   ││
│  │  │    [ABC Wealth Advisors Logo]           │                   ││
│  │  │                                         │                   ││
│  │  └─────────────────────────────────────────┘                   ││
│  │                                                                ││
│  │  [Upload New Logo]  [Remove Logo]                              ││
│  │                                                                ││
│  │  ─────────────────────────────────────────────────────────────  ││
│  │                                                                ││
│  │  Preview on Report:                                            ││
│  │  ┌─────────────────────────────────────────────────────────┐   ││
│  │  │ [Logo]  SSI DIAGNOSTIC REPORT                           │   ││
│  │  │         ABC Wealth Advisors                             │   ││
│  │  └─────────────────────────────────────────────────────────┘   ││
│  │                                                                ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  Recommended: PNG or JPG, 200x60 pixels, max 1MB                   │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Company Model Extension**:
```javascript
branding: {
  logo_url: { type: String },
  logo_uploaded_at: { type: Date }
}
```

**Upload Endpoint** (`server/routes/companies.js`):
```javascript
router.post('/:id/logo',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER'),
  upload.single('logo'),
  async (req, res) => {
    // Validate file size (1MB max)
    if (req.file.size > 1024 * 1024) {
      return res.status(400).json({ error: 'Logo must be under 1MB' });
    }

    // Store in /uploads/logos/
    const logoUrl = `/uploads/logos/${req.file.filename}`;

    await Company.findByIdAndUpdate(req.params.id, {
      'branding.logo_url': logoUrl,
      'branding.logo_uploaded_at': new Date()
    });

    res.json({ success: true, logo_url: logoUrl });
  }
);
```

### Dependencies

- Company model
- Multer for file upload
- Static file serving for `/uploads/`

---

## File Structure

### Files to Create

| File | Purpose |
|------|---------|
| `client/pages/configuration.html` | Main configuration page |
| `client/js/configuration.js` | Page controller |
| `server/middleware/accessControl.js` | Feature access middleware |

### Files to Modify

| File | Changes |
|------|---------|
| `server/models/Company.js` | Add ssi_config, access_controls, branding fields |
| `server/routes/companies.js` | Add logo upload endpoint |
| `client/js/navigation.js` | Add Configuration link |
| `server/services/UnifiedSSIScoringService.js` | Use company-specific weights |

---

## Testing Requirements

### Unit Tests

- [ ] SSI weight validation (must total 100%)
- [ ] Access control role mapping
- [ ] Logo file size validation

### Integration Tests

- [ ] Configuration save/load cycle
- [ ] Access control enforcement on API endpoints
- [ ] Logo upload and retrieval

### E2E Tests

- [ ] Complete configuration flow (all tabs)
- [ ] SSI weight change affects new assessment
- [ ] Access control hides navigation items

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Configuration page load time | < 500ms |
| Auto-save feedback time | < 200ms |
| Logo upload success rate | 100% for valid files |

---

## Related Documents

- [Sprint 10 Master Plan](./SPRINT-10-MASTER-PLAN.md)
- [UnifiedSSIScoringService](../../../../server/services/UnifiedSSIScoringService.js)
- [Company Model](../../../../server/models/Company.js)

---

**Story Owner**: Product Team
**Sprint**: 10
