# Epic MC: My Clients Tab Redesign

**Sprint**: 14
**Points**: 25 pts (estimated)
**Priority**: P0
**Focus**: Consultant command center for client portfolio management

---

## Executive Summary

Transform the "My Clients" tab from a basic client list into the **Consultant's Command Center**—a single pane of glass for onboarding, monitoring, and operating across the client portfolio.

### Strategic Goals

1. **3-Step Onboarding Wizard**: Collect enough data to populate 75% of company profile
2. **Enhanced Client Cards**: Show Objective + SSI + Culture Score + Primary Contact
3. **Pre-populated Experience**: Business owners see a ready-to-use profile on first login
4. **AI-Ready Data**: iBrain generates highly relevant objectives from consultant-provided context

---

## Product Philosophy Alignment

> "Consultants are the bridge between business ambition and daily signals that increase the odds of success."

**My Clients** is the consultant's command center for:
1. **Onboarding new clients** into the Karvia ecosystem
2. **Monitoring client health** via cultural scores (SSI framework)
3. **Conducting operations** across the client portfolio

---

## Feature Breakdown

### MC1: 3-Step Client Onboarding Wizard (10 pts)

**Description**: Replace simple modal with 3-step wizard that populates company profile

#### Step 1: Company Identity (Basic Info)

**Fields Collected**:
| Field | Maps To | Required |
|-------|---------|----------|
| Company Name | `company.name` | Yes |
| Industry | `company.industry` | Yes |
| Company Size | `company.employee_count` | Yes |
| What they do | `business_context.profile.description` | Yes |
| Business Model | `business_context.profile.business_model` | No |
| Founded Year | `business_context.profile.founded_year` | No |

**UI Spec**:
```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1 of 3: Company Identity                    [Cancel][Next]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Company Name *                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Industry *                        Company Size *                │
│  ┌─────────────────────────┐       ┌─────────────────────────┐  │
│  │ ▼ Select industry       │       │ ▼ Select size           │  │
│  └─────────────────────────┘       └─────────────────────────┘  │
│                                                                  │
│  What does this company do? *                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Business Model               Founded Year                       │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │ ▼ B2B / B2C / Hybrid    │  │ 2024                        │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
│                                                                  │
│  ────────────────────────────────────────────────────────────   │
│  📊 Profile Completion: ████████░░░░░░░░░░░░ 40%                │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 2: Strategic Context (Objective Foundation)

**Fields Collected**:
| Field | Maps To | Required |
|-------|---------|----------|
| Primary 12-month goal | `business_context.strategic_vision.priority_one` | Yes |
| Key Challenge | `business_context.strategic_vision.biggest_blocker` | Yes |
| Target Market | `business_context.profile.target_market` | No |
| Revenue Stage | `business_context.metrics.current.revenue_stage` | No |

**Challenge Options** (predefined):
- Market Entry / Customer Acquisition
- Product Development / Innovation
- Team Building / Talent
- Operational Efficiency
- Cash Flow / Funding
- Partnership Development
- Other (free text)

**UI Spec**:
```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2 of 3: Strategic Context                    [Back][Next] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  💡 This helps iBrain generate relevant objectives              │
│                                                                  │
│  What is the primary goal for the next 12 months? *              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Set up miMobi in Bangalore with 1 paying customer         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Key Challenge Right Now *                                       │
│  ┌─────────────────────────┐                                    │
│  │ ▼ Market Entry          │                                    │
│  └─────────────────────────┘                                    │
│                                                                  │
│  Target Market                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Mid-size logistics companies in India                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Current Revenue Stage                                           │
│  ○ Pre-revenue  ● Early (<$100K)  ○ Growth  ○ Scale  ○ Enter.  │
│                                                                  │
│  ────────────────────────────────────────────────────────────   │
│  📊 Profile Completion: ████████████████░░░░ 75%                │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 3: Contact & Assessment Setup

**Fields Collected**:
| Field | Maps To | Required |
|-------|---------|----------|
| First Name | `user.first_name` | Yes |
| Last Name | `user.last_name` | Yes |
| Email | `user.email` | Yes |
| Role | `user.title` | No |
| Send Assessment | Creates invitation | Optional |
| Assessment Template | `invitation.assessment_template_id` | Optional |

