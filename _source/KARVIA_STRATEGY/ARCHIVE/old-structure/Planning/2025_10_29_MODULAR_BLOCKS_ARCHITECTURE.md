# 🧩 Modular "Lego Blocks" Architecture - True Independence

**Created**: October 23, 2025
**Philosophy**: Each block is **optional** and **independent** - system works without any block
**Key Principle**: Blocks enhance but don't block core functionality

---

## 🎯 CORE ARCHITECTURAL RULES

### Rule 1: **No Blocking Dependencies**
- ❌ BAD: "You must create a company before creating goals"
- ✅ GOOD: "Goals work with or without company/team assignment"

### Rule 2: **Additive Enhancement**
- Each block adds value but isn't required
- System degrades gracefully when blocks are disabled/incomplete

### Rule 3: **Interface-Based Integration**
- Blocks communicate through standardized interfaces
- Changes to one block don't break others

### Rule 4: **Feature Flag Control**
- Every block can be enabled/disabled via feature flags
- UI adapts based on enabled blocks

### Rule 5: **Admin-Configurable Rules**
- Admin can configure permission rules without code changes
- Rules stored in database, not hardcoded

---

## 🧱 THE 7 LEGO BLOCKS

---

## **BLOCK 1: Core Execution** ⭐ REQUIRED (Only Required Block)

### What It Does:
Basic OKR execution without any organizational structure.

### Features:
- User can create Objectives
- User can create Goals (assigned to self)
- User can create Tasks (assigned to self)
- User can track progress
- User can view their own OKRs

### Database Schema:
```javascript
Objective {
  owner_id: ObjectId,        // Just user, no team/company
  title: String,
  key_results: [...],
  progress: Number
}

Goal {
  owner_id: ObjectId,        // Just user
  assigned_to: ObjectId,     // Just user, no team
  objective_id: ObjectId,
  progress: Number
}

Task {
  owner_id: ObjectId,
  assigned_to: ObjectId,     // Just user
  goal_id: ObjectId (optional), // Can be standalone
  status: String
}
```

### UI Behavior:
- Simple "My Objectives" page
- No team filters
- No company context
- Works for solo users or small teams

### Status: ✅ **EXISTS** (Week 5-6 built this)

---

## **BLOCK 2: IAM (Identity & Access Management)** 🆔 OPTIONAL

### What It Enhances:
Adds organizational structure - companies, teams, roles.

### Features When ENABLED:
- Company creation
- Team management
- Member assignment to teams
- Company-level view for executives
- Team-level view for managers
- Bulk invitations by company/team

### Database Changes (ADDITIVE):
```javascript
// ENHANCED, not replaced
User {
  // ... existing fields
  companies: [{              // NEW (optional)
    company_id: ObjectId,
    role: String
  }]
}

Goal {
  owner_id: ObjectId,        // Still works without team
  team_id: ObjectId,         // NEW (optional)
  assigned_to: ObjectId,
  // ... rest unchanged
}

Task {
  owner_id: ObjectId,
  team_id: ObjectId,         // NEW (optional)
  assigned_to: ObjectId,
  // ... rest unchanged
}
```

### UI Behavior When ENABLED:
- Goals page shows "Filter by Team" dropdown
- Objectives page shows company/team breakdown
- Bulk invite has "Entire Company" / "Specific Teams" options

### UI Behavior When DISABLED:
- No team filters (gracefully hidden)
- No company dropdown
- Invitations are individual only
- Everything still works, just no org structure

### Feature Flag:
```javascript
FEATURE_FLAGS.IAM_BLOCK = true/false;

// In UI:
if (FEATURE_FLAGS.IAM_BLOCK) {
  showTeamFilters();
  showCompanyDropdown();
}
```

### Status: ⬜ **TO BUILD** (Week 6.5-7)

