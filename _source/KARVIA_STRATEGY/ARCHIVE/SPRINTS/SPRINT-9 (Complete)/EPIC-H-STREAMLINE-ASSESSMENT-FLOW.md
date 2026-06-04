# Epic H: Streamline Assessment Creation Flow

**Epic ID:** EPIC-H
**Sprint:** 9
**Priority:** P0
**Total Story Points:** 42
**Created:** December 11, 2025
**Updated:** December 16, 2025 (Post-Audit Revision)

---

## Executive Summary

Streamline the 3-step assessment creation flow to reduce cognitive load and improve UX by:
1. **Step 1**: Show only selected template + three distribution options (Teams / Email / Link)
2. **Step 2**: Left-right layout for question customization (collapsible categories left, questions right)
3. **Step 3**: Cart-style checkout with recipient management before launch

**Three Distribution Methods:**
- **Teams**: Select from existing teams → in-app notification
- **Email**: Enter emails manually → email invitation (+ optional "New Company" for consultants)
- **Secure Link**: Generate shareable URL → anyone can take survey

---

## Codebase Audit Results

### Critical Finding: Reuse Existing Models

**DO NOT CREATE** a new `SurveyLink` model. The existing `Invitation` model already has:

| Field | Purpose | Status |
|-------|---------|--------|
| `invitation_token` | Unique token for links | ✅ Exists |
| `invitation_url` | Generated URL | ✅ Exists |
| `expires_at` | Expiration date | ✅ Exists |
| `status` | Tracking (pending/sent/opened/completed) | ✅ Exists |
| `analytics` | Time tracking, device info | ✅ Exists |
| `context.team_id` | Team association | ✅ Exists |
| `generateToken()` | Static method | ✅ Exists |
| `generateInvitationURL()` | Static method | ✅ Exists |

**Add these 3 fields to Invitation model:**
```javascript
is_public_link: { type: Boolean, default: false },
response_limit: { type: Number, default: null },
link_stats: { views: Number, unique_views: Number, responses_count: Number }
```

### Critical Finding: Reuse Existing Endpoints

| Endpoint | Purpose | Action |
|----------|---------|--------|
| `POST /api/invitations/create` | Create invitations | EXTEND (add is_public_link, team_ids) |
| `POST /api/invitations/create-company-invitation` | New company flow | REUSE AS-IS (this IS "New Company" checkbox) |
| `GET /api/invitations/sent-by-me` | List sent invitations | ENHANCE (add stats aggregation) |

### Warning: Assessment Model Change

Current `user_id` is required. For anonymous responses:
```javascript
// Change user_id to optional
user_id: { type: ObjectId, ref: 'User', required: false }

// Add anonymous_respondent subdocument
anonymous_respondent: {
  name: String,       // Required for anonymous
  email: String,      // Optional
  role: String,       // Required
  department: String  // Optional
}
```

### Code Reuse Matrix

| Component | Source File | Lines | Reuse Type |
|-----------|-------------|-------|------------|
| Team Selection Modal | `assessment-hub.html` | 257-335 | Extract to shared module |
| Team Selection JS | `assessment-hub.html` | 846-1077 | Extract to shared module |
| Company Modal Form | `assessment-hub.html` | 143-255 | Reuse for "New Company" |
| Template Card Design | `assessment-hub.html` | 586-621 | Reuse for Step 1 |
| Question Breakdown Stats | `assessment-step2-customize.html` | 65-86 | Move to Step 1 |
| Category Tabs UI | `assessment-step2-customize.html` | 109-134 | Convert to tree |
| Question Toggle Logic | `assessment-step2-customize.html` | 391-398 | Reuse |
| Add Questions Modal | `assessment-step2-customize.html` | 149-182 | Reuse |
| Template Summary Card | `assessment-review-launch.html` | 35-72 | Reuse |
| Draft Management | `assessment-flow.js` | 1-70 | Extend |

---

