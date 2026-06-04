# Sprint 5 - Epic 0: Milestone-Based Planning System
**Priority**: P0 (Critical - Foundation for Sprint 5)
**Story Points**: 29
**Estimated Duration**: 4-5 days
**Status**: Planning Phase

---

## 📋 Executive Summary

Transform the current generic "Weekly Goals" system into a structured **Milestone-Based Planning** system with explicit Key Result linkage, AI-generated milestones, and actionable daily tasks.

**Current Problem**:
- Weekly goals are disconnected from specific Key Results
- No clear visual relationship between KR → Milestones → Action Items
- Planning flow is unclear and doesn't match user mental model
- Dates aren't properly aligned with KR/Objective timeframes

**Proposed Solution**:
- Explicit KR selection with visual highlighting
- AI generates N-week milestone plans for selected KR
- Each milestone has specific action items (daily tasks)
- Clear card-based UI showing milestone → action item hierarchy
- Proper date cascade and validation

---

## 🎯 User Journey (Before vs. After)

### Current Flow (Problematic):
```
1. User creates Objective with Key Results
2. User goes to Planning page
3. User sees "Weekly Goals" section (disconnected)
4. User creates generic weekly goals (unclear relationship to KRs)
5. ❌ User confused: "Which KR is this goal for?"
6. ❌ No structure: Random weekly tasks vs. milestone-driven planning
```

### Proposed Flow (Clear & Intuitive):
```
1. User creates Objective with Key Results
2. User goes to Planning page
3. User SELECTS a specific Key Result (highlighted)
4. User clicks "Create Plan" → Modal asks "How many weeks?"
5. User selects 3 weeks
6. ✨ AI generates:
   - Week 1: Milestone 1 + 3-5 action items
   - Week 2: Milestone 2 + 3-5 action items
   - Week 3: Milestone 3 + 3-5 action items
7. User sees card-based view:
   |KR 1.1: Enroll in 1 online course by Q1|

   📍 Milestone 1 (Week 1: Jan 1-7)
      ✅ Research top 5 online platforms
      ✅ Compare courses in target skill
      ⏳ Read instructor reviews

   📍 Milestone 2 (Week 2: Jan 8-14)
      ⏳ Purchase selected course
      ⏳ Set up learning schedule
      ⏳ Complete profile setup

   📍 Milestone 3 (Week 3: Jan 15-21)
      ⏳ Complete first module
      ⏳ Join course community
      ⏳ Schedule weekly study blocks
8. User can edit/delete individual milestones or action items
9. ✅ Clear progress tracking per milestone
```

---

## 🏗️ Technical Architecture

### 1. Data Model Changes

#### Current Goal Model:
```javascript
const goalSchema = new mongoose.Schema({
  time_period: {
    type: String,
    enum: ['QUARTERLY', 'WEEKLY'],
    required: true
  },
  title: String,
  description: String,
  owner_id: ObjectId,
  status: String,
  // Generic weekly goal - no KR tie
});
```

#### Proposed Goal Model (Enhanced):
```javascript
const goalSchema = new mongoose.Schema({
  time_period: {
    type: String,
    enum: ['QUARTERLY', 'MILESTONE'], // Add MILESTONE type
    required: true
  },

  // Explicit KR linkage (REQUIRED for MILESTONE type)
  key_result_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KeyResult',
    required: function() { return this.time_period === 'MILESTONE'; }
  },

  // Milestone-specific fields
  milestone_week: {
    type: Number, // 1, 2, 3, etc.
    required: function() { return this.time_period === 'MILESTONE'; }
  },

  milestone_title: {
    type: String, // "Research and select suitable course"
    required: function() { return this.time_period === 'MILESTONE'; }
  },

  // Action items (daily tasks)
  action_items: [{
    title: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    estimated_hours: Number,
    completed_at: Date,
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Date range for this milestone week
  start_date: Date,
  end_date: Date,

  // Existing fields
  title: String, // For backward compatibility
  description: String,
  owner_id: ObjectId,
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'at_risk'],
    default: 'not_started'
  },

  company_id: ObjectId,
  created_at: Date,
  updated_at: Date
});

// Indexes
goalSchema.index({ key_result_id: 1, milestone_week: 1 });
goalSchema.index({ company_id: 1, time_period: 1 });
```

