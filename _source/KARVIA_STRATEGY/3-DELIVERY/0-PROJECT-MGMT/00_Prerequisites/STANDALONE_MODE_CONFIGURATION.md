# 🔧 STANDALONE MODE CONFIGURATION

**Purpose**: Run Karvia OKR platform without external dependencies (OpenAI, Redis, NATS, iBrain)
**Use Cases**:
- On-premise deployments
- Air-gapped environments
- Cost-sensitive pilots
- Development/testing

---

## 🎯 ARCHITECTURE MODES

### **Mode 1: Full Stack (Default)**
All features enabled, requires external services.

```
┌─────────────────────────────────────────────────────────┐
│                  KARVIA PLATFORM                         │
├─────────────────────────────────────────────────────────┤
│  ✅ OpenAI (OKR generation, task suggestions)           │
│  ✅ Redis (caching, session storage)                    │
│  ✅ NATS (event bus for engine communication)           │
│  ✅ iBrain Agents (optional advanced features)          │
└─────────────────────────────────────────────────────────┘
```

### **Mode 2: Standalone (No External Services)**
Core OKR functionality only, no AI or caching.

```
┌─────────────────────────────────────────────────────────┐
│                  KARVIA PLATFORM                         │
├─────────────────────────────────────────────────────────┤
│  ❌ OpenAI → Template-based OKRs                        │
│  ❌ Redis → In-memory cache (restart = clear)           │
│  ❌ NATS → Direct HTTP calls between engines            │
│  ❌ iBrain → All agent features disabled                │
└─────────────────────────────────────────────────────────┘
```

### **Mode 3: Hybrid (Selective Services)**
Pick and choose based on environment.

```
┌─────────────────────────────────────────────────────────┐
│                  KARVIA PLATFORM                         │
├─────────────────────────────────────────────────────────┤
│  ✅ OpenAI (enabled)                                    │
│  ❌ Redis → In-memory cache                             │
│  ❌ NATS → HTTP fallback                                │
│  ❌ iBrain → Disabled                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 CONFIGURATION

### **Environment Variables**

```bash
# .env.standalone (example)

# ============================================
# STANDALONE MODE CONFIGURATION
# ============================================

# Core Settings
NODE_ENV=production
PORT=5000

# Database (REQUIRED - only MongoDB needed)
MONGODB_URI=mongodb://localhost:27017/karvia_business

# Authentication (REQUIRED)
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# ============================================
# FEATURE FLAGS (Set to 'false' for standalone)
# ============================================

# AI Features
FEATURE_OPENAI_ENABLED=false          # Disable AI OKR generation
OPENAI_API_KEY=                       [REDACTED] Leave empty

# Caching
FEATURE_REDIS_ENABLED=false           # Use in-memory cache
REDIS_URL=                            # Leave empty

# Event Bus
FEATURE_NATS_ENABLED=false            # Use HTTP calls
NATS_URL=                             # Leave empty

# iBrain Integration
FEATURE_IBRAIN_ENABLED=false          # Disable agent webhooks
IBRAIN_WEBHOOK_URL=                   # Leave empty

# Email (Optional - can use manual provisioning)
FEATURE_EMAIL_ENABLED=false           # Disable invitation emails
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# ============================================
# FALLBACK BEHAVIORS
# ============================================

# When OpenAI disabled, use:
OKR_GENERATION_MODE=template          # Options: template, manual

# When Redis disabled, use:
CACHE_MODE=memory                     # Options: memory, none

# When NATS disabled, use:
ENGINE_COMMUNICATION_MODE=http        # Options: http, direct

# When email disabled, use:
INVITATION_MODE=manual                # Options: manual, token

# ============================================
# ENGINE URLS (REQUIRED even in standalone)
# ============================================

IAM_ENGINE_URL=http://localhost:8081
ASSESSMENT_ENGINE_URL=http://localhost:8082
PLANNER_ENGINE_URL=http://localhost:8083
SCORING_ENGINE_URL=http://localhost:8084
OBSERVER_ENGINE_URL=http://localhost:8085
TRACKING_ENGINE_URL=http://localhost:8086
```

---

## 📦 DOCKER COMPOSE (STANDALONE)

```yaml
# docker-compose.standalone.yml
version: '3.8'

