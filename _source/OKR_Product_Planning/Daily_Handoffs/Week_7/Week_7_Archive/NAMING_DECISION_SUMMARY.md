# ✅ NAMING DECISION: "Company" Standard Adopted

**Date**: October 24, 2025
**Decision**: Standardize on "Company" terminology throughout KARVIA OKR
**Status**: ✅ APPROVED - Ready for Implementation

---

## 🎯 DECISION

**We will use "Company" to identify organizations/tenants** throughout the KARVIA OKR platform.

### What This Means:

| Old Term | New Term | Applies To |
|----------|----------|------------|
| Business | Company | All user-facing text |
| business_id | company_id | Database fields (keep business_id for compatibility) |
| Business.js | Company.js | Model file name |
| /api/businesses | /api/companies | API endpoints |
| "My Business" | "My Company" | UI labels |

---

## 📚 WHY "COMPANY"?

### 1. **Alignment with IAM Specification**
Week 7 IAM Block architecture specifies "Company" model:
- Multi-company support (users.companies[] array)
- Company-scoped data isolation
- Consultant multi-company access

### 2. **Industry Standard**
Most SaaS platforms use "Company" or "Organization":
- ✅ Salesforce: "Company"
- ✅ HubSpot: "Company"
- ✅ Asana: "Organization"
- ✅ Monday.com: "Account" (company)
- ❌ Very few use "Business"

### 3. **User Clarity**
"Company" is more universally understood:
- Clearer for international users
- More professional terminology
- Better matches user mental model

### 4. **Technical Clarity**
Avoids confusion with:
- "Business logic" (code)
- "Business rules" (system logic)
- "Business intelligence" (BI)

---

## 🔄 IMPLEMENTATION STRATEGY

### **Chosen Approach: Gradual Migration**

**Why Gradual?**
- ✅ No breaking changes to existing data
- ✅ Existing APIs continue to work
- ✅ Safe rollout with rollback capability
- ✅ Time to update frontend progressively

**How It Works:**
```javascript
// Models will have BOTH fields during transition
{
  business_id: ObjectId,  // LEGACY - kept for compatibility
  company_id: ObjectId,   // NEW - primary field going forward
}

// Queries will check both
const query = {
  $or: [
    { company_id: companyId },
    { business_id: companyId }  // Fallback
  ]
};
```

---

## 📋 WHAT CHANGES

### **Backend** (11 models + 13 routes)

**Models**:
- ✅ Business.js → Company.js (renamed)
- ✅ All models get company_id field (business_id kept)
- ✅ User model gets companies[] array
- ✅ Migration script syncs data

**Routes**:
- ✅ New /api/companies route (8 endpoints)
- ✅ All routes support company_id queries
- ✅ Auth route creates companies on signup
- ✅ Backward compatible with business_id

### **Frontend** (25 pages + 10 controllers)

**UI Text**:
- "Business" → "Company"
- "My Business" → "My Company"
- "Create Business" → "Create Company"
- "Business Settings" → "Company Settings"

**API Calls**:
- `/api/businesses` → `/api/companies`
- `business_id` → `company_id` in requests/responses

### **Documentation** (50+ files)

- All strategy docs updated
- All planning docs updated
- All user stories updated
- README files updated

---

## ⏰ TIMELINE

**Total Time**: 2-3 days (24 hours)

| Day | Phase | Tasks | Hours |
|-----|-------|-------|-------|
| Day 1 | Backend Models | Company.js + 9 models | 8h |
| Day 2 | API Routes | companies.js + 9 routes | 8h |
| Day 3 AM | Frontend | API calls + UI text | 4h |
| Day 3 PM | Documentation | All docs updated | 4h |

**Integration with Week 6.5**:
- Runs in parallel with Goal UI work
- Blocker 3 of 3 for Week 7
- Must complete before Week 7 IAM starts

---

## 📁 KEY DOCUMENTS

1. **[BUSINESS_TO_COMPANY_MIGRATION_PLAN.md](./BUSINESS_TO_COMPANY_MIGRATION_PLAN.md)**
   - Complete 69KB implementation plan
   - All file changes documented
   - Migration script included
   - Acceptance criteria defined

