# EPIC 3: Human Element Scores - Engagement, Passion & Quality

**Epic ID**: SPRINT-10-EPIC-3
**Created**: December 22, 2025
**Status**: Planning
**Priority**: P1
**Story Points**: 89
**Sprints**: 12-15
**Owner**: Karvia Team (Signal Collection) + iBrain Team (Calculations)

---

## Executive Summary

This EPIC implements the **Human Element Scoring System** - a comprehensive framework to understand how people work, collaborate, and thrive. Following the API-only architecture:

1. **Karvia collects behavioral signals** (events, not scores)
2. **iBrain stores all data and calculates scores**
3. **Privacy-first design** (aggregate visibility, individual insights for self only)
4. **Configurable weights** (no hardcoding - industry/company adjustable)
5. **Enterprise scalability** (event-driven, async processing)

### The Human Element Triangle

```
                    ┌─────────────────────────┐
                    │    HUMAN ELEMENT        │
                    │    (Company Pulse)      │
                    └──────────┬──────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
  │ ENGAGEMENT  │       │   PASSION   │       │   QUALITY   │
  │   SCORE     │       │    SCORE    │       │    SCORE    │
  │             │       │   (IKIGAI)  │       │             │
  │ How teams   │       │ Work-life   │       │ How work    │
  │ participate │       │ alignment   │       │ gets done   │
  └─────────────┘       └─────────────┘       └─────────────┘
```

**Design Philosophy**: Measure what matters without surveillance. Help, don't judge.

---

## Architecture: Event-Driven Signal Collection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KARVIA BUSINESS (Signal Collector)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    BEHAVIORAL EVENT STREAM                            │   │
│  │                                                                       │   │
│  │   Task Events        Kudos Events       Collaboration Events         │   │
│  │   ├── status_change  ├── kudos_given    ├── comment_added           │   │
│  │   ├── assignment     ├── kudos_category ├── unblock_help            │   │
│  │   ├── started_at     └── visibility     ├── task_picked_up          │   │
│  │   ├── completed_at                      └── cross_category_help     │   │
│  │   └── reopened                                                       │   │
│  │                                                                       │   │
│  └───────────────────────────────┬──────────────────────────────────────┘   │
│                                  │                                          │
│                      ┌───────────▼───────────┐                              │
│                      │  EventCollector.js    │                              │
│                      │  (Batches & Sends)    │                              │
│                      └───────────┬───────────┘                              │
│                                  │                                          │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │ POST /api/v1/ingest/behavioral-events
                                   │ (Async, Batched every 60s or 100 events)
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          iBRAIN (Intelligence Layer)                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                      EVENT PROCESSING PIPELINE                         │   │
│  │                                                                        │   │
│  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │   │
│  │   │   Event     │───▶│   Pattern   │───▶│   Score     │              │   │
│  │   │   Store     │    │   Detector  │    │ Calculator  │              │   │
│  │   └─────────────┘    └─────────────┘    └─────────────┘              │   │
│  │         │                  │                  │                       │   │
│  │         ▼                  ▼                  ▼                       │   │
│  │   BehavioralEvent   WorkPattern      EngagementScore                 │   │
│  │   Collection        Collection       PassionScore                     │   │
│  │                                      QualityScore                     │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                      CONFIGURABLE WEIGHTS                              │   │
│  │                      (No Hardcoding)                                   │   │
│  │                                                                        │   │
│  │   ScoreConfig Collection:                                             │   │
│  │   ├── engagement_weights: { participation, execution, collaboration } │   │
│  │   ├── passion_weights: { love, skill, growth, drain_avoidance }      │   │
│  │   ├── quality_weights: { first_time_right, timeliness, impact }      │   │
│  │   └── thresholds: { burnout_warning, disengagement_alert }           │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Signal Taxonomy: Complete Event Catalog

### 1. Task Lifecycle Events

```javascript
// EVENT_TYPE: 'task.status_changed'
{
  event_type: 'task.status_changed',
  event_version: '1.0',
  timestamp: ISODate,

  // Identity (iBrain IDs)
  company_id: 'IB-CO-xxxxxxxx',
  member_id: 'IB-MEM-xxxxxxxx',

  // Event Data
  task_id: 'karvia_task_id',
  from_status: 'in_progress',
  to_status: 'completed',

  // Context for Scoring
  metadata: {
    // Timing signals
    assigned_at: ISODate,
    started_at: ISODate,        // When first moved to in_progress
    due_date: ISODate,
    completed_at: ISODate,      // Only if to_status === 'completed'

    // Quality signals
    was_reopened: false,        // Previously completed then reopened
    reopen_count: 0,
    was_blocked: false,
    blocked_duration_hours: 0,

    // Context
    category: 'operations',     // MECE category
    priority: 'high',           // high, medium, low
    estimated_hours: 4,
    is_collaborative: false,    // Multiple assignees

    // Reassignment tracking
    is_reassignment: false,
    previous_assignee_id: null,
    reassignment_reason: null   // 'help', 'rebalance', 'escalation'
  }
}

// EVENT_TYPE: 'task.comment_added'
{
  event_type: 'task.comment_added',
  event_version: '1.0',
  timestamp: ISODate,

  company_id: 'IB-CO-xxxxxxxx',
  commenter_id: 'IB-MEM-xxxxxxxx',

  task_id: 'karvia_task_id',
  task_owner_id: 'IB-MEM-yyyyyyyy',  // To detect helping behavior

  metadata: {
    is_own_task: false,         // Commenting on own vs others' tasks
    comment_length: 45,         // Words - proxy for engagement depth
    has_mention: true,          // @mentions someone
    mentioned_members: ['IB-MEM-zzzzzzzz']
  }
}

// EVENT_TYPE: 'task.unblocked'
{
  event_type: 'task.unblocked',
  event_version: '1.0',
  timestamp: ISODate,

  company_id: 'IB-CO-xxxxxxxx',
  unblocked_by_id: 'IB-MEM-xxxxxxxx',  // Who helped
  task_owner_id: 'IB-MEM-yyyyyyyy',    // Who was blocked

  task_id: 'karvia_task_id',

  metadata: {
    blocked_duration_hours: 24,
    resolution_type: 'peer_help',  // 'self', 'peer_help', 'manager_help'
    was_escalated: false
  }
}
```

### 2. Recognition Events (Kudos System)

```javascript
// EVENT_TYPE: 'kudos.given'
{
  event_type: 'kudos.given',
  event_version: '1.0',
  timestamp: ISODate,

  company_id: 'IB-CO-xxxxxxxx',
  giver_id: 'IB-MEM-xxxxxxxx',
  receiver_id: 'IB-MEM-yyyyyyyy',

  kudos: {
    category: 'collaboration',  // See KUDOS_CATEGORIES config
    message: 'Great help on the API integration!',
    visibility: 'team',         // 'private', 'team', 'company'
    related_task_id: 'karvia_task_id',  // Optional context
  },

  metadata: {
    giver_role: 'MANAGER',
    receiver_role: 'EMPLOYEE',
    same_team: true,
    cross_category: false       // Kudos for work outside their area
  }
}
```

### 3. Passion Profile Events

```javascript
// EVENT_TYPE: 'passion_profile.updated'
{
  event_type: 'passion_profile.updated',
  event_version: '1.0',
  timestamp: ISODate,

  company_id: 'IB-CO-xxxxxxxx',
  member_id: 'IB-MEM-xxxxxxxx',

  profile: {
    // IKIGAI Quadrants
    love: ['problem_solving', 'customer_interaction', 'data_analysis'],
    good_at: ['spreadsheets', 'presentations', 'project_management'],
    drains: ['cold_calling', 'documentation', 'meetings'],

    // Optional self-assessment
    energy_level: 4,            // 1-5 current state
    growth_areas: ['leadership', 'public_speaking']
  },

  metadata: {
    is_initial: false,          // First time vs update
    changed_fields: ['love', 'drains'],
    prompted_by: 'weekly_pulse'  // 'onboarding', 'weekly_pulse', 'settings'
  }
}

// EVENT_TYPE: 'pulse_check.submitted'
{
  event_type: 'pulse_check.submitted',
  event_version: '1.0',
  timestamp: ISODate,

  company_id: 'IB-CO-xxxxxxxx',
  member_id: 'IB-MEM-xxxxxxxx',

  pulse: {
    workload: 3,                // 1-5: How's your workload?
    energy: 4,                  // 1-5: How energized are you?
    support: 4,                 // 1-5: Do you feel supported?
    optional_comment: null      // Free text
  },

  metadata: {
    week_number: 51,
    response_time_hours: 2.5    // Time from prompt to response
  }
}
```

---

## Karvia Implementation: Signal Collection

### 1. Model Extension: Task (Minimal)

**File**: `server/models/Task.js`
**Change**: Add tracking fields (NO scores - just data)

```javascript
// ADD after line ~130 (after status field)
// Signal tracking for iBrain analytics (data only, no calculations)
signal_tracking: {
  started_at: {
    type: Date,
    description: 'When task first moved to in_progress'
  },
  reopen_count: {
    type: Number,
    default: 0,
    description: 'Times completed then reopened'
  },
  last_reopened_at: Date,
  blocked_events: [{
    blocked_at: Date,
    unblocked_at: Date,
    unblocked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolution_type: {
      type: String,
      enum: ['self', 'peer_help', 'manager_help']
    }
  }],
  reassignment_history: [{
    from_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    to_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['help', 'rebalance', 'escalation', 'vacation']
    },
    timestamp: Date
  }]
}

// ADD pre-save hook to track started_at
taskSchema.pre('save', function(next) {
  // Track when task first moves to in_progress
  if (this.isModified('status') && this.status === 'in_progress' && !this.signal_tracking?.started_at) {
    this.signal_tracking = this.signal_tracking || {};
    this.signal_tracking.started_at = new Date();
  }

  // Track reopens
  if (this.isModified('status') && this.status === 'in_progress' && this._previousStatus === 'completed') {
    this.signal_tracking = this.signal_tracking || {};
    this.signal_tracking.reopen_count = (this.signal_tracking.reopen_count || 0) + 1;
    this.signal_tracking.last_reopened_at = new Date();
  }

  next();
});
```