### Implementation Contract:
```javascript
// Goals API - works with OR without teams
GET /api/goals?team_id=xxx  // Returns team goals (if IAM enabled)
GET /api/goals              // Returns user's goals (always works)

// Frontend - graceful degradation
function renderGoalsPage(user, goals) {
  const hasTeams = FEATURE_FLAGS.IAM_BLOCK && user.companies?.length > 0;

  if (hasTeams) {
    renderWithTeamFilters(goals);
  } else {
    renderSimpleList(goals);
  }
}
```

---

## **BLOCK 3: Assessment System** 📊 OPTIONAL

### What It Enhances:
Adds data-driven OKR generation via assessments.

### Features When ENABLED:
- Create assessment templates (SSI, 360, Skills, Custom)
- Send assessments to users
- View assessment results
- Generate OKRs from assessment data

### Features When DISABLED:
- Users create OKRs manually
- No assessment-driven insights
- Still fully functional OKR system

### Database Schema (ADDITIVE):
```javascript
Objective {
  owner_id: ObjectId,
  title: String,
  lineage: {                 // NEW (optional)
    assessment_id: ObjectId  // Links to assessment if generated
  }
}
```

### UI Behavior When ENABLED:
- "Generate from Assessment" button on Objectives page
- Assessment Hub in navigation
- Results page with insights

### UI Behavior When DISABLED:
- "Create Objective" button (manual entry)
- No Assessment Hub menu item
- No assessment results

### Feature Flag:
```javascript
FEATURE_FLAGS.ASSESSMENT_BLOCK = true/false;
```

### Status: ✅ **EXISTS** (Week 1-4 built this)

### Modularity:
- Assessment type is enum-based (SSI, 360, Skills, Custom)
- Can add new types without changing Goal/Task models
- Assessment output is standardized schema

---

## **BLOCK 4: AI OKR Engine** 🤖 OPTIONAL

### What It Enhances:
Adds LLM-powered OKR generation from assessment data.

### Features When ENABLED:
- AI analyzes assessment results
- Generates contextual OKRs
- Consultant can edit prompts
- Structured JSON output

### Features When DISABLED:
- Template-based OKR generation (existing fallback)
- Manual OKR creation
- Still functional, just less intelligent

### Dependencies:
- Requires OpenAI API key (customer provides)
- Requires Assessment Block (for input data)

### Graceful Degradation:
```javascript
async function generateOKRs(assessmentId) {
  if (FEATURE_FLAGS.AI_ENGINE && process.env.OPENAI_API_KEY) {
    try {
      return await generateWithAI(assessmentId);
    } catch (error) {
      console.log('AI failed, using templates');
      return generateWithTemplates(assessmentId);
    }
  } else {
    return generateWithTemplates(assessmentId);
  }
}
```

### Status: ⚠️ **PARTIAL** (Template system exists, LLM integration needed)

### Implementation Contract:
- Input: Assessment results (standardized schema)
- Output: Array of Objectives (standardized schema)
- Zero impact on Goal/Task execution

---

## **BLOCK 5: Progress Rollup** 📈 OPTIONAL

### What It Enhances:
Automatic progress aggregation up the hierarchy.

### Features When ENABLED:
- Task completion → Goal progress
- Goal progress → Key Result progress
- Key Result → Objective progress
- Real-time updates

### Features When DISABLED:
- Manual progress updates
- Users update Goal/Objective progress directly

### Implementation:
```javascript
// Automatic (when enabled)
task.complete() → goal.recalculateProgress() → objective.recalculateProgress()

// Manual (when disabled)
user.updateGoalProgress(goalId, 75) → saves directly
```

### Status: ⚠️ **PARTIAL** (Post-save hook exists in Goal model, needs testing)

---

## **BLOCK 6: Bulk Operations** 🔄 OPTIONAL

### What It Enhances:
Batch operations for scale.

### Features When ENABLED:
- Bulk invite (company/team/individuals)
- Bulk goal assignment
- Bulk task creation
- CSV import

### Features When DISABLED:
- One-by-one operations
- Manual entry

### UI Pattern:
```javascript
// Invitation page
if (FEATURE_FLAGS.IAM_BLOCK && FEATURE_FLAGS.BULK_OPS) {
  showBulkInviteOptions(); // Company, Teams, CSV
} else {
  showIndividualInviteForm(); // Email list
}
```

