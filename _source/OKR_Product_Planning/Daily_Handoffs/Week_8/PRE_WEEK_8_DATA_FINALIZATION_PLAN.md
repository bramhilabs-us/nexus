# PRE-WEEK 8: DATA FINALIZATION & CRUD VALIDATION PLAN

**Created**: October 29, 2025
**Owner**: Development Team
**Duration**: 3-5 Days (Before Week 8)
**Status**: Planning

---

## 🎯 OBJECTIVE

Complete comprehensive data model finalization, validate all CRUD operations, and ensure 100% alignment between:
- Technical documentation (MVP_TECHNICAL_ARCHITECTURE_V5.md, API_CONTRACTS.md)
- Product requirements (MVP_PRD_V3.md)
- Database models (11 current models)
- API implementations (14 route modules, 50+ endpoints)
- Business → Company migration completion

**Success Criteria**: All data flows validated, all CRUD operations tested, zero schema mismatches, IAM engine updated and working.

---

## 📊 CURRENT STATE ASSESSMENT

### **Existing Data Models** (11 Total)
1. ✅ User.js
2. ✅ Company.js (migrated from Business.js)
3. ✅ Team.js
4. ✅ Objective.js
5. ✅ Goal.js
6. ✅ Task.js
7. ✅ Assessment.js
8. ✅ AssessmentTemplate.js
9. ✅ AssessmentQuestion.js
10. ✅ Invitation.js
11. ✅ AIOKRSuggestion.js

### **Existing Route Modules** (14 Total)
1. ✅ admin.js
2. ✅ ai-okr.js
3. ✅ analytics.js
4. ✅ assessmentQuestions.js
5. ✅ assessmentTemplates.js
6. ✅ assessments.js
7. ✅ auth.js
8. ✅ cascade.js
9. ✅ companies.js
10. ✅ goals.js
11. ✅ invitations.js
12. ✅ objectives.js
13. ✅ tasks.js
14. ✅ teams.js

### **Known Issues**
- ❌ IAM Engine still references Business model (needs Company migration)
- ❌ Some routes may still use business_id instead of company_id
- ❌ Subdomain index was removed but other legacy indexes may exist
- ⚠️ Not all CRUD operations have been tested end-to-end
- ⚠️ Data validation rules may not match PRD specifications
- ⚠️ Permission matrix not fully implemented in all routes

---

## 🗂️ PHASE 1: DATA MODEL AUDIT & ALIGNMENT (Day 1)

### **Task 1.1: Review Each Model Against Documentation**

For each of the 11 models, validate:

#### **1. User Model**
- [ ] Verify all fields match PRD role definitions
- [ ] company_id references Company (not business_id)
- [ ] Roles: SUPER_ADMIN, BUSINESS_OWNER, MANAGER, EMPLOYEE, CONSULTANT
- [ ] Permissions object structure matches permission matrix
- [ ] managed_businesses array for CONSULTANT role
- [ ] Email validation rules
- [ ] Password hashing (bcrypt)
- [ ] Indexes: email, company_id, role, status

**Fields to Validate**:
```javascript
- email (unique per company)
- password_hash
- first_name, last_name
- role (enum validation)
- company_id (ObjectId ref Company)
- managed_businesses (array for consultants)
- permissions object
- preferences object
- status (active, inactive, suspended)
- email_verified
- last_login
- login_count
- onboarding_completed
- onboarding_progress
- invitation_id
- created_at, updated_at
```

#### **2. Company Model**
- [ ] All required fields per PRD
- [ ] No subdomain field (removed)
- [ ] Industry enum values
- [ ] Size categories
- [ ] Assessment scores structure
- [ ] Subscription tiers
- [ ] Branding settings
- [ ] Settings object (business hours, fiscal year, currency, timezone)
- [ ] Onboarding progress tracking
- [ ] Status (trial, active, expired, suspended)
- [ ] Indexes: name, industry, size_category, status, created_at

**Fields to Validate**:
```javascript
- name (required)
- industry (enum)
- size_category (small, medium, large, enterprise)
- employee_count
- assessment_scores (SSI: speed, strength, intelligence, overall, readiness_profile)
- subscription_tier (free, professional, enterprise)
- ibrain_enabled (boolean)
- branding (colors, logo)
- settings (business_hours, fiscal_year_start, currency, timezone)
- onboarding_completed
- onboarding_progress
- status (enum)
- trial_started_at, trial_ends_at
- created_at, updated_at
```

#### **3. Team Model**
- [ ] company_id reference (not business_id)
- [ ] Manager hierarchy
- [ ] Member structure with roles
- [ ] Team metrics
- [ ] Indexes: company_id, manager_id, name, is_active

**Fields to Validate**:
```javascript
- company_id (required)
- name
- description
- manager_id (ref User)
- members array [{user_id, joined_at, role}]
- department_id
- goals_assigned
- tasks_assigned
- completion_rate
- is_active
- created_at, updated_at
```

#### **4. Objective Model**
- [ ] company_id reference
- [ ] Yearly objectives structure
- [ ] Category validation
- [ ] Priority levels
- [ ] Status workflow
- [ ] Owner permissions
- [ ] Cascade relationships
- [ ] Progress calculation
- [ ] Indexes: company_id, owner_id, status, target_year, category, priority

