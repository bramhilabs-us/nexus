# Week 4 - Implementation Roadmap
## From Assessment to Dynamic Objectives Dashboard

**Sprint**: Week 4 (Oct 26 - Nov 1, 2025)
**Goal**: Zero-hardcoding, AI-powered OKR generation with production-ready dashboard
**Status**: Day 1 Complete, Days 2-5 Planned

---

## 📅 **Daily Breakdown with Task Dependencies**

### **✅ Day 1: AI Service Foundation** (COMPLETE)

**Completed**:
- [x] AI OKR Service (`aiOKRService.js`) - 650 lines
- [x] AIOKRSuggestion Model - 350 lines
- [x] Test script for AI generation
- [x] OpenAI integration verified
- [x] Template-based fallback implemented

**Status**: AI successfully generates 4 objectives in ~35 seconds

**Remaining Issues**:
- [ ] JSON parsing robustness (AI sometimes returns invalid JSON)
- [ ] Find test assessments with actual weak areas (current test has none)

---

### **🎯 Day 2: Services, Calculators & API Routes** (6-8 hours)

#### **Morning Session (3-4 hours)**

**Task 2.1: Create Objective Service**
- File: `server/services/objectiveService.js`
- Lines: ~800
- Dependencies: Objective model, Calculator service

**Methods to implement**:
```javascript
✓ getDashboardData(userId, userRole, businessId)
  - Query objectives for user (role-filtered)
  - Calculate quick stats
  - Get priority overview (top 4)
  - Return complete dashboard payload

✓ getObjectivesList(userId, filters)
  - Support filters: status, priority, quarter
  - Role-based visibility
  - Pagination support

✓ updateProgress(objectiveId, keyResultUpdates, userId)
  - Update KR current_value
  - Recalculate objective progress_percentage
  - Update KR status (in_progress, completed, at_risk)
  - Log progress history

✓ generateAIInsights(userId)
  - Analyze all objectives
  - Identify focus area (lowest progress)
  - Find quick wins (ahead objectives)
  - Forecast completion timelines
```

**Task 2.2: Create Calculator Service**
- File: `server/services/calculatorService.js`
- Lines: ~400
- Dependencies: None (pure calculation logic)

**Methods to implement**:
```javascript
✓ getCurrentQuarter(fiscalYearStart)
  - Calculate Q1/Q2/Q3/Q4 from fiscal year
  - Return quarter object with dates

✓ calculateWeekProgress(startDate, endDate)
  - Current week / Total weeks

✓ calculateExpectedProgress(startDate, endDate)
  - What percentage should be complete by now

✓ calculateStatus(actualProgress, expectedProgress)
  - Compare actual vs expected
  - Return: 'needs-attention', 'on-track', 'ahead'

✓ calculateKeyResultProgress(keyResult)
  - Handle different metric types
  - Return 0-100 percentage

✓ calculateObjectiveHealth(objective)
  - Return: 'excellent', 'good', 'at-risk', 'critical'
```

**Acceptance**:
- [ ] All methods tested with sample data
- [ ] Quarter calculation works for all fiscal years
- [ ] Status labels match mockup expectations
- [ ] Week progress accurate to current date

---

#### **Afternoon Session (3-4 hours)**

**Task 2.3: Create AI OKR API Routes**
- File: `server/routes/ai-okr.js` (NEW)
- Lines: ~600
- Dependencies: aiOKRService, AIOKRSuggestion model

**Endpoints**:
```javascript
POST   /api/ai-okr/generate/:assessmentId
  ✓ Input: assessmentId, options (threshold, count, focus)
  ✓ Output: { success, data: { suggestionId, objectives[] } }
  ✓ Role: MANAGER+
  ✓ Time: < 15 seconds
  ✓ Error handling: AI failures, no weak areas

GET    /api/ai-okr/suggestions/:userId
  ✓ Get latest suggestion for user
  ✓ Include: objectives, weak_areas_analysis, status
  ✓ Role-based access (own or managed users)

PUT    /api/ai-okr/edit/:suggestionId/:objectiveIndex
  ✓ Input: { title, description, key_results[], priority }
  ✓ Mark: edited = true
  ✓ Validate: required fields, value ranges

POST   /api/ai-okr/approve
  ✓ Input: { suggestionId, objectiveIndices[], overrides }
  ✓ Create Objective documents
  ✓ Link to assessment and weak areas
  ✓ Update suggestion status
  ✓ Bulk approval support

DELETE /api/ai-okr/dismiss/:suggestionId/:objectiveIndex
  ✓ Mark objective as dismissed
  ✓ Optional reason field
  ✓ Don't delete, just hide
```

