# Sprint 15: Seamless Client Onboarding

**Sprint Duration**: 2 weeks
**Total Points**: 45 pts (estimated)
**Focus**: Value-driven onboarding journeys for all user types
**Prerequisite**: Sprint 14 UI completion

---

## Sprint 15 Goal

> **Enable consultants to onboard clients in under 3 minutes, ensuring business owners understand the value proposition and can immediately see results after completing their first assessment.**

---

## The Value Creation Problem

### Current State (Pain Points)

| User | Pain Point |
|------|------------|
| **Consultant** | Has to explain Karvia's value separately; Add Client modal doesn't capture strategic context |
| **Business Owner** | Receives generic email; doesn't understand why they should take assessment; no clear value proposition |
| **Team Member** | Receives invitation without context; doesn't know why company is using Karvia |

### Target State (Value Creation)

| User | Value Delivered |
|------|-----------------|
| **Consultant** | One-click onboarding that pre-populates context; client arrives educated |
| **Business Owner** | Crystal clear email showing what they'll get; sees SSI results immediately; understands next steps |
| **Team Member** | Knows why they're invited; sees team context; contributes to company health score |

---

## Entry Points Analysis

### Entry Point 1: Consultant Adds Client (Primary)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Consultant      │───▶│ Add Client      │───▶│ Email Sent      │
│ My Clients Tab  │    │ Modal (Enhanced)│    │ + Assessment    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                     │
                       ┌─────────────────┐           │
                       │ Business Owner  │◀──────────┘
                       │ Receives Email  │
                       └─────────────────┘
                               │
                       ┌───────▼─────────┐
                       │ Complete SSI    │
                       │ Assessment      │
                       └─────────────────┘
                               │
                       ┌───────▼─────────┐
                       │ See Results +   │
                       │ Set Password    │
                       └─────────────────┘
                               │
                       ┌───────▼─────────┐
                       │ Dashboard with  │
                       │ Next Steps      │
                       └─────────────────┘
```

### Entry Point 2: Business Owner Self-Signup
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Landing Page    │───▶│ Sign Up Form    │───▶│ Email Verify    │
│ "Start Free"    │    │ Company + User  │    │ + First Login   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                     │
                       ┌─────────────────┐           │
                       │ Onboarding      │◀──────────┘
                       │ Wizard          │
                       └─────────────────┘
                               │
                       ┌───────▼─────────┐
                       │ Take Assessment │
                       │ (Self-Service)  │
                       └─────────────────┘
```

### Entry Point 3: Team Member Invitation
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Business Owner  │───▶│ Invite Team     │───▶│ Team Member     │
│ OR Consultant   │    │ Members         │    │ Receives Email  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                     │
                       ┌─────────────────┐           │
                       │ Accept + Set    │◀──────────┘
                       │ Password        │
                       └─────────────────┘
                               │
                       ┌───────▼─────────┐
                       │ Dashboard with  │
                       │ Assigned Goals  │
                       └─────────────────┘
