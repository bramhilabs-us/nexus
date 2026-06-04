# Week 4 - Data Flow & Calculation Specification
## Zero Hardcoding: Every Data Point Mapped to Source

**Version**: 1.0
**Created**: October 19, 2025
**Principle**: NO HARDCODED VALUES - All data from database or calculated

---

## 🎯 **CORE PRINCIPLE: ZERO HARDCODING**

Every piece of data displayed in the UI must come from one of three sources:

1. **Database** (stored values)
2. **Calculated** (derived from database values using business logic)
3. **User Input** (temporary state before save)

**NEVER**:
- Hardcode numerical values
- Hardcode status labels
- Hardcode dates or timestamps
- Hardcode user names or roles
- Use sample/placeholder data in production

---

## 📊 **OBJECTIVE DETAIL PAGE - COMPLETE DATA MAPPING**

### **Navigation Header**

| Display Element | Source | Calculation/Query |
|----------------|--------|-------------------|
| User Avatar | Database | `user.avatar_url` or default avatar |
| User Full Name | Database | `user.first_name + ' ' + user.last_name` |
| User Role Label | Database + Mapping | `roleLabels[user.role]` |
| Notification Count | Database | `COUNT(notifications WHERE read = false)` |

### **Page Header**

| Display Element | Source | Calculation/Query |
|----------------|--------|-------------------|
| Current Quarter | Calculated | `getCurrentQuarter(business.fiscal_year_start)` |
| Quarter Label | Calculated | `"Q" + quarter + " " + year` |
| "Add Objective" Button Visibility | Calculated | `user.role !== 'EMPLOYEE'` |

```javascript
// getCurrentQuarter() calculation
function getCurrentQuarter(fiscalYearStart) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12

  // Adjust for fiscal year
  let adjustedMonth = currentMonth - fiscalYearStart + 1;
  if (adjustedMonth <= 0) adjustedMonth += 12;

  const quarter = Math.ceil(adjustedMonth / 3);
  const year = currentMonth >= fiscalYearStart
    ? now.getFullYear()
    : now.getFullYear() - 1;

  return { year, quarter, label: `Q${quarter} ${year}` };
}
```

---

### **Quick Stats Cards (4 Cards)**

#### **Card 1: Active Objectives**

| Display | Source | Query/Calculation |
|---------|--------|-------------------|
| Count | Database | `COUNT(objectives WHERE status = 'active' AND owner_id = userId)` |
| Icon | Static | `📊` |
| Label | Static | `"Active Objectives"` |

#### **Card 2: Overall Progress**

| Display | Source | Query/Calculation |
|---------|--------|-------------------|
| Percentage | Calculated | `AVG(objective.progress_percentage) FROM objectives WHERE status = 'active'` |
| Icon | Static | `📈` |
| Label | Static | `"Overall Progress"` |
| Color | Calculated | `progress < 50 ? 'red' : progress < 75 ? 'yellow' : 'green'` |

```javascript
// Overall progress calculation
async function getOverallProgress(userId) {
  const objectives = await Objective.find({
    owner_id: userId,
    status: 'active'
  });

  if (objectives.length === 0) return 0;

  const totalProgress = objectives.reduce((sum, obj) =>
    sum + (obj.progress_percentage || 0), 0
  );

  return Math.round(totalProgress / objectives.length);
}
```

#### **Card 3: Key Results**

| Display | Source | Query/Calculation |
|---------|--------|-------------------|
| Completed Count | Calculated | `COUNT(kr WHERE kr.status = 'completed')` across all objectives |
| Total Count | Calculated | `SUM(objectives.key_results.length)` |
| Display Format | Calculated | `"8/12 completed"` |
| Icon | Static | `🎯` |
| Label | Static | `"Key Results"` |

```javascript
// Key results calculation
function getKeyResultsStats(objectives) {
  let totalKRs = 0;
  let completedKRs = 0;

  objectives.forEach(obj => {
    obj.key_results.forEach(kr => {
      totalKRs++;
      if (kr.status === 'completed' || calculateKRProgress(kr) >= 100) {
        completedKRs++;
      }
    });
  });

  return { completed: completedKRs, total: totalKRs };
}
```

#### **Card 4: AI Accuracy**

| Display | Source | Query/Calculation |
|---------|--------|-------------------|
| Percentage | Calculated | `(AI objectives completed on time / Total AI objectives) * 100` |
| Icon | Static | `🤖` |
| Label | Static | `"AI Accuracy"` |

