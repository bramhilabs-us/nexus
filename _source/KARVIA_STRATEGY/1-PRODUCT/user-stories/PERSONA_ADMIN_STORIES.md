# Business Owner / Admin (ADMIN) User Stories

---

**Document**: PERSONA_ADMIN_STORIES.md
**Version**: 1.0.0
**Last Updated**: 2026-01-10
**Persona**: Business Owner / System Administrator
**Total Stories**: 16
**Status**: 10 Complete, 4 Partial, 2 Not Started

---

## Persona Overview

**Role**: Company owner or administrator responsible for platform setup, user management, and system configuration
**Access Level**: Full company administration, settings, user management, billing
**Primary Goals**: Configure platform for organization, manage users, ensure proper access control
**Key Screens**: Company Profile, User Management, Settings, Teams

---

## Story Status Summary

| Status | Count | Stories |
|--------|-------|---------|
| Complete | 10 | ADMIN-001 to ADMIN-007, ADMIN-010, ADMIN-012, ADMIN-014 |
| Partial | 4 | ADMIN-008, ADMIN-009, ADMIN-011, ADMIN-013 |
| Not Started | 2 | ADMIN-015, ADMIN-016 |

---

## Complete Stories

### ADMIN-001: Initial Company Setup

**Status**: COMPLETE
**Verified**: Company registration and profile setup functional

**As an** admin
**I want to** set up my company on the platform
**So that** my organization can use the OKR system

**Implementation Reference**:
- Backend: `server/routes/companies.js` - POST `/api/companies`
- Backend: `server/routes/auth.js` - Registration flow
- Frontend: `client/pages/company-profile.html`
- Model: `server/models/Company.js`

**Acceptance Criteria** (All Met):
- [x] Register company with business details
- [x] Set company name, industry, size
- [x] Configure business subtype
- [x] Add strategic priorities
- [x] Initial user created as BUSINESS_OWNER

---

### ADMIN-002: Invite Users to Platform

**Status**: COMPLETE
**Verified**: User invitation system functional

**As an** admin
**I want to** invite users to join my company
**So that** employees can access the platform

**Implementation Reference**:
- Backend: `server/routes/invitations.js`
- Backend: `server/routes/users.js`
- Frontend: `client/pages/users.html`

**Acceptance Criteria** (All Met):
- [x] Send invitation by email
- [x] Set role during invitation
- [x] Track invitation status
- [x] Resend invitations
- [x] Invited user can self-register

---

### ADMIN-003: Manage User Roles

**Status**: COMPLETE
**Verified**: Role assignment and updates functional

**As an** admin
**I want to** assign and change user roles
**So that** access permissions are correct

**Implementation Reference**:
- Backend: `server/routes/users.js` - PUT role update
- Backend: `server/middleware/auth.js` - Role hierarchy
- Frontend: `client/pages/users.html`

**Acceptance Criteria** (All Met):
- [x] View all users with current roles
- [x] Change user role (within permission)
- [x] Role hierarchy enforced
- [x] Changes take effect immediately

---

### ADMIN-004: Deactivate Users

**Status**: COMPLETE
**Verified**: User deactivation supported

**As an** admin
**I want to** deactivate users
**So that** former employees lose access

**Implementation Reference**:
- Backend: `server/routes/users.js`
- Model: `server/models/User.js` - status field

**Acceptance Criteria** (All Met):
- [x] Deactivate user account
- [x] User cannot log in after deactivation
- [x] User data preserved for history
- [x] Reactivation possible

---

### ADMIN-005: Create Team Structure

**Status**: COMPLETE
**Verified**: Team creation and hierarchy functional

**As an** admin
**I want to** create teams and departments
**So that** organizational structure is represented

**Implementation Reference**:
- Backend: `server/routes/teams.js` - POST `/api/teams/create`
- Frontend: `client/pages/teams.html`
- Model: `server/models/Team.js`

**Acceptance Criteria** (All Met):
- [x] Create teams with name, description
- [x] Assign team managers
- [x] Set parent department (hierarchy)
- [x] Add members to teams

---

### ADMIN-006: Configure Fiscal Year

**Status**: COMPLETE
**Verified**: Fiscal year settings in company profile

**As an** admin
**I want to** configure our fiscal year
**So that** objectives align with our business calendar

**Implementation Reference**:
- Backend: `server/routes/companies.js`
- Service: `server/services/DateService.js`
- Model: `server/models/Company.js` - fiscal_year_start

**Acceptance Criteria** (All Met):
- [x] Set fiscal year start month (April, July, October)
- [x] Objectives respect fiscal year
- [x] Quarter calculations accurate
- [x] Calendar view aligned

