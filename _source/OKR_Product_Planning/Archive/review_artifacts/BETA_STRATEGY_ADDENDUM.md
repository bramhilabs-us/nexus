# 📋 BETA STRATEGY - CRITICAL ADDENDUM

**Version**: 2.1 (Addendum to BETA_STRATEGY_FINAL.md)
**Date**: October 1, 2025
**Purpose**: Address all critical review feedback for Beta Release

---

## 🚨 REVIEW FINDINGS & RESOLUTIONS

### **1. Contracts Repository Missing (Line 24 Review)**

**Issue**: BETA_STRATEGY_FINAL.md introduces event bus contracts but `docs/contracts/` doesn't exist.

**Resolution**: Complete contracts repository with tooling and automation.

---

#### **1.1 Contracts Directory Structure**

```bash
docs/contracts/
├── README.md                           # Contract documentation
├── package.json                        # For publishing to npm
├── schemas/                            # JSON Schemas (data models)
│   ├── v1/
│   │   ├── business.schema.json
│   │   ├── user.schema.json
│   │   ├── objective.schema.json
│   │   ├── goal.schema.json
│   │   ├── task.schema.json
│   │   ├── assessment.schema.json
│   │   └── invitation.schema.json
│   └── v2/                            # Future versions
├── events/                            # Event Schemas (messages)
│   ├── v1/
│   │   ├── objective.created.json
│   │   ├── objective.updated.json
│   │   ├── goal.completed.json
│   │   ├── task.assigned.json
│   │   ├── task.completed.json
│   │   ├── sentiment.recorded.json
│   │   └── assessment.completed.json
│   └── v2/
├── apis/                              # OpenAPI Specifications
│   ├── planner-api.v1.yaml
│   ├── tracking-api.v1.yaml
│   ├── scoring-api.v1.yaml
│   ├── assessment-api.v1.yaml
│   └── iam-api.v1.yaml
├── validators/                        # Schema validators
│   ├── index.js
│   └── ajv-config.js
├── generators/                        # Code generators
│   ├── typescript-types.js
│   ├── openapi-docs.js
│   └── test-fixtures.js
├── scripts/                          # Automation scripts
│   ├── validate-all.sh
│   ├── publish.sh
│   └── generate-docs.sh
└── tests/                            # Contract tests
    ├── schemas.test.js
    └── events.test.js
```

---

#### **1.2 Example JSON Schema**

```json
// docs/contracts/schemas/v1/goal.schema.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://contracts.karvia.com/schemas/v1/goal.schema.json",
  "title": "Goal",
  "description": "Weekly goal that contributes to a key result",
  "type": "object",
  "required": [
    "id",
    "objective_id",
    "key_result_id",
    "title",
    "week_number",
    "quarter",
    "assigned_to",
    "business_id",
    "due_date"
  ],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique goal identifier"
    },
    "objective_id": {
      "type": "string",
      "format": "uuid",
      "description": "Reference to parent objective"
    },
    "key_result_id": {
      "type": "string",
      "description": "Key result identifier within objective"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "Goal title"
    },
    "description": {
      "type": ["string", "null"],
      "maxLength": 1000,
      "description": "Detailed description"
    },
    "week_number": {
      "type": "integer",
      "minimum": 1,
      "maximum": 52,
      "description": "Week number (1-52)"
    },
    "quarter": {
      "type": "integer",
      "minimum": 1,
      "maximum": 4,
      "description": "Quarter (1-4)"
    },
    "status": {
      "type": "string",
      "enum": ["not_started", "in_progress", "completed", "at_risk", "blocked"],
      "default": "not_started",
      "description": "Current status"
    },
    "assigned_to": {
      "type": "string",
      "format": "uuid",
      "description": "User ID of assignee"
    },
    "business_id": {
      "type": "string",
      "format": "uuid",
      "description": "Business ID (tenant)"
    },
    "due_date": {
      "type": "string",
      "format": "date-time",
      "description": "Deadline"
    },
    "progress_percentage": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "default": 0,
      "description": "Completion percentage"
    },
    "created_by": {
      "type": "string",
      "format": "uuid",
      "description": "User ID of creator"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "Creation timestamp"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "description": "Last update timestamp"
    }
  },
  "additionalProperties": false
}
```

