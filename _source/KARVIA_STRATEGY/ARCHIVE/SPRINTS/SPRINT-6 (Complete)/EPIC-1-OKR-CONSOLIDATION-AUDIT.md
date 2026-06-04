# Epic 1: OKR Generation Consolidation - Implementation Spec

**Sprint**: 6
**Priority**: P0 - CRITICAL
**Points**: 10
**Hours**: 4.5h
**Date**: November 26, 2025
**Status**: Ready for Implementation

---

## Quick Reference: Exact Code Changes

### Change 1: ai-okr.js Lines 995-1001

**File**: `server/routes/ai-okr.js`
**Location**: Lines 995-1001 (inside generate-from-company endpoint)

**BEFORE**:
```javascript
        // Validate required data
        if (!company_id || !overall_scores) {
            return res.status(400).json({
                success: false,
                error: 'Missing required data: company_id and overall_scores are required'
            });
        }
```

**AFTER**:
```javascript
        // Validate required data - only company_id is required
        // overall_scores will be auto-fetched if not provided
        if (!company_id) {
            return res.status(400).json({
                success: false,
                error: 'Missing required data: company_id is required'
            });
        }

        // Auto-fetch SSI data if not provided (for objectives.html flow)
        let ssiData = { overall_scores, teams, by_function, weak_areas };
        if (!overall_scores) {
            logger.info(`[AI OKR Routes] No SSI data provided, auto-fetching for company ${company_id}`);
            ssiData = await fetchSSIDataForCompany(company_id);

            if (!ssiData) {
                // Fallback to company profile
                ssiData = await getCompanyProfileData(company_id);
            }

            if (!ssiData || !ssiData.overall_scores) {
                return res.status(400).json({
                    success: false,
                    error: 'No assessment data available. Complete assessments or set up company profile first.'
                });
            }
        }

        // Use ssiData for the rest of the function
        const { overall_scores: scores, teams: teamData, by_function: functionData, weak_areas: weakAreas } = ssiData;
```

### Change 2: Add Helper Functions (Top of ai-okr.js, after imports ~line 20)

**Add these functions**:
```javascript
/**
 * Fetch SSI data for a company from completed assessments
 * Sprint 6 Epic 1: Auto-fetch for objectives.html flow
 */
async function fetchSSIDataForCompany(companyId) {
    try {
        const Assessment = require('../models/Assessment');
        const Team = require('../models/Team');
        const mongoose = require('mongoose');

        // Get all teams for this company
        const teams = await Team.find({
            company_id: companyId,
            is_active: true
        });

        if (teams.length === 0) {
            return null;
        }

        // Get all team member IDs
        const allMemberIds = [];
        teams.forEach(team => {
            team.members.forEach(member => {
                if (member.status === 'active') {
                    allMemberIds.push(member.user_id);
                }
            });
        });

        const uniqueMemberIds = [...new Set(allMemberIds.map(id => id.toString()))]
            .map(id => new mongoose.Types.ObjectId(id));

        // Fetch completed assessments
        const assessments = await Assessment.find({
            company_id: companyId,
            user_id: { $in: uniqueMemberIds },
            completed_at: { $exists: true, $ne: null }
        }).populate('user_id', 'first_name last_name email role function');

        if (assessments.length === 0) {
            return null;
        }

        // Calculate overall scores
        let totalSpeed = 0, totalStrength = 0, totalIntelligence = 0;
        assessments.forEach(a => {
            totalSpeed += a.dimension_scores?.speed?.raw_score || 0;
            totalStrength += a.dimension_scores?.strength?.raw_score || 0;
            totalIntelligence += a.dimension_scores?.intelligence?.raw_score || 0;
        });

        const count = assessments.length;
        const overall_scores = {
            speed: Number((totalSpeed / count).toFixed(2)),
            strength: Number((totalStrength / count).toFixed(2)),
            intelligence: Number((totalIntelligence / count).toFixed(2))
        };

        // Identify weak areas
        const weak_areas = [];
        if (overall_scores.speed < 6.0) weak_areas.push({ dimension: 'speed', avg_score: overall_scores.speed });
        if (overall_scores.strength < 6.0) weak_areas.push({ dimension: 'strength', avg_score: overall_scores.strength });
        if (overall_scores.intelligence < 6.0) weak_areas.push({ dimension: 'intelligence', avg_score: overall_scores.intelligence });

        return {
            overall_scores,
            teams: teams.map(t => ({ team_id: t._id, team_name: t.name })),
            by_function: {},
            weak_areas
        };
    } catch (error) {
        logger.error(`[AI OKR Routes] Error fetching SSI data: ${error.message}`);
        return null;
    }
}

/**
 * Get company profile data as fallback SSI data
 * Sprint 6 Epic 1: Fallback when no assessments
 */
async function getCompanyProfileData(companyId) {
    try {
        const Company = require('../models/Company');
        const company = await Company.findById(companyId);

        if (!company || !company.assessment_scores) {
            return null;
        }

        // Convert 0-100 scores to 0-10 scale
        return {
            overall_scores: {
                speed: (company.assessment_scores.speed_score || 50) / 10,
                strength: (company.assessment_scores.strength_score || 50) / 10,
                intelligence: (company.assessment_scores.intelligence_score || 50) / 10
            },
            teams: [],
            by_function: {},
            weak_areas: []
        };
    } catch (error) {
        logger.error(`[AI OKR Routes] Error fetching company profile: ${error.message}`);
        return null;
    }
}
```

