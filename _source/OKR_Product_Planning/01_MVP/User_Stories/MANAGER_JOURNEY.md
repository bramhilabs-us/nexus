# 👔 MANAGER JOURNEY - Team Performance & Execution Management

**Version**: 2.0.0
**Created**: 2025-10-22
**Updated**: 2025-10-24
**Persona**: Manager / Team Leader
**Primary Goals**: Align team with objectives, assess capabilities, monitor progress, intervene when needed

---

## 📊 JOURNEY OVERVIEW

**North Star**: Assessment → Team Building → Goal Assignment → Daily Execution → Performance Monitoring

**Frequency**: Quarterly planning + Weekly reviews + Daily monitoring
**Key Screens**: Team Management, Assessment Hub, Planning, Dashboard, Objectives
**Critical Story**: **MGR-017**: Create Tasks from Goals (Week 7)

### Technical Architecture Alignment

**Primary Blocks Used**:
- **Block 1**: Core Team Management (Required)
- **Block 3**: Goal Setting & Cascading
- **Block 4**: Weekly/Daily Execution
- **Block 5**: Automated Progress Tracking

**Backend Engines**:
- **Planner Engine**: Goal breakdown and task creation
- **Assessment Engine**: Team capability analysis
- **Tracking Engine**: Progress monitoring and alerts
- **Observer Engine**: Activity logging and intervention triggers
- **Scoring Engine**: Team performance metrics

---

## 🗺️ END-TO-END JOURNEY WITH TECHNICAL INTEGRATION

### PHASE 1: TEAM ASSESSMENT (Week 1-4)

#### Step 1: Send Team Assessment Invitation
- **Story**: MGR-001: Send Team Assessment Invitation
- **Screen**: `assessment-hub.html` → "Send Invitation" button
- **API Endpoint**: `POST /api/assessments/invitations`
- **Request**:
  ```json
  {
    "template_id": "ssi_v4",
    "team_id": "team_123",
    "member_emails": ["john@company.com", "sarah@company.com"],
    "due_date": "2025-10-31",
    "manager_id": "mgr_456"
  }
  ```
- **Backend Flow**:
  1. Assessment Engine validates template exists
  2. IAM Engine verifies manager permissions
  3. Observer Engine logs invitation event
  4. Notification service sends emails
- **Data Models**: `Assessment`, `User`, `Team`, `Notification`
- **Outcome**: 7 team members receive email invitations

#### Step 2: Track Team Assessment Progress
- **Story**: MGR-002: View Team Assessment Progress
- **Screen**: `assessment-hub.html` → "Assigned" tab
- **API Endpoint**: `GET /api/assessments/team/{team_id}/progress`
- **Response**:
  ```json
  {
    "total_members": 7,
    "completed": 5,
    "pending": ["user_789", "user_012"],
    "completion_rate": 71.4,
    "avg_completion_time": "18 minutes"
  }
  ```
- **Backend Flow**:
  1. Assessment Engine queries completion status
  2. Real-time updates via WebSocket
  3. Cache results in Redis for performance
- **Data Models**: `AssessmentResponse`, `User`, `Progress`
- **Outcome**: Real-time tracking of team participation

#### Step 3: Review Team SSI Results
- **Story**: MGR-003: View Team SSI Results
- **Screen**: `assessment-results.html` (team view)
- **API Endpoint**: `GET /api/assessments/team/{team_id}/results`
- **Response**:
  ```json
  {
    "team_scores": {
      "speed": 7.2,
      "strength": 5.5,
      "intelligence": 8.1
    },
    "company_avg": {
      "speed": 7.0,
      "strength": 7.2,
      "intelligence": 7.5
    },
    "recommendations": ["Focus on Financial Strength training"],
    "individual_scores": [...]
  }
  ```
- **Backend Flow**:
  1. Scoring Engine calculates aggregated scores
  2. Compare with company benchmarks
  3. Generate AI recommendations (if iBrain enabled)
- **Data Models**: `AssessmentResult`, `TeamMetrics`, `Benchmark`
- **Outcome**: Understand team capabilities and gaps

