# 🤖 Claude AI Context Guide - Karvia Business

**Quick onboarding for AI assistants working on Karvia Business**
Version 1.0 | November 2025

---

## 🎯 Quick Start (Read This First!)

### What is Karvia Business?
B2B OKR management platform for SMBs (50-500 employees). Think "Salesforce for OKRs" - assessment-driven, AI-powered objective setting and tracking.

### Current Status
- **70% Complete** (95% backend, 50% frontend)
- **Critical Gaps**: Goal Management UI, Employee Dashboard, Business API
- **Timeline**: Launching January 31, 2026 (12 weeks)
- **Tech Stack**: Node.js/Express, MongoDB, Vanilla JS + Bootstrap

### Your Primary Tasks Will Be
1. Completing frontend gaps (Goal/Task UI, Employee Dashboard)
2. Fixing integration issues between components
3. Adding mobile responsiveness
4. Testing and bug fixes
5. Documentation updates

---

## 🗂️ Critical Files & Folders

### Must Check Before Any Work
```bash
# 1. Environment & Configuration
.claude/CLAUDE_CHECKLIST.md         # MANDATORY checklist before any action
.claude/LOCAL_CHANGES.md           # Local vs production differences
.env.example                        # Environment variables template

# 2. Current Development Status
Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md     # Task tracker (247 items)
Karvia_OKR_Product_Planning/AUDIT_SUMMARY_*.md     # Known issues & gaps

# 3. Product Context
KARVIA_STRATEGY/1-PRODUCT/SYSTEM_OVERVIEW.md       # 3-page system summary
KARVIA_STRATEGY/00_MASTER_STRATEGY.md              # Complete strategy doc
```

### Key Source Code Locations
```bash
# Backend (95% complete)
server/models/              # 11 Mongoose schemas
server/routes/              # 14 route files, 135+ endpoints
server/services/            # 16 service modules
server/middleware/          # Auth, roles, error handling

# Frontend (50% complete)
client/pages/               # 25 HTML pages (9 complete, 5 partial, 5 missing)
client/js/                  # API clients and utilities
client/pages/scripts/       # Page-specific JavaScript

# Microservices
engines/iam/                # Authentication engine (port 8081)
engines/assessment/         # Assessment engine (port 8082)
engines/planner/           # OKR planning engine (port 8083)
```

---

## 👥 User Roles & Permissions

### Role Hierarchy (Highest → Lowest)
```javascript
CONSULTANT → BUSINESS_OWNER → EXECUTIVE → DEPARTMENT_HEAD → TEAM_LEAD → EMPLOYEE

// Permission Rules
- Higher roles have all permissions of lower roles
- CONSULTANT can manage multiple companies
- BUSINESS_OWNER sees everything in their company
- Roles cascade down the hierarchy
```

### Common Permission Patterns
```javascript
// Check if user can edit
requireRole('BUSINESS_OWNER', 'EXECUTIVE')  // These roles can edit

// Check if authenticated (any role)
requireAnyRole()  // Note: Takes NO parameters!

// Get user from request
req.user = {
  _id: "user_id",
  company_id: "company_id",
  role: "BUSINESS_OWNER"
}
```

---

## 🔄 Key Workflows

### 1. Assessment → OKR Flow
```
User takes assessment (146 questions)
    ↓
Calculate SSI scores (Speed/Strength/Intelligence)
    ↓
Identify weakness areas (lowest scoring dimensions)
    ↓
Generate AI OKRs targeting weaknesses (GPT-4)
    ↓
User reviews and approves objectives
    ↓
System creates objective records with KRs
```

### 2. OKR Cascade Flow
```
Business Objective (Annual, max 4)
    ↓
Department Key Results (Quarterly)
    ↓
Team Goals (Monthly/Weekly)
    ↓
Individual Tasks (Daily)
```