**Lines Added**: ~45

### 2. New Model: Kudos

**File**: `server/models/Kudos.js` (NEW)

```javascript
/**
 * Kudos Model
 * Lightweight recognition system - data stored here, analysis in iBrain
 */
const mongoose = require('mongoose');

const kudosSchema = new mongoose.Schema({
  // Multi-tenant isolation
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // Participants
  giver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Kudos Content
  category: {
    type: String,
    required: true,
    index: true
    // Categories loaded from config, not hardcoded enum
  },
  message: {
    type: String,
    maxlength: 500,
    trim: true
  },
  visibility: {
    type: String,
    enum: ['private', 'team', 'company'],
    default: 'team'
  },

  // Optional Context
  related_task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  related_goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  },

  // iBrain Sync
  ibrain_synced: {
    type: Boolean,
    default: false
  },
  ibrain_synced_at: Date

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for efficient queries
kudosSchema.index({ company_id: 1, created_at: -1 });
kudosSchema.index({ receiver_id: 1, created_at: -1 });
kudosSchema.index({ giver_id: 1, created_at: -1 });

module.exports = mongoose.model('Kudos', kudosSchema);
```

**Lines**: ~70

### 3. Kudos Categories Configuration

**File**: `server/config/kudosCategories.js` (NEW)

```javascript
/**
 * Kudos Categories Configuration
 * Single source of truth - NO HARDCODING
 *
 * Used by:
 * - server/models/Kudos.js (validation)
 * - client/pages/kudos.html (dropdown)
 * - iBrain scoring (category weights)
 */

const KUDOS_CATEGORIES = [
  {
    id: 'collaboration',
    label: 'Collaboration',
    description: 'Helping teammates, unblocking others',
    icon: '🤝',
    color: 'blue',
    weight: 1.2,  // Weighted higher for team health
    examples: ['Helped me debug', 'Covered my tasks', 'Great pair programming']
  },
  {
    id: 'quality',
    label: 'Quality Work',
    description: 'Exceptional quality, attention to detail',
    icon: '⭐',
    color: 'amber',
    weight: 1.0,
    examples: ['Thorough testing', 'Clean code', 'Well-documented']
  },
  {
    id: 'innovation',
    label: 'Innovation',
    description: 'Creative solutions, new ideas',
    icon: '💡',
    color: 'purple',
    weight: 1.1,
    examples: ['Automated the process', 'Found a better way', 'Creative approach']
  },
  {
    id: 'mentorship',
    label: 'Mentorship',
    description: 'Teaching, guiding, coaching',
    icon: '🎓',
    color: 'green',
    weight: 1.3,  // Highest - builds culture
    examples: ['Patient explanation', 'Great feedback', 'Helped me grow']
  },
  {
    id: 'reliability',
    label: 'Reliability',
    description: 'Dependable, always delivers',
    icon: '🎯',
    color: 'emerald',
    weight: 1.0,
    examples: ['Always on time', 'Dependable', 'Never drops the ball']
  },
  {
    id: 'positivity',
    label: 'Positivity',
    description: 'Great attitude, team spirit',
    icon: '☀️',
    color: 'orange',
    weight: 0.9,
    examples: ['Positive energy', 'Team motivator', 'Great attitude']
  }
];

// Validation
function isValidCategory(categoryId) {
  return KUDOS_CATEGORIES.some(c => c.id === categoryId);
}

function getCategoryIds() {
  return KUDOS_CATEGORIES.map(c => c.id);
}

function getCategoryById(id) {
  return KUDOS_CATEGORIES.find(c => c.id === id) || null;
}

function getCategoriesForDropdown() {
  return KUDOS_CATEGORIES.map(c => ({
    value: c.id,
    label: c.label,
    icon: c.icon,
    description: c.description
  }));
}

// For iBrain sync
function getCategoryWeights() {
  return KUDOS_CATEGORIES.reduce((acc, c) => {
    acc[c.id] = c.weight;
    return acc;
  }, {});
}

module.exports = {
  KUDOS_CATEGORIES,
  isValidCategory,
  getCategoryIds,
  getCategoryById,
  getCategoriesForDropdown,
  getCategoryWeights
};
```

**Lines**: ~95

### 4. Event Collector Service

**File**: `server/services/EventCollector.js` (NEW)

```javascript
/**
 * EventCollector - Batches behavioral events for iBrain
 *
 * Design:
 * - Collects events in memory buffer
 * - Flushes to iBrain every 60s OR when buffer hits 100 events
 * - Graceful degradation if iBrain unavailable
 * - No blocking of main application flow
 */
const iBrainClient = require('./iBrainClient');
const logger = require('../config/logger');

class EventCollector {
  constructor() {
    this.buffer = [];
    this.maxBufferSize = parseInt(process.env.EVENT_BUFFER_SIZE) || 100;
    this.flushIntervalMs = parseInt(process.env.EVENT_FLUSH_INTERVAL_MS) || 60000;
    this.isEnabled = process.env.FEATURE_IBRAIN_ENABLED === 'true';

    // Start flush interval
    if (this.isEnabled) {
      this.flushInterval = setInterval(() => this.flush(), this.flushIntervalMs);
    }
  }

  /**
   * Add event to buffer (non-blocking)
   */
  async collect(eventType, companyId, memberId, data, metadata = {}) {
    if (!this.isEnabled) return;

    const event = {
      event_type: eventType,
      event_version: '1.0',
      timestamp: new Date().toISOString(),
      company_id: companyId,
      member_id: memberId,
      data,
      metadata: {
        ...metadata,
        source: 'karvia',
        collected_at: new Date().toISOString()
      }
    };

    this.buffer.push(event);

    // Flush if buffer is full
    if (this.buffer.length >= this.maxBufferSize) {
      this.flush();
    }
  }

  /**
   * Flush buffer to iBrain
   */
  async flush() {
    if (this.buffer.length === 0) return;

    const eventsToSend = [...this.buffer];
    this.buffer = [];

    try {
      await iBrainClient.submitBehavioralEvents(eventsToSend);
      logger.info(`EventCollector: Flushed ${eventsToSend.length} events to iBrain`);
    } catch (error) {
      logger.error('EventCollector: Failed to flush events', error.message);
      // Re-add to buffer for retry (with limit to prevent memory issues)
      if (this.buffer.length < this.maxBufferSize * 2) {
        this.buffer = [...eventsToSend, ...this.buffer];
      }
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    clearInterval(this.flushInterval);
    await this.flush();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONVENIENCE METHODS FOR COMMON EVENTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Task status changed
   */
  async trackTaskStatusChange(task, fromStatus, toStatus, user) {
    await this.collect(
      'task.status_changed',
      user.company?.ibrain_company_id,
      user.ibrain_member_id,
      {
        task_id: task._id.toString(),
        from_status: fromStatus,
        to_status: toStatus
      },
      {
        assigned_at: task.assigned_at,
        started_at: task.signal_tracking?.started_at,
        due_date: task.due_date,
        completed_at: toStatus === 'completed' ? new Date() : null,
        was_reopened: (task.signal_tracking?.reopen_count || 0) > 0,
        reopen_count: task.signal_tracking?.reopen_count || 0,
        was_blocked: (task.signal_tracking?.blocked_events?.length || 0) > 0,
        category: task.category,
        priority: task.priority
      }
    );
  }

  /**
   * Task comment added
   */
  async trackComment(task, comment, commenter) {
    const isOwnTask = task.assigned_to?.toString() === commenter._id.toString();

    await this.collect(
      'task.comment_added',
      commenter.company?.ibrain_company_id,
      commenter.ibrain_member_id,
      {
        task_id: task._id.toString(),
        task_owner_id: task.assigned_to?.ibrain_member_id
      },
      {
        is_own_task: isOwnTask,
        comment_length: comment.text?.split(/\s+/).length || 0,
        has_mention: comment.text?.includes('@') || false
      }
    );
  }

  /**
   * Task unblocked
   */
  async trackUnblock(task, unblockedBy, resolutionType) {
    const lastBlockedEvent = task.signal_tracking?.blocked_events?.slice(-1)[0];
    const blockedDuration = lastBlockedEvent?.blocked_at
      ? (Date.now() - new Date(lastBlockedEvent.blocked_at).getTime()) / (1000 * 60 * 60)
      : 0;

    await this.collect(
      'task.unblocked',
      unblockedBy.company?.ibrain_company_id,
      unblockedBy.ibrain_member_id,
      {
        task_id: task._id.toString(),
        task_owner_id: task.assigned_to?.ibrain_member_id
      },
      {
        blocked_duration_hours: Math.round(blockedDuration * 10) / 10,
        resolution_type: resolutionType
      }
    );
  }

  /**
   * Kudos given
   */
  async trackKudos(kudos, giver, receiver) {
    await this.collect(
      'kudos.given',
      giver.company?.ibrain_company_id,
      giver.ibrain_member_id,
      {
        receiver_id: receiver.ibrain_member_id,
        category: kudos.category,
        visibility: kudos.visibility,
        related_task_id: kudos.related_task_id?.toString()
      },
      {
        giver_role: giver.role,
        receiver_role: receiver.role,
        message_length: kudos.message?.length || 0
      }
    );
  }

  /**
   * Passion profile updated
   */
  async trackPassionProfileUpdate(user, profile, isInitial) {
    await this.collect(
      'passion_profile.updated',
      user.company?.ibrain_company_id,
      user.ibrain_member_id,
      {
        profile
      },
      {
        is_initial: isInitial
      }
    );
  }

  /**
   * Pulse check submitted
   */
  async trackPulseCheck(user, pulse) {
    await this.collect(
      'pulse_check.submitted',
      user.company?.ibrain_company_id,
      user.ibrain_member_id,
      {
        pulse
      },
      {
        week_number: this.getWeekNumber()
      }
    );
  }

  getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 604800000;
    return Math.ceil(diff / oneWeek);
  }
}

// Singleton instance
const eventCollector = new EventCollector();

// Graceful shutdown
process.on('SIGTERM', () => eventCollector.shutdown());
process.on('SIGINT', () => eventCollector.shutdown());

module.exports = eventCollector;
```

