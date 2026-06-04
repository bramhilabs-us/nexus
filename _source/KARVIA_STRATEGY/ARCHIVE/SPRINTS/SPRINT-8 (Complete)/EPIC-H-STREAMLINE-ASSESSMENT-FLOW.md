# Epic H: Streamline Assessment Creation Flow

**Epic ID:** EPIC-H
**Sprint:** 8
**Priority:** P0
**Total Story Points:** 30
**Created:** December 11, 2025

---

## Executive Summary

Streamline the 3-step assessment creation flow to reduce cognitive load and improve UX by:
1. **Step 1**: Show only selected template + inline team selection (no manual email input)
2. **Step 2**: Left-right layout for question customization (categories left, questions right)
3. **Step 3**: Cart-style checkout with recipient management before launch

---

## Codebase Audit & Reuse Analysis

### Existing Components (MUST REUSE)

| Component | Location | Lines | Reuse In |
|-----------|----------|-------|----------|
| Team Selection Modal | `assessment-hub.html` | 257-335 | Step 1 (inline, not modal) |
| Team Selection JS Functions | `assessment-hub.html` | 846-1077 | Step 1 |
| Company Modal Form | `assessment-hub.html` | 143-255 | Step 1 (consultant only) |
| Template Card Design | `assessment-hub.html` | 586-621 | Step 1 (single template) |
| Question Breakdown Stats | `assessment-step2-customize.html` | 65-86 | Step 1 |
| Category Tabs UI | `assessment-step2-customize.html` | 109-134 | Step 2 (convert to tree) |
| Question Toggle Logic | `assessment-step2-customize.html` | 391-398 | Step 2 |
| Add Questions Modal | `assessment-step2-customize.html` | 149-182 | Step 2 |
| Template Summary Card | `assessment-review-launch.html` | 35-72 | Step 3 |
| Step Pills CSS | `assessment-creation-flow.html` | 14-16 | All Steps |
| Draft Management | `assessment-flow.js` | 1-70 | All Steps |

### Existing API Clients (NO CHANGES NEEDED)

| API Client | File | Methods Used |
|------------|------|--------------|
| TeamAPI | `team-api-client.js` | `getTeams()`, `getTeamDetails()` |
| AssessmentAPI | `assessment-api-client.js` | `getTemplateQuestions()`, `createInvitations()` |
| AssessmentFlowManager | `assessment-flow.js` | `loadDraft()`, `saveDraft()`, `createInvitations()` |

### CSS Patterns (REUSE)

```css
/* From assessment-hub.html */
.karvia-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

/* From assessment-creation-flow.html */
.step-pill { border-radius: 999px; padding: 0.55rem 1.1rem; font-size: 0.8rem; font-weight: 600; }
.step-pill.active { background: linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%); color: #fff; }
.step-pill.completed { background: #10b981; color: white; }
.step-pill.inactive { background: #ede9fe; color: #4c1d95; }

/* From assessment-step2-customize.html */
.question-item { border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.85rem 1rem; }
.question-item:hover { border-color: #c7d2fe; background: #f5f3ff; }
```

---

## Detailed Design Specifications

### Step 1: Template & Audience (REDESIGN)

**File:** `client/pages/assessment-creation-flow.html`

#### Current State (Lines to REMOVE)

```
Lines 51-63:   Template grid container (all templates) → REMOVE
Lines 66-106:  Add Recipients section (manual/bulk email) → REMOVE
Lines 123-143: Invitation method radio buttons → REMOVE
Lines 270-294: addRecipient() function → REMOVE
Lines 296-323: addBulkRecipients() function → REMOVE
```

