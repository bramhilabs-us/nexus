# 🚀 KARVIA OKR - BETA RELEASE STRATEGY (FINAL)

**Version**: 2.0 (Final - Addressing Architecture Reviews)
**Date**: October 1, 2025
**Target Release**: Q1 2026 (Post-MVP)
**Prerequisite**: MVP launched Nov 30, 2025

---

## 📋 EXECUTIVE SUMMARY

This document defines the **Beta Release roadmap** addressing all architectural concerns raised in technical reviews. Key changes from v1.0:

1. **iBrain Integration Boundary** clearly defined
2. **Shared data contracts** across all engines
3. **Event-driven architecture** instead of database sharing
4. **Optional modules** approach for collaboration features
5. **Engine SDK layer** for decoupled integrations

**Beta Vision**: Transform Karvia from MVP core into an **enterprise-grade, iBrain-integrated platform** with advanced AI, analytics, and collaboration.

---

## 🚨 ARCHITECTURAL PRINCIPLES (FROM REVIEWS)

### **1. Engine Decoupling Strategy**

**Problem (From Review)**: Engines currently share databases and import models directly, preventing independent deployment.

**Solution**: Event-driven architecture with published contracts.

```
┌─────────────────────────────────────────────────────────────┐
│                      KARVIA MAIN API                         │
│  - User-facing REST endpoints                               │
│  - Authentication gateway                                    │
│  - Minimal business logic                                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
         Event Bus (NATS / Webhook Dispatcher)
                  │
    ┌─────────────┼─────────────┬─────────────┬──────────────┐
    │             │             │             │              │
┌───▼────┐  ┌────▼────┐  ┌─────▼────┐  ┌────▼─────┐  ┌─────▼────┐
│  IAM   │  │Assessmt │  │ Planner  │  │ Scoring  │  │ Tracking │
│ Engine │  │ Engine  │  │  Engine  │  │  Engine  │  │  Engine  │
└────────┘  └─────────┘  └──────────┘  └──────────┘  └──────────┘
     │           │             │             │             │
     └───────────┴─────────────┴─────────────┴─────────────┘
                          │
                 Shared Event Schema
              (docs/contracts/events.json)
```

**Key Architectural Decisions**:

1. **No Shared Database Access**: Each engine has its own database (or schema)
2. **Event-Driven Communication**: Engines emit events, others subscribe
3. **API-First Integration**: Engines expose REST/GraphQL, others call APIs
4. **Versioned Contracts**: All data structures published as JSON schemas

---

### **2. Shared Contracts Repository**

**Location**: `docs/contracts/` (versioned, published to npm)

```
docs/contracts/
├── schemas/
│   ├── business.v1.json
│   ├── objective.v1.json
│   ├── goal.v1.json
│   ├── task.v1.json
│   ├── assessment.v1.json
│   └── user.v1.json
├── events/
│   ├── objective.created.v1.json
│   ├── goal.completed.v1.json
│   ├── task.assigned.v1.json
│   ├── assessment.completed.v1.json
│   └── sentiment.recorded.v1.json
└── apis/
    ├── planner-api.openapi.yaml
    ├── tracking-api.openapi.yaml
    └── scoring-api.openapi.yaml
```

**Publishing**:
```bash
# Publish contracts as npm package
cd docs/contracts
npm version patch
npm publish @karvia/contracts
```

**Engine Usage**:
```javascript
// engines/scoring/package.json
{
  "dependencies": {
    "@karvia/contracts": "^1.0.0"
  }
}

// engines/scoring/index.js
const { validateEvent } = require('@karvia/contracts/validators');

// Validate incoming events
function handleObjectiveCreated(event) {
  const valid = validateEvent('objective.created.v1', event);
  if (!valid) throw new Error('Invalid event schema');

  // Process event
}
```

---

### **3. Engine SDK Layer**

**Problem (From Review)**: Engines directly import server models, preventing independent deployment to iBrain.

**Solution**: Create `@karvia/engine-sdk` for common functionality.

```javascript
// @karvia/engine-sdk (new package)

// HTTP Client (for inter-engine calls)
class EngineClient {
  constructor(engineName, baseUrl) {
    this.engineName = engineName;
    this.baseUrl = baseUrl || process.env[`${engineName.toUpperCase()}_URL`];
  }

  async get(path) {
    const response = await fetch(`${this.baseUrl}${path}`);
    return response.json();
  }

  async post(path, data) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// Event Bus Client
class EventBus {
  constructor(natsUrl) {
    this.natsUrl = natsUrl || process.env.NATS_URL;
    this.nc = connect(this.natsUrl);
  }

  async publish(eventType, data) {
    const event = {
      id: uuid(),
      type: eventType,
      timestamp: new Date().toISOString(),
      data
    };

    await this.nc.publish(eventType, JSON.stringify(event));
  }

  async subscribe(eventType, handler) {
    const sub = this.nc.subscribe(eventType);
    for await (const msg of sub) {
      const event = JSON.parse(msg.data);
      await handler(event);
    }
  }
}

// Cache Client (Redis)
class CacheClient {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get(key) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key, value, ttlSeconds) {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }
}

// Logger
class Logger {
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  info(message, meta = {}) {
    console.log(JSON.stringify({
      level: 'info',
      service: this.serviceName,
      message,
      ...meta,
      timestamp: new Date().toISOString()
    }));
  }

  error(message, error, meta = {}) {
    console.error(JSON.stringify({
      level: 'error',
      service: this.serviceName,
      message,
      error: error.message,
      stack: error.stack,
      ...meta,
      timestamp: new Date().toISOString()
    }));
  }
}

module.exports = {
  EngineClient,
  EventBus,
  CacheClient,
  Logger
};
```

