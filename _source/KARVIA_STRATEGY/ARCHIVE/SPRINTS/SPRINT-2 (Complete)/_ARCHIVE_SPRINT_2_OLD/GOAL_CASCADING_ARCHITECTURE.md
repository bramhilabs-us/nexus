# 🎯 Goal Cascading Architecture - Hybrid Approach

**Version**: 1.0.0
**Date**: November 12, 2025
**Status**: Sprint 2 Implementation
**Approach**: Hybrid (Strict + Flexible)

---

## 📋 Executive Summary

Sprint 2 implements a **Hybrid Goal Cascading** approach that supports both:
1. **Strict OKR Cascade** (Recommended): Objective → Key Result → Quarterly Goal → Weekly Goal → Tasks
2. **Flexible Goal Creation**: Objective → Quarterly Goal (no KR link) → Weekly Goal → Tasks

This approach provides OKR best practices while maintaining flexibility for non-OKR use cases.

---

## 🏗️ Hierarchy Structure

### **Complete OKR Cascade (Recommended Path)**

```
📅 Yearly Objective: "Improve Financial Strength"
  │
  ├── 📊 Key Result 1.1: "Increase Revenue by 25% ($1.3M total)"
  │     │
  │     ├── 📈 Quarterly Goal Q1: "Achieve $250K revenue in Q1"
  │     │     ├── 📋 Weekly Goal W1: "Close 3 deals (est. $60K)"
  │     │     │     ├── ✅ Task: "Contact 50 leads"
  │     │     │     ├── ✅ Task: "Schedule 10 demos"
  │     │     │     └── ✅ Task: "Follow up with 5 hot prospects"
  │     │     ├── 📋 Weekly Goal W2: "Close 2 deals (est. $40K)"
  │     │     └── ... (W3-W13)
  │     │
  │     ├── 📈 Quarterly Goal Q2: "Achieve $300K revenue in Q2"
  │     ├── 📈 Quarterly Goal Q3: "Achieve $350K revenue in Q3"
  │     └── 📈 Quarterly Goal Q4: "Achieve $400K revenue in Q4"
  │
  └── 📊 Key Result 1.2: "Launch 3 New Products"
        │
        └── 📈 Quarterly Goal Q2-Q3: "Launch all 3 products by Q3"
              ├── 📋 Weekly Goal Q2W1: "Complete Product A MVP"
              └── ... (more weekly goals)
```

### **Flexible Path (No KR Link)**

```
📅 Yearly Objective: "Improve Team Culture"
  │
  └── 📈 Quarterly Goal Q1: "Conduct 10 team building activities"
        └── 📋 Weekly Goal W1: "Plan Q1 activities"
              └── ✅ Task: "Survey team for preferences"
```

**Limitation**: No KR link means:
- ❌ Can't calculate KR progress from goals
- ❌ "Why Chain" shows: Task → Goal → Objective (skips KR level)
- ⚠️ User sees warning: "This goal is not linked to a Key Result"

---

## 🎯 Cascading Rules

### **Rule 1: Key Result → Quarterly Goals**

**For Continuous Metrics** (Revenue, Customers, MRR):
- **Auto-breakdown**: Create 4 quarterly goals (1 per quarter)
- **Target Division**: Divide KR target by 4
- **Example**: KR "Increase revenue $1.3M" → Q1: $250K, Q2: $300K, Q3: $350K, Q4: $400K

**For Discrete Metrics** (Launches, Hires, Features):
- **Manual breakdown**: Manager decides how many quarterly goals
- **Options**: 1 goal (entire year), 2 goals (H1/H2), or 4 goals (quarterly)
- **Example**: KR "Launch 3 products" → 1 goal spanning Q2-Q3

**For Boolean Metrics** (Yes/No, Pass/Fail):
- **Single goal**: Usually 1 quarterly goal for target quarter
- **Example**: KR "Achieve SOC2 compliance" → 1 goal in Q4

### **Rule 2: Quarterly Goals → Weekly Goals**

- Each quarterly goal can have **1-13 weekly goals**
- Weekly goals inherit `quarter` from parent
- Weekly goals use `week` field (1-13 within quarter)
- Target division: Manager decides how to split quarterly target

