# 🗄️ SPRINT 2 DATABASE SETUP & MIGRATION PLAN

**Created**: November 13, 2025
**Sprint**: Sprint 2 Development
**Database**: karvia_business_test (TEST ENVIRONMENT)

---

## ⚠️ CRITICAL INFORMATION

### Test Database Configuration
- **Test DB Name**: `karvia_business_test`
- **Production DB Name**: `karvia_business`
- **Purpose**: Safe testing environment for Sprint 2 changes
- **Strategy**: Copy production data → Apply migrations → Test thoroughly

### Production Migration Required
When Sprint 2 is ready for production:
1. The same migrations MUST be applied to `karvia_business` database
2. Production deployment requires database schema update
3. Backup production database before migration

---

## 📋 DATABASE SETUP STEPS

### Step 1: Database Configuration
```bash
# Test Environment (.env.test or .env)
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.cqbo5.mongodb.net/karvia_business_test?retryWrites=true&w=majority&appName=Cluster0

# Production Environment (.env.production)
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.cqbo5.mongodb.net/karvia_business?retryWrites=true&w=majority&appName=Cluster0
```

### Step 2: Data Copy Script
```javascript
// File: /server/scripts/copy-database.js
const { MongoClient } = require('mongodb');

async function copyDatabase() {
  const sourceUri = 'mongodb+srv://[REDACTED]:[REDACTED]@cluster0.cqbo5.mongodb.net/karvia_business';
  const targetUri = 'mongodb+srv://[REDACTED]:[REDACTED]@cluster0.cqbo5.mongodb.net/karvia_business_test';

  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    await sourceClient.connect();
    await targetClient.connect();

    const sourceDb = sourceClient.db('karvia_business');
    const targetDb = targetClient.db('karvia_business_test');

    // Get all collections
    const collections = await sourceDb.collections();

    for (const collection of collections) {
      const collName = collection.collectionName;
      console.log(`Copying collection: ${collName}`);

      // Get all documents
      const documents = await collection.find({}).toArray();

      if (documents.length > 0) {
        // Drop existing collection in target
        try {
          await targetDb.collection(collName).drop();
        } catch (e) {
          // Collection might not exist
        }

        // Insert documents
        await targetDb.collection(collName).insertMany(documents);
        console.log(`✓ Copied ${documents.length} documents to ${collName}`);
      }
    }

    console.log('✅ Database copy complete!');
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

copyDatabase().catch(console.error);
```

---

## 🔧 SCHEMA CHANGES FOR SPRINT 2

### Goal Model Updates
**File**: `/server/models/Goal.js`

#### Fields to Add:
```javascript
// 1. Parent-Child Relationship
parent_goal_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal',
  index: true,
  default: null
},

// 2. Child Goals Array
child_goal_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal'
}],

// 3. Time Period Classification
time_period: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY', 'MONTHLY'],
  required: true,
  default: 'QUARTERLY',
  index: true
},

// Note: key_result_id already exists in the model (line 24-27)
// We just need to make it required for Sprint 2 goals
```

### Migration Script
```javascript
// File: /server/migrations/sprint2-goal-migration.js
const mongoose = require('mongoose');
const Goal = require('../models/Goal');

async function migrateGoals() {
  console.log('Starting Sprint 2 Goal migration...');

  // Connect to TEST database
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. Add time_period to existing goals
  const result1 = await Goal.updateMany(
    { time_period: { $exists: false } },
    {
      $set: {
        time_period: 'QUARTERLY',
        parent_goal_id: null,
        child_goal_ids: []
      }
    }
  );
  console.log(`✓ Updated ${result1.modifiedCount} goals with time_period`);

  // 2. Set key_result_id for goals that have objectives
  const goalsWithObjectives = await Goal.find({
    objective_id: { $exists: true },
    key_result_id: { $exists: false }
  }).populate('objective_id');

  let updated = 0;
  for (const goal of goalsWithObjectives) {
    if (goal.objective_id && goal.objective_id.key_results && goal.objective_id.key_results[0]) {
      goal.key_result_id = goal.objective_id.key_results[0]._id;
      await goal.save();
      updated++;
    }
  }
  console.log(`✓ Updated ${updated} goals with key_result_id`);

  // 3. Create indexes
  await Goal.collection.createIndex({ parent_goal_id: 1, time_period: 1 });
  await Goal.collection.createIndex({ time_period: 1, quarter: 1 });
  console.log('✓ Created new indexes');

  console.log('✅ Migration complete!');
  process.exit(0);
}

migrateGoals().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

---

## 📊 DATABASE STATE TRACKING

### Before Migration (Current State)
- Goal documents: Missing parent_goal_id, child_goal_ids, time_period
- Indexes: Standard indexes only
- Collections: All existing collections intact

### After Migration (Sprint 2 State)
- Goal documents: Have hierarchy fields
- New indexes: parent_goal_id, time_period
- Collections: Same collections with enhanced Goal schema

---

## 🚀 DEPLOYMENT CHECKLIST

### Development (Now)
- [ ] Create karvia_business_test database ✅
- [ ] Copy data from karvia_business to karvia_business_test
- [ ] Update .env to use test database
- [ ] Apply Goal model changes
- [ ] Run migration script
- [ ] Test thoroughly

### Production (Later)
- [ ] Backup karvia_business database
- [ ] Apply Goal model changes to production code
- [ ] Run migration script on karvia_business
- [ ] Update production .env (no change needed)
- [ ] Deploy updated code
- [ ] Verify migration success

---

## 🔄 ENVIRONMENT SWITCHING

### For Development/Testing
```bash
# .env file
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.cqbo5.mongodb.net/karvia_business_test?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development
```

### For Production
```bash
# .env.production file
MONGODB_URI=mongodb+srv://[REDACTED]:[REDACTED]@cluster0.cqbo5.mongodb.net/karvia_business?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
```

---

## 🔍 VERIFICATION QUERIES

### Check Migration Status
```javascript
// In MongoDB shell or script
db.goals.findOne({ time_period: { $exists: true } })
db.goals.findOne({ parent_goal_id: { $exists: true } })
db.goals.getIndexes() // Should show new indexes
```

### Rollback Plan
If migration fails:
1. Drop karvia_business_test database
2. Re-copy from karvia_business
3. Fix migration script
4. Retry

---

## ⚠️ IMPORTANT NOTES

1. **NEVER run migrations on production without backup**
2. **Test database is for Sprint 2 development ONLY**
3. **All successful changes must be documented for production migration**
4. **Keep this document updated with any schema changes**

---

## 📝 MIGRATION LOG

| Date | Action | Database | Status |
|------|--------|----------|--------|
| Nov 13, 2025 | Created test database | karvia_business_test | ✅ |
| Nov 13, 2025 | Data copy | karvia_business → test | Pending |
| Nov 13, 2025 | Goal schema update | test | Pending |
| Nov 13, 2025 | Migration script | test | Pending |
| TBD | Production migration | karvia_business | Future |

---

**Remember**: Every change made to karvia_business_test must be replicated to karvia_business during production deployment!