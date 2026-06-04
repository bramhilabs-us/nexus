# Karvia Email Design System

**Version**: 1.0
**Date**: March 6, 2026
**Purpose**: Unified email design across all user touchpoints

---

## Email Journey Map

### User Lifecycle Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER EMAIL JOURNEY                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGE 1: ONBOARDING                                                        │
│  ─────────────────────                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │  Company     │    │  Team Member │    │  Assessment  │                   │
│  │  Invitation  │───▶│  Welcome     │───▶│  Invitation  │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                                              │
│  STAGE 2: ENGAGEMENT                                                        │
│  ────────────────────                                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │  Task        │    │  Task        │    │  Daily       │                   │
│  │  Assigned    │    │  Reassigned  │    │  Digest      │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                                              │
│  STAGE 3: MILESTONES (Future)                                               │
│  ─────────────────────────────                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │  Goal        │    │  Objective   │    │  Weekly      │                   │
│  │  Completed   │    │  Achieved    │    │  Progress    │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                                              │
│  STAGE 4: ACCOUNT                                                           │
│  ────────────────                                                            │
│  ┌──────────────┐    ┌──────────────┐                                       │
│  │  Password    │    │  Account     │                                       │
│  │  Reset       │    │  Security    │                                       │
│  └──────────────┘    └──────────────┘                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Current Email Inventory

| Email Type | Trigger | Status | Template |
|------------|---------|--------|----------|
| Company Invitation | Consultant invites executive | LIVE | Navy/Gold |
| Team Member Welcome | Manager adds team member | LIVE | Navy/Gold |
| Assessment Invitation | User invites to assessment | LIVE | Gray/Black |
| Password Reset | User requests reset | LIVE | Purple gradient |
| Task Assigned | Task assigned to user | NEW | TBD |
| Task Reassigned | Task reassigned | NEW | TBD |
| Daily Digest | Morning cron job | NEW | TBD |

### Design Inconsistencies Found

| Issue | Current State | Recommendation |
|-------|---------------|----------------|
| Header colors | Mixed (Navy, Purple, Gray) | Standardize to Navy |
| CTA buttons | Different styles | Single black button style |
| Footer | Different layouts | Unified minimal footer |
| Typography | Varies per template | System font stack |
| Spacing | Inconsistent | 8px grid system |

---

## Unified Design System

### Design Principles

1. **Minimalist** - Only essential information
2. **Scannable** - Key info in 3 seconds
3. **Actionable** - One clear CTA per email
4. **Consistent** - Same look across all emails
5. **Mobile-first** - 520px max width

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-page` | `#f8f9fa` | Page background |
| `--bg-card` | `#ffffff` | Email card |
| `--bg-muted` | `#f1f3f5` | Info boxes, task cards |
| `--text-primary` | `#1a1a1a` | Headers, important text |
| `--text-secondary` | `#495057` | Body text |
| `--text-muted` | `#868e96` | Secondary info, footer |
| `--accent` | `#1e3a5f` | Links (not buttons) |
| `--border` | `#e9ecef` | Dividers, borders |
| `--success` | `#40c057` | Success states |
| `--warning` | `#fab005` | Warnings, medium priority |
| `--danger` | `#fa5252` | Errors, high priority |

### Typography

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Sizes */
--text-xl: 22px;    /* Main heading */
--text-lg: 16px;    /* Subheading, body lead */
--text-md: 14px;    /* Body text */
--text-sm: 13px;    /* Secondary text */
--text-xs: 11px;    /* Footer, legal */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
```

### Spacing (8px Grid)

```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 40px;
```

---

## Email Template Structure

### Unified Layout

```
┌─────────────────────────────────────────────────────┐
│                    PAGE (gray bg)                    │
│  ┌─────────────────────────────────────────────┐    │
│  │              CARD (white, 520px)             │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │           CONTEXT BAR               │    │    │
│  │  │    "From [Name]" or "[Company]"     │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │              HEADER                 │    │    │
│  │  │         [Email Title]               │    │    │
│  │  │        [Optional Date]              │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │              BODY                   │    │    │
│  │  │         [Main Content]              │    │    │
│  │  │                                     │    │    │
│  │  │  ┌───────────────────────────┐     │    │    │
│  │  │  │      CONTENT CARD         │     │    │    │
│  │  │  │   (task, credentials)     │     │    │    │
│  │  │  └───────────────────────────┘     │    │    │
│  │  │                                     │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │              CTA                    │    │    │
│  │  │         [ Button ]                  │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │             FOOTER                  │    │    │
│  │  │    Karvia · [Unsubscribe link]      │    │    │
│  │  └─────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Component Library