**Migration Strategy**:
1. Add new fields to Goal model
2. Existing WEEKLY goals remain unchanged (backward compatible)
3. New MILESTONE goals use enhanced structure
4. Optional: Migration script to convert WEEKLY → MILESTONE (if desired)

---

### 2. AI Generation Service

#### New Service: `MilestonePlannerService.js`

```javascript
class MilestonePlannerService {
  /**
   * Generate milestone-based plan for a Key Result
   * @param {Object} params
   * @param {string} params.key_result_id - KR to plan for
   * @param {number} params.weeks_count - Number of weeks (1-12)
   * @param {string} params.company_id - Multi-tenant isolation
   * @param {Date} params.start_date - When plan starts
   * @returns {Promise<Object>} Generated milestone plan
   */
  async generateMilestonePlan({ key_result_id, weeks_count, company_id, start_date }) {
    // 1. Fetch KR and parent Objective
    const keyResult = await KeyResult.findById(key_result_id);
    const objective = await Objective.findById(keyResult.objective_id);

    // 2. Build AI context
    const context = await this.buildContext(company_id, objective, keyResult);

    // 3. Generate with OpenAI or fallback to templates
    if (FEATURE_OPENAI_ENABLED) {
      return await this.generateWithAI(context, weeks_count, start_date);
    } else {
      return await this.generateFromTemplate(context, weeks_count, start_date);
    }
  }

  async buildContext(company_id, objective, keyResult) {
    // Similar to AIContextService
    return {
      company: await Company.findById(company_id),
      objective: {
        title: objective.title,
        category: objective.category,
        time_period: objective.time_period_type
      },
      key_result: {
        title: keyResult.title,
        target_value: keyResult.target_value,
        unit: keyResult.unit
      }
    };
  }

  async generateWithAI(context, weeks_count, start_date) {
    const prompt = `
You are a strategic planning assistant for ${context.company.name}.

OBJECTIVE: ${context.objective.title}
KEY RESULT: ${context.key_result.title} (Target: ${context.key_result.target_value} ${context.key_result.unit})

Generate a ${weeks_count}-week milestone plan to achieve this Key Result.

For each week, provide:
1. A clear, actionable milestone (what should be accomplished that week)
2. 3-5 specific action items (daily tasks) to achieve that milestone

Requirements:
- Milestones should be sequential and build on each other
- Action items should be concrete, measurable, and time-bound
- Consider the company's context and industry
- Be realistic about what can be achieved in one week

Return JSON format:
{
  "milestones": [
    {
      "week": 1,
      "milestone": "Milestone title",
      "action_items": [
        "Specific task 1",
        "Specific task 2",
        "Specific task 3"
      ]
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });

    const plan = JSON.parse(response.choices[0].message.content);

    // Add date ranges
    return this.addDateRanges(plan, start_date);
  }

  addDateRanges(plan, start_date) {
    const startDate = new Date(start_date);

    plan.milestones.forEach((milestone, index) => {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (index * 7));

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      milestone.dates = {
        start: weekStart,
        end: weekEnd
      };
    });

    return plan;
  }

  async generateFromTemplate(context, weeks_count, start_date) {
    // Template-based fallback
    const milestones = [];

    for (let week = 1; week <= weeks_count; week++) {
      milestones.push({
        week,
        milestone: `Week ${week}: Progress toward ${context.key_result.title}`,
        action_items: [
          `Review current status of ${context.key_result.title}`,
          `Identify and complete priority tasks`,
          `Track progress and adjust approach if needed`
        ]
      });
    }

    return this.addDateRanges({ milestones }, start_date);
  }
}

