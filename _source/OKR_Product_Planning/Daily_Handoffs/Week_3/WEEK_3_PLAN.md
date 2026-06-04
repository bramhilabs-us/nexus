# Week 3 Plan - Analytics & Insights

**Week**: Week 3 (Oct 21-25, 2025)
**Theme**: Advanced SSI Analytics & Insights
**Source**: MASTER_DEV_LIST.md (Week 3 section)
**Status**: ✅ COMPLETE (All Days 1-5 Complete)

---

## 🎯 **Overview**

**Customer Deliverable**: Advanced SSI analytics showing historical trends, comparative benchmarks, and drill-down insights

**What Customer Gets**:
1. ✅ Historical trend analysis (score changes over time)
2. ✅ Comparative benchmarking (team vs org vs industry)
3. ✅ Drill-down analytics (dimension, category, question level)
4. ✅ Export functionality (PDF reports, CSV data)
5. ✅ Manager analytics dashboard (team performance visualization)

**Business Value**:
- Shows ROI of assessment system
- Enables data-driven decisions
- Identifies improvement opportunities
- Benchmarks against peers/industry

**Payment Milestone**: $4,500 due Oct 21 (after Week 2 demo)
**Demo**: Friday Oct 25 @ 3:00 PM

---

## 📊 **Success Criteria**

**Must Have** (P0):
- [ ] Historical trend chart showing SSI scores over time
- [ ] Comparative view: Individual vs Team vs Organization
- [ ] Drill-down: Dimension → Category → Question level
- [ ] Manager dashboard showing team analytics
- [ ] Basic export (CSV at minimum)

**Should Have** (P1):
- [ ] PDF export with charts
- [ ] Industry benchmarking (if data available)
- [ ] At-risk team member identification
- [ ] Executive summary view

**Nice to Have** (P2):
- [ ] Interactive charts (drill-through)
- [ ] Custom date range selection
- [ ] Email scheduled reports
- [ ] Advanced filtering

---

## 📅 **Week 3 Task Breakdown**

**Total**: 8-10 tasks, 40 hours (5 days × 8 hours)

### **Day 1: Historical Trend API** (8 hours)

#### **DEV-W3-001: Historical Trend Analytics API** ✅
**Priority**: P0 (CRITICAL)
**Time**: 8 hours
**Owner**: Backend
**Status**: COMPLETE

**Description**: Build API endpoint to retrieve assessment scores over time for trending

**Prerequisites**:
- ✅ Assessment model has `completed_at` timestamp
- ✅ Assessment model has `ssi_scores` field (Speed/Strength/Intelligence)
- ✅ Multiple assessments exist for trending (seed if needed)

**Tasks**:
- [ ] **Design trending data structure** (1h)
  - Decide on time buckets (daily, weekly, monthly, quarterly)
  - Define response format (time series data)
  - Plan aggregation strategy

- [ ] **Create Analytics Service** (3h)
  - File: `server/services/analyticsService.js`
  - Method: `getTrendData(userId, timeRange)`
  - Method: `getTeamTrend(businessId, timeRange)`
  - Method: `getDimensionTrend(userId, dimension, timeRange)`
  - Aggregate scores by time period
  - Calculate averages, min, max, trend direction

- [ ] **Create Trend API Endpoints** (3h)
  - File: `server/routes/analytics.js` (new)
  - GET /api/analytics/trends/user/:userId
  - GET /api/analytics/trends/team/:businessId
  - GET /api/analytics/trends/dimension/:dimension
  - Query params: startDate, endDate, interval (daily/weekly/monthly)
  - Response: Array of {date, speed, strength, intelligence, overall}

- [ ] **Test with sample data** (1h)
  - Seed 10-20 assessments across time range
  - Test API endpoints
  - Verify trend calculations
  - Test edge cases (single assessment, no data)

**Deliverables**:
- `server/services/analyticsService.js` (~300 lines)
- `server/routes/analytics.js` (~200 lines)
- Trend API endpoints working

