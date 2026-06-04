# 🎯 EXECUTIVE JOURNEY - Assessment-Driven OKR Management

**Version**: 2.0.0
**Created**: 2025-10-22
**Updated**: 2025-10-24
**Persona**: Executive / Business Owner
**Primary Goals**: Strategic planning, organization visibility, data-driven decisions

---

## 📊 JOURNEY OVERVIEW

**North Star**: Assessment → AI-Generated OKRs → Team Execution → Progress Monitoring

**Frequency**: Quarterly planning + Daily monitoring
**Key Screens**: Assessment Hub, AI OKR Review, Objectives, Planning, Analytics
**Critical Story**: **EXEC-002**: Generate AI OKRs from Assessment (Week 4)

### Technical Architecture Alignment

**Primary Blocks Used**:
- **Block 1**: Core Management (Required)
- **Block 2**: Strategic Planning & OKRs
- **Block 6**: AI-Powered OKR Generation (iBrain)
- **Block 7**: Executive Analytics

**Backend Engines**:
- **Assessment Engine**: Company-wide assessment analysis
- **Planner Engine**: OKR creation and cascading
- **Scoring Engine**: Performance metrics and analytics
- **Tracking Engine**: Real-time progress monitoring
- **iBrain Integration**: AI-powered OKR generation from assessments

---

## 🗺️ END-TO-END JOURNEY WITH TECHNICAL INTEGRATION

### PHASE 1: STRATEGIC ASSESSMENT (Week 1-4)

**Entry Point**: Consultant sends assessment invitation OR Executive initiates assessment

#### Step 1: Receive Assessment Invitation
- **Story**: CONS-003: Send Assessment Invitation
- **Screen**: Email → Assessment link
- **API Flow**: Email service → Unique token generation
- **Technical Details**:
  - JWT token embedded in URL for authentication
  - Token expires after 7 days
  - One-time use validation
- **Outcome**: Directed to assessment taking page

#### Step 2: Complete Business Assessment
- **Story**: EXEC-001: View Company Assessment Results
- **Screen**: `assessment-take.html`
- **API Endpoint**: `POST /api/assessments/submit`
- **Request**:
  ```json
  {
    "assessment_id": "ssi_company_q4_2025",
    "user_id": "exec_001",
    "company_id": "company_123",
    "responses": [
      {"question_id": 1, "answer": 7},
      {"question_id": 2, "answer": 5}
    ],
    "completion_time": "18:32"
  }
  ```
- **Backend Flow**:
  1. Assessment Engine validates all questions answered
  2. Scoring Engine calculates SSI scores
  3. Store results in PostgreSQL
  4. Trigger AI OKR generation if configured
- **Data Models**: `Assessment`, `AssessmentResponse`, `SSIScore`
- **Outcome**: Assessment saved with calculated SSI scores

#### Step 3: Review Assessment Results
- **Story**: EXEC-001: View Company Assessment Results
- **Screen**: `assessment-results.html`
- **API Endpoint**: `GET /api/assessments/{assessment_id}/results`
- **Response**:
  ```json
  {
    "assessment_id": "ssi_company_q4_2025",
    "scores": {
      "speed": 7.2,
      "strength": 5.5,
      "intelligence": 8.1
    },
    "company_benchmark": {
      "speed": 7.5,
      "strength": 7.0,
      "intelligence": 7.8
    },
    "gaps": [
      {"dimension": "strength", "gap": -1.5, "priority": "high"}
    ],
    "ai_insights": "Financial strength significantly below benchmark"
  }
  ```
- **Backend Flow**:
  1. Scoring Engine retrieves results
  2. Compare with industry benchmarks
  3. Identify capability gaps
  4. Generate insights for OKR creation
- **Data Models**: `AssessmentResult`, `Benchmark`, `GapAnalysis`
- **Outcome**: Assessment results ready for OKR generation

#### Step 4: Generate AI-Powered OKRs
- **Story**: **EXEC-002**: Generate AI OKRs from Assessment
- **Screen**: `ai-okr-review.html`
- **API Endpoint**: `POST /api/okrs/generate-from-assessment`
- **Request**:
  ```json
  {
    "assessment_id": "ssi_company_q4_2025",
    "company_id": "company_123",
    "time_horizon": "yearly",
    "ai_model": "ibrain_v2"
  }
  ```