module.exports = new MilestonePlannerService();
```

---

### 3. API Endpoints

#### New Routes: `/server/routes/milestones.js`

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const MilestonePlannerService = require('../services/MilestonePlannerService');
const Goal = require('../models/Goal');

/**
 * POST /api/milestones/generate
 * Generate milestone plan for a Key Result
 */
router.post('/generate',
  authenticateToken,
  requireRole('MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'),
  async (req, res) => {
    try {
      const { key_result_id, weeks_count, start_date } = req.body;
      const company_id = req.user.company_id;

      // Validation
      if (!key_result_id || !weeks_count) {
        return res.status(400).json({
          success: false,
          error: 'key_result_id and weeks_count are required'
        });
      }

      if (weeks_count < 1 || weeks_count > 12) {
        return res.status(400).json({
          success: false,
          error: 'weeks_count must be between 1 and 12'
        });
      }

      // Generate plan
      const plan = await MilestonePlannerService.generateMilestonePlan({
        key_result_id,
        weeks_count,
        company_id,
        start_date: start_date || new Date()
      });

      res.json({
        success: true,
        plan,
        metadata: {
          generated_at: new Date(),
          method: plan.method || 'ai',
          weeks_count
        }
      });

    } catch (error) {
      console.error('Error generating milestone plan:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate milestone plan'
      });
    }
  }
);

/**
 * POST /api/milestones/save
 * Save generated milestone plan as Goal records
 */
router.post('/save',
  authenticateToken,
  requireRole('MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'),
  async (req, res) => {
    try {
      const { key_result_id, milestones } = req.body;
      const company_id = req.user.company_id;
      const owner_id = req.user._id;

      // Create Goal records for each milestone
      const savedMilestones = [];

      for (const milestone of milestones) {
        const goal = new Goal({
          time_period: 'MILESTONE',
          key_result_id,
          milestone_week: milestone.week,
          milestone_title: milestone.milestone,
          action_items: milestone.action_items.map(item => ({
            title: item,
            status: 'pending'
          })),
          start_date: milestone.dates.start,
          end_date: milestone.dates.end,
          owner_id,
          company_id,
          status: 'not_started'
        });

        await goal.save();
        savedMilestones.push(goal);
      }

      res.json({
        success: true,
        milestones: savedMilestones,
        message: `${savedMilestones.length} milestones saved successfully`
      });

    } catch (error) {
      console.error('Error saving milestones:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to save milestones'
      });
    }
  }
);

/**
 * GET /api/milestones/:keyResultId
 * Get all milestones for a Key Result
 */
router.get('/:keyResultId',
  authenticateToken,
  async (req, res) => {
    try {
      const { keyResultId } = req.params;
      const company_id = req.user.company_id;

      const milestones = await Goal.find({
        key_result_id: keyResultId,
        time_period: 'MILESTONE',
        company_id,
        status: { $ne: 'cancelled' }
      })
      .sort({ milestone_week: 1 })
      .populate('owner_id', 'name email')
      .lean();

      res.json({
        success: true,
        milestones
      });

    } catch (error) {
      console.error('Error fetching milestones:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch milestones'
      });
    }
  }
);

/**
 * PUT /api/milestones/:id
 * Update a milestone
 */
router.put('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const company_id = req.user.company_id;

      const milestone = await Goal.findOneAndUpdate(
        { _id: id, company_id, time_period: 'MILESTONE' },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!milestone) {
        return res.status(404).json({
          success: false,
          error: 'Milestone not found'
        });
      }

      res.json({
        success: true,
        milestone
      });

    } catch (error) {
      console.error('Error updating milestone:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update milestone'
      });
    }
  }
);

/**
 * PUT /api/milestones/:id/action-items/:itemIndex
 * Update action item status
 */
router.put('/:id/action-items/:itemIndex',
  authenticateToken,
  async (req, res) => {
    try {
      const { id, itemIndex } = req.params;
      const { status } = req.body;
      const company_id = req.user.company_id;

      const milestone = await Goal.findOne({
        _id: id,
        company_id,
        time_period: 'MILESTONE'
      });

      if (!milestone) {
        return res.status(404).json({
          success: false,
          error: 'Milestone not found'
        });
      }

      if (!milestone.action_items[itemIndex]) {
        return res.status(404).json({
          success: false,
          error: 'Action item not found'
        });
      }

      milestone.action_items[itemIndex].status = status;
      if (status === 'completed') {
        milestone.action_items[itemIndex].completed_at = new Date();
      }

      await milestone.save();

      res.json({
        success: true,
        milestone
      });

    } catch (error) {
      console.error('Error updating action item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update action item'
      });
    }
  }
);

/**
 * DELETE /api/milestones/:id
 * Soft delete a milestone
 */
router.delete('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const company_id = req.user.company_id;

      const milestone = await Goal.findOneAndUpdate(
        { _id: id, company_id, time_period: 'MILESTONE' },
        { $set: { status: 'cancelled' } },
        { new: true }
      );

      if (!milestone) {
        return res.status(404).json({
          success: false,
          error: 'Milestone not found'
        });
      }

      res.json({
        success: true,
        message: 'Milestone deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting milestone:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete milestone'
      });
    }
  }
);

module.exports = router;
```

---

### 4. Frontend UI Design