```

---

## Fields Consultant Can Fill (Add Client Modal)

### Current Fields (Existing)
| Field | Maps To | Available |
|-------|---------|-----------|
| Company Name | `company.name` | ✅ |
| Industry | `company.industry` | ✅ |
| Company Size | `company.employee_count` | ✅ |
| First Name | `user.first_name` | ✅ |
| Last Name | `user.last_name` | ✅ |
| Email | `user.email` | ✅ |
| Assessment Template | `invitation.assessment_template_id` | ✅ |

### Proposed New Fields (Sprint 15)
| Field | Maps To | Purpose |
|-------|---------|---------|
| What does this company do? | `business_context.profile.description` | AI context |
| Primary 12-month goal | `business_context.strategic_vision.priority_one` | Shows on client card |
| Key challenge | `business_context.strategic_vision.biggest_blocker` | AI objective relevance |
| Consultant's private note | `internal_notes` (new) | Consultant reference |

### Fields NOT for Consultant (Business Owner fills later)
| Field | Reason |
|-------|--------|
| Revenue metrics | Sensitive, owner should provide |
| Team structure | Owner knows best |
| Value proposition | Owner's perspective |
| Target market details | Owner's expertise |

---

## User Stories

### Epic 15A: Enhanced Add Client Flow (18 pts)

#### 15A-1: Add Client Modal Redesign (5 pts)
**User Story**: As a consultant, I want to add a client with strategic context so that the client receives a personalized experience.

**Current Modal**:
```
┌─────────────────────────────────────┐
│ Add New Client                    X │
├─────────────────────────────────────┤
│ ASSESSMENT TEMPLATE (Optional)      │
│ [Choose a template... ▼]            │
│                                     │
│ COMPANY INFORMATION                 │
│ Company Name *  [____________]      │
│ Industry [▼]    Company Size [50]   │
│                                     │
│ EXECUTIVE CONTACT                   │
│ First Name * [____] Last Name *[___]│
│ Email Address * [______________]    │
│                                     │
│         [Cancel]  [Add Client]      │
└─────────────────────────────────────┘
```

**Proposed Modal (2-Step)**:
```
┌─────────────────────────────────────────────────────────────┐
│ Add New Client                                        [1/2] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ COMPANY                                                     │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Company Name *                                          ││
│ │ [Acme Corporation                                     ] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌────────────────────────┐  ┌────────────────────────────┐ │
│ │ Industry *             │  │ Company Size *             │ │
│ │ [Technology      ▼]    │  │ [50 employees        ▼]   │ │
│ └────────────────────────┘  └────────────────────────────┘ │
│                                                             │
│ What does this company do? *                                │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ SaaS platform for logistics companies to manage their   ││
│ │ fleet operations efficiently.                           ││
│ └─────────────────────────────────────────────────────────┘│
│ ℹ️ This helps generate relevant objectives                  │
│                                                             │
│ PRIMARY CONTACT (Business Owner)                            │
│ ┌────────────────────────┐  ┌────────────────────────────┐ │
│ │ First Name *           │  │ Last Name *                │ │
│ │ [John                ] │  │ [Smith                   ] │ │
│ └────────────────────────┘  └────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Email Address *                                         ││
│ │ [john@acme.com                                        ] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                               [Cancel]  [Next: Strategy →] │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│ Add New Client                                        [2/2] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STRATEGIC CONTEXT (Optional but recommended)                │
│ ℹ️ This context helps us generate highly relevant objectives│
│                                                             │
│ What is their primary goal for the next 12 months?          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Expand to 3 new cities with profitable unit economics   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ What's their biggest challenge right now?                   │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ○ Market Entry / Customer Acquisition                   ││
│ │ ● Operational Efficiency                                ││
│ │ ○ Team Building / Talent                                ││
│ │ ○ Product Development                                   ││
│ │ ○ Cash Flow / Funding                                   ││
│ │ ○ Other: [_______________]                              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ASSESSMENT                                                  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑️ Send SSI Assessment to Business Owner                ││
│ │   Template: [Quick Start SSI (15 min)           ▼]      ││
│ │                                                          ││
│ │   📧 John will receive an email with:                    ││
│ │   • Personalized invitation from you                    ││
│ │   • SSI assessment link                                 ││
│ │   • Login credentials                                   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ PRIVATE NOTE (Only visible to you)                          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Referred by Mike. Follow up in 2 weeks.                 ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                       [← Back]  [Cancel]  [Add Client ✓]   │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] 2-step modal with clear progress indicator
- [ ] Step 1: Company + Contact (required fields)
- [ ] Step 2: Strategy + Assessment (optional but guided)
- [ ] Company description field (textarea, 500 char max)
- [ ] Primary goal field (textarea, 200 char max)
- [ ] Challenge radio buttons (predefined + other)
- [ ] Assessment checkbox with template dropdown
- [ ] Private note field (consultant only)
- [ ] Email preview showing what client receives
- [ ] Form validation with inline errors
- [ ] Loading state during submission

---

#### 15A-2: Value-Driven Welcome Email (4 pts)
**User Story**: As a business owner receiving an invitation, I want to understand the value I'll get so that I'm motivated to complete the assessment.

**Current Email** (Generic):
```
Subject: You've been invited to Karvia

Hi John,

You've been invited to join Karvia by [Consultant Name].
Click below to get started.

[Accept Invitation]
```

