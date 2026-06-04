# 🔧 Sprint 3: Technical Implementation Guide

## Architecture Overview

### New Services & Components
```
karvia_business/
├── server/
│   ├── services/
│   │   ├── DateService.js (NEW - 500 lines)
│   │   ├── CascadeService.js (ENHANCE - +200 lines)
│   │   └── ValidationService.js (NEW - 300 lines)
│   ├── middleware/
│   │   ├── dateValidation.js (NEW - 150 lines)
│   │   └── businessIsolation.js (NEW - 100 lines)
│   └── migrations/
│       └── 20251121-flexible-dates.js (NEW)
├── client/
│   ├── pages/
│   │   ├── quarterly-goals.html (NEW - 400 lines)
│   │   ├── weekly-goals.html (NEW - 300 lines)
│   │   ├── goal-details.html (NEW - 300 lines)
│   │   └── employee-dashboard.html (NEW - 500 lines)
│   ├── js/
│   │   ├── goals-api-client.js (NEW - 300 lines)
│   │   └── components/
│   │       ├── DateSelector.js (NEW - 200 lines)
│   │       ├── WhyChain.js (NEW - 150 lines)
│   │       └── GoalCard.js (NEW - 100 lines)
│   └── pages/scripts/
│       ├── quarterly-goals.js (NEW - 350 lines)
│       ├── weekly-goals.js (NEW - 300 lines)
│       ├── goal-details.js (NEW - 400 lines)
│       └── employee-dashboard.js (NEW - 400 lines)
```

---

## 📅 Date Management System

### 1. Enhanced Objective Model
```javascript
// server/models/Objective.js - ADD these fields

// Time period configuration
time_period_type: {
  type: String,
  enum: ['calendar_year', 'fiscal_year', 'custom', 'multi_year'],
  default: 'calendar_year',
  required: true
},

// Fiscal year configuration
fiscal_year_start_month: {
  type: Number,
  min: 1,
  max: 12,
  default: 1, // January
  required: function() { return this.time_period_type === 'fiscal_year'; }
},

// Duration for custom periods
duration_months: {
  type: Number,
  min: 3,
  max: 36,
  default: 12,
  required: function() { return this.time_period_type === 'custom'; }
},

// Remove constraints from target_year
target_year: {
  type: Number,
  required: true,
  // REMOVE: min: 2024, max: 2030
}
```

