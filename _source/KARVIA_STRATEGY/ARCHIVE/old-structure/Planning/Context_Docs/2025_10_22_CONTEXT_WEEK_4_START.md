# Context Restoration for Week 4 - AI OKR Generation

**Purpose**: This document helps restore full context for continuing Week 4 work without requiring the previous session history.

**Date Created**: October 18, 2025
**Current Status**: Week 3 Complete, Ready for Week 4

---

## 🎯 **Quick Context Summary**

You are working on the Karvia OKR Business application - an assessment and goal management platform. We just completed Week 3 (Analytics & Insights) and are ready to start Week 4 (AI OKR Generation).

**What Just Happened**:
- ✅ Week 3 is 100% complete (all 5 days delivered)
- ✅ Analytics & Insights platform fully functional
- ✅ 18 API endpoints tested and working
- ✅ Interactive dashboard with Chart.js visualizations
- ✅ PDF/CSV export functionality complete
- ✅ 25 sample assessments seeded for testing

**What's Next**:
- Week 4: AI OKR Generation from weak areas in assessments
- Use OpenAI to analyze weak areas and generate improvement objectives
- Create UI for reviewing/editing AI-generated OKRs

---

## 📂 **Project Structure Overview**

```
karvia_business/
├── server/
│   ├── index.js                          # Main server file (analytics routes registered)
│   ├── models/
│   │   ├── Assessment.js                 # SSI assessment data
│   │   ├── User.js                       # User data
│   │   ├── Business.js                   # Business/organization data
│   │   └── [other models]
│   ├── services/
│   │   ├── analyticsService.js           # ✅ Week 3: Core analytics (950 lines)
│   │   ├── exportService.js              # ✅ Week 3: PDF/CSV exports (346 lines)
│   │   ├── secretsManager.js             # Environment config management
│   │   └── logger.js                     # Winston logging
│   ├── routes/
│   │   ├── analytics.js                  # ✅ Week 3: 18 API endpoints (1,150 lines)
│   │   └── [other routes]
│   └── scripts/
│       ├── seedAnalyticsData.js          # ✅ Seed 25 assessments (650 lines)
│       ├── testExportService.js          # ✅ Test exports
│       └── testAnalyticsDashboard.js     # ✅ Test dashboard integration
├── client/
│   ├── pages/
│   │   ├── analytics-dashboard.html      # ✅ Week 3: Dashboard UI (350 lines)
│   │   └── scripts/
│   │       └── analytics-dashboard.js    # ✅ Dashboard logic (600 lines)
│   └── js/
│       ├── analytics-api-client.js       # ✅ Week 3: API client (320 lines)
│       ├── auth-check.js                 # Authentication
│       └── navigation.js                 # Navigation component
├── Karvia_OKR_Product_Planning/
│   └── Daily_Handoffs/
│       ├── Week_3/
│       │   ├── WEEK_3_PLAN.md            # ✅ Updated: All days complete
│       │   └── WEEK_3_HANDOFF.md         # ✅ Comprehensive handoff doc
│       └── Week_4/                       # 🎯 START HERE
│           ├── WEEK_4_PLAN.md            # To be reviewed
│           └── WEEK_4_HANDOFF.md         # To be filled during Week 4
├── .env                                  # Environment variables
└── package.json                          # Dependencies (chart.js, pdfkit, json2csv)
```

---

## 📊 **Week 3 Deliverables (Reference for Week 4)**

### **Analytics Service API Methods** (Available for Week 4)

Located in `server/services/analyticsService.js`:

```javascript
// Historical Trends
getTrendData(userId, options)              // Time series data
getTeamTrend(businessId, options)          // Team aggregates
getDimensionTrend(userId, dimension, options)

// Comparative Benchmarking
getComparativeData(userId, assessmentId)   // Individual vs team vs org
getTeamAverages(businessId)                // Team benchmarks
getOrgAverages(businessId)                 // Org benchmarks
calculatePercentiles(userId, scores, businessId)
getIndustryBenchmark(industry)

// Drill-Down Analytics (🎯 IMPORTANT FOR WEEK 4)
getDimensionBreakdown(assessmentId, dimension)  // Category-level scores
getCategoryScores(assessmentId, dimension)      // Category details
getQuestionScores(assessmentId, dimension, category)  // Question-level
getWeakAreas(assessmentId, threshold)      // 🔥 USE THIS FOR AI OKR GEN
getStrongAreas(assessmentId, threshold)    // Identify strengths
```