- **iBrain Integration**:
  ```json
  {
    "model": "okr-generator-v2",
    "input": {
      "ssi_scores": {"speed": 7.2, "strength": 5.5, "intelligence": 8.1},
      "gaps": ["financial_strength", "resource_utilization"],
      "industry": "technology",
      "company_size": "medium"
    },
    "output": {
      "objectives": [
        {
          "title": "Improve Financial Strength to Industry Standard",
          "key_results": [
            {"title": "Increase revenue by 40%", "target": 40, "unit": "percent"},
            {"title": "Reduce operational costs by 15%", "target": 15, "unit": "percent"},
            {"title": "Improve cash flow cycle to 30 days", "target": 30, "unit": "days"}
          ]
        }
      ]
    }
  }
  ```
- **Backend Flow**:
  1. Assessment Engine sends scores to iBrain
  2. iBrain analyzes gaps and generates OKRs
  3. Planner Engine validates OKR structure
  4. Store draft OKRs for review
- **Data Models**: `AIGeneratedOKR`, `Objective`, `KeyResult`
- **Outcome**: 3-5 AI-generated OKRs ready for review

#### Step 5: Approve or Edit AI OKRs
- **Story**: EXEC-002 (approval workflow)
- **Screen**: `ai-okr-review.html`
- **API Endpoint**: `PUT /api/okrs/{okr_id}/approve`
- **Request**:
  ```json
  {
    "okr_id": "okr_ai_001",
    "modifications": [
      {
        "objective_id": "obj_001",
        "title": "Achieve Financial Excellence",
        "approved": true
      }
    ],
    "approval_status": "approved",
    "approver_id": "exec_001"
  }
  ```
- **Backend Flow**:
  1. Planner Engine updates OKR status
  2. Create official objectives in database
  3. Set up tracking milestones
  4. Notify relevant teams
- **Data Models**: `Objective`, `KeyResult`, `ApprovalLog`
- **Outcome**: OKRs become active company objectives

---

### PHASE 2: TEAM STRUCTURE (Week 5-6)

#### Step 6: Review Team Structure
- **Story**: MGR-006: View Team List (accessible to Executive)
- **Screen**: `05_team.html`
- **API Endpoint**: `GET /api/teams?include=members,managers,metrics`
- **Response**:
  ```json
  {
    "teams": [
      {
        "id": "team_001",
        "name": "Engineering",
        "manager": "mgr_001",
        "member_count": 8,
        "health_score": 7.5,
        "objectives_assigned": 3,
        "progress": 68
      }
    ],
    "total_teams": 5,
    "total_employees": 42
  }
  ```
- **Backend Flow**:
  1. IAM Engine validates executive permissions
  2. Fetch all teams in organization
  3. Include performance metrics
  4. Calculate health scores
- **Data Models**: `Team`, `TeamMetrics`, `OrganizationStructure`
- **Outcome**: Complete visibility of org structure

#### Step 7: Monitor Team Assessment Health
- **Story**: **MGR-025**: View Team Assessment Health
- **Screen**: `05_team.html` → "Assessment Health" tab
- **API Endpoint**: `GET /api/analytics/team-health`
- **Response**:
  ```json
  {
    "team_health": [
      {
        "team": "Sales",
        "ssi_scores": {"speed": 6.5, "strength": 5.0, "intelligence": 7.0},
        "vs_company_avg": {"speed": -0.7, "strength": -2.2, "intelligence": -0.3},
        "risk_level": "high",
        "recommendations": [
          "Immediate financial training needed",
          "Consider adding senior financial analyst"
        ]
      }
    ],
    "at_risk_teams": 2,
    "healthy_teams": 3
  }
  ```
- **Backend Flow**:
  1. Assessment Engine aggregates team scores
  2. Scoring Engine compares with benchmarks
  3. AI generates recommendations
  4. Identify at-risk teams
- **Data Models**: `TeamHealth`, `RiskAssessment`, `AIRecommendation`
- **Outcome**: Identify teams needing intervention

---

### PHASE 3: OBJECTIVES VISIBILITY (Week 5 Day 4)

#### Step 8: View All Company Objectives
- **Story**: **EXEC-003**: View All Company Objectives
- **Screen**: `03_objectives.html`
- **API Endpoint**: `GET /api/objectives/company-wide`
- **Response**:
  ```json
  {
    "objectives": [
      {
        "id": "obj_001",
        "title": "Scale to 10,000 customers",
        "owner": "team_sales",
        "progress": 67,
        "status": "on_track",
        "key_results": [
          {"title": "Q1 Sales: 2500", "progress": 80},
          {"title": "Q2 Sales: 2500", "progress": 60}
        ],
        "child_goals": 12,
        "tasks": 145
      }
    ],
    "summary": {
      "total": 12,
      "on_track": 8,
      "at_risk": 3,
      "blocked": 1
    }
  }
  ```
