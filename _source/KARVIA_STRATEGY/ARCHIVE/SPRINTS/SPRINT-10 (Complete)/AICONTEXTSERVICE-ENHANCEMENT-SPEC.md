# AIContextService Enhancement Specification

**Created**: January 9, 2026
**Purpose**: Unified AI context provider for Epic L and Epic M
**Reference**: SPRINT-10-11-AUDIT-REPORT.md (Resolution 3)

---

## Problem Statement

Both Epic L (Planning Page) and Epic M (OKR Wizard) build similar AI context independently, leading to:
1. Code duplication
2. Inconsistent context structure
3. Maintenance burden

---

## Solution: Enhanced AIContextService

Create a unified service that provides context for all AI features in the platform.

---

## File Location

`server/services/AIContextService.js` (ENHANCE EXISTING)

---

## API Design

### Base Context (Shared by ALL AI features)

```javascript
/**
 * Base context used by ALL AI features
 * @param {ObjectId} companyId
 * @returns {Object} Base context with company + SSI + business_metrics
 */
async getBaseContext(companyId) {
  const [company, ssiData] = await Promise.all([
    Company.findById(companyId)
      .select('name industry industry_subtype employee_count business_metrics profile_completion')
      .lean(),
    this.getLatestSSI(companyId)
  ]);

  return {
    company: {
      id: companyId.toString(),
      name: company.name,
      industry: company.industry,
      industry_subtype: company.industry_subtype || null,
      employee_count: company.employee_count,
      size_category: this.categorizeSize(company.employee_count),
      business_metrics: this.mapToObject(company.business_metrics),
      profile_completion: company.profile_completion?.percentage || 0
    },
    ssi: {
      overall: {
        speed: ssiData?.speed || 0,
        strength: ssiData?.strength || 0,
        intelligence: ssiData?.intelligence || 0
      },
      blocks: ssiData?.blocks || {},
      weakest: this.getWeakestBlocks(ssiData, 3),
      strongest: this.getStrongestBlocks(ssiData, 3)
    },
    timestamp: new Date().toISOString()
  };
}
```

### OKR Generation Context (Epic M)

```javascript
/**
 * Context for OKR generation wizard
 * Used by: Epic M - OKR Wizard
 * @param {ObjectId} companyId
 * @param {Object} options - Generation options
 * @returns {Object} Full context for OKR generation
 */
async getOKRGenerationContext(companyId, options = {}) {
  const [base, objectives, teams] = await Promise.all([
    this.getBaseContext(companyId),
    Objective.find({
      company_id: companyId,
      status: { $nin: ['cancelled'] },
      level: 'company'
    }).lean(),
    Team.find({ company_id: companyId, status: 'active' }).lean()
  ]);

  // Calculate gap analysis
  const gapAnalysis = this.analyzePortfolioGaps(objectives);

  return {
    ...base,
    objectives: {
      existing: objectives.map(o => ({
        id: o._id.toString(),
        title: o.title,
        category: o.category,
        status: o.status,
        progress: o.progress_percentage || 0
      })),
      by_category: this.groupByCategory(objectives),
      total: objectives.length,
      active: objectives.filter(o => o.status === 'active').length
    },
    teams: teams.map(t => ({
      id: t._id.toString(),
      name: t.name,
      member_count: t.members?.length || 0
    })),
    gap_analysis: gapAnalysis,
    request: {
      mode: options.mode || 'new', // 'new' | 'gap_fill' | 'cascade'
      categories: options.categories || [],
      team_id: options.team_id || null,
      parent_objective_id: options.parent_objective_id || null
    }
  };
}
```

### Weekly Goal Context (Epic L)