### Status: ⬜ **TO BUILD** (Week 6.5-7)

---

## **BLOCK 7: Permission Rules Engine** 🔐 OPTIONAL ⭐ NEW

### What It Does:
Admin-configurable permission rules without code changes.

### Problem It Solves:
**Scenario**: Company wants custom rules like:
- "Only Managers can create Objectives"
- "Employees can only view, not edit"
- "Consultants can generate OKRs but not assign tasks"

**Current Problem**: These rules are hardcoded in middleware
**Solution**: Store rules in database, enforce dynamically

---

### Database Schema:

```javascript
PermissionRule {
  business_id: ObjectId,     // Company-specific rules
  rule_name: String,         // "objective_creation"
  resource: String,          // "objective" | "goal" | "task"
  action: String,            // "create" | "read" | "update" | "delete"
  allowed_roles: [String],   // ["MANAGER", "EXECUTIVE"]
  denied_roles: [String],    // ["EMPLOYEE"]
  conditions: {              // Optional advanced rules
    field: "owner_id",
    operator: "equals",
    value: "${current_user_id}"
  },
  override_default: Boolean, // True = replace system default, False = enhance
  is_active: Boolean,
  created_by: ObjectId,
  created_at: Date
}
```

---

### Example Rules:

#### Rule 1: Only Managers Can Create Objectives
```javascript
{
  business_id: "company_123",
  rule_name: "restrict_objective_creation",
  resource: "objective",
  action: "create",
  allowed_roles: ["MANAGER", "EXECUTIVE", "BUSINESS_OWNER"],
  denied_roles: ["EMPLOYEE"],
  override_default: true,  // Overrides system's permissive default
  is_active: true
}
```

#### Rule 2: Employees Can Only View Their Own Objectives
```javascript
{
  business_id: "company_123",
  rule_name: "employee_objective_read",
  resource: "objective",
  action: "read",
  allowed_roles: ["EMPLOYEE"],
  conditions: {
    field: "owner_id",
    operator: "equals",
    value: "${current_user_id}"  // Dynamic variable
  },
  override_default: false,  // Adds to existing read rules
  is_active: true
}
```

#### Rule 3: Consultants Cannot Assign Tasks
```javascript
{
  business_id: "company_123",
  rule_name: "consultant_no_task_assign",
  resource: "task",
  action: "update",
  allowed_roles: ["MANAGER", "EXECUTIVE"],
  denied_roles: ["CONSULTANT"],
  conditions: {
    field: "assigned_to",
    operator: "changed"  // Only when changing assigned_to
  },
  override_default: true,
  is_active: true
}
```

---

### Admin UI: Permission Rules Manager

```
┌─────────────────────────────────────────────────────────────┐
│ Permission Rules - Legacy Succession Company                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Create New Rule]                                           │
│                                                              │
│  Active Rules (3):                                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✅ Only Managers Can Create Objectives                │  │
│  │    Resource: Objective | Action: Create               │  │
│  │    Allowed: MANAGER, EXECUTIVE                        │  │
│  │    [Edit] [Disable] [Delete]                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✅ Employees View Own Objectives Only                 │  │
│  │    Resource: Objective | Action: Read                 │  │
│  │    Condition: owner_id = current_user                 │  │
│  │    [Edit] [Disable] [Delete]                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✅ Consultants Cannot Assign Tasks                    │  │
│  │    Resource: Task | Action: Update                    │  │
│  │    Denied: CONSULTANT                                 │  │
│  │    [Edit] [Disable] [Delete]                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Inactive Rules (1):                                         │
│  - Managers approve goals (disabled)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Create Rule Modal:

```
┌──────────────────────────────────────────┐
│ Create Permission Rule                   │
├──────────────────────────────────────────┤
│                                           │
│ Rule Name:                                │
│ [Only Managers Create OKRs__________]    │
│                                           │
│ Resource:                                 │
│ [v] Objective                             │
│     ○ Objective   ○ Goal   ○ Task        │
│                                           │
│ Action:                                   │
│ [v] Create                                │
│     ○ Create   ○ Read   ○ Update         │
│     ○ Delete   ○ Assign                  │
│                                           │
│ Allowed Roles: (select multiple)         │
│ ☑ MANAGER                                 │
│ ☑ EXECUTIVE                               │
│ ☑ BUSINESS_OWNER                          │
│ ☐ EMPLOYEE                                │
│ ☐ CONSULTANT                              │
│                                           │
│ Denied Roles: (optional)                  │
│ ☑ EMPLOYEE                                │
│ ☐ CONSULTANT                              │
│                                           │
│ Advanced Conditions: (optional)           │
│ [+ Add Condition]                         │
│                                           │
│ ○ Enhance default rules                  │
│ ● Override default rules                 │
│                                           │
│ [Cancel]  [Create Rule]                  │
└──────────────────────────────────────────┘
```

---

### Middleware: Dynamic Permission Check

```javascript
// middleware/dynamicPermissions.js

