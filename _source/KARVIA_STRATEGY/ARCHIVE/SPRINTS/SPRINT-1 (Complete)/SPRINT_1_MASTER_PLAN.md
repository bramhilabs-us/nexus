# 🚀 Sprint 1: Consultant Journey - Company Assessment Flow

**Sprint Duration**: 9 Days (Nov 6-16, 2025)
**Sprint Goal**: Enable consultant → company exec → teams assessment workflow with detailed team results and OKR generation
**Status**: 🔴 Not Started
**Version**: 1.0.0
**Created**: November 5, 2025

---

## 📊 Sprint Overview

### **Goal Statement**
Enable consultants to share assessment templates with company executives, who automatically get company + user accounts created, then can create teams, share assessments, and view detailed team results leading to targeted OKR generation.

### **Success Criteria**
- ✅ Consultant can send assessment to company (1-click with email)
- ✅ Company + Executive user auto-created on invitation
- ✅ Executive sets password and accesses assessment hub immediately
- ✅ Executive creates teams and shares assessment
- ✅ Enhanced team results page shows breakdown by function/role with heatmap
- ✅ Generate 4 OKRs button on team results page
- ✅ All flows tested end-to-end

### **Key Metrics**
- **Time to Onboard Executive**: < 2 minutes (from email click to assessment hub)
- **Reuse Level**: > 85% existing code
- **New Code**: ~1,500 lines (vs 5,000 if built from scratch)
- **APIs Created**: 4 new endpoints
- **Pages Modified**: 3 (no new pages!)

---

## 🎯 Sprint Scope

### **In Scope**
1. ✅ Automated company + user creation on invitation
2. ✅ "Send to Company" button in assessment hub
3. ✅ Simplified exec onboarding (set password only)
4. ✅ Share assessment with teams (team selector)
5. ✅ Enhanced team results with breakdown table
6. ✅ Heatmap visualization (team × SSI dimensions)
7. ✅ "Generate 4 OKRs" integration
8. ✅ Multi-consultant support (company name conflicts handled)

### **Out of Scope** (Future Sprints)
- ❌ Custom OKR count (fixed at 4 for Sprint 1)
- ❌ Advanced heatmap filters (department-only, role-only)
- ❌ Export team results to PDF/CSV
- ❌ Real-time collaboration on OKR review
- ❌ Password reset flow via email link (will use temp password for Sprint 1)

---

## 📋 Requirements Summary

### **Functional Requirements**

**FR-1: Consultant Invites Company**
- Consultant provides: company name, exec email, first/last name, industry (optional), size (optional)
- System creates company + user automatically
- Temp password sent via email
- Invitation expires in 7 days

**FR-2: Executive Onboarding**
- Exec clicks email link → Validates token
- Sets password (no account creation form)
- Redirects to assessment-hub.html
- Sees template shared by consultant

**FR-3: Team Assessment Sharing**
- Exec creates teams (existing teams.html)
- Exec shares template with teams
- Team selector shows all available teams
- Bulk invitation to all team members

**FR-4: Enhanced Team Results**
- Breakdown table: Team × Dimensions with scores
- Heatmap: Color-coded (Red < 6.0, Yellow 6.0-7.0, Green > 7.0)
- Individual drill-down (member scores visible)
- Weak areas summary displayed

**FR-5: OKR Generation**
- "Generate 4 OKRs" button on team results page
- Uses team weak areas to generate targeted OKRs
- Redirects to existing ai-okr-review.html

### **Non-Functional Requirements**

**NFR-1: Performance**
- Company creation: < 3 seconds
- Team results page load: < 2 seconds
- OKR generation: < 8 seconds

**NFR-2: Security**
- Temp passwords: 16-character random (bcrypt hashed)
- Invitation tokens: 64-character crypto random
- JWT expiry: 24 hours

**NFR-3: Reusability**
- Maximum reuse of existing components: > 85%
- Zero changes to teams.html, ai-okr-review.html
- Minimal changes to assessment-hub.html

---

## 🗂️ Technical Architecture

### **New Components**

