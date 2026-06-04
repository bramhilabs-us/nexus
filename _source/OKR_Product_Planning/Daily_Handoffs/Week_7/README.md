# 📅 WEEK 7 - Goal UI + IAM Block

**Week**: 7 of 12
**Focus**: Goal Management UI (Day 0-1) + Identity & Access Management (Day 2-6)
**Duration**: 7 days (56 hours)
**Status**: ✅ **66% UNBLOCKED** - Ready to start Day 0-1

---

## 🎯 Quick Start

### **What You Need**:

1. **Read First**: [WEEK_7_PLAN.md](./WEEK_7_PLAN.md) - Complete execution plan (single source of truth)
2. **Audit Report**: [GOAL_UI_AUDIT_REPORT.md](./GOAL_UI_AUDIT_REPORT.md) - Backend validation
3. **Status Check**: [PRE_WEEK_7_STATUS.md](./PRE_WEEK_7_STATUS.md) - Current blocker status

### **What To Do**:

#### **Step 1: Pre-Work** (4 hours) 🔴 **MUST DO FIRST**
- Add 3 fields to Goal model (`time_period`, `parent_goal_id`, `child_goal_ids`)
- Create breakdown endpoint (`POST /api/goals/:id/breakdown`)
- See: [WEEK_7_PLAN.md#pre-work](./WEEK_7_PLAN.md#pre-work-backend-fixes-4-hours)

#### **Step 2: Goal UI Development** (24 hours)
- Build 8 frontend files
- Implement 4 user stories (MGR-025, MGR-026, EMP-013, EMP-014)
- See: [WEEK_7_PLAN.md#frontend-development](./WEEK_7_PLAN.md#frontend-development-24-hours)

#### **Step 3: Testing** (6 hours)
- E2E testing for 4 user stories
- API endpoint coverage (12 endpoints)
- Cross-browser validation
- See: [WEEK_7_PLAN.md#testing](./WEEK_7_PLAN.md#hour-21-26-testing--integration-day-2-pm--buffer)

---

## 📁 File Structure

```
Week_7/
├── README.md                        # ← You are here
├── WEEK_7_PLAN.md                   # Main execution plan (109K)
├── GOAL_UI_AUDIT_REPORT.md          # Backend audit report (17K)
├── PRE_WEEK_7_STATUS.md             # Status tracking (9.3K)
└── Week_7_Archive/                  # Historical docs (144K)
    ├── README.md                    # Archive index
    ├── MIGRATION_COMPLETE.md
    ├── BUSINESS_TO_COMPANY_MIGRATION_PLAN.md
    ├── BUSINESS_TO_COMPANY_MIGRATION_PROGRESS.md
    ├── COMPANY_MIGRATION_COMPLETE_SUMMARY.md
    ├── NAMING_DECISION_SUMMARY.md
    ├── AUDIT_AND_WEEK7_UPDATE_SUMMARY.md
    └── WEEKS_1-6_COMPREHENSIVE_AUDIT.md
```

---

## 🚦 Current Status

### **Pre-Week 7 Blockers** (3 total):

| Blocker | Description | Status | Time |
|---------|-------------|--------|------|
| 1️⃣ | Goal Management UI (8 files) | ❌ NOT STARTED | 24h |
| 2️⃣ | Companies API Route | ✅ COMPLETE | - |
| 3️⃣ | Business → Company Migration | ✅ COMPLETE | - |

**Progress**: 2 of 3 complete (66%)

### **Week 7 Timeline**:

- **Day 0 (Pre-work)**: Backend fixes (4 hours)
- **Day 1**: API client + Quarterly goals page (8 hours)
- **Day 2**: Goal details modal + Weekly goals page + Testing (10 hours)
- **Day 3-6**: IAM Block (Company/Team management, Invitations, Multi-company)

---

## 📊 Key Metrics

**Backend**:
- ✅ Goal Model: 537 lines (complete)
- ✅ API Routes: 11 endpoints (verified)
- ⏳ Missing: 3 hierarchy fields + 1 breakdown endpoint

**Frontend**:
- ❌ Files: 0 of 8 exist
- ❌ Lines: 0 of ~2,050 written
- 🎯 User Stories: 4 blocked

**APIs Verified**:
```
✅ GET /api/goals (filters: quarter, week, time_period, status)
✅ POST /api/goals (create quarterly/weekly)
✅ GET /api/goals/:id
✅ PUT /api/goals/:id
✅ PUT /api/goals/:id/progress (EMP-014)
✅ PUT /api/goals/:id/assign
✅ DELETE /api/goals/:id
✅ GET /api/goals/quarter/:quarter
✅ GET /api/goals/my/goals (EMP-013)
✅ GET /api/goals/status/overdue
✅ GET /api/goals/stats/summary
🆕 POST /api/goals/:id/breakdown (add in pre-work)
```

---

## 🎯 User Stories

| ID | Description | Status | Page |
|----|-------------|--------|------|
| **MGR-025** | Manager creates quarterly goals from objectives | ❌ BLOCKED | quarterly-goals.html |
| **MGR-026** | Manager breaks quarterly goals into weekly goals | ❌ BLOCKED | quarterly-goals.html |
| **EMP-013** | Employee views assigned weekly goals | ❌ BLOCKED | weekly-goals.html |
| **EMP-014** | Employee updates goal progress | ❌ BLOCKED | weekly-goals.html |

**All Blocked By**: Missing frontend files

---

## 📚 Additional Resources

### **Technical Docs**:
- [Goal Model](../../../server/models/Goal.js) - Line 1-537
- [Goals API Routes](../../../server/routes/goals.js) - Line 1-576
- [Database Schema](../../../KARVIA_STRATEGY/2-TECHNICAL/3-DATA/database_schema.md)
- [Migration Complete Summary](./Week_7_Archive/MIGRATION_COMPLETE.md)

### **Planning Docs**:
- [Week 6 Plan](../Week_6/WEEK_6_PLAN.md) - Backend implementation
- [Master Dev List V5](../../01_MVP/MASTER_DEV_LIST_V5.md) - Week 7 tasks
- [User Stories](../../01_MVP/User_Stories/)

---

## ⚡ Quick Commands

```bash
# Navigate to Week 7 folder
cd Karvia_OKR_Product_Planning/Daily_Handoffs/Week_7

# Read main plan
cat WEEK_7_PLAN.md | less

# Check backend status
grep -n "time_period\|parent_goal_id\|child_goal_ids" ../../../../server/models/Goal.js

# Check API endpoints
grep -n "router\.(get|post|put|delete)" ../../../../server/routes/goals.js

# Count frontend files
ls ../../../../client/pages/*goal* 2>/dev/null | wc -l
# Should return 0 (no files yet)
```

---

## 🔗 Dependencies

**Completed (Required for Week 7)**:
- ✅ Week 1-6: Core features (Objectives, Assessments, Tasks)
- ✅ Company Migration: business_id → company_id everywhere
- ✅ Companies API: 8 endpoints operational

**Pending (Blocks Week 7 Start)**:
- ❌ Goal hierarchy fields (1 hour)
- ❌ Breakdown endpoint (3 hours)
- ❌ Frontend files (24 hours)

---

## 📞 Support

**Issues?**
- Check [GOAL_UI_AUDIT_REPORT.md](./GOAL_UI_AUDIT_REPORT.md) for known gaps
- Check [PRE_WEEK_7_STATUS.md](./PRE_WEEK_7_STATUS.md) for current status
- Reference [Week_7_Archive/](./Week_7_Archive/) for historical context

**Questions?**
- See WEEK_7_PLAN.md sections for detailed implementation guides
- All code samples are production-ready and copy-paste safe

---

**Last Updated**: October 25, 2025
**Maintained By**: Technical Team
**Status**: Ready for Day 0-1 Pre-Work