### **Rule 3: Weekly Goals → Tasks**

- Each weekly goal can have **unlimited tasks**
- Tasks inherit `goal_id` from parent weekly goal
- Task completion drives goal progress (auto-calculated)

---

## 💾 Database Schema

### **Objective Model** (Existing - No Changes)
```javascript
{
  _id: ObjectId,
  company_id: ObjectId,
  title: "Improve Financial Strength",
  target_year: 2025,
  key_results: [
    {
      _id: ObjectId, // Key Result ID
      title: "Increase Revenue by 25%",
      metric_type: "currency",
      target_value: 1300000,
      current_value: 0,
      unit: "$",
      quarter: null, // null = spans full year, or 1-4 for specific quarter
      status: "not_started",
      owner_id: ObjectId
    }
  ]
}
```

### **Goal Model** (Enhanced for Hybrid)
```javascript
{
  _id: ObjectId,
  company_id: ObjectId,
  objective_id: ObjectId, // REQUIRED - Parent objective
  key_result_id: ObjectId, // OPTIONAL - Parent KR (recommended but not required)

  name: "Achieve $250K revenue in Q1",
  description: "Focus on existing accounts + 5 new enterprise deals",

  // Hierarchy
  parent_goal_id: ObjectId, // Optional - For weekly goals (parent = quarterly)
  goal_type: "quarterly" | "weekly", // NEW FIELD

  // Timeline
  quarter: "Q1", // Q1-Q4, REQUIRED
  week: 1, // 1-13, REQUIRED for weekly goals, default 1 for quarterly

  // Progress
  target_value: 250000,
  current_value: 0,
  progress: 0, // Auto-calculated from child goals or tasks

  // NEW: Cascade metadata
  cascade_source: "key_result" | "objective" | "manual", // Tracks creation path
  has_key_result_link: Boolean, // Quick check for warnings

  owner_id: ObjectId,
  status: "not_started"
}
```

### **Schema Migration (Backward Compatible)**
```javascript
// Migration: Add new fields with defaults
db.goals.updateMany(
  {},
  {
    $set: {
      goal_type: "quarterly", // Assume existing goals are quarterly
      cascade_source: "objective", // Assume created from objective
      has_key_result_link: { $exists: "$key_result_id" }
    }
  }
);
```

---

## 🔧 API Enhancements

### **New Endpoint 1: Auto-Breakdown from Key Result**

```javascript
POST /api/objectives/:objectiveId/key-results/:krId/breakdown
Authorization: Bearer {jwt}

Request:
{
  "breakdown_strategy": "quarterly" | "manual",
  "quarters": ["Q1", "Q2", "Q3", "Q4"], // Which quarters to create goals for
  "target_division": "equal" | "weighted" | "custom",
  "custom_targets": [250000, 300000, 350000, 400000] // If custom
}

Response:
{
  "success": true,
  "key_result": {
    "id": "kr_123",
    "title": "Increase Revenue by 25%",
    "target_value": 1300000
  },
  "quarterly_goals": [
    {
      "id": "goal_456",
      "name": "Achieve $250K revenue in Q1",
      "quarter": "Q1",
      "target_value": 250000,
      "key_result_id": "kr_123",
      "cascade_source": "key_result"
    },
    // ... Q2, Q3, Q4
  ],
  "redirect_url": "/pages/quarterly-goals.html?highlight=goal_456"
}
```