### Change 3: Update Variable Usage (Lines 1057-1060)

**BEFORE**:
```javascript
        const weakestDimensions = [];
        if (overall_scores.speed < 7.0) weakestDimensions.push({ dim: 'Speed', score: overall_scores.speed });
        if (overall_scores.strength < 7.0) weakestDimensions.push({ dim: 'Strength', score: overall_scores.strength });
        if (overall_scores.intelligence < 7.0) weakestDimensions.push({ dim: 'Intelligence', score: overall_scores.intelligence });
```

**AFTER**:
```javascript
        const weakestDimensions = [];
        if (scores.speed < 7.0) weakestDimensions.push({ dim: 'Speed', score: scores.speed });
        if (scores.strength < 7.0) weakestDimensions.push({ dim: 'Strength', score: scores.strength });
        if (scores.intelligence < 7.0) weakestDimensions.push({ dim: 'Intelligence', score: scores.intelligence });
```

---

## Executive Summary

### Current State Analysis

| Component | Status | Lines | Reusable |
|-----------|--------|-------|----------|
| Backend `generate-from-company` | Working | 362 | 95% |
| Backend limit middleware | Working | 109 | 100% |
| Shared `okr-generation-modal.js` | Working | 351 | 90% |
| `team-ssi-view.js` integration | Working | 17 lines | 100% |
| `objectives.html` integration | **BROKEN** | 87 lines | 70% |

### Root Cause of 404/400 Error