async function checkPermission(req, res, next) {
  const { resource, action } = req.permissionContext; // e.g., { resource: 'objective', action: 'create' }
  const user = req.user;
  const businessId = user.business_id;

  // Get rules for this business + resource + action
  const rules = await PermissionRule.find({
    business_id: businessId,
    resource: resource,
    action: action,
    is_active: true
  });

  // If no custom rules, fall back to system defaults
  if (rules.length === 0) {
    return checkSystemDefaults(user.role, resource, action, req, res, next);
  }

  // Evaluate rules
  for (const rule of rules) {
    // Check denied roles first (explicit deny wins)
    if (rule.denied_roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: `Your role (${user.role}) is not allowed to ${action} ${resource}`,
        rule: rule.rule_name
      });
    }

    // Check allowed roles
    if (rule.allowed_roles.includes(user.role)) {
      // Check conditions if any
      if (rule.conditions) {
        const conditionMet = evaluateCondition(rule.conditions, req, user);
        if (!conditionMet) {
          return res.status(403).json({
            success: false,
            error: `Condition not met: ${rule.conditions.field} ${rule.conditions.operator}`,
            rule: rule.rule_name
          });
        }
      }

      // Allowed!
      return next();
    }
  }

  // If we reach here, no rule explicitly allowed this
  return res.status(403).json({
    success: false,
    error: `No permission rule allows this action`
  });
}

// Helper: Evaluate dynamic conditions
function evaluateCondition(condition, req, user) {
  const { field, operator, value } = condition;

  // Get actual value from request or user
  let actualValue;
  if (value === '${current_user_id}') {
    actualValue = user.id;
  } else {
    actualValue = value;
  }

  // Get target value from request body or params
  const targetValue = req.body[field] || req.params[field];

  // Evaluate
  switch (operator) {
    case 'equals':
      return targetValue === actualValue;
    case 'not_equals':
      return targetValue !== actualValue;
    case 'in':
      return Array.isArray(actualValue) && actualValue.includes(targetValue);
    case 'changed':
      // Check if field is being modified (update operations)
      return req.body.hasOwnProperty(field);
    default:
      return false;
  }
}

// System defaults (when no custom rules exist)
function checkSystemDefaults(role, resource, action, req, res, next) {
  // Default permissive rules
  const defaults = {
    objective: {
      create: ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'],
      read: ['ALL'],
      update: ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'],
      delete: ['EXECUTIVE', 'BUSINESS_OWNER']
    },
    goal: {
      create: ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'],
      read: ['ALL'],
      update: ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'EMPLOYEE'],
      delete: ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER']
    },
    task: {
      create: ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER'],
      read: ['ALL'],
      update: ['ALL'],  // Anyone can update tasks
      delete: ['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER']
    }
  };

  const allowedRoles = defaults[resource]?.[action] || [];

  if (allowedRoles.includes('ALL') || allowedRoles.includes(role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: `Default permissions deny this action`
  });
}

module.exports = { checkPermission };
```

---

### API Routes: Using Dynamic Permissions

```javascript
// server/routes/objectives.js

