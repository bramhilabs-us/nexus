# KARVIA Pro · Strategy Documentation Hub

<!-- @GENOME T1-NAV-KRV-001 | ACTIVE | 2026-04-05 | parent:ROOT | auto:/init | linked:/strategy -->

**Master documentation for KARVIA Pro** - SMB Team Performance Platform

**Last Updated**: April 5, 2026
**Status**: Active (Sprint 21 - Beta Launch Ready)
**Structure**: Reorganized with T1 Vision docs and archived sprints

---

## Vision Documents (T1 - Strategic)

> **NEW (April 2026)**: Vision documents now in dedicated `1-VISION/` folder.

| Document | Purpose |
|----------|---------|
| [KARVIA_ENGINE_VISION.md](./1-VISION/KARVIA_ENGINE_VISION.md) | What KARVIA engine is |
| [YSELA_PRODUCT_VISION.md](./1-VISION/YSELA_PRODUCT_VISION.md) | What YSELA product is |
| [PRODUCT_ROADMAP.md](./1-VISION/PRODUCT_ROADMAP.md) | Timeline and milestones |

---

## 🚀 QUICK START (3 ESSENTIAL FILES)

### **Start Here** - 3 Must-Read Files at Root

| File | Purpose | Read Time |
|------|---------|-----------|
| **[00_MASTER_STRATEGY.md](./00_MASTER_STRATEGY.md)** | Executive summary, product vision, positioning | 12 min |
| **[QUICK_SETUP.md](./QUICK_SETUP.md)** | Fast onboarding for new team members | 5 min |
| **This README.md** | Navigation hub for all documentation | 3 min |

**New Team Members**: Read these 3 files first, then explore domain folders below.

---

## 📚 DOCUMENTATION STRUCTURE (REORGANIZED OCT 24, 2025)