| Component | Type | Lines of Code | Reuse |
|-----------|------|---------------|-------|
| `POST /api/invitations/create-company-invitation` | API | ~200 | Calls existing services |
| `GET /api/assessments/company/:id/team-breakdown` | API | ~150 | Uses existing models |
| `POST /api/ai-okr/generate-from-team-results` | API | ~100 | Extends existing OKR API |
| Enhanced `invitation-accept.html` | UI | ~50 | Modifies existing flow |
| "Send to Company" modal in `assessment-hub.html` | UI | ~150 | New modal component |
| Team breakdown table in `team-ssi-view.html` | UI | ~200 | Enhances existing page |
| Heatmap component in `team-ssi-view.html` | UI | ~100 | New visualization |

**Total New Code**: ~950 lines
**Modified Code**: ~550 lines
**Total Sprint Effort**: ~1,500 lines

### **Reused Components**

| Component | Location | Reuse Level |
|-----------|----------|-------------|
| CompanyCreationService | `server/services/CompanyCreationService.js` | 💯 100% |
| User Model | `server/models/User.js` | 💯 100% |
| Team Model | `server/models/Team.js` | 💯 100% |
| Invitation System | `server/routes/invitations.js` | 🟢 90% |
| teams.html | `client/pages/teams.html` | 💯 100% |
| ai-okr-review.html | `client/pages/ai-okr-review.html` | 💯 100% |
| Mailjet Service | `server/services/mailjetService.js` | 🟢 85% |

---

## 📅 Sprint Timeline (9 Days)

### **Phase 1: Backend - Automated Company Creation (3 days)**

#### **Day 1: Database & Models**
**Date**: Nov 6, 2025
**Owner**: Backend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] Update `Invitation` model schema
  - Add `invitation_type: 'individual' | 'company_assessment'`
  - Add `user_id` (pre-created user reference)
  - Add `company_created: Boolean`
  - Add `user_created: Boolean`
  - Add `password_set: Boolean`
- [ ] Add compound index: `{ email, company_id }` to User model
- [ ] Test model changes with existing data

**Deliverables**:
- Updated Invitation.js model
- Migration script (if needed)
- Unit tests for new fields

**Code Reference**: `server/models/Invitation.js`

---

#### **Day 2: Company Invitation API**
**Date**: Nov 7, 2025
**Owner**: Backend Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Create `POST /api/invitations/create-company-invitation`
  - Validate input (company name, exec email, names)
  - Check for company name conflicts → Append "(2)", "(3)" if exists
  - Call `CompanyCreationService.createCompanyFromSignup()`
  - Generate temp password (16-char crypto random)
  - Create User with `status: 'pending_password_reset'`
  - Create Invitation record
  - Return success with IDs
- [ ] Add error handling (duplicate email, invalid data)
- [ ] Write integration tests

**API Spec**:
```javascript
POST /api/invitations/create-company-invitation
Authorization: Bearer {consultant_jwt}

Request:
{
  template_id: "template_001",
  company_name: "Acme Corp",
  company_industry: "it_services",  // optional
  company_size: 50,                 // optional
  exec_email: "ceo@acme.com",
  exec_first_name: "John",
  exec_last_name: "Doe",
  message: "Please complete assessment"  // optional
}

Response:
{
  success: true,
  company_id: "company_abc123",
  user_id: "user_xyz789",
  invitation_id: "inv_def456",
  temp_password: "a3f9k2m7p5q8r1t4",  // Only in response, not stored
  invitation_token: "token_64chars..."
}
```

**Deliverables**:
- API endpoint implemented
- API tests passing
- Error handling verified

**Code Reference**: `server/routes/invitations.js:create-company-invitation`

---

#### **Day 3: Email & Password Flow**
**Date**: Nov 8, 2025
**Owner**: Backend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] Create new Mailjet email template: `company-invitation`
  - Include temp password in email body
  - Include company name, consultant name
  - Expiry notice (7 days)
- [ ] Update `POST /api/invitations/accept/:token`
  - Detect if `user_created: true`
  - If true: Update existing user password
  - If false: Create new user (existing flow)
  - Mark invitation as used
  - Generate JWT
- [ ] Test both flows (new user vs existing user)