const { checkPermission } = require('../middleware/dynamicPermissions');

// Before route
router.post('/',
  authenticateToken,
  (req, res, next) => {
    req.permissionContext = { resource: 'objective', action: 'create' };
    next();
  },
  checkPermission,  // Dynamic check
  async (req, res) => {
    // Create objective
  }
);

router.put('/:id',
  authenticateToken,
  (req, res, next) => {
    req.permissionContext = { resource: 'objective', action: 'update' };
    next();
  },
  checkPermission,
  async (req, res) => {
    // Update objective
  }
);
```

---

### Admin API: Manage Rules

```javascript
// server/routes/admin/permissions.js

// GET /api/admin/permissions/rules - List all rules
router.get('/rules', authenticateToken, requireAdmin, async (req, res) => {
  const businessId = req.user.business_id;
  const rules = await PermissionRule.find({ business_id: businessId });
  res.json({ success: true, rules });
});

// POST /api/admin/permissions/rules - Create rule
router.post('/rules', authenticateToken, requireAdmin, async (req, res) => {
  const { rule_name, resource, action, allowed_roles, denied_roles, conditions, override_default } = req.body;

  const rule = new PermissionRule({
    business_id: req.user.business_id,
    rule_name,
    resource,
    action,
    allowed_roles,
    denied_roles,
    conditions,
    override_default,
    is_active: true,
    created_by: req.user.id
  });

  await rule.save();
  res.json({ success: true, rule });
});

// PUT /api/admin/permissions/rules/:id - Update rule
router.put('/rules/:id', authenticateToken, requireAdmin, async (req, res) => {
  const rule = await PermissionRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, rule });
});