#### 1. Context Bar (Optional)
```html
<div style="padding: 16px 32px; border-bottom: 1px solid #e9ecef;">
    <p style="margin: 0; font-size: 13px; color: #868e96;">From ${sender_name}</p>
</div>
```

#### 2. Header
```html
<div style="padding: 24px 32px 16px;">
    <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #1a1a1a;">${title}</h1>
    ${subtitle ? `<p style="margin: 8px 0 0; font-size: 13px; color: #868e96;">${subtitle}</p>` : ''}
</div>
```

#### 3. Body Text
```html
<div style="padding: 0 32px 24px;">
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #495057;">${content}</p>
</div>
```

#### 4. Content Card (Task/Info Box)
```html
<div style="margin: 0 32px 24px; background: #f1f3f5; border-radius: 8px; padding: 20px; border-left: 4px solid ${accent_color};">
    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1a1a1a;">${title}</p>
    <p style="margin: 0; font-size: 13px; color: #868e96;">${meta}</p>
</div>
```

#### 5. Credentials Box (Special)
```html
<div style="margin: 0 32px 24px; background: #fff9db; border: 1px solid #fab005; border-radius: 8px; padding: 20px;">
    <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; color: #e67700; text-transform: uppercase; letter-spacing: 0.5px;">YOUR LOGIN</p>
    <p style="margin: 8px 0 4px; font-size: 14px; color: #1a1a1a;"><strong>Email:</strong> ${email}</p>
    <p style="margin: 4px 0 0; font-size: 14px; color: #1a1a1a;"><strong>Password:</strong> <code style="background: #fff; padding: 2px 6px; border: 1px solid #e9ecef; border-radius: 4px;">${password}</code></p>
</div>
```

#### 6. CTA Button
```html
<div style="padding: 0 32px 32px; text-align: center;">
    <a href="${url}" style="display: inline-block; background: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">${button_text}</a>
</div>
```

#### 7. Footer
```html
<div style="padding: 20px 32px; background: #f8f9fa; border-top: 1px solid #e9ecef; text-align: center;">
    <p style="margin: 0; font-size: 11px; color: #868e96;">
        Karvia${unsubscribe_url ? ` · <a href="${unsubscribe_url}" style="color: #868e96;">Unsubscribe</a>` : ''}
    </p>
</div>
```

#### 8. Task List (For Digest)
```html
<div style="margin: 0 32px 24px;">
    ${tasks.map((task, i) => `
    <div style="display: flex; align-items: center; padding: 14px 0; ${i < tasks.length - 1 ? 'border-bottom: 1px solid #e9ecef;' : ''}">
        <span style="width: 18px; height: 18px; border: 2px solid #dee2e6; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></span>
        <span style="flex: 1; font-size: 14px; color: #1a1a1a;">${task.title}</span>
        <span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px;
            background: ${task.priority === 'high' ? '#ffe3e3' : task.priority === 'medium' ? '#fff3bf' : '#d3f9d8'};
            color: ${task.priority === 'high' ? '#c92a2a' : task.priority === 'medium' ? '#e67700' : '#2b8a3e'};">
            ${task.priority}
        </span>
    </div>
    `).join('')}
</div>
```

#### 9. Priority Badge
```html
<!-- High Priority -->
<span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; background: #ffe3e3; color: #c92a2a;">High</span>

<!-- Medium Priority -->
<span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; background: #fff3bf; color: #e67700;">Medium</span>

<!-- Low Priority -->
<span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; background: #d3f9d8; color: #2b8a3e;">Low</span>
```

---

## Standardized Email Templates

### 1. Company Invitation

```
┌─────────────────────────────────────────────────────┐
│  From [Consultant Name]                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Your workspace is ready                             │
│                                                      │
│  Hi [First Name],                                    │
│                                                      │
│  [Consultant] has created your Cultural Discipline  │
│  workspace for [Company Name].                       │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  YOUR FIRST STEP (10-15 minutes)              │  │
│  │  Complete your SSI Assessment to discover:    │  │
│  │  ⚡ Speed · 🛡 Strength · 🧠 Intelligence      │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  YOUR LOGIN                                   │  │
│  │  Email: [email]                               │  │
│  │  Password: [temp_password]                    │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│            [ Get Started ]                           │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Karvia · This invitation expires in 14 days         │
└─────────────────────────────────────────────────────┘
```

### 2. Team Member Welcome

```
┌─────────────────────────────────────────────────────┐
│  From [Manager Name]                                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Welcome to [Team Name]                              │
│  [Company Name]                                      │
│                                                      │
│  Hi [First Name],                                    │
│                                                      │
│  You've been added to [Team Name]. Your account     │
│  is ready.                                           │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  YOUR LOGIN                                   │  │
│  │  Email: [email]                               │  │
│  │  Password: [temp_password]                    │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│            [ Get Started ]                           │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Karvia                                              │
└─────────────────────────────────────────────────────┘
```

