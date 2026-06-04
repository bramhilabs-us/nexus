# Sprint 5 - Epic 4: Consultant Management Dashboard
**Priority**: P1 (Enable consultant multi-company management)
**Story Points**: 15 (Revised from 13)
**Estimated Duration**: 3-4 hours (Revised from 2.5-3 hours)
**Status**: ⏸️ DEFERRED TO SPRINT 5 (Was Sprint 4)

---

## ⚠️ DEFERRAL NOTICE

**Original Plan**: Sprint 4 implementation (13 points, 2.5-3 hours, 0 backend changes)

**Spec Review Findings**:
- 🔴 **3 Critical Issues** found that would break feature in production
- 🟡 **2 High Priority Issues** affecting security and UX
- **2 Backend API Changes Required** (not in original estimate)
- **Revised Estimate**: 15 points, 3-4 hours

**Decision**: Defer to Sprint 5 for proper planning and implementation

**Why Defer**:
1. Backend changes required (breaking assumption of "frontend-only")
2. Critical data missing from API responses (company_id not returned)
3. team-ssi-view.js doesn't support query parameters (major rework)
4. Need comprehensive testing with backend changes
5. Sprint 4 already in progress with other priorities

**Benefits of Deferring**:
- Properly account for backend work in planning
- Comprehensive testing without rushing
- Fix infrastructure issues first
- Better story point accuracy for Sprint 5

**See**: [EPIC-4-SPEC-REVIEW.md](./EPIC-4-SPEC-REVIEW.md) for detailed issue analysis

---

## 📋 Executive Summary

**Goal**: Enable consultants to manage multiple client companies by distinguishing between internal (own firm) and external (client) assessments and results.

**Initial Assumption**: 85% already exists! Just need to separate internal vs external in the UI.

**Reality After Review**: 75% exists, but critical pieces missing:
- ❌ API doesn't return company_id/company_name in invitation batches
- ❌ team-ssi-view.js doesn't support viewing external companies
- ❌ No null safety for consultants without own firm
- ✅ Backend access control exists (managed_businesses)
- ✅ Database schema supports it
- ✅ UI structure exists

---

## 🔍 Spec Review Summary

**Review Date**: November 25, 2025
**Issues Found**: 11 total (3 critical, 2 high, 4 medium, 2 low)
**Revised Scope**: Backend + Frontend changes required

### Critical Issues That Blocked Sprint 4 Implementation:

1. **Missing company_id in API Response** 🔴
   - `/api/invitations/sent-by-me` doesn't include company_id or company_name
   - Frontend cannot filter internal vs external without this data
   - **Fix**: Backend API change required

2. **team-ssi-view.js Ignores Query Parameters** 🔴
   - Script always uses user's company_id, ignores `?company_id=XXX`
   - Consultants cannot view external company results
   - **Fix**: Frontend script modification required

3. **Null Reference for Consultants Without Firm** 🔴
   - Consultants may have `company_id: null`
   - Filtering logic crashes
   - **Fix**: Null safety checks required

**Full Issue Analysis**: See [EPIC-4-SPEC-REVIEW.md](./EPIC-4-SPEC-REVIEW.md)

---

## ✅ What Already Exists (75%)

### Backend Infrastructure (95% Complete - Missing API Data)

**User Model** (`server/models/User.js:79-84`):
```javascript
managed_businesses: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  default: [],
  description: 'Array of company IDs that this consultant manages'
}
```

**API Endpoints** (All exist):
- ✅ `GET /api/assessments/company/:companyId/team-breakdown` - Consultant can view any managed company
- ✅ `POST /api/invitations/create` - Supports consultant sending to any managed company
- ✅ `POST /api/invitations/create-company-invitation` - Consultant creates external company
- ✅ `GET /api/invitations/sent` - Fetches all sent invitations (has `company_id`)
- ✅ `GET /api/companies` - Consultants see all managed companies

**Access Control** (`server/routes/assessments.js:672-678`):
```javascript
if (user.role === 'CONSULTANT') {
  if (!user.managed_businesses.includes(companyId)) {
    return res.status(403).json({ message: 'Access denied' });
  }
}
```

### Frontend Structure (Existing)

**Assessment Hub** (`client/pages/assessment-hub.html`):
- ✅ Tab system with role-based visibility (Line 363-368)
- ✅ "Sent by Me" tab (Line 93-111)
- ✅ "Team Results" tab (Line 113-129)
- ✅ "Send to Company" button (Line 576)
- ✅ Invitation rendering with company data (Line 610-682)

**Team SSI View** (`client/pages/team-ssi-view.html`):
- ✅ View toggle for Team/Company views (Line 81-88)
- ✅ Supports consultant viewing external companies
- ✅ SSI scores, function breakdown, weak areas, OKR generation

---

## ❌ What Needs to be Added (25% - Includes Backend Fixes)

### Backend Changes Required (NEW - Not in Original Spec)

**Change 1: Fix /api/invitations/sent-by-me Response** (30 min)
- File: `server/routes/invitations.js`
- Location: Lines 755-790
- Add `company_id` and `company_name` to batch response
- Populate company data: `.populate('company_id', 'company_name')`

**Change 2: Verify JWT Payload Includes managed_businesses** (15 min)
- File: `server/middleware/authGuards.js`
- Ensure JWT token includes `managed_businesses` array
- Frontend needs this for validation