2. **[WEEK_7_PLAN.md - Blocker 3](./Daily_Handoffs/Week_7/WEEK_7_PLAN.md#blocker-3-business--company-migration)**
   - Integration with Week 7 tasks
   - 11 migration tasks listed
   - Effort estimates provided

3. **[WEEKS_1-6_COMPREHENSIVE_AUDIT.md](./WEEKS_1-6_COMPREHENSIVE_AUDIT.md)**
   - Original analysis that identified issue
   - Options A/B/C comparison
   - Recommendation for Option B

---

## ✅ ACCEPTANCE CRITERIA

### **Phase 1: Backend Models Complete**
- [ ] Company.js model created with full IAM schema
- [ ] User.js has company_id, companies[], current_company_id
- [ ] All 9 resource models have company_id field
- [ ] business_id fields maintained (not removed)
- [ ] Migration script created and tested

### **Phase 2: API Routes Complete**
- [ ] /api/companies route with 8 endpoints
- [ ] All resource routes support company_id queries
- [ ] Auth signup creates companies
- [ ] Backward compatibility verified
- [ ] All endpoints tested

### **Phase 3: Frontend Complete**
- [ ] All API calls use /api/companies
- [ ] All UI text says "Company"
- [ ] Forms use "company" terminology
- [ ] Navigation updated

### **Phase 4: Documentation Complete**
- [ ] KARVIA_STRATEGY docs updated
- [ ] Planning docs updated
- [ ] User stories updated
- [ ] Migration guide created

### **Overall Complete When**:
- [ ] All 4 phases done
- [ ] Migration script tested on staging
- [ ] No user-facing "business" references
- [ ] Backward compatibility verified
- [ ] Week 7 IAM can proceed

---

## 🚀 NEXT STEPS

### **Immediate (This Week)**
1. ✅ Review and approve this decision ← **YOU ARE HERE**
2. Assign backend engineer to migration
3. Create GitHub issue/task
4. Begin Phase 1 (Backend Models)

### **Week 6.5 (Parallel Work)**
While Goal UI is being built:
- Day 1-2: Complete migration Phases 1-2 (backend)
- Day 3: Complete migration Phases 3-4 (frontend + docs)

### **Week 7 (IAM Implementation)**
- Migration complete
- All Week 7 tasks use "Company" terminology
- No confusion during multi-company implementation

---

## 📊 IMPACT ANALYSIS

### **Files Affected**: 89 total

| Category | Count | Effort |
|----------|-------|--------|
| Backend Models | 11 | 8h |
| Backend Routes | 13 | 8h |
| Middleware | 2 | 2h |
| Frontend Pages | 25 | 2h |
| Frontend Scripts | 10 | 2h |
| Documentation | 50+ | 4h |
| **TOTAL** | **111+** | **26h** |

### **Lines of Code**: ~3,500 lines affected

| Type | Lines |
|------|-------|
| New code | ~1,200 |
| Modified code | ~2,000 |
| Documentation | ~300 |
| **TOTAL** | **~3,500** |

### **Database Impact**: Safe migration

- No data loss (dual fields)
- No downtime required
- Rollback possible
- Gradual cutover

---

## ⚠️ RISKS & MITIGATION

### **Risk 1: Breaking Existing Integrations**
**Likelihood**: Low
**Impact**: High
**Mitigation**: Keep business_id fields, maintain /api/businesses as alias

### **Risk 2: Incomplete Find-Replace**
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**: Automated search + manual code review + QA testing

### **Risk 3: Migration Script Failure**
**Likelihood**: Low
**Impact**: High
**Mitigation**: Test on database copy first, have rollback plan

### **Risk 4: User Confusion During Transition**
**Likelihood**: Low
**Impact**: Low
**Mitigation**: Update all UI in single release, no partial updates

---

## 💡 ADDITIONAL BENEFITS

Beyond solving the naming inconsistency, this migration provides:

1. **Better Multi-Tenancy**
   - Clearer separation of company contexts
   - Easier to understand company-scoped data
   - Simpler consultant multi-company access

2. **Improved Code Clarity**
   - No confusion with "business logic"
   - More intuitive variable names
   - Better aligns with industry patterns

3. **Future-Proofing**
   - Ready for enterprise features
   - Scales to multi-company scenarios
   - Aligns with IAM best practices

4. **User Experience**
   - More professional terminology
   - Matches user expectations
   - International-friendly naming

---

## 📞 STAKEHOLDER COMMUNICATION

### **Product Team**
✅ **Approved**: Use "Company" standard
✅ **Reviewed**: Migration plan
✅ **Assigned**: Engineering team

### **Engineering Team**
📋 **Action**: Implement migration (2-3 days)
📋 **Timeline**: Parallel with Week 6.5
📋 **Resources**: 1 backend engineer, 1 frontend engineer

### **QA Team**
📋 **Action**: Test migration on staging
📋 **Focus**: Backward compatibility verification
📋 **Timeline**: Day 3-4 after migration

### **Documentation Team**
📋 **Action**: Update all user-facing docs
📋 **Timeline**: Day 3 afternoon

---

## 📝 SUMMARY

**What**: Standardize on "Company" instead of "Business"
**Why**: Align with IAM spec, industry standards, user clarity
**How**: Gradual migration with backward compatibility
**When**: 2-3 days during Week 6.5
**Who**: Backend + Frontend engineers
**Where**: All models, routes, UI, docs
**Risk**: Low (backward compatible approach)

**Result**: Clean, professional, future-proof naming that aligns with Week 7 IAM implementation.

---

**Approved By**: Product Team
**Date**: October 24, 2025
**Implementation Start**: Immediate (Week 6.5)
**Status**: ✅ READY TO EXECUTE
