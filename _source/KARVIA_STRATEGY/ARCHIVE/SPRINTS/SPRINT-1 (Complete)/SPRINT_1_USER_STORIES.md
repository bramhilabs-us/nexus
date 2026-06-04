# 👥 Sprint 1 User Stories & Acceptance Criteria

**Sprint**: Sprint 1 - Consultant Journey Enhancement
**Duration**: Nov 6-16, 2025 (9 days)
**Version**: 1.0.0
**Status**: 🔴 Not Started

---

## 📋 Story Overview

**Total Stories**: 5 new/enhanced stories
**Story Points**: 34 points
**Average**: 6.8 points per story

| Story ID | Title | Points | Priority | Status |
|----------|-------|--------|----------|--------|
| CONS-003B | Share Assessment with Company | 8 | P0 | ⬜ Not Started |
| EXEC-001B | Accept Company Invitation | 5 | P0 | ⬜ Not Started |
| EXEC-002B | Share Assessment with Teams | 5 | P0 | ⬜ Not Started |
| CONS-007B | View Detailed Team Results | 8 | P0 | ⬜ Not Started |
| CONS-006B | Generate OKRs from Team Results | 8 | P0 | ⬜ Not Started |

---

## 🎯 STORY 1: Share Assessment with Company Executive

### **Story ID**: CONS-003B
### **Story Points**: 8
### **Priority**: P0 (CRITICAL)
### **Persona**: Consultant
### **Feature**: Company Invitation
### **Implementation**: Day 1-5

### **User Story**
```
As a consultant
I want to share assessment templates with company executives by providing company name and executive email
So that I can onboard new clients with one click and they get automatic company + user account setup
```

### **Acceptance Criteria**

#### **AC-1**: "Send to Company" Button Visible
- **Given** I am a consultant logged into assessment-hub.html
- **And** I am viewing the "My Templates" tab
- **When** I see my assessment templates
- **Then** each template card should have a "Send to Company" button
- **And** the button should be clearly labeled and styled

#### **AC-2**: Company Information Modal
- **Given** I click "Send to Company" on a template
- **When** the modal opens
- **Then** I should see a form with the following fields:
  - Company Name (text input, required, placeholder: "Acme Corp")
  - Executive First Name (text input, required, placeholder: "John")
  - Executive Last Name (text input, required, placeholder: "Doe")
  - Executive Email (email input, required, placeholder: "ceo@acme.com")
  - Industry (dropdown, optional, options: IT Services, Consulting, Healthcare, etc.)
  - Company Size (number input, optional, placeholder: "50")
  - Message (textarea, optional, placeholder: "Please complete this assessment...")
- **And** required fields should be marked with asterisks
- **And** form should have "Cancel" and "Send Invitation" buttons

#### **AC-3**: Form Validation
- **Given** I fill out the "Send to Company" form
- **When** I click "Send Invitation" without required fields
- **Then** I should see validation errors for each missing field
- **When** I enter an invalid email format
- **Then** I should see "Please enter a valid email address"
- **When** all required fields are valid
- **Then** the form should submit successfully

#### **AC-4**: Company + User Auto-Created
- **Given** I submit the "Send to Company" form with valid data
- **When** the API processes my request
- **Then** a new Company should be created with the provided name and details
- **And** a new User account should be created for the executive with role EXECUTIVE
- **And** the user should have status 'pending_password_reset'
- **And** the user should be linked to the created company

#### **AC-5**: Company Name Conflict Handling
- **Given** I submit a company name that already exists (e.g., "Acme Corp")
- **When** the system detects a duplicate
- **Then** it should automatically append a number (e.g., "Acme Corp (2)")
- **And** the invitation should proceed with the modified name
- **And** I should see a success message indicating the adjusted name

#### **AC-6**: Invitation Email Sent
- **Given** the company and user are created successfully
- **When** the system sends the invitation email
- **Then** the executive should receive an email to their provided address
- **And** the email should include:
  - Company name
  - Consultant name (who sent the invitation)
  - Template name
  - Temporary password (16-character random)
  - Activation link with invitation token
  - Expiry notice (7 days)