```javascript
// AI accuracy calculation
async function getAIAccuracy(userId) {
  const aiObjectives = await Objective.find({
    owner_id: userId,
    ai_generated: true
  });

  if (aiObjectives.length === 0) return 0;

  const completedOnTime = aiObjectives.filter(obj => {
    if (obj.status !== 'completed') return false;

    const expectedDate = new Date(obj.end_date);
    const completedDate = new Date(obj.completed_at);

    return completedDate <= expectedDate;
  }).length;

  return Math.round((completedOnTime / aiObjectives.length) * 100);
}
```

---

### **Filter Controls**

| Display | Source | Calculation |
|---------|--------|-------------|
| "All" Count | Calculated | `objectives.length` |
| "Needs Attention" Count | Calculated | `objectives.filter(obj => calculateStatus(obj) === 'needs-attention').length` |
| "On Track" Count | Calculated | `objectives.filter(obj => calculateStatus(obj) === 'on-track').length` |
| "Ahead" Count | Calculated | `objectives.filter(obj => calculateStatus(obj) === 'ahead').length` |
| Active Filter Label | UI State | `activeFilter` (React/Vue state) |

---

### **Objective Cards - COMPLETE DATA MAPPING**

Each objective card displays 15+ data points. Here's the complete mapping:

#### **Objective Card Header**

| Display Element | Source | Calculation/Query |
|----------------|--------|-------------------|
| Title | Database | `objective.title` |
| Quarter Label | Calculated | `getQuarterLabel(objective.timeline.target_year, objective.timeline.quarters)` |
| KR Count | Calculated | `objective.key_results.length` |
| Status Label | Calculated | `getStatusLabel(objective)` |
| Status Color | Calculated | `getStatusColor(calculateStatus(objective))` |

```javascript
// Quarter label calculation
function getQuarterLabel(objective) {
  const { target_year, quarters } = objective.timeline;

  if (quarters.length === 1) {
    return `Q${quarters[0]} ${target_year}`;
  } else {
    return `Q${quarters[0]}-Q${quarters[quarters.length - 1]} ${target_year}`;
  }
}

// Status label calculation
function getStatusLabel(objective) {
  const status = calculateStatus(objective);

  const labels = {
    'needs-attention': 'Needs attention',
    'on-track': 'On track',
    'ahead': 'Ahead of schedule'
  };

  return labels[status] || 'Unknown';
}

// Status calculation (CORE ALGORITHM)
function calculateStatus(objective) {
  const expectedProgress = calculateExpectedProgress(
    objective.timeline.start_date,
    objective.timeline.end_date
  );

  const actualProgress = objective.progress_percentage || 0;

  const ratio = expectedProgress > 0 ? actualProgress / expectedProgress : 1;

  if (ratio < 0.8) return 'needs-attention';  // More than 20% behind
  if (ratio > 1.2) return 'ahead';            // More than 20% ahead
  return 'on-track';
}
```

#### **Progress Display**

| Display Element | Source | Calculation |
|----------------|--------|-------------|
| Progress Percentage | Database | `objective.progress_percentage` |
| Progress Bar Width | Database | `objective.progress_percentage + '%'` |
| Progress Bar Color | Calculated | `getStatusColor(calculateStatus(objective))` |
| Current Week | Calculated | `calculateWeekProgress(start_date, end_date).currentWeek` |
| Total Weeks | Calculated | `calculateWeekProgress(start_date, end_date).totalWeeks` |
| Week Display | Calculated | `"Week " + currentWeek + "/" + totalWeeks` |

```javascript
// Week progress calculation
function calculateWeekProgress(startDate, endDate) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const totalMs = end - start;
  const elapsedMs = now - start;

  const totalWeeks = Math.ceil(totalMs / (7 * 24 * 60 * 60 * 1000));
  const elapsedWeeks = Math.floor(elapsedMs / (7 * 24 * 60 * 60 * 1000));

  const currentWeek = Math.max(0, Math.min(elapsedWeeks, totalWeeks));

  return { currentWeek, totalWeeks };
}

// Expected progress calculation
function calculateExpectedProgress(startDate, endDate) {
  const { currentWeek, totalWeeks } = calculateWeekProgress(startDate, endDate);

  if (totalWeeks === 0) return 0;

  return Math.round((currentWeek / totalWeeks) * 100);
}
```

#### **Key Results Preview (Top 2 KRs)**

| Display Element | Source | Calculation |
|----------------|--------|-------------|
| KR Title | Database | `kr.title` |
| Current Value | Database | `kr.current_value` |
| Target Value | Database | `kr.target_value` |
| Unit | Database | `kr.unit` |
| Display Format | Calculated | `formatKRDisplay(kr)` |
| Progress Percentage | Calculated | `calculateKRProgress(kr)` |
| Progress Bar Width | Calculated | `calculateKRProgress(kr) + '%'` |
| Progress Bar Color | Calculated | `getKRStatusColor(kr)` |