- **Backend Flow**:
  1. Planner Engine fetches all objectives
  2. Tracking Engine calculates real-time progress
  3. Aggregate status across organization
  4. Include drill-down capability
- **Data Models**: `Objective`, `KeyResult`, `Progress`, `Status`
- **Outcome**: Complete OKR visibility

#### Step 9: Track Company Progress
- **Story**: EXEC-006: Track Company Progress
- **Screen**: `03_objectives.html` (expanded view)
- **API Endpoint**: `GET /api/objectives/{obj_id}/detailed-progress`
- **WebSocket**: `subscribe('objective.progress.{obj_id}')`
- **Real-time Updates**:
  ```javascript
  socket.on('objective.progress.updated', (data) => {
    // Real-time progress update
    updateProgressBar(data.objective_id, data.new_progress);
    showNotification(`${data.objective_title} updated to ${data.new_progress}%`);
  });
  ```
- **Backend Flow**:
  1. Tracking Engine monitors all changes
  2. Calculate rollup from tasks → goals → KRs → objectives
  3. Push updates via WebSocket
  4. Store progress history
- **Data Models**: `ProgressUpdate`, `ProgressHistory`, `Rollup`
- **Outcome**: Real-time progress monitoring

---

### PHASE 4: QUARTERLY PLANNING (Week 9)

#### Step 11: Break into Quarterly Goals
- **Story**: EXEC-013: Break into Quarterly Goals
- **Screen**: `06_planning.html` → Quarterly breakdown
- **API Endpoint**: `POST /api/planning/quarterly-breakdown`
- **Request**:
  ```json
  {
    "yearly_objective_id": "obj_001",
    "breakdown": [
      {"quarter": "Q1", "target": 25, "focus": "Foundation"},
      {"quarter": "Q2", "target": 25, "focus": "Growth"},
      {"quarter": "Q3", "target": 30, "focus": "Scale"},
      {"quarter": "Q4", "target": 20, "focus": "Optimize"}
    ]
  }
  ```
- **Backend Flow**:
  1. Planner Engine creates quarterly goals
  2. Validate targets sum to 100%
  3. Assign to relevant teams
  4. Set up tracking milestones
- **Data Models**: `QuarterlyGoal`, `Milestone`, `TeamAssignment`
- **Outcome**: Quarterly execution plan

#### Step 12: Review Manager Quarterly Plans
- **Story**: **EXEC-011B**: Approve Manager Quarterly Plans
- **Screen**: `planning-approval.html`
- **API Endpoint**: `GET /api/planning/pending-approvals`
- **Response**:
  ```json
  {
    "pending_plans": [
      {
        "plan_id": "plan_q1_eng",
        "team": "Engineering",
        "manager": "John Smith",
        "quarter": "Q1 2026",
        "goals": [
          {"title": "Complete 50 bug fixes", "hours": 480}
        ],
        "capacity_utilization": 85,
        "dependencies": ["Infrastructure team support"],
        "status": "pending_approval"
      }
    ]
  }
  ```
- **Approval Workflow**:
  ```json
  POST /api/planning/{plan_id}/approve
  {
    "decision": "approved",
    "comments": "Good allocation, proceed",
    "modifications": []
  }
  ```
- **Backend Flow**:
  1. Review manager submissions
  2. Validate capacity and resources
  3. Approve or request changes
  4. Activate approved plans
- **Data Models**: `QuarterlyPlan`, `Approval`, `PlanModification`
- **Outcome**: Teams have approved execution plans

---

### PHASE 5: DAILY MONITORING (Week 8 Dashboard)

#### Step 13: Executive Dashboard Overview
- **Story**: EXEC-009: Executive Dashboard Overview
- **Screen**: `02_dashboard.html` (Executive view)
- **API Endpoint**: `GET /api/dashboard/executive`
- **Response**:
  ```json
  {
    "company_metrics": {
      "active_objectives": 12,
      "on_track_percentage": 67,
      "tasks_completed_today": 45,
      "teams_at_risk": 2,
      "upcoming_deadlines": 8
    },
    "alerts": [
      {"type": "at_risk", "message": "Sales team 3 days behind schedule"},
      {"type": "blocker", "message": "Infrastructure blocking 5 tasks"}
    ],
    "top_priorities": [
      {"task": "Customer demo preparation", "team": "Sales", "due": "Today"}
    ]
  }
  ```
