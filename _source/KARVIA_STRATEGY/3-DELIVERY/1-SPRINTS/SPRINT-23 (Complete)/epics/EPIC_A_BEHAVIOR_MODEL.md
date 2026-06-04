# Epic A: Behavior Model

<!-- @GENOME T3-SPR-022-EA | ACTIVE | 2026-04-21 | parent:T3-SPR-022-MP | auto:/coding | linked:/strategy -->

**Sprint**: 22 - Beta_Final
**Epic**: A - Behavior Model
**Points**: 5
**Priority**: P0 (Foundation)
**Dependencies**: None (first epic)

---

## Overview

Implement the 9 Disciplines behavior model as a foundational LEGO piece. This model enables behavior-driven objective creation and proves the BBB thesis: "Change behavior, change outcomes."

---

## Business Context

The 9 Disciplines are core to YSELA's behavior-based approach:

### 4 Foundations → 9 Disciplines

| Foundation | Disciplines |
|------------|-------------|
| **Discipline** | Truth, Ownership |
| **Growth** | Follow-through, Influence |
| **Accountability** | Execution, Responsiveness |
| **Maturity** | Health Balance, Continuous Learning, Collaboration |

---

## Data Model

### New Model: Behavior

**File**: `server/models/Behavior.js`

```javascript
const BehaviorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'Truth',
      'Ownership',
      'Follow-through',
      'Influence',
      'Execution',
      'Responsiveness',
      'Health Balance',
      'Continuous Learning',
      'Collaboration'
    ]
  },
  foundation: {
    type: String,
    required: true,
    enum: ['Discipline', 'Growth', 'Accountability', 'Maturity']
  },
  description: {
    type: String,
    required: true
  },
  short_description: {
    type: String,
    required: true,
    maxlength: 100
  },
  icon: {
    type: String,  // Icon name or emoji
    default: null
  },
  order: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for queries
BehaviorSchema.index({ foundation: 1, order: 1 });
BehaviorSchema.index({ active: 1 });
```

---

## Seed Data

**File**: `server/seeds/behaviors.js`

```javascript
const behaviors = [
  // Discipline Foundation
  {
    name: 'Truth',
    foundation: 'Discipline',
    description: 'Commitment to honesty and transparency in all business dealings. Facing reality rather than avoiding difficult conversations.',
    short_description: 'Honesty and transparency in all dealings',
    icon: 'shield-check',
    order: 1
  },
  {
    name: 'Ownership',
    foundation: 'Discipline',
    description: 'Taking full responsibility for outcomes, decisions, and their consequences. No blame-shifting or excuse-making.',
    short_description: 'Full responsibility for outcomes',
    icon: 'user-check',
    order: 2
  },

  // Growth Foundation
  {
    name: 'Follow-through',
    foundation: 'Growth',
    description: 'Completing commitments reliably. Doing what you say you will do, when you say you will do it.',
    short_description: 'Completing commitments reliably',
    icon: 'check-circle',
    order: 3
  },
  {
    name: 'Influence',
    foundation: 'Growth',
    description: 'Ability to positively impact others\' decisions and behaviors. Building trust and credibility over time.',
    short_description: 'Positively impacting decisions',
    icon: 'users',
    order: 4
  },

  // Accountability Foundation
  {
    name: 'Execution',
    foundation: 'Accountability',
    description: 'Consistently delivering results. Turning plans into action and action into measurable outcomes.',
    short_description: 'Consistently delivering results',
    icon: 'target',
    order: 5
  },
  {
    name: 'Responsiveness',
    foundation: 'Accountability',
    description: 'Timely and appropriate reactions to requests, changes, and opportunities. Staying agile and adaptive.',
    short_description: 'Timely reactions to changes',
    icon: 'zap',
    order: 6
  },

  // Maturity Foundation
  {
    name: 'Health Balance',
    foundation: 'Maturity',
    description: 'Maintaining sustainable work patterns. Recognizing that long-term success requires physical and mental wellbeing.',
    short_description: 'Sustainable work patterns',
    icon: 'heart',
    order: 7
  },
  {
    name: 'Continuous Learning',
    foundation: 'Maturity',
    description: 'Commitment to ongoing skill development and knowledge acquisition. Embracing feedback and growth opportunities.',
    short_description: 'Ongoing skill development',
    icon: 'book-open',
    order: 8
  },
  {
    name: 'Collaboration',
    foundation: 'Maturity',
    description: 'Working effectively with others toward shared goals. Valuing diverse perspectives and building team synergy.',
    short_description: 'Working effectively with others',
    icon: 'users-2',
    order: 9
  }
];
```

