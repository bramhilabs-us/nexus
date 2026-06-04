# My Clients Page - Technical Specification

<!-- @GENOME T3-SPR-022-MC1 | ACTIVE | 2026-04-21 | parent:T3-SPR-022 | auto:/coding | linked:/strategy -->

**Sprint**: 22 - Beta_Final
**Feature**: Consultant "My Clients" Page
**Created**: April 21, 2026 (Session #171)
**Updated**: April 21, 2026 (Session #171 - Finalized)
**Priority**: P0 - Consultant primary workspace
**Visible to**: CONSULTANT role only
**Mockup**: `sprint_mockups/sprint-22/my-clients.html`

---

## UI Priority

| Must Feel | Avoid |
|-----------|-------|
| Executive clean | Dense tables |
| Premium SaaS | Too much text |
| Fast scanning | Generic CRM clutter |
| Action-oriented | |

**Design Language**: Minimal chrome, generous whitespace, clear hierarchy, bold metrics.
**Primary Color**: Navy `#1e3a5f` (consistent with SSI reports)

---

## Page Structure (Vertical Layout)

```
1. KPI Header Row (4 cards)
2. Action Row (Search + Filter + Add Client)
3. Client Tiles Grid (3-col desktop, 2-col tablet, 1-col mobile)
4. Tile Click → Client Detail View (drawer or route)
```

---

## 1. KPI Header Row

4 KPI cards across top (desktop), stack on mobile.

| KPI | Label | Value Source | Color |
|-----|-------|--------------|-------|
| **Clients** | Total count | `clients.length` | Gray |
| **Need Attention** | Clients needing follow-up | Count where `riskStatus !== 'healthy'` | Amber |
| **Avg SSI** | Portfolio health | `avg(client.ssi_score)` | Green/Amber/Red by score |
| **At Risk** | Urgent clients | Count where `riskStatus === 'urgent'` | Red |

---

## 2. Action Row

| Component | Behavior |
|-----------|----------|
| **Search Input** | Search by: company name, contact name, industry |
| **Filter Dropdown** | Options: All Stages, Prospect, Onboarding, In Progress, Completed, Sustained |
| **+ Add Client** | Navy button, opens Add Client Wizard modal |

---

## 3. Client Journey Stages

The client lifecycle through the consulting engagement:

| Stage | Color | Border | Badge BG | Description |
|-------|-------|--------|----------|-------------|
| **Prospect** | Pink `#EC4899` | `border-left: 3px solid #EC4899` | `bg-pink-50 text-pink-700` | Potential client being pursued |
| **Onboarding** | Gray `#9CA3AF` | `border-left: 3px solid #9CA3AF` | `bg-gray-100 text-gray-600` | Starting engagement, no assessments yet |
| **Objective Identified** | Purple `#8B5CF6` | `border-left: 3px solid #8B5CF6` | `bg-purple-50 text-purple-700` | Goals defined, ready for execution |
| **Handed Off** | Blue `#3B82F6` | `border-left: 3px solid #3B82F6` | `bg-blue-50 text-blue-700` | Transitioned to client execution |
| **In Progress** | Amber `#F59E0B` | `border-left: 3px solid #F59E0B` | `bg-amber-50 text-amber-700` | Actively working on objectives |
| **Completed** | Green `#10B981` | `border-left: 3px solid #10B981` | `bg-emerald-50 text-emerald-700` | Objectives achieved |
| **Sustained** | Dark Green `#059669` | `border-left: 3px solid #059669` | `bg-emerald-50 text-emerald-700` | Ongoing success, maintenance mode |

---

## 4. Client Tile Structure (Finalized)

### Visual Layout
```
┌─────────────────────────────────────────────────────┐
│ ┌────┐                                    ┌────┐   │
│ │Logo│  Company Name                      │ 78 │   │  ← SSI Donut
│ │ R  │  Contact Name                      │SSI │   │
│ └────┘                                    └────┘   │
│                                                     │
│ ┌─────────────────────────────────────────────────┐│
│ │ Objectives                           4 total    ││  ← Objectives Rectangle
│ │ ████████████░░░░░░░░                           ││  ← Stacked progress bar
│ │ 2 on track  1 at risk  1 behind                ││
│ └─────────────────────────────────────────────────┘│
│                                                     │
│ [In Progress]                        3/3 assessed  │  ← Stage badge + assessment count
│─────────────────────────────────────────────────────│
│   Notes    │    Nudge ▼    │    Assess            │  ← Action buttons
└─────────────────────────────────────────────────────┘
```

### Section 1: Header Row
- **Company Logo**: 40x40px rounded square, gradient background with initial
- **Company Name**: `text-sm font-semibold text-gray-900`
- **Contact Name**: `text-xs text-gray-400`
- **SSI Donut**: 40x40px SVG donut chart
  - Score number: `text-[10px] font-bold` (color by score)
  - "SSI" label: `text-[7px] text-gray-400` below score
  - Green `#10B981` for 70+, Amber `#F59E0B` for 50-69, Red for <50
  - Empty state: `—` with gray color

### Section 2: Objectives Rectangle
- Background: `bg-gray-50 rounded-lg p-3`
- Header: "Objectives" label + "X total" count
- **Stacked Progress Bar**: 6px height, rounded
  - Green `bg-emerald-500`: On track
  - Amber `bg-amber-400`: At risk
  - Red `bg-red-400`: Behind
  - Gray `bg-gray-200`: No objectives
- Status text: `text-xs` with color-coded counts
- Empty state: "Pending engagement" or "No objectives set yet"

### Section 3: Stage & Assessment Row
- **Stage Badge**: Rounded pill with stage color (see Stage table above)
- **Assessment Count**: `X/Y assessed` in `text-xs text-gray-400`
- Empty state: "Not started"

### Section 4: Action Row (Bottom)
Three equal-width buttons separated by vertical dividers:

| Button | Icon | Behavior |
|--------|------|----------|
| **Notes** | Edit icon | Opens notes drawer/modal |
| **Nudge** | Bell icon | Dropdown with: "Send Reminder" (expandable for Chat, Text later) |
| **Assess** | Chart icon | Navigate to assessment page for this client |

---

## 5. Nudge Dropdown

Hover-activated dropdown above the Nudge button:

```html
<div class="nudge-wrap">
    <div class="nudge-menu">  <!-- Shows on hover -->
        <div class="nudge-item">Send Reminder</div>
        <!-- Future: Chat, Send Text -->
    </div>
    <button class="tile-action">Nudge</button>
</div>
```

**Future expansion**: Add "Chat" and "Send Text" options when messaging features are implemented.

---

## 6. Add Client Wizard

### Trigger
Navy "Add Client" button in Action Row.

### Modal Structure
3-step wizard with progress indicator.

### Step 1: Company Information
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Company Name | Text | Yes | Min 2 chars |
| Industry | Dropdown | Yes | From industry list |
| Company Size | Dropdown | Yes | 1-10, 11-50, 51-200, 201-500, 500+ |
| Website | URL | No | Valid URL format |

### Step 2: Primary Contact
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Contact Name | Text | Yes | Min 2 chars |
| Job Title | Text | No | - |
| Email | Email | Yes | Valid email format |
| Phone | Phone | No | Valid phone format |

### Step 3: Initial Stage
| Field | Type | Required | Default |
|-------|------|----------|---------|
| Stage | Radio buttons | Yes | Prospect |
| Notes | Textarea | No | - |
| Send Welcome Email | Checkbox | No | Unchecked |

### Wizard Actions
- **Back**: Previous step (disabled on Step 1)
- **Next**: Validate and proceed
- **Cancel**: Close modal, discard changes
- **Create Client**: Final step, creates client and closes modal

### API Call
```
POST /api/consultant/clients
```

Request body:
```json
{
  "company": {
    "name": "Greenway Landscaping",
    "industry": "landscaping",
    "size": "11-50",
    "website": "https://greenway.com"
  },
  "primaryContact": {
    "name": "Tom Richards",
    "title": "Owner",
    "email": "tom@greenway.com",
    "phone": "555-123-4567"
  },
  "stage": "prospect",
  "notes": "Met at trade show",
  "sendWelcomeEmail": false
}
```

---

## 7. API Requirements

### Existing Endpoint (Extend)
```
GET /api/consultant/portfolio-summary
```

### Enhanced Response Fields
```js
{
  // Existing fields...
  _id: "company_id",
  name: "R&R Homes",
  industry: "construction",
  size: "51-200",
  logo: null,

  // NEW fields
  stage: "in_progress",           // prospect|onboarding|objective_identified|handed_off|in_progress|completed|sustained
  primaryContact: {
    name: "Robert Chen",
    title: "Operations Manager"
  },
  ssi: {
    overall: 78,                  // Latest SSI score
    dimensions: {
      speed: 72,
      strength: 81,
      intelligence: 80
    }
  },
  objectives: {
    total: 4,
    onTrack: 2,
    atRisk: 1,
    behind: 1
  },
  assessments: {
    completed: 3,
    total: 3
  },
  riskStatus: "healthy",          // healthy|needs_followup|urgent
  lastActivity: {
    date: "2026-04-18",
    description: "Completed Q2 Assessment"
  }
}
```

### New Endpoint: KPIs
```
GET /api/consultant/portfolio-kpis
```

Response:
```json
{
  "totalClients": 7,
  "needAttention": 3,
  "avgSSI": 72,
  "atRisk": 2
}
```

### New Endpoint: Create Client
```
POST /api/consultant/clients
```

See Add Client Wizard section for request/response format.

---

## 8. Files to Create/Modify

| File | Action | Points | Description |
|------|--------|--------|-------------|
| `client/pages/my-clients.html` | CREATE | 8 | Main page with KPIs, tiles, wizard |
| `client/pages/scripts/my-clients.js` | CREATE | 5 | Page logic, API calls, wizard |
| `client/js/navigation.js` | MODIFY | 1 | Add My Clients as first nav item |
| `server/routes/consultant.js` | MODIFY | 5 | Extend portfolio-summary, add KPIs, add create client |
| `server/models/Company.js` | MODIFY | 2 | Add stage, primaryContact fields |

**Total Estimated Points**: 21

---

## 9. Navigation Change

**File**: `client/js/navigation.js`

```js
CONSULTANT: [
    { label: 'My Clients', href: '/pages/my-clients.html', enabled: true },  // NEW - FIRST
    { label: 'Dashboard', href: '/pages/dashboard-v2.html', enabled: true },
    { label: 'Objectives', href: '/pages/objectives.html', enabled: true },
    { label: 'Assessments', href: '/pages/assessment-hub.html', enabled: true },
    { label: 'Teams', href: '/pages/teams.html', enabled: true },
    { label: 'Planning', href: '/pages/planning-v2.html', enabled: true }
],
```

---

## 10. Implementation Phases

### Phase 1: Core Page (8 pts)
- Create `my-clients.html` with layout from mockup
- KPI header row (static initially)
- Client tiles grid with finalized tile structure
- SSI donut component
- Objectives rectangle component
- Navigation update

### Phase 2: API Enhancement (5 pts)
- Extend `/api/consultant/portfolio-summary` with new fields
- Add `/api/consultant/portfolio-kpis` endpoint
- Add stage and primaryContact to Company model
- Calculate objectives breakdown server-side

### Phase 3: Add Client Wizard (5 pts)
- 3-step modal wizard
- Form validation
- POST `/api/consultant/clients` endpoint
- Welcome email trigger (optional)

### Phase 4: Interactions (3 pts)
- Search/filter functionality
- Nudge dropdown with Send Reminder
- Tile click → client detail view

---

## 11. Style Reference

Use existing `s13-patterns.css`:
- Navy: `--ssi-navy: #1e3a5f`
- Cards: `.k-card` pattern
- Buttons: `.ssi-btn-navy`
- Badges: `.k-badge`

Tailwind classes for rapid prototyping, migrate to s13-patterns for production.

---

## 12. Responsive Behavior

| Breakpoint | Grid | KPIs |
|------------|------|------|
| Desktop (≥1024px) | 3 columns | 4 in row |
| Tablet (768-1023px) | 2 columns | 2x2 grid |
| Mobile (<768px) | 1 column | Stack vertical |

---

**Created by**: Strategy Session #171
**Finalized by**: Session #171 (Mockup iteration)
**Mockup Location**: `KARVIA_STRATEGY/3-DELIVERY/1-SPRINTS/sprint_mockups/sprint-22/my-clients.html`
**Next Action**: /coding - Begin Phase 1