### 2. DateService Implementation
```javascript
// server/services/DateService.js

class DateService {
  /**
   * Calculate objective dates based on configuration
   */
  calculateObjectiveDates(config) {
    const { time_period_type, start_date, fiscal_month, duration_months, year } = config;

    switch(time_period_type) {
      case 'calendar_year':
        return this.calculateCalendarYear(year);

      case 'fiscal_year':
        return this.calculateFiscalYear(year, fiscal_month);

      case 'custom':
        return this.calculateCustomPeriod(start_date, duration_months);

      case 'multi_year':
        return this.calculateMultiYear(start_date, duration_months);
    }
  }

  /**
   * Calculate calendar year dates
   */
  calculateCalendarYear(year) {
    return {
      start: new Date(year, 0, 1),        // Jan 1
      end: new Date(year, 11, 31, 23, 59, 59), // Dec 31
      quarters: {
        Q1: { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
        Q2: { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
        Q3: { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
        Q4: { start: new Date(year, 9, 1), end: new Date(year, 11, 31) }
      }
    };
  }

  /**
   * Calculate fiscal year dates
   */
  calculateFiscalYear(year, startMonth) {
    const start = new Date(year, startMonth - 1, 1);
    const end = new Date(year + 1, startMonth - 1, 0, 23, 59, 59);

    // Calculate fiscal quarters
    const quarters = {};
    for (let q = 1; q <= 4; q++) {
      const qStart = new Date(start);
      qStart.setMonth(qStart.getMonth() + (q - 1) * 3);

      const qEnd = new Date(qStart);
      qEnd.setMonth(qEnd.getMonth() + 3);
      qEnd.setDate(0); // Last day of previous month

      quarters[`Q${q}`] = { start: qStart, end: qEnd };
    }

    return { start, end, quarters };
  }

  /**
   * Cascade date changes to all children
   */
  async cascadeDateChanges(objectiveId, newDates) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Get the objective
      const objective = await Objective.findById(objectiveId).session(session);

      // Calculate date shift
      const oldStart = objective.start_date;
      const newStart = newDates.start;
      const daysDiff = Math.floor((newStart - oldStart) / (1000 * 60 * 60 * 24));

      // Update all quarterly goals
      const goals = await Goal.find({
        objective_id: objectiveId,
        time_period: 'QUARTERLY'
      }).session(session);

      for (const goal of goals) {
        // Shift dates proportionally
        goal.start_date = this.shiftDate(goal.start_date, daysDiff);
        goal.due_date = this.shiftDate(goal.due_date, daysDiff);

        // Recalculate quarter if needed
        if (objective.time_period_type === 'fiscal_year') {
          goal.quarter = this.calculateFiscalQuarter(goal.start_date, objective.fiscal_year_start_month);
        }

        await goal.save({ session });

        // Cascade to weekly goals
        await this.cascadeToWeeklyGoals(goal._id, daysDiff, session);
      }

      // Update all tasks
      await this.cascadeToTasks(objectiveId, daysDiff, session);

      await session.commitTransaction();
      return { success: true, updated: goals.length };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Validate date hierarchy
   */
  validateDateHierarchy(parent, child) {
    const errors = [];

    // Child must start after or equal to parent start
    if (child.start_date < parent.start_date) {
      errors.push({
        field: 'start_date',
        message: 'Child start date cannot be before parent start date',
        parentStart: parent.start_date,
        childStart: child.start_date
      });
    }

    // Child must end before or equal to parent end
    if (child.end_date > parent.end_date) {
      errors.push({
        field: 'end_date',
        message: 'Child end date cannot be after parent end date',
        parentEnd: parent.end_date,
        childEnd: child.end_date
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Distribute tasks across available dates
   */
  distributeTaskDates(weekStart, weekEnd, taskCount) {
    const dates = [];
    const weekdays = this.getWeekdays(weekStart, weekEnd);

    if (taskCount <= weekdays.length) {
      // Distribute one task per day
      for (let i = 0; i < taskCount; i++) {
        dates.push(weekdays[i]);
      }
    } else {
      // Distribute evenly across available days
      const tasksPerDay = Math.ceil(taskCount / weekdays.length);
      let taskIndex = 0;

      for (const day of weekdays) {
        for (let i = 0; i < tasksPerDay && taskIndex < taskCount; i++) {
          dates.push(day);
          taskIndex++;
        }
      }
    }

    return dates;
  }

  /**
   * Get weekdays between two dates (Mon-Fri)
   */
  getWeekdays(start, end) {
    const weekdays = [];
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        weekdays.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return weekdays;
  }
}

module.exports = new DateService();
```

### 3. Date Validation Middleware
```javascript
// server/middleware/dateValidation.js

const DateService = require('../services/DateService');

module.exports = {
  /**
   * Validate objective dates
   */
  validateObjectiveDates: async (req, res, next) => {
    try {
      const { time_period_type, start_date, end_date, fiscal_year_start_month, duration_months } = req.body;

      // Calculate expected dates
      const calculatedDates = DateService.calculateObjectiveDates({
        time_period_type,
        start_date,
        fiscal_month: fiscal_year_start_month,
        duration_months,
        year: new Date(start_date || Date.now()).getFullYear()
      });

      // Add calculated dates to request
      req.calculatedDates = calculatedDates;

      // Validate date range
      if (calculatedDates.end < calculatedDates.start) {
        return res.status(400).json({
          error: 'End date must be after start date'
        });
      }

      // Validate duration
      const durationMs = calculatedDates.end - calculatedDates.start;
      const durationDays = durationMs / (1000 * 60 * 60 * 24);

      if (durationDays < 90) {
        return res.status(400).json({
          error: 'Objective must be at least 90 days long'
        });
      }

      if (durationDays > 1095) { // 3 years
        return res.status(400).json({
          error: 'Objective cannot exceed 3 years'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Validate child dates against parent
   */
  validateChildDates: async (req, res, next) => {
    try {
      const { parent_id, start_date, due_date } = req.body;

      if (!parent_id) {
        return next(); // No parent to validate against
      }

      // Get parent dates
      const parent = await Goal.findById(parent_id) ||
                     await Objective.findById(parent_id);

      if (!parent) {
        return res.status(404).json({ error: 'Parent not found' });
      }

      // Validate hierarchy
      const validation = DateService.validateDateHierarchy(
        { start_date: parent.start_date, end_date: parent.due_date || parent.end_date },
        { start_date: new Date(start_date), end_date: new Date(due_date) }
      );

      if (!validation.valid) {
        return res.status(400).json({
          error: 'Date validation failed',
          details: validation.errors
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
```