**Acceptance Criteria**:
- [ ] API returns time series data for user
- [ ] API returns team aggregated trends
- [ ] API supports date range filtering
- [ ] API handles missing data gracefully
- [ ] Response time < 500ms for 100 data points

---

### **Day 2: Comparative Benchmarking API** (8 hours)

#### **DEV-W3-002: Comparative Benchmarking Engine** ✅
**Priority**: P0 (CRITICAL)
**Time**: 8 hours
**Owner**: Backend
**Status**: COMPLETE

**Description**: Build comparison engine for Individual vs Team vs Organization benchmarking

**Prerequisites**:
- ✅ User belongs to Business (business_id field)
- ✅ Multiple users exist for comparison
- ✅ Assessment scores are consistent format

**Tasks**:
- [ ] **Design comparison structure** (1h)
  - Individual score
  - Team average (same department/team)
  - Organization average (entire business)
  - Industry average (placeholder for now)
  - Percentile calculation

- [ ] **Extend Analytics Service** (3h)
  - Method: `getComparativeData(userId, assessmentId)`
  - Method: `getTeamAverages(businessId)`
  - Method: `getOrgAverages(businessId)`
  - Method: `calculatePercentile(score, dataset)`
  - Method: `getIndustryBenchmark(industry)` (stub for now)

- [ ] **Create Comparison API Endpoints** (3h)
  - GET /api/analytics/comparison/:assessmentId
  - GET /api/analytics/benchmarks/team/:teamId
  - GET /api/analytics/benchmarks/org/:businessId
  - Response format:
    ```json
    {
      "individual": {"speed": 75, "strength": 80, "intelligence": 70},
      "team_avg": {"speed": 65, "strength": 70, "intelligence": 72},
      "org_avg": {"speed": 68, "strength": 73, "intelligence": 69},
      "percentiles": {"speed": 85, "strength": 78, "intelligence": 62}
    }
    ```

- [ ] **Test comparisons** (1h)
  - Seed users across teams
  - Test individual vs team comparison
  - Test org-wide calculations
  - Verify percentile accuracy

**Deliverables**:
- Updated `server/services/analyticsService.js` (+200 lines)
- Comparison API endpoints in `server/routes/analytics.js` (+150 lines)

**Acceptance Criteria**:
- [ ] Individual scores compared to team/org averages
- [ ] Percentiles calculated correctly
- [ ] Handles users with no team gracefully
- [ ] API response < 1s for 1000 users

---

### **Day 3: Drill-Down Analytics API** (8 hours)

#### **DEV-W3-003: Drill-Down Analytics API** ✅
**Priority**: P0 (CRITICAL)
**Time**: 8 hours
**Owner**: Backend
**Status**: COMPLETE

**Description**: Enable drill-down from Dimension → Category → Question level insights

**Prerequisites**:
- ✅ AssessmentQuestion model has `dimension`, `category` fields
- ✅ Assessment responses linked to questions
- ✅ Template has dimension/question structure

**Tasks**:
- [ ] **Design drill-down structure** (1h)
  - Level 1: Dimension (Speed, Strength, Intelligence)
  - Level 2: Category (sub-dimensions)
  - Level 3: Question (individual responses)
  - Define aggregation at each level

- [ ] **Extend Analytics Service** (4h)
  - Method: `getDimensionBreakdown(assessmentId, dimension)`
  - Method: `getCategoryScores(assessmentId, dimension)`
  - Method: `getQuestionScores(assessmentId, dimension, category)`
  - Method: `getWeakAreas(assessmentId, threshold)` (scores < X)
  - Method: `getStrongAreas(assessmentId, threshold)` (scores > X)

- [ ] **Create Drill-Down API Endpoints** (2h)
  - GET /api/analytics/drilldown/:assessmentId/dimension/:dimension
  - GET /api/analytics/drilldown/:assessmentId/category/:category
  - GET /api/analytics/drilldown/:assessmentId/questions
  - GET /api/analytics/weak-areas/:assessmentId (scores < 40)
  - GET /api/analytics/strong-areas/:assessmentId (scores > 80)

