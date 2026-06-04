# Epic U5b: My Clients Tab (CONSULTANT Only)

**Epic**: U5b - My Clients for Consultant Role
**Points**: 9 pts (updated post-audit)
**Priority**: P1
**Dependencies**: U5a (core hub), C0 (consultant foundation from Day 1)
**Blocked By**: U5a must be complete first
**Last Updated**: Feb 3, 2026 (Post-Audit)

---

## Overview

Add a dedicated "My Clients" tab for CONSULTANT users that provides:
1. **Portfolio View**: Overview of all managed companies with SSI summary
2. **Drill-Down View**: Deep dive into a specific company's assessment data
3. **Diagnostic Management**: View, filter, exclude/restore individual assessment responses
4. **SSI Auto-Recalculation**: Aggregate scores update when responses are excluded/restored
5. **URL State Management**: Deep linking and browser back/forward support

This is the primary workflow for consultants managing multiple client companies.

---

## User Journey

```
CONSULTANT logs in
    │
    ▼
Assessment Hub (sees 4 tabs)
    │
    ├─► Tab 1: My Clients ◄── THIS EPIC
    │       │
    │       ▼
    │   Portfolio View (all managed companies)
    │       │
    │       ├─► Click company card
    │       │       │
    │       │       ▼
    │       │   Drill-Down View (URL: ?client=companyId)
    │       │       │
    │       │       ├─► Diagnostic Tab (default, URL: ?client=X&subtab=diagnostic)
    │       │       │       • Team + Anonymous assessments
    │       │       │       • Source filter
    │       │       │       • Exclude/Restore buttons
    │       │       │       • Auto-recalculate SSI
    │       │       │
    │       │       ├─► Sent Assessments Tab (?client=X&subtab=sent)
    │       │       │       • Invitations sent to this company
    │       │       │
    │       │       └─► Teams Tab (?client=X&subtab=teams)
    │       │               • Teams in this company
    │       │
    │       ├─► Back button / ← link returns to Portfolio
    │       │
    │       └─► [+ Add New Client] → Opens existing "Send to Company" modal
    │
    ├─► Tab 2: Assigned to Me
    ├─► Tab 3: My Templates
    └─► Tab 4: Sent by Me
```

---

## Prerequisites Check (From C0 - Day 1)

### Already Implemented in Sprint 11 Day 1:

| Feature | Status | Location |
|---------|--------|----------|
| `managed_businesses` in JWT | ✅ Done | `server/routes/auth.js:216` |
| `PUT /api/users/switch-company` | ✅ Done | `server/routes/users.js` |
| Auth middleware company override | ✅ Done | `server/middleware/auth.js` |
| `PUT /api/assessments/:id/exclude` | ✅ Done | `server/routes/assessments.js` |
| `PUT /api/assessments/:id/restore` | ✅ Done | `server/routes/assessments.js` |
| Aggregation excludes `status: 'excluded'` | ✅ Done | All assessment aggregation endpoints |

### Verify Before Starting U5b:

```bash
# Test company switch
curl -X PUT http://localhost:5000/api/users/switch-company \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"company_id": "..."}'

# Test exclude
curl -X PUT http://localhost:5000/api/assessments/{id}/exclude \
  -H "Authorization: Bearer $TOKEN"

# Test restore
curl -X PUT http://localhost:5000/api/assessments/{id}/restore \
  -H "Authorization: Bearer $TOKEN"
```

### Verify Assessment Model has `is_anonymous` field:

```bash
# Check Assessment model
grep -n "is_anonymous" server/models/Assessment.js
```

---

## Data Model Reference

### User Model (CONSULTANT)
```javascript
{
  _id: ObjectId,
  role: 'CONSULTANT',
  company_id: ObjectId,           // Consultant's own company
  current_company_id: ObjectId,   // Currently selected client company
  managed_businesses: [ObjectId], // Array of client company IDs
}
```

### Assessment Model
```javascript
{
  _id: ObjectId,
  company_id: ObjectId,           // Which company this belongs to
  user_id: ObjectId,              // Who took it (null for anonymous)
  status: String,                 // 'completed', 'excluded', 'in_progress'
  excluded_by: ObjectId,          // Who excluded it (CONSULTANT only)
  excluded_at: Date,              // When excluded
  is_anonymous: Boolean,          // True for public link responses
  ssi_result: {                   // SSI scores
    overall: Number,
    dimensions: {
      speed: Number,
      strength: Number,
      intelligence: Number
    }
  }
}
```

---

## API Endpoints

### Existing Endpoints (No Changes Needed)

