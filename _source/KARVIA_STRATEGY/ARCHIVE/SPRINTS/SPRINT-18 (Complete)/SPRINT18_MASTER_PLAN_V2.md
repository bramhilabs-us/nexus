# Sprint 18 Master Plan V2 (Minimal Approach + UX Polish)

**Sprint**: 18 - AI-Ready Company Profile (Minimal Enhancement)
**Created**: March 9, 2026
**Revised**: March 10, 2026 (V2.1 - Added M6 UX Enhancements)
**Status**: PLANNED
**Duration**: 1.5 weeks
**Total Points**: 42 pts (V2.0: 30 pts + M6: 12 pts)

---

## Revision Summary

| Aspect | V1 (Original) | V2 (Revised) |
|--------|---------------|--------------|
| Approach | Major UI overhaul | Minimal enhancement |
| Navigation | 5 stage tabs + sub-tabs | Keep existing 3 tabs |
| HTML changes | ~1,300 lines added | ~100 lines added |
| JS changes | Major refactor | ~80 lines added |
| Risk level | HIGH | LOW |
| Duration | 2 weeks | 1 week |
| Points | 71 pts | 30 pts |

**Why the change**: The V4 mockup approach introduced unnecessary complexity and risk. The core goal ("make profile completion visible, valuable, and easy") can be achieved with surgical additions to the existing page.

---

## Sprint Vision (Unchanged)

> **"Help users understand what AI knows about them and what it needs to generate better OKRs"**

---

## What We Keep (No Changes)

- Existing 3-tab structure: The Business, The Numbers, The Vision
- All existing form fields and their IDs
- Autosave logic (871-line company-profile.js)
- Completion ring in header
- Risk warning indicators
- Industry-specific field toggling

---

## What We Add (Minimal Enhancements)

### Epic M1: Maturity Stage Badge (5 pts)

**Goal**: Show users their current AI context stage in the header

**Location**: Next to existing completion ring

```
┌─────────────────────────────────────────────────────────────────┐
│  Company Profile                                                │
│  Build your organizational context for AI-powered OKR generation│
│                                                                 │
│  [Completion Ring]  [Stage Badge]  [Autosave]  [Save Button]   │
│      45%            Stage 1:                                    │
│                     Assessment                                  │
└─────────────────────────────────────────────────────────────────┘
```

| Story | Points | Description |
|-------|--------|-------------|
| M1-1 | 3 | Add maturity stage badge to header (reuse maturity-indicator.js) |
| M1-2 | 2 | Click badge → modal with full stage breakdown |

**Implementation**:
- Add `<div id="maturity-badge"></div>` to header
- Call `MaturityIndicator.init('maturity-badge', { compact: true })`
- Extend maturity-indicator.js with compact mode option

---

### Epic M2: Tab Completion Badges (5 pts)

**Goal**: Show completion % per tab so users know where to focus

**Location**: On existing tab buttons

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│  The Business (75%)  │  The Numbers (40%)   │  The Vision (25%)    │
│  ████████░░          │  ████░░░░░░          │  ██░░░░░░░░          │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

| Story | Points | Description |
|-------|--------|-------------|
| M2-1 | 3 | Calculate completion % per tab (group existing fields) |
| M2-2 | 2 | Display mini progress bar under each tab name |

**Implementation**:
- Extend `updateCompletion()` to track per-tab completion
- Add `<span class="tab-progress"></span>` to each tab button
- Update on field change

---

### Epic M3: AI Impact Badges (5 pts)

**Goal**: Help users understand which fields matter most for AI

**Location**: On high-weight fields (8-10 fields total)

