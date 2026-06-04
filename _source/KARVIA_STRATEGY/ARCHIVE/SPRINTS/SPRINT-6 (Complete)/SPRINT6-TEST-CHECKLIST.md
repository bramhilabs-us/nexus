# Sprint 6 Comprehensive Test Checklist

**Date**: December 1, 2025
**Tester**: _______________
**Browser**: _______________

---

## Pre-Test Setup

- [ ] Server running: `npm run dev:server` (port 5000)
- [ ] MongoDB connected
- [ ] Logged in as test user with EXECUTIVE or BUSINESS_OWNER role
- [ ] Have at least one company with some team assessments

---

## Journey 1: Objectives Page (Epic 2 + Epic 5)

### 1.1 Navigate to Objectives
- [ ] Go to `/pages/objectives.html`
- [ ] Page loads without errors
- [ ] Existing objectives display (if any)

### 1.2 Create New Objective
- [ ] Click "New Objective" button
- [ ] **Owner dropdown** populates with team members (Epic 5 fix)
- [ ] **Target year dropdown** shows dynamic years (2025, 2026, 2027) (Epic 5 fix)
- [ ] Fill form and submit
- [ ] New objective appears in list
- [ ] Status shows "On track" (not "At risk" for new objectives - Epic 5 fix)

### 1.3 View Key Results Expansion (Epic 2)
- [ ] Find objective with 3+ key results
- [ ] Toggle shows "Show X more KRs (Y completed)" format
- [ ] Click toggle - hidden KRs expand
- [ ] Text changes to "Show less"
- [ ] Click again - KRs collapse

### 1.4 Delete Objective (Epic 2)
- [ ] Click delete button on an objective
- [ ] **Styled confirmation modal** appears (not browser confirm)
- [ ] Modal shows objective title
- [ ] Modal warns about cascade deletion
- [ ] Click "Cancel" - modal closes, objective remains
- [ ] Click delete again, then "Delete Objective"
- [ ] Objective removed from list
- [ ] Associated KRs/Goals also deleted (verify in DB)

**Journey 1 Result**: [ ] PASS / [ ] FAIL
**Notes**: _________________________________________________

---

## Journey 2: OKR Generation (Epic 1)

### 2.1 Generate from Team SSI View (Original Flow)
- [ ] Go to `/pages/team-ssi-view.html`
- [ ] Switch to "Company Overview" tab
- [ ] SSI scores display correctly
- [ ] "Generate OKRs" button visible
- [ ] Click button → Configuration modal appears
- [ ] Select period (quarterly/yearly) and start date
- [ ] Click generate
- [ ] OKRs generated successfully
- [ ] Objectives created with key results

### 2.2 Generate from Objectives Page (Epic 1 Fix)
- [ ] Go to `/pages/objectives.html`
- [ ] Click "Generate with AI" button
- [ ] Configuration modal appears
- [ ] Submit without SSI data
- [ ] **Backend auto-fetches SSI data** (Epic 1)
- [ ] OKRs generated successfully (no 400 error)

### 2.3 OKR Already Generated State
- [ ] After generating OKRs, refresh page
- [ ] "Generate OKRs" button shows disabled/completed state
- [ ] Message shows generation date
- [ ] "View Existing Objectives" link works

**Journey 2 Result**: [ ] PASS / [ ] FAIL
**Notes**: _________________________________________________

---

## Journey 3: SSI Diagnostic Report (Epic 7)

### 3.1 Check Eligibility (Below 80%)
- [ ] Go to `/pages/team-ssi-view.html`
- [ ] Switch to "Company Overview"
- [ ] If < 80% completion:
  - [ ] Diagnostic button shows locked state
  - [ ] Progress bar shows current percentage
  - [ ] Shows "X more assessments needed" message

### 3.2 Generate Diagnostic Report (80%+ completion)
- [ ] With 80%+ completion, button shows "Generate Report"
- [ ] Click button
- [ ] Loading state appears
- [ ] Diagnostic modal opens with:
  - [ ] Health score (0-100)
  - [ ] SSI dimension scores (Speed, Strength, Intelligence)
  - [ ] Issues section (critical/warning)
  - [ ] Top performing teams
  - [ ] OKR recommendations

### 3.3 Export Report
- [ ] In modal, click "Export" button
- [ ] JSON file downloads
- [ ] File contains valid diagnostic data

### 3.4 Use for OKR Generation
- [ ] Click "Use for OKR Generation" button
- [ ] Modal closes
- [ ] OKR generation flow starts
- [ ] Diagnostic insights included in generation

**Journey 3 Result**: [ ] PASS / [ ] FAIL
**Notes**: _________________________________________________

---

## Journey 4: Role-Based Access

### 4.1 Manager Role
- [ ] Login as MANAGER
- [ ] Cannot access diagnostic report
- [ ] Can view team results
- [ ] Cannot generate company-wide OKRs

### 4.2 Executive Role
- [ ] Login as EXECUTIVE
- [ ] Can view company overview
- [ ] Can generate diagnostic report
- [ ] Can generate OKRs

### 4.3 Consultant Role
- [ ] Login as CONSULTANT
- [ ] Full access to all features
- [ ] Can view multiple companies

**Journey 4 Result**: [ ] PASS / [ ] FAIL
**Notes**: _________________________________________________

---

## Edge Cases & Corner Cases

### EC1: Empty States
- [ ] Objectives page with no objectives shows empty state
- [ ] Team SSI view with no assessments shows appropriate message

### EC2: Error Handling
- [ ] Network error during OKR generation shows user-friendly message
- [ ] Invalid company ID returns proper error
- [ ] Session expiry redirects to login

### EC3: Data Validation
- [ ] Objective without title cannot be saved
- [ ] Start date validation works
- [ ] Year selection limits to reasonable range

### EC4: Concurrent Actions
- [ ] Multiple rapid deletes don't cause issues
- [ ] Refresh during OKR generation doesn't break state

**Edge Cases Result**: [ ] PASS / [ ] FAIL
**Notes**: _________________________________________________

---

## Summary

| Journey | Status | Issues Found |
|---------|--------|--------------|
| 1: Objectives | | |
| 2: OKR Generation | | |
| 3: Diagnostic Report | | |
| 4: Role-Based Access | | |
| Edge Cases | | |

**Overall Sprint 6 Test Result**: [ ] PASS / [ ] FAIL

**Critical Issues**:
1.
2.
3.

**Minor Issues**:
1.
2.
3.

**Tester Signature**: _______________ **Date**: _______________