| Endpoint | Purpose | Notes |
|----------|---------|-------|
| `GET /api/companies/:id` | Company details | Name, industry, size |
| `GET /api/assessments/team/:companyId` | Team member assessments | Per-member SSI scores |
| `GET /api/assessments/latest-scores?company_id=X` | Aggregate SSI | Auto-excludes `status: 'excluded'` |
| `PUT /api/assessments/:id/exclude` | Exclude response | C0 implementation |
| `PUT /api/assessments/:id/restore` | Restore response | C0 implementation |

### New Endpoints

#### 1. GET /api/consultant/portfolio-summary (NEW - Batch Endpoint)

**Purpose**: Fetch summary data for all managed companies in one request (avoids N+1).

```javascript
// server/routes/consultant.js (NEW FILE)

const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const Company = require('../models/Company');
const Team = require('../models/Team');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

/**
 * GET /api/consultant/portfolio-summary
 * Returns summary data for all companies managed by consultant
 */
router.get('/portfolio-summary',
  authenticateToken,
  requireRole('CONSULTANT'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.user_id);
      const managedIds = user.managed_businesses || [];

      if (managedIds.length === 0) {
        return res.json({ success: true, data: [] });
      }

      // Batch fetch all data in parallel
      const [companies, teamCounts, assessmentStats] = await Promise.all([
        // 1. Company details
        Company.find({ _id: { $in: managedIds } })
          .select('name industry size logo')
          .lean(),

        // 2. Team counts per company
        Team.aggregate([
          { $match: { company_id: { $in: managedIds } } },
          { $group: { _id: '$company_id', count: { $sum: 1 } } }
        ]),

        // 3. Assessment stats per company (excluding 'excluded' status)
        Assessment.aggregate([
          {
            $match: {
              company_id: { $in: managedIds },
              status: { $ne: 'excluded' }
            }
          },
          {
            $group: {
              _id: '$company_id',
              count: { $sum: 1 },
              avgScore: { $avg: '$ssi_result.overall' },
              avgSpeed: { $avg: '$ssi_result.dimensions.speed' },
              avgStrength: { $avg: '$ssi_result.dimensions.strength' },
              avgIntelligence: { $avg: '$ssi_result.dimensions.intelligence' }
            }
          }
        ])
      ]);

      // Build lookup maps
      const teamCountMap = {};
      teamCounts.forEach(t => { teamCountMap[t._id.toString()] = t.count; });

      const assessmentMap = {};
      assessmentStats.forEach(a => { assessmentMap[a._id.toString()] = a; });

      // Combine into response
      const portfolio = companies.map(company => {
        const companyId = company._id.toString();
        const stats = assessmentMap[companyId] || {};

        return {
          _id: company._id,
          name: company.name,
          industry: company.industry,
          size: company.size,
          logo: company.logo,
          stats: {
            teams: teamCountMap[companyId] || 0,
            assessments: stats.count || 0
          },
          ssi: {
            overall: Math.round(stats.avgScore || 0),
            dimensions: {
              speed: Math.round(stats.avgSpeed || 0),
              strength: Math.round(stats.avgStrength || 0),
              intelligence: Math.round(stats.avgIntelligence || 0)
            }
          }
        };
      });

      res.json({ success: true, data: portfolio });

    } catch (error) {
      console.error('Portfolio summary error:', error);
      res.status(500).json({ success: false, error: 'Failed to load portfolio' });
    }
  }
);

module.exports = router;
```

**Response shape:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "company_id_1",
      "name": "AirProducts",
      "industry": "Financial Services",
      "size": "51-200",
      "stats": {
        "teams": 3,
        "assessments": 12
      },
      "ssi": {
        "overall": 74,
        "dimensions": {
          "speed": 71,
          "strength": 76,
          "intelligence": 75
        }
      }
    }
  ]
}
```

#### 2. GET /api/assessments/company/:companyId/all-responses (NEW)

**Purpose**: Combined team + anonymous responses for diagnostic view.

```javascript
// server/routes/assessments.js - Add this endpoint

