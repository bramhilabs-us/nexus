# Sprint 15-A: LLM Context Intelligence + Unified Email System

**Sprint**: 15-A (Enhancement Sprint)
**Duration**: 1 week
**Started**: March 6, 2026
**Status**: IN PROGRESS
**Total Points**: 55 pts

---

## Executive Summary

Sprint 15-A addresses three areas:

1. **LLM Context Intelligence** - Fix generic AI-generated objectives
2. **Task Email Notifications** - Keep users engaged with timely task updates
3. **Unified Email Design System** - Standardize all email communications

---

## Root Causes Identified (LLM Issues)

### Root Cause 1: Strategic Vision Field Mismatch (CRITICAL BUG)

The prompt code references **non-existent fields**:

```javascript
// PROMPT LOOKS FOR (ai-okr.js:1696-1701):
strategic_vision.mission       // DOESN'T EXIST!
strategic_vision.vision        // DOESN'T EXIST!
strategic_vision.priorities    // WRONG NAME!

// ACTUAL MODEL HAS (Company.js:221-243):
strategic_vision.priority_one           // #1 priority
strategic_vision.biggest_blocker        // Growth obstacle
strategic_vision.one_thing              // What to change
strategic_vision.strategic_priorities   // Array of priorities
strategic_vision.growth_aspirations     // 3-5 year vision
```

### Root Cause 2: Context System Fragmentation

Two separate context systems exist:
1. `AIContextService.buildContext()` - Comprehensive (Sprint 13, 2059 lines)
2. Manual context in `ai-okr.js` - Duplicated, incomplete

---

## Sprint 15-A Epics

| Epic | Points | Focus |
|------|--------|-------|
| P0: Hotfix | 3 | Fix strategic vision field names |
| A: Context Integration | 15 | Wire AIContextService, add deduplication |
| B: Prompt Enhancement | 8 | Redesign prompts with full context |
| C: Testing & Validation | 6 | Tests and debug endpoint |
| D: Task Email Notifications | 15 | Assignment, reassignment, daily digest |
| E: Unified Email System | 8 | Base template, migrate existing emails |
| **Total** | **55** | |

---

## Epic P0: Strategic Vision Hotfix (3 pts)

**Priority**: CRITICAL - Deploy immediately

### P0-1: Fix Field Names (3 pts)

**File**: `server/routes/ai-okr.js:1696-1701`

**Current Code (BROKEN)**:
```javascript
${company.business_context?.strategic_vision ? `
STRATEGIC VISION:
${company.business_context.strategic_vision.mission ? `Mission: ...` : ''}
${company.business_context.strategic_vision.vision ? `Vision: ...` : ''}
${company.business_context.strategic_vision.priorities?.length ? `Priorities: ...` : ''}
` : ''}
```

**Fixed Code**:
```javascript
${company.business_context?.strategic_vision ? `
STRATEGIC VISION:
${company.business_context.strategic_vision.priority_one ? `#1 Priority (Next 12 Months): ${company.business_context.strategic_vision.priority_one}` : ''}
${company.business_context.strategic_vision.biggest_blocker ? `Biggest Obstacle: ${company.business_context.strategic_vision.biggest_blocker}` : ''}
${company.business_context.strategic_vision.one_thing ? `Key Change Needed: ${company.business_context.strategic_vision.one_thing}` : ''}
${company.business_context.strategic_vision.strategic_priorities?.length ? `Strategic Priorities: ${company.business_context.strategic_vision.strategic_priorities.join(', ')}` : ''}
${company.business_context.strategic_vision.growth_aspirations ? `3-5 Year Vision: ${company.business_context.strategic_vision.growth_aspirations}` : ''}
` : ''}
```

---

## Epic A: Context Integration (15 pts)

