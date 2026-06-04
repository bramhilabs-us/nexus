# Week 4 - Technical Implementation Specification
## AI OKR Generation → Dynamic Objectives Dashboard

**Created**: October 19, 2025
**Sprint**: Week 4 (AI OKR Generation)
**Target**: Zero hardcoding, production-ready implementation

---

## 🏗️ **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ai-okr-review.html (Review & Approve)                 │  │
│  │ objective_detail.html (Dashboard & Tracking)          │  │
│  │ ai-okr-api-client.js (API communication)              │  │
│  │ objective-calculator.js (Progress calculations)       │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │ HTTPS/JSON
┌───────────────────────────────▼─────────────────────────────┐
│                    API LAYER                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ /api/ai-okr/*          (AI generation & approval)     │  │
│  │ /api/objectives/*      (CRUD & progress tracking)     │  │
│  │ /api/analytics/*       (Weak areas & insights)        │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                   SERVICE LAYER                              │
│  ┌──────────────────┐  ┌───────────────────────────────┐   │
│  │  aiOKRService    │  │  objectiveService             │   │
│  │  - generate()    │  │  - getDashboard()             │   │
│  │  - validate()    │  │  - calculateProgress()        │   │
│  │  - approve()     │  │  - getInsights()              │   │
│  └──────────────────┘  └───────────────────────────────┘   │
│  ┌──────────────────┐  ┌───────────────────────────────┐   │
│  │ analyticsService │  │  calculatorService            │   │
│  │  - getWeakAreas()│  │  - getCurrentQuarter()        │   │
│  └──────────────────┘  │  - calculateExpectedProgress()│   │
│                        │  - calculateStatus()          │   │
│                        └───────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                   DATABASE LAYER (MongoDB)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Objective          AIOKRSuggestion      Assessment   │   │
│  │ User               Business             Goal         │   │
│  │ Task                                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

                                │
                                ▼
                        ┌───────────────┐
                        │  OpenAI GPT-4 │
                        └───────────────┘
```

---

## 📁 **File Structure & Implementation Plan**

### **Backend Files** (NEW + UPDATES)

```
server/
├── services/
│   ├── aiOKRService.js              ✅ CREATED (Day 1)
│   ├── objectiveService.js          🆕 CREATE (Day 2)
│   ├── calculatorService.js         🆕 CREATE (Day 2)
│   └── analyticsService.js          ✅ EXISTS (Week 3)
│
├── models/
│   ├── Objective.js                 ✅ EXISTS (needs extension)
│   ├── AIOKRSuggestion.js          ✅ CREATED (Day 1)
│   ├── Assessment.js                ✅ EXISTS
│   └── User.js                      ✅ EXISTS
│
├── routes/
│   ├── ai-okr.js                    🆕 CREATE (Day 2)
│   ├── objectives.js                📝 EXTEND (Day 2)
│   └── analytics.js                 ✅ EXISTS (Week 3)
│
├── middleware/
│   ├── roleGuards.js                📝 EXTEND (add new permissions)
│   └── validation/
│       ├── objectiveValidation.js   🆕 CREATE
│       └── progressValidation.js    🆕 CREATE
│
└── scripts/
    ├── testAIService.js             ✅ CREATED (Day 1)
    ├── testAIOKRAPI.js              🆕 CREATE (Day 2)
    ├── testObjectiveDashboard.js    🆕 CREATE (Day 3)
    └── seedObjectives.js            🆕 CREATE (Day 3)
```

### **Frontend Files** (NEW)

```
client/
├── pages/
│   ├── ai-okr-review.html           🆕 CREATE (Day 3)
│   ├── objective-detail.html        🆕 CREATE (Day 4) [based on mockup]
│   └── scripts/
│       ├── ai-okr-review.js         🆕 CREATE (Day 3)
│       ├── objective-detail.js      🆕 CREATE (Day 4)
│       └── objective-calculator.js  🆕 CREATE (Day 4)
│
└── js/
    ├── ai-okr-api-client.js         🆕 CREATE (Day 3)
    └── objective-api-client.js      🆕 CREATE (Day 4)
```

---

## 🔧 **Detailed Implementation Tasks**

### **Day 1: AI Service Foundation** ✅ COMPLETE

#### Files Created:
- ✅ `server/services/aiOKRService.js` (650 lines)
- ✅ `server/models/AIOKRSuggestion.js` (350 lines)
- ✅ `server/scripts/testAIService.js` (250 lines)

#### Status:
- AI service working
- OpenAI integration verified
- JSON parsing needs improvement
- Template fallback implemented

---

### **Day 2: Objective Service & Calculator** 🎯 NEXT

#### Task 2.1: Create Objective Service
**File**: `server/services/objectiveService.js`

**Methods**:
```javascript
class ObjectiveService {
  // Dashboard data aggregation
  async getDashboardData(userId, userRole, businessId)
  async getObjectivesList(userId, filters = {})
  async getObjectiveDetails(objectiveId, userId)

  // Progress management
  async updateProgress(objectiveId, keyResultUpdates, userId)
  async calculateObjectiveProgress(objective)
  async recalculateAllProgress(userId)

  // AI insights
  async generateAIInsights(userId)
  async getAIRecommendations(objectiveId)

  // Statistics
  async getQuickStats(userId)
  async getPriorityOverview(userId, limit = 4)

  // CRUD operations
  async createObjective(data, userId)
  async updateObjective(objectiveId, updates, userId)
  async deleteObjective(objectiveId, userId)

  // Role-based filtering
  filterObjectivesByRole(objectives, userId, userRole, businessId)
}
```

**Key Logic**:
1. **Progress Calculation**:
```javascript
calculateObjectiveProgress(objective) {
  if (!objective.key_results || objective.key_results.length === 0) {
    return 0;
  }

  const totalProgress = objective.key_results.reduce((sum, kr) => {
    let krProgress = 0;

    if (kr.metric_type === 'boolean') {
      krProgress = kr.current_value >= kr.target_value ? 100 : 0;
    } else {
      krProgress = Math.min((kr.current_value / kr.target_value) * 100, 100);
    }

    return sum + (isNaN(krProgress) ? 0 : krProgress);
  }, 0);

  return Math.round(totalProgress / objective.key_results.length);
}
```

2. **Dashboard Data Structure**:
```javascript
// Response from getDashboardData()
{
  user: {
    id: "...",
    full_name: "Sarah Chen",
    role: "MANAGER",
    avatar_url: "..."
  },
  business: {
    id: "...",
    name: "Acme Corp",
    fiscal_year_start: 1 // January
  },
  currentQuarter: {
    year: 2024,
    quarter: 4,
    label: "Q4 2024",
    startDate: "2024-10-01",
    endDate: "2024-12-31"
  },
  stats: {
    active_objectives_count: 3,
    overall_progress: 67,
    total_key_results: 12,
    completed_key_results: 8,
    on_track_count: 2,
    at_risk_count: 1,
    ahead_count: 1,
    ai_accuracy: 94
  },
  objectives: [
    // Full objective objects with calculated fields
  ],
  priorityOverview: [
    // Top 4 objectives by priority
  ]
}
```

---

#### Task 2.2: Create Calculator Service
**File**: `server/services/calculatorService.js`

**Methods**:
```javascript
class CalculatorService {
  // Quarter calculation
  getCurrentQuarter(fiscalYearStart = 1) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12

    // Adjust for fiscal year
    let adjustedMonth = currentMonth - fiscalYearStart + 1;
    if (adjustedMonth <= 0) adjustedMonth += 12;

    const quarter = Math.ceil(adjustedMonth / 3);
    const year = currentMonth >= fiscalYearStart ? now.getFullYear() : now.getFullYear() - 1;

    return {
      year,
      quarter,
      label: `Q${quarter} ${year}`,
      startDate: this.getQuarterStartDate(year, quarter, fiscalYearStart),
      endDate: this.getQuarterEndDate(year, quarter, fiscalYearStart)
    };
  }

  // Progress calculations
  calculateWeekProgress(startDate, endDate) {
    const now = Date.now();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const totalWeeks = Math.ceil((end - start) / (7 * 24 * 60 * 60 * 1000));
    const elapsedTime = now - start;
    const currentWeek = Math.min(
      Math.max(Math.floor(elapsedTime / (7 * 24 * 60 * 60 * 1000)), 0),
      totalWeeks
    );

    return { currentWeek, totalWeeks };
  }

  calculateExpectedProgress(startDate, endDate) {
    const { currentWeek, totalWeeks } = this.calculateWeekProgress(startDate, endDate);
    return totalWeeks > 0 ? Math.round((currentWeek / totalWeeks) * 100) : 0;
  }

  // Status determination
  calculateStatus(actualProgress, expectedProgress) {
    const ratio = expectedProgress > 0 ? actualProgress / expectedProgress : 1;

    if (ratio < 0.8) return 'needs-attention';  // Behind schedule
    if (ratio > 1.2) return 'ahead';            // Ahead of schedule
    return 'on-track';                          // On schedule
  }

  // Key result progress
  calculateKeyResultProgress(keyResult) {
    if (keyResult.metric_type === 'boolean') {
      return keyResult.current_value >= keyResult.target_value ? 100 : 0;
    }

    if (keyResult.target_value === 0) return 0;

    const progress = (keyResult.current_value / keyResult.target_value) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // Health score
  calculateObjectiveHealth(objective) {
    const { currentWeek, totalWeeks } = this.calculateWeekProgress(
      objective.start_date,
      objective.end_date
    );

    const timeProgress = totalWeeks > 0 ? (currentWeek / totalWeeks) * 100 : 0;
    const actualProgress = objective.progress_percentage || 0;

    const progressRatio = timeProgress > 0 ? actualProgress / timeProgress : 1;

    if (progressRatio >= 1.2) return 'excellent';  // 20% ahead
    if (progressRatio >= 0.9) return 'good';       // On track or slightly ahead
    if (progressRatio >= 0.7) return 'at-risk';    // 30% behind
    return 'critical';                              // More than 30% behind
  }
}
```

---

#### Task 2.3: Create API Routes
**File**: `server/routes/ai-okr.js` (NEW)

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authGuards');
const { requireRole } = require('../middleware/roleGuards');
const aiOKRService = require('../services/aiOKRService');
const AIOKRSuggestion = require('../models/AIOKRSuggestion');
const Objective = require('../models/Objective');

// All routes require authentication
router.use(authenticateToken);

// POST /api/ai-okr/generate/:assessmentId
// Generate OKRs from assessment (Managers+)
router.post('/generate/:assessmentId',
  requireRole(['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER']),
  async (req, res) => {
    // Implementation
  }
);

// GET /api/ai-okr/suggestions/:userId
// Get latest suggestions (own or managed users)
router.get('/suggestions/:userId', async (req, res) => {
  // Implementation with role-based access
});

// PUT /api/ai-okr/edit/:suggestionId/:objectiveIndex
// Edit suggestion before approval
router.put('/edit/:suggestionId/:objectiveIndex', async (req, res) => {
  // Implementation
});

// POST /api/ai-okr/approve
// Approve suggestions and create objectives
router.post('/approve',
  requireRole(['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER']),
  async (req, res) => {
    // Implementation
  }
);

// DELETE /api/ai-okr/dismiss/:suggestionId/:objectiveIndex
// Dismiss objective from suggestion
router.delete('/dismiss/:suggestionId/:objectiveIndex', async (req, res) => {
  // Implementation
});

module.exports = router;
```

**File**: `server/routes/objectives.js` (EXTEND EXISTING)

```javascript
// NEW ENDPOINTS TO ADD:

// GET /api/objectives/my-dashboard
// Get complete dashboard data for current user
router.get('/my-dashboard', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const businessId = req.user.business_id;

  const dashboardData = await objectiveService.getDashboardData(
    userId,
    userRole,
    businessId
  );

  res.json({ success: true, data: dashboardData });
});

// GET /api/objectives/list
// List objectives with filters
router.get('/list', authenticateToken, async (req, res) => {
  // Implementation with query params
});

// PUT /api/objectives/:objectiveId/progress
// Update key result progress
router.put('/:objectiveId/progress', authenticateToken, async (req, res) => {
  // Implementation
});

// GET /api/objectives/ai-insights/:userId
// Get AI insights for user's objectives
router.get('/ai-insights/:userId',
  requireRole(['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER']),
  async (req, res) => {
    // Implementation
  }
);

// POST /api/objectives/:objectiveId/ai-help
// Request AI help for at-risk objective
router.post('/:objectiveId/ai-help', authenticateToken, async (req, res) => {
  // Implementation
});
```

---

### **Day 3: AI OKR Review UI** 🎨

#### Task 3.1: Create AI OKR Review Page
**File**: `client/pages/ai-okr-review.html`

**Layout**:
```html
<!-- Header with context -->
<div class="assessment-context">
  <h1>Review AI-Generated Objectives</h1>
  <div class="weak-areas-summary">
    <!-- Show weak dimensions identified -->
  </div>
</div>

<!-- Generated objectives grid -->
<div class="objectives-review-grid">
  <!-- For each objective -->
  <div class="objective-card editable">
    <div class="objective-header">
      <input type="text" class="objective-title" />
      <select class="priority-select"></select>
    </div>

    <textarea class="objective-description"></textarea>

    <div class="weak-area-badge">
      <!-- Show weak area context -->
      <span>Addresses: Intelligence (58 → 75)</span>
    </div>

    <div class="key-results-list">
      <!-- For each KR -->
      <div class="key-result-item editable">
        <input type="text" class="kr-title" />
        <input type="number" class="kr-target" />
        <select class="kr-metric-type"></select>
        <select class="kr-quarter"></select>
      </div>
    </div>

    <div class="card-actions">
      <button class="approve-btn">Approve</button>
      <button class="edit-btn">Edit</button>
      <button class="dismiss-btn">Dismiss</button>
    </div>
  </div>
</div>

<!-- Bulk actions -->
<div class="bulk-actions">
  <button class="approve-all-btn">Approve All (4)</button>
  <button class="regenerate-btn">Regenerate</button>
</div>
```

**Features**:
- Inline editing for all fields
- Real-time validation (required fields, value ranges)
- Visual indicator for edited objectives
- Drag-and-drop to reorder priorities
- Preview mode before final approval
- "Regenerate" button for new suggestions

---

#### Task 3.2: Create AI OKR API Client
**File**: `client/js/ai-okr-api-client.js`

```javascript
class AIOKRAPIClient {
  constructor() {
    this.baseURL = '/api/ai-okr';
  }

  async generateFromAssessment(assessmentId, options = {}) {
    // POST /api/ai-okr/generate/:assessmentId
  }

  async getSuggestions(userId) {
    // GET /api/ai-okr/suggestions/:userId
  }

  async editObjective(suggestionId, objectiveIndex, updates) {
    // PUT /api/ai-okr/edit/:suggestionId/:objectiveIndex
  }

  async approveObjectives(suggestionId, objectiveIndices, overrides = {}) {
    // POST /api/ai-okr/approve
  }

  async dismissObjective(suggestionId, objectiveIndex, reason = '') {
    // DELETE /api/ai-okr/dismiss/:suggestionId/:objectiveIndex
  }
}
```

---

### **Day 4: Objective Detail Page** 🎯 CRITICAL

#### Task 4.1: Create Objective Detail Page
**File**: `client/pages/objective-detail.html`

**Based on mockup, implement**:
1. Dynamic header (user, role, quarter)
2. Quick stats cards (4 cards, all calculated)
3. Priority overview (top 4 objectives)
4. Filter controls (All, Needs Attention, On Track, Ahead)
5. Objective cards grid (2-column responsive)
6. AI insights section (3 cards)

**Data Loading Flow**:
```javascript
async function loadDashboard() {
  // 1. Show loading state
  showLoading();

  // 2. Fetch dashboard data
  const response = await fetch('/api/objectives/my-dashboard');
  const { data } = await response.json();

  // 3. Update header
  updateUserContext(data.user);
  updateQuarterDisplay(data.currentQuarter);

  // 4. Update quick stats
  updateQuickStats(data.stats);

  // 5. Update priority overview
  updatePriorityOverview(data.priorityOverview);

  // 6. Render objectives
  renderObjectives(data.objectives);

  // 7. Load AI insights (async)
  loadAIInsights(data.user.id);

  // 8. Hide loading
  hideLoading();
}
```

---

#### Task 4.2: Create Objective Calculator Module
**File**: `client/pages/scripts/objective-calculator.js`

```javascript
class ObjectiveCalculator {
  // Calculate status label
  getStatusLabel(objective) {
    const expected = this.calculateExpectedProgress(
      objective.start_date,
      objective.end_date
    );
    const actual = objective.progress_percentage;

    if (actual < expected * 0.8) return 'needs-attention';
    if (actual > expected * 1.2) return 'ahead';
    return 'on-track';
  }

  // Get status color
  getStatusColor(status) {
    const colors = {
      'needs-attention': 'red',
      'on-track': 'green',
      'ahead': 'blue'
    };
    return colors[status] || 'gray';
  }

  // Calculate week progress
  getWeekProgress(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();

    const totalWeeks = Math.ceil((end - start) / (7 * 24 * 60 * 60 * 1000));
    const elapsedTime = now - start;
    const currentWeek = Math.floor(elapsedTime / (7 * 24 * 60 * 60 * 1000));

    return {
      current: Math.max(0, Math.min(currentWeek, totalWeeks)),
      total: totalWeeks
    };
  }

  // Calculate expected progress
  calculateExpectedProgress(startDate, endDate) {
    const { current, total } = this.getWeekProgress(startDate, endDate);
    return total > 0 ? Math.round((current / total) * 100) : 0;
  }

  // Calculate KR progress
  calculateKRProgress(keyResult) {
    if (keyResult.metric_type === 'boolean') {
      return keyResult.current_value >= keyResult.target_value ? 100 : 0;
    }

    if (keyResult.target_value === 0) return 0;

    const progress = (keyResult.current_value / keyResult.target_value) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // Format display value
  formatKRDisplay(keyResult) {
    const { current_value, target_value, unit, metric_type } = keyResult;

    if (metric_type === 'boolean') {
      return current_value >= target_value ? '✓ Done' : '○ Pending';
    }

    if (metric_type === 'percentage') {
      return `${current_value}% → ${target_value}%`;
    }

    if (metric_type === 'currency') {
      return `$${this.formatNumber(current_value)} → $${this.formatNumber(target_value)}`;
    }

    return `${current_value}${unit || ''} → ${target_value}${unit || ''}`;
  }

  formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }
}
```

---

### **Day 5: Testing & Integration** ✅

#### Task 5.1: Create Test Scripts
**Files**:
1. `server/scripts/testAIOKRAPI.js` - Test all API endpoints
2. `server/scripts/testObjectiveDashboard.js` - Test dashboard data
3. `server/scripts/testCalculations.js` - Test all calculation logic

#### Task 5.2: Create Seed Data
**File**: `server/scripts/seedObjectives.js`

Create realistic test data:
- 5 users (Employee, Manager, 2 Managers, Executive)
- 20 objectives across different statuses
- 60 key results with varying progress
- Link to assessments (weak area references)
- AI-generated metadata

---

## 🗄️ **Database Schema Extensions**

### **Objective Model Updates**

```javascript
// ADD THESE FIELDS to existing Objective model
const objectiveSchema = new mongoose.Schema({
  // ... existing fields ...

  // AI Generation metadata
  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    index: true
  },

  ai_okr_suggestion_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIOKRSuggestion'
  },

  weak_area_reference: {
    dimension: {
      type: String,
      enum: ['speed', 'strength', 'intelligence']
    },
    category: String,
    current_score: Number,
    target_score: Number,
    improvement_expected: Number
  },

  // Calculated fields (not stored, virtual or computed)
  // These should NOT be in schema:
  // - status_label (calculated from progress vs expected)
  // - week_progress (calculated from dates)
  // - expected_progress (calculated from dates)
  // - health_status (calculated from progress ratio)
});
```

---

## 🔐 **Security & Permissions**

### **Role Guard Enhancements**

```javascript
// ADD to server/middleware/roleGuards.js

// Check if user can generate OKRs
function canGenerateOKRs(role) {
  return ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'].includes(role);
}

// Check if user can view objective
function canViewObjective(objective, userId, userRole, businessId) {
  // Own objectives
  if (objective.owner_id.equals(userId)) return true;

  // Business owner sees all
  if (userRole === 'BUSINESS_OWNER' && objective.business_id.equals(businessId)) {
    return true;
  }

  // Manager sees team objectives (needs team membership check)
  if (userRole === 'MANAGER') {
    // TODO: Check if user is manager of objective owner
    return true;
  }

  return false;
}

// Check if user can edit objective
function canEditObjective(objective, userId, userRole) {
  // Owner can edit
  if (objective.owner_id.equals(userId)) return true;

  // Manager+ can edit team objectives
  if (['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'].includes(userRole)) {
    return true;
  }

  return false;
}
```

---

## 📊 **Performance Optimizations**

### **Database Query Optimization**

```javascript
// Efficient dashboard query with aggregation
async getDashboardData(userId, userRole, businessId) {
  // Use aggregation pipeline for stats
  const stats = await Objective.aggregate([
    { $match: { business_id: businessId, status: 'active' } },
    {
      $group: {
        _id: null,
        active_count: { $sum: 1 },
        avg_progress: { $avg: '$progress_percentage' },
        total_krs: { $sum: { $size: '$key_results' } }
      }
    }
  ]);

  // Single query for objectives with populated refs
  const objectives = await Objective.find({
    business_id: businessId,
    status: { $in: ['active', 'draft'] }
  })
    .populate('owner_id', 'first_name last_name avatar_url')
    .populate('assessment_id', 'ssi_scores')
    .lean() // Faster, returns plain JS objects
    .exec();

  return { stats: stats[0], objectives };
}
```

### **Caching Strategy**

```javascript
// Cache dashboard data for 5 minutes
const cacheKey = `dashboard:${userId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await getDashboardData(userId);
await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min TTL

return data;
```

---

## ✅ **Testing Checklist**

### **Unit Tests**
- [ ] Calculator service (all methods)
- [ ] Objective service (CRUD operations)
- [ ] AI OKR service (validation, normalization)
- [ ] Role guard functions

### **Integration Tests**
- [ ] Complete OKR generation flow
- [ ] Approval workflow
- [ ] Progress update flow
- [ ] Role-based access control

### **E2E Tests**
- [ ] Assessment → Generation → Approval → Dashboard
- [ ] Edit objectives and KRs
- [ ] Filter and sort objectives
- [ ] Update progress, verify calculations
- [ ] AI insights generation

---

## 🚀 **Deployment Checklist**

- [ ] All environment variables set
- [ ] Database indexes created
- [ ] API routes registered in `server/index.js`
- [ ] Frontend files deployed to `/client/pages/`
- [ ] Navigation updated with new links
- [ ] Role-based menu items configured
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring enabled
- [ ] Cache warming for dashboard queries
- [ ] Rate limiting for AI endpoints

---

**END OF TECHNICAL SPECIFICATION**
