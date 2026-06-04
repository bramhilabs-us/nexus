# Integration Testing Guide - Week 1 (Assessment Module)

## Overview

This document provides a comprehensive integration testing flow for the Week 1 Assessment module of Karvia Business. These tests verify the complete end-to-end functionality of the SSI Assessment system, covering both API endpoints and frontend UI.

**Testing Duration:** 2-3 hours
**Prerequisites:** Server running on localhost:8080, IAM engine on 8081, Assessment engine on 8082

---

## Test Environment Setup

### 1. Start All Services

```bash
# Terminal 1: Main server
cd /path/to/karvia_business/server
node index.js

# Terminal 2: IAM Engine
cd /path/to/karvia_business/engines/iam
node index.js

# Terminal 3: Assessment Engine
cd /path/to/karvia_business/engines/assessment
node index.js
```

### 2. Verify Health Endpoints

```bash
curl http://localhost:8080/health
curl http://localhost:8081/health
curl http://localhost:8082/health
```

Expected: All should return `status: "healthy"`

---

## Test Flow 1: Consultant Signup & Template Creation

### 1.1 Consultant Signup (UI Test)

**Steps:**
1. Open browser to `http://localhost:8080/pages/signup.html`
2. Fill in the form:
   - First Name: `Jane`
   - Last Name: `Consultant`
   - Email: `jane.consultant@karvia.test`
   - Password: `SecurePass123!`
   - Role: `Consultant (Manage multiple businesses)`
3. Click **Create Account**

**Expected Results:**
- Success message appears
- Redirected to consultant dashboard
- Token stored in localStorage
- User object contains `role: "CONSULTANT"` and empty `managed_businesses` array

**API Verification:**
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Consultant",
    "email": "jane.consultant2@karvia.test",
    "password": "SecurePass123!",
    "role": "CONSULTANT"
  }'
```

Expected: Returns `201` with token and user object with `business_id: null`

---

### 1.2 Create Global Assessment Template (UI Test)

**Steps:**
1. Navigate to `http://localhost:8080/pages/assessment-home.html`
2. Click the **Templates** tab
3. Click **Create Template**
4. Fill in template details:
   - Name: `SSI Standard Assessment`
   - Description: `Standard Speed-Strength-Intelligence assessment`
   - Is Global: `Yes`
   - Is Active: `Yes`
5. Add questions from the Question Library
6. Ensure at least 5 questions per dimension (speed, strength, intelligence)
7. Click **Save Template**

**Expected Results:**
- Template created successfully
- Appears in templates list
- Question count displayed correctly
- Marked as "Global" and "Active"

**API Verification:**
```bash
# Get authentication token from localStorage
TOKEN="<your-token-here>"

curl -X POST http://localhost:8080/api/assessment-templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "SSI Standard Assessment",
    "description": "Standard Speed-Strength-Intelligence assessment",
    "is_global": true,
    "is_active": true,
    "selected_questions": ["<question-id-1>", "<question-id-2>", ...]
  }'
```

Expected: Returns `201` with created template object

---

## Test Flow 2: Business Owner Signup & Invitation Creation

### 2.1 Business Owner Signup (UI Test)

**Steps:**
1. Open new incognito window to `http://localhost:8080/pages/signup.html`
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Owner`
   - Email: `john.owner@acmecorp.test`
   - Password: `SecurePass456!`
   - Role: `Business Owner`
   - Business Name: `Acme Corporation`
   - Industry: `Technology`
   - Number of Employees: `50`
3. Click **Create Account**

**Expected Results:**
- Success message appears
- Business created with name "Acme Corporation"
- User created with `role: "BUSINESS_OWNER"`
- User's `business_id` points to the new business
- Redirected to dashboard

**API Verification:**
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Owner",
    "email": "john.owner2@acmecorp.test",
    "password": "SecurePass456!",
    "role": "BUSINESS_OWNER",
    "business_name": "Acme Corporation",
    "industry": "technology",
    "employee_count": 50
  }'
```

Expected: Returns `201` with token, user object, and business object

---

### 2.2 Create Assessment Invitations (UI Test)