**Task 2.4: Extend Objectives API Routes**
- File: `server/routes/objectives.js` (EXTEND)
- Add ~400 lines

**New Endpoints**:
```javascript
GET  /api/objectives/my-dashboard
  ✓ Complete dashboard data
  ✓ User context + business settings
  ✓ Current quarter calculation
  ✓ Quick stats aggregation
  ✓ Objectives list (role-filtered)
  ✓ Priority overview

GET  /api/objectives/list
  ✓ Query params: status, priority, quarter, limit, offset
  ✓ Role-based filtering
  ✓ Sort options

PUT  /api/objectives/:objectiveId/progress
  ✓ Update key result values
  ✓ Recalculate progress
  ✓ Return updated objective

GET  /api/objectives/ai-insights/:userId
  ✓ Generate AI insights
  ✓ Focus area, quick win, forecast
  ✓ Cache for 1 hour

POST /api/objectives/:objectiveId/ai-help
  ✓ AI recommendations for at-risk objectives
  ✓ Analyze current state
  ✓ Suggest actions
```

**Task 2.5: Register Routes in Server**
- File: `server/index.js`
- Add: `app.use('/api/ai-okr', require('./routes/ai-okr'));`

**Task 2.6: Test API Endpoints**
- File: `server/scripts/testAIOKRAPI.js`
- Test all endpoints with real data
- Verify role-based access
- Check error handling

**Acceptance**:
- [ ] All API endpoints return correct data structure
- [ ] Role-based access enforced
- [ ] Error responses have proper status codes
- [ ] Response times < 500ms (except AI generation)
- [ ] Test script passes 100%

---

### **🎨 Day 3: AI OKR Review UI** (6-7 hours)

#### **Morning Session (3-4 hours)**

**Task 3.1: Create AI OKR Review Page**
- File: `client/pages/ai-okr-review.html`
- Lines: ~500
- Style: TailwindCSS (match mockup aesthetic)

**Layout Sections**:
```html
1. Assessment Context Header
   - Show assessment scores
   - Weak areas summary
   - Generation timestamp

2. Generated Objectives Grid
   - 2-column responsive
   - Each objective in editable card:
     ✓ Inline editable title
     ✓ Expandable description textarea
     ✓ Priority dropdown
     ✓ Effort estimate dropdown
     ✓ Weak area badge (read-only)
     ✓ Key results list (editable)
     ✓ Add/remove KR buttons
     ✓ Approve/Edit/Dismiss actions

3. Key Result Editor (per KR)
   ✓ Title input
   ✓ Metric type dropdown
   ✓ Target value input
   ✓ Unit input
   ✓ Quarter selector
   ✓ Delete button

4. Bulk Actions Footer
   ✓ "Approve All (X)" button
   ✓ "Regenerate" button
   ✓ "Save as Draft" button
   ✓ Progress indicator

5. Modals
   ✓ Edit confirmation
   ✓ Approve confirmation (show will create Objectives)
   ✓ Regenerate confirmation (lose edits warning)
```

**Features**:
- [ ] Real-time validation (red borders for errors)
- [ ] Edit indicators (blue border when edited)
- [ ] Keyboard shortcuts (Ctrl+S to save, Ctrl+A to approve all)
- [ ] Drag-and-drop to reorder objectives
- [ ] Auto-save edits to localStorage (prevent loss on refresh)
- [ ] Preview mode before final approval

**Task 3.2: Create Review Page Script**
- File: `client/pages/scripts/ai-okr-review.js`
- Lines: ~700

