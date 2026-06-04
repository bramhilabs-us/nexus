# Sprint 5 Epic 2: OKR Generation Alignment & Consolidation Plan

**Date:** 2025-11-25
**Objective:** Unify all OKR generation entry points, enforce 5 active objectives limit, and remove redundant buttons

---

## 🎯 GOALS

1. **Consolidate OKR Generation** - Reduce from 5+ entry points to 3 canonical sources
2. **Enforce 5 Active Objectives Limit** - Apply across ALL creation methods (manual + AI)
3. **Maximum Code Reuse** - Share modal and generation logic
4. **Consistent UX** - Same flow regardless of entry point

---

## 🔍 CURRENT STATE AUDIT

### **Entry Point 1: objectives.html** (PRIMARY - KEEP) ✅

**Location:** `client/pages/objectives.html`

**Buttons:**
1. **"Create Objective (M)"** - Line 63
   - Type: Manual creation
   - Opens: `createObjectiveModal` (5-field form)
   - API: `POST /api/objectives`
   - Current Limit Check: ❌ NONE

2. **"Generate OKR (AI)"** - Line 72
   - Type: AI-powered generation
   - Opens: `generateOKRModal` (configuration modal)
   - API: `POST /api/ai-okr/generate-from-company`
   - Current Limit Check: ❌ NONE (backend checks `okr_generation.generated` flag only)

**Verdict:** ✅ **KEEP BOTH** - Primary user entry point

---

### **Entry Point 2: team-ssi-view.html** (SECONDARY - KEEP) ✅

**Location:** `client/pages/scripts/team-ssi-view.js`

**Button:** "Generate OKRs" - Line 649-720
- Type: AI-powered from SSI assessment
- Opens: Dynamic configuration modal
- API: `POST /api/ai-okr/generate-from-company`
- Current Limit Check: ✅ Checks `okr_generation.generated` flag (prevents duplicate)

**Special Behavior:**
- Shows "Already Generated" state if `okr_generation.generated === true`
- Includes SSI assessment data in API call

**Verdict:** ✅ **KEEP** - Essential for assessment-driven OKR flow

---

### **Entry Point 3: assessment-results.html** (REDUNDANT - REMOVE) ❌

**Location:** `client/pages/assessment-results.html` - Line 425-469

**Button:** "Generate AI OKRs"
- Type: AI-powered from assessment
- API: `window.AIOkrAPI.generateFromAssessment(assessmentId)`
- Redirects to: `ai-okr-review.html`

**Problem:**
- ❌ Duplicates team-ssi-view.js functionality
- ❌ Uses different API endpoint (`/generate-from-assessment` instead of `/generate-from-company`)
- ❌ No limit check
- ❌ Inconsistent UX (redirects to review page instead of objectives page)

**Verdict:** ❌ **REMOVE** - Replace with redirect to team-ssi-view

---

### **Entry Point 4: okr-creation-wizard.html** (LEGACY - DEPRECATE) ❌

**Location:** `client/pages/okr-creation-wizard.html`

**Type:** Multi-step wizard for OKR creation

**Problem:**
- ❌ Completely different UX flow
- ❌ No limit check
- ❌ Not integrated with Sprint 5 Epic 1 configuration
- ❌ Appears to be legacy Sprint 2/3 code

**Verdict:** ❌ **DEPRECATE** - Remove from navigation, redirect to objectives page

---

### **Entry Point 5: ai-okr-review.html** (REVIEW ONLY - KEEP) ⚠️

**Location:** `client/pages/ai-okr-review.html`

**Type:** Review page for generated OKRs

**Verdict:** ⚠️ **KEEP AS REVIEW** - Not a generation entry point, just review/approval

---

## 📊 CONSOLIDATION SUMMARY