**Engine Usage Example** (Scoring Engine calls Planner Engine):
```javascript
// engines/scoring/index.js
const { EngineClient, EventBus, Logger } = require('@karvia/engine-sdk');

const plannerClient = new EngineClient('planner', process.env.PLANNER_ENGINE_URL);
const eventBus = new EventBus();
const logger = new Logger('scoring-engine');

// Subscribe to objective created events
eventBus.subscribe('objective.created', async (event) => {
  logger.info('Received objective created event', { objectiveId: event.data.id });

  // Fetch objective details from Planner Engine (via API)
  const objective = await plannerClient.get(`/objectives/${event.data.id}`);

  // Calculate initial score
  const score = calculateObjectiveScore(objective);

  // Store in scoring database
  await ScoreRecord.create({
    objective_id: event.data.id,
    score,
    calculated_at: new Date()
  });

  // Emit score calculated event
  await eventBus.publish('objective.scored', {
    objective_id: event.data.id,
    score
  });
});
```

---

## 📊 BETA PHASES (REVISED)

### **Phase 0: Architecture Foundation (4 weeks) - PREREQUISITE**

**Must complete before feature work begins.**

#### **0.1 Event Bus Infrastructure**
- [ ] Evaluate event bus options (NATS, Kafka, or simple webhook dispatcher)
- [ ] Choose: **NATS** (lightweight, Go-based, perfect for microservices)
- [ ] Deploy NATS server (Docker Compose + K8s)
- [ ] Create `@karvia/engine-sdk` package with EventBus client

```yaml
# docker-compose.yml (add NATS)
services:
  nats:
    image: nats:latest
    ports:
      - "4222:4222"  # Client connections
      - "8222:8222"  # HTTP monitoring
    command: "--http_port 8222 --jetstream"
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:8222/healthz"]
      interval: 10s
```

#### **0.2 Shared Contracts Publication**
- [ ] Create `docs/contracts/` with JSON schemas
- [ ] Define core events (objective.created, goal.completed, etc.)
- [ ] Define API contracts (OpenAPI specs)
- [ ] Publish as `@karvia/contracts` npm package
- [ ] Version contracts with semver

#### **0.3 Engine SDK Development**
- [ ] Create `@karvia/engine-sdk` package
- [ ] Implement EngineClient (HTTP calls)
- [ ] Implement EventBus client (NATS wrapper)
- [ ] Implement CacheClient (Redis wrapper)
- [ ] Implement Logger (structured JSON logging)
- [ ] Write SDK documentation

#### **0.4 Refactor Existing Engines**
- [ ] Update Scoring Engine: Remove direct DB access to objectives
- [ ] Scoring subscribes to `objective.created` events
- [ ] Scoring calls Planner API for objective details
- [ ] Update Tracking Engine: Emit events instead of direct writes
- [ ] Test inter-engine communication via events

**Acceptance Criteria**:
- ✅ NATS running and healthy
- ✅ All engines use `@karvia/engine-sdk`
- ✅ No engine imports another engine's models
- ✅ Events flow: Planner → NATS → Scoring
- ✅ Scoring can fetch data via Planner API
- ✅ Contracts validated on every event publish

**Output**: Decoupled, event-driven engine architecture

---

### **Phase 1: Enhanced Assessment System (4 weeks)**

#### **1.1 Assessment Template Storage Strategy**

**Problem (From Review)**: No repository for assessment templates exists. Hardcoded in engine.

**Solution**: Template storage in MongoDB + CDN for JSON files.

```javascript
// shared-models/models/AssessmentTemplate.js
const templateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., "balanced_scorecard"
  name: { type: String, required: true },
  description: { type: String },
  version: { type: String, default: '1.0' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  visibility: { type: String, enum: ['system', 'company', 'marketplace'], default: 'system' },

  // If system template: visible to all
  // If company template: business_id required
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  categories: [
    {
      id: String,
      name: String,
      description: String,
      weight: Number, // Percentage (e.g., 25 for 25%)
      questions: [
        {
          id: String,
          text: String,
          question_type: { type: String, enum: ['scale_1_5', 'yes_no', 'text', 'slider'] },
          weight: Number, // Within category
          options: [String], // For multiple choice
          scoring_map: Object // { '1': 20, '2': 40, ... }
        }
      ]
    }
  ],

  calculation_method: { type: String, enum: ['weighted_average', 'custom_formula'], default: 'weighted_average' },
  custom_formula: String, // If calculation_method = custom_formula

  usage_count: { type: Number, default: 0 },
  average_rating: { type: Number, min: 0, max: 5 },

  // Marketplace (if visibility = marketplace)
  marketplace_listing: {
    is_listed: Boolean,
    price: Number, // USD, 0 = free
    listing_date: Date,
    total_installs: Number,
    reviews: [
      {
        user_id: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        date: Date
      }
    ]
  },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssessmentTemplate', templateSchema);
```

