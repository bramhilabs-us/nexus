# 📊 Karvia Product Documentation Hub

<!-- @GENOME T2-NAV-PRD-001 | ACTIVE | 2026-04-05 | parent:T1-NAV-KRV-001 | auto:/strategy | linked:/coding -->

**Last Updated**: April 5, 2026
**Version**: 5.0 (Restructured)
**Status**: Active - Beta Phase
**iBrain Coverage**: ✅ Excellent (20+ documents)

---

> **Vision Documents Moved**: T1 Vision docs are now in [1-VISION/](../1-VISION/).
> - For engine vision: [KARVIA_ENGINE_VISION.md](../1-VISION/KARVIA_ENGINE_VISION.md)
> - For product vision: [YSELA_PRODUCT_VISION.md](../1-VISION/YSELA_PRODUCT_VISION.md)
> - For roadmap: [PRODUCT_ROADMAP.md](../1-VISION/PRODUCT_ROADMAP.md)
>
> Legacy PRODUCT_VISION.md and KARVIA_ENGINE_OVERVIEW.md below are transitioning.

---

## 🚀 Start Here - Quick Orientation

### Essential Context Documents

1. **[SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md)** 📍 **READ THIS FIRST**
   - Complete 3-page system context
   - What Karvia is and who uses it
   - User journey spectrum (Consultant → Executive → Manager → Employee)
   - Core components and data flow

2. **[CLAUDE_CONTEXT.md](./CLAUDE_CONTEXT.md)** 🤖 **For AI/Development Sessions**
   - Quick onboarding for Claude/AI assistants
   - Critical files, folders, and code patterns
   - Common pitfalls and solutions
   - Current gaps and priorities

---

## 📚 Core Product Documentation

### Strategic Documents

3. **[PRODUCT_VISION.md](./PRODUCT_VISION.md)**
   - Market opportunity ($112B TAM, 5.2M SMBs)
   - 3-tier product strategy (Free → Pro → Enterprise)
   - Competitive positioning and differentiation
   - 3-year roadmap and success metrics

4. **[PRODUCT_ARCHITECTURE.md](./PRODUCT_ARCHITECTURE.md)**
   - **Updated**: Consultant + Executive shared workflow
   - Modular block architecture (7 independent blocks)
   - Permission matrix and data flow
   - Technical stack and scaling strategy

5. **[FEATURE_CATALOG.md](./FEATURE_CATALOG.md)**
   - Complete inventory (89 features tracked)
   - Current status: 70% complete overall
   - Critical gaps: Planning Page UI, Employee Dashboard
   - Release timeline through Q1 2026

6. **[GO_TO_MARKET.md](./GO_TO_MARKET.md)**
   - Consultant-led distribution strategy
   - Pricing: $12/user/month (Professional tier)
   - Launch date: January 31, 2026
   - Customer acquisition playbook

---

## 🗂️ Organized Product Assets

### Strategy Documents (MECE Structure)
- **[strategy/](./strategy/)** - Complete product strategy in MECE organization
  - `README.md` - MECE navigation guide
  - `PRODUCT_STRATEGY_MASTER.md` - Everything in one document
  - `STRATEGY_QUICK_REFERENCE.md` - 30-second navigation
  - Foundation, Market, Positioning, Solution docs
  - **`ibrain_integration_model.md`** - iBrain strategy (key document)

### User Research
- **[system-flows/](./system-flows/)** - System interaction flows (renamed from user-journeys)
  - `USER_JOURNEYS_MASTER.md` - Master consolidated view
  - Individual flows: `CONSULTANT_FLOW.md`, `EXECUTIVE_FLOW.md`, `MANAGER_FLOW.md`, `EMPLOYEE_FLOW.md`, `ADMIN_FLOW.md`
  - Note: YSELA user experience journeys are in [YSELA/user-journeys/](../../YSELA/user-journeys/)

- **[user-stories/](./user-stories/)** - Product requirements
  - `USER_STORIES_MASTER.md` - All 114 stories in one place
  - ⚠️ Other story files archived (consolidated into master)

### Archived Documents
- **[_archive/](./\_archive/)** - Outdated/superseded documents
  - `product_overview.html` - Old presentation
  - `ADMIN_JOURNEY.md` - Deprecated role
  - `MISSING_STORIES_DETAILED.md` - Already integrated
  - Other superseded versions

### Technical Reference
- **API Documentation**: See [../../server/routes/](../../server/routes/)
- **Data Models**: See [../../server/models/](../../server/models/)
- **Frontend Pages**: See [../../client/pages/](../../client/pages/)

---

## 🎯 Quick Navigation by Role

### For Product Managers
**Path**: SYSTEM_OVERVIEW → PRODUCT_VISION → FEATURE_CATALOG → GO_TO_MARKET

### For Engineers
**Path**: CLAUDE_CONTEXT → PRODUCT_ARCHITECTURE → FEATURE_CATALOG (gaps section)

### For Designers
**Path**: SYSTEM_OVERVIEW → system-flows/ → FEATURE_CATALOG

### For Business Stakeholders
**Path**: SYSTEM_OVERVIEW → PRODUCT_VISION → GO_TO_MARKET