---

#### **1.3 Example Event Schema**

```json
// docs/contracts/events/v1/goal.completed.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://contracts.karvia.com/events/v1/goal.completed.json",
  "title": "GoalCompletedEvent",
  "description": "Event emitted when a goal is marked as completed",
  "type": "object",
  "required": ["event_id", "event_type", "timestamp", "version", "data"],
  "properties": {
    "event_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique event identifier"
    },
    "event_type": {
      "type": "string",
      "const": "goal.completed",
      "description": "Event type identifier"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Event timestamp (ISO 8601)"
    },
    "version": {
      "type": "string",
      "const": "v1",
      "description": "Event schema version"
    },
    "correlation_id": {
      "type": "string",
      "format": "uuid",
      "description": "Optional correlation ID for tracing"
    },
    "data": {
      "type": "object",
      "required": ["goal_id", "business_id", "assigned_to"],
      "properties": {
        "goal_id": {
          "type": "string",
          "format": "uuid",
          "description": "Completed goal ID"
        },
        "business_id": {
          "type": "string",
          "format": "uuid",
          "description": "Business ID (tenant)"
        },
        "assigned_to": {
          "type": "string",
          "format": "uuid",
          "description": "User who completed the goal"
        },
        "completion_date": {
          "type": "string",
          "format": "date-time",
          "description": "When goal was completed"
        },
        "notes": {
          "type": ["string", "null"],
          "maxLength": 1000,
          "description": "Completion notes"
        },
        "objective_id": {
          "type": "string",
          "format": "uuid",
          "description": "Parent objective ID"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

---

#### **1.4 Validation Tooling**

```javascript
// docs/contracts/validators/index.js

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

class ContractValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: true });
    addFormats(this.ajv);

    // Load all schemas
    this.loadSchemas();
  }

  loadSchemas() {
    const schemasDir = path.join(__dirname, '../schemas/v1');
    const files = fs.readdirSync(schemasDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const schemaPath = path.join(schemasDir, file);
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      this.ajv.addSchema(schema);
    }

    console.log(`✅ Loaded ${files.length} schemas`);
  }

  validateSchema(schemaId, data) {
    const validate = this.ajv.getSchema(schemaId);

    if (!validate) {
      throw new Error(`Schema not found: ${schemaId}`);
    }

    const valid = validate(data);

    return {
      valid,
      errors: validate.errors || []
    };
  }

  validateEvent(eventType, event) {
    const schemaId = `https://contracts.karvia.com/events/v1/${eventType}.json`;
    return this.validateSchema(schemaId, event);
  }
}

