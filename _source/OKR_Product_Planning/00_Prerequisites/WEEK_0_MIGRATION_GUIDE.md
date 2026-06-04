# 📦 WEEK 0: SHARED MODELS MIGRATION GUIDE

**Status**: BLOCKING PREREQUISITE FOR MVP
**Duration**: Week 0 (5 days)
**Owner**: Engineering Lead

---

## 🎯 OBJECTIVE

Migrate from direct `../../server/models` imports to a versioned `@karvia/shared-models` package, enabling:
1. Independent engine deployment
2. iBrain integration readiness
3. Schema version management
4. Reduced coupling

---

## 📋 MIGRATION STEPS

### **Day 1: Setup npm Workspaces**

#### **1.1 Initialize Workspaces**

```bash
# Root package.json
cd /path/to/karvia_business

# Update root package.json
```

```json
{
  "name": "karvia-business-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "engines/*",
    "server"
  ],
  "scripts": {
    "install:all": "npm install",
    "build:shared": "npm run build --workspace=@karvia/shared-models",
    "test:shared": "npm test --workspace=@karvia/shared-models"
  },
  "devDependencies": {
    "lerna": "^7.0.0"
  }
}
```

#### **1.2 Create Shared Models Package**

```bash
# Create package directory
mkdir -p packages/shared-models

# Initialize package
cd packages/shared-models
```

```json
// packages/shared-models/package.json
{
  "name": "@karvia/shared-models",
  "version": "1.0.0",
  "description": "Shared data models for Karvia Business OKR platform",
  "main": "index.js",
  "types": "index.d.ts",
  "scripts": {
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "mongoose": "^8.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  },
  "publishConfig": {
    "access": "restricted"
  }
}
```

#### **1.3 Directory Structure**

```bash
packages/shared-models/
├── package.json
├── index.js                  # Main entry point
├── models/
│   ├── Business.js
│   ├── User.js
│   ├── Objective.js
│   ├── Goal.js              # NEW
│   ├── Task.js              # NEW
│   ├── Assessment.js
│   ├── Invitation.js        # NEW
│   └── index.js
├── schemas/                 # JSON schemas for validation
│   ├── business.v1.json
│   ├── objective.v1.json
│   ├── goal.v1.json
│   └── task.v1.json
├── validators/              # Schema validators
│   └── index.js
└── README.md
```

---

### **Day 2: Migrate Models**

#### **2.1 Copy Models to Shared Package**

```bash
# Copy existing models
cp server/models/Business.js packages/shared-models/models/
cp server/models/User.js packages/shared-models/models/
cp server/models/Objective.js packages/shared-models/models/
cp server/models/Assessment.js packages/shared-models/models/

# Create new models
touch packages/shared-models/models/Goal.js
touch packages/shared-models/models/Task.js
touch packages/shared-models/models/Invitation.js
```

#### **2.2 Update Model Exports**

```javascript
// packages/shared-models/models/index.js
module.exports = {
  Business: require('./Business'),
  User: require('./User'),
  Objective: require('./Objective'),
  Goal: require('./Goal'),
  Task: require('./Task'),
  Assessment: require('./Assessment'),
  Invitation: require('./Invitation')
};
```

```javascript
// packages/shared-models/index.js (main entry)
const models = require('./models');
const schemas = require('./schemas');
const validators = require('./validators');

module.exports = {
  ...models,
  schemas,
  validators
};
```

#### **2.3 Add Goal Model** (NEW)

```javascript
// packages/shared-models/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  objective_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Objective',
    required: true,
    index: true
  },
  key_result_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  week_number: {
    type: Number,
    min: 1,
    max: 52,
    required: true,
    index: true
  },
  quarter: {
    type: Number,
    min: 1,
    max: 4,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'at_risk', 'blocked'],
    default: 'not_started',
    index: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  due_date: {
    type: Date,
    required: true,
    index: true
  },
  progress_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for common queries
goalSchema.index({ business_id: 1, assigned_to: 1, status: 1 });
goalSchema.index({ objective_id: 1, week_number: 1 });

// Methods
goalSchema.methods.updateProgress = async function() {
  const Task = mongoose.model('Task');
  const tasks = await Task.find({ goal_id: this._id });

  if (tasks.length === 0) return;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  this.progress_percentage = Math.round((completedTasks / tasks.length) * 100);

  if (this.progress_percentage === 100) {
    this.status = 'completed';
  } else if (this.progress_percentage > 0) {
    this.status = 'in_progress';
  }

  await this.save();
};

// Middleware
goalSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Goal', goalSchema);
```

