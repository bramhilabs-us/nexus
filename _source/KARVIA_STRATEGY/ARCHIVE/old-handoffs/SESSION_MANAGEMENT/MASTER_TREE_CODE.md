# MASTER_TREE_CODE - Code Hierarchy & Modification Tracking

**Last Updated**: November 6, 2025 - Sprint 1 Day 5
**Session**: SPRINT-1-DAY-5-CONSULTANT-AUTH-FIX
**Purpose**: Complete hierarchical map of ALL code showing parent-child relationships, module links, and modification history
**Auto-Updated**: End of every session by `end-session.js`

---

## 📖 How to Read This Tree

### Symbols
- `📁` = Folder (parent)
- `📄` = Code file
- `├─` = Child item
- `└─` = Last child item
- `→` = Imports from / Depends on
- `←` = Imported by / Used by
- `🔗` = Bidirectional dependency
- `⏰` = Last modified
- `📝` = Why modified (links to handoff)
- `✨` = Created this session
- `🔧` = Modified this session
- `⭐` = Critical file
- `⚠️` = Needs attention/TODO

---

## 📊 Session Modification Summary

**Session ID**: SPRINT-1-DAY-5-CONSULTANT-AUTH-FIX
**Date**: November 6, 2025
**Handoff Doc**: → [SPRINT_1_DAY_5_HANDOFF.md](./sessions/SPRINT-1-DAY-5/HANDOFF.md)

### This Session Changes
- **Created**: 0 code files
- **Modified**: 4 code files
- **Deleted**: 0 code files

