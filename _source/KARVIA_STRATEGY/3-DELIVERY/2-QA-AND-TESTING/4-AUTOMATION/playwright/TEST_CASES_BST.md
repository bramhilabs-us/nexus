# BST (Basic Smoke Tests) - Test Case Specifications

## Overview

**Priority**: P0 (Must Pass - Blocking)
**Total Test Cases**: 50
**Estimated Execution Time**: 30-45 minutes
**Pass Rate Required**: 100%

---

## Test Suite 1: Authentication (10 tests)

### TC-AUTH-001: Valid Login - Business Owner
**Priority**: P0
**Pre-conditions**: User exists with email=owner@test.com, password=Test123!
**Steps**:
1. Navigate to `/client/pages/login.html`
2. Enter email: `owner@test.com`
3. Enter password: `Test123!`
4. Click "Login" button

**Expected Results**:
- Redirected to `/client/pages/dashboard.html`
- JWT token stored in localStorage
- User name displayed in header
- Role badge shows "Business Owner"

**API Verification**:
- `POST /api/auth/login` returns 200
- Response includes `token`, `user` object
- Token is valid JWT with correct claims

---

### TC-AUTH-002: Valid Login - All Roles
**Priority**: P0
**Test Data**: 5 users (Consultant, Business Owner, Executive, Manager, Employee)
**Steps**:
For each role:
1. Navigate to login page
2. Enter credentials
3. Click login
4. Verify redirect to appropriate dashboard

**Expected Results**:
- Consultant → Dashboard with company switcher
- Business Owner → Executive Dashboard
- Executive → Executive Dashboard
- Manager → Manager Dashboard
- Employee → Employee Dashboard

---

### TC-AUTH-003: Invalid Login - Wrong Password
**Priority**: P0
**Steps**:
1. Navigate to login page
2. Enter email: `owner@test.com`
3. Enter password: `WrongPassword123!`
4. Click login

**Expected Results**:
- Error message: "Invalid email or password"
- No redirect
- No token stored
- Email field retains value
- Password field cleared

---

### TC-AUTH-004: Invalid Login - Non-existent User
**Priority**: P0
**Steps**:
1. Navigate to login page
2. Enter email: `nonexistent@test.com`
3. Enter password: `Test123!`
4. Click login

