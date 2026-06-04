# 🚨 SPRINT 2 PRODUCTION MIGRATION GUIDE

**CRITICAL**: This document contains ALL changes that MUST be applied to production
**Created**: November 13, 2025
**Sprint**: Sprint 2
**Test Database**: karvia_business_test ✅ TESTED
**Production Database**: karvia_business ⚠️ PENDING

---

## ⚠️ PRODUCTION MIGRATION CHECKLIST

### Before Production Deployment:

#### 1. Database Backup (MANDATORY)
```bash
# Create full backup of production database
mongodump --uri="mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business" --out=./backup_$(date +%Y%m%d_%H%M%S)
```

#### 2. Code Changes Required

##### A. Goal Model Schema Updates
**File**: `/server/models/Goal.js`
**Lines Added**: 29-50, 288-290

```javascript
// ADD THESE FIELDS AFTER line 27 (key_result_id field)

  // SPRINT 2: Parent-Child Relationship Fields (Added Nov 13, 2025)
  parent_goal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    index: true,
    default: null
  },

  // Child goals array (for quarterly goals that have weekly children)
  child_goal_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }],

  // Time period classification (QUARTERLY, WEEKLY, MONTHLY)
  time_period: {
    type: String,
    enum: ['QUARTERLY', 'WEEKLY', 'MONTHLY'],
    required: true,
    default: 'QUARTERLY',
    index: true
  },
```

##### B. Additional Indexes
**File**: `/server/models/Goal.js`
**Lines Added**: 288-290

```javascript
// ADD THESE INDEXES AFTER line 285

// SPRINT 2: Additional indexes for hierarchy and time periods
goalSchema.index({ parent_goal_id: 1, time_period: 1 });
goalSchema.index({ key_result_id: 1, time_period: 1 });
goalSchema.index({ company_id: 1, time_period: 1, quarter: 1 });
```

#### 3. Production Migration Script
**IMPORTANT**: Update the connection string to point to PRODUCTION

```javascript
// File: /server/migrations/sprint2-goal-migration-PRODUCTION.js
// ⚠️ THIS IS FOR PRODUCTION - USE WITH CAUTION

const mongoose = require('mongoose');
const Goal = require('../models/Goal');
const Objective = require('../models/Objective');

// PRODUCTION DATABASE URI
const PRODUCTION_URI = 'mongodb+srv://[REDACTED]:[REDACTED]@cluster0.lpzcrvy.mongodb.net/karvia_business?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=false';

async function migrateProduction() {
  console.log('🚨 PRODUCTION MIGRATION STARTING...');
  console.log('⚠️  THIS WILL MODIFY PRODUCTION DATA');

  // Safety confirmation
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    readline.question('Type "MIGRATE PRODUCTION" to continue: ', resolve);
  });

  if (answer !== 'MIGRATE PRODUCTION') {
    console.log('❌ Migration cancelled');
    process.exit(1);
  }

  try {
    // Connect to PRODUCTION
    await mongoose.connect(PRODUCTION_URI);
    console.log('✅ Connected to PRODUCTION database');

    // Count goals
    const totalGoals = await Goal.countDocuments();
    console.log(`📊 Found ${totalGoals} goals to migrate`);

    // Add new fields with defaults
    const updateResult = await Goal.updateMany(
      {
        $or: [
          { time_period: { $exists: false } },
          { parent_goal_id: { $exists: false } },
          { child_goal_ids: { $exists: false } }
        ]
      },
      {
        $set: {
          time_period: 'QUARTERLY',
          parent_goal_id: null,
          child_goal_ids: []
        }
      }
    );

    console.log(`✅ Updated ${updateResult.modifiedCount} goals`);

    // Create indexes
    const collection = mongoose.connection.collection('goals');
    await collection.createIndex({ parent_goal_id: 1, time_period: 1 });
    await collection.createIndex({ key_result_id: 1, time_period: 1 });
    await collection.createIndex({ company_id: 1, time_period: 1, quarter: 1 });
    console.log('✅ Created new indexes');

    console.log('✨ PRODUCTION MIGRATION COMPLETE');
  } catch (error) {
    console.error('❌ MIGRATION FAILED:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  migrateProduction();
}
```

---