#### Step 4: View Team Assessment Health (NEW)
- **Story**: **MGR-025**: View Team Assessment Health ⭐ NEW
- **Screen**: `05_team.html` → "Assessment Health" tab
- **API Endpoint**: `GET /api/teams/{team_id}/health-analytics`
- **Response**:
  ```json
  {
    "radar_chart_data": {...},
    "sub_dimensions": {
      "speed": {
        "decision_making": 7.5,
        "execution": 6.9
      }
    },
    "ai_recommendations": [
      "Consider financial training program",
      "Pair weak members with strong performers"
    ],
    "risk_areas": ["financial_strength", "resource_management"]
  }
  ```
- **Backend Flow**:
  1. Assessment Engine deep-dives into sub-dimensions
  2. Scoring Engine generates comparative analytics
  3. iBrain provides predictive insights (if enabled)
  4. Export service generates PDF reports
- **Data Models**: `TeamHealth`, `SubDimension`, `AIRecommendation`
- **Outcome**: Data-driven insights for team development

---

### PHASE 2: TEAM STRUCTURE (Week 5)

#### Step 5: Create New Team
- **Story**: MGR-004: Create New Team
- **Screen**: `05_team.html` → "Create Team" button
- **API Endpoint**: `POST /api/teams`
- **Request**:
  ```json
  {
    "name": "Engineering",
    "department": "Product",
    "manager_id": "mgr_456",
    "description": "Core product engineering team",
    "parent_team_id": null
  }
  ```
- **Backend Flow**:
  1. IAM Engine validates manager permissions
  2. Create team in database with unique ID
  3. Observer Engine logs team creation
  4. Update organizational hierarchy
- **Data Models**: `Team`, `User`, `Company`
- **Outcome**: Team created, appears in team list

#### Step 6: Add Team Members
- **Story**: MGR-005: Add Team Members
- **Screen**: `05_team.html` → Team detail → "Add Members" button
- **API Endpoint**: `POST /api/teams/{team_id}/members`
- **Request**:
  ```json
  {
    "members": [
      {"user_id": "usr_123", "role": "EMPLOYEE"},
      {"user_id": "usr_456", "role": "EMPLOYEE"},
      {"user_id": "usr_789", "role": "TEAM_LEAD"}
    ]
  }
  ```
- **Backend Flow**:
  1. IAM Engine validates each user exists
  2. Check for circular dependencies
  3. Update team roster
  4. Trigger notifications to new members
- **Data Models**: `TeamMember`, `User`, `Role`
- **Outcome**: 4 members added to team roster

---

### PHASE 3: OBJECTIVES REVIEW (Week 5)

#### Step 9: View Team Objectives
- **Story**: EMP-004: View My Objectives (accessible to Manager)
- **Screen**: `03_objectives.html` → "Team Objectives" tab
- **API Endpoint**: `GET /api/teams/{team_id}/objectives`
- **Response**:
  ```json
  {
    "objectives": [
      {
        "id": "obj_001",
        "title": "Improve product reliability",
        "progress": 65,
        "status": "on_track",
        "key_results": [...],
        "owner": "team_123"
      }
    ],
    "rollup_progress": 68,
    "at_risk_count": 1
  }
  ```
- **Backend Flow**:
  1. Planner Engine fetches team objectives
  2. Tracking Engine calculates real-time progress
  3. Scoring Engine determines status (green/yellow/red)
- **Data Models**: `Objective`, `KeyResult`, `Progress`
- **Outcome**: Understand what team needs to achieve

---

### PHASE 4: QUARTERLY PLANNING (Week 9)

#### Step 11: Create Quarterly Plans
- **Story**: MGR-021: Create Quarterly Plans
- **Screen**: `06_planning.html`
- **API Endpoint**: `POST /api/planning/quarterly`
- **Request**:
  ```json
  {
    "quarter": "Q1_2026",
    "team_id": "team_123",
    "goals": [
      {
        "title": "Complete 50 bug fixes",
        "target_metric": 50,
        "linked_objective": "obj_001",
        "estimated_hours": 480
      }
    ],
    "capacity": {
      "total_hours": 480,
      "allocation": {
        "bug_fixes": 60,
        "features": 30,
        "meetings": 10
      }
    }
  }
  ```