#### **AC-7**: Success Notification
- **Given** the invitation is sent successfully
- **When** I am returned to the assessment-hub.html
- **Then** I should see a success notification showing:
  - "✅ Invitation sent to john@acme.com"
  - Company name created
  - "The executive can activate their account within 7 days"

#### **AC-8**: Invitation Expiry
- **Given** an invitation is created
- **When** 7 days pass without the executive activating their account
- **Then** the invitation token should expire
- **And** the executive should not be able to use the link
- **And** the company and user should remain in the system (for manual activation)

### **Technical Requirements**

**Backend**:
- API: `POST /api/invitations/create-company-invitation`
- Uses: `CompanyCreationService.createCompanyFromSignup()`
- Creates: Company, User, Invitation records
- Sends: Mailjet email via `mailjetService.sendCompanyInvitation()`

**Frontend**:
- File: `client/pages/assessment-hub.html` (modal added)
- Form validation using vanilla JS
- API call with error handling

**Database**:
- Invitation model updated with new fields:
  - `invitation_type: 'company_assessment'`
  - `user_id: ObjectId`
  - `company_created: Boolean`
  - `user_created: Boolean`
  - `password_set: Boolean`

### **Test Cases**

1. **Happy Path**: Submit valid form → Company created → Email sent
2. **Duplicate Company**: Submit existing company name → Appends (2)
3. **Invalid Email**: Submit invalid email → Shows validation error
4. **Missing Required**: Submit without required fields → Shows errors
5. **Network Error**: API fails → Shows error message
6. **Multiple Consultants**: Two consultants invite same company → Both succeed with (2), (3)

### **Related Files**
- [assessment-hub.html](../../client/pages/assessment-hub.html) - Modal location
- [CompanyCreationService.js](../../server/services/CompanyCreationService.js) - Company creation
- [invitations.js](../../server/routes/invitations.js) - API endpoint

---

## 🎯 STORY 2: Accept Company Assessment Invitation

### **Story ID**: EXEC-001B
### **Story Points**: 5
### **Priority**: P0 (CRITICAL)
### **Persona**: Executive
### **Feature**: Executive Onboarding
### **Implementation**: Day 5

### **User Story**
```
As an executive
I want to click the invitation link and set my password immediately
So that I can access the assessment hub without filling out long forms
```

### **Acceptance Criteria**

#### **AC-1**: Token Validation
- **Given** I receive an invitation email from a consultant
- **When** I click the activation link
- **Then** I should be redirected to `invitation-accept.html?token=abc123...`
- **And** the system should validate my token
- **And** if valid, I should see the password setting form
- **And** if invalid/expired, I should see an error message

#### **AC-2**: Pre-Created Account Detection
- **Given** the invitation token is valid
- **When** the system checks if my account was pre-created
- **Then** it should detect `user_created: true` in the invitation record
- **And** it should show a "Set Password" form (not "Create Account" form)
- **And** the form should display my company name in a welcome message

#### **AC-3**: Welcome Message Display
- **Given** I see the password setting form
- **When** the page loads
- **Then** I should see a welcome message: "Welcome to {Company Name}!"
- **And** I should see: "Your account is ready. Set your password to continue."
- **And** I should see my email address pre-filled (non-editable)

#### **AC-4**: Password Setting Form
- **Given** I am on the password setting page
- **When** I view the form
- **Then** I should see:
  - Email address (pre-filled, disabled)
  - New Password (password input, required)
  - Confirm Password (password input, required)
  - Password strength indicator
  - "Set Password & Continue" button
- **And** the password strength indicator should show:
  - Weak (< 8 chars or no special chars)
  - Medium (8-12 chars with mix)
  - Strong (> 12 chars with numbers, symbols, uppercase/lowercase)

#### **AC-5**: Password Validation
- **Given** I enter passwords
- **When** they don't match
- **Then** I should see "Passwords do not match"
- **When** the password is too weak (< 8 chars)
- **Then** I should see "Password must be at least 8 characters"
- **When** both passwords match and are strong
- **Then** the form should allow submission

