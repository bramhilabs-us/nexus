# Epic U5a: Assessment Hub Core Redesign

**Epic**: U5a - Assessment Hub Core
**Points**: 5 pts
**Priority**: P0
**Dependencies**: s13-patterns.css (Day 1), Q1 auth fix (Day 1)
**Blocked By**: None
**Last Updated**: Feb 3, 2026 (Post-Audit)

---

## Overview

Redesign the Assessment Hub page with S13 visual patterns, KPI header, role-adaptive tabs, inline Team Results, and dual-view Sent tab. This epic covers the **non-CONSULTANT** experience and shared infrastructure that U5b will reuse.

**Out of Scope**: My Clients tab (see U5b)

---

## Current State Analysis

### Existing File: `client/pages/assessment-hub.html` (1248 lines)

**What EXISTS and works:**
- Role-based tab visibility (MANAGER_ROLES check)
- API integrations:
  - `AssessmentAPI.getAssignedInvitations()` → Tab 1
  - `AssessmentFlowManager.fetchTemplates()` → Tab 2
  - `AssessmentAPI.getSentInvitations()` → Tab 3
  - `TeamAPI.getTeams()` → Modals
- Two modals: Send to Company, Send to Teams
- XSS protection: `escapeHtml()` function
- Industry filter for templates
- Public link management (copy, deactivate)

**What NEEDS to change:**
- Add KPI header row
- Update branding (purple → navy)
- Inline Team Results (currently links to external page)
- Add view toggle for Sent tab (grouped + individual)
- Role-adaptive tab structure
- Extract shared utilities for U5b reuse

---

## Pre-Implementation Verification

**Before starting, verify these exist in `client/js/common.js`:**

```javascript
// Required utility functions
function getInitials(name) { ... }    // For avatar initials
function formatDate(date) { ... }     // For date formatting
function escapeHtml(text) { ... }     // XSS protection
```

**If missing, add to common.js first:**
```javascript
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

---

## Design Specifications

### Branding Update

```css
/* FROM (current) */
.karvia-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

