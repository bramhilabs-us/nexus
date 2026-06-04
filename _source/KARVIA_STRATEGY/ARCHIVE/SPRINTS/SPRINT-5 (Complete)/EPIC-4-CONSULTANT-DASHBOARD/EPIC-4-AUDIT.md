# Epic 4: Consultant Dashboard Foundation - Requirements Audit

**Epic:** Consultant Dashboard Foundation
**Sprint:** Sprint 5
**Date:** 2025-11-25
**Status:** Planned (Optional - Defer to Sprint 6 if time-constrained)
**Priority:** 🟢 LOW - Nice-to-have enhancement

---

## 📋 AUDIT SUMMARY

**Scope:** Multi-company consultant dashboard with OKR overview and quick stats

**Key Findings:**
- **Complexity:** Medium (8-10 hours)
- **Dependencies:** Epic 1 & 2 (shared components, dynamic objective cards)
- **Reuse Potential:** 60% (leverages existing APIs and components)
- **Recommendation:** ✅ **DEFER TO SPRINT 6** - Focus on Epic 1-2 first

---

## 🎯 BUSINESS REQUIREMENTS

### **User Persona: Consultant**

**Role:** CONSULTANT (highest privilege level)
**Companies Managed:** Multiple client companies (via managed_businesses array)
**Need:** Single dashboard to monitor OKR progress across all client companies

**Pain Points:**
- Currently must switch between companies to see OKR status
- No aggregated view of client progress
- Cannot quickly identify at-risk objectives across portfolio
- Time-consuming to generate client reports

### **Use Cases**

1. **UC-1: View All Companies Overview**
   - As a consultant, I want to see all my client companies in one view
   - With: Company name, total objectives, completion rate, at-risk count
   - So that: I can quickly assess portfolio health

2. **UC-2: Filter Companies by Status**
   - As a consultant, I want to filter companies by OKR status
   - With: On-track, At-risk, Behind, Completed
   - So that: I can focus on companies needing attention

3. **UC-3: Drill Down to Company Details**
   - As a consultant, I want to click on a company to view full OKR details
   - With: Navigation to existing objectives page for that company
   - So that: I can dive deep when needed

4. **UC-4: View Quick Stats**
   - As a consultant, I want to see portfolio-wide statistics
   - With: Total objectives, avg completion rate, at-risk count, total companies
   - So that: I can report to stakeholders

---

## 📊 FUNCTIONAL REQUIREMENTS

### **FR-1: Company List View**

**Display:**
- Company name and logo (if available)
- Total active objectives count
- Overall completion percentage (average of all objectives)
- At-risk objectives count (< 50% progress)
- Last updated timestamp

**Interactions:**
- Click company card → Navigate to objectives page for that company
- Hover → Show quick preview tooltip

**Sample UI:**
```
┌─────────────────────────────────────────────┐
│ [Logo] Acme Corp                            │
│                                             │
│ 4 Active Objectives  |  65% Complete       │
│ 1 At-Risk           |  Updated 2h ago      │
└─────────────────────────────────────────────┘
```

---

### **FR-2: Filter & Search**

**Filters:**
1. **Status Filter**
   - All Companies (default)
   - On Track (>= 75% avg completion)
   - At Risk (50-74% avg completion)
   - Behind (< 50% avg completion)

2. **Period Filter**
   - Current Quarter (default)
   - Current Year
   - All Periods

3. **Search**
   - Search by company name
   - Real-time filtering

---

### **FR-3: Quick Stats Dashboard**

**Metrics:**
1. **Total Companies Managed** - Count of companies in managed_businesses
2. **Total Active Objectives** - Sum across all companies
3. **Average Completion Rate** - Portfolio-wide average
4. **At-Risk Count** - Objectives < 50% progress across portfolio

**Visual Display:**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   12         │   48         │   68%        │   7          │
│ Companies    │ Objectives   │ Avg Complete │ At-Risk      │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

### **FR-4: Data Refresh**

**Behavior:**
- Auto-refresh every 5 minutes
- Manual refresh button
- Loading state during fetch
- Error handling with retry

---

## 🔧 TECHNICAL REQUIREMENTS

### **TR-1: Backend API Endpoints**

**New Endpoint Required:**

```javascript
GET /api/consultant/overview

Response:
{
  success: true,
  data: {
    portfolio_stats: {
      total_companies: 12,
      total_objectives: 48,
      average_completion: 68,
      at_risk_count: 7
    },
    companies: [
      {
        company_id: "...",
        name: "Acme Corp",
        logo_url: null,
        objectives_count: 4,
        completion_rate: 65,
        at_risk_count: 1,
        last_updated: "2025-11-25T10:30:00Z"
      },
      // ... more companies
    ]
  }
}
```

**Implementation:**
- File: `server/routes/consultant.js` (new file)
- Middleware: `requireRole('CONSULTANT')`
- Data source: Aggregate from existing Objective model
- Query: Filter by `company_id IN (managed_businesses)`

---

### **TR-2: Frontend Page**