### 3. Progress Calculation
```javascript
// Automatic roll-up calculation
Task Progress (manual input)
    → Goal Progress (avg of tasks)
    → Key Result Progress (weighted avg of goals)
    → Objective Progress (avg of key results)
    → Company Progress (weighted avg of objectives)

// Health Status
progress >= 70: "on_track" (green)
progress 40-69: "at_risk" (yellow)
progress < 40: "behind" (red)
```

---

## 🗃️ Data Models (Simplified)

### Core Collections
```javascript
// 1. Users - Authentication & roles
{
  email: "john@company.com",
  company_id: ObjectId("..."),
  role: "BUSINESS_OWNER",
  teams: [ObjectId("...")]
}

// 2. Companies - Organization account
{
  name: "Acme Corp",
  subscription_tier: "professional",
  ibrain_enabled: false,  // AI toggle
  assessment_results: {...}
}

// 3. Objectives - Annual goals
{
  title: "Increase Revenue 50%",
  company_id: ObjectId("..."),
  owner_id: ObjectId("..."),
  key_results: [...],
  progress: 67,  // Auto-calculated
  health_status: "at_risk"
}

// 4. Assessments - Business maturity
{
  company_id: ObjectId("..."),
  type: "ssi",  // Speed/Strength/Intelligence
  responses: [...],
  scores: { speed: 72, strength: 68, intelligence: 81 }
}

// 5. Teams - Organizational units
{
  name: "Sales Team",
  company_id: ObjectId("..."),
  manager_id: ObjectId("..."),
  members: [ObjectId("...")]
}
```

### Relationships
```
Company 1:N Users
Company 1:N Objectives
Company 1:N Teams
Company 1:N Assessments

User N:N Teams (via teams array)
User 1:N Objectives (as owner)

Objective 1:N KeyResults
KeyResult 1:N Goals
Goal 1:N Tasks
```

---

## ⚠️ Common Pitfalls & Solutions

### 1. Authentication Issues
```javascript
// WRONG - mismatched field names
jwt.sign({ userId: user._id })  // Creates with camelCase
decoded.user_id  // Reads with snake_case - WILL BE UNDEFINED!

// RIGHT - consistent snake_case
jwt.sign({ user_id: user._id, company_id: user.company_id })
decoded.user_id  // Matches!
```

### 2. Middleware Function Signatures
```javascript
// WRONG - requireAnyRole doesn't take parameters!
router.get('/api/data', requireAnyRole('ADMIN'), handler)

// RIGHT - use requireRole for specific roles
router.get('/api/data', requireRole('ADMIN'), handler)

// RIGHT - use requireAnyRole for any authenticated user
router.get('/api/data', requireAnyRole(), handler)
```

### 3. Environment Variables
```javascript
// Local development (2 servers)
IAM_ENGINE_URL=http://localhost:8081

// Production (standalone mode)
IAM_ENGINE_URL=  // MUST be empty!

// Always check
const iamUrl = process.env.IAM_ENGINE_URL;
if (!iamUrl) {
  // Standalone mode - use local auth
  return handleAuthLocally();
}
```

### 4. Frontend API Calls
```javascript
// WRONG - hardcoded URL
fetch('http://localhost:8080/api/objectives')

// RIGHT - use relative paths
fetch('/api/objectives')

// RIGHT - use config
fetch(`${API_BASE_URL}/api/objectives`)
```

---

## 🚨 Critical Gaps to Address

### P0 - Production Blockers (Must Fix)
1. **Goal Management UI** - Backend ready, zero frontend
   - Missing: quarterly-goals.html, goal-details.html, weekly-goals.html
   - Impact: Cannot manage/assign goals

2. **Employee Dashboard** - Completely missing
   - Need: Daily task view, progress tracking
   - Impact: Employees can't use system

3. **Business/Company API** - Only 2 stub endpoints
   - Need: Full CRUD operations
   - Impact: Cannot manage company settings

### P1 - UX Critical
1. **Mobile Responsiveness** - Only 30% complete
2. **Loading States** - No skeletons or spinners
3. **Error Handling** - Inconsistent user feedback
4. **Navigation** - Still has hardcoded values

