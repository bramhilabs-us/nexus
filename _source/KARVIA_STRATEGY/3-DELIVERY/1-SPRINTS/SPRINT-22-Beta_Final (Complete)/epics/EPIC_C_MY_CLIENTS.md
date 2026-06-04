# Epic C: My Clients Page

<!-- @GENOME T3-SPR-022-EC | ACTIVE | 2026-04-29 | parent:T3-SPR-022-MP | auto:/coding | linked:/design -->

**Sprint**: 22 - Beta_Final
**Epic**: C - My Clients Page
**Points**: 21
**Priority**: P0
**Dependencies (D-C-2)**: Epic 0 (Pre-Work). Phase 1 + 4 can start parallel to F. Phase 2 needs Epic A complete (Company field additions, Objective+KeyResult aggregations). Phase 3 needs Epic F complete (`enrichCompany()`).

---

## Overview

Consultant primary workspace showing all client companies with KPIs, journey stages, and quick actions. This is the first page consultants see when logging in.

**Mockup**: [my-clients.html](../../sprint_mockups/sprint-22/my-clients.html)

---

## UI Philosophy

| Must Feel | Avoid |
|-----------|-------|
| Executive clean | Dense tables |
| Premium SaaS | Too much text |
| Fast scanning | Generic CRM clutter |
| Action-oriented | |

**Design Language**: Minimal chrome, generous whitespace, clear hierarchy, bold metrics.
**Primary Color**: Navy `#1e3a5f` (consistent with SSI reports)

---

## Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  KPI Header Row (4 cards)                                        │
├─────────────────────────────────────────────────────────────────┤
│  Action Row: [Search] [Filter ▼] [+ Add Client]                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Client Tile │  │ Client Tile │  │ Client Tile │              │
│  │   3-col     │  │    Grid     │  │  Desktop    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Client Tile │  │ Client Tile │  │ Client Tile │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. KPI Header Row

4 KPI cards across top (desktop), stack on mobile.

| KPI | Label | Value Source | Color |
|-----|-------|--------------|-------|
| **Clients** | Total count | `clients.length` | Gray |
| **Need Attention** | Clients needing follow-up | Count where `riskStatus !== 'healthy'` | Amber |
| **Avg SSI** | Portfolio health | `avg(client.ssi.overall)` | Green/Amber/Red by score |
| **At Risk** | Urgent clients | Count where `riskStatus === 'urgent'` | Red |

### riskStatus Formula (D-C-5 — computed at read time, not stored)

| Status | Conditions (any) |
|--------|------------------|
| `urgent` | (a) no completed assessment in last 90d, OR (b) avgSSI < 50, OR (c) any objective `behind` for 30+ days |
| `at_risk` | (a) avgSSI in [50, 65], OR (b) ≥50% of objectives in `at_risk` status |
| `healthy` | otherwise |

Computed in the `/portfolio-summary` aggregation pipeline. No `risk_status` column on Company.

---

## 2. Client Journey Stages

The client lifecycle through the consulting engagement:

| Stage | Color | Border | Badge Style | Description |
|-------|-------|--------|-------------|-------------|
| **Prospect** | Pink `#EC4899` | `border-left: 3px solid #EC4899` | `bg-pink-50 text-pink-700` | Potential client being pursued |
| **Onboarding** | Gray `#9CA3AF` | `border-left: 3px solid #9CA3AF` | `bg-gray-100 text-gray-600` | Starting engagement |
| **Objective Identified** | Purple `#8B5CF6` | `border-left: 3px solid #8B5CF6` | `bg-purple-50 text-purple-700` | Goals defined |
| **Handed Off** | Blue `#3B82F6` | `border-left: 3px solid #3B82F6` | `bg-blue-50 text-blue-700` | Transitioned to client |
| **In Progress** | Amber `#F59E0B` | `border-left: 3px solid #F59E0B` | `bg-amber-50 text-amber-700` | Actively working |
| **Completed** | Green `#10B981` | `border-left: 3px solid #10B981` | `bg-emerald-50 text-emerald-700` | Objectives achieved |
| **Sustained** | Dark Green `#059669` | `border-left: 3px solid #059669` | `bg-emerald-50 text-emerald-700` | Maintenance mode |

---