**Proposed Email** (Value-Driven):
```
Subject: [Consultant Name] has set up your OKR workspace

Hi John,

[Consultant Name] from [Consultant Company] has created your
Cultural Discipline workspace for Acme Corporation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR FIRST STEP (10-15 minutes)

Complete your SSI Assessment to discover:

⚡ SPEED - How fast your company executes
🛡️ STRENGTH - How well you handle challenges
🧠 INTELLIGENCE - How smartly you adapt

After completing the assessment, you'll see your company's
cultural score and get AI-powered recommendations for your
top objectives.

[Complete Your Assessment →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S WAITING FOR YOU:

✓ Your company's SSI Score (Speed, Strength, Intelligence)
✓ Personalized objectives based on your industry
✓ Clear weekly goals for your team
✓ Progress tracking on what matters most

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR LOGIN CREDENTIALS

Email: john@acme.com
Temporary Password: [Generated]

After completing your assessment, you can log in anytime at:
https://app.karvia.com/login

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Reply to this email to reach [Consultant Name].

— The Karvia Team
```

**Acceptance Criteria**:
- [ ] Email clearly states value proposition
- [ ] SSI explained with emojis (⚡🛡🧠)
- [ ] Primary CTA is "Complete Your Assessment"
- [ ] Shows what they'll get after assessment
- [ ] Includes login credentials
- [ ] Consultant's name throughout
- [ ] Mobile-responsive design
- [ ] Plain text fallback

---

#### 15A-3: Assessment Completion → Results Page (5 pts)
**User Story**: As a business owner who just completed the assessment, I want to immediately see my results so that I understand my company's current state.

**Current Flow**:
Assessment complete → Generic "Thank you" → Login separately → Find results

**Proposed Flow**:
Assessment complete → Set password → Auto-login → Results page with next steps

**Results Page Design**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│              🎉 Welcome to Karvia, John!                               │
│                                                                         │
│              Your assessment is complete. Here's what we found:         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    ACME CORPORATION                                     │
│                    SSI SCORE: 68                                        │
│                                                                         │
│     ┌─────────────────────────────────────────────────────────┐        │
│     │                                                         │        │
│     │      ⚡ 72        🛡️ 65         🧠 67                   │        │
│     │      SPEED       STRENGTH    INTELLIGENCE              │        │
│     │      ━━━━━       ━━━━━       ━━━━━━━━━                │        │
│     │      Good        Developing   Developing               │        │
│     │                                                         │        │
│     └─────────────────────────────────────────────────────────┘        │
│                                                                         │
│     Your score indicates your company is in the DEVELOPING stage.      │
│     With focused effort, you can reach THRIVING in 6-9 months.         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│     WHAT THIS MEANS                                                     │
│                                                                         │
│     ⚡ Speed (72) - Your team moves quickly. Keep it up!               │
│                                                                         │
│     🛡️ Strength (65) - There's room to build resilience.              │
│        → Consider: Team building, process documentation                 │
│                                                                         │
│     🧠 Intelligence (67) - Your adaptability is developing.            │
│        → Consider: Learning culture, feedback loops                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│     YOUR NEXT STEPS                                                     │
│                                                                         │
│     1. 📊 View Full SSI Report     [View Report →]                     │
│        See detailed breakdowns by category                              │
│                                                                         │
│     2. 🎯 Set Your First Objective [Generate with AI →]                │
│        Based on "Expand to 3 new cities"                                │
│                                                                         │
│     3. 👥 Invite Your Team         [Invite Members →]                  │
│        Get your team on the same page                                   │
│                                                                         │
│                                                                         │
│                          [Go to Dashboard]                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Auto-login after assessment completion
- [ ] Personalized welcome with first name
- [ ] SSI scores displayed prominently
- [ ] Score interpretation in plain language
- [ ] Specific recommendations based on low scores
- [ ] 3 clear next steps with CTAs
- [ ] Strategic goal referenced (from consultant input)
- [ ] Mobile responsive
- [ ] Dashboard link as final CTA

---

#### 15A-4: Profile Completion Progress Bar (4 pts)
**User Story**: As a business owner, I want to see how complete my company profile is so that I know what else to provide.