```javascript
/**
 * Context for weekly goal AI suggestions
 * Used by: Epic L - Planning Page
 * @param {ObjectId} companyId
 * @param {ObjectId} keyResultId
 * @param {number} targetWeek
 * @returns {Object} Full context for weekly goal generation
 */
async getWeeklyGoalContext(companyId, keyResultId, targetWeek) {
  const [base, keyResult, weeklyGoals, tasks] = await Promise.all([
    this.getBaseContext(companyId),
    KeyResult.findById(keyResultId).populate('objective_id').lean(),
    Goal.find({
      key_result_id: keyResultId,
      time_period: 'WEEKLY'
    }).sort({ week_number: 1 }).lean(),
    Task.find({ key_result_id: keyResultId }).lean()
  ]);

  // Calculate week history with task completion
  const weekHistory = weeklyGoals.map(week => {
    const weekTasks = tasks.filter(t =>
      t.weekly_goal_id?.toString() === week._id.toString()
    );
    const completed = weekTasks.filter(t => t.status === 'completed').length;
    const total = weekTasks.length;

    return {
      week_number: week.week_number,
      title: week.title || null,
      tasks: weekTasks.map(t => ({
        title: t.title,
        status: t.status,
        blocker: t.blocker || null
      })),
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      is_past: new Date(week.end_date) < new Date(),
      is_current: this.isCurrentWeek(week.start_date, week.end_date)
    };
  });

  return {
    ...base,
    objective: {
      id: keyResult.objective_id._id.toString(),
      title: keyResult.objective_id.title,
      category: keyResult.objective_id.category
    },
    key_result: {
      id: keyResultId.toString(),
      title: keyResult.title,
      current: keyResult.current_value,
      target: keyResult.target_value,
      unit: keyResult.unit,
      progress: Math.round((keyResult.current_value / keyResult.target_value) * 100)
    },
    week_history: weekHistory,
    target_week: targetWeek,
    total_weeks: weeklyGoals.length || 13,
    analysis: {
      weeks_planned: weekHistory.filter(w => w.title).length,
      weeks_complete: weekHistory.filter(w => w.completion_rate === 100).length,
      avg_completion: this.calculateAvgCompletion(weekHistory),
      blockers: this.extractBlockers(weekHistory),
      on_track: this.assessProgress(weekHistory, targetWeek)
    }
  };
}
```

---

## Helper Methods

```javascript
/**
 * Analyze portfolio gaps across 6 MECE categories
 */
analyzePortfolioGaps(objectives) {
  const CATEGORIES = ['growth', 'customer_success', 'operations', 'people_culture', 'innovation', 'financial_health'];
  const counts = {};
  CATEGORIES.forEach(cat => counts[cat] = 0);

  objectives.forEach(obj => {
    if (counts[obj.category] !== undefined) {
      counts[obj.category]++;
    }
  });

  const gaps = CATEGORIES
    .filter(cat => counts[cat] === 0)
    .map(cat => ({
      category: cat,
      severity: 'critical',
      recommendation: 'strongly_recommend'
    }));

  const balanceScore = this.calculateBalanceScore(counts);

  return {
    category_counts: counts,
    gaps,
    balance_score: balanceScore,
    is_balanced: balanceScore >= 70,
    recommendation: gaps.length > 0
      ? `${gaps.length} category gaps identified`
      : 'Portfolio is well-balanced'
  };
}

/**
 * Get weakest SSI blocks
 */
getWeakestBlocks(ssiData, count = 3) {
  if (!ssiData?.blocks) return [];

  return Object.entries(ssiData.blocks)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

/**
 * Get strongest SSI blocks
 */
getStrongestBlocks(ssiData, count = 3) {
  if (!ssiData?.blocks) return [];

  return Object.entries(ssiData.blocks)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

/**
 * Convert Map to object for JSON serialization
 */
mapToObject(map) {
  if (!map) return {};
  if (map instanceof Map) {
    return Object.fromEntries(map);
  }
  return map;
}

/**
 * Categorize company size
 */
categorizeSize(employeeCount) {
  if (!employeeCount) return 'unknown';
  if (employeeCount < 50) return 'small';
  if (employeeCount < 200) return 'medium';
  if (employeeCount < 500) return 'large';
  return 'enterprise';
}

/**
 * Group objectives by category
 */
groupByCategory(objectives) {
  return objectives.reduce((acc, obj) => {
    if (!acc[obj.category]) acc[obj.category] = [];
    acc[obj.category].push(obj);
    return acc;
  }, {});
}

/**
 * Calculate portfolio balance score (0-100)
 */
calculateBalanceScore(counts) {
  const values = Object.values(counts);
  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;

  const ideal = total / 6;
  const variance = values.reduce((sum, count) => {
    return sum + Math.abs(count - ideal);
  }, 0);

  return Math.max(0, Math.round(100 - (variance / total) * 50));
}

/**
 * Calculate average completion from week history
 */
calculateAvgCompletion(weekHistory) {
  const pastWeeks = weekHistory.filter(w => w.is_past);
  if (pastWeeks.length === 0) return 0;

  const sum = pastWeeks.reduce((s, w) => s + w.completion_rate, 0);
  return Math.round(sum / pastWeeks.length);
}

/**
 * Extract blockers from week history
 */
extractBlockers(weekHistory) {
  return weekHistory.flatMap(week =>
    week.tasks
      .filter(t => t.blocker)
      .map(t => ({
        week: week.week_number,
        task: t.title,
        blocker: t.blocker
      }))
  );
}

/**
 * Assess if OKR is on track based on week history
 */
assessProgress(weekHistory, targetWeek) {
  const pastWeeks = weekHistory.filter(w => w.week_number < targetWeek);
  if (pastWeeks.length === 0) return 'not_started';

  const avgCompletion = this.calculateAvgCompletion(pastWeeks);
  if (avgCompletion >= 80) return 'on_track';
  if (avgCompletion >= 50) return 'at_risk';
  return 'behind';
}

/**
 * Check if date range is current week
 */
isCurrentWeek(startDate, endDate) {
  const now = new Date();
  return new Date(startDate) <= now && now <= new Date(endDate);
}
```