#### New Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 1 · Template & Audience                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ LEFT COLUMN (40%) ───────────┐  ┌─ RIGHT COLUMN (60%) ──────────┐  │
│  │                               │  │                                │  │
│  │  SELECTED TEMPLATE            │  │  SEND TO:                      │  │
│  │  ┌─────────────────────────┐  │  │  ○ My Teams  ● New Company     │  │
│  │  │ [Template Icon]         │  │  │                                │  │
│  │  │ Wellness Business       │  │  │  ────────────────────────────  │  │
│  │  │ Health Assessment       │  │  │                                │  │
│  │  │                         │  │  │  TEAM SELECTION (if My Teams)  │  │
│  │  │ 50 Questions            │  │  │  [Reuse from hub modal]        │  │
│  │  │ ~15 min                 │  │  │  ☐ Engineering (12 members)    │  │
│  │  └─────────────────────────┘  │  │  ☐ Sales (8 members)           │  │
│  │                               │  │  ☑ Test (1 member)             │  │
│  │  QUESTION BREAKDOWN           │  │                                │  │
│  │  ┌──────────┬─────────────┐  │  │  ────────────────────────────  │  │
│  │  │ Speed    │ 16          │  │  │  Selected: 1 team (1 person)   │  │
│  │  │ Strength │ 17          │  │  │                                │  │
│  │  │ Intel.   │ 17          │  │  │  ────────────────────────────  │  │
│  │  │ Total    │ 50          │  │  │                                │  │
│  │  └──────────┴─────────────┘  │  │  COMPANY FORM (if New Company) │  │
│  │                               │  │  [Reuse from hub modal]        │  │
│  │  [Change Template]            │  │  Company Name: [__________]    │  │
│  │                               │  │  Contact Name: [__________]    │  │
│  └───────────────────────────────┘  │  Email (opt):  [__________]    │  │
│                                     │                                │  │
│                                     └────────────────────────────────┘  │
│                                                                         │
│  [← Back to Hub]                          [Next: Customize Questions →] │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Code Reuse Map

| New Element | Source | Source Lines |
|-------------|--------|--------------|
| Template card with stats | `assessment-hub.html` renderTemplates() | 586-610 |
| Question breakdown table | `assessment-step2-customize.html` | 65-86 |
| Team list with checkboxes | `assessment-hub.html` renderTeamsList() | 904-932 |
| Team selection summary | `assessment-hub.html` updateTeamsSelectionSummary() | 958-973 |
| Company form fields | `assessment-hub.html` sendToCompanyModal | 161-235 |
| Select All/Clear buttons | `assessment-hub.html` | 291-294 |

#### JavaScript Functions to MOVE (from hub to Step 1)

```javascript
// FROM assessment-hub.html (lines 877-973) → MOVE TO assessment-creation-flow.html

async function loadTeamsForSharing() { ... }      // Line 877-901
function renderTeamsList() { ... }                // Line 904-932
function toggleTeamSelection(teamId) { ... }      // Line 936-946
function selectAllTeams() { ... }                 // Line 948-951
function deselectAllTeams() { ... }               // Line 953-956
function updateTeamsSelectionSummary() { ... }    // Line 958-973
```

#### Validation Rules (Step 1)

```javascript
function validateStep1() {
    const sendTo = document.querySelector('input[name="sendTo"]:checked').value;

    if (sendTo === 'teams') {
        // Must have at least 1 team selected with members
        return selectedTeams.length > 0 && getTotalRecipients() > 0;
    } else if (sendTo === 'company') {
        // Only CONSULTANT can see this option
        const companyName = document.getElementById('companyName').value.trim();
        const contactName = document.getElementById('contactName').value.trim();
        return companyName && contactName;
    }
    return false;
}
```

#### Role-Based UI Logic

```javascript
// Show "New Company" option only for CONSULTANT role
const user = JSON.parse(localStorage.getItem('karvia_user'));
const isConsultant = user.role === 'CONSULTANT';

if (!isConsultant) {
    // Hide the toggle, default to "My Teams" only
    document.getElementById('sendToToggle').classList.add('hidden');
}
```

---

### Step 2: Customize Questions (REDESIGN)

**File:** `client/pages/assessment-step2-customize.html`

#### Current State (Lines to MODIFY)

```
Lines 65-86:   Stats cards (Total/Speed/Strength/Intelligence) → MOVE TO STEP 1
Lines 109-113: Category tabs (horizontal buttons) → CONVERT TO VERTICAL TREE
Lines 116-134: Category panels → CONVERT TO SINGLE RIGHT PANEL
```