**Fields to Validate**:
```javascript
- company_id (required)
- title
- description
- target_year
- owner_id (ref User)
- category (financial, operational, strategic, customer, innovation)
- priority (critical, high, medium, low)
- status (draft, active, on_track, at_risk, behind, completed, abandoned)
- progress_percentage (0-100)
- completion_score
- goals array (refs)
- key_results array
- alignment (cascaded_from_id)
- tags
- visibility (public, private, team)
- created_at, updated_at, completed_at
```

#### **5. Goal Model**
- [ ] company_id reference
- [ ] Quarterly goals (Q1-Q4)
- [ ] Weekly breakdown (Week 1-13)
- [ ] Key results tracking
- [ ] Owner assignment
- [ ] Status workflow
- [ ] Progress rollup
- [ ] Indexes: company_id, objective_id, owner_id, quarter, week, status, priority

**Fields to Validate**:
```javascript
- company_id (required)
- objective_id (required ref Objective)
- title
- description
- owner_id (ref User)
- quarter (Q1, Q2, Q3, Q4)
- week (1-13)
- due_date
- priority (critical, high, medium, low)
- status (not_started, in_progress, on_track, at_risk, behind, completed, cancelled)
- progress_percentage (0-100)
- key_results array
- tasks array (refs)
- dependencies array
- metrics (target_value, current_value, unit)
- created_at, updated_at, completed_at
```

#### **6. Task Model**
- [ ] company_id reference
- [ ] Goal and objective relationships
- [ ] Assigned to user
- [ ] Status workflow
- [ ] Priority levels
- [ ] Time tracking
- [ ] Subtasks support
- [ ] Indexes: company_id, goal_id, objective_id, assigned_to, status, priority, due_date

**Fields to Validate**:
```javascript
- company_id (required)
- goal_id (ref Goal)
- objective_id (ref Objective)
- title
- description
- assigned_to (ref User)
- created_by (ref User)
- status (pending, in_progress, completed, cancelled, blocked)
- priority (urgent, high, medium, low)
- due_date
- estimated_hours
- actual_hours
- progress_percentage (0-100)
- tags
- attachments array
- comments array
- subtasks array
- dependencies array
- created_at, updated_at, completed_at
```

#### **7. Assessment Model**
- [ ] company_id reference
- [ ] User reference
- [ ] Template reference
- [ ] Invitation reference
- [ ] Response structure
- [ ] SSI scoring (speed, strength, intelligence)
- [ ] Aggregation levels (individual, team, org)
- [ ] Status workflow
- [ ] Context tracking
- [ ] Indexes: company_id, user_id, template_id, invitation_id, assessment_type, status

**Fields to Validate**:
```javascript
- company_id (required)
- user_id (required ref User)
- template_id (ref AssessmentTemplate)
- invitation_id (ref Invitation)
- assessment_type (individual, team, organizational)
- status (pending, in_progress, completed, expired)
- responses array [{question_id, answer, score, dimension, category}]
- scores {
    speed_score,
    strength_score,
    intelligence_score,
    overall_score,
    dimension_scores {},
    category_scores {},
    readiness_profile
  }
- context {objective_id, goal_id, team_id, campaign_id}
- started_at, completed_at
- created_at, updated_at
```

#### **8. AssessmentTemplate Model**
- [ ] company_id reference (null for global)
- [ ] Created by reference
- [ ] Questions array
- [ ] Dimension/category structure
- [ ] Scoring weights
- [ ] Global vs company-specific
- [ ] Active status
- [ ] Indexes: company_id, created_by, is_global, is_active, template_id

**Fields to Validate**:
```javascript
- template_id (unique string)
- name
- description
- company_id (null for global templates)
- created_by (ref User, null for system)
- is_global (boolean)
- is_active (boolean)
- version
- questions array [{
    question_id,
    text,
    type (rating, boolean, multiple_choice, text),
    dimension (speed, strength, intelligence),
    category,
    weight,
    options array
  }]
- scoring_config {
    weights {speed, strength, intelligence},
    thresholds {},
    readiness_profiles {}
  }
- usage_count
- created_at, updated_at
```

#### **9. AssessmentQuestion Model**
- [ ] Question structure
- [ ] Dimension mapping
- [ ] Category mapping
- [ ] Scoring weights
- [ ] Answer options
- [ ] Metadata (tags, difficulty)
- [ ] Indexes: question_id, dimension, category, tags

**Fields to Validate**:
```javascript
- question_id (unique string)
- text
- type (rating, boolean, multiple_choice, text)
- dimension (speed, strength, intelligence)
- category
- weight (default: 1)
- options array [{value, label, score}]
- metadata {
    tags array,
    difficulty,
    usage_count,
    avg_score
  }
- is_active
- created_at, updated_at
```

#### **10. Invitation Model**
- [ ] company_id reference
- [ ] Sent by user reference
- [ ] Recipient information
- [ ] Invitation type (assessment, team, platform)
- [ ] Token generation and expiry
- [ ] Status workflow
- [ ] Context tracking
- [ ] Indexes: company_id, sent_by, recipient_email, invitation_token, status, expires_at

