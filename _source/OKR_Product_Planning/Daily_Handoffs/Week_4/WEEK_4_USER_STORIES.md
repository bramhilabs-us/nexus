# Week 4 - User Stories & Requirements
## AI OKR Generation from Assessment → Objective Detail Page

**Created**: October 19, 2025
**Target**: November 30, 2025 MVP Release
**Mockup Reference**: `/Karvia_OKR_Mockups/MVP_Nov30Rel/02_employee/objective_detail.html`

---

## 🎯 **Vision Statement**

Users who complete assessments should automatically receive AI-generated improvement objectives tailored to their weak areas. These objectives must flow seamlessly into the objective detail page with zero hardcoding - every data element dynamically sourced from the database or calculated in real-time.

---

## 📊 **Data Element Analysis from Mockup**

### **Page Elements Requiring Database/Calculation**

#### **1. User Context (Navigation Header)**
- ✅ User Avatar URL (`user_id.avatar_url`)
- ✅ User Full Name (`user_id.first_name + last_name`)
- ✅ User Role (`user_id.role`) → Controls navigation visibility

#### **2. Page Header**
- 📅 Current Quarter Display (Q4 2024) → **Calculate**: `getCurrentQuarter()` based on business fiscal year settings
- 🔢 Active Objectives Count (3) → **Query**: `Objective.countDocuments({ user_id, status: 'active' })`

#### **3. Quick Stats Section** (4 cards)
- **Card 1: Active Objectives**
  - Count: 3 → `Objective.countDocuments({ user_id, status: 'active' })`
  - Status: "In progress" → Derived from count > 0

- **Card 2: Overall Progress**
  - Percentage: 67% → **Calculate**: Average of all active objectives' `progress_percentage`
  - Status: "Above target" → **Logic**: if progress > (current_week/total_weeks * 100) then "Above target"

- **Card 3: Key Results**
  - Count: "8/12" → **Calculate**:
    - Total KRs: `objectives.reduce((sum, obj) => sum + obj.key_results.length, 0)`
    - Completed KRs: Count where `key_results.status === 'completed'`

- **Card 4: AI Accuracy**
  - Percentage: 94% → **Query**: `AIOKRSuggestion` approval stats for user
  - Label: "Task planning" → Static for now, future: AI task generation accuracy

#### **4. Priority Overview Section** (Focus: 4 priority cards)
- For each objective card:
  - Priority Indicator (High/Medium/Low) → `objective.priority`
  - Objective Title → `objective.title`
  - Progress Percentage → `objective.progress_percentage`
  - Status Text ("Needs attention", "On track", "Ahead of schedule") → **Calculate**:
    ```javascript
    if (progress < expected_progress_for_week * 0.8) return "Needs attention"
    if (progress > expected_progress_for_week * 1.2) return "Ahead of schedule"
    return "On track"
    ```
  - Objective ID for scroll → `objective._id`

#### **5. Filter Controls**
- Total objectives count: 4 → `objectives.length`
- Visible count after filter → Dynamic based on active filter

#### **6. Objective Cards** (Main grid, 4 objectives)

For each objective card:

##### **Header Section**
- Title → `objective.title`
- Quarter → `objective.timeline.target_year` + quarter from `key_results[].quarter`
- KR Count → `objective.key_results.length`
- Status Label → **Calculated** (see logic above)
- Progress Percentage → `objective.progress_percentage`
- Week Progress → **Calculate**:
  ```javascript
  current_week = Math.floor((Date.now() - objective.start_date) / (7 * 24 * 60 * 60 * 1000))
  total_weeks = Math.floor((objective.end_date - objective.start_date) / (7 * 24 * 60 * 60 * 1000))
  ```

##### **Progress Bar**
- Width → `objective.progress_percentage` (CSS style)
- Color → Based on status (green: on track, red: at risk, blue: ahead)

##### **Top Key Results** (2 most important KRs)
- KR Title → `key_result.title`
- Current → Target display → `${key_result.current_value}${key_result.unit} → ${key_result.target_value}${key_result.unit}`
- Progress Percentage → **Calculate**: `(current_value / target_value) * 100`
- Status Indicator (green/red/blue) → Based on progress vs expected

##### **Summary Stats**
- "X KRs on track" → **Count**: KRs where progress >= expected
- "X need attention" → **Count**: KRs where progress < expected
- "X at risk" → **Count**: KRs marked with `status: 'at_risk'`

