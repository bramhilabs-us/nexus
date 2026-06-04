# 🔄 BUSINESS → COMPANY MIGRATION PLAN

**Decision Date**: October 24, 2025
**Decision**: Standardize on "Company" terminology throughout codebase
**Strategy**: Gradual migration with backward compatibility
**Priority**: P0 (Required before Week 7 IAM implementation)

---

## 📋 EXECUTIVE SUMMARY

### Decision Made
**Use "Company" as the standard term** for organizational entities throughout KARVIA OKR.

**Rationale**:
1. ✅ Aligns with IAM Block specification (Week 7)
2. ✅ Clearer terminology for multi-tenant architecture
3. ✅ Industry standard naming convention
4. ✅ Better user understanding ("company" vs "business")

### Migration Strategy
**Gradual Migration with Backward Compatibility** (Option B from audit)

**Pros**:
- ✅ No breaking changes to existing data
- ✅ Existing APIs continue to work
- ✅ Safe rollout with rollback capability
- ✅ Time to update frontend references

**Cons**:
- ⚠️ Temporary code duplication
- ⚠️ Need to maintain both field names during transition
- ⚠️ Requires discipline to use new naming

**Timeline**: 2-3 days implementation + 1 week transition period

---

## 🎯 MIGRATION PHASES

### **Phase 1: Backend Models** (Day 1 - 8 hours)
Create new Company model, deprecate Business model

### **Phase 2: API Routes** (Day 2 - 8 hours)
Add company routes, mark business routes as deprecated

### **Phase 3: Frontend Updates** (Day 3 - 4 hours)
Update UI references from "business" to "company"

### **Phase 4: Documentation** (Day 3 - 4 hours)
Update all docs, add migration guide

---

## 📁 FILES TO CHANGE

### **Backend Models** (11 files)

| File | Current | New | Action | Priority |
|------|---------|-----|--------|----------|
| `server/models/Business.js` | ✅ Exists | Deprecate | Rename → Company.js | P0 |
| `server/models/User.js` | `business_id` | Add `company_id` | Add field + keep old | P0 |
| `server/models/Team.js` | `business_id` | Add `company_id` | Add field + keep old | P0 |
| `server/models/Goal.js` | `business_id` | Add `company_id` | Add field + keep old | P0 |
| `server/models/Task.js` | `business_id` | Add `company_id` | Add field + keep old | P0 |
| `server/models/Objective.js` | `business_id` | Add `company_id` | Add field + keep old | P0 |
| `server/models/Assessment.js` | `business_id` | Add `company_id` | Add field + keep old | P0 |
| `server/models/Invitation.js` | `business_id` | Add `company_id` | Add field + keep old | P0 |
| `server/models/AIOKRSuggestion.js` | `business_id` | Add `company_id` | Add field + keep old | P1 |
| `server/models/AssessmentTemplate.js` | `business_id` | Add `company_id` | Add field + keep old | P1 |
| `server/models/AssessmentQuestion.js` | `business_id` | Add `company_id` | Add field + keep old | P1 |

**Total**: 11 model files to update

---

### **Backend Routes** (13 files)

| File | Current Route | New Route | Action | Priority |
|------|---------------|-----------|--------|----------|
| `server/routes/businesses.js` | `/api/businesses` | Create `/api/companies` | Create new file | P0 |
| `server/routes/teams.js` | Uses `business_id` | Add `company_id` support | Update queries | P0 |
| `server/routes/goals.js` | Uses `business_id` | Add `company_id` support | Update queries | P0 |
| `server/routes/tasks.js` | Uses `business_id` | Add `company_id` support | Update queries | P0 |
| `server/routes/objectives.js` | Uses `business_id` | Add `company_id` support | Update queries | P0 |
| `server/routes/assessments.js` | Uses `business_id` | Add `company_id` support | Update queries | P0 |
| `server/routes/invitations.js` | Uses `business_id` | Add `company_id` support | Update queries | P0 |
| `server/routes/auth.js` | Sets `business_id` | Add `company_id` logic | Update signup | P0 |
| `server/routes/analytics.js` | Uses `business_id` | Add `company_id` support | Update queries | P1 |
| `server/routes/ai-okr.js` | Uses `business_id` | Add `company_id` support | Update queries | P1 |
| `server/routes/cascade.js` | Uses `business_id` | Add `company_id` support | Update queries | P1 |
| `server/routes/admin.js` | Uses `business_id` | Add `company_id` support | Update queries | P1 |
| `server/routes/assessmentTemplates.js` | Uses `business_id` | Add `company_id` support | Update queries | P1 |