**Email Template**:
```html
Subject: You've been invited to Karvia - Acme Corp Assessment

Hi John Doe,

Sarah Johnson (Consultant) has invited you to complete a business
assessment for Acme Corp.

🎉 Your account is ready!

Company: Acme Corp
Email: ceo@acme.com
Temporary Password: a3f9k2m7p5q8r1t4

STEP 1: Set Your Password
Click here to activate your account:
[Set Password & Start] → {invitation_link}

STEP 2: Create Teams
After login, create teams within your company.

STEP 3: Share Assessment
Share the assessment with your team members.

⏰ This invitation expires in 7 days.

Questions? Reply to this email.

Best regards,
Karvia Team
```

**Deliverables**:
- Mailjet template created
- Accept invitation flow updated
- End-to-end test passing

**Code Reference**:
- `server/services/mailjetService.js:sendCompanyInvitation`
- `server/routes/invitations.js:accept/:token`

---

### **Phase 2: Frontend - Send to Company (2 days)**

#### **Day 4: "Send to Company" UI**
**Date**: Nov 11, 2025
**Owner**: Frontend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] In `assessment-hub.html` → "My Templates" tab
- [ ] Add "Send to Company" button on each template card
- [ ] Create modal: `sendToCompanyModal`
  - Company Name (input, required)
  - Executive First Name (input, required)
  - Executive Last Name (input, required)
  - Executive Email (input, required)
  - Industry (select, optional)
  - Company Size (input, optional)
  - Message (textarea, optional)
- [ ] Add form validation (email format, required fields)
- [ ] Call API on submit: `POST /api/invitations/create-company-invitation`
- [ ] Show success/error messages

**UI Mockup**:
```
┌────────────────────────────────────────────┐
│ Send Assessment to Company                 │
├────────────────────────────────────────────┤
│                                            │
│ Company Name *                             │
│ [____________________]                     │
│                                            │
│ Executive First Name *                     │
│ [____________________]                     │
│                                            │
│ Executive Last Name *                      │
│ [____________________]                     │
│                                            │
│ Executive Email *                          │
│ [____________________]                     │
│                                            │
│ Industry (Optional)                        │
│ [IT Services ▼]                            │
│                                            │
│ Company Size (Optional)                    │
│ [50___]                                    │
│                                            │
│ Message (Optional)                         │
│ [________________________]                 │
│ [________________________]                 │
│                                            │
│         [Cancel]  [Send Invitation]        │
└────────────────────────────────────────────┘
```

**Deliverables**:
- Modal HTML/CSS
- Form validation JS
- API integration
- Success notification

**Code Reference**: `client/pages/assessment-hub.html:650-850` (modal section)

---

#### **Day 5: Password Setting UI**
**Date**: Nov 12, 2025
**Owner**: Frontend Dev
**Effort**: 4 hours

**Tasks**:
- [ ] Update `invitation-accept.html`
  - Detect invitation type from validation response
  - If `user_created: true` → Show "Set Password" form
  - If `user_created: false` → Show existing account creation form
- [ ] "Set Password" form:
  - Welcome message with company name
  - New Password field (with strength indicator)
  - Confirm Password field
  - Submit button
- [ ] Call `POST /api/invitations/accept/:token`
- [ ] Store JWT token
- [ ] Redirect to `assessment-hub.html`

**UI Flow**:
```
Executive clicks email link
        ↓
invitation-accept.html?token=abc123
        ↓
Validate token → GET /api/invitations/validate/:token
        ↓
Response: { user_created: true, company_name: "Acme Corp" }
        ↓
Show: "Welcome to Acme Corp! Set your password:"
        ↓
User sets password → POST /api/invitations/accept/:token
        ↓
Success → Redirect to assessment-hub.html
```

**Deliverables**:
- Updated invitation-accept.html
- Password strength indicator
- Redirect logic
- Error handling

**Code Reference**: `client/pages/invitation-accept.html:100-250`

---

### **Phase 3: Team Assessment Sharing (1 day)**

#### **Day 6: Share with Teams Modal**
**Date**: Nov 13, 2025
**Owner**: Frontend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] In `assessment-hub.html` → "My Templates" tab
- [ ] Add "Share with Teams" button (for executives)
- [ ] Create modal: `shareWithTeamsModal`
  - Fetch teams: `GET /api/teams`
  - Show team list with checkboxes
  - "Select All" checkbox
  - Team info: Name, Department, Member Count