### 3. Assessment Invitation

```
┌─────────────────────────────────────────────────────┐
│  From [Sender Name] at [Company]                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  You're invited to take an assessment                │
│                                                      │
│  Hi [First Name],                                    │
│                                                      │
│  [Sender] has invited you to complete the           │
│  [Assessment Name] assessment.                       │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  WHAT WE MEASURE                              │  │
│  │  ⚡ Speed — How quickly you adapt             │  │
│  │  🛡 Strength — Your organizational resilience │  │
│  │  🧠 Intelligence — Your ability to innovate   │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│            [ Get Started ]                           │
│                                                      │
│  Takes 10-15 minutes · Valid for 14 days            │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Karvia                                              │
└─────────────────────────────────────────────────────┘
```

### 4. Password Reset

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│  Reset your password                                 │
│                                                      │
│  Hi [First Name],                                    │
│                                                      │
│  We received a request to reset your password.      │
│  Click the button below to create a new one.        │
│                                                      │
│            [ Reset Password ]                        │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  ⏰ This link expires in 10 minutes           │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  If you didn't request this, ignore this email.     │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Karvia                                              │
└─────────────────────────────────────────────────────┘
```

### 5. Task Assigned (NEW)

```
┌─────────────────────────────────────────────────────┐
│  From [Assigner Name]                                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  New task assigned                                   │
│                                                      │
│  Hi [First Name],                                    │
│                                                      │
│  You have a new task:                                │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  [Task Title]                          [High] │  │
│  │  Due: March 10, 2026                          │  │
│  │  Part of: [Goal Name]                         │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  [Optional: Task description - max 2 lines]         │
│                                                      │
│            [ View Task ]                             │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Karvia · Unsubscribe                                │
└─────────────────────────────────────────────────────┘
```

### 6. Task Reassigned (NEW)

```
┌─────────────────────────────────────────────────────┐
│  From [Assigner Name]                                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Task reassigned to you                              │
│                                                      │
│  Hi [First Name],                                    │
│                                                      │
│  A task has been reassigned to you:                  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  [Task Title]                        [Medium] │  │
│  │  Due: March 10, 2026                          │  │
│  │  Previously: [Previous Owner Name]            │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│            [ View Task ]                             │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Karvia · Unsubscribe                                │
└─────────────────────────────────────────────────────┘
```

### 7. Daily Digest (NEW)

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│  Good morning, [First Name]                          │
│                                                      │
│  Your tasks for today                                │
│  Monday, March 6, 2026                               │
│                                                      │
│  You have 3 tasks due today:                         │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  ○  Complete quarterly report          [High] │  │
│  ├───────────────────────────────────────────────┤  │
│  │  ○  Review team feedback             [Medium] │  │
│  ├───────────────────────────────────────────────┤  │
│  │  ○  Update project timeline             [Low] │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│            [ Go to Dashboard ]                       │
│                                                      │
├─────────────────────────────────────────────────────┤
│  Karvia · Unsubscribe from daily digests             │
└─────────────────────────────────────────────────────┘
```

---

## Implementation: Base Template Function

