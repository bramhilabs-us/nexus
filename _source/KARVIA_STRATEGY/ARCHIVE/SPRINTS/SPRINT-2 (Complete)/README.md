# 📚 SPRINT 2 - PLANNING & DASHBOARD

**Sprint Duration**: November 17-28, 2025
**Status**: ✅ Ready for Execution
**Version**: 2.0 FINAL
**Last Updated**: November 12, 2025

---

## 🚀 QUICK START

### For Executives
→ Read [SPRINT_2_EXECUTIVE_SUMMARY.md](SPRINT_2_EXECUTIVE_SUMMARY.md)

### For Developers
→ Start with [SPRINT_2_TECHNICAL_SPECS.md](SPRINT_2_TECHNICAL_SPECS.md)

### For Product Team
→ Review [SPRINT_2_USER_STORIES.md](SPRINT_2_USER_STORIES.md)

### For Project Managers
→ Follow [SPRINT_2_MASTER_PLAN.md](SPRINT_2_MASTER_PLAN.md)

---

## 📋 SPRINT 2 DOCUMENTS

### Core Planning Documents

| Document | Purpose | Audience | Status |
|----------|---------|----------|--------|
| [SPRINT_2_MASTER_PLAN.md](SPRINT_2_MASTER_PLAN.md) | Complete 10-day execution plan | Dev Team, PM | ✅ FINAL |
| [SPRINT_2_USER_STORIES.md](SPRINT_2_USER_STORIES.md) | 10 user stories with acceptance criteria | Product, Dev | ✅ FINAL |
| [SPRINT_2_TECHNICAL_SPECS.md](SPRINT_2_TECHNICAL_SPECS.md) | Technical implementation details | Dev Team | ✅ FINAL |
| [SPRINT_2_EXECUTIVE_SUMMARY.md](SPRINT_2_EXECUTIVE_SUMMARY.md) | Business value and ROI | Executives | ✅ FINAL |

### Supporting Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [SPRINT_2_UPDATED_PLAN.md](SPRINT_2_UPDATED_PLAN.md) | Latest plan with bug fix details | ✅ Current |
| [GOAL_CASCADING_WITH_KR.md](GOAL_CASCADING_WITH_KR.md) | Architecture using Key Results | ✅ Reference |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | Organization of Sprint 2 files | ✅ Current |

### Mockups

| File | Description | Status |
|------|-------------|--------|
| [mockups/planning-integrated.html](mockups/planning-integrated.html) | Planning page design | ✅ Final |
| [mockups/planning.html](mockups/planning.html) | Simplified planning view | ✅ Final |

---

## ⚠️ CRITICAL INFORMATION

### P0 Bug - Must Fix Day 1
```javascript
// Goal model missing these critical fields:
parent_goal_id    // For quarterly→weekly relationships
child_goal_ids    // For tracking children
time_period       // To distinguish QUARTERLY vs WEEKLY
key_result_id     // To link to Key Results
```

**Impact**: Without this fix, Sprint 2 is BLOCKED
**Fix Time**: 25 minutes
**Location**: `/server/models/Goal.js`

---

## 🎯 SPRINT OBJECTIVES

### Primary Deliverables

1. **Planning Page**
   - AI-powered KR to weekly goal conversion
   - 95% reduction in planning time
   - Reuses existing OpenAI service

2. **Employee Dashboard**
   - Task-centric daily view
   - Today/This Week tabs
   - Complete Why Chain visibility

3. **Goal Model Fix**
   - Add parent-child relationships
   - Enable proper hierarchy tracking
   - Foundation for all features

---

## 📅 10-DAY SCHEDULE

### Week 1 (Nov 17-22)
| Day | Date | Focus | Deliverable |
|-----|------|-------|-------------|
| 1 | Nov 17 | Fix Goal Model + Sprint 1 | Bug fixed, relationships work |
| 2 | Nov 18 | Planning APIs | Backend complete |
| 3 | Nov 19 | Planning Frontend | UI complete |
| 4 | Nov 20 | Planning Integration | Fully functional |
| 5 | Nov 21 | Dashboard Backend | APIs ready |
| 6 | Nov 22 | Dashboard Frontend | UI complete |