**Seed 6 System Templates** (Beta launch):
```javascript
// scripts/seed-assessment-templates.js
const templates = [
  {
    id: 'speed_strength_intelligence',
    name: 'Speed/Strength/Intelligence Framework',
    status: 'published',
    visibility: 'system',
    categories: [ /* MVP template */ ]
  },
  {
    id: 'balanced_scorecard',
    name: 'Balanced Scorecard Assessment',
    status: 'published',
    visibility: 'system',
    categories: [
      { id: 'financial', name: 'Financial Perspective', weight: 25, questions: [...] },
      { id: 'customer', name: 'Customer Perspective', weight: 25, questions: [...] },
      { id: 'internal', name: 'Internal Processes', weight: 25, questions: [...] },
      { id: 'learning', name: 'Learning & Growth', weight: 25, questions: [...] }
    ]
  },
  {
    id: 'mckinsey_7s',
    name: 'McKinsey 7S Assessment',
    status: 'published',
    visibility: 'system',
    categories: [ /* 7 categories */ ]
  },
  {
    id: 'startup_health',
    name: 'Startup Health Check',
    status: 'published',
    visibility: 'system',
    categories: [ /* Startup-specific */ ]
  },
  {
    id: 'service_maturity',
    name: 'Service Business Maturity',
    status: 'published',
    visibility: 'system',
    categories: [ /* Consulting/agency specific */ ]
  },
  {
    id: 'ecommerce_readiness',
    name: 'E-commerce Readiness',
    status: 'published',
    visibility: 'system',
    categories: [ /* E-commerce specific */ ]
  }
];

// Seed to database
await AssessmentTemplate.insertMany(templates);
```

**Assessment Engine Updates**:
```javascript
// engines/assessment/index.js

// List available templates
router.get('/templates', async (req, res) => {
  const { business_id } = req.user;

  // System templates + company custom templates
  const templates = await AssessmentTemplate.find({
    $or: [
      { visibility: 'system', status: 'published' },
      { business_id, status: 'published' }
    ]
  }).select('id name description categories');

  res.json({ success: true, data: templates });
});

// Start assessment with template
router.post('/start', async (req, res) => {
  const { template_id } = req.body;

  const template = await AssessmentTemplate.findOne({ id: template_id });
  if (!template) return res.status(404).json({ message: 'Template not found' });

  // Create assessment instance
  const assessment = await Assessment.create({
    business_id: req.user.business_id,
    template_id,
    status: 'in_progress',
    responses: []
  });

  res.json({ success: true, data: { assessment, questions: template.categories } });
});
```

#### **1.2 Custom Template Builder UI**

**Implementation**:
- [ ] Admin screen: Create template
- [ ] Category builder (drag-and-drop)
- [ ] Question builder (add/edit/reorder questions)
- [ ] Formula builder (for custom calculation)
- [ ] Template preview (test assessment flow)
- [ ] Publish template (make available to company)

**Key Features**:
- Visual builder (no code required)
- Template versioning (v1.0, v1.1, etc.)
- Duplicate template (start from existing)
- Import/export templates (JSON)

#### **1.3 Custom Formula Engine**

**Security-First Approach**:
```javascript
// engines/assessment/services/formula-engine.js
const { VM } = require('vm2'); // Sandboxed JavaScript execution
const mathjs = require('mathjs');

class FormulaEngine {
  validateFormula(formula, categories) {
    // 1. Parse formula with mathjs
    try {
      const node = mathjs.parse(formula);

      // 2. Extract variables
      const variables = this.extractVariables(node);

      // 3. Validate all variables are category names
      const categoryNames = categories.map(c => c.id);
      const invalidVars = variables.filter(v => !categoryNames.includes(v));

      if (invalidVars.length > 0) {
        return { valid: false, error: `Unknown variables: ${invalidVars.join(', ')}` };
      }

      // 4. Test with sample values
      const testScores = {};
      categories.forEach(c => testScores[c.id] = 75); // Sample score

      const result = this.evaluateFormula(formula, testScores);

      if (isNaN(result) || result < 0 || result > 100) {
        return { valid: false, error: 'Formula must return value between 0-100' };
      }

      return { valid: true, testResult: result };

    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  evaluateFormula(formula, categoryScores) {
    // Use mathjs safe evaluation (no eval())
    const scope = { ...categoryScores, min: Math.min, max: Math.max, avg: (arr) => arr.reduce((a,b) => a+b) / arr.length };

    const result = mathjs.evaluate(formula, scope);

    return Math.max(0, Math.min(100, result)); // Clamp to 0-100
  }

  extractVariables(node) {
    const variables = new Set();

    node.traverse((node) => {
      if (node.type === 'SymbolNode') {
        variables.add(node.name);
      }
    });

    // Remove math functions
    const mathFunctions = ['min', 'max', 'avg', 'sqrt', 'abs'];
    mathFunctions.forEach(fn => variables.delete(fn));

    return Array.from(variables);
  }
}

module.exports = new FormulaEngine();
```

**Formula Examples**:
```javascript
// Weighted average (default)
"speed * 0.4 + strength * 0.3 + intelligence * 0.3"

// Minimum threshold required
"min(speed, strength, intelligence) >= 60 ? (speed + strength + intelligence) / 3 : 0"

// Exponential emphasis
"sqrt(speed * strength * intelligence) / 10"

// Conditional weighting
"intelligence > 80 ? (intelligence * 0.5 + speed * 0.3 + strength * 0.2) : (speed + strength + intelligence) / 3"
```

#### **1.4 Template Marketplace**

**Features**:
- Browse templates (filter by industry, framework)
- Preview template (see categories, sample questions)
- Install template (free or paid via Stripe)
- Rate and review templates
- Consultant can publish templates (70/30 revenue share)