**Total**: 13 route files to update + 1 new file to create

---

### **Middleware** (2 files)

| File | Changes Needed | Priority |
|------|----------------|----------|
| `server/middleware/authGuards.js` | Add company context injection | P0 |
| `server/middleware/roleGuards.js` | Support company-scoped roles | P0 |

---

### **Frontend Pages** (25 HTML files)

| Pattern | Count | Action | Priority |
|---------|-------|--------|----------|
| References to "business" in text | ~25 | Replace with "company" | P0 |
| `business_id` in JavaScript | ~15 | Add `company_id` support | P0 |
| API calls to `/api/businesses` | ~10 | Update to `/api/companies` | P0 |

**Key Files**:
- `client/pages/signup.html` - Business creation → Company creation
- `client/pages/login.html` - Business selection → Company selection
- All dashboard pages - Display "Company" instead of "Business"
- Navigation components - Update terminology

---

### **Frontend JavaScript** (10 controller files)

| File | Changes Needed | Priority |
|------|----------------|----------|
| All API clients | Update endpoint references | P0 |
| All controllers | Update data model references | P0 |
| Navigation JS | Update terminology | P0 |

---

### **Documentation** (50+ files)

| Location | Files | Action | Priority |
|----------|-------|--------|----------|
| `KARVIA_STRATEGY/` | ~20 docs | Update Business → Company | P0 |
| `Karvia_OKR_Product_Planning/` | ~30 docs | Update Business → Company | P0 |
| Code comments | ~500 instances | Update terminology | P1 |
| README files | ~10 files | Update terminology | P0 |

---

## 🔧 DETAILED IMPLEMENTATION

### **PHASE 1: Backend Models (Day 1 - 8 hours)**

#### **Task 1.1: Rename Business.js → Company.js** (2 hours)

**File**: `server/models/Business.js` → `server/models/Company.js`

**Changes**:
```javascript
// OLD: server/models/Business.js
const businessSchema = new mongoose.Schema({
  name: String,
  industry: String,
  // ...
});

module.exports = mongoose.model('Business', businessSchema);
```

```javascript
// NEW: server/models/Company.js
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 255
  },
  industry: String,
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },

  // Ownership
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Feature Flags (from Week 7 spec)
  feature_flags: {
    iam_block: { type: Boolean, default: true },
    assessment_block: { type: Boolean, default: true },
    ai_engine: { type: Boolean, default: false },
    progress_rollup: { type: Boolean, default: true },
    bulk_ops: { type: Boolean, default: true },
    permission_rules: { type: Boolean, default: false },
    ibrain_enabled: { type: Boolean, default: false }
  },

  // Settings
  settings: {
    default_timezone: { type: String, default: 'America/New_York' },
    fiscal_year_start: { type: Number, default: 1 },
    okr_cycle: { type: String, enum: ['quarterly', 'yearly'], default: 'quarterly' }
  },

  // Assessment Scores (company-level aggregation)
  assessment_scores: {
    speed_score: { type: Number, min: 0, max: 100, default: 0 },
    strength_score: { type: Number, min: 0, max: 100, default: 0 },
    intelligence_score: { type: Number, min: 0, max: 100, default: 0 },
    overall_score: { type: Number, min: 0, max: 100, default: 0 }
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ name: 1 }, { unique: true });
companySchema.index({ owner_id: 1 });
companySchema.index({ status: 1 });

// Methods
companySchema.methods.isFeatureEnabled = function(featureName) {
  return this.feature_flags[featureName] === true;
};

module.exports = mongoose.model('Company', companySchema);
```

