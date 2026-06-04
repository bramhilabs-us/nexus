# KARVIA_STRATEGY - Master Documentation Hub Proposal
**Date**: October 20, 2025
**Purpose**: Design comprehensive documentation structure as parent hub for entire codebase
**Status**: 🔴 PROPOSAL - Awaiting Approval

---

## 🎯 **Executive Summary**

**Goal**: Transform KARVIA_STRATEGY/ into the **master documentation hub** that contains every minute detail of the KARVIA Pro codebase.

**Current Problem**: Documentation is **fragmented** across 3 locations:
- `/Karvia_OKR_Product_Planning/` - Product planning & sprint execution
- `/docs/` - Technical guides & implementation details
- `/Karvia_OKR_Mockups/` - Design files & mockups

**Proposed Solution**: KARVIA_STRATEGY/ becomes the **single entry point** with deep cross-references to all existing documentation.

---

## 📊 **Proposed Structure**

```
KARVIA_STRATEGY/                                  ← MASTER DOCUMENTATION HUB
│
├── 00_MASTER_STRATEGY.md                        ← Single entry point (10-12 pages)
├── TODO.md                                       ← Task tracking (existing)
├── STRUCTURE_PROPOSAL.md                         ← This document
│
├── assets/                                       ← Shared assets
│   ├── css/
│   │   └── bramhi-elegant.css                   ← Copied from Manifestor
│   ├── images/
│   └── diagrams/
│
├── 01_PRODUCT_OVERVIEW/                          ← Product layer
│   ├── product_overview.html                    ← Visual deck (17 slides, Bramhi style)
│   ├── market_signals.md                        ← SMB market research
│   ├── personas_and_jtbd.md                     ← 5 SMB personas
│   ├── value_proposition.md                     ← Core value & differentiation
│   ├── competitive_landscape.md                 ← Competitors analysis
│   └── ibrain_integration_model.md              ← Standalone + Toggle model
│
├── 02_TECHNICAL_OVERVIEW/                        ← Technical layer
│   ├── technical_overview.html                  ← Visual deck (Bramhi style)
│   ├── architecture_north_star.md               ← Guiding principles
│   ├── system_landscape.md                      ← Layered architecture
│   ├── backend_architecture.md                  ← Services, models, routes
│   ├── frontend_architecture.md                 ← Pages, scripts, components
│   ├── database_design.md                       ← MongoDB schemas
│   ├── api_contracts.md                         ← All endpoints documented
│   └── ibrain_platform_integration.md           ← iBrain SaaS integration
│
├── 03_PRODUCT_STRATEGY/                          ← Strategic roadmaps
│   ├── README.md                                ← Navigation guide
│   ├── mvp_strategy.md                          ← References: ../Karvia_OKR_Product_Planning/MVP_STRATEGY_FINAL.md
│   ├── beta_strategy.md                         ← References: ../Karvia_OKR_Product_Planning/BETA_STRATEGY_FINAL.md
│   ├── v1_strategy.md                           ← Production release (new)
│   ├── roadmap_2025.md                          ← 12-month plan (new)
│   ├── nsm_measurement.md                       ← North Star Metrics (new)
│   └── pricing_and_tiers.md                     ← Free/Pro/Enterprise (new)
│
├── 04_TECHNICAL_STRATEGY/                        ← Implementation strategy
│   ├── README.md                                ← Navigation guide
│   ├── backend_services_strategy.md             ← Service design patterns
│   ├── frontend_dynamic_architecture.md         ← Zero hardcoding principle
│   ├── ibrain_toggle_architecture.md            ← business.ibrain_enabled toggle
│   ├── data_strategy.md                         ← Database scaling & migrations
│   ├── security_and_iam_strategy.md             ← Auth, RBAC, compliance
│   ├── scaling_and_performance_strategy.md      ← Multi-tenancy, caching
│   └── testing_strategy.md                      ← Unit, integration, E2E
│
├── 05_EXECUTION/                                 ← Delivery & tracking
│   ├── README.md                                ← Navigation guide
│   ├── sprint_plans.md                          ← References: ../Karvia_OKR_Product_Planning/Daily_Handoffs/
│   ├── master_dev_list.md                       ← References: ../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md
│   ├── master_improvements_list.md              ← References: ../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md
│   ├── master_issues_list.md                    ← References: ../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md
│   ├── risk_register.md                         ← Active risks & mitigations
│   ├── operating_model.md                       ← Pods, roles, rituals
│   └── governance.md                            ← Decision framework
│
├── 06_CODEBASE_REFERENCE/                        ← Complete code documentation
│   ├── README.md                                ← How to navigate codebase
│   ├── backend/
│   │   ├── services_directory.md                ← All 6 services documented
│   │   ├── models_directory.md                  ← All MongoDB models
│   │   ├── routes_directory.md                  ← All API routes
│   │   └── engines_directory.md                 ← iBrain engines (if applicable)
│   ├── frontend/
│   │   ├── pages_directory.md                   ← All HTML pages catalog
│   │   ├── scripts_directory.md                 ← All JavaScript files
│   │   └── components_directory.md              ← Reusable components
│   ├── database/
│   │   ├── collections.md                       ← MongoDB collections schema
│   │   ├── indexes.md                           ← Performance indexes
│   │   └── migrations.md                        ← Schema migrations log
│   └── api_endpoints_catalog.md                 ← Complete API reference
│
├── 07_IMPLEMENTATION_GUIDES/                     ← How-to guides
│   ├── README.md                                ← Quick start guide
│   ├── getting_started.md                       ← Onboarding new developers
│   ├── local_development_setup.md               ← Dev environment setup
│   ├── deployment_guide.md                      ← Production deployment
│   ├── ibrain_integration_guide.md              ← Enable/disable iBrain
│   ├── feature_toggle_guide.md                  ← Working with toggles
│   ├── testing_guide.md                         ← Running tests
│   └── troubleshooting.md                       ← Common issues & fixes
│
├── 08_DESIGN_SYSTEM/                             ← UI/UX documentation
│   ├── README.md                                ← Design philosophy
│   ├── design_principles.md                     ← Core principles
│   ├── component_library.md                     ← Reusable components
│   ├── mockups_reference.md                     ← References: ../Karvia_OKR_Mockups/
│   ├── unified_design_guide.md                  ← Unified design system
│   ├── accessibility_guidelines.md              ← WCAG compliance
│   └── branding.md                              ← Colors, typography, logo
│
├── 09_APPENDICES/                                ← Supporting materials
│   ├── README.md                                ← Appendices overview
│   ├── glossary.md                              ← Terms, acronyms, definitions
│   ├── bramhi_relationship.md                   ← Parent company structure
│   ├── ibrain_saas_model.md                     ← iBrain SaaS integration details
│   ├── research_library.md                      ← Market research, interviews
│   ├── changelog.md                             ← Version history
│   └── references.md                            ← External resources
│
└── 10_ARCHIVE/                                   ← Historical documents
    ├── README.md                                ← Archive policy
    ├── old_strategies.md                        ← References: ../Karvia_OKR_Product_Planning/Archive/
    └── deprecated_docs.md                       ← Outdated documentation
```