**Steps:**
1. As Business Owner, navigate to `http://localhost:8080/pages/assessment-invitations.html`
2. Click **Create Invitation**
3. Fill in invitation form:
   - Template: `SSI Standard Assessment`
   - Recipients:
     - Email: `alice.manager@acmecorp.test`, Role: `Manager`
     - Email: `bob.employee@acmecorp.test`, Role: `Employee`
     - Email: `carol.executive@acmecorp.test`, Role: `Executive`
   - Custom Message: `Please complete this assessment by EOW.`
   - Expiration: 7 days from now
4. Click **Send Invitations**

**Expected Results:**
- Success message: "Successfully created 3 invitation(s)!"
- All 3 invitations appear in the list with status "Pending"
- Each invitation has a unique token
- Invitation links are displayed with copy buttons

**API Verification:**
```bash
TOKEN="<business-owner-token>"

curl -X POST http://localhost:8080/api/invitations/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "template_id": "<template-id>",
    "recipients": [
      {
        "recipient_email": "alice.manager@acmecorp.test",
        "recipient_role": "MANAGER"
      },
      {
        "recipient_email": "bob.employee@acmecorp.test",
        "recipient_role": "EMPLOYEE"
      },
      {
        "recipient_email": "carol.executive@acmecorp.test",
        "recipient_role": "EXECUTIVE"
      }
    ],
    "message": "Please complete this assessment by EOW.",
    "expires_at": "2025-10-20T23:59:59.000Z"
  }'
```

Expected: Returns `201` with array of 3 created invitations

---

## Test Flow 3: Employee Takes Assessment (Public Flow)

### 3.1 Validate Invitation Token (API Test)

```bash
TOKEN="<invitation-token-from-step-2.2>"

curl -X GET "http://localhost:8080/api/invitations/validate/$TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Invitation is valid",
  "invitation": {
    "recipient_email": "bob.employee@acmecorp.test",
    "recipient_role": "EMPLOYEE",
    "business_id": "<business-id>",
    "business_name": "Acme Corporation",
    "template_id": "<template-id>",
    "template_name": "SSI Standard Assessment",
    "used_at": null,
    "expires_at": "2025-10-20T23:59:59.000Z"
  }
}
```

---

### 3.2 Accept Invitation & Create Account (UI Test)

**Steps:**
1. Open invitation link in new incognito window:
   `http://localhost:8080/pages/assessment-take.html?token=<invitation-token>`
2. See welcome screen with business name and assessment title
3. Fill in account creation form:
   - First Name: `Bob`
   - Last Name: `Employee`
   - Password: `SecurePass789!`
4. Click **Create Account & Start Assessment**

**Expected Results:**
- Account created successfully
- User logged in automatically (token stored)
- Welcome screen disappears
- Assessment questions screen appears
- Progress bar shows "Question 1 of X"

**API Verification:**
```bash
curl -X POST "http://localhost:8080/api/invitations/accept/$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Bob",
    "last_name": "Employee",
    "password": "SecurePass789!"
  }'
```

Expected: Returns `201` with token and user object, `invitation.used_at` now populated

---

### 3.3 Complete Assessment Questions (UI Test)

**Steps:**
1. Read Question 1 (e.g., "I complete tasks quickly and efficiently")
2. See dimension badge (e.g., "Speed")
3. See response scale from 0 (Strongly Disagree) to 10 (Strongly Agree)
4. Select a response value (e.g., `8`)
5. Click **Next**
6. Repeat for all questions
7. On the last question, click **Submit Assessment**

**Expected Results:**
- Each question displays correctly with text, dimension, and scale
- Selected responses are highlighted
- Progress bar updates with each question
- "Previous" button appears after Question 1
- "Next" button disabled until response selected
- On submission, see completion screen with checkmark
- "View Your Results" button appears

**API Verification:**
```bash
USER_TOKEN="<bob-employee-token>"

curl -X POST http://localhost:8080/api/assessments/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "template_id": "<template-id>",
    "responses": [
      { "question_id": "<q1-id>", "value": 8 },
      { "question_id": "<q2-id>", "value": 7 },
      { "question_id": "<q3-id>", "value": 6 },
      ...
    ]
  }'
```

Expected: Returns `201` with assessment object including:
- `composite_score` (weighted average)
- `dimension_scores` (speed, strength, intelligence)
- `status` (healthy, needs_attention, critical)

