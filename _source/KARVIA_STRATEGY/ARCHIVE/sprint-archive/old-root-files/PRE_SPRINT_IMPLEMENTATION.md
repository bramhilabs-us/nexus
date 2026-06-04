# 🚀 PRE-SPRINT IMPLEMENTATION PLAN
**Duration**: November 3-9, 2025 (1 week)
**Approach**: Extend existing code - NO duplication
**Goal**: Fix Assessment → Team Results → OKR Generation → Objectives flow

---

## ⚠️ CRITICAL IMPLEMENTATION RULES

### Before Writing ANY Code:
1. **CHECK if it exists** - Search codebase first
2. **EXTEND don't duplicate** - Add to existing files
3. **USE existing patterns** - Copy/paste patterns
4. **CONFIG not hardcode** - Use assessment-config.js
5. **TEST with existing data** - Assessments already in DB

---

## 📅 DAY-BY-DAY IMPLEMENTATION

### Day 1 (Nov 3): Backend Enhancements
**Time**: 8 hours
**Risk**: Low (extending tested code)

#### Task 1.1: Create Configuration File (NEW FILE)
```javascript
// CREATE: /server/config/assessment-config.js
module.exports = {
  SCORING: {
    WEAK_THRESHOLD: 70,  // <70% = weak
    WEIGHTS: {
      'EXECUTIVE': 3,
      'MANAGER': 2,
      'EMPLOYEE': 1
    }
  },

  BUSINESS_FUNCTIONS: [
    'Sales/Marketing',
    'Operations',
    'Finance',
    'HR/Admin'
  ],

  OKR_GENERATION: {
    OBJECTIVES_COUNT: 4,
    KEY_RESULTS_PER_OBJECTIVE: 4,
    MAX_REGENERATION_ATTEMPTS: 3,
    NOTIFY_ON_APPROVAL: true
  }
};
```

#### Task 1.2: Add Weighted Aggregation (EXTEND EXISTING)
```javascript
// ADD TO: /server/services/SSIScoringService.js
// After line 370 (don't modify existing aggregateTeamScores!)

static aggregateTeamScoresWeighted(assessments, roleWeights = null) {
  const config = require('../config/assessment-config');
  const weights = roleWeights || config.SCORING.WEIGHTS;

  let weightedSums = { speed: 0, strength: 0, intelligence: 0 };
  let totalWeight = 0;

  assessments.forEach(assessment => {
    // Get user role from populated data
    const role = assessment.user_id?.role || 'EMPLOYEE';
    const weight = weights[role] || 1;

    weightedSums.speed += assessment.ssi_scores.speed * weight;
    weightedSums.strength += assessment.ssi_scores.strength * weight;
    weightedSums.intelligence += assessment.ssi_scores.intelligence * weight;
    totalWeight += weight;
  });

  return {
    speed: totalWeight > 0 ? weightedSums.speed / totalWeight : 0,
    strength: totalWeight > 0 ? weightedSums.strength / totalWeight : 0,
    intelligence: totalWeight > 0 ? weightedSums.intelligence / totalWeight : 0,
    composite: totalWeight > 0 ?
      (weightedSums.speed + weightedSums.strength + weightedSums.intelligence) / (3 * totalWeight) : 0,
    participant_count: assessments.length,
    total_weight: totalWeight
  };
}

// ADD: Group by function helper
static groupAssessmentsByFunction(assessments) {
  const groups = {};

  assessments.forEach(assessment => {
    const func = assessment.user_id?.function || 'General';
    if (!groups[func]) {
      groups[func] = [];
    }
    groups[func].push(assessment);
  });

  return groups;
}
```