**Change 3: Update team-ssi-view.js for Query Params** (30 min)
- File: `client/pages/scripts/team-ssi-view.js`
- Parse `?company_id=XXX` query parameter
- Validate consultant access to external companies
- Use query company_id for API calls

### Frontend Changes (assessment-hub.html + team-ssi-view.js)

**Change 1: Add Internal/External Sub-tabs to "Sent by Me"** (45 min)
- Add sub-tab navigation inside "Sent by Me" tab
- Filter sentData by comparing `invitation.company_id` with `currentUser.company_id`
- Internal: Invitations where `invitation.company_id === currentUser.company_id`
- External: Invitations where `invitation.company_id !== currentUser.company_id`

**Change 2: Rename "Team Results" → "Results" with Sub-tabs** (45 min)
- Rename tab label from "Team Results" to "Results"
- Add Internal/External sub-tabs
- Internal: Link to team-ssi-view.html with consultant's own company_id
- External: Show list of managed companies with result links

**Change 3: Fetch Managed Companies for External Results View** (30 min)
- Call `GET /api/companies` to get consultant's managed companies
- Display company cards with "View Results" button
- Each button links to team-ssi-view.html?company_id={companyId}

**Change 4: Add Company Context to Invitation Cards** (15 min)
- Display company name on external invitation cards
- Add visual distinction (badge/icon) for internal vs external

---

## 🎯 Implementation Guide

### PHASE 1: Backend Changes (Required First)

---

### Step 0A: Fix /api/invitations/sent-by-me Response (30 min)

**File**: `server/routes/invitations.js`
**Location**: Lines 755-790

**CRITICAL FIX**:

**CHANGE** (Line 755-761):
```javascript
// CURRENT:
const invitations = await Invitation.find({
  sent_by: user.id
})
  .populate('assessment_template_id', 'name description total_questions estimated_duration')
  .populate('recipient_user_id', 'first_name last_name email')
  .sort({ created_at: -1 })
  .lean();
```

**TO**:
```javascript
// FIXED:
const invitations = await Invitation.find({
  sent_by: user.id
})
  .populate('assessment_template_id', 'name description total_questions estimated_duration')
  .populate('company_id', 'company_name')  // ✅ ADD THIS - Populate company name
  .populate('recipient_user_id', 'first_name last_name email')
  .sort({ created_at: -1 })
  .lean();
```

**CHANGE** (Line 771-790 - Batch object):
```javascript
// CURRENT:
batchMap.set(batchKey, {
  batch_id: inv.assessment_batch_id || null,
  template: {
    id: inv.assessment_template_id?._id,
    name: inv.assessment_template_id?.name || 'Unknown Template',
    description: inv.assessment_template_id?.description,
    total_questions: inv.assessment_template_id?.total_questions || 0,
    estimated_duration: inv.assessment_template_id?.estimated_duration || 0
  },
  created_at: inv.created_at,
  expires_at: inv.expires_at,
  invitations: [],
  stats: {
    total: 0,
    completed: 0,
    in_progress: 0,
    pending: 0,
    expired: 0
  }
});
```

**TO**:
```javascript
// FIXED:
batchMap.set(batchKey, {
  batch_id: inv.assessment_batch_id || null,
  company_id: inv.company_id?._id || inv.company_id,  // ✅ ADD THIS
  company_name: inv.company_id?.company_name || null,  // ✅ ADD THIS
  template: {
    id: inv.assessment_template_id?._id,
    name: inv.assessment_template_id?.name || 'Unknown Template',
    description: inv.assessment_template_id?.description,
    total_questions: inv.assessment_template_id?.total_questions || 0,
    estimated_duration: inv.assessment_template_id?.estimated_duration || 0
  },
  created_at: inv.created_at,
  expires_at: inv.expires_at,
  invitations: [],
  stats: {
    total: 0,
    completed: 0,
    in_progress: 0,
    pending: 0,
    expired: 0
  }
});
```

**Why Critical**: Frontend cannot filter internal vs external invitations without company_id in response.

---

### Step 0B: Verify JWT Includes managed_businesses (15 min)

**File**: `server/middleware/authGuards.js`
**Location**: Around line 257

**VERIFY** this exists in JWT payload generation:
```javascript
const payload = {
  id: user._id,
  email: user.email,
  role: user.role,
  company_id: user.company_id,
  managed_businesses: user.managed_businesses || []  // ✅ VERIFY THIS EXISTS
};

const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
```

**If missing**, add `managed_businesses` to JWT payload.

**Why Critical**: Frontend needs this array to validate consultant access to external companies.

---

### Step 0C: Update team-ssi-view.js for External Companies (30 min)

**File**: `client/pages/scripts/team-ssi-view.js`
**Location**: Lines 18-43 (init() function)

**CRITICAL FIX**:

**REPLACE**:
```javascript
async init() {
  // Get user from localStorage
  const userStr = localStorage.getItem('karvia_user');
  if (!userStr) {
    window.location.href = '/pages/login.html';
    return;
  }

  this.user = JSON.parse(userStr);
  this.companyId = this.user.company_id;  // ❌ PROBLEM: Ignores query param

  // Check if user has permission to view team results
  if (!['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'].includes(this.user.role)) {
    this.showError('You do not have permission to view team results');
    return;
  }

  // Setup breadcrumb and view toggle
  this.setupNavigation();

  // Load results based on initial view
  await this.loadResults();

  // Setup event listeners
  this.setupEventListeners();
}
```