#### New Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 2 · Customize Questions                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ LEFT SIDEBAR (25%) ─────────┐  ┌─ RIGHT MAIN AREA (75%) ─────────┐ │
│  │                              │  │                                  │ │
│  │  🔍 Search questions         │  │  SPEED › Execution Velocity      │ │
│  │  [________________]          │  │  ─────────────────────────────── │ │
│  │                              │  │                                  │ │
│  │  ▼ Speed (16)                │  │  ☑ How quickly does your team   │ │
│  │    ├─ Execution (5) ●        │  │    respond to market changes?   │ │
│  │    ├─ Adaptability (4)       │  │                                  │ │
│  │    ├─ Change Mgmt (4)        │  │  ☑ Rate your organization's     │ │
│  │    └─ Innovation (3)         │  │    ability to pivot strategies  │ │
│  │                              │  │                                  │ │
│  │  ▷ Strength (17)             │  │  ☑ When priorities shift, how   │ │
│  │    ├─ Resilience (6)         │  │    well does your team adapt?   │ │
│  │    ├─ Resources (5)          │  │                                  │ │
│  │    └─ Stability (6)          │  │  ☐ [Unchecked question grayed]  │ │
│  │                              │  │                                  │ │
│  │  ▷ Intelligence (17)         │  │  ─────────────────────────────── │ │
│  │                              │  │                                  │ │
│  │  ─────────────────────       │  │  [+ Add Questions]               │ │
│  │  Selected: 50 questions      │  │  (Shows only unselected)         │ │
│  │                              │  │                                  │ │
│  └──────────────────────────────┘  └──────────────────────────────────┘ │
│                                                                         │
│  [← Back]                                    [Next: Review & Launch →]  │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Code Reuse Map

| New Element | Source | Source Lines |
|-------------|--------|--------------|
| Question item with checkbox | `assessment-step2-customize.html` | 369-379 |
| toggleQuestion() function | `assessment-step2-customize.html` | 391-398 |
| Add Questions Modal | `assessment-step2-customize.html` | 149-182 |
| renderModalQuestions() | `assessment-step2-customize.html` | 423-441 |
| Question search filter | `assessment-step2-customize.html` | 482-490 |

#### Category Tree Data Structure

```javascript
// Transform existing data to tree structure
function buildCategoryTree(questions) {
    const tree = {
        speed: { label: 'Speed', count: 0, subcategories: {} },
        strength: { label: 'Strength', count: 0, subcategories: {} },
        intelligence: { label: 'Intelligence', count: 0, subcategories: {} }
    };

    questions.forEach(q => {
        const dim = q.dimension;
        const subcat = q.sub_category || 'general';

        if (!tree[dim].subcategories[subcat]) {
            tree[dim].subcategories[subcat] = { label: formatCategoryName(subcat), questions: [] };
        }

        tree[dim].subcategories[subcat].questions.push(q);
        tree[dim].count++;
    });

    return tree;
}
```

---

### Step 3: Review & Launch (ENHANCE)

**File:** `client/pages/assessment-review-launch.html`

#### Current State (Lines to MODIFY)

```
Lines 52-61:   Recipients list (static display) → CONVERT TO CART WITH CHECKBOXES
Lines 64-71:   Delivery method section → REMOVE (no email for teams)
```

#### New Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 3 · Review & Launch                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📋 ASSESSMENT SUMMARY                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Template: Wellness Business Health Assessment                  │   │
│  │                                                                 │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┐                 │   │
│  │  │ Speed    │ Strength │ Intel.   │ Total    │                 │   │
│  │  │ 16 ques. │ 17 ques. │ 17 ques. │ 50 ques. │                 │   │
│  │  └──────────┴──────────┴──────────┴──────────┘                 │   │
│  │                                                                 │   │
│  │  ⏱ Estimated completion time: ~15 minutes                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  👥 RECIPIENTS (3 selected)                           [Edit Teams]     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ☑ John Smith (Employee)                              [×]       │   │
│  │  ☐ Jane Doe (Manager) ← unchecked = won't receive              │   │
│  │  ☑ Bob Wilson (Employee)                              [×]       │   │
│  │  ────────────────────────────────────────────────────────────   │   │
│  │  Total: 2 recipients will receive this assessment               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [← Edit Questions]                              [🚀 Launch Assessment] │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Code Reuse Map