**Lines**: ~200

### 5. Kudos Routes

**File**: `server/routes/kudos.js` (NEW)

```javascript
/**
 * Kudos Routes
 * CRUD for recognition system
 */
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const Kudos = require('../models/Kudos');
const User = require('../models/User');
const eventCollector = require('../services/EventCollector');
const { isValidCategory } = require('../config/kudosCategories');

/**
 * POST /api/kudos
 * Give kudos to a teammate
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, category, message, visibility, related_task_id } = req.body;

    // Validation
    if (!receiver_id || !category) {
      return res.status(400).json({ error: 'receiver_id and category are required' });
    }

    if (!isValidCategory(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Can't give kudos to yourself
    if (receiver_id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot give kudos to yourself' });
    }

    // Verify receiver exists and is in same company
    const receiver = await User.findOne({
      _id: receiver_id,
      company_id: req.user.company_id
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Create kudos
    const kudos = new Kudos({
      company_id: req.user.company_id,
      giver_id: req.user._id,
      receiver_id,
      category,
      message: message?.trim(),
      visibility: visibility || 'team',
      related_task_id
    });

    await kudos.save();

    // Track event for iBrain (non-blocking)
    eventCollector.trackKudos(kudos, req.user, receiver).catch(err => {
      console.error('Failed to track kudos event:', err);
    });

    // Populate for response
    await kudos.populate('giver_id', 'name email');
    await kudos.populate('receiver_id', 'name email');

    res.status(201).json({
      success: true,
      data: kudos
    });

  } catch (error) {
    console.error('Error creating kudos:', error);
    res.status(500).json({ error: 'Failed to create kudos' });
  }
});

/**
 * GET /api/kudos/received
 * Get kudos received by current user
 */
router.get('/received', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const kudos = await Kudos.find({
      receiver_id: req.user._id,
      company_id: req.user.company_id
    })
    .sort({ created_at: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .populate('giver_id', 'name email')
    .populate('related_task_id', 'title');

    res.json({
      success: true,
      data: kudos
    });

  } catch (error) {
    console.error('Error fetching received kudos:', error);
    res.status(500).json({ error: 'Failed to fetch kudos' });
  }
});

/**
 * GET /api/kudos/given
 * Get kudos given by current user
 */
router.get('/given', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const kudos = await Kudos.find({
      giver_id: req.user._id,
      company_id: req.user.company_id
    })
    .sort({ created_at: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .populate('receiver_id', 'name email')
    .populate('related_task_id', 'title');

    res.json({
      success: true,
      data: kudos
    });

  } catch (error) {
    console.error('Error fetching given kudos:', error);
    res.status(500).json({ error: 'Failed to fetch kudos' });
  }
});

/**
 * GET /api/kudos/team
 * Get team kudos (visible based on visibility settings)
 */
router.get('/team', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const kudos = await Kudos.find({
      company_id: req.user.company_id,
      visibility: { $in: ['team', 'company'] }
    })
    .sort({ created_at: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .populate('giver_id', 'name email')
    .populate('receiver_id', 'name email')
    .populate('related_task_id', 'title');

    res.json({
      success: true,
      data: kudos
    });

  } catch (error) {
    console.error('Error fetching team kudos:', error);
    res.status(500).json({ error: 'Failed to fetch kudos' });
  }
});

/**
 * GET /api/kudos/stats
 * Get kudos statistics for current user (self-view only)
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Count received
    const received = await Kudos.countDocuments({
      receiver_id: req.user._id,
      created_at: { $gte: thirtyDaysAgo }
    });

    // Count given
    const given = await Kudos.countDocuments({
      giver_id: req.user._id,
      created_at: { $gte: thirtyDaysAgo }
    });

    // Get category breakdown (received)
    const categoryBreakdown = await Kudos.aggregate([
      {
        $match: {
          receiver_id: req.user._id,
          created_at: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        period: '30_days',
        received,
        given,
        category_breakdown: categoryBreakdown.reduce((acc, c) => {
          acc[c._id] = c.count;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Error fetching kudos stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
```

**Lines**: ~180

### 6. iBrainClient Extension

**Add to**: `server/services/iBrainClient.js`

```javascript
// ═══════════════════════════════════════════════════════════════════════════
// BEHAVIORAL EVENT SUBMISSION (Add to existing iBrainClient)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Submit batched behavioral events
 * @param {Array} events - Array of behavioral events
 */
static async submitBehavioralEvents(events) {
  if (!events || events.length === 0) return;

  const response = await axios.post(
    `${this.BASE_URL}/api/v1/ingest/behavioral-events`,
    { events },
    { headers: this.headers() }
  );
  return response.data;
}

/**
 * Get Engagement Score for a member
 * @param {String} ibrainMemberId - iBrain member ID
 * @returns Engagement score (only visible to self)
 */
static async getEngagementScore(ibrainMemberId) {
  const response = await axios.get(
    `${this.BASE_URL}/api/v1/scores/engagement/${ibrainMemberId}`,
    { headers: this.headers() }
  );
  return response.data;
}

/**
 * Get Passion Score for a member
 * @param {String} ibrainMemberId - iBrain member ID
 * @returns Passion score (only visible to self)
 */
static async getPassionScore(ibrainMemberId) {
  const response = await axios.get(
    `${this.BASE_URL}/api/v1/scores/passion/${ibrainMemberId}`,
    { headers: this.headers() }
  );
  return response.data;
}

/**
 * Get Quality Score for a member
 * @param {String} ibrainMemberId - iBrain member ID
 * @returns Quality score (only visible to self)
 */
static async getQualityScore(ibrainMemberId) {
  const response = await axios.get(
    `${this.BASE_URL}/api/v1/scores/quality/${ibrainMemberId}`,
    { headers: this.headers() }
  );
  return response.data;
}

/**
 * Get Human Element Score for company (aggregate)
 * @param {String} ibrainCompanyId - iBrain company ID
 */
static async getHumanElementScore(ibrainCompanyId) {
  const response = await axios.get(
    `${this.BASE_URL}/api/v1/scores/human-element/${ibrainCompanyId}`,
    { headers: this.headers() }
  );
  return response.data;
}

/**
 * Get Team Pulse (manager view - aggregate only)
 * @param {String} ibrainCompanyId - iBrain company ID
 * @param {String} teamId - Optional team filter
 */
static async getTeamPulse(ibrainCompanyId, teamId = null) {
  const url = teamId
    ? `${this.BASE_URL}/api/v1/scores/team-pulse/${ibrainCompanyId}?team=${teamId}`
    : `${this.BASE_URL}/api/v1/scores/team-pulse/${ibrainCompanyId}`;

  const response = await axios.get(url, { headers: this.headers() });
  return response.data;
}

/**
 * Submit passion profile update
 * @param {String} ibrainMemberId - iBrain member ID
 * @param {Object} profile - IKIGAI profile
 */
static async updatePassionProfile(ibrainMemberId, profile) {
  const response = await axios.put(
    `${this.BASE_URL}/api/v1/profiles/passion/${ibrainMemberId}`,
    { profile },
    { headers: this.headers() }
  );
  return response.data;
}
```

**Lines Added**: ~85

---

## iBrain Implementation: Score Calculators

### 1. Data Models

#### BehavioralEvent Collection

**File**: `iBrain/engines/tracking-engine/models/BehavioralEvent.js`

```javascript
const mongoose = require('mongoose');

const behavioralEventSchema = new mongoose.Schema({
  // Event Identification
  event_type: {
    type: String,
    required: true,
    index: true
  },
  event_version: {
    type: String,
    default: '1.0'
  },

  // Identity
  company_id: {
    type: String,
    required: true,
    index: true
  },
  member_id: {
    type: String,
    required: true,
    index: true
  },

  // Event Data (flexible schema)
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Processing Status
  processed: {
    type: Boolean,
    default: false,
    index: true
  },
  processed_at: Date,

  // Source tracking
  source: {
    type: String,
    default: 'karvia'
  },

  // Timestamp (from event, not insert time)
  timestamp: {
    type: Date,
    required: true,
    index: true
  }

}, {
  timestamps: { createdAt: 'received_at', updatedAt: 'updated_at' }
});

// Compound indexes for efficient querying
behavioralEventSchema.index({ company_id: 1, event_type: 1, timestamp: -1 });
behavioralEventSchema.index({ member_id: 1, event_type: 1, timestamp: -1 });
behavioralEventSchema.index({ processed: 1, timestamp: 1 }); // For processing queue

// TTL - Keep events for 1 year
behavioralEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

module.exports = mongoose.model('BehavioralEvent', behavioralEventSchema);
```

#### WorkPattern Collection

**File**: `iBrain/engines/scoring-engine/models/WorkPattern.js`