### Week 2 (Nov 25-28)
| Day | Date | Focus | Deliverable |
|-----|------|-------|-------------|
| 7 | Nov 25 | Dashboard Integration | Fully functional |
| 8 | Nov 26 | Integration Testing | End-to-end working |
| 9 | Nov 27 | Polish & Optimization | Production ready |
| 10 | Nov 28 | Documentation & Deploy | Sprint complete! |

---

## 💻 TECHNICAL REQUIREMENTS

### Backend Changes
- Add 4 fields to Goal model
- Create 5 new API endpoints
- Implement OpenAI plan generation
- Add lineage tracking

### Frontend Changes
- Create planning.html page
- Create dashboard.html page
- Implement real-time updates
- Add Today/Week toggle

### Key APIs
```javascript
POST /api/planning/generate-plan     // AI generation
POST /api/planning/create-goals      // Save goals
GET /api/dashboard/user/:userId      // User's data
GET /api/lineage/task/:taskId        // Why Chain
PUT /api/tasks/:taskId/complete      // Update task
```

---

## ✅ ACCEPTANCE CRITERIA

### Must Have (P0)
- [ ] Goal model fixed with relationships
- [ ] Planning page generates AI plans
- [ ] Goals created with proper hierarchy
- [ ] Dashboard shows user's tasks
- [ ] Tasks update backend on check

### Should Have (P1)
- [ ] Week view functional
- [ ] Why Chain visible
- [ ] Progress tracking works

---

## 📊 SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Planning Time | < 5 minutes per KR | Time from start to goals created |
| Page Load | < 2 seconds | Performance monitoring |
| Task Updates | < 500ms | API response time |
| Data Integrity | 100% relationships | No orphaned records |
| User Adoption | 100% in week 1 | Daily active users |

---

## 👥 TEAM ASSIGNMENTS

### Backend Developer
- Goal model fix (Day 1)
- Planning APIs (Day 2)
- Dashboard APIs (Day 5)
- Task updates (Day 7)

### Frontend Developer
- Planning UI (Day 3-4)
- Dashboard UI (Day 6-7)
- Polish (Day 9)

### Full Team
- Sprint 1 fixes (Day 1 AM)
- Integration testing (Day 8)
- Documentation (Day 10)

---

## 🚨 RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| Goal migration fails | CRITICAL | Test on dev, backup prod |
| OpenAI quality | HIGH | Regeneration option |
| Performance issues | MEDIUM | Add indexes, caching |
| User adoption | LOW | Clear UI, training |

---

## 📁 FOLDER STRUCTURE

```
SPRINT_2/
├── SPRINT_2_README.md                 # This file
├── SPRINT_2_MASTER_PLAN.md           # Complete plan
├── SPRINT_2_USER_STORIES.md          # User stories
├── SPRINT_2_TECHNICAL_SPECS.md       # Tech specs
├── SPRINT_2_EXECUTIVE_SUMMARY.md     # Executive summary
├── SPRINT_2_UPDATED_PLAN.md          # Bug fix details
├── GOAL_CASCADING_WITH_KR.md         # Architecture
├── FOLDER_STRUCTURE.md               # File organization
├── README.md                          # Old index
├── mockups/
│   ├── planning-integrated.html      # Planning page
│   └── planning.html                  # Simple planning
├── _ARCHIVE_SPRINT_2_OLD/            # Old documents
└── _ARCHIVE_INTERMEDIATE_PLANS/       # Draft versions
```

---

## 🔄 DEPENDENCIES

1. **BLOCKER**: Goal model fix must happen Day 1
2. **OpenAI**: Service already exists (reuse)
3. **Teams**: Must have team members for owner selection
4. **Auth**: User context for filtering

---

## 📞 CONTACT & SUPPORT

**Technical Lead**: CTO
**Product Owner**: VP Operations
**Scrum Master**: Project Manager

**Daily Standup**: 9:00 AM
**Sprint Review**: November 28, 4:00 PM
**Retrospective**: November 29, 10:00 AM

---

## 🎉 SPRINT OUTCOME

After Sprint 2, Karvia Business will have:
- ✅ AI-powered planning reducing time by 95%
- ✅ Every employee knowing daily priorities
- ✅ Complete visibility from tasks to objectives
- ✅ Automatic progress tracking
- ✅ Full strategic alignment

---

**Sprint Status**: READY TO EXECUTE
**Confidence Level**: 95% (after Day 1 fix)
**Business Value**: $75,000+ first year ROI

---

*Use this README as your guide throughout Sprint 2. All documents are final and ready for implementation.*