#### **AC-6**: Account Activation
- **Given** I submit valid matching passwords
- **When** the API processes my request
- **Then** my existing user account password should be updated
- **And** my user status should change to 'active'
- **And** my email should be marked as verified
- **And** the invitation should be marked as used
- **And** `password_set: true` should be set on the invitation

#### **AC-7**: JWT Token Generation
- **Given** my password is set successfully
- **When** the API responds
- **Then** I should receive a JWT token
- **And** the token should contain:
  - userId
  - companyId
  - role: EXECUTIVE
- **And** the token should be stored in localStorage as `karvia_token`
- **And** my user data should be stored as `karvia_user`

#### **AC-8**: Redirect to Assessment Hub
- **Given** my account is activated and JWT is stored
- **When** the activation is complete
- **Then** I should be automatically redirected to `assessment-hub.html`
- **And** I should see the "My Templates" tab
- **And** I should see the template shared by the consultant
- **And** the template should have a label: "Shared by {Consultant Name}"

### **Technical Requirements**

**Backend**:
- API: `POST /api/invitations/accept/:token` (modified)
- Detects: `invitation.user_created === true`
- Updates: Existing user password (not creates new user)
- Returns: JWT token

**Frontend**:
- File: `client/pages/invitation-accept.html` (enhanced)
- Conditional rendering: Set password vs Create account
- Password strength indicator
- Redirect logic after success

### **Test Cases**

1. **Happy Path**: Click link → Set password → Redirect to dashboard
2. **Expired Token**: Click expired link → Shows error
3. **Invalid Token**: Click invalid link → Shows error
4. **Weak Password**: Submit weak password → Shows strength error
5. **Mismatched Passwords**: Submit different passwords → Shows error
6. **Network Error**: API fails → Shows error message

### **Related Files**
- [invitation-accept.html](../../client/pages/invitation-accept.html) - Password form
- [invitations.js](../../server/routes/invitations.js) - Accept endpoint

---

## 🎯 STORY 3: Share Assessment with Teams

### **Story ID**: EXEC-002B
### **Story Points**: 5
### **Priority**: P0 (CRITICAL)
### **Persona**: Executive
### **Feature**: Team Assessment Sharing
### **Implementation**: Day 6

### **User Story**
```
As an executive
I want to share assessment templates with my teams
So that team members can complete assessments and we can gather team insights
```

### **Acceptance Criteria**

#### **AC-1**: Template Visibility
- **Given** I am an executive logged into assessment-hub.html
- **When** I view the "My Templates" tab
- **Then** I should see templates shared with me by the consultant
- **And** each template should show: "Shared by {Consultant Name}"
- **And** each template should have a "Share with Teams" button

#### **AC-2**: Team Selection Modal
- **Given** I click "Share with Teams" on a template
- **When** the modal opens
- **Then** I should see a list of all my company's teams
- **And** each team should show:
  - Team name
  - Department
  - Member count
  - Checkbox for selection
- **And** I should see a "Select All" checkbox at the top
- **And** I should see "Cancel" and "Share Assessment" buttons

#### **AC-3**: Team Fetching
- **Given** the modal opens
- **When** teams are being loaded
- **Then** I should see a loading spinner
- **When** I have no teams created yet
- **Then** I should see a message: "⚠️ You don't have any teams yet!"
- **And** I should see a button: "[Go to Team Management]"
- **When** teams exist
- **Then** they should be displayed with checkboxes

#### **AC-4**: Team Selection
- **Given** I see the team list
- **When** I click "Select All"
- **Then** all team checkboxes should be checked
- **When** I click "Select All" again
- **Then** all checkboxes should be unchecked
- **When** I manually check individual teams
- **Then** only those teams should be selected

#### **AC-5**: Bulk Invitation Creation
- **Given** I have selected 2 teams (Engineering: 10 members, Sales: 8 members)
- **When** I click "Share Assessment"
- **Then** the system should create 18 invitations (10 + 8)
- **And** each team member should receive an individual invitation email
- **And** each invitation should include:
  - Template name
  - Company name
  - Executive name (who shared)
  - Invitation link with unique token
  - Expiry (7 days)