**UI Spec**:
```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3 of 3: Contact & Assessment            [Back][Create]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PRIMARY CONTACT (Business Owner)                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  First Name *           Last Name *                        │  │
│  │  ┌─────────────────┐    ┌─────────────────┐               │  │
│  │  │ Ravindra        │    │ MD              │               │  │
│  │  └─────────────────┘    └─────────────────┘               │  │
│  │                                                            │  │
│  │  Email *                            Role                   │  │
│  │  ┌─────────────────────────┐        ┌─────────────────┐   │  │
│  │  │ ravindra@mimobi.in      │        │ ▼ Founder/CEO   │   │  │
│  │  └─────────────────────────┘        └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  INITIAL ASSESSMENT                                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ☑️ Send SSI Assessment to Business Owner                 │  │
│  │     → Helps generate better objectives                    │  │
│  │                                                            │  │
│  │  Template: ┌────────────────────────────────────────┐     │  │
│  │            │ ▼ Quick Start SSI (15 questions, 5 min)│     │  │
│  │            └────────────────────────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ────────────────────────────────────────────────────────────   │
│  📊 Profile Completion: ████████████████████ 95%                │
│  ✅ Ready for AI-powered objective generation                   │
└─────────────────────────────────────────────────────────────────┘
```

**Acceptance Criteria**:
- [ ] 3-step wizard with progress indicator
- [ ] Step 1: Company identity fields with validation
- [ ] Step 2: Strategic context with challenge dropdown
- [ ] Step 3: Contact info + optional assessment
- [ ] Profile completion percentage shown live
- [ ] Back/Next navigation between steps
- [ ] Cancel closes wizard without saving
- [ ] Create saves all data in single transaction
- [ ] Welcome email sent with login credentials
- [ ] If assessment checked, invitation created

---

### MC2: Enhanced Client Card Design (8 pts)

**Description**: Redesign client cards to show Objective, SSI, Culture Score, and Contact

**Card Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                              miMobi                       🟢    │
│                       Technology / SaaS                          │
│                                                                  │
├────────────────────────────────┬────────────────────────────────┤
│                                │                                 │
│  ┌───────────────────────────┐ │        Ravindra MD             │
│  │  Objective:               │ │        # primary Contact       │
│  │                           │ │                                 │
│  │  "Set up miMobi in        │ │              ┌──────────┐      │
│  │   Bangalore with 1        │ │              │          │      │
│  │   paying customer"        │ │              │   👤     │ 🟢   │
│  │                           │ │              │          │      │
│  └───────────────────────────┘ │              └──────────┘      │
│                                │                                 │
│  ┌─────────┐  ┌─────────────┐  │        [Message]    [Nudge]    │
│  │   SSI   │  │  Cultural   │  │                                 │
│  │         │  │   Score     │  │                                 │
│  │  7-8-5  │  │     😐      │  │                                 │
│  │ ⚡🛡️🧠  │  │  iBrain    │  │                                 │
│  └─────────┘  └─────────────┘  │                                 │
│                                │                                 │
└────────────────────────────────┴────────────────────────────────┘
```

**Data Elements**:
| Element | Source | Description |
|---------|--------|-------------|
| Company Name | `company.name` | Primary identifier |
| Industry | `company.industry` (formatted) | Context |
| Status Dot | Computed from activity | 🟢🟡🔴 |
| Objective | `business_context.strategic_vision.priority_one` | Current focus |
| SSI Scores | `assessment_scores.{speed,strength,intelligence}_score` | 3 numbers |
| Culture Score | Overall SSI → emoji | 😊😐😟 |
| iBrain Badge | Show if iBrain enabled | Branding |
| Contact Name | Primary BUSINESS_OWNER user | Who to reach |
| Contact Photo | `user.avatar_url` or initials | Personal touch |
| Contact Status | `user.last_login` → activity | 🟢 online indicator |
| Message | `mailto:` link | Quick action |
| Nudge | Reminder trigger | Follow-up action |

**Culture Score Emoji Mapping**:
| SSI Range | Emoji | Label |
|-----------|-------|-------|
| 80-100 | 😊 | Thriving |
| 60-79 | 🙂 | Healthy |
| 40-59 | 😐 | Developing |
| 20-39 | 😟 | Needs Attention |
| 0-19 | 😰 | Critical |
| No data | ❓ | Not Assessed |

**Acceptance Criteria**:
- [ ] Card shows company name, industry, status dot
- [ ] Objective displayed from strategic_vision.priority_one
- [ ] SSI shown as 3 numbers (Speed-Strength-Intelligence)
- [ ] Culture score shown as emoji
- [ ] iBrain badge shown if enabled
- [ ] Primary contact with photo/initials
- [ ] Message button opens email
- [ ] Nudge button creates reminder
- [ ] Click card opens drill-down
- [ ] 6 cards per row on desktop, 2 on mobile

---

### MC3: Portfolio Overview Header (4 pts)

**Description**: Add portfolio-level stats and filters

**Header Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│  MY CLIENTS                                       [+ Add Client] │
├─────────────────────────────────────────────────────────────────┤
│  📊 PORTFOLIO OVERVIEW                                           │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │ 6 Clients │ │ 4 Active  │ │ 1 At Risk │ │ 68 Avg    │        │
│  │ Total     │ │ 🟢        │ │ 🟡        │ │ SSI Score │        │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
├─────────────────────────────────────────────────────────────────┤
│ [All] [Active] [Onboarding] [Needs Attention]  🔍 Search  ⚙️ Sort│
└─────────────────────────────────────────────────────────────────┘
```