/* TO (S13 mockup) */
.brand-gradient { background: linear-gradient(135deg, #1e3a5f, #2d5a87); }
```

**Files to update:**
- Line 11: `.karvia-gradient` definition → rename to `.brand-gradient`
- All button references using `karvia-gradient` class

### KPI Header Row

```
┌─────────────────────────────────────────────────────────────────┐
│ Assessments Hub                          [+ Send Assessment]    │
│ Manage assessments, templates, and track team progress          │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │ 📋 3     │ │ 📄 5     │ │ 📤 12    │ │ ✓ 8      │            │
│ │ Pending  │ │ Templates│ │ Sent     │ │ Completed│            │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

**HTML structure:**
```html
<div class="kpi-row flex items-center gap-6 pb-5 border-b border-gray-200 mb-6">
  <div class="kpi-card flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">
    <div class="kpi-icon w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
    </div>
    <div class="kpi-info flex flex-col">
      <span id="kpi-pending" class="text-xl font-bold text-gray-900">-</span>
      <span class="text-xs text-gray-500 uppercase tracking-wide">Pending</span>
    </div>
  </div>

  <div class="kpi-card flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">
    <div class="kpi-icon w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"/>
        <path d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"/>
      </svg>
    </div>
    <div class="kpi-info flex flex-col">
      <span id="kpi-templates" class="text-xl font-bold text-gray-900">-</span>
      <span class="text-xs text-gray-500 uppercase tracking-wide">Templates</span>
    </div>
  </div>

  <div class="kpi-card flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">
    <div class="kpi-icon w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
      </svg>
    </div>
    <div class="kpi-info flex flex-col">
      <span id="kpi-sent" class="text-xl font-bold text-gray-900">-</span>
      <span class="text-xs text-gray-500 uppercase tracking-wide">Sent</span>
    </div>
  </div>

  <div class="kpi-card flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">
    <div class="kpi-icon w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <div class="kpi-info flex flex-col">
      <span id="kpi-completed" class="text-xl font-bold text-gray-900">-</span>
      <span class="text-xs text-gray-500 uppercase tracking-wide">Completed</span>
    </div>
  </div>
</div>
```

### Tab Structure (Role-Adaptive)

**Non-CONSULTANT (4 tabs):**
```javascript
const NON_CONSULTANT_TABS = [
  { id: 'assigned', label: 'Assigned to Me', countKey: 'pending' },
  { id: 'templates', label: 'My Templates', countKey: 'templates' },
  { id: 'sent', label: 'Sent by Me', countKey: 'sent' },
  { id: 'results', label: 'Team Results', countKey: 'completed' }
];
```

**CONSULTANT (4 tabs):**
```javascript
const CONSULTANT_TABS = [
  { id: 'clients', label: 'My Clients', countKey: 'clients' },      // NEW - U5b
  { id: 'assigned', label: 'Assigned to Me', countKey: 'pending' },
  { id: 'templates', label: 'My Templates', countKey: 'templates' },
  { id: 'sent', label: 'Sent by Me', countKey: 'sent' }
];
```

**Tab rendering with badges:**
```javascript
function renderTabs() {
  const isConsultant = currentUser.role === 'CONSULTANT';
  const tabs = isConsultant ? CONSULTANT_TABS : NON_CONSULTANT_TABS;

  return tabs.map((tab, index) => `
    <button onclick="switchTab('${tab.id}')"
            id="tab-btn-${tab.id}"
            class="tab-btn px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${index === 0 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
      ${tab.label}
      <span id="badge-${tab.id}" class="badge ml-2 px-2 py-0.5 rounded-full text-xs ${index === 0 ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'}">-</span>
    </button>
  `).join('');
}
```

### Tab 3: Sent by Me - Dual View

**View Toggle UI:**
```html
<div class="flex items-center justify-between mb-4">
  <div class="flex items-center gap-4">
    <!-- View Mode Toggle -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600">View:</span>
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button onclick="setSentViewMode('grouped')"
                id="view-grouped"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-white shadow-sm text-gray-900">
          By Template
        </button>
        <button onclick="setSentViewMode('individual')"
                id="view-individual"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-gray-600">
          By Recipient
        </button>
      </div>
    </div>

    <!-- Existing Type Filter -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-600">Type:</span>
      <select id="sent-type-filter" onchange="filterSentInvitations()" class="text-sm border rounded-lg px-3 py-1.5">
        <option value="all">All</option>
        <option value="team">Teams</option>
        <option value="email">Email</option>
        <option value="link">Public Link</option>
      </select>
    </div>
  </div>

  <span id="sent-count" class="text-sm text-gray-500">0 invitations</span>
</div>
```

**View mode state:**
```javascript
let sentViewMode = localStorage.getItem('sentViewMode') || 'grouped';

function setSentViewMode(mode) {
  sentViewMode = mode;
  localStorage.setItem('sentViewMode', mode);

  // Update toggle UI
  document.getElementById('view-grouped').classList.toggle('bg-white', mode === 'grouped');
  document.getElementById('view-grouped').classList.toggle('shadow-sm', mode === 'grouped');
  document.getElementById('view-grouped').classList.toggle('text-gray-900', mode === 'grouped');
  document.getElementById('view-grouped').classList.toggle('text-gray-600', mode !== 'grouped');

  document.getElementById('view-individual').classList.toggle('bg-white', mode === 'individual');
  document.getElementById('view-individual').classList.toggle('shadow-sm', mode === 'individual');
  document.getElementById('view-individual').classList.toggle('text-gray-900', mode === 'individual');
  document.getElementById('view-individual').classList.toggle('text-gray-600', mode !== 'individual');

  // Re-render
  renderSentContent();
}
```

**Individual View (Tracking Table):**
```html
<div id="sent-individual-view" class="hidden">
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div class="grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
      <span>Recipient</span>
      <span>Template</span>
      <span>Status</span>
      <span>Sent</span>
      <span>Action</span>
    </div>
    <div id="tracking-rows">
      <!-- Rows rendered dynamically -->
    </div>
  </div>
</div>
```

**Individual row render function:**
```javascript
function renderRecipientRow(invitation, templateName) {
  const statusColors = {
    'completed': 'bg-green-100 text-green-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'pending': 'bg-amber-100 text-amber-800',
    'expired': 'bg-gray-100 text-gray-600'
  };

  const statusLabels = {
    'completed': 'Completed',
    'in_progress': 'In Progress',
    'pending': 'Pending',
    'expired': 'Expired'
  };

  const actionLabels = {
    'completed': 'View Results',
    'in_progress': 'Remind',
    'pending': 'Remind',
    'expired': 'Resend'
  };

  return `
    <div class="grid grid-cols-5 gap-4 px-5 py-4 border-t border-gray-100 items-center hover:bg-gray-50">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full brand-gradient flex items-center justify-center text-white text-xs font-semibold">
          ${getInitials(invitation.recipient_name || invitation.recipient_email)}
        </div>
        <div class="min-w-0">
          <div class="font-medium text-gray-900 truncate">${escapeHtml(invitation.recipient_name || 'Unknown')}</div>
          <div class="text-xs text-gray-500 truncate">${escapeHtml(invitation.recipient_email)}</div>
        </div>
      </div>
      <span class="text-gray-600 truncate">${escapeHtml(templateName)}</span>
      <span class="inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[invitation.status] || statusColors.pending}">
        ${statusLabels[invitation.status] || 'Unknown'}
      </span>
      <span class="text-gray-500">${formatDate(invitation.sent_at)}</span>
      <button onclick="handleSentAction('${invitation._id}', '${invitation.status}')"
              class="text-sm text-blue-600 hover:underline text-left">
        ${actionLabels[invitation.status] || 'View'}
      </button>
    </div>
  `;
}

function renderSentIndividualView(batches) {
  const rows = [];
  batches.forEach(batch => {
    batch.invitations.forEach(inv => {
      rows.push(renderRecipientRow(inv, batch.template.name));
    });
  });

  document.getElementById('tracking-rows').innerHTML = rows.join('') ||
    '<div class="px-5 py-8 text-center text-gray-500">No invitations found</div>';
}
```

### Tab 4: Team Results - Inline

**HTML structure:**
```html
<div id="tab-results" class="tab-content hidden">
  <div id="results-loading" class="text-center py-12">
    <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
    <p class="mt-4 text-gray-500">Loading team results...</p>
  </div>

  <div id="results-empty" class="hidden text-center py-12 bg-white border-2 border-dashed border-gray-200 rounded-xl">
    <div class="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-1">No Team Results Yet</h3>
    <p class="text-sm text-gray-500">Team members haven't completed any assessments yet.</p>
  </div>

  <div id="results-grid" class="hidden grid md:grid-cols-3 gap-4">
    <!-- Result cards rendered here -->
  </div>
</div>
```

### Shared Score Ring Function (Used by U5a and U5b)

```javascript
/**
 * Render an SVG score ring
 * @param {number} score - Score 0-100
 * @param {number} size - Ring size in pixels (default 64)
 * @param {boolean} showValue - Show value in center (default true)
 * @returns {string} HTML string
 */
function renderScoreRing(score, size = 64, showValue = true) {
  const radius = (size / 2) - 4; // Account for stroke width
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (normalizedScore / 100) * circumference;

  // Color based on score
  let color;
  if (normalizedScore >= 70) {
    color = '#22c55e'; // Green
  } else if (normalizedScore >= 40) {
    color = '#F59E0B'; // Amber
  } else {
    color = '#EF4444'; // Red
  }

  const valueDisplay = normalizedScore > 0 ? Math.round(normalizedScore) : '—';
  const fontSize = size < 50 ? 12 : size < 70 ? 14 : 18;

  return `
    <div class="score-ring relative" style="width: ${size}px; height: ${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg)">
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="#E5E7EB" stroke-width="4"/>
        <circle cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="${color}" stroke-width="4"
                stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                style="transition: stroke-dashoffset 0.5s ease-out"/>
      </svg>
      ${showValue ? `<span class="absolute inset-0 flex items-center justify-center text-gray-900 font-bold" style="font-size: ${fontSize}px">${valueDisplay}</span>` : ''}
    </div>
  `;
}
```

**Result card using shared function:**
```javascript
function renderTeamResultCard(member) {
  return `
    <div class="result-card bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
      <div class="flex justify-center mb-3">
        ${renderScoreRing(member.overall_score, 64)}
      </div>
      <div class="text-center mb-3">
        <div class="font-semibold text-gray-900">${escapeHtml(member.name)}</div>
        <div class="text-xs text-gray-500">${escapeHtml(member.role || 'Team Member')}</div>
      </div>
      <div class="flex gap-2 text-center">
        <div class="flex-1 bg-gray-50 rounded-lg py-2">
          <div class="text-sm font-bold text-indigo-600">${member.dimensions?.speed ?? '—'}</div>
          <div class="text-xs text-gray-500">Speed</div>
        </div>
        <div class="flex-1 bg-gray-50 rounded-lg py-2">
          <div class="text-sm font-bold text-green-600">${member.dimensions?.strength ?? '—'}</div>
          <div class="text-xs text-gray-500">Strength</div>
        </div>
        <div class="flex-1 bg-gray-50 rounded-lg py-2">
          <div class="text-sm font-bold text-blue-600">${member.dimensions?.intelligence ?? '—'}</div>
          <div class="text-xs text-gray-500">Intel</div>
        </div>
      </div>
    </div>
  `;
}
```

---

## API Specifications

### GET /api/assessments/kpi-summary (NEW)

**Role-Aware Implementation:**

```javascript
// server/routes/assessments.js

router.get('/kpi-summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const companyId = req.user.company_id;
    const isConsultant = req.user.role === 'CONSULTANT';

    let pending, templates, sent, completed;

    if (isConsultant) {
      // CONSULTANT: Cross-company counts
      [pending, templates, sent, completed] = await Promise.all([
        // Assessments assigned to consultant (any company)
        Invitation.countDocuments({
          recipient_id: userId,
          status: { $in: ['pending', 'sent'] }
        }),
        // Templates created by consultant
        AssessmentTemplate.countDocuments({
          created_by: userId
        }),
        // Invitations sent by consultant (any company)
        Invitation.countDocuments({
          sent_by: userId
        }),
        // Completed invitations sent by consultant
        Invitation.countDocuments({
          sent_by: userId,
          status: 'completed'
        })
      ]);
    } else {
      // Non-CONSULTANT: Company-scoped counts
      [pending, templates, sent, completed] = await Promise.all([
        // Assessments assigned to user (their company)
        Invitation.countDocuments({
          recipient_id: userId,
          company_id: companyId,
          status: { $in: ['pending', 'sent'] }
        }),
        // Company templates + global templates
        AssessmentTemplate.countDocuments({
          $or: [
            { company_id: companyId },
            { is_global: true }
          ]
        }),
        // Invitations sent by user (their company)
        Invitation.countDocuments({
          sent_by: userId,
          company_id: companyId
        }),
        // Completed invitations in their company
        Invitation.countDocuments({
          sent_by: userId,
          company_id: companyId,
          status: 'completed'
        })
      ]);
    }

    res.json({
      success: true,
      data: { pending, templates, sent, completed }
    });

  } catch (error) {
    console.error('KPI summary error:', error);
    res.status(500).json({ success: false, error: 'Failed to load KPI data' });
  }
});
```

**Required Indexes (verify/create):**
```javascript
// Ensure these indexes exist for performance
Invitation.collection.createIndex({ recipient_id: 1, status: 1 });
Invitation.collection.createIndex({ recipient_id: 1, company_id: 1, status: 1 });
Invitation.collection.createIndex({ sent_by: 1 });
Invitation.collection.createIndex({ sent_by: 1, company_id: 1 });
Invitation.collection.createIndex({ sent_by: 1, status: 1 });
AssessmentTemplate.collection.createIndex({ created_by: 1 });
AssessmentTemplate.collection.createIndex({ company_id: 1 });
```

### GET /api/assessments/team/:companyId (EXISTS - Verify Shape)

**Expected response shape:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "...",
      "name": "Mike Johnson",
      "email": "mike@example.com",
      "role": "Operations Manager",
      "overall_score": 80,
      "dimensions": {
        "speed": 85,
        "strength": 78,
        "intelligence": 77
      },
      "assessment_date": "2026-01-15"
    }
  ]
}
```

**If response doesn't match, transform client-side:**
```javascript
function normalizeTeamResults(data) {
  return data.map(member => ({
    user_id: member.user_id || member._id,
    name: member.name || member.user?.name || 'Unknown',
    email: member.email || member.user?.email,
    role: member.role || member.user?.role || 'Team Member',
    overall_score: member.overall_score || member.ssi_result?.overall || 0,
    dimensions: member.dimensions || member.ssi_result?.dimensions || {},
    assessment_date: member.assessment_date || member.created_at
  }));
}
```

---

## Implementation Checklist

### Backend (1.5h)

- [ ] **Create `GET /api/assessments/kpi-summary`** (1h)
  - File: `server/routes/assessments.js`
  - Role-aware logic (CONSULTANT vs non-CONSULTANT)
  - 4 parallel count queries
  - Return: `{ pending, templates, sent, completed }`

- [ ] **Verify/Create indexes** (0.5h)
  - Check existing indexes on Invitation, AssessmentTemplate
  - Create missing indexes for KPI performance

### Frontend (4h)

- [ ] **Pre-verification** (0.25h)
  - Verify `getInitials()`, `formatDate()`, `escapeHtml()` in common.js
  - Add if missing

- [ ] **Branding update** (0.5h)
  - Rename `.karvia-gradient` → `.brand-gradient`
  - Update color: `#667eea` → `#1e3a5f`
  - Search and replace all references

