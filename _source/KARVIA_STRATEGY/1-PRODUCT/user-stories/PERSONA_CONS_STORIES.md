# Consultant (CONS) User Stories

---

**Document**: PERSONA_CONS_STORIES.md
**Version**: 2.0.0
**Last Updated**: 2026-02-24
**Persona**: Consultant - External Advisor
**Total Stories**: 22
**Status**: 10 Complete, 5 Partial, 7 Not Started

> **Sprint 15 Update**: Added 4 new stories for enhanced client onboarding (CONS-019 to CONS-022)

---

## Persona Overview

**Role**: External consultant who advises multiple companies, runs assessments, guides OKR implementation
**Access Level**: Full system access, cross-company view, platform administration
**Primary Goals**: Assess client companies, guide OKR creation, monitor client progress
**Key Screens**: Company Switcher, Assessment Hub, SSI Results, OKR Generation, Client Dashboard

---

## Story Status Summary

| Status | Count | Stories |
|--------|-------|---------|
| Complete | 10 | CONS-001 to CONS-006, CONS-008, CONS-010, CONS-011, CONS-014 |
| Partial | 5 | CONS-007, CONS-009, CONS-012, CONS-013, CONS-015 |
| Not Started | 7 | CONS-016, CONS-017, CONS-018, **CONS-019, CONS-020, CONS-021, CONS-022** (Sprint 15) |

---

## Complete Stories

### CONS-001: Onboard New Client Company

**Status**: COMPLETE
**Verified**: Company creation and profile setup functional

**As a** consultant
**I want to** onboard a new client company
**So that** I can begin the OKR implementation process

**Implementation Reference**:
- Backend: `server/routes/companies.js` - POST `/api/companies`
- Frontend: `client/pages/company-profile.html`
- Model: `server/models/Company.js`

**Acceptance Criteria** (All Met):
- [x] Create company with name, industry, size
- [x] Set business subtype and metrics
- [x] Configure fiscal year (April, July, October starts)
- [x] Set strategic priorities
- [x] Company appears in my client list

---

### CONS-002: Switch Between Client Companies

**Status**: COMPLETE
**Verified**: Company switcher in navigation

**As a** consultant
**I want to** switch between my client companies
**So that** I can manage multiple engagements

**Implementation Reference**:
- Frontend: `client/js/navigation.js` - Company switcher
- Backend: `server/routes/companies.js` - List companies for user

**Acceptance Criteria** (All Met):
- [x] Dropdown shows all my client companies
- [x] Click switches active company context
- [x] All data updates to selected company
- [x] Current company clearly indicated

---

### CONS-003: Send Assessment to Client

**Status**: COMPLETE
**Verified**: Full assessment invitation system (Sprint 9)

**As a** consultant
**I want to** send SSI assessments to client team
**So that** I can evaluate their capabilities

**Implementation Reference**:
- Backend: `server/routes/invitations.js`
- Frontend: `client/pages/assessment-creation-flow.html`
- Sprint 9: Epic H complete

**Acceptance Criteria** (All Met):
- [x] Select assessment template
- [x] Choose recipients (team or company-wide)
- [x] Set due date
- [x] Send bulk invitations
- [x] Anonymous survey option available

---

### CONS-004: View Client SSI Results

**Status**: COMPLETE
**Verified**: Team SSI view with 12-block breakdown

**As a** consultant
**I want to** view SSI assessment results for my client
**So that** I can analyze their organizational capabilities

**Implementation Reference**:
- Backend: `server/routes/assessments.js` - GET company/team results
- Backend: `server/services/UnifiedSSIScoringService.js`
- Frontend: `client/pages/team-ssi-view.html` (2,149 lines)

**Acceptance Criteria** (All Met):
- [x] Speed, Strength, Intelligence scores
- [x] 12-block MECE breakdown
- [x] Team vs company comparison
- [x] Radar chart visualization
- [x] PDF export

---

### CONS-005: Generate OKRs for Client

**Status**: COMPLETE
**Verified**: AI OKR generation functional

**As a** consultant
**I want to** generate OKRs based on assessment results
**So that** I can provide data-driven recommendations

**Implementation Reference**:
- Backend: `server/routes/ai-okr.js`
- Frontend: `client/pages/team-ssi-view.html`
- Service: `server/services/ai-okr.js`

**Acceptance Criteria** (All Met):
- [x] Trigger OKR generation from SSI view
- [x] AI generates objectives based on gaps
- [x] Review before accepting
- [x] One-time generation guard
- [x] Personalized to company context

---

### CONS-006: Review Generated OKRs with Client

**Status**: COMPLETE
**Verified**: OKR review workflow exists

**As a** consultant
**I want to** review and edit generated OKRs
**So that** they match client expectations