router.get('/company/:companyId/all-responses',
  authenticateToken,
  requireRole('CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE'),
  async (req, res) => {
    try {
      const { companyId } = req.params;
      const { source } = req.query; // 'all', 'team', 'anonymous'

      // Verify consultant has access to this company
      if (req.user.role === 'CONSULTANT') {
        const user = await User.findById(req.user.user_id);
        const hasAccess = user.managed_businesses?.some(
          id => id.toString() === companyId
        );
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'Not authorized for this company'
          });
        }
      }

      // Build query
      const query = { company_id: companyId };

      // Source filter
      if (source === 'team') {
        query.is_anonymous = { $ne: true };
      } else if (source === 'anonymous') {
        query.is_anonymous = true;
      }

      const assessments = await Assessment.find(query)
        .populate('user_id', 'name email role')
        .populate('excluded_by', 'name')
        .sort({ created_at: -1 })
        .lean();

      // Transform for frontend
      const responses = assessments.map(a => ({
        _id: a._id,
        source: a.is_anonymous ? 'anonymous' : 'team',
        respondent: a.is_anonymous ? null : {
          name: a.user_id?.name || 'Unknown',
          email: a.user_id?.email,
          role: a.user_id?.role
        },
        date: a.created_at,
        score: a.ssi_result?.overall || 0,
        dimensions: a.ssi_result?.dimensions || {},
        status: a.status,
        excluded_at: a.excluded_at,
        excluded_by_name: a.excluded_by?.name
      }));

      res.json({ success: true, data: responses });

    } catch (error) {
      console.error('All responses error:', error);
      res.status(500).json({ success: false, error: 'Failed to load responses' });
    }
  }
);
```

#### 3. GET /api/invitations/sent-by-me (MODIFY)

**Purpose**: Add optional `company_id` query param for filtering.

```javascript
// server/routes/invitations.js - Modify existing endpoint

router.get('/sent-by-me', authenticateToken, async (req, res) => {
  try {
    const query = { sent_by: req.user.user_id };

    // NEW: Optional company filter for CONSULTANT drill-down
    if (req.query.company_id) {
      query.company_id = req.query.company_id;
    }

    // ... rest of existing implementation unchanged
  } catch (error) {
    // ...
  }
});
```

---

## UI Specifications

### Portfolio View (My Clients Tab Content)

**Structure:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ My Clients                                         [+ Add New Client]   │
│ Manage assessments across your client companies                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐            │
│ │   ┌───────┐     │ │   ┌───────┐     │ │   ┌───────┐     │            │
│ │   │  74%  │     │ │   │  68%  │     │ │   │  82%  │     │            │
│ │   └───────┘     │ │   └───────┘     │ │   └───────┘     │            │
│ │                 │ │                 │ │                 │            │
│ │ AirProducts     │ │ Legacy Succ.    │ │ Wellness Co     │            │
│ │ Financial Svcs  │ │ Financial Svcs  │ │ Health & Fit    │            │
│ │                 │ │                 │ │                 │            │
│ │ 3 teams • 12    │ │ 2 teams • 8     │ │ 5 teams • 24    │            │
│ │                 │ │                 │ │                 │            │
│ │ [View Details]  │ │ [View Details]  │ │ [View Details]  │            │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**HTML structure:**
```html
<div id="tab-clients" class="tab-content">
  <!-- Portfolio View (default) -->
  <div id="portfolio-view">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">My Clients</h2>
        <p class="text-sm text-gray-500">Manage assessments across your client companies</p>
      </div>
      <button onclick="openSendToCompanyModal()"
              class="px-4 py-2 brand-gradient text-white text-sm font-medium rounded-lg hover:opacity-90 transition flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Add New Client
      </button>
    </div>

    <div id="portfolio-loading" class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading your clients...</p>
    </div>

    <div id="portfolio-empty" class="hidden text-center py-12 bg-white border-2 border-dashed border-gray-200 rounded-xl">
      <div class="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-1">No Clients Yet</h3>
      <p class="text-sm text-gray-500 mb-4">Add your first client to start managing their assessments.</p>
      <button onclick="openSendToCompanyModal()"
              class="px-4 py-2 brand-gradient text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
        + Add Your First Client
      </button>
    </div>

    <div id="portfolio-grid" class="hidden grid md:grid-cols-3 gap-4">
      <!-- Client cards rendered here -->
    </div>
  </div>

  <!-- Drill-Down View (shown when client selected) -->
  <div id="drilldown-view" class="hidden">
    <!-- Content below -->
  </div>