#### Planning Page Structure

```html
<!-- client/pages/planning.html -->

<div class="planning-container">
  <!-- Objective Selection -->
  <div class="objectives-tabs">
    <button class="objective-tab active">📈 Foster Culture of Learning</button>
    <button class="objective-tab">⚡ Boost Operational Speed</button>
  </div>

  <!-- Key Results Section -->
  <div class="key-results-section">
    <h3>Key Results</h3>
    <div class="kr-cards">
      <!-- KR Card - Clickable to select -->
      <div class="kr-card selectable" onclick="selectKR('kr_123')">
        <div class="kr-header">
          <span class="kr-number">1.1</span>
          <h4>Enroll in 1 online course by Q1</h4>
        </div>
        <div class="kr-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
          <span class="progress-text">0 / 1</span>
        </div>
        <div class="kr-status">
          <span class="badge badge-orange">In Progress</span>
          <span class="milestone-count">3 milestones</span>
        </div>
      </div>

      <div class="kr-card selectable">
        <div class="kr-header">
          <span class="kr-number">1.2</span>
          <h4>Share 3 key learnings by Q2</h4>
        </div>
        <div class="kr-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: 33%"></div>
          </div>
          <span class="progress-text">1 / 3</span>
        </div>
        <div class="kr-status">
          <span class="badge badge-blue">Not Planned</span>
          <span class="milestone-count">0 milestones</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Milestones Section (shows for selected KR) -->
  <div id="milestones-section" class="hidden">
    <div class="section-header">
      <div>
        <h3>📍 Milestones for: <span id="selected-kr-title"></span></h3>
        <p class="text-muted">3-week plan to achieve this Key Result</p>
      </div>
      <button class="btn-primary" onclick="openPlanningModal()">
        ✨ Create New Plan
      </button>
    </div>

    <!-- Milestone Cards -->
    <div id="milestone-cards" class="milestone-grid">
      <!-- Milestone Card 1 -->
      <div class="milestone-card">
        <div class="milestone-header">
          <div>
            <span class="week-badge">Week 1</span>
            <h4>Research and select suitable online course</h4>
            <p class="date-range">Jan 1 - Jan 7, 2025</p>
          </div>
          <div class="milestone-actions">
            <button class="btn-icon" onclick="editMilestone('m1')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon" onclick="deleteMilestone('m1')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="action-items">
          <div class="action-item completed">
            <input type="checkbox" checked onchange="toggleActionItem('m1', 0)">
            <span>Research top 5 online learning platforms</span>
            <span class="status-badge">✅</span>
          </div>
          <div class="action-item in-progress">
            <input type="checkbox" onchange="toggleActionItem('m1', 1)">
            <span>Compare course options in target skill area</span>
            <span class="status-badge">⏳</span>
          </div>
          <div class="action-item pending">
            <input type="checkbox" onchange="toggleActionItem('m1', 2)">
            <span>Read reviews and check instructor credentials</span>
          </div>
        </div>

        <div class="milestone-footer">
          <div class="progress-info">
            <div class="progress-bar-small">
              <div class="progress-fill" style="width: 33%"></div>
            </div>
            <span class="text-sm">1 of 3 completed</span>
          </div>
          <span class="badge badge-orange">In Progress</span>
        </div>
      </div>

      <!-- Milestone Card 2 -->
      <div class="milestone-card">
        <div class="milestone-header">
          <div>
            <span class="week-badge">Week 2</span>
            <h4>Complete enrollment and initial setup</h4>
            <p class="date-range">Jan 8 - Jan 14, 2025</p>
          </div>
          <div class="milestone-actions">
            <button class="btn-icon" onclick="editMilestone('m2')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon" onclick="deleteMilestone('m2')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="action-items">
          <div class="action-item pending">
            <input type="checkbox" onchange="toggleActionItem('m2', 0)">
            <span>Purchase selected course</span>
          </div>
          <div class="action-item pending">
            <input type="checkbox" onchange="toggleActionItem('m2', 1)">
            <span>Set up learning schedule</span>
          </div>
          <div class="action-item pending">
            <input type="checkbox" onchange="toggleActionItem('m2', 2)">
            <span>Complete profile and onboarding</span>
          </div>
        </div>

        <div class="milestone-footer">
          <div class="progress-info">
            <div class="progress-bar-small">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span class="text-sm">0 of 3 completed</span>
          </div>
          <span class="badge badge-blue">Not Started</span>
        </div>
      </div>

      <!-- Milestone Card 3 -->
      <div class="milestone-card">
        <div class="milestone-header">
          <div>
            <span class="week-badge">Week 3</span>
            <h4>Begin coursework and establish routine</h4>
            <p class="date-range">Jan 15 - Jan 21, 2025</p>
          </div>
          <div class="milestone-actions">
            <button class="btn-icon" onclick="editMilestone('m3')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon" onclick="deleteMilestone('m3')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="action-items">
          <div class="action-item pending">
            <input type="checkbox" onchange="toggleActionItem('m3', 0)">
            <span>Complete first module</span>
          </div>
          <div class="action-item pending">
            <input type="checkbox" onchange="toggleActionItem('m3', 1)">
            <span>Join course community/forum</span>
          </div>
          <div class="action-item pending">
            <input type="checkbox" onchange="toggleActionItem('m3', 2)">
            <span>Schedule weekly study blocks</span>
          </div>
        </div>

        <div class="milestone-footer">
          <div class="progress-info">
            <div class="progress-bar-small">
              <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span class="text-sm">0 of 3 completed</span>
          </div>
          <span class="badge badge-blue">Not Started</span>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Planning Modal -->
<div id="planning-modal" class="modal hidden">
  <div class="modal-content">
    <h3>Create Milestone Plan</h3>
    <p>Generate AI-powered weekly milestones for: <strong id="modal-kr-title"></strong></p>

    <div class="form-group">
      <label>How many weeks do you need?</label>
      <input type="number" id="weeks-input" min="1" max="12" value="3">
      <p class="help-text">Choose 1-12 weeks based on how long this Key Result will take</p>
    </div>

    <div class="form-group">
      <label>Start Date</label>
      <input type="date" id="start-date-input">
    </div>

    <div class="modal-actions">
      <button class="btn-secondary" onclick="closePlanningModal()">Cancel</button>
      <button class="btn-primary" onclick="generatePlan()">
        ✨ Generate Plan
      </button>
    </div>
  </div>
</div>
```