```javascript
const mongoose = require('mongoose');

const workPatternSchema = new mongoose.Schema({
  // Identity
  member_id: {
    type: String,
    required: true,
    index: true
  },
  company_id: {
    type: String,
    required: true,
    index: true
  },

  // Execution Patterns (detected from task events)
  execution_patterns: {
    timing: {
      type: String,
      enum: ['early_starter', 'deadline_rusher', 'steady_eddie', 'sprinter'],
      default: 'steady_eddie'
    },
    quality: {
      type: String,
      enum: ['first_time_right', 'iterative', 'needs_review'],
      default: 'first_time_right'
    },
    avg_time_to_start_hours: Number,
    avg_completion_buffer_hours: Number,
    reopen_rate: Number,
    on_time_rate: Number
  },

  // Collaboration Patterns (detected from interactions)
  collaboration_patterns: {
    style: {
      type: String,
      enum: ['team_player', 'mentor', 'specialist', 'generalist', 'independent'],
      default: 'independent'
    },
    tasks_helped_count: { type: Number, default: 0 },
    unblocks_given_count: { type: Number, default: 0 },
    cross_category_ratio: Number,
    avg_help_response_hours: Number
  },

  // Recognition Patterns (from kudos)
  recognition_patterns: {
    giving_style: {
      type: String,
      enum: ['cheerleader', 'selective', 'silent', 'favorites'],
      default: 'selective'
    },
    kudos_given_count: { type: Number, default: 0 },
    kudos_received_count: { type: Number, default: 0 },
    unique_people_recognized: { type: Number, default: 0 },
    unique_recognizers: { type: Number, default: 0 },
    top_received_category: String
  },

  // Energy Patterns (from pulse + activity)
  energy_patterns: {
    status: {
      type: String,
      enum: ['thriving', 'stretched', 'coasting', 'struggling', 'unknown'],
      default: 'unknown'
    },
    workload_trend: {
      type: String,
      enum: ['increasing', 'stable', 'decreasing'],
      default: 'stable'
    },
    avg_pulse_workload: Number,  // 1-5
    avg_pulse_energy: Number,    // 1-5
    activity_hours_pattern: String  // 'work_hours', 'extended', 'irregular'
  },

  // Pattern Confidence
  confidence: {
    execution: { type: Number, min: 0, max: 1, default: 0 },
    collaboration: { type: Number, min: 0, max: 1, default: 0 },
    recognition: { type: Number, min: 0, max: 1, default: 0 },
    energy: { type: Number, min: 0, max: 1, default: 0 }
  },

  // Last calculated
  calculated_at: {
    type: Date,
    default: Date.now
  },

  // Events processed count (for confidence)
  events_processed: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

// Unique per member
workPatternSchema.index({ member_id: 1 }, { unique: true });

module.exports = mongoose.model('WorkPattern', workPatternSchema);
```

#### ScoreConfig Collection (No Hardcoding)

**File**: `iBrain/engines/scoring-engine/models/ScoreConfig.js`

```javascript
const mongoose = require('mongoose');

/**
 * ScoreConfig - Configurable weights and thresholds
 * NO HARDCODING - All scoring parameters stored here
 */
const scoreConfigSchema = new mongoose.Schema({
  // Config identification
  config_type: {
    type: String,
    enum: ['global', 'industry', 'company'],
    required: true,
    index: true
  },
  config_key: {
    type: String,
    required: true,
    index: true
    // 'global', 'cattle_livestock', 'IB-CO-xxxxxxxx'
  },

  // Engagement Score Weights (must sum to 1.0)
  engagement_weights: {
    participation: { type: Number, default: 0.20 },
    execution_quality: { type: Number, default: 0.25 },
    collaboration: { type: Number, default: 0.25 },
    responsiveness: { type: Number, default: 0.15 },
    recognition: { type: Number, default: 0.15 }
  },

  // Passion Score Weights (must sum to 1.0)
  passion_weights: {
    love_alignment: { type: Number, default: 0.30 },
    skill_alignment: { type: Number, default: 0.25 },
    growth_alignment: { type: Number, default: 0.20 },
    drain_avoidance: { type: Number, default: 0.15 },
    recognition_fit: { type: Number, default: 0.10 }
  },

  // Quality Score Weights (must sum to 1.0)
  quality_weights: {
    first_time_right: { type: Number, default: 0.35 },
    timeliness: { type: Number, default: 0.25 },
    no_downstream_blocks: { type: Number, default: 0.25 },
    improvement_trend: { type: Number, default: 0.15 }
  },

  // Human Element Score Weights (must sum to 1.0)
  human_element_weights: {
    engagement: { type: Number, default: 0.35 },
    passion: { type: Number, default: 0.30 },
    quality: { type: Number, default: 0.35 }
  },

  // Thresholds for alerts
  thresholds: {
    // Burnout detection
    burnout_warning: {
      pulse_energy_below: { type: Number, default: 2.5 },
      pulse_workload_above: { type: Number, default: 4.0 },
      consecutive_weeks: { type: Number, default: 2 }
    },
    // Disengagement detection
    disengagement_warning: {
      response_latency_increase_percent: { type: Number, default: 50 },
      activity_decline_percent: { type: Number, default: 30 },
      consecutive_weeks: { type: Number, default: 3 }
    },
    // Recognition imbalance
    recognition_imbalance: {
      giving_ratio_min: { type: Number, default: 0.5 },  // Give at least 50% of what you receive
      diversity_min: { type: Number, default: 3 }  // Recognize at least 3 different people
    },
    // Quality concerns
    quality_concerns: {
      reopen_rate_max: { type: Number, default: 0.2 },  // Max 20% reopen rate
      on_time_rate_min: { type: Number, default: 0.7 }   // Min 70% on-time
    }
  },

  // Kudos category weights (from config)
  kudos_category_weights: {
    collaboration: { type: Number, default: 1.2 },
    quality: { type: Number, default: 1.0 },
    innovation: { type: Number, default: 1.1 },
    mentorship: { type: Number, default: 1.3 },
    reliability: { type: Number, default: 1.0 },
    positivity: { type: Number, default: 0.9 }
  },

  // Privacy thresholds
  privacy: {
    min_responses_for_aggregate: { type: Number, default: 4 },
    min_team_size_for_team_view: { type: Number, default: 4 },
    individual_scores_visible_to: {
      type: String,
      enum: ['self_only', 'self_and_manager', 'self_manager_executive'],
      default: 'self_only'
    }
  },

  // Metadata
  active: { type: Boolean, default: true },
  version: { type: String, default: '1.0' }

}, {
  timestamps: true
});

// Unique config per key
scoreConfigSchema.index({ config_type: 1, config_key: 1 }, { unique: true });

// Validation: weights must sum to 1.0
scoreConfigSchema.pre('save', function(next) {
  const validateWeights = (weights, name) => {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1.0) > 0.001) {
      return new Error(`${name} weights must sum to 1.0, got ${sum}`);
    }
    return null;
  };

  const errors = [
    validateWeights(this.engagement_weights, 'engagement'),
    validateWeights(this.passion_weights, 'passion'),
    validateWeights(this.quality_weights, 'quality'),
    validateWeights(this.human_element_weights, 'human_element')
  ].filter(e => e !== null);

  if (errors.length > 0) {
    return next(errors[0]);
  }
  next();
});

module.exports = mongoose.model('ScoreConfig', scoreConfigSchema);
```

### 2. Score Calculators

#### EngagementScoreCalculator

**File**: `iBrain/engines/scoring-engine/services/EngagementScoreCalculator.js`