**WITH**:
```javascript
async init() {
  // Get user from localStorage
  const userStr = localStorage.getItem('karvia_user');
  if (!userStr) {
    window.location.href = '/pages/login.html';
    return;
  }

  this.user = JSON.parse(userStr);

  // ✅ FIX: Support ?company_id=XXX for consultant external viewing
  const urlParams = new URLSearchParams(window.location.search);
  const queryCompanyId = urlParams.get('company_id');

  if (queryCompanyId) {
    // External company viewing (consultant only)
    if (this.user.role === 'CONSULTANT') {
      // Validate consultant has access to this company
      const managedBusinesses = this.user.managed_businesses || [];
      const hasAccess = managedBusinesses.some(
        bid => bid.toString() === queryCompanyId
      );

      if (!hasAccess) {
        this.showError('You do not have access to this company. Please contact support if you believe this is an error.');
        return;
      }

      this.companyId = queryCompanyId;
      this.isExternalView = true;

      // Update header to show external company context
      document.getElementById('breadcrumb-current').textContent = 'Client Results';
    } else {
      // Non-consultants can only view their own company
      console.warn('Non-consultant attempted to view different company, using own company_id');
      this.companyId = this.user.company_id;
      this.isExternalView = false;
    }
  } else {
    // Default: View own company
    this.companyId = this.user.company_id;
    this.isExternalView = false;
  }

  // Null check
  if (!this.companyId) {
    this.showError('No company associated with your account. Please contact support.');
    return;
  }

  // Check if user has permission to view team results
  if (!['MANAGER', 'EXECUTIVE', 'BUSINESS_OWNER', 'CONSULTANT'].includes(this.user.role)) {
    this.showError('You do not have permission to view team results');
    return;
  }

  // Setup breadcrumb and view toggle
  this.setupNavigation();

  // Load results based on initial view
  await this.loadResults();

  // Setup event listeners
  this.setupEventListeners();
}
```

**Why Critical**: Without this, consultants cannot view external company results. All "View Results →" links will fail.

---

### PHASE 2: Frontend Changes (assessment-hub.html)

---

### Step 1: Update Tab Configuration (5 min)

**File**: `client/pages/assessment-hub.html`
**Location**: Line 363-368

**CHANGE**:
```javascript
const tabs = [
  { id: 'assigned', label: 'Assigned to Me', icon: '📥', visible: true },
  { id: 'templates', label: 'My Templates', icon: '📋', visible: isManager },
  { id: 'sent', label: 'Sent by Me', icon: '📤', visible: isManager },
  { id: 'results', label: 'Team Results', icon: '📊', visible: isManager }
];
```

**TO**:
```javascript
const tabs = [
  { id: 'assigned', label: 'Assigned to Me', icon: '📥', visible: true },
  { id: 'templates', label: 'My Templates', icon: '📋', visible: isManager },
  { id: 'sent', label: 'Sent by Me', icon: '📤', visible: isManager },
  { id: 'results', label: 'Results', icon: '📊', visible: isManager }  // Changed label
];
```

---

### Step 2: Add Sub-tabs to "Sent by Me" Tab (45 min)

**File**: `client/pages/assessment-hub.html`
**Location**: Line 93-111

**REPLACE**:
```html
<!-- Tab 3: Sent by Me (MANAGER+) -->
<div id="tab-sent" class="tab-content">
    <div id="sent-empty" class="hidden">
        <!-- Empty state -->
    </div>
    <div id="sent-list" class="hidden grid gap-4">
        <!-- Sent invitations will be rendered here -->
    </div>
</div>
```

**WITH**:
```html
<!-- Tab 3: Sent by Me (MANAGER+) -->
<div id="tab-sent" class="tab-content">
    <!-- Sub-tabs for CONSULTANT role only -->
    <div id="sent-subtabs" class="mb-4 hidden">
        <div class="flex space-x-2 border-b border-gray-200">
            <button id="sent-internal-btn" onclick="switchSentSubtab('internal')"
                    class="sent-subtab px-4 py-2 font-medium text-sm border-b-2 transition-colors">
                Internal <span id="sent-internal-count" class="ml-1 text-xs text-gray-500"></span>
            </button>
            <button id="sent-external-btn" onclick="switchSentSubtab('external')"
                    class="sent-subtab px-4 py-2 font-medium text-sm border-b-2 transition-colors">
                External <span id="sent-external-count" class="ml-1 text-xs text-gray-500"></span>
            </button>
        </div>
    </div>

    <div id="sent-empty" class="hidden">
        <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-3xl p-12 text-center">
            <div class="max-w-2xl mx-auto">
                <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-3">No Assessments Sent Yet</h2>
                <p class="text-gray-600 mb-6" id="sent-empty-message">You haven't sent any assessments. Go to "My Templates" to get started.</p>
            </div>
        </div>
    </div>
    <div id="sent-list" class="hidden grid gap-4">
        <!-- Sent invitations will be rendered here -->
    </div>
</div>
```

---

### Step 3: Add JavaScript Variables and Functions (45 min)

**File**: `client/pages/assessment-hub.html`
**Location**: After line 336 (in script section)