| Entry Point | Type | Status | Action |
|-------------|------|--------|--------|
| **objectives.html** - Manual | Manual | ✅ Keep | Add 5-limit validation |
| **objectives.html** - AI | AI | ✅ Keep | Add 5-limit validation |
| **team-ssi-view.js** | AI (SSI) | ✅ Keep | Add 5-limit validation |
| **assessment-results.html** | AI | ❌ Remove | Redirect to team-ssi-view |
| **okr-creation-wizard.html** | Wizard | ❌ Deprecate | Remove from nav |
| **ai-okr-review.html** | Review | ⚠️ Keep | Not a generation point |

**Result:** **5 → 3** canonical entry points ✅

---

## 🛡️ 5 ACTIVE OBJECTIVES LIMIT ENFORCEMENT

### **Limit Definition**

```javascript
const MAX_ACTIVE_OBJECTIVES = 5;

// Count only objectives with status='active'
// Exclude: 'draft', 'completed', 'paused', 'cancelled'
```

**Business Rules:**
1. ✅ Limit applies to `status='active'` only
2. ✅ Completed/cancelled objectives don't count
3. ✅ Check before EVERY creation (manual, AI, assessment)
4. ✅ Show helpful error message with current count
5. ✅ Suggest completing or archiving existing objectives

---

### **Implementation Strategy**

#### **Backend: Validation Middleware**

**Create:** `server/middleware/validateObjectiveLimit.js`

```javascript
const Objective = require('../models/Objective');

/**
 * Middleware to validate active objectives limit
 * Applies to: Manual creation, AI generation
 */
async function validateActiveObjectivesLimit(req, res, next) {
    try {
        const companyId = req.user.company_id;
        const MAX_ACTIVE_OBJECTIVES = 5;

        // Count active objectives for this company
        const activeCount = await Objective.countDocuments({
            company_id: companyId,
            status: 'active'
        });

        console.log(`[Objective Limit] Company ${companyId} has ${activeCount}/${MAX_ACTIVE_OBJECTIVES} active objectives`);

        // Check if limit would be exceeded
        const requestedCount = req.body.objectives?.length || 1; // AI generates multiple, manual creates 1

        if (activeCount + requestedCount > MAX_ACTIVE_OBJECTIVES) {
            return res.status(400).json({
                success: false,
                error: `Maximum ${MAX_ACTIVE_OBJECTIVES} active objectives allowed`,
                message: `You currently have ${activeCount} active objective${activeCount !== 1 ? 's' : ''}. Complete or archive existing objectives before creating new ones.`,
                current_count: activeCount,
                max_allowed: MAX_ACTIVE_OBJECTIVES,
                requested_count: requestedCount,
                limit_exceeded: true
            });
        }

        // Store count in request for logging
        req.activeObjectivesCount = activeCount;
        next();

    } catch (error) {
        console.error('[Objective Limit] Validation error:', error);
        // Don't block request on validation error
        next();
    }
}

module.exports = { validateActiveObjectivesLimit };
```

---

#### **Backend: Apply Middleware to Routes**

**File:** `server/routes/objectives.js`

```javascript
const { validateActiveObjectivesLimit } = require('../middleware/validateObjectiveLimit');

// Manual creation - add middleware
router.post('/',
    authenticateToken,
    validateActiveObjectivesLimit, // NEW
    async (req, res) => {
        // ... existing creation logic
    }
);
```

**File:** `server/routes/ai-okr.js`

```javascript
const { validateActiveObjectivesLimit } = require('../middleware/validateObjectiveLimit');

// AI generation - add middleware
router.post('/generate-from-company',
    authenticateToken,
    validateActiveObjectivesLimit, // NEW
    async (req, res) => {
        // ... existing generation logic
    }
);
```

---

#### **Frontend: Pre-Flight Validation**

**Create:** `client/js/objective-limit-check.js`