</div>
```

**Client card template (reuses `renderScoreRing` from U5a):**
```javascript
function renderClientCard(client) {
  return `
    <div class="client-card bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
         onclick="enterDrillDown('${client._id}')">

      <!-- SSI Score Ring -->
      <div class="flex justify-center mb-4">
        ${renderScoreRing(client.ssi.overall, 80)}
      </div>

      <!-- Company Info -->
      <div class="text-center mb-3">
        <h3 class="font-semibold text-gray-900">${escapeHtml(client.name)}</h3>
        <p class="text-xs text-gray-500">${escapeHtml(client.industry || 'No industry')}</p>
      </div>

      <!-- Stats -->
      <div class="flex justify-center gap-1 text-xs text-gray-500 mb-4">
        <span>${client.stats.teams} teams</span>
        <span>•</span>
        <span>${client.stats.assessments} assessments</span>
      </div>

      <!-- Dimension Mini-Stats -->
      <div class="flex gap-1 mb-4">
        <div class="flex-1 bg-indigo-50 rounded py-1 text-center">
          <div class="text-xs font-bold text-indigo-600">${client.ssi.dimensions.speed || '—'}</div>
          <div class="text-[10px] text-gray-500">Spd</div>
        </div>
        <div class="flex-1 bg-green-50 rounded py-1 text-center">
          <div class="text-xs font-bold text-green-600">${client.ssi.dimensions.strength || '—'}</div>
          <div class="text-[10px] text-gray-500">Str</div>
        </div>
        <div class="flex-1 bg-blue-50 rounded py-1 text-center">
          <div class="text-xs font-bold text-blue-600">${client.ssi.dimensions.intelligence || '—'}</div>
          <div class="text-[10px] text-gray-500">Int</div>
        </div>
      </div>

      <!-- Action -->
      <button class="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
        View Details →
      </button>
    </div>
  `;
}
```

### Drill-Down View

**Structure:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Back to All Clients                                    AirProducts    │
│                                                     Financial Services  │
├─────────────────────────────────────────────────────────────────────────┤
│ [Diagnostic]  [Sent Assessments]  [Teams]                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ ┌─ Aggregate SSI ─────────────────────────────────────────────────────┐ │
│ │   Overall: 74%    Speed: 71%    Strength: 76%    Intelligence: 75%  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ Source: [All]  [Team Surveys]  [Anonymous]                12 responses  │
│                                                                         │
│ ┌─ Response Table ────────────────────────────────────────────────────┐ │
│ │  #  Source          Respondent      Date       Score    Action      │ │
│ ├─────────────────────────────────────────────────────────────────────┤ │
│ │  1  Team Survey     John D.        Jan 15      78%     [Exclude]   │ │
│ │  2  Anonymous       —              Jan 13      45%     [Exclude]   │ │
│ │  3  Team Survey     (excluded)     Jan 11       —      [Restore]   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ⚠ 1 response excluded from aggregate calculation                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**HTML structure:**
```html
<div id="drilldown-view" class="hidden">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-4">
      <button onclick="exitDrillDown()"
              class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to All Clients
      </button>
      <div class="border-l border-gray-300 pl-4">
        <h2 id="drilldown-company-name" class="text-lg font-semibold text-gray-900"></h2>
        <p id="drilldown-company-industry" class="text-sm text-gray-500"></p>
      </div>
    </div>
  </div>

  <!-- Sub-tabs -->
  <div class="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
    <button onclick="setSubTab('diagnostic')" id="subtab-diagnostic"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-white shadow-sm text-gray-900">
      Diagnostic
    </button>
    <button onclick="setSubTab('sent')" id="subtab-sent"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-600">
      Sent Assessments
    </button>
    <button onclick="setSubTab('teams')" id="subtab-teams"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-600">
      Teams
    </button>
  </div>

  <!-- Sub-tab content containers -->
  <div id="subtab-content-diagnostic"></div>
  <div id="subtab-content-sent" class="hidden"></div>
  <div id="subtab-content-teams" class="hidden"></div>
</div>
```

### Diagnostic Sub-Tab

**Aggregate SSI bar:**
```html
<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
  <div class="grid grid-cols-4 gap-4 text-center">
    <div>
      <div id="agg-overall" class="text-2xl font-bold text-gray-900">—</div>
      <div class="text-xs text-gray-500 uppercase tracking-wide">Overall</div>
    </div>
    <div>
      <div id="agg-speed" class="text-2xl font-bold text-indigo-600">—</div>
      <div class="text-xs text-gray-500 uppercase tracking-wide">Speed</div>
    </div>
    <div>
      <div id="agg-strength" class="text-2xl font-bold text-green-600">—</div>
      <div class="text-xs text-gray-500 uppercase tracking-wide">Strength</div>
    </div>
    <div>
      <div id="agg-intelligence" class="text-2xl font-bold text-blue-600">—</div>
      <div class="text-xs text-gray-500 uppercase tracking-wide">Intelligence</div>
    </div>
  </div>
</div>
```

**Source filter:**
```html
<div class="flex items-center justify-between mb-4">
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600">Source:</span>
    <div class="flex bg-gray-100 rounded-lg p-1">
      <button onclick="setSourceFilter('all')" id="filter-all"
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-white shadow-sm text-gray-900">
        All
      </button>
      <button onclick="setSourceFilter('team')" id="filter-team"
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-gray-600">
        Team Surveys
      </button>
      <button onclick="setSourceFilter('anonymous')" id="filter-anonymous"
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-gray-600">
        Anonymous
      </button>
    </div>
  </div>
  <span id="response-count" class="text-sm text-gray-500">0 responses</span>