---

## 🎯 Goal Management UI Implementation

### 1. Goals API Client
```javascript
// client/js/goals-api-client.js

class GoalsAPIClient {
  constructor() {
    this.baseURL = '/api';
    this.token = localStorage.getItem('token');
  }

  /**
   * Get quarterly goals for an objective
   */
  async getQuarterlyGoals(objectiveId, quarter) {
    const response = await fetch(`${this.baseURL}/goals?objective_id=${objectiveId}&quarter=${quarter}&time_period=QUARTERLY`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    return response.json();
  }

  /**
   * Create quarterly goal
   */
  async createQuarterlyGoal(data) {
    const response = await fetch(`${this.baseURL}/planning/goals/quarterly`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  /**
   * Get weekly goals for a quarterly goal
   */
  async getWeeklyGoals(parentGoalId) {
    const response = await fetch(`${this.baseURL}/goals?parent_goal_id=${parentGoalId}&time_period=WEEKLY`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    return response.json();
  }

  /**
   * Create weekly goals (bulk)
   */
  async createWeeklyGoals(parentGoalId, weeks) {
    const response = await fetch(`${this.baseURL}/planning/goals/weekly/bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent_goal_id: parentGoalId,
        weeks: weeks
      })
    });
    return response.json();
  }

  /**
   * Update goal progress
   */
  async updateProgress(goalId, progress) {
    const response = await fetch(`${this.baseURL}/goals/${goalId}/progress`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ progress })
    });
    return response.json();
  }

  /**
   * Assign goal to users
   */
  async assignGoal(goalId, assignments) {
    const response = await fetch(`${this.baseURL}/goals/${goalId}/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assignments })
    });
    return response.json();
  }
}

window.GoalsAPI = new GoalsAPIClient();
```

### 2. Quarterly Goals Page Controller
```javascript
// client/pages/scripts/quarterly-goals.js

class QuarterlyGoalsController {
  constructor() {
    this.api = window.GoalsAPI;
    this.objectives = [];
    this.currentQuarter = this.getCurrentQuarter();
    this.selectedObjective = null;
    this.init();
  }

  async init() {
    await this.loadObjectives();
    this.setupEventListeners();
    this.renderQuarterSelector();
    await this.loadGoals();
  }

  getCurrentQuarter() {
    const month = new Date().getMonth();
    return `Q${Math.floor(month / 3) + 1}`;
  }

  async loadObjectives() {
    const response = await fetch('/api/objectives', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    this.objectives = data.objectives;
    this.renderObjectiveTabs();
  }

  renderObjectiveTabs() {
    const tabsContainer = document.getElementById('objective-tabs');
    tabsContainer.innerHTML = '';

    this.objectives.forEach((obj, index) => {
      const tab = document.createElement('div');
      tab.className = `tab ${index === 0 ? 'active' : ''}`;
      tab.dataset.objectiveId = obj._id;
      tab.innerHTML = `
        <div class="tab-title">${obj.title}</div>
        <div class="tab-progress">${obj.progress_percentage}%</div>
      `;
      tab.addEventListener('click', () => this.selectObjective(obj._id));
      tabsContainer.appendChild(tab);
    });

    if (this.objectives.length > 0) {
      this.selectedObjective = this.objectives[0]._id;
    }
  }

  async loadGoals() {
    if (!this.selectedObjective) return;

    const goals = await this.api.getQuarterlyGoals(
      this.selectedObjective,
      this.currentQuarter
    );

    this.renderGoals(goals.data);
  }

  renderGoals(goals) {
    const container = document.getElementById('goals-container');
    container.innerHTML = '';

    // Get key results for this objective
    const objective = this.objectives.find(o => o._id === this.selectedObjective);
    const keyResults = objective?.key_results || [];

    keyResults.forEach(kr => {
      // Find goals for this key result
      const krGoals = goals.filter(g => g.key_result_id === kr._id);

      const krSection = document.createElement('div');
      krSection.className = 'key-result-section';
      krSection.innerHTML = `
        <div class="kr-header">
          <h3>${kr.title}</h3>
          <button class="btn-primary" onclick="quarterlyGoals.showCreateGoal('${kr._id}')">
            + Add Quarterly Goal
          </button>
        </div>
        <div class="kr-goals">
          ${krGoals.map(goal => this.renderGoalCard(goal)).join('')}
        </div>
      `;
      container.appendChild(krSection);
    });
  }

  renderGoalCard(goal) {
    return `
      <div class="goal-card" data-goal-id="${goal._id}">
        <div class="goal-header">
          <h4>${goal.name}</h4>
          <span class="goal-status ${goal.status}">${goal.status}</span>
        </div>
        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${goal.progress}%"></div>
          </div>
          <span class="progress-text">${goal.progress}%</span>
        </div>
        <div class="goal-dates">
          ${new Date(goal.start_date).toLocaleDateString()} -
          ${new Date(goal.due_date).toLocaleDateString()}
        </div>
        <div class="goal-owner">
          <img src="/api/users/${goal.owner_id._id}/avatar" alt="${goal.owner_id.name}">
          <span>${goal.owner_id.name}</span>
        </div>
        <div class="goal-actions">
          <button onclick="quarterlyGoals.editGoal('${goal._id}')">Edit</button>
          <button onclick="quarterlyGoals.createWeeklyGoals('${goal._id}')">Create Weekly</button>
          <button onclick="quarterlyGoals.viewDetails('${goal._id}')">View Details</button>
        </div>
      </div>
    `;
  }

  async showCreateGoal(keyResultId) {
    const modal = new GoalCreationModal(keyResultId, this.currentQuarter);
    await modal.show();
    modal.onSave = async (goalData) => {
      await this.api.createQuarterlyGoal(goalData);
      await this.loadGoals();
    };
  }

  async createWeeklyGoals(quarterlyGoalId) {
    const modal = new WeeklyGoalsModal(quarterlyGoalId);
    await modal.show();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.quarterlyGoals = new QuarterlyGoalsController();
});
```

---

## 👤 Employee Dashboard Implementation

### 1. Dashboard Controller
```javascript
// client/pages/scripts/employee-dashboard.js

class EmployeeDashboard {
  constructor() {
    this.tasks = [];
    this.goals = [];
    this.stats = {};
    this.init();
  }

  async init() {
    await this.loadDashboardData();
    this.setupEventListeners();
    this.startAutoRefresh();
  }

  async loadDashboardData() {
    // Load all data in parallel
    const [tasksRes, goalsRes, statsRes] = await Promise.all([
      fetch('/api/tasks/my-tasks?due=today', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch('/api/goals/my-goals?status=in_progress', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch('/api/dashboard/my-stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
    ]);

    this.tasks = (await tasksRes.json()).data;
    this.goals = (await goalsRes.json()).data;
    this.stats = (await statsRes.json()).data;

    this.render();
  }

  render() {
    this.renderTodaysTasks();
    this.renderWeeklyProgress();
    this.renderWhyChain();
    this.renderQuickStats();
  }

  renderTodaysTasks() {
    const container = document.getElementById('todays-tasks');

    // Sort tasks by priority and due time
    const sortedTasks = this.tasks.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    container.innerHTML = `
      <div class="tasks-header">
        <h2>Today's Focus</h2>
        <span class="task-count">${this.tasks.length} tasks</span>
      </div>
      <div class="tasks-list">
        ${sortedTasks.map(task => this.renderTaskItem(task)).join('')}
      </div>
    `;
  }

  renderTaskItem(task) {
    const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';

    return `
      <div class="task-item ${task.status} ${isOverdue ? 'overdue' : ''}" data-task-id="${task._id}">
        <div class="task-checkbox">
          <input type="checkbox"
                 id="task-${task._id}"
                 ${task.status === 'completed' ? 'checked' : ''}
                 onchange="dashboard.toggleTask('${task._id}')">
        </div>
        <div class="task-content">
          <label for="task-${task._id}" class="task-name">${task.name}</label>
          <div class="task-meta">
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <span class="task-goal">${task.goal_id?.name || 'No goal'}</span>
            <span class="task-due">${this.formatDueTime(task.due_date)}</span>
          </div>
        </div>
        <div class="task-progress">
          <input type="range"
                 min="0"
                 max="100"
                 value="${task.progress}"
                 onchange="dashboard.updateProgress('${task._id}', this.value)"
                 class="progress-slider">
          <span class="progress-value">${task.progress}%</span>
        </div>
        <button class="why-chain-btn" onclick="dashboard.showWhyChain('${task._id}')">
          Why?
        </button>
      </div>
    `;
  }

  async toggleTask(taskId) {
    const checkbox = document.getElementById(`task-${taskId}`);
    const status = checkbox.checked ? 'completed' : 'todo';

    await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    // Update UI optimistically
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    taskElement.className = `task-item ${status}`;

    // Refresh stats after 1 second
    setTimeout(() => this.loadDashboardData(), 1000);
  }

  async updateProgress(taskId, progress) {
    await fetch(`/api/tasks/${taskId}/progress`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ progress: parseInt(progress) })
    });

    // Update display
    const progressValue = document.querySelector(`[data-task-id="${taskId}"] .progress-value`);
    progressValue.textContent = `${progress}%`;
  }

  async showWhyChain(taskId) {
    const task = this.tasks.find(t => t._id === taskId);
    const chain = await this.loadWhyChain(task);

    const modal = document.getElementById('why-chain-modal');
    modal.innerHTML = `
      <div class="why-chain-content">
        <h3>Why This Matters</h3>
        <div class="chain-visualization">
          ${this.renderChainVisualization(chain)}
        </div>
        <button onclick="dashboard.closeWhyChain()">Got It!</button>
      </div>
    `;
    modal.style.display = 'block';
  }

  async loadWhyChain(task) {
    // Load the full chain from task to company mission
    const chain = [];

    // Task level
    chain.push({
      type: 'task',
      title: task.name,
      description: task.description
    });

    // Goal level
    if (task.goal_id) {
      const goalRes = await fetch(`/api/goals/${task.goal_id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const goal = await goalRes.json();
      chain.push({
        type: 'goal',
        title: goal.name,
        description: goal.description,
        progress: goal.progress
      });
    }

    // Objective level
    if (task.objective_id) {
      const objRes = await fetch(`/api/objectives/${task.objective_id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const objective = await objRes.json();
      chain.push({
        type: 'objective',
        title: objective.title,
        description: objective.description,
        category: objective.category
      });
    }

    // Company mission
    const companyRes = await fetch('/api/companies/current', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const company = await companyRes.json();
    chain.push({
      type: 'company',
      title: company.name,
      description: company.mission || 'Growing the business'
    });

    return chain;
  }

  renderChainVisualization(chain) {
    return chain.map((item, index) => `
      <div class="chain-item ${item.type}">
        <div class="chain-icon">${this.getChainIcon(item.type)}</div>
        <div class="chain-content">
          <div class="chain-title">${item.title}</div>
          <div class="chain-description">${item.description}</div>
        </div>
        ${index < chain.length - 1 ? '<div class="chain-connector">↓</div>' : ''}
      </div>
    `).join('');
  }

  getChainIcon(type) {
    const icons = {
      task: '✓',
      goal: '🎯',
      objective: '🏆',
      company: '🏢'
    };
    return icons[type] || '•';
  }

  formatDueTime(date) {
    const due = new Date(date);
    const now = new Date();
    const hoursUntil = Math.floor((due - now) / (1000 * 60 * 60));

    if (hoursUntil < 0) {
      return `Overdue by ${Math.abs(hoursUntil)} hours`;
    } else if (hoursUntil < 24) {
      return `Due in ${hoursUntil} hours`;
    } else {
      return due.toLocaleDateString();
    }
  }

  startAutoRefresh() {
    // Refresh dashboard every 5 minutes
    setInterval(() => {
      this.loadDashboardData();
    }, 5 * 60 * 1000);
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new EmployeeDashboard();
});
```

---

## 🏢 Business Management API

### Complete Business Routes
```javascript
// server/routes/businesses.js - COMPLETE IMPLEMENTATION

const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const User = require('../models/User');
const Team = require('../models/Team');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { businessIsolation } = require('../middleware/businessIsolation');

// GET /api/businesses/:id - Get business details
router.get('/:id', authenticateToken, businessIsolation, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner_id', 'name email')
      .populate('subscription_plan');

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check access
    const hasAccess = req.user.role === 'CONSULTANT' ||
                      req.user.company_id.toString() === business._id.toString();

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/businesses/:id - Update business
router.put('/:id', authenticateToken, requireRole(['BUSINESS_OWNER', 'CONSULTANT']), async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Validate ownership
    const isOwner = business.owner_id.toString() === req.user._id.toString();
    const isConsultant = req.user.role === 'CONSULTANT' &&
                         req.user.managed_businesses.includes(business._id);

    if (!isOwner && !isConsultant) {
      return res.status(403).json({ error: 'Not authorized to update this business' });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'industry', 'size', 'website', 'description', 'settings'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedBusiness
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/businesses/:id - Delete business (soft delete)
router.delete('/:id', authenticateToken, requireRole(['BUSINESS_OWNER']), async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Only owner can delete
    if (business.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only business owner can delete' });
    }

    // Soft delete
    business.status = 'inactive';
    business.deleted_at = new Date();
    await business.save();

    res.json({
      success: true,
      message: 'Business deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/businesses/:id/users - Get all users in business
router.get('/:id/users', authenticateToken, businessIsolation, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status = 'active' } = req.query;

    const query = {
      company_id: req.params.id,
      status: status
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .populate('team_id', 'name')
      .populate('department_id', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/businesses/:id/teams - Get all teams in business
router.get('/:id/teams', authenticateToken, businessIsolation, async (req, res) => {
  try {
    const teams = await Team.find({
      company_id: req.params.id,
      is_active: true
    })
    .populate('manager_id', 'name email')
    .populate('members.user_id', 'name email avatar')
    .sort({ created_at: -1 });

    res.json({
      success: true,
      data: teams,
      total: teams.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/businesses/:id/stats - Get business statistics
router.get('/:id/stats', authenticateToken, businessIsolation, async (req, res) => {
  try {
    const businessId = req.params.id;

    // Gather statistics in parallel
    const [
      userCount,
      teamCount,
      objectiveCount,
      goalCount,
      taskCount,
      assessmentCount
    ] = await Promise.all([
      User.countDocuments({ company_id: businessId, status: 'active' }),
      Team.countDocuments({ company_id: businessId, is_active: true }),
      Objective.countDocuments({ company_id: businessId, status: { $ne: 'cancelled' } }),
      Goal.countDocuments({ company_id: businessId, status: { $ne: 'cancelled' } }),
      Task.countDocuments({ company_id: businessId, status: { $ne: 'cancelled' } }),
      Assessment.countDocuments({ company_id: businessId })
    ]);

    // Calculate completion rates
    const [
      completedObjectives,
      completedGoals,
      completedTasks
    ] = await Promise.all([
      Objective.countDocuments({ company_id: businessId, status: 'completed' }),
      Goal.countDocuments({ company_id: businessId, status: 'completed' }),
      Task.countDocuments({ company_id: businessId, status: 'completed' })
    ]);

    // Get latest SSI scores
    const business = await Business.findById(businessId);

    res.json({
      success: true,
      data: {
        users: {
          total: userCount,
          by_role: await this.getUsersByRole(businessId)
        },
        teams: {
          total: teamCount,
          average_size: userCount / (teamCount || 1)
        },
        okr: {
          objectives: {
            total: objectiveCount,
            completed: completedObjectives,
            completion_rate: (completedObjectives / (objectiveCount || 1) * 100).toFixed(1)
          },
          goals: {
            total: goalCount,
            completed: completedGoals,
            completion_rate: (completedGoals / (goalCount || 1) * 100).toFixed(1)
          },
          tasks: {
            total: taskCount,
            completed: completedTasks,
            completion_rate: (completedTasks / (taskCount || 1) * 100).toFixed(1)
          }
        },
        assessments: {
          total: assessmentCount,
          ssi_scores: business.ssi_scores || {
            speed: 0,
            strength: 0,
            intelligence: 0
          }
        },
        health: {
          overall: business.health_score || 0,
          trend: business.health_trend || 'stable'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get users by role
router.getUsersByRole = async function(businessId) {
  const roles = await User.aggregate([
    { $match: { company_id: mongoose.Types.ObjectId(businessId), status: 'active' } },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  const roleMap = {};
  roles.forEach(r => {
    roleMap[r._id] = r.count;
  });

  return roleMap;
};

module.exports = router;
```

---

## 🔄 Migration Script

```javascript
// server/migrations/20251121-flexible-dates.js

const mongoose = require('mongoose');
const Objective = require('../models/Objective');

module.exports = {
  async up() {
    console.log('Starting flexible dates migration...');

    // Add new fields to all existing objectives
    const objectives = await Objective.find({});

    for (const objective of objectives) {
      // Set defaults for new fields
      objective.time_period_type = 'calendar_year';
      objective.fiscal_year_start_month = 1;
      objective.duration_months = 12;

      // Ensure dates are set correctly
      if (!objective.start_date) {
        objective.start_date = new Date(objective.target_year, 0, 1);
      }

      if (!objective.end_date) {
        objective.end_date = new Date(objective.target_year, 11, 31, 23, 59, 59);
      }

      await objective.save();
    }

    console.log(`Migrated ${objectives.length} objectives`);
  },

  async down() {
    // Remove new fields
    await Objective.updateMany(
      {},
      {
        $unset: {
          time_period_type: 1,
          fiscal_year_start_month: 1,
          duration_months: 1
        }
      }
    );
  }
};
```

---

## 🧪 Test Cases

### Date Management Tests
```javascript
// server/tests/services/DateService.test.js

describe('DateService', () => {
  describe('calculateFiscalYear', () => {
    it('should calculate April-March fiscal year correctly', () => {
      const result = DateService.calculateFiscalYear(2025, 4);
      expect(result.start).toEqual(new Date(2025, 3, 1));
      expect(result.end).toEqual(new Date(2026, 2, 31));
      expect(result.quarters.Q1.start).toEqual(new Date(2025, 3, 1));
      expect(result.quarters.Q1.end).toEqual(new Date(2025, 5, 30));
    });
  });

  describe('cascadeDateChanges', () => {
    it('should update all child dates proportionally', async () => {
      // Test implementation
    });
  });

  describe('validateDateHierarchy', () => {
    it('should detect child dates outside parent range', () => {
      // Test implementation
    });
  });
});
```

---

**Total Implementation**: ~4,500 lines of new code across 15 files