```javascript
/**
 * Check if company has reached active objectives limit
 * @param {string} token - Auth token
 * @returns {Promise<{allowed: boolean, current: number, max: number, message: string}>}
 */
async function checkObjectiveLimit(token) {
    try {
        const response = await fetch('/api/objectives/check-limit', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        return {
            allowed: data.allowed,
            current: data.current_count,
            max: data.max_allowed,
            message: data.message
        };

    } catch (error) {
        console.error('[Objective Limit] Check failed:', error);
        // Allow on error (backend will validate)
        return { allowed: true, current: 0, max: 5, message: '' };
    }
}

/**
 * Show limit exceeded modal
 * @param {number} current - Current active count
 * @param {number} max - Maximum allowed
 */
function showLimitExceededModal(current, max) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div class="text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Objective Limit Reached</h3>
                <p class="text-gray-600 mb-4">
                    You currently have <strong>${current} active objectives</strong>.
                    The maximum allowed is <strong>${max} objectives</strong>.
                </p>
                <p class="text-sm text-gray-500 mb-6">
                    💡 <strong>Tip:</strong> Complete or archive existing objectives before creating new ones.
                    Focus is key to effective OKRs!
                </p>
                <button
                    onclick="this.closest('.fixed').remove()"
                    class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    Got it
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.checkObjectiveLimit = checkObjectiveLimit;
    window.showLimitExceededModal = showLimitExceededModal;
}
```

---

#### **Frontend: Integration Points**

**1. objectives.html - Manual Creation**

```javascript
async function openCreateObjectiveModal() {
    // Check limit BEFORE opening modal
    const token = localStorage.getItem('karvia_auth_token');
    const limitCheck = await window.checkObjectiveLimit(token);

    if (!limitCheck.allowed) {
        window.showLimitExceededModal(limitCheck.current, limitCheck.max);
        return; // Don't open modal
    }

    // Proceed with opening modal
    document.getElementById('createObjectiveModal').classList.remove('hidden');
    // ... rest of existing code
}
```

**2. objectives.html - AI Generation**

```javascript
async function openGenerateOKRModal() {
    // Check limit BEFORE opening config modal
    const token = localStorage.getItem('karvia_auth_token');
    const limitCheck = await window.checkObjectiveLimit(token);

    if (!limitCheck.allowed) {
        window.showLimitExceededModal(limitCheck.current, limitCheck.max);
        return; // Don't open modal
    }

    // Show shared configuration modal
    const config = await window.OKRGenerationModal.show();
    // ... rest of existing code
}
```

**3. team-ssi-view.js - AI Generation**

```javascript
async showGenerateOKRButton() {
    // Check limit BEFORE showing button
    const token = localStorage.getItem('karvia_auth_token');
    const limitCheck = await window.checkObjectiveLimit(token);

    if (!limitCheck.allowed) {
        // Show limit exceeded state instead of generate button
        this.container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 class="font-semibold text-red-800 mb-2">⚠️ Objective Limit Reached</h4>
                <p class="text-sm text-red-700">
                    You have ${limitCheck.current} active objectives.
                    Complete or archive existing objectives before generating new ones.
                </p>
            </div>
        `;
        return;
    }

    // ... existing generate button logic
}
```

---

### **Backend: Limit Check Endpoint**

**File:** `server/routes/objectives.js`

```javascript
// GET /api/objectives/check-limit
// Check if company can create more objectives
router.get('/check-limit', authenticateToken, async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const MAX_ACTIVE_OBJECTIVES = 5;

        const Objective = require('../models/Objective');
        const activeCount = await Objective.countDocuments({
            company_id: companyId,
            status: 'active'
        });

        const allowed = activeCount < MAX_ACTIVE_OBJECTIVES;

        res.json({
            success: true,
            allowed,
            current_count: activeCount,
            max_allowed: MAX_ACTIVE_OBJECTIVES,
            remaining: Math.max(0, MAX_ACTIVE_OBJECTIVES - activeCount),
            message: allowed
                ? `You can create ${MAX_ACTIVE_OBJECTIVES - activeCount} more objective${MAX_ACTIVE_OBJECTIVES - activeCount !== 1 ? 's' : ''}`
                : `Maximum ${MAX_ACTIVE_OBJECTIVES} active objectives reached. Complete or archive existing objectives first.`
        });

    } catch (error) {
        console.error('[Objective Limit] Check error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check objective limit'
        });
    }
});
```

---

## 🗑️ REMOVAL PLAN

### **Remove: assessment-results.html "Generate AI OKRs" Button**

**File:** `client/pages/assessment-results.html`

**Current (Lines 425-469):**
```javascript
async function handleGenerateOKRs() {
    // ... old generation logic
    const response = await window.AIOkrAPI.generateFromAssessment(assessmentId);
    window.location.href = `/pages/ai-okr-review.html?assessmentId=${assessmentId}`;
}
```

**Replace with redirect to team-ssi-view:**
```javascript
function handleGenerateOKRs() {
    // Redirect to team SSI view for OKR generation
    const companyId = JSON.parse(localStorage.getItem('karvia_user')).company_id;
    window.location.href = `/pages/team-ssi-view.html?company_id=${companyId}`;
}
```

**Update button:**
```html
<!-- OLD: -->
<button id="generate-okr-btn" onclick="handleGenerateOKRs()">
    Generate AI OKRs
