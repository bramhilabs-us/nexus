# Assessment Hub - Consultant Journey Analysis

## Overview

The Consultant is the **highest-level user** in the system, functioning as an admin who can:
1. **View their own company** (consulting firm) - Portfolio/Admin view
2. **View any client company** - Acting as a Business Owner for that company

This document analyzes every tab in the Assessment Hub from both perspectives.

---

## Two Contexts for Consultants

### Context A: Own Company View (Portfolio/Admin Mode)
- Consultant sees their consulting firm's data
- Has visibility across ALL client companies
- "My Clients" tab is visible
- "Team Results" tab is hidden (they use My Clients to see client results)

### Context B: Client Company View (Business Owner Mode)
- Consultant is "acting as" the business owner
- Sees only that specific company's data
- "My Clients" tab is hidden
- "Team Results" tab is visible
- Context banner shows "Viewing as: [Company Name]"

---

## Tab-by-Tab Analysis

### TAB 1: Assigned to Me

**Purpose:** Show assessments the current user needs to complete.

| Context | Current Behavior | Expected Behavior | Changes Needed |
|---------|-----------------|-------------------|----------------|
| Own Company | Shows consultant's personal assessments | Correct | None |
| Client Company | Shows assessments in client company context | Should show consultant's assessments within that company (likely empty) | Verify API respects company_id context |

**Issues Identified:**
- None major - this tab works correctly for both contexts

---

### TAB 2: My Templates

**Purpose:** Show templates available for sending assessments.

| Context | Current Behavior | Expected Behavior | Changes Needed |
|---------|-----------------|-------------------|----------------|
| Own Company | Shows global + consultant's custom templates | Correct | None |
| Client Company | Same templates shown | Correct - templates are not company-specific | None |

**Issues Identified:**
- None - templates are universal, not company-bound

**Note:** When consultant clicks "Use This" on a template in client context, the send flow should:
- Only show teams from the current client company
- Send invitations with the client's company_id

---

### TAB 3: Sent by Me - CRITICAL REDESIGN NEEDED

**Purpose:** Show assessments/surveys the user has sent.

#### Own Company View (Portfolio Mode)

**Current Behavior:**
- Shows ALL invitations sent by consultant
- No grouping or filtering by company
- Cannot tell which company each survey belongs to

**Expected Behavior:**
- Show ALL invitations across ALL companies
- **GROUPED BY COMPANY** for clarity
- Show clear indicators of which company each batch belongs to

**Proposed UI Enhancement:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SENT BY ME (Portfolio View)                                             │
│ Showing assessments sent across all companies                           │
├─────────────────────────────────────────────────────────────────────────┤
│ Filter: [All Companies ▼] [All Types ▼]    View: [Grouped] [Individual] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ 🏢 Acme Corp (3 assessments)                              [View Company]│
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐  │
│ │ Team Assessment      │ │ Public Link          │ │ Team Assessment  │  │
│ │ Sales Team (5)       │ │ Q1 Performance       │ │ Marketing (3)    │  │
│ │ 2 Done | 3 Pending   │ │ 5 Responses          │ │ 0 Done | 3 Pend  │  │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────┘  │
│                                                                         │
│ 🏢 Beta Industries (2 assessments)                        [View Company]│
│ ┌──────────────────────┐ ┌──────────────────────┐                       │
│ │ Public Link          │ │ Team Assessment      │                       │
│ │ SSI Pulse            │ │ Engineering (8)      │                       │
│ │ 12 Responses         │ │ 4 Done | 4 Pending   │                       │
│ └──────────────────────┘ └──────────────────────┘                       │
│                                                                         │
│ 🏢 My Consulting Firm (1 assessment)                      [View Company]│
│ ┌──────────────────────┐                                                │
│ │ Team Assessment      │                                                │
│ │ Internal Team (2)    │                                                │
│ │ 1 Done | 1 Pending   │                                                │
│ └──────────────────────┘                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key Data Points to Show (Portfolio Mode):**
- Company name as group header
- Number of assessments per company
- Quick stats per assessment batch
- "View Company" button to switch to that company's context

#### Client Company View (Business Owner Mode)

**Current Behavior:**
- Should show only invitations for that company
- Currently may show all invitations (bug)

**Expected Behavior:**
- Filter by `company_id` from current context
- Same UI as current, but filtered
- Should NOT show surveys sent to other companies