---

## 🔄 **Relationship to Existing Folders**

### **Hybrid Approach** (RECOMMENDED)

**Principle**: KARVIA_STRATEGY/ is the navigation hub, existing folders stay in place

**Advantages**:
- ✅ No file duplication
- ✅ No breaking changes to existing references
- ✅ Single source of truth maintained
- ✅ Easy to keep updated

**How It Works**:

1. **Product Planning** (`Karvia_OKR_Product_Planning/`)
   - Stays as-is
   - KARVIA_STRATEGY/05_EXECUTION/ contains markdown files with deep links
   - Example: `sprint_plans.md` points to `../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/`

2. **Technical Docs** (`docs/`)
   - Stays as-is
   - KARVIA_STRATEGY/06_CODEBASE_REFERENCE/ and 07_IMPLEMENTATION_GUIDES/ link to it
   - Example: `api_endpoints_catalog.md` references `../docs/api/README.md`

3. **Design Files** (`Karvia_OKR_Mockups/`)
   - Stays as-is
   - KARVIA_STRATEGY/08_DESIGN_SYSTEM/ references it
   - Example: `mockups_reference.md` catalogs all mockups with links

**Example Cross-Reference File**:
```markdown
# Sprint Plans

This document provides links to all sprint execution plans.

## Current Sprint
- [Week 4 Plan](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/WEEK_4_FINAL_PLAN.md)
- [Week 4 Day 4 Handoff](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/WEEK_4_DAY_4_HANDOFF.md)

## Completed Sprints
- [Week 1](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_1/WEEK_1_HANDOFF.md)
- [Week 2](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_2/WEEK_2_HANDOFF.md)
- [Week 3](../../Karvia_OKR_Product_Planning/Daily_Handoffs/Week_3/WEEK_3_HANDOFF.md)

## Master Lists
- [MASTER_DEV_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md)
- [MASTER_IMPROVEMENTS_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md)
```