- [ ] On submit: Loop through selected teams
  - For each team, get members
  - Call `POST /api/invitations/create` for each member
- [ ] Show progress indicator
- [ ] Show success summary

**Modal Mockup**:
```
┌────────────────────────────────────────────┐
│ Share Assessment with Teams                │
├────────────────────────────────────────────┤
│                                            │
│ Select teams to share this assessment:    │
│                                            │
│ ☐ Select All (3 teams, 25 members)        │
│                                            │
│ ☑ Engineering (10 members)                │
│   Department: Technology                   │
│                                            │
│ ☑ Sales (8 members)                       │
│   Department: Revenue                      │
│                                            │
│ ☐ Marketing (7 members)                   │
│   Department: Marketing                    │
│                                            │
│         [Cancel]  [Share Assessment]       │
└────────────────────────────────────────────┘

After submit:
✅ Sent 18 invitations to 2 teams
   - Engineering: 10 invitations
   - Sales: 8 invitations
```

**Deliverables**:
- Share with teams modal
- Team fetching logic
- Bulk invitation creation
- Success notification

**Code Reference**: `client/pages/assessment-hub.html:900-1100` (new modal)

---

### **Phase 4: Enhanced Team Results (3 days)**

#### **Day 7: Team Breakdown API**
**Date**: Nov 14, 2025
**Owner**: Backend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] Create `GET /api/assessments/company/:companyId/team-breakdown`
  - Fetch all teams for company
  - For each team, get completed assessments
  - Calculate avg SSI scores per team
  - Calculate avg scores per function
  - Calculate avg scores per role
  - Identify weak areas (< 6.0)
  - Include individual responses (with user details)
- [ ] Add authorization checks (consultant + exec only)
- [ ] Optimize query performance (aggregation pipeline)
- [ ] Write unit tests

**API Spec**:
```javascript
GET /api/assessments/company/:companyId/team-breakdown
Authorization: Bearer {jwt}

Response:
{
  company_id: "company_abc123",
  company_name: "Acme Corp",
  total_teams: 3,
  total_members: 25,
  total_completed: 18,
  completion_rate: 72,

  overall_scores: {
    speed: 7.1,
    strength: 6.2,
    intelligence: 7.8
  },

  teams: [
    {
      team_id: "team_001",
      team_name: "Engineering",
      function: "Product",
      department: "Technology",
      members_invited: 10,
      members_completed: 8,
      completion_rate: 80,
      avg_scores: {
        speed: 7.2,
        strength: 6.5,
        intelligence: 8.1
      },
      individual_responses: [
        {
          user_id: "user_001",
          name: "John Doe",
          email: "john@acme.com",
          role: "MANAGER",
          scores: { speed: 7.5, strength: 6.0, intelligence: 8.2 },
          completed_at: "2025-11-05T10:30:00Z"
        },
        // ... more members
      ]
    },
    // ... more teams
  ],

  weak_areas: [
    {
      dimension: "strength",
      avg_score: 5.2,
      threshold: 6.0,
      teams_affected: ["Engineering", "Marketing"],
      team_count: 2,
      priority: "high"
    }
  ],

  by_function: {
    "Product": { speed: 7.2, strength: 6.5, intelligence: 8.1 },
    "Revenue": { speed: 6.8, strength: 5.2, intelligence: 6.5 }
  },

  by_role: {
    "MANAGER": { speed: 7.5, strength: 6.8, intelligence: 8.0 },
    "EMPLOYEE": { speed: 6.9, strength: 5.9, intelligence: 7.6 }
  }
}
```

**Deliverables**:
- API endpoint implemented
- Aggregation queries optimized
- Authorization checks
- Tests passing

**Code Reference**: `server/routes/assessments.js:team-breakdown`

---

#### **Day 8: Team Results UI - Table & Heatmap**
**Date**: Nov 15, 2025
**Owner**: Frontend Dev
**Effort**: 8 hours