**Acceptance Criteria**:
- [ ] Company.js created with full schema
- [ ] All feature flags included
- [ ] Indexes defined
- [ ] Methods implemented
- [ ] Model exports successfully

---

#### **Task 1.2: Update User Model** (1.5 hours)

**File**: `server/models/User.js`

**Add to schema**:
```javascript
// LEGACY - Keep for backward compatibility
business_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Business',  // Still reference old model
  required: false,
  index: true
},

// NEW - Primary field going forward
company_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',
  required: false,  // Optional for transition
  index: true
},

// NEW - Multi-company support (Week 7 IAM)
companies: [{
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  role: {
    type: String,
    enum: ['OWNER', 'MANAGER', 'EMPLOYEE', 'CONSULTANT']
  },
  joined_at: {
    type: Date,
    default: Date.now
  },
  is_primary: {
    type: Boolean,
    default: false
  }
}],

current_company_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',
  default: null
},

// Add helper methods
UserSchema.methods.getCompanyId = function() {
  // Return company_id if exists, fallback to business_id
  return this.company_id || this.business_id;
};

UserSchema.methods.addCompany = function(companyId, role, isPrimary = false) {
  if (isPrimary) {
    this.companies.forEach(c => c.is_primary = false);
  }

  this.companies.push({
    company_id: companyId,
    role,
    joined_at: new Date(),
    is_primary: isPrimary
  });

  if (this.companies.length === 1 || isPrimary) {
    this.current_company_id = companyId;
    this.company_id = companyId;  // Set primary company_id
  }

  return this.save();
};

UserSchema.methods.switchCompany = function(companyId) {
  const company = this.companies.find(c => c.company_id.equals(companyId));
  if (!company) {
    throw new Error('User not member of this company');
  }
  this.current_company_id = companyId;
  this.company_id = companyId;  // Update primary company_id
  return this.save();
};
```

**Acceptance Criteria**:
- [ ] company_id field added
- [ ] companies[] array added
- [ ] current_company_id added
- [ ] Helper methods work
- [ ] business_id maintained for backward compatibility

---

#### **Task 1.3: Update All Resource Models** (4.5 hours)

**Pattern for all models** (Team, Goal, Task, Objective, Assessment, Invitation):

```javascript
// Add to each model schema

// LEGACY - Keep for backward compatibility
business_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Business',
  required: false,  // Make optional
  index: true
},

// NEW - Primary field
company_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',
  required: function() {
    // Required if IAM_BLOCK enabled
    const featureFlags = require('../config/feature-flags');
    return featureFlags.IAM_BLOCK;
  },
  index: true
},

// Update indexes
ModelSchema.index({ company_id: 1, created_at: -1 });
ModelSchema.index({ business_id: 1, created_at: -1 });  // Keep old index

// Add helper static method
ModelSchema.statics.findByCompany = function(companyId) {
  return this.find({
    $or: [
      { company_id: companyId },
      { business_id: companyId }  // Fallback for old data
    ],
    status: { $ne: 'deleted' }
  });
};
```

**Files to update**:
1. `server/models/Team.js`
2. `server/models/Goal.js`
3. `server/models/Task.js`
4. `server/models/Objective.js`
5. `server/models/Assessment.js`
6. `server/models/Invitation.js`
7. `server/models/AIOKRSuggestion.js`
8. `server/models/AssessmentTemplate.js`
9. `server/models/AssessmentQuestion.js`

**Estimated**: 30 minutes per model × 9 models = 4.5 hours

---

### **PHASE 2: API Routes (Day 2 - 8 hours)**

#### **Task 2.1: Create companies.js Route** (3 hours)

**File**: `server/routes/companies.js` (NEW)