**Fields to Validate**:
```javascript
- company_id (required)
- sent_by (required ref User)
- recipient_email
- recipient_name
- invitation_type (assessment, team_member, platform_user)
- invitation_token (unique)
- status (pending, accepted, declined, expired, cancelled)
- context {
    assessment_template_id,
    team_id,
    role,
    campaign_id,
    message
  }
- expires_at
- accepted_at, declined_at
- created_at, updated_at
```

#### **11. AIOKRSuggestion Model**
- [ ] company_id reference
- [ ] User reference
- [ ] Assessment reference
- [ ] Generated suggestions structure
- [ ] Approval workflow
- [ ] Edit tracking
- [ ] Status management
- [ ] Indexes: company_id, user_id, assessment_id, status, generated_at

**Fields to Validate**:
```javascript
- company_id (required)
- user_id (required ref User)
- assessment_id (required ref Assessment)
- generated_by (openai, template_based)
- suggested_objectives array [{
    title,
    description,
    category,
    priority,
    rationale,
    based_on_scores {},
    key_results array,
    status (suggested, edited, approved, dismissed)
  }]
- status (pending_review, partially_approved, fully_approved, dismissed)
- approved_objectives array
- dismissed_objectives array
- generated_at
- reviewed_at
- created_at, updated_at
```

---

## 🔧 PHASE 2: IAM ENGINE MIGRATION (Day 1-2)

### **Task 2.1: Update IAM Engine for Company Migration**

**File**: `engines/iam/index.js`

- [ ] Line 26: Change `let User, Business;` to `let User, Company;`
- [ ] Line 110: Change `Business = require('../../server/models/Business');` to `Company = require('../../server/models/Company');`
- [ ] Line 257, 266: Change `Business` references to `Company`
- [ ] Line 354: Change `BusinessCreationService` to `CompanyCreationService`
- [ ] Line 404: Update service method calls
- [ ] Search and replace all `business` references to `company` in variable names and comments
- [ ] Update all `businessId` to `companyId` in token payloads and middleware
- [ ] Line 59: Update header from `X-Business-ID` to `X-Company-ID`
- [ ] Line 148, 165, 500, 586, 621, 659: Update `business_id` populates to `company_id`

**Validation**:
- [ ] IAM engine starts without errors
- [ ] Signup creates Company (not Business)
- [ ] Login returns company_id in token
- [ ] Token validation works with company_id
- [ ] All endpoints return company data correctly

### **Task 2.2: Test IAM Engine Endpoints**

- [ ] POST /api/auth/signup - Create new user + company
- [ ] POST /api/auth/login - User login with company
- [ ] POST /api/auth/validate - Token validation
- [ ] GET /api/users/me - Current user with company
- [ ] GET /api/users - Company users list
- [ ] POST /api/auth/logout - User logout

---

## 🧪 PHASE 3: CRUD OPERATIONS TESTING (Day 2-3)

### **Task 3.1: Authentication & Authorization (auth.js)**

**Test Scenarios**:
1. [ ] **POST /api/auth/signup**
   - Valid signup with all required fields
   - Email validation (format, duplicates)
   - Password validation (strength, requirements)
   - Company creation with defaults
   - User role assignment (BUSINESS_OWNER)
   - JWT token generation with company_id
   - Database verification (User + Company created)

2. [ ] **POST /api/auth/login**
   - Valid credentials
   - Invalid credentials (wrong password)
   - Non-existent user
   - Inactive user
   - Company reference in token
   - Last login timestamp update

3. [ ] **POST /api/auth/logout**
   - Token invalidation (if implemented)
   - Session cleanup

4. [ ] **POST /api/auth/refresh**
   - Refresh token validation
   - New access token generation

**Validation Queries**:
```javascript
// After signup
db.users.findOne({email: "test@test.com"})
db.companies.findOne({name: "Test Company"})

// Verify relationship
user.company_id === company._id

// Verify indexes
db.users.getIndexes()
db.companies.getIndexes()
```

### **Task 3.2: Company Management (companies.js)**

**Test Scenarios**:
1. [ ] **GET /api/companies/:id**
   - Get company by ID
   - Authorization (only company members)
   - Populated data (users count, teams count)

2. [ ] **PUT /api/companies/:id**
   - Update company profile
   - Update branding settings
   - Update business settings
   - Validation rules
   - Authorization (BUSINESS_OWNER only)

3. [ ] **GET /api/companies/:id/users**
   - List all company users
   - Filter by role
   - Filter by status
   - Pagination

4. [ ] **GET /api/companies/:id/teams**
   - List all company teams
   - Filter by active status
   - Include member counts

5. [ ] **GET /api/companies/:id/stats**
   - Company-wide statistics
   - User counts by role
   - Objective/Goal/Task counts
   - Assessment completion rates

**Validation Queries**:
```javascript
// Get company with stats
db.companies.aggregate([
  {$match: {_id: ObjectId("...")}},
  {$lookup: {from: "users", localField: "_id", foreignField: "company_id", as: "users"}},
  {$lookup: {from: "teams", localField: "_id", foreignField: "company_id", as: "teams"}},
  {$lookup: {from: "objectives", localField: "_id", foreignField: "company_id", as: "objectives"}}
])
```

### **Task 3.3: Team Management (teams.js)**

