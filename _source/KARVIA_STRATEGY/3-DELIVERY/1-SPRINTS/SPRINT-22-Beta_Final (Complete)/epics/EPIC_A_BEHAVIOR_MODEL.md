# Epic A: Data Models & Disciplines

<!-- @GENOME T3-SPR-022-EA | ACTIVE | 2026-04-29 | parent:T3-SPR-022-MP | auto:/coding | linked:/strategy -->

**Sprint**: 22 - Beta_Final
**Epic**: A - Data Models & Disciplines
**Points**: 5
**Priority**: P0 (Foundation — runs after Epic 0 sign-off)
**Dependencies**: Epic 0 (Pre-Work) — see [prework/](../prework/)

---

## Overview

Implement the simplified cascade data models and 9 Disciplines configuration. This epic establishes the foundation for all other Sprint 22 features.

**Key Decisions (Session #172, hardened in Epic 0 / Session #175)**:
- Disciplines are a CONFIG file (like categories.js), NOT a separate database model
- KeyResult is a SEPARATE model — written via dual-write alongside the legacy embedded `Objective.key_results[]` (D-A-1)
- Recurring items use SINGLE record + completions array (Option A)
- Goal.js and Task.js remain in place for backwards compat; new flows use WeeklyGoal.js and Move.js (D-A-2, D-A-3)
- 9 disciplines grouped by 4 foundations: Discipline / Growth / Accountability / Maturity (D-A-5)
- KeyResult.year is denormalized; server enforces `keyResult.year === objective.target_year` on write (D-A-4)
- Epic A also creates basic CRUD route scaffolds for KeyResult / WeeklyGoal / Move so consumer epics extend rather than create (D-A-6)

---

## Data Model Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SIMPLIFIED CASCADE                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Objective.js (exists - keep, add virtual for KRs)                          │
│      │                                                                       │
│      └── KeyResult.js (NEW)                                                 │
│          └── quarters: [1,2,3,4] - can span multiple quarters               │
│              │                                                               │
│              └── WeeklyGoal.js (NEW - replaces Goal.js for new features)    │
│                  └── frequency: once | weekly | biweekly | monthly          │
│                  └── completions: [{week, year, status, score}]             │
│                      │                                                       │
│                      └── Move.js (NEW - replaces Task.js for new features)  │
│                          └── move_type: action | reaction | habit           │
│                          └── discipline: from config (9 disciplines)        │
│                          └── frequency: once | daily | weekly | triggered   │
│                          └── completions: [{date, done, reflection}]        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Disciplines Configuration

**File**: `server/config/disciplines.js`

```javascript
/**
 * 9 Disciplines Configuration
 * Single source of truth for behavior disciplines
 *
 * Sprint 22 - Epic A: Data Models & Disciplines
 *
 * Used by:
 * - server/models/Move.js (enum validation)
 * - client UI (discipline selection)
 * - AI prompts (behavior context)
 */

const DISCIPLINES = [
  { id: 'truth',              name: 'Truth',              foundation: 'discipline',     order: 1, icon: 'shield-check',     description: 'Honest assessment of reality without spin or politics.', short_description: 'Honesty and transparency' },
  { id: 'ownership',          name: 'Ownership',          foundation: 'discipline',     order: 2, icon: 'user-check',       description: 'Taking full responsibility for outcomes, decisions, and consequences.', short_description: 'Full responsibility for outcomes' },
  { id: 'follow_through',     name: 'Follow-through',     foundation: 'discipline',     order: 3, icon: 'check-circle',     description: 'Completing commitments reliably. Doing what you say you will do.', short_description: 'Completing commitments' },
  { id: 'foresight',          name: 'Foresight',          foundation: 'growth',         order: 4, icon: 'eye',              description: 'Anticipating what is coming. Planning ahead and risk awareness.', short_description: 'Planning ahead' },
  { id: 'alignment',          name: 'Alignment',          foundation: 'growth',         order: 5, icon: 'compass',          description: 'Moving in the same direction as a team. Shared priorities.', short_description: 'Shared priorities' },
  { id: 'consistency',        name: 'Consistency',        foundation: 'accountability', order: 6, icon: 'repeat',           description: 'Showing up the same way every day. Predictable, reliable performance.', short_description: 'Reliable performance' },
  { id: 'handoffs',           name: 'Handoffs',           foundation: 'accountability', order: 7, icon: 'arrow-right-left', description: 'Clean transitions and clear communication. No dropped balls.', short_description: 'Clean transitions' },
  { id: 'energy_stewardship', name: 'Energy Stewardship', foundation: 'maturity',       order: 8, icon: 'battery-charging', description: 'Managing resources wisely. Sustainable pace, avoiding burnout.', short_description: 'Sustainable energy' },
  { id: 'formation',          name: 'Formation',          foundation: 'maturity',       order: 9, icon: 'users',            description: 'Working in small groups for execution. Team structure matters.', short_description: 'Team structure' }
];

const FOUNDATIONS = ['discipline', 'growth', 'accountability', 'maturity'];

// D-B-3: unified config API surface used by Move enum, AIContextService DisciplineProvider, Epic E UI
module.exports = {
  DISCIPLINES,
  FOUNDATIONS,
  getAll: () => DISCIPLINES,
  getById: (id) => DISCIPLINES.find(d => d.id === id) || null,
  getIds: () => DISCIPLINES.map(d => d.id),
  isValid: (id) => DISCIPLINES.some(d => d.id === id),
  getFoundations: () => FOUNDATIONS,
  getDisciplinesByFoundation: (foundation) => DISCIPLINES.filter(d => d.foundation === foundation),
  getDropdownShape: () => DISCIPLINES.map(d => ({ value: d.id, label: d.name, foundation: d.foundation, description: d.short_description, icon: d.icon }))
};
```

---

## 2. KeyResult Model

**File**: `server/models/KeyResult.js`

```javascript
const mongoose = require('mongoose');

/**
 * KeyResult Model - Quarterly measurable targets
 * Part of cascade: Objective → KeyResult → WeeklyGoal → Move
 *
 * KEY DECISION: Separate model (not embedded in Objective)
 * - Enables proper relationships and population
 * - Supports KR-level analytics and ownership
 * - One Objective can have multiple KRs (1:N)
 */
const keyResultSchema = new mongoose.Schema({
  // Associations
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  objective_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Objective',
    required: true,
    index: true
  },

  // KR Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Measurement
  metric_type: {
    type: String,
    enum: ['number', 'percentage', 'boolean', 'currency'],
    required: true
  },
  target_value: {
    type: Number,
    required: true
  },
  current_value: {
    type: Number,
    default: 0
  },
  baseline_value: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    trim: true,
    maxlength: 20
  },

  // Time Span (can span 1-4 quarters)
  quarters: [{
    type: Number,
    enum: [1, 2, 3, 4]
  }],
  year: {
    type: Number,
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'at_risk', 'blocked'],
    default: 'not_started'
  },

  // Ownership
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // AI Tracking
  ai_generated: {
    type: Boolean,
    default: false
  },

  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
keyResultSchema.index({ company_id: 1, objective_id: 1 });
keyResultSchema.index({ company_id: 1, quarters: 1, year: 1 });
keyResultSchema.index({ owner_id: 1, status: 1 });

// Virtual for progress percentage
keyResultSchema.virtual('progress_percentage').get(function() {
  if (this.target_value === 0) return 0;
  const progress = ((this.current_value - this.baseline_value) /
                   (this.target_value - this.baseline_value)) * 100;
  return Math.min(Math.max(Math.round(progress), 0), 100);
});

// Virtual for quarter display
keyResultSchema.virtual('quarter_display').get(function() {
  if (!this.quarters || this.quarters.length === 0) return '';
  if (this.quarters.length === 1) return `Q${this.quarters[0]}`;
  return `Q${Math.min(...this.quarters)}-Q${Math.max(...this.quarters)}`;
});

// Pre-save middleware
keyResultSchema.pre('save', function(next) {
  this.updated_at = new Date();

  // Auto-update status based on progress
  const progress = this.progress_percentage;
  if (progress >= 100 && this.status !== 'completed') {
    this.status = 'completed';
  } else if (progress > 0 && this.status === 'not_started') {
    this.status = 'in_progress';
  }

  next();
});

module.exports = mongoose.model('KeyResult', keyResultSchema);
```

---

## 3. WeeklyGoal Model

**File**: `server/models/WeeklyGoal.js`

```javascript
const mongoose = require('mongoose');

/**
 * WeeklyGoal Model - Weekly focus areas
 * Part of cascade: Objective → KeyResult → WeeklyGoal → Move
 *
 * KEY DECISION: Uses completions array for recurring goals (Option A)
 * - Single record with multiple completions
 * - frequency field determines behavior
 */
const weeklyGoalSchema = new mongoose.Schema({
  // Associations
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  key_result_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KeyResult',
    required: true,
    index: true
  },

  // Goal Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // FREQUENCY (the key field!)
  frequency: {
    type: String,
    enum: ['once', 'weekly', 'biweekly', 'twice_monthly', 'monthly'],
    default: 'once',
    index: true
  },

  // FOR ONE-TIME GOALS (frequency: 'once')
  target_week: {
    type: Number,
    min: 1,
    max: 52
  },
  target_year: Number,

  // Status for one-time goals
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'blocked', 'cancelled'],
    default: 'not_started'
  },
  completed_at: Date,

  // FOR RECURRING GOALS (frequency: weekly, biweekly, monthly)
  start_week: {
    type: Number,
    min: 1,
    max: 52
  },
  end_week: {
    type: Number,
    min: 1,
    max: 52
  },

  // Completions array (Option A - single record, multiple completions)
  completions: [{
    week: { type: Number, required: true },
    year: { type: Number, required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'skipped'],
      default: 'not_started'
    },
    score: Number,  // Optional metric (0-100)
    notes: { type: String, maxlength: 500 },
    completed_at: Date,
    completed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],

  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // Ownership
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // AI Tracking
  ai_generated: {
    type: Boolean,
    default: false
  },

  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
weeklyGoalSchema.index({ company_id: 1, key_result_id: 1 });
weeklyGoalSchema.index({ company_id: 1, frequency: 1 });
weeklyGoalSchema.index({ company_id: 1, target_week: 1, target_year: 1 });
weeklyGoalSchema.index({ owner_id: 1, status: 1 });

// Virtual for completion rate (recurring goals)
weeklyGoalSchema.virtual('completion_rate').get(function() {
  if (this.frequency === 'once') {
    return this.status === 'completed' ? 100 : 0;
  }
  if (!this.completions || this.completions.length === 0) return 0;
  const completed = this.completions.filter(c => c.status === 'completed').length;
  return Math.round((completed / this.completions.length) * 100);
});

// Virtual for is_recurring
weeklyGoalSchema.virtual('is_recurring').get(function() {
  return this.frequency !== 'once';
});

// Method to add completion entry
weeklyGoalSchema.methods.addCompletion = function(week, year, data) {
  // Check if completion already exists
  const existing = this.completions.find(c => c.week === week && c.year === year);
  if (existing) {
    Object.assign(existing, data);
  } else {
    this.completions.push({ week, year, ...data });
  }
  return this.save();
};

// Pre-save middleware
weeklyGoalSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('WeeklyGoal', weeklyGoalSchema);
```

---

## 4. Move Model

**File**: `server/models/Move.js`

```javascript
const mongoose = require('mongoose');
const { getIds: getDisciplineIds } = require('../config/disciplines');

/**
 * Move Model - Daily behaviors/actions
 * Part of cascade: Objective → KeyResult → WeeklyGoal → Move
 *
 * Replaces Task.js for new features with behavior tracking
 *
 * MOVE TYPES:
 * - action: One-time, proactive task
 * - reaction: Responsive to an event/trigger
 * - habit: Recurring behavior with frequency
 */
const moveSchema = new mongoose.Schema({
  // Associations
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  weekly_goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeeklyGoal',
    required: true,
    index: true
  },

  // Move Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // BEHAVIOR CLASSIFICATION
  move_type: {
    type: String,
    enum: ['action', 'reaction', 'habit'],
    required: true,
    index: true
  },

  // 9 DISCIPLINES (from config)
  discipline: {
    type: String,
    enum: getDisciplineIds(),
    index: true
  },

  // FREQUENCY
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'triggered'],
    default: 'once'
  },

  // For habits: which days
  days_of_week: [{
    type: String,
    enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  }],

  // FOR ONE-TIME (action/reaction)
  due_date: Date,
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'completed', 'blocked', 'cancelled'],
    default: 'todo'
  },
  completed_at: Date,

  // FOR RECURRING (habits) - completions array (Option A)
  completions: [{
    date: { type: Date, required: true },
    done: { type: Boolean, default: false },
    discipline_score: { type: Number, min: 1, max: 5 },  // Self-assessment
    reflection: { type: String, maxlength: 500 },
    skipped_reason: String
  }],

  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Ownership
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // AI Tracking
  ai_generated: {
    type: Boolean,
    default: false
  },

  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
moveSchema.index({ company_id: 1, weekly_goal_id: 1 });
moveSchema.index({ company_id: 1, move_type: 1 });
moveSchema.index({ company_id: 1, discipline: 1 });
moveSchema.index({ assigned_to: 1, status: 1 });
moveSchema.index({ assigned_to: 1, due_date: 1 });

// Virtual for is_habit
moveSchema.virtual('is_habit').get(function() {
  return this.move_type === 'habit';
});

// Virtual for streak (habits)
moveSchema.virtual('streak').get(function() {
  if (this.move_type !== 'habit' || !this.completions) return 0;

  let streak = 0;
  const sorted = [...this.completions].sort((a, b) => b.date - a.date);

  for (const c of sorted) {
    if (c.done) streak++;
    else break;
  }
  return streak;
});

// Virtual for completion rate (habits)
moveSchema.virtual('completion_rate').get(function() {
  if (this.move_type !== 'habit') {
    return this.status === 'completed' ? 100 : 0;
  }
  if (!this.completions || this.completions.length === 0) return 0;
  const done = this.completions.filter(c => c.done).length;
  return Math.round((done / this.completions.length) * 100);
});

// Method to log completion (for habits)
moveSchema.methods.logCompletion = function(date, data) {
  const dateStr = new Date(date).toDateString();
  const existing = this.completions.find(
    c => new Date(c.date).toDateString() === dateStr
  );

  if (existing) {
    Object.assign(existing, data);
  } else {
    this.completions.push({ date, ...data });
  }
  return this.save();
};

// Method to complete (for actions/reactions)
moveSchema.methods.complete = function() {
  this.status = 'completed';
  this.completed_at = new Date();
  return this.save();
};

// Pre-save middleware
moveSchema.pre('save', function(next) {
  this.updated_at = new Date();

  // Set default frequency based on move_type
  if (!this.frequency) {
    this.frequency = this.move_type === 'habit' ? 'daily' : 'once';
  }

  next();
});

module.exports = mongoose.model('Move', moveSchema);
```

---

## 5. API Endpoints

### 5a. Disciplines (`server/routes/disciplines.js`)

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authGuards');
const disciplines = require('../config/disciplines');

router.get('/',         authenticateToken, (req, res) => res.json({ success: true, data: disciplines.getAll() }));
router.get('/dropdown', authenticateToken, (req, res) => res.json({ success: true, data: disciplines.getDropdownShape() }));

module.exports = router;
```

### 5b. KeyResult / WeeklyGoal / Move CRUD scaffolds (D-A-6)

Epic A creates basic CRUD route scaffolds at `server/routes/key-results.js`, `server/routes/weekly-goals.js`, `server/routes/moves.js`. Each provides:

- `GET /:parentId` (list by parent)
- `POST /` (create — tenant-scoped, owner from token)
- `PUT /:id` (update — tenant-match required)
- `DELETE /:id` (soft delete — sets `status='cancelled'`)

Auth: all routes use `authenticateToken`. Tenant scope: every query/write filters by `req.user.company_id` or validates parent's `company_id`. KeyResult.year guard (D-A-4): server enforces `keyResult.year === Objective.findById(objective_id).target_year`; mismatched writes return 400.

AI-generation endpoints (`/generate-krs` on objectives, `/generate` on weekly-goals/moves, `/clients/enrich` on consultant) are owned by Epic E / Epic F / Epic C — see those specs.

---

## Files to Create

| File | Description |
|------|-------------|
| `server/config/disciplines.js` | 9 disciplines (4 foundations) configuration |
| `server/models/KeyResult.js` | Separate KR model (dual-write pattern, see D-A-1) |
| `server/models/WeeklyGoal.js` | Weekly goal with frequency + completions |
| `server/models/Move.js` | Daily behavior/action with discipline + completions |
| `server/routes/disciplines.js` | GET /, GET /dropdown |
| `server/routes/key-results.js` | CRUD scaffold (D-A-6) |
| `server/routes/weekly-goals.js` | CRUD scaffold (D-A-6) |
| `server/routes/moves.js` | CRUD scaffold (D-A-6) |

---

## Files to Modify

| File | Changes |
|------|---------|
| `server/index.js` | Mount 4 new routes (disciplines, key-results, weekly-goals, moves); call `await AIContextService.initializeProviders()` after DB connection (Epic B integration) |
| `server/models/Objective.js` | ADD virtual `key_results_v2` referencing KeyResult by `objective_id`; KEEP embedded `key_results[]` for backwards compat (D-A-1) |

---

## Objective.js Virtual Addition

```javascript
// ADD to server/models/Objective.js

// Virtual to populate key results from separate collection
objectiveSchema.virtual('key_results_v2', {
  ref: 'KeyResult',
  localField: '_id',
  foreignField: 'objective_id'
});

// Enable virtuals in JSON
objectiveSchema.set('toJSON', { virtuals: true });
objectiveSchema.set('toObject', { virtuals: true });
```

---

## Acceptance Criteria

- [ ] `disciplines.js` config created with 9 disciplines + 4 foundations + unified API surface (D-A-5, D-B-3)
- [ ] KeyResult.js model created with quarters array; `year` enforced equal to Objective.target_year on write (D-A-4)
- [ ] WeeklyGoal.js model created with frequency + completions
- [ ] Move.js model created with move_type, discipline (from config), completions
- [ ] GET /api/disciplines returns all 9; GET /api/disciplines/dropdown returns dropdown shape
- [ ] Objective.js has virtual `key_results_v2`; embedded `key_results[]` left intact for backwards compat (D-A-1)
- [ ] All models have proper tenant-leading indexes
- [ ] CRUD scaffolds for key-results / weekly-goals / moves enforce tenant scope and soft-delete (D-A-6)
- [ ] Existing OKR generation flow (`generateOKRsFromAssessment`) still works — backwards compat
- [ ] Existing Objective with embedded `key_results` still loads after virtual added
- [ ] Goal.js and Task.js untouched; old code paths unaffected (D-A-2, D-A-3)
- [ ] Unit + integration tests per `prework/TEST_PLAN_STUBS.md` pass

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| Disciplines config | 0.5 |
| KeyResult model | 1 |
| WeeklyGoal model | 1 |
| Move model | 1.5 |
| API endpoints | 0.5 |
| Testing | 0.5 |
| **Total** | **5** |

---

**Updated**: April 22, 2026 (Session #172)
**Status**: Ready for implementation
**Key Change**: Config file for disciplines, separate models with frequency/completions