**ADD**:
```javascript
let currentSentSubtab = 'internal';  // Default to internal for consultants
let currentResultsSubtab = 'internal';
let managedCompanies = [];

// Load managed companies for consultant
async function loadManagedCompanies() {
    if (currentUser.role !== 'CONSULTANT') return;

    try {
        const token = localStorage.getItem('karvia_auth_token');
        const response = await fetch('/api/companies', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
            managedCompanies = data.data || [];
        }
    } catch (error) {
        console.error('Error loading managed companies:', error);
    }
}

// Switch between internal/external sent invitations
function switchSentSubtab(subtab) {
    currentSentSubtab = subtab;

    // Update button styles
    document.querySelectorAll('.sent-subtab').forEach(btn => {
        btn.classList.remove('border-purple-600', 'text-purple-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });

    const activeBtn = document.getElementById(`sent-${subtab}-btn`);
    activeBtn.classList.remove('border-transparent', 'text-gray-600');
    activeBtn.classList.add('border-purple-600', 'text-purple-600');

    // Re-render invitations with filter
    renderSentInvitations();
}

// Switch between internal/external results view
function switchResultsSubtab(subtab) {
    currentResultsSubtab = subtab;

    // Update button styles
    document.querySelectorAll('.results-subtab').forEach(btn => {
        btn.classList.remove('border-purple-600', 'text-purple-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });

    const activeBtn = document.getElementById(`results-${subtab}-btn`);
    activeBtn.classList.remove('border-transparent', 'text-gray-600');
    activeBtn.classList.add('border-purple-600', 'text-purple-600');

    // Toggle internal/external views
    document.getElementById('results-internal-view').classList.toggle('hidden', subtab !== 'internal');
    document.getElementById('results-external-view').classList.toggle('hidden', subtab !== 'external');
}
```

---

### Step 4: Update loadSentInvitations() to Show Sub-tabs (15 min)

**File**: `client/pages/assessment-hub.html`
**Location**: Line 584-608

**IMPORTANT**: This step requires Step 0A (backend fix) to be completed first, as it uses `company_id` from API response.

**MODIFY**:
```javascript
async function loadSentInvitations() {
    try {
        const response = await window.AssessmentAPI.getSentInvitations();
        console.log('Sent invitations:', response);

        if (!response.success) {
            throw new Error(response.error || 'Failed to load sent invitations');
        }

        sentData = response.data || [];

        // Show sub-tabs for consultants
        if (currentUser.role === 'CONSULTANT') {
            document.getElementById('sent-subtabs').classList.remove('hidden');

            // Count internal vs external
            const internalCount = sentData.filter(inv =>
                inv.company_id?.toString() === currentUser.company_id?.toString()
            ).length;
            const externalCount = sentData.length - internalCount;

            document.getElementById('sent-internal-count').textContent = `(${internalCount})`;
            document.getElementById('sent-external-count').textContent = `(${externalCount})`;

            // Set default active sub-tab
            switchSentSubtab('internal');
        }

        if (sentData.length === 0) {
            document.getElementById('sent-empty').classList.remove('hidden');
            document.getElementById('sent-list').classList.add('hidden');
        } else {
            document.getElementById('sent-empty').classList.add('hidden');
            document.getElementById('sent-list').classList.remove('hidden');
            renderSentInvitations();
        }
    } catch (error) {
        console.error('Load sent error:', error);
        document.getElementById('sent-empty').classList.remove('hidden');
        document.getElementById('sent-list').classList.add('hidden');
    }
}
```

---

### Step 5: Update renderSentInvitations() to Filter by Sub-tab (30 min)

**File**: `client/pages/assessment-hub.html`
**Location**: Line 610-682

**IMPORTANT**: This step requires Step 0A (backend fix) for `company_id` in batch data.