#### **AC-6**: Progress Indicator
- **Given** I click "Share Assessment" for multiple teams
- **When** invitations are being created
- **Then** I should see a progress indicator showing:
  - "Creating invitations for Engineering... (10 members)"
  - "Creating invitations for Sales... (8 members)"
- **And** when complete, I should see: "✅ Sent 18 invitations to 2 teams"

#### **AC-7**: Success Summary
- **Given** invitations are sent successfully
- **When** the modal closes
- **Then** I should see a success notification:
  - "✅ Assessment shared successfully"
  - "18 invitations sent to:"
  - "  - Engineering: 10 members"
  - "  - Sales: 8 members"
- **And** the notification should auto-dismiss after 5 seconds

#### **AC-8**: Error Handling
- **Given** some invitations fail (e.g., invalid email)
- **When** the process completes
- **Then** I should see a partial success message:
  - "⚠️ Sent 16 of 18 invitations"
  - "Failed: john@invalid (invalid email), jane@bounced (email error)"
- **And** I should have the option to retry failed invitations

### **Technical Requirements**

**Backend**:
- API: `GET /api/teams` (existing - reused)
- API: `POST /api/invitations/create` (existing - reused in loop)
- Bulk processing: Loop through selected teams and members

**Frontend**:
- File: `client/pages/assessment-hub.html` (new modal)
- Team fetching and display
- Bulk invitation creation with progress tracking

### **Test Cases**

1. **Happy Path**: Select teams → Share → All invitations sent
2. **No Teams**: Open modal with no teams → Shows "create teams" message
3. **Select All**: Check "Select All" → All teams selected
4. **Partial Failure**: Some invitations fail → Shows partial success
5. **Network Error**: API fails → Shows error message
6. **Empty Selection**: Click share with no teams selected → Shows validation error

### **Related Files**
- [assessment-hub.html](../../client/pages/assessment-hub.html) - Modal location
- [teams.js](../../server/routes/teams.js) - Team fetching (reused)

---

## 🎯 STORY 4: View Detailed Team Results

### **Story ID**: CONS-007B
### **Story Points**: 8
### **Priority**: P0 (CRITICAL)
### **Persona**: Consultant / Executive
### **Feature**: Enhanced Team Results
### **Implementation**: Day 7-8

### **User Story**
```
As a consultant or executive
I want to see detailed team assessment results with breakdown by function/role and heatmap visualization
So that I can identify weak areas and create targeted OKRs for improvement
```

### **Acceptance Criteria**

#### **AC-1**: Team Results Page Access
- **Given** I am a consultant or executive
- **When** I navigate to assessment-hub.html → "Team Results" tab
- **Or** I directly visit team-ssi-view.html
- **Then** I should see the enhanced team results page
- **And** the page should load within 2 seconds (for up to 10 teams)

#### **AC-2**: Overall Company Scores Display
- **Given** I am on the team results page
- **When** the page loads
- **Then** I should see company-wide SSI scores at the top:
  - Speed: 7.1 (with circular progress indicator)
  - Strength: 6.2
  - Intelligence: 7.8
  - Overall completion rate: 72% (18 of 25 members)

#### **AC-3**: Team Breakdown Table
- **Given** I scroll past the overall scores
- **When** I view the team breakdown section
- **Then** I should see a table with columns:
  - Team Name
  - Function
  - Department
  - Completion (e.g., "8/10 (80%)")
  - Speed (color-coded)
  - Strength (color-coded)
  - Intelligence (color-coded)
  - Actions ([View Details] button)
- **And** each team should be displayed as a row

#### **AC-4**: Score Color Coding
- **Given** I view SSI scores in the table
- **When** a score is < 6.0
- **Then** it should be displayed in RED (🔴) with text "Weak"
- **When** a score is 6.0-7.0
- **Then** it should be displayed in YELLOW (🟡) with text "Moderate"
- **When** a score is > 7.0
- **Then** it should be displayed in GREEN (🟢) with text "Strong"

#### **AC-5**: Heatmap Visualization
- **Given** I scroll to the heatmap section
- **When** I view the heatmap
- **Then** I should see a table with:
  - Rows: Team names (Engineering, Sales, Marketing)
  - Columns: Speed, Strength, Intelligence
  - Cells: Score with background color (Red/Yellow/Green)