**Key Functions**:
```javascript
✓ loadSuggestion(suggestionId)
  - Fetch from API
  - Render objectives
  - Setup event listeners

✓ renderObjectiveCard(objective, index)
  - Create editable card HTML
  - Bind edit handlers
  - Show weak area context

✓ handleObjectiveEdit(index, field, value)
  - Update local state
  - Mark as edited
  - Call API to save

✓ handleKREdit(objIndex, krIndex, field, value)
  - Update KR data
  - Validate values
  - Auto-save

✓ approveObjective(index)
  - Confirm action
  - Call API
  - Show success/error
  - Update card status

✓ approveAll()
  - Bulk approval
  - Progress indicator
  - Handle partial failures

✓ dismissObjective(index, reason)
  - Confirm with reason prompt
  - Call API
  - Remove from view

✓ regenerate()
  - Warn about losing edits
  - Call generate API again
  - Reload page with new suggestions
```

**Acceptance**:
- [ ] All fields editable inline
- [ ] Edits save immediately (optimistic UI)
- [ ] Approve creates real Objective in database
- [ ] Error handling with user-friendly messages
- [ ] Loading states for all async actions

---

#### **Afternoon Session (3-4 hours)**

**Task 3.3: Create AI OKR API Client**
- File: `client/js/ai-okr-api-client.js`
- Lines: ~350
- Pattern: Similar to analytics-api-client.js

**Methods**:
```javascript
class AIOKRAPIClient {
  async generateFromAssessment(assessmentId, options)
  async getSuggestions(userId)
  async getSuggestionById(suggestionId)
  async editObjective(suggestionId, objectiveIndex, updates)
  async approveObjectives(suggestionId, objectiveIndices, overrides)
  async dismissObjective(suggestionId, objectiveIndex, reason)
  async regenerate(assessmentId, options)

  // Helper methods
  _request(method, endpoint, data)
  _handleError(error)
}
```

**Task 3.4: Integrate with Assessment Results Page**
- File: `client/pages/assessment-results.html` (MODIFY)
- Add: "Generate Objectives" button
- Condition: Show only if weak areas exist and user is MANAGER+

```html
<!-- Add to assessment results page -->
<div class="ai-okr-section" style="display: none;" id="ai-okr-section">
  <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
    <h3 class="text-lg font-bold mb-2">AI-Powered Objective Generation</h3>
    <p class="text-gray-600 mb-4">
      Based on your weak areas, we can generate improvement objectives.
    </p>
    <button onclick="generateObjectives()" class="karvia-gradient text-white px-6 py-3 rounded-lg">
      Generate Objectives →
    </button>
  </div>
</div>

<script>
async function generateObjectives() {
  const assessmentId = getAssessmentIdFromURL();
  showLoadingModal('Generating objectives... (10-15 seconds)');

  try {
    const result = await aiOKRClient.generateFromAssessment(assessmentId);
    hideLoadingModal();

    if (result.success) {
      // Redirect to review page
      window.location.href = `/pages/ai-okr-review.html?suggestionId=${result.data.suggestionId}`;
    } else {
      showError(result.message);
    }
  } catch (error) {
    hideLoadingModal();
    showError('Failed to generate objectives. Please try again.');
  }
}
</script>
```

**Acceptance**:
- [ ] Button appears only for managers+ with weak areas
- [ ] Clicking generates and redirects
- [ ] Loading indicator shows progress
- [ ] Error handling for AI failures

---

### **🎯 Day 4: Objective Detail Dashboard** (7-8 hours)

#### **Morning Session (4 hours)**

**Task 4.1: Create Objective Detail Page**
- File: `client/pages/objective-detail.html`
- Lines: ~600
- Mockup: `/Karvia_OKR_Mockups/MVP_Nov30Rel/02_employee/objective_detail.html`

**Implementation Strategy**: Work backwards from mockup

**Section-by-Section Implementation**:

**1. Navigation Header** (30 min)
```html
✓ Karvia logo + name
✓ Navigation menu (role-based visibility)
✓ User dropdown (avatar, name, role from API)
✓ Profile dropdown menu
```

**2. Page Header** (30 min)
```html
✓ "Your Objectives" title
✓ Current quarter badge (calculated)
✓ "Add Objective" button (role-based)
```