---

## Test Flow 4: View Assessment Results

### 4.1 View Individual Results (UI Test)

**Steps:**
1. Click **View Your Results** on completion screen
2. Navigate to `http://localhost:8080/pages/assessment-results.html`

**Expected Results:**
- Overall Performance section displays:
  - Composite Score (large number with status badge)
  - Speed score with 35% weight label
  - Strength score with 35% weight label
  - Intelligence score with 30% weight label
- Dimension Breakdown shows horizontal bar charts for each dimension
- Areas for Improvement section lists questions with scores < 5.0
- No comparison section (first assessment)

**API Verification:**
```bash
curl -X GET http://localhost:8080/api/assessments/my-assessments \
  -H "Authorization: Bearer $USER_TOKEN"
```

Expected: Returns array with one assessment

```bash
ASSESSMENT_ID="<assessment-id-from-above>"

curl -X GET "http://localhost:8080/api/assessments/$ASSESSMENT_ID/results" \
  -H "Authorization: Bearer $USER_TOKEN"
```

Expected: Returns detailed results with weak_areas array

---

### 4.2 View Team Results (Business Owner) (UI Test)

**Steps:**
1. Log in as Business Owner (`john.owner@acmecorp.test`)
2. Navigate to `http://localhost:8080/pages/assessment-home.html`
3. Click **Team Assessments** tab

**Expected Results:**
- Team Overview shows team average score
- List of team members who completed assessments:
  - Name: Bob Employee
  - Latest Score: X.X
  - Status badge
  - Diff from team: +/- X.X
- If other team members haven't completed yet, they don't appear

**API Verification:**
```bash
BUSINESS_OWNER_TOKEN="<business-owner-token>"
BUSINESS_ID="<business-id>"

curl -X GET "http://localhost:8080/api/assessments/team/$BUSINESS_ID" \
  -H "Authorization: Bearer $BUSINESS_OWNER_TOKEN"
```

Expected: Returns team aggregation with:
- `team_average`
- `team_members` array with each member's scores and comparison

---

## Test Flow 5: Manager Role & Team Filtering

### 5.1 Manager Signup via Invitation

**Steps:**
1. Use invitation link for `alice.manager@acmecorp.test`
2. Complete signup and assessment
3. Log in as Manager

**Expected Results:**
- Manager can view **Team Assessments** tab
- Manager only sees direct reports (filtered by `manager_id`)
- Cannot see other teams

**API Verification:**
```bash
MANAGER_TOKEN="<manager-token>"

curl -X GET "http://localhost:8080/api/assessments/team/$BUSINESS_ID" \
  -H "Authorization: Bearer $MANAGER_TOKEN"
```

Expected: Returns only team members where `manager_id` matches manager's user ID

---

## Test Flow 6: Second Assessment & Comparison

### 6.1 Complete Second Assessment

**Steps:**
1. As Bob Employee, wait 1 day (or just proceed for testing)
2. Complete another invitation for the same template
3. Submit with different responses

**Expected Results:**
- Second assessment recorded
- View results shows **Progress Over Time** section
- Comparison displays:
  - Previous Score: X.X
  - Change: +/- X.X (with arrow indicator)
  - Speed Change: +/- X.X
  - Strength Change: +/- X.X
  - Intelligence Change: +/- X.X

**API Verification:**
```bash
curl -X GET "http://localhost:8080/api/assessments/$ASSESSMENT_ID/results" \
  -H "Authorization: Bearer $USER_TOKEN"
```

Expected: Response includes `comparison` object with previous assessment data

---

## Edge Case Testing

### 6.1 Expired Invitation

**Steps:**
1. Create invitation with `expires_at` in the past
2. Attempt to validate token

**Expected:** Status 400, "Invitation has expired"

---

### 6.2 Already Used Invitation

**Steps:**
1. Use an invitation token that has already been accepted
2. Attempt to validate again

**Expected:** Status 400, "Invitation has already been used"

---

### 6.3 Invalid Token

**Steps:**
1. Use a random token string
2. Attempt to validate

**Expected:** Status 404, "Invitation not found"

---

### 6.4 Incomplete Assessment Submission

**Steps:**
1. Submit assessment with missing responses

