# 🚀 KARVIA OKR - MVP STRATEGY (FINAL)

**Version**: 3.0 (Final - Addressing Critical Reviews)
**Date**: October 1, 2025
**Target Launch**: November 30, 2025 (8 weeks)
**Status**: LOCKED FOR IMPLEMENTATION

---

## 📋 EXECUTIVE SUMMARY

This document represents the **final, implementation-ready MVP strategy** addressing all critical issues identified in technical reviews. We are leveraging **90% existing infrastructure** while resolving **architectural debt** and **deployment blockers** before feature work.

**Key Change from v2.0**: Technical debt resolution is now **Week 0-1 prerequisite** before feature development begins.

---

## 🚨 CRITICAL ISSUES ADDRESSED (From Reviews)

### **1. Engine Isolation Breach (HIGH PRIORITY)**
**Problem**: Engines import `server/models` directly, creating filesystem coupling that prevents independent deployment.

**Solution**:
```javascript
// BEFORE (BAD): engines/assessment/index.js:21
const Business = require('../../server/models/Business');

// AFTER (GOOD): Shared package approach
// Create @karvia/shared-models package
// Package contents: /shared-models/
//   - package.json
//   - models/Business.js
//   - models/Objective.js
//   - models/User.js
//   - schemas/ (JSON schemas for validation)

// engines/assessment/package.json
{
  "dependencies": {
    "@karvia/shared-models": "^1.0.0"
  }
}

// engines/assessment/index.js
const { Business } = require('@karvia/shared-models');
```

**Implementation Plan**:
- [ ] Week 0: Create `shared-models/` workspace (npm workspaces)
- [ ] Week 0: Move common models to shared package
- [ ] Week 0: Update all engines to use shared package
- [ ] Week 0: Remove direct `../../server/models` imports
- [ ] Week 0: Version shared package (semver)

---

### **2. Goal/Task Cascade Not Implemented (BLOCKING MVP)**
**Problem**: `server/routes/goals.js:1` and `server/routes/tasks.js:1` are placeholders.

**Solution**: Complete implementation with shared schema contract.

```javascript
// shared-models/models/Goal.js (CANONICAL)
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  objective_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Objective', required: true },
  key_result_id: { type: String, required: true }, // KR within Objective
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  week_number: { type: Number, min: 1, max: 52, required: true },
  quarter: { type: Number, min: 1, max: 4, required: true },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'at_risk', 'blocked'],
    default: 'not_started'
  },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  due_date: { type: Date, required: true },
  progress_percentage: { type: Number, min: 0, max: 100, default: 0 },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Indexes
goalSchema.index({ business_id: 1, assigned_to: 1, status: 1 });
goalSchema.index({ objective_id: 1 });
goalSchema.index({ week_number: 1, quarter: 1 });

module.exports = mongoose.model('Goal', goalSchema);
```

```javascript
// shared-models/models/Task.js (CANONICAL)
const taskSchema = new mongoose.Schema({
  goal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 2000 },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  due_date: { type: Date, required: true },
  estimated_hours: { type: Number, min: 0 },
  actual_hours: { type: Number, min: 0, default: 0 },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'completed', 'blocked'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  ai_generated: { type: Boolean, default: false },
  ai_suggestion_metadata: {
    prompt: String,
    confidence: Number,
    generated_at: Date
  },
  completion_notes: { type: String, maxlength: 1000 },
  completed_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

taskSchema.index({ business_id: 1, assigned_to: 1, status: 1 });
taskSchema.index({ goal_id: 1 });
taskSchema.index({ due_date: 1 });

module.exports = mongoose.model('Task', taskSchema);
```