**3. Quick Stats Section** (1 hour)
```html
✓ Card 1: Active Objectives (count from API)
✓ Card 2: Overall Progress (calculated average)
✓ Card 3: Key Results (count completed/total)
✓ Card 4: AI Accuracy (from approval stats)

✓ Icons for each card
✓ Color-coded based on status
✓ Hover effects
✓ Loading skeletons
```

**4. Priority Overview Section** (1 hour)
```html
✓ 4 priority cards (top objectives)
✓ Each shows:
  - Priority indicator dot
  - Objective title
  - Progress percentage
  - Status text (calculated)
  - "View Details" scroll button

✓ Color coding: red=high, yellow=medium, green=low
✓ Empty state if < 4 objectives
```

**5. Filter Controls** (30 min)
```html
✓ Filter buttons: All, Needs Attention, On Track, Ahead
✓ Active state styling
✓ Objective count display
✓ Client-side filtering (instant)
```

**6. Objectives Grid** (See afternoon session)

**7. AI Insights Section** (30 min)
```html
✓ 3 insight cards:
  - Focus Area (identifies problem)
  - Quick Win (suggests optimization)
  - Forecast (predicts completion)

✓ Icons for each insight
✓ Load async after main content
✓ Empty state if no insights
```

---

#### **Afternoon Session (3-4 hours)**

**Task 4.2: Implement Objective Cards**
- Most complex part of the page
- Each card needs 15+ data points

**Objective Card Structure**:
```html
<div class="objective-card priority-{priority}" data-status="{status}">
  <!-- Header -->
  <div class="header">
    <h3>{objective.title}</h3>
    <div class="meta">
      <span>{quarter}</span> • <span>{kr_count} KRs</span> • <span class="{status_class}">{status_label}</span>
    </div>
    <div class="progress-display">
      <div class="percentage">{progress}%</div>
      <div class="week-info">Week {current_week}/{total_weeks}</div>
    </div>
  </div>

  <!-- Progress Bar -->
  <div class="progress-bar-container">
    <div class="progress-bar" style="width: {progress}%; background: {status_color}"></div>
  </div>

  <!-- Top 2 Key Results -->
  <div class="key-results-preview">
    <div class="kr-item" style="background: {kr_status_color}">
      <div class="kr-title">{kr.title}</div>
      <div class="kr-display">{current} → {target} {unit}</div>
      <div class="kr-progress">{kr_progress}%</div>
    </div>
    <!-- Repeat for 2nd KR -->
  </div>

  <!-- Summary Stats -->
  <div class="summary-stats">
    <span>{on_track_count} KRs on track</span>
    <span>{at_risk_count} need attention</span>
  </div>

  <!-- Action Buttons -->
  <div class="actions">
    <button class="btn-primary" onclick="openTasksModal('{objective_id}')">Tasks</button>
    <button class="btn-secondary" onclick="openUpdateModal('{objective_id}')">Update</button>
    {if at_risk}
      <button class="btn-danger" onclick="requestAIHelp('{objective_id}')">AI Help</button>
    {/if}
  </div>
</div>
```

**Data Mapping** (NO hardcoding):
```javascript
// Every value comes from API or calculation
{
  title: objective.title,  // DB
  quarter: calculator.getQuarterLabel(objective),  // Calculated
  kr_count: objective.key_results.length,  // Calculated
  status_label: calculator.getStatusLabel(objective),  // Calculated
  status_class: calculator.getStatusClass(objective),  // Calculated
  progress: objective.progress_percentage,  // DB (calculated on save)
  current_week: calculator.getCurrentWeek(objective),  // Calculated
  total_weeks: calculator.getTotalWeeks(objective),  // Calculated
  status_color: calculator.getStatusColor(objective),  // Calculated

  // For each KR
  kr: {
    title: kr.title,  // DB
    current: kr.current_value,  // DB
    target: kr.target_value,  // DB
    unit: kr.unit,  // DB
    kr_progress: calculator.calculateKRProgress(kr),  // Calculated
    kr_status_color: calculator.getKRStatusColor(kr)  // Calculated
  },

  // Summary stats
  on_track_count: objective.key_results.filter(kr =>
    calculator.isOnTrack(kr)
  ).length,  // Calculated

  at_risk_count: objective.key_results.filter(kr =>
    calculator.isAtRisk(kr)
  ).length  // Calculated
}
```