- **Backend Flow**:
  1. Tracking Engine aggregates real-time data
  2. Observer Engine identifies alerts
  3. Scoring Engine calculates metrics
  4. Cache in Redis for performance
- **Real-time Updates**:
  ```javascript
  // Executive subscribes to company-wide updates
  socket.on('company.metrics.updated', updateDashboard);
  socket.on('team.alert.critical', showAlert);
  ```
- **Data Models**: `DashboardMetrics`, `Alert`, `Priority`
- **Outcome**: Real-time company pulse

---

### PHASE 6: STRATEGIC REVIEW & ANALYTICS (Week 11+)

#### Step 15: View Analytics Dashboard
- **Story**: EXEC-016: View Analytics Dashboard
- **Screen**: `08_analytics.html`
- **API Endpoint**: `GET /api/analytics/executive-insights`
- **Response**:
  ```json
  {
    "trends": {
      "objective_completion": [
        {"month": "Oct", "rate": 65},
        {"month": "Nov", "rate": 72},
        {"month": "Dec", "rate": 78}
      ]
    },
    "team_comparison": [
      {"team": "Engineering", "performance": 85},
      {"team": "Sales", "performance": 62}
    ],
    "predictive_insights": {
      "q1_completion_probability": 78,
      "at_risk_objectives": ["obj_003", "obj_007"],
      "recommended_interventions": [
        "Increase Sales team capacity by 20%",
        "Reassign obj_007 to Engineering team"
      ]
    }
  }
  ```
- **iBrain Analytics**:
  ```json
  {
    "ai_model": "predictive-analytics-v3",
    "predictions": {
      "q1_success_rate": 78,
      "bottlenecks": ["resource_constraint", "skill_gap"],
      "optimization_suggestions": [
        "Reallocate 2 engineers to critical path",
        "Accelerate financial training program"
      ]
    }
  }
  ```
- **Backend Flow**:
  1. Scoring Engine generates analytics
  2. iBrain provides predictive insights
  3. Generate visual charts and trends
  4. Export-ready formatting
- **Data Models**: `Analytics`, `Trend`, `Prediction`, `Insight`
- **Outcome**: Data-driven strategic decisions

#### Step 16: Export Analytics Reports
- **Story**: EXEC-017: Export Analytics Reports
- **Screen**: `08_analytics.html` → Export button
- **API Endpoint**: `POST /api/reports/generate`
- **Request**:
  ```json
  {
    "report_type": "executive_summary",
    "period": "Q4_2025",
    "format": "pdf",
    "sections": ["objectives", "team_performance", "predictions"],
    "recipients": ["board@company.com"]
  }
  ```
- **Backend Flow**:
  1. Aggregate data from all engines
  2. Generate charts and visualizations
  3. Create PDF with corporate branding
  4. Email to specified recipients
- **Data Models**: `Report`, `ExportLog`
- **Outcome**: Professional reports for stakeholders

---

## 🔗 COMPLETE LINEAGE TRACKING

**Executive View - Full Visibility Chain**:
```
Assessment (Company SSI Analysis)
    ↓ [iBrain AI Generation]
AI-Generated OKR (Strategic Objective)
    ↓ [Planner Engine]
Company Objective (Approved by Executive)
    ↓ [Planner Engine]
Quarterly Goals (Broken Down)
    ↓ [Manager Planning]
Team Goals (Manager Created)
    ↓ [Task Assignment]
Individual Tasks (Employee Level)
    ↓ [Tracking Engine]
Real-time Progress (Automatic Rollup)
    ↓ [Analytics Engine]
Executive Dashboard (Complete Visibility)
```

**Executive Drill-Down Capability**:
- Click any metric → See contributing objectives
- Click objective → See all key results
- Click key result → See all goals
- Click goal → See all tasks
- Click task → See assignee and status

---

## 🚨 CRITICAL TECHNICAL INTEGRATIONS

### iBrain Integration for OKR Generation
```javascript
async function generateOKRsFromAssessment(assessmentId) {
  const assessment = await getAssessmentResults(assessmentId);

  const ibrainRequest = {
    model: 'okr-generator-v2',
    context: {
      ssi_scores: assessment.scores,
      gaps: assessment.gaps,
      industry: company.industry,
      size: company.employee_count
    }
  };

  const aiOKRs = await iBrain.generate(ibrainRequest);
  return formatOKRsForReview(aiOKRs);
}
```