##### **Action Buttons**
- "Tasks" button → Links to task breakdown (future: Week 5)
- "Update" button → Opens update progress modal
- "AI Help" button (for at-risk objectives) → Triggers AI recommendation

#### **7. AI Insights Section** (Bottom)
- 🎯 Focus Area → **AI Generated**: Analyze objectives, identify lowest progress
- ⚡ Quick Win → **AI Generated**: Identify ahead objectives for resource reallocation
- 📈 Forecast → **AI Generated**: Calculate completion timeline based on current velocity

---

## 👤 **User Stories**

### **Epic 1: Assessment → AI OKR Generation**

#### **US-4.1: Manager Generates Objectives from Assessment**
**As a** Manager/Executive/Business Owner
**I want to** generate improvement objectives from a completed assessment
**So that** I can quickly create actionable OKRs based on data-driven insights

**Acceptance Criteria**:
- [ ] User completes an assessment
- [ ] System identifies weak areas (scores < 40)
- [ ] "Generate Objectives" button appears on assessment results page
- [ ] Clicking button calls AI service with assessment ID
- [ ] AI generates 3-5 SMART objectives with 3-4 KRs each
- [ ] Objectives directly address identified weak areas
- [ ] Generation completes in < 15 seconds
- [ ] Loading indicator shows during generation
- [ ] Error handling for AI failures (fallback to templates)

**API Endpoint**: `POST /api/ai-okr/generate/:assessmentId`

**Database**: Creates `AIOKRSuggestion` document with status='draft'

---

#### **US-4.2: User Reviews AI-Generated Objectives**
**As a** Manager
**I want to** review and edit AI-generated objectives before approval
**So that** I can ensure they align with my business goals

**Acceptance Criteria**:
- [ ] After generation, user redirected to review page
- [ ] All generated objectives displayed in editable cards
- [ ] Each objective shows:
  - Title (editable)
  - Description (editable)
  - Priority (dropdown: critical/high/medium/low)
  - Effort estimate (dropdown: low/medium/high/extra_high)
  - Weak area context (dimension, current score, target score)
  - 3-4 key results (each editable)
- [ ] For each KR, show:
  - Title (editable)
  - Metric type (dropdown: number/percentage/boolean/currency)
  - Target value (editable)
  - Unit (editable)
  - Quarter (dropdown: Q1/Q2/Q3/Q4)
- [ ] Edit button opens inline editor
- [ ] Changes save to `AIOKRSuggestion.objectives[]` with `edited: true`
- [ ] Dismiss button removes objective from suggestion
- [ ] Visual indicator shows which objectives were edited

**Page**: `client/pages/ai-okr-review.html`

**API Endpoint**: `PUT /api/ai-okr/edit/:suggestionId/:objectiveIndex`

---

#### **US-4.3: User Approves and Creates Objectives**
**As a** Manager
**I want to** approve AI-generated objectives and save them as real objectives
**So that** I can start tracking progress

**Acceptance Criteria**:
- [ ] Each objective card has "Approve" button
- [ ] Clicking "Approve" creates `Objective` document from suggestion
- [ ] Approved objective includes:
  - All edited fields
  - `ai_generated: true` flag
  - `source: 'ai_assessment'` metadata
  - Link to original assessment (`assessment_id`)
  - Link to weak area (`weak_area_reference`)
- [ ] Key results embedded in objective
- [ ] Owner defaults to current user (can be reassigned)
- [ ] Start date = today, end date = calculated from quarters
- [ ] Status = 'draft' initially
- [ ] After approval, objective marked in suggestion (`approved: true`, `objective_id` set)
- [ ] Success toast: "Objective created successfully"
- [ ] Option to "Approve All" (bulk action)
- [ ] After approval, redirect to objectives page

**API Endpoint**: `POST /api/ai-okr/approve`

**Request Body**:
```json
{
  "suggestionId": "...",
  "objectiveIndices": [0, 1, 2, 3],
  "overrides": {
    "0": { "owner_id": "userId", "start_date": "2025-01-01" }
  }
}
```

**Database**: Creates `Objective` documents, updates `AIOKRSuggestion` status

---

### **Epic 2: Objective Detail Page (Zero Hardcoding)**