// DELETE /api/admin/permissions/rules/:id - Delete rule
router.delete('/rules/:id', authenticateToken, requireAdmin, async (req, res) => {
  await PermissionRule.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// POST /api/admin/permissions/rules/:id/toggle - Enable/disable rule
router.post('/rules/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
  const rule = await PermissionRule.findById(req.params.id);
  rule.is_active = !rule.is_active;
  await rule.save();
  res.json({ success: true, rule });
});
```

---

### Feature Flag:
```javascript
FEATURE_FLAGS.PERMISSION_RULES = true/false;

// When disabled:
- Falls back to system defaults (hardcoded roles)
- Admin UI hidden
- All existing permissions still work
```

---

### Status: ⬜ **TO BUILD** (Week 10-11 - Admin Panel sprint)

### Priority: **P2 (Nice-to-Have)** - Enhances enterprise deployments

---

### Benefits:

1. **No Code Changes**: Admin configures rules via UI, no developer needed
2. **Company-Specific**: Each company can have different rules
3. **Flexible**: Can create complex rules with conditions
4. **Auditable**: See who created rules and when
5. **Toggleable**: Disable rules without deleting them
6. **Graceful Fallback**: System defaults work when no custom rules exist

---

## 🎛️ FEATURE FLAG SYSTEM

### Implementation:
```javascript
// config/feature-flags.js
module.exports = {
  IAM_BLOCK: process.env.ENABLE_IAM === 'true',
  ASSESSMENT_BLOCK: process.env.ENABLE_ASSESSMENTS === 'true',
  AI_ENGINE: process.env.ENABLE_AI_ENGINE === 'true',
  PROGRESS_ROLLUP: process.env.ENABLE_ROLLUP === 'true',
  BULK_OPS: process.env.ENABLE_BULK === 'true',
  PERMISSION_RULES: process.env.ENABLE_PERMISSION_RULES === 'true'  // NEW
};

// .env
ENABLE_IAM=true
ENABLE_ASSESSMENTS=true
ENABLE_AI_ENGINE=false
ENABLE_ROLLUP=true
ENABLE_BULK=false
ENABLE_PERMISSION_RULES=false  # Disable until Week 10
```

---

## 📊 BLOCK DEPENDENCY MATRIX

| Feature | Requires IAM | Requires Assessment | Requires AI | Requires Perm Rules |
|---------|--------------|---------------------|-------------|---------------------|
| Create Goal | ❌ | ❌ | ❌ | ❌ |
| Assign Goal to Team | ✅ | ❌ | ❌ | ❌ |
| Create Objective | ❌ | ❌ | ❌ | ❌ |
| Generate from Assessment | ❌ | ✅ | ❌ | ❌ |
| AI Generate OKRs | ❌ | ✅ | ✅ | ❌ |
| Bulk Invite Team | ✅ | ❌ | ❌ | ❌ |
| Custom Permission Rules | ❌ | ❌ | ❌ | ✅ |
| Track Task Progress | ❌ | ❌ | ❌ | ❌ |

**Key Insight**: Most features require ZERO blocks. Blocks are pure enhancements.

---

## 🚀 IMPLEMENTATION STRATEGY

### Phase 1: Ensure Core Works Without Blocks (Week 6 Completion)
- ✅ Goals work without teams
- ✅ Tasks work without goals
- ✅ Objectives work standalone
- ✅ Manual progress updates work
- **Goal**: Solo user can use entire system

### Phase 2: Add IAM Block (Week 6.5, 2 days)
- Build Company/Team models
- Add optional fields to Goal/Task
- Add team filters to UI (conditionally rendered)
- Test: System works with AND without IAM enabled

### Phase 3: Add Modular Assessment (Week 7, 1 day)
- Refactor Assessment model (dynamic dimensions)
- Add assessment_type enum
- Make scoring service type-agnostic
- Test: SSI still works, can add 360 type

### Phase 4: Add LLM Engine (Week 7, 1.5 days)
- OpenAI integration
- Prompt builder
- Template fallback
- Test: Works with OpenAI, works without OpenAI

### Phase 5: Add Bulk Ops (Week 7, 0.5 days)
- Bulk invitation endpoint
- CSV parsing
- Test: Individual invites still work

### Phase 6: Add Permission Rules Engine (Week 10-11, 2 days)
- PermissionRule model
- Dynamic permission middleware
- Admin UI for rule management
- Test: System defaults work when rules disabled

---

## ✅ VALIDATION TESTS

### Test 1: Core Works Standalone
```bash
# Disable all blocks
ENABLE_IAM=false
ENABLE_ASSESSMENTS=false
ENABLE_AI_ENGINE=false
ENABLE_PERMISSION_RULES=false

# Should work:
- User signup
- Create objective
- Create goal
- Create task
- Update progress
- View dashboard
```

### Test 2: Blocks Are Additive
```bash
# Enable one block at a time
ENABLE_IAM=true  # Team filters appear, core still works
ENABLE_ASSESSMENTS=true  # Assessment menu appears, manual OKRs still work
ENABLE_AI_ENGINE=true  # AI button appears, templates still work
ENABLE_PERMISSION_RULES=true  # Admin sees rule manager, defaults still work
```

### Test 3: Block Failure Doesn't Break System
```bash
# OpenAI rate limit hit
AI_ENGINE fails → Falls back to templates → User still gets OKRs

# Team model has bug
IAM_BLOCK disabled → Team filters hidden → Goals still work

# Permission rule database error
PERMISSION_RULES fails → Falls back to system defaults → Still works
```

---

## 📌 KEY TAKEAWAYS

1. **No Forced Company Creation**: User can start using OKRs immediately
2. **No Forced Team Assignment**: Goals work with or without teams
3. **No Forced Assessment**: Can create OKRs manually
4. **No Forced AI**: Template fallback always works
5. **No Forced Permission Rules**: System defaults work fine
6. **Each Block Optional**: Enable/disable independently
7. **Graceful Degradation**: System adapts to disabled blocks
8. **Admin Control**: Permissions configurable without code changes

---

**Architecture Principle**:
> "The system must work perfectly for a solo user with zero blocks enabled. Every block is a **bonus**, not a requirement. Admin can configure rules, but system has sensible defaults."

---

**Created By**: Claude
**Date**: October 23, 2025
**Status**: Architectural Blueprint - Ready for Implementation