```
KARVIA_STRATEGY/
│
├── 📘 README.md                           ← You are here (navigation hub)
├── 📊 00_MASTER_STRATEGY.md               ← START HERE (product vision, 3-tier strategy)
├── 🚀 QUICK_SETUP.md                      ← Fast onboarding (5 minutes)
│
├── 📘 _META-DOCS/                         Documentation System Files
│   ├── DOCUMENTATION_STANDARDS.md         Standards for writing docs
│   ├── DOC_EDITING_RULES.md               Rules for editing docs
│   ├── DOCUMENTATION_MIGRATION_AUDIT_REPORT.md  Oct 24 migration audit
│   ├── VERSION_CONTROL_GUIDE.md           Git workflow for docs
│   └── STRUCTURE_PROPOSAL.md              Folder structure proposals
│
├── 🤖 _AI-GUIDES/                         Claude & AI Tooling Guides
│   ├── CLAUDE_INTERACTION_GUIDE.md        How to use Claude for doc creation
│   ├── COLLABORATION_GUIDE.md             Team collaboration with Claude
│   ├── HOW_TO_CREATE_PDFS.md              Detailed PDF generation guide
│   └── QUICK_PDF_GUIDE.md                 Quick PDF creation (60 seconds)
│
├── 🚀 _QUICK-START/                       Onboarding & Setup
│   ├── SETUP_CHECKLIST.md                 Setup validation checklist
│   └── GITHUB_NOTION_SETUP.md             Tool integration setup
│
├── 📋 _MASTER-PLANNING/                   Cross-Cutting Strategy & Planning
│   ├── MASTER_STRATEGY_DEV_TODO.md        Cross-domain TODO list
│   ├── TODO.md                            General TODO tracker
│   └── COMPLETION_SUMMARY.md              Progress summaries
│
├── 💼 0-BUSINESS/                         Business Strategy & Operations
│   ├── 0-VISION-POSITIONING/              Product vision, market positioning
│   ├── 1-MARKET-INTEL/                    Market research, competitive analysis
│   ├── 2-GO-TO-MARKET/                    GTM strategy, pricing, channels
│   ├── 3-PITCH-DECKS/                     Investor/partner presentations
│   ├── 4-OPERATIONS/                      Business operations, outsourcing
│   │   └── OUTSOURCING_STRATEGY.md        Build vs buy decisions
│   └── 5-GENERAL-COMMS/                   Marketing, PR, customer comms
│
├── 📊 1-PRODUCT/                          Product Strategy & Specs
│   ├── 0-STRATEGY/                        Product vision & strategy
│   │   ├── MVP_STRATEGY_V5.md             ⭐ PRIMARY - Modular block architecture (v5.0)
│   │   ├── product_overview.md            Product vision, market positioning
│   │   ├── product_philosophy.md          Design principles, UX philosophy
│   │   └── product_classification.md      Product taxonomy, feature classification
│   ├── 1-ROADMAPS/                        Product roadmap, release planning
│   ├── 2-DISCOVERY/                       User research, validation
│   ├── 3-SPECS/                           PRDs, user stories, requirements
│   │   ├── MVP_PRD_V3.md                  ⭐ PRIMARY - Product Requirements v3.0
│   │   ├── MVP_USER_STORIES_V3.2.md       ⭐ PRIMARY - User stories (7 blocks)
│   │   └── User_Stories/                  Individual journey docs (Admin, Consultant, etc.)
│   ├── 4-UX-AND-CONTENT/                  UX design, content strategy
│   └── 5-ANALYTICS/                       Product analytics, metrics
│
├── 🔧 2-TECHNICAL/                        Technical Architecture & Specs
│   ├── 0-SYSTEM-ARCHITECTURE/             System design, architecture patterns
│   │   ├── MVP_TECHNICAL_ARCHITECTURE_V5.md  ⭐ PRIMARY - Complete tech architecture
│   │   ├── backend_architecture.md        Backend architecture (MongoDB migration notes)
│   │   └── PERMISSION_MATRIX.md           RBAC matrix, role permissions
│   ├── 1-SERVICE-DESIGNS/                 Microservices, service boundaries
│   ├── 2-APIS/                            API contracts, endpoints
│   ├── 3-DATA/                            Database, data models
│   │   ├── database_schema.md             ⭐ PRIMARY - MongoDB schema (Oct 24 updated)
│   │   └── CASCADE_DELETE_POLICY.md       Data deletion rules, integrity
│   ├── 4-TECH-DECISIONS/                  ADRs, technology choices
│   │   └── BACKEND_AUTOMATION_SPECS.md    Automation rules, business logic
│   └── 5-NON-FUNCTIONAL/                  Performance, security, scalability
│
├── 🚀 3-DELIVERY/                         Project Management & Delivery
│   ├── 0-PROJECT-MGMT/                    Planning, tracking, process
│   │   ├── MASTER_DEV_LIST_V5.md          ⭐ PRIMARY - 247 tasks, 12-week timeline
│   │   ├── 00_Prerequisites/              Week 0 setup, shared models, feature flags
│   │   ├── DOCUMENTATION_GUIDELINES.md    Doc standards, naming conventions
│   │   └── PRODUCT_DEVELOPMENT_PLAYBOOK.md  Dev workflow, branching, release process
│   ├── 1-SPRINTS/                         Sprint plans, retrospectives
│   │   ├── WEEK_6_PLAN.md                 Current week plan
│   │   └── WEEK_5_COMPLETION_SUMMARY.md   Previous week summary
│   ├── 2-QA-AND-TESTING/                  Test plans, QA process
│   │   ├── INTEGRATION_TESTING_GUIDE.md   E2E test scenarios
│   │   └── QA/                            Test plans (Week 2, 5, templates)
│   ├── 3-RELEASE-ENGINEERING/             Release process, deployment
│   │   └── PRODUCTION_BRANCH_GUIDE.md     Git workflow, production deployment
│   ├── 4-RUNTIME-OPS/                     Operations, monitoring, incident response
│   └── 5-POSTMORTEMS/                     Incident analysis, lessons learned
│
├── 💬 CUSTOMER_FEEDBACK/                  Customer feedback, support tickets
├── 🗂️  _ARCHIVE_OLD_STRUCTURE/            Old folder structure (pre-Oct 24)
├── 📁 assets/                             Shared assets (CSS, diagrams, images)
└── 🔧 scripts/                            Automation scripts (PDF generation, etc.)
```

---

## 🎯 NAVIGATION BY USE CASE

### **I'm New to the Project**
1. **Read**: [00_MASTER_STRATEGY.md](./00_MASTER_STRATEGY.md) - Product vision
2. **Read**: [QUICK_SETUP.md](./QUICK_SETUP.md) - Onboarding checklist
3. **Review**: [1-PRODUCT/0-STRATEGY/MVP_STRATEGY_V5.md](./1-PRODUCT/0-STRATEGY/MVP_STRATEGY_V5.md) - Complete MVP strategy
4. **Check**: [_QUICK-START/SETUP_CHECKLIST.md](./_QUICK-START/SETUP_CHECKLIST.md) - Validate setup