### Real-time Executive Dashboard
```javascript
// Executive dashboard WebSocket subscription
socket.on('connect', () => {
  socket.emit('subscribe', {
    channels: [
      'company.metrics.*',
      'team.alerts.critical',
      'objective.progress.*',
      'planning.approval.pending'
    ]
  });
});

socket.on('company.metrics.updated', (data) => {
  updateExecutiveDashboard(data);
});
```

### Predictive Analytics Query
```sql
-- Predict Q1 completion probability
WITH task_velocity AS (
  SELECT
    AVG(completion_rate) as avg_velocity,
    STDDEV(completion_rate) as velocity_variance
  FROM weekly_metrics
  WHERE week >= NOW() - INTERVAL '4 weeks'
),
remaining_work AS (
  SELECT COUNT(*) as tasks_remaining
  FROM tasks
  WHERE status != 'completed'
    AND due_date <= '2026-03-31'
)
SELECT
  (tv.avg_velocity * 12) / rw.tasks_remaining * 100 as completion_probability
FROM task_velocity tv, remaining_work rw;
```

---

## 📊 USER STORIES BY WEEK WITH TECHNICAL COMPLEXITY

### Week 1-4: Assessment System
- ✅ EXEC-001: View Company Assessment Results [API: Medium]
- ⚠️ EXEC-002: Generate AI OKRs from Assessment [API: High - AI integration]

### Week 5: Teams + Objectives
- ⬜ EXEC-003: View All Company Objectives [API: High - aggregation]
- ⬜ EXEC-004: Fix AI OKR Review Bug [Bug Fix: High]
- ⬜ EXEC-005: Filter Objectives by Department [API: Low]
- ⬜ EXEC-006: Track Company Progress [WebSocket: High]

### Week 6: Profile + Health
- ⬜ EXEC-007: View Executive Dashboard [API: High - real-time]
- ⬜ EXEC-008: View Organization Info [API: Low]

### Week 7: Goal Management
- ⬜ EXEC-010: Approve Company Goals [API: Medium]
- ⬜ EXEC-011: Cascade Goals to Teams [API: High - cascade logic]

### Week 8: Dashboard
- ⬜ EXEC-009: Executive Dashboard Overview [API: High - aggregation]

### Week 9: Planning
- ⬜ **EXEC-011B: Approve Manager Quarterly Plans** [API: High - workflow]
- ⬜ EXEC-012: Create Yearly OKRs [API: Medium]
- ⬜ EXEC-013: Break into Quarterly Goals [API: Medium]
- ⬜ EXEC-014: Review Team Plans [API: Low]
- ⬜ EXEC-015: Approve Planning Cycles [API: Medium]

### Week 11: Analytics
- ⬜ EXEC-016: View Analytics Dashboard [API: High - analytics]
- ⬜ EXEC-017: Export Analytics Reports [API: Medium]
- ⬜ EXEC-018: Track Company Metrics [API: High - real-time]

**Total Executive Stories**: 19 (1 complete, 1 with bug, 17 not started)
**Technical Complexity**: 10 High, 7 Medium, 2 Low

---

## 🔧 TECHNICAL REQUIREMENTS

### Performance Requirements
- Executive dashboard load: < 1.5 seconds
- Real-time updates: < 300ms latency
- Analytics generation: < 5 seconds
- Report export: < 15 seconds
- AI OKR generation: < 10 seconds

### Data Requirements
- Support 10,000+ employees
- Handle 100+ concurrent executives
- Store 5 years of historical data
- Real-time aggregation across all teams

### Integration Points
- iBrain AI service for OKR generation
- Email service for notifications
- PDF generation service for reports
- WebSocket for real-time updates
- Redis for caching executive metrics
- Elasticsearch for analytics queries

### Security Requirements
- Row-level security for multi-tenancy
- Audit logging for all executive actions
- Encryption for sensitive metrics
- SSO integration for executive login

---

## 🔗 RELATED DOCUMENTATION

- [MVP_TECHNICAL_ARCHITECTURE_V5.md](../../KARVIA_STRATEGY/02_TECHNICAL_OVERVIEW/MVP_TECHNICAL_ARCHITECTURE_V5.md)
- [MASTER_DEV_LIST_V5.md](../../KARVIA_STRATEGY/03_DEVELOPMENT_ROADMAP/MASTER_DEV_LIST_V5.md)
- [iBrain Integration Guide](../../ibrain_integration_model.md)
- [API Documentation](../../api_docs.md)

---

**Version**: 2.0.0
**Last Updated**: 2025-10-24
**Status**: ✅ Technical Architecture Added - Ready for implementation