**Task 4.3: Create Objective Detail Script**
- File: `client/pages/scripts/objective-detail.js`
- Lines: ~800

**Key Functions**:
```javascript
// Page initialization
async function initializePage()
async function loadDashboardData()
async function loadAIInsights()

// Rendering
function renderUserContext(user)
function renderQuickStats(stats)
function renderPriorityOverview(objectives)
function renderObjectives(objectives)
function renderObjectiveCard(objective)
function renderKeyResult(keyResult, objectiveId)
function renderAIInsights(insights)

// Interactions
function filterObjectives(filter)
function scrollToObjective(objectiveId)
function openUpdateModal(objectiveId)
function openTasksModal(objectiveId)
function requestAIHelp(objectiveId)

// Updates
async function updateObjectiveProgress(objectiveId, updates)
async function refreshObjective(objectiveId)
async function refreshDashboard()

// Utilities
function showLoading()
function hideLoading()
function showError(message)
function showSuccess(message)
```

**Task 4.4: Create Objective Calculator Module**
- File: `client/pages/scripts/objective-calculator.js`
- Lines: ~400
- Mirrors server-side calculator logic

**Methods** (see Technical Spec for details):
```javascript
class ObjectiveCalculator {
  getStatusLabel(objective)
  getStatusColor(status)
  getStatusClass(status)
  getQuarterLabel(objective)
  getCurrentWeek(objective)
  getTotalWeeks(objective)
  calculateExpectedProgress(objective)
  calculateKRProgress(keyResult)
  formatKRDisplay(keyResult)
  getKRStatusColor(keyResult)
  isOnTrack(keyResult)
  isAtRisk(keyResult)
  formatNumber(num)
}
```

**Acceptance**:
- [ ] Page loads with real data (no hardcoded values)
- [ ] All calculations match server-side logic
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading states for all async operations
- [ ] Error handling with user-friendly messages
- [ ] Smooth animations (progress bars, filters)
- [ ] Role-based UI (buttons, navigation)
- [ ] Empty states when no objectives

---

### **✅ Day 5: Integration, Testing & Polish** (6-7 hours)

#### **Morning Session (3-4 hours)**

**Task 5.1: Create Comprehensive Test Suite**

**File 1**: `server/scripts/testAIOKRFlow.js` (E2E test)
```javascript
// Test complete flow:
1. Create test assessment with weak areas
2. Generate OKRs from assessment
3. Edit generated objectives
4. Approve objectives
5. Verify objectives created in DB
6. Load objectives dashboard
7. Update progress
8. Verify calculations
9. Test role-based access
10. Test AI insights generation
```

**File 2**: `server/scripts/testCalculations.js` (Unit tests)
```javascript
// Test all calculation functions:
- getCurrentQuarter() for various fiscal years
- calculateWeekProgress() for different date ranges
- calculateExpectedProgress() accuracy
- calculateStatus() logic
- calculateKRProgress() for all metric types
- calculateObjectiveHealth() scoring

// Edge cases:
- Objectives in the past
- Objectives in the future
- Zero progress
- Over 100% progress
- Boolean KRs
- Currency formatting
```

**File 3**: `server/scripts/testObjectiveDashboard.js` (Integration)
```javascript
// Test dashboard API:
- Fetch dashboard data
- Verify all fields present
- Check calculations accuracy
- Test role-based filtering
- Verify priority overview
- Test quick stats aggregation
- Check AI insights
```

**Task 5.2: Seed Realistic Test Data**
- File: `server/scripts/seedObjectives.js`

```javascript
// Create complete test environment:
1. Create 5 users (different roles)
2. Create 1 business
3. Create 10 completed assessments (various scores)
4. Generate 20 objectives:
   - 5 from AI (with weak_area_reference)
   - 15 manual (various priorities, statuses)
5. Create 60 key results:
   - Different metric types
   - Varying progress (0-100%)
   - Different quarters
6. Link objectives to assessments
7. Create AI suggestions (approved, draft, dismissed)

// Ensure data diversity:
- High/Medium/Low priorities
- On track / At risk / Ahead statuses
- Different completion percentages
- Various industries
- Multiple quarters
```