**Expected Results**:
- Error message: "Invalid email or password"
- Same UX as wrong password (don't reveal user existence)

---

### TC-AUTH-005: Session Persistence
**Priority**: P0
**Steps**:
1. Login as owner@test.com
2. Close browser
3. Reopen browser
4. Navigate to `/client/pages/dashboard.html`

**Expected Results**:
- User remains logged in (JWT in localStorage)
- Dashboard loads without redirect to login
- Session persists until logout or token expiry (7 days)

---

### TC-AUTH-006: Token Refresh
**Priority**: P0
**Pre-conditions**: User logged in with token expiring in 5 minutes
**Steps**:
1. Login and store token
2. Make API call after 5 minutes (token expired)
3. Observe automatic token refresh

**Expected Results**:
- Token refresh endpoint called automatically
- New token issued
- User not logged out
- API call succeeds

---

### TC-AUTH-007: Logout
**Priority**: P0
**Steps**:
1. Login as owner@test.com
2. Click "Logout" button in header
3. Attempt to access `/client/pages/dashboard.html`

**Expected Results**:
- Token removed from localStorage
- Redirected to login page
- Cannot access protected pages without re-login

---

### TC-AUTH-008: Signup - Business Owner
**Priority**: P0
**Steps**:
1. Navigate to `/client/pages/signup.html`
2. Fill form:
   - Email: `newowner@test.com`
   - Password: `Test123!`
   - First Name: `John`
   - Last Name: `Doe`
   - Company Name: `New Test Company`
   - Industry: `SaaS`
   - Employee Count: `50`
3. Click "Create Account"

**Expected Results**:
- `POST /api/auth/signup` returns 201
- User created with role=BUSINESS_OWNER
- Company created with name="New Test Company"
- User logged in automatically
- Redirected to dashboard

---

### TC-AUTH-009: Password Validation
**Priority**: P0
**Test Cases**:
| Password | Expected Result |
|----------|-----------------|
| `test` | Error: "Password must be at least 8 characters" |
| `test1234` | Error: "Password must contain special character" |
| `Test1234` | Error: "Password must contain special character" |
| `Test123!` | ✅ Valid |

---

### TC-AUTH-010: Email Validation
**Priority**: P0
**Test Cases**:
| Email | Expected Result |
|-------|-----------------|
| `test` | Error: "Invalid email format" |
| `test@` | Error: "Invalid email format" |
| `test@test` | Error: "Invalid email format" |
| `test@test.com` | ✅ Valid |
| `owner@test.com` | Error: "Email already registered" |

---

## Test Suite 2: Company Creation (5 tests)

### TC-COMPANY-001: Business Owner Creates Company
**Priority**: P0
**Pre-conditions**: User logged in as business owner without company
**Steps**:
1. Navigate to company setup wizard
2. Fill company form:
   - Name: `Test Company`
   - Industry: `SaaS`
   - Employee Count: `50`
3. Click "Create Company"

**Expected Results**:
- Company created in database
- User's `company_id` updated
- User role set to BUSINESS_OWNER
- Redirected to onboarding flow

---

### TC-COMPANY-002: Consultant Creates Company for Client
**Priority**: P0
**Pre-conditions**: User logged in as consultant
**Steps**:
1. Navigate to company management page
2. Click "Create Client Company"
3. Fill form:
   - Company Name: `Client Company 1`
   - Client Email: `client@test.com`
   - Industry: `Manufacturing`
4. Click "Create"

**Expected Results**:
- Company created
- Invitation sent to client email
- Company added to consultant's `managed_businesses`
- Consultant can switch to client company context

---

### TC-COMPANY-003: Company Validation
**Priority**: P0
**Test Cases**:
| Field | Invalid Value | Error Message |
|-------|---------------|---------------|
| Name | (empty) | "Company name is required" |
| Name | "A" (1 char) | "Company name must be at least 2 characters" |
| Industry | (empty) | "Industry is required" |
| Employee Count | 0 | "Employee count must be at least 1" |
| Employee Count | -10 | "Employee count must be positive" |

---

### TC-COMPANY-004: Multi-Tenant Isolation
**Priority**: P0 (CRITICAL)
**Steps**:
1. Create Company A with User A
2. Create Company B with User B
3. User A attempts to access Company B's objectives:
   `GET /api/objectives?company_id=<Company B ID>`

**Expected Results**:
- API returns 403 Forbidden
- No data leakage between companies
- User A can only access Company A data

---

### TC-COMPANY-005: Company Switching (Consultant)
**Priority**: P0
**Pre-conditions**: Consultant manages 2 companies
**Steps**:
1. Login as consultant
2. View company switcher dropdown
3. Select "Client Company 1"
4. Navigate to objectives page
5. Switch to "Client Company 2"
6. Refresh page

**Expected Results**:
- Company switcher shows both companies
- Objectives shown are for selected company only
- `current_company_id` updated in localStorage
- All API calls use current company context

---

## Test Suite 3: Assessment Template Creation (7 tests)

### TC-ASSESS-TEMPLATE-001: Create Template
**Priority**: P0
**Pre-conditions**: User logged in as consultant
**Steps**:
1. Navigate to `/client/pages/assessment-hub.html`
2. Click "Create Template"
3. Fill template form:
   - Name: `SSI Assessment`
   - Description: `Strategic Success Index Assessment`
4. Select 146 questions from question bank
5. Configure dimension weights:
   - Speed: 35%
   - Strength: 35%
   - Intelligence: 30%
6. Set weak area threshold: 40
7. Click "Save Template"

**Expected Results**:
- Template created with ID
- 146 questions associated
- Weights saved correctly
- Template appears in library

**API Verification**:
- `POST /api/assessmentTemplates` returns 201
- Response includes template with all fields

---

### TC-ASSESS-TEMPLATE-002: Template Validation
**Priority**: P0
**Test Cases**:
| Field | Invalid Value | Error |
|-------|---------------|-------|
| Name | (empty) | "Template name is required" |
| Description | (empty) | "Description is required" |
| Questions | 0 selected | "Must select at least 1 question" |
| Speed Weight | 0.5 (50%) | "Total weights must equal 100%" |
| Threshold | -10 | "Threshold must be between 0-100" |
| Threshold | 150 | "Threshold must be between 0-100" |

---

### TC-ASSESS-TEMPLATE-003: Question Selection
**Priority**: P0
**Steps**:
1. Create template
2. Open question bank (146 questions)
3. Filter by dimension: Speed
4. Select 50 Speed questions
5. Filter by dimension: Strength
6. Select 50 Strength questions
7. Filter by dimension: Intelligence
8. Select 46 Intelligence questions
9. Save template

**Expected Results**:
- All 146 questions selected
- Questions filtered correctly by dimension
- Question count displayed: "146 questions selected"

---

### TC-ASSESS-TEMPLATE-004: Dimension Weight Configuration
**Priority**: P0
**Steps**:
1. Create template
2. Set Speed weight: 35%
3. Set Strength weight: 35%
4. Set Intelligence weight: 30%
5. Verify total: 100%
6. Save template

**Expected Results**:
- Weights saved: { speed: 0.35, strength: 0.35, intelligence: 0.30 }
- Total equals 100%
- Error if total ≠ 100%

---

### TC-ASSESS-TEMPLATE-005: Weak Area Threshold Setting
**Priority**: P0
**Steps**:
1. Create template
2. Set threshold: 40
3. Save template

**Expected Results**:
- Threshold saved: 40
- Scores below 40 flagged as weak areas
- OKR generation triggered for weak dimensions

---

### TC-ASSESS-TEMPLATE-006: Template Save
**Priority**: P0
**Steps**:
1. Create template with all fields
2. Click "Save Template"
3. Navigate away
4. Return to template library
5. Verify template appears

**Expected Results**:
- Template persisted to database
- Template visible in library
- All fields retained

---

### TC-ASSESS-TEMPLATE-007: Send Template to Executive
**Priority**: P0
**Steps**:
1. Create template
2. Click "Send to Executive"
3. Enter executive email: `executive@test.com`
4. Click "Send"

**Expected Results**:
- Invitation created with type=assessment
- Email sent to executive
- Executive sees template in "My Templates" library

---

## Test Suite 4: Assessment Run & Scoring (10 tests)

### TC-ASSESS-RUN-001: Executive Receives Template
**Priority**: P0
**Steps**:
1. Consultant sends template to executive@test.com
2. Login as executive@test.com
3. Navigate to assessment hub
4. View "My Templates" tab

**Expected Results**:
- Template visible in "My Templates"
- Template details match consultant's template
- Status: "Ready to Distribute"

---

### TC-ASSESS-RUN-002: Executive Creates Team
**Priority**: P0
**Steps**:
1. Login as executive
2. Navigate to teams page
3. Click "Create Team"
4. Fill form:
   - Name: `Sales Team`
   - Function: `Sales`
   - Manager: `manager@test.com`
5. Click "Create"

**Expected Results**:
- Team created with 0 members
- Manager assigned
- Team appears in team list

---

### TC-ASSESS-RUN-003: Executive Sends Invitations
**Priority**: P0
**Steps**:
1. Executive selects template
2. Clicks "Distribute"
3. Selects team: Sales Team
4. Adds 5 team members:
   - employee1@test.com
   - employee2@test.com
   - employee3@test.com
   - employee4@test.com
   - employee5@test.com
5. Clicks "Send Invitations"

**Expected Results**:
- 5 invitations created
- Emails sent to all 5 members
- Invitation tokens generated
- Invitation status: "Sent"

---

### TC-ASSESS-RUN-004: Employee Accepts Invitation
**Priority**: P0
**Steps**:
1. Employee receives email
2. Clicks invitation link: `/client/pages/invitation-accept.html?token=<token>`
3. System validates token
4. Employee creates account or logs in
5. Redirected to assessment page

**Expected Results**:
- Token validated successfully
- Invitation status: "Opened"
- Employee account created/linked
- Assessment ready to start

---

### TC-ASSESS-RUN-005: Employee Takes Assessment (146 questions)
**Priority**: P0
**Steps**:
1. Employee navigates to assessment
2. Answers 146 questions (0-10 scale)
   - Speed questions (50): Avg score = 3.5
   - Strength questions (50): Avg score = 7.5
   - Intelligence questions (46): Avg score = 6.0
3. Progress auto-saved every 10 questions
4. Click "Submit Assessment"

**Expected Results**:
- All 146 questions answered
- Progress: 100%
- Responses saved
- Status: "Completed"

**Time**: ~45 minutes (industry standard)

---

### TC-ASSESS-RUN-006: Progress Saving
**Priority**: P0
**Steps**:
1. Employee starts assessment
2. Answers 50 questions
3. Closes browser (accidental close)
4. Reopens browser
5. Returns to assessment

**Expected Results**:
- Progress preserved: 50/146 (34%)
- Responses retained
- Can continue from question 51

---

### TC-ASSESS-RUN-007: Assessment Submission
**Priority**: P0
**Steps**:
1. Complete all 146 questions
2. Click "Submit Assessment"
3. Confirm submission dialog
4. Click "Confirm"

**Expected Results**:
- Status changed to "Completed"
- `completed_at` timestamp recorded
- Scoring process triggered
- Cannot edit responses after submission

**API Call**: `POST /api/assessments/:id/submit-responses`

---

### TC-ASSESS-RUN-008: SSI Score Calculation
**Priority**: P0 (CRITICAL)
**Test Data**:
- Speed questions (50 questions): Avg response = 3.5
- Strength questions (50 questions): Avg response = 7.5
- Intelligence questions (46 questions): Avg response = 6.0

**Expected Calculation**:
```
Speed:
  Raw Score = 3.5
  Weighted Score = 3.5 * 0.35 * 10 = 12.25

Strength:
  Raw Score = 7.5
  Weighted Score = 7.5 * 0.35 * 10 = 26.25

Intelligence:
  Raw Score = 6.0
  Weighted Score = 6.0 * 0.30 * 10 = 18.00

Composite Score = 12.25 + 26.25 + 18.00 = 56.50 / 100
Grade = D (60-69 range)
```

**Expected Results**:
- Speed: 12.25 (Weak - below 40 threshold)
- Strength: 26.25 (Medium)
- Intelligence: 18.00 (Medium)
- Composite: 56.50
- Grade: D

**Verification**:
- Weak area detected: Speed dimension
- OKR generation should target Speed

---

### TC-ASSESS-RUN-009: Weak Area Detection
**Priority**: P0
**Pre-conditions**: Assessment completed with Speed=12.25 (below 40 threshold)
**Steps**:
1. View assessment results
2. Check "Weak Areas" section

**Expected Results**:
- Speed flagged as weak area
- Speed score: 12.25 (status: "critical")
- Recommendation: "Generate OKRs to improve Speed dimension"
- Button: "Generate OKRs" enabled

---

### TC-ASSESS-RUN-010: Results Visibility (Role-Based)
**Priority**: P0
**Test Cases**:
| Role | Can View Individual | Can View Team | Can View All |
|------|---------------------|---------------|--------------|
| Employee | ✅ Self only | ❌ | ❌ |
| Manager | ✅ Self + team | ✅ Own team | ❌ |
| Executive | ✅ All | ✅ All | ✅ |
| Business Owner | ✅ All | ✅ All | ✅ |
| Consultant | ✅ All (read-only) | ✅ All | ✅ |

**Steps**:
For each role:
1. Login
2. Navigate to assessment results
3. Verify visible data matches permissions

**Expected Results**:
- Data filtered by role
- Unauthorized access returns 403

---

## Test Suite 5: AI OKR Generation (8 tests)

### TC-AI-OKR-001: Generate OKRs from Assessment
**Priority**: P0
**Pre-conditions**: Assessment completed with weak area (Speed=12.25)
**Steps**:
1. Login as executive
2. Navigate to assessment results
3. Click "Generate OKRs"
4. Wait for AI generation (15-30 seconds)

**Expected Results**:
- AI analyzes weak dimensions
- GPT-4 generates 3-5 objectives targeting Speed
- Each objective has 2-4 Key Results
- Objectives are contextual to business (SaaS, 50 employees)

**API Call**: `POST /api/ai-okr/generate/:assessmentId`

---

### TC-AI-OKR-002: AI Analyzes Weak Areas
**Priority**: P0
**Input Context**:
- Company: Test Company
- Industry: SaaS
- Employee Count: 50
- Weak Dimension: Speed (score: 12.25)
- Weak Categories: execution_velocity, decision_making, market_response

**Expected AI Analysis**:
```
Weak Areas Detected:
- Speed dimension: 12.25 / 100 (Critical)
- Specific categories:
  - Execution Velocity: 3.2 / 10
  - Decision Making: 3.5 / 10
  - Market Response: 3.8 / 10

Recommended Focus: Improve organizational speed and decision-making processes
```

---

### TC-AI-OKR-003: GPT-4 Generates 3-5 Objectives
**Priority**: P0
**Expected AI Output** (example):
```
Objective 1: Accelerate Decision-Making Velocity
  KR1: Reduce decision approval time from 5 days to 2 days
  KR2: Implement daily standup review process (100% attendance)
  KR3: Document 20 key decisions in decision log
  KR4: Reduce meeting time by 30%

Objective 2: Improve Execution Speed
  KR1: Increase feature release frequency from monthly to bi-weekly
  KR2: Reduce bug fix cycle time from 7 days to 3 days
  KR3: Achieve 85% on-time task completion rate

Objective 3: Enhance Market Responsiveness
  KR1: Reduce customer request response time from 48h to 24h
  KR2: Launch 2 competitive response initiatives
  KR3: Increase NPS score from 45 to 60
```

**Validation**:
- 3 objectives generated (minimum 3, maximum 5)
- Each objective targets Speed dimension
- Each KR is SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- Language is contextual to SaaS industry

---

### TC-AI-OKR-004: Objectives Target Weak Dimensions
**Priority**: P0
**Verification**:
1. Parse AI-generated objectives
2. For each objective:
   - Check if title mentions Speed-related keywords (velocity, speed, fast, quick, rapid)
   - Check if description targets weak categories
3. Verify objectives don't target strong dimensions (Strength=26.25)

**Expected Results**:
- All 3-5 objectives target Speed
- No objectives target Strength (strong area)

---

### TC-AI-OKR-005: Review Page Loads Suggestions
**Priority**: P0
**Steps**:
1. After AI generation completes
2. Redirected to `/client/pages/ai-okr-review.html`
3. Page loads suggestions

**Expected Results**:
- URL: `/client/pages/ai-okr-review.html`
- Suggestions visible (3-5 objective cards)
- Each card shows:
  - Objective title
  - Objective description
  - Key Results (2-4 per objective)
  - Edit button
  - Dismiss button
- "Approve All" button at bottom

---

### TC-AI-OKR-006: Edit Suggestion
**Priority**: P0
**Steps**:
1. View AI-generated suggestions
2. Click "Edit" on Objective 1
3. Change title: "Accelerate Decision-Making Velocity" → "Improve Decision Speed"
4. Change KR1 target: 2 days → 1 day
5. Click "Save Changes"

**Expected Results**:
- Changes saved to AIOKRSuggestion document
- Updated objective displayed
- Can edit again if needed

**API Call**: `PUT /api/ai-okr/edit/:suggestionId/:objectiveIndex`

---

### TC-AI-OKR-007: Approve Suggestions
**Priority**: P0
**Steps**:
1. Review all suggestions
2. Click "Approve All"
3. Confirm approval dialog

**Expected Results**:
- AIOKRSuggestion documents converted to Objective documents
- Objectives created with:
  - status: 'active'
  - ai_generated: true
  - start_date: 2025-01-01
  - end_date: 2025-12-31
  - Key Results embedded
- Redirected to objectives page
- Success message: "3 objectives created successfully"

**API Call**: `POST /api/ai-okr/approve`

---

### TC-AI-OKR-008: Regenerate if Unsatisfied
**Priority**: P0
**Steps**:
1. View AI-generated suggestions
2. Click "Not Satisfied? Regenerate"
3. Wait for new generation

**Expected Results**:
- Previous suggestions discarded
- New AI generation triggered
- New 3-5 objectives generated
- Different content than first generation

---

## Test Suite 6: Goal & Task Cascade (10 tests)

### TC-CASCADE-001: Create Objective with 4 Key Results
**Priority**: P0
**Steps**:
1. Login as executive
2. Navigate to objectives page
3. Click "Create Objective"
4. Fill form:
   - Title: "Improve Decision Velocity"
   - Description: "Reduce time-to-decision by 40%"
   - Category: Operational
   - Time Period: Calendar Year
   - Target Year: 2025
5. Add 4 Key Results:
   - Q1: Reduce approval time to 4 days (target: 25%)
   - Q2: Reduce approval time to 3 days (target: 50%)
   - Q3: Reduce approval time to 2.5 days (target: 75%)
   - Q4: Reduce approval time to 2 days (target: 100%)
6. Click "Create"

**Expected Results**:
- Objective created
- 4 Key Results embedded
- start_date: 2025-01-01
- end_date: 2025-12-31
- Quarters distributed correctly

---

### TC-CASCADE-002: Create Quarterly Goal for Q1
**Priority**: P0
**Steps**:
1. View Objective created in TC-CASCADE-001
2. Select KR #1 (Q1: Reduce approval time to 4 days)
3. Click "Create Goal"
4. Fill form:
   - Name: "Q1: Implement daily standup review process"
   - Quarter: Q1
   - Year: 2025
   - Target Value: 25
   - Owner: manager@test.com
5. Click "Create"

**Expected Results**:
- Goal created with:
  - time_period: 'QUARTERLY'
  - quarter: 'Q1'
  - start_date: 2025-01-01
  - due_date: 2025-03-31
  - target_value: 25
  - key_result_id: <KR #1 ID>

---

### TC-CASCADE-003: Create Weekly Goal for Week 1
**Priority**: P0
**Steps**:
1. View Q1 Goal created in TC-CASCADE-002
2. Click "Break Down to Weekly Goals"
3. System calculates 13 weeks in Q1
4. Create Week 1 goal:
   - Name: "Week 1: Initialize standup process"
   - Week: 1
   - start_date: 2025-01-01
   - due_date: 2025-01-07
   - target_value: 1.92 (25 / 13)
   - owner: employee@test.com
5. Click "Create"

**Expected Results**:
- Weekly goal created with:
  - time_period: 'WEEKLY'
  - week: 1
  - parent_goal_id: <Q1 Goal ID>
  - Dates within Q1 quarter
  - Proportional target

---

### TC-CASCADE-004: Create Task for Weekly Goal
**Priority**: P0
**Steps**:
1. View Week 1 goal
2. Click "Create Task"
3. Fill form:
   - Name: "Review standup notes and identify blockers"
   - Description: "Check previous day's standup for blockers"
   - assigned_to: employee@test.com
   - due_date: 2025-01-03
   - priority: high
   - estimated_hours: 1
4. Click "Create"

**Expected Results**:
- Task created with:
  - goal_id: <Week 1 Goal ID>
  - objective_id: <Objective ID>
  - status: 'todo'
  - progress: 0
  - Due date within Week 1 (Jan 1-7)

---

### TC-CASCADE-005: Assign Task to Employee
**Priority**: P0
**Steps**:
1. View task created in TC-CASCADE-004
2. Click "Assign"
3. Select user: employee@test.com
4. Click "Assign"

**Expected Results**:
- Task assigned_to updated
- Employee receives notification
- Task appears in employee's dashboard

---

### TC-CASCADE-006: Complete Task
**Priority**: P0
**Steps**:
1. Login as employee@test.com
2. Navigate to dashboard
3. View task: "Review standup notes and identify blockers"
4. Click checkbox to mark complete
5. System calls `POST /api/dashboard/complete-task/:taskId`

**Expected Results**:
- Task status: 'completed'
- Task progress: 100%
- completion_date: <current timestamp>
- Post-save hook triggered

---

### TC-CASCADE-007: Verify Task Completion Cascades to Weekly Goal
**Priority**: P0 (CRITICAL)
**Pre-conditions**: Week 1 goal has 5 tasks, 1 task just completed
**Steps**:
1. After task completion
2. Query Weekly Goal:
   `GET /api/goals/<Week 1 Goal ID>`
3. Check metrics

**Expected Results**:
- metrics.total_tasks: 5
- metrics.completed_tasks: 1
- metrics.completion_rate: 20%
- progress: 20% (auto-calculated)

---

### TC-CASCADE-008: Verify Weekly Goal Updates Quarterly Goal
**Priority**: P0 (CRITICAL)
**Pre-conditions**: Q1 goal has 13 weekly goals, Week 1 goal progress = 20%
**Steps**:
1. Query Quarterly Goal:
   `GET /api/goals/<Q1 Goal ID>`
2. Check progress

**Expected Calculation**:
```
Weekly goals:
  Week 1: 20%
  Week 2-13: 0%

Quarterly Goal Progress = (20% + 0% * 12) / 13 = 1.54%
```

**Expected Results**:
- progress: 1.54%
- child_goal_ids contains Week 1-13 goal IDs

---

### TC-CASCADE-009: Verify Quarterly Goal Updates Key Result
**Priority**: P0 (CRITICAL)
**Pre-conditions**: KR #1 has 1 goal (Q1), Q1 progress = 1.54%
**Steps**:
1. Query Objective:
   `GET /api/objectives/<Objective ID>`
2. Check KR #1 current_value

**Expected Calculation**:
```
KR #1 Target: 25%
Q1 Goal Progress: 1.54%

KR #1 Current Value = 1.54% (of 25% target) = 0.385% of annual target
```

**Expected Results**:
- key_results[0].current_value: 0.385
- key_results[0].status: 'in_progress'

---

### TC-CASCADE-010: Verify Key Result Updates Objective Progress
**Priority**: P0 (CRITICAL)
**Pre-conditions**: Objective has 4 KRs, KR#1 = 0.385%, KR#2-4 = 0%
**Steps**:
1. Check objective progress_percentage

**Expected Calculation**:
```
KR #1: 0.385%
KR #2: 0%
KR #3: 0%
KR #4: 0%

Objective Progress = (0.385 + 0 + 0 + 0) / 4 = 0.096%
```

**Expected Results**:
- progress_percentage: 0.096%
- status: 'active'

**Full Cascade Verification**:
```
Task Complete (100%)
  → Weekly Goal (1 task of 5 = 20%)
    → Quarterly Goal (Week 1: 20%, Weeks 2-13: 0% = 1.54%)
      → Key Result (1.54% of 25% target = 0.385% of annual)
        → Objective (KR#1: 0.385%, KR#2-4: 0% = 0.096%)
```

---

## Test Suite 7: Invitations & Acceptance (5 tests)

### TC-INVITE-001: Send User Invitation
**Priority**: P0
**Steps**:
1. Login as executive
2. Navigate to teams page
3. Click "Invite Member"
4. Enter email: `newmember@test.com`
5. Select role: Employee
6. Click "Send Invitation"

**Expected Results**:
- Invitation created with type='user_invite'
- Token generated (unique, 7-day expiry)
- Email sent via Mailjet
- Status: 'sent'

---

### TC-INVITE-002: Validate Invitation Token
**Priority**: P0
**Steps**:
1. User receives invitation email
2. Clicks link: `/client/pages/invitation-accept.html?token=<token>`
3. System calls `GET /api/invitations/validate/<token>`

**Expected Results**:
- Token valid (not expired, not used)
- Invitation details returned
- Page displays: "You've been invited to join Test Company"

---

### TC-INVITE-003: Accept Invitation
**Priority**: P0
**Steps**:
1. User on invitation-accept page
2. Fills account creation form:
   - Email: newmember@test.com (pre-filled)
   - Password: Test123!
   - First Name: Jane
   - Last Name: Doe
3. Clicks "Accept & Create Account"
4. System calls `POST /api/invitations/accept/<token>`

**Expected Results**:
- User account created
- company_id set to invitation company
- role set to invitation role (Employee)
- Invitation status: 'completed'
- User logged in
- Redirected to dashboard

---

### TC-INVITE-004: Create Account from Invitation
**Priority**: P0
**Verification**:
1. Check User document:
   - email: newmember@test.com
   - company_id: <Test Company ID>
   - role: 'EMPLOYEE'
   - status: 'active'
2. Check Company metrics:
   - total_users increased by 1

---

### TC-INVITE-005: Invitation Expiry
**Priority**: P0
**Pre-conditions**: Invitation created 8 days ago (expired)
**Steps**:
1. User clicks expired invitation link
2. System validates token

**Expected Results**:
- Token expired
- Error message: "This invitation has expired. Please contact your administrator for a new invitation."
- Cannot create account

---

## Test Suite 8: Dashboard Rollups (8 tests)

### TC-DASHBOARD-001: Employee Dashboard Loads
**Priority**: P0
**Steps**:
1. Login as employee@test.com
2. Navigate to `/client/pages/dashboard.html`

**Expected Results**:
- Page loads within 2 seconds
- Quick stats visible
- Today's tasks loaded
- Weekly view rendered

---

### TC-DASHBOARD-002: Employee Sees Assigned Tasks
**Priority**: P0
**Pre-conditions**: Employee has 8 tasks assigned for today
**Steps**:
1. View dashboard
2. Check "Today's Tasks" section

**Expected Results**:
- 8 tasks displayed
- Each task shows:
  - Task name
  - Parent goal name
  - Due time
  - Priority (color-coded)
  - Checkbox
  - Progress slider

---

### TC-DASHBOARD-003: Quick Stats Accurate
**Priority**: P0
**Test Data**:
- Employee has 8 tasks today
- 2 tasks overdue (due_date < today)
- 0 tasks completed today
- Week progress: 25%

**Expected Quick Stats**:
```
Tasks Today: 8
Overdue: 2
Week Progress: 25%
Completed Today: 0
```

---

### TC-DASHBOARD-004: Manager Dashboard Shows Team Data
**Priority**: P0
**Steps**:
1. Login as manager@test.com
2. Navigate to manager dashboard

**Expected Results**:
- Team members displayed (5 members)
- Each member shows:
  - Name
  - Tasks assigned
  - Tasks completed
  - Progress this week
- Team-level metrics:
  - Total tasks
  - Completion rate
  - Average progress

---

### TC-DASHBOARD-005: Executive Dashboard Shows Company OKRs
**Priority**: P0
**Steps**:
1. Login as executive@test.com
2. Navigate to executive dashboard

**Expected Results**:
- All company objectives displayed (10 objectives)
- Each objective card shows:
  - Title
  - Progress ring
  - Status badge
  - Key Results count
  - Health indicator
- Filters: Category, Status, Quarter

---

### TC-DASHBOARD-006: Progress Calculations Accurate
**Priority**: P0
**Test Scenario**:
- Objective with 4 KRs
- KR#1: 25% complete
- KR#2: 0% complete
- KR#3: 0% complete
- KR#4: 0% complete

**Expected Objective Progress**:
```
(25 + 0 + 0 + 0) / 4 = 6.25%
```

**Verification**:
- Dashboard shows 6.25%
- Progress ring filled to 6.25%

---

### TC-DASHBOARD-007: Cascade Updates Reflected in Dashboards
**Priority**: P0
**Steps**:
1. Employee completes task
2. Refresh employee dashboard
3. Refresh manager dashboard
4. Refresh executive dashboard

**Expected Results**:
- Employee dashboard: "Completed Today" increases by 1
- Manager dashboard: Team member's completion count increases
- Executive dashboard: Objective progress updates
- All dashboards show updated data within 5 seconds

---

### TC-DASHBOARD-008: Real-Time Updates
**Priority**: P0
**Steps**:
1. Open employee dashboard in Browser A
2. Open same dashboard in Browser B (same user)
3. Complete task in Browser A
4. Observe Browser B (without manual refresh)

**Expected Results**:
- Browser B updates automatically (WebSocket or polling)
- Completed count increases
- Task list updates
- Week progress updates

---

## Test Suite 9: Data Integrity Audit (5 tests)

### TC-INTEGRITY-001: Verify Relationships Intact
**Priority**: P0
**Test Cases**:
1. User → Company (company_id)
2. Objective → Company (company_id)
3. Objective → Owner (owner_id)
4. Goal → Objective (objective_id)
5. Goal → Key Result (key_result_id)
6. Goal → Parent Goal (parent_goal_id)
7. Task → Goal (goal_id)
8. Task → Objective (objective_id)
9. Task → Assigned User (assigned_to)

**Verification**:
```sql
-- Check for orphaned goals
SELECT * FROM goals WHERE objective_id NOT IN (SELECT _id FROM objectives)
-- Result: 0 rows

-- Check for orphaned tasks
SELECT * FROM tasks WHERE goal_id NOT IN (SELECT _id FROM goals)
-- Result: 0 rows
```

---

### TC-INTEGRITY-002: Verify Progress Calculations
**Priority**: P0
**Test Scenario**:
- Objective with 1 KR, 1 goal, 10 tasks
- Complete 5 tasks

**Expected Calculations**:
```
Tasks: 5/10 completed = 50%
Goal: 50% (from tasks)
KR: 50% (from goal)
Objective: 50% (from KR)
```

**Verification**:
1. Query Task progress: 50%
2. Query Goal progress: 50%
3. Query KR current_value: 50
4. Query Objective progress_percentage: 50

All must match.

---

### TC-INTEGRITY-003: Verify Date Cascades
**Priority**: P0
**Scenario**: Objective dates change from Jan-Dec 2025 to Feb-Nov 2025
**Steps**:
1. Create objective (Jan 1 - Dec 31, 2025)
2. Create goal (Jan 1 - Mar 31, Q1)
3. Create task (Jan 5)
4. Update objective dates to Feb 1 - Nov 30
5. Check goal and task dates

**Expected Results**:
- Goal dates cascade: Jan 1-Mar 31 → Feb 1-Apr 29 (proportional)
- Task dates cascade: Jan 5 → Feb 4 (proportional)

**Verification**:
```javascript
// Proportional calculation
oldObjectiveStart = Jan 1
oldObjectiveEnd = Dec 31
newObjectiveStart = Feb 1
newObjectiveEnd = Nov 30

oldGoalStart = Jan 1
oldGoalEnd = Mar 31

// Calculate new goal dates
oldDuration = Dec 31 - Jan 1 = 365 days
newDuration = Nov 30 - Feb 1 = 303 days

goalStartOffset = (Jan 1 - Jan 1) / 365 = 0%
goalEndOffset = (Mar 31 - Jan 1) / 365 = 24.66%

newGoalStart = Feb 1 + (0% * 303) = Feb 1
newGoalEnd = Feb 1 + (24.66% * 303) = Apr 29
```

---

### TC-INTEGRITY-004: Verify SSI Score Calculations
**Priority**: P0
**Test Data**:
```javascript
Template Weights:
  Speed: 0.35
  Strength: 0.35
  Intelligence: 0.30

Responses:
  Speed (50 questions): [3.5, 3.5, 3.5, ..., 3.5] avg=3.5
  Strength (50 questions): [7.5, 7.5, 7.5, ..., 7.5] avg=7.5
  Intelligence (46 questions): [6.0, 6.0, 6.0, ..., 6.0] avg=6.0
```

**Expected Calculation**:
```
Speed Score = 3.5 * 0.35 * 10 = 12.25
Strength Score = 7.5 * 0.35 * 10 = 26.25
Intelligence Score = 6.0 * 0.30 * 10 = 18.00

Composite Score = 12.25 + 26.25 + 18.00 = 56.50 / 100
```

**Verification**:
1. Submit assessment
2. Query assessment document
3. Check dimension_scores:
   - speed.weighted_score = 12.25
   - strength.weighted_score = 26.25
   - intelligence.weighted_score = 18.00
4. Check composite_score = 56.50

**All calculations must match to 2 decimal places.**

---

### TC-INTEGRITY-005: Verify Weak Area Detection Logic
**Priority**: P0
**Test Cases**:
| Speed Score | Threshold | Expected Status |
|-------------|-----------|-----------------|
| 12.25 | 40 | critical (below threshold) |
| 35.00 | 40 | needs_attention (below threshold) |
| 42.00 | 40 | on_track (above threshold) |
| 70.00 | 40 | on_track (well above threshold) |

**Verification**:
```javascript
if (speedScore < threshold) {
  status = speedScore < (threshold * 0.7) ? 'critical' : 'needs_attention'
} else {
  status = 'on_track'
}
```

**Expected Results**:
- 12.25 < 40 → critical (12.25 < 28)
- 35.00 < 40 → needs_attention (35 > 28)
- 42.00 >= 40 → on_track
- 70.00 >= 40 → on_track

---

## Execution Summary

### Total BST Tests: 50

| Suite | Tests | Estimated Time |
|-------|-------|----------------|
| 1. Authentication | 10 | 5 min |
| 2. Company Creation | 5 | 3 min |
| 3. Assessment Template | 7 | 5 min |
| 4. Assessment Run & Scoring | 10 | 10 min |
| 5. AI OKR Generation | 8 | 7 min |
| 6. Goal & Task Cascade | 10 | 8 min |
| 7. Invitations | 5 | 3 min |
| 8. Dashboard Rollups | 8 | 5 min |
| 9. Data Integrity Audit | 5 | 4 min |

**Total Execution Time**: 50 minutes

### Pass Criteria

- ✅ **100% pass rate required**
- ✅ All P0 tests must pass
- ✅ No test should take >2 minutes
- ✅ Flakiness rate <1%

### Failure Handling

- **Any BST failure → Block deployment**
- **>2 BST failures → Escalate to Engineering Lead**
- **Data integrity failure → Immediate hotfix required**

---

**Document Version**: 1.0
**Last Updated**: November 23, 2025
**Maintained By**: QA Team
