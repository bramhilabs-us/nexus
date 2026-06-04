# KARVIA BUSINESS - CODEBASE FILE STRUCTURE & LOCATION GUIDE

## Directory Layout

```
/Users/sagarrs/Desktop/official_dev/karvia_business/
├── server/                          # Node.js Express backend
│   ├── index.js                     # Main server entry point (7KB)
│   │
│   ├── models/                      # MongoDB schemas (11 files)
│   │   ├── Assessment.js            # COMPLETE: 886 lines, scoring + responses
│   │   ├── Objective.js             # COMPLETE: 417 lines, with embedded KRs
│   │   ├── Goal.js                  # INCOMPLETE: 541 lines, MISSING 3 fields
│   │   ├── Task.js                  # COMPLETE: 676 lines, subtasks + cascade
│   │   ├── Invitation.js            # COMPLETE: 462 lines, assessment invite tracking
│   │   ├── AssessmentTemplate.js    # Question set definitions
│   │   ├── AssessmentQuestion.js    # Individual question + dimension mapping
│   │   ├── User.js                  # Auth + multi-company support
│   │   ├── Company.js               # Tenant organization root
│   │   ├── Team.js                  # Team groupings
│   │   └── AIOKRSuggestion.js       # AI-generated recommendations
│   │
│   ├── routes/                      # API route handlers (16 files)
│   │   ├── assessments.js           # Assessment endpoints, questions, submission
│   │   ├── objectives.js            # CRUD objectives, key results
│   │   ├── goals.js                 # CRUD goals, INCLUDES BROKEN breakdown
│   │   ├── tasks.js                 # CRUD tasks, subtasks, progress
│   │   ├── invitations.js           # Invitation management + linking
│   │   ├── assessmentTemplates.js   # Template CRUD
│   │   ├── assessmentQuestions.js   # Question library
│   │   ├── ai-okr.js                # AI OKR generation endpoints
│   │   ├── cascade.js               # Cascade automation endpoints
│   │   ├── analytics.js             # Analytics queries
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── companies.js             # Company management
│   │   ├── teams.js                 # Team management
│   │   └── admin.js                 # Admin operations
│   │
│   ├── services/                    # Business logic (18 files)
│   │   ├── aiOKRService.js          # GPT-4 OKR generation
│   │   ├── SSIScoringService.js     # Assessment scoring algorithm
│   │   ├── cascade-engine.js        # Auto-distribute OKRs to teams
│   │   ├── analyticsService.js      # Weak areas, trends, insights
│   │   ├── objectiveService.js      # Objective-specific logic
│   │   ├── exportService.js         # PDF/Excel reports
│   │   ├── calculatorService.js     # Math for scoring
│   │   ├── progress-tracker.js      # Track completion metrics
│   │   ├── feature-flags.js         # Feature toggle system
│   │   ├── discovery.js             # Service health checks
│   │   ├── mailjetService.js        # Email integration
│   │   ├── logger.js                # Logging system
│   │   ├── secretsManager.js        # Secure config
│   │   ├── CompanyCreationService.js# Auto-create companies
│   │   ├── iBrainService.js         # Integration service
│   │   └── ...
│   │
│   ├── middleware/                  # Express middleware (9 files)
│   │   ├── authGuards.js            # JWT auth, role checking
│   │   ├── auth.js                  # Token verification
│   │   ├── roleGuards.js            # Role-based access control
│   │   ├── errorHandler.js          # Global error handling
│   │   ├── logging.js               # HTTP request logging
│   │   ├── validate.js              # Request validation
│   │   └── ...
│   │
│   ├── config/                      # Configuration
│   │   ├── index.js                 # Main config loader
│   │   └── assessment-config.js     # Assessment settings
│   │
│   ├── database/                    # Database connection
│   │   └── index.js                 # MongoDB connection pool
│   │
│   ├── validators/                  # Input validation (4 files)
│   │   ├── user.validator.js
│   │   ├── template.validator.js
│   │   ├── business.validator.js
│   │   └── invitation.validator.js
│   │
│   ├── utils/                       # Utility functions
│   │   ├── emailValidator.js
│   │   ├── passwordValidator.js
│   │   ├── businessDefaults.js
│   │   └── errors/
│   │       ├── AppError.js
│   │       └── asyncHandler.js
│   │
│   ├── seeds/                       # Database seed scripts
│   │   ├── seedDefaultTemplates.js
│   │   └── seedAssessmentQuestions.js
│   │
│   ├── scripts/                     # One-off scripts (19 files)
│   │   ├── testAIService.js         # Test GPT-4 integration
│   │   ├── testAnalyticsService.js
│   │   ├── testAnalyticsDashboard.js
│   │   ├── testDrillDownAnalytics.js
│   │   ├── seedAnalyticsData.js
│   │   ├── seedObjectives.js
│   │   ├── createTestInvitation.js
│   │   ├── migrate-business-to-company.js
│   │   ├── cleanup-business-id-from-models.js
│   │   └── ...
│   │
│   ├── test/                        # Unit & integration tests
│   │   ├── unit/
│   │   │   └── models/
│   │   │       ├── invitation.sprint1.test.js
│   │   │       └── user.sprint1.test.js
│   │   ├── integration/
│   │   │   └── health.test.js
│   │   └── setup.js
│   │
│   └── tests/                       # Sprint-specific tests
│       ├── sprint1-model-test.js
│       ├── sprint1-day2-api-test.js
│       └── ...
│
├── client/                          # Frontend
│   ├── pages/                       # HTML pages (30+ files)
│   │   │
│   │   ├── ASSESSMENT FLOW:
│   │   ├── assessment-hub.html              # Assessment interface hub
│   │   ├── assessment-creation-flow.html    # Create assessment (3-step)
│   │   ├── assessment-step2-customize.html  # Customize questions
│   │   ├── assessment-review-launch.html    # Review & launch (STEP 3)
│   │   ├── assessment-take.html             # User takes assessment
│   │   ├── assessment-results.html          # View results + scores
│   │   ├── assessment-question-library.html # Question management
│   │   │
│   │   ├── OKR PLANNING FLOW:
│   │   ├── okr-dashboard.html               # Main OKR overview
│   │   ├── okr-creation-wizard.html         # Create objectives/KRs
│   │   ├── objectives.html                  # Objectives list
│   │   ├── business-objectives.html         # Business-wide view
│   │   ├── quarterly-goals.html             # Quarterly breakdown
│   │   ├── weekly-goals.html                # Weekly tasks view
│   │   ├── goal-details.html                # Single goal editor
│   │   ├── team-tasks.html                  # Team task view
│   │   │
│   │   ├── ANALYTICS & DASHBOARDS:
│   │   ├── analytics-dashboard.html         # Key metrics + trends
│   │   ├── executive-dashboard.html         # Executive summary
│   │   ├── team-performance-dashboard.html  # Team view
│   │   ├── team-ssi-view.html               # Team SSI scores
│   │   ├── ai-business-insights.html        # AI-generated insights
│   │   ├── ai-okr-review.html               # Review AI suggestions
│   │   │
│   │   ├── ADMIN & SETUP:
│   │   ├── login.html                       # Authentication
│   │   ├── signup.html                      # Registration
│   │   ├── teams.html                       # Team management
│   │   ├── assessment-invitations.html      # Invite management
│   │   ├── invitation-accept.html           # Accept invite flow
│   │   └── question-library.html            # Question templates
│   │
│   ├── js/                          # JavaScript client libraries
│   │   ├── assessment-api-client.js         # Assessment API wrapper
│   │   ├── ai-okr-api-client.js             # AI OKR endpoint wrapper
│   │   ├── objective-api-client.js          # Objective CRUD
│   │   ├── objectives-api-client.js         # Alternative objectives client
│   │   ├── analytics-api-client.js          # Analytics queries
│   │   ├── team-api-client.js               # Team operations
│   │   ├── auth-check.js                    # Session verification
│   │   ├── navigation.js                    # Navigation logic
│   │   ├── toast.js                         # Toast notifications
│   │   ├── assessment-flow.js               # Assessment flow control
│   │   ├── quarterly-goals.js               # Goal management
│   │   └── quarterly-goals.js
│   │
│   ├── pages/scripts/               # Page-specific logic (10+ files)
│   │   ├── okr-creation-wizard.js           # Wizard flow
│   │   ├── objective-detail.js              # Objective editor
│   │   ├── objective-calculator.js          # KR calculations
│   │   ├── analytics-dashboard.js           # Analytics charts
│   │   ├── team-performance-dashboard.js    # Team dashboard
│   │   ├── business-assessment.js           # Assessment logic
│   │   ├── objectives.js                    # Objectives list logic
│   │   ├── teams.js                         # Team list logic
│   │   ├── ai-okr-review.js                 # AI review flow
│   │   ├── team-ssi-view.js
│   │   └── executive-dashboard.js           # Executive view logic
│   │
│   ├── styles/                      # CSS & design system
│   │   └── karvia-b2b-design.css    # Main design system
│   │
│   └── assets/                      # Static assets
│       └── js/
│           └── event-tracker.js     # Analytics tracking
│
├── docs/                            # Documentation (19 files)
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── ARCHITECTURE.md
│   └── ...
│
├── package.json                     # Dependencies (Node.js)
├── jest.config.js                   # Test configuration
│
├── ANALYSIS DOCUMENTS (NEW):
├── CODEBASE_ANALYSIS_COMPREHENSIVE.md    # FULL codebase analysis
├── QUICK_START_OKR_FLOW.md              # Step-by-step user journey
├── FILE_STRUCTURE_GUIDE.md              # This file
│
├── EXISTING ANALYSIS DOCS:
├── COMPREHENSIVE_RELATIONSHIP_ANALYSIS.md
├── RELATIONSHIP_HIERARCHY_VISUAL.md
├── SPRINT2_QUICK_REFERENCE.md
├── PROJECT_STRUCTURE.md
│
└── README.md                         # Project overview
```