**API Change Needed:**
- `/api/invitations/sent-by-me` should respect `req.user.company_id` when available
- Currently only filters if explicit `?company_id=` param is passed

---

### TAB 4: Team Results

**Purpose:** Show assessment results for team members.

| Context | Current Behavior | Expected Behavior | Changes Needed |
|---------|-----------------|-------------------|----------------|
| Own Company | Hidden for consultants | Correct (use My Clients instead) | None |
| Client Company | Now visible (after our fix) | Show client company's team results | Verify API uses company_id context |

**Issues Identified:**
- Our recent fix should have addressed tab visibility
- Need to verify the API endpoint uses the correct company context

---

### TAB 5: My Clients

**Purpose:** Portfolio view of all managed client companies.

| Context | Current Behavior | Expected Behavior | Changes Needed |
|---------|-----------------|-------------------|----------------|
| Own Company | Visible, shows client list | Correct | None |
| Client Company | Now hidden (after our fix) | Correct | None |

**Issues Identified:**
- None - this works correctly after our recent changes

---

## Summary of Required Changes

### Backend Changes

1. **`/api/invitations/sent-by-me`** (PRIORITY HIGH)
   - Include `company_id` in batch response ✅ DONE
   - When consultant is in client context, filter by company_id
   - Add optional `?group_by=company` parameter for portfolio view

2. **`/api/assessments/company-results`**
   - Verify it uses `req.user.company_id` from authGuards (supports consultant switching)

3. **`/api/assessments/kpi-summary`**
   - Should return KPIs for current company context
   - Consultant in client view should see client's KPIs, not aggregated

### Frontend Changes

1. **Sent by Me Tab - Portfolio View Enhancement**
   - Add company grouping when consultant is in own company context
   - Add company filter dropdown
   - Show company name on each card/batch
   - Add "View Company" quick action

2. **Sent by Me Tab - Client View Filter**
   - When `isConsultantViewingClient`, filter sent data by current company
   - Or call API with `?company_id=` parameter

3. **KPI Row Enhancement**
   - When in portfolio mode, could show aggregate KPIs
   - When in client mode, show client-specific KPIs

4. **UI Polish**
   - Add visual indicator of current context in page header
   - ✅ Already done - shows "Managing assessments for [Company Name]"

---

## API Filter Logic Matrix

| Endpoint | Own Company Mode | Client Company Mode |
|----------|------------------|---------------------|
| `/assigned-to-me` | User's personal invitations | Same (no change needed) |
| `/sent-by-me` | ALL sent by user | Filter by company_id |
| `/company-results` | Consultant's company | Client company |
| `/kpi-summary` | Aggregate? or own company | Client company |
| `/templates` | All accessible templates | Same |

---

## Implementation Priority

### Phase 1 (Immediate - Fix Current Issues)
1. ✅ Fix company_id missing in sent-by-me response
2. ✅ Fix tab visibility for consultant in client context
3. Filter Sent by Me data when in client context

### Phase 2 (Enhancement - Portfolio View)
1. Add company grouping to Sent by Me in portfolio mode
2. Add company filter dropdown
3. Add company name badge on each card

### Phase 3 (Polish)
1. Aggregate KPIs for portfolio mode
2. Quick "View Company" actions from cards

---

## Testing Scenarios

### Scenario 1: Consultant at Own Company
1. Login as consultant
2. Stay at own company (no company switch)
3. Go to Assessment Hub
4. Verify:
   - "My Clients" tab visible
   - "Team Results" tab hidden
   - "Sent by Me" shows ALL sent assessments
   - KPIs reflect consultant's company data

### Scenario 2: Consultant Switches to Client Company
1. Login as consultant
2. Use company switcher to select a client company
3. Go to Assessment Hub
4. Verify:
   - Purple context banner shows "Viewing as: [Client Name]"
   - Header shows "Managing assessments for [Client Name]"
   - "My Clients" tab hidden
   - "Team Results" tab visible
   - "Sent by Me" shows ONLY assessments for that client company
   - KPIs reflect client company data
   - "View Results" on public links works (company_id populated)

### Scenario 3: Consultant Creates Assessment in Client Context
1. In client company context
2. Go to Templates tab
3. Click "Use This" on a template
4. Verify:
   - Only client company's teams are shown
   - Invitations created have client's company_id