**Tasks**:
- [ ] Enhance `team-ssi-view.html`
- [ ] Fetch team breakdown: `GET /api/assessments/company/:id/team-breakdown`
- [ ] **Section 1: Overall Company Scores** (already exists)
- [ ] **Section 2: Team Breakdown Table** (new)
  - Table columns: Team Name, Function, Dept, Completion, Speed, Strength, Intelligence, Actions
  - Color-code scores: Red < 6.0, Yellow 6.0-7.0, Green > 7.0
  - Add "View Details" button per row
- [ ] **Section 3: Heatmap Visualization** (new)
  - HTML table with color-coded cells
  - Rows: Teams
  - Columns: Speed, Strength, Intelligence
  - Cell content: Score + color
- [ ] **Section 4: Weak Areas Summary** (enhance existing)
  - List weak dimensions with affected teams
  - Highlight in red
- [ ] Add individual response drill-down modal

**Table Mockup**:
```
┌─────────────┬─────────┬──────────┬────────────┬───────┬──────────┬──────────────┬─────────┐
│ Team Name   │ Function│ Dept     │ Completion │ Speed │ Strength │ Intelligence │ Actions │
├─────────────┼─────────┼──────────┼────────────┼───────┼──────────┼──────────────┼─────────┤
│ Engineering │ Product │ Tech     │ 8/10 (80%) │ 🟢7.2 │ 🟡6.5    │ 🟢8.1        │ [View]  │
│ Sales       │ Revenue │ Business │ 5/8 (63%)  │ 🟡6.8 │ 🔴5.2    │ 🟡6.5        │ [View]  │
│ Marketing   │ Marketing│Marketing│ 5/7 (71%)  │ 🟢7.5 │ 🟡6.8    │ 🟢7.8        │ [View]  │
└─────────────┴─────────┴──────────┴────────────┴───────┴──────────┴──────────────┴─────────┘

Heatmap:
┌─────────────┬───────┬──────────┬──────────────┐
│             │ Speed │ Strength │ Intelligence │
├─────────────┼───────┼──────────┼──────────────┤
│ Engineering │ 🟢7.2 │ 🟡6.5    │ 🟢8.1        │
│ Sales       │ 🟡6.8 │ 🔴5.2    │ 🟡6.5        │
│ Marketing   │ 🟢7.5 │ 🟡6.8    │ 🟢7.8        │
└─────────────┴───────┴──────────┴──────────────┘

Color Legend:
🔴 Red: < 6.0 (Weak - Needs Improvement)
🟡 Yellow: 6.0-7.0 (Moderate - Developing)
🟢 Green: > 7.0 (Strong - Optimized)
```

**Deliverables**:
- Team breakdown table
- Heatmap visualization
- Weak areas enhanced
- Drill-down modal

**Code Reference**: `client/pages/team-ssi-view.html:150-450`

---

#### **Day 9: OKR Generation Integration**
**Date**: Nov 16, 2025
**Owner**: Backend + Frontend Dev
**Effort**: 6 hours

**Tasks**:
- [ ] **Backend**: Create `POST /api/ai-okr/generate-from-team-results`
  - Accept team breakdown data
  - Identify top 4 weak areas
  - Call OpenAI with team context
  - Generate 4 OKRs targeting weak areas
  - Store in database
- [ ] **Frontend**: Add button in `team-ssi-view.html`
  - Inside `okr-action-container` div
  - "🎯 Generate 4 OKRs Based on Team Results"
  - On click: Call API with team breakdown data
  - Show loading spinner
  - On success: Redirect to `ai-okr-review.html` with OKR IDs
- [ ] Test end-to-end flow

**API Spec**:
```javascript
POST /api/ai-okr/generate-from-team-results
Authorization: Bearer {jwt}

Request:
{
  company_id: "company_abc123",
  weak_areas: [
    { dimension: "strength", avg_score: 5.2, teams: ["Engineering", "Marketing"] }
  ],
  team_count: 3,
  total_members: 25,
  okr_count: 4  // Fixed for Sprint 1
}

Response:
{
  success: true,
  okrs: [
    {
      id: "okr_001",
      objective: "Improve Financial Strength and Resource Allocation",
      target_dimension: "strength",
      key_results: [
        "Increase operating cash reserves by 25% by Q2 2026",
        "Reduce operational costs by 15% through process optimization",
        "Secure $500K in additional funding or revenue by Q3 2026"
      ],
      target_score: 7.0,
      priority: "high"
    },
    // ... 3 more OKRs
  ],
  redirect_url: "/pages/ai-okr-review.html?okrs=okr_001,okr_002,okr_003,okr_004"
}
```

