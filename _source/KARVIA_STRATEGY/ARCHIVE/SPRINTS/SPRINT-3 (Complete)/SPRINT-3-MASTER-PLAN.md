# 📋 Sprint 3 Master Plan
**The Complete Guide to Sprint 3 Implementation**

---

## 🎯 Sprint Overview
- **Sprint Number**: 3
- **Branch**: SPRINT3
- **Duration**: November 21 - December 4, 2025 (10 working days)
- **Total Story Points**: 71 points
- **Theme**: "User Control, Smart Objectives & Core UI Completion"

---

## 📚 Quick Navigation

### Core Documents
- **[Executive Overview](./SPRINT-3-EXECUTIVE-OVERVIEW.md)** - High-level summary for stakeholders
- **[User Stories](./SPRINT-3-USER-STORIES.md)** - Detailed stories with acceptance criteria
- **[Technical Implementation](./SPRINT-3-TECHNICAL-IMPLEMENTATION.md)** - Complete code specifications
- **[Dependencies & Risks](./SPRINT-3-DEPENDENCIES-RISKS.md)** - Risk management plan
- **[Daily Execution Plan](./SPRINT-3-DAILY-EXECUTION-PLAN.md)** - Day-by-day tasks

---

## 🚀 Sprint Goals

### Primary Goal
Enable flexible objective management with intelligent AI assistance while completing critical UI components for daily operations.

### Success Metrics
1. ✅ Users can create objectives with fiscal/custom periods
2. ✅ OKR generation is controlled (no duplicates)
3. ✅ Manual objectives get AI-powered plans
4. ✅ Goal Management UI complete (8 files)
5. ✅ Employee Dashboard functional
6. ✅ Business API supports multi-tenancy

---

## 🆕 Sprint 3 Features (Updated)

