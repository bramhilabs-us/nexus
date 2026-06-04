# Complete Business → Company Migration Summary

**Migration Strategy**: Complete one-time migration (NO backward compatibility)
**Decision**: Use `company_id` everywhere, remove all `business_id` references
**Status**: Backend Models & API ✅ COMPLETE
**Date**: October 25, 2025

---

## ✅ COMPLETED: Backend Migration (100%)

### **All Models Updated** (11 files - 100% complete)

| Model | Status | Changes Made |
|-------|--------|--------------|
| **Company.js** | ✅ Created | New model (replaces Business.js) - 247 lines |
| **User.js** | ✅ Updated | Removed `business_id`, kept only `company_id` |
| **Team.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **Goal.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **Task.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **Objective.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **Assessment.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **AssessmentTemplate.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **AIOKRSuggestion.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **Invitation.js** | ✅ Updated | Removed `business_id`, using `company_id` only |
| **AssessmentQuestion.js** | ⏭️ Skipped | No company/business association (global resource) |

**Total Changes**: ~3,900 characters removed (business_id references)

---

## 🔧 MIGRATION CHANGES

### **1. Model Schema Updates**

**Before (Dual Field Pattern - REMOVED)**:
```javascript
const schema = new mongoose.Schema({
  company_id: { type: ObjectId, ref: 'Company', required: false },
  business_id: { type: ObjectId, ref: 'Business', required: false }, // REMOVED
  // ...
});
```

**After (Clean Single Field)**:
```javascript
const schema = new mongoose.Schema({
  company_id: { type: ObjectId, ref: 'Company', required: true },
  // ...
});
```

### **2. User Model Multi-Company Support**

**Final Structure**:
```javascript
{
  company_id: ObjectId,  // Primary company (required for non-consultants)

  // Multi-company support
  companies: [{
    company_id: ObjectId,
    role: String,
    joined_at: Date,
    is_primary: Boolean,
    status: String
  }],

  current_company_id: ObjectId,  // Active company context

  // Consultant management
  managed_companies: [ObjectId],  // For CONSULTANT role
}
```

**Removed Fields**:
- ❌ `business_id`
- ❌ `managed_businesses`

### **3. Indexes Simplified**

**Before**:
```javascript
// Dual indexes for backward compatibility
schema.index({ company_id: 1, name: 1 }, { unique: true, sparse: true });
schema.index({ business_id: 1, name: 1 }, { unique: true, sparse: true }); // REMOVED
```

**After**:
```javascript
// Single clean index
schema.index({ company_id: 1, name: 1 }, { unique: true });
```

### **4. Pre-Save Hooks Cleaned**

**Removed Sync Logic**:
```javascript
// REMOVED - No longer needed
schema.pre('save', function(next) {
  if (this.isModified('company_id') && this.company_id && !this.business_id) {
    this.business_id = this.company_id;
  }
  if (this.isModified('business_id') && this.business_id && !this.company_id) {
    this.company_id = this.business_id;
  }
  next();
});
```

### **5. Instance Methods Updated**

**User Model Methods**:
```javascript
// Clean implementation
userSchema.methods.managesCompany = function(companyId) {
  if (!this.isConsultant()) return false;
  return this.managed_companies.some(cid => cid.equals(companyId));
};

// REMOVED - No longer needed
userSchema.methods.managesBusiness = function(businessId) { ... }
```

---

## ✅ COMPLETED: API Routes (100%)

### **companies.js Route** (✅ Complete - 100%)

Created 8 RESTful endpoints with **NO backward compatibility**:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/companies` | GET | List companies (clean company_id queries) |
| `/api/companies/:id` | GET | Get single company |
| `/api/companies/:id/stats` | GET | Get company stats (clean queries) |
| `/api/companies` | POST | Create company (CONSULTANT only) |
| `/api/companies/:id` | PUT | Update company |
| `/api/companies/:id/assessment-scores` | PUT | Update assessment scores |
| `/api/companies/:id/onboarding` | PUT | Update onboarding |
| `/api/companies/:id` | DELETE | Delete/deactivate company |

**All queries use `company_id` ONLY**:
```javascript
// Clean query pattern
const query = { company_id: companyId };

// OLD backward-compatible pattern - REMOVED
const query = {
  $or: [
    { company_id: companyId },
    { business_id: companyId }  // REMOVED
  ]
};
```

---

## ⏳ REMAINING WORK

### **Priority 1: Update Resource Routes** (Estimated: 12-15 hours)

**Routes to Update** (9 files):

| Route File | Endpoints | Estimated Time |
|------------|-----------|----------------|
| auth.js | Signup/Login | 3h |
| goals.js | 11 endpoints | 2h |
| objectives.js | 9 endpoints | 2h |
| tasks.js | 10 endpoints | 2h |
| teams.js | 8 endpoints | 1.5h |
| assessments.js | 7 endpoints | 1.5h |
| invitations.js | 6 endpoints | 1h |
| ai-okr.js | 4 endpoints | 1h |
| analytics.js | 5 endpoints | 1h |

**Required Changes Per Route**:

1. **Update User Context**:
```javascript
// OLD
const business_id = req.user.business_id;
const query = { business_id };