**Button UI**:
```html
<!-- In team-ssi-view.html -->
<div id="okr-action-container" class="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-semibold text-gray-900">Ready to Create OKRs?</h3>
      <p class="text-sm text-gray-600 mt-1">
        Generate 4 targeted OKRs based on your team's assessment results and weak areas.
      </p>
    </div>
    <button
      id="generate-okrs-btn"
      onclick="generateOKRsFromTeamResults()"
      class="karvia-gradient text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition">
      🎯 Generate 4 OKRs
    </button>
  </div>
</div>
```

**Deliverables**:
- API endpoint for OKR generation
- Button in team results page
- Redirect logic
- End-to-end test

**Code Reference**:
- `server/routes/ai-okr.js:generate-from-team-results`
- `client/pages/team-ssi-view.html:500-550`

---

## 📝 User Stories Implemented

### **New User Stories (Sprint 1)**

**CONS-003B**: Share Assessment with Company Executive
**As a** consultant
**I want to** share assessment templates with company executives by providing company name and exec email
**So that** I can onboard new clients with one click and they get automatic company + user setup
**Acceptance Criteria**:
- ✅ "Send to Company" button visible in assessment-hub.html
- ✅ Modal collects: company name, exec first/last name, email, industry (optional), size (optional)
- ✅ Company and user auto-created on submit
- ✅ Exec receives email with temp password
- ✅ Invitation expires in 7 days
- ✅ Company name conflicts handled (append number)

**EXEC-001B**: Accept Company Assessment Invitation
**As an** executive
**I want to** click invitation link and set my password immediately
**So that** I can access the assessment hub without filling out long forms
**Acceptance Criteria**:
- ✅ Invitation link validates token
- ✅ Shows "Set Password" form (not account creation)
- ✅ Company name displayed in welcome message
- ✅ Password set updates existing user
- ✅ Redirects to assessment-hub.html after success
- ✅ JWT token stored for authenticated session

**EXEC-002B**: Share Assessment with Teams
**As an** executive
**I want to** share assessment templates with my teams
**So that** team members can complete assessments
**Acceptance Criteria**:
- ✅ "Share with Teams" button in assessment-hub.html
- ✅ Modal shows all available teams with checkboxes
- ✅ "Select All" option available
- ✅ Bulk invitation sent to selected team members
- ✅ Success notification shows count of invitations sent

**CONS-007B**: View Detailed Team Results (ENHANCED)
**As a** consultant or executive
**I want to** see detailed team assessment results with breakdown by function/role
**So that** I can identify weak areas and create targeted OKRs
**Acceptance Criteria**:
- ✅ Team breakdown table with SSI scores per team
- ✅ Color-coded scores (Red/Yellow/Green)
- ✅ Heatmap visualization (team × dimension)
- ✅ Weak areas summary displayed
- ✅ Individual member drill-down available
- ✅ Breakdown by function and role shown

**CONS-006B**: Generate OKRs from Team Results (ENHANCED)
**As a** consultant or executive
**I want to** generate 4 OKRs based on team weak areas
**So that** I can create targeted objectives that address specific gaps
**Acceptance Criteria**:
- ✅ "Generate 4 OKRs" button visible on team results page
- ✅ OKRs target top 4 weak areas
- ✅ Generated OKRs use team context (scores, functions, roles)
- ✅ Redirects to ai-okr-review.html
- ✅ OKRs saved and editable

---

## 🔗 User Journey Mapping

### **Consultant Journey Enhancement**

**Phase 1: Template Creation** (Pre-Sprint - Already Complete)
- ✅ Create assessment template
- ✅ View template library

**Phase 2: Client Onboarding** (Sprint 1 - NEW)
- 🆕 **CONS-003B**: Share template with company executive
  - Click "Send to Company" on template
  - Enter company details + exec info
  - Company + user auto-created
  - Exec receives invitation email

**Phase 3: Track Progress** (Pre-Sprint - Already Complete)
- ✅ **CONS-004**: Track invitation status
- ✅ View completion rates

