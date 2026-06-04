# 🔥 PRE-SPRINT: CRITICAL WORKFLOW FIXES
**Duration**: November 3-9, 2025 (1 week)
**Goal**: Fix the Assessment → OKR → Objectives flow completely
**Priority**: P0 CRITICAL - Nothing works without this

## 🚨 The Problem Statement

Currently we have a broken workflow:
1. ✅ Users can take assessments
2. ✅ Individual results are visible
3. ❌ **No team results aggregation dashboard**
4. ❌ **Cannot generate OKRs from team weak areas**
5. ❌ **Objectives page shows nothing**
6. ❌ **Cannot create goals from objectives (because no objectives exist)**

**Impact**: The entire product is unusable. We built Steps 1 and 6, but Steps 2-5 are missing!

## 📊 Pre-Sprint Objectives

### MUST COMPLETE (100% Required)
1. **Team Results Dashboard** - Aggregate assessment results by team
2. **Fix OKR Generation** - Generate from team weak areas, not individual
3. **Objectives Display** - Ensure objectives page shows generated OKRs
4. **End-to-End Flow** - Complete workflow from assessment to objectives

### The Complete Flow We Need
```
1. Team takes assessments ✅
2. Manager views team results dashboard (BUILD THIS)
3. Manager identifies team weak areas (BUILD THIS)
4. Manager generates OKRs from weak areas (FIX THIS)
5. OKRs appear in objectives page (FIX THIS)
6. Manager creates goals from objectives (Sprint 1)
```

## 🛠️ Technical Implementation

### PRIORITY 1: Team Results Dashboard (Days 1-2)

#### New File: `client/pages/team-results-dashboard.html`
```html
<!-- 400 lines -->
<div class="team-results-container">
  <!-- Team selector dropdown -->
  <!-- Aggregated SSI scores (Speed, Strength, Intelligence) -->
  <!-- Weak areas identification -->
  <!-- Team member comparison -->
  <!-- Generate OKR button -->
</div>
```

#### New File: `client/pages/scripts/team-results-dashboard.js`
```javascript
// Key functions (500 lines)
async function loadTeamResults(teamId) {
  // GET /api/assessments/team/:teamId/aggregate
  const results = await AssessmentAPI.getTeamAggregate(teamId);
  renderTeamScores(results);
  identifyWeakAreas(results);
}

function identifyWeakAreas(results) {
  // Find dimensions scoring < 70%
  // Prioritize by impact
  // Return top 3-5 weak areas
}

function handleGenerateOKR() {
  // Pass team weak areas to OKR generation
  const weakAreas = getIdentifiedWeakAreas();
  // POST /api/ai-okr/generate-from-team
  const okrs = await AIOKRAPI.generateFromTeamResults(teamId, weakAreas);
  // Redirect to objectives page
}
```

#### Backend Fix: `server/routes/assessments.js`
```javascript
// Add new endpoint (150 lines)
router.get('/api/assessments/team/:teamId/aggregate', async (req, res) => {
  const { teamId } = req.params;

  // Aggregate all team member assessments
  const aggregatedResults = await Assessment.aggregate([
    { $match: { team_id: teamId, business_id: req.user.business_id } },
    { $group: {
      _id: '$dimension',
      avgScore: { $avg: '$score' },
      count: { $sum: 1 }
    }},
    { $sort: { avgScore: 1 } } // Lowest scores first (weak areas)
  ]);

  // Calculate team SSI
  const teamSSI = calculateTeamSSI(aggregatedResults);

  res.json({
    team_id: teamId,
    ssi_scores: teamSSI,
    weak_areas: aggregatedResults.slice(0, 5), // Top 5 weak areas
    member_count: memberCount,
    assessment_completion: completionRate
  });
});
```

### PRIORITY 2: Fix OKR Generation from Team Results (Days 2-3)