- **And** the heatmap should clearly show patterns (e.g., "Strength is weak across all teams")

#### **AC-6**: Weak Areas Summary
- **Given** I view the weak areas section
- **When** the system identifies dimensions with avg < 6.0
- **Then** I should see a highlighted summary:
  - "⚠️ Weakness Detected: Strength"
  - "Average Score: 5.2 (Target: 6.0+)"
  - "Affected Teams: Engineering, Marketing (2 teams)"
  - "Priority: High"
- **And** this section should be visually prominent (red background)

#### **AC-7**: Individual Response Drill-Down
- **Given** I click "View Details" on a team row
- **When** the drill-down modal opens
- **Then** I should see a table of individual members:
  - Name
  - Email
  - Role
  - Speed score
  - Strength score
  - Intelligence score
  - Completion date
- **And** I should be able to close the modal

#### **AC-8**: Breakdown by Function and Role
- **Given** I scroll to additional breakdowns
- **When** I view "By Function" section
- **Then** I should see avg scores grouped by function:
  - Product: Speed 7.2, Strength 6.5, Intelligence 8.1
  - Revenue: Speed 6.8, Strength 5.2, Intelligence 6.5
- **When** I view "By Role" section
- **Then** I should see avg scores grouped by role:
  - MANAGER: Speed 7.5, Strength 6.8, Intelligence 8.0
  - EMPLOYEE: Speed 6.9, Strength 5.9, Intelligence 7.6

### **Technical Requirements**

**Backend**:
- API: `GET /api/assessments/company/:companyId/team-breakdown`
- Aggregation: MongoDB pipeline for team-level scores
- Performance: < 2 seconds for 10 teams, 100 members

**Frontend**:
- File: `client/pages/team-ssi-view.html` (enhanced)
- Table rendering with color coding
- Heatmap HTML table with CSS
- Drill-down modal

### **Test Cases**

1. **Happy Path**: Load page → See all sections → All data displayed
2. **No Completed Assessments**: Load with 0% completion → Shows "No data yet"
3. **Single Team**: Load with 1 team → Shows correctly
4. **Large Dataset**: Load with 20 teams, 200 members → < 3 seconds
5. **Color Coding**: Verify all score ranges show correct colors
6. **Drill-Down**: Click "View Details" → Modal opens with member data

### **Related Files**
- [team-ssi-view.html](../../client/pages/team-ssi-view.html) - Enhanced page
- [assessments.js](../../server/routes/assessments.js) - Team breakdown API

---

## 🎯 STORY 5: Generate OKRs from Team Results

### **Story ID**: CONS-006B
### **Story Points**: 8
### **Priority**: P0 (CRITICAL)
### **Persona**: Consultant / Executive
### **Feature**: AI OKR Generation
### **Implementation**: Day 9

### **User Story**
```
As a consultant or executive
I want to generate 4 OKRs based on team weak areas identified in the assessment results
So that I can create targeted objectives that address specific capability gaps
```

### **Acceptance Criteria**

#### **AC-1**: Generate OKRs Button Visibility
- **Given** I am viewing the team results page with weak areas identified
- **When** I scroll to the bottom of the page
- **Then** I should see a section titled "Ready to Create OKRs?"
- **And** I should see a button: "🎯 Generate 4 OKRs Based on Team Results"
- **And** the button should be prominently styled (gradient background)

#### **AC-2**: Button Click Behavior
- **Given** I click the "Generate 4 OKRs" button
- **When** the API request is initiated
- **Then** the button should be disabled
- **And** the button text should change to "Generating OKRs..."
- **And** I should see a loading spinner
- **And** the process should complete within 8 seconds

#### **AC-3**: OKR Generation Context
- **Given** the API is called
- **When** OKRs are generated
- **Then** the system should use the following context:
  - Company ID and name
  - Weak areas (dimensions with score < 6.0)
  - Team names affected by weak areas
  - Total team count and member count
  - Industry and company size
- **And** the system should generate exactly 4 OKRs