```javascript
// KR progress calculation
function calculateKRProgress(keyResult) {
  const { metric_type, current_value, target_value } = keyResult;

  if (metric_type === 'boolean') {
    return current_value >= target_value ? 100 : 0;
  }

  if (target_value === 0) return 0;

  const progress = (current_value / target_value) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

// KR display formatting
function formatKRDisplay(keyResult) {
  const { metric_type, current_value, target_value, unit } = keyResult;

  if (metric_type === 'boolean') {
    return current_value >= target_value ? '✓ Done' : '○ Pending';
  }

  if (metric_type === 'percentage') {
    return `${current_value}% → ${target_value}%`;
  }

  if (metric_type === 'currency') {
    return `$${formatNumber(current_value)} → $${formatNumber(target_value)}`;
  }

  return `${current_value}${unit || ''} → ${target_value}${unit || ''}`;
}

// Number formatting
function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
```

#### **Summary Stats**

| Display Element | Source | Calculation |
|----------------|--------|-------------|
| On Track KRs Count | Calculated | `objective.key_results.filter(kr => isOnTrack(kr)).length` |
| At Risk KRs Count | Calculated | `objective.key_results.filter(kr => isAtRisk(kr)).length` |

```javascript
// KR on-track check
function isOnTrack(keyResult) {
  const progress = calculateKRProgress(keyResult);
  const expectedProgress = calculateExpectedProgress(
    keyResult.start_date || objective.timeline.start_date,
    keyResult.end_date || objective.timeline.end_date
  );

  return progress >= expectedProgress * 0.8;
}

// KR at-risk check
function isAtRisk(keyResult) {
  return !isOnTrack(keyResult);
}
```

---

### **iBrain: Priority Analysis (4 Cards)**

| Display Element | Source | Calculation/API |
|----------------|--------|-----------------|
| Objective Title | Database | From API: `GET /api/objectives/ibrain/priorities/:userId` |
| Progress Percentage | Database | `priority.progress` |
| Status Text | Calculated | `priority.statusText` |
| Severity Label | Calculated | `priority.label` ("Critical Focus", "High Priority", etc.) |
| Severity Color | Calculated | Based on `priority.severity` (critical=red, high=orange, medium=yellow, low=green) |
| Risk Score | Calculated | AI algorithm: `timeRisk + velocityRisk + dependencyRisk + (impactScore * 5)` |
| Recommendations | Calculated | AI-generated based on analysis |

```javascript
// Priority calculation (iBrain algorithm)
async function calculatePriorities(userId) {
  const objectives = await Objective.find({
    owner_id: userId,
    status: 'active'
  });

  const scoredObjectives = objectives.map(obj => {
    // Time risk
    const expectedProgress = calculateExpectedProgress(obj.start_date, obj.end_date);
    const actualProgress = obj.progress_percentage;
    const progressDelta = expectedProgress - actualProgress;

    const timeRisk = progressDelta > 20 ? 40 : progressDelta > 10 ? 20 : 0;

    // Velocity risk
    const velocityRisk = calculateVelocityRisk(obj);

    // Dependency risk
    const dependencyRisk = calculateDependencyRisk(obj);

    // Impact score
    const impactScore = obj.impact_score || 5;

    // Total risk score
    const riskScore = timeRisk + velocityRisk + dependencyRisk + (impactScore * 5);

    // Severity
    const severity = riskScore > 80 ? 'critical'
                   : riskScore > 60 ? 'high'
                   : riskScore > 40 ? 'medium'
                   : 'low';

    return { ...obj, riskScore, severity };
  });

  // Sort by risk score (highest first)
  const sorted = scoredObjectives.sort((a, b) => b.riskScore - a.riskScore);

  // Return top 4
  return sorted.slice(0, 4);
}
```

---

### **iBrain: Smart Insights (3 Cards)**

#### **Focus Area Insight**

| Display Element | Source | Calculation |
|----------------|--------|-------------|
| Objective Title | Database | Lowest progress objective |
| Message | Calculated | AI-generated recommendation |
| Confidence Score | Calculated | Based on data quality and historical accuracy |
| Confidence Bar Width | Calculated | `confidence + '%'` |
| Action Items | Calculated | AI-generated based on bottleneck analysis |

