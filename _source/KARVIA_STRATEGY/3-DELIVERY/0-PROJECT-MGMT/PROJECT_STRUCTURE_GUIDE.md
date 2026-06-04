# 📁 Karvia Business - Project Structure
**Updated**: November 2, 2025
**Purpose**: Complete navigation guide for the Karvia Business codebase

## 🗂️ Root Directory Structure

```
karvia_business/
├── 📄 README.md                    # Main project overview (THIS IS YOUR STARTING POINT)
├── 📄 PROJECT_STRUCTURE.md         # This file - navigation guide
├── 📄 DEPLOYMENT_CHECKLIST.md      # Production deployment checklist
├── 📄 SECRETS_MANAGEMENT.md        # Secrets and environment setup guide
├── 📄 package.json                 # Node.js dependencies
├── 📄 package-lock.json           # Dependency lock file
│
├── 📁 server/                      # Backend (95% complete)
│   ├── models/                    # 11 Mongoose models
│   ├── routes/                    # 14 route files (114+ endpoints)
│   ├── services/                  # Business logic services
│   ├── middleware/                # Auth, logging, error handling
│   └── app.js                     # Express app configuration
│
├── 📁 client/                      # Frontend (50% complete)
│   ├── pages/                     # 25 HTML pages
│   ├── css/                       # Styling
│   ├── js/                        # API clients and utilities
│   └── assets/                    # Images and static files
│
├── 📁 KARVIA_STRATEGY/            # Strategy & Architecture Docs
│   ├── 00_MASTER_STRATEGY.md     # Executive strategy document
│   ├── 1-PRODUCT/                 # Product strategy
│   ├── 2-TECHNICAL/               # Technical architecture
│   ├── 3-DELIVERY/                # Delivery plans
│   ├── 4-CUSTOMER/                # Customer feedback
│   └── _ARCHIVE_OLD_STRUCTURE/    # Archived planning docs
│       ├── Planning/              # Old planning documents
│       └── Audit Reports/         # Historical audit reports
│
├── 📁 Karvia_OKR_Product_Planning/ # Active Development Tracking
│   ├── MASTER_DEV_LIST.md        # ⭐ Development progress tracker
│   ├── MASTER_ISSUES_LIST.md     # Known issues and bugs
│   ├── MASTER_IMPROVEMENTS_LIST.md # Future enhancements
│   ├── AUDIT_SUMMARY_2025_11_02.md # Latest comprehensive audit
│   ├── Daily_Handoffs/            # Week-by-week implementation
│   │   ├── Week_0/ to Week_7/    # Completed weeks
│   │   └── Week_8/ to Week_12/   # Upcoming weeks
│   └── MVP_USER_STORIES.md       # User story tracking
│
├── 📁 Karvia_OKR_Mockups/         # UI/UX Mockups
│   ├── Finalised_Mockups/         # 9 production-ready HTML mockups
│   └── Design_elements/           # Reusable components
│
├── 📁 tests/                      # Test files (20% coverage)
├── 📁 docker/                     # Docker configuration
└── 📁 .github/                    # GitHub workflows
```

## 🎯 Key Files for Different Purposes

### For Understanding Current Status
1. **Start Here**: `README.md`
2. **Development Progress**: `Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md`
3. **Latest Audit**: `Karvia_OKR_Product_Planning/AUDIT_SUMMARY_2025_11_02.md`

### For Development Work
1. **Known Issues**: `Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md`
2. **This Week's Plan**: `Karvia_OKR_Product_Planning/Daily_Handoffs/Week_X/`
3. **User Stories**: `Karvia_OKR_Product_Planning/MVP_USER_STORIES.md`

### For Strategy & Architecture
1. **Master Strategy**: `KARVIA_STRATEGY/00_MASTER_STRATEGY.md`
2. **Technical Architecture**: `KARVIA_STRATEGY/2-TECHNICAL/`
3. **Product Planning**: `KARVIA_STRATEGY/1-PRODUCT/`

### For Implementation
1. **Backend Code**: `server/` (95% complete)
2. **Frontend Code**: `client/` (50% complete)
3. **UI Mockups**: `Karvia_OKR_Mockups/Finalised_Mockups/`

## 🔴 Critical Gaps (Priority Order)

1. **Goal Management UI** - `client/pages/goals/` (Missing)
2. **Business API** - `server/routes/businesses.js` (Stub only)
3. **Employee Dashboard** - `client/pages/employee-dashboard.html` (Missing)
4. **Task Management UI** - `client/pages/tasks/` (30% complete)

## 📊 Implementation Status Summary

### ✅ Complete (Production-Ready)
- Authentication & Authorization
- Assessment System
- Team Management
- OKR System Backend
- Goal Management Backend

### ⚠️ Partial
- Goal Management (Backend ✅, Frontend ❌)
- Task Management (Backend ✅, Frontend 30%)
- Business Management (20% - stub only)

### ❌ Missing
- Employee Dashboard
- Goal Management UI
- Planning Screen
- Analytics Dashboard

## 🚀 Next Steps

1. **Immediate Priority**: Complete Goal Management UI (5-7 days)
2. **Secondary**: Fix Business Management API (3-5 days)
3. **Then**: Build Employee Dashboard (3-5 days)

## 📚 Documentation Locations

- **Deployment**: `DEPLOYMENT_CHECKLIST.md`
- **Secrets Setup**: `SECRETS_MANAGEMENT.md`
- **Claude AI Onboarding**: `Karvia_OKR_Product_Planning/CLAUDE_ONBOARDING_GUIDE.md`
- **Archived Docs**: `KARVIA_STRATEGY/_ARCHIVE_OLD_STRUCTURE/`

## 🗃️ Archive Structure

### Recently Archived (Nov 2, 2025)
All old planning docs and audit reports have been archived to:
- `KARVIA_STRATEGY/_ARCHIVE_OLD_STRUCTURE/Planning/` - Old planning docs with dates
- `KARVIA_STRATEGY/_ARCHIVE_OLD_STRUCTURE/Audit Reports/` - Historical audits by month

Each archive folder has an `INDEX.md` file listing all archived documents.

---

**Note**: This structure reflects the cleanup performed on November 2, 2025. The root folder now contains only essential files, with all historical planning and audit documents properly archived.