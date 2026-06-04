# Sprint 5 Epic 1: OKR Generation Configuration - Implementation Specification

**Date**: November 25, 2025
**Epic**: Sprint 5 Epic 1 - OKR Generation Configuration
**Story Points**: 6-7
**Estimated Duration**: 1.5-2 days (12-16 hours)
**Status**: Ready for Implementation

---

## 📋 Executive Summary

**Goal**: Allow users to configure start date and period (quarterly/yearly) before generating OKRs, in two contexts:
1. **SSI-based generation** (team-ssi-view.html) - From assessment results
2. **Manual generation** (objectives.html) - User-provided objective description

**Key Principle**: Maximum reuse, minimum new code

---

## 🎯 Features Overview

### Feature 1: SSI-Based OKR Generation Configuration

**Current Flow:**
```
User completes assessment → View results → Click "Generate OKRs"
→ OKRs created immediately (start=today, period=yearly)
→ Redirect to objectives page
```

**New Flow:**
```
User completes assessment → View results → Click "Generate OKRs"
→ Configuration modal appears ✨
→ User selects: start date + period (quarterly/yearly)
→ Preview shown: "Q1-Q4 2026"
→ Click "Generate"
→ OKRs created with configuration
→ Redirect to objectives page
```

---

### Feature 2: Manual Objective Generation with AI

**Current Flow:**
```
User on objectives page → Click "Create Objective"
→ Modal with: title, description, dates, category
→ Optional: Click "Get AI Suggestions" (generates KRs only)
→ User must add KRs manually
→ Click "Create Objective"
```

**New Flow:**
```
User on objectives page → Click "Create Objective"
→ Modal with: objective description, start date, timeline
→ Click "Generate Complete OKR" ✨
→ AI creates objective + 3-5 KRs automatically
→ Preview shown
→ User reviews and approves
→ Objective created
```

---

## 🔧 Implementation Plan

### Phase 1: SSI-Based Configuration (4-5 hours)

#### Step 1.1: Configuration Modal UI (2 hours)

**File**: `client/pages/scripts/team-ssi-view.js`

**Add after line 789 (end of generateOKRs function):**