**Test Scenarios**:
1. [ ] **POST /api/teams**
   - Create team with company_id from token
   - Assign manager
   - Add initial members
   - Validation (name required, manager must exist)
   - Authorization (BUSINESS_OWNER, MANAGER)

2. [ ] **GET /api/teams**
   - List company teams
   - Filter by manager
   - Filter by active status
   - Include member details

3. [ ] **GET /api/teams/:id**
   - Get team details
   - Include members with roles
   - Include manager details
   - Include team metrics

4. [ ] **PUT /api/teams/:id**
   - Update team name/description
   - Change manager
   - Authorization (BUSINESS_OWNER, team manager)

5. [ ] **POST /api/teams/:id/members**
   - Add team member
   - Assign role
   - Validation (user exists, not duplicate)

6. [ ] **DELETE /api/teams/:id/members/:userId**
   - Remove team member
   - Update team metrics

7. [ ] **DELETE /api/teams/:id**
   - Soft delete (set is_active = false)
   - Hard delete option
   - Authorization

**Validation Queries**:
```javascript
// Verify team creation
db.teams.findOne({name: "Engineering Team"})

// Verify members
db.teams.aggregate([
  {$match: {_id: ObjectId("...")}},
  {$unwind: "$members"},
  {$lookup: {from: "users", localField: "members.user_id", foreignField: "_id", as: "member_details"}}
])
```

### **Task 3.4: Objective Management (objectives.js)**

**Test Scenarios**:
1. [ ] **POST /api/objectives**
   - Create objective with company_id from token
   - Assign owner
   - Set category, priority, target_year
   - Validation rules
   - Authorization (BUSINESS_OWNER, CONSULTANT)

2. [ ] **GET /api/objectives**
   - List company objectives
   - Filter by year, category, priority, status
   - Filter by owner
   - Include progress calculation
   - Pagination

3. [ ] **GET /api/objectives/:id**
   - Get objective details
   - Include goals
   - Include owner details
   - Include progress breakdown

4. [ ] **PUT /api/objectives/:id**
   - Update objective details
   - Update status
   - Update progress
   - Authorization (owner or BUSINESS_OWNER)

5. [ ] **DELETE /api/objectives/:id**
   - Soft delete or hard delete
   - Cascade to goals (optional)
   - Authorization

6. [ ] **GET /api/objectives/:id/cascade**
   - Get cascade hierarchy
   - Show parent/child objectives

**Validation Queries**:
```javascript
// Verify objective with goals
db.objectives.aggregate([
  {$match: {_id: ObjectId("...")}},
  {$lookup: {from: "goals", localField: "_id", foreignField: "objective_id", as: "goals"}},
  {$lookup: {from: "users", localField: "owner_id", foreignField: "_id", as: "owner"}}
])

// Company objectives count
db.objectives.countDocuments({company_id: ObjectId("...")})
```

### **Task 3.5: Goal Management (goals.js)**

**Test Scenarios**:
1. [ ] **POST /api/goals**
   - Create goal linked to objective
   - Set quarter and week
   - Assign owner
   - Set key results
   - Validation (objective exists, dates valid)

2. [ ] **GET /api/goals**
   - List company goals
   - Filter by quarter, week, status, owner
   - Filter by objective
   - Include task counts

3. [ ] **GET /api/goals/:id**
   - Get goal details
   - Include tasks
   - Include metrics (target vs actual)

4. [ ] **PUT /api/goals/:id**
   - Update goal details
   - Update progress
   - Update key results
   - Authorization (owner, manager, or BUSINESS_OWNER)

5. [ ] **DELETE /api/goals/:id**
   - Delete goal
   - Handle task dependencies

6. [ ] **POST /api/goals/:id/tasks**
   - Create task under goal
   - Link to objective automatically

**Validation Queries**:
```javascript
// Goals by quarter
db.goals.find({company_id: ObjectId("..."), quarter: "Q1"})

// Goal progress rollup
db.goals.aggregate([
  {$match: {company_id: ObjectId("...")}},
  {$lookup: {from: "tasks", localField: "_id", foreignField: "goal_id", as: "tasks"}},
  {$addFields: {
    total_tasks: {$size: "$tasks"},
    completed_tasks: {$size: {$filter: {input: "$tasks", cond: {$eq: ["$$this.status", "completed"]}}}}
  }}
])
```

### **Task 3.6: Task Management (tasks.js)**

**Test Scenarios**:
1. [ ] **POST /api/tasks**
   - Create task under goal
   - Assign to user
   - Set priority and due date
   - Validation (goal exists, assignee exists)

2. [ ] **GET /api/tasks**
   - List company tasks
   - Filter by goal, objective, assigned user
   - Filter by status, priority
   - Filter by due date range

3. [ ] **GET /api/tasks/:id**
   - Get task details
   - Include comments
   - Include attachments

4. [ ] **PUT /api/tasks/:id**
   - Update task details
   - Update status
   - Update progress
   - Time tracking (actual_hours)

5. [ ] **DELETE /api/tasks/:id**
   - Delete task
   - Update goal metrics

6. [ ] **POST /api/tasks/:id/comments**
   - Add comment to task

7. [ ] **GET /api/tasks/my-tasks**
   - Get tasks assigned to current user
   - Filter by status