```javascript
// server/services/emailTemplates.js

const COLORS = {
    bgPage: '#f8f9fa',
    bgCard: '#ffffff',
    bgMuted: '#f1f3f5',
    textPrimary: '#1a1a1a',
    textSecondary: '#495057',
    textMuted: '#868e96',
    border: '#e9ecef',
    accent: '#1e3a5f',
    warning: '#fab005',
    warningBg: '#fff9db',
    priorityHigh: { bg: '#ffe3e3', text: '#c92a2a' },
    priorityMedium: { bg: '#fff3bf', text: '#e67700' },
    priorityLow: { bg: '#d3f9d8', text: '#2b8a3e' }
};

function baseTemplate({ contextBar, title, subtitle, body, cta, footer }) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${COLORS.bgPage}; line-height: 1.6;">
    <div style="max-width: 520px; margin: 40px auto; background: ${COLORS.bgCard}; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

        ${contextBar ? `
        <div style="padding: 16px 32px; border-bottom: 1px solid ${COLORS.border};">
            <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted};">${contextBar}</p>
        </div>
        ` : ''}

        <div style="padding: 24px 32px 16px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: ${COLORS.textPrimary};">${title}</h1>
            ${subtitle ? `<p style="margin: 8px 0 0; font-size: 13px; color: ${COLORS.textMuted};">${subtitle}</p>` : ''}
        </div>

        <div style="padding: 0 32px 24px;">
            ${body}
        </div>

        ${cta ? `
        <div style="padding: 0 32px 32px; text-align: center;">
            <a href="${cta.url}" style="display: inline-block; background: ${COLORS.textPrimary}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">${cta.text}</a>
        </div>
        ` : ''}

        <div style="padding: 20px 32px; background: ${COLORS.bgPage}; border-top: 1px solid ${COLORS.border}; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: ${COLORS.textMuted};">
                ${footer || 'Karvia'}
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Component helpers
function contentCard(title, meta, accentColor = COLORS.textPrimary) {
    return `
    <div style="background: ${COLORS.bgMuted}; border-radius: 8px; padding: 20px; border-left: 4px solid ${accentColor}; margin-bottom: 16px;">
        <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: ${COLORS.textPrimary};">${title}</p>
        <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted};">${meta}</p>
    </div>
    `;
}

function credentialsBox(email, password) {
    return `
    <div style="background: ${COLORS.warningBg}; border: 1px solid ${COLORS.warning}; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
        <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; color: #e67700; text-transform: uppercase; letter-spacing: 0.5px;">YOUR LOGIN</p>
        <p style="margin: 8px 0 4px; font-size: 14px; color: ${COLORS.textPrimary};"><strong>Email:</strong> ${email}</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: ${COLORS.textPrimary};"><strong>Password:</strong> <code style="background: #fff; padding: 2px 6px; border: 1px solid ${COLORS.border}; border-radius: 4px;">${password}</code></p>
    </div>
    `;
}

function priorityBadge(priority) {
    const config = {
        high: COLORS.priorityHigh,
        medium: COLORS.priorityMedium,
        low: COLORS.priorityLow
    };
    const { bg, text } = config[priority] || config.medium;
    return `<span style="font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; background: ${bg}; color: ${text};">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>`;
}

function taskList(tasks) {
    return `
    <div style="border: 1px solid ${COLORS.border}; border-radius: 8px; overflow: hidden;">
        ${tasks.map((task, i) => `
        <div style="display: flex; align-items: center; padding: 14px 16px; ${i < tasks.length - 1 ? `border-bottom: 1px solid ${COLORS.border};` : ''} background: ${COLORS.bgCard};">
            <span style="width: 18px; height: 18px; border: 2px solid #dee2e6; border-radius: 50%; margin-right: 12px; flex-shrink: 0;"></span>
            <span style="flex: 1; font-size: 14px; color: ${COLORS.textPrimary};">${task.title}</span>
            ${priorityBadge(task.priority)}
        </div>
        `).join('')}
    </div>
    `;
}

module.exports = {
    COLORS,
    baseTemplate,
    contentCard,
    credentialsBox,
    priorityBadge,
    taskList
};
```

---

## Migration Plan

### Phase 1: Create Base System (Day 1)
- [ ] Create `server/services/emailTemplates.js` with shared components
- [ ] Add COLORS and base template function

### Phase 2: New Emails (Day 2-3)
- [ ] Implement Task Assigned using new system
- [ ] Implement Task Reassigned using new system
- [ ] Implement Daily Digest using new system

### Phase 3: Migrate Existing (Day 4-5)
- [ ] Migrate Password Reset to new system
- [ ] Migrate Assessment Invitation to new system
- [ ] Migrate Company Invitation to new system
- [ ] Migrate Team Member Welcome to new system

### Phase 4: Testing (Day 6)
- [ ] Test all emails on desktop
- [ ] Test all emails on mobile
- [ ] Verify dark mode rendering

---

## Email Subject Lines

| Email Type | Subject Line |
|------------|--------------|
| Company Invitation | `[Consultant] has set up your workspace - [Company]` |
| Team Member Welcome | `Welcome to [Team] - [Company]` |
| Assessment Invitation | `[Sender] invited you to complete an assessment` |
| Password Reset | `Reset your Karvia password` |
| Task Assigned | `New task: [Task Title]` |
| Task Reassigned | `Task reassigned: [Task Title]` |
| Daily Digest | `Your tasks for today - [Date]` |

---

## Notification Preferences

### User Model Fields

```javascript
notification_preferences: {
    // Onboarding (always enabled)
    welcome_email: { type: Boolean, default: true, immutable: true },

    // Task notifications
    task_assigned: { type: Boolean, default: true },
    task_reassigned: { type: Boolean, default: true },

    // Digest
    daily_digest: { type: Boolean, default: true },
    daily_digest_time: { type: String, default: '06:00' }, // HH:MM

    // Future
    weekly_summary: { type: Boolean, default: false },
    goal_completed: { type: Boolean, default: true },
    objective_achieved: { type: Boolean, default: true }
}
```

---

**Document Version**: 1.0
**Created**: March 6, 2026
**Author**: Claude Code