**Location**: [server/routes/ai-okr.js:996-1000](server/routes/ai-okr.js#L996-L1000)

```javascript
// PROBLEM: This requires overall_scores
if (!company_id || !overall_scores) {
    return res.status(400).json({
        success: false,
        error: 'Missing required data: company_id and overall_scores are required'
    });
}
```

**But objectives.html sends** ([objectives.html:684-696](client/pages/objectives.html#L684)):
```javascript
body: JSON.stringify({
    company_id,
    start_date: config.start_date,
    period: config.period
    // NO overall_scores - this causes the 400 error!
})
```

---

## Existing Code Inventory

### Backend Endpoints (`/server/routes/ai-okr.js`)

| Endpoint | Lines | Purpose | Reuse? |
|----------|-------|---------|--------|
| `POST /generate/:assessmentId` | 25-156 | Individual assessment | Keep |
| `GET /suggestions/:userId` | 163-233 | Get AI suggestions | Keep |
| `PUT /edit/:suggestionId/:objectiveIndex` | 240-318 | Edit suggestion | Keep |
| `POST /approve` | 325-455 | Approve suggestions | Keep |
| `DELETE /dismiss/:suggestionId/:objectiveIndex` | 462-528 | Dismiss | Keep |
| `POST /generate-from-team` | 536-709 | Team assessment (template) | **Deprecate** |
| `POST /approve-draft` | 716-840 | Approve/reject draft | Keep |
| `POST /generate-plan` | 850-972 | AI implementation plan | Keep |
| **`POST /generate-from-company`** | 979-1341 | **MAIN UNIFIED ENDPOINT** | **Enhance** |

### Frontend Files

| File | Lines | OKR Integration | Status |
|------|-------|-----------------|--------|
| `/client/js/okr-generation-modal.js` | 351 | Shared modal | Working |
| `/client/pages/scripts/team-ssi-view.js` | 1021 | Uses shared modal | Working |
| `/client/pages/objectives.html` | 726+ | Uses shared modal | **Broken** |
| `/client/js/ai-okr-api-client.js` | ~200 | Legacy API client | Unused |

---

## Code Reuse Analysis

### What Already Works (DO NOT MODIFY)

#### 1. Shared Modal (`okr-generation-modal.js`)
```javascript
// Already includes:
✅ checkLimit() - calls /api/objectives/check-limit
✅ showLimitReachedMessage() - displays limit error
✅ show() - modal with start_date, period selection
✅ formatDate() - date formatting with KarviaCommon fallback
```

#### 2. team-ssi-view.js Integration (Lines 811-827)
```javascript
// PERFECT - uses shared modal correctly
showOKRConfigModal() {
    return window.OKRGenerationModal.show({
        companyId: this.companyId,
        ssiData: {
            overall_scores: this.teamResults?.overall_scores,
            teams: this.teamResults?.teams,
            by_function: this.teamResults?.by_function,
            weak_areas: this.teamResults?.weak_areas,
            completion_stats: {...}
        }
    });
}
```

#### 3. Backend Features Already Present
```javascript
// ai-okr.js already has:
✅ start_date parameter support (line 981, 1015)
✅ period parameter support (line 981, 1027)
✅ SSI dimension mapping (lines 1057-1070)
✅ Metric type sanitization (lines 1247-1269)
✅ Company okr_generation flag update (lines 1309-1317)
✅ OpenAI integration with timeout (lines 1151-1165)
```

### What Needs Enhancement

#### 1. Backend: Make `overall_scores` Optional
**File**: [server/routes/ai-okr.js](server/routes/ai-okr.js)
**Location**: Lines 996-1000

**Change**: Auto-fetch SSI data if not provided

```javascript
// BEFORE (broken for objectives.html)
if (!company_id || !overall_scores) {
    return res.status(400).json({ error: 'Missing required data' });
}

// AFTER (auto-fetch)
if (!company_id) {
    return res.status(400).json({ error: 'company_id is required' });
}

// If overall_scores not provided, fetch from team-breakdown endpoint
let ssiData = overall_scores ? { overall_scores, teams, by_function, weak_areas } : null;
if (!ssiData) {
    ssiData = await fetchSSIDataForCompany(company_id, token);
}

// Fallback to company profile if no SSI
if (!ssiData) {
    ssiData = await getCompanyProfileData(company_id);
}
```

#### 2. Frontend: Add Duration Options to Modal
**File**: [client/js/okr-generation-modal.js](client/js/okr-generation-modal.js)

**Current Period Options** (Lines 103-140):
- Quarterly (every 3 months)
- Annual (yearly review)

**New Duration Options Needed**:
- Q1 only (3 months)
- Q1-Q2 (6 months)
- Q1-Q3 (9 months)
- Full Year (12 months)

#### 3. Frontend: Add Data Sources Selection
**File**: [client/js/okr-generation-modal.js](client/js/okr-generation-modal.js)

**Add**:
- SSI Assessment Results (auto-detect availability)
- Company Profile
- At least one must be selected

---

## Implementation Plan

### Phase 1: Backend Auto-Fetch (2 hours) - CRITICAL

**Goal**: Make `generate-from-company` work without requiring SSI data in request body

**Files to Modify**:
1. `/server/routes/ai-okr.js` - Add auto-fetch logic

**Changes**:
```javascript
// Add helper function to fetch SSI data
async function fetchSSIDataForCompany(companyId, authToken) {
    try {
        // Reuse existing team-breakdown aggregation logic
        const Assessment = require('../models/Assessment');
        const Team = require('../models/Team');
        // ... fetch and aggregate (extract from assessments.js)
        return { overall_scores, teams, by_function, weak_areas };
    } catch (error) {
        logger.warn('SSI data not available, will use company profile');
        return null;
    }
}

// Add company profile fallback
async function getCompanyProfileData(companyId) {
    const company = await Company.findById(companyId);
    if (!company || !company.assessment_scores) return null;

    // Convert company assessment_scores to SSI format
    return {
        overall_scores: {
            speed: company.assessment_scores.speed_score / 10,
            strength: company.assessment_scores.strength_score / 10,
            intelligence: company.assessment_scores.intelligence_score / 10
        },
        teams: [],
        by_function: {},
        weak_areas: []
    };
}
```

### Phase 2: Duration Dropdown Enhancement (1 hour)

**Goal**: Replace period radio buttons with duration dropdown

**File**: `/client/js/okr-generation-modal.js`

**UI Change**:
```html
<!-- Replace radio buttons with dropdown -->
<select id="okr-modal-duration">
    <option value="Q1">Q1 only (3 months)</option>
    <option value="Q1-Q2">Q1-Q2 (6 months)</option>
    <option value="Q1-Q3">Q1-Q3 (9 months)</option>
    <option value="full-year" selected>Full Year (12 months)</option>
</select>
```

**Backend mapping**:
```javascript
const durationMap = {
    'Q1': { months: 3, objectives: 1 },
    'Q1-Q2': { months: 6, objectives: 2 },
    'Q1-Q3': { months: 9, objectives: 3 },
    'full-year': { months: 12, objectives: 4 }
};
```

### Phase 3: Data Sources Selection (1 hour)

**Goal**: Let user select data sources with auto-detection

**File**: `/client/js/okr-generation-modal.js`

**Add**:
1. Check SSI availability: `GET /api/assessments/company/:id/has-data`
2. Check Company profile: Already available from company endpoint
3. Checkboxes in modal (auto-checked if available)

### Phase 4: Backend Unified Flow (30 min)

**Goal**: Single endpoint handles all data source combinations

**Logic**:
```javascript
// Determine data sources
const useSSI = data_sources?.includes('ssi') && ssiData?.overall_scores;
const useProfile = data_sources?.includes('company_profile');

if (!useSSI && !useProfile) {
    return res.status(400).json({ error: 'At least one data source required' });
}

// Merge data sources
const mergedData = {
    overall_scores: useSSI ? ssiData.overall_scores : profileData.overall_scores,
    // ... priority to SSI if both selected
};
```

---

## Code NOT to Duplicate

### Existing Functions to Reuse

| Function | Location | Purpose |
|----------|----------|---------|
| `checkObjectiveLimit()` | `validateObjectiveLimit.js:18` | Check 5-objective limit |
| `sanitizeMetricType()` | `ai-okr.js:1247` | Validate metric types |
| `KarviaCommon.formatDate()` | `common.js` | Date formatting |
| `showToast()` | `toast.js` | User notifications |

### Patterns to Follow

1. **Multi-tenant isolation**: Always filter by `company_id`
2. **Error handling**: Use logger.error + user-friendly messages
3. **Validation**: Validate dates, periods, data sources
4. **Token handling**: Use `localStorage.getItem('karvia_auth_token')`

---

## Files That Need Changes

### Must Modify (5 files)

| File | Changes | Est. Time |
|------|---------|-----------|
| `/server/routes/ai-okr.js` | Auto-fetch SSI, duration mapping | 2h |
| `/client/js/okr-generation-modal.js` | Duration dropdown, data sources | 1.5h |
| `/client/pages/objectives.html` | Pass duration/sources to API | 30m |
| `/client/pages/scripts/team-ssi-view.js` | Minor updates if needed | 15m |
| `/server/routes/assessments.js` | Add `has-data` endpoint | 30m |

### Do NOT Modify (keep as-is)

| File | Reason |
|------|--------|
| `/server/middleware/validateObjectiveLimit.js` | Working perfectly |
| `/server/models/Objective.js` | Schema is complete |
| `/server/models/Company.js` | Has all needed fields |
| `/client/js/common.js` | Shared utilities working |

---

## Testing Checklist

### After Implementation

- [ ] Generate OKR from team-ssi-view.html with SSI data
- [ ] Generate OKR from objectives.html WITHOUT SSI data (auto-fetch)
- [ ] Generate OKR from objectives.html with Company profile only
- [ ] Test all duration options (Q1, Q1-Q2, Q1-Q3, Full Year)
- [ ] Test data source selection (SSI only, Profile only, Both)
- [ ] Test limit enforcement (5 max objectives)
- [ ] Test redirect after generation (objectives.html)

---

## Risk Assessment

| Risk | Probability | Mitigation |
|------|-------------|------------|
| Breaking team-ssi-view.js | LOW | Don't touch working integration |
| SSI fetch performance | MEDIUM | Cache SSI data in session |
| OpenAI timeout | LOW | Already has 60s timeout |
| Data source conflicts | LOW | SSI takes priority when both selected |

---

## Summary

**Total New Code**: ~150 lines
**Existing Code Reused**: ~1800 lines (92%)
**Files Modified**: 5
**Files Unchanged**: 10+
**Estimated Time**: 4.5 hours

**Key Decisions**:
1. Backend auto-fetch SSI data (not frontend)
2. Duration dropdown replaces period radios
3. SSI takes priority over Company profile when both selected
4. Existing limit middleware unchanged
5. Keep old endpoints for backward compatibility

---

*Audit completed: November 26, 2025*
*Ready for implementation*