</div>
```

---

## State Management & URL Handling

```javascript
// Drill-down state
let drillDownState = {
  active: false,
  companyId: null,
  companyName: null,
  companyIndustry: null,
  subTab: 'diagnostic',
  sourceFilter: 'all'
};

// Cache for portfolio data
let portfolioCache = null;

/**
 * Initialize from URL on page load
 */
function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const clientId = params.get('client');
  const subTab = params.get('subtab') || 'diagnostic';

  if (clientId) {
    // Deep link to specific client
    enterDrillDown(clientId, subTab, false); // false = don't push state
  }
}

/**
 * Enter drill-down for a company
 */
function enterDrillDown(companyId, subTab = 'diagnostic', pushState = true) {
  drillDownState.active = true;
  drillDownState.companyId = companyId;
  drillDownState.subTab = subTab;
  drillDownState.sourceFilter = 'all';

  // Update URL
  if (pushState) {
    const url = new URL(window.location);
    url.searchParams.set('client', companyId);
    url.searchParams.set('subtab', subTab);
    history.pushState({ companyId, subTab }, '', url);
  }

  // Find company in cache
  const company = portfolioCache?.find(c => c._id === companyId);
  if (company) {
    drillDownState.companyName = company.name;
    drillDownState.companyIndustry = company.industry;
  }

  // Update UI
  document.getElementById('portfolio-view').classList.add('hidden');
  document.getElementById('drilldown-view').classList.remove('hidden');
  document.getElementById('drilldown-company-name').textContent = drillDownState.companyName || 'Loading...';
  document.getElementById('drilldown-company-industry').textContent = drillDownState.companyIndustry || '';

  // Load sub-tab content
  setSubTab(subTab, false); // false = don't push state again
}

/**
 * Exit drill-down back to portfolio
 */
function exitDrillDown() {
  drillDownState.active = false;
  drillDownState.companyId = null;

  // Update URL
  const url = new URL(window.location);
  url.searchParams.delete('client');
  url.searchParams.delete('subtab');
  history.pushState({}, '', url);

  // Update UI
  document.getElementById('drilldown-view').classList.add('hidden');
  document.getElementById('portfolio-view').classList.remove('hidden');
}

/**
 * Handle browser back/forward
 */
window.addEventListener('popstate', (event) => {
  if (event.state?.companyId) {
    enterDrillDown(event.state.companyId, event.state.subTab || 'diagnostic', false);
  } else {
    // No state = portfolio view
    if (drillDownState.active) {
      drillDownState.active = false;
      document.getElementById('drilldown-view').classList.add('hidden');
      document.getElementById('portfolio-view').classList.remove('hidden');
    }
  }
});

/**
 * Switch sub-tab in drill-down
 */
function setSubTab(tabId, pushState = true) {
  drillDownState.subTab = tabId;

  // Update URL
  if (pushState && drillDownState.companyId) {
    const url = new URL(window.location);
    url.searchParams.set('subtab', tabId);
    history.replaceState(
      { companyId: drillDownState.companyId, subTab: tabId },
      '',
      url
    );
  }

  // Update sub-tab buttons
  ['diagnostic', 'sent', 'teams'].forEach(id => {
    const btn = document.getElementById(`subtab-${id}`);
    const isActive = id === tabId;
    btn.classList.toggle('bg-white', isActive);
    btn.classList.toggle('shadow-sm', isActive);
    btn.classList.toggle('text-gray-900', isActive);
    btn.classList.toggle('text-gray-600', !isActive);
  });

  // Show/hide content
  document.getElementById('subtab-content-diagnostic').classList.toggle('hidden', tabId !== 'diagnostic');
  document.getElementById('subtab-content-sent').classList.toggle('hidden', tabId !== 'sent');
  document.getElementById('subtab-content-teams').classList.toggle('hidden', tabId !== 'teams');

  // Load content
  switch (tabId) {
    case 'diagnostic':
      loadDiagnosticData();
      break;
    case 'sent':
      loadSentForCompany();
      break;
    case 'teams':
      loadTeamsForCompany();
      break;
  }
}
```

---

## Data Loading Functions

```javascript
/**
 * Load portfolio data (batch endpoint)
 */