</button>

<!-- NEW: -->
<button id="view-okr-generation-btn" onclick="handleGenerateOKRs()">
    View OKR Generation
</button>
```

---

### **Deprecate: okr-creation-wizard.html**

**Navigation:** Remove from all navigation menus

**File:** `client/js/navigation.js`

```javascript
// Remove wizard link from navigation
const navLinks = {
    // ... other links
    // DELETE: { path: '/pages/okr-creation-wizard.html', label: 'OKR Wizard' }
};
```

**Redirect:** Add redirect in wizard HTML

```html
<!-- Add at top of okr-creation-wizard.html -->
<script>
    // Redirect to objectives page (wizard deprecated in Sprint 5)
    window.location.href = '/pages/objectives.html';
</script>
```

---

## 🔄 SHARED MODULE IMPLEMENTATION

### **Create:** `client/js/okr-generation-modal.js`

**Purpose:** Shared configuration modal for all AI generation flows

**Contents:**
- `OKRGenerationModal.show()` - Display config modal
- `generateOKRsWithConfig()` - Call API with validation
- Helper functions: `getDefaultStartDate()`, `formatDate()`

**Usage:**
```javascript
// Import in all pages
<script src="/js/okr-generation-modal.js"></script>

// Use in any page
const config = await window.OKRGenerationModal.show();
if (!config) return; // User cancelled