#### Task 1.3: Enhance Team Endpoint (MODIFY EXISTING)
```javascript
// MODIFY: /server/routes/assessments.js
// Find line 549: const teamScores = SSIScoringService.aggregateTeamScores(assessments);
// REPLACE WITH:

// Use weighted aggregation
const config = require('../config/assessment-config');
const teamScores = SSIScoringService.aggregateTeamScoresWeighted(assessments);

// Add function-based grouping
const functionGroups = SSIScoringService.groupAssessmentsByFunction(assessments);
const functionScores = {};

Object.keys(functionGroups).forEach(func => {
  functionScores[func] = {
    ...SSIScoringService.aggregateTeamScoresWeighted(functionGroups[func]),
    weak_areas: SSIScoringService.identifyWeakAreas(
      SSIScoringService.aggregateTeamScoresWeighted(functionGroups[func]),
      config.SCORING.WEAK_THRESHOLD
    )
  };
});

// Update response to include function scores
// Find the res.json() call around line 590
// ADD functionScores to the response:
res.json({
  success: true,
  data: {
    team_dimension_scores: teamScores,
    function_scores: functionScores,  // ADD THIS
    team_composite: teamScores.composite,
    member_count: assessments.length,
    weak_areas: SSIScoringService.identifyWeakAreas(teamScores, config.SCORING.WEAK_THRESHOLD),
    members: members,
    weights_applied: config.SCORING.WEIGHTS  // ADD THIS
  }
});
```

---

### Day 2 (Nov 4): OKR Generation Enhancement
**Time**: 6 hours
**Risk**: Low (adding new endpoints)

