# Executive (EXEC) User Stories

---

**Document**: PERSONA_EXEC_STORIES.md
**Version**: 2.0.0
**Last Updated**: 2026-02-24
**Persona**: Executive - Department/Division Leader
**Total Stories**: 26
**Status**: 14 Complete, 5 Partial, 7 Not Started

> **Sprint 15 Update**: Added 4 new stories for enhanced first-time user experience (EXEC-020 to EXEC-023). Previous EXEC-020-022 renumbered to EXEC-024-026.

---

## Persona Overview

**Role**: Oversees departments/divisions, creates company objectives, monitors organizational performance
**Access Level**: Full Dashboard, Objectives, Assessment, Teams, Planning, Reports
**Primary Goals**: Set strategic direction, monitor departmental progress, ensure organizational alignment
**Key Screens**: Executive Dashboard, Objectives, Company Overview, Reports

---

## Story Status Summary

| Status | Count | Stories |
|--------|-------|---------|
| Complete | 14 | EXEC-001 to EXEC-008, EXEC-010, EXEC-012-014, EXEC-018, EXEC-019 |
| Partial | 5 | EXEC-009, EXEC-011, EXEC-015-017 |
| Not Started | 7 | **EXEC-020-023** (Sprint 15), EXEC-024, EXEC-025, EXEC-026 |

---

## Complete Stories

### EXEC-001: Create Company Objectives

**Status**: COMPLETE
**Verified**: Objectives API and frontend fully functional

**As an** executive
**I want to** create annual company objectives
**So that** the organization has clear strategic direction

**Implementation Reference**:
- Backend: `server/routes/objectives.js` - POST `/api/objectives` (1,193 lines)
- Frontend: `client/pages/objectives.html` (1,365 lines JS)
- Model: `server/models/Objective.js`

**Acceptance Criteria** (All Met):
- [x] Create objectives with title, description, category
- [x] Set time period (calendar_year, fiscal_year, custom)
- [x] Assign to fiscal year or custom period
- [x] Objectives visible to all company members
- [x] Support for 4 categories (Speed, Strength, Intelligence, Process)

---

### EXEC-002: Define Key Results

**Status**: COMPLETE
**Verified**: Key Results CRUD operations fully implemented

**As an** executive
**I want to** define key results for each objective
**So that** we have measurable outcomes

**Implementation Reference**:
- Backend: `server/routes/objectives.js` - Key Results endpoints
- Frontend: `client/pages/objectives.html`

**Acceptance Criteria** (All Met):
- [x] Add 3-5 key results per objective
- [x] Set target metrics and units
- [x] Define measurement criteria
- [x] Track progress percentage
- [x] Due dates cascade from objective

---

### EXEC-003: View Company Dashboard

**Status**: COMPLETE
**Verified**: Executive dashboard with full metrics display

**As an** executive
**I want to** see a company-wide dashboard
**So that** I have visibility into organizational performance

**Implementation Reference**:
- Backend: `server/routes/dashboard.js` - Multiple dashboard endpoints (25+)
- Frontend: `client/pages/manager-dashboard.html`
- Frontend: `client/pages/company-overview.html`

**Acceptance Criteria** (All Met):
- [x] Overview of all objectives and progress
- [x] Department-by-department breakdown
- [x] Key metrics summary (completion rates, on-track %)
- [x] At-risk indicators
- [x] Activity feed

---

### EXEC-004: View Company SSI Results

**Status**: COMPLETE
**Verified**: Full SSI scoring with 12-block breakdown

**As an** executive
**I want to** view company-wide SSI assessment results
**So that** I understand organizational capabilities

**Implementation Reference**:
- Backend: `server/routes/assessments.js` - GET `/api/assessments/company/:companyId`
- Backend: `server/services/UnifiedSSIScoringService.js`
- Frontend: `client/pages/team-ssi-view.html`
- Frontend: `client/pages/company-ssi-results.html`

**Acceptance Criteria** (All Met):
- [x] Company-wide Speed, Strength, Intelligence scores
- [x] 12-block MECE breakdown visualization
- [x] Comparison across departments
- [x] Radar chart visualization
- [x] Historical trend (where data exists)