---

## File Organization by Purpose

### Core OKR Models
- **Assessment Model**: `/server/models/Assessment.js` (886 lines) - ✅ Complete
- **Objective Model**: `/server/models/Objective.js` (417 lines) - ✅ Complete
- **Goal Model**: `/server/models/Goal.js` (541 lines) - ⚠️ Missing parent_goal_id, child_goal_ids, time_period
- **Task Model**: `/server/models/Task.js` (676 lines) - ✅ Complete

### API Routes
- **Assessments**: `/server/routes/assessments.js` - Take assessment, submit responses
- **Objectives**: `/server/routes/objectives.js` - CRUD objectives + KRs
- **Goals**: `/server/routes/goals.js` - CRUD goals + BROKEN breakdown endpoint
- **Tasks**: `/server/routes/tasks.js` - CRUD tasks + subtasks

### Core Services
- **AI OKR Service**: `/server/services/aiOKRService.js` - GPT-4 generation
- **SSI Scoring**: `/server/services/SSIScoringService.js` - Dimension scoring
- **Cascade Engine**: `/server/services/cascade-engine.js` - Auto-distribute OKRs
- **Analytics Service**: `/server/services/analyticsService.js` - Weak areas + insights

### Frontend Pages by Workflow
```
ASSESSMENT:
  User Input       → assessment-hub.html
  Create Assessment→ assessment-creation-flow.html
  Customize        → assessment-step2-customize.html
  Review & Launch  → assessment-review-launch.html
  Take Assessment  → assessment-take.html
  View Results     → assessment-results.html

OKR PLANNING:
  Dashboard        → okr-dashboard.html
  Create OKRs      → okr-creation-wizard.html
  View Objectives  → objectives.html or business-objectives.html
  View Q Goals     → quarterly-goals.html
  View W Goals     → weekly-goals.html
  Edit Goal        → goal-details.html
  View Tasks       → team-tasks.html

ANALYTICS:
  Dashboard        → analytics-dashboard.html
  Exec View        → executive-dashboard.html
  Team View        → team-performance-dashboard.html
  SSI Scores       → team-ssi-view.html
  AI Insights      → ai-business-insights.html
  Review AI OKRs   → ai-okr-review.html
```