---

## 📝 **Key Documents to Create**

### **Priority 1: Foundation** (Today - 5-6 hours)
1. ✅ `00_MASTER_STRATEGY.md` (10-12 pages)
2. ✅ `01_PRODUCT_OVERVIEW/product_overview.html` (17 slides, Bramhi style)
3. ✅ `01_PRODUCT_OVERVIEW/ibrain_integration_model.md` (detailed toggle architecture)

### **Priority 2: Codebase Reference** (Next session - 2-3 hours)
4. ⏳ `06_CODEBASE_REFERENCE/backend/services_directory.md`
5. ⏳ `06_CODEBASE_REFERENCE/frontend/pages_directory.md`
6. ⏳ `06_CODEBASE_REFERENCE/api_endpoints_catalog.md`

### **Priority 3: Implementation Guides** (Ongoing)
7. ⏳ `07_IMPLEMENTATION_GUIDES/getting_started.md`
8. ⏳ `07_IMPLEMENTATION_GUIDES/ibrain_integration_guide.md`
9. ⏳ `07_IMPLEMENTATION_GUIDES/feature_toggle_guide.md`

### **Priority 4: Technical Overview** (Future - 4-5 hours)
10. ⏳ `02_TECHNICAL_OVERVIEW/technical_overview.html` (Bramhi style deck)

---

## 🎨 **iBrain Integration Model - Details**

### **Current Reality** (MVP Nov 30):

**Code Status**:
- ✅ `business.ibrain_enabled` toggle exists
- ✅ `aiOKRService.js` built (AI OKR generation)
- ✅ `iBrainService.js` built (priority analysis, insights)
- ✅ UI shows/hides iBrain sections based on toggle

**Architecture**:
```javascript
// Backend: server/models/Business.js
{
  ibrain_enabled: {
    type: Boolean,
    default: false  // Standalone by default
  }
}

// Frontend: client/pages/objectives.html
if (business.ibrainEnabled) {
  // Show AI OKR generation button
  // Show priority analysis section
  // Show smart insights
} else {
  // Hide all iBrain features
  // Manual OKR creation only
}
```

**Deployment Models**:

1. **Standalone Mode** (Default)
   - `ibrain_enabled: false`
   - All core features work
   - Manual OKR workflows
   - No iBrain API calls

2. **Integrated Mode** (Premium)
   - `ibrain_enabled: true`
   - iBrain SaaS API key configured
   - AI-powered features active
   - Requires iBrain subscription from BRAMHI

3. **Handover Scenarios**:
   - **Client buys KARVIA Pro only**: Deploy standalone, no iBrain
   - **Client wants AI features**: Enable iBrain toggle, provide API keys
   - **iBrain stays with BRAMHI**: SaaS model (recommended)

---

## 📐 **Bramhi Visual Style - Specifications**

### **Typography**:
- **Headings**: Playfair Display (serif)
  - H1: 2.15rem, weight 700
  - H2: 1.85rem, weight 700
  - H3: 1rem, weight 600
- **Body**: Inter (sans-serif)
  - Body: 0.95rem, weight 400
  - Small: 0.85rem

### **Colors**:
- **Primary Gradient**:
  - Start: #6366f1 (indigo-500)
  - End: #764ba2 (purple-600)
- **Backgrounds**:
  - White: #ffffff
  - Light gray: #f8fafc
  - Gradient overlay: rgba(99,102,241,0.08)