**Phase 4: Review Results** (Sprint 1 - ENHANCED)
- 🆕 **CONS-007B**: View detailed team breakdown
  - See team-level SSI scores
  - Identify weak areas via heatmap
  - Drill down to individual responses

**Phase 5: Generate OKRs** (Sprint 1 - ENHANCED)
- 🆕 **CONS-006B**: Generate 4 OKRs from team results
  - Click button on team results page
  - AI generates targeted OKRs
  - Review and edit OKRs

---

### **Executive Journey (NEW)**

**Phase 1: Receive Invitation** (Sprint 1 - NEW)
- 🆕 **EXEC-001B**: Receive invitation email
  - Email includes company name, temp password
  - Click link to activate account

**Phase 2: Set Password** (Sprint 1 - NEW)
- 🆕 **EXEC-001B**: Set password
  - Token validated
  - Set new password
  - Redirect to assessment hub

**Phase 3: Create Teams** (Reuse Existing)
- ✅ Navigate to teams.html
- ✅ Create teams with managers
- ✅ Add team members

**Phase 4: Share Assessment** (Sprint 1 - NEW)
- 🆕 **EXEC-002B**: Share with teams
  - View template shared by consultant
  - Select teams to share with
  - Bulk send invitations

**Phase 5: Monitor Progress** (Reuse Existing)
- ✅ View invitation status
- ✅ Track team completion

**Phase 6: Review Results** (Sprint 1 - ENHANCED)
- 🆕 **CONS-007B**: View team breakdown
  - Same as consultant view
  - Identify gaps

**Phase 7: Create OKRs** (Sprint 1 - ENHANCED)
- 🆕 **CONS-006B**: Generate OKRs
  - Same flow as consultant

---

## 🧪 Testing Plan

### **Unit Tests**

**Backend**:
- [ ] `CompanyCreationService.createCompanyFromSignup()` - name conflicts
- [ ] `POST /api/invitations/create-company-invitation` - validation
- [ ] `POST /api/invitations/accept/:token` - existing user flow
- [ ] `GET /api/assessments/company/:id/team-breakdown` - aggregation
- [ ] `POST /api/ai-okr/generate-from-team-results` - OKR generation

**Frontend**:
- [ ] "Send to Company" form validation
- [ ] Password strength indicator
- [ ] Team selector "Select All" logic
- [ ] Heatmap color coding
- [ ] Score threshold calculations

### **Integration Tests**

- [ ] **Test 1**: Consultant sends company invitation
  - Create invitation → Company created → User created → Email sent
- [ ] **Test 2**: Executive accepts invitation
  - Validate token → Set password → JWT generated → Redirect
- [ ] **Test 3**: Executive shares with teams
  - Fetch teams → Select teams → Bulk invitations → Success
- [ ] **Test 4**: Team members complete assessments
  - Accept invitation → Complete assessment → Results calculated
- [ ] **Test 5**: View team breakdown
  - Fetch results → Display table → Heatmap rendered → Weak areas shown
- [ ] **Test 6**: Generate OKRs
  - Click button → API called → 4 OKRs generated → Redirect

### **End-to-End Tests**

- [ ] **E2E Test 1**: Complete consultant flow
  - Login as consultant → Create template → Send to company → Verify email sent
- [ ] **E2E Test 2**: Complete executive flow
  - Click invitation link → Set password → Login → Create teams → Share assessment
- [ ] **E2E Test 3**: Team assessment completion
  - Team member receives email → Completes assessment → Results appear
- [ ] **E2E Test 4**: Results to OKRs
  - View team results → Generate OKRs → Review in OKR page

---

## 🚨 Risks & Mitigations

### **Risk 1: Company Name Conflicts**
**Probability**: Medium
**Impact**: Low
**Mitigation**: Append "(2)", "(3)" automatically. Add to improvements list: warn consultant before creation
**Contingency**: Manual rename via admin panel

### **Risk 2: Temp Password Security**
**Probability**: Low
**Impact**: Medium
**Mitigation**: 16-char random, 7-day expiry, must be changed on first login
**Contingency**: Add password reset flow in Sprint 2 (already in improvements list)