async function loadPortfolioData() {
  const loading = document.getElementById('portfolio-loading');
  const empty = document.getElementById('portfolio-empty');
  const grid = document.getElementById('portfolio-grid');

  loading.classList.remove('hidden');
  empty.classList.add('hidden');
  grid.classList.add('hidden');

  try {
    const token = localStorage.getItem('karvia_auth_token');
    const response = await fetch('/api/consultant/portfolio-summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { success, data, error } = await response.json();
    if (!success) throw new Error(error);

    portfolioCache = data; // Cache for drill-down lookup
    loading.classList.add('hidden');

    if (data.length === 0) {
      empty.classList.remove('hidden');
      // Update tab badge
      updateBadge('clients', 0);
    } else {
      grid.innerHTML = data.map(renderClientCard).join('');
      grid.classList.remove('hidden');
      updateBadge('clients', data.length);
    }

  } catch (error) {
    console.error('Portfolio load error:', error);
    loading.classList.add('hidden');
    Toast.error('Failed to load clients');
  }
}

/**
 * Load diagnostic data for drill-down
 */
async function loadDiagnosticData() {
  const companyId = drillDownState.companyId;
  const source = drillDownState.sourceFilter;

  try {
    const token = localStorage.getItem('karvia_auth_token');

    // Fetch responses and aggregate in parallel
    const [responsesRes, aggregateRes] = await Promise.all([
      fetch(`/api/assessments/company/${companyId}/all-responses?source=${source}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`/api/assessments/latest-scores?company_id=${companyId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    const [responsesData, aggregateData] = await Promise.all([
      responsesRes.json(),
      aggregateRes.json()
    ]);

    if (!responsesData.success) throw new Error(responsesData.error);

    // Update aggregate display
    const agg = aggregateData.data || {};
    document.getElementById('agg-overall').textContent = agg.overall ? `${Math.round(agg.overall)}%` : '—';
    document.getElementById('agg-speed').textContent = agg.dimensions?.speed ? `${Math.round(agg.dimensions.speed)}%` : '—';
    document.getElementById('agg-strength').textContent = agg.dimensions?.strength ? `${Math.round(agg.dimensions.strength)}%` : '—';
    document.getElementById('agg-intelligence').textContent = agg.dimensions?.intelligence ? `${Math.round(agg.dimensions.intelligence)}%` : '—';

    // Render response table
    renderDiagnosticContent(responsesData.data);

  } catch (error) {
    console.error('Diagnostic load error:', error);
    Toast.error('Failed to load diagnostic data');
  }
}

/**
 * Render diagnostic content
 */
function renderDiagnosticContent(responses) {
  const container = document.getElementById('subtab-content-diagnostic');
  const activeResponses = responses.filter(r => r.status !== 'excluded');
  const excludedResponses = responses.filter(r => r.status === 'excluded');

  document.getElementById('response-count').textContent = `${responses.length} responses`;

  let tableHtml = `
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="grid grid-cols-6 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        <span>#</span>
        <span>Source</span>
        <span>Respondent</span>
        <span>Date</span>
        <span>Score</span>
        <span>Action</span>
      </div>
  `;

  // Active responses first
  activeResponses.forEach((r, i) => {
    tableHtml += renderDiagnosticRow(r, i + 1, false);
  });

  // Excluded responses (grayed)
  excludedResponses.forEach((r, i) => {
    tableHtml += renderDiagnosticRow(r, activeResponses.length + i + 1, true);
  });

  tableHtml += '</div>';

  // Warning banner if exclusions
  if (excludedResponses.length > 0) {
    tableHtml += `
      <div class="mt-4 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        ${excludedResponses.length} response(s) excluded from aggregate calculation
      </div>
    `;
  }

  // Insert after aggregate bar and filter
  const existingTable = container.querySelector('.response-table-container');
  if (existingTable) {
    existingTable.innerHTML = tableHtml;
  } else {
    container.insertAdjacentHTML('beforeend', `<div class="response-table-container">${tableHtml}</div>`);
  }
}

function renderDiagnosticRow(response, index, isExcluded) {
  const rowClass = isExcluded ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50';
  const scoreDisplay = isExcluded ? '—' : `${Math.round(response.score)}%`;

  let respondentDisplay;
  if (response.source === 'anonymous') {
    respondentDisplay = '<span class="text-gray-400 italic">Anonymous</span>';
  } else if (isExcluded) {
    respondentDisplay = '<span class="text-gray-400">(excluded)</span>';
  } else {
    respondentDisplay = escapeHtml(response.respondent?.name || 'Unknown');
  }

  const sourceColor = response.source === 'team' ? 'bg-blue-500' : 'bg-purple-500';
  const sourceLabel = response.source === 'team' ? 'Team Survey' : 'Anonymous';

  return `
    <div class="grid grid-cols-6 gap-4 px-5 py-4 border-t border-gray-100 items-center ${rowClass}">
      <span class="text-gray-500">${index}</span>
      <span class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full ${sourceColor}"></span>
        ${sourceLabel}
      </span>
      <span class="text-gray-900">${respondentDisplay}</span>
      <span class="text-gray-500">${formatDate(response.date)}</span>
      <span class="font-medium ${isExcluded ? 'text-gray-400' : 'text-gray-900'}">${scoreDisplay}</span>
      <span>
        ${isExcluded
          ? `<button onclick="restoreResponse('${response._id}')" class="text-sm text-green-600 hover:underline">Restore</button>`
          : `<button onclick="excludeResponse('${response._id}')" class="text-sm text-red-600 hover:underline">Exclude</button>`
        }
      </span>
    </div>
  `;
}
```

---

## Exclude/Restore Actions

```javascript
async function excludeResponse(assessmentId) {
  if (!confirm('Exclude this response from aggregate SSI calculation?')) return;

  try {
    const token = localStorage.getItem('karvia_auth_token');
    const response = await fetch(`/api/assessments/${assessmentId}/exclude`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    Toast.success('Response excluded');
    await loadDiagnosticData(); // Refresh to show updated aggregate

  } catch (error) {
    Toast.error('Failed to exclude: ' + error.message);
  }
}

async function restoreResponse(assessmentId) {
  try {
    const token = localStorage.getItem('karvia_auth_token');
    const response = await fetch(`/api/assessments/${assessmentId}/restore`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    Toast.success('Response restored');
    await loadDiagnosticData();

  } catch (error) {
    Toast.error('Failed to restore: ' + error.message);
  }
}
```

---

## Sent & Teams Sub-Tabs

```javascript
/**
 * Load sent invitations for company (reuses U5a rendering)
 */
async function loadSentForCompany() {
  const companyId = drillDownState.companyId;
  const container = document.getElementById('subtab-content-sent');

  container.innerHTML = `
    <div class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading sent assessments...</p>
    </div>
  `;

  try {
    const token = localStorage.getItem('karvia_auth_token');
    const response = await fetch(`/api/invitations/sent-by-me?company_id=${companyId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { success, data, error } = await response.json();
    if (!success) throw new Error(error);

    if (data.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 bg-white border-2 border-dashed border-gray-200 rounded-xl">
          <p class="text-gray-500">No assessments sent to this company yet.</p>
        </div>
      `;
    } else {
      // Reuse individual view rendering from U5a
      container.innerHTML = `
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Recipient</span>
            <span>Template</span>
            <span>Status</span>
            <span>Sent</span>
            <span>Action</span>
          </div>
          <div id="sent-subtab-rows"></div>
        </div>
      `;

      const rows = [];
      data.forEach(batch => {
        batch.invitations.forEach(inv => {
          rows.push(renderRecipientRow(inv, batch.template.name)); // From U5a
        });
      });

      document.getElementById('sent-subtab-rows').innerHTML = rows.join('');
    }

  } catch (error) {
    console.error('Sent load error:', error);
    container.innerHTML = `<p class="text-red-500 text-center py-8">Failed to load sent assessments</p>`;
  }
}

/**
 * Load teams for company
 */
async function loadTeamsForCompany() {
  const companyId = drillDownState.companyId;
  const container = document.getElementById('subtab-content-teams');

  container.innerHTML = `
    <div class="text-center py-12">
      <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-500">Loading teams...</p>
    </div>
  `;

  try {
    const token = localStorage.getItem('karvia_auth_token');
    const response = await fetch(`/api/teams?company_id=${companyId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { success, data, error } = await response.json();
    if (!success) throw new Error(error);

    if (data.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 bg-white border-2 border-dashed border-gray-200 rounded-xl">
          <p class="text-gray-500">No teams in this company yet.</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${data.map(team => `
            <div class="bg-white border border-gray-200 rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 mb-1">${escapeHtml(team.name)}</h3>
              <p class="text-xs text-gray-500 mb-3">${team.member_count || 0} members</p>
              <div class="text-xs text-gray-400">${escapeHtml(team.description || 'No description')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

  } catch (error) {
    console.error('Teams load error:', error);
    container.innerHTML = `<p class="text-red-500 text-center py-8">Failed to load teams</p>`;
  }
}
```

---

## Implementation Checklist

### Backend (2.5h)

- [ ] **Create `server/routes/consultant.js`** (1.5h)
  - New file with portfolio-summary endpoint
  - Batch aggregation queries
  - Register in server/index.js

- [ ] **Add `GET /api/assessments/company/:companyId/all-responses`** (0.5h)
  - File: `server/routes/assessments.js`
  - ~45 lines
  - Source filter
  - CONSULTANT access verification

- [ ] **Modify `GET /api/invitations/sent-by-me`** (0.25h)
  - File: `server/routes/invitations.js`
  - Add company_id query param filter
  - ~5 lines

- [ ] **Verify Assessment model** (0.25h)
  - Check `is_anonymous` field exists
  - Check exclude/restore endpoints work

### Frontend (6.5h)

- [ ] **Portfolio view** (1.5h)
  - HTML structure
  - `loadPortfolioData()` using batch endpoint
  - `renderClientCard()` using shared `renderScoreRing()`
  - Empty state
  - Loading state

- [ ] **URL state management** (1h)
  - `initFromURL()` on page load
  - `enterDrillDown()` with pushState
  - `exitDrillDown()` with state clear
  - `popstate` event handler

- [ ] **Drill-down header & sub-tabs** (0.5h)
  - Back button
  - Company name/industry display
  - Sub-tab switching
  - `setSubTab()` function

- [ ] **Diagnostic sub-tab** (2h)
  - Aggregate SSI bar
  - Source filter toggle
  - Response table
  - `renderDiagnosticRow()`
  - Exclude/Restore buttons
  - Refresh after exclude/restore

- [ ] **Sent sub-tab** (0.5h)
  - Reuse `renderRecipientRow()` from U5a
  - Company-filtered fetch

- [ ] **Teams sub-tab** (0.5h)
  - Simple team cards
  - Member counts

- [ ] **Add New Client button** (0.5h)
  - Wire to existing `openSendToCompanyModal()` from U5a
  - Modal already exists - REUSE

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| CONSULTANT with no managed businesses | Empty state: "No clients yet" |
| Company with no assessments | Show 0 count in portfolio, empty diagnostic |
| All responses excluded | Aggregate shows "—", warning banner |
| Company deleted while viewing | Handle 404, return to portfolio |
| Network error on exclude/restore | Toast error, don't modify UI |
| Deep link to non-existent company | Show error, return to portfolio |
| Mixed excluded/active responses | Show active first, excluded grayed below |
| Browser back from drill-down | Returns to portfolio via popstate |

---

## Testing Checklist

- [ ] Only CONSULTANT sees My Clients tab (Tab 1)
- [ ] Non-consultant does NOT see My Clients tab
- [ ] Portfolio loads all managed companies
- [ ] Portfolio uses batch endpoint (1 request, not N)
- [ ] SSI scores show in portfolio cards
- [ ] Click company enters drill-down
- [ ] URL updates with `?client=X&subtab=Y`
- [ ] Back button returns to portfolio
- [ ] Browser back/forward works correctly
- [ ] Deep link `?client=X` loads directly to drill-down
- [ ] Sub-tabs switch correctly
- [ ] Diagnostic shows team + anonymous responses
- [ ] Source filter works (All/Team/Anonymous)
- [ ] Exclude marks response, refreshes aggregate
- [ ] Restore unmarked response, refreshes aggregate
- [ ] Excluded responses show grayed in table
- [ ] Sent sub-tab shows only this company's invitations
- [ ] Teams sub-tab shows only this company's teams
- [ ] Add New Client opens existing "Send to Company" modal

---

## Files Modified

| File | Changes |
|------|---------|
| `server/routes/consultant.js` | NEW FILE: ~80 lines (portfolio-summary) |
| `server/index.js` | +2 lines: register consultant routes |
| `server/routes/assessments.js` | +45 lines: all-responses endpoint |
| `server/routes/invitations.js` | +5 lines: company_id filter |
| `client/pages/assessment-hub.html` | +350 lines: My Clients UI |

---

## Dependencies

```
U5a (Core Hub)
     │
     ├─► renderScoreRing() function
     ├─► renderRecipientRow() function
     ├─► escapeHtml(), getInitials(), formatDate()
     ├─► .brand-gradient class
     ├─► Tab rendering pattern
     └─► openSendToCompanyModal() (for Add New Client)
            │
            ▼
        U5b (My Clients)
            │
            └─► C0 (Consultant Foundation)
                  ├─► exclude/restore endpoints
                  ├─► managed_businesses in JWT
                  └─► company access verification
```

---

## Rollback Plan

| Issue | Action |
|-------|--------|
| Portfolio endpoint fails | Show error state with retry, fallback to N+1 |
| My Clients tab breaks | Hide tab, show error toast |
| Drill-down stuck | Clear URL params via manual navigation |
| Exclude/Restore fails | Disable buttons, show "Feature unavailable" |
| URL state broken | Still works without URL state, just no deep linking |

---

**Epic U5b Ready for Implementation**