### **Key API Endpoints for Week 4**

```bash
# Get weak areas for AI analysis (CRITICAL FOR WEEK 4)
GET /api/analytics/ssi/weak-areas/:assessmentId?threshold=40

# Response format:
{
  "success": true,
  "data": {
    "threshold": 40,
    "total_weak_count": 5,
    "dimensions": [
      { "dimension": "speed", "score": 35, "status": "needs_attention" }
    ],
    "categories": [
      { "category": "execution", "score": 32, "dimension": "speed", "question_count": 3 }
    ],
    "questions": [
      {
        "question_text": "How quickly does your team respond to changes?",
        "score": 20,
        "dimension": "speed",
        "category": "execution"
      }
    ]
  }
}

# Get user's latest assessment comparison
GET /api/analytics/ssi/comparison/user/:userId

# Get dimension breakdown
GET /api/analytics/ssi/drilldown/:assessmentId/dimension/:dimension
```

---

## 🗄️ **Database State**

**Sample Data Available**:
- 25 completed assessments (seeded via `seedAnalyticsData.js`)
- 5 test users (David Brown, Sarah Johnson, Michael Chen, Emily Davis, Robert Wilson)
- 1 test business (Analytics Test Business)
- Date range: Q2-Q4 2025 (June-October)

**Test User for Development**:
```javascript
{
  userId: "68f443966f086224e53a5dd6",
  name: "David Brown",
  businessId: "68f443775ac25bf7e18e8a2f",
  assessments: 5,
  latestScores: {
    speed: 56,      // Low - good for testing weak area detection
    strength: 82,   // High
    intelligence: 94 // High
  }
}
```

**Run This to Get Test Data**:
```bash
# Already seeded, but to re-seed:
node server/scripts/seedAnalyticsData.js

# Test analytics endpoints:
node server/scripts/testAnalyticsDashboard.js
```

---

## 🔧 **Environment Setup**

**Required Secrets** (in `.env`):
- `MONGODB_URI` - MongoDB connection
- `JWT_SECRET` - Authentication
- `OPENAI_API_KEY` - 🎯 NEEDED FOR WEEK 4
- `SESSION_SECRET`
- `MAILJET_API_KEY`, `MAILJET_API_SECRET`

**Dependencies Installed**:
- ✅ `chart.js@4.5.1` - Frontend charts
- ✅ `json2csv@6.0.0-alpha.2` - CSV export
- ✅ `pdfkit@0.17.2` - PDF generation
- ⬜ May need OpenAI SDK for Week 4 (`openai` package)

**To Start Server**:
```bash
npm start
# Server runs on http://localhost:3000
# API available at http://localhost:3000/api/analytics
```

---

## 🎯 **Week 4 Starting Point**

### **Objective**: AI-Powered OKR Generation from Assessment Weak Areas

**What to Build**:
1. **AI Service** (`server/services/aiOKRService.js`)
   - Use `analyticsService.getWeakAreas()` to get improvement areas
   - Call OpenAI API to generate SMART objectives
   - Format: "Improve [Area] from [Current] to [Target] by [Date]"

2. **OKR Routes** (`server/routes/okr.js`)
   - POST `/api/okr/generate/:assessmentId` - Generate OKRs from weak areas
   - GET `/api/okr/suggestions/:userId` - Get AI suggestions
   - POST `/api/okr/approve` - Save approved OKRs

3. **OKR Review UI** (`client/pages/okr-review.html`)
   - Display AI-generated OKRs
   - Allow editing before approval
   - Show weak area context

### **Files to Review First**:

1. **Week 4 Plan**:
   ```bash
   Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/WEEK_4_PLAN.md
   ```

2. **Analytics Service** (understand weak area structure):
   ```bash
   server/services/analyticsService.js
   # Focus on: getWeakAreas(), getDimensionBreakdown()
   ```

