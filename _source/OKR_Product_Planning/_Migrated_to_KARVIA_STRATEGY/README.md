# 📦 Migrated to KARVIA_STRATEGY

**Purpose**: Files that have been copied to the `/KARVIA_STRATEGY` folder as the primary source of truth.

**Migration Date**: October 24, 2025

---

## ⚠️ IMPORTANT

**These files are kept here for backward compatibility only.**

**PRIMARY COPIES** are in `/KARVIA_STRATEGY` folder. Always reference the KARVIA_STRATEGY version for the latest content.

---

## 📁 Files in This Folder

| File | Primary Location in KARVIA_STRATEGY | Purpose |
|------|-------------------------------------|---------|
| **PERMISSION_MATRIX.md** | `2-TECHNICAL/0-SYSTEM-ARCHITECTURE/` | RBAC matrix, role permissions |
| **CASCADE_DELETE_POLICY.md** | `2-TECHNICAL/3-DATA/` | Data deletion rules, referential integrity |
| **BACKEND_AUTOMATION_SPECS.md** | `2-TECHNICAL/4-TECH-DECISIONS/` | Automation rules, business logic specs |
| **INTEGRATION_TESTING_GUIDE.md** | `3-DELIVERY/2-QA-AND-TESTING/` | E2E test scenarios, API testing |
| **PRODUCTION_BRANCH_GUIDE.md** | `3-DELIVERY/3-RELEASE-ENGINEERING/` | Git workflow, production deployment |
| **DOCUMENTATION_GUIDELINES.md** | `3-DELIVERY/0-PROJECT-MGMT/` | Doc standards, naming conventions |
| **PRODUCT_DEVELOPMENT_PLAYBOOK.md** | `3-DELIVERY/0-PROJECT-MGMT/` | Dev workflow, branching strategy, release process |

---

## 🔗 Also Migrated (in Subfolders)

### **01_MVP/**
- `MVP_STRATEGY_V5.md` → `KARVIA_STRATEGY/1-PRODUCT/0-STRATEGY/`
- `MVP_PRD_V3.md` → `KARVIA_STRATEGY/1-PRODUCT/3-SPECS/`
- `MVP_USER_STORIES_V3.2.md` → `KARVIA_STRATEGY/1-PRODUCT/3-SPECS/`
- `MASTER_DEV_LIST_V5.md` → `KARVIA_STRATEGY/3-DELIVERY/0-PROJECT-MGMT/`
- `User_Stories/` → `KARVIA_STRATEGY/1-PRODUCT/3-SPECS/User_Stories/`

### **03_Product_Foundation/**
- `product_overview.md` → `KARVIA_STRATEGY/1-PRODUCT/0-STRATEGY/`
- `product_philosophy.md` → `KARVIA_STRATEGY/1-PRODUCT/0-STRATEGY/`
- `product_classification.md` → `KARVIA_STRATEGY/1-PRODUCT/0-STRATEGY/`

### **00_Prerequisites/**
- Entire folder → `KARVIA_STRATEGY/3-DELIVERY/0-PROJECT-MGMT/00_Prerequisites/`

### **QA/**
- Entire folder → `KARVIA_STRATEGY/3-DELIVERY/2-QA-AND-TESTING/QA/`

### **Daily_Handoffs/**
- `Week_6/WEEK_6_PLAN.md` → `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/`
- `Week_5/WEEK_5_COMPLETION_SUMMARY.md` → `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/`

---

## 📋 Migration Details

**Full Audit Report**: See `/KARVIA_STRATEGY/_META-DOCS/DOCUMENTATION_MIGRATION_AUDIT_REPORT.md`

**Reason for Migration**:
- Centralize all strategy, technical, and delivery documentation in one location
- Establish KARVIA_STRATEGY as single source of truth
- Keep Karvia_OKR_Product_Planning as operational workspace (Daily Handoffs, MASTER lists)

**What Changed**:
- Files copied (not moved) to maintain backward compatibility
- Primary copies updated in KARVIA_STRATEGY
- Migration notes added to source files

---

## 🔄 Update Policy

**DO NOT update files in this folder.**

**To update these docs**:
1. Navigate to `/KARVIA_STRATEGY`
2. Find the primary copy (see table above)
3. Make edits there
4. Optionally: Copy updated version back here

---

## 📞 Questions?

**Not sure which version to use?**
→ Always use the KARVIA_STRATEGY version

**Need to reference during Week 6+?**
→ Use KARVIA_STRATEGY paths (better organized, always current)

**Legacy code still references these paths?**
→ That's fine - files kept here for compatibility

---

**Last Updated**: October 24, 2025
**Maintained By**: KARVIA Pro Technical Team