### **I Need to Understand the Product**
1. **Strategy**: [1-PRODUCT/0-STRATEGY/MVP_STRATEGY_V5.md](./1-PRODUCT/0-STRATEGY/MVP_STRATEGY_V5.md)
2. **Requirements**: [1-PRODUCT/3-SPECS/MVP_PRD_V3.md](./1-PRODUCT/3-SPECS/MVP_PRD_V3.md)
3. **User Stories**: [1-PRODUCT/3-SPECS/MVP_USER_STORIES_V3.2.md](./1-PRODUCT/3-SPECS/MVP_USER_STORIES_V3.2.md)
4. **Philosophy**: [1-PRODUCT/0-STRATEGY/product_philosophy.md](./1-PRODUCT/0-STRATEGY/product_philosophy.md)

### **I Need Technical Architecture**
1. **Overview**: [2-TECHNICAL/0-SYSTEM-ARCHITECTURE/MVP_TECHNICAL_ARCHITECTURE_V5.md](./2-TECHNICAL/0-SYSTEM-ARCHITECTURE/MVP_TECHNICAL_ARCHITECTURE_V5.md)
2. **Database**: [2-TECHNICAL/3-DATA/database_schema.md](./2-TECHNICAL/3-DATA/database_schema.md) ⭐ Updated Oct 24
3. **Backend**: [2-TECHNICAL/0-SYSTEM-ARCHITECTURE/backend_architecture.md](./2-TECHNICAL/0-SYSTEM-ARCHITECTURE/backend_architecture.md)
4. **Permissions**: [2-TECHNICAL/0-SYSTEM-ARCHITECTURE/PERMISSION_MATRIX.md](./2-TECHNICAL/0-SYSTEM-ARCHITECTURE/PERMISSION_MATRIX.md)

### **I'm Starting Development**
1. **Dev List**: [3-DELIVERY/0-PROJECT-MGMT/MASTER_DEV_LIST_V5.md](./3-DELIVERY/0-PROJECT-MGMT/MASTER_DEV_LIST_V5.md) - 247 tasks
2. **Prerequisites**: [3-DELIVERY/0-PROJECT-MGMT/00_Prerequisites/](./3-DELIVERY/0-PROJECT-MGMT/00_Prerequisites/)
3. **Current Sprint**: [3-DELIVERY/1-SPRINTS/WEEK_6_PLAN.md](./3-DELIVERY/1-SPRINTS/WEEK_6_PLAN.md)
4. **Playbook**: [3-DELIVERY/0-PROJECT-MGMT/PRODUCT_DEVELOPMENT_PLAYBOOK.md](./3-DELIVERY/0-PROJECT-MGMT/PRODUCT_DEVELOPMENT_PLAYBOOK.md)

### **I'm Working with Claude AI**
1. **Interaction Guide**: [_AI-GUIDES/CLAUDE_INTERACTION_GUIDE.md](./_AI-GUIDES/CLAUDE_INTERACTION_GUIDE.md)
2. **Collaboration**: [_AI-GUIDES/COLLABORATION_GUIDE.md](./_AI-GUIDES/COLLABORATION_GUIDE.md)
3. **PDF Creation**: [_AI-GUIDES/QUICK_PDF_GUIDE.md](./_AI-GUIDES/QUICK_PDF_GUIDE.md)

### **I Need to Update Documentation**
1. **Standards**: [_META-DOCS/DOCUMENTATION_STANDARDS.md](./_META-DOCS/DOCUMENTATION_STANDARDS.md)
2. **Editing Rules**: [_META-DOCS/DOC_EDITING_RULES.md](./_META-DOCS/DOC_EDITING_RULES.md)
3. **Version Control**: [_META-DOCS/VERSION_CONTROL_GUIDE.md](./_META-DOCS/VERSION_CONTROL_GUIDE.md)

---

## 📊 KEY DOCUMENTS BY PRIORITY

### ⭐ **TIER 1 - MUST READ** (Primary Sources of Truth)