## 3. Client Tile Structure

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
│ [In Progress]                        3/3 assessed  │  ← Stage badge + assessment
│─────────────────────────────────────────────────────│
│   Notes    │    Nudge ▼    │    Assess            │  ← Action buttons
└─────────────────────────────────────────────────────┘
```

### SSI Donut Component

```html
<div class="relative w-10 h-10">
    <svg viewBox="0 0 36 36" class="w-full h-full">
        <path class="text-gray-200" stroke="currentColor" stroke-width="3" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
        <path class="text-emerald-500" stroke="currentColor" stroke-width="3" fill="none"
              stroke-dasharray="78, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-[10px] font-bold text-emerald-600 leading-none">78</span>
        <span class="text-[7px] text-gray-400 leading-none mt-0.5">SSI</span>
    </div>
</div>
```

### Objectives Rectangle

```html
<div class="bg-gray-50 rounded-lg p-3">
    <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-medium text-gray-600">Objectives</span>
        <span class="text-xs text-gray-400">4 total</span>
    </div>
    <div class="h-1.5 rounded-full overflow-hidden flex bg-gray-200">
        <div class="bg-emerald-500" style="width: 50%"></div>
        <div class="bg-amber-400" style="width: 25%"></div>
        <div class="bg-red-400" style="width: 25%"></div>
    </div>
    <div class="flex justify-between mt-2 text-xs">
        <span class="text-emerald-600">2 on track</span>
        <span class="text-amber-600">1 at risk</span>
        <span class="text-red-600">1 behind</span>
    </div>
</div>
```

---

## 4. Action Buttons

Three equal-width buttons at tile bottom:

| Button | Icon | Behavior (S22) |
|--------|------|----------------|
| **Notes** | Edit icon | D-C-12 — opens modal showing read-only `Company.notes` + textarea. If `PUT /api/companies/:id` exists, save updates `notes`; otherwise stub (button-only, no save) |
| **Nudge** | Bell icon | D-C-11 — dropdown opens; "Send Reminder" shows toast `"Reminder sent"` (stub-only; real email descoped to S23) |
| **Assess** | Chart icon | Navigate to assessment page (existing flow) |

### Nudge Dropdown

```html
<div class="nudge-wrap relative">
    <div class="nudge-menu absolute bottom-full left-0 mb-1 hidden group-hover:block">
        <div class="bg-white rounded shadow-lg border p-1">
            <button class="nudge-item">Send Reminder</button>
            <!-- Future: Chat, Send Text -->
        </div>
    </div>
    <button class="tile-action">Nudge ▼</button>
</div>
```

---

## 5. Add Client Wizard

**2-step modal wizard with AI auto-fill**, triggered by `#btn-add-client` on the My Clients page.

**Mockup**: [add-client-wizard.html](../../sprint_mockups/sprint-22/add-client-wizard.html) (shows 3 panes: Step 1 entry, Step 1 loading, Step 2 review)
**Implementation**: Modal injected into `client/pages/my-clients.html` DOM. No separate route. Implementation script: `client/pages/scripts/add-client-wizard.js` (NEW).