**API Test:**
```bash
curl -X POST http://localhost:8080/api/assessments/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "template_id": "<template-id>",
    "responses": [
      { "question_id": "<q1-id>", "value": 8 }
    ]
  }'
```

**Expected:** Status 400, validation error about missing responses

---

### 6.5 Duplicate Question IDs

**Steps:**
1. Attempt to create template with duplicate question IDs

**Expected:** Status 400, "Duplicate question IDs detected"

---

### 6.6 Consultant Multi-Business Access

**Steps:**
1. Log in as Consultant
2. Add multiple businesses to `managed_businesses`
3. Get templates list

**Expected:** Templates from all managed businesses + global templates

---

## Performance Testing

### 7.1 Load Testing (Optional)

Use a tool like Apache Bench or Artillery to test:

```bash
# Test invitation creation endpoint
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
   -p invitation-data.json -T application/json \
   http://localhost:8080/api/invitations/create

# Test assessment submission
ab -n 100 -c 10 -H "Authorization: Bearer $USER_TOKEN" \
   -p assessment-data.json -T application/json \
   http://localhost:8080/api/assessments/submit
```

**Expected:**
- All requests succeed (200/201)
- Response times < 500ms for 95th percentile
- No database deadlocks or connection errors

---

## Verification Checklist

### Authentication & Authorization
- [ ] Consultant signup creates user with no business_id
- [ ] Business Owner signup creates both user and business
- [ ] Invitation tokens are unique and secure
- [ ] Rate limiting works on public endpoints (20/hour validation, 5/hour acceptance)
- [ ] JWT tokens are valid and include correct payload

### Assessment Templates
- [ ] Templates can be created with selected questions
- [ ] Duplicate question IDs are rejected
- [ ] Question count is accurate
- [ ] Global templates visible to all roles
- [ ] Business templates only visible to business members + consultant

### Invitations
- [ ] Multiple invitations created in batch
- [ ] Each invitation has unique token
- [ ] Expiration dates are respected
- [ ] Used invitations cannot be reused
- [ ] Role-based filtering works (managers see only their invitations)

### Assessment Taking
- [ ] Questions load dynamically from invitation token
- [ ] Response scale 0-10 works correctly
- [ ] Progress bar updates accurately
- [ ] Navigation (Previous/Next) works
- [ ] Submission validates all questions answered
- [ ] Inverse questions handled correctly

### Scoring
- [ ] Composite score calculated with correct weights (35/35/30)
- [ ] Dimension scores accurate
- [ ] Status determination correct (healthy ≥7.0, needs_attention 5.0-7.0, critical <5.0)
- [ ] Weak areas identified (scores < 5.0)
- [ ] Comparison with previous assessment works

### Results Display
- [ ] Individual results page displays all scores
- [ ] Dimension breakdown bars animate correctly
- [ ] Weak areas section populates when applicable
- [ ] Progress comparison shown for second+ assessments
- [ ] Team results aggregate correctly
- [ ] Manager filtering works (only shows direct reports)

### Frontend UI
- [ ] Navigation system renders based on role
- [ ] Auth check redirects unauthenticated users
- [ ] Signup page shows/hides business fields based on role
- [ ] Login page handles return URLs correctly
- [ ] Assessment home page tabs display based on role
- [ ] Invitations page lists all invitations with status
- [ ] Assessment take page is fully public (no auth required before acceptance)
- [ ] Results page displays charts and comparisons

---

## Known Issues & Limitations

1. **ISS-027:** Rate limiters referenced in code but need verification they exist in middleware
2. **ISS-028:** Email sending not implemented; invitations create links but don't send emails (deferred to Week 2)
3. **ISS-024:** Integration tests for invitation flow not yet created (manual testing only)
4. Unit tests deferred to maintain velocity

---

## Testing Sign-Off

**Tester Name:** _______________
**Date:** _______________
**Environment:** Development / Staging / Production
**Overall Status:** Pass / Fail / Partial
**Notes:**

---

## Next Steps After Testing

1. Address any failing tests
2. Document any new bugs found in MASTER_ISSUES_LIST.md
3. Update MASTER_DEV_LIST.md with completion status
4. Proceed to Week 2 development

---

**Document Version:** 1.0
**Last Updated:** October 13, 2025
**Author:** Claude Code Agent