| Document | Location | Purpose | Updated |
|----------|----------|---------|---------|
| **00_MASTER_STRATEGY.md** | Root | Executive summary, product vision | Oct 21 |
| **MVP_STRATEGY_V5.md** | 1-PRODUCT/0-STRATEGY/ | Complete MVP strategy (v5.0, locked) | Oct 23 |
| **MVP_TECHNICAL_ARCHITECTURE_V5.md** | 2-TECHNICAL/0-SYSTEM-ARCHITECTURE/ | Full technical architecture | Oct 23 |
| **database_schema.md** | 2-TECHNICAL/3-DATA/ | MongoDB schema (modular blocks) | Oct 24 ✨ |
| **MVP_PRD_V3.md** | 1-PRODUCT/3-SPECS/ | Product requirements (v3.0) | Oct 23 |
| **MASTER_DEV_LIST_V5.md** | 3-DELIVERY/0-PROJECT-MGMT/ | 247 tasks, 12-week timeline | Oct 23 |

### 🔹 **TIER 2 - IMPORTANT** (Supporting Documentation)

| Document | Location | Purpose |
|----------|----------|---------|
| MVP_USER_STORIES_V3.2.md | 1-PRODUCT/3-SPECS/ | User stories (7 blocks) |
| backend_architecture.md | 2-TECHNICAL/0-SYSTEM-ARCHITECTURE/ | Backend details (MongoDB notes) |
| PERMISSION_MATRIX.md | 2-TECHNICAL/0-SYSTEM-ARCHITECTURE/ | RBAC matrix |
| CASCADE_DELETE_POLICY.md | 2-TECHNICAL/3-DATA/ | Data deletion rules |
| INTEGRATION_TESTING_GUIDE.md | 3-DELIVERY/2-QA-AND-TESTING/ | E2E test scenarios |
| PRODUCT_DEVELOPMENT_PLAYBOOK.md | 3-DELIVERY/0-PROJECT-MGMT/ | Dev workflow |

### 📘 **TIER 3 - REFERENCE** (Context & Guidelines)

- Product foundation docs (product_overview, product_philosophy, product_classification)
- User journey docs (User_Stories/ folder)
- Meta documentation (_META-DOCS/ folder)
- AI guides (_AI-GUIDES/ folder)
- Quick-start guides (_QUICK-START/ folder)

---

## 🎯 KEY ARCHITECTURE CONCEPTS

### **Modular Block Architecture (7 Blocks)**

**Core Principle**: Block 1 works standalone; all other blocks are optional.

```
Block 1: Core Execution (REQUIRED) ← Works with ZERO other blocks
Block 2: IAM - Companies & Teams (OPTIONAL)
Block 3: Assessment System (OPTIONAL)
Block 4: AI OKR Engine (OPTIONAL)
Block 5: Progress Rollup (OPTIONAL)
Block 6: Bulk Operations (OPTIONAL)
Block 7: Permission Rules Engine (OPTIONAL)
```

**Feature Flags**: All blocks enabled/disabled via `config/feature-flags.js`

### **Technology Stack (Oct 24, 2025)**

**Database**: MongoDB 7.x + Mongoose ODM
- ⚠️ **Migration Note**: PostgreSQL + Sequelize is DEPRECATED (see backend_architecture.md)
- ✅ Current schema: database_schema.md (updated Oct 24)

**Backend**: Node.js v20+ + Express.js
**Frontend**: Vanilla JS (no framework) + Bootstrap 5.3
**Cloud**: Azure App Service, Azure Database for MongoDB

### **Multi-Company IAM Model** (Block 2)

**NEW (Oct 24)**: Users can belong to multiple companies
- `users.companies[]` array with `company_id` and `role`
- `users.current_company_id` for active company context
- Separate `companies` collection (Block 2)
- Backward compatible with legacy `business_id`

### **Dynamic Assessment Dimensions** (Block 3)

**NEW (Oct 24)**: Not hardcoded to SSI (Speed/Strength/Intelligence)
- `assessments.dimensions[]` array (consultant-configurable)
- Separate `assessment_results` collection with per-dimension scores
- Supports SSI + custom dimensions + 360 reviews

---

## 📈 DEVELOPMENT STATUS (WEEK 6)

### **Overall Progress**: 41% Complete (5.5/12 weeks)