**Payment Integration**:
```javascript
// engines/assessment/services/marketplace-service.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class MarketplaceService {
  async purchaseTemplate(templateId, buyerUserId, buyerBusinessId) {
    const template = await AssessmentTemplate.findOne({ id: templateId });

    if (template.marketplace_listing.price === 0) {
      // Free template - just install
      return this.installTemplate(templateId, buyerBusinessId);
    }

    // Paid template - create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: template.name,
              description: template.description
            },
            unit_amount: template.marketplace_listing.price * 100 // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/marketplace/success?template=${templateId}`,
      cancel_url: `${process.env.APP_URL}/marketplace`,
      metadata: {
        template_id: templateId,
        buyer_user_id: buyerUserId,
        buyer_business_id: buyerBusinessId
      }
    });

    return { checkout_url: session.url };
  }

  async handlePaymentSuccess(session) {
    // Called via Stripe webhook
    const { template_id, buyer_business_id } = session.metadata;

    // Install template
    await this.installTemplate(template_id, buyer_business_id);

    // Record purchase
    await TemplatePurchase.create({
      template_id,
      buyer_business_id,
      price_paid: session.amount_total / 100,
      stripe_payment_id: session.payment_intent
    });

    // Update template stats
    await AssessmentTemplate.findOneAndUpdate(
      { id: template_id },
      { $inc: { 'marketplace_listing.total_installs': 1, usage_count: 1 } }
    );

    // Calculate revenue share (70% to author, 30% to Karvia)
    const template = await AssessmentTemplate.findOne({ id: template_id });
    const authorShare = (session.amount_total / 100) * 0.7;

    // TODO: Transfer to author's Stripe Connect account
  }

  async installTemplate(templateId, businessId) {
    // Make template available to company
    const template = await AssessmentTemplate.findOne({ id: templateId });

    // Create company-specific copy (optional, or just reference)
    const installedTemplate = await InstalledTemplate.create({
      business_id: businessId,
      template_id: templateId,
      installed_at: new Date()
    });

    return installedTemplate;
  }
}
```

**Acceptance Criteria (Phase 1)**:
- ✅ 6 system templates available
- ✅ Admin can create custom template
- ✅ Custom formulas validated and sandboxed
- ✅ Marketplace lists published templates
- ✅ Paid templates purchasable via Stripe
- ✅ Revenue share tracked (70/30 split)

---

### **Phase 2: Advanced Analytics & Insights (4 weeks)**

#### **2.1 Sentiment & Reflection System**

**Data Model**:
```javascript
// shared-models/models/DailySentiment.js
const sentimentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  date: { type: Date, required: true },

  // User input
  emoji_rating: { type: Number, min: 1, max: 5, required: true }, // 1=😞, 5=😊
  key_wins: [String], // What went well
  challenges: [String], // What was difficult
  support_needed: { type: Boolean, default: false },
  support_details: String,

  // Calculated
  sentiment_score: { type: Number, min: 0, max: 100 }, // Computed by sentiment engine
  sentiment_category: { type: String, enum: ['very_low', 'low', 'neutral', 'good', 'excellent'] },

  // Context
  tasks_completed_today: { type: Number, default: 0 },
  tasks_pending: { type: Number, default: 0 },
  objectives_on_track: { type: Number, default: 0 },

  created_at: { type: Date, default: Date.now }
});

sentimentSchema.index({ user_id: 1, date: -1 });
sentimentSchema.index({ business_id: 1, date: -1 });
```

**Sentiment Calculation** (New iBrain-facing service):
```javascript
// Option A: Inside Scoring Engine
// Option B: Separate Sentiment Engine (iBrain manages)

// engines/scoring/services/sentiment-service.js
class SentimentService {
  calculateSentiment(reflection) {
    let score = reflection.emoji_rating * 20; // Base: 20, 40, 60, 80, 100

    // Analyze text (simple keyword approach for Beta, can use OpenAI later)
    const positiveWords = ['great', 'achieved', 'success', 'completed', 'happy', 'progress', 'productive'];
    const negativeWords = ['stuck', 'blocked', 'frustrated', 'delayed', 'difficult', 'overwhelmed', 'stressed'];

    const winsText = reflection.key_wins.join(' ').toLowerCase();
    const challengesText = reflection.challenges.join(' ').toLowerCase();

    const positiveCount = positiveWords.filter(w => winsText.includes(w)).length;
    const negativeCount = negativeWords.filter(w => challengesText.includes(w)).length;

    score += (positiveCount * 3) - (negativeCount * 5);

    // Task completion impact
    const completionRate = reflection.tasks_completed_today / (reflection.tasks_completed_today + reflection.tasks_pending + 0.1);
    score += completionRate * 15;

    // Support needed reduces score
    if (reflection.support_needed) score -= 10;

    // Clamp to 0-100
    score = Math.max(0, Math.min(100, score));

    // Categorize
    let category;
    if (score >= 80) category = 'excellent';
    else if (score >= 60) category = 'good';
    else if (score >= 40) category = 'neutral';
    else if (score >= 20) category = 'low';
    else category = 'very_low';

    return { score, category };
  }

