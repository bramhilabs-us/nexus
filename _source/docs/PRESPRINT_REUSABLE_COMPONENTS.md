# Pre-Sprint Implementation: Reusable Components Quick Reference

## Most Important Reusable Components (Priority Order)

### 1. SSIScoringService.aggregateTeamScores() - CRITICAL
**File:** `/server/services/SSIScoringService.js`
**Why:** Directly calculates team averages from individual assessments
**Use in Pre-Sprint for:** Team capability baseline scoring

```javascript
const assessments = await Assessment.find({
  company_id: companyId,
  completed_at: { $gte: cutoffDate }
});

const teamScores = SSIScoringService.aggregateTeamScores(assessments);
// Returns: { team_speed, team_strength, team_intelligence, team_composite, weak_areas }
```

---

### 2. Team Assessment Endpoint - READY TO USE
**Endpoint:** `GET /api/assessments/team/:company_id`
**File:** `/server/routes/assessments.js` (lines 480-609)
**Why:** Already implements team aggregation with role-based auth
**What it returns:**
```javascript
{
  team_dimension_scores: { speed, strength, intelligence },
  team_composite: number,
  weak_areas: [{ dimension, score, status, message }],
  members: [{ user_id, name, latest_assessment, comparison_to_team_avg }]
}
```

---

### 3. Weak Area Identification - READY TO USE
**Function:** `SSIScoringService.identifyWeakAreas()`
**File:** `/server/services/SSIScoringService.js` (lines 261-284)
**Why:** Identifies scores below threshold (< 7.0 by default)
**Use in Pre-Sprint for:** Identifying team capability gaps

```javascript
const weakAreas = SSIScoringService.identifyWeakAreas(
  teamScores.team_dimension_scores,
  7.0  // threshold
);
// Returns: [{ dimension, score, status, message }]
```

---

### 4. AI OKR Generation - NEEDS LIGHT ADAPTATION
**Service:** `aiOKRService.generateOKRsFromAssessment()`
**File:** `/server/services/aiOKRService.js` (lines 45-116)
**Why:** Already generates SMART objectives from weak areas
**Adaptation needed:** Add Pre-Sprint context (e.g., sprint timeline, team capacity)

```javascript
const okrResult = await aiOKRService.generateOKRsFromAssessment(
  assessmentId,
  { threshold: 40, count: 4 }
);
// Returns: { objectives, weakAreasAnalysis, metadata }
```

---

### 5. Team Model & Methods - READY TO USE
**File:** `/server/models/Team.js`
**Key Methods:**
- `Team.findByBusiness(companyId)` - Get all company teams
- `Team.findByManager(managerId)` - Get managed teams
- `team.getActiveMembers()` - Filter active members

---

### 6. Assessment Model - READY TO USE
**File:** `/server/models/Assessment.js`
**Key Features:**
- `assessment_category` field supports 'team' assessments
- `context` object can store sprint/pre-sprint metadata
- Built-in ai_analysis field for storing AI insights

---

### 7. User Role & Permissions System - READY TO USE
**File:** `/server/models/User.js`
**Key Features:**
- 5-tier role system (CONSULTANT, BUSINESS_OWNER, EXECUTIVE, MANAGER, EMPLOYEE)
- `getRoleLevel()` method for permission checks
- `getTeamMembers()` to get subordinates
- Consultant can manage multiple companies

---

### 8. Frontend Assessment API Client - READY TO USE
**File:** `/client/js/assessment-api-client.js`
**Key Methods:**
- `getTeamResults(company_id, filters)` - Get team aggregation
- `startAssessment(template_id)` - Start assessment
- `submitAssessmentResponses(assessment_id, responses)` - Submit responses
- `getDetailedResults(assessment_id)` - Get results with weak areas

---

## Database Schema Alignment (All Use company_id)

All models consistently use `company_id` for multi-tenant support:
```javascript
Assessment.company_id
Team.company_id
User.company_id
Objective.company_id
Goal.company_id
Task.company_id
```

---

## Pre-Sprint Specific Components to Build

### 1. Pre-Sprint Service (NEW)
Extend existing assessment logic:
```javascript
class PreSprintService {
  // Use SSIScoringService.aggregateTeamScores()
  async getTeamReadiness(companyId) { }
  
  // Use aiOKRService.generateOKRsFromAssessment()
  async generateSprintGoals(assessmentId) { }
  
  // NEW: Compare to internal baseline
  async identifyCapabilityGaps(teamScores) { }
  
  // NEW: Create sprint plan
  async generateSprintPlan(companyId, teamScores, constraints) { }
}
```