- [ ] **Test drill-down** (1h)
  - Test 3-level drill (dimension → category → question)
  - Verify score aggregations
  - Test weak/strong area identification
  - Test with partial responses

**Deliverables**:
- Updated `server/services/analyticsService.js` (+250 lines)
- Drill-down API endpoints in `server/routes/analytics.js` (+200 lines)

**Acceptance Criteria**:
- [ ] Can drill from dimension to question level
- [ ] Scores aggregated correctly at each level
- [ ] Weak/strong areas identified accurately
- [ ] API handles missing question responses

---

### **Day 4: Export Service & Manager Dashboard Backend** (8 hours)

#### **DEV-W3-004: Export Service (PDF & CSV)** ✅
**Priority**: P1 (HIGH)
**Time**: 4 hours
**Owner**: Backend
**Status**: COMPLETE

**Description**: Create export service for PDF reports and CSV data downloads

**Tasks**:
- [ ] **Design export formats** (30min)
  - CSV: Raw assessment data
  - PDF: Formatted report with charts (use library like `pdfkit` or `puppeteer`)

- [ ] **Install dependencies** (15min)
  - `npm install pdfkit` OR `npm install puppeteer`
  - `npm install json2csv`

- [ ] **Create Export Service** (2h)
  - File: `server/services/exportService.js`
  - Method: `exportToPDF(assessmentId, includeCharts)`
  - Method: `exportToCSV(assessmentId)`
  - Method: `exportTrendCSV(userId, timeRange)`
  - Generate file, return buffer or file path

- [ ] **Create Export API Endpoints** (1h)
  - GET /api/analytics/export/pdf/:assessmentId
  - GET /api/analytics/export/csv/:assessmentId
  - GET /api/analytics/export/trends/csv/:userId
  - Set proper headers (Content-Type, Content-Disposition)

- [ ] **Test exports** (15min)
  - Download PDF, verify formatting
  - Download CSV, verify data
  - Test with large datasets

**Deliverables**:
- `server/services/exportService.js` (~200 lines)
- Export endpoints in `server/routes/analytics.js` (+100 lines)

---

#### **DEV-W3-005: Manager Analytics Backend** ✅
**Priority**: P0 (CRITICAL)
**Time**: 4 hours
**Owner**: Backend
**Status**: COMPLETE (Integrated into Day 5 Dashboard)

**Description**: Backend APIs for manager dashboard (team performance, at-risk members)

**Tasks**:
- [ ] **Design manager analytics** (30min)
  - Team roster with latest scores
  - Team average by dimension
  - At-risk team members (low scores, declining trends)
  - Team progress over time

- [ ] **Extend Analytics Service** (2.5h)
  - Method: `getTeamRoster(managerId)` (managed team members)
  - Method: `getTeamPerformance(managerId)`
  - Method: `getAtRiskMembers(managerId, threshold)`
  - Method: `getTeamProgress(managerId, timeRange)`

- [ ] **Create Manager API Endpoints** (1h)
  - GET /api/analytics/manager/team-roster
  - GET /api/analytics/manager/team-performance
  - GET /api/analytics/manager/at-risk
  - GET /api/analytics/manager/team-progress

**Deliverables**:
- Updated `server/services/analyticsService.js` (+150 lines)
- Manager endpoints in `server/routes/analytics.js` (+100 lines)

---

### **Day 5: Analytics Dashboard UI** (8 hours)

#### **DEV-W3-006: Analytics Dashboard Frontend** ✅
**Priority**: P0 (CRITICAL)
**Time**: 8 hours
**Owner**: Frontend
**Status**: COMPLETE

**Description**: Build manager analytics dashboard with charts and visualizations

**Prerequisites**:
- ✅ All analytics APIs complete (Day 1-4)
- ✅ Chart library installed (`chart.js` or `d3.js`)

**Tasks**:
- [ ] **Install chart library** (15min)
  - `npm install chart.js` (simpler) OR `d3.js` (more powerful)
  - Setup in frontend