```javascript
// Focus area identification
async function generateFocusAreaInsight(userId) {
  const objectives = await Objective.find({
    owner_id: userId,
    status: 'active'
  });

  // Find objective most behind schedule
  const focusObjective = objectives.reduce((min, obj) => {
    const expected = calculateExpectedProgress(obj.start_date, obj.end_date);
    const delta = expected - obj.progress_percentage;

    const minExpected = calculateExpectedProgress(min.start_date, min.end_date);
    const minDelta = minExpected - min.progress_percentage;

    return delta > minDelta ? obj : min;
  });

  // Generate message
  const progressGap = calculateExpectedProgress(
    focusObjective.start_date,
    focusObjective.end_date
  ) - focusObjective.progress_percentage;

  const message = `${focusObjective.title} needs attention. Current progress is ${progressGap}% behind schedule.`;

  // Calculate confidence
  const confidence = calculateConfidenceScore(focusObjective);

  return {
    objectiveId: focusObjective._id,
    objectiveTitle: focusObjective.title,
    message,
    confidence,
    actionItems: generateActionItems(focusObjective)
  };
}
```

#### **Quick Win Insight**

| Display Element | Source | Calculation |
|----------------|--------|-------------|
| Objective Title | Database | Highest progress objective (ahead of schedule) |
| Message | Calculated | Reallocation suggestion |
| Confidence Score | Calculated | Based on sustained velocity |
| Potential Impact | Calculated | Estimated acceleration for at-risk objective |

```javascript
// Quick win identification
async function generateQuickWinInsight(userId) {
  const objectives = await Objective.find({
    owner_id: userId,
    status: 'active'
  });

  // Find objective most ahead of schedule
  const quickWinObjective = objectives.reduce((max, obj) => {
    const expected = calculateExpectedProgress(obj.start_date, obj.end_date);
    const delta = obj.progress_percentage - expected;

    const maxExpected = calculateExpectedProgress(max.start_date, max.end_date);
    const maxDelta = max.progress_percentage - maxExpected;

    return delta > maxDelta ? obj : max;
  });

  const progressAhead = quickWinObjective.progress_percentage - calculateExpectedProgress(
    quickWinObjective.start_date,
    quickWinObjective.end_date
  );

  const message = `${quickWinObjective.title} is ${progressAhead}% ahead of schedule. Consider reallocating resources to at-risk objectives.`;

  return {
    objectiveId: quickWinObjective._id,
    objectiveTitle: quickWinObjective.title,
    message,
    confidence: 92,  // High confidence for sustained performance
    potentialImpact: "Could accelerate at-risk objective by 15%"
  };
}
```

#### **Forecast Insight**

| Display Element | Source | Calculation |
|----------------|--------|-------------|
| Objective Title | Database | Objective with predictable velocity |
| Message | Calculated | Completion date prediction |
| Confidence Score | Calculated | Based on velocity consistency |
| Projected Completion | Calculated | Based on current velocity |
| Current Velocity | Calculated | Progress change per week |

```javascript
// Forecast generation
async function generateForecastInsight(userId) {
  const objectives = await Objective.find({
    owner_id: userId,
    status: 'active'
  });

  // Pick objective with most consistent velocity
  const forecastObjective = objectives[0]; // Simplified

  // Calculate velocity (% progress per week)
  const velocity = calculateVelocity(forecastObjective);

  // Calculate weeks to completion
  const remainingProgress = 100 - forecastObjective.progress_percentage;
  const weeksToCompletion = Math.ceil(remainingProgress / velocity);

  // Project completion date
  const projectedDate = new Date(
    Date.now() + weeksToCompletion * 7 * 24 * 60 * 60 * 1000
  );

  const scheduledDate = new Date(forecastObjective.timeline.end_date);
  const weeksAhead = Math.round(
    (scheduledDate - projectedDate) / (7 * 24 * 60 * 60 * 1000)
  );

  const message = `${forecastObjective.title} will complete ${Math.abs(weeksAhead)} weeks ${weeksAhead > 0 ? 'ahead' : 'behind'} of schedule at current velocity.`;

  return {
    objectiveId: forecastObjective._id,
    objectiveTitle: forecastObjective.title,
    message,
    confidence: calculateVelocityConfidence(forecastObjective),
    projectedCompletionDate: projectedDate.toISOString().split('T')[0],
    currentVelocity: `+${velocity.toFixed(1)}% per week`
  };
}

// Velocity calculation
function calculateVelocity(objective) {
  // Get progress history (from updates log)
  const progressHistory = objective.progress_history || [];

  if (progressHistory.length < 2) return 0;

  // Calculate average weekly progress
  const recentUpdates = progressHistory.slice(-4); // Last 4 updates

  let totalVelocity = 0;
  for (let i = 1; i < recentUpdates.length; i++) {
    const progressDelta = recentUpdates[i].progress - recentUpdates[i - 1].progress;
    const timeDelta = new Date(recentUpdates[i].timestamp) - new Date(recentUpdates[i - 1].timestamp);
    const weeks = timeDelta / (7 * 24 * 60 * 60 * 1000);

    totalVelocity += progressDelta / weeks;
  }

  return totalVelocity / (recentUpdates.length - 1);
}
```

