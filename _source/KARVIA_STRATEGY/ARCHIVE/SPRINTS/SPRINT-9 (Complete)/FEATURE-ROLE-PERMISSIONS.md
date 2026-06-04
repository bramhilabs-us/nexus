# Feature Specification: Role & Permission System Enhancement

**Created**: January 6, 2026
**Status**: Planned (Sprint 10+)
**Priority**: P1 - High
**Estimated Points**: 21 pts

---

## Problem Statement

### Current Issues
1. **500 errors instead of 403** - Permission denials crash the server instead of returning clear error messages
2. **Field naming mismatch** - User model has `managed_businesses`, routes reference `managed_companies`
3. **No domain-based company recognition** - Users can't auto-join companies based on email domain
4. **Consultant access unclear** - No clear model for which companies a consultant can access
5. **Company ownership ambiguous** - No clear owner/creator tracking

### User-Reported Scenario
A consultant logs in for a company but has no permission to add company details. The error is unclear (500 instead of 403 with helpful message).

---

## Proposed Solution

### 1. Company Model Enhancements

```javascript
// server/models/Company.js - NEW FIELDS

{
  // Ownership & Management
  created_by: {
    type: ObjectId,
    ref: 'User',
    required: true,
    description: 'User who originally created this company'
  },

  owner_id: {
    type: ObjectId,
    ref: 'User',
    required: true,
    description: 'Current BUSINESS_OWNER with full control'
  },

  managed_by: [{
    type: ObjectId,
    ref: 'User',
    description: 'Consultants with access to this company'
  }],

  // Domain-based auto-join
  verified_domains: [{
    type: String,
    lowercase: true,
    description: 'Email domains that auto-join this company (e.g., compx.com)'
  }],

  // Company type
  is_personal: {
    type: Boolean,
    default: false,
    description: 'True for solo users with personal email domains'
  },

  // Join settings
  join_settings: {
    default_role: {
      type: String,
      enum: ['EMPLOYEE', 'MANAGER', 'EXECUTIVE'],
      default: 'EMPLOYEE',
      description: 'Default role for users who auto-join via domain'
    },
    allow_domain_auto_join: {
      type: Boolean,
      default: true
    },
    require_approval: {
      type: Boolean,
      default: false,
      description: 'Require owner approval before auto-join completes'
    }
  }
}
```

### 2. User Model Fix

```javascript
// server/models/User.js - FIX NAMING

// RENAME: managed_businesses → managed_companies (for consistency)
// OR update all route references to use managed_businesses

managed_companies: [{
  type: ObjectId,
  ref: 'Company',
  description: 'Companies this consultant can access'
}]
```

### 3. Permission Middleware

```javascript
// server/middleware/companyAccess.js - NEW FILE

const Company = require('../models/Company');

/**
 * Middleware to check if user can access a specific company
 * Returns 403 with clear error message if access denied
 */
async function canAccessCompany(req, res, next) {
  const targetCompanyId = req.params.companyId ||
                          req.params.id ||
                          req.body.company_id ||
                          req.query.company_id;

  const user = req.user;

  // If no specific company requested, use user's home company
  if (!targetCompanyId) {
    req.targetCompanyId = user.company_id;
    return next();
  }

  // Check 1: Is it their home company?
  if (user.company_id?.toString() === targetCompanyId.toString()) {
    req.targetCompanyId = targetCompanyId;
    return next();
  }

  // Check 2: For consultants - is it in their managed_companies?
  if (user.role === 'CONSULTANT') {
    const managedIds = (user.managed_companies || []).map(id => id.toString());

    if (managedIds.includes(targetCompanyId.toString())) {
      req.targetCompanyId = targetCompanyId;
      return next();
    }

    // Also check if they created this company
    const company = await Company.findById(targetCompanyId);
    if (company?.created_by?.equals(user._id)) {
      req.targetCompanyId = targetCompanyId;
      return next();
    }
  }

  // Access denied - with CLEAR error message
  return res.status(403).json({
    success: false,
    error: 'ACCESS_DENIED',
    message: 'You do not have permission to access this company',
    details: {
      your_role: user.role,
      your_company: user.company_id,
      requested_company: targetCompanyId,
      is_consultant: user.role === 'CONSULTANT',
      managed_count: user.managed_companies?.length || 0
    },
    suggestion: user.role === 'CONSULTANT'
      ? 'This company is not in your managed companies. Request access from system admin.'
      : 'You can only access your own company. Contact your administrator.'
  });
}

module.exports = { canAccessCompany };
```

### 4. Signup Flow Enhancement