**Implementation** (Sprint 2 Day 2):
```javascript
// server/routes/objectives.js
router.post('/:objectiveId/key-results/:krId/breakdown',
  authMiddleware,
  async (req, res) => {
    const { objectiveId, krId } = req.params;
    const { breakdown_strategy, quarters, target_division, custom_targets } = req.body;

    // Validate objective and KR exist
    const objective = await Objective.findById(objectiveId);
    const kr = objective.key_results.id(krId);

    if (!kr) {
      return res.status(404).json({ error: 'Key result not found' });
    }

    let quarterlyGoals = [];

    if (breakdown_strategy === 'quarterly') {
      // Auto-create goals for selected quarters
      const quartersToCreate = quarters || ['Q1', 'Q2', 'Q3', 'Q4'];
      const targetPerQuarter = kr.target_value / quartersToCreate.length;

      for (const quarter of quartersToCreate) {
        const goal = await Goal.create({
          company_id: objective.company_id,
          objective_id: objectiveId,
          key_result_id: krId,
          name: `${kr.title} - ${quarter}`,
          quarter: quarter,
          week: 1,
          goal_type: 'quarterly',
          target_value: target_division === 'equal' ? targetPerQuarter : custom_targets[parseInt(quarter[1]) - 1],
          owner_id: kr.owner_id || req.user._id,
          cascade_source: 'key_result',
          has_key_result_link: true
        });

        quarterlyGoals.push(goal);
      }
    }

    res.json({
      success: true,
      key_result: kr,
      quarterly_goals: quarterlyGoals,
      redirect_url: `/pages/quarterly-goals.html?highlight=${quarterlyGoals[0]._id}`
    });
  }
);
```

---

### **Enhanced Endpoint 2: Create Quarterly Goal (Both Paths)**

```javascript
POST /api/goals
Authorization: Bearer {jwt}

Request (Path A: From Key Result - RECOMMENDED):
{
  "objective_id": "obj_123",
  "key_result_id": "kr_456", // REQUIRED for strict cascade
  "name": "Achieve $250K revenue in Q1",
  "quarter": "Q1",
  "target_value": 250000,
  "goal_type": "quarterly",
  "cascade_source": "key_result" // Auto-set by UI
}

Request (Path B: From Objective - FLEXIBLE):
{
  "objective_id": "obj_123",
  "key_result_id": null, // NULL = flexible path
  "name": "Conduct 10 team building activities",
  "quarter": "Q1",
  "target_value": 10,
  "goal_type": "quarterly",
  "cascade_source": "objective" // Auto-set by UI
}

Response:
{
  "success": true,
  "goal": {
    "id": "goal_789",
    "has_key_result_link": true/false,
    "warning": "⚠️ This goal is not linked to a Key Result. Progress won't contribute to KR tracking." // If no KR
  }
}
```

**Validation Enhancement**:
```javascript
// server/routes/goals.js
router.post('/', authMiddleware, async (req, res) => {
  const { objective_id, key_result_id, quarter, ...goalData } = req.body;

  // Validate objective exists
  const objective = await Objective.findById(objective_id);

  // If key_result_id provided, validate it exists in objective
  if (key_result_id) {
    const kr = objective.key_results.id(key_result_id);
    if (!kr) {
      return res.status(400).json({ error: 'Invalid key result ID' });
    }

    // Optional: Validate quarter matches KR quarter (if KR has specific quarter)
    if (kr.quarter && quarter !== `Q${kr.quarter}`) {
      return res.status(400).json({
        error: `Goal quarter (${quarter}) should match KR quarter (Q${kr.quarter})`
      });
    }
  }

  // Create goal
  const goal = await Goal.create({
    ...goalData,
    objective_id,
    key_result_id: key_result_id || null,
    quarter,
    has_key_result_link: !!key_result_id,
    cascade_source: key_result_id ? 'key_result' : 'objective'
  });

  // Return with warning if no KR link
  res.json({
    success: true,
    goal,
    warning: !key_result_id ?
      '⚠️ This goal is not linked to a Key Result. Progress won\'t contribute to KR tracking.' :
      null
  });
});
```

---

## 🎨 Frontend Implementation

### **Objectives Page Enhancement** (Sprint 2 Day 2)