### 📌 Epic 1: Flexible Date Management System
**Points**: 21 | **Priority**: P0 | **[Details](./SPRINT-3-USER-STORIES.md#epic-1-flexible-date-management-system)**

#### Features:
1. **Fiscal Year Support**
   - April, July, October start months
   - Automatic quarter calculation
   - Proper date boundaries

2. **Custom Period Objectives**
   - 6-36 month durations
   - Any start/end date
   - Multi-year support

3. **Automatic Date Cascade**
   - Parent changes cascade to children
   - Proportional distribution
   - Conflict detection

#### Technical Implementation:
- **[DateService](./SPRINT-3-TECHNICAL-IMPLEMENTATION.md#date-management-system)** - Core service
- Update Objective model
- Date validation middleware
- Migration script for existing data

---

### 📌 Epic 2: OKR Generation Control (NEW)
**Points**: 3 | **Priority**: P0

#### Feature: One-Time Generation Lock with Admin Override
**Problem**: Prevents duplicate OKR generation chaos
**Solution**: Track generation status, allow admin regeneration

#### Implementation:
```javascript
// Company model updates
{
  okrs_generated: { type: Boolean, default: false },
  okr_generation_date: { type: Date },
  okr_generation_count: { type: Number, default: 0 },
  last_regenerated_by: { type: ObjectId, ref: 'User' },
  regeneration_reason: { type: String }
}
```

#### UI Changes:
1. **team-ssi-view.html**:
   - Disable "Generate OKRs" when `okrs_generated = true`
   - Show: "OKRs generated on [date]"
   - Add link: "Create new objectives →"

2. **objectives.html** (NEW):
   - Add "Regenerate OKRs" button (admin only)
   - Confirmation modal with reason required
   - Warning: "This will archive existing OKRs"

#### API Endpoints:
```javascript
POST /api/ai-okr/generate
  - Check okrs_generated flag
  - Return 400 if already generated (non-admin)

POST /api/ai-okr/regenerate (admin only)
  - Require regeneration_reason
  - Archive existing objectives
  - Generate new set
  - Update generation count
```

---

### 📌 Epic 3: Manual Objective Creation (NEW)
**Points**: 5 | **Priority**: P0

#### Feature: Executive/Consultant Can Create Custom Objectives
**Problem**: Need objectives beyond initial AI generation
**Solution**: Full-featured objective creation interface

#### UI Design:
Create **objective-creation-modal.html**:
```html
<!-- Dynamic form - no hardcoding -->
<div class="objective-modal">
  <form id="objective-form">
    <!-- Basic Info -->
    <input name="title" required>
    <textarea name="description"></textarea>
    <select name="category">
      <!-- Loaded from API -->
    </select>

    <!-- Time Period (using DateService) -->
    <radio name="period_type" value="calendar_year">
    <radio name="period_type" value="fiscal_year">
    <radio name="period_type" value="custom">

    <!-- Fiscal config (if selected) -->
    <select name="fiscal_start_month">
      <!-- Dynamically show months -->
    </select>

    <!-- Key Results (dynamic) -->
    <div id="key-results-container">
      <!-- Add up to 5 key results -->
    </div>

    <button onclick="generateAIPlan()">Generate AI Plan</button>
    <button type="submit">Create Objective</button>
  </form>
</div>
```

#### API Endpoint:
```javascript
POST /api/objectives/manual
{
  title: string,
  description: string,
  category: string,
  time_period_type: enum,
  fiscal_year_start_month?: number,
  start_date: date,
  end_date: date,
  key_results: [{
    title: string,
    target_value: number,
    metric_type: enum
  }],
  ai_assisted: boolean,
  ai_suggestions?: object
}
```

---

### 📌 Epic 4: AI-Assisted Planning (NEW)
**Points**: 8 | **Priority**: P0

#### Feature: OpenAI Generates Plans for Manual Objectives
**Problem**: Manual objectives lack intelligent structure
**Solution**: AI suggests implementation plans with context

#### Context Aggregation:
```javascript
// services/AIContextService.js
async function buildObjectiveContext(companyId, objectiveData) {
  return {
    company: await getCompanyProfile(companyId),
    ssi_scores: await getLatestSSIScores(companyId),
    existing_objectives: await getActiveObjectives(companyId),
    team_structure: await getTeamStructure(companyId),
    industry_benchmarks: await getIndustryData(company.industry),
    requested_objective: objectiveData
  };
}
```

#### OpenAI Integration:
```javascript
// services/AIObjectivePlanner.js
async function generateObjectivePlan(context) {
  const prompt = `
    As an OKR expert, create a comprehensive implementation plan.

    Company Context:
    - Industry: ${context.company.industry}
    - Size: ${context.company.employee_count} employees
    - Strengths: ${context.ssi_scores}
    - Current Objectives: ${context.existing_objectives.length}

    New Objective: "${context.requested_objective.title}"
    Category: ${context.requested_objective.category}
    Duration: ${context.requested_objective.duration_months} months

    Generate:
    1. 3-5 SMART key results with metrics
    2. Quarterly milestones
    3. Resource requirements
    4. Risk factors
    5. Success indicators

    Return as structured JSON.
  `;

  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt,
    max_tokens: 2000,
    temperature: 0.7
  });

  return parseAIResponse(response);
}
```

#### Caching Strategy:
- Cache AI suggestions for 7 days
- Store in Redis with key: `ai_plan:${objectiveId}:${version}`
- Allow manual refresh with "Regenerate Plan" button

---

### 📌 Epic 5: Goal Management UI
**Points**: 13 | **Priority**: P0 | **[Details](./SPRINT-3-USER-STORIES.md#epic-2-goal-management-ui)**

#### Files to Create:
1. `quarterly-goals.html` (400 lines)
2. `weekly-goals.html` (300 lines)
3. `goal-details.html` (300 lines)
4. `goals-api-client.js` (300 lines)
5. `quarterly-goals.js` (350 lines)
6. `weekly-goals.js` (300 lines)
7. `goal-details.js` (400 lines)

**[Full Implementation Guide](./SPRINT-3-TECHNICAL-IMPLEMENTATION.md#goal-management-ui-implementation)**

---

### 📌 Epic 6: Employee Dashboard
**Points**: 8 | **Priority**: P0 | **[Details](./SPRINT-3-USER-STORIES.md#epic-3-employee-dashboard)**

#### Key Features:
1. **Daily Task View** - Today's 3-5 tasks
2. **Why Chain** - Task → Goal → Objective → Company
3. **Quick Progress** - Slider updates without navigation
4. **Weekly Tracker** - Visual progress bar

**[Full Implementation](./SPRINT-3-TECHNICAL-IMPLEMENTATION.md#employee-dashboard-implementation)**

---

### 📌 Epic 7: Business Management API
**Points**: 8 | **Priority**: P0 | **[Details](./SPRINT-3-USER-STORIES.md#epic-4-business-management-api)**

#### New Endpoints:
```
GET    /api/businesses/:id
PUT    /api/businesses/:id
DELETE /api/businesses/:id
GET    /api/businesses/:id/users
GET    /api/businesses/:id/teams
GET    /api/businesses/:id/stats
```

**[Full API Specification](./SPRINT-3-TECHNICAL-IMPLEMENTATION.md#business-management-api)**

---

### 📌 Epic 8: Task Management UI Completion
**Points**: 5 | **Priority**: P1 | **Status**: DEFERRED TO SPRINT 4

*Note: Deferred to manage sprint velocity with new features added*

---

## 📅 Updated Daily Execution Plan

### Day 1-2: Foundation (Nov 21-22)
- ✅ DateService implementation
- ✅ Objective model updates
- ✅ OKR generation lock
- ✅ Company model updates
- **[Detailed Tasks](./SPRINT-3-DAILY-EXECUTION-PLAN.md#day-1-thursday-november-21)**

### Day 3: Date UI + Objective Creation UI (Nov 25)
- Date selector component
- Objective creation modal
- Form validation (dynamic, no hardcoding)
- **[Detailed Tasks](./SPRINT-3-DAILY-EXECUTION-PLAN.md#day-3-monday-november-25)**

### Day 4-5: Goal Management UI (Nov 26-27)
- Quarterly goals page
- Weekly goals page
- Goal details page
- Goals API client
- **[Detailed Tasks](./SPRINT-3-DAILY-EXECUTION-PLAN.md#day-4-tuesday-november-26)**

### Day 6: AI Planning Integration (Nov 28)
- Context aggregation service
- OpenAI prompt engineering
- Response parsing & validation
- Caching implementation
- **[Detailed Tasks](./SPRINT-3-DAILY-EXECUTION-PLAN.md#day-6-thursday-november-28)**

### Day 7-8: Employee Dashboard (Nov 29-Dec 2)
- Dashboard HTML/CSS
- Why Chain component
- Progress tracking
- Performance optimization
- **[Detailed Tasks](./SPRINT-3-DAILY-EXECUTION-PLAN.md#day-7-friday-november-29)**

### Day 9: Business API (Dec 3)
- 6 endpoints implementation
- Multi-tenant isolation
- Access control
- **[Detailed Tasks](./SPRINT-3-DAILY-EXECUTION-PLAN.md#day-8-monday-december-2)**

### Day 10: Integration & Polish (Dec 4)
- End-to-end testing
- Bug fixes
- Documentation
- Sprint demo
- **[Detailed Tasks](./SPRINT-3-DAILY-EXECUTION-PLAN.md#day-10-wednesday-december-4)**

---

## 🏗️ Technical Architecture

### New Services
```javascript
server/services/
├── DateService.js (500 lines)
├── AIContextService.js (NEW - 300 lines)
├── AIObjectivePlanner.js (NEW - 400 lines)
├── ObjectiveRegenerationService.js (NEW - 200 lines)
└── ValidationService.js (300 lines)
```

### Database Updates
```javascript
// Company model additions
{
  okrs_generated: Boolean,
  okr_generation_date: Date,
  okr_generation_count: Number,
  objective_limits: {
    max_per_year: Number, // null = unlimited
    max_active: Number    // null = unlimited
  }
}

// Objective model additions
{
  time_period_type: String,
  fiscal_year_start_month: Number,
  duration_months: Number,
  ai_generated: Boolean,
  ai_suggestions: Object,
  manual_creator_id: ObjectId,
  regeneration_history: [{
    date: Date,
    by: ObjectId,
    reason: String
  }]
}
```

### No Hardcoding Policy
- ❌ No hardcoded templates
- ❌ No hardcoded categories
- ❌ No hardcoded date ranges
- ✅ Everything from database/API
- ✅ Dynamic form generation
- ✅ Configuration-driven UI

---

## ⚠️ Key Decisions Made

1. **OKR Regeneration**: Admin override allowed with reason tracking
2. **Objective Limits**: Unlimited for now (configurable later)
3. **Templates**: No hardcoding - will use AI generation only
4. **AI Caching**: 7-day cache with manual refresh option
5. **Task UI**: Deferred to Sprint 4 to accommodate new features

---

## 📊 Sprint Metrics

### Velocity
- **Planned**: 71 story points
- **Per Day**: 7.1 points average
- **Critical Path**: 50 points (must complete)
- **Nice to Have**: 21 points

### Risk Mitigation
- **[Full Risk Analysis](./SPRINT-3-DEPENDENCIES-RISKS.md)**
- Main risks: Date migration, UI complexity, AI costs
- Mitigation: Backups, simplified UI, caching

### Success Criteria
1. All P0 features complete (66 points)
2. No P0 bugs in production
3. All tests passing (80% coverage)
4. Documentation complete

---

## 🔗 Resources & References

### Sprint Documents
- **[Executive Overview](./SPRINT-3-EXECUTIVE-OVERVIEW.md)** - Stakeholder summary
- **[User Stories](./SPRINT-3-USER-STORIES.md)** - All 16 stories detailed
- **[Technical Guide](./SPRINT-3-TECHNICAL-IMPLEMENTATION.md)** - Code examples
- **[Dependencies & Risks](./SPRINT-3-DEPENDENCIES-RISKS.md)** - Risk register
- **[Daily Plan](./SPRINT-3-DAILY-EXECUTION-PLAN.md)** - Hour-by-hour breakdown

### Related Documents
- [Sprint 2 Summary](../../SPRINT-2/README.md)
- [Master Dev List](../../../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md)
- [Master Issues List](../../../../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md)

### Code Locations
- Branch: `SPRINT3`
- Backend: `/server/`
- Frontend: `/client/`
- Tests: `/tests/`

---

## ✅ Sprint 3 Checklist

### Pre-Sprint ✅
- [x] Sprint 2 deployed to production
- [x] SPRINT3 branch created
- [x] Documentation prepared
- [x] Features defined

### Week 1 (Nov 21-27)
- [ ] DateService complete
- [ ] OKR generation control
- [ ] Manual objective creation UI
- [ ] Goal Management UI

### Week 2 (Nov 28-Dec 4)
- [ ] AI planning integration
- [ ] Employee Dashboard
- [ ] Business API
- [ ] Testing & deployment

### Definition of Done
- [ ] All P0 stories complete
- [ ] Tests passing (>80% coverage)
- [ ] No P0 bugs
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Sprint demo delivered

---

## 📝 Notes

### Important Reminders
1. **No hardcoding** - Everything dynamic from API/database
2. **Admin override** for OKR regeneration with tracking
3. **No objective limits** for now (keep flexible)
4. **AI costs** - Monitor OpenAI usage, use caching
5. **Task UI deferred** - Focus on objectives first

### Next Sprint (Sprint 4)
- Task Management UI completion
- Objective templates (AI-generated)
- Advanced analytics
- Performance optimization
- Mobile responsiveness

---

**Sprint Status**: IN PROGRESS
**Last Updated**: November 20, 2025
**Sprint Owner**: Development Team