3. **Existing Models**:
   ```bash
   server/models/Objective.js  # Check if exists, may need to create
   server/models/Assessment.js # Understand assessment structure
   ```

### **Key Decision Points for Week 4**:

1. **Check if Objective Model Exists**:
   - If yes: Use existing schema
   - If no: Create new Objective model with fields:
     - `user_id`, `business_id`
     - `title`, `description`
     - `source: 'ai_generated'`
     - `weak_area_reference` (link to assessment/dimension)
     - `current_score`, `target_score`
     - `status: 'draft' | 'approved' | 'active'`

2. **Verify OpenAI Integration**:
   - Check if `server/services/openaiService.js` exists
   - If not, create new service with GPT-4 integration
   - Use prompt engineering for OKR generation

3. **Decide on OKR Format**:
   - Option A: Single objective per weak dimension
   - Option B: 3-5 objectives covering all weak areas
   - Recommendation: Start with Option B (more comprehensive)

---

## 🚀 **How to Resume Context Tomorrow**

### **Step 1: Read These Files First** (in order)

```bash
# 1. This context document (you're reading it now)
CONTEXT_WEEK_4_START.md

# 2. Week 4 plan to understand scope
Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/WEEK_4_PLAN.md

# 3. Week 3 handoff for reference
Karvia_OKR_Product_Planning/Daily_Handoffs/Week_3/WEEK_3_HANDOFF.md

# 4. Analytics service to understand weak area data
server/services/analyticsService.js
# Read lines: 600-750 (getWeakAreas, getStrongAreas methods)
```

### **Step 2: Verify System State**

```bash
# Check database connection
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ DB Connected')).catch(e => console.log('❌', e.message))"

# Check test data exists
node -e "
const mongoose = require('mongoose');
const Assessment = require('./server/models/Assessment');
require('dotenv').config();
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await Assessment.countDocuments({ status: 'completed' });
  console.log(\`✅ \${count} completed assessments available\`);
  await mongoose.disconnect();
})();
"

# Verify analytics API works
node server/scripts/testAnalyticsDashboard.js | grep "✅"
```

### **Step 3: Quick Test of Weak Areas API**

```bash
# Test weak areas endpoint (core for Week 4)
node -e "
const analyticsService = require('./server/services/analyticsService');
const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // Test with David Brown's assessment (has low speed score)
  const Assessment = require('./server/models/Assessment');
  const assessment = await Assessment.findOne({
    status: 'completed',
    'ssi_scores.speed.score': { \$lt: 60 }
  });

  if (assessment) {
    console.log('Testing getWeakAreas()...');
    const weakAreas = await analyticsService.getWeakAreas(
      assessment._id.toString(),
      40
    );
    console.log('✅ Weak Areas Found:', weakAreas.total_weak_count);
    console.log('Dimensions:', weakAreas.dimensions.map(d => d.dimension));
    console.log('Categories:', weakAreas.categories.length);
    console.log('Questions:', weakAreas.questions.length);
  }

  await mongoose.disconnect();
})();
"
```

### **Step 4: Start Week 4 Work**

```bash
# Your first prompt should be:
"I'm ready to start Week 4 - AI OKR Generation. I've read:
- CONTEXT_WEEK_4_START.md
- Week 3 is complete with analytics service ready
- Weak area API tested and working

Let's begin with Day 1 of Week 4. Please:
1. Read WEEK_4_PLAN.md
2. Check if Objective model exists
3. Verify OpenAI integration
4. Propose the approach for AI OKR generation service"
```

---

## 📝 **Critical Information for Week 4**

### **Weak Area Data Structure** (from Week 3)

```javascript
// Example output from getWeakAreas(assessmentId, 40)
{
  threshold: 40,
  total_weak_count: 5,
  overall_status: "needs_attention",  // if overall < threshold

  dimensions: [
    {
      dimension: "speed",
      score: 35,
      status: "needs_attention",
      description: "Business Agility & Execution"
    }
  ],

  categories: [
    {
      category: "execution",
      dimension: "speed",
      score: 32,
      question_count: 3,
      status: "critical"
    }
  ],

  questions: [
    {
      question_id: "speed_q1",
      question_text: "How quickly does your team respond to market changes?",
      dimension: "speed",
      category: "execution",
      score: 20,
      response_value: 2,
      answered_at: "2025-06-28T..."
    }
  ]
}
```

