# Joi Validation Route Integration Checklist

**Created**: October 17, 2025
**Status**: Pending (~1 hour of work remaining)
**Context**: DEV-W2-010 - Validation infrastructure complete, route integration pending

---

## 📋 Routes Requiring Validation

### **Priority 1: Critical Security Endpoints (30 min)**

#### `server/routes/auth.js`
- [ ] **POST /api/auth/signup** → Use `validateBody(userValidator.signupSchema)`
  - Validates: email, password, name, business_name, role
- [ ] **POST /api/auth/login** → Use `validateBody(userValidator.loginSchema)`
  - Validates: email, password
- [ ] **POST /api/auth/change-password** → Use `validateBody(userValidator.changePasswordSchema)`
  - Validates: current_password, new_password, confirm_password

**Import**:
```javascript
const { validateBody } = require('../middleware/validate');
const userValidator = require('../validators/user.validator');
```

**Example Integration**:
```javascript
router.post('/signup',
  validateBody(userValidator.signupSchema),
  async (req, res) => {
    // req.body is now validated and sanitized
    // ...existing signup logic
  }
);
```

---

#### `server/routes/invitations.js`
- [ ] **POST /api/invitations/create** → Use `validateBody(invitationValidator.createInvitationSchema)`
  - Validates: recipient_email, template_id, recipient_role, due_date, custom_message
- [ ] **POST /api/invitations/create/bulk** → Use `validateBody(invitationValidator.createBulkInvitationsSchema)`
  - Validates: invitations array (max 100), template_id, due_date
- [ ] **GET /api/invitations/validate/:token** → Use `validateParams(invitationValidator.tokenParamSchema)`
  - Validates: token (64-char hex)
- [ ] **POST /api/invitations/accept/:token** → Use `validateParams(invitationValidator.tokenParamSchema)`
  - Validates: token
- [ ] **GET /api/invitations** → Use `validateQuery(invitationValidator.queryInvitationsSchema)`
  - Validates: status, template_id, page, limit, sort_by, sort_order

**Import**:
```javascript
const { validateBody, validateParams, validateQuery } = require('../middleware/validate');
const invitationValidator = require('../validators/invitation.validator');
```

---

#### `server/routes/assessmentTemplates.js`
- [ ] **POST /api/assessment-templates** → Use `validateBody(templateValidator.createTemplateSchema)`
  - Validates: template_name, dimensions (weights sum to 1.0, no duplicates, min 10 questions)
- [ ] **PUT /api/assessment-templates/:id** → Use:
  - `validateParams(Joi.object({ id: objectId() }))`
  - `validateBody(templateValidator.updateTemplateSchema)`
- [ ] **POST /api/assessment-templates/:id/duplicate** → Use:
  - `validateParams(Joi.object({ id: objectId() }))`
  - `validateBody(templateValidator.duplicateTemplateSchema)`
- [ ] **GET /api/assessment-templates** → Use `validateQuery(templateValidator.queryTemplatesSchema)`
  - Validates: assessment_type, is_active, page, limit, sort_by

**Import**:
```javascript
const { validateBody, validateParams, validateQuery } = require('../middleware/validate');
const templateValidator = require('../validators/template.validator');
const { objectId } = require('../middleware/validate');
const Joi = require('joi');
```

---

### **Priority 2: Business Management (15 min)**

#### `server/routes/business.js` (if exists)
- [ ] **POST /api/business** → Use `validateBody(businessValidator.createBusinessSchema)`
  - Validates: business_name, industry, employee_count (handles string "123" → number 123)
- [ ] **PUT /api/business/:id** → Use:
  - `validateParams(Joi.object({ id: objectId() }))`
  - `validateBody(businessValidator.updateBusinessSchema)`
- [ ] **GET /api/businesses** → Use `validateQuery(businessValidator.queryBusinessesSchema)`

**Import**:
```javascript
const { validateBody, validateParams, validateQuery } = require('../middleware/validate');
const businessValidator = require('../validators/business.validator');
```

---

### **Priority 3: User Management (15 min)**

#### `server/routes/users.js` (if exists)
- [ ] **PUT /api/users/profile** → Use `validateBody(userValidator.updateProfileSchema)`
  - Validates: name, phone, job_title, department
- [ ] **PUT /api/users/:id/role** → Use:
  - `validateParams(Joi.object({ id: objectId() }))`
  - `validateBody(userValidator.updateRoleSchema)`
- [ ] **GET /api/users** → Use `validateQuery(userValidator.queryUsersSchema)`
  - Validates: role, business_id, status, search, page, limit

---

## 🔧 Integration Pattern

### **Standard Pattern**:
```javascript
// 1. Import validators at top of route file
const { validateBody, validateParams, validateQuery } = require('../middleware/validate');
const userValidator = require('../validators/user.validator');

// 2. Add validation middleware BEFORE route handler
router.post('/endpoint',
  authenticateToken,              // Auth first
  validateBody(userValidator.signupSchema),  // Validation second
  asyncHandler(async (req, res) => {  // Handler third
    // req.body is validated, sanitized, and type-coerced
    // ValidationError thrown automatically if invalid
  })
);
```

### **Error Handling**:
- Validation errors automatically throw `ValidationError` with field details
- Error handler middleware catches and returns structured response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body validation failed",
    "statusCode": 400,
    "details": [
      {
        "field": "email",
        "message": "must be a valid email",
        "type": "string.email"
      }
    ]
  }
}
```

---

## ✅ Testing Checklist

After integration, test each endpoint:

- [ ] Test with valid data → Should pass validation
- [ ] Test with missing required fields → Should return 400 with field details
- [ ] Test with invalid email format → Should return 400
- [ ] Test with weak password → Should return 400 with password requirements
- [ ] Test with invalid ObjectId → Should return 400
- [ ] Test with dimension weights ≠ 1.0 → Should return 400
- [ ] Test with duplicate questions → Should return 400
- [ ] Test with XSS payload in string fields → Should sanitize (strip tags)
- [ ] Test with SQL injection in string fields → Should sanitize

---

## 📊 Progress Tracking

**Total Endpoints**: ~15
**Estimated Time**: 4 min/endpoint = 60 minutes
**Priority**: P1 (HIGH - Security)

**Completion**: 0/15 (0%)
- [ ] Auth routes (3 endpoints)
- [ ] Invitation routes (5 endpoints)
- [ ] Template routes (4 endpoints)
- [ ] Business routes (3 endpoints - if exists)
- [ ] User routes (3 endpoints - if exists)

---

## 📝 Notes

- All validators handle type coercion (e.g., `"25"` → `25`)
- All validators strip unknown fields for security
- All validators trim whitespace from strings
- Template validator validates business logic (weights, duplicates, minimums)
- Integration is mechanical - copy/paste pattern above
- Can be done incrementally (one route file at a time)

---

**Status**: Ready for integration
**Next Step**: Start with Priority 1 routes (auth, invitations, templates)
**Reference**: DEV-W2-010 in WEEK_2_DETAILED_PLAN.md