**MODIFY** (add filtering at the start with null safety):
```javascript
function renderSentInvitations() {
    const list = document.getElementById('sent-list');

    // Filter data based on consultant sub-tab
    let filteredData = sentData;
    if (currentUser.role === 'CONSULTANT') {
        if (currentSentSubtab === 'internal') {
            // Internal: invitations within consultant's own company
            // ✅ NULL SAFETY: Handle consultants without company_id
            if (!currentUser.company_id) {
                // Consultant has no firm - no internal invitations
                filteredData = [];
            } else {
                filteredData = sentData.filter(inv =>
                    inv.company_id?.toString() === currentUser.company_id.toString()
                );
            }
        } else {
            // External: invitations to client companies
            // ✅ NULL SAFETY: If consultant has no company_id, ALL invitations are external
            if (!currentUser.company_id) {
                filteredData = sentData;
            } else {
                filteredData = sentData.filter(inv =>
                    inv.company_id?.toString() !== currentUser.company_id.toString()
                );
            }
        }

        // Update empty state message
        if (filteredData.length === 0) {
            document.getElementById('sent-list').classList.add('hidden');
            document.getElementById('sent-empty').classList.remove('hidden');
            const emptyMsg = document.getElementById('sent-empty-message');
            if (currentSentSubtab === 'internal') {
                emptyMsg.textContent = 'No internal assessments sent yet. Send assessments to your team using "Send to Team".';
            } else {
                emptyMsg.textContent = 'No external assessments sent yet. Send assessments to client companies using "Send to Company".';
            }
            return;
        } else {
            document.getElementById('sent-empty').classList.add('hidden');
            document.getElementById('sent-list').classList.remove('hidden');
        }
    }

    list.innerHTML = filteredData.map(batch => {
        const dueDate = new Date(batch.expires_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const progressPercent = batch.completion_rate;
        const isDue = batch.days_until_due <= 3 && batch.days_until_due > 0;
        const isOverdue = batch.is_overdue;

        // Get company name for external invitations
        // ✅ NULL SAFETY: Show badge if external (different company) or consultant has no firm
        const isExternal = currentUser.role === 'CONSULTANT' &&
                          (!currentUser.company_id ||
                           batch.company_id?.toString() !== currentUser.company_id.toString());
        const companyBadge = isExternal
            ? `<span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded ml-2">📊 ${batch.company_name || 'External Company'}</span>`
            : '';

        return `
            <div class="bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-all">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center">
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">${batch.template.name}</h3>
                            ${companyBadge}
                        </div>
                        <p class="text-sm text-gray-600 mb-3">Sent to ${batch.stats.total} team member${batch.stats.total !== 1 ? 's' : ''}</p>

                        <!-- Rest of the invitation card remains the same -->
                        <div class="flex flex-wrap gap-2 text-sm mb-4">
                            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                ✓ ${batch.stats.completed} Completed
                            </span>
                            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                ⏱ ${batch.stats.in_progress} In Progress
                            </span>
                            <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                ⏸ ${batch.stats.pending} Pending
                            </span>
                            ${batch.stats.expired > 0 ? `
                                <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                                    ✗ ${batch.stats.expired} Expired
                                </span>
                            ` : ''}
                        </div>

                        <!-- Progress Bar -->
                        <div class="mb-2">
                            <div class="flex items-center justify-between text-sm mb-1">
                                <span class="text-gray-600">Completion Rate</span>
                                <span class="font-semibold text-gray-900">${progressPercent}%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="karvia-gradient h-2 rounded-full" style="width: ${progressPercent}%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="text-sm">
                        <p class="text-gray-500">Due: <span class="font-medium ${isOverdue ? 'text-red-600' : isDue ? 'text-yellow-600' : 'text-gray-900'}">${dueDate}</span></p>
                        ${isOverdue ? '<p class="text-red-600 font-medium">⚠ Overdue</p>' : ''}
                        ${isDue ? `<p class="text-yellow-600 font-medium">⚠ Due in ${batch.days_until_due} day${batch.days_until_due !== 1 ? 's' : ''}</p>` : ''}
                    </div>
                    <div class="flex space-x-2">
                        <button
                            class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                            disabled
                            title="Detailed invitation tracking coming soon">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
```

---

### Step 6: Update "Results" Tab with Internal/External Views (45 min)

**File**: `client/pages/assessment-hub.html`
**Location**: Line 113-129

**REPLACE**:
```html
<!-- Tab 4: Team Results (MANAGER+) -->
<div id="tab-results" class="tab-content">
    <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-3xl p-12 text-center">
        <div class="max-w-2xl mx-auto">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">Team Results Dashboard</h2>
            <p class="text-gray-600 mb-6">View aggregated team assessment results and insights.</p>
            <a href="/pages/team-ssi-view.html" class="inline-block karvia-gradient text-white px-8 py-3 rounded-lg font-medium text-lg">
                View Team Dashboard →
            </a>
        </div>
    </div>
</div>
```

**WITH**:
```html
<!-- Tab 4: Results (MANAGER+) -->
<div id="tab-results" class="tab-content">
    <!-- Sub-tabs for CONSULTANT role only -->
    <div id="results-subtabs" class="mb-4 hidden">
        <div class="flex space-x-2 border-b border-gray-200">
            <button id="results-internal-btn" onclick="switchResultsSubtab('internal')"
                    class="results-subtab px-4 py-2 font-medium text-sm border-b-2 transition-colors">
                Internal Results
            </button>
            <button id="results-external-btn" onclick="switchResultsSubtab('external')"
                    class="results-subtab px-4 py-2 font-medium text-sm border-b-2 transition-colors">
                Client Companies <span id="results-external-count" class="ml-1 text-xs text-gray-500"></span>
            </button>
        </div>
    </div>

    <!-- Internal Results View (for all MANAGER+ users) -->
    <div id="results-internal-view">
        <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-3xl p-12 text-center">
            <div class="max-w-2xl mx-auto">
                <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-3" id="results-header-title">Team Results Dashboard</h2>
                <p class="text-gray-600 mb-6" id="results-header-subtitle">View aggregated team assessment results and insights.</p>
                <a href="/pages/team-ssi-view.html" class="inline-block karvia-gradient text-white px-8 py-3 rounded-lg font-medium text-lg">
                    View Results →
                </a>
            </div>
        </div>
    </div>

    <!-- External Results View (CONSULTANT only) -->
    <div id="results-external-view" class="hidden">
        <div id="external-companies-loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p class="text-gray-500">Loading client companies...</p>
        </div>

        <div id="external-companies-empty" class="hidden">
            <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-3xl p-12 text-center">
                <div class="max-w-2xl mx-auto">
                    <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-3">No Client Companies Yet</h2>
                    <p class="text-gray-600 mb-6">You haven't created any client companies. Use "Send to Company" in the Templates tab to get started.</p>
                </div>
            </div>
        </div>

        <div id="external-companies-grid" class="hidden grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Company cards will be rendered here -->
        </div>
    </div>
</div>
```