**Implementation Reference**:
- Backend: `server/routes/ai-okr.js` - Review and accept endpoints
- Frontend: `client/pages/team-ssi-view.html`

**Acceptance Criteria** (All Met):
- [x] View pending OKRs
- [x] Edit objectives and key results
- [x] Accept or regenerate
- [x] Approved OKRs become active

---

### CONS-008: Track Client Assessment Completion

**Status**: COMPLETE
**Verified**: Invitation tracking in Assessment Hub

**As a** consultant
**I want to** track assessment completion rates
**So that** I can follow up with non-responders

**Implementation Reference**:
- Backend: `server/routes/invitations.js` - sent-by-me endpoint
- Frontend: `client/pages/assessment-hub.html`

**Acceptance Criteria** (All Met):
- [x] View sent invitations
- [x] See pending vs completed
- [x] Send reminders
- [x] Due date visibility

---

### CONS-010: View Client Dashboard

**Status**: COMPLETE
**Verified**: Dashboard endpoints functional

**As a** consultant
**I want to** view a dashboard of client progress
**So that** I can monitor engagement effectiveness

**Implementation Reference**:
- Backend: `server/routes/dashboard.js`
- Frontend: `client/pages/manager-dashboard.html`

**Acceptance Criteria** (All Met):
- [x] Objective progress overview
- [x] Team activity summary
- [x] At-risk indicators
- [x] Key metrics display

---

### CONS-011: Manage Client Users

**Status**: COMPLETE
**Verified**: User management API functional

**As a** consultant
**I want to** manage users for my client company
**So that** the right people have access

**Implementation Reference**:
- Backend: `server/routes/users.js`
- Frontend: `client/pages/users.html`

**Acceptance Criteria** (All Met):
- [x] Invite new users to company
- [x] Assign roles
- [x] Deactivate users
- [x] View user list

---

### CONS-014: Create Assessment Templates

**Status**: COMPLETE
**Verified**: Template creation in assessment creation flow

**As a** consultant
**I want to** create custom assessment templates
**So that** I can tailor assessments to client needs

**Implementation Reference**:
- Backend: `server/routes/assessment-templates.js`
- Frontend: `client/pages/assessment-creation-flow.html`
- Sprint 9: Template creation step

**Acceptance Criteria** (All Met):
- [x] Create template with name
- [x] Select from question bank
- [x] Save as reusable template
- [x] Use for future assessments

---

## Partial Stories

### CONS-007: Compare Client to Industry Benchmarks

**Status**: PARTIAL
**Gap**: Company averages exist, industry benchmarks not implemented

**As a** consultant
**I want to** compare client results to industry benchmarks
**So that** I can show relative performance

**What Exists**:
- Company SSI scores
- Team vs company comparison
- Industry field in company profile

**What's Missing**:
- Industry benchmark database
- Benchmark comparison visualization
- Percentile rankings

---

### CONS-009: Export Client Reports

**Status**: PARTIAL
**Gap**: PDF export exists, comprehensive reporting limited

**As a** consultant
**I want to** export comprehensive client reports
**So that** I can share insights with stakeholders

**What Exists**:
- SSI results PDF export
- Dashboard data visible

**What's Missing**:
- Branded report generation
- Multi-section reports
- Scheduled delivery

---

### CONS-012: View Client History

**Status**: PARTIAL
**Gap**: Current data available, historical tracking limited

**As a** consultant
**I want to** view historical assessment and progress data
**So that** I can track client improvement over time

**What Exists**:
- Assessment results stored
- Objective progress tracked

**What's Missing**:
- Historical trend visualization
- Period-over-period comparison
- Progress timeline view

---

### CONS-013: Configure SSI Weights

**Status**: PARTIAL
**Gap**: Weight configuration exists per company, industry presets planned

**As a** consultant
**I want to** customize SSI scoring weights
**So that** assessments reflect industry priorities

**What Exists**:
- Company-level weight override
- Sprint 10 Epic S: Weight configuration planned

**What's Missing**:
- Industry preset weights
- Dimension-level customization
- Weight templates

---

### CONS-015: Manage Multiple Engagements

**Status**: PARTIAL
**Gap**: Company switching works, engagement tracking limited

**As a** consultant
**I want to** manage my engagement status with clients
**So that** I know active vs completed clients

**What Exists**:
- Switch between companies
- All company data accessible

**What's Missing**:
- Engagement status tracking
- Engagement dates/phases
- Client notes/context

---

## Not Started Stories

### CONS-016: White-Label Reports

**Status**: NOT STARTED

**As a** consultant
**I want to** generate white-label reports
**So that** I can present branded deliverables to clients

---

### CONS-017: Consultant Portfolio Dashboard

**Status**: NOT STARTED

**As a** consultant
**I want to** view a dashboard of all my clients
**So that** I can manage my practice efficiently

---

### CONS-018: Engagement Templates