**API Implementation** (server/routes/goals.js):
```javascript
const express = require('express');
const router = express.Router();
const { Goal } = require('@karvia/shared-models');
const { authenticate, authorize } = require('../middleware/auth');

// List goals (with filters)
router.get('/', authenticate, async (req, res) => {
  const { objective_id, assigned_to, status, quarter, week_number } = req.query;
  const filter = { business_id: req.user.business_id };

  if (objective_id) filter.objective_id = objective_id;
  if (assigned_to) filter.assigned_to = assigned_to;
  if (status) filter.status = status;
  if (quarter) filter.quarter = parseInt(quarter);
  if (week_number) filter.week_number = parseInt(week_number);

  const goals = await Goal.find(filter)
    .populate('objective_id', 'title')
    .populate('assigned_to', 'name email')
    .sort({ week_number: 1 });

  res.json({ success: true, data: goals });
});

// Create goal
router.post('/', authenticate, authorize(['company_admin', 'manager']), async (req, res) => {
  const goalData = {
    ...req.body,
    business_id: req.user.business_id,
    created_by: req.user.id
  };

  const goal = await Goal.create(goalData);
  res.status(201).json({ success: true, data: goal });
});

// Update goal
router.put('/:id', authenticate, async (req, res) => {
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, business_id: req.user.business_id },
    { ...req.body, updated_at: Date.now() },
    { new: true, runValidators: true }
  );

  if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
  res.json({ success: true, data: goal });
});

// Update progress
router.put('/:id/progress', authenticate, async (req, res) => {
  const { progress_percentage } = req.body;
  const goal = await Goal.findOneAndUpdate(
    { _id: req.params.id, business_id: req.user.business_id },
    { progress_percentage, updated_at: Date.now() },
    { new: true }
  );

  res.json({ success: true, data: goal });
});

module.exports = router;
```

**Tracking Engine Integration**:
```javascript
// engines/tracking/index.js - Remove duplicate models, use shared
const { Goal, Task } = require('@karvia/shared-models');

// Update tracking to use shared schemas
router.post('/goals/:id/progress', async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  // ... existing tracking logic
});
```

---

### **3. Authentication Fragility (SECURITY RISK)**
**Problem**: Hard-coded JWT secrets in `engines/iam/index.js:109,115`.

**Solution**:
```javascript
// engines/iam/config/index.js (NEW FILE)
const crypto = require('crypto');

const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  }
};

// Validation at startup
function validateConfig() {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Validate secret strength
  if (config.jwt.secret.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters');
    process.exit(1);
  }
}

validateConfig();

module.exports = config;
```

```javascript
// engines/iam/index.js - Use validated config
const config = require('./config');

// Generate token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}
```

**Docker Compose** (secure secrets):
```yaml
# docker-compose.yml
services:
  iam-engine:
    environment:
      JWT_SECRET: ${JWT_SECRET}  # From .env file (not committed)
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      NODE_ENV: production
```

**Generate secrets** (scripts/generate-secrets.sh):
```bash
#!/bin/bash
# Run once to generate .env file

echo "Generating secure secrets..."

JWT_SECRET=$(openssl rand -base64 48)
JWT_REFRESH_SECRET=$(openssl rand -base64 48)
MONGO_PASSWORD=$(openssl rand -base64 24)
REDIS_PASSWORD=$(openssl rand -base64 24)

cat > .env <<EOF
# Generated $(date)
# DO NOT COMMIT THIS FILE

JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
MONGO_PASSWORD=${MONGO_PASSWORD}
REDIS_PASSWORD=${REDIS_PASSWORD}

# MongoDB Connection
MONGODB_URI=mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin

# Redis Connection
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
EOF

echo "✅ Secrets generated in .env file"
echo "⚠️  Add .env to .gitignore"
```

---

### **4. Deployment Pipeline Blockers (CRITICAL)**
**Problem**: Dockerfile, docker-compose, startup scripts have critical bugs.

**Solution**:

**Fix 1: Engine Dockerfile**
```dockerfile
# Dockerfile.engines (FIXED)
FROM node:18-alpine

WORKDIR /app

# Copy shared models first
COPY shared-models/package*.json ./shared-models/
RUN cd shared-models && npm ci --production

# Copy engine-specific files
ARG ENGINE_NAME
COPY engines/${ENGINE_NAME}/package*.json ./
RUN npm ci --production

COPY engines/${ENGINE_NAME}/ ./
COPY shared-models/ ./node_modules/@karvia/shared-models/

EXPOSE 8080

CMD ["node", "index.js"]
```

**Fix 2: Docker Compose (remove invalid mounts)**
```yaml
# docker-compose.yml (FIXED)
version: '3.8'

services:
  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: karvia
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s

  iam-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: iam
    ports:
      - "8081:8080"
    environment:
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      PORT: 8080
    depends_on:
      mongodb:
        condition: service_healthy
    restart: unless-stopped

  assessment-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: assessment
    ports:
      - "8082:8080"
    environment:
      MONGODB_URI: ${MONGODB_URI}
      PORT: 8080
    depends_on:
      mongodb:
        condition: service_healthy

  planner-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: planner
    ports:
      - "8083:8080"
    environment:
      MONGODB_URI: ${MONGODB_URI}
      REDIS_URL: ${REDIS_URL}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      PORT: 8080
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy

  # ... other engines

  server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: ${MONGODB_URI}
      JWT_SECRET: ${JWT_SECRET}
      IAM_ENGINE_URL: http://iam-engine:8080
      ASSESSMENT_ENGINE_URL: http://assessment-engine:8080
      PLANNER_ENGINE_URL: http://planner-engine:8080
      SCORING_ENGINE_URL: http://scoring-engine:8080
      OBSERVER_ENGINE_URL: http://observer-engine:8080
      TRACKING_ENGINE_URL: http://tracking-engine:8080
    depends_on:
      - iam-engine
      - assessment-engine
      - planner-engine

volumes:
  mongo-data:
  redis-data:
```