```javascript
const BehavioralEvent = require('../../tracking-engine/models/BehavioralEvent');
const WorkPattern = require('../models/WorkPattern');
const ScoreConfig = require('../models/ScoreConfig');
const Member = require('../../iam-engine/models/Member');

class EngagementScoreCalculator {

  constructor() {
    this.defaultConfig = null;
  }

  /**
   * Calculate Engagement Score for a member
   * @param {String} memberId - iBrain member ID
   * @param {Object} options - { periodDays: 30 }
   */
  async calculate(memberId, options = {}) {
    const periodDays = options.periodDays || 30;
    const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // Get member and company
    const member = await Member.findOne({ ibrain_id: memberId }).populate('company_id');
    if (!member) throw new Error('Member not found');

    // Get config (company -> industry -> global fallback)
    const config = await this.getConfig(member.company_id);
    const weights = config.engagement_weights;

    // Get events for period
    const events = await BehavioralEvent.find({
      member_id: memberId,
      timestamp: { $gte: periodStart }
    });

    // Get or create work pattern
    let pattern = await WorkPattern.findOne({ member_id: memberId });
    if (!pattern) {
      pattern = new WorkPattern({
        member_id: memberId,
        company_id: member.company_id.ibrain_id
      });
    }

    // Calculate components
    const participation = await this.calculateParticipation(memberId, events, periodStart);
    const executionQuality = await this.calculateExecutionQuality(events);
    const collaboration = await this.calculateCollaboration(memberId, events);
    const responsiveness = await this.calculateResponsiveness(events);
    const recognition = await this.calculateRecognition(memberId, events);

    // Weighted composite
    const overall = Math.round(
      participation * weights.participation +
      executionQuality * weights.execution_quality +
      collaboration * weights.collaboration +
      responsiveness * weights.responsiveness +
      recognition * weights.recognition
    );

    // Update pattern
    pattern.events_processed = events.length;
    pattern.calculated_at = new Date();
    await pattern.save();

    return {
      member_id: memberId,
      score: {
        overall,
        participation: Math.round(participation),
        execution_quality: Math.round(executionQuality),
        collaboration: Math.round(collaboration),
        responsiveness: Math.round(responsiveness),
        recognition: Math.round(recognition)
      },
      weights,
      period_days: periodDays,
      events_analyzed: events.length,
      confidence: this.calculateConfidence(events.length, periodDays),
      calculated_at: new Date()
    };
  }

  async calculateParticipation(memberId, events, periodStart) {
    // Pulse responses
    const pulseEvents = events.filter(e => e.event_type === 'pulse_check.submitted');
    const expectedPulses = Math.ceil((Date.now() - periodStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const pulseRate = expectedPulses > 0 ? Math.min(pulseEvents.length / expectedPulses, 1) : 0.5;

    // Kudos given
    const kudosGiven = events.filter(e => e.event_type === 'kudos.given').length;
    const expectedKudos = 2 * (expectedPulses || 1);  // ~2 per week expected
    const kudosRate = Math.min(kudosGiven / expectedKudos, 1);

    return (pulseRate * 0.5 + kudosRate * 0.5) * 100;
  }

  async calculateExecutionQuality(events) {
    const taskEvents = events.filter(e => e.event_type === 'task.status_changed');
    const completedEvents = taskEvents.filter(e => e.data?.to_status === 'completed');

    if (completedEvents.length === 0) return 50;  // Default

    // On-time rate
    const onTime = completedEvents.filter(e => {
      const completed = new Date(e.metadata?.completed_at || e.timestamp);
      const due = new Date(e.metadata?.due_date);
      return due && completed <= due;
    }).length;
    const onTimeRate = onTime / completedEvents.length;

    // First-time-right rate (no reopens)
    const noReopens = completedEvents.filter(e => !e.metadata?.was_reopened).length;
    const firstTimeRate = noReopens / completedEvents.length;

    // No downstream blocks
    const noBlocks = completedEvents.filter(e => !e.metadata?.caused_block).length;
    const noBlockRate = noBlocks / completedEvents.length;

    return (onTimeRate * 0.5 + firstTimeRate * 0.3 + noBlockRate * 0.2) * 100;
  }

  async calculateCollaboration(memberId, events) {
    // Unblocks given to others
    const unblockEvents = events.filter(e =>
      e.event_type === 'task.unblocked' &&
      e.metadata?.resolution_type === 'peer_help'
    );

    // Comments on others' tasks
    const helpComments = events.filter(e =>
      e.event_type === 'task.comment_added' &&
      !e.metadata?.is_own_task
    );

    // Tasks picked up from others
    const taskEvents = events.filter(e => e.event_type === 'task.status_changed');
    const pickedUp = taskEvents.filter(e =>
      e.metadata?.is_reassignment &&
      e.metadata?.reassignment_reason === 'help'
    );

    const totalSignals = unblockEvents.length + helpComments.length + pickedUp.length;
    const expectedSignals = 10;  // Expected ~10 collaboration signals per month

    return Math.min((totalSignals / expectedSignals), 1) * 100;
  }

  async calculateResponsiveness(events) {
    const taskEvents = events.filter(e =>
      e.event_type === 'task.status_changed' &&
      e.data?.to_status === 'in_progress'
    );

    if (taskEvents.length === 0) return 50;

    // Average time to start (hours)
    const startTimes = taskEvents
      .filter(e => e.metadata?.assigned_at && e.metadata?.started_at)
      .map(e => {
        const assigned = new Date(e.metadata.assigned_at);
        const started = new Date(e.metadata.started_at);
        return (started - assigned) / (1000 * 60 * 60);
      });

    if (startTimes.length === 0) return 50;

    const avgStartTime = startTimes.reduce((a, b) => a + b, 0) / startTimes.length;

    // Score: <24h = 100, 24-48h = 80, 48-72h = 60, >72h = 40
    if (avgStartTime < 24) return 100;
    if (avgStartTime < 48) return 80;
    if (avgStartTime < 72) return 60;
    return 40;
  }

  async calculateRecognition(memberId, events) {
    const kudosGiven = events.filter(e => e.event_type === 'kudos.given');

    if (kudosGiven.length === 0) return 40;  // Not giving kudos is slightly negative

    // Diversity of recognition
    const uniqueReceivers = new Set(kudosGiven.map(e => e.data?.receiver_id)).size;

    // Get team size for context
    const memberDoc = await Member.findOne({ ibrain_id: memberId });
    const teamSize = await Member.countDocuments({ company_id: memberDoc.company_id }) - 1;

    const diversityRate = teamSize > 0 ? Math.min(uniqueReceivers / Math.min(teamSize, 10), 1) : 0;
    const frequencyScore = Math.min(kudosGiven.length / 4, 1);  // 4 kudos/month is good

    return (diversityRate * 0.7 + frequencyScore * 0.3) * 100;
  }

  calculateConfidence(eventCount, periodDays) {
    // More events = higher confidence, up to 1.0
    const eventsPerDay = eventCount / periodDays;
    // ~2 events/day = full confidence
    return Math.min(eventsPerDay / 2, 1);
  }

  async getConfig(company) {
    // Try company-specific
    let config = await ScoreConfig.findOne({
      config_type: 'company',
      config_key: company.ibrain_id,
      active: true
    });
    if (config) return config;

    // Try industry
    config = await ScoreConfig.findOne({
      config_type: 'industry',
      config_key: company.industry,
      active: true
    });
    if (config) return config;

    // Global fallback
    config = await ScoreConfig.findOne({
      config_type: 'global',
      config_key: 'global',
      active: true
    });
    if (config) return config;

    // Create default if none exists
    return new ScoreConfig({
      config_type: 'global',
      config_key: 'global'
    });
  }
}

module.exports = new EngagementScoreCalculator();
```

#### PassionScoreCalculator

**File**: `iBrain/engines/scoring-engine/services/PassionScoreCalculator.js`

```javascript
const BehavioralEvent = require('../../tracking-engine/models/BehavioralEvent');
const WorkPattern = require('../models/WorkPattern');
const ScoreConfig = require('../models/ScoreConfig');
const Member = require('../../iam-engine/models/Member');

class PassionScoreCalculator {

  /**
   * Calculate Passion Score (IKIGAI) for a member
   * @param {String} memberId - iBrain member ID
   */
  async calculate(memberId, options = {}) {
    const periodDays = options.periodDays || 90;  // Longer period for passion
    const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    const member = await Member.findOne({ ibrain_id: memberId }).populate('company_id');
    if (!member) throw new Error('Member not found');

    // Check if passion profile exists
    if (!member.passion_profile || !member.passion_profile.love?.length) {
      return {
        member_id: memberId,
        score: null,
        message: 'Passion profile not yet configured',
        action_required: 'complete_passion_profile'
      };
    }

    const config = await this.getConfig(member.company_id);
    const weights = config.passion_weights;

    // Get task events
    const events = await BehavioralEvent.find({
      member_id: memberId,
      event_type: 'task.status_changed',
      'data.to_status': 'completed',
      timestamp: { $gte: periodStart }
    });

    // Get kudos received
    const kudosEvents = await BehavioralEvent.find({
      'data.receiver_id': memberId,
      event_type: 'kudos.given',
      timestamp: { $gte: periodStart }
    });

    // Calculate IKIGAI components
    const loveAlignment = this.calculateLoveAlignment(member.passion_profile, events);
    const skillAlignment = this.calculateSkillAlignment(member.passion_profile, events);
    const growthAlignment = this.calculateGrowthAlignment(member.passion_profile, events);
    const drainAvoidance = this.calculateDrainAvoidance(member.passion_profile, events);
    const recognitionFit = this.calculateRecognitionFit(member.passion_profile, kudosEvents);

    // Weighted composite
    const overall = Math.round(
      loveAlignment * weights.love_alignment +
      skillAlignment * weights.skill_alignment +
      growthAlignment * weights.growth_alignment +
      drainAvoidance * weights.drain_avoidance +
      recognitionFit * weights.recognition_fit
    );

    // Update member passion score
    member.passion_profile.score = overall;
    member.passion_profile.last_assessed = new Date();
    await member.save();

    return {
      member_id: memberId,
      score: {
        overall,
        love_alignment: Math.round(loveAlignment),
        skill_alignment: Math.round(skillAlignment),
        growth_alignment: Math.round(growthAlignment),
        drain_avoidance: Math.round(drainAvoidance),
        recognition_fit: Math.round(recognitionFit)
      },
      profile_summary: {
        love: member.passion_profile.love,
        good_at: member.passion_profile.good_at,
        growth_areas: member.passion_profile.growth_areas,
        drains: member.passion_profile.drains
      },
      weights,
      period_days: periodDays,
      tasks_analyzed: events.length,
      confidence: this.calculateConfidence(events.length, member.passion_profile),
      calculated_at: new Date()
    };
  }

  calculateLoveAlignment(profile, events) {
    if (!profile.love?.length || events.length === 0) return 50;

    const loveKeywords = new Set(profile.love.map(l => l.toLowerCase()));

    let matchCount = 0;
    events.forEach(e => {
      const taskTags = e.metadata?.tags || [];
      const taskCategory = e.metadata?.category || '';
      const searchText = [...taskTags, taskCategory].join(' ').toLowerCase();

      if ([...loveKeywords].some(kw => searchText.includes(kw))) {
        matchCount++;
      }
    });

    return (matchCount / events.length) * 100;
  }

  calculateSkillAlignment(profile, events) {
    if (!profile.good_at?.length || events.length === 0) return 50;

    // Tasks in skill areas completed successfully
    const skillKeywords = new Set(profile.good_at.map(s => s.toLowerCase()));

    let skillTasks = 0;
    let successfulSkillTasks = 0;

    events.forEach(e => {
      const taskCategory = e.metadata?.category || '';
      const searchText = taskCategory.toLowerCase();

      if ([...skillKeywords].some(kw => searchText.includes(kw))) {
        skillTasks++;
        if (!e.metadata?.was_reopened) {
          successfulSkillTasks++;
        }
      }
    });

    if (skillTasks === 0) return 50;
    return (successfulSkillTasks / skillTasks) * 100;
  }

  calculateGrowthAlignment(profile, events) {
    if (!profile.growth_areas?.length || events.length === 0) return 50;

    // Tasks slightly outside comfort zone, successfully completed
    const growthKeywords = new Set(profile.growth_areas.map(g => g.toLowerCase()));

    let growthTasks = 0;
    let successfulGrowthTasks = 0;

    events.forEach(e => {
      const taskCategory = e.metadata?.category || '';
      if ([...growthKeywords].some(kw => taskCategory.toLowerCase().includes(kw))) {
        growthTasks++;
        if (!e.metadata?.was_reopened) {
          successfulGrowthTasks++;
        }
      }
    });

    // Having some growth tasks is good, completing them is better
    const hasGrowthTasks = Math.min(growthTasks / (events.length * 0.2), 1);  // 20% growth tasks is ideal
    const successRate = growthTasks > 0 ? successfulGrowthTasks / growthTasks : 0.5;

    return (hasGrowthTasks * 0.4 + successRate * 0.6) * 100;
  }

  calculateDrainAvoidance(profile, events) {
    if (!profile.drains?.length || events.length === 0) return 70;  // No drains = good

    const drainKeywords = new Set(profile.drains.map(d => d.toLowerCase()));

    let drainTasks = 0;
    events.forEach(e => {
      const taskCategory = e.metadata?.category || '';
      const taskTags = e.metadata?.tags || [];
      const searchText = [...taskTags, taskCategory].join(' ').toLowerCase();

      if ([...drainKeywords].some(kw => searchText.includes(kw))) {
        drainTasks++;
      }
    });

    // Lower drain tasks = higher score
    const drainRatio = drainTasks / events.length;
    return (1 - drainRatio) * 100;
  }

  calculateRecognitionFit(profile, kudosEvents) {
    if (kudosEvents.length === 0) return 50;

    // Check if kudos categories align with passion profile
    const loveKeywords = new Set((profile.love || []).map(l => l.toLowerCase()));
    const skillKeywords = new Set((profile.good_at || []).map(s => s.toLowerCase()));

    let alignedKudos = 0;
    kudosEvents.forEach(e => {
      const category = e.data?.category || '';
      // Map kudos categories to profile areas
      const categoryMap = {
        'collaboration': ['teamwork', 'helping', 'collaboration'],
        'quality': ['attention_to_detail', 'quality', 'thoroughness'],
        'innovation': ['problem_solving', 'innovation', 'creativity'],
        'mentorship': ['teaching', 'mentoring', 'leadership'],
        'reliability': ['reliability', 'consistency', 'dependability'],
        'positivity': ['positivity', 'attitude', 'motivation']
      };

      const relatedKeywords = categoryMap[category] || [];
      if (relatedKeywords.some(kw =>
        loveKeywords.has(kw) || skillKeywords.has(kw)
      )) {
        alignedKudos++;
      }
    });

    return (alignedKudos / kudosEvents.length) * 100;
  }

  calculateConfidence(eventCount, profile) {
    const hasProfile = profile.love?.length > 0 && profile.good_at?.length > 0;
    const hasEnoughEvents = eventCount >= 10;

    if (!hasProfile) return 0.2;
    if (!hasEnoughEvents) return 0.5;
    return Math.min(0.5 + (eventCount / 50) * 0.5, 1);
  }

  async getConfig(company) {
    // Same as EngagementScoreCalculator
    let config = await ScoreConfig.findOne({
      config_type: 'company', config_key: company.ibrain_id, active: true
    });
    if (config) return config;

    config = await ScoreConfig.findOne({
      config_type: 'industry', config_key: company.industry, active: true
    });
    if (config) return config;

    return await ScoreConfig.findOne({
      config_type: 'global', config_key: 'global', active: true
    }) || new ScoreConfig({ config_type: 'global', config_key: 'global' });
  }
}

module.exports = new PassionScoreCalculator();
```