## Step 1: Template & Audience (REDESIGN)

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 1 · Template & Audience                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ LEFT COLUMN (40%) ───────────┐  ┌─ RIGHT COLUMN (60%) ──────────┐  │
│  │                               │  │                                │  │
│  │  SELECTED TEMPLATE            │  │  SEND TO:                      │  │
│  │  ┌─────────────────────────┐  │  │  ┌────────┐┌────────┐┌──────┐  │  │
│  │  │ [Template Icon]         │  │  │  │👥Teams ││📧Email ││🔗Link│  │  │
│  │  │ Wellness Business       │  │  │  └────────┘└────────┘└──────┘  │  │
│  │  │ Health Assessment       │  │  │                                │  │
│  │  │ 50 Questions ~15 min    │  │  │  ─────────────────────────     │  │
│  │  └─────────────────────────┘  │  │                                │  │
│  │                               │  │  [Content changes based on     │  │
│  │  QUESTION BREAKDOWN           │  │   selected option - see below] │  │
│  │  ┌──────────┬─────────────┐  │  │                                │  │
│  │  │ Speed    │ 16          │  │  │                                │  │
│  │  │ Strength │ 17          │  │  │                                │  │
│  │  │ Intel.   │ 17          │  │  │                                │  │
│  │  │ Total    │ 50          │  │  │                                │  │
│  │  └──────────┴─────────────┘  │  │                                │  │
│  │                               │  │                                │  │
│  │  [← Change Template]          │  │                                │  │
│  └───────────────────────────────┘  └────────────────────────────────┘  │
│                                                                         │
│  [← Back to Hub]                          [Next: Customize Questions →] │
└─────────────────────────────────────────────────────────────────────────┘
```

### Option A: Teams Selected

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Select teams to receive this assessment:                               │
│                                                                         │
│  [Select All] [Clear]                                                   │
│                                                                         │
│  ☐ Engineering (12 members)                                             │
│  ☑ Sales (8 members)                                                    │
│  ☑ Marketing (5 members)                                                │
│  ☐ Customer Success (6 members)                                         │
│                                                                         │
│  ─────────────────────────────────────────────                          │
│  Selected: 2 teams (13 people) • Delivery: In-app notification          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Option B: Email Selected

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Enter email addresses (one per line or comma-separated):               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ john@client.com, jane@client.com                                  │  │
│  │ bob@example.com                                                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Default role: [Employee ▼]                                             │
│                                                                         │
│  ─────────────────────────────────────────────                          │
│  Recipients (3): john@client.com × jane@client.com × bob@example.com ×  │
│                                                                         │
│  ─────────────────────────────────────────────                          │
│  ☐ This is a new company (Consultant only - uses existing endpoint)     │
│     Company Name *  [_______________________________]                   │
│     Industry        [Select...                    ▼]                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Option C: Link Selected

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Generate a shareable link for this assessment:                         │
│                                                                         │
│  Link expires in: [7 days ▼]                                            │
│                   • 3 days                                              │
│                   • 7 days ← default                                    │
│                   • 14 days                                             │
│                   • 30 days                                             │
│                   • No expiration                                       │
│                                                                         │
│  Response limit: [Unlimited ▼]                                          │
│                  • Unlimited ← default                                  │
│                  • 10, 25, 50, 100, 250                                 │
│                  • Custom...                                            │
│                                                                         │
│  ─────────────────────────────────────────────                          │
│  Anyone with this link can take the survey.                             │
│  Responses will be tied to your company for SSI analysis.               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 2: Customize Questions (REDESIGN)

### Layout

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

Categories are COLLAPSIBLE by default (click to expand)
```

---

## Step 3: Review & Launch (THREE VARIANTS)