  aggregateTeamSentiment(teamMemberSentiments) {
    if (teamMemberSentiments.length === 0) return null;

    const scores = teamMemberSentiments.map(s => s.sentiment_score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    const lowSentiment = teamMemberSentiments.filter(s => s.sentiment_score < 50);

    return {
      team_average: Math.round(average),
      low_sentiment_count: lowSentiment.length,
      members_needing_support: lowSentiment.map(s => ({ user_id: s.user_id, score: s.sentiment_score })),
      category: this.categorize(average)
    };
  }

  categorize(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'neutral';
    if (score >= 20) return 'low';
    return 'very_low';
  }
}
```

**API Endpoints**:
```javascript
// POST /api/reflections - Submit daily reflection
router.post('/reflections', authenticate, async (req, res) => {
  const { emoji_rating, key_wins, challenges, support_needed, support_details } = req.body;

  // Get today's task stats
  const tasksCompleted = await Task.countDocuments({
    assigned_to: req.user.id,
    status: 'completed',
    completed_at: { $gte: startOfDay(new Date()) }
  });

  const tasksPending = await Task.countDocuments({
    assigned_to: req.user.id,
    status: { $in: ['todo', 'in_progress'] }
  });

  // Calculate sentiment
  const { score, category } = sentimentService.calculateSentiment({
    emoji_rating,
    key_wins,
    challenges,
    support_needed,
    tasks_completed_today: tasksCompleted,
    tasks_pending: tasksPending
  });

  // Save reflection
  const sentiment = await DailySentiment.create({
    user_id: req.user.id,
    business_id: req.user.business_id,
    date: new Date(),
    emoji_rating,
    key_wins,
    challenges,
    support_needed,
    support_details,
    sentiment_score: score,
    sentiment_category: category,
    tasks_completed_today: tasksCompleted,
    tasks_pending: tasksPending
  });

  // Emit event (for analytics, alerts)
  await eventBus.publish('sentiment.recorded', {
    user_id: req.user.id,
    business_id: req.user.business_id,
    score,
    category,
    support_needed
  });

  res.status(201).json({ success: true, data: sentiment });
});

// GET /api/reflections/team-sentiment (managers only)
router.get('/reflections/team-sentiment', authenticate, authorize(['manager', 'company_admin']), async (req, res) => {
  const { date } = req.query;
  const targetDate = date ? new Date(date) : new Date();

  // Get team member IDs
  const teamMembers = await User.find({
    business_id: req.user.business_id,
    manager_id: req.user.id
  }).select('id');

  const memberIds = teamMembers.map(m => m.id);

  // Get today's sentiments
  const sentiments = await DailySentiment.find({
    user_id: { $in: memberIds },
    date: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) }
  }).populate('user_id', 'name email');

  // Aggregate
  const teamSummary = sentimentService.aggregateTeamSentiment(sentiments);

  res.json({ success: true, data: { sentiments, summary: teamSummary } });
});
```

**Frontend: Reflection Modal**:
```javascript
// Modal appears after 3+ tasks completed OR at 5pm

<ReflectionModal open={showReflection}>
  <h2>How was your day today?</h2>

  <EmojiPicker value={emojiRating} onChange={setEmojiRating}>
    <Emoji>😞</Emoji> {/* 1 - Very bad */}
    <Emoji>😟</Emoji> {/* 2 - Not great */}
    <Emoji>😐</Emoji> {/* 3 - Okay */}
    <Emoji>🙂</Emoji> {/* 4 - Good */}
    <Emoji>😊</Emoji> {/* 5 - Excellent */}
  </EmojiPicker>

  <TextField
    label="What went well today?"
    multiline
    value={keyWins}
    onChange={setKeyWins}
  />

  <TextField
    label="What challenges did you face?"
    multiline
    value={challenges}
    onChange={setChallenges}
  />

  <Checkbox
    label="I need support from my manager"
    checked={supportNeeded}
    onChange={setSupportNeeded}
  />

  {supportNeeded && (
    <TextField
      label="What do you need help with?"
      multiline
      value={supportDetails}
      onChange={setSupportDetails}
    />
  )}

  <Button onClick={submitReflection}>Submit</Button>
</ReflectionModal>
```

**Dashboard: Sentiment Circles**:
```javascript
// Employee Dashboard
<SentimentSection>
  <SentimentCircle
    score={mySentiment.score}
    category={mySentiment.category}
    label="My Sentiment"
  />
</SentimentSection>

// Manager Dashboard
<SentimentSection>
  <SentimentCircle
    score={teamSentiment.team_average}
    category={teamSentiment.category}
    label="Team Sentiment"
  />

  {teamSentiment.members_needing_support.length > 0 && (
    <Alert severity="warning">
      {teamSentiment.members_needing_support.length} team members need support
      <Button>Check In</Button>
    </Alert>
  )}
</SentimentSection>
```

#### **2.2 Predictive Analytics**

**Note**: This is iBrain-facing functionality. Either:
- **Option A**: Build inside Scoring Engine (simple rules)
- **Option B**: Separate AI service managed by iBrain (ML models)

**For Beta, start with Option A (rule-based)**:

```javascript
// engines/scoring/services/prediction-service.js
class PredictionService {
  async predictObjectiveRisk(objectiveId) {
    const objective = await Objective.findById(objectiveId);

    // Factors
    const daysUntilDeadline = differenceInDays(objective.due_date, new Date());
    const progressRate = objective.progress_percentage / daysSinceCreated(objective);
    const projectedCompletion = progressRate * (daysUntilDeadline + daysSinceCreated(objective));

    // Risk score
    let riskScore = 0;

    if (projectedCompletion < 80) riskScore += 30; // Unlikely to hit target
    if (progressRate < 2) riskScore += 20; // Slow progress
    if (daysUntilDeadline < 14) riskScore += 20; // Less than 2 weeks left
    if (objective.key_results.filter(kr => kr.status === 'blocked').length > 0) riskScore += 30; // Blocked KRs

    // Clamp
    riskScore = Math.min(100, riskScore);

    // Categorize
    let category;
    if (riskScore >= 70) category = 'high_risk';
    else if (riskScore >= 40) category = 'medium_risk';
    else category = 'low_risk';

    return {
      objective_id: objectiveId,
      risk_score: riskScore,
      category,
      projected_completion: projectedCompletion,
      days_until_deadline: daysUntilDeadline,
      factors: [
        { name: 'Progress Rate', impact: progressRate < 2 ? 'negative' : 'positive' },
        { name: 'Time Remaining', impact: daysUntilDeadline < 14 ? 'negative' : 'neutral' }
      ],
      recommended_actions: this.getRecommendedActions(riskScore, objective)
    };
  }