**Stats Calculated**:
- Total Clients: Count of companies in `managed_businesses`
- Active: Status = active, activity in last 30 days
- At Risk: SSI dropped >10 pts OR no activity 14+ days
- Avg SSI: Mean of all client overall SSI scores

**Filters**:
- All: Show all clients
- Active: status = active
- Onboarding: status = onboarding OR invited
- Needs Attention: at_risk flag OR overdue assessments

**Acceptance Criteria**:
- [ ] Stats bar with 4 KPI boxes
- [ ] Filter chips (All/Active/Onboarding/Needs Attention)
- [ ] Search by company name or contact name
- [ ] Sort by: Name, SSI Score, Last Activity, Date Added

---

### MC4: Message & Nudge Actions (3 pts)

**Description**: Quick communication actions from client card

**Message Action**:
- Opens default email client
- Pre-fills: To, Subject ("Following up on [Company] progress")
- Logs activity in consultant's activity log

**Nudge Action**:
- Creates reminder for consultant
- Options: "In 1 day", "In 3 days", "In 1 week", "Custom"
- Shows toast: "Reminder set for [date]"
- Appears in consultant's dashboard

**Acceptance Criteria**:
- [ ] Message opens mailto: with pre-filled subject
- [ ] Nudge shows dropdown with timing options
- [ ] Reminder stored in database
- [ ] Toast confirmation shown
- [ ] Activity logged for both actions

---

## API Specifications

### Enhanced Create Client Endpoint

**Endpoint**: `POST /api/consultant/create-client`

**Request Body**:
```json
{
  "step1": {
    "company_name": "miMobi",
    "industry": "technology",
    "employee_count": 25,
    "description": "SaaS reseller for Swiss Mobility in India",
    "business_model": "b2b_reseller",
    "founded_year": 2024
  },
  "step2": {
    "priority_one": "Set up miMobi in Bangalore with 1 paying customer",
    "biggest_blocker": "market_entry",
    "target_market": "Mid-size logistics companies in India",
    "revenue_stage": "early_revenue"
  },
  "step3": {
    "first_name": "Ravindra",
    "last_name": "MD",
    "email": "ravindra@mimobi.in",
    "role": "founder_ceo",
    "send_assessment": true,
    "template_id": "ObjectId(...)"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "company_id": "ObjectId(...)",
    "company_name": "miMobi",
    "user_id": "ObjectId(...)",
    "user_email": "ravindra@mimobi.in",
    "profile_completion": 75,
    "invitation_sent": true,
    "assessment_sent": true
  }
}
```

**Backend Logic**:
1. Validate all required fields
2. Check company name uniqueness
3. Create Company with populated `business_context`
4. Create User with BUSINESS_OWNER role
5. Add company to consultant's `managed_businesses`
6. Create Invitation record
7. If `send_assessment`: create assessment invitation
8. Send welcome email with credentials
9. Return success with profile completion percentage

---

### Portfolio Summary Endpoint (Enhanced)

**Endpoint**: `GET /api/consultant/portfolio-summary`

**Response** (per client):
```json
{
  "_id": "ObjectId(...)",
  "name": "miMobi",
  "industry": "technology",
  "industry_formatted": "Technology / SaaS",
  "employee_count": 25,
  "status": "active",
  "objective": "Set up miMobi in Bangalore with 1 paying customer",
  "ssi": {
    "overall": 67,
    "speed": 70,
    "strength": 80,
    "intelligence": 50,
    "culture_emoji": "😐"
  },
  "primary_contact": {
    "user_id": "ObjectId(...)",
    "name": "Ravindra MD",
    "email": "ravindra@mimobi.in",
    "avatar_url": null,
    "last_active": "2026-02-22T10:30:00Z",
    "is_online": false
  },
  "stats": {
    "teams": 2,
    "assessments": 5,
    "objectives": 3
  },
  "flags": {
    "at_risk": false,
    "needs_assessment": false,
    "profile_incomplete": false
  },
  "created_at": "2026-01-15T00:00:00Z",
  "last_activity": "2026-02-20T14:00:00Z"
}
```