### **Suggested OKR Generation Logic**

```javascript
// Pseudo-code for Week 4
async function generateOKRsFromWeakAreas(assessmentId) {
  // 1. Get weak areas
  const weakAreas = await analyticsService.getWeakAreas(assessmentId, 40);

  // 2. Prepare context for OpenAI
  const context = {
    weakDimensions: weakAreas.dimensions,
    weakCategories: weakAreas.categories.slice(0, 5), // Top 5
    weakQuestions: weakAreas.questions.slice(0, 10)   // Top 10
  };

  // 3. Call OpenAI with prompt
  const prompt = `
    Based on these assessment weak areas, generate 3-5 SMART objectives:

    Weak Dimensions: ${JSON.stringify(context.weakDimensions)}
    Weak Categories: ${JSON.stringify(context.weakCategories)}

    For each objective, provide:
    - Title (action-oriented)
    - Description (specific, measurable)
    - Target score improvement
    - Recommended timeline (Q1/Q2/etc)
    - Key results (2-3 measurable outcomes)
  `;

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  // 4. Parse and structure OKRs
  return parseAIResponseToOKRs(aiResponse);
}
```

### **Authentication Context**

All API routes use:
```javascript
const { authenticateToken } = require('../middleware/authGuards');
router.use(authenticateToken); // Already applied to analytics routes
```

User object available in `req.user`:
```javascript
{
  id: "user_id",
  business_id: "business_id",
  role: "EMPLOYEE" | "MANAGER" | "BUSINESS_OWNER",
  email: "user@example.com"
}
```

---

## 🎯 **Success Criteria for Week 4** (Preview)

By end of Week 4, you should have:
- ✅ AI service that generates OKRs from weak areas
- ✅ API endpoints for OKR generation and approval
- ✅ UI for reviewing/editing AI-generated OKRs
- ✅ OKRs stored in database with proper attribution
- ✅ Integration with existing analytics service

**Week 4 Demo Flow**:
1. User completes assessment
2. System identifies weak areas (using Week 3 analytics)
3. AI generates improvement objectives
4. User reviews and approves OKRs
5. OKRs are saved and tracked

---

## 📚 **Additional Resources**

**Documentation Locations**:
- Master Dev List: `Karvia_OKR_Product_Planning/MASTER_DEV_LIST.md`
- Week 3 Plan: `Karvia_OKR_Product_Planning/Daily_Handoffs/Week_3/WEEK_3_PLAN.md`
- Week 3 Handoff: `Karvia_OKR_Product_Planning/Daily_Handoffs/Week_3/WEEK_3_HANDOFF.md`
- Week 4 Plan: `Karvia_OKR_Product_Planning/Daily_Handoffs/Week_4/WEEK_4_PLAN.md`

**Useful Commands**:
```bash
# Start server
npm start

# Run tests
node server/scripts/testAnalyticsDashboard.js
node server/scripts/testExportService.js

# Access dashboard
open http://localhost:3000/client/pages/analytics-dashboard.html

# Check logs
tail -f logs/combined.log
```

---

## ✅ **Final Audit Results** (Week 3)

**All Deliverables Verified**:
- ✅ 18 API endpoints registered and working
- ✅ All test scripts passing
- ✅ Dependencies installed (chart.js, pdfkit, json2csv)
- ✅ Sample data seeded (25 assessments)
- ✅ Export files generated successfully
- ✅ Dashboard integration tested
- ✅ Documentation complete (WEEK_3_PLAN.md, WEEK_3_HANDOFF.md)

**No Blockers for Week 4**:
- ✅ Analytics service provides weak area data
- ✅ Assessment model has all required fields
- ✅ Authentication middleware in place
- ⬜ Need to verify OpenAI integration (check Week 0 setup)

---

**🚀 You are ready to start Week 4 - AI OKR Generation!**

**First Action Tomorrow**:
```
Read this file → Read WEEK_4_PLAN.md → Verify OpenAI setup → Start Day 1
```

**END OF CONTEXT RESTORATION DOCUMENT**