### 2. Pre-Sprint Routes (NEW)
```javascript
POST   /api/pre-sprint/:companyId/initialize
GET    /api/pre-sprint/:companyId/team-readiness
GET    /api/pre-sprint/:companyId/weak-areas-summary
POST   /api/pre-sprint/:companyId/generate-plan
GET    /api/pre-sprint/:companyId/sprint-plan
```

### 3. Pre-Sprint Frontend Client (NEW)
```javascript
window.PreSprintAPI = {
  getTeamReadiness(companyId),
  generateSprintPlan(companyId, teamScores),
  approveSprintPlan(planId),
  scheduleSprint(planId, startDate)
}
```

---

## Implementation Timeline Estimate

### Week 1-2: Leverage Existing (15 hours)
- Set up Pre-Sprint assessment process
- Use existing team aggregation endpoints
- Use existing weak area identification
- Test with real team data

### Week 2-3: Build Pre-Sprint Service (20 hours)
- Create PreSprintService extending Assessment + Team logic
- Add capability gap analysis
- Add sprint timing optimization
- Create Pre-Sprint routes

### Week 3-4: Frontend Integration (15 hours)
- Build readiness dashboard
- Add team capability visualization
- Create sprint planning interface
- Integrate with assessment flow

**Total: 50 hours (vs 150+ without reuse)**

---

## Key Code Examples for Reuse

### Get Team Scores
```javascript
// In Pre-Sprint service or route
const Assessment = require('../models/Assessment');
const SSIScoringService = require('../services/SSIScoringService');

async getTeamScores(companyId) {
  const assessments = await Assessment.find({
    company_id: companyId,
    status: 'completed',
    completed_at: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
  });
  
  return SSIScoringService.aggregateTeamScores(assessments);
}
```

### Identify Capability Gaps
```javascript
// Compare team scores to baseline/requirements
const teamScores = await getTeamScores(companyId);
const gaps = [];

['speed', 'strength', 'intelligence'].forEach(dimension => {
  const score = teamScores.team_dimension_scores[dimension].raw_score;
  if (score < requiredCapability[dimension]) {
    gaps.push({
      dimension,
      current: score,
      required: requiredCapability[dimension],
      gap: requiredCapability[dimension] - score
    });
  }
});
```

### Generate Sprint OKRs
```javascript
// Use existing aiOKRService
const okrResult = await aiOKRService.generateOKRsFromAssessment(
  latestAssessmentId,
  {
    threshold: 40,  // Weak areas threshold
    count: 4,       // Number of objectives
    focus: 'capability_improvement'  // Pre-Sprint specific
  }
);
```

---

## Database Queries Ready to Use

```javascript
// Get all teams in company
Team.findByBusiness(companyId)

// Get team members with user details
const team = await Team.findById(teamId).populate('members.user_id');

// Get user's manager
const user = await User.findById(userId).populate('manager_id');

// Get team assessments
const assessments = await Assessment.find({
  'context.team_id': teamId,
  status: 'completed'
});

// Get assessments for date range
const assessments = await Assessment.find({
  company_id: companyId,
  completed_at: { $gte: startDate, $lte: endDate }
});

// Get user's role in company
const user = await User.findById(userId);
const role = user.role;  // BUSINESS_OWNER, MANAGER, EMPLOYEE, etc.
```

---

## Authentication Already Implemented

No need to build auth - already have:
- JWT token generation
- Token validation middleware
- Role-based authorization
- Multi-company support for consultants
- Permission-based access control

Just use: `authenticateToken` middleware in Pre-Sprint routes

---

## Testing Patterns Already in Place

All assessment endpoints tested with:
- Role-based access control
- Company isolation
- Data validation
- Error handling

Follow the same patterns for Pre-Sprint routes.

---

## Summary: What to Reuse vs Build

REUSE (Don't change):
✓ SSIScoringService
✓ Assessment API endpoints
✓ Team model
✓ User/Company models
✓ Authentication system
✓ Frontend API clients (minimal adaptation)

BUILD NEW:
+ Pre-Sprint service
+ Pre-Sprint routes
+ Pre-Sprint specific scoring/analysis
+ Pre-Sprint frontend components
+ Sprint scheduling logic