```javascript
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authGuards');
const { requireRole } = require('../middleware/roleGuards');

// POST /api/companies - Create company
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, industry, size, employee_count, website } = req.body;

    const company = new Company({
      name,
      industry,
      size,
      employee_count,
      website,
      owner_id: req.user._id,
      created_by: req.user._id
    });

    await company.save();

    // Add company to user's companies array
    await req.user.addCompany(company._id, 'OWNER', true);

    // Also set user.company_id for backward compatibility
    req.user.company_id = company._id;
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create company'
    });
  }
});

// GET /api/companies - List user's companies
router.get('/', authenticateToken, async (req, res) => {
  try {
    const companyIds = req.user.companies.map(c => c.company_id);

    const companies = await Company.find({
      _id: { $in: companyIds },
      status: 'active'
    }).populate('owner_id', 'first_name last_name email');

    res.json({
      success: true,
      companies,
      current_company_id: req.user.current_company_id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies'
    });
  }
});

// GET /api/companies/:id - Get single company
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner_id', 'first_name last_name email');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Check access
    const hasAccess = req.user.companies.some(c => c.company_id.equals(company._id));
    if (!hasAccess && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch company' });
  }
});

// PUT /api/companies/:id - Update company
router.put('/:id', authenticateToken, requireRole('OWNER', 'MANAGER'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Only owner can update
    if (!company.owner_id.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only owner can update' });
    }

    const allowed = ['name', 'industry', 'size', 'employee_count', 'website', 'settings'];
    Object.keys(req.body).forEach(key => {
      if (allowed.includes(key)) company[key] = req.body[key];
    });

    await company.save();
    res.json({ success: true, company });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/companies/:id - Soft delete
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (!company.owner_id.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only owner can delete' });
    }

    company.status = 'inactive';
    await company.save();

    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete company' });
  }
});

// POST /api/companies/:id/switch - Switch active company
router.post('/:id/switch', authenticateToken, async (req, res) => {
  try {
    await req.user.switchCompany(req.params.id);
    res.json({ success: true, current_company_id: req.user.current_company_id });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/companies/:id/users - List company users
router.get('/:id/users', authenticateToken, requireRole('OWNER', 'MANAGER'), async (req, res) => {
  try {
    const users = await User.find({
      'companies.company_id': req.params.id
    }).select('first_name last_name email role companies');

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// GET /api/companies/:id/teams - List company teams
router.get('/:id/teams', authenticateToken, async (req, res) => {
  try {
    const Team = require('../models/Team');
    const teams = await Team.find({
      $or: [
        { company_id: req.params.id },
        { business_id: req.params.id }  // Backward compatibility
      ],
      is_active: true
    }).populate('manager_id', 'first_name last_name');

    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch teams' });
  }
});

// GET /api/companies/:id/stats - Company statistics
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const User = require('../models/User');
    const Team = require('../models/Team');
    const Objective = require('../models/Objective');

    const [userCount, teamCount, objectiveCount] = await Promise.all([
      User.countDocuments({ 'companies.company_id': req.params.id }),
      Team.countDocuments({ company_id: req.params.id, is_active: true }),
      Objective.countDocuments({ company_id: req.params.id, status: 'active' })
    ]);

    res.json({
      success: true,
      stats: {
        user_count: userCount,
        team_count: teamCount,
        objective_count: objectiveCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

module.exports = router;
```

**Register in server/index.js**:
```javascript
app.use('/api/companies', require('./routes/companies'));
```

---

#### **Task 2.2: Update auth.js Route** (2 hours)

**File**: `server/routes/auth.js`

**Update signup endpoint**:
```javascript
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, first_name, last_name, company_name, industry } = req.body;

    // Create user
    const user = new User({
      email,
      password_hash: await bcrypt.hash(password, 10),
      first_name,
      last_name,
      role: 'BUSINESS_OWNER'
    });

    await user.save();

    // Create company (if provided)
    if (company_name) {
      const Company = require('../models/Company');
      const company = new Company({
        name: company_name,
        industry,
        owner_id: user._id,
        created_by: user._id
      });

      await company.save();

      // Link user to company
      user.company_id = company._id;  // Primary company
      user.business_id = company._id;  // Backward compatibility
      await user.addCompany(company._id, 'OWNER', true);
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        company_id: user.company_id
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

---

#### **Task 2.3: Update All Resource Routes** (3 hours)

**Pattern for all routes** (teams.js, goals.js, tasks.js, etc.):

```javascript
// Add company context middleware
const { injectCompanyContext } = require('../middleware/auth');
router.use(injectCompanyContext);