#### **UI Component: Key Result Card**
```html
<!-- In objectives.html or objective-details.html -->
<div class="key-result-card" data-kr-id="kr_123">
  <div class="kr-header">
    <h4>KR 1.1: Increase Revenue by 25%</h4>
    <span class="kr-target">Target: $1.3M</span>
  </div>

  <div class="kr-progress">
    <div class="progress-bar">
      <div class="progress-fill" style="width: 0%">0%</div>
    </div>
    <span class="current-value">$0 / $1.3M</span>
  </div>

  <!-- NEW: Cascade Actions -->
  <div class="kr-actions">
    <!-- Path A: Auto-breakdown (Recommended) -->
    <button
      class="btn-primary"
      onclick="openBreakdownModal('kr_123', 'quarterly')">
      🎯 Create 4 Quarterly Goals
    </button>

    <!-- Path B: Manual single goal -->
    <button
      class="btn-secondary"
      onclick="openGoalModal('from_kr', 'kr_123')">
      ➕ Create Custom Quarterly Goal
    </button>

    <!-- View existing goals -->
    <button
      class="btn-link"
      onclick="viewKeyResultGoals('kr_123')">
      📋 View Goals (3)
    </button>
  </div>

  <!-- Linked Goals Preview (if any exist) -->
  <div class="linked-goals-preview" id="kr-goals-kr_123">
    <h5>Quarterly Goals:</h5>
    <ul>
      <li>Q1: Achieve $250K revenue (60% complete) ✅</li>
      <li>Q2: Achieve $300K revenue (0% complete) ⏳</li>
      <li>Q3: Not created yet ➕</li>
      <li>Q4: Not created yet ➕</li>
    </ul>
  </div>
</div>
```

#### **Modal 1: Auto-Breakdown**
```html
<!-- Breakdown Strategy Modal -->
<div id="breakdownModal" class="modal">
  <div class="modal-content">
    <h2>Create Quarterly Goals from Key Result</h2>

    <div class="kr-summary">
      <strong>Key Result:</strong> Increase Revenue by 25%<br>
      <strong>Target Value:</strong> $1,300,000<br>
      <strong>Type:</strong> Currency (continuous metric)
    </div>

    <div class="breakdown-options">
      <h3>Select Breakdown Strategy:</h3>

      <!-- Option 1: Equal division (default for continuous) -->
      <label class="radio-option recommended">
        <input type="radio" name="strategy" value="equal" checked>
        <div class="option-content">
          <strong>📊 Equal Division (Recommended)</strong>
          <p>Create 4 quarterly goals with equal targets</p>
          <ul>
            <li>Q1: $325,000 (25%)</li>
            <li>Q2: $325,000 (25%)</li>
            <li>Q3: $325,000 (25%)</li>
            <li>Q4: $325,000 (25%)</li>
          </ul>
        </div>
      </label>

      <!-- Option 2: Weighted (growth curve) -->
      <label class="radio-option">
        <input type="radio" name="strategy" value="weighted">
        <div class="option-content">
          <strong>📈 Weighted Growth</strong>
          <p>Start lower, ramp up (typical sales curve)</p>
          <ul>
            <li>Q1: $250,000 (19%)</li>
            <li>Q2: $300,000 (23%)</li>
            <li>Q3: $350,000 (27%)</li>
            <li>Q4: $400,000 (31%)</li>
          </ul>
        </div>
      </label>

      <!-- Option 3: Custom -->
      <label class="radio-option">
        <input type="radio" name="strategy" value="custom">
        <div class="option-content">
          <strong>✏️ Custom Targets</strong>
          <p>Enter custom values per quarter</p>
          <div class="custom-inputs" style="display: none;">
            <input type="number" placeholder="Q1 Target" id="q1-target">
            <input type="number" placeholder="Q2 Target" id="q2-target">
            <input type="number" placeholder="Q3 Target" id="q3-target">
            <input type="number" placeholder="Q4 Target" id="q4-target">
          </div>
        </div>
      </label>

      <!-- Option 4: Manual (no auto-breakdown) -->
      <label class="radio-option">
        <input type="radio" name="strategy" value="manual">
        <div class="option-content">
          <strong>➕ Manual (No Auto-Breakdown)</strong>
          <p>Create one quarterly goal manually (for discrete metrics)</p>
        </div>
      </label>
    </div>

    <div class="quarter-selection">
      <h3>Select Quarters:</h3>
      <label><input type="checkbox" value="Q1" checked> Q1 (Jan-Mar)</label>
      <label><input type="checkbox" value="Q2" checked> Q2 (Apr-Jun)</label>
      <label><input type="checkbox" value="Q3" checked> Q3 (Jul-Sep)</label>
      <label><input type="checkbox" value="Q4" checked> Q4 (Oct-Dec)</label>
    </div>

    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeBreakdownModal()">Cancel</button>
      <button class="btn-primary" onclick="createQuarterlyGoals()">
        Create Quarterly Goals
      </button>
    </div>
  </div>
</div>
```

