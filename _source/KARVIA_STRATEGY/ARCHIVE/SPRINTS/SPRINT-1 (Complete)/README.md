# 🚀 Sprint 1: Consultant Journey - Company Assessment Flow

**Sprint Duration**: 9 Days (Nov 6-16, 2025)
**Status**: 🔴 Not Started
**Version**: 1.0.0

---

## 📋 Quick Links

- **[SPRINT_1_MASTER_PLAN.md](./SPRINT_1_MASTER_PLAN.md)** ⭐ - Complete 9-day implementation plan
- **[SPRINT_1_USER_STORIES.md](./SPRINT_1_USER_STORIES.md)** - 5 user stories with acceptance criteria
- **[SPRINT_1_TECHNICAL_REUSABILITY.md](./SPRINT_1_TECHNICAL_REUSABILITY.md)** - Reusability analysis (87% reuse)

---

## 🎯 Sprint Goal

Enable consultants to share assessment templates with company executives, who automatically get company + user accounts created, then can create teams, share assessments, and view detailed team results leading to targeted OKR generation.

---

## 📊 Sprint Metrics

- **Duration**: 9 days
- **Team Size**: 2 devs (1 backend, 1 frontend)
- **Story Points**: 34 points
- **Reusability**: 87%
- **New Code**: ~1,500 lines
- **APIs Created**: 4 new endpoints
- **Pages Modified**: 3 (no new pages!)

---

## 🗂️ Sprint Documents

### **Planning Documents**
1. **[SPRINT_1_MASTER_PLAN.md](./SPRINT_1_MASTER_PLAN.md)** (6,000 words)
   - Complete day-by-day breakdown
   - API specifications
   - UI mockups
   - Testing plan
   - Success criteria

2. **[SPRINT_1_USER_STORIES.md](./SPRINT_1_USER_STORIES.md)** (5,000 words)
   - 5 detailed user stories
   - Acceptance criteria for each
   - Technical requirements
   - Test cases
   - Story dependencies

3. **[SPRINT_1_TECHNICAL_REUSABILITY.md](./SPRINT_1_TECHNICAL_REUSABILITY.md)** (3,500 words)
   - Component-by-component analysis
   - Reuse vs build-from-scratch comparison
   - Risk analysis
   - Optimization opportunities

---

## 🎯 5 User Stories

| ID | Title | Points | Status |
|----|-------|--------|--------|
| **CONS-003B** | Share Assessment with Company | 8 | ⬜ |
| **EXEC-001B** | Accept Company Invitation | 5 | ⬜ |
| **EXEC-002B** | Share Assessment with Teams | 5 | ⬜ |
| **CONS-007B** | View Detailed Team Results | 8 | ⬜ |
| **CONS-006B** | Generate OKRs from Team Results | 8 | ⬜ |

---

## 📅 Sprint Timeline

### **Week 1: Nov 6-9 (4 days)** - Backend Foundation
- Day 1: Database & Models
- Day 2: Company Invitation API
- Day 3: Email & Password Flow
- Day 4: "Send to Company" UI

### **Week 2: Nov 11-16 (5 days)** - Frontend & Integration
- Day 5: Password Setting UI
- Day 6: Share with Teams Modal
- Day 7: Team Breakdown API
- Day 8: Team Results UI
- Day 9: OKR Generation Integration

---

## 🔧 Technical Architecture

### **New APIs (4)**
1. `POST /api/invitations/create-company-invitation` - Company-level invitation
2. `GET /api/assessments/company/:id/team-breakdown` - Detailed team results
3. `POST /api/ai-okr/generate-from-team-results` - OKR generation with team context
4. (Modified) `POST /api/invitations/accept/:token` - Handle existing user password update

### **Modified Pages (3)**
1. `assessment-hub.html` - Add "Send to Company" and "Share with Teams" modals
2. `invitation-accept.html` - Add password setting flow for existing users
3. `team-ssi-view.html` - Add team breakdown table, heatmap, and OKR button

### **Reused Components (7)**
1. ✅ `CompanyCreationService.js` - 100% reuse
2. ✅ `User.js` model - 100% reuse
3. ✅ `Team.js` model + routes - 100% reuse
4. ✅ `teams.html` - 100% reuse (zero changes!)
5. ✅ `mailjetService.js` - 85% reuse (add email template)
6. ✅ `ai-okr.js` - 90% reuse (extend endpoint)
7. ✅ `ai-okr-review.html` - 100% reuse (zero changes!)

---

## 📋 Key Requirements

### **Functional**
- ✅ Consultant provides company name + exec email → Company + user auto-created
- ✅ Exec receives email with temp password (security improvement planned for Sprint 2)
- ✅ Exec clicks link → Sets password → Redirects to assessment hub
- ✅ Exec creates teams using existing teams.html
- ✅ Exec shares assessment with teams
- ✅ Team members complete assessments (existing flow)
- ✅ Enhanced team results with breakdown table and heatmap
- ✅ "Generate 4 OKRs" button on team results page
- ✅ OKRs target identified weak areas

### **Non-Functional**
- ⚡ Company creation: < 3 seconds
- ⚡ Team results load: < 2 seconds (10 teams)
- ⚡ OKR generation: < 8 seconds
- 🔒 Temp password: 16-char crypto random
- 🔒 Invitation expiry: 7 days
- 🔒 Company name conflicts: Append "(2)", "(3)"

---