```javascript
// server/routes/auth.js - ENHANCED SIGNUP

const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in',
  'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'protonmail.com', 'proton.me',
  'zoho.com', 'mail.com', 'gmx.com', 'gmx.net'
];

async function handleSignup(userData) {
  const { email, first_name, last_name } = userData;
  const domain = email.split('@')[1]?.toLowerCase();

  // Step 1: Check if personal email domain
  if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
    // Create personal company
    const company = await Company.create({
      name: `${first_name}'s Company`,
      is_personal: true,
      verified_domains: [], // No auto-join for personal companies
      created_by: null, // Will be set after user creation
      owner_id: null
    });

    const user = await User.create({
      ...userData,
      company_id: company._id,
      role: 'BUSINESS_OWNER'
    });

    // Update company with owner
    company.created_by = user._id;
    company.owner_id = user._id;
    await company.save();

    return { user, company, joined: 'created_personal' };
  }

  // Step 2: Check if domain exists in any company
  const existingCompany = await Company.findOne({
    verified_domains: domain,
    'join_settings.allow_domain_auto_join': true
  });

  if (existingCompany) {
    // Auto-join existing company
    const user = await User.create({
      ...userData,
      company_id: existingCompany._id,
      role: existingCompany.join_settings.default_role || 'EMPLOYEE',
      status: existingCompany.join_settings.require_approval ? 'pending_approval' : 'active'
    });

    return { user, company: existingCompany, joined: 'auto_joined' };
  }

  // Step 3: Create new company with this domain
  const company = await Company.create({
    name: `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} Company`,
    is_personal: false,
    verified_domains: [domain],
    created_by: null,
    owner_id: null
  });

  const user = await User.create({
    ...userData,
    company_id: company._id,
    role: 'BUSINESS_OWNER'
  });

  company.created_by = user._id;
  company.owner_id = user._id;
  await company.save();

  return { user, company, joined: 'created_new' };
}
```

---

## User Stories

### US-1: Clear Permission Errors (3 pts)
**As a** user with insufficient permissions
**I want** to see a clear error message explaining why I can't access something
**So that** I know what to do next

**Acceptance Criteria:**
- [ ] 403 errors include `error`, `message`, `details`, and `suggestion` fields
- [ ] Error messages explain the user's role and what role is required
- [ ] No more 500 errors for permission issues

### US-2: Consultant Multi-Company Access (5 pts)
**As a** consultant
**I want** to access only companies I manage
**So that** I don't see unrelated client data

**Acceptance Criteria:**
- [ ] Consultant can only see companies in their `managed_companies` array
- [ ] Consultant automatically added to `managed_companies` when creating a company
- [ ] Company list filtered by managed_companies

### US-3: Domain Auto-Join (8 pts)
**As a** new user signing up with a corporate email
**I want** to automatically join my company if it exists
**So that** I don't need to wait for an invitation

**Acceptance Criteria:**
- [ ] User with `@compx.com` auto-joins company with `verified_domains: ['compx.com']`
- [ ] Auto-joined users get `default_role` from company settings
- [ ] Personal email domains create personal companies instead
- [ ] Company owner can configure default role and approval requirement

### US-4: Personal Company Support (3 pts)
**As a** solo user with a personal email
**I want** to create my own company space
**So that** I can use Karvia without a corporate email

**Acceptance Criteria:**
- [ ] Gmail/Outlook/etc users create "personal" companies
- [ ] Personal companies marked with `is_personal: true`
- [ ] Personal companies don't allow domain auto-join

### US-5: Company Ownership Transfer (2 pts)
**As a** consultant
**I want** to transfer company ownership to a BUSINESS_OWNER
**So that** the client can manage their own company

**Acceptance Criteria:**
- [ ] Consultant can change `owner_id` to another user
- [ ] New owner must have BUSINESS_OWNER role
- [ ] Audit trail records the transfer

---

## Implementation Phases

### Phase 1: Fix Immediate Issues (3 pts) - Sprint 9 ✅ DONE
- [x] Fix 500 → 403 error with clear messages
- [x] Give consultants temporary full access
- [x] Document the full solution

### Phase 2: Model Updates (5 pts) - Sprint 10
- [ ] Add `created_by`, `owner_id`, `managed_by` to Company model
- [ ] Add `verified_domains` and `join_settings` to Company model
- [ ] Rename `managed_businesses` to `managed_companies` in User model
- [ ] Update index for `managed_companies`

### Phase 3: Permission Middleware (5 pts) - Sprint 10
- [ ] Create `canAccessCompany` middleware
- [ ] Update all company routes to use middleware
- [ ] Update all routes that need company access check

### Phase 4: Signup Flow (8 pts) - Sprint 11
- [ ] Implement domain extraction and classification
- [ ] Implement auto-join logic
- [ ] Implement personal company creation
- [ ] Add company settings UI for default role

---

## Files to Modify

| File | Changes |
|------|---------|
| `server/models/Company.js` | Add ownership and domain fields |
| `server/models/User.js` | Rename managed_businesses → managed_companies |
| `server/middleware/companyAccess.js` | NEW - permission middleware |
| `server/routes/companies.js` | Use new middleware, remove temporary fixes |
| `server/routes/auth.js` | Enhanced signup flow |
| `client/pages/company-settings.html` | NEW - domain and join settings UI |

---

## Testing Checklist

### Permission Tests
- [ ] Non-consultant accessing other company → 403 with clear message
- [ ] Consultant accessing managed company → 200
- [ ] Consultant accessing non-managed company → 403 with clear message
- [ ] BUSINESS_OWNER accessing own company → 200

### Domain Auto-Join Tests
- [ ] User with `@compx.com` joins existing company → Success
- [ ] User with `@gmail.com` creates personal company → Success
- [ ] User with new domain creates new company → Success
- [ ] Auto-joined user gets correct default role

### Ownership Tests
- [ ] Company creator automatically becomes owner
- [ ] Consultant can transfer ownership
- [ ] Transfer audit trail is recorded

---

## Current Temporary Fix (Sprint 9)

**File**: `server/routes/companies.js`

**What we did**:
1. Removed broken `managed_companies.some()` calls
2. Gave consultants full access to ALL companies
3. Added `TODO` comments referencing this document

**Why temporary**:
- Security risk: Consultants can see all companies
- No audit trail for access
- No domain-based recognition

**When to replace**:
- Sprint 10: Implement Phase 2 & 3
- Sprint 11: Implement Phase 4

---

## References

- Discussion: Sprint 9 Session (Jan 6, 2026)
- Related: CLAUDE.md Role-Based Access Control section
- Related: User model at `server/models/User.js:72-77`