#### Task 2.1: Add Team OKR Generation Endpoint (NEW ENDPOINT)
```javascript
// ADD TO: /server/routes/ai-okr.js
// After existing routes (around line 200)

/**
 * POST /api/ai-okr/generate-from-team
 * Generate OKRs from team assessment results
 * Access: MANAGER, EXECUTIVE, BUSINESS_OWNER, CONSULTANT
 */
router.post('/generate-from-team', authenticateToken, async (req, res) => {
  try {
    const { company_id, team_results, function_scores } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check permissions (reuse existing pattern)
    if (!['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Only managers and above can generate objectives.'
      });
    }

    const config = require('../config/assessment-config');

    // Build context for each function
    const objectives = [];
    const functions = config.BUSINESS_FUNCTIONS;

    for (const func of functions) {
      const funcData = function_scores[func];

      // Skip if no data or no weak areas
      if (!funcData || funcData.weak_areas.length === 0) {
        // Still generate placeholder objective
        objectives.push({
          title: `Improve ${func} Performance`,
          description: `Enhance overall ${func} capabilities and efficiency`,
          function: func,
          priority: 'medium',
          key_results: [
            {
              title: `Increase ${func} efficiency by 20%`,
              target: 20,
              metric: 'percentage',
              current: 0
            },
            {
              title: `Complete ${func} training program`,
              target: 100,
              metric: 'percentage',
              current: 0
            },
            {
              title: `Implement ${func} best practices`,
              target: 5,
              metric: 'count',
              current: 0
            },
            {
              title: `Achieve ${func} quality score of 85%`,
              target: 85,
              metric: 'percentage',
              current: funcData?.composite || 0
            }
          ],
          generated_from: 'team_assessment',
          weak_areas_addressed: funcData?.weak_areas || []
        });
        continue;
      }

      // Generate objective for weak areas
      const weakestArea = funcData.weak_areas[0];

      // Reuse existing AI service if available
      if (process.env.OPENAI_API_KEY) {
        // Use existing aiOKRService
        const aiObjective = await aiOKRService.generateFunctionObjective(
          func,
          weakestArea,
          funcData
        );
        objectives.push(aiObjective);
      } else {
        // Use template (reuse existing pattern)
        const templates = {
          Speed: {
            title: `Accelerate ${func} Operations`,
            description: `Improve speed and efficiency in ${func} processes`,
            key_results: [
              { title: `Reduce ${func} cycle time by 30%`, target: 30, metric: 'percentage' },
              { title: `Automate 5 ${func} processes`, target: 5, metric: 'count' },
              { title: `Decrease response time to <2 hours`, target: 2, metric: 'hours' },
              { title: `Complete ${func} tasks 25% faster`, target: 25, metric: 'percentage' }
            ]
          },
          Strength: {
            title: `Strengthen ${func} Capabilities`,
            description: `Build robust systems and processes for ${func}`,
            key_results: [
              { title: `Implement 3 quality controls`, target: 3, metric: 'count' },
              { title: `Achieve 95% reliability rate`, target: 95, metric: 'percentage' },
              { title: `Reduce ${func} errors by 40%`, target: 40, metric: 'percentage' },
              { title: `Complete capability assessment`, target: 100, metric: 'percentage' }
            ]
          },
          Intelligence: {
            title: `Enhance ${func} Intelligence`,
            description: `Improve decision-making and insights in ${func}`,
            key_results: [
              { title: `Implement data analytics dashboard`, target: 100, metric: 'percentage' },
              { title: `Train team on 3 new skills`, target: 3, metric: 'count' },
              { title: `Increase insight accuracy to 90%`, target: 90, metric: 'percentage' },
              { title: `Create 5 performance reports`, target: 5, metric: 'count' }
            ]
          }
        };

        const template = templates[weakestArea.dimension] || templates.Intelligence;
        objectives.push({
          ...template,
          function: func,
          priority: weakestArea.score < 50 ? 'high' : 'medium',
          generated_from: 'team_assessment',
          weak_areas_addressed: [weakestArea]
        });
      }
    }

    // Ensure we always have 4 objectives
    while (objectives.length < config.OKR_GENERATION.OBJECTIVES_COUNT) {
      objectives.push({
        title: `Strategic Initiative ${objectives.length + 1}`,
        description: 'Placeholder objective for future planning',
        function: 'General',
        priority: 'low',
        key_results: Array(4).fill(null).map((_, i) => ({
          title: `Key Result ${i + 1}`,
          target: 100,
          metric: 'percentage',
          current: 0
        })),
        generated_from: 'team_assessment'
      });
    }

    // Save as draft (reuse existing model)
    const suggestion = new AIOKRSuggestion({
      company_id: company_id,
      user_id: userId,
      generated_at: new Date(),
      status: 'draft',
      objectives: objectives.slice(0, config.OKR_GENERATION.OBJECTIVES_COUNT),
      ai_metadata: {
        model: process.env.OPENAI_API_KEY ? 'gpt-4' : 'template',
        generation_method: 'team_assessment',
        team_results: team_results,
        function_scores: function_scores
      },
      regeneration_count: 0,
      max_regenerations: config.OKR_GENERATION.MAX_REGENERATION_ATTEMPTS
    });

    await suggestion.save();

    res.json({
      success: true,
      suggestion_id: suggestion._id,
      objectives: suggestion.objectives,
      can_regenerate: true,
      regenerations_remaining: config.OKR_GENERATION.MAX_REGENERATION_ATTEMPTS
    });

  } catch (error) {
    logger.error('[AI OKR] Team generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/ai-okr/approve-draft
 * Approve or reject OKR draft
 * Access: MANAGER, EXECUTIVE, BUSINESS_OWNER, CONSULTANT
 */
router.post('/approve-draft', authenticateToken, async (req, res) => {
  try {
    const { suggestion_id, action, edited_objectives } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check permissions
    if (!['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to approve OKRs'
      });
    }

    // Get suggestion
    const suggestion = await AIOKRSuggestion.findById(suggestion_id);
    if (!suggestion) {
      return res.status(404).json({
        success: false,
        error: 'Suggestion not found'
      });
    }

    if (action === 'approve') {
      // Use edited objectives if provided, otherwise use draft
      const objectivesToSave = edited_objectives || suggestion.objectives;

      // Create actual objectives (reuse existing Objective model)
      const savedObjectives = [];

      for (const obj of objectivesToSave) {
        const objective = new Objective({
          company_id: suggestion.company_id,
          title: obj.title,
          description: obj.description,
          category: obj.function || 'General',
          priority: obj.priority || 'medium',
          key_results: obj.key_results,
          target_quarter: getCurrentQuarter(),  // Helper function
          target_year: new Date().getFullYear(),
          status: 'active',
          owner_id: userId,
          created_by: userId,
          generated_from_assessment: true,
          suggestion_id: suggestion._id
        });

        await objective.save();
        savedObjectives.push(objective._id);
      }

      // Update suggestion status
      suggestion.status = 'approved';
      suggestion.approved_by = userId;
      suggestion.approved_at = new Date();
      suggestion.objective_ids = savedObjectives;
      await suggestion.save();

      // Send notifications if configured
      const config = require('../config/assessment-config');
      if (config.OKR_GENERATION.NOTIFY_ON_APPROVAL) {
        // Reuse existing notification service if available
        // notificationService.sendOKRApprovalNotification(suggestion);
      }

      res.json({
        success: true,
        message: 'OKRs approved and saved',
        objective_ids: savedObjectives
      });

    } else if (action === 'regenerate') {
      // Check regeneration limit
      const config = require('../config/assessment-config');
      if (suggestion.regeneration_count >= config.OKR_GENERATION.MAX_REGENERATION_ATTEMPTS) {
        return res.status(400).json({
          success: false,
          error: 'Maximum regeneration attempts reached'
        });
      }

      // Update count
      suggestion.regeneration_count += 1;
      suggestion.status = 'regenerating';
      await suggestion.save();

      res.json({
        success: true,
        message: 'Ready for regeneration',
        regenerations_remaining: config.OKR_GENERATION.MAX_REGENERATION_ATTEMPTS - suggestion.regeneration_count
      });

    } else if (action === 'reject') {
      suggestion.status = 'rejected';
      suggestion.rejected_by = userId;
      suggestion.rejected_at = new Date();
      await suggestion.save();

      res.json({
        success: true,
        message: 'Draft rejected'
      });
    }

  } catch (error) {
    logger.error('[AI OKR] Approval failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

#### Task 2.2: Update AIOKRSuggestion Model (EXTEND EXISTING)
```javascript
// MODIFY: /server/models/AIOKRSuggestion.js
// Add these fields to the schema (around line 50):

