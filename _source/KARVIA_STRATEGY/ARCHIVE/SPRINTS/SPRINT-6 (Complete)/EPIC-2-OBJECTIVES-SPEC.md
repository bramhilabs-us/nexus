# Epic 2: Objectives Enhancement - Implementation Spec

**Sprint**: 6
**Priority**: P0 - CRITICAL
**Points**: 8
**Hours**: 3h (REVISED - was 8h)
**Status**: MOSTLY COMPLETE!

---

## CRITICAL FINDING: MOST WORK ALREADY DONE!

### What We Thought Was Needed vs What Exists

| Task | Status | Evidence |
|------|--------|----------|
| Category Icons | ✅ DONE | `category-icons.js` (161 lines) |
| KR Expandability | ✅ DONE | `objectives.js:262-314` - shows 2 KRs, toggle button exists |
| Delete Confirmation | ✅ DONE | `objectives.js:477-524` - uses confirm() with animation |
| Backend DELETE | ✅ DONE | Fixed Nov 26 with cascade |

### What Actually Needs Work

| Task | Hours | Details |
|------|-------|---------|
| Improve delete confirmation modal | 2h | Replace `confirm()` with styled modal |
| Show completed KR count in toggle | 0.5h | "Show 3 more (1 completed)" |
| Testing | 0.5h | Verify everything works |

**New Total**: 3h (was 8h) - **5h savings!**

---

## Existing Code Reference

### 1. Category Icons (COMPLETE)

**File**: [client/js/category-icons.js](client/js/category-icons.js)
**Status**: ✅ Working - No changes needed

```javascript
window.CategoryIcons = {
    categories: {
        revenue: { ... },
        operational: { ... },
        market: { ... },
        team: { ... },
        customer: { ... },
        product: { ... },
        other: { ... }
    },
    getIcon(category, size),
    getBadge(category),
    getIconBadge(category),  // Used in objectives.js:192
    getAllCategories()
}
```

**Usage in objectives.js:191-194**:
```javascript
const categoryBadge = window.CategoryIcons
    ? window.CategoryIcons.getIconBadge(objective.category || 'other')
    : '';
```

---

### 2. Key Results Expandability (COMPLETE)