| New Element | Source | Source Lines |
|-------------|--------|--------------|
| Template summary | `assessment-review-launch.html` | 35-43 |
| Question breakdown grid | `assessment-review-launch.html` | 216-220 |
| Recipient list iteration | `assessment-review-launch.html` | 237-242 |
| Launch function | `assessment-review-launch.html` | 264-312 |
| Success modal | `assessment-review-launch.html` | 84-134 |

#### Cart Functionality (New)

```javascript
// Recipients cart state
let recipientCart = []; // Array of { userId, name, role, email, included: true/false }

function renderRecipientsCart() {
    const container = document.getElementById('recipients-cart');
    const includedCount = recipientCart.filter(r => r.included).length;

    container.innerHTML = recipientCart.map(r => `
        <div class="flex items-center justify-between py-2 border-b border-gray-100">
            <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox"
                       ${r.included ? 'checked' : ''}
                       onchange="toggleRecipient('${r.userId}')"
                       class="rounded border-gray-300 text-purple-600">
                <span class="${r.included ? 'text-gray-900' : 'text-gray-400'}">${r.name}</span>
                <span class="text-xs px-2 py-1 ${r.included ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'} rounded-full">${r.role}</span>
            </label>
            <button onclick="removeRecipient('${r.userId}')" class="text-gray-400 hover:text-red-500">
                <svg class="w-4 h-4">...</svg>
            </button>
        </div>
    `).join('');

    document.getElementById('recipient-count').textContent = includedCount;
}

function toggleRecipient(userId) {
    const recipient = recipientCart.find(r => r.userId === userId);
    if (recipient) {
        recipient.included = !recipient.included;
        renderRecipientsCart();
        updateLaunchButton();
    }
}
```

#### Edit Teams Modal (Inline)

```javascript
// Reuse team selection from Step 1
function openEditTeamsModal() {
    document.getElementById('editTeamsModal').classList.remove('hidden');
    // Populate with currently selected teams
    renderTeamsList();
}

function applyTeamChanges() {
    // Recalculate recipients based on new team selection
    recalculateRecipients();
    closeEditTeamsModal();
}
```

---

## Draft Data Structure Updates

**File:** `client/js/assessment-flow.js`

### Current Draft Structure (Lines 31-54)

```javascript
// CURRENT
{
    templateId: null,
    templateName: null,
    audienceType: 'cohorts',      // Keep for compatibility
    selectedCohorts: [],          // Keep for compatibility
    manualEmails: [],             // DEPRECATE - not used in new flow
    manualRoles: [],              // DEPRECATE - not used in new flow
    invitationMethod: 'email',    // DEPRECATE - no email option for teams
    customMessage: '',
    expiresInDays: 14,
    dimensions: { ... },
    thresholds: { ... }
}
```

### Updated Draft Structure

```javascript
// UPDATED - Add new fields, keep old for backward compatibility
{
    templateId: null,
    templateName: null,

    // NEW: Step 1 data
    sendTo: 'teams',              // 'teams' or 'company'
    selectedTeamIds: [],          // Array of team IDs
    selectedRecipients: [],       // Array of { userId, name, role, email, teamId }

    // NEW: Company data (for consultants)
    companyData: {
        companyName: '',
        contactName: '',
        contactEmail: '',         // Optional
        industry: '',
        size: null
    },

    // Step 2 data (unchanged)
    customizedQuestionIds: [],

    // Step 3 data
    recipientCart: [],            // Final recipients with included flag

    // DEPRECATED (keep for backward compatibility)
    audienceType: 'cohorts',
    selectedCohorts: [],
    manualEmails: [],
    manualRoles: [],
    invitationMethod: 'email',

    // Existing
    customMessage: '',
    expiresInDays: 14,
    dimensions: { ... },
    thresholds: { ... }
}
```

---

## User Stories

### H1: Redesign Step 1 Layout (5 pts)

**As a** Manager/Business Owner
**I want** to see the selected template and select teams inline
**So that** I can quickly set up an assessment without switching pages