## 🧪 Testing Strategy

### **Unit Tests (15)**
- 5 backend API tests
- 5 frontend form validation tests
- 5 model/service tests

### **Integration Tests (6)**
- Consultant sends invitation → Company/user created
- Executive accepts invitation → Password set
- Executive shares with teams → Bulk invitations sent
- Team completes assessments → Results calculated
- View team breakdown → Data displayed
- Generate OKRs → 4 OKRs created

### **End-to-End Tests (4)**
- Complete consultant flow (template → invite company)
- Complete executive flow (accept → create teams → share)
- Complete team flow (complete assessments)
- Complete OKR flow (results → generate → review)

---

## 📈 Success Metrics

### **Development Metrics**
- ✅ Sprint velocity: 1,500 lines in 9 days (167 lines/day)
- ✅ Reuse rate: > 85%
- ✅ Test coverage: > 80%
- ✅ Code review: 100% of PRs reviewed

### **Functional Metrics**
- ✅ Consultant invitation time: < 2 minutes
- ✅ Executive onboarding time: < 2 minutes
- ✅ Team results load: < 2 seconds
- ✅ OKR generation: < 8 seconds

### **User Metrics** (Post-Release)
- 📊 Invitation acceptance: > 80%
- 📊 Password set rate: > 90% (within 7 days)
- 📊 Team creation rate: > 70%
- 📊 Assessment completion: > 60%

---

## 🚨 Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Company name conflicts | Medium | Low | Append "(2)", "(3)" automatically |
| Temp password security | Low | Medium | 16-char random, 7-day expiry; password reset in Sprint 2 |
| Email deliverability | Low | High | Use Mailjet (existing), SPF/DKIM configured |
| Performance (team breakdown) | Medium | Medium | MongoDB aggregation, indexed queries |
| Heatmap complexity | Low | Low | Simple HTML table with CSS |

---

## 🔗 Related Documentation

### **User Journeys**
- [CONSULTANT_JOURNEY.md](../../../Karvia_OKR_Product_Planning/01_MVP/User_Stories/CONSULTANT_JOURNEY.md)
- [EXECUTIVE_JOURNEY.md](../../../Karvia_OKR_Product_Planning/01_MVP/User_Stories/EXECUTIVE_JOURNEY.md)

### **Technical References**
- [CompanyCreationService.js](../../../server/services/CompanyCreationService.js)
- [User Model](../../../server/models/User.js)
- [Team Routes](../../../server/routes/teams.js)
- [Invitation System](../../../server/routes/invitations.js)

### **Planning**
- [MASTER_DEV_LIST.md](../../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md) - Overall plan
- [MASTER_IMPROVEMENTS_LIST.md](../../../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md) - Future enhancements

---

## ✅ How to Use This Sprint

### **For Developers**

**Step 1**: Read the master plan
```bash
cat SPRINT_1_MASTER_PLAN.md
```

**Step 2**: Understand user stories
```bash
cat SPRINT_1_USER_STORIES.md
```

**Step 3**: Check reusability analysis
```bash
cat SPRINT_1_TECHNICAL_REUSABILITY.md
```

**Step 4**: Start Day 1 tasks from master plan

---

### **For Product Managers**

**Step 1**: Review user stories for acceptance criteria
**Step 2**: Understand dependencies between stories
**Step 3**: Plan UAT based on acceptance criteria
**Step 4**: Track progress via daily standups

---

### **For QA Engineers**

**Step 1**: Read test cases in user stories document
**Step 2**: Create test plans for each story
**Step 3**: Execute integration tests after each phase
**Step 4**: Execute E2E tests at sprint end

---

## 📊 Sprint Backlog

### **Phase 1: Backend (Day 1-3)** ⬜ Not Started
- [ ] Update Invitation model (30 minutes)
- [ ] Create company invitation API (8 hours)
- [ ] Email template & password flow (6 hours)

### **Phase 2: Frontend Invitation (Day 4-5)** ⬜ Not Started
- [ ] "Send to Company" UI (6 hours)
- [ ] Password setting UI (4 hours)

### **Phase 3: Team Sharing (Day 6)** ⬜ Not Started
- [ ] Share with teams modal (6 hours)

### **Phase 4: Team Results (Day 7-8)** ⬜ Not Started
- [ ] Team breakdown API (6 hours)
- [ ] Team results UI (8 hours)

### **Phase 5: OKR Integration (Day 9)** ⬜ Not Started
- [ ] OKR generation API (3 hours)
- [ ] Generate button & redirect (3 hours)

---

## 🎉 Sprint Completion Criteria

Sprint 1 is complete when:
- ✅ All 9 days' tasks marked complete
- ✅ All 5 user stories pass acceptance criteria
- ✅ End-to-end tests passing (6 tests)
- ✅ Performance metrics met (< 2s page loads)
- ✅ No P0 bugs remaining
- ✅ Sprint retrospective completed
- ✅ Next sprint planned

---

## 💡 Next Steps After Sprint 1

### **Sprint 2 Priorities**
1. Password reset flow via email link (IMP-SPRINT1-001)
2. Mobile responsive design
3. Performance optimization
4. Additional team result visualizations

### **Beta Features**
1. React migration
2. Advanced analytics
3. Slack/Teams integration

---

**Created**: November 5, 2025
**Version**: 1.0.0
**Status**: 🔴 Not Started
**Next Review**: November 6, 2025 (Sprint Start)