**Acceptance**:
- [ ] All test scripts pass 100%
- [ ] Seed data loads successfully
- [ ] Dashboard displays seeded data correctly
- [ ] Calculations verified manually
- [ ] Role-based access tested for all roles

---

#### **Afternoon Session (3 hours)**

**Task 5.3: Polish & UX Improvements**

**Performance Optimizations**:
```javascript
// Frontend
- [ ] Lazy load AI insights (don't block page load)
- [ ] Cache dashboard data in localStorage (5 min TTL)
- [ ] Debounce filter actions
- [ ] Optimize re-renders (React-like diff)
- [ ] Compress images
- [ ] Minify JS/CSS

// Backend
- [ ] Add database indexes
- [ ] Implement Redis caching for dashboard (5 min TTL)
- [ ] Optimize aggregation queries
- [ ] Add query result caching
- [ ] Implement connection pooling
```

**UI/UX Polish**:
```javascript
- [ ] Smooth scroll animations
- [ ] Loading skeletons (not spinners)
- [ ] Optimistic UI updates
- [ ] Toast notifications (success/error)
- [ ] Keyboard shortcuts (Ctrl+R refresh, Ctrl+F filter)
- [ ] Breadcrumb navigation
- [ ] Tooltips for calculated fields
- [ ] Empty state illustrations
- [ ] Error state illustrations
- [ ] Responsive breakpoints tested
```

**Accessibility**:
```javascript
- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader friendly
- [ ] Color contrast AA compliance
- [ ] Focus indicators visible
- [ ] Alt text for all images/icons
```

**Task 5.4: Documentation**

**Create**: `WEEK_4_HANDOFF.md`
```markdown
# Week 4 Handoff Document

## What Was Delivered
- Complete list of files created/modified
- API endpoints with examples
- Database schema changes
- Configuration changes

## How to Use
- User guide for generating OKRs
- Admin guide for managing objectives
- Developer guide for extending

## Known Issues
- List any bugs or limitations
- Workarounds if applicable

## Next Steps (Week 5)
- What builds on this work
- Dependencies for next sprint
```

**Update**: `MASTER_DEV_LIST.md`
```markdown
- [x] DEV-4.1: AI OKR Service
- [x] DEV-4.2: Objective Service
- [x] DEV-4.3: Calculator Service
- [x] DEV-4.4: AI OKR API Routes
- [x] DEV-4.5: Objectives API Extensions
- [x] DEV-4.6: AI OKR Review UI
- [x] DEV-4.7: Objective Detail Page
- [x] DEV-4.8: Objective Calculator (Frontend)
- [x] DEV-4.9: Integration Tests
- [x] DEV-4.10: Seed Data & Polish
```

**Acceptance**:
- [ ] Documentation complete and reviewed
- [ ] All code commented appropriately
- [ ] API documentation generated
- [ ] Handoff doc includes demo script

---

**Task 5.5: Final Review & Demo Prep**

**Code Review Checklist**:
```
- [ ] No console.log() in production code
- [ ] All TODOs resolved or tracked
- [ ] Error handling comprehensive
- [ ] Security: No exposed secrets
- [ ] Security: SQL injection prevented (using Mongoose)
- [ ] Security: XSS prevented (using DOMPurify)
- [ ] Security: CSRF tokens where needed
- [ ] All hardcoded values removed
- [ ] All database queries optimized
- [ ] All API responses consistent format
```

**Demo Script for Nov 1**:
```
1. Show completed assessment with weak areas (Intelligence: 58)
2. Click "Generate Objectives" → Show AI working
3. Review generated objectives:
   - Edit objective title
   - Adjust KR target value
   - Change priority
4. Approve 3 out of 4 objectives
5. Navigate to Objectives Dashboard
6. Highlight:
   - All stats calculated (no hardcoding)
   - Priority overview dynamic
   - Filter by status
   - Progress bars accurate
7. Click into one objective
8. Update progress on 2 KRs
9. Show calculations update in real-time
10. Show AI insights section
11. Request "AI Help" for at-risk objective
12. Show generated recommendations

** Talking Points:
- "Every number you see is calculated or from database"
- "AI generated these in 10 seconds from assessment"
- "Role-based: Employees see different UI than Managers"
- "Ready for goal cascade and task breakdown next week"
```