#### Fix: `server/routes/ai-okr.js`
```javascript
// Modify existing endpoint (200 lines modification)
router.post('/api/ai-okr/generate-from-team', async (req, res) => {
  const { teamId, weakAreas } = req.body;

  // Get team context
  const team = await Team.findById(teamId);
  const business = await Business.findById(team.business_id);

  // Generate OKRs targeting weak areas
  const prompt = buildTeamOKRPrompt(team, business, weakAreas);

  let okrs;
  if (process.env.OPENAI_API_KEY) {
    okrs = await generateWithOpenAI(prompt);
  } else {
    okrs = await generateFromTemplates(weakAreas);
  }

  // Save to database with team context
  const savedOKRs = await saveTeamOKRs(okrs, teamId, weakAreas);

  res.json({
    success: true,
    suggestion_id: savedOKRs._id,
    objectives: savedOKRs.objectives
  });
});
```

#### Fix: `client/pages/scripts/ai-okr-review.js`
```javascript
// Fix the display bug (100 lines modification)
// CURRENT BUG: Expects response.data.data
// ACTUAL: Returns response.data.suggestion

async function loadGeneratedOKRs(suggestionId) {
  try {
    const response = await AIOKRAPI.getSuggestion(suggestionId);

    // FIX: Use correct response structure
    const okrData = response.data.suggestion || response.data;

    if (okrData && okrData.objectives) {
      renderObjectives(okrData.objectives);
    } else {
      showError('No objectives found');
    }
  } catch (error) {
    console.error('Failed to load OKRs:', error);
  }
}
```

### PRIORITY 3: Fix Objectives Display (Days 3-4)

#### Fix: `client/pages/objectives.html`
```html
<!-- Ensure it can display team-generated OKRs -->
<div class="objectives-container">
  <!-- Add team filter -->
  <select id="teamFilter">
    <option value="all">All Teams</option>
    <!-- Populate with user's teams -->
  </select>

  <!-- Show generation source -->
  <div class="objective-card">
    <span class="generation-badge">Generated from Team Assessment</span>
    <!-- Objective details -->
  </div>
</div>
```

#### Fix: `client/pages/scripts/objectives.js`
```javascript
// Modify to load team objectives (150 lines modification)
async function loadObjectives() {
  const teamId = document.getElementById('teamFilter').value;

  // Include team filter
  const filters = {
    business_id: currentUser.business_id,
    team_id: teamId === 'all' ? undefined : teamId
  };

  const objectives = await ObjectiveAPI.list(filters);

  // Group by team
  const groupedObjectives = groupByTeam(objectives);
  renderObjectivesByTeam(groupedObjectives);
}

function renderObjectiveCard(objective) {
  // Show generation source
  const generationBadge = objective.generated_from_assessment
    ? '<span class="badge badge-ai">AI Generated from Team Assessment</span>'
    : '<span class="badge badge-manual">Manually Created</span>';

  // Include weak areas addressed
  if (objective.addresses_weak_areas) {
    const weakAreasList = objective.weak_areas.map(area =>
      `<li>${area.dimension}: ${area.score}%</li>`
    ).join('');
  }
}
```

### PRIORITY 4: Navigation & Flow Integration (Day 4)

#### Update Navigation Flow
```javascript
// client/js/navigation.js
const workflowSteps = {
  1: { name: 'Assessment', url: '/assessment-hub.html', status: 'complete' },
  2: { name: 'Team Results', url: '/team-results-dashboard.html', status: 'complete' },
  3: { name: 'Generate OKRs', url: '/ai-okr-review.html', status: 'complete' },
  4: { name: 'Objectives', url: '/objectives.html', status: 'current' },
  5: { name: 'Goals', url: '/quarterly-goals.html', status: 'next' }
};

// Add breadcrumb navigation
function renderWorkflowProgress() {
  // Show user where they are in the flow
}
```

### PRIORITY 5: End-to-End Testing (Day 5)

#### Test Scenarios
1. **Complete Flow Test**:
   ```
   - Create team with 3 members
   - Each member takes assessment
   - Manager views team results
   - Manager generates OKRs from weak areas
   - OKRs appear in objectives page
   - Manager can proceed to create goals
   ```