#### **Modal 2: Manual Goal Creation (Both Paths)**
```html
<!-- Goal Creation Modal - Hybrid -->
<div id="goalCreateModal" class="modal">
  <div class="modal-content">
    <h2 id="modal-title">Create Quarterly Goal</h2>

    <!-- Path Indicator -->
    <div class="creation-path-badge" id="path-badge">
      <!-- Dynamically updated based on source -->
    </div>

    <form id="goalForm">
      <!-- Hidden fields -->
      <input type="hidden" id="cascade_source" value="">
      <input type="hidden" id="objective_id" value="">
      <input type="hidden" id="key_result_id" value="">

      <!-- Goal Name -->
      <div class="form-group">
        <label>Goal Name *</label>
        <input type="text" id="goal_name" required
               placeholder="e.g., Achieve $250K revenue in Q1">
      </div>

      <!-- Description -->
      <div class="form-group">
        <label>Description (Optional)</label>
        <textarea id="goal_description" rows="3"></textarea>
      </div>

      <!-- Parent Objective (if from_objective path) -->
      <div class="form-group" id="objective-selector" style="display: none;">
        <label>Parent Objective *</label>
        <select id="objective_dropdown" required>
          <option value="">Select Objective...</option>
          <!-- Populated dynamically -->
        </select>
      </div>

      <!-- Parent Key Result (if from_objective path, optional) -->
      <div class="form-group" id="kr-selector" style="display: none;">
        <label>Link to Key Result (Recommended)</label>
        <select id="kr_dropdown">
          <option value="">No Key Result (Not recommended)</option>
          <!-- Populated based on selected objective -->
        </select>
        <small class="help-text">
          ⚠️ Linking to a Key Result enables progress tracking and "Why Chain" lineage.
        </small>
      </div>

      <!-- Quarter -->
      <div class="form-group">
        <label>Quarter *</label>
        <select id="goal_quarter" required>
          <option value="Q1">Q1 (Jan-Mar 2025)</option>
          <option value="Q2">Q2 (Apr-Jun 2025)</option>
          <option value="Q3">Q3 (Jul-Sep 2025)</option>
          <option value="Q4">Q4 (Oct-Dec 2025)</option>
        </select>
      </div>

      <!-- Target Value -->
      <div class="form-group">
        <label>Target Value *</label>
        <input type="number" id="goal_target" required step="0.01">
      </div>

      <!-- Unit -->
      <div class="form-group">
        <label>Unit</label>
        <select id="goal_unit">
          <option value="%">Percentage (%)</option>
          <option value="$">Currency ($)</option>
          <option value="count">Count</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <!-- Owner -->
      <div class="form-group">
        <label>Owner *</label>
        <select id="goal_owner" required>
          <!-- Populated with team members -->
        </select>
      </div>

      <!-- Warning if no KR link -->
      <div class="alert alert-warning" id="no-kr-warning" style="display: none;">
        ⚠️ This goal will not link to a Key Result. Progress won't contribute to KR tracking and "Why Chain" will be incomplete.
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-secondary" onclick="closeGoalModal()">
          Cancel
        </button>
        <button type="submit" class="btn-primary">
          Create Quarterly Goal
        </button>
      </div>
    </form>
  </div>
</div>
```

---

### **JavaScript Implementation** (Sprint 2 Day 2)

```javascript
// client/pages/scripts/objectives.js

// Path A: Auto-breakdown from Key Result
async function openBreakdownModal(keyResultId, strategy) {
  const modal = document.getElementById('breakdownModal');

  // Fetch KR details
  const response = await fetch(`/api/objectives/${objectiveId}/key-results/${keyResultId}`);
  const kr = await response.json();

  // Pre-populate modal with KR data
  document.getElementById('kr-title').textContent = kr.title;
  document.getElementById('kr-target').textContent = formatCurrency(kr.target_value);

  // Calculate default breakdowns
  calculateBreakdowns(kr.target_value, kr.metric_type);

  modal.style.display = 'block';
}

async function createQuarterlyGoals() {
  const strategy = document.querySelector('input[name="strategy"]:checked').value;
  const quarters = Array.from(document.querySelectorAll('input[name="quarters"]:checked'))
    .map(cb => cb.value);

  const response = await fetch(`/api/objectives/${objectiveId}/key-results/${keyResultId}/breakdown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      breakdown_strategy: 'quarterly',
      quarters: quarters,
      target_division: strategy,
      custom_targets: strategy === 'custom' ? getCustomTargets() : null
    })
  });

  const result = await response.json();

  if (result.success) {
    showNotification(`✅ Created ${result.quarterly_goals.length} quarterly goals!`);
    closeBreakdownModal();

    // Redirect to quarterly goals page with highlight
    window.location.href = result.redirect_url;
  }
}