---

## 🎯 **Success Criteria (Final Check)**

### **Functional Requirements**
- [x] AI generates 3-5 objectives from weak areas
- [x] Generated OKRs follow SMART criteria
- [ ] Users can review and edit before approval
- [ ] Approved OKRs save to Objective model
- [ ] Dashboard displays all objectives dynamically
- [ ] All data points calculated or from database
- [ ] Role-based access enforced
- [ ] Progress updates work end-to-end

### **Technical Requirements**
- [ ] Zero hardcoded values in UI
- [ ] All calculations server-side + client-side match
- [ ] API response time < 500ms (except AI)
- [ ] Page load time < 2 seconds
- [ ] Database queries optimized
- [ ] Error handling comprehensive
- [ ] Security: Role guards on all endpoints
- [ ] Security: Input validation on all forms

### **User Experience**
- [ ] < 30 seconds from assessment to approved objectives
- [ ] < 3 clicks for common actions
- [ ] Smooth animations, no jank
- [ ] Clear error messages
- [ ] Loading states for all async operations
- [ ] Mobile responsive
- [ ] Keyboard accessible

### **Business Value**
- [ ] 80%+ AI-generated objectives approved
- [ ] 50%+ time savings vs manual creation
- [ ] Users create objectives within 24 hours of assessment

---

## 📋 **Deliverables Checklist**

### **Code Files**
Backend:
- [x] `server/services/aiOKRService.js` (650 lines)
- [x] `server/models/AIOKRSuggestion.js` (350 lines)
- [ ] `server/services/objectiveService.js` (800 lines)
- [ ] `server/services/calculatorService.js` (400 lines)
- [ ] `server/routes/ai-okr.js` (600 lines)
- [ ] `server/routes/objectives.js` (400 lines added)
- [ ] `server/middleware/roleGuards.js` (extensions)

Frontend:
- [ ] `client/pages/ai-okr-review.html` (500 lines)
- [ ] `client/pages/scripts/ai-okr-review.js` (700 lines)
- [ ] `client/js/ai-okr-api-client.js` (350 lines)
- [ ] `client/pages/objective-detail.html` (600 lines)
- [ ] `client/pages/scripts/objective-detail.js` (800 lines)
- [ ] `client/pages/scripts/objective-calculator.js` (400 lines)
- [ ] `client/js/objective-api-client.js` (400 lines)

Tests:
- [x] `server/scripts/testAIService.js` (250 lines)
- [ ] `server/scripts/testAIOKRAPI.js` (300 lines)
- [ ] `server/scripts/testAIOKRFlow.js` (400 lines)
- [ ] `server/scripts/testCalculations.js` (350 lines)
- [ ] `server/scripts/testObjectiveDashboard.js` (300 lines)
- [ ] `server/scripts/seedObjectives.js` (500 lines)

Documentation:
- [x] `WEEK_4_PLAN.md`
- [x] `WEEK_4_USER_STORIES.md`
- [x] `WEEK_4_TECHNICAL_SPEC.md`
- [x] `WEEK_4_IMPLEMENTATION_ROADMAP.md` (this file)
- [ ] `WEEK_4_HANDOFF.md` (Day 5)
- [ ] API documentation (JSDoc comments)

---

## 🚀 **Week 4 → Week 5 Transition**

### **What Week 5 Will Build On**
- Approved objectives in database
- Working progress update system
- Calculator service (for task breakdown)
- Role-based permissions (for goal cascade)
- AI service (for task generation)

### **Handoff Items for Week 5**
1. **Goal Cascade**: Break objectives → department goals → team goals
2. **Task Breakdown**: Weekly/daily tasks from key results
3. **Timeline Visualization**: Gantt charts, milestones
4. **Progress Tracking**: Check-ins, updates, comments
5. **Team Collaboration**: Assign goals, share objectives

---

**END OF IMPLEMENTATION ROADMAP**

**Status**: Ready to proceed with Day 2
**Next Action**: Create `objectiveService.js` and `calculatorService.js`