**Implementation**:
```
┌─────────────────────────────────────────────────────────────┐
│ COMPANY PROFILE                                    75% Complete │
│ ┌────────────────────────────────────────────────┐         │
│ │████████████████████████████████████░░░░░░░░░░░│         │
│ └────────────────────────────────────────────────┘         │
│                                                             │
│ ✓ Basic Info (Company name, industry, size)                │
│ ✓ Description (What you do)                                │
│ ✓ SSI Assessment (Completed)                               │
│ ○ Strategic Vision (Goals, challenges)                     │
│ ○ Business Metrics (Optional)                              │
│                                                             │
│                    [Complete Profile →]                     │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Progress bar on dashboard
- [ ] Checklist of sections
- [ ] Visual indicators (✓ complete, ○ incomplete)
- [ ] CTA to complete missing sections
- [ ] Updates in real-time
- [ ] 100% shows celebration state

---

### Epic 15B: Team Invitation Flow (12 pts)

#### 15B-1: Invite Team Modal Redesign (4 pts)
**User Story**: As a business owner, I want to easily invite my team members so that we can work on objectives together.

**Current State**: Separate process, unclear value to invitee

**Proposed Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Invite Team Members                                       X │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Add your team to help achieve your objectives faster.       │
│                                                             │
│ INVITE BY EMAIL                                             │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Email addresses (one per line or comma-separated)       ││
│ │ ───────────────────────────────────────────────────────││
│ │ sarah@acme.com                                          ││
│ │ mike@acme.com                                           ││
│ │ jane@acme.com                                           ││
│ │                                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ WHAT ROLE SHOULD THEY HAVE?                                 │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ○ Manager - Can create goals, assign tasks              ││
│ │ ● Employee - Can view goals, complete tasks             ││
│ │ ○ Executive - Can create objectives, view reports       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ OPTIONAL: ADD TO TEAM                                       │
│ [Select team...                                         ▼] │
│                                                             │
│ ☑️ Send them the SSI assessment                            │
│    Help us get a complete picture of your company          │
│                                                             │
│ Preview email they'll receive:                              │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Subject: John invited you to join Acme on Karvia       ││
│ │                                                          ││
│ │ Hi [Name], John Smith from Acme Corporation wants       ││
│ │ you to help track team objectives and weekly goals...   ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                          [Cancel]  [Send Invitations →]    │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Multi-email input (newline or comma separated)
- [ ] Role selector with descriptions
- [ ] Team assignment dropdown
- [ ] Assessment checkbox
- [ ] Email preview
- [ ] Success toast with count
- [ ] Error handling for invalid emails

---

#### 15B-2: Team Member Welcome Email (3 pts)
**User Story**: As a team member receiving an invitation, I want to understand my role so that I know what's expected of me.

**Proposed Email**:
```
Subject: John invited you to join Acme Corporation on Karvia

Hi [Name],

John Smith has invited you to Acme Corporation's workspace on Karvia.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR ROLE: Employee

As an employee, you'll be able to:
• See your team's objectives and key results
• Track your weekly goals
• Complete assigned tasks
• Contribute to the company's health score