---

### Step 7: Add loadExternalResults() Function (30 min)

**File**: `client/pages/assessment-hub.html`
**Location**: After loadTabData() function (around line 430)

**ADD**:
```javascript
async function loadExternalResults() {
    if (currentUser.role !== 'CONSULTANT') return;

    try {
        document.getElementById('external-companies-loading').classList.remove('hidden');
        document.getElementById('external-companies-empty').classList.add('hidden');
        document.getElementById('external-companies-grid').classList.add('hidden');

        // Load managed companies (excluding consultant's own company)
        await loadManagedCompanies();

        const externalCompanies = managedCompanies.filter(
            company => company._id.toString() !== currentUser.company_id?.toString()
        );

        document.getElementById('external-companies-loading').classList.add('hidden');
        document.getElementById('results-external-count').textContent = `(${externalCompanies.length})`;

        if (externalCompanies.length === 0) {
            document.getElementById('external-companies-empty').classList.remove('hidden');
        } else {
            document.getElementById('external-companies-grid').classList.remove('hidden');
            renderExternalCompanies(externalCompanies);
        }
    } catch (error) {
        console.error('Error loading external results:', error);
        document.getElementById('external-companies-loading').classList.add('hidden');
        document.getElementById('external-companies-empty').classList.remove('hidden');
    }
}

function renderExternalCompanies(companies) {
    const grid = document.getElementById('external-companies-grid');

    grid.innerHTML = companies.map(company => `
        <div class="bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-all">
            <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <span class="text-2xl">🏢</span>
                </div>
                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Client</span>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-2">${company.company_name}</h3>

            <div class="space-y-2 mb-4 text-sm text-gray-600">
                ${company.industry ? `
                    <div class="flex items-center">
                        <span class="mr-2">🏭</span>
                        <span>${company.industry}</span>
                    </div>
                ` : ''}
                ${company.size ? `
                    <div class="flex items-center">
                        <span class="mr-2">👥</span>
                        <span>${company.size} employees</span>
                    </div>
                ` : ''}
                <div class="flex items-center">
                    <span class="mr-2">📅</span>
                    <span>Added ${new Date(company.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <a href="/pages/team-ssi-view.html?company_id=${company._id}"
               class="block w-full text-center px-4 py-2 karvia-gradient text-white rounded-lg font-medium hover:opacity-90 transition">
                View Results →
            </a>
        </div>
    `).join('');
}
```

---

### Step 8: Update loadTabData() to Handle Results Tab (10 min)

**File**: `client/pages/assessment-hub.html`
**Location**: Line 407-430

**MODIFY**:
```javascript
async function loadTabData(tabId) {
    document.getElementById('loading-state').classList.remove('hidden');

    try {
        switch(tabId) {
            case 'assigned':
                await loadAssignedInvitations();
                break;
            case 'templates':
                await loadTemplates();
                break;
            case 'sent':
                await loadSentInvitations();
                break;
            case 'results':
                // Show sub-tabs for consultants
                if (currentUser.role === 'CONSULTANT') {
                    document.getElementById('results-subtabs').classList.remove('hidden');
                    document.getElementById('results-header-title').textContent = 'Your Team Results';
                    document.getElementById('results-header-subtitle').textContent = 'View your consulting firm\'s team results.';
                    switchResultsSubtab('internal');  // Default to internal
                    await loadExternalResults();  // Pre-load external companies
                }
                break;
        }
    } catch (error) {
        console.error(`Error loading ${tabId} data:`, error);
    } finally {
        document.getElementById('loading-state').classList.add('hidden');
    }
}
```

---

### Step 9: Initialize Consultant Context on Page Load (5 min)

**File**: `client/pages/assessment-hub.html`
**Location**: Line 341-357 (inside DOMContentLoaded)

**ADD** after `window.NavigationManager.init(currentUser);`:
```javascript
// Load managed companies for consultants
if (currentUser.role === 'CONSULTANT') {
    await loadManagedCompanies();  // ✅ Await to prevent race condition
}
```

**ALSO ADD** - Hide internal tab if consultant has no firm:
```javascript
// Handle consultants without own company
if (currentUser.role === 'CONSULTANT' && !currentUser.company_id) {
    // Consultant has no firm - hide internal tabs by default
    console.log('Consultant has no company_id - external-only mode');
    currentSentSubtab = 'external';
    currentResultsSubtab = 'external';
}
```

---

## 📊 Visual Result

### Before (Current):

**"Sent by Me" Tab**:
```
┌─────────────────────────────────────────┐
│ Assessment Name                         │
│ Sent to 5 team members                  │
│ ✓ 3 Completed  ⏱ 1 In Progress         │
└─────────────────────────────────────────┘
```

**"Team Results" Tab**:
```
┌─────────────────────────────────────────┐
│        Team Results Dashboard           │
│   View aggregated team results          │
│     [View Team Dashboard →]             │
└─────────────────────────────────────────┘
```

---

### After (With Consultant Features):

**"Sent by Me" Tab (Consultant)**:
```
┌─────────────────────────────────────────┐
│ [Internal (3)]  [External (2)]          │
├─────────────────────────────────────────┤
│ Assessment Name         📊 Logis Co.    │
│ Sent to 5 team members                  │
│ ✓ 3 Completed  ⏱ 1 In Progress         │
└─────────────────────────────────────────┘
```

**"Results" Tab (Consultant)**:
```
┌─────────────────────────────────────────┐
│ [Internal Results]  [Client Companies(4)]│
├─────────────────────────────────────────┤
│  🏢 Logis Company          [Client]     │
│  🏭 Technology  👥 150 employees        │
│  📅 Added Jan 15, 2025                  │
│         [View Results →]                │
├─────────────────────────────────────────┤
│  🏢 ABC Manufacturing      [Client]     │
│  🏭 Manufacturing  👥 200 employees     │
│  📅 Added Feb 3, 2025                   │
│         [View Results →]                │
└─────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

### Test Scenario 1: Consultant Sends Internal Assessment
1. [ ] Login as consultant
2. [ ] Go to "My Templates" tab
3. [ ] Click "Send to Team" (internal)
4. [ ] Select internal teams
5. [ ] Send invitations
6. [ ] Go to "Sent by Me" tab → "Internal" sub-tab
7. [ ] Verify invitation appears without company badge
8. [ ] No company badge shown (internal invitation)

### Test Scenario 2: Consultant Sends External Assessment
1. [ ] Login as consultant
2. [ ] Go to "My Templates" tab
3. [ ] Click "Send to Company" (external)
4. [ ] Create new company
5. [ ] Send invitation to executive
6. [ ] Go to "Sent by Me" tab → "External" sub-tab
7. [ ] Verify invitation appears with company name badge
8. [ ] Company badge shows "📊 [Company Name]"

### Test Scenario 3: Consultant Views Internal Results
1. [ ] Login as consultant
2. [ ] Go to "Results" tab → "Internal Results"
3. [ ] Click "View Results →"
4. [ ] Verify redirects to team-ssi-view.html
5. [ ] Verify shows consultant's own company data

### Test Scenario 4: Consultant Views External Results
1. [ ] Login as consultant with managed companies
2. [ ] Go to "Results" tab → "Client Companies"
3. [ ] Verify list of client companies displayed
4. [ ] Verify count badge shows correct number
5. [ ] Click "View Results →" on a company
6. [ ] Verify redirects to team-ssi-view.html?company_id=XXX
7. [ ] Verify shows client company's team/SSI data
8. [ ] Verify consultant sees same view as company exec would see

### Test Scenario 5: Non-Consultant User (Executive/Manager)
1. [ ] Login as executive or manager
2. [ ] Go to "Sent by Me" tab
3. [ ] Verify NO sub-tabs shown (internal/external)
4. [ ] Verify all invitations displayed normally
5. [ ] Go to "Results" tab
6. [ ] Verify NO sub-tabs shown
7. [ ] Verify single "View Results →" button
8. [ ] Verify redirects to team-ssi-view.html (own company)

### Test Scenario 6: Sub-tab Switching
1. [ ] Login as consultant
2. [ ] Go to "Sent by Me" tab
3. [ ] Click "Internal" sub-tab
4. [ ] Verify only internal invitations shown
5. [ ] Verify count badge correct
6. [ ] Click "External" sub-tab
7. [ ] Verify only external invitations shown
8. [ ] Verify count badge correct
9. [ ] Verify empty state if no external invitations

---

## 📝 Acceptance Criteria

- [ ] "Sent by Me" tab shows internal/external sub-tabs for consultants only
- [ ] Internal/external invitations filtered correctly by company_id
- [ ] External invitations display company name badge
- [ ] Invitation counts update correctly (Internal (X), External (Y))
- [ ] "Team Results" renamed to "Results"
- [ ] "Results" tab shows internal/external sub-tabs for consultants only
- [ ] Internal results link to consultant's own company team-ssi-view
- [ ] External results show grid of managed companies
- [ ] Company cards show name, industry, size, creation date
- [ ] "View Results →" links to team-ssi-view.html?company_id=XXX
- [ ] Consultant sees same SSI/team view as company exec would see
- [ ] Non-consultant users (EXECUTIVE, MANAGER) see no sub-tabs
- [ ] All existing functionality preserved
- [ ] Multi-tenant isolation maintained
- [ ] No backend API changes required

---

## 🚀 Deployment Notes

### Files Changed:
- `client/pages/assessment-hub.html` - ALL changes in this ONE file

### Backend Changes:
- NONE ✅ (All APIs already exist)

### Database Changes:
- NONE ✅

### Breaking Changes:
- NONE ✅

### Rollback Plan:
- Simple: Revert assessment-hub.html to previous version

---

## 📊 Story Points Breakdown (Revised)

### Backend Changes (NEW - 3 Points)
| Task | Points | Time |
|------|--------|------|
| Fix /api/invitations/sent-by-me response (add company_id/name) | 1.5 | 30 min |
| Verify JWT includes managed_businesses | 0.5 | 15 min |
| Update team-ssi-view.js for query param support | 1 | 30 min |
| **Backend Subtotal** | **3** | **1 hour 15 min** |

### Frontend Changes (12 Points)
| Task | Points | Time |
|------|--------|------|
| Update tab label "Team Results" → "Results" | 0.5 | 5 min |
| Add sub-tab HTML for "Sent by Me" | 1 | 15 min |
| Add JavaScript for sub-tab switching | 1 | 15 min |
| Update loadSentInvitations() with filtering + null safety | 2 | 45 min |
| Update renderSentInvitations() with company badge + null safety | 2.5 | 60 min |
| Add sub-tab HTML for "Results" | 1 | 15 min |
| Add loadExternalResults() function | 2 | 30 min |
| Add renderExternalCompanies() function | 1 | 15 min |
| Update loadTabData() for results handling | 0.5 | 10 min |
| Initialize consultant context with edge case handling | 0.5 | 10 min |
| **Frontend Subtotal** | **12** | **3 hours 20 min** |

### Testing & Validation (Enhanced)
| Task | Points | Time |
|------|--------|------|
| Backend API testing (company_id in response) | 0.5 | 10 min |
| team-ssi-view.js query param testing | 0.5 | 10 min |
| Frontend consultant workflow testing | 1.5 | 30 min |
| Edge case testing (null company_id, no managed companies) | 1 | 20 min |
| **Testing Subtotal** | **3.5** | **1 hour 10 min** |

### **GRAND TOTAL**
| Category | Points | Time |
|----------|--------|------|
| Backend | 3 | 1h 15m |
| Frontend | 12 | 3h 20m |
| Testing | 3.5 | 1h 10m |
| **TOTAL** | **18.5 ≈ 15** | **5h 45m ≈ 3-4 hours** |

**Note**: Rounded to 15 points (buffer for unknowns). Original estimate of 13 points was too optimistic.

---

## 🎯 Success Metrics

**Consultant User Experience**:
- Clear separation between internal firm work and client work
- Easy navigation between internal and external assessments
- Visibility into all managed companies
- Same result views as client executives see

**System Maintains**:
- All existing functionality for non-consultant users
- Performance (no slow queries)
- Multi-tenant isolation via `managed_businesses` check
- Data integrity

---

## 📚 Related Files

**Frontend**:
- `client/pages/assessment-hub.html` - Only file requiring changes
- `client/pages/team-ssi-view.html` - No changes needed (already supports consultant access)

**Backend** (No changes needed):
- `server/routes/assessments.js:655` - team-breakdown endpoint already supports consultants
- `server/routes/companies.js:28` - GET /api/companies already returns managed companies
- `server/routes/invitations.js:912` - create-company-invitation already exists
- `server/models/User.js:79-84` - managed_businesses field already exists

---

## 🔜 Future Enhancements (Post-Epic 4)

**Not in this epic** (separate future work):
- Company switching dropdown in navigation
- Bulk company management dashboard
- Client company usage analytics
- Cross-company comparison reports
- Company invitation templates

---

**Epic Status**: ⏸️ DEFERRED TO SPRINT 5
**Prerequisites**:
- Complete Sprint 4 first
- Review and approve backend API changes
- Allocate 15 points in Sprint 5 (not 13)
**Complexity**: Medium (backend + frontend changes, null safety, edge cases)
**Risk**: Medium (backend API changes, multiple files, comprehensive testing needed)

---

## 🎯 Sprint 5 Planning Recommendations

### Pre-Implementation Checklist:
- [ ] Review spec review document ([EPIC-4-SPEC-REVIEW.md](./EPIC-4-SPEC-REVIEW.md))
- [ ] Approve backend API changes to `/api/invitations/sent-by-me`
- [ ] Verify JWT payload includes `managed_businesses`
- [ ] Allocate 15 story points (not 13) in Sprint 5 plan
- [ ] Plan for 3-4 hour implementation time
- [ ] Schedule comprehensive testing (1+ hour)

### Implementation Order (Critical):
1. **PHASE 1**: Backend changes (Steps 0A, 0B, 0C) - 1.25 hours
2. **Test Phase 1**: Verify API returns company_id and team-ssi-view.js works with query params
3. **PHASE 2**: Frontend changes (Steps 1-9) - 3.5 hours
4. **Test Phase 2**: End-to-end consultant workflow testing

### Success Criteria for Sprint 5:
- [ ] Backend: `/api/invitations/sent-by-me` includes company_id and company_name
- [ ] Backend: JWT includes managed_businesses array
- [ ] Frontend: team-ssi-view.js supports `?company_id=XXX` query parameter
- [ ] Frontend: Internal/external tabs work for consultants
- [ ] Frontend: Company badges show on external invitations
- [ ] Frontend: External companies grid shows and links work
- [ ] Edge Cases: Consultant without company_id handled gracefully
- [ ] Edge Cases: No internal team handled gracefully
- [ ] Edge Cases: No external companies handled gracefully
- [ ] Testing: All 6 test scenarios pass
- [ ] Testing: Non-consultant users unaffected

### Risk Mitigation:
- **Backend changes isolated**: Only 2 files, both well-tested areas
- **Rollback plan**: Simple revert of 3 files (invitations.js, authGuards.js, team-ssi-view.js, assessment-hub.html)
- **Progressive implementation**: Can deploy backend first, then frontend
- **Feature flag option**: Could add feature flag if needed for gradual rollout

---

**Created**: November 25, 2025
**Last Updated**: November 25, 2025 (Revised after spec review)
**Deferred**: November 25, 2025 (Sprint 4 → Sprint 5)
**Next Review**: Sprint 5 Planning