#### **US-4.4: User Views Objectives Dashboard**
**As a** Employee/Manager/Executive
**I want to** see all my objectives in a dashboard
**So that** I can track progress at a glance

**Acceptance Criteria**:
- [ ] Page loads with authentication check
- [ ] User context loaded from `/api/auth/me`
- [ ] Role-based navigation visible (Employee/Manager/Executive/Admin)
- [ ] Current quarter calculated from business fiscal year settings
- [ ] Active objectives count fetched from API
- [ ] "Add Objective" button visible only for managers+ (role check)
- [ ] Quick stats section shows:
  - Active objectives count (query)
  - Overall progress percentage (calculated average)
  - Key results count (aggregated)
  - AI accuracy (from approval stats)
- [ ] All values fetched from API, zero hardcoded numbers
- [ ] Loading states for all dynamic content
- [ ] Empty state when no objectives exist

**API Endpoints**:
- `GET /api/auth/me` → User context
- `GET /api/objectives/my-dashboard` → Dashboard data

**Response**:
```json
{
  "user": { "id": "...", "name": "...", "role": "...", "avatar_url": "..." },
  "business": { "fiscal_year_start": 1 },
  "currentQuarter": { "year": 2024, "quarter": 4, "label": "Q4 2024" },
  "stats": {
    "active_objectives_count": 3,
    "overall_progress": 67,
    "total_key_results": 12,
    "completed_key_results": 8,
    "ai_accuracy": 94
  },
  "objectives": [ /* array of objectives */ ]
}
```

---

#### **US-4.5: User Views Priority Overview**
**As a** Manager
**I want to** see my top priority objectives at a glance
**So that** I know what needs attention

**Acceptance Criteria**:
- [ ] Priority overview section shows top 4 objectives (sorted by priority, then status)
- [ ] Each card shows:
  - Priority indicator (color-coded dot)
  - Objective title
  - Progress percentage
  - Status text (calculated, not stored)
  - "View Details" scroll-to link
- [ ] Status calculation logic:
  ```javascript
  expected_progress = (current_week / total_weeks) * 100
  if (progress < expected_progress * 0.8) → "Needs attention"
  if (progress > expected_progress * 1.2) → "Ahead of schedule"
  else → "On track"
  ```
- [ ] Clicking "View Details" smoothly scrolls to objective card
- [ ] Priority colors: High=Red, Medium=Yellow, Low=Green
- [ ] If < 4 objectives, show all available
- [ ] If no objectives, hide this section

---

#### **US-4.6: User Filters Objectives**
**As a** Manager
**I want to** filter objectives by status
**So that** I can focus on specific priorities

**Acceptance Criteria**:
- [ ] Filter buttons: "All", "Needs Attention", "On Track", "Ahead of Schedule"
- [ ] Default: "All" selected
- [ ] Clicking filter updates visible objectives (client-side)
- [ ] Visible count updates: "X of Y objectives"
- [ ] Filter state persists in URL query parameter
- [ ] Active filter button highlighted with gradient
- [ ] No page reload, instant filtering
- [ ] Animations for show/hide

---

#### **US-4.7: User Views Objective Cards**
**As a** Employee
**I want to** see detailed information for each objective
**So that** I understand progress and what's needed

**Acceptance Criteria**:
- [ ] Each objective displays as a card with:
  - Border color based on priority (left border)
  - Title (from `objective.title`)
  - Quarter and KR count (from data)
  - Status label (calculated)
  - Progress percentage (from `objective.progress_percentage`)
  - Week progress (calculated: "Week X/Y")
  - Progress bar (visual, width = progress percentage)
  - Top 2 key results (sorted by priority or quarter)
  - Summary stats (calculated from KR data)
  - Action buttons (Tasks, Update)
- [ ] For at-risk objectives, "AI Help" button appears
- [ ] Hover effect: card lifts slightly
- [ ] All data from API, zero hardcoded values
- [ ] Empty state when no objectives

**Key Result Display**:
- Show current value → target value with unit
- Progress percentage calculated: `(current / target) * 100`
- Color based on progress: Green (>80%), Blue (60-80%), Red (<60%)

---

#### **US-4.8: User Views AI Insights**
**As a** Manager
**I want to** see AI-generated insights about my objectives
**So that** I can make informed decisions