**Status**: NOT STARTED
**Sprint Reference**: Future - Consultant Features

**As a** consultant
**I want to** create engagement templates
**So that** I can standardize my implementation approach

---

## Sprint 15 Stories (Enhanced Client Onboarding)

### CONS-019: Add Client with Strategic Context

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15A
**Story Points**: 5

**As a** consultant
**I want to** add a new client with strategic context in a 2-step modal
**So that** the client receives a personalized, value-driven onboarding experience

**Implementation Reference**:
- Frontend: `client/pages/my-clients.html` - Add Client Modal
- Backend: `server/routes/companies.js` - Enhanced client creation
- Model: `server/models/Company.js` - business_context fields

**Acceptance Criteria**:
- [ ] 2-step modal with clear progress indicator (1/2, 2/2)
- [ ] Step 1: Company info + Contact (required fields)
- [ ] Step 2: Strategic context + Assessment (optional but guided)
- [ ] Company description field (textarea, 500 char max)
- [ ] Primary 12-month goal field (textarea, 200 char max)
- [ ] Biggest challenge radio buttons (Market, Operations, Team, Product, Funding, Other)
- [ ] Assessment checkbox with template dropdown
- [ ] Private note field (consultant-only, stored separately)
- [ ] Email preview showing what client receives
- [ ] Form validation with inline errors
- [ ] Loading state during submission

---

### CONS-020: Value-Driven Client Welcome

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15A
**Story Points**: 4

**As a** consultant
**I want to** have a value-driven welcome email sent automatically
**So that** my client understands the value and is motivated to complete the assessment

**Implementation Reference**:
- Backend: `server/services/email-templates.js` - New welcome template
- Backend: `server/routes/invitations.js` - Trigger on client creation

**Acceptance Criteria**:
- [ ] Email clearly states value proposition (not generic invite)
- [ ] SSI explained with emojis (⚡🛡🧠)
- [ ] Primary CTA is "Complete Your Assessment"
- [ ] Shows what they'll get after assessment (4 bullet points)
- [ ] Includes login credentials
- [ ] Consultant's name appears throughout
- [ ] Mobile-responsive HTML design
- [ ] Plain text fallback version
- [ ] Tracks email opens/clicks

---

### CONS-021: Track Client Onboarding Journey

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15A
**Story Points**: 4

**As a** consultant
**I want to** see the onboarding status of each client on their card
**So that** I know who needs follow-up and who is ready for the next step

**Implementation Reference**:
- Frontend: `client/pages/my-clients.html` - Status indicators
- Backend: `server/routes/companies.js` - Onboarding status endpoint

**Acceptance Criteria**:
- [ ] Client cards show onboarding stage badge
- [ ] Stages: Invited → Email Opened → Assessment In Progress → Complete → Active
- [ ] Days since invite displayed for pending clients
- [ ] "Send Reminder" action for stale invitations
- [ ] Assessment completion percentage shown
- [ ] Email open tracking reflected in UI
- [ ] Sort/filter by onboarding stage

---

### CONS-022: Consultant Invites Client Team

**Status**: NOT STARTED
**Sprint Reference**: Sprint 15 - Epic 15B
**Story Points**: 2

**As a** consultant
**I want to** invite team members on behalf of my client
**So that** I can accelerate the client's team onboarding

**Implementation Reference**:
- Frontend: `client/pages/my-clients.html` - Invite Team button
- Backend: `server/routes/invitations.js` - Bulk team invitations

**Acceptance Criteria**:
- [ ] "Invite Team" button on each client card
- [ ] Multi-email input (newline or comma separated)
- [ ] Role selector (Manager, Employee, Executive)
- [ ] Team assignment dropdown (optional)
- [ ] Assessment checkbox (send SSI to team)
- [ ] Email preview
- [ ] Confirmation: "John will be notified of these invitations"
- [ ] Success toast with count of invitations sent
- [ ] Activity logged for both consultant and client

---

## Implementation Priority

**Immediate (Sprint 15 - Client Onboarding)**:
1. **CONS-019** - Add Client with Strategic Context (P0, 5 pts)
2. **CONS-020** - Value-Driven Client Welcome (P0, 4 pts)
3. **CONS-021** - Track Client Onboarding Journey (P1, 4 pts)
4. **CONS-022** - Consultant Invites Client Team (P1, 2 pts)

**Near-term (Sprint 16+)**:
5. CONS-013 - SSI weight configuration
6. CONS-012 - Historical trend view
7. CONS-007 - Industry benchmarks
8. CONS-009 - Enhanced reporting

**Future (Post-MVP)**:
9. CONS-015 - Engagement management
10. CONS-016, CONS-017, CONS-018 - Consultant practice features

---

**Last Updated**: 2026-02-24
**Audit Source**: Codebase analysis + Sprint 9 Handoff + Sprint 15 Planning

