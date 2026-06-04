# ⚙️ BACKEND AUTOMATION SPECIFICATIONS

**Version**: 1.0.0
**Created**: 2025-10-22
**Purpose**: Define all automated backend processes (progress rollup, notifications, cron jobs, triggers)

---

## 📋 OVERVIEW

**Critical Automations**:
1. **Progress Rollup**: Task completion → Weekly Goal → Quarterly Goal → Key Result → Objective
2. **Notifications**: Task assigned, Plan approved, Alerts triggered
3. **Scheduled Jobs**: Daily intervention checks, Weekly reports, Monthly cleanup
4. **Triggers**: Status changes, Deadline approaching, Goal achieved

---

## 🔄 AUTOMATION 1: PROGRESS ROLLUP (CRITICAL)

**Issue Identified in Audit**: GAP #3 - No automated progress calculation story

### **Flow**:
```
Employee marks task complete (EMP-009)
    ↓ TRIGGER
Backend auto-calculates progress
    ↓ ROLLUP
Weekly Goal progress updated
    ↓ ROLLUP
Quarterly Goal progress updated
    ↓ ROLLUP
Key Result progress updated
    ↓ ROLLUP
Objective progress updated
```

### **Implementation**:

#### **Task Completion Handler**
```javascript
// server/routes/tasks.js
taskRouter.post('/:id/complete', async (req, res) => {
  const task = await Task.findById(req.params.id);

  // 1. Mark task as complete
  task.status = 'completed';
  task.completed_at = new Date();
  task.completed_by = req.user._id;
  await task.save();

  // 2. TRIGGER AUTOMATED PROGRESS ROLLUP
  await rollupProgressChain(task);

  res.json({ success: true, task });
});

// server/routes/tasks.js
taskRouter.patch('/:id/progress', async (req, res) => {
  const task = await Task.findById(req.params.id);

  // 1. Update task progress
  task.progress = req.body.progress; // e.g., 50%, 75%
  task.last_updated = new Date();
  await task.save();

  // 2. TRIGGER AUTOMATED PROGRESS ROLLUP
  await rollupProgressChain(task);

  res.json({ success: true, task });
});
```

