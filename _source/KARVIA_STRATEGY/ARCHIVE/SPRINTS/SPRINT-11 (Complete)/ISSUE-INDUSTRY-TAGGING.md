# Issue: Complete Industry Tagging for Assessment Questions

**Issue ID**: ISS-S11-001
**Created**: January 19, 2026
**Priority**: P1 (High)
**Sprint**: 11 (as part of Epic J)
**Status**: Open

---

## Problem Statement

The Assessment Question Library currently lacks proper industry tagging, making it difficult for users to:
1. Filter questions by industry (Financial Services, Cattle & Ranching, Air Products, etc.)
2. Create industry-specific assessment templates efficiently
3. Identify which questions are relevant to their business sector

### Current State (Quick Fix Applied)

- ✅ UI updated to show "Comprehensive Question Library" instead of hardcoded "Professional Services"
- ✅ Industry filter chips added (All, Air Products, Cattle, Financial Services, Core)
- ✅ Search functionality works
- ✅ Filter logic implemented using `metadata.tags`
- ✅ Air Products template created (45 questions with `air_products` tag)

### Gaps Remaining

1. **No dedicated `industry_tags` field** - Currently using `metadata.tags` (mixed with other tags)
2. **Inconsistent tagging** - Not all questions have industry tags
3. **No API filtering** - Backend doesn't support `?industry=cattle` parameter
4. **No validation** - No enum enforcement for industry values

---

## Proposed Solution (Epic J)

### 1. Model Enhancement

Add dedicated `industry_tags` field to `AssessmentQuestion` model:

```javascript
// server/models/AssessmentQuestion.js
industry_tags: {
  type: [String],
  enum: ['general', 'financial_services', 'cattle_ranching', 'air_products',
         'home_services', 'professional_services', 'healthcare', 'manufacturing'],
  default: ['general'],
  index: true
}
```

### 2. API Enhancement

Update `/api/assessment-questions` to support industry filtering:

```javascript
// GET /api/assessment-questions?industry=cattle_ranching
const { dimension, industry } = req.query;

if (industry) {
  query.industry_tags = industry;
}
```

### 3. Data Migration

- Tag existing MECE core questions as `general`
- Tag existing cattle questions as `cattle_ranching`
- Tag existing Air Products questions as `air_products`
- Review and tag any untagged questions

### 4. Frontend Enhancement

- Replace `metadata.tags` filtering with `industry_tags`
- Add "Select All for Industry" button
- Show industry badge on questions

---

## Acceptance Criteria

- [ ] AssessmentQuestion model has `industry_tags` field with enum validation
- [ ] API supports `?industry=` query parameter
- [ ] All existing questions tagged with appropriate industry
- [ ] Frontend filters work with new field
- [ ] Industry filter shows accurate question counts
- [ ] "Select All for Industry" functionality works

---

## Story Points Estimate

| Task | Points |
|------|--------|
| Model enhancement | 2 |
| API enhancement | 2 |
| Data migration script | 3 |
| Frontend update | 2 |
| Testing | 2 |
| **Total** | **11** |

---

## Related Work

- **Epic J (Sprint 11)**: Assessment Credibility - includes module system which overlaps
- **Air Products Template**: Quick fix completed (Jan 19, 2026)
- **Question Library UI**: Quick fix applied (Jan 19, 2026)

---

## Files to Modify

| File | Changes |
|------|---------|
| `server/models/AssessmentQuestion.js` | Add `industry_tags` field |
| `server/routes/assessmentQuestions.js` | Add industry filter support |
| `client/pages/assessment-question-library.html` | Update filter logic |
| `server/scripts/migrateIndustryTags.js` | NEW - Migration script |

---

## Notes

This issue can be completed as part of Epic J (Assessment Credibility) in Sprint 11, which already plans to add:
- `module_type` (core/industry/role)
- `industry_tags`
- `role_tags`

The quick fix applied today (Jan 19, 2026) provides immediate value using `metadata.tags`, allowing users to filter by industry now while the proper solution is implemented.