- **Backend Flow**:
  1. Planner Engine creates quarterly plan
  2. Validate capacity against team size
  3. Link to company objectives
  4. Set status to "draft"
- **Data Models**: `QuarterlyPlan`, `Goal`, `CapacityPlan`
- **Outcome**: Quarterly plan drafted

#### Step 12: Allocate Weekly Goals
- **Story**: MGR-022: Allocate Weekly Goals
- **Screen**: `06_planning.html` → Weekly breakdown
- **API Endpoint**: `POST /api/planning/weekly-breakdown`
- **Request**:
  ```json
  {
    "quarterly_goal_id": "goal_q1_001",
    "weekly_distribution": [
      {"week": 1, "target": 5},
      {"week": 2, "target": 4},
      {"week": 3, "target": 5}
    ]
  }
  ```
- **Backend Flow**:
  1. Planner Engine breaks down quarterly goals
  2. Create weekly goal records
  3. Validate sum equals quarterly target
  4. Set up tracking milestones
- **Data Models**: `WeeklyGoal`, `Goal`, `Milestone`
- **Outcome**: Weekly execution plan created

---

### PHASE 5: GOAL EXECUTION (Week 7-8)

#### Step 17: Create Tasks from Goals (CRITICAL)
- **Story**: **MGR-017**: Create Tasks from Goals
- **Screen**: `06_planning.html` → Goal detail → "Create Tasks" button
- **API Endpoint**: `POST /api/goals/{goal_id}/tasks`
- **Request**:
  ```json
  {
    "goal_id": "goal_week_001",
    "tasks": [
      {
        "title": "Fix payment gateway bug",
        "assignee": "usr_123",
        "estimated_hours": 6,
        "priority": "high",
        "due_date": "2025-10-25"
      }
    ]
  }
  ```
- **Backend Flow**:
  1. Planner Engine creates task records
  2. Establish lineage: Task → Goal → KR → Objective
  3. Observer Engine tracks task creation
  4. Notify assignees
- **Data Models**: `Task`, `Goal`, `TaskLineage`
- **Full Lineage Chain**:
  ```
  Assessment → Objective → Key Result → Goal → Task
  ```
- **Outcome**: Tasks created with complete lineage tracking

---

### PHASE 6: DAILY MONITORING (Week 8)

#### Step 21: Receive At-Risk Alerts (NEW)
- **Story**: **MGR-026**: Intervention Workflow (Automated Alerts)
- **Screen**: `02_dashboard.html` → Notification badge
- **WebSocket Event**: `team.member.at_risk`
- **Alert Trigger Logic**:
  ```javascript
  if (overdue_tasks > 3 ||
      completion_rate < 50% ||
      days_inactive > 3) {
    trigger_alert()
  }
  ```
- **Backend Flow**:
  1. Observer Engine monitors task status (every 30 mins)
  2. Tracking Engine identifies at-risk patterns
  3. Generate alert with context
  4. Push notification to manager
- **Data Models**: `Alert`, `RiskMetric`, `Intervention`
- **Outcome**: Proactive alert before failures

#### Step 22: Intervene on At-Risk Member
- **Story**: **MGR-026**: Intervention Workflow (continued)
- **Screen**: `intervention-center.html` modal
- **API Endpoint**: `POST /api/interventions`
- **Request**:
  ```json
  {
    "target_user": "usr_123",
    "alert_id": "alert_789",
    "action": "reassign_tasks",
    "tasks_to_reassign": ["task_001", "task_002"],
    "new_assignee": "usr_456",
    "manager_note": "Discussed with John - personal issue"
  }
  ```
- **Backend Flow**:
  1. Planner Engine reassigns tasks
  2. Update task ownership and deadlines
  3. Observer Engine logs intervention
  4. Notify affected team members
