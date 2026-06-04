# 🔧 SPRINT 2 TECHNICAL SPECIFICATIONS

**Sprint**: Sprint 2 - Planning & Dashboard
**Version**: 1.0
**Last Updated**: November 12, 2025

---

## 🏗️ ARCHITECTURE OVERVIEW

### System Components
```
┌─────────────────────────────────────────────┐
│            Frontend (Client)                 │
│  ┌─────────────┐      ┌─────────────┐      │
│  │Planning Page│      │  Dashboard  │      │
│  └──────┬──────┘      └──────┬──────┘      │
│         │                     │              │
│         └──────────┬──────────┘              │
│                    ▼                         │
│           ┌─────────────────┐                │
│           │   API Gateway   │                │
│           └────────┬────────┘                │
└────────────────────┼─────────────────────────┘
                     │
┌────────────────────┼─────────────────────────┐
│            Backend│(Server)                  │
│         ┌─────────▼────────┐                │
│         │   Route Handlers  │                │
│         └─────────┬────────┘                │
│                   │                          │
│    ┌──────────────┼──────────────┐          │
│    ▼              ▼              ▼          │
│ ┌──────┐   ┌──────────┐   ┌─────────┐     │
│ │OpenAI│   │ Services │   │ Models  │     │
│ └──────┘   └──────────┘   └────┬────┘     │
│                                 │           │
│                          ┌──────▼──────┐   │
│                          │  MongoDB    │   │
│                          └─────────────┘   │
└──────────────────────────────────────────────┘
```

---

## 📊 DATABASE SCHEMA UPDATES

### Goal Model Enhancement
```javascript
// File: /server/models/Goal.js
// CRITICAL: Add these fields on Day 1

const goalSchema = new Schema({
  // Existing fields...
  title: { type: String, required: true },
  description: String,
  target_value: Number,
  current_value: Number,
  objective_id: { type: Schema.Types.ObjectId, ref: 'Objective' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },

  // NEW FIELDS - REQUIRED FOR SPRINT 2
  parent_goal_id: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
    index: true,
    default: null
  },

  child_goal_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'Goal'
  }],

  time_period: {
    type: String,
    enum: ['QUARTERLY', 'WEEKLY', 'MONTHLY'],
    required: true,
    default: 'QUARTERLY',
    index: true
  },

  key_result_id: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    validate: {
      validator: async function(value) {
        // Validate KR exists in parent objective
        const objective = await mongoose.model('Objective')
          .findById(this.objective_id);
        return objective && objective.key_results
          .some(kr => kr._id.equals(value));
      },
      message: 'Key Result must belong to the parent Objective'
    }
  }
}, {
  timestamps: true
});

// Add compound indexes for performance
goalSchema.index({ owner: 1, time_period: 1 });
goalSchema.index({ parent_goal_id: 1, time_period: 1 });
goalSchema.index({ key_result_id: 1, time_period: 1 });

// Add methods for hierarchy navigation
goalSchema.methods.getChildren = function() {
  return this.model('Goal').find({
    parent_goal_id: this._id
  });
};

goalSchema.methods.getParent = function() {
  if (!this.parent_goal_id) return null;
  return this.model('Goal').findById(this.parent_goal_id);
};

goalSchema.methods.getLineage = async function() {
  const lineage = [this];
  let current = this;

  // Traverse up to quarterly goal
  while (current.parent_goal_id) {
    current = await current.getParent();
    lineage.unshift(current);
  }

  // Add objective and KR
  const objective = await mongoose.model('Objective')
    .findById(this.objective_id);
  const kr = objective.key_results.id(this.key_result_id);

  return {
    objective,
    key_result: kr,
    goals: lineage
  };
};
```

### Migration Script
```javascript
// File: /server/migrations/add-goal-relationships.js

const mongoose = require('mongoose');
const Goal = require('../models/Goal');

async function migrate() {
  console.log('Starting Goal model migration...');

  // Set time_period for existing goals
  await Goal.updateMany(
    { time_period: { $exists: false } },
    { $set: { time_period: 'QUARTERLY' } }
  );

  // Set default key_result_id if possible
  const goals = await Goal.find({
    key_result_id: { $exists: false },
    objective_id: { $exists: true }
  }).populate('objective_id');

  for (const goal of goals) {
    if (goal.objective_id && goal.objective_id.key_results[0]) {
      goal.key_result_id = goal.objective_id.key_results[0]._id;
      await goal.save();
    }
  }

  console.log('Migration complete!');
}

migrate().catch(console.error);
```