#### **Progress Rollup Chain**
```javascript
// server/utils/progressRollup.js
async function rollupProgressChain(task) {
  try {
    // STEP 1: Calculate Weekly Goal Progress
    if (task.lineage.weekly_goal_id) {
      const weeklyGoal = await rollupWeeklyGoalProgress(task.lineage.weekly_goal_id);

      // STEP 2: Calculate Quarterly Goal Progress
      if (weeklyGoal && task.lineage.quarterly_goal_id) {
        const quarterlyGoal = await rollupQuarterlyGoalProgress(task.lineage.quarterly_goal_id);

        // STEP 3: Calculate Key Result Progress
        if (quarterlyGoal && task.lineage.key_result_id) {
          const keyResult = await rollupKeyResultProgress(task.lineage.key_result_id);

          // STEP 4: Calculate Objective Progress
          if (keyResult && task.lineage.objective_id) {
            await rollupObjectiveProgress(task.lineage.objective_id);
          }
        }
      }
    }

    console.log(`✅ Progress rollup complete for task ${task._id}`);
  } catch (error) {
    console.error(`❌ Progress rollup failed for task ${task._id}:`, error);
    // Log error but don't fail the request
    await AuditLog.create({
      action: 'rollup_error',
      entity: 'task',
      entity_id: task._id,
      error: error.message
    });
  }
}

// STEP 1: Weekly Goal Progress
async function rollupWeeklyGoalProgress(weeklyGoalId) {
  const weeklyGoal = await Goal.findById(weeklyGoalId);
  if (!weeklyGoal) return null;

  // Get all tasks linked to this weekly goal
  const tasks = await Task.find({
    'lineage.weekly_goal_id': weeklyGoalId,
    is_active: true // Exclude soft-deleted tasks
  });

  if (tasks.length === 0) {
    weeklyGoal.progress = 0;
  } else {
    // Calculate average progress of all tasks
    const totalProgress = tasks.reduce((sum, task) => {
      if (task.status === 'completed') return sum + 100;
      return sum + (task.progress || 0);
    }, 0);

    weeklyGoal.progress = Math.round(totalProgress / tasks.length);
  }

  weeklyGoal.last_calculated_at = new Date();
  await weeklyGoal.save();

  console.log(`📊 Weekly Goal ${weeklyGoalId} progress: ${weeklyGoal.progress}%`);
  return weeklyGoal;
}

// STEP 2: Quarterly Goal Progress
async function rollupQuarterlyGoalProgress(quarterlyGoalId) {
  const quarterlyGoal = await Goal.findById(quarterlyGoalId);
  if (!quarterlyGoal) return null;

  // Get all weekly goals linked to this quarterly goal
  const weeklyGoals = await Goal.find({
    'lineage.quarterly_goal_id': quarterlyGoalId,
    is_active: true
  });

  if (weeklyGoals.length === 0) {
    quarterlyGoal.progress = 0;
  } else {
    // Calculate weighted average (recent weeks weighted higher)
    const totalProgress = weeklyGoals.reduce((sum, goal) => sum + goal.progress, 0);
    quarterlyGoal.progress = Math.round(totalProgress / weeklyGoals.length);
  }

  quarterlyGoal.last_calculated_at = new Date();
  await quarterlyGoal.save();

  console.log(`📊 Quarterly Goal ${quarterlyGoalId} progress: ${quarterlyGoal.progress}%`);
  return quarterlyGoal;
}

// STEP 3: Key Result Progress
async function rollupKeyResultProgress(keyResultId) {
  const objective = await Objective.findOne({ 'key_results._id': keyResultId });
  if (!objective) return null;

  const keyResult = objective.key_results.id(keyResultId);

  // Get all quarterly goals linked to this key result
  const quarterlyGoals = await Goal.find({
    'lineage.key_result_id': keyResultId,
    is_active: true
  });

  if (quarterlyGoals.length === 0) {
    keyResult.progress = 0;
  } else {
    const totalProgress = quarterlyGoals.reduce((sum, goal) => sum + goal.progress, 0);
    keyResult.progress = Math.round(totalProgress / quarterlyGoals.length);
  }

  keyResult.last_calculated_at = new Date();
  await objective.save();

  console.log(`📊 Key Result ${keyResultId} progress: ${keyResult.progress}%`);
  return keyResult;
}

// STEP 4: Objective Progress
async function rollupObjectiveProgress(objectiveId) {
  const objective = await Objective.findById(objectiveId);
  if (!objective) return null;

  // Calculate average progress of all key results
  if (objective.key_results.length === 0) {
    objective.progress = 0;
  } else {
    const totalProgress = objective.key_results.reduce((sum, kr) => sum + kr.progress, 0);
    objective.progress = Math.round(totalProgress / objective.key_results.length);
  }

  objective.last_calculated_at = new Date();
  await objective.save();

  console.log(`📊 Objective ${objectiveId} progress: ${objective.progress}%`);
  return objective;
}

module.exports = { rollupProgressChain };
```

### **Database Models (Updated)**:

```javascript
// Task model
{
  _id, title, description, assigned_to,
  status: 'pending' | 'in_progress' | 'completed',
  progress: Number, // 0-100
  lineage: {
    daily_task: ObjectId, // self-reference
    weekly_goal: ObjectId,
    quarterly_goal: ObjectId,
    key_result: ObjectId,
    objective: ObjectId,
    assessment: ObjectId
  },
  is_active: Boolean, // For soft delete
  completed_at: Date,
  last_updated: Date
}

// Goal model (Quarterly & Weekly)
{
  _id, title, type: 'quarterly' | 'weekly',
  progress: Number, // 0-100 (AUTO-CALCULATED)
  last_calculated_at: Date, // When progress was last calculated
  lineage: { ... },
  is_active: Boolean
}

// Key Result (nested in Objective)
{
  _id, title, target, current,
  progress: Number, // 0-100 (AUTO-CALCULATED)
  last_calculated_at: Date
}

// Objective
{
  _id, title,
  key_results: [{ ... }],
  progress: Number, // 0-100 (AUTO-CALCULATED from KRs)
  last_calculated_at: Date
}
```