services:
  # Only MongoDB required
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

  # IAM Engine
  iam-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: iam
    ports:
      - "8081:8080"
    environment:
      MONGODB_URI: mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      FEATURE_REDIS_ENABLED: "false"
      FEATURE_NATS_ENABLED: "false"
    depends_on:
      mongodb:
        condition: service_healthy
    restart: unless-stopped

  # Assessment Engine
  assessment-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: assessment
    ports:
      - "8082:8080"
    environment:
      MONGODB_URI: mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin
      FEATURE_REDIS_ENABLED: "false"
    depends_on:
      mongodb:
        condition: service_healthy

  # Planner Engine (AI disabled)
  planner-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: planner
    ports:
      - "8083:8080"
    environment:
      MONGODB_URI: mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin
      FEATURE_OPENAI_ENABLED: "false"        # STANDALONE MODE
      FEATURE_REDIS_ENABLED: "false"
      OKR_GENERATION_MODE: "template"        # Use templates
    depends_on:
      mongodb:
        condition: service_healthy

  # Scoring Engine
  scoring-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: scoring
    ports:
      - "8084:8080"
    environment:
      MONGODB_URI: mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin
      FEATURE_NATS_ENABLED: "false"
      ENGINE_COMMUNICATION_MODE: "http"
      PLANNER_ENGINE_URL: "http://planner-engine:8080"
    depends_on:
      mongodb:
        condition: service_healthy

  # Observer Engine
  observer-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: observer
    ports:
      - "8085:8080"
    environment:
      MONGODB_URI: mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin
    depends_on:
      mongodb:
        condition: service_healthy

  # Tracking Engine (iBrain webhooks disabled)
  tracking-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: tracking
    ports:
      - "8086:8080"
    environment:
      MONGODB_URI: mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin
      FEATURE_IBRAIN_ENABLED: "false"        # STANDALONE MODE
      FEATURE_NATS_ENABLED: "false"
    depends_on:
      mongodb:
        condition: service_healthy

  # Main Server
  server:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://karvia:${MONGO_PASSWORD}@mongodb:27017/karvia_business?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      IAM_ENGINE_URL: http://iam-engine:8080
      ASSESSMENT_ENGINE_URL: http://assessment-engine:8080
      PLANNER_ENGINE_URL: http://planner-engine:8080
      SCORING_ENGINE_URL: http://scoring-engine:8080
      OBSERVER_ENGINE_URL: http://observer-engine:8080
      TRACKING_ENGINE_URL: http://tracking-engine:8080
      FEATURE_OPENAI_ENABLED: "false"
      FEATURE_REDIS_ENABLED: "false"
      FEATURE_EMAIL_ENABLED: "false"
      INVITATION_MODE: "manual"
    depends_on:
      - iam-engine
      - assessment-engine
      - planner-engine
      - scoring-engine
      - observer-engine
      - tracking-engine

volumes:
  mongo-data:

# NO Redis, NO NATS services in standalone mode
```

---

## 🛠️ CODE IMPLEMENTATION

### **Feature Flag Service**

```javascript
// server/services/feature-flags.js

class FeatureFlagService {
  constructor() {
    this.flags = {
      openai: process.env.FEATURE_OPENAI_ENABLED === 'true',
      redis: process.env.FEATURE_REDIS_ENABLED === 'true',
      nats: process.env.FEATURE_NATS_ENABLED === 'true',
      ibrain: process.env.FEATURE_IBRAIN_ENABLED === 'true',
      email: process.env.FEATURE_EMAIL_ENABLED === 'true'
    };

    this.validateConfig();
  }

  validateConfig() {
    // MongoDB is ALWAYS required
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }

    // JWT secrets ALWAYS required
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT_SECRET and JWT_REFRESH_SECRET are required');
    }

    // Warn about disabled features
    if (!this.flags.openai) {
      console.warn('⚠️  OpenAI disabled - using template-based OKRs');
    }

    if (!this.flags.redis) {
      console.warn('⚠️  Redis disabled - using in-memory cache (not persistent)');
    }

    if (!this.flags.nats) {
      console.warn('⚠️  NATS disabled - engines communicate via HTTP');
    }

    if (!this.flags.email) {
      console.warn('⚠️  Email disabled - use manual user provisioning');
    }

    console.log('✅ Feature flags loaded:', this.flags);
  }

  isEnabled(feature) {
    return this.flags[feature] === true;
  }

  isStandaloneMode() {
    // Standalone = none of the optional services enabled
    return !this.flags.openai && !this.flags.redis && !this.flags.nats && !this.flags.ibrain;
  }
}