```
┌─────────────────────────────────────────────────────────────────┐
│  #1 Priority for Next 12 Months*        [🤖 HIGH AI IMPACT]    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ What is the single most important thing...              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

| Story | Points | Description |
|-------|--------|-------------|
| M3-1 | 3 | Add AI impact badge component (CSS + small HTML) |
| M3-2 | 2 | Apply to 8-10 high-weight fields |

**Fields to badge** (from ContextMaturityService weights):
1. `priorityOne` - Strategic Priority (10% weight)
2. `businessDescription` - Description (5% weight)
3. `valueProposition` - Value Proposition (5% weight)
4. `businessModel` - Business Model (5% weight)
5. `metric_annual_revenue` - Revenue (high AI utility)
6. `metric_top_5_clients_revenue_pct` - Concentration risk
7. `biggestBlocker` - Blocker (AI creates removal objectives)
8. `companyIndustry` - Industry (benchmark selection)

---

### Epic M4: What AI Knows Summary (8 pts)

**Goal**: Show users a checklist of what AI knows vs needs

**Location**: Collapsible section below header

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 What AI knows about your company              [Expand ▼]   │
├─────────────────────────────────────────────────────────────────┤
│  ✅ Industry: Financial Services                                │
│  ✅ Employee count: 45                                          │
│  ✅ Business description: Defined                               │
│  ❌ Strategic priority: Not set (HIGH IMPACT)                   │
│  ❌ Baseline metrics: 1/5 defined                               │
│  ❌ SSI Assessment: Not completed                               │
│                                                                 │
│  [Complete your profile →] to unlock Stage 2: Execution         │
└─────────────────────────────────────────────────────────────────┘
```

| Story | Points | Description |
|-------|--------|-------------|
| M4-1 | 3 | Create collapsible "AI Knows" section component |
| M4-2 | 3 | Populate from maturity API (gaps, strengths) |
| M4-3 | 2 | Add CTA linking to first missing high-impact field |

**Implementation**:
- Add section below page header, above tabs
- Collapsed by default, remembers state in localStorage
- Uses `/api/context-maturity` response (already has gaps/strengths)

---

### Epic M5: Quick Wins Polish (5 pts)

**Goal**: Small UX improvements that add value

| Story | Points | Description |
|-------|--------|-------------|
| M5-1 | 2 | Add "Why this matters" tooltip to high-impact fields |
| M5-2 | 2 | Improve completion ring color (green >80%, yellow 50-80%, red <50%) |
| M5-3 | 1 | Add keyboard shortcut (Cmd+S) for manual save |

---

### Epic M6: UX Enhancements (12 pts)

**Goal**: Improve input experience with modern UI components (chips, sliders, grids)

**Key Principle**: Use adapter pattern to preserve all field IDs and autosave logic.

| Story | Points | Description |
|-------|--------|-------------|
| M6-1 | 3 | **Slider: Employee Count** - Replace number input with visual slider (1-500) |
| M6-2 | 2 | **Chips: Industry Selection** - Replace dropdown with chip buttons |
| M6-3 | 2 | **Chips: Fee Structure** - Replace dropdown with chip buttons |
| M6-4 | 2 | **Hybrid Chips: Priority** - Add preset chips above #1 Priority textarea |
| M6-5 | 2 | **Hybrid Chips: Blocker** - Add preset chips above Biggest Blocker textarea |
| M6-6 | 1 | **Visual: Priority Card** - Gold highlighted card for #1 Priority section |

**Implementation Details**: See [SPRINT18_UX_ENHANCEMENT_AUDIT.md](./SPRINT18_UX_ENHANCEMENT_AUDIT.md)

**Adapter Pattern**:
```javascript
// Chips sync to hidden input with original ID
<div class="chip-group" data-field="companyIndustry">
  <button class="chip" data-value="consulting">Consulting</button>
  ...
</div>
<input type="hidden" id="companyIndustry" value=""> <!-- Preserves ID -->

// Sliders sync to hidden input
<input type="range" class="slider-input" min="1" max="500">
<input type="hidden" id="employeeCount" value="50"> <!-- Preserves ID -->
```

**Deferred**: `industrySubtype` chips (complex cascading API logic)

---

### Buffer (2 pts)

Reserved for unexpected issues or small enhancements discovered during implementation.

---

## Total: 42 pts

| Epic | Points | Risk |
|------|--------|------|
| M1: Maturity Badge | 5 | LOW |
| M2: Tab Completion | 5 | LOW |
| M3: AI Impact Badges | 5 | LOW |
| M4: What AI Knows | 8 | LOW |
| M5: Quick Wins | 5 | LOW |
| M6: UX Enhancements | 12 | LOW (audited) |
| Buffer | 2 | - |
| **Total** | **42** | **LOW** |

---

## Files to Modify

### HTML (company-profile.html)
```diff
+ Line ~58: Add maturity badge container
+ Line ~89: Add "What AI Knows" collapsible section
+ Line ~101-113: Add completion % to tab buttons
+ Lines throughout: Add AI impact badges to 8 fields

# M6 UX Enhancements:
+ Tab 1: Replace employeeCount input with slider component
+ Tab 1: Replace companyIndustry select with chip group
+ Tab 1: Replace feeStructure select with chip group
+ Tab 3: Add preset chips above priorityOne textarea
+ Tab 3: Add preset chips above biggestBlocker textarea
+ Tab 3: Wrap priority section in gold priority-card
```