---

### 5. JavaScript Controller

#### `client/pages/scripts/milestone-planner.js`

```javascript
class MilestonePlanner {
  constructor() {
    this.selectedKR = null;
    this.milestones = [];
  }

  /**
   * Select a Key Result and show its milestones
   */
  async selectKR(keyResultId) {
    // Highlight selected KR
    document.querySelectorAll('.kr-card').forEach(card => {
      card.classList.remove('selected');
    });
    event.target.closest('.kr-card').classList.add('selected');

    this.selectedKR = keyResultId;

    // Load milestones for this KR
    await this.loadMilestones(keyResultId);

    // Show milestones section
    document.getElementById('milestones-section').classList.remove('hidden');
  }

  /**
   * Load milestones from backend
   */
  async loadMilestones(keyResultId) {
    try {
      const token = localStorage.getItem('karvia_token');
      const response = await fetch(`/api/milestones/${keyResultId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const { milestones } = await response.json();
      this.milestones = milestones;

      this.renderMilestones();

    } catch (error) {
      console.error('Error loading milestones:', error);
      this.showError('Failed to load milestones');
    }
  }

  /**
   * Render milestone cards
   */
  renderMilestones() {
    const container = document.getElementById('milestone-cards');

    if (this.milestones.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-plus fa-3x"></i>
          <h4>No milestones yet</h4>
          <p>Click "Create New Plan" to generate AI-powered weekly milestones</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.milestones.map(m => `
      <div class="milestone-card">
        <div class="milestone-header">
          <div>
            <span class="week-badge">Week ${m.milestone_week}</span>
            <h4>${this.escapeHtml(m.milestone_title)}</h4>
            <p class="date-range">${this.formatDateRange(m.start_date, m.end_date)}</p>
          </div>
          <div class="milestone-actions">
            <button class="btn-icon" onclick="milestonePlanner.editMilestone('${m._id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon" onclick="milestonePlanner.deleteMilestone('${m._id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="action-items">
          ${m.action_items.map((item, idx) => `
            <div class="action-item ${item.status}">
              <input type="checkbox"
                     ${item.status === 'completed' ? 'checked' : ''}
                     onchange="milestonePlanner.toggleActionItem('${m._id}', ${idx})">
              <span>${this.escapeHtml(item.title)}</span>
              ${item.status === 'completed' ? '<span class="status-badge">✅</span>' : ''}
              ${item.status === 'in_progress' ? '<span class="status-badge">⏳</span>' : ''}
            </div>
          `).join('')}
        </div>

        <div class="milestone-footer">
          <div class="progress-info">
            <div class="progress-bar-small">
              <div class="progress-fill" style="width: ${this.calculateProgress(m)}%"></div>
            </div>
            <span class="text-sm">${this.getCompletedCount(m)} of ${m.action_items.length} completed</span>
          </div>
          <span class="badge badge-${this.getStatusColor(m)}">${this.getStatusLabel(m)}</span>
        </div>
      </div>
    `).join('');
  }

  /**
   * Open planning modal
   */
  openPlanningModal() {
    if (!this.selectedKR) {
      alert('Please select a Key Result first');
      return;
    }

    document.getElementById('planning-modal').classList.remove('hidden');

    // Set default start date to today
    document.getElementById('start-date-input').valueAsDate = new Date();
  }

  closePlanningModal() {
    document.getElementById('planning-modal').classList.add('hidden');
  }

  /**
   * Generate milestone plan with AI
   */
  async generatePlan() {
    const weeksCount = parseInt(document.getElementById('weeks-input').value);
    const startDate = document.getElementById('start-date-input').value;

    if (weeksCount < 1 || weeksCount > 12) {
      alert('Please choose between 1 and 12 weeks');
      return;
    }

    try {
      // Show loading
      this.showLoading('Generating your plan with AI...');

      const token = localStorage.getItem('karvia_token');

      // Step 1: Generate plan
      const generateResponse = await fetch('/api/milestones/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key_result_id: this.selectedKR,
          weeks_count: weeksCount,
          start_date: startDate
        })
      });

      const { plan } = await generateResponse.json();

      // Step 2: Save plan to database
      const saveResponse = await fetch('/api/milestones/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key_result_id: this.selectedKR,
          milestones: plan.milestones
        })
      });

      const { milestones } = await saveResponse.json();

      this.hideLoading();
      this.closePlanningModal();

      // Reload milestones
      await this.loadMilestones(this.selectedKR);

      this.showSuccess(`${milestones.length} milestones created successfully!`);

    } catch (error) {
      console.error('Error generating plan:', error);
      this.hideLoading();
      this.showError('Failed to generate plan. Please try again.');
    }
  }

  /**
   * Toggle action item status
   */
  async toggleActionItem(milestoneId, itemIndex) {
    try {
      const milestone = this.milestones.find(m => m._id === milestoneId);
      const item = milestone.action_items[itemIndex];

      // Toggle status
      const newStatus = item.status === 'completed' ? 'pending' : 'completed';

      const token = localStorage.getItem('karvia_token');
      await fetch(`/api/milestones/${milestoneId}/action-items/${itemIndex}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      // Reload milestones
      await this.loadMilestones(this.selectedKR);

    } catch (error) {
      console.error('Error updating action item:', error);
      this.showError('Failed to update action item');
    }
  }

  /**
   * Delete milestone
   */
  async deleteMilestone(milestoneId) {
    if (!confirm('Are you sure you want to delete this milestone? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('karvia_token');
      await fetch(`/api/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Reload milestones
      await this.loadMilestones(this.selectedKR);

      this.showSuccess('Milestone deleted successfully');

    } catch (error) {
      console.error('Error deleting milestone:', error);
      this.showError('Failed to delete milestone');
    }
  }

  // Helper methods
  calculateProgress(milestone) {
    const completed = milestone.action_items.filter(i => i.status === 'completed').length;
    return Math.round((completed / milestone.action_items.length) * 100);
  }

  getCompletedCount(milestone) {
    return milestone.action_items.filter(i => i.status === 'completed').length;
  }

  getStatusColor(milestone) {
    const progress = this.calculateProgress(milestone);
    if (progress === 0) return 'blue'; // Not started
    if (progress === 100) return 'green'; // Completed
    return 'orange'; // In progress
  }

  getStatusLabel(milestone) {
    const progress = this.calculateProgress(milestone);
    if (progress === 0) return 'Not Started';
    if (progress === 100) return 'Completed';
    return 'In Progress';
  }

  formatDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  showLoading(message) {
    // Implementation for loading indicator
  }

  hideLoading() {
    // Implementation to hide loading
  }

  showSuccess(message) {
    // Implementation for success toast
  }

  showError(message) {
    // Implementation for error toast
  }
}