module.exports = new FeatureFlagService();
```

### **Planner Engine: OpenAI with Fallback**

```javascript
// engines/planner/services/okr-generation-service.js

const featureFlags = require('../../shared/feature-flags'); // Or pass via env

class OKRGenerationService {
  constructor() {
    this.mode = process.env.OKR_GENERATION_MODE || 'template';
    this.openaiEnabled = featureFlags.isEnabled('openai');

    if (this.openaiEnabled) {
      this.openai = require('openai');
      this.openaiClient = new this.openai({ apiKey: process.env.OPENAI_API_KEY });
    } else {
      console.warn('🤖 OpenAI disabled - using template-based OKR generation');
    }
  }

  async generateObjectives(business, assessment) {
    if (this.openaiEnabled && this.mode === 'ai') {
      try {
        return await this.generateWithOpenAI(business, assessment);
      } catch (error) {
        console.error('OpenAI generation failed, falling back to templates:', error);
        return await this.generateWithTemplates(business, assessment);
      }
    } else {
      // Standalone mode: always use templates
      return await this.generateWithTemplates(business, assessment);
    }
  }

  async generateWithOpenAI(business, assessment) {
    // OpenAI implementation (existing code)
    const prompt = this.buildPrompt(business, assessment);

    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2500
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async generateWithTemplates(business, assessment) {
    // Template-based generation (STANDALONE MODE)
    const weakAreas = this.identifyWeakAreas(assessment);
    const templates = this.loadTemplates(business.archetype);

    // Select 4-6 templates based on assessment
    const objectives = [];

    for (const area of weakAreas.slice(0, 4)) {
      const template = templates.find(t => t.category === area.category);
      if (template) {
        objectives.push({
          title: template.title.replace('{{business_name}}', business.name),
          rationale: `${area.name} score is ${area.score}/100, indicating need for improvement`,
          focusArea: area.category,
          difficulty: area.score < 50 ? 'hard' : 'medium',
          estimatedEffort: '20%',
          keyResults: template.keyResults.map(kr => ({
            ...kr,
            baseline: area.score,
            target: Math.min(100, area.score + 20)
          }))
        });
      }
    }

    return { objectives };
  }

  loadTemplates(archetype) {
    // Load from JSON files
    const templatePath = `./templates/${archetype}.json`;
    try {
      return require(templatePath);
    } catch {
      // Fallback to generic templates
      return require('./templates/generic.json');
    }
  }

  identifyWeakAreas(assessment) {
    const areas = [
      { name: 'Speed', score: assessment.speed_score, category: 'operations_delivery' },
      { name: 'Strength', score: assessment.strength_score, category: 'team_culture' },
      { name: 'Intelligence', score: assessment.intelligence_score, category: 'product_innovation' }
    ];

    return areas.filter(a => a.score < 70).sort((a, b) => a.score - b.score);
  }
}

module.exports = new OKRGenerationService();
```

### **Cache Service: Redis with In-Memory Fallback**

```javascript
// server/services/cache-service.js

const featureFlags = require('./feature-flags');

class CacheService {
  constructor() {
    this.redisEnabled = featureFlags.isEnabled('redis');

    if (this.redisEnabled) {
      const Redis = require('ioredis');
      this.redis = new Redis(process.env.REDIS_URL);
      console.log('✅ Using Redis for caching');
    } else {
      // In-memory cache (Map)
      this.memoryCache = new Map();
      console.warn('⚠️  Using in-memory cache (not persistent across restarts)');
    }
  }

  async get(key) {
    if (this.redisEnabled) {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } else {
      // In-memory
      const cached = this.memoryCache.get(key);
      if (!cached) return null;

      // Check expiry
      if (cached.expiresAt && cached.expiresAt < Date.now()) {
        this.memoryCache.delete(key);
        return null;
      }

      return cached.value;
    }
  }

  async set(key, value, ttlSeconds) {
    if (this.redisEnabled) {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } else {
      // In-memory with expiry
      this.memoryCache.set(key, {
        value,
        expiresAt: ttlSeconds ? Date.now() + (ttlSeconds * 1000) : null
      });
    }
  }