| Phase | Weeks | Status | Progress |
|-------|-------|--------|----------|
| **Week 0** | Prerequisites | ✅ Complete | 100% |
| **Week 1-2** | Goals + Tasks + OpenAI | ✅ Complete | 100% |
| **Week 3-4** | Assessment System | ✅ Complete | 100% |
| **Week 5** | Teams + Objectives UI | ✅ Complete | 100% |
| **Week 6** | Goal Management | ⚠️ In Progress | 21% (backend done, frontend pending) |
| **Week 7** | IAM Block | ⬜ Not Started | 0% |
| **Week 7.5** | AI LLM Enhancement | ⬜ Not Started | 0% |
| **Week 8-12** | Remaining blocks | ⬜ Planned | - |

**Launch Target**: January 31, 2026

---

## 📝 RECENT MAJOR UPDATES

### **October 24, 2025** - Documentation Reorganization & Schema Updates

**Schema Updates**:
- ✅ Fixed database_schema.md: MongoDB alignment, modular IAM, dynamic assessments
- ✅ Fixed backend_architecture.md: Added PostgreSQL deprecation notices
- ✅ Added `companies[]` to users collection (multi-company support)
- ✅ Created separate `companies` collection (Block 2)
- ✅ Refactored assessments to use dynamic `dimensions[]`
- ✅ Added `company_id` fields to objectives, goals, tasks
- ✅ Updated invitations schema with `recipient_type` (Block 6 bulk ops)
- ✅ Aligned feature flags with block names

**Documentation Migration**:
- ✅ Migrated 24 files from Karvia_OKR_Product_Planning to KARVIA_STRATEGY
- ✅ Created DOCUMENTATION_MIGRATION_AUDIT_REPORT.md
- ✅ Verified alignment across MVP_STRATEGY_V5, MVP_PRD_V3, MASTER_DEV_LIST_V5

**Folder Reorganization**:
- ✅ Created 4 meta folders: _META-DOCS, _AI-GUIDES, _QUICK-START, _MASTER-PLANNING
- ✅ Moved 15 files from root to categorized folders
- ✅ Kept 3 essential files at root (README, 00_MASTER_STRATEGY, QUICK_SETUP)
- ✅ Clean, navigable structure with clear separation of concerns

---

## 🔗 RELATED DOCUMENTATION

### **Operational Workspace** (Not in KARVIA_STRATEGY)
- `Karvia_OKR_Product_Planning/`: Daily handoffs, issue tracking, improvements
- `Karvia_OKR_Mockups/`: Design mockups, UI/UX assets
- `docs/`: Legacy documentation (pre-KARVIA_STRATEGY)

### **Codebase**
- `server/`: Backend (Node.js + Express)
- `client/`: Frontend (Vanilla JS + Bootstrap)
- `engines/`: Microservice engines (6 engines)

---

## 📞 SUPPORT & CONTACTS

**BRAMHI Labs**:
- **Product Owner**: [Contact Info]
- **Tech Lead**: [Contact Info]
- **GitHub**: [Repo URL]
- **Demo**: [Live Demo URL]

---

## 📝 DOCUMENT HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 21, 2025 | Initial release (Product + Technical docs complete) |
| 2.0 | Oct 24, 2025 | Major reorganization: meta folders, schema updates, migration from Product Planning |

---

## ✅ DOCUMENTATION QUALITY CHECKLIST

**Structure**:
- ✅ Single entry point (00_MASTER_STRATEGY.md)
- ✅ Clear folder hierarchy (0-BUSINESS, 1-PRODUCT, 2-TECHNICAL, 3-DELIVERY)
- ✅ Meta folders for operational docs (_META-DOCS, _AI-GUIDES, etc.)
- ✅ Clean root with only 3 essential files

**Alignment**:
- ✅ All docs reference MongoDB (not PostgreSQL)
- ✅ All docs aligned with 7 blocks (not 8)
- ✅ Multi-company IAM model documented
- ✅ Dynamic assessment dimensions documented
- ✅ Feature flags use block names

**Completeness**:
- ✅ MVP Strategy v5.0 (locked)
- ✅ Technical Architecture v5.0 (complete)
- ✅ Database schema (MongoDB, updated Oct 24)
- ✅ User stories v3.2 (7 blocks)
- ✅ Master dev list v5.0 (247 tasks)
- ✅ Migration audit report (Oct 24)

---

**Created**: October 21, 2025
**Last Updated**: October 24, 2025
**Maintained By**: KARVIA Pro Technical Team