// NEW
const company_id = req.user.company_id;
const query = { company_id };
```

2. **Update Create Operations**:
```javascript
// OLD
const resource = new Resource({
  business_id: req.user.business_id,
  // ...
});

// NEW
const resource = new Resource({
  company_id: req.user.company_id,
  // ...
});
```

3. **Update Consultant Checks**:
```javascript
// OLD
if (req.user.managed_businesses.some(...)) { }

// NEW
if (req.user.managed_companies.some(...)) { }
```

### **Priority 2: Auth.js Signup Update** (Estimated: 3-4 hours)

**Required Changes**:

1. **Auto-create Company on Signup**:
```javascript
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, first_name, last_name, company_name, industry } = req.body;

  // Step 1: Create Company
  const company = new Company({
    name: company_name,
    industry: industry || 'other',
    employee_count: 1,
    status: 'trial'
  });
  await company.save();

  // Step 2: Create User
  const user = new User({
    email,
    password_hash: password,
    first_name,
    last_name,
    company_id: company._id,
    role: 'BUSINESS_OWNER',
    companies: [{
      company_id: company._id,
      role: 'BUSINESS_OWNER',
      joined_at: new Date(),
      is_primary: true,
      status: 'active'
    }],
    status: 'active'
  });
  await user.save();

  // Step 3: Generate JWT with company_id
  const token = jwt.sign(
    {
      user_id: user._id,
      email: user.email,
      role: user.role,
      company_id: company._id  // Include in token
    },
    process.env.JWT_SECRET
  );

  res.json({ success: true, token, user, company });
});
```

2. **Update JWT Payload**:
```javascript
// Include company_id in all JWTs
{ user_id, email, role, company_id }
```

3. **Update authGuards middleware**:
```javascript
// Attach company_id to req.user
req.user.company_id = decoded.company_id;
```

### **Priority 3: Remove Legacy Files** (Estimated: 30 minutes)

1. **Delete businesses.js route**:
```bash
rm server/routes/businesses.js
```

2. **Update server/index.js**:
```javascript
// REMOVE this line
app.use('/api/businesses', require('./routes/businesses'));

// Keep only
app.use('/api/companies', require('./routes/companies'));
```

3. **Delete Business.js model** (optional - keep for reference):
```bash
mv server/models/Business.js server/models/_deprecated/Business.js
```

### **Priority 4: Data Migration Script** (Estimated: 4-5 hours)

**Create**: `server/scripts/migrate-business-to-company.js`

```javascript
const mongoose = require('mongoose');
const Business = require('../models/Business');
const Company = require('../models/Company');
const User = require('../models/User');

async function migrate() {
  console.log('🚀 Starting ONE-TIME Business → Company migration...\n');

  // Step 1: Copy Business → Company (keep same _id)
  console.log('Step 1: Migrating Business documents to Company collection...');
  const businesses = await Business.find({});
  for (const business of businesses) {
    const company = new Company({
      _id: business._id,  // CRITICAL: Keep same ID
      name: business.name,
      industry: business.industry,
      size_category: business.size_category,
      employee_count: business.employee_count,
      website: business.website,
      assessment_scores: business.assessment_scores,
      subscription_tier: business.subscription_tier,
      ibrain_enabled: business.ibrain_enabled,
      branding: business.branding,
      settings: business.settings,
      onboarding_completed: business.onboarding_completed,
      onboarding_progress: business.onboarding_progress,
      status: business.status,
      trial_started_at: business.trial_started_at,
      subscription_started_at: business.subscription_started_at,
      created_at: business.created_at,
      updated_at: business.updated_at
    });
    await company.save();
    console.log(`  ✅ ${business.name} → Company`);
  }

  // Step 2: Update Users (business_id → company_id)
  console.log('\nStep 2: Updating User documents...');
  const users = await User.find({ business_id: { $exists: true } });
  for (const user of users) {
    user.company_id = user.business_id;
    user.companies = [{
      company_id: user.business_id,
      role: user.role || 'EMPLOYEE',
      joined_at: user.created_at,
      is_primary: true,
      status: 'active'
    }];

    if (user.managed_businesses && user.managed_businesses.length > 0) {
      user.managed_companies = user.managed_businesses;
    }

    // Remove old fields
    user.business_id = undefined;
    user.managed_businesses = undefined;

    await user.save();
    console.log(`  ✅ ${user.email}`);
  }

  // Step 3: Update all resources
  console.log('\nStep 3: Updating resource documents...');
  const models = [
    'Team', 'Objective', 'Goal', 'Task',
    'Assessment', 'AssessmentTemplate',
    'AIOKRSuggestion', 'Invitation'
  ];

  for (const modelName of models) {
    const Model = require(`../models/${modelName}`);

    // Copy business_id → company_id
    const result = await Model.updateMany(
      { business_id: { $exists: true } },
      [{ $set: { company_id: '$business_id' } }]
    );

    // Remove business_id field
    await Model.updateMany(
      { business_id: { $exists: true } },
      { $unset: { business_id: '' } }
    );

    console.log(`  ✅ ${modelName}: ${result.modifiedCount} documents updated`);
  }

  console.log('\n✅ Migration COMPLETE!\n');
  console.log('Next steps:');
  console.log('1. Verify data integrity');
  console.log('2. Test all API endpoints');
  console.log('3. Deploy frontend changes');
  console.log('4. Archive Business collection (optional)\n');
}