  async delete(key) {
    if (this.redisEnabled) {
      await this.redis.del(key);
    } else {
      this.memoryCache.delete(key);
    }
  }

  async clear() {
    if (this.redisEnabled) {
      await this.redis.flushdb();
    } else {
      this.memoryCache.clear();
    }
  }
}

module.exports = new CacheService();
```

### **Tracking Engine: iBrain Webhooks with Bypass**

```javascript
// engines/tracking/services/AgentIntegrationService.js

const featureFlags = require('../../shared/feature-flags');

class AgentIntegrationService {
  constructor() {
    this.ibrainEnabled = featureFlags.isEnabled('ibrain');

    if (this.ibrainEnabled) {
      this.webhookUrl = process.env.IBRAIN_WEBHOOK_URL;
      console.log('✅ iBrain agent integration enabled');
    } else {
      console.warn('⚠️  iBrain integration disabled - agent webhooks bypassed');
    }
  }

  async sendTaskEvent(event) {
    if (!this.ibrainEnabled) {
      // STANDALONE MODE: No-op (or log locally)
      console.log('[STANDALONE] Task event (not sent to iBrain):', event);
      return { success: true, mode: 'standalone' };
    }

    // Full mode: Send webhook
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      return { success: true, mode: 'ibrain', response: await response.json() };
    } catch (error) {
      console.error('iBrain webhook failed:', error);
      return { success: false, error: error.message };
    }
  }

  async processAgentMessage(message) {
    if (!this.ibrainEnabled) {
      // STANDALONE MODE: Return empty (no agent available)
      return { success: false, reason: 'iBrain disabled in standalone mode' };
    }

    // Full mode: Process agent message
    // ... existing implementation
  }
}

module.exports = new AgentIntegrationService();
```

### **Invitation Service: Email with Manual Fallback**

```javascript
// engines/iam/services/invitation-service.js

const featureFlags = require('../../shared/feature-flags');
const { Invitation } = require('@karvia/shared-models');

class InvitationService {
  constructor() {
    this.emailEnabled = featureFlags.isEnabled('email');
    this.mode = process.env.INVITATION_MODE || 'manual';

    if (this.emailEnabled) {
      this.mailer = require('./mailer-service');
      console.log('✅ Email invitations enabled');
    } else {
      console.warn('⚠️  Email disabled - using manual provisioning mode');
    }
  }

  async createInvitation(inviterUserId, inviteeEmail, role, businessId) {
    const invitation = await Invitation.createInvitation(
      inviterUserId,
      inviteeEmail,
      role,
      businessId
    );

    if (this.emailEnabled && this.mode === 'email') {
      // Send email
      await this.mailer.sendInvitationEmail(invitation);
      console.log(`📧 Invitation email sent to ${inviteeEmail}`);
    } else {
      // Manual mode: Return token for manual sharing
      console.log(`📋 Manual invitation created for ${inviteeEmail}`);
      console.log(`   Token: ${invitation.token}`);
      console.log(`   Registration URL: ${process.env.APP_URL}/register?token=${invitation.token}`);
    }

    return invitation;
  }

  async createUserManually(email, name, password, role, businessId) {
    // STANDALONE MODE: Direct user creation (no invitation)
    const { User } = require('@karvia/shared-models');

    const user = await User.create({
      email,
      name,
      password, // Will be hashed by User model
      role,
      business_id: businessId
    });

    console.log(`✅ User created manually: ${email}`);
    return user;
  }
}

module.exports = new InvitationService();
```

---

## 🎛️ ADMIN UI: Feature Toggle Panel

```javascript
// client/pages/admin/settings.html (Admin Panel)