---

## 🔔 AUTOMATION 2: NOTIFICATION SYSTEM

**Issue Identified in Audit**: GAP #4 - Task assignment notification missing

### **Notification Types**:
1. **Task Assigned** (NEW - missing in audit)
2. **Task Due Soon** (EMP-013)
3. **Task Overdue**
4. **Plan Approved** (EXEC-011B)
5. **Plan Changes Requested** (EXEC-011B)
6. **Goal Achieved** (auto-trigger)
7. **At-Risk Alert** (MGR-026)

### **Implementation**:

#### **Task Assignment Notification**
```javascript
// server/routes/tasks.js (MGR-017)
taskRouter.post('/create', async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    assigned_to: req.body.assigned_to,
    created_by: req.user._id,
    // ... other fields
  });

  // TRIGGER: Send notification to assigned employee
  await sendNotification({
    type: 'task_assigned',
    recipient_id: task.assigned_to,
    data: {
      task_id: task._id,
      task_title: task.title,
      due_date: task.due_date,
      assigned_by: req.user.name
    },
    channels: ['in_app', 'email'] // Both
  });

  res.json({ success: true, task });
});

// server/utils/notifications.js
async function sendNotification({ type, recipient_id, data, channels }) {
  // 1. Create in-app notification
  if (channels.includes('in_app')) {
    await Notification.create({
      user_id: recipient_id,
      type,
      data,
      read: false,
      created_at: new Date()
    });
  }

  // 2. Send email notification
  if (channels.includes('email')) {
    const user = await User.findById(recipient_id);
    const emailTemplate = getEmailTemplate(type);

    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject(data),
      body: emailTemplate.body(data)
    });
  }

  console.log(`✉️ Notification sent: ${type} to user ${recipient_id}`);
}

// Email templates
function getEmailTemplate(type) {
  const templates = {
    task_assigned: {
      subject: (data) => `New task assigned: ${data.task_title}`,
      body: (data) => `
        Hi,

        ${data.assigned_by} has assigned you a new task:

        Task: ${data.task_title}
        Due: ${data.due_date}

        View task: [Link to dashboard]

        Best,
        Karvia OKR Team
      `
    },
    plan_approved: {
      subject: (data) => `Quarterly plan approved!`,
      body: (data) => `
        Hi,

        Your Q1 2026 quarterly plan has been approved by ${data.executive_name}.

        Goals are now active and visible to your team.

        View plan: [Link to planning page]

        Best,
        Karvia OKR Team
      `
    }
    // ... more templates
  };

  return templates[type];
}
```

#### **Plan Approval Notification** (EXEC-011B)
```javascript
// server/routes/planning.js
planningRouter.post('/:planId/approve', async (req, res) => {
  const plan = await QuarterlyPlan.findById(req.params.planId);

  // 1. Update plan status
  plan.status = 'approved';
  plan.approved_by = req.user._id;
  plan.approved_at = new Date();
  await plan.save();

  // 2. ACTIVATE ALL GOALS IN THE PLAN
  await Goal.updateMany(
    { plan_id: plan._id },
    { status: 'active', visible_to_team: true }
  );

  // 3. NOTIFY MANAGER
  await sendNotification({
    type: 'plan_approved',
    recipient_id: plan.manager_id,
    data: {
      plan_id: plan._id,
      quarter: plan.quarter,
      executive_name: req.user.name
    },
    channels: ['in_app', 'email']
  });

  // 4. NOTIFY ALL TEAM MEMBERS
  const team = await Team.findById(plan.team_id);
  for (const member of team.members) {
    await sendNotification({
      type: 'goals_activated',
      recipient_id: member.user_id,
      data: {
        quarter: plan.quarter,
        team_name: team.name
      },
      channels: ['in_app']
    });
  }

  res.json({ success: true });
});
```