- [ ] **Add shared `renderScoreRing()` function** (0.25h)
  - Add to page or common.js
  - Will be reused by U5b

- [ ] **KPI header** (0.75h)
  - Add HTML structure after page title
  - Create `loadKPIData()` function
  - Call `/api/assessments/kpi-summary`
  - Update KPI card values
  - Handle loading/error states

- [ ] **Role-adaptive tabs** (0.5h)
  - Add `CONSULTANT_TABS` and `NON_CONSULTANT_TABS` arrays
  - Render correct tabs based on `currentUser.role`
  - Tab 4 for CONSULTANT will be implemented in U5b

- [ ] **Tab badges** (0.25h)
  - Update badge counts from KPI data
  - Style active vs inactive badges

- [ ] **Sent tab dual view** (1h)
  - Add view toggle UI
  - Create `setSentViewMode()` function
  - Create `renderSentIndividualView()` function
  - Persist preference in localStorage
  - Maintain existing grouped view

- [ ] **Team Results inline** (0.5h)
  - Replace external link with results grid
  - Create `loadTeamResults()` function
  - Use `renderTeamResultCard()` with `renderScoreRing()`
  - Add loading/empty states

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No pending assessments | Show "0" in KPI, empty state in tab |
| No templates | Show "0" in KPI, empty state with "Create Template" CTA |
| No sent assessments | Show "0" in KPI, empty state with guidance |
| No team results | Show empty state "No team assessments completed yet" |
| API error on KPI | Show "-" for all counts, log error, page still functional |
| User with no company_id | Redirect to onboarding (existing behavior) |
| CONSULTANT with no clients | Show My Clients tab with empty state (U5b handles) |