---

### EXEC-005: Generate OKRs from Assessment

**Status**: COMPLETE
**Verified**: AI OKR generation fully functional with one-time guard

**As an** executive
**I want to** generate OKRs based on assessment results
**So that** our objectives are data-driven

**Implementation Reference**:
- Backend: `server/routes/ai-okr.js`
- Frontend: `client/pages/team-ssi-view.html`
- Service: `server/services/ai-okr.js`
- Guard: `Company.okr_generation.generated` flag

**Acceptance Criteria** (All Met):
- [x] Trigger OKR generation from SSI view
- [x] AI generates objectives based on gaps
- [x] Review generated OKRs before accepting
- [x] One-time generation enforced
- [x] Shows generation date after completion

---

### EXEC-006: Manage Departments

**Status**: COMPLETE
**Verified**: Team hierarchy fully supports departments

**As an** executive
**I want to** create and manage departments
**So that** the organization is properly structured

**Implementation Reference**:
- Backend: `server/routes/teams.js`
- Frontend: `client/pages/teams.html`
- Model: `server/models/Team.js`

**Acceptance Criteria** (All Met):
- [x] Create department with name, description
- [x] Assign department head (manager)
- [x] View department hierarchy
- [x] Nested teams under departments

---

### EXEC-007: Assign Objectives to Departments

**Status**: COMPLETE
**Verified**: Objective assignment to teams supported

**As an** executive
**I want to** assign objectives to specific departments
**So that** accountability is clear

**Implementation Reference**:
- Backend: `server/routes/objectives.js` - owner assignment
- Model: `server/models/Objective.js` - team_id field

**Acceptance Criteria** (All Met):
- [x] Select department when creating objective
- [x] Objectives filtered by department on dashboard
- [x] Department heads see assigned objectives
- [x] Cross-department objectives supported

---

### EXEC-008: View Assessment Participation

**Status**: COMPLETE
**Verified**: Invitation tracking and analytics available

**As an** executive
**I want to** see assessment participation rates
**So that** I ensure broad engagement

**Implementation Reference**:
- Backend: `server/routes/invitations.js` - sent-by-me, analytics
- Frontend: `client/pages/assessment-hub.html`

**Acceptance Criteria** (All Met):
- [x] View sent invitations count
- [x] Track completion rates by department
- [x] See pending vs completed
- [x] Reminder functionality

---

### EXEC-010: Configure Company Settings

**Status**: COMPLETE
**Verified**: Company profile management fully functional

**As an** executive
**I want to** configure company settings
**So that** the platform reflects our organization

**Implementation Reference**:
- Backend: `server/routes/companies.js`
- Frontend: `client/pages/company-profile.html`
- Model: `server/models/Company.js`

**Acceptance Criteria** (All Met):
- [x] Set company name, industry, size
- [x] Configure fiscal year start month
- [x] Set strategic priorities
- [x] Upload company logo

---

### EXEC-012: View Objective Alignment

**Status**: COMPLETE
**Verified**: Objective hierarchy view available

**As an** executive
**I want to** see how objectives cascade to goals
**So that** I verify strategic alignment

**Implementation Reference**:
- Backend: `server/routes/objectives.js` - tree endpoint
- Frontend: `client/pages/objectives.html`

**Acceptance Criteria** (All Met):
- [x] Tree view of Objective → KR → Goals
- [x] Alignment percentage visible
- [x] Identify unlinked goals
- [x] Filter by department

---

### EXEC-013: Manage User Roles

**Status**: COMPLETE
**Verified**: Role management in user admin

**As an** executive
**I want to** assign roles to users
**So that** access is properly controlled

**Implementation Reference**:
- Backend: `server/routes/users.js`
- Backend: `server/middleware/auth.js` - requireRole
- Frontend: `client/pages/users.html`

**Acceptance Criteria** (All Met):
- [x] View all users and roles
- [x] Change user roles (within permission)
- [x] Role hierarchy enforced
- [x] Activity visible based on role

---

### EXEC-014: Send Company-Wide Assessments

**Status**: COMPLETE
**Verified**: Assessment creation with team selection

**As an** executive
**I want to** send assessments to entire company
**So that** we get comprehensive capability data

