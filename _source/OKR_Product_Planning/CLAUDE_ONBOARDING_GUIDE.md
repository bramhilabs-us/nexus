# 🤖 CLAUDE ONBOARDING GUIDE
## How to Start a New Session for Week 5-12 Implementation

**Version**: 1.0.0
**Created**: 2025-10-22
**Purpose**: 5-minute startup guide for Claude in new sessions

---

## 📍 **YOU ARE HERE**

Working on: **Week 5-12: Core Screens Implementation**
Current status: Check [MASTER_DEV_LIST.md](./MASTER_DEV_LIST.md) - Week 5-12 section

---

## ⚡ **5-MINUTE STARTUP CHECKLIST**

### Step 1: Read Current Week Plan (2 min)
1. Open: `MASTER_DEV_LIST.md`
2. Scroll to: "WEEK 5-12: CORE SCREENS IMPLEMENTATION"
3. Find current week (check status: ⬜ Not Started vs ✅ Complete)
4. Click link to detailed plan (e.g., `Daily_Handoffs/Week_5/WEEK_5_PLAN.md`)

### Step 2: Check Critical Issues (1 min)
1. Open: `MASTER_ISSUES_LIST.md`
2. Look for: 🔴 CRITICAL issues (P0)
3. Note: Any blockers for current week

### Step 3: Review Design System (1 min)
1. Check: `/Karvia_OKR_Mockups/Finalised_Mockups/` - 9 HTML mockups
2. Read: `/Karvia_OKR_Mockups/Design_elements/README.md` - Design rules

### Step 4: Create TODO List (1 min)
1. Extract tasks from current week's daily plan
2. Use TodoWrite tool to create task list
3. Mark first task as "in_progress"

---

## 📁 **FILE REFERENCE MAP**

### **Strategy & Planning**
```
/Karvia_OKR_Product_Planning/
├── MASTER_DEV_LIST.md              → Overall plan (Week 0-12) ⚠️ Week 7↔8 swapped
├── MASTER_ISSUES_LIST.md           → Known bugs
├── MASTER_IMPROVEMENTS_LIST.md     → Future enhancements
├── WEEK_RESEQUENCE_PROPOSAL.md     → Why Week 7↔8 were swapped
├── 01_MVP/
│   ├── MVP_USER_STORIES.md         → All 97 user stories
│   └── User_Stories/
│       ├── USER_JOURNEYS_MASTER.md → User journey analysis
│       └── MISSING_STORIES_DETAILED.md → 9 new stories
└── Daily_Handoffs/
    ├── Week_5/WEEK_5_PLAN.md       → Full Day 1-5 breakdown
    └── Week_6/ (create at end of Week 5)
```

### **Design Assets**
```
/Karvia_OKR_Mockups/
├── Finalised_Mockups/              → 9 HTML mockups (COPY THESE!)
│   ├── 02_dashboard.html
│   ├── 03_objectives.html
│   ├── 05_team.html
│   ├── 06_planning.html
│   ├── 07_profile.html
│   └── ... (see folder for all)
└── Design_elements/                → Shared components
    └── README.md                   → Design rules
```

### **Code**
```
/server/         → Backend APIs
/client/         → Frontend pages
/engines/        → Microservices
```

---

## 🔄 **WEEKLY WORKFLOW**

### **Monday** (Week Start)
1. Read current week in MASTER_DEV_LIST.md
2. Open detailed plan (e.g., Daily_Handoffs/Week_5/WEEK_5_PLAN.md)
3. Create TodoWrite tasks for the week
4. Start Day 1 tasks

### **Tuesday-Thursday** (Implementation)
1. Reference mockups in /Finalised_Mockups/
2. Copy HTML exactly, wire to APIs
3. Update TodoWrite after each task
4. Test after each feature

### **Friday** (Week End)
1. Complete E2E testing ([INTEGRATION_TESTING_GUIDE.md](./INTEGRATION_TESTING_GUIDE.md))
2. Fix bugs
3. Update MASTER_DEV_LIST.md with ✅
4. Create next week's detailed plan
5. Clear TodoWrite for next week

---

## ⚠️ **CRITICAL RULES**

1. **NEVER create custom designs** - Copy from /Finalised_Mockups/ exactly
2. **NEVER modify assessment pages** - Week 1-4 production code, no changes
3. **ALWAYS check MASTER_ISSUES_LIST** before new features
4. **ALWAYS update TodoWrite** as you work
5. **ALWAYS test daily** - Don't wait until week end
6. **ALWAYS follow production branch workflow** - [PRODUCTION_BRANCH_GUIDE.md](./PRODUCTION_BRANCH_GUIDE.md)

---

## 🎯 **DECISION TREE**

**"What should I work on?"**
→ Check MASTER_DEV_LIST.md current week → Open detailed plan → Follow day-by-day tasks