---

## 🔌 API SPECIFICATIONS

### Planning Endpoints

#### Generate AI Plan
```javascript
// POST /api/planning/generate-plan
// File: /server/routes/planning.js

router.post('/generate-plan', authenticate, async (req, res) => {
  try {
    const { kr_id, timeline_weeks, owner_id, start_date } = req.body;

    // Validation
    if (timeline_weeks < 1 || timeline_weeks > 12) {
      return res.status(400).json({
        error: 'Timeline must be between 1-12 weeks'
      });
    }

    // Get KR details
    const objective = await Objective.findOne({
      'key_results._id': kr_id
    });
    const kr = objective.key_results.id(kr_id);

    // Generate plan using OpenAI
    const prompt = generatePlanPrompt(kr, timeline_weeks);
    const aiResponse = await openAIService.complete({
      prompt,
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000
    });

    // Parse and structure response
    const plan = parseAIPlan(aiResponse);

    // Add metadata
    plan.kr_id = kr_id;
    plan.owner_id = owner_id;
    plan.start_date = start_date;

    res.json({ success: true, plan });
  } catch (error) {
    console.error('Plan generation error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

#### Create Goals from Plan
```javascript
// POST /api/planning/create-goals
router.post('/create-goals', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { kr_id, plan_data, quarterly_goal_id } = req.body;
    const createdGoals = [];

    // Get quarterly goal as parent
    const quarterlyGoal = await Goal.findById(quarterly_goal_id);

    // Create weekly goals
    for (const week of plan_data.weeks) {
      const weeklyGoal = new Goal({
        title: `Week ${week.week_number} - ${week.title}`,
        description: week.tasks.join(', '),
        target_value: week.target_value,
        current_value: 0,
        objective_id: quarterlyGoal.objective_id,
        key_result_id: kr_id,
        parent_goal_id: quarterly_goal_id,
        time_period: 'WEEKLY',
        owner: week.owner_id || plan_data.owner_id,
        start_date: week.start_date,
        due_date: week.end_date
      });

      await weeklyGoal.save({ session });
      createdGoals.push(weeklyGoal);

      // Update parent's child array
      quarterlyGoal.child_goal_ids.push(weeklyGoal._id);
    }

    await quarterlyGoal.save({ session });
    await session.commitTransaction();

    res.json({
      success: true,
      created_goals: createdGoals
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});
```

### Dashboard Endpoints

#### Get User Dashboard Data
```javascript
// GET /api/dashboard/user/:userId
// File: /server/routes/dashboard.js

router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(today);

    // Parallel queries for performance
    const [
      objectives,
      quarterlyGoals,
      weeklyGoals,
      tasksToday,
      tasksWeek
    ] = await Promise.all([
      // User's objectives
      Objective.find({ owner: userId }),

      // User's quarterly goals
      Goal.find({
        owner: userId,
        time_period: 'QUARTERLY'
      }).populate('key_result_id'),

      // User's weekly goals
      Goal.find({
        owner: userId,
        time_period: 'WEEKLY',
        start_date: { $lte: weekEnd },
        due_date: { $gte: weekStart }
      }),

      // Today's tasks
      Task.find({
        assigned_to: userId,
        due_date: {
          $gte: startOfDay(today),
          $lte: endOfDay(today)
        }
      }).populate('goal_id'),

      // This week's tasks
      Task.find({
        assigned_to: userId,
        due_date: {
          $gte: weekStart,
          $lte: weekEnd
        }
      }).populate('goal_id')
    ]);

    // Extract KRs from objectives
    const key_results = objectives.flatMap(obj =>
      obj.key_results.map(kr => ({
        ...kr.toObject(),
        objective_title: obj.title
      }))
    );

    res.json({
      objectives,
      key_results,
      quarterly_goals: quarterlyGoals,
      weekly_goals: weeklyGoals,
      tasks_today: tasksToday,
      tasks_week: tasksWeek,
      stats: {
        tasks_completed_today: tasksToday.filter(t => t.completed).length,
        tasks_total_today: tasksToday.length,
        weekly_progress: calculateWeeklyProgress(tasksWeek)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Get Task Lineage
```javascript
// GET /api/lineage/task/:taskId
router.get('/task/:taskId', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('goal_id');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Get goal lineage
    const goal = await Goal.findById(task.goal_id)
      .populate('parent_goal_id');

    const lineage = await goal.getLineage();

    // Get assessment score
    const assessment = await Assessment.findOne({
      user_id: task.assigned_to
    }).sort({ created_at: -1 });

    res.json({
      task,
      weekly_goal: lineage.goals.find(g => g.time_period === 'WEEKLY'),
      quarterly_goal: lineage.goals.find(g => g.time_period === 'QUARTERLY'),
      key_result: lineage.key_result,
      objective: lineage.objective,
      assessment_score: assessment?.overall_score || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🤖 OPENAI INTEGRATION

### Service Configuration
```javascript
// File: /server/services/aiOKRService.js
// REUSE EXISTING SERVICE - Already has OpenAI integration!

const aiOKRService = require('../services/aiOKRService');

// Extend existing service with planning method
class PlanningService extends aiOKRService {

  // ADD THIS METHOD to existing service pattern
  async generateWeeklyPlan(kr, weeks, owner) {
    // Use same OpenAI client that's already initialized
    const prompt = this.buildPlanPrompt(kr, weeks);

    try {
      // Use existing OpenAI pattern from generateWithAI method
      const response = await this.openai.chat.completions.create({
        model: this.config.model, // Already set to 'gpt-4'
        messages: [
          { role: 'system', content: this.buildSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        temperature: this.config.temperature, // Already 0.7
        max_tokens: this.config.maxTokens // Already 2500
      });

      return this.parsePlanResponse(response);
    } catch (error) {
      // Reuse existing error handling
      logger.error('[Planning] OpenAI error:', error);
      if (error.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.generateWeeklyPlan(kr, weeks, owner);
      }
      throw error;
    }
  }

  buildPlanPrompt(kr, weeks) {
    return `You are a strategic planning assistant for an OKR system.

    Key Result: ${kr.title}
    Current Value: ${kr.current_value}
    Target Value: ${kr.target_value}
    Timeline: ${weeks} weeks

    Generate a weekly plan that:
    1. Breaks down the target into ${weeks} progressive weekly goals
    2. Starts slow (20% in first quarter of time)
    3. Accelerates (50% in middle half)
    4. Maintains (30% in final quarter)
    5. Each week should have 3-5 specific, actionable tasks
    6. Tasks should build on previous weeks

    Return as JSON:
    {
      "weeks": [
        {
          "week_number": 1,
          "title": "Foundation Week",
          "target_value": <incremental_target>,
          "tasks": [
            "Specific task 1",
            "Specific task 2",
            "Specific task 3"
          ],
          "dependencies": []
        }
      ]
    }`;
  }

  parsePlanResponse(response) {
    try {
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid response from AI');
    }
  }
}

module.exports = new OpenAIService();
```

---

## 🎨 FRONTEND COMPONENTS

### Planning Page Components
```javascript
// File: /client/js/planning.js

class PlanningPage {
  constructor() {
    this.selectedObjective = null;
    this.selectedKR = null;
    this.generatedPlan = null;
  }

  async init() {
    await this.loadObjectives();
    this.attachEventListeners();
  }

  async loadObjectives() {
    const response = await fetch('/api/objectives');
    const objectives = await response.json();
    this.renderObjectiveTabs(objectives);
  }

  renderObjectiveTabs(objectives) {
    const tabsHTML = objectives.map((obj, idx) => `
      <div class="objective-tab ${idx === 0 ? 'active' : ''}"
           onclick="planning.selectObjective('${obj._id}')">
        ${obj.title}
      </div>
    `).join('');

    document.getElementById('objectiveTabs').innerHTML = tabsHTML;

    if (objectives[0]) {
      this.selectObjective(objectives[0]._id);
    }
  }

  async selectObjective(objectiveId) {
    this.selectedObjective = objectiveId;
    const response = await fetch(`/api/objectives/${objectiveId}`);
    const objective = await response.json();
    this.renderKRCards(objective.key_results);
  }

  renderKRCards(keyResults) {
    const cardsHTML = keyResults.map(kr => {
      const progress = (kr.current_value / kr.target_value) * 100;
      return `
        <div class="kr-card" onclick="planning.selectKR('${kr._id}')">
          <h4>${kr.title}</h4>
          <div class="kr-metrics">
            <span>Current: ${kr.current_value}</span>
            <span>Target: ${kr.target_value}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <button class="btn-plan" onclick="planning.planKR('${kr._id}')">
            📋 Create Plan
          </button>
        </div>
      `;
    }).join('');

    document.getElementById('krList').innerHTML = cardsHTML;
  }

  async generatePlan() {
    const timeline = document.getElementById('timelineInput').value;
    const owner = document.getElementById('ownerSelect').value;

    if (!this.validateInputs(timeline, owner)) return;

    this.showLoading();

    try {
      const response = await fetch('/api/planning/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kr_id: this.selectedKR,
          timeline_weeks: parseInt(timeline),
          owner_id: owner,
          start_date: new Date()
        })
      });

      const data = await response.json();
      this.generatedPlan = data.plan;
      this.renderGeneratedPlan(data.plan);
    } catch (error) {
      this.showError('Failed to generate plan');
    } finally {
      this.hideLoading();
    }
  }

  async createGoals() {
    try {
      const response = await fetch('/api/planning/create-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kr_id: this.selectedKR,
          plan_data: this.generatedPlan
        })
      });

      const data = await response.json();
      this.showSuccess('Goals created successfully!');
      this.resetForm();
    } catch (error) {
      this.showError('Failed to create goals');
    }
  }
}