#### QualityScoreCalculator

**File**: `iBrain/engines/scoring-engine/services/QualityScoreCalculator.js`

```javascript
const BehavioralEvent = require('../../tracking-engine/models/BehavioralEvent');
const WorkPattern = require('../models/WorkPattern');
const ScoreConfig = require('../models/ScoreConfig');
const Member = require('../../iam-engine/models/Member');

class QualityScoreCalculator {

  /**
   * Calculate Quality Score for a member
   */
  async calculate(memberId, options = {}) {
    const periodDays = options.periodDays || 30;
    const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    const member = await Member.findOne({ ibrain_id: memberId }).populate('company_id');
    if (!member) throw new Error('Member not found');

    const config = await this.getConfig(member.company_id);
    const weights = config.quality_weights;

    // Get task completion events
    const events = await BehavioralEvent.find({
      member_id: memberId,
      event_type: 'task.status_changed',
      'data.to_status': 'completed',
      timestamp: { $gte: periodStart }
    });

    if (events.length === 0) {
      return {
        member_id: memberId,
        score: { overall: 50 },
        message: 'Insufficient data for quality scoring',
        tasks_analyzed: 0
      };
    }

    // Calculate components
    const firstTimeRight = this.calculateFirstTimeRight(events);
    const timeliness = this.calculateTimeliness(events);
    const noDownstreamBlocks = this.calculateNoDownstreamBlocks(events);
    const improvementTrend = await this.calculateImprovementTrend(memberId, events, periodStart);

    // Weighted composite
    const overall = Math.round(
      firstTimeRight * weights.first_time_right +
      timeliness * weights.timeliness +
      noDownstreamBlocks * weights.no_downstream_blocks +
      improvementTrend * weights.improvement_trend
    );

    // Detect quality pattern
    const pattern = this.detectQualityPattern(firstTimeRight, timeliness, events);

    return {
      member_id: memberId,
      score: {
        overall,
        first_time_right: Math.round(firstTimeRight),
        timeliness: Math.round(timeliness),
        no_downstream_blocks: Math.round(noDownstreamBlocks),
        improvement_trend: Math.round(improvementTrend)
      },
      pattern,
      weights,
      period_days: periodDays,
      tasks_analyzed: events.length,
      confidence: Math.min(events.length / 20, 1),
      calculated_at: new Date()
    };
  }

  calculateFirstTimeRight(events) {
    const noReopens = events.filter(e =>
      !e.metadata?.was_reopened &&
      (e.metadata?.reopen_count || 0) === 0
    ).length;

    return (noReopens / events.length) * 100;
  }

  calculateTimeliness(events) {
    const withDueDate = events.filter(e => e.metadata?.due_date);
    if (withDueDate.length === 0) return 50;

    const onTime = withDueDate.filter(e => {
      const completed = new Date(e.metadata?.completed_at || e.timestamp);
      const due = new Date(e.metadata.due_date);
      return completed <= due;
    }).length;

    return (onTime / withDueDate.length) * 100;
  }

  calculateNoDownstreamBlocks(events) {
    // Tasks that didn't cause blocks after completion
    const noBlocks = events.filter(e => !e.metadata?.caused_downstream_block).length;
    return (noBlocks / events.length) * 100;
  }

  async calculateImprovementTrend(memberId, recentEvents, periodStart) {
    // Compare to previous period
    const previousPeriodStart = new Date(periodStart.getTime() - (Date.now() - periodStart.getTime()));

    const previousEvents = await BehavioralEvent.find({
      member_id: memberId,
      event_type: 'task.status_changed',
      'data.to_status': 'completed',
      timestamp: { $gte: previousPeriodStart, $lt: periodStart }
    });

    if (previousEvents.length < 5) return 50;  // Not enough data

    const currentReopenRate = recentEvents.filter(e => e.metadata?.was_reopened).length / recentEvents.length;
    const previousReopenRate = previousEvents.filter(e => e.metadata?.was_reopened).length / previousEvents.length;

    // Improvement = lower reopen rate
    if (currentReopenRate < previousReopenRate) return 80;
    if (currentReopenRate === previousReopenRate) return 50;
    return 30;
  }

  detectQualityPattern(firstTimeRight, timeliness, events) {
    if (firstTimeRight >= 90 && timeliness >= 80) return 'first_time_right';
    if (firstTimeRight < 70 && timeliness >= 90) return 'needs_review';  // Fast but reopens
    if (firstTimeRight >= 80 && timeliness < 70) return 'thorough_but_slow';
    return 'balanced';
  }

  async getConfig(company) {
    let config = await ScoreConfig.findOne({
      config_type: 'company', config_key: company.ibrain_id, active: true
    });
    if (config) return config;

    config = await ScoreConfig.findOne({
      config_type: 'industry', config_key: company.industry, active: true
    });
    if (config) return config;

    return await ScoreConfig.findOne({
      config_type: 'global', config_key: 'global', active: true
    }) || new ScoreConfig({ config_type: 'global', config_key: 'global' });
  }
}

module.exports = new QualityScoreCalculator();
```

#### HumanElementScoreCalculator (Aggregate)

**File**: `iBrain/engines/scoring-engine/services/HumanElementScoreCalculator.js`