```javascript
/**
 * Show OKR configuration modal before generation
 * Returns: { start_date, period } or null if cancelled
 */
showOKRConfigModal() {
  return new Promise((resolve) => {
    // Create modal HTML
    const modalHTML = `
      <div id="okrConfigModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
            <h2 class="text-2xl font-bold text-white">Configure OKR Generation</h2>
            <p class="text-white opacity-90 text-sm mt-1">Set your planning timeline</p>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-6">
            <!-- Start Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                📅 Start Date
              </label>
              <input type="date" id="okrStartDate"
                value="${this.getDefaultStartDate()}"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <p class="text-xs text-gray-600 mt-1">When should your OKRs begin?</p>
            </div>

            <!-- Period Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                📊 Planning Period
              </label>
              <div class="space-y-3">
                <label class="flex items-start p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition-all">
                  <input type="radio" name="okrPeriod" value="quarterly"
                    class="mt-1 mr-3 h-4 w-4 text-purple-600">
                  <div>
                    <div class="font-semibold text-gray-900">Quarterly (3 months)</div>
                    <div class="text-xs text-gray-600 mt-1">Fast-paced goals, reviewed every quarter</div>
                  </div>
                </label>
                <label class="flex items-start p-4 border-2 border-purple-600 bg-purple-50 rounded-lg cursor-pointer">
                  <input type="radio" name="okrPeriod" value="yearly" checked
                    class="mt-1 mr-3 h-4 w-4 text-purple-600">
                  <div>
                    <div class="font-semibold text-gray-900">Yearly (12 months)</div>
                    <div class="text-xs text-gray-600 mt-1">Strategic objectives, reviewed annually</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Preview -->
            <div id="okrPreview" class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
              <div id="okrPreviewContent" class="text-sm text-gray-600">
                <!-- Updated dynamically -->
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between p-6 border-t border-gray-200">
            <button id="okrConfigCancel" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button id="okrConfigGenerate" class="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90">
              Generate OKRs →
            </button>
          </div>
        </div>
      </div>
    `;

    // Append to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Update preview on change
    const updatePreview = () => {
      const startDate = new Date(document.getElementById('okrStartDate').value);
      const period = document.querySelector('input[name="okrPeriod"]:checked').value;

      const endDate = new Date(startDate);
      if (period === 'quarterly') {
        endDate.setMonth(endDate.getMonth() + 3);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      const preview = document.getElementById('okrPreviewContent');
      preview.innerHTML = `
        <div class="space-y-1">
          <div>• <strong>Start:</strong> ${this.formatDate(startDate)}</div>
          <div>• <strong>End:</strong> ${this.formatDate(endDate)}</div>
          <div>• <strong>Duration:</strong> ${period === 'quarterly' ? '1 Quarter (3 months)' : '4 Quarters (12 months)'}</div>
        </div>
      `;
    };

    // Event listeners
    document.getElementById('okrStartDate').addEventListener('change', updatePreview);
    document.querySelectorAll('input[name="okrPeriod"]').forEach(radio => {
      radio.addEventListener('change', updatePreview);
    });

    document.getElementById('okrConfigCancel').addEventListener('click', () => {
      document.getElementById('okrConfigModal').remove();
      resolve(null);
    });

    document.getElementById('okrConfigGenerate').addEventListener('click', () => {
      const config = {
        start_date: document.getElementById('okrStartDate').value,
        period: document.querySelector('input[name="okrPeriod"]:checked').value
      };
      document.getElementById('okrConfigModal').remove();
      resolve(config);
    });

    // Initial preview
    updatePreview();
  });
}

/**
 * Get default start date (tomorrow)
 */
getDefaultStartDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Format date for display
 */
formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
```

**Modify existing generateOKRs function (line 737):**

```javascript
async generateOKRs() {
  try {
    const btn = document.getElementById('generate-okrs-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Configuring...';
    }

    // NEW: Show configuration modal FIRST
    const config = await this.showOKRConfigModal();
    if (!config) {
      // User cancelled
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Generate OKRs';
      }
      return;
    }

    if (btn) {
      btn.textContent = 'Generating...';
    }

    const token = localStorage.getItem('karvia_token');
    const response = await fetch('/api/ai-okr/generate-from-company', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        company_id: this.companyId,
        overall_scores: this.teamResults.overall_scores,
        teams: this.teamResults.teams,
        by_function: this.teamResults.by_function,
        weak_areas: this.teamResults.weak_areas,
        completion_stats: {
          total_members: this.teamResults.total_members,
          total_completed: this.teamResults.total_completed,
          completion_rate: this.teamResults.completion_rate
        },
        start_date: config.start_date,  // NEW
        period: config.period            // NEW
      })
    });

    // ... rest of function unchanged
  }
}
```

**Effort**: 2 hours

---

#### Step 1.2: Backend API Update (2-3 hours)

**File**: `server/routes/ai-okr.js`

**Modify generate-from-company endpoint (lines 979-1300):**