**Fix 3: Startup Scripts (remove curl waits)**
```bash
#!/bin/bash
# scripts/start.sh (FIXED)

set -e

echo "🚀 Starting Karvia OKR Platform..."

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ .env file not found. Run ./scripts/generate-secrets.sh first."
  exit 1
fi

# Start services (healthchecks handle waiting)
docker-compose up -d

echo "✅ Services starting..."
echo "📊 Check status: docker-compose ps"
echo "📋 View logs: docker-compose logs -f"
echo "🔗 API: http://localhost:5000"
```

---

### **5. OpenAI Integration Missing (MVP DIFFERENTIATOR)**
**Problem**: Planner engine uses static templates, no OpenAI integration.

**Solution**:

```javascript
// engines/planner/services/openai-service.js (NEW)
const OpenAI = require('openai');
const redis = require('../config/redis');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  async generateObjectives(business, assessment) {
    // 1. Check cache
    const cacheKey = `okr:${business.id}:${assessment.id}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('✅ Returning cached OKRs');
      return JSON.parse(cached);
    }

    // 2. Build prompt
    const prompt = this.buildOKRPrompt(business, assessment);

    // 3. Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a business strategy consultant specializing in OKR design.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    });

    // 4. Parse response
    const objectives = JSON.parse(response.choices[0].message.content);

    // 5. Validate structure
    this.validateObjectives(objectives);

    // 6. Cache for 24 hours
    await redis.setex(cacheKey, 86400, JSON.stringify(objectives));

    return objectives;
  }

  buildOKRPrompt(business, assessment) {
    const weakAreas = this.identifyWeakAreas(assessment);

    return `
BUSINESS CONTEXT:
- Archetype: ${business.archetype}
- Industry: ${business.industry}
- Size: ${business.employee_count} employees

ASSESSMENT RESULTS:
- Speed (Business Agility): ${assessment.speed_score}/100 ${assessment.speed_score < 70 ? '[NEEDS ATTENTION]' : '[STRONG]'}
- Strength (Stability): ${assessment.strength_score}/100 ${assessment.strength_score < 70 ? '[NEEDS ATTENTION]' : '[STRONG]'}
- Intelligence (Insight): ${assessment.intelligence_score}/100 ${assessment.intelligence_score < 70 ? '[NEEDS ATTENTION]' : '[STRONG]'}
- Overall: ${assessment.overall_score}/100

WEAKEST AREAS (Priority for improvement):
${weakAreas.map(a => `- ${a.name}: ${a.score}/100 - ${a.description}`).join('\n')}

STRATEGIC PRIORITIES:
Primary Focus: ${business.preference_priority.primary.join(', ')}
Secondary Focus: ${business.preference_priority.secondary.join(', ')}

TASK:
Generate 4-6 quarterly objectives (Q${this.getCurrentQuarter()}) that:
1. Address the weakest assessment areas (scores <70 get highest priority)
2. Align with primary strategic priorities (80% weight)
3. Are appropriate for ${business.archetype} businesses
4. Follow OKR best practices (specific, measurable, time-bound, achievable)

For each objective, provide:
- title: Inspiring, outcome-focused (not activity-focused)
- rationale: Why this matters based on assessment scores
- focusArea: Which strategic priority it addresses
- difficulty: easy|medium|hard
- estimatedEffort: Percentage of team capacity (15-25%)
- keyResults: 3-4 measurable outcomes with baseline/target

Return JSON in this format:
{
  "objectives": [
    {
      "title": "...",
      "rationale": "...",
      "focusArea": "...",
      "difficulty": "medium",
      "estimatedEffort": "20%",
      "keyResults": [
        {
          "description": "...",
          "metric": "...",
          "baseline": "...",
          "target": "...",
          "quarter": 4
        }
      ]
    }
  ]
}
`;
  }

  identifyWeakAreas(assessment) {
    const areas = [
      { name: 'Speed', score: assessment.speed_score, description: 'Business agility and execution speed' },
      { name: 'Strength', score: assessment.strength_score, description: 'Operational stability and resilience' },
      { name: 'Intelligence', score: assessment.intelligence_score, description: 'Data-driven insights and decision-making' }
    ];

    return areas.filter(a => a.score < 70).sort((a, b) => a.score - b.score);
  }

  validateObjectives(data) {
    if (!data.objectives || !Array.isArray(data.objectives)) {
      throw new Error('Invalid OpenAI response: missing objectives array');
    }

    if (data.objectives.length < 4 || data.objectives.length > 6) {
      throw new Error('OpenAI returned wrong number of objectives');
    }

    data.objectives.forEach((obj, idx) => {
      if (!obj.title || !obj.keyResults || obj.keyResults.length < 3) {
        throw new Error(`Invalid objective at index ${idx}`);
      }
    });
  }

  getCurrentQuarter() {
    return Math.floor((new Date().getMonth() / 3)) + 1;
  }

  // Task suggestions
  async suggestTasks(goal, objective) {
    const cacheKey = `tasks:${goal.id}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const prompt = `
GOAL: ${goal.title}
DESCRIPTION: ${goal.description}

CONTEXT:
- This goal contributes to Key Result: "${goal.key_result.description}"
- Which is part of Objective: "${objective.title}"
- Due: Week ${goal.week_number}, Q${goal.quarter}

TASK:
Suggest 5-7 specific, actionable tasks to complete this goal. For each task:
- title: Specific action (verb + noun)
- description: What needs to be done
- estimated_hours: Realistic time estimate
- priority: low|medium|high|urgent
- dependencies: Which tasks should be done first

Return JSON:
{
  "tasks": [
    {
      "title": "...",
      "description": "...",
      "estimated_hours": 4,
      "priority": "high",
      "dependencies": []
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const tasks = JSON.parse(response.choices[0].message.content);
    await redis.setex(cacheKey, 3600, JSON.stringify(tasks)); // Cache 1 hour

    return tasks;
  }
}

module.exports = new OpenAIService();
```

**Planner Engine Routes** (engines/planner/index.js):
```javascript
const openaiService = require('./services/openai-service');
const { Business } = require('@karvia/shared-models');

// Generate OKRs with OpenAI
router.post('/objectives/generate', async (req, res) => {
  const { business_id, assessment_id } = req.body;

  try {
    const business = await Business.findById(business_id);
    const assessment = await Assessment.findById(assessment_id);

    if (!business || !assessment) {
      return res.status(404).json({ success: false, message: 'Business or assessment not found' });
    }

    // Call OpenAI service
    const objectives = await openaiService.generateObjectives(business, assessment);

    res.json({
      success: true,
      data: objectives,
      metadata: {
        cached: false,
        generated_at: new Date(),
        expires_in: 86400
      }
    });

  } catch (error) {
    console.error('OpenAI generation error:', error);

    // Fallback to template-based OKRs
    const fallbackObjectives = await templateService.generateObjectives(business, assessment);

    res.json({
      success: true,
      data: fallbackObjectives,
      metadata: {
        fallback: true,
        reason: error.message
      }
    });
  }
});

// AI task suggestions
router.post('/goals/:id/suggest-tasks', async (req, res) => {
  const goal = await Goal.findById(req.params.id).populate('objective_id');
  const tasks = await openaiService.suggestTasks(goal, goal.objective_id);

  res.json({ success: true, data: tasks });
});
```

---

### **6. Invitation & Role Flows Not Wired**
**Problem**: No invitation system implemented.

**Solution**:

```javascript
// engines/iam/services/invitation-service.js (NEW)
const crypto = require('crypto');
const { User } = require('@karvia/shared-models');

class InvitationService {
  async createInvitation(inviterUserId, inviteeEmail, role, businessId) {
    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await Invitation.create({
      token,
      inviter_user_id: inviterUserId,
      invitee_email: inviteeEmail,
      role,
      business_id: businessId,
      status: 'pending',
      expires_at: expiresAt
    });

    // Send email (integrate with email service)
    await this.sendInvitationEmail(invitation);

    return invitation;
  }

  async validateInvitation(token) {
    const invitation = await Invitation.findOne({ token, status: 'pending' });

    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    if (invitation.expires_at < new Date()) {
      invitation.status = 'expired';
      await invitation.save();
      throw new Error('Invitation has expired');
    }

    return invitation;
  }

  async acceptInvitation(token, userData) {
    const invitation = await this.validateInvitation(token);

    // Create user account
    const user = await User.create({
      email: invitation.invitee_email,
      password: userData.password, // Will be hashed by User model
      name: userData.name,
      role: invitation.role,
      business_id: invitation.business_id
    });

    // Mark invitation as accepted
    invitation.status = 'accepted';
    invitation.accepted_at = new Date();
    await invitation.save();

    return user;
  }

  async sendInvitationEmail(invitation) {
    const inviteUrl = `${process.env.APP_URL}/register?token=${invitation.token}`;

    // Integrate with email service
    console.log(`📧 Send invitation email to ${invitation.invitee_email}: ${inviteUrl}`);
    // TODO: Implement actual email sending
  }
}

module.exports = new InvitationService();
```

```javascript
// shared-models/models/Invitation.js (NEW)
const invitationSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true, index: true },
  inviter_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invitee_email: { type: String, required: true, lowercase: true },
  role: {
    type: String,
    enum: ['company_admin', 'manager', 'employee', 'consultant'],
    required: true
  },
  business_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired', 'cancelled'],
    default: 'pending'
  },
  expires_at: { type: Date, required: true },
  accepted_at: { type: Date },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invitation', invitationSchema);