```javascript
const EngagementScoreCalculator = require('./EngagementScoreCalculator');
const PassionScoreCalculator = require('./PassionScoreCalculator');
const QualityScoreCalculator = require('./QualityScoreCalculator');
const ScoreConfig = require('../models/ScoreConfig');
const Company = require('../../iam-engine/models/Company');
const Member = require('../../iam-engine/models/Member');

class HumanElementScoreCalculator {

  /**
   * Calculate Human Element Score for a company (aggregate)
   * Privacy: Only shows aggregate, never individual scores
   */
  async calculateCompanyScore(companyId) {
    const company = await Company.findOne({ ibrain_id: companyId });
    if (!company) throw new Error('Company not found');

    const config = await this.getConfig(company);
    const weights = config.human_element_weights;
    const minResponses = config.privacy.min_responses_for_aggregate;

    // Get all members
    const members = await Member.find({ company_id: company._id });

    if (members.length < minResponses) {
      return {
        company_id: companyId,
        score: null,
        message: `Need at least ${minResponses} team members for aggregate score`,
        member_count: members.length
      };
    }

    // Calculate individual scores (for aggregation only)
    const scores = {
      engagement: [],
      passion: [],
      quality: []
    };

    for (const member of members) {
      try {
        const engagement = await EngagementScoreCalculator.calculate(member.ibrain_id);
        if (engagement.score?.overall) scores.engagement.push(engagement.score.overall);

        const passion = await PassionScoreCalculator.calculate(member.ibrain_id);
        if (passion.score?.overall) scores.passion.push(passion.score.overall);

        const quality = await QualityScoreCalculator.calculate(member.ibrain_id);
        if (quality.score?.overall) scores.quality.push(quality.score.overall);
      } catch (err) {
        // Skip members with insufficient data
        continue;
      }
    }

    // Check minimum responses
    if (scores.engagement.length < minResponses) {
      return {
        company_id: companyId,
        score: null,
        message: 'Insufficient data for aggregate scoring',
        data_points: {
          engagement: scores.engagement.length,
          passion: scores.passion.length,
          quality: scores.quality.length
        }
      };
    }

    // Calculate averages
    const avgEngagement = this.average(scores.engagement);
    const avgPassion = this.average(scores.passion);
    const avgQuality = this.average(scores.quality);

    // Weighted composite
    const overall = Math.round(
      avgEngagement * weights.engagement +
      avgPassion * weights.passion +
      avgQuality * weights.quality
    );

    // Detect any alerts
    const alerts = await this.detectAlerts(company, scores, config);

    // Store on company
    company.human_element_score = {
      overall,
      engagement: Math.round(avgEngagement),
      passion: Math.round(avgPassion),
      quality: Math.round(avgQuality),
      calculated_at: new Date()
    };
    await company.save();

    return {
      company_id: companyId,
      score: {
        overall,
        engagement: Math.round(avgEngagement),
        passion: Math.round(avgPassion),
        quality: Math.round(avgQuality)
      },
      trend: this.calculateTrend(company),
      weights,
      data_points: {
        engagement: scores.engagement.length,
        passion: scores.passion.length,
        quality: scores.quality.length
      },
      alerts,
      calculated_at: new Date()
    };
  }

  /**
   * Get Team Pulse (Manager view - aggregate only)
   */
  async getTeamPulse(companyId, teamId = null) {
    // Similar to calculateCompanyScore but can filter by team
    // Returns aggregate metrics only - no individual identification

    const companyScore = await this.calculateCompanyScore(companyId);

    // Add pulse-specific metrics
    return {
      ...companyScore,
      pulse_metrics: {
        avg_workload: await this.getAveragePulseMetric(companyId, 'workload'),
        avg_energy: await this.getAveragePulseMetric(companyId, 'energy'),
        response_rate: await this.getPulseResponseRate(companyId)
      }
    };
  }

  async getAveragePulseMetric(companyId, metric) {
    const BehavioralEvent = require('../../tracking-engine/models/BehavioralEvent');
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

    const pulses = await BehavioralEvent.find({
      company_id: companyId,
      event_type: 'pulse_check.submitted',
      timestamp: { $gte: fourWeeksAgo }
    });

    if (pulses.length < 4) return null;  // Privacy threshold

    const values = pulses.map(p => p.data?.pulse?.[metric]).filter(v => v != null);
    return values.length > 0 ? this.average(values) : null;
  }

  async getPulseResponseRate(companyId) {
    const members = await Member.countDocuments({ company_id: companyId });
    // Expected 4 pulses per member in 4 weeks
    const expectedPulses = members * 4;

    const BehavioralEvent = require('../../tracking-engine/models/BehavioralEvent');
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

    const actualPulses = await BehavioralEvent.countDocuments({
      company_id: companyId,
      event_type: 'pulse_check.submitted',
      timestamp: { $gte: fourWeeksAgo }
    });

    return expectedPulses > 0 ? Math.min(actualPulses / expectedPulses, 1) : 0;
  }

  async detectAlerts(company, scores, config) {
    const alerts = [];
    const thresholds = config.thresholds;

    // Low engagement
    if (this.average(scores.engagement) < 50) {
      alerts.push({
        type: 'warning',
        component: 'engagement',
        message: 'Team engagement is below healthy levels'
      });
    }

    // Low passion (many people misaligned)
    if (this.average(scores.passion) < 50) {
      alerts.push({
        type: 'info',
        component: 'passion',
        message: 'Consider reviewing role-task alignment'
      });
    }

    // Quality concerns
    if (this.average(scores.quality) < 60) {
      alerts.push({
        type: 'warning',
        component: 'quality',
        message: 'Task quality metrics need attention'
      });
    }

    return alerts;
  }

  calculateTrend(company) {
    const history = company.score_history || [];
    if (history.length < 2) return 'stable';

    const recent = history.slice(-4);
    const older = history.slice(-8, -4);

    if (older.length === 0) return 'stable';

    const recentAvg = this.average(recent.map(h => h.human_element_score || 50));
    const olderAvg = this.average(older.map(h => h.human_element_score || 50));

    if (recentAvg > olderAvg + 5) return 'improving';
    if (recentAvg < olderAvg - 5) return 'declining';
    return 'stable';
  }

  average(arr) {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  async getConfig(company) {
    let config = await ScoreConfig.findOne({
      config_type: 'company', config_key: company.ibrain_id, active: true
    });
    if (config) return config;

    config = await ScoreConfig.findOne({
      config_type: 'industry', config_key: company.industry, active: true
    });
    if (config) return config;

    return await ScoreConfig.findOne({
      config_type: 'global', config_key: 'global', active: true
    }) || new ScoreConfig({ config_type: 'global', config_key: 'global' });
  }
}

module.exports = new HumanElementScoreCalculator();
```

---

## Privacy & Anti-Gaming Rules

### Privacy Enforcement

```javascript
// In all API responses, enforce privacy rules
class PrivacyEnforcer {

  /**
   * Filter score response based on viewer role
   */
  static filterForViewer(scoreData, viewerId, viewerRole, targetId) {
    const config = scoreData.config || {};
    const visibility = config.privacy?.individual_scores_visible_to || 'self_only';

    // Self can always see own scores
    if (viewerId === targetId) {
      return scoreData;
    }

    // Check role-based visibility
    if (visibility === 'self_only') {
      return { message: 'Individual scores are private', visible: false };
    }

    if (visibility === 'self_and_manager' && viewerRole === 'MANAGER') {
      // Manager can see, but with reduced detail
      return {
        score: { overall: scoreData.score?.overall },
        trend: scoreData.trend,
        // No component breakdown
      };
    }

    if (visibility === 'self_manager_executive' &&
        ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'].includes(viewerRole)) {
      return {
        score: { overall: scoreData.score?.overall },
        trend: scoreData.trend
      };
    }

    return { message: 'Individual scores are private', visible: false };
  }

  /**
   * Ensure aggregate has minimum responses
   */
  static validateAggregate(dataPoints, minRequired = 4) {
    if (dataPoints < minRequired) {
      return {
        valid: false,
        message: `Need ${minRequired - dataPoints} more responses for aggregate`
      };
    }
    return { valid: true };
  }
}
```

### Anti-Gaming Detection

```javascript
class AntiGamingDetector {

  /**
   * Detect kudos gaming patterns
   */
  static async detectKudosGaming(memberId, recentKudos) {
    const flags = [];

    // Check for kudos inflation (too many)
    if (recentKudos.length > 20) {  // >20 in 30 days
      flags.push('kudos_inflation');
    }

    // Check for reciprocal gaming (I kudos you, you kudos me)
    const givenTo = new Set(recentKudos.filter(k => k.giver_id === memberId).map(k => k.receiver_id));
    const receivedFrom = new Set(recentKudos.filter(k => k.receiver_id === memberId).map(k => k.giver_id));
    const reciprocal = [...givenTo].filter(id => receivedFrom.has(id));

    if (reciprocal.length > givenTo.size * 0.8) {  // >80% reciprocal
      flags.push('reciprocal_pattern');
    }

    // Check for favorites (always same person)
    const receivers = recentKudos.filter(k => k.giver_id === memberId).map(k => k.receiver_id);
    const uniqueReceivers = new Set(receivers).size;
    if (receivers.length > 5 && uniqueReceivers < 3) {  // Many kudos, few recipients
      flags.push('favorites_pattern');
    }

    return {
      gaming_detected: flags.length > 0,
      flags,
      adjustment: flags.length > 0 ? 0.7 : 1.0  // Reduce weight if gaming
    };
  }

  /**
   * Detect task gaming (quick closes, reopens)
   */
  static async detectTaskGaming(events) {
    const flags = [];

    // Very fast completions followed by reopens
    const quickCloses = events.filter(e => {
      const assigned = new Date(e.metadata?.assigned_at);
      const completed = new Date(e.metadata?.completed_at || e.timestamp);
      const hours = (completed - assigned) / (1000 * 60 * 60);
      return hours < 1 && e.metadata?.was_reopened;
    });

    if (quickCloses.length > events.length * 0.3) {  // >30% quick-close-reopen
      flags.push('quick_close_gaming');
    }

    return {
      gaming_detected: flags.length > 0,
      flags
    };
  }
}
```

---

## User Stories

### Story 3.1: Task Signal Tracking (Karvia)
**Points**: 8

**As** a system
**I want** to track detailed task lifecycle events
**So that** iBrain can calculate quality and execution patterns

**Acceptance Criteria**:
- [ ] Track `started_at` when task first moves to in_progress
- [ ] Track `reopen_count` when completed task goes back to in_progress
- [ ] Track `blocked_events` with helper attribution
- [ ] Track `reassignment_history` with reason
- [ ] Events sent to iBrain via EventCollector

---

### Story 3.2: Kudos System (Karvia)
**Points**: 13

**As** a team member
**I want** to give recognition to my teammates
**So that** appreciation becomes part of our culture

**Acceptance Criteria**:
- [ ] Create Kudos model with configurable categories
- [ ] POST /api/kudos endpoint (give kudos)
- [ ] GET /api/kudos/received, /given, /team endpoints
- [ ] Visibility controls (private, team, company)
- [ ] Quick kudos prompt on task completion UI
- [ ] "Who helped?" prompt when unblocking