**Acceptance Criteria:**
- [ ] Left column shows selected template card with question breakdown
- [ ] Right column shows inline team selection (not modal)
- [ ] Template card matches design from hub (reuse code)
- [ ] Question breakdown table shows Speed/Strength/Intelligence counts
- [ ] "Change Template" link returns to hub

**Files Modified:**
- `client/pages/assessment-creation-flow.html` (complete rewrite)

**Code Reuse:**
- Template card HTML from `assessment-hub.html:586-610`
- Stats table from `assessment-step2-customize.html:65-86`

---

### H2: Add Inline Team Selection (3 pts)

**As a** Manager/Business Owner
**I want** to select teams directly on Step 1
**So that** I don't need to open a modal

**Acceptance Criteria:**
- [ ] Team list displays inline (not in modal)
- [ ] Checkboxes work for multi-select
- [ ] "Select All" / "Clear" buttons work
- [ ] Shows team member count
- [ ] Updates "Total Recipients" summary in real-time

**Files Modified:**
- `client/pages/assessment-creation-flow.html`

**Code Reuse:**
- `renderTeamsList()` from `assessment-hub.html:904-932`
- `toggleTeamSelection()` from `assessment-hub.html:936-946`
- `updateTeamsSelectionSummary()` from `assessment-hub.html:958-973`

---

### H3: Add Send-To Toggle (Consultant Only) (3 pts)

**As a** Consultant
**I want** to choose between sending to my teams or a new company
**So that** I can onboard new clients

**Acceptance Criteria:**
- [ ] Toggle shows "My Teams" / "New Company" options
- [ ] Only CONSULTANT role sees the toggle
- [ ] Non-consultants default to "My Teams" only
- [ ] Toggling shows/hides appropriate form section
- [ ] Company form fields: Company Name*, Contact Name*, Email (optional)

**Files Modified:**
- `client/pages/assessment-creation-flow.html`

**Code Reuse:**
- Company form fields from `assessment-hub.html:161-235`
- Role check pattern from `assessment-hub.html:350-351`

---

### H4: Redesign Step 2 Left-Right Layout (5 pts)

**As a** Manager
**I want** to see categories on the left and questions on the right
**So that** I can easily navigate and customize questions

**Acceptance Criteria:**
- [ ] Left sidebar (25% width) shows category tree
- [ ] Categories are collapsible with sub-categories
- [ ] Clicking sub-category shows questions on right
- [ ] Selected count shows at bottom of sidebar
- [ ] Search box filters questions
- [ ] Right area (75% width) shows questions with checkboxes

**Files Modified:**
- `client/pages/assessment-step2-customize.html`

**Code Reuse:**
- Question item HTML from `assessment-step2-customize.html:369-379`
- `toggleQuestion()` from `assessment-step2-customize.html:391-398`
- Search functionality from `assessment-step2-customize.html:482-490`

---

### H5: Update Add Questions Modal (2 pts)

**As a** Manager
**I want** the Add Questions modal to show only unselected questions
**So that** I don't see duplicates

**Acceptance Criteria:**
- [ ] Modal filters out already-selected questions
- [ ] Questions grouped by dimension
- [ ] Can select multiple and add at once
- [ ] Count updates after adding

**Files Modified:**
- `client/pages/assessment-step2-customize.html`

**Code Reuse:**
- Modal HTML from `assessment-step2-customize.html:149-182`
- `renderModalQuestions()` from `assessment-step2-customize.html:423-441`

---

### H6: Redesign Step 3 as Cart Checkout (5 pts)

**As a** Manager
**I want** to see recipients as a cart I can edit before launch
**So that** I can exclude specific people if needed

**Acceptance Criteria:**
- [ ] Shows assessment summary (template, question counts, time)
- [ ] Recipients shown as list with checkboxes
- [ ] Can uncheck to exclude from receiving assessment
- [ ] Shows "X recipients will receive" count
- [ ] Remove button (×) removes from cart entirely

**Files Modified:**
- `client/pages/assessment-review-launch.html`

**Code Reuse:**
- Summary card from `assessment-review-launch.html:35-43`
- Question breakdown from `assessment-review-launch.html:216-220`