| Story | Points | Description |
|-------|--------|-------------|
| A1 | 5 | Add existing objectives to prompt (deduplication) |
| A2 | 5 | Add rejection history to prompt (learning) |
| A3 | 3 | Add context logging for debugging |
| A4 | 2 | Add debug endpoint for context inspection |

### A1: Add Existing Objectives (5 pts)

Add to prompt after STEP 2:

```javascript
// Fetch existing objectives
const Objective = require('../models/Objective');
const existingObjectives = await Objective.find({
    company_id: company_id,
    status: { $in: ['active', 'in_progress'] }
}).select('title category progress_percentage').lean();

// Add to prompt
EXISTING OBJECTIVES (Avoid Duplicates):
${existingObjectives.map(o => `- [${o.category}] ${o.title}`).join('\n')}
```

### A2: Add Rejection History (5 pts)

```javascript
// Add to prompt
LEARNING FROM PAST REJECTIONS:
These suggestions were rejected before. Avoid similar patterns:
${rejections.map(r => `- ${r.reason}: "${r.title}"`).join('\n')}
```

---

## Epic B: Prompt Enhancement (8 pts)

| Story | Points | Description |
|-------|--------|-------------|
| B1 | 5 | Add strategic alignment requirement |
| B2 | 3 | Add coverage gap analysis |

---

## Epic C: Testing & Validation (6 pts)

| Story | Points | Description |
|-------|--------|-------------|
| C1 | 3 | Integration tests for context flow |
| C2 | 2 | Manual test checklist |
| C3 | 1 | Context debug endpoint |

---

## Epic D: Task Email Notifications (15 pts)

| Story | Points | Description |
|-------|--------|-------------|
| D1 | 5 | Task assigned email notification |
| D2 | 3 | Task reassigned email notification |
| D3 | 5 | Daily digest email (tasks due today) |
| D4 | 2 | Email preference settings |

### D1: Task Assigned Email (5 pts)

**Trigger**: When a task is assigned to a user

**Email Template** (Minimalist Design):

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  From [Assigner Name]                                      │
│                                                            │
│  New Task Assigned                                         │
│  ──────────────────                                        │
│                                                            │
│  Hi [First Name],                                          │
│                                                            │
│  You have a new task:                                      │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 📋 [Task Title]                                     │   │
│  │                                                     │   │
│  │ Due: [Date]  •  Priority: [High/Medium/Low]        │   │
│  │                                                     │   │
│  │ Part of: [Goal] → [Objective]                      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  [Description - max 2 lines]                               │
│                                                            │
│            [ View Task → ]                                 │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│  Karvia · Helping teams unlock their potential             │
└────────────────────────────────────────────────────────────┘
```

**HTML Template**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 520px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="padding: 24px 32px; border-bottom: 1px solid #eee;">
            <p style="margin: 0; font-size: 13px; color: #666;">From ${assigner_name}</p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
            <h1 style="margin: 0 0 8px; font-size: 20px; font-weight: 600; color: #1a1a1a;">New Task Assigned</h1>
            <p style="margin: 0 0 24px; font-size: 15px; color: #444;">Hi ${first_name},</p>

            <!-- Task Card -->
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; border-left: 4px solid ${priority_color};">
                <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1a1a1a;">${task_title}</p>
                <p style="margin: 0; font-size: 13px; color: #666;">
                    Due: <strong>${due_date}</strong> · Priority: <strong>${priority}</strong>
                </p>
                ${goal_title ? `<p style="margin: 8px 0 0; font-size: 12px; color: #888;">Part of: ${goal_title}</p>` : ''}
            </div>

            ${description ? `<p style="margin: 20px 0 0; font-size: 14px; color: #555;">${description}</p>` : ''}

            <!-- CTA -->
            <div style="text-align: center; margin: 32px 0 0;">
                <a href="${dashboard_url}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View Task</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 32px; background: #f8f9fa; border-top: 1px solid #eee; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #888;">Karvia · Helping teams unlock their potential</p>
        </div>
    </div>
</body>
</html>
```