**Implementation Reference**:
- Backend: `server/routes/invitations.js`
- Frontend: `client/pages/assessment-creation-flow.html`
- Sprint 9: Epic H complete

**Acceptance Criteria** (All Met):
- [x] Select "All Company" option
- [x] Choose assessment template
- [x] Set due date
- [x] Bulk send invitations
- [x] Anonymous survey option

---

### EXEC-018: View Progress Reports

**Status**: COMPLETE
**Verified**: Dashboard endpoints provide progress data

**As an** executive
**I want to** view periodic progress reports
**So that** I can track organizational performance

**Implementation Reference**:
- Backend: `server/routes/dashboard.js`
- Frontend: `client/pages/team-performance-dashboard.html`

**Acceptance Criteria** (All Met):
- [x] Weekly/monthly progress summaries
- [x] Department comparison
- [x] Trend visualization
- [x] Export capability (PDF)

---

### EXEC-019: Approve OKRs

**Status**: COMPLETE
**Verified**: OKR review workflow in place

**As an** executive
**I want to** review and approve generated OKRs
**So that** only validated objectives are tracked

**Implementation Reference**:
- Backend: `server/routes/ai-okr.js` - accept endpoint
- Frontend: `client/pages/team-ssi-view.html`

**Acceptance Criteria** (All Met):
- [x] View pending OKRs
- [x] Edit before approval
- [x] Accept or regenerate
- [x] Approved OKRs move to active

---

## Partial Stories

### EXEC-009: Configure Assessment Templates

**Status**: PARTIAL
**Gap**: Template creation exists but custom question editor limited

**As an** executive
**I want to** configure assessment templates
**So that** assessments match our needs

**What Exists**:
- Assessment template selection
- Pre-built SSI templates
- Template assignment to invitations

**What's Missing**:
- Full custom question editor
- Question bank management
- Template versioning

---

### EXEC-011: Export Company Data

**Status**: PARTIAL
**Gap**: PDF export exists, CSV/Excel limited

**As an** executive
**I want to** export company data
**So that** I can share with stakeholders

**What Exists**:
- PDF export for SSI results
- Dashboard data visible

**What's Missing**:
- CSV export for raw data
- Excel workbook generation
- Scheduled report delivery

---

### EXEC-015: Strategic Planning

**Status**: PARTIAL
**Gap**: Planning routes exist, full UI incomplete

**As an** executive
**I want to** create strategic plans
**So that** long-term direction is documented

**What Exists**:
- Objective creation with periods
- Quarterly goal creation

**What's Missing**:
- Multi-year planning view
- Strategic initiative tracking
- Resource allocation planning

---

### EXEC-016: Budget Alignment

**Status**: PARTIAL
**Gap**: No dedicated budget module, basic metrics exist

**As an** executive
**I want to** align objectives with budget
**So that** resources support strategy

**What Exists**:
- Business metrics in company profile
- Revenue/headcount fields

**What's Missing**:
- Budget allocation per objective
- Cost tracking against goals
- ROI calculations

---

### EXEC-017: Cross-Department Collaboration

**Status**: PARTIAL
**Gap**: Teams exist, collaboration features limited

**As an** executive
**I want to** facilitate cross-department collaboration
**So that** objectives requiring multiple teams succeed

**What Exists**:
- Multi-team visibility
- Shared objectives possible

**What's Missing**:
- Cross-functional team creation
- Shared KR ownership
- Collaboration workspace

---

## Not Started Stories

## Sprint 15 Stories (Enhanced First-Time Experience)

### EXEC-020: Receive Value-Driven Welcome

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15A
**Story Points**: 4

**As a** business owner being onboarded by a consultant
**I want to** receive a value-driven welcome email
**So that** I understand what I'll get from Karvia before taking action

**Implementation Reference**:
- Backend: `server/services/email-templates.js`
- Trigger: Consultant adds client via enhanced modal

**Acceptance Criteria**:
- [ ] Email clearly states value proposition (not generic invite)
- [ ] SSI explained with emojis (⚡🛡🧠)
- [ ] Primary CTA is "Complete Your Assessment"
- [ ] Shows what they'll get after assessment (4 bullet points)
- [ ] Includes login credentials
- [ ] Consultant's name appears throughout for trust
- [ ] Mobile-responsive HTML design
- [ ] Plain text fallback version