**Validation Queries**:
```javascript
// User's tasks
db.tasks.find({assigned_to: ObjectId("..."), status: {$in: ["pending", "in_progress"]}})

// Overdue tasks
db.tasks.find({
  company_id: ObjectId("..."),
  due_date: {$lt: new Date()},
  status: {$ne: "completed"}
})
```

### **Task 3.7: Assessment Templates (assessmentTemplates.js)**

**Test Scenarios**:
1. [ ] **GET /api/assessment-templates**
   - List global templates
   - List company templates
   - Filter by active status

2. [ ] **GET /api/assessment-templates/:id**
   - Get template with questions
   - Include scoring configuration

3. [ ] **POST /api/assessment-templates**
   - Create custom template
   - Add questions
   - Set scoring weights
   - Authorization (BUSINESS_OWNER, CONSULTANT)

4. [ ] **PUT /api/assessment-templates/:id**
   - Update template
   - Modify questions
   - Update scoring config
   - Authorization

5. [ ] **DELETE /api/assessment-templates/:id**
   - Delete custom template
   - Prevent deletion if used in assessments

**Validation Queries**:
```javascript
// Global templates
db.assessment_templates.find({is_global: true, is_active: true})

// Company templates
db.assessment_templates.find({company_id: ObjectId("..."), is_active: true})
```

### **Task 3.8: Assessments (assessments.js)**

**Test Scenarios**:
1. [ ] **POST /api/assessments/calculate**
   - Submit assessment responses
   - Calculate SSI scores (Speed, Strength, Intelligence)
   - Calculate dimension scores
   - Determine readiness profile
   - Link to user and company

2. [ ] **GET /api/assessments/my-assessments**
   - List user's assessments
   - Show scores and status
   - Filter by type (individual, team, org)

3. [ ] **GET /api/assessments/:id/results**
   - Get detailed assessment results
   - Include dimension breakdown
   - Include category breakdown
   - Include question-level scores

4. [ ] **GET /api/assessments/team/:companyId**
   - Get team-level aggregated scores
   - Average scores across team members
   - Authorization (BUSINESS_OWNER, MANAGER)

5. [ ] **GET /api/assessments/history**
   - Get assessment history for trend analysis
   - Show score changes over time

**Validation Queries**:
```javascript
// User's latest assessment
db.assessments.findOne({
  user_id: ObjectId("..."),
  status: "completed"
}).sort({completed_at: -1})

// Team average scores
db.assessments.aggregate([
  {$match: {company_id: ObjectId("..."), status: "completed"}},
  {$group: {
    _id: "$company_id",
    avg_speed: {$avg: "$scores.speed_score"},
    avg_strength: {$avg: "$scores.strength_score"},
    avg_intelligence: {$avg: "$scores.intelligence_score"}
  }}
])
```

### **Task 3.9: Invitations (invitations.js)**

**Test Scenarios**:
1. [ ] **POST /api/invitations**
   - Send assessment invitation
   - Generate unique token
   - Set expiry date
   - Send email notification

2. [ ] **GET /api/invitations**
   - List company invitations
   - Filter by status, type
   - Show acceptance rates

3. [ ] **GET /api/invitations/:token**
   - Get invitation details by token
   - Verify not expired
   - Public endpoint (no auth)

4. [ ] **POST /api/invitations/:token/accept**
   - Accept invitation
   - Create assessment record
   - Update invitation status

5. [ ] **POST /api/invitations/:token/decline**
   - Decline invitation
   - Update status

6. [ ] **DELETE /api/invitations/:id**
   - Cancel invitation
   - Authorization (sender or BUSINESS_OWNER)

**Validation Queries**:
```javascript
// Pending invitations
db.invitations.find({
  company_id: ObjectId("..."),
  status: "pending",
  expires_at: {$gt: new Date()}
})

// Acceptance rate
db.invitations.aggregate([
  {$match: {company_id: ObjectId("...")}},
  {$group: {
    _id: "$status",
    count: {$sum: 1}
  }}
])
```

### **Task 3.10: AI OKR Suggestions (ai-okr.js)**

**Test Scenarios**:
1. [ ] **POST /api/ai-okr/generate/:assessmentId**
   - Generate OKR suggestions from assessment
   - Use OpenAI if enabled, template fallback otherwise
   - Link to company and user
   - Store rationale based on scores

2. [ ] **GET /api/ai-okr/suggestions/:userId**
   - Get user's OKR suggestions
   - Filter by status (pending, approved, dismissed)

3. [ ] **POST /api/ai-okr/approve**
   - Approve suggested objectives
   - Create actual Objective records
   - Update suggestion status

4. [ ] **PUT /api/ai-okr/edit/:suggestionId/:objectiveIndex**
   - Edit suggested objective before approval
   - Track modifications

5. [ ] **DELETE /api/ai-okr/dismiss/:suggestionId/:objectiveIndex**
   - Dismiss suggestion
   - Update status

**Validation Queries**:
```javascript
// Pending suggestions
db.aiokrsuggestions.find({
  user_id: ObjectId("..."),
  status: "pending_review"
})

// Approval rate
db.aiokrsuggestions.aggregate([
  {$match: {company_id: ObjectId("...")}},
  {$group: {
    _id: null,
    total_suggested: {$sum: {$size: "$suggested_objectives"}},
    total_approved: {$sum: {$size: "$approved_objectives"}}
  }}
])
```

