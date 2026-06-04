# 📂 KARVIA OKR - PROJECT STRUCTURE GUIDE

**Version**: 1.0.0
**Last Updated**: 2025-10-22 10:45:00
**Purpose**: Complete overview of project organization after Week 5-12 reorganization

---

## 🗂️ TOP-LEVEL STRUCTURE

```
karvia_business/
├── 📁 Karvia_OKR_Mockups/          ← Design assets (HTML mockups, design system)
├── 📁 Karvia_OKR_Product_Planning/ ← Planning docs (this folder)
├── 📁 client/                      ← Frontend code (HTML pages, JS, CSS)
├── 📁 server/                      ← Backend API (routes, models, services)
├── 📁 engines/                     ← Microservices (IAM, assessment, planner, etc.)
├── 📁 scripts/                     ← Utility scripts (link checker, deployment, etc.)
├── 📁 tests/                       ← Test suites
└── 📄 README.md                    ← Project overview (shows current phase)
```

---

## 🎨 KARVIA_OKR_MOCKUPS/ - Design Assets

```
Karvia_OKR_Mockups/
├── 📁 Finalised_Mockups/           ← ⭐ USE THESE FOR WEEK 5-12
│   ├── 01_login.html
│   ├── 02_dashboard.html           ← Copy for Dashboard screen (Week 7)
│   ├── 03_objectives.html          ← Copy for Objectives screen (Week 5 Day 4)
│   ├── 04_assessment_NOTE.md       ← Reference: Assessment in /client/pages/
│   ├── 05_team.html                ← Copy for Team screen (Week 5 Day 3)
│   ├── 06_planning.html            ← Copy for Planning screen (Week 9)
│   ├── 07_profile.html             ← Copy for Profile screen (Week 6)
│   ├── 08_analytics.html           ← Copy for Analytics screen (Week 11)
│   ├── 09_admin.html               ← Copy for Admin panel (Week 11)
│   └── 10_add_objective.html       ← Copy for Add Objective form
│
├── 📁 Design_elements/             ← Shared components (created on-demand)
│   └── README.md                   ← Index of design system files
│
├── 📁 unified_design/              ← Original mockups (archived)
│   ├── manager/
│   ├── employee/
│   └── ... (historical reference only)
│
└── 📁 ... (other old mockup folders - ignore during Week 5-12)
```

**Week 5-12 Rule**: ✅ **ONLY use files from `/Finalised_Mockups/`**

---

## 📚 KARVIA_OKR_PRODUCT_PLANNING/ - Planning Documentation

```
Karvia_OKR_Product_Planning/
│
├── 📄 README.md                    ← ⭐ START HERE (Content index)
├── 📄 CLAUDE_ONBOARDING_GUIDE.md   ← ⭐ 5-minute session startup guide
│
├── 📄 MASTER_DEV_LIST.md           ← ⭐ Overall Week 0-12 plan (v3.0.0)
├── 📄 MASTER_ISSUES_LIST.md        ← ⭐ Known bugs (33 issues, v2.0.0)
├── 📄 MASTER_IMPROVEMENTS_LIST.md  ← Future enhancements (67 items)
│
├── 📄 WEEK_5_DETAILED_PLAN.md      ← ⭐ Current week day-by-day breakdown
├── 📄 WEEK_6-12_DETAILED_PLAN.md   ← Created on-demand (Week 6-12 overview in MASTER_DEV_LIST)
│
├── 📄 PROJECT_STRUCTURE.md         ← This file
├── 📄 REORGANIZATION_VERIFICATION.md ← Sign-off document
│
├── 📁 00_Prerequisites/            ← Week 0 setup (completed)
├── 📁 01_MVP/                      ← MVP strategy, PRD, user stories
│   ├── MVP_STRATEGY.md
│   ├── MVP_PRD.md
│   ├── MVP_USER_STORIES.md
│   └── ... (technical architecture docs)
│
├── 📁 02_Beta/                     ← Beta release planning (Q1 2026)
├── 📁 03_Product_Foundation/       ← Product philosophy, vision
├── 📁 04_Archive/                  ← Old planning docs (historical)
│
├── 📁 Archive/                     ← ⭐ Obsolete files moved here
│   ├── README.md                   ← What's archived and why
│   ├── START_HERE.md               ← Old (use CLAUDE_ONBOARDING_GUIDE.md)
│   ├── WEEK_1_COMPLETION_SUMMARY.md
│   ├── SUMMARY_OF_CHANGES.md
│   ├── MASTER_LISTS_README.md
│   └── REORGANIZATION_PROGRESS.md
│
├── 📁 Daily_Handoffs/              ← Session notes (Week 1-4)
│   ├── Week_1/
│   ├── Week_2/
│   ├── Week_3/
│   └── Week_4/
│
├── 📁 QA/                          ← Test plans, QA docs
└── 📁 Review Docs/                 ← Architecture reviews, alignment docs
```

---

## 🎯 QUICK NAVIGATION FOR WEEK 5-12

### **Starting a New Session?**
1. Read: [CLAUDE_ONBOARDING_GUIDE.md](./CLAUDE_ONBOARDING_GUIDE.md) (5 minutes)
2. Check: [MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md) - Find current week
3. Open: Current week's detailed plan (e.g., [WEEK_5_DETAILED_PLAN.md](./WEEK_5_DETAILED_PLAN.md))
4. Review: [MASTER_ISSUES_LIST.md](./MASTER_ISSUES_LIST.md) - Check for blockers