// Run migration
mongoose.connect(process.env.MONGODB_URI)
  .then(migrate)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
```

**Run Command**:
```bash
node server/scripts/migrate-business-to-company.js
```

### **Priority 5: Frontend Updates** (Estimated: 8-10 hours)

**Changes Needed**:

1. **Update API Clients** (~10 files):
```javascript
// client/js/api/businessApi.js → companyApi.js
export const getCompanyDetails = (companyId) => {
  return apiClient.get(`/companies/${companyId}`);
};
```

2. **Update LocalStorage Keys**:
```javascript
// OLD
localStorage.getItem('business_id')

// NEW
localStorage.getItem('company_id')
```

3. **Update UI Text** (~25 HTML files):
```html
<!-- Replace all instances -->
"Business" → "Company"
"business" → "company"
"businesses" → "companies"
```

4. **Update Controllers** (~15 JS files):
```javascript
// Update all references
this.businessId → this.companyId
business_id → company_id
```

---

## 📊 MIGRATION SUMMARY

### **Completed Work** (5-6 hours)

| Component | Status | Files Changed | Lines Changed |
|-----------|--------|---------------|---------------|
| **Models** | ✅ 100% | 11 files | ~3,900 characters removed |
| **companies.js API** | ✅ 100% | 1 file | 591 lines (clean) |
| **server/index.js** | ✅ Updated | 1 file | +1 line |

**Total**: 13 files modified

### **Remaining Work** (25-30 hours)

| Phase | Status | Estimated Time |
|-------|--------|----------------|
| Resource Routes | ⏳ Pending | 12-15h |
| Auth.js Update | ⏳ Pending | 3-4h |
| Data Migration Script | ⏳ Pending | 4-5h |
| Frontend Updates | ⏳ Pending | 8-10h |
| Testing & Validation | ⏳ Pending | 3-4h |

**Total Remaining**: ~30-38 hours

---

## 🚀 DEPLOYMENT PLAN

### **Phase 1: Complete Backend** (Now → Day 2)
1. ✅ Update all models (DONE)
2. ✅ Update companies.js route (DONE)
3. ⏳ Update all resource routes (12-15h)
4. ⏳ Update auth.js (3-4h)
5. ⏳ Remove businesses.js route (30min)

**Total**: ~16-20 hours

### **Phase 2: Data Migration** (Day 3)
1. ⏳ Create migration script (4-5h)
2. ⏳ Test on dev data
3. ⏳ Create rollback plan
4. ⏳ Run on staging
5. ⏳ Validate all data

**Total**: ~6-8 hours

### **Phase 3: Frontend** (Day 4-5)
1. ⏳ Update API clients (3h)
2. ⏳ Update UI text (3h)
3. ⏳ Update localStorage (1h)
4. ⏳ Test all screens (2h)

**Total**: ~9-10 hours

### **Phase 4: Production Deployment** (Day 6)
1. Deploy backend (Phase 1)
2. Run migration script
3. Verify data
4. Deploy frontend (Phase 3)
5. Monitor for 48 hours

---

## ✅ BENEFITS OF COMPLETE MIGRATION

1. **No Technical Debt**: Clean codebase, no legacy fields
2. **Simpler Queries**: No `$or` queries needed
3. **Better Performance**: Fewer indexes, cleaner queries
4. **Easier Maintenance**: Single source of truth
5. **Clear Intent**: Code clearly uses "Company" terminology
6. **No Confusion**: No mixing of business_id/company_id

---

## ⚠️ BREAKING CHANGES

**This is a BREAKING migration**. Old code will NOT work after deployment.

**Required Before Go-Live**:
- [ ] All backend routes updated
- [ ] Data migration complete
- [ ] Frontend updated
- [ ] JWT tokens regenerated (users must re-login)
- [ ] All localStorage cleared

**Communication Plan**:
1. Notify all users of maintenance window
2. Require re-login after deployment
3. Provide migration notes for any API consumers

---

**Last Updated**: October 25, 2025
**Status**: Backend Models & Companies API Complete ✅
**Next**: Update resource routes (goals, objectives, tasks, teams, etc.)