// Path B: Manual goal creation
function openGoalModal(source, krId = null, objId = null) {
  const modal = document.getElementById('goalCreateModal');
  const form = document.getElementById('goalForm');

  // Reset form
  form.reset();

  if (source === 'from_kr') {
    // Creating from Key Result (strict cascade)
    document.getElementById('cascade_source').value = 'key_result';
    document.getElementById('key_result_id').value = krId;
    document.getElementById('objective_id').value = objId;

    // Hide objective selector (already known)
    document.getElementById('objective-selector').style.display = 'none';
    document.getElementById('kr-selector').style.display = 'none';

    // Update badge
    document.getElementById('path-badge').innerHTML =
      '🎯 <strong>Recommended Path:</strong> Creating from Key Result';
    document.getElementById('path-badge').className = 'badge badge-success';

    // Pre-fill from KR
    fetchKeyResultAndPrefill(krId);

  } else if (source === 'from_objective') {
    // Creating from Objective (flexible)
    document.getElementById('cascade_source').value = 'objective';
    document.getElementById('key_result_id').value = '';

    // Show objective and KR selectors
    document.getElementById('objective-selector').style.display = 'block';
    document.getElementById('kr-selector').style.display = 'block';

    // Update badge
    document.getElementById('path-badge').innerHTML =
      '⚠️ <strong>Flexible Path:</strong> Link to Key Result recommended';
    document.getElementById('path-badge').className = 'badge badge-warning';

    // Populate objectives dropdown
    fetchAndPopulateObjectives();
  }

  modal.style.display = 'block';
}

// Listen for KR dropdown change to show/hide warning
document.getElementById('kr_dropdown').addEventListener('change', function() {
  const warning = document.getElementById('no-kr-warning');
  if (this.value === '') {
    warning.style.display = 'block';
  } else {
    warning.style.display = 'none';
  }
});