#### **2.4 Add Task Model** (NEW)

```javascript
// packages/shared-models/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  description: {
    type: String,
    maxlength: 2000
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  due_date: {
    type: Date,
    required: true,
    index: true
  },
  estimated_hours: {
    type: Number,
    min: 0
  },
  actual_hours: {
    type: Number,
    min: 0,
    default: 0
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'completed', 'blocked'],
    default: 'todo',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  ai_generated: {
    type: Boolean,
    default: false
  },
  ai_suggestion_metadata: {
    prompt: String,
    confidence: Number,
    generated_at: Date
  },
  completion_notes: {
    type: String,
    maxlength: 1000
  },
  completed_at: {
    type: Date,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes
taskSchema.index({ business_id: 1, assigned_to: 1, status: 1 });
taskSchema.index({ goal_id: 1, status: 1 });
taskSchema.index({ assigned_to: 1, due_date: 1 });

// Methods
taskSchema.methods.markCompleted = async function(notes) {
  this.status = 'completed';
  this.completed_at = new Date();
  this.completion_notes = notes;
  await this.save();

  // Update parent goal progress
  const Goal = mongoose.model('Goal');
  const goal = await Goal.findById(this.goal_id);
  if (goal) await goal.updateProgress();
};

// Middleware
taskSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
```

#### **2.5 Add Invitation Model** (NEW)

```javascript
// packages/shared-models/models/Invitation.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const invitationSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  inviter_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitee_email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['company_admin', 'manager', 'employee', 'consultant'],
    required: true
  },
  business_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired', 'cancelled'],
    default: 'pending',
    index: true
  },
  expires_at: {
    type: Date,
    required: true,
    index: true
  },
  accepted_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Static methods
invitationSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

invitationSchema.statics.createInvitation = async function(inviterUserId, inviteeEmail, role, businessId) {
  const token = this.generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return this.create({
    token,
    inviter_user_id: inviterUserId,
    invitee_email: inviteeEmail,
    role,
    business_id: businessId,
    expires_at: expiresAt
  });
};

// Instance methods
invitationSchema.methods.isExpired = function() {
  return this.expires_at < new Date() || this.status === 'expired';
};

module.exports = mongoose.model('Invitation', invitationSchema);
```

---

### **Day 3: Update Engine Dependencies**

#### **3.1 Update Engine package.json Files**

```bash
# For each engine
for engine in iam assessment planner scoring observer tracking; do
  cd engines/$engine

  # Add shared-models dependency
  npm install --save @karvia/shared-models@file:../../packages/shared-models

  cd ../..
done
```

```json
// engines/iam/package.json (example)
{
  "name": "karvia-iam-engine",
  "version": "1.0.0",
  "dependencies": {
    "@karvia/shared-models": "file:../../packages/shared-models",
    "express": "^4.18.0",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.0"
  }
}
```

#### **3.2 Update Engine Imports**

**BEFORE** (BAD):
```javascript
// engines/iam/index.js
const User = require('../../server/models/User');
const Business = require('../../server/models/Business');
```

**AFTER** (GOOD):
```javascript
// engines/iam/index.js
const { User, Business } = require('@karvia/shared-models');
```

#### **3.3 Migration Script**

```bash
#!/bin/bash
# scripts/migrate-engine-imports.sh

echo "🔄 Migrating engine imports to @karvia/shared-models..."

# List of engines
engines=("iam" "assessment" "planner" "scoring" "observer" "tracking")

for engine in "${engines[@]}"; do
  echo "Processing engine: $engine"

  # Find all .js files
  find "engines/$engine" -name "*.js" -type f | while read file; do
    # Replace imports
    sed -i.bak "s|require('../../server/models/User')|require('@karvia/shared-models').User|g" "$file"
    sed -i.bak "s|require('../../server/models/Business')|require('@karvia/shared-models').Business|g" "$file"
    sed -i.bak "s|require('../../server/models/Objective')|require('@karvia/shared-models').Objective|g" "$file"
    sed -i.bak "s|require('../../server/models/Assessment')|require('@karvia/shared-models').Assessment|g" "$file"

    # Remove backup files
    rm -f "$file.bak"
  done

  echo "✅ Engine $engine migrated"
done

echo "🎉 All engines migrated!"
```

---

### **Day 4: Update Main Server**

#### **4.1 Update Server package.json**

```json
// server/package.json
{
  "name": "karvia-business-server",
  "version": "1.0.0",
  "dependencies": {
    "@karvia/shared-models": "file:../packages/shared-models",
    "express": "^4.18.0",
    "mongoose": "^8.0.0"
  }
}
```

