# 🗑️ CASCADE DELETE & DATA RETENTION POLICY

**Version**: 1.0.0
**Created**: 2025-10-22
**Purpose**: Define what happens when entities are deleted (prevent data loss, maintain lineage integrity)

---

## 📋 EXECUTIVE SUMMARY

**Policy**: **Soft delete by default, hard constraints on critical lineage**

**Critical Rule**: Cannot delete any entity that has dependencies (derived data). Must use soft delete (is_active = false) to preserve historical records and lineage chains.

---

## 🎯 DELETION HIERARCHY

```
Assessment (Root)
    ↓ Generates
Objectives + Key Results
    ↓ Break down into
Quarterly Goals
    ↓ Break down into
Weekly Goals
    ↓ Break down into
Tasks

RULE: Cannot delete parent if children exist
```

---

## 🔒 ENTITY-BY-ENTITY DELETION RULES

### **1. ASSESSMENTS**

**Delete Scenarios**:
- ✅ **Can delete**: Assessment with no generated OKRs
- ❌ **Cannot delete**: Assessment that generated 1+ OKRs

**Implementation**:
```javascript
// Before delete check
assessmentRouter.delete('/:id', async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);

  // Check for derived OKRs
  const derivedObjectives = await Objective.countDocuments({
    'lineage.assessment_id': assessment._id
  });

  if (derivedObjectives > 0) {
    return res.status(403).json({
      error: 'Cannot delete assessment',
      reason: `${derivedObjectives} objectives were generated from this assessment`,
      suggestion: 'Use soft delete (deactivate) instead'
    });
  }

  // Safe to delete
  await Assessment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

**Soft Delete Alternative**:
```javascript
// Soft delete (recommended)
await Assessment.findByIdAndUpdate(req.params.id, {
  is_active: false,
  deactivated_at: new Date(),
  deactivated_by: req.user._id
});
```

**User Notification**:
> "This assessment cannot be deleted because 15 company objectives were generated from it. Would you like to archive it instead?"

---

### **2. OBJECTIVES**

**Delete Scenarios**:
- ✅ **Can delete**: Objective with no goals, no key results
- ❌ **Cannot delete**: Objective with 1+ quarterly goals linked
- ❌ **Cannot delete**: Objective with key results that have progress >0%

**Implementation**:
```javascript
objectiveRouter.delete('/:id', async (req, res) => {
  const objective = await Objective.findById(req.params.id);

  // Check for linked goals
  const linkedGoals = await Goal.countDocuments({
    'lineage.objective_id': objective._id
  });

  if (linkedGoals > 0) {
    return res.status(403).json({
      error: 'Cannot delete objective',
      reason: `${linkedGoals} goals are linked to this objective`,
      suggestion: 'Delete or unlink goals first, or use archive'
    });
  }

  // Check for key results with progress
  const keyResultsWithProgress = objective.key_results.filter(kr => kr.progress > 0);

  if (keyResultsWithProgress.length > 0) {
    return res.status(403).json({
      error: 'Cannot delete objective',
      reason: `${keyResultsWithProgress.length} key results have progress`,
      suggestion: 'This would cause data loss. Use archive instead.'
    });
  }

  // Safe to delete
  await Objective.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

**Soft Delete (Archive)**:
```javascript
await Objective.findByIdAndUpdate(req.params.id, {
  status: 'archived',
  archived_at: new Date(),
  archived_by: req.user._id
});
```

**Cascade Option** (if user explicitly confirms):
```javascript
// DANGEROUS: Only if user confirms "Delete all 50 goals and 200 tasks"
if (req.body.confirm_cascade === true) {
  // Delete all derived data
  const goals = await Goal.find({ 'lineage.objective_id': objective._id });

  for (const goal of goals) {
    await Task.deleteMany({ 'lineage.quarterly_goal_id': goal._id });
  }

  await Goal.deleteMany({ 'lineage.objective_id': objective._id });
  await Objective.findByIdAndDelete(req.params.id);

  // Log cascade delete
  await AuditLog.create({
    action: 'cascade_delete',
    entity: 'objective',
    entity_id: objective._id,
    deleted_count: {
      goals: goals.length,
      tasks: taskCount
    },
    user_id: req.user._id
  });
}
```

---

### **3. KEY RESULTS**

**Delete Scenarios**:
- ✅ **Can delete**: KR with no goals linked, no progress
- ❌ **Cannot delete**: KR with 1+ quarterly goals linked
- ❌ **Cannot delete**: KR with progress >0%

**Implementation**:
```javascript
// KR is nested in Objective model
objectiveRouter.delete('/:objectiveId/key-results/:krId', async (req, res) => {
  const objective = await Objective.findById(req.params.objectiveId);
  const kr = objective.key_results.id(req.params.krId);

  // Check for linked goals
  const linkedGoals = await Goal.countDocuments({
    'lineage.key_result_id': kr._id
  });

  if (linkedGoals > 0) {
    return res.status(403).json({
      error: 'Cannot delete key result',
      reason: `${linkedGoals} goals are tracking this KR`
    });
  }

  if (kr.progress > 0) {
    return res.status(403).json({
      error: 'Cannot delete key result',
      reason: 'Key result has recorded progress'
    });
  }

  // Safe to delete
  objective.key_results.pull(kr._id);
  await objective.save();
  res.json({ success: true });
});
```

---

### **4. GOALS (Quarterly & Weekly)**

**Delete Scenarios**:
- ✅ **Can delete**: Goal with no tasks linked
- ❌ **Cannot delete**: Goal with 1+ tasks linked
- ⚠️ **Soft delete recommended**: If goal has ANY progress or historical data

**Implementation**:
```javascript
goalRouter.delete('/:id', async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  // Check for linked tasks
  const linkedTasks = await Task.countDocuments({
    'lineage.weekly_goal_id': goal._id
  });

  if (linkedTasks > 0) {
    return res.status(403).json({
      error: 'Cannot delete goal',
      reason: `${linkedTasks} tasks are linked to this goal`,
      suggestion: 'Delete tasks first or use archive'
    });
  }

  // Warn if progress exists
  if (goal.progress > 0) {
    return res.status(403).json({
      error: 'Cannot delete goal',
      reason: 'Goal has recorded progress',
      suggestion: 'Use archive to preserve historical data'
    });
  }

  // Safe to delete
  await Goal.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

**Soft Delete**:
```javascript
await Goal.findByIdAndUpdate(req.params.id, {
  status: 'archived',
  archived_at: new Date()
});
```

---

### **5. TASKS**

**Delete Scenarios**:
- ✅ **Can delete**: Any task (orphan from goal, mark as deleted)
- ⚠️ **Caution**: If task is completed, archiving is better (preserve historical data)

**Implementation**:
```javascript
taskRouter.delete('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);

  // Warn if task is completed
  if (task.status === 'completed') {
    return res.status(400).json({
      warning: 'Deleting completed task',
      reason: 'This will affect progress calculations',
      suggestion: 'Use archive instead',
      force_delete: 'Add ?force=true to confirm'
    });
  }

  // If linked to goal, recalculate goal progress after delete
  if (task.lineage.weekly_goal_id) {
    await recalculateGoalProgress(task.lineage.weekly_goal_id);
  }

  // Delete
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

**Soft Delete** (recommended for completed tasks):
```javascript
await Task.findByIdAndUpdate(req.params.id, {
  is_active: false,
  deleted_at: new Date(),
  deleted_by: req.user._id
});

// Recalculate goal progress (exclude inactive tasks)
await recalculateGoalProgress(task.lineage.weekly_goal_id);
```

---

### **6. TEAMS**

**Delete Scenarios**:
- ✅ **Can delete**: Empty team (no members, no active goals)
- ❌ **Cannot delete**: Team with active members
- ❌ **Cannot delete**: Team with active goals/tasks
- ⚠️ **Always soft delete**: To preserve historical data

**Implementation**:
```javascript
teamRouter.delete('/:id', async (req, res) => {
  const team = await Team.findById(req.params.id);

  // Check for active members
  if (team.members.length > 0) {
    return res.status(403).json({
      error: 'Cannot delete team',
      reason: `Team has ${team.members.length} active members`,
      suggestion: 'Remove all members first or deactivate team'
    });
  }

  // Check for active goals
  const activeGoals = await Goal.countDocuments({
    team_id: team._id,
    status: { $ne: 'archived' }
  });

  if (activeGoals > 0) {
    return res.status(403).json({
      error: 'Cannot delete team',
      reason: `Team has ${activeGoals} active goals`,
      suggestion: 'Archive or complete goals first'
    });
  }

  // NEVER hard delete teams - always soft delete
  await Team.findByIdAndUpdate(req.params.id, {
    is_active: false,
    deactivated_at: new Date(),
    deactivated_by: req.user._id
  });

  res.json({ success: true, message: 'Team deactivated' });
});
```

**User Removal from Team** (MGR-007):
```javascript
// When removing team member
teamRouter.delete('/:teamId/members/:userId', async (req, res) => {
  const team = await Team.findById(req.params.teamId);

  // Remove from team.members array
  team.members = team.members.filter(m => m.user_id.toString() !== req.params.userId);
  await team.save();

  // Reassign or mark as unassigned
  await Goal.updateMany(
    { team_id: team._id, assigned_to: req.params.userId },
    { assigned_to: null, status: 'unassigned' }
  );

  await Task.updateMany(
    { assigned_to: req.params.userId, team_id: team._id },
    { assigned_to: team.manager_id, reassigned_reason: 'Member removed from team' }
  );

  res.json({ success: true });
});
```

---

### **7. USERS**

**Delete Scenarios**:
- ❌ **NEVER hard delete users**: Always use deactivation
- ✅ **Deactivate**: User account (preserve all historical data)

**Implementation**:
```javascript
userRouter.delete('/:id', async (req, res) => {
  // NEVER hard delete users
  const user = await User.findById(req.params.id);

  // Soft delete (deactivate)
  user.is_active = false;
  user.deactivated_at = new Date();
  user.deactivated_by = req.user._id;
  user.email = `${user.email}.deactivated_${Date.now()}`; // Prevent email conflicts
  await user.save();

  // Revoke all sessions
  await Session.deleteMany({ user_id: user._id });

  // Reassign active tasks
  await Task.updateMany(
    { assigned_to: user._id, status: { $ne: 'completed' } },
    { assigned_to: null, status: 'unassigned', notes: 'User deactivated' }
  );

  // Remove from teams
  await Team.updateMany(
    { 'members.user_id': user._id },
    { $pull: { members: { user_id: user._id } } }
  );

  res.json({ success: true, message: 'User deactivated' });
});
```

**User Offboarding Checklist**:
1. ✅ Deactivate user account (is_active = false)
2. ✅ Revoke all sessions (force logout)
3. ✅ Reassign active tasks to manager
4. ✅ Remove from all teams
5. ✅ Preserve all historical data (assessments, completed tasks, etc.)

---

### **8. ASSESSMENT TEMPLATES**

**Delete Scenarios**:
- ✅ **Can delete**: Template with no assessments created from it
- ❌ **Cannot delete**: Template used in 1+ assessments

**Implementation**:
```javascript
templateRouter.delete('/:id', async (req, res) => {
  const template = await AssessmentTemplate.findById(req.params.id);

  // Check usage
  const usageCount = await Assessment.countDocuments({
    template_id: template._id
  });

  if (usageCount > 0) {
    return res.status(403).json({
      error: 'Cannot delete template',
      reason: `Template has been used ${usageCount} times`,
      suggestion: 'Deactivate template instead'
    });
  }

  // Safe to delete
  await AssessmentTemplate.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
```

**Soft Delete**:
```javascript
await AssessmentTemplate.findByIdAndUpdate(req.params.id, {
  is_active: false,
  deactivated_at: new Date()
});
```

---

### **9. QUARTERLY PLANS**

**Delete Scenarios**:
- ✅ **Can delete**: Draft plans (not submitted)
- ❌ **Cannot delete**: Approved plans
- ⚠️ **Soft delete**: Plans pending approval or with changes requested

**Implementation**:
```javascript
planRouter.delete('/:id', async (req, res) => {
  const plan = await QuarterlyPlan.findById(req.params.id);

  // Cannot delete approved plans
  if (plan.status === 'approved') {
    return res.status(403).json({
      error: 'Cannot delete approved plan',
      reason: 'Approved plans must be archived, not deleted',
      suggestion: 'Archive plan instead'
    });
  }

  // Can delete draft plans
  if (plan.status === 'draft') {
    await QuarterlyPlan.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  }

  // Soft delete for pending/changes_requested
  await QuarterlyPlan.findByIdAndUpdate(req.params.id, {
    status: 'archived',
    archived_at: new Date()
  });

  res.json({ success: true, message: 'Plan archived' });
});
```

---

## 📊 DELETION POLICY MATRIX

| Entity | Can Hard Delete? | Requires Confirmation? | Soft Delete Recommended? |
|--------|------------------|------------------------|--------------------------|
| Assessment | ✅ If no OKRs | ✅ Yes | ✅ Always |
| Objective | ✅ If no goals | ✅ Yes | ✅ If progress exists |
| Key Result | ✅ If no goals | ✅ Yes | ✅ If progress exists |
| Goal (Quarterly/Weekly) | ✅ If no tasks | ✅ Yes | ✅ If progress exists |
| Task | ✅ Always | ⚠️ If completed | ✅ If completed |
| Team | ❌ Never | N/A | ✅ Always |
| User | ❌ Never | N/A | ✅ Always (deactivate) |
| Template | ✅ If unused | ✅ Yes | ✅ If widely used |
| Quarterly Plan | ✅ If draft | ⚠️ If pending | ✅ If approved |

---

## 🔄 PROGRESS RECALCULATION AFTER DELETE

When entities are deleted, progress must be recalculated up the chain:

### **Task Deleted**:
```javascript
async function recalculateAfterTaskDelete(taskId) {
  const task = await Task.findById(taskId);

  if (task.lineage.weekly_goal_id) {
    // Recalculate weekly goal progress
    const weeklyGoal = await Goal.findById(task.lineage.weekly_goal_id);
    const remainingTasks = await Task.find({
      'lineage.weekly_goal_id': weeklyGoal._id,
      is_active: true // Exclude deleted tasks
    });

    const completedTasks = remainingTasks.filter(t => t.status === 'completed');
    weeklyGoal.progress = (completedTasks.length / remainingTasks.length) * 100;
    await weeklyGoal.save();

    // Cascade to quarterly goal
    if (task.lineage.quarterly_goal_id) {
      await recalculateQuarterlyGoalProgress(task.lineage.quarterly_goal_id);
    }
  }
}
```

---

## 🚨 SPECIAL CASES

### **Case 1: Manager Leaves Company**
**Scenario**: Manager deactivated, team has 10 active goals, 50 active tasks

**Action**:
1. ✅ Assign new manager to team (Admin/Executive action)
2. ✅ Reassign all goals to new manager
3. ✅ Tasks stay with employees (not reassigned)
4. ✅ Preserve historical data (old manager's name in audit logs)

### **Case 2: Assessment Deleted (Force)**
**Scenario**: Executive wants to delete assessment that generated 20 OKRs

**Action**:
1. ❌ PREVENT hard delete
2. ✅ Offer soft delete (archive assessment)
3. ⚠️ If exec insists, show cascade impact:
   - "This will delete 20 objectives, 80 goals, 300 tasks"
   - Require written confirmation
   - Create full backup before cascade delete
   - Log action in audit trail

### **Case 3: Team Merge**
**Scenario**: Team A and Team B merge into Team C

**Action**:
1. ✅ Create new Team C
2. ✅ Move all members from A & B to C
3. ✅ Reassign all goals/tasks to Team C
4. ✅ Soft delete Team A and Team B (preserve history)

---

## 🔗 RELATED DOCUMENTATION

- [SYSTEM_DEPENDENCY_AUDIT.md](./SYSTEM_DEPENDENCY_AUDIT.md) - Dependency gaps
- [PERMISSION_MATRIX.md](./PERMISSION_MATRIX.md) - Who can delete what
- [BACKEND_AUTOMATION_SPECS.md](./BACKEND_AUTOMATION_SPECS.md) - Auto-calculations

---

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Status**: ✅ Ready for implementation