// Form submission
document.getElementById('goalForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = {
    objective_id: document.getElementById('objective_id').value,
    key_result_id: document.getElementById('key_result_id').value || null,
    name: document.getElementById('goal_name').value,
    description: document.getElementById('goal_description').value,
    quarter: document.getElementById('goal_quarter').value,
    target_value: parseFloat(document.getElementById('goal_target').value),
    unit: document.getElementById('goal_unit').value,
    owner_id: document.getElementById('goal_owner').value,
    goal_type: 'quarterly',
    cascade_source: document.getElementById('cascade_source').value
  };

  const response = await fetch('/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  const result = await response.json();

  if (result.success) {
    showNotification('✅ Quarterly goal created successfully!');

    // Show warning if no KR link
    if (result.warning) {
      showNotification(result.warning, 'warning');
    }

    closeGoalModal();

    // Refresh goals list or redirect
    window.location.href = `/pages/quarterly-goals.html?highlight=${result.goal.id}`;
  }
});
```

---

## 📊 Quarterly Goals Page Enhancement (Sprint 2 Day 1)

### **Grouped Display**

```html
<!-- quarterly-goals.html -->
<div class="goals-container">

  <!-- Group by Objective > Key Result > Quarter -->
  <div class="objective-group">
    <h2 class="objective-title">
      📅 Objective: Improve Financial Strength
      <span class="progress-badge">28% complete</span>
    </h2>

    <!-- Key Result 1.1 -->
    <div class="key-result-group">
      <h3 class="kr-title">
        📊 KR 1.1: Increase Revenue by 25% ($1.3M)
        <span class="kr-progress">15% complete ($195K / $1.3M)</span>
      </h3>

      <!-- Quarterly Goals for this KR -->
      <div class="quarterly-goals-list">
        <div class="goal-card has-kr-link">
          <div class="goal-header">
            <h4>Q1: Achieve $250K revenue</h4>
            <span class="status-badge status-on-track">On Track</span>
          </div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 60%">60%</div>
            </div>
            <span class="current-value">$150K / $250K</span>
          </div>
          <div class="goal-meta">
            <span class="owner">👤 John Doe</span>
            <span class="due-date">📅 Due: Mar 31, 2025</span>
            <span class="cascade-badge">🔗 Linked to KR 1.1</span>
          </div>
          <div class="goal-actions">
            <button onclick="viewGoalDetails('goal_123')">View Details</button>
            <button onclick="createWeeklyGoals('goal_123')">➕ Add Weekly Goals</button>
          </div>
        </div>

        <div class="goal-card has-kr-link">
          <div class="goal-header">
            <h4>Q2: Achieve $300K revenue</h4>
            <span class="status-badge status-not-started">Not Started</span>
          </div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 0%">0%</div>
            </div>
            <span class="current-value">$0 / $300K</span>
          </div>
          <div class="goal-meta">
            <span class="owner">👤 John Doe</span>
            <span class="due-date">📅 Due: Jun 30, 2025</span>
            <span class="cascade-badge">🔗 Linked to KR 1.1</span>
          </div>
        </div>

        <!-- Missing quarters indicator -->
        <div class="goal-card-placeholder">
          <p>⚠️ Q3 and Q4 goals not created yet for this KR</p>
          <button onclick="openBreakdownModal('kr_123', 'quarterly')">
            ➕ Create Missing Quarterly Goals
          </button>
        </div>
      </div>
    </div>

    <!-- Key Result 1.2 -->
    <div class="key-result-group">
      <h3 class="kr-title">
        📊 KR 1.2: Launch 3 New Products
        <span class="kr-progress">0% complete (0 / 3)</span>
      </h3>

      <div class="quarterly-goals-list">
        <div class="goal-card has-kr-link">
          <h4>Q2-Q3: Launch all 3 products</h4>
          <span class="multi-quarter-badge">Spans 2 quarters</span>
          <!-- ... goal details ... -->
        </div>
      </div>
    </div>
  </div>

  <!-- Objectives with no KR link (Flexible path) -->
  <div class="objective-group">
    <h2 class="objective-title">
      📅 Objective: Improve Team Culture
      <span class="progress-badge">40% complete</span>
    </h2>

    <!-- No KR grouping, direct goals -->
    <div class="quarterly-goals-list">
      <div class="goal-card no-kr-link">
        <div class="goal-header">
          <h4>Q1: Conduct 10 team building activities</h4>
          <span class="status-badge status-in-progress">In Progress</span>
          <span class="warning-badge">⚠️ No KR Link</span>
        </div>
        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 40%">40%</div>
          </div>
          <span class="current-value">4 / 10 activities</span>
        </div>
        <div class="goal-meta">
          <span class="owner">👤 Jane Smith</span>
          <span class="cascade-badge warning">⚠️ Not linked to Key Result</span>
        </div>
        <div class="goal-actions">
          <button onclick="linkToKeyResult('goal_456')">
            🔗 Link to Key Result
          </button>
        </div>
      </div>
    </div>
  </div>

</div>
```

---

## 📈 Progress Rollup Logic (Day 10 Enhancement)

### **Calculation Flow**

```javascript
// Tasks → Weekly Goal → Quarterly Goal → Key Result → Objective

// 1. Task Completion triggers Weekly Goal update
Task.post('save', async function() {
  if (this.status === 'completed' && this.goal_id) {
    const weeklyGoal = await Goal.findById(this.goal_id);

    // Calculate weekly goal progress from tasks
    const totalTasks = await Task.countDocuments({ goal_id: this.goal_id });
    const completedTasks = await Task.countDocuments({
      goal_id: this.goal_id,
      status: 'completed'
    });

    weeklyGoal.progress = Math.round((completedTasks / totalTasks) * 100);
    weeklyGoal.current_value = (weeklyGoal.target_value * weeklyGoal.progress) / 100;
    await weeklyGoal.save(); // Triggers next cascade
  }
});