- **Data Models**: `Intervention`, `Task`, `InterventionLog`
- **Outcome**: Timely intervention, team member supported

---

### PHASE 7: PROGRESS TRACKING (Week 7-8)

#### Step 24: Track Goal Progress
- **Story**: MGR-019: Track Goal Progress
- **Screen**: `06_planning.html` or `03_objectives.html`
- **API Endpoint**: `GET /api/goals/{goal_id}/progress`
- **Response**:
  ```json
  {
    "goal_id": "goal_week_001",
    "target": 5,
    "completed": 4,
    "progress_percentage": 80,
    "task_breakdown": {
      "total": 5,
      "done": 4,
      "in_progress": 1,
      "blocked": 0
    },
    "projected_completion": "on_track"
  }
  ```
- **Backend Flow**:
  1. Tracking Engine aggregates task status
  2. Calculate progress percentage
  3. Predict completion based on velocity
  4. Update parent goal progress
- **Data Models**: `Goal`, `Progress`, `Task`
- **Automatic Rollup**:
  ```
  Tasks (80%) → Goal (80%) → KR (75%) → Objective (70%)
  ```
- **Outcome**: Real-time visibility into goal achievement

---

### PHASE 8: REPORTING (Week 11 BETA)

#### Step 26: Generate Weekly Roll-up Report (BETA)
- **Story**: **MGR-027**: Weekly Roll-up Report
- **Screen**: `02_dashboard.html` → "Generate Report" button
- **API Endpoint**: `POST /api/reports/weekly-rollup`
- **Request**:
  ```json
  {
    "team_id": "team_123",
    "week_start": "2025-10-21",
    "week_end": "2025-10-25",
    "include_sections": ["tasks", "goals", "blockers", "highlights"],
    "format": "pdf",
    "recipients": ["exec@company.com"]
  }
  ```
- **Backend Flow**:
  1. Tracking Engine aggregates week's data
  2. Scoring Engine calculates performance metrics
  3. Generate report with charts and insights
  4. Email service sends to stakeholders
- **Data Models**: `Report`, `WeeklyMetrics`, `TeamPerformance`
- **Report Sections**:
  - Task completion rate with trend
  - Goal achievement status
  - Team member highlights
  - Blockers and interventions
  - Next week preview
- **Outcome**: Automated weekly report for stakeholders

---

## 🔗 COMPLETE LINEAGE TRACKING

**Full Data Flow Chain**:
```
Assessment (Team Capability Analysis)
    ↓ [Assessment Engine]
Company OKR (Strategic Objective)
    ↓ [Planner Engine]
Team Objective (Cascaded Goal)
    ↓ [Planner Engine]
Key Result (Measurable Target)
    ↓ [Planner Engine]
Quarterly Goal (Manager Created)
    ↓ [Planner Engine]
Weekly Goal (Broken Down)
    ↓ [Planner Engine]
Task (Assigned to Team Member)
    ↓ [Tracking Engine]
Progress Update (Real-time)
    ↓ [Tracking Engine]
Automatic Rollup (All Levels)
```

**Manager's Technical Touch Points**:
1. **Create**: Goals and tasks via Planner Engine
2. **Assign**: Tasks to team members with IAM validation
3. **Monitor**: Progress via Tracking Engine dashboards
4. **Intervene**: Using Observer Engine alerts
5. **Report**: Automated via Scoring Engine

---

## 🚨 CRITICAL TECHNICAL INTEGRATIONS

### Real-time Updates (WebSocket)
```javascript
// Manager subscribes to team updates
socket.on('team.task.updated', (data) => {
  updateDashboard(data);
});

socket.on('team.member.at_risk', (alert) => {
  showInterventionAlert(alert);
});
```

### Automated Alert Rules (Observer Engine)
```sql
-- Trigger alert when member has too many overdue tasks
SELECT user_id, COUNT(*) as overdue_count
FROM tasks
WHERE status != 'completed'
  AND due_date < NOW()
  AND team_id = ?
GROUP BY user_id
HAVING overdue_count > 3;
```