**"How do I build this page?"**
→ Copy mockup from /Finalised_Mockups/ → Replace static data with API calls → Test

**"What colors/styles to use?"**
→ Use mockup styles exactly as-is → Don't create custom CSS

**"Is there a bug blocking me?"**
→ Check MASTER_ISSUES_LIST.md → If P0, fix first → Then continue

**"Can I add a feature?"**
→ Not in Week 5-12 scope → Add to MASTER_IMPROVEMENTS_LIST.md for later

**"Where do I put this new document?"**
→ Check [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md) → Follow placement rules → Link immediately

**"Why were Week 7 and Week 8 swapped?"**
→ Check [WEEK_RESEQUENCE_PROPOSAL.md](./WEEK_RESEQUENCE_PROPOSAL.md) → Goal Management before Dashboard (create before display)

---

## 🔄 **SESSION CONTINUITY** (Handling Interruptions)

### If Session Interrupted Mid-Task:

**Step 1: Document Current State**
1. Mark current task "in_progress" in TodoWrite
2. Note exact location: "Stopped at [file:line number]"
3. Commit code changes (even if incomplete)

**Step 2: Create Handoff Note**
Use template: [Daily_Handoffs/Templates/DAILY_HANDOFF_TEMPLATE.md](./Daily_Handoffs/Templates/DAILY_HANDOFF_TEMPLATE.md)

Create: `/Karvia_OKR_Product_Planning/Daily_Handoffs/2025-10-22_handoff.md`
```markdown
# Session Handoff - 2025-10-22

**Week**: Week 5
**Day**: Day 2
**Task In Progress**: Building Team APIs (endpoint 3 of 7)

**Completed**:
- ✅ POST /api/teams/create
- ✅ GET /api/teams

**Remaining**:
- ⬜ GET /api/teams/:teamId (in progress - 50% done)
- ⬜ PUT /api/teams/:teamId
- ⬜ DELETE /api/teams/:teamId
- ⬜ POST /api/teams/:teamId/members
- ⬜ DELETE /api/teams/:teamId/members/:userId

**Blockers**: None

**Next Steps**: Complete GET /api/teams/:teamId, then continue with remaining 4 endpoints
```

**Step 3: Next Session Resume**
1. Read handoff note in /Daily_Handoffs/
2. Check TodoWrite for "in_progress" task
3. Review last git commit
4. Continue where you left off

---

## 💻 **COMMON COMMANDS**

### Check Server Status
```bash
ps aux | grep "node server/index.js"
```

### Start Servers
```bash
# Main API Server (port 8080)
npm start

# IAM Engine (port 8081)
cd engines/iam && npm start
```

### Run Tests
```bash
npm test
```

### Check Logs
```bash
tail -f /tmp/karvia-server.log
```

### Kill All Node Processes
```bash
pkill -f "node"
```

---

## 📚 **RELATED DOCUMENTATION**

### **🔴 CRITICAL - Read First**
- [MVP_SCOPE_REVISION.md](./MVP_SCOPE_REVISION.md) - **MVP STRATEGY & TIMELINE CORRECTIONS** 🚨
- [WEEK_5_USER_STORIES_CORRECTIONS.md](./WEEK_5_USER_STORIES_CORRECTIONS.md) - **USER STORY SCOPE FIXES** 🚨

### **Documentation Standards**
- [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md) - **WHERE TO PUT NEW FILES** ⭐
- [Archive/DOCUMENTATION_AUDIT_REPORT.md](./Archive/DOCUMENTATION_AUDIT_REPORT.md) - Complete link audit (historical)
- [Archive/ORPHANED_FILES_REPORT.md](./Archive/ORPHANED_FILES_REPORT.md) - File reachability audit (historical)

---

## 🎓 **LEARNING FROM PAST SESSIONS**

### Week 4 Lessons:
1. **Authentication Issues**: Always check cookies AND Authorization header
2. **API Response Mismatch**: Frontend expects `data.data`, not `data.suggestion`
3. **Browser Cache**: Clear cache when testing frontend changes
4. **Database Persistence**: Always verify data saved to DB, not just in-memory

### Common Pitfalls:
- **Forgetting role-based permissions** → Always test with Admin, Manager, Employee
- **Hardcoding business_id** → Always get from JWT token
- **Not testing empty states** → Test with 0 items, not just with data
- **Skipping error handling** → Always add try/catch and user-friendly errors

---

## ✅ **READY TO START?**

1. ✅ Read MASTER_DEV_LIST.md current week
2. ✅ Open detailed plan (WEEK_X_DETAILED_PLAN.md)
3. ✅ Check MASTER_ISSUES_LIST.md for blockers
4. ✅ Create TodoWrite tasks
5. 🚀 **START CODING!**

---

**Version**: 1.0.0 | **Last Updated**: 2025-10-22