### **Task 3.11: Analytics (analytics.js)**

**Test Scenarios**:
1. [ ] **GET /api/analytics/executive-dashboard**
   - Aggregate company-wide metrics
   - Requires Scoring Engine
   - Authorization (BUSINESS_OWNER, CONSULTANT)

2. [ ] **GET /api/analytics/business-health**
   - Overall health score
   - Trend analysis

3. [ ] **GET /api/analytics/progress-trends**
   - Progress over time
   - Filter by date range

4. [ ] **GET /api/analytics/ssi/trends/user/:userId**
   - User SSI score trends
   - Compare across assessments

5. [ ] **GET /api/analytics/ssi/benchmarks/industry/:industry**
   - Industry benchmarks
   - Compare company scores

**Validation Queries**:
```javascript
// Company health metrics
db.objectives.aggregate([
  {$match: {company_id: ObjectId("..."), status: {$in: ["active", "on_track", "at_risk", "behind"]}}},
  {$group: {
    _id: "$status",
    count: {$sum: 1},
    avg_progress: {$avg: "$progress_percentage"}
  }}
])
```

### **Task 3.12: Cascade Operations (cascade.js)**

**Test Scenarios**:
1. [ ] **POST /api/cascade/validate**
   - Validate cascade hierarchy
   - Check circular dependencies
   - Verify alignment

2. [ ] **GET /api/cascade/:objectiveId**
   - Get cascade tree for objective
   - Show parent and children

**Validation Queries**:
```javascript
// Cascade hierarchy
db.objectives.find({
  company_id: ObjectId("..."),
  "alignment.cascaded_from_id": {$exists: true}
})
```

---

## 🔍 PHASE 4: DATA VALIDATION & INTEGRITY (Day 3-4)

### **Task 4.1: Index Validation**

For each model, verify indexes exist and are correct:

```javascript
// Run for each collection
db.users.getIndexes()
db.companies.getIndexes()
db.teams.getIndexes()
db.objectives.getIndexes()
db.goals.getIndexes()
db.tasks.getIndexes()
db.assessments.getIndexes()
db.assessment_templates.getIndexes()
db.assessment_questions.getIndexes()
db.invitations.getIndexes()
db.aiokrsuggestions.getIndexes()
```

**Checklist**:
- [ ] All company_id fields have indexes
- [ ] Unique indexes where required (email, token, template_id)
- [ ] Compound indexes for common queries
- [ ] No orphaned indexes (like subdomain_1)

### **Task 4.2: Foreign Key Validation**

Validate all ObjectId references:

```javascript
// Find orphaned users (company doesn't exist)
db.users.aggregate([
  {$lookup: {from: "companies", localField: "company_id", foreignField: "_id", as: "company"}},
  {$match: {company: {$size: 0}, company_id: {$ne: null}}}
])

// Find orphaned goals (objective doesn't exist)
db.goals.aggregate([
  {$lookup: {from: "objectives", localField: "objective_id", foreignField: "_id", as: "objective"}},
  {$match: {objective: {$size: 0}}}
])

// Find orphaned tasks (goal doesn't exist)
db.tasks.aggregate([
  {$lookup: {from: "goals", localField: "goal_id", foreignField: "_id", as: "goal"}},
  {$match: {goal: {$size: 0}}}
])
```

**Checklist**:
- [ ] No orphaned user records
- [ ] No orphaned team members
- [ ] No orphaned goals
- [ ] No orphaned tasks
- [ ] No orphaned assessments

### **Task 4.3: Data Type Validation**

Verify field data types match schema:

```javascript
// Check for invalid company_id types
db.users.find({company_id: {$type: "string"}}) // Should be empty

// Check for invalid dates
db.tasks.find({due_date: {$type: "string"}}) // Should be empty

// Check for invalid enums
db.users.find({role: {$nin: ["SUPER_ADMIN", "BUSINESS_OWNER", "MANAGER", "EMPLOYEE", "CONSULTANT"]}})
```

**Checklist**:
- [ ] All ObjectIds are ObjectId type (not strings)
- [ ] All dates are Date type
- [ ] All enums match defined values
- [ ] All required fields exist

### **Task 4.4: Business Logic Validation**

Test business rules:

**User Rules**:
- [ ] Email is unique per company (not globally for non-consultants)
- [ ] Consultants can have managed_businesses array
- [ ] Only BUSINESS_OWNER users can exist without company_id being required
- [ ] Password must meet strength requirements

**Company Rules**:
- [ ] Trial period defaults to 14 days
- [ ] Subscription tier affects feature access
- [ ] At least one BUSINESS_OWNER per company

**Objective/Goal Rules**:
- [ ] Objectives have target_year set
- [ ] Goals have valid quarter (Q1-Q4) and week (1-13)
- [ ] Progress percentage is 0-100
- [ ] Status transitions follow workflow

**Assessment Rules**:
- [ ] SSI scores are 0-100
- [ ] Overall score is calculated correctly
- [ ] Readiness profile matches score thresholds
- [ ] Individual assessments don't require invitation
- [ ] Team/org assessments may require invitation