// Initialize on page load
const planning = new PlanningPage();
document.addEventListener('DOMContentLoaded', () => planning.init());
```

### Dashboard Components
```javascript
// File: /client/js/dashboard.js

class Dashboard {
  constructor() {
    this.currentTab = 'today';
    this.userData = null;
  }

  async init() {
    const userId = this.getCurrentUserId();
    await this.loadDashboardData(userId);
    this.attachEventListeners();
  }

  async loadDashboardData(userId) {
    const response = await fetch(`/api/dashboard/user/${userId}`);
    this.userData = await response.json();
    this.render();
  }

  render() {
    this.renderHeader();
    this.renderContext();

    if (this.currentTab === 'today') {
      this.renderTodayView();
    } else {
      this.renderWeekView();
    }
  }

  renderTodayView() {
    const { tasks_today } = this.userData;

    // Group by priority (due time)
    const highPriority = tasks_today.filter(t =>
      new Date(t.due_date).getHours() < 15
    );
    const normalPriority = tasks_today.filter(t =>
      new Date(t.due_date).getHours() >= 15
    );

    const html = `
      <div class="tasks-section">
        <h3>HIGH PRIORITY (${highPriority.length})</h3>
        ${this.renderTaskList(highPriority)}

        <h3>NORMAL PRIORITY (${normalPriority.length})</h3>
        ${this.renderTaskList(normalPriority)}

        <h3>COMPLETED (${completed.length})</h3>
        ${this.renderTaskList(completed, true)}
      </div>
    `;

    document.getElementById('taskContent').innerHTML = html;
  }