---

## ⏰ AUTOMATION 3: SCHEDULED JOBS (CRON)

### **Job 1: Daily Intervention Check** (MGR-026)
```javascript
// server/jobs/interventionCheck.js
const cron = require('node-cron');

// Run daily at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('🔍 Running daily intervention check...');

  const allManagers = await User.find({ role: 'MANAGER', is_active: true });

  for (const manager of allManagers) {
    const teamMembers = await getTeamMembers(manager._id);

    for (const member of teamMembers) {
      const alerts = [];

      // CHECK 1: Overdue tasks (>3 days)
      const overdueTasks = await Task.find({
        assigned_to: member._id,
        due_date: { $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        status: { $ne: 'completed' }
      });

      if (overdueTasks.length > 0) {
        const totalTasks = await Task.countDocuments({
          assigned_to: member._id,
          status: { $ne: 'completed' }
        });

        if (overdueTasks.length / totalTasks > 0.5) {
          alerts.push({
            type: 'overdue_tasks',
            severity: 'high',
            count: overdueTasks.length,
            message: `${overdueTasks.length} of ${totalTasks} tasks overdue (${Math.round(overdueTasks.length / totalTasks * 100)}%)`
          });
        }
      }

      // CHECK 2: No tasks completed in 7+ days
      const recentCompletions = await Task.countDocuments({
        assigned_to: member._id,
        status: 'completed',
        completed_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      if (recentCompletions === 0) {
        alerts.push({
          type: 'no_activity',
          severity: 'medium',
          message: 'No tasks completed in last 7 days'
        });
      }

      // CHECK 3: Goal progress <30% with <30 days remaining
      const goals = await Goal.find({
        assigned_to: member._id,
        type: 'quarterly',
        status: 'active'
      });

      for (const goal of goals) {
        const daysRemaining = Math.ceil((goal.due_date - new Date()) / (24 * 60 * 60 * 1000));
        if (goal.progress < 30 && daysRemaining < 30) {
          alerts.push({
            type: 'goal_at_risk',
            severity: 'high',
            goal_id: goal._id,
            message: `Goal "${goal.title}" at ${goal.progress}% with ${daysRemaining} days left`
          });
        }
      }

      // CREATE ALERT IF ANY ISSUES FOUND
      if (alerts.length > 0) {
        await Alert.create({
          manager_id: manager._id,
          employee_id: member._id,
          alerts,
          status: 'open',
          created_at: new Date()
        });

        // Notify manager
        await sendNotification({
          type: 'intervention_alert',
          recipient_id: manager._id,
          data: {
            employee_name: member.name,
            alert_count: alerts.length,
            severity: alerts.some(a => a.severity === 'high') ? 'high' : 'medium'
          },
          channels: ['in_app', 'email']
        });
      }
    }
  }

  console.log('✅ Daily intervention check complete');
});
```

### **Job 2: Weekly Digest Email**
```javascript
// server/jobs/weeklyDigest.js
cron.schedule('0 9 * * MON', async () => {
  console.log('📧 Sending weekly digest emails...');

  const allUsers = await User.find({ is_active: true });

  for (const user of allUsers) {
    // Get user's stats for last week
    const tasksCompleted = await Task.countDocuments({
      assigned_to: user._id,
      status: 'completed',
      completed_at: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const tasksDue = await Task.countDocuments({
      assigned_to: user._id,
      status: { $ne: 'completed' },
      due_date: { $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });

    await sendEmail({
      to: user.email,
      subject: 'Your weekly progress summary',
      body: `
        Hi ${user.name},

        Here's your progress this week:
        - Tasks completed: ${tasksCompleted}
        - Tasks due this week: ${tasksDue}

        View dashboard: [Link]

        Best,
        Karvia OKR Team
      `
    });
  }

  console.log('✅ Weekly digest emails sent');
});
```