### Variant A: Teams Selected

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Step 3 · Review & Launch                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📋 ASSESSMENT SUMMARY                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Template: Wellness Business Health Assessment                  │   │
│  │  Speed: 16 | Strength: 17 | Intelligence: 17 | Total: 50 ques. │   │
│  │  ⏱ Estimated completion time: ~15 minutes                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  👥 RECIPIENTS (13 selected)                           [Edit Teams]     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ☑ John Smith (Employee) - Sales                          [×]   │   │
│  │  ☑ Jane Doe (Manager) - Sales                             [×]   │   │
│  │  ☐ Bob Wilson (Employee) - Marketing  ← unchecked = won't get   │   │
│  │  ... (scrollable list)                                          │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  Total: 11 recipients will receive this assessment              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  Delivery: In-app notification                                          │
│                                                                         │
│  [← Edit Questions]                              [🚀 Launch Assessment] │
└─────────────────────────────────────────────────────────────────────────┘

[Edit Teams] → Opens inline modal with team selection (Apply button)
[×] Remove → Shows confirmation dialog before removing
```

### Variant B: Email Selected

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📧 RECIPIENTS (5 emails)                          [Edit Recipients]    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ☑ john@client.com (Employee)                             [×]   │   │
│  │  ☑ jane@client.com (Manager)                              [×]   │   │
│  │  ☑ bob@client.com (Employee)                              [×]   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  Delivery: Email invitation                                             │
│                                                                         │
│  Custom message (optional):                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Please complete this assessment by Friday...                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [← Edit Questions]                            [🚀 Send Invitations]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Variant C: Secure Link Selected

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔗 SECURE LINK                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Your link will be generated after you click "Generate Link"    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Settings:                                                              │
│  • Expires: Dec 23, 2025 (7 days)                                      │
│  • Response limit: Unlimited                                            │
│  • Responses tied to: Acme Corp                                         │
│                                                                         │
│  [← Edit Questions]                               [🔗 Generate Link]    │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  After clicking "Generate Link":                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ✓ Link Generated!                                              │   │
│  │                                                                 │   │
│  │  https://karvia.app/s/abc123xyz              [📋 Copy] [QR]    │   │
│  │                                                                 │   │
│  │  Share this link with anyone you want to take the assessment.   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Anonymous Survey Start Page (Secure Link)

When someone opens a secure link:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      🏢 Acme Corp Assessment                            │
│                      Wellness Business Health                           │
│                      50 questions • ~15 minutes                         │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────    │
│                                                                         │
│  Before you begin, please tell us about yourself:                       │
│                                                                         │
│  Name *                                                                 │
│  [________________________________]                                     │
│                                                                         │
│  Email (optional - for receiving your results)                          │
│  [________________________________]                                     │
│                                                                         │
│  Role *                                                                 │
│  [Employee                    ▼]                                        │
│                                                                         │
│  Department/Team (optional)                                             │
│  [________________________________]                                     │
│                                                                         │
│                        [Start Assessment →]                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Survey Closed Page

When link is expired/deactivated/limit reached:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                              🔒                                         │
│                                                                         │
│                        Survey Closed                                    │
│                                                                         │
│           This survey is no longer accepting responses.                 │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────    │
│                                                                         │
│  Possible reasons:                                                      │
│  • The survey link has expired                                          │
│  • The maximum number of responses has been reached                     │
│  • The survey has been closed by the administrator                      │
│                                                                         │
│  ───────────────────────────────────────────────────────────────────    │
│                                                                         │
│  If you believe this is an error, please contact the person             │
│  who shared this survey link with you.                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## User Stories

### Phase 1: Backend + Shared Module (7 pts)

#### H11: Extend Invitation Model for Secure Links (2 pts)

**As a** system
**I want** the Invitation model to support public links
**So that** I don't create redundant models

**Technical Tasks:**
1. Add fields to `server/models/Invitation.js`:
```javascript
is_public_link: { type: Boolean, default: false },
response_limit: { type: Number, default: null },
link_stats: {
  views: { type: Number, default: 0 },
  unique_views: { type: Number, default: 0 },
  responses_count: { type: Number, default: 0 }
}
```

2. Add static method:
```javascript
invitationSchema.statics.createPublicLink = async function(data) {
  return this.create({
    ...data,
    is_public_link: true,
    recipient_email: `public-${Date.now()}@link.karvia.app`,
    status: 'sent'
  });
};
```

3. Extend `POST /api/invitations/create` to handle:
   - `is_public_link: true`
   - `response_limit: number`
   - `team_ids: ['id1', 'id2']` → auto-fetch team members

**Acceptance Criteria:**
- [ ] Invitation model has new fields
- [ ] Public link can be created via existing endpoint
- [ ] Backward compatible with existing invitations

---

#### H10: Anonymous Survey Support (3 pts)

**As a** anonymous user with a link
**I want** to take a survey without logging in
**So that** I can participate easily

**Technical Tasks:**
1. Modify `server/models/Assessment.js`:
```javascript
user_id: { type: ObjectId, ref: 'User', required: false },