**Acceptance Criteria**:
- [ ] AI Insights section at bottom of page
- [ ] Three insight cards:
  1. **Focus Area**: Identifies lowest-progress objective
  2. **Quick Win**: Suggests resource reallocation from ahead objectives
  3. **Forecast**: Predicts completion timeline
- [ ] Insights generated server-side (not hardcoded)
- [ ] Insights refresh when objectives update
- [ ] If no objectives, show empty state with encouragement

**API Endpoint**: `GET /api/objectives/ai-insights/:userId`

**Response**:
```json
{
  "focusArea": {
    "objectiveId": "...",
    "title": "Customer Satisfaction",
    "message": "Customer Satisfaction needs attention. Prioritize response time for maximum impact."
  },
  "quickWin": {
    "objectiveId": "...",
    "title": "Team Productivity",
    "message": "Team Productivity is ahead. Consider reallocating resources to other objectives."
  },
  "forecast": {
    "objectiveId": "...",
    "title": "Revenue Growth",
    "message": "Revenue Growth will complete 2 weeks ahead of current schedule."
  }
}
```

---

### **Epic 3: Progress Updates & Actions**

#### **US-4.9: User Updates Objective Progress**
**As a** Employee/Manager
**I want to** update progress on key results
**So that** my objective completion is accurately tracked

**Acceptance Criteria**:
- [ ] Clicking "Update" button opens modal
- [ ] Modal shows all key results for objective
- [ ] Each KR has input for current value
- [ ] Validation: current_value <= target_value (warning if over)
- [ ] On save, API updates `key_result.current_value`
- [ ] Objective `progress_percentage` recalculated automatically
- [ ] KR status updated (in_progress, at_risk, completed)
- [ ] Modal closes, card updates with new values
- [ ] Toast: "Progress updated successfully"
- [ ] Optimistic UI update (instant feedback)

**API Endpoint**: `PUT /api/objectives/:objectiveId/progress`

**Request Body**:
```json
{
  "keyResultUpdates": [
    { "keyResultId": "...", "currentValue": 150 },
    { "keyResultId": "...", "currentValue": 2.8 }
  ],
  "comment": "Monthly update: Made good progress on MRR"
}
```

---

#### **US-4.10: User Requests AI Help for At-Risk Objectives**
**As a** Manager
**I want to** get AI recommendations for struggling objectives
**So that** I can improve execution

**Acceptance Criteria**:
- [ ] "AI Help" button visible only for at-risk objectives (progress < expected)
- [ ] Clicking opens AI recommendation modal
- [ ] AI analyzes:
  - Current progress vs expected
  - Key results status
  - Historical velocity
  - Similar objectives in organization
- [ ] AI generates 3-5 recommendations:
  - Specific actions to improve
  - Resource reallocation suggestions
  - Timeline adjustments
  - Task breakdown suggestions
- [ ] User can apply recommendations (future: auto-create tasks)
- [ ] Recommendations saved to `objective.ai_insights[]`

**API Endpoint**: `POST /api/objectives/:objectiveId/ai-help`

---

### **Epic 4: Role-Based Access Control**

#### **US-4.11: System Enforces Role-Based Visibility**
**As a** System Administrator
**I want** objectives to respect role-based permissions
**So that** users only see what they should

**Permission Matrix**:

| Action | Employee | Manager | Executive | Business Owner |
|--------|----------|---------|-----------|----------------|
| View own objectives | ✅ | ✅ | ✅ | ✅ |
| View team objectives | ❌ | ✅ | ✅ | ✅ |
| View all objectives | ❌ | ❌ | ✅ | ✅ |
| Create objectives | ❌ | ✅ | ✅ | ✅ |
| Edit own objectives | ✅ | ✅ | ✅ | ✅ |
| Edit team objectives | ❌ | ✅ | ✅ | ✅ |
| Delete objectives | ❌ | ✅ | ✅ | ✅ |
| Generate AI OKRs | ❌ | ✅ | ✅ | ✅ |
| View AI insights | ❌ | ✅ | ✅ | ✅ |
| Update progress | ✅ | ✅ | ✅ | ✅ |
| Request AI help | ❌ | ✅ | ✅ | ✅ |

**Acceptance Criteria**:
- [ ] All API endpoints check user role via `req.user.role`
- [ ] Unauthorized access returns 403 Forbidden
- [ ] Frontend buttons hidden based on role
- [ ] Navigation items shown/hidden per role
- [ ] Objective visibility filtered by ownership:
  - Employee: only assigned to them
  - Manager: team members + own
  - Executive: department + own
  - Business Owner: all in business