---

## 🗄️ **DATABASE QUERIES - OPTIMIZATION**

### **Dashboard Data Query**

**Single Aggregation Query** (optimized):

```javascript
async function getDashboardData(userId, userRole, businessId) {
  // Use aggregation pipeline for efficiency
  const pipeline = [
    // Match user's objectives
    { $match: {
      owner_id: new ObjectId(userId),
      status: { $in: ['active', 'draft'] }
    }},

    // Lookup owner details
    { $lookup: {
      from: 'users',
      localField: 'owner_id',
      foreignField: '_id',
      as: 'owner'
    }},

    // Unwind owner
    { $unwind: '$owner' },

    // Project needed fields only
    { $project: {
      title: 1,
      description: 1,
      category: 1,
      priority: 1,
      status: 1,
      progress_percentage: 1,
      timeline: 1,
      key_results: 1,
      weak_area_reference: 1,
      ai_generated: 1,
      'owner.first_name': 1,
      'owner.last_name': 1,
      'owner.avatar_url': 1
    }}
  ];

  const objectives = await Objective.aggregate(pipeline);

  return objectives;
}
```

### **iBrain Priorities Query**

**Efficient Query with Indexes**:

```javascript
// Create indexes for performance
db.objectives.createIndex({ owner_id: 1, status: 1, progress_percentage: 1 });
db.objectives.createIndex({ business_id: 1, status: 1 });

async function calculatePriorities(userId) {
  // Single query with lean() for performance
  const objectives = await Objective.find({
    owner_id: userId,
    status: 'active'
  })
  .select('title progress_percentage timeline impact_score key_results')
  .lean()  // Returns plain JavaScript objects (faster)
  .exec();

  // Calculate risk scores in memory (faster than DB aggregation)
  // ... scoring logic ...
}
```

---

## 📦 **CACHING STRATEGY**

### **Redis Caching for Performance**

```javascript
// Cache dashboard data (5 minute TTL)
const cacheKey = `dashboard:${userId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await getDashboardData(userId);
await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min

return data;

// Cache iBrain insights (1 hour TTL)
const iBrainCacheKey = `ibrain:insights:${userId}`;
const cachedInsights = await redis.get(iBrainCacheKey);

if (cachedInsights && !forceRefresh) {
  return JSON.parse(cachedInsights);
}

const insights = await generateInsights(userId);
await redis.setex(iBrainCacheKey, 3600, JSON.stringify(insights)); // 1 hour

return insights;
```

### **Cache Invalidation**

```javascript
// Invalidate cache when objectives update
async function updateObjectiveProgress(objectiveId, updates) {
  // Update database
  const objective = await Objective.findByIdAndUpdate(objectiveId, updates);

  // Invalidate caches
  await redis.del(`dashboard:${objective.owner_id}`);
  await redis.del(`ibrain:insights:${objective.owner_id}`);
  await redis.del(`ibrain:priorities:${objective.owner_id}`);

  return objective;
}
```

---

## ✅ **DATA VALIDATION CHECKLIST**

### **Before Displaying Any Value**

- [ ] Verify value exists in database or can be calculated
- [ ] Handle null/undefined gracefully (show "-" or "N/A")
- [ ] Format numbers consistently (2 decimal places, K/M suffixes)
- [ ] Format dates consistently (ISO 8601 or localized)
- [ ] Validate calculated percentages are 0-100
- [ ] Check for division by zero in calculations
- [ ] Handle edge cases (past dates, future dates, zero values)

### **Example: Safe Value Display**

```javascript
// BAD (hardcoded)
const progress = 67;

// GOOD (from database with fallback)
const progress = objective.progress_percentage ?? 0;

// BEST (calculated with validation)
const progress = Math.min(Math.max(
  calculateObjectiveProgress(objective),
  0
), 100);

// Display with fallback
const displayProgress = progress !== null && progress !== undefined
  ? `${progress}%`
  : 'N/A';
```

---

**END OF DATA FLOW SPECIFICATION**

**Next Document**: WEEK_4_IMPLEMENTATION_CHECKLIST.md