---

## Testing Checklist

- [ ] KPI counts match actual data (verify in DB)
- [ ] KPI counts differ correctly for CONSULTANT vs non-CONSULTANT
- [ ] Tab badges update correctly on page load
- [ ] Correct tabs shown for CONSULTANT (4 tabs, no Team Results)
- [ ] Correct tabs shown for non-CONSULTANT (4 tabs, includes Team Results)
- [ ] Sent view toggle persists on refresh
- [ ] Individual view shows all recipients across batches
- [ ] Individual view status badges show correct colors
- [ ] Team Results loads and renders correctly
- [ ] SVG score rings display accurate percentages
- [ ] Score ring colors: green ≥70, amber ≥40, red <40
- [ ] Empty states show for each tab when no data
- [ ] Branding is consistent (navy gradient everywhere)
- [ ] All text escaped with `escapeHtml()`
- [ ] Mobile responsive (test 3-col → 2-col → 1-col grid)
- [ ] `renderScoreRing()` works with various sizes

---

## Files Modified

| File | Changes |
|------|---------|
| `server/routes/assessments.js` | +45 lines: kpi-summary endpoint |
| `client/js/common.js` | +20 lines: getInitials, formatDate (if missing) |
| `client/pages/assessment-hub.html` | ~250 lines modified: KPI, branding, tabs, views, results |

---

## Rollback Plan

| Issue | Action |
|-------|--------|
| KPI endpoint fails | Hide KPI row via CSS, page still functional |
| Team Results API issue | Show "View Full Dashboard" link as fallback |
| Branding looks wrong | Revert `.brand-gradient` to original colors |
| Sent individual view broken | Default to grouped view, hide toggle |

---

**Epic U5a Ready for Implementation**

---

## Shared Resources for U5b

U5b will reuse these from U5a:
1. `renderScoreRing(score, size, showValue)` - Score ring SVG
2. `getInitials(name)` - Avatar initials
3. `formatDate(date)` - Date formatting
4. `escapeHtml(text)` - XSS protection
5. `.brand-gradient` - Navy gradient class
6. Tab rendering pattern
7. KPI card styling