### **Risk 3: Email Deliverability**
**Probability**: Low
**Impact**: High
**Mitigation**: Use Mailjet (existing), SPF/DKIM configured
**Contingency**: Manual invitation resend via admin panel

### **Risk 4: Performance - Team Breakdown**
**Probability**: Medium
**Impact**: Medium
**Mitigation**: MongoDB aggregation pipeline, indexed queries
**Contingency**: Add caching layer if > 100 teams

### **Risk 5**: Heatmap Complexity**
**Probability**: Low
**Impact**: Low
**Mitigation**: Use simple HTML table with CSS, no external library
**Contingency**: Remove heatmap, keep table only

---

## 📊 Success Metrics

### **Development Metrics**
- **Sprint Velocity**: 1,500 lines of code in 9 days
- **Reuse Rate**: > 85% (target met)
- **Test Coverage**: > 80% (unit + integration)
- **Code Review**: All PRs reviewed before merge

### **Functional Metrics**
- **Consultant Invitation Time**: < 2 minutes (from click to sent)
- **Executive Onboarding Time**: < 2 minutes (from email click to dashboard)
- **Team Results Load Time**: < 2 seconds (for 10 teams)
- **OKR Generation Time**: < 8 seconds (for 4 OKRs)

### **User Metrics** (Post-Release)
- **Invitation Acceptance Rate**: > 80%
- **Password Set Rate**: > 90% (within 7 days)
- **Team Creation Rate**: > 70% (execs create teams)
- **Assessment Completion Rate**: > 60% (team members complete)

---

## 🔗 Related Documentation

### **Technical References**
- [CompanyCreationService.js](../../server/services/CompanyCreationService.js) - Company creation logic
- [Invitation Model](../../server/models/Invitation.js) - Invitation schema
- [User Model](../../server/models/User.js) - User schema with multi-company support
- [Team Routes](../../server/routes/teams.js) - Team management APIs

### **User Stories**
- [CONSULTANT_JOURNEY.md](../../Karvia_OKR_Product_Planning/01_MVP/User_Stories/CONSULTANT_JOURNEY.md) - Full consultant journey
- [EXECUTIVE_JOURNEY.md](../../Karvia_OKR_Product_Planning/01_MVP/User_Stories/EXECUTIVE_JOURNEY.md) - Executive journey
- [MVP_USER_STORIES.md](../../Karvia_OKR_Product_Planning/01_MVP/MVP_USER_STORIES.md) - All user stories

### **Planning Docs**
- [MASTER_DEV_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md) - Overall development plan
- [MASTER_IMPROVEMENTS_LIST.md](../../Karvia_OKR_Product_Planning/MASTER_IMPROVEMENTS_LIST.md) - Future enhancements

---

## 📋 Sprint Backlog

### **Day 1-3: Backend Foundation**
- [x] Update Invitation model
- [ ] Create company invitation API
- [ ] Email template & password flow

### **Day 4-5: Frontend Invitation**
- [ ] "Send to Company" UI
- [ ] Password setting UI

### **Day 6: Team Sharing**
- [ ] Share with teams modal

### **Day 7-9: Team Results & OKRs**
- [ ] Team breakdown API
- [ ] Enhanced team results UI
- [ ] OKR generation integration

---

## ✅ Definition of Done

A task is considered "done" when:
- ✅ Code written and self-reviewed
- ✅ Unit tests written and passing (> 80% coverage)
- ✅ Integration tests passing
- ✅ Code reviewed by peer
- ✅ Merged to main branch
- ✅ Deployed to staging environment
- ✅ QA tested manually
- ✅ Documentation updated

---

## 🎉 Sprint Completion Criteria

Sprint 1 is complete when:
- ✅ All 9 days' tasks marked complete
- ✅ All 5 new user stories pass acceptance criteria
- ✅ End-to-end tests passing (6 tests)
- ✅ Performance metrics met (< 2s page loads)
- ✅ No P0 bugs remaining
- ✅ Sprint retrospective completed
- ✅ Next sprint planned

---

**Version**: 1.0.0
**Created**: November 5, 2025
**Last Updated**: November 5, 2025
**Status**: 🔴 Not Started
**Next Review**: November 6, 2025 (Sprint Start)