---

### H7: Add Edit Teams Inline Modal (3 pts)

**As a** Manager
**I want** to edit team selection from Step 3
**So that** I can make last-minute changes without going back

**Acceptance Criteria:**
- [ ] "Edit Teams" link opens inline modal
- [ ] Modal shows team selection (same as Step 1)
- [ ] Apply changes updates recipient cart
- [ ] Cancel discards changes

**Files Modified:**
- `client/pages/assessment-review-launch.html`

**Code Reuse:**
- Team selection HTML from `assessment-hub.html:287-311`
- Team selection functions from Step 1 (H2)

---

### H8: Remove Email Delivery Option (2 pts)

**As a** system
**I want** to remove email delivery toggle
**So that** the flow is simpler (teams get in-app notification)

**Acceptance Criteria:**
- [ ] Remove "Send email invitations" / "In-app only" toggle
- [ ] Default to in-app notification for team members
- [ ] Email only sent if user doesn't have account (company flow)

**Files Modified:**
- `client/pages/assessment-review-launch.html`
- `client/pages/assessment-creation-flow.html`

---

### H9: Update Step Navigation Pills (1 pts)

**As a** user
**I want** step pills to accurately reflect the new flow
**So that** I understand where I am

**Acceptance Criteria:**
- [ ] Step 1: "Template & Audience"
- [ ] Step 2: "Customize Questions"
- [ ] Step 3: "Review & Launch"
- [ ] Completed steps show green checkmark
- [ ] Current step is highlighted

**Files Modified:**
- All three step pages

**Code Reuse:**
- Step pill CSS from `assessment-creation-flow.html:14-16`

---

### H10: Remove Old Recipients Section (1 pts)

**As a** developer
**I want** to clean up deprecated code
**So that** the codebase is maintainable

**Acceptance Criteria:**
- [ ] Remove "Add Recipients" HTML section
- [ ] Remove `addRecipient()` function
- [ ] Remove `addBulkRecipients()` function
- [ ] Remove `renderRecipients()` function
- [ ] Keep draft structure backward compatible

**Files Modified:**
- `client/pages/assessment-creation-flow.html`

---

## Implementation Order

```
Phase 1: Step 1 Redesign (H1, H2, H3, H10)
├── H10: Remove old recipients section (cleanup first)
├── H1: Redesign Step 1 layout
├── H2: Add inline team selection
└── H3: Add send-to toggle

Phase 2: Step 2 Redesign (H4, H5)
├── H4: Left-right layout
└── H5: Update Add Questions modal

Phase 3: Step 3 Redesign (H6, H7, H8)
├── H6: Cart checkout experience
├── H7: Edit teams modal
└── H8: Remove email option

Phase 4: Polish (H9)
└── H9: Update navigation pills
```

---

## Testing Checklist

### Functional Tests

- [ ] Template loads correctly from hub selection
- [ ] Team list populates from API
- [ ] Team selection persists in draft
- [ ] Question customization works
- [ ] Add Questions shows only unselected
- [ ] Recipients cart allows include/exclude
- [ ] Edit Teams modal updates cart
- [ ] Launch creates invitations successfully
- [ ] Consultant sees company option
- [ ] Non-consultant doesn't see company option

### Edge Cases

- [ ] No teams exist → Shows "Create teams first" message
- [ ] Team has 0 members → Shows warning, can't select
- [ ] All questions deselected → Can't proceed
- [ ] All recipients unchecked → Can't launch
- [ ] Template not found → Redirect to hub with error

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile responsive

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Draft data migration | Medium | Keep old fields for backward compatibility |
| Team API failure | High | Add loading states and error handling (already exists) |
| Large team (100+ members) | Medium | Add pagination or virtual scroll |
| Consultant role detection | Low | Use existing role check pattern |

---

## Definition of Done

- [ ] All 10 user stories complete
- [ ] Code reuses existing components (no new UI patterns)
- [ ] Draft structure updated with backward compatibility
- [ ] All tests pass
- [ ] No console errors
- [ ] Works on mobile (responsive)
- [ ] Documentation updated (this file)