<section id="feature-flags">
  <h2>Feature Flags</h2>
  <p>Control optional platform features. Changes require server restart.</p>

  <div class="flag-item">
    <input type="checkbox" id="flag-openai" disabled checked="{{ FEATURE_OPENAI_ENABLED }}">
    <label for="flag-openai">
      <strong>OpenAI Integration</strong>
      <span class="status">{{ FEATURE_OPENAI_ENABLED ? 'Enabled' : 'Disabled (Template Mode)' }}</span>
    </label>
    <p class="description">AI-powered OKR generation and task suggestions. Requires OpenAI API key.</p>
  </div>

  <div class="flag-item">
    <input type="checkbox" id="flag-redis" disabled checked="{{ FEATURE_REDIS_ENABLED }}">
    <label for="flag-redis">
      <strong>Redis Caching</strong>
      <span class="status">{{ FEATURE_REDIS_ENABLED ? 'Enabled' : 'Disabled (In-Memory Cache)' }}</span>
    </label>
    <p class="description">Persistent caching for improved performance. In-memory cache clears on restart.</p>
  </div>

  <div class="flag-item">
    <input type="checkbox" id="flag-ibrain" disabled checked="{{ FEATURE_IBRAIN_ENABLED }}">
    <label for="flag-ibrain">
      <strong>iBrain Agent Integration</strong>
      <span class="status">{{ FEATURE_IBRAIN_ENABLED ? 'Enabled' : 'Disabled' }}</span>
    </label>
    <p class="description">Advanced AI agents for predictive analytics and automation. Requires iBrain service.</p>
  </div>

  <div class="flag-item">
    <input type="checkbox" id="flag-email" disabled checked="{{ FEATURE_EMAIL_ENABLED }}">
    <label for="flag-email">
      <strong>Email Invitations</strong>
      <span class="status">{{ FEATURE_EMAIL_ENABLED ? 'Enabled' : 'Disabled (Manual Provisioning)' }}</span>
    </label>
    <p class="description">Send invitation emails to team members. Manual mode provides registration tokens instead.</p>
  </div>

  <div class="alert alert-info">
    <strong>Current Mode:</strong> {{ isStandaloneMode() ? 'Standalone (No External Services)' : 'Full Stack' }}
  </div>

  <p><em>To modify feature flags, update your .env file and restart the server.</em></p>
</section>
```

---

## 📋 STARTUP SCRIPTS

```bash
#!/bin/bash
# scripts/start-standalone.sh

echo "🚀 Starting Karvia in STANDALONE mode..."

# Check if .env.standalone exists
if [ ! -f .env.standalone ]; then
  echo "❌ .env.standalone not found. Creating from template..."
  cp .env.standalone.example .env.standalone
  echo "✅ Edit .env.standalone and run again."
  exit 1
fi

# Load standalone env
export $(cat .env.standalone | xargs)

# Validate MongoDB is running
if ! nc -z localhost 27017; then
  echo "❌ MongoDB not running. Start it first:"
  echo "   docker run -d -p 27017:27017 --name karvia-mongo mongo:6"
  exit 1
fi

# Start services
echo "✅ MongoDB detected"
echo "✅ Feature flags: OpenAI=$FEATURE_OPENAI_ENABLED Redis=$FEATURE_REDIS_ENABLED"

docker-compose -f docker-compose.standalone.yml up -d

echo "🎉 Karvia started in STANDALONE mode"
echo "📊 Access dashboard: http://localhost:5000"
echo "⚙️  Mode: $([ "$FEATURE_OPENAI_ENABLED" = "false" ] && echo "Template-based OKRs" || echo "AI-powered")"
```

---

## ✅ ACCEPTANCE CRITERIA

### **Standalone Mode**
- [ ] Platform starts with only MongoDB (no Redis, NATS, OpenAI)
- [ ] OKR generation works (template-based)
- [ ] Caching works (in-memory)
- [ ] User provisioning works (manual tokens)
- [ ] All core features functional (objectives, goals, tasks)
- [ ] No errors in logs about missing services
- [ ] Admin UI shows feature flag status

### **Feature Flag Validation**
- [ ] `FEATURE_OPENAI_ENABLED=false` → Template-based OKRs
- [ ] `FEATURE_REDIS_ENABLED=false` → In-memory cache
- [ ] `FEATURE_IBRAIN_ENABLED=false` → No agent webhooks
- [ ] `FEATURE_EMAIL_ENABLED=false` → Manual user creation

### **Documentation**
- [ ] Standalone deployment guide created
- [ ] Feature flag reference documented
- [ ] Template OKR examples provided
- [ ] Manual user provisioning guide created

---

**Document Owner**: Engineering & DevOps
**Status**: IMPLEMENTATION REQUIRED
**Dependencies**: WEEK_0_MIGRATION_GUIDE.md (shared models)
**Estimated Effort**: 3 days (parallel with Week 0)