await window.generateOKRsWithConfig({
    company_id: user.company_id,
    start_date: config.start_date,
    period: config.period,
    onSuccess: (result) => { /* handle */ },
    onError: (error) => { /* handle */ }
});
```

**See:** [EPIC-2-CODE-REUSE-AUDIT.md](./EPIC-2-CODE-REUSE-AUDIT.md) for full implementation

---

## 📋 IMPLEMENTATION CHECKLIST

### **Phase 1: Backend Limit Enforcement (3 hours)**

- [ ] Create `server/middleware/validateObjectiveLimit.js`
- [ ] Add middleware to `POST /api/objectives`
- [ ] Add middleware to `POST /api/ai-okr/generate-from-company`
- [ ] Add `GET /api/objectives/check-limit` endpoint
- [ ] Test backend validation (unit tests)

---

### **Phase 2: Frontend Limit Check (2 hours)**

- [ ] Create `client/js/objective-limit-check.js`
- [ ] Implement `checkObjectiveLimit()` function
- [ ] Implement `showLimitExceededModal()` UI
- [ ] Test modal display

---

### **Phase 3: Integrate Limit Checks (2 hours)**

- [ ] Update `objectives.html` - Manual creation
- [ ] Update `objectives.html` - AI generation
- [ ] Update `team-ssi-view.js` - Generation button
- [ ] Test all 3 entry points

---

### **Phase 4: Remove Redundant Entry Points (1.5 hours)**

- [ ] Update `assessment-results.html` - Replace with redirect
- [ ] Add redirect to `okr-creation-wizard.html`
- [ ] Remove wizard from navigation
- [ ] Test redirects work correctly

---

### **Phase 5: Shared Module (5.5 hours)**

- [ ] Create `client/js/okr-generation-modal.js`
- [ ] Refactor `team-ssi-view.js` to use shared module
- [ ] Refactor `objectives.html` to use shared module
- [ ] Remove duplicate code
- [ ] Test all generation flows

---

### **Phase 6: Testing & Validation (2 hours)**

- [ ] Test: Manual creation with limit check
- [ ] Test: AI generation with limit check
- [ ] Test: Team SSI view generation
- [ ] Test: Limit exceeded modal appears correctly
- [ ] Test: Backend returns 400 when limit exceeded
- [ ] Test: Redirects from deprecated pages work
- [ ] Test: Error messages are helpful
- [ ] Test: Count excludes completed/cancelled objectives

---

## 📊 EFFORT ESTIMATE

| Phase | Hours | Priority |
|-------|-------|----------|
| **Phase 1:** Backend limit enforcement | 3h | 🔥 HIGH |
| **Phase 2:** Frontend limit check | 2h | 🔥 HIGH |
| **Phase 3:** Integrate limit checks | 2h | 🔥 HIGH |
| **Phase 4:** Remove redundant entry points | 1.5h | 🟡 MEDIUM |
| **Phase 5:** Shared module (code reuse) | 5.5h | 🟢 LOW |
| **Phase 6:** Testing & validation | 2h | 🔥 HIGH |
| **TOTAL** | **16 hours** | **2 days** |

**Can be split:**
- **MVP (Phases 1-4):** 8.5 hours - Enforce limit, remove redundancy
- **Optimization (Phases 5-6):** 7.5 hours - Code reuse, comprehensive testing

---

## ✅ SUCCESS CRITERIA

1. ✅ **Only 3 canonical entry points** for OKR generation
2. ✅ **5 active objectives limit enforced** across ALL entry points (frontend + backend)
3. ✅ **Helpful error messages** when limit exceeded
4. ✅ **No redundant buttons** in deprecated pages
5. ✅ **Consistent UX** - Same modal and flow everywhere
6. ✅ **Zero code duplication** - Shared modal module used by all pages
7. ✅ **Backend validation** - Limit enforced even if frontend bypassed
8. ✅ **Graceful degradation** - Works even if frontend check fails

---

## 🎯 ALIGNMENT MATRIX

| Entry Point | Limit Check (Frontend) | Limit Check (Backend) | Shared Modal | Aligned |
|-------------|------------------------|----------------------|--------------|---------|
| **objectives.html** (Manual) | ✅ Pre-flight | ✅ Middleware | ✅ Reused | ✅ |
| **objectives.html** (AI) | ✅ Pre-flight | ✅ Middleware | ✅ Reused | ✅ |
| **team-ssi-view.js** (AI) | ✅ Pre-flight | ✅ Middleware | ✅ Reused | ✅ |
| **assessment-results.html** | ❌ Removed | N/A | N/A | ✅ Redirected |
| **okr-creation-wizard.html** | ❌ Deprecated | N/A | N/A | ✅ Redirected |

**Result:** **100% Alignment** ✅

---

## 🚀 NEXT STEPS

1. **User approval** of consolidation plan
2. **Implement Phase 1-3** (limit enforcement) - **7 hours**
3. **Test limit validation** thoroughly
4. **Implement Phase 4** (remove redundancy) - **1.5 hours**
5. **Implement Phase 5** (shared module) - **5.5 hours**
6. **Final testing** - **2 hours**

**Total Time:** 16 hours (2 days)

---

**Plan Created:** 2025-11-25
**Status:** ✅ **READY FOR IMPLEMENTATION**