anonymous_respondent: {
  name: { type: String },
  email: { type: String },
  role: { type: String, enum: ['EMPLOYEE', 'MANAGER', 'EXECUTIVE'] },
  department: { type: String },
  collected_at: { type: Date }
}
```

2. Add validation:
```javascript
assessmentSchema.pre('validate', function(next) {
  if (!this.user_id && !this.anonymous_respondent?.name) {
    next(new Error('Either user_id or anonymous_respondent.name required'));
  }
  next();
});
```

3. Create page: `client/pages/survey.html`
   - Validate link token
   - Show survey info form
   - On submit, start assessment

4. Create page: `client/pages/survey-closed.html`

**Acceptance Criteria:**
- [ ] Anonymous users can take surveys via link
- [ ] Name and role are collected before survey
- [ ] Responses tied to company_id
- [ ] Expired/deactivated links show "Survey Closed"

---

#### H13: Team Selection Shared Module (2 pts)

**As a** developer
**I want** team selection code in one place
**So that** I don't duplicate code

**Technical Tasks:**
1. Create `client/js/team-selection.js`:
```javascript
class TeamSelectionManager {
  constructor(containerId, options = {}) { ... }
  async loadTeams() { ... }
  renderTeamsList() { ... }
  toggleTeamSelection(teamId) { ... }
  selectAllTeams() { ... }
  deselectAllTeams() { ... }
  getSelectedTeams() { ... }
  getTotalRecipients() { ... }
}
```

2. Extract code from `assessment-hub.html` lines 877-973
3. Update `assessment-hub.html` to use new module
4. Add to `assessment-creation-flow.html`

**Acceptance Criteria:**
- [ ] Single source of truth for team selection
- [ ] Works in both assessment-hub and creation-flow
- [ ] No code duplication

---

### Phase 2: Step 1 Redesign (13 pts)

#### H1: Redesign Step 1 Layout (5 pts)

**As a** Manager/Business Owner
**I want** to see the selected template and choose distribution method
**So that** I can quickly set up an assessment

**Technical Tasks:**
1. Rewrite `client/pages/assessment-creation-flow.html`
2. Left column: Template card + question breakdown
3. Right column: Send-to toggle + content area
4. Remove old template grid (lines 51-63)
5. Remove old recipients section (lines 66-106)

**Code Reuse:**
- Template card from `assessment-hub.html:586-610`
- Stats table from `assessment-step2-customize.html:65-86`

**Acceptance Criteria:**
- [ ] Left-right layout
- [ ] Shows only selected template
- [ ] Question breakdown table
- [ ] "Change Template" returns to hub

---

#### H2: Teams Selection UI (3 pts)

**As a** Manager/Business Owner
**I want** to select teams inline
**So that** I don't need to open a modal

**Technical Tasks:**
1. Use TeamSelectionManager from H13
2. Show when "Teams" toggle selected
3. Display team list with checkboxes
4. Show "Select All" / "Clear" buttons
5. Update recipient count in real-time

**Acceptance Criteria:**
- [ ] Teams load from API
- [ ] Checkboxes work for multi-select
- [ ] Recipient count updates
- [ ] Cannot proceed without at least 1 team (if Teams selected)

---

#### H3: Three Send-To Options (5 pts)

**As a** user
**I want** to choose between Teams, Email, or Link
**So that** I have flexibility in distribution

**Technical Tasks:**
1. Create toggle: Teams / Email / Link
2. Teams: Use H2 team selection
3. Email: Simplified textarea + role selector
4. Link: Expiration + limit dropdowns
5. "New Company" checkbox (CONSULTANT only) → calls existing `create-company-invitation` endpoint

**Validation:**
- Teams: At least 1 team selected
- Email: At least 1 valid email
- Link: Always valid (just needs template)

**Acceptance Criteria:**
- [ ] Three-way toggle works
- [ ] Content changes based on selection
- [ ] "New Company" only for CONSULTANT
- [ ] Validation prevents empty submissions

---

### Phase 3: Step 2 Redesign (7 pts)

#### H4: Step 2 Left-Right Layout (5 pts)

**As a** Manager
**I want** categories on left and questions on right
**So that** I can easily navigate 50+ questions

**Technical Tasks:**
1. Rewrite `client/pages/assessment-step2-customize.html`
2. Left sidebar (25%): Collapsible category tree
3. Right area (75%): Questions with checkboxes
4. Click category → filter questions
5. Search box filters all questions

**Acceptance Criteria:**
- [ ] Categories collapsible by default
- [ ] Clicking subcategory shows questions
- [ ] Selected count at bottom
- [ ] Search works across all questions

---

#### H5: Add Questions Modal Update (2 pts)

**As a** Manager
**I want** to only see unselected questions in the modal
**So that** I don't add duplicates

**Technical Tasks:**
1. Filter modal to exclude already-selected questions
2. Group by dimension
3. Multi-select and add

**Acceptance Criteria:**
- [ ] Only unselected questions shown
- [ ] Can select multiple
- [ ] Count updates after adding

---

### Phase 4: Step 3 Redesign (11 pts)

#### H6: Step 3 Variants (6 pts)

**As a** user
**I want** Step 3 to match my distribution choice
**So that** I see relevant options

**Technical Tasks:**
1. Detect `sendTo` from draft
2. Teams: Show recipient cart with checkboxes
3. Email: Show email cart with custom message
4. Link: Show link generation UI

**Acceptance Criteria:**
- [ ] Three variants work correctly
- [ ] Cart allows include/exclude
- [ ] Link shows settings before generation
- [ ] Link displays after generation with copy button

---

#### H7: Edit Modal with Apply (3 pts)

**As a** user
**I want** to edit teams/recipients from Step 3
**So that** I don't have to go back to Step 1

**Technical Tasks:**
1. "Edit Teams" / "Edit Recipients" link
2. Opens inline modal
3. Apply button confirms changes
4. Cancel discards changes

**Acceptance Criteria:**
- [ ] Modal opens inline
- [ ] Apply updates cart
- [ ] Cancel preserves original

---

#### H8: Removal Confirmation (2 pts)

**As a** user
**I want** confirmation before removing someone
**So that** I don't accidentally remove people

**Technical Tasks:**
1. [×] button triggers confirmation dialog
2. "Remove John Smith from recipients?"
3. [Cancel] [Remove] buttons

**Acceptance Criteria:**
- [ ] Dialog appears on remove click
- [ ] Cancel keeps person in list
- [ ] Remove actually removes

---

### Phase 5: Tracking + Polish (4 pts)

#### H12: Sent by Me Tracking Enhancement (3 pts)

**As a** user
**I want** to see stats for my sent assessments
**So that** I know engagement levels

**Technical Tasks:**
1. Enhance `GET /api/invitations/sent-by-me`:
   - Group by template/link
   - Aggregate views, started, completed, rate
   - Filter by type (teams/email/link)

2. Update `assessment-hub.html` "Sent by Me" tab:
   - Stats cards for each sent item
   - Filter dropdown
   - "Deactivate Link" action for links

**Acceptance Criteria:**
- [ ] Stats show views/started/completed/rate
- [ ] Can filter by type
- [ ] Can deactivate links

---

#### H9: Navigation Pills Update (1 pt)

**As a** user
**I want** clear step indicators
**So that** I know where I am

**Technical Tasks:**
1. Step 1: "Template & Audience"
2. Step 2: "Customize Questions"
3. Step 3: "Review & Launch"
4. Completed steps show checkmark
5. Current step highlighted

**Acceptance Criteria:**
- [ ] Labels updated
- [ ] Visual states correct

---

## Implementation Order

```
Phase 1: Backend + Shared Module (7 pts)
├── H11: Extend Invitation model (2 pts)
├── H10: Anonymous survey support (3 pts)
└── H13: Team selection module (2 pts)