---

## Data Flow: Onboarding → AI Objectives

```
┌─────────────────────┐
│  CONSULTANT         │
│  3-Step Wizard      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│  COMPANY PROFILE (75% Complete)                              │
│                                                              │
│  business_context.profile:                                   │
│    - description: "SaaS reseller for Swiss Mobility..."     │
│    - business_model: "b2b_reseller"                         │
│    - target_market: "Mid-size logistics companies"          │
│                                                              │
│  business_context.strategic_vision:                          │
│    - priority_one: "Set up in Bangalore with 1 customer"    │
│    - biggest_blocker: "market_entry"                        │
│                                                              │
│  business_context.metrics.current:                           │
│    - revenue_stage: "early_revenue"                         │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────┐      ┌─────────────────────┐
│  BUSINESS OWNER     │      │  SSI ASSESSMENT     │
│  First Login        │─────▶│  (Optional)         │
└─────────┬───────────┘      └─────────┬───────────┘
          │                            │
          │                            ▼
          │               ┌─────────────────────┐
          │               │  assessment_scores   │
          │               │  - speed: 70         │
          │               │  - strength: 80      │
          │               │  - intelligence: 50  │
          │               └─────────┬───────────┘
          │                         │
          ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│  AIContextService.buildContext()                             │
│                                                              │
│  Layer 1 (P0): Company profile + SSI                        │
│  Layer 2 (P1): Strategic vision + Blockers                  │
│  Layer 3 (P2): Industry templates                           │
│                                                              │
│  Total: ~2500 tokens of rich context                        │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│  iBrain Generates Objective                                  │
│                                                              │
│  Category: Market Entry / Customer Acquisition               │
│                                                              │
│  Objective: "Set up miMobi in Bangalore with 1 paying       │
│              customer"                                       │
│                                                              │
│  Key Results:                                                │
│  1. Identify 20 target logistics companies by Q1            │
│  2. Conduct 10 demo calls with decision makers              │
│  3. Close 1 paying customer with 12-month contract          │
│  4. Achieve $10K MRR by end of Q2                           │
│                                                              │
│  Reasoning: "Based on your market entry challenge and       │
│  B2B reseller model, focusing on a single vertical          │
│  (logistics) increases odds of early success..."            │
└─────────────────────────────────────────────────────────────┘
```

---

## Files to Create/Modify

### Frontend

| File | Action | Description |
|------|--------|-------------|
| `client/pages/assessment-hub.html` | Modify | Add onboarding wizard modal |
| `client/pages/scripts/assessment-hub.js` | Modify | Wizard logic, card rendering |
| `client/js/components/client-onboarding-wizard.js` | Create | 3-step wizard component |
| `client/css/my-clients.css` | Create | Client card styles |

### Backend

| File | Action | Description |
|------|--------|-------------|
| `server/routes/consultant.js` | Modify | Enhanced create-client endpoint |
| `server/routes/consultant.js` | Modify | Enhanced portfolio-summary |
| `server/services/ClientOnboardingService.js` | Create | Onboarding business logic |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Profile Completion | ≥75% | On client creation |
| Objective Relevance | ≥80% approval | Business owner accepts AI objective |
| Onboarding Time | <3 min | Wizard completion time |
| Card Glanceability | <5 sec | Time to understand client status |

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| AIContextService | ✅ Complete (S13) | Provides buildContext() |
| Company.business_context | ✅ Complete (S10) | Schema ready |
| iBrain feature flag | ✅ Complete | Graceful fallback |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wizard too long | Users abandon | Keep to 3 steps, auto-save |
| AI objectives irrelevant | Trust loss | Show reasoning, allow edit |
| SSI not taken | Missing culture score | Show placeholder, nudge |

---

## Sprint 14 Integration

This epic replaces some of the original Sprint 14 scope:

| Original Epic | Points | Status |
|--------------|--------|--------|
| I: iBrain Visual Identity | 15 | Keep (reduced) |
| M: Marketing | 15 | Defer to S15 |
| S: Dashboard Enhancement | 8 | Keep |
| D: Dashboard Intelligence | 15 | Defer to S15 |
| **MC: My Clients Redesign** | **25** | **NEW** |

**New Sprint 14 Scope**: 48 pts (I: 10 + S: 8 + MC: 25 + BF: 5)

---

**Document Version**: 1.0
**Created**: February 23, 2026
**Author**: Strategy Session