---

### EXEC-021: Post-Assessment Results Page

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15A
**Story Points**: 5

**As a** business owner who just completed the assessment
**I want to** immediately see my results with clear next steps
**So that** I understand my company's state and what to do next

**Implementation Reference**:
- Frontend: `client/pages/first-results.html` (new)
- Backend: `server/routes/assessments.js` - first-time-results endpoint

**Acceptance Criteria**:
- [ ] Auto-login after assessment completion + password set
- [ ] Personalized welcome with first name
- [ ] SSI scores displayed prominently with emojis
- [ ] Score interpretation in plain language (Good/Developing/Needs Work)
- [ ] Specific recommendations based on lowest scores
- [ ] 3 clear next steps with CTAs (View Report, Generate OKRs, Invite Team)
- [ ] Strategic goal referenced (from consultant input)
- [ ] Mobile responsive
- [ ] Dashboard link as final CTA

---

### EXEC-022: Profile Completion Progress

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15A
**Story Points**: 4

**As a** business owner
**I want to** see how complete my company profile is
**So that** I know what else to provide for better recommendations

**Implementation Reference**:
- Frontend: `client/pages/company-profile.html` - progress widget
- Backend: `server/routes/companies.js` - profile-completion endpoint

**Acceptance Criteria**:
- [ ] Progress bar on dashboard (e.g., "75% Complete")
- [ ] Checklist of sections (Basic Info, Description, SSI, Strategic Vision, Metrics)
- [ ] Visual indicators (✓ complete, ○ incomplete)
- [ ] CTA to complete missing sections
- [ ] Updates in real-time as fields are filled
- [ ] 100% shows celebration state

---

### EXEC-023: Invite Team Members (Business Owner)

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15B
**Story Points**: 4

**As a** business owner
**I want to** easily invite my team members
**So that** we can work on objectives together

**Implementation Reference**:
- Frontend: `client/pages/users.html` - Invite Team modal
- Backend: `server/routes/invitations.js` - bulk team invitations

**Acceptance Criteria**:
- [ ] Multi-email input (newline or comma separated)
- [ ] Role selector with descriptions (Manager, Employee, Executive)
- [ ] Team assignment dropdown (optional)
- [ ] Assessment checkbox (send SSI to team)
- [ ] Email preview showing what invitee receives
- [ ] Success toast with count
- [ ] Error handling for invalid emails
- [ ] Activity logged

---

### EXEC-024: Executive Briefings

**Status**: NOT STARTED
**Sprint Reference**: Future - Advanced Features

**As an** executive
**I want to** receive automated executive briefings
**So that** I stay informed without manual checking

---

### EXEC-025: Board Reporting

**Status**: NOT STARTED
**Sprint Reference**: Future - Advanced Features

**As an** executive
**I want to** generate board-ready reports
**So that** I can present to stakeholders efficiently

---

### EXEC-026: Scenario Planning

**Status**: NOT STARTED
**Sprint Reference**: Future - Advanced Features

**As an** executive
**I want to** run scenario planning exercises
**So that** we can prepare for different outcomes

---

## Implementation Priority

**Immediate (Sprint 15 - First-Time Experience)**:
1. **EXEC-020** - Value-Driven Welcome Email (P0, 4 pts)
2. **EXEC-021** - Post-Assessment Results Page (P0, 5 pts)
3. **EXEC-022** - Profile Completion Progress (P1, 4 pts)
4. **EXEC-023** - Invite Team Members (P0, 4 pts)

**Near-term (Sprint 16+)**:
5. Complete partial stories (EXEC-009, EXEC-011)
6. EXEC-015 - Strategic planning UI
7. EXEC-016 - Budget alignment basics
8. EXEC-017 - Cross-department features

**Future (Post-MVP)**:
9. EXEC-024, EXEC-025, EXEC-026 - Advanced executive features

---

**Last Updated**: 2026-02-24
**Audit Source**: Codebase analysis + Sprint 9 Handoff + Sprint 15 Planning