#### **AC-4**: OKR Targeting Logic
- **Given** weak areas are identified (e.g., Strength: 5.2)
- **When** OKRs are generated
- **Then** each OKR should target a weak dimension
- **And** if there are fewer than 4 weak areas, remaining OKRs should target lowest scores
- **And** each OKR should have 3 key results
- **And** each OKR should include:
  - Objective title (clear, actionable)
  - Target dimension (speed/strength/intelligence)
  - 3 Key Results with measurable targets
  - Priority level (high/medium)

#### **AC-5**: OKR Examples by Dimension
- **Given** Strength is weak (score < 6.0)
- **When** an OKR is generated for Strength
- **Then** it should address financial/resource/capability gaps
- **Example**: "Improve Financial Strength and Resource Allocation"
  - KR1: "Increase operating cash reserves by 25% by Q2 2026"
  - KR2: "Reduce operational costs by 15% through optimization"
  - KR3: "Secure $500K in additional funding by Q3 2026"

**Given** Speed is weak
- **Then** OKR should address decision-making, execution, market responsiveness
**Given** Intelligence is weak
- **Then** OKR should address data-driven decisions, strategic planning, tech adoption

#### **AC-6**: Success Response
- **Given** OKRs are generated successfully
- **When** the API responds
- **Then** I should receive 4 OKRs with IDs
- **And** each OKR should be saved to the database
- **And** I should see a success notification: "✅ 4 OKRs generated successfully"

#### **AC-7**: Redirect to OKR Review
- **Given** OKRs are generated and saved
- **When** the notification appears
- **Then** I should be automatically redirected to ai-okr-review.html
- **And** the URL should include OKR IDs as query params: `?okrs=okr_001,okr_002,okr_003,okr_004`
- **And** the OKR review page should display all 4 OKRs
- **And** I should be able to edit, approve, or reject each OKR

#### **AC-8**: Error Handling
- **Given** OKR generation fails (e.g., API error, timeout)
- **When** the error occurs
- **Then** the button should be re-enabled
- **And** I should see an error message: "❌ Failed to generate OKRs. Please try again."
- **And** I should be able to retry by clicking the button again

### **Technical Requirements**

**Backend**:
- API: `POST /api/ai-okr/generate-from-team-results`
- Uses: OpenAI GPT-4 with team breakdown context
- Generates: Exactly 4 OKRs, each with 3 KRs
- Saves: OKRs to database with company_id link

**Frontend**:
- File: `client/pages/team-ssi-view.html` (button section)
- Button with loading state
- Redirect logic to ai-okr-review.html (existing page - reused)

### **Test Cases**

1. **Happy Path**: Click button → OKRs generated → Redirect to review
2. **Weak Area Targeting**: Verify OKRs target identified weak dimensions
3. **Timeout**: API takes > 8 seconds → Shows error
4. **API Failure**: OpenAI fails → Shows error with retry option
5. **No Weak Areas**: No scores < 6.0 → Generates OKRs for lowest 4 scores
6. **Redirect**: Verify query params are correct and review page loads

### **Related Files**
- [team-ssi-view.html](../../client/pages/team-ssi-view.html) - Button location
- [ai-okr.js](../../server/routes/ai-okr.js) - OKR generation API
- [ai-okr-review.html](../../client/pages/ai-okr-review.html) - Review page (reused)

---

## 📊 Story Dependencies

```
CONS-003B (Send to Company)
    ↓
EXEC-001B (Accept Invitation)
    ↓
EXEC-002B (Share with Teams)
    ↓
[Team members complete assessments] (existing flow)
    ↓
CONS-007B (View Team Results)
    ↓
CONS-006B (Generate OKRs)
```

---

## 🔗 Related Documentation

- [SPRINT_1_MASTER_PLAN.md](./SPRINT_1_MASTER_PLAN.md) - Full sprint plan
- [CONSULTANT_JOURNEY.md](../../Karvia_OKR_Product_Planning/01_MVP/User_Stories/CONSULTANT_JOURNEY.md) - Consultant journey
- [MVP_USER_STORIES.md](../../Karvia_OKR_Product_Planning/01_MVP/MVP_USER_STORIES.md) - All user stories

---

**Version**: 1.0.0
**Created**: November 5, 2025
**Status**: 🔴 Not Started