// 2. Weekly Goal update triggers Quarterly Goal update
Goal.post('save', async function() {
  if (this.goal_type === 'weekly' && this.parent_goal_id) {
    const quarterlyGoal = await Goal.findById(this.parent_goal_id);

    // Calculate quarterly goal progress from weekly goals
    const weeklyGoals = await Goal.find({ parent_goal_id: this.parent_goal_id });
    const avgProgress = weeklyGoals.reduce((sum, g) => sum + g.progress, 0) / weeklyGoals.length;

    quarterlyGoal.progress = Math.round(avgProgress);
    quarterlyGoal.current_value = (quarterlyGoal.target_value * quarterlyGoal.progress) / 100;
    await quarterlyGoal.save(); // Triggers KR cascade
  }
});

// 3. Quarterly Goal update triggers Key Result update (if linked)
Goal.post('save', async function() {
  if (this.goal_type === 'quarterly' && this.key_result_id) {
    const objective = await Objective.findById(this.objective_id);
    const kr = objective.key_results.id(this.key_result_id);

    // Calculate KR progress from all quarterly goals linked to it
    const quarterlyGoals = await Goal.find({ key_result_id: this.key_result_id });
    const totalProgress = quarterlyGoals.reduce((sum, g) => sum + g.current_value, 0);

    kr.current_value = totalProgress;
    kr.status = kr.current_value >= kr.target_value ? 'completed' : 'in_progress';

    await objective.save(); // Triggers objective cascade
  }
});

// 4. Key Result update triggers Objective update
Objective.post('save', async function() {
  if (this.isModified('key_results')) {
    // Calculate objective progress from all KRs
    const totalProgress = this.key_results.reduce((sum, kr) => {
      const krProgress = (kr.current_value / kr.target_value) * 100;
      return sum + Math.min(krProgress, 100);
    }, 0);

    this.progress_percentage = Math.round(totalProgress / this.key_results.length);
  }
});
```

---

## ✅ Sprint 2 Implementation Checklist

### **Day 2: Goal Creation (Enhanced)**
- [ ] Create auto-breakdown modal UI
- [ ] Implement `POST /api/objectives/:id/key-results/:krId/breakdown` API
- [ ] Add "Create from Key Result" button on objectives page
- [ ] Enhance goal creation modal with dual paths (from KR / from Objective)
- [ ] Add KR dropdown in flexible path
- [ ] Add warning badge for goals without KR link
- [ ] Test both cascading paths

### **Day 4: Goal Details Page**
- [ ] Display parent Key Result info (if linked)
- [ ] Show warning if no KR link
- [ ] Add "Link to Key Result" button for unlinked goals

### **Day 5: API Client**
- [ ] Add `createGoalsFromKeyResult(objId, krId, strategy)` method
- [ ] Add `getKeyResultGoals(objId, krId)` method
- [ ] Add `linkGoalToKeyResult(goalId, krId)` method

### **Day 10: "Why Chain" Lineage**
- [ ] Enhance lineage API to include KR level (if exists)
- [ ] Display: Task → Weekly → Quarterly → **KR → Objective** → Assessment
- [ ] Show partial chain if no KR link (with warning)

---

## 📊 Success Metrics

### **Adoption Metrics**
- **Target**: > 70% of quarterly goals linked to Key Results
- **Measure**: `goals.filter(g => g.has_key_result_link).length / goals.length`

### **UX Metrics**
- **Time to Create Goal from KR**: < 30 seconds (auto-breakdown)
- **Time to Create Flexible Goal**: < 45 seconds (manual)
- **Warning Click-Through**: Track how many users see "No KR" warning and click "Link to KR"

### **Data Quality Metrics**
- **Complete Cascades**: % of goals with full lineage (Task → Goal → KR → Objective → Assessment)
- **Orphaned Goals**: % of goals not linked to KR (target < 30%)

---

**Version**: 1.0.0
**Status**: Sprint 2 Implementation Ready
**Approach**: Hybrid (Strict + Flexible)
**Next Review**: End of Sprint 2 (Nov 28, 2025)