---

### Story 3.3: Pulse Check System (Karvia)
**Points**: 8

**As** a team member
**I want** to submit quick weekly pulse checks
**So that** the company understands team wellbeing

**Acceptance Criteria**:
- [ ] Weekly pulse prompt (workload 1-5, energy 1-5, support 1-5)
- [ ] Optional comment field
- [ ] Events sent to iBrain
- [ ] Non-intrusive UI (dismissible, quick)

---

### Story 3.4: Passion Profile UI (Karvia)
**Points**: 8

**As** a team member
**I want** to set my IKIGAI profile
**So that** I can see how my work aligns with my passions

**Acceptance Criteria**:
- [ ] Settings page: "What do you love?", "What are you good at?", "What drains you?"
- [ ] Tag-based selection (predefined + custom)
- [ ] Profile sent to iBrain
- [ ] Can update anytime

---

### Story 3.5: Event Collector Service (Karvia)
**Points**: 13

**As** a system
**I want** to batch and send behavioral events to iBrain
**So that** we don't overwhelm the API

**Acceptance Criteria**:
- [ ] EventCollector singleton with buffer
- [ ] Configurable batch size (env var)
- [ ] Configurable flush interval (env var)
- [ ] Graceful degradation if iBrain unavailable
- [ ] Graceful shutdown (flush on SIGTERM)

---

### Story 3.6: Behavioral Event Processing (iBrain)
**Points**: 13

**As** iBrain system
**I want** to receive and store behavioral events
**So that** I can calculate human element scores

**Acceptance Criteria**:
- [ ] POST /api/v1/ingest/behavioral-events endpoint
- [ ] BehavioralEvent model with flexible schema
- [ ] TTL index (1 year retention)
- [ ] Batch processing support

---

### Story 3.7: Work Pattern Detection (iBrain)
**Points**: 13

**As** iBrain system
**I want** to detect work patterns from events
**So that** scores reflect actual behavior

**Acceptance Criteria**:
- [ ] WorkPattern model per member
- [ ] Execution patterns (timing, quality)
- [ ] Collaboration patterns (helping, blocking)
- [ ] Recognition patterns (giving, receiving)
- [ ] Energy patterns (pulse trends)

---

### Story 3.8: Engagement Score Calculator (iBrain)
**Points**: 13

**As** iBrain system
**I want** to calculate engagement scores
**So that** companies understand team involvement

**Acceptance Criteria**:
- [ ] EngagementScoreCalculator service
- [ ] Configurable weights from ScoreConfig
- [ ] Components: participation, execution, collaboration, responsiveness, recognition
- [ ] GET /api/v1/scores/engagement/:memberId endpoint
- [ ] Privacy: self-view only by default

---

### Story 3.9: Passion Score Calculator (iBrain)
**Points**: 13

**As** iBrain system
**I want** to calculate passion scores (IKIGAI)
**So that** individuals understand work-life alignment

**Acceptance Criteria**:
- [ ] PassionScoreCalculator service
- [ ] IKIGAI components: love, skill, growth, drain avoidance
- [ ] Requires passion profile to calculate
- [ ] GET /api/v1/scores/passion/:memberId endpoint
- [ ] Privacy: self-view only

---

### Story 3.10: Quality Score Calculator (iBrain)
**Points**: 8

**As** iBrain system
**I want** to calculate quality scores
**So that** individuals understand their work quality

**Acceptance Criteria**:
- [ ] QualityScoreCalculator service
- [ ] Components: first-time-right, timeliness, no downstream blocks
- [ ] Quality pattern detection
- [ ] GET /api/v1/scores/quality/:memberId endpoint

---

### Story 3.11: Human Element Aggregate (iBrain)
**Points**: 13

**As** iBrain system
**I want** to calculate company-level Human Element score
**So that** executives see team health

**Acceptance Criteria**:
- [ ] HumanElementScoreCalculator service
- [ ] Aggregate of engagement + passion + quality
- [ ] Privacy threshold (min 4 members)
- [ ] GET /api/v1/scores/human-element/:companyId endpoint
- [ ] Team Pulse for managers

---

### Story 3.12: Score Configuration System (iBrain)
**Points**: 8

**As** an admin
**I want** to configure score weights and thresholds
**So that** scoring adapts to different industries/companies

**Acceptance Criteria**:
- [ ] ScoreConfig model (global, industry, company levels)
- [ ] Weight validation (must sum to 1.0)
- [ ] Threshold configuration for alerts
- [ ] Privacy settings per config level

---

### Story 3.13: Anti-Gaming Detection (iBrain)
**Points**: 8

**As** iBrain system
**I want** to detect gaming patterns
**So that** scores remain meaningful

**Acceptance Criteria**:
- [ ] Kudos inflation detection
- [ ] Reciprocal gaming detection
- [ ] Favorites pattern detection
- [ ] Quick-close task gaming detection
- [ ] Adjustment factors applied to scores

---

### Story 3.14: Personal Dashboard Widget (Karvia Frontend)
**Points**: 13

**As** a team member
**I want** to see my personal scores on my dashboard
**So that** I understand how I'm doing

**Acceptance Criteria**:
- [ ] Personal scores widget (engagement, passion, quality)
- [ ] Trend indicators
- [ ] Insights/tips based on patterns
- [ ] Link to passion profile settings
- [ ] Kudos received/given summary

---

### Story 3.15: Team Pulse Widget (Karvia Frontend)
**Points**: 8

**As** a manager
**I want** to see team pulse on my dashboard
**So that** I understand team health

**Acceptance Criteria**:
- [ ] Aggregate Human Element score display
- [ ] Pulse metrics (avg workload, energy)
- [ ] Trend indicators
- [ ] Alert badges
- [ ] No individual identification

---

## Implementation Checklist

### Sprint 12: Foundation
- [ ] Task model signal tracking fields
- [ ] Kudos model and routes
- [ ] EventCollector service
- [ ] iBrain: BehavioralEvent model
- [ ] iBrain: ScoreConfig model

### Sprint 13: Calculators
- [ ] iBrain: WorkPattern model
- [ ] iBrain: EngagementScoreCalculator
- [ ] iBrain: PassionScoreCalculator
- [ ] iBrain: QualityScoreCalculator
- [ ] Passion profile UI

### Sprint 14: Aggregates & Privacy
- [ ] iBrain: HumanElementScoreCalculator
- [ ] iBrain: Team Pulse endpoint
- [ ] Privacy enforcement
- [ ] Anti-gaming detection
- [ ] Pulse check UI

### Sprint 15: Display
- [ ] Personal dashboard widget
- [ ] Team pulse widget
- [ ] Kudos feed UI
- [ ] Integration testing

---

## Code Metrics

| Component | Location | Lines | Notes |
|-----------|----------|-------|-------|
| Task signal_tracking | Karvia Model | ~45 | Model extension |
| Kudos model | Karvia Model | ~70 | New collection |
| kudosCategories config | Karvia Config | ~95 | No hardcoding |
| EventCollector | Karvia Service | ~200 | Event batching |
| Kudos routes | Karvia Routes | ~180 | CRUD endpoints |
| iBrainClient extension | Karvia Service | ~85 | New methods |
| **Karvia Total** | | **~675 lines** | |
| BehavioralEvent model | iBrain | ~70 | Event storage |
| WorkPattern model | iBrain | ~90 | Pattern detection |
| ScoreConfig model | iBrain | ~120 | Configurable weights |
| EngagementScoreCalculator | iBrain | ~200 | Core calculator |
| PassionScoreCalculator | iBrain | ~180 | IKIGAI calculator |
| QualityScoreCalculator | iBrain | ~120 | Quality calculator |
| HumanElementScoreCalculator | iBrain | ~200 | Aggregate calculator |
| Privacy & Anti-Gaming | iBrain | ~100 | Rules enforcement |
| API Routes | iBrain | ~150 | Endpoints |
| **iBrain Total** | | **~1,230 lines** | |
| **GRAND TOTAL** | | **~1,905 lines** | |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Event collection latency | <100ms | Time to buffer |
| Score calculation time | <1s | Per member |
| Aggregate calculation | <5s | Per company |
| Kudos adoption | >50% | Members giving kudos weekly |
| Pulse response rate | >60% | Weekly responses |
| Privacy compliance | 100% | No individual data leaks |

---

## Configuration Examples

### Global Default Config
```javascript
{
  config_type: 'global',
  config_key: 'global',
  engagement_weights: {
    participation: 0.20,
    execution_quality: 0.25,
    collaboration: 0.25,
    responsiveness: 0.15,
    recognition: 0.15
  },
  privacy: {
    min_responses_for_aggregate: 4,
    individual_scores_visible_to: 'self_only'
  }
}
```

### Industry Override (Cattle & Livestock)
```javascript
{
  config_type: 'industry',
  config_key: 'cattle_livestock',
  human_element_weights: {
    engagement: 0.30,  // Lower - field workers less digital
    passion: 0.30,
    quality: 0.40     // Higher - quality critical
  },
  thresholds: {
    burnout_warning: {
      pulse_workload_above: 4.5  // Higher tolerance
    }
  }
}
```

---

## Related Documents

- [EPIC-1-TRUST-SCORE-FOUNDATION.md](./EPIC-1-TRUST-SCORE-FOUNDATION.md) - Karvia integration
- [EPIC-2-TRUST-SCORE-CALCULATION.md](./EPIC-2-TRUST-SCORE-CALCULATION.md) - iBrain scoring
- [TRUST-SCORE-AUDIT-REPORT.md](./TRUST-SCORE-AUDIT-REPORT.md) - Architecture validation

---

**EPIC Owner**: Karvia Team (Collection) + iBrain Team (Calculation)
**Sprint Target**: Sprints 12-15
**Story Points**: 89