---

## 🗄️ **Database Requirements**

### **Collections Needed**

1. **Objective** (already exists) ✅
   - Add fields: `assessment_id`, `ai_generated`, `weak_area_reference`

2. **AIOKRSuggestion** (already created) ✅
   - Links assessment → generated objectives → approved objectives

3. **User** (already exists) ✅
   - Has: `role`, `business_id`, `avatar_url`, `first_name`, `last_name`

4. **Business** (already exists) ✅
   - Has: `fiscal_year_start` (for quarter calculation)

5. **Assessment** (already exists) ✅
   - Has: `ssi_scores`, `user_id`, `business_id`

### **Indexes Required**

```javascript
// Objective indexes (add these)
db.objectives.createIndex({ user_id: 1, status: 1 })
db.objectives.createIndex({ business_id: 1, status: 1 })
db.objectives.createIndex({ assessment_id: 1 })
db.objectives.createIndex({ ai_generated: 1 })

// AIOKRSuggestion indexes (already created) ✅
db.aio_kr_suggestions.createIndex({ assessment_id: 1 })
db.aio_kr_suggestions.createIndex({ user_id: 1, status: 1 })
db.aio_kr_suggestions.createIndex({ business_id: 1, generated_at: -1 })
```

---

## 📡 **API Endpoints Required**

### **AI OKR Generation**
1. `POST /api/ai-okr/generate/:assessmentId` → Generate OKRs from assessment
2. `GET /api/ai-okr/suggestions/:userId` → Get latest suggestions for user
3. `PUT /api/ai-okr/edit/:suggestionId/:objectiveIndex` → Edit suggestion objective
4. `POST /api/ai-okr/approve` → Approve suggestions, create objectives
5. `DELETE /api/ai-okr/dismiss/:suggestionId/:objectiveIndex` → Dismiss objective

### **Objectives Dashboard**
6. `GET /api/objectives/my-dashboard` → Get dashboard data for user
7. `GET /api/objectives/list` → List objectives (with filters)
8. `GET /api/objectives/:objectiveId` → Get single objective detail
9. `PUT /api/objectives/:objectiveId/progress` → Update key result progress
10. `POST /api/objectives/:objectiveId/ai-help` → Request AI recommendations

### **AI Insights**
11. `GET /api/objectives/ai-insights/:userId` → Get AI insights for objectives

---

## ✅ **Acceptance Testing Checklist**

### **End-to-End Flow**
- [ ] User completes assessment
- [ ] Assessment results show weak areas
- [ ] Click "Generate Objectives" button
- [ ] AI generates 3-5 objectives in < 15 seconds
- [ ] Review page shows all generated objectives
- [ ] Edit objective title and KR values
- [ ] Approve 3 out of 4 objectives
- [ ] Redirect to objectives dashboard
- [ ] See 3 new objectives in "Active" status
- [ ] All data matches what was generated/edited
- [ ] No hardcoded values visible
- [ ] Role-based permissions working
- [ ] Filter objectives by status
- [ ] Update progress on one objective
- [ ] Progress updates reflect immediately
- [ ] AI insights section shows relevant recommendations

### **Zero Hardcoding Verification**
- [ ] User name from database
- [ ] Role from database
- [ ] Quarter calculated from business settings
- [ ] All counts aggregated from database
- [ ] Progress percentages calculated
- [ ] Status labels calculated (not stored)
- [ ] Week progress calculated
- [ ] AI insights generated (not hardcoded messages)
- [ ] Filter counts updated dynamically
- [ ] No mock data in production code

---

## 🚀 **Success Metrics**

**Technical**:
- AI generation success rate: > 95%
- Page load time: < 2 seconds
- API response time: < 500ms (except AI generation)
- Zero hardcoded data elements
- 100% role-based access enforcement

**User Experience**:
- < 3 clicks from assessment to approved objectives
- < 30 seconds total time (generation + review + approval)
- Inline editing without modal for simple changes
- Real-time progress updates (optimistic UI)

**Business Value**:
- 80%+ of AI-generated objectives approved
- 50%+ reduction in time to create objectives vs manual
- Users create objectives within 24 hours of assessment completion

---

**END OF USER STORIES DOCUMENT**