**New File Required:**

`client/pages/consultant-dashboard.html`

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Consultant Dashboard - Karvia</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <!-- Quick Stats Section -->
    <div id="quickStats">
        <!-- 4 stat cards -->
    </div>

    <!-- Filters Section -->
    <div id="filters">
        <select id="statusFilter">...</select>
        <select id="periodFilter">...</select>
        <input type="text" id="searchInput" placeholder="Search companies...">
    </div>

    <!-- Companies Grid -->
    <div id="companiesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Company cards rendered here -->
    </div>

    <script src="/js/consultant-dashboard.js"></script>
</body>
</html>
```

---

### **TR-3: Data Aggregation Logic**

**Backend Calculation:**

```javascript
async function getConsultantOverview(consultantUserId) {
    // 1. Get managed companies from user.managed_businesses
    const consultant = await User.findById(consultantUserId);
    const companyIds = consultant.managed_businesses;

    // 2. Aggregate objectives by company
    const companies = await Promise.all(companyIds.map(async (companyId) => {
        const objectives = await Objective.find({
            company_id: companyId,
            status: 'active'
        });

        const totalObjectives = objectives.length;
        const avgCompletion = objectives.reduce((sum, obj) =>
            sum + obj.overall_progress, 0) / totalObjectives;

        const atRiskCount = objectives.filter(obj =>
            obj.overall_progress < 50).length;

        const company = await Company.findById(companyId);

        return {
            company_id: companyId,
            name: company.name,
            logo_url: company.logo_url,
            objectives_count: totalObjectives,
            completion_rate: Math.round(avgCompletion),
            at_risk_count: atRiskCount,
            last_updated: company.updatedAt
        };
    }));

    // 3. Calculate portfolio stats
    const portfolioStats = {
        total_companies: companies.length,
        total_objectives: companies.reduce((sum, c) => sum + c.objectives_count, 0),
        average_completion: Math.round(companies.reduce((sum, c) =>
            sum + c.completion_rate, 0) / companies.length),
        at_risk_count: companies.reduce((sum, c) => sum + c.at_risk_count, 0)
    };

    return { portfolio_stats: portfolioStats, companies };
}
```

---

## 🎨 UI/UX REQUIREMENTS

### **UX-1: Visual Hierarchy**

**Priority:**
1. Quick stats (most important - top)
2. Filters (contextual - below stats)
3. Companies grid (main content - scrollable)

**Design Principles:**
- **Scannable** - Key metrics at-a-glance
- **Actionable** - Clear navigation to details
- **Consistent** - Matches existing Karvia design language
- **Responsive** - Works on tablet and desktop

---

### **UX-2: Company Card Design**

**Visual States:**
- **On Track** - Green accent (completion >= 75%)
- **At Risk** - Yellow accent (completion 50-74%)
- **Behind** - Red accent (completion < 50%)

**Interaction States:**
- **Hover** - Subtle elevation, cursor pointer
- **Click** - Navigate to objectives page with company_id context
- **Loading** - Skeleton card while fetching

---

### **UX-3: Empty States**

**Scenarios:**
1. **No Companies Managed** - "No companies assigned. Contact admin."
2. **No Active Objectives** - "No active objectives across portfolio."
3. **Filter Returns Empty** - "No companies match your filters. Clear filters?"

---

## 🔄 REUSE ANALYSIS

### **Existing Components to Reuse**

1. **Navigation** (100% reuse)
   - File: `client/js/navigation.js`
   - Already handles consultant role

2. **API Client Pattern** (80% reuse)
   - File: `client/js/goals-api-client.js`
   - Pattern: Bearer token auth, error handling

3. **Objective Cards** (60% reuse from Epic 2)
   - After Epic 2: Dynamic icons, expandable KRs
   - Can reuse objective card rendering logic

4. **Company API** (100% reuse)
   - Endpoint: `GET /api/companies/:id`
   - Already fetches company data

### **New Code Required**

1. **Backend Route** - `server/routes/consultant.js` (new)
2. **Frontend Page** - `client/pages/consultant-dashboard.html` (new)
3. **Aggregation Logic** - Portfolio stats calculation (new)
4. **Filter Logic** - Status/period filtering (new)

**Code Reuse Estimate:** 60% reuse, 40% new code

---

## 📊 EFFORT ESTIMATE

### **Phase 1: Backend API (2 hours)**

1. Create `server/routes/consultant.js` (1h)
   - Implement `GET /api/consultant/overview`
   - Add RBAC middleware
   - Aggregation logic
   - Error handling

2. Register route in main server (15 min)

3. Test endpoint with Postman (45 min)

---

### **Phase 2: Frontend Dashboard (3 hours)**

1. Create dashboard HTML structure (45 min)
   - Quick stats cards
   - Filters section
   - Companies grid layout

2. Implement data fetching (1h)
   - API call to `/api/consultant/overview`
   - Render portfolio stats
   - Render company cards

3. Add filter logic (1h)
   - Status filter dropdown
   - Period filter dropdown
   - Search input
   - Real-time filtering

4. Add navigation (15 min)
   - Click company card → Redirect to objectives page
   - Add dashboard to navigation menu

---

### **Phase 3: Visual Polish (2 hours)**

1. Apply Tailwind styling (1h)
   - Color-coded status indicators
   - Hover states
   - Responsive grid

2. Add empty states (30 min)

3. Add loading states (30 min)

---

### **Phase 4: Testing (1-2 hours)**

1. Test with multiple companies (30 min)
2. Test filters and search (30 min)
3. Test navigation flow (15 min)
4. Test edge cases (15-45 min)

**Total Effort:** 8-10 hours

---

## 🚨 DEPENDENCIES & RISKS

### **Dependencies**

1. **Epic 1 (OKR Consolidation)**
   - Dashboard may link to OKR generation
   - Shared components for consistent UX

2. **Epic 2 (Objectives Enhancement)**
   - Dynamic objective cards with icons
   - Expandable KR functionality
   - Better to implement after Epic 2 complete

### **Risks**

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Performance with many companies | Medium | Medium | Pagination, lazy loading |
| Aggregation queries slow | Low | Medium | Add indexes, cache results |
| Role permission issues | Low | High | Comprehensive RBAC testing |
| Scope creep (advanced features) | High | Medium | Defer analytics to Sprint 6 |

---

## 📋 QUALITY GATES

### **QG-1: Functionality**
- ✅ All companies displayed correctly
- ✅ Stats calculated accurately
- ✅ Filters work as expected
- ✅ Navigation to objectives page works
- ✅ RBAC enforced (consultant-only)

### **QG-2: Performance**
- ✅ Page load < 2 seconds
- ✅ Filter response < 500ms
- ✅ No memory leaks
- ✅ Works with 20+ companies

### **QG-3: UX**
- ✅ Responsive design
- ✅ Clear visual hierarchy
- ✅ Helpful empty states
- ✅ Smooth interactions

### **QG-4: Code Quality**
- ✅ Error handling comprehensive
- ✅ Loading states implemented
- ✅ Clean, maintainable code
- ✅ Follows existing patterns

---

## ✅ SUCCESS CRITERIA

Epic 4 is complete when:

1. ✅ Consultant can view all managed companies in one dashboard
2. ✅ Portfolio stats displayed accurately
3. ✅ Filters work (status, period, search)
4. ✅ Company cards show correct data
5. ✅ Navigation to objectives page works
6. ✅ RBAC enforced (consultant-only access)
7. ✅ Responsive design (desktop + tablet)
8. ✅ Loading states and error handling implemented
9. ✅ All tests pass
10. ✅ No regressions

---

## 🎯 OUT OF SCOPE

**Defer to Future Sprints:**
- ❌ Advanced analytics (trends, forecasting)
- ❌ Export to PDF/Excel
- ❌ Notifications for at-risk objectives
- ❌ Drill-down charts and graphs
- ❌ Bulk operations across companies
- ❌ Consultant notes/annotations

**Reason:** Keep Epic 4 focused on foundation only. Advanced features in Sprint 6+.

---

## 💡 RECOMMENDATION

### **Defer to Sprint 6** 🟢

**Reasons:**
1. **Epic 1-2 are higher priority** - Foundation for all OKR features
2. **Epic 2 completion benefits Epic 4** - Dynamic objective cards reusable
3. **Sprint 5 already has 40 hours** - Adding Epic 4 = 48-50 hours
4. **Low business impact** - Nice-to-have, not critical for launch
5. **Consultant workaround exists** - Can switch companies manually

**Recommended Approach:**
- Complete Epic 1-2 in Sprint 5 (1 week)
- Defer Epic 4 to Sprint 6 (after consolidation stable)
- Use buffer time for Epic 1-2 polish and testing
- Revisit Epic 4 when consultant demand increases

---

## 📚 REFERENCES

**Related Documents:**
- [SPRINT-5-MASTER-PLAN.md](../SPRINT-5-MASTER-PLAN.md) - Sprint overview
- [EPIC-1-AUDIT.md](../EPIC-1-OKR-CONSOLIDATION/EPIC-1-AUDIT.md) - OKR consolidation
- [EPIC-2-AUDIT.md](../EPIC-2-OBJECTIVES-ENHANCEMENT/EPIC-2-AUDIT.md) - Objectives enhancement

**Related Files (Future):**
- `server/routes/consultant.js` - New backend API
- `client/pages/consultant-dashboard.html` - New frontend page
- `client/js/consultant-dashboard.js` - Dashboard logic

**Related Endpoints:**
- `GET /api/consultant/overview` - Multi-company overview (new)
- `GET /api/companies/:id` - Company details (existing)
- `GET /api/objectives` - Objectives list (existing)

---

**Audit Completed:** 2025-11-25
**Recommendation:** 🟢 **DEFER TO SPRINT 6**
**Next Step:** Focus on Epic 1-2 implementation, revisit Epic 4 after consolidation complete