  getRecommendedActions(riskScore, objective) {
    const actions = [];

    if (riskScore >= 70) {
      actions.push('Escalate to manager immediately');
      actions.push('Review blockers and resolve urgently');
      actions.push('Consider reducing scope or extending deadline');
    } else if (riskScore >= 40) {
      actions.push('Increase team focus on this objective');
      actions.push('Schedule check-in with stakeholders');
    }

    return actions;
  }

  async predictTeamBurnout(teamId) {
    // Get team members
    const members = await User.find({ team_id: teamId });

    // For each member, analyze:
    // - Sentiment trend (declining?)
    // - Task volume (overloaded?)
    // - Work hours (if tracked)

    const burnoutRisks = [];

    for (const member of members) {
      const recentSentiments = await DailySentiment.find({
        user_id: member.id,
        date: { $gte: subDays(new Date(), 7) }
      }).sort({ date: -1 });

      if (recentSentiments.length < 3) continue; // Not enough data

      // Trend
      const avgLast3Days = avg(recentSentiments.slice(0, 3).map(s => s.sentiment_score));
      const avgPrevious3Days = avg(recentSentiments.slice(3, 6).map(s => s.sentiment_score));

      const trendDelta = avgLast3Days - avgPrevious3Days;

      // Task load
      const openTasks = await Task.countDocuments({
        assigned_to: member.id,
        status: { $in: ['todo', 'in_progress'] }
      });

      // Burnout score
      let burnoutScore = 0;

      if (trendDelta < -10) burnoutScore += 30; // Sentiment declining
      if (avgLast3Days < 50) burnoutScore += 20; // Low sentiment
      if (openTasks > 15) burnoutScore += 25; // Overloaded
      if (recentSentiments.filter(s => s.support_needed).length > 2) burnoutScore += 25; // Frequently needs support

      if (burnoutScore >= 50) {
        burnoutRisks.push({
          user_id: member.id,
          user_name: member.name,
          burnout_score: burnoutScore,
          factors: [
            trendDelta < -10 ? 'Sentiment declining' : null,
            avgLast3Days < 50 ? 'Low overall sentiment' : null,
            openTasks > 15 ? 'High task volume' : null
          ].filter(Boolean)
        });
      }
    }

    return burnoutRisks;
  }
}
```

**Acceptance Criteria (Phase 2)**:
- ✅ Sentiment reflection modal functional
- ✅ Sentiment score calculated from reflection + task data
- ✅ Individual and team sentiment displayed on dashboards
- ✅ Manager alerted when team member sentiment low
- ✅ At-risk objectives predicted (rule-based)
- ✅ Burnout prediction flags overloaded team members

---

### **Phase 3: Collaboration & Integrations (4 weeks)**

#### **3.1 Task Comments (WebSocket Required)**

**Infrastructure**:
- Add Socket.IO server
- Clients connect via WebSocket
- Real-time updates for comments, status changes

```yaml
# docker-compose.yml
services:
  server:
    environment:
      WEBSOCKET_ENABLED: "true"
```

```javascript
// server/websocket/index.js
const socketIO = require('socket.io');

function initWebSocket(httpServer) {
  const io = socketIO(httpServer, {
    cors: { origin: process.env.APP_URL }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const user = await verifyToken(token);
    if (!user) return next(new Error('Authentication error'));
    socket.user = user;
    next();
  });

  // Join room per task
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.id} connected`);

    socket.on('join_task', (taskId) => {
      socket.join(`task:${taskId}`);
    });

    socket.on('leave_task', (taskId) => {
      socket.leave(`task:${taskId}`);
    });
  });

  return io;
}

// Emit events
function emitTaskComment(io, taskId, comment) {
  io.to(`task:${taskId}`).emit('task_comment', comment);
}

module.exports = { initWebSocket, emitTaskComment };
```

**Data Model**:
```javascript
// shared-models/models/TaskComment.js
const commentSchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment_text: { type: String, required: true, maxlength: 2000 },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // @mentions
  attachments: [
    {
      filename: String,
      url: String,
      size: Number,
      mime_type: String
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date }
});

commentSchema.index({ task_id: 1, created_at: -1 });
```

**API**:
```javascript
// POST /api/tasks/:id/comments
router.post('/tasks/:id/comments', authenticate, async (req, res) => {
  const { comment_text, mentions } = req.body;

  const comment = await TaskComment.create({
    task_id: req.params.id,
    user_id: req.user.id,
    comment_text,
    mentions
  });

  await comment.populate('user_id', 'name avatar_url');

  // Emit WebSocket event
  io.to(`task:${req.params.id}`).emit('task_comment', comment);

  // Send notifications to mentions
  if (mentions && mentions.length > 0) {
    await notificationService.sendMentionNotifications(mentions, comment);
  }

  res.status(201).json({ success: true, data: comment });
});
```

#### **3.2 Slack Integration**

```javascript
// engines/integrations/ (new engine OR part of main API)

// Slack OAuth
router.get('/slack/install', (req, res) => {
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,commands,users:read&redirect_uri=${process.env.SLACK_REDIRECT_URI}`;
  res.redirect(slackAuthUrl);
});