// Initialize
const milestonePlanner = new MilestonePlanner();
```

---

### 6. CSS Styling

```css
/* Milestone-specific styles */
.kr-card.selectable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.kr-card.selectable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kr-card.selected {
  border: 2px solid #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.milestone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.milestone-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.milestone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 16px;
}

.week-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.milestone-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 8px 0 4px 0;
}

.date-range {
  font-size: 13px;
  color: #6b7280;
}

.milestone-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: #f3f4f6;
  color: #374151;
}

.action-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-item:hover {
  background: #f3f4f6;
}

.action-item.completed {
  background: #ecfdf5;
  border-left: 3px solid #10b981;
}

.action-item.in-progress {
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
}

.action-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.action-item span {
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.action-item.completed span {
  text-decoration: line-through;
  color: #6b7280;
}

.status-badge {
  font-size: 18px;
}

.milestone-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.progress-bar-small {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.text-sm {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.badge-blue {
  background: #dbeafe;
  color: #1e40af;
}

.badge-orange {
  background: #fed7aa;
  color: #c2410c;
}

.badge-green {
  background: #d1fae5;
  color: #065f46;
}
```

---

## 📅 Implementation Plan

### Phase 1: Backend Foundation (Day 1-2, 13 points)
1. **Data Model Updates** (3 hours)
   - Add MILESTONE type to Goal enum
   - Add milestone-specific fields
   - Create indexes
   - Test schema changes

2. **MilestonePlannerService** (4 hours)
   - Implement AI generation
   - Template-based fallback
   - Date range calculation
   - Context building

3. **API Endpoints** (3 hours)
   - POST /api/milestones/generate
   - POST /api/milestones/save
   - GET /api/milestones/:keyResultId
   - PUT /api/milestones/:id
   - PUT /api/milestones/:id/action-items/:itemIndex
   - DELETE /api/milestones/:id

4. **Testing** (2 hours)
   - Unit tests for MilestonePlannerService
   - Integration tests for API endpoints
   - Test AI generation and fallback

---

### Phase 2: Frontend UI (Day 3-4, 11 points)
1. **Planning Page Redesign** (5 hours)
   - KR selection with highlighting
   - Milestone cards grid layout
   - Action items display
   - Empty states
   - Loading states

2. **Planning Modal** (2 hours)
   - Week count selector
   - Start date picker
   - Generate plan flow
   - Error handling

3. **JavaScript Controller** (3 hours)
   - MilestonePlanner class
   - API integration
   - State management
   - Event handlers

4. **CSS Styling** (1 hour)
   - Responsive design
   - Card styling
   - Progress bars
   - Status badges

---

### Phase 3: Date Validation & Testing (Day 4-5, 5 points)
1. **Date Cascade Logic** (2 hours)
   - Validate milestone dates against KR/Objective
   - Ensure weeks fall within quarter boundaries
   - Handle fiscal year edge cases

2. **End-to-End Testing** (2 hours)
   - Test complete user journey
   - Test AI generation
   - Test CRUD operations
   - Test date validations

3. **Bug Fixes & Polish** (1 hour)
   - Fix discovered issues
   - UI polish
   - Performance optimization

---

## 🎯 Success Criteria

### Functional Requirements
- ✅ User can select a Key Result and see it highlighted
- ✅ User can generate N-week milestone plan (1-12 weeks)
- ✅ AI generates contextual milestones and action items
- ✅ Template fallback works when OpenAI disabled
- ✅ Each milestone displays as individual card
- ✅ Action items can be checked off individually
- ✅ Milestones can be edited and deleted
- ✅ Progress tracking per milestone and overall
- ✅ Dates align with KR/Objective timeframes
- ✅ Multi-tenant data isolation maintained

### Non-Functional Requirements
- ✅ Response time < 3s for AI generation
- ✅ UI responsive on mobile/tablet/desktop
- ✅ Graceful error handling
- ✅ XSS protection on all inputs
- ✅ RBAC enforced (MANAGER+ roles)

---

## 🔄 Migration Strategy

### For Existing Data
```javascript
// Optional migration script: scripts/migrate-weekly-to-milestones.js
// Convert existing WEEKLY goals to MILESTONE format

const Goal = require('../server/models/Goal');

async function migrateWeeklyGoals() {
  const weeklyGoals = await Goal.find({ time_period: 'WEEKLY' });

  console.log(`Found ${weeklyGoals.length} weekly goals to migrate`);

  // Group by KR if possible, or leave as WEEKLY
  // This is optional - can keep both types coexisting

  for (const goal of weeklyGoals) {
    // If goal has parent quarterly goal, link to its KR
    if (goal.parent_goal_id) {
      const parentGoal = await Goal.findById(goal.parent_goal_id);
      if (parentGoal && parentGoal.key_result_id) {
        goal.time_period = 'MILESTONE';
        goal.key_result_id = parentGoal.key_result_id;
        goal.milestone_week = calculateWeekNumber(goal);
        goal.milestone_title = goal.title;
        goal.action_items = [{
          title: goal.description || goal.title,
          status: goal.status === 'COMPLETED' ? 'completed' : 'pending'
        }];
        await goal.save();
        console.log(`Migrated goal: ${goal.title}`);
      }
    }
  }

  console.log('Migration complete');
}
```

**Note**: Migration is optional. Both WEEKLY and MILESTONE types can coexist.

---

## 📊 Acceptance Testing

### Test Scenarios

#### Scenario 1: Generate Milestone Plan (Happy Path)
```
GIVEN user is on planning page
AND has selected KR "Enroll in 1 online course by Q1"
WHEN user clicks "Create New Plan"
AND selects 3 weeks
AND clicks "Generate Plan"
THEN AI generates 3 milestones
AND each milestone has 3-5 action items
AND milestones display as cards
AND dates align with current quarter
```

#### Scenario 2: Complete Action Items
```
GIVEN user has milestone plan displayed
WHEN user checks off action item
THEN action item status changes to "completed"
AND milestone progress updates
AND UI reflects new status with checkmark
```

#### Scenario 3: Edit Milestone
```
GIVEN user has milestone plan displayed
WHEN user clicks edit icon on milestone
THEN modal opens with current values
WHEN user updates milestone title
AND clicks save
THEN milestone updates in database
AND card refreshes with new title
```

#### Scenario 4: Delete Milestone
```
GIVEN user has milestone plan displayed
WHEN user clicks delete icon
THEN confirmation modal appears
WHEN user confirms deletion
THEN milestone is soft-deleted (status=cancelled)
AND card disappears from view
```

#### Scenario 5: Date Validation
```
GIVEN user wants to create 4-week plan
AND current quarter only has 3 weeks remaining
WHEN user tries to generate plan
THEN system shows error
AND suggests reducing weeks or waiting for next quarter
```

---

## 🚀 Future Enhancements (Post-Sprint 5)

1. **Drag-and-Drop Reordering**
   - Reorder milestones
   - Reorder action items
   - Visual feedback

2. **Milestone Templates**
   - Save common milestone patterns
   - Reuse across KRs
   - Share with team

3. **Dependency Tracking**
   - Mark milestone dependencies
   - Show critical path
   - Alert on blocking issues

4. **Time Tracking**
   - Estimate hours per action item
   - Track actual hours spent
   - Show burndown chart

5. **Collaboration Features**
   - Assign action items to different team members
   - Comments on milestones
   - @mentions and notifications

6. **Reporting**
   - Milestone completion rate
   - Average time to complete
   - Forecasting based on historical data

---

## 📝 Documentation Requirements

1. **API Documentation**
   - Document all new endpoints
   - Include request/response examples
   - Add to Postman collection

2. **User Guide**
   - How to create milestone plans
   - How to track progress
   - Best practices

3. **Technical Documentation**
   - Data model diagram
   - Architecture overview
   - Integration points

---

## ✅ Definition of Done

This epic is complete when:
- ✅ All backend endpoints implemented and tested
- ✅ All frontend UI components working
- ✅ AI generation functional with fallback
- ✅ Date validation logic complete
- ✅ Multi-tenant isolation verified
- ✅ RBAC enforcement tested
- ✅ XSS protection implemented
- ✅ Responsive design validated
- ✅ Code reviewed and merged
- ✅ Documentation updated
- ✅ Acceptance tests passing
- ✅ No critical bugs

---

**Epic Owner**: TBD
**Technical Lead**: TBD
**Start Date**: After Sprint 4 completion
**Target Completion**: Sprint 5 (Week 1-2)
**Risk Level**: Medium (AI dependency, UI complexity)

---

**Status**: 📋 Ready for Sprint 5 Planning