  renderTaskList(tasks, completed = false) {
    return tasks.map(task => `
      <div class="task-item ${completed ? 'completed' : ''}">
        <input type="checkbox"
               ${task.completed ? 'checked' : ''}
               onchange="dashboard.updateTask('${task._id}', this.checked)">
        <div class="task-content">
          <div class="task-title">${task.title}</div>
          <div class="task-meta">
            <span class="task-kr">KR: ${task.goal_id?.key_result_title}</span>
            <span class="task-due">Due: ${formatTime(task.due_date)}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  async updateTask(taskId, completed) {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });

      if (response.ok) {
        // Update local state
        const task = this.userData.tasks_today.find(t => t._id === taskId);
        if (task) task.completed = completed;

        // Re-render
        this.render();

        // Show feedback
        this.showToast('Task updated!');
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      this.showError('Failed to update task');
    }
  }
}

// Initialize on page load
const dashboard = new Dashboard();
document.addEventListener('DOMContentLoaded', () => dashboard.init());
```

---

## 🔒 SECURITY CONSIDERATIONS

### Authorization
```javascript
// Middleware: /server/middleware/auth.js

function authorizeGoalAccess(req, res, next) {
  const userId = req.user._id;
  const goalId = req.params.goalId;

  Goal.findById(goalId)
    .then(goal => {
      if (!goal) {
        return res.status(404).json({ error: 'Goal not found' });
      }

      if (!goal.owner.equals(userId)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      req.goal = goal;
      next();
    })
    .catch(next);
}

// Apply to routes
router.put('/goals/:goalId', authenticate, authorizeGoalAccess, updateGoal);
```

### Input Validation
```javascript
// Validation schemas
const Joi = require('joi');

const planGenerationSchema = Joi.object({
  kr_id: Joi.string().required(),
  timeline_weeks: Joi.number().min(1).max(12).required(),
  owner_id: Joi.string().required(),
  start_date: Joi.date().required()
});

// Validate in routes
const { error } = planGenerationSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

---

## 🚀 DEPLOYMENT CONFIGURATION

### Environment Variables
```bash
# .env file
OPENAI_API_KEY=[REDACTED]
MONGODB_URI=mongodb://localhost:27017/karvia
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📊 PERFORMANCE OPTIMIZATION

### Database Indexes
```javascript
// Required indexes for performance
db.goals.createIndex({ owner: 1, time_period: 1 })
db.goals.createIndex({ parent_goal_id: 1 })
db.goals.createIndex({ key_result_id: 1 })
db.tasks.createIndex({ assigned_to: 1, due_date: 1 })
db.tasks.createIndex({ goal_id: 1 })
```

### Caching Strategy
```javascript
// Redis caching for lineage
const redis = require('redis');
const client = redis.createClient();

async function getCachedLineage(taskId) {
  const cached = await client.get(`lineage:${taskId}`);
  if (cached) return JSON.parse(cached);

  const lineage = await calculateLineage(taskId);
  await client.setex(`lineage:${taskId}`, 3600, JSON.stringify(lineage));

  return lineage;
}
```

---

## ✅ TESTING REQUIREMENTS

### Unit Tests
```javascript
// test/goal.test.js
describe('Goal Model', () => {
  it('should create weekly goals with parent', async () => {
    const quarterlyGoal = await Goal.create({
      title: 'Q1 Revenue Goal',
      time_period: 'QUARTERLY',
      key_result_id: validKRId
    });

    const weeklyGoal = await Goal.create({
      title: 'Week 1 Goal',
      time_period: 'WEEKLY',
      parent_goal_id: quarterlyGoal._id,
      key_result_id: validKRId
    });

    expect(weeklyGoal.parent_goal_id).toEqual(quarterlyGoal._id);
    expect(weeklyGoal.time_period).toBe('WEEKLY');
  });
});
```

### Integration Tests
```javascript
// test/planning-flow.test.js
describe('Planning Flow', () => {
  it('should generate and create goals', async () => {
    // Generate plan
    const planRes = await request(app)
      .post('/api/planning/generate-plan')
      .send({
        kr_id: testKR._id,
        timeline_weeks: 4,
        owner_id: testUser._id
      });

    expect(planRes.status).toBe(200);
    expect(planRes.body.plan.weeks).toHaveLength(4);

    // Create goals
    const goalsRes = await request(app)
      .post('/api/planning/create-goals')
      .send({
        kr_id: testKR._id,
        plan_data: planRes.body.plan
      });

    expect(goalsRes.status).toBe(200);
    expect(goalsRes.body.created_goals).toHaveLength(4);
  });
});
```

---

**Technical Specification Version**: 1.0
**Approved By**: Technical Lead
**Implementation Start**: November 17, 2025

*This technical specification provides complete implementation details for Sprint 2, including database schemas, API endpoints, frontend components, and testing requirements.*