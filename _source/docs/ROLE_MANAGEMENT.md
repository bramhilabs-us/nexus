# Role Management Guide

This document describes the role system in Karvia Business and how to add new roles.

## Current Role System

### Active Roles (Visible in UI)

| Role | Level | Description | Use Case |
|------|-------|-------------|----------|
| **CONSULTANT** | 6 | Highest privilege | External advisors managing multiple companies |
| **BUSINESS_OWNER** | 5 | Full company access | Company owners who sign up or are invited |
| **MANAGER** | 3 | Team management | Team/department managers |
| **EMPLOYEE** | 1 | Basic access | Individual contributors |

### Reserved Roles (Hidden from UI)

| Role | Level | Description | Future Use |
|------|-------|-------------|------------|
| **EXECUTIVE** | 4 | C-level access | C-level executives who aren't owners |

## Role Hierarchy

```
CONSULTANT (6) → Can manage multiple companies
    ↓
BUSINESS_OWNER (5) → Owns single company, full access
    ↓
EXECUTIVE (4) → Reserved for future (hidden)
    ↓
MANAGER (3) → Team management
    ↓
EMPLOYEE (1) → Individual contributor
```

## Files to Update When Adding a New Role

### 1. Backend Model
**File**: `server/models/User.js`
```javascript
// Line ~74: Add to enum
role: {
  type: String,
  enum: ['CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE', 'NEW_ROLE'],
  default: 'EMPLOYEE'
}

// Line ~349: Add role level
'NEW_ROLE': X,  // Set appropriate level
```

### 2. Backend Validators
**Files**:
- `server/validators/user.validator.js` - Add to USER_ROLES array
- `server/validators/invitation.validator.js` - Add to USER_ROLES array

### 3. Role Guards Middleware
**File**: `server/middleware/roleGuards.js`
```javascript
const ROLES = {
  CONSULTANT: 'CONSULTANT',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  EXECUTIVE: 'EXECUTIVE',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  NEW_ROLE: 'NEW_ROLE'  // Add here
};
```

### 4. Route Permissions
Update `requireRole()` calls in relevant route files:
- `server/routes/goals.js`
- `server/routes/tasks.js`
- `server/routes/objectives.js`
- `server/routes/companies.js`
- `server/routes/teams.js`
- `server/routes/assessments.js`
- `server/routes/analytics.js`
- `server/routes/diagnostic-reports.js`

### 5. Frontend Navigation
**File**: `client/js/navigation.js`
```javascript
// Add navigation items for the new role
NEW_ROLE: [
  { label: 'Dashboard', href: '/pages/dashboard.html', enabled: true },
  // ... other nav items
]
```

### 6. Frontend Auth Check
**File**: `client/js/auth-check.js`
```javascript
// Update roleRestrictions if the new role needs page access
const roleRestrictions = {
  '/pages/some-page.html': ['CONSULTANT', 'BUSINESS_OWNER', 'NEW_ROLE'],
  // ...
};
```

### 7. UI Role Selectors (if visible)
**Files**:
- `client/pages/signup.html` - Role dropdown
- `client/pages/assessment-creation-flow.html` - Recipient role dropdown
- `client/pages/invitation-accept.html` - Redirect logic

### 8. Invitation Model
**File**: `server/models/Invitation.js`
```javascript
recipient_role: {
  type: String,
  enum: ['CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE', 'NEW_ROLE'],
  default: 'EMPLOYEE'
}
```

### 9. Team Model
**File**: `server/models/Team.js`
```javascript
// Update member role enum if applicable
role: {
  enum: ['BUSINESS_OWNER', 'EXECUTIVE', 'MANAGER', 'EMPLOYEE', 'NEW_ROLE']
}
```

## Adding a New Role Checklist

- [ ] Update `server/models/User.js` enum and role level
- [ ] Update `server/validators/user.validator.js`
- [ ] Update `server/validators/invitation.validator.js`
- [ ] Update `server/middleware/roleGuards.js` ROLES constant
- [ ] Update relevant route files with `requireRole()`
- [ ] Add navigation items in `client/js/navigation.js`
- [ ] Update `client/js/auth-check.js` role restrictions
- [ ] Update UI role selectors (if role should be visible)
- [ ] Update `server/models/Invitation.js` enum
- [ ] Update `server/models/Team.js` enum (if applicable)
- [ ] Add tests for the new role
- [ ] Update documentation

## Permission Patterns

### Route-Level Protection (Middleware)
```javascript
// Use requireRole() middleware for route protection
router.post('/endpoint',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER', 'MANAGER'),
  handler
);
```

### Inline Permission Checks
```javascript
// For granular checks within handlers
const canAccess = ['CONSULTANT', 'BUSINESS_OWNER', 'MANAGER'].includes(req.user.role);
if (!canAccess) {
  return res.status(403).json({ error: 'Insufficient permissions' });
}
```

### Frontend Role Checks
```javascript
// In page scripts
const user = JSON.parse(localStorage.getItem('karvia_user'));
if (!['BUSINESS_OWNER', 'MANAGER'].includes(user.role)) {
  // Hide or disable feature
}
```

## Best Practices

1. **Always use middleware** for route protection when possible
2. **Don't hardcode role checks** - use the ROLES constant from roleGuards.js
3. **Test all role combinations** when adding new features
4. **Document role requirements** in route comments
5. **Keep EXECUTIVE hidden** until there's a clear use case

---

*Last Updated: December 3, 2025*
*Sprint 8: Role Standardization (BUG-S8-2)*