---

## Finding Code for Specific Features

### How to Create a New Assessment
1. **Frontend**: `/client/pages/assessment-creation-flow.html`
2. **API**: `/server/routes/assessmentTemplates.js` → POST /api/assessment-templates
3. **Model**: `/server/models/AssessmentTemplate.js`
4. **Service**: `/server/services/...` (if custom logic needed)

### How to Score an Assessment
1. **API Endpoint**: `/server/routes/assessments.js` → POST /submit
2. **Scoring Service**: `/server/services/SSIScoringService.js`
3. **Model**: `/server/models/Assessment.js` → calculateSSIScores()
4. **Database**: MongoDB Assessment collection

### How AI Generates OKRs
1. **Trigger**: User completes assessment
2. **Service**: `/server/services/aiOKRService.js` → generateOKRsFromAssessment()
3. **Analytics**: `/server/services/analyticsService.js` → getWeakAreas()
4. **AI Call**: OpenAI GPT-4 via aiOKRService
5. **Store**: `/server/models/AIOKRSuggestion.js`
6. **Frontend**: `/client/pages/ai-okr-review.html` for user review

### How to Create Goals from Objectives
1. **Frontend**: `/client/pages/okr-creation-wizard.html` (Step 2)
2. **API**: `/server/routes/goals.js` → POST /api/goals
3. **Model**: `/server/models/Goal.js`
4. **Cascade**: Post-save hook updates Objective metrics