---

## Usage Examples

### Epic L - Planning Page

```javascript
// client/js/planning-ai-context.js

async function getAISuggestions(keyResultId, weekNumber) {
  const companyId = getCurrentCompanyId();

  // Fetch context from backend
  const response = await fetch(`/api/ai-context/weekly-goal`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ companyId, keyResultId, weekNumber })
  });

  const { context } = await response.json();

  // Send to AI generation
  const suggestions = await fetch('/api/ai-goals/weekly/generate', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ context })
  });

  return suggestions.json();
}
```

### Epic M - OKR Wizard

```javascript
// client/js/okr-wizard.js

async function generateObjectives(categories, mode) {
  const companyId = getCurrentCompanyId();

  // Fetch context from backend
  const response = await fetch(`/api/ai-context/okr-generation`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      companyId,
      options: { mode, categories }
    })
  });

  const { context } = await response.json();

  // Send to AI generation
  const objectives = await fetch('/api/ai-okr/generate', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ context })
  });

  return objectives.json();
}
```

---

## API Endpoints to Add

```javascript
// server/routes/ai-context.js (NEW)

const express = require('express');
const router = express.Router();
const AIContextService = require('../services/AIContextService');
const { authenticateToken } = require('../middleware/authGuards');

/**
 * POST /api/ai-context/base
 * Get base context (company + SSI)
 */
router.post('/base', authenticateToken, async (req, res) => {
  try {
    const { companyId } = req.body;
    const context = await AIContextService.getBaseContext(companyId);
    res.json({ success: true, context });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai-context/okr-generation
 * Get context for OKR wizard (Epic M)
 */
router.post('/okr-generation', authenticateToken, async (req, res) => {
  try {
    const { companyId, options } = req.body;
    const context = await AIContextService.getOKRGenerationContext(companyId, options);
    res.json({ success: true, context });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai-context/weekly-goal
 * Get context for weekly goal suggestions (Epic L)
 */
router.post('/weekly-goal', authenticateToken, async (req, res) => {
  try {
    const { companyId, keyResultId, weekNumber } = req.body;
    const context = await AIContextService.getWeeklyGoalContext(companyId, keyResultId, weekNumber);
    res.json({ success: true, context });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

---

## Implementation Timeline

| Sprint | Task | Story Points |
|--------|------|--------------|
| Sprint 10 | Create AIContextService enhancement | Part of K5 (5 pts) |
| Sprint 10 | Add ai-context.js routes | Part of K5 |
| Sprint 11 | Epic L uses getWeeklyGoalContext | L5 (5 pts) |
| Sprint 11 | Epic M uses getOKRGenerationContext | M2 (2 pts) |

---

## Testing Requirements

```javascript
// tests/unit/AIContextService.test.js

describe('AIContextService', () => {
  describe('getBaseContext', () => {
    it('should return company info with SSI scores');
    it('should handle missing business_metrics gracefully');
    it('should identify weakest and strongest blocks');
  });

  describe('getOKRGenerationContext', () => {
    it('should return existing objectives grouped by category');
    it('should calculate gap analysis correctly');
    it('should identify critical gaps');
  });

  describe('getWeeklyGoalContext', () => {
    it('should return week history with task completion');
    it('should calculate average completion correctly');
    it('should extract blockers from tasks');
    it('should assess on_track/at_risk/behind status');
  });
});
```

---

## Benefits

1. **Single Source of Truth**: All AI features use consistent context structure
2. **Reduced Duplication**: No more copy-pasting context assembly code
3. **Easier Testing**: One service to test, not multiple scattered implementations
4. **Better Maintenance**: Changes to context structure happen in one place
5. **Performance**: Can add caching at service level

---

**Status**: READY FOR IMPLEMENTATION
**Implement During**: Sprint 10 (as part of K5)
**Used By**: Epic L (Sprint 11), Epic M (Sprint 11-12)
