# Epic 4 Specification Review - Issues & Fixes

**Review Date**: November 25, 2025
**Reviewer**: Claude Code
**Status**: ⚠️ CRITICAL ISSUES FOUND - Requires Backend Changes

---

## 🔴 CRITICAL ISSUES

### Issue 1: Missing company_id in API Response

**Problem**:
The `/api/invitations/sent-by-me` endpoint does NOT include `company_id` or `company_name` in the batch response.

**Evidence** (`server/routes/invitations.js:771-790`):
```javascript
batchMap.set(batchKey, {
  batch_id: inv.assessment_batch_id || null,
  template: { /* template data */ },
  created_at: inv.created_at,
  expires_at: inv.expires_at,
  invitations: [],
  stats: { /* stats */ }
  // ❌ NO company_id or company_name
});
```

**Impact**:
- Frontend cannot filter invitations by internal vs external
- Cannot display company name badge on external invitations
- **The core feature cannot work without this data**

**Fix Required**:
```javascript
// In server/routes/invitations.js:771-790
batchMap.set(batchKey, {
  batch_id: inv.assessment_batch_id || null,
  company_id: inv.company_id,  // ✅ ADD THIS
  template: { /* template data */ },
  created_at: inv.created_at,
  expires_at: inv.expires_at,
  invitations: [],
  stats: { /* stats */ }
});

// ALSO ADD: Populate company name (after line 755)
const invitations = await Invitation.find({
  sent_by: user.id
})
  .populate('assessment_template_id', 'name description total_questions estimated_duration')
  .populate('company_id', 'company_name')  // ✅ ADD THIS
  .populate('recipient_user_id', 'first_name last_name email')
  .sort({ created_at: -1 })
  .lean();

// Then in batch object:
company_name: inv.company_id?.company_name || null  // ✅ ADD THIS
```

**Severity**: 🔴 CRITICAL - Feature cannot work without this fix
**Backend Change Required**: ✅ Yes

---

### Issue 2: team-ssi-view.js Ignores Query Parameters

**Problem**:
The `team-ssi-view.js` script always uses the logged-in user's `company_id` and **ignores URL query parameters**.

**Evidence** (`client/pages/scripts/team-ssi-view.js:27`):
```javascript
async init() {
  this.user = JSON.parse(userStr);
  this.companyId = this.user.company_id;  // ❌ Always uses user's company
  // No check for ?company_id=XXX query parameter
}
```

**Impact**:
- Consultants cannot view external company results
- Passing `?company_id=XXX` in URL does nothing
- External company links won't work

**Fix Required**:
```javascript
// In client/pages/scripts/team-ssi-view.js:18-43
async init() {
  // Get user from localStorage
  const userStr = localStorage.getItem('karvia_user');
  if (!userStr) {
    window.location.href = '/pages/login.html';
    return;
  }

  this.user = JSON.parse(userStr);

  // ✅ FIX: Check for company_id query parameter (for consultant access)
  const urlParams = new URLSearchParams(window.location.search);
  const queryCompanyId = urlParams.get('company_id');

  if (queryCompanyId) {
    // Consultant viewing external company
    if (this.user.role === 'CONSULTANT') {
      // TODO: Validate consultant has access (check managed_businesses)
      // For now, backend will validate via API call
      this.companyId = queryCompanyId;
    } else {
      // Non-consultants can only view their own company
      this.companyId = this.user.company_id;
    }
  } else {
    // Default to user's own company
    this.companyId = this.user.company_id;
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

**Severity**: 🔴 CRITICAL - Feature cannot work without this fix
**Frontend Change Required**: ✅ Yes (client/pages/scripts/team-ssi-view.js)

---

### Issue 3: Consultant Without company_id (Null Reference)

**Problem**:
Consultants might not have their own `company_id` if they only manage external companies. This causes null reference errors.

**Evidence**:
- Invitation filtering: `inv.company_id === currentUser.company_id` fails if `currentUser.company_id` is null
- User model allows consultants to have `company_id: null` (User.js:14-19)

**Impact**:
- JavaScript errors when filtering invitations
- "Internal" tab shows nothing or breaks
- Cannot determine if invitation is internal vs external

**Fix Required**:
```javascript
// In assessment-hub.html filtering logic:

// ❌ WRONG:
if (currentSentSubtab === 'internal') {
  filteredData = sentData.filter(inv =>
    inv.company_id?.toString() === currentUser.company_id?.toString()
  );
}

// ✅ CORRECT:
if (currentSentSubtab === 'internal') {
  // If consultant has no company_id, they have no internal invitations
  if (!currentUser.company_id) {
    filteredData = [];
  } else {
    filteredData = sentData.filter(inv =>
      inv.company_id?.toString() === currentUser.company_id?.toString()
    );
  }
}
```

**Also need to handle UI**:
```javascript
// Show/hide internal tab based on whether consultant has a company
if (currentUser.role === 'CONSULTANT') {
  if (!currentUser.company_id) {
    // Consultant has no firm - hide internal tab, default to external
    document.getElementById('sent-internal-btn').classList.add('hidden');
    currentSentSubtab = 'external';
  } else {
    // Consultant has firm - show both tabs
    document.getElementById('sent-subtabs').classList.remove('hidden');
  }
}
```

**Severity**: 🟡 HIGH - Could cause crashes in production
**Frontend Change Required**: ✅ Yes (assessment-hub.html)

---

## 🟡 HIGH PRIORITY ISSUES

### Issue 4: No Frontend Validation of Consultant Access

**Problem**:
While the backend validates `managed_businesses`, the frontend doesn't check before making API calls.

**Evidence**:
Consultant could manually type `?company_id=random_id` in URL and frontend would attempt to load it.

**Impact**:
- Unnecessary API calls
- Confusing error messages
- Poor UX

**Fix Required**:
```javascript
// In team-ssi-view.js init():
if (queryCompanyId) {
  if (this.user.role === 'CONSULTANT') {
    // ✅ Validate consultant has access
    const hasAccess = this.user.managed_businesses?.some(
      bid => bid.toString() === queryCompanyId
    );

    if (!hasAccess) {
      this.showError('You do not have access to this company');
      return;
    }

    this.companyId = queryCompanyId;
  } else {
    // Non-consultants can only view their own company
    this.companyId = this.user.company_id;
  }
}
```

**Severity**: 🟡 HIGH - Security/UX issue
**Frontend Change Required**: ✅ Yes (client/pages/scripts/team-ssi-view.js)

---

### Issue 5: managed_businesses Not Available in Frontend

**Problem**:
The `managed_businesses` array might not be included in the JWT token payload or localStorage user object.

**Evidence**:
Need to verify that JWT includes `managed_businesses` in payload.

**Fix Required**:
```javascript
// In server/middleware/authGuards.js (check around line 257)
// Ensure JWT payload includes managed_businesses:
const payload = {
  id: user._id,
  email: user.email,
  role: user.role,
  company_id: user.company_id,
  managed_businesses: user.managed_businesses || []  // ✅ Ensure this exists
};
```

**Severity**: 🟡 HIGH - Frontend validation won't work without this
**Backend Check Required**: ✅ Verify JWT payload

---

## 🟠 MEDIUM PRIORITY ISSUES

### Issue 6: Race Condition with loadManagedCompanies()

**Problem**:
`loadManagedCompanies()` is called asynchronously but not awaited. This could cause timing issues.

**Current Code**:
```javascript
// In assessment-hub.html DOMContentLoaded:
if (currentUser.role === 'CONSULTANT') {
  loadManagedCompanies();  // ❌ Not awaited
}
```

**Fix Required**:
```javascript
if (currentUser.role === 'CONSULTANT') {
  await loadManagedCompanies();  // ✅ Await to ensure data loaded
}
```

**Severity**: 🟠 MEDIUM - Could cause empty external results on slow networks
**Frontend Change Required**: ✅ Yes (assessment-hub.html)

---

### Issue 7: Empty State Edge Cases

**Problem**:
Specification doesn't handle all edge cases:
1. Consultant with no `company_id` (no internal team)
2. Consultant with company but no team members
3. Consultant with no external companies yet

**Fix Required**:
Add intelligent empty state handling and hide irrelevant tabs.

**Severity**: 🟠 MEDIUM - UX issue
**Frontend Change Required**: ✅ Yes (assessment-hub.html)

---

### Issue 8: Default Sub-tab Selection Logic

**Problem**:
Spec defaults to "internal" tab, but consultant might only have external companies.

**Current Logic**:
```javascript
switchSentSubtab('internal');  // ❌ Might be empty
```

**Better Logic**:
```javascript
// Intelligent default based on data
if (internalCount === 0 && externalCount > 0) {
  switchSentSubtab('external');  // ✅ Default to where data exists
} else {
  switchSentSubtab('internal');
}
```

**Severity**: 🟠 MEDIUM - UX issue
**Frontend Change Required**: ✅ Yes (assessment-hub.html)

---

## 🟢 MINOR ISSUES

### Issue 9: Inconsistent Error Handling

**Problem**:
Specification doesn't define error states for:
- Failed to load managed companies
- Failed to load external results
- API errors when switching tabs

**Fix Required**:
Add try-catch blocks and error state UI.

**Severity**: 🟢 LOW - UX polish
**Frontend Change Required**: ✅ Yes (assessment-hub.html)

---

### Issue 10: No Loading States for Sub-tab Switching

**Problem**:
When switching between internal/external, no loading indicator shown.

**Fix Required**:
Add loading state during filtering/rendering.

**Severity**: 🟢 LOW - UX polish
**Frontend Change Required**: ✅ Yes (assessment-hub.html)

---

## 📊 Summary

| Severity | Count | Backend Changes | Frontend Changes |
|----------|-------|-----------------|------------------|
| 🔴 CRITICAL | 3 | 1 | 2 |
| 🟡 HIGH | 2 | 1 | 1 |
| 🟠 MEDIUM | 4 | 0 | 4 |
| 🟢 LOW | 2 | 0 | 2 |
| **TOTAL** | **11** | **2** | **9** |

---

## ✅ REVISED IMPLEMENTATION REQUIREMENTS

### Backend Changes Required (NOT in original spec):

1. **Modify `/api/invitations/sent-by-me`** (server/routes/invitations.js:771-790)
   - Add `company_id` to batch response
   - Populate `company_name` via `.populate('company_id', 'company_name')`
   - Include `company_name` in batch object

2. **Verify JWT Payload** (server/middleware/authGuards.js)
   - Ensure `managed_businesses` array included in JWT
   - Verify it's stored in localStorage user object

### Frontend Changes Required:

1. **team-ssi-view.js** - Support query parameter
   - Parse `?company_id=XXX` from URL
   - Validate consultant access to company_id
   - Use query company_id for external viewing

2. **assessment-hub.html** - All Epic 4 changes
   - Add null checks for consultant without company_id
   - Handle edge cases (no internal team, no external companies)
   - Implement intelligent default sub-tab
   - Add error handling and loading states

---

## 🎯 Recommendation

**Original Estimate**: 13 points, 2.5-3 hours, 0 backend changes
**Revised Estimate**: **15 points, 3-4 hours, 2 backend changes required**

**Critical Path**:
1. ✅ Fix backend `/api/invitations/sent-by-me` to include company_id/name
2. ✅ Fix team-ssi-view.js to support query parameters
3. ✅ Add null safety checks for consultants without company_id
4. ✅ Implement frontend filtering and display
5. ✅ Add validation and error handling

**Risk Assessment**:
- Original spec: ❌ **Would not work in production** (missing critical data)
- Revised spec: ✅ **Can work reliably** (with backend fixes)

---

## 🔜 Next Steps

**Option 1**: Implement with fixes (recommended)
- Fix 2 backend endpoints
- Implement 9 frontend changes
- Comprehensive testing

**Option 2**: Simplify scope
- Remove internal/external separation
- Just add company selector dropdown
- Reduces complexity but loses business value

**Option 3**: Defer to future sprint
- Complete backend infrastructure first
- Build frontend in later sprint
- More predictable but delays feature

---

**Decision Required**: Which approach should we take?

