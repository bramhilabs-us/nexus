# Edit Objectives Feature Plan (Revised)

**Created**: December 5, 2025
**Revised**: December 5, 2025
**Sprint**: 9 (Extension)
**Priority**: High
**Estimated Effort**: 4-6 story points (revised down from 8-12)

---

## Executive Summary

Implement a **View-first modal with Edit toggle** triggered by the existing "View Details" button. The modal opens in read-only mode, showing objective details. Users click "Edit" to enable field editing, then "Save" to persist changes.

**Key Design Decisions**:
- Reuse existing "View Details" button (no card UI changes)
- View-first approach (read-only by default, explicit edit action)
- Reuse existing `createObjectiveModal` form field patterns
- Use existing `ObjectivesAPI.updateObjective()` client method
- Copy DELETE endpoint pattern for backend (direct MongoDB)

---

## Audit Findings Summary

### Frontend Current State

| Component | Status | Location |
|-----------|--------|----------|
| Objective Cards | Rendered via `createObjectiveCard()` | [objectives.js:276-424](client/pages/scripts/objectives.js#L276-L424) |
| Edit Button | **MISSING** | Should be at lines 406-415 |
| `updateObjective()` | Placeholder only (shows toast) | [objectives.js:599](client/pages/scripts/objectives.js#L599) |
| Edit Modal | **MISSING** | Need to create or adapt create modal |
| API Client | Has unused `updateObjective(id, updates)` | [objectives-api-client.js](client/js/objectives-api-client.js) |

### Backend Current State

| Component | Status | Issue |
|-----------|--------|-------|
| `PUT /api/objectives/:id` | Proxies to Planner Engine | [objectives.js:358-380](server/routes/objectives.js#L358-L380) |
| Objective Model | Complete with key_results subdoc | [Objective.js](server/models/Objective.js) |
| Validation Services | Available for reuse | DateService, ValidationService |
| Category Config | MECE categories defined | [categories.js](server/config/categories.js) |

### Critical Gap

The current `PUT /api/objectives/:id` endpoint at [objectives.js:358-380](server/routes/objectives.js#L358-L380) proxies requests to an external Planner Engine service instead of updating MongoDB directly. This needs to be replaced with a direct MongoDB update endpoint.

---

## Feature Specification

### 1. User Story

**As a** Business Owner/Executive
**I want to** edit objectives and their key results directly from the objective card
**So that** I can refine AI-generated OKRs or manually update objectives without recreating them

### 2. Acceptance Criteria

- [ ] Edit button visible on all objective cards (Executive+ roles)
- [ ] Clicking Edit opens a modal pre-populated with current values
- [ ] Can edit: title, description, category, priority, status, time_frame
- [ ] Can edit key results: title, metric_type, target_value, current_value, unit
- [ ] Can add/remove key results within the modal
- [ ] Changes persist to MongoDB on save
- [ ] Optimistic UI update with error rollback
- [ ] Toast notification on success/failure

---

## Technical Implementation

### Phase 1: Backend - Direct MongoDB Update Endpoint

**File**: [server/routes/objectives.js](server/routes/objectives.js)

#### 1.1 New/Modified Endpoint

Replace the Planner Engine proxy with direct MongoDB update:

```javascript
/**
 * PUT /api/objectives/:id
 * Update an objective and its key results
 * Sprint 9: Direct MongoDB update (replaces Planner proxy)
 */
router.put('/:id',
  authenticateToken,
  requireRole(ROLES.CONSULTANT, ROLES.BUSINESS_OWNER, ROLES.EXECUTIVE),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Find objective and verify ownership
      const objective = await Objective.findById(id);
      if (!objective) {
        return res.status(404).json({
          success: false,
          error: 'Objective not found'
        });
      }

      // Multi-tenant isolation check
      if (objective.company_id.toString() !== req.user.company_id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      // Validate category if provided
      if (updates.category) {
        const validCategories = getCategoryIds();
        if (!validCategories.includes(updates.category)) {
          updates.category = migrateLegacyCategory(updates.category) || 'operations';
        }
      }

      // Update allowed fields
      const allowedFields = [
        'title', 'description', 'category', 'priority',
        'status', 'time_frame', 'start_date', 'end_date',
        'key_results'
      ];

      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          objective[field] = updates[field];
        }
      });

      objective.updated_at = new Date();
      await objective.save();

      // Populate for response
      const populated = await Objective.findById(objective._id)
        .populate('owner_id', 'name email role')
        .populate('created_by', 'name email');

      res.json({
        success: true,
        data: populated,
        message: 'Objective updated successfully'
      });
    } catch (error) {
      console.error('[Objectives] Update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update objective',
        message: error.message
      });
    }
  }
);
```

#### 1.2 Key Results Update Logic

Handle key_results array updates properly:

```javascript
// Within the PUT handler, before saving:
if (updates.key_results && Array.isArray(updates.key_results)) {
  // Validate each key result
  objective.key_results = updates.key_results.map((kr, index) => ({
    title: kr.title || `Key Result ${index + 1}`,
    description: kr.description || '',
    metric_type: kr.metric_type || 'number',
    target_value: kr.target_value || 0,
    current_value: kr.current_value || 0,
    unit: kr.unit || '',
    quarter: kr.quarter || objective.key_results[index]?.quarter,
    status: kr.status || 'not_started',
    owner_id: kr.owner_id || req.user._id,
    due_date: kr.due_date || null
  }));
}
```

---

### Phase 2: Frontend - Edit Button & Modal

**Files to Modify**:
- [client/pages/scripts/objectives.js](client/pages/scripts/objectives.js)
- [client/pages/objectives.html](client/pages/objectives.html)

#### 2.1 Add Edit Button to Objective Cards

Insert at [objectives.js:406-415](client/pages/scripts/objectives.js#L406-L415):

```javascript
// Add Edit button (before View Details)
const editButton = document.createElement('button');
editButton.className = 'inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors';
editButton.innerHTML = `
  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
  </svg>
  Edit
`;
editButton.onclick = () => openEditObjectiveModal(objective);
actionsContainer.appendChild(editButton);
```

#### 2.2 View/Edit Objective Modal Structure (View-First)

Add to [objectives.html](client/pages/objectives.html):

```html
<!-- View/Edit Objective Modal -->
<div id="viewObjectiveModal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center">
  <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">

    <!-- Modal Header -->
    <div class="p-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center space-x-2 mb-1">
            <h2 id="viewModalTitle" class="text-xl font-semibold text-gray-900">Objective Details</h2>
            <!-- Status Badge -->
            <span id="viewModalStatusBadge" class="px-2 py-0.5 text-xs font-medium rounded-full"></span>
            <!-- AI Generated Badge -->
            <span id="viewModalAIBadge" class="hidden px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">AI Generated</span>
          </div>
          <p id="viewModalCategory" class="text-sm text-gray-500"></p>
        </div>
        <button onclick="closeViewObjectiveModal()" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Warning Banner (shown for in-progress/completed) -->
    <div id="viewModalWarningBanner" class="hidden px-5 py-3 bg-amber-50 border-b border-amber-200">
      <p id="viewModalWarningText" class="text-sm text-amber-800"></p>
    </div>

    <!-- Modal Body -->
    <div class="p-5 space-y-5">
      <input type="hidden" id="viewObjectiveId" />
      <input type="hidden" id="viewObjectiveOriginalStatus" />

      <!-- Title (View/Edit) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" id="viewObjectiveTitle"
          class="view-field w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900"
          readonly />
      </div>

      <!-- Description (View/Edit) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="viewObjectiveDescription" rows="2"
          class="view-field w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 resize-none"
          readonly></textarea>
      </div>

      <!-- Category & Priority Row -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="viewObjectiveCategory" disabled
            class="view-field w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
            <option value="growth">📈 Growth</option>
            <option value="customer_success">🤝 Customer Success</option>
            <option value="operations">⚙️ Operations</option>
            <option value="people_culture">👥 People & Culture</option>
            <option value="innovation">💡 Innovation</option>
            <option value="financial_health">💰 Financial Health</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select id="viewObjectivePriority" disabled
            class="view-field w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <!-- Status (View/Edit) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select id="viewObjectiveStatus" disabled
          class="view-field w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <!-- Key Results Section -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-medium text-gray-900">Key Results</h3>
          <button type="button" id="addKRButton" onclick="addKeyResultField()"
            class="hidden text-sm text-purple-600 hover:text-purple-800 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Key Result
          </button>
        </div>
        <div id="viewKeyResultsContainer" class="space-y-3">
          <!-- Key results populated dynamically -->
        </div>
        <p id="noKeyResultsMsg" class="hidden text-sm text-gray-500 italic">No key results defined</p>
      </div>

      <!-- AI Rationale (if AI generated) -->
      <div id="viewAIRationaleSection" class="hidden border-t pt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">AI Rationale</label>
        <p id="viewAIRationale" class="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg"></p>
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
      <!-- Left: Edit Toggle (hidden for non-editable statuses) -->
      <div id="editToggleContainer">
        <button type="button" id="enableEditBtn" onclick="enableEditMode()"
          class="px-4 py-2 text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 text-sm font-medium flex items-center">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </button>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex items-center space-x-3">
        <button type="button" onclick="closeViewObjectiveModal()" id="closeModalBtn"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
          Close
        </button>
        <button type="button" onclick="cancelEditMode()" id="cancelEditBtn"
          class="hidden px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
          Cancel
        </button>
        <button type="button" onclick="saveObjectiveChanges()" id="saveChangesBtn"
          class="hidden px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center">
          <svg class="w-4 h-4 mr-1.5 hidden" id="saveSpinner" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>
```

**CSS Classes for View/Edit Toggle**:
```css
/* Add to existing styles or inline */
.view-field:not([readonly]):not([disabled]) {
  background-color: white;
  border-color: #d1d5db;
}
.view-field:not([readonly]):not([disabled]):focus {
  border-color: #9333ea;
  ring: 2px;
  ring-color: #9333ea;
}
```

#### 2.3 Modal JavaScript Functions (View-First with Edit Toggle)

Add to [objectives.js](client/pages/scripts/objectives.js):

```javascript
// ============================================================================
// VIEW/EDIT OBJECTIVE MODAL - View-First Approach
// ============================================================================

let currentViewingObjective = null;
let isEditMode = false;
let originalObjectiveData = null; // For detecting changes

/**
 * Open View modal with objective data (read-only by default)
 */
function openViewObjectiveModal(objective) {
  currentViewingObjective = objective;
  originalObjectiveData = JSON.parse(JSON.stringify(objective)); // Deep clone
  isEditMode = false;

  // Populate hidden fields
  document.getElementById('viewObjectiveId').value = objective._id;
  document.getElementById('viewObjectiveOriginalStatus').value = objective.status;

  // Populate display fields
  document.getElementById('viewObjectiveTitle').value = objective.title || '';
  document.getElementById('viewObjectiveDescription').value = objective.description || '';
  document.getElementById('viewObjectiveCategory').value = objective.category || 'operations';
  document.getElementById('viewObjectivePriority').value = objective.priority || 'medium';
  document.getElementById('viewObjectiveStatus').value = objective.status || 'draft';

  // Set header info
  document.getElementById('viewModalTitle').textContent = objective.title || 'Objective Details';
  updateStatusBadge(objective.status);
  updateCategoryDisplay(objective.category);

  // AI generated badge
  const aiBadge = document.getElementById('viewModalAIBadge');
  if (objective.ai_generated) {
    aiBadge.classList.remove('hidden');
    aiBadge.textContent = objective.manually_edited ? 'AI Generated (Modified)' : 'AI Generated';
  } else {
    aiBadge.classList.add('hidden');
  }

  // AI Rationale section
  const rationaleSection = document.getElementById('viewAIRationaleSection');
  if (objective.ai_rationale) {
    rationaleSection.classList.remove('hidden');
    document.getElementById('viewAIRationale').textContent = objective.ai_rationale;
  } else {
    rationaleSection.classList.add('hidden');
  }

  // Warning banner for in-progress/completed
  updateWarningBanner(objective);

  // Populate key results (read-only)
  populateKeyResultsView(objective.key_results || []);

  // Configure Edit button visibility based on status and role
  configureEditButton(objective);

  // Reset to view mode UI
  setViewMode();

  // Show modal
  document.getElementById('viewObjectiveModal').classList.remove('hidden');
}

/**
 * Update status badge styling
 */
function updateStatusBadge(status) {
  const badge = document.getElementById('viewModalStatusBadge');
  const styles = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    archived: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700'
  };
  badge.className = `px-2 py-0.5 text-xs font-medium rounded-full ${styles[status] || styles.draft}`;
  badge.textContent = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';
}

/**
 * Update category display in header
 */
function updateCategoryDisplay(category) {
  const categoryLabels = {
    growth: '📈 Growth',
    customer_success: '🤝 Customer Success',
    operations: '⚙️ Operations',
    people_culture: '👥 People & Culture',
    innovation: '💡 Innovation',
    financial_health: '💰 Financial Health'
  };
  document.getElementById('viewModalCategory').textContent = categoryLabels[category] || category;
}

/**
 * Update warning banner based on objective status
 */
function updateWarningBanner(objective) {
  const banner = document.getElementById('viewModalWarningBanner');
  const text = document.getElementById('viewModalWarningText');

  // Check if objective is in progress (has any KR with current_value > 0)
  const hasProgress = (objective.key_results || []).some(kr => (kr.current_value || 0) > 0);

  if (objective.status === 'completed') {
    banner.classList.remove('hidden');
    text.textContent = '⚠️ This objective is completed. Editing will reopen it.';
  } else if (objective.status === 'active' && hasProgress) {
    banner.classList.remove('hidden');
    text.textContent = 'ℹ️ This objective is in progress. Changes may affect team alignment.';
  } else {
    banner.classList.add('hidden');
  }
}

/**
 * Configure Edit button visibility based on status and user role
 */
function configureEditButton(objective) {
  const editContainer = document.getElementById('editToggleContainer');
  const editBtn = document.getElementById('enableEditBtn');

  // Hide edit for archived/cancelled
  if (['archived', 'cancelled'].includes(objective.status)) {
    editContainer.classList.add('hidden');
    return;
  }

  // Check user role (EXECUTIVE+)
  const user = JSON.parse(localStorage.getItem('karvia_user') || '{}');
  const canEdit = ['CONSULTANT', 'BUSINESS_OWNER', 'EXECUTIVE'].includes(user.role);

  if (canEdit) {
    editContainer.classList.remove('hidden');
    editBtn.classList.remove('hidden');
  } else {
    editContainer.classList.add('hidden');
  }
}

/**
 * Populate key results in view mode
 */
function populateKeyResultsView(keyResults) {
  const container = document.getElementById('viewKeyResultsContainer');
  const noKRMsg = document.getElementById('noKeyResultsMsg');

  container.innerHTML = '';

  if (!keyResults || keyResults.length === 0) {
    noKRMsg.classList.remove('hidden');
    return;
  }

  noKRMsg.classList.add('hidden');

  keyResults.forEach((kr, index) => {
    const progress = kr.target_value > 0 ? Math.round((kr.current_value / kr.target_value) * 100) : 0;
    const progressColor = progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : 'bg-gray-400';

    const div = document.createElement('div');
    div.className = 'kr-item bg-gray-50 p-3 rounded-lg';
    div.dataset.krIndex = index;
    div.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <span class="text-sm font-medium text-gray-900 kr-title">${escapeHtml(kr.title || '')}</span>
        <button type="button" class="kr-remove-btn hidden text-red-500 hover:text-red-700 text-xs"
          onclick="removeKeyResult(${index})">Remove</button>
      </div>
      <div class="flex items-center space-x-3 text-xs text-gray-600">
        <span class="kr-metric">${kr.metric_type || 'number'}</span>
        <span>•</span>
        <span><span class="kr-current">${kr.current_value || 0}</span> / <span class="kr-target">${kr.target_value || 0}</span></span>
        <div class="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full ${progressColor} rounded-full" style="width: ${Math.min(progress, 100)}%"></div>
        </div>
        <span>${progress}%</span>
      </div>
      <!-- Edit fields (hidden in view mode) -->
      <div class="kr-edit-fields hidden mt-3 space-y-2">
        <input type="text" class="kr-title-input w-full px-2 py-1 border border-gray-300 rounded text-sm"
          value="${escapeHtml(kr.title || '')}" placeholder="Key Result Title" />
        <div class="grid grid-cols-3 gap-2">
          <select class="kr-metric-select px-2 py-1 border border-gray-300 rounded text-sm">
            <option value="number" ${kr.metric_type === 'number' ? 'selected' : ''}>Number</option>
            <option value="percentage" ${kr.metric_type === 'percentage' ? 'selected' : ''}>Percentage</option>
            <option value="currency" ${kr.metric_type === 'currency' ? 'selected' : ''}>Currency</option>
            <option value="boolean" ${kr.metric_type === 'boolean' ? 'selected' : ''}>Yes/No</option>
          </select>
          <input type="number" class="kr-current-input px-2 py-1 border border-gray-300 rounded text-sm"
            value="${kr.current_value || 0}" placeholder="Current" />
          <input type="number" class="kr-target-input px-2 py-1 border border-gray-300 rounded text-sm"
            value="${kr.target_value || 0}" placeholder="Target" />
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

/**
 * Set UI to View mode (read-only)
 */
function setViewMode() {
  isEditMode = false;

  // Disable all view-fields
  document.querySelectorAll('.view-field').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.setAttribute('readonly', true);
      el.classList.add('bg-gray-50');
    } else if (el.tagName === 'SELECT') {
      el.setAttribute('disabled', true);
      el.classList.add('bg-gray-50');
    }
  });

  // Hide KR edit fields, show KR display
  document.querySelectorAll('.kr-item').forEach(item => {
    item.querySelector('.kr-edit-fields')?.classList.add('hidden');
    item.querySelector('.kr-remove-btn')?.classList.add('hidden');
  });

  // Toggle buttons
  document.getElementById('enableEditBtn')?.classList.remove('hidden');
  document.getElementById('addKRButton')?.classList.add('hidden');
  document.getElementById('closeModalBtn')?.classList.remove('hidden');
  document.getElementById('cancelEditBtn')?.classList.add('hidden');
  document.getElementById('saveChangesBtn')?.classList.add('hidden');
}

/**
 * Enable Edit mode
 */
function enableEditMode() {
  // Check if completed - require confirmation
  const originalStatus = document.getElementById('viewObjectiveOriginalStatus').value;
  if (originalStatus === 'completed') {
    if (!confirm('This objective is completed. Editing will reopen it. Continue?')) {
      return;
    }
  }

  isEditMode = true;

  // Enable all view-fields
  document.querySelectorAll('.view-field').forEach(el => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.removeAttribute('readonly');
      el.classList.remove('bg-gray-50');
    } else if (el.tagName === 'SELECT') {
      el.removeAttribute('disabled');
      el.classList.remove('bg-gray-50');
    }
  });

  // Show KR edit fields
  document.querySelectorAll('.kr-item').forEach(item => {
    item.querySelector('.kr-edit-fields')?.classList.remove('hidden');
    item.querySelector('.kr-remove-btn')?.classList.remove('hidden');
  });

  // Toggle buttons
  document.getElementById('enableEditBtn')?.classList.add('hidden');
  document.getElementById('addKRButton')?.classList.remove('hidden');
  document.getElementById('closeModalBtn')?.classList.add('hidden');
  document.getElementById('cancelEditBtn')?.classList.remove('hidden');
  document.getElementById('saveChangesBtn')?.classList.remove('hidden');
}

/**
 * Cancel edit mode - revert to original data
 */
function cancelEditMode() {
  if (originalObjectiveData) {
    openViewObjectiveModal(originalObjectiveData);
  } else {
    setViewMode();
  }
}

/**
 * Add new key result field (in edit mode)
 */
function addKeyResultField() {
  const container = document.getElementById('viewKeyResultsContainer');
  const index = container.children.length;

  document.getElementById('noKeyResultsMsg')?.classList.add('hidden');

  const div = document.createElement('div');
  div.className = 'kr-item bg-gray-50 p-3 rounded-lg';
  div.dataset.krIndex = index;
  div.innerHTML = `
    <div class="flex justify-between items-start mb-2">
      <span class="text-sm font-medium text-gray-500">New Key Result</span>
      <button type="button" class="kr-remove-btn text-red-500 hover:text-red-700 text-xs"
        onclick="removeKeyResult(${index})">Remove</button>
    </div>
    <div class="kr-edit-fields space-y-2">
      <input type="text" class="kr-title-input w-full px-2 py-1 border border-gray-300 rounded text-sm"
        placeholder="Key Result Title" />
      <div class="grid grid-cols-3 gap-2">
        <select class="kr-metric-select px-2 py-1 border border-gray-300 rounded text-sm">
          <option value="number">Number</option>
          <option value="percentage">Percentage</option>
          <option value="currency">Currency</option>
          <option value="boolean">Yes/No</option>
        </select>
        <input type="number" class="kr-current-input px-2 py-1 border border-gray-300 rounded text-sm"
          value="0" placeholder="Current" />
        <input type="number" class="kr-target-input px-2 py-1 border border-gray-300 rounded text-sm"
          value="0" placeholder="Target" />
      </div>
    </div>
  `;
  container.appendChild(div);
}

/**
 * Remove key result
 */
function removeKeyResult(index) {
  const container = document.getElementById('viewKeyResultsContainer');
  const item = container.querySelector(`[data-kr-index="${index}"]`);
  if (item) {
    item.remove();
  }
  // Show no KR message if empty
  if (container.children.length === 0) {
    document.getElementById('noKeyResultsMsg')?.classList.remove('hidden');
  }
}

/**
 * Save objective changes
 */
async function saveObjectiveChanges() {
  const objectiveId = document.getElementById('viewObjectiveId').value;

  // Show loading state
  const saveBtn = document.getElementById('saveChangesBtn');
  const spinner = document.getElementById('saveSpinner');
  saveBtn.disabled = true;
  spinner?.classList.remove('hidden');

  // Gather form data
  const title = document.getElementById('viewObjectiveTitle').value.trim();

  // Validate title
  if (!title) {
    showToast('Title is required', 'error');
    saveBtn.disabled = false;
    spinner?.classList.add('hidden');
    return;
  }

  // Gather key results
  const keyResults = [];
  document.querySelectorAll('#viewKeyResultsContainer .kr-item').forEach(item => {
    const titleInput = item.querySelector('.kr-title-input');
    const metricSelect = item.querySelector('.kr-metric-select');
    const currentInput = item.querySelector('.kr-current-input');
    const targetInput = item.querySelector('.kr-target-input');

    const krTitle = titleInput?.value?.trim();
    if (krTitle) {
      keyResults.push({
        title: krTitle,
        metric_type: metricSelect?.value || 'number',
        current_value: parseFloat(currentInput?.value) || 0,
        target_value: parseFloat(targetInput?.value) || 0
      });
    }
  });

  const updates = {
    title,
    description: document.getElementById('viewObjectiveDescription').value.trim(),
    category: document.getElementById('viewObjectiveCategory').value,
    priority: document.getElementById('viewObjectivePriority').value,
    status: document.getElementById('viewObjectiveStatus').value,
    key_results: keyResults,
    manually_edited: true // Flag for AI-generated objectives
  };

  try {
    // Use existing API client
    const result = await ObjectivesAPI.updateObjective(objectiveId, updates);

    if (result.success) {
      showToast('Objective updated successfully', 'success');
      closeViewObjectiveModal();
      // Refresh objectives list
      await loadObjectives();
    } else {
      showToast(result.message || 'Failed to update objective', 'error');
    }
  } catch (error) {
    console.error('Error updating objective:', error);
    showToast('Failed to update objective', 'error');
  } finally {
    saveBtn.disabled = false;
    spinner?.classList.add('hidden');
  }
}

/**
 * Close view modal
 */
function closeViewObjectiveModal() {
  document.getElementById('viewObjectiveModal').classList.add('hidden');
  currentViewingObjective = null;
  originalObjectiveData = null;
  isEditMode = false;
}

// ============================================================================
// WIRE UP: Replace viewObjectiveDetails to use new modal
// ============================================================================

/**
 * View objective details - Opens View/Edit modal
 * (Replaces placeholder implementation)
 */
function viewObjectiveDetails(objectiveId) {
  // Find objective in cached data
  const objective = window.allObjectives?.find(o => o._id === objectiveId);

  if (objective) {
    openViewObjectiveModal(objective);
  } else {
    // Fetch from API if not in cache
    ObjectivesAPI.getObjective(objectiveId).then(result => {
      if (result.success && result.data) {
        openViewObjectiveModal(result.data);
      } else {
        showToast('Failed to load objective details', 'error');
      }
    });
  }
}
```

---

### Phase 3: Validation & Corner Cases (Comprehensive)

#### 3.1 Objective Status-Based Behavior

| Status | View Mode | Edit Allowed | Behavior |
|--------|-----------|--------------|----------|
| `draft` | Read-only | Full edit | No restrictions |
| `active` (not started) | Read-only | Full edit | No restrictions |
| `active` (in progress) | Read-only | Edit with warning | Show info: "This objective is in progress" |
| `completed` | Read-only | Edit with confirmation | Confirm dialog: "Reopen completed objective?" |
| `archived` | Read-only | **No edit** | Hide Edit button, show "Archived" badge |
| `cancelled` | Read-only | **No edit** | Hide Edit button, show "Cancelled" badge |

#### 3.2 Key Results Corner Cases

| Scenario | Behavior | Implementation |
|----------|----------|----------------|
| KR has linked quarterly goals | Warning before delete | Check `Goal.countDocuments({key_result_id})` |
| KR has progress history | Allow edit, preserve history | `current_value` changes logged |
| Adding new KR | No restrictions | Append to array |
| Removing last KR | Allow (KRs optional) | Empty array allowed |
| Changing target on in-progress KR | Warning | "Target changed from X to Y" toast |
| KR title empty | Validation error | "Key result title required" |
| KR target_value <= 0 | Validation error | "Target must be positive" |
| KR current_value > target_value | Warning only | Allow (over-achievement) |

#### 3.3 Field-Level Validation

| Field | Validation | Error/Warning | Frontend/Backend |
|-------|------------|---------------|------------------|
| `title` | Required, 1-255 chars | "Title is required" | Both |
| `title` | XSS sanitization | Auto-escape | Backend |
| `description` | Optional, max 500 chars | "Description too long" | Both |
| `category` | Valid MECE value | Auto-migrate legacy | Backend |
| `priority` | Enum: high/medium/low | Default to 'medium' | Backend |
| `status` | Valid transition | See status matrix | Backend |
| `owner_id` | Exists in same company | "Owner not found" | Backend |
| `start_date` | Valid date | "Invalid date" | Backend |
| `end_date` | >= start_date | "End must be after start" | Backend |

#### 3.4 AI-Generated Objective Handling

| Condition | Behavior |
|-----------|----------|
| `ai_generated: true` + no edits yet | Show "AI Generated" badge |
| After first save with changes | Set `manually_edited: true` |
| Display after edit | Show "AI Generated (Modified)" badge |
| `ai_rationale` field | Preserve, show in view mode |

#### 3.5 Save Operation Corner Cases

| Scenario | Behavior | Implementation |
|----------|----------|----------------|
| Network failure | Keep modal open, show error | Try/catch with toast |
| Validation failure (backend) | Show field errors | Parse error response |
| Concurrent edit by another user | Last write wins (MVP) | Simple save |
| Save with no changes | No API call, close modal | Diff check before save |
| Browser refresh during edit | Lose changes | Standard behavior |
| Timeout | Show error, allow retry | 30s timeout |

#### 3.6 Role-Based Access Control

| Role | View | Edit Button | Save |
|------|------|-------------|------|
| EMPLOYEE | Yes | Hidden | N/A |
| MANAGER | Yes | Hidden | N/A |
| EXECUTIVE | Yes | Visible | Allowed |
| BUSINESS_OWNER | Yes | Visible | Allowed |
| CONSULTANT | Yes | Visible | Allowed |

#### 3.7 Status Transition Matrix

```
FROM → TO        draft    active    completed    archived    cancelled
─────────────────────────────────────────────────────────────────────
draft            -        ✓         ✓            ✓           ✓
active           ✓        -         ✓            ✓           ✓
completed        ⚠️*       ⚠️*        -            ✓           ✗
archived         ✗        ✗         ✗            -           ✗
cancelled        ✗        ✗         ✗            ✗           -

✓ = Allowed
✗ = Blocked
⚠️* = Requires confirmation ("Reopen this objective?")
```

---

## Implementation Phases (Revised - View-First Approach)

### Phase 1: Backend (1-2 story points)
- [ ] Replace PUT proxy with MongoDB direct (copy DELETE pattern)
- [ ] Add `manually_edited` field support
- [ ] Add status transition validation
- [ ] Add KR linked goals check (warning only)

### Phase 2: Frontend Modal (2-3 story points)
- [ ] Add View/Edit modal HTML (View mode default)
- [ ] Implement `openViewObjectiveModal(objective)` - read-only display
- [ ] Implement Edit toggle - enables form fields
- [ ] Implement KR display/edit section
- [ ] Add role-based Edit button visibility

### Phase 3: Wire Up & Save (1 pt)
- [ ] Change `viewObjectiveDetails()` to call `openViewObjectiveModal()`
- [ ] Implement `handleSaveObjective()` using existing API client
- [ ] Add loading/saving states
- [ ] Add confirmation dialogs for status changes

**Total: 4-6 story points**

---

## Files to Modify

| File | Changes |
|------|---------|
| [server/routes/objectives.js](server/routes/objectives.js) | Replace PUT proxy with MongoDB direct |
| [client/pages/objectives.html](client/pages/objectives.html) | Add edit modal HTML |
| [client/pages/scripts/objectives.js](client/pages/scripts/objectives.js) | Add edit button, modal functions |
| [client/js/objectives-api-client.js](client/js/objectives-api-client.js) | Verify updateObjective method |

---

## Success Metrics

- [ ] Edit button visible on all objective cards
- [ ] Modal opens with pre-populated data
- [ ] Can modify all fields including key results
- [ ] Changes persist to database
- [ ] No regression in create/delete functionality
- [ ] Proper error handling and user feedback

---

## Dependencies

- Requires authenticated user with appropriate role
- Requires valid company_id context
- Categories must use MECE values from [categories.js](server/config/categories.js)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing proxy functionality | Keep proxy as backup, add feature flag |
| Data loss on concurrent edits | Add optimistic locking with version check |
| Invalid category migration | Use `migrateLegacyCategory()` helper |
| XSS in form inputs | Use `escapeHtml()` for all output |