Phase 2: Step 1 Redesign (13 pts)
├── H1: Layout redesign (5 pts)
├── H2: Teams selection (3 pts)
└── H3: Three send-to options (5 pts)

Phase 3: Step 2 Redesign (7 pts)
├── H4: Left-right layout (5 pts)
└── H5: Add Questions modal (2 pts)

Phase 4: Step 3 Redesign (11 pts)
├── H6: Step 3 variants (6 pts)
├── H7: Edit modal (3 pts)
└── H8: Removal confirmation (2 pts)

Phase 5: Tracking + Polish (4 pts)
├── H12: Sent by Me enhancement (3 pts)
└── H9: Navigation pills (1 pt)

Total: 42 points
```

---

## Draft Data Structure (Updated)

```javascript
{
  // Template
  templateId: null,
  templateName: null,
  customizedQuestionIds: [],

  // NEW: Distribution method
  sendTo: 'teams',  // 'teams' | 'email' | 'link'

  // Teams data
  selectedTeamIds: [],
  selectedRecipients: [],  // Populated from team members

  // Email data
  emailRecipients: [],  // [{ email, role }]
  isNewCompany: false,
  companyData: { name: '', industry: '', size: null },

  // Link data
  linkExpiresInDays: 7,
  linkResponseLimit: null,

  // Step 3 cart
  recipientCart: [],  // [{ id, name, role, email, included: true }]

  // Other
  customMessage: '',

  // DEPRECATED (keep for backward compatibility)
  audienceType: 'cohorts',
  selectedCohorts: [],
  manualEmails: [],
  manualRoles: [],
  invitationMethod: 'email',
  expiresInDays: 14
}
```

---

## Definition of Done

- [ ] All 13 user stories complete
- [ ] Uses existing Invitation model (no new SurveyLink model)
- [ ] Uses existing endpoints (extended, not new)
- [ ] Team selection in shared module (no duplication)
- [ ] Anonymous responses work via secure links
- [ ] Sent by Me shows stats
- [ ] All tests pass
- [ ] No console errors
- [ ] Mobile responsive

---

## Files Modified/Created

**Modified:**
- `server/models/Invitation.js` - Add 3 fields
- `server/models/Assessment.js` - Optional user_id, add anonymous_respondent
- `server/routes/invitations.js` - Extend create, enhance sent-by-me
- `client/pages/assessment-creation-flow.html` - Complete rewrite
- `client/pages/assessment-step2-customize.html` - Left-right layout
- `client/pages/assessment-review-launch.html` - Three variants
- `client/pages/assessment-hub.html` - Use shared module, enhance Sent by Me
- `client/js/assessment-flow.js` - Update draft structure

**Created:**
- `client/js/team-selection.js` - Shared module
- `client/pages/survey.html` - Anonymous survey start
- `client/pages/survey-closed.html` - Closed/expired link page