### For AI/Claude Sessions
**Start with**: CLAUDE_CONTEXT.md (has everything needed)

---

## 📊 Current Status Summary

### Overall Progress
- **Backend**: 95% complete (all APIs functional)
- **Frontend**: 50% complete (critical UI gaps)
- **Documentation**: 100% consolidated here
- **Testing**: 20% coverage

### Critical Gaps (P0 - Blocks Launch)
1. **Planning Page UI** - Convert OKRs to tasks (0% frontend)
2. **Employee Dashboard** - Daily task view (0% built)
3. **Goal Management UI** - Quarterly/weekly goals (30% complete)

### What's Working
- ✅ Assessment system (100% complete)
- ✅ Authentication & roles (95% complete)
- ✅ OKR backend (100% complete)
- ✅ Team management (90% complete)
- ✅ Basic analytics (70% complete)

---

## 🔄 Documentation Governance

### Maintenance
- **Owner**: Product Team
- **Review Cycle**: Sprint-aligned (every 2 weeks)
- **Update Process**: PR required for changes
- **Version Control**: Git-tracked with clear commit messages

### Consolidation Complete
All product documentation has been consolidated from:
- ✅ `KARVIA_STRATEGY/1-PRODUCT/` (this folder)
- ✅ `Karvia_OKR_Product_Planning/` (operational tracking remains there)
- ✅ Various scattered strategy docs

### Success Metrics
This documentation succeeds when:
- New developers onboard in <2 days
- No duplicate docs are created
- All product decisions reference these docs
- External partners can self-implement

---

## 📞 Contact & Support

- **Product Questions**: product@karvia.io
- **Technical Issues**: See [CLAUDE_CONTEXT.md](./CLAUDE_CONTEXT.md)
- **Bug Reports**: [../../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md)
- **Feature Requests**: [../../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md)

---

## 🤖 iBrain Integration Coverage

**Coverage Status**: ✅ EXCELLENT - 20/29 documents reference iBrain

### Key iBrain Documents
- **Primary**: [strategy/ibrain_integration_model.md](./strategy/ibrain_integration_model.md)
- **Architecture**: [PRODUCT_ARCHITECTURE.md](./PRODUCT_ARCHITECTURE.md) - Block 7 details
- **Features**: [FEATURE_CATALOG.md](./FEATURE_CATALOG.md) - AI & Intelligence module
- **Strategy**: Multiple docs cover toggle mechanism, premium model, SaaS integration

### iBrain Features Documented
- ✅ Behavioral nudging
- ✅ Predictive analytics
- ✅ AI coaching
- ✅ Sentiment analysis
- ✅ Pattern detection
- ✅ Toggle-based architecture
- ✅ Optional premium add-on
- ✅ BRAMHI Labs SaaS model

---

## 📁 Final Folder Structure

```
1-PRODUCT/
├── Core Documents (7 files)
│   ├── README.md (this file)
│   ├── SYSTEM_OVERVIEW.md
│   ├── CLAUDE_CONTEXT.md
│   ├── PRODUCT_VISION.md
│   ├── PRODUCT_ARCHITECTURE.md
│   ├── FEATURE_CATALOG.md
│   └── GO_TO_MARKET.md
│
├── strategy/ (11 active files in MECE structure)
│   ├── README.md (MECE guide)
│   ├── PRODUCT_STRATEGY_MASTER.md
│   ├── STRATEGY_QUICK_REFERENCE.md
│   ├── ibrain_integration_model.md ⭐
│   └── [Foundation, Market, Positioning, Solution docs]
│
├── system-flows/ (8 files) ← Renamed from user-journeys Apr 4, 2026
│   ├── USER_JOURNEYS_MASTER.md
│   └── [Individual system flows: CONSULTANT_FLOW, EXECUTIVE_FLOW, etc.]
│
├── user-stories/ (1 master file)
│   └── USER_STORIES_MASTER.md (114 stories)
│
└── _archive/ (5 outdated files)
    └── [Superseded/deprecated documents]
```

---

## 🎯 Key Takeaways

**What is Karvia?** B2B OKR platform for SMBs with assessment-driven objective generation

**Who uses it?** Business consultants + SMB executives working as partners

**What's unique?** Only platform that generates contextual OKRs from business assessment

**Current state?** 70% complete, launching January 31, 2026

**What's needed?** Complete Planning Page UI, Employee Dashboard, Goal Management UI

**iBrain Status?** Fully documented as optional premium add-on with toggle architecture

---

## ✅ Consolidation Complete

This folder now contains:
- **29 active documents** (well-organized)
- **5 archived documents** (outdated/superseded)
- **MECE strategy structure** in strategy/ folder
- **Consolidated journeys & stories** with individual files retained
- **Excellent iBrain coverage** across all documents
- **Zero redundancy** - single source of truth achieved

---

**Document Status**: This is the single source of truth for Karvia product documentation. All product information should reference or link to documents in this folder.

**Last Consolidation**: November 2025 - Complete reorganization with MECE structure
**Next Review**: December 2025 (pre-beta review)