**File**: [client/pages/scripts/objectives.js:262-314](client/pages/scripts/objectives.js#L262)
**Status**: ✅ Working - No changes needed

**Current Implementation**:
- Shows first 2 KRs by default
- Toggle button: "Show X more KRs"
- Hidden KRs in collapsible div
- Icon rotates on expand/collapse

**Toggle function at line 362-377**:
```javascript
function toggleKeyResults(objectiveId, hiddenCount) {
    const hiddenDiv = document.getElementById(`kr-hidden-${objectiveId}`);
    const toggleBtn = document.getElementById(`kr-toggle-${objectiveId}`);
    const toggleText = document.getElementById(`kr-toggle-text-${objectiveId}`);
    const toggleIcon = document.getElementById(`kr-toggle-icon-${objectiveId}`);

    const isHidden = hiddenDiv.classList.contains('hidden');

    if (isHidden) {
        hiddenDiv.classList.remove('hidden');
        toggleText.textContent = 'Show less';
        toggleIcon.style.transform = 'rotate(180deg)';
    } else {
        hiddenDiv.classList.add('hidden');
        toggleText.textContent = `Show ${hiddenCount} more KR${hiddenCount > 1 ? 's' : ''}`;
        toggleIcon.style.transform = 'rotate(0deg)';
    }
}
```

---

### 3. Delete Functionality (MOSTLY COMPLETE)

**File**: [client/pages/scripts/objectives.js:477-524](client/pages/scripts/objectives.js#L477)
**Status**: ✅ Working but uses basic `confirm()`

**Current Implementation**:
```javascript
async function deleteObjective(objectiveId, objectiveTitle) {
    // Uses browser confirm() dialog
    const confirmed = confirm(
        `Are you sure you want to delete this objective?\n\n"${objectiveTitle}"\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    // ... delete logic with animation
}
```

**Improvement Needed**: Replace `confirm()` with styled modal (matches app design).

---

## Task 1: Improve Delete Confirmation Modal (2h)

### Goal
Replace browser `confirm()` with a styled modal that matches the app design.

### Implementation

**Add to objectives.html** (after line 285):
```html
<!-- Delete Confirmation Modal (Sprint 6 Epic 2) -->
<div id="deleteConfirmModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl">
        <!-- Header -->
        <div class="p-5 border-b border-gray-200">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Delete Objective</h3>
                    <p class="text-sm text-gray-600">This action cannot be undone</p>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="p-5">
            <p class="text-sm text-gray-700 mb-2">You are about to delete:</p>
            <p id="deleteObjectiveTitle" class="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded-lg"></p>
            <p class="text-xs text-red-600 mt-3">
                ⚠️ All associated Key Results, Goals, and Tasks will also be deleted.
            </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <button onclick="closeDeleteConfirmModal()" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Cancel
            </button>
            <button id="confirmDeleteBtn" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                Delete Objective
            </button>
        </div>
    </div>
</div>
```

**Update objectives.js deleteObjective function**:

**Change From** (lines 477-485):
```javascript
async function deleteObjective(objectiveId, objectiveTitle) {
    const confirmed = confirm(
        `Are you sure you want to delete this objective?\n\n"${objectiveTitle}"\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
        return;
    }
```

**Change To**:
```javascript
// Store pending delete info
let pendingDeleteId = null;
let pendingDeleteTitle = null;

async function deleteObjective(objectiveId, objectiveTitle) {
    // Show styled confirmation modal
    pendingDeleteId = objectiveId;
    pendingDeleteTitle = objectiveTitle;
    document.getElementById('deleteObjectiveTitle').textContent = objectiveTitle;
    document.getElementById('deleteConfirmModal').classList.remove('hidden');
}

function closeDeleteConfirmModal() {
    document.getElementById('deleteConfirmModal').classList.add('hidden');
    pendingDeleteId = null;
    pendingDeleteTitle = null;
}

async function confirmDeleteObjective() {
    if (!pendingDeleteId) return;

    const objectiveId = pendingDeleteId;
    closeDeleteConfirmModal();
```

**Add event listener at end of file**:
```javascript
// Initialize delete confirmation button
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDeleteObjective);
});
```

---

## Task 2: Enhanced KR Toggle Text (0.5h)

### Goal
Show completion status in toggle text: "Show 3 more (1 completed)"

### Implementation

**Update objectives.js:286-293**:

**Change From**:
```javascript
// Check if there are more KRs
const hiddenCount = keyResults.length - 2;
if (hiddenCount <= 0) {
    return visibleKRs;
}
```

**Change To**:
```javascript
// Check if there are more KRs
const hiddenCount = keyResults.length - 2;
if (hiddenCount <= 0) {
    return visibleKRs;
}

// Count completed in hidden KRs
const hiddenCompleted = keyResults.slice(2).filter(kr => kr.status === 'completed').length;
const completedText = hiddenCompleted > 0 ? ` (${hiddenCompleted} completed)` : '';
```

**Update line 308**:

**Change From**:
```javascript
<span id="kr-toggle-text-${objectiveId}">Show ${hiddenCount} more KR${hiddenCount > 1 ? 's' : ''}</span>
```

**Change To**:
```javascript
<span id="kr-toggle-text-${objectiveId}">Show ${hiddenCount} more KR${hiddenCount > 1 ? 's' : ''}${completedText}</span>
```

---

## Implementation Checklist

### Pre-Implementation
- [ ] Read this spec completely
- [ ] Verify existing code works (icons, expand, delete)

### Task 1: Delete Confirmation Modal
- [ ] Add modal HTML to objectives.html
- [ ] Add `pendingDeleteId` and `pendingDeleteTitle` variables
- [ ] Update `deleteObjective()` function
- [ ] Add `closeDeleteConfirmModal()` function
- [ ] Add `confirmDeleteObjective()` function
- [ ] Add event listener for confirm button

### Task 2: KR Toggle Enhancement
- [ ] Add `hiddenCompleted` calculation
- [ ] Update toggle text to include completion count

### Testing
- [ ] Verify category icons display on all cards
- [ ] Test KR expansion with 5+ KRs
- [ ] Test delete confirmation modal (open, cancel, confirm)
- [ ] Test delete animation after confirmation
- [ ] Verify cascade delete removes KRs, Goals, Tasks

---

## Dependencies

- **Depends On**: Epic 5 (Bug Fixes) - for clean state
- **Blocks**: None

---

## Success Criteria

- [ ] Category icons display correctly (already working)
- [ ] KR toggle shows completion count
- [ ] Delete uses styled modal, not browser confirm
- [ ] Delete animation works after modal confirmation
- [ ] All associated data cascade deletes

---

*Spec created: November 26, 2025*
*Major discovery: 5h saved - most work already done!*