---

### ADMIN-007: Update Company Profile

**Status**: COMPLETE
**Verified**: Company profile editing functional

**As an** admin
**I want to** update company information
**So that** our profile stays current

**Implementation Reference**:
- Backend: `server/routes/companies.js` - PUT `/api/companies/:id`
- Frontend: `client/pages/company-profile.html`

**Acceptance Criteria** (All Met):
- [x] Edit company name, industry
- [x] Update employee count
- [x] Change business metrics
- [x] Modify strategic priorities

---

### ADMIN-010: View User Activity

**Status**: COMPLETE
**Verified**: Activity visible through dashboard

**As an** admin
**I want to** see user activity
**So that** I know who is using the platform

**Implementation Reference**:
- Backend: `server/routes/dashboard.js`
- Frontend: Dashboard activity widgets

**Acceptance Criteria** (All Met):
- [x] View last login dates
- [x] See assessment completion
- [x] Track objective updates
- [x] Activity feed display

---

### ADMIN-012: Manage Company Logo

**Status**: COMPLETE
**Verified**: Logo upload in company profile

**As an** admin
**I want to** upload company logo
**So that** the platform is branded

**Implementation Reference**:
- Backend: `server/routes/companies.js` - Logo upload
- Frontend: `client/pages/company-profile.html`

**Acceptance Criteria** (All Met):
- [x] Upload logo image
- [x] Logo displayed in navigation
- [x] Logo on reports/exports
- [x] Replace existing logo

---

### ADMIN-014: View System Usage

**Status**: COMPLETE
**Verified**: Usage data in dashboards

**As an** admin
**I want to** view platform usage statistics
**So that** I can ensure adoption

**Implementation Reference**:
- Backend: `server/routes/dashboard.js`
- Frontend: Dashboard widgets

**Acceptance Criteria** (All Met):
- [x] Active users count
- [x] Assessment completion rates
- [x] Objective progress summary
- [x] Team engagement metrics

---

## Partial Stories

### ADMIN-008: Bulk User Import

**Status**: PARTIAL
**Gap**: Bulk operations feature flag not enabled

**As an** admin
**I want to** import users via CSV
**So that** I can onboard many users at once

**What Exists**:
- Bulk operations code structure
- Feature flag: `BULK_OPS`
- CSV processing capability

**What's Missing**:
- Feature not enabled in production
- UI for file upload
- Validation and error handling UI

---

### ADMIN-009: Configure Notifications

**Status**: PARTIAL
**Gap**: Backend support exists, UI limited

**As an** admin
**I want to** configure notification settings
**So that** users receive appropriate alerts

**What Exists**:
- Email notification capability
- Feature flag: `FEATURE_EMAIL_ENABLED`

**What's Missing**:
- Notification settings UI
- Per-user notification preferences
- Notification frequency controls

---

### ADMIN-011: Export Company Data

**Status**: PARTIAL
**Gap**: PDF export exists, full data export limited

**As an** admin
**I want to** export all company data
**So that** I have a backup or can migrate

**What Exists**:
- SSI results PDF export
- Individual report exports

**What's Missing**:
- Full company data export
- User data export
- Goals and objectives bulk export

---

### ADMIN-013: Configure SSI Weights

**Status**: PARTIAL
**Gap**: Weight override exists, UI planned for Sprint 10

**As an** admin
**I want to** customize SSI assessment weights
**So that** scoring reflects our priorities

**What Exists**:
- Company-level weight override field
- UnifiedSSIScoringService weight support

**What's Missing**:
- Weight configuration UI (Sprint 10 Epic S)
- Industry preset selection
- Visual weight adjustment

---

## Not Started Stories

### ADMIN-015: Billing Management

**Status**: NOT STARTED

**As an** admin
**I want to** manage billing and subscription
**So that** I can control costs

---

### ADMIN-016: Audit Logs

**Status**: NOT STARTED
**Sprint Reference**: Future - Security Features

**As an** admin
**I want to** view audit logs
**So that** I can track security-relevant actions

---

## Implementation Priority

**Immediate (Current Sprints)**:
1. ADMIN-013 - SSI weight configuration UI (Sprint 10)
2. ADMIN-009 - Notification settings

**Near-term (Sprint 11-12)**:
3. ADMIN-008 - Enable bulk operations
4. ADMIN-011 - Enhanced export options

**Future (Post-MVP)**:
5. ADMIN-015 - Billing integration
6. ADMIN-016 - Audit logging

---

**Last Updated**: 2026-01-10
**Audit Source**: Codebase analysis + Sprint 9 Handoff