---

## 🧪 Testing & Validation

### Quick Health Checks
```bash
# 1. Check environment
node .claude/verify-environment.js

# 2. Check services running
./.claude/health-check.sh

# 3. Test authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 4. Test protected endpoint
curl http://localhost:8080/api/objectives \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Database Queries
```javascript
// MongoDB shell commands
use karvia_business

// Check data
db.users.find().limit(5)
db.objectives.find({company_id: ObjectId("...")})
db.assessments.find().sort({created_at: -1})

// Check indices
db.objectives.getIndexes()
```

---

## 🚀 Development Workflow

### Starting Fresh Session
```bash
# 1. Check documentation
cat .claude/CLAUDE_CHECKLIST.md
cat KARVIA_STRATEGY/1-PRODUCT/SYSTEM_OVERVIEW.md

# 2. Verify environment
node .claude/verify-environment.js

# 3. Start servers
# Terminal 1: IAM Engine
cd engines/iam && PORT=8081 npm start

# Terminal 2: Main Server
PORT=8080 npm start

# 4. Check health
./.claude/health-check.sh
```

### Before Making Changes
1. Check MASTER_DEV_LIST.md for task status
2. Review relevant user stories
3. Verify no duplicate work
4. Check for dependencies

### Before Committing
```bash
# 1. Run verification
node .claude/verify-environment.js

# 2. Check for localhost references
grep -r "localhost:808" server/ client/ --include="*.js"

# 3. Review changes
git diff --staged

# 4. Commit with context
git commit -m "feat: Complete goal management UI

- Added quarterly-goals.html page
- Implemented goal CRUD operations
- Connected to backend APIs
- Added progress tracking

Closes #123"
```

---

## 📚 Key Concepts & Terminology

### Business Terms
- **OKR**: Objectives & Key Results (goal-setting framework)
- **SSI**: Speed/Strength/Intelligence (assessment framework)
- **Cascade**: Flow from company → team → individual
- **Key Result**: Measurable outcome for objective
- **Goal**: Team-level target derived from KR
- **Task**: Individual work item

### Technical Terms
- **iBrain**: Optional AI intelligence layer (premium add-on)
- **Standalone Mode**: Running without microservices
- **Modular Blocks**: 7 independent feature blocks
- **Engine**: Microservice (IAM, Assessment, Planner, etc.)

### Status Values
- **Health**: on_track, at_risk, behind
- **Priority**: critical, high, medium, low
- **Frequency**: annual, quarterly, monthly, weekly, daily

---

## 🔗 Quick Links

### Documentation
- [System Overview](./SYSTEM_OVERVIEW.md) - 3-page complete context
- [Product Vision](./PRODUCT_VISION.md) - Strategy and roadmap
- [User Stories](./user-stories/USER_STORIES_MASTER.md) - All 114 stories

### Tracking
- [Master Dev List](../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md) - Task tracker
- [Issues List](../../Karvia_OKR_Product_Planning/MASTER_ISSUES_LIST.md) - Known bugs
- [Improvements](../../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md) - Enhancement ideas

### Code
- [Backend Routes](../../server/routes/) - All API endpoints
- [Frontend Pages](../../client/pages/) - All UI pages
- [Database Models](../../server/models/) - Mongoose schemas

---

## 💡 Pro Tips

1. **Always check .claude/ folder first** - Contains critical environment configs
2. **Use existing patterns** - Copy from working pages/routes
3. **Test in standalone mode** - Production doesn't have microservices
4. **Check role hierarchy** - Higher roles inherit lower permissions
5. **Keep UI simple** - Target is SMB users, not tech experts
6. **Mobile matters** - 40% of users check on phones
7. **Document changes** - Update MASTER_DEV_LIST.md when completing tasks

---

**Remember**: You're building for SMBs who want simplicity, not enterprises who want features. When in doubt, choose the simpler solution.

**Need help?** Check SYSTEM_OVERVIEW.md first, then dive into specific docs as needed.