2. **Edge Cases**:
   - Team with only 1 member
   - Team with no assessments
   - Partial assessment completion
   - Multiple teams in same company

3. **Role-Based Testing**:
   - Executive sees all teams
   - Manager sees only their team
   - Employee sees team results (read-only)
   - Consultant sees all companies

## 📋 Pre-Sprint Task Breakdown

### Day 1 (Nov 3): Team Results Backend
- [ ] Create team aggregation endpoint
- [ ] Add SSI calculation for teams
- [ ] Implement weak area identification
- [ ] Test with sample data

### Day 2 (Nov 4): Team Results Frontend
- [ ] Create team-results-dashboard.html
- [ ] Implement team results visualization
- [ ] Add weak areas highlighting
- [ ] Add "Generate OKR" button

### Day 3 (Nov 5): Fix OKR Generation
- [ ] Modify AI OKR endpoint for teams
- [ ] Fix response format bug
- [ ] Update prompt for team context
- [ ] Test generation flow

### Day 4 (Nov 6): Fix Objectives Display
- [ ] Update objectives page for team OKRs
- [ ] Add team filtering
- [ ] Show generation source
- [ ] Link weak areas to objectives

### Day 5 (Nov 7): Integration & Testing
- [ ] End-to-end flow testing
- [ ] Fix integration bugs
- [ ] Update navigation
- [ ] Verify all roles work

## 🎯 Success Criteria

**The flow MUST work**:
1. ✅ Team completes assessments
2. ✅ Manager sees aggregated team results
3. ✅ Manager identifies team weak areas
4. ✅ Manager generates OKRs from weak areas
5. ✅ OKRs appear in objectives page
6. ✅ Ready to create goals from objectives

**Metrics**:
- Team results load < 2 seconds
- OKR generation < 5 seconds
- All personas can see appropriate data
- Zero console errors
- Works for multi-team scenarios

## 🚨 Why This is Critical

Without this pre-sprint work:
- Sprint 1 Goal UI has no objectives to work with
- The product has no value proposition
- The assessment feature is disconnected
- Users cannot see the ROI of assessments

With this pre-sprint complete:
- Full workflow from assessment to objectives
- Clear value: Assessment → Insights → Actions
- Sprint 1 can focus on execution (goals/tasks)
- Demo-able end-to-end flow

## 📚 Reference Documents

### Existing Code to Modify
- `/server/routes/assessments.js` - Add team aggregation
- `/server/routes/ai-okr.js` - Fix generation
- `/client/pages/objectives.html` - Display team OKRs
- `/client/pages/scripts/ai-okr-review.js` - Fix display bug

### Models to Use
- `/server/models/Assessment.js` - For aggregation
- `/server/models/Team.js` - For team context
- `/server/models/AIOKRSuggestion.js` - For storing OKRs

### New Files to Create
- `/client/pages/team-results-dashboard.html`
- `/client/pages/scripts/team-results-dashboard.js`
- `/client/css/team-results.css`

## 🔗 Dependencies

**Must Have**:
- Teams created and populated
- Assessments completed by team members
- AI OKR service configured (or template fallback)

**Should Have**:
- Multiple teams for testing
- Various assessment scores for realistic data

## 📅 Pre-Sprint Timeline

| Date | Focus | Deliverable |
|------|-------|------------|
| Nov 3 | Team Results Backend | API endpoint working |
| Nov 4 | Team Results Frontend | Dashboard visible |
| Nov 5 | OKR Generation Fix | Team OKRs generating |
| Nov 6 | Objectives Display | OKRs visible in objectives |
| Nov 7 | Integration Testing | Complete flow working |
| Nov 8-9 | Buffer/Polish | Ready for Sprint 1 |

---

**Critical Note**: This Pre-Sprint MUST be complete before Sprint 1 begins. Without it, the entire sprint plan falls apart because there are no objectives to create goals from!