```javascript
router.post('/generate-from-company', async (req, res) => {
    try {
        const {
            company_id,
            overall_scores,
            teams,
            by_function,
            weak_areas,
            completion_stats,
            start_date,  // NEW
            period       // NEW: 'quarterly' or 'yearly'
        } = req.body;

        const userId = req.user.id;
        const userRole = req.user.role;

        // Validate new parameters
        if (start_date) {
            const startDate = new Date(start_date);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid start date'
                });
            }
        }

        if (period && !['quarterly', 'yearly'].includes(period)) {
            return res.status(400).json({
                success: false,
                error: 'Period must be quarterly or yearly'
            });
        }

        // ... existing company validation code ...

        // Lines 1206-1262: Update date calculation
        const now = start_date ? new Date(start_date) : new Date();
        const endDate = new Date(now);

        // Calculate end date based on period
        if (period === 'quarterly') {
            endDate.setMonth(endDate.getMonth() + 3);  // +3 months
        } else {
            // Default to yearly if not specified
            endDate.setFullYear(endDate.getFullYear() + 1);  // +1 year
        }

        // Get target year from end date
        const targetYear = endDate.getFullYear();

        // ... existing objective creation code (lines 1215-1275) ...

        // Lines 1277-1284: Store configuration
        company.okr_generation = {
            generated: true,
            generation_date: new Date(),
            start_date: now,               // NEW: Store user's choice
            period: period || 'yearly',    // NEW: Store period
            generation_count: (company.okr_generation?.generation_count || 0) + 1,
            regeneration_history: company.okr_generation?.regeneration_history || []
        };
        await company.save();

        logger.info(`[AI OKR Routes] Generated ${savedObjectiveIds.length} ${period || 'yearly'} objectives starting ${now.toISOString()}`);

        res.status(200).json({
            success: true,
            message: `Generated ${savedObjectiveIds.length} ${period === 'quarterly' ? 'quarterly' : 'yearly'} objectives`,
            objective_ids: savedObjectiveIds.map(id => id.toString()),
            count: savedObjectiveIds.length,
            configuration: {
                start_date: now,
                end_date: endDate,
                period: period || 'yearly'
            }
        });

    } catch (error) {
        // ... existing error handling ...
    }
});
```

**Effort**: 2-3 hours (includes testing)

---

#### Step 1.3: Company Model Update (15 min)

**File**: `server/models/Company.js`

**Find okr_generation schema and update:**

```javascript
okr_generation: {
  generated: {
    type: Boolean,
    default: false
  },
  generation_date: Date,
  start_date: Date,        // NEW: When OKRs start
  period: {                // NEW: Planning period
    type: String,
    enum: ['quarterly', 'yearly'],
    default: 'yearly'
  },
  generation_count: {
    type: Number,
    default: 0
  },
  regeneration_history: [Date]
}
```

**Effort**: 15 minutes

---

### Phase 2: Manual Objective Generation (3-4 hours)

#### Step 2.1: Add "Generate Complete OKR" Button (1 hour)

**File**: `client/pages/objectives.html`

**Add after line 354 (after AI Suggestions button):**

```html
<!-- Generate Complete OKR with AI -->
<div class="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-dashed border-green-300 rounded-lg p-4 mb-6">
    <div class="flex items-center justify-between">
        <div>
            <h4 class="font-semibold text-gray-900 mb-1">🚀 Quick Start</h4>
            <p class="text-sm text-gray-600">Generate a complete objective with Key Results instantly</p>
        </div>
        <button onclick="generateCompleteOKR()" class="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 flex items-center space-x-2 whitespace-nowrap">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
            </svg>
            <span>Generate Complete OKR</span>
        </button>
    </div>
</div>
```

**Effort**: 30 minutes

---

#### Step 2.2: Generate Complete OKR Function (2 hours)

**File**: `client/pages/objectives.html`

**Add after line 625 (after createObjective function):**