### Files Modified This Session
1. 🔧 `/server/routes/assessmentTemplates.js` (lines 44-53, 293-318)
   - Why: Fixed consultant template access to include own company_id
   - [Details](#server-routes-assessmentTemplates.js)

2. 🔧 `/client/pages/assessment-hub.html` (line 672)
   - Why: Fixed localStorage token key from 'token' to 'karvia_auth_token'
   - [Details](#client-pages-assessment-hub.html)

3. 🔧 `/server/services/mailjetService.js` (lines 387, 438)
   - Why: Added missing to_email parameter to email template function
   - [Details](#server-services-mailjetService.js)

4. 🔧 `/server/routes/invitations.js` (lines 979-983)
   - Why: Added default test password 'Karvia2025!' for consultant-created companies
   - [Details](#server-routes-invitations.js)

---

## 🎯 FEATURE FLAGS

**Purpose**: Instant feature availability check - know exactly what's enabled and where to find it

| Flag Name | Current Value | File Location | Line | Used By | Fallback Strategy |
|-----------|---------------|---------------|------|---------|-------------------|
| **FEATURE_OPENAI_ENABLED** | `true` | `.env` | 26 | `server/services/aiOKRService.js:16`<br>`server/services/feature-flags.js:26` | Template-based OKR generation |
| **FEATURE_EMAIL_ENABLED** | `true` | `.env` | 53 | `server/services/feature-flags.js:56` | Manual invitation links |
| **FEATURE_REDIS_ENABLED** | *(not set)* | `.env` | - | `server/services/feature-flags.js:41` | In-memory caching |
| **FEATURE_IBRAIN_ENABLED** | *(not set)* | `.env` | - | `server/services/feature-flags.js:74` | Standard tracking (no AI agents) |

### Configuration Dependencies

**FEATURE_OPENAI_ENABLED** requires:
- `OPENAI_API_KEY` (.env:22)
- `OPENAI_MODEL` (.env:23) - Default: `gpt-4-turbo-preview`
- `OPENAI_MAX_TOKENS` (.env:24) - Default: `2500`
- `OPENAI_TEMPERATURE` (.env:25) - Default: `0.7`

**FEATURE_EMAIL_ENABLED** requires:
- `SMTP_HOST` (not in .env - needs addition)
- `SMTP_USER` (not in .env - needs addition)
- `SMTP_PASS` (not in .env - needs addition)
- `MAILJET_API_KEY` (references in scripts/testMailjet.js:13)
- `MAILJET_API_SECRET` (references in scripts/testMailjet.js:14)

**FEATURE_REDIS_ENABLED** requires:
- `REDIS_URL` (.env:14) - Default: `redis://localhost:6379`

**FEATURE_IBRAIN_ENABLED** requires:
- `IBRAIN_WEBHOOK_URL` (not in .env - needs addition)

### Feature Flag Management

**Central Service**: [server/services/feature-flags.js](server/services/feature-flags.js)
- Lines 7-17: Flag initialization
- Lines 23-88: Feature validation logic
- Lines 96-108: `isEnabled(featureName)` checker
- Lines 137-164: Convenience methods (`hasOpenAI()`, `hasRedis()`, etc.)

**Usage Pattern**:
```javascript
const featureFlags = require('./services/feature-flags');
if (featureFlags.hasOpenAI()) {
  // Use OpenAI
} else {
  // Use fallback (template-based)
}
```

**Where Checked**:
- `server/services/aiOKRService.js:16` - Checks FEATURE_OPENAI_ENABLED
- `server/middleware/authGuards.js:48` - References IAM_ENGINE_URL
- `server/services/cascade-engine.js:19` - References PLANNER_ENGINE_URL
- `server/services/progress-tracker.js:20` - References SCORING_ENGINE_URL

---

## 🔧 ACTIVE VARIABLES

**Purpose**: Frequently modified variables with exact locations - no searching required

### Authentication Variables

| Variable Name | Type | Purpose | Primary Location | All Usage Locations |
|---------------|------|---------|------------------|---------------------|
| **karvia_auth_token** | `string` | JWT token storage key in localStorage | `client/js/auth-check.js:36` (getToken) | **Read**: `client/js/auth-check.js:36`, `client/pages/assessment-hub.html:672`, `client/pages/scripts/teams.js:75,461,592`, `client/pages/scripts/team-ssi-view.js:45,278,387,425`, `client/js/objectives-api-client.js:17,61,104,149,194,237`, `client/js/team-api-client.js:14,59,103,146,191,234,279`, `client/js/assessment-api-client.js:11`<br>**Write**: `client/pages/signup.html:626`, `client/pages/login.html:553`, `client/js/auth-check.js:60`<br>**Delete**: `client/js/auth-check.js:75`, `client/js/navigation.js:242` |
| **JWT_SECRET** | `string` (128 chars) | JWT signing/verification secret | `.env:17` | **Sign**: `server/routes/auth.js:121,221`, `server/routes/invitations.js:265`, `engines/iam/index.js:119`<br>**Verify**: `server/middleware/authGuards.js:55,160,238`, `engines/iam/index.js:131`, `engines/observer/services/IAMService.js:114` |
| **access_token** | `string` | OAuth/legacy token (⚠️ mixed usage) | Varies | **Usage**: `client/pages/scripts/okr-creation-wizard.js:272,298,467,652`, `client/pages/scripts/executive-dashboard.js:93,108,123,138,153`, `client/pages/scripts/business-assessment.js:427,542` |
| **karvia_user** | `JSON string` | User object in localStorage | `client/pages/scripts/team-ssi-view.js:19` | **Read**: `client/pages/scripts/team-ssi-view.js:19`, `client/pages/scripts/executive-dashboard.js:49`, `client/pages/scripts/analytics-dashboard.js:22` |

**⚠️ CRITICAL NOTE**:
- Most code uses `karvia_auth_token` (correct ✅)
- Some legacy code uses `access_token` or `authToken` (⚠️ inconsistent)
- **Recent Fix** (Session SPRINT-1-DAY-5): Changed `client/pages/assessment-hub.html:672` from `'token'` to `'karvia_auth_token'`

### Environment Configuration Variables

| Variable Name | Type | Default Value | File Location | Primary Usage |
|---------------|------|---------------|---------------|---------------|
| **NODE_ENV** | `string` | `development` | `.env:5` | `server/database/index.js:86,87,152`, `server/middleware/errorHandler.js:9`, `server/middleware/rateLimiting.js:13`, `server/services/secretsManager.js:27,75,98`, `server/services/feature-flags.js:220,240` |
| **PORT** | `number` | `8080` | `.env:7` | `server/index.js` (main server entry point) |
| **MONGODB_URI** | `string` | (connection string) | `.env:13` | `server/database/index.js`, `scripts/validateSeededData.js:19`, `server/scripts/getTestIds.js:8` |

### Engine URLs (Service Discovery)

| Variable Name | Default Value | File Location | Primary Usage |
|---------------|---------------|---------------|---------------|
| **IAM_ENGINE_URL** | `http://127.0.0.1:8081` | `.env:29` | `server/middleware/authGuards.js:48,299` |
| **PLANNER_ENGINE_URL** | `http://localhost:8083` | `.env:31` | `server/services/cascade-engine.js:19` |
| **SCORING_ENGINE_URL** | `http://localhost:8084` | `.env:32` | `server/services/progress-tracker.js:20` |
| **ASSESSMENT_ENGINE_URL** | `http://localhost:8082` | `.env:30` | (planned usage) |
| **OBSERVER_ENGINE_URL** | `http://localhost:8085` | `.env:33` | (planned usage) |
| **TRACKING_ENGINE_URL** | `http://localhost:8086` | `.env:34` | (planned usage) |

### API Configuration Variables

| Variable Name | Type | File Location | Primary Usage |
|---------------|------|---------------|---------------|
| **OPENAI_API_KEY** | `string` (token) | `.env:22` | `server/services/aiOKRService.js:21`, validated by `server/services/feature-flags.js:32` |
| **OPENAI_MODEL** | `string` | `.env:23` | Default: `gpt-4-turbo-preview` |
| **OPENAI_MAX_TOKENS** | `number` | `.env:24` | Default: `2500` |
| **OPENAI_TEMPERATURE** | `number` | `.env:25` | Default: `0.7` |

**Usage Pattern for Auth**:
```javascript
// ✅ CORRECT (use everywhere)
const token = localStorage.getItem('karvia_auth_token');
fetch('/api/endpoint', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// ❌ INCORRECT (legacy code - avoid)
const token = localStorage.getItem('access_token'); // Wrong key
```

**Usage Pattern for Environment**:
```javascript
// Server-side
const env = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'karvia-business-secret'; // Fallback for dev only
```

---

## 📍 CURRENT WORK AREAS

**Purpose**: What to work on, what not to break, and exact copy-paste patterns

### 🔴 High Priority (Do First)

#### 1. `client/js/weekly-goals.js` - NOT STARTED
**Status**: File created (empty), needs implementation
**Pattern to Follow**: [client/js/quarterly-goals.js:1-450](../../client/js/quarterly-goals.js) (COMPLETE)
**Exact Implementation Steps**:
1. Copy structure from `quarterly-goals.js`
2. Change API endpoint: `/api/objectives/quarterly` → `/api/objectives/weekly`
3. Change view type: `quarter` → `week`
4. Adjust date ranges: 3 months → 7 days
5. Key functions to implement:
   - `loadWeeklyGoals()` - Pattern: quarterly-goals.js:45-89
   - `renderCalendarView()` - Pattern: quarterly-goals.js:120-180
   - `handleDragDrop()` - Pattern: quarterly-goals.js:245-290
   - `updateGoalProgress()` - Pattern: quarterly-goals.js:330-370

**API Dependencies**:
- GET `/api/objectives/weekly` (exists in server/routes/objectives.js)
- POST `/api/objectives` (exists)
- PATCH `/api/objectives/:id` (exists)

**Don't Break**:
- `client/js/quarterly-goals.js` (working correctly)
- Auth pattern: `localStorage.getItem('karvia_auth_token')` ✅

---

#### 2. `client/js/goal-details.js` - NOT STARTED
**Status**: File created (empty), needs implementation
**Pattern to Follow**: Mix of [client/js/quarterly-goals.js:1-450](../../client/js/quarterly-goals.js) + [client/pages/scripts/team-ssi-view.js:1-450](../../client/pages/scripts/team-ssi-view.js)
**Exact Implementation Steps**:
1. Load single goal by ID from URL param: `?goal_id=xxx`
2. Display goal details (title, description, dates, progress)
3. Show key results with progress bars
4. Add comments/notes section
5. Add activity timeline

**API Dependencies**:
- GET `/api/objectives/:id` (exists in server/routes/objectives.js)
- PATCH `/api/objectives/:id` (exists)
- POST `/api/objectives/:id/keyresults` (exists)

**Don't Break**:
- Existing goal pages (quarterly-goals.html, weekly-goals.html)

---

### 🟡 Medium Priority (After High Priority)

#### 3. Business API Endpoints - MISSING 6 ENDPOINTS
**Status**: Backend API incomplete for multi-tenant support
**Files to Modify**: `server/routes/business.js`
**Missing Endpoints**:
1. GET `/api/business/:id` - Get single business (line 45 - add after line 44)
2. PATCH `/api/business/:id` - Update business (line 80 - add after line 79)
3. DELETE `/api/business/:id` - Soft delete (line 120 - add after line 119)
4. GET `/api/business/:id/users` - List users (line 160 - add new)
5. GET `/api/business/:id/teams` - List teams (line 200 - add new)
6. GET `/api/business/:id/stats` - Business stats (line 240 - add new)

**Pattern to Follow**: `server/routes/auth.js` (has complete CRUD)

**Don't Break**:
- Existing POST `/api/business` (line 15-44 - working)
- Authentication middleware (authGuards.js)

---

#### 4. Consultant Auth Bug - FIXED BUT TEST NEEDED
**Status**: ✅ Fixed in Session SPRINT-1-DAY-5, needs verification
**Files Modified**:
- `server/routes/assessmentTemplates.js:44-53,293-318`
- `server/routes/invitations.js:979-983`
- `client/pages/assessment-hub.html:672`
- `server/services/mailjetService.js:387,438`

**Test Steps**:
1. Login as consultant user
2. Navigate to Assessment Hub
3. Try to view templates
4. Should see: Own company templates + templates created by consultant
5. Should NOT see: Templates from other companies

**Don't Break**:
- Existing consultant workflow
- Token key: `karvia_auth_token` (recently fixed)

---

### 🟢 Low Priority (Nice to Have)

#### 5. Weekly Goals CSS - MISSING STYLES
**Status**: File doesn't exist, needs creation
**Pattern to Follow**: [client/css/quarterly-goals.css:1-350](../../client/css/quarterly-goals.css) (COMPLETE)
**Implementation**: Copy quarterly-goals.css and adjust class names from `.quarterly-*` to `.weekly-*`

#### 6. Goal Details CSS - MISSING STYLES
**Status**: File doesn't exist, needs creation
**Pattern to Follow**: Mix of quarterly-goals.css + existing detail pages

---

### ⚠️ DO NOT MODIFY (Recently Fixed)

| File | Lines | What Was Fixed | Session |
|------|-------|----------------|---------|
| `client/pages/assessment-hub.html` | 672 | localStorage token key: `'token'` → `'karvia_auth_token'` | SPRINT-1-DAY-5 |
| `server/routes/assessmentTemplates.js` | 44-53, 293-318 | Consultant template access query | SPRINT-1-DAY-5 |
| `server/routes/invitations.js` | 979-983 | Default password for consultant companies | SPRINT-1-DAY-5 |
| `server/services/mailjetService.js` | 387, 438 | Missing to_email parameter | SPRINT-1-DAY-5 |

**Recent Git Changes** (not committed yet):
```
M .claude/3-CLAUDE_AI/claude-automation/README.md
M .claude/3-CLAUDE_AI/claude-automation/end-session.js
M .session-config.json (new file)
M KARVIA_STRATEGY/3-DELIVERY/handoffs/SESSION_MANAGEMENT/MASTER_TREE_CODE.md (this file)
```

---

### 🎨 Copy-Paste Patterns (Similar Code Templates)

#### Pattern 1: Auth Token Usage (Client-Side)
```javascript
// ✅ CORRECT - Use this pattern everywhere
const token = localStorage.getItem('karvia_auth_token');
const response = await fetch('/api/endpoint', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

**Examples in Codebase**:
- `client/js/objectives-api-client.js:17`
- `client/js/team-api-client.js:14`
- `client/pages/scripts/teams.js:75`

---

#### Pattern 2: JWT Verification (Server-Side)
```javascript
// Pattern: server/middleware/authGuards.js:55
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'karvia-business-secret');
```

**Examples in Codebase**:
- `server/middleware/authGuards.js:55,160,238`
- `engines/iam/index.js:131`

---

#### Pattern 3: Feature Flag Check
```javascript
// Pattern: server/services/aiOKRService.js:16
const featureFlags = require('./services/feature-flags');
if (featureFlags.hasOpenAI()) {
    // Use OpenAI
} else {
    // Use fallback
}
```

**Examples in Codebase**:
- `server/services/aiOKRService.js:16-21`
- `server/services/feature-flags.js:137-164`

---

#### Pattern 4: MongoDB Query with Multi-Tenant Filter
```javascript
// Pattern: server/routes/assessmentTemplates.js:45-52
const query = {
    $or: [
        { company_id: user.company_id },              // Own company
        { created_by: user.user_id },                 // Created by user
        { is_public: true }                           // Public templates
    ]
};
const results = await Model.find(query);
```

**Use This For**:
- Business API endpoints (new)
- Team queries (existing)
- Objective queries (existing)

---

## 🌳 MASTER CODE TREE

```
karvia_business/
│
├─ 📁 server/ [PARENT: Main Backend Server] ⭐ PORT 8080
│  │  📝 Purpose: Express REST API, MongoDB integration, business logic
│  │
│  ├─ 📄 index.js ⭐ [SERVER ENTRY POINT]
│  │  ⏰ Oct 2025
│  │  📝 Purpose: Express app initialization, route registration, server start
│  │  → Imports: All route files, config/database.js, middleware/*
│  │  🔗 Starts: HTTP server on port 8080
│  │
│  ├─ 📁 config/
│  │  │
│  │  ├─ 📄 database.js
│  │  │  ⏰ Oct 2025
│  │  │  📝 Purpose: MongoDB connection setup
│  │  │  → Imports: mongoose, dotenv
│  │  │  ← Used by: server/index.js
│  │  │
│  │  └─ 📄 environment.js
│  │     ⏰ Oct 2025
│  │     📝 Purpose: Environment variable handling
│  │     → Imports: dotenv
│  │     ← Used by: All server files
│  │
│  ├─ 📁 middleware/
│  │  │
│  │  ├─ 📄 auth.js ⭐ [AUTHENTICATION]
│  │  │  ⏰ Oct 2025
│  │  │  📝 Purpose: JWT authentication, role-based access control
│  │  │  → Imports: models/User.js, utils/jwt.js
│  │  │  ← Used by: All protected routes
│  │  │  🔗 Functions:
│  │  │     - authenticateToken(req, res, next)
│  │  │     - requireRole(role)
│  │  │
│  │  ├─ 📄 errorHandler.js
│  │  │  ⏰ Oct 2025
│  │  │  📝 Purpose: Global error handling
│  │  │  ← Used by: server/index.js
│  │  │
│  │  └─ 📄 validation.js
│  │     ⏰ Oct 2025
│  │     📝 Purpose: Request validation
│  │     → Imports: express-validator
│  │     ← Used by: All routes with validation
│  │
│  ├─ 📁 models/ [PARENT: Mongoose Data Models]
│  │  │
│  │  ├─ 📄 User.js ⭐ [USER MODEL]
│  │  │  ⏰ Week 1 Day 2
│  │  │  📝 Purpose: User account schema, password hashing, JWT generation
│  │  │  → Imports: mongoose, bcryptjs, jsonwebtoken
│  │  │  ← Used by: routes/auth.js, routes/users.js, middleware/auth.js
│  │  │  🔗 Schema Fields:
│  │  │     - email (unique)
│  │  │     - password (bcrypt hashed)
│  │  │     - name
│  │  │     - role (CONSULTANT, EXECUTIVE, MANAGER, TEAM_LEAD, EMPLOYEE, ADMIN)
│  │  │     - company_id (ref: Company)
│  │  │     - managed_businesses (array of Company refs) [for CONSULTANT]
│  │  │     - status (active, pending_invite, suspended)
│  │  │  🔗 Methods:
│  │  │     - comparePassword(password)
│  │  │     - generateAuthToken()
│  │  │
│  │  ├─ 📄 Company.js ⭐ [COMPANY MODEL]
│  │  │  ⏰ Week 1 Day 2
│  │  │  📝 Purpose: Business/company entity
│  │  │  → Imports: mongoose, utils/businessDefaults.js
│  │  │  ← Used by: services/CompanyCreationService.js, routes/assessmentTemplates.js
│  │  │  🔗 Schema Fields:
│  │  │     - name (unique)
│  │  │     - industry
│  │  │     - employee_count
│  │  │     - size_category (small/medium/large)
│  │  │     - settings (object)
│  │  │
│  │  ├─ 📄 AssessmentTemplate.js
│  │  │  ⏰ Week 2
│  │  │  📝 Purpose: Assessment questionnaire template
│  │  │  → Imports: mongoose
│  │  │  ← Used by: routes/assessmentTemplates.js, routes/assessments.js
│  │  │  🔗 Schema Fields:
│  │  │     - name
│  │  │     - description
│  │  │     - questions (array)
│  │  │     - company_id (ref: Company)
│  │  │     - is_global (boolean)
│  │  │
│  │  ├─ 📄 Assessment.js
│  │  │  ⏰ Week 2
│  │  │  📝 Purpose: Assessment instance (completed/in-progress)
│  │  │  → Imports: mongoose
│  │  │  ← Used by: routes/assessments.js
│  │  │
│  │  ├─ 📄 Invitation.js
│  │  │  ⏰ Week 1 Day 4
│  │  │  📝 Purpose: Company/user invitation tracking
│  │  │  → Imports: mongoose, crypto
│  │  │  ← Used by: routes/invitations.js
│  │  │  🔗 Schema Fields:
│  │  │     - from_user (ref: User)
│  │  │     - to_email
│  │  │     - company_id (ref: Company)
│  │  │     - template_id (ref: AssessmentTemplate)
│  │  │     - status (sent, accepted, expired)
│  │  │     - token (unique)
│  │  │     - expires_at
│  │  │
│  │  ├─ 📄 Objective.js
│  │  │  ⏰ Week 4
│  │  │  📝 Purpose: OKR objective
│  │  │  → Imports: mongoose
│  │  │  ← Used by: routes/objectives.js
│  │  │
│  │  ├─ 📄 KeyResult.js
│  │  │  ⏰ Week 4
│  │  │  📝 Purpose: OKR key result (child of objective)
│  │  │  → Imports: mongoose
│  │  │  ← Used by: routes/objectives.js
│  │  │
│  │  └─ 📄 Team.js
│  │     ⏰ Week 3
│  │     📝 Purpose: Team hierarchy and organization
│  │     → Imports: mongoose
│  │     ← Used by: routes/teams.js
│  │
│  ├─ 📁 routes/ [PARENT: API Route Handlers]
│  │  │
│  │  ├─ 📄 auth.js ⭐ [AUTHENTICATION ENDPOINTS]
│  │  │  ⏰ Week 1 Day 2
│  │  │  📝 Purpose: User authentication API
│  │  │  → Imports: models/User.js, utils/jwt.js, bcryptjs
│  │  │  ← Used by: server/index.js
│  │  │  🔗 Endpoints:
│  │  │     - POST /api/auth/signup
│  │  │     - POST /api/auth/login
│  │  │     - POST /api/auth/verify-token
│  │  │     - GET /api/auth/me
│  │  │  ← Called by: client/js/auth.js
│  │  │
│  │  ├─ 📄 assessmentTemplates.js 🔧 [MODIFIED THIS SESSION]
│  │  │  ⏰ Nov 6, 2025 (Sprint 1 Day 5)
│  │  │  📝 Purpose: Assessment template CRUD
│  │  │  → Imports: models/AssessmentTemplate.js, middleware/auth.js
│  │  │  ← Used by: server/index.js
│  │  │  📝 Modified Lines:
│  │  │     - 44-53: Fixed GET query to include consultant's company_id
│  │  │     - 293-318: Fixed POST authorization to allow consultant's own firm
│  │  │  📝 Why: Consultants couldn't see/save templates for their own company
│  │  │  🔗 Endpoints:
│  │  │     - GET /api/assessment-templates (role-based filtering)
│  │  │     - POST /api/assessment-templates
│  │  │     - GET /api/assessment-templates/:id
│  │  │     - PUT /api/assessment-templates/:id
│  │  │     - DELETE /api/assessment-templates/:id
│  │  │  ← Called by: client/js/assessment-api-client.js
│  │  │
│  │  ├─ 📄 assessments.js
│  │  │  ⏰ Week 2
│  │  │  📝 Purpose: Assessment instance operations
│  │  │  → Imports: models/Assessment.js, models/AssessmentTemplate.js
│  │  │  ← Used by: server/index.js
│  │  │
│  │  ├─ 📄 invitations.js 🔧 [MODIFIED THIS SESSION]
│  │  │  ⏰ Nov 6, 2025 (Sprint 1 Day 5)
│  │  │  📝 Purpose: Company invitation system
│  │  │  → Imports: models/Invitation.js, models/Company.js, models/User.js, services/CompanyCreationService.js, services/mailjetService.js
│  │  │  ← Used by: server/index.js
│  │  │  📝 Modified Lines:
│  │  │     - 979-983: Added default test password 'Karvia2025!'
│  │  │  📝 Why: Simplify testing with consistent password
│  │  │  🔗 Endpoints:
│  │  │     - POST /api/invitations/send-company-invitation
│  │  │        Flow: Create company → Create exec user → Copy template → Send email
│  │  │     - GET /api/invitations/:token
│  │  │     - POST /api/invitations/:token/accept
│  │  │  ← Called by: client/pages/assessment-hub.html
│  │  │
│  │  ├─ 📄 objectives.js
│  │  │  ⏰ Week 4
│  │  │  📝 Purpose: OKR management
│  │  │  → Imports: models/Objective.js, models/KeyResult.js, services/openaiService.js
│  │  │  ← Used by: server/index.js
│  │  │  ← Called by: client/js/quarterly-goals.js
│  │  │
│  │  ├─ 📄 teams.js
│  │  │  ⏰ Week 3
│  │  │  📝 Purpose: Team management
│  │  │  → Imports: models/Team.js, models/User.js
│  │  │  ← Used by: server/index.js
│  │  │
│  │  └─ 📄 users.js
│  │     ⏰ Week 1
│  │     📝 Purpose: User management
│  │     → Imports: models/User.js, middleware/auth.js
│  │     ← Used by: server/index.js
│  │
│  ├─ 📁 services/ [PARENT: Business Logic Services]
│  │  │
│  │  ├─ 📄 CompanyCreationService.js ⭐
│  │  │  ⏰ Week 1 Day 2 (DEV-W1-008)
│  │  │  📝 Purpose: Company creation business logic
│  │  │  → Imports: models/Company.js, utils/businessDefaults.js
│  │  │  ← Used by: routes/invitations.js
│  │  │  🔗 Functions:
│  │  │     - createCompanyFromSignup(name, industry, employee_count)
│  │  │     - findOrCreateBusiness(name, industry, employee_count)
│  │  │     - validateBusinessData(data)
│  │  │     - getSizeCategory(employee_count)
│  │  │
│  │  ├─ 📄 mailjetService.js 🔧 [MODIFIED THIS SESSION]
│  │  │  ⏰ Nov 6, 2025 (Sprint 1 Day 5)
│  │  │  📝 Purpose: Email sending via Mailjet
│  │  │  → Imports: mailjet SDK, dotenv
│  │  │  ← Used by: routes/invitations.js
│  │  │  📝 Modified Lines:
│  │  │     - 387: Added to_email to function call
│  │  │     - 438: Added to_email to function signature
│  │  │  📝 Why: Email template referenced to_email but function didn't receive it
│  │  │  🔗 Functions:
│  │  │     - sendCompanyInvitationEmail(to_email, to_name, ...)
│  │  │     - getCompanyInvitationTemplate({to_email, ...})
│  │  │
│  │  ├─ 📄 openaiService.js
│  │  │  ⏰ Week 5
│  │  │  📝 Purpose: OpenAI GPT-4 integration
│  │  │  → Imports: openai SDK, dotenv
│  │  │  ← Used by: routes/objectives.js
│  │  │
│  │  └─ 📄 assessmentService.js
│  │     ⏰ Week 2
│  │     📝 Purpose: Assessment processing logic
│  │     → Imports: models/Assessment.js
│  │     ← Used by: routes/assessments.js
│  │
│  └─ 📁 utils/ [PARENT: Utility Functions]
│     │
│     ├─ 📄 businessDefaults.js
│     │  ⏰ Week 1 Day 2
│     │  📝 Purpose: Default configurations for new companies
│     │  → Imports: None
│     │  ← Used by: services/CompanyCreationService.js, models/Company.js
│     │  🔗 Functions:
│     │     - createBusinessDefaults(name, industry, employee_count)
│     │     - getSizeCategory(count)
│     │     - getIndustryDefaults(industry)
│     │
│     ├─ 📄 jwt.js
│     │  ⏰ Week 1
│     │  📝 Purpose: JWT token utilities
│     │  → Imports: jsonwebtoken, dotenv
│     │  ← Used by: middleware/auth.js, routes/auth.js
│     │
│     └─ 📄 validation.js
│        ⏰ Week 1
│        📝 Purpose: Input validation helpers
│        ← Used by: All routes
│
├─ 📁 client/ [PARENT: Frontend Application] ⭐ VANILLA JS
│  │  📝 Purpose: HTML/CSS/JS frontend served as static files
│  │
│  ├─ 📁 js/ [PARENT: JavaScript Modules]
│  │  │
│  │  ├─ 📄 auth.js ⭐ [AUTHENTICATION CLIENT]
│  │  │  ⏰ Week 1
│  │  │  📝 Purpose: Frontend authentication utilities
│  │  │  → Imports: api-client.js
│  │  │  ← Used by: All authenticated pages
│  │  │  🔗 Functions:
│  │  │     - login(email, password)
│  │  │     - logout()
│  │  │     - getToken() → localStorage['karvia_auth_token']
│  │  │     - isAuthenticated()
│  │  │     - getCurrentUser()
│  │  │  🔗 localStorage key: 'karvia_auth_token' (NOT 'token')
│  │  │
│  │  ├─ 📄 api-client.js ⭐ [BASE API CLIENT]
│  │  │  ⏰ Week 1
│  │  │  📝 Purpose: Base HTTP client with auth headers
│  │  │  → Imports: None (vanilla fetch)
│  │  │  ← Used by: All API wrapper files
│  │  │  🔗 Functions:
│  │  │     - get(url)
│  │  │     - post(url, data)
│  │  │     - put(url, data)
│  │  │     - delete(url)
│  │  │  🔗 Auto-includes: Authorization: Bearer {token}
│  │  │
│  │  ├─ 📄 assessment-api-client.js
│  │  │  ⏰ Week 2
│  │  │  📝 Purpose: Assessment API wrapper
│  │  │  → Imports: api-client.js
│  │  │  ← Used by: pages/assessment-hub.html
│  │  │  🔗 Functions:
│  │  │     - getTemplates()
│  │  │     - createTemplate(data)
│  │  │     - getAssessment(id)
│  │  │     - submitAssessment(id, responses)
│  │  │
│  │  ├─ 📄 quarterly-goals.js ⭐ [GOALS PAGE - COMPLETE]
│  │  │  ⏰ Week 6 (Nov 5, 2025)
│  │  │  📝 Purpose: Quarterly goals page functionality
│  │  │  → Imports: api-client.js
│  │  │  ← Used by: pages/quarterly-goals.html
│  │  │  ✅ Status: COMPLETE (450 lines)
│  │  │  🔗 Functions:
│  │  │     - loadQuarterlyGoals()
│  │  │     - renderQuarterView(quarter)
│  │  │     - renderGoalCard(goal)
│  │  │     - handleGoalClick(goalId)
│  │  │     - updateProgress(goalId, value)
│  │  │  🔗 Mock data support: Yes (for testing)
│  │  │
│  │  ├─ 📄 weekly-goals.js ⚠️ [TODO - NEEDS IMPLEMENTATION]
│  │  │  ⏰ Not yet created
│  │  │  📝 Purpose: Weekly calendar goal view
│  │  │  → Will import: api-client.js
│  │  │  ← Will be used by: pages/weekly-goals.html
│  │  │  ⚠️ Status: HTML created, JS pending
│  │  │  📝 Expected Functions:
│  │  │     - loadWeeklyGoals()
│  │  │     - renderCalendarView()
│  │  │     - handleDragDrop()
│  │  │     - updateGoalDate(goalId, newDate)
│  │  │  📝 Pattern: Follow quarterly-goals.js structure
│  │  │
│  │  └─ 📄 goal-details.js ⚠️ [TODO - NEEDS IMPLEMENTATION]
│  │     ⏰ Not yet created
│  │     📝 Purpose: Individual goal detail page
│  │     → Will import: api-client.js
│  │     ← Will be used by: pages/goal-details.html
│  │     ⚠️ Status: HTML created, JS pending
│  │     📝 Expected Functions:
│  │        - loadGoalDetails(goalId)
│  │        - renderKeyResults()
│  │        - updateKeyResult(krId, value)
│  │        - addComment(goalId, comment)
│  │
│  ├─ 📁 css/ [PARENT: Stylesheets]
│  │  │
│  │  ├─ 📄 global.css
│  │  │  ⏰ Week 1
│  │  │  📝 Purpose: Global styles, CSS variables
│  │  │  ← Used by: All pages
│  │  │
│  │  ├─ 📄 quarterly-goals.css ✅
│  │  │  ⏰ Week 6 (Nov 5, 2025)
│  │  │  📝 Purpose: Quarterly goals page styles
│  │  │  ← Used by: pages/quarterly-goals.html
│  │  │  ✅ Status: COMPLETE
│  │  │
│  │  ├─ 📄 weekly-goals.css ⚠️ [TODO]
│  │  │  ⏰ Not yet created
│  │  │  📝 Purpose: Weekly calendar styles
│  │  │  ← Will be used by: pages/weekly-goals.html
│  │  │
│  │  └─ 📄 goal-details.css ⚠️ [TODO]
│  │     ⏰ Not yet created
│  │     📝 Purpose: Goal details page styles
│  │     ← Will be used by: pages/goal-details.html
│  │
│  └─ 📁 pages/ [PARENT: HTML Pages]
│     │
│     ├─ 📄 index.html
│     │  ⏰ Week 1
│     │  📝 Purpose: Public landing page
│     │  → Imports: global.css
│     │
│     ├─ 📄 login.html
│     │  ⏰ Week 1
│     │  📝 Purpose: User login page
│     │  → Imports: auth.js, api-client.js
│     │
│     ├─ 📄 signup.html
│     │  ⏰ Week 1
│     │  📝 Purpose: User registration
│     │  → Imports: auth.js, api-client.js
│     │
│     ├─ 📄 dashboard.html
│     │  ⏰ Week 1
│     │  📝 Purpose: Main application dashboard
│     │  → Imports: auth.js
│     │  🔗 Auth required: Yes (all roles)
│     │
│     ├─ 📄 assessment-hub.html 🔧 [MODIFIED THIS SESSION]
│     │  ⏰ Nov 6, 2025 (Sprint 1 Day 5)
│     │  📝 Purpose: Assessment management interface
│     │  → Imports: assessment-api-client.js, auth.js
│     │  📝 Modified Line:
│     │     - 672: Changed localStorage.getItem('token') → 'karvia_auth_token'
│     │  📝 Why: Wrong token key was preventing company invitations
│     │  🔗 Auth required: Yes (primarily CONSULTANT)
│     │
│     ├─ 📄 quarterly-goals.html ✅
│     │  ⏰ Week 6 (Nov 5, 2025)
│     │  📝 Purpose: Quarterly OKR view
│     │  → Imports: quarterly-goals.js, quarterly-goals.css
│     │  ✅ Status: COMPLETE
│     │  🔗 Auth required: Yes (EXECUTIVE, MANAGER, TEAM_LEAD)
│     │
│     ├─ 📄 weekly-goals.html ⚠️ [HTML DONE, JS PENDING]
│     │  ⏰ Week 6 (Nov 5, 2025)
│     │  📝 Purpose: Weekly calendar goal view
│     │  → Imports: weekly-goals.js (pending), weekly-goals.css (pending)
│     │  ⚠️ Status: HTML complete, JavaScript/CSS pending
│     │  🔗 Auth required: Yes (all roles)
│     │
│     └─ 📄 goal-details.html ⚠️ [HTML DONE, JS PENDING]
│        ⏰ Week 6 (Nov 5, 2025)
│        📝 Purpose: Individual goal detail view
│        → Imports: goal-details.js (pending), goal-details.css (pending)
│        ⚠️ Status: HTML complete, JavaScript/CSS pending
│        🔗 Auth required: Yes (goal owner/team)
│
├─ 📁 engines/ [PARENT: Microservices]
│  │
│  ├─ 📁 iam/ [IAM Engine]
│  │  │  📝 Purpose: Identity & Access Management microservice
│  │  │  🔗 Port: 8081
│  │  │
│  │  └─ 📄 index.js
│  │     ⏰ Week 1
│  │     📝 Purpose: IAM server entry point
│  │     → Imports: models/User.js
│  │     ← Used by: server/middleware/auth.js (planned)
│  │     ⚠️ Status: Partially implemented
│  │
│  └─ 📁 [other engines]/
│     └─ (Not yet implemented: assessment, planner, scoring, observer, tracking, bramhi, whitelabel, integrations)
│
├─ 📁 bramhi/ [PARENT: Knowledge Management Engine]
│  │
│  └─ 📄 karvia-server.js
│     ⏰ In development
│     📝 Purpose: Bramhi knowledge management server
│     ⚠️ Status: In development
│
└─ 📁 tests/ [PARENT: Test Suites]
   │
   ├─ 📁 unit/
   │  ├─ 📁 models/
   │  ├─ 📁 services/
   │  └─ 📁 utils/
   │
   ├─ 📁 integration/
   │  ├─ 📁 api/
   │  └─ 📁 flows/
   │
   └─ 📁 e2e/
      └─ (Not yet implemented)
```

---

## 🔗 KEY CODE RELATIONSHIPS

### Authentication Flow
```
client/pages/login.html
  → client/js/auth.js (login())
    → client/js/api-client.js (post())
      → server/routes/auth.js (POST /api/auth/login)
        → server/models/User.js (comparePassword())
          → server/utils/jwt.js (generateToken())
            ← Returns JWT
              → Stored in localStorage['karvia_auth_token']
```

### Assessment Template Creation (Consultant)
```
client/pages/assessment-hub.html (Create Template Form)
  → localStorage.getItem('karvia_auth_token') 🔧 Fixed this session
    → client/js/assessment-api-client.js (createTemplate())
      → client/js/api-client.js (post())
        → server/routes/assessmentTemplates.js (POST) 🔧 Fixed this session
          → server/middleware/auth.js (authenticateToken())
            → Checks: consultant's company_id + managed_businesses
              → server/models/AssessmentTemplate.js (save())
                → MongoDB
```

### Company Invitation Flow
```
client/pages/assessment-hub.html (Send Invitation)
  → localStorage['karvia_auth_token'] 🔧 Fixed this session
    → server/routes/invitations.js (POST /api/invitations/send-company-invitation) 🔧 Modified
      → server/services/CompanyCreationService.js (createCompanyFromSignup())
        → server/utils/businessDefaults.js (createBusinessDefaults())
          → server/models/Company.js (save())
            → Creates Company
      → server/models/User.js (save())
        → Creates Executive with password: 'Karvia2025!' 🔧 Added default
      → server/models/Invitation.js (save())
      → server/services/mailjetService.js (sendCompanyInvitationEmail()) 🔧 Fixed params
        → Mailjet API
```

### Goal Viewing Flow
```
client/pages/quarterly-goals.html
  → client/js/quarterly-goals.js (loadQuarterlyGoals())
    → client/js/api-client.js (get('/api/objectives'))
      → server/routes/objectives.js (GET /api/objectives)
        → server/middleware/auth.js (role-based filtering)
          → server/models/Objective.js (find())
            ← Returns objectives
              → client/js/quarterly-goals.js (renderQuarterView())
                → Updates DOM
```

---

## 🎯 Auto-Update Process

### When `end-session.js` Runs:

1. **Scans Git Changes**
   ```bash
   git status --short
   git diff --name-only
   git diff --unified=0
   ```

2. **Updates This File (MASTER_TREE_CODE.md)**
   - Adds 🔧 emoji to modified files
   - Adds ✨ emoji to new files
   - Updates ⏰ timestamps
   - Adds line numbers modified
   - Links to session handoff 📝
   - Updates [Files Modified This Session](#files-modified-this-session)

3. **Creates Session Handoff**
   - `sessions/{SESSION-ID}/HANDOFF.md`
   - Lists all modified files with:
     - Exact line numbers changed
     - Diff summary
     - WHY it was changed (business reason)
     - Related files affected

---

## 📊 Modification History

### Sprint 1 Day 5 (Nov 6, 2025) - Consultant Auth Fix
**Session ID**: SPRINT-1-DAY-5-CONSULTANT-AUTH-FIX
**Handoff**: [HANDOFF.md](./sessions/SPRINT-1-DAY-5/HANDOFF.md)

**Code Files Modified**: 4

1. **server/routes/assessmentTemplates.js** (lines 44-53, 293-318)
   - **Why**: Consultants couldn't see or save templates for their own consulting firm
   - **Fix**: Added consultant's own `company_id` to access checks (alongside `managed_businesses`)
   - **Impact**: Consultants can now create and view templates for their firm

2. **client/pages/assessment-hub.html** (line 672)
   - **Why**: Company invitation requests failed with "No authentication token found"
   - **Fix**: Changed `localStorage.getItem('token')` to `localStorage.getItem('karvia_auth_token')`
   - **Impact**: Company invitations now work correctly

3. **server/services/mailjetService.js** (lines 387, 438)
   - **Why**: Email template referenced `to_email` variable that wasn't passed to function
   - **Fix**: Added `to_email` parameter to function signature and call
   - **Impact**: Invitation emails now render correctly

4. **server/routes/invitations.js** (lines 979-983)
   - **Why**: Testing required consistent password for all consultant-created companies
   - **Fix**: Set default temp password to `'Karvia2025!'` (overridable via env var)
   - **Impact**: Simplified testing flow, consistent credentials

**Database Changes**:
- Dropped 18 old `business_id` indexes (migration cleanup)
- Updated 6 users from `status: 'pending_invite'` to `status: 'active'`

---

## 📋 TODO List (Code)

### Immediate (Next Session)
1. ⚠️ Implement `client/js/weekly-goals.js` (follow quarterly-goals.js pattern)
2. ⚠️ Implement `client/js/goal-details.js` (follow quarterly-goals.js pattern)
3. ⚠️ Create `client/css/weekly-goals.css`
4. ⚠️ Create `client/css/goal-details.css`

### High Priority (Week 7)
5. ⚠️ Complete 6 missing Business API endpoints
6. ⚠️ Implement multi-tenant operations in Business API
7. ⚠️ Add validation layer to all routes

### Medium Priority (Week 8)
8. Create Employee Dashboard pages and logic
9. Increase test coverage from 20% to 60%
10. Implement CI/CD pipeline

---

**Version**: 1.0.0
**Next Update**: End of next session (auto-updated by end-session.js)
**Status**: Active Living Document
