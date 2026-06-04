# Epic 5: Bug Fixes & Technical Debt - Implementation Spec

**Sprint**: 6
**Priority**: P0 - CRITICAL (Start First!)
**Points**: 8
**Hours**: 6h
**Status**: Ready for Implementation

---

## Overview

This epic addresses remaining bugs and technical debt. Must be completed FIRST as it unblocks Epic 1 and Epic 2.

---

## Bug 1: business-objectives.html References (P0)

### Problem
Multiple files reference `/pages/business-objectives.html` which doesn't exist. Should be `/pages/objectives.html`.

### Files to Fix

#### Fix 1: server/routes/ai-okr.js:59
**Current Code**:
```javascript
redirect: '/pages/business-objectives.html'
```

**Change To**:
```javascript
redirect: '/pages/objectives.html'
```

**Location**: Line 59

---

#### Fix 2: CLAUDE.md:220
**Current Code**:
```markdown
redirect: '/pages/business-objectives.html'
```

**Change To**:
```markdown
redirect: '/pages/objectives.html'
```

---

#### Fix 3: CLAUDE.md:304
**Current Code**:
```markdown
│   ├── business-objectives.html    # Manual objective creation
```

**Change To**:
```markdown
│   ├── objectives.html    # Objectives management (manual + AI)
```

---

#### Fix 4: docs/*.md (Optional - Low Priority)
These are documentation files only. Update if time permits:
- `docs/GOALTRACKER_MIGRATION_STRATEGY.md`
- `docs/ENHANCED_IMPLEMENTATION_CHECKLIST.md`
- `docs/MASTER_IMPLEMENTATION_GUIDE.md`

---

## Bug 2: Timeline "At Risk" for New Objectives (P1)

### Problem
New objectives immediately show "At risk" status even when just created.

### Root Cause
The `health_status` virtual in Objective model calculates based on progress vs time elapsed. New objectives have 0% progress but full time remaining, which triggers "at_risk".

### File to Fix
**File**: `server/models/Objective.js`
**Location**: Lines 315-325

**Current Code**:
```javascript
objectiveSchema.virtual('health_status').get(function() {
  const now = new Date();
  const timeRemaining = (this.end_date - now) / (1000 * 60 * 60 * 24);
  const progressRatio = this.progress_percentage / 100;
  const timeRatio = timeRemaining / ((this.end_date - this.start_date) / (1000 * 60 * 60 * 24));

  if (progressRatio >= 0.9 || this.status === 'completed') return 'excellent';
  if (progressRatio >= timeRatio * 0.8) return 'on_track';
  if (progressRatio >= timeRatio * 0.6) return 'at_risk';
  return 'critical';
});
```

**Change To**:
```javascript
objectiveSchema.virtual('health_status').get(function() {
  // New objectives (< 7 days old) are always "on_track"
  const daysSinceCreated = (new Date() - this.created_at) / (1000 * 60 * 60 * 24);
  if (daysSinceCreated < 7) return 'on_track';

  const now = new Date();
  const totalDuration = (this.end_date - this.start_date) / (1000 * 60 * 60 * 24);
  const timeElapsed = (now - this.start_date) / (1000 * 60 * 60 * 24);
  const timeElapsedRatio = Math.min(timeElapsed / totalDuration, 1);
  const progressRatio = this.progress_percentage / 100;

  if (progressRatio >= 0.9 || this.status === 'completed') return 'excellent';
  if (progressRatio >= timeElapsedRatio * 0.8) return 'on_track';
  if (progressRatio >= timeElapsedRatio * 0.5) return 'at_risk';
  return 'critical';
});
```

---

## Bug 3: Manager Dropdown Missing Team Members (P1)

### Problem
When creating/editing objectives, the manager/owner dropdown doesn't show team members.

### File to Fix
**File**: `client/pages/objectives.html`

### Investigation Needed
1. Check if dropdown population function exists
2. Verify API endpoint returns team members
3. Add team member fetching if missing

### Expected Fix Location
Search for `owner` or `manager` dropdown in objectives.html and verify it's populated from `/api/users` or `/api/teams/:id/members`.

**API to Use**: `GET /api/businesses/:id/users` (already exists in businesses.js)

---

## Bug 4: Target Year Should Be Dynamic (P2)

### Problem
Target year dropdown in create objective modal is hardcoded.

### File to Fix
**File**: `client/pages/objectives.html`
**Location**: Lines 253-258

**Current Code**:
```html
<select id="targetYear" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm">
    <option value="2024">2024</option>
    <option value="2025" selected>2025</option>
    <option value="2026">2026</option>
    <option value="2027">2027</option>
</select>
```

**Change To**:
```html
<select id="targetYear" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm">
    <!-- Populated dynamically by initTargetYearDropdown() -->
</select>
```

**Add JavaScript Function**:
```javascript
function initTargetYearDropdown() {
    const select = document.getElementById('targetYear');
    const currentYear = new Date().getFullYear();
    select.innerHTML = '';

    for (let year = currentYear; year <= currentYear + 3; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        select.appendChild(option);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', initTargetYearDropdown);
```

---

## Already Fixed (Nov 26)

These bugs were fixed earlier and should NOT be modified:

| Bug | Status | Fix Applied |
|-----|--------|-------------|
| DELETE cascade | ✅ Fixed | objectives.js - permanent delete |
| Planning page week field | ✅ Fixed | `g.week_number` → `g.week` |
| Token name inconsistency | ✅ Fixed | common.js checks `karvia_auth_token` first |
| Deleted objectives visible | ✅ Fixed | Added `status: { $ne: 'cancelled' }` filter |

---

## Implementation Checklist

### Pre-Implementation
- [ ] Read this spec completely
- [ ] Verify files exist at specified locations
- [ ] Open all files in IDE

### Bug 1: business-objectives.html
- [ ] Fix `server/routes/ai-okr.js:59`
- [ ] Fix `CLAUDE.md:220`
- [ ] Fix `CLAUDE.md:304`
- [ ] (Optional) Fix docs/*.md files

### Bug 2: Timeline Status
- [ ] Modify `server/models/Objective.js:315-325`
- [ ] Add 7-day grace period for new objectives
- [ ] Test with newly created objective

### Bug 3: Manager Dropdown
- [ ] Investigate current dropdown implementation
- [ ] Add API call to fetch users if missing
- [ ] Populate dropdown with team members

### Bug 4: Target Year
- [ ] Replace hardcoded years with dynamic generation
- [ ] Add `initTargetYearDropdown()` function
- [ ] Verify current year is selected by default

### Post-Implementation
- [ ] Test all fixed bugs
- [ ] Verify no regressions
- [ ] Update SESSION_LOG

---

## Testing Checklist

| Test | Expected Result |
|------|-----------------|
| OKR generation redirect | Goes to `/pages/objectives.html` |
| New objective health status | Shows "on_track" for 7 days |
| Create objective dropdown | Shows team members |
| Target year dropdown | Shows current year + 3 years |

---

## Dependencies

- **Blocks**: Epic 1 (OKR Fix), Epic 2 (Objectives Enhancement)
- **Blocked By**: None

---

## Success Criteria

- [ ] No 404 errors from business-objectives.html
- [ ] New objectives show "on_track" status
- [ ] Manager dropdown populated
- [ ] Target year is dynamic

---

*Spec created: November 26, 2025*
*Ready for implementation*