// Update GET endpoints
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get company_id from context or user
    const company_id = req.companyContext?.company_id || req.user.company_id || req.user.business_id;

    const query = {
      $or: [
        { company_id },
        { business_id: company_id }  // Fallback for old data
      ]
    };

    const results = await Model.find(query);
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update POST endpoints
router.post('/', authenticateToken, async (req, res) => {
  try {
    const company_id = req.companyContext?.company_id || req.user.company_id;
    const business_id = req.user.business_id;  // For backward compatibility

    const resource = new Model({
      ...req.body,
      company_id,      // NEW
      business_id,     // LEGACY
      created_by: req.user._id
    });

    await resource.save();
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

**Files to update**:
1. `server/routes/teams.js`
2. `server/routes/goals.js`
3. `server/routes/tasks.js`
4. `server/routes/objectives.js`
5. `server/routes/assessments.js`
6. `server/routes/invitations.js`
7. `server/routes/analytics.js`
8. `server/routes/ai-okr.js`
9. `server/routes/cascade.js`

**Estimated**: 20 minutes per route × 9 routes = 3 hours

---

### **PHASE 3: Frontend Updates (Day 3 Morning - 4 hours)**

#### **Task 3.1: Update API Endpoint References** (2 hours)

**Pattern**:
```javascript
// OLD
const response = await fetch('/api/businesses', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});

// NEW
const response = await fetch('/api/companies', {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Files**:
- All JavaScript files in `client/pages/scripts/`
- All API client files in `client/js/`

---

#### **Task 3.2: Update UI Terminology** (2 hours)

**Pattern**:
```html
<!-- OLD -->
<h1>My Business</h1>
<p>Business Name: Acme Corp</p>
<button>Create Business</button>

<!-- NEW -->
<h1>My Company</h1>
<p>Company Name: Acme Corp</p>
<button>Create Company</button>
```

**Files**:
- All HTML files in `client/pages/`
- Navigation components
- Form labels

---

### **PHASE 4: Documentation Updates (Day 3 Afternoon - 4 hours)**

#### **Task 4.1: Update Strategy Docs** (2 hours)

**Files in KARVIA_STRATEGY/**:
- All architecture documents
- All data model specifications
- All API documentation

**Pattern**: Global find-replace "business" → "company" (case-insensitive, preserve casing)

---

#### **Task 4.2: Update Planning Docs** (2 hours)

**Files in Karvia_OKR_Product_Planning/**:
- All user stories
- All planning documents
- All week plans

---

## 📊 MIGRATION DATA SCRIPT

Create migration script to update existing database records:

**File**: `scripts/migrate-business-to-company.js`

```javascript
const mongoose = require('mongoose');
const User = require('../server/models/User');
const Business = require('../server/models/Business');
const Company = require('../server/models/Company');

async function migrate() {
  try {
    console.log('Starting Business → Company migration...');

    // Step 1: Migrate Business documents to Company collection
    const businesses = await Business.find({});
    console.log(`Found ${businesses.length} businesses to migrate`);

    for (const business of businesses) {
      // Create Company from Business
      const company = new Company({
        _id: business._id,  // Keep same ID
        name: business.name,
        industry: business.industry,
        size: business.size_category,
        employee_count: business.employee_count,
        owner_id: business.owner_id,
        feature_flags: {
          iam_block: true,
          assessment_block: true,
          ai_engine: false,
          progress_rollup: true,
          bulk_ops: true,
          permission_rules: false,
          ibrain_enabled: false
        },
        assessment_scores: business.assessment_scores,
        status: business.is_active ? 'active' : 'inactive',
        created_at: business.created_at,
        updated_at: business.updated_at
      });

      await company.save();
      console.log(`Migrated business ${business.name} → company`);
    }

    // Step 2: Update User records
    const users = await User.find({ business_id: { $exists: true } });
    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      if (user.business_id) {
        user.company_id = user.business_id;

        // Add to companies array if not already there
        if (!user.companies || user.companies.length === 0) {
          user.companies = [{
            company_id: user.business_id,
            role: user.role || 'EMPLOYEE',
            joined_at: user.created_at,
            is_primary: true
          }];
          user.current_company_id = user.business_id;
        }

        await user.save();
        console.log(`Updated user ${user.email}`);
      }
    }

    // Step 3: Update all resource models
    const models = ['Team', 'Goal', 'Task', 'Objective', 'Assessment', 'Invitation'];

    for (const modelName of models) {
      const Model = require(`../server/models/${modelName}`);
      const result = await Model.updateMany(
        { business_id: { $exists: true }, company_id: { $exists: false } },
        [{ $set: { company_id: '$business_id' } }]
      );
      console.log(`Updated ${result.modifiedCount} ${modelName} documents`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
mongoose.connect(process.env.MONGODB_URI).then(migrate);
```

**Usage**:
```bash
node scripts/migrate-business-to-company.js
```

---

## ✅ ACCEPTANCE CRITERIA

### **Phase 1 Complete When**:
- [ ] Company.js model created with full schema
- [ ] User.js has company_id, companies[], current_company_id
- [ ] All 9 resource models have company_id field
- [ ] business_id fields maintained (not removed)
- [ ] All models export successfully
- [ ] Migration script created

### **Phase 2 Complete When**:
- [ ] /api/companies route created with 8 endpoints
- [ ] All 9 resource routes support company_id
- [ ] Auth route creates companies on signup
- [ ] Backward compatibility maintained
- [ ] All routes tested with Postman

### **Phase 3 Complete When**:
- [ ] All frontend API calls updated
- [ ] All UI text says "Company" not "Business"
- [ ] Forms use "company" terminology
- [ ] Navigation updated

### **Phase 4 Complete When**:
- [ ] All KARVIA_STRATEGY docs updated
- [ ] All planning docs updated
- [ ] Migration guide created
- [ ] README updated

### **Overall Complete When**:
- [ ] All 4 phases complete
- [ ] Migration script tested
- [ ] No references to "business" in user-facing UI
- [ ] Backward compatibility verified
- [ ] Week 7 IAM can proceed

---

## 🎯 TIMELINE

**Total Estimated Time**: 2-3 days

| Phase | Tasks | Time | Day |
|-------|-------|------|-----|
| Phase 1 | Backend Models | 8h | Day 1 |
| Phase 2 | API Routes | 8h | Day 2 |
| Phase 3 | Frontend | 4h | Day 3 AM |
| Phase 4 | Documentation | 4h | Day 3 PM |
| **TOTAL** | **All** | **24h** | **3 days** |

---

## 🚀 EXECUTION ORDER

1. **Day 1 Morning**: Create Company.js model + Update User.js
2. **Day 1 Afternoon**: Update all 9 resource models
3. **Day 2 Morning**: Create /api/companies route
4. **Day 2 Afternoon**: Update all 9 resource routes
5. **Day 3 Morning**: Update frontend (API calls + UI text)
6. **Day 3 Afternoon**: Update all documentation
7. **Day 3 EOD**: Run migration script on test database
8. **Day 4**: Test all functionality, verify backward compatibility

---

## ⚠️ RISKS & MITIGATION

### **Risk 1: Breaking Existing Data**
**Mitigation**: Keep business_id fields, add company_id alongside

### **Risk 2: Frontend Errors**
**Mitigation**: Update all references in single PR, test thoroughly

### **Risk 3: Documentation Out of Sync**
**Mitigation**: Automated find-replace + manual review

### **Risk 4: Migration Script Fails**
**Mitigation**: Test on copy of database first, have rollback plan

---

## 📋 POST-MIGRATION TASKS

After migration complete:

1. **Week 7+**: Start removing business_id references
2. **Week 9**: Remove business_id fields (full migration complete)
3. **Week 10**: Update all indexes to use only company_id
4. **Week 11**: Rename Business collection → archive

---

**Prepared By**: Technical Team
**Date**: October 24, 2025
**Status**: ✅ APPROVED - Ready to Execute
**Next Step**: Begin Phase 1 (Backend Models)