regeneration_count: {
  type: Number,
  default: 0
},

max_regenerations: {
  type: Number,
  default: 3
},

approved_by: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},

approved_at: Date,

rejected_by: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},

rejected_at: Date,

objective_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Objective'
}],

version_history: [{
  version: Number,
  objectives: Array,
  edited_at: Date,
  edited_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}]
```

---

### Day 3 (Nov 5): Frontend UI - Team Results
**Time**: 8 hours
**Risk**: Medium (new UI, but using patterns)

#### Task 3.1: Create Team Results Dashboard (NEW FILE)
```html
<!-- CREATE: /client/pages/team-results-dashboard.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Team Assessment Results - Karvia</title>

    <!-- REUSE existing CSS -->
    <link rel="stylesheet" href="../css/theme.css">
    <link rel="stylesheet" href="../css/assessment.css">

    <!-- NEW CSS for this page -->
    <style>
        .team-results-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .ssi-scores {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .score-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .score-value {
            font-size: 48px;
            font-weight: bold;
            margin: 10px 0;
        }

        .weak { color: #dc3545; }
        .moderate { color: #ffc107; }
        .strong { color: #28a745; }

        .function-results {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .function-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .weak-areas {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .action-buttons {
            text-align: center;
            margin-top: 30px;
        }

        .btn-generate {
            background: #007bff;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            cursor: pointer;
        }

        .btn-generate:hover {
            background: #0056b3;
        }

        .loading {
            display: none;
            text-align: center;
            padding: 20px;
        }
    </style>
</head>
<body>
    <!-- REUSE existing navbar -->
    <div id="navbar-container"></div>

    <div class="team-results-container">
        <h1>Team Assessment Results</h1>

        <!-- Loading indicator -->
        <div id="loading" class="loading">
            <div class="spinner-border"></div>
            <p>Loading team results...</p>
        </div>

        <!-- Results container -->
        <div id="results-container" style="display: none;">

            <!-- Overall SSI Scores -->
            <h2>Team SSI Scores (Weighted Average)</h2>
            <div class="ssi-scores" id="ssi-scores">
                <!-- Populated by JS -->
            </div>

            <!-- Function-based Results -->
            <h2>Results by Business Function</h2>
            <div class="function-results" id="function-results">
                <!-- Populated by JS -->
            </div>

            <!-- Weak Areas Summary -->
            <div class="weak-areas" id="weak-areas">
                <h3>⚠️ Areas Requiring Attention</h3>
                <ul id="weak-areas-list">
                    <!-- Populated by JS -->
                </ul>
            </div>

            <!-- Weighting Notice -->
            <div class="alert alert-info">
                <small>
                    <strong>Note:</strong> Scores are weighted by role
                    (Executive: 3x, Manager: 2x, Employee: 1x) to reflect
                    strategic impact.
                </small>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button id="generate-okrs-btn" class="btn-generate">
                    Generate OKRs from These Results
                </button>
            </div>
        </div>

        <!-- OKR Generation Section (Initially Hidden) -->
        <div id="okr-section" style="display: none;">
            <h2>Generated OKRs (Draft)</h2>
            <div id="okr-container">
                <!-- Populated after generation -->
            </div>

            <!-- Approval Actions (for authorized users) -->
            <div id="approval-actions" style="display: none;">
                <button id="approve-btn" class="btn btn-success">
                    ✓ Approve & Save to Objectives
                </button>
                <button id="regenerate-btn" class="btn btn-warning">
                    ↻ Regenerate (<span id="regenerations-left">3</span> left)
                </button>
                <button id="edit-btn" class="btn btn-secondary">
                    ✏️ Edit Before Saving
                </button>
            </div>
        </div>
    </div>

    <!-- REUSE existing API clients -->
    <script src="../js/assessment-api-client.js"></script>
    <script src="../js/ai-okr-api-client.js"></script>

    <!-- NEW script for this page -->
    <script src="scripts/team-results-dashboard.js"></script>

    <!-- Load navbar (REUSE existing) -->
    <script>
        fetch('../components/navbar.html')
            .then(res => res.text())
            .then(html => document.getElementById('navbar-container').innerHTML = html);
    </script>
</body>
</html>
```

#### Task 3.2: Create Dashboard JavaScript (NEW FILE)
```javascript
// CREATE: /client/pages/scripts/team-results-dashboard.js

class TeamResultsDashboard {
  constructor() {
    // REUSE existing API clients
    this.assessmentAPI = new AssessmentAPIClient();
    this.aiOKRAPI = new AIOKRAPIClient();

    // Get user info from localStorage (REUSE existing pattern)
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.companyId = this.user.company_id;

    // Track state
    this.teamResults = null;
    this.suggestionId = null;
    this.regenerationsLeft = 3;

    this.init();
  }

  async init() {
    // Check authentication (REUSE existing pattern)
    if (!this.companyId) {
      window.location.href = '/login.html';
      return;
    }

    await this.loadTeamResults();
    this.attachEventListeners();
  }

  async loadTeamResults() {
    try {
      document.getElementById('loading').style.display = 'block';

      // Call existing endpoint (DON'T create new!)
      const response = await fetch(`/api/assessments/team/${this.companyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('karvia_auth_token')}`
        }
      });

      const result = await response.json();

      if (result.success) {
        this.teamResults = result.data;
        this.displayResults();
      }

    } catch (error) {
      console.error('Failed to load team results:', error);
      this.showError('Failed to load team results');
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('results-container').style.display = 'block';
    }
  }

  displayResults() {
    // Display SSI Scores
    const ssiContainer = document.getElementById('ssi-scores');
    const scores = this.teamResults.team_dimension_scores;

    ssiContainer.innerHTML = `
      <div class="score-card">
        <h3>Speed</h3>
        <div class="score-value ${this.getScoreClass(scores.speed)}">
          ${Math.round(scores.speed)}%
        </div>
        <small>Execution & Agility</small>
      </div>
      <div class="score-card">
        <h3>Strength</h3>
        <div class="score-value ${this.getScoreClass(scores.strength)}">
          ${Math.round(scores.strength)}%
        </div>
        <small>Resilience & Quality</small>
      </div>
      <div class="score-card">
        <h3>Intelligence</h3>
        <div class="score-value ${this.getScoreClass(scores.intelligence)}">
          ${Math.round(scores.intelligence)}%
        </div>
        <small>Innovation & Learning</small>
      </div>
    `;

    // Display Function Results
    const functionContainer = document.getElementById('function-results');
    const functionScores = this.teamResults.function_scores || {};

    functionContainer.innerHTML = '';
    Object.keys(functionScores).forEach(func => {
      const data = functionScores[func];
      functionContainer.innerHTML += `
        <div class="function-card">
          <h4>${func}</h4>
          <div class="mini-scores">
            <span>Speed: ${Math.round(data.speed)}%</span> |
            <span>Strength: ${Math.round(data.strength)}%</span> |
            <span>Intelligence: ${Math.round(data.intelligence)}%</span>
          </div>
          <div class="composite">
            Overall: <strong>${Math.round(data.composite)}%</strong>
          </div>
          ${data.weak_areas.length > 0 ?
            `<div class="weak-badge">⚠️ ${data.weak_areas.length} weak areas</div>` :
            '<div class="strong-badge">✓ No weak areas</div>'
          }
        </div>
      `;
    });

    // Display Weak Areas
    const weakAreasList = document.getElementById('weak-areas-list');
    const allWeakAreas = [];

    Object.keys(functionScores).forEach(func => {
      functionScores[func].weak_areas.forEach(area => {
        allWeakAreas.push(`${func} - ${area.dimension}: ${Math.round(area.score)}%`);
      });
    });

    if (allWeakAreas.length > 0) {
      weakAreasList.innerHTML = allWeakAreas
        .map(area => `<li>${area}</li>`)
        .join('');
    } else {
      weakAreasList.innerHTML = '<li>No weak areas identified - team is performing well!</li>';
    }
  }

  getScoreClass(score) {
    if (score < 70) return 'weak';
    if (score < 85) return 'moderate';
    return 'strong';
  }

  async generateOKRs() {
    try {
      const btn = document.getElementById('generate-okrs-btn');
      btn.disabled = true;
      btn.textContent = 'Generating OKRs...';

      // Call new endpoint (one of the few new things)
      const response = await fetch('/api/ai-okr/generate-from-team', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('karvia_auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_id: this.companyId,
          team_results: this.teamResults.team_dimension_scores,
          function_scores: this.teamResults.function_scores
        })
      });

      const result = await response.json();

      if (result.success) {
        this.suggestionId = result.suggestion_id;
        this.regenerationsLeft = result.regenerations_remaining;
        this.displayOKRs(result.objectives);

        // Show approval actions if authorized
        if (this.canApprove()) {
          document.getElementById('approval-actions').style.display = 'block';
          document.getElementById('regenerations-left').textContent = this.regenerationsLeft;
        }
      }

    } catch (error) {
      console.error('Failed to generate OKRs:', error);
      this.showError('Failed to generate OKRs');
    } finally {
      const btn = document.getElementById('generate-okrs-btn');
      btn.disabled = false;
      btn.textContent = 'Generate OKRs from These Results';
    }
  }

  displayOKRs(objectives) {
    const container = document.getElementById('okr-container');
    container.innerHTML = '';

    objectives.forEach((obj, index) => {
      // REUSE card pattern from existing pages
      const card = document.createElement('div');
      card.className = 'objective-card';
      card.innerHTML = `
        <div class="objective-header">
          <h3>${index + 1}. ${obj.title}</h3>
          <span class="function-badge">${obj.function}</span>
          <span class="priority-badge priority-${obj.priority}">${obj.priority}</span>
        </div>
        <p>${obj.description}</p>
        <div class="key-results">
          <h4>Key Results:</h4>
          <ul>
            ${obj.key_results.map(kr => `
              <li>
                <strong>${kr.title}</strong>
                <br>Target: ${kr.target} ${kr.metric}
              </li>
            `).join('')}
          </ul>
        </div>
        ${obj.weak_areas_addressed && obj.weak_areas_addressed.length > 0 ?
          `<div class="addresses-weak">
            Addresses: ${obj.weak_areas_addressed.map(w =>
              `${w.dimension} (${Math.round(w.score)}%)`
            ).join(', ')}
          </div>` : ''
        }
      `;
      container.appendChild(card);
    });

    document.getElementById('okr-section').style.display = 'block';
  }

  canApprove() {
    // REUSE existing role check pattern
    return ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'].includes(this.user.role);
  }

  async approveOKRs() {
    try {
      const response = await fetch('/api/ai-okr/approve-draft', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('karvia_auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          suggestion_id: this.suggestionId,
          action: 'approve'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to objectives page
        window.location.href = `/objectives.html?highlight=${result.objective_ids.join(',')}`;
      }

    } catch (error) {
      console.error('Failed to approve OKRs:', error);
      this.showError('Failed to approve OKRs');
    }
  }

  async regenerateOKRs() {
    if (this.regenerationsLeft <= 0) {
      this.showError('No regenerations remaining');
      return;
    }

    // Mark for regeneration
    await fetch('/api/ai-okr/approve-draft', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('karvia_auth_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        suggestion_id: this.suggestionId,
        action: 'regenerate'
      })
    });

    // Generate again
    await this.generateOKRs();
  }

  attachEventListeners() {
    document.getElementById('generate-okrs-btn')?.addEventListener('click',
      () => this.generateOKRs());

    document.getElementById('approve-btn')?.addEventListener('click',
      () => this.approveOKRs());

    document.getElementById('regenerate-btn')?.addEventListener('click',
      () => this.regenerateOKRs());
  }

  showError(message) {
    // REUSE existing error pattern
    console.error(message);
    alert(message);  // Replace with better UI in production
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  new TeamResultsDashboard();
});
```

---

### Day 4 (Nov 6): Fix Bugs & Frontend API Updates
**Time**: 4 hours
**Risk**: Low (small fixes)

#### Task 4.1: Fix OKR Display Bug (MODIFY EXISTING)
```javascript
// FIX: /client/pages/scripts/ai-okr-review.js
// Find around line 150 where it tries to load OKRs
// REPLACE:
const okrData = response.data.data;

// WITH:
const okrData = response.data.suggestion || response.data;
```

#### Task 4.2: Fix Objectives Page Bug (MODIFY EXISTING)
```javascript
// FIX: /client/pages/scripts/objectives.js
// Find where it loads objectives (around line 50)
// Make sure it includes company_id filter:

async function loadObjectives() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // FIX: Add company_id filter
  const response = await fetch('/api/objectives', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('karvia_auth_token')}`
    }
  });

  // The backend should filter by company_id from the token
  // But let's also filter client-side to be safe
  const data = await response.json();
  const objectives = data.objectives.filter(o => o.company_id === user.company_id);

  displayObjectives(objectives);
}
```

#### Task 4.3: Update API Clients (EXTEND EXISTING)
```javascript
// ADD TO: /client/js/assessment-api-client.js
// After existing methods (around line 200)

async getTeamResults(companyId) {
  // Use existing makeRequest pattern
  return this.makeRequest(`/api/assessments/team/${companyId}`);
}

// ADD TO: /client/js/ai-okr-api-client.js
// After existing methods

async generateFromTeamResults(data) {
  // Use existing makeRequest pattern
  return this.makeRequest('/api/ai-okr/generate-from-team', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async approveDraft(suggestionId, action = 'approve', editedObjectives = null) {
  // Use existing makeRequest pattern
  return this.makeRequest('/api/ai-okr/approve-draft', {
    method: 'POST',
    body: JSON.stringify({
      suggestion_id: suggestionId,
      action: action,
      edited_objectives: editedObjectives
    })
  });
}
```

---

### Day 5 (Nov 7): Testing & Integration
**Time**: 8 hours
**Risk**: Low (testing existing code)

#### Task 5.1: Update Navigation (MODIFY EXISTING)
```javascript
// MODIFY: /client/components/navbar.html
// Add link to team results page

<li class="nav-item">
  <a class="nav-link" href="/team-results-dashboard.html">
    Team Results
  </a>
</li>
```

#### Task 5.2: Test Complete Flow
```javascript
// Test Scenarios (use existing test data)

1. Complete Flow Test:
   - Login as Manager
   - Navigate to Team Results
   - Verify weighted scores display
   - Generate OKRs
   - Approve OKRs
   - Verify objectives appear in Objectives page

2. Role-Based Access:
   - Employee: Can view but not generate
   - Manager: Can generate and approve
   - Executive: Can see all teams

3. Regeneration Limit:
   - Generate OKRs
   - Regenerate 3 times
   - Verify 4th attempt blocked

4. Edge Cases:
   - No assessments: Graceful message
   - Single assessment: Still works
   - Missing functions: Generates placeholders
```

#### Task 5.3: Performance Testing
```javascript
// Use existing performance monitoring

1. Page Load Time:
   - Team results page < 2 seconds
   - OKR generation < 5 seconds

2. API Response Times:
   - GET /api/assessments/team < 500ms
   - POST /api/ai-okr/generate-from-team < 3000ms

3. Memory Usage:
   - No memory leaks
   - Clean event listener cleanup
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Before Starting ANY Task:
- [ ] Search codebase for existing implementation
- [ ] Check if endpoint already exists
- [ ] Look for similar patterns to copy
- [ ] Verify variable naming (company_id not business_id)
- [ ] Check existing API client methods

### Day 1 Checklist:
- [ ] Create assessment-config.js (NEW)
- [ ] Add aggregateTeamScoresWeighted to SSIScoringService (EXTEND)
- [ ] Update team endpoint to use weighted scores (MODIFY)
- [ ] Test with existing data

### Day 2 Checklist:
- [ ] Add /api/ai-okr/generate-from-team endpoint (NEW)
- [ ] Add /api/ai-okr/approve-draft endpoint (NEW)
- [ ] Update AIOKRSuggestion model fields (EXTEND)
- [ ] Test with Postman

### Day 3 Checklist:
- [ ] Create team-results-dashboard.html (NEW)
- [ ] Create team-results-dashboard.js (NEW)
- [ ] Reuse existing CSS patterns
- [ ] Test UI with different screen sizes

### Day 4 Checklist:
- [ ] Fix OKR display bug (MODIFY)
- [ ] Fix objectives page bug (MODIFY)
- [ ] Add methods to API clients (EXTEND)
- [ ] Test bug fixes

### Day 5 Checklist:
- [ ] Update navigation menu (MODIFY)
- [ ] Complete flow testing
- [ ] Role-based testing
- [ ] Performance testing
- [ ] Documentation update

---

## ⚠️ COMMON PITFALLS TO AVOID

### DON'T:
1. Create `/api/team/assessments` - use existing `/api/assessments/team`
2. Create new scoring service - extend SSIScoringService
3. Create business_id fields - use company_id
4. Modify existing method signatures - add new methods
5. Hardcode configurations - use assessment-config.js
6. Create duplicate models - use AIOKRSuggestion
7. Build new auth system - use existing middleware

### DO:
1. Search before creating
2. Extend before replacing
3. Copy patterns exactly
4. Test with existing data
5. Use existing error handling
6. Follow existing naming conventions
7. Reuse API client patterns

---

## 🚀 QUICK START COMMANDS

```bash
# Day 1: Backend setup
cd server
npm test  # Ensure existing tests pass

# Create config
touch config/assessment-config.js

# Test endpoints
curl -X GET http://localhost:8080/api/assessments/team/[company_id] \
  -H "Authorization: Bearer [token]"

# Day 3: Frontend setup
cd client/pages
# Create new files
touch team-results-dashboard.html
touch scripts/team-results-dashboard.js

# Day 5: Full test
npm run test:e2e
```

---

## 📊 SUCCESS METRICS

### Pre-Sprint Complete When:
1. ✅ Team results page shows weighted SSI scores
2. ✅ Function-based breakdowns visible
3. ✅ Weak areas identified (<70%)
4. ✅ OKR generation creates 4 objectives
5. ✅ Approval saves to Objectives
6. ✅ Objectives page displays them
7. ✅ Regeneration limited to 3 attempts
8. ✅ All role permissions work

---

**Document Status**: Complete Implementation Guide
**Approach**: Extend existing code - 70% reuse, 30% new
**Timeline**: 5 days (40 hours)
**Risk**: Low - building on tested foundation