router.get('/slack/callback', async (req, res) => {
  const { code } = req.query;

  // Exchange code for token
  const response = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: process.env.SLACK_REDIRECT_URI
    })
  });

  const data = await response.json();

  // Save integration
  await Integration.create({
    business_id: req.user.business_id,
    type: 'slack',
    credentials: {
      access_token: data.access_token,
      team_id: data.team.id,
      channel_id: data.incoming_webhook.channel_id
    }
  });

  res.send('Slack integrated successfully!');
});

// Send notification to Slack
async function sendSlackNotification(businessId, message) {
  const integration = await Integration.findOne({ business_id: businessId, type: 'slack' });
  if (!integration) return;

  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${integration.credentials.access_token}`
    },
    body: JSON.stringify({
      channel: integration.credentials.channel_id,
      text: message
    })
  });
}

// Slash commands
router.post('/slack/commands', async (req, res) => {
  const { command, text, user_id } = req.body;

  if (command === '/karvia') {
    if (text === 'my-tasks') {
      // Fetch user's tasks
      const slackUser = await SlackUser.findOne({ slack_user_id: user_id });
      const tasks = await Task.find({ assigned_to: slackUser.karvia_user_id, status: { $in: ['todo', 'in_progress'] } }).limit(5);

      const response = {
        response_type: 'ephemeral',
        text: '*Your tasks:*',
        blocks: tasks.map(t => ({
          type: 'section',
          text: { type: 'mrkdwn', text: `• ${t.title} (Due: ${formatDate(t.due_date)})` }
        }))
      };

      return res.json(response);
    }
  }

  res.json({ text: 'Unknown command' });
});
```

**Acceptance Criteria (Phase 3)**:
- ✅ WebSocket server functional (Socket.IO)
- ✅ Task comments in real-time
- ✅ @mentions trigger notifications
- ✅ Slack OAuth integration works
- ✅ Slack notifications sent (task assigned, objective at-risk)
- ✅ Slack slash commands respond (`/karvia my-tasks`)

---

### **Phase 4: Enterprise Features (4 weeks)**

#### **4.1 Granular Permissions**

```javascript
// shared-models/models/Role.js (enhanced)
const roleSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  is_system_role: { type: Boolean, default: false }, // true for default roles

  permissions: {
    assessments: {
      view_own: { type: Boolean, default: true },
      view_team: { type: Boolean, default: false },
      view_all: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit_own: { type: Boolean, default: false },
      edit_all: { type: Boolean, default: false }
    },
    objectives: {
      view_assigned: { type: Boolean, default: true },
      view_team: { type: Boolean, default: false },
      view_all: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit_assigned: { type: Boolean, default: false },
      edit_all: { type: Boolean, default: false },
      generate_okrs: { type: Boolean, default: false }
    },
    // ... other resources
  },

  created_at: { type: Date, default: Date.now }
});

// User model references role
const userSchema = new mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  // ... other fields
});
```

**Permission Check Middleware**:
```javascript
// middleware/permissions.js
function hasPermission(resource, action) {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('role_id');

    if (!user.role_id) {
      return res.status(403).json({ message: 'No role assigned' });
    }

    const permitted = user.role_id.permissions[resource][action];

    if (!permitted) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}

// Usage
router.post('/objectives', authenticate, hasPermission('objectives', 'create'), async (req, res) => {
  // Only users with objectives.create permission can access
});
```

#### **4.2 Sub-Teams and Hierarchies**

```javascript
// shared-models/models/Team.js
const teamSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  parent_team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // null = root
  team_lead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  level: { type: Number, default: 0 }, // 0 = company, 1 = department, 2 = sub-team
  created_at: { type: Date, default: Date.now }
});

// User model
const userSchema = new mongoose.Schema({
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }], // User can be in multiple teams
  primary_team_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});
```

**Org Chart Visualization**:
```javascript
// GET /api/teams/org-chart
router.get('/teams/org-chart', authenticate, async (req, res) => {
  const teams = await Team.find({ business_id: req.user.business_id })
    .populate('team_lead_id', 'name email')
    .lean();

  // Build hierarchy
  const orgChart = buildTree(teams, null); // Start from root (parent_team_id = null)

  res.json({ success: true, data: orgChart });
});

function buildTree(teams, parentId) {
  return teams
    .filter(t => String(t.parent_team_id) === String(parentId))
    .map(team => ({
      ...team,
      children: buildTree(teams, team._id)
    }));
}
```

**Acceptance Criteria (Phase 4)**:
- ✅ Admin can create custom roles
- ✅ Granular permissions enforced at API level
- ✅ Sub-teams created (3-level hierarchy)
- ✅ Org chart visualized
- ✅ Consultant multi-company dashboard

---

### **Phase 5: Platform & AI Enhancements (4 weeks)**

#### **5.1 AI Coaching Assistant**

**iBrain Integration**: This is ideal for iBrain-managed service.

```javascript
// engines/ai-coach/ (new engine, iBrain manages)

router.post('/chat', authenticate, async (req, res) => {
  const { message, session_id } = req.body;

  // Fetch user context
  const user = await User.findById(req.user.id);
  const objectives = await Objective.find({ business_id: user.business_id, assigned_to: user.id });
  const tasks = await Task.find({ assigned_to: user.id, status: { $in: ['todo', 'in_progress'] } });

  // Build context for OpenAI
  const context = `
User: ${user.name} (${user.role})
Company: ${user.business_id}
Current Objectives: ${objectives.map(o => o.title).join(', ')}
Current Tasks: ${tasks.length} open tasks
`;

  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: `You are an AI coach for ${user.name}. Help them with their work tasks, objectives, and career growth. Context: ${context}` },
      ...req.body.chat_history, // Previous messages
      { role: 'user', content: message }
    ],
    temperature: 0.8,
    max_tokens: 500
  });

  const reply = response.choices[0].message.content;

  // Save session
  await CoachingSession.findOneAndUpdate(
    { _id: session_id },
    { $push: { messages: [{ role: 'user', content: message }, { role: 'assistant', content: reply }] } },
    { upsert: true }
  );

  res.json({ success: true, data: { reply, session_id } });
});
```

#### **5.2 Workflow Automation**

**Visual Workflow Builder** (low-code):

```javascript
// shared-models/models/Workflow.js
const workflowSchema = new mongoose.Schema({
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true },
  trigger: {
    type: { type: String, enum: ['task_completed', 'goal_completed', 'objective_created', 'sentiment_low', 'date'] },
    conditions: Object // e.g., { "task.status": "completed", "task.objective_id": "xyz" }
  },
  actions: [
    {
      type: { type: String, enum: ['create_task', 'send_notification', 'update_status', 'run_ai', 'send_webhook'] },
      parameters: Object // Action-specific params
    }
  ],
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});
```

**Execution Engine**:
```javascript
// engines/automation/ (new engine)

// Listen to events
eventBus.subscribe('task.completed', async (event) => {
  // Find workflows triggered by task.completed
  const workflows = await Workflow.find({
    'trigger.type': 'task_completed',
    is_active: true
  });

  for (const workflow of workflows) {
    // Check conditions
    if (evaluateConditions(workflow.trigger.conditions, event.data)) {
      await executeWorkflow(workflow, event.data);
    }
  }
});

async function executeWorkflow(workflow, context) {
  for (const action of workflow.actions) {
    await executeAction(action, context);
  }
}

async function executeAction(action, context) {
  switch (action.type) {
    case 'create_task':
      await Task.create({
        title: action.parameters.title,
        assigned_to: context.user_id,
        ...action.parameters
      });
      break;

    case 'send_notification':
      await notificationService.send(action.parameters.recipient, action.parameters.message);
      break;

    case 'send_webhook':
      await fetch(action.parameters.url, {
        method: 'POST',
        body: JSON.stringify(context)
      });
      break;

    // ... other actions
  }
}
```

**Acceptance Criteria (Phase 5)**:
- ✅ AI coaching chat functional
- ✅ Context-aware responses (user's objectives, tasks)
- ✅ Workflow builder UI (drag-and-drop)
- ✅ Workflows execute on triggers
- ✅ Performance optimized (<2s dashboard load)

---

## 🗓️ BETA RELEASE TIMELINE

| Phase | Duration | Start Date | Key Deliverables |
|-------|----------|------------|------------------|
| **Phase 0**: Architecture Foundation | 4 weeks | Dec 1, 2025 | Event bus, contracts, engine SDK |
| **Phase 1**: Enhanced Assessment | 4 weeks | Jan 1, 2026 | 6 templates, builder, marketplace |
| **Phase 2**: Analytics & Insights | 4 weeks | Feb 1, 2026 | Sentiment, predictions, health metrics |
| **Phase 3**: Collaboration & Integrations | 4 weeks | Mar 1, 2026 | Comments, Slack, mobile prep |
| **Phase 4**: Enterprise Features | 4 weeks | Apr 1, 2026 | Permissions, sub-teams, consultant tools |
| **Phase 5**: Platform & AI | 4 weeks | May 1, 2026 | AI coach, workflows, optimization |

**Beta Release Target**: June 1, 2026 (Q2 2026)

---

## ✅ SUCCESS METRICS

### **Technical**
- ✅ All engines use event-driven architecture (no database sharing)
- ✅ Contracts published and versioned
- ✅ Engine SDK adopted by all engines
- ✅ NATS event bus processing >1000 events/sec
- ✅ API response times <200ms (p90)
- ✅ Dashboard load times <2s (p90)

### **User Adoption**
- ✅ 50+ companies using Beta
- ✅ 2000+ active users
- ✅ 60% use custom assessment templates
- ✅ 70% submit daily reflections
- ✅ 40% use Slack integration
- ✅ 20% marketplace template sales

### **Business**
- ✅ $50K+ MRR
- ✅ NPS score 50+
- ✅ <5% churn per quarter
- ✅ 5+ enterprise contracts ($10K+/year)

---

## ❌ EXPLICITLY OUT OF SCOPE (POST-BETA)

Deferred to v2.0:
- ❌ Multi-language support
- ❌ Advanced ML models (custom trained)
- ❌ Consultant billing system
- ❌ White-label consultant platform (full rebrand)
- ❌ Time tracking integration (Clockify, Toggl)
- ❌ BI tool integrations (Tableau, Power BI)
- ❌ Gantt chart view

---

## 🔗 RELATED DOCUMENTS

- **MVP Strategy**: `MVP_STRATEGY_FINAL.md` (baseline for Beta)
- **Code Reviews**:
  - `Review Docs/betastrategy_review/critical_review.md`
  - `Review Docs/overall_strategy_review_and_risks/critical_overview.md`

---

**Document Owner**: Product & Engineering Team
**Last Updated**: October 1, 2025 (Final Version)
**Status**: ✅ LOCKED FOR IMPLEMENTATION - Post-MVP Launch
**Next Review**: After Phase 0 completion (Feb 2026)