```javascript
/**
 * Generate complete OKR with AI (objective + KRs)
 */
async function generateCompleteOKR() {
    try {
        // Validate inputs
        const objectiveTitle = document.getElementById('objectiveTitle').value.trim();
        const objectiveDescription = document.getElementById('objectiveDescription').value.trim();

        if (!objectiveTitle) {
            showToast('Please enter an objective title or description', 'error');
            return;
        }

        // Show loading state
        showToast('Generating complete OKR with AI...', 'info');

        const periodType = document.querySelector('input[name="periodType"]:checked').value;
        const quarters = calculateQuarters(periodType);

        const token = localStorage.getItem('karvia_token');
        const user = JSON.parse(localStorage.getItem('karvia_user'));

        // Gather context
        const context = {
            objective_text: objectiveTitle,
            objective_description: objectiveDescription,
            company_id: user.company_id,
            category: document.getElementById('objectiveCategory').value,
            priority: document.getElementById('objectivePriority').value,
            time_period_type: periodType,
            quarters: quarters.map(q => ({
                quarter: q.quarter,
                start_date: q.start_date,
                end_date: q.end_date
            }))
        };

        // Add fiscal year info if applicable
        if (periodType === 'fiscal_year') {
            context.fiscal_year_start_month = parseInt(document.getElementById('fiscalStartMonth').value);
            context.target_year = parseInt(document.getElementById('fiscalYear').value);
        } else if (periodType === 'calendar_year') {
            context.target_year = parseInt(document.getElementById('targetYear').value);
        } else if (periodType === 'custom') {
            context.custom_duration = parseInt(document.getElementById('durationSlider').value);
            context.custom_start_date = document.getElementById('customStartDate').value;
        }

        // Call new API endpoint
        const response = await fetch('/api/ai-okr/generate-single-objective', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(context)
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to generate OKR');
        }

        // Show preview modal
        showOKRPreviewModal(result.objective);

    } catch (error) {
        console.error('Error generating complete OKR:', error);
        showToast(error.message || 'Failed to generate OKR', 'error');
    }
}

/**
 * Show OKR preview modal for approval
 */
function showOKRPreviewModal(objective) {
    const modalHTML = `
        <div id="okrPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                <!-- Header -->
                <div class="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-t-2xl">
                    <h2 class="text-2xl font-bold text-white">Review Generated OKR</h2>
                    <p class="text-white opacity-90 text-sm mt-1">Review and approve before creating</p>
                </div>

                <!-- Body -->
                <div class="p-6 space-y-6">
                    <!-- Objective -->
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-lg font-semibold text-gray-900">${objective.title}</h3>
                            <span class="text-xs px-2 py-1 rounded ${
                                objective.priority === 'high' ? 'bg-red-100 text-red-700' :
                                objective.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }">${objective.priority}</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">${objective.description}</p>

                        <!-- Key Results -->
                        <div class="bg-gray-50 rounded p-3">
                            <p class="text-xs font-medium text-gray-700 mb-2">Key Results:</p>
                            <ul class="space-y-2">
                                ${objective.key_results.map((kr, index) => `
                                    <li class="text-sm text-gray-700">
                                        <span class="font-semibold">${index + 1}.</span> ${kr.title}
                                        <div class="text-xs text-gray-600 mt-1">
                                            Target: ${kr.target_value} ${kr.unit} | Quarter: Q${kr.quarter}
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-sm text-blue-800">
                            ✨ Generated by AI. You can edit this objective after creation if needed.
                        </p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between p-6 border-t border-gray-200">
                    <button onclick="closeOKRPreview()" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                        Cancel
                    </button>
                    <button onclick="approveGeneratedOKR()" class="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90">
                        ✓ Create Objective
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Store objective data for approval
    window.generatedObjective = objective;
}

function closeOKRPreview() {
    document.getElementById('okrPreviewModal')?.remove();
    delete window.generatedObjective;
}

async function approveGeneratedOKR() {
    try {
        const objective = window.generatedObjective;
        if (!objective) return;

        showToast('Creating objective...', 'info');

        const token = localStorage.getItem('karvia_token');
        const response = await fetch('/api/objectives', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objective)
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Failed to create objective');
        }

        showToast('✓ Objective created successfully!', 'success');
        closeOKRPreview();
        closeCreateObjectiveModal();
        await loadObjectives(); // Refresh list

    } catch (error) {
        console.error('Error creating objective:', error);
        showToast(error.message || 'Failed to create objective', 'error');
    }
}
```

**Effort**: 2 hours

---

#### Step 2.3: Backend Endpoint for Single OKR Generation (1-2 hours)

**File**: `server/routes/ai-okr.js`

**Add new endpoint after generate-from-company:**

```javascript
/**
 * POST /api/ai-okr/generate-single-objective
 * Generate a single objective with KRs from user description
 * Access: EXECUTIVE, BUSINESS_OWNER, MANAGER
 */
router.post('/generate-single-objective', async (req, res) => {
    try {
        const {
            objective_text,
            objective_description,
            company_id,
            category,
            priority,
            time_period_type,
            quarters,
            fiscal_year_start_month,
            target_year,
            custom_duration,
            custom_start_date
        } = req.body;

        const userId = req.user.id;

        // Validate company ownership
        const company = await Company.findOne({
            _id: company_id,
            $or: [
                { owner_id: userId },
                { managed_by: userId }
            ]
        });

        if (!company) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to create objectives for this company'
            });
        }

        // Gather context for AI
        const context = {
            company_name: company.company_name,
            industry: company.industry,
            objective_text,
            objective_description,
            category,
            priority,
            time_period_type,
            quarters
        };

        // Fetch existing objectives for context
        const existingObjectives = await Objective.find({
            company_id: company_id,
            status: 'active'
        }).select('title category').limit(10);

        if (existingObjectives.length > 0) {
            context.existing_objectives = existingObjectives.map(obj => ({
                title: obj.title,
                category: obj.category
            }));
        }

        // Fetch assessment data if available
        const latestAssessment = await Assessment.findOne({
            company_id: company_id
        }).sort({ created_at: -1 }).select('results overall_score');

        if (latestAssessment) {
            context.assessment_scores = latestAssessment.overall_score;
        }

        // Build AI prompt
        const prompt = `
You are an OKR (Objectives and Key Results) consultant helping a company create a SMART objective.

Company Context:
- Name: ${company.company_name}
${company.industry ? `- Industry: ${company.industry}` : ''}
${context.existing_objectives ? `- Existing Objectives: ${context.existing_objectives.map(o => o.title).join(', ')}` : ''}
${context.assessment_scores ? `- Assessment Scores: Speed ${context.assessment_scores.speed}%, Strength ${context.assessment_scores.strength}%, Intelligence ${context.assessment_scores.intelligence}%` : ''}

User wants to create this objective:
"${objective_text}"
${objective_description ? `Description: ${objective_description}` : ''}

Generate:
1. A refined objective title (clear, inspiring, achievable)
2. A detailed objective description (why it matters, expected outcome)
3. 3-5 Key Results (SMART: Specific, Measurable, Achievable, Relevant, Time-bound)

Requirements for Key Results:
- Each must be measurable with a numeric target
- Distribute across ${quarters.length} quarters (Q1-Q${quarters.length})
- Use appropriate metric types: number, percentage, currency, or boolean
- Include current_value: 0 and target_value

Return JSON format:
{
  "title": "Refined objective title",
  "description": "Detailed description",
  "category": "${category}",
  "priority": "${priority}",
  "time_period_type": "${time_period_type}",
  "target_year": ${target_year || new Date().getFullYear()},
  "key_results": [
    {
      "title": "KR title",
      "metric_type": "percentage",
      "current_value": 0,
      "target_value": 80,
      "unit": "%",
      "quarter": 1
    }
  ]
}
`;

        // Call OpenAI (with fallback)
        let objective;

        if (process.env.OPENAI_API_KEY) {
            try {
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

                const completion = await openai.chat.completions.create({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: 'You are an OKR expert consultant. Always respond with valid JSON only.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1500
                });

                const generatedText = completion.choices[0].message.content.trim();

                // Parse JSON
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    objective = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Invalid JSON response from AI');
                }

            } catch (aiError) {
                logger.error('[AI OKR] OpenAI generation failed, using template:', aiError);
                // Fallback to template
                objective = generateTemplateObjective(context);
            }
        } else {
            // No API key, use template
            objective = generateTemplateObjective(context);
        }

        // Add additional fields
        objective.company_id = company_id;
        objective.owner_id = userId;
        objective.created_by = userId;
        objective.ai_generated = true;
        objective.status = 'active';

        if (fiscal_year_start_month) {
            objective.fiscal_year_start_month = fiscal_year_start_month;
        }
        if (custom_duration) {
            objective.custom_duration_months = custom_duration;
        }
        if (custom_start_date) {
            objective.start_date = new Date(custom_start_date);
        }

        // Sanitize KR metric types
        objective.key_results = objective.key_results.map(kr => ({
            ...kr,
            metric_type: sanitizeMetricType(kr.metric_type),
            status: 'not_started'
        }));

        logger.info(`[AI OKR Routes] Generated single objective: ${objective.title}`);

        res.status(200).json({
            success: true,
            objective,
            message: 'Objective generated successfully'
        });

    } catch (error) {
        logger.error('[AI OKR Routes] Single objective generation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate objective',
            message: error.message
        });
    }
});

/**
 * Generate template objective when AI is unavailable
 */
function generateTemplateObjective(context) {
    const krTemplates = {
        growth: [
            { title: 'Increase monthly active users', metric_type: 'percentage', target_value: 25, unit: '%', quarter: 1 },
            { title: 'Achieve revenue growth', metric_type: 'currency', target_value: 100000, unit: '$', quarter: 2 },
            { title: 'Expand market share', metric_type: 'percentage', target_value: 15, unit: '%', quarter: 3 }
        ],
        customer_success: [
            { title: 'Improve customer satisfaction score', metric_type: 'percentage', target_value: 90, unit: '%', quarter: 1 },
            { title: 'Reduce customer churn rate', metric_type: 'percentage', target_value: 5, unit: '%', quarter: 2 },
            { title: 'Increase Net Promoter Score', metric_type: 'number', target_value: 50, unit: 'points', quarter: 3 }
        ],
        operational_efficiency: [
            { title: 'Reduce operational costs', metric_type: 'percentage', target_value: 20, unit: '%', quarter: 1 },
            { title: 'Improve process efficiency', metric_type: 'percentage', target_value: 30, unit: '%', quarter: 2 },
            { title: 'Automate manual tasks', metric_type: 'number', target_value: 10, unit: 'tasks', quarter: 3 }
        ]
    };

    const templates = krTemplates[context.category] || krTemplates.growth;

    return {
        title: context.objective_text,
        description: context.objective_description || `Achieve ${context.objective_text} through focused execution and measurement`,
        category: context.category,
        priority: context.priority,
        time_period_type: context.time_period_type,
        target_year: context.target_year || new Date().getFullYear(),
        key_results: templates.slice(0, 3).map(kr => ({
            ...kr,
            current_value: 0
        }))
    };
}

// Helper function (reuse from generate-from-company)
function sanitizeMetricType(metricType) {
    const validTypes = ['number', 'percentage', 'boolean', 'currency'];
    const normalized = metricType?.toLowerCase();

    const typeMap = {
        'score': 'number',
        'count': 'number',
        'points': 'number',
        'rating': 'number',
        'percent': 'percentage',
        'money': 'currency',
        'dollar': 'currency',
        'yes/no': 'boolean',
        'true/false': 'boolean'
    };

    if (validTypes.includes(normalized)) {
        return normalized;
    }

    return typeMap[normalized] || 'number';
}
```

**Effort**: 1-2 hours

---

### Phase 3: Planning Page Integration (2-3 hours)

#### Step 3.1: Fetch and Use Configuration (2-3 hours)

**File**: `client/pages/planning.html`

**Modify loadObjectives function (around line 300):**

```javascript
async function loadObjectives() {
    try {
        const token = localStorage.getItem('karvia_token');
        const user = JSON.parse(localStorage.getItem('karvia_user'));
        const companyId = user.company_id;

        // Fetch company info to get OKR configuration
        const companyResponse = await fetch(`/api/companies/${companyId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const companyData = await companyResponse.json();

        // Get OKR configuration
        const okrConfig = companyData.company?.okr_generation || {};
        const configStartDate = okrConfig.start_date ? new Date(okrConfig.start_date) : null;
        const configPeriod = okrConfig.period || 'yearly';

        // Store for use in planning calculations
        window.okrConfiguration = {
            start_date: configStartDate,
            period: configPeriod,
            has_config: okrConfig.generated || false
        };

        // Log for debugging
        console.log('[Planning] OKR Configuration:', window.okrConfiguration);

        // ... rest of loadObjectives function ...

        // When calculating quarters/weeks, use configuration:
        // const baseDate = window.okrConfiguration.start_date || new Date();

    } catch (error) {
        console.error('Error loading objectives:', error);
    }
}
```

**Add helper function to use configuration:**

```javascript
/**
 * Get quarter start date based on OKR configuration
 */
function getQuarterStartDate(objectiveId, quarterNumber) {
    // Check if this objective has OKR configuration
    const config = window.okrConfiguration;

    if (config && config.has_config && config.start_date) {
        // Use configured start date
        const startDate = new Date(config.start_date);

        // Calculate quarter start based on period
        if (config.period === 'quarterly') {
            // Each generation is one quarter
            return startDate;
        } else {
            // Yearly: Calculate quarter within year
            startDate.setMonth(startDate.getMonth() + (quarterNumber - 1) * 3);
            return startDate;
        }
    }

    // Fallback: Use objective's own dates or current date
    // ... existing logic ...
}
```

**Effort**: 2-3 hours

---

## 📊 Files Changed Summary

| File | Lines Changed | Type | Effort |
|------|--------------|------|--------|
| `client/pages/scripts/team-ssi-view.js` | +180 | Frontend | 2h |
| `server/routes/ai-okr.js` | +250 | Backend | 3-4h |
| `server/models/Company.js` | +10 | Model | 15m |
| `client/pages/objectives.html` | +200 | Frontend | 3h |
| `client/pages/planning.html` | +50 | Frontend | 2-3h |

**Total**: ~640 new lines, 5 files modified

---

## 🧪 Testing Checklist

### Unit Tests

- [ ] Company model saves OKR configuration
- [ ] Date validation rejects invalid dates
- [ ] Period validation rejects invalid values
- [ ] Quarterly calculation: start + 3 months
- [ ] Yearly calculation: start + 12 months

### Integration Tests

- [ ] SSI-based generation with configuration
- [ ] Manual generation with AI
- [ ] Planning page reads configuration
- [ ] Quarter calculations use configuration
- [ ] Multiple objectives with different periods

### End-to-End Tests

**Test 1: SSI-Based Generation**
1. Complete assessment
2. View results
3. Click "Generate OKRs"
4. Configuration modal appears
5. Select start date: Tomorrow
6. Select period: Quarterly
7. Preview shows: "Q1 2025: Nov 26 - Feb 26"
8. Click "Generate"
9. 4 objectives created with correct dates
10. Planning page shows correct quarters

**Test 2: Manual Generation**
1. Go to objectives page
2. Click "Create Objective"
3. Enter: "Increase customer satisfaction"
4. Click "Generate Complete OKR"
5. AI generates objective + 3 KRs
6. Preview modal appears
7. Review and approve
8. Objective created successfully

**Test 3: Planning Page**
1. Generate OKRs with start_date: Jan 1, 2026
2. Go to planning page
3. Verify quarters show: Q1 2026, Q2 2026, Q3 2026, Q4 2026
4. Create weekly goals
5. Weeks align with configuration

### Edge Cases

- [ ] Start date in past (show warning, allow)
- [ ] Start date 1 year in future (allow)
- [ ] User cancels configuration modal (no API call)
- [ ] OpenAI unavailable (template fallback)
- [ ] Mixed period types (quarterly + yearly objectives)
- [ ] Configuration without assessment data
- [ ] Consultant viewing multiple companies

---

## 📝 Documentation Updates

### User Guide

**Add to user documentation:**

```markdown
## Configuring OKR Generation

### From Assessment Results

1. Complete your team's SSI assessment
2. Review the results page
3. Click "Generate OKRs"
4. In the configuration modal:
   - Select your start date (when OKRs should begin)
   - Choose your planning period:
     - **Quarterly**: 3-month cycles (fast-paced goals)
     - **Yearly**: 12-month cycles (strategic objectives)
5. Review the preview
6. Click "Generate" to create your OKRs

### Manual Objective Creation

1. Go to Objectives page
2. Click "Create Objective"
3. Enter your objective description
4. Click "Generate Complete OKR"
5. AI will create:
   - A refined objective title and description
   - 3-5 measurable Key Results
6. Review the preview
7. Approve to create the objective

### Tips

- **Start Date**: Choose when your OKRs should actually begin
  - Today: Start immediately
  - Tomorrow: Review before starting
  - Future date: Plan ahead for next quarter/year

- **Period Selection**:
  - **Quarterly**: Best for startups, agile teams, fast-changing markets
  - **Yearly**: Best for strategic planning, stable industries, long-term goals

- **Planning Page**: After generation, the planning page automatically uses your configuration for quarter calculations
```

---

## 🚀 Deployment Plan

### Pre-Deployment

1. [ ] Code review completed
2. [ ] All tests passing
3. [ ] Documentation updated
4. [ ] Staging environment tested
5. [ ] Database backup created

### Deployment Steps

1. **Backend Changes** (Zero Downtime)
   - Deploy `server/models/Company.js` (additive fields only)
   - Deploy `server/routes/ai-okr.js` (new parameters optional)
   - No migration needed (additive schema changes)

2. **Frontend Changes**
   - Deploy `client/pages/scripts/team-ssi-view.js`
   - Deploy `client/pages/objectives.html`
   - Deploy `client/pages/planning.html`
   - Clear CDN cache

3. **Verification**
   - Test SSI-based generation on production
   - Test manual generation on production
   - Test planning page with new configuration
   - Monitor error logs for 1 hour

### Rollback Plan

If issues occur:

1. **Backend Rollback**
   - Revert `ai-okr.js` (backend handles missing parameters gracefully)
   - Company model changes are additive (safe to keep)

2. **Frontend Rollback**
   - Revert frontend files
   - Clear CDN cache
   - System continues working with defaults (start=today, period=yearly)

---

## ✅ Success Metrics

**Track these metrics post-deployment:**

1. **Configuration Usage**
   - % of users who configure dates (target: 80%+)
   - % choosing non-default settings (target: 50%+)
   - Most common period choice (quarterly vs yearly)

2. **Generation Success**
   - SSI-based generation success rate (target: 95%+)
   - Manual generation success rate (target: 90%+)
   - AI vs template usage ratio

3. **User Experience**
   - Time to complete configuration (target: <30 seconds)
   - Configuration cancellation rate (target: <10%)
   - Support tickets about dates (target: decrease by 50%)

4. **Planning Page**
   - Correct quarter display (target: 100%)
   - Milestone creation errors (target: decrease by 30%)

---

## 📋 Acceptance Criteria

**Feature is complete when:**

- [ ] SSI-based generation shows configuration modal
- [ ] User can select start date and period
- [ ] Configuration preview is accurate
- [ ] Backend accepts and stores configuration
- [ ] Company model has new fields
- [ ] Manual generation with AI works
- [ ] Preview modal shows generated OKR
- [ ] Planning page reads configuration
- [ ] Quarter calculations use configuration
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Deployed to production
- [ ] Zero critical bugs in first week

---

## 🎯 Next Steps After Implementation

**Sprint 5 Epic 0 (Milestones) will benefit from this:**
- Planning page knows OKR start date and period
- Milestone calculations automatically align
- Week numbering is correct from the start

**Future Enhancements (Sprint 6+):**
1. Period templates ("Startup Mode", "Enterprise Mode")
2. Preview with quarter date ranges
3. Company industry context for AI
4. Historical configuration display

---

**Ready for implementation!**

**Estimated Total Effort**: 12-16 hours (6-7 story points)
**Priority**: High (before Milestones)
**Risk**: Low (additive changes only)
**Value**: High (addresses core user pain point)