### How Goal Breakdown Works (BROKEN)
1. **Frontend**: Should call POST /api/goals/:id/breakdown
2. **Route**: `/server/routes/goals.js` (around line 180+)
3. **Bug**: Creates 13 weekly goals but can't save parent_goal_id (field missing)
4. **Fix Needed**: Add fields to `/server/models/Goal.js`

### How to Update Task Progress
1. **Frontend**: `/client/pages/team-tasks.html`
2. **API**: `/server/routes/tasks.js` → PUT /api/tasks/:id/progress
3. **Model**: `/server/models/Task.js` → updateProgress()
4. **Cascade**: Post-save hook calls Goal.updateTaskMetrics()

---

## Critical Bug Locations

### THE GOAL MODEL BUG
**Location**: `/server/models/Goal.js`

**Problem**: 
- Routes in `/server/routes/goals.js` try to save:
  - `parent_goal_id` (for weekly goals linking to quarterly)
  - `child_goal_ids` (for quarterly storing weekly children)
  - `time_period` (to mark QUARTERLY vs WEEKLY)
- But these fields are NOT defined in the Goal schema
- MongoDB ignores undefined fields = data is lost

**Impact**:
- Weekly goal hierarchy doesn't persist
- Breakdown endpoint (POST /api/goals/:id/breakdown) doesn't work properly
- Server restart loses the weekly goal structure

**Fix Required**:
Add to Goal schema around line 50-100:
```javascript
parent_goal_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal'
},

child_goal_ids: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Goal'
}],

time_period: {
  type: String,
  enum: ['QUARTERLY', 'WEEKLY'],
  default: 'QUARTERLY'
}
```

---

## Key Configurations

### Assessment Scoring Config
**File**: `/server/config/assessment-config.js`
- Template weights
- Dimension thresholds
- Question response scales

### AI OKR Config
**File**: `/server/services/aiOKRService.js` (lines 25-35)
- Model: GPT-4
- Temperature: 0.7
- Default threshold: 40
- Output: 3-5 objectives

### Cascade Rules
**File**: `/server/services/cascade-engine.js` (lines 20-35)
- Max goals per department: 5
- Max goals per team: 3
- Category weight distribution

### Feature Flags
**File**: `/server/services/feature-flags.js`
- FEATURE_OPENAI_ENABLED
- FEATURE_ANALYTICS_ENABLED
- FEATURE_CASCADE_ENGINE_ENABLED

---

## Database Collections Diagram

```
companies (Tenant organizations)
├── users (Account holders)
│   ├── assessments (Test results)
│   │   ├── responses (Individual Q&A)
│   │   └── ai_analysis (AI insights)
│   │
│   └── objectives (Annual goals)
│       ├── key_results (Embedded)
│       ├── goals (Quarterly/Weekly)
│       │   ├── tasks (Daily actions)
│       │   │   ├── subtasks (Embedded)
│       │   │   └── checklist (Embedded)
│       │   │
│       │   └── ai_suggestions (Embedded)
│       │
│       └── ai_insights (Embedded)
│
├── invitations (Assessment invites)
│   └── assessment_id (Link to completed assessment)
│
├── assessmenttemplates (Question sets)
│   └── assessmentquestions (Individual questions)
│
├── aiokrsuggestions (AI recommendations)
│   └── objectives (Generated recommendations)
│
└── teams (Team groupings)
```

---

## Document Size Reference

### Models (LOC)
- Task: 676 lines (largest)
- Assessment: 886 lines (includes methods)
- Goal: 541 lines
- Objective: 417 lines
- Invitation: 462 lines

### Services (LOC)
- aiOKRService: ~250 lines
- SSIScoringService: ~150 lines
- cascade-engine: ~300 lines
- analyticsService: ~200 lines

### Routes (LOC)
- assessments: ~300 lines
- goals: ~400 lines
- objectives: ~250 lines
- tasks: ~300 lines

---

## Navigation Quick Links

**To understand the complete flow**: Start with `/QUICK_START_OKR_FLOW.md`

**For detailed technical analysis**: Read `/CODEBASE_ANALYSIS_COMPREHENSIVE.md`

**For model relationships**: Check `/RELATIONSHIP_HIERARCHY_VISUAL.md`

**For relationship deep-dive**: See `/COMPREHENSIVE_RELATIONSHIP_ANALYSIS.md`

**For existing sprint notes**: View `/SPRINT2_QUICK_REFERENCE.md`

---

**Last Updated**: November 12, 2025  
**Codebase Version**: 1.0.0 Pre-Production  
**Total Files Analyzed**: 50+  
**Models**: 11 (90% complete)  
**Routes**: 14 (85% complete)  
**Services**: 18 (80% complete)  
**Frontend Pages**: 30+ (70% complete)