### Progress Rollup (Tracking Engine)
```javascript
// Automatic progress calculation
async function rollupProgress(taskId) {
  const task = await getTask(taskId);
  const goal = await getGoal(task.goal_id);
  const keyResult = await getKeyResult(goal.kr_id);
  const objective = await getObjective(keyResult.obj_id);

  // Update each level
  await updateGoalProgress(goal);
  await updateKRProgress(keyResult);
  await updateObjectiveProgress(objective);
}
```

---

## 📊 USER STORIES BY WEEK WITH TECHNICAL COMPLEXITY

### Week 1-4: Assessment System
- ✅ MGR-001: Send Team Assessment Invitation [API: Medium]
- ✅ MGR-002: View Team Assessment Progress [API: Low]
- ✅ MGR-003: View Team SSI Results [API: High - aggregation]

### Week 5: Teams + Objectives
- ⬜ MGR-004: Create New Team [API: Low]
- ⬜ MGR-005: Add Team Members [API: Medium - validation]
- ⬜ MGR-006: View Team List [API: Low]
- ⬜ MGR-007: Remove Team Member [API: Medium - cascade]
- ⬜ MGR-008: Track Objective Progress [API: High - real-time]

### Week 6: Profile + Health
- ⬜ MGR-010: View Team Member Profiles [API: Low]
- ⬜ MGR-011: Update Profile Info [API: Low]
- ⬜ **MGR-025: View Team Assessment Health** [API: High - analytics]

### Week 7: Goal Management
- ⬜ MGR-015: Assign Goals to Team [API: Medium]
- ⬜ MGR-016: Create Team Goals [API: Medium]
- ⬜ **MGR-017: Create Tasks from Goals** [API: High - lineage]
- ⬜ MGR-018: Link Tasks to Goals [API: Medium]
- ⬜ MGR-019: Track Goal Progress [API: High - rollup]
- ⬜ MGR-020: Update Goal Status [API: Medium]

### Week 8: Dashboard
- ⬜ MGR-012: View Team Dashboard [API: High - aggregation]
- ⬜ MGR-013: Monitor Team Tasks [API: Medium]
- ⬜ MGR-014: Task Notifications [WebSocket: High]
- ⬜ **MGR-026: Intervention Workflow** [API: High - complex logic]

### Week 9: Planning
- ⬜ MGR-021: Create Quarterly Plans [API: High]
- ⬜ MGR-022: Allocate Weekly Goals [API: Medium]
- ⬜ MGR-023: Assign Team Capacity [API: High - calculation]
- ⬜ MGR-024: Review Team Planning [API: Low]

### Week 11: Reporting (BETA)
- ⬜ **MGR-027: Weekly Roll-up Report** [API: High - reporting engine]

**Total Manager Stories**: 27 (3 complete, 24 not started)
**Technical Complexity**: 11 High, 10 Medium, 6 Low

---

## 🔧 TECHNICAL REQUIREMENTS

### Performance Requirements
- Team dashboard load: < 2 seconds
- Real-time updates: < 500ms latency
- Alert generation: Within 5 minutes of trigger
- Report generation: < 10 seconds

### Data Requirements
- Support teams up to 50 members
- Handle 1000+ tasks per team
- Store 2 years of historical data
- Real-time sync across all team members

### Integration Points
- Email service for notifications
- Calendar API for meeting scheduling
- Export service for PDF reports
- WebSocket for real-time updates
- Redis for caching team metrics

---

## 🔗 RELATED DOCUMENTATION

- [MVP_TECHNICAL_ARCHITECTURE_V5.md](../../KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/MVP_TECHNICAL_ARCHITECTURE_V5.md)
- [MASTER_DEV_LIST_V5.md](../../KARVIA_STRATEGY/03_DEVELOPMENT_ROADMAP/MASTER_DEV_LIST_V5.md)
- [Backend Microservices Design](../../backend_design.md)
- [API Documentation](../../api_docs.md)

---

**Version**: 2.0.0
**Last Updated**: 2025-10-24
**Status**: ✅ Technical Architecture Added - Ready for implementation