### **Need a Mockup?**
- Go to: `/Karvia_OKR_Mockups/Finalised_Mockups/`
- Copy the HTML file exactly
- Wire to APIs

### **Found a Bug?**
1. Add to: [MASTER_ISSUES_LIST.md](./MASTER_ISSUES_LIST.md)
2. Assign priority: P0 (critical), P1 (high), P2 (medium)
3. Mark as blocker if it stops current week's work

### **Week Complete?**
1. Update: [MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md) - Mark week ✅
2. Create: Next week's detailed plan (WEEK_X_DETAILED_PLAN.md)
3. Move: Current week handoffs to Daily_Handoffs/Week_X/

---

## 📊 FOLDER USAGE STATUS

| Folder | Status | Use for Week 5-12? |
|--------|--------|-------------------|
| **Finalised_Mockups/** | ✅ Active | ✅ YES - Copy these! |
| **Design_elements/** | ✅ Active | ✅ YES - On-demand creation |
| **Archive/** | 📦 Archived | ❌ NO - Historical reference only |
| **Daily_Handoffs/** | 📝 Historical | ℹ️ Reference if needed |
| **00_Prerequisites/** | ✅ Complete | ℹ️ Reference for setup info |
| **01_MVP/** | ✅ Active | ℹ️ Reference for strategy/PRD |
| **02_Beta/** | 🔮 Future | ❌ NO - Post-Week 12 |
| **QA/** | ✅ Active | ℹ️ Test plans |
| **Review Docs/** | 📝 Historical | ℹ️ Architecture decisions |

---

## 🚀 WEEK 5-12 FILE WORKFLOW

### **Week Start (Monday)**
1. Open: `WEEK_X_DETAILED_PLAN.md`
2. Extract: Day 1 tasks
3. Use TodoWrite: Track progress

### **During Week (Mon-Fri)**
1. Copy mockup from `/Finalised_Mockups/`
2. Build feature following detailed plan
3. Update: `MASTER_ISSUES_LIST.md` if bugs found
4. Test daily

### **Week End (Friday)**
1. Mark: Week complete in `MASTER_DEV_LIST.md`
2. Create: `WEEK_X+1_DETAILED_PLAN.md` for next week
3. Archive: Handoff notes to `Daily_Handoffs/Week_X/`
4. Clear: TodoWrite for fresh start

---

## 🔗 KEY FILE RELATIONSHIPS

```
MASTER_DEV_LIST.md
    ↓ Links to
WEEK_5_DETAILED_PLAN.md
    ↓ References
/Finalised_Mockups/05_team.html
    ↓ Implemented in
/client/pages/team.html
    ↓ Wired to
/server/routes/teams.js
    ↓ Uses
/server/models/Team.js
    ↓ If bugs found
MASTER_ISSUES_LIST.md
    ↓ Fixed and marked
MASTER_DEV_LIST.md (✅ complete)
```

---

## 📦 WHAT'S BEEN ARCHIVED

**Moved to Archive/** (2025-10-22):
- `START_HERE.md` → Use [CLAUDE_ONBOARDING_GUIDE.md](./CLAUDE_ONBOARDING_GUIDE.md)
- `SUMMARY_OF_CHANGES.md` → Historical context only
- `WEEK_1_COMPLETION_SUMMARY.md` → Week 1 done, archived
- `MASTER_LISTS_README.md` → Superseded by [README.md](./README.md)
- `REORGANIZATION_PROGRESS.md` → Task tracking, now complete

**Why Archived?**
- No longer needed for Week 5-12 implementation
- Superseded by new structure (v3.0.0)
- Historical reference preserved

---

## ✅ VERIFICATION CHECKLIST

Before starting Week 5, verify:
- ✅ `MASTER_DEV_LIST.md` shows Week 5-12 overview
- ✅ `WEEK_5_DETAILED_PLAN.md` exists with day-by-day tasks
- ✅ `/Finalised_Mockups/` has 9 HTML files + 1 NOTE
- ✅ `MASTER_ISSUES_LIST.md` has Week 4 critical bug (ISS-W4-001)
- ✅ `CLAUDE_ONBOARDING_GUIDE.md` has 5-minute startup guide
- ✅ Obsolete files moved to `Archive/`

**Status**: ✅ **ALL VERIFIED - READY FOR WEEK 5**

---

## 🤖 FOR FUTURE CLAUDE SESSIONS

**First 5 Minutes**:
1. Read: [CLAUDE_ONBOARDING_GUIDE.md](./CLAUDE_ONBOARDING_GUIDE.md)
2. Check: Current week in [MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md)
3. Open: Current week's detailed plan
4. Review: Critical issues in [MASTER_ISSUES_LIST.md](./MASTER_ISSUES_LIST.md)
5. Start: TodoWrite with first task

**File You'll Use Most**:
- 📄 `WEEK_X_DETAILED_PLAN.md` (current week)
- 📁 `/Finalised_Mockups/` (copy mockups)
- 📄 `MASTER_ISSUES_LIST.md` (track bugs)

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22 10:45:00
**Status**: ✅ Complete - Production-Ready Structure