- [ ] **Create Analytics Dashboard Page** (3h)
  - File: `client/pages/analytics-dashboard.html`
  - Layout: Header, tabs (My Analytics, Team Analytics)
  - Sections:
    - Historical Trend Chart (line chart)
    - Comparative Bar Chart (individual vs team vs org)
    - Dimension Breakdown (radar/spider chart)
    - Weak/Strong Areas (tables)

- [ ] **Create Analytics API Client** (1h)
  - File: `client/js/api/analyticsAPI.js`
  - Methods matching all backend endpoints
  - Error handling and loading states

- [ ] **Implement Charts** (3h)
  - Historical Trend: Line chart (time series)
  - Comparison: Grouped bar chart
  - Dimensions: Radar chart (Speed/Strength/Intelligence)
  - Drill-down: Interactive table with expand/collapse

- [ ] **Add Export Buttons** (30min)
  - "Download PDF" button
  - "Download CSV" button
  - Trigger file downloads

- [ ] **Test Dashboard** (30min)
  - Load with real data
  - Test chart interactions
  - Test on mobile (responsive)
  - Test export functionality

**Deliverables**:
- `client/pages/analytics-dashboard.html` (~400 lines)
- `client/js/api/analyticsAPI.js` (~150 lines)
- `client/js/analytics-charts.js` (~300 lines)
- Working dashboard with 4+ chart types

**Acceptance Criteria**:
- [ ] Historical trend chart displays correctly
- [ ] Comparison chart shows individual vs team vs org
- [ ] Dimension radar chart is interactive
- [ ] Drill-down works (dimension → category → question)
- [ ] Export buttons download files
- [ ] Dashboard loads in < 2s
- [ ] Mobile responsive

---

## 📦 **Deliverables Summary**

**Backend** (Day 1-4):
- `server/services/analyticsService.js` (~900 lines total)
- `server/services/exportService.js` (~200 lines)
- `server/routes/analytics.js` (~750 lines)
- 15+ API endpoints

**Frontend** (Day 5):
- `client/pages/analytics-dashboard.html` (~400 lines)
- `client/js/api/analyticsAPI.js` (~150 lines)
- `client/js/analytics-charts.js` (~300 lines)

**Total Code**: ~2,700 lines

**Database Impact**:
- No new models (uses existing Assessment, AssessmentQuestion, User, Business)
- May need indexes on `completed_at`, `business_id` for performance

---

## ⚠️ **Dependencies & Risks**

**Dependencies**:
- ✅ Week 1: Assessment model with scores (COMPLETE)
- ✅ Week 2: Logging & error handling (COMPLETE)
- ⬜ Sample data: Need 20+ assessments for meaningful trends

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Not enough sample data | Can't demo trends | Seed 20-30 assessments before Week 3 |
| Chart library learning curve | Frontend delays | Use Chart.js (simpler than d3.js) |
| Performance with large datasets | Slow API responses | Add pagination, caching |
| Export PDF complexity | Feature cut | Start with CSV, PDF if time permits |

**Blockers**:
- None identified (all prerequisites met from Weeks 1-2)

---

## 🎯 **Links to Master Lists**

**From MASTER_DEV_LIST.md**:
- Week 3 section (lines 2236-2280)
- Original Week 2 plan (moved to Week 3)

**Related Improvements** (deferred):
- None directly related (analytics is core MVP)

**Related Issues**:
- None currently blocking

---

## 📝 **Notes**

**Scope Clarifications**:
- Industry benchmarking: Stub for now (placeholder data)
- Real industry data: Post-MVP (Beta feature)
- Advanced filtering: Nice-to-have, defer if time-constrained

**Testing Strategy**:
- Manual testing during development
- Automated tests: Defer to Week 3+ (TDD infrastructure exists)
- Focus on working demo for Oct 25

**Demo Preparation**:
- Seed realistic test data (20-30 assessments)
- Prepare demo script showing trend, comparison, drill-down
- Ensure charts render on projector/demo screen

---

**END OF WEEK 3 PLAN**