**Estimated changes**: ~300 lines added (M1-M5: ~100, M6: ~200)

### JS (company-profile.js)
```diff
+ Add calculateTabCompletion() function
+ Extend updateCompletion() to update tab badges
+ Add toggleAIKnowsSection() function
+ Add initMaturityBadge() call

# M6 Adapter Functions:
+ Add setupChipGroups() - Initialize chip click handlers
+ Add setupHybridChipGroups() - Initialize hybrid chip handlers
+ Add setupSliders() - Initialize slider sync handlers
+ Add populateChipFromValue() - Set chip state on load
+ Add populateSliderFromValue() - Set slider state on load
+ Extend populateForm() - Call new populate functions
+ Extend DOMContentLoaded - Call new setup functions
```

**Estimated changes**: ~195 lines added (M1-M5: ~80, M6: ~115)

### CSS (inline in company-profile.html)
```css
/* M1-M5 Styles */
.ai-impact-badge { ... }      /* Small purple badge */
.tab-progress { ... }         /* Mini progress bar */
.ai-knows-section { ... }     /* Collapsible section */
.maturity-badge-compact { ... } /* Compact maturity display */

/* M6 UX Component Styles */
.chip-group { ... }           /* Flex container for chips */
.chip { ... }                 /* Individual chip button */
.chip.selected { ... }        /* Selected state */
.slider-component { ... }     /* Slider wrapper */
.slider-input { ... }         /* Range input styling */
.slider-value { ... }         /* Value display */
.priority-card { ... }        /* Gold highlighted card */
```

**Estimated changes**: ~140 lines (M1-M5: ~60, M6: ~80)

---

## Dependencies (All Satisfied)

| Dependency | Status | Usage |
|------------|--------|-------|
| maturity-indicator.js | ✅ EXISTS | Extend with compact mode |
| /api/context-maturity | ✅ EXISTS | Powers M1, M4 |
| ContextMaturityService | ✅ EXISTS | Backend calculation |

---

## What Gets Deferred to Future Sprints

| Feature | Original Epic | Reason |
|---------|---------------|--------|
| 5-stage navigation | CP1 | Overkill - 3 tabs work fine |
| Chip-based inputs | CP6 | Only add if specific field benefits |
| Slider components | CP6 | Current inputs work |
| Culture Score UI | CP3 | No iBrain integration yet |
| Financial Score UI | CP3 | No iBrain integration yet |
| Locked stage previews | CP5 | System data not ready |

---

## Execution Plan (1 Week)

| Day | Focus | Points |
|-----|-------|--------|
| 1 | M1: Maturity Badge | 5 |
| 2 | M2: Tab Completion | 5 |
| 3 | M3: AI Impact Badges | 5 |
| 4-5 | M4: What AI Knows | 8 |
| 5 | M5: Quick Wins + Buffer | 7 |

---

## Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Profile completion rate | ~40% | 60% |
| Strategic Vision completion | ~15% | 40% |
| Users aware of maturity stage | 0% | 100% |
| Time to understand AI needs | Unknown | <30 seconds |

---

## Risk Assessment (Post-Revision)

| Risk | Level | Notes |
|------|-------|-------|
| Scope creep | LOW | 30 pts is achievable in 1 week |
| JS breakage | LOW | ~80 lines added, no refactor |
| CSS conflicts | LOW | Minimal new styles |
| User confusion | LOW | Additive changes, no restructure |

---

## Related Documents

- [SPRINT18_MASTER_PLAN.md](./SPRINT18_MASTER_PLAN.md) - Original V1 plan (archived)
- [SPRINT18_RISK_AUDIT.md](./SPRINT18_RISK_AUDIT.md) - Pre-sprint audit (led to V2)
- [maturity-indicator.js](../../../../client/js/maturity-indicator.js) - Reusable component
- [ContextMaturityService.js](../../../../server/services/ContextMaturityService.js) - Backend

---

**Document Version**: 2.0
**Last Updated**: March 10, 2026
**Change Log**:
- v2.0: Complete revision to minimal approach (71 pts → 30 pts)
- v1.0: Original 5-stage navigation plan