### **Job 3: Monthly Data Cleanup**
```javascript
// server/jobs/monthlyCleanup.js
cron.schedule('0 0 1 * *', async () => {
  console.log('🧹 Running monthly data cleanup...');

  // Archive old notifications (>90 days, read)
  const result1 = await Notification.updateMany(
    {
      created_at: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      read: true
    },
    { is_archived: true }
  );

  console.log(`📦 Archived ${result1.modifiedCount} old notifications`);

  // Delete expired sessions (>30 days inactive)
  const result2 = await Session.deleteMany({
    last_activity: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });

  console.log(`🗑️ Deleted ${result2.deletedCount} expired sessions`);

  console.log('✅ Monthly cleanup complete');
});
```

---

## 🎯 AUTOMATION 4: STATUS CHANGE TRIGGERS

### **Goal Achieved Trigger**
```javascript
// In rollupQuarterlyGoalProgress()
if (quarterlyGoal.progress >= 100 && quarterlyGoal.status !== 'completed') {
  // Auto-mark as completed
  quarterlyGoal.status = 'completed';
  quarterlyGoal.completed_at = new Date();
  await quarterlyGoal.save();

  // Notify team
  await sendNotification({
    type: 'goal_achieved',
    recipient_id: quarterlyGoal.assigned_to,
    data: {
      goal_title: quarterlyGoal.title,
      quarter: quarterlyGoal.quarter
    },
    channels: ['in_app', 'email']
  });

  // Notify manager
  const team = await Team.findById(quarterlyGoal.team_id);
  await sendNotification({
    type: 'team_goal_achieved',
    recipient_id: team.manager_id,
    data: {
      goal_title: quarterlyGoal.title,
      team_name: team.name
    },
    channels: ['in_app']
  });
}
```

### **Deadline Approaching Trigger** (48 hours before)
```javascript
// server/jobs/deadlineReminders.js
cron.schedule('0 9 * * *', async () => {
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

  // Find tasks due in 48 hours
  const tasksDueSoon = await Task.find({
    due_date: {
      $gte: new Date(),
      $lte: twoDaysFromNow
    },
    status: { $ne: 'completed' }
  });

  for (const task of tasksDueSoon) {
    await sendNotification({
      type: 'task_due_soon',
      recipient_id: task.assigned_to,
      data: {
        task_title: task.title,
        due_date: task.due_date
      },
      channels: ['in_app', 'email']
    });
  }
});
```

---

## 📊 AUTOMATION SUMMARY

| Automation | Trigger | Frequency | Stories Affected |
|------------|---------|-----------|------------------|
| Progress Rollup | Task complete/update | Real-time | EMP-009, EMP-010, MGR-019 |
| Task Assigned Notification | Task created | Real-time | MGR-017 (missing) |
| Plan Approval Notification | Plan approved | Real-time | EXEC-011B |
| Intervention Check | Cron job | Daily 8 AM | MGR-026 |
| Weekly Digest | Cron job | Monday 9 AM | All users |
| Deadline Reminders | Cron job | Daily 9 AM | EMP-013 |
| Goal Achieved | Progress >= 100% | Real-time | Auto-trigger |
| Monthly Cleanup | Cron job | 1st of month | System maintenance |

---

## 🔗 RELATED DOCUMENTATION

- [SYSTEM_DEPENDENCY_AUDIT.md](./SYSTEM_DEPENDENCY_AUDIT.md) - Gap analysis
- [CASCADE_DELETE_POLICY.md](./CASCADE_DELETE_POLICY.md) - Deletion rules
- [MVP_USER_STORIES.md](./01_MVP/MVP_USER_STORIES.md) - User stories

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Status**: ✅ Ready for implementation