- **Text**:
  - Heading: #0f172a (slate-900)
  - Body: #374151 (gray-700)
  - Subtitle: #475569 (slate-600)

### **Components**:
- **Cards**:
  - Border: rgba(148,163,184,0.25)
  - Shadow: 0 18px 36px rgba(15,23,42,0.12)
  - Hover: translateY(-4px), border color change
- **Buttons**:
  - Gradient background
  - Rounded: 999px (pills) or 14px (cards)
  - Transition: 0.2s ease

---

## ✅ **Success Criteria**

### **Phase 1 Complete** (Today):
- ✅ KARVIA_STRATEGY/ directory structure created
- ✅ 00_MASTER_STRATEGY.md complete (10-12 pages)
- ✅ product_overview.html complete (17 slides, Bramhi style)
- ✅ iBrain integration model documented
- ✅ All links functional

### **Phase 2 Complete** (Next session):
- ⏳ Technical overview deck created
- ⏳ Codebase reference complete (every file documented)
- ⏳ Implementation guides written

### **Long-term Success**:
- ⏳ KARVIA_STRATEGY/ is **go-to** for all documentation needs
- ⏳ New team members onboard via 00_MASTER_STRATEGY.md
- ⏳ Every code file has corresponding documentation
- ⏳ Updated monthly with new features

---

## 🚀 **Implementation Plan**

### **Today (5-6 hours)**:

**Hour 1**: Directory structure + Asset setup
- Create all folders
- Copy Bramhi CSS
- Setup assets directory

**Hours 2-3**: Write 00_MASTER_STRATEGY.md
- Executive summary
- Product tiers & iBrain relationship
- Navigation map
- Current state
- Quick reference

**Hours 4-5.5**: Build product_overview.html
- 17 slides with Bramhi styling
- Story map navigation
- SMB personas
- iBrain toggle model
- Appendix library

**Hour 5.5-6**: Validation & polish
- Test all links
- Naming consistency
- Visual quality check

### **Next Session (2-3 hours)**:
- Codebase reference documentation
- API catalog
- Implementation guides

---

## ❓ **Questions for Approval**

### **1. Structure Approval**
Do you approve the proposed directory structure?
- 10 main sections (01-10)
- Hybrid approach (cross-references to existing folders)
- Bramhi visual style for HTML decks

### **2. Priority Confirmation**
Today's focus:
- ✅ 00_MASTER_STRATEGY.md
- ✅ product_overview.html
- ⏳ Defer technical_overview.html to next session?

### **3. Naming Consistency**
Confirm final naming:
- Product: "KARVIA Pro" everywhere
- Folder: `karvia_business` (no change)
- Docs: Remove "OKR" from titles?

### **4. iBrain Documentation Tone**
Confirm approach:
- Lead with "integrated" story
- iBrain as toggle (on/off)
- Default: standalone (toggle off)
- Premium: iBrain enabled (toggle on)

### **5. Existing Folder Actions**
What to do with existing folders?
- **Option A**: Keep as-is, cross-reference only
- **Option B**: Add README.md files pointing to KARVIA_STRATEGY/
- **Option C**: Eventually consolidate (future)

---

## 📋 **Next Steps** (Awaiting Your Approval)

1. ✅ **Review this proposal**
2. ✅ **Confirm structure & approach**
3. ✅ **Answer 5 questions above**
4. 🔴 **Proceed with Phase 1 implementation**

---

## 📊 **Impact Assessment**

### **Benefits**:
- ✅ Single entry point for all documentation
- ✅ Clear product positioning (standalone + optional iBrain)
- ✅ Professional presentation (Bramhi style decks)
- ✅ Easy onboarding for new developers
- ✅ Handover-ready (complete documentation)

### **Risks**:
- ⚠️ Time investment (5-6 hours today, more ongoing)
- ⚠️ Maintenance burden (keep updated)
- ⚠️ Potential confusion (two doc locations during transition)

### **Mitigations**:
- ✅ Hybrid approach (no file moves, just references)
- ✅ Phased rollout (priority docs first)
- ✅ Clear README files in existing folders

---

**Last Updated**: October 20, 2025
**Status**: 🔴 AWAITING APPROVAL
**Next Action**: Your confirmation to proceed