[Accept Invitation & Set Password →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTIONAL: Complete the SSI Assessment

Your perspective helps us understand the company culture.
The assessment takes about 10-15 minutes.

[Take Assessment →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions? Contact John at john@acme.com

— The Karvia Team
```

**Acceptance Criteria**:
- [ ] Role-specific content
- [ ] Clear role permissions listed
- [ ] Primary CTA: Accept invitation
- [ ] Secondary CTA: Take assessment (if applicable)
- [ ] Inviter's contact info
- [ ] Mobile responsive

---

#### 15B-3: Team Member Onboarding Screen (3 pts)
**User Story**: As a new team member, I want a quick orientation so that I understand how to use Karvia.

**First Login Screen**:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              👋 Welcome to Acme Corporation!                │
│                                                             │
│              Here's what you can do:                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📊 VIEW TEAM OBJECTIVES                                   │
│   See what your company is working toward                   │
│                                                             │
│   📋 TRACK WEEKLY GOALS                                     │
│   Check your assigned tasks for the week                    │
│                                                             │
│   ✅ COMPLETE TASKS                                         │
│   Mark tasks as done and track progress                     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   YOUR MANAGER: John Smith                                  │
│   YOUR TEAM: Operations                                     │
│                                                             │
│                   [Go to Dashboard]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Role-specific welcome screen
- [ ] 3 key actions explained
- [ ] Manager and team shown
- [ ] One-click to dashboard
- [ ] Shows only on first login
- [ ] Skippable

---

#### 15B-4: Consultant Can Invite on Behalf (2 pts)
**User Story**: As a consultant, I want to invite team members for my client so that I can accelerate their onboarding.

**Implementation**:
- Add "Invite Team" button to client card in My Clients tab
- Opens team invitation modal with client's company context
- Email mentions both consultant and business owner

**Acceptance Criteria**:
- [ ] "Invite Team" button on client card
- [ ] Modal pre-filled with client company
- [ ] Email mentions consultant's name
- [ ] Requires confirmation ("John will be notified")
- [ ] Activity logged for both consultant and client

---

### Epic 15C: Self-Service Signup Enhancement (8 pts)

#### 15C-1: Signup Page Redesign (3 pts)
**User Story**: As a business owner signing up directly, I want a simple process that shows me the value I'll get.

**Proposed Signup Flow**:
```
Step 1: Account
┌─────────────────────────────────────────────────────────────┐
│              Start Your Free Trial                          │
│              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│                                                             │
│   YOUR ACCOUNT                                              │
│   ┌───────────────────────────────────────────────────────┐│
│   │ Work Email *                                          ││
│   │ [john@acme.com                                      ] ││
│   └───────────────────────────────────────────────────────┘│
│   ┌───────────────────────────────────────────────────────┐│
│   │ Password *                                            ││
│   │ [••••••••••                                         ] ││
│   └───────────────────────────────────────────────────────┘│
│                                                             │
│   YOUR COMPANY                                              │
│   ┌───────────────────────────────────────────────────────┐│
│   │ Company Name *                                        ││
│   │ [Acme Corporation                                   ] ││
│   └───────────────────────────────────────────────────────┘│
│   ┌────────────────────────┐  ┌──────────────────────────┐ │
│   │ Industry *             │  │ Team Size *              │ │
│   │ [Technology       ▼]   │  │ [10-50             ▼]   │ │
│   └────────────────────────┘  └──────────────────────────┘ │
│                                                             │
│                       [Create Account →]                    │
│                                                             │
│   Already have an account? [Log in]                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Single-page signup (no multi-step)
- [ ] Email validation (work email encouraged)
- [ ] Password strength indicator
- [ ] Industry dropdown
- [ ] Team size dropdown
- [ ] Clear CTA
- [ ] Login link for existing users

---

#### 15C-2: Post-Signup Onboarding Wizard (5 pts)
**User Story**: As a new self-signup user, I want guided onboarding so that I know what to do first.

**Onboarding Steps**:
```
Step 1: Tell us about your company
Step 2: Take the SSI Assessment (or skip)
Step 3: Set your first objective
Step 4: Invite your team (or skip)
```

**Step 1: Company Context**
```
┌─────────────────────────────────────────────────────────────┐
│              Let's set up your workspace                    │
│              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│                                                             │
│              Step 1 of 4: About Your Company                │
│                                                             │
│   What does your company do? *                              │
│   ┌───────────────────────────────────────────────────────┐│
│   │ We build software for logistics companies to manage   ││
│   │ their fleet operations efficiently.                   ││
│   └───────────────────────────────────────────────────────┘│
│                                                             │
│   What's your primary goal for the next 12 months?          │
│   ┌───────────────────────────────────────────────────────┐│
│   │ Expand to 3 new cities with profitable operations    ││
│   └───────────────────────────────────────────────────────┘│
│                                                             │
│   What's your biggest challenge right now?                  │
│   ┌───────────────────────────────────────────────────────┐│
│   │ ○ Market Entry     ● Operations      ○ Team           ││
│   │ ○ Product          ○ Funding         ○ Other          ││
│   └───────────────────────────────────────────────────────┘│
│                                                             │
│                              [Skip]  [Continue →]           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] 4-step wizard with progress indicator
- [ ] Each step skippable
- [ ] Progress saved between steps
- [ ] Can return to complete later
- [ ] Final step shows dashboard preview
- [ ] Completion triggers celebration

---

### Epic 15D: Email Tie-In & Multi-User Support (7 pts)

#### 15D-1: Email Domain Validation (2 pts)
**User Story**: As a system, I want to link users to companies by email domain so that team members are automatically associated.

**Implementation**:
- When user signs up with @acme.com, check if company with acme.com exists
- If yes, offer to join existing company (with approval)
- If no, create new company

**Acceptance Criteria**:
- [ ] Email domain extraction on signup
- [ ] Check for existing company with same domain
- [ ] "Join existing company" flow
- [ ] Admin approval notification
- [ ] Works for invitations too

---

#### 15D-2: Join Request Flow (3 pts)
**User Story**: As a user whose company already exists, I want to request to join so that I don't create a duplicate company.

**Flow**:
```
User signs up with @acme.com
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Acme Corporation is already on Karvia          │
│                                                             │
│   It looks like your company already has a workspace.       │
│                                                             │
│   [Request to Join Acme Corporation]                        │
│                                                             │
│   or                                                        │
│                                                             │
│   [Create New Company]                                      │
│   (This will create a separate workspace)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Detect existing company by domain
- [ ] Show company name
- [ ] "Request to join" sends notification to admin
- [ ] Admin can approve/deny
- [ ] User notified of decision
- [ ] Alternative to create new company

---

#### 15D-3: Company Admin Approval Dashboard (2 pts)
**User Story**: As a business owner, I want to approve join requests so that I control who accesses my company data.

**Dashboard Widget**:
```
┌─────────────────────────────────────────────────────────────┐
│ PENDING JOIN REQUESTS                                    2  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ sarah@acme.com                              [Approve][Deny] │
│ Requested 2 hours ago                                       │
│                                                             │
│ mike@acme.com                               [Approve][Deny] │
│ Requested 1 day ago                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] Widget on dashboard for admins
- [ ] Shows requester email and time
- [ ] One-click approve/deny
- [ ] Email sent on decision
- [ ] History of past requests

---

## Story Summary

| Epic | Story | Points | Priority |
|------|-------|--------|----------|
| **15A** | 15A-1: Add Client Modal Redesign | 5 | P0 |
| **15A** | 15A-2: Value-Driven Welcome Email | 4 | P0 |
| **15A** | 15A-3: Assessment → Results Page | 5 | P0 |
| **15A** | 15A-4: Profile Completion Progress | 4 | P1 |
| **15B** | 15B-1: Invite Team Modal | 4 | P0 |
| **15B** | 15B-2: Team Member Welcome Email | 3 | P0 |
| **15B** | 15B-3: Team Member Onboarding | 3 | P1 |
| **15B** | 15B-4: Consultant Invites for Client | 2 | P1 |
| **15C** | 15C-1: Signup Page Redesign | 3 | P1 |
| **15C** | 15C-2: Post-Signup Wizard | 5 | P1 |
| **15D** | 15D-1: Email Domain Validation | 2 | P2 |
| **15D** | 15D-2: Join Request Flow | 3 | P2 |
| **15D** | 15D-3: Admin Approval Dashboard | 2 | P2 |
| | **Total** | **45** | |

---

## Dependencies

| Dependency | Status | Required For |
|------------|--------|--------------|
| Sprint 14 UI complete | Pending | All stories |
| Existing invitation APIs | ✅ Available | 15A, 15B |
| Email service configured | ✅ Available | 15A-2, 15B-2 |
| Company model fields | ✅ Available | All |
| User model fields | ✅ Available | All |

---

## Backend Impact Assessment

| Area | Changes Needed |
|------|----------------|
| Invitation model | Add `internal_notes` field |
| Email templates | New templates (4 total) |
| API routes | Minor updates to existing routes |
| New endpoints | None required |

**Key Finding**: Existing backend supports most flows. Changes are primarily UI and email templates.

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Client onboarding time | ~10 min | < 3 min |
| Assessment completion rate | ~60% | > 85% |
| First login within 48h | ~40% | > 70% |
| Team invitation rate | ~20% | > 50% |
| Profile completion | ~30% | > 75% |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Email deliverability | High | Use proven templates, test SPF/DKIM |
| User abandons wizard | Medium | Allow skip, save progress |
| Complex multi-company | Low | Clear domain detection logic |
| Over-engineering | Medium | Focus on P0 stories first |

---

**Document Version**: 1.0
**Created**: February 24, 2026
**Sprint**: 15 (Post Sprint 14)