---

## API Endpoints

### GET /api/behaviors

List all active behaviors.

**Route**: `server/routes/behaviors.js`

```javascript
router.get('/',
  authenticateToken,
  async (req, res) => {
    try {
      const behaviors = await Behavior.find({ active: true })
        .sort({ order: 1 })
        .lean();

      res.json({ success: true, data: behaviors });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to load behaviors' });
    }
  }
);
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Truth",
      "foundation": "Discipline",
      "description": "...",
      "short_description": "Honesty and transparency in all dealings",
      "icon": "shield-check",
      "order": 1
    },
    // ... 8 more
  ]
}
```

### GET /api/behaviors/grouped

List behaviors grouped by foundation.

```javascript
router.get('/grouped',
  authenticateToken,
  async (req, res) => {
    try {
      const behaviors = await Behavior.find({ active: true })
        .sort({ order: 1 })
        .lean();

      const grouped = {
        Discipline: behaviors.filter(b => b.foundation === 'Discipline'),
        Growth: behaviors.filter(b => b.foundation === 'Growth'),
        Accountability: behaviors.filter(b => b.foundation === 'Accountability'),
        Maturity: behaviors.filter(b => b.foundation === 'Maturity')
      };

      res.json({ success: true, data: grouped });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to load behaviors' });
    }
  }
);
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `server/models/Behavior.js` | CREATE | Behavior model |
| `server/routes/behaviors.js` | CREATE | Behavior endpoints |
| `server/seeds/behaviors.js` | CREATE | Seed data for 9 disciplines |
| `server/index.js` | MODIFY | Register behaviors routes |
| `package.json` | MODIFY | Add seed:behaviors script |

---

## Seed Script

**File**: `scripts/seed-behaviors.js`

```javascript
const mongoose = require('mongoose');
const Behavior = require('../server/models/Behavior');
const behaviors = require('../server/seeds/behaviors');

async function seedBehaviors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing
    await Behavior.deleteMany({});

    // Insert fresh
    await Behavior.insertMany(behaviors);

    console.log('✓ Seeded 9 behaviors');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedBehaviors();
```

**package.json**:
```json
{
  "scripts": {
    "seed:behaviors": "node scripts/seed-behaviors.js"
  }
}
```

---

## Usage in Objective (Epic E Preview)

When creating objectives, users select 1-3 behaviors:

```javascript
// Objective model extension
const ObjectiveSchema = new mongoose.Schema({
  // ... existing fields

  behavior_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Behavior'
  }],

  // ...
});
```

---

## Testing

### Unit Tests

```javascript
describe('Behavior Model', () => {
  it('should have exactly 9 behaviors', async () => {
    const count = await Behavior.countDocuments({ active: true });
    expect(count).toBe(9);
  });

  it('should have 4 foundations', async () => {
    const foundations = await Behavior.distinct('foundation');
    expect(foundations).toHaveLength(4);
  });

  it('should return behaviors in order', async () => {
    const behaviors = await Behavior.find({ active: true }).sort({ order: 1 });
    expect(behaviors[0].name).toBe('Truth');
    expect(behaviors[8].name).toBe('Collaboration');
  });
});
```

---

## Acceptance Criteria

- [ ] Behavior model created with all fields
- [ ] Seed script populates 9 disciplines
- [ ] GET /api/behaviors returns all behaviors
- [ ] GET /api/behaviors/grouped returns by foundation
- [ ] Behaviors sorted by order field
- [ ] Unit tests pass

---

## Story Points Breakdown

| Task | Points |
|------|--------|
| Model creation | 1 |
| Seed data + script | 1 |
| API endpoints | 1 |
| Route registration | 0.5 |
| Testing | 1.5 |
| **Total** | **5** |

---

**Created**: April 21, 2026 (Session #171)
**Status**: Ready for implementation