module.exports = new ContractValidator();
```

---

#### **1.5 Publishing to NPM**

```json
// docs/contracts/package.json
{
  "name": "@karvia/contracts",
  "version": "1.0.0",
  "description": "Shared data contracts for Karvia OKR platform",
  "main": "index.js",
  "files": [
    "schemas/**/*.json",
    "events/**/*.json",
    "apis/**/*.yaml",
    "validators/**/*.js"
  ],
  "scripts": {
    "validate": "node scripts/validate-all.js",
    "test": "jest",
    "prepublishOnly": "npm run validate && npm test",
    "version": "node scripts/generate-docs.js && git add -A",
    "postversion": "git push && git push --tags"
  },
  "keywords": ["contracts", "json-schema", "openapi", "karvia"],
  "license": "UNLICENSED",
  "publishConfig": {
    "access": "restricted"
  },
  "dependencies": {
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

```bash
# docs/contracts/scripts/publish.sh
#!/bin/bash

set -e

echo "📦 Publishing @karvia/contracts..."

# Validate all contracts
npm run validate

# Run tests
npm test

# Bump version
npm version patch -m "chore: release contracts v%s"

# Publish to npm
npm publish --access restricted

echo "✅ Published @karvia/contracts"
```

---

#### **1.6 Code Generation**

```javascript
// docs/contracts/generators/typescript-types.js

const fs = require('fs');
const path = require('path');
const { compile } = require('json-schema-to-typescript');

async function generateTypes() {
  const schemasDir = path.join(__dirname, '../schemas/v1');
  const outputDir = path.join(__dirname, '../generated/typescript');

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(schemasDir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const schemaPath = path.join(schemasDir, file);
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    const ts = await compile(schema, schema.title);

    const outputFile = path.join(outputDir, file.replace('.json', '.d.ts'));
    fs.writeFileSync(outputFile, ts);

    console.log(`✅ Generated ${file} → ${path.basename(outputFile)}`);
  }
}

generateTypes().catch(console.error);
```

**Output Example**:
```typescript
// generated/typescript/goal.d.ts
export interface Goal {
  id: string;
  objective_id: string;
  key_result_id: string;
  title: string;
  description?: string | null;
  week_number: number;
  quarter: number;
  status?: "not_started" | "in_progress" | "completed" | "at_risk" | "blocked";
  assigned_to: string;
  business_id: string;
  due_date: string;
  progress_percentage?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

---

#### **1.7 WEEK TASKS (Phase 0, Week 1-2)**

**Week 1: Schema Creation**
- [ ] Create `docs/contracts/` directory structure
- [ ] Define schemas for all v1 data models (7 schemas)
- [ ] Define event schemas (7 events)
- [ ] Set up validation tooling (Ajv)
- [ ] Write schema tests

**Week 2: API Contracts & Publishing**
- [ ] Define OpenAPI specs for 5 engines
- [ ] Set up TypeScript type generation
- [ ] Create publishing workflow
- [ ] Publish `@karvia/contracts@1.0.0` to npm
- [ ] Update engines to use contracts package

**Acceptance Criteria**:
- [ ] All schemas valid (JSON Schema Draft 07)
- [ ] All events validated against schemas
- [ ] TypeScript types generated
- [ ] Package published to npm
- [ ] Engines validate all events before publish

---

### **2. Data Migration Strategy (Line 122 Review)**

**Issue**: Beta assumes engines don't share databases, but no migration plan from MVP state.

**Resolution**: Comprehensive data migration and event backfill strategy.

---

#### **2.1 Current State (MVP)**

```
┌─────────────────────────────────────────┐
│         MongoDB (Shared)                │
├─────────────────────────────────────────┤
│  karvia_business (database)             │
│    ├── businesses                       │
│    ├── users                            │
│    ├── objectives                       │
│    ├── goals          (NEW in MVP)      │
│    ├── tasks          (NEW in MVP)      │
│    └── assessments                      │
└─────────────────────────────────────────┘
          ↑           ↑           ↑
    ┌─────┴─────┬─────┴─────┬─────┴─────┐
    │   IAM     │  Planner  │ Tracking  │
    │  Engine   │  Engine   │  Engine   │
    └───────────┴───────────┴───────────┘
   ALL ENGINES READ/WRITE SAME DATABASE
```

---

#### **2.2 Target State (Beta - Event-Driven)**

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  IAM Engine    │  │ Planner Engine │  │ Tracking Engine│
│  MongoDB: iam  │  │ MongoDB: plan  │  │ MongoDB: track │
└────────┬───────┘  └────────┬───────┘  └────────┬───────┘
         │                   │                    │
         └───────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   NATS Event    │
                    │      Bus        │
                    └─────────────────┘
```

**Key Changes**:
1. Each engine has its own database/schema
2. No direct cross-engine database access
3. Engines communicate via events
4. Data replicated where needed (via event subscriptions)

---

#### **2.3 Migration Plan (Phase 0, Week 3-4)**

**Step 1: Database Separation (Week 3)**

```javascript
// scripts/migrate-databases.js

const mongoose = require('mongoose');

async function separateDatabases() {
  // Connect to shared database
  const shared = await mongoose.createConnection(process.env.MONGODB_URI);

  // Create separate connections for each engine
  const iam = await mongoose.createConnection(process.env.MONGODB_URI.replace('karvia_business', 'karvia_iam'));
  const planner = await mongoose.createConnection(process.env.MONGODB_URI.replace('karvia_business', 'karvia_planner'));
  const tracking = await mongoose.createConnection(process.env.MONGODB_URI.replace('karvia_business', 'karvia_tracking'));

  console.log('🔄 Migrating data to separate databases...');

  // Migrate users to IAM database
  const users = await shared.collection('users').find({}).toArray();
  await iam.collection('users').insertMany(users);
  console.log(`✅ Migrated ${users.length} users to IAM database`);

  // Migrate objectives to Planner database
  const objectives = await shared.collection('objectives').find({}).toArray();
  await planner.collection('objectives').insertMany(objectives);
  console.log(`✅ Migrated ${objectives.length} objectives to Planner database`);

  // Migrate goals and tasks to Tracking database
  const goals = await shared.collection('goals').find({}).toArray();
  const tasks = await shared.collection('tasks').find({}).toArray();
  await tracking.collection('goals').insertMany(goals);
  await tracking.collection('tasks').insertMany(tasks);
  console.log(`✅ Migrated ${goals.length} goals and ${tasks.length} tasks to Tracking database`);

  // Create read replicas where needed (denormalization)
  // Example: Tracking engine needs user names for display
  const userReplicas = users.map(u => ({
    user_id: u._id,
    name: u.name,
    email: u.email,
    synced_at: new Date()
  }));
  await tracking.collection('user_replicas').insertMany(userReplicas);
  console.log(`✅ Created ${userReplicas.length} user replicas in Tracking database`);

  console.log('🎉 Database migration complete!');
}

separateDatabases().catch(console.error);
```

**Step 2: Event Backfill (Week 4)**

```javascript
// scripts/backfill-events.js

const { EventBus } = require('@karvia/engine-sdk');
const eventBus = new EventBus();

async function backfillEvents() {
  console.log('📋 Backfilling historical events...');

  const shared = await mongoose.createConnection(process.env.MONGODB_URI);

  // Backfill objective.created events
  const objectives = await shared.collection('objectives').find({}).sort({ created_at: 1 }).toArray();

  for (const obj of objectives) {
    await eventBus.publish('objective.created', {
      objective_id: obj._id.toString(),
      business_id: obj.business_id.toString(),
      title: obj.title,
      created_at: obj.created_at,
      created_by: obj.created_by.toString(),
      backfill: true // Flag as historical
    });
  }

  console.log(`✅ Backfilled ${objectives.length} objective.created events`);

  // Backfill goal.completed events
  const completedGoals = await shared.collection('goals').find({ status: 'completed' }).toArray();

  for (const goal of completedGoals) {
    await eventBus.publish('goal.completed', {
      goal_id: goal._id.toString(),
      business_id: goal.business_id.toString(),
      assigned_to: goal.assigned_to.toString(),
      completion_date: goal.updated_at,
      backfill: true
    });
  }

  console.log(`✅ Backfilled ${completedGoals.length} goal.completed events`);

  console.log('🎉 Event backfill complete!');
}

backfillEvents().catch(console.error);
```

**Step 3: Enable Event-Driven Mode (Gradual Rollout)**

```javascript
// engines/tracking/config/index.js

const config = {
  // Phase 0: MVP mode (direct DB access)
  dataAccessMode: process.env.DATA_ACCESS_MODE || 'direct', // direct, events, hybrid

  // Phase 1: Hybrid mode (DB + events)
  // Phase 2: Events only (no direct DB)
};

// engines/tracking/services/goal-service.js
class GoalService {
  async getGoal(goalId) {
    if (config.dataAccessMode === 'direct') {
      // MVP: Direct database access
      return await Goal.findById(goalId);
    } else if (config.dataAccessMode === 'events') {
      // Beta: API call to Planner engine
      const plannerClient = new EngineClient('planner');
      return await plannerClient.get(`/goals/${goalId}`);
    } else {
      // Hybrid: Try DB first, fallback to API
      const goal = await Goal.findById(goalId);
      if (!goal) {
        const plannerClient = new EngineClient('planner');
        return await plannerClient.get(`/goals/${goalId}`);
      }
      return goal;
    }
  }
}
```

---

#### **2.4 Migration Phases**

| Phase | Duration | Mode | Description |
|-------|----------|------|-------------|
| **MVP** | Nov 2025 | `direct` | All engines share database |
| **Phase 0** | Dec 2025 | `direct` | Set up NATS, contracts, SDK |
| **Phase 1** | Jan 2026 | `hybrid` | Dual writes (DB + events) |
| **Phase 2** | Feb 2026 | `events` | Events only, deprecate direct DB |
| **Phase 3** | Mar 2026 | `events` | Remove shared database access |

**Rollback Safety**: Each phase keeps previous mode as fallback.

---

#### **2.5 Data Consistency Checks**

```javascript
// scripts/validate-migration.js

async function validateMigration() {
  const errors = [];

  // Check 1: All users migrated
  const sharedUsers = await shared.collection('users').countDocuments();
  const iamUsers = await iam.collection('users').countDocuments();

  if (sharedUsers !== iamUsers) {
    errors.push(`User count mismatch: Shared=${sharedUsers}, IAM=${iamUsers}`);
  }

  // Check 2: All objectives migrated
  const sharedObjectives = await shared.collection('objectives').countDocuments();
  const plannerObjectives = await planner.collection('objectives').countDocuments();

  if (sharedObjectives !== plannerObjectives) {
    errors.push(`Objective count mismatch: Shared=${sharedObjectives}, Planner=${plannerObjectives}`);
  }

  // Check 3: No orphaned goals (all reference valid objectives)
  const goals = await tracking.collection('goals').find({}).toArray();
  const objectiveIds = new Set(await planner.collection('objectives').distinct('_id'));

  const orphanedGoals = goals.filter(g => !objectiveIds.has(g.objective_id.toString()));

  if (orphanedGoals.length > 0) {
    errors.push(`Found ${orphanedGoals.length} orphaned goals`);
  }

  if (errors.length === 0) {
    console.log('✅ Migration validation passed!');
  } else {
    console.error('❌ Migration validation failed:');
    errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
  }
}
```

**Acceptance Criteria**:
- [ ] Data counts match across databases
- [ ] No orphaned references
- [ ] Event backfill complete
- [ ] Hybrid mode functional
- [ ] Rollback tested

---

### **3. Engine SDK Audit (Line 200 Review)**

**Issue**: Engines not audited for features that bypass SDK (direct Mongoose usage).

**Resolution**: Comprehensive audit and refactoring plan.

---

#### **3.1 Audit Checklist**

```bash
#!/bin/bash
# scripts/audit-engine-sdk-compliance.sh

echo "🔍 Auditing engines for SDK compliance..."

# Find direct Mongoose usage
echo ""
echo "📊 Direct Mongoose usage:"
for engine in iam assessment planner scoring observer tracking; do
  echo ""
  echo "Engine: $engine"

  # Find .findById, .find, .create, .update patterns
  grep -r "\.find\|\.create\|\.update\|\.save()" "engines/$engine" --include="*.js" | wc -l
done

# Find direct model imports (should use @karvia/shared-models)
echo ""
echo "📊 Direct model imports (BAD):"
grep -r "require('../../server/models" engines/ --include="*.js" || echo "None found ✅"

# Find HTTP calls without EngineClient
echo ""
echo "📊 Direct HTTP calls (should use EngineClient):"
grep -r "fetch\|axios\|http.request" engines/ --include="*.js" --exclude-dir=node_modules | wc -l

# Find event publishes without EventBus
echo ""
echo "📊 Direct event publishes (should use EventBus):"
grep -r "nats.publish\|redis.publish" engines/ --include="*.js" | wc -l

echo ""
echo "✅ Audit complete. Review findings above."
```

---

#### **3.2 Refactoring Tracking Engine (Example)**

**BEFORE** (Direct Mongoose):
```javascript
// engines/tracking/services/task-service.js (MVP)

const Task = require('@karvia/shared-models').Task;
const Goal = require('@karvia/shared-models').Goal;

class TaskService {
  async completeTask(taskId, userId) {
    // Direct database access
    const task = await Task.findById(taskId);
    task.status = 'completed';
    task.completed_at = new Date();
    await task.save();

    // Update goal progress (direct access)
    const goal = await Goal.findById(task.goal_id);
    await goal.updateProgress();

    return task;
  }
}
```

**AFTER** (SDK-compliant):
```javascript
// engines/tracking/services/task-service.js (Beta)

const { EngineClient, EventBus, Logger } = require('@karvia/engine-sdk');

class TaskService {
  constructor() {
    this.plannerClient = new EngineClient('planner', process.env.PLANNER_ENGINE_URL);
    this.eventBus = new EventBus();
    this.logger = new Logger('tracking-engine');
  }

  async completeTask(taskId, userId) {
    // Fetch task (local database - Tracking owns tasks)
    const task = await Task.findById(taskId);
    task.status = 'completed';
    task.completed_at = new Date();
    await task.save();

    // Emit event (instead of directly updating goal)
    await this.eventBus.publish('task.completed', {
      task_id: taskId,
      goal_id: task.goal_id,
      business_id: task.business_id,
      assigned_to: userId,
      completion_date: task.completed_at
    });

    this.logger.info('Task completed', { taskId, userId });

    // Planner engine will subscribe to this event and update goal progress

    return task;
  }

  // Subscribe to events from other engines
  async initialize() {
    // Listen for goal.created events (from Planner)
    await this.eventBus.subscribe('goal.created', async (event) => {
      this.logger.info('Received goal.created event', { goalId: event.data.goal_id });

      // Create local goal replica if needed
      // (Tracking may need goal metadata for task context)
    });
  }
}
```

---

#### **3.3 Compliance Scorecard**

| Engine | Direct DB Access | SDK Compliant | Event-Driven | Refactor Needed |
|--------|------------------|---------------|--------------|-----------------|
| **IAM** | ✅ Owns users | ✅ Yes | N/A (root) | ❌ No |
| **Assessment** | ✅ Owns assessments | ⚠️ Partial | ⚠️ Partial | ✅ Yes (events) |
| **Planner** | ✅ Owns objectives | ⚠️ Partial | ⚠️ Partial | ✅ Yes (events) |
| **Scoring** | ❌ Reads objectives | ❌ No | ❌ No | ✅ YES (HIGH) |
| **Observer** | ❌ Reads all | ❌ No | ❌ No | ✅ YES (HIGH) |
| **Tracking** | ⚠️ Mixed | ⚠️ Partial | ❌ No | ✅ YES (CRITICAL) |

**Priority Refactoring**:
1. **Tracking Engine** (CRITICAL) - Most cross-engine dependencies
2. **Scoring Engine** (HIGH) - Reads from Planner, should use API
3. **Observer Engine** (HIGH) - Reads from all, should use events

---

#### **3.4 Refactoring Plan (Phase 0, Week 2-4)**

**Week 2: Audit & Plan**
- [ ] Run SDK compliance audit script
- [ ] Document all direct database accesses
- [ ] Identify which engine owns which data
- [ ] Create refactoring tickets per engine

**Week 3: Refactor Scoring & Observer**
- [ ] Scoring: Remove direct Objective access, use Planner API
- [ ] Observer: Subscribe to events instead of polling DB
- [ ] Test with hybrid mode (DB + API)

**Week 4: Refactor Tracking**
- [ ] Tracking: Emit events for task/goal changes
- [ ] Planner: Subscribe to task.completed events
- [ ] Test event-driven goal progress updates

**Acceptance Criteria**:
- [ ] No `require('../../server/models')` in engines
- [ ] All cross-engine reads use EngineClient
- [ ] All cross-engine writes use EventBus
- [ ] Audit script shows 100% SDK compliance

---

### **4. Optional Engines Default Behavior (Line 736 Review)**

**Issue**: Sentiment and optional engines treated as iBrain-managed defaults, but no default behavior when disabled.

**Resolution**: Dummy providers and graceful degradation.

---

#### **4.1 Feature Flag Matrix**

| Feature | Enabled | Disabled (Fallback) |
|---------|---------|---------------------|
| **Sentiment** | Real sentiment engine | Dummy provider (always returns 75/100) |
| **Predictive Analytics** | ML models | Rule-based fallback |
| **Collaboration (WebSocket)** | Real-time updates | Polling (30s refresh) |
| **Workflow Automation** | Event-driven workflows | Manual triggers only |

---

#### **4.2 Dummy Sentiment Provider**

```javascript
// engines/scoring/services/sentiment-service.js

const featureFlags = require('../../shared/feature-flags');

class SentimentService {
  constructor() {
    this.enabled = featureFlags.isEnabled('sentiment') || false;

    if (!this.enabled) {
      console.warn('⚠️  Sentiment analysis disabled - using dummy provider');
    }
  }

  async calculateSentiment(reflection) {
    if (!this.enabled) {
      // DUMMY PROVIDER: Return neutral sentiment
      return {
        score: 75,
        category: 'good',
        mode: 'dummy',
        message: 'Sentiment analysis disabled. Enable in admin settings.'
      };
    }

    // Real implementation
    // ... (from BETA_STRATEGY_FINAL.md Phase 2.1)
  }

  async aggregateTeamSentiment(teamMemberSentiments) {
    if (!this.enabled) {
      // DUMMY: Return neutral team sentiment
      return {
        team_average: 75,
        low_sentiment_count: 0,
        members_needing_support: [],
        category: 'good',
        mode: 'dummy'
      };
    }

    // Real implementation
  }
}

module.exports = new SentimentService();
```

---

#### **4.3 UI Degradation**

```html
<!-- client/pages/manager/dashboard.html -->

<section id="sentiment-section">
  <h2>Team Sentiment</h2>

  <div v-if="FEATURE_SENTIMENT_ENABLED">
    <!-- Real sentiment circles -->
    <SentimentCircle :score="teamSentiment.team_average" />

    <div v-if="teamSentiment.low_sentiment_count > 0" class="alert alert-warning">
      {{ teamSentiment.low_sentiment_count }} team members need support
    </div>
  </div>

  <div v-else class="feature-disabled">
    <p>📊 Sentiment analysis is not enabled.</p>
    <p>
      Sentiment tracking provides insights into team morale and burnout risk.
      <a href="/admin/integrations">Enable in settings</a>
    </p>
  </div>
</section>
```

---

#### **4.4 Acceptance Criteria**

- [ ] `FEATURE_SENTIMENT_ENABLED=false` → Dummy provider returns neutral scores
- [ ] UI shows "Feature disabled" message (not broken layout)
- [ ] No errors logged when feature disabled
- [ ] Admin can enable/disable via config (restart required)
- [ ] Documentation explains fallback behavior

---

### **5. AI Coach Ownership Resolution (Line 965 Review)**

**Issue**: AI coach left undecided (Option A vs B) - needs ownership resolution.

**Resolution**: Decision matrix and implementation path.

---

#### **5.1 Decision Matrix**

| Option | Owner | Deployment | Pros | Cons |
|--------|-------|------------|------|------|
| **A: Karvia-Managed** | Karvia platform | Inside main API or new engine | Full control, faster iteration | AI costs borne by Karvia |
| **B: iBrain-Managed** | iBrain service | External service, webhook integration | Lower Karvia costs, shared AI infra | Dependency on iBrain, harder debugging |
| **C: Hybrid** | Both | Core features in Karvia, advanced in iBrain | Best of both, graceful degradation | More complexity |

---

#### **5.2 RECOMMENDED: Option C (Hybrid)**

**Core AI Features (Karvia):**
- Task suggestions (OpenAI, already built)
- OKR generation (OpenAI, already built)
- Basic AI insights (template-based + simple OpenAI prompts)

**Advanced AI Features (iBrain):**
- AI coaching chat (multi-turn conversations, context retention)
- Predictive analytics (ML models, historical data)
- Workflow automation (complex rules engine)
- Sentiment analysis (NLP, pattern recognition)

**Boundary**:
```
IF OpenAI API call simple (single prompt/response)
  → Karvia handles (engines/planner/services/openai-service.js)

IF OpenAI requires state/memory/complex logic
  → iBrain handles (via webhook or API)
```

---

#### **5.3 Implementation**

```javascript
// server/services/ai-coach-service.js (Karvia - Basic)

class AICoachService {
  constructor() {
    this.ibrainEnabled = featureFlags.isEnabled('ibrain');
    this.openaiEnabled = featureFlags.isEnabled('openai');

    if (this.ibrainEnabled) {
      this.ibrainClient = new EngineClient('ibrain', process.env.IBRAIN_API_URL);
    } else if (this.openaiEnabled) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  async askQuestion(userId, question) {
    if (this.ibrainEnabled) {
      // Advanced: iBrain manages conversation state
      return await this.ibrainClient.post('/ai-coach/chat', {
        user_id: userId,
        question
      });
    } else if (this.openaiEnabled) {
      // Basic: Stateless OpenAI call
      const user = await User.findById(userId);
      const context = await this.buildContext(user);

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: `You are an AI coach helping ${user.name}. ${context}` },
          { role: 'user', content: question }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      return {
        answer: response.choices[0].message.content,
        mode: 'basic',
        message: 'For advanced coaching with conversation history, enable iBrain integration.'
      };
    } else {
      // Disabled: Return canned response
      return {
        answer: 'AI coaching is not enabled. Please contact your administrator.',
        mode: 'disabled'
      };
    }
  }

  async buildContext(user) {
    const objectives = await Objective.find({ assigned_to: user.id }).limit(3);
    return `User has ${objectives.length} active objectives.`;
  }
}
```

**UI (Feature Comparison)**:
```html
<section id="ai-coach">
  <h2>AI Coach</h2>

  <div v-if="FEATURE_IBRAIN_ENABLED">
    <p>✨ Advanced AI coaching with conversation history enabled</p>
    <ChatInterface :advanced="true" />
  </div>

  <div v-else-if="FEATURE_OPENAI_ENABLED">
    <p>💬 Basic AI coaching available (single-question mode)</p>
    <ChatInterface :advanced="false" />
    <p class="help-text">
      For multi-turn conversations and personalized coaching, enable iBrain integration.
    </p>
  </div>

  <div v-else>
    <p>🚫 AI coaching is not available. OpenAI or iBrain required.</p>
  </div>
</section>
```

**Acceptance Criteria**:
- [ ] Hybrid model documented (Karvia vs iBrain ownership)
- [ ] Basic AI coach works with OpenAI only
- [ ] Advanced AI coach requires iBrain
- [ ] Graceful degradation when both disabled
- [ ] Cost analysis documented (OpenAI API usage)

---

## 📋 UPDATED BETA TIMELINE

| Phase | Duration | Key Changes from Reviews |
|-------|----------|--------------------------|
| **Phase 0** | 4 weeks | + Contracts repo, data migration, SDK audit |
| **Phase 1** | 4 weeks | + Assessment templates (unchanged) |
| **Phase 2** | 4 weeks | + Sentiment with dummy provider fallback |
| **Phase 3** | 4 weeks | + Collaboration (unchanged) |
| **Phase 4** | 4 weeks | + Enterprise features (unchanged) |
| **Phase 5** | 4 weeks | + AI coach (hybrid model), workflows |

**Total**: Still 24 weeks (6 months), but Phase 0 now includes critical architecture work.

---

## ✅ BLOCKING ACCEPTANCE CRITERIA (PHASE 0 END)

1. **Contracts Repository**:
   - [ ] All schemas defined and published
   - [ ] Event schemas validated
   - [ ] `@karvia/contracts` package published
   - [ ] TypeScript types generated

2. **Data Migration**:
   - [ ] Database separation complete
   - [ ] Event backfill complete
   - [ ] Hybrid mode tested
   - [ ] Rollback plan validated

3. **SDK Compliance**:
   - [ ] All engines audited
   - [ ] Scoring & Observer refactored
   - [ ] Tracking engine event-driven
   - [ ] 100% SDK compliance

4. **Optional Features**:
   - [ ] Dummy providers implemented (sentiment, analytics)
   - [ ] UI graceful degradation tested
   - [ ] Feature flag documentation complete

5. **AI Ownership**:
   - [ ] Hybrid model decided (Karvia + iBrain)
   - [ ] Basic AI coach implemented (OpenAI)
   - [ ] iBrain integration points documented

**IF ANY CRITERION FAILS, PHASE 1 CANNOT START.**

---

## 🔗 RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| `BETA_STRATEGY_FINAL.md` | Main Beta implementation plan |
| `MVP_STRATEGY_ADDENDUM.md` | MVP review resolutions |
| `WEEK_0_MIGRATION_GUIDE.md` | Shared models migration |
| `STANDALONE_MODE_CONFIGURATION.md` | Feature flags and standalone mode |

---

**Document Owner**: Architecture & Engineering Leads
**Status**: BLOCKING PREREQUISITE FOR BETA PHASE 1
**Review Date**: End of Phase 0 (4 weeks post-MVP launch)
**Next Action**: Create contracts repository, execute data migration