### D2: Task Reassigned Email (3 pts)

**Trigger**: When task is reassigned to different user

**Template** (Variation of D1):

```
Subject: Task reassigned to you: [Task Title]

Hi [First Name],

[Assigner] has reassigned a task to you:

┌────────────────────────────────────────────────────┐
│ 📋 [Task Title]                                     │
│                                                     │
│ Due: [Date]  •  Priority: [Priority]               │
│ Previously: [Previous Owner]                        │
└────────────────────────────────────────────────────┘

[ View Task → ]
```

### D3: Daily Digest Email (5 pts)

**Trigger**: Scheduled job at 6:00 AM (configurable)

**Conditions**:
- User has tasks due today
- User has `daily_digest` enabled

**Template** (Minimalist Daily Digest):

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  Good morning, [First Name]                                │
│                                                            │
│  Your Tasks for Today                                      │
│  ────────────────────                                      │
│  [Monday, March 6, 2026]                                   │
│                                                            │
│  You have [X] tasks due today:                             │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ ○ Complete quarterly report           High         │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ ○ Review team feedback               Medium        │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ ○ Update project timeline             Low          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│            [ Go to Dashboard → ]                           │
│                                                            │
│  ──────────────────────────────────────────────────────    │
│  Karvia · Unsubscribe in Settings → Notifications          │
└────────────────────────────────────────────────────────────┘
```

**HTML Template**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 520px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="padding: 24px 32px;">
            <p style="margin: 0 0 4px; font-size: 14px; color: #666;">Good morning, ${first_name}</p>
            <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #1a1a1a;">Your Tasks for Today</h1>
            <p style="margin: 8px 0 0; font-size: 13px; color: #888;">${formatted_date}</p>
        </div>

        <!-- Task List -->
        <div style="padding: 0 32px 24px;">
            <p style="margin: 0 0 16px; font-size: 14px; color: #444;">You have <strong>${task_count}</strong> task${task_count > 1 ? 's' : ''} due today:</p>

            ${tasks.map((task, i) => `
            <div style="display: flex; align-items: center; padding: 14px 0; ${i < tasks.length - 1 ? 'border-bottom: 1px solid #eee;' : ''}">
                <span style="width: 20px; height: 20px; border: 2px solid #ddd; border-radius: 50%; margin-right: 12px;"></span>
                <div style="flex: 1;">
                    <p style="margin: 0; font-size: 14px; color: #1a1a1a;">${task.title}</p>
                </div>
                <span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; background: ${task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#d1fae5'}; color: ${task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#059669'};">${task.priority}</span>
            </div>
            `).join('')}
        </div>

        <!-- CTA -->
        <div style="padding: 0 32px 32px; text-align: center;">
            <a href="${dashboard_url}" style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Go to Dashboard</a>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 32px; background: #f8f9fa; border-top: 1px solid #eee; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #888;">
                Karvia · <a href="${unsubscribe_url}" style="color: #888;">Unsubscribe</a> from daily digests
            </p>
        </div>
    </div>
</body>
</html>
```

### D4: Email Preference Settings (2 pts)

**User Model Update**:

```javascript
// Add to server/models/User.js
notification_preferences: {
    task_assigned: { type: Boolean, default: true },
    task_reassigned: { type: Boolean, default: true },
    daily_digest: { type: Boolean, default: true },
    daily_digest_time: { type: String, default: '06:00' }
}
```

---

## Epic E: Unified Email Design System (8 pts)

| Story | Points | Description |
|-------|--------|-------------|
| E1 | 3 | Create base email template system (`emailTemplates.js`) |
| E2 | 3 | Migrate existing 4 email templates to unified system |
| E3 | 2 | Update mailjetService to use new template system |

### E1: Base Email Template System (3 pts)

**New File**: `server/services/emailTemplates.js`

```javascript
// Unified color tokens
const COLORS = {
    bgPage: '#f8f9fa',
    bgCard: '#ffffff',
    bgMuted: '#f1f3f5',
    textPrimary: '#1a1a1a',
    textSecondary: '#495057',
    textMuted: '#868e96',
    border: '#e9ecef',
    warning: '#fab005',
    priorityHigh: { bg: '#ffe3e3', text: '#c92a2a' },
    priorityMedium: { bg: '#fff3bf', text: '#e67700' },
    priorityLow: { bg: '#d3f9d8', text: '#2b8a3e' }
};

// Base template function
function baseTemplate({ contextBar, title, subtitle, body, cta, footer })

// Reusable components
function contentCard(title, meta, accentColor)
function credentialsBox(email, password)
function priorityBadge(priority)
function taskList(tasks)
```

### E2: Migrate Existing Templates (3 pts)

| Template | Current Style | Migration |
|----------|--------------|-----------|
| Company Invitation | Navy gradient header | Remove header, use context bar |
| Team Member Welcome | Navy gradient header | Remove header, use context bar |
| Assessment Invitation | Gray minimal | Already close, minor tweaks |
| Password Reset | Purple gradient | Remove gradient, use unified style |

### E3: Update mailjetService (2 pts)

Refactor `mailjetService.js` to import from `emailTemplates.js`:

```javascript
const { baseTemplate, contentCard, credentialsBox } = require('./emailTemplates');

// Replace inline templates with component-based approach
getCompanyInvitationTemplate(data) {
    return baseTemplate({
        contextBar: `From ${data.consultant_name}`,
        title: 'Your workspace is ready',
        body: `...`,
        cta: { url: data.invitation_link, text: 'Get Started' },
        footer: `This invitation expires in ${data.expires_days} days`
    });
}
```

---

## Implementation Architecture

### New Files

```
server/
├── jobs/
│   └── dailyDigestJob.js       # Cron job for daily digest
├── services/
│   └── mailjetService.js       # Add 3 new methods (existing file)
```

### Modified Files

```
server/
├── routes/
│   ├── ai-okr.js              # P0 fix + A1-A4
│   └── tasks.js               # Trigger emails on assign/reassign
├── models/
│   └── User.js                # Add notification_preferences
└── index.js                   # Initialize cron jobs
```

---

## Email Design System

### Design Principles

1. **Minimalist** - No clutter, essential information only
2. **Scannable** - Understand in 3 seconds
3. **Actionable** - Clear CTA to dashboard
4. **Mobile-first** - Works on all devices

### Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Background | `#f8f9fa` | Page background |
| Card | `#ffffff` | Content cards |
| Primary | `#1a1a1a` | Headers, CTAs |
| Text | `#444444` | Body text |
| Muted | `#888888` | Secondary text |
| High Priority | `#dc2626` | High priority badge |
| Medium Priority | `#d97706` | Medium priority badge |
| Low Priority | `#059669` | Low priority badge |

---

## Implementation Order

| Day | Stories | Points | Focus |
|-----|---------|--------|-------|
| 1 | P0-1 | 3 | HOTFIX: Strategic vision fields |
| 2 | A1, A3 | 8 | Existing objectives, logging |
| 3 | A2, A4 | 7 | Rejection history, debug endpoint |
| 4 | D1, D2 | 8 | Task assigned/reassigned emails |
| 5 | D3, D4 | 7 | Daily digest, preferences |
| 6 | B1, B2, C1-C3 | 14 | Prompts, testing |

---

## Manual Test Checklist (C2)

### P0: Strategic Vision Fix
- [ ] Navigate to Team SSI View for a company with strategic vision data
- [ ] Click "Generate OKRs" button
- [ ] Verify generated objectives reference the company's `priority_one`
- [ ] Verify `biggest_blocker` and `one_thing` appear in prompt (check debug endpoint)

### Epic A: Context Integration
- [ ] **A1 - Deduplication**: Generate OKRs for company with existing objectives
  - [ ] Verify new suggestions don't duplicate existing objective titles
  - [ ] Check debug endpoint shows existing objectives in context
- [ ] **A2 - Rejection History**: Reject 2-3 suggestions, then regenerate
  - [ ] Verify similar suggestions are not proposed again
  - [ ] Check debug endpoint shows rejection history
- [ ] **A3 - Context Logging**: After generation, check Company document
  - [ ] Verify `llm_context.last_interaction` timestamp updated
  - [ ] Verify `interaction_count` incremented
- [ ] **A4 - Debug Endpoint**: `GET /api/ai-okr/debug-context/:companyId`
  - [ ] Verify CONSULTANT can access
  - [ ] Verify BUSINESS_OWNER can access
  - [ ] Verify EMPLOYEE gets 403
  - [ ] Verify response includes all context fields

### Epic B: Prompt Enhancement
- [ ] **B1 - Strategic Alignment**
  - [ ] Verify "MANDATORY STRATEGIC ALIGNMENT" box appears in prompt
  - [ ] Verify at least one objective aligns with `priority_one`
- [ ] **B2 - Coverage Gap Analysis**
  - [ ] For company with objectives in only 2 categories
  - [ ] Verify new suggestions target uncovered categories
  - [ ] Check debug endpoint shows covered/uncovered categories

### Epic D: Task Email Notifications
- [ ] **D1 - Task Assigned**
  - [ ] Create new task and assign to user
  - [ ] Verify email received with task title, due date, priority
  - [ ] Verify "View Task" button links to dashboard
- [ ] **D2 - Task Reassigned**
  - [ ] Reassign existing task to different user
  - [ ] Verify email shows previous owner
  - [ ] Verify new assignee receives notification
- [ ] **D3 - Daily Digest**
  - [ ] Create tasks due today for test user
  - [ ] Trigger digest manually or wait for cron
  - [ ] Verify email lists all tasks due today
  - [ ] Verify priority badges display correctly
- [ ] **D4 - Email Preferences**
  - [ ] Toggle notification settings in user profile
  - [ ] Verify disabled notifications not sent

### Epic E: Unified Email System
- [ ] **Visual Consistency Check**
  - [ ] Receive one of each email type
  - [ ] Verify consistent Navy/Gold color scheme
  - [ ] Verify mobile responsive layout
- [ ] **E1-E3 - Template Migration**
  - [ ] Verify company invitation email renders correctly
  - [ ] Verify team member welcome email renders correctly
  - [ ] Verify password reset email renders correctly

### Epic T: Testing Infrastructure
- [ ] **T1-T3 - Automated Tests**
  - [ ] Run `npm run test:security` - verify 26/26 pass
  - [ ] Run `npm run test:integration` - verify context flow tests pass
  - [ ] Run `npm run test:golden-path` - verify lifecycle tests
- [ ] **T5 - CI/CD**
  - [ ] Push to `development` branch
  - [ ] Verify GitHub Actions workflow triggers
  - [ ] Verify test results reported

---

## Success Criteria

### LLM Improvements
- [x] Generated objectives reference company's #1 priority
- [x] Generated objectives don't duplicate existing ones
- [x] Context debug endpoint shows all fields populated

### Email Notifications
- [x] Task assigned email sends within 1 minute
- [x] Task reassigned email notifies new assignee
- [x] Daily digest arrives at configured time
- [x] Users can disable individual notification types

### Testing Infrastructure
- [x] Security tests: 26/26 passing (100%)
- [x] Integration tests: 32/32 passing (100%)
- [x] Audit issues AH-9, AH-10, AH-11 resolved
- [x] GitHub Actions CI/CD workflow created

---

**Document Version**: 3.0 (Manual Test Checklist Added)
**Created**: March 6, 2026
**Updated**: March 8, 2026
**Author**: Claude Code