```

**IAM Routes**:
```javascript
// POST /invite - Create invitation
router.post('/invite', authenticate, authorize(['company_admin', 'manager']), async (req, res) => {
  const { email, role } = req.body;

  const invitation = await invitationService.createInvitation(
    req.user.id,
    email,
    role,
    req.user.business_id
  );

  res.status(201).json({ success: true, data: invitation });
});

// GET /invite/:token - Validate invitation
router.get('/invite/:token', async (req, res) => {
  const invitation = await invitationService.validateInvitation(req.params.token);
  res.json({ success: true, data: invitation });
});

// POST /register - Accept invitation and create account
router.post('/register', async (req, res) => {
  const { token, name, password } = req.body;

  const user = await invitationService.acceptInvitation(token, { name, password });
  const accessToken = generateToken(user);

  res.status(201).json({
    success: true,
    data: { user, token: accessToken }
  });
});
```

---

## 🏗️ REVISED IMPLEMENTATION TIMELINE

### **WEEK 0: TECHNICAL DEBT RESOLUTION (PREREQUISITE)**

**Critical Infrastructure Fixes:**
- [ ] Create `shared-models/` npm workspace
- [ ] Move common models to shared package
- [ ] Update all engines to use `@karvia/shared-models`
- [ ] Fix Dockerfile.engines (engine package.json paths)
- [ ] Fix docker-compose.yml (remove invalid volumes, add healthchecks)
- [ ] Implement config validation (JWT secrets, envs)
- [ ] Create `scripts/generate-secrets.sh`
- [ ] Fix startup scripts (remove curl waits)
- [ ] Test full deployment: `docker-compose up`

**Security Hardening:**
- [ ] Remove all hard-coded credentials
- [ ] Enforce environment-based secrets
- [ ] Add startup validation (fail if secrets missing)
- [ ] Generate .env.example template

**Acceptance Criteria:**
- ✅ `docker-compose up` starts all services successfully
- ✅ All engines use shared models (no direct imports)
- ✅ No hard-coded secrets in codebase
- ✅ Health checks pass for MongoDB, Redis, engines
- ✅ Services can discover and call each other

**Output**: Production-ready deployment infrastructure

---

### **WEEK 1-2: COMPLETE OKR CASCADE + OPENAI**

**Goals & Tasks API:**
- [ ] Implement Goal schema in shared-models
- [ ] Implement Task schema in shared-models
- [ ] Complete `server/routes/goals.js` (all CRUD endpoints)
- [ ] Complete `server/routes/tasks.js` (all CRUD endpoints)
- [ ] Update Tracking Engine to use shared models
- [ ] Test cascade: Objective → Key Results → Goals → Tasks

**OpenAI Integration:**
- [ ] Create `engines/planner/services/openai-service.js`
- [ ] Implement OKR generation endpoint
- [ ] Implement AI task suggestions endpoint
- [ ] Add Redis caching layer
- [ ] Add fallback to template-based OKRs
- [ ] Test with various business archetypes

**Acceptance Criteria:**
- ✅ Manager can create goals from key results
- ✅ Manager can create tasks from goals
- ✅ Employee can view assigned tasks
- ✅ OpenAI generates 4-6 quality objectives
- ✅ Caching reduces OpenAI API costs
- ✅ Fallback works when OpenAI fails

**Output**: Complete Objective → Goal → Task cascade with AI generation

---

### **WEEK 3-4: BUSINESS MODEL + INVITATION SYSTEM**

**Business Archetype & Preferences:**
- [ ] Expand Business model: 16 archetypes enum
- [ ] Add strategic_preferences field (24 focus areas)
- [ ] Add preference_priority field (primary/secondary)
- [ ] Update signup flow to capture archetype + preferences
- [ ] Test OKR generation with different archetypes

**Invitation System:**
- [ ] Create Invitation model in shared-models
- [ ] Implement invitation-service in IAM engine
- [ ] Add invitation endpoints (create, validate, accept)
- [ ] Build invitation email templates
- [ ] Test invitation flow end-to-end

**Frontend Updates:**
- [ ] Owner signup: Archetype selector
- [ ] Owner signup: Strategic preferences checkboxes
- [ ] Owner invite: Team member invitation form
- [ ] Registration: Token-based signup flow

**Acceptance Criteria:**
- ✅ Owner selects archetype and preferences during signup
- ✅ OpenAI uses archetype + preferences for OKR generation
- ✅ Owner can invite team members via email
- ✅ Invitee receives email with registration link
- ✅ Token-based registration creates user account

**Output**: Complete onboarding flow with team invitations

---

### **WEEK 5-6: ROLE-BASED DASHBOARDS**

**5 Role Permissions:**
- [ ] Implement role-based authorization middleware
- [ ] Update IAM engine with permission matrix
- [ ] Test permissions (users can only access authorized data)
- [ ] Implement consultant multi-company logic

**Frontend Screens (15 Core):**

**Owner (5 screens):**
- [ ] Signup & Business Profile
- [ ] Take Assessment
- [ ] Assessment Results + Generate OKRs button
- [ ] Review Generated OKRs (edit, approve)
- [ ] Invite Team

**Manager (4 screens):**
- [ ] Manager Dashboard (team progress, tasks)
- [ ] Manager Planning (select OKRs, assign goals)
- [ ] Team Management (team members, capacity)
- [ ] Task Assignment (AI suggest tasks)

**Employee (3 screens):**
- [ ] Employee Dashboard (my 3 tasks today)
- [ ] My Objectives (progress, contribution)
- [ ] Task Detail (complete, defer, comment)

**Consultant (2 screens):**
- [ ] Consultant Client List (all companies, health scores)
- [ ] Consultant Company View (same as owner dashboard)

**Shared (1 screen):**
- [ ] Registration via Invite (token-based)

**Acceptance Criteria:**
- ✅ All 15 screens functional and data-bound
- ✅ Role-based navigation (employees don't see admin features)
- ✅ Consultant can switch companies (dropdown)
- ✅ Manager can assign goals and tasks to team
- ✅ Employee sees personalized task view

**Output**: Complete role-based user experience

---

### **WEEK 7: INTEGRATION TESTING**

**End-to-End Flows:**
- [ ] Owner flow: Signup → Assessment → Generate OKRs → Invite team
- [ ] Manager flow: Register → Select OKRs → Assign goals → Create tasks (AI suggested)
- [ ] Employee flow: Register → View tasks → Complete tasks
- [ ] Consultant flow: Add company → Generate OKRs for client
- [ ] Multi-company flow: Consultant switches between companies

**Bug Fixes & Edge Cases:**
- [ ] Test with missing data (empty assessments, no objectives)
- [ ] Test with large data (1000 objectives, 10000 tasks)
- [ ] Test concurrent access (multiple managers editing same goal)
- [ ] Test OpenAI failures (fallback to templates)
- [ ] Test invitation expiry and reuse

**Performance Optimization:**
- [ ] Database query optimization (add indexes)
- [ ] API response time testing (<200ms p90)
- [ ] Frontend load time testing (<2s dashboard load)
- [ ] OpenAI rate limiting (prevent abuse)

**Security Audit:**
- [ ] Test authorization (users can't access other companies' data)
- [ ] Test input validation (SQL injection, XSS)
- [ ] Test JWT token expiry and refresh
- [ ] Test invitation token security

**Acceptance Criteria:**
- ✅ All user flows work end-to-end
- ✅ No critical bugs or data loss
- ✅ Performance meets targets (<2s dashboard, <200ms API)
- ✅ Security audit passes (no unauthorized access)

**Output**: Stable, tested MVP ready for beta users

---

### **WEEK 8: LAUNCH PREPARATION**

**Documentation:**
- [ ] User guides (one per role: Owner, Manager, Employee, Consultant)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Deployment guide (production setup)
- [ ] Admin guide (managing users, troubleshooting)

**Beta User Onboarding:**
- [ ] Recruit 5 beta companies
- [ ] Recruit 2 consultants with multi-company access
- [ ] Onboarding sessions (demo + training)
- [ ] Feedback collection mechanism

**Production Deployment:**
- [ ] Set up production environment (AWS/GCP/Render)
- [ ] Configure domain + SSL certificate
- [ ] Set up monitoring (Sentry, Datadog, or similar)
- [ ] Set up analytics (user events, feature usage)
- [ ] Set up backup and disaster recovery
- [ ] Load testing (simulate 100 concurrent users)

**Launch Checklist:**
- [ ] All services deployed and healthy
- [ ] Domain resolves correctly
- [ ] SSL certificate valid
- [ ] Email delivery working
- [ ] OpenAI integration working (with API key quotas)
- [ ] Monitoring alerts configured
- [ ] Beta users can access platform
- [ ] Support channel established (email/Slack)

**Acceptance Criteria:**
- ✅ Platform accessible at production URL
- ✅ 5 beta companies onboarded
- ✅ 50+ users registered (owners, managers, employees)
- ✅ 25+ assessments completed
- ✅ 100+ OKRs generated via OpenAI
- ✅ Zero data loss or downtime during launch week

**Output**: Live MVP with beta users, Nov 30, 2025 🚀

---

## 📊 MVP FEATURE LIST (FINAL - LOCKED)

| Feature | Status | Implementation Week | Notes |
|---------|--------|---------------------|-------|
| **Infrastructure** | | | |
| Shared Models Package | ✅ Ship | Week 0 | Decouple engines from server models |
| Docker Deployment | ✅ Ship | Week 0 | Fix Dockerfile, Compose, healthchecks |
| Secure Auth | ✅ Ship | Week 0 | Remove hard-coded secrets, validate envs |
| Service Discovery | ✅ Ship | Week 0 | Engine URLs via environment variables |
| **Core OKR Cascade** | | | |
| Goals API & Model | ✅ Ship | Week 1-2 | Complete `/api/goals` endpoints |
| Tasks API & Model | ✅ Ship | Week 1-2 | Complete `/api/tasks` endpoints |
| Cascade Logic | ✅ Ship | Week 1-2 | Objective → KR → Goal → Task |
| Progress Tracking | ✅ Ship | Week 1-2 | Auto-calculate progress from tasks |
| **AI Integration** | | | |
| OpenAI OKR Generation | ✅ Ship | Week 1-2 | GPT-4 with caching |
| AI Task Suggestions | ✅ Ship | Week 1-2 | Manager requests, AI generates 5-7 tasks |
| Fallback Templates | ✅ Ship | Week 1-2 | If OpenAI fails, use templates |
| Redis Caching | ✅ Ship | Week 1-2 | 24h cache for OKRs, 1h for tasks |
| **Business Model** | | | |
| 16 Archetypes | ✅ Ship | Week 3-4 | Enum in Business model |
| Strategic Preferences | ✅ Ship | Week 3-4 | 24 focus areas, primary/secondary weight |
| Assessment: Speed/Strength/Intelligence | ✅ Ship | Week 3-4 | Already built, just test |
| Weighted Average Formula | ✅ Ship | Week 3-4 | No custom formulas for MVP |
| **Team Management** | | | |
| Invitation System | ✅ Ship | Week 3-4 | Email + token registration |
| Token-based Registration | ✅ Ship | Week 3-4 | Accept invite, create account |
| 5 Roles (permissions) | ✅ Ship | Week 5-6 | Super Admin, Company Admin, Manager, Employee, Consultant |
| Consultant Multi-Company | ✅ Ship | Week 5-6 | Simple company switcher (dropdown) |
| **User Interface** | | | |
| Owner Screens (5) | ✅ Ship | Week 5-6 | Signup, assessment, results, review OKRs, invite |
| Manager Screens (4) | ✅ Ship | Week 5-6 | Dashboard, planning, team, tasks |
| Employee Screens (3) | ✅ Ship | Week 5-6 | Dashboard (3 tasks), objectives, task detail |
| Consultant Screens (2) | ✅ Ship | Week 5-6 | Client list, company view |
| Registration Screen (1) | ✅ Ship | Week 5-6 | Token-based signup |
| **Testing & Deployment** | | | |
| Integration Testing | ✅ Ship | Week 7 | All flows end-to-end |
| Performance Optimization | ✅ Ship | Week 7 | <2s dashboard, <200ms API |
| Security Audit | ✅ Ship | Week 7 | Authorization, input validation |
| Production Deployment | ✅ Ship | Week 8 | AWS/GCP/Render + monitoring |
| Beta User Onboarding | ✅ Ship | Week 8 | 5 companies, 2 consultants |

---

## 🚀 SUCCESS METRICS

### **Technical**
- ✅ All 15 core screens functional
- ✅ OpenAI generates 4-6 objectives in <5 seconds
- ✅ Goals & Tasks APIs 100% operational
- ✅ 5 roles with correct permissions
- ✅ Docker Compose deployment works (one command)
- ✅ 99% uptime during beta period
- ✅ <2s dashboard load time (p90)
- ✅ <200ms API response time (p90)

### **User Experience**
- ✅ Owner onboarding: <30 minutes (signup → generate OKRs)
- ✅ Assessment completion rate: >80%
- ✅ Manager planning time: <20 minutes (assign goals + tasks)
- ✅ Employee clarity: 4.5/5 (understand why tasks matter)

### **Business**
- ✅ 5 beta companies onboarded
- ✅ 50+ active users (mix of roles)
- ✅ 25+ assessments completed
- ✅ 100+ OKRs generated via OpenAI
- ✅ 2+ consultants managing multiple companies
- ✅ Zero critical data loss incidents
- ✅ <5% user-reported bugs

---

## ❌ EXPLICITLY OUT OF SCOPE (DEFERRED TO BETA)

See `BETA_RELEASE_STRATEGY.md` for these features:

- ❌ 5 additional assessment templates
- ❌ Custom template builder
- ❌ Custom formula editor
- ❌ Template marketplace
- ❌ Sentiment & reflection system
- ❌ Health indicators dashboard
- ❌ Predictive analytics
- ❌ Task comments & discussions
- ❌ Real-time collaboration (WebSocket)
- ❌ Slack/Teams integrations
- ❌ Mobile apps (iOS/Android)
- ❌ Granular permissions (custom roles)
- ❌ Sub-teams and hierarchies
- ❌ Advanced consultant tools
- ❌ Custom domain + white-label
- ❌ AI coaching assistant
- ❌ Workflow automation builder
- ❌ Gantt charts
- ❌ Time tracking
- ❌ Advanced analytics dashboards

---

## 🎯 CRITICAL SUCCESS FACTORS

1. **Week 0 Must Complete**: Infrastructure fixes are prerequisite. Feature work does NOT start until deployment works.

2. **Shared Models Architecture**: This is the foundation. All engines must use `@karvia/shared-models` before any new features.

3. **OpenAI as Differentiator**: This is what makes Karvia unique. Must work reliably with fallback.

4. **Security Non-Negotiable**: No hard-coded secrets, all envs validated at startup, fail-fast if misconfigured.

5. **15 Screens, Not 22**: Stay focused. Every additional screen is scope creep.

6. **Beta Feedback Loop**: Beta users must provide weekly feedback. Adjust based on real usage.

---

## 📝 OPEN QUESTIONS (TO RESOLVE IN WEEK 0)

1. **iBrain Integration Boundary**: Are engines eventually moving to iBrain repo? If yes, shared-models package is critical.

2. **Frontend Stack**: MVP uses static HTML. Is React/Vite build planned? Document decision.

3. **Agent Pipeline**: Tracking engine has agent webhooks. Are these in scope for MVP? If not, feature flag them.

4. **Email Service**: Invitation emails need delivery. Use SendGrid, AWS SES, or similar? Configure in Week 0.

5. **Production Hosting**: AWS, GCP, or Render? Decide now for Week 8 deployment planning.

---

## 🔗 RELATED DOCUMENTS

- **Previous Version**: `MVP_STRATEGY_REVISED.md` (superseded by this document)
- **Beta Roadmap**: `BETA_RELEASE_STRATEGY.md` (post-MVP features)
- **Code Reviews**:
  - `Review Docs/mvpstrategy_review/critical_review.md`
  - `Review Docs/overall_strategy_review_and_risks/critical_overview.md`
- **Master Dev List**: `MASTER_KARVIA_BUSINESS_DEV_LIST.md` (will be updated to reflect this strategy)

---

**Document Owner**: Product & Engineering Team
**Last Updated**: October 1, 2025 (Final Version)
**Status**: ✅ LOCKED FOR IMPLEMENTATION - Nov 30, 2025 Launch
**Next Review**: After Week 0 completion (infrastructure validation)