## 📋 PRODUCTION DEPLOYMENT STEPS

### Step 1: Pre-Deployment (1 hour before)
```bash
# 1. Backup production database
mongodump --uri="mongodb+srv://..." --out=./backup_sprint2

# 2. Test backup restoration locally
mongorestore --uri="mongodb://localhost:27017/backup_test" ./backup_sprint2

# 3. Verify backup integrity
```

### Step 2: Code Deployment
```bash
# 1. Update Goal.js with new fields
git pull origin sprint2-changes

# 2. Deploy to production server
npm run deploy:production

# 3. Verify deployment
curl https://your-production-url/health
```

### Step 3: Database Migration
```bash
# 1. Run production migration
node server/migrations/sprint2-goal-migration-PRODUCTION.js

# 2. Verify migration
mongo mongodb+srv://... --eval "db.goals.findOne({time_period: {$exists: true}})"
```

### Step 4: Verification
```bash
# 1. Check new fields exist
mongo mongodb+srv://... --eval "db.goals.findOne()" | grep time_period

# 2. Check indexes created
mongo mongodb+srv://... --eval "db.goals.getIndexes()"

# 3. Test application
npm run test:production
```

---

## 🔄 ROLLBACK PLAN

If issues occur, follow these steps IMMEDIATELY:

### 1. Revert Code Changes
```bash
git revert HEAD
npm run deploy:production
```

### 2. Remove New Fields (if needed)
```javascript
// Emergency rollback script
await Goal.updateMany(
  {},
  {
    $unset: {
      time_period: "",
      parent_goal_id: "",
      child_goal_ids: ""
    }
  }
);
```

### 3. Restore from Backup (worst case)
```bash
mongorestore --uri="mongodb+srv://..." --drop ./backup_sprint2
```

---

## 📊 WHAT CHANGED - SUMMARY

### Database Schema Changes:
1. **Goal Model** - Added 3 new fields:
   - `parent_goal_id`: Links weekly goals to quarterly parents
   - `child_goal_ids`: Array of child goal references
   - `time_period`: Enum to classify goal type (QUARTERLY/WEEKLY/MONTHLY)

### New Indexes:
1. `{ parent_goal_id: 1, time_period: 1 }` - For hierarchy queries
2. `{ key_result_id: 1, time_period: 1 }` - For KR relationship queries
3. `{ company_id: 1, time_period: 1, quarter: 1 }` - For company goal queries

### Test Results:
- ✅ Schema changes tested on karvia_business_test
- ✅ Migration script tested
- ✅ Hierarchy queries working
- ✅ Parent-child relationships functional
- ✅ No breaking changes to existing APIs

---

## 🚦 GO/NO-GO CRITERIA

### ✅ GO if:
- Backup completed successfully
- Test environment shows no issues
- Less than 100 active users online
- Support team on standby

### ❌ NO-GO if:
- Backup fails or incomplete
- Any test failures
- Peak usage hours (9am-12pm, 2pm-5pm)
- Key team members unavailable

---

## 📞 EMERGENCY CONTACTS

- **Database Admin**: [Contact info]
- **DevOps Lead**: [Contact info]
- **Product Owner**: [Contact info]
- **On-Call Engineer**: [Contact info]

---

## 📝 SIGN-OFF

### Pre-Production Checklist:
- [ ] Database backup completed
- [ ] Code review approved
- [ ] Test environment validated
- [ ] Migration script tested
- [ ] Rollback plan reviewed
- [ ] Team notified

### Approval Required From:
- [ ] Tech Lead: _________________ Date: _______
- [ ] Database Admin: _____________ Date: _______
- [ ] Product Owner: ______________ Date: _______

---

## ⚠️ FINAL REMINDERS

1. **ALWAYS backup before migration**
2. **Run migration during low-traffic hours**
3. **Have rollback script ready**
4. **Monitor logs during migration**
5. **Test immediately after migration**
6. **Keep this document updated with any issues**

---

**Document Status**: READY FOR PRODUCTION
**Test Status**: ✅ PASSED on karvia_business_test
**Production Status**: ⚠️ PENDING DEPLOYMENT

*This document must be followed exactly during production deployment to ensure Sprint 2 changes are applied safely.*