---

## 📝 PHASE 5: DOCUMENTATION & API CONTRACTS (Day 4-5)

### **Task 5.1: Update API Documentation**

For each endpoint, document:

**Example Template**:
```markdown
### POST /api/objectives

**Description**: Create a new company objective

**Authentication**: Required (Bearer token)

**Authorization**: BUSINESS_OWNER, CONSULTANT

**Request Body**:
```json
{
  "title": "string (required, max 200)",
  "description": "string (optional, max 2000)",
  "target_year": "number (required, YYYY)",
  "category": "enum (financial, operational, strategic, customer, innovation)",
  "priority": "enum (critical, high, medium, low)",
  "owner_id": "ObjectId (optional, defaults to current user)",
  "key_results": "[{metric, target_value, unit}]"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "objective": {
    "_id": "ObjectId",
    "company_id": "ObjectId",
    "title": "string",
    "description": "string",
    "target_year": 2026,
    "category": "financial",
    "priority": "high",
    "status": "draft",
    "progress_percentage": 0,
    "owner_id": "ObjectId",
    "created_at": "ISODate",
    "updated_at": "ISODate"
  }
}
```

**Errors**:
- 400: Validation error
- 401: Unauthorized
- 403: Insufficient permissions
- 500: Server error
```
```

**Checklist**:
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Error codes listed
- [ ] Authorization requirements clear
- [ ] Query parameters documented

### **Task 5.2: Create Postman Collection**

- [ ] Create collection for all endpoints
- [ ] Add environment variables (token, company_id, user_id)
- [ ] Add pre-request scripts for auth
- [ ] Add tests for response validation
- [ ] Export collection to `/docs/api/postman_collection.json`

### **Task 5.3: Update Schema Documentation**

Create markdown docs for each model:

**Example**: `/docs/database/models/User.md`

```markdown
# User Model

## Overview
Represents a user in the Karvia platform with multi-tenant support.

## Schema

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| email | String | Yes | - | User's email address |
| password_hash | String | Yes | - | Bcrypt hashed password |
| first_name | String | Yes | - | User's first name |
| last_name | String | Yes | - | User's last name |
| role | String (enum) | Yes | EMPLOYEE | User role (SUPER_ADMIN, BUSINESS_OWNER, MANAGER, EMPLOYEE, CONSULTANT) |
| company_id | ObjectId | Conditional | null | Reference to Company (required except for CONSULTANT) |
| ... | ... | ... | ... | ... |

## Indexes
- email + company_id (unique compound)
- company_id
- role
- status

## Relationships
- Belongs to: Company (via company_id)
- Has many: Objectives (as owner)
- Has many: Goals (as owner)
- Has many: Tasks (as assigned user)

## Methods
- comparePassword(password): Boolean
- hasPermission(permission): Boolean
- getFullName(): String

## Virtuals
- full_name: first_name + last_name
- role_display: Human-readable role name

## Validation Rules
- Email format: RFC 5322
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Role: Must be valid enum value
```

---

## 🚀 PHASE 6: INTEGRATION TESTING (Day 5)

### **Task 6.1: End-to-End User Journeys**

**Journey 1: Business Owner Onboarding**
1. [ ] Signup (create company + user)
2. [ ] Login
3. [ ] Complete profile
4. [ ] Create first team
5. [ ] Invite team members
6. [ ] Take individual assessment
7. [ ] Review SSI scores
8. [ ] Generate AI OKR suggestions
9. [ ] Approve objectives
10. [ ] Create quarterly goals
11. [ ] Assign weekly tasks
12. [ ] Check progress dashboard

**Journey 2: Employee Task Completion**
1. [ ] Accept invitation
2. [ ] Signup/Login
3. [ ] Take assessment
4. [ ] View assigned tasks
5. [ ] Update task progress
6. [ ] Complete task
7. [ ] View personal dashboard

**Journey 3: Manager Team Management**
1. [ ] Login as manager
2. [ ] View team dashboard
3. [ ] Assign goals to team members
4. [ ] Create team tasks
5. [ ] Monitor team progress
6. [ ] Generate team reports

**Journey 4: Consultant Multi-Company**
1. [ ] Signup as consultant
2. [ ] Gain access to multiple companies
3. [ ] Take assessment for Company A
4. [ ] Generate OKRs for Company A
5. [ ] Switch to Company B
6. [ ] View Company B analytics
7. [ ] Create custom assessment template

### **Task 6.2: Data Flow Validation**

Test data flows across models:

**Flow 1: Assessment → AI OKR → Objectives**
```
1. User takes assessment
2. Assessment scored and saved
3. AI generates OKR suggestions based on scores
4. User approves suggestions
5. Objectives created from suggestions
6. Goals created under objectives
7. Tasks created under goals
```

**Validation**:
- [ ] Assessment scores correctly stored
- [ ] AI suggestions include rationale
- [ ] Approved objectives match suggestions
- [ ] company_id propagated correctly
- [ ] owner_id set correctly
- [ ] Progress rollup works (Task → Goal → Objective)

**Flow 2: Invitation → Assessment → Team Aggregation**
```
1. Manager sends bulk invitations to team
2. Team members accept invitations
3. Team members complete assessments
4. Individual scores calculated
5. Team average scores aggregated
6. Company-wide scores aggregated
```

**Validation**:
- [ ] All invitations tracked correctly
- [ ] Acceptance rate calculated
- [ ] Individual assessments linked to team
- [ ] Team aggregation accurate
- [ ] Company aggregation accurate

---

## ✅ PHASE 7: FINAL VALIDATION & SIGN-OFF (Day 5)

### **Task 7.1: Database Health Check**

```javascript
// Run all health checks
use karvia_business

// 1. Count documents in each collection
db.users.countDocuments()
db.companies.countDocuments()
db.teams.countDocuments()
db.objectives.countDocuments()
db.goals.countDocuments()
db.tasks.countDocuments()
db.assessments.countDocuments()
db.assessment_templates.countDocuments()
db.assessment_questions.countDocuments()
db.invitations.countDocuments()
db.aiokrsuggestions.countDocuments()

// 2. Check for orphaned records
// (Run all foreign key validation queries from Phase 4.2)

// 3. Check index usage
db.users.aggregate([{$indexStats: {}}])
db.companies.aggregate([{$indexStats: {}}])
// ... for each collection

// 4. Check database size
db.stats()
```

**Checklist**:
- [ ] No orphaned records
- [ ] All indexes present and used
- [ ] Database size reasonable
- [ ] No performance issues

### **Task 7.2: API Health Check**

- [ ] All endpoints return 200/201 for valid requests
- [ ] All endpoints return appropriate errors for invalid requests
- [ ] Response times acceptable (<500ms for simple queries)
- [ ] No memory leaks during load testing
- [ ] All authentication/authorization working

### **Task 7.3: Code Quality Check**

- [ ] No console.log statements in production code
- [ ] All TODO comments addressed
- [ ] Error handling consistent across routes
- [ ] Validation consistent across routes
- [ ] No hardcoded values (use env variables)

### **Task 7.4: Documentation Complete**

- [ ] All API endpoints documented
- [ ] All data models documented
- [ ] Postman collection created
- [ ] Database schema diagrams created
- [ ] README updated with testing instructions

---

## 📊 SUCCESS METRICS

At the end of Pre-Week 8, we should have:

**Data Integrity**:
- ✅ 11 data models fully validated
- ✅ 0 orphaned records
- ✅ 100% foreign key integrity
- ✅ All indexes optimized

**API Coverage**:
- ✅ 50+ endpoints tested
- ✅ 100% CRUD operations validated
- ✅ All authorization rules enforced
- ✅ Error handling consistent

**Migration Complete**:
- ✅ IAM engine updated to use Company
- ✅ 0 references to Business model
- ✅ All business_id → company_id
- ✅ Backward compatibility maintained

**Testing**:
- ✅ All user journeys validated
- ✅ All data flows tested
- ✅ Integration tests passing
- ✅ Load testing completed

**Documentation**:
- ✅ API contracts complete
- ✅ Model schemas documented
- ✅ Postman collection ready
- ✅ Testing guide created

---

## 🎯 DELIVERABLES

1. **Updated IAM Engine** (`engines/iam/index.js`)
2. **Test Results Document** (all CRUD operations validated)
3. **API Documentation** (`/docs/api/API_REFERENCE.md`)
4. **Database Schema Docs** (`/docs/database/models/*.md`)
5. **Postman Collection** (`/docs/api/postman_collection.json`)
6. **Data Integrity Report** (validation queries + results)
7. **Testing Guide** (`/docs/TESTING_GUIDE.md`)

---

## 🚨 RISK MITIGATION

**Risk 1: IAM Engine Migration Breaks Existing Auth**
- Mitigation: Test auth endpoints thoroughly before updating main server
- Rollback plan: Keep original IAM engine as backup

**Risk 2: Data Migration Issues**
- Mitigation: Run all validation queries on production clone first
- Backup database before any migrations

**Risk 3: Breaking Changes in API**
- Mitigation: Maintain backward compatibility where possible
- Document breaking changes clearly

**Risk 4: Performance Degradation**
- Mitigation: Run load tests before and after changes
- Monitor database query performance

---

## 📅 TIMELINE

| Day | Phase | Tasks | Deliverables |
|-----|-------|-------|--------------|
| **Day 1** | Model Audit + IAM Migration | Review all 11 models, Update IAM engine | Model audit checklist, Updated IAM engine |
| **Day 2** | CRUD Testing Part 1 | Test auth, companies, teams, objectives | Test results (Tasks 3.1-3.4) |
| **Day 3** | CRUD Testing Part 2 + Validation | Test goals, tasks, assessments, invitations | Test results (Tasks 3.5-3.12), Data integrity report |
| **Day 4** | Documentation | API docs, schema docs, Postman | API reference, Model docs, Postman collection |
| **Day 5** | Integration Testing + Sign-off | E2E journeys, health checks | Testing guide, Final validation report |

---

## 🎬 NEXT STEPS

After Pre-Week 8 completion:
1. Deploy validated models to staging
2. Run final load tests
3. Document any schema changes for Week 8
4. Begin Week 8 feature development with confidence in data layer

---

**Status**: ⏳ Ready to Execute
**Owner**: Development Team
**Review Date**: Before Week 8 Kickoff