#### **4.2 Update Server Routes**

```javascript
// server/routes/objectives.js
const { Objective, Goal } = require('@karvia/shared-models');

// Before: const Objective = require('../models/Objective');
```

#### **4.3 Remove Old Models Directory** (After verification)

```bash
# ONLY after all tests pass
# mv server/models server/models.backup

# After 1 week of successful operation
# rm -rf server/models.backup
```

---

### **Day 5: Docker & CI Updates**

#### **5.1 Update Dockerfile.engines**

```dockerfile
# Dockerfile.engines
FROM node:18-alpine

WORKDIR /app

# Copy shared models FIRST
COPY packages/shared-models ./packages/shared-models
WORKDIR /app/packages/shared-models
RUN npm ci --production

# Now copy engine
WORKDIR /app
ARG ENGINE_NAME
COPY engines/${ENGINE_NAME}/package*.json ./
RUN npm ci --production

COPY engines/${ENGINE_NAME} ./

EXPOSE 8080
CMD ["node", "index.js"]
```

#### **5.2 Update docker-compose.yml**

```yaml
version: '3.8'

services:
  iam-engine:
    build:
      context: .
      dockerfile: Dockerfile.engines
      args:
        ENGINE_NAME: iam
    volumes:
      # For development (hot reload)
      - ./packages/shared-models:/app/packages/shared-models:ro
      - ./engines/iam:/app:ro
    environment:
      NODE_ENV: ${NODE_ENV:-development}
```

#### **5.3 CI/CD Pipeline Updates**

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies (workspaces)
        run: npm install

      - name: Test shared models
        run: npm test --workspace=@karvia/shared-models

      - name: Test engines
        run: |
          for engine in iam assessment planner scoring observer tracking; do
            npm test --workspace=engines/$engine
          done

      - name: Test server
        run: npm test --workspace=server
```

---

## ✅ ACCEPTANCE CRITERIA

### **Day 1-2: Package Setup**
- [ ] `packages/shared-models` created with correct structure
- [ ] All models copied and indexed in `index.js`
- [ ] Goal, Task, Invitation models implemented
- [ ] Root `package.json` configured for workspaces

### **Day 3: Engine Migration**
- [ ] All engines updated to use `@karvia/shared-models`
- [ ] No `require('../../server/models/*')` imports remain
- [ ] All engines install and build successfully

### **Day 4: Server Migration**
- [ ] Server routes updated to use shared models
- [ ] Old `server/models` directory backed up (not deleted yet)
- [ ] All API endpoints tested and functional

### **Day 5: Deployment**
- [ ] Docker builds succeed for all engines
- [ ] `docker-compose up` starts all services
- [ ] CI/CD pipeline passes all tests
- [ ] Documentation updated

### **Week 0 End: Validation**
- [ ] Run full integration test suite
- [ ] No direct model imports between repos
- [ ] Engines can be built independently
- [ ] Versioning strategy documented

---

## 🚨 ROLLBACK PLAN

If migration fails:

```bash
# Revert git changes
git checkout main

# Or restore from backup
mv server/models.backup server/models

# Restore engine imports
git restore engines/*/index.js

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

---

## 📊 VALIDATION TESTS

```bash
# Test 1: Shared models install correctly
cd packages/shared-models
npm test

# Test 2: Engines use shared models
cd engines/iam
npm list @karvia/shared-models  # Should show local link

# Test 3: No old imports remain
grep -r "require('../../server/models" engines/  # Should be empty

# Test 4: Docker builds
docker-compose build

# Test 5: Integration tests
npm run test:integration
```

---

## 📝 VERSIONING STRATEGY

```json
// packages/shared-models/package.json
{
  "version": "1.0.0",  // Initial release
  "version": "1.1.0",  // Added Goal, Task models (backward compatible)
  "version": "2.0.0"   // Breaking schema changes (major version)
}
```

**Semver Rules**:
- **Patch (1.0.x)**: Bug fixes, no schema changes
- **Minor (1.x.0)**: New models added, backward compatible
- **Major (x.0.0)**: Breaking changes (field renames, deletions)

---

## 🔄 FUTURE: NPM REGISTRY PUBLISHING

After Week 0 validation:

```bash
# Publish to private npm registry (or GitHub packages)
cd packages/shared-models
npm version 1.0.0
npm publish --access restricted

# Engines then install via:
npm install @karvia/shared-models@^1.0.0
```

---

**Document Owner**: Engineering Lead
**Status**: BLOCKING - Must complete before Week 1
**Estimated Effort**: 5 days (1 full week)
**Dependencies**: None (start immediately)