**Canonical design (Session #167 brainstorm)**:
- 2 steps with AI auto-fill (NOT 3 manual steps).
- Step 1 collects company name + optional website.
- AI enriches industry, size, description, founded year, HQ, revenue range, signals, suggested SSI focus, suggested assessment template, and primary contact (from website team page + LinkedIn).
- Step 2 lets the consultant review/edit AI-filled fields, add primary contact (often pre-suggested), select initial stage, and confirm.

> Earlier drafts of this spec listed a 3-step manual form. That version is **superseded** by the 2-step AI flow per Sprint 22 handoff lines 462, 482, 621, 627, 635-636.

---

### Step 1: Find Company

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Company Name | Text | Yes | Min 2 chars |
| Website | URL | No | Valid URL format. Improves enrichment quality. |

**Primary action**: `[✨ Search & Auto-Fill with AI]` → calls `POST /api/consultant/clients/enrich`
**Secondary action**: "Skip AI and enter details manually" link → jumps to Step 2 with empty fields.

### Step 1 → Step 2 Transition: AI Enrichment

When the user clicks Auto-Fill, the modal shows a loading state and calls:

**`POST /api/consultant/clients/enrich`**

Request:
```json
{ "company_name": "R&R Homes", "website": "https://rrhomes.example" }
```

Response (≤3s target, fallback to manual on timeout):
```json
{
  "industry": "construction_residential",
  "industry_secondary": "custom_home_building",
  "vertical": "legacy_succession",
  "size": "51-200",
  "estimated_employees": 110,
  "estimated_revenue_band": "25M-50M",
  "founded": 1987,
  "hq": "Tacoma, WA",
  "annual_projects": "~45 homes/yr",
  "description": "Family-owned residential construction firm…",
  "detected_signals": ["growth_phase", "succession_planning", "geographic_expansion", "process_documentation_gap", "hiring_ops_manager"],
  "suggested_ssi_focus": [
    { "dimension": "speed", "sub_dimension": "decision_making" },
    { "dimension": "strength", "sub_dimension": "process_maturity" },
    { "dimension": "intelligence", "sub_dimension": "strategic_clarity" }
  ],
  "suggested_template_id": "legacy_construction_succession_v1",
  "suggested_contacts": [
    { "name": "Robert Chen Jr.", "title": "Operations Manager", "email": "rchen@rrhomes.example", "is_primary": true, "source": "website_team_page" },
    { "name": "Sarah Lee", "title": "CFO", "email": "slee@rrhomes.example", "source": "linkedin" },
    { "name": "Robert Chen Sr.", "title": "Founder", "email": "founder@rrhomes.example", "source": "website_team_page", "note": "transitioning out" }
  ],
  "sources": ["rrhomes.example/about", "rrhomes.example/team", "linkedin.com/company/rrhomes", "wa_business_registry"],
  "confidence": 0.87
}
```

**Backend implementation**: Extends `aiOKRService` (Epic F) with a new method `enrichCompany({ name, website })`. Uses GPT-4 Turbo with web-search tool. Cached 24h per (name, website) pair.

### Step 2: Review & Confirm

All fields editable. AI-filled fields are marked with an `AI` pill badge. Sources are listed in a banner with a confidence percentage.

| Section | Fields | AI-filled? |
|---------|--------|------------|
| **Identity strip** | Founded, HQ, Est. Revenue band | ✅ |
| **Industry** | Industry (primary + secondary tags), Vertical | ✅ |
| **Sizing** | Company Size, Annual Projects | ✅ |
| **Description** | 2-4 sentence company description | ✅ |
| **Detected Signals** | Tag list (growth phase, succession, etc.) | ✅ informational |
| **Suggested SSI Focus** | Up to 3 dimension/sub-dimension chips | ✅ informational |
| **Suggested Assessment Template** | Single recommended template card | ✅ informational |
| **Primary Contact** | Name, Title, Email (inferred), Phone (manual) | ✅ contact pre-filled if found |
| **Alternate Contacts** | Collapsible list, click to swap as primary | ✅ |
| **Initial Stage** | Radio (Prospect / Onboarding / Objective Identified / In Progress) | Manual, default `prospect` (D-C-7) |

**Welcome Email**: descoped to Sprint 23 (D-C-8). Checkbox removed from Step 2. POST /clients does not send email in S22.

### Wizard Navigation

- **Cancel**: Close modal, discard changes (also discards enrichment cache hit for this entry)
- **Back** (Step 2 only): Return to Step 1, retain AI-filled values for re-enrichment toggle
- **Create Client**: Submit `POST /api/consultant/clients` with merged payload (AI-filled fields + user edits + primary contact + stage)

### Manual Fallback

If `POST /enrich` returns a timeout/error, or the user clicks "Skip AI and enter details manually" on Step 1, Step 2 renders with all fields blank and no AI banner. Required fields are unchanged: company name, industry, size, contact name, email, stage.

---

## 6. API Endpoints

### GET `/api/consultant/portfolio-kpis`

```json
{
  "totalClients": 7,
  "needAttention": 3,
  "avgSSI": 72,
  "atRisk": 2
}
```

### GET `/api/consultant/portfolio-summary` (Extended)

```json
{
  "_id": "company_id",
  "name": "R&R Homes",
  "industry": "construction",
  "size": "51-200",
  "logo": null,
  "stage": "in_progress",
  "primaryContact": {
    "name": "Robert Chen",
    "title": "Operations Manager"
  },
  "ssi": {
    "overall": 78,
    "dimensions": {
      "speed": 72,
      "strength": 81,
      "intelligence": 80
    }
  },
  "objectives": {
    "total": 4,
    "onTrack": 2,
    "atRisk": 1,
    "behind": 1
  },
  "assessments": {
    "completed": 3,
    "total": 3
  },
  "riskStatus": "healthy",
  "lastActivity": {
    "date": "2026-04-18",
    "description": "Completed Q2 Assessment"
  }
}
```

### POST `/api/consultant/clients/enrich` (NEW — Sprint 22)

AI auto-fill for the Add Client wizard Step 1 → Step 2 transition. See §5 above for full request/response shape and `aiOKRService.enrichCompany()` implementation.

Request: `{ company_name, website? }`
Response: industry/secondary, size, founded, HQ, revenue band, signals, suggested SSI focus, suggested template, suggested contacts, sources, confidence.
Fallback: 3s timeout → return 504 with `{ error: "enrich_unavailable" }`. Frontend renders manual Step 2.
Cache: 24h per `(name, website)` tuple.

### POST `/api/consultant/clients`

Final wizard submission. Body merges AI-filled values with user edits. `sendWelcomeEmail` field removed (D-C-8 descope).

```json
{
  "company": {
    "name": "Greenway Landscaping",
    "industry": "landscaping",
    "industry_secondary": null,
    "vertical": null,
    "size": "11-50",
    "website": "https://greenway.com",
    "founded": null,
    "hq": null,
    "estimated_revenue_band": null,
    "description": "AI-filled or user-typed description"
  },
  "primaryContact": { "name": "Tom Richards", "title": "Owner", "email": "tom@greenway.com", "phone": "555-123-4567" },
  "stage": "prospect",
  "notes": "Met at trade show",
  "suggested_ssi_focus": [{ "dimension": "speed", "sub_dimension": "decision_making" }],
  "suggested_template_id": null,
  "ai_enrichment_used": true,
  "ai_confidence": 0.87
}
```

#### Server-side write transaction (D-C-6)

POST /api/consultant/clients executes 3 steps (mongoose session if available, otherwise sequential with rollback on failure):

1. **Create Company** — no parent `company_id` (the doc IS a tenant root). Apply D-C-4: if `employee_count` not provided, derive from size band midpoint (`1-10 → 5, 11-50 → 30, 51-200 → 125, 201-500 → 350`). `description` lifted to top-level (D-C-3). Default `stage = 'prospect'` if not specified (D-C-7). `risk_status` is NOT stored — computed at read time (D-C-5).
2. **Push to managed_businesses** — `User.findByIdAndUpdate(req.user._id, { $push: { managed_businesses: company._id } })`.
3. **Create default Team** — `Team.create({ name: 'Default', company_id: company._id, owner_id: req.user._id })` so subsequent UI flows (Add Objective, Assessment Wizard) have a team to attach to.

---

## 7. Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `client/pages/my-clients.html` | CREATE | Main page layout |
| `client/pages/scripts/my-clients.js` | CREATE | Page logic, API calls |
| `client/pages/scripts/add-client-wizard.js` | CREATE | 2-step AI wizard modal |
| `client/css/my-clients.css` | CREATE | Page-specific styles (tokens stay in `s13-patterns.css`) — D-C-9 |
| `client/js/navigation.js` | MODIFY | Add My Clients as first nav item — **CONSULTANT block only** (D-C-14) |
| `server/routes/consultant.js` | MODIFY | Add `/portfolio-kpis`, extend `/portfolio-summary`, add `POST /clients`, add `POST /clients/enrich` (calls Epic F service) |
| `server/models/Company.js` | MODIFY | ADD: `stage`, `primary_contact`, `industry_secondary`, `vertical`, `hq`, `estimated_revenue_band`, `description` (top-level — D-C-3), `ai_enrichment_used`, `ai_confidence`. CHANGE: `employee_count` to optional (D-C-4). See [prework/MODEL_DELTAS.md](../prework/MODEL_DELTAS.md) |

---

## 8. Navigation Update

**File**: `client/js/navigation.js` — **modify CONSULTANT block only**. BUSINESS_OWNER, EXECUTIVE, MANAGER, EMPLOYEE blocks unchanged (D-C-14). Dashboard href stays `/pages/dashboard-v2.html` since Epic G updates v2 in place (D-C-10 / D-G-1).

```javascript
CONSULTANT: [
    { label: 'My Clients',  href: '/pages/my-clients.html',     enabled: true },  // NEW - FIRST
    { label: 'Dashboard',   href: '/pages/dashboard-v2.html',   enabled: true },  // updated in place by Epic G
    { label: 'Objectives',  href: '/pages/objectives.html',     enabled: true },
    { label: 'Assessments', href: '/pages/assessment-hub.html', enabled: true },
    { label: 'Teams',       href: '/pages/teams.html',          enabled: true },
    { label: 'Planning',    href: '/pages/planning-v2.html',    enabled: true }
],
```

---

## 9. Responsive Behavior

| Breakpoint | Grid | KPIs |
|------------|------|------|
| Desktop (≥1024px) | 3 columns | 4 in row |
| Tablet (768-1023px) | 2 columns | 2x2 grid |
| Mobile (<768px) | 1 column | Stack vertical |

---

## Acceptance Criteria

- [ ] KPI header shows 4 metrics accurately; riskStatus formula computed at read-time per D-C-5
- [ ] Client tiles display SSI donut with score + label
- [ ] Objectives rectangle shows stacked progress bar
- [ ] 7 journey stages with correct colors
- [ ] Filter by stage works; search by company/contact name works; combined filter behaves correctly
- [ ] **Add Client wizard happy path** (AI auto-fill): name + website → loading → Step 2 with AI badge pills, signals, suggested SSI focus, suggested template, primary contact pre-filled → Create → toast → tile renders
- [ ] **Add Client manual fallback**: AI failure (504) OR "Skip AI" link → blank Step 2 with required fields enforced
- [ ] **POST /clients side effects**: new Company created, `managed_businesses` updated, default Team created (D-C-6)
- [ ] **Tenant isolation**: consultant A cannot read/mutate consultant B's clients (negative test required)
- [ ] **Navigation**: My Clients appears first for CONSULTANT only (D-C-14)
- [ ] Nudge dropdown shows "Send Reminder" → toast stub (D-C-11)
- [ ] Notes action opens modal/drawer (D-C-12)
- [ ] Assess action navigates to assessment
- [ ] Mobile responsive (1-col layout)
- [ ] Welcome email descoped (D-C-8); checkbox not present in wizard

---

## Story Points Breakdown (D-C-15 corrected)

| Task | Points |
|------|--------|
| Page layout & KPIs | 3 |
| Client tile component | 5 |
| SSI donut + Objectives rectangle | 3 |
| Add Client Wizard (2-step AI auto-fill, with manual fallback) | 5 |
| API: portfolio-kpis endpoint | 1 |
| API: portfolio-summary extension | 2 |
| API: create client endpoint (incl. transaction + default Team) | 1 |
| Navigation update (CONSULTANT block only) | 1 |
| **Total** | **21** |

---

## Implementation Phases (split-by-phase per Epic 0 DAG)

### Phase 1: Core Page (8 pts) — parallel to Epic F
- Create `my-clients.html` with layout from mockup
- KPI header row (uses portfolio-kpis once Phase 2 lands; stub data until then)
- Client tiles grid with tile structure
- SSI donut component
- Objectives rectangle component
- Navigation update (CONSULTANT only)

### Phase 2: API Enhancement (5 pts) — needs Epic A complete
- Add `/api/consultant/portfolio-kpis` endpoint
- Extend `/api/consultant/portfolio-summary`: stage, primaryContact, objectives breakdown (Objective + KeyResult aggregations), riskStatus computed (D-C-5), lastActivity
- Apply Company model field additions (D-C-3, D-C-4)
- Index `Company.stage` for filter performance

### Phase 3: Add Client Wizard (5 pts) — needs Epic F complete
- 2-step modal wizard (AI auto-fill canonical) — D-C-1
- Step 1: name + website → `POST /api/consultant/clients/enrich`
- Step 2: review/edit AI-filled fields with AI pill badges, sources banner, confidence
- Manual fallback (Skip AI link OR enrich timeout)
- `POST /api/consultant/clients` with 3-step transaction (D-C-6)

### Phase 4: Interactions (3 pts) — parallel to Phase 1
- Search/filter functionality (combined search + stage filter)
- Nudge dropdown with "Send Reminder" stub (D-C-11)
- Notes modal (D-C-12)
- Tile click → assessment hub navigation

---

**Created**: April 21, 2026 (Session #171)
**Status